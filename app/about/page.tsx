"use client";

import { FormEvent, useState } from "react";

export default function AboutPage() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
    event.currentTarget.reset();
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <section className="surface-card space-y-4">
        <h1 className="section-title">About the Owner</h1>
        <p className="text-stone-700">
          Zara is a passionate food entrepreneur in Kaduna who started Zara&apos;s Crunch to make quality small chops and snacks easily accessible.
          She believes every order should feel homemade, fresh, and premium.
        </p>
        <p className="text-stone-700">
          This platform helps Zara run orders professionally, keep her menu updated instantly, and respond quickly to customers without manual back-and-forth.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="surface-card">
          <h2 className="font-semibold">Address</h2>
          <p className="mt-2 text-sm text-stone-600">Kaduna, opposite NTI.</p>
        </div>
        <div className="surface-card">
          <h2 className="font-semibold">Phone / WhatsApp</h2>
          <a href="https://wa.me/2348144617310" target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm text-rose-700 hover:underline">+234 814 461 7310</a>
        </div>
        <div className="surface-card">
          <h2 className="font-semibold">Email</h2>
          <a href="mailto:orders@zarascrunch.com" className="mt-2 inline-block text-sm text-rose-700 hover:underline">orders@zarascrunch.com</a>
        </div>
      </section>

      <section className="surface-card space-y-4">
        <h2 className="text-xl font-semibold">Send a Direct Message</h2>
        <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2">
          <input required placeholder="Your name" className="rounded-xl border px-4 py-2" />
          <input required type="email" placeholder="Your email" className="rounded-xl border px-4 py-2" />
          <textarea required placeholder="Your message" className="rounded-xl border px-4 py-2 sm:col-span-2" rows={5} />
          <button className="rounded-full bg-rose-700 px-5 py-2 text-white sm:col-span-2 sm:w-fit">Send Message</button>
        </form>
        {sent ? <p className="text-sm text-emerald-700">Thanks! Your message has been received on the page.</p> : null}
      </section>
    </div>
  );
}
