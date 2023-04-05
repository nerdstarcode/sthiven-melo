import Image from 'next/image'
import aboutpicturelight from '@p/aboutpicturelight.jpg'
import aboutpicture from '@p/aboutpicture.jpg'
import aboutpicturehover from '@p/aboutpicturehover.jpg'
import { useState } from 'react'

export default function ImageTry() {
  const [image, setImage] = useState(aboutpicture)
  return (
    <Image priority src={image} alt='NerdStarCode' className='h-full rounded-2xl object-center bg-center object-cover' onMouseEnter={()=>setImage(aboutpicturehover)} onMouseLeave={()=>setImage(aboutpicture)}/>
  )
}
