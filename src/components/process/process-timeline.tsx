"use client";

import type { ReactNode } from "react";
import { useProgressiveController } from "@/components/motion/use-progressive-controller";

const loadController = () =>
  import("./process-controller").then((module) => module.mountProcess);

export function ProcessTimeline({ children }: { children: ReactNode }) {
  const root = useProgressiveController(loadController, "600px 0px");
  return (
    <div ref={root} data-process-timeline data-enhanced="false">
      {children}
    </div>
  );
}
