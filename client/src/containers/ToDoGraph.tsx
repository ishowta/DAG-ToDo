import React, { useState, useEffect } from 'react'
import { GraphView, INode, IEdge } from 'react-digraph'
import GraphConfig, { ToDoGraphNode, ToDoGraphEdge } from './Node'
import { GraphUtils } from 'react-digraph'
import { todoActionCreators } from '../actions/todos'
import { viewerActionCreators } from '../actions/viewer'
import { useDispatch } from 'react-redux'
import { ToDo } from '../stores/todos'
import { comp, makeDictFromArray } from '../type-utils'
import { GraphInner } from './styles/ToDoGraph.style'
import Lazy from 'lazy.js'

// https://stackoverflow.com/questions/2057682/determine-pixel-length-of-string-in-javascript-jquery
let e: HTMLSpanElement
function getWidthOfText(txt: string, fontname = '', fontsize = '8px'): number {
  if (e === undefined) {
    e = document.createElement('span')
    document.body.appendChild(e)
  }
  e.style.display = 'table'
  e.style.fontSize = fontsize
  e.style.fontFamily = fontname
  e.innerText = txt
  let res = e.offsetWidth
  e.style.display = 'none'
  return res
}

function chunk(str: string, chunkSize: number): string[] {
  let strSize = getWidthOfText(str)
  let chunkCount = Math.ceil(strSize / chunkSize)
  let chunkLength = Math.ceil(str.length / chunkCount)
  return Lazy.range(chunkCount)
    .map((i) =>
      str.slice(chunkLength * i, Math.min(chunkLength * (i + 1), str.length))
    )
    .toArray()
}

const ToDoGraphNodeText: React.FC<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
  isSelected: boolean
}> = (props) => {
  const { data, isSelected } = props
  const lineOffset = 18
  const title = data.title
  const className = GraphUtils.classNames('node-text', {
    selected: isSelected,
  })

  const renderText = () => {
    const lines = chunk(data.title, 100)
    return lines.slice(0, 2).map((text, i) => (
      <tspan x={0} y={lineOffset * i} fontSize="12px" key={i}>
        {text + (i === 1 && lines.length > 2 ? '...' : '')}
      </tspan>
    ))
  }

  return (
    <text className={className + ' wraptext'} textAnchor="middle">
      {title && renderText()}
      {title && <title>{title}</title>}
    </text>
  )
}

type Node = {
  index: number
  view?: ToDoGraphNode
  data: ToDo
  parentNodes: Node[]
  childNodes: Node[]
}
type Edge = {
  view?: ToDoGraphEdge
  source: Node
  target: Node
}
class Graph {
  nodeList: Node[]
  edgeList: Edge[]
  depthList: number[]
  nodeNth: number[]
  constructor(todos: ToDo[]) {
    this.nodeList = todos.map((todo: ToDo, index: number) => ({
      index: index,
      data: todo,
      parentNodes: [],
      childNodes: [],
    }))

    for (let node of this.nodeList) {
      node.childNodes = node.data.nextToDos.map(
        (id) => this.nodeList.find((node) => node.data.id === id) as Node
      )
      for (let childNode of node.childNodes) {
        childNode.parentNodes.push(node)
      }
    }

    this.edgeList = this.nodeList.flatMap((node) =>
      node.childNodes.map((childNode) => {
        return {
          source: node,
          target: childNode,
        }
      })
    )

    // Construct DAG View

    // Calcurate DAG depth
    this.depthList = this.calcDepthList()

    // Calcurate position in n depth
    this.nodeNth = this.calcNodeNth(this.depthList)

    // Activeなタスクを探してマークをつける
    let activeNodeList = this.nodeList.map(
      (n) =>
        n.data.completed === false &&
        n.parentNodes.every((p) => p.data.completed)
    )

    // nodes
    for (let [i, node] of this.nodeList.entries()) {
      node.view = {
        id: node.data.id,
        title: node.data.text,
        x: this.nodeNth[i] * 200 + 200,
        y: this.depthList[i] * 200 + 300,
        type: node.data.completed
          ? 'DONE'
          : activeNodeList[i]
          ? 'ACTIVE'
          : 'NORMAL',
      }
    }

    // edges
    for (let edge of this.edgeList) {
      edge.view = {
        source: edge.source.data.id.toString(),
        target: edge.target.data.id.toString(),
        type: 'NORMAL',
      }
    }
  }

  private calcDepthList(): number[] {
    let depthList: number[] = this.nodeList.map(() => 0)

    const updateDepth = (node: Node) => {
      for (let childNode of node.childNodes) {
        if (depthList[node.index] >= depthList[childNode.index]) {
          depthList[childNode.index] = depthList[node.index] + 1
          updateDepth(childNode)
        }
      }
    }

    for (let node of this.nodeList) updateDepth(node)

    return depthList
  }

