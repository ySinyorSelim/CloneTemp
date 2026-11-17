"use client";

import dynamic from "next/dynamic";

/** The studio reads localStorage on first render, so it is client-only. */
export const StudioLoader = dynamic(() => import("./studio").then((m) => m.Studio), {
  ssr: false,
  loading: () => <div className="dark min-h-dvh bg-background" />,
});
