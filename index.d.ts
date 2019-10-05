import React from 'react'

type Primitive = string | number | undefined | null | boolean

type Interpolation<P> =
  | Primitive
  | InterpolatedObject<P>
  | InterpolatedFunction<P>
  | InterpolatedArray<P>

interface InterpolatedFunction<P> {
  (props: P): Interpolation<P>
}

interface InterpolatedObject<P> {
  [key: string]: boolean | ((props: P) => boolean)
}

interface InterpolatedArray<P> {
  [key: number]: Interpolation<P> | InterpolatedArray<P>
}

export type ViewComponent<P> = React.ComponentType<P>

export interface ViewTemplateConstructor<P> {
  (
    strings: TemplateStringsArray,
    ...interpolations: Interpolation<P>[]
  ): ViewComponent<P>
}

export interface ViewComponentConstructor {
  <C extends React.ElementType<any>>(Component: C): ViewTemplateConstructor<
    React.ComponentPropsWithRef<C>
  >
}

type ViewFunction = ViewComponentConstructor &
  {
    [K in keyof JSX.IntrinsicElements]: ViewTemplateConstructor<
      JSX.IntrinsicElements[K]
    >
  }

declare const view: ViewFunction

export default view
