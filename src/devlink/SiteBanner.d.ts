import * as React from "react";
import * as Types from "./types";

declare function SiteBanner(props: {
  as?: React.ElementType;
  slot?: Types.Slots.SlotContent;
  bannerText?: React.ReactNode;
  bannerCta?: Types.Basic.Link;
  bannerButtonText?: React.ReactNode;
}): React.JSX.Element;
