
export default function Stage() {
    return (
    <div className="scenario-stage">
        <div className="stage-icon">
            HP: <span className="stage-hp-stat">XX</span></div>
        <div className="stage-icon">
            DMG: <span className="stage-dmg-stat">YY</span></div>
        <div className="stage-def hidden">
            Defense: <span className="stage-def-stat"></span>
        </div>
        <div className="stage-aoe hidden">AOE</div>
        <div className="stage-name">
            This stage is stageful
        </div>
    </div>
)
}
