# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.




### React
For each operation, there is a wrapper hook that can be used to call the operation.

Here are all of the hooks that get generated:
```ts
import { useUpsertUser, useCreateChatSession, useAddMessage, useUpdateChatSession, useCreateTask, useUpdateTaskStatus, useAddKnowledgeEntry, useGetCurrentUser, useListUserChatSessions, useGetChatSession } from '@dataconnect/generated/react';
// The types of these hooks are available in react/index.d.ts

const { data, isPending, isSuccess, isError, error } = useUpsertUser(upsertUserVars);

const { data, isPending, isSuccess, isError, error } = useCreateChatSession(createChatSessionVars);

const { data, isPending, isSuccess, isError, error } = useAddMessage(addMessageVars);

const { data, isPending, isSuccess, isError, error } = useUpdateChatSession(updateChatSessionVars);

const { data, isPending, isSuccess, isError, error } = useCreateTask(createTaskVars);

const { data, isPending, isSuccess, isError, error } = useUpdateTaskStatus(updateTaskStatusVars);

const { data, isPending, isSuccess, isError, error } = useAddKnowledgeEntry(addKnowledgeEntryVars);

const { data, isPending, isSuccess, isError, error } = useGetCurrentUser();

const { data, isPending, isSuccess, isError, error } = useListUserChatSessions();

const { data, isPending, isSuccess, isError, error } = useGetChatSession(getChatSessionVars);

```

Here's an example from a different generated SDK:

```ts
import { useListAllMovies } from '@dataconnect/generated/react';

function MyComponent() {
  const { isLoading, data, error } = useListAllMovies();
  if(isLoading) {
    return <div>Loading...</div>
  }
  if(error) {
    return <div> An Error Occurred: {error} </div>
  }
}

// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MyComponent from './my-component';

function App() {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
    <MyComponent />
  </QueryClientProvider>
}
```



## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { upsertUser, createChatSession, addMessage, updateChatSession, createTask, updateTaskStatus, addKnowledgeEntry, getCurrentUser, listUserChatSessions, getChatSession } from '@dataconnect/generated';


// Operation UpsertUser:  For variables, look at type UpsertUserVars in ../index.d.ts
const { data } = await UpsertUser(dataConnect, upsertUserVars);

// Operation CreateChatSession:  For variables, look at type CreateChatSessionVars in ../index.d.ts
const { data } = await CreateChatSession(dataConnect, createChatSessionVars);

// Operation AddMessage:  For variables, look at type AddMessageVars in ../index.d.ts
const { data } = await AddMessage(dataConnect, addMessageVars);

// Operation UpdateChatSession:  For variables, look at type UpdateChatSessionVars in ../index.d.ts
const { data } = await UpdateChatSession(dataConnect, updateChatSessionVars);

// Operation CreateTask:  For variables, look at type CreateTaskVars in ../index.d.ts
const { data } = await CreateTask(dataConnect, createTaskVars);

// Operation UpdateTaskStatus:  For variables, look at type UpdateTaskStatusVars in ../index.d.ts
const { data } = await UpdateTaskStatus(dataConnect, updateTaskStatusVars);

// Operation AddKnowledgeEntry:  For variables, look at type AddKnowledgeEntryVars in ../index.d.ts
const { data } = await AddKnowledgeEntry(dataConnect, addKnowledgeEntryVars);

// Operation GetCurrentUser: 
const { data } = await GetCurrentUser(dataConnect);

// Operation ListUserChatSessions: 
const { data } = await ListUserChatSessions(dataConnect);

// Operation GetChatSession:  For variables, look at type GetChatSessionVars in ../index.d.ts
const { data } = await GetChatSession(dataConnect, getChatSessionVars);


```