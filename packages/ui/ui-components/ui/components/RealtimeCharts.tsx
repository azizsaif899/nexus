import React, { useState, useEffect } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { motion } from 'framer-motion';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface RealtimeChartsProps {
  data: {
    revenue: number[];
    costs: number[];
    profit: number[];
    labels: string[];
  };
  predictions?: {
    revenue: number[];
    costs: number[];
    confidence: number[];
  };
  isSimulating?: boolean;
}

export const RealtimeCharts: React.FC<RealtimeChartsProps> = ({
  data,
  predictions,
  isSimulating = false
}) => {
  const [animatedData, setAnimatedData] = useState(data);

  useEffect(() => {
    if (isSimulating) {
      const interval = setInterval(() => {
        setAnimatedData(prev => ({
          ...prev,
          revenue: prev.revenue.map(val => val + (Math.random() - 0.5) * 1000),
          costs: prev.costs.map(val => val + (Math.random() - 0.5) * 500),
          profit: prev.profit.map(val => val + (Math.random() - 0.5) * 800)
        }));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isSimulating]);

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Revenue vs Costs Trend'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    },
    animation: {
      duration: isSimulating ? 500 : 1000
    }
  };

  const lineChartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Revenue',
        data: animatedData.revenue,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Costs',
        data: animatedData.costs,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4
      },
      ...(predictions ? [{
        label: 'Revenue Prediction',
        data: predictions.revenue,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.05)',
        borderDash: [5, 5],
        fill: false,
        tension: 0.4
      }] : [])
    ]
  };

  const profitChartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Profit',
        data: animatedData.profit,
        backgroundColor: animatedData.profit.map(val => 
          val >= 0 ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.8)'
        ),
        borderColor: animatedData.profit.map(val => 
          val >= 0 ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'
        ),
        borderWidth: 2
      }
    ]
  };

  const kpiData = {
    labels: ['Revenue', 'Costs', 'Profit'],
    datasets: [
      {
        data: [
          animatedData.revenue.reduce((a, b) => a + b, 0),
          animatedData.costs.reduce((a, b) => a + b, 0),
          animatedData.profit.reduce((a, b) => a + b, 0)
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(59, 130, 246, 0.8)'
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(239, 68, 68)',
          'rgb(59, 130, 246)'
        ],
        borderWidth: 2
      }
    ]
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 rounded-lg p-6"
      >
        <div className="h-80">
          <Line data={lineChartData} options={lineChartOptions} />
        </div>
        {isSimulating && (
          <div className="mt-4 flex items-center justify-center">
            <div className="flex items-center space-x-2 text-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm">Live Simulation Active</span>
            </div>
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-800 rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Profit Analysis</h3>
        <div className="h-80">
          <Bar data={profitChartData} options={lineChartOptions} />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-800 rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">KPI Overview</h3>
        <div className="h-80">
          <Doughnut data={kpiData} />
        </div>
      </motion.div>

      {predictions && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Confidence Levels</h3>
          <div className="space-y-4">
            {predictions.confidence.map((conf, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-300">Period {index + 1}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${conf * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-400">{Math.round(conf * 100)}%</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};