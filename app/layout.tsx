import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Provider  from '@/components/provider/client-provider';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Chat Chit',
  description: 'A simple social chat app',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider session={session}>
          {children}
        </Provider>
      </body>
    </html>
  )
}
