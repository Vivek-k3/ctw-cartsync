"use client";
import React from "react";
import * as _Builtin from "./_Builtin";
import * as _utils from "./utils";
import _styles from "./FooterSubPages.module.css";

export function FooterSubPages({
  as: _Component = _Builtin.Block,
  variant = "Base",

  footerLinksTCLink = {
    href: "#",
    preload: "prefetch",
  },

  footerLinksPrivacyPolicy = {
    href: "#",
    preload: "prefetch",
  },

  footerTextCopyrightText = "© 2025 . All rights reserved.",
}) {
  const _styleVariantMap = {
    Base: "",
    "No Top Padding": "w-variant-96bcb39c-66f4-b471-224c-65adce83ec18",
  };

  const _activeStyleVariant = _styleVariantMap[variant];

  return (
    <_Component
      className={_utils.cx(_styles, "footer", _activeStyleVariant)}
      tag="div"
    >
      <_Builtin.Block
        className={_utils.cx(_styles, "footer_sticky-top", _activeStyleVariant)}
        tag="div"
      >
        <_Builtin.Block
          className={_utils.cx(_styles, "padding-global", _activeStyleVariant)}
          tag="div"
        >
          <_Builtin.Block
            className={_utils.cx(
              _styles,
              "container-large",
              _activeStyleVariant
            )}
            tag="div"
          >
            <_Builtin.Block
              className={_utils.cx(
                _styles,
                "footer_sticky-inner",
                "is-sub-footer",
                _activeStyleVariant
              )}
              tag="div"
            >
              <_Builtin.Block
                className={_utils.cx(
                  _styles,
                  "footer_sticky-note",
                  _activeStyleVariant
                )}
                tag="div"
              >
                <_Builtin.Block tag="div">
                  {"© "}
                  <_Builtin.Span
                    className={_utils.cx(
                      _styles,
                      "span_year",
                      _activeStyleVariant
                    )}
                    id="spanYear"
                  >
                    {"2025"}
                  </_Builtin.Span>
                  {", Composing the Wild. All rights reserved."}
                </_Builtin.Block>
              </_Builtin.Block>
              <_Builtin.Block
                className={_utils.cx(
                  _styles,
                  "footer_nav-links",
                  _activeStyleVariant
                )}
                tag="div"
              >
                <_Builtin.Link
                  className={_utils.cx(
                    _styles,
                    "footer_nav-link",
                    _activeStyleVariant
                  )}
                  button={false}
                  block=""
                  options={{
                    href: "#",
                  }}
                >
                  {"Privacy policy"}
                </_Builtin.Link>
              </_Builtin.Block>
            </_Builtin.Block>
          </_Builtin.Block>
        </_Builtin.Block>
      </_Builtin.Block>
    </_Component>
  );
}
