@echo off
echo Setting up PostgreSQL database...

echo Step 1: Creating database...
"C:\Program Files\PostgreSQL\17\bin\psql" -U postgres -c "CREATE DATABASE workflows_db;"

echo Step 2: Running initialization script...
"C:\Program Files\PostgreSQL\17\bin\psql" -U postgres -d workflows_db -f apps/api/src/database/init.sql

echo Database setup complete!
pause