// measureText.js
// Sizing for the Text node.
// --------------------------------------------------

// The canvas and the <textarea> must render with the *same* font or the
// measurement is meaningless, so this constant is the single source of truth:
// it is fed to ctx.font here and set inline on the textarea in TextNodeBody.
export const TEXT_FONT = '12px ui-monospace, SFMono-Regular, Menlo, monospace';

export const TEXT_NODE_MIN_WIDTH = 220;
export const TEXT_NODE_MAX_WIDTH = 460;

// Card padding + textarea padding + borders + room for the caret.
const CHROME_WIDTH = 42;

let context;

// Canvas measurement instead of a hidden mirror <div>: it needs no DOM node, no
// layout pass, and can be called from a pure function during render.
const measureLine = (line) => {
  if (!context) {
    context = document.createElement('canvas').getContext('2d');
  }
  context.font = TEXT_FONT;
  return context.measureText(line).width;
};

// How wide the Text node wants to be for its current content. Past the max the
// textarea soft-wraps instead, and the node grows downward rather than sideways.
export const textNodeWidth = (text) => {
  const widest = String(text ?? '')
    .split('\n')
    .reduce((max, line) => Math.max(max, measureLine(line)), 0);

  return Math.round(
    Math.min(TEXT_NODE_MAX_WIDTH, Math.max(TEXT_NODE_MIN_WIDTH, widest + CHROME_WIDTH))
  );
};
