import FlowPageLayout from '@/components/flow/FlowPageLayout';
import WelcomeHeader from '@/components/flow/WelcomeHeader';

export default function FlowPage() {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <WelcomeHeader />
      <div className="mt-8">
        <FlowPageLayout />
      </div>
    </div>
  );
}
