import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface AddKnowledgeEntryData {
  knowledgeEntry_insert: KnowledgeEntry_Key;
}

export interface AddKnowledgeEntryVariables {
  title: string;
  content: string;
  category: string;
  tags?: string | null;
  source?: string | null;
}

export interface AddMessageData {
  message_insert: Message_Key;
}

export interface AddMessageVariables {
  sessionId: UUIDString;
  role: string;
  content: string;
  metadata?: string | null;
}

export interface ChatSession_Key {
  id: UUIDString;
  __typename?: 'ChatSession_Key';
}

export interface CreateChatSessionData {
  chatSession_insert: ChatSession_Key;
}

export interface CreateChatSessionVariables {
  agentType: string;
  title?: string | null;
}

export interface CreateTaskData {
  task_insert: Task_Key;
}

export interface CreateTaskVariables {
  title: string;
  description?: string | null;
  priority: string;
  assignedAgent?: string | null;
}

export interface GetChatSessionData {
  chatSession?: {
    id: UUIDString;
    agentType: string;
    title?: string | null;
    createdAt: TimestampString;
    updatedAt?: TimestampString | null;
    isActive: boolean;
    user: {
      id: string;
      email: string;
      displayName?: string | null;
    } & User_Key;
      messages: ({
        id: UUIDString;
        role: string;
        content: string;
        metadata?: string | null;
        createdAt: TimestampString;
      } & Message_Key)[];
  } & ChatSession_Key;
}

export interface GetChatSessionVariables {
  sessionId: UUIDString;
}

export interface GetCurrentUserData {
  user?: {
    id: string;
    email: string;
    displayName?: string | null;
    createdAt: TimestampString;
    lastActiveAt?: TimestampString | null;
  } & User_Key;
}

export interface KnowledgeEntry_Key {
  id: UUIDString;
  __typename?: 'KnowledgeEntry_Key';
}

export interface ListTasksData {
  tasks: ({
    id: UUIDString;
    title: string;
    description?: string | null;
    status: string;
    priority: string;
    assignedAgent?: string | null;
    createdAt: TimestampString;
    updatedAt?: TimestampString | null;
    completedAt?: TimestampString | null;
    createdBy?: {
      id: string;
      displayName?: string | null;
    } & User_Key;
  } & Task_Key)[];
}

export interface ListTasksVariables {
  status?: string | null;
}

export interface ListUserChatSessionsData {
  user?: {
    chatSessions: ({
      id: UUIDString;
      agentType: string;
      title?: string | null;
      createdAt: TimestampString;
      updatedAt?: TimestampString | null;
      isActive: boolean;
    } & ChatSession_Key)[];
  };
}

export interface Message_Key {
  id: UUIDString;
  __typename?: 'Message_Key';
}

export interface SearchKnowledgeData {
  knowledgeEntries: ({
    id: UUIDString;
    title: string;
    content: string;
    category: string;
    tags?: string | null;
    source?: string | null;
    createdAt: TimestampString;
    updatedAt?: TimestampString | null;
  } & KnowledgeEntry_Key)[];
}

export interface SearchKnowledgeVariables {
  query: string;
  category?: string | null;
}

export interface Task_Key {
  id: UUIDString;
  __typename?: 'Task_Key';
}

export interface UpdateChatSessionData {
  chatSession_update?: ChatSession_Key | null;
}

export interface UpdateChatSessionVariables {
  sessionId: UUIDString;
  title?: string | null;
  isActive?: boolean | null;
}

export interface UpdateTaskStatusData {
  task_update?: Task_Key | null;
}

export interface UpdateTaskStatusVariables {
  taskId: UUIDString;
  status: string;
  completedAt?: TimestampString | null;
}

export interface UpsertUserData {
  user_upsert: User_Key;
}

export interface UpsertUserVariables {
  email: string;
  displayName?: string | null;
}

export interface User_Key {
  id: string;
  __typename?: 'User_Key';
}

interface GetCurrentUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetCurrentUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetCurrentUserData, undefined>;
  operationName: string;
}
export const getCurrentUserRef: GetCurrentUserRef;

export function getCurrentUser(): QueryPromise<GetCurrentUserData, undefined>;
export function getCurrentUser(dc: DataConnect): QueryPromise<GetCurrentUserData, undefined>;

interface ListUserChatSessionsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListUserChatSessionsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListUserChatSessionsData, undefined>;
  operationName: string;
}
export const listUserChatSessionsRef: ListUserChatSessionsRef;

export function listUserChatSessions(): QueryPromise<ListUserChatSessionsData, undefined>;
export function listUserChatSessions(dc: DataConnect): QueryPromise<ListUserChatSessionsData, undefined>;

interface GetChatSessionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetChatSessionVariables): QueryRef<GetChatSessionData, GetChatSessionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetChatSessionVariables): QueryRef<GetChatSessionData, GetChatSessionVariables>;
  operationName: string;
}
export const getChatSessionRef: GetChatSessionRef;

export function getChatSession(vars: GetChatSessionVariables): QueryPromise<GetChatSessionData, GetChatSessionVariables>;
export function getChatSession(dc: DataConnect, vars: GetChatSessionVariables): QueryPromise<GetChatSessionData, GetChatSessionVariables>;

