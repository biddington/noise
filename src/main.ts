import "./style.css";
import type { Renderer } from "./renderer";
import { config } from "./renderer";
import { Radians } from "./units";
import { cube } from "./mesh/cube";

function setup(): Renderer {

  const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;

  canvas.width = canvas.height = window.devicePixelRatio * 500;

  const ctx = canvas.getContext("2d")!;

  ctx.strokeStyle = "#222";

  return config(ctx);
}

/**
* Essentially an event-driven renderer where each event produced from the DOM handler queues up render
* at this stage different event sources will clobber each other and produce broken renders
*/
function run(render: Renderer) {
  const doc = document.querySelector<Element>('body');

  window.addEventListener("resize", () => {

  })

  window.addEventListener("mousemove", (event:MouseEvent) => {
    // I want the window width = 2Pi
    let horizontalRadPerPx = (2*Math.PI) / (doc?.clientWidth ?? 1)
    let verticalRadPerPx = (2*Math.PI) / (doc?.clientHeight ?? 1)

    render.edges(cube,
      {
        rotation: {
          x: Radians((event.clientX - (doc?.clientWidth ?? 1)/2) * horizontalRadPerPx),
          y: Radians((event.clientY - (doc?.clientHeight ?? 1)/2)* verticalRadPerPx),
        }
    })
  })
}

run(setup());
