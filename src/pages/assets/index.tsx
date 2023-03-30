import { GetServerSideProps } from "next"
import { useState, useEffect } from "react"
import { Asset, GetAssets } from "@/api/fakeapi"
import { Grid, GridHeader } from "@/components/Grid"
import { SortByHealth } from "@/utils/assets/sorting"
import { AssetStatusMap, getHealthColor } from "@/utils/assets/display"
import { Card } from "antd"

import Link from "next/link"
import Image from "next/image"
import Meta from "antd/lib/card/Meta"

import Search from "antd/lib/input/Search"
import { ContentLayout } from "@/components/ContentLayout"
import { BsFillBarChartFill } from "react-icons/bs"

type ServerSideReturn = {
  assets: Asset[]
}

export const getServerSideProps: GetServerSideProps<ServerSideReturn> = async (context) => {
  const assets = await GetAssets();

  return {
    props: {
      assets,
    }
  }
}

export default function Assets({ assets: allAssets }: ServerSideReturn) {
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [assets, setAssets] = useState(allAssets);

  useEffect(() => {
    if (searchFilter != '') {
      setAssets(allAssets.filter(({ name, model }) => name.toUpperCase().includes(searchFilter.toUpperCase()) || model.toUpperCase().includes(searchFilter.toUpperCase())))
    }
    else {
      setAssets(allAssets);
    }
  }, [allAssets, searchFilter])

  return (
    <ContentLayout title="Assets" description="Click any asset to see more info." previousPage="/" >
      {({ Header, Body }) => (
        <>
          <Header>
            <Link href="/assets/chart" className="md:flex-shrink-0 flex-1 lg:flex-none p-3 h-[inherit] flex items-center justify-center flex-col gap-2 bg-[#00000060] backdrop-blur rounded-lg border-white border-solid border-2">
              <BsFillBarChartFill className='w-5 h-5 md:w-7 md:h-7' />
              <span className='text-lg md:text-2xl text-center'>Chart Mode</span>
            </Link>
            <div className="p-3 flex flex-col gap-2 justify-center bg-[#00000060] backdrop-blur rounded-lg border-white border-solid border-2">
              <span className="text-base md:text-lg font-semibold text-white">Search Asset:</span>
              <Search placeholder="Motor X" onChange={({ target: { value } }) => setSearchFilter(value)} allowClear />
            </div>
          </Header>
          <Body>
            {assets.length > 0 ? (
              <Grid className="p-3 ">
                <>
                  {SortByHealth(assets).map(({ image, name, id, status, healthscore }) => (
                    <Link key={id} className="place-self-center contents" href="/assets">
                      <Card
                        hoverable
                        bodyStyle={{ padding: 0 }}
                        className={`hover:bg-slate-200 overflow-hidden justify-self-center w-full md:max-w-[14rem]`}
                        cover={<Image width={250} height={224} className="object-cover" alt={name} src={image} />}
                      >
                        <Meta className='p-4 pb-5 lg:p-6' title={name} description={(
                          <div className="flex text-xs lg:text-base flex-col gap-2 font-bold">
                            <div>
                              <span className="text-black">Status: </span>{AssetStatusMap[status]}
                            </div>
                            <div>
                              <span className="text-black">Health: </span><span style={{ color: getHealthColor(healthscore) }}>{healthscore}%</span>
                            </div>
                          </div>
                        )} />
                      </Card>
                    </Link>
                  ))}
                </>
              </Grid>
            ) : (
              <span className="h-full text-4xl font-semibold flex -mt-14 justify-center items-center">No assets found.</span>
            )}
          </Body>
        </>
      )}
    </ContentLayout>
  )
}