  private calcNodeNth(depthList: number[]): number[] {
    let nodeNth = this.nodeList.map(() => 0)
    const maxDepth = Math.max(...depthList, 0) + 1
    const nDepthNodeList = (() => {
      let nDepthNodeList = Lazy.range(maxDepth)
        .map((): Node[] => [])
        .toArray()
      for (const [index, depth] of depthList.entries())
        nDepthNodeList[depth].push(this.nodeList[index])
      return nDepthNodeList
    })()

    // それぞれの深さのノードを、親ノードのもっとも右の位置でソートしてから追加していく
    for (const nDepthNodes of nDepthNodeList) {
      // 親ノードのもっとも右の位置
      const parentMaxNth = makeDictFromArray(nDepthNodes, (n) => {
        return {
          key: n.index.toString(),
          value: Math.max(...n.parentNodes.map((p) => nodeNth[p.index]), 0),
        }
      })

      // ソート
      const sortedNDepthNodes = nDepthNodes.sort((a, b) =>
        comp(parentMaxNth[a.index], parentMaxNth[b.index])
      )

      // 左から追加していく
      let currentNth = 0
      for (const node of sortedNDepthNodes) {
        currentNth = Math.max(currentNth, parentMaxNth[node.index])
        nodeNth[node.index] = currentNth
        currentNth += 1
      }
    }
    return nodeNth
  }
}

const ToDoGraph: React.FC<{ todos: ToDo[] }> = (props) => {
  const { addDependence, removeDependence } = todoActionCreators
  const dispatch = useDispatch()
  const { focusToDo } = viewerActionCreators

  const [graph, updateGraph] = useState(new Graph(props.todos))

  useEffect(() => {
    updateGraph(new Graph(props.todos)) // Slow
  }, [props.todos])

  /*
   * Handlers/Interaction
   */

  const findEdge = (viewEdge: IEdge) =>
    graph.edgeList.find(
      (e) =>
        e.source.data.id.toString() === viewEdge.source &&
        e.target.data.id.toString() === viewEdge.target
    )

  // Called by 'drag' handler, etc..
  // to sync updates from D3 with the graph
  const onUpdateNode = (_viewNode: INode) => {}

  // Node 'mouseUp' handler
  const onSelectNode = (viewNode: INode | null) => {
    if (viewNode !== null) {
      //dispatch(toggleToDo(viewNode.id))
      dispatch(focusToDo(viewNode.id))
    }
  }

  // Edge 'mouseUp' handler
  // Remove the edge at select it
  const onSelectEdge = (edge: IEdge) => {
    dispatch(removeDependence(Number(edge.source), Number(edge.target)))
  }

  // Updates the graph with a new node
  const onCreateNode = (_x: number, _y: number) => {}

  // Deletes a node from the graph
  const onDeleteNode = (_viewNode: INode) => {}

  // Create or Delete a new edge between two nodes
  const onCreateEdge = (sourceViewNode: INode, targetViewNode: INode) => {
    const viewEdge: ToDoGraphEdge = {
      source: sourceViewNode.id,
      target: targetViewNode.id,
      type: 'NORMAL',
    }

    // 既にあればなにもしない
    if (findEdge(viewEdge) !== undefined) {
      return
    }

    // 閉路ができてないかチェック

    let findCloseNetworkRing = false

    const searchCloseNetwork = (currentNode: Node, marking: boolean[]) => {
      for (const childNode of currentNode.childNodes) {
        if (marking[childNode.index]) {
          findCloseNetworkRing = true
          return
        }
        let newMarking = [...marking]
        newMarking[childNode.index] = true
        searchCloseNetwork(childNode, newMarking)
      }
    }

    for (const [index, depth] of graph.depthList.entries()) {
      if (depth === 0) {
        let marking = graph.nodeList.map(() => false)
        marking[index] = true
        searchCloseNetwork(graph.nodeList[index], marking)
      }
    }

    const isLoop = viewEdge.source === viewEdge.target

    if (findCloseNetworkRing === false && isLoop === false) {
      dispatch(addDependence(Number(viewEdge.source), Number(viewEdge.target)))
    } else {
      console.log('Invalid edge!')
    }
  }

  const onSwapEdge = (
    _sourceViewNode: INode,
    _targetViewNode: INode,
    _viewEdge: IEdge
  ) => {}

  // Called when an edge is deleted
  const onDeleteEdge = (_viewEdge: IEdge) => {}

  return (
    <GraphInner id="graph">
      <GraphView
        nodeKey="id"
        nodes={graph.nodeList.map((n) => n.view)}
        edges={graph.edgeList.map((e) => e.view)}
        selected={[]}
        nodeTypes={GraphConfig.NodeTypes}
        nodeSubtypes={GraphConfig.NodeSubtypes}
        edgeTypes={GraphConfig.EdgeTypes}
        onSelectNode={onSelectNode}
        onCreateNode={onCreateNode}
        onUpdateNode={onUpdateNode}
        onDeleteNode={onDeleteNode}
        onSelectEdge={onSelectEdge}
        onCreateEdge={onCreateEdge}
        onSwapEdge={onSwapEdge}
        canDeleteNode={() => false}
        canDeleteEdge={() => false}
        onDeleteEdge={onDeleteEdge}
        maxTitleChars={Infinity}
        nodeSize={150}
        zoomDelay={100}
        zoomDur={0}
        renderNodeText={(data, id, isSelected) => {
          return <ToDoGraphNodeText data={data} isSelected={isSelected} />
        }}
      />
    </GraphInner>
  )
}

export default ToDoGraph
