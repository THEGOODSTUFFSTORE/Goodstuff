import { NextResponse } from 'next/server';
import client from '@/lib/contentful';
import { ContentfulBlogPost } from '@/lib/types';

function getBlogImageUrl(contentfulImage: any): string {
  if (!contentfulImage?.fields?.file?.url) {
    return '/wine.webp';
  }
  return `https:${contentfulImage.fields.file.url}`;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params;
    const response = await client.getEntries<ContentfulBlogPost>({
      content_type: 'blogPost',
      ['fields.slug']: resolvedParams.slug,
      limit: 1,
    } as any);
    if (!response.items.length) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    const item = response.items[0];
    const post = {
      id: item.sys.id,
      title: item.fields.title,
      slug: item.fields.slug,
      excerpt: item.fields.excerpt,
      content: item.fields.content,
      featuredImage: getBlogImageUrl(item.fields.featuredImage),
      author: item.fields.author,
      publishDate: item.fields.publishDate,
      tags: item.fields.tags,
    };
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 });
  }
} 
 