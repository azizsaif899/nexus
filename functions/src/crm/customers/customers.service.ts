import { Injectable } from '@nestjs/common';
import { Customer } from './dto/customer.dto';

@Injectable()
export class CustomersService {
  private readonly customers: Customer[] = [
    {
      id: '1',
      name: 'أحمد محمد (من الـ API)',
      company: 'شركة التقنية المتقدمة',
      email: 'ahmed.api@tech.com',
      phone: '+966501234567',
      status: 'active',
      value: 45000,
      lastContact: '2024-01-10',
      avatar: 'أ'
    },
    {
      id: '2',
      name: 'سارة أحمد (من الـ API)',
      company: 'مؤسسة الإبداع',
      email: 'sara.api@creative.com',
      phone: '+966507654321',
      status: 'pending',
      value: 32000,
      lastContact: '2024-01-08',
      avatar: 'س'
    },
    {
      id: '3',
      name: 'محمد علي (من الـ API)',
      company: 'شركة النجاح',
      email: 'mohammed.api@success.com',
      phone: '+966509876543',
      status: 'active',
      value: 67000,
      lastContact: '2024-01-12',
      avatar: 'م'
    },
    {
      id: '4',
      name: 'فاطمة خالد (من الـ API)',
      company: 'مجموعة الرؤية',
      email: 'fatima.api@vision.com',
      phone: '+966502468135',
      status: 'inactive',
      value: 18000,
      lastContact: '2024-01-05',
      avatar: 'ف'
    }
  ];

  findAll(): Customer[] {
    return this.customers;
  }
}
