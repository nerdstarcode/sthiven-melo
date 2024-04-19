export interface LayoutProps{
  children?: any,
  classname?: string,
}
export default function Layout({children, classname}:LayoutProps) {
  return (
    <div className={`w-full h-full flex flex-col z-0 bg-zinc-900 p-8 md:p-32 ${classname}`}>
      {children}
    </div>
  )
}
