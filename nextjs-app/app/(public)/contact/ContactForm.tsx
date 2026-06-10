"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { submitContact } from "@/actions/contact";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="primary" size="lg" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          Sending...
        </>
      ) : (
        "Send Message"
      )}
    </Button>
  );
}

export default function ContactForm() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAction(formData: FormData) {
    const result = await submitContact(formData);
    if (result?.success) {
      setSuccess(true);
    } else {
      setError(result?.error || "Failed to send message. Please try again.");
    }
  }

  if (success) {
    return (
      <div className="bg-[#F8FAFC] rounded-2xl p-8 text-center border border-gray-100">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="font-poppins font-bold text-xl text-[#1A1A2E] mb-2">
          Message Sent!
        </h3>
        <p className="text-gray-500 text-sm">
          Thank you for reaching out. We'll reply within 24-48 hours.
        </p>
      </div>
    );
  }

  return (
    <form action={handleAction} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm">
          {error}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label className="label-base" htmlFor="contactName">Your Name *</Label>
          <Input id="contactName" name="name" required placeholder="Full name" />
        </div>
        <div>
          <Label className="label-base" htmlFor="contactEmail">Email Address *</Label>
          <Input id="contactEmail" name="email" type="email" required placeholder="your@email.com" />
        </div>
      </div>

      <div>
        <Label className="label-base" htmlFor="contactSubject">Subject *</Label>
        <Input id="contactSubject" name="subject" required placeholder="What's this about?" />
      </div>

      <div>
        <Label className="label-base" htmlFor="contactMessage">Message *</Label>
        <Textarea
          id="contactMessage"
          name="message"
          required
          rows={5}
          placeholder="Write your message here..."
        />
      </div>

      <SubmitButton />
    </form>
  );
}
