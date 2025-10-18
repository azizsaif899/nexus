# 🔄 Migration Guide
## دليل نقل المستخدمين والبيانات الموجودة

---

## 📋 جدول المحتويات

1. [Migration Scenarios](#migration-scenarios)
2. [Pre-Migration Checklist](#pre-migration-checklist)
3. [Data Backup Strategy](#data-backup-strategy)
4. [User Migration Process](#user-migration-process)
5. [Flow Migration](#flow-migration)
6. [Execution History Preservation](#execution-history-preservation)
7. [Rollback Plan](#rollback-plan)
8. [Post-Migration Validation](#post-migration-validation)

---

## 🎯 Migration Scenarios

### Scenario 1: Fresh Start (No Existing Users)
```
✅ Easiest scenario
✅ No migration needed
✅ Start with clean slate
✅ Follow PROFESSIONAL-SERVICE-GUIDE.md
```

### Scenario 2: Existing Activepieces Users (Different Auth)
```
⚠️ Medium complexity
📊 Users have flows in Activepieces with different login
🔧 Need to map existing Activepieces users to Firebase UIDs
📦 Preserve flows and execution history
```

### Scenario 3: Existing Firebase Users (No Activepieces)
```
✅ Easy scenario
✅ Users already in Firebase
✅ Create Activepieces users on first login
✅ No data to migrate
```

### Scenario 4: Separate Systems to Unified
```
⚠️ High complexity
📊 Users in both Firebase AND Activepieces
📊 Different user bases
🔧 Need to merge accounts
📦 Complex data migration
```

---

## ✅ Pre-Migration Checklist

### Week 1: Planning Phase

```bash
[✓] Identify current user count in Activepieces
[✓] Identify current user count in Firebase
[✓] Map users between systems (email as key)
[✓] Count total flows to migrate
[✓] Estimate execution history size
[✓] Calculate migration time
[✓] Schedule maintenance window
[✓] Notify users of migration
[✓] Prepare rollback strategy
[✓] Set up staging environment
```

### Week 2: Preparation Phase

```bash
[✓] Create backup of Activepieces PostgreSQL database
[✓] Export all user data to JSON
[✓] Export all flows to JSON
[✓] Export execution history (last 90 days)
[✓] Test migration scripts in staging
[✓] Verify data integrity
[✓] Test rollback procedure
[✓] Create monitoring dashboards
```

---

## 💾 Data Backup Strategy

### 1. PostgreSQL Full Backup

```bash
# On your local/staging Activepieces server
# Create full database dump

docker exec activepieces-postgres pg_dump \
  -U postgres \
  -d activepieces \
  -F c \
  -f /tmp/activepieces_backup_$(date +%Y%m%d_%H%M%S).dump

# Copy backup file to safe location
docker cp activepieces-postgres:/tmp/activepieces_backup_*.dump \
  ./backups/
```

### 2. Selective Data Export

```typescript
// scripts/export-activepieces-data.ts

import { Pool } from 'pg';
import * as fs from 'fs';

interface UserExport {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  status: string;
  created: string;
  updated: string;
}

interface FlowExport {
  id: string;
  userId: string;
  projectId: string;
  name: string;
  status: string;
  version: object;
  schedule: object | null;
  created: string;
  updated: string;
}

interface FlowRunExport {
  id: string;
  flowId: string;
  userId: string;
  status: string;
  startTime: string;
  finishTime: string;
  duration: number;
  logsFileId: string | null;
}

async function exportActivepiecesData() {
  const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'activepieces',
    user: 'postgres',
    password: 'YOUR_PASSWORD'
  });
  
  console.log('Starting data export...');
  
  // 1. Export Users
  console.log('Exporting users...');
  const usersResult = await pool.query(`
    SELECT 
      u.id,
      ui.email,
      ui."firstName",
      ui."lastName",
      u.status,
      u.created,
      u.updated
    FROM "user" u
    JOIN user_identity ui ON u.id = ui."userId"
    WHERE ui.provider = 'EMAIL'
  `);
  
  const users: UserExport[] = usersResult.rows;
  fs.writeFileSync(
    './backups/users.json',
    JSON.stringify(users, null, 2)
  );
  console.log(`Exported ${users.length} users`);
  
  // 2. Export Flows
  console.log('Exporting flows...');
  const flowsResult = await pool.query(`
    SELECT 
      f.id,
      p."ownerId" as "userId",
      f."projectId",
      fv."displayName" as name,
      fv.state as status,
      fv.trigger,
      f.schedule,
      f.created,
      f.updated
    FROM flow f
    JOIN flow_version fv ON f.id = fv."flowId"
    JOIN project p ON f."projectId" = p.id
    WHERE fv.state = 'ENABLED'
    ORDER BY f.created DESC
  `);
  
  const flows: FlowExport[] = flowsResult.rows;
  fs.writeFileSync(
    './backups/flows.json',
    JSON.stringify(flows, null, 2)
  );
  console.log(`Exported ${flows.length} flows`);
  
  // 3. Export Flow Runs (last 90 days)
  console.log('Exporting flow runs (last 90 days)...');
  const flowRunsResult = await pool.query(`
    SELECT 
      fr.id,
      fr."flowId",
      p."ownerId" as "userId",
      fr.status,
      fr."startTime",
      fr."finishTime",
      EXTRACT(EPOCH FROM (fr."finishTime" - fr."startTime")) * 1000 as duration,
      fr."logsFileId"
    FROM flow_run fr
    JOIN flow f ON fr."flowId" = f.id
    JOIN project p ON f."projectId" = p.id
    WHERE fr."startTime" > NOW() - INTERVAL '90 days'
    ORDER BY fr."startTime" DESC
  `);
  
  const flowRuns: FlowRunExport[] = flowRunsResult.rows;
  fs.writeFileSync(
    './backups/flow_runs.json',
    JSON.stringify(flowRuns, null, 2)
  );
  console.log(`Exported ${flowRuns.length} flow runs`);
  
  // 4. Generate Migration Report
  const report = {
    exportDate: new Date().toISOString(),
    totalUsers: users.length,
    totalFlows: flows.length,
    totalFlowRuns: flowRuns.length,
    activeFlows: flows.filter(f => f.status === 'ENABLED').length,
    userBreakdown: {
      active: users.filter(u => u.status === 'ACTIVE').length,
      inactive: users.filter(u => u.status === 'INACTIVE').length
    },
    flowRunBreakdown: {
      succeeded: flowRuns.filter(r => r.status === 'SUCCEEDED').length,
      failed: flowRuns.filter(r => r.status === 'FAILED').length,
      running: flowRuns.filter(r => r.status === 'RUNNING').length
    }
  };
  
  fs.writeFileSync(
    './backups/migration_report.json',
    JSON.stringify(report, null, 2)
  );
  
  console.log('\n=== Export Complete ===');
  console.log(JSON.stringify(report, null, 2));
  
  await pool.end();
}

// Run export
exportActivepiecesData().catch(console.error);
```

### 3. Run Export Script

```bash
# Install dependencies
npm install pg

# Run export
npx ts-node scripts/export-activepieces-data.ts

# Verify backup files
ls -lh backups/
# Should see:
# - users.json
# - flows.json
# - flow_runs.json
# - migration_report.json
```

---

## 👥 User Migration Process

### Step 1: Create Firebase Users (If Needed)

```typescript
// scripts/create-firebase-users.ts

import * as admin from 'firebase-admin';
import * as fs from 'fs';

admin.initializeApp();

async function createFirebaseUsers() {
  const usersData = JSON.parse(fs.readFileSync('./backups/users.json', 'utf8'));
  
  const results = {
    created: 0,
    existing: 0,
    errors: []
  };
  
  for (const user of usersData) {
    try {
      // Check if user exists in Firebase
      let firebaseUser;
      try {
        firebaseUser = await admin.auth().getUserByEmail(user.email);
        console.log(`User ${user.email} already exists in Firebase`);
        results.existing++;
      } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
          // Create new Firebase user
          firebaseUser = await admin.auth().createUser({
            email: user.email,
            emailVerified: true,
            displayName: `${user.firstName} ${user.lastName}`,
            password: generateSecurePassword() // Random, user can reset
          });
          console.log(`Created Firebase user: ${user.email}`);
          results.created++;
          
          // Send password reset email
          const resetLink = await admin.auth().generatePasswordResetLink(user.email);
          await sendPasswordResetEmail(user.email, resetLink);
        } else {
          throw error;
        }
      }
      
      // Store mapping in Firestore
      await admin.firestore()
        .collection('activepieces_users')
        .doc(firebaseUser.uid)
        .set({
          activepiecesUserId: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          migrated: true,
          migratedAt: admin.firestore.FieldValue.serverTimestamp(),
          originalCreatedAt: new Date(user.created)
        });
      
    } catch (error: any) {
      console.error(`Error processing user ${user.email}:`, error.message);
      results.errors.push({
        email: user.email,
        error: error.message
      });
    }
  }
  
  console.log('\n=== Migration Results ===');
  console.log(`Created: ${results.created}`);
  console.log(`Existing: ${results.existing}`);
  console.log(`Errors: ${results.errors.length}`);
  
  fs.writeFileSync(
    './backups/firebase_migration_results.json',
    JSON.stringify(results, null, 2)
  );
}

function generateSecurePassword(): string {
  return Math.random().toString(36).slice(-12) + 
         Math.random().toString(36).slice(-12).toUpperCase() +
         '!@#';
}

async function sendPasswordResetEmail(email: string, resetLink: string) {
  // Implement using your email service (SendGrid, etc.)
  console.log(`Password reset link for ${email}: ${resetLink}`);
}

createFirebaseUsers().catch(console.error);
```

### Step 2: Map Existing Activepieces Users

```typescript
// scripts/map-activepieces-users.ts

import * as admin from 'firebase-admin';
import axios from 'axios';
import * as fs from 'fs';

admin.initializeApp();

async function mapActivepiecesUsers() {
  const usersData = JSON.parse(fs.readFileSync('./backups/users.json', 'utf8'));
  const ACTIVEPIECES_URL = process.env.ACTIVEPIECES_URL || 'http://localhost:8080';
  const ADMIN_API_KEY = process.env.ACTIVEPIECES_ADMIN_KEY;
  
  for (const user of usersData) {
    try {
      // Get Firebase UID from email
      const firebaseUser = await admin.auth().getUserByEmail(user.email);
      
      // Verify Activepieces user still exists
      const apUser = await axios.get(
        `${ACTIVEPIECES_URL}/v1/users/${user.id}`,
        {
          headers: { 'Authorization': `Bearer ${ADMIN_API_KEY}` }
        }
      );
      
      if (apUser.data) {
        // Get or create API key for this user
        const apiKeysResponse = await axios.get(
          `${ACTIVEPIECES_URL}/v1/api-keys?userId=${user.id}`,
          {
            headers: { 'Authorization': `Bearer ${ADMIN_API_KEY}` }
          }
        );
        
        let apiKey;
        if (apiKeysResponse.data?.data?.length > 0) {
          apiKey = apiKeysResponse.data.data[0].token;
        } else {
          // Create new API key
          const newKeyResponse = await axios.post(
            `${ACTIVEPIECES_URL}/v1/api-keys`,
            {
              displayName: `nexus-migration-${Date.now()}`,
              userId: user.id
            },
            {
              headers: { 
                'Authorization': `Bearer ${ADMIN_API_KEY}`,
                'Content-Type': 'application/json'
              }
            }
          );
          apiKey = newKeyResponse.data.token;
        }
        
        // Cache API key in Firestore
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour cache for migration
        
        await admin.firestore()
          .collection('activepieces_api_keys')
          .doc(firebaseUser.uid)
          .set({
            apiKey: apiKey,
            activepiecesUserId: user.id,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            expiresAt: admin.firestore.Timestamp.fromDate(expiresAt),
            migrated: true
          });
        
        console.log(`✓ Mapped ${user.email} → Firebase UID: ${firebaseUser.uid}`);
      }
      
    } catch (error: any) {
      console.error(`✗ Error mapping ${user.email}:`, error.message);
    }
  }
  
  console.log('\n=== User Mapping Complete ===');
}

mapActivepiecesUsers().catch(console.error);
```

---

## 🔄 Flow Migration

### Scenario A: Flows Already in Activepieces (Just Map)

```typescript
// No need to migrate flows, they're already there!
// Just ensure user mapping is correct (done above)
// Flows will automatically appear when user logs in
```

### Scenario B: Import Flows from Backup

```typescript
// scripts/import-flows.ts

import * as admin from 'firebase-admin';
import axios from 'axios';
import * as fs from 'fs';

admin.initializeApp();

async function importFlows() {
  const flowsData = JSON.parse(fs.readFileSync('./backups/flows.json', 'utf8'));
  const ACTIVEPIECES_URL = process.env.ACTIVEPIECES_URL || 'http://localhost:8080';
  
  const results = {
    imported: 0,
    skipped: 0,
    errors: []
  };
  
  for (const flow of flowsData) {
    try {
      // Get Firebase user from Activepieces user ID
      const userMapping = await admin.firestore()
        .collection('activepieces_users')
        .where('activepiecesUserId', '==', flow.userId)
        .limit(1)
        .get();
      
      if (userMapping.empty) {
        console.log(`No Firebase user found for Activepieces user ${flow.userId}`);
        results.skipped++;
        continue;
      }
      
      const firebaseUid = userMapping.docs[0].id;
      
      // Get user's API key
      const apiKeyDoc = await admin.firestore()
        .collection('activepieces_api_keys')
        .doc(firebaseUid)
        .get();
      
      if (!apiKeyDoc.exists) {
        console.log(`No API key found for user ${firebaseUid}`);
        results.skipped++;
        continue;
      }
      
      const apiKey = apiKeyDoc.data()!.apiKey;
      
      // Check if flow already exists
      const existingFlow = await axios.get(
        `${ACTIVEPIECES_URL}/v1/flows/${flow.id}`,
        {
          headers: { 'Authorization': `Bearer ${apiKey}` },
          validateStatus: () => true // Don't throw on 404
        }
      );
      
      if (existingFlow.status === 200) {
        console.log(`Flow ${flow.name} already exists, skipping`);
        results.skipped++;
        continue;
      }
      
      // Import flow (if your Activepieces version supports bulk import)
      // Otherwise, flows should already be in the database
      // This is mainly for validation
      
      console.log(`✓ Verified flow: ${flow.name}`);
      results.imported++;
      
    } catch (error: any) {
      console.error(`✗ Error importing flow ${flow.name}:`, error.message);
      results.errors.push({
        flowId: flow.id,
        flowName: flow.name,
        error: error.message
      });
    }
  }
  
  console.log('\n=== Flow Import Results ===');
  console.log(`Imported: ${results.imported}`);
  console.log(`Skipped: ${results.skipped}`);
  console.log(`Errors: ${results.errors.length}`);
  
  fs.writeFileSync(
    './backups/flow_import_results.json',
    JSON.stringify(results, null, 2)
  );
}

importFlows().catch(console.error);
```

---

## 📜 Execution History Preservation

### Option 1: Keep in PostgreSQL (Recommended)

```typescript
// Execution history stays in Activepieces PostgreSQL
// No migration needed
// Accessible via Activepieces API

// Users can view history through your React UI:
const history = await activepiecesService.getFlowRuns(flowId);
```

### Option 2: Copy to Firestore (For Analytics)

```typescript
// scripts/copy-execution-history.ts

import * as admin from 'firebase-admin';
import * as fs from 'fs';

admin.initializeApp();

async function copyExecutionHistory() {
  const flowRunsData = JSON.parse(
    fs.readFileSync('./backups/flow_runs.json', 'utf8')
  );
  
  console.log(`Copying ${flowRunsData.length} flow runs to Firestore...`);
  
  const batch = admin.firestore().batch();
  let batchCount = 0;
  
  for (const run of flowRunsData) {
    // Get Firebase UID from Activepieces user ID
    const userMapping = await admin.firestore()
      .collection('activepieces_users')
      .where('activepiecesUserId', '==', run.userId)
      .limit(1)
      .get();
    
    if (userMapping.empty) continue;
    
    const firebaseUid = userMapping.docs[0].id;
    
    // Add to Firestore for analytics
    const docRef = admin.firestore()
      .collection('activepieces_execution_history')
      .doc(run.id);
    
    batch.set(docRef, {
      userId: firebaseUid,
      flowId: run.flowId,
      status: run.status,
      startTime: new Date(run.startTime),
      finishTime: new Date(run.finishTime),
      duration: run.duration,
      migrated: true
    });
    
    batchCount++;
    
    // Commit batch every 500 documents
    if (batchCount >= 500) {
      await batch.commit();
      console.log(`Committed ${batchCount} documents`);
      batchCount = 0;
    }
  }
  
  // Commit remaining
  if (batchCount > 0) {
    await batch.commit();
    console.log(`Committed final ${batchCount} documents`);
  }
  
  console.log('✓ Execution history copied to Firestore');
}

copyExecutionHistory().catch(console.error);
```

---

## 🔙 Rollback Plan

### If Migration Fails

```bash
# 1. Stop all services
docker-compose -f docker-compose.activepieces.yml down

# 2. Restore PostgreSQL backup
docker-compose -f docker-compose.activepieces.yml up -d postgres

# Wait for PostgreSQL to start
sleep 5

# Restore backup
docker exec -i activepieces-postgres pg_restore \
  -U postgres \
  -d activepieces \
  -c \
  /backups/activepieces_backup_YYYYMMDD_HHMMSS.dump

# 3. Restart Activepieces
docker-compose -f docker-compose.activepieces.yml up -d

# 4. Clean up Firestore (if needed)
# Run cleanup script to remove migration data
npx ts-node scripts/rollback-firestore-migration.ts

# 5. Notify users of rollback
# Send email explaining situation
```

### Rollback Script

```typescript
// scripts/rollback-firestore-migration.ts

import * as admin from 'firebase-admin';

admin.initializeApp();

async function rollbackMigration() {
  console.log('Starting rollback...');
  
  // 1. Delete migrated API keys
  const apiKeys = await admin.firestore()
    .collection('activepieces_api_keys')
    .where('migrated', '==', true)
    .get();
  
  const batch1 = admin.firestore().batch();
  apiKeys.docs.forEach(doc => batch1.delete(doc.ref));
  await batch1.commit();
  console.log(`Deleted ${apiKeys.size} API keys`);
  
  // 2. Delete migrated user mappings
  const users = await admin.firestore()
    .collection('activepieces_users')
    .where('migrated', '==', true)
    .get();
  
  const batch2 = admin.firestore().batch();
  users.docs.forEach(doc => batch2.delete(doc.ref));
  await batch2.commit();
  console.log(`Deleted ${users.size} user mappings`);
  
  // 3. Delete execution history copies (if any)
  const history = await admin.firestore()
    .collection('activepieces_execution_history')
    .where('migrated', '==', true)
    .get();
  
  const batch3 = admin.firestore().batch();
  history.docs.forEach(doc => batch3.delete(doc.ref));
  await batch3.commit();
  console.log(`Deleted ${history.size} execution history records`);
  
  console.log('✓ Rollback complete');
}

rollbackMigration().catch(console.error);
```

---

## ✅ Post-Migration Validation

### Validation Checklist

```typescript
// scripts/validate-migration.ts

import * as admin from 'firebase-admin';
import axios from 'axios';
import * as fs from 'fs';

admin.initializeApp();

async function validateMigration() {
  const originalData = {
    users: JSON.parse(fs.readFileSync('./backups/users.json', 'utf8')),
    flows: JSON.parse(fs.readFileSync('./backups/flows.json', 'utf8')),
    flowRuns: JSON.parse(fs.readFileSync('./backups/flow_runs.json', 'utf8'))
  };
  
  const validation = {
    users: {
      expected: originalData.users.length,
      found: 0,
      missing: []
    },
    flows: {
      expected: originalData.flows.length,
      found: 0,
      missing: []
    },
    apiKeys: {
      expected: originalData.users.length,
      found: 0,
      missing: []
    }
  };
  
  // Validate users
  for (const user of originalData.users) {
    try {
      const firebaseUser = await admin.auth().getUserByEmail(user.email);
      
      const mapping = await admin.firestore()
        .collection('activepieces_users')
        .doc(firebaseUser.uid)
        .get();
      
      if (mapping.exists) {
        validation.users.found++;
      } else {
        validation.users.missing.push(user.email);
      }
    } catch (error) {
      validation.users.missing.push(user.email);
    }
  }
  
  // Validate API keys
  const apiKeysSnapshot = await admin.firestore()
    .collection('activepieces_api_keys')
    .where('migrated', '==', true)
    .get();
  
  validation.apiKeys.found = apiKeysSnapshot.size;
  
  // Generate report
  const report = {
    timestamp: new Date().toISOString(),
    validation,
    success: validation.users.found === validation.users.expected &&
             validation.apiKeys.found === validation.apiKeys.expected
  };
  
  fs.writeFileSync(
    './backups/validation_report.json',
    JSON.stringify(report, null, 2)
  );
  
  console.log('\n=== Validation Report ===');
  console.log(JSON.stringify(report, null, 2));
  
  if (report.success) {
    console.log('\n✅ Migration validated successfully!');
  } else {
    console.log('\n⚠️ Migration validation found issues!');
  }
}

validateMigration().catch(console.error);
```

---

## 📊 Migration Timeline

```
Week 1: Planning
├── Day 1-2: Data assessment
├── Day 3-4: Script development
└── Day 5-7: Testing in staging

Week 2: Execution
├── Day 1: Full backup
├── Day 2: User migration
├── Day 3: Flow validation
├── Day 4: Testing & fixes
├── Day 5: Production cutover
├── Day 6-7: Monitoring & support

Week 3: Validation
├── Day 1-3: User acceptance testing
├── Day 4-5: Performance optimization
├── Day 6-7: Documentation & training
```

---

## 🚨 Common Migration Issues

### Issue 1: Duplicate Users
```typescript
// Solution: Use email as primary key
// Skip if Firebase user already exists
```

### Issue 2: Missing API Keys
```typescript
// Solution: Create new API keys for all users
// Cache with longer TTL (24 hours) during migration
```

### Issue 3: Flow Permission Issues
```typescript
// Solution: Verify project ownership
// Ensure Firebase UID maps to correct Activepieces user
```

### Issue 4: Execution History Lost
```typescript
// Solution: Keep PostgreSQL backup for 90 days
// Users can request historical data if needed
```

---

## ✅ Success Criteria

```
[✓] All users can log in with Firebase
[✓] All flows visible in new UI
[✓] All flows execute successfully
[✓] Execution history accessible
[✓] No API key errors
[✓] No permission errors
[✓] Performance metrics normal
[✓] User satisfaction > 90%
```

---

**Status**: ✅ Ready for Migration  
**Risk Level**: Medium  
**Estimated Time**: 2-3 weeks  
**Rollback Time**: < 1 hour
