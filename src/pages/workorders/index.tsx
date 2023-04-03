import { Company, GetCompanies, GetUnits, Unit } from "@/api/fakeapi";
import { TaskCalendar } from "@/components/Calendar";
import { ContentLayout } from "@/components/ContentLayout";
import { GetServerSideProps } from "next";

type ServerSideReturn = {
  units: Unit[]
  companies: Company[]
}

export const getServerSideProps: GetServerSideProps<ServerSideReturn> = async (context) => {
  const [units, companies] = await Promise.all([GetUnits(), GetCompanies()]);

  return {
    props: {
      units,
      companies,
    }
  }
}

export default function WorkOrders() {
  return (
    <ContentLayout maxWidth="68rem">
      {({ Header, Body }) => (
        <>
          <Header title="Work Orders" />
          <Body className="p-3">
            <div className="p-3 flex flex-col gap-1 w-full h-full bg-[#00000060] backdrop-blur rounded-lg border-white border-solid border-2">

            </div>
          </Body>
        </>
      )}
    </ContentLayout>
  )
}