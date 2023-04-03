import { GetServerSideProps } from "next"
import { useState, useEffect, useMemo } from "react"
import { Asset, GetAssets, GetUnit, GetUnits, GetUsers, Unit, User } from "@/api/fakeapi"
import { SortByHealth } from "@/utils/assets/sorting"
import { AssetStatusMap, getHealthColor } from "@/utils/assets/display"

import Link from "next/link"
import Image from "next/image"
import Meta from "antd/lib/card/Meta"

import Search from "antd/lib/input/Search"
import { BsFillBarChartFill } from "react-icons/bs"
import { Grid } from "@/components/Grid"
import { Button, Card } from "antd"
import { ContentLayout } from "@/components/ContentLayout"
import { useOptionsModal } from "@/hooks/optionsModal"

type ServerSideReturn = {
  assets: Asset[]
  users: User[]
  units: Unit[]
}

export const getServerSideProps: GetServerSideProps<ServerSideReturn> = async (context) => {
  const [assets, users, units] = await Promise.all([GetAssets(), GetUsers(), GetUnits()]);

  return {
    props: {
      assets,
      users,
      units
    }
  }
}

export default function Assets({ assets, users, units }: ServerSideReturn) {

  const { ModalComponent, SearchComponent, selectedOptions, setSelectedOptions, WaitForOptionSelect, RemoveOption, Confirm, CloseModal } = useOptionsModal({
    options: {
      assets: assets.map(({ name }) => name),
      users: users.map(({ name }) => name),
      units: units.map(({ name }) => name),
    },
    optionLabels: [
      'Assets',
      'Assigned Users',
      'Units'
    ],
    modalProps: {
      footer: [
        <Button key="back" onClick={() => CloseModal()}>Cancel</Button>,
        <Button key="filter" onClick={() => Confirm()} type="primary">Filter</Button>,
      ]
    }
  });

  const searchFilter = useMemo(() => Object.values(selectedOptions).flat(), [selectedOptions])

  const filteredAssets = useMemo(() => (
    searchFilter.length === 0 ? (
      assets
    ) : (
      assets.filter(({ assignedUserIds, unitId, name }) => (
        assignedUserIds.some((assignedId) => selectedOptions.users.includes(users.find(({ id }) => id === assignedId)!.name)
          || selectedOptions.units.includes(units.find(({ id }) => id === unitId)!.name)
          || selectedOptions.assets.includes(name)
        ))
      )
    )
  ), [assets, units, users, searchFilter.length, selectedOptions])

  return (
    <ContentLayout>
      {({ Header, Body }) => (
        <>
          {ModalComponent}
          <Header title="Assets" description="Click any asset to see more info." previousPage>
            <Link href="/assets/chart" className="md:flex-shrink-0 flex-1 lg:flex-none p-3 h-[inherit] flex items-center justify-center flex-col gap-2 bg-[#00000060] backdrop-blur rounded-lg border-white border-solid border-2">
              <BsFillBarChartFill className='w-5 h-5 md:w-7 md:h-7' />
              <span className='text-lg md:text-2xl text-center'>Chart Mode</span>
            </Link>
            <div className="p-3 flex flex-col gap-2 justify-center bg-[#00000060] backdrop-blur rounded-lg border-white border-solid border-2">
              <span className="text-base md:text-lg font-semibold text-white">Filter by assets/users:</span>
              {SearchComponent}
            </div>
          </Header>
          <Body>
            {filteredAssets.length > 0 ? (
              <Grid className="p-3 ">
                <>
                  {SortByHealth(filteredAssets).map(({ image, name, id, status, healthscore, assignedUserIds, unitId }) => (
                    <>
                      <Card
                        bodyStyle={{ padding: 0 }}
                        className={`hover:bg-slate-200 overflow-hidden justify-self-center w-full md:max-w-[14rem]`}
                        cover={<Image priority width={250} height={224} className="object-cover" alt={name} src={image} />}
                      >
                        <Meta className='p-4 pb-5 lg:p-6' title={name} description={(
                          <div className="flex text-xs lg:text-sm flex-col gap-2 font-bold">
                            <div>
                              <span className="text-black">Status: </span>{AssetStatusMap[status]}
                            </div>
                            <div>
                              <span className="text-black">Health: </span><span style={{ color: getHealthColor(healthscore) }}>{healthscore}%</span>
                            </div>
                            <div>
                              <span className="text-black">Unit: </span><span>{units.find(({ id }) => id === unitId)!.name}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-black">Assigned Users: </span>
                              {assignedUserIds.map((userId, index) => (
                                <Link onClick={(e) => e.stopPropagation()} href={`/users/${userId}`} className="contents" key={`${userId}-${index}`}>
                                  {users.find(({ id }) => id == userId)?.name + (index === assignedUserIds.length - 1 ? '' : ', ')}
                                </Link>
                              ))}
                            </div>
                          </div>
                        )} />
                      </Card>
                    </>
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