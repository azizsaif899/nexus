import ConflictPreventionGenerator from '@/app/dashboard/components/conflict-prevention-generator';
import DependencyFirewall from '@/app/dashboard/components/dependency-firewall';
import DependencyGraph from '@/app/dashboard/components/dependency-graph';
import IsolatedExecutor from '@/app/dashboard/components/isolated-executor';
import WelcomeHeader from '@/app/dashboard/components/welcome-header';

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <WelcomeHeader />
      <div className="mt-8 grid grid-cols-1 gap-8 xl:grid-cols-2">
        <div className="flex flex-col gap-8">
          <ConflictPreventionGenerator />
          <DependencyFirewall />
        </div>
        <div className="flex flex-col gap-8">
          <IsolatedExecutor />
          <DependencyGraph />
        </div>
      </div>
    </div>
  );
}
