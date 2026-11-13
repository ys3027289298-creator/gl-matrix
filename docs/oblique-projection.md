# Oblique (near-plane-safe) projection constructor

Two new `mat4` constructors replace the hand-derived matrix that was previously
needed for architectural section views:

- `mat4.obliqueFromPlane(out, normal, pointOnPlane, projector?)`
- `mat4.obliqueFromQuad(out, p0, p1, p2, p3, projector?)`

Both return the standard column-major `mat4` (last row `[0, 0, 0, 1]`) used by
every other function in this module, so the result plugs straight into the
existing projection chain with `mat4.multiply`:

```js
const oblique = mat4.obliqueFromQuad(mat4.create(), p0, p1, p2, p3);
const projection = mat4.multiply(mat4.create(), orthoOrPerspective, oblique);
```

The matrix is the affine oblique parallel projection
`Q = | I - d*n^T/(n.d)  d*(n.p0)/(n.d) ; 0 1 |`, where `n` is the normalized
plane normal and `d` the projector direction. It fixes every point on the
input plane, therefore the oblique step itself can never cull a near-plane
vertex. It is analytically idempotent (`Q*Q = Q`), so reusing it in the chain
more than once introduces no structural error, only floating-point rounding.

## Reproduce every number below

```sh
node utils/oblique-projection-verify.mjs
```

The script uses a fixed scenario with no randomness: a section plane tilted
20 degrees about the camera X axis through `p0 = (0, 0, -1)`.

## 1. Before/after comparison on identical inputs

Same 9 camera-space vertices, same orthographic projection parameters
(`left=-4, right=4, bottom=-4, top=4, near=1, far=5` before; after the oblique
step the ortho volume is fitted to the sheared scene AABB with a 5% margin).
`CULL` means the vertex fails the GL clip-space test `-w <= z_clip <= w`.

| vertex | input (x,y,z) | BEFORE: existing chain | AFTER: `ortho * oblique` |
|---|---|---|---|
| section (on plane) | (1, 1.373739, -0.5) | **CULL**, NDC z=-1.25 | **keep**, NDC (-0.150675, 0.189195, -0.189195) |
| b0 | (-1, 0, -0.2) | CULL, NDC z=-1.4 | keep, NDC (-0.909091, -0.335362, 0.335362) |
| b1 | (1, 0, -0.2) | CULL, NDC z=-1.4 | keep, NDC (-0.357867, -0.335362, 0.335362) |
| b2 | (1, 3, -0.2) | CULL, NDC z=-1.4 | keep, NDC (-0.075073, 0.909091, -0.909091) |
| b3 | (-1, 3, -0.2) | CULL, NDC z=-1.4 | keep, NDC (-0.626297, 0.909091, -0.909091) |
| b4 | (-1, 0, -4) | keep, NDC (-0.25, 0, 0.5) | keep, NDC (0.075073, -0.909091, 0.909091) |
| b5 | (1, 0, -4) | keep, NDC (0.25, 0, 0.5) | keep, NDC (0.626296, -0.909091, 0.909091) |
| b6 | (1, 3, -4) | keep, NDC (0.25, 0.75, 0.5) | keep, NDC (0.909091, 0.335362, -0.335362) |
| b7 | (-1, 3, -4) | keep, NDC (-0.25, 0.75, 0.5) | keep, NDC (0.357867, 0.335362, -0.335362) |

The section vertex lies exactly on the oblique plane but in front of the
axis-aligned `z = -1` near plane. The old chain culls it (NDC z = -1.25);
the oblique chain keeps it inside the clip volume, which is the direct proof
that the near plane is no longer clipping section geometry. The same vertex is
returned unchanged by `Q` (fixed-point property).

## 2. Reuse twice: measured drift

`max |Q[i] - (Q*Q)[i]|` across all 16 stored elements:

| storage | matrix drift after two applications |
|---|---|
| Float32 (default `ARRAY_TYPE`) | **5.960e-8** |
| Float64 (`setMatrixArrayType(Array)`) | **1.110e-16** |
| per-vertex `|Q(v) - Q^2(v)|`, Float64 | **3.886e-16** |

