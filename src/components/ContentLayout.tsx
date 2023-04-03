import { PropsWithChildren, ReactElement, useCallback, useMemo } from "react"
import { GridHeader } from "./Grid"
import { GridTitle } from "./Grid/GridHeader"

type ChildRenderFunction<T = unknown> = (props: PropsWithChildren & T) => JSX.Element;

type HeaderType<> = ChildRenderFunction<GridTitle>;

type BodyType = ChildRenderFunction<{ className?: string }>;

interface IContentLayout {
  children: (props: { Header: HeaderType, Body: BodyType }) => ReactElement
}

const Header: HeaderType = ({ children, ...headerProps }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between gap-3 px-3" >
      <GridHeader {...headerProps} />
      <div className="flex flex-row justify-between gap-3 md:contents">
        {children}
      </div>
    </div>
  )
}

const Body: BodyType = ({ children, className }) => {
  return (
    <div className={`h-full ${className}`}>
      {children}
    </div>
  )
}

export function ContentLayout({ children }: IContentLayout) {

  const LayoutFunction = useCallback(({ children }: PropsWithChildren) => {
    return (
      <div className="flex h-[inherit] self-stretch flex-col gap-2 lg:-mt-4 max-w-[46.875rem] w-full">
        {children}
      </div>
    )
  }, [])

  return LayoutFunction({ children: children({ Header, Body }) })
}