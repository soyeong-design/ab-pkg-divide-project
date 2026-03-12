import { AdminLayout } from '@/components/admin/AdminLayout'
import { PackagingDetailContent } from '@/components/admin/PackagingDetailContent'
import { MOCK_PACKAGING_ITEMS } from '@/lib/mockData'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ id: string }>
}

export default async function PackagingDetailPage({ params }: Props) {
  const { id } = await params
  const item = MOCK_PACKAGING_ITEMS.find(i => i.requestId === id)
  if (!item) notFound()

  return (
    <AdminLayout>
      <PackagingDetailContent item={item} />
    </AdminLayout>
  )
}

export async function generateStaticParams() {
  return MOCK_PACKAGING_ITEMS.map(i => ({ id: i.requestId }))
}
