
import React, { useState } from 'react';
import { DatasetPlastic, DatasetEnzyme } from '../types';

const plasticsData: DatasetPlastic[] = [
  {
    code: 1, name: 'PET', fullName: 'Polyethylene Terephthalate',
    properties: ['High Clarity', 'Shatterproof', 'Oxygen Barrier'],
    commonUses: ['Soda bottles', 'Water bottles', 'Fibers/Clothing'],
    degradability: 'Moderate'
  },
  {
    code: 2, name: 'HDPE', fullName: 'High-Density Polyethylene',
    properties: ['Chemical Resistant', 'High Strength', 'Opaque'],
    commonUses: ['Milk jugs', 'Detergent bottles', 'Toys'],
    degradability: 'Low'
  },
  {
    code: 3, name: 'PVC', fullName: 'Polyvinyl Chloride',
    properties: ['Flame Retardant', 'Durable', 'Stable'],
    commonUses: ['Pipes', 'Credit cards', 'Window frames'],
    degradability: 'Low'
  },
  {
    code: 4, name: 'LDPE', fullName: 'Low-Density Polyethylene',
    properties: ['Flexible', 'Tough', 'Transparent'],
    commonUses: ['Grocery bags', 'Cling wrap', 'Squeeze bottles'],
    degradability: 'Moderate'
  },
  {
    code: 5, name: 'PP', fullName: 'Polypropylene',
    properties: ['High Heat Resistance', 'Fatigue Resistant', 'Odorless'],
    commonUses: ['Yogurt containers', 'Medicine caps', 'Auto components'],
    degradability: 'Low'
  },
  {
    code: 6, name: 'PS', fullName: 'Polystyrene',
    properties: ['Stiff', 'Brittle', 'Excellent Insulator'],
    commonUses: ['Disposable cups', 'Egg cartons', 'Casings'],
    degradability: 'Low'
  }
];

const enzymesData: DatasetEnzyme[] = [
  { name: 'IsPETase', targetPolymer: 'PET', discoveryYear: '2016', organism: 'Ideonella sakaiensis', efficiencyRating: 5 },
  { name: 'MHETase', targetPolymer: 'PET-Intermediate', discoveryYear: '2016', organism: 'Ideonella sakaiensis', efficiencyRating: 4 },
  { name: 'Cutinase', targetPolymer: 'PET/PCL', discoveryYear: '1980s', organism: 'Humicola insolens', efficiencyRating: 3 },
  { name: 'LCC', targetPolymer: 'PET', discoveryYear: '2020', organism: 'Leaf-Branch Compost', efficiencyRating: 5 },
  { name: 'BhrPETase', targetPolymer: 'PET', discoveryYear: '2021', organism: 'Metagenomic Clone', efficiencyRating: 4 }
];

interface DatasetViewProps {
  onBack: () => void;
}

