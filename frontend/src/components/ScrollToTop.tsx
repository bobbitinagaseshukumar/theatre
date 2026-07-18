import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Resets scroll to the top whenever the route (pathname) changes.
 * Without this, React Router preserves the previous scroll position, so
 * navigating from the footer lands you at the bottom of the next page.
 */
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Jump instantly (ignore the global smooth-scroll so it doesn't animate a long scroll)
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
