import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type ContentfulAsset = {
  fields?: { file?: { url?: string } };
};

async function fetchFromContentful(url: string): Promise<any | null> {
  try {
    const res = await fetch(url, { next: { revalidate: 0 }, cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function toHttps(url?: string | null): string | null {
  if (!url) return null;
  if (url.startsWith('https://')) return url;
  if (url.startsWith('//')) return `https:${url}`;
  if (url.startsWith('http://')) return url.replace('http://', 'https://');
  return url;
}

async function getHeroImageUrl(page: string): Promise<string | null> {
  const space = process.env.CONTENTFUL_SPACE_ID;
  const env = process.env.CONTENTFUL_ENVIRONMENT_ID || 'master';
  const token = process.env.CONTENTFUL_DELIVERY_TOKEN;
  const fallbackUrl = process.env.HERO_IMAGE_URL || null;

  if (!space || !token) {
    return fallbackUrl;
  }

  const base = `https://cdn.contentful.com/spaces/${space}/environments/${env}`;

  // Try content type hero/Hero with fields.pageKey
  const heroTypeCandidates = ['hero', 'Hero'];
  for (const ct of heroTypeCandidates) {
    const entriesUrl = `${base}/entries?access_token=${encodeURIComponent(token)}&content_type=${encodeURIComponent(ct)}&fields.pageKey=${encodeURIComponent(page)}&include=1&limit=1`;
    const entries = await fetchFromContentful(entriesUrl);
    if (entries?.items?.length) {
      const item = entries.items[0];
      // If the asset is fully embedded (rare with REST) try direct path first
      const directUrl = toHttps(item?.fields?.image?.fields?.file?.url || null);
      if (directUrl) return directUrl;

      const includes = entries.includes || {};
      const assetId = item.fields?.image?.sys?.id;
      if (assetId && includes.Asset) {
        const asset = includes.Asset.find((a: any) => a.sys?.id === assetId) as ContentfulAsset | undefined;
        const url = toHttps(asset?.fields?.file?.url || null);
        if (url) return url;
      }
    }

    // Case-insensitive/fuzzy search using query on the same content type
    const fuzzyUrl = `${base}/entries?access_token=${encodeURIComponent(token)}&content_type=${encodeURIComponent(ct)}&query=${encodeURIComponent(page)}&include=1&limit=1`;
    const fuzzyEntries = await fetchFromContentful(fuzzyUrl);
    if (fuzzyEntries?.items?.length) {
      const item = fuzzyEntries.items[0];
      const directUrl = toHttps(item?.fields?.image?.fields?.file?.url || null);
      if (directUrl) return directUrl;
      const includes = fuzzyEntries.includes || {};
      const assetId = item.fields?.image?.sys?.id;
      if (assetId && includes.Asset) {
        const asset = includes.Asset.find((a: any) => a.sys?.id === assetId) as ContentfulAsset | undefined;
        const url = toHttps(asset?.fields?.file?.url || null);
        if (url) return url;
      }
    }

    // Fallback to the most recently updated Hero entry
    const latestUrl = `${base}/entries?access_token=${encodeURIComponent(token)}&content_type=${encodeURIComponent(ct)}&order=-sys.updatedAt&include=1&limit=1`;
    const latestEntries = await fetchFromContentful(latestUrl);
    if (latestEntries?.items?.length) {
      const item = latestEntries.items[0];
      const directUrl = toHttps(item?.fields?.image?.fields?.file?.url || null);
      if (directUrl) return directUrl;
      const includes = latestEntries.includes || {};
      const assetId = item.fields?.image?.sys?.id;
      if (assetId && includes.Asset) {
        const asset = includes.Asset.find((a: any) => a.sys?.id === assetId) as ContentfulAsset | undefined;
        const url = toHttps(asset?.fields?.file?.url || null);
        if (url) return url;
      }
    }
  }

  // 3) Fallback: try assets search by query
  const assetsUrl = `${base}/assets?access_token=${encodeURIComponent(token)}&mimetype_group=image&query=${encodeURIComponent(page)}&limit=1`;
  const assets = await fetchFromContentful(assetsUrl);
  if (assets?.items?.length) {
    const asset = assets.items[0] as ContentfulAsset;
    const url = toHttps(asset?.fields?.file?.url || null);
    if (url) return url;
  }

  return fallbackUrl;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = (searchParams.get('page') || 'home').toLowerCase();

  const url = await getHeroImageUrl(page);
  if (!url) {
    return NextResponse.json({ url: null }, { status: 200 });
  }
  return NextResponse.json({ url }, { status: 200 });
}


