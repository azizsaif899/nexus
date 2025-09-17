import { Injectable } from '@nestjs/common';

@Injectable()
export class SupportSystem {
  private tickets = new Map<string, any>();

  async createTicket(userId: string, subject: string, description: string, priority: string): Promise<string> {
    const ticketId = `TICKET-${Date.now()}`;
    
    this.tickets.set(ticketId, {
      id: ticketId,
      userId,
      subject,
      description,
      priority,
      status: 'open',
      createdAt: new Date(),
      assignedTo: null
    });

    await this.notifySupport(ticketId);
    return ticketId;
  }

  async assignTicket(ticketId: string, agentId: string): Promise<void> {
    const ticket = this.tickets.get(ticketId);
    if (ticket) {
      ticket.assignedTo = agentId;
      ticket.status = 'assigned';
    }
  }

  async updateTicketStatus(ticketId: string, status: string): Promise<void> {
    const ticket = this.tickets.get(ticketId);
    if (ticket) {
      ticket.status = status;
      ticket.updatedAt = new Date();
    }
  }

  async getTicket(ticketId: string): Promise<any> {
    return this.tickets.get(ticketId);
  }

  private async notifySupport(ticketId: string): Promise<void> {
    // Removed console.log
  }
}