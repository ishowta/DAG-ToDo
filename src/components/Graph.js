import React, {Component} from 'react'
import PropTypes from 'prop-types'
import GraphView from 'react-digraph'
import GraphConfig from './graph-config.js'

const NODE_KEY = "id"

const NORMAL_TYPE = "normal";
const ACTIVE_TYPE = "active";
const DONE_TYPE = "done";
const NORMAL_EDGE_TYPE = "normalEdge";

export class Graph extends Component {
  constructor(props) {
    super(props)
    this.state = {
      graph: this.constructTodosGraph(this.props.todos),
    }
  }

  componentWillReceiveProps(newProps){
    this.setState({
      graph: this.constructTodosGraph(newProps.todos)
    })
  }

  // Helper to find the index of a given node
  getNodeIndex(searchNode) {
    return this.state.graph.nodes.findIndex((node) => {
      return node[NODE_KEY] === searchNode[NODE_KEY]
    })
  }

  // Helper to find the index of a given edge
  getEdgeIndex(searchEdge) {
    return this.state.graph.edges.findIndex((edge) => {
      return edge.source === searchEdge.source &&
        edge.target === searchEdge.target
    })
  }

  constructTodosGraph = (todos) => {
    var todos = todos
    const edges = (() => {
      var edges = []
      todos.forEach((todo)=>{
        edges.push(...todo.depends_on.map((id)=>{
          return {
            source: id,
            target: todo.id,
            type: NORMAL_EDGE_TYPE
          }
        }))
      })
      return edges
    })()
    var targets_list = todos.map(()=>[])
    var depth_list = todos.map(()=>0)
    edges.forEach(edge => {
      targets_list[edge.source].push(edge.target)
    })
    const updateDepth = (s, t) => {
      if(depth_list[s] >= depth_list[t]){
        depth_list[t] = depth_list[s] + 1
        targets_list[t].forEach(t_target => {
          updateDepth(t, t_target)
        })
      }
    }
    targets_list.forEach((targets,i) => {
      targets.forEach(target => {
        updateDepth(i, target)
      })
    })
    var nth_list = new Array(Math.max(...depth_list, 0)+1)
    nth_list.fill(0)
    var node_nth = depth_list.map(d=>{
      nth_list[d] += 1
      return nth_list[d] - 1
    })
    var active_list = todos.map(()=>false)
    var cnt = 0
    const searchActiveNode = (i) => {
      cnt += 1
      if(cnt>10) return
      if(todos[i].completed === false){
        active_list[i] = true
      }else{
        targets_list[i].forEach(target => {
          searchActiveNode(target)
        })
      }
    }
    depth_list.forEach((depth, i)=>{
      if(depth === 0) searchActiveNode(i)
    })
    const nodes = todos.map((todo, i)=>{
      return {
        "id": todo.id,
        "title": todo.text,
        "x": node_nth[i] * 200,
        "y": depth_list[i] * 200,
        "type": todo.completed ? DONE_TYPE : active_list[i] ? ACTIVE_TYPE : NORMAL_TYPE
      }
    })
    return {"nodes": nodes, "edges": edges}
  }

  // Given a nodeKey, return the corresponding node
  getViewNode = nodeKey => {
    const searchNode = {};
    searchNode[NODE_KEY] = nodeKey;
    const i = this.getNodeIndex(searchNode);
    return this.state.graph.nodes[i]
  }

  /*
   * Handlers/Interaction
   */

  // Called by 'drag' handler, etc..
  // to sync updates from D3 with the graph
  onUpdateNode = viewNode => {
  }

  // Node 'mouseUp' handler
  onSelectNode = viewNode => {
  }

  // Edge 'mouseUp' handler
  onSelectEdge = viewEdge => {
    this.setState({ selected: viewEdge });
  }

  // Updates the graph with a new node
  onCreateNode = (x, y) => {
  }

  // Deletes a node from the graph
  onDeleteNode = viewNode => {
    const graph = this.state.graph;
    const i = this.getNodeIndex(viewNode);
    graph.nodes.splice(i, 1);

    // Delete any connected edges
    const newEdges = graph.edges.filter((edge, i) => {
      return edge.source !== viewNode[NODE_KEY] &&
        edge.target !== viewNode[NODE_KEY]
    })

    graph.edges = newEdges;

    this.setState({ graph: graph, selected: {} });
  }

  // Creates a new node between two edges
  onCreateEdge = (sourceViewNode, targetViewNode) => {
    const graph = this.state.graph;

    const viewEdge = {
      source: sourceViewNode[NODE_KEY],
      target: targetViewNode[NODE_KEY],
      type: NORMAL_EDGE_TYPE
    }

    // Only add the edge when the source node is not the same as the target
    if (viewEdge.source !== viewEdge.target) {
      graph.edges.push(viewEdge);
      this.props.addDependence({
        from_id: viewEdge.target,
        to_id: viewEdge.source
      })
      //this.setState({ graph: graph });
    }
  }

  // Called when an edge is reattached to a different target.
  onSwapEdge = (sourceViewNode, targetViewNode, viewEdge) => {
    const graph = this.state.graph;
    const i = this.getEdgeIndex(viewEdge);
    const edge = JSON.parse(JSON.stringify(graph.edges[i]));

    edge.source = sourceViewNode[NODE_KEY];
    edge.target = targetViewNode[NODE_KEY];
    graph.edges[i] = edge;

    this.setState({ graph: graph });
  }

  // Called when an edge is deleted
  onDeleteEdge = viewEdge => {
    const graph = this.state.graph;
    const i = this.getEdgeIndex(viewEdge);
    graph.edges.splice(i, 1);
    this.setState({ graph: graph, selected: {} });
  }

  render() {
    return (
      <div id='graph' style={{...styles.graph, height: window.innerHeight}}>
        <GraphView
          ref={(el) => this.GraphView = el}
          nodeKey={NODE_KEY}
          nodes={this.state.graph.nodes}
          edges={this.state.graph.edges}
          selected={[]}
          nodeTypes={GraphConfig.NodeTypes}
          nodeSubtypes={GraphConfig.NodeSubtypes}
          edgeTypes={GraphConfig.EdgeTypes}
          enableFocus={false}
          getViewNode={this.getViewNode}
          onSelectNode={this.onSelectNode}
          onCreateNode={this.onCreateNode}
          onUpdateNode={this.onUpdateNode}
          onDeleteNode={this.onDeleteNode}
          onSelectEdge={this.onSelectEdge}
          onCreateEdge={this.onCreateEdge}
          onSwapEdge={this.onSwapEdge}
          onDeleteEdge={this.onDeleteEdge} />
      </div>
    );
  }
}

const styles = {
  graph: {
    width: '100%'
  }
};

Graph.propTypes = {
  todos: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    completed: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired
  }).isRequired).isRequired,
  addDependence: PropTypes.func.isRequired,
}

export default Graph
