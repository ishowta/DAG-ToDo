import React from 'react'
import Footer from './Footer'
import AddTodo from '../containers/AddTodo'
import VisibleTodoList from '../containers/VisibleTodoList'
import GraphContainer from '../containers/GraphContainer';
import { findGetParameter } from "../util";
import axios from "axios";
import { init } from '../actions';
import { connect } from "react-redux";
import ViewerContainer from '../containers/ViewerContainer';

class BApp extends React.Component {
  componentDidMount = () => {
    const { init } = this.props
    const key = findGetParameter("room")
    if(key !== null){
      window.setInterval(function(){
        axios.get(`server/${key}`)
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
          {findGetParameter("room") === null && (
            <div style={{"white-space": "pre-line","fontSize": "12px", "marginLeft": "4px", "marginBottom": "10px"}}>
              {`
                使い方

                入室
                - ローカル：/
                - ルーム：/ルーム名

                操作
                - タスクの追加：下の入力欄から
                - 依存関係の追加：Shiftを押しながらD&D
                - 依存関係の削除：矢印をクリック
                - タスクの完了：タスクをクリック
                - タスクの削除：タスク一覧のDELETEをクリック

                表示
                - 未完了のタスクだけ表示：Activeをクリック
                - 完了したタスクだけ表示：Completedをクリック
                - 全て表示：Allをクリック
                `
              }
            </div>
          )}
          <AddTodo />
          <Footer />
          <ViewerContainer />
          <VisibleTodoList />
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
