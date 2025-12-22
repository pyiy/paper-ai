import { NextRequest, NextResponse } from "next/server";
// import Cite from "citation-js";
const Cite = require("citation-js");

export const runtime = 'nodejs';

console.log("Loading Citation API route...");

export async function POST(req: NextRequest) {
  try {
    const { doi, style, lang } = await req.json();

    if (!doi) {
      return NextResponse.json(
        { error: "DOI is required" },
        { status: 400 }
      );
    }

    let citation;
    console.log(`Processing DOI: ${doi}`);

    try {
      citation = await Cite.async(doi);
    } catch (e) {
      console.warn("Cite.async failed, trying manual fetch...", e);
      // Fallback: manually fetch CSL-JSON from doi.org with headers
      const response = await fetch(`https://doi.org/${encodeURIComponent(doi)}`, {
        headers: {
          Accept: "application/vnd.citationstyles.csl+json",
          "User-Agent": "PaperAI/1.0 (mailto:hello@paperai.com)",
        },
      });

      if (!response.ok) {
        const text = await response.text();
        console.error(`DOI Fetch Error: ${response.status} ${response.statusText}`);
        throw new Error(`DOI fetch failed: ${response.status} ${response.statusText} - ${text.substring(0, 100)}...`);
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("text/html")) {
         const text = await response.text();
         console.log("Received HTML, attempting to scrape metadata...");
         
         // Simple regex scraper for meta tags
         const getMeta = (name: string) => {
             const regex = new RegExp(`<meta\\s+name=["']${name}["']\\s+content=["'](.*?)["']`, "i");
             const match = text.match(regex);
             return match ? match[1] : null;
         };

         const getMetas = (name: string) => {
             const regex = new RegExp(`<meta\\s+name=["']${name}["']\\s+content=["'](.*?)["']`, "gi");
             const matches = text.matchAll(regex);
             return Array.from(matches).map(m => m[1]);
         };
         
         const title = getMeta("citation_title") || getMeta("DC.title") || text.match(/<title>(.*?)<\/title>/i)?.[1] || "Unknown Title";
         const authors = getMetas("citation_author").concat(getMetas("DC.creator"));
         const journal = getMeta("citation_journal_title") || getMeta("DC.source") || "";
         const date = getMeta("citation_date") || getMeta("DC.date") || "";
         const year = date ? new Date(date).getFullYear() : null;

         if (!title && authors.length === 0) {
             throw new Error(`Could not parse metadata from HTML response.`);
         }
         
         // Construct minimal CSL-JSON
         const csl = {
             type: "article-journal",
             id: doi,
             title: title,
             author: authors.map(name => {
                 // Try to split name if possible, otherwise put whole name in literal
                 return { literal: name };
             }),
             "container-title": journal,
             issued: year ? { "date-parts": [[year]] } : undefined,
             DOI: doi,
         };
         
         console.log("Constructed CSL from HTML:", JSON.stringify(csl, null, 2));
         citation = new Cite(csl);

      } else {
          const cslJson = await response.json();
          citation = new Cite(cslJson);
      }

    }

    const output = citation.format("bibliography", {
      format: "text",
      template: style || "apa",
      lang: lang || "en-US",
    });

    return NextResponse.json({ citation: output? output.trim() : "" });
  } catch (error: any) {
    console.error("Error generating citation API:", error);
    return NextResponse.json(
      { error: "Failed to generate citation", details: error.message },
      { status: 500 }
    );
  }
}
