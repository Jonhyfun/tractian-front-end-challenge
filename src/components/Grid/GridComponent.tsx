import { PropsWithChildren } from "react";

interface IGrid {
  className?: string
}

export function GridComponent({ children, className }: PropsWithChildren<IGrid>) {
  return (
    <div className={`p-3 grid grid-cols-2 md:grid-cols-3 gap-6 ${className}`}>
      {children}
    </div>
  )
}