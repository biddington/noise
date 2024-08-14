const Zero: Vec4 = {
  x: 0,
  y: 0,
  z: 0,
  w: 0,
};

/**
* Unit vectors for each major axis x,y,z,w
*/
const Unit = {
  x: { x: 1, y: 0, z: 0, w: 0 },
  y: { x: 0, y: 1, z: 0, w: 0 },
  z: { x: 0, y: 0, z: 1, w: 0 },
  w: { x: 0, y: 0, z: 0, w: 1 },
} as const;

/**
* Component-wise adds vectors in `vecs`
* @example { x: vecs[0].x + vecs[1].x + vecs[num].x ... }
*/
function add(...vecs: Vec4[]): Vec4 {
  return vecs.reduce((result, { x, y, z, w }): Vec4 => {
    return {
      x: result.x + x,
      y: result.y + y,
      z: result.z + z,
      w: result.w + w,
    };
  }, Zero);
}

/**
* Scales components of `vector` by `factor`
*/
function scale(factor: number, { x, y, z, w }: Vec4): Vec4 {
  return {
    x: x * factor,
    y: y * factor,
    z: z * factor,
    w: w * factor,
  };
}

// todo:
// function cross():Vec4 {}


/**
* Computes the dot product between vectors `a` and `b`
*/
function dot(a: Vec4, b: Vec4): number {
  return a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w
}

export {
  Unit,
  Zero,
  add,
  scale,
  dot
}
