import type { SVGProps } from "react";

// Lucide-style cow head — this repo's lucide-react version ships no `Cow`
// export, so we draw one matching the icon set's conventions (24×24 viewBox,
// strokeWidth 2, round caps/joins, currentColor stroke).
export default function CowIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {/* horns */}
      <path d="M8.6 7.4C7.2 7 6.3 5.9 6.1 4.2" />
      <path d="M15.4 7.4c1.4-.4 2.3-1.5 2.5-3.2" />
      {/* ears */}
      <path d="M6.8 10.1 4.6 9.3c.2 1 .8 1.7 1.7 2.1" />
      <path d="m17.2 10.1 2.2-.8c-.2 1-.8 1.7-1.7 2.1" />
      {/* face */}
      <circle cx="12" cy="13" r="6.2" />
      {/* muzzle + nostrils */}
      <ellipse cx="12" cy="15.8" rx="3.1" ry="2.1" />
      <path d="M10.8 15.8h.01" />
      <path d="M13.2 15.8h.01" />
      {/* eyes */}
      <path d="M9.7 10.9h.01" />
      <path d="M14.3 10.9h.01" />
    </svg>
  );
}
