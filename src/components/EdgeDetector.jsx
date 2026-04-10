import React, { useState, useEffect, useRef } from 'react';
import { Camera, RefreshCcw, ShieldCheck, AlertCircle, Info } from 'lucide-react';

const EdgeDetector = ({ onDetection, externalImage }) => {
  const [image, setImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState('');
  const [detections, setDetections] = useState([]);

  useEffect(() => {
    if (externalImage) {
      setImage(externalImage);
      processImage(externalImage);
    }
  }, [externalImage]);
  
  const steps = [
    'Initializing CNN Engine...',
    'Performing Noise Removal...',
    'Extracting Structural Features...',
    'Executing Road Segmentation (DFRD)...',
    'Running Classification (CNN)...'
  ];

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
        processImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async (imgData) => {
    setIsProcessing(true);
    setDetections([]);
    
    // Simulate the DFRD Pipeline from the paper
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(steps[i]);
      await new Promise(r => setTimeout(r, 600));
    }

    // Simulated logic based on image path
    let mockDetections = [];
    if (imgData.includes('pothole_1')) {
      mockDetections = [{ id: 1, type: 'Pothole', severity: 'High', box: [150, 180, 220, 140] }];
    } else if (imgData.includes('crack_1')) {
      mockDetections = [{ id: 1, type: 'Longitudinal Crack', severity: 'Medium', box: [100, 220, 400, 60] }];
    } else if (imgData.includes('road_view_1')) {
      mockDetections = [
        { id: 1, type: 'Pavement Wear', severity: 'Low', box: [300, 250, 120, 80] },
        { id: 2, type: 'Faded Marking', severity: 'Low', box: [50, 300, 200, 40] }
      ];
    } else {
      // Default / Uploaded file
      mockDetections = [{ id: 1, type: 'Object Detected', severity: 'Low', box: [200, 200, 100, 100] }];
    }

    setDetections(mockDetections);
    setIsProcessing(false);
    onDetection(mockDetections);
    setCurrentStep('Analysis Complete');
  };

  return (
    <div className="edge-detector">
      <div className="detector-main">
        {!image ? (
          <div className="upload-zone">
            <Camera size={48} className="upload-icon" />
            <h3>Capture or Upload Road Data</h3>
            <p>Upload images from the Edge device to begin localized analysis.</p>
            <input type="file" id="road-upload" hidden onChange={handleUpload} accept="image/*" />
            <label htmlFor="road-upload" className="btn-primary">Select Image</label>
          </div>
        ) : (
          <div className="preview-container">
            <img src={image} alt="Road Preview" className="road-image" />
            <div className="detection-layer">
              {detections.map(d => (
                <div 
                  key={d.id} 
                  className={`detection-box ${d.severity.toLowerCase()}`}
                  style={{
                    left: `${d.box[0]}px`,
                    top: `${d.box[1]}px`,
                    width: `${d.box[2]}px`,
                    height: `${d.box[3]}px`
                  }}
                >
                  <span className="box-label">{d.type} ({d.severity})</span>
                </div>
              ))}
            </div>
            
            {isProcessing && (
              <div className="processing-overlay">
                <RefreshCcw className="spinning" size={32} />
                <p>{currentStep}</p>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${(steps.indexOf(currentStep) + 1) * 20}%` }}></div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="detector-info glass-card">
        <div className="info-item">
          <ShieldCheck size={18} className="text-cyan" />
          <span>Local Inference Active</span>
        </div>
        <div className="info-item">
          <Info size={18} className="text-blue" />
          <span>Model: MobileNet-v2 (Optimized)</span>
        </div>
        <button className="btn-outline reset-btn" onClick={() => setImage(null)}>
          <RefreshCcw size={14} /> Reset
        </button>
      </div>

      <style jsx>{`
        .edge-detector {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .detector-main {
          flex: 1;
          background: #000;
          border-radius: 12px;
          overflow: hidden;
          position: relative;
          min-height: 350px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border-color);
        }
        .upload-zone {
          text-align: center;
          padding: 40px;
        }
        .upload-icon {
          color: var(--accent-blue);
          margin-bottom: 20px;
          opacity: 0.5;
        }
        .preview-container {
          position: relative;
          width: 100%;
          height: 100%;
        }
        .road-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .processing-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(4px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          z-index: 20;
        }
        .spinning {
          animation: spin 1s linear infinite;
          color: var(--accent-cyan);
        }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        .progress-bar {
          width: 200px;
          height: 4px;
          background: rgba(255,255,255,0.1);
          border-radius: 2px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: var(--accent-cyan);
          transition: width 0.3s ease;
        }

        .detection-box {
          position: absolute;
          border: 2px solid;
          pointer-events: none;
        }
        .detection-box.high { border-color: var(--accent-red); box-shadow: 0 0 10px rgba(239,68,68,0.5); }
        .detection-box.medium { border-color: var(--accent-orange); }
        
        .box-label {
          position: absolute;
          top: -22px;
          left: -2px;
          background: inherit;
          color: white;
          font-size: 10px;
          font-weight: bold;
          padding: 2px 6px;
          border-radius: 2px 2px 0 0;
          background-color: var(--accent-red);
        }
        .medium .box-label { background-color: var(--accent-orange); }

        .detector-info {
          padding: 12px 20px;
          display: flex;
          align-items: center;
          gap: 24px;
          font-size: 0.85rem;
        }
        .info-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-secondary);
        }
        .reset-btn {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
        }
      `}</style>
    </div>
  );
};

export default EdgeDetector;
