import { useEffect, useRef, useState } from "react";

function parseValue(value) {
  const input = String(value);
  const match = input.match(/-?\d[\d,]*(?:\.\d+)?/);

  if (!match) {
    return null;
  }

  const numericText = match[0];
  const startIndex = match.index ?? 0;
  const decimals = numericText.includes(".")
    ? numericText.split(".")[1].length
    : 0;

  return {
    prefix: input.slice(0, startIndex),
    suffix: input.slice(startIndex + numericText.length),
    value: Number(numericText.replace(/,/g, "")),
    decimals,
  };
}

function formatValue(value, parsed) {
  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: parsed.decimals,
    maximumFractionDigits: parsed.decimals,
  });

  return `${parsed.prefix}${formatter.format(value)}${parsed.suffix}`;
}

export default function AnimatedCount({
  value,
  as: Component = "span",
  className = "",
  duration = 1.6,
  start = 0,
  isActive,
}) {
  const ref = useRef(null);
  const [hasEnteredView, setHasEnteredView] = useState(false);
  const [displayValue, setDisplayValue] = useState(() => {
    const parsed = parseValue(value);
    return parsed ? formatValue(start, parsed) : String(value);
  });
  const shouldAnimate = typeof isActive === "boolean" ? isActive : hasEnteredView;

  useEffect(() => {
    const element = ref.current;

    if (!element || hasEnteredView || typeof isActive === "boolean") {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEnteredView(true);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [hasEnteredView, isActive]);

  useEffect(() => {
    const parsed = parseValue(value);

    if (!parsed) {
      setDisplayValue(String(value));
      return undefined;
    }

    if (!shouldAnimate) {
      setDisplayValue(formatValue(start, parsed));
      return undefined;
    }

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setDisplayValue(String(value));
      return undefined;
    }

    const targetValue = parsed.value;
    const startValue = start;
    const totalChange = targetValue - startValue;
    const startTime = performance.now();
    let frameId = 0;

    const tick = (currentTime) => {
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const nextValue = startValue + totalChange * easedProgress;
      const roundedValue =
        parsed.decimals > 0
          ? Number(nextValue.toFixed(parsed.decimals))
          : Math.round(nextValue);

      setDisplayValue(formatValue(roundedValue, parsed));

      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick);
        return;
      }

      setDisplayValue(String(value));
    };

    frameId = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(frameId);
  }, [duration, shouldAnimate, start, value]);

  return (
    <Component ref={ref} className={className}>
      {displayValue}
    </Component>
  );
}
