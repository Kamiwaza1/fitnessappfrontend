import { useMemo } from "react";
import "@/features/auth/components/star-background.css";

function createSeededRandom(seed) {
  let state = seed;

  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function generateStars(count, seed) {
  const shadows = [];
  const random = createSeededRandom(seed);

  for (let index = 0; index < count; index += 1) {
    const x = Math.floor(random() * 2000);
    const y = Math.floor(random() * 2000);
    shadows.push(`${x}px ${y}px #b8ffd0`);
  }

  return shadows.join(", ");
}

export default function StarBackground() {
  const smallStars = useMemo(() => generateStars(700, 1337), []);
  const mediumStars = useMemo(() => generateStars(200, 4242), []);
  const bigStars = useMemo(() => generateStars(100, 9001), []);

  return (
    <div className="star-bg" aria-hidden="true">
      <div id="stars" style={{ boxShadow: smallStars }} />
      <div id="stars2" style={{ boxShadow: mediumStars }} />
      <div id="stars3" style={{ boxShadow: bigStars }} />
    </div>
  );
}
