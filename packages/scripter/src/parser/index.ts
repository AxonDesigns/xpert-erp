import type { Token, TokenType } from "@scripter/tokenizer/types";
import { error } from "./errors";
import type {
  IfStatement,
  Program,
  ReturnStatement,
  Statement,
  VariableAssignment,
  VariableDeclaration,
} from "./types/statements";
import type {
  BinaryExpression,
  Identifier,
  NumericLiteral,
  UnaryExpression,
} from "./types/expressions";

class Parser {
  tokens: Token[];
  index = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
    this.index = 0;
  }

  eat(): Token {
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    const token = this.tokens[this.index]!;
    this.index++;
    return token;
  }

  expect(type: TokenType): Token {
    const token = this.eat();
    if (token.type !== type) {
      error(`Parser: Expected ${type} but got ${token.type}`);
    }
    return token;
  }

  at(): Token {
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    return this.tokens[this.index]!;
  }

  public parse() {
    const program = {
      type: "Program",
      body: [] as Statement[],
    } satisfies Program;

    while (this.index < this.tokens.length) {
      if (this.tokens[this.index]?.type === "EOF") {
        break;
      }
      // break if return statement
      if (this.at().type === "RETURN") {
        program.body.push(this.parseReturnStatement());
        break;
      }

      const statement = this.parseStatement();
      if (statement) {
        program.body.push(statement);
      }
    }

    return program;
  }

  parseStatement() {
    switch (this.at().type) {
      case "VAR": {
        return this.parseVariableDeclaration();
      }
      case "IF": {
        return this.parseIfStatement();
      }
      case "RETURN": {
        return this.parseReturnStatement();
      }
      default: {
        const expression = this.parseExpression();
        this.expect("SEMICOLON");
        return expression;
      }
    }
  }

  parseVariableDeclaration() {
    this.expect("VAR");
    const name = this.expect("IDENTIFIER");
    this.expect("ASSIGNMENT");

    const variableDeclaration = {
      type: "VariableDeclaration",
      name: name.value,
      value: this.parseExpression(),
    } satisfies VariableDeclaration;

    this.expect("SEMICOLON");

    return variableDeclaration;
  }

  parseIfStatement() {
    this.expect("IF");
    const condition = this.parseExpression();
    this.expect("OPEN_CURLY_BRACKET");
    const consequent = [] as Statement[];
    while (this.at().type !== "CLOSE_CURLY_BRACKET") {
      if (this.at().type === "RETURN") {
        consequent.push(this.parseReturnStatement());
        continue;
      }
      const statement = this.parseExpression();
      consequent.push(statement);
    }
    this.expect("CLOSE_CURLY_BRACKET");
    let alternative: Statement[] | undefined;
    if (this.at().type === "ELSE") {
      this.eat();

      alternative = [] as Statement[];
      if (this.at().type === "IF") {
        alternative.push(this.parseIfStatement());
      } else {
        this.expect("OPEN_CURLY_BRACKET");
        while (this.at().type !== "CLOSE_CURLY_BRACKET") {
          if (this.at().type === "RETURN") {
            alternative.push(this.parseReturnStatement());
            continue;
          }

          const statement = this.parseExpression();
          alternative.push(statement);
        }
        this.expect("CLOSE_CURLY_BRACKET");
      }
    }

    return {
      type: "IfStatement",
      condition: condition,
      consecuent: consequent,
      alternate: alternative,
    } satisfies IfStatement;
  }

  parseReturnStatement() {
    this.expect("RETURN");
    const value = this.parseExpression();
    this.expect("SEMICOLON");

    return {
      type: "ReturnStatement",
      value: value,
    } satisfies ReturnStatement;
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  parseExpression(): any {
    return this.parseLogicalExpression();
  }

  parseLogicalExpression() {
    let left = this.parseAdditiveExpression();
    while (
      this.at().type === "AND" ||
      this.at().type === "OR" ||
      this.at().type === "NOT" ||
      this.at().type === "EQUALS" ||
      this.at().type === "NOT_EQUALS" ||
      this.at().type === "GREATER" ||
      this.at().type === "GREATER_EQUALS" ||
      this.at().type === "LESS" ||
      this.at().type === "LESS_EQUALS"
    ) {
      const operator = this.eat();
      const right = this.parseAdditiveExpression();
      left = {
        type: "BinaryExpression",
        left: left,
        right: right,
        operator: operator,
      } satisfies BinaryExpression;
    }
    return left;
  }

  parseAdditiveExpression() {
    let left = this.parseMultiplicativeExpression();
    while (this.at().type === "PLUS" || this.at().type === "MINUS") {
      const operator = this.eat();
      const right = this.parseMultiplicativeExpression();
      left = {
        type: "BinaryExpression",
        left: left,
        right: right,
        operator: operator,
      } satisfies BinaryExpression;
    }
    return left;
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  parseUnaryExpression(): any {
    const token = this.at();

    if (
      token.type === "PLUS" ||
      token.type === "MINUS" ||
      token.type === "NOT"
    ) {
      const operator = this.eat();
      const argument = this.parseUnaryExpression(); // allow nested unary expressions
      return {
        type: "UnaryExpression",
        operator: operator,
        argument: argument,
      } satisfies UnaryExpression;
    }

    return this.parsePrimaryExpression();
  }

  parseMultiplicativeExpression() {
    let left = this.parseUnaryExpression();
    while (
      this.at().type === "MULTIPLY" ||
      this.at().type === "DIVIDE" ||
      this.at().type === "MODULO"
    ) {
      const operator = this.eat();
      const right = this.parseUnaryExpression();
      left = {
        type: "BinaryExpression",
        left: left,
        right: right,
        operator: operator,
      } satisfies BinaryExpression;
    }
    return left;
  }

  parsePrimaryExpression() {
    const type = this.at().type;

    switch (type) {
      case "IDENTIFIER": {
        const identifier = this.eat();

        if (this.at().type === "ASSIGNMENT") {
          this.eat();
          const value = this.parseExpression();
          return {
            type: "VariableAssignment",
            name: identifier.value,
            value: value,
          } satisfies VariableAssignment;
        }

        return {
          type: "Identifier",
          name: identifier.value,
        } satisfies Identifier;
      }
      case "NUMBER": {
        return {
          type: "NumericLiteral",
          value: Number.parseFloat(this.eat().value),
        } satisfies NumericLiteral;
      }
      case "OPEN_PARENTHESIS": {
        this.eat();
        const expression = this.parseExpression();
        this.expect("CLOSE_PARENTHESIS");
        return expression;
      }
      default: {
        error(`Parser: Unexpected token ${this.at().value}`);
      }
    }
  }
}

export default function parse(tokens: Token[]) {
  return new Parser(tokens).parse();
}
