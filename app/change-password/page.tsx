"use client";
import { Suspense } from 'react';
import ChangePasswordClient from './ChangePasswordClient';

export default function ChangePasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChangePasswordClient />
    </Suspense>
  );
}
