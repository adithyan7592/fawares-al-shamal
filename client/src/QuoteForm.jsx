import { useState } from "react";

export default function QuoteForm({ t, onSuccess, compact = false }) {
  const [form, setForm] = useState({
    name: "",
    number: "",
    location: "",
    description: "",
  });
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  function update(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function submit(e) {
    e.preventDefault();
    setStatus("sending");
    setMessage("");
    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      let data = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }
      if (!res.ok) throw new Error(data.error || t.form.error);

      console.log("[quote]", { status: res.status, emailed: data.emailed, mailError: data.mailError, id: data.id });
      if (data.mailError) console.error("[quote] email error:", data.mailError);

      setStatus("success");
      setMessage(t.form.success);
      setForm({ name: "", number: "", location: "", description: "" });
      onSuccess?.();
    } catch (err) {
      setStatus("error");
      setMessage(err.message || t.form.error);
    }
  }

  const field =
    "w-full rounded-md border-0 bg-white px-3.5 py-2.5 text-sm text-forest-900 placeholder:text-stone-400 shadow-sm outline-none focus:ring-2 focus:ring-forest-900/30";

  return (
    <form onSubmit={submit} className="space-y-3">
      <input className={field} required value={form.name} onChange={update("name")} placeholder={t.form.name} />
      <input
        className={field}
        required
        value={form.number}
        onChange={update("number")}
        placeholder={t.form.number}
        inputMode="tel"
      />
      <input
        className={field}
        required
        value={form.location}
        onChange={update("location")}
        placeholder={t.form.location}
      />
      <textarea
        className={`${field} min-h-[${compact ? "88" : "110"}px] resize-y`}
        style={{ minHeight: compact ? 88 : 110 }}
        required
        value={form.description}
        onChange={update("description")}
        placeholder={t.form.description}
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-md bg-forest-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-black disabled:opacity-60"
      >
        {status === "sending" ? t.form.sending : t.form.send}
      </button>
      {message ? (
        <p className={`text-sm ${status === "success" ? "text-white" : "text-red-100"}`}>{message}</p>
      ) : null}
    </form>
  );
}
