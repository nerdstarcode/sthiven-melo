import Image, { type StaticImageData } from 'next/image'
import { twMerge } from 'tailwind-merge'
import aboutPicture from '@p/aboutpicture.jpg'

export interface ProfileImageProps {
  alt: string
  src?: StaticImageData
  className?: string
}

export function ProfileImage({ alt, src = aboutPicture, className }: ProfileImageProps) {
  return (
    <Image
      priority
      src={src}
      alt={alt}
      className={twMerge(
        'h-full animate-rotate-y rounded-2xl bg-center object-cover object-center',
        className,
      )}
    />
  )
}

export default ProfileImage
