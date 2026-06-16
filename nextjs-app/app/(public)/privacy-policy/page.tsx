import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getLocale, pickLocale } from "@/lib/locale";

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

const DEFAULT_CONTENT_BN = `
<h2>প্রাইভেসি পলিসি</h2>
<p>সর্বশেষ আপডেট: ${new Date().getFullYear()}</p>
<p>ডোলা ফাউন্ডেশন আপনার প্রাইভেসি রক্ষায় প্রতিশ্রুতিবদ্ধ। এই পলিসিতে আমরা কীভাবে আপনার ব্যক্তিগত তথ্য সংগ্রহ, ব্যবহার এবং সুরক্ষা করি তা ব্যাখ্যা করা হয়েছে।</p>
<h3>আমরা যে তথ্য সংগ্রহ করি</h3>
<ul>
  <li>দান, স্বেচ্ছাসেবা, বা যোগাযোগ করার সময় নাম, ইমেইল ঠিকানা এবং ফোন নম্বর</li>
  <li>পেমেন্ট তথ্য (নিরাপদে প্রক্রিয়া করা হয় এবং আমাদের সার্ভারে কখনো সংরক্ষণ করা হয় না)</li>
  <li>আমাদের ওয়েবসাইট উন্নত করতে অ্যানালিটিক্সের মাধ্যমে ব্যবহারের তথ্য</li>
</ul>
<h3>আমরা আপনার তথ্য কীভাবে ব্যবহার করি</h3>
<ul>
  <li>দান প্রক্রিয়া করতে এবং রসিদ পাঠাতে</li>
  <li>আপনার স্বেচ্ছাসেবক আবেদন সম্পর্কে যোগাযোগ করতে</li>
  <li>আপনার অনুসন্ধানের উত্তর দিতে</li>
  <li>নিউজলেটার পাঠাতে (শুধুমাত্র আপনি সাবস্ক্রাইব করলে)</li>
</ul>
<h3>ডেটা সুরক্ষা</h3>
<p>আমরা আপনার ডেটা সুরক্ষার জন্য শিল্প-মানের সুরক্ষা ব্যবস্থা প্রয়োগ করি। আমরা মার্কেটিং উদ্দেশ্যে কখনো আপনার ব্যক্তিগত তথ্য তৃতীয় পক্ষের কাছে বিক্রি বা শেয়ার করি না।</p>
<h3>যোগাযোগ করুন</h3>
<p>এই প্রাইভেসি পলিসি সম্পর্কে প্রশ্ন থাকলে, অনুগ্রহ করে আমাদের সাথে <a href="mailto:info@dolafoundation.com">info@dolafoundation.com</a> এ যোগাযোগ করুন।</p>
`;

export default async function PrivacyPolicyPage() {
  const locale = await getLocale();
  let page;
  try {
    page = await prisma.pageContent.findUnique({ where: { slug: "privacy-policy" } });
  } catch {
    page = null;
  }

  if (page && !page.published) notFound();

  const title = pickLocale(page?.title, page?.titleBn, locale) || (locale === "bn" ? "প্রাইভেসি পলিসি" : "Privacy Policy");
  const content = page
    ? pickLocale(page.content, page.contentBn, locale) || (locale === "bn" ? DEFAULT_CONTENT_BN : DEFAULT_CONTENT)
    : locale === "bn"
      ? DEFAULT_CONTENT_BN
      : DEFAULT_CONTENT;

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
