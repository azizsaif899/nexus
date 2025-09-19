import { Controller, Get } from '@nestjs/common';
import { CustomersService } from './customers.service';

@Controller('api/crm/customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  findAll() {
    return this.customersService.findAll();
  }
}
