type TimerRingProps = {
  time: string;
  progress: number;
};

export function TimerRing({ time, progress }: TimerRingProps) {
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="relative flex size-72 items-center justify-center md:size-80">
      <svg
        className="-rotate-90"
        width="100%"
        height="100%"
        viewBox="0 0 280 280"
        aria-hidden
      >
        <circle
          cx="140"
          cy="140"
          r={radius}
          fill="none"
          stroke="rgba(110,245,74,0.15)"
          strokeWidth="18"
        />
        <circle
          cx="140"
          cy="140"
          r={radius}
          fill="none"
          stroke="#6ef54a"
          strokeWidth="18"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
      <span className="absolute text-5xl font-bold tracking-widest text-foreground md:text-6xl">
        {time}
      </span>
    </div>
  );
}