These are single-round-off magnitudes (one ULP scale), not accumulating
structural error: `Q*Q` is analytically equal to `Q`, so chaining it any number
of times stays at the same rounding floor instead of growing per use.

Repeated constructor calls on identical input produce a bit-identical matrix
(`mat4.exactEquals` returns true); the construction uses only deterministic
scalar arithmetic (`Math.hypot`, divides and multiplies), no iteration,
randomness, or platform-dependent state.

## 3. Failure paths: reproducible steps and expected errors

Run `node utils/oblique-projection-verify.mjs`; the "failure paths" section
executes each case and prints the thrown message.

| degenerate input | call | expected error message |
|---|---|---|
| zero-length plane normal | `obliqueFromPlane(out, [0,0,0], p0)` | `mat4.obliqueFromPlane: degenerate plane, normal length is zero` |
| zero-length projector | `obliqueFromPlane(out, n, p0, [0,0,0])` | `mat4.obliqueFromPlane: degenerate projector, direction length is zero` |
| projector parallel to plane (`n.d = 0`) | `obliqueFromPlane(out, n, p0, [1,0,0])` | `mat4.obliqueFromPlane: projector is parallel to the plane` |
| four points collinear / zero-area plane | `obliqueFromQuad(out, (0,0,0),(1,0,0),(2,0,0),(0,1,0))` | `mat4.obliqueFromQuad: points are collinear or define a degenerate plane` |
| duplicate corner collapses the plane | `obliqueFromQuad(out, (0,0,0),(0,0,0),(0,1,0),(1,1,0))` | `mat4.obliqueFromQuad: points are collinear or define a degenerate plane` |
| four non-coplanar points | `obliqueFromQuad(out, (0,0,0),(1,0,0),(0,1,0),(0,0,1))` | `mat4.obliqueFromQuad: four points are not coplanar` |

Degeneracy thresholds reuse `glMatrix.EPSILON`; coplanarity scales the mixed
product by the edge lengths so large architectural coordinates are not falsely
rejected.

## 4. Resource and memory bounds

- Time: `O(1)`. `obliqueFromPlane` performs a fixed number of scalar
  operations (two `hypot`, one inverse, 16 stores); `obliqueFromQuad` adds two
  vector differences, one cross product and one dot product. No loops over
  scene data.
- Memory: `O(1)` auxiliary space. Neither function allocates; both write only
  into the caller-supplied 16-element `out`. `obliqueFromQuad` passes a
  3-element normal literal to `obliqueFromPlane`; apart from that short-lived
  literal there are no heap objects, and no recursion, closures, iterators, or
  buffers are retained.
- Determinism: pure function of its arguments; no global state is read or
  written, and output length is always exactly one `mat4`.

## 5. Backward-compatibility verification

- `src/mat4.js` is append-only: `git diff` shows 152 insertions and zero
  deletions, so every existing matrix function keeps its exact operation order
  and therefore its bit-exact output.
- The full existing suite passes unchanged:
  `npx mocha --require @babel/register --recursive spec` reports
  `1328 passing` (plus the suite's one pre-existing pending test), including all pre-existing `perspective`, `ortho`,
  `frustum`, `multiply` and transform golden-value tests (bit-exact, not merely
  tolerance-based). The only test-helper change is an additive
  `toThrowError` matcher; no existing matcher was modified.
- The new oblique specs are placed before a pre-existing early `};` in
  `spec/gl-matrix/mat4-spec.js` that closes `buildMat4Tests` after the `frob`
  block; describe blocks written after that point were never collected by
  mocha. The oblique tests therefore run inside the live closure (15 tests,
  all passing) without altering that pre-existing structure.
- The new code survives the full build chain: Babel ESM output, Rollup UMD
  bundle, and `tsc --allowJs --declaration` type generation all succeed and the
  emitted `.d.ts` contains both new signatures.

Because rendering output is a deterministic function of the unchanged
projection matrices, pixel output for any pre-existing chain is identical; the
oblique matrix only affects chains that explicitly opt in by multiplying it.
