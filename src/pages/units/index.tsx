import { Company, GetAssets, GetCompanies, GetUnits, GetWorkOrders, Unit, WorkOrder } from "@/api/fakeapi";
import { ContentLayout } from "@/components/ContentLayout";
import { Divider, List } from "antd";
import { GetServerSideProps } from "next";
import Link from "next/link";

type ServerSideReturn = {
  units: Unit[]
  companies: Company[]
}

export const getServerSideProps: GetServerSideProps<ServerSideReturn> = async (context) => {
  const [units, companies] = await Promise.all([GetUnits(), GetCompanies(), GetWorkOrders(), GetAssets()]);

  return {
    props: {
      units,
      companies,
    }
  }
}

export default function Units({ units, companies }: ServerSideReturn) {
  return (
    <ContentLayout>
      {({ Header, Body }) => (
        <>
          <Header title="Units" previousPage />
          <Body className="p-3">
            <div className="p-3 bg-[#00000060] backdrop-blur rounded-lg border-white border-solid border-2">
              <List
                itemLayout="horizontal"
                dataSource={units.map((unitProps) => ({ ...unitProps, company: companies.find(({ id }) => id === unitProps.companyId)! }))}
                renderItem={(item, index) => (
                  <List.Item>
                    <List.Item.Meta
                      title={<span className="text-white">{item.name} ({item.company.name})</span>}
                      description={(
                        <div className="flex gap-2 items-center">
                          <Link className="text-white hover:text-link" href={`/workorders?unit=${item.name}`}>Work Orders</Link>
                          <Divider style={{ borderLeft: '1px solid white' }} type="vertical" />
                          <Link className="text-white hover:text-link" href={`/assets?unit=${item.name}`}>Assets</Link>
                          <Divider style={{ borderLeft: '1px solid white' }} type="vertical" />
                          <Link className="text-white hover:text-link" href={`/users?unit=${item.name}`}>Users</Link>
                        </div>
                      )}
                    />
                  </List.Item>
                )}
              />
            </div>
          </Body>
        </>
      )}
    </ContentLayout >
  )
}