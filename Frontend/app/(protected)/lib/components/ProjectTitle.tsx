"use client";

import useProject from "../hooks/useProject";

export default function ProjectTitle() {
  const { project } = useProject();

  return (
    <div className="shrink-0 px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 font-semibold text-lg">
      Project: <span suppressHydrationWarning>{project?.title ?? ""}</span>
    </div>
  );
}