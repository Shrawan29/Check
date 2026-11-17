"use client";

import { useRef, useState, type FormEvent } from "react";
import { postJson } from "@/lib/api-client";
import { cx } from "@/lib/format";

type Field = "name" | "email" | "message";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const RULES: Record<Field, (value: string) => string> = {
  name: (v) => (v.trim().length >= 2 ? "" : "Tell us your name so we know who to reply to."),
  email: (v) => (EMAIL.test(v.trim()) ? "" : "Enter an email address we can reply to, like you@example.com."),
  message: (v) => (v.trim().length >= 10 ? "" : "Give us a little more to go on, at least a sentence."),
};

/** Contact form: checks each field when you leave it, then posts to /api/messages. */
export function ContactForm() {
  const [values, setValues] = useState({ name: "", email: "", order: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<{ kind: "idle" | "busy" | "ok" | "error"; message: string }>({ kind: "idle", message: "" });
  const formRef = useRef<HTMLFormElement | null>(null);

  const set = (key: keyof typeof values) => (e: { target: { value: string } }) => setValues((v) => ({ ...v, [key]: e.target.value }));
  const check = (field: Field) => setErrors((prev) => ({ ...prev, [field]: values[field] ? RULES[field](values[field]) : prev[field] }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const found = Object.fromEntries((Object.keys(RULES) as Field[]).map((f) => [f, RULES[f](values[f])])) as Record<Field, string>;
    setErrors(found);
    const firstBad = (Object.keys(found) as Field[]).find((f) => found[f]);
    if (firstBad) {
      setStatus({ kind: "idle", message: "" });
      formRef.current?.querySelector<HTMLElement>(`[name="${firstBad}"]`)?.focus();
      return;
    }

    setStatus({ kind: "busy", message: "" });
    const res = await postJson("/api/messages", { ...values, order: values.order || undefined });
    if (res.ok) {
      setValues({ name: "", email: "", order: "", message: "" });
      setStatus({ kind: "ok", message: "Thanks, your message is with the workshop. We usually reply the same day." });
    } else {
      setErrors({ name: res.fields.name, email: res.fields.email, message: res.fields.message });
      setStatus({ kind: "error", message: res.error });
    }
  };

  const field = (name: Field) => ({
    name,
    value: values[name],
    onChange: set(name),
    onBlur: () => check(name),
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": `c-${name}-err`,
  });

  return (
    <form className="form" ref={formRef} onSubmit={submit} noValidate>
      <div className="form__two">
        <div className={cx("field", errors.name && "has-error")}>
          <label htmlFor="c-name">Your name</label>
          <input className="input" id="c-name" type="text" autoComplete="name" required {...field("name")} />
          <p className="field-error" id="c-name-err" role="alert">
            {errors.name}
          </p>
        </div>
        <div className={cx("field", errors.email && "has-error")}>
          <label htmlFor="c-email">Email</label>
          <input className="input" id="c-email" type="email" autoComplete="email" inputMode="email" required {...field("email")} />
          <p className="field-error" id="c-email-err" role="alert">
            {errors.email}
          </p>
        </div>
      </div>
      <div className="field">
        <label htmlFor="c-order">
          Order number <span style={{ textTransform: "none", letterSpacing: 0, color: "var(--ink-3)" }}>(if you have one)</span>
        </label>
        <input className="input" id="c-order" name="order" type="text" autoComplete="off" placeholder="e.g. CP-7KQ2M9XA" value={values.order} onChange={set("order")} />
      </div>
      <div className={cx("field", errors.message && "has-error")}>
        <label htmlFor="c-message">How can we help?</label>
        <textarea className="textarea" id="c-message" required {...field("message")} />
        <p className="field-error" id="c-message-err" role="alert">
          {errors.message}
        </p>
      </div>
      <button className={cx("btn btn--ink", status.kind === "busy" && "is-busy")} type="submit" disabled={status.kind === "busy"}>
        {status.kind === "busy" ? "Sending…" : "Send message"}
      </button>
      <p className={cx("field-msg", status.kind === "ok" && "is-ok", status.kind === "error" && "is-error")} role="status" aria-live="polite">
        {status.message}
      </p>
    </form>
  );
}
