import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon'
import type { SiteInfoView } from '@/lib/cms-types'
import { buildWhatsAppLink } from '@/lib/whatsapp'

/** Server Component — no hydration cost on the critical path. */
export function FloatingActions({ company }: { company: SiteInfoView }) {
  const whatsappLink = buildWhatsAppLink(company.whatsappNumber, company.whatsappMessage)

  return (
    <>
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 hidden h-14 w-14 items-center justify-center rounded-full bg-[#075E54] text-white shadow-lg transition-transform hover:scale-110 hover:bg-[#064E46] hover:shadow-xl md:flex"
        aria-label="Scrie-ne pe WhatsApp"
      >
        <WhatsAppIcon size={28} />
      </a>

      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-0 left-0 right-0 z-40 bg-[#075E54] text-white shadow-lg md:hidden"
      >
        <div className="container flex items-center justify-center gap-2 py-3">
          <WhatsAppIcon size={22} />
          <span className="text-lg font-semibold text-white">Scrie-ne pe WhatsApp</span>
        </div>
      </a>
    </>
  )
}
