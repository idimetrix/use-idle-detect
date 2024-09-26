import { useState, useEffect, useRef } from "react";

interface IdleDetector extends EventTarget {
  start: (options: { threshold: number }) => Promise<void>;
  stop: () => void;
  onchange: ((this: IdleDetector, ev: Event) => any) | null;
  userState: "active" | "idle";
  screenState: "locked" | "unlocked";
}

// Extend the global Window interface to include IdleDetector
declare global {
  interface Window {
    IdleDetector: {
      new (): IdleDetector;
    };
  }
}

interface UseIdleDetectOptions {
  timeout?: number; // Time in ms after which the user is considered idle
  events?: string[]; // Events to track user activity
  useIdleAPI?: boolean; // Use Idle Detection API if supported
  onIdle?: () => void; // Callback when user becomes idle
  onActive?: () => void; // Callback when user becomes active
}

export function useIdleDetect({
  timeout = 3000,
  events = ["mousemove", "keydown", "mousedown", "touchstart"],
  useIdleAPI = false,
  onIdle,
  onActive,
}: UseIdleDetectOptions = {}): boolean {
  const [isIdle, setIsIdle] = useState<boolean>(false);
  const timeoutRef = useRef<number | null>(null);

  const resetIdleTimer = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    setIsIdle(false);
    onActive && onActive(); // Trigger onActive callback if provided
    timeoutRef.current = window.setTimeout(() => {
      setIsIdle(true);
      onIdle && onIdle(); // Trigger onIdle callback if provided
    }, timeout);
  };

  useEffect(() => {
    // If Idle Detection API is supported and enabled, use it
    if (useIdleAPI && "IdleDetector" in window && window.IdleDetector) {
      let idleDetector: IdleDetector;

      (async () => {
        try {
          idleDetector = new window.IdleDetector();
          await idleDetector.start({ threshold: timeout });

          idleDetector.onchange = () => {
            const { userState } = idleDetector;
            if (userState === "idle") {
              setIsIdle(true);
              onIdle && onIdle();
            } else {
              setIsIdle(false);
              onActive && onActive();
            }
          };
        } catch (error) {
          console.error("Idle Detection API error:", error);
        }
      })();

      return () => {
        idleDetector?.stop();
      };
    }

    // Fallback to manual event tracking if Idle Detection API is not used or supported
    events.forEach((event) => {
      window.addEventListener(event, resetIdleTimer);
    });

    resetIdleTimer();

    // Cleanup event listeners and timeout on unmount
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, resetIdleTimer);
      });
    };
  }, [events, timeout, useIdleAPI, onIdle, onActive]);

  return isIdle;
}
