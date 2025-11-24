"use client";
import React from "react";
import * as _Builtin from "./_Builtin";

export function AlertCss({ as: _Component = _Builtin.HtmlEmbed }) {
  return (
    <_Component value="%3Cstyle%3E%0Abody.swal2-shown.swal2-height-auto%20%7B%20overflow-y%3A%20auto%20!important%3B%20%7D%0A.swal2-html-container%7Bmargin%3A%200%20!important%3B%7D%0Adiv%3Awhere(.swal2-container)%7B%0Az-index%3A%209999999%20!important%3B%0A%7D%0A%2F*%20dark%20toast%20*%2F%0A.twb-toast%20%7B%20%0A%20%20background%3A%23333333%20!important%3B%20%0A%20%20color%3A%23fff%20!important%3B%20%0A%20%20border-radius%3A%204px%20!important%3B%20%0A%20%20padding%3A%2016px%2018px%20!important%3B%0A%20%20cursor%3Apointer%3B%20%0A%20%20min-width%3A%2020rem%3B%0A%7D%0A.twb-content%20%7B%0A%20%20display%3Aflex%3B%20%0A%20%20align-items%3Acenter%3B%20%0A%20%20font-size%3A1rem%3B%20%0A%20%20font-weight%3A400%3B%0A%20%20justify-content%3A%20space-between%3B%0A%7D%0A.twb-icon%20%7B%0A%20%20width%3A24px%3B%20%0A%20%20height%3A24px%3B%20%0A%20%20fill%3A%23fff%3B%0A%7D%0A%40media%20(max-width%3A%20991px)%20%7B%0A%20%20.swal2-container%20%7B%0A%20%20%20%20width%3A%20100%25%20!important%3B%0A%20%20%7D%0A%7D%0A%2F*%20slide%2Ffade%20*%2F%0A%40keyframes%20twbInTop%20%20%20%7B%20from%7Btransform%3AtranslateY(-14px)%3Bopacity%3A0%7D%20to%7Btransform%3AtranslateY(0)%3Bopacity%3A1%7D%20%7D%0A%40keyframes%20twbOutTop%20%20%7B%20from%7Btransform%3AtranslateY(0)%3Bopacity%3A1%7D%20%20%20%20%20to%7Btransform%3AtranslateY(-14px)%3Bopacity%3A0%7D%20%7D%0A.swal2-show.twb-in%20%20%7B%20animation%3A%20twbInTop%20200ms%20ease-out%20both%3B%20%7D%0A.swal2-hide.twb-out%20%7B%20animation%3A%20twbOutTop%20200ms%20ease-in%20%20both%3B%20%7D%0A%3C%2Fstyle%3E" />
  );
}
