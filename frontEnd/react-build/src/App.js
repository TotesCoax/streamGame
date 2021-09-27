import { useEffect, useState } from "react";
import io from 'socket.io-client'

import Gameboard from "./components/Gameboard"

const socket = io("https://calm-plateau-34573.herokuapp.com/", {transports: ['websocket', 'polling', 'flashsocket']})

function App() {

  socket.on('init', (msg) => console.log(msg))

  return (
    <Gameboard />
  )
}

export default App;
