# Generated React README
This README will guide you through the process of using the generated React SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `JavaScript README`, you can find it at [`dataconnect-sdk/README.md`](../README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

You can use this generated SDK by importing from the package `@azizsys/dataconnect-sdk/react` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#react).

# Table of Contents
- [**Overview**](#generated-react-readme)
- [**TanStack Query Firebase & TanStack React Query**](#tanstack-query-firebase-tanstack-react-query)
  - [*Package Installation*](#installing-tanstack-query-firebase-and-tanstack-react-query-packages)
  - [*Configuring TanStack Query*](#configuring-tanstack-query)
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

# TanStack Query Firebase & TanStack React Query
This SDK provides [React](https://react.dev/) hooks generated specific to your application, for the operations found in the connector `example`. These hooks are generated using [TanStack Query Firebase](https://react-query-firebase.invertase.dev/) by our partners at Invertase, a library built on top of [TanStack React Query v5](https://tanstack.com/query/v5/docs/framework/react/overview).

***You do not need to be familiar with Tanstack Query or Tanstack Query Firebase to use this SDK.*** However, you may find it useful to learn more about them, as they will empower you as a user of this Generated React SDK.

## Installing TanStack Query Firebase and TanStack React Query Packages
In order to use the React generated SDK, you must install the `TanStack React Query` and `TanStack Query Firebase` packages.
```bash
npm i --save @tanstack/react-query @tanstack-query-firebase/react
```
```bash
npm i --save firebase@latest # Note: React has a peer dependency on ^11.3.0
```

You can also follow the installation instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#tanstack-install), or the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/react) and [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/installation).

## Configuring TanStack Query
In order to use the React generated SDK in your application, you must wrap your application's component tree in a `QueryClientProvider` component from TanStack React Query. None of your generated React SDK hooks will work without this provider.

```javascript
import { QueryClientProvider } from '@tanstack/react-query';

// Create a TanStack Query client instance
const queryClient = new QueryClient()

function App() {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <MyApplication />
    </QueryClientProvider>
  )
}
```

To learn more about `QueryClientProvider`, see the [TanStack React Query documentation](https://tanstack.com/query/latest/docs/framework/react/quick-start) and the [TanStack Query Firebase documentation](https://invertase.docs.page/tanstack-query-firebase/react#usage).

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`.

You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@azizsys/dataconnect-sdk';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#emulator-react-angular).

```javascript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@azizsys/dataconnect-sdk';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) using the hooks provided from your generated React SDK.

# Queries

The React generated SDK provides Query hook functions that call and return [`useDataConnectQuery`](https://react-query-firebase.invertase.dev/react/data-connect/querying) hooks from TanStack Query Firebase.

Calling these hook functions will return a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and the most recent data returned by the Query, among other things. To learn more about these hooks and how to use them, see the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/react/data-connect/querying).

TanStack React Query caches the results of your Queries, so using the same Query hook function in multiple places in your application allows the entire application to automatically see updates to that Query's data.

Query hooks execute their Queries automatically when called, and periodically refresh, unless you change the `queryOptions` for the Query. To learn how to stop a Query from automatically executing, including how to make a query "lazy", see the [TanStack React Query documentation](https://tanstack.com/query/latest/docs/framework/react/guides/disabling-queries).

To learn more about TanStack React Query's Queries, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/queries).

## Using Query Hooks
Here's a general overview of how to use the generated Query hooks in your code:

- If the Query has no variables, the Query hook function does not require arguments.
- If the Query has any required variables, the Query hook function will require at least one argument: an object that contains all the required variables for the Query.
- If the Query has some required and some optional variables, only required variables are necessary in the variables argument object, and optional variables may be provided as well.
- If all of the Query's variables are optional, the Query hook function does not require any arguments.
- Query hook functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.
- Query hooks functions can be called with or without passing in an `options` argument of type `useDataConnectQueryOptions`. To learn more about the `options` argument, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/query-options).
  - ***Special case:***  If the Query has all optional variables and you would like to provide an `options` argument to the Query hook function without providing any variables, you must pass `undefined` where you would normally pass the Query's variables, and then may provide the `options` argument.

Below are examples of how to use the `example` connector's generated Query hook functions to execute each Query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#operations-react-angular).

## GetCurrentUser
You can execute the `GetCurrentUser` Query using the following Query hook function, which is defined in [dataconnect-sdk/react/index.d.ts](./index.d.ts):

```javascript
useGetCurrentUser(dc: DataConnect, options?: useDataConnectQueryOptions<GetCurrentUserData>): UseDataConnectQueryResult<GetCurrentUserData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetCurrentUser(options?: useDataConnectQueryOptions<GetCurrentUserData>): UseDataConnectQueryResult<GetCurrentUserData, undefined>;
```

### Variables
The `GetCurrentUser` Query has no variables.
### Return Type
Recall that calling the `GetCurrentUser` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetCurrentUser` Query is of type `GetCurrentUserData`, which is defined in [dataconnect-sdk/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetCurrentUser`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@azizsys/dataconnect-sdk';
import { useGetCurrentUser } from '@azizsys/dataconnect-sdk/react'

export default function GetCurrentUserComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetCurrentUser();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetCurrentUser(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetCurrentUser(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetCurrentUser(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    // Removed console.log
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListUserChatSessions
You can execute the `ListUserChatSessions` Query using the following Query hook function, which is defined in [dataconnect-sdk/react/index.d.ts](./index.d.ts):

```javascript
useListUserChatSessions(dc: DataConnect, options?: useDataConnectQueryOptions<ListUserChatSessionsData>): UseDataConnectQueryResult<ListUserChatSessionsData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListUserChatSessions(options?: useDataConnectQueryOptions<ListUserChatSessionsData>): UseDataConnectQueryResult<ListUserChatSessionsData, undefined>;
```

### Variables
The `ListUserChatSessions` Query has no variables.
### Return Type
Recall that calling the `ListUserChatSessions` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListUserChatSessions` Query is of type `ListUserChatSessionsData`, which is defined in [dataconnect-sdk/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListUserChatSessions`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@azizsys/dataconnect-sdk';
import { useListUserChatSessions } from '@azizsys/dataconnect-sdk/react'

export default function ListUserChatSessionsComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListUserChatSessions();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListUserChatSessions(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListUserChatSessions(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListUserChatSessions(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    // Removed console.log
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## GetChatSession
You can execute the `GetChatSession` Query using the following Query hook function, which is defined in [dataconnect-sdk/react/index.d.ts](./index.d.ts):

```javascript
useGetChatSession(dc: DataConnect, vars: GetChatSessionVariables, options?: useDataConnectQueryOptions<GetChatSessionData>): UseDataConnectQueryResult<GetChatSessionData, GetChatSessionVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetChatSession(vars: GetChatSessionVariables, options?: useDataConnectQueryOptions<GetChatSessionData>): UseDataConnectQueryResult<GetChatSessionData, GetChatSessionVariables>;
```

### Variables
The `GetChatSession` Query requires an argument of type `GetChatSessionVariables`, which is defined in [dataconnect-sdk/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetChatSessionVariables {
  sessionId: UUIDString;
}
```
### Return Type
Recall that calling the `GetChatSession` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetChatSession` Query is of type `GetChatSessionData`, which is defined in [dataconnect-sdk/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetChatSession`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, GetChatSessionVariables } from '@azizsys/dataconnect-sdk';
import { useGetChatSession } from '@azizsys/dataconnect-sdk/react'

export default function GetChatSessionComponent() {
  // The `useGetChatSession` Query hook requires an argument of type `GetChatSessionVariables`:
  const getChatSessionVars: GetChatSessionVariables = {
    sessionId: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetChatSession(getChatSessionVars);
  // Variables can be defined inline as well.
  const query = useGetChatSession({ sessionId: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetChatSession(dataConnect, getChatSessionVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetChatSession(getChatSessionVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetChatSession(dataConnect, getChatSessionVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    // Removed console.log
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListTasks
You can execute the `ListTasks` Query using the following Query hook function, which is defined in [dataconnect-sdk/react/index.d.ts](./index.d.ts):

```javascript
useListTasks(dc: DataConnect, vars?: ListTasksVariables, options?: useDataConnectQueryOptions<ListTasksData>): UseDataConnectQueryResult<ListTasksData, ListTasksVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListTasks(vars?: ListTasksVariables, options?: useDataConnectQueryOptions<ListTasksData>): UseDataConnectQueryResult<ListTasksData, ListTasksVariables>;
```

### Variables
The `ListTasks` Query has an optional argument of type `ListTasksVariables`, which is defined in [dataconnect-sdk/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface ListTasksVariables {
  status?: string | null;
}
```
### Return Type
Recall that calling the `ListTasks` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListTasks` Query is of type `ListTasksData`, which is defined in [dataconnect-sdk/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListTasks`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, ListTasksVariables } from '@azizsys/dataconnect-sdk';
import { useListTasks } from '@azizsys/dataconnect-sdk/react'

export default function ListTasksComponent() {
  // The `useListTasks` Query hook has an optional argument of type `ListTasksVariables`:
  const listTasksVars: ListTasksVariables = {
    status: ..., // optional
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListTasks(listTasksVars);
  // Variables can be defined inline as well.
  const query = useListTasks({ status: ..., });
  // Since all variables are optional for this Query, you can omit the `ListTasksVariables` argument.
  // (as long as you don't want to provide any `options`!)
  const query = useListTasks();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListTasks(dataConnect, listTasksVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListTasks(listTasksVars, options);
  // If you'd like to provide options without providing any variables, you must
  // pass `undefined` where you would normally pass the variables.
  const query = useListTasks(undefined, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListTasks(dataConnect, listTasksVars /** or undefined */, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    // Removed console.log
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## SearchKnowledge
You can execute the `SearchKnowledge` Query using the following Query hook function, which is defined in [dataconnect-sdk/react/index.d.ts](./index.d.ts):

```javascript
useSearchKnowledge(dc: DataConnect, vars: SearchKnowledgeVariables, options?: useDataConnectQueryOptions<SearchKnowledgeData>): UseDataConnectQueryResult<SearchKnowledgeData, SearchKnowledgeVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useSearchKnowledge(vars: SearchKnowledgeVariables, options?: useDataConnectQueryOptions<SearchKnowledgeData>): UseDataConnectQueryResult<SearchKnowledgeData, SearchKnowledgeVariables>;
```

### Variables
The `SearchKnowledge` Query requires an argument of type `SearchKnowledgeVariables`, which is defined in [dataconnect-sdk/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface SearchKnowledgeVariables {
  query: string;
  category?: string | null;
}
```
### Return Type
Recall that calling the `SearchKnowledge` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `SearchKnowledge` Query is of type `SearchKnowledgeData`, which is defined in [dataconnect-sdk/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `SearchKnowledge`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, SearchKnowledgeVariables } from '@azizsys/dataconnect-sdk';
import { useSearchKnowledge } from '@azizsys/dataconnect-sdk/react'

export default function SearchKnowledgeComponent() {
  // The `useSearchKnowledge` Query hook requires an argument of type `SearchKnowledgeVariables`:
  const searchKnowledgeVars: SearchKnowledgeVariables = {
    query: ..., 
    category: ..., // optional
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useSearchKnowledge(searchKnowledgeVars);
  // Variables can be defined inline as well.
  const query = useSearchKnowledge({ query: ..., category: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useSearchKnowledge(dataConnect, searchKnowledgeVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useSearchKnowledge(searchKnowledgeVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useSearchKnowledge(dataConnect, searchKnowledgeVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    // Removed console.log
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

# Mutations

The React generated SDK provides Mutations hook functions that call and return [`useDataConnectMutation`](https://react-query-firebase.invertase.dev/react/data-connect/mutations) hooks from TanStack Query Firebase.

Calling these hook functions will return a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, and the most recent data returned by the Mutation, among other things. To learn more about these hooks and how to use them, see the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/react/data-connect/mutations).

Mutation hooks do not execute their Mutations automatically when called. Rather, after calling the Mutation hook function and getting a `UseMutationResult` object, you must call the `UseMutationResult.mutate()` function to execute the Mutation.

To learn more about TanStack React Query's Mutations, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/mutations).

## Using Mutation Hooks
Here's a general overview of how to use the generated Mutation hooks in your code:

- Mutation hook functions are not called with the arguments to the Mutation. Instead, arguments are passed to `UseMutationResult.mutate()`.
- If the Mutation has no variables, the `mutate()` function does not require arguments.
- If the Mutation has any required variables, the `mutate()` function will require at least one argument: an object that contains all the required variables for the Mutation.
- If the Mutation has some required and some optional variables, only required variables are necessary in the variables argument object, and optional variables may be provided as well.
- If all of the Mutation's variables are optional, the Mutation hook function does not require any arguments.
- Mutation hook functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.
- Mutation hooks also accept an `options` argument of type `useDataConnectMutationOptions`. To learn more about the `options` argument, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/mutations#mutation-side-effects).
  - `UseMutationResult.mutate()` also accepts an `options` argument of type `useDataConnectMutationOptions`.
  - ***Special case:*** If the Mutation has no arguments (or all optional arguments and you wish to provide none), and you want to pass `options` to `UseMutationResult.mutate()`, you must pass `undefined` where you would normally pass the Mutation's arguments, and then may provide the options argument.

Below are examples of how to use the `example` connector's generated Mutation hook functions to execute each Mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#operations-react-angular).

## UpsertUser
You can execute the `UpsertUser` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-sdk/react/index.d.ts](./index.d.ts)):
```javascript
useUpsertUser(options?: useDataConnectMutationOptions<UpsertUserData, FirebaseError, UpsertUserVariables>): UseDataConnectMutationResult<UpsertUserData, UpsertUserVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpsertUser(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertUserData, FirebaseError, UpsertUserVariables>): UseDataConnectMutationResult<UpsertUserData, UpsertUserVariables>;
```

### Variables
The `UpsertUser` Mutation requires an argument of type `UpsertUserVariables`, which is defined in [dataconnect-sdk/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpsertUserVariables {
  email: string;
  displayName?: string | null;
}
```
### Return Type
Recall that calling the `UpsertUser` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpsertUser` Mutation is of type `UpsertUserData`, which is defined in [dataconnect-sdk/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpsertUserData {
  user_upsert: User_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpsertUser`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpsertUserVariables } from '@azizsys/dataconnect-sdk';
import { useUpsertUser } from '@azizsys/dataconnect-sdk/react'

export default function UpsertUserComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpsertUser();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpsertUser(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { // Removed console.log }
  };
  const mutation = useUpsertUser(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { // Removed console.log }
  };
  const mutation = useUpsertUser(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpsertUser` Mutation requires an argument of type `UpsertUserVariables`:
  const upsertUserVars: UpsertUserVariables = {
    email: ..., 
    displayName: ..., // optional
  };
  mutation.mutate(upsertUserVars);
  // Variables can be defined inline as well.
  mutation.mutate({ email: ..., displayName: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { // Removed console.log }
  };
  mutation.mutate(upsertUserVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    // Removed console.log
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## CreateChatSession
You can execute the `CreateChatSession` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-sdk/react/index.d.ts](./index.d.ts)):
```javascript
useCreateChatSession(options?: useDataConnectMutationOptions<CreateChatSessionData, FirebaseError, CreateChatSessionVariables>): UseDataConnectMutationResult<CreateChatSessionData, CreateChatSessionVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateChatSession(dc: DataConnect, options?: useDataConnectMutationOptions<CreateChatSessionData, FirebaseError, CreateChatSessionVariables>): UseDataConnectMutationResult<CreateChatSessionData, CreateChatSessionVariables>;
```

### Variables
The `CreateChatSession` Mutation requires an argument of type `CreateChatSessionVariables`, which is defined in [dataconnect-sdk/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface CreateChatSessionVariables {
  agentType: string;
  title?: string | null;
}
```
### Return Type
Recall that calling the `CreateChatSession` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreateChatSession` Mutation is of type `CreateChatSessionData`, which is defined in [dataconnect-sdk/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateChatSessionData {
  chatSession_insert: ChatSession_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreateChatSession`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateChatSessionVariables } from '@azizsys/dataconnect-sdk';
import { useCreateChatSession } from '@azizsys/dataconnect-sdk/react'

export default function CreateChatSessionComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateChatSession();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateChatSession(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { // Removed console.log }
  };
  const mutation = useCreateChatSession(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { // Removed console.log }
  };
  const mutation = useCreateChatSession(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateChatSession` Mutation requires an argument of type `CreateChatSessionVariables`:
  const createChatSessionVars: CreateChatSessionVariables = {
    agentType: ..., 
    title: ..., // optional
  };
  mutation.mutate(createChatSessionVars);
  // Variables can be defined inline as well.
  mutation.mutate({ agentType: ..., title: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { // Removed console.log }
  };
  mutation.mutate(createChatSessionVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    // Removed console.log
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## AddMessage
You can execute the `AddMessage` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-sdk/react/index.d.ts](./index.d.ts)):
```javascript
useAddMessage(options?: useDataConnectMutationOptions<AddMessageData, FirebaseError, AddMessageVariables>): UseDataConnectMutationResult<AddMessageData, AddMessageVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useAddMessage(dc: DataConnect, options?: useDataConnectMutationOptions<AddMessageData, FirebaseError, AddMessageVariables>): UseDataConnectMutationResult<AddMessageData, AddMessageVariables>;
```

### Variables
The `AddMessage` Mutation requires an argument of type `AddMessageVariables`, which is defined in [dataconnect-sdk/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface AddMessageVariables {
  sessionId: UUIDString;
  role: string;
  content: string;
  metadata?: string | null;
}
```
### Return Type
Recall that calling the `AddMessage` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `AddMessage` Mutation is of type `AddMessageData`, which is defined in [dataconnect-sdk/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface AddMessageData {
  message_insert: Message_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `AddMessage`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, AddMessageVariables } from '@azizsys/dataconnect-sdk';
import { useAddMessage } from '@azizsys/dataconnect-sdk/react'

export default function AddMessageComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useAddMessage();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useAddMessage(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { // Removed console.log }
  };
  const mutation = useAddMessage(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { // Removed console.log }
  };
  const mutation = useAddMessage(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useAddMessage` Mutation requires an argument of type `AddMessageVariables`:
  const addMessageVars: AddMessageVariables = {
    sessionId: ..., 
    role: ..., 
    content: ..., 
    metadata: ..., // optional
  };
  mutation.mutate(addMessageVars);
  // Variables can be defined inline as well.
  mutation.mutate({ sessionId: ..., role: ..., content: ..., metadata: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { // Removed console.log }
  };
  mutation.mutate(addMessageVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    // Removed console.log
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpdateChatSession
You can execute the `UpdateChatSession` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-sdk/react/index.d.ts](./index.d.ts)):
```javascript
useUpdateChatSession(options?: useDataConnectMutationOptions<UpdateChatSessionData, FirebaseError, UpdateChatSessionVariables>): UseDataConnectMutationResult<UpdateChatSessionData, UpdateChatSessionVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpdateChatSession(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateChatSessionData, FirebaseError, UpdateChatSessionVariables>): UseDataConnectMutationResult<UpdateChatSessionData, UpdateChatSessionVariables>;
```

### Variables
The `UpdateChatSession` Mutation requires an argument of type `UpdateChatSessionVariables`, which is defined in [dataconnect-sdk/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpdateChatSessionVariables {
  sessionId: UUIDString;
  title?: string | null;
  isActive?: boolean | null;
}
```
### Return Type
Recall that calling the `UpdateChatSession` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpdateChatSession` Mutation is of type `UpdateChatSessionData`, which is defined in [dataconnect-sdk/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateChatSessionData {
  chatSession_update?: ChatSession_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpdateChatSession`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpdateChatSessionVariables } from '@azizsys/dataconnect-sdk';
import { useUpdateChatSession } from '@azizsys/dataconnect-sdk/react'

export default function UpdateChatSessionComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpdateChatSession();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpdateChatSession(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { // Removed console.log }
  };
  const mutation = useUpdateChatSession(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { // Removed console.log }
  };
  const mutation = useUpdateChatSession(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpdateChatSession` Mutation requires an argument of type `UpdateChatSessionVariables`:
  const updateChatSessionVars: UpdateChatSessionVariables = {
    sessionId: ..., 
    title: ..., // optional
    isActive: ..., // optional
  };
  mutation.mutate(updateChatSessionVars);
  // Variables can be defined inline as well.
  mutation.mutate({ sessionId: ..., title: ..., isActive: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { // Removed console.log }
  };
  mutation.mutate(updateChatSessionVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    // Removed console.log
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## CreateTask
You can execute the `CreateTask` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-sdk/react/index.d.ts](./index.d.ts)):
```javascript
useCreateTask(options?: useDataConnectMutationOptions<CreateTaskData, FirebaseError, CreateTaskVariables>): UseDataConnectMutationResult<CreateTaskData, CreateTaskVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateTask(dc: DataConnect, options?: useDataConnectMutationOptions<CreateTaskData, FirebaseError, CreateTaskVariables>): UseDataConnectMutationResult<CreateTaskData, CreateTaskVariables>;
```

### Variables
The `CreateTask` Mutation requires an argument of type `CreateTaskVariables`, which is defined in [dataconnect-sdk/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface CreateTaskVariables {
  title: string;
  description?: string | null;
  priority: string;
  assignedAgent?: string | null;
}
```
### Return Type
Recall that calling the `CreateTask` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreateTask` Mutation is of type `CreateTaskData`, which is defined in [dataconnect-sdk/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateTaskData {
  task_insert: Task_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreateTask`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateTaskVariables } from '@azizsys/dataconnect-sdk';
import { useCreateTask } from '@azizsys/dataconnect-sdk/react'

export default function CreateTaskComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateTask();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateTask(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { // Removed console.log }
  };
  const mutation = useCreateTask(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { // Removed console.log }
  };
  const mutation = useCreateTask(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateTask` Mutation requires an argument of type `CreateTaskVariables`:
  const createTaskVars: CreateTaskVariables = {
    title: ..., 
    description: ..., // optional
    priority: ..., 
    assignedAgent: ..., // optional
  };
  mutation.mutate(createTaskVars);
  // Variables can be defined inline as well.
  mutation.mutate({ title: ..., description: ..., priority: ..., assignedAgent: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { // Removed console.log }
  };
  mutation.mutate(createTaskVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    // Removed console.log
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpdateTaskStatus
You can execute the `UpdateTaskStatus` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-sdk/react/index.d.ts](./index.d.ts)):
```javascript
useUpdateTaskStatus(options?: useDataConnectMutationOptions<UpdateTaskStatusData, FirebaseError, UpdateTaskStatusVariables>): UseDataConnectMutationResult<UpdateTaskStatusData, UpdateTaskStatusVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpdateTaskStatus(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateTaskStatusData, FirebaseError, UpdateTaskStatusVariables>): UseDataConnectMutationResult<UpdateTaskStatusData, UpdateTaskStatusVariables>;
```

### Variables
The `UpdateTaskStatus` Mutation requires an argument of type `UpdateTaskStatusVariables`, which is defined in [dataconnect-sdk/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpdateTaskStatusVariables {
  taskId: UUIDString;
  status: string;
  completedAt?: TimestampString | null;
}
```
### Return Type
Recall that calling the `UpdateTaskStatus` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpdateTaskStatus` Mutation is of type `UpdateTaskStatusData`, which is defined in [dataconnect-sdk/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateTaskStatusData {
  task_update?: Task_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpdateTaskStatus`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpdateTaskStatusVariables } from '@azizsys/dataconnect-sdk';
import { useUpdateTaskStatus } from '@azizsys/dataconnect-sdk/react'

export default function UpdateTaskStatusComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpdateTaskStatus();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpdateTaskStatus(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { // Removed console.log }
  };
  const mutation = useUpdateTaskStatus(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { // Removed console.log }
  };
  const mutation = useUpdateTaskStatus(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpdateTaskStatus` Mutation requires an argument of type `UpdateTaskStatusVariables`:
  const updateTaskStatusVars: UpdateTaskStatusVariables = {
    taskId: ..., 
    status: ..., 
    completedAt: ..., // optional
  };
  mutation.mutate(updateTaskStatusVars);
  // Variables can be defined inline as well.
  mutation.mutate({ taskId: ..., status: ..., completedAt: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { // Removed console.log }
  };
  mutation.mutate(updateTaskStatusVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    // Removed console.log
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## AddKnowledgeEntry
You can execute the `AddKnowledgeEntry` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-sdk/react/index.d.ts](./index.d.ts)):
```javascript
useAddKnowledgeEntry(options?: useDataConnectMutationOptions<AddKnowledgeEntryData, FirebaseError, AddKnowledgeEntryVariables>): UseDataConnectMutationResult<AddKnowledgeEntryData, AddKnowledgeEntryVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useAddKnowledgeEntry(dc: DataConnect, options?: useDataConnectMutationOptions<AddKnowledgeEntryData, FirebaseError, AddKnowledgeEntryVariables>): UseDataConnectMutationResult<AddKnowledgeEntryData, AddKnowledgeEntryVariables>;
```

### Variables
The `AddKnowledgeEntry` Mutation requires an argument of type `AddKnowledgeEntryVariables`, which is defined in [dataconnect-sdk/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface AddKnowledgeEntryVariables {
  title: string;
  content: string;
  category: string;
  tags?: string | null;
  source?: string | null;
}
```
### Return Type
Recall that calling the `AddKnowledgeEntry` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `AddKnowledgeEntry` Mutation is of type `AddKnowledgeEntryData`, which is defined in [dataconnect-sdk/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface AddKnowledgeEntryData {
  knowledgeEntry_insert: KnowledgeEntry_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `AddKnowledgeEntry`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, AddKnowledgeEntryVariables } from '@azizsys/dataconnect-sdk';
import { useAddKnowledgeEntry } from '@azizsys/dataconnect-sdk/react'

export default function AddKnowledgeEntryComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useAddKnowledgeEntry();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useAddKnowledgeEntry(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { // Removed console.log }
  };
  const mutation = useAddKnowledgeEntry(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { // Removed console.log }
  };
  const mutation = useAddKnowledgeEntry(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useAddKnowledgeEntry` Mutation requires an argument of type `AddKnowledgeEntryVariables`:
  const addKnowledgeEntryVars: AddKnowledgeEntryVariables = {
    title: ..., 
    content: ..., 
    category: ..., 
    tags: ..., // optional
    source: ..., // optional
  };
  mutation.mutate(addKnowledgeEntryVars);
  // Variables can be defined inline as well.
  mutation.mutate({ title: ..., content: ..., category: ..., tags: ..., source: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { // Removed console.log }
  };
  mutation.mutate(addKnowledgeEntryVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    // Removed console.log
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

