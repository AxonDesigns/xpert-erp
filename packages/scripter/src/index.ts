import { evaluate } from "./interpreter";
import createEnvirontment from "./interpreter/environment";
import parse from "./parser";
import tokenize from "./tokenizer";

const content = `
var x = 1;
var y = 3;

//return x < y;

if x < y {
    return x - y;
}

return x + y + 2;
`;

const tokens = tokenize(content);
//console.log(tokens);
const ast = parse(tokens);
//console.log(JSON.stringify(ast, null, 2));
const env = createEnvirontment();
const result = evaluate(ast, env);
console.log(result);
