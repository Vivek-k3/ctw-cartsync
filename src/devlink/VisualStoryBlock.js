"use client";
import React from "react";
import * as _Builtin from "./_Builtin";
import * as _utils from "./utils";
import _styles from "./VisualStoryBlock.module.css";

export function VisualStoryBlock({
  as: _Component = _Builtin.Block,
  visualContentImage = "https://cdn.prod.website-files.com/684ba7d4de8e25a63f434edd/684f08584bbab778952f913a_PnP%20bnw-2.webp",
  aboutBlockContentContent = "",
  variant = "Aspect Ratio Auto",
  aboutBlockContentTitleHeading = "Heading",
  aboutBlockContentAboutBlockText = "—black and white photographers who view the natural world not as a subject to be documented, but as a canvas for emotion, narrative, and art. Their work moves beyond the traditional bounds of wildlife photography, focusing not on species checklists or iconic sightings, but on moments—fleeting, unstaged, and alive with meaning.",
  videoContainerVisibility = false,
  visualContentMuxPlaybackId = "AMGBrcdlgv7lK7Df401GW5hqKFBrWSKslCzxdOjtqNMQ",
}) {
  const _styleVariantMap = {
    "Aspect Ratio Auto": "",
    "Aspect Ratio 1:1": "w-variant-af3f6aff-40e8-4300-d856-30c4939e9403",
    "Aspect Ratio 16:9": "w-variant-47dfff4a-a312-8eeb-8a12-c728a4985d49",
    "Aspect Ratio 4:3": "w-variant-49bc3880-73cd-e3bf-4b5f-4239aa38872b",
    "Aspect Ratio 3:2": "w-variant-6c4b39f4-6e8f-fa69-2c3e-48d3e53b80f4",
    "With Video Block": "w-variant-9d87090b-bed0-6d23-f49e-9727eca19ae6",
  };

  const _activeStyleVariant = _styleVariantMap[variant];

  return (
    <_Component
      className={_utils.cx(_styles, "about_timeline", _activeStyleVariant)}
      tag="article"
    >
      <_Builtin.Block
        className={_utils.cx(
          _styles,
          "about_timeline-block",
          "is-content",
          _activeStyleVariant
        )}
        id={_utils.cx(
          _styles,
          "w-node-_8893668d-a72f-5412-506b-3d11e31954d9-e31954d8"
        )}
        tag="div"
      >
        <_Builtin.Block
          className={_utils.cx(
            _styles,
            "about-max-width-small",
            _activeStyleVariant
          )}
          tag="div"
        >
          <_Builtin.Heading
            className={_utils.cx(
              _styles,
              "about_timeline-heading",
              _activeStyleVariant
            )}
            tag="h4"
          >
            {aboutBlockContentTitleHeading}
          </_Builtin.Heading>
          <_Builtin.Paragraph
            className={_utils.cx(
              _styles,
              "about_timeline-text-lg",
              _activeStyleVariant
            )}
          >
            {aboutBlockContentAboutBlockText}
          </_Builtin.Paragraph>
        </_Builtin.Block>
      </_Builtin.Block>
      <_Builtin.Block
        className={_utils.cx(
          _styles,
          "about_timeline-block",
          _activeStyleVariant
        )}
        id={_utils.cx(
          _styles,
          "w-node-_8893668d-a72f-5412-506b-3d11e31954df-e31954d8"
        )}
        tag="div"
      >
        <_Builtin.Image
          className={_utils.cx(
            _styles,
            "about_timeline-img",
            _activeStyleVariant
          )}
          loading="lazy"
          width="auto"
          height="auto"
          alt=""
          src={visualContentImage}
        />
        {videoContainerVisibility ? (
          <_Builtin.Block
            className={_utils.cx(_styles, "video-wrapper", _activeStyleVariant)}
            tag="div"
          >
            <_Builtin.DOM
              className={_utils.cx(
                _styles,
                "mux-player",
                "about-player",
                _activeStyleVariant
              )}
              tag="mux-player"
              slot=""
              playback-id={visualContentMuxPlaybackId}
              muted=" "
              loop=" "
              preload="metadata"
              playsinline=" "
              stream-type=" "
              autoplay=" "
              disable-picture-in-picture=" "
              disable-remote-playback=" "
              style="pointer-events: none; --controls: none; --media-object-fit: cover;"
            />
          </_Builtin.Block>
        ) : null}
      </_Builtin.Block>
    </_Component>
  );
}
