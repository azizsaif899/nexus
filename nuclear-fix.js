const fs = require('fs');
const path = require('path');

console.log('🚀 Nuclear Fix - Starting complete rebuild...');

// 1. Create minimal main.ts
const mainContent = `import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3000);
  console.log('🚀 API Server running on http://localhost:3000');
}
bootstrap();
`;

// 2. Create minimal app.module.ts
const appModuleContent = `import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
`;

// 3. Create minimal app.controller.ts
const appControllerContent = `import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return 'Hello World! API is running successfully!';
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      message: 'API is healthy'
    };
  }
}
`;

// 4. Create minimal tsconfig.json
const tsConfigContent = {
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2020",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": false,
    "noImplicitAny": false,
    "strictBindCallApply": false,
    "forceConsistentCasingInFileNames": false,
    "noFallthroughCasesInSwitch": false
  }
};

// Write files
fs.writeFileSync('apps/api/src/main.ts', mainContent);
fs.writeFileSync('apps/api/src/app.module.ts', appModuleContent);
fs.writeFileSync('apps/api/src/app.controller.ts', appControllerContent);
fs.writeFileSync('apps/api/tsconfig.json', JSON.stringify(tsConfigContent, null, 2));

// 5. Create minimal package.json for API
const apiPackageJson = {
  "name": "api",
  "version": "1.0.0",
  "scripts": {
    "start": "node dist/main",
    "start:dev": "nest start --watch",
    "build": "nest build"
  },
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/config": "^3.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "reflect-metadata": "^0.1.13",
    "rxjs": "^7.8.1"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "typescript": "^5.0.0"
  }
};

fs.writeFileSync('apps/api/package.json', JSON.stringify(apiPackageJson, null, 2));

// 6. Create nest-cli.json
const nestCliContent = {
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true
  }
};

fs.writeFileSync('apps/api/nest-cli.json', JSON.stringify(nestCliContent, null, 2));

console.log('✅ Nuclear fix complete! Files created:');
console.log('  - apps/api/src/main.ts');
console.log('  - apps/api/src/app.module.ts');
console.log('  - apps/api/src/app.controller.ts');
console.log('  - apps/api/tsconfig.json');
console.log('  - apps/api/package.json');
console.log('  - apps/api/nest-cli.json');
console.log('');
console.log('🚀 Now run: cd apps/api && npm install && npm run start:dev');