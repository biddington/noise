import type { Vec4 } from "./vector";

type Idx = Opaque<number, "Index">;

function Idx(n: number): Idx {
  if (!Number.isInteger(n))
    throw Error(`Can't convert float, ${n}, to an index`);

  return n as Idx;
}

// A face in 3D is at minimum defined by three vertices.
// A `face` in this system is described by three indices
// into the mesh's `vertices` array which means we don't
// duplicate vertices between faces that have a common one.
type Face = [Idx, Idx, Idx];

// An edge is described by a tuple of two vertices from the mesh
type Edge = [Idx, Idx];
// A mesh

type Mesh = {
  // The unique verts that make up the mesh
  vertices: Array<Vec4>;
  // `faces` is an index into `vertices`
  faces: Array<Face>;
  // The vector tuples describe an edge of the mesh
  edges: Array<Edge>;
};

export type { Face, Edge, Mesh }

export { Idx }
