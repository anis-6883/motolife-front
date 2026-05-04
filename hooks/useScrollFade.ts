import { useEffect, useRef, useState } from "react";

interface UseScrollFadeOptions {
  bottomOffset?: number;
}

export function useScrollFade<T extends HTMLElement>(options: UseScrollFadeOptions = {}) {
  const { bottomOffset = 40 } = options;

  const scrollRef = useRef<T | null>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;

    setIsAtBottom(distanceFromBottom <= bottomOffset);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const distanceFromBottom = el.scrollHeight - el.clientHeight;

    setIsAtBottom(distanceFromBottom <= bottomOffset);
  }, [bottomOffset]);

  return {
    scrollRef,
    isAtBottom,
    handleScroll,
  };
}
