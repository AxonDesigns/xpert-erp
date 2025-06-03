import type { Environment } from "./environment";
import type {
  BinaryExpression,
  Identifier,
  NumericLiteral,
  UnaryExpression,
} from "@scripter/parser/types/expressions";
import type {
  IfStatement,
  Program,
  ReturnStatement,
  Statement,
  VariableAssignment,
  VariableDeclaration,
} from "@scripter/parser/types/statements";
import { mkBoolean, mkNull, mkNumber, mkVoid } from "./macros";
import type {
  BooleanValue,
  NumericValue,
  ReturnValue,
  RuntimeValue,
  VoidValue,
} from "./runtime-values";
import type { Token } from "@scripter/tokenizer/types";
import { error, warning } from "./errors";

function evaluateProgram(program: Program, env: Environment): RuntimeValue {
  let lastValue: RuntimeValue = mkNull();

  for (const statement of program.body) {
    lastValue = _evaluate(statement, env);
    if (lastValue.type === "return") {
      break;
    }
  }

  return lastValue;
}

function evaluateNumericExpression(
  left: NumericValue,
  right: NumericValue,
  operator: Token,
): NumericValue | BooleanValue {
  let number: number | undefined;
  let boolean: boolean | undefined;
  switch (operator.type) {
    case "PLUS":
      number = left.value + right.value;
      break;
    case "MINUS":
      number = left.value - right.value;
      break;
    case "MULTIPLY":
      number = left.value * right.value;
      break;
    case "DIVIDE":
      number = left.value / right.value;
      break;
    case "MODULO":
      number = left.value % right.value;
      break;
    case "GREATER":
      boolean = left.value > right.value;
      break;
    case "GREATER_EQUALS":
      boolean = left.value >= right.value;
      break;
    case "LESS":
      boolean = left.value < right.value;
      break;
    case "LESS_EQUALS":
      boolean = left.value <= right.value;
      break;
    case "EQUALS":
      boolean = left.value === right.value;
      break;
    case "NOT_EQUALS":
      boolean = left.value !== right.value;
      break;
    default:
      break;
  }

  if (boolean !== undefined) {
    return mkBoolean(boolean);
  }

  if (number !== undefined) {
    return mkNumber(number);
  }

  error(
    `This numeric expression is not implemented: ${left.value} ${operator.value} ${right.value}`,
  );
}

function evaluateBooleanExpression(
  left: BooleanValue,
  right: BooleanValue,
  operator: Token,
): BooleanValue {
  let boolean: boolean | undefined;
  switch (operator.type) {
    case "AND":
      boolean = left.value && right.value;
      break;
    case "OR":
      boolean = left.value || right.value;
      break;
    case "NOT":
      boolean = !left.value;
      break;
    case "EQUALS":
      boolean = left.value === right.value;
      break;
    case "NOT_EQUALS":
      boolean = left.value !== right.value;
      break;
    default:
      break;
  }

  if (boolean !== undefined) {
    return mkBoolean(boolean);
  }

  warning(
    `This boolean expression is not implemented: ${left.value} ${operator.value} ${right.value}`,
  );
  return mkBoolean(false);
}

function evaluateBinaryExpression(
  binaryOp: BinaryExpression,
  env: Environment,
): RuntimeValue {
  const left = _evaluate(binaryOp.left, env);
  const right = _evaluate(binaryOp.right, env);

  if (left.type === "number" && right.type === "number") {
    return evaluateNumericExpression(
      left as NumericValue,
      right as NumericValue,
      binaryOp.operator,
    );
  }

  if (left.type === "boolean" && right.type === "boolean") {
    return evaluateBooleanExpression(
      left as BooleanValue,
      right as BooleanValue,
      binaryOp.operator,
    );
  }

  error(
    `This binary expression is not implemented: ${left.value} ${binaryOp.operator.value} ${right.value}`,
  );
}

