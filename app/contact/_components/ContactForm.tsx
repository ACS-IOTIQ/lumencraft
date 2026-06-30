"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitContactForm, type ContactFormState } from "../actions";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs text-red-500">{message}</p>;
}

function InputField({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
  error,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  defaultValue?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#888884]">
        {label}
        {required && <span className="ml-0.5 text-black">*</span>}
      </label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        defaultValue={defaultValue}
        className={`w-full border px-4 py-3 text-sm text-black outline-none placeholder:text-[#c0c0bc] transition-colors focus:border-black ${
          error ? "border-red-400 bg-red-50/30" : "border-[#e8e8e5] bg-white"
        }`}
      />
      <FieldError message={error} />
    </div>
  );
}

export default function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState<ContactFormState | null, FormData>(
    submitContactForm,
    null,
  );

  useEffect(() => {
    if (state?.status === "success") {
      formRef.current?.reset();
    }
  }, [state?.status]);

  return (
    <form ref={formRef} action={formAction} noValidate>
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <InputField
            label="Your Name"
            name="name"
            placeholder="John Smith"
            required
            error={state?.fieldErrors?.name}
          />
          <InputField
            label="Company Name"
            name="company"
            placeholder="Acme Architects (optional)"
            error={state?.fieldErrors?.company}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <InputField
            label="Email Address"
            name="email"
            type="email"
            placeholder="you@company.com"
            required
            error={state?.fieldErrors?.email}
          />
          <InputField
            label="Phone Number"
            name="phone"
            type="tel"
            placeholder="+91 98765 43210"
            required
            error={state?.fieldErrors?.phone}
          />
        </div>

        <div>
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#888884]">
            Message<span className="ml-0.5 text-black">*</span>
          </label>
          <textarea
            name="message"
            rows={6}
            placeholder="Tell us about your project — location, scope, timeline, or anything else that helps us understand your requirements."
            required
            className={`w-full resize-none border px-4 py-3 text-sm text-black outline-none placeholder:text-[#c0c0bc] transition-colors focus:border-black ${
              state?.fieldErrors?.message
                ? "border-red-400 bg-red-50/30"
                : "border-[#e8e8e5] bg-white"
            }`}
          />
          <FieldError message={state?.fieldErrors?.message} />
        </div>

        {state?.status === "success" && (
          <div className="border border-black/10 bg-black px-5 py-4">
            <p className="text-sm font-medium text-white">{state.message}</p>
          </div>
        )}

        {state?.status === "error" && (
          <div className="border border-red-200 bg-red-50 px-5 py-4">
            <p className="text-sm text-red-700">{state.message}</p>
          </div>
        )}

        {state?.status === "validation" && !Object.values(state.fieldErrors ?? {}).length && (
          <div className="border border-red-200 bg-red-50 px-5 py-4">
            <p className="text-sm text-red-700">{state.message}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="flex w-full items-center justify-center gap-3 border border-black bg-black px-8 py-4 text-sm font-medium text-white transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {isPending ? (
            <>
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4Z"
                />
              </svg>
              Sending…
            </>
          ) : (
            "Send Message"
          )}
        </button>
      </div>
    </form>
  );
}
