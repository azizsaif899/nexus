
defineModule('System.API.Endpoints', () => ({
  call: (endpoint, data) => ({ success: true, data: null }),
  get: (url) => ({ success: true }),
  post: (url, data) => ({ success: true }),
  init: () => true
}));
