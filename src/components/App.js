import React from 'react'
import Footer from './Footer'
import AddTodo from '../containers/AddTodo'
import VisibleTodoList from '../containers/VisibleTodoList'
import GraphContainer from '../containers/GraphContainer';
import { findGetParameter } from "../util";
import axios from "axios";
import { init } from '../actions';
import { connect } from "react-redux";

class BApp extends React.Component {
  componentDidMount = () => {
    const { init } = this.props
    const key = findGetParameter("room")
    if(key !== null){
      window.setInterval(function(){
        axios.get(`http://13.230.103.8:8001/dagtodo?room=${key}`)
        .then(res => {
          const currentTodos = res.data
          if(currentTodos !== ""){
            init(currentTodos)
          }
        })
      }, 1000);
    }
  }

  render(){
    return (
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
  }
}

export default connect(
  _ => ({}),
  {init}
)(BApp)

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
