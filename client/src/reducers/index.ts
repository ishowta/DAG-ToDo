import { combineReducers } from 'redux'
import { todosReducer } from './todos'
import { viewerReducer } from './viewer'
import { RootState } from '../stores'

export const rootReducer = combineReducers<RootState>({
  todos: todosReducer,
  viewer: viewerReducer,
})

// TODO: send todos to remote
/*
const todos = (state = [], action) => {
  const res = _todos(state, action)
  if(action.payload.type !== "INIT" && res.length !== 0){
    // Send todos to remote
    const key = findGetParameter("room")
    if(key !== null){
      axios.post(`server/${key}`, JSON.stringify(res))
    }
  }

  return res
}
*/
