'use client';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Header() {
  const { data: session } = useSession()
  if (session) {
    return (
      <>
        <div className=''>
          <h2>Chat Chit</h2>
          <p>Signed in as {session.user?.email}</p>
          <button onClick={() => signOut()}>Sign out</button>
        </div>
      </>
    )
  }
  return (
    <>
      <div className=''>
        <h2>Chat Chit</h2>
        <p>Not signed in</p>
        <button onClick={() => signIn()}>Sign in</button>
      </div>
    </>
  )
}