import type { Metadata } from 'next'

import { NotFoundPage } from '@/components/pages/NotFoundPage'

export const metadata: Metadata = {
  title: { absolute: 'Pagina nu a fost găsită - CarFix Paint' },
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return <NotFoundPage />
}
