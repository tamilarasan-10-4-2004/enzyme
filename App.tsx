
import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import CameraScanner from './components/CameraScanner';
import ResultView from './components/ResultView';
import HistoryView from './components/HistoryView';
import DatasetView from './components/DatasetView';
import { PlasticAnalysis, ScanHistoryItem } from './types';
import { analyzePlasticImage } from './services/geminiService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'result' | 'history' | 'dataset'>('home');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentResult, setCurrentResult] = useState<PlasticAnalysis | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('enzyme_scan_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('enzyme_scan_history', JSON.stringify(history));
  }, [history]);

  const handleScan = async (base64Image: string) => {
    setIsAnalyzing(true);
    setError(null);
    setCurrentImage(base64Image);
    
    try {
      const result = await analyzePlasticImage(base64Image);
      setCurrentResult(result);
      
      const newItem: ScanHistoryItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        imageUrl: base64Image,
        analysis: result
      };
      
      setHistory(prev => [newItem, ...prev].slice(0, 20)); // Keep last 20
      setCurrentView('result');
    } catch (err: any) {
      setError(err.message || "Failed to analyze image. Please try again.");
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetScanner = () => {
    setCurrentResult(null);
    setCurrentImage(null);
    setCurrentView('home');
    setError(null);
  };

  const viewHistoryItem = (item: ScanHistoryItem) => {
    setCurrentResult(item.analysis);
    setCurrentImage(item.imageUrl);
    setCurrentView('result');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header 
        onHome={() => setCurrentView('home')} 
        onHistory={() => setCurrentView('history')}
        onDataset={() => setCurrentView('dataset')}
        activeView={currentView}
      />
      
      <main className="flex-grow container mx-auto px-4 py-6 max-w-2xl">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded shadow-sm">
            <div className="flex items-center">
              <i className="fas fa-exclamation-circle text-red-500 mr-3"></i>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {currentView === 'home' && (
          <div className="space-y-8 text-center animate-fadeIn">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-slate-800">Identify & Degrade</h1>
              <p className="text-slate-600">Scan plastic waste to find optimized biological solutions for its breakdown.</p>
            </div>
            
            <CameraScanner onScan={handleScan} isAnalyzing={isAnalyzing} />
            
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div 
                onClick={() => setCurrentView('dataset')}
                className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center cursor-pointer hover:border-green-300 transition-all group"
              >
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3 text-xl group-hover:scale-110 transition-transform">
                  <i className="fas fa-database"></i>
                </div>
                <h3 className="font-semibold text-slate-800">Bio Dataset</h3>
                <p className="text-xs text-slate-500 mt-1">Browse polymer types and enzyme libraries.</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3 text-xl">
                  <i className="fas fa-microscope"></i>
                </div>
                <h3 className="font-semibold text-slate-800">Enzyme Recs</h3>
                <p className="text-xs text-slate-500 mt-1">Curated suggestions for optimized biocatalysts.</p>
              </div>
            </div>
          </div>
        )}

        {currentView === 'result' && currentResult && currentImage && (
          <ResultView 
            analysis={currentResult} 
            imageUrl={currentImage} 
            onBack={resetScanner} 
          />
        )}

        {currentView === 'history' && (
          <HistoryView 
            items={history} 
            onViewItem={viewHistoryItem}
            onClear={() => setHistory([])}
          />
        )}

        {currentView === 'dataset' && (
          <DatasetView onBack={() => setCurrentView('home')} />
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-4 px-4 text-center">
        <p className="text-xs text-slate-400">
          Powered by Gemini AI • Supporting Sustainable Waste Management
        </p>
      </footer>
    </div>
  );
};

export default App;
