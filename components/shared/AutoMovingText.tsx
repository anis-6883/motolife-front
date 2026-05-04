"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  maxWClassName?: string;
}

export function AutoMovingText({ children, className, maxWClassName }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [duration, setDuration] = useState(10);

  useEffect(() => {
    const checkOverflow = () => {
      if (!containerRef.current || !contentRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      const contentWidth = contentRef.current.scrollWidth;

      if (contentWidth > containerWidth) {
        setShouldAnimate(true);

        const speed = 30; // px/sec
        setDuration(contentWidth / speed);
      } else {
        setShouldAnimate(false);
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [children]); // 👈 important

  return (
    <div ref={containerRef} className="relative overflow-hidden whitespace-nowrap">
      <div
        className={`flex ${maxWClassName ? maxWClassName : "w-max"} ${shouldAnimate ? "animate-marquee hover:[animation-play-state:paused]" : ""}`}
        style={shouldAnimate ? { animationDuration: `${duration}s` } : undefined}
      >
        <div ref={contentRef} className={className}>
          {children}
          {shouldAnimate && <span className="mx-2"></span>}
        </div>

        {shouldAnimate && (
          <div className={className}>
            {children}
            <span className="mx-2"></span>
          </div>
        )}
      </div>
    </div>
  );
}
