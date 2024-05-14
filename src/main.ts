import "./style.css";
import type { Mesh } from "./mesh";
import { Idx } from "./mesh";
import type { Renderer } from "./renderer";
import { config } from "./renderer";
// import { plane } from "./mesh/plane";

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

function setup(): Renderer {
  const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;

  canvas.width = canvas.height = window.devicePixelRatio * 500;

  // canvas.addEventListener("resize", () => {
  //   // Call setup again to create new transform functions
  //   renderer = config({ width: canvas.width, height: canvas.height })
  // })

  const ctx = canvas.getContext("2d")!;

  ctx.strokeStyle = "#222";

  return config(ctx);
}

function run(render: Renderer) {
  render.edges(cube)
}

run(setup());
