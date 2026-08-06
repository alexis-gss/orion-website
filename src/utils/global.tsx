/**
 * Format sizing.
 *
 * @param {number} bytes
 * @return string
 */
export function formatSize(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} Mo`;
}

/**
 * Format date.
 *
 * @param {string} iso
 * @return string
 */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
