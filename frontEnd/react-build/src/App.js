import { useEffect, useState } from "react";
import io from 'socket.io-client'
import { Button, Container } from 'react-bootstrap'

import Gameboard from "./components/Gameboard"

//const socket = io("https://calm-plateau-34573.herokuapp.com/", {transports: ['websocket', 'polling', 'flashsocket']})

function App() {
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    const newSocket = io("https://calm-plateau-34573.herokuapp.com/", {transports: ['websocket', 'polling', 'flashsocket']})
    newSocket.on('init', (msg) => console.log(msg))
    setSocket(newSocket)
    return () => {
      console.log("socket will close");
      newSocket.close()}
  }, [])

  return (
    <Container>
      <Button>Button</Button>
      <Gameboard socket={socket}/>
    </Container>
  )
}

export default App;
