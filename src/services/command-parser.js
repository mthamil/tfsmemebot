const pattern = /^@memebot\s+\"(.+)\"\s+\"(.+)\"\s+\"(.+)\"$/i;

class CommandParser {
    parse(input) {
        const parsed  = pattern.exec(input);
        if (parsed) {
            return { 
                name: parsed[1],
                topText: parsed[2],
                bottomText: parsed[3] 
            };
        } else {
            return null;
        }
    }
}

export const parser = new CommandParser();