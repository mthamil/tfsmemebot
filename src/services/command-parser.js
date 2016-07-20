class CommandParser {
    parse(input) {

        const prefixIndex = input.indexOf("@memebot ");
        if (prefixIndex > -1) {
            input = input.substr(prefixIndex + 8);
            const tokens = input.trim().split(";");
            const result = { name: "", topText: "", bottomText: "" };

            if (tokens.length > 0 && tokens[0].trim() !== "") {
                result.name = tokens[0].trim();

                if (tokens.length > 1) {
                    result.topText = tokens[1].trim();

                    if (tokens.length > 2) {
                        result.bottomText = tokens[2].trim();
                    }
                }

                return result;
            }
        }

        return null;
    }
}

export const parser = new CommandParser();