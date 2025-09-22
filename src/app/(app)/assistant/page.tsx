import { PageHeader } from "@/components/app/page-header";
import { AssistantForm } from "./assistant-form";

export default function AssistantPage() {
  return (
    <>
      <PageHeader
        title="Smart Campaign Assistant"
        description="Leverage AI to get suggestions for optimizing your campaigns."
      />
      <AssistantForm />
    </>
  );
}
