import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="text-muted-foreground">
        Clone target not yet built. Run <code className="font-mono text-foreground">/clone-website</code> to start.
      </p>
      <Link href="/studio" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
        FM Paylaşım Stüdyosu →
      </Link>
    </main>
  );
}
