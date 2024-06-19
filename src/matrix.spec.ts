import { describe, expect, test } from "vitest";
import * as fc from "fast-check";
import { add } from "./vector";

describe("matrix", () => {
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
