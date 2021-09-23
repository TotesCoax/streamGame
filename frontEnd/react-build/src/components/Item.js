import React from 'react'

export default function Item() {
    return (
        <div className="player-item">
            <div className="player-item-name"></div>
            <div className="player-item-description"></div>
            <button type="button" className="use-item-visibility hidden" onclick="activateItem(event)">Use</button>
        </div>
    )
}
