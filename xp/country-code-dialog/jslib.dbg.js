// Copyright 2006 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


// Known Issues:
//
// * Patterns are not implemented.
// * Radial gradient are not implemented. The VML version of these look very
//   different from the canvas one.
// * Clipping paths are not implemented.
// * Coordsize. The width and height attribute have higher priority than the
//   width and height style values which isn't correct.
// * Painting mode isn't implemented.
// * Canvas width/height should is using content-box by default. IE in
//   Quirks mode will draw the canvas using border-box. Either change your
//   doctype to HTML5
//   (http://www.whatwg.org/specs/web-apps/current-work/#the-doctype)
//   or use Box Sizing Behavior from WebFX
//   (http://webfx.eae.net/dhtml/boxsizing/boxsizing.html)
// * Optimize. There is always room for speed improvements.

// only add this code if we do not already have a canvas implementation
if (!window.CanvasRenderingContext2D) {

(function () {

  // alias some functions to make (compiled) code shorter
  var m = Math;
  var mr = m.round;
  var ms = m.sin;
  var mc = m.cos;

  // this is used for sub pixel precision
  var Z = 10;
  var Z2 = Z / 2;

  var G_vmlCanvasManager_ = {
    init: function (opt_doc) {
      var doc = opt_doc || document;
      if (/MSIE/.test(navigator.userAgent) && !window.opera) {
        var self = this;
        doc.attachEvent("onreadystatechange", function () {
          self.init_(doc);
        });
      }
    },

    init_: function (doc) {
      if (doc.readyState == "complete") {
        // create xmlns
        if (!doc.namespaces["g_vml_"]) {
          doc.namespaces.add("g_vml_", "urn:schemas-microsoft-com:vml");
        }

        // setup default css
        var ss = doc.createStyleSheet();
        ss.cssText = "canvas{display:inline-block;overflow:hidden;" +
            // default size is 300x150 in Gecko and Opera
            "text-align:left;width:300px;height:150px}" +
            "g_vml_\\:*{behavior:url(#default#VML)}";

        // find all canvas elements
        var els = doc.getElementsByTagName("canvas");
        for (var i = 0; i < els.length; i++) {
          if (!els[i].getContext) {
            this.initElement(els[i]);
          }
        }
      }
    },

    fixElement_: function (el) {
      // in IE before version 5.5 we would need to add HTML: to the tag name
      // but we do not care about IE before version 6
      var outerHTML = el.outerHTML;

      var newEl = el.ownerDocument.createElement(outerHTML);
      // if the tag is still open IE has created the children as siblings and
      // it has also created a tag with the name "/FOO"
      if (outerHTML.slice(-2) != "/>") {
        var tagName = "/" + el.tagName;
        var ns;
        // remove content
        while ((ns = el.nextSibling) && ns.tagName != tagName) {
          ns.removeNode();
        }
        // remove the incorrect closing tag
        if (ns) {
          ns.removeNode();
        }
      }
      el.parentNode.replaceChild(newEl, el);
      return newEl;
    },

    /**
     * Public initializes a canvas element so that it can be used as canvas
     * element from now on. This is called automatically before the page is
     * loaded but if you are creating elements using createElement you need to
     * make sure this is called on the element.
     * @param {HTMLElement} el The canvas element to initialize.
     * @return {HTMLElement} the element that was created.
     */
    initElement: function (el) {
      el = this.fixElement_(el);
      el.getContext = function () {
        if (this.context_) {
          return this.context_;
        }
        return this.context_ = new CanvasRenderingContext2D_(this);
      };

      // do not use inline function because that will leak memory
      el.attachEvent('onpropertychange', onPropertyChange);
      el.attachEvent('onresize', onResize);

      var attrs = el.attributes;
      if (attrs.width && attrs.width.specified) {
        // TODO: use runtimeStyle and coordsize
        // el.getContext().setWidth_(attrs.width.nodeValue);
        el.style.width = attrs.width.nodeValue + "px";
      } else {
        el.width = el.clientWidth;
      }
      if (attrs.height && attrs.height.specified) {
        // TODO: use runtimeStyle and coordsize
        // el.getContext().setHeight_(attrs.height.nodeValue);
        el.style.height = attrs.height.nodeValue + "px";
      } else {
        el.height = el.clientHeight;
      }
      //el.getContext().setCoordsize_()
      return el;
    }
  };

  function onPropertyChange(e) {
    var el = e.srcElement;

    switch (e.propertyName) {
      case 'width':
        el.style.width = el.attributes.width.nodeValue + "px";
        el.getContext().clearRect();
        break;
      case 'height':
        el.style.height = el.attributes.height.nodeValue + "px";
        el.getContext().clearRect();
        break;
    }
  }

  function onResize(e) {
    var el = e.srcElement;
    if (el.firstChild) {
      el.firstChild.style.width =  el.clientWidth + 'px';
      el.firstChild.style.height = el.clientHeight + 'px';
    }
  }

  G_vmlCanvasManager_.init();

  // precompute "00" to "FF"
  var dec2hex = [];
  for (var i = 0; i < 16; i++) {
    for (var j = 0; j < 16; j++) {
      dec2hex[i * 16 + j] = i.toString(16) + j.toString(16);
    }
  }

  function createMatrixIdentity() {
    return [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1]
    ];
  }

  function matrixMultiply(m1, m2) {
    var result = createMatrixIdentity();

    for (var x = 0; x < 3; x++) {
      for (var y = 0; y < 3; y++) {
        var sum = 0;

        for (var z = 0; z < 3; z++) {
          sum += m1[x][z] * m2[z][y];
        }

        result[x][y] = sum;
      }
    }
    return result;
  }

  function copyState(o1, o2) {
    o2.fillStyle     = o1.fillStyle;
    o2.lineCap       = o1.lineCap;
    o2.lineJoin      = o1.lineJoin;
    o2.lineWidth     = o1.lineWidth;
    o2.miterLimit    = o1.miterLimit;
    o2.shadowBlur    = o1.shadowBlur;
    o2.shadowColor   = o1.shadowColor;
    o2.shadowOffsetX = o1.shadowOffsetX;
    o2.shadowOffsetY = o1.shadowOffsetY;
    o2.strokeStyle   = o1.strokeStyle;
    o2.arcScaleX_    = o1.arcScaleX_;
    o2.arcScaleY_    = o1.arcScaleY_;
  }

  function processStyle(styleString) {
    var str, alpha = 1;

    styleString = String(styleString);
    if (styleString.substring(0, 3) == "rgb") {
      var start = styleString.indexOf("(", 3);
      var end = styleString.indexOf(")", start + 1);
      var guts = styleString.substring(start + 1, end).split(",");

      str = "#";
      for (var i = 0; i < 3; i++) {
        str += dec2hex[Number(guts[i])];
      }

      if ((guts.length == 4) && (styleString.substr(3, 1) == "a")) {
        alpha = guts[3];
      }
    } else {
      str = styleString;
    }

    return [str, alpha];
  }

  function processLineCap(lineCap) {
    switch (lineCap) {
      case "butt":
        return "flat";
      case "round":
        return "round";
      case "square":
      default:
        return "square";
    }
  }

  /**
   * This class implements CanvasRenderingContext2D interface as described by
   * the WHATWG.
   * @param {HTMLElement} surfaceElement The element that the 2D context should
   * be associated with
   */
   function CanvasRenderingContext2D_(surfaceElement) {
    this.m_ = createMatrixIdentity();

    this.mStack_ = [];
    this.aStack_ = [];
    this.currentPath_ = [];

    // Canvas context properties
    this.strokeStyle = "#000";
    this.fillStyle = "#000";

    this.lineWidth = 1;
    this.lineJoin = "miter";
    this.lineCap = "butt";
    this.miterLimit = Z * 1;
    this.globalAlpha = 1;
    this.canvas = surfaceElement;

    var el = surfaceElement.ownerDocument.createElement('div');
    el.style.width =  surfaceElement.clientWidth + 'px';
    el.style.height = surfaceElement.clientHeight + 'px';
    el.style.overflow = 'hidden';
    el.style.position = 'absolute';
    surfaceElement.appendChild(el);

    this.element_ = el;
    this.arcScaleX_ = 1;
    this.arcScaleY_ = 1;
  };

  var contextPrototype = CanvasRenderingContext2D_.prototype;
  contextPrototype.clearRect = function() {
    this.element_.innerHTML = "";
    this.currentPath_ = [];
  };

  contextPrototype.beginPath = function() {
    // TODO: Branch current matrix so that save/restore has no effect
    //       as per safari docs.

    this.currentPath_ = [];
  };

  contextPrototype.moveTo = function(aX, aY) {
    this.currentPath_.push({type: "moveTo", x: aX, y: aY});
    this.currentX_ = aX;
    this.currentY_ = aY;
  };

  contextPrototype.lineTo = function(aX, aY) {
    this.currentPath_.push({type: "lineTo", x: aX, y: aY});
    this.currentX_ = aX;
    this.currentY_ = aY;
  };

  contextPrototype.bezierCurveTo = function(aCP1x, aCP1y,
                                            aCP2x, aCP2y,
                                            aX, aY) {
    this.currentPath_.push({type: "bezierCurveTo",
                           cp1x: aCP1x,
                           cp1y: aCP1y,
                           cp2x: aCP2x,
                           cp2y: aCP2y,
                           x: aX,
                           y: aY});
    this.currentX_ = aX;
    this.currentY_ = aY;
  };

  contextPrototype.quadraticCurveTo = function(aCPx, aCPy, aX, aY) {
    // the following is lifted almost directly from
    // http://developer.mozilla.org/en/docs/Canvas_tutorial:Drawing_shapes
    var cp1x = this.currentX_ + 2.0 / 3.0 * (aCPx - this.currentX_);
    var cp1y = this.currentY_ + 2.0 / 3.0 * (aCPy - this.currentY_);
    var cp2x = cp1x + (aX - this.currentX_) / 3.0;
    var cp2y = cp1y + (aY - this.currentY_) / 3.0;
    this.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, aX, aY);
  };

  contextPrototype.arc = function(aX, aY, aRadius,
                                  aStartAngle, aEndAngle, aClockwise) {
    aRadius *= Z;
    var arcType = aClockwise ? "at" : "wa";

    var xStart = aX + (mc(aStartAngle) * aRadius) - Z2;
    var yStart = aY + (ms(aStartAngle) * aRadius) - Z2;

    var xEnd = aX + (mc(aEndAngle) * aRadius) - Z2;
    var yEnd = aY + (ms(aEndAngle) * aRadius) - Z2;

    // IE won't render arches drawn counter clockwise if xStart == xEnd.
    if (xStart == xEnd && !aClockwise) {
      xStart += 0.125; // Offset xStart by 1/80 of a pixel. Use something
                       // that can be represented in binary
    }

    this.currentPath_.push({type: arcType,
                           x: aX,
                           y: aY,
                           radius: aRadius,
                           xStart: xStart,
                           yStart: yStart,
                           xEnd: xEnd,
                           yEnd: yEnd});

  };

  contextPrototype.rect = function(aX, aY, aWidth, aHeight) {
    this.moveTo(aX, aY);
    this.lineTo(aX + aWidth, aY);
    this.lineTo(aX + aWidth, aY + aHeight);
    this.lineTo(aX, aY + aHeight);
    this.closePath();
  };

  contextPrototype.strokeRect = function(aX, aY, aWidth, aHeight) {
    // Will destroy any existing path (same as FF behaviour)
    this.beginPath();
    this.moveTo(aX, aY);
    this.lineTo(aX + aWidth, aY);
    this.lineTo(aX + aWidth, aY + aHeight);
    this.lineTo(aX, aY + aHeight);
    this.closePath();
    this.stroke();
  };

  contextPrototype.fillRect = function(aX, aY, aWidth, aHeight) {
    // Will destroy any existing path (same as FF behaviour)
    this.beginPath();
    this.moveTo(aX, aY);
    this.lineTo(aX + aWidth, aY);
    this.lineTo(aX + aWidth, aY + aHeight);
    this.lineTo(aX, aY + aHeight);
    this.closePath();
    this.fill();
  };

  contextPrototype.createLinearGradient = function(aX0, aY0, aX1, aY1) {
    var gradient = new CanvasGradient_("gradient");
    return gradient;
  };

  contextPrototype.createRadialGradient = function(aX0, aY0,
                                                   aR0, aX1,
                                                   aY1, aR1) {
    var gradient = new CanvasGradient_("gradientradial");
    gradient.radius1_ = aR0;
    gradient.radius2_ = aR1;
    gradient.focus_.x = aX0;
    gradient.focus_.y = aY0;
    return gradient;
  };

  contextPrototype.drawImage = function (image, var_args) {
    var dx, dy, dw, dh, sx, sy, sw, sh;

    // to find the original width we overide the width and height
    var oldRuntimeWidth = image.runtimeStyle.width;
    var oldRuntimeHeight = image.runtimeStyle.height;
    image.runtimeStyle.width = 'auto';
    image.runtimeStyle.height = 'auto';

    // get the original size
    var w = image.width;
    var h = image.height;

    // and remove overides
    image.runtimeStyle.width = oldRuntimeWidth;
    image.runtimeStyle.height = oldRuntimeHeight;

    if (arguments.length == 3) {
      dx = arguments[1];
      dy = arguments[2];
      sx = sy = 0;
      sw = dw = w;
      sh = dh = h;
    } else if (arguments.length == 5) {
      dx = arguments[1];
      dy = arguments[2];
      dw = arguments[3];
      dh = arguments[4];
      sx = sy = 0;
      sw = w;
      sh = h;
    } else if (arguments.length == 9) {
      sx = arguments[1];
      sy = arguments[2];
      sw = arguments[3];
      sh = arguments[4];
      dx = arguments[5];
      dy = arguments[6];
      dw = arguments[7];
      dh = arguments[8];
    } else {
      throw "Invalid number of arguments";
    }

    var d = this.getCoords_(dx, dy);

    var w2 = sw / 2;
    var h2 = sh / 2;

    var vmlStr = [];

    var W = 10;
    var H = 10;

    // For some reason that I've now forgotten, using divs didn't work
    vmlStr.push(' <g_vml_:group',
                ' coordsize="', Z * W, ',', Z * H, '"',
                ' coordorigin="0,0"' ,
                ' style="width:', W, ';height:', H, ';position:absolute;');

    // If filters are necessary (rotation exists), create them
    // filters are bog-slow, so only create them if abbsolutely necessary
    // The following check doesn't account for skews (which don't exist
    // in the canvas spec (yet) anyway.

    if (this.m_[0][0] != 1 || this.m_[0][1]) {
      var filter = [];

      // Note the 12/21 reversal
      filter.push("M11='", this.m_[0][0], "',",
                  "M12='", this.m_[1][0], "',",
                  "M21='", this.m_[0][1], "',",
                  "M22='", this.m_[1][1], "',",
                  "Dx='", mr(d.x / Z), "',",
                  "Dy='", mr(d.y / Z), "'");

      // Bounding box calculation (need to minimize displayed area so that
      // filters don't waste time on unused pixels.
      var max = d;
      var c2 = this.getCoords_(dx + dw, dy);
      var c3 = this.getCoords_(dx, dy + dh);
      var c4 = this.getCoords_(dx + dw, dy + dh);

      max.x = Math.max(max.x, c2.x, c3.x, c4.x);
      max.y = Math.max(max.y, c2.y, c3.y, c4.y);

      vmlStr.push("padding:0 ", mr(max.x / Z), "px ", mr(max.y / Z),
                  "px 0;filter:progid:DXImageTransform.Microsoft.Matrix(",
                  filter.join(""), ", sizingmethod='clip');")
    } else {
      vmlStr.push("top:", mr(d.y / Z), "px;left:", mr(d.x / Z), "px;")
    }

    vmlStr.push(' ">' ,
                '<g_vml_:image src="', image.src, '"',
                ' style="width:', Z * dw, ';',
                ' height:', Z * dh, ';"',
                ' cropleft="', sx / w, '"',
                ' croptop="', sy / h, '"',
                ' cropright="', (w - sx - sw) / w, '"',
                ' cropbottom="', (h - sy - sh) / h, '"',
                ' />',
                '</g_vml_:group>');

    this.element_.insertAdjacentHTML("BeforeEnd",
                                    vmlStr.join(""));
  };

  contextPrototype.stroke = function(aFill) {
    var lineStr = [];
    var lineOpen = false;
    var a = processStyle(aFill ? this.fillStyle : this.strokeStyle);
    var color = a[0];
    var opacity = a[1] * this.globalAlpha;

    var W = 10;
    var H = 10;

    lineStr.push('<g_vml_:shape',
                 ' fillcolor="', color, '"',
                 ' filled="', Boolean(aFill), '"',
                 ' style="position:absolute;width:', W, ';height:', H, ';"',
                 ' coordorigin="0 0" coordsize="', Z * W, ' ', Z * H, '"',
                 ' stroked="', !aFill, '"',
                 ' strokeweight="', this.lineWidth, '"',
                 ' strokecolor="', color, '"',
                 ' path="');

    var newSeq = false;
    var min = {x: null, y: null};
    var max = {x: null, y: null};

    for (var i = 0; i < this.currentPath_.length; i++) {
      var p = this.currentPath_[i];

      if (p.type == "moveTo") {
        lineStr.push(" m ");
        var c = this.getCoords_(p.x, p.y);
        lineStr.push(mr(c.x), ",", mr(c.y));
      } else if (p.type == "lineTo") {
        lineStr.push(" l ");
        var c = this.getCoords_(p.x, p.y);
        lineStr.push(mr(c.x), ",", mr(c.y));
      } else if (p.type == "close") {
        lineStr.push(" x ");
      } else if (p.type == "bezierCurveTo") {
        lineStr.push(" c ");
        var c = this.getCoords_(p.x, p.y);
        var c1 = this.getCoords_(p.cp1x, p.cp1y);
        var c2 = this.getCoords_(p.cp2x, p.cp2y);
        lineStr.push(mr(c1.x), ",", mr(c1.y), ",",
                     mr(c2.x), ",", mr(c2.y), ",",
                     mr(c.x), ",", mr(c.y));
      } else if (p.type == "at" || p.type == "wa") {
        lineStr.push(" ", p.type, " ");
        var c  = this.getCoords_(p.x, p.y);
        var cStart = this.getCoords_(p.xStart, p.yStart);
        var cEnd = this.getCoords_(p.xEnd, p.yEnd);

        lineStr.push(mr(c.x - this.arcScaleX_ * p.radius), ",",
                     mr(c.y - this.arcScaleY_ * p.radius), " ",
                     mr(c.x + this.arcScaleX_ * p.radius), ",",
                     mr(c.y + this.arcScaleY_ * p.radius), " ",
                     mr(cStart.x), ",", mr(cStart.y), " ",
                     mr(cEnd.x), ",", mr(cEnd.y));
      }


      // TODO: Following is broken for curves due to
      //       move to proper paths.

      // Figure out dimensions so we can do gradient fills
      // properly
      if(c) {
        if (min.x == null || c.x < min.x) {
          min.x = c.x;
        }
        if (max.x == null || c.x > max.x) {
          max.x = c.x;
        }
        if (min.y == null || c.y < min.y) {
          min.y = c.y;
        }
        if (max.y == null || c.y > max.y) {
          max.y = c.y;
        }
      }
    }
    lineStr.push(' ">');

    if (typeof this.fillStyle == "object") {
      var focus = {x: "50%", y: "50%"};
      var width = (max.x - min.x);
      var height = (max.y - min.y);
      var dimension = (width > height) ? width : height;

      focus.x = mr((this.fillStyle.focus_.x / width) * 100 + 50) + "%";
      focus.y = mr((this.fillStyle.focus_.y / height) * 100 + 50) + "%";

      var colors = [];

      // inside radius (%)
      if (this.fillStyle.type_ == "gradientradial") {
        var inside = (this.fillStyle.radius1_ / dimension * 100);

        // percentage that outside radius exceeds inside radius
        var expansion = (this.fillStyle.radius2_ / dimension * 100) - inside;
      } else {
        var inside = 0;
        var expansion = 100;
      }

      var insidecolor = {offset: null, color: null};
      var outsidecolor = {offset: null, color: null};

      // We need to sort 'colors' by percentage, from 0 > 100 otherwise ie
      // won't interpret it correctly
      this.fillStyle.colors_.sort(function (cs1, cs2) {
        return cs1.offset - cs2.offset;
      });

      for (var i = 0; i < this.fillStyle.colors_.length; i++) {
        var fs = this.fillStyle.colors_[i];

        colors.push( (fs.offset * expansion) + inside, "% ", fs.color, ",");

        if (fs.offset > insidecolor.offset || insidecolor.offset == null) {
          insidecolor.offset = fs.offset;
          insidecolor.color = fs.color;
        }

        if (fs.offset < outsidecolor.offset || outsidecolor.offset == null) {
          outsidecolor.offset = fs.offset;
          outsidecolor.color = fs.color;
        }
      }
      colors.pop();

      lineStr.push('<g_vml_:fill',
                   ' color="', outsidecolor.color, '"',
                   ' color2="', insidecolor.color, '"',
                   ' type="', this.fillStyle.type_, '"',
                   ' focusposition="', focus.x, ', ', focus.y, '"',
                   ' colors="', colors.join(""), '"',
                   ' opacity="', opacity, '" />');
    } else if (aFill) {
      lineStr.push('<g_vml_:fill color="', color, '" opacity="', opacity, '" />');
    } else {
      lineStr.push(
        '<g_vml_:stroke',
        ' opacity="', opacity,'"',
        ' joinstyle="', this.lineJoin, '"',
        ' miterlimit="', this.miterLimit, '"',
        ' endcap="', processLineCap(this.lineCap) ,'"',
        ' weight="', this.lineWidth, 'px"',
        ' color="', color,'" />'
      );
    }

    lineStr.push("</g_vml_:shape>");

    this.element_.insertAdjacentHTML("beforeEnd", lineStr.join(""));

    this.currentPath_ = [];
  };

  contextPrototype.fill = function() {
    this.stroke(true);
  }

  contextPrototype.closePath = function() {
    this.currentPath_.push({type: "close"});
  };

  /**
   * @private
   */
  contextPrototype.getCoords_ = function(aX, aY) {
    return {
      x: Z * (aX * this.m_[0][0] + aY * this.m_[1][0] + this.m_[2][0]) - Z2,
      y: Z * (aX * this.m_[0][1] + aY * this.m_[1][1] + this.m_[2][1]) - Z2
    }
  };

  contextPrototype.save = function() {
    var o = {};
    copyState(this, o);
    this.aStack_.push(o);
    this.mStack_.push(this.m_);
    this.m_ = matrixMultiply(createMatrixIdentity(), this.m_);
  };

  contextPrototype.restore = function() {
    copyState(this.aStack_.pop(), this);
    this.m_ = this.mStack_.pop();
  };

  contextPrototype.translate = function(aX, aY) {
    var m1 = [
      [1,  0,  0],
      [0,  1,  0],
      [aX, aY, 1]
    ];

    this.m_ = matrixMultiply(m1, this.m_);
  };

  contextPrototype.rotate = function(aRot) {
    var c = mc(aRot);
    var s = ms(aRot);

    var m1 = [
      [c,  s, 0],
      [-s, c, 0],
      [0,  0, 1]
    ];

    this.m_ = matrixMultiply(m1, this.m_);
  };

  contextPrototype.scale = function(aX, aY) {
    this.arcScaleX_ *= aX;
    this.arcScaleY_ *= aY;
    var m1 = [
      [aX, 0,  0],
      [0,  aY, 0],
      [0,  0,  1]
    ];

    this.m_ = matrixMultiply(m1, this.m_);
  };

  /******** STUBS ********/
  contextPrototype.clip = function() {
    // TODO: Implement
  };

  contextPrototype.arcTo = function() {
    // TODO: Implement
  };

  contextPrototype.createPattern = function() {
    return new CanvasPattern_;
  };

  // Gradient / Pattern Stubs
  function CanvasGradient_(aType) {
    this.type_ = aType;
    this.radius1_ = 0;
    this.radius2_ = 0;
    this.colors_ = [];
    this.focus_ = {x: 0, y: 0};
  }

  CanvasGradient_.prototype.addColorStop = function(aOffset, aColor) {
    aColor = processStyle(aColor);
    this.colors_.push({offset: 1-aOffset, color: aColor});
  };

  function CanvasPattern_() {}

  // set up externs
  G_vmlCanvasManager = G_vmlCanvasManager_;
  CanvasRenderingContext2D = CanvasRenderingContext2D_;
  CanvasGradient = CanvasGradient_;
  CanvasPattern = CanvasPattern_;

})();

} // if
function Alert(o) {
	alert(o.message? o.message: o);
};
Arrays = {
	/**
	 * Add item(s) to an array.
	 * @param {Object|Array} o
	 */
	add: function(a, o) {
		if(Lang.isArray(o)) {
			for(var i = 0; i < o.length; i++) {
				Arrays.add(a, o[i]);
			}
		}
		a.push(o);
	},
	
	/**
	 * Test if array contains specified object.
	 * @param {Array} a array to be searched
	 * @param {Object} o object to search for
	 * @return true only if array does contain specified object.
	 */
	contains: function(a, o) {
		for(var i = 0, l = a.length; i < l; i++) {
			if(a[i] === o) return true;
		}
	},
	
	getIndex: function(a, o) {
		for(var i = 0, l = a.length; i < l; i++) {
			if(a[i] === o) return i;
		}
		return -1;		
	},
	
	/**
	 * Deep array cloning. This method copy all source array graph.
	 */
	clone: function(o) {
		if(!o) return null;
		if(Lang.isArray(o)) {
			var c = [];
			for(var i = 0; i < o.length; i++) {
				c[i] = Lang.isPrimitive(o[i])? o[i]: this.clone(o[i]);  
			}
			return c;
		}
		if(Lang.isObject(o)) {
			c = {};
			for(var p in o) {
				c[p] = Lang.isPrimitive(o[p])? o[p]: this.clone(o[p]);
			}
			return c; 
		}
	},
	
	removeItems: function(a, fn) {
		for(var i = 0, l = a.length; i < l; i++) {
			if(fn) a[i][fn]();
			delete a[i]; // this helpfully will give a hint to garbace collector
		}
		a.length = 0;
	},
	
	/**
	 * 
	 * <pre>
	 *	var a = ['one', 'two', 'three', 'four'];
	 *	Arrays.each(a, function(item, index) {
	 *		// do something useful with item and | or index 
	 *	});
	 *	// note that classical loop is more efficient
	 *	for(var i = 0; i < array.length; i++) {
	 *  	// do something useful with array[i] and | or i 
	 *	} 
	 * </pre>
	 * @param {Array} array
	 * @param {Function} lambda
	 */
	each: function(array, lambda) {
		for(var i = 0; i < array.length; i++) {
			lambda.call(this, array[i], i);
		}
	},
	
	/**
	 * 
	 * <pre>
	 *	var els = Dom.getByTags('li');
	 *	var els = $('li');
	 *	Arrays.invoke(els, Dom.hide);
	 * 
	 *	Arrays.invoke($('LI'), Dom.hide);
	 * 
	 *	var els = $('LI');
	 *	for(var i = 0; i < els.length; i++) {
	 * 		Dom.hide(els[i]);
	 *	}
	 * 
	 *	Arrays.invoke($('LI'), Dom.addClass, 'optional');
	 * 
	 *	var els = $('LI');
	 *	for(var i = 0; i < els.length; i++) {
	 * 		Dom.addClass(els[i], 'optional');
	 *	}
	 * </pre>
	 * 
	 * 
	 */
	invoke: function(array, method) {
		var vargs = arguments.slice(2);
		for(var i = 0; i < array.length; i++) {
			var obj = array[i];
			Lang.assertObject(obj);
			obj[method].apply(obj, vargs);
		}
	}
};
Timer = function() {
};

