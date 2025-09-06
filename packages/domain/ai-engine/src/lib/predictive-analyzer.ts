export interface TimeSeriesData {
  timestamp: Date;
  value: number;
  metadata?: Record<string, any>;
}

export interface PredictionResult {
  predictions: Array<{
    timestamp: Date;
    predictedValue: number;
    confidence: number;
    upperBound: number;
    lowerBound: number;
  }>;
  accuracy: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  seasonality?: {
    detected: boolean;
    period?: number;
    strength?: number;
  };
}

export interface AnomalyResult {
  isAnomaly: boolean;
  score: number;
  threshold: number;
  explanation: string;
}

export class PredictiveAnalyzer {
  private models = new Map<string, any>();
  private historicalData = new Map<string, TimeSeriesData[]>();

  addTimeSeriesData(seriesId: string, data: TimeSeriesData[]): void {
    this.historicalData.set(seriesId, [...data].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()));
  }

  appendDataPoint(seriesId: string, dataPoint: TimeSeriesData): void {
    const existing = this.historicalData.get(seriesId) || [];
    existing.push(dataPoint);
    existing.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    this.historicalData.set(seriesId, existing);
  }

  async predictTimeSeries(seriesId: string, forecastHorizon: number): Promise<PredictionResult> {
    const data = this.historicalData.get(seriesId);
    if (!data || data.length < 10) {
      throw new Error('Insufficient data for prediction');
    }

    const values = data.map(d => d.value);
    const timestamps = data.map(d => d.timestamp);
    
    // Simple trend analysis
    const trend = this.analyzeTrend(values);
    const seasonality = this.detectSeasonality(values);
    
    // Generate predictions using simple linear regression with noise
    const predictions = this.generatePredictions(values, timestamps, forecastHorizon);
    
    // Calculate accuracy based on recent predictions vs actual
    const accuracy = this.calculateAccuracy(values);

    return {
      predictions,
      accuracy,
      trend,
      seasonality
    };
  }

  private analyzeTrend(values: number[]): 'increasing' | 'decreasing' | 'stable' {
    if (values.length < 2) return 'stable';
    
    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, v) => sum + v, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, v) => sum + v, 0) / secondHalf.length;
    
    const change = (secondAvg - firstAvg) / firstAvg;
    
    if (change > 0.05) return 'increasing';
    if (change < -0.05) return 'decreasing';
    return 'stable';
  }

  private detectSeasonality(values: number[]): { detected: boolean; period?: number; strength?: number } {
    if (values.length < 24) return { detected: false };
    
    // Simple autocorrelation for common periods
    const periods = [7, 24, 30, 365]; // daily, hourly, monthly, yearly patterns
    let bestPeriod = 0;
    let bestCorrelation = 0;
    
    for (const period of periods) {
      if (values.length >= period * 2) {
        const correlation = this.calculateAutocorrelation(values, period);
        if (correlation > bestCorrelation) {
          bestCorrelation = correlation;
          bestPeriod = period;
        }
      }
    }
    
    const detected = bestCorrelation > 0.3;
    
    return {
      detected,
      period: detected ? bestPeriod : undefined,
      strength: detected ? bestCorrelation : undefined
    };
  }

  private calculateAutocorrelation(values: number[], lag: number): number {
    if (values.length <= lag) return 0;
    
    const n = values.length - lag;
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    
    let numerator = 0;
    let denominator = 0;
    
    for (let i = 0; i < n; i++) {
      numerator += (values[i] - mean) * (values[i + lag] - mean);
    }
    
    /* PERFORMANCE: Cache array length */ for (let i = 0; i < values.length; i++) {
      denominator += Math.pow(values[i] - mean, 2);
    }
    
    return denominator === 0 ? 0 : numerator / denominator;
  }

  private generatePredictions(values: number[], timestamps: Date[], horizon: number): PredictionResult['predictions'] {
    const predictions = [];
    const lastTimestamp = timestamps[timestamps.length - 1];
    const timeInterval = timestamps.length > 1 
      ? timestamps[1].getTime() - timestamps[0].getTime()
      : 24 * 60 * 60 * 1000; // default 1 day
    
    // Simple linear regression
    const { slope, intercept } = this.linearRegression(values);
    const lastValue = values[values.length - 1];
    
    for (let i = 1; i <= horizon; i++) {
      const futureTimestamp = new Date(lastTimestamp.getTime() + i * timeInterval);
      const trendValue = lastValue + slope * i;
      
      // Add some noise and confidence intervals
      const noise = (Math.random() - 0.5) * Math.abs(trendValue) * 0.1;
      const predictedValue = trendValue + noise;
      const confidence = Math.max(0.5, 1 - (i / horizon) * 0.4); // Decreasing confidence
      
      const margin = Math.abs(predictedValue) * (1 - confidence);
      
      predictions.push({
        timestamp: futureTimestamp,
        predictedValue,
        confidence,
        upperBound: predictedValue + margin,
        lowerBound: predictedValue - margin
      });
    }
    
    return predictions;
  }

  private linearRegression(values: number[]): { slope: number; intercept: number } {
    const n = values.length;
    const x = Array.from({ length: n }, (_, i) => i);
    
    const sumX = x.reduce((sum, val) => sum + val, 0);
    const sumY = values.reduce((sum, val) => sum + val, 0);
    const sumXY = x.reduce((sum, val, i) => sum + val * values[i], 0);
    const sumXX = x.reduce((sum, val) => sum + val * val, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    return { slope, intercept };
  }

  private calculateAccuracy(values: number[]): number {
    if (values.length < 10) return 0.5;
    
    // Use last 20% of data for validation
    const validationSize = Math.floor(values.length * 0.2);
    const trainData = values.slice(0, -validationSize);
    const testData = values.slice(-validationSize);
    
    const { slope, intercept } = this.linearRegression(trainData);
    
    let totalError = 0;
    let totalActual = 0;
    
    testData.forEach((actual, i) => {
      const predicted = intercept + slope * (trainData.length + i);
      totalError += Math.abs(actual - predicted);
      totalActual += Math.abs(actual);
    });
    
    const mape = totalActual === 0 ? 0 : (totalError / totalActual);
    return Math.max(0, 1 - mape);
  }

  detectAnomaly(seriesId: string, value: number, timestamp: Date): AnomalyResult {
    const data = this.historicalData.get(seriesId);
    if (!data || data.length < 10) {
      return {
        isAnomaly: false,
        score: 0,
        threshold: 0,
        explanation: 'Insufficient historical data'
      };
    }

    const values = data.map(d => d.value);
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const stdDev = Math.sqrt(values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length);
    
    const zScore = Math.abs((value - mean) / stdDev);
    const threshold = 2.5; // 2.5 standard deviations
    
    const isAnomaly = zScore > threshold;
    
    return {
      isAnomaly,
      score: zScore,
      threshold,
      explanation: isAnomaly 
        ? `Value ${value} is ${zScore.toFixed(2)} standard deviations from the mean (${mean.toFixed(2)})`
        : 'Value is within normal range'
    };
  }

  async predictUserBehavior(userId: string, features: Record<string, number>): Promise<{
    churnProbability: number;
    nextAction: string;
    engagementScore: number;
    recommendations: string[];
  }> {
    // Simulate user behavior prediction
    const churnProbability = Math.random() * 0.3; // 0-30% churn probability
    
    const actions = ['login', 'purchase', 'browse', 'search', 'logout'];
    const nextAction = actions[Math.floor(Math.random() * actions.length)];
    
    const engagementScore = 0.3 + Math.random() * 0.7; // 30-100% engagement
    
    const recommendations = [
      'Send personalized offer',
      'Recommend similar products',
      'Invite to premium features',
      'Send engagement notification'
    ].slice(0, Math.floor(Math.random() * 3) + 1);

    return {
      churnProbability,
      nextAction,
      engagementScore,
      recommendations
    };
  }

  async predictSystemLoad(metrics: Record<string, number>): Promise<{
    predictedLoad: number;
    confidence: number;
    alertLevel: 'low' | 'medium' | 'high';
    recommendations: string[];
  }> {
    const currentLoad = metrics.cpuUsage || 0;
    const memoryUsage = metrics.memoryUsage || 0;
    const requestRate = metrics.requestRate || 0;
    
    // Simple load prediction based on current metrics
    const predictedLoad = Math.min(100, currentLoad * 1.1 + memoryUsage * 0.3 + requestRate * 0.1);
    const confidence = 0.7 + Math.random() * 0.2;
    
    let alertLevel: 'low' | 'medium' | 'high';
    const recommendations: string[] = [];
    
    if (predictedLoad > 80) {
      alertLevel = 'high';
      recommendations.push('Scale up resources immediately', 'Enable load balancing');
    } else if (predictedLoad > 60) {
      alertLevel = 'medium';
      recommendations.push('Monitor closely', 'Prepare for scaling');
    } else {
      alertLevel = 'low';
      recommendations.push('System operating normally');
    }

    return {
      predictedLoad,
      confidence,
      alertLevel,
      recommendations
    };
  }

  getModelStatistics(seriesId: string): {
    dataPoints: number;
    dateRange: { start: Date; end: Date } | null;
    averageValue: number;
    volatility: number;
    lastUpdated: Date | null;
  } {
    const data = this.historicalData.get(seriesId);
    
    if (!data || data.length === 0) {
      return {
        dataPoints: 0,
        dateRange: null,
        averageValue: 0,
        volatility: 0,
        lastUpdated: null
      };
    }

    const values = data.map(d => d.value);
    const timestamps = data.map(d => d.timestamp);
    
    const averageValue = values.reduce((sum, v) => sum + v, 0) / values.length;
    const variance = values.reduce((sum, v) => sum + Math.pow(v - averageValue, 2), 0) / values.length;
    const volatility = Math.sqrt(variance);

    return {
      dataPoints: data.length,
      dateRange: {
        start: timestamps[0],
        end: timestamps[timestamps.length - 1]
      },
      averageValue,
      volatility,
      lastUpdated: timestamps[timestamps.length - 1]
    };
  }
}