"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || ""),
    });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md surface-card">
      <h1 className="text-2xl font-semibold">Admin Login</h1>
      <form action={onSubmit} className="mt-4 space-y-4">
        <input required name="email" type="email" placeholder="Email" className="w-full rounded-xl border px-4 py-2" />
        <input required name="password" type="password" placeholder="Password" className="w-full rounded-xl border px-4 py-2" />
        {error ? <p className="text-sm text-rose-700">{error}</p> : null}
        <button disabled={loading} className="w-full rounded-full bg-rose-700 px-4 py-2 text-white disabled:bg-stone-300">{loading ? "Signing in..." : "Login"}</button>
      </form>
    </div>
  );
}
