import { Company, GetCompanies, GetUnits, GetWorkOrders, Unit, WorkOrder } from "@/api/fakeapi";
import { TaskCalendar } from "@/components/Calendar";
import { ContentLayout } from "@/components/ContentLayout";
import { Segmented } from "antd";
import { GetServerSideProps } from "next";

type ServerSideReturn = {
  workorders: WorkOrder[]
  units: Unit[]
  companies: Company[]
}

export const getServerSideProps: GetServerSideProps<ServerSideReturn> = async (context) => {
  const [workorders, units, companies] = await Promise.all([GetWorkOrders(), GetUnits(), GetCompanies()]);

  return {
    props: {
      workorders,
      units,
      companies,
    }
  }
}

export default function WorkOrders({ workorders, companies, units }: ServerSideReturn) {
  return (
    <ContentLayout maxWidth="68rem">
      {({ Header, Body }) => (
        <>
          <Header title="Work Orders" previousPage />
          <Body className="p-3">
            <div className="p-3 flex flex-col gap-1 w-full h-full bg-[#00000060] backdrop-blur rounded-lg border-white border-solid border-2">
              <Segmented
                options={units.map(({ name, id }) => ({ label: name, value: id }))}
                size="large"
              />
              <div className="flex flex-col gap-3">
                {workorders.map(({ title, id }) => (
                  <span key={`order-${id}`}>{title}</span>
                ))}
              </div>
            </div>
          </Body>
        </>
      )}
    </ContentLayout>
  )
}