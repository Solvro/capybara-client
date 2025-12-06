import React, { useEffect, useState } from "react";

import { on as roomOn } from "../roomClient";

const tileSize = 32;

export function LaserRenderer() {
  const [shots, setShots] = useState<any[]>([]);

  useEffect(() => {
    roomOn("laser_fired", (msg: any) => {
      // msg.hits is an array of { type, x, y }
      const id = Date.now() + Math.random();
      setShots((s) => [...s, { id, msg }]);

      setTimeout(() => {
        setShots((s) => s.filter((sh) => sh.id !== id));
      }, 400);
    });

    roomOn("box_destroyed", (msg: any) => {
      const id = Date.now() + Math.random();
      setShots((s) => [...s, { id, msg }]);
      setTimeout(() => {
        setShots((s) => s.filter((sh) => sh.id !== id));
      }, 400);
    });
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
        width: "100%",
        height: "100%",
      }}
    >
      {shots.flatMap((shot) =>
        (shot.msg.hits || []).map((h: any, i: number) => {
          const style: React.CSSProperties = {
            position: "absolute",
            left: h.x * tileSize,
            top: h.y * tileSize,
            width: tileSize,
            height: tileSize,
            background: shot.msg.color || "red",
            opacity: 0.85,
            pointerEvents: "none",
            zIndex: 9999,
          };
          return <div key={`${shot.id}-${i}`} style={style} />;
        }),
      )}
    </div>
  );
}
