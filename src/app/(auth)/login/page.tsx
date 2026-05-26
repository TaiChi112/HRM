import { auth, signIn } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  async function signInWithGoogleAction() {
    "use server";

    await signIn("google", { redirectTo: "/dashboard" });
  }

  return (
    <main className="relative min-h-dvh overflow-hidden bg-slate-950 px-4 py-10 text-slate-100 sm:px-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-96 w-[24rem] -translate-x-1/2 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-24 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_55%)]" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100dvh-5rem)] w-full max-w-5xl items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-white/15 bg-white/10 p-7 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
            HR Easy Platform
          </p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Welcome Back
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            Sign in with your Google account to continue to your secure HR workspace.
          </p>

          <form action={signInWithGoogleAction} className="mt-7">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Continue with Google
            </button>
          </form>

          <div className="mt-5 border-t border-white/10 pt-5 text-center">
            <Link href="/" className="text-sm font-medium text-slate-300 transition hover:text-white">
              Back to landing page
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}