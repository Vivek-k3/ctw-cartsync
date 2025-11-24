import * as React from "react";
import * as Types from "./types";

declare function ShopFooter(props: {
  as?: React.ElementType;
  /** Show/Hide the product information FAQs*/
  stickyFooterFaQsFooterFaqVisibility?: Types.Visibility.VisibilityConditions;
}): React.JSX.Element;
