import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Privacy Policy" };

const DEFAULT_CONTENT = `
<h2>Privacy Policy</h2>
<p>Last updated: ${new Date().getFullYear()}</p>
<p>Dola Foundation is committed to protecting your privacy. This policy explains how we collect, use, and protect your personal information.</p>
<h3>Information We Collect</h3>
<ul>
  <li>Name, email address, and phone number when you donate, volunteer, or contact us</li>
  <li>Payment information (processed securely and never stored on our servers)</li>
  <li>Usage data through analytics to improve our website</li>
</ul>
<h3>How We Use Your Information</h3>
<ul>
  <li>To process donations and send receipts</li>
  <li>To communicate with you about your volunteer application</li>
  <li>To respond to your inquiries</li>
  <li>To send newsletters (only if you subscribed)</li>
</ul>
<h3>Data Security</h3>
<p>We implement industry-standard security measures to protect your data. We never sell or share your personal information with third parties for marketing purposes.</p>
<h3>Contact Us</h3>
<p>If you have questions about this privacy policy, please contact us at <a href="mailto:info@dolafoundation.com">info@dolafoundation.com</a>.</p>
`;

export default async function PrivacyPolicyPage() {
  let page;
  try {
    page = await prisma.pageContent.findUnique({ where: { slug: "privacy-policy" } });
  } catch {
    page = null;
  }

  if (page && !page.published) notFound();

  const title = page?.title || "Privacy Policy";
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
