/**
 * - A DOMString parsed as CSS <color> value.
 * - A CanvasGradient object (a linear or radial gradient).
 * - A CanvasPattern object (a repetitive image).
 */
export type ShapeStyle = string | CanvasGradient | CanvasPattern;

/** The object is stroked. */
export interface Stroked {
  /** The thickness of the stroke, in pixels */
  thickness: number;
}

/** The object is offset. */
export interface Offset {
  /** Number of pixels offset from the left */
  x: number;
  /** Number of pixels offset from the top */
  y: number;
}

/** Defines the properties of a drawable rectangle. */
export interface RectDef extends Offset {
  /** The width of the rectangle in pixels */
  width: number;
  /** The height of the rectangle in pixels */
  height: number;
  /** The style to apply to the rectangle */
  style: ShapeStyle;
}

/** Describes the properties of drawable text. */
export interface TextDef extends Offset {
  /** The text to render */
  value: string;
  /**
   * A DOMString parsed as CSS font value.
   * The default font is 10px sans-serif.
   */
  font: string;
  /** The style to render the text in */
  style: ShapeStyle;
}

/** Defines the properties of a drawable polygon. */
export interface PolyDef {
  /** A nested array consisting of `[ x, y ]`-coordinates. */
  points: number[];
  /** The style to draw the polygon in.  */
  style: ShapeStyle;
}

/** Describes the properties of a drawable path.  */
export interface PathDef {
  /** The Path2D to draw to the context. */
  path: Path2D;
  /** The style to draw the path in. */
  style: ShapeStyle;
}

/** Describes the properties of a circle. */
export interface CircleDef extends Offset {
  /** The radius of the circle. */
  radius: number;
}

/** Defines the definition of any shape. */
export type ShapeDef = PathDef | PolyDef | RectDef | CircleDef;

/** A layer constitutes a group of commands. */
export interface ShapeLayer {
  [namedCommand: string]: ShapeDef | ShapeDef & Stroked;
}

/** A friendly API for drawing shapes to a 2D-context */
export interface ShapeApi {
  /**
   * Draws a SVG path to the context.
   * @param path The definition of the path to draw.
   */
  path(path: PathDef | PathDef & Stroked): void;

  /**
   * Draws a polygon to the context.
   * @param poly The definition of the polygon to draw.
   */
  poly(poly: PolyDef | PolyDef & Stroked): void;

  /**
   * Draws a rectangle to the context.
   * @param def The definition of the rectangle to draw.
   */
  rect(def: RectDef & Stroked): void;

  /**
   * Writes the provided text to the context.
   * @param def The definition of the text to draw.
   */
  text(def: TextDef): void;

  /**
   * Measures the width of the text in whole pixels, rounding up.
   * @param text The text to measure.
   * @param font The font to use when measuring.
   */
  textWidth(text: string, font: string): void;

  /**
   * Draws the provided layers to the context.
   * 
   * **Usage:**
    ```
    shape.layers([
      {
        'rect background': {
          x: 0, y: 10,
          width: 10px,
          height: 20px
          style: '#222'
        },
        'rect background-border': {
          x: 0, y: 10,
          width: 10px,
          height: 20px
          style: '#fff',
          thickness: 2
        },
        'text contents': {
          x: 10, y: 15,
          value: 'Hi!',
          font: '10px Arial',
          style: '#fff'
        }
      }
    ]);
    ```
   * @param layers The layers to draw
   */
  layers(layers: ShapeLayer[]);

  /**
   * Prepends an offset to the provided `pathString`,
   * as defined by `x` and `y`.
   *
   * **Note:** In order for the path to be properly offset,
   * **all commands in the path must be relative.**
   * @param pathString An all-relative path string
   * @param x Number of pixels offset from the left.
   * @param y Number of pixels offset from the top.
   */
  offsetPath(pathString: string, x?: number, y?: number): string;
}

/** Provides a friendly API for drawing to a 2D-context */
declare function shapes(ctx: CanvasRenderingContext2D): ShapeApi;

export default shapes;
