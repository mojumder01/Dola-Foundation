import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ContactForm from "./ContactForm";
import { FAQS } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Dola Foundation. We'd love to hear from you.",
};

async function getSettings() {
  try {
    return await prisma.siteSettings.findFirst();
  } catch {
    return null;
  }
}

async function getDBFAQs() {
  try {
    return await prisma.fAQ.findMany({ where: { active: true }, orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
  } catch {
    return [];
  }
}

function getMapEmbedSrc(embedUrl?: string | null, address?: string | null): string {
  let candidate = embedUrl?.trim();
  const srcMatch = candidate?.match(/src=["']([^"']+)["']/i);
  if (srcMatch) candidate = srcMatch[1];
  if (candidate && /^https:\/\/(www\.)?google\.com\/maps\/embed/i.test(candidate)) {
    return candidate;
  }
  const query = address?.trim() || "Harinakundu, Jhenaidah, Bangladesh";
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}

export default async function ContactPage() {
  const [settings, dbFaqs] = await Promise.all([getSettings(), getDBFAQs()]);
  const faqs = dbFaqs.length > 0 ? dbFaqs : FAQS;

  const contactInfo = [
    {
      icon: MapPin,
      title: "Our Office",
      content:
        settings?.address || "House 12, Road 5, Dhanmondi\nDhaka 1209, Bangladesh",
      color: "text-primary",
      bg: "bg-blue-50",
    },
    {
      icon: Phone,
      title: "Phone",
      content: settings?.phone || "+880 1700-000000\n+880 1800-000000",
      color: "text-green",
      bg: "bg-green-50",
    },
    {
      icon: Mail,
      title: "Email",
      content:
        settings?.email || "info@dolafoundation.com\ndonate@dolafoundation.com",
      color: "text-gold",
      bg: "bg-yellow-50",
    },
    {
      icon: Clock,
      title: "Office Hours",
      content: (settings as any)?.officeHours || "Saturday – Thursday\n9:00 AM – 5:00 PM",
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="pt-20">
      {/* Hero */}
      {settings?.contactBannerImage ? (
        <section className="relative bg-gradient-to-br from-dark to-primary min-h-[180px] md:min-h-[220px] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={settings.contactBannerImage} alt="" className="w-full h-auto block" />
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: (settings as any).contactBannerOverlayColor || "#0F3D8C",
              opacity: ((settings as any).contactBannerOverlayOpacity ?? 80) / 100,
            }}
          />
          <div className="absolute inset-0 flex items-center py-10">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-block bg-white/20 text-white text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            Contact
          </span>
          <h1 className="font-poppins font-black text-4xl md:text-5xl text-white mb-5">
            Get In Touch
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Have a question or want to partner with us? We'd love to hear from you.
          </p>
          <div className="flex items-center justify-center gap-2 mt-6 text-white/60 text-sm">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Contact</span>
          </div>
        </div>
          </div>
        </section>
      ) : (
        <section className="relative bg-gradient-to-br from-dark to-primary min-h-[280px] md:min-h-[360px] lg:min-h-[420px] flex items-center py-16">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-block bg-white/20 text-white text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            Contact
          </span>
          <h1 className="font-poppins font-black text-4xl md:text-5xl text-white mb-5">
            Get In Touch
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Have a question or want to partner with us? We'd love to hear from you.
          </p>
          <div className="flex items-center justify-center gap-2 mt-6 text-white/60 text-sm">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Contact</span>
          </div>
        </div>
        </section>
      )}

      {/* Contact Cards */}
      <section className="py-12 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-5 shadow-card text-center"
                >
                  <div className={`w-12 h-12 ${info.bg} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                    <Icon className={`w-6 h-6 ${info.color}`} />
                  </div>
                  <h3 className="font-poppins font-semibold text-dark mb-2 text-sm">
                    {info.title}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed whitespace-pre-line">
                    {info.content}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Form + Map */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10">
            {/* Form */}
            <div>
              <h2 className="font-poppins font-bold text-2xl text-dark mb-6">
                Send Us a Message
              </h2>
              <ContactForm />
            </div>

            {/* Map */}
            <div>
              <h2 className="font-poppins font-bold text-2xl text-dark mb-6">
                Find Us
              </h2>
              <div className="rounded-2xl overflow-hidden h-80 border border-gray-200">
                <iframe
                  src={getMapEmbedSrc((settings as any)?.googleMapsEmbedUrl, settings?.address)}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Dola Foundation Location"
                />
              </div>

              {/* Social links */}
              {(settings?.facebookUrl || settings?.instagramUrl || settings?.twitterUrl || settings?.youtubeUrl) && (
                <div className="mt-6 bg-[#F8FAFC] rounded-2xl p-5 border border-gray-100">
                  <h3 className="font-semibold text-dark mb-3">Follow Us</h3>
                  <div className="flex flex-wrap gap-3">
                    {settings?.facebookUrl && (
                      <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="bg-[#1877f2] text-white text-xs font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">Facebook</a>
                    )}
                    {settings?.instagramUrl && (
                      <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="bg-gradient-to-br from-pink-500 to-orange-400 text-white text-xs font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">Instagram</a>
                    )}
                    {settings?.twitterUrl && (
                      <a href={settings.twitterUrl} target="_blank" rel="noopener noreferrer" className="bg-[#1da1f2] text-white text-xs font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">Twitter</a>
                    )}
                    {settings?.youtubeUrl && (
                      <a href={settings.youtubeUrl} target="_blank" rel="noopener noreferrer" className="bg-[#ff0000] text-white text-xs font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">YouTube</a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 md:py-16 bg-[#F8FAFC]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="font-poppins font-bold text-3xl text-dark mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-500">
              Find answers to the most common questions about our work.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-card overflow-hidden">
            <Accordion type="single" collapsible className="divide-y divide-gray-100">
              {(faqs as any[]).map((faq: any, index: number) => (
                <AccordionItem key={faq.id || index} value={`item-${index}`} className="px-6">
                  <AccordionTrigger className="text-left font-semibold text-dark hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-500 leading-relaxed">
                    {faq.answer?.includes("<") ? (
                      <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                    ) : (
                      faq.answer
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  );
}
