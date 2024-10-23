import { cookies } from "next/headers";
import ThankYou from "./thank-you/page";
import SurveyForm from "@/components/SurveryForm";

export default function Home() {
  const cookieStore = cookies();
  const hasSubmitted = cookieStore.get("hasSubmitted");

  if (hasSubmitted) {
    return <ThankYou />;
  }

  return (
    <main className="container mx-auto py-10">
      <SurveyForm />
    </main>
  );
}
