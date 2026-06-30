"use server";

import { z } from "zod";

export type ContactFormState = {
  status: "success" | "error" | "validation";
  message: string;
  fieldErrors?: Partial<Record<"name" | "company" | "email" | "phone" | "message", string>>;
};

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  company: z.string().optional(),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(7, "Please enter a valid phone number")
    .regex(/^[+\d\s\-()]+$/, "Phone number contains invalid characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function submitContactForm(
  _prevState: ContactFormState | null,
  formData: FormData,
): Promise<ContactFormState> {
  const raw = {
    name: String(formData.get("name") ?? "").trim(),
    company: String(formData.get("company") ?? "").trim() || undefined,
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    phone: String(formData.get("phone") ?? "").trim(),
    message: String(formData.get("message") ?? "").trim(),
  };

  const result = contactSchema.safeParse(raw);

  if (!result.success) {
    const fieldErrors: ContactFormState["fieldErrors"] = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof typeof fieldErrors;
      if (field && !fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    }
    return {
      status: "validation",
      message: "Please fix the errors below.",
      fieldErrors,
    };
  }

  try {
    // TODO: send email via nodemailer / save enquiry to DB
    // For now: log server-side and return success
    console.log("[Contact Enquiry]", {
      ...result.data,
      submittedAt: new Date().toISOString(),
    });

    return {
      status: "success",
      message:
        "Thank you for reaching out. We'll get back to you within one business day.",
    };
  } catch {
    return {
      status: "error",
      message:
        "Something went wrong on our end. Please try again or email us directly at info@lumencraft.co.in.",
    };
  }
}
