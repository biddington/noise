import { describe, expect, test } from "vitest";
import * as fc from "fast-check";
import { Degrees, toRadians } from "./units";
import { add, rotateX, rotateY, rotateZ, Unit } from "./vector";

describe("vector addition", () => {
  test("should be commutative", () => {
    fc.assert(
      fc.property(
        fc.record({
          x: fc.nat(99),
          y: fc.nat(99),
          z: fc.nat(99),
          w: fc.nat(99),
        }),
        fc.record({
          x: fc.nat(99),
          y: fc.nat(99),
          z: fc.nat(99),
          w: fc.nat(99),
        }),
        (a, b) => {
          expect(add(a, b)).toEqual(add(b, a));
        },
      ),
    );
  });
});

describe("rotate about the x-axis", () => {
  test("Rotating unit y by 90 should equal unit z", () => {
    expect(rotateX(toRadians(Degrees(90)))(Unit.y)).toEqual(Unit.z);
  });
});

describe("rotate about the y-axis", () => {
  test("Rotating unit z by -90 should equal unit x", () => {
    expect(rotateY(toRadians(Degrees(-90)))(Unit.z)).toEqual(Unit.x);
  });
});

describe("rotate about the z-axis", () => {
  test("Rotating unit x by 90 should equal unit y", () => {
    expect(rotateZ(toRadians(Degrees(90)))(Unit.x)).toEqual(Unit.y);
  });
});
