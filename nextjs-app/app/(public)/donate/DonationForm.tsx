"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle, Loader2, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { recordDonation } from "@/actions/donation";

const presetAmounts = [500, 1000, 2500, 5000, 10000];

const programs = [
  { id: "", label: "General Fund (Most Needed)" },
  { id: "education", label: "Education Program" },
  { id: "healthcare", label: "Healthcare Program" },
  { id: "charity-relief", label: "Charity & Relief" },
  { id: "environment", label: "Environment Program" },
  { id: "youth-development", label: "Youth Development" },
  { id: "orphan-care", label: "Orphan Care" },
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="default" size="lg" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <CreditCard className="w-5 h-5 mr-2" />
          Complete Donation
        </>
      )}
    </Button>
  );
}

export default function DonationForm() {
  const [amount, setAmount] = useState(1000);
  const [customAmount, setCustomAmount] = useState("");
  const [frequency, setFrequency] = useState("one-time");
  const [program, setProgram] = useState("");
  const [method, setMethod] = useState("BKASH");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const finalAmount = customAmount ? Number(customAmount) : amount;

  async function handleAction(formData: FormData) {
    formData.set("amount", String(finalAmount));
    formData.set("method", method);
    formData.set("programId", program);
    formData.set("isRecurring", String(frequency === "monthly"));
    formData.set("frequency", frequency === "monthly" ? "monthly" : "");

    const result = await recordDonation(formData);
    if (result?.success) {
      setSuccess(true);
    } else {
      setError(result?.error || "Something went wrong.");
    }
  }

  if (success) {
    return (
      <div className="bg-white rounded-2xl shadow-card p-10 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h3 className="font-poppins font-bold text-2xl text-[#1A1A2E] mb-3">
          Donation Recorded!
        </h3>
        <p className="text-gray-500 leading-relaxed mb-4 max-w-md mx-auto">
          Thank you for your generous donation of ৳{finalAmount.toLocaleString()} to Dola Foundation.
          We'll send you a confirmation and receipt to your email.
        </p>
        <p className="text-sm text-[#0F3D8C] font-medium">
          Remember to complete your payment via {method.replace("_", " ").toLowerCase()} to confirm the transaction.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden">
      <div className="bg-gradient-to-r from-[#0F3D8C] to-[#1a4da0] p-6 text-white">
        <h3 className="font-poppins font-bold text-xl">Make Your Donation</h3>
        <p className="text-white/80 text-sm mt-1">Choose your amount and payment method</p>
      </div>

      <form action={handleAction} className="p-8 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm">
            {error}
          </div>
        )}

        {/* Frequency */}
        <div>
          <Label className="label-base">Donation Frequency</Label>
          <div className="grid grid-cols-2 gap-3">
            {["one-time", "monthly"].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFrequency(f)}
                className={`p-3 rounded-xl border-2 font-medium text-sm transition-all capitalize ${
                  frequency === f
                    ? "border-[#0F3D8C] bg-[#0F3D8C]/5 text-[#0F3D8C]"
                    : "border-gray-200 text-gray-600 hover:border-[#0F3D8C]/40"
                }`}
              >
                {f === "one-time" ? "One-Time" : "Monthly"}
              </button>
            ))}
          </div>
        </div>

        {/* Amount */}
        <div>
          <Label className="label-base">Donation Amount</Label>
          <div className="grid grid-cols-5 gap-2 mb-3">
            {presetAmounts.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => { setAmount(a); setCustomAmount(""); }}
                className={`p-2.5 rounded-xl border-2 font-medium text-sm transition-all ${
                  amount === a && !customAmount
                    ? "border-[#0F3D8C] bg-[#0F3D8C] text-white"
                    : "border-gray-200 text-gray-600 hover:border-[#0F3D8C]"
                }`}
              >
                ৳{a >= 1000 ? `${a / 1000}k` : a}
              </button>
            ))}
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-500">৳</span>
            <Input
              type="number"
              placeholder="Custom amount"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                if (e.target.value) setAmount(0);
              }}
              className="pl-8"
              min="100"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">Minimum donation: ৳100</p>
        </div>

        {/* Program */}
        <div>
          <Label className="label-base" htmlFor="programSelect">Designate to Program (Optional)</Label>
          <select
            id="programSelect"
            value={program}
            onChange={(e) => setProgram(e.target.value)}
            className="input-base"
          >
            {programs.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
        </div>

        {/* Donor Info */}
        <div>
          <h4 className="font-semibold text-[#1A1A2E] mb-3 text-sm">Your Information</h4>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label className="label-base" htmlFor="donorName">Full Name *</Label>
              <Input id="donorName" name="donorName" required placeholder="Your name" />
            </div>
            <div>
              <Label className="label-base" htmlFor="donorEmail">Email *</Label>
              <Input id="donorEmail" name="donorEmail" type="email" required placeholder="your@email.com" />
            </div>
            <div>
              <Label className="label-base" htmlFor="donorPhone">Phone</Label>
              <Input id="donorPhone" name="donorPhone" placeholder="+880 1700-000000" />
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <Label className="label-base">Payment Method</Label>
          <Tabs defaultValue="bangladesh">
            <TabsList className="w-full">
              <TabsTrigger value="bangladesh" className="flex-1">Bangladesh</TabsTrigger>
              <TabsTrigger value="international" className="flex-1">International</TabsTrigger>
            </TabsList>

            <TabsContent value="bangladesh">
              <div className="grid grid-cols-2 gap-3 mt-3">
                {[
                  { id: "BKASH", label: "bKash", color: "bg-pink-50 border-pink-200", activeColor: "bg-pink-500 text-white" },
                  { id: "NAGAD", label: "Nagad", color: "bg-orange-50 border-orange-200", activeColor: "bg-orange-500 text-white" },
                  { id: "ROCKET", label: "Rocket", color: "bg-purple-50 border-purple-200", activeColor: "bg-purple-500 text-white" },
                  { id: "BANK_TRANSFER", label: "Bank Transfer", color: "bg-blue-50 border-blue-200", activeColor: "bg-blue-500 text-white" },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMethod(m.id)}
                    className={`p-3 rounded-xl border-2 font-medium text-sm transition-all ${
                      method === m.id
                        ? "border-[#0F3D8C] bg-[#0F3D8C] text-white"
                        : `${m.color} text-gray-700 hover:border-[#0F3D8C]`
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {method !== "BANK_TRANSFER" && (
                <div className="mt-3 bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
                  <p className="font-medium text-[#1A1A2E] mb-1">
                    {method} Payment Instructions:
                  </p>
                  <p>Send to: <strong className="text-[#0F3D8C]">01700-000000</strong></p>
                  <p className="mt-1">After sending, enter your transaction ID below.</p>
                </div>
              )}

              {method === "BANK_TRANSFER" && (
                <div className="mt-3 bg-blue-50 rounded-xl p-4 text-sm text-gray-600">
                  <p className="font-medium text-[#1A1A2E] mb-2">Bank Transfer Details:</p>
                  <p>Bank: Dutch Bangla Bank</p>
                  <p>Account: 4601100005678</p>
                  <p>Name: Dola Foundation</p>
                </div>
              )}

              <div className="mt-3">
                <Label className="label-base" htmlFor="transactionId">Transaction ID</Label>
                <Input id="transactionId" name="transactionId" placeholder="Enter your transaction ID" />
              </div>
            </TabsContent>

            <TabsContent value="international">
              <div className="mt-3 bg-gray-50 rounded-xl p-5 text-center">
                <p className="font-medium text-[#1A1A2E] mb-2">
                  International Donations
                </p>
                <p className="text-sm text-gray-500">
                  PayPal and Stripe integration coming soon. For now, please
                  contact us at{" "}
                  <a href="mailto:donate@dolafoundation.org" className="text-[#0F3D8C] hover:underline">
                    donate@dolafoundation.org
                  </a>{" "}
                  for international donation options.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Message */}
        <div>
          <Label className="label-base" htmlFor="message">Message (Optional)</Label>
          <Textarea
            id="message"
            name="message"
            rows={2}
            placeholder="A message of hope or specific instructions..."
          />
        </div>

        {/* Summary */}
        <div className="bg-[#F4B400]/10 border border-[#F4B400]/20 rounded-xl p-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Donation Amount:</span>
            <span className="font-bold text-[#0F3D8C] text-lg">
              ৳{finalAmount.toLocaleString()}{frequency === "monthly" ? "/month" : ""}
            </span>
          </div>
          {program && (
            <div className="flex justify-between items-center text-sm mt-1">
              <span className="text-gray-600">Designated to:</span>
              <span className="text-gray-700">
                {programs.find((p) => p.id === program)?.label}
              </span>
            </div>
          )}
        </div>

        <SubmitButton />

        <p className="text-center text-xs text-gray-400">
          🔒 Your personal information is kept secure and private.
        </p>
      </form>
    </div>
  );
}
