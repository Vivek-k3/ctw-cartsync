"use client";
import React from "react";
import * as _Builtin from "./_Builtin";
import * as _utils from "./utils";
import _styles from "./WishlistButton.module.css";

export function WishlistButton({ as: _Component = _Builtin.DOM }) {
  return (
    <_Component
      className={_utils.cx(_styles, "wishlist-toggle")}
      id={_utils.cx(
        _styles,
        "w-node-b6348f19-e508-a2d4-884a-b82ba13ce69d-a13ce69d"
      )}
      tag="wishlist-toggle"
      slot=""
      customer-condition="logged-in"
    >
      <_Builtin.DOM
        tag="svg"
        slot=""
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <_Builtin.DOM
          tag="path"
          slot=""
          d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
        />
      </_Builtin.DOM>
      <_Builtin.HtmlEmbed
        className={_utils.cx(_styles, "custom-css")}
        value="%3Cstyle%3E%0Awishlist-toggle.is-in-wishlist%20svg%20%7B%0A%20fill%3A%20currentColor%3B%0A%7D%0A%3C%2Fstyle%3E"
      />
    </_Component>
  );
}
