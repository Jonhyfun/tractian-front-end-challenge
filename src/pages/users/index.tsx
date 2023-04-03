import { Asset, Company, GetAssets, GetCompanies, GetUnits, GetUsers, Unit, User } from "@/api/fakeapi";
import { ContentLayout } from "@/components/ContentLayout";
import { GetServerSideProps } from "next";

import { Grid } from "@/components/Grid"
import { Button, Card, Select } from "antd"

import Meta from "antd/lib/card/Meta"

import { useMemo, useState, MouseEvent, Fragment } from 'react';
import Link from "next/link";
import Image from "next/image";
import { getHealthColor } from "@/utils/assets/display";

import { FiExternalLink } from 'react-icons/fi'
import { HandleCopy } from "@/utils/assets/interaction";
import { useOptionsModal } from "@/hooks/optionsModal";

import type { CustomTagProps } from 'rc-select/lib/BaseSelect';

import { GrFormClose } from 'react-icons/gr'


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

const tagRender = (props: Omit<CustomTagProps, 'onClose'> & { onClose: (label: string) => void }) => {
  const { label, value, closable, onClose } = props;

  const handleClick = (e: MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    onClose(label as string);
  };

  return (
    <span key={value} className="ant-select-selection-item">
      {label}
      {closable && (
        <span onClick={handleClick} className="ml-1 ant-select-selection-item-remove flex items-center">
          <GrFormClose size={14} />
        </span>
      )}
    </span>
  );
};

export default function Users({ users, assets, units, companies }: ServerSideReturn) {
  const [searchFilter, setSearchFilter] = useState<string[]>([]);

  const { ModalComponent, WaitForOptionSelect, RemoveOption, Confirm, CloseModal } = useOptionsModal({
    options: {
      Users: users.map(({ name }) => name),
      Companies: companies.map(({ name }) => name),
      Units: units.map(({ name }) => name)
    },
    modalProps: {
      footer: [
        <Button key="back" onClick={() => CloseModal()}>Cancel</Button>,
        <Button key="filter" onClick={() => Confirm()} type="primary">Filter</Button>,
      ]
    }
  });

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
    <ContentLayout
      title="Users"
      description={(
        <div className="flex flex-col gap-1">
          <span>Click any info to copy it to the clipboard.</span>
          <span>Click any asset to go to its page.</span>
        </div>
      )}
      previousPage
    >
      {({ Header, Body }) => (
        <Fragment>
          {ModalComponent}
          <Header>
            <div className="p-3 w-full md:w-auto flex flex-col gap-2 justify-center bg-[#00000060] backdrop-blur rounded-lg border-white border-solid border-2">
              <span className="text-base md:text-lg font-semibold text-white">Filter by company/unit/asset:</span>
              <Select
                dropdownRender={() => null as any}
                dropdownStyle={{ display: 'none' }}
                mode="multiple"
                onClick={((e) => {
                  e.preventDefault();
                  WaitForOptionSelect().then((result) => setSearchFilter(Object.values(result).flat()));
                })}
                placeholder="No filter"
                tagRender={(props) => tagRender({ ...props, onClose: ((option) => RemoveOption(option).then((result) => setSearchFilter(Object.values(result).flat()))) })}
                value={searchFilter.map((value) => ({ value }))}
                options={[...companies, ...units, ...assets].map(({ name }) => ({
                  label: name,
                  value: name
                }))}
              />
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
        </Fragment>
      )}
    </ContentLayout>
  )
}