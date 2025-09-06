import { DataSource } from 'typeorm';
import { UserEntity } from '../user.entity';
import * as bcrypt from 'bcrypt';

export class UserSeeder {
  async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(UserEntity);

    const adminUser = userRepository.create({
      username: 'admin',
      email: 'admin@azizsys.com',
      password: await bcrypt.hash('azizsys2025', 10),
      role: 'admin',
      preferences: {
        language: 'ar',
        theme: 'dark',
        defaultAgent: 'general',
        defaultMode: 'smart'
      }
    });

    const testUser = userRepository.create({
      username: 'testuser',
      email: 'test@azizsys.com',
      password: await bcrypt.hash('test123', 10),
      role: 'user',
      preferences: {
        language: 'ar',
        theme: 'light',
        defaultAgent: 'general',
        defaultMode: 'smart'
      }
    });

    await userRepository.save([adminUser, testUser]);
    // Removed console.log
  }
}
