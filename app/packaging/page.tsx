import { Suspense } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { PackagingListContent } from '@/components/admin/PackagingListContent'

export default function PackagingPage() {
  return (
    <AdminLayout>
      <Suspense>
        <PackagingListContent />
      </Suspense>
    </AdminLayout>
  )
}
