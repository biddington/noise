
function Idx(n: number): Idx {
  if (!Number.isInteger(n))
    throw Error(`Can't convert float, ${n}, to an index`);

  return n as Idx;
};

let plane: Mesh = {
  vertices: [],
  faces: [],
  edges: [],
};

for (let i = 0; i <= 10; i++) {
  for (let j = 0; j <= 10; j++) {
    console.log(i,j)
    plane.vertices.push({
      x: (i - 5) * 30,
      y: (j - 5) * 30,
      z: 0,
      w: 1,
    }),
    plane.edges[i] = [Idx(i), Idx(i + 1)];
  }
}

console.log(plane);
export { plane };
