import Link from "next/link"

import { FaArrowLeft } from 'react-icons/fa'

export type GridTitle = {
  title: string
  description?: string
  previousPage?: string
}

export function GridHeader({ title, description, previousPage }: GridTitle) {
  return (
    <div className="flex gap-3 items-stretch text-white text-xl md:text-3xl font-semibold">
      {previousPage && (
        <Link className="flex items-center h-[inherit] bg-[#00000060] backdrop-blur rounded-lg border-white border-solid border-2 p-1.5 px-3" href={previousPage}>
          <FaArrowLeft color="white" />
        </Link>
      )}
      <div className="flex w-full md:w-[auto] h-full items-stretch flex-col gap-2">
        <div className="p-1.5 px-3 h-[inherit] flex justify-center flex-col gap-2 bg-[#00000060] backdrop-blur rounded-lg border-white border-solid border-2">
          {title}
          {description && <span className="text-sm sm:text-base text-white">{description}</span>}
        </div>
      </div>
    </div>
  )
}