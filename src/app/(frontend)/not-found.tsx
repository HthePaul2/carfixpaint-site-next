import type { Metadata } from 'next'
import Link from 'next/link'

import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: { absolute: 'Pagina nu a fost găsită - CarFix Paint' },
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="text-sm uppercase tracking-widest text-muted-foreground">404</p>
      <h1 className="text-3xl font-semibold">Pagina nu a fost găsită</h1>
      <p className="max-w-md text-muted-foreground">
        Linkul pe care l-ai accesat nu există sau a fost mutat.
      </p>
      <Button asChild>
        <Link href="/">Înapoi acasă</Link>
      </Button>
    </div>
  )
}
