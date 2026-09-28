import { useEffect, useRef } from "react";

/**
 * Adds an IntersectionObserver-driven "reveal" class to a set of elements.
 * Usage: const containerRef = useScrollReveal(); attach to a wrapper,
 * then give children the className "reveal".
 */
export default function useScrollReveal(deps = []) {
  const containerRef = useRef(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return undefined;

    const targets = root.querySelectorAll(".reveal");
    if (!targets.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return containerRef;
}
