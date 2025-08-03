/**
 * موصل Document AI المخصص
 * Status: 🟡 Beta
 */
defineModule('Services.DocumentAI', function(injector) {

  const PROJECT_ID = PropertiesService.getScriptProperties().getProperty('GCP_PROJECT_ID');
  const LOCATION = 'us';
  const PROCESSOR_ID = PropertiesService.getScriptProperties().getProperty('DOCUMENT_AI_PROCESSOR_ID');

  return {
    /**
     * استخراج الجداول والبيانات المنظمة من PDF
     */
    async extractStructuredData(fileBlob) {
      try {
        const accessToken = this.getAccessToken();
        const endpoint = `https://${LOCATION}-documentai.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/processors/${PROCESSOR_ID}:process`;

        const payload = {
          rawDocument: {
            content: Utilities.base64Encode(fileBlob.getBytes()),
            mimeType: fileBlob.getContentType()
          },
          fieldMask: 'text,pages.tables,entities'
        };

        const response = UrlFetchApp.fetch(endpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          payload: JSON.stringify(payload)
        });

        const result = JSON.parse(response.getContentText());
        return this.processDocumentAIResponse(result.document);

      } catch (error) {
        console.error('خطأ في Document AI:', error);
        throw new Error(`فشل في معالجة المستند: ${error.message}`);
      }
    },

    /**
     * معالجة استجابة Document AI
     */
    processDocumentAIResponse(document) {
      const extractedData = {
        text: document.text || '',
        tables: [],
        entities: []
      };

      // استخراج الجداول
      if (document.pages) {
        document.pages.forEach(page => {
          if (page.tables) {
            page.tables.forEach(table => {
              extractedData.tables.push(this.extractTableData(table, document.text));
            });
          }
        });
      }

      // استخراج الكيانات
      if (document.entities) {
        document.entities.forEach(entity => {
          extractedData.entities.push({
            type: entity.type,
            text: entity.mentionText,
            confidence: entity.confidence
          });
        });
      }

      return extractedData;
    },

    /**
     * استخراج بيانات الجدول
     */
    extractTableData(table, fullText) {
      const tableData = {
        headers: [],
        rows: []
      };

      if (table.headerRows && table.headerRows.length > 0) {
        const headerRow = table.headerRows[0];
        headerRow.cells.forEach(cell => {
          const cellText = this.extractTextFromSegments(cell.layout.textAnchor.textSegments, fullText);
          tableData.headers.push(cellText.trim());
        });
      }

      if (table.bodyRows) {
        table.bodyRows.forEach(row => {
          const rowData = [];
          row.cells.forEach(cell => {
            const cellText = this.extractTextFromSegments(cell.layout.textAnchor.textSegments, fullText);
            rowData.push(cellText.trim());
          });
          tableData.rows.push(rowData);
        });
      }

      return tableData;
    },

    /**
     * استخراج النص من segments
     */
    extractTextFromSegments(segments, fullText) {
      if (!segments || segments.length === 0) return '';

      let extractedText = '';
      segments.forEach(segment => {
        const startIndex = parseInt(segment.startIndex) || 0;
        const endIndex = parseInt(segment.endIndex) || fullText.length;
        extractedText += fullText.substring(startIndex, endIndex);
      });

      return extractedText;
    },

    /**
     * الحصول على Access Token
     */
    getAccessToken() {
      const auth = injector.get('System.Auth');
      return auth.getAccessToken(['https://www.googleapis.com/auth/cloud-platform']);
    }
  };
});
