import { useEffect, useState } from "react";
import io from 'socket.io-client'

import Gameboard from "./components/Gameboard"

function App() {
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    const newSocket = io("https://calm-plateau-34573.herokuapp.com/", {transports: ['websocket', 'polling', 'flashsocket']})
    setSocket(newSocket)
    return () => newSocket.close()
  }, [setSocket])

  socket.on('init', (msg) => console.log(msg))

  return (
    <Gameboard />
  )
}

export default App;