function evaluateIdentifier(Identifier: Identifier, env: Environment) {
  const value = env.get(Identifier.name);
  if (value === undefined) {
    error(`Undefined variable ${Identifier.name}`);
  }
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  return env.get(Identifier.name)!;
}

function evaluateVariableDeclaration(
  variableDeclaration: VariableDeclaration,
  env: Environment,
): RuntimeValue {
  if (env.get(variableDeclaration.name) !== undefined) {
    error(`Variable ${variableDeclaration.name} already declared`);
  }

  const value = _evaluate(variableDeclaration.value, env) ?? mkNull();

  return env.set(variableDeclaration.name, value);
}

function evaluateVariableAssignment(
  variableAssignment: VariableAssignment,
  env: Environment,
): RuntimeValue {
  if (env.get(variableAssignment.name) === undefined) {
    error(`Undefined variable ${variableAssignment.name}`);
  }

  return env.set(
    variableAssignment.name,
    _evaluate(variableAssignment.value, env),
  );
}

function evaluateIfStatement(
  ifStatement: IfStatement,
  env: Environment,
): RuntimeValue {
  const condition = _evaluate(ifStatement.condition, env);
  if (condition.type !== "boolean") {
    error(`Expected boolean, got ${condition.type} instead`);
  }

  if (condition.value) {
    let lastValue = mkNull() as RuntimeValue;
    for (const statement of ifStatement.consecuent) {
      lastValue = _evaluate(statement, env);
      if (lastValue.type === "return") {
        return lastValue;
      }
    }
    return lastValue;
  }

  if (ifStatement.alternate) {
    let lastValue = mkNull() as RuntimeValue;
    for (const statement of ifStatement.alternate) {
      lastValue = _evaluate(statement, env);
      if (lastValue.type === "return") {
        return lastValue;
      }
    }
    return lastValue;
  }

  return mkNull();
}

function evaluateReturnStatement(
  returnStatement: ReturnStatement,
  env: Environment,
): ReturnValue {
  const result = _evaluate(returnStatement.value, env);
  return {
    type: "return",
    value: result,
  };
}

function evaluateUnaryExpression(
  unaryExpression: UnaryExpression,
  env: Environment,
): RuntimeValue {
  const argument = _evaluate(unaryExpression.argument, env);
  if (argument.type !== "number") {
    error(
      `Unary operator can only be applied to numbers, got ${argument.type} instead`,
    );
  }

  switch (unaryExpression.operator.type) {
    case "PLUS":
      return argument;
    case "MINUS":
      return mkNumber(-(argument.value as number));
    default:
      error(
        `This unary operator is not implemented: ${unaryExpression.operator.value}`,
      );
  }
}

/**
 * Evaluates an AST
 */
const _evaluate = (ast: Statement, env: Environment) => {
  switch (ast.type) {
    case "NumericLiteral":
      return mkNumber((ast as NumericLiteral).value);
    case "Identifier":
      return evaluateIdentifier(ast as Identifier, env);
    case "BinaryExpression":
      return evaluateBinaryExpression(ast as BinaryExpression, env);
    case "UnaryExpression":
      return evaluateUnaryExpression(ast as UnaryExpression, env);
    case "Program":
      return evaluateProgram(ast as Program, env);
    case "VariableDeclaration":
      return evaluateVariableDeclaration(ast as VariableDeclaration, env);
    case "VariableAssignment":
      return evaluateVariableAssignment(ast as VariableAssignment, env);
    case "IfStatement":
      return evaluateIfStatement(ast as IfStatement, env);
    case "ReturnStatement":
      return evaluateReturnStatement(ast as ReturnStatement, env);
    default:
      error("This ATS is not implemented");
  }
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function evaluate(ast: Statement, env: Environment): any {
  const result = _evaluate(ast, env);

  if (result.type === "return") {
    return (result as ReturnValue).value.value;
  }

  return mkVoid();
}
