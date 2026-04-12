import type { Metadata } from "next";

import { PageShell } from "@/components/public/page-shell";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPublicSummaryCounts } from "@/lib/data/public";
import { getContactEmail } from "@/lib/env";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact information for collaborations and opportunities.",
};

export default async function ContactPage() {
  const contactEmail = getContactEmail();
  const summary = await getPublicSummaryCounts();

  return (
    <PageShell
      title="Contact"
      description="The admin dashboard controls all portfolio content. Use the email below for direct outreach."
    >
      <Card className="border-white/70 bg-white/90 chrome-surface">
        <CardHeader>
          <CardTitle className="text-2xl text-[var(--secondary-color)]">Let&apos;s Work Together</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-[var(--outline)]">
            Portfolio currently has {summary.projects} published projects, {summary.achievements} achievements, and{" "}
            {summary.experience} experience entries.
          </p>
          {contactEmail ? (
            <div className="space-y-4">
              <p className="text-[var(--outline)]">
                For project inquiries, consulting engagements, and collaboration requests, reach out at:
              </p>
              <a href={`mailto:${contactEmail}`} className={`chrome-button ${buttonVariants()}`}>
                {contactEmail}
              </a>
            </div>
          ) : (
            <p className="text-[var(--outline)]">
              Set <code>NEXT_PUBLIC_CONTACT_EMAIL</code> in your environment to publish contact information.
            </p>
          )}
        </CardContent>
      </Card>
    </PageShell>
  );
}
