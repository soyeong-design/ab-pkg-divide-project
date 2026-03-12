import { type ReactNode } from 'react'
import { Sidebar } from './Sidebar'

export function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen max-w-[1240px] mx-auto w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {children}
      </div>
    </div>
  )
}
