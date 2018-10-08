import React, {Component} from 'react'
import PropTypes from 'prop-types'
import GraphView from 'react-digraph'
import GraphConfig from './graph-config.js' // Configures node/edge types

const styles = {
  graph: {
    width: '100%'
  }
};

const NODE_KEY = "id" // Key used to identify nodes

// These keys are arbitrary (but must match the config)
// However, GraphView renders text differently for empty types
// so this has to be passed in if that behavior is desired.
const NORMAL_TYPE = "normal";
const ACTIVE_TYPE = "active";
const DONE_TYPE = "done";
const EMPTY_TYPE = "empty"; // Empty node type
const SPECIAL_TYPE = "special";
const SPECIAL_CHILD_SUBTYPE = "specialChild";
const EMPTY_EDGE_TYPE = "emptyEdge";
const SPECIAL_EDGE_TYPE = "specialEdge";

// NOTE: Edges must have 'source' & 'target' attributes
// In a more realistic use case, the graph would probably originate
// elsewhere in the App or be generated from some other state upstream of this component.
const sample = {
  "nodes": [
    {
      "id": 1,
      "title": "Node A",
      "x": 0,
      "y": 0,
      "type": EMPTY_TYPE
    },
    {
      "id": 2,
      "title": "Node B",
      "x": 200,
      "y": 0,
      "type": EMPTY_TYPE
    },
    {
      "id": 3,
      "title": "Node C",
      "x": 237.5757598876953,
      "y": 61.81818389892578,
      "type": EMPTY_TYPE
    },
    {
      "id": 4,
      "title": "Node C",
      "x": 600.5757598876953,
      "y": 600.81818389892578,
      "type": EMPTY_TYPE
    }
  ],
  "edges": [
    {
      "source": 1,
      "target": 2,
      "type": SPECIAL_EDGE_TYPE
    },
    {
      "source": 2,
      "target": 4,
      "type": EMPTY_EDGE_TYPE
    }
  ]
}

export class Graph extends Component {

  constructor(props) {
    super(props)

    this.state = {
      graph: this.constructTodosGraph(this.props.todos),
      selected: {}
    }
  }

  componentWillReceiveProps(newProps){
    this.setState({graph: this.constructTodosGraph(newProps.todos)})
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
            type: EMPTY_EDGE_TYPE
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
    const graph = this.state.graph;
    const i = this.getNodeIndex(viewNode);

    graph.nodes[i] = viewNode;
    this.setState({ graph: graph });
  }

  // Node 'mouseUp' handler
  onSelectNode = viewNode => {
    // Deselect events will send Null viewNode
    if (!!viewNode) {
      this.setState({ selected: viewNode });
    } else {
      this.setState({ selected: {} });
    }
  }

  // Edge 'mouseUp' handler
  onSelectEdge = viewEdge => {
    this.setState({ selected: viewEdge });
  }

  // Updates the graph with a new node
  onCreateNode = (x, y) => {
    const graph = this.state.graph;

    // This is just an example - any sort of logic
    // could be used here to determine node type
    // There is also support for subtypes. (see 'sample' above)
    // The subtype geometry will underlay the 'type' geometry for a node
    const type = Math.random() < 0.25 ? SPECIAL_TYPE : EMPTY_TYPE;

    const viewNode = {
      id: this.state.graph.nodes.length + 1,
      title: '',
      type: type,
      x: x,
      y: y
    }

    graph.nodes.push(viewNode);
    this.setState({ graph: graph });
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

    // This is just an example - any sort of logic
    // could be used here to determine edge type
    const type = sourceViewNode.type === SPECIAL_TYPE ? SPECIAL_EDGE_TYPE : EMPTY_EDGE_TYPE;

    const viewEdge = {
      source: sourceViewNode[NODE_KEY],
      target: targetViewNode[NODE_KEY],
      type: type
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

  /*
   * Render
   */

  render() {
    const nodes = this.state.graph.nodes;
    const edges = this.state.graph.edges;
    const selected = this.state.selected;

    const NodeTypes = GraphConfig.NodeTypes;
    const NodeSubtypes = GraphConfig.NodeSubtypes;
    const EdgeTypes = GraphConfig.EdgeTypes;

    return (
      <div id='graph' style={{...styles.graph, height: window.innerHeight}}>

        <GraphView
          ref={(el) => this.GraphView = el}
          nodeKey={NODE_KEY}
          emptyType={EMPTY_TYPE}
          nodes={nodes}
          edges={edges}
          selected={selected}
          nodeTypes={NodeTypes}
          nodeSubtypes={NodeSubtypes}
          edgeTypes={EdgeTypes}
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

Graph.propTypes = {
  todos: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    completed: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired
  }).isRequired).isRequired,
}

export default Graph
