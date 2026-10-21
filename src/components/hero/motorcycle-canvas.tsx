"use client";

import { Suspense, useEffect, useLayoutEffect, useMemo } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Environment, Lightformer, useGLTF } from "@react-three/drei";
import { Box3, Vector3, ACESFilmicToneMapping, SRGBColorSpace } from "three";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { MotorcycleAsset } from "@/lib/hero-asset";

function StudioLighting() {
  return (
    <>
      <ambientLight intensity={0.15} />
      <spotLight
        position={[3, 6, 4]}
        intensity={85}
        angle={0.6}
        penumbra={1}
        color="#f5f5f3"
      />
      <spotLight
        position={[-4, 3, -3]}
        intensity={65}
        angle={0.8}
        penumbra={1}
        color="#b6bdc5"
      />
      <Environment resolution={128} frames={1}>
        <Lightformer
          form="rect"
          intensity={4}
          position={[0, 5, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[8, 3, 1]}
        />
        <Lightformer
          form="rect"
          intensity={3}
          position={[4, 2, 2]}
          rotation={[0, -Math.PI / 2, 0]}
          scale={[3, 5, 1]}
        />
        <Lightformer
          form="rect"
          intensity={2}
          position={[-4, 1, -2]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[5, 2, 1]}
        />
      </Environment>
    </>
  );
}

function ScrollCameraRig({ onReady }: { onReady: () => void }) {
  const { camera, gl, invalidate } = useThree();
  useLayoutEffect(() => {
    const hero = gl.domElement.closest(".hero");
    if (!hero) return;
    gsap.registerPlugin(ScrollTrigger);
    const mobile = matchMedia("(max-width: 600px)").matches;
    const pose = { intro: 0, scroll: 0 };
    const update = () => {
      camera.position.set(
        4.5 + pose.scroll * (mobile ? 0.15 : 0.65),
        2.1 + pose.scroll * 0.15,
        6.8 + (1 - pose.intro) * 0.45 - pose.scroll * 0.35,
      );
      camera.lookAt(0, 0.15, 0);
      invalidate();
    };
    update();
    const context = gsap.context(() => {
      gsap.to(pose, {
        intro: 1,
        duration: 1.6,
        ease: "power2.out",
        onUpdate: update,
      });
      gsap.to(gl.domElement, {
        opacity: 1,
        duration: 1.2,
        ease: "power2.out",
        onComplete: onReady,
      });
      gsap.to(pose, {
        scroll: 1,
        ease: "none",
        onUpdate: update,
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });
    }, hero);
    return () => context.revert();
  }, [camera, gl, invalidate, onReady]);
  return null;
}

function Motorcycle({
  asset,
  onReady,
}: {
  asset: MotorcycleAsset;
  onReady: () => void;
}) {
  // Draco/Meshopt are disabled intentionally: delivery must be self-contained.
  const gltf = useGLTF(asset.model, false, false);
  const model = useMemo(() => {
    const scene = clone(gltf.scene);
    scene.rotation.set(...asset.rotation);
    scene.updateMatrixWorld(true);
    const box = new Box3().setFromObject(scene);
    const size = box.getSize(new Vector3());
    const largest = Math.max(size.x, size.y, size.z);
    if (!Number.isFinite(largest) || largest <= 0)
      throw new Error("Modelo sem dimensões válidas");
    const scale = 3.8 / largest;
    const center = box.getCenter(new Vector3());
    // Outer wrapper normalizes transformed bounds without mutating cached GLTF.
    return { scene, scale, offset: center.multiplyScalar(-scale) };
  }, [gltf.scene, asset.rotation]);
  return (
    <>
      <group position={model.offset} scale={model.scale}>
        <primitive object={model.scene} dispose={null} />
      </group>
      <ScrollCameraRig onReady={onReady} />
    </>
  );
}

function ContextGuard({ onFailure }: { onFailure: () => void }) {
  const { gl } = useThree();
  useEffect(() => {
    const canvas = gl.domElement;
    const lost = (event: Event) => {
      event.preventDefault();
      onFailure();
    };
    canvas.addEventListener("webglcontextlost", lost);
    return () => canvas.removeEventListener("webglcontextlost", lost);
  }, [gl, onFailure]);
  return null;
}

export default function MotorcycleCanvas({
  asset,
  onReady,
  onFailure,
}: {
  asset: MotorcycleAsset;
  onReady: () => void;
  onFailure: () => void;
}) {
  return (
    <Canvas
      className="motorcycle-canvas"
      aria-hidden="true"
      tabIndex={-1}
      frameloop="demand"
      dpr={[1, 1.5]}
      camera={{ position: [4.5, 2.1, 7.25], fov: 32 }}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      onCreated={({ gl }) => {
        gl.toneMapping = ACESFilmicToneMapping;
        gl.outputColorSpace = SRGBColorSpace;
        gl.toneMappingExposure = 0.9;
      }}
      fallback={null}
    >
      <ContextGuard onFailure={onFailure} />
      <Suspense fallback={null}>
        <StudioLighting />
        <Motorcycle asset={asset} onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}
