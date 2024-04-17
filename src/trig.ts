import { Radians } from "./units";

export function cos(ø: Radians): number {
  return Math.cos(ø as unknown as number);
}

export function sin(ø: Radians): number {
  return Math.sin(ø as unknown as number);
}
