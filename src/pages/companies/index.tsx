import { Company, GetCompanies, GetUnits, Unit } from "@/api/fakeapi";
import { ContentLayout } from "@/components/ContentLayout";
import { useFilterModal } from "@/hooks/optionsModal";
import { Button, Divider, List } from "antd";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useMemo } from "react";

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

export default function Companies({ companies, units }: ServerSideReturn) {
  const { ModalComponent, SearchComponent, selectedOptions, setSelectedOptions, WaitForOptionSelect, RemoveOption, Confirm, CloseModal } = useFilterModal({
    options: {
      companies: companies.map(({ name }) => name),
      units: units.map(({ name }) => name)
    },
    optionLabels: ['Companies', 'Units'],
    modalProps: {
      footer: [
        <Button key="back" onClick={() => CloseModal()}>Cancel</Button>,
        <Button key="filter" onClick={() => Confirm()} type="primary">Filter</Button>,
      ]
    }
  });

  const filteredCompanies = useMemo(() => (
    Object.values(selectedOptions).flat().length === 0 ? (
      companies
    ) : (
      companies.filter(({ name }) => (
        selectedOptions.companies.includes(name)
        || units.some(({ name }) => selectedOptions.units.includes(name))
      ))
    )
  ), [companies, selectedOptions, units])

  return (
    <ContentLayout>
      {({ Header, Body }) => (
        <>
          {ModalComponent}
          <Header title="Companies" previousPage>
            <div className="p-3 flex flex-col gap-2 justify-center bg-[#00000060] backdrop-blur rounded-lg border-white border-solid border-2">
              <span className="text-base md:text-lg font-semibold text-white">Filter by assets/users:</span>
              {SearchComponent}
            </div>
          </Header>
          <Body className="p-3">
            <div className="p-3 bg-[#00000060] backdrop-blur rounded-lg border-white border-solid border-2">
              <List
                itemLayout="horizontal"
                dataSource={filteredCompanies}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={<span className="text-white text-xl">{item.name}</span>}
                      description={(
                        <div className="flex flex-col gap-4">
                          <Divider style={{ borderBottom: '1px solid white', marginTop: '2px', marginBottom: '2px' }} />
                          <div className="flex gap-2 items-center">
                            <Link href={`/workorders?companies=${item.name}`}>
                              <Button>Work Orders</Button>
                            </Link>
                            <Divider style={{ borderLeft: '1px solid white' }} type="vertical" />
                            <Link href={`/assets?companies=${item.name}`}>
                              <Button>Assets</Button>
                            </Link>
                            <Divider style={{ borderLeft: '1px solid white' }} type="vertical" />
                            <Link href={`/users?companies=${item.name}`}>
                              <Button>Users</Button>
                            </Link>
                          </div>
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