Timer.ONE_SHOOT = ['setTimeout', 'clearTimeout'];
Timer.PERIODIC = ['setInterval', 'clearInterval'];

Timer.prototype = {
	start: function() {
		var _this = this;
		var fn = function() {
			_this.callback.apply(_this.scope, _this.arguments);
		}
		if(this._id) this.stop();
		this._id = window[this.type[0]](fn, this.timeout);
	},
	
	stop: function() {
		if(!this._id) return;
		window[this.type[1]](this._id);
		this._id = null;		
	}	
};

Timer.setTimeout = function(timeout, callback, scope) {
	var t = new Timer();
	t.type = Timer.ONE_SHOOT;
	t.timeout = timeout;
	t.scope = scope? scope: window;
	t.callback = callback;
	t.arguments = [];
	for(var i = 3; i < arguments.length; i++) {
		t.arguments.push(arguments[i]);
	}
	t.start();
	return t; 
};

Timer.setInterval = function(timeout, callback, scope) {
	var t = new Timer();
	t.type = Timer.PERIODIC;
	t.timeout = timeout;
	t.scope = scope? scope: window;
	t.callback = callback;
	t.arguments = [];
	for(var i = 3; i < arguments.length; i++) {
		t.arguments.push(arguments[i]);
	}
	t.start();
	return t; 
};


/**
 * <code>
 * 		Timer.call(1000, function() {
 * 			// function body
 * 		});
 * </code>
 */
Timer.call = Timer.setTimeout;
 
// TODO: use a common initialization like this
Timer._initTimer = function(timer) {
	timer.period = timeout;
	timer.scope = scope;
	timer.callback = callback;
	timer.arguments = [];
	for(var i = 3; i < arguments.length; i++) {
		timer.arguments.push(arguments[i]);
	}
	timer.start();
	return t; 
};
/**
 * Animation is a collection of effects executed concurent or sequential. There
 * may be more than one element involved in an animation. An effect is a sequence
 * of transformations applied to a single element, lasting for a finite time period
 * named effect duration; also an effect may have a starting delay, named offset,
 * as a means for sequential execution. Every effect has a temporal transfer function,
 * default to linear, that dictates effect evolution. A transformation is a simple
 * style changes applied to the element and has an initial, a final or amount value. 
 * For now only numerical style are supported. Finally animation support recursiveness,
 * i.e. an animation object may contains other animation objects. This is usefully
 * for animation component development.
 * 
 * @sample
 * TODO: add sample code
 * 
 * All position and dimension values are in pixels. Delay and duration are expressed in milliseconds.
 */
Anim = function(cfg) {
	if(cfg) this._cfg = Lang.isArray(cfg)? cfg: [cfg];
};

Anim.prototype = {
	setCallback: function(callback, scope) {
		this._callback = callback;
		this._scope = scope;	
	},
	
	start: function() {
		Anim.Engine.register(this);		
	}
};

Anim.FPS = 24;
Anim.TICK = 1000 / Anim.FPS;		
Anim.PX_UNITS = /width|height|top|bottom|left|right/i;

