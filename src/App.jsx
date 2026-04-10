import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  Activity, 
  Cloud, 
  Cpu, 
  LayoutDashboard, 
  Settings, 
  BarChart3, 
  Bell,
  Navigation,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import './App.css';

// Component Imports
import EdgeDetector from './components/EdgeDetector';

function App() {
  const [activeTab, setActiveTab] = useState('edge');
  const [isHazardDetected, setIsHazardDetected] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [latency, setLatency] = useState(0);
  const [accuracy, setAccuracy] = useState(0.982);
  const [reviewLog, setReviewLog] = useState(null);
  const [detectionLogs, setDetectionLogs] = useState([
    { id: 101, time: '12:44:02', type: 'HAZARD', msg: 'Large pothole detected at 18.5204° N, 73.8567° E', risk: 'high' },
    { id: 102, time: '12:43:45', type: 'CRACK', msg: 'Longitudinal crack detected - Status: Monitor', risk: 'low' }
  ]);

  const handleDetection = (results) => {
    const start = Date.now();
    setTimeout(() => {
      setLatency(Date.now() - start + 12);
      
      if (results && results.length > 0) {
        const mainResult = results[0];
        const newLog = {
          id: Date.now(),
          time: new Date().toLocaleTimeString(),
          type: mainResult.type.toUpperCase(),
          msg: `${mainResult.type} identified with ${mainResult.severity} severity. Analysis synced to cloud.`,
          risk: mainResult.severity.toLowerCase()
        };
        setDetectionLogs(prev => [newLog, ...prev]);
        
        if (mainResult.severity === 'High') {
          setIsHazardDetected(true);
        } else {
          setIsHazardDetected(false);
        }
      }
    }, 100);
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar glass-card">
        <div className="sidebar-brand">
          <Shield className="brand-icon" />
          <span className="brand-text">EcRD System</span>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'edge' ? 'active' : ''}`}
            onClick={() => setActiveTab('edge')}
          >
            <Cpu size={20} />
            <span>Edge Analysis</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'cloud' ? 'active' : ''}`}
            onClick={() => setActiveTab('cloud')}
          >
            <Cloud size={20} />
            <span>Cloud Sync</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            <BarChart3 size={20} />
            <span>Statistics</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button 
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Header */}
        <header className="content-header">
          <div className="header-title">
            <h1 className="text-gradient">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} View</h1>
            <p className="subtitle">Real-time Road Infrastructure Monitoring</p>
          </div>
          
          <div className="header-actions">
            <div className="status-indicator">
              <span className="status-dot online"></span>
              <span>System Online</span>
            </div>
            <button className="icon-btn">
              <Bell size={20} />
              <span className="notification-badge">2</span>
            </button>
            <div className="user-profile">
              <div className="avatar">AD</div>
            </div>
          </div>
        </header>
        {/* Content Grid */}
        <div className="dashboard-grid">
          {/* Main Visualizer (Edge Detector) */}
          <section className="visualizer-section glass-card">
             <div className="detection-overlay">
                {isHazardDetected && (
                  <div className="hazard-alert animate-fade-in">
                    <AlertTriangle className="alert-icon" />
                    <span>HAZARDOUS DAMAGE DETECTED - WARNING ISSUED</span>
                  </div>
                )}
             </div>
             
             {activeTab === 'edge' ? (
                <EdgeDetector onDetection={handleDetection} externalImage={selectedImage} />
              ) : activeTab === 'cloud' ? (
                <div className="visualizer-placeholder cloud-view animate-fade-in">
                  <div className="placeholder-content">
                    <Cloud size={64} className="pulse-icon text-cyan" />
                    <h2 className="text-gradient">Cloud Synchronization</h2>
                    <div className="sync-status glass-card">
                      <div className="sync-row">
                        <span>Active Nodes:</span>
                        <span className="text-green">1,204</span>
                      </div>
                      <div className="sync-row">
                        <span>Data Processed (24h):</span>
                        <span>4.2 TB</span>
                      </div>
                      <div className="sync-row">
                        <span>Model Version:</span>
                        <span>EcRD-v4.2-L</span>
                      </div>
                    </div>
                    <p className="subtitle">Real-time global synchronization active.</p>
                  </div>
                </div>
              ) : activeTab === 'stats' ? (
                <div className="visualizer-placeholder stats-view animate-fade-in">
                   <div className="placeholder-content">
                      <BarChart3 size={64} className="pulse-icon text-blue" />
                      <h2 className="text-gradient">Analytics Engine</h2>
                      <div className="stats-preview-grid">
                        <div className="mini-chart glass-card">
                          <div className="chart-bar" style={{height: '40%'}}></div>
                          <div className="chart-bar" style={{height: '70%'}}></div>
                          <div className="chart-bar" style={{height: '55%'}}></div>
                          <div className="chart-bar" style={{height: '90%'}}></div>
                        </div>
                      </div>
                      <p className="subtitle">Compiling global infrastructure health reports...</p>
                   </div>
                </div>
              ) : activeTab === 'settings' ? (
                <div className="visualizer-placeholder settings-view animate-fade-in">
                   <div className="settings-container">
                      <h2 className="text-gradient">System Configuration</h2>
                      <div className="settings-grid">
                        <div className="setting-item glass-card">
                          <div className="setting-info">
                            <h4>Edge Processing</h4>
                            <p>Current status: Active</p>
                          </div>
                          <div className="toggle active"></div>
                        </div>
                        <div className="setting-item glass-card">
                          <div className="setting-info">
                            <h4>Cloud Auto-Sync</h4>
                            <p>Upload telemetry in real-time</p>
                          </div>
                          <div className="toggle active"></div>
                        </div>
                        <div className="setting-item glass-card">
                          <div className="setting-info">
                            <h4>Public Warnings</h4>
                            <p>Broadcast to nearby fleet nodes</p>
                          </div>
                          <div className="toggle"></div>
                        </div>
                        <div className="setting-item glass-card">
                          <div className="setting-info">
                            <h4>Detection Sensitivity</h4>
                            <p>Currently: High Precision</p>
                          </div>
                          <Activity size={20} className="text-blue" />
                        </div>
                      </div>
                   </div>
                </div>
              ) : activeTab === 'dashboard' ? (
                <div className="visualizer-placeholder dashboard-view animate-fade-in">
                   <div className="dashboard-hero">
                      <div className="hero-content">
                         <Shield className="hero-icon" size={48} />
                         <h2 className="text-gradient">System Overview</h2>
                         <p>EcRD Node #741 is currently monitoring North Zone 4.</p>
                      </div>
                      <div className="metrics-summary">
                         <div className="mini-stat-card glass-card">
                            <span className="mini-label">Accuracy</span>
                            <span className="mini-value text-green">98.2%</span>
                         </div>
                         <div className="mini-stat-card glass-card">
                            <span className="mini-label">Uptime</span>
                            <span className="mini-value text-blue">99.9%</span>
                         </div>
                         <div className="mini-stat-card glass-card">
                            <span className="mini-label">Hazards</span>
                            <span className="mini-value text-red">42</span>
                         </div>
                      </div>
                   </div>
                </div>
              ) : null}
          </section>

          {/* Right Sidebar Stats & Dataset */}
          <aside className="stats-sidebar">
             <div className="dataset-card glass-card">
                <div className="stat-header">
                   <Navigation size={18} className="text-blue" />
                   <span>Sample Dataset</span>
                </div>
                <div className="dataset-grid">
                   <div className="dataset-item" onClick={() => setSelectedImage('/dataset/pothole_1.png')}>
                      <img src="/dataset/pothole_1.png" alt="Pothole" />
                      <span>Pothole_1</span>
                   </div>
                   <div className="dataset-item" onClick={() => setSelectedImage('/dataset/crack_1.png')}>
                      <img src="/dataset/crack_1.png" alt="Crack" />
                      <span>Crack_1</span>
                   </div>
                   <div className="dataset-item" onClick={() => setSelectedImage('/dataset/road_view_1.png')}>
                      <img src="/dataset/road_view_1.png" alt="Road" />
                      <span>Road_View</span>
                   </div>
                </div>
                <p className="dataset-hint">Provided by Engineer (Maeda et al. 2018)</p>
             </div>

             <div className="stat-card glass-card">
                <div className="stat-header">
                   <Activity size={18} className="text-blue" />
                   <span>Edge Latency</span>
                </div>
                <div className="stat-value">{latency}ms</div>
                <div className="stat-label">Response Time</div>
             </div>

             <div className="stat-card glass-card">
                <div className="stat-header">
                   <Cloud size={18} className="text-cyan" />
                   <span>Cloud Processing</span>
                </div>
                <div className="stat-value">579x Faster</div>
                <div className="stat-label">Architecture vs Pure Cloud</div>
             </div>

             <div className="stat-card glass-card">
                <div className="stat-header">
                   <CheckCircle2 size={18} className="text-green" />
                   <span>Detection Accuracy</span>
                </div>
                <div className="stat-value">{(accuracy * 100).toFixed(1)}%</div>
                <div className="stat-label">Global Metrics</div>
             </div>
          </aside>

          {/* Bottom Alert Log */}
          <section className="alerts-section glass-card">
             <div className="section-header">
                <h3>Detection Logs</h3>
                <button className="text-btn" onClick={() => setDetectionLogs([])}>Clear Logs</button>
             </div>
             <div className="log-list">
                {detectionLogs.map(log => (
                  <div key={log.id} className="log-item animate-fade-in">
                    <span className="log-time">{log.time}</span>
                    <span className={`log-type ${log.risk}-risk`}>{log.type}</span>
                    <span className="log-msg">{log.msg}</span>
                    <button 
                      className="text-btn view-btn" 
                      onClick={() => setReviewLog(log)}
                    >
                      Review
                    </button>
                  </div>
                ))}
             </div>
          </section>
        </div>
      </main>

      {/* Review Modal */}
      {reviewLog && (
        <div className="modal-backdrop" onClick={() => setReviewLog(null)}>
          <div className="review-modal glass-card animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Detection Details</h3>
              <button className="icon-btn" onClick={() => setReviewLog(null)}>
                <XCircle size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="detail-group">
                <label>Time Detected</label>
                <div className="detail-value">{reviewLog.time}</div>
              </div>
              <div className="detail-group">
                <label>Damage Type</label>
                <div className="detail-value text-gradient">{reviewLog.type}</div>
              </div>
              <div className="detail-group">
                <label>System Message</label>
                <div className="detail-value">{reviewLog.msg}</div>
              </div>
              <div className="detail-group">
                <label>Risk Level</label>
                <div className={`detail-value ${reviewLog.risk}-risk`}>
                  {reviewLog.risk.toUpperCase()}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn-primary" 
                style={{ width: '100%', cursor: 'pointer' }}
                onClick={() => setReviewLog(null)}
              >
                Acknowledge & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
