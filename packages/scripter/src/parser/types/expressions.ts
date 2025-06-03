import type { Token } from "@scripter/tokenizer/types";
import type { Statement } from "./statements";

export interface Expression extends Statement {
}

export interface NumericLiteral extends Expression {
    type: "NumericLiteral";
    value: number;
}

export interface BooleanLiteral extends Expression {
    type: "BooleanLiteral";
    value: boolean;
}


export interface Identifier extends Expression {
    type: "Identifier";
    name: string;
}

export interface UnaryExpression extends Expression {
    type: "UnaryExpression";
    operator: Token;
    argument: Expression;
}

export interface BinaryExpression extends Expression {
    type: "BinaryExpression";
    left: Expression;
    right: Expression;
    operator: Token;
}