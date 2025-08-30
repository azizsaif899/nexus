import { Controller, Post, Get, Body } from '@nestjs/common';
import { MarketplaceService } from './marketplace.service';

@Controller('marketplace')
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) { }

  @Post('apps')
  async submitApp(@Body() app: any) {
    return this.marketplaceService.submitApp(app);
  }

  @Get('apps')
  async listApps() {
    return this.marketplaceService.listApps();
  }
}
