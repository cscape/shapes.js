const shapes = target => {
  const ctx = target.tagName === 'CANVAS' ? target.getContext('2d') : target;

  let offsX = 0;
  let offsY = 0;

  const setCache = Object.create(null);

  const set = (prop, value) =>
    setCache[prop] !== value ? (ctx[prop] = setCache[prop] = value) : void 0;

  const drawPoly = points => {
    ctx.beginPath();
    ctx.moveTo(offsX + points[0][0], offsY + points[0][1]);

    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(offsX + points[i][0], offsY + points[i][1]);
    }
  };

  const setStroke = (style, thickness) => {
    set('strokeStyle', style);
    set('lineWidth', thickness);
  };

  const setFill = style => set('fillStyle', style);

  const getLayerCommand = name => {
    const end = name.indexOf(' ');

    return end !== -1 ? name.substr(0, end) : name;
  };

  class ShapesApi {
    path({ path, fill, stroke, thickness }) {
      if (fill) {
        setFill(fill);
        ctx.fill(path);
      }

      if (stroke && thickness) {
        setStroke(stroke, thickness);
        ctx.stroke(path);
      }
    }

    poly({ points, fill, stroke, thickness }) {
      drawPoly(points);

      if (fill) {
        setFill(fill);
        ctx.fill();
      }

      if (stroke && thickness) {
        setStroke(stroke, thickness);
        ctx.stroke();
      }
    }

    circle({ x, y, radius, fill, stroke, thickness }) {
      ctx.beginPath();
      ctx.arc(offsX + x, offsY + y, radius, 0, 2 * Math.PI);

      if (fill) {
        setFill(fill);
        ctx.fill();
      }

      if (stroke && thickness) {
        setStroke(stroke, thickness);
        ctx.stroke();
      }
    }

    roundedRect({ x, y, width, height, radius, fill, stroke, thickness }) {
      const posX = offsX + x;
      const posY = offsY + y;
      const r = Math.min(radius, height, width);

      ctx.beginPath();
      ctx.moveTo(posX + r, posY);
      ctx.lineTo(posX + width - r, posY);
      ctx.quadraticCurveTo(posX + width, posY, posX + width, posY + r);
      ctx.lineTo(posX + width, posY + height - r);
      ctx.quadraticCurveTo(
        posX + width,
        posY + height,
        posX + width - r,
        posY + height
      );
      ctx.lineTo(posX + r, posY + height);
      ctx.quadraticCurveTo(posX, posY + height, posX, posY + height - r);
      ctx.lineTo(posX, posY + r);
      ctx.quadraticCurveTo(posX, posY, posX + r, posY);
      ctx.closePath();

      if (fill) {
        setFill(fill);
        ctx.fill();
      }

      if (stroke && thickness) {
        setStroke(stroke, thickness);
        ctx.stroke();
      }
    }

    text({ x, y, value, font, baseline, fill, stroke, thickness }) {
      const posX = offsX + x;
      const posY = offsY + y;

      set('font', font);
      set('textBaseline', baseline);

      if (fill) {
        setFill(fill);
        ctx.fillText(value, posX, posY);
      }

      if (stroke && thickness) {
        setStroke(stroke, thickness);
        ctx.strokeText(value, posX, posY);
      }
    }

    rect({ x, y, width, height, fill, stroke, thickness }) {
      const posX = offsX + x;
      const posY = offsY + y;

      if (fill) {
        setFill(fill);
        ctx.fillRect(posX, posY, width, height);
      }

      if (stroke && thickness) {
        setStroke(stroke, thickness);
        ctx.strokeRect(posX, posY, width, height);
      }
    }

    textWidth(value, font) {
      set('font', font);

      return Math.ceil(ctx.measureText(value).width);
    }

    layers(layers) {
      layers.filter(l => !!l).forEach(layer => {
        for (const name in layer) {
          this[getLayerCommand(name)](layer[name]);
        }
      });
    }

    setOrigin(x, y) {
      offsX = Math.ceil(x);
      offsY = Math.ceil(y);
    }

    offset(x, y) {
      offsX += Math.ceil(x);
      offsY += Math.ceil(y);
    }

    offsetPath(pathString, x, y) {
      return `M${offsX + x || 0} ${offsY + y || 0} ` + pathString;
    }
  }

  return new ShapesApi();
};

export default shapes;
