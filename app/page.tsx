import { redirect } from 'next/navigation'

export default function HomePage() {
  redirect('/packaging?tab=started')
}