/**
 * Animation description. This object contains animation metadata used by engine
 * to actually execute the animation.
 * TODO: change the name to Anim.Meta
 */
Anim.Description = function(anim) {
	this._callback = anim._callback;
	this._scope = anim._scope;

	this._fxs = [];	
	for(var i = 0; i < anim._cfg.length; i++) {
		var fxd = anim._cfg[i]; // effect description
		if(Lang.isUndefined(fxd.offset)) fxd.offset = 0;
		if(Lang.isUndefined(fxd.duration)) fxd.duration = 1000;
		if(Lang.isUndefined(fxd.ttf)) fxd.ttf = Anim.TTF.Linear;
		fxd.units = '';
		if(Anim.PX_UNITS.test(fxd.attr)) fxd.units = 'px';
		
		this._fxs.push({
			t: Math.round(-fxd.offset / Anim.TICK),			// current tick
			ticks: Math.round(fxd.duration / Anim.TICK),	// ticks count 
			el: fxd.el,										// attached element
			attr: fxd.attr,									// attribute to manipulate
			ttf: fxd.ttf,									// temporal transform function
			origin: fxd.from,								// original, i.e. starting value
			magnitude: fxd.to - fxd.from,					// effect magnitude, can be negative
			units: fxd.units								// attribute units 
		});
	}
};
	
Anim.Description.prototype = {
	iterator: function() {
		var callback = this._callback;
		var scope = this._scope;
		var fxs = this._fxs;
		
		// this iterator assumes its methods are used in the proper order
		return {
			_index: 0,
			hasNext: function() {
				return this._index < fxs.length;	
			},
			next: function() {
				return fxs[this._index++];
			},
			remove: function() {
				this._index--;
				fxs.splice(this._index, 1);
				if(!fxs.length && callback) callback.call(scope);
			}
		}
	}	
};

/**
 * Animation engine singleton.
 */
Anim.Engine = {
	_animds: [], // running animations description queue
	
	/**
	 * Register effects to engine.
	 * 
	 * @param fxsDesc {Array} a list of effects description.
	 */
	register: function(anim) {
		this._animds.push(new Anim.Description(anim));
		if(!this._timer) this._timer = Timer.setInterval(Anim.TICK, this._onTick, this);
	},
	
	_onTick: function() {
		for(var i = 0; i < this._animds.length; i++) {
			var animd = this._animds[i]; // animation description
			var it = animd.iterator();
			while(it.hasNext()) {
				var fx = it.next();
				if(fx.t++ == fx.ticks) {
					it.remove();
					continue;
				}
				if(fx.t < 0) continue; // effect still waiting to be started
				var value = fx.ttf(fx.t, fx.origin, fx.magnitude, fx.ticks);
				value += fx.units;
				Dom.setStyle(fx.el, fx.attr, value);
			}
		}
		if(!this._animds.length) {
			// auto-magically engine stop if running animations queue is empty
			this._timer.stop();
			this._timer = null;
		}
	}
};

/**
 * Temporal transform functions.
 * 
 * All TTF has the same formal parameters and return value:
 * @param t {Number} current tick value, that is temporal reference
 * @param origin {Number} element attribute origin, constant value
 * @param magnitude {Number} element attribute start and end delta
 * @param ticks {Number} effect ticks count
 */
Anim.TTF = {};

Anim.TTF.Linear = function(t, origin, magnitude, ticks) {
	var tgalpha = magnitude / ticks;		
	return origin + tgalpha * t;
};

Anim.TTF.Exponential = function(t, origin, magnitude, ticks) {
	t /= ticks;
	return origin + magnitude * t * t;
};

Anim.TTF.Logarithmic = function(t, origin, magnitude, ticks) {
	return origin - magnitude * (t /= ticks) * (t - 2);	
};

Anim.TTF.Swing = function(t, origin, magnitude, ticks) {
	var CYCLES = 4;
	var radians = CYCLES * 2*Math.PI;
	var dRadians = radians / ticks;
	var dMagnitude = magnitude / ticks;
	return origin - Math.sin(t * dRadians) * (magnitude - t * dMagnitude);
};

Anim.ImageShow = function(containerEl) {
	var styles = {
		'position': 'absolute',
		'left': '0px',
		'top': '0px',
		'width': '100%',
		'height': '100%',
		'overflow': 'hidden'
	};
	
	this._divEl1 = Dom.createElement('div');
	Dom.setStyles(this._divEl1, styles);
	this._divEl1.appendChild(new Image());
	containerEl.appendChild(this._divEl1);

	this._divEl2 = Dom.createElement('div');
	Dom.setStyles(this._divEl2, styles);
	this._divEl2.appendChild(new Image());	
	containerEl.appendChild(this._divEl2);
};

Anim.ImageShow.prototype = {
	start: function() {
		Lang.assertNotNull(this.images);
		this._divEl1.firstChild.src = this.images[0];
		this._divEl2.firstChild.src = this.images[0];
		if(!this.transitionDuration) this.transitionDuration = 2000;
		if(!this.slideDuration) this.slideDuration = 2000;

		this._image = new Image();
		Event.addListener(this._image, 'load', this._onLoad, this);

		this._timer = Timer.setTimeout(this.slideDuration, this._onTick, this);
	},
	
	stop: function() {
		this._stoped = true;
		this._timer.stop();
	},
	
	_onTick: function() {
		var i = Math.floor(this.images.length * Math.random());
		this._image.src = this.images[i];
	},
	
	_onLoad: function() {
		this._divEl1.firstChild.src = this._image.src;

		this._anim = new Anim([
			{el:this._divEl1, duration:this.transitionDuration, attr:'opacity', from:0, to:1},
			{el:this._divEl2, duration:this.transitionDuration, attr:'opacity', from:1, to:0}
		]);
		this._anim.setCallback(this._onComplete, this);
		this._anim.start();
	},
	
	_onComplete: function() {
		var divEl = this._divEl1;
		this._divEl1 = this._divEl2;
		this._divEl2 = divEl;
		
		if(this._stoped) return;
		this._timer = Timer.setTimeout(this.slideDuration, this._onTick, this);
	}
};

Anim.Dialog = function(el, attrs) {
	var cfg = [];
	for(var a in attrs) {
		var v = attrs[a];
		cfg.push({el:el, duration:600, attr:a, from:v[0], to:v[1], ttf:Anim.TTF.Logarithmic});
	}
	this._animOpen = new Anim(cfg);
	this._animOpen.setCallback(this._onOpenComplete, this);
		
	var cfg = [];
	for(var a in attrs) {
		var v = attrs[a];
		cfg.push({el:el, duration:600, attr:a, from:v[1], to:v[0], ttf:Anim.TTF.Exponential});
	}
	this._animClose = new Anim(cfg);
	this._animClose.setCallback(this._onCloseComplete, this);
	
	this._events = {
		beforeopen: new CustomEvent('beforeopen'), // before starting open action 
		afteropen: new CustomEvent('afteropen'), // after open action completion 
		beforeclose: new CustomEvent('beforeclose'), // before starting close action
		afterclose: new CustomEvent('afterclose') // after start action completion
	};
};

Anim.Dialog.prototype = {
	addListener: function(event, callback, scope) {
		this._events[event].subscribe(callback, scope);
	},
	
	open: function() {
		if(this._opening) return;
		this._opening = true;
		this._events['beforeopen'].fire();
		this._animOpen.start();
	},
	
	close: function() {
		if(this._closing) return;
		this._closing = true;
		this._events['beforeopen'].fire();
		this._animClose.start();
	},
	
	_onOpenComplete: function() {
		this._events['afteropen'].fire();
		this._opening = false;
	},
	
	_onCloseComplete: function() {
		this._events['afterclose'].fire();
		this._closing = false;
	}
};
/**
 * To camel case. This string extension change the first letter to capital and the
 * others to lower case.
 */
String.prototype.toCamelCase = function() {
	return this.charAt(0).toUpperCase() + this.substr(1).toLowerCase();
};

Lang = {
	IE: false, // internet explorer
	NIE: true, // not internet explorer
	FF: false, // fire fox
	NFF: true, // not firefox
	OP: false, // opera
	NOP: true, // not opera
	SA: false, // safari
	NSA: true, // not safari
	
	ASSERTION_ERROR: 'ASSERTION_ERROR',
	assertion: true,
	
	assert: function(expression) {
		if(this.assertion && !expression) {
			var e = new Error();
			e.name = Lang.ASSERTION_ERROR;
			e.message = 'Assertion error on ' + Lang.assert.caller;  
			throw e;
		}
	},
	
	assertDefined: function(o) {
		Lang.assert(typeof o !== 'undefined');	
	},
	
	assertNotNull: function(o) {
		Lang.assert(o !== null);	
	},
	
	assertExists: function(o) {
		Lang.assert(typeof o !== 'undefined' && o !== null)	
	},
	
	assertString: function(o) {
		Lang.assert(Lang.isString(o));	
	},
	
	assertObject: function(o) {
		Lang.assert(Lang.isObject(o));	
	},
	
	assertFunction: function(o) {
		Lang.assert(Lang.isFunction(o));	
	},
	
	assertArray: function(o) {
		Lang.assert(Lang.isArray(o));		
	},
	
	assertPrimitive: function(o) {
		Lang.assert(Lang.isPrimitive(o));		
	},
	
	extend: function(subClass, superClass) {
		Lang.assertFunction(subClass);
		Lang.assertFunction(superClass);
		var subClassPrototype = subClass.prototype; 
		var F = function(){};
		F.prototype = superClass.prototype;
		subClass.prototype = new F();
		subClass.prototype.constructor = subClass;
		subClass.superclass = superClass.prototype;
		for(var p in subClassPrototype) {
			subClass.prototype[p] = subClassPrototype[p];
		}
		if(Lang.IE) {
			// IE will not enumerate native functions in a derived object even if the
			// function was overridden.  This is a workaround for specific functions 
			// we care about on the Object prototype.
     		var nativeFunctions = ['toString', 'valueOf'];
            for(var i = 0; i < nativeFunctions.length; i++) {
                var fname = nativeFunctions[i];
                var f = subClassPrototype[fname];
                if(Lang.isFunction(f) && f != Object.prototype[fname]) {
                    subClass.prototype[fname] = f;
                }
            }			
		}		
	},
	
	augment: function(target, source, includePrivate) {
		Lang.assertObject(target);
		Lang.assertObject(source);
		for(var p in  source) {
			if(!includePrivate && p.charAt(0) === '_') continue;
			target[p] = source[p];
		}
	},
	
	isUndefined: function(o) {
        return typeof o === 'undefined';
	},
	
	isArray: function(o) {
        return (typeof o === 'object' && o instanceof Array) || 
        // function arguments is actually an array like object, it does not
        // implement any Array methods like splice, but having instead callee
        // anyway, we want to treat it as an array not an object
        (typeof o !== 'undefined' && typeof o.callee === 'function');
	},

	isObject: function(o) {
 		return typeof o === 'object' || typeof o === 'function';		
	},
		
	isFunction: function(o) {
        return typeof o === 'function';
    },
		
	isString: function(o) {
		return typeof o === 'string' || (typeof o === 'object' && o instanceof String);
	},
	
	isNumber: function(o) {
		return typeof o === 'number';
	},
		
    isBoolean: function(o) {
        return typeof o === 'boolean';
    },
    
    isPrimitive: function(o) {
    	return Lang.isString(o) || Lang.isNumber(o) || Lang.isBoolean(o);
    }
};

// user agent detection
(
	function() {
		// user agent samples(latest versions):
		// Internet Explorer: Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; EmbeddedWB 14.52 from: http://www.bsalsa.com/ EmbeddedWB 14.52; .NET CLR 1.1.4322; .NET CLR 2.0.50727)
		// Firefox: Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.17) Gecko/20080829 Firefox/2.0.0.17
		// Chrome: Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US) AppleWebKit/525.19 (KHTML, like Gecko) Chrome/0.3.154.9 Safari/525.19
		// Safari: Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US) AppleWebKit/525.19 (KHTML, like Gecko) Version/3.1.2 Safari/525.21
		// Opera: Opera/9.62 (Windows NT 5.1; U; en) Presto/2.1.1 		
		var ua = navigator.userAgent;
		
		if(ua.indexOf('MSIE') !== -1) { // IE
			Lang.IE = true;
			Lang.NIE = false;
			return;
		}
		if(ua.indexOf('Firefox') !== -1) { // Firefox
			Lang.FF = true;
			Lang.NFF = false;
			return;			
		}
		if(ua.indexOf('Opera') !== -1) { // Opera
			Lang.OP = true;
			Lang.NOP = false;
			return;			
		}
		if(ua.indexOf('Safari') !== -1) { // Safari, Chrome
			Lang.SA = true;
			Lang.NSA = false;
			return;
		}
	}
)();
/**
 * DOM access utility.
 * 
 * @static
 */
