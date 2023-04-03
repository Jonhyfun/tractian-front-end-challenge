import { GetAssets, GetCompany, GetUnit, GetUser, UserWithReferences } from "@/api/fakeapi";
import { ContentLayout } from "@/components/ContentLayout";
import { HandleCopy } from "@/utils/assets/interaction";
import { Avatar } from "antd";
import { GetServerSideProps } from "next";

import { RxAvatar } from 'react-icons/rx'

type ServerSideReturn = {
  user: UserWithReferences
}

export const getServerSideProps: GetServerSideProps<ServerSideReturn> = async (context) => {
  const { query } = context;

  let user = await GetUser(query.id as string);

  const [unit, company, assets] = await Promise.all([GetUnit(user.unitId), GetCompany(user.companyId), GetAssets()]);

  (user as UserWithReferences).unit = unit;
  (user as UserWithReferences).company = company;
  (user as UserWithReferences).assets = assets.filter(({ assignedUserIds }) => assignedUserIds.includes(user.id));

  return {
    props: {
      user: user as UserWithReferences,
    }
  }
}

const Item = ({ label, content }: { label: string, content: string }) => (
  <div className="flex flex-col gap-2 border-2 border-white border-solid p-3">
    <span className="font-semibold">{label}:</span>
    <span className="hover:text-slate-400 cursor-pointer" onClick={() => HandleCopy(content, label)}>{content}</span>
  </div>
)

export default function UserPage({ user }: ServerSideReturn) {
  return (
    <ContentLayout title="User" description="Click any info to copy it to the clipboard." previousPage>
      {({ Header, Body }) => (
        <>
          <Header />
          <Body className="p-3">
            <div className="flex gap-6 w-full h-full bg-[#00000060] backdrop-blur rounded-lg border-white border-solid border-2 p-3">
              <div className="flex flex-col self-start items-center border-white border-solid border-2">
                <Avatar className="bg-slate-600 rounded-none border-white border-solid border-0 border-b-2" shape="square" size={192} icon={<RxAvatar />} />
                <span className="p-3 bg-[#00000060] w-full text-center text-lg">{user.name}</span>
              </div>
              <div className="grid grid-cols-2 self-start gap-2 p-3">
                <Item label="Id" content={user.id.toString()} />
                <Item label="Email" content={user.email} />
                <Item label="Company" content={user.company.name} />
                <Item label="Unit" content={user.unit.name} />
              </div>
            </div>
          </Body>
        </>
      )}
    </ContentLayout>
  )
}