import { describe, it }  from "mocha";
import { assert } from "chai";
import { parser } from "../../services/command-parser";

describe("command parser tests", () => {

    ["@memebot facepalm; line1; line 2",
     "@memebot facepalm;line1;line 2",
     "@memebot    facepalm;   line1;    line 2"].forEach(input =>
    {
        it(`'${input}': should match`, () => {
            // Act.
            const result = parser.parse(input)

            // Assert.
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
            assert.equal(result.name, "facepalm");
            assert.equal(result.topText, "line1");
            assert.equal(result.bottomText, "");
        });
    });

    ["@memebotfacepalm; line1; line 2",
     //"@memebot facepalm;    ",
     "@memebot    facepalm   line1"].forEach(input =>
    {
        it(`'${input}': should not match`, () => {
            // Act.
            const result = parser.parse(input)

            // Assert.
            assert.isNull(result);
        });
    });
});

