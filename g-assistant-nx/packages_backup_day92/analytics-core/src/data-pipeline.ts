import { Injectable } from '@nestjs/common';

export interface PipelineStage {
  name: string;
  processor: (data: any[]) => Promise<any[]>;
  config: Record<string, any>;
}

export interface Pipeline {
  id: string;
  name: string;
  stages: PipelineStage[];
  schedule: string;
  status: 'active' | 'paused' | 'error';
}

@Injectable()
export class DataPipeline {
  private pipelines = new Map<string, Pipeline>();

  createPipeline(name: string, stages: PipelineStage[], schedule = '0 */6 * * *'): Pipeline {
    const pipeline: Pipeline = {
      id: `pipeline-${Date.now()}`,
      name,
      stages,
      schedule,
      status: 'active'
    };

    this.pipelines.set(pipeline.id, pipeline);
    return pipeline;
  }

  async executePipeline(pipelineId: string, inputData: any[]): Promise<any[]> {
    const pipeline = this.pipelines.get(pipelineId);
    if (!pipeline) {
      throw new Error(`Pipeline ${pipelineId} not found`);
    }

    let data = inputData;
    
    for (const stage of pipeline.stages) {
      try {
        data = await stage.processor(data);
      } catch (error) {
        pipeline.status = 'error';
        throw new Error(`Pipeline stage ${stage.name} failed: ${error}`);
      }
    }

    return data;
  }

  // Pre-built processors
  createExtractStage(source: string): PipelineStage {
    return {
      name: 'extract',
      processor: async (data: any[]) => {
        // Simulate data extraction
        return [
          { id: 1, user: 'user1', action: 'login', timestamp: new Date() },
          { id: 2, user: 'user2', action: 'purchase', timestamp: new Date() }
        ];
      },
      config: { source }
    };
  }

  createTransformStage(transformations: string[]): PipelineStage {
    return {
      name: 'transform',
      processor: async (data: any[]) => {
        return data.map(item => ({
          ...item,
          processed: true,
          transformedAt: new Date()
        }));
      },
      config: { transformations }
    };
  }

  createLoadStage(destination: string): PipelineStage {
    return {
      name: 'load',
      processor: async (data: any[]) => {
        // Simulate data loading
        console.log(`Loading ${data.length} records to ${destination}`);
        return data;
      },
      config: { destination }
    };
  }
}