import { cos, sin } from "./trig";

export type Mat4 = [ Vec4, Vec4, Vec4, Vec4 ];

const identity = [
  { x: 1, y: 0, z: 0, w: 0 },
  { x: 0, y: 1, z: 0, w: 0 },
  { x: 0, y: 0, z: 1, w: 0 },
  { x: 0, y: 0, z: 0, w: 1 }
] as Mat4

function mm(a:Mat4, b:Mat4): Mat4 {
  return [
    { x: a[0].x * b[0].x + a[1].x * b[0].y + a[2].x * b[0].z + a[3].x * b[0].w,
      y: a[0].y * b[0].x + a[1].y * b[0].y + a[2].y * b[0].z + a[3].y * b[0].w,
      z: a[0].z * b[0].x + a[1].z * b[0].y + a[2].z * b[0].z + a[3].z * b[0].w,
      w: a[0].w * b[0].x + a[1].w * b[0].y + a[2].w * b[0].z + a[3].w * b[0].w },

    { x: a[0].x * b[1].x + a[1].x * b[1].y + a[2].x * b[1].z + a[3].x * b[1].w,
      y: a[0].y * b[1].x + a[1].y * b[1].y + a[2].y * b[1].z + a[3].y * b[1].w,
      z: a[0].z * b[1].x + a[1].z * b[1].y + a[2].z * b[1].z + a[3].z * b[1].w,
      w: a[0].w * b[1].x + a[1].w * b[1].y + a[2].w * b[1].z + a[3].w * b[1].w },

    { x: a[0].x * b[2].x + a[1].x * b[2].y + a[2].x * b[2].z + a[3].x * b[2].w,
      y: a[0].y * b[2].x + a[1].y * b[2].y + a[2].y * b[2].z + a[3].y * b[2].w,
      z: a[0].z * b[2].x + a[1].z * b[2].y + a[2].z * b[2].z + a[3].z * b[2].w,
      w: a[0].w * b[2].x + a[1].w * b[2].y + a[2].w * b[2].z + a[3].w * b[2].w },

    { x: a[0].x * b[3].x + a[1].x * b[3].y + a[2].x * b[3].z + a[3].x * b[3].w,
      y: a[0].y * b[3].x + a[1].y * b[3].y + a[2].y * b[3].z + a[3].y * b[3].w,
      z: a[0].z * b[3].x + a[1].z * b[3].y + a[2].z * b[3].z + a[3].z * b[3].w,
      w: a[0].w * b[3].x + a[1].w * b[3].y + a[2].w * b[3].z + a[3].w * b[3].w },
  ]
}

function mv(mat: Mat4, vec: Vec4): Vec4 {

  const [
    { x:ax, y:ay, z:az, w:aw },
    { x:bx, y:by, z:bz, w:bw },
    { x:cx, y:cy, z:cz, w:cw },
    { x:tx, y:ty, z:tz, w:tw }
  ] = mat;

  const { x, y, z, w } = vec;

  return {
    x: x * ax + y * bx + z * cx + w * tx,
    y: x * ay + y * by + z * cy + w * ty,
    z: x * az + y * bz + z * cz + w * tz,
    w: x * aw + y * bw + z * cw + w * tw
  }
}

/** A type of matrix multiplication */
export const iso = (vector: Vec4): Vec4 => {
  const matrix: Mat4 = [
    { x: .5, y: -0.25, z: 0, w: 0 },
    { x: .5, y:  0.25, z: 0, w: 0 },
    { x:  0, y:     0, z: 1, w: 0 },
    { x:  0, y:     0, z: 0, w: 1 },
  ];

  return mv(matrix, vector);
};

/**
 * Returns a matrix with `x`, `y`, `z` in the diagonal positions
 * which can be viewed as scaling the identity matrix
 */
const scale =
  ({ x, y, z }: { x: number; y: number; z: number }) => {
    return [
      { x: x, y: 0, z: 0, w: 0 },
      { x: 0, y: y, z: 0, w: 0 },
      { x: 0, y: 0, z: z, w: 0 },
      { x: 0, y: 0, z: 0, w: 1 },
    ] as Mat4;
  };

/**
 * A matrix which rotates `ø` radians about the x-axis
 */
const rotateX = (ø: Radians):Mat4 => {
  return [
    { x: 1, y:       0, z:      0, w: 0 },
    { x: 0, y:  cos(ø), z: sin(ø), w: 0 },
    { x: 0, y: -sin(ø), z: cos(ø), w: 0 },
    { x: 0, y:       0, z:      0, w: 1 },
  ] as Mat4;
};

/**
 * A matrix which rotates `ø` radians about the y-axis
 */
const rotateY = (ø: Radians):Mat4 => {
    return [
      { x:  cos(ø), y: 0, z: sin(ø), w: 0 },
      { x:      0,  y: 1, z:      0, w: 0 },
      { x: -sin(ø), y: 0, z: cos(ø), w: 0 },
      { x:      0,  y: 0, z:      0, w: 1 },
    ];
  };

