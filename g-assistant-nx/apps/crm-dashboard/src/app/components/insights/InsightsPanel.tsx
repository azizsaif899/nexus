'use client';

import { PersonalityInsights } from './PersonalityInsights';
import { AIAnalysis } from './AIAnalysis';
import { EngagementScore } from './EngagementScore';
import { PatternMatching } from './PatternMatching';
import { useCustomerInsights } from '../../hooks/useCustomerInsights';

interface InsightsPanelProps {
  customerId: string;
}

export function InsightsPanel({ customerId }: InsightsPanelProps) {
  const { insights, isLoading } = useCustomerInsights(customerId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          🧠 الرؤى والتحليلات
        </h3>
        <p className="text-sm text-gray-600">
          تحليل ذكي شامل لسلوك العميل وأنماط التفاعل
        </p>
      </div>

      <PersonalityInsights 
        personality={insights?.personality}
        recommendations={insights?.personalityRecommendations}
      />

      <EngagementScore 
        score={insights?.engagementScore}
        trend={insights?.engagementTrend}
        factors={insights?.engagementFactors}
      />

      <PatternMatching 
        similarDeals={insights?.similarDeals}
        successProbability={insights?.successProbability}
        recommendations={insights?.patternRecommendations}
      />

      <AIAnalysis 
        analysis={insights?.aiAnalysis}
        predictions={insights?.predictions}
      />
    </div>
  );
}