Dom = {
	_id: 0,
	
	/**
	 * Set ID attribute.
	 * {DOM} el - element
	 * {ID} id - if missing generate a new fresh ID
	 */
	setId: function(el, id) {
		if(!id) id = Dom._generateId();
		Dom.setAttribute(el, 'id', id);
	},
	
	getId: function(el) {
		if(el) return Dom.getAttribute(el, 'id');
		return Dom._generateId();	
	},
	
	/**
	 * Returns an DOM element.
	 * @param {String|Element} el
	 */
	getEl: function(el) {
		if(Lang.isString(el)) return document.getElementById(el);
		return el? el: null;
	},
	
	getById: function(id) {
		return document.getElementById(id);
	},
	
	getByTag: function(el, tag) {
		if(!tag) {
			tag = el;
			el = document;
		}
		return el.getElementsByTagName(tag.toLowerCase());
	},
	
	getByClass: function(el, cls) {
		if(!cls) {
			cls = el;
			el = document;
		}
		cls = cls.replace(/([\/|\.|\*|\+|\?|\||\(|\)|\[|\]|\{|\}|\\|\$])/g, '\\$1')
		var pattern = new RegExp('(^|\\s)' + cls + '(\\s|$)');
		var els = Dom.getChildren(el);
		var a = [];
		for(var i = 0, l = els.length; i < l; i++) {
			if(pattern.test(els[i].className)) a.push(els[i]);
		}
		return (a.length === 1)? a[0]: a;		
	},
	
	/**
	 * Get tag name for a given element as lower case.
	 * @param {Object} el
	 */
	getTag: function(el) {
		return el.tagName.toLowerCase();
	},

	/**
	 * Create DOM element and set attributes, if any.
	 * <pre>
	 * var homeLink = Dom.createElement('a', {href:'http://gnotis.ro'});
	 * var colorCheckBox = Dom.createElement('input', {id:Dom.getId(),type:'checkbox',name:'color'});
	 * </pre>
	 * @param {String} tag tag name to create,
	 * @param {Object} attr optional attributes.
	 */	
	createElement: function(tag, attr) {
		var el = document.createElement(tag);
		Dom.setAttributes(el, attr);
		return el; 
	},
	
	getParent: function(el) {
		return Dom.getEl(el).parentNode;	
	},
	
	/**
	 * Element children iterator.
	 */
	children: function(el, fn) {
		var els = Dom.getChildren(el);
		for(var i = 0; i < els.length; i++) {
			fn(els[i]);
			Dom.children(els[i], fn);
		}
	},
	
	/**
	 * Append child to DOM element. Add a child to the parent children list end.
	 * 
	 * @param {Element} parent, default to document.body,
	 * @param {Element} child to be added.
	 */
	appendChild: function(parent, child) {
		if(!child) {
			child = parent;
			parent = document.body;
		}
		parent.appendChild(child);
	},
	
	/**
	 * Append children to DOM element. Add an array of DOM elements at the end
	 * of parent children list. 
	 * 
	 * @param {Element} parent, default to document.body,
	 * @param {Element} child to be added.
	 */
	appendChildren: function(parent, children) {
		if(!children) {
			children = parent;
			parent = document.body;
		}
		for(var i = 0; i < children.length; i++) {
			parent.appendChild(children[i]);
		}
	},

	/**
	 * Add text to element.
	 */
	appendText: function(el, text) {
		var textNode = document.createTextNode(text);
		el.appendChild(textNode);	
	},
	
	/**
	 * Set element text. Search for first text node and set its value. If text node
	 * is missing creates one.
	 */
	setText: function(el, text) {
		for(var i = 0; i < el.childNodes.length; i++) {
			if(el.childNodes[i].nodeType === 3) {
				el.childNodes[i].nodeValue = text;
				return;
			}
		}
		var textNode = document.createTextNode(text);
		el.appendChild(textNode);
	},
	
	getChildren: function(el) {
		return el.getElementsByTagName('*');	
	},
	
	/**
	 * Get first child element. Note this method is different from document first child
	 * which returns fist node, not necessarily element. 
	 */
	getFirstChild: function(el) {
		var children = Dom.getChildren(el);
		return children? children[0]: null;
	},
	
	/**
	 * @param {Element} el to remove chidren from,
	 * @param {Array} children to remove. If missing remove all children.
	 */
	removeChildren: function(el, children) {
		if(children) {
			for(var i = 0; i < children.length; i++) {
				el.removeChild(children[i]);
			}
		}
		else {
			while(el.hasChildNodes()) {
				el.removeChild(el.firstChild);
			}
		}
	},
	
	removeChild: function(child) {
		var parent = Dom.getParent(child);
		if(parent) parent.removeChild(child);	
	},
	
	removeSiblings: function(el) {
		var parent = Dom.getParent(el);
		while(sibling = el.previousSibling) {
			parent.removeChild(sibling);
		}	
		while(sibling = el.nextSibling) {
			parent.removeChild(sibling);
		}	
	},
	
	cloneNode: function(id) {
		var el = Dom.getEl(id);
		return el.cloneNode(true);
	},
	
	clearControls: function(el) {
		if(Lang.isUndefined(this._clearControlsIterations)) this._clearControlsIterations = 0;
		if(this._clearControlsIterations++ === 8) return;
		
		var els = el.getElementsByTagName('*');
		for(var i = 0; i < els.length; i++) {
			var e = els[i];
			if(e.childNodes.length) this.clearControls(e);
			var t = Dom.getTag(e);
			if(t === 'input') {
				if(e.type === 'text') e.value = '';
				else if(e.type === 'checkbox') e.checked = false;
			}
			else if(t === 'select') e.selectedIndex = 0;
			else if(t === 'textarea') e.value = '';
		}		
	},
	
	setAttributes: function(el, attrs) {
		for(var p in attrs) {
			Dom.setAttribute(el, p, attrs[p]);
		}
	},
	
	setAttribute: function(el, attr, value) {
		el.setAttribute(attr.toLowerCase(), value);
	},
	
	getAttribute: function(el, attr) {
		return el.getAttribute(attr.toLowerCase());
	},
	
	removeAttribute: function(el, attr, recursive) {
		el.removeAttribute(attr);
		if(recursive) {	
			Dom.children(el, function(child) {
				child.removeAttribute(attr);
			});
		}
	},
	
	setStyles: function(el, styles) {
		for(var style in styles) {
			Dom.setStyle(el, style, styles[style]);
		}	
	},
	
	setStyle: function(el, style, value) {
		el = this.getEl(el);
		if(Lang.IE) {
			if(style == 'opacity') {
				el.style.filter =  'alpha(opacity=' + value * 100 + ')';
				return;
			} 
		}
		el.style[style] = value;	
	},
	
	getStyle: function(el, style) {
		return Dom.getEl(el).style[style];	
	},
    
    removeStyle: function(el, style) {
    	el.style[style] = '';	
    },
    
    /**
     * Set nodes text.
     */
    setTextEOL: function(node, text, index) {
    	if(Lang.isString(text)) text = [text];
    	if(Lang.isUndefined(index)) index = 0;
    	if(node.nodeType === 3) {
    		if(index < text.length) node.nodeValue = text[index++];
    		return;
    	}
		var nodes = node.childNodes;
		for(var i = 0; i < nodes.length; i++) {
			Dom.setText(nodes[i], text, index);
		}
    },
    
    addClass: function(el, cls) {
		if(this.hasClass(el, cls)) return; // already present
        el.className = [el.className, cls].join(' ');
    },
    
    removeClass: function(el, cls) {
        if(!Dom.hasClass(el, cls)) return; // not present
        var c = el.className;
        var re = new RegExp('(?:^|\\s+)' + cls + '(?:\\s+|$)', 'g');
        el.className = c.replace(re, ' ');
        if(Dom.hasClass(el, cls)) { // in case of multiple adjacent
        	Dom.removeClass(el, cls);
        }
    },

    hasClass: function(el, cls) {
        var re = new RegExp('(?:^|\\s+)' + cls + '(?:\\s+|$)');
        return re.test(el.className);
    },
	
	setUserObject: function(el, obj) {
		el.__user_defined_object__ = obj;	
	},
	
	getUserObject: function(el) {
		return el.__user_defined_object__;
	},
	
	getX: function(el) {
		return this.getXY(el)[0];
	},
	
	getY: function(el) {
		return this.getXY(el)[1];
	},
	
	getXY: function(el) {
		if(el != document.body) {
			if(el.parentNode === null) return false;
			if(el.offsetParent === null) return false;
			if(this.getStyle(el, 'display') == 'none') return false;
		}
		for(var x = 0, y = 0, e = el; e; e = e.offsetParent) {
			x += e.offsetLeft;
			y += e.offsetTop;
			if(e != el && e != document.body && e != document.documentElement) {
				x -= e.scrollLeft;
				y -= e.scrollTop;
			}
		}
		return [x, y];
	},
	
	setXY: function(el, pos) {
		var position = Dom.getStyle(el, 'position');
		if(position === 'static') { // default to relative
			Dom.setStyle(el, 'position', 'relative');
			position = 'relative';
		}

		var pageXY = this.getXY(el);
		// assuming pixels
		var delta = [parseInt(Dom.getStyle(el, 'left'), 10), parseInt(Dom.getStyle(el, 'top'), 10)];
		if(isNaN(delta[0])) { // in case of 'auto'
			delta[0] = position === 'relative'? 0: el.offsetLeft;
		} 
		if(isNaN(delta[1])) { // in case of 'auto'
			delta[1] = position === 'relative'? 0: el.offsetTop;
		} 
        
		if(pos[0] !== null) {el.style.left = pos[0] - pageXY[0] + delta[0] + 'px';}
		if(pos[1] !== null) {el.style.top = pos[1] - pageXY[1] + delta[1] + 'px';}
	},
	
	getCX: function(el) {
		return parseInt(Dom.getStyle(el, 'width'));	
	},
	
	getCY: function(el) {
		return parseInt(Dom.getStyle(el, 'height'));	
	},
	
	getRegion: function(el) {
		var xy = this.getXY(el);
		var t = xy[1];
		var r = xy[0] + el.offsetWidth;
		var b = xy[1] + el.offsetHeight;
		var l = xy[0];
		return new Region(t, r, b, l);
	},
	
	_generateId: function() {
		return 'jslib-id' + ++Dom._id;
	}
};

Dom.Fragment = function(html) {
	this.html = html;
};

Dom.Fragment.prototype = {
	set: function(key, value) {
		var re = new RegExp('\\${' + key + '}', 'gi');
		this.html = this.html.replace(re, value);
	}
};

/**
 * Handy DOM elements creation.
 */
Dom.Script = function(attrs) { return Dom.createElement('script', attrs); };
Dom.IFrame = function(attrs) {
	if(Lang.NIE) { 
		return Dom.createElement('iframe', attrs);
	} 
	var html = '<iframe ';
	for(var p in attrs) {
		html += (p + '="' + attrs[p] + '" ');
	}
	html += '/>';
	// i did not find yet a document describing this behavior: 
	// create element with html instead of tag name
	// antway i presume is an ie feature
	return document.createElement(html);
};
Dom.Input = function(attrs) { return Dom.createElement('input', attrs) };	
Dom.TextField = function(attrs) {
	attrs.type = 'text';
	return Dom.createElement('input', attrs);
};
Dom.Checkbox = function(attrs) {
	attrs.type = 'checkbox';
	return Dom.createElement('input', attrs);
};
Event = {
	_types: {
		'abort': 'HTMLEvents',
		'blur': 'HTMLEvents',
		'change': 'HTMLEvents',
		'click': 'MouseEvents',
		'dblclick': 'MouseEvents',
		'error': 'HTMLEvents',
		'focus': 'HTMLEvents',
		'keydown': 'UIEvents',
		'keypress': 'UIEvents',
		'keyup': 'UIEvents',
		'load': 'HTMLEvents',
		'mousedown': 'MouseEvents',
		'mousemove': 'MouseEvents',
		'mouseout': 'MouseEvents',
		'mouseover': 'MouseEvents',
		'mouseup': 'MouseEvents',
		'reset': 'HTMLEvents',
		'resize': 'HTMLEvents',
		'scroll': 'HTMLEvents',
		'select': 'HTMLEvents',
		'submit': 'HTMLEvents',
		'unload': 'HTMLEvents'
	},
	_onHandlers: [],
	_unHandlers: [],

	/**
	 * Create event to dispatch.
	 * @param {String} type, default to 'click'
	 * Vnimanie: created object is usable only by Event.dispatch and is not reusable!
	 */
	create: function(type) {
		if(!type) type = 'click';
		var ev;
		if(Lang.IE) {
			ev = document.createEventObject();
		}
		if(Lang.NIE) {
			ev = document.createEvent(this._types[type]);
		}
		ev.__eventType__ = type; 
		return ev;
	},
	
	/**
	 * Dispatch an event. This method fires an event created by @see Event.create.
	 * @param {Element} el
	 * @param {Object} ev, event created by Event.create
	 */
	dispatch: function(el, ev) {
		if(Lang.IE) {
			el.fireEvent('on' + ev.__eventType__, ev);
		}
		if(Lang.NIE) {
			ev.initEvent(ev.__eventType__, true, true);
			el.dispatchEvent(ev);
		}
	},
	
	/**
	 * Add event listener. This method accept two variants: event listener object
	 * or explicit parameters list. The second is a quicker solution as there is
	 * no need to create an event listener object but it can't be used if one needs
	 * to remove that event listener.
	 * 
	 * // event listener object variant
	 * var l = new Event.Listener();
	 * l.setTarget(el, 'click');
	 * l.setHandler(this._onClick, this);
	 * Event.addListener(l);
	 * ...
	 * Event.removeListener(l);
	 * 
	 * // explicit parameters list variant
	 * Event.addListener(el, 'click', this._onClick, this);
	 * 
     * @param {String} type event type
     * @param {Object|Element|String} o event listener object, DOM element or its id
     * @param {Function} fn event handler to add
	 * @param {Object} scope event handler scope, optional
	 * @param {Object} arg optional object argument to pass back to event handler.
	 */
	addListener: function(type, o, fn, scope, arg) {
		if(arguments.length > 1) {
			var l = new Event.Listener();
			l.setTarget(type, o); // in this case 'o' parameter is a DOM element or its id
			l.setHandler(fn, scope, arg);
			return Event.addListener(l);
		}
		var l = type; // cast first argument to an event listener object
		Lang.assert(l.type === Event.Listener.TYPE);
		if(!l._el) return false;
		if(Lang.IE) {
			if(l._type === 'load') l._type = 'readystatechange';
			l._el.attachEvent('on' + l._type, l._fn);
		}
		if(Lang.NIE) {
			// we always use bubbling, i.e. event propagates from child to parent and so on to window object
			l._el.addEventListener(l._type, l._fn, false);
		}
		return true;
	},

	/**
	 * Remove event listener.
	 * 
	 * @param {Object} l event listener.
	 */
	removeListener: function(l) {
		if(!l._el) return false;
		if(Lang.IE) {
			l._el.detachEvent('on' + l._type, l._fn);
		}
		if(Lang.NIE) {
			l._el.removeEventListener(l._type, l._fn, false);
		}
		return true;		
	},
	
	load: function(fn, scope, args) {
		if(!scope) scope = Event;
		if(!args) args = [];
		if(!Lang.isArray(args)) args = [args];
		Event._onHandlers.push({fn:fn, scope:scope, args:args});
	},
	
	unload: function(fn, scope, args) {
		if(!scope) scope = Event;
		if(!args) args = [];
		if(!Lang.isArray(args)) args = [args];
		Event._unHandlers.push({fn:fn, scope:scope, args:args});
	},

	/**
 	 * Register operations, i.e. click event handlers. This method register click
 	 * event handlers for given object. Target object <strong>must</strong> implement
 	 * specified handlers.
 	 * <code>
 	 * 	Obj = {
 	 *		_ops: {
 	 * 			// associate this._onUpload click handler with element identified by 'upload.image'
	 * 			'_onUpload': 'upload.image',
	 * 			...
	 *			'_onReset': 'reset.images'
	 *		},
	 * 
 	 *		init: function() {
 	 * 			Event.register(this, this._ops);
 	 * 		},
 	 * 
 	 *		_onUpload: function(ev) {
 	 * 		},
 	 * 		...
 	 * 		_onReset: function(ev) {
 	 * 		} 		
 	 * 	}
 	 * </code>
 	 * @param {Object} o - target object implementing specified click handlers, i.e. operations,
 	 * @param {Hash} ops - operations, hash with handler name as key and DOM element|ID as value.
 	 * It actually associates an handler to a DOM element, directly or via ID. 
 	 */
	register: function(o, ops) {
		for(var p in ops) {
			Event.addListener('click', ops[p], o[p], o);
		}
	}	
};

/**
 * Window load event global handler. Executes all Event.load registered handlers. It catches handlers
 * exceptions taking care to execute all of them.
 */
window.onload = function() {
	for(var i = 0; i < Event._onHandlers.length; i++) {
		var h = Event._onHandlers[i];
		try { h.fn.apply(h.scope, h.args) } catch(e){}
	}
};

/**
 * Window before unload event global handler. Executes all Event.unload registered handlers. It catches
 * handlers exceptions taking care to execute all of them. If any handler returns boolean false this
 * global handler return false too, signaling to engine to not close the window.
 */
window.onbeforeunload = function() {
	var b = true;
	for(var i = 0; i < Event._unHandlers.length; i++) {
		var h = Event._unHandlers[i];
		try { b = h.fn.apply(h.scope, h.args) && b; } catch(e){}
	}
	return b;
};

/**
 * Event listener. This class encapsulates arguments for event management being
 * used by add and remove listener methods from Event class. It creates a wrapper
 * for event handler that allows for scope and optional parameters handling.
 */
