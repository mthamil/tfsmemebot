import { describe, it }  from "mocha";
import { assert } from "chai";
import { parser } from "../../services/command-parser";

describe("command parser tests", () => {

    ["@memebot ",
     "@memebot"].forEach(input =>
    {
        it(`'${input}': should not match`, () => {
            // Act.
            const result = parser.parse(input)

            // Assert.
            assert.isNull(result);
        });
    });

    ["@memebot facepalm;",
     "@memebot facepalm  ",
     "@memebot    facepalm;"].forEach(input =>
    {
        it(`'${input}': should match`, () => {
            // Act.
            const result = parser.parse(input)

            // Assert.
            assert.isNotNull(result);
            assert.equal(result.name, "facepalm");
            assert.equal(result.topText, "");
            assert.equal(result.bottomText, "");
        });
    });

    ["@memebot facepalm; line1; line 2",
     "@memebot facepalm;line1;line 2",
     "@memebot    facepalm;   line1;    line 2"].forEach(input =>
    {
        it(`'${input}': should match`, () => {
            // Act.
            const result = parser.parse(input)

            // Assert.
            assert.isNotNull(result);
            assert.equal(result.name, "facepalm");
            assert.equal(result.topText, "line1");
            assert.equal(result.bottomText, "line 2");
        });
    });

    ["@memebot facepalm; line1;",
     "@memebot facepalm;line1;    ",
     "@memebot    facepalm;   line1"].forEach(input =>
    {
        it(`'${input}': should match`, () => {
            // Act.
            const result = parser.parse(input)

            // Assert.
            assert.isNotNull(result);
            assert.equal(result.name, "facepalm");
            assert.equal(result.topText, "line1");
            assert.equal(result.bottomText, "");
        });
    });

    ["@memebot facepalm; ;line 2",
     "@memebot facepalm;;   line 2;",
     "@memebot    facepalm; ;  line 2 "].forEach(input =>
    {
        it(`'${input}': should match`, () => {
            // Act.
            const result = parser.parse(input)

            // Assert.
            assert.isNotNull(result);
            assert.equal(result.name, "facepalm");
            assert.equal(result.topText, "");
            assert.equal(result.bottomText, "line 2");
        });
    });

    ["@memebotfacepalm; line1; line 2"].forEach(input =>
    {
        it(`'${input}': should not match`, () => {
            // Act.
            const result = parser.parse(input)

            // Assert.
            assert.isNull(result);
        });
    });
});