interface ListTasksRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: ListTasksVariables): QueryRef<ListTasksData, ListTasksVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: ListTasksVariables): QueryRef<ListTasksData, ListTasksVariables>;
  operationName: string;
}
export const listTasksRef: ListTasksRef;

export function listTasks(vars?: ListTasksVariables): QueryPromise<ListTasksData, ListTasksVariables>;
export function listTasks(dc: DataConnect, vars?: ListTasksVariables): QueryPromise<ListTasksData, ListTasksVariables>;

interface SearchKnowledgeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: SearchKnowledgeVariables): QueryRef<SearchKnowledgeData, SearchKnowledgeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: SearchKnowledgeVariables): QueryRef<SearchKnowledgeData, SearchKnowledgeVariables>;
  operationName: string;
}
export const searchKnowledgeRef: SearchKnowledgeRef;

export function searchKnowledge(vars: SearchKnowledgeVariables): QueryPromise<SearchKnowledgeData, SearchKnowledgeVariables>;
export function searchKnowledge(dc: DataConnect, vars: SearchKnowledgeVariables): QueryPromise<SearchKnowledgeData, SearchKnowledgeVariables>;

interface UpsertUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertUserVariables): MutationRef<UpsertUserData, UpsertUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertUserVariables): MutationRef<UpsertUserData, UpsertUserVariables>;
  operationName: string;
}
export const upsertUserRef: UpsertUserRef;

export function upsertUser(vars: UpsertUserVariables): MutationPromise<UpsertUserData, UpsertUserVariables>;
export function upsertUser(dc: DataConnect, vars: UpsertUserVariables): MutationPromise<UpsertUserData, UpsertUserVariables>;

interface CreateChatSessionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateChatSessionVariables): MutationRef<CreateChatSessionData, CreateChatSessionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateChatSessionVariables): MutationRef<CreateChatSessionData, CreateChatSessionVariables>;
  operationName: string;
}
export const createChatSessionRef: CreateChatSessionRef;

export function createChatSession(vars: CreateChatSessionVariables): MutationPromise<CreateChatSessionData, CreateChatSessionVariables>;
export function createChatSession(dc: DataConnect, vars: CreateChatSessionVariables): MutationPromise<CreateChatSessionData, CreateChatSessionVariables>;

interface AddMessageRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddMessageVariables): MutationRef<AddMessageData, AddMessageVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddMessageVariables): MutationRef<AddMessageData, AddMessageVariables>;
  operationName: string;
}
export const addMessageRef: AddMessageRef;

export function addMessage(vars: AddMessageVariables): MutationPromise<AddMessageData, AddMessageVariables>;
export function addMessage(dc: DataConnect, vars: AddMessageVariables): MutationPromise<AddMessageData, AddMessageVariables>;

interface UpdateChatSessionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateChatSessionVariables): MutationRef<UpdateChatSessionData, UpdateChatSessionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateChatSessionVariables): MutationRef<UpdateChatSessionData, UpdateChatSessionVariables>;
  operationName: string;
}
export const updateChatSessionRef: UpdateChatSessionRef;

export function updateChatSession(vars: UpdateChatSessionVariables): MutationPromise<UpdateChatSessionData, UpdateChatSessionVariables>;
export function updateChatSession(dc: DataConnect, vars: UpdateChatSessionVariables): MutationPromise<UpdateChatSessionData, UpdateChatSessionVariables>;

interface CreateTaskRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateTaskVariables): MutationRef<CreateTaskData, CreateTaskVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateTaskVariables): MutationRef<CreateTaskData, CreateTaskVariables>;
  operationName: string;
}
export const createTaskRef: CreateTaskRef;

export function createTask(vars: CreateTaskVariables): MutationPromise<CreateTaskData, CreateTaskVariables>;
export function createTask(dc: DataConnect, vars: CreateTaskVariables): MutationPromise<CreateTaskData, CreateTaskVariables>;

interface UpdateTaskStatusRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateTaskStatusVariables): MutationRef<UpdateTaskStatusData, UpdateTaskStatusVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateTaskStatusVariables): MutationRef<UpdateTaskStatusData, UpdateTaskStatusVariables>;
  operationName: string;
}
export const updateTaskStatusRef: UpdateTaskStatusRef;

export function updateTaskStatus(vars: UpdateTaskStatusVariables): MutationPromise<UpdateTaskStatusData, UpdateTaskStatusVariables>;
export function updateTaskStatus(dc: DataConnect, vars: UpdateTaskStatusVariables): MutationPromise<UpdateTaskStatusData, UpdateTaskStatusVariables>;

interface AddKnowledgeEntryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddKnowledgeEntryVariables): MutationRef<AddKnowledgeEntryData, AddKnowledgeEntryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddKnowledgeEntryVariables): MutationRef<AddKnowledgeEntryData, AddKnowledgeEntryVariables>;
  operationName: string;
}
export const addKnowledgeEntryRef: AddKnowledgeEntryRef;

export function addKnowledgeEntry(vars: AddKnowledgeEntryVariables): MutationPromise<AddKnowledgeEntryData, AddKnowledgeEntryVariables>;
export function addKnowledgeEntry(dc: DataConnect, vars: AddKnowledgeEntryVariables): MutationPromise<AddKnowledgeEntryData, AddKnowledgeEntryVariables>;

