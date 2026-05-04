import { Variant } from "./schemas";

export function generateAllAttributesAry(variants: Variant[] = []) {
  const attrMap: Record<string, Set<string>> = {};

  variants.forEach((variant) => {
    variant?.attributes?.forEach((attr) => {
      if (!attrMap[attr.name]) {
        attrMap[attr.name] = new Set();
      }
      attrMap[attr.name].add(attr.value);
    });
  });

  return Object.entries(attrMap).map(([name, values]) => ({
    attributeName: name,
    fields: Array.from(values),
  }));
}
