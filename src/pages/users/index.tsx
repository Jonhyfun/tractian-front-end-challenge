import { Asset, Company, GetAssets, GetCompanies, GetUnits, GetUsers, Unit, User } from "@/api/fakeapi";
import { ContentLayout } from "@/components/ContentLayout";
import { GetServerSideProps } from "next";

import { Grid } from "@/components/Grid"
import { Card, Select } from "antd"

import Meta from "antd/lib/card/Meta"
import toast from 'react-hot-toast';

import { useCallback, useMemo, useState } from 'react';
import Link from "next/link";
import Image from "next/image";
import { getHealthColor } from "@/utils/assets/display";


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
  const [searchFilter, setSearchFilter] = useState('No filter');

  const HandleCopy = useCallback((content: string, prepend: string) => {
    navigator.clipboard.writeText(content).then(() => {
      toast.success(`${prepend} coppied to clipboard with success!`);
    }).catch(() => {
      toast.error("Error when copying to clipboard.")
    });
  }, [])

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
    searchFilter === "No filter" ? usersWithReferences : (
      usersWithReferences.filter(({ userAssets, unit, company }) => (
        userAssets.filter(({ name }) => name === searchFilter).length > 0 || unit.name === searchFilter || company.name === searchFilter
      ))
    )
  ), [searchFilter, usersWithReferences])

  return (
    <ContentLayout
      title="Users"
      description={(
        <div className="flex flex-col gap-1">
          <span>Click any info to copy it to the clipboard.</span>
          <span>Click the asset to go to its page.</span>
        </div>
      )}
      previousPage
    >
      {({ Header, Body }) => (
        <>
          <Header>
            <div className="p-3 flex flex-col gap-2 justify-center bg-[#00000060] backdrop-blur rounded-lg border-white border-solid border-2">
              <span className="text-base md:text-lg font-semibold text-white">Filter by company/unit/asset:</span>
              <Select
                defaultValue="No filter"
                showSearch
                value={searchFilter}
                onSelect={(selection) => setSearchFilter(selection)}
                options={[{ name: 'No filter', id: 0 }, ...companies, ...units, ...assets].map(({ name }) => ({
                  label: name,
                  value: name
                }))}
              />
            </div>
          </Header>
          <Body>
            <Grid className="p-3 ">
              <>
                {filteredUsers.map(({ name, email, company, unit, userAssets }) => {
                  return (
                    <Card
                      key={email}
                      bodyStyle={{ padding: 0 }}
                      className={`overflow-hidden justify-self-center w-full md:max-w-[14rem]`}
                    >
                      <Meta className='p-4 pb-5 lg:p-6' title={name} description={(
                        <div className="flex text-xs lg:text-sm flex-col gap-2 font-bold">
                          <div onClick={() => HandleCopy(company.name, 'Company')} className="hover:text-black cursor-pointer">
                            <span className="text-black">Company: </span>{company.name}
                          </div>
                          <div onClick={() => HandleCopy(unit.name, 'Unit')} className="hover:text-black cursor-pointer">
                            <span className="text-black">Unit: </span>{unit.name}
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
        </>
      )}
    </ContentLayout>
  )
}