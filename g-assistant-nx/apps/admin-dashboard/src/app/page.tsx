import { LoginForm } from './components/LoginForm';
import { DashboardLayout } from './components/DashboardLayout';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardLayout>
        <div className="max-w-md mx-auto mt-8">
          <LoginForm />
        </div>
      </DashboardLayout>
    </div>
  );
}