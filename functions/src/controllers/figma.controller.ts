import { Controller, Post, Get } from '@nestjs/common';
import { FigmaIntegrationService } from '../services/figma-integration.service';

@Controller('api/figma')
export class FigmaController {
  constructor(private readonly figmaService: FigmaIntegrationService) {}

  @Get('health')
  healthCheck() {
    return {
      status: 'ok',
      service: 'FigmaIntegration',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Triggers the synchronization process to fetch components from Figma
   * and generate React component code.
   */
  @Post('sync-components')
  async syncComponents() {
    try {
      const generatedComponents = await this.figmaService.syncComponents();
      
      // In a real application, you would save these files to the filesystem.
      // For this PoC, we'll just return the generated code.
      
      return {
        success: true,
        message: `${generatedComponents.length} components synced and code generated.`,
        components: generatedComponents,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to sync components from Figma.',
        error: error.message,
      };
    }
  }
}
