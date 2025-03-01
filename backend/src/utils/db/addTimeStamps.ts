export function addTimestamps<T>(
  document: T,
  isNew: boolean = true
): T & { createdAt?: Date; updatedAt: Date } {
  const now = new Date();
  return {
    ...document,
    ...(isNew && { createdAt: now }),
    updatedAt: now,
  };
}
