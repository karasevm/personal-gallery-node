// eslint-disable-next-line import/prefer-default-export
export const hasKey = <K extends string, T extends object>(
  k: K, o: T,
): o is T & Record<K, unknown> => k in o;
