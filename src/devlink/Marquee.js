"use client";
import React from "react";
import * as _Builtin from "./_Builtin";
import * as _utils from "./utils";
import _styles from "./Marquee.module.css";

export function Marquee({
  as: _Component = _Builtin.Block,
  visibility = false,
}) {
  return (
    <_Component
      className={_utils.cx(
        _styles,
        "partner_scroll-container",
        "is-responsive"
      )}
      tag="div"
    >
      <_Builtin.Block
        className={_utils.cx(_styles, "partner_marquee-mobile")}
        tag="div"
        wb-data="marquee"
        duration="20"
      >
        <_Builtin.Block
          className={_utils.cx(
            _styles,
            "partner_marquee-mobile-inner",
            "scroll"
          )}
          tag="div"
        >
          <_Builtin.Image
            className={_utils.cx(_styles, "partner_marquee-img")}
            loading="lazy"
            width="auto"
            height="auto"
            alt=""
            src="https://cdn.prod.website-files.com/684ba7d4de8e25a63f434edd/689598b10d6c2c633e5c2d00_IMG%20(1).png"
          />
          <_Builtin.Image
            className={_utils.cx(_styles, "partner_marquee-img")}
            loading="lazy"
            width="auto"
            height="auto"
            alt=""
            src="https://cdn.prod.website-files.com/684ba7d4de8e25a63f434edd/689598b177e3fb2598972efc_IMG%20(4).png"
          />
          <_Builtin.Image
            className={_utils.cx(_styles, "partner_marquee-img")}
            loading="lazy"
            width="auto"
            height="auto"
            alt=""
            src="https://cdn.prod.website-files.com/684ba7d4de8e25a63f434edd/689598b177e3fb2598972ef9_IMG%20(5).png"
          />
          <_Builtin.Image
            className={_utils.cx(_styles, "partner_marquee-img")}
            loading="lazy"
            width="auto"
            height="auto"
            alt=""
            src="https://cdn.prod.website-files.com/684ba7d4de8e25a63f434edd/689598b1b2f1e141dcbd8d79_IMG%20(2).png"
          />
          <_Builtin.Image
            className={_utils.cx(_styles, "partner_marquee-img")}
            loading="lazy"
            width="auto"
            height="auto"
            alt=""
            src="https://cdn.prod.website-files.com/684ba7d4de8e25a63f434edd/689598b1a0904a5be03fa186_IMG%20(3).png"
          />
        </_Builtin.Block>
      </_Builtin.Block>
    </_Component>
  );
}
