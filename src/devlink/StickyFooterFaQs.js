"use client";
import React from "react";
import * as _Builtin from "./_Builtin";
import * as _interactions from "./interactions";
import * as _utils from "./utils";
import _styles from "./StickyFooterFaQs.module.css";

const _interactionsData = JSON.parse(
  '{"events":{"e-3":{"id":"e-3","name":"","animationType":"custom","eventTypeId":"MOUSE_CLICK","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-8","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-4"}},"mediaQueries":["main","medium","small","tiny"],"target":{"selector":".fs_accordion-1_header","originalId":"4cf3bdb3-4030-41f6-a126-c01e136bfc84","appliesTo":"CLASS"},"targets":[{"selector":".fs_accordion-1_header","originalId":"4cf3bdb3-4030-41f6-a126-c01e136bfc84","appliesTo":"CLASS"}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1667593479296},"e-4":{"id":"e-4","name":"","animationType":"custom","eventTypeId":"MOUSE_SECOND_CLICK","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-9","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-3"}},"mediaQueries":["main","medium","small","tiny"],"target":{"selector":".fs_accordion-1_header","originalId":"4cf3bdb3-4030-41f6-a126-c01e136bfc84","appliesTo":"CLASS"},"targets":[{"selector":".fs_accordion-1_header","originalId":"4cf3bdb3-4030-41f6-a126-c01e136bfc84","appliesTo":"CLASS"}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1667593479296}},"actionLists":{"a-8":{"id":"a-8","title":"Accordion 1 - Content open","actionItemGroups":[{"actionItems":[{"id":"a-8-n","actionTypeId":"STYLE_SIZE","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"SIBLINGS","selector":".fs_accordion-1_content","selectorGuids":["499d8a7f-344d-ec43-a924-1ffd26401b31"]},"widthValue":100,"heightValue":0,"widthUnit":"%","heightUnit":"rem","locked":false}},{"id":"a-8-n-2","actionTypeId":"GENERAL_DISPLAY","config":{"delay":0,"easing":"","duration":0,"target":{"useEventTarget":"SIBLINGS","selector":".fs_accordion-1_content","selectorGuids":["499d8a7f-344d-ec43-a924-1ffd26401b31"]},"value":"none"}}]},{"actionItems":[{"id":"a-8-n-3","actionTypeId":"GENERAL_DISPLAY","config":{"delay":0,"easing":"","duration":0,"target":{"useEventTarget":"SIBLINGS","selector":".fs_accordion-1_content","selectorGuids":["499d8a7f-344d-ec43-a924-1ffd26401b31"]},"value":"block"}}]},{"actionItems":[{"id":"a-8-n-4","actionTypeId":"STYLE_SIZE","config":{"delay":0,"easing":"","duration":250,"target":{"useEventTarget":"SIBLINGS","selector":".fs_accordion-1_content","selectorGuids":["499d8a7f-344d-ec43-a924-1ffd26401b31"]},"widthValue":100,"widthUnit":"%","heightUnit":"AUTO","locked":false}},{"id":"a-8-n-5","actionTypeId":"TRANSFORM_ROTATE","config":{"delay":0,"easing":"","duration":250,"target":{"useEventTarget":"CHILDREN","selector":".fs_accordion-1_icon","selectorGuids":["499d8a7f-344d-ec43-a924-1ffd26401b2c"]},"zValue":180,"xUnit":"DEG","yUnit":"DEG","zUnit":"deg"}}]}],"useFirstGroupAsInitialState":true,"createdOn":1663934233644},"a-9":{"id":"a-9","title":"Accordion 1 - Content close","actionItemGroups":[{"actionItems":[{"id":"a-9-n","actionTypeId":"STYLE_SIZE","config":{"delay":0,"easing":"","duration":250,"target":{"useEventTarget":"SIBLINGS","selector":".fs_accordion-1_content","selectorGuids":["499d8a7f-344d-ec43-a924-1ffd26401b31"]},"widthValue":100,"heightValue":0,"widthUnit":"%","heightUnit":"px","locked":false}},{"id":"a-9-n-2","actionTypeId":"TRANSFORM_ROTATE","config":{"delay":0,"easing":"","duration":250,"target":{"useEventTarget":"CHILDREN","selector":".fs_accordion-1_icon","selectorGuids":["499d8a7f-344d-ec43-a924-1ffd26401b2c"]},"zValue":0,"xUnit":"DEG","yUnit":"DEG","zUnit":"deg"}}]},{"actionItems":[{"id":"a-9-n-3","actionTypeId":"GENERAL_DISPLAY","config":{"delay":0,"easing":"","duration":0,"target":{"useEventTarget":"SIBLINGS","selector":".fs_accordion-1_content","selectorGuids":["499d8a7f-344d-ec43-a924-1ffd26401b31"]},"value":"none"}}]}],"useFirstGroupAsInitialState":false,"createdOn":1663934233644}},"site":{"mediaQueries":[{"key":"main","min":992,"max":10000},{"key":"medium","min":768,"max":991},{"key":"small","min":480,"max":767},{"key":"tiny","min":0,"max":479}]}}'
);

