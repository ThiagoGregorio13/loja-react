import { useId, useRef } from "react";
import { gsap, useGSAP, NO_REDUCED_MOTION } from "../animations/gsap";
import { formatPrice } from "../utils/format";

type ReceiptProps = {
  total: number;
  count: number;
};

// widths of the barcode bars; the x of each one is calculated below
const BARS = [2, 1, 3, 1, 2, 1, 1, 3, 2, 1, 2, 3, 1, 1, 2, 1, 3, 2, 1, 2, 1, 3];
const BAR_GAP = 1.6;

// the paper with zigzag edges, in a 120 x 170 drawing
const PAPER =
  "M0 8 L10 0 L20 8 L30 0 L40 8 L50 0 L60 8 L70 0 L80 8 L90 0 L100 8 L110 0 L120 8 " +
  "V162 L110 170 L100 162 L90 170 L80 162 L70 170 L60 162 L50 170 L40 162 L30 170 L20 162 L10 170 L0 162 Z";

// Cart page: a colorful receipt that shows the real cart total.
// It falls swinging when the page opens, then keeps swaying gently.
export function Receipt({ total, count }: ReceiptProps) {
  const ref = useRef<HTMLDivElement>(null);
  const gradientId = "receipt-" + useId().replace(/[^a-zA-Z0-9]/g, "");

  // reduce: each bar starts where the previous one ended (+ the gap)
  const bars = BARS.reduce<{ x: number; width: number }[]>((acc, width) => {
    const last = acc[acc.length - 1];
    const x = last ? last.x + last.width + BAR_GAP : 0;
    return [...acc, { x, width }];
  }, []);
  const barcodeWidth = bars[bars.length - 1].x + bars[bars.length - 1].width;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(NO_REDUCED_MOTION, () => {
        gsap.from("svg", { y: -180, rotation: -40, opacity: 0, duration: 1.1, ease: "back.out(1.6)", delay: 0.2 });
        gsap.to("svg", { rotation: 5, y: -10, duration: 2.4, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1.3 });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div className="receipt" ref={ref} aria-hidden="true">
      <span className="sparkle" />
      <span className="sparkle" />
      <span className="sparkle" />
      <svg viewBox="0 0 120 170">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#7c3aed" />
            <stop offset="0.5" stopColor="#ec4899" />
            <stop offset="1" stopColor="#f97316" />
          </linearGradient>
        </defs>

        <path d={PAPER} fill={`url(#${gradientId})`} />

        <text x="60" y="30" textAnchor="middle" className="receipt-title">
          AXON
        </text>
        <text x="60" y="41" textAnchor="middle" className="receipt-small">
          {count} {count === 1 ? "item" : "items"}
        </text>

        <line x1="12" y1="50" x2="108" y2="50" className="receipt-dash" />
        {[62, 74, 86].map((y, i) => (
          <g key={y}>
            <rect x="12" y={y - 3} width={[52, 40, 46][i]} height="5" rx="2.5" className="receipt-line" />
            <rect x="86" y={y - 3} width="22" height="5" rx="2.5" className="receipt-line" />
          </g>
        ))}
        <line x1="12" y1="98" x2="108" y2="98" className="receipt-dash" />

        <text x="12" y="116" className="receipt-small">
          TOTAL
        </text>
        <text x="108" y="117" textAnchor="end" className="receipt-total">
          {formatPrice(total)}
        </text>

        {/* barcode centered: starts at half of what is left over */}
        <g transform={`translate(${(120 - barcodeWidth) / 2} 128)`}>
          {bars.map((bar) => (
            <rect key={bar.x} x={bar.x} width={bar.width} height="22" className="receipt-bar" />
          ))}
        </g>
      </svg>
    </div>
  );
}
