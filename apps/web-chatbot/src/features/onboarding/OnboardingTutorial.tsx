
import React, { useState } from 'react';

const steps = [
  {
    title: 'Welcome to G-Assistant',
    content: 'This tutorial will guide you through the main features.'
  },
  {
    title: 'Step 1: Ask a Question',
    content: 'Use the input bar at the bottom to ask any question.'
  },
  {
    title: 'Step 2: View the Response',
    content: 'The AI response will appear here. You can also see the thinking process.'
  },
  {
    title: 'Step 3: Explore the Tools',
    content: 'Use the sidebar to explore different tools and agents.'
  }
];

const OnboardingTutorial = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    setCurrentStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
  };

  const handlePrev = () => {
    setCurrentStep(prev => (prev > 0 ? prev - 1 : prev));
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-100">
      <h2 className="text-xl font-bold mb-2">{steps[currentStep].title}</h2>
      <p className="mb-4">{steps[currentStep].content}</p>
      <div className="flex justify-between">
        <button 
          onClick={handlePrev} 
          disabled={currentStep === 0}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button 
          onClick={handleNext} 
          disabled={currentStep === steps.length - 1}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default OnboardingTutorial;
