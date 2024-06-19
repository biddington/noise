const PI = Number(Math.PI.toPrecision(3))

// Constructor for Radians type
export function Radians(angle: number): Radians {
    return angle as unknown as Radians;
}

export function Degrees(angle: number): Degrees {
  return angle as unknown as Degrees
}

export function toRadians(angle: Degrees): Radians {
  return Number((((PI * 2) / 360) * (angle as unknown as number)).toFixed(2)) as unknown as Radians
}

// export function toDegrees(angle: Radians): Degrees {
//   throw Error("Not implemented yet")
// }
