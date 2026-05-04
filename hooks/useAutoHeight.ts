import { RefObject, useEffect, useRef, useState } from "react";

interface UseAutoHeightOptions {
  /**
   * Additional padding/margin to subtract from calculated height (in pixels)
   */
  offset?: number;
  /**
   * Refs of sibling elements whose heights should be excluded
   */
  excludeRefs?: RefObject<HTMLElement>[];
  /**
   * Debounce delay for resize observer (in ms)
   */
  debounceDelay?: number;
}

export function useAutoHeight<T extends HTMLElement>(options: UseAutoHeightOptions = {}) {
  const { offset = 0, excludeRefs = [], debounceDelay = 100 } = options;

  const containerRef = useRef<T | null>(null);
  const [calculatedHeight, setCalculatedHeight] = useState<number>(0);

  useEffect(() => {
    const calculateHeight = () => {
      if (!containerRef.current) return;

      // Get all sibling elements
      const parent = containerRef.current.parentElement;
      if (!parent) return;

      let occupiedHeight = 0;

      // Calculate height of all siblings (excluding our container)
      Array.from(parent.children).forEach((child) => {
        if (child !== containerRef.current) {
          const rect = child.getBoundingClientRect();
          const styles = window.getComputedStyle(child);
          const marginTop = parseFloat(styles.marginTop);
          const marginBottom = parseFloat(styles.marginBottom);
          occupiedHeight += rect.height + marginTop + marginBottom;
        }
      });

      // Add heights from excludeRefs
      excludeRefs.forEach((ref) => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          const styles = window.getComputedStyle(ref.current);
          const marginTop = parseFloat(styles.marginTop);
          const marginBottom = parseFloat(styles.marginBottom);
          occupiedHeight += rect.height + marginTop + marginBottom;
        }
      });

      // Get parent's padding
      const parentStyles = window.getComputedStyle(parent);
      const parentPaddingTop = parseFloat(parentStyles.paddingTop);
      const parentPaddingBottom = parseFloat(parentStyles.paddingBottom);
      occupiedHeight += parentPaddingTop + parentPaddingBottom;

      // Calculate available height
      const viewportHeight = window.innerHeight;
      const availableHeight = viewportHeight - occupiedHeight - offset;

      setCalculatedHeight(Math.max(0, availableHeight));
    };

    // Debounced resize handler
    let timeoutId: NodeJS.Timeout;
    const debouncedCalculate = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(calculateHeight, debounceDelay);
    };

    // Initial calculation
    calculateHeight();

    // Setup ResizeObserver for parent and siblings
    const resizeObserver = new ResizeObserver(debouncedCalculate);

    if (containerRef.current?.parentElement) {
      resizeObserver.observe(containerRef.current.parentElement);

      Array.from(containerRef.current.parentElement.children).forEach((child) => {
        if (child !== containerRef.current) {
          resizeObserver.observe(child);
        }
      });
    }

    // Observe excluded refs
    excludeRefs.forEach((ref) => {
      if (ref.current) {
        resizeObserver.observe(ref.current);
      }
    });

    // Listen to window resize
    window.addEventListener("resize", debouncedCalculate);

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
      window.removeEventListener("resize", debouncedCalculate);
    };
  }, [offset, excludeRefs, debounceDelay]);

  return {
    containerRef,
    calculatedHeight,
    heightStyle: calculatedHeight > 0 ? `${calculatedHeight}px` : "auto",
  };
}
