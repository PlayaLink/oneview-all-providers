import * as React from "react";

const SINGLE_COLUMN_BREAKPOINT = 640; // Tailwind sm breakpoint

export function useIsSingleColumn() {
  const [isSingleColumn, setIsSingleColumn] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    const checkScreenSize = () => {
      // Tailwind sm breakpoint is 640px, so single column is < 640px
      setIsSingleColumn(window.innerWidth < SINGLE_COLUMN_BREAKPOINT);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return !!isSingleColumn;
}
