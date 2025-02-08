"use client";

import Giscus from "@giscus/react";

export default function Comments() {
  return (
    <Giscus
      repo="chennlang/chennlang.github.io"
      repoId="R_kgDON2OHoA"
      category="Comments"
      categoryId="DIC_kwDON2OHoM4CmxNZ"
      mapping="pathname"
      strict="0"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      theme="preferred_color_scheme"
      lang="zh-CN"
    />
  );
}
