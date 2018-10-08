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

const EmptyShape = (
  <symbol viewBox="0 0 100 100" id="empty">
    <circle cx="50" cy="50" r="45"></circle>
  </symbol>
)

const SpecialShape = (
  <symbol viewBox="0 0 100 100" id="special">
    <rect transform="translate(50) rotate(45)" width="70" height="70"></rect>
  </symbol>
)

const SpecialChildShape = (
  <symbol viewBox="0 0 100 100" id="specialChild">
    <rect x="2.5" y="0" width="95" height="97.5" fill="rgba(30, 144, 255, 0.12)"></rect>
  </symbol>
)

const EmptyEdgeShape = (
  <symbol viewBox="0 0 50 50" id="emptyEdge">
    <circle cx="25" cy="25" r="8" fill="currentColor"> </circle>
  </symbol>
)

const SpecialEdgeShape = (
  <symbol viewBox="0 0 50 50" id="specialEdge">
    <rect transform="rotate(45)"  x="25" y="-4.5" width="15" height="15" fill="currentColor"></rect>
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
    empty: {
      typeText: "",
      shapeId: "#empty",
      shape: EmptyShape
    },
    special: {
      typeText: "Special",
      shapeId: "#special",
      shape: SpecialShape
    }
  }, 
  NodeSubtypes: {
    specialChild: {
      shapeId: "#specialChild",
      shape: SpecialChildShape
    }
  }, 
  EdgeTypes: {
    emptyEdge: {
      shapeId: "#emptyEdge",
      shape: EmptyEdgeShape
    },
    specialEdge: {
      shapeId: "#specialEdge",
      shape: SpecialEdgeShape
    }
  }
}
