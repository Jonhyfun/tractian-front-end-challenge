import { Asset, Unit, User, WorkOrder } from "@/api/fakeapi";
import { Badge, Checkbox, Descriptions, Dropdown } from "antd";
import { useState, useCallback, Fragment } from 'react';
import { RxTriangleDown } from "react-icons/rx";
import { EditableLabel } from "./EditableLabel";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";

export function TaskList({ tasks, users }: { tasks: WorkOrder[], users: User[] }) {
  const [currentStatus, setCurrentStatus] = useState<{ [key in string]: WorkOrder['status'] }>({});
  const [currentPriority, setCurrentPriority] = useState<{ [key in string]: WorkOrder['priority'] }>({});

  const [extraUserIds, setExtraUserIds] = useState<{ [key in string]: number[] }>({});

  const PossibleExtraUsers = useCallback((currentUserIds: number[]) => {
    return users.filter(({ id }) => !currentUserIds.includes(id))
  }, [users])

  const GetJoinedUsers = useCallback((originalUsers: number[], id: string) => {
    return [...(extraUserIds?.[id] ?? []), ...originalUsers]
  }, [extraUserIds])

  const HandleAddUsers = useCallback((id: string, newUserId: number) => {
    const newUsers = { ...extraUserIds, [id]: [...extraUserIds[id] ?? [], newUserId] }
    setExtraUserIds(newUsers)
  }, [extraUserIds])

  return (
    <Descriptions className="bg-white" bordered>
      {tasks.map(({ title, description, id, status, priority, checklist, assignedUserIds }, index) => (
        <Fragment key={`order-${id}-${status}`}>
          <Descriptions.Item label="Task" span={1}>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col">
                <EditableLabel className="items-center" initialText={title} textClassName="font-semibold">
                  {({ content }) => (
                    <span className="">{content}</span>
                  )}
                </EditableLabel>
                <EditableLabel className="items-center" initialText={description}>
                  {({ content }) => (
                    <span>{content}</span>
                  )}
                </EditableLabel>
              </div>
              <span>
                <span className="font-semibold">Assigned Users: </span>
                {GetJoinedUsers(assignedUserIds, id.toString()).map((userId, index) => (
                  <Link key={`user-${userId}}`} href={`/users/${userId}`}>
                    <span >{users.find(({ id }) => id === userId)!.name}{index !== (GetJoinedUsers(assignedUserIds, id.toString()).length - 1) ? ', ' : ''}</span>
                  </Link>
                ))}
                <Dropdown menu={{ items: PossibleExtraUsers(GetJoinedUsers(assignedUserIds, id.toString())).map(({ name, id: userId }, index) => ({ label: name, key: index, onClick: () => HandleAddUsers(id.toString(), userId) })) }} trigger={['click']}>
                  <FaPlus className="cursor-pointer ml-2 hover:text-link" />
                </Dropdown>
              </span>
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="Priority" span={3}>
            <Dropdown menu={{ items: [{ label: 'High', key: 'high', onClick: () => setCurrentPriority((current) => ({ ...current, [id]: 'high' })) }, { label: 'Medium', key: 'medium', onClick: () => setCurrentPriority((current) => ({ ...current, [id]: 'medium' })) }] }} trigger={['click']}>
              <div className="flex items-center gap-1 cursor-pointer">
                <Badge status={(currentPriority[id] ?? priority) === 'high' ? 'error' : 'processing'} text={(currentPriority[id] ?? priority)[0].toUpperCase() + (currentPriority[id] ?? priority).slice(1, (currentPriority[id] ?? priority).length)} />
                <RxTriangleDown className="cursor-pointer" />
              </div>
            </Dropdown>
          </Descriptions.Item>
          <Descriptions.Item label="Status" span={3}>
            <Dropdown menu={{ items: [{ label: 'Completed', key: 'completed', onClick: () => setCurrentStatus((current) => ({ ...current, [id]: 'completed' })) }, { label: 'In progress', key: 'in progress', onClick: () => setCurrentStatus((current) => ({ ...current, [id]: 'in progress' })) }] }} trigger={['click']}>
              <div className="flex items-center gap-1 cursor-pointer">
                <Badge status={(currentStatus[id] ?? status) === 'completed' ? 'success' : 'processing'} text={(currentStatus[id] ?? status)[0].toUpperCase() + (currentStatus[id] ?? status).slice(1, (currentStatus[id] ?? status).length)} />
                <RxTriangleDown className="cursor-pointer" />
              </div>
            </Dropdown>
          </Descriptions.Item>
          <Descriptions.Item label="Checklist" span={3}>
            <div className="flex flex-col">
              {checklist.map(({ completed, task }) => (
                <Checkbox className="ml-2 w-fit" key={task} defaultChecked={completed}>{task}</Checkbox>
              ))}
            </div>
          </Descriptions.Item>
          {index !== tasks.length - 1 && <Descriptions.Item span={3}><></></Descriptions.Item>}
        </Fragment>
      ))}
    </Descriptions>
  )
}