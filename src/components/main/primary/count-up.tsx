'use client';

import { useState, useEffect, useRef } from "react";

interface CountUpProps {
    /** The starting number for the count up. */
    start: number;
    /** The ending number for the count up. */
    end: number;
    /** The duration of the count up animation in seconds */
    duration: number;
    /** Optional flag to start the count up when the component is in view. */
    startOnView?: boolean;
}

/**
 * A React component that animates a number counting up from a start value to an end value over a specified duration.
 * The animation can optionally start when the component comes into view if `props.startOnView` is set to `true`.
 *
 * @returns {JSX.Element} The rendered component displaying the animated number.
 */
export function CountUp({ start, end, duration, startOnView }: Readonly<CountUpProps>): JSX.Element {
    const [number, setNumber] = useState(start);
    const elementRef = useRef<HTMLDivElement>(null);
    const [hasStarted, setHasStarted] = useState(!startOnView);

    useEffect(() => {
        if (!startOnView) {
            setHasStarted(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setHasStarted(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => observer.disconnect();
    }, [startOnView]);

    useEffect(() => {
        if (!hasStarted) return;

        const increment = (end - start) / (duration * 1000 / 100);
        const interval = setInterval(() => {
            setNumber(prev => {
                if (prev >= end) {
                    clearInterval(interval);
                    return end;
                }
                return prev + increment;
            });
        }, 100);

        return () => clearInterval(interval);
    }, [start, end, duration, hasStarted]);

    return <span ref={elementRef}>{number.toFixed(0)}</span>;
}