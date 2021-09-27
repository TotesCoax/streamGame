import { useEffect, useState } from "react";
import io from 'socket.io-client'

import Gameboard from "./components/Gameboard"

//const socket = io("https://calm-plateau-34573.herokuapp.com/", {transports: ['websocket', 'polling', 'flashsocket']})

function App() {
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    const newSocket = io("https://calm-plateau-34573.herokuapp.com/", {transports: ['websocket', 'polling', 'flashsocket']})
    newSocket.on('init', (msg) => console.log(msg))
    setSocket(newSocket)
    return () => newSocket.close()
  }, [setSocket])

  console.log(socket)

  return (
    <Gameboard />
  )
}

export default App;
