import { NextResponse } from 'next/server';
import client from '@/lib/contentful';
import { ContentfulBlogPost } from '@/lib/types';

function getBlogImageUrl(contentfulImage: any): string {
  if (!contentfulImage?.fields?.file?.url) {
    return '/wine.webp';
  }
  return `https:${contentfulImage.fields.file.url}`;
}

export async function GET() {
  try {
    const response = await client.getEntries<ContentfulBlogPost>({
      content_type: 'blogPost',
      order: ['-sys.createdAt'],
      limit: 100,
    });
    const posts = response.items.map((item) => ({
      id: item.sys.id,
      title: item.fields.title,
      slug: item.fields.slug,
      excerpt: item.fields.excerpt,
      content: item.fields.content,
      featuredImage: getBlogImageUrl(item.fields.featuredImage),
      author: item.fields.author,
      publishDate: item.fields.publishDate,
      tags: item.fields.tags,
    }));
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
} 