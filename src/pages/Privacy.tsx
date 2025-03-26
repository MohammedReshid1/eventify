
import { Card } from "@/components/ui/card";

export default function Privacy() {
  return (
    <div className="container py-8">
      <Card className="p-6">
        <h1 className="mb-6 text-3xl font-bold">Privacy Policy</h1>
        <div className="space-y-4">
          <section>
            <h2 className="mb-2 text-xl font-semibold">1. Information We Collect</h2>
            <p>We collect information that you provide directly to us, including:</p>
            <ul className="list-disc pl-6">
              <li>Name and contact information</li>
              <li>Account credentials</li>
              <li>Payment information</li>
              <li>Event preferences and history</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold">2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6">
              <li>Process your transactions</li>
              <li>Send you event updates</li>
              <li>Improve our services</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold">3. Information Sharing</h2>
            <p>We do not sell your personal information. We may share your information with:</p>
            <ul className="list-disc pl-6">
              <li>Event organizers for events you register for</li>
              <li>Service providers who assist in our operations</li>
              <li>Law enforcement when required by law</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold">4. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Opt-out of marketing communications</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold">5. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at{" "}
              <a href="mailto:privacy@eventify.com" className="text-primary hover:underline">
                privacy@eventify.com
              </a>
            </p>
          </section>
        </div>
      </Card>
    </div>
  );
}
