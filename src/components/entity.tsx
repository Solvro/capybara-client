import { useEffect, useRef, useState } from "react";

import type { Frames } from "../types/frames";

interface EntityProps {
  allFrames: Frames;
  position: { x: number; y: number };
  cellSize: number;
  type?: string;
  name?: string;
}

export function Entity({
  allFrames,
  position,
  cellSize,
  type,
  name,
}: EntityProps) {
  const [frameIndex, setFrameIndex] = useState(0);
  const [frames, setFrames] = useState<string[]>(allFrames.front);
  const previousPos = useRef({ x: position.x, y: position.y });
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    const direction: { x: number; y: number } = {
      x: previousPos.current.x - position.x,
      y: previousPos.current.y - position.y,
    };
    const moved = direction.x !== 0 || direction.y !== 0;

    if (moved) {
      if (animRef.current != null && animRef.current) {
        clearInterval(animRef.current);
        animRef.current = null;
      }

      if (direction.y < 0) {
        setFrames(allFrames.front);
      } else if (direction.y > 0) {
        setFrames(allFrames.back);
      } else if (direction.x < 0) {
        setFrames(allFrames.right);
      } else if (direction.x > 0) {
        setFrames(allFrames.left);
      }

      let ticks = 0;
      const maxTicks = frames.length;
      setFrameIndex(1);

      animRef.current = window.setInterval(() => {
        setFrameIndex((index) => (index + 1) % frames.length);
        ticks++;
        if (ticks >= maxTicks) {
          if (animRef.current != null && animRef.current) {
            clearInterval(animRef.current);
            animRef.current = null;
          }
          setFrameIndex(0);
        }
      }, 90);
    }

    previousPos.current = { x: position.x, y: position.y };

    return () => {
      if (animRef.current != null && animRef.current) {
        clearInterval(animRef.current);
        animRef.current = null;
      }
    };
  }, [position.x, position.y]);

  const source = frames[Math.max(0, Math.min(frameIndex, frames.length - 1))];

  return (
    <div style={{ position: "relative", width: cellSize, height: cellSize }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          top: `-12px`,
          fontSize: 12,
          pointerEvents: "none",
          color: "#fff",
          whiteSpace: "nowrap",
        }}
      >
        {name}
      </div>

      <img
        src={source}
        alt={type ?? name ?? "entity"}
        draggable={false}
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: cellSize * 0.9,
        }}
      />
    </div>
  );
}
