import React, { Component } from 'react'

export default class Scenario extends Component {
    render() {
        return (
            <div class="scenario-card">
                <div class="scenario-image">
                </div>
                <div  class="roll-amounts">
                    <div>Roll Counts:</div>
                    <div class="active-player-rolls roll-count">X</div>
                    <div class="support-player-rolls roll-count">Y</div>
                </div>
                <div class="scenario-health">Damage: <span class="scenario-dmg-counter">00</span></div>
                <div class="scenario-title ">Scenario Title</div>
                <div class="scenario-stage-hook ">

                </div>
            </div>
        )
    }
}
