import { Asset, GetAssets, GetUnits, GetUsers, GetWorkOrders, Unit, User, WorkOrder } from "@/api/fakeapi";
import { ContentLayout } from "@/components/ContentLayout";
import { EditableLabel } from "@/components/EditableLabel";
import { TaskList } from "@/components/TaskList";
import { Badge, Checkbox, Descriptions, Dropdown, Segmented } from "antd";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

import { useState, useMemo, Fragment, useCallback, useEffect } from 'react'
import { FaPlus } from "react-icons/fa";
import { RxTriangleDown } from "react-icons/rx";

type ServerSideReturn = {
  workorders: WorkOrder[]
  units: Unit[]
  assets: Asset[]
  users: User[]
}

export const getServerSideProps: GetServerSideProps<ServerSideReturn> = async (context) => {
  const [workorders, units, assets, users] = await Promise.all([GetWorkOrders(), GetUnits(), GetAssets(), GetUsers()]);

  return {
    props: {
      workorders,
      units,
      assets,
      users,
    }
  }
}



export default function WorkOrders({ workorders, units, assets, users }: ServerSideReturn) {
  const [selectedUnit, setSelectedUnit] = useState(units[0].id);


  const router = useRouter();

  const filteredWorkOrders = useMemo(() => (
    workorders.filter(({ assetId }) => assets.find(({ id }) => id === assetId)!.unitId === selectedUnit).sort(({ status }) => status === 'in progress' ? -1 : 0)
  ), [assets, selectedUnit, workorders])

  useEffect(() => {
    if (router.isReady) {
      if (router.query.units) {
        setSelectedUnit(units.find(({ name }) => name === router.query.units as string)!.id)
      }
    }
  }, [router.isReady, router.query.units, units])

  return (
    <ContentLayout maxWidth="78rem">
      {({ Header, Body }) => (
        <>
          <Header title="Work Orders" previousPage />
          <Body className="p-3">
            <div className="p-3 flex flex-col gap-6 w-full h-full bg-[#00000060] backdrop-blur rounded-lg border-white border-solid border-2">
              <Segmented
                onChange={(value) => setSelectedUnit(value as number)}
                value={selectedUnit}
                options={units.map(({ name, id }) => ({ label: name, value: id }))}
                size="large"
              />
              <div className="flex flex-col gap-3 p-3">
                <TaskList tasks={filteredWorkOrders} users={users} />
              </div>
            </div>
          </Body>
        </>
      )
      }
    </ContentLayout >
  )
}