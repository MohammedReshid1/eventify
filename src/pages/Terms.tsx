
import { Card } from "@/components/ui/card";

export default function Terms() {
  return (
    <div className="container py-8">
      <Card className="p-6">
        <h1 className="mb-6 text-3xl font-bold">Terms of Service</h1>
        <div className="space-y-4">
          <section>
            <h2 className="mb-2 text-xl font-semibold">1. Acceptance of Terms</h2>
            <p>
              By accessing and using this website, you accept and agree to be bound by the terms and
              provisions of this agreement.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold">2. Use License</h2>
            <ul className="list-disc pl-6">
              <li>Permission is granted to temporarily access the website</li>
              <li>This license shall automatically terminate if you violate any of these restrictions</li>
              <li>Upon terminating your viewing of these materials, you must destroy any downloaded materials</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold">3. Disclaimer</h2>
            <p>
              The materials on our website are provided on an 'as is' basis. We make no warranties,
              expressed or implied, and hereby disclaim and negate all other warranties including,
              without limitation, implied warranties or conditions of merchantability, fitness for a
              particular purpose, or non-infringement of intellectual property or other violation of
              rights.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold">4. Limitations</h2>
            <p>
              In no event shall we or our suppliers be liable for any damages arising out of the use
              or inability to use the materials on our website.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold">5. Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws and
              you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </section>
        </div>
      </Card>
    </div>
  );
}
