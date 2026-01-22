
import React from 'react';

interface HeaderProps {
  onHome: () => void;
  onHistory: () => void;
  onDataset: () => void;
  activeView: string;
}

const Header: React.FC<HeaderProps> = ({ onHome, onHistory, onDataset, activeView }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 px-4 py-3">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        <div 
          className="flex items-center space-x-2 cursor-pointer"
          onClick={onHome}
        >
          <div className="bg-green-600 text-white w-8 h-8 rounded-lg flex items-center justify-center">
            <i className="fas fa-dna text-sm"></i>
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-800">EnzymeScan</span>
        </div>
        
        <nav className="flex space-x-1">
          <button 
            onClick={onHome}
            title="Scan"
            className={`p-2 rounded-lg transition-colors ${activeView === 'home' || activeView === 'result' ? 'bg-slate-100 text-green-600' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <i className="fas fa-camera text-lg"></i>
          </button>
          <button 
            onClick={onDataset}
            title="Dataset"
            className={`p-2 rounded-lg transition-colors ${activeView === 'dataset' ? 'bg-slate-100 text-green-600' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <i className="fas fa-database text-lg"></i>
          </button>
          <button 
            onClick={onHistory}
            title="History"
            className={`p-2 rounded-lg transition-colors ${activeView === 'history' ? 'bg-slate-100 text-green-600' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <i className="fas fa-history text-lg"></i>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
