import { UpsertUserData, UpsertUserVariables, CreateChatSessionData, CreateChatSessionVariables, AddMessageData, AddMessageVariables, UpdateChatSessionData, UpdateChatSessionVariables, CreateTaskData, CreateTaskVariables, UpdateTaskStatusData, UpdateTaskStatusVariables, AddKnowledgeEntryData, AddKnowledgeEntryVariables, GetCurrentUserData, ListUserChatSessionsData, GetChatSessionData, GetChatSessionVariables, ListTasksData, ListTasksVariables, SearchKnowledgeData, SearchKnowledgeVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useUpsertUser(options?: useDataConnectMutationOptions<UpsertUserData, FirebaseError, UpsertUserVariables>): UseDataConnectMutationResult<UpsertUserData, UpsertUserVariables>;
export function useUpsertUser(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertUserData, FirebaseError, UpsertUserVariables>): UseDataConnectMutationResult<UpsertUserData, UpsertUserVariables>;

export function useCreateChatSession(options?: useDataConnectMutationOptions<CreateChatSessionData, FirebaseError, CreateChatSessionVariables>): UseDataConnectMutationResult<CreateChatSessionData, CreateChatSessionVariables>;
export function useCreateChatSession(dc: DataConnect, options?: useDataConnectMutationOptions<CreateChatSessionData, FirebaseError, CreateChatSessionVariables>): UseDataConnectMutationResult<CreateChatSessionData, CreateChatSessionVariables>;

export function useAddMessage(options?: useDataConnectMutationOptions<AddMessageData, FirebaseError, AddMessageVariables>): UseDataConnectMutationResult<AddMessageData, AddMessageVariables>;
export function useAddMessage(dc: DataConnect, options?: useDataConnectMutationOptions<AddMessageData, FirebaseError, AddMessageVariables>): UseDataConnectMutationResult<AddMessageData, AddMessageVariables>;

export function useUpdateChatSession(options?: useDataConnectMutationOptions<UpdateChatSessionData, FirebaseError, UpdateChatSessionVariables>): UseDataConnectMutationResult<UpdateChatSessionData, UpdateChatSessionVariables>;
export function useUpdateChatSession(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateChatSessionData, FirebaseError, UpdateChatSessionVariables>): UseDataConnectMutationResult<UpdateChatSessionData, UpdateChatSessionVariables>;

export function useCreateTask(options?: useDataConnectMutationOptions<CreateTaskData, FirebaseError, CreateTaskVariables>): UseDataConnectMutationResult<CreateTaskData, CreateTaskVariables>;
export function useCreateTask(dc: DataConnect, options?: useDataConnectMutationOptions<CreateTaskData, FirebaseError, CreateTaskVariables>): UseDataConnectMutationResult<CreateTaskData, CreateTaskVariables>;

export function useUpdateTaskStatus(options?: useDataConnectMutationOptions<UpdateTaskStatusData, FirebaseError, UpdateTaskStatusVariables>): UseDataConnectMutationResult<UpdateTaskStatusData, UpdateTaskStatusVariables>;
export function useUpdateTaskStatus(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateTaskStatusData, FirebaseError, UpdateTaskStatusVariables>): UseDataConnectMutationResult<UpdateTaskStatusData, UpdateTaskStatusVariables>;

export function useAddKnowledgeEntry(options?: useDataConnectMutationOptions<AddKnowledgeEntryData, FirebaseError, AddKnowledgeEntryVariables>): UseDataConnectMutationResult<AddKnowledgeEntryData, AddKnowledgeEntryVariables>;
export function useAddKnowledgeEntry(dc: DataConnect, options?: useDataConnectMutationOptions<AddKnowledgeEntryData, FirebaseError, AddKnowledgeEntryVariables>): UseDataConnectMutationResult<AddKnowledgeEntryData, AddKnowledgeEntryVariables>;

export function useGetCurrentUser(options?: useDataConnectQueryOptions<GetCurrentUserData>): UseDataConnectQueryResult<GetCurrentUserData, undefined>;
export function useGetCurrentUser(dc: DataConnect, options?: useDataConnectQueryOptions<GetCurrentUserData>): UseDataConnectQueryResult<GetCurrentUserData, undefined>;

export function useListUserChatSessions(options?: useDataConnectQueryOptions<ListUserChatSessionsData>): UseDataConnectQueryResult<ListUserChatSessionsData, undefined>;
export function useListUserChatSessions(dc: DataConnect, options?: useDataConnectQueryOptions<ListUserChatSessionsData>): UseDataConnectQueryResult<ListUserChatSessionsData, undefined>;

export function useGetChatSession(vars: GetChatSessionVariables, options?: useDataConnectQueryOptions<GetChatSessionData>): UseDataConnectQueryResult<GetChatSessionData, GetChatSessionVariables>;
export function useGetChatSession(dc: DataConnect, vars: GetChatSessionVariables, options?: useDataConnectQueryOptions<GetChatSessionData>): UseDataConnectQueryResult<GetChatSessionData, GetChatSessionVariables>;

export function useListTasks(vars?: ListTasksVariables, options?: useDataConnectQueryOptions<ListTasksData>): UseDataConnectQueryResult<ListTasksData, ListTasksVariables>;
export function useListTasks(dc: DataConnect, vars?: ListTasksVariables, options?: useDataConnectQueryOptions<ListTasksData>): UseDataConnectQueryResult<ListTasksData, ListTasksVariables>;

export function useSearchKnowledge(vars: SearchKnowledgeVariables, options?: useDataConnectQueryOptions<SearchKnowledgeData>): UseDataConnectQueryResult<SearchKnowledgeData, SearchKnowledgeVariables>;
export function useSearchKnowledge(dc: DataConnect, vars: SearchKnowledgeVariables, options?: useDataConnectQueryOptions<SearchKnowledgeData>): UseDataConnectQueryResult<SearchKnowledgeData, SearchKnowledgeVariables>;
