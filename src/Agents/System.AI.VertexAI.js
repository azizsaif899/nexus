defineModule('System.AI.VertexAI', ({ Utils, Config }) => {
  const MODULE_VERSION = '1.0.0';

  function callTunedModel(modelId, prompt, config = {}) {
    const projectId = Config.get('VERTEX_PROJECT_ID');
    const accessToken = _getAccessToken();

    if (!accessToken) return { type: 'error', text: 'فشل في المصادقة' };

    const url = `https://us-central1-aiplatform.googleapis.com/v1/projects/${projectId}/locations/us-central1/publishers/google/models/${modelId}:generateContent`;

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: config.temperature || 0.3,
        maxOutputTokens: config.maxTokens || 2000
      }
    };

    try {
      const response = UrlFetchApp.fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        payload: JSON.stringify(payload)
      });

      const result = JSON.parse(response.getContentText());
      return {
        type: 'success',
        text: result.candidates?.[0]?.content?.parts?.[0]?.text || 'لا توجد استجابة'
      };
    } catch (e) {
      return { type: 'error', text: `خطأ Vertex AI: ${e.message}` };
    }
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
      Utils.error('Vertex AI auth failed', e);
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
    callTunedModel,
    MODULE_VERSION
  };
});
