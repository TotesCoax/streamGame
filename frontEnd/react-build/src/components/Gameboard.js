import Scenario from './Scenario'

export default function Gameboard({gameboard}) {
    return (
        <>
        <div>
            {gameboard}
        </div>
        <div className="scenarios">
        <Scenario />
        </div>
    </>
)
}
