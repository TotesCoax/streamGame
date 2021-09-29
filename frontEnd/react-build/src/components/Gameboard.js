import { useState } from 'react'
import { Container } from 'react-bootstrap'
import Scenario from './Scenario'

export default function Gameboard({socket}) {
    const [gameboard, setGameboard] = useState('No gameboard found')


    return (
        <Container>
            <div>
                {gameboard}
            </div>
            <div className="scenarios">
            <Scenario />
            </div> 
        </Container>
)
}
