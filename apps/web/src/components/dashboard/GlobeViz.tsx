import createGlobe, { Marker } from "cobe";

import { useEffect, useMemo, useRef } from "react";
import { useSpring } from "react-spring";
import { StatisticsJson } from "shared-types";

type Props = {
  visitors: StatisticsJson["views"];
  averageLocation: {
    latitude: number;
    longitude: number;
  } | null;
};
const maxWidth = 560;

// @todo Increase marker size based on number of visits
export default function GlobeViz({ visitors, averageLocation }: Props) {
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

  const locations: Marker[] = useMemo(
    () =>
      visitors.map((e) => ({
        location: [Number(e.metadata.latitude), Number(e.metadata.longitude)],
        size: 0.1,
      })),
    [visitors]
  );

  const locationToAngles = (lat: number, long: number) => {
    return [
      Math.PI - ((long * Math.PI) / 180 - Math.PI / 2),
      (lat * Math.PI) / 180,
    ];
  };

  const centeredPhi = averageLocation
    ? locationToAngles(
        averageLocation.latitude,
        averageLocation.longitude
      )[0] || Math.PI * 1.6
    : Math.PI * 1.6;

  useEffect(() => {
    let width = 0;
    const onResize = () =>
      canvasRef.current && (width = canvasRef.current.offsetWidth);
    window.addEventListener("resize", onResize);
    onResize();

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: window.devicePixelRatio,
      width: width * window.devicePixelRatio,
      height: width * window.devicePixelRatio,
      phi: centeredPhi,
      theta: 0.15,
      dark: 0,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 4,
      baseColor: [1, 1, 1],
      markerColor: [249 / 255, 115 / 255, 22 / 255],
      offset: [0, 0],
      glowColor: [0.8, 0.8, 0.8],
      markers: locations,

      onRender: (state) => {
        state.phi = centeredPhi + r.get();

        state.width = width * window.devicePixelRatio;
        state.height = width * window.devicePixelRatio;
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
          if (typeof pointerInteracting.current == "number") {
            const delta = e.clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta;
            api.start({
              r: delta / 200,
            });
          }
        }}
        onTouchMove={(e) => {
          if (typeof pointerInteracting.current == "number" && e.touches[0]) {
            const delta = e.touches[0]
              ? e.touches[0]?.clientX - pointerInteracting.current
              : 0;
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
