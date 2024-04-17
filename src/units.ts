
export type Radians = Opaque<"Radians", number>
export type Degrees = Opaque<"Degrees", number>

// Constructor for Radians type
export function Radians(angle: number): Radians {
    return angle as unknown as Radians;
}

export function Degrees(angle: number): Degrees {
  return angle as unknown as Degrees
}

export function toRadians(angle: Degrees): Radians {
  return ((Math.PI * 2) / 360) * (angle as unknown as number) as unknown as Radians
}

export function toDegrees(angle: Radians): Degrees {
  throw Error("Not implemented yet")
}
