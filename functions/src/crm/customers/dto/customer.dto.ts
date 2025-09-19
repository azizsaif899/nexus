export class Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: 'active' | 'pending' | 'inactive';
  value: number;
  lastContact: string;
  avatar: string;
}
