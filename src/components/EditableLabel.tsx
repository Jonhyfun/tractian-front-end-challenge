import { Button, Input, InputRef, Space } from "antd"
import { useState, useRef, useCallback, useEffect } from 'react'
import { FaEdit } from "react-icons/fa"

type EditableLabelProps = {
  textClassName?: string
  className?: string
  parentClassName?: string
  type?: HTMLInputElement['type']
  onChange?: (value: string) => void
  initialText: string
  children: (props: { content: string }) => JSX.Element
}

export function EditableLabel({ initialText, parentClassName, textClassName, className, children, onChange, type = 'text' }: EditableLabelProps) {
  const [editing, setEditing] = useState(false);
  const [currentText, setCurrentText] = useState(initialText);

  const inputRef = useRef<InputRef>(null);

  const HandleEdit = useCallback(() => {
    setCurrentText(inputRef.current!.input!.value)
    setEditing(false);
  }, [])

  return (
    <div className={parentClassName}>
      {editing ? (
        <Space.Compact style={{ width: '100%' }}>
          <Input ref={inputRef} type={type} onChange={onChange ? (e) => onChange(e.target.value!) : undefined} defaultValue={initialText} />
          <Button onClick={(e) => { e.stopPropagation(); HandleEdit() }} type="primary">Save</Button>
        </Space.Compact>
      ) : (
        <div className={`flex gap-2 ${className}`}>
          <span className={textClassName}>
            {children({ content: currentText })}
          </span>
          <FaEdit className="flex-shrink-0 cursor-pointer hover:text-link" onClick={(e) => { e.stopPropagation(); setEditing(true) }} />
        </div>
      )}
    </div>
  )
}