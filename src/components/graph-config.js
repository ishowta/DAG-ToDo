import React from 'react';

const NormalShape = (
  <symbol viewBox="0 0 100 100" id="normal">
    <rect x="0" y="0" width="100" height="100" fill="rgba(255, 255, 255, 1)"></rect>
  </symbol>
)

const ActiveShape = (
  <symbol viewBox="0 0 100 100" id="active">
    <rect x="0" y="0" width="100" height="100" fill="rgba(249, 166, 2, 1)"></rect>
  </symbol>
)

const DoneShape = (
  <symbol viewBox="0 0 100 100" id="done">
    <rect x="0" y="0" width="100" height="100" fill="rgba(150, 150, 150, 1)"></rect>
  </symbol>
)

const NormalEdgeShape = (
  <symbol viewBox="0 0 50 50" id="emptyEdge">
    <circle cx="25" cy="25" r="8" fill="currentColor"> </circle>
  </symbol>
)

export default {
  NodeTypes: {
    normal: {
      typeText: "",
      shapeId: "#normal",
      shape: NormalShape
    },
    active: {
      typeText: "",
      shapeId: "#active",
      shape: ActiveShape
    },
    done: {
      typeText: "",
      shapeId: "#done",
      shape: DoneShape
    },
  },
  NodeSubtypes: {
  },
  EdgeTypes: {
    normalEdge: {
      shapeId: "#normalEdge",
      shape: NormalEdgeShape
    },
  }
}
