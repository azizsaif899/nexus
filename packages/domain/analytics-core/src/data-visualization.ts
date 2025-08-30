import { Injectable } from '@nestjs/common';

export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'heatmap' | 'funnel';
  data: any[];
  options: Record<string, any>;
}

export interface Dashboard {
  id: string;
  title: string;
  charts: ChartConfig[];
  filters: Record<string, any>;
}

@Injectable()
export class DataVisualization {
  generateChart(type: ChartConfig['type'], data: any[], options: Record<string, any> = {}): ChartConfig {
    return {
      type,
      data: this.processDataForChart(data, type),
      options: this.getDefaultOptions(type, options)
    };
  }

  createDashboard(title: string, charts: ChartConfig[]): Dashboard {
    return {
      id: `dashboard-${Date.now()}`,
      title,
      charts,
      filters: {}
    };
  }

  private processDataForChart(data: any[], type: ChartConfig['type']): any[] {
    switch (type) {
      case 'line':
        return this.processLineData(data);
      case 'bar':
        return this.processBarData(data);
      case 'pie':
        return this.processPieData(data);
      case 'heatmap':
        return this.processHeatmapData(data);
      case 'funnel':
        return this.processFunnelData(data);
      default:
        return data;
    }
  }

  private processLineData(data: any[]): any[] {
    return data.map(item => ({
      x: item.date || item.time || item.period,
      y: item.value || item.count || item.metric
    }));
  }

  private processBarData(data: any[]): any[] {
    return data.map(item => ({
      label: item.category || item.name || item.label,
      value: item.value || item.count || item.total
    }));
  }

  private processPieData(data: any[]): any[] {
    const total = data.reduce((sum, item) => sum + (item.value || item.count || 0), 0);
    return data.map(item => ({
      label: item.category || item.name || item.label,
      value: item.value || item.count || 0,
      percentage: ((item.value || item.count || 0) / total * 100).toFixed(1)
    }));
  }

  private processHeatmapData(data: any[]): any[] {
    return data.map(item => ({
      x: item.x || item.hour || item.day,
      y: item.y || item.category || item.metric,
      value: item.value || item.intensity || item.count
    }));
  }

  private processFunnelData(data: any[]): any[] {
    return data.map((item, index) => ({
      step: item.step || item.name || `Step ${index + 1}`,
      value: item.value || item.users || item.count,
      conversion: item.conversion || item.rate || 0
    }));
  }

  private getDefaultOptions(type: ChartConfig['type'], customOptions: Record<string, any>): Record<string, any> {
    const defaults = {
      line: {
        responsive: true,
        scales: {
          x: { type: 'time' },
          y: { beginAtZero: true }
        },
        plugins: {
          legend: { display: true },
          tooltip: { enabled: true }
        }
      },
      bar: {
        responsive: true,
        scales: {
          y: { beginAtZero: true }
        },
        plugins: {
          legend: { display: false }
        }
      },
      pie: {
        responsive: true,
        plugins: {
          legend: { position: 'right' },
          tooltip: {
            callbacks: {
              label: (context: any) => `${context.label}: ${context.parsed}%`
            }
          }
        }
      },
      heatmap: {
        responsive: true,
        scales: {
          x: { type: 'category' },
          y: { type: 'category' }
        }
      },
      funnel: {
        responsive: true,
        plugins: {
          legend: { display: false }
        }
      }
    };

    return { ...defaults[type], ...customOptions };
  }
}