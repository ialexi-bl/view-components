import React from 'react'
import { DefaultTheme, ThemedStyledFunction } from 'styled-components'

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

export interface ViewTemplateConstructor<C, P> {
  <E extends { [key: string]: any } = {}>(
    strings: TemplateStringsArray,
    ...interpolations: Interpolation<P & E>[]
  ): ThemedStyledFunction<C, DefaultTheme>
}

export interface ViewComponentConstructor {
  <C extends React.ElementType<any> = 'div'>(
    Component: C
  ): ViewTemplateConstructor<C, React.ComponentPropsWithRef<C>>
}

type ViewFunction = ViewComponentConstructor &
  {
    [K in keyof JSX.IntrinsicElements]: ViewTemplateConstructor<
      JSX.IntrinsicElements[K]
    >
  }

declare const styledView: ViewFunction

export default styledView
