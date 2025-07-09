import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { BlogPost } from '@/lib/types';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const blogsRef = collection(db, 'blogs');
    const q = query(
      blogsRef,
      where('slug', '==', params.slug),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    const post = {
      id: querySnapshot.docs[0].id,
      ...querySnapshot.docs[0].data()
    } as BlogPost;

    return NextResponse.json({ post });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
} 
 