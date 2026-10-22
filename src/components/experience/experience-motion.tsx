"use client";

import type { ReactNode } from "react";
import { useProgressiveController } from "@/components/motion/use-progressive-controller";

const loadController = () =>
  import("./experience-controller").then((module) => module.mountExperience);

export function ExperienceMotion({ children }: { children: ReactNode }) {
  const root = useProgressiveController(loadController, "600px 0px");
  return (
    <div ref={root} data-experience-story data-enhanced="false">
      {children}
    </div>
  );
}
