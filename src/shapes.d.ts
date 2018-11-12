/**
 * - A DOMString parsed as CSS <color> value.
 * - A CanvasGradient object (a linear or radial gradient).
 * - A CanvasPattern object (a repetitive image).
 */
export type ShapeStyle = string | CanvasGradient | CanvasPattern;

/** The supported baselines for text rendering. */
export type TextBaseline =
  | 'top'
  | 'bottom'
  | 'middle'
  | 'alphabetic'
  | 'hanging';

/** Defines the fill of a shape */
export interface Filled {
  /** The style to fill the shape with */
  fill: ShapeStyle;
}

/** Defines that a shape is stroked. */
export interface Stroked {
  /** The style of the stroke */
  stroke: ShapeStyle;
  /** The thickness of the stroke, in pixels */
  thickness: number;
}

/** Defines that the shape has an opacity. */
export interface Translucent {
  /** The opacity of the shape, 0.0 to 1.0, where 1.0 means 100% opaque. */
  opacity: number;
}

/** Defines that the shape is visible. Filled, stroked or both */
export type Visible = (Filled | Stroked) | (Filled & Stroked) | Translucent;

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
}

/** The specifications for how a rounded rectangle should be rendered. */
export interface RoundedRectSpec extends RectSpec {
  /** The border radius */
  radius: number;
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
  /** The baseline of the text */
  baseline: TextBaseline;
}

/** The specifications for how a polygon should be rendered. */
export interface PolySpec {
  /** A nested array consisting of `[ x, y ]`-coordinates. */
  points: [number, number][];
}

/** The specifications for how a SVG path should be rendered.  */
export interface PathSpec {
  /** The Path2D to draw to the context. */
  path: Path2D;
}

/** The specifications for how a circle should be rendered. */
export interface CircleSpec extends Offset {
  /** The radius of the circle. */
  radius: number;
}

/** The specification for any shape. */
export type AnyShapeSpec =
  | PathSpec
  | PolySpec
  | RectSpec
  | RoundedRectSpec
  | TextSpec
  | CircleSpec;

/** Constitutes a set of named commands and specifications. */
export interface ShapeLayer {
  [namedCommand: string]: AnyShapeSpec & Visible;
}

/** An easy-to-use shape drawing API for the HTML canvas. */
export interface ShapeApi {
  /**
   * Renders a SVG path using the provided specifications.
   * @param spec The specification of the path to draw.
   */
  path(spec: PathSpec & Visible): void;

  /**
   * Renders a polygon using the provided specifications.
   * @param spec The specification of the polygon to render.
   */
  poly(spec: PolySpec & Visible): void;

  /**
   * Renders a rectangle using the provided specifications.
   * @param spec The specification of the rectangle to render.
   */
  rect(spec: RectSpec & Visible): void;

  /**
   * Renders a rounded rectangle using the provided specifications.
   * @param spec The specification of the rounded rectangle to render.
   */
  roundedRect(spec: RoundedRectSpec & Visible): void;

  /**
   * Renders a circle using the provided specifications.
   * @param spec The specification of the circle to render.
   */
  circle(spec: CircleSpec & Visible): void;

  /**
   * Renders text using the provided specifications.
   * @param spec The specification of the text to render.
   */
  text(spec: TextSpec & Visible): void;

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
        fill: '#222',
        stroke: '#111',
        thickness: 1
      },
      'text contents': {
        x: 10, y: 15,
        value: 'Hi!',
        font: '10px Arial',
        fill: '#fff'
      }
    }
  ]);
    ```
   * @param layers A collection of layers to render.
   */
  layers(layers: ShapeLayer[]): void;

  /**
   * Sets the drawing origin to the specified point.
   * @param x The horizontal offset to set, in pixels.
   * @param y The vertical offset to set, in pixels.
   */
  setOrigin(x: number, y: number): void;

  /**
   * Offsets the drawing origin by the specified amount of pixels.
   * @param x Number of pixels to offset from the left.
   * @param y Number of pixels to offset from the top.
   */
  offset(x: number, y: number): void;

  /**
   * Prepends an offset to the provided `pathString` as defined by `x` and `y`,
   * and the global offset of the context, defined using `offset` and/or `setOrigin`.
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
