"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, RoundedBox } from "@react-three/drei";
import { useRef } from "react";
import type { Group } from "three";

function Phone() {
  const ref = useRef<Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    // دوران بطيء + تفاعل مع حركة الماوس
    ref.current.rotation.y = Math.sin(t * 0.3) * 0.3 + state.pointer.x * 0.5;
    ref.current.rotation.x = -state.pointer.y * 0.3;
  });

  return (
    <group ref={ref}>
      {/* إطار ذهبي معدني */}
      <RoundedBox args={[2, 4, 0.3]} radius={0.2} smoothness={6}>
        <meshStandardMaterial color="#c8a24e" metalness={1} roughness={0.22} />
      </RoundedBox>

      {/* الشاشة الداكنة المتوهّجة */}
      <mesh position={[0, 0, 0.16]}>
        <planeGeometry args={[1.78, 3.78]} />
        <meshStandardMaterial
          color="#06140f"
          metalness={0.85}
          roughness={0.18}
          emissive="#0f4c39"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* انعكاس ذهبي خفيف أعلى الشاشة */}
      <mesh position={[-0.35, 0.7, 0.17]} rotation={[0, 0, 0.5]}>
        <planeGeometry args={[0.5, 3]} />
        <meshBasicMaterial color="#e7cc84" transparent opacity={0.08} />
      </mesh>

      {/* الكاميرا الأمامية */}
      <mesh position={[0, 1.65, 0.18]}>
        <circleGeometry args={[0.05, 24]} />
        <meshStandardMaterial color="#000000" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* شعار ذهبي بسيط في المنتصف */}
      <mesh position={[0, 0, 0.18]}>
        <circleGeometry args={[0.28, 32]} />
        <meshStandardMaterial color="#c8a24e" metalness={1} roughness={0.3} emissive="#9a7a33" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

export default function PhoneScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 32 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 5]} intensity={2.4} />
      <pointLight position={[-5, -2, 4]} intensity={45} color="#c8a24e" />
      <pointLight position={[5, 3, 2]} intensity={25} color="#1e6b50" />
      <Float speed={2} rotationIntensity={0.4} floatIntensity={0.9}>
        <Phone />
      </Float>
    </Canvas>
  );
}
