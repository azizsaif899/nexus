import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { OdooClient } from '@g-assistant/odoo-client';

@Controller('api/leads')
export class LeadsController {
  private odooClient: OdooClient;

  constructor() {
    this.odooClient = new OdooClient({
      url: process.env.ODOO_URL!,
      database: process.env.ODOO_DATABASE!,
      username: process.env.ODOO_USERNAME!,
      password: process.env.ODOO_PASSWORD!
    });
  }

  @Get()
  async getAllLeads() {
    try {
      const leads = await this.odooClient.getLeads();
      return { success: true, data: leads };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Get('stages')
  async getStages() {
    try {
      const stages = await this.odooClient.getStages();
      return { success: true, data: stages };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Put(':id/stage')
  async updateLeadStage(@Param('id') id: string, @Body() body: { stageId: number }) {
    try {
      const success = await this.odooClient.updateLead(parseInt(id), { 
        stage_id: body.stageId 
      });
      return { success };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}