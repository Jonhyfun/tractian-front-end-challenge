import { useCallback, useMemo, useEffect } from "react"

import React, { useState, MouseEvent } from 'react';
import { Checkbox, Divider, Modal, ModalProps, Segmented, Select } from 'antd';


import type { CustomTagProps } from 'rc-select/lib/BaseSelect';

import { GrFormClose } from 'react-icons/gr'
import { useRouter } from "next/router";

type OptionsModalProps = {
  modalProps?: ModalProps
  options: {
    [key in string]: string[]
  }
  optionLabels?: string[]
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

export function useFilterModal({ options, optionLabels, modalProps }: OptionsModalProps) {
  const [res, setResolve] = useState<(result: any) => {}>();

  const router = useRouter();

  const [selectedOptionTab, setSelectedOptionTab] = useState<keyof typeof options>(Object.keys(options)[0]);

  const defaultOptions = useMemo(() => Object.keys(options).reduce((acc, key, index) => {
    acc[key] = [];
    return acc;
  }, {} as any), [options]);

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


  useEffect(() => {
    if (router.isReady) {
      const optionKeys = Object.keys(options)
      Object.keys(router.query).forEach((queryKey) => {
        console.log(queryKey, optionKeys)
        if (optionKeys.includes(queryKey)) {
          setSelectedOptions((current) => ({
            ...current,
            [queryKey]: [router.query[queryKey] as string]
          }))
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, router.query])

  const ModalComponent = useMemo(() => (
    <>
      <Modal closable={false} onCancel={Confirm} open={!!res} {...modalProps}>
        <div className="flex flex-col gap-4 min-h-[12.5rem] pb-5">
          <div className="flex flex-col">
            <Segmented
              value={selectedOptionTab}
              onChange={(value) => setSelectedOptionTab(value as string)}
              className="select-none"
              options={optionLabels ? Object.keys(options).map((option, index) => ({ label: optionLabels[index], value: option })) : Object.keys(options)}
              block
            />
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
  ), [Confirm, res, modalProps, selectedOptionTab, optionLabels, options, selectedOptions, ToggleOption])

  const SearchComponent = useMemo(() => (
    <Select
      dropdownRender={() => null as any}
      dropdownStyle={{ display: 'none' }}
      mode="multiple"
      onClick={((e) => {
        e.preventDefault();
        WaitForOptionSelect();
      })}
      placeholder="No filter"
      tagRender={(props) => tagRender({ ...props, onClose: ((option) => RemoveOption(option)) })}
      value={Object.values(selectedOptions).flat().map((value) => ({ value }))}
      options={Object.values(defaultOptions).map((name) => ({
        label: name,
        value: name
      }))}
    />
  ), [RemoveOption, WaitForOptionSelect, defaultOptions, selectedOptions])

  return {
    ModalComponent,
    SearchComponent,
    selectedOptions,
    setSelectedOptions,
    WaitForOptionSelect,
    RemoveOption,
    Confirm,
    CloseModal
  }
}