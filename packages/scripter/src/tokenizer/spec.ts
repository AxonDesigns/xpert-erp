import type { TokenType } from "./types";

export const spec: Record<TokenType, RegExp[]> = {
  EOF: [
    /^\s*$/
  ],
  WHITESPACE: [
    /^\s+/
  ],
  COMMENT: [
    /^\/\/.*/,
    /^\/\*[\s\S]*?\*\//,
  ],
  NUMBER: [
    /^(\d*\.\d+|\d+)/,
    /^(\d+)/
  ],
  OPEN_BRACKET: [
    /^\[/
  ],
  CLOSE_BRACKET: [
    /^\]/
  ],
  OPEN_CURLY_BRACKET: [
    /^\{/
  ],
  CLOSE_CURLY_BRACKET: [
    /^\}/
  ],
  OPEN_PARENTHESIS: [
    /^\(/
  ],
  CLOSE_PARENTHESIS: [
    /^\)/
  ],
  EQUALS: [
    /^==/
  ],
  NOT_EQUALS: [
    /^!=/
  ],
  NOT: [
    /^!/
  ],
  GREATER_EQUALS: [
    /^>=/
  ],
  GREATER: [
    /^>/
  ],
  LESS_EQUALS: [
    /^<=/
  ],
  LESS: [
    /^</
  ],
  OR: [
    /^\|\|/
  ],
  AND: [
    /^&&/
  ],
  COLON: [
    /^:/
  ],
  SEMICOLON: [
    /^;/
  ],
  COMMA: [
    /^,/
  ],
  PLUS_PLUS: [
    /^\+\+/
  ],
  MINUS_MINUS: [
    /^--/
  ],
  PLUS_EQUALS: [
    /^\+=/
  ],
  MINUS_EQUALS: [
    /^\-=/
  ],
  PLUS: [
    /^\+/
  ],
  MINUS: [
    /^\-/
  ],
  MULTIPLY: [
    /^\*/
  ],
  DIVIDE: [
    /^\//
  ],
  ASSIGNMENT: [
    /^=/
  ],
  MODULO: [
    /^%/
  ],
  VAR: [
    /^\bvar\b/
  ],
  IF: [
    /^\bif\b/
  ],
  ELSE: [
    /^\belse\b/
  ],
  RETURN: [
    /^\breturn\b/
  ],
  IDENTIFIER: [
    /^([a-zA-Z_][a-zA-Z0-9_]*)/
  ],
}