/**
 * A matrix which rotates ø radians about the x-axis
 * 
 * @param angle {number} - The angle (given in radians) to rotate by
 * @param vector {vector} - The vector to rotate by `angle`
 */
export const rotateZ =
  (ø: Radians) => {
    return [
      { x:  cos(ø), y: sin(ø), z: 0, w: 0 }, // row vectors
      { x: -sin(ø), y: cos(ø), z: 0, w: 0 },
      { x: 0, y: 0, z: 1, w: 0 },
      { x: 0, y: 0, z: 0, w: 1 },
    ] as Mat4;
  };

/**
 * Returns a function which takes `vector` and translates it `dz` along
 * the z-axis
 * 
 * @param dz {number} - The amount in which to translate by
 * @param vector {vector} - The vector to translate
 */
export const translateZ =
  (dz: number) =>
  (vector: Vec4): Vec4 => {
    const rz: Mat4 = [
      { x: 1, y: 0, z:  0, w: 0 }, // row vectors
      { x: 0, y: 1, z:  0, w: 0 },
      { x: 0, y: 0, z:  1, w: 0 },
      { x: 0, y: 0, z: dz, w: 1 },
    ];

    return mv(rz, vector);
  };

/**
 * Returns a matrix which when multiplied with a vector,
 * translates it `tx` along x, `ty` along y and `tz` along z
 * 
 * @param { tx, ty, tz } { tx:number, ty:number, tz:number } - the amounts 
 * to translate in each basis vector
 */
const translate =
  ({ tx, ty, tz }: { tx:number, ty: number, tz:number }):Mat4 => {
    return [
      { x:  1, y:  0, z:  0, w: 0 }, // row vectors
      { x:  0, y:  1, z:  0, w: 0 },
      { x:  0, y:  0, z:  1, w: 0 },
      { x: tx, y: ty, z: tz, w: 1 },
    ];
  };


////////////////////////////////////////////////////////////////////////
////////////////////  ChatGPT Generated Functions  ////////////////////
//////////////////////////////////////////////////////////////////////

function determinant(matrix:number[][]) {

  // Helper function to calculate the determinant of a 2x2 matrix
  function determinant2x2(m:number[][]) {
    return m[0][0] * m[1][1] - m[0][1] * m[1][0];
  }

  // Helper function to get the minor matrix after removing row i and column j
  function getMinor(m:number[][], i:number, j:number) {
    return m.filter((_, rowIndex) => rowIndex !== i)
            .map(row => row.filter((_, colIndex) => colIndex !== j));
  }

  // Recursive function to calculate determinant
  function inner(m:number[][]) {
    const size = m.length;
    if (size === 2) return determinant2x2(m);
    let det = 0;
    for (let i = 0; i < size; i++) {
      // Get the determinant of the minor, recursively
      const minorDet = determinant(getMinor(m, 0, i));
      // Alternating signs for cofactor expansion
      det += (i % 2 === 0 ? 1 : -1) * m[0][i] * minorDet;
    }
    return det;
  }

  return inner(matrix);
}

function cofactor(m:number[][], row:number, col:number) {
    let subMatrix = m.slice().map(row => row.slice()); // Clone the matrix
    subMatrix.splice(row, 1);  // Remove the row
    subMatrix.forEach(r => r.splice(col, 1)); // Remove the column
    return Math.pow(-1, row + col) * determinant(subMatrix);
}

function adjugate(m:number[][]) {
    let adj = [];
    for (let i = 0; i < m.length; i++) {
        let adjRow = [];
        for (let j = 0; j < m[i].length; j++) {
            adjRow.push(cofactor(m, j, i)); // Transpose and cofactor
        }
        adj.push(adjRow);
    }
    return adj;
}

function inverse(matrix:Mat4) {

  let m = [
    Object.values(matrix[0]),
    Object.values(matrix[1]),
    Object.values(matrix[2]),
    Object.values(matrix[3])
  ]

  let det = determinant(m);
  if (det === 0) throw new Error("Matrix is not invertible");

  let adj = adjugate(m);
  let inv = [];
  for (let i = 0; i < adj.length; i++) {
      let invRow = [];
      for (let j = 0; j < adj[i].length; j++) {
          invRow.push(adj[i][j] / det); // Divide by determinant
      }
      inv.push(invRow);
  }

  return [
    { x: inv[0][0] ,y: inv[0][1], z: inv[0][2], w: inv[0][3] },
    { x: inv[1][0] ,y: inv[1][1], z: inv[1][2], w: inv[1][3] },
    { x: inv[2][0] ,y: inv[2][1], z: inv[2][2], w: inv[2][3] },
    { x: inv[3][0] ,y: inv[3][1], z: inv[3][2], w: inv[3][3] },
  ] as Mat4;
}

export {
  scale,
  determinant,
  rotateX,
  rotateY,
  mm,
  mv,
  identity,
  translate,
  inverse
}
