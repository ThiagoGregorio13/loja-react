import type { ComponentProps, MouseEvent } from "react";
import { Link } from "react-router";
import { useTransitionNavigate } from "../animations/useTransitionNavigate";

// A normal <Link>, but the page change goes through the View Transitions API
// (the curtain effect is in index.css, under "Page transitions").
export function TransitionLink({ to, onClick, ...props }: ComponentProps<typeof Link>) {
  const navigate = useTransitionNavigate();

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e);
    // Ctrl/Cmd+click, middle click, etc. keep the browser default (open in a new tab)
    const isPlainClick = e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
    if (e.defaultPrevented || !isPlainClick) return;
    e.preventDefault();
    navigate(to);
  }

  return <Link to={to} onClick={handleClick} {...props} />;
}
