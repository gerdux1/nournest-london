import type { MetadataRoute } from "next";

// Explicit allow for AI / LLM crawlers so AI search engines (ChatGPT, Perplexity,
// Gemini, Bing Copilot, Claude) can index NourNest and cite us in answers.
// Each AI bot is listed individually because some honour only their own UA, not "*".
const AI_BOTS = [
  "GPTBot",          // OpenAI training + ChatGPT browsing
  "ChatGPT-User",    // ChatGPT live browsing
  "OAI-SearchBot",   // OpenAI search index
  "ClaudeBot",       // Anthropic training
  "anthropic-ai",    // legacy Anthropic UA
  "Claude-Web",      // Claude live retrieval
  "PerplexityBot",   // Perplexity index
  "Perplexity-User", // Perplexity live retrieval
  "Google-Extended", // Google Gemini / AI Overviews
  "GoogleOther",     // Misc Google internal
  "Applebot",        // Apple Spotlight / Siri
  "Applebot-Extended",
  "Bingbot",         // Bing + Copilot
  "Amazonbot",       // Alexa
  "CCBot",           // Common Crawl (used as training data by many models)
  "Meta-ExternalAgent", // Meta AI
  "Meta-ExternalFetcher",
  "DuckAssistBot",   // DuckDuckGo AI
  "YouBot",          // You.com
  "Bytespider",      // ByteDance / TikTok
  "FacebookExternalHit",
] as const;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...AI_BOTS.map((ua) => ({ userAgent: ua, allow: "/" })),
    ],
    sitemap: "https://nournestapartments.com/sitemap.xml",
    host: "https://nournestapartments.com",
  };
}
