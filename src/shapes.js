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

  const getStyleType = isStroked => (isStroked ? 'strokeStyle' : 'fillStyle');

  const setStyle = (style, thickness) => {
    set(getStyleType(thickness), style);
    thickness && set('lineWidth', thickness);
  };

  const getLayerCommand = name => {
    const end = name.indexOf(' ');

    return end !== -1 ? name.substr(0, end) : name;
  };

  class ShapesApi {
    path({ path, style, thickness }) {
      setStyle(style, thickness);

      if (thickness) {
        ctx.stroke(path);
      } else {
        ctx.fill(path);
      }
    }

    poly({ points, style, thickness }) {
      setStyle(style, thickness);

      drawPoly(points);

      if (thickness) {
        ctx.stroke();
      } else {
        ctx.fill();
      }
    }

    circle({ x, y, radius, style, thickness }) {
      setStyle(style, thickness);

      ctx.beginPath();
      ctx.arc(offsX + x, offsY + y, radius, 0, 2 * Math.PI);

      if (thickness) {
        ctx.stroke();
      } else {
        ctx.fill();
      }
    }

    text({ x, y, value, font, style, baseLine }) {
      set('font', font);
      set('fillStyle', style);
      baseLine && set('textBaseLine', baseLine);

      ctx.fillText(value, offsX + x, offsY + y);
    }

    rect({ x, y, width, height, style, thickness }) {
      setStyle(style, thickness);

      if (thickness) {
        ctx.strokeRect(offsX + x, offsY + y, width, height);
      } else {
        ctx.fillRect(offsX + x, offsY + y, width, height);
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
