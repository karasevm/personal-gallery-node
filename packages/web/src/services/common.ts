export const hasKey = <K extends string, T extends object>( // eslint-disable-line @typescript-eslint/ban-types
  k: K, o: T,
): o is T & Record<K, unknown> => k in o;
