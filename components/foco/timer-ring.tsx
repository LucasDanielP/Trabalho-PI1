"use client";

type TimerRingProps = {
  progresso: number;
  tempo: string;
  faseLabel: string;
  cicloLabel: string;
};

const RAIO = 120;
const CIRCUNFERENCIA = 2 * Math.PI * RAIO;

export function TimerRing({
  progresso,
  tempo,
  faseLabel,
  cicloLabel,
}: TimerRingProps) {
  const offset = CIRCUNFERENCIA * (1 - Math.min(1, Math.max(0, progresso)));

  return (
    <div className="relative flex items-center justify-center">
      <svg
        className="h-72 w-72 -rotate-90 transform"
        style={{ filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.4))" }}
      >
        <defs>
          <filter id="inner-shadow">
            <feOffset dx="0" dy="5" />
            <feGaussianBlur stdDeviation="2" result="offset-blur" />
            <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
            <feFlood floodColor="black" floodOpacity="0.6" result="color" />
            <feComposite operator="in" in="color" in2="inverse" result="shadow" />
            <feComposite operator="over" in="shadow" in2="SourceGraphic" />
          </filter>
        </defs>
        <circle
          cx="144"
          cy="144"
          r={RAIO}
          stroke="#0a3f24"
          strokeWidth="16"
          fill="transparent"
        />
        <circle
          cx="144"
          cy="144"
          r={RAIO}
          stroke="#04D939"
          strokeWidth="16"
          fill="transparent"
          strokeDasharray={CIRCUNFERENCIA}
          strokeDashoffset={offset}
          strokeLinecap="round"
          filter="url(#inner-shadow)"
          className="transition-all duration-1000 ease-linear"
        />
      </svg>

      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-5xl font-semibold tracking-wide text-white tabular-nums">
          {tempo}
        </span>
        <span className="mt-2 text-sm font-medium text-[#04D939]">{faseLabel}</span>
        <span className="text-xs text-[#8fa8c4]">{cicloLabel}</span>
      </div>
    </div>
  );
}
