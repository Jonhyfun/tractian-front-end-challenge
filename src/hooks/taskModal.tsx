import { User, WorkOrder } from '@/api/fakeapi';
import { EditableLabel } from '@/components/EditableLabel';
import { Badge, Button, Checkbox, Dropdown, Input, Modal, ModalProps, Select } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { useMemo, useState, useCallback } from 'react';
import { FaTimes } from 'react-icons/fa';
import { RxTriangleDown } from 'react-icons/rx';

type TaskModalProps = {
  modalProps?: ModalProps
  users: User[]
}

export function useTaskModal({ modalProps, users }: TaskModalProps) {
  const [res, setResolve] = useState<(props: any) => void>(null as any);
  const [userFilter, setUserFilter] = useState<number[]>([])

  const initialUser = useMemo(() => users.filter(({ id }) => !userFilter.includes(id)), [userFilter, users]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [currentStatus, setCurrentStatus] = useState<WorkOrder['status']>('in progress');
  const [currentPriority, setCurrentPriority] = useState<WorkOrder['priority']>('high');

  const [checkLists, setChecklists] = useState<{ [key in string]: string }>({});

  const WaitForConfirmation: (userFilter: number[]) => Promise<number> = useCallback((userFilter: number[]) => {
    setUserFilter(userFilter);
    return new Promise((res) => {
      setResolve(() => res)
    })
  }, [])

  const HandleCancel = useCallback(() => {
    setUserFilter([])
    setSelectedUser(null as any)
    setChecklists({})
    setCurrentPriority('high')
    setCurrentStatus('in progress')
    setResolve(null as any)
  }, [])

  const ModalComponent = useMemo(() => (
    <>
      <Modal closable={false} open={!!res} onCancel={HandleCancel} onOk={() => { res(selectedUser); setResolve(null as any) }} {...modalProps}>
        <div className='flex flex-col gap-4'>
          <span className='text-lg font-semibold'>Create New Work Order:</span>
          <div className='flex flex-col gap-3'>
            <div className='flex flex-col gap-1'>
              <span>User:</span>
              <Select placeholder="Select an user" value={selectedUser} onChange={(value) => setSelectedUser(value)} className='w-full' options={users.filter(({ id }) => !userFilter.includes(id)).map(({ name, id }) => ({ label: name, value: id }))} />
            </div>
            <div className='flex flex-col gap-1'>
              <span>Task:</span>
              <Input className='w-full' />
            </div>
            <div className='flex flex-col gap-1'>
              <span>Description:</span>
              <TextArea rows={4} className='w-full' />
            </div>
            <div className='flex flex-col gap-1'>
              <span>Status:</span>
              <Dropdown menu={{ items: [{ label: 'Completed', key: 'completed', onClick: () => setCurrentStatus('completed') }, { label: 'In progress', key: 'in progress', onClick: () => setCurrentStatus('in progress') }] }} trigger={['click']}>
                <div className="flex items-center gap-1 cursor-pointer">
                  <Badge status={currentStatus === 'completed' ? 'success' : 'processing'} text={currentStatus[0].toUpperCase() + currentStatus.slice(1, currentStatus.length)} />
                  <RxTriangleDown className="cursor-pointer" />
                </div>
              </Dropdown>
            </div>
            <div className='flex flex-col gap-1'>
              <span>Priority:</span>
              <Dropdown menu={{ items: [{ label: 'High', key: 'high', onClick: () => setCurrentPriority('high') }, { label: 'Medium', key: 'medium', onClick: () => setCurrentPriority('medium') }] }} trigger={['click']}>
                <div className="flex items-center gap-1 cursor-pointer">
                  <Badge status={currentPriority === 'high' ? 'error' : 'processing'} text={currentPriority[0].toUpperCase() + currentPriority.slice(1, currentPriority.length)} />
                  <RxTriangleDown className="cursor-pointer" />
                </div>
              </Dropdown>
            </div>
            <div className='flex flex-col gap-1'>
              <span>Checklist:</span>
              {Object.entries(checkLists).map(([key, value]) => (
                <div key={`check-${key}`} className='flex items-center gap-1'>
                  <EditableLabel onChange={(value) => setChecklists((current) => ({ ...current, [key]: value }))} className='items-center' initialText='Example Checklist Item'>
                    {({ content }) => (
                      <Checkbox>
                        {content}
                      </Checkbox>
                    )}
                  </EditableLabel>
                  <FaTimes className='hover:text-link cursor-pointer'
                    onClick={() => {
                      setChecklists((current) => {
                        let currentClone = { ...current }
                        delete currentClone[key]
                        return currentClone
                      })
                    }} />
                </div>
              ))}
              <Button onClick={() => setChecklists((current) => ({ ...current, [Object.keys(checkLists).length.toString()]: 'Example Checklist Item' }))} size='large'>
                Add Checklist Item
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  ), [checkLists, currentPriority, currentStatus, modalProps, res, selectedUser, userFilter, users])

  return {
    ModalComponent,
    WaitForConfirmation
  }
}