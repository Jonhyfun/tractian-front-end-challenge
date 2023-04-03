import { GetAssets, GetCompany, GetUnit, GetUser, GetUsers, GetWorkOrders, User, UserWithReferences } from "@/api/fakeapi";
import { ContentLayout } from "@/components/ContentLayout";
import { HandleCopy } from "@/utils/assets/interaction";
import { Avatar, Badge, Checkbox, Descriptions } from "antd";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { FiExternalLink } from "react-icons/fi";

import { RxAvatar } from 'react-icons/rx'

import { Fragment } from 'react'
import { EditableLabel } from "@/components/EditableLabel";
import { TaskList } from "@/components/TaskList";

type ServerSideReturn = {
  user: UserWithReferences
  users: User[]
}

export const getServerSideProps: GetServerSideProps<ServerSideReturn> = async (context) => {
  const { query } = context;

  let user = await GetUser(query.id as string);

  const [unit, company, assets, workorders, users] = await Promise.all([GetUnit(user.unitId), GetCompany(user.companyId), GetAssets(), GetWorkOrders(), GetUsers()]);

  (user as UserWithReferences).unit = unit;
  (user as UserWithReferences).company = company;
  (user as UserWithReferences).assets = assets.filter(({ assignedUserIds }) => assignedUserIds.includes(user.id));
  (user as UserWithReferences).workorders = workorders.filter(({ assignedUserIds }) => assignedUserIds.includes(user.id));

  return {
    props: {
      user: user as UserWithReferences,
      users,
    }
  }
}

const Item = ({ label, content }: { label: string, content: string | JSX.Element }) => (
  <div className="flex flex-col gap-2 border-2 border-white border-solid p-3">
    <span className="font-semibold">{label}:</span>
    {typeof content === 'string' ? (
      <EditableLabel initialText={content}>
        {({ content }) => (
          <span className="hover:text-slate-400 cursor-pointer" onClick={() => HandleCopy(content, label)}>{content}</span>
        )}
      </EditableLabel>
    ) : (
      content
    )}
  </div>
)

export default function UserPage({ user, users }: ServerSideReturn) {
  return (
    <ContentLayout maxWidth="78rem">
      {({ Header, Body }) => (
        <>
          <Header title="User" description="Click any info to copy it to the clipboard." previousPage />
          <Body className="p-3">
            <div className="flex flex-col gap-8 w-full h-full bg-[#00000060] backdrop-blur rounded-lg border-white border-solid border-2 p-3">
              <div className="flex flex-col md:flex-row gap-6 w-full">
                <div className="flex flex-col self-center md:self-start items-center border-white border-solid border-2">
                  <Avatar className="bg-slate-600 rounded-none border-white border-solid border-0 border-b-2" shape="square" size={192} icon={<RxAvatar />} />
                  <EditableLabel parentClassName="bg-[#00000060] max-w-[196px] p-3 w-full" className="w-full text-center text-lg justify-center items-center" initialText={user.name}>
                    {({ content }) => (
                      <span>{content}</span>
                    )}
                  </EditableLabel>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 self-center md:self-start gap-2 p-3">
                  <Item label="Id" content={user.id.toString()} />
                  <Item label="Email" content={user.email} />
                  <Item label="Company" content={user.company.name} />
                  <Item label="Unit" content={(
                    <div className="flex gap-2">
                      <span className="hover:text-slate-400 cursor-pointer" onClick={() => HandleCopy(user.unit.name, 'Unit')}>
                        {user.unit.name}
                      </span>
                      <Link href={`/units?units=${user.unit.name}`}>
                        <FiExternalLink />
                      </Link>
                    </div>
                  )} />
                </div>
              </div>
              <div className="p-3 flex flex-col gap-2">
                <span className="text-xl font-semibold">Assignments:</span>
                <TaskList tasks={user.workorders.sort(({ status }) => status === 'in progress' ? -1 : 0)} users={users} />
              </div>
            </div>
          </Body>
        </>
      )}
    </ContentLayout>
  )
}