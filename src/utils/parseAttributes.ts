// src/utils/parseAttributes.ts
export function parseAttributes(json: string): string {
  try {
    const obj = JSON.parse(json);
    return Object.entries(obj)
      .map(([key, value]) => `${key}: ${value}`)
      .join(", ");
  } catch {
    return "";
  }
}
