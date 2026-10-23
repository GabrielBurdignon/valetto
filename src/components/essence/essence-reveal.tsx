"use client";

import type { ReactNode } from "react";
import { useProgressiveController } from "@/components/motion/use-progressive-controller";

const loadController = () =>
  import("./essence-controller").then((module) => module.mountEssence);

export function EssenceReveal({ children }: { children: ReactNode }) {
  const root = useProgressiveController(loadController, "120px 0px");
  return (
    <div ref={root} data-essence-story data-enhanced="false">
      {children}
    </div>
  );
}
