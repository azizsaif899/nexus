defineModule('System.Auth', ({ Utils, Config }) => {
  const MODULE_VERSION = '1.0.0';

  let cachedToken = null;
  let tokenExpiry = null;

  function getServiceAccountToken() {
    // التحقق من وجود token مخزن مؤقتاً
    if (cachedToken && tokenExpiry && new Date() < tokenExpiry) {
      return cachedToken;
    }

    try {
      const serviceAccountKey = Config.get('VERTEX_SERVICE_ACCOUNT_KEY');
      if (!serviceAccountKey) {
        throw new Error('Service account key not configured');
      }

      const serviceAccount = JSON.parse(serviceAccountKey);
      const jwt = _createJWT(serviceAccount);

      const response = UrlFetchApp.fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        payload: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
      });

      const result = JSON.parse(response.getContentText());

      if (result.access_token) {
        cachedToken = result.access_token;
        // تعيين انتهاء الصلاحية قبل الوقت الفعلي بـ 5 دقائق
        tokenExpiry = new Date(Date.now() + (result.expires_in - 300) * 1000);
        return cachedToken;
      }

      throw new Error('No access token received');
    } catch (e) {
      Utils.error('Failed to get service account token', e);
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

  function getAuthHeaders() {
    const token = getServiceAccountToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  function clearTokenCache() {
    cachedToken = null;
    tokenExpiry = null;
  }

  return {
    getServiceAccountToken,
    getAuthHeaders,
    clearTokenCache,
    MODULE_VERSION
  };
});
