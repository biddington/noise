import  {  type Vec4 } from "./vector";
import * as V from "./vector";
import type { Mesh } from "./mesh";
import { Degrees, Radians, toRadians } from "./units";

const comp = <F extends (v:Vec4) => Vec4>(f:F,g:F): (args:Parameters<F>[0]) => Vec4 => {
  return (args:Parameters<F>[0]) => f(g(args))
}

type Dimensions = { width: number; height: number };

//////////////////////////////////////////////////////////////////////
////////////// Pipline functions
//////////////////////////////////////////////////////////////////////

// Local transforms are done before world transforms otherwise
// this could have unintended effect of rotating about the wrong center
let local = ({ zRot }:MeshRotation) =>
  V.rotateY(zRot)

// World transform (all mesh in the scene)
// TODO: let transformed = mesh.vertices.map((vertex) => rotateX(Radians(Math.PI / 2), vertex))
// let world = transform(v => v);

// Projection transform to screen space
// Note the `-v.z` we divide by and set `z` to. We  do this otherwise it swaps our projected points - what would
// be clipped is now actually visible, and vice-versa.
let perspective = ((v:Vec4) => ({
  // fudge factor - because divind by z when the mesh is say, a 100 x 100 x 100 cube would
  // mean that all projected faces are between -1 <-> 1 which is too small and distorted
  // note: maybe this is fixed by a proper "viewing angle" camera
  x: v.x / -v.z * 400,
  y: v.y / -v.z * 400,
  z: -v.z,
  w: v.w,
}));

// isometric projection
// - rotate 25degrees about Y
// - rotate 45degrees about X
let iso = comp(
  V.rotateX(toRadians(Degrees(45))),
  V.rotateY(toRadians(Degrees(25)))
)

// Normalising the coords allows us side-step the creation of
// dimension-specific clip functions
// +/- Inf x,y => 0 -> 1
let normalise = (canvas: Dimensions) => {
  return ((v:Vec4) => ({
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
  return ((v:Vec4) => ({
    x: Math.round(canvas.width * v.x * 100) / 100,
    // 0,0 is the top left corner and w,h is the bottom right
    // so we invert using {1 - v.y} to get the top right as w,h
    y: Math.round(100 * (canvas.height * (1 - v.y))) / 100,
    z: v.z,
    w: v.w
  }));
}

export type MeshRotation = {
  xRot: Radians
  yRot: Radians
  zRot: Radians
};

export type Renderer = (mesh:Mesh, rotation: MeshRotation) => void;

const config = (ctx: CanvasRenderingContext2D): Renderer => {

  let { canvas } = ctx;

  const pipeline =
    comp(
      rasterise({ width: canvas.width, height: canvas.height }),
      comp(
        normalise({ width: canvas.width, height: canvas.height }),
        iso))

  return (mesh: Mesh, rotation: MeshRotation) => {

    let modelRotation = local(rotation)

    let rotatedVertices = mesh.vertices.map(modelRotation)

    let rasterised = rotatedVertices.map(pipeline)

    ctx.clearRect(0, 0, 1000, 1000)
    ctx.beginPath();

    for (const [a, b] of mesh.edges) {
      ctx.moveTo(rasterised[a].x, rasterised[a].y);
      ctx.lineTo(rasterised[b].x, rasterised[b].y);
    }

    ctx.closePath()
    ctx.lineWidth = 3;
    ctx.stroke();
  };
};

export { config };
