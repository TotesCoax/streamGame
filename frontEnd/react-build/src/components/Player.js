
export default function Player() {
    return (
        <div className="player-card player">
            <div className="portrait">
            </div>
            <div className="player-name">
                Username
            </div>
            <div className="player-className">
                Class
            </div>
            <div className="player-mechanic-explain">
                Explain
            </div>
            <div className="hp-bar ">
                <div className="player-dmg">
                    DMG: <span className="player-dmg-counter">00</span>
                </div>
                <div className="player-hp">
                    HP: <span className="player-hp-counter">88</span>
                </div>
                <div className="ability-uses">
                    Uses: <span className="ability-use-counter">X</span>
                </div>
            </div>
            <div className="ability player-display-toggle">
                <button className="ability-button">Ability</button>
                <span className="ability-text">Text for the ability.</span>
            </div>
            <div className="attack-box  player-display-toggle">

            </div>
            <div className="inventory">

            </div>
            <div className="player target hidden"></div>
        </div>
    )
}
