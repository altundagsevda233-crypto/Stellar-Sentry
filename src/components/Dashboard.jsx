import React from 'react';

/**
 * Dashboard — Top status bar showing network health,
 * current ledger, and monitored contract count.
 */

export default function Dashboard({ connected, latestLedger, contractCount, networkError }) {
    return (
        <div className="dashboard-stats">
            <div className="stat-card">
                <div className="stat-label">Network Status</div>
                <div className={`stat-value ${connected ? 'connected' : 'disconnected'}`}>
                    <span className={`network-dot ${connected ? 'online' : 'offline'}`} />
                    {connected ? 'Connected' : 'Disconnected'}
                </div>
                {networkError && (
                    <div style={{ fontSize: '0.72rem', color: 'var(--status-error)', marginTop: '4px' }}>
                        {networkError}
                    </div>
                )}
            </div>

            <div className="stat-card">
                <div className="stat-label">Current Ledger</div>
                <div className="stat-value">
                    {latestLedger ? latestLedger.toLocaleString() : '—'}
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-label">Contracts Monitored</div>
                <div className="stat-value">{contractCount}</div>
            </div>

            <div className="stat-card">
                <div className="stat-label">Network</div>
                <div className="stat-value" style={{ fontSize: '1.1rem', color: 'var(--accent-teal)' }}>
                    Testnet
                </div>
            </div>
        </div>
    );
}
