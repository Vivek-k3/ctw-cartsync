"use client";
import React from "react";
import * as _Builtin from "./_Builtin";
import * as _utils from "./utils";
import _styles from "./ProductAward.module.css";

export function ProductAward({
  as: _Component = _Builtin.Link,

  awards1Link = {
    href: "#",
    target: "_blank",
    preload: "prefetch",
  },

  awards1Logo = "",
}) {
  return (
    <_Component
      className={_utils.cx(_styles, "shop_product-award-wrap")}
      id={_utils.cx(
        _styles,
        "w-node-bdbd8515-67b1-a0db-f2ba-d07c812de1ae-812de1ae"
      )}
      button={false}
      block="inline"
      options={awards1Link}
    >
      <_Builtin.Image
        className={_utils.cx(_styles, "shop_award-o")}
        width="auto"
        height="auto"
        loading="lazy"
        alt=""
        src={awards1Logo}
      />
    </_Component>
  );
}
