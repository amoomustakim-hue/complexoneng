export default function WaveBackground() {
  const waveLayers = [
    { d: "M0,0 C230,0 265,220 195,370 C130,510 260,680 195,840 C160,940 80,990 0,1000 Z", fill: "#5BBBFF", opacity: 0.07 },
    { d: "M0,0 C185,0 215,220 148,370 C88,510 205,680 148,840 C118,940 58,990 0,1000 Z",  fill: "#1A4DAB", opacity: 0.09 },
    { d: "M0,0 C140,0 165,220 105,370 C52,510 155,680 105,840 C80,940 38,990 0,1000 Z",  fill: "#0F2B6B", opacity: 0.11 },
    { d: "M0,0 C95,0 115,220 65,370 C22,510 105,680 65,840 C48,940 20,990 0,1000 Z",    fill: "#0F2B6B", opacity: 0.14 },
    { d: "M0,0 C48,0 60,220 28,370 C6,510 48,680 26,840 C18,940 7,990 0,1000 Z",        fill: "#071540", opacity: 0.18 },
  ];

  const waveSvg = (
    <svg viewBox="0 0 265 1000" className="h-full w-full" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      {waveLayers.map((l, i) => (
        <path key={i} d={l.d} fill={l.fill} fillOpacity={l.opacity} />
      ))}
    </svg>
  );

  return (
    <div className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden" aria-hidden>

      {/* ── Gradient: cream → navy blue, fading in from 50% down ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, transparent 45%, rgba(15,43,107,0.05) 65%, rgba(15,43,107,0.14) 85%, rgba(7,21,64,0.22) 100%)",
        }}
      />

      {/* ── Film-grain noise overlay ── */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          <filter id="grain" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.72"
              numOctaves="4"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
        {/* overlay blend lets grain vanish on white, appear on blue */}
        <rect
          width="100%"
          height="100%"
          filter="url(#grain)"
          style={{ mixBlendMode: "overlay" } as React.CSSProperties}
          opacity="0.28"
        />
      </svg>

      {/* ── Side waves (desktop only) ── */}
      <div className="absolute left-0 top-0 h-full hidden lg:block w-36 xl:w-52">
        {waveSvg}
      </div>
      <div
        className="absolute right-0 top-0 h-full hidden lg:block w-36 xl:w-52"
        style={{ transform: "scaleX(-1)" }}
      >
        {waveSvg}
      </div>
    </div>
  );
}
