/* Run me with node */

const shapes = require('./shapes');

const assert = (condition, message) =>
  !condition &&
  (() => {
    throw new Error(message);
  })();

const assertEqual = (expected, actual, message) =>
  assert(
    expected === actual,
    `Expected: '${expected}' Actual: '${actual} ${message}'`
  );

class MockCtx {
  constructor() {
    this.moves = [];
    this.lines = [];
  }

  set fillStyle(value) {
    this.style = value;
  }

  set strokeStyle(value) {
    this.style = value;
  }

  fill(path) {
    this.path = path;
  }

  stroke(path) {
    this.path = path;
  }

  fillRect(x, y, width, height) {
    this.rect = { x, y, width, height };
  }

  strokeRect(x, y, width, height) {
    this.rect = { x, y, width, height };
  }

  beginPath() {
    this.beganPath = true;
  }

  moveTo(x, y) {
    this.moves.push([x, y]);
  }

  lineTo(x, y) {
    this.lines.push([x, y]);
  }

  fillText(text, x, y) {
    this.text = { text, x, y };
  }

  measureText(text) {
    this.measuredText = text;

    return { width: text.length * 0.9397 };
  }
}

const Path2D = function(path) {
  this.def = path;
};

const triangleDef = 'M150,0l-75,200l150,0z';
const trianglePath = new Path2D(triangleDef);

/* Test parameters */
const x = 0;
const y = 1;
const width = 2;
const height = 3;
const thickness = 5;
const style = '#000';
const value = 'foo';
const font = 'bar';
const trianglePoly = [[75, 50], [100, 75], [100, 25]];

const tests = [
  (fillPath = ctx => {
    shapes(ctx).path({ path: trianglePath, style });

    assertEqual(trianglePath.def, ctx.path.def, 'paths do not match');
    assertEqual(style, ctx.style);
  }),
  (strokePath = ctx => {
    shapes(ctx).path({ path: trianglePath, style, thickness });

    assertEqual(trianglePath.def, ctx.path.def, 'paths do no match');
    assertEqual(style, ctx.style);
    assertEqual(thickness, ctx.lineWidth);
  }),
  (offsetPath = ctx => {
    const path = shapes(ctx).offsetPath(triangleDef, x, y);

    assert(
      path.indexOf(`M${x} ${y}`) === 0,
      'The path did not start with the expected offset'
    );
  }),
  (fillRect = ctx => {
    shapes(ctx).rect({ x, y, width, height, style });

    assertEqual(x, ctx.rect.x);
    assertEqual(y, ctx.rect.y);
    assertEqual(width, ctx.rect.width);
    assertEqual(height, ctx.rect.height);
    assertEqual(style, ctx.style);
  }),
  (strokeRect = ctx => {
    shapes(ctx).rect({ x, y, width, height, thickness, style });

    assertEqual(x, ctx.rect.x);
    assertEqual(y, ctx.rect.y);
    assertEqual(width, ctx.rect.width);
    assertEqual(height, ctx.rect.height);
    assertEqual(thickness, ctx.lineWidth);
    assertEqual(style, ctx.style);
  }),
  (fillPoly = ctx => {
    shapes(ctx).poly({ points: trianglePoly, style });

    assert(ctx.beganPath, 'Missing call to beginPath');
    assertEqual(style, ctx.style);

    assertEqual(
      JSON.stringify(trianglePoly),
      JSON.stringify([...ctx.moves, ...ctx.lines]),
      'The drawn polygon did not match the input polygon'
    );
  }),
  (strokePoly = ctx => {
    shapes(ctx).poly({ points: trianglePoly, style });

    assert(ctx.beganPath, 'Missing call to beginPath');
    assertEqual(style, ctx.style);

    assertEqual(
      JSON.stringify(trianglePoly),
      JSON.stringify([...ctx.moves, ...ctx.lines]),
      'The drawn polygon did not match the input polygon'
    );
  }),
  (text = ctx => {
    shapes(ctx).text({ x, y, value, font, style });

    assertEqual(font, ctx.font);
    assertEqual(x, ctx.text.x);
    assertEqual(y, ctx.text.y);
    assertEqual(value, ctx.text.text);
  }),
  (textWidth = ctx => {
    const len = shapes(ctx).textWidth(value, font);

    assertEqual(font, ctx.font);
    assertEqual(value, ctx.measuredText);
    assert(len % 1 === 0, 'The length of the text has not been rounded');
  }),
  (layers = ctx => {
    shapes(ctx).layers();
    shapes(ctx).layers([{ rect: {} }]);
  }),
  (supportsMultipleContexts = ctx => {
    const c1 = ctx;
    const c2 = new MockCtx();

    shapes(c1).path({ path: trianglePath, style });
    shapes(c2).text({ x, y, value, font, style });

    assertEqual(c1.path.def, trianglePath.def);
    assertEqual(value, c2.text.text);

    assertEqual(undefined, c1.text);
    assertEqual(undefined, c2.path);
  })
];

const runTests = startDate => {
  console.log('Test run started ' + startDate.toISOString());
  console.log(tests.length + ' tests found, running:');
  console.log();

  tests.forEach(test => {
    test(new MockCtx());

    console.log(` PASS ${test.name}`);
  });

  const endDate = new Date();

  console.log();
  console.log(`Test run completed ${startDate.toISOString()}`);
  console.log(`- Duration: ${endDate - startDate} milliseconds`);
};

runTests(new Date());
