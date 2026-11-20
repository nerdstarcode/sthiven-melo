import { motion } from 'motion/react'
import Image from 'next/image'
import type { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'
import { GithubIcon, LinkedInIcon } from '@/components/atoms/Icon'
import { GITHUB_URL, INSTAGRAM_URL, LINKEDIN_URL } from '@/constants/social'
import instagramLogo from '@p/insta.svg'

export type SocialNetwork = 'instagram' | 'github' | 'linkedin'

const SOCIAL_LINKS: Record<SocialNetwork, { label: string; href: string; icon: ReactNode }> = {
  instagram: {
    label: 'Instagram',
    href: INSTAGRAM_URL,
    icon: <Image src={instagramLogo} alt='' />,
  },
  github: { label: 'GitHub', href: GITHUB_URL, icon: <GithubIcon aria-hidden /> },
  linkedin: { label: 'LinkedIn', href: LINKEDIN_URL, icon: <LinkedInIcon aria-hidden /> },
}

export const ALL_SOCIAL_NETWORKS: SocialNetwork[] = ['instagram', 'github', 'linkedin']

export interface SocialLinksProps {
  /** Redes exibidas, na ordem informada. */
  networks?: SocialNetwork[]
  className?: string
}

export function SocialLinks({ networks = ALL_SOCIAL_NETWORKS, className }: SocialLinksProps) {
  return (
    <div className={twMerge('flex items-center gap-4', className)}>
      {networks.map((network) => {
        const { label, href, icon } = SOCIAL_LINKS[network]
        return (
          <motion.a
            key={network}
            href={href}
            target='_blank'
            rel='noopener noreferrer'
            aria-label={label}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.9 }}
            className='w-6'
          >
            {icon}
          </motion.a>
        )
      })}
    </div>
  )
}

export default SocialLinks
