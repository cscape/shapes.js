function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var shapes = function shapes(target) {
  var ctx = target.tagName === 'CANVAS' ? target.getContext('2d') : target;

  var offsX = 0;
  var offsY = 0;

  var setCache = Object.create(null);

  var set = function set(prop, value) {
    return setCache[prop] !== value ? ctx[prop] = setCache[prop] = value : void 0;
  };

  var drawPoly = function drawPoly(points) {
    ctx.beginPath();
    ctx.moveTo(offsX + points[0][0], offsY + points[0][1]);

    for (var i = 1; i < points.length; i++) {
      ctx.lineTo(offsX + points[i][0], offsY + points[i][1]);
    }
  };

  var setStroke = function setStroke(style, thickness) {
    set('strokeStyle', style);
    set('lineWidth', thickness);
  };

  var setFill = function setFill(style) {
    return set('fillStyle', style);
  };

  var getLayerCommand = function getLayerCommand(name) {
    var end = name.indexOf(' ');

    return end !== -1 ? name.substr(0, end) : name;
  };

  var ShapesApi = function () {
    function ShapesApi() {
      _classCallCheck(this, ShapesApi);
    }

    ShapesApi.prototype.path = function path(_ref) {
      var _path = _ref.path,
          fill = _ref.fill,
          stroke = _ref.stroke,
          thickness = _ref.thickness,
          opacity = _ref.opacity;

      var alpha = ctx.globalAlpha;
      if (opacity) {
        ctx.globalAlpha = opacity;
      }

      if (fill) {
        setFill(fill);
        ctx.fill(_path);
      }

      if (stroke && thickness) {
        setStroke(stroke, thickness);
        ctx.stroke(_path);
      }

      ctx.globalAlpha = alpha;
    };

    ShapesApi.prototype.poly = function poly(_ref2) {
      var points = _ref2.points,
          fill = _ref2.fill,
          stroke = _ref2.stroke,
          thickness = _ref2.thickness,
          opacity = _ref2.opacity;

      var alpha = ctx.globalAlpha;
      if (opacity) {
        ctx.globalAlpha = opacity;
      }

      drawPoly(points);

      if (fill) {
        setFill(fill);
        ctx.fill();
      }

      if (stroke && thickness) {
        setStroke(stroke, thickness);
        ctx.stroke();
      }
      ctx.globalAlpha = alpha;
    };

    ShapesApi.prototype.circle = function circle(_ref3) {
      var x = _ref3.x,
          y = _ref3.y,
          radius = _ref3.radius,
          fill = _ref3.fill,
          stroke = _ref3.stroke,
          thickness = _ref3.thickness,
          opacity = _ref3.opacity;

      var alpha = ctx.globalAlpha;
      if (opacity) {
        ctx.globalAlpha = opacity;
      }

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
      ctx.globalAlpha = alpha;
    };

    ShapesApi.prototype.roundedRect = function roundedRect(_ref4) {
      var x = _ref4.x,
          y = _ref4.y,
          width = _ref4.width,
          height = _ref4.height,
          radius = _ref4.radius,
          fill = _ref4.fill,
          stroke = _ref4.stroke,
          thickness = _ref4.thickness,
          opacity = _ref4.opacity;

      var posX = offsX + x;
      var posY = offsY + y;
      var r = Math.min(radius, height, width);
      var alpha = ctx.globalAlpha;
      if (opacity) {
        ctx.globalAlpha = opacity;
      }

      ctx.beginPath();
      ctx.moveTo(posX + r, posY);
      ctx.lineTo(posX + width - r, posY);
      ctx.quadraticCurveTo(posX + width, posY, posX + width, posY + r);
      ctx.lineTo(posX + width, posY + height - r);
      ctx.quadraticCurveTo(posX + width, posY + height, posX + width - r, posY + height);
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
      ctx.globalAlpha = alpha;
    };

    ShapesApi.prototype.text = function text(_ref5) {
      var x = _ref5.x,
          y = _ref5.y,
          value = _ref5.value,
          font = _ref5.font,
          baseline = _ref5.baseline,
          fill = _ref5.fill,
          stroke = _ref5.stroke,
          thickness = _ref5.thickness,
          opacity = _ref5.opacity;

      var posX = offsX + x;
      var posY = offsY + y;
      var alpha = ctx.globalAlpha;
      if (opacity) {
        ctx.globalAlpha = opacity;
      }

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
      ctx.globalAlpha = alpha;
    };

    ShapesApi.prototype.rect = function rect(_ref6) {
      var x = _ref6.x,
          y = _ref6.y,
          width = _ref6.width,
          height = _ref6.height,
          fill = _ref6.fill,
          stroke = _ref6.stroke,
          thickness = _ref6.thickness,
          opacity = _ref6.opacity;

      var posX = offsX + x;
      var posY = offsY + y;

      var alpha = ctx.globalAlpha;
      if (opacity) {
        ctx.globalAlpha = opacity;
      }

      if (fill) {
        setFill(fill);
        ctx.fillRect(posX, posY, width, height);
      }

      if (stroke && thickness) {
        setStroke(stroke, thickness);
        ctx.strokeRect(posX, posY, width, height);
      }
      ctx.globalAlpha = alpha;
    };

    ShapesApi.prototype.textWidth = function textWidth(value, font) {
      set('font', font);

      return Math.ceil(ctx.measureText(value).width);
    };

    ShapesApi.prototype.layers = function layers(_layers) {
      var _this = this;

      _layers.filter(function (l) {
        return !!l;
      }).forEach(function (layer) {
        for (var name in layer) {
          _this[getLayerCommand(name)](layer[name]);
        }
      });
    };

    ShapesApi.prototype.setOrigin = function setOrigin(x, y) {
      offsX = Math.ceil(x);
      offsY = Math.ceil(y);
    };

    ShapesApi.prototype.offset = function offset(x, y) {
      offsX += Math.ceil(x);
      offsY += Math.ceil(y);
    };

    ShapesApi.prototype.offsetPath = function offsetPath(pathString, x, y) {
      return 'M' + (offsX + x || 0) + ' ' + (offsY + y || 0) + ' ' + pathString;
    };

    return ShapesApi;
  }();

  return new ShapesApi();
};

export default shapes;