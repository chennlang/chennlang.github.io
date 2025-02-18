"use client";

import { useEffect } from "react";

export default function ImagePreview() {
  useEffect(() => {
    const handleImageClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "IMG" &&
        target.parentElement?.className !== "preview-wrapper"
      ) {
        const overlay = document.createElement("div");
        overlay.className =
          "fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center";

        const wrapper = document.createElement("div");
        wrapper.className =
          "preview-wrapper max-w-[90vw] max-h-[90vh] relative";

        const img = document.createElement("img");
        img.src = (target as HTMLImageElement).src;
        img.className = "max-w-full max-h-[90vh] object-contain";

        wrapper.appendChild(img);
        overlay.appendChild(wrapper);

        overlay.addEventListener("click", () => {
          overlay.remove();
        });

        document.body.appendChild(overlay);
      }
    };

    document.addEventListener("click", handleImageClick);
    return () => document.removeEventListener("click", handleImageClick);
  }, []);

  return null;
}
