import { Grid } from '@/components/Grid'
import { Card } from 'antd'
import Meta from 'antd/lib/card/Meta'
import Link from 'next/link'

type NavigationPage = {
  title: string
  description: string
  href: string
  src: string
}

const NavigationMap: NavigationPage[] = [ //? In the future this could be an API response cached on ISR or fetched by SSR
  {
    title: 'Assets',
    description: 'List all assets',
    href: '/assets',
    src: '/cog.png'
  },
  {
    title: 'Users',
    description: 'List all users.',
    href: '/users',
    src: '/users.png'
  },
  {
    title: 'Units',
    description: 'List all units.',
    href: '/units',
    src: '/industry.png'
  },
  {
    title: 'Companies',
    description: 'List all companies.',
    href: '/companies',
    src: '/companies.png'
  },
  {
    title: 'Work orders',
    description: 'List all work orders.',
    href: '/workorders',
    src: '/orders.png'
  },
]

export default function Home() {
  return (
    <>
      <Grid>
        {NavigationMap.map(({ src, href, ...meta }) => (
          <Link key={meta.title} href={href}>
            <Card
              hoverable
              bodyStyle={{ padding: 0 }}
              className={`hover:bg-slate-200 justify-self-center w-[9.375rem] lg:w-[14rem]`}
              cover={<img alt={meta.title} src={src} />}
            >
              <Meta className='p-4 pb-5 lg:p-6' {...meta} />
            </Card>
          </Link>
        ))}
      </Grid>
    </>
  )
}
