import { Radians } from "./units";

export function cos(ø: Radians): number {
  return Number(Math.cos(ø as unknown as number).toFixed(2));
}

export function sin(ø: Radians): number {
  return Number(Math.sin(ø as unknown as number).toFixed(2));
}
