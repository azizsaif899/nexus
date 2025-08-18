/**
 * 🔄 Real-time Data Pipeline - TASK-018
 * خط أنابيب البيانات الفورية من Odoo
 */

import { eventBus, EventTypes } from './event-bus';
import { systemWebSocket } from './websocket-client';

export interface DataSource {
  id: string;
  name: string;
  type: 'odoo' | 'database' | 'api' | 'webhook';
  endpoint: string;
  refreshInterval: number;
  lastUpdate: Date;
  isActive: boolean;
}

export interface DataPoint {
  id: string;
  sourceId: string;
  metric: string;
  value: number;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface PipelineConfig {
  sources: DataSource[];
  transformations: DataTransformation[];
  outputs: DataOutput[];
}

export interface DataTransformation {
  id: string;
  name: string;
  type: 'filter' | 'aggregate' | 'calculate' | 'enrich';
  config: Record<string, any>;
}

export interface DataOutput {
  id: string;
  name: string;
  type: 'websocket' | 'event' | 'cache' | 'database';
  config: Record<string, any>;
}

export class DataPipeline {
  private sources: Map<string, DataSource> = new Map();
  private dataCache: Map<string, DataPoint[]> = new Map();
  private intervals: Map<string, NodeJS.Timeout> = new Map();
  private isRunning: boolean = false;

  constructor() {
    this.initializeDefaultSources();
  }

  /**
   * بدء خط الأنابيب
   */
  async start(): Promise<void> {
    if (this.isRunning) return;

    this.isRunning = true;
    console.log('🚀 Starting data pipeline...');

    // بدء جمع البيانات من جميع المصادر
    for (const source of this.sources.values()) {
      if (source.isActive) {
        await this.startDataCollection(source);
      }
    }

    // الاستماع للأحداث
    this.setupEventListeners();

    await eventBus.publish({
      type: 'pipeline.started',
      source: 'data-pipeline',
      data: { sourcesCount: this.sources.size }
    });
  }

  /**
   * إيقاف خط الأنابيب
   */
  async stop(): Promise<void> {
    if (!this.isRunning) return;

    this.isRunning = false;
    console.log('🛑 Stopping data pipeline...');

    // إيقاف جميع الفترات الزمنية
    for (const interval of this.intervals.values()) {
      clearInterval(interval);
    }
    this.intervals.clear();

    await eventBus.publish({
      type: 'pipeline.stopped',
      source: 'data-pipeline',
      data: {}
    });
  }

  /**
   * إضافة مصدر بيانات
   */
  addDataSource(source: DataSource): void {
    this.sources.set(source.id, source);
    
    if (this.isRunning && source.isActive) {
      this.startDataCollection(source);
    }
  }

  /**
   * الحصول على البيانات الحديثة
   */
  getLatestData(sourceId: string, metric?: string): DataPoint[] {
    const data = this.dataCache.get(sourceId) || [];
    
    if (metric) {
      return data.filter(point => point.metric === metric);
    }
    
    return data;
  }

  /**
   * الحصول على البيانات المجمعة
   */
  getAggregatedData(
    sourceId: string, 
    metric: string, 
    aggregation: 'sum' | 'avg' | 'min' | 'max' | 'count'
  ): number {
    const data = this.getLatestData(sourceId, metric);
    
    if (data.length === 0) return 0;
    
    switch (aggregation) {
      case 'sum':
        return data.reduce((sum, point) => sum + point.value, 0);
      case 'avg':
        return data.reduce((sum, point) => sum + point.value, 0) / data.length;
      case 'min':
        return Math.min(...data.map(point => point.value));
      case 'max':
        return Math.max(...data.map(point => point.value));
      case 'count':
        return data.length;
      default:
        return 0;
    }
  }

  /**
   * بدء جمع البيانات من مصدر معين
   */
  private async startDataCollection(source: DataSource): Promise<void> {
    console.log(`📊 Starting data collection from: ${source.name}`);

    // جمع البيانات الأولي
    await this.collectData(source);

    // جدولة جمع البيانات الدوري
    const interval = setInterval(async () => {
      try {
        await this.collectData(source);
      } catch (error) {
        console.error(`❌ Failed to collect data from ${source.name}:`, error);
      }
    }, source.refreshInterval);

    this.intervals.set(source.id, interval);
  }

