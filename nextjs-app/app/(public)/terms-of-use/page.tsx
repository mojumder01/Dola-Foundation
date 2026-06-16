import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getLocale, pickLocale } from "@/lib/locale";

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

const DEFAULT_CONTENT_BN = `
<h2>ব্যবহারের শর্তাবলী</h2>
<p>সর্বশেষ আপডেট: ${new Date().getFullYear()}</p>
<p>ডোলা ফাউন্ডেশনের ওয়েবসাইট অ্যাক্সেস ও ব্যবহার করার মাধ্যমে আপনি এই শর্তাবলীতে সম্মত হচ্ছেন।</p>
<h3>ওয়েবসাইটের ব্যবহার</h3>
<ul>
  <li>এই ওয়েবসাইট শুধুমাত্র তথ্যগত ও দাতব্য উদ্দেশ্যে</li>
  <li>আপনি ওয়েবসাইট বা এর কনটেন্ট অপব্যবহার না করতে সম্মত হচ্ছেন</li>
  <li>সমস্ত কনটেন্ট ডোলা ফাউন্ডেশনের সম্পত্তি এবং অনুমতি ছাড়া পুনরুৎপাদন করা যাবে না</li>
</ul>
<h3>অনুদান</h3>
<ul>
  <li>সকল অনুদান স্বেচ্ছাপ্রণোদিত এবং অন্যথায় সম্মত না হলে ফেরতযোগ্য নয়</li>
  <li>প্রয়োজনে কর উদ্দেশ্যে অনুদানের রসিদ প্রদান করা হয়</li>
  <li>ডোলা ফাউন্ডেশন যেখানে সবচেয়ে প্রয়োজন সেখানে তহবিল বরাদ্দ করার অধিকার সংরক্ষণ করে</li>
</ul>
<h3>দাবিত্যাগ</h3>
<p>এই ওয়েবসাইটের তথ্য সরল বিশ্বাসে প্রদান করা হয়েছে। প্রদত্ত তথ্যের সম্পূর্णতা বা সঠিকতা সম্পর্কে আমরা কোনো নিশ্চয়তা দিই না।</p>
<h3>যোগাযোগ করুন</h3>
<p>এই শর্তাবলী সম্পর্কে প্রশ্ন থাকলে, অনুগ্রহ করে আমাদের সাথে <a href="mailto:info@dolafoundation.com">info@dolafoundation.com</a> এ যোগাযোগ করুন।</p>
`;

export default async function TermsOfUsePage() {
  const locale = await getLocale();
  let page;
  try {
    page = await prisma.pageContent.findUnique({ where: { slug: "terms-of-use" } });
  } catch {
    page = null;
  }

  if (page && !page.published) notFound();

  const title = pickLocale(page?.title, page?.titleBn, locale) || (locale === "bn" ? "ব্যবহারের শর্তাবলী" : "Terms of Use");
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
