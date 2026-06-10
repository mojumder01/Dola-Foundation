export type Role = "SUPER_ADMIN" | "ADMIN" | "EDITOR";
export type ProjectStatus = "ONGOING" | "COMPLETED" | "UPCOMING";
export type VolunteerStatus = "PENDING" | "APPROVED" | "REJECTED" | "ACTIVE";
export type PaymentMethod =
  | "BKASH"
  | "NAGAD"
  | "ROCKET"
  | "BANK_TRANSFER"
  | "STRIPE"
  | "PAYPAL";
export type DonationStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface SiteSettings {
  id: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage?: string | null;
  aboutText?: string | null;
  missionText?: string | null;
  visionText?: string | null;
  founderName?: string | null;
  founderMessage?: string | null;
  founderImage?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  twitterUrl?: string | null;
  youtubeUrl?: string | null;
  stat1Label: string;
  stat1Value: string;
  stat2Label: string;
  stat2Value: string;
  stat3Label: string;
  stat3Value: string;
  stat4Label: string;
  stat4Value: string;
  updatedAt: Date;
}

export interface Program {
  id: string;
  title: string;
  slug: string;
  description: string;
  objectives: string[];
  icon?: string | null;
  bannerImage?: string | null;
  gallery: string[];
  stat1Label?: string | null;
  stat1Value?: string | null;
  stat2Label?: string | null;
  stat2Value?: string | null;
  stat3Label?: string | null;
  stat3Value?: string | null;
  order: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  budget?: number | null;
  location?: string | null;
  gallery: string[];
  impact?: string | null;
  status: ProjectStatus;
  startDate?: Date | null;
  endDate?: Date | null;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  coverImage?: string | null;
  category?: string | null;
  tags: string[];
  author: string;
  published: boolean;
  publishedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface GalleryImage {
  id: string;
  title?: string | null;
  url: string;
  publicId?: string | null;
  category?: string | null;
  order: number;
  createdAt: Date;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string | null;
  image?: string | null;
  order: number;
  active: boolean;
  createdAt: Date;
}

export interface Testimonial {
  id: string;
  name: string;
  quote: string;
  program?: string | null;
  image?: string | null;
  active: boolean;
  order: number;
  createdAt: Date;
}

export interface Volunteer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address?: string | null;
  profession?: string | null;
  skills: string[];
  interest: string[];
  availability?: string | null;
  message?: string | null;
  status: VolunteerStatus;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Donor {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  totalGiven: number;
  createdAt: Date;
}

export interface Donation {
  id: string;
  donorName: string;
  donorEmail: string;
  donorPhone?: string | null;
  amount: number;
  currency: string;
  method: PaymentMethod;
  transactionId?: string | null;
  programId?: string | null;
  program?: Program | null;
  status: DonationStatus;
  isRecurring: boolean;
  frequency?: string | null;
  message?: string | null;
  donorId?: string | null;
  createdAt: Date;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

export interface Subscriber {
  id: string;
  email: string;
  name?: string | null;
  active: boolean;
  createdAt: Date;
}

// Form types
export interface VolunteerFormData {
  fullName: string;
  email: string;
  phone: string;
  address?: string;
  profession?: string;
  skills: string[];
  interest: string[];
  availability?: string;
  message?: string;
}

export interface DonationFormData {
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  amount: number;
  currency?: string;
  method: PaymentMethod;
  transactionId?: string;
  programId?: string;
  isRecurring?: boolean;
  frequency?: string;
  message?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Nav types
export interface NavLink {
  label: string;
  href: string;
  children?: NavLink[];
}

// Stats type
export interface StatItem {
  label: string;
  value: string;
  icon?: string;
}
