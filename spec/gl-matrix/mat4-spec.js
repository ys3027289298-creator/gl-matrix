import * as glMatrix from "../../src/common.js"
import * as mat4 from "../../src/mat4.js"
import * as quat from "../../src/quat.js"
import * as vec3 from "../../src/vec3.js"

function buildMat4Tests() {
    return function() {
        let out, matA, matB, identity, nonInvertible, result;

        beforeEach(function() {
            // Attempting to portray a semi-realistic transform matrix
            matA = new Float32Array([1, 0, 0, 0,
                                     0, 1, 0, 0,
                                     0, 0, 1, 0,
                                     1, 2, 3, 1]);

            matB = new Float32Array([1, 0, 0, 0,
                                     0, 1, 0, 0,
                                     0, 0, 1, 0,
                                     4, 5, 6, 1]);

            out = new Float32Array([0, 0, 0, 0,
                                    0, 0, 0, 0,
                                    0, 0, 0, 0,
                                    0, 0, 0, 0]);

            identity = new Float32Array([1, 0, 0, 0,
                                         0, 1, 0, 0,
                                         0, 0, 1, 0,
                                         0, 0, 0, 1]);

            nonInvertible = new Float32Array([1, 2, 3, 4,
                                              1, 2, 3, 4,
                                              1, 2, 3, 4,
                                              1, 2, 3, 4]);
        });

        describe("create", function() {
            beforeEach(function() { result = mat4.create(); });
            it("should return a 16 element array initialized to a 4x4 identity matrix", function() { expect(result).toBeEqualish(identity); });
        });

        describe("clone", function() {
            beforeEach(function() { result = mat4.clone(matA); });
            it("should return a 16 element array initialized to the values in matA", function() { expect(result).toBeEqualish(matA); });
        });

        describe("copy", function() {
            beforeEach(function() { result = mat4.copy(out, matA); });
            it("should place values into out", function() { expect(out).toBeEqualish(matA); });
            it("should return out", function() { expect(result).toBe(out); });
        });

        describe("identity", function() {
            beforeEach(function() { result = mat4.identity(out); });
            it("should place values into out", function() { expect(result).toBeEqualish(identity); });
            it("should return out", function() { expect(result).toBe(out); });
        });

        describe("transpose", function() {
            describe("with a separate output matrix", function() {
                beforeEach(function() { result = mat4.transpose(out, matA); });

                it("should place values into out", function() {
                    expect(out).toBeEqualish([
                        1, 0, 0, 1,
                        0, 1, 0, 2,
                        0, 0, 1, 3,
                        0, 0, 0, 1
                    ]);
                });
                it("should return out", function() { expect(result).toBe(out); });
                it("should not modify matA", function() {
                    expect(matA).toBeEqualish([
                        1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, 1, 0,
                        1, 2, 3, 1
                    ]);
                });
            });

            describe("when matA is the output matrix", function() {
                beforeEach(function() { result = mat4.transpose(matA, matA); });

                it("should place values into matA", function() {
                    expect(matA).toBeEqualish([
                        1, 0, 0, 1,
                        0, 1, 0, 2,
                        0, 0, 1, 3,
                        0, 0, 0, 1
                    ]);
                });
                it("should return matA", function() { expect(result).toBe(matA); });
            });
        });

        describe("invert", function() {
            describe("with a separate output matrix", function() {
                beforeEach(function() { result = mat4.invert(out, matA); });

                it("should place values into out", function() {
                    expect(out).toBeEqualish([
                        1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, 1, 0,
                        -1, -2, -3, 1
                    ]);
                });
                it("should return out", function() { expect(result).toBe(out); });
                it("should not modify matA", function() {
                    expect(matA).toBeEqualish([
                        1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, 1, 0,
                        1, 2, 3, 1
                    ]);
                });
            });

            describe("when matA is the output matrix", function() {
                beforeEach(function() { result = mat4.invert(matA, matA); });

                it("should place values into matA", function() {
                    expect(matA).toBeEqualish([
                        1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, 1, 0,
                        -1, -2, -3, 1
                    ]);
                });
                it("should return matA", function() { expect(result).toBe(matA); });
            });

            describe("when matrix is not invertible", function() {
                beforeEach(function() { result = mat4.invert(out, nonInvertible); });

                it("should return null", function() { expect(result).toBe(null); });
            });
        });

        describe("adjoint", function() {
            describe("with a separate output matrix", function() {
                beforeEach(function() { result = mat4.adjoint(out, matA); });

                it("should place values into out", function() {
                    expect(out).toBeEqualish([
                        1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, 1, 0,
                        -1, -2, -3, 1
                    ]);
                });
                it("should return out", function() { expect(result).toBe(out); });
                it("should not modify matA", function() {
                    expect(matA).toBeEqualish([
                        1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, 1, 0,
                        1, 2, 3, 1
                    ]);
                });
            });

            describe("when matA is the output matrix", function() {
                beforeEach(function() { result = mat4.adjoint(matA, matA); });

                it("should place values into matA", function() {
                    expect(matA).toBeEqualish([
                        1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, 1, 0,
                        -1, -2, -3, 1
                    ]);
                });
                it("should return matA", function() { expect(result).toBe(matA); });
            });
        });

        describe("determinant", function() {
            beforeEach(function() { result = mat4.determinant(matA); });

            it("should return the determinant", function() { expect(result).toEqual(1); });
        });

        describe("multiply", function() {
            it("should have an alias called 'mul'", function() { expect(mat4.mul).toEqual(mat4.multiply); });

            describe("with a separate output matrix", function() {
                beforeEach(function() { result = mat4.multiply(out, matA, matB); });

                it("should place values into out", function() {
                    expect(out).toBeEqualish([
                        1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, 1, 0,
                        5, 7, 9, 1
                    ]);
                });
                it("should return out", function() { expect(result).toBe(out); });
                it("should not modify matA", function() {
                    expect(matA).toBeEqualish([
                        1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, 1, 0,
                        1, 2, 3, 1
                    ]);
                });
                it("should not modify matB", function() {
                    expect(matB).toBeEqualish([
                        1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, 1, 0,
                        4, 5, 6, 1
                    ]);
                });
            });

            describe("when matA is the output matrix", function() {
                beforeEach(function() { result = mat4.multiply(matA, matA, matB); });

                it("should place values into matA", function() {
                    expect(matA).toBeEqualish([
                        1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, 1, 0,
                        5, 7, 9, 1
                    ]);
                });
                it("should return matA", function() { expect(result).toBe(matA); });
                it("should not modify matB", function() {
                    expect(matB).toBeEqualish([
                        1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, 1, 0,
                        4, 5, 6, 1
                    ]);
                });
            });

            describe("when matB is the output matrix", function() {
                beforeEach(function() { result = mat4.multiply(matB, matA, matB); });

                it("should place values into matB", function() {
                    expect(matB).toBeEqualish([
                        1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, 1, 0,
                        5, 7, 9, 1
                    ]);
                });
                it("should return matB", function() { expect(result).toBe(matB); });
                it("should not modify matA", function() {
                    expect(matA).toBeEqualish([
                        1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, 1, 0,
                        1, 2, 3, 1
                    ]);
                });
            });
        });

        describe("translate", function() {
            describe("with a separate output matrix", function() {
                beforeEach(function() { result = mat4.translate(out, matA, [4, 5, 6]); });

                it("should place values into out", function() {
                    expect(out).toBeEqualish([
                        1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, 1, 0,
                        5, 7, 9, 1
                    ]);
                });
                it("should return out", function() { expect(result).toBe(out); });
                it("should not modify matA", function() {
                    expect(matA).toBeEqualish([
                        1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, 1, 0,
                        1, 2, 3, 1
                    ]);
                });
            });

            describe("when matA is the output matrix", function() {
                beforeEach(function() { result = mat4.translate(matA, matA, [4, 5, 6]); });

                it("should place values into matA", function() {
                    expect(matA).toBeEqualish([
                        1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, 1, 0,
                        5, 7, 9, 1
                    ]);
                });
                it("should return matA", function() { expect(result).toBe(matA); });
            });
        });

        describe("scale", function() {
            describe("with a separate output matrix", function() {
                beforeEach(function() { result = mat4.scale(out, matA, [4, 5, 6]); });

                it("should place values into out", function() {
                    expect(out).toBeEqualish([
                        4, 0, 0, 0,
                        0, 5, 0, 0,
                        0, 0, 6, 0,
                        1, 2, 3, 1
                    ]);
                });
                it("should return out", function() { expect(result).toBe(out); });
                it("should not modify matA", function() {
                    expect(matA).toBeEqualish([
                        1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, 1, 0,
                        1, 2, 3, 1
                    ]);
                });
            });

            describe("when matA is the output matrix", function() {
                beforeEach(function() { result = mat4.scale(matA, matA, [4, 5, 6]); });

                it("should place values into matA", function() {
                    expect(matA).toBeEqualish([
                        4, 0, 0, 0,
                        0, 5, 0, 0,
                        0, 0, 6, 0,
                        1, 2, 3, 1
                    ]);
                });
                it("should return matA", function() { expect(result).toBe(matA); });
            });
        });

        describe("rotate", function() {
            let rad = Math.PI * 0.5;
            let axis = [1, 0, 0];

            describe("with a separate output matrix", function() {
                beforeEach(function() { result = mat4.rotate(out, matA, rad, axis); });

                it("should place values into out", function() {
                    expect(out).toBeEqualish([
                        1, 0, 0, 0,
                        0, Math.cos(rad), Math.sin(rad), 0,
                        0, -Math.sin(rad), Math.cos(rad), 0,
                        1, 2, 3, 1
                    ]);
                });
                it("should return out", function() { expect(result).toBe(out); });
                it("should not modify matA", function() {
                    expect(matA).toBeEqualish([
                        1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, 1, 0,
                        1, 2, 3, 1
                    ]);
                });
            });

            describe("when matA is the output matrix", function() {
                beforeEach(function() { result = mat4.rotate(matA, matA, rad, axis); });

                it("should place values into matA", function() {
                    expect(matA).toBeEqualish([
                        1, 0, 0, 0,
                        0, Math.cos(rad), Math.sin(rad), 0,
                        0, -Math.sin(rad), Math.cos(rad), 0,
                        1, 2, 3, 1
                    ]);
                });
                it("should return matA", function() { expect(result).toBe(matA); });
            });
        });

        describe("rotateX", function() {
            let rad = Math.PI * 0.5;

            describe("with a separate output matrix", function() {
                beforeEach(function() { result = mat4.rotateX(out, matA, rad); });

                it("should place values into out", function() {
                    expect(out).toBeEqualish([
                        1, 0, 0, 0,
                        0, Math.cos(rad), Math.sin(rad), 0,
                        0, -Math.sin(rad), Math.cos(rad), 0,
                        1, 2, 3, 1
                    ]);
                });
                it("should return out", function() { expect(result).toBe(out); });
                it("should not modify matA", function() {
                    expect(matA).toBeEqualish([
                        1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, 1, 0,
                        1, 2, 3, 1
                    ]);
                });
            });

            describe("when matA is the output matrix", function() {
                beforeEach(function() { result = mat4.rotateX(matA, matA, rad); });

                it("should place values into matA", function() {
                    expect(matA).toBeEqualish([
                        1, 0, 0, 0,
                        0, Math.cos(rad), Math.sin(rad), 0,
                        0, -Math.sin(rad), Math.cos(rad), 0,
                        1, 2, 3, 1
                    ]);
                });
                it("should return matA", function() { expect(result).toBe(matA); });
            });
        });

        describe("rotateY", function() {
            let rad = Math.PI * 0.5;

            describe("with a separate output matrix", function() {
                beforeEach(function() { result = mat4.rotateY(out, matA, rad); });

                it("should place values into out", function() {
                    expect(out).toBeEqualish([
                        Math.cos(rad), 0, -Math.sin(rad), 0,
                        0, 1, 0, 0,
                        Math.sin(rad), 0, Math.cos(rad), 0,
                        1, 2, 3, 1
                    ]);
                });
                it("should return out", function() { expect(result).toBe(out); });
                it("should not modify matA", function() {
                    expect(matA).toBeEqualish([
                        1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, 1, 0,
                        1, 2, 3, 1
                    ]);
                });
            });

            describe("when matA is the output matrix", function() {
                beforeEach(function() { result = mat4.rotateY(matA, matA, rad); });

                it("should place values into matA", function() {
                    expect(matA).toBeEqualish([
                        Math.cos(rad), 0, -Math.sin(rad), 0,
                        0, 1, 0, 0,
                        Math.sin(rad), 0, Math.cos(rad), 0,
                        1, 2, 3, 1
                    ]);
                });
                it("should return matA", function() { expect(result).toBe(matA); });
            });
        });

        describe("rotateZ", function() {
            let rad = Math.PI * 0.5;

            describe("with a separate output matrix", function() {
                beforeEach(function() { result = mat4.rotateZ(out, matA, rad); });

                it("should place values into out", function() {
                    expect(out).toBeEqualish([
                        Math.cos(rad), Math.sin(rad), 0, 0,
                        -Math.sin(rad), Math.cos(rad), 0, 0,
                        0, 0, 1, 0,
                        1, 2, 3, 1
                    ]);
                });
                it("should return out", function() { expect(result).toBe(out); });
                it("should not modify matA", function() {
                    expect(matA).toBeEqualish([
                        1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, 1, 0,
                        1, 2, 3, 1
                    ]);
                });
            });

            describe("when matA is the output matrix", function() {
                beforeEach(function() { result = mat4.rotateZ(matA, matA, rad); });

                it("should place values into matA", function() {
                    expect(matA).toBeEqualish([
                        Math.cos(rad), Math.sin(rad), 0, 0,
                        -Math.sin(rad), Math.cos(rad), 0, 0,
                        0, 0, 1, 0,
                        1, 2, 3, 1
                    ]);
                });
                it("should return matA", function() { expect(result).toBe(matA); });
            });
        });

        // TODO: fromRotationTranslation

        describe("getTranslation", function() {
            describe("from the identity matrix", function() {
                beforeEach(function() {
                    result = vec3.fromValues(1, 2, 3);
                    out = vec3.fromValues(1, 2, 3);
                    result = mat4.getTranslation(out, identity);
                });
                it("should place result both in result and out", function() { expect(result).toBe(out); });
                it("should return the zero vector", function() { expect(result).toBeEqualish([0, 0, 0]); });
            });

            describe("from a translation-only matrix", function() {
                beforeEach(function() {
                    result = vec3.fromValues(1, 2, 3);
                    out = vec3.fromValues(1, 2, 3);
                    result = mat4.getTranslation(out, matB);
                });
                it("should return translation vector", function() { expect(out).toBeEqualish([4, 5, 6]); });
            });

            describe("from a translation and rotation matrix", function() {
                beforeEach(function() {
                    let q = quat.create();
                    let v = vec3.fromValues(5, 6, 7);
                    q = quat.setAxisAngle(q, [0.26726124, 0.534522474, 0.8017837], 0.55);
                    mat4.fromRotationTranslation(out, q, v);

                    result = vec3.create();
                    mat4.getTranslation(result, out);
                });
                it("should keep the same translation vector, regardless of rotation", function() {
                    expect(result).toBeEqualish([5, 6, 7]);
                });
            });
        });

        describe("getScaling", function() {
            describe("from the identity matrix", function() {
                beforeEach(function() {
                    result = vec3.fromValues(1, 2, 3);
                    out = vec3.fromValues(1, 2, 3);
                    result = mat4.getScaling(out, identity);
                });
                it("should place result both in result and out", function() { expect(result).toBe(out); });
                it("should return the identity vector", function() { expect(result).toBeEqualish([1, 1, 1]); });
            });

            describe("from a scale-only matrix", function() {
                beforeEach(function() {
                    let v = vec3.fromValues(4, 5, 6);
                    result = vec3.fromValues(1, 2, 3)
                    out = vec3.fromValues(1, 2, 3);
                    mat4.fromScaling(matA, v);
                    result = mat4.getScaling(out, matA);
                });
                it("should return translation vector", function() { expect(out).toBeEqualish([4, 5, 6]); });
            });

            describe("from a translation and rotation matrix", function() {
                beforeEach(function() {
                    let q = quat.create();
                    let v = vec3.fromValues(5, 6, 7);
                    q = quat.setAxisAngle(q, [1, 0, 0], 0.5);
                    mat4.fromRotationTranslation(out, q, v);

                    result = vec3.fromValues(1, 2, 3);
                    mat4.getScaling(result, out);
                })
                it("should return the identity vector", function() { expect(result).toBeEqualish([1, 1, 1]); });
            });

            describe("from a translation, rotation and scale matrix", function() {
                beforeEach(function() {
                    let q = quat.create();
                    let t = vec3.fromValues(1, 2, 3);
                    let s = vec3.fromValues(5, 6, 7);
                    q = quat.setAxisAngle(q, [0, 1, 0], 0.7);
                    mat4.fromRotationTranslationScale(out, q, t, s);
                    result = vec3.fromValues(5, 6, 7);
                    mat4.getScaling(result, out);
                })
                it("should return the same scaling factor when created", function() { expect(result).toBeEqualish([5, 6, 7]); });
            });

        });

        describe("getRotation", function() {
            describe("from the identity matrix", function() {
                beforeEach(function() {
                    result = quat.fromValues(1, 2, 3, 4);
                    out = quat.fromValues(1, 2, 3, 4);
                    result = mat4.getRotation(out, identity);
                });
                it("should place result both in result and out", function() { expect(result).toBe(out); });
                it("should return the unit quaternion", function() {
                    let unitQuat = quat.create();
                    quat.identity(unitQuat);
                    expect(result).toBeEqualish(unitQuat);
                });
            });

            describe("from a translation-only matrix", function() {
                beforeEach(function() {
                    result = quat.fromValues(1, 2, 3, 4);
                    out = quat.fromValues(1, 2, 3, 4);
                    result = mat4.getRotation(out, matB);
                });
                it("should return the unit quaternion", function() {
                    let unitQuat = quat.create();
                    quat.identity(unitQuat);
                    expect(result).toBeEqualish(unitQuat);
                });
            });

            describe("from a translation and rotation matrix", function() {
                it("should keep the same rotation as when created", function() {
                    let q = quat.create();
                    let outVec = vec3.fromValues(5, 6, 7);
                    let testVec = vec3.fromValues(1, 5, 2);
                    let ang = 0.78972;

                    vec3.normalize(testVec, testVec);
                    q = quat.setAxisAngle(q, testVec, ang);
                    mat4.fromRotationTranslation(out, q, outVec);

                    result = quat.fromValues(2, 3, 4, 6);
                    mat4.getRotation(result, out);
                    let outaxis = vec3.create();
                    let outangle = quat.getAxisAngle(outaxis, result);

                    expect(outaxis).toBeEqualish(testVec);
                    expect(outangle).toBeEqualish(ang);
                });
            });

            describe("from a translation, rotation and non-uniform scale matrix", function() {
                it("should keep the same rotation as when created", function() {
                    let q = quat.create();
                    let outVec = vec3.fromValues(5, 6, 7);
                    let scaleVec = vec3.fromValues(2, 3, 4);
                    let testVec = vec3.fromValues(1, 5, 2);
                    let ang = 0.78972;

                    vec3.normalize(testVec, testVec);
                    q = quat.setAxisAngle(q, testVec, ang);
                    mat4.fromRotationTranslationScale(out, q, outVec, scaleVec);

                    result = quat.fromValues(2, 3, 4, 6);
                    mat4.getRotation(result, out);
                    let outaxis = vec3.create();
                    let outangle = quat.getAxisAngle(outaxis, result);

                    expect(outaxis).toBeEqualish(testVec);
                    expect(outangle).toBeEqualish(ang);
                });
            });
        });

        let out_t, out_s;
        describe("decompose", function() {
            describe("from the identity matrix", function() {
                beforeEach(function() {
                    result = quat.fromValues(1, 2, 3, 4);
                    out_t = vec3.fromValues(7, 8, 9);
                    out_s = vec3.fromValues(4, 5, 6);
                    out = quat.fromValues(1, 2, 3, 4);
                    result = mat4.decompose(out, out_t, out_s, identity);
                });
                it("should place result both in result and out", function() { expect(result).toBe(out); });
                it("should return the unit quaternion", function() {
                    let unitQuat = quat.create();
                    quat.identity(unitQuat);
                    expect(result).toBeEqualish(unitQuat);
                });
                it("out_s should be the identity vector", function() { expect(out_s).toBeEqualish([1, 1, 1]); });
                it("out_t should be the zero vector", function() { expect(out_t).toBeEqualish([0, 0, 0]); });
            });

            describe("from a translation-only matrix", function() {
                beforeEach(function() {
                    result = quat.fromValues(1, 2, 3, 4);
                    out_t = vec3.fromValues(7, 8, 9);
                    out_s = vec3.fromValues(4, 5, 6);
                    out = quat.fromValues(1, 2, 3, 4);
                    result = mat4.decompose(out, out_t, out_s, matB);
                });
                it("should return the unit quaternion", function() {
                    let unitQuat = quat.create();
                    quat.identity(unitQuat);
                    expect(result).toBeEqualish(unitQuat);
                });
                it("out_s should be the identity vector", function() { expect(out_s).toBeEqualish([1, 1, 1]); });
                it("out_t should be translation vector", function() { expect(out_t).toBeEqualish([4, 5, 6]); });
            });

            describe("from a scale-only matrix", function() {
                beforeEach(function() {
                    let v = vec3.fromValues(4, 5, 6);
                    result = vec3.fromValues(1, 2, 3)
                    out_t = vec3.fromValues(7, 8, 9);
                    out_s = vec3.fromValues(1, 2, 3);
                    out = quat.fromValues(1, 2, 3, 4);
                    mat4.fromScaling(matA, v);
                    result = mat4.decompose(out, out_t, out_s, matA);
                });
                it("out_s should be translation vector", function() { expect(out_s).toBeEqualish([4, 5, 6]); });
            });

            describe("from a translation and rotation matrix", function() {
                it("should keep the same rotation and translation as when created", function() {
                    let q = quat.create();
                    let outVec = vec3.fromValues(5, 6, 7);
                    let testVec = vec3.fromValues(1, 5, 2);
                    let ang = 0.78972;

                    vec3.normalize(testVec, testVec);
                    q = quat.setAxisAngle(q, testVec, ang);
                    mat4.fromRotationTranslation(out, q, outVec);

                    result = quat.fromValues(2, 3, 4, 6);
                    out_t = vec3.fromValues(7, 8, 9);
                    out_s = vec3.fromValues(4, 5, 6);
                    mat4.decompose(result, out_t, out_s, out);
                    let outaxis = vec3.create();
                    let outangle = quat.getAxisAngle(outaxis, result);

                    expect(outaxis).toBeEqualish(testVec);
                    expect(outangle).toBeEqualish(ang);
                    expect(out_t).toBeEqualish(outVec);
                });
            });

            describe("from a translation, rotation and scale matrix", function() {
                let inputRot;
                beforeEach(function() {
                    let q = quat.create();
                    let t = vec3.fromValues(1, 2, 3);
                    let s = vec3.fromValues(5, 6, 7);
                    q = quat.setAxisAngle(q, [0, 1, 0], 0.7);
                    inputRot = quat.clone(q);
                    mat4.fromRotationTranslationScale(out, q, t, s);
                    out_t = vec3.fromValues(7, 8, 9);
                    out_s = vec3.fromValues(4, 5, 6);
                    result = quat.fromValues(2, 3, 4, 6);
                    mat4.decompose(result, out_t, out_s, out);
                })
                it("should return the same rotation when created", function() { expect(result).toBeEqualish(inputRot); });
                it("should return the same scaling factor when created", function() { expect(out_s).toBeEqualish([5, 6, 7]); });
                it("should return the same translation when created", function() { expect(out_t).toBeEqualish([1, 2, 3]); });
            });

        });

        describe("frustum", function() {
            beforeEach(function() { result = mat4.frustum(out, -1, 1, -1, 1, -1, 1); });
            it("should place values into out", function() { expect(result).toBeEqualish([
                    -1, 0, 0, 0,
                    0, -1, 0, 0,
                    0, 0, 0, -1,
                    0, 0, 1, 0
                ]);
            });
            it("should return out", function() { expect(result).toBe(out); });
        });

        describe("perspective", function() {
            let fovy = Math.PI * 0.5;
            beforeEach(function() { result = mat4.perspective(out, fovy, 1, 0, 1); });
            it("should place values into out", function() { expect(result).toBeEqualish([
                    1, 0, 0, 0,
                    0, 1, 0, 0,
                    0, 0, -1, -1,
                    0, 0, 0, 0
                ]);
            });
            it("should return out", function() { expect(result).toBe(out); });

            describe("with nonzero near, 45deg fovy, and realistic aspect ratio", function() {
                beforeEach(function() { result = mat4.perspective(out, 45 * Math.PI / 180.0, 640/480, 0.1, 200); });
                it("should calculate correct matrix", function() { expect(result).toBeEqualish([
                    1.81066, 0, 0, 0,
                    0, 2.414213, 0, 0,
                    0, 0, -1.001, -1,
                    0, 0, -0.2001, 0
                ]); });
            });

            describe("with no far plane, 45deg fovy, and realistic aspect ratio", function() {
                beforeEach(function() { result = mat4.perspective(out, 45 * Math.PI / 180.0, 640/480, 0.1); });
                it("should calculate correct matrix", function() { expect(result).toBeEqualish([
                    1.81066, 0, 0, 0,
                    0, 2.414213, 0, 0,
                    0, 0, -1, -1,
                    0, 0, -0.2, 0
                ]); });
            });

            describe("with infinite far plane, 45deg fovy, and realistic aspect ratio", function() {
                beforeEach(function() { result = mat4.perspective(out, 45 * Math.PI / 180.0, 640/480, 0.1, Infinity); });
                it("should calculate correct matrix", function() { expect(result).toBeEqualish([
                    1.81066, 0, 0, 0,
                    0, 2.414213, 0, 0,
                    0, 0, -1, -1,
                    0, 0, -0.2, 0
                ]); });
            });
        });

        describe("ortho", function() {
            beforeEach(function() { result = mat4.ortho(out, -1, 1, -1, 1, -1, 1); });
            it("should place values into out", function() { expect(result).toBeEqualish([
                    1, 0, 0, 0,
                    0, 1, 0, 0,
                    0, 0, -1, 0,
                    0, 0, 0, 1
                ]);
            });
            it("should return out", function() { expect(result).toBe(out); });
        });

        describe("lookAt", function() {
            let eye    = new Float32Array([0, 0, 1]);
            let center = new Float32Array([0, 0, -1]);
            let up     = new Float32Array([0, 1, 0]);
            let view, right;

            describe("looking down", function() {
                beforeEach(function() {
                    view = new Float32Array([0, -1,  0]);
                    up   = new Float32Array([0,  0, -1]);
                    right= new Float32Array([1,  0,  0]);
                    result = mat4.lookAt(out, [0, 0, 0], view, up);
                });

                it("should transform view into local -Z", function() {
                    result = vec3.transformMat4(new Float32Array(3), view, out);
                    expect(result).toBeEqualish([0, 0, -1]);
                });

                it("should transform up into local +Y", function() {
                    result = vec3.transformMat4(new Float32Array(3), up, out);
                    expect(result).toBeEqualish([0, 1, 0]);
                });

                it("should transform right into local +X", function() {
                    result = vec3.transformMat4(new Float32Array(3), right, out);
                    expect(result).toBeEqualish([1, 0, 0]);
                });

                it("should return out", function() { expect(result).toBe(out); });
            });

            describe("#74", function() {
                beforeEach(function() {
                    mat4.lookAt(out,
                        new Float32Array([0,2,0]),
                        new Float32Array([0,0.6,0]),
                        new Float32Array([0,0,-1]));
                });

                it("should transform a point 'above' into local +Y", function() {
                    result = vec3.transformMat4(new Float32Array(3), [0, 2, -1], out);
                    expect(result).toBeEqualish([0, 1, 0]);
                });

                it("should transform a point 'right of' into local +X", function() {
                    result = vec3.transformMat4(new Float32Array(3), [1, 2, 0], out);
                    expect(result).toBeEqualish([1, 0, 0]);
                });

                it("should transform a point 'in front of' into local -Z", function() {
                    result = vec3.transformMat4(new Float32Array(3), [0, 1, 0], out);
                    expect(result).toBeEqualish([0, 0, -1]);
                });
            });

            beforeEach(function() {
                eye    = new Float32Array([0, 0, 1]);
                center = new Float32Array([0, 0, -1]);
                up     = new Float32Array([0, 1, 0]);
                result = mat4.lookAt(out, eye, center, up);
            });
            it("should place values into out", function() { expect(result).toBeEqualish([
                    1, 0, 0, 0,
                    0, 1, 0, 0,
                    0, 0, 1, 0,
                    0, 0, -1, 1
                ]);
            });
            it("should return out", function() { expect(result).toBe(out); });
        });

        describe("targetTo", function() {
            var eye    = new Float32Array([0, 0, 1]);
            var center = new Float32Array([0, 0, -1]);
            var up     = new Float32Array([0, 1, 0]);
            var view, up, right;

            describe("looking down", function() {
                beforeEach(function() {
                    view = new Float32Array([0, -1,  0]);
                    up   = new Float32Array([0,  0, -1]);
                    right= new Float32Array([1,  0,  0]);
                    result = mat4.targetTo(out, [0, 0, 0], view, up);
                });

                it("should transform view into local Z", function() {
                    result = vec3.transformMat4(new Float32Array(3), view, out);
                    expect(result).toBeEqualish([0, 0, 1]);
                });

                it("should transform up into local -Y", function() {
                    result = vec3.transformMat4(new Float32Array(3), up, out);
                    expect(result).toBeEqualish([0, -1, 0]);
                });

                it("should transform right into local +X", function() {
                    result = vec3.transformMat4(new Float32Array(3), right, out);
                    expect(result).toBeEqualish([1, 0, 0]);
                });

                it("should return out", function() { expect(result).toBe(out); });

                it("scaling should be [1, 1, 1]", function(){
                    var scaling = mat4.getScaling(new Float32Array(3), out);
                    expect(scaling).toBeEqualish([1, 1, 1]);
                });
            });

            describe("#74", function() {
                beforeEach(function() {
                    mat4.targetTo(out,
                        new Float32Array([0,2,0]),
                        new Float32Array([0,0.6,0]),
                        new Float32Array([0,0,-1]));
                });

                it("should transform a point 'above' into local +Y", function() {
                    result = vec3.transformMat4(new Float32Array(3), [0, 2, -1], out);
                    expect(result).toBeEqualish([0, 1, -2]);
                });

                it("should transform a point 'right of' into local +X", function() {
                    result = vec3.transformMat4(new Float32Array(3), [1, 2, 0], out);
                    expect(result).toBeEqualish([1, 2, -2]);
                });

                it("should transform a point 'in front of' into local -Z", function() {
                    result = vec3.transformMat4(new Float32Array(3), [0, 1, 0], out);
                    expect(result).toBeEqualish([0, 2, -1]);
                });

                it("scaling should be [1, 1, 1]", function(){
                    var scaling = mat4.getScaling(new Float32Array(3), out);
                    expect(scaling).toBeEqualish([1, 1, 1]);
                });
            });

            describe("scaling test", function(){
                beforeEach(function() {
                    mat4.targetTo(out,
                        new Float32Array([0,1,0]),
                        new Float32Array([0,0,1]),
                        new Float32Array([0,0,-1]));
                });

                it("scaling should be [1, 1, 1]", function(){
                    var scaling = mat4.getScaling(new Float32Array(3), out);
                    expect(scaling).toBeEqualish([1, 1, 1]);
                });
            });

            beforeEach(function() {
                eye    = new Float32Array([0, 0, 1]);
                center = new Float32Array([0, 0, -1]);
                up     = new Float32Array([0, 1, 0]);
                result = mat4.targetTo(out, eye, center, up);
            });
            it("should place values into out", function() { expect(result).toBeEqualish([
                    1, 0, 0, 0,
                    0, 1, 0, 0,
                    0, 0, 1, 0,
                    0, 0, 1, 1
                ]);
            });
            it("should return out", function() { expect(result).toBe(out); });
            it("scaling should be [1, 1, 1]", function(){
                var scaling = mat4.getScaling(new Float32Array(3), out);
                expect(scaling).toBeEqualish([1, 1, 1]);
            });
        });

        describe("str", function() {
            beforeEach(function() { result = mat4.str(matA); });

            it("should return a string representation of the matrix", function() { expect(result).toEqual("mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 2, 3, 1)"); });
        });

       describe("frob", function() {
            beforeEach(function() { result = mat4.frob(matA); });
            it("should return the Frobenius Norm of the matrix", function() { expect(result).toBeEqualish( Math.sqrt(Math.pow(1, 2) + Math.pow(1, 2) + Math.pow(1, 2) + Math.pow(1, 2) + Math.pow(1, 2) + Math.pow(2, 2) + Math.pow(3, 2) )); });
       });

    describe("obliqueFromPlane", function() {
        // Section plane tilted 20 degrees about X through p0 = (0, 0, -1)
        const angle = 20 * Math.PI / 180;
        const normal = [0, Math.sin(angle), -Math.cos(angle)];
        const pointOnPlane = [0, 0, -1];
        let oblique, twice, drift;

        beforeEach(function() {
            oblique = mat4.create();
            twice = mat4.create();
            mat4.obliqueFromPlane(oblique, normal, pointOnPlane, null);
            mat4.multiply(twice, oblique, oblique);
            drift = 0;
            for (let i = 0; i < 16; i++) {
                drift = Math.max(drift, Math.abs(oblique[i] - twice[i]));
            }
        });

        it("should be an affine matrix with a unit homogeneous row", function() {
            expect([oblique[3], oblique[7], oblique[11], oblique[15]]).toBeEqualish([0, 0, 0, 1]);
        });

        it("should match the closed-form Q = I - d*n^T/(n.d) construction", function() {
            const nLen = Math.hypot(normal[0], normal[1], normal[2]);
            const n = normal.map((v) => v / nLen);
            let d = [1 - n[0], -n[1], -n[2]];
            const dLen = Math.hypot(d[0], d[1], d[2]);
            d = d.map((v) => v / dLen);
            const nd = n[0] * d[0] + n[1] * d[1] + n[2] * d[2];
            const offset = n[0] * pointOnPlane[0] + n[1] * pointOnPlane[1] + n[2] * pointOnPlane[2];
            const expected = mat4.create();
            for (let col = 0; col < 3; col++) {
                for (let row = 0; row < 3; row++) {
                    expected[col * 4 + row] = (row === col ? 1 : 0) - d[row] * n[col] / nd;
                }
            }
            expected[12] = d[0] * offset / nd;
            expected[13] = d[1] * offset / nd;
            expected[14] = d[2] * offset / nd;
            expect(oblique).toBeEqualish(expected);
        });

        it("should be idempotent (reused twice with only rounding-level drift)", function() {
            // Float32 storage: drift must stay at the single-precision round-off floor.
            expect(drift).toBeLessThan(1e-6);
        });

        it("should fix every point lying on the plane", function() {
            const onPlane = [1, 0, -0.5];
            onPlane[1] =
                (normal[2] * (pointOnPlane[2] - onPlane[2])) / normal[1] + pointOnPlane[1];
            const transformed = vec3.transformMat4(vec3.create(), onPlane, oblique);
            expect(transformed).toBeEqualish(onPlane);
        });

        it("should build bit-identical matrices for repeated calls", function() {
            const again = mat4.create();
            mat4.obliqueFromPlane(again, normal, pointOnPlane, null);
            expect(mat4.exactEquals(oblique, again)).toBe(true);
        });

        it("should compose with the existing ortho chain without modifying inputs", function() {
            const orthoMatrix = mat4.ortho(mat4.create(), -4, 4, -4, 4, 0.45, 6);
            const snapshot = oblique.slice();
            const chained = mat4.multiply(mat4.create(), orthoMatrix, oblique);
            expect(chained[15]).toBe(1);
            expect(oblique.slice()).toBeEqualish(snapshot);
        });

        it("should keep an on-plane vertex that an axis-aligned near plane would cull", function() {
            // Section vertex on the oblique plane but in front of the z = -1 near plane.
            const sectionVertex = [1, 0, -0.5];
            sectionVertex[1] =
                (normal[2] * (pointOnPlane[2] - sectionVertex[2])) / normal[1] + pointOnPlane[1];

            const naive = mat4.ortho(mat4.create(), -4, 4, -4, 4, 1, 5);
            // Fit the ortho volume to the sheared scene (AABB + 5% margin) so the
            // oblique chain never removes a vertex that survives the oblique step.
            const sheared = vec3.transformMat4(vec3.create(), sectionVertex, oblique);
            const margin = 0.05;
            const adjusted = mat4.ortho(
                mat4.create(),
                sheared[0] - margin, sheared[0] + margin,
                sheared[1] - margin, sheared[1] + margin,
                -sheared[2] - margin, -sheared[2] + margin
            );
            const chained = mat4.multiply(mat4.create(), adjusted, oblique);

            const insideClip = (m, p) => {
                const x = m[0] * p[0] + m[4] * p[1] + m[8] * p[2] + m[12];
                const y = m[1] * p[0] + m[5] * p[1] + m[9] * p[2] + m[13];
                const z = m[2] * p[0] + m[6] * p[1] + m[10] * p[2] + m[14];
                const w = m[15];
                return -w <= z && z <= w && -w <= x && x <= w && -w <= y && y <= w;
            };

            expect(insideClip(naive, sectionVertex)).toBe(false);
            expect(insideClip(chained, sectionVertex)).toBe(true);
        });

        it("should throw on a degenerate (zero-length) plane normal", function() {
            expect(function() {
                mat4.obliqueFromPlane(mat4.create(), [0, 0, 0], pointOnPlane, null);
            }).toThrowError(/degenerate plane/);
        });

        it("should throw on a zero-length projector", function() {
            expect(function() {
                mat4.obliqueFromPlane(mat4.create(), normal, pointOnPlane, [0, 0, 0]);
            }).toThrowError(/degenerate projector/);
        });

        it("should throw when the projector is parallel to the plane", function() {
            const edge = [1, 0, 0]; // n . (1,0,0) = 0 for this normal
            expect(function() {
                mat4.obliqueFromPlane(mat4.create(), normal, pointOnPlane, edge);
            }).toThrowError(/parallel to the plane/);
        });
    });

    describe("obliqueFromQuad", function() {
        const angle = 20 * Math.PI / 180;
        const normal = [0, Math.sin(angle), -Math.cos(angle)];
        const p0 = [0, 0, -1];
        const onPlane = (x, z) => [
            x,
            (normal[2] * (p0[2] - z)) / normal[1] + p0[1],
            z
        ];

        it("should produce the same matrix as obliqueFromPlane for a coplanar quad", function() {
            const quad = [
                onPlane(-1, -0.5), onPlane(1, -0.5),
                onPlane(1, -2.5), onPlane(-1, -2.5)
            ];
            const fromQuad = mat4.create();
            const fromPlane = mat4.create();
            mat4.obliqueFromQuad(fromQuad, quad[0], quad[1], quad[2], quad[3], null);
            mat4.obliqueFromPlane(fromPlane, normal, p0, null);
            expect(fromQuad).toBeEqualish(fromPlane);
        });

        it("should be bit-identical for the same winding, including repeated calls", function() {
            const quad = [
                onPlane(-1, -0.5), onPlane(1, -0.5),
                onPlane(1, -2.5), onPlane(-1, -2.5)
            ];
            const first = mat4.create();
            const second = mat4.create();
            mat4.obliqueFromQuad(first, quad[0], quad[1], quad[2], quad[3], null);
            mat4.obliqueFromQuad(second, quad[0], quad[1], quad[2], quad[3], null);
            expect(mat4.exactEquals(first, second)).toBe(true);
        });

        it("should throw when three points are collinear (degenerate plane)", function() {
            const a = [0, 0, 0], b = [1, 0, 0], c = [2, 0, 0], d = [0, 1, 0];
            expect(function() {
                mat4.obliqueFromQuad(mat4.create(), a, b, c, d, null);
            }).toThrowError(/collinear|degenerate plane/);
        });

        it("should throw when duplicate points collapse the plane", function() {
            const a = [0, 0, 0], b = [0, 0, 0], c = [0, 1, 0], d = [1, 1, 0];
            expect(function() {
                mat4.obliqueFromQuad(mat4.create(), a, b, c, d, null);
            }).toThrowError(/collinear|degenerate plane/);
        });

        it("should throw when the four points are not coplanar", function() {
            const a = [0, 0, 0], b = [1, 0, 0], c = [0, 1, 0], d = [0, 0, 1];
            expect(function() {
                mat4.obliqueFromQuad(mat4.create(), a, b, c, d, null);
            }).toThrowError(/not coplanar/);
        });
    });
    };

    describe("add", function() {
        beforeEach(function() {
            matA = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
            matB = [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32];
        });
        describe("with a separate output matrix", function() {
            beforeEach(function() {
                result = mat3.add(out, matA, matB);
            });

            it("should place values into out", function() { expect(out).toBeEqualish([18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48]); });
            it("should return out", function() { expect(result).toBe(out); });
            it("should not modify matA", function() { expect(matA).toBeEqualish([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]); });
            it("should not modify matB", function() { expect(matB).toBeEqualish([17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32]); });
        });

        describe("when matA is the output matrix", function() {
            beforeEach(function() { result = mat3.add(matA, matA, matB); });

            it("should place values into matA", function() { expect(matA).toBeEqualish([18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48]); });
            it("should return matA", function() { expect(result).toBe(matA); });
            it("should not modify matB", function() { expect(matB).toBeEqualish([17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32]); });
        });

        describe("when matB is the output matrix", function() {
            beforeEach(function() { result = mat3.add(matB, matA, matB); });

            it("should place values into matB", function() { expect(matB).toBeEqualish([18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48]); });
            it("should return matB", function() { expect(result).toBe(matB); });
            it("should not modify matA", function() { expect(matA).toBeEqualish([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]); });
        });
    });

    describe("subtract", function() {
        beforeEach(function() {
            matA = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
            matB = [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32];
        });
        it("should have an alias called 'sub'", function() { expect(mat3.sub).toEqual(mat3.subtract); });

        describe("with a separate output matrix", function() {
            beforeEach(function() { result = mat3.subtract(out, matA, matB); });

            it("should place values into out", function() { expect(out).toBeEqualish([-16, -16, -16, -16, -16, -16, -16, -16, -16, -16, -16, -16, -16, -16, -16, -16]); });
            it("should return out", function() { expect(result).toBe(out); });
            it("should not modify matA", function() { expect(matA).toBeEqualish([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]); });
            it("should not modify matB", function() { expect(matB).toBeEqualish([17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32]); });
        });

        describe("when matA is the output matrix", function() {
            beforeEach(function() { result = mat3.subtract(matA, matA, matB); });

            it("should place values into matA", function() { expect(matA).toBeEqualish([-16, -16, -16, -16, -16, -16, -16, -16, -16, -16, -16, -16, -16, -16, -16, -16]); });
            it("should return matA", function() { expect(result).toBe(matA); });
            it("should not modify matB", function() { expect(matB).toBeEqualish([17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32]); });
        });

        describe("when matB is the output matrix", function() {
            beforeEach(function() { result = mat3.subtract(matB, matA, matB); });

            it("should place values into matB", function() { expect(matB).toBeEqualish([-16, -16, -16, -16, -16, -16, -16, -16, -16, -16, -16, -16, -16, -16, -16, -16]); });
            it("should return matB", function() { expect(result).toBe(matB); });
            it("should not modify matA", function() { expect(matA).toBeEqualish([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]); });
        });
    });

    describe("fromValues", function() {
        beforeEach(function() { result = mat4.fromValues(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16); });
        it("should return a 16 element array initialized to the values passed", function() { expect(result).toBeEqualish([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]); });
    });

    describe("set", function() {
        beforeEach(function() { result = mat4.set(out, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16); });
        it("should place values into out", function() { expect(out).toBeEqualish([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]); });
        it("should return out", function() { expect(result).toBe(out); });
    });

    describe("multiplyScalar", function() {
        beforeEach(function() {
            matA = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
        });
        describe("with a separate output matrix", function() {
            beforeEach(function() { result = mat3.multiplyScalar(out, matA, 2); });

            it("should place values into out", function() { expect(out).toBeEqualish([2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32]); });
            it("should return out", function() { expect(result).toBe(out); });
            it("should not modify matA", function() { expect(matA).toBeEqualish([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]); });
        });

        describe("when matA is the output matrix", function() {
            beforeEach(function() { result = mat3.multiplyScalar(matA, matA, 2); });

            it("should place values into matA", function() { expect(matA).toBeEqualish([2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32]); });
            it("should return matA", function() { expect(result).toBe(matA); });
        });
    });

    describe("multiplyScalarAndAdd", function() {
        beforeEach(function() {
            matA = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
            matB = [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32];
        });
        describe("with a separate output matrix", function() {
            beforeEach(function() { result = mat3.multiplyScalarAndAdd(out, matA, matB, 0.5); });

            it("should place values into out", function() { expect(out).toBeEqualish([9.5, 11, 12.5, 14, 15.5, 17, 18.5, 20, 21.5, 23, 24.5, 26, 27.5, 29, 30.5, 32]); });
            it("should return out", function() { expect(result).toBe(out); });
            it("should not modify matA", function() { expect(matA).toBeEqualish([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]); });
            it("should not modify matB", function() { expect(matB).toBeEqualish([17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32]); });
        });

        describe("when matA is the output matrix", function() {
            beforeEach(function() { result = mat3.multiplyScalarAndAdd(matA, matA, matB, 0.5); });

            it("should place values into matA", function() { expect(matA).toBeEqualish([9.5, 11, 12.5, 14, 15.5, 17, 18.5, 20, 21.5, 23, 24.5, 26, 27.5, 29, 30.5, 32]); });
            it("should return matA", function() { expect(result).toBe(matA); });
            it("should not modify matB", function() { expect(matB).toBeEqualish([17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32]); });
        });

        describe("when matB is the output matrix", function() {
            beforeEach(function() { result = mat3.multiplyScalarAndAdd(matB, matA, matB, 0.5); });

            it("should place values into matB", function() { expect(matB).toBeEqualish([9.5, 11, 12.5, 14, 15.5, 17, 18.5, 20, 21.5, 23, 24.5, 26, 27.5, 29, 30.5, 32]); });
            it("should return matB", function() { expect(result).toBe(matB); });
            it("should not modify matA", function() { expect(matA).toBeEqualish([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]); });
        });
    });

    describe("exactEquals", function() {
        let matC, r0, r1;
        beforeEach(function() {
            matA = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
            matB = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
            matC = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
            r0 = mat4.exactEquals(matA, matB);
            r1 = mat4.exactEquals(matA, matC);
        });

        it("should return true for identical matrices", function() { expect(r0).toBe(true); });
        it("should return false for different matrices", function() { expect(r1).toBe(false); });
        it("should not modify matA", function() { expect(matA).toBeEqualish([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]); });
        it("should not modify matB", function() { expect(matB).toBeEqualish([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]); });
    });

    describe("equals", function() {
        let matC, matD, r0, r1, r2;
        beforeEach(function() {
            matA = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
            matB = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
            matC = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
            matD = [1e-16, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
            r0 = mat4.equals(matA, matB);
            r1 = mat4.equals(matA, matC);
            r2 = mat4.equals(matA, matD);
        });
        it("should return true for identical matrices", function() { expect(r0).toBe(true); });
        it("should return false for different matrices", function() { expect(r1).toBe(false); });
        it("should return true for close but not identical matrices", function() { expect(r2).toBe(true); });
        it("should not modify matA", function() { expect(matA).toBeEqualish([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]); });
        it("should not modify matB", function() { expect(matB).toBeEqualish([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]); });
    });
}

describe("mat4", buildMat4Tests());
