import type { Metadata } from 'next'
import ContactClient from './ContactClient'

export const metadata: Metadata = {
  title: `Contact — ${process.env.NEXT_PUBLIC_SITE_NAME ?? 'Immobilier'}`,
  description: 'Contactez-nous pour toute demande concernant nos biens immobiliers.',
}

export default ContactClient