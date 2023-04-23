import confetti from "canvas-confetti";

export function showSuccessConfettis() {
  const colors = [
    "#a8e063",
    "#56ab2f",
    "#a8e063",
    "#56ab2f",
    "#a8e063",
    "#00c9ff",
  ];
  confetti({
    particleCount: 100,
    angle: 60,
    spread: 55,
    origin: { x: 0 },
    colors,
  });
  confetti({
    particleCount: 100,
    angle: 120,
    spread: 55,
    origin: { x: 1 },
    colors,
  });
}
