export class LiveGateway {
  private clients = new Map<string, any>();

  handleConnection(client: any) {
    // Removed console.log
    this.clients.set(client.id, client);
  }

  handleDisconnection(client: any) {
    // Removed console.log
    this.clients.delete(client.id);
  }

  joinSession(clientId: string, sessionId: string) {
    // Removed console.log
  }

  broadcastToSession(sessionId: string, event: string, data: any) {
    // Removed console.log
  }
}
