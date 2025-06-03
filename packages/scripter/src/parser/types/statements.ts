import type { Expression } from "./expressions";

export type NodeType =
  | "Program"
  | "NumericLiteral"
  | "BooleanLiteral"
  | "Identifier"
  | "BinaryExpression"
  | "UnaryExpression"
  | "IfStatement"
  | "VariableDeclaration"
  | "VariableAssignment"
  | "ReturnStatement";

export type Statement = {
  type: NodeType;
};

export interface Program extends Statement {
  type: "Program";
  body: Statement[];
}

export interface VariableDeclaration extends Statement {
  type: "VariableDeclaration";
  name: string;
  value: Expression;
}

export interface VariableAssignment extends Statement {
  type: "VariableAssignment";
  name: string;
  value: Expression;
}

export interface IfStatement extends Statement {
  type: "IfStatement";
  condition: Expression;
  consecuent: Statement[];
  alternate?: Statement[];
}

export interface ReturnStatement extends Statement {
  type: "ReturnStatement";
  value: Expression;
}
