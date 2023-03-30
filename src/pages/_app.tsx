import '@/styles/globals.css'
import Link from 'next/link'

import { Tractian } from '@/components/Icons/Tractian'
import type { AppProps } from 'next/app'
import type { PropsWithChildren } from 'react'

import NextNProgress from 'nextjs-progressbar';

function Layout({ children }: PropsWithChildren) {
  return (
    <main className='w-full pt-12 min-h-screen flex justify-center items-center bg-gradient-to-l from-blue-600 to-blue-900'>
      <nav className='absolute top-0 left-0'>
        <Link href="/">
          <Tractian className='w-36 h-12 ml-3 cursor-pointer' />
        </Link>
      </nav>
      {children}
    </main>
  )
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <NextNProgress />
      <Component {...pageProps} />
    </Layout>
  )
}
