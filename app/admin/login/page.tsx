"use client";
import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AdminAuth from '../components/AdminAuth';
import { auth } from '@/lib/firebase';

function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/admin';

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check session validity
        const response = await fetch('/api/auth/session/validate');
        if (!response.ok) {
          return;
        }
        
        const data = await response.json();
        if (data.isAdmin) {
          router.push(from);
        }
      } catch (error) {
        console.error('Auth check error:', error);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        checkAuth();
      }
    });

    return () => unsubscribe();
  }, [router, from]);

  return <AdminAuth />;
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminLoginContent />
    </Suspense>
  );
} 