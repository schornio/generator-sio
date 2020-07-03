// FROM: https://fettblog.eu/typescript-react/styles/#load-css-with-webpack
declare module '*.css' {
  interface ClassNames {
    [className: string]: string;
  }
  const classNames: ClassNames;
  export = classNames;
}
