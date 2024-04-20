import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
export interface DetailsProps {
  position: string;
  company?: string;
  companyLink?: string;
  time: string;
  address: string;
  work: string;
  children: any;
  src: any;
  alt: string;
  classname?: string;
}
import { twMerge } from 'tailwind-merge'

export function Main({
  children,
  classname
}: Pick<DetailsProps, 'children' | 'classname'>) {

  return (
    <li className={twMerge('', classname)}>
      {children}
    </li>
  )
}
export function Article({
  children,
  classname
}: Pick<DetailsProps, 'children' | 'classname'>) {

  return (
    <article className={twMerge('', classname)}>
      {children}
    </article>
  )
}
export function Title({
  position,
  company,
  companyLink,
  classname
}: Pick<DetailsProps, 'position' | 'company' | 'companyLink' | 'classname'>) {

  return (
    <h3 className={twMerge('', classname)}>{position}&nbsp; {companyLink != undefined && <Link target='_blank' className='text-primary capitalize' href={companyLink ?? ''}>{company}</Link>}</h3>
  )
}
export function SpaceAndTime({
  time,
  address,
  classname
}: Pick<DetailsProps, 'time' | 'address' | 'classname'>) {

  return (
    <div className={twMerge('', classname)}>
      {time} | {address}
    </div>

  )
}
export function Description({
  work,
  classname
}: Pick<DetailsProps, 'work' | 'classname'>) {

  return (
    <p className={twMerge('', classname)}>
      {work}
    </p>
  )
}
export function AsideImage({
  src,
  alt,
  classname
}: Pick<DetailsProps, 'src' | 'alt' | 'classname'>) {
  return (
    <aside className={twMerge('', classname)}>
      <Image className={'w-full'} src={src} alt={alt} />
    </aside>
  )
}

const Details = {
  Main,
  Article,
  Title,
  SpaceAndTime,
  Description,
  AsideImage,
}
export default Details