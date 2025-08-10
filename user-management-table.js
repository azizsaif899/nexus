// TASK-ADMIN-002: User management table for admin dashboard
class UserManagementTable {
  constructor() {
    this.users = [];
  }
  
  async fetchUsers() {
    // Mock API call
    this.users = [
      { id: 1, name: 'Ahmed Ali', email: 'ahmed@example.com', plan: 'Premium', status: 'Active' },
      { id: 2, name: 'Sara Mohamed', email: 'sara@example.com', plan: 'Basic', status: 'Active' },
      { id: 3, name: 'Omar Hassan', email: 'omar@example.com', plan: 'Pro', status: 'Inactive' }
    ];
    
    console.log('👥 Users fetched:', this.users.length);
    return this.users;
  }
  
  renderTable() {
    console.log('📊 Rendering user management table');
    return this.users.map(user => 
      `<tr><td>${user.name}</td><td>${user.email}</td><td>${user.plan}</td><td>${user.status}</td></tr>`
    ).join('');
  }
}

new UserManagementTable().fetchUsers();