import React from 'react'
import Footer from './Footer'
import AddTodo from '../containers/AddTodo'
import VisibleTodoList from '../containers/VisibleTodoList'
import GraphContainer from '../containers/GraphContainer';

const App = () => (
  <div>
    <div style={{float: 'left', width: '30%', height: window.innerHeight, overflow: 'scroll'}}>
      <AddTodo />
      <VisibleTodoList />
      <Footer />
    </div>
    <div style={{float: 'right', width: '70%'}}>
      <GraphContainer />
    </div>
  </div>
)

export default App
