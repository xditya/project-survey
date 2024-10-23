import { cookies } from "next/headers";
import ThankYou from "./thank-you/page";
import SurveyForm from "@/components/SurveryForm";
import Footer from "@/components/Footer";

export default function Home() {
  const cookieStore = cookies();
  const hasSubmitted = cookieStore.get("hasSubmitted");

  return (
    <div className="flex flex-col min-h-screen">
      <main className="container mx-auto py-10 flex-grow">
        {hasSubmitted ? <ThankYou /> : <SurveyForm />}
      </main>
      <Footer />
    </div>
  );
}
