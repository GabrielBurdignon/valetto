"use client";

import type { ReactNode } from "react";
import { useProgressiveController } from "@/components/motion/use-progressive-controller";

const loadController = () =>
  import("./essence-controller").then((module) => module.mountEssence);

export function EssenceReveal({ children }: { children: ReactNode }) {
  const root = useProgressiveController(loadController, "600px 0px");
  return <div ref={root}>{children}</div>;
}
