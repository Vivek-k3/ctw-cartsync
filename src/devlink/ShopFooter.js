"use client";
import React from "react";
import * as _Builtin from "./_Builtin";
import { StickyFooterFaQs } from "./StickyFooterFaQs";
import { FooterSubPages } from "./FooterSubPages";
import * as _utils from "./utils";
import _styles from "./ShopFooter.module.css";

export function ShopFooter({
  as: _Component = _Builtin.Block,
  stickyFooterFaQsFooterFaqVisibility = true,
}) {
  return (
    <_Component className={_utils.cx(_styles, "footer")} tag="div">
      <StickyFooterFaQs
        footerFaqVisibility={stickyFooterFaQsFooterFaqVisibility}
      />
      <FooterSubPages variant="No Top Padding" />
    </_Component>
  );
}
