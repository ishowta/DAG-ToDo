import React from 'react'
import Footer from './Footer'
import AddTodo from '../containers/AddTodo'
import VisibleTodoList from '../containers/VisibleTodoList'
import GraphContainer from '../containers/GraphContainer';

const App = () => (
  <div>
    <div style={styles.todo}>
      <AddTodo />
      <VisibleTodoList />
      <Footer />
    </div>
    <div style={styles.graph}>
      <GraphContainer />
    </div>
  </div>
)

const styles = {
  todo:{
    float: 'left',
    width: '20%',
    height: window.innerHeight, overflow: 'scroll'
  },
  graph:{
    float: 'right',
    width: '80%',
    position: 'relative',
  }
}

export default App
