'use client';
import { useSession, signIn, signOut } from 'next-auth/react';
import Header from '@/components/header/header';

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
    </>
  )
}
