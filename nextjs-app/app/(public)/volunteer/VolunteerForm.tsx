"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { submitVolunteer } from "@/actions/volunteer";

const skillOptions = [
  "Teaching/Education",
  "Medical/Healthcare",
  "IT/Technology",
  "Design/Creative",
  "Engineering/Construction",
  "Accounting/Finance",
  "Communication/PR",
  "Photography/Videography",
  "Cooking/Food Preparation",
  "Administration",
  "Driving/Transport",
  "Other",
];

const interestOptions = [
  "Education Program",
  "Healthcare Program",
  "Charity & Relief",
  "Environment Program",
  "Youth Development",
  "Orphan Care",
  "Fundraising",
  "Awareness Campaigns",
  "Administrative Support",
];

const availabilityOptions = [
  "Weekdays (Daytime)",
  "Weekdays (Evening)",
  "Weekends",
  "Any time",
  "Specific events only",
  "Remote/Online only",
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="primary"
      size="lg"
      className="w-full"
      disabled={pending}
    >
      {pending ? (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          Submitting...
        </>
      ) : (
        "Submit Application"
      )}
    </Button>
  );
}

export default function VolunteerForm() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleItem = (
    value: string,
    current: string[],
    setter: (v: string[]) => void
  ) => {
    if (current.includes(value)) {
      setter(current.filter((v) => v !== value));
    } else {
      setter([...current, value]);
    }
  };

  async function handleAction(formData: FormData) {
    formData.set("skills", JSON.stringify(selectedSkills));
    formData.set("interest", JSON.stringify(selectedInterests));

    const result = await submitVolunteer(formData);
    if (result?.success) {
      setSuccess(true);
      setError(null);
    } else {
      setError(result?.error || "Something went wrong. Please try again.");
    }
  }

  if (success) {
    return (
      <div className="bg-white rounded-2xl shadow-card p-10 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h3 className="font-poppins font-bold text-2xl text-dark mb-3">
          Application Submitted!
        </h3>
        <p className="text-gray-500 leading-relaxed mb-6 max-w-md mx-auto">
          Thank you for your interest in volunteering with Dola Foundation! We've received
          your application and will review it shortly. You'll hear from us within 3-5 business days.
        </p>
        <p className="text-sm text-gray-400">
          A confirmation email has been sent to your email address.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden">
      <div className="bg-gradient-to-r from-green to-primary p-6 text-white">
        <h3 className="font-poppins font-bold text-xl">Volunteer Registration Form</h3>
        <p className="text-white/80 text-sm mt-1">All fields marked * are required</p>
      </div>

      <form action={handleAction} className="p-8 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm">
            {error}
          </div>
        )}

        {/* Personal Info */}
        <div>
          <h4 className="font-poppins font-semibold text-dark mb-4 pb-2 border-b border-gray-100">
            Personal Information
          </h4>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label className="label-base" htmlFor="fullName">Full Name *</Label>
              <Input id="fullName" name="fullName" required placeholder="Your full name" />
            </div>
            <div>
              <Label className="label-base" htmlFor="email">Email Address *</Label>
              <Input id="email" name="email" type="email" required placeholder="your@email.com" />
            </div>
            <div>
              <Label className="label-base" htmlFor="phone">Phone Number *</Label>
              <Input id="phone" name="phone" required placeholder="+880 1700-000000" />
            </div>
            <div>
              <Label className="label-base" htmlFor="profession">Profession</Label>
              <Input id="profession" name="profession" placeholder="Your occupation" />
            </div>
          </div>
          <div className="mt-4">
            <Label className="label-base" htmlFor="address">Address</Label>
            <Input id="address" name="address" placeholder="Your district/city" />
          </div>
        </div>

        {/* Skills */}
        <div>
          <h4 className="font-poppins font-semibold text-dark mb-4 pb-2 border-b border-gray-100">
            Skills & Expertise
          </h4>
          <div className="flex flex-wrap gap-2">
            {skillOptions.map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => toggleItem(skill, selectedSkills, setSelectedSkills)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  selectedSkills.includes(skill)
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary"
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
          {selectedSkills.length === 0 && (
            <p className="text-xs text-gray-400 mt-2">Please select at least one skill</p>
          )}
        </div>

        {/* Areas of Interest */}
        <div>
          <h4 className="font-poppins font-semibold text-dark mb-4 pb-2 border-b border-gray-100">
            Areas of Interest
          </h4>
          <div className="flex flex-wrap gap-2">
            {interestOptions.map((interest) => (
              <button
                key={interest}
                type="button"
                onClick={() => toggleItem(interest, selectedInterests, setSelectedInterests)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  selectedInterests.includes(interest)
                    ? "bg-green text-white border-green"
                    : "bg-white text-gray-600 border-gray-200 hover:border-green hover:text-green"
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div>
          <h4 className="font-poppins font-semibold text-dark mb-4 pb-2 border-b border-gray-100">
            Availability
          </h4>
          <div className="grid sm:grid-cols-3 gap-2">
            {availabilityOptions.map((option) => (
              <label
                key={option}
                className="flex items-center gap-2 p-3 border border-gray-200 rounded-xl cursor-pointer hover:border-primary transition-colors"
              >
                <input
                  type="radio"
                  name="availability"
                  value={option}
                  className="text-primary"
                />
                <span className="text-sm text-gray-600">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Message */}
        <div>
          <Label className="label-base" htmlFor="message">
            Why do you want to volunteer? (Optional)
          </Label>
          <Textarea
            id="message"
            name="message"
            rows={4}
            placeholder="Tell us about your motivation and any specific experience you have..."
          />
        </div>

        <SubmitButton />
      </form>
    </div>
  );
}
