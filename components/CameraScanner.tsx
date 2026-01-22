
import React, { useRef, useState, useEffect, useCallback } from 'react';

interface CameraScannerProps {
  onScan: (base64Image: string) => void;
  isAnalyzing: boolean;
}

const statusMessages = [
  "Isolating Molecular Structure...",
  "Sequencing Resin Patterns...",
  "Cross-referencing Bio-Library...",
  "Simulating Enzymatic Cleavage...",
  "Finalizing AI Synthesis..."
];

const CameraScanner: React.FC<CameraScannerProps> = ({ onScan, isAnalyzing }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const startWebcam = useCallback(async () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    try {
      setCameraError(null);
      let mediaStream: MediaStream;
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' },
          audio: false 
        });
      } catch (e) {
        mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: true,
          audio: false 
        });
      }
      
      setStream(mediaStream);
      setIsWebcamActive(true);
    } catch (err: any) {
      setCameraError(err.message || "Camera access denied.");
      setIsWebcamActive(false);
    }
  }, [stream]);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current?.play().catch(e => console.error("Video play failed", e));
      };
    }
  }, [stream]);

  useEffect(() => {
    startWebcam();
    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop());
    };
  }, []);

  useEffect(() => {
    let progressInterval: number;
    let statusInterval: number;

    if (isAnalyzing) {
      setLoadingProgress(0);
      setStatusIndex(0);
      
      progressInterval = window.setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 99) return prev; 
          const increment = Math.random() * 8;
          return Math.min(prev + increment, 99);
        });
      }, 150);

      statusInterval = window.setInterval(() => {
        setStatusIndex(prev => (prev + 1) % statusMessages.length);
      }, 1800);
    }

    return () => {
      clearInterval(progressInterval);
      clearInterval(statusInterval);
    };
  }, [isAnalyzing]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        onScan(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const base64 = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
        onScan(base64);
      }
    }
  };

  const circleCircumference = 2 * Math.PI * 45;

  return (
    <div className="w-full flex flex-col items-center">
      <input 
        type="file" 
        accept="image/*" 
        capture="environment" 
        className="hidden" 
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      
      <canvas ref={canvasRef} className="hidden" />

      <div 
        className={`w-full max-w-sm aspect-square rounded-[2.5rem] border-2 transition-all duration-500 overflow-hidden relative group shadow-2xl ${
          isWebcamActive && !isAnalyzing
            ? 'border-green-500/30' 
            : 'border-slate-200'
        }`}
      >
        {isAnalyzing ? (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-2xl flex flex-col items-center justify-center p-10 text-center z-50 animate-fadeIn">
            <div className="relative w-56 h-56 flex items-center justify-center mb-10">
              {/* Outer Decorative Rings */}
              <div className="absolute inset-0 rounded-full border border-green-100/50 animate-[spin_12s_linear_infinite]"></div>
              <div className="absolute inset-4 rounded-full border border-green-200/50 animate-[spin_8s_linear_infinite_reverse]"></div>
              
              <svg className="absolute w-full h-full -rotate-90">
                <circle
                  cx="112" cy="112" r="60"
                  stroke="#f1f5f9" strokeWidth="6" fill="transparent"
                />
                <circle
                  cx="112" cy="112" r="60"
                  stroke="#22c55e" strokeWidth="6" fill="transparent"
                  strokeDasharray={2 * Math.PI * 60}
                  strokeDashoffset={(2 * Math.PI * 60) - (loadingProgress / 100) * (2 * Math.PI * 60)}
                  strokeLinecap="round"
                  className="transition-all duration-300 ease-out"
                />
              </svg>
              
              <div className="z-10 bg-white w-32 h-32 rounded-full flex flex-col items-center justify-center shadow-2xl border border-green-50 animate-pulse">
                <i className="fas fa-microscope text-4xl text-green-500 mb-2"></i>
                <span className="text-xl font-black text-slate-800">{Math.round(loadingProgress)}%</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <span className="text-[10px] font-black text-slate-400 tracking-[0.4em] uppercase">Processing Data</span>
              <h4 className="text-sm font-bold text-slate-700 h-6">
                {statusMessages[statusIndex]}
              </h4>
              <div className="flex space-x-1 justify-center mt-2">
                {[0, 1, 2].map(i => (
                  <div key={i} className={`w-1.5 h-1.5 rounded-full bg-green-500 transition-all duration-300 ${statusIndex % 3 === i ? 'scale-125 opacity-100' : 'scale-75 opacity-30'}`}></div>
                ))}
              </div>
            </div>
          </div>
        ) : isWebcamActive ? (
          <div className="w-full h-full relative">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[10s]"
            />
            {/* Viewfinder Overlay */}
            <div className="absolute inset-0 pointer-events-none p-8">
              <div className="w-full h-full border-2 border-white/10 rounded-[2rem] relative overflow-hidden">
                 {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-green-500/60 rounded-tl-2xl"></div>
                <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-green-500/60 rounded-tr-2xl"></div>
                <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-green-500/60 rounded-bl-2xl"></div>
                <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-green-500/60 rounded-br-2xl"></div>
                
                {/* Dynamic Scan Line */}
                <div className="scan-line"></div>
              </div>
            </div>

            {/* Micro-Target UI */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 pointer-events-none">
               <div className="absolute inset-0 border border-white/30 rounded-full animate-ping"></div>
               <div className="absolute inset-4 border border-white/50 rounded-full"></div>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full"></div>
            </div>
            
            <button 
              onClick={capturePhoto}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center group/btn"
            >
               <div className="bg-white/90 backdrop-blur-xl w-20 h-20 rounded-full p-1.5 shadow-2xl border-4 border-white active:scale-90 transition-all">
                  <div className="w-full h-full rounded-full border-2 border-green-500 flex items-center justify-center group-hover/btn:bg-green-500 transition-colors">
                    <i className="fas fa-camera text-2xl text-green-600 group-hover/btn:text-white transition-colors"></i>
                  </div>
               </div>
               <span className="mt-3 text-[10px] font-black text-white uppercase tracking-widest drop-shadow-md">Analyze Polymer</span>
            </button>
          </div>
        ) : (
          <div 
            onClick={startWebcam}
            className="w-full h-full flex flex-col items-center justify-center bg-white cursor-pointer group p-12 text-center"
          >
            <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-8 text-slate-300 group-hover:text-green-500 group-hover:bg-green-50 group-hover:rotate-6 transition-all duration-500 shadow-inner">
               <i className="fas fa-video-slash text-5xl"></i>
            </div>
            <h3 className="text-slate-800 font-extrabold text-xl mb-3">Vision Offline</h3>
            <p className="text-sm text-slate-400 mb-8 max-w-[240px] leading-relaxed">
              {cameraError || "Enable camera access to begin real-time biodegradation analysis."}
            </p>
            <button 
              onClick={(e) => { e.stopPropagation(); startWebcam(); }}
              className="bg-green-600 text-white px-10 py-4 rounded-2xl text-[10px] font-black tracking-widest shadow-xl shadow-green-100 hover:bg-green-700 transition-all hover:-translate-y-1 active:scale-95 shimmer"
            >
              INITIALIZE SCANNER
            </button>
          </div>
        )}
      </div>

      <div className="mt-10 w-full max-w-sm">
        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={isAnalyzing}
          className="w-full bg-white glass text-slate-700 py-5 rounded-[1.5rem] font-black tracking-widest text-[10px] hover:border-green-300 hover:text-green-600 active:scale-95 transition-all flex items-center justify-center space-x-3 disabled:opacity-50"
        >
          <i className="fas fa-cloud-arrow-up text-base"></i>
          <span>IMPORT MOLECULAR IMAGE</span>
        </button>
      </div>
    </div>
  );
};

export default CameraScanner;
