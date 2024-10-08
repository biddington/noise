import { inverse, mm, mv, rotateX, rotateY, identity, translate, rotateZ } from "./matrix";
import { Degrees, Radians, toRadians } from "../units";

type Dimensions = { width: number; height: number };

function comp<F extends (...args:any[]) => any,G extends (...args:any[]) => any>(f: F, g: G): (args: Parameters<F>[0]) => Vec4 {
  return (args: Parameters<F>[0]) => f(g(args));
}

//////////////////////////////////////////////////////////////////////
/////////////////////  Pipline functions  ///////////////////////////
////////////////////////////////////////////////////////////////////

// let camera = (identity:Mat4, inputs:Ext) => {
//   // How to?
// }

// World transform (all mesh in the scene)
// TODO: let transformed = mesh.vertices.map((vertex) => rotateX(Radians(Math.PI / 2), vertex))
// let world = transform(v => v);

// Projection transform to screen space
// Note the `-v.z` we divide by and set `z` to. We  do this otherwise it swaps our projected points - what would
// be clipped is now actually visible, and vice-versa.
let perspective = (v: Vec4) => ({
  // fudge factor - because divind by z when the mesh is say, a 100 x 100 x 100 cube would
  // mean that all projected faces are between -1 <-> 1 which is too small and distorted
  // note: maybe this is fixed by a proper "viewing angle" camera
  x: (v.x / -v.z) * 400,
  y: (v.y / -v.z) * 400,
  z: -v.z,
  w: v.w,
});

let ortho = (v: Vec4) => ({
  // fudge factor - because divind by z when the mesh is say, a 100 x 100 x 100 cube would
  // mean that all projected faces are between -1 <-> 1 which is too small and distorted
  // note: maybe this is fixed by a proper "viewing angle" camera
  x:  v.x,
  y:  v.y,
  z: -v.z,
  w:  v.w,
});

// isometric projection
// - rotate 25degrees about Y
// - rotate 45degrees about X
// let _iso = comp(
//   M.scale({ x:1, y: .5, z: 1 }),
//   M.rotateZ(toRadians(Degrees(45))),
// );

// Normalising the coords allows us side-step the creation of
// dimension-specific clip functions
// +/- Inf x,y => 0 -> 1
let normalise = (canvas: Dimensions) => {
  return (v: Vec4) => ({
    x: (v.x + canvas.width / 2) / canvas.width,
    y: (v.y + canvas.height / 2) / canvas.height,
    z: v.z, // We don't normalise z. It stays as it is so we can do depth testing
    w: v.w,
  });
};

// TODO:: Cull mesh vertices outside of the normalised range (0 -> 1)

// Raster transform
// 0 -> 1 => 0 -> width, 0 -> height
let rasterise = (canvas: Dimensions) => {
  return (v: Vec4) => ({
    x: Math.round(canvas.width * v.x * 100) / 100,
    // 0,0 is the top left corner and w,h is the bottom right
    // so we invert using {1 - v.y} to get the top right as w,h
    y: Math.round(100 * (canvas.height * (1 - v.y))) / 100,
    z: v.z,
    w: v.w,
  });
};

type Ext = {
  rotation?: {
    x?: Radians,
    y?: Radians,
    z?: Radians,
  }
  translation?: {
    x?: number,
    y?: number,
    z?: number,
  }
}

const defaults:Ext = {
  rotation: {
    x: Radians(0),
    y: Radians(0),
    z: Radians(0),
  },
  translation: {
    x: 0,
    y: 0,
    z: 0,
  }
}

type Renderer = {
  edges: (mesh: Mesh, inputs?: Ext) => void;
  points: (mesh: Mesh, inputs?: Ext) => void;
};

const config = (ctx: CanvasRenderingContext2D): Renderer => {
  let { canvas } = ctx;

  // local -                | While there's only a single mesh the local
  // inverse-camera/world   | and world transforms do essentially the same thing
  // project
  // normalise
  // rasterise
  const pipeline = comp(
    rasterise({ width: canvas.width, height: canvas.height }),
      comp(normalise({ width: canvas.width, height: canvas.height }), ortho),
  );

  return {
    edges: (mesh: Mesh, inputs = defaults) => {

      const frame = () => {
        // calculate the world matrix from inverse of the camera
        let rm = mm(
          rotateY(inputs?.rotation?.x ?? Radians(0)),
          rotateX(inputs?.rotation?.y ?? Radians(0)),
        )
        let tm = translate({ tx: 0, ty: 0, tz: 0 })
        let world = mm(rm, tm) // rm then tm
        let camera = inverse(world)

        let _v = mesh.vertices.map(v => mv(camera, v));

        let rasterised = _v.map(pipeline);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();

        for (const [a, b] of mesh.edges) {
          ctx.moveTo(rasterised[a].x, rasterised[a].y);
          ctx.lineTo(rasterised[b].x, rasterised[b].y);
        }

        ctx.closePath();
        ctx.lineWidth = 2;
        ctx.stroke();
      };

      frame()
    },

    points: (mesh: Mesh, inputs = defaults) => {

      const frame = () => {
        let rm = mm(
          rotateZ(toRadians(Degrees(45)) ?? Radians(0)),
          rotateX(toRadians(Degrees(45)) ?? Radians(0)),
        )
        let tm = translate({ tx: 0, ty: 0, tz: 0 })
        let world = mm(rm, tm) // rm then tm
        let camera = inverse(world)

        let _v = mesh.vertices.map(v => mv(camera, v));

        let rasterised = _v.map(pipeline);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (const { x, y } of rasterised) {
          ctx.beginPath();
          ctx.fillRect(x, y, 1, 1);
          ctx.stroke();
        }

        ctx.lineWidth = 1;
      };

      requestAnimationFrame(frame);
    },
  };
};

export { config, type Renderer };
