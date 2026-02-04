"use client";

import { useEffect, useState } from "react";

const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 1080;

export function ScaleToFit({ children }: { children: React.ReactNode }) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    function updateScale() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const scaleX = w / DESIGN_WIDTH;
      const scaleY = h / DESIGN_HEIGHT;
      setScale(Math.min(scaleX, scaleY));
    }

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  return (
    <div className="flex h-screen w-screen items-center justify-center overflow-hidden bg-black">
      <div
        className="shrink-0 origin-center"
        style={{
          width: DESIGN_WIDTH,
          height: DESIGN_HEIGHT,
          transform: `scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
