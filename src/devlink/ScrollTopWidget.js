"use client";
import React from "react";
import * as _Builtin from "./_Builtin";
import * as _utils from "./utils";
import _styles from "./ScrollTopWidget.module.css";

export function ScrollTopWidget({ as: _Component = _Builtin.Link }) {
  return (
    <_Component
      className={_utils.cx(_styles, "site_scroll-to-top")}
      button={false}
      block="inline"
      options={{
        href: "#",
      }}
    >
      <_Builtin.DOM
        className={_utils.cx(_styles, "icon-1x1-medium")}
        tag="svg"
        slot=""
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        viewBox="0 0 24 24"
        fill="none"
      >
        <_Builtin.DOM tag="g" slot="" clip-path="url(#clip0_227_202)">
          <_Builtin.DOM
            tag="path"
            slot=""
            d="M4 12L5.41 13.41L11 7.83V20H13V7.83L18.58 13.42L20 12L12 4L4 12Z"
            fill="currentColor"
          />
        </_Builtin.DOM>
      </_Builtin.DOM>
    </_Component>
  );
}
