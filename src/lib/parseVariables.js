// parseVariables.js
// Extracts {{ variable }} names from Text node content.
// --------------------------------------------------

// A valid JS identifier: starts with a letter, _ or $; digits allowed after.
// Surrounding whitespace inside the braces is tolerated, so "{{ input }}"
// and "{{input}}" name the same variable.
const VARIABLE_PATTERN = /\{\{\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*\}\}/g;

// The pattern above matches the *shape* of an identifier, but a reserved word
// is not a legal variable name — `const if = 1` is a syntax error — so
// "{{ if }}" must not produce a handle.
const RESERVED_WORDS = new Set([
  'await', 'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger',
  'default', 'delete', 'do', 'else', 'enum', 'export', 'extends', 'false',
  'finally', 'for', 'function', 'if', 'implements', 'import', 'in',
  'instanceof', 'interface', 'let', 'new', 'null', 'package', 'private',
  'protected', 'public', 'return', 'static', 'super', 'switch', 'this',
  'throw', 'true', 'try', 'typeof', 'var', 'void', 'while', 'with', 'yield',
]);

export const isValidVariableName = (name) =>
  !RESERVED_WORDS.has(name) && /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name);

// Returns unique variable names in the order they first appear, so handles
// keep a stable position while the user keeps typing.
export const parseVariables = (text) => {
  const names = [];

  for (const [, name] of String(text ?? '').matchAll(VARIABLE_PATTERN)) {
    if (isValidVariableName(name) && !names.includes(name)) {
      names.push(name);
    }
  }

  return names;
};
