import type { spec } from "./spec";

const tokenTypes = [
  "EOF",
  "WHITESPACE",
  "COMMENT",
  "NUMBER",
  "IDENTIFIER",

  "OPEN_BRACKET",
  "CLOSE_BRACKET",
  "OPEN_CURLY_BRACKET",
  "CLOSE_CURLY_BRACKET",
  "OPEN_PARENTHESIS",
  "CLOSE_PARENTHESIS",

  "VAR",

  "ASSIGNMENT",
  "EQUALS",
  "NOT",
  "NOT_EQUALS",

  "GREATER",
  "GREATER_EQUALS",
  "LESS",
  "LESS_EQUALS",

  "OR",
  "AND",

  "COLON",
  "SEMICOLON",
  "COMMA",

  "PLUS_PLUS",
  "MINUS_MINUS",
  "PLUS_EQUALS",
  "MINUS_EQUALS",

  "PLUS",
  "MINUS",
  "MULTIPLY",
  "DIVIDE",
  "MODULO",

  "IF",
  "ELSE",
  "RETURN",
] as const;

export type TokenType = (typeof tokenTypes)[number];

export type SpecType = keyof typeof spec;
export type Token = {
  type: SpecType;
  value: string;
};
