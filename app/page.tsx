'use client';
import { useSession } from 'next-auth/react';
import Header from '@/components/header/header';
import UnAuth from '@/components/un-auth/un-auth';

export default function Home() {
  const { data: session } = useSession()
  if (session) {
    return (
      <>
        <Header />
      </>
    )
  }
  return (
    <>
      <Header />
      <UnAuth />
    </>
  )
}
