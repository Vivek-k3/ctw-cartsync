import * as React from "react";
import * as Types from "./types";

declare function FooterSubPages(props: {
  as?: React.ElementType;
  variant?: "Base" | "No Top Padding";
  footerLinksTCLink?: Types.Basic.Link;
  footerLinksPrivacyPolicy?: Types.Basic.Link;
  footerTextCopyrightText?: React.ReactNode;
}): React.JSX.Element;
