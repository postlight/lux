/* @flow */

declare export function Compiler$manifestWriter(
  value: string | Array<string>,
  resolveName?: (value: string) => string,
  resolveExport?: (value: string) => string
): Promise<void>;
