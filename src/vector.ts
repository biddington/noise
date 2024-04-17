import { Radians } from "./units";
import { cos, sin } from "./trig";

export type Vec4 = { x: number; y: number; z: number; w: number };
export type Mat4 = [Vec4, Vec4, Vec4, Vec4];

function add(...vecs: Vec4[]): Vec4 {
  // Add all vectors, component-wise
  return vecs.reduce(
    (result, { x, y, z, w }): Vec4 => {
      return {
        x: result.x + x,
        y: result.y + y,
        z: result.z + z,
        w,
      };
    },
    { x: 0, y: 0, z: 0, w: 1 },
  );
}

function scale(factor: number, { x, y, z, w }: Vec4): Vec4 {
  return {
    x: x * factor,
    y: y * factor,
    z: z * factor,
    w,
  };
}

/**
*
*
*/
function mul(mat: Mat4, vec: Vec4): Vec4 {
  const [e1, e2, e3, e4] = mat;
  const { x, y, z, w } = vec;

  return add(scale(x, e1), scale(y, e2), scale(z, e3), scale(w, e4));
}

export const rotateX = (ø: Radians) => (vector:Vec4):Vec4 => {
  const rx: Mat4 = [
    { x: 1, y:       0, z:      0, w: 0 },
    { x: 0, y:  cos(ø), z: sin(ø), w: 0 },
    { x: 0, y: -sin(ø), z: cos(ø), w: 0 },
    { x: 0, y:       0, z:      0, w: 1 },
  ];

  return mul(rx, vector);
}

export const rotateY = (ø: Radians) => (vector:Vec4):Vec4 => {
  const ry: Mat4 = [
    { x:  cos(ø), y: 0, z: sin(ø), w: 0 },
    { x:       0, y: 1, z:      0, w: 0 },
    { x: -sin(ø), y: 0, z: cos(ø), w: 0 },
    { x:       0, y: 0, z:      0, w: 1 },
  ];

  return mul(ry, vector);
}

/**
* @param angle {number} - The angle (given in radians) to rotate by
* @param vector {vector} - The vector to rotate by `angle`
*/
export const rotateZ = (ø: Radians) => (vector: Vec4):Vec4 => {

  const rz: Mat4 = [
    { x:  cos(ø), y: sin(ø), z: 0, w: 0 }, // row vectors
    { x: -sin(ø), y: cos(ø), z: 0, w: 0 },
    { x:       0, y:      0, z: 1, w: 0 },
    { x:       0, y:      0, z: 0, w: 1 },
  ];

  return mul(rz, vector);
}

/**
* @param angle {number} - The angle (given in radians) to rotate by
* @param vector {vector} - The vector to rotate by `angle`
*/
export const translateZ = (mx:number) => (vector: Vec4):Vec4 => {

  const rz: Mat4 = [
    { x: 1, y: 0, z: 0, w: 0 }, // row vectors
    { x: 0, y: 1, z: 0, w: 0 },
    { x: 0, y: 0, z: 1, w: 0 },
    { x: 0, y: 0, z: mx, w: 1 },
  ];

  return mul(rz, vector);
}
