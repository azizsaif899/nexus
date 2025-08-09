defineModule('System.AI.DocumentAI', ({ Utils, Config }) => {
  const MODULE_VERSION = '1.0.0';

  const PROCESSORS = {
    FORM_PARSER: 'form-parser',
    DOCUMENT_OCR: 'document-ocr',
    TABLE_EXTRACTOR: 'table-extractor'
  };

  function processDocument(fileBlob, processorType = PROCESSORS.FORM_PARSER) {
    const projectId = Config.get('VERTEX_PROJECT_ID');
    const processorId = Config.get(`DOCUMENT_AI_${processorType.toUpperCase()}_ID`);
    const accessToken = _getAccessToken();

    if (!accessToken) return { type: 'error', text: 'فشل في المصادقة' };

    const url = `https://us-documentai.googleapis.com/v1/projects/${projectId}/locations/us/processors/${processorId}:process`;

    const document = {
      content: Utilities.base64Encode(fileBlob.getBytes()),
      mimeType: fileBlob.getContentType()
    };

    try {
      const response = UrlFetchApp.fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        payload: JSON.stringify({ rawDocument: document })
      });

      const result = JSON.parse(response.getContentText());
      return _parseDocumentResult(result);
    } catch (e) {
      return { type: 'error', text: `خطأ Document AI: ${e.message}` };
    }
  }

  function extractTablesFromPDF(pdfBlob) {
    const result = processDocument(pdfBlob, PROCESSORS.TABLE_EXTRACTOR);

    if (result.type !== 'success') return result;

    const tables = result.data.tables || [];
    const extractedTables = tables.map(table => {
      const rows = table.bodyRows?.map(row =>
        row.cells?.map(cell => cell.layout?.textAnchor?.content || '') || []
      ) || [];

      const headers = table.headerRows?.[0]?.cells?.map(cell =>
        cell.layout?.textAnchor?.content || ''
      ) || [];

      return { headers, rows };
    });

    return {
      type: 'success',
      text: `تم استخراج ${extractedTables.length} جدول`,
      data: { tables: extractedTables }
    };
  }

  function extractFormFields(documentBlob) {
    const result = processDocument(documentBlob, PROCESSORS.FORM_PARSER);

    if (result.type !== 'success') return result;

    const formFields = {};
    const entities = result.data.entities || [];

    entities.forEach(entity => {
      if (entity.type && entity.mentionText) {
        formFields[entity.type] = entity.mentionText;
      }
    });

    return {
      type: 'success',
      text: `تم استخراج ${Object.keys(formFields).length} حقل`,
      data: { fields: formFields }
    };
  }

  function _parseDocumentResult(result) {
    const document = result.document;
    if (!document) return { type: 'error', text: 'لا توجد بيانات مستند' };

    return {
      type: 'success',
      text: document.text || 'تم معالجة المستند',
      data: {
        text: document.text,
        entities: document.entities,
        tables: document.pages?.[0]?.tables,
        pages: document.pages?.length || 0
      }
    };
  }

  function _getAccessToken() {
    try {
      const serviceAccount = JSON.parse(Config.get('VERTEX_SERVICE_ACCOUNT_KEY'));
      const jwt = _createJWT(serviceAccount);

      const response = UrlFetchApp.fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        payload: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
      });

      return JSON.parse(response.getContentText()).access_token;
    } catch (e) {
      Utils.error('Document AI auth failed', e);
      return null;
    }
  }

  function _createJWT(serviceAccount) {
    const header = { alg: 'RS256', typ: 'JWT' };
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: serviceAccount.client_email,
      scope: 'https://www.googleapis.com/auth/cloud-platform',
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600
    };

    const headerB64 = Utilities.base64EncodeWebSafe(JSON.stringify(header));
    const payloadB64 = Utilities.base64EncodeWebSafe(JSON.stringify(payload));
    const signature = Utilities.computeRsaSha256Signature(
      `${headerB64}.${payloadB64}`,
      serviceAccount.private_key
    );
    const signatureB64 = Utilities.base64EncodeWebSafe(signature);

    return `${headerB64}.${payloadB64}.${signatureB64}`;
  }

  return {
    PROCESSORS,
    processDocument,
    extractTablesFromPDF,
    extractFormFields,
    MODULE_VERSION
  };
});