Event.Listener = function() {
	this.type = Event.Listener.TYPE;
	this._bubbling = false; // by default bubbling, aka event propagation, is disabled
	
	/**
	 * Set event target. 
	 * @param {String} type event type.
	 * @param {Element|String} el a DOM element or its id attribute, 
	 */
	this.setTarget = function(type, el) {
		if(!el || !type) return;
		this._el = Dom.getEl(el); // ensure el is a dom element but not its id
		if(!this._el) return;
		this._type = type;
	};
	
	/**
	 * Set event handler.
	 *  
	 * First argument passed to handler is an event object with:
	 * type - even type
	 * target - event target element
	 * pageX, pageY - event coordinates on page, i.e. relative to document
	 * shiftKey, altKey, ctrlKey - flags true if related key pressed
	 * 
	 * @param {Function} fn event handler; may return boolean false in order to prevent default event action, if any, 
	 * @param {Object} scope event handler scope, optional,
	 * @param {Object} arg optional argument to pass back to event handler.
	 */
	this.setHandler = function(fn, scope, arg) {
		if(!scope) scope = this;
		this._fn = function(ev) {
			ev = ev || window.event;
			if(Lang.IE) {
				if(ev.type === 'readystatechange' && (ev.srcElement !== null && ev.srcElement.readyState !== 'complete')) return;
				ev.target = ev.srcElement;
				ev.pageX = ev.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
				ev.pageY = ev.clientY + document.body.scrollTop + document.documentElement.scrollTop;
			}
			
			if(fn.call(scope, ev, arg) === false) {
				// if event handler returns a boolean false we need to prevent event default behaviour
				if(Lang.IE) {
					ev.returnValue = false;
				}
				if(Lang.NIE) {
					ev.preventDefault();
				}
			}
			
			if(!this._bubble) {
				// this event listener has bubbling not active so we need to stop event propagation
				if(Lang.IE) {
					ev.cancelBubble = true;
				}
				if(Lang.NIE) {
					ev.stopPropagation();					
				}
			}
		}
	};
};
Event.Listener.TYPE = 'Event.Listener';

CustomEvent = function() {
	this._handlers = [];
};

CustomEvent.prototype = {
	subscribe: function(callback, scope) {
		var args = [];
		for(var i = 2; i < arguments.length; i++) {
			args.push(arguments[i]);
		}
		this._handlers.push({callback:callback, scope:scope, args:args});
	},
	
	fire: function() {
		for(var i = 0; i < this._handlers.length; i++) {
			var h = this._handlers[i];
			h.callback.call(h.scope, h.args);
		}
	}
};

/**
 * Register event handler. ... If there is the need for calback argument all
 * parameters must be supplied including scope, which may be null in the case of
 * callback used with a closure.
 * 
 * <code>
 *	ElementWrapper = {
 * 		init: function() {
 * 			this.el = $X(xpath);
 * 			$E.click(this);
 * 		},
 * 
 * 		_onClick: function(ev) {
 * 			// handle click event
 * 		} 
 *	}
 * </code>
 */
Event._add = function(type, o, fn, scope, arg) {
	return arguments.length === 2?
		Event.addListener(type, o.el, o['_on' + type.toCamelCase()], o):
		Event.addListener(type, o, fn, scope, arg);
}

/**
 * Events shorthands.
 */
Event.abort = function(o, fn, scope, arg) { return Event._add('abort', o, fn, scope, arg); };
Event.blur = function(o, fn, scope, arg) { return Event._add('blur', o, fn, scope, arg); };
Event.change = function(o, fn, scope, arg) { return Event._add('change', o, fn, scope, arg); };
Event.click = function(o, fn, scope, arg) { return Event._add('click', o, fn, scope, arg); };
Event.dblclick = function(o, fn, scope, arg) { return Event._add('dblclick', o, fn, scope, arg); };
Event.error = function(o, fn, scope, arg) { return Event._add('error', o, fn, scope, arg); };
Event.focus = function(o, fn, scope, arg) { return Event._add('focus', o, fn, scope, arg); };
Event.keydown = function(o, fn, scope, arg) { return Event._add('keydown', o, fn, scope, arg); };
Event.keypress = function(o, fn, scope, arg) { return Event._add('keypress', o, fn, scope, arg); };
Event.keyup = function(o, fn, scope, arg) { return Event._add('keyup', o, fn, scope, arg); };
// Event.load = function(o, fn, scope, arg) { return Event._add('load', o, fn, scope, arg); };
Event.mousedown = function(o, fn, scope, arg) { return Event._add('mousedown', o, fn, scope, arg); };
Event.mousemove = function(o, fn, scope, arg) { return Event._add('mousemove', o, fn, scope, arg); };
Event.mouseout = function(o, fn, scope, arg) { return Event._add('mouseout', o, fn, scope, arg); };
Event.mouseover = function(o, fn, scope, arg) { return Event._add('mouseover', o, fn, scope, arg); };
Event.mouseup = function(o, fn, scope, arg) { return Event._add('mouseup', o, fn, scope, arg); };
Event.reset = function(o, fn, scope, arg) { return Event._add('reset', o, fn, scope, arg); };
Event.resize = function(o, fn, scope, arg) { return Event._add('resize', o, fn, scope, arg); };
Event.scroll = function(o, fn, scope, arg) { return Event._add('scroll', o, fn, scope, arg); };
Event.select = function(o, fn, scope, arg) { return Event._add('select', o, fn, scope, arg); };
Event.submit = function(o, fn, scope, arg) { return Event._add('submit', o, fn, scope, arg); };
// Event.unload = function(o, fn, scope, arg) { return Event._add('unload', o, fn, scope, arg); };
/**
 * Keyboard utility class.
 */
Keyboard = {
	ENTER: 13,
	ESCAPE: 27,
	
	/**
	 * Set key down event listener.
	 * @param {String|Object} el a DOM element or its id attribute, 
	 * @param {Function} fn event handler, 
	 * @param {Object} scope event handler scope, optional.
	 */
	setListener: function(el, fn, scope) {
		// ensure el is a dom element but not its id
		el = Dom.getEl(el); 
		if(!scope) scope = this;

		el.onkeydown = function(e) {
			var keynum;
			if(Lang.IE) {
				keynum = window.event.keyCode;
			}
			if(Lang.NIE) {
				keynum = e.which;
			}
			fn.call(scope, keynum);
		}
	}	
};
/**
 * Format objects manager.
 */
Format = {
	/**
	 * Register a new formatter.
	 * 
	 * Also initialize formatter empty value. This formatter specific value is
	 * used to replace empty input for optional controls; an empty value for a
	 * required control is considered invalid input. As a rule of thumb an if
	 * target object property is an object empty value is null but for arrays
	 * this format specific empty value is an empty array.
	 */
	register: function(fmt) {
		fmt.emptyValue = fmt._type === 'array'? []: null;
		fmt.test = Format.test;
		fmt.format = Format.format;
		fmt.parse = Format.parse;
	},
	
	test: function(s) {
		new RegExp(this._pattern, 'g').test(s);
	},
	
	format: function(o) {
		if(!o) return '';
		var f = Format['_format_' + this._type];
		if(Lang.isFunction(f)) return f.call(this, o);
	},
	
	/**
	 * Parse a string for specific pattern.
	 * 
	 * @param {String} s source string to be parsed.
	 * @return object created from parsed string or null if string has invalid content.
	 * @type {Object} 
	 * @public
	 */
	parse: function(s) {
		if(this._ignores) {
			var r = new RegExp(this._ignores, 'g');
			s = s.replace(r, '');
		}
		var matches = new RegExp(this._pattern, 'g').exec(s);
		if(!matches) return null;
		var f = Format['_parse_' + this._type];
		if(Lang.isFunction(f)) return f.call(this, matches);
		return null;
	},
	
	_format_string: function(s) {
		if(!this._format) return s;
		var r = /%(?:(\d{0,3}).(\d{0,3}))s/g;
		function flagsProc($0, $1, $2) {
			var start = $1? Number($1): 0;
			var stop = $2? Number($2): s.length;
			return s.substring(start, stop);
		}
		return this._format.replace(r, flagsProc);
	},
	
	_format_date: function(date) {
		pad = function (val, len) {
			val = String(val);
			len = len || 2;
			while (val.length < len) val = "0" + val;
			return val;
		};
	
		var d = date.getDate();
		var D = date.getDay();
		var m = date.getMonth();
		var y = date.getFullYear();
		var H = date.getHours();
		var M = date.getMinutes();
		var s = date.getSeconds();
		var S = date.getMilliseconds();
		var z = date.getTimezoneOffset();
		
		var flags = {
			'%1d': d,
			'%2d': pad(d, 2),
			'%1E': I18N.shortDays[D],
			'%2E': I18N.fullDays[D],
			'%1M': m + 1,
			'%2M': pad(m + 1, 2),
			'%3M': I18N.shortMonths[m],
			'%4M': I18N.fullMonths[m],
			'%1y': String(y).slice(2),
			'%2y': y,
			'%1h': H % 12 || 12,
			'%2h': pad(H % 12 || 12),
			'%1H': H,
			'%2H': pad(H, 2),
			'%1m': M,
			'%2m': pad(M, 2),
			'%1s': s,
			'%2s': pad(s, 2),
			'%1S': pad(S > 99? Math.round(S / 100): S, 1),
			'%2S': pad(S > 9? Math.round(S / 10): S, 2),
			'%3S': pad(S, 3),
			'%1a': H < 12? 'am': 'pm',
			'%2a': H < 12? 'AM': 'PM',
			'%1z': z
		};
	
		var	r = /%[1]z|%[12][dEyhHmsa]|%[123]S|%[1234]M/g;
		// it seems replacer function has $0 parameter set on current match value and $1 to match index
		return this._format.replace(r, function($0) { return flags[$0]; });
	},
	
	_format_array: function(a) {
		return a.join(' ');	
	},
	
	_parse_string: function(matches) {
		return matches[1];
	},
	
	/**
	 * Although it is a parser this method relies on format string in order to map
	 * date components. For this reason both format and parser strings MUST be consistent.  
	 */
	_parse_date: function(matches) {
		var setters = {
			y: 'AdjustedYear',
			M: 'AdjustedMonth',
			E: 'WeekDay',
			d: 'Date',
			h: 'AdjustedHours',
			H: 'Hours',
			m: 'Minutes',
			s: 'Seconds',
			S: 'AdjustedMilliseconds'
		};
		var d = new Date();
		d.setAdjustedYear = function(y) {
			y = Number(y);
			if(y <= 70) y += 2000;
			if(y > 70 && y <= 99) y += 1900 
			return this.setFullYear(y);
		}
		d.setAdjustedMonth = function(m) { 
			var n = Number(m);
			if(!isNaN(n)) return this.setMonth(m - 1);
			// if not a number m must be a valid month name 
			var i = Arrays.getIndex(I18N.shortMonths, m);
			if(i === -1) i = Arrays.getIndex(I18N.fullMonths, m);
			if(i === -1) return false;
			return this.setMonth(i);
		}
		d.setWeekDay = function(d) {
			var i = Arrays.getIndex(I18N.shortDays, d);
			if(i === -1) i = Arrays.getIndex(I18N.fullDays, d);
			if(i === -1) return false;
			// week day is actualy only tested for correctness but not set to date object
			// for this reason we just return date object time, milliseconds from epoch
			return this.getTime(); 			
		}
		d.setAdjustedHours = function(h) {
			if(h === 12) h = 0;
			return this.setHours(h + 12);
		}
		d.setAdjustedMilliseconds = function(ms) {
			var n = Number(ms);
			if(ms.length === 1) n *= 100;
			if(ms.length === 2) n *= 10;
			this.setMilliseconds(n);
		}
		
		var i = 1;
		var r = new RegExp('%[1234](.)', 'g');
		while(f = r.exec(this._format)) {
			if(d['set' + setters[f[1]]](matches[i++]) === false) return null;
		}
		
		return d;
	},
	
	_parse_array: function(matches) {
		var a = [];
		for(var i = 1; i < matches.length; i++) {
			if(matches[i]) a.push(matches[i]);
		}
		return a;		
	}		
};

Format.Default = {
	/**
	 * @public
	 */
	test: function(s) {
		return true;
	},
	
	/**
	 * @public
	 */
	format: function(o) {
		if(!Lang.isNumber(o) && !o) return '';
		return o;
	},
	
	/**
	 * @public
	 */
	parse: function(s) {
		return s;
	}
};

/**
 * Format interface.
 */
Format.Interface = {
	/**
	 * Validity test. 
	 */
	test: function(s) {},
	
	/**
	 * Format object.
	 */
	format: function(o) {},
	
	/**
	 * Parse string value.
	 */
	parse: function(s) {}
};
/**
 * Controls name space. Extensible input elements composition.
 */
Ctrl = {};

Ctrl.SET_TYPE = 'Ctrl.Set';
Ctrl.COLLECTION_TYPE = 'Ctrl.Collection';
Ctrl.CONTROL_TYPE = 'Ctrl.Control';
Ctrl.TEXT_TYPE = 'Ctrl.Text';
Ctrl.TEXTAREA_TYPE = 'Ctrl.TextArea';
Ctrl.SELECT_TYPE = 'Ctrl.Select';
Ctrl.CHECKBOX_TYPE = 'Ctrl.Checkbox';
Ctrl.RADIO_TYPE = 'Ctrl.Radio';
Ctrl.IMAGE_TYPE = 'Ctrl.Image';

/**
 * Control interface. This is really a simple wrapper around an input element
 * basically supporting set and get value operations. Because controls are
 * engineered as a composition this interface applies to both controls set and
 * concrete controls, including user defined.
 * In fact one can create a user defined control just wrapping some DOM element(s)
 * and implementing this interface.
 * @interface
 */
Ctrl.Interface = {
	/**
	 * Set control value. Read given object property identified by local stored
	 * object property path, format it using configured formatter and update this 
	 * control's DOM element value. If property is missing just clear control.
	 * 
	 * Also this method removes error specific CSS class, if any.
	 * 
	 * @param {Object} o object whose property is used for control update.
	 * @public
	 */
	setValue: function(o) {},
	
	/**
	 * Get control value. This method actually save control's value to target object
	 * property, identified by local stored object property path, but do not touch 
	 * any other object property.<br />
	 * 
	 * Uses the same algorithm as @see Ctrl.Interface.test to validate input. If
	 * invalid do not update object property, add specific CSS class and return
	 * boolean false.<br />
	 *  
	 * If control's value is empty and control is optional set object property to
	 * null; however, if object property is an array just clear it. Finnaly, take 
	 * care to not add null values to collections.<br />
	 *  
	 * If target object property is missing just return. Remember that undefined is
	 * treated as false in conditional statements so take care to not confuse invalid
	 * with missing property. Anyway, there is really no point to call this method
	 * with missing object property. <br />
	 * 
	 * Note that this method update object property via a side effect. 
	 * 
	 * @param {Object} o target object.
	 * @return true only if control contains valid data.
	 * @type {Boolean}
	 * @public
	 */
	getValue: function(o) {},
	
	/**
	 * Validation test. Uses configured formatter parse method to actually validate
	 * control's value. A required control with empty value is considered invalid.
	 *  
	 * @return (Boolean} true only if control contains valid data, otherwise false.
	 * @public
	 */
	test: function() {},
	
	/**
	 * Clear content. This interface simply clears control's value. For text based
	 * controls set value to an empty string but generally speaking is up to
	 * implementation to decide the meaning og <i>clear value</i>.
	 */
	clear: function() {}
};

/**
 * Controls set. This is a collection of unique controls.
 */
Ctrl.Set = function(cfg) {
	this._controls = [];
	if(cfg) this.add(cfg);
};

