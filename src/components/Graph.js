import React, {Component} from 'react'
import PropTypes from 'prop-types'
import GraphView from 'react-digraph'
import GraphConfig from './graph-config.js'
import { type INodeType, GraphUtils } from "react-digraph"

const NODE_KEY = "id"

const NORMAL_TYPE = "normal";
const ACTIVE_TYPE = "active";
const DONE_TYPE = "done";
const NORMAL_EDGE_TYPE = "normalEdge";

// https://stackoverflow.com/questions/2057682/determine-pixel-length-of-string-in-javascript-jquery
function getWidthOfText(txt, fontname = "", fontsize = "8px"){
    if(getWidthOfText.e === undefined){
        getWidthOfText.e = document.createElement('span');
        document.body.appendChild(getWidthOfText.e);
    }
    getWidthOfText.e.style.display = "table";
    getWidthOfText.e.style.fontSize = fontsize;
    getWidthOfText.e.style.fontFamily = fontname;
    getWidthOfText.e.innerText = txt;
    let res = getWidthOfText.e.offsetWidth
    getWidthOfText.e.style.display = "none";
    return res;
}

Object.defineProperty(Array.prototype, 'chunk', {
  value: function(chunkSize) {
    console.log(getWidthOfText(this.join("")), this, this.join(""))
    let size = getWidthOfText(this.join(""))
    var array = this;
    let len = array.length;
    let dif = Math.floor(len / (size / chunkSize));
    console.log(dif);
    return [].concat.apply([],
      array.map(function(elem, i) {
        return i % dif ? [] : [array.slice(i, i + dif)];
      })
    );
  }
});

class TodoNodeText extends React.Component {
  getTypeText(data: INodeType, nodeTypes: any) {
    if (data.type && nodeTypes[data.type]) {
      return nodeTypes[data.type].typeText;
    } else if (nodeTypes.emptyNode) {
      return nodeTypes.emptyNode.typeText;
    } else {
      return null;
    }
  }

