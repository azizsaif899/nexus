import { CustomerProfile } from '../../components/customer/CustomerProfile';

interface CustomerPageProps {
  params: { id: string };
}

export default function CustomerPage({ params }: CustomerPageProps) {
  return <CustomerProfile customerId={params.id} />;
}