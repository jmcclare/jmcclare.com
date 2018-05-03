import React from 'react'
import ReactDOM from 'react-dom'

import Swiggity from './swiggity'
import Toggle from './toggle'
import TicTacToe from './tic-tac-toe'
import ICalc from './investment-calc'

console.log('Console message from react-app.jsx')

//ReactDOM.render(
  //<Swiggity />,
  //document.getElementById('react-test')
//)

//ReactDOM.render(
  //<Toggle />,
  //document.getElementById('react-test')
//)

//ReactDOM.render(
  //<TicTacToe />,
  //document.getElementById('tic-tac-toe')
//)

ReactDOM.render(
  <ICalc />,
  document.getElementById('investment-calc')
)
