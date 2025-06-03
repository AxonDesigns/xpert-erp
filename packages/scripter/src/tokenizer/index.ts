import { spec } from "./spec";
import type { specType, Token } from "./types";
//import type {specType, Token } from "./types";

/**
 * Convert a valid string into token for parsing
 * @param {string} content - String to be tokenized
 */
export default function tokenize(content: string): Token[] {
  const tokens: Token[] = [];
  let matched = false;
  let cursor = 0;
  while (cursor < content.length) {
    for (const [type, regexList] of Object.entries(spec)) {
      matched = false;
      const string = content.slice(cursor);
      for (const regex of regexList) {
        const match = regex.exec(string);
        if (match) {
          matched = true;
          cursor += match[0].length;
          if (
            type === "WHITESPACE"
            ||
            type === "COMMENT"
            ||
            type === "EOF"
          ) {
            continue;
          }
          tokens.push({
            type: type as specType,
            value: match[0]
          });
          break;
        }
      }
      if (matched) break;
    }

    if (!matched) {
      const char = content.slice(cursor, cursor + 1);
      throw new Error(`Unexpected token at ${JSON.stringify(char)}`);
    }
  }

  if (tokens[tokens.length - 1]?.type !== "EOF") {
    tokens.push({
      type: "EOF",
      value: "\n"
    });
  }

  return tokens;
} 