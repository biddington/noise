export type Vec4 = { x: number; y: number; z: number; w: number };

export const Zero: Vec4 = {
  x: 0,
  y: 0,
  z: 0,
  w: 0,
};

export const Unit = {
  x: { x: 1, y: 0, z: 0, w: 0 },
  y: { x: 0, y: 1, z: 0, w: 0 },
  z: { x: 0, y: 0, z: 1, w: 0 },
} as const;

export function add(...vecs: Vec4[]): Vec4 {
  return vecs.reduce((result, { x, y, z, w }): Vec4 => {
    return {
      x: result.x + x,
      y: result.y + y,
      z: result.z + z,
      w: result.w + w,
    };
  }, Zero);
}

export function scale(factor: number, { x, y, z, w }: Vec4): Vec4 {
  return {
    x: x * factor,
    y: y * factor,
    z: z * factor,
    w: w * factor,
  };
}

// todo:
// function cross():Vec4 {}

// todo:
// function dot(): number