  /**
   * جمع البيانات من مصدر
   */
  private async collectData(source: DataSource): Promise<void> {
    try {
      let data: DataPoint[] = [];

      switch (source.type) {
        case 'odoo':
          data = await this.collectFromOdoo(source);
          break;
        case 'database':
          data = await this.collectFromDatabase(source);
          break;
        case 'api':
          data = await this.collectFromAPI(source);
          break;
        default:
          console.warn(`Unknown source type: ${source.type}`);
          return;
      }

      // تحديث الكاش
      this.dataCache.set(source.id, data);
      source.lastUpdate = new Date();

      // إرسال البيانات عبر WebSocket
      systemWebSocket.send({
        type: 'data_update',
        sourceId: source.id,
        data: data.slice(-10) // آخر 10 نقاط بيانات
      });

      // إرسال حدث
      await eventBus.publish({
        type: 'pipeline.data_collected',
        source: 'data-pipeline',
        data: { sourceId: source.id, dataPoints: data.length }
      });

    } catch (error) {
      console.error(`❌ Data collection failed for ${source.name}:`, error);
      
      await eventBus.publish({
        type: EventTypes.SYSTEM_ERROR,
        source: 'data-pipeline',
        data: { sourceId: source.id, error: error.message }
      });
    }
  }

  /**
   * جمع البيانات من Odoo
   */
  private async collectFromOdoo(source: DataSource): Promise<DataPoint[]> {
    // محاكاة جمع البيانات من Odoo
    const mockData: DataPoint[] = [
      {
        id: `${source.id}_leads_${Date.now()}`,
        sourceId: source.id,
        metric: 'total_leads',
        value: Math.floor(Math.random() * 100) + 50,
        timestamp: new Date()
      },
      {
        id: `${source.id}_revenue_${Date.now()}`,
        sourceId: source.id,
        metric: 'monthly_revenue',
        value: Math.floor(Math.random() * 500000) + 1000000,
        timestamp: new Date()
      },
      {
        id: `${source.id}_opportunities_${Date.now()}`,
        sourceId: source.id,
        metric: 'open_opportunities',
        value: Math.floor(Math.random() * 50) + 20,
        timestamp: new Date()
      }
    ];

    return mockData;
  }

  /**
   * جمع البيانات من قاعدة البيانات
   */
  private async collectFromDatabase(source: DataSource): Promise<DataPoint[]> {
    // محاكاة جمع البيانات من قاعدة البيانات
    return [
      {
        id: `${source.id}_users_${Date.now()}`,
        sourceId: source.id,
        metric: 'active_users',
        value: Math.floor(Math.random() * 1000) + 500,
        timestamp: new Date()
      }
    ];
  }

  /**
   * جمع البيانات من API خارجي
   */
  private async collectFromAPI(source: DataSource): Promise<DataPoint[]> {
    // محاكاة جمع البيانات من API
    return [
      {
        id: `${source.id}_external_${Date.now()}`,
        sourceId: source.id,
        metric: 'external_metric',
        value: Math.floor(Math.random() * 200) + 100,
        timestamp: new Date()
      }
    ];
  }

  /**
   * إعداد مستمعي الأحداث
   */
  private setupEventListeners(): void {
    eventBus.subscribe('pipeline.refresh_source', async (event: any) => {
      const sourceId = event.data.sourceId;
      const source = this.sources.get(sourceId);
      
      if (source) {
        await this.collectData(source);
      }
    });
  }

  /**
   * تهيئة المصادر الافتراضية
   */
  private initializeDefaultSources(): void {
    const defaultSources: DataSource[] = [
      {
        id: 'odoo-crm',
        name: 'Odoo CRM',
        type: 'odoo',
        endpoint: 'http://localhost:8069/api/crm',
        refreshInterval: 30000, // 30 ثانية
        lastUpdate: new Date(),
        isActive: true
      },
      {
        id: 'main-database',
        name: 'Main Database',
        type: 'database',
        endpoint: 'postgresql://localhost:5432/azizsys',
        refreshInterval: 60000, // دقيقة واحدة
        lastUpdate: new Date(),
        isActive: true
      },
      {
        id: 'external-api',
        name: 'External API',
        type: 'api',
        endpoint: 'https://api.external.com/metrics',
        refreshInterval: 120000, // دقيقتان
        lastUpdate: new Date(),
        isActive: false
      }
    ];

    defaultSources.forEach(source => {
      this.sources.set(source.id, source);
    });
  }

  /**
   * الحصول على حالة خط الأنابيب
   */
  getStatus(): {
    isRunning: boolean;
    sourcesCount: number;
    activeSources: number;
    lastUpdate: Date | null;
  } {
    const activeSources = Array.from(this.sources.values()).filter(s => s.isActive);
    const lastUpdate = activeSources.length > 0 
      ? new Date(Math.max(...activeSources.map(s => s.lastUpdate.getTime())))
      : null;

    return {
      isRunning: this.isRunning,
      sourcesCount: this.sources.size,
      activeSources: activeSources.length,
      lastUpdate
    };
  }
}

// إنشاء خط الأنابيب العام
export const dataPipeline = new DataPipeline();