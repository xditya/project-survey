import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ThankYou() {
  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Thank You!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center mb-4">
            Your survey has been submitted successfully. We appreciate your
            feedback!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
