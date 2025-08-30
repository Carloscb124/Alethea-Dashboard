// Supabase Edge Function: crawl-news
// Uses Firecrawl API to crawl given news sites and store articles into public.news_items

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const FIRECRAWL_API_KEY = Deno.env.get("FIRECRAWL_API_KEY");

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing Supabase env vars inside Edge Function");
}

const supabase = createClient(SUPABASE_URL!, SERVICE_ROLE_KEY!);

interface CrawlRequestBody {
  sources?: string[];
  limit?: number;
}

interface FirecrawlDoc {
  markdown?: string;
  html?: string;
  metadata?: {
    title?: string;
    description?: string;
    language?: string;
    sourceURL?: string;
    url?: string;
    statusCode?: number;
    [key: string]: unknown;
  };
}

async function startCrawl(url: string, limit: number) {
  const resp = await fetch("https://api.firecrawl.dev/v2/crawl", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${FIRECRAWL_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url,
      limit,
      // Ask for both markdown and html to give us flexibility for parsing later
      scrapeOptions: { formats: ["markdown", "html"] },
      // Keep it constrained to the same domain
      allowExternalLinks: false,
    }),
  });

  const data = await resp.json();
  // data may be { id: string } or include a URL
  const id: string | undefined = data?.id || data?.job?.id || (() => {
    const urlField: string | undefined = data?.url || data?.job?.url;
    if (urlField && typeof urlField === "string") {
      const parts = urlField.split("/");
      return parts[parts.length - 1];
    }
    return undefined;
  })();

  if (!id) {
    console.error("Failed to start crawl:", data);
    throw new Error("Firecrawl: failed to start crawl");
  }
  return id;
}

async function fetchCrawlAll(id: string): Promise<FirecrawlDoc[]> {
  const allDocs: FirecrawlDoc[] = [];
  let nextUrl: string | null = `https://api.firecrawl.dev/v2/crawl/${id}`;

  while (nextUrl) {
    const r = await fetch(nextUrl, {
      headers: { Authorization: `Bearer ${FIRECRAWL_API_KEY}` },
    });
    const data = await r.json();

    const status = data?.status as string | undefined;
    if (data?.data && Array.isArray(data.data)) {
      allDocs.push(...(data.data as FirecrawlDoc[]));
    }

    // pagination: if response provides next, follow it; if not completed, wait and poll again
    if (data?.next) {
      nextUrl = data.next as string;
    } else if (status && status !== "completed") {
      // wait 3s and poll the same URL again
      await new Promise((res) => setTimeout(res, 3000));
      nextUrl = `https://api.firecrawl.dev/v2/crawl/${id}`;
    } else {
      nextUrl = null;
    }
  }

  return allDocs;
}

function estimateReadTime(markdown?: string): number | null {
  if (!markdown) return null;
  const words = markdown.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200)); // ~200 wpm
}

function normalizeUrl(u?: string): string | null {
  try {
    if (!u) return null;
    // Some metadata fields can include relative URLs; ignore those
    const parsed = new URL(u);
    return parsed.toString();
  } catch {
    return null;
  }
}

function hostnameFromUrl(u: string | null): string | null {
  try {
    if (!u) return null;
    return new URL(u).hostname;
  } catch {
    return null;
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (!FIRECRAWL_API_KEY) {
    return new Response(JSON.stringify({ error: "FIRECRAWL_API_KEY not set" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = (await req.json().catch(() => ({}))) as CrawlRequestBody;

    const defaultSources = [
      "https://www.folha.uol.com.br/",
      "https://www.nytimes.com/",
      "https://www.bbc.com/news",
      "https://g1.globo.com/",
      "https://noticias.uol.com.br/",
      "https://www.poder360.com.br/",
      "https://www.reuters.com/",
      "https://www.theguardian.com/international",
    ];

    const sources = Array.isArray(body.sources) && body.sources.length > 0 ? body.sources : defaultSources;
    const limit = typeof body.limit === "number" && body.limit > 0 ? Math.min(body.limit, 50) : 10;

    console.log("Starting crawl for sources:", sources, "limit:", limit);

    const results: Array<{ source: string; inserted: number; processed: number; errors: number }> = [];

    for (const source of sources) {
      try {
        const crawlId = await startCrawl(source, limit);
        console.log(`[${source}] crawl started with id`, crawlId);

        const docs = await fetchCrawlAll(crawlId);
        console.log(`[${source}] fetched docs:`, docs.length);

        const rows = docs
          .map((d) => {
            const url = normalizeUrl(d.metadata?.sourceURL || d.metadata?.url);
            if (!url) return null;
            const title = d.metadata?.title || null;
            const summary = d.metadata?.description || null;
            const sourceHost = hostnameFromUrl(url);
            const readTime = estimateReadTime(d.markdown || undefined);

            return {
              url,
              title,
              summary,
              source: sourceHost,
              category: null as string | null,
              image_url: null as string | null,
              content_markdown: d.markdown || null,
              content_html: d.html || null,
              read_time: readTime,
              published_at: null as string | null,
            };
          })
          .filter(Boolean) as Array<{
            url: string;
            title: string | null;
            summary: string | null;
            source: string | null;
            category: string | null;
            image_url: string | null;
            content_markdown: string | null;
            content_html: string | null;
            read_time: number | null;
            published_at: string | null;
          }>;

        // Deduplicate by URL to avoid ON CONFLICT affecting the same row twice
        const uniqueRows = Array.from(new Map(rows.map(r => [r.url, r])).values());

        if (uniqueRows.length === 0) {
          results.push({ source, inserted: 0, processed: rows.length, errors: 0 });
          continue;
        }

        // Upsert on url to avoid duplicates
        const { error } = await supabase
          .from("news_items")
          .upsert(uniqueRows, { onConflict: "url" });

        if (error) {
          console.error(`[${source}] upsert error:`, error);
          results.push({ source, inserted: 0, processed: rows.length, errors: uniqueRows.length });
        } else {
          results.push({ source, inserted: uniqueRows.length, processed: rows.length, errors: 0 });
        }
      } catch (e) {
        console.error(`[${source}] crawl error:`, e);
        results.push({ source, inserted: 0, processed: 0, errors: 1 });
      }
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("crawl-news error:", error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
