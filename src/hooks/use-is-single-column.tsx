import * as React from "react";

const SINGLE_COLUMN_BREAKPOINT = 448; // Tailwind conatiner sm breakpoint - matches @container @sm:grid-cols-2

export function useIsSingleColumn(containerRef?: React.RefObject<HTMLElement>) {
  const [isSingleColumn, setIsSingleColumn] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    // If no container ref provided, fall back to viewport-based detection
    if (!containerRef?.current) {
      const checkScreenSize = () => {
        setIsSingleColumn(window.innerWidth < SINGLE_COLUMN_BREAKPOINT);
      };

      checkScreenSize();
      window.addEventListener('resize', checkScreenSize);
      return () => window.removeEventListener('resize', checkScreenSize);
    }

    // Use ResizeObserver for container-based detection
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        setIsSingleColumn(width < SINGLE_COLUMN_BREAKPOINT);
      }
    });

    resizeObserver.observe(containerRef.current);
    
    return () => {
      resizeObserver.disconnect();
    };
  }, [containerRef]);

  return !!isSingleColumn;
}