Ctrl.Set.prototype = {
	type: Ctrl.SET_TYPE,

	/**
	 * Add controls to set. This method has two working styles: create controls 
	 * based on a configuration objects array or add an external created control,
	 * usually custom defined.
	 * 
	 * A config object basically describe the mapping between a DOM element and
	 * an object property so that we can transfer data between them. There is a format
	 * object, default to @see Ctrl.DefaultFormat used to format data before actually
	 * writing to DOM element and to parse for validity.
	 * 
	 * Recognized properties:
	 * el {Object} DOM element,
	 * opp {String|Array} object property path; if string converted to array,
	 * fmt {Object} format object; must implement @see Format.Interface
	 * invalid {Number} invalid selected index used by @see Ctrl.Select
	 * required {Boolean} this control is required
	 * optional {Boolean} this control is optional,	take precedence over required if both present
	 * 
	 * @param {Array|Object} configuration objects list or user defined control.
	 * 
	 * Object property path or opp is a string array containing the names of all properties
	 * describing the path through object graph to desired property. It is recursively used
	 * by @see Ctrl.Control._getOP and @see Ctrl.Control._setOP to access specific object property. 
	 * @public
	 */
	add: function() {
		Lang.assert(arguments.length === 1);
		if(!Lang.isArray(arguments[0])) {
			// if actual parameter is not an array it must be a user defined control
			var ctrl = arguments[0];
			this._controls.push(ctrl);			
		}
		else {
			// actual parameter is an array of configuration objects
			var cfg = arguments[0];
			this._preprocessCfg(cfg);
			for(var i = 0; i < cfg.length; i++) {
				this._controls.push(Ctrl.Factory.createCtrl(cfg[i]));			
			}
		}
	},
	
	/**
	 * Set controls collection values. This method actually load all controls from
	 * object properties. Source object is not affected.
	 * 
	 * @param {Object} o source object.
	 * @public
	 */
	setValue: function(o) {
		for(var i = 0; i < this._controls.length; i++) {
			var c = this._controls[i];
			c.setValue(o);
		}
	},
	
	/**
	 * Get controls collection values. This method actually save controls collection 
	 * values to target object properties. Only object properties mapped to controls
	 * may be modified, any other ones like id is preserved. This is one reason this
	 * getter method returns values via side effect on actuall parameter. The second
	 * reason is we use return value to signal validation error. 
	 * 
	 * @param {Object} o target object.
	 * @return true only if all controls contain valid data, otherwise false.
	 * @public
	 */
	getValue: function(o) {
		var valid = true;
		for(var i = 0, l = this._controls.length; i < l; i++) {
			valid = this._controls[i].getValue(o) && valid;
		}
		return valid;	
	},
	
	/**
	 * @public
	 */
	test: function() {
		var valid = true;
		for(var i = 0, l = this._controls.length; i < l; i++) {
			valid = this._controls[i].test() && valid;
		}
		return valid;	
	},
	
	/**
	 * Implementation of @see Ctrl.Interface.clear interface.
	 * @public
	 */
	clear: function() {
		for(var i = 0, l = this._controls.length; i < l; i++) {
			this._controls[i].clear();
		}
	},
	
	/**
	 * @private
	 */
	_preprocessCfg: function(cfg) {
		var options = false, defaults = {}, i = 0;
		if(!cfg[0].opp) {
			// if first item does not have opp it must be controls global options
			options = true;
			defaults = cfg[0];
			i = 1;
		}
		
		for(; i < cfg.length; i++) {
			var c = cfg[i];
			if(c.id) c.el = Dom.getById(c.id);
			if(Lang.isString(c.opp)) c.opp = [c.opp];
			if(!c.fmt) c.fmt = Format.Default;
			for(var d in defaults) {
				if(Lang.isUndefined(c[d])) c[d] = defaults[d];
			}
			// optional take precedence over required, if both present
			if(!Lang.isUndefined(c.optional)) c.required = !c.optional;
			c.required = Boolean(c.required);
		}
		
		if(options) cfg.splice(0, 1);
	}
};

/**
 * Controls collection does not support nested collections.
 */
Ctrl.Collection = function(cfg) {
	this._opp = Lang.isArray(cfg.opp)? cfg.opp: [cfg.opp];
	this._itemCtor = cfg.itemCtor;
	this._lowWater = cfg.lowWater;
	if(Lang.isUndefined(this._lowWater)) this._lowWater = 0;
	this._cache = [];
};

Ctrl.Collection.prototype = {
	type: Ctrl.COLLECTION_TYPE,
	
	setValue: function(o) {
		var a = this._getArray(o);
		var size = a.length;
		if(size < this._lowWater) size = this._lowWater;
		// ensure cache have enough space
		for(var i = this._cache.length; i < size; i++) {
			this._cache.push(new this._itemCtor(this));
		}
		// show only neccesarily cache items
		for(i = 0; i < size; i++) {
			this._cache[i].show(true);
			if(a[i]) this._cache[i].setValue(a[i]);
			else this._cache[i].clear();
		}
		// hide the rest
		for(; i < this._cache.length; i++) {
			this._cache[i].show(false);
		}
	},
	
	/**
	 * Implement @see Ctrl.Interface.getValue.
	 * 
	 * Note that if item is empty, i.e. no input at all in any of its controls, and
	 * controls are not required just add and empty object to target array, <i>empty</i>
	 * meaning an object with all properties set to null.
	 */
	getValue: function(o) {
		var a = this._getArray(o);
		var originalLength = a.length;
		var index = 0;
		var valid = true;
		for(var i = 0; i < this._cache.length; i++) {
			var item = this._cache[i];
			if(!item.visible) continue;
			if(!item.test()) continue;
			if(!a[index]) a[index] = item.createObj();
			valid = item.getValue(a[index]) && valid;
			index++;
		}
		if(!valid) index = originalLength;
		for(i = index; i < a.length; i++) {
			delete a[i];
		}
		a.length = index;
		return valid;
	},
	
	test: function() {
		var valid = true;
		for(var i = 0; i < this._cache.length; i++) {
			valid = this._cache[i].test() && valid;
		}
		return valid;	
	},
	
	clear: function() {
		for(var i = 0, l = this._controls.length; i < l; i++) {
			this._controls[i].clear();
		}
	},
	
	add: function() {
		var maxIdx = this._cache.length - 1;
		var candidateIdx = maxIdx;
		for(var i = candidateIdx; i >= 0; i--) {
			if(this._cache[i].visible) break;
			else candidateIdx = i;
		}
		if(candidateIdx < maxIdx) {
			this._cache[candidateIdx].show(true);
		}
		else {
			this._cache.push(new this._itemCtor(this));
		}
	},
	
	remove: function() {
		for(var i = 0; i < this._cache.length; i++) {
			if(this._cache[i].removable()) this._cache[i].show(false);
		}
	},
	
	_getArray: function(o, i) {
		if(Lang.isUndefined(i)) i = 0;
		if(i < this._opp.length) o = this._getArray(o[this._opp[i++]], i);
		Lang.assertArray(o);
		return o;
	}
};

Ctrl.Item = function(cfg) {
	this.visible = true;
	this._set = new Ctrl.Set(cfg);
};

Ctrl.Item.prototype = {
	setValue: function(o) {
		// give subclass the oportunity to clean-up private elements
		if(this._onClear) this._onClear();
		this._set.setValue(o);
	},
	
	getValue: function(o) {
		return this._set.getValue(o);
	},
	
	test: function() {
		return this._set.test();
	},
	
	clear: function() {
		this._set.clear();
		if(this._onClear) this._onClear();
	},
	
	createObj: function() {
		return Ctrl.Factory.createObj(this._set);
	},
	
	removable: function() {
		return true;	
	},
	
	show: function(visible) {
		if(this.visible === visible) return;
		this.visible = visible;
		if(!visible) this.clear();
		if(this._onShow) this._onShow(visible);
	},
	
	destroy: function() {
		Arrays.removeItems(this._set);
		if(this._onDestroy) this._onDestroy();
	}
};

/**
 * Control base class. Implements common data and method to access object property.
 * @param cfg configuration object.
 */
Ctrl.Control = function(cfg) {
	this._el = cfg.el;
	this._opp = cfg.opp;
	this._fmt = cfg.fmt;
	this._required = cfg.required;
	this._emptyValue = this._fmt.emptyValue;
	if(Lang.isUndefined(this._emptyValue)) this._emptyValue = null;
};

Ctrl.Control.prototype = {
	type: Ctrl.ABSTRACT_TYPE,
	
	/**
	 * Set control value.
	 * @see Ctrl.Interface.setValue
	 */
	setValue: function(o) {
		Dom.removeClass(this._el, 'invalid'); 
		Dom.removeClass(this._el, 'optional'); 
		var v = this._getOP(o, this._opp);
		if(Lang.isUndefined(v)) {
			this._clear();
			return;
		}
		if(this._fmt) v = this._fmt.format(v);
		this._write(v);
	},
	
	/**
	 * Get control value. 
	 * @see Ctrl.Interface.getValue
	 */
	getValue: function(o) {
		var v = this._read();
		if(Lang.isUndefined(v)) return false;
		this._setOP(o, this._opp, v);
		return true;
	},
	
	/**
	 * Validation test. 
	 * @see Ctrl.Interface.test
	 */
	test: function() {
		return this._read() !== null;
	},
	
	clear: function() {
		Dom.removeClass(this._el, 'invalid'); 
		Dom.removeClass(this._el, 'optional'); 
		this._clear();	
	},
	
	/**
	 * Write control's value. A derived object might override this method if special
	 * treatment is needed.
	 * @protected
	 */
	_write: function(v) {
		this._el.value = v;
	},
	
	/**
	 * Read control's value. Read and validate value from attached DOM input element.
	 * A derived object might override this method if special treatment is needed.
	 * 
	 * @return control's value, formatter specific empty value if input is empty or
	 * undefined if input is invalid. Note that an empty input for a required control
	 * is considered invalid.<br />
	 * For a description of formatter specific empty value @see Format.register.
	 * @protected
	 */
	_read: function() {
		var v = this._el.value;
		if(!v) {
			if(this._required) {
				Dom.addClass(this._el, 'invalid');
				return;
			}
			Dom.addClass(this._el, 'optional');
			return this._emptyValue;
		}
		v = this._fmt.parse(v); // parser returns null for invalid value
		if(v !== null) return v; 
		Dom.addClass(this._el, 'invalid');
	},
	
	/**
	 * Clear control's value. A derived object might override this method if special
	 * treatment is needed.
	 * @protected
	 */
	_clear: function() {
		this._el.value = '';
	},
	
	/**
	 * Get object property. Get the value of object property designated by object 
	 * property path - opp. Actually opp is an array of properties names describing
	 * a path in object graph; this method traverse it from left to right 
	 * recursively, applying [] operator. 
	 * <pre>
	 * var car {
	 *   model: 'Opel',
	 *   engine: {
	 *     manufacturer: { name: 'ECO' }
	 *     horsePower: 75
	 *   },
	 *   wheels: [ { pressure: 2.1 }, { pressure: 2.1 }, { pressure: 1.9 }, { pressure: 1.9 } ]  	    
	 * }
	 * some opp example:
	 * ['wheels', 2, 'pressure'] -  pressure for third tyre
	 * ['engine', 'horsePower'] - engine horse power
	 * ['engine', 'manufacturer', 'name'] - engine manufacturer name
	 * </pre>
	 * Considering first example at first iteration we have o['wheels'], at second
	 * (o['wheels'])[2] and at the last ((o['wheels'])[2])['pressure'] which returns 1.9 . 
	 * 
	 * @param {Object} o source object.
	 * @param {Object} opp object property path.
	 * @return object property value or undefined if that property doesn't exist.
	 * @protected
	 */
	_getOP: function(o, opp, i) {
		// i parameter is not used by invoker of this method
		// it is only used internaly as an opp index
		if(Lang.isUndefined(i)) i = 0;
		if(o === null) return;
		if(Lang.isUndefined(o)) return;
		// iterate till opp end
		if(i < opp.length) o = this._getOP(o[opp[i++]], opp, i);
		return o;
	},
	
	/**
	 * Set object property. Object property is identified by its object property
	 * path - opp. For a description of opp @see Ctrl.Control._getOP. This method
	 * traverses object graph in the same manner as Ctrl.Control._getOP counterpart
	 * but stops exactly before last element from path then apply assignment
	 * operator as usual. Anyway, an assertion is thrown if object property is missing.<br /> 
	 * Considering car example from Ctrl.Control._getOP to set third type pressure this
	 * method recursively iterate to o['wheels'][2] then apply assignment like this: 
	 * (o['wheels'][2])['pressure'] = value;  
	 *  
	 * @param {Object} o target object,
	 * @param {Object} opp object property path,
	 * @param {Object} v value to be assigned.
	 * @protected
	 */
	_setOP: function(o, opp, v, i) {
		// i parameter is not used by invoker of this method
		// it is only used internaly as an opp index
		if(Lang.isUndefined(i)) i = 0;
		if(o === null) return;
		if(Lang.isUndefined(o)) return;
		Lang.assertDefined(o[opp[i]]);
		// iterate till opp right most element
		if(i < opp.length - 1) o = this._setOP(o[opp[i++]], opp, v, i);
		else o[opp[i]] = v;
	}
};

/**
 * Constructs a plain text field control. Uses properties from configuration object
 * to initialize itself.
 * @param {Object} cfg configuration object. Recognized configuration properties:<ul>
 * <li>id - DOM element id</li>
 * <li>opp - attached object property path</li>
 * <li>required - optional, default to true</li>
 * </ul>
 *  
 * @class Plain text field. 
 * <p>This control is an input of type text and store plain text,
 * meaning there is no default format or parse step when convey data between this
 * control and attached object property.<br />
 * Anyway, validity check is still performed. If this control value is empty and
 * control is required there is and error.</p>
 */
Ctrl.Text = function(cfg) {
	Ctrl.Control.call(this, cfg);
};

Ctrl.Text.prototype = {
	type: Ctrl.TEXT_TYPE
};
Lang.extend(Ctrl.Text, Ctrl.Control);

/**
 * Text area control.
 */
Ctrl.TextArea = function(cfg) {
	Ctrl.Control.call(this, cfg);
};

Ctrl.TextArea.prototype = {
	type: Ctrl.TEXTAREA_TYPE
};
Lang.extend(Ctrl.TextArea, Ctrl.Control);

Ctrl.Checkbox = function(cfg) {
	Ctrl.Control.call(this, cfg);
};

Ctrl.Checkbox.prototype = {
	type: Ctrl.CHECKBOX_TYPE,

	/**
	 * Override @see Ctrl.Control._write. Reference implementation uses DOM
	 * element's value property whereas checkbox updates the checked.
	 */
	_write: function(v) {
		this._el.checked = v;
	},
	
	/**
	 * Override @see Ctrl.Control._read. Reference implementation uses DOM
	 * element's value property whereas checkbox uses the checked.
	 */
	_read: function() {
		return this._el.checked;
	},
	
	/**
	 * Override Ctrl.Control._clear. Deselect this checkbox, that is set checked
	 * property to false.
	 */
	_clear: function() {
		this._el.checked = false;
	}
};
Lang.extend(Ctrl.Checkbox, Ctrl.Control);

Ctrl.Radio = function(cfg) {
	Ctrl.Control.call(this, cfg);
};

Ctrl.Radio.prototype = {
	type: Ctrl.RADIO_TYPE
};
Lang.extend(Ctrl.Radio, Ctrl.Control);

Ctrl.Select = function(cfg) {
	Ctrl.Control.call(this, cfg);
	this._invalidIndex = cfg.invalidIndex;
};

