
export default function Attack() {
    return (
        <div className="player-attack">
            <div className="attack-info">
                <div className="attack-requirements em75">
                    <span className="attack-req-dice">X</span> <span className="attack-req-threshold"></span>
                </div>
                <div className="attack-details">
                    <div className="attack-name">Attack Name</div>
                </div>
            </div>
            <div className="attack-output">
                <span className="attack-damage">YY</span>
                <span className="attack-pierce em75 hidden">Pierce: <span className="pierce-value">ZZ</span></span>
            </div>
            <button className="attack-button" onclick="sendAttack(event)">Attack</button>
        </div>
    )
}
