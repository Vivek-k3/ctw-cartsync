import * as React from "react";
import * as Types from "./types";

declare function VisualStoryBlock(props: {
  as?: React.ElementType;
  visualContentImage?: Types.Asset.Image;
  aboutBlockContentContent?: Types.Basic.RichTextChildren;
  variant?:
    | "Aspect Ratio Auto"
    | "Aspect Ratio 1:1"
    | "Aspect Ratio 16:9"
    | "Aspect Ratio 4:3"
    | "Aspect Ratio 3:2"
    | "With Video Block";
  aboutBlockContentTitleHeading?: React.ReactNode;
  aboutBlockContentAboutBlockText?: React.ReactNode;
  videoContainerVisibility?: Types.Visibility.VisibilityConditions;
  visualContentMuxPlaybackId?: Types.Builtin.Text;
}): React.JSX.Element;
