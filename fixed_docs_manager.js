
defineModule('System.DocsManager', () => ({
  registerModuleDocs: (name, docs) => {
    console.log(`📚 ${name} docs registered`);
    return true;
  },
  getDocs: (name) => null,
  init: () => true
}));
