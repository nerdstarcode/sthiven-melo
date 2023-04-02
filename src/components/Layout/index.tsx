export interface LayoutProps{
  children?: any,
  classname?: string,
}
export default function Layout({children, classname}:LayoutProps) {
  return (
    <div className={`w-full h-full inline-block z-0 bg-light p-32 ${classname}`}>
      {children}
    </div>
  )
}
