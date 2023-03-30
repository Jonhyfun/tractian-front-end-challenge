import { PropsWithChildren, ReactElement, useCallback, useMemo } from "react"
import { GridHeader } from "./Grid"
import { GridTitle } from "./Grid/GridHeader"

type ChildRenderFunction = ({ children }: PropsWithChildren) => JSX.Element;

interface IContentLayout extends GridTitle {
  children: (props: { Header: ChildRenderFunction, Body: ChildRenderFunction }) => ReactElement
}

export function ContentLayout({ children, ...headerProps }: IContentLayout) {
  const Header = useCallback(({ children }: PropsWithChildren) => (
    <div className="flex flex-col md:flex-row justify-between gap-3 px-3">
      <GridHeader {...headerProps} />
      <div className="flex flex-row justify-between gap-3 md:contents">
        {children}
      </div>
    </div>
  ), [headerProps])

  const Body = useCallback(({ children }: PropsWithChildren) => (
    <div className="h-full">
      {children}
    </div>
  ), [])

  const LayoutFunction = useCallback(({ children }: PropsWithChildren) => {
    return (
      <div className="flex h-[inherit] self-stretch flex-col gap-2 lg:-mt-4 max-w-[750px] w-full">
        {children}
      </div>
    )
  }, [])

  return LayoutFunction({ children: children({ Header, Body }) })
}