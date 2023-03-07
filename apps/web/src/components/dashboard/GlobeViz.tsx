import createGlobe, { Marker } from "cobe";

import { useEffect, useMemo, useRef } from "react";
import { useSpring } from "react-spring";
import { StatisticsJson } from "shared-types";

type Props = {
  visitors: StatisticsJson["keys"];
};
const maxWidth = 560;

export default function GlobeViz({ visitors }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const canvasRef = useRef<any>();
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);

  const [{ r }, api] = useSpring(() => ({
    r: 0,
    config: {
      mass: 1,
      tension: 280,
      friction: 60,
      precision: 0.001,
    },
  }));

  const centerCoordinates: [number, number] = useMemo(() => {
    

    // if (visitors) {
    //   return [0, 0];
    // }
    // const lat = visitors.
    return [0, 0];
  }, [visitors]);

  const locations: Marker[] = useMemo(
    () =>
      visitors.map((e) => ({
        location: [Number(e.metadata.latitude), Number(e.metadata.longitude)],
        size: 0.1,
      })),
    [visitors]
  );

  useEffect(() => {
    // let phi = -0.5;

    // Find phi based on center coordinates

    // eslint-disable-next-line prefer-const
    let phi = Math.atan2(
      Math.sqrt(
        Math.pow(Math.cos(centerCoordinates[0]), 2) *
          Math.pow(Math.cos(centerCoordinates[1]), 2)
      ),
      Math.sin(centerCoordinates[0])
    );
    let width = 0;
    const onResize = () =>
      canvasRef.current && (width = canvasRef.current.offsetWidth);
    console.log(width);
    window.addEventListener("resize", onResize);
    onResize();

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 1 || window.devicePixelRatio,
      width: width,
      height: width,
      phi,
      theta: 0.15,
      dark: 0,
      diffuse: 1.2,
      // scale: 1,
      mapSamples: 16000,
      mapBrightness: 4,
      baseColor: [1, 1, 1],
      markerColor: [249 / 255, 115 / 255, 22 / 255],
      offset: [0, 0],
      glowColor: [0.8, 0.8, 0.8],
      markers: locations || [],
      onRender: (state) => {
        // phi += 0.002;
        state.phi = phi + r.get();
        state.width = width;
        state.height = width;
      },
    });

    setTimeout(() => (canvasRef.current.style.opacity = "1"));
    return () => globe.destroy();
  }, []);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: maxWidth,
        aspectRatio: "1",
        margin: "auto",
        position: "relative",
      }}
    >
      <canvas
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current =
            e.clientX - pointerInteractionMovement.current;
          canvasRef.current.style.cursor = "grabbing";
        }}
        onPointerUp={() => {
          pointerInteracting.current = null;
          canvasRef.current.style.cursor = "grab";
        }}
        onPointerOut={() => {
          pointerInteracting.current = null;
          canvasRef.current.style.cursor = "grab";
        }}
        onMouseMove={(e) => {
          if (pointerInteracting.current !== null) {
            const delta = e.clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta;
            api.start({
              r: delta / 200,
            });
          }
        }}
        onTouchMove={(e) => {
          if (pointerInteracting.current !== null && e.touches[0]) {
            const delta = e.touches[0].clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta;
            api.start({
              r: delta / 100,
            });
          }
        }}
        style={{
          width: "100%",
          height: "100%",
          contain: "layout paint size",
          opacity: 0,
          transition: "opacity 1s ease",
        }}
      />
    </div>
  );
}
