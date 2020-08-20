import React from 'react'
import { INode, IEdge } from 'react-digraph'

const NormalShape = (
  <symbol viewBox="0 0 200 100" id="normal">
    <rect
      x="0"
      y="0"
      width="200"
      height="100"
      fill="rgba(255, 255, 255, 1)"
    ></rect>
  </symbol>
)

const ActiveShape = (
  <symbol viewBox="0 0 200 100" id="active">
    <rect
      x="0"
      y="0"
      width="200"
      height="100"
      fill="rgba(30, 144, 255, 1)"
    ></rect>
  </symbol>
)

const DoneShape = (
  <symbol viewBox="0 0 200 100" id="done">
    <rect
      x="0"
      y="0"
      width="200"
      height="100"
      fill="rgba(176, 196, 222, 1)"
    ></rect>
  </symbol>
)

const NormalEdgeShape = <symbol viewBox="0 0 50 50" id="normalEdge"></symbol>

export type ToDoGraphNode = INode & {
  type: 'NORMAL' | 'ACTIVE' | 'DONE'
  id: number
}

export type ToDoGraphEdge = IEdge & {
  type: 'NORMAL'
}

const NodeConfig: {
  NodeTypes: {
    [key in ToDoGraphNode['type']]: {
      typeText: string
      shapeId: string
      shape: JSX.Element
    }
  }
  NodeSubtypes: Record<string, unknown>
  EdgeTypes: {
    [key in ToDoGraphEdge['type']]: {
      shapeId: string
      shape: JSX.Element
    }
  }
} = {
  NodeTypes: {
    NORMAL: {
      typeText: '',
      shapeId: '#normal',
      shape: NormalShape,
    },
    ACTIVE: {
      typeText: '',
      shapeId: '#active',
      shape: ActiveShape,
    },
    DONE: {
      typeText: '',
      shapeId: '#done',
      shape: DoneShape,
    },
  },
  NodeSubtypes: {},
  EdgeTypes: {
    NORMAL: {
      shapeId: '#normalEdge',
      shape: NormalEdgeShape,
    },
  },
}

export default NodeConfig
