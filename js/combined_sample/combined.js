var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define("system/engine/inputProvider", ["require", "exports"], function (require, exports) {
    "use strict";
    var InputProvider = (function () {
        function InputProvider(engine) {
            var _this = this;
            this._onKeyDown = function (e) {
                if (_this._engine.paused)
                    return;
                _this._engine.keyDown(e);
            };
            this._onKeyPress = function (e) {
                if (_this._engine.paused)
                    return;
                _this._engine.keyPress(e);
            };
            this._onKeyUp = function (e) {
                if (_this._engine.paused)
                    return;
                _this._engine.keyUp(e);
            };
            this._onTouch = function (e) {
                if (_this._engine.paused)
                    return;
                if (e.touches.length > 0) {
                    var touch = e.touches[0];
                    _this._engine.updateMousePos(touch.clientX, touch.clientY);
                }
            };
            this._onTouchStart = function (e) {
                if (_this._engine.paused)
                    return;
                _this._engine.touchStart(e);
                _this._onTouch(e);
            };
            this._onTouchEnd = function (e) {
                if (_this._engine.paused)
                    return;
                _this._engine.touchEnd(e);
            };
            this._onTouchCancel = function (e) {
                if (_this._engine.paused)
                    return;
                _this._engine.touchCancel(e);
            };
            this._onTouchMove = function (e) {
                if (_this._engine.paused)
                    return;
                _this._engine.touchMove(e);
                _this._onTouch(e);
            };
            this._onClick = function (e) {
                if (_this._engine.paused)
                    return;
                _this._engine.click(e);
            };
            this._onDoubleClick = function (e) {
                if (_this._engine.paused)
                    return;
                _this._engine.doubleClick(e);
            };
            this._onMouseDown = function (e) {
                if (_this._engine.paused)
                    return;
                _this._engine.isMouseDown = true;
                _this._engine.mouseDown(e);
            };
            this._onMouseUp = function (e) {
                if (_this._engine.paused)
                    return;
                _this._engine.isMouseDown = false;
                _this._engine.mouseUp(e);
            };
            this._onMouseLeave = function (e) {
                if (_this._engine.paused)
                    return;
                _this._engine.isMouseOut = true;
                _this._engine.mouseLeave(e);
            };
            this._onMouseEnter = function (e) {
                if (_this._engine.paused)
                    return;
                _this._engine.isMouseOut = false;
                _this._engine.mouseEnter(e);
            };
            this._onMouseMove = function (e) {
                if (_this._engine.paused)
                    return;
                _this._engine.mouseMove(e);
                _this._engine.updateMousePos(e.clientX, e.clientY);
            };
            engine.canvas.addEventListener('mousemove', this._onMouseMove);
            window.addEventListener('keydown', this._onKeyDown);
            window.addEventListener('keypress', this._onKeyPress);
            window.addEventListener('keyup', this._onKeyUp);
            engine.canvas.addEventListener('touchstart', this._onTouchStart);
            engine.canvas.addEventListener('touchend', this._onTouchEnd);
            engine.canvas.addEventListener('touchcancel', this._onTouchCancel);
            engine.canvas.addEventListener('touchmove', this._onTouchMove);
            engine.canvas.addEventListener('click', this._onClick);
            engine.canvas.addEventListener('dblkclick', this._onDoubleClick);
            engine.canvas.addEventListener('mousedown', this._onMouseDown);
            engine.canvas.addEventListener('mouseup', this._onMouseUp);
            engine.canvas.addEventListener('mouseleave', this._onMouseLeave);
            engine.canvas.addEventListener('mouseenter', this._onMouseEnter);
            this._engine = engine;
        }
        return InputProvider;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = InputProvider;
});
define("system/component/event/eventHandlerCallbackBind", ["require", "exports"], function (require, exports) {
    "use strict";
    var EventHandlerCallbackBind = (function () {
        function EventHandlerCallbackBind(handler) {
            this.sourceFunction = handler;
            this.handler = handler;
        }
        return EventHandlerCallbackBind;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = EventHandlerCallbackBind;
});
define("system/component/event/eventHandler", ["require", "exports", "system/component/event/eventHandlerCallbackBind"], function (require, exports, eventHandlerCallbackBind_1) {
    "use strict";
    var EventHandler = (function () {
        function EventHandler() {
            this._binds = [];
        }
        Object.defineProperty(EventHandler.prototype, "count", {
            get: function () {
                return this._binds.length;
            },
            enumerable: true,
            configurable: true
        });
        EventHandler.prototype.subscribe = function (handler) {
            this._binds.push(new eventHandlerCallbackBind_1.default(handler));
        };
        EventHandler.prototype.unsubscribe = function (handler) {
            var bind;
            for (var i = 0; i < this._binds.length; i++) {
                bind = this._binds[i];
                if (handler == bind.sourceFunction) {
                    this._binds.splice(i, 1);
                    break;
                }
            }
        };
        EventHandler.prototype.trigger = function (sender) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var bind;
            for (var i = 0; i < this.count; i++) {
                bind = this._binds[i];
                (_a = bind).handler.apply(_a, [sender].concat(args));
            }
            var _a;
        };
        return EventHandler;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = EventHandler;
});
define("system/helpers/math", ["require", "exports"], function (require, exports) {
    "use strict";
    function radians(degrees) {
        return degrees * Math.PI / 180;
    }
    exports.radians = radians;
    function degrees(radians) {
        return radians * 180 / Math.PI;
    }
    exports.degrees = degrees;
    function normalizeRadians(radians) {
        return Math.atan2(Math.sin(radians), Math.cos(radians));
    }
    exports.normalizeRadians = normalizeRadians;
    function rotateTowards(source, target, step) {
        var diff = Math.abs(source - target);
        var result = source;
        if (diff < Math.PI && target > source) {
            result = source + step;
        }
        else if (diff < Math.PI && target < source) {
            result = source - step;
        }
        else if (diff > Math.PI && target > source) {
            result = source - step;
        }
        else if (diff > Math.PI && target < source) {
            result = source + step;
        }
        else if (diff == Math.PI) {
            result = source + step;
        }
        result = normalizeRadians(result);
        if ((result > target && result - step < target) || (result < target && result + step > target)) {
            result = target;
        }
        return result;
    }
    exports.rotateTowards = rotateTowards;
    function map(value, fromRangeMin, fromRangeMax, toRangeMin, toRangeMax) {
        return (value - fromRangeMin) * (toRangeMax - toRangeMin) / (fromRangeMax - fromRangeMin) + toRangeMin;
    }
    exports.map = map;
    function lerp(value, targetValue, stepPercentage) {
        return value * (1 - stepPercentage) + targetValue * stepPercentage;
    }
    exports.lerp = lerp;
    function clamp(value, min, max) {
        if (value < min) {
            return min;
        }
        else if (value > max) {
            return value;
        }
        else {
            return value;
        }
    }
    exports.clamp = clamp;
    function hypot(a, b) {
        return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
    }
    exports.hypot = hypot;
    function min(selector, items) {
        return _minOrMax(true, selector, items);
    }
    exports.min = min;
    function max(selector, items) {
        return _minOrMax(false, selector, items);
    }
    exports.max = max;
    function _minOrMax(min, selector, items) {
        var result = min ? Number.MAX_VALUE : Number.MIN_VALUE;
        var item;
        for (var i = 0; i < items.length; i++) {
            item = items[i];
            var value = selector(item);
            if (min) {
                if (value < result) {
                    result = value;
                }
            }
            else {
                if (value > result) {
                    result = value;
                }
            }
        }
        return result;
    }
    exports.TWO_PI = 6.28318530718;
});
define("system/component/vector2d", ["require", "exports", "system/component/event/eventHandler", "system/helpers/math"], function (require, exports, eventHandler_1, math_1) {
    "use strict";
    var Vector2D = (function () {
        function Vector2D(xOrVector, y) {
            this._x = 0;
            this._y = 0;
            this._onChanged = new eventHandler_1.default();
            this._x = Vector2D._xFromVectorOrNumber(xOrVector);
            this._y = Vector2D._yFromVectorOrNumber(xOrVector, y);
        }
        Object.defineProperty(Vector2D.prototype, "onChanged", {
            get: function () {
                return this._onChanged;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector2D.prototype, "x", {
            get: function () {
                return this._x;
            },
            set: function (value) {
                var previous = this._x;
                this._x = value;
                this.onChanged.trigger(this, previous, this._y);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector2D.prototype, "y", {
            get: function () {
                return this._y;
            },
            set: function (value) {
                var previous = this._y;
                this._y = value;
                this.onChanged.trigger(this, this._x, previous);
            },
            enumerable: true,
            configurable: true
        });
        Vector2D.prototype.add = function (vector) {
            return new Vector2D(this.x + vector.x, this.y + vector.y);
        };
        Vector2D.prototype.subtract = function (vector) {
            return new Vector2D(this.x - vector.x, this.y - vector.y);
        };
        Vector2D.prototype.multiply = function (multiplier) {
            return new Vector2D(this.x * multiplier, this.y * multiplier);
        };
        Vector2D.prototype.set = function (vector) {
            this.x = vector.x;
            this.y = vector.y;
        };
        Vector2D.prototype.lerp = function (vector, stepPercentage) {
            var targetX = vector.x;
            var targetY = vector.y;
            return new Vector2D(math_1.lerp(this.x, targetX, stepPercentage), math_1.lerp(this.y, targetY, stepPercentage));
        };
        Vector2D.prototype.getOffsetTowardsAngle = function (offset, angle) {
            return new Vector2D(this.x + offset * Math.cos(angle), this.y + offset * Math.sin(angle));
        };
        Vector2D.prototype.getAngleTowardsVector = function (xOrVector, y) {
            var targetX = Vector2D._xFromVectorOrNumber(xOrVector);
            var targetY = Vector2D._yFromVectorOrNumber(xOrVector, y);
            return Math.atan2(targetY - this.y, targetX - this.x);
        };
        Vector2D.prototype.getOffsetTowardsVector = function (offset, vector, overshoot) {
            if (overshoot === void 0) { overshoot = true; }
            var targetX = vector.x;
            var targetY = vector.y;
            if (!overshoot) {
                var target = new Vector2D(targetX, targetY);
                var distance = this.distanceTo(target);
                if (distance <= offset) {
                    return target;
                }
            }
            return this.getOffsetTowardsAngle(offset, this.getAngleTowardsVector(targetX, targetY));
        };
        Vector2D.prototype.distanceTo = function (xOrVector, y) {
            var targetX = Vector2D._xFromVectorOrNumber(xOrVector);
            var targetY = Vector2D._yFromVectorOrNumber(xOrVector, y);
            return Math.sqrt(Math.pow(targetX - this.x, 2) + Math.pow(targetY - this.y, 2));
        };
        Vector2D.prototype.length = function () {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        };
        Vector2D.prototype.normalized = function () {
            var length = this.length();
            return length == 0 ? new Vector2D(0, 0) : new Vector2D(this.x / length, this.y / length);
        };
        Vector2D.prototype.equals = function (vector) {
            return vector !== undefined && this.x === vector.x && this.y === vector.y;
        };
        Vector2D.prototype.copy = function () {
            return new Vector2D(this);
        };
        Vector2D.prototype.toString = function () {
            return "[" + this.x + ", " + this.y + "]";
        };
        Vector2D._xFromVectorOrNumber = function (vector) {
            return vector instanceof Vector2D ? vector.x : vector !== undefined ? vector : 0;
        };
        Vector2D._yFromVectorOrNumber = function (vector, y) {
            return vector instanceof Vector2D ? vector.y : y !== undefined ? y : 0;
        };
        return Vector2D;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Vector2D;
});
define("system/component/size", ["require", "exports", "system/component/event/eventHandler"], function (require, exports, eventHandler_2) {
    "use strict";
    var Size = (function () {
        function Size(sizeOrWidth, height) {
            this._width = 0;
            this._height = 0;
            this._onChanged = new eventHandler_2.default();
            this.width = sizeOrWidth instanceof Size ? sizeOrWidth.width : sizeOrWidth !== undefined ? sizeOrWidth : 0;
            this.height = height !== undefined ? height : 0;
        }
        Object.defineProperty(Size.prototype, "onChanged", {
            get: function () {
                return this._onChanged;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Size.prototype, "width", {
            get: function () {
                return this._width;
            },
            set: function (value) {
                var previousWidth = this._width;
                this._width = value;
                this._onChanged.trigger(this, previousWidth, this._height);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Size.prototype, "height", {
            get: function () {
                return this._height;
            },
            set: function (value) {
                var previousHeight = this._height;
                this._height = value;
                this._onChanged.trigger(this, this._width, previousHeight);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Size.prototype, "area", {
            get: function () {
                return this.width * this.height;
            },
            enumerable: true,
            configurable: true
        });
        return Size;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Size;
});
define("system/component/random", ["require", "exports"], function (require, exports) {
    "use strict";
    var Random = (function () {
        function Random() {
        }
        Random.next = function (min, max) {
            if (min === void 0) { min = 0; }
            if (max === void 0) { max = null; }
            return Math.floor(Math.random() * (max - min) + min);
        };
        return Random;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Random;
});
define("system/component/color", ["require", "exports", "system/component/random"], function (require, exports, random_1) {
    "use strict";
    var Color = (function () {
        function Color(rOrColor, g, b, alpha) {
            this.red = 0;
            this.green = 0;
            this.blue = 0;
            this.alpha = 1;
            if (rOrColor instanceof Color) {
                this.red = rOrColor.red;
                this.green = rOrColor.green;
                this.blue = rOrColor.blue;
                this.alpha = rOrColor.alpha;
            }
            else {
                var r = rOrColor;
                this.red = r !== undefined ? r : 0;
                this.green = g !== undefined ? g : 0;
                this.blue = b !== undefined ? b : 0;
                this.alpha = alpha !== undefined ? alpha : 1;
            }
        }
        Color.prototype.toCSS = function () {
            return "rgba(" + this.red + ", " + this.green + ", " + this.blue + ", " + this.alpha + ")";
        };
        Color.prototype.toString = function () {
            return this.toCSS();
        };
        Color.fromHex = function (hexString) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexString);
            return result ? new Color(parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)) : null;
        };
        Color.random = function () {
            return new Color(random_1.default.next(0, 256), random_1.default.next(0, 256), random_1.default.next(0, 256), 1);
        };
        Object.defineProperty(Color, "black", {
            get: function () {
                return new Color(0, 0, 0, 1);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Color, "white", {
            get: function () {
                return new Color(255, 255, 255, 1);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Color, "grey", {
            get: function () {
                return new Color(128, 128, 128, 1);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Color, "red", {
            get: function () {
                return new Color(255, 0, 0, 1);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Color, "green", {
            get: function () {
                return new Color(0, 255, 0, 1);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Color, "blue", {
            get: function () {
                return new Color(0, 0, 255, 1);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Color, "yellow", {
            get: function () {
                return new Color(255, 255, 0, 1);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Color, "orange", {
            get: function () {
                return new Color(255, 127, 0, 1);
            },
            enumerable: true,
            configurable: true
        });
        return Color;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Color;
});
define("system/component/padding", ["require", "exports"], function (require, exports) {
    "use strict";
    var Padding = (function () {
        function Padding(allOrTopAndBottomOrTop, leftAndRightOrRight, bottom, left) {
            if (allOrTopAndBottomOrTop === undefined && leftAndRightOrRight === undefined && bottom === undefined && left === undefined) {
                this.top = 0;
                this.right = 0;
                this.bottom = 0;
                this.left = 0;
            }
            else if (allOrTopAndBottomOrTop !== undefined && leftAndRightOrRight === undefined && bottom === undefined && left === undefined) {
                this.top = allOrTopAndBottomOrTop;
                this.right = allOrTopAndBottomOrTop;
                this.bottom = allOrTopAndBottomOrTop;
                this.left = allOrTopAndBottomOrTop;
            }
            else if (allOrTopAndBottomOrTop !== undefined && leftAndRightOrRight !== undefined && bottom === undefined && left === undefined) {
                this.top = allOrTopAndBottomOrTop;
                this.bottom = allOrTopAndBottomOrTop;
                this.right = leftAndRightOrRight;
                this.left = leftAndRightOrRight;
            }
            else {
                this.top = allOrTopAndBottomOrTop !== undefined ? allOrTopAndBottomOrTop : 0;
                this.right = leftAndRightOrRight !== undefined ? leftAndRightOrRight : 0;
                this.bottom = bottom !== undefined ? bottom : 0;
                this.left = left !== undefined ? left : 0;
            }
        }
        return Padding;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Padding;
});
define("system/component/range/range", ["require", "exports", "system/component/event/eventHandler", "system/helpers/math"], function (require, exports, eventHandler_3, math_2) {
    "use strict";
    var Range = (function () {
        function Range(minOrRange, max) {
            this._onChanged = new eventHandler_3.default();
            if (minOrRange instanceof Range) {
                this.min = minOrRange.min;
                this.max = minOrRange.max;
            }
            else {
                this._min = minOrRange;
                this._max = max !== undefined ? max : 0;
            }
        }
        Object.defineProperty(Range.prototype, "onChanged", {
            get: function () {
                return this._onChanged;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Range.prototype, "min", {
            get: function () {
                return this._min;
            },
            set: function (value) {
                var previosMin = this._min;
                this._min = value;
                this._onChanged.trigger(this, previosMin, this._max);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Range.prototype, "max", {
            get: function () {
                return this._max;
            },
            set: function (value) {
                var previosMax = this._max;
                this._max = value;
                this._onChanged.trigger(this, this._min, previosMax);
            },
            enumerable: true,
            configurable: true
        });
        Range.prototype.recalculate = function (selector, items) {
            this.min = math_2.min(selector, items);
            this.max = math_2.max(selector, items);
        };
        Range.prototype.set = function (range) {
            this.min = range !== undefined ? range.min : 0;
            this.max = range !== undefined ? range.max : 0;
        };
        Range.from = function (selector, items) {
            return new Range(math_2.min(selector, items), math_2.max(selector, items));
        };
        return Range;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Range;
});
define("system/component/range/xyRange", ["require", "exports", "system/component/event/eventHandler", "system/component/range/range"], function (require, exports, eventHandler_4, range_1) {
    "use strict";
    var XYRange = (function () {
        function XYRange(xMinOrXRangeOrXYRange, xMaxOrYRange, yMin, yMax) {
            var _this = this;
            this._onChanged = new eventHandler_4.default();
            this.rangeOnChanged = function (sender) {
                _this._onChanged.trigger(_this);
            };
            this._xRange = new range_1.default(0, 0);
            this._yRange = new range_1.default(0, 0);
            if (xMinOrXRangeOrXYRange instanceof XYRange) {
                this._xRange.set(xMinOrXRangeOrXYRange.xRange);
                this._yRange.set(xMinOrXRangeOrXYRange.yRange);
            }
            else if (xMinOrXRangeOrXYRange instanceof range_1.default && xMaxOrYRange instanceof range_1.default) {
                this._xRange.set(xMinOrXRangeOrXYRange);
                this._yRange.set(xMaxOrYRange);
            }
            else if (xMinOrXRangeOrXYRange instanceof Number && xMaxOrYRange instanceof Number) {
                this._xRange.min = xMinOrXRangeOrXYRange;
                this._xRange.max = xMaxOrYRange !== undefined ? xMaxOrYRange : 0;
                this._yRange.min = yMin !== undefined ? yMin : 0;
                this._yRange.max = yMax !== undefined ? yMax : 0;
            }
            this._xRange.onChanged.subscribe(this.rangeOnChanged);
            this._yRange.onChanged.subscribe(this.rangeOnChanged);
        }
        Object.defineProperty(XYRange.prototype, "xRange", {
            get: function () {
                return this._xRange;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(XYRange.prototype, "yRange", {
            get: function () {
                return this._yRange;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(XYRange.prototype, "minX", {
            get: function () {
                return this._xRange.min;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(XYRange.prototype, "maxX", {
            get: function () {
                return this._xRange.max;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(XYRange.prototype, "minY", {
            get: function () {
                return this._yRange.min;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(XYRange.prototype, "maxY", {
            get: function () {
                return this._yRange.max;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(XYRange.prototype, "onChanged", {
            get: function () {
                return this._onChanged;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(XYRange.prototype, "xRangeOnChanged", {
            get: function () {
                return this._xRange.onChanged;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(XYRange.prototype, "yRangeOnChanged", {
            get: function () {
                return this._yRange.onChanged;
            },
            enumerable: true,
            configurable: true
        });
        XYRange.prototype.recalculate = function (items) {
            this.xRange.recalculate(function (item) { return item.x; }, items);
            this.yRange.recalculate(function (item) { return item.y; }, items);
        };
        XYRange.prototype.set = function (range) {
            this._xRange.min = range.xRange.min;
            this._xRange.max = range.xRange.max;
            this._yRange.min = range.yRange.min;
            this._yRange.max = range.yRange.max;
        };
        XYRange.prototype.withPadding = function (padding) {
            if (padding === undefined) {
                return new XYRange(this);
            }
            else {
                return new XYRange(this._xRange.min + padding.left, this._xRange.max - padding.right, this._yRange.min + padding.top, this._yRange.max - padding.bottom);
            }
        };
        XYRange.from = function (items) {
            return new XYRange(range_1.default.from(function (item) { return item.x; }, items), range_1.default.from(function (item) { return item.y; }, items));
        };
        return XYRange;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = XYRange;
});
define("system/drawing/polygon", ["require", "exports", "system/drawing/baseRenderable", "system/component/vector2d", "system/component/color", "system/component/random", "system/component/range/range", "system/component/range/xyRange"], function (require, exports, baseRenderable_1, vector2d_1, color_1, random_2, range_2, xyRange_1) {
    "use strict";
    var Polygon = (function (_super) {
        __extends(Polygon, _super);
        function Polygon(fillStyle, strokeStyle) {
            if (fillStyle === void 0) { fillStyle = color_1.default.black; }
            if (strokeStyle === void 0) { strokeStyle = color_1.default.white; }
            var _this = _super.call(this, null, null, fillStyle, strokeStyle) || this;
            _this._vertices = [];
            _this._xyRange = new xyRange_1.default(0, 0, 0, 0);
            _this.update();
            return _this;
        }
        Object.defineProperty(Polygon.prototype, "xRange", {
            get: function () {
                return this._xyRange.xRange;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Polygon.prototype, "yRange", {
            get: function () {
                return this._xyRange.yRange;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Polygon.prototype, "minX", {
            get: function () {
                return this._xyRange.xRange.min;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Polygon.prototype, "maxX", {
            get: function () {
                return this._xyRange.xRange.max;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Polygon.prototype, "minY", {
            get: function () {
                return this._xyRange.yRange.min;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Polygon.prototype, "maxY", {
            get: function () {
                return this._xyRange.yRange.max;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Polygon.prototype, "vertices", {
            get: function () {
                return this._vertices;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Polygon.prototype, "count", {
            get: function () {
                return this._vertices.length;
            },
            enumerable: true,
            configurable: true
        });
        Polygon.prototype.update = function () {
            this._xyRange.recalculate(this._vertices);
        };
        Polygon.prototype.render = function (ctx) {
            this.beginRender(ctx);
            Polygon.renderVertices(ctx, this._vertices);
            this.endRender(ctx);
        };
        Polygon.prototype.addVertex = function (vector) {
            this._vertices.push(vector);
            this.update();
        };
        Polygon.prototype.clearVertices = function () {
            this._vertices = [];
            this.update();
        };
        Polygon.prototype.vertexAt = function (index) {
            return this._vertices[index];
        };
        Polygon.prototype.intersects = function (vector) {
            return Polygon.intersects(this._vertices, vector);
        };
        Polygon.prototype.getRandomPosition = function (padding) {
            var xYRange = this._xyRange.withPadding(padding);
            return Polygon._getRandomPosition(xYRange.xRange, xYRange.yRange, this._vertices, padding);
        };
        Polygon.prototype.toString = function () {
            return '(' + this._vertices.join(', ') + ')';
        };
        Polygon._getRandomPosition = function (xRange, yRange, vertices, padding) {
            var result;
            var maxAttempts = 1000;
            var attempts = 0;
            while (true) {
                result = new vector2d_1.default(random_2.default.next(xRange.min, xRange.max + 1), random_2.default.next(yRange.min, yRange.max + 1));
                if (Polygon.intersects(vertices, result)) {
                    return result;
                }
                else {
                    attempts++;
                    if (attempts === maxAttempts) {
                        break;
                    }
                }
            }
            return null;
        };
        Polygon.intersects = function (vertices, vector) {
            var x = vector.x, y = vector.y;
            var inside = false;
            for (var i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
                var xi = vertices[i].x, yi = vertices[i].y;
                var xj = vertices[j].x, yj = vertices[j].y;
                var intersect = ((yi > y) != (yj > y))
                    && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
                if (intersect)
                    inside = !inside;
            }
            return inside;
        };
        Polygon.getRandomPosition = function (vertices, padding) {
            var xyRange = xyRange_1.default.from(vertices);
            var xRange = new range_2.default(padding !== undefined ? xyRange.minX + padding.left : xyRange.minX, padding !== undefined ? xyRange.maxX - padding.right : xyRange.maxX);
            var yRange = new range_2.default(padding !== undefined ? xyRange.minY + padding.top : xyRange.minY, padding !== undefined ? xyRange.maxY - padding.bottom : xyRange.maxY);
            return Polygon._getRandomPosition(xRange, yRange, vertices, padding);
        };
        Polygon.intersects2 = function (vertices, vector) {
            var result = false;
            var j = vertices.length - 1;
            for (var i = 0; i < vertices.length; i++) {
                if (vertices[i].y < vector.y && vertices[j].y >= vector.y || vertices[j].y < vector.y && vertices[i].y >= vector.y) {
                    if (vertices[i].x + (vector.y - vertices[i].y) / (vertices[j].y - vertices[i].y) * (vertices[j].x - vertices[i].x) < vector.x) {
                        result = !result;
                    }
                }
                j = i;
            }
            return result;
        };
        Polygon.renderVertices = function (ctx, vertices) {
            var vertex;
            for (var i = 0; i < vertices.length; i++) {
                vertex = vertices[i];
                if (i == 0) {
                    ctx.moveTo(vertex.x, vertex.y);
                }
                else {
                    ctx.lineTo(vertex.x, vertex.y);
                }
            }
        };
        return Polygon;
    }(baseRenderable_1.BaseRenderable));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Polygon;
});
define("system/drawing/line/lineCap", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.LineCap = {
        butt: 'butt',
        round: 'round',
        square: 'square'
    };
});
define("system/drawing/line/lineJoin", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.LineJoin = {
        miter: 'miter',
        round: 'round',
        bevel: 'bevel'
    };
});
define("system/drawing/line/line", ["require", "exports", "system/drawing/baseRenderable", "system/component/vector2d", "system/component/color", "system/drawing/polygon", "system/drawing/line/lineCap", "system/drawing/line/lineJoin"], function (require, exports, baseRenderable_2, vector2d_2, color_2, polygon_1, lineCap_1, lineJoin_1) {
    "use strict";
    var Line = (function (_super) {
        __extends(Line, _super);
        function Line(x, y, endX, endY, lineWidth, strokeStyle) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (endX === void 0) { endX = 0; }
            if (endY === void 0) { endY = 0; }
            if (lineWidth === void 0) { lineWidth = 0; }
            if (strokeStyle === void 0) { strokeStyle = color_2.default.white; }
            var _this = _super.call(this, x, y, null, strokeStyle) || this;
            _this._endPosition = new vector2d_2.default(0, 0);
            _this._vertices = [];
            _this.positionOnChanged = function (sender) {
                _this.update();
            };
            _this.closePath = false;
            _this.fill = false;
            _this.lineWidth = lineWidth;
            _this._endPosition.x = endX;
            _this._endPosition.y = endY;
            _this._endPosition.onChanged.subscribe(_this.positionOnChanged);
            _this.update();
            return _this;
        }
        Object.defineProperty(Line.prototype, "endPosition", {
            get: function () {
                return this._endPosition;
            },
            set: function (value) {
                this._endPosition.onChanged.unsubscribe(this.positionOnChanged);
                this._endPosition = value;
                this._endPosition.onChanged.subscribe(this.positionOnChanged);
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        Line.prototype.update = function () {
            var quarterTurn = Math.PI / 2;
            var angle = this.position.getAngleTowardsVector(this._endPosition);
            var topLeft = this.position.getOffsetTowardsAngle(this.lineWidth / 2, angle - quarterTurn);
            var topRight = this._endPosition.getOffsetTowardsAngle(this.lineWidth / 2, angle - quarterTurn);
            var bottomRight = this._endPosition.getOffsetTowardsAngle(this.lineWidth / 2, angle + quarterTurn);
            var bottomLeft = this.position.getOffsetTowardsAngle(this.lineWidth / 2, angle + quarterTurn);
            this._vertices = [topLeft, topRight, bottomRight, bottomLeft];
        };
        Line.prototype.render = function (ctx) {
            this.beginRender(ctx);
            ctx.moveTo(this.position.x, this.position.y);
            ctx.lineTo(this._endPosition.x, this._endPosition.y);
            this.endRender(ctx);
        };
        Line.prototype.intersects = function (position) {
            return polygon_1.default.intersects(this._vertices, position);
        };
        Line.prototype._test = function (ctx) {
            var quarterTurn = Math.PI / 2;
            var angle = this.position.getAngleTowardsVector(this._endPosition);
            var topLeft = this.position.getOffsetTowardsAngle(this.lineWidth / 2, angle - quarterTurn);
            var topRight = this._endPosition.getOffsetTowardsAngle(this.lineWidth / 2, angle - quarterTurn);
            var bottomRight = this._endPosition.getOffsetTowardsAngle(this.lineWidth / 2, angle + quarterTurn);
            var bottomLeft = this.position.getOffsetTowardsAngle(this.lineWidth / 2, angle + quarterTurn);
            ctx.beginPath();
            ctx.strokeStyle = color_2.default.red.toString();
            ctx.lineWidth = 1;
            ctx.moveTo(topLeft.x, topLeft.y);
            ctx.lineTo(topRight.x, topRight.y);
            ctx.lineTo(bottomRight.x, bottomRight.y);
            ctx.lineTo(bottomLeft.x, bottomLeft.y);
            ctx.closePath();
            ctx.stroke();
        };
        return Line;
    }(baseRenderable_2.BaseRenderable));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Line;
    exports.LineCap = lineCap_1.LineCap;
    exports.LineJoin = lineJoin_1.LineJoin;
});
define("system/drawing/baseRenderable", ["require", "exports", "system/component/vector2d", "system/component/color", "system/drawing/line/line"], function (require, exports, vector2d_3, color_3, line_1) {
    "use strict";
    var BaseRenderable = (function () {
        function BaseRenderable(x, y, fillStyle, strokeStyle) {
            this._position = new vector2d_3.default(0, 0);
            this.lineCap = line_1.LineCap.butt;
            this.lineJoin = line_1.LineJoin.miter;
            this.miterLimit = 10;
            this.lineDash = [];
            this.lineDashOffset = 0;
            this.fillStyle = color_3.default.black;
            this.strokeStyle = color_3.default.white;
            this.lineWidth = 1;
            this.fill = true;
            this.stroke = true;
            this.closePath = true;
            this.positionOnChanged = function (sender) { };
            this._position.x = x;
            this._position.y = y;
            this.fillStyle = fillStyle;
            this.strokeStyle = strokeStyle;
            this._position.onChanged.subscribe(this.positionOnChanged);
        }
        Object.defineProperty(BaseRenderable.prototype, "position", {
            get: function () {
                return this._position;
            },
            set: function (value) {
                if (this._position != null) {
                    this._position.onChanged.unsubscribe(this.positionOnChanged);
                }
                this._position = value;
                this._position.onChanged.subscribe(this.positionOnChanged);
                this.positionOnChanged(value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseRenderable.prototype, "x", {
            get: function () {
                return this._position.x;
            },
            set: function (value) {
                this._position.x = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseRenderable.prototype, "y", {
            get: function () {
                return this._position.y;
            },
            set: function (value) {
                this._position.y = value;
            },
            enumerable: true,
            configurable: true
        });
        BaseRenderable.prototype.render = function (ctx) {
            throw new Error('Child class must implement method "render".');
        };
        BaseRenderable.prototype.beginRender = function (ctx) {
            ctx.beginPath();
            ctx.lineCap = this.lineCap;
            ctx.lineJoin = this.lineJoin;
            ctx.miterLimit = this.miterLimit;
            ctx.setLineDash(this.lineDash);
            ctx.lineDashOffset = this.lineDashOffset;
            ctx.fillStyle = this.fillStyle != null ? this.fillStyle.toString() : null;
            ctx.strokeStyle = this.strokeStyle != null ? this.strokeStyle.toString() : null;
            ctx.lineWidth = this.lineWidth;
        };
        BaseRenderable.prototype.endRender = function (ctx) {
            if (this.closePath) {
                ctx.closePath();
            }
            if (this.fill) {
                ctx.fill();
            }
            if (this.stroke) {
                ctx.stroke();
            }
        };
        BaseRenderable.prototype.intersects = function (vector) {
            throw new Error('Child class must implement method "intersects".');
        };
        return BaseRenderable;
    }());
    exports.BaseRenderable = BaseRenderable;
});
define("system/drawing/rectangle", ["require", "exports", "system/drawing/baseRenderable", "system/component/size", "system/component/color", "system/drawing/polygon", "system/helpers/math"], function (require, exports, baseRenderable_3, size_1, color_4, polygon_2, math_3) {
    "use strict";
    var Rectangle = (function (_super) {
        __extends(Rectangle, _super);
        function Rectangle(x, y, width, height, fillStyle, strokeStyle) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (width === void 0) { width = 0; }
            if (height === void 0) { height = 0; }
            if (fillStyle === void 0) { fillStyle = color_4.default.black; }
            if (strokeStyle === void 0) { strokeStyle = color_4.default.white; }
            var _this = _super.call(this, x, y, fillStyle, strokeStyle) || this;
            _this._size = new size_1.default(0, 0);
            _this._rotation = 0;
            _this._vertices = [];
            _this.origin = RectangleOrigin.Center;
            _this.noUpdate = false;
            _this.sizeOnChanged = function (sender) {
                _this.update();
            };
            _this._size.width = width;
            _this._size.height = height;
            _this.update();
            _this._size.onChanged.subscribe(_this.sizeOnChanged);
            return _this;
        }
        Object.defineProperty(Rectangle.prototype, "rotation", {
            get: function () {
                return this._rotation;
            },
            set: function (value) {
                this._rotation = value;
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "size", {
            get: function () {
                return this._size;
            },
            set: function (value) {
                if (this._size !== undefined) {
                    this._size.onChanged.unsubscribe(this.sizeOnChanged);
                }
                this._size = value;
                this.update();
                this._size.onChanged.subscribe(this.sizeOnChanged);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "width", {
            get: function () {
                return this._size.width;
            },
            set: function (value) {
                this.size.width = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "height", {
            get: function () {
                return this.size.height;
            },
            set: function (value) {
                this.size.height = value;
            },
            enumerable: true,
            configurable: true
        });
        Rectangle.prototype.update = function () {
            if (this.noUpdate) {
                return;
            }
            var width = this._size.width;
            var height = this._size.height;
            var _width = width / 2;
            var _height = height / 2;
            var _180Degrees = Math.PI;
            var _90Degrees = _180Degrees / 2;
            var _45Degrees = _90Degrees / 2;
            var rotation = this._rotation;
            var topLeft;
            var topRight;
            var bottomRight;
            var bottomLeft;
            switch (this.origin) {
                case RectangleOrigin.Center:
                    var topRotation = math_3.normalizeRadians(rotation - _90Degrees);
                    topLeft = this._position.getOffsetTowardsAngle(-_width, rotation).getOffsetTowardsAngle(_height, topRotation);
                    topRight = this._position.getOffsetTowardsAngle(_width, rotation).getOffsetTowardsAngle(_height, topRotation);
                    var bottomRotation = math_3.normalizeRadians(rotation + _90Degrees);
                    bottomRight = topRight.getOffsetTowardsAngle(height, bottomRotation);
                    bottomLeft = topLeft.getOffsetTowardsAngle(height, bottomRotation);
                    break;
                case RectangleOrigin.TopLeft:
                    topLeft = this._position;
                    topRight = topLeft.getOffsetTowardsAngle(width, rotation);
                    bottomRight = topRight.getOffsetTowardsAngle(height, rotation + _90Degrees);
                    bottomLeft = topLeft.getOffsetTowardsAngle(height, rotation + _90Degrees);
                    break;
            }
            this._vertices = [topLeft, topRight, bottomRight, bottomLeft];
        };
        Rectangle.prototype.render = function (ctx) {
            this.beginRender(ctx);
            polygon_2.default.renderVertices(ctx, this._vertices);
            this.endRender(ctx);
        };
        Rectangle.prototype.intersects = function (vector) {
            return polygon_2.default.intersects(this._vertices, vector);
        };
        Rectangle.prototype.getRandomPosition = function (padding) {
            return polygon_2.default.getRandomPosition(this._vertices, padding);
        };
        Rectangle.prototype.toString = function () {
            return '(' + this._vertices.join(', ') + ')';
        };
        return Rectangle;
    }(baseRenderable_3.BaseRenderable));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Rectangle;
    var RectangleOrigin;
    (function (RectangleOrigin) {
        RectangleOrigin[RectangleOrigin["Center"] = 0] = "Center";
        RectangleOrigin[RectangleOrigin["TopLeft"] = 1] = "TopLeft";
    })(RectangleOrigin = exports.RectangleOrigin || (exports.RectangleOrigin = {}));
});
define("system/engine/fullscreenRequest", ["require", "exports"], function (require, exports) {
    "use strict";
    var FullscreenRequest = (function () {
        function FullscreenRequest() {
        }
        FullscreenRequest.prototype.show = function (handlers) {
            var requestCSS = document.createElement('style');
            requestCSS.innerText = FullscreenRequest._css;
            var requestHTML = document.createElement('div');
            requestHTML.innerHTML = FullscreenRequest._html;
            document.body.appendChild(requestHTML);
            document.head.appendChild(requestCSS);
            var self = this;
            document.getElementById('fullscreen-accept').addEventListener('click', function () {
                document.body.removeChild(requestHTML);
                handlers.accepted();
                self.requestFullscreen();
            });
            document.getElementById('fullscreen-cancel').addEventListener('click', function () {
                document.body.removeChild(requestHTML);
                handlers.cancelled();
            });
        };
        FullscreenRequest.prototype.requestFullscreen = function () {
            var body = document.body;
            var requestMethod = body.requestFullScreen || body.webkitRequestFullScreen
                || body.mozRequestFullScreen || body.msRequestFullScreen;
            if (requestMethod) {
                requestMethod.call(body);
            }
            else if (typeof (window).ActiveXObject !== "undefined") {
                var wscript = new ActiveXObject("WScript.Shell");
                if (wscript !== null) {
                    wscript.SendKeys("{F11}");
                }
            }
        };
        return FullscreenRequest;
    }());
    FullscreenRequest._css = '.fullscreen-request{position:absolute;top:0;background-color:rgba(0,0,0,.5);color:#fff;font-family:monospace;margin:0 auto;width:100%;text-align:center;font-size:6vh;padding-top:1vh}.fullscreen-request:hover{background-color:rgba(255,255,255,.1)}.fullscreen-request>.title{font-size:4vh;margin-bottom:1vh}.fullscreen-request>.title>.material-icons{font-size:6vh;position:relative;top:1.75vh;margin-top:-3vh}.fullscreen-request>.button:hover{cursor:pointer}.fullscreen-request>.accept.button:hover{color:#006400}.fullscreen-request>.cancel.button:hover{color:#8b0000}.fullscreen-request>.button>.material-icons{font-size:6vh}';
    FullscreenRequest._html = '<div class="fullscreen-request" id="fullscreen-request"> <div class="title"> <i class="material-icons">fullscreen</i> Fullscreen? </div><span class="accept button" id="fullscreen-accept"><i class="material-icons">check_circle</i></span> <span class="cancel button" id="fullscreen-cancel"><i class="material-icons">cancel</i></span></div>';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = FullscreenRequest;
});
define("system/engine/gameEngine", ["require", "exports", "system/engine/inputProvider", "system/component/vector2d", "system/drawing/rectangle", "system/engine/fullscreenRequest", "system/component/random"], function (require, exports, inputProvider_1, vector2d_4, rectangle_1, fullscreenRequest_1, random_3) {
    "use strict";
    var GameEngine = (function () {
        function GameEngine(width, height) {
            var _this = this;
            this._canvas = null;
            this._fps = 0;
            this._lastFrameTime = 0;
            this._betweenFrameTime = 5;
            this._bounds = new rectangle_1.default(0, 0, 0, 0);
            this._simulationIntervalhandle = undefined;
            this._simulationInterval = 10;
            this.autoFitCanvas = true;
            this.targetFrameRate = 60;
            this.manualRender = false;
            this.renderOnResize = true;
            this.clearCanvasPerFrame = true;
            this.fullScreenPrompt = true;
            this.canvasCreated = false;
            this.paused = false;
            this.simulationPaused = false;
            this.init = function () { };
            this.render = function (ctx) { };
            this.tick = function () { };
            this.windowResize = function (e) { };
            this.keyDown = function (e) { };
            this.keyPress = function (e) { };
            this.keyUp = function (e) { };
            this.touchStart = function (e) { };
            this.touchEnd = function (e) { };
            this.touchCancel = function (e) { };
            this.touchMove = function (e) { };
            this.mouseMove = function (e) { };
            this.click = function (e) { };
            this.doubleClick = function (e) { };
            this.mouseDown = function (e) { };
            this.mouseUp = function (e) { };
            this.mouseLeave = function (e) { };
            this.mouseEnter = function (e) { };
            this.isMouseDown = false;
            this.isMouseOut = false;
            this.mousePos = new vector2d_4.default(0, 0);
            this._logicTick = function () {
                if (!_this.paused && !_this.simulationPaused) {
                    _this.tick();
                }
            };
            this._tryRenderFrame = function () {
                if (!_this.paused && !_this.manualRender) {
                    var now = performance.now();
                    var sinceLast = now - _this._lastFrameTime;
                    var targetTimeBetweenFrames = 1000 / _this.targetFrameRate;
                    if (sinceLast >= targetTimeBetweenFrames - _this._betweenFrameTime) {
                        _this.renderFrame();
                        _this._fps = 1000.0 / (now - _this._lastFrameTime);
                        _this._lastFrameTime = now;
                    }
                    requestAnimationFrame(_this._tryRenderFrame);
                }
            };
            this._bounds.width = width === undefined ? 0 : width;
            this._bounds.height = height === undefined ? 0 : height;
            this._bounds.x = width === undefined ? 0 : width / 2;
            this._bounds.y = height === undefined ? 0 : height / 2;
        }
        Object.defineProperty(GameEngine.prototype, "simulationInterval", {
            get: function () {
                return this._simulationInterval;
            },
            set: function (value) {
                this._simulationInterval = value;
                this._restartSimulation();
            },
            enumerable: true,
            configurable: true
        });
        GameEngine.prototype.renderFrame = function () {
            if (this.clearCanvasPerFrame) {
                this.clearCanvas();
            }
            this.render(this.context);
        };
        GameEngine.prototype.updateBounds = function () {
            this._bounds.noUpdate = true;
            this._bounds.x = this.width / 2;
            this._bounds.y = this.height / 2;
            this._bounds.width = this.width;
            this._bounds.height = this.height;
            this._bounds.noUpdate = false;
            this._bounds.update();
        };
        GameEngine.prototype._updateCanvasSize = function () {
            if (this.autoFitCanvas) {
                this._canvas.width = window.innerWidth;
                this._canvas.height = window.innerHeight;
                this.updateBounds();
            }
        };
        GameEngine.prototype.clearCanvas = function () {
            this.context.clearRect(0, 0, this._canvas.width, this._canvas.height);
        };
        GameEngine.prototype._createCanvas = function (width, height) {
            if (width === void 0) { width = 320; }
            if (height === void 0) { height = 640; }
            if (!this.canvasCreated) {
                var canvasCSS = document.createElement('style');
                canvasCSS.innerText = GameEngine._canvasCSS;
                document.head.appendChild(canvasCSS);
                var canvas = document.createElement('canvas');
                canvas.setAttribute('id', 'render');
                canvas.setAttribute('width', width.toString());
                canvas.setAttribute('height', height.toString());
                this._canvas = canvas;
                document.body.appendChild(this._canvas);
                this.canvasCreated = true;
                this._updateCanvasSize();
            }
        };
        GameEngine.prototype.run = function () {
            this._createCanvas(this._bounds.width, this._bounds.height);
            this._inputProvider = new inputProvider_1.default(this);
            this.init();
            window.addEventListener("resize", this._onWindowResize.bind(this));
            if (this.fullScreenPrompt) {
                var request = new fullscreenRequest_1.default();
                request.show({
                    accepted: function () { },
                    cancelled: function () { }
                });
            }
            if (!this.manualRender) {
                this._tryRenderFrame();
            }
            this._restartSimulation();
        };
        GameEngine.prototype._restartSimulation = function () {
            if (this._simulationIntervalhandle !== undefined) {
                window.clearInterval(this._simulationIntervalhandle);
            }
            this._simulationIntervalhandle = window.setInterval(this._logicTick, this._simulationInterval);
        };
        GameEngine.prototype.getRandomPosition = function (padding) {
            if (padding !== undefined) {
                return new vector2d_4.default(random_3.default.next(padding.left, this.width - padding.right + 1), random_3.default.next(padding.top, this.height - padding.bottom + 1));
            }
            else {
                return new vector2d_4.default(random_3.default.next(this.width + 1), random_3.default.next(this.height + 1));
            }
        };
        Object.defineProperty(GameEngine.prototype, "canvas", {
            get: function () {
                return this._canvas;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameEngine.prototype, "context", {
            get: function () {
                return this._canvas != null ? this._canvas.getContext('2d') : null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameEngine.prototype, "mouseX", {
            get: function () {
                return this.mousePos.x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameEngine.prototype, "mouseY", {
            get: function () {
                return this.mousePos.y;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameEngine.prototype, "width", {
            get: function () {
                return this._canvas != null ? this._canvas.width : 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameEngine.prototype, "height", {
            get: function () {
                return this._canvas != null ? this._canvas.height : 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameEngine.prototype, "fps", {
            get: function () {
                return this._fps;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameEngine.prototype, "bounds", {
            get: function () {
                return this._bounds;
            },
            enumerable: true,
            configurable: true
        });
        GameEngine.prototype.updateMousePos = function (x, y) {
            this.mousePos.x = x;
            this.mousePos.y = y;
        };
        GameEngine.prototype._onWindowResize = function (e) {
            if (this.paused)
                return;
            this._updateCanvasSize();
            if (this.renderOnResize && this.manualRender) {
                this._tryRenderFrame();
            }
            this.windowResize(e);
        };
        return GameEngine;
    }());
    GameEngine._canvasCSS = 'html,body{margin:0;padding:0;overflow:hidden;}canvas#render{background-color:black;}';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GameEngine;
});
define("system/drawing/circle", ["require", "exports", "system/drawing/baseRenderable", "system/component/color"], function (require, exports, baseRenderable_4, color_5) {
    "use strict";
    var Circle = (function (_super) {
        __extends(Circle, _super);
        function Circle(x, y, radius, fillStyle, strokeStyle) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (radius === void 0) { radius = 0; }
            if (fillStyle === void 0) { fillStyle = color_5.default.black; }
            if (strokeStyle === void 0) { strokeStyle = color_5.default.white; }
            var _this = _super.call(this, x, y, fillStyle, strokeStyle) || this;
            _this.radius = 0;
            _this.radius = radius;
            return _this;
        }
        Circle.prototype.render = function (ctx) {
            this.beginRender(ctx);
            ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, false);
            this.endRender(ctx);
        };
        Circle.prototype.intersects = function (position) {
            var diff1 = position.x - this.position.x;
            var part1 = diff1 * diff1;
            var diff2 = position.y - this.position.y;
            var part2 = diff2 * diff2;
            var part3 = this.radius * this.radius;
            return part1 + part2 < part3;
        };
        return Circle;
    }(baseRenderable_4.BaseRenderable));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Circle;
});
define("system/drawing/ellipse", ["require", "exports", "system/drawing/baseRenderable", "system/component/vector2d", "system/component/size", "system/component/color"], function (require, exports, baseRenderable_5, vector2d_5, size_2, color_6) {
    "use strict";
    var Ellipse = (function (_super) {
        __extends(Ellipse, _super);
        function Ellipse(x, y, width, height, fillStyle, strokeStyle) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (width === void 0) { width = 0; }
            if (height === void 0) { height = 0; }
            if (fillStyle === void 0) { fillStyle = color_6.default.black; }
            if (strokeStyle === void 0) { strokeStyle = color_6.default.white; }
            var _this = _super.call(this, x, y, fillStyle, strokeStyle) || this;
            _this.size = new size_2.default(0, 0);
            _this.startAngle = 0;
            _this.endAngle = Math.PI * 2;
            _this.anticlockwise = false;
            _this.size.width = width;
            _this.size.height = height;
            return _this;
        }
        Object.defineProperty(Ellipse.prototype, "xRadius", {
            get: function () {
                return this.size.width;
            },
            set: function (value) {
                this.size.width = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Ellipse.prototype, "yRadius", {
            get: function () {
                return this.size.height;
            },
            set: function (value) {
                this.size.height = value;
            },
            enumerable: true,
            configurable: true
        });
        Ellipse.prototype.render = function (ctx) {
            this.beginRender(ctx);
            ctx.ellipse(this.position.x, this.position.y, this.xRadius, this.yRadius, 0, this.startAngle, this.endAngle, this.anticlockwise);
            this.endRender(ctx);
        };
        Ellipse.prototype.intersects = function (position) {
            var normalized = new vector2d_5.default(position.x - this.position.x, position.y - this.position.y);
            return ((normalized.x * normalized.x) / (this.xRadius * this.xRadius)) + ((normalized.y * normalized.y) / (this.yRadius * this.yRadius)) <= 1.0;
        };
        return Ellipse;
    }(baseRenderable_5.BaseRenderable));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Ellipse;
});
define("system/drawing/regularPolygon", ["require", "exports", "system/drawing/baseRenderable", "system/component/vector2d", "system/drawing/polygon", "system/component/color"], function (require, exports, baseRenderable_6, vector2d_6, polygon_3, color_7) {
    "use strict";
    var RegularPolygon = (function (_super) {
        __extends(RegularPolygon, _super);
        function RegularPolygon(x, y, radius, vertexCount, fillStyle, strokeStyle) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (radius === void 0) { radius = 0; }
            if (vertexCount === void 0) { vertexCount = 0; }
            if (fillStyle === void 0) { fillStyle = color_7.default.black; }
            if (strokeStyle === void 0) { strokeStyle = color_7.default.white; }
            var _this = _super.call(this, x, y, fillStyle, strokeStyle) || this;
            _this._rotation = 0;
            _this._radius = 0;
            _this._vertexCount = 0;
            _this._vertices = [];
            _this.noUpdate = false;
            _this.positionOnChanged = function (sender) {
                _this.update();
            };
            _this.radius = radius;
            _this._vertexCount = vertexCount;
            _this.update();
            return _this;
        }
        Object.defineProperty(RegularPolygon.prototype, "vertexCount", {
            get: function () {
                return this._vertexCount;
            },
            set: function (value) {
                this._vertexCount = value;
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RegularPolygon.prototype, "radius", {
            get: function () {
                return this._radius;
            },
            set: function (value) {
                this._radius = value;
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RegularPolygon.prototype, "rotation", {
            get: function () {
                return this._rotation;
            },
            set: function (value) {
                this._rotation = value;
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        RegularPolygon.prototype.update = function () {
            if (this.noUpdate) {
                return;
            }
            this._vertices = [];
            var step = Math.PI * 2 / this._vertexCount;
            for (var i = -Math.PI; i <= Math.PI; i += step) {
                var pos = new vector2d_6.default(this.position.x + this.radius * Math.cos(i + this._rotation), this.position.y + this.radius * Math.sin(i + this._rotation));
                this._vertices.push(pos);
            }
        };
        RegularPolygon.prototype.render = function (ctx) {
            this.beginRender(ctx);
            polygon_3.default.renderVertices(ctx, this._vertices);
            this.endRender(ctx);
        };
        RegularPolygon.prototype.intersects = function (position) {
            return polygon_3.default.intersects(this._vertices, position);
        };
        return RegularPolygon;
    }(baseRenderable_6.BaseRenderable));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = RegularPolygon;
});
define("system/drawing/star", ["require", "exports", "system/drawing/baseRenderable", "system/component/vector2d", "system/drawing/polygon", "system/component/color"], function (require, exports, baseRenderable_7, vector2d_7, polygon_4, color_8) {
    "use strict";
    var Star = (function (_super) {
        __extends(Star, _super);
        function Star(x, y, pointCount, innerRadius, outerRadius, fillStyle, strokeStyle) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (pointCount === void 0) { pointCount = 0; }
            if (innerRadius === void 0) { innerRadius = 0; }
            if (outerRadius === void 0) { outerRadius = 0; }
            if (fillStyle === void 0) { fillStyle = color_8.default.black; }
            if (strokeStyle === void 0) { strokeStyle = color_8.default.white; }
            var _this = _super.call(this, x, y, fillStyle, strokeStyle) || this;
            _this._rotation = 0;
            _this.noUpdate = false;
            _this.positionOnChanged = function (sender) {
                _this.update();
            };
            _this._pointCount = pointCount;
            _this._innerRadius = innerRadius;
            _this._outerRadius = outerRadius;
            _this._vertices = [];
            _this.update();
            return _this;
        }
        Object.defineProperty(Star.prototype, "rotation", {
            get: function () {
                return this._rotation;
            },
            set: function (value) {
                this._rotation = value;
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Star.prototype, "pointCount", {
            get: function () { return this._pointCount; },
            set: function (value) {
                this._pointCount = value;
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Star.prototype, "innerRadius", {
            get: function () { return this._innerRadius; },
            set: function (value) {
                this._innerRadius = value;
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Star.prototype, "outerRadius", {
            get: function () { return this._outerRadius; },
            set: function (value) {
                this._outerRadius = value;
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        Star.prototype.update = function () {
            if (this.noUpdate) {
                return;
            }
            this._vertices = [];
            var step = Math.PI * 2 / (this.pointCount * 2);
            var even = true;
            for (var i = -Math.PI; i <= Math.PI; i += step) {
                var radius = even ? this._outerRadius : this._innerRadius;
                var pos = new vector2d_7.default(this.position.x + radius * Math.cos(i + this._rotation), this.position.y + radius * Math.sin(i + this._rotation));
                this._vertices.push(pos);
                even = !even;
            }
        };
        Star.prototype.render = function (ctx) {
            this.beginRender(ctx);
            polygon_4.default.renderVertices(ctx, this._vertices);
            this.endRender(ctx);
        };
        Star.prototype.intersects = function (position) {
            return polygon_4.default.intersects(this._vertices, position);
        };
        return Star;
    }(baseRenderable_7.BaseRenderable));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Star;
});
define("system/drawing/rotatableRenderable", ["require", "exports", "system/drawing/baseRenderable"], function (require, exports, baseRenderable_8) {
    "use strict";
    var RotatableRenderable = (function (_super) {
        __extends(RotatableRenderable, _super);
        function RotatableRenderable(x, y, fillStyle, strokeStyle) {
            var _this = _super.call(this, x, y, fillStyle, strokeStyle) || this;
            _this.rotation = 0;
            return _this;
        }
        RotatableRenderable.prototype.beginRender = function (ctx) {
            _super.prototype.beginRender.call(this, ctx);
            ctx.save();
            ctx.translate(this._position.x, this._position.y);
            ctx.rotate(this.rotation);
            ctx.translate(-this._position.x, -this._position.y);
        };
        RotatableRenderable.prototype.endRender = function (ctx) {
            _super.prototype.endRender.call(this, ctx);
            ctx.restore();
        };
        return RotatableRenderable;
    }(baseRenderable_8.BaseRenderable));
    exports.RotatableRenderable = RotatableRenderable;
});
define("system/drawing/text", ["require", "exports", "system/drawing/rotatableRenderable", "system/component/color"], function (require, exports, rotatableRenderable_1, color_9) {
    "use strict";
    var Text = (function (_super) {
        __extends(Text, _super);
        function Text(x, y, text, fillStyle, strokeStyle) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (text === void 0) { text = ''; }
            if (fillStyle === void 0) { fillStyle = color_9.default.black; }
            if (strokeStyle === void 0) { strokeStyle = color_9.default.white; }
            var _this = _super.call(this, x, y, fillStyle, strokeStyle) || this;
            _this.text = '';
            _this.font = '16px Monospace';
            _this.textAlign = exports.TextAlign.start;
            _this.textBaseLine = exports.TextBaseLine.alphabetic;
            _this.textDirection = exports.TextDirection.inherit;
            _this.text = text;
            return _this;
        }
        Text.prototype.render = function (ctx) {
            this.beginRender(ctx);
            ctx.font = this.font;
            ctx.textAlign = this.textAlign;
            ctx.textBaseline = this.textBaseLine;
            ctx.direction = this.textDirection;
            if (this.fill) {
                ctx.fillText(this.text, this.position.x, this.position.y);
            }
            if (this.stroke) {
                ctx.strokeText(this.text, this.position.x, this.position.y);
            }
        };
        Text.prototype.intersects = function (position) {
            return false;
        };
        return Text;
    }(rotatableRenderable_1.RotatableRenderable));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Text;
    exports.TextAlign = {
        start: 'start',
        end: 'end',
        left: 'left',
        right: 'right',
        center: 'center'
    };
    exports.TextBaseLine = {
        top: 'top',
        hanging: 'hanging',
        middle: 'middle',
        alphabetic: 'alphabetic',
        ideographic: 'ideographic',
        bottom: 'bottom',
    };
    exports.TextDirection = {
        ltr: 'ltr',
        rtl: 'rtl',
        inherit: 'inherit'
    };
});
define("system/helpers/array", ["require", "exports"], function (require, exports) {
    "use strict";
    function array_remove(source, item, count) {
        if (count === void 0) { count = -1; }
        var existingItem;
        var removedCount = 0;
        array_removeExt(source, function (existingItem) { return existingItem === item; }, count);
    }
    exports.array_remove = array_remove;
    function array_removeExt(source, comparator, count) {
        if (count === void 0) { count = -1; }
        var removedCount = 0;
        var existingItem;
        for (var i = source.length - 1; i >= 0; i--) {
            existingItem = source[i];
            if (comparator(existingItem)) {
                source.splice(i, 1);
                removedCount++;
                if (count != -1 && removedCount >= count) {
                    break;
                }
            }
        }
    }
    exports.array_removeExt = array_removeExt;
});
define("system/engine/simulation/hitpoint/hitpoints", ["require", "exports", "system/component/event/eventHandler", "system/helpers/math"], function (require, exports, eventHandler_5, math_4) {
    "use strict";
    var HitPoints = (function () {
        function HitPoints(value, max) {
            this._onChanged = new eventHandler_5.default();
            this.max = 1000;
            this.min = 0;
            this._value = value;
            this.max = max;
        }
        Object.defineProperty(HitPoints.prototype, "onChanged", {
            get: function () {
                return this._onChanged;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HitPoints.prototype, "value", {
            get: function () {
                return this._value;
            },
            set: function (value) {
                var oldValue = this._value;
                this._value = math_4.clamp(value, this.min, this.max);
                this.onChanged.trigger(this, oldValue, value);
            },
            enumerable: true,
            configurable: true
        });
        HitPoints.prototype.add = function (value) {
            this.value = math_4.clamp(this._value + value, this.min, this.max);
        };
        HitPoints.prototype.subtract = function (value) {
            this.add(-value);
        };
        Object.defineProperty(HitPoints.prototype, "isDead", {
            get: function () {
                return this._value == this.min;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HitPoints.prototype, "percentage", {
            get: function () {
                return this._value / this.max;
            },
            enumerable: true,
            configurable: true
        });
        return HitPoints;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = HitPoints;
});
define("system/engine/simulation/projectile/projectileSystemResult", ["require", "exports"], function (require, exports) {
    "use strict";
    var ProjectileSystemResult = (function () {
        function ProjectileSystemResult(owner, target, projectile) {
            this.owner = owner;
            this.target = target;
            this.projectile = projectile;
            this.died = this.target.hitpoints.isDead;
        }
        return ProjectileSystemResult;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ProjectileSystemResult;
});
define("system/engine/simulation/projectile/projectileSystemEntry", ["require", "exports", "system/engine/simulation/projectile/projectileSystemResult"], function (require, exports, projectileSystemResult_1) {
    "use strict";
    var ProjectileSystemEntry = (function () {
        function ProjectileSystemEntry(owner, targets) {
            this._owner = owner;
            this._targets = (targets instanceof Array ? targets : [targets]);
        }
        Object.defineProperty(ProjectileSystemEntry.prototype, "owner", {
            get: function () {
                return this._owner;
            },
            enumerable: true,
            configurable: true
        });
        ProjectileSystemEntry.prototype.update = function (system) {
            var result = [];
            var projectile;
            var target;
            for (var i = this._owner.projectiles.length - 1; i >= 0; i--) {
                projectile = this._owner.projectiles[i];
                for (var j = 0; j < this._targets.length; j++) {
                    target = this._targets[j];
                    if (target.isHitByProjectile(projectile)) {
                        target.hitpoints.subtract(projectile.damage);
                        var resultItem = new projectileSystemResult_1.default(this._owner, target, projectile);
                        result.push(resultItem);
                        this._owner.removeProjectile(projectile);
                        system.onProjectileHit.trigger(system, resultItem);
                    }
                }
            }
            return result;
        };
        return ProjectileSystemEntry;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ProjectileSystemEntry;
});
define("system/engine/simulation/projectile/projectileSystem", ["require", "exports", "system/component/event/eventHandler", "system/helpers/array"], function (require, exports, eventHandler_6, array_1) {
    "use strict";
    var ProjectileSystem = (function () {
        function ProjectileSystem() {
            this._entries = [];
            this._onProjectileHit = new eventHandler_6.default();
        }
        Object.defineProperty(ProjectileSystem.prototype, "onProjectileHit", {
            get: function () {
                return this._onProjectileHit;
            },
            enumerable: true,
            configurable: true
        });
        ProjectileSystem.prototype.update = function () {
            var result = [];
            var entry;
            for (var i = 0; i < this._entries.length; i++) {
                entry = this._entries[i];
                result = result.concat(entry.update(this));
            }
            return result;
        };
        ProjectileSystem.prototype.add = function (entry) {
            this._entries.push(entry);
        };
        ProjectileSystem.prototype.remove = function (entry) {
            array_1.array_remove(this._entries, entry);
        };
        ProjectileSystem.prototype.removeByOwner = function (owner) {
            var entry;
            for (var i = this._entries.length - 1; i >= 0; i--) {
                entry = this._entries[i];
                if (entry.owner === owner) {
                    this.remove(entry);
                }
            }
        };
        return ProjectileSystem;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ProjectileSystem;
});
define("spaceWars/projectile", ["require", "exports", "system/component/vector2d", "system/component/color", "system/drawing/circle"], function (require, exports, vector2d_8, color_10, circle_1) {
    "use strict";
    var Projectile = (function () {
        function Projectile(x, y) {
            var _this = this;
            this.damage = 100;
            this._radius = 2;
            this._fillStyle = color_10.default.white;
            this._strokeStyle = color_10.default.white;
            this.positionOnChanged = function (sender) {
                _this._update();
            };
            this._circle = new circle_1.default(x, y, this.radius, this.fillStyle, this.strokeStyle);
            this.position = new vector2d_8.default(x, y);
        }
        Object.defineProperty(Projectile.prototype, "radius", {
            get: function () {
                return this._radius;
            },
            set: function (value) {
                this._radius = value;
                this._update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Projectile.prototype, "position", {
            get: function () {
                return this._position;
            },
            set: function (value) {
                if (this._position != null) {
                    this._position.onChanged.unsubscribe(this.positionOnChanged);
                }
                this._position = value;
                this._position.onChanged.subscribe(this.positionOnChanged);
                this._update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Projectile.prototype, "velocity", {
            get: function () {
                return this._velocity;
            },
            set: function (value) {
                this._velocity = value;
                this._update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Projectile.prototype, "fillStyle", {
            get: function () {
                return this._fillStyle;
            },
            set: function (value) {
                this._fillStyle = value;
                this._update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Projectile.prototype, "strokeStyle", {
            get: function () {
                return this._strokeStyle;
            },
            set: function (value) {
                this._strokeStyle = value;
                this._update();
            },
            enumerable: true,
            configurable: true
        });
        Projectile.prototype.render = function (ctx) {
            this._circle.render(ctx);
        };
        Projectile.prototype._update = function () {
            this._circle.position.set(this._position);
            this._circle.radius = this._radius;
            this._circle.fillStyle = this._fillStyle;
            this._circle.strokeStyle = this._strokeStyle;
        };
        return Projectile;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Projectile;
});
define("system/engine/simulation/smoothedMovementSettings", ["require", "exports"], function (require, exports) {
    "use strict";
    var SmoothedMovementSettings = (function () {
        function SmoothedMovementSettings(maxVelocity, accelerationDistance, decelerationDistance, triggerDistance, accelerationExponent, decelerationExponent) {
            if (maxVelocity === void 0) { maxVelocity = 1.5; }
            if (accelerationDistance === void 0) { accelerationDistance = 50.0; }
            if (decelerationDistance === void 0) { decelerationDistance = 50.0; }
            if (triggerDistance === void 0) { triggerDistance = 1; }
            if (accelerationExponent === void 0) { accelerationExponent = 0.8; }
            if (decelerationExponent === void 0) { decelerationExponent = 0.8; }
            this.accelerationDistance = 50.0;
            this.decelerationDistance = 50.0;
            this.accelerationExponent = 0.8;
            this.decelerationExponent = 0.8;
            this.triggerDistance = 1;
            this.maxVelocity = 1.5;
            this.maxVelocity = maxVelocity;
            this.accelerationDistance = accelerationDistance;
            this.decelerationDistance = decelerationDistance;
            this.triggerDistance = triggerDistance;
            this.accelerationExponent = accelerationExponent;
            this.decelerationExponent = decelerationExponent;
        }
        return SmoothedMovementSettings;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SmoothedMovementSettings;
});
define("system/engine/simulation/SmoothedMovement", ["require", "exports", "system/component/vector2d", "system/engine/simulation/smoothedMovementSettings", "system/helpers/math"], function (require, exports, vector2D_1, smoothedMovementSettings_1, math_5) {
    "use strict";
    var SmoothedMovement = (function () {
        function SmoothedMovement(position) {
            var _this = this;
            this.update = function () {
                var settings = _this.settings;
                var distanceToStart = _this.startPosition.distanceTo(_this.position);
                var distanceToTarget = _this.targetPosition !== undefined ? _this.targetPosition.distanceTo(_this.position) : settings.triggerDistance;
                if (distanceToTarget <= settings.triggerDistance) {
                    var success = _this.updateTargetPosition();
                    if (!success) {
                        return;
                    }
                    _this.updateStartPosition();
                }
                var directionToTarget = _this.targetPosition.subtract(_this.position).normalized();
                if (distanceToStart <= distanceToTarget) {
                    var clampedDistance = math_5.clamp(distanceToStart, 0, settings.accelerationDistance);
                    var desiredVelocity = Math.max(Math.pow(clampedDistance / settings.accelerationDistance, settings.accelerationExponent) * settings.maxVelocity, 0.1);
                    _this.velocity = directionToTarget.multiply(desiredVelocity);
                }
                else {
                    var clampedDistance = math_5.clamp(distanceToTarget, 0, settings.decelerationDistance);
                    var desiredVelocity = Math.pow(clampedDistance / settings.decelerationDistance, settings.decelerationExponent) * settings.maxVelocity;
                    _this.velocity = directionToTarget.multiply(desiredVelocity);
                }
                var velocityMagnitude = _this.velocity.length();
                if (velocityMagnitude > settings.maxVelocity) {
                    _this.velocity = _this.velocity.normalized().multiply(settings.maxVelocity);
                }
                _this.position = _this.position.add(_this.velocity);
            };
            this.settings = new smoothedMovementSettings_1.default();
            this.velocity = new vector2D_1.default(0, 0);
            this.startPosition = new vector2D_1.default(position);
            this.position = new vector2D_1.default(position);
        }
        SmoothedMovement.prototype.updateTargetPosition = function () {
            var newPos = this.getNewTargetPosition();
            if (newPos.equals(this.targetPosition)) {
                return false;
            }
            this._setTargetPosition(newPos);
            return true;
        };
        SmoothedMovement.prototype.updateStartPosition = function () {
            this.startPosition.set(this.position);
        };
        SmoothedMovement.prototype._setTargetPosition = function (position) {
            if (!position.equals(this.targetPosition)) {
                this.targetPosition = position;
            }
        };
        return SmoothedMovement;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SmoothedMovement;
});
define("system/engine/simulation/hitpoint/hitpointBar", ["require", "exports", "system/component/size", "system/component/vector2d", "system/component/color", "system/drawing/rectangle"], function (require, exports, size_3, vector2D_2, color_11, rectangle_2) {
    "use strict";
    var HitpointBar = (function () {
        function HitpointBar(width, height, owner, offsetX, offsetY) {
            if (offsetX === void 0) { offsetX = 0; }
            if (offsetY === void 0) { offsetY = -50; }
            var _this = this;
            this._size = undefined;
            this._offset = undefined;
            this._centerOffset = new vector2D_2.default(0, 0);
            this._progressOffset = new vector2D_2.default(0, 0);
            this.visible = true;
            this.center = true;
            this.sizeOnChanged = function (sender) {
                _this.update();
            };
            this.onOffsetChanged = function (sender) {
                _this.update();
            };
            this._size = new size_3.default(width, height);
            this._offset = new vector2D_2.default(offsetX, offsetY);
            this._owner = owner;
            this.base = new HitpointBarBase(color_11.default.white, color_11.default.white, 1, this);
            this.progress = new HitpointBarProgress(color_11.default.black, color_11.default.black, 0, this);
            this.base.transparency = 0.2;
            this.progress.transparency = 0.5;
        }
        Object.defineProperty(HitpointBar.prototype, "offset", {
            get: function () {
                return this._offset;
            },
            set: function (value) {
                if (this._offset !== undefined) {
                    this._offset.onChanged.unsubscribe(this.onOffsetChanged);
                }
                this._offset = value;
                this._offset.onChanged.subscribe(this.onOffsetChanged);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HitpointBar.prototype, "size", {
            get: function () {
                return this._size;
            },
            set: function (value) {
                if (this._size !== undefined) {
                    this._size.onChanged.unsubscribe(this.sizeOnChanged);
                }
                this._size = value;
                this.update();
                this._size.onChanged.subscribe(this.sizeOnChanged);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HitpointBar.prototype, "owner", {
            get: function () {
                return this._owner;
            },
            enumerable: true,
            configurable: true
        });
        HitpointBar.prototype.getProgressWidth = function () {
            var baseRect = this.base.rectangle;
            return (baseRect.width - (2 * baseRect.lineWidth)) * this.owner.hitpoints.percentage;
        };
        HitpointBar.prototype.getProgressHeight = function () {
            var baseRect = this.base.rectangle;
            return (baseRect.height - (2 * baseRect.lineWidth));
        };
        HitpointBar.prototype.update = function () {
            var baseRect = this.base.rectangle;
            this._progressOffset.x = baseRect.lineWidth;
            this._progressOffset.y = baseRect.lineWidth;
            this._centerOffset.x = -(this._size.width / 2);
            baseRect.width = this._size.width;
            baseRect.height = this._size.height;
            var progressRect = this.progress.rectangle;
            progressRect.height = this.getProgressHeight();
            progressRect.width = this.getProgressWidth();
            baseRect.position = this.owner.position.add(this._offset.add(this._centerOffset));
            progressRect.position = baseRect.position.add(this._progressOffset);
            this.base.update();
            this.progress.update();
        };
        HitpointBar.prototype.render = function (ctx) {
            if (this.visible) {
                this.base.render(ctx);
                this.progress.render(ctx);
            }
        };
        return HitpointBar;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = HitpointBar;
    var HitpointBarElement = (function () {
        function HitpointBarElement(fillStyle, strokeStyle, lineWidth, parent) {
            this._transparency = 1.0;
            this.rectangle = new rectangle_2.default(0, 0, 0, 0);
            this.rectangle.origin = rectangle_2.RectangleOrigin.TopLeft;
            this.rectangle.fillStyle = fillStyle;
            this.rectangle.strokeStyle = strokeStyle;
            this.rectangle.lineWidth = lineWidth;
            this._parent = parent;
        }
        Object.defineProperty(HitpointBarElement.prototype, "transparency", {
            get: function () {
                return this._transparency;
            },
            set: function (value) {
                this._transparency = value;
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        HitpointBarElement.prototype.render = function (ctx) {
            this.rectangle.render(ctx);
        };
        HitpointBarElement.prototype.update = function () {
            this.rectangle.fillStyle.alpha = this._transparency;
            this.rectangle.strokeStyle.alpha = this._transparency;
        };
        return HitpointBarElement;
    }());
    exports.HitpointBarElement = HitpointBarElement;
    var HitpointBarBase = (function (_super) {
        __extends(HitpointBarBase, _super);
        function HitpointBarBase(fillStyle, strokeStyle, lineWidth, parent) {
            var _this = _super.call(this, fillStyle, strokeStyle, lineWidth, parent) || this;
            _this.rectangle.stroke = false;
            return _this;
        }
        return HitpointBarBase;
    }(HitpointBarElement));
    exports.HitpointBarBase = HitpointBarBase;
    var HitpointBarProgress = (function (_super) {
        __extends(HitpointBarProgress, _super);
        function HitpointBarProgress(fillStyle, strokeStyle, lineWidth, parent) {
            var _this = _super.call(this, fillStyle, strokeStyle, lineWidth, parent) || this;
            _this.rectangle.stroke = false;
            return _this;
        }
        return HitpointBarProgress;
    }(HitpointBarElement));
    exports.HitpointBarProgress = HitpointBarProgress;
});
define("system/component/kickerMessage/kickerMessage", ["require", "exports", "system/component/vector2d", "system/drawing/text", "system/helpers/math"], function (require, exports, vector2d_9, text_1, math_6) {
    "use strict";
    var KickerMessage = (function () {
        function KickerMessage(owner, text) {
            this._lifeTicks = 0;
            this.followOwner = true;
            this.owner = owner;
            this.text = new text_1.default(this.owner.position.x, this.owner.position.y, text);
            this.velocity = new vector2d_9.default(0, -1);
            this.velocityStep = new vector2d_9.default(0, -1);
            this.lifeTime = 100;
        }
        Object.defineProperty(KickerMessage.prototype, "isFinished", {
            get: function () {
                return this._lifeTicks >= this.lifeTime;
            },
            enumerable: true,
            configurable: true
        });
        KickerMessage.prototype.render = function (ctx) {
            this.text.render(ctx);
        };
        KickerMessage.prototype.update = function () {
            if (this.followOwner) {
                this.text.position = this.owner.position.add(this.velocity);
            }
            else {
                this.text.position = this.text.position.add(this.velocity);
            }
            this.velocity = this.velocity.add(this.velocityStep);
            this._lifeTicks++;
            var alpha = math_6.map(this._lifeTicks, 0, this.lifeTime, 1, 0);
            this.text.fillStyle.alpha = alpha;
            this.text.strokeStyle.alpha = alpha;
        };
        return KickerMessage;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = KickerMessage;
});
define("system/component/kickerMessage/kickerMessageManager", ["require", "exports", "system/helpers/array"], function (require, exports, array_2) {
    "use strict";
    var KickerMessageManager = (function () {
        function KickerMessageManager() {
            this._messages = [];
        }
        KickerMessageManager.prototype.add = function (message) {
            this._messages.push(message);
        };
        KickerMessageManager.prototype.update = function () {
            var message;
            for (var i = this._messages.length - 1; i >= 0; i--) {
                message = this._messages[i];
                message.update();
                if (message.isFinished) {
                    array_2.array_remove(this._messages, message);
                }
            }
        };
        KickerMessageManager.prototype.render = function (ctx) {
            var message;
            for (var i = 0; i < this._messages.length; i++) {
                message = this._messages[i];
                message.render(ctx);
            }
        };
        return KickerMessageManager;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = KickerMessageManager;
});
define("spaceWars/player", ["require", "exports", "system/component/color", "system/drawing/rectangle", "system/component/vector2d", "system/drawing/regularPolygon", "system/drawing/circle", "spaceWars/projectile", "system/helpers/math", "system/helpers/array", "system/engine/simulation/SmoothedMovement", "system/engine/simulation/hitpoint/hitpoints", "system/engine/simulation/hitpoint/hitpointBar", "system/component/kickerMessage/kickerMessageManager", "system/component/kickerMessage/kickerMessage"], function (require, exports, color_12, rectangle_3, vector2d_10, regularPolygon_1, circle_2, projectile_1, math_7, array_3, SmoothedMovement_1, hitpoints_1, hitpointBar_1, kickerMessageManager_1, kickerMessage_1) {
    "use strict";
    var Player = (function () {
        function Player(x, y, bounds, hitpoints) {
            var _this = this;
            this._messages = new kickerMessageManager_1.default();
            this._rotation = 0;
            this._radius = 50;
            this.projectiles = [];
            this.bounds = new rectangle_3.default(0, 0, 0, 0);
            this.aimZoneRadius = 125;
            this.aimZoneEnabled = false;
            this.mouseInAimZone = false;
            this.isAimingMode = false;
            this.projectileDamage = 100;
            this._fillStyle = new color_12.default(255, 255, 255, 1);
            this._strokeStyle = new color_12.default(255, 0, 0, 1);
            this.hitpointsOnChanged = function (sender, oldValue, newValue) {
                var alpha = math_7.map(_this.hitpoints.value, 0, _this.hitpoints.max, 0.1, 1);
                _this.fillStyle.alpha = alpha;
                _this.strokeStyle.alpha = alpha;
                _this._circle.fillStyle.alpha = alpha;
                _this._circle.strokeStyle.alpha = alpha;
                var diff = newValue - oldValue;
                var message = new kickerMessage_1.default(_this, diff + " HP");
                message.text.fillStyle = (diff < 0 ? color_12.default.red : color_12.default.green);
                message.text.stroke = false;
                _this._messages.add(message);
            };
            this._getNewTargetPosition = function () {
                return new vector2d_10.default(_this.targetPosition);
            };
            this.positionOnChanged = function (sender) {
                _this._update();
            };
            this._triangle = new regularPolygon_1.default(x, y, this.radius, 3, this._fillStyle, this._strokeStyle);
            this._circle = new circle_2.default(x, y, 5, color_12.default.red, color_12.default.white);
            this._aimZoneCircle = new circle_2.default(x, y, this.aimZoneRadius, color_12.default.black, new color_12.default(255, 255, 255, 0.1));
            this._aimZoneCircle.lineDash = [2, 16];
            this._aimZoneCircle.fill = false;
            this.position = new vector2d_10.default(x, y);
            this.bounds = bounds;
            this._movement = new SmoothedMovement_1.default(this.position);
            this._movement.getNewTargetPosition = this._getNewTargetPosition;
            this.targetPosition = new vector2d_10.default(x, y);
            this.hitpoints = new hitpoints_1.default(hitpoints, hitpoints);
            this.hitpoints.onChanged.subscribe(this.hitpointsOnChanged);
            this._hpBar = new hitpointBar_1.default(100, 10, this, 0, -100);
        }
        Object.defineProperty(Player.prototype, "targetPosition", {
            get: function () {
                return this._targetPosition;
            },
            set: function (value) {
                this._targetPosition = value;
                this._movement.updateTargetPosition();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "radius", {
            get: function () {
                return this._radius;
            },
            set: function (value) {
                this._radius = value;
                this._update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "rotation", {
            get: function () {
                return this._rotation;
            },
            set: function (value) {
                this._rotation = value;
                this._update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "position", {
            get: function () {
                return this._position;
            },
            set: function (value) {
                if (this._position != null) {
                    this._position.onChanged.unsubscribe(this.positionOnChanged);
                }
                this._position = value;
                this._position.onChanged.subscribe(this.positionOnChanged);
                this._update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "fillStyle", {
            get: function () {
                return this._fillStyle;
            },
            set: function (value) {
                this._fillStyle = value;
                this._updateStyles();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "strokeStyle", {
            get: function () {
                return this._strokeStyle;
            },
            set: function (value) {
                this._strokeStyle = value;
                this._updateStyles();
            },
            enumerable: true,
            configurable: true
        });
        Player.prototype._updateStyles = function () {
            this._triangle.fillStyle = this._fillStyle;
            this._triangle.strokeStyle = this._strokeStyle;
        };
        Player.prototype._update = function () {
            this._triangle.position = this._position;
            this._triangle.rotation = this._rotation;
            this._aimZoneCircle.position = this._position;
            this._circle.position = this._position.getOffsetTowardsAngle(this.radius, this._rotation);
        };
        Player.prototype.render = function (ctx) {
            if (this.aimZoneEnabled && this.mouseInAimZone) {
                this._aimZoneCircle.render(ctx);
            }
            var rotation = this._triangle.rotation;
            this._triangle.rotation = math_7.normalizeRadians(this._triangle.rotation + Math.PI);
            this._triangle.render(ctx);
            this._triangle.rotation = rotation;
            this._circle.render(ctx);
            var projectile;
            for (var i = 0; i < this.projectiles.length; i++) {
                projectile = this.projectiles[i];
                projectile.render(ctx);
            }
            this._hpBar.render(ctx);
            this._messages.render(ctx);
        };
        Player.prototype.intersects = function (position) {
            return this._triangle.intersects(position);
        };
        Player.prototype.shoot = function () {
            var projectile = new projectile_1.default(this._circle.x, this._circle.y);
            projectile.damage = this.projectileDamage;
            projectile.velocity = this._circle.position.subtract(this._circle.position.getOffsetTowardsAngle(-4, this._rotation));
            this.projectiles.push(projectile);
        };
        Player.prototype.update = function () {
            this._messages.update();
            this._hpBar.update();
            if (this.mouseInAimZone) {
                this._movement.updateStartPosition();
            }
            this._movement.update();
            this.position.set(this._movement.position);
            var projectile;
            for (var i = this.projectiles.length - 1; i >= 0; i--) {
                projectile = this.projectiles[i];
                projectile.position = projectile.position.add(projectile.velocity);
                if (!this.bounds.intersects(projectile.position)) {
                    this.projectiles.splice(i, 1);
                }
            }
        };
        Player.prototype.removeProjectile = function (projectile) {
            array_3.array_remove(this.projectiles, projectile);
        };
        Player.prototype.isHitByProjectile = function (projectile) {
            return this.intersects(projectile.position);
        };
        return Player;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Player;
});
define("spaceWars/enemy", ["require", "exports", "spaceWars/player", "system/component/vector2d", "system/drawing/circle", "system/component/color", "system/component/padding"], function (require, exports, player_1, vector2d_11, circle_3, color_13, padding_1) {
    "use strict";
    var Enemy = (function (_super) {
        __extends(Enemy, _super);
        function Enemy(x, y, bounds, hitpoints) {
            var _this = _super.call(this, x, y, bounds, hitpoints) || this;
            _this.targetPosition = undefined;
            _this.velocity = new vector2d_11.default(0, 0);
            _this._randomPosPadding = new padding_1.default(100);
            _this.projectileDamage = 250;
            _this._getNewTargetPosition = function () {
                var pos = _this.bounds.getRandomPosition(_this._randomPosPadding);
                _this._targetPosCircle.position = pos;
                return pos;
            };
            _this._targetPosCircle = new circle_3.default(0, 0, 5, color_13.default.yellow, color_13.default.white);
            _this._movement.getNewTargetPosition = _this._getNewTargetPosition;
            _this._movement.updateTargetPosition();
            return _this;
        }
        Enemy.prototype.render = function (ctx) {
            _super.prototype.render.call(this, ctx);
        };
        Enemy.prototype.update = function () {
            _super.prototype.update.call(this);
        };
        return Enemy;
    }(player_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Enemy;
});
define("system/sound/sound", ["require", "exports", "system/helpers/array"], function (require, exports, array_4) {
    "use strict";
    var Sound = (function () {
        function Sound(url) {
            var _this = this;
            this._audioPlayers = [];
            this._url = '';
            this._isLoaded = false;
            this._volume = 1.0;
            this.maxChannels = 32;
            this.onLoaded = function (e) { };
            this._canPlayThrough = function (e) {
                _this._isLoaded = true;
                _this.onLoaded(e);
            };
            this.onAudioEnded = function (e) {
                array_4.array_remove(_this._audioPlayers, e.srcElement);
            };
            this._url = url;
            this._initialAudioPlayer = new Audio(this.url);
            this._initialAudioPlayer.addEventListener('canplaythrough', this._canPlayThrough);
        }
        Object.defineProperty(Sound.prototype, "count", {
            get: function () {
                return this._audioPlayers.length;
            },
            enumerable: true,
            configurable: true
        });
        Sound.prototype.isPlaying = function () {
            return this.count > 0;
        };
        Object.defineProperty(Sound.prototype, "url", {
            get: function () {
                return this._url;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sound.prototype, "volume", {
            get: function () {
                return this._volume;
            },
            set: function (value) {
                this._volume = value;
                this._updateVolume();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sound.prototype, "isLoaded", {
            get: function () {
                return this._isLoaded;
            },
            enumerable: true,
            configurable: true
        });
        Sound.prototype.play = function () {
            if (this._isLoaded && this._audioPlayers.length < this.maxChannels) {
                var player = new Audio(this.url);
                player.volume = this.volume;
                player.play();
                player.addEventListener('ended', this.onAudioEnded);
                this._audioPlayers.push(player);
                return true;
            }
            else {
                return false;
            }
        };
        Sound.prototype._updateVolume = function () {
            var audioPlayer;
            for (var i = 0; i < this.count; i++) {
                audioPlayer = this._audioPlayers[i];
                audioPlayer.volume = this._volume;
            }
        };
        return Sound;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Sound;
});
define("spaceWars", ["require", "exports", "system/engine/gameEngine", "system/drawing/rectangle", "system/drawing/circle", "system/drawing/text", "system/drawing/polygon", "system/component/color", "system/component/vector2d", "system/component/padding", "system/component/random", "system/helpers/math", "system/helpers/array", "spaceWars/player", "spaceWars/enemy", "system/engine/simulation/projectile/projectileSystem", "system/engine/simulation/projectile/projectileSystemEntry", "system/sound/sound"], function (require, exports, gameEngine_1, rectangle_4, circle_4, text_2, polygon_5, color_14, vector2d_12, padding_2, random_4, math_8, array_5, player_2, enemy_1, projectileSystem_1, projectileSystemEntry_1, sound_1) {
    "use strict";
    var enableKills = true;
    var enemyCanShoot = false;
    var engine = new gameEngine_1.default(230, 640);
    engine.fullScreenPrompt = true;
    var player;
    var text = new text_2.default(20, 50, '', color_14.default.white, color_14.default.black);
    var fpsText = new text_2.default(10, 10, '0 fps', color_14.default.white);
    fpsText.stroke = false;
    text.stroke = false;
    text.font = '32px Monospace';
    var rotationStep = Math.PI * 0.01;
    var damagePerShot = 0.1;
    var won = false;
    var lost = false;
    var score = 0;
    var rect;
    var projectileSystem;
    var audio = new Audio('sound/damage_01.mp3');
    var audio2 = new Audio('sound/damage_01.mp3');
    var takeHitSound = new sound_1.default('sound/damage_01.mp3');
    takeHitSound.volume = 0.01;
    var shootSound = new sound_1.default('sound/shoot_01.mp3');
    shootSound.volume = 0.01;
    var polygon;
    var circle;
    var maxEnemies = 3;
    var enemies = [];
    var scoreText;
    var onProjectileHit = function (sender, result) {
        takeHitSound.play();
        if (result.owner == player && result.died) {
            score++;
        }
    };
    engine.init = function () {
        scoreText = new text_2.default(10, engine.height - 20, 'Score: 0', color_14.default.white);
        scoreText.stroke = false;
        rect = new rectangle_4.default(engine.width / 2, engine.height / 2, 50, 500, color_14.default.random(), color_14.default.random());
        projectileSystem = new projectileSystem_1.default();
        player = new player_2.default(engine.width / 2, engine.height / 2, engine.bounds, 1000);
        player.fillStyle = color_14.default.green;
        player.strokeStyle = color_14.default.white;
        player.projectileDamage = 10;
        enemyDied(null);
        projectileSystem.onProjectileHit.subscribe(onProjectileHit);
        polygon = new polygon_5.default(color_14.default.random(), color_14.default.random());
        circle = new circle_4.default(0, 0, 5, color_14.default.red, color_14.default.white);
        for (var i = 0; i < 10; i++) {
        }
    };
    var enemyDied = function (deadEnemy, spawnNew) {
        if (spawnNew === void 0) { spawnNew = true; }
        if (deadEnemy !== undefined) {
            projectileSystem.removeByOwner(deadEnemy);
            array_5.array_remove(enemies, deadEnemy);
        }
        projectileSystem.removeByOwner(player);
        if (spawnNew) {
            var enemyPos = void 0;
            var tooClose = true;
            var attempts = 0;
            var maxAttempts = 1000;
            do {
                enemyPos = engine.getRandomPosition(new padding_2.default(100));
                tooClose = enemyPos.distanceTo(player.position) <= engine.width * 0.33;
                attempts++;
                if (attempts == maxAttempts) {
                    return;
                }
            } while (tooClose);
            console.log('Spawned after ' + attempts + ' attempts.');
            var newEnemy = new enemy_1.default(enemyPos.x, enemyPos.y, engine.bounds, 100);
            newEnemy.projectileDamage = 1;
            newEnemy.fillStyle = new color_14.default(150, 0, 0, 1);
            enemies.push(newEnemy);
            projectileSystem.add(new projectileSystemEntry_1.default(newEnemy, player));
            projectileSystem.add(new projectileSystemEntry_1.default(newEnemy, enemies));
        }
        projectileSystem.add(new projectileSystemEntry_1.default(player, enemies));
    };
    engine.windowResize = function (e) {
        scoreText.y = engine.height - 20;
    };
    engine.keyDown = function (e) { };
    engine.mouseMove = function (e) {
        if (player.aimZoneEnabled) {
            var mouseDist = engine.mousePos.distanceTo(player.position);
            player.mouseInAimZone = mouseDist <= player.aimZoneRadius;
            if (player.mouseInAimZone && !player.isAimingMode) {
                player.isAimingMode = true;
                player.targetPosition = new vector2d_12.default(engine.mousePos);
            }
            else if (!player.mouseInAimZone) {
                player.isAimingMode = false;
                player.targetPosition = engine.mousePos;
            }
        }
        else {
            player.targetPosition = engine.mousePos;
        }
    };
    engine.click = function (e) {
        if (!lost) {
            player.shoot();
            shootSound.play();
        }
        var randomPos = polygon.getRandomPosition();
        if (randomPos != null) {
            circle.position = randomPos;
        }
    };
    engine.render = function (ctx) {
        scoreText.render(ctx);
        polygon.render(ctx);
        if (!lost) {
            player.render(ctx);
        }
        if (!won) {
            for (var _i = 0, enemies_1 = enemies; _i < enemies_1.length; _i++) {
                var enemy = enemies_1[_i];
                enemy.render(ctx);
            }
        }
        text.render(ctx);
    };
    engine.tick = function () {
        scoreText.text = 'Score: ' + score;
        fpsText.text = engine.fps + ' fps';
        if (polygon_5.default.intersects2(polygon.vertices, engine.mousePos)) {
            polygon.fillStyle = color_14.default.red;
        }
        else {
            polygon.fillStyle = color_14.default.green;
        }
        player.rotation = math_8.normalizeRadians(player.position.getAngleTowardsVector(engine.mousePos));
        for (var _i = 0, enemies_2 = enemies; _i < enemies_2.length; _i++) {
            var enemy = enemies_2[_i];
            enemy.rotation = math_8.normalizeRadians(enemy.position.getAngleTowardsVector(player.position));
            enemy.update();
            if (enemy.hitpoints.isDead && won == false && lost == false) {
                enemyDied(enemy, false);
            }
            var dist = player.position.distanceTo(enemy.position);
            if (!lost && !won) {
                var result = projectileSystem.update();
                if (enemyCanShoot && random_4.default.next(0, dist / 10) == 1) {
                    enemy.shoot();
                    shootSound.play();
                }
            }
        }
        player.update();
        if (player.hitpoints.isDead && lost == false && won == false) {
            lost = true;
            text.text = 'You are dead. Reload the page to play again.';
            text.fillStyle = color_14.default.red;
        }
    };
    window.setTimeout(function () {
        enemyCanShoot = true;
    }, 2000);
    window.setInterval(function () {
        if (enemies.length < maxEnemies) {
            enemyDied(null);
        }
    }, 3000);
    engine.run();
});
define("system/engine/gameEntity", ["require", "exports", "system/component/vector2d"], function (require, exports, vector2d_13) {
    "use strict";
    var GameEntity = (function () {
        function GameEntity(x, y) {
            this.position = new vector2d_13.default(x, y);
            this.velocity = new vector2d_13.default(0, 0);
        }
        GameEntity.prototype.update = function () {
            this.position.add(this.velocity);
            this.velocity.subtract(this.gravity);
        };
        return GameEntity;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GameEntity;
});
define("system/testClass", ["require", "exports", "system/component/event/eventHandler"], function (require, exports, eventHandler_7) {
    "use strict";
    var Animal = (function () {
        function Animal() {
            this._name = 'Animal';
            this._onNameChanged = new eventHandler_7.default();
            this.nameOnChanged = function (sender) {
                console.log('name_onChanged from Animal');
            };
            this.onNameChanged.subscribe(this.nameOnChanged);
        }
        Object.defineProperty(Animal.prototype, "onNameChanged", {
            get: function () {
                return this._onNameChanged;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animal.prototype, "name", {
            get: function () {
                return this._name;
            },
            set: function (value) {
                this._name = value;
                this.onNameChanged.trigger(this);
            },
            enumerable: true,
            configurable: true
        });
        return Animal;
    }());
    exports.Animal = Animal;
    var Horse = (function (_super) {
        __extends(Horse, _super);
        function Horse() {
            var _this = _super.call(this) || this;
            _this._name = 'Horse';
            _this.nameOnChanged = function (sender) {
                console.log('name_onChanged from Horse');
            };
            return _this;
        }
        Object.defineProperty(Horse.prototype, "name", {
            get: function () {
                return this._name;
            },
            set: function (value) {
                this._name = value;
                this.onNameChanged.trigger(this);
            },
            enumerable: true,
            configurable: true
        });
        return Horse;
    }(Animal));
    exports.Horse = Horse;
});
//# sourceMappingURL=combined.js.map