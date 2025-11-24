import * as React from "react";
import * as Types from "./types";

declare function Navbar(props: {
  as?: React.ElementType;
  variant?: "Base" | "Light";
  shopElementVisibility?: Types.Visibility.VisibilityConditions;
  navbarNavElementVisibility?: Types.Visibility.VisibilityConditions;
}): React.JSX.Element;