  render() {
    const { data, nodeTypes, isSelected } = this.props;
    const lineOffset = 18;
    const title = data.title;
    const className = GraphUtils.classNames('node-text', {
      selected: isSelected,
    });
    const typeText = this.getTypeText(data, nodeTypes);

    const renderText = () => {
      const lines = [...data.title].chunk(100)
      console.log("lines", lines)
      return lines.slice(0, 2).map((text, i) =>
        <tspan x={0} y={lineOffset * i} fontSize="12px" key={i}>
          {text.join("") + (i === 1 && lines.length > 2 ? "..." : "" )}
        </tspan>
      )
    }

    return (
      <text className={[...className, "wraptext"]} textAnchor="middle">
        {!!typeText && <tspan opacity="0.5">{typeText}</tspan>}
        {title && renderText()}
        {title && <title>{title}</title>}
      </text>
    );
  }
}

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

  _generateEdges = (todos) => {
    const indexOf = id => todos.findIndex(todo => todo.id === id)
    return todos.reduce((edges, todo) => (
      edges.concat(todo.depends_on
        .filter(id => indexOf(id) !== -1)
        .map(id => {
        return {
          source: id,
          target: todo.id,
          type: NORMAL_EDGE_TYPE
        }
      }))
    ), [])
  }

  _generateTargetsAndSourcesList = (todos, edges) => {
    const indexOf = id => todos.findIndex(todo => todo.id === id)
    var targets_list = todos.map(()=>[])
    var sources_list = todos.map(()=>[])
    edges.forEach(edge => {
      targets_list[indexOf(edge.source)].push(edge.target)
      sources_list[indexOf(edge.target)].push(edge.source)
    })
    return [targets_list, sources_list]
  }

  _calcurateDepth = (todos, targets_list) => {
    const indexOf = id => todos.findIndex(todo => todo.id === id)
    var depth_list = todos.map(() => 0)
    const updateDepth = (s, t) => {
      if(depth_list[s] >= depth_list[t]){
        depth_list[t] = depth_list[s] + 1
        targets_list[t].forEach(t_target => {
          updateDepth(t, indexOf(t_target))
        })
      }
    }
    targets_list.forEach((targets,todo_i) => {
      targets.forEach(target => {
        updateDepth(todo_i, indexOf(target))
      })
    })
    return depth_list
  }

  constructTodosGraph = (todos) => {
    const indexOf = id => todos.findIndex(todo => todo.id === id)
    const edges = this._generateEdges(todos)
    const [targets_list, sources_list] = this._generateTargetsAndSourcesList(todos, edges)
    const depth_list = this._calcurateDepth(todos, targets_list)

    // 深さnのtodoのうちどれが何番目なのかを計算する
    let node_nth = todos.map(_ => 0)
    const nodeListEachDepth = [...Array(Math.max(...depth_list, 0) + 1).keys()].map((_, depthNum)=>{
      return depth_list.reduce((list, depth, i)=>{
        if(depth === depthNum) list.push(i)
        return list
      }, [])
    })

    const getNodeIndexFromId = (id) => {
	for(const [i, todo] of todos.entries()){
	    if(todo.id === id) return i
    	}
    }

    // それぞれの深さのノードを、親ノードのもっとも右の位置でソートしてから追加していく
    nodeListEachDepth.forEach(nodes => {
      // 親ノードのもっとも右の位置
      const nodesMaxSourceNth = nodes.map(node => {
        const sourcesNth = sources_list[node].map(sNode => node_nth[getNodeIndexFromId(sNode)])
        return Math.max(...sourcesNth, 0)
      })
      // ソート
      let nodeDataList = nodes.map((node, i )=> [node, i, nodesMaxSourceNth[i]])
      nodeDataList.sort((a,b) => {
        const an = a[2]
        const bn = b[2]
        if(an < bn) return -1
        if(an === bn) return 0
        if(an > bn) return 1
      })
      // nthの計算
      let nthCnt = 0
      nodeDataList.forEach((nodeTuple)=>{
        nthCnt = Math.max(nthCnt, nodeTuple[2])
        node_nth[nodeTuple[0]] = nthCnt
        nthCnt += 1
      })
    })

    // Activeなタスクを探してマークをつける
    var active_list = todos.map(()=>false)
    const searchActiveNode = (i) => {
      if(todos[i].completed === false
        && sources_list[i].every(source => todos[indexOf(source)].completed === true)
      ){
        active_list[i] = true
      }else{
        targets_list[i].forEach(target => {
          searchActiveNode(indexOf(target))
        })
      }
    }
    depth_list.forEach((depth, i)=>{
      if(depth === 0) searchActiveNode(i)
    })

    // nodes
    const nodes = todos.map((todo, i)=>{
      return {
        "id": todo.id,
        "title": todo.text,
        "x": node_nth[i] * 200 + 200,
        "y": depth_list[i] * 200 + 300,
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
  onUpdateNode = _viewNode => {
  }

  // Node 'mouseUp' handler
  onSelectNode = viewNode => {
    if(viewNode !== null) this.props.toggleTodo(viewNode.id)
  }

  // Edge 'mouseUp' handler
  /* onSelectEdge = viewEdge => {
    console.log("select",viewEdge)
    this.setState({ selected: viewEdge });
  } */

  // Remove the edge at select it
  onSelectEdge = edge => {
    this.props.removeDependence({
      from_id: edge.target,
      to_id: edge.source
    })
  }

  // Updates the graph with a new node
  onCreateNode = (_x, _y) => {
  }

  // Deletes a node from the graph
  onDeleteNode = viewNode => {
    const graph = this.state.graph;
    const i = this.getNodeIndex(viewNode);
    graph.nodes.splice(i, 1);

    // Delete any connected edges
    const newEdges = graph.edges.filter(edge => {
      return edge.source !== viewNode[NODE_KEY] &&
        edge.target !== viewNode[NODE_KEY]
    })

    graph.edges = newEdges;

    this.setState({ graph: graph, selected: {} });
  }

  // Creates a new edge between two nodes
  onCreateEdge = (sourceViewNode, targetViewNode) => {
    const graph = this.state.graph;

    const viewEdge = {
      source: sourceViewNode[NODE_KEY],
      target: targetViewNode[NODE_KEY],
      type: NORMAL_EDGE_TYPE
    }

    // 閉路ができてないかチェック
    const indexOf = id => this.props.todos.findIndex(todo => todo.id === id)
    var [targets_list, ] = this._generateTargetsAndSourcesList(this.props.todos, graph.edges)
    const depth_list = this._calcurateDepth(this.props.todos, targets_list)

    if(targets_list[indexOf(viewEdge.source)].findIndex(target => target === viewEdge.target) !== -1){
      //console.log("Edge already in there")
      this.props.removeDependence({
        from_id: viewEdge.target,
        to_id: viewEdge.source
      })
      return
    }

    var findCloseNetwork = false
    targets_list[indexOf(viewEdge.source)].push(viewEdge.target)
    const searchCloseNetwork = (marking_list, i) => {
      targets_list[i].forEach(target => {
        if(marking_list[indexOf(target)]){
          findCloseNetwork = true
          return
        }
        var new_marking_list = [...marking_list]
        new_marking_list[indexOf(target)] = true
        searchCloseNetwork(new_marking_list ,indexOf(target))
      })
    }
    depth_list.forEach((depth, i)=>{
      if(depth === 0){
        var marking_list = this.props.todos.map(_ => false)
        marking_list[i] = true
        searchCloseNetwork(marking_list, i)
      }
    })

    // Only add the edge when the source node is not the same as the target
    if (findCloseNetwork === false && viewEdge.source !== viewEdge.target) {
      graph.edges.push(viewEdge);
      this.props.addDependence({
        from_id: viewEdge.target,
        to_id: viewEdge.source
      })
    }else{
      console.log("invalid edge!")
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
          canDeleteNode={false}
          canDeleteEdge={false}
          onDeleteEdge={this.onDeleteEdge}
          maxTitleChars={Infinity}
          nodeSize={150}
          zoomDelay={2000}
          zoomDur={300}
          renderNodeText={(data, id, isSelected) => {
            return (
              <TodoNodeText
                nodeTypes={GraphConfig.NodeTypes}
                data={data}
                id={id}
                isSelected={isSelected}
                maxTitleChars={Infinity}
              />
            )
          }}
        />
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
  toggleTodo: PropTypes.func.isRequired,
  deleteTodo: PropTypes.func.isRequired,
}

export default Graph
