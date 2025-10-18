import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ChatPage } from './pages/ChatPage';
import { SettingsPage } from './pages/SettingsPage';
import { ErrorPage } from './components/ErrorPage';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <ChatPage />
      },
      {
        path: "settings",
        element: <SettingsPage />
      }
    ]
  }
]);