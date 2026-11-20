import 'react'

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      set: React.SVGProps<SVGSetElement>
    }
  }
}
