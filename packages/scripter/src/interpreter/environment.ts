import { mkBoolean, mkNull } from "./macros";
import type { RuntimeValue } from "./runtime-values";

export class Environment {
  private parent: Environment | null;
  private variables: Map<string, RuntimeValue>;
  constructor(parent: Environment | null) {
    this.parent = parent;
    this.variables = new Map();
  }

  private resolve(name: string): Environment | undefined {
    if (this.variables.has(name)) {
      return this;
    }

    if (!this.parent) {
      return undefined;
    }

    return this.parent.resolve(name);
  }

  public set(name: string, value: RuntimeValue): RuntimeValue {
    const env = this.resolve(name);

    if (env) {
      env.variables.set(name, value);
    }

    this.variables.set(name, value);
    return value;
  }

  public get(name: string): RuntimeValue | undefined {
    const env = this.resolve(name);

    if (env) {
      return env.variables.get(name);
    }

    return this.variables.get(name);
  }
}

/**
 * Create an environment class with fundamental variable declarations
 */
export default function createEnvirontment() {
  const env = new Environment(null);

  env.set("null", mkNull());
  env.set("true", mkBoolean(true));
  env.set("false", mkBoolean(false));

  return env;
}
