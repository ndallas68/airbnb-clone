// pages/LandingPage.js or pages/LandingPage.tsx
import React from 'react';
import { useRouter } from 'next/router';
import { PreLoader } from '@/app/components/loading/PreLoader';


export default function LandingPage() {
  const router = useRouter();

  const handleOnClick = () => {
    router.push('/');
  };

  return <div onClick={handleOnClick}>
    <PreLoader />
  </div>;
}
