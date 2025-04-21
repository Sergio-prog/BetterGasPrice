import React, { useEffect, useRef, useState } from 'react';
import '../app/globals.css';
import { cn } from '../lib/utils';

// interface PulseTextProps {
//     value: string;
//     className: string;
//     children: React.Component;
// }

interface CustomPulseTextProps {
    useSpan?: boolean;
} 

type PulseTextProps = React.HTMLAttributes<HTMLParagraphElement> & React.PropsWithChildren & CustomPulseTextProps;

export default function PulseText({ className, children, useSpan = false, ...props }: PulseTextProps) {
  const [pulse, setPulse] = useState(false);
  const prevValue = useRef(children);

  useEffect(() => {
    if (prevValue.current?.toString() !== children?.toString()) {
      setPulse(true);
      const timeout = setTimeout(() => setPulse(false), 500);
      prevValue.current = children;
      return () => clearTimeout(timeout);
    }
  }, [children]);

  return (
    <span {...props} className={cn(pulse ? 'subtle-pulse' : '', className)}>
      {children}
    </span>
  );
}
