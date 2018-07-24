shapes is an easy-to-use shape drawing API for the HTML canvas.

- Simple: One shape = function call
- Super tiny: under 3 KB unminified & uncompressed
- No external dependencies
- TypeScript support ([definitions included](src/shapes.d.ts))

## Quick guide

```bash
npm i veridict/shapes.js --save
```

Shapes are drawn by calling different functions on the shape API. To create a new shape API use:

```js
const shape = shapes(canvas);
```

Then use it, easy as pie:

```js
shape.circle({
  radius: 100,
  x: 50,
  y: 50,
  style: '#009688'
});
```

If you need to offset the drawing origin (offset from top left), you can use:

```js
shape.offset(50, 50);
```

You can also draw _layers_:

```js
const shape = shapes(ctx);
const text = 'Layers are easy!';
const font = '14px sans-serif';
const pad = 14;
const width = shape.textWidth(text, font) + pad * 2;
const height = pad * 3;

shape.layers([
  // Contents (z-index 0)
  {
    'rect background': {
      x: 0,
      y: 0,
      width,
      height,
      style: '#000000DD'
    },
    'text contents': {
      x: pad,
      y: pad + pad / 2,
      value: text,
      style: '#fff'
    }
  },
  // Details (z-index 1)
  {
    'rect bottom border': {
      x: pad,
      y: pad * 2,
      width: width - pad * 2,
      height: 2,
      style: '#fff'
    }
  }
]);
```

Each layer contains a set of named commands, they describe:

- The draw-command, e.g. `rect`
- A descriptive name, e.g. `background` (optional)

_The name works like a discriminator between commands within a layer. As JavaScript-objects require unique property names, having two `rect` commands would not work._

Layers are useful for combining draw calls, as you can keep your layers and draw logic separated.

Check out the [basic example](examples/index.html).
