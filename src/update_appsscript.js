const fs = require('fs');
const path = require('path');

// تحديث appsscript.json مع جميع الملفات الجديدة
const manifestPath = path.join(__dirname, 'appsscript.json');

const updatedManifest = {
  'timeZone': 'Asia/Riyadh',
  'dependencies': {
    'enabledAdvancedServices': [
      {
        'userSymbol': 'Drive',
        'serviceId': 'drive',
        'version': 'v3'
      },
      {
        'userSymbol': 'Gmail',
        'serviceId': 'gmail',
        'version': 'v1'
      }
    ]
  },
  'exceptionLogging': 'STACKDRIVER',
  'runtimeVersion': 'V8',
  'webapp': {
    'access': 'ANYONE_ANONYMOUS',
    'executeAs': 'USER_DEPLOYING'
  },
  'oauthScopes': [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/cloud-platform'
  ]
};

fs.writeFileSync(manifestPath, JSON.stringify(updatedManifest, null, 2));
console.log('✅ appsscript.json updated successfully!');
