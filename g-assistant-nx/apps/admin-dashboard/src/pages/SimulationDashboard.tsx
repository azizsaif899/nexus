import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RealtimeCharts } from '../components/RealtimeCharts';
import { DecisionTree } from '../components/DecisionTree';
import { InteractiveSlider } from '../components/InteractiveSlider';
import { PlayIcon, PauseIcon, StopIcon } from '@heroicons/react/24/solid';

interface SimulationState {
  isRunning: boolean;
  currentScenario: string;
  variables: Record<string, number>;
  results: {
    revenue: number[];
    costs: number[];
    profit: number[];
    labels: string[];
  };
}

export const SimulationDashboard: React.FC = () => {
  const [simulation, setSimulation] = useState<SimulationState>({
    isRunning: false,
    currentScenario: 'base',
    variables: {
      marketGrowth: 5,
      competitionLevel: 3,
      operationalEfficiency: 7,
      customerSatisfaction: 8
    },
    results: {
      revenue: [100000, 105000, 110000, 115000, 120000],
      costs: [80000, 82000, 84000, 86000, 88000],
      profit: [20000, 23000, 26000, 29000, 32000],
      labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5']
    }
  });

  const [decisionTreeData] = useState({
    id: 'root',
    title: 'Market Expansion Strategy',
    description: 'Should we expand to new markets?',
    type: 'decision' as const,
    children: [
      {
        id: 'expand',
        title: 'Expand to New Markets',
        description: 'Invest in market expansion',
        type: 'decision' as const,
        children: [
          {
            id: 'success',
            title: 'Expansion Successful',
            description: 'Market responds positively',
            type: 'outcome' as const,
            probability: 0.7,
            impact: 50000
          },
          {
            id: 'failure',
            title: 'Expansion Fails',
            description: 'Market rejection or poor timing',
            type: 'outcome' as const,
            probability: 0.3,
            impact: -30000
          }
        ]
      },
      {
        id: 'optimize',
        title: 'Optimize Current Operations',
        description: 'Focus on improving existing processes',
        type: 'decision' as const,
        children: [
          {
            id: 'efficiency',
            title: 'Efficiency Gains',
            description: 'Successful optimization',
            type: 'outcome' as const,
            probability: 0.8,
            impact: 25000
          }
        ]
      }
    ]
  });

  const startSimulation = () => {
    setSimulation(prev => ({ ...prev, isRunning: true }));
  };

  const pauseSimulation = () => {
    setSimulation(prev => ({ ...prev, isRunning: false }));
  };

  const stopSimulation = () => {
    setSimulation(prev => ({ 
      ...prev, 
      isRunning: false,
      results: {
        revenue: [100000, 105000, 110000, 115000, 120000],
        costs: [80000, 82000, 84000, 86000, 88000],
        profit: [20000, 23000, 26000, 29000, 32000],
        labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5']
      }
    }));
  };

  const updateVariable = (name: string, value: number) => {
    setSimulation(prev => ({
      ...prev,
      variables: { ...prev.variables, [name]: value }
    }));
  };

  useEffect(() => {
    if (simulation.isRunning) {
      const interval = setInterval(() => {
        setSimulation(prev => ({
          ...prev,
          results: {
            ...prev.results,
            revenue: prev.results.revenue.map(val => 
              val + (Math.random() - 0.5) * 2000 * (prev.variables.marketGrowth / 10)
            ),
            costs: prev.results.costs.map(val => 
              val + (Math.random() - 0.5) * 1000 * (prev.variables.operationalEfficiency / 10)
            ),
            profit: prev.results.profit.map((val, index) => 
              prev.results.revenue[index] - prev.results.costs[index]
            )
          }
        }));
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [simulation.isRunning, simulation.variables]);

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Business Simulation Dashboard</h1>
          <p className="text-gray-400">Real-time scenario modeling and decision analysis</p>
        </motion.div>

        {/* Control Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-lg p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Simulation Controls</h2>
            <div className="flex items-center space-x-3">
              <button
                onClick={startSimulation}
                disabled={simulation.isRunning}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <PlayIcon className="w-4 h-4" />
                <span>Start</span>
              </button>
              <button
                onClick={pauseSimulation}
                disabled={!simulation.isRunning}
                className="flex items-center space-x-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <PauseIcon className="w-4 h-4" />
                <span>Pause</span>
              </button>
              <button
                onClick={stopSimulation}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <StopIcon className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Variable Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(simulation.variables).map(([name, value]) => (
              <div key={name} className="space-y-2">
                <label className="text-white font-medium capitalize">
                  {name.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <InteractiveSlider
                  value={value}
                  min={0}
                  max={10}
                  step={0.1}
                  onChange={(newValue) => updateVariable(name, newValue)}
                  className="w-full"
                />
                <div className="text-sm text-gray-400 text-center">{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Charts Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <RealtimeCharts
            data={simulation.results}
            isSimulating={simulation.isRunning}
            predictions={{
              revenue: simulation.results.revenue.map(val => val * 1.1),
              costs: simulation.results.costs.map(val => val * 1.05),
              confidence: [0.9, 0.85, 0.8, 0.75, 0.7]
            }}
          />
        </motion.div>

        {/* Decision Tree */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <DecisionTree
            data={decisionTreeData}
            onNodeClick={(node) => console.log('Node clicked:', node)}
            onNodeExpand={(nodeId, expanded) => console.log('Node expanded:', nodeId, expanded)}
          />
        </motion.div>

        {/* Status Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Simulation Status</h3>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${simulation.isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
              <span className="text-gray-300">{simulation.isRunning ? 'Running' : 'Stopped'}</span>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Current Scenario</h3>
            <span className="text-blue-400 capitalize">{simulation.currentScenario}</span>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Projected ROI</h3>
            <span className="text-green-400 text-xl font-bold">
              {((simulation.results.profit[simulation.results.profit.length - 1] / simulation.results.revenue[0]) * 100).toFixed(1)}%
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};