export function StickyFooterFaQs({
  as: _Component = _Builtin.Block,
  footerFaqVisibility = true,
}) {
  _interactions.useInteractions(_interactionsData, _styles);

  return footerFaqVisibility ? (
    <_Component className={_utils.cx(_styles, "footer_sticky-faq")} tag="div">
      <_Builtin.Block
        className={_utils.cx(_styles, "padding-global")}
        tag="div"
      >
        <_Builtin.Block
          className={_utils.cx(_styles, "container-large")}
          tag="div"
        >
          <_Builtin.Block
            className={_utils.cx(_styles, "fs_accordion-1_component")}
            tag="div"
          >
            <_Builtin.HtmlEmbed
              className={_utils.cx(_styles, "fs_accordion-1_embed")}
              value="%3C!--%20%5BFinsweet%20Attributes%5D%20A11Y%20--%3E%0A%3Cscript%3E(()%3D%3E%7Bvar%20t%3D%22https%3A%2F%2Fcdn.jsdelivr.net%2Fnpm%2F%40finsweet%2Fattributes-a11y%401%2Fa11y.js%22%2Ce%3Ddocument.querySelector(%60script%5Bsrc%3D%22%24%7Bt%7D%22%5D%60)%3Be%7C%7C(e%3Ddocument.createElement(%22script%22)%2Ce.async%3D!0%2Ce.src%3Dt%2Cdocument.head.append(e))%3B%7D)()%3B%3C%2Fscript%3E"
            />
            <_Builtin.Block
              className={_utils.cx(_styles, "margin-bottom", "margin-medium")}
              id={_utils.cx(
                _styles,
                "w-node-_4cf3bdb3-4030-41f6-a126-c01e136bfc69-136bfc64"
              )}
              tag="div"
            >
              <_Builtin.Heading
                className={_utils.cx(
                  _styles,
                  "fs_accordion-1_label",
                  "text-weight-medium"
                )}
                id={_utils.cx(
                  _styles,
                  "w-node-_4cf3bdb3-4030-41f6-a126-c01e136bfc6a-136bfc64"
                )}
                tag="h1"
              >
                {"Product information"}
              </_Builtin.Heading>
            </_Builtin.Block>
            <_Builtin.Block
              className={_utils.cx(_styles, "fs_accordion-1_item")}
              tag="div"
            >
              <_Builtin.Block
                className={_utils.cx(
                  _styles,
                  "fs_accordion-1_header",
                  "is-first"
                )}
                tag="div"
                tabIndex="0"
                role="button"
                aria-controls="accordion-1-content-1"
                aria-expanded="false"
                id="accordion-1-header-1"
              >
                <_Builtin.Block
                  className={_utils.cx(_styles, "fs_accordion-1_label")}
                  tag="div"
                >
                  {"Limited edition prints"}
                </_Builtin.Block>
                <_Builtin.Block
                  className={_utils.cx(_styles, "fs_accordion-1_arrow-wrapper")}
                  tag="div"
                >
                  <_Builtin.Icon
                    className={_utils.cx(_styles, "fs_accordion-1_icon")}
                    widget={{
                      type: "icon",
                      icon: "dropdown-toggle",
                    }}
                  />
                </_Builtin.Block>
              </_Builtin.Block>
              <_Builtin.Block
                className={_utils.cx(_styles, "fs_accordion-1_content")}
                tag="div"
                aria-labelledby="accordion-header-1"
                id="accordion-1-content-1"
              >
                <_Builtin.Block
                  className={_utils.cx(_styles, "fs_accordion-1_body")}
                  tag="div"
                >
                  <_Builtin.Paragraph
                    className={_utils.cx(_styles, "fs_accordion-1_paragraph")}
                  >
                    {
                      "We offer limited edition fine art prints, produced on museum-grade cotton rag paper — either smooth or textured, depending on the image. Every print includes a white border on all sides for optimal presentation and framing. "
                    }
                    <br />
                    <br />
                    {
                      "The edition size for each image (across all print dimensions) is clearly listed on its individual product page. In addition, there are two Artist Proofs available for the second-largest size of that image (Large or Medium, depending on the edition)."
                    }
                  </_Builtin.Paragraph>
                </_Builtin.Block>
              </_Builtin.Block>
            </_Builtin.Block>
            <_Builtin.Block
              className={_utils.cx(_styles, "fs_accordion-1_item")}
              tag="div"
            >
              <_Builtin.Block
                className={_utils.cx(_styles, "fs_accordion-1_header")}
                tag="div"
                tabIndex="0"
                role="button"
                aria-controls="accordion-1-content-2"
                aria-expanded="false"
                id="accordion-1-header-2"
              >
                <_Builtin.Block
                  className={_utils.cx(_styles, "fs_accordion-1_label")}
                  tag="div"
                >
                  {"Certificate of Authenticity"}
                </_Builtin.Block>
                <_Builtin.Block
                  className={_utils.cx(_styles, "fs_accordion-1_arrow-wrapper")}
                  tag="div"
                >
                  <_Builtin.Icon
                    className={_utils.cx(_styles, "fs_accordion-1_icon")}
                    widget={{
                      type: "icon",
                      icon: "dropdown-toggle",
                    }}
                  />
                </_Builtin.Block>
              </_Builtin.Block>
              <_Builtin.Block
                className={_utils.cx(_styles, "fs_accordion-1_content")}
                tag="div"
                aria-labelledby="accordion-header-2"
                id="accordion-1-content-2"
              >
                <_Builtin.Block
                  className={_utils.cx(_styles, "fs_accordion-1_body")}
                  tag="div"
                >
                  <_Builtin.Paragraph
                    className={_utils.cx(_styles, "fs_accordion-1_paragraph")}
                  >
                    {
                      "All purchases will be accompanied by a hand signed certificate of authenticity and holograms with the unique code assigned to each limited-edition print."
                    }
                  </_Builtin.Paragraph>
                </_Builtin.Block>
              </_Builtin.Block>
            </_Builtin.Block>
            <_Builtin.Block
              className={_utils.cx(_styles, "fs_accordion-1_item")}
              tag="div"
            >
              <_Builtin.Block
                className={_utils.cx(_styles, "fs_accordion-1_header")}
                tag="div"
                tabIndex="0"
                role="button"
                aria-controls="accordion-1-content-3"
                aria-expanded="false"
                id="accordion-1-header-3"
              >
                <_Builtin.Block
                  className={_utils.cx(_styles, "fs_accordion-1_label")}
                  tag="div"
                >
                  {"Borders"}
                </_Builtin.Block>
                <_Builtin.Block
                  className={_utils.cx(_styles, "fs_accordion-1_arrow-wrapper")}
                  tag="div"
                >
                  <_Builtin.Icon
                    className={_utils.cx(_styles, "fs_accordion-1_icon")}
                    widget={{
                      type: "icon",
                      icon: "dropdown-toggle",
                    }}
                  />
                </_Builtin.Block>
              </_Builtin.Block>
              <_Builtin.Block
                className={_utils.cx(_styles, "fs_accordion-1_content")}
                tag="div"
                aria-labelledby="accordion-header-3"
                id="accordion-1-content-3"
              >
                <_Builtin.Block
                  className={_utils.cx(_styles, "fs_accordion-1_body")}
                  tag="div"
                >
                  <_Builtin.Paragraph
                    className={_utils.cx(_styles, "fs_accordion-1_paragraph")}
                  >
                    {
                      "We believe that borders work very well with framed art prints and will help the image stand out on your wall. Almost all of them are printed with a white border in proportion to the paper size. Depending on the image’s aspect ratio, the sizes will vary. Below is an example of sizes offered for images that have an aspect ratio of 3:2."
                    }
                  </_Builtin.Paragraph>
                  <_Builtin.Block
                    className={_utils.cx(
                      _styles,
                      "fs_accordion-1_body-table-grid"
                    )}
                    tag="div"
                  >
                    <_Builtin.Block
                      className={_utils.cx(_styles, "frame-table_instance")}
                      tag="div"
                      fs-table-instance="frame-table"
                      fs-table-element="table"
                    >
                      <_Builtin.Block
                        className={_utils.cx(
                          _styles,
                          "margin-bottom",
                          "margin-small"
                        )}
                        tag="div"
                      >
                        <_Builtin.Block
                          className={_utils.cx(_styles, "text-size-small")}
                          tag="div"
                        >
                          {"Sizes in cm"}
                        </_Builtin.Block>
                      </_Builtin.Block>
                      <_Builtin.DOM
                        className={_utils.cx(_styles, "frame-table_table")}
                        tag="table"
                        slot=""
                      >
                        <_Builtin.DOM
                          className={_utils.cx(_styles, "frame-table_head")}
                          tag="thead"
                          slot=""
                        >
                          <_Builtin.DOM
                            className={_utils.cx(_styles, "frame-table_row")}
                            tag="tr"
                            slot=""
                          >
                            <_Builtin.DOM
                              className={_utils.cx(
                                _styles,
                                "frame-table_header"
                              )}
                              tag="th"
                              slot=""
                            >
                              {"Image size (in cm)"}
                            </_Builtin.DOM>
                            <_Builtin.DOM
                              className={_utils.cx(
                                _styles,
                                "frame-table_header"
                              )}
                              tag="th"
                              slot=""
                            >
                              {"Border"}
                            </_Builtin.DOM>
                            <_Builtin.DOM
                              className={_utils.cx(
                                _styles,
                                "frame-table_header"
                              )}
                              tag="th"
                              slot=""
                            >
                              {"Paper size"}
                            </_Builtin.DOM>
                          </_Builtin.DOM>
                        </_Builtin.DOM>
                        <_Builtin.DOM
                          className={_utils.cx(_styles, "frame-table_body")}
                          tag="tbody"
                          slot=""
                        >
                          <_Builtin.DOM
                            className={_utils.cx(
                              _styles,
                              "frame-table_row",
                              "is-grey"
                            )}
                            tag="tr"
                            slot=""
                          >
                            <_Builtin.DOM
                              className={_utils.cx(_styles, "frame-table_cell")}
                              tag="td"
                              slot=""
                            >
                              {"61*41 (Small)"}
                            </_Builtin.DOM>
                            <_Builtin.DOM
                              className={_utils.cx(_styles, "frame-table_cell")}
                              tag="td"
                              slot=""
                            >
                              {"2.5 cm"}
                            </_Builtin.DOM>
                            <_Builtin.DOM
                              className={_utils.cx(_styles, "frame-table_cell")}
                              tag="td"
                              slot=""
                            >
                              {"66*46"}
                            </_Builtin.DOM>
                          </_Builtin.DOM>
                          <_Builtin.DOM
                            className={_utils.cx(_styles, "frame-table_row")}
                            tag="tr"
                            slot=""
                          >
                            <_Builtin.DOM
                              className={_utils.cx(_styles, "frame-table_cell")}
                              tag="td"
                              slot=""
                            >
                              {"91.4*61 (Medium)"}
                            </_Builtin.DOM>
                            <_Builtin.DOM
                              className={_utils.cx(_styles, "frame-table_cell")}
                              tag="td"
                              slot=""
                            >
                              {"3.8 cm"}
                            </_Builtin.DOM>
                            <_Builtin.DOM
                              className={_utils.cx(_styles, "frame-table_cell")}
                              tag="td"
                              slot=""
                            >
                              {"98.4*68"}
                            </_Builtin.DOM>
                          </_Builtin.DOM>
                          <_Builtin.DOM
                            className={_utils.cx(
                              _styles,
                              "frame-table_row",
                              "is-grey"
                            )}
                            tag="tr"
                            slot=""
                          >
                            <_Builtin.DOM
                              className={_utils.cx(_styles, "frame-table_cell")}
                              tag="td"
                              slot=""
                            >
                              {"122*81 (Large)"}
                            </_Builtin.DOM>
                            <_Builtin.DOM
                              className={_utils.cx(_styles, "frame-table_cell")}
                              tag="td"
                              slot=""
                            >
                              {"3.8 cm"}
                            </_Builtin.DOM>
                            <_Builtin.DOM
                              className={_utils.cx(_styles, "frame-table_cell")}
                              tag="td"
                              slot=""
                            >
                              {"129*88"}
                            </_Builtin.DOM>
                          </_Builtin.DOM>
                          <_Builtin.DOM
                            className={_utils.cx(_styles, "frame-table_row")}
                            tag="tr"
                            slot=""
                          >
                            <_Builtin.DOM
                              className={_utils.cx(_styles, "frame-table_cell")}
                              tag="td"
                              slot=""
                            >
                              {"151.4*101.6 (Statement)"}
                            </_Builtin.DOM>
                            <_Builtin.DOM
                              className={_utils.cx(_styles, "frame-table_cell")}
                              tag="td"
                              slot=""
                            >
                              {"4.3 cm"}
                            </_Builtin.DOM>
                            <_Builtin.DOM
                              className={_utils.cx(_styles, "frame-table_cell")}
                              tag="td"
                              slot=""
                            >
                              {"160*110"}
                            </_Builtin.DOM>
                          </_Builtin.DOM>
                        </_Builtin.DOM>
                      </_Builtin.DOM>
                    </_Builtin.Block>
                    <_Builtin.Block
                      className={_utils.cx(_styles, "frame-table_instance")}
                      id={_utils.cx(
                        _styles,
                        "w-node-_4cf3bdb3-4030-41f6-a126-c01e136bfcb8-136bfc64"
                      )}
                      tag="div"
                      fs-table-instance="frame-table"
                      fs-table-element="table"
                    >
                      <_Builtin.Block
                        className={_utils.cx(
                          _styles,
                          "margin-bottom",
                          "margin-small"
                        )}
                        tag="div"
                      >
                        <_Builtin.Block
                          className={_utils.cx(_styles, "text-size-small")}
                          tag="div"
                        >
                          {"Sizes in inches"}
                        </_Builtin.Block>
                      </_Builtin.Block>
                      <_Builtin.DOM
                        className={_utils.cx(_styles, "frame-table_table")}
                        tag="table"
                        slot=""
                      >
                        <_Builtin.DOM
                          className={_utils.cx(_styles, "frame-table_head")}
                          tag="thead"
                          slot=""
                        >
                          <_Builtin.DOM
                            className={_utils.cx(_styles, "frame-table_row")}
                            tag="tr"
                            slot=""
                          >
                            <_Builtin.DOM
                              className={_utils.cx(
                                _styles,
                                "frame-table_header"
                              )}
                              tag="th"
                              slot=""
                            >
                              {"Image size (in inches)"}
                            </_Builtin.DOM>
                            <_Builtin.DOM
                              className={_utils.cx(
                                _styles,
                                "frame-table_header"
                              )}
                              tag="th"
                              slot=""
                            >
                              {"Border"}
                            </_Builtin.DOM>
                            <_Builtin.DOM
                              className={_utils.cx(
                                _styles,
                                "frame-table_header"
                              )}
                              tag="th"
                              slot=""
                            >
                              {"Paper size"}
                            </_Builtin.DOM>
                          </_Builtin.DOM>
                        </_Builtin.DOM>
                        <_Builtin.DOM
                          className={_utils.cx(_styles, "frame-table_body")}
                          tag="tbody"
                          slot=""
                        >
                          <_Builtin.DOM
                            className={_utils.cx(
                              _styles,
                              "frame-table_row",
                              "is-grey"
                            )}
                            tag="tr"
                            slot=""
                          >
                            <_Builtin.DOM
                              className={_utils.cx(_styles, "frame-table_cell")}
                              tag="td"
                              slot=""
                            >
                              {"24*16 (Small)"}
                            </_Builtin.DOM>
                            <_Builtin.DOM
                              className={_utils.cx(_styles, "frame-table_cell")}
                              tag="td"
                              slot=""
                            >
                              {'1"'}
                            </_Builtin.DOM>
                            <_Builtin.DOM
                              className={_utils.cx(_styles, "frame-table_cell")}
                              tag="td"
                              slot=""
                            >
                              {"26*18"}
                            </_Builtin.DOM>
                          </_Builtin.DOM>
                          <_Builtin.DOM
                            className={_utils.cx(_styles, "frame-table_row")}
                            tag="tr"
                            slot=""
                          >
                            <_Builtin.DOM
                              className={_utils.cx(_styles, "frame-table_cell")}
                              tag="td"
                              slot=""
                            >
                              {"36*24 (Medium)"}
                            </_Builtin.DOM>
                            <_Builtin.DOM
                              className={_utils.cx(_styles, "frame-table_cell")}
                              tag="td"
                              slot=""
                            >
                              {'1.5"'}
                            </_Builtin.DOM>
                            <_Builtin.DOM
                              className={_utils.cx(_styles, "frame-table_cell")}
                              tag="td"
                              slot=""
                            >
                              {"38.7*26.8"}
                            </_Builtin.DOM>
                          </_Builtin.DOM>
                          <_Builtin.DOM
                            className={_utils.cx(
                              _styles,
                              "frame-table_row",
                              "is-grey"
                            )}
                            tag="tr"
                            slot=""
                          >
                            <_Builtin.DOM
                              className={_utils.cx(_styles, "frame-table_cell")}
                              tag="td"
                              slot=""
                            >
                              {"48*32 (Large)"}
                            </_Builtin.DOM>
                            <_Builtin.DOM
                              className={_utils.cx(_styles, "frame-table_cell")}
                              tag="td"
                              slot=""
                            >
                              {'1.5"'}
                            </_Builtin.DOM>
                            <_Builtin.DOM
                              className={_utils.cx(_styles, "frame-table_cell")}
                              tag="td"
                              slot=""
                            >
                              {"50.8*34.6"}
                            </_Builtin.DOM>
                          </_Builtin.DOM>
                          <_Builtin.DOM
                            className={_utils.cx(_styles, "frame-table_row")}
                            tag="tr"
                            slot=""
                          >
                            <_Builtin.DOM
                              className={_utils.cx(_styles, "frame-table_cell")}
                              tag="td"
                              slot=""
                            >
                              {"59.6*40 (Statement)"}
                            </_Builtin.DOM>
                            <_Builtin.DOM
                              className={_utils.cx(_styles, "frame-table_cell")}
                              tag="td"
                              slot=""
                            >
                              {'1.7"'}
                            </_Builtin.DOM>
                            <_Builtin.DOM
                              className={_utils.cx(_styles, "frame-table_cell")}
                              tag="td"
                              slot=""
                            >
                              {"63*43.4"}
                            </_Builtin.DOM>
                          </_Builtin.DOM>
                        </_Builtin.DOM>
                      </_Builtin.DOM>
                    </_Builtin.Block>
                  </_Builtin.Block>
                </_Builtin.Block>
              </_Builtin.Block>
            </_Builtin.Block>
            <_Builtin.Block
              className={_utils.cx(_styles, "fs_accordion-1_item")}
              id={_utils.cx(
                _styles,
                "w-node-_4cf3bdb3-4030-41f6-a126-c01e136bfce2-136bfc64"
              )}
              tag="div"
            >
              <_Builtin.Block
                className={_utils.cx(_styles, "fs_accordion-1_header")}
                tag="div"
                tabIndex="0"
                role="button"
                aria-controls="accordion-1-content-3"
                aria-expanded="false"
                id="accordion-1-header-3"
              >
                <_Builtin.Block
                  className={_utils.cx(_styles, "fs_accordion-1_label")}
                  tag="div"
                >
                  {"Custom framing"}
                </_Builtin.Block>
                <_Builtin.Block
                  className={_utils.cx(_styles, "fs_accordion-1_arrow-wrapper")}
                  tag="div"
                >
                  <_Builtin.Icon
                    className={_utils.cx(_styles, "fs_accordion-1_icon")}
                    widget={{
                      type: "icon",
                      icon: "dropdown-toggle",
                    }}
                  />
                </_Builtin.Block>
              </_Builtin.Block>
              <_Builtin.Block
                className={_utils.cx(_styles, "fs_accordion-1_content")}
                tag="div"
                aria-labelledby="accordion-header-3"
                id="accordion-1-content-3"
              >
                <_Builtin.Block
                  className={_utils.cx(_styles, "fs_accordion-1_body")}
                  tag="div"
                >
                  <_Builtin.Paragraph
                    className={_utils.cx(_styles, "fs_accordion-1_paragraph")}
                  >
                    {
                      "The numbers per limited edition size have already been determined. However, if you do wish to further customize the size then do contact us at "
                    }
                    <_Builtin.Link
                      className={_utils.cx(
                        _styles,
                        "fs_accordion-1_paragraph-link"
                      )}
                      button={false}
                      block=""
                      options={{
                        href: "#",
                      }}
                    >
                      {"hello@composingthewild.art"}
                    </_Builtin.Link>
                    {
                      " The total number of editions will remain constant even if we offer a custom size. "
                    }
                    <br />
                    <br />
                    {
                      "We do not offer framed prints at the moment. But we would be happy to offer advice on the best kind of frame based on the art and your space. "
                    }
                    <br />
                    <br />
                    {
                      "If you are based in the UAE, we do have framing options available for you. Contact us at "
                    }
                    <_Builtin.Link
                      className={_utils.cx(
                        _styles,
                        "fs_accordion-1_paragraph-link"
                      )}
                      button={false}
                      block=""
                      options={{
                        href: "#",
                      }}
                    >
                      {"hello@composingthewild.art"}
                    </_Builtin.Link>
                    {" for further details."}
                  </_Builtin.Paragraph>
                </_Builtin.Block>
              </_Builtin.Block>
            </_Builtin.Block>
            <_Builtin.Block
              className={_utils.cx(_styles, "fs_accordion-1_item", "is-last")}
              id={_utils.cx(
                _styles,
                "w-node-_25369228-0890-ddd5-123c-5ea9d95c5f15-136bfc64"
              )}
              tag="div"
            >
              <_Builtin.Block
                className={_utils.cx(_styles, "fs_accordion-1_header")}
                tag="div"
                tabIndex="0"
                role="button"
                aria-controls="accordion-1-content-3"
                aria-expanded="false"
                id="accordion-1-header-3"
              >
                <_Builtin.Block
                  className={_utils.cx(_styles, "fs_accordion-1_label")}
                  tag="div"
                >
                  {"Shipping and returns"}
                </_Builtin.Block>
                <_Builtin.Block
                  className={_utils.cx(_styles, "fs_accordion-1_arrow-wrapper")}
                  tag="div"
                >
                  <_Builtin.Icon
                    className={_utils.cx(_styles, "fs_accordion-1_icon")}
                    widget={{
                      type: "icon",
                      icon: "dropdown-toggle",
                    }}
                  />
                </_Builtin.Block>
              </_Builtin.Block>
              <_Builtin.Block
                className={_utils.cx(_styles, "fs_accordion-1_content")}
                tag="div"
                aria-labelledby="accordion-header-3"
                id="accordion-1-content-3"
              >
                <_Builtin.Block
                  className={_utils.cx(_styles, "fs_accordion-1_body")}
                  tag="div"
                >
                  <_Builtin.RichText
                    className={_utils.cx(_styles, "text-rich-text-small")}
                    tag="div"
                    slot=""
                  >
                    <_Builtin.Heading tag="h6">
                      {"Production Time"}
                    </_Builtin.Heading>
                    <_Builtin.Paragraph>
                      {"Please allow up to "}
                      <_Builtin.Strong>{"4 weeks"}</_Builtin.Strong>
                      {
                        " for a print from invoice to delivery. We will, of course, try to get it to you sooner. Each print is "
                      }
                      <_Builtin.Strong>{"hand-signed"}</_Builtin.Strong>
                      {" and "}
                      <_Builtin.Strong>
                        {"personally inspected"}
                      </_Builtin.Strong>
                      {
                        " before shipping. As we travel extensively, we would not want to disappoint you by committing to a lesser lead time."
                      }
                    </_Builtin.Paragraph>
                    <_Builtin.Heading tag="h6">{"Packaging"}</_Builtin.Heading>
                    <_Builtin.Paragraph>
                      {"All prints are "}
                      <_Builtin.Strong>
                        {"wrapped in craft paper"}
                      </_Builtin.Strong>
                      {" and shipped in a "}
                      <_Builtin.Strong>{"cardboard tube"}</_Builtin.Strong>
                      {
                        " designed to handle the rigours of international shipping. As of today, the cardboard tubes have "
                      }
                      <_Builtin.Strong>{"plastic lids"}</_Builtin.Strong>
                      {
                        " in order to survive the rigours of shipping. We are actively on the lookout for "
                      }
                      <_Builtin.Strong>
                        {"eco-friendly alternatives"}
                      </_Builtin.Strong>
                      {" to this."}
                    </_Builtin.Paragraph>
                    <_Builtin.Paragraph>
                      {"We will choose the most "}
                      <_Builtin.Strong>{"cost-effective"}</_Builtin.Strong>
                      {" and "}
                      <_Builtin.Strong>{"reliable"}</_Builtin.Strong>
                      {
                        " shipping carrier based on the items ordered and their destination."
                      }
                      <br />
                      {"Shipping times range from "}
                      <_Builtin.Strong>{"1–7 business days"}</_Builtin.Strong>
                      {". You will receive a "}
                      <_Builtin.Strong>{"tracking number"}</_Builtin.Strong>
                      {" as soon as your order has been shipped."}
                    </_Builtin.Paragraph>
                    <_Builtin.Heading tag="h6">
                      {"Shipping Prices"}
                    </_Builtin.Heading>
                    <_Builtin.Paragraph>
                      {
                        "Shipping charges will be added at checkout based on the delivery address. Please note that the shipping prices "
                      }
                      <_Builtin.Strong>
                        {"do not include Customs and Duties"}
                      </_Builtin.Strong>
                      {
                        " that may be incurred additionally at each destination country."
                      }
                    </_Builtin.Paragraph>
                    <_Builtin.Paragraph>
                      {
                        "If your country is not available for shipping at checkout and you wish to make an order, please email us at "
                      }
                      <_Builtin.Link
                        button={false}
                        block=""
                        options={{
                          href: "mailto:hello@composingthewild.art",
                        }}
                      >
                        {"hello@composingthewild.ar"}
                        <_Builtin.Strong>{"t"}</_Builtin.Strong>
                      </_Builtin.Link>
                      {"."}
                    </_Builtin.Paragraph>
                    <_Builtin.Heading tag="h6">
                      {"Return Policy"}
                    </_Builtin.Heading>
                    <_Builtin.Paragraph>
                      {
                        "We believe that you will love your print. We strive to provide a very clear picture of what you will be getting, with features like "
                      }
                      <_Builtin.Strong>{"Wall Preview"}</_Builtin.Strong>
                      {" throughout this store website."}
                    </_Builtin.Paragraph>
                    <_Builtin.Paragraph>
                      {
                        "We also personally inspect each print before shipping, so "
                      }
                      <_Builtin.Strong>{"all sales are final"}</_Builtin.Strong>
                      {"."}
                    </_Builtin.Paragraph>
                    <_Builtin.Paragraph>
                      {"Exceptions are made, of course, for any "}
                      <_Builtin.Strong>
                        {"damage during shipping"}
                      </_Builtin.Strong>
                      {
                        ". Please contact us and we will make the necessary arrangements for you to return the print for a replacement. Both the "
                      }
                      <_Builtin.Strong>{"damaged print"}</_Builtin.Strong>
                      {" and the "}
                      <_Builtin.Strong>
                        {"certificate of authenticity"}
                      </_Builtin.Strong>
                      {" must be returned for destruction."}
                    </_Builtin.Paragraph>
                  </_Builtin.RichText>
                </_Builtin.Block>
              </_Builtin.Block>
            </_Builtin.Block>
          </_Builtin.Block>
        </_Builtin.Block>
      </_Builtin.Block>
    </_Component>
  ) : null;
}
