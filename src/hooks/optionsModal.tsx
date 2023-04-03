import { useCallback, useEffect, useMemo } from "react"

import React, { useState } from 'react';
import { Checkbox, Divider, Modal, ModalProps, Radio } from 'antd';

type OptionsModalProps = {
  modalProps?: ModalProps
  options: {
    [key in string]: string[]
  }
}

export function useOptionsModal({ options, modalProps }: OptionsModalProps) {
  const [res, setResolve] = useState<(result: any) => {}>();

  const defaultOptions = useMemo(() => Object.keys(options).reduce((acc, key, index) => {
    acc[key] = [];
    return acc;
  }, {} as any), [options]);

  const [selectedOptionTab, setSelectedOptionTab] = useState<keyof typeof options>(Object.keys(options)[0]);

  const [selectedOptions, setSelectedOptions] = useState<typeof options>(defaultOptions)

  const ToggleOption = useCallback((key: string, option: string) => {
    setSelectedOptions((current) => ({
      ...current,
      [key]: current[key].includes(option) ? current[key].filter((value) => value !== option) : [...current[key], option]
    }))
  }, [])

  const RemoveOption: (option: string) => Promise<OptionsModalProps['options']> = useCallback((option: string) => {
    return new Promise((res) => {
      setSelectedOptions((current) => {
        let accumulator = {} as any;
        Object.entries(current).forEach(([key, value]) => {
          accumulator[key] = value.filter((_option) => _option !== option);
        })
        res(accumulator);
        return accumulator;
      })
    })
  }, [])

  const Confirm = useCallback(() => {
    res!(selectedOptions)
    setResolve(null as any)
  }, [res, selectedOptions])

  const CloseModal = useCallback(() => {
    setSelectedOptions(defaultOptions)
    res!(defaultOptions)
    setResolve(null as any)
  }, [defaultOptions, res])

  const WaitForOptionSelect: () => Promise<OptionsModalProps['options']> = useCallback(() => {
    return new Promise((res) => {
      setResolve(() => res);
    })
  }, [])

  const ModalComponent = useMemo(() => (
    <>
      <Modal closable={false} onCancel={Confirm} open={!!res} {...modalProps}>
        <div className="flex flex-col gap-4 min-h-[12.5rem] pb-5">
          <div className="flex flex-col">
            <Radio.Group value={selectedOptionTab} onChange={(e) => setSelectedOptionTab(e.target.value)}>
              {Object.keys(options).map((option) => (
                <Radio.Button key={`tab-${option}`} value={option}>{option}</Radio.Button>
              ))}
            </Radio.Group>
            <Divider />
          </div>
          <div className="flex flex-col gap-2">
            {options[selectedOptionTab].map((option, index) => (
              <Checkbox checked={selectedOptions[selectedOptionTab]?.includes(option)} onClick={() => ToggleOption(selectedOptionTab, option)} className="ml-3" key={`option-${index}`}>
                {option}
              </Checkbox>
            ))}
          </div>
        </div>
      </Modal>

    </>
  ), [Confirm, res, modalProps, selectedOptionTab, options, selectedOptions, ToggleOption])

  return {
    ModalComponent,
    WaitForOptionSelect,
    RemoveOption,
    Confirm,
    CloseModal
  }
}