
export interface Enzyme {
  name: string;
  source: string;
  description: string;
  efficiency: string; // e.g., "85% in 48h"
  optimizedByAI: boolean;
  optimizationSuggestions?: string; // New: Recommendations for increasing efficiency
}

export interface PlasticAnalysis {
  type: string;
  resinCode: number;
  fullTitle: string;
  confidence: number;
  description: string;
  environmentalImpact: string;
  recommendedEnzymes: Enzyme[];
}

export interface ScanHistoryItem {
  id: string;
  timestamp: number;
  imageUrl: string;
  analysis: PlasticAnalysis;
}

export interface DatasetPlastic {
  code: number;
  name: string;
  fullName: string;
  properties: string[];
  commonUses: string[];
  degradability: 'Low' | 'Moderate' | 'High';
}

export interface DatasetEnzyme {
  name: string;
  targetPolymer: string;
  discoveryYear: string;
  organism: string;
  efficiencyRating: number; // 1-5
}
