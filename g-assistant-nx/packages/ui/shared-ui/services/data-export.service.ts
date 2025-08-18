export class DataExportService {
  private apiUrl = 'http://localhost:3333';

  async exportUsers(format: 'json' | 'csv'): Promise<any> {
    const response = await fetch(`${this.apiUrl}/api/admin/export/users?format=${format}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
    });
    return await response.json();
  }

  async exportConversations(format: 'json' | 'csv'): Promise<any> {
    const response = await fetch(`${this.apiUrl}/api/admin/export/conversations?format=${format}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
    });
    return await response.json();
  }

  async importData(file: File, type: string): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await fetch(`${this.apiUrl}/api/admin/import`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
      body: formData
    });
    return await response.json();
  }
}