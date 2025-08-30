'use client';

import { motion } from 'framer-motion';
import { Brain, Target, MessageSquare } from 'lucide-react';

interface PersonalityInsightsProps {
  personality?: {
    type: string;
    traits: string[];
    communicationStyle: string;
    decisionMaking: string;
  };
  recommendations?: string[];
}

export function PersonalityInsights({ personality, recommendations }: PersonalityInsightsProps) {
  if (!personality) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="w-5 h-5 text-purple-600" />
          <h4 className="font-semibold text-gray-900">تحليل الشخصية</h4>
        </div>
        <p className="text-sm text-gray-500">
          لا توجد بيانات كافية لتحليل الشخصية
        </p>
      </div>
    );
  }

  const getPersonalityColor = (type: string) => {
    switch (type) {
      case 'analytical': return 'bg-blue-100 text-blue-800';
      case 'creative': return 'bg-purple-100 text-purple-800';
      case 'practical': return 'bg-green-100 text-green-800';
      case 'social': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPersonalityLabel = (type: string) => {
    switch (type) {
      case 'analytical': return 'تحليلي';
      case 'creative': return 'إبداعي';
      case 'practical': return 'عملي';
      case 'social': return 'اجتماعي';
      default: return type;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border p-6"
    >
      <div className="flex items-center space-x-3 mb-4">
        <Brain className="w-5 h-5 text-purple-600" />
        <h4 className="font-semibold text-gray-900">تحليل الشخصية</h4>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-500 mb-2 block">
            نوع الشخصية
          </label>
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getPersonalityColor(personality.type)}`}>
            {getPersonalityLabel(personality.type)}
          </span>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500 mb-2 block">
            السمات الرئيسية
          </label>
          <div className="flex flex-wrap gap-2">
            {personality.traits.map((trait, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
              >
                {trait}
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500 mb-2 block">
            أسلوب التواصل
          </label>
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-700">{personality.communicationStyle}</span>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500 mb-2 block">
            نمط اتخاذ القرار
          </label>
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-green-500" />
            <span className="text-sm text-gray-700">{personality.decisionMaking}</span>
          </div>
        </div>

        {recommendations && recommendations.length > 0 && (
          <div className="mt-4 p-4 bg-purple-50 rounded-lg border-r-4 border-purple-400">
            <h5 className="font-medium text-purple-900 mb-2">💡 توصيات التواصل</h5>
            <ul className="space-y-1">
              {recommendations.map((rec, index) => (
                <li key={index} className="text-sm text-purple-800 leading-relaxed">
                  • {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
}