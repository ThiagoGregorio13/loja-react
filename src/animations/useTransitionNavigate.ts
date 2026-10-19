import { flushSync } from "react-dom";
import { useNavigate, type To } from "react-router";
import { prefersReducedMotion } from "./gsap";

// navigate() wrapped in document.startViewTransition():
// the browser takes a "photo" of the old page, React renders the new one,
// and the CSS animates from one to the other.
export function useTransitionNavigate() {
  const navigate = useNavigate();

  return (to: To) => {
    if (!document.startViewTransition || prefersReducedMotion()) {
      navigate(to);
      return;
    }
    // flushSync forces React to render NOW, so the browser photographs the new page (not the old one again)
    document.startViewTransition(() => flushSync(() => navigate(to)));
  };
}
