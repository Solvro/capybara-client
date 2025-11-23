import { useEffect, useRef, useState } from "react";

interface Frames {
  front: string[];
  back: string[];
  left: string[];
  right: string[];
}

interface EntityProps {
  allFrames: Frames;
  position: { x: number; y: number };
  cellSize: number;
  type?: string;
  name?: string;
}

export default function Entity({
  allFrames,
  position,
  cellSize,
  type,
  name,
}: EntityProps) {
  const [frameIdx, setFrameIdx] = useState(0);
  const [frames, setFrames] = useState<string[]>(allFrames.front);
  const prevPos = useRef({ x: position.x, y: position.y });
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    const direction: { x: number; y: number } = {
      x: prevPos.current.x - position.x,
      y: prevPos.current.y - position.y,
    };
    const moved = direction.x !== 0 || direction.y !== 0;

    if (moved) {
      if (animRef.current) {
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
      setFrameIdx(1);

      animRef.current = window.setInterval(() => {
        setFrameIdx((i) => (i + 1) % frames.length);
        ticks++;
        if (ticks >= maxTicks) {
          if (animRef.current) {
            clearInterval(animRef.current);
            animRef.current = null;
          }
          setFrameIdx(0);
        }
      }, 90);
    }

    prevPos.current = { x: position.x, y: position.y };

    return () => {
      if (animRef.current) {
        clearInterval(animRef.current);
        animRef.current = null;
      }
    };
  }, [position.x, position.y]);

  const src = frames[Math.max(0, Math.min(frameIdx, frames.length - 1))];

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
        src={src}
        alt={type ?? name ?? "entity"}
        draggable={false}
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: `${cellSize * 0.9}px`,
        }}
      />
    </div>
  );
}
