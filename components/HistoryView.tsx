
import React from 'react';
import { ScanHistoryItem } from '../types';

interface HistoryViewProps {
  items: ScanHistoryItem[];
  onViewItem: (item: ScanHistoryItem) => void;
  onClear: () => void;
}

const getRelativeTime = (timestamp: number) => {
  const now = Date.now();
  const diff = now - timestamp;
  
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  
  return new Date(timestamp).toLocaleDateString();
};

const getResinColor = (code: number) => {
  switch(code) {
    case 1: return 'bg-blue-600';
    case 2: return 'bg-green-700';
    case 3: return 'bg-red-600';
    case 4: return 'bg-blue-400';
    case 5: return 'bg-yellow-600';
    case 6: return 'bg-purple-600';
    default: return 'bg-slate-600';
  }
};

const HistoryView: React.FC<HistoryViewProps> = ({ items, onViewItem, onClear }) => {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-4 animate-fadeIn">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center">
          <i className="fas fa-history text-4xl opacity-20"></i>
        </div>
        <div className="text-center">
          <p className="font-bold text-slate-600">No History Available</p>
          <p className="text-sm max-w-[200px] mt-1">Your polymer analysis results will appear here after scanning.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
           <h2 className="text-xl font-black text-slate-800 tracking-tight">Recent Activity</h2>
           <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
            {items.length} SCANS
           </span>
        </div>
        <button 
          onClick={onClear}
          className="text-[10px] font-black text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors flex items-center space-x-1"
        >
          <i className="fas fa-trash-can"></i>
          <span>Wipe History</span>
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div 
            key={item.id}
            onClick={() => onViewItem(item)}
            className="group bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4 cursor-pointer hover:border-green-400 hover:shadow-md transition-all active:scale-[0.99]"
          >
            {/* Thumbnail with overlay badge */}
            <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 shadow-inner border border-slate-100">
              <img 
                src={`data:image/jpeg;base64,${item.imageUrl}`} 
                alt="Scan preview" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className={`absolute bottom-1 right-1 ${getResinColor(item.analysis.resinCode)} text-white w-7 h-7 rounded-lg flex items-center justify-center shadow-lg border-2 border-white/20`}>
                 <span className="text-xs font-black">{item.analysis.resinCode}</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
            </div>

            <div className="flex-grow min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  {getRelativeTime(item.timestamp)}
                </span>
                <div className="flex -space-x-1">
                   {item.analysis.recommendedEnzymes.slice(0, 3).map((_, i) => (
                     <div key={i} className="w-4 h-4 rounded-full border-2 border-white bg-green-100 flex items-center justify-center">
                        <i className="fas fa-dna text-[6px] text-green-600"></i>
                     </div>
                   ))}
                </div>
              </div>
              <h3 className="font-bold text-slate-800 truncate leading-tight group-hover:text-green-600 transition-colors">
                {item.analysis.fullTitle}
              </h3>
              <div className="flex items-center mt-1.5 space-x-3 text-[11px] text-slate-500">
                 <span className="flex items-center">
                    <i className="fas fa-microscope text-blue-400 mr-1.5"></i>
                    {item.analysis.recommendedEnzymes.length} Catalysts
                 </span>
                 <span className="flex items-center">
                    <i className="fas fa-bullseye text-green-400 mr-1.5"></i>
                    {Math.round(item.analysis.confidence * 100)}% Match
                 </span>
              </div>
            </div>

            <div className="text-slate-200 group-hover:text-green-400 transition-colors pr-1">
              <i className="fas fa-chevron-right text-sm"></i>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryView;
