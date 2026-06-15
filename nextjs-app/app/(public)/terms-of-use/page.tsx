import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Terms of Use" };

const DEFAULT_CONTENT = `
<h2>Terms of Use</h2>
<p>Last updated: ${new Date().getFullYear()}</p>
<p>By accessing and using the Dola Foundation website, you agree to these terms and conditions.</p>
<h3>Use of Website</h3>
<ul>
  <li>This website is for informational and charitable purposes only</li>
  <li>You agree not to misuse the website or its content</li>
  <li>All content is the property of Dola Foundation and may not be reproduced without permission</li>
</ul>
<h3>Donations</h3>
<ul>
  <li>All donations are voluntary and non-refundable unless otherwise agreed</li>
  <li>Donation receipts are provided for tax purposes where applicable</li>
  <li>Dola Foundation reserves the right to allocate funds where they are most needed</li>
</ul>
<h3>Disclaimer</h3>
<p>The information on this website is provided in good faith. We make no warranties about the completeness or accuracy of the information provided.</p>
<h3>Contact Us</h3>
<p>If you have questions about these terms, please contact us at <a href="mailto:info@dolafoundation.com">info@dolafoundation.com</a>.</p>
`;

export default async function TermsOfUsePage() {
  let page;
  try {
    page = await prisma.pageContent.findUnique({ where: { slug: "terms-of-use" } });
  } catch {
    page = null;
  }

  if (page && !page.published) notFound();

  const title = page?.title || "Terms of Use";
  const content = page?.content || DEFAULT_CONTENT;

  return (
    <div className="pt-20 min-h-screen bg-[#F8FAFC]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-card p-8 md:p-12">
          <h1 className="font-poppins font-black text-3xl md:text-4xl text-dark mb-2">{title}</h1>
          <div className="w-16 h-1 bg-primary rounded mb-8" />
          <div
            className="prose prose-blue max-w-none text-gray-600 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </div>
  );
}
