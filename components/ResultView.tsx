
import React, { useState, useMemo } from 'react';
import { PlasticAnalysis, Enzyme } from '../types';

interface ResultViewProps {
  analysis: PlasticAnalysis;
  imageUrl: string;
  onBack: () => void;
}

type SortOption = 'default' | 'efficiency' | 'name';
type FilterOption = 'all' | 'ai-optimized';

const ResultView: React.FC<ResultViewProps> = ({ analysis, imageUrl, onBack }) => {
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');

  const getResinColor = (code: number) => {
    const colors: Record<number, string> = {
      1: 'bg-blue-600',
      2: 'bg-green-700',
      3: 'bg-red-600',
      4: 'bg-sky-500',
      5: 'bg-amber-600',
      6: 'bg-purple-600',
      7: 'bg-slate-600'
    };
    return colors[code] || 'bg-slate-600';
  };

  const getEfficiencyValue = (effStr: string) => {
    const match = effStr.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  const getEfficiencyState = (value: number) => {
    if (value >= 75) return { color: 'green', text: 'High', bg: 'bg-green-50', border: 'border-green-100', bar: 'bg-green-500', textCol: 'text-green-600' };
    if (value >= 40) return { color: 'yellow', text: 'Medium', bg: 'bg-yellow-50', border: 'border-yellow-100', bar: 'bg-yellow-500', textCol: 'text-yellow-600' };
    return { color: 'red', text: 'Low', bg: 'bg-red-50', border: 'border-red-100', bar: 'bg-red-500', textCol: 'text-red-600' };
  };

  const filteredAndSortedEnzymes = useMemo(() => {
    let result = [...analysis.recommendedEnzymes];
    if (filterBy === 'ai-optimized') {
      result = result.filter(e => e.optimizedByAI);
    }
    if (sortBy === 'efficiency') {
      result.sort((a, b) => getEfficiencyValue(b.efficiency) - getEfficiencyValue(a.efficiency));
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }
    return result;
  }, [analysis.recommendedEnzymes, sortBy, filterBy]);

  return (
    <div className="animate-fadeIn pb-24">
      <button 
        onClick={onBack}
        className="mb-8 flex items-center space-x-3 text-slate-500 hover:text-green-600 transition-all group"
      >
        <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:shadow-md transition-all">
          <i className="fas fa-arrow-left text-sm"></i>
        </div>
        <span className="font-bold text-sm">New Scan</span>
      </button>

      <div className="glass rounded-[3rem] overflow-hidden">
        {/* Header Hero Area */}
        <div className="relative h-72 overflow-hidden">
          <img 
            src={`data:image/jpeg;base64,${imageUrl}`} 
            alt="Scanned plastic" 
            className="w-full h-full object-cover scale-110 hover:scale-100 transition-transform duration-[5s]"
          />
          <div className="absolute top-8 right-8 animate-scaleIn">
             <div className={`${getResinColor(analysis.resinCode)} text-white w-20 h-20 rounded-[2rem] flex flex-col items-center justify-center shadow-2xl shadow-black/30 border-4 border-white/20 transform hover:-rotate-6 transition-transform`}>
               <span className="text-[10px] font-black opacity-80 mb-1 leading-none">CODE</span>
               <span className="text-4xl font-black leading-none">{analysis.resinCode}</span>
             </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent p-10 flex flex-col justify-end">
            <div className="flex items-center space-x-3 text-green-400 text-[10px] font-black uppercase tracking-[0.3em] mb-3">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span>Molecular Profile Confirmed • {Math.round(analysis.confidence * 100)}% Confidence</span>
            </div>
            <h2 className="text-white text-4xl font-black tracking-tight leading-none">{analysis.fullTitle}</h2>
          </div>
        </div>

        <div className="p-10 space-y-12">
          {/* Details Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
               <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest flex items-center space-x-2">
                 <i className="fas fa-magnifying-glass-atom text-blue-500"></i>
                 <span>Scientific Characteristics</span>
               </h3>
               <p className="text-slate-600 text-sm leading-relaxed font-medium">
                 {analysis.description}
               </p>
            </div>
            <div className="bg-emerald-50/60 rounded-[2rem] p-8 border border-emerald-100 relative group overflow-hidden">
               <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-emerald-100/50 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
               <h4 className="text-emerald-800 text-[10px] font-black uppercase tracking-widest mb-3 flex items-center space-x-2">
                 <i className="fas fa-leaf"></i>
                 <span>Ecological Footprint</span>
               </h4>
               <p className="text-emerald-900 text-xs font-bold leading-relaxed relative z-10">
                 {analysis.environmentalImpact}
               </p>
            </div>
          </section>

          {/* Enzyme Section */}
          <section className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest flex items-center space-x-2">
                <i className="fas fa-vial text-green-500"></i>
                <span>Enzymatic Solutions</span>
              </h3>
              
              <div className="flex items-center space-x-3">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-white/50 border border-slate-200 text-[9px] font-black text-slate-500 px-5 py-2.5 rounded-2xl outline-none hover:border-green-300 transition-all cursor-pointer"
                >
                  <option value="default">SORT BY</option>
                  <option value="efficiency">TOP YIELD</option>
                  <option value="name">ALPHABETICAL</option>
                </select>

                <button 
                  onClick={() => setFilterBy(filterBy === 'all' ? 'ai-optimized' : 'all')}
                  className={`px-6 py-2.5 rounded-2xl text-[9px] font-black tracking-widest transition-all duration-500 flex items-center relative overflow-hidden shadow-sm ${
                    filterBy === 'ai-optimized' 
                      ? 'bg-blue-600 text-white shadow-blue-200' 
                      : 'bg-white/50 text-slate-500 border border-slate-200 hover:bg-white'
                  }`}
                >
                  <i className={`fas ${filterBy === 'ai-optimized' ? 'fa-wand-magic-sparkles' : 'fa-robot'} mr-2`}></i>
                  <span>AI ONLY</span>
                  {filterBy === 'ai-optimized' && <span className="absolute inset-0 bg-white/20 shimmer"></span>}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5">
              {filteredAndSortedEnzymes.map((enzyme, idx) => {
                const efficiencyValue = getEfficiencyValue(enzyme.efficiency);
                const state = getEfficiencyState(efficiencyValue);

                return (
                  <div key={idx} className="bg-white/40 rounded-[2.5rem] p-8 border border-white/60 shadow-sm transition-all hover:shadow-2xl hover:-translate-y-1.5 hover:bg-white group">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                      <div className="flex-grow space-y-4">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-${state.color}-500 group-hover:text-white transition-all duration-300`}>
                            <i className="fas fa-dna text-xl"></i>
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-black text-slate-800 text-lg group-hover:text-green-600 transition-colors">{enzyme.name}</h4>
                              <span className={`${state.bg} ${state.textCol} text-[7px] font-black px-2 py-0.5 rounded uppercase tracking-tighter border ${state.border}`}>
                                {state.text} Capacity
                              </span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Source: {enzyme.source}</span>
                                {enzyme.optimizedByAI && (
                                  <span className="text-[8px] font-black bg-blue-100 text-blue-600 px-2.5 py-1 rounded-full border border-blue-200">AI-ENHANCED</span>
                                )}
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 font-medium italic leading-relaxed pl-16">
                          "{enzyme.description}"
                        </p>

                        {/* Efficiency Improvement Optimization Suggestions */}
                        {(efficiencyValue < 75 || enzyme.optimizationSuggestions) && (
                          <div className="mt-4 pl-16 animate-fadeIn">
                            <div className={`rounded-2xl p-4 border relative overflow-hidden bg-blue-50/30 border-blue-100`}>
                              <div className="absolute top-0 right-0 p-2 opacity-10">
                                <i className={`fas fa-flask-vial text-4xl text-blue-600`}></i>
                              </div>
                              <h5 className={`text-[9px] font-black uppercase tracking-widest mb-1.5 flex items-center text-blue-600`}>
                                <i className="fas fa-microscope mr-2"></i>
                                Efficiency could be improved by:
                              </h5>
                              <p className={`text-[11px] font-bold leading-relaxed text-blue-800`}>
                                {enzyme.optimizationSuggestions || "Applying site-directed mutagenesis to the active site to enhance binding affinity for this specific polymer substrate."}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="w-full sm:w-36 flex-shrink-0">
                        <div className={`rounded-3xl p-5 border flex flex-col items-center transition-all duration-500 ${state.bg} ${state.border} group-hover:bg-green-600 group-hover:border-green-600`}>
                          <span className={`text-2xl font-black transition-colors ${state.textCol} group-hover:text-white`}>
                            {efficiencyValue}%
                          </span>
                          <div className="w-full h-2 bg-slate-200/50 rounded-full mt-2 overflow-hidden border border-slate-200/20">
                             <div 
                               className={`h-full transition-all duration-1000 ${state.bar} group-hover:bg-white`} 
                               style={{width: `${efficiencyValue}%`}}
                             ></div>
                          </div>
                          <span className="text-[8px] font-black text-slate-400 mt-3 uppercase tracking-tighter group-hover:text-white/70">Breakdown Rating</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <div className="pt-6">
            <button 
              className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black text-xs tracking-[0.3em] flex items-center justify-center space-x-4 hover:bg-black transition-all shadow-2xl active:scale-[0.98] group relative overflow-hidden"
              onClick={() => window.print()}
            >
              <i className="fas fa-file-pdf text-lg group-hover:scale-125 transition-transform"></i>
              <span>EXPORT SYNTHESIS PROTOCOL</span>
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity shimmer"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultView;
