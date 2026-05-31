import React, { useEffect, useRef, useState } from 'react';
import { cn } from '~/lib/utils';

type PulseTextProps = React.HTMLAttributes<HTMLSpanElement> & React.PropsWithChildren;

export default function PulseText({ className, children, ...props }: PulseTextProps) {
  const [pulse, setPulse] = useState(false);
  const prevValue = useRef(children);

  useEffect(() => {
    if (prevValue.current?.toString() !== children?.toString()) {
      setPulse(true);
      const timeout = setTimeout(() => setPulse(false), 700);
      prevValue.current = children;
      return () => clearTimeout(timeout);
    }
  }, [children]);

  return (
    <span
      {...props}
      className={cn(
        'inline-block transition-all duration-500 ease-out',
        pulse
          ? 'text-white scale-105 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]'
          : 'text-white/70 scale-100',
        className
      )}
    >
      {children}
    </span>
  );
}
