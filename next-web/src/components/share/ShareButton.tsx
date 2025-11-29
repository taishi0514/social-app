"use client";

import { useCallback, useMemo } from "react";
import { Button } from "@mantine/core";

type ShareToXButtonProps = {
  text: string;
  url: string;
};

const XIcon = () => (
  <svg
    aria-hidden="true"
    width={16}
    height={16}
    viewBox="0 0 1200 1227"
    role="img"
  >
    <path
      fill="currentColor"
      d="M714 519 1160 0H992L674 365 430 0H0l464 681L0 1226h168l336-382 260 382h430z"
    />
  </svg>
);

export function ShareToXButton({ text, url }: ShareToXButtonProps) {
  const intentUrl = useMemo(() => {
    const shareUrl = new URL("https://twitter.com/intent/tweet");
    if (text) shareUrl.searchParams.set("text", text);
    if (url) shareUrl.searchParams.set("url", url);
    return shareUrl.toString();
  }, [text, url]);

  const handleShare = useCallback(async () => {
    if (!url) return;

    window.open(intentUrl, "_blank", "noopener,noreferrer");
  }, [intentUrl, url]);

  return (
    <Button
      onClick={handleShare}
      leftSection={<XIcon />}
      variant="outline"
      color="dark"
      radius="xl"
      disabled={!url}
    >
      Xでシェア
    </Button>
  );
}
