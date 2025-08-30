const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function initDatabase() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: 'postgres'
  });

  try {
    await client.connect();
    console.log('✅ متصل بـ PostgreSQL');

    const sqlPath = path.join(__dirname, '../src/database/init.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    const commands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd && !cmd.startsWith('--') && !cmd.startsWith('\\c'));

    for (const command of commands) {
      if (command.includes('CREATE DATABASE')) {
        try {
          await client.query(command);
          console.log('✅ تم إنشاء قاعدة البيانات');
        } catch (err) {
          if (err.code === '42P04') {
            console.log('ℹ️ قاعدة البيانات موجودة مسبقاً');
          } else {
            throw err;
          }
        }
      }
    }

    await client.end();

    const workflowClient = new Client({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: 'workflows_db'
    });

    await workflowClient.connect();
    console.log('✅ متصل بقاعدة بيانات workflows_db');

    for (const command of commands) {
      if (!command.includes('CREATE DATABASE') && command.length > 0) {
        try {
          await workflowClient.query(command);
          console.log(`✅ تم تنفيذ: ${command.substring(0, 50)}...`);
        } catch (err) {
          if (err.code === '42P07') {
            console.log(`ℹ️ الجدول موجود مسبقاً: ${command.substring(0, 30)}...`);
          } else {
            console.error(`❌ خطأ في: ${command.substring(0, 30)}...`);
            console.error(err.message);
          }
        }
      }
    }

    await workflowClient.end();
    console.log('🎉 تم إعداد قاعدة البيانات بنجاح!');

  } catch (error) {
    console.error('❌ خطأ في إعداد قاعدة البيانات:', error.message);
    process.exit(1);
  }
}

initDatabase();