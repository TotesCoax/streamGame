export default function Scenario() {
    return (
    <div className="scenario-card">
        <div className="scenario-image">
        </div>
        <div  className="roll-amounts">
            <div>Roll Counts:</div>
            <div className="active-player-rolls roll-count">X</div>
            <div className="support-player-rolls roll-count">Y</div>
        </div>
        <div className="scenario-health">Damage: <span className="scenario-dmg-counter">00</span></div>
        <div className="scenario-title">Scenario Title</div>
        <div className="scenario-stage-hook ">

        </div>
    </div>
    )
}
