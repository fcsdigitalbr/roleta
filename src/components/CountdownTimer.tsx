import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

const DURATION = 15 * 60; // 15 minutes in seconds

function getSecondsLeft() {
  const stored = sessionStorage.getItem("countdown_start");
  const start = stored ? Number(stored) : Date.now();
  if (!stored) sessionStorage.setItem("countdown_start", String(start));
  const elapsed = Math.floor((Date.now() - start) / 1000);
  return Math.max(0, DURATION - elapsed);
}

const CountdownTimer = () => {
  const [seconds, setSeconds] = useState(getSecondsLeft);

  useEffect(() => {
    const id = setInterval(() => {
      const left = getSecondsLeft();
      setSeconds(left);
      if (left <= 0) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const urgent = seconds < 120;

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-md transition-colors ${
      urgent 
        ? "border-destructive/50 bg-destructive/10 text-destructive" 
        : "border-accent/30 bg-card/60 text-accent"
    }`}>
      <Clock className="w-4 h-4" />
      <span className="font-mono font-bold text-sm tabular-nums">
        {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
      </span>
      <span className="text-xs font-semibold uppercase tracking-wider">
        restante
      </span>
    </div>
  );
};

export default CountdownTimer;
