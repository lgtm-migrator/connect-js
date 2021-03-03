function flattenDeepObject(
  obj: Record<string, unknown>,
  higherLevelEntry?: string,
  flattenedObject: Record<string, string> = {},
): Record<string, string> {
  const keySeparator = "_";

  for (const [key, value] of Object.entries(obj)) {
    const entry = higherLevelEntry
      ? higherLevelEntry.concat(keySeparator, key)
      : key;

    if (value && typeof value === "object") {
      flattenDeepObject(
        value as Record<string, string>,
        entry,
        flattenedObject,
      );
    } else {
      if (typeof value !== "undefined") {
        flattenedObject[entry] = value.toString();
      }
    }
  }
  return flattenedObject;
}

export { flattenDeepObject };
