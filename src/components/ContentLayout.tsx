import { PropsWithChildren, ReactElement, useCallback, useMemo } from "react"
import { GridHeader } from "./Grid"
import { GridTitle } from "./Grid/GridHeader"

type ChildRenderFunction<T = unknown> = (props: PropsWithChildren & T) => JSX.Element;

interface IContentLayout extends GridTitle {
  children: (props: { Header: ChildRenderFunction, Body: ChildRenderFunction<{ className?: string }> }) => ReactElement
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

  const Body = useCallback(({ children, className }: PropsWithChildren<{ className?: string }>) => (
    <div className={`h-full ${className}`}>
      {children}
    </div>
  ), [])

  const LayoutFunction = useCallback(({ children }: PropsWithChildren) => {
    return (
      <div className="flex h-[inherit] self-stretch flex-col gap-2 lg:-mt-4 max-w-[46.875rem] w-full">
        {children}
      </div>
    )
  }, [])

  return LayoutFunction({ children: children({ Header, Body }) })
}