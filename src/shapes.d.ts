/**
 * - A DOMString parsed as CSS <color> value.
 * - A CanvasGradient object (a linear or radial gradient).
 * - A CanvasPattern object (a repetitive image).
 */
export type ShapeStyle = string | CanvasGradient | CanvasPattern;

/** Defines that a shape is stroked. */
export interface Stroked {
  /** The thickness of the stroke, in pixels */
  thickness: number;
}

/** Defines the offset of a shape. */
export interface Offset {
  /** Number of pixels offset from the left */
  x: number;
  /** Number of pixels offset from the top */
  y: number;
}

/** The specifications for how a rectangle should be rendered. */
export interface RectSpec extends Offset {
  /** The width of the rectangle in pixels */
  width: number;
  /** The height of the rectangle in pixels */
  height: number;
  /** The style to apply to the rectangle */
  style: ShapeStyle;
}

/** The specifications for how a text string should be rendered. */
export interface TextSpec extends Offset {
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

/** The specifications for how a polygon should be rendered. */
export interface PolySpec {
  /** A nested array consisting of `[ x, y ]`-coordinates. */
  points: [number, number][];
  /** The style to draw the polygon in.  */
  style: ShapeStyle;
}

/** The specifications for how a SVG path should be rendered.  */
export interface PathSpec {
  /** The Path2D to draw to the context. */
  path: Path2D;
  /** The style to draw the path in. */
  style: ShapeStyle;
}

/** The specifications for how a circle should be rendered. */
export interface CircleSpec extends Offset {
  /** The radius of the circle. */
  radius: number;
}

/** The specification for any shape. */
export type AnyShapeSpec = PathSpec | PolySpec | RectSpec | TextSpec | CircleSpec;

/** Constitutes a set of named commands and specifications. */
export interface ShapeLayer {
  [namedCommand: string]: AnyShapeSpec | AnyShapeSpec & Stroked;
}

/** An easy-to-use shape drawing API for the HTML canvas. */
export interface ShapeApi {
  /**
   * Renders a SVG path using the provided specifications.
   * @param spec The specification of the path to draw.
   */
  path(spec: PathSpec | PathSpec & Stroked): void;

  /**
   * Renders a polygon using the provided specifications.
   * @param spec The specification of the polygon to render.
   */
  poly(spec: PolySpec | PolySpec & Stroked): void;

  /**
   * Renders a rectangle using the provided specifications.
   * @param spec The specification of the rectangle to render.
   */
  rect(spec: RectSpec | RectSpec & Stroked): void;
  
  /**
   * Renders a circle using the provided specifications.
   * @param spec The specification of the circle to render.
   */
  circle(spec: CircleSpec | CircleSpec & Stroked): void;
  
  /**
   * Renders text using the provided specifications.
   * @param spec The specification of the text to render.
   */
  text(spec: TextSpec): void;

  /**
   * Measures the width of the text in whole pixels, rounding up.
   * @param text The text to measure.
   * @param font The font to use when measuring.
   */
  textWidth(text: string, font: string): number;

  /**
   * Draws the specified layers to the context.
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
   * @param layers A collection of layers to render.
   */
  layers(layers: ShapeLayer[]): void;

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

/** Creates a new shape API.  */
declare function shapes(
  ctx: HTMLCanvasElement | CanvasRenderingContext2D
): ShapeApi;

export default shapes;
