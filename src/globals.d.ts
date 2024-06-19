/**
 * The types and functions we assume to be present in the rest
 * of the code in which other types are built upon
 */

type Vec4 = { x: number; y: number; z: number; w: number };

const tag: unique symbol;

type Opaque<T, K> = T & { readonly [tag]: K };

type Radians = Opaque<"Radians", number>;

type Degrees = Opaque<"Degrees", number>;

type Idx = Opaque<number, "Index">;

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

declare global {
  //
  function comp(f: F, g: F): (args: Parameters<F>[0]) => Vec4;
  //
  function Idx(n: number): Idx;
}

function comp(f: F, g: F): (args: Parameters<F>[0]) => Vec4 {
  return (args: Parameters<F>[0]) => f(g(args));
}

function Idx(n: number): Idx {
  if (!Number.isInteger(n))
    throw Error(`Can't convert float, ${n}, to an index`);

  return n as Idx;
};
