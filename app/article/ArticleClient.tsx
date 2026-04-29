"use client";

import { useState } from "react";

interface ArticleClientProps {
  humanHtml: string;
  aiHtml: string;
}

export default function ArticleClient({ humanHtml, aiHtml }: ArticleClientProps) {
  const [showAi, setShowAi] = useState(false);

  return (
    <>
      <div className="fixed right-6 top-5 hidden md:flex items-center gap-1 rounded-full border border-[#222] bg-[#111] p-1 text-[13px]">
          <button
            onClick={() => setShowAi(false)}
            className={`rounded-full px-3 py-1 transition-colors ${
              !showAi ? "bg-[#222] text-[#ededed]" : "text-[#666] hover:text-[#999]"
            }`}
          >
            Edited
          </button>
          <button
            onClick={() => setShowAi(true)}
            className={`rounded-full px-3 py-1 transition-colors ${
              showAi ? "bg-[#222] text-[#ededed]" : "text-[#666] hover:text-[#999]"
            }`}
          >
            AI draft
          </button>
      </div>

      <article
        style={{ fontFeatureSettings: '"liga"', fontSynthesisWeight: "none" }}
        className="
          mt-6 prose prose-invert max-w-none text-[18px]
          [&_p]:text-[#ededed] [&_p]:text-[18px] [&_p]:leading-[28px] [&_p]:mt-0
          [&_h2]:text-[#ededed] [&_h2]:text-[24px] [&_h2]:font-semibold [&_h2]:tracking-[-0.96px] [&_h2]:leading-[32px] [&_h2]:mt-12 [&_h2]:mb-4
          [&_h3]:text-[#ededed] [&_h3]:text-[20px] [&_h3]:font-semibold [&_h3]:tracking-[-0.6px] [&_h3]:leading-[28px] [&_h3]:mt-8 [&_h3]:mb-3
          [&_a]:text-[oklch(0.717_0.1648_250.794)] [&_a]:underline [&_a]:underline-offset-[3px] [&_a]:decoration-[oklch(0.717_0.1648_250.794)] [&_a:hover]:opacity-80 [&_a]:transition-opacity
          [&_strong]:text-[#ededed] [&_strong]:font-semibold
          [&_code]:font-[family-name:var(--font-geist-mono)] [&_code]:text-[#ededed] [&_code]:bg-[#161616] [&_code]:px-[5px] [&_code]:py-[2px] [&_code]:rounded [&_code]:text-[13px] [&_code]:before:content-none [&_code]:after:content-none
          [&_pre]:bg-[#111] [&_pre]:border [&_pre]:border-[#222] [&_pre]:rounded-xl [&_pre]:p-5 [&_pre]:overflow-x-auto [&_pre]:my-6
          [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-[#ededed] [&_pre_code]:text-[13px] [&_pre_code]:leading-[20px] [&_pre_code]:font-variant-ligatures-none
          [&_hr]:hidden
          [&_li]:text-[#ededed] [&_li]:text-[18px] [&_li]:leading-[28px]
          [&_blockquote]:border-l-[#333] [&_blockquote]:text-[#999]
          [&_table]:text-[14px] [&_th]:text-[#ededed] [&_th]:font-semibold [&_td]:text-[#ededed] [&_th]:border-[#222] [&_td]:border-[#1a1a1a]
        "
        dangerouslySetInnerHTML={{ __html: showAi ? aiHtml : humanHtml }}
      />
    </>
  );
}
