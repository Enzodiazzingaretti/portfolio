import { useEffect, useState } from "react";

export default function PageEnter() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 950);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="page-enter-overlay fixed inset-0 z-[200] pointer-events-none"
      aria-hidden="true"
    />
  );
}
