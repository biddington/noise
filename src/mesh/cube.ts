
function Idx(n: number): Idx {
  if (!Number.isInteger(n))
    throw Error(`Can't convert float, ${n}, to an index`);

  return n as Idx;
};

const cube: Mesh = {
  vertices: [
    { x: -100, y: -100, z: 100, w: 1 },
    { x: -100, y: 100, z: 100, w: 1 },
    { x: 100, y: 100, z: 100, w: 1 },
    { x: 100, y: -100, z: 100, w: 1 },
    { x: -100, y: -100, z: -100, w: 1 },
    { x: -100, y: 100, z: -100, w: 1 },
    { x: 100, y: 100, z: -100, w: 1 },
    { x: 100, y: -100, z: -100, w: 1 },
  ],

  faces: [[Idx(0), Idx(1), Idx(2)]],

  edges: [
    // Front
    [Idx(0), Idx(1)],
    [Idx(1), Idx(2)],
    [Idx(2), Idx(3)],
    [Idx(3), Idx(0)],
    // Back
    [Idx(4), Idx(5)],
    [Idx(5), Idx(6)],
    [Idx(6), Idx(7)],
    [Idx(7), Idx(4)],
    // Sides
    [Idx(0), Idx(4)],
    [Idx(1), Idx(5)],
    [Idx(2), Idx(6)],
    [Idx(3), Idx(7)],
  ],
};

export {
  cube
}
