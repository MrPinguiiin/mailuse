import { nanoid } from "nanoid";

type IdPrefix = "inb" | "eml" | "att" | "dom" | "blk";

export function generateId(prefix: IdPrefix): string {
  return `${prefix}_${nanoid(21)}`;
}
