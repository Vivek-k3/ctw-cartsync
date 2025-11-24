"use client";
import React from "react";
import * as _Builtin from "./_Builtin";
import * as _utils from "./utils";
import _styles from "./Loader.module.css";

export function Loader({ as: _Component = _Builtin.Block }) {
  return (
    <_Component
      className={_utils.cx(_styles, "transition")}
      tag="div"
      id="transition"
    >
      <_Builtin.Block
        className={_utils.cx(_styles, "transition-sweeper")}
        tag="div"
        id="transition-sweep"
      />
      <_Builtin.Image
        className={_utils.cx(_styles, "nav_logo", "is-loader")}
        loading="lazy"
        width="auto"
        height="auto"
        id="transition-logo"
        alt=""
        src="https://cdn.prod.website-files.com/684ba7d4de8e25a63f434edd/685524e5e2a805a48bdbe4f6_5161cb0251d6166598af8e741b5275cb_main-logo.svg"
      />
    </_Component>
  );
}
