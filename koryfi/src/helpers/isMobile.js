import React, { useState } from "react";

export function IsMobile() {
  const mobileSize = window.matchMedia("(max-width: 767px)");
  const [matches, setMatches] = useState(mobileSize.matches);

  React.useEffect(() => {
    const handleResize = () => setMatches(mobileSize.matches);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return matches;
}
