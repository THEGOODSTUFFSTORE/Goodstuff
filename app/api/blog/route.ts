import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { BlogPost } from '@/lib/types';

export async function GET() {
  try {
    const blogsRef = collection(db, 'blogs');
    const q = query(blogsRef, orderBy('publishDate', 'desc'), limit(10));
    const querySnapshot = await getDocs(q);
    
    const posts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as BlogPost));

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
} 