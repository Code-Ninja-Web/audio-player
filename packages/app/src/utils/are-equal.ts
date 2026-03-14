export const areEqual = (
  left: string | number | null | undefined,
  right: string | number | null | undefined,
): boolean => {
  if (left == null || right == null) {
    return false
  }

  return String(left) === String(right)
}
