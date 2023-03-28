import Head from 'next/head'
import Image from 'next/image'

import { Card } from 'antd'
import Meta from 'antd/lib/card/Meta'

type NavigationPage = {
  title: string
  description: string
  src: string
}

const NavigationMap: NavigationPage[] = [ //? In the future this could be an API response cached on ISR or fetched by SSR
  {
    title: 'Assets',
    description: 'List all assets',
    src: '/cog.png'
  },
  {
    title: 'Users',
    description: 'List all users.',
    src: '/users.png'
  },
  {
    title: 'Units',
    description: 'List all units.',
    src: '/industry.png'
  },
  {
    title: 'Companies',
    description: 'List all companies.',
    src: '/companies.png'
  },
  {
    title: 'Service orders',
    description: 'List all service orders.',
    src: '/orders.png'
  },
]

export default function Home() {
  return (
    <>
      <div className='p-3 grid grid-cols-2 md:grid-cols-3 gap-6'>
        {NavigationMap.map(({ src, ...meta }, index) => (
          <Card
            key={meta.title}
            hoverable
            bodyStyle={{ padding: 0 }}
            className={`hover:bg-slate-200 justify-self-center w-[9.375rem] lg:w-[14rem] ${index == NavigationMap.length - 2 ? 'ml-0 md:ml-[100%]' : ''} ${index == NavigationMap.length - 1 ? 'ml-[100%]' : ''}`}
            cover={<img alt="Cog representing assets" src={src} />}
          >
            <Meta className='p-4 pb-5 lg:p-6' {...meta} />
          </Card>
        ))}
      </div>
    </>
  )
}
