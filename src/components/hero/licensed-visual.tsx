"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import {
  Component,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { MotorcycleAsset } from "@/lib/hero-asset";

const MotorcycleCanvas = dynamic(() => import("./motorcycle-canvas"), {
  ssr: false,
});

class SceneBoundary extends Component<
  { children: ReactNode; onFailure: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFailure();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function LicensedVisual({ asset }: { asset: MotorcycleAsset }) {
  const host = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"poster" | "loading" | "ready" | "failed">(
    "poster",
  );
  const onReady = useCallback(() => setMode("ready"), []);
  const onFailure = useCallback(() => setMode("failed"), []);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    // Conserve data and keep a deliberate static experience for reduced motion.
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !motion.matches && !connection?.saveData) {
          setMode((current) => (current === "poster" ? "loading" : current));
        }
      },
      { rootMargin: "80px" },
    );
    const onMotion = () => {
      if (motion.matches) setMode("poster");
    };
    observer.observe(element);
    motion.addEventListener("change", onMotion);
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", onMotion);
    };
  }, []);
  useEffect(() => {
    if (mode !== "loading") return;
    const timeout = setTimeout(() => setMode("failed"), 15000);
    return () => clearTimeout(timeout);
  }, [mode]);
  return (
    <div ref={host} className="motorcycle-visual" data-state={mode}>
      <Image
        className="motorcycle-poster"
        src={asset.poster}
        alt={asset.alt}
        fill
        sizes="(max-width: 600px) 100vw, 52vw"
        priority
      />
      {(mode === "loading" || mode === "ready") && (
        <SceneBoundary onFailure={onFailure}>
          <MotorcycleCanvas
            asset={asset}
            onReady={onReady}
            onFailure={onFailure}
          />
        </SceneBoundary>
      )}
    </div>
  );
}