const DatasetView: React.FC<DatasetViewProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'plastics' | 'enzymes'>('plastics');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPlastics = plasticsData.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredEnzymes = enzymesData.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.targetPolymer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fadeIn pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Biological Catalog</h2>
          <p className="text-slate-500 text-sm font-medium">Peer-reviewed reference library.</p>
        </div>
        <button 
          onClick={onBack}
          className="bg-white shadow-sm border border-slate-200 px-8 py-3.5 rounded-[1.25rem] text-[10px] font-black text-slate-700 hover:border-green-500 hover:text-green-600 transition-all flex items-center space-x-3 active:scale-95"
        >
          <i className="fas fa-chevron-left"></i>
          <span>CLOSE DATABASE</span>
        </button>
      </div>

      {/* Segmented Control */}
      <div className="bg-slate-200/50 p-1.5 rounded-[1.75rem] flex mb-10">
        <button 
          onClick={() => setActiveTab('plastics')}
          className={`flex-1 py-4 rounded-[1.5rem] text-[10px] font-black tracking-widest transition-all duration-300 ${activeTab === 'plastics' ? 'bg-white text-green-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
        >
          POLYMER STRUCTURES
        </button>
        <button 
          onClick={() => setActiveTab('enzymes')}
          className={`flex-1 py-4 rounded-[1.5rem] text-[10px] font-black tracking-widest transition-all duration-300 ${activeTab === 'enzymes' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
        >
          BIOCATALYST REPO
        </button>
      </div>

      {/* Search Container */}
      <div className="relative mb-10 group">
        <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none">
          <i className="fas fa-search text-slate-300 group-focus-within:text-green-500 transition-colors"></i>
        </div>
        <input 
          type="text" 
          placeholder={`Search ${activeTab === 'plastics' ? 'polymeric materials' : 'available enzymes'}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border-2 border-slate-50 rounded-[2rem] py-6 pl-16 pr-8 text-sm font-semibold text-slate-800 focus:border-green-200 focus:ring-8 focus:ring-green-50 transition-all outline-none shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activeTab === 'plastics' ? (
          filteredPlastics.map((plastic) => (
            <div key={plastic.code} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-slate-50 rounded-full group-hover:bg-green-50 transition-colors"></div>
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center space-x-5">
                    <div className="w-16 h-16 bg-slate-100 rounded-[1.5rem] flex flex-col items-center justify-center text-slate-800 font-black border border-slate-200 group-hover:bg-green-600 group-hover:text-white group-hover:border-green-600 transition-all duration-500">
                      <span className="text-[8px] mb-1 opacity-60">RIC</span>
                      <span className="text-2xl leading-none">{plastic.code}</span>
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 text-xl group-hover:text-green-600 transition-colors">{plastic.name}</h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{plastic.fullName}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                   <div className="flex flex-wrap gap-2">
                     {plastic.commonUses.map((use, i) => (
                       <span key={i} className="text-[9px] font-black text-slate-500 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 uppercase tracking-tighter hover:bg-white transition-colors">
                         {use}
                       </span>
                     ))}
                   </div>
                   <div className="pt-6 border-t border-slate-50 space-y-3">
                      <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Molecular Traits</div>
                      <div className="grid grid-cols-1 gap-2">
                         {plastic.properties.map((p, i) => (
                           <div key={i} className="text-[11px] font-bold text-slate-600 flex items-center space-x-3">
                             <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                             <span>{p}</span>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          filteredEnzymes.map((enzyme, idx) => (
            <div key={idx} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group relative overflow-hidden">
               <div className="flex items-start justify-between mb-8">
                 <div className="flex items-center space-x-5">
                   <div className="w-16 h-16 bg-blue-50 rounded-[1.5rem] flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                      <i className="fas fa-atom text-2xl"></i>
                   </div>
                   <div>
                     <h3 className="font-black text-slate-900 text-xl">{enzyme.name}</h3>
                     <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-0.5">Focus: {enzyme.targetPolymer}</p>
                   </div>
                 </div>
                 <div className="flex space-x-1 pt-3">
                    {[1, 2, 3, 4, 5].map(s => (
                      <div key={s} className={`w-1.5 h-4 rounded-full transition-all duration-500 ${s <= enzyme.efficiencyRating ? 'bg-amber-400' : 'bg-slate-100'}`}></div>
                    ))}
                 </div>
               </div>
               
               <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-slate-50">
                  <div className="bg-slate-50/50 p-5 rounded-[1.5rem] border border-slate-100 flex flex-col justify-center">
                     <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Discovery Source</span>
                     <span className="text-[11px] font-black text-slate-800 italic leading-tight">{enzyme.organism}</span>
                  </div>
                  <div className="bg-slate-50/50 p-5 rounded-[1.5rem] border border-slate-100 flex flex-col items-center justify-center">
                     <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Registry Year</span>
                     <span className="text-xl font-black text-slate-800">{enzyme.discoveryYear}</span>
                  </div>
               </div>
            </div>
          ))
        )}
      </div>

      {(activeTab === 'plastics' ? filteredPlastics : filteredEnzymes).length === 0 && (
        <div className="py-32 text-center animate-fadeIn">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-200">
            <i className="fas fa-search-minus text-4xl"></i>
          </div>
          <h4 className="text-slate-800 font-black mb-2">No Matching Data Found</h4>
          <p className="text-slate-400 text-sm font-medium">Refine your search parameters or explore the other tab.</p>
        </div>
      )}
    </div>
  );
};

export default DatasetView;
