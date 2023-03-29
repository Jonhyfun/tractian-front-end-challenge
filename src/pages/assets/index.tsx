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
    <div className="flex h-[inherit] self-stretch flex-col gap-2 lg:-mt-4 max-w-[750px] w-full">
      <div className="flex justify-between gap-3 px-3">
        <GridHeader title="Assets" description="Click any asset to see more info." previousPage="/" />
        <div className="p-3 flex flex-col gap-2 justify-center bg-[#00000060] backdrop-blur rounded-lg border-white border-solid border-2">
          <span className="text-base md:text-lg font-semibold text-white">Search Asset:</span>
          <Search placeholder="Motor X" onChange={({ target: { value } }) => setSearchFilter(value)} allowClear />
        </div>
      </div>
      <div className="h-full">
        {assets.length > 0 ? (
          <Grid>
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
      </div>
    </div>
  )
}