Ctrl.Select.prototype = {
	type: Ctrl.SELECT_TYPE,
	
	/**
	 * Override @see Ctrl.Control._read. Get selected value and trim spaces. If
	 * invalid index option exists check for validity; value is invalid if selected
	 * index equals invalid index option.
	 */
	_read: function() {
		var v = this._el.value;
		v = v.replace(/^\s+|\s+$/, '');
		if(this._el.selectedIndex === this._invalidIndex) {
			Dom.addClass(this._el, this._required? 'invalid': 'optional');
			if(this._required) return null;
		}
		return v;
	},
	
	/**
	 * Override @see Ctrl.Control._clear. Just select the first option.
	 */
	_clear: function() {
		this._el.selectedIndex = 0;
	}
};
Lang.extend(Ctrl.Select, Ctrl.Control);

Ctrl.Image = function(cfg) {
	Ctrl.Control.call(this, cfg);
	this._invalid = cfg.invalid;
};

Ctrl.Image.prototype = {
	type: Ctrl.IMAGE_TYPE,

	_write: function(v) {
		this._el.src = v;
	},
	
	_read: function() {
		return this._el.src;
	},
	
	_clear: function() {
		this._el.src = '';
	}
};
Lang.extend(Ctrl.Image, Ctrl.Control);

/**
 * Creates a control wrapper. Concrete control object depends on element tag name
 * and type as depicted in the table below:
 * <pre>
 * tag      | type       | control
 * ---------|------------|--------------------
 * input    | text       | Ctrl.Text
 * textarea | textarea   | Ctrl.TextArea
 * input    | checkbox   | Ctrl.Checkbox
 * input    | radio      | Ctrl.Radio
 * select   | select-one | Ctrl.Select
 * img      | null       | Ctrl.Image
 * </pre>
 */
Ctrl.Factory = {
	_map: [
		[ 'input', 'text', Ctrl.Text ],
		[ 'input', 'password', Ctrl.Text ],
		[ 'textarea', 'textarea', Ctrl.TextArea ],
		[ 'input', 'checkbox', Ctrl.Checkbox ],
		[ 'input', 'radio', Ctrl.Radio ],
		[ 'select', 'select-one', Ctrl.Select ],
		[ 'img', null, Ctrl.Image ]
	],

	/**
	 * Create an <i>empty</i> object for get value operation. Ensure all object
	 * property path are resolved, i.e. there is a corresponding property into
	 * object. Note that <i>empty</i> object means that all properties are present
	 * but without any values.<br />
	 * This method assume classical use of arrays and objects: if property name is a
	 * number consider it an index and create an array, otherwise create an object.
	 * 
	 * @param {Object} controls set.
	 * @public  
	 */
	createObj: function(set, object) {
		var controls = set._controls;
		if(!object) object = {};
		for(var i = 0, il = controls.length; i < il; i++) {
			var c = controls[i];
			if(c.type === Ctrl.SET_TYPE) this.createObj(c, object);
			var opp = c._opp;
			if(Lang.isUndefined(opp)) continue;
			if(c.type === Ctrl.COLLECTION_TYPE) {
				object[opp] = [];
				continue;
			}
			var o = object;
			for(var j = 0, jl = opp.length; j < jl; j++) {
				if(!o[opp[j]]) {
					var index = parseInt(opp[j+1]);
					o[opp[j]] = isNaN(index)? {}: []; 
				}
				o = o[opp[j]];	
			}
		}
		return object;
	},
	
	/**
	 * Create a control suitable for specified tag name and sub-type.
	 * @member Factory
	 * @param {Object} cfg config object. It must have id and el properties.
	 */
	createCtrl: function(cfg) {
		Lang.assertDefined(cfg.el);
		
		// every control remove 'invalid' and 'optional' classes on click
		Event.addListener(cfg.el, 'click', function() { 
			Dom.removeClass(cfg.el, 'invalid'); 
			Dom.removeClass(cfg.el, 'optional'); 
		});
		
		var tag = Dom.getTag(cfg.el);
		for(var i = 0; i < this._map.length; i++) {
			if(tag !== this._map[i][0]) continue;
			if(this._map && cfg.el.type !== this._map[i][1]) continue;
			return new this._map[i][2](cfg);
		}
	}
};
View = function(meta) {
	if(Lang.isArray(meta)) return new View.Object(meta);
	if(Lang.isObject(meta)) return new View.Array(meta);
};

/**
 * @interface
 */
View.Interface = {
	/**
	 * 
	 */
	setValue: function(o) {}
};

View._defaultWriter = function(value) {
	this.el.innerHTML = value;		
};
	
View._imageWriter = function(url) {
	Dom.setAttribute(this.el, 'src', url);
};
	
View._map = {
	img: View._imageWriter
};
	
View.getWriter = function(el) {
	var fn = this._map[Dom.getTag(el)];
	if(!fn) fn = View._defaultWriter; 
	return {
		el: el,
		write: fn 
	}
};
	
View.getOP = function(o, opp, i) {
	// i parameter is not used by invoker of this method
	// it is only used internaly as an opp index
	if(Lang.isUndefined(i)) i = 0;
	if(o === null) return;
	if(Lang.isUndefined(o)) return;
	// iterate till opp end
	if(i < opp.length) o = View.getOP(o[opp[i++]], opp, i);
	return o;
};	

View.Template = function(id) {
	this.parent = Dom.getParent(id);
	this._fragment = Dom.cloneNode(id);
};

View.Template.prototype = {
	createElement: function() {
		var el = Dom.cloneNode(this._fragment);
		Dom.appendChild(this.parent, el);
		return el;
	}	
};

View.Object = function(meta) {
	Lang.assertArray(meta);
	for(var i = 0; i < meta.length; i++) {
		var m = meta[i];
		m.el = Dom.getById(m.id);
		Lang.assertExists(m.el);
		if(Lang.isString(m.opp)) m.opp = [m.opp];
		for(var j = 0; j < m.opp.length; j++) {
			if(Lang.isString(m.opp[j])) m.opp[j] = m.opp[j].split('.');
		}
		if(!m.fmt) m.fmt = Format.Default;
	}
	this._meta = meta;
};

View.Object.prototype = {
	setValue: function(o) {
		for(var i = 0; i < this._meta.length; i++) {
			var m = this._meta[i];
			if(m.template) {
				// if this meta config object has template property it must be a collection descriptor
				// object property must be an array and object property path must be unique
				Lang.assert(m.opp.length === 1); 
				var array = View.getOP(o, m.opp[0]);
				Lang.assertArray(array);
				var view = new View.Array(m);
				view.setValue(array);
			}
			else {
				// ordinarily object property metadata; just write the value  
				var args = [];
				for(var j = 0; j < m.opp.length; j++) {
					var v = View.getOP(o, m.opp[j]);
					if(Lang.isUndefined(v) || v === null) continue;
					args.push(v);
				}
				View.getWriter(m.el).write(m.fmt.format.apply(m.fmt, args));
			}
		}
	}
};

View.Array = function(meta) {
	this._opp = meta.opp;
	if(Lang.isString(meta.template)) meta.template = new View.Template(meta.template);
	this._template = meta.template;
	this._parent = meta.template.parent;
	Lang.assertExists(this._template);
	this._meta = meta.meta;	
};

View.Array.prototype = {
	setValue: function(array) {
		Dom.removeChildren(this._parent);
		for(var i = 0; i < array.length; i++) {
			var el = this._template.createElement();
			Dom.setUserObject(el, array[i]);
			
			if(!this._meta) {
				// if there is no configured metadata, array element must be a primitive
				Lang.assertPrimitive(array[i]);
				View.getWriter(el).write(array[i]);
			}
			else {
				// we have metadata describing a new view object
				Lang.assertObject(this._meta);
				new View.Object(this._meta).setValue(array[i]);
			}
			
			// remove all ids after value has been properly initialized
			Dom.removeAttribute(el, 'id', true);
		}
	}
};
/**
 * RPC package. Remote Procedure Call package gathers objects used for asynchronous
 * communications with the server, RPC.Request being the relevant one.<br />
 * 
 * At application level, communication with the server obey request/response paradigm
 * using objects for both sides. Objects serialization depends on selected engine; 
 * e.g. RPC.DWR uses an proprietary format and RPC.JSON uses obviously JSON. Before
 * actually using RPC package objects one must select the engine, @see RPC.setEngine.<br />
 * 
 * On the other hand we need a mean to address the remote method, i.e. procedure.
 * But various server side codes, using different languages may implement different
 * naming conventions. For example Java uses camel-case like <em>updateUserAccount</em>
 * whereas Json uses underscore and all lower case like <em>update_user_account</em>.
 * In order to hide this naming particularities we use a remote method ID properly
 * initialized; e.g. RPC.UPDATE_USER_ACCOUNT = 'UserFacade.update_user_account'.<br />
 * 
 * Finally, some configurations need to set server RPC controller path, @see RPC.setPath.<br />
 * 
 * Bellow are two sample configurations: first uses JSON serialization and uses Json
 * naming convention whereas the second is a DWR implementation.
 * <pre>
 * RPC.setEngine(RPC.JSON);
 * RPC.setPath('/wikipages/cgi-bin/rpc-service.rb');
 * RPC.LOAD_PROFILE_PAGE = 'ProfileFacade.load_profile_page';
 * RPC.SAVE_PROFILE_PAGE = 'ProfileFacade.save_profile_page';
 * 
 * RPC.selectEngine(RPC.DWR);
 * RPC.LOAD_PROFILE_PAGE = ProfileFacade.loadProfilePage;
 * RPC.SAVE_PROFILE_PAGE = ProfileFacade.saveProfilePage;
 * </pre>
 * Note that DWR engine remote method ID is in fact DWR generated javascript stub. We
 * suggest using a single file named RPC.js for engine selection and remote method ID
 * initialization. This way application can switch engine changing one single file.
 */
RPC = {};

/** Engine IDs. */
RPC.DWR = 1;
RPC.JSON = 2;

RPC._debugMode = false;

RPC._debugProc = function() {
	var fakeDuration = 20 + 500 * Math.random();
	var t = this;
	Timer.call(fakeDuration, function() {
		if(t._callback) t._callback.call(t._scope, t._debugData);
	});
};

/**
 * Debug mode. If active...
 */
RPC.setDebugMode = function() {
	RPC._debugMode = true;
	RPC._DwrRequest.prototype.send = RPC._debugProc;
	RPC._JsonRequest.prototype.send = RPC._debugProc;
	RPC.Upload.prototype.start = RPC._debugProc;
};

RPC._isDebugMode = function(impl, rmId) {
	if(RPC._debugMode) {
		// in debug mode rmId is debug data to be returned not json supplied by application code
		impl._debugData = rmId;
		return true;
	}	
};

/**
 * Set RPC engine. This function actually selects serialization format by literally 
 * branching RPC package code considering selected engine ID. Invalid engine ID is
 * simply ignored.
 * 
 * @param {Number} engineId, engine ID, must be a defined 'constant'.
 */
RPC.setEngine = function(engineId) {
	switch(engineId) {
		case RPC.DWR:
			RPC.Request = RPC._DwrRequest;
			break;
		case RPC.JSON:
			RPC.Request = RPC._JsonRequest;
			break;
		default:
			// bad engine ID is ignored
	}
};

/**
 * Set request path. All requests are sent to single RPC controller which creates the
 * proper context and excutes remote method. Note that not all RPC engines use this
 * property; for example DWR has its own hard coded path.
 */
RPC.setRequestURI = function(uri) {
	RPC._requestURI = uri;
};

/**
 * Set upload URI. Take a look at @see RPC.IUpload for rationale of using relative paths.
 */
 RPC.setUploadURI = function(uri) {
	RPC._uploadURI = uri; 	
};

/**
 * Server request. This interface abstracts a server request/response exchange. Invoker
 * must create a new request supplying remote method ID, set callback and/or arguments
 * and simply send it. But first must properly initialiaze RPC engine.<br />
 * An example would help understand:
 * <pre>
 *		RPC.setEngine(RPC.JSON);
 *		RPC.setRequestURI('cgi-bin/rpc.rb');
 *		RPC.UPATE_USER = 'UserFacade.update_user'
 * 		...
 *		var req	= RPC.Request(RPC.UPDATE_USER);
 *		req.setArguments(id, name, surname, email);
 *		req.setCallback(callback);
 *		req.send();
 * </pre>
 * 
 * If callback is missing invoker doesn't care about successfully request fulfilling but
 * relies on exception rised by request object on fail.
 * 
 * @interface
 */
RPC.IRequest = {
	/**
	 * Contruct a new request.
	 * 
	 * When create a new request we need a way to identify targeted remote method
	 * but various server side codes, using different languages may implement different
	 * naming conventions. For example Java uses camel-case like <em>updateUser</em>
	 * whereas Json uses underscore and all lower case like <em>update_user</em>.
	 * In order to hide this naming particularities we use a remote method ID 
	 * properly initialized; e.g. RPC.UPDATE_USER = 'UserFacade.update_user'.<br />
	 * That is to say, constructor expects a properly initialized RPC ID. 
	 * 
	 * @param {Object} rmId, remote method ID. 
	 */
	constructor: {},
	
	/**
	 * Set remote procedure arguments.
	 * 
	 * @param {...} vargs, variable number of arguments. The type and order must
	 * be consistent with remote procedure formal parameters list.
	 */
	setArguments: {},
	
	/**
	 * Set request callback.
	 * 
	 * @param {Function} callback to be executed when response from server is available.
	 * @param {Object} optional scope. If scope is not defined callback is executed
	 * in this request object scope, useful for anonymous function based on closure
	 * to access calling object scope.
	 */
	setCallback: {},
	
	/**
	 * Send request to server.
	 */
	send: {}
};

/**
 * Asyncrhonous files upload.
 * 
 * <pre>
 * 		RPC.setUploadURI('cgi-bin/upload.rb');
 * 		...
 *		var upload = new RPC.Upload();
 *		upload.setForm(form);
 *		upload.setCallback(callback, scope);
 *		upload.start();
 * </pre>
 * 
 * For now there is no support for progress information.
 * 
 * Important notes: 
 * 1. Because <em>asynchronous</em> feat is implemented with hidden iframe used as
 * form target, server response content type must be text/html; specifically we can't
 * use application/json. Otherwise browser will try to open server response instead
 * to pass it to hidden iframe - as a consequence iframe on load event is not triggered.
 * 2. Browser security doesn't allow accessing a child frame document if it's loaded
 * from a different domain. For this reason do not try to set upload URI to different
 * domain, our recommendation beeing to use relative path, as in example above. 
 * 
 * @interface
 */
RPC.IUpload = {
	/**
	 * Set form to be uploated. Although the form may have arbitrary controls it
	 * is recommended to use rpc upload only for files but the form may have
	 * multiple <em>file</em> inputs. For non-file controls use @see Ctrl package. 
	 * 
	 * @param {String|Object} form ID or DOM element.
	 */
	setForm: function(form) {},
	
	/**
	 * Set request callback.
	 * 
	 * @param {Function} callback to be executed on upload complete.
	 * @param {Object} optional scope. If scope is not defined callback is executed
	 * in this upload object scope, useful for anonymous function based on closure
	 * to access calling object scope.
	 */
	setCallback: function(callback, scope) {},
	
	/**
	 * Start files uploading.
	 */
	start: function() {}
};

RPC._AbstractRequest = function() {
	this._arguments = [];	
};

RPC._AbstractRequest.prototype = {
	setCallback: function(callback, scope) {
		this._callback = callback;
		this._scope = scope? scope: this;
	},

	setArguments: function() {
		this._arguments = Arrays.clone(arguments);
	}	
};

/**
 * DWR request.
 * @see RPC.IRequest.constructor
 */
