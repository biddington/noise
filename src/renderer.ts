import { rotateZ, rotateY, rotateX, type Vec4, translateZ } from "./vector";
import { Mesh } from "./mesh";
import { Degrees, Radians, toRadians } from "./units";

/**
 * Produces a new mesh by running `transform` over given `mesh` vertices. This function
 * is the basis of all coordindate space conversion functions.
 *
 * @param transform {(Vec4) => Vec4} - The function which creates the vertices for the new mesh
 *
 * @param mesh {Mesh} - The mesh to transform. Though this function is immutable and a new
 * mesh will be returned with the mesh arg here unaffected
 */

const transform =
  (transform: (vec: Vec4) => Vec4) => (mesh: Mesh) => {
    return {
      ...mesh,
      vertices: mesh.vertices.map(transform),
    };
  };

type Dimensions = { width: number; height: number };

// Local transforms are done before world transforms otherwise
// this could have unintended effect of rotating about the wrong center
let local = ({ zRot }:Rotation) =>
  transform(rotateY(zRot))

// World transform (all mesh in the scene)
// TODO: let transformed = mesh.vertices.map((vertex) => rotateX(Radians(Math.PI / 2), vertex))
// let world = transform(v => v);

// Projection transform to screen space
// Note the `-v.z` we divide by and set `z` to. We  do this otherwise it swaps our projected points - what would
// be clipped is now actually visible, and vice-versa.
let perspective = transform(v => ({
  x: v.x / -v.z * 200, // fudge factor
  y: v.y / -v.z * 200,
  z: -v.z,
  w: v.w,
}));

let iso = (vector:Vec4):Vec4 => {
  let rY = rotateY(toRadians(Degrees(25)))
  let rX = rotateX(toRadians(Degrees(45)))

  return rY(rX(vector))
}

// Normalising the coords allows us side-step the creation of
// dimension-specific clip functions
// +/- Inf x,y => 0 -> 1
let normalise = (canvas: Dimensions) => {
  return transform(v => ({
    x: (v.x + canvas.width / 2) / canvas.width,
    y: (v.y + canvas.height / 2) / canvas.height,
    z: v.z, // We don't normalise z. It stays as it is so we can do depth testing
    w: v.w,
  }));
};

// TODO:: Cull mesh vertices outside of the normalised range (0 -> 1)

// Raster transform
// 0 -> 1 => 0 -> width, 0 -> height
let rasterise = (canvas:Dimensions) => {
  return transform(v => ({
    x: Math.round(canvas.width * v.x * 100) / 100,
    // 0,0 is the top left corner and w,h is the bottom right
    // so we invert using {1 - v.y} to get the top right as w,h
    y: Math.round(100 * (canvas.height * (1 - v.y))) / 100,
    z: v.z,
    w: v.w
  }));
}

export type Rotation = {
  xRot: Radians
  yRot: Radians
  zRot: Radians
};

export type Renderer = (rotation: Rotation) => void;

const config = (ctx: CanvasRenderingContext2D, mesh: Mesh): Renderer => {
  let { canvas } = ctx;

  const pipeline = [
    perspective,
    normalise({ width: canvas.width, height: canvas.height }),
    rasterise({ width: canvas.width, height: canvas.height })
  ]

  return (rotation: Rotation) => {

    let f = transform(translateZ(-550))
    let loc = local(rotation)

    let l = loc(mesh)
    let fm = f(l)
    let p = pipeline[0](fm);
    let n = pipeline[1](p);
    let r = pipeline[2](n);

    ctx.clearRect(0, 0, 1000, 1000)
    ctx.beginPath();

    for (const [a, b] of r.edges) {
      ctx.moveTo(r.vertices[a].x, r.vertices[a].y);
      ctx.lineTo(r.vertices[b].x, r.vertices[b].y);
    }

    ctx.closePath()
    ctx.stroke();
  };
};

export { config };
