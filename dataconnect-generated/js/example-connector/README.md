# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`example-connector/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetCurrentUser*](#getcurrentuser)
  - [*ListUserChatSessions*](#listuserchatsessions)
  - [*GetChatSession*](#getchatsession)
  - [*ListTasks*](#listtasks)
  - [*SearchKnowledge*](#searchknowledge)
- [**Mutations**](#mutations)
  - [*UpsertUser*](#upsertuser)
  - [*CreateChatSession*](#createchatsession)
  - [*AddMessage*](#addmessage)
  - [*UpdateChatSession*](#updatechatsession)
  - [*CreateTask*](#createtask)
  - [*UpdateTaskStatus*](#updatetaskstatus)
  - [*AddKnowledgeEntry*](#addknowledgeentry)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetCurrentUser
You can execute the `GetCurrentUser` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [example-connector/index.d.ts](./index.d.ts):
```typescript
getCurrentUser(): QueryPromise<GetCurrentUserData, undefined>;

interface GetCurrentUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetCurrentUserData, undefined>;
}
export const getCurrentUserRef: GetCurrentUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getCurrentUser(dc: DataConnect): QueryPromise<GetCurrentUserData, undefined>;

interface GetCurrentUserRef {
  ...
  (dc: DataConnect): QueryRef<GetCurrentUserData, undefined>;
}
export const getCurrentUserRef: GetCurrentUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getCurrentUserRef:
```typescript
const name = getCurrentUserRef.operationName;
// Removed console.log
```

### Variables
The `GetCurrentUser` query has no variables.
### Return Type
Recall that executing the `GetCurrentUser` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetCurrentUserData`, which is defined in [example-connector/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetCurrentUserData {
  user?: {
    id: string;
    email: string;
    displayName?: string | null;
    createdAt: TimestampString;
    lastActiveAt?: TimestampString | null;
  } & User_Key;
}
```
### Using `GetCurrentUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getCurrentUser } from '@dataconnect/generated';


// Call the `getCurrentUser()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getCurrentUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getCurrentUser(dataConnect);

// Removed console.log

// Or, you can use the `Promise` API.
getCurrentUser().then((response) => {
  const data = response.data;
  // Removed console.log
});
```

### Using `GetCurrentUser`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getCurrentUserRef } from '@dataconnect/generated';


// Call the `getCurrentUserRef()` function to get a reference to the query.
const ref = getCurrentUserRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getCurrentUserRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

// Removed console.log

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  // Removed console.log
});
```

## ListUserChatSessions
You can execute the `ListUserChatSessions` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [example-connector/index.d.ts](./index.d.ts):
```typescript
listUserChatSessions(): QueryPromise<ListUserChatSessionsData, undefined>;

interface ListUserChatSessionsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListUserChatSessionsData, undefined>;
}
export const listUserChatSessionsRef: ListUserChatSessionsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listUserChatSessions(dc: DataConnect): QueryPromise<ListUserChatSessionsData, undefined>;

interface ListUserChatSessionsRef {
  ...
  (dc: DataConnect): QueryRef<ListUserChatSessionsData, undefined>;
}
export const listUserChatSessionsRef: ListUserChatSessionsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listUserChatSessionsRef:
```typescript
const name = listUserChatSessionsRef.operationName;
// Removed console.log
```

### Variables
The `ListUserChatSessions` query has no variables.
### Return Type
Recall that executing the `ListUserChatSessions` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListUserChatSessionsData`, which is defined in [example-connector/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListUserChatSessions`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listUserChatSessions } from '@dataconnect/generated';


// Call the `listUserChatSessions()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listUserChatSessions();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listUserChatSessions(dataConnect);

// Removed console.log

// Or, you can use the `Promise` API.
listUserChatSessions().then((response) => {
  const data = response.data;
  // Removed console.log
});
```

### Using `ListUserChatSessions`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listUserChatSessionsRef } from '@dataconnect/generated';


// Call the `listUserChatSessionsRef()` function to get a reference to the query.
const ref = listUserChatSessionsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listUserChatSessionsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

// Removed console.log

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  // Removed console.log
});
```

## GetChatSession
You can execute the `GetChatSession` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [example-connector/index.d.ts](./index.d.ts):
```typescript
getChatSession(vars: GetChatSessionVariables): QueryPromise<GetChatSessionData, GetChatSessionVariables>;

interface GetChatSessionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetChatSessionVariables): QueryRef<GetChatSessionData, GetChatSessionVariables>;
}
export const getChatSessionRef: GetChatSessionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getChatSession(dc: DataConnect, vars: GetChatSessionVariables): QueryPromise<GetChatSessionData, GetChatSessionVariables>;

interface GetChatSessionRef {
  ...
  (dc: DataConnect, vars: GetChatSessionVariables): QueryRef<GetChatSessionData, GetChatSessionVariables>;
}
export const getChatSessionRef: GetChatSessionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getChatSessionRef:
```typescript
const name = getChatSessionRef.operationName;
// Removed console.log
```

### Variables
The `GetChatSession` query requires an argument of type `GetChatSessionVariables`, which is defined in [example-connector/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetChatSessionVariables {
  sessionId: UUIDString;
}
```
### Return Type
Recall that executing the `GetChatSession` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetChatSessionData`, which is defined in [example-connector/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetChatSession`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getChatSession, GetChatSessionVariables } from '@dataconnect/generated';

// The `GetChatSession` query requires an argument of type `GetChatSessionVariables`:
const getChatSessionVars: GetChatSessionVariables = {
  sessionId: ..., 
};

// Call the `getChatSession()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getChatSession(getChatSessionVars);
// Variables can be defined inline as well.
const { data } = await getChatSession({ sessionId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getChatSession(dataConnect, getChatSessionVars);

// Removed console.log

// Or, you can use the `Promise` API.
getChatSession(getChatSessionVars).then((response) => {
  const data = response.data;
  // Removed console.log
});
```

### Using `GetChatSession`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getChatSessionRef, GetChatSessionVariables } from '@dataconnect/generated';

// The `GetChatSession` query requires an argument of type `GetChatSessionVariables`:
const getChatSessionVars: GetChatSessionVariables = {
  sessionId: ..., 
};

// Call the `getChatSessionRef()` function to get a reference to the query.
const ref = getChatSessionRef(getChatSessionVars);
// Variables can be defined inline as well.
const ref = getChatSessionRef({ sessionId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getChatSessionRef(dataConnect, getChatSessionVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

// Removed console.log

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  // Removed console.log
});
```

## ListTasks
You can execute the `ListTasks` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [example-connector/index.d.ts](./index.d.ts):
```typescript
listTasks(vars?: ListTasksVariables): QueryPromise<ListTasksData, ListTasksVariables>;

interface ListTasksRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: ListTasksVariables): QueryRef<ListTasksData, ListTasksVariables>;
}
export const listTasksRef: ListTasksRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listTasks(dc: DataConnect, vars?: ListTasksVariables): QueryPromise<ListTasksData, ListTasksVariables>;

interface ListTasksRef {
  ...
  (dc: DataConnect, vars?: ListTasksVariables): QueryRef<ListTasksData, ListTasksVariables>;
}
export const listTasksRef: ListTasksRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listTasksRef:
```typescript
const name = listTasksRef.operationName;
// Removed console.log
```

### Variables
The `ListTasks` query has an optional argument of type `ListTasksVariables`, which is defined in [example-connector/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListTasksVariables {
  status?: string | null;
}
```
### Return Type
Recall that executing the `ListTasks` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListTasksData`, which is defined in [example-connector/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListTasks`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listTasks, ListTasksVariables } from '@dataconnect/generated';

// The `ListTasks` query has an optional argument of type `ListTasksVariables`:
const listTasksVars: ListTasksVariables = {
  status: ..., // optional
};

// Call the `listTasks()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listTasks(listTasksVars);
// Variables can be defined inline as well.
const { data } = await listTasks({ status: ..., });
// Since all variables are optional for this query, you can omit the `ListTasksVariables` argument.
const { data } = await listTasks();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listTasks(dataConnect, listTasksVars);

// Removed console.log

// Or, you can use the `Promise` API.
listTasks(listTasksVars).then((response) => {
  const data = response.data;
  // Removed console.log
});
```

### Using `ListTasks`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listTasksRef, ListTasksVariables } from '@dataconnect/generated';

// The `ListTasks` query has an optional argument of type `ListTasksVariables`:
const listTasksVars: ListTasksVariables = {
  status: ..., // optional
};

// Call the `listTasksRef()` function to get a reference to the query.
const ref = listTasksRef(listTasksVars);
// Variables can be defined inline as well.
const ref = listTasksRef({ status: ..., });
// Since all variables are optional for this query, you can omit the `ListTasksVariables` argument.
const ref = listTasksRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listTasksRef(dataConnect, listTasksVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

// Removed console.log

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  // Removed console.log
});
```

## SearchKnowledge
You can execute the `SearchKnowledge` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [example-connector/index.d.ts](./index.d.ts):
```typescript
searchKnowledge(vars: SearchKnowledgeVariables): QueryPromise<SearchKnowledgeData, SearchKnowledgeVariables>;

interface SearchKnowledgeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: SearchKnowledgeVariables): QueryRef<SearchKnowledgeData, SearchKnowledgeVariables>;
}
export const searchKnowledgeRef: SearchKnowledgeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
searchKnowledge(dc: DataConnect, vars: SearchKnowledgeVariables): QueryPromise<SearchKnowledgeData, SearchKnowledgeVariables>;

interface SearchKnowledgeRef {
  ...
  (dc: DataConnect, vars: SearchKnowledgeVariables): QueryRef<SearchKnowledgeData, SearchKnowledgeVariables>;
}
export const searchKnowledgeRef: SearchKnowledgeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the searchKnowledgeRef:
```typescript
const name = searchKnowledgeRef.operationName;
// Removed console.log
```

### Variables
The `SearchKnowledge` query requires an argument of type `SearchKnowledgeVariables`, which is defined in [example-connector/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface SearchKnowledgeVariables {
  query: string;
  category?: string | null;
}
```
### Return Type
Recall that executing the `SearchKnowledge` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `SearchKnowledgeData`, which is defined in [example-connector/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `SearchKnowledge`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, searchKnowledge, SearchKnowledgeVariables } from '@dataconnect/generated';

// The `SearchKnowledge` query requires an argument of type `SearchKnowledgeVariables`:
const searchKnowledgeVars: SearchKnowledgeVariables = {
  query: ..., 
  category: ..., // optional
};

// Call the `searchKnowledge()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await searchKnowledge(searchKnowledgeVars);
// Variables can be defined inline as well.
const { data } = await searchKnowledge({ query: ..., category: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await searchKnowledge(dataConnect, searchKnowledgeVars);

// Removed console.log

// Or, you can use the `Promise` API.
searchKnowledge(searchKnowledgeVars).then((response) => {
  const data = response.data;
  // Removed console.log
});
```

### Using `SearchKnowledge`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, searchKnowledgeRef, SearchKnowledgeVariables } from '@dataconnect/generated';

// The `SearchKnowledge` query requires an argument of type `SearchKnowledgeVariables`:
const searchKnowledgeVars: SearchKnowledgeVariables = {
  query: ..., 
  category: ..., // optional
};

// Call the `searchKnowledgeRef()` function to get a reference to the query.
const ref = searchKnowledgeRef(searchKnowledgeVars);
// Variables can be defined inline as well.
const ref = searchKnowledgeRef({ query: ..., category: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = searchKnowledgeRef(dataConnect, searchKnowledgeVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

// Removed console.log

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  // Removed console.log
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## UpsertUser
You can execute the `UpsertUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [example-connector/index.d.ts](./index.d.ts):
```typescript
upsertUser(vars: UpsertUserVariables): MutationPromise<UpsertUserData, UpsertUserVariables>;

interface UpsertUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertUserVariables): MutationRef<UpsertUserData, UpsertUserVariables>;
}
export const upsertUserRef: UpsertUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertUser(dc: DataConnect, vars: UpsertUserVariables): MutationPromise<UpsertUserData, UpsertUserVariables>;

interface UpsertUserRef {
  ...
  (dc: DataConnect, vars: UpsertUserVariables): MutationRef<UpsertUserData, UpsertUserVariables>;
}
export const upsertUserRef: UpsertUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertUserRef:
```typescript
const name = upsertUserRef.operationName;
// Removed console.log
```

### Variables
The `UpsertUser` mutation requires an argument of type `UpsertUserVariables`, which is defined in [example-connector/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertUserVariables {
  email: string;
  displayName?: string | null;
}
```
### Return Type
Recall that executing the `UpsertUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertUserData`, which is defined in [example-connector/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertUserData {
  user_upsert: User_Key;
}
```
### Using `UpsertUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertUser, UpsertUserVariables } from '@dataconnect/generated';

// The `UpsertUser` mutation requires an argument of type `UpsertUserVariables`:
const upsertUserVars: UpsertUserVariables = {
  email: ..., 
  displayName: ..., // optional
};

// Call the `upsertUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertUser(upsertUserVars);
// Variables can be defined inline as well.
const { data } = await upsertUser({ email: ..., displayName: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertUser(dataConnect, upsertUserVars);

// Removed console.log

// Or, you can use the `Promise` API.
upsertUser(upsertUserVars).then((response) => {
  const data = response.data;
  // Removed console.log
});
```

### Using `UpsertUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertUserRef, UpsertUserVariables } from '@dataconnect/generated';

// The `UpsertUser` mutation requires an argument of type `UpsertUserVariables`:
const upsertUserVars: UpsertUserVariables = {
  email: ..., 
  displayName: ..., // optional
};

// Call the `upsertUserRef()` function to get a reference to the mutation.
const ref = upsertUserRef(upsertUserVars);
// Variables can be defined inline as well.
const ref = upsertUserRef({ email: ..., displayName: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertUserRef(dataConnect, upsertUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

// Removed console.log

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  // Removed console.log
});
```

## CreateChatSession
You can execute the `CreateChatSession` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [example-connector/index.d.ts](./index.d.ts):
```typescript
createChatSession(vars: CreateChatSessionVariables): MutationPromise<CreateChatSessionData, CreateChatSessionVariables>;

interface CreateChatSessionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateChatSessionVariables): MutationRef<CreateChatSessionData, CreateChatSessionVariables>;
}
export const createChatSessionRef: CreateChatSessionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createChatSession(dc: DataConnect, vars: CreateChatSessionVariables): MutationPromise<CreateChatSessionData, CreateChatSessionVariables>;

interface CreateChatSessionRef {
  ...
  (dc: DataConnect, vars: CreateChatSessionVariables): MutationRef<CreateChatSessionData, CreateChatSessionVariables>;
}
export const createChatSessionRef: CreateChatSessionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createChatSessionRef:
```typescript
const name = createChatSessionRef.operationName;
// Removed console.log
```

### Variables
The `CreateChatSession` mutation requires an argument of type `CreateChatSessionVariables`, which is defined in [example-connector/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateChatSessionVariables {
  agentType: string;
  title?: string | null;
}
```
### Return Type
Recall that executing the `CreateChatSession` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateChatSessionData`, which is defined in [example-connector/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateChatSessionData {
  chatSession_insert: ChatSession_Key;
}
```
### Using `CreateChatSession`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createChatSession, CreateChatSessionVariables } from '@dataconnect/generated';

// The `CreateChatSession` mutation requires an argument of type `CreateChatSessionVariables`:
const createChatSessionVars: CreateChatSessionVariables = {
  agentType: ..., 
  title: ..., // optional
};

// Call the `createChatSession()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createChatSession(createChatSessionVars);
// Variables can be defined inline as well.
const { data } = await createChatSession({ agentType: ..., title: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createChatSession(dataConnect, createChatSessionVars);

// Removed console.log

// Or, you can use the `Promise` API.
createChatSession(createChatSessionVars).then((response) => {
  const data = response.data;
  // Removed console.log
});
```

### Using `CreateChatSession`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createChatSessionRef, CreateChatSessionVariables } from '@dataconnect/generated';

// The `CreateChatSession` mutation requires an argument of type `CreateChatSessionVariables`:
const createChatSessionVars: CreateChatSessionVariables = {
  agentType: ..., 
  title: ..., // optional
};

// Call the `createChatSessionRef()` function to get a reference to the mutation.
const ref = createChatSessionRef(createChatSessionVars);
// Variables can be defined inline as well.
const ref = createChatSessionRef({ agentType: ..., title: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createChatSessionRef(dataConnect, createChatSessionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

// Removed console.log

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  // Removed console.log
});
```

## AddMessage
You can execute the `AddMessage` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [example-connector/index.d.ts](./index.d.ts):
```typescript
addMessage(vars: AddMessageVariables): MutationPromise<AddMessageData, AddMessageVariables>;

interface AddMessageRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddMessageVariables): MutationRef<AddMessageData, AddMessageVariables>;
}
export const addMessageRef: AddMessageRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addMessage(dc: DataConnect, vars: AddMessageVariables): MutationPromise<AddMessageData, AddMessageVariables>;

interface AddMessageRef {
  ...
  (dc: DataConnect, vars: AddMessageVariables): MutationRef<AddMessageData, AddMessageVariables>;
}
export const addMessageRef: AddMessageRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addMessageRef:
```typescript
const name = addMessageRef.operationName;
// Removed console.log
```

### Variables
The `AddMessage` mutation requires an argument of type `AddMessageVariables`, which is defined in [example-connector/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AddMessageVariables {
  sessionId: UUIDString;
  role: string;
  content: string;
  metadata?: string | null;
}
```
### Return Type
Recall that executing the `AddMessage` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddMessageData`, which is defined in [example-connector/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddMessageData {
  message_insert: Message_Key;
}
```
### Using `AddMessage`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addMessage, AddMessageVariables } from '@dataconnect/generated';

// The `AddMessage` mutation requires an argument of type `AddMessageVariables`:
const addMessageVars: AddMessageVariables = {
  sessionId: ..., 
  role: ..., 
  content: ..., 
  metadata: ..., // optional
};

// Call the `addMessage()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addMessage(addMessageVars);
// Variables can be defined inline as well.
const { data } = await addMessage({ sessionId: ..., role: ..., content: ..., metadata: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addMessage(dataConnect, addMessageVars);

// Removed console.log

// Or, you can use the `Promise` API.
addMessage(addMessageVars).then((response) => {
  const data = response.data;
  // Removed console.log
});
```

### Using `AddMessage`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addMessageRef, AddMessageVariables } from '@dataconnect/generated';

// The `AddMessage` mutation requires an argument of type `AddMessageVariables`:
const addMessageVars: AddMessageVariables = {
  sessionId: ..., 
  role: ..., 
  content: ..., 
  metadata: ..., // optional
};

// Call the `addMessageRef()` function to get a reference to the mutation.
const ref = addMessageRef(addMessageVars);
// Variables can be defined inline as well.
const ref = addMessageRef({ sessionId: ..., role: ..., content: ..., metadata: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addMessageRef(dataConnect, addMessageVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

// Removed console.log

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  // Removed console.log
});
```

## UpdateChatSession
You can execute the `UpdateChatSession` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [example-connector/index.d.ts](./index.d.ts):
```typescript
updateChatSession(vars: UpdateChatSessionVariables): MutationPromise<UpdateChatSessionData, UpdateChatSessionVariables>;

interface UpdateChatSessionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateChatSessionVariables): MutationRef<UpdateChatSessionData, UpdateChatSessionVariables>;
}
export const updateChatSessionRef: UpdateChatSessionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateChatSession(dc: DataConnect, vars: UpdateChatSessionVariables): MutationPromise<UpdateChatSessionData, UpdateChatSessionVariables>;

interface UpdateChatSessionRef {
  ...
  (dc: DataConnect, vars: UpdateChatSessionVariables): MutationRef<UpdateChatSessionData, UpdateChatSessionVariables>;
}
export const updateChatSessionRef: UpdateChatSessionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateChatSessionRef:
```typescript
const name = updateChatSessionRef.operationName;
// Removed console.log
```

### Variables
The `UpdateChatSession` mutation requires an argument of type `UpdateChatSessionVariables`, which is defined in [example-connector/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateChatSessionVariables {
  sessionId: UUIDString;
  title?: string | null;
  isActive?: boolean | null;
}
```
### Return Type
Recall that executing the `UpdateChatSession` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateChatSessionData`, which is defined in [example-connector/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateChatSessionData {
  chatSession_update?: ChatSession_Key | null;
}
```
### Using `UpdateChatSession`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateChatSession, UpdateChatSessionVariables } from '@dataconnect/generated';

// The `UpdateChatSession` mutation requires an argument of type `UpdateChatSessionVariables`:
const updateChatSessionVars: UpdateChatSessionVariables = {
  sessionId: ..., 
  title: ..., // optional
  isActive: ..., // optional
};

// Call the `updateChatSession()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateChatSession(updateChatSessionVars);
// Variables can be defined inline as well.
const { data } = await updateChatSession({ sessionId: ..., title: ..., isActive: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateChatSession(dataConnect, updateChatSessionVars);

// Removed console.log

// Or, you can use the `Promise` API.
updateChatSession(updateChatSessionVars).then((response) => {
  const data = response.data;
  // Removed console.log
});
```

### Using `UpdateChatSession`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateChatSessionRef, UpdateChatSessionVariables } from '@dataconnect/generated';

// The `UpdateChatSession` mutation requires an argument of type `UpdateChatSessionVariables`:
const updateChatSessionVars: UpdateChatSessionVariables = {
  sessionId: ..., 
  title: ..., // optional
  isActive: ..., // optional
};

// Call the `updateChatSessionRef()` function to get a reference to the mutation.
const ref = updateChatSessionRef(updateChatSessionVars);
// Variables can be defined inline as well.
const ref = updateChatSessionRef({ sessionId: ..., title: ..., isActive: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateChatSessionRef(dataConnect, updateChatSessionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

// Removed console.log

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  // Removed console.log
});
```

## CreateTask
You can execute the `CreateTask` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [example-connector/index.d.ts](./index.d.ts):
```typescript
createTask(vars: CreateTaskVariables): MutationPromise<CreateTaskData, CreateTaskVariables>;

interface CreateTaskRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateTaskVariables): MutationRef<CreateTaskData, CreateTaskVariables>;
}
export const createTaskRef: CreateTaskRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createTask(dc: DataConnect, vars: CreateTaskVariables): MutationPromise<CreateTaskData, CreateTaskVariables>;

interface CreateTaskRef {
  ...
  (dc: DataConnect, vars: CreateTaskVariables): MutationRef<CreateTaskData, CreateTaskVariables>;
}
export const createTaskRef: CreateTaskRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createTaskRef:
```typescript
const name = createTaskRef.operationName;
// Removed console.log
```

### Variables
The `CreateTask` mutation requires an argument of type `CreateTaskVariables`, which is defined in [example-connector/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateTaskVariables {
  title: string;
  description?: string | null;
  priority: string;
  assignedAgent?: string | null;
}
```
### Return Type
Recall that executing the `CreateTask` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateTaskData`, which is defined in [example-connector/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateTaskData {
  task_insert: Task_Key;
}
```
### Using `CreateTask`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createTask, CreateTaskVariables } from '@dataconnect/generated';

// The `CreateTask` mutation requires an argument of type `CreateTaskVariables`:
const createTaskVars: CreateTaskVariables = {
  title: ..., 
  description: ..., // optional
  priority: ..., 
  assignedAgent: ..., // optional
};

// Call the `createTask()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createTask(createTaskVars);
// Variables can be defined inline as well.
const { data } = await createTask({ title: ..., description: ..., priority: ..., assignedAgent: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createTask(dataConnect, createTaskVars);

// Removed console.log

// Or, you can use the `Promise` API.
createTask(createTaskVars).then((response) => {
  const data = response.data;
  // Removed console.log
});
```

### Using `CreateTask`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createTaskRef, CreateTaskVariables } from '@dataconnect/generated';

// The `CreateTask` mutation requires an argument of type `CreateTaskVariables`:
const createTaskVars: CreateTaskVariables = {
  title: ..., 
  description: ..., // optional
  priority: ..., 
  assignedAgent: ..., // optional
};

// Call the `createTaskRef()` function to get a reference to the mutation.
const ref = createTaskRef(createTaskVars);
// Variables can be defined inline as well.
const ref = createTaskRef({ title: ..., description: ..., priority: ..., assignedAgent: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createTaskRef(dataConnect, createTaskVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

// Removed console.log

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  // Removed console.log
});
```

## UpdateTaskStatus
You can execute the `UpdateTaskStatus` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [example-connector/index.d.ts](./index.d.ts):
```typescript
updateTaskStatus(vars: UpdateTaskStatusVariables): MutationPromise<UpdateTaskStatusData, UpdateTaskStatusVariables>;

interface UpdateTaskStatusRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateTaskStatusVariables): MutationRef<UpdateTaskStatusData, UpdateTaskStatusVariables>;
}
export const updateTaskStatusRef: UpdateTaskStatusRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateTaskStatus(dc: DataConnect, vars: UpdateTaskStatusVariables): MutationPromise<UpdateTaskStatusData, UpdateTaskStatusVariables>;

interface UpdateTaskStatusRef {
  ...
  (dc: DataConnect, vars: UpdateTaskStatusVariables): MutationRef<UpdateTaskStatusData, UpdateTaskStatusVariables>;
}
export const updateTaskStatusRef: UpdateTaskStatusRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateTaskStatusRef:
```typescript
const name = updateTaskStatusRef.operationName;
// Removed console.log
```

### Variables
The `UpdateTaskStatus` mutation requires an argument of type `UpdateTaskStatusVariables`, which is defined in [example-connector/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateTaskStatusVariables {
  taskId: UUIDString;
  status: string;
  completedAt?: TimestampString | null;
}
```
### Return Type
Recall that executing the `UpdateTaskStatus` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateTaskStatusData`, which is defined in [example-connector/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateTaskStatusData {
  task_update?: Task_Key | null;
}
```
### Using `UpdateTaskStatus`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateTaskStatus, UpdateTaskStatusVariables } from '@dataconnect/generated';

// The `UpdateTaskStatus` mutation requires an argument of type `UpdateTaskStatusVariables`:
const updateTaskStatusVars: UpdateTaskStatusVariables = {
  taskId: ..., 
  status: ..., 
  completedAt: ..., // optional
};

// Call the `updateTaskStatus()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateTaskStatus(updateTaskStatusVars);
// Variables can be defined inline as well.
const { data } = await updateTaskStatus({ taskId: ..., status: ..., completedAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateTaskStatus(dataConnect, updateTaskStatusVars);

// Removed console.log

// Or, you can use the `Promise` API.
updateTaskStatus(updateTaskStatusVars).then((response) => {
  const data = response.data;
  // Removed console.log
});
```

### Using `UpdateTaskStatus`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateTaskStatusRef, UpdateTaskStatusVariables } from '@dataconnect/generated';

// The `UpdateTaskStatus` mutation requires an argument of type `UpdateTaskStatusVariables`:
const updateTaskStatusVars: UpdateTaskStatusVariables = {
  taskId: ..., 
  status: ..., 
  completedAt: ..., // optional
};

// Call the `updateTaskStatusRef()` function to get a reference to the mutation.
const ref = updateTaskStatusRef(updateTaskStatusVars);
// Variables can be defined inline as well.
const ref = updateTaskStatusRef({ taskId: ..., status: ..., completedAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateTaskStatusRef(dataConnect, updateTaskStatusVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

// Removed console.log

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  // Removed console.log
});
```

## AddKnowledgeEntry
You can execute the `AddKnowledgeEntry` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [example-connector/index.d.ts](./index.d.ts):
```typescript
addKnowledgeEntry(vars: AddKnowledgeEntryVariables): MutationPromise<AddKnowledgeEntryData, AddKnowledgeEntryVariables>;

interface AddKnowledgeEntryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddKnowledgeEntryVariables): MutationRef<AddKnowledgeEntryData, AddKnowledgeEntryVariables>;
}
export const addKnowledgeEntryRef: AddKnowledgeEntryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addKnowledgeEntry(dc: DataConnect, vars: AddKnowledgeEntryVariables): MutationPromise<AddKnowledgeEntryData, AddKnowledgeEntryVariables>;

interface AddKnowledgeEntryRef {
  ...
  (dc: DataConnect, vars: AddKnowledgeEntryVariables): MutationRef<AddKnowledgeEntryData, AddKnowledgeEntryVariables>;
}
export const addKnowledgeEntryRef: AddKnowledgeEntryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addKnowledgeEntryRef:
```typescript
const name = addKnowledgeEntryRef.operationName;
// Removed console.log
```

### Variables
The `AddKnowledgeEntry` mutation requires an argument of type `AddKnowledgeEntryVariables`, which is defined in [example-connector/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AddKnowledgeEntryVariables {
  title: string;
  content: string;
  category: string;
  tags?: string | null;
  source?: string | null;
}
```
### Return Type
Recall that executing the `AddKnowledgeEntry` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddKnowledgeEntryData`, which is defined in [example-connector/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddKnowledgeEntryData {
  knowledgeEntry_insert: KnowledgeEntry_Key;
}
```
### Using `AddKnowledgeEntry`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addKnowledgeEntry, AddKnowledgeEntryVariables } from '@dataconnect/generated';

// The `AddKnowledgeEntry` mutation requires an argument of type `AddKnowledgeEntryVariables`:
const addKnowledgeEntryVars: AddKnowledgeEntryVariables = {
  title: ..., 
  content: ..., 
  category: ..., 
  tags: ..., // optional
  source: ..., // optional
};

// Call the `addKnowledgeEntry()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addKnowledgeEntry(addKnowledgeEntryVars);
// Variables can be defined inline as well.
const { data } = await addKnowledgeEntry({ title: ..., content: ..., category: ..., tags: ..., source: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addKnowledgeEntry(dataConnect, addKnowledgeEntryVars);

// Removed console.log

// Or, you can use the `Promise` API.
addKnowledgeEntry(addKnowledgeEntryVars).then((response) => {
  const data = response.data;
  // Removed console.log
});
```

### Using `AddKnowledgeEntry`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addKnowledgeEntryRef, AddKnowledgeEntryVariables } from '@dataconnect/generated';

// The `AddKnowledgeEntry` mutation requires an argument of type `AddKnowledgeEntryVariables`:
const addKnowledgeEntryVars: AddKnowledgeEntryVariables = {
  title: ..., 
  content: ..., 
  category: ..., 
  tags: ..., // optional
  source: ..., // optional
};

// Call the `addKnowledgeEntryRef()` function to get a reference to the mutation.
const ref = addKnowledgeEntryRef(addKnowledgeEntryVars);
// Variables can be defined inline as well.
const ref = addKnowledgeEntryRef({ title: ..., content: ..., category: ..., tags: ..., source: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addKnowledgeEntryRef(dataConnect, addKnowledgeEntryVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

// Removed console.log

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  // Removed console.log
});
```

