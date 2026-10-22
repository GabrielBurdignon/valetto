"use client";

import type { ReactNode } from "react";
import { useProgressiveController } from "@/components/motion/use-progressive-controller";
import styles from "./philosophy.module.css";

const loadController = () =>
  import("./philosophy-controller").then((module) => module.mountPhilosophy);

export function PhilosophyStory({ children }: { children: ReactNode }) {
  const root = useProgressiveController(loadController, "800px 0px");
  return (
    <div
      className={styles.story}
      ref={root}
      data-philosophy-story
      data-enhanced="false"
    >
      {children}
    </div>
  );
}
