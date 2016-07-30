// @flow
declare function Rollup$Plugin(options?: Object): Object;

declare module 'rollup' {
  declare class Bundle {
    write(options: {
      dest: string;
      intro?: string;
      outro?: string;
      indent?: string | boolean;
      format?: 'amd' | 'cjs' | 'es6' | 'iife' | 'umd';
      banner?: string;
      footer?: string;
      exports?:  'auto' | 'default' | 'named' | 'none';
      globals?: Object;
      useStrict: boolean;
      sourceMap?: boolean;
      moduleId?: string;
      moduleName?: string;
      sourceMapFile?: string;
    }): Promise<void>;
  }

  declare function rollup(options: {
    entry: string;
    onwarn?: Function;
    plugins?: Array<Object>;
    external?: Array<string>;
  }): Promise<Bundle>;
}

declare module 'rollup-plugin-alias' {
  declare var exports: Rollup$Plugin;
}

declare module 'rollup-plugin-babel' {
  declare var exports: Rollup$Plugin;
}

declare module 'rollup-plugin-commonjs' {
  declare var exports: Rollup$Plugin;
}

declare module 'rollup-plugin-eslint' {
  declare var exports: Rollup$Plugin;
}

declare module 'rollup-plugin-json' {
  declare var exports: Rollup$Plugin;
}

declare module 'rollup-plugin-node-resolve' {
  declare var exports: Rollup$Plugin;
}
