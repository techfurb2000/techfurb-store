"use client";

import { useEffect } from "react";

type AdBannerProps = {
  dataAdSlot: string;
  dataAdFormat: string;
  dataFullWidthResponsive: boolean;
};

export default function AdBanner({
  dataAdSlot,
  dataAdFormat,
  dataFullWidthResponsive,
}: AdBannerProps) {
  const isDev = process.env.NODE_ENV === "development";

  useEffect(() => {
    if (isDev) return;
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (error) {
      console.error("AdSense error:", error);
    }
  }, [isDev]);

  if (isDev) {
    return (
      <div className="w-full flex justify-center py-4 my-2">
        <div className="w-full max-w-[728px] h-[90px] bg-muted/50 border-2 border-dashed border-muted-foreground/30 flex items-center justify-center rounded-lg text-muted-foreground text-sm font-medium">
          Advertisement Placeholder (Slot: {dataAdSlot})
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden flex justify-center py-4 bg-muted/20">
      <ins
        className="adsbygoogle"
        style={{ display: "block", minWidth: "250px", minHeight: "90px" }}
        data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID}
        data-ad-slot={dataAdSlot}
        data-ad-format={dataAdFormat}
        data-full-width-responsive={dataFullWidthResponsive.toString()}
      />
    </div>
  );
}
