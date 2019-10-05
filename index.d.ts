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
  <E extends { [key: string]: any } = {}>(
    strings: TemplateStringsArray,
    ...interpolations: Interpolation<P & E>[]
  ): ViewComponent<P & E>
}

export interface ViewComponentConstructor {
  <C extends React.ElementType<any> = 'div'>(
    Component: C
  ): ViewTemplateConstructor<React.ComponentPropsWithRef<C>>
}

type ViewFunction = ViewComponentConstructor &
  {
    [K in keyof JSX.IntrinsicElements]: ViewTemplateConstructor<
      JSX.IntrinsicElements[K]
    >
  }

declare const view: ViewFunction

export default view
