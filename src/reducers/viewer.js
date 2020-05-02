const viewer = (state = {
    focusTodoId: null
}, action) => {
  switch (action.type) {
    case 'FOCUS_TODO':
        return {...state, focusTodoId: action.id}
    default:
      return state
  }
}

export default viewer
