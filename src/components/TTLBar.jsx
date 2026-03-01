import React from 'react';

/**
 * TTLBar — Animated health bar visualizing a ledger entry's Time-To-Live.
 *
 * Color transitions:
 *  - Green  (>30%) — healthy
 *  - Yellow (10–30%) — warning
 *  - Red    (<10%) — critical
 *  - Grey   (0%) — expired
 */

export default function TTLBar({ healthPercentage, healthStatus, estimatedTimeLeft, remainingLedgers }) {
    const displayPercent = Math.min(100, Math.max(0, healthPercentage));

    return (
        <div className="ttl-bar-container">
            <div className="ttl-bar-labels">
                <span className={`ttl-bar-percent ${healthStatus}`}>
                    {healthStatus === 'expired' ? 'EXPIRED' : `${displayPercent.toFixed(1)}%`}
                </span>
                <span className="ttl-bar-time">
                    {healthStatus === 'expired'
                        ? 'No ledgers remaining'
                        : `${remainingLedgers?.toLocaleString()} ledgers · ${estimatedTimeLeft}`}
                </span>
            </div>
            <div className="ttl-bar-track">
                <div
                    className={`ttl-bar-fill ${healthStatus}`}
                    style={{ width: `${healthStatus === 'expired' ? 100 : displayPercent}%` }}
                />
            </div>
        </div>
    );
}
