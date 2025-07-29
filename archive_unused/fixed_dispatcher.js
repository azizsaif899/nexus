
defineModule('System.Dispatcher', () => ({
  dispatch: (action, payload) => ({ success: true }),
  register: (handler) => true,
  init: () => true
}));
