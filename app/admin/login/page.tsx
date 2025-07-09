"use client";
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AdminAuth from '../components/AdminAuth';
import { auth } from '@/lib/firebase';

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/admin';

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // If user is authenticated, redirect to the intended page
        router.push(from);
      }
    });

    return () => unsubscribe();
  }, [router, from]);

  return <AdminAuth />;
} 