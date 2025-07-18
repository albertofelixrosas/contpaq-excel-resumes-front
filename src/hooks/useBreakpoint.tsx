import { useEffect, useState } from "react";

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg';

export function useBreakpoint() {
  const getBreakpoint = (): Breakpoint => {
    const width = window.innerWidth;
    if (width < 576) return 'xs';
    if (width >= 576 && width < 768) return 'sm';
    if (width >= 768 && width < 992) return 'md';
    return 'lg';
  };

  const [breakpoint, setBreakpoint] = useState<Breakpoint>(getBreakpoint());

  useEffect(() => {
    const onResize = () => {
      setBreakpoint(getBreakpoint());
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return breakpoint;
}
