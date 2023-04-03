import { Asset, Company, GetAssets, GetCompanies, GetUnits, GetUsers, Unit, User } from "@/api/fakeapi";
import { ContentLayout } from "@/components/ContentLayout";
import { GetServerSideProps } from "next";

import { Grid } from "@/components/Grid"
import { Button, Card } from "antd"

import Meta from "antd/lib/card/Meta"

import { useMemo, Fragment } from 'react';
import Link from "next/link";
import Image from "next/image";
import { getHealthColor } from "@/utils/assets/display";

import { FiExternalLink } from 'react-icons/fi'
import { HandleCopy } from "@/utils/assets/interaction";
import { useFilterModal } from "@/hooks/optionsModal";

import { useRouter } from "next/router";


type ServerSideReturn = {
  assets: Asset[]
  users: User[]
  units: Unit[]
  companies: Company[]
}

export const getServerSideProps: GetServerSideProps<ServerSideReturn> = async (context) => {
  const [assets, users, units, companies] = await Promise.all([GetAssets(), GetUsers(), GetUnits(), GetCompanies()]);

  return {
    props: {
      assets,
      users,
      units,
      companies,
    }
  }
}

export default function Users({ users, assets, units, companies }: ServerSideReturn) {
  const router = useRouter();

  const { ModalComponent, SearchComponent, selectedOptions, setSelectedOptions, WaitForOptionSelect, RemoveOption, Confirm, CloseModal } = useFilterModal({
    options: {
      users: users.map(({ name }) => name),
      companies: companies.map(({ name }) => name),
      units: units.map(({ name }) => name)
    },
    optionLabels: ['Users', 'Companies', 'Units'],
    modalProps: {
      footer: [
        <Button key="back" onClick={() => CloseModal()}>Cancel</Button>,
        <Button key="filter" onClick={() => Confirm()} type="primary">Filter</Button>,
      ]
    }
  });

  const searchFilter = useMemo(() => Object.values(selectedOptions).flat(), [selectedOptions])

  const usersWithReferences = useMemo(() => (
    users.map((user) => (
      {
        ...user,
        userAssets: assets.filter(({ assignedUserIds }) => assignedUserIds.includes(user.id)),
        unit: units.find(({ id }) => id == user.unitId)!,
        company: companies.find(({ id }) => id == user.companyId)!,
      }
    ))
  ), [assets, companies, units, users])

  const filteredUsers = useMemo(() => (
    searchFilter.length === 0 ? usersWithReferences : (
      usersWithReferences.filter(({ userAssets, unit, company, name }) => (
        userAssets.filter(({ name }) => searchFilter.includes(name)).length > 0
        || searchFilter.includes(unit.name)
        || searchFilter.includes(company.name)
        || searchFilter.includes(name)
      ))
    )
  ), [searchFilter, usersWithReferences])

  return (
    <ContentLayout>
      {({ Header, Body }) => (
        <Fragment>
          {ModalComponent}
          <Header title="Users"
            description={(
              <div className="flex flex-col gap-1">
                <span>Click any info to copy it to the clipboard.</span>
                <span>Click any asset to go to its page.</span>
              </div>
            )}
            previousPage
          >
            <div className="p-3 w-full md:w-auto flex flex-col gap-2 justify-center bg-[#00000060] backdrop-blur rounded-lg border-white border-solid border-2">
              <span className="text-base md:text-lg font-semibold text-white">Filter by company/unit/asset:</span>
              {SearchComponent}
            </div>
          </Header>
          <Body>
            <Grid className="p-3 ">
              <>
                {filteredUsers.map(({ name, email, company, unit, userAssets, id }) => {
                  return (
                    <Card
                      key={email}
                      bodyStyle={{ padding: 0 }}
                      className={`overflow-hidden justify-self-center w-full md:max-w-[14rem]`}
                    >
                      <Meta className='p-4 pb-5 lg:p-6'
                        title={(
                          <div className="flex w-full justify-between">
                            <span>{name}</span>
                            <Link href={`users/${id}`}>
                              <FiExternalLink />
                            </Link>
                          </div>
                        )}
                        description={(
                          <div className="flex text-xs lg:text-sm flex-col gap-2 font-bold">
                            <div onClick={() => HandleCopy(company.name, 'Company')} className="hover:text-black cursor-pointer">
                              <span className="text-black">Company: </span>{company.name}
                            </div>
                            <div className="flex gap-2">
                              <span className="hover:text-black cursor-pointer" onClick={() => HandleCopy(unit.name, 'Unit')}>
                                <span className="text-black">Unit: </span>{unit.name}
                              </span>
                              <Link href={`/units?units=${unit.name}`}>
                                <FiExternalLink />
                              </Link>
                            </div>
                            <div onClick={() => HandleCopy(email, 'Email')} className="hover:text-black cursor-pointer">
                              <span className="text-black">Email: </span>{email}
                            </div>
                            <div className="flex flex-col gap-2">
                              <span className="text-black">Assigned Assets: </span>
                              {userAssets.map(({ name: assetName, id, image, healthscore }) => (
                                <Link key={`${id}-${email}`} className="flex gap-1 items-center text-sm" href={`/assets/${id}`}>
                                  <Image alt={assetName} priority width={24} height={24} className="object-cover rounded-full" src={image} />
                                  <span className="whitespace-break-spaces">
                                    {assetName}{' '}
                                    (<span style={{ color: getHealthColor(healthscore) }}>{healthscore}%</span>)
                                  </span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        )} />
                    </Card>
                  )
                })}
              </>
            </Grid>
          </Body>
        </Fragment>
      )}
    </ContentLayout>
  )
}