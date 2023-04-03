import { GetServerSideProps } from "next"
import { useState, useMemo, useCallback } from "react"
import { Asset, GetAssets, GetUnits, GetUsers, Unit, User } from "@/api/fakeapi"
import { SortByHealth } from "@/utils/assets/sorting"
import { AssetStatusMap, getHealthColor } from "@/utils/assets/display"

import Link from "next/link"
import Image from "next/image"
import Meta from "antd/lib/card/Meta"


import { BsFillBarChartFill } from "react-icons/bs"
import { Grid } from "@/components/Grid"
import { Button, Card, Dropdown } from "antd"
import { ContentLayout } from "@/components/ContentLayout"
import { useFilterModal } from "@/hooks/filterModal"
import { FaPlus } from "react-icons/fa"
import { EditableLabel } from "@/components/EditableLabel"
import { useTaskModal } from "@/hooks/taskModal"

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

function AssetCard({ assetProps: { name, image, status, healthscore, unitId, assignedUserIds }, units, users, WaitForConfirmation }: { assetProps: Asset, units: Unit[], users: User[], WaitForConfirmation: (userFilter: number[]) => Promise<number> }) {
  const [currentStatus, setCurrentStatus] = useState(status);
  const [currentUnit, setCurrentUnit] = useState(unitId);

  const [extraUsers, setExtraUsers] = useState<number[]>([]);

  const HandleNewTask = useCallback((promise: Promise<number>) => {
    promise.then((newId) => {
      const newUsers = [...extraUsers, newId]
      setExtraUsers(newUsers)
    })
  }, [extraUsers])

  return (
    <>
      <Card
        bodyStyle={{ padding: 0 }}
        className={`overflow-hidden justify-self-center w-full md:max-w-[14rem]`}
        cover={<Image priority width={250} height={224} className="object-cover" alt={name} src={image} />}
      >
        <Meta className='p-4 pb-5 lg:p-6'
          title={(
            <EditableLabel className="items-center" initialText={name}>
              {({ content }) => (
                <>{content}</>
              )}
            </EditableLabel>
          )}
          description={(
            <div className="flex text-xs lg:text-sm flex-col gap-2 font-bold">
              <div>
                <span className="text-black">Status: </span>
                <Dropdown className="cursor-pointer" menu={{ items: Object.entries(AssetStatusMap).map(([key, value]) => ({ label: value, key, onClick: () => setCurrentStatus(key as any) })) }} trigger={['click']}>
                  {AssetStatusMap[currentStatus]}
                </Dropdown>
              </div>
              <div>
                <EditableLabel type="number" className="items-center" initialText={healthscore.toString()}>
                  {({ content }) => (
                    <>
                      <span className="text-black">Health: </span>
                      <span style={{ color: getHealthColor(Number(content)) }}>{content}%</span>
                    </>
                  )}
                </EditableLabel>
              </div>
              <div>
                <span className="text-black">Unit: </span>
                <Dropdown className="cursor-pointer" menu={{ items: units.map(({ name, id }) => ({ label: name, key: id, onClick: () => setCurrentUnit(id as any) })) }} trigger={['click']}>
                  <span>{units.find(({ id }) => id === currentUnit)!.name}</span>
                </Dropdown>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-black">Assigned Users: </span>
                {[...extraUsers, ...assignedUserIds].map((userId, index) => (
                  <Link onClick={(e) => e.stopPropagation()} href={`/users/${userId}`} className="contents" key={`${userId}-${index}`}>
                    {users.find(({ id }) => id == userId)?.name + (index === [...extraUsers, ...assignedUserIds].length - 1 ? '' : ', ')}
                  </Link>
                ))}
              </div>
              <Button onClick={() => HandleNewTask(WaitForConfirmation([...extraUsers, ...assignedUserIds]))} className="w-full mt-3">
                <FaPlus />
              </Button>
            </div>
          )} />
      </Card>
    </>
  )
}

function AssetGrid({ assets, units, users, WaitForConfirmation }: { assets: Asset[], units: Unit[], users: User[], WaitForConfirmation: (userFilter: number[]) => Promise<number> }) {
  return (
    <Grid className="p-3">
      <>
        {SortByHealth(assets).map((props) => (
          <AssetCard WaitForConfirmation={WaitForConfirmation} key={`card-${props.id}`} assetProps={props} units={units} users={users} />
        ))}
      </>
    </Grid>
  )
}

export default function Assets({ assets, users, units }: ServerSideReturn) {

  const { ModalComponent: TaskModal, WaitForConfirmation } = useTaskModal({ users });

  const { ModalComponent, SearchComponent, selectedOptions, setSelectedOptions, WaitForOptionSelect, RemoveOption, Confirm, CloseModal } = useFilterModal({
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
          {TaskModal}
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
              <AssetGrid WaitForConfirmation={WaitForConfirmation} assets={filteredAssets} units={units} users={users} />
            ) : (
              <span className="h-full text-4xl font-semibold flex -mt-14 justify-center items-center">No assets found.</span>
            )}
          </Body>
        </>
      )
      }
    </ContentLayout >
  )
}