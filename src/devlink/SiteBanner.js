"use client";
import React from "react";
import * as _Builtin from "./_Builtin";
import * as _utils from "./utils";
import _styles from "./SiteBanner.module.css";

export function SiteBanner({
  as: _Component = _Builtin.Block,
  slot,
  bannerText = "Learn about how each art print supports conservation efforts.",

  bannerCta = {
    href: "#",
    target: "_blank",
  },

  bannerButtonText = "Learn more",
}) {
  return (
    <_Component className={_utils.cx(_styles, "site_banner")} tag="article">
      <_Builtin.Block
        className={_utils.cx(_styles, "site_banner-content")}
        tag="div"
      >
        <_Builtin.NotSupported _atom="Slot" />
        <_Builtin.Block tag="div">{bannerText}</_Builtin.Block>
      </_Builtin.Block>
      <_Builtin.Link
        className={_utils.cx(_styles, "button", "is-small")}
        button={true}
        block=""
        options={bannerCta}
      >
        {bannerButtonText}
      </_Builtin.Link>
    </_Component>
  );
}
