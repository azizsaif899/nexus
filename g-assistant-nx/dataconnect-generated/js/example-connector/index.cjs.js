const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'azizsys5',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

const upsertUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertUser', inputVars);
}
upsertUserRef.operationName = 'UpsertUser';
exports.upsertUserRef = upsertUserRef;

exports.upsertUser = function upsertUser(dcOrVars, vars) {
  return executeMutation(upsertUserRef(dcOrVars, vars));
};

const createChatSessionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateChatSession', inputVars);
}
createChatSessionRef.operationName = 'CreateChatSession';
exports.createChatSessionRef = createChatSessionRef;

exports.createChatSession = function createChatSession(dcOrVars, vars) {
  return executeMutation(createChatSessionRef(dcOrVars, vars));
};

const addMessageRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddMessage', inputVars);
}
addMessageRef.operationName = 'AddMessage';
exports.addMessageRef = addMessageRef;

exports.addMessage = function addMessage(dcOrVars, vars) {
  return executeMutation(addMessageRef(dcOrVars, vars));
};

const updateChatSessionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateChatSession', inputVars);
}
updateChatSessionRef.operationName = 'UpdateChatSession';
exports.updateChatSessionRef = updateChatSessionRef;

exports.updateChatSession = function updateChatSession(dcOrVars, vars) {
  return executeMutation(updateChatSessionRef(dcOrVars, vars));
};

const createTaskRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateTask', inputVars);
}
createTaskRef.operationName = 'CreateTask';
exports.createTaskRef = createTaskRef;

exports.createTask = function createTask(dcOrVars, vars) {
  return executeMutation(createTaskRef(dcOrVars, vars));
};

const updateTaskStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateTaskStatus', inputVars);
}
updateTaskStatusRef.operationName = 'UpdateTaskStatus';
exports.updateTaskStatusRef = updateTaskStatusRef;

exports.updateTaskStatus = function updateTaskStatus(dcOrVars, vars) {
  return executeMutation(updateTaskStatusRef(dcOrVars, vars));
};

const addKnowledgeEntryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddKnowledgeEntry', inputVars);
}
addKnowledgeEntryRef.operationName = 'AddKnowledgeEntry';
exports.addKnowledgeEntryRef = addKnowledgeEntryRef;

exports.addKnowledgeEntry = function addKnowledgeEntry(dcOrVars, vars) {
  return executeMutation(addKnowledgeEntryRef(dcOrVars, vars));
};

const getCurrentUserRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetCurrentUser');
}
getCurrentUserRef.operationName = 'GetCurrentUser';
exports.getCurrentUserRef = getCurrentUserRef;

exports.getCurrentUser = function getCurrentUser(dc) {
  return executeQuery(getCurrentUserRef(dc));
};

const listUserChatSessionsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListUserChatSessions');
}
listUserChatSessionsRef.operationName = 'ListUserChatSessions';
exports.listUserChatSessionsRef = listUserChatSessionsRef;

exports.listUserChatSessions = function listUserChatSessions(dc) {
  return executeQuery(listUserChatSessionsRef(dc));
};

const getChatSessionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetChatSession', inputVars);
}
getChatSessionRef.operationName = 'GetChatSession';
exports.getChatSessionRef = getChatSessionRef;

exports.getChatSession = function getChatSession(dcOrVars, vars) {
  return executeQuery(getChatSessionRef(dcOrVars, vars));
};

const listTasksRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListTasks', inputVars);
}
listTasksRef.operationName = 'ListTasks';
exports.listTasksRef = listTasksRef;

exports.listTasks = function listTasks(dcOrVars, vars) {
  return executeQuery(listTasksRef(dcOrVars, vars));
};

const searchKnowledgeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'SearchKnowledge', inputVars);
}
searchKnowledgeRef.operationName = 'SearchKnowledge';
exports.searchKnowledgeRef = searchKnowledgeRef;

exports.searchKnowledge = function searchKnowledge(dcOrVars, vars) {
  return executeQuery(searchKnowledgeRef(dcOrVars, vars));
};
