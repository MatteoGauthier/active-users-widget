import React from "react";

type Props = {
  value: number;
  size: number;
  label: string;
};

const RingProgress = ({ value, size, label }: Props) => {
  const radius = (size - 4) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative inline-block">
      <svg
        style={{
          width: size,
          height: size,
          transform: "rotate(-90deg)",
        }}
        viewBox={`0 0 ${size} ${size}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        <circle
          className="stroke-current text-gray-300"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth="4"
        />
        <circle
          className="stroke-current text-blue-500"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform text-lg font-semibold text-slate-800">
        {label}
      </span>
    </div>
  );
};

export default RingProgress;
