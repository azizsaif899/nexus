import { Injectable } from '@nestjs/common';

@Injectable()
export class AutoScaler {
  private currentInstances = 3;
  private minInstances = 2;
  private maxInstances = 20;

  async checkMetrics(): Promise<void> {
    const cpuUsage = await this.getCPUUsage();
    const memoryUsage = await this.getMemoryUsage();
    const requestRate = await this.getRequestRate();

    if (cpuUsage > 80 || memoryUsage > 85 || requestRate > 1000) {
      await this.scaleUp();
    } else if (cpuUsage < 30 && memoryUsage < 40 && requestRate < 200) {
      await this.scaleDown();
    }
  }

  private async scaleUp(): Promise<void> {
    if (this.currentInstances < this.maxInstances) {
      this.currentInstances++;
      // Removed console.log
    }
  }

  private async scaleDown(): Promise<void> {
    if (this.currentInstances > this.minInstances) {
      this.currentInstances--;
      // Removed console.log
    }
  }

  private async getCPUUsage(): Promise<number> {
    return Math.random() * 100;
  }

  private async getMemoryUsage(): Promise<number> {
    return Math.random() * 100;
  }

  private async getRequestRate(): Promise<number> {
    return Math.random() * 2000;
  }
}