RPC._DwrRequest = function(rmId) {
	RPC._AbstractRequest.call(this);
	if(RPC._isDebugMode(this, rmId)) return; 
	// for DWR request remote method ID is in fact DWR generated stub
	Lang.assertFunction(rmId);
	this._stub = rmId;	
}

RPC._DwrRequest.prototype = {
	send: function() {
		var t = this;
		var callbackProxy = function(response) {
			if(t._callback) t._callback.call(t._scope, response);
		};
		var errorHandlerProxy = function(e) {
			// TODO: upgrade to dwr2 and use stack list on details
			Alert(e);
		};
		var metadata = {
			async: true,
			callback: callbackProxy,
			// TODO: use a global error handler instead of per transaction one
			errorHandler: errorHandlerProxy				
		};

		try {
			var a = Arrays.clone(t._arguments);
			a.push(metadata);
			t._stub.apply(t._stub, a);			
		}
		catch(e) {
			Alert(e);
		}
	}	
};
Lang.extend(RPC._DwrRequest, RPC._AbstractRequest);

RPC._JsonRequest = function(rmId) {
	RPC._AbstractRequest.call(this);
	if(RPC._isDebugMode(this, rmId)) return; 
	// for JSON request remote method ID is a string like 'ProfileFacade.load_profile_page'
	Lang.assertString(rmId);
	var a = rmId.split('.');
	this._object = a[0];
	this._method = a[1];	
};

RPC._JsonRequest.prototype = {
	send: function() {
		var request = {
			object: this._object,
			method: this._method,
			arguments: this._arguments
		};
		var jsonRequest = JSON.encode(request);
		
		var t = this;
		var xhr = new RPC._XhrRequest();
		var onReadyStateChange = function() {
			var ready = xhr.readyState;
			if(ready === RPC._XhrRequest.RS_COMPLETE) {
				// TODO: DNRY - consider a single hanlder for both json request and upload callbacks
				var jsonResponse = xhr.responseText;	
				var response = jsonResponse? JSON.decode(jsonResponse): {};
				if(response) {
					if(response.code != 200) Alert('RPC error: ' + response.data);
					else {
						if(t._callback) t._callback.call(t._scope, response.data);
					}
				}
			}
		}
		
		xhr.onreadystatechange = onReadyStateChange;
		xhr.open('POST', RPC._requestURI, true);
		xhr.setRequestHeader('Accept', 'application/json');
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.setRequestHeader('Connection', 'close');
		xhr.send(jsonRequest);
	}
};
Lang.extend(RPC._JsonRequest, RPC._AbstractRequest);

RPC._XhrRequest = function() {
	return new XMLHttpRequest();
};

RPC._XhrRequest.RS_UNINITIALIZED = 0;
RPC._XhrRequest.RS_LOADING = 1;
RPC._XhrRequest.RS_LOADED = 2;
RPC._XhrRequest.RS_INTERACTIVE = 3;
RPC._XhrRequest.RS_COMPLETE = 4;

RPC._MsXhrRequence = function() {
	return new ActiveXObject('Microsoft.XMLHTTP');
};
 
(
	function() {
		if(!window.XMLHttpRequest) RPC._XhrRequest = RPC._MsXhrRequest;
	}
)();

/**
 * Implements @see RPC.IUpload interface.
 */
RPC.Upload = function(rmId) {
	if(RPC._isDebugMode(this, rmId)) return; 
	// remote method ID is a string like 'ProfileFacade.upload_picture'
	var a = rmId.split('.');
	this._object = a[0];
	this._method = a[1];	
};

RPC.Upload.prototype = {
	setForm: function(form) {
		this._form = Dom.getEl(form);
	},
	
	setCallback: function(callback, scope) {
		this._callback = callback;
		this._scope = scope? scope: this;		
	},
	
	start: function() {
		this._setUp();
		this._form.submit();
		
		var t = this;
		var callback = function() {
			// TODO: DNRY - consider a single hanlder for both json request and upload callbacks
			var jsonResponse = t._iframe.contentWindow.document.body.innerHTML;
			if(!jsonResponse) return;
			var response = jsonResponse? JSON.decode(jsonResponse): {};
			if(response) {
				if(response.code != 200) Alert('RPC error: ' + response.data);
				else {
					if(t._callback) t._callback.call(t._scope, response.data);
				}
			}
			t._tearDown();
		};
		this._listener = new Event.Listener();
	 	this._listener.setTarget(this._iframe, 'load');
	 	this._listener.setHandler(callback);
	 	Event.addListener(this._listener);
	},
	
	_setUp: function() {
		this._iframeId = Dom.getId();
		this._iframe = Dom.IFrame({id:this._iframeId,name:this._iframeId,src:'about:blank'});
		Dom.setStyles(this._iframe, {
			position: 'absolute',
			top: '-1000px',
			left: '-1000px'
		});
		Dom.appendChild(this._iframe);

		Dom.setAttributes(this._form, {
			action: RPC._uploadURI,
			method: 'POST',
			target: this._iframeId
		});
		var enctype = 'multipart/form-data';
		if(Lang.IE) {
			Dom.setAttribute(this._form, 'encoding', enctype);
		}
		if(Lang.NIE) {
			Dom.setAttribute(this._form, 'enctype', enctype);
		}
		
		var els = Dom.getByTag(this._form, 'input');
		for(var i = 0, fidx = 0; i < els.length; i++) {
			if(els[i].getAttribute('type') === 'file') els[i].setAttribute('name', 'file' + fidx++);	
		}
		this._metas = [];
		this._metas.push(Dom.Input({type:'hidden',name:'object',value:this._object}));
		this._metas.push(Dom.Input({type:'hidden',name:'method',value:this._method}));
		Dom.appendChildren(this._form, this._metas);
	},
	
	_tearDown: function() {
		Event.removeListener(this._listener);
		Dom.removeChildren(this._form, this._metas);
		Timer.setTimeout(100, this._selfDestroy, this);
	},
	
	_selfDestroy: function() {
		document.body.removeChild(this._iframe);
	}
};

JSON = {
	REX_ISO8601: /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})Z$/i,
	REX_DECODE_ESCAPE: /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
	REX_ENCODE_ESCAPE: /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
	ESCAPE_CHAR: {
		'\b': '\\b',
		'\t': '\\t',
		'\n': '\\n',
		'\f': '\\f',
		'\r': '\\r',
		'"' : '\\"',
		'\\': '\\\\'
	},
	
	encode: function(object) {
		return this._serialize('', {'': object});
    },

	decode: function(json) {
		var postProcees = function(holder, key) {
			// walking through object graph
			var k, v, value = holder[key];
			if(value && typeof value === 'object') {
			    for(k in value) {
					if(Object.hasOwnProperty.call(value, k)) {
						v = postProcees(value, k);
			            if(v !== undefined) value[k] = v;
			            else delete value[k];
			        }
			    }
			}
			
			// post processing code here
			
			// for now just search for ISO8601 date format and convert into Date object
			if(!Lang.isString(value)) return value;
			var m = value.match(JSON.REX_ISO8601);
			if(!m) return value;
			if(m.length != 7) return value;
			var t = Date.UTC(m[1], m[2]-1, m[3], m[4], m[5], m[6]);
			return new Date(t);
		};
		
		JSON.REX_DECODE_ESCAPE.lastIndex = 0;
		if(JSON.REX_DECODE_ESCAPE.test(json)) {
			var replacer = function(m) {
		        return '\\u' + ('0000' + m.charCodeAt(0).toString(16)).slice(-4);
			};
		    json = json.replace(JSON.REX_DECODE_ESCAPE, replacer);
		}
		
		if(/^[\],:{}\s]*$/.test(json.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
			replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
			replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) 
		{
			var object = eval('(' + json + ')');
			return postProcees({'': object}, '');
		}
    },
	
    _quote: function(string) {
        JSON.REX_ENCODE_ESCAPE.lastIndex = 0;
        if(!JSON.REX_ENCODE_ESCAPE.test(string)) return '"' + string + '"';
        var replacer = function(m) {
			var c = JSON.ESCAPE_CHAR[m];
			return typeof c === 'string'? c: '\\u' + ('0000' + m.charCodeAt(0).toString(16)).slice(-4);
        }; 
        return '"' + string.replace(JSON.REX_ENCODE_ESCAPE, replacer) + '"';
    },

    _serialize: function(key, holder) {
        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            partial,
            value = holder[key];
            
		if(value === null || Lang.isUndefined(value)) return 'null';
        if(typeof value.toJSON === 'function') value = value.toJSON(key);
		
        switch(typeof value) {
        case 'string':
            return this._quote(value);
            
        case 'number':
            return isFinite(value)? String(value): 'null';
            
        case 'boolean':
        case 'null':
            return String(value);

        case 'object':
        	partial = [];
        	
            if(Object.prototype.toString.apply(value) === '[object Array]') {
                for(i = 0; i < value.length; i++) {
                    partial[i] = this._serialize(i, value) || 'null';
                }
                return partial.length? '[' + partial.join(',') + ']':  '[]';
            }

            for(k in value) {
                if(Object.hasOwnProperty.call(value, k)) {
                    v = this._serialize(k, value);
                    if(v) partial.push(this._quote(k) +  ':' + v);
                }
            }
            return partial.length? '{' + partial.join(',') + '}': '{}';
        }
    }
};

(
	/**
	 * Augment primitive types with support for JSON encoding.
	 */
	function() {
	    function f(n) { return n < 10? '0' + n: n; }

        Date.prototype.toJSON = function() {
            return this.getUTCFullYear()   + '-' +
                 f(this.getUTCMonth() + 1) + '-' +
                 f(this.getUTCDate())      + 'T' +
                 f(this.getUTCHours())     + ':' +
                 f(this.getUTCMinutes())   + ':' +
                 f(this.getUTCSeconds())   + 'Z';
        };
        String.prototype.toJSON =
        Number.prototype.toJSON =
        Boolean.prototype.toJSON = function() { return this.valueOf();  };
	}
)();
I18N = {
	// months and week days names, short and full version
	shortDays:[ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ],
	fullDays:[ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ],
	shortMonths: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ],
	fullMonths:[ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ],

	// error messages
	invalidPageError: 'Invalid page object.',
	fatalError: 'Critical error! Reload the page, if error persists please contact administrator.'
};
/**
 * Browser support for cookie.
 */
Cookie = {
	INFINITE: new Date('Mar 15, 2064 00:00:00'),
	
	/**
	 * Create or update a cookie.
	 * 
	 * @param {String} name
	 * @param {String} value
	 * @param {Date} expires. If missing cookie will expire at session end,
	 * @param {String} path, default to current document path,
	 * @param {String} domain name, default to current document domain,
	 * @param {Boolean} secure, default to false. If true cookie transmission requires HTTPS.
	 */
	set: function(name, value, expires, path, domain, secure) {
		Lang.assert(value);
		//if(!path) path = '/';
		document.cookie = name + '=' + escape(value) +
			(expires? '; expires=' + expires.toGMTString(): '') +
		 	(path? '; path=' + path: '') +
		 	(domain? '; domain=' + domain: '') +
		 	(secure? '; secure': '');
	},
	
	/**
	 * Get cookie value. Return cookie value or null if cookie not found.
	 * @param {String} name,
	 * @param {String} value, optional value returned on missing cookie,
	 * @param {Date} expires, optional expires date used only on missing cookie.
	 */
	get: function(name, value, expires) {
		 var arg = name + '=';
		 var len = document.cookie.length;
		 var i = 0;
		 while(i < len) {
			 var j = i + arg.length;
			 if(document.cookie.substring(i, j) == arg) {
				var k = document.cookie.indexOf (';', j);
				if(k == -1) k = len;
				return unescape(document.cookie.substring(j, k));
			 }
			 i = document.cookie.indexOf(' ', i) + 1;
			 if(!i) break;
		 }
		 if(value) {
		 	Cookie.set(name, value, expires);
		 	return value;
		 }
		 return null;
	},
	
	/**
	 * Delete a cookie. This method sets cookie's expiration date to epoch.
	 * @param {String} name
	 * @param {String} path
	 * @param {String} domain, optional.
	 */
	remove: function(name, path, domain) {
		 if(!Cookie.get(name)) return;
		 document.cookie = name + '=' + 
	 		(path? '; path=' + path : '') +
	 		(domain? '; domain=' + domain : '') +
	 		'; expires=Thu, 01-Jan-70 00:00:01 GMT';
	}
};
Theme = {
	COOKIE_NAME: 'theme',
	
	set: function(theme) {
		if(theme) Cookie.set(Theme.COOKIE_NAME, theme, Cookie.INFINITE);
		//this._loadThemeResources(theme);
		var links = Dom.getByTag('link');
		for(var i = 0; i < links.length; i++) {
			var link = links[i];
			var rel = Dom.getAttribute(link, 'rel');
			var title = Dom.getAttribute(link, 'title');
			if(!/^\s*alternate\s*stylesheet\s*$/.test(rel) || !title) continue;
			link.disabled = (title !== theme); 			
		}
	},
	
	loaded: function() {
		return Cookie.get(Theme.COOKIE_NAME);
	},
	
	_onClick: function(ev, theme) {
		Theme.set(theme);	
	},
	
	_onLoad: function() {
		if(!Theme.preset) return;
		if(!Theme.loaded()) Theme.set(Theme.preset);
		if(!Theme.meta) return;
		for(var i = 0; i < Theme.meta.length; i++) {
			var meta = Theme.meta[i];
			Event.addListener(meta.id, 'click', Theme._onClick, Theme, meta.name);
		}
	},
	
	_loadThemeResources: function(theme) {
		var resources = this._resources[theme];
		var index = 0;
		var load = function() {
			var img = new Image();
			img.src = resources[index];
			img.onload = function() {
				index++;
				load();
			}
		}
	}
};

Event.load(Theme._onLoad, Theme);

(
	function() {
		// we need first to reset all alternate links, i.e. set them to disable
		Theme.set();
		
		// if we have a persisted theme initialize it
		var theme = Cookie.get(Theme.COOKIE_NAME);
		if(theme) Theme.set(theme);
	}
)();
App = {
	_onHandlers: [],
	_unHandlers: [],
	
	/**
	 * Register object to document load event. Object must implement onLoad method.
	 * @param {Object} o object to be registered.
	 */
	onLoad: function(o) {
		Lang.assertFunction(o.onLoad);
		App._onHandlers.push(o);
	},
	
	/**
	 * Register object to document unload event. Object must implement onUnload method.
	 * @param {Object} o object to be registered.
	 */
	onUnload: function(o) {
		Lang.assertFunction(o.onUnload);
		App._unHandlers.push(o);
	},
	
	_onLoad: function() {
		// an exception on any on load registered handler will stop page loading
		try {
			for(var key in I18N) {
				var el = Dom.getEl('i18n.' + key);
				if(el) el.innerHTML = I18N[key];
			}
			for(var i = 0; i < App._onHandlers.length; i++) {
				App._onHandlers[i].onLoad.call(App._onHandlers[i]);
			}
		}
		catch(e) {
			// TODO: dump page state and error to server for post-portem analysis
			//Alert(I18N.fatalError);
			Alert(e);
		}
	},
	
	_onUnload: function() {
		var b = true;
		for(var i = 0; i < App._unHandlers.length; i++) {
			// ignore exceptions on unload handlers and take care to execute all
			try { b &= App._unHandlers[i].onUnload.call(App._unHandlers[i]); } catch(e){}
		}
		if(!b) return false;
	}
};
 
Event.load(App._onLoad, App);
Event.unload(App._onUnload, App);
