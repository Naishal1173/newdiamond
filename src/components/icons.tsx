import type { SVGProps } from "react";

export function DiamondIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.45 2.2 4.17 10.5a2.4 2.4 0 0 0 0 3.39L10.5 21.8a2.4 2.4 0 0 0 3.4 0l6.32-6.33a2.4 2.4 0 0 0 0-3.39Z" />
      <path d="m8.5 2.76 7.53 7.53" />
      <path d="M2.2 12.45 10.5 4.17" />
    </svg>
  );
}
