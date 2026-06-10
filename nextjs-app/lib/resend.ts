import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@dolafoundation.org";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "info@dolafoundation.org";

export async function sendVolunteerConfirmation(data: {
  name: string;
  email: string;
}) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: data.email,
    subject: "Thank you for volunteering with Dola Foundation!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #0F3D8C, #1F9D55); padding: 40px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Dola Foundation</h1>
          <p style="color: rgba(255,255,255,0.9); margin-top: 8px;">Empowering Lives, Inspiring Hope</p>
        </div>
        <div style="padding: 40px; background: white;">
          <h2 style="color: #1A1A2E;">Dear ${data.name},</h2>
          <p style="color: #555; line-height: 1.6;">
            Thank you for your interest in volunteering with Dola Foundation! We have received your application
            and are excited about your willingness to join our mission of empowering lives.
          </p>
          <p style="color: #555; line-height: 1.6;">
            Our team will review your application and get back to you within 3-5 business days.
            In the meantime, feel free to explore our programs and projects on our website.
          </p>
          <div style="background: #F8FAFC; border-radius: 12px; padding: 24px; margin: 24px 0;">
            <h3 style="color: #0F3D8C; margin-top: 0;">What happens next?</h3>
            <ol style="color: #555; line-height: 1.8;">
              <li>Our volunteer coordinator will review your application</li>
              <li>You'll receive an email with further instructions</li>
              <li>We'll match you with programs that fit your skills and interests</li>
              <li>Attend our orientation session to get started</li>
            </ol>
          </div>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}"
             style="display: inline-block; background: #F4B400; color: #1A1A2E; padding: 12px 32px;
                    border-radius: 50px; text-decoration: none; font-weight: bold; margin-top: 16px;">
            Visit Our Website
          </a>
        </div>
        <div style="background: #1A1A2E; padding: 24px; text-align: center;">
          <p style="color: #888; margin: 0; font-size: 14px;">
            © ${new Date().getFullYear()} Dola Foundation. All rights reserved.
          </p>
        </div>
      </div>
    `,
  });
}

export async function sendVolunteerNotification(data: {
  name: string;
  email: string;
  phone: string;
  profession?: string;
}) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: `New Volunteer Application: ${data.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0F3D8C;">New Volunteer Application</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Name:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${data.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Email:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${data.email}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Phone:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${data.phone}</td>
          </tr>
          ${data.profession ? `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Profession:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${data.profession}</td>
          </tr>
          ` : ""}
        </table>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/volunteers"
           style="display: inline-block; background: #0F3D8C; color: white; padding: 12px 32px;
                  border-radius: 50px; text-decoration: none; font-weight: bold; margin-top: 16px;">
          View in Admin Panel
        </a>
      </div>
    `,
  });
}

export async function sendContactConfirmation(data: {
  name: string;
  email: string;
  subject: string;
}) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: data.email,
    subject: `We received your message: ${data.subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #0F3D8C, #1F9D55); padding: 40px; text-align: center;">
          <h1 style="color: white; margin: 0;">Dola Foundation</h1>
        </div>
        <div style="padding: 40px; background: white;">
          <h2 style="color: #1A1A2E;">Dear ${data.name},</h2>
          <p style="color: #555; line-height: 1.6;">
            Thank you for reaching out to us! We have received your message regarding
            "<strong>${data.subject}</strong>" and our team will respond within 24-48 hours.
          </p>
          <p style="color: #555; line-height: 1.6;">
            If your matter is urgent, please call us directly at our office number.
          </p>
        </div>
        <div style="background: #1A1A2E; padding: 24px; text-align: center;">
          <p style="color: #888; margin: 0; font-size: 14px;">
            © ${new Date().getFullYear()} Dola Foundation. All rights reserved.
          </p>
        </div>
      </div>
    `,
  });
}

export async function sendContactNotification(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: `New Contact Message: ${data.subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0F3D8C;">New Contact Form Submission</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">From:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${data.name} (${data.email})</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Subject:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${data.subject}</td>
          </tr>
        </table>
        <div style="background: #F8FAFC; border-radius: 8px; padding: 16px; margin-top: 16px;">
          <p style="color: #555; margin: 0;">${data.message}</p>
        </div>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin"
           style="display: inline-block; background: #0F3D8C; color: white; padding: 12px 32px;
                  border-radius: 50px; text-decoration: none; font-weight: bold; margin-top: 16px;">
          View in Admin Panel
        </a>
      </div>
    `,
  });
}
