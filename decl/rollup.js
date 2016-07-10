// @flow
type rollupOptions = {
  entry: string;
  onwarn?: Function;
  plugins?: Array<{}>;
  external?: Array<string>;
};

type writeOptions = {
  dest: string;
  intro?: string;
  outro?: string;
  indent?: string | boolean;
  format?: 'amd' | 'cjs' | 'es6' | 'iife' | 'umd';
  banner?: string;
  footer?: string;
  exports?:  'auto' | 'default' | 'named' | 'none';
  globals?: {};
  useStrict: boolean;
  sourceMap?: boolean;
  moduleId?: string;
  moduleName?: string;
  sourceMapFile?: string;
};

declare function rollupPlugin(options?: {}): {};

declare module 'rollup' {
  declare class Bundle {
    write(options: writeOptions): Promise<void>;
  }

  declare function rollup(options: rollupOptions): Promise<Bundle>;
}

declare module 'rollup-plugin-alias' {
  declare var exports: rollupPlugin;
}

declare module 'rollup-plugin-babel' {
  declare var exports: rollupPlugin;
}

declare module 'rollup-plugin-commonjs' {
  declare var exports: rollupPlugin;
}

declare module 'rollup-plugin-eslint' {
  declare var exports: rollupPlugin;
}

declare module 'rollup-plugin-json' {
  declare var exports: rollupPlugin;
}

declare module 'rollup-plugin-node-resolve' {
  declare var exports: rollupPlugin;
}
