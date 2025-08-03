/**
 * التخزين المرحلي للبيانات
 * Status: 🟡 Beta
 */
defineModule('Services.IntermediateStorage', function(injector) {

  const PROJECT_ID = PropertiesService.getScriptProperties().getProperty('GCP_PROJECT_ID');
  const DATASET_ID = 'g_assistant_intermediate';
  const TABLE_ID = 'document_extractions';

  return {
    /**
     * حفظ البيانات المستخرجة في BigQuery
     */
    async saveExtractedData(documentId, extractedData, metadata = {}) {
      try {
        const accessToken = this.getAccessToken();
        const tableId = `${PROJECT_ID}.${DATASET_ID}.${TABLE_ID}`;

        const row = {
          document_id: documentId,
          extraction_timestamp: new Date().toISOString(),
          tables_data: JSON.stringify(extractedData.tables || []),
          entities_data: JSON.stringify(extractedData.entities || []),
          raw_text: extractedData.text || '',
          metadata: JSON.stringify(metadata),
          processing_status: 'completed'
        };

        const response = await this.insertRowToBigQuery(tableId, row, accessToken);

        return {
          success: true,
          insertId: response.insertId,
          documentId: documentId
        };

      } catch (error) {
        console.error('خطأ في حفظ البيانات:', error);
        // Fallback إلى PropertiesService
        return this.saveToPropertiesService(documentId, extractedData, metadata);
      }
    },

    /**
     * استرجاع البيانات المحفوظة
     */
    async getExtractedData(documentId) {
      try {
        const accessToken = this.getAccessToken();
        const query = `
          SELECT * FROM \`${PROJECT_ID}.${DATASET_ID}.${TABLE_ID}\`
          WHERE document_id = '${documentId}'
          ORDER BY extraction_timestamp DESC
          LIMIT 1
        `;

        const response = await this.queryBigQuery(query, accessToken);

        if (response.rows && response.rows.length > 0) {
          const row = response.rows[0];
          return {
            documentId: row.f[0].v,
            timestamp: row.f[1].v,
            tables: JSON.parse(row.f[2].v || '[]'),
            entities: JSON.parse(row.f[3].v || '[]'),
            text: row.f[4].v || '',
            metadata: JSON.parse(row.f[5].v || '{}')
          };
        }

        return null;

      } catch (error) {
        console.error('خطأ في استرجاع البيانات:', error);
        // Fallback إلى PropertiesService
        return this.getFromPropertiesService(documentId);
      }
    },

    /**
     * إدراج صف في BigQuery
     */
    async insertRowToBigQuery(tableId, row, accessToken) {
      const endpoint = `https://bigquery.googleapis.com/bigquery/v2/projects/${PROJECT_ID}/datasets/${DATASET_ID}/tables/${TABLE_ID}/insertAll`;

      const payload = {
        rows: [{
          insertId: Utilities.getUuid(),
          json: row
        }]
      };

      const response = UrlFetchApp.fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        payload: JSON.stringify(payload)
      });

      return JSON.parse(response.getContentText());
    },

    /**
     * استعلام BigQuery
     */
    async queryBigQuery(query, accessToken) {
      const endpoint = `https://bigquery.googleapis.com/bigquery/v2/projects/${PROJECT_ID}/queries`;

      const payload = {
        query: query,
        useLegacySql: false
      };

      const response = UrlFetchApp.fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        payload: JSON.stringify(payload)
      });

      return JSON.parse(response.getContentText());
    },

    /**
     * حفظ احتياطي في PropertiesService
     */
    saveToPropertiesService(documentId, extractedData, metadata) {
      try {
        const key = `extracted_data_${documentId}`;
        const data = {
          documentId: documentId,
          timestamp: new Date().toISOString(),
          extractedData: extractedData,
          metadata: metadata
        };

        PropertiesService.getScriptProperties().setProperty(
          key,
          JSON.stringify(data)
        );

        return {
          success: true,
          storage: 'properties_service',
          documentId: documentId
        };

      } catch (error) {
        console.error('فشل في الحفظ الاحتياطي:', error);
        throw new Error('فشل في حفظ البيانات');
      }
    },

    /**
     * استرجاع احتياطي من PropertiesService
     */
    getFromPropertiesService(documentId) {
      try {
        const key = `extracted_data_${documentId}`;
        const savedData = PropertiesService.getScriptProperties().getProperty(key);

        if (savedData) {
          return JSON.parse(savedData);
        }

        return null;

      } catch (error) {
        console.error('فشل في الاسترجاع الاحتياطي:', error);
        return null;
      }
    },

    /**
     * إنشاء جدول BigQuery إذا لم يكن موجوداً
     */
    async ensureTableExists() {
      try {
        const accessToken = this.getAccessToken();
        const schema = {
          fields: [
            { name: 'document_id', type: 'STRING', mode: 'REQUIRED' },
            { name: 'extraction_timestamp', type: 'TIMESTAMP', mode: 'REQUIRED' },
            { name: 'tables_data', type: 'STRING', mode: 'NULLABLE' },
            { name: 'entities_data', type: 'STRING', mode: 'NULLABLE' },
            { name: 'raw_text', type: 'STRING', mode: 'NULLABLE' },
            { name: 'metadata', type: 'STRING', mode: 'NULLABLE' },
            { name: 'processing_status', type: 'STRING', mode: 'REQUIRED' }
          ]
        };

        const endpoint = `https://bigquery.googleapis.com/bigquery/v2/projects/${PROJECT_ID}/datasets/${DATASET_ID}/tables`;

        const payload = {
          tableReference: {
            projectId: PROJECT_ID,
            datasetId: DATASET_ID,
            tableId: TABLE_ID
          },
          schema: schema
        };

        UrlFetchApp.fetch(endpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          payload: JSON.stringify(payload)
        });

        return true;

      } catch (error) {
        console.log('الجدول موجود بالفعل أو خطأ في الإنشاء:', error.message);
        return false;
      }
    },

    /**
     * الحصول على Access Token
     */
    getAccessToken() {
      const auth = injector.get('System.Auth');
      return auth.getAccessToken(['https://www.googleapis.com/auth/bigquery']);
    },

    /**
     * تنظيف البيانات القديمة
     */
    async cleanupOldData(daysOld = 30) {
      try {
        const accessToken = this.getAccessToken();
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);

        const query = `
          DELETE FROM \`${PROJECT_ID}.${DATASET_ID}.${TABLE_ID}\`
          WHERE extraction_timestamp < '${cutoffDate.toISOString()}'
        `;

        await this.queryBigQuery(query, accessToken);

        return { success: true, cleanupDate: cutoffDate.toISOString() };

      } catch (error) {
        console.error('خطأ في تنظيف البيانات:', error);
        return { success: false, error: error.message };
      }
    }
  };
});
