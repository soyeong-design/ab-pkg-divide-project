import { AdminLayout } from '@/components/admin/AdminLayout'
import { PackagingCompleteContent } from '@/components/admin/PackagingCompleteContent'
import { MOCK_PACKAGING_REQUESTS } from '@/lib/mockData'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ id: string }>
}

export default async function PackagingCompletePage({ params }: Props) {
  const { id } = await params
  const request = MOCK_PACKAGING_REQUESTS.find(r => r.requestId === id)
  if (!request) notFound()

  return (
    <AdminLayout>
      <PackagingCompleteContent request={request} />
    </AdminLayout>
  )
}

export async function generateStaticParams() {
  return MOCK_PACKAGING_REQUESTS.map(r => ({ id: r.requestId }))
}
