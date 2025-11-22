"use client";

import { useEffect } from "react";

type Props = {
  behavior?: ScrollBehavior;
};

export default function ScrollToTop({ behavior = "auto" }: Props) {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior });
  }, [behavior]);

  return null;
}
