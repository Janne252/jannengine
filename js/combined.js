var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define("engine/inputProvider", ["require", "exports"], function (require, exports) {
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
define("system/event/eventHandlerCallbackBind", ["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * Represents a singular binded handler function.
     */
    var EventHandlerCallbackBind = (function () {
        /**
         * Creates a new instance of EventHandlerCallbackBind.
         * Handler cannot be a method! Handler must be a property that is an arrow function, e.g. myHanlder = (sender:any):void => {}
         * @param handler Handler function.
         */
        function EventHandlerCallbackBind(handler) {
            this.sourceFunction = handler;
            this.handler = handler;
        }
        return EventHandlerCallbackBind;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = EventHandlerCallbackBind;
});
define("system/event/eventHandler", ["require", "exports", "system/event/eventHandlerCallbackBind"], function (require, exports, eventHandlerCallbackBind_1) {
    "use strict";
    /**
     * Represents a collection of subscribed listeners that all get notified when the EventHandler gets trigger()'d.
     */
    var EventHandler = (function () {
        /**
         * Creates a new instance of EventHandler.
         */
        function EventHandler() {
            this._binds = [];
        }
        Object.defineProperty(EventHandler.prototype, "count", {
            /**
             * count of subscribed listers.
             */
            get: function () {
                return this._binds.length;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Subscribe a new listener. Handler cannot be a method! Handler must be a property that is an arrow function,
         * e.g. myHanlder = (sender:any):void => {}
         * @param owner The owner of the handler method.
         * @param handler Handler to add as a new subscriber.
         */
        EventHandler.prototype.subscribe = function (handler) {
            this._binds.push(new eventHandlerCallbackBind_1.default(handler));
        };
        /**
         * Unsubscribes a handler. Handler cannot be a method! Handler must be a property that is an arrow function,
         * e.g. myHanlder = (sender:any):void => {}
         * @param handler The handler to unsubscribe.
         */
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
        /**
         * Calls all subscribed handlers with the passed arguments.
         * @param sender Sender of the trigger call that is passed as the sender.
         * @param ...args Additional parameters to pass.
         */
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
        //Normalize angle
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
    function lerp(startValue, targetValue, stepPercentage) {
        return startValue * (1 - stepPercentage) + targetValue * stepPercentage;
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
        return minOrMax(true, selector, items);
    }
    exports.min = min;
    function max(selector, items) {
        return minOrMax(false, selector, items);
    }
    exports.max = max;
    function minOrMax(min, selector, items) {
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
define("system/drawing/vector2d", ["require", "exports", "system/event/eventHandler", "system/helpers/math"], function (require, exports, eventHandler_1, math_1) {
    "use strict";
    /**
     * Represents a 2-dimensional vector that has the components x and y.
     */
    var Vector2D = (function () {
        function Vector2D(xOrVector, y) {
            this._x = 0;
            this._y = 0;
            this._onChanged = new eventHandler_1.default();
            this._x = Vector2D._xFromVectorOrNumber(xOrVector);
            this._y = Vector2D._yFromVectorOrNumber(xOrVector, y);
        }
        Object.defineProperty(Vector2D.prototype, "onChanged", {
            /**
             * EventHandler that is triggered when the x or y component is changed.
             */
            get: function () {
                return this._onChanged;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector2D.prototype, "x", {
            /**
             * The x component of the vector.
             */
            get: function () {
                return this._x;
            },
            /**
             * The x component of the vector.
             */
            set: function (value) {
                var previous = this._x;
                this._x = value;
                this.onChanged.trigger(this, previous, this._y);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector2D.prototype, "y", {
            /**
             * The y component of the vector.
             */
            get: function () {
                return this._y;
            },
            /**
             * The y component of the vector.
             */
            set: function (value) {
                var previous = this._y;
                this._y = value;
                this.onChanged.trigger(this, this._x, previous);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Adds a vector to a vector (x + x, y + y).
         * @param vector The vector to add.
         * @returns Returns the result vector.
         */
        Vector2D.prototype.add = function (vector) {
            return new Vector2D(this.x + vector.x, this.y + vector.y);
        };
        /**
         * Subtracts a vector from the vector (x - x, y - y).
         * @param vector The vector to subtract.
         * @returns Returns the result vector.
         */
        Vector2D.prototype.subtract = function (vector) {
            return new Vector2D(this.x - vector.x, this.y - vector.y);
        };
        /**
         * Mulitplies the vector with a mulitplier.
         * @param multiplier The multiplier.
         * @returns Returns the result vector.
         */
        Vector2D.prototype.multiply = function (multiplier) {
            return new Vector2D(this.x * multiplier, this.y * multiplier);
        };
        /**
         * Sets the vector's x and y components to the values of a vector.
         * @param vector The vector to copy the x and y components from.
         */
        Vector2D.prototype.set = function (vector) {
            this.x = vector.x;
            this.y = vector.y;
        };
        /**
         * Linerry interpolates the vector x and y components towards a vector by a step percentage.
         * @param vector The vector to lerp towards.
         * @param stepPercentage The step percentage.
         * @returns Returns the result vector.
         */
        Vector2D.prototype.lerp = function (vector, stepPercentage) {
            var targetX = vector.x;
            var targetY = vector.y;
            return new Vector2D(math_1.lerp(this.x, targetX, stepPercentage), math_1.lerp(this.y, targetY, stepPercentage));
        };
        /**
         * Returns a copy of the current vector that is moved towards an angle by an offset.
         * @param offset The distance to move the vector.
         * @param angle The angle in radians.
         * @returns Returns the result vector.
         */
        Vector2D.prototype.getOffsetTowardsAngle = function (offset, angle) {
            return new Vector2D(this.x + offset * Math.cos(angle), this.y + offset * Math.sin(angle));
        };
        Vector2D.prototype.getAngleTowardsVector = function (xOrVector, y) {
            var targetX = Vector2D._xFromVectorOrNumber(xOrVector);
            var targetY = Vector2D._yFromVectorOrNumber(xOrVector, y);
            return Math.atan2(targetY - this.y, targetX - this.x);
        };
        /**
         * Returns a copy of the current vector that is moved towards a vector by an offset.
         * @param offset The distance to move the vector.
         * @param vector The vector to move towads.
         * @param overshoot Wheter or not going past the target vector is allowed.
         * @returns The result vector.
         */
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
        /**
         * Calculates the length of the vector.
         * @returns Returns the length of the vector.
         */
        Vector2D.prototype.length = function () {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        };
        /**
         * @returns Returns the normalized vector of the vector.
         */
        Vector2D.prototype.normalized = function () {
            var length = this.length();
            return length == 0 ? new Vector2D(0, 0) : new Vector2D(this.x / length, this.y / length);
        };
        /**
         * Checks if a vector has the same x and y components as another vector.
         * @param vector The vector to check against.
         * @returns Returns true if the vectors have the same components.
         */
        Vector2D.prototype.equals = function (vector) {
            return vector !== undefined && this.x === vector.x && this.y === vector.y;
        };
        /**
         * Creates a copy of the current Vector2D and returns it.
         */
        Vector2D.prototype.copy = function () {
            return new Vector2D(this);
        };
        /**
         * Converts the vector to a string representation.
         * @returns Returns the string.
         */
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
define("system/drawing/size", ["require", "exports", "system/event/eventHandler"], function (require, exports, eventHandler_2) {
    "use strict";
    /**
     * Represents a 2-dimensional size (width and height).
     */
    var Size = (function () {
        function Size(sizeOrWidth, height) {
            this._width = 0;
            this._height = 0;
            this._onChanged = new eventHandler_2.default();
            this.width = sizeOrWidth instanceof Size ? sizeOrWidth.width : sizeOrWidth !== undefined ? sizeOrWidth : 0;
            this.height = height !== undefined ? height : 0;
        }
        Object.defineProperty(Size.prototype, "onChanged", {
            /**
             * The event handler that reacts to the changes of width and height properties.
             */
            get: function () {
                return this._onChanged;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Size.prototype, "width", {
            /**
             * The width of the size.
             */
            get: function () {
                return this._width;
            },
            /**
             * The width of the size.
             */
            set: function (value) {
                var previousWidth = this._width;
                this._width = value;
                this._onChanged.trigger(this, previousWidth, this._height);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Size.prototype, "height", {
            /**
             * The height of the size.
             */
            get: function () {
                return this._height;
            },
            /**
             * The height of the size.
             */
            set: function (value) {
                var previousHeight = this._height;
                this._height = value;
                this._onChanged.trigger(this, this._width, previousHeight);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Size.prototype, "area", {
            /**
             * The area of the size.
             */
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
define("system/random", ["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * Utility class for generating random numbers.
     */
    var Random = (function () {
        function Random() {
        }
        /**
         * Generates an integer between the provided numbers.
         * @param min Value range minimum.
         * @param max Value range maximum.
         * @returns The randomly selected integer.
         */
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
define("system/drawing/color", ["require", "exports", "system/random"], function (require, exports, random_1) {
    "use strict";
    var Color = (function () {
        function Color(rOrColor, g, b, alpha) {
            this.r = 0;
            this.g = 0;
            this.b = 0;
            this.alpha = 1;
            if (rOrColor instanceof Color) {
                this.r = rOrColor.r;
                this.g = rOrColor.g;
                this.b = rOrColor.b;
                this.alpha = rOrColor.alpha;
            }
            else {
                var r = rOrColor;
                this.r = r !== undefined ? r : 0;
                this.g = g !== undefined ? g : 0;
                this.b = b !== undefined ? b : 0;
                this.alpha = alpha !== undefined ? alpha : 1;
            }
        }
        Color.prototype.toCSS = function () {
            return "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + this.alpha + ")";
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
define("system/drawing/renderable", ["require", "exports", "system/drawing/vector2d", "system/drawing/color"], function (require, exports, vector2d_1, color_1) {
    "use strict";
    /**
     * Represents a renderable object.
     */
    var Renderable = (function () {
        /**
         * Creates a new instance of Renderable.
         * @param x The x component of the position.
         * @param y The y component of the position.
         * @param fillStyle Color used as the CanvasRenderingContext2D.fillStyle.
         * @param strokeStyle Color used as the CanvasRenderingContext2D.strokeStyle.
         */
        function Renderable(x, y, fillStyle, strokeStyle) {
            this._position = new vector2d_1.default(0, 0);
            /**
             * Used as CanvasRenderingContext2D.lineCap.
             */
            this.lineCap = exports.LineCap.butt;
            /**
             * Used as CanvasRenderingContext2D.lineJoin.
             */
            this.lineJoin = exports.LineJoin.miter;
            /**
             * Used as CanvasRenderingContext2D.miterLimit.
             */
            this.miterLimit = 10;
            /**
             * Used as CanvasRenderingContext2D.miterLimit.
             */
            this.lineDash = [];
            /**
             * Used as CanvasRenderingContext2D.setLineDash(lineDash). Example: [2, 16]
             */
            this.lineDashOffset = 0;
            /**
             * Color used as the CanvasRenderingContext2D.fillStyle if fill is set to true.
             */
            this.fillStyle = color_1.default.black;
            /**
             * Color used as the CanvasRenderingContext2D.strokeStyle if stroke is set to true.
             */
            this.strokeStyle = color_1.default.white;
            /**
             * Used as CanvasRenderingContext2D.lineWidth.
             */
            this.lineWidth = 1;
            /**
             * Whether or not the CanvasRenderingContext2D.fill() method should be called on endRender().
             */
            this.fill = true;
            /**
             * Whether or not the CanvasRenderingContext2D.stroke() method should be called on endRender().
             */
            this.stroke = true;
            /**
             * Whether or not CanvasRenderingContext2D.closePath() method should be called on endRender().
             */
            this.closePath = true;
            /**
             * Defines how an object reacts to the change of the position property.
             * @param sender The position that initiated the event.
             */
            this.positionOnChanged = function (sender) { };
            this._position.x = x;
            this._position.y = y;
            this.fillStyle = fillStyle;
            this.strokeStyle = strokeStyle;
            this._position.onChanged.subscribe(this.positionOnChanged);
        }
        Object.defineProperty(Renderable.prototype, "position", {
            /**
             * The position of the object.
             */
            get: function () {
                return this._position;
            },
            /**
             * The position of the object.
             */
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
        Object.defineProperty(Renderable.prototype, "x", {
            /**
             * The x component of the position of the object.
             */
            get: function () {
                return this._position.x;
            },
            /**
             * The x component of the position of the object.
             */
            set: function (value) {
                this._position.x = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Renderable.prototype, "y", {
            /**
             * The y component of the position of the object.
             */
            get: function () {
                return this._position.y;
            },
            /**
             * The y component of the position of the object.
             */
            set: function (value) {
                this._position.y = value;
            },
            enumerable: true,
            configurable: true
        });
        Renderable.prototype.update = function () { };
        /**
         * Renders the object.
         * @param ctx CanvasRenderingContext2D used to render.
         */
        Renderable.prototype.render = function (ctx) {
            throw new Error('Child class must implement method "render".');
        };
        /**
         * Intiates the rendering process by setting all the necessary properties.
         * @param ctx CanvasRenderingContext2D used to render.
         */
        Renderable.prototype.beginRender = function (ctx) {
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
        /**
         * Finalizes the rendering process.
         * @param ctx CanvasRenderingContext2D used to render.
         */
        Renderable.prototype.endRender = function (ctx) {
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
        /**
         * Checks if a position is inside of the object.
         * @param vector The position to check.
         * @returns Returns true if the position is inside the object.
         */
        Renderable.prototype.intersects = function (vector) {
            throw new Error('Child class must implement method "intersects".');
        };
        return Renderable;
    }());
    exports.Renderable = Renderable;
    exports.LineCap = {
        /**
         * Default
         */
        butt: 'butt',
        round: 'round',
        square: 'square'
    };
    exports.LineJoin = {
        /**
         * Default
         */
        miter: 'miter',
        round: 'round',
        bevel: 'bevel'
    };
    /**
     * No longer used.
     */
    var RotatableRenderable = (function (_super) {
        __extends(RotatableRenderable, _super);
        function RotatableRenderable(x, y, fillStyle, strokeStyle) {
            _super.call(this, x, y, fillStyle, strokeStyle);
            this.rotation = 0;
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
    }(Renderable));
    exports.RotatableRenderable = RotatableRenderable;
});
define("system/drawing/padding", ["require", "exports"], function (require, exports) {
    "use strict";
    var Padding = (function () {
        function Padding(allOrTopAndBottomOrTop, leftAndRightOrRight, bottom, left) {
            if (allOrTopAndBottomOrTop !== undefined && leftAndRightOrRight === undefined && bottom === undefined && left === undefined) {
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
define("system/drawing/range", ["require", "exports", "system/event/eventHandler"], function (require, exports, eventHandler_3) {
    "use strict";
    var Range = (function () {
        function Range(min, max) {
            this._onChanged = new eventHandler_3.default();
            this._min = min;
            this._max = max;
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
        return Range;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Range;
});
define("system/drawing/polygon", ["require", "exports", "system/drawing/renderable", "system/drawing/vector2d", "system/drawing/color", "system/helpers/math", "system/random", "system/drawing/range"], function (require, exports, renderable_1, vector2d_2, color_2, math_2, random_2, range_1) {
    "use strict";
    /**
     * Represents a polygon with n number of vertices.
     */
    var Polygon = (function (_super) {
        __extends(Polygon, _super);
        /**
         * Creates a new instance of Polygon.
         * @param fillStyle Color used as the CanvasRenderingContext2D.fillStyle.
         * @param strokeStyle Color used as the CanvasRenderingContext2D.strokeStyle.
         */
        function Polygon(fillStyle, strokeStyle) {
            if (fillStyle === void 0) { fillStyle = color_2.default.black; }
            if (strokeStyle === void 0) { strokeStyle = color_2.default.white; }
            _super.call(this, null, null, fillStyle, strokeStyle);
            this._vertices = [];
            this._minX = 0;
            this._maxX = 0;
            this._minY = 0;
            this._maxY = 0;
        }
        Object.defineProperty(Polygon.prototype, "minX", {
            get: function () {
                return this._minX;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Polygon.prototype, "maxX", {
            get: function () {
                return this._maxX;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Polygon.prototype, "minY", {
            get: function () {
                return this._minY;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Polygon.prototype, "maxY", {
            get: function () {
                return this._maxY;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Polygon.prototype, "vertices", {
            /**
             * The current vertices of the Polygon.
             */
            get: function () {
                return this._vertices;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Polygon.prototype, "count", {
            /**
             * The total number of vertices in the Polygon.
             */
            get: function () {
                return this._vertices.length;
            },
            enumerable: true,
            configurable: true
        });
        Polygon.prototype.update = function () {
            this._minX = math_2.min(function (vector) { return vector.x; }, this._vertices);
            this._maxX = math_2.max(function (vector) { return vector.x; }, this._vertices);
            this._minY = math_2.min(function (vector) { return vector.y; }, this._vertices);
            this._maxY = math_2.max(function (vector) { return vector.y; }, this._vertices);
        };
        /**
         * Renders the Polygon.
         * @param ctx CanvasRenderingContext2D used to render.
         */
        Polygon.prototype.render = function (ctx) {
            this.beginRender(ctx);
            Polygon.renderVertices(ctx, this._vertices);
            this.endRender(ctx);
        };
        /**
         * Adds a new vertex to the Polygon.
         * @param vector The vector to add.
         */
        Polygon.prototype.addVertex = function (vector) {
            this._vertices.push(vector);
            this.update();
        };
        /**
         * Removes all vertices of the Polygon.
         */
        Polygon.prototype.clearVertices = function () {
            this._vertices = [];
            this.update();
        };
        /**
         * Gets the vertex at the specified index.
         * @param index The index of the verted to get.
         * @returns Returns the vertex.
         */
        Polygon.prototype.vertexAt = function (index) {
            return this._vertices[index];
        };
        /**
         * Checks if a position is inside the Polygon.
         * @param vector The positon to check against.
         * @returns Returns true if the position is inside the Polygon.
         */
        Polygon.prototype.intersects = function (vector) {
            return Polygon.intersects(this._vertices, vector);
        };
        /**
         * Warning! This is a semi-expensive operation.
         * Attempts to generate a random position inside the Polygon.
         * @param padding Padding to apply to the random position generation.
         * Returns the random position if it can be generated. Returns null otherwise.
         */
        Polygon.prototype.getRandomPosition = function (padding) {
            var xRange = new range_1.default(padding !== undefined ? this._minX + padding.left : this._minX, padding !== undefined ? this._maxX - padding.right : this._maxX);
            var yRange = new range_1.default(padding !== undefined ? this._minY + padding.top : this._minY, padding !== undefined ? this._maxY - padding.bottom : this._maxY);
            return Polygon._getRandomPosition(xRange, yRange, this._vertices, padding);
        };
        Polygon.prototype.toString = function () {
            return '(' + this._vertices.join(', ') + ')';
        };
        /**
         * Warning! This is a semi-expensive operation.
         * Attempts to generate a random position inside a Polygon.
         * @param xRange Range of the x-axis.
         * @param yRang Range of the y-axis.
         * @param vertices The vertices that form the polygon.
         * @param padding Padding to apply to the random position generation.
         * Returns the random position if it can be generated. Returns null otherwise.
         */
        Polygon._getRandomPosition = function (xRange, yRange, vertices, padding) {
            var result;
            var maxAttempts = 1000;
            var attempts = 0;
            while (true) {
                result = new vector2d_2.default(random_2.default.next(xRange.min, xRange.max + 1), random_2.default.next(yRange.min, yRange.max + 1));
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
        /**
         * Checks if a position is inside a Polygon formed of an array of vertices (Vector2D[]).
         * @param vertices The positions to from the Polygon from.
         * @param vector The positon to check against.
         * @returns Returns true if the position is inside the Polygon.
         */
        Polygon.intersects = function (vertices, vector) {
            // ray-casting algorithm based on
            // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
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
        /**
         * Warning! This is a semi-expensive operation.
         * Attempts to generate a random position inside a Polygon.
         * @param vertices The vertices that form the polygon.
         * @param padding Padding to apply to the random position generation.
         * Returns the random position if it can be generated. Returns null otherwise.
         */
        Polygon.getRandomPosition = function (vertices, padding) {
            var minX = math_2.min(function (vector) { return vector.x; }, vertices);
            var maxX = math_2.max(function (vector) { return vector.x; }, vertices);
            var minY = math_2.min(function (vector) { return vector.y; }, vertices);
            var maxY = math_2.max(function (vector) { return vector.y; }, vertices);
            var xRange = new range_1.default(padding !== undefined ? minX + padding.left : minX, padding !== undefined ? maxX - padding.right : maxX);
            var yRange = new range_1.default(padding !== undefined ? minY + padding.top : minY, padding !== undefined ? maxY - padding.bottom : maxY);
            return Polygon._getRandomPosition(xRange, yRange, vertices, padding);
        };
        Polygon.intersects2 = function (vertices, vector) {
            // From http://stackoverflow.com/a/14998816/4438600
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
        /**
         * Renders a polygon from an array of vertices (Vector2D[]).
         * @param ctx CanvasRenderingContext2D used to render.
         * @param vertices The vertices used to form the polygon.
         */
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
    }(renderable_1.Renderable));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Polygon;
});
define("system/drawing/rectangle", ["require", "exports", "system/drawing/renderable", "system/drawing/size", "system/drawing/color", "system/drawing/polygon", "system/helpers/math"], function (require, exports, renderable_2, size_1, color_3, polygon_1, math_3) {
    "use strict";
    /**
     * Represents a standard rectangle that has a position, width, and height. Can be rotated.
     */
    var Rectangle = (function (_super) {
        __extends(Rectangle, _super);
        /**
         * Creates a new instance of Rectangle.
         * @param x The x component of the position vector.
         * @param y The y component of the position vector.
         * @param width The width of the Rectangle.
         * @param height The height of the Rectangle.
         * @param fillStyle Color used as the CanvasRenderingContext2D.fillStyle.
         * @param strokeStyle Color used as the CanvasRenderingContext2D.strokeStyle.
         */
        function Rectangle(x, y, width, height, fillStyle, strokeStyle) {
            var _this = this;
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (width === void 0) { width = 0; }
            if (height === void 0) { height = 0; }
            if (fillStyle === void 0) { fillStyle = color_3.default.black; }
            if (strokeStyle === void 0) { strokeStyle = color_3.default.white; }
            _super.call(this, x, y, fillStyle, strokeStyle);
            this._size = new size_1.default(0, 0);
            this._rotation = 0;
            this._vertices = [];
            /**
             * Origin of the Rectangle used to render it.
             */
            this.origin = RectangleOrigin.Center;
            /**
             * Wheter the internal updating of the object is paused.
             */
            this.noUpdate = false;
            /**
             * Reacts to Rectangle.size changes.
             * @param sender The sender of the event.
             */
            this.sizeOnChanged = function (sender) {
                _this.update();
            };
            this._size.width = width;
            this._size.height = height;
            this.update();
            this._size.onChanged.subscribe(this.sizeOnChanged);
        }
        Object.defineProperty(Rectangle.prototype, "rotation", {
            /**
             * The rotation of the object in radians.
             */
            get: function () {
                return this._rotation;
            },
            /**
             * The rotation of the object in radians.
             */
            set: function (value) {
                this._rotation = value;
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "size", {
            /**
             * The size of the Rectangle.
             */
            get: function () {
                return this._size;
            },
            /**
             * The size of the Rectangle.
             */
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
            /**
             * The width of the Rectangle. (Quick access to Rectangle.size.width)
             */
            get: function () {
                return this._size.width;
            },
            /**
             * The width of the Rectangle. (Quick access to Rectangle.size.width)
             */
            set: function (value) {
                this.size.width = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "height", {
            /**
             * The height of the Rectangle. (Quick access to Rectangle.size.height)
             */
            get: function () {
                return this.size.height;
            },
            /**
             * The height of the Rectangle. (Quick access to Rectangle.size.height)
             */
            set: function (value) {
                this.size.height = value;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Re-calculates the Rectangle vertices.
         */
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
        /**
         * Renders the Rectangle.
         * @param ctx CanvasRenderingContext2D used to render.
         */
        Rectangle.prototype.render = function (ctx) {
            this.beginRender(ctx);
            polygon_1.default.renderVertices(ctx, this._vertices);
            this.endRender(ctx);
        };
        /**
         * Checks if a position is inside of the Rectangle.
         * @param vector The position to check.
         * @returns Returns true if the position is inside the Rectangle.
         */
        Rectangle.prototype.intersects = function (vector) {
            return polygon_1.default.intersects(this._vertices, vector);
        };
        /**
         * Returns a random position inside the rectangle. Does not take rotation into account.
         * @param padding Padding used to prevent results near the edges.
         * @returns Returns the result position vector.
         */
        Rectangle.prototype.getRandomPosition = function (padding) {
            return polygon_1.default.getRandomPosition(this._vertices, padding);
        };
        /**
         * Converts the Rectangle to a string representation, e.g. ([0, 0], [100, 0], [100, 100], [0, 100])
         * @returns Returns the string.
         */
        Rectangle.prototype.toString = function () {
            return '(' + this._vertices.join(', ') + ')';
        };
        return Rectangle;
    }(renderable_2.Renderable));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Rectangle;
    (function (RectangleOrigin) {
        RectangleOrigin[RectangleOrigin["Center"] = 0] = "Center";
        RectangleOrigin[RectangleOrigin["TopLeft"] = 1] = "TopLeft";
    })(exports.RectangleOrigin || (exports.RectangleOrigin = {}));
    var RectangleOrigin = exports.RectangleOrigin;
});
define("engine/fullscreenRequest", ["require", "exports"], function (require, exports) {
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
            // Supports most browsers and their versions.
            var requestMethod = body.requestFullScreen || body.webkitRequestFullScreen
                || body.mozRequestFullScreen || body.msRequestFullScreen;
            if (requestMethod) {
                // Native full screen.
                requestMethod.call(body);
            }
            else if (typeof (window).ActiveXObject !== "undefined") {
                // Older IE.
                var wscript = new ActiveXObject("WScript.Shell");
                if (wscript !== null) {
                    wscript.SendKeys("{F11}");
                }
            }
        };
        FullscreenRequest._css = '.fullscreen-request{position:absolute;top:0;background-color:rgba(0,0,0,.5);color:#fff;font-family:monospace;margin:0 auto;width:100%;text-align:center;font-size:6vh;padding-top:1vh}.fullscreen-request:hover{background-color:rgba(255,255,255,.1)}.fullscreen-request>.title{font-size:4vh;margin-bottom:1vh}.fullscreen-request>.title>.material-icons{font-size:6vh;position:relative;top:1.75vh;margin-top:-3vh}.fullscreen-request>.button:hover{cursor:pointer}.fullscreen-request>.accept.button:hover{color:#006400}.fullscreen-request>.cancel.button:hover{color:#8b0000}.fullscreen-request>.button>.material-icons{font-size:6vh}';
        FullscreenRequest._html = '<div class="fullscreen-request" id="fullscreen-request"> <div class="title"> <i class="material-icons">fullscreen</i> Fullscreen? </div><span class="accept button" id="fullscreen-accept"><i class="material-icons">check_circle</i></span> <span class="cancel button" id="fullscreen-cancel"><i class="material-icons">cancel</i></span></div>';
        return FullscreenRequest;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = FullscreenRequest;
});
define("engine/gameEngine", ["require", "exports", "engine/inputProvider", "system/drawing/vector2d", "system/drawing/rectangle", "engine/fullscreenRequest", "system/random"], function (require, exports, inputProvider_1, vector2d_3, rectangle_1, fullscreenRequest_1, random_3) {
    "use strict";
    var GameEngine = (function () {
        function GameEngine(width, height) {
            var _this = this;
            this._canvas = null;
            this._fps = 0;
            this._lastFrameTime = 0;
            this._betweenFrameTime = 5;
            this._logicTickInterval = 10;
            this._bounds = new rectangle_1.default(0, 0, 0, 0);
            this.autoFitCanvas = true;
            this.targetFrameRate = 60;
            this.manualRender = false;
            this.renderOnResize = true;
            this.clearCanvasPerFrame = true;
            this.fullScreenPrompt = true;
            this.canvasCreated = false;
            this.paused = false;
            /**
             * Function that can be used to initialize variables before rendering starts.
             */
            this.init = function () { };
            /**
             * Main function used to render the frames.
             */
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
            this.mousePos = new vector2d_3.default(0, 0);
            this._logicTick = function () {
                if (!_this.paused) {
                    _this.tick();
                }
            };
            this._tryRenderFrame = function () {
                if (!_this.paused && !_this.manualRender) {
                    var now = performance.now();
                    var sinceLast = now - _this._lastFrameTime;
                    var targetTimeBetweenFrames = 1000 / _this.targetFrameRate;
                    if (sinceLast >= targetTimeBetweenFrames - _this._betweenFrameTime) {
                        _this._renderFrame();
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
        GameEngine.prototype._renderFrame = function () {
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
            setInterval(this._logicTick, this._logicTickInterval);
        };
        GameEngine.prototype.getRandomPosition = function (padding) {
            if (padding !== undefined) {
                return new vector2d_3.default(random_3.default.next(padding.left, this.width - padding.right + 1), random_3.default.next(padding.top, this.height - padding.bottom + 1));
            }
            else {
                return new vector2d_3.default(random_3.default.next(this.width + 1), random_3.default.next(this.height + 1));
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
        GameEngine._canvasCSS = 'html,body{margin:0;padding:0;overflow:hidden;}canvas#render{background-color:black;}';
        return GameEngine;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GameEngine;
});
define("system/drawing/circle", ["require", "exports", "system/drawing/renderable", "system/drawing/color"], function (require, exports, renderable_3, color_4) {
    "use strict";
    var Circle = (function (_super) {
        __extends(Circle, _super);
        function Circle(x, y, radius, fillStyle, strokeStyle) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (radius === void 0) { radius = 0; }
            if (fillStyle === void 0) { fillStyle = color_4.default.black; }
            if (strokeStyle === void 0) { strokeStyle = color_4.default.white; }
            _super.call(this, x, y, fillStyle, strokeStyle);
            this.radius = 0;
            this.radius = radius;
        }
        Circle.prototype.render = function (ctx) {
            this.beginRender(ctx);
            ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, false);
            this.endRender(ctx);
        };
        Circle.prototype.intersects = function (position) {
            //(x-center_x)^2 + (y - center_y)^2 < radius^2
            //(position.x - this.position.x)^2 + (position.y - this.position.y)^2 < this.radius^2
            var diff1 = position.x - this.position.x;
            var part1 = diff1 * diff1;
            var diff2 = position.y - this.position.y;
            var part2 = diff2 * diff2;
            var part3 = this.radius * this.radius;
            return part1 + part2 < part3;
        };
        return Circle;
    }(renderable_3.Renderable));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Circle;
});
define("system/drawing/ellipse", ["require", "exports", "system/drawing/renderable", "system/drawing/vector2d", "system/drawing/size", "system/drawing/color"], function (require, exports, renderable_4, vector2d_4, size_2, color_5) {
    "use strict";
    var Ellipse = (function (_super) {
        __extends(Ellipse, _super);
        function Ellipse(x, y, width, height, fillStyle, strokeStyle) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (width === void 0) { width = 0; }
            if (height === void 0) { height = 0; }
            if (fillStyle === void 0) { fillStyle = color_5.default.black; }
            if (strokeStyle === void 0) { strokeStyle = color_5.default.white; }
            _super.call(this, x, y, fillStyle, strokeStyle);
            this.size = new size_2.default(0, 0);
            this.startAngle = 0;
            this.endAngle = Math.PI * 2;
            this.anticlockwise = false;
            this.size.width = width;
            this.size.height = height;
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
        /**
         * Checks if a position is in the ellipse. Does not support "unfull" ellipses (endAngle - startAngle != Math.PI * 2)
         * @param position The position to check.
         * @returns Returns true if the position is inside the ellipse.
         */
        Ellipse.prototype.intersects = function (position) {
            var normalized = new vector2d_4.default(position.x - this.position.x, position.y - this.position.y);
            return ((normalized.x * normalized.x) / (this.xRadius * this.xRadius)) + ((normalized.y * normalized.y) / (this.yRadius * this.yRadius)) <= 1.0;
        };
        return Ellipse;
    }(renderable_4.Renderable));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Ellipse;
});
define("system/drawing/line", ["require", "exports", "system/drawing/renderable", "system/drawing/vector2d", "system/drawing/color", "system/drawing/polygon"], function (require, exports, renderable_5, vector2d_5, color_6, polygon_2) {
    "use strict";
    var Line = (function (_super) {
        __extends(Line, _super);
        function Line(x, y, endX, endY, lineWidth, strokeStyle) {
            var _this = this;
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (endX === void 0) { endX = 0; }
            if (endY === void 0) { endY = 0; }
            if (lineWidth === void 0) { lineWidth = 0; }
            if (strokeStyle === void 0) { strokeStyle = color_6.default.white; }
            _super.call(this, x, y, null, strokeStyle);
            this._endPosition = new vector2d_5.default(0, 0);
            this._vertices = [];
            this.positionOnChanged = function (sender) {
                _this.update();
            };
            this.closePath = false;
            this.fill = false;
            this.lineWidth = lineWidth;
            this._endPosition.x = endX;
            this._endPosition.y = endY;
            this._endPosition.onChanged.subscribe(this.positionOnChanged);
            this.update();
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
            return polygon_2.default.intersects(this._vertices, position);
        };
        Line.prototype._test = function (ctx) {
            var quarterTurn = Math.PI / 2;
            var angle = this.position.getAngleTowardsVector(this._endPosition);
            var topLeft = this.position.getOffsetTowardsAngle(this.lineWidth / 2, angle - quarterTurn);
            var topRight = this._endPosition.getOffsetTowardsAngle(this.lineWidth / 2, angle - quarterTurn);
            var bottomRight = this._endPosition.getOffsetTowardsAngle(this.lineWidth / 2, angle + quarterTurn);
            var bottomLeft = this.position.getOffsetTowardsAngle(this.lineWidth / 2, angle + quarterTurn);
            ctx.beginPath();
            ctx.strokeStyle = color_6.default.red.toString();
            ctx.lineWidth = 1;
            ctx.moveTo(topLeft.x, topLeft.y);
            ctx.lineTo(topRight.x, topRight.y);
            ctx.lineTo(bottomRight.x, bottomRight.y);
            ctx.lineTo(bottomLeft.x, bottomLeft.y);
            ctx.closePath();
            ctx.stroke();
        };
        return Line;
    }(renderable_5.Renderable));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Line;
});
define("system/drawing/regularPolygon", ["require", "exports", "system/drawing/renderable", "system/drawing/vector2d", "system/drawing/polygon", "system/drawing/color"], function (require, exports, renderable_6, vector2d_6, polygon_3, color_7) {
    "use strict";
    /**
     * Respresents a symmetrical polygon (triangle, square, pentagon, hexacon, heptagon, octagon, etc.).
     */
    var RegularPolygon = (function (_super) {
        __extends(RegularPolygon, _super);
        /**
         * Creates a new instance of RegularPolygon.
         * @param x The x coordinate.
         * @param y The y coordinate.
         * @param radius The radius.
         * @param vertexCount The number of vertices.
         * @param fillStyle The fillstyle.
         * @param strokeStyle The strokeStyle.
         */
        function RegularPolygon(x, y, radius, vertexCount, fillStyle, strokeStyle) {
            var _this = this;
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (radius === void 0) { radius = 0; }
            if (vertexCount === void 0) { vertexCount = 0; }
            if (fillStyle === void 0) { fillStyle = color_7.default.black; }
            if (strokeStyle === void 0) { strokeStyle = color_7.default.white; }
            _super.call(this, x, y, fillStyle, strokeStyle);
            this._rotation = 0;
            this._radius = 0;
            this._vertexCount = 0;
            this._vertices = [];
            this.noUpdate = false;
            /**
             * Reacts to the changes of the position property.
             */
            this.positionOnChanged = function (sender) {
                _this.update();
            };
            this.radius = radius;
            this._vertexCount = vertexCount;
            this.update();
        }
        Object.defineProperty(RegularPolygon.prototype, "vertexCount", {
            /**
             * The number of vertices (points) of the RegularPolygon.
             */
            get: function () {
                return this._vertexCount;
            },
            /**
             * The number of vertices (points) of the RegularPolygon.
             */
            set: function (value) {
                this._vertexCount = value;
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RegularPolygon.prototype, "radius", {
            /**
             * The radius of the RegularPolygon.
             */
            get: function () {
                return this._radius;
            },
            /**
             * The radius of the RegularPolygon.
             */
            set: function (value) {
                this._radius = value;
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RegularPolygon.prototype, "rotation", {
            /**
             * The rotation of the RegularPolygon.
             */
            get: function () {
                return this._rotation;
            },
            /**
             * The rotation of the RegularPolygon.
             */
            set: function (value) {
                this._rotation = value;
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Re-calculates the RegularPolygon positions based on its position, radius, vertexCount, and rotation.
         */
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
        /**
         * Renders the RegularPolygon.
         * @param ctx CanvasRenderingContext2D used to render.
         */
        RegularPolygon.prototype.render = function (ctx) {
            this.beginRender(ctx);
            polygon_3.default.renderVertices(ctx, this._vertices);
            this.endRender(ctx);
        };
        /**
         * Inspects if a position is inside the regular polygon.
         * @param position The position to check against.
         * @returns Returns true if the position is inside the RegularPolygon.
         */
        RegularPolygon.prototype.intersects = function (position) {
            return polygon_3.default.intersects(this._vertices, position);
        };
        return RegularPolygon;
    }(renderable_6.Renderable));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = RegularPolygon;
});
define("system/drawing/text", ["require", "exports", "system/drawing/renderable", "system/drawing/color"], function (require, exports, renderable_7, color_8) {
    "use strict";
    var Text = (function (_super) {
        __extends(Text, _super);
        function Text(x, y, text, fillStyle, strokeStyle) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (text === void 0) { text = ''; }
            if (fillStyle === void 0) { fillStyle = color_8.default.black; }
            if (strokeStyle === void 0) { strokeStyle = color_8.default.white; }
            _super.call(this, x, y, fillStyle, strokeStyle);
            this.text = '';
            this.font = '16px Monospace';
            this.textAlign = exports.TextAlign.start;
            this.textBaseLine = exports.TextBaseLine.alphabetic;
            this.textDirection = exports.TextDirection.inherit;
            this.text = text;
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
    }(renderable_7.Renderable));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Text;
    exports.TextAlign = {
        /**
         * Default
         */
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
        /**
         * Default
         */
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
define("system/testClass", ["require", "exports", "system/event/eventHandler"], function (require, exports, eventHandler_4) {
    "use strict";
    var Animal = (function () {
        function Animal() {
            this._name = 'Animal';
            this._onNameChanged = new eventHandler_4.default();
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
            _super.call(this);
            this._name = 'Horse';
            this.nameOnChanged = function (sender) {
                console.log('name_onChanged from Horse');
            };
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
define("main", ["require", "exports", "engine/gameEngine", "system/drawing/rectangle", "system/drawing/circle", "system/drawing/ellipse", "system/drawing/regularPolygon", "system/drawing/text", "system/drawing/color", "system/helpers/math", "system/testClass"], function (require, exports, gameEngine_1, rectangle_2, circle_1, ellipse_1, regularPolygon_1, text_1, color_9, math_4, testClass_1) {
    "use strict";
    var engine = new gameEngine_1.default(230, 640);
    engine.fullScreenPrompt = false;
    var rect;
    var circle;
    var ellipse;
    var line;
    var text;
    var text1;
    var text2;
    var circle1;
    var circle2;
    var rPolygon;
    engine.init = function () {
        var animal = new testClass_1.Animal();
        var horse = new testClass_1.Horse();
        console.log('Animal name: ' + animal.name);
        console.log('Horse name: ' + horse.name);
        animal.name = 'New Animal';
        horse.name = 'New Horse';
        console.log('Animal name: ' + animal.name);
        console.log('Horse name: ' + horse.name);
        rect = new rectangle_2.default(200, 200, 300, 400, color_9.default.random(), color_9.default.random());
        circle = new circle_1.default(300, 300, 200, color_9.default.random(), color_9.default.random());
        ellipse = new ellipse_1.default(300, 300, 200, 400, color_9.default.random(), color_9.default.random());
        //line = new Line(100, 100, 400, 400, 40, Color.random());
        //circle1 = new Circle(line.position.x, line.position.y, 5, Color.red);
        //circle2 = new Circle(line.endPosition.x, line.endPosition.y, 5, Color.red);
        text = new text_1.default(0, 0, '', color_9.default.white, color_9.default.black);
        text.font = '16px Monospace';
        text.stroke = false;
        text1 = new text_1.default(0, 0, '', color_9.default.white);
        text1.stroke = false;
        text2 = new text_1.default(0, 0, '', color_9.default.white);
        text2.stroke = false;
        rPolygon = new regularPolygon_1.default(800, 400, 200, 8, color_9.default.random(), color_9.default.random());
    };
    engine.render = function (ctx) {
        //rect.render(ctx);
        //circle.render(ctx);
        //ellipse.render(ctx);
        //line.render(ctx);
        //circle1.render(ctx);
        //circle2.render(ctx);
        text.render(ctx);
        text1.render(ctx);
        text2.render(ctx);
        rPolygon.render(ctx);
        //line.test(ctx);
    };
    engine.tick = function () {
        //line.endPosition.x += 0.1;
        rPolygon.rotation = math_4.map(engine.mouseX, 0, engine.width, -Math.PI, Math.PI);
        //text1.position.x = line.position.x;
        //text1.position.y = line.position.y;
        //text2.position.x = line.endPosition.x;
        //text2.position.y = line.endPosition.y;
        //text1.text = line.position.toString();
        //text2.text = line.endPosition.toString();
        text.position.x = engine.mouseX;
        text.position.y = engine.mouseY;
        //text.text = `(${engine.mouseX}, ${engine.mouseY}) = ${line.getDistance(engine.mousePos)}`;
        rect.position.lerp(engine.mousePos, 0.001);
        circle.position.lerp(engine.mousePos, 0.001);
        if (rect.intersects(engine.mousePos)) {
            rect.fillStyle = color_9.default.red;
        }
        else {
            rect.fillStyle = color_9.default.blue;
        }
        if (circle.intersects(engine.mousePos)) {
            circle.fillStyle = color_9.default.red;
        }
        else {
            circle.fillStyle = color_9.default.green;
        }
        if (ellipse.intersects(engine.mousePos)) {
            ellipse.fillStyle = color_9.default.red;
        }
        else {
            ellipse.fillStyle = color_9.default.green;
        }
        /*if(line.intersects(engine.mousePos))
        {
            line.strokeStyle = Color.red;
        }
        else
        {
            line.strokeStyle = Color.green;
        }*/
    };
    engine.run();
});
define("system/drawing/star", ["require", "exports", "system/drawing/renderable", "system/drawing/vector2d", "system/drawing/polygon", "system/drawing/color"], function (require, exports, renderable_8, vector2d_7, polygon_4, color_10) {
    "use strict";
    var Star = (function (_super) {
        __extends(Star, _super);
        function Star(x, y, pointCount, innerRadius, outerRadius, fillStyle, strokeStyle) {
            var _this = this;
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (pointCount === void 0) { pointCount = 0; }
            if (innerRadius === void 0) { innerRadius = 0; }
            if (outerRadius === void 0) { outerRadius = 0; }
            if (fillStyle === void 0) { fillStyle = color_10.default.black; }
            if (strokeStyle === void 0) { strokeStyle = color_10.default.white; }
            _super.call(this, x, y, fillStyle, strokeStyle);
            this.positionOnChanged = function (sender) {
                _this._update();
            };
            this._pointCount = pointCount;
            this._innerRadius = innerRadius;
            this._outerRadius = outerRadius;
            this._vertices = [];
            this._update();
        }
        Object.defineProperty(Star.prototype, "pointCount", {
            get: function () { return this._pointCount; },
            set: function (value) {
                this._pointCount = value;
                this._update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Star.prototype, "innerRadius", {
            get: function () { return this._innerRadius; },
            set: function (value) {
                this._innerRadius = value;
                this._update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Star.prototype, "outerRadius", {
            get: function () { return this._outerRadius; },
            set: function (value) {
                this._outerRadius = value;
                this._update();
            },
            enumerable: true,
            configurable: true
        });
        Star.prototype._update = function () {
            this._vertices = [];
            var step = Math.PI * 2 / (this.pointCount * 2);
            var even = true;
            for (var i = -Math.PI; i <= Math.PI; i += step) {
                var radius = even ? this._outerRadius : this._innerRadius;
                var pos = new vector2d_7.default(this.position.x + radius * Math.cos(i), this.position.y + radius * Math.sin(i));
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
    }(renderable_8.Renderable));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Star;
});
define("main2", ["require", "exports", "engine/gameEngine", "system/drawing/line", "system/drawing/star", "system/drawing/color", "system/drawing/vector2d"], function (require, exports, gameEngine_2, line_1, star_1, color_11, vector2d_8) {
    "use strict";
    var engine = new gameEngine_2.default(230, 640);
    engine.fullScreenPrompt = false;
    var star;
    var line;
    engine.init = function () {
        line = new line_1.default(0, 0, 100, 100, 4, color_11.default.red);
        star = new star_1.default(500, 500, 5, 75, 250, color_11.default.random(), color_11.default.random());
        /*window.setTimeout(() =>
        {
            console.log('Update star pointCount');
            star.pointCount = 12;
           
        }, 500);
        
        window.setTimeout(() =>
        {
            console.log('Update star position.x');
            star.position.x += 100;
        }, 1000);
        
        window.setTimeout(() =>
        {
            console.log('Update star position by setting it to a new pos');
            star.position = new Vector2D(600, 600);
        }, 1500);
        */
        window.setTimeout(function () {
            console.log('Update star line lineWidth');
            line.lineWidth = 40;
        }, 500);
        window.setTimeout(function () {
            console.log('Update line.position.x');
            line.position.x = 400;
        }, 1000);
        window.setTimeout(function () {
            console.log('Update line.endPosition.y');
            line.endPosition.y = 600;
        }, 1500);
        window.setTimeout(function () {
            console.log('Update line with new position');
            line.position = new vector2d_8.default(0, 0);
        }, 2000);
        window.setTimeout(function () {
            console.log('Update line with new endPosition');
            line.endPosition = new vector2d_8.default(500, 500);
        }, 2500);
    };
    engine.render = function (ctx) {
        star.render(ctx);
        line.render(ctx);
    };
    engine.tick = function () {
    };
    engine.run();
});
define("engine/gameEntity", ["require", "exports", "system/drawing/vector2d"], function (require, exports, vector2d_9) {
    "use strict";
    var GameEntity = (function () {
        function GameEntity(x, y) {
            this.position = new vector2d_9.default(x, y);
            this.velocity = new vector2d_9.default(0, 0);
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
define("main3", ["require", "exports", "engine/gameEngine", "system/drawing/circle", "system/drawing/color", "system/drawing/vector2d", "engine/gameEntity"], function (require, exports, gameEngine_3, circle_2, color_12, vector2d_10, gameEntity_1) {
    "use strict";
    var engine = new gameEngine_3.default(230, 640);
    engine.fullScreenPrompt = false;
    var entity;
    var gravity;
    var circle;
    engine.init = function () {
        gravity = new vector2d_10.default(0, -0.25);
        entity = new gameEntity_1.default(engine.width / 2, engine.height - 20);
        entity.velocity.x = 1;
        entity.velocity.y = -10;
        entity.gravity = gravity;
        circle = new circle_2.default(entity.position.x, entity.position.y, 20, color_12.default.red, color_12.default.white);
        circle.position = entity.position;
    };
    engine.render = function (ctx) {
        circle.render(ctx);
    };
    engine.tick = function () {
        entity.update();
        if (entity.position.y > engine.height - 20 && entity.velocity.y > 0) {
            //entity.velocity = new Vector2D(-entity.velocity.x * 0.8, -entity.velocity.y * 0.8);
            entity.velocity.multiply(0.95);
            if (Math.abs(entity.velocity.y) < 1) {
                entity.velocity.y = 0;
            }
        }
    };
    engine.run();
});
define("system/simulation/hitpoints/hitpoints", ["require", "exports", "system/event/eventHandler", "system/helpers/math"], function (require, exports, eventHandler_5, math_5) {
    "use strict";
    /**
     * Represents entity health (hitpoints) value.
     */
    var HitPoints = (function () {
        /**
         * Creates a new instance of Hitpoints.
         * @param value Initial hitpoints value.
         * @param number Maximum number of hitpoints.
         */
        function HitPoints(value, max) {
            this._onChanged = new eventHandler_5.default();
            /**
             * Maximum hitpoints value.
             */
            this.max = 1000;
            /**
             * Minimum hitpoints value.
             */
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
            /**
             * Current hitpoints value.
             */
            get: function () {
                return this._value;
            },
            /**
             * Current hitpoints value.
             * @param value The new value to set the value to.
             */
            set: function (value) {
                var oldValue = this._value;
                this._value = math_5.clamp(value, this.min, this.max);
                this.onChanged.trigger(this, oldValue, value);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Add hitpoints.
         * @param value Value to add.
         */
        HitPoints.prototype.add = function (value) {
            this.value = math_5.clamp(this._value + value, this.min, this.max);
        };
        /**
         * Subtract hitpoints.
         * @param value Value to subtract.
         */
        HitPoints.prototype.subtract = function (value) {
            this.add(-value);
        };
        Object.defineProperty(HitPoints.prototype, "isDead", {
            /**
             * Whether or not the hitpoints value has reached the minimum value.
             */
            get: function () {
                return this._value == this.min;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HitPoints.prototype, "percentage", {
            /**
             * The percentage representation of the current hitpoints value (between 0.0 and 1.0).
             */
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
define("system/simulation/projectile/projectileSystemResult", ["require", "exports"], function (require, exports) {
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
define("system/simulation/projectile/projectileSystemEntry", ["require", "exports", "system/simulation/projectile/projectileSystemResult"], function (require, exports, projectileSystemResult_1) {
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
define("system/helpers/array", ["require", "exports"], function (require, exports) {
    "use strict";
    function array_remove(source, item, count) {
        if (count === void 0) { count = -1; }
        var existingItem;
        var removedCount = 0;
        for (var i = source.length - 1; i >= 0; i--) {
            existingItem = source[i];
            if (existingItem === item) {
                source.splice(i, 1);
                removedCount++;
                if (count != -1 && removedCount >= count) {
                    break;
                }
            }
        }
    }
    exports.array_remove = array_remove;
});
define("system/simulation/projectile/projectileSystem", ["require", "exports", "system/event/eventHandler", "system/helpers/array"], function (require, exports, EventHandler_1, array_1) {
    "use strict";
    var ProjectileSystem = (function () {
        function ProjectileSystem() {
            this._entries = [];
            this._onProjectileHit = new EventHandler_1.default();
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
define("spaceWars/projectile", ["require", "exports", "system/drawing/vector2d", "system/drawing/color", "system/drawing/circle"], function (require, exports, vector2d_11, color_13, circle_3) {
    "use strict";
    var Projectile = (function () {
        function Projectile(x, y) {
            var _this = this;
            this.damage = 100;
            this._radius = 2;
            this._fillStyle = color_13.default.white;
            this._strokeStyle = color_13.default.white;
            this.positionOnChanged = function (sender) {
                _this._update();
            };
            this._circle = new circle_3.default(x, y, this.radius, this.fillStyle, this.strokeStyle);
            this.position = new vector2d_11.default(x, y);
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
define("system/simulation/smoothedMovementSettings", ["require", "exports"], function (require, exports) {
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
define("system/simulation/SmoothedMovement", ["require", "exports", "system/drawing/vector2d", "system/simulation/smoothedMovementSettings", "system/helpers/math"], function (require, exports, vector2D_1, smoothedMovementSettings_1, math_6) {
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
                // Laske suunta vasta, kun ollaan varmoja siitä, että meillä on kohdepiste.
                var directionToTarget = _this.targetPosition.subtract(_this.position).normalized();
                if (distanceToStart <= distanceToTarget) {
                    // Etäisyys alkupisteeseen clampattuna etäisyyteen johon nopeutus loppuu.
                    var clampedDistance = math_6.clamp(distanceToStart, 0, settings.accelerationDistance);
                    // Eksponentti kontrolloi käyrää
                    var desiredVelocity = Math.max(Math.pow(clampedDistance / settings.accelerationDistance, settings.accelerationExponent) * settings.maxVelocity, 0.1);
                    _this.velocity = directionToTarget.multiply(desiredVelocity);
                }
                else {
                    // Etäisyys loppupisteeseen clampattuna etäisyyteen josta hidastus alkaa.
                    var clampedDistance = math_6.clamp(distanceToTarget, 0, settings.decelerationDistance);
                    // Eksponentti kontrolloi käyrää
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
define("system/simulation/hitpoints/hitpointBar", ["require", "exports", "system/drawing/size", "system/drawing/vector2d", "system/drawing/color", "system/drawing/rectangle"], function (require, exports, size_3, vector2D_2, color_14, rectangle_3) {
    "use strict";
    /**
     * Represents a hitpoint display, i.e. |████   |
     */
    var HitpointBar = (function () {
        /**
         * Creates a new istance of HitpointBar.
         * @param width The width of the visual HitPointBar.
         * @param height The height of the visual HitPointBar.
         * @param owner The owner of the HitpointBar which is used to calculate the position of the HitPointBar.
         * @param offsetX The x-offset of the HitpointBar relative to its owner's position.
         * @param offsetY The y-offset of the HitpointBar relative to its owner's position.
         */
        function HitpointBar(width, height, owner, offsetX, offsetY) {
            var _this = this;
            if (offsetX === void 0) { offsetX = 0; }
            if (offsetY === void 0) { offsetY = -50; }
            this._size = undefined;
            this._offset = undefined;
            this._centerOffset = new vector2D_2.default(0, 0);
            this._progressOffset = new vector2D_2.default(0, 0);
            /**
             * Whether or not the HitpointBar is visible.
             */
            this.visible = true;
            /**
             * Whether or not the HitPointBar should be horizontally centered relative to the owner's position.
             */
            this.center = true;
            /**
             * Reacts to changes of the size property.
             */
            this.sizeOnChanged = function (sender) {
                _this.update();
            };
            /**
             * Reacts to changes of the offset property.
             */
            this.onOffsetChanged = function (sender) {
                _this.update();
            };
            this._size = new size_3.default(width, height);
            this._offset = new vector2D_2.default(offsetX, offsetY);
            this._owner = owner;
            this.base = new HitpointBarBase(color_14.default.white, color_14.default.white, 1, this);
            this.progress = new HitpointBarProgress(color_14.default.black, color_14.default.black, 0, this);
            this.base.transparency = 0.2;
            this.progress.transparency = 0.5;
        }
        Object.defineProperty(HitpointBar.prototype, "offset", {
            /**
             * The offset of the HitpointBar relative to the owner's position.
             */
            get: function () {
                return this._offset;
            },
            /**
             * The offset of the HitpointBar relative to the owner's position.
             */
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
            /**
             * The size (width and height) of the visual HitPointBar.
             */
            get: function () {
                return this._size;
            },
            /**
             * The size (width and height) of the visual HitPointBar.
             */
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
            /**
             * The owner of the HitpointBar which is used to calculate the position of the HitPointBar.
             */
            get: function () {
                return this._owner;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Returns the width of the progress element.
         */
        HitpointBar.prototype.getProgressWidth = function () {
            var baseRect = this.base.rectangle;
            return (baseRect.width - (2 * baseRect.lineWidth)) * this.owner.hitpoints.percentage;
        };
        /**
         * Returns the height of the progress element.
         */
        HitpointBar.prototype.getProgressHeight = function () {
            var baseRect = this.base.rectangle;
            return (baseRect.height - (2 * baseRect.lineWidth));
        };
        /**
         * Re-calucates all the positions and internal properties.
         */
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
        /**
         * Renders the HitpointBar.
         * @param ctx CanvasRenderingContext2D used to render.
         */
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
    /**
     * Represents abtract implementation of HitPointBar base and progress elements.
     */
    var HitpointBarElement = (function () {
        /**
         * Creates a new instance of HitpointBarElement.
         * @param fillStyle Color used as the CanvasRenderingContext2D.fillStyle.
         * @param strokeStyle Color used as the CanvasRenderingContext2D.strokeStyle.
         * @param lineWidth Width of the line going around the visible rectangle.
         * @param parent The parent IHitpointBar.
         */
        function HitpointBarElement(fillStyle, strokeStyle, lineWidth, parent) {
            this._transparency = 1.0;
            this.rectangle = new rectangle_3.default(0, 0, 0, 0);
            this.rectangle.origin = rectangle_3.RectangleOrigin.TopLeft;
            this.rectangle.fillStyle = fillStyle;
            this.rectangle.strokeStyle = strokeStyle;
            this.rectangle.lineWidth = lineWidth;
            this._parent = parent;
        }
        Object.defineProperty(HitpointBarElement.prototype, "transparency", {
            get: function () {
                return this._transparency;
            },
            /**
             * The transparency of the HitpointBar (between 0.0 and 1.0)
             */
            set: function (value) {
                this._transparency = value;
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Renders the HitpointBarElement.
         * @param ctx CanvasRenderingContext2D used to render.
         */
        HitpointBarElement.prototype.render = function (ctx) {
            this.rectangle.render(ctx);
        };
        /**
         * Updates the IHitpointBarElement.
         */
        HitpointBarElement.prototype.update = function () {
            this.rectangle.fillStyle.alpha = this._transparency;
            this.rectangle.strokeStyle.alpha = this._transparency;
        };
        return HitpointBarElement;
    }());
    exports.HitpointBarElement = HitpointBarElement;
    /**
     * Represents HitPointBar background.
     */
    var HitpointBarBase = (function (_super) {
        __extends(HitpointBarBase, _super);
        /**
         * Creates a new instance of HitpointBarBase.
         * @param fillStyle Color used as the CanvasRenderingContext2D.fillStyle.
         * @param strokeStyle Color used as the CanvasRenderingContext2D.strokeStyle.
         * @param lineWidth Width of the line going around the visible rectangle.
         * @param parent The parent IHitpointBar.
         */
        function HitpointBarBase(fillStyle, strokeStyle, lineWidth, parent) {
            _super.call(this, fillStyle, strokeStyle, lineWidth, parent);
            this.rectangle.stroke = false;
        }
        return HitpointBarBase;
    }(HitpointBarElement));
    exports.HitpointBarBase = HitpointBarBase;
    /**
     * Represents HitPointBar progress.
     */
    var HitpointBarProgress = (function (_super) {
        __extends(HitpointBarProgress, _super);
        /**
         * Creates a new instance of HitpointBarProgress.
         * @param fillStyle Color used as the CanvasRenderingContext2D.fillStyle.
         * @param strokeStyle Color used as the CanvasRenderingContext2D.strokeStyle.
         * @param lineWidth Width of the line going around the visible rectangle.
         * @param parent The parent IHitpointBar.
         */
        function HitpointBarProgress(fillStyle, strokeStyle, lineWidth, parent) {
            _super.call(this, fillStyle, strokeStyle, lineWidth, parent);
            this.rectangle.stroke = false;
        }
        return HitpointBarProgress;
    }(HitpointBarElement));
    exports.HitpointBarProgress = HitpointBarProgress;
});
define("system/drawing/kickerMessage/kickerMessage", ["require", "exports", "system/drawing/vector2d", "system/drawing/text", "system/helpers/math"], function (require, exports, vector2d_12, text_2, math_7) {
    "use strict";
    /**
     * Represents a text label that quickly disappears by fading its transparency and raising up.
     */
    var KickerMessage = (function () {
        /**
         * Creates a new instance of KickerMessage.
         * @param owner The owner of the KickerMessage that is used to track the position.
         * @param text The text that is displayed.
         */
        function KickerMessage(owner, text) {
            this._lifeTicks = 0;
            /**
             * Whether or not the KickerMessage position should follow the owner.
             */
            this.followOwner = true;
            this.owner = owner;
            this.text = new text_2.default(this.owner.position.x, this.owner.position.y, text);
            this.velocity = new vector2d_12.default(0, -1);
            this.velocityStep = new vector2d_12.default(0, -1);
            this.lifeTime = 100;
        }
        Object.defineProperty(KickerMessage.prototype, "isFinished", {
            /**
             * Whether or not the KickerMessage lifeTime has been reached.
             */
            get: function () {
                return this._lifeTicks >= this.lifeTime;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Renders the KickerMessage.
         * @param ctx The CanvasRenderingContext2D used to render the KickerMessage.
         */
        KickerMessage.prototype.render = function (ctx) {
            this.text.render(ctx);
        };
        /**
         * Updates the KickerMessage.
         */
        KickerMessage.prototype.update = function () {
            if (this.followOwner) {
                this.text.position = this.owner.position.add(this.velocity);
            }
            else {
                this.text.position = this.text.position.add(this.velocity);
            }
            this.velocity = this.velocity.add(this.velocityStep);
            this._lifeTicks++;
            var alpha = math_7.map(this._lifeTicks, 0, this.lifeTime, 1, 0);
            this.text.fillStyle.alpha = alpha;
            this.text.strokeStyle.alpha = alpha;
        };
        return KickerMessage;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = KickerMessage;
});
define("system/drawing/kickerMessage/kickerMessageManager", ["require", "exports", "system/helpers/array"], function (require, exports, array_2) {
    "use strict";
    /**
     * Represents a manager that takes care of IKickerMessages.
     */
    var KickerMessageManager = (function () {
        /**
         * Creates a new instance of KickerMessageManager.
         */
        function KickerMessageManager() {
            this._messages = [];
        }
        /**
         * Adds a new message to the KickerMessageManager.
         * @param message The message to add.
         */
        KickerMessageManager.prototype.add = function (message) {
            this._messages.push(message);
        };
        /**
         * Updates the KickerMessageManager.
         */
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
        /**
         * Renders the KickerMessageManager.
         * @param ctx CanvasRenderingContext2D used to render.
         */
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
define("spaceWars/player", ["require", "exports", "system/drawing/color", "system/drawing/rectangle", "system/drawing/vector2d", "system/drawing/regularPolygon", "system/drawing/circle", "spaceWars/projectile", "system/helpers/math", "system/helpers/array", "system/simulation/SmoothedMovement", "system/simulation/hitpoints/hitpoints", "system/simulation/hitpoints/hitpointBar", "system/drawing/kickerMessage/kickerMessageManager", "system/drawing/kickerMessage/kickerMessage"], function (require, exports, color_15, rectangle_4, vector2d_13, regularPolygon_2, circle_4, projectile_1, math_8, array_3, SmoothedMovement_1, hitpoints_1, hitpointBar_1, kickerMessageManager_1, kickerMessage_1) {
    "use strict";
    var Player = (function () {
        function Player(x, y, bounds, hitpoints) {
            var _this = this;
            this._messages = new kickerMessageManager_1.default();
            this._rotation = 0;
            this._radius = 50;
            this.projectiles = [];
            this.bounds = new rectangle_4.default(0, 0, 0, 0);
            this.aimZoneRadius = 125;
            this.aimZoneEnabled = false;
            this.mouseInAimZone = false;
            this.isAimingMode = false;
            this.projectileDamage = 100;
            this._fillStyle = new color_15.default(255, 255, 255, 1);
            this._strokeStyle = new color_15.default(255, 0, 0, 1);
            this.hitpointsOnChanged = function (sender, oldValue, newValue) {
                var alpha = math_8.map(_this.hitpoints.value, 0, _this.hitpoints.max, 0.1, 1);
                _this.fillStyle.alpha = alpha;
                _this.strokeStyle.alpha = alpha;
                _this._circle.fillStyle.alpha = alpha;
                _this._circle.strokeStyle.alpha = alpha;
                var diff = newValue - oldValue;
                var message = new kickerMessage_1.default(_this, diff + " HP");
                message.text.fillStyle = (diff < 0 ? color_15.default.red : color_15.default.green);
                message.text.stroke = false;
                _this._messages.add(message);
            };
            this._getNewTargetPosition = function () {
                return new vector2d_13.default(_this.targetPosition);
            };
            this.positionOnChanged = function (sender) {
                _this._update();
            };
            this._triangle = new regularPolygon_2.default(x, y, this.radius, 3, this._fillStyle, this._strokeStyle);
            this._circle = new circle_4.default(x, y, 5, color_15.default.red, color_15.default.white);
            this._aimZoneCircle = new circle_4.default(x, y, this.aimZoneRadius, color_15.default.black, new color_15.default(255, 255, 255, 0.1));
            this._aimZoneCircle.lineDash = [2, 16];
            this._aimZoneCircle.fill = false;
            this.position = new vector2d_13.default(x, y);
            this.bounds = bounds;
            this._movement = new SmoothedMovement_1.default(this.position);
            this._movement.getNewTargetPosition = this._getNewTargetPosition;
            this.targetPosition = new vector2d_13.default(x, y);
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
                //this._movement.targetPosition = this._targetPosition;
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
            this._triangle.rotation = math_8.normalizeRadians(this._triangle.rotation + Math.PI);
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
define("spaceWars/enemy", ["require", "exports", "spaceWars/player", "system/drawing/vector2d", "system/drawing/circle", "system/drawing/color", "system/drawing/padding"], function (require, exports, player_1, vector2d_14, circle_5, color_16, padding_1) {
    "use strict";
    var Enemy = (function (_super) {
        __extends(Enemy, _super);
        function Enemy(x, y, bounds, hitpoints) {
            var _this = this;
            _super.call(this, x, y, bounds, hitpoints);
            this.targetPosition = undefined;
            this.velocity = new vector2d_14.default(0, 0);
            this._randomPosPadding = new padding_1.default(100);
            this.projectileDamage = 250;
            this._getNewTargetPosition = function () {
                var pos = _this.bounds.getRandomPosition(_this._randomPosPadding);
                _this._targetPosCircle.position = pos;
                return pos;
            };
            this._targetPosCircle = new circle_5.default(0, 0, 5, color_16.default.yellow, color_16.default.white);
            this._movement.getNewTargetPosition = this._getNewTargetPosition;
            this._movement.updateTargetPosition();
        }
        Enemy.prototype.render = function (ctx) {
            _super.prototype.render.call(this, ctx);
            //this._targetPosCircle.render(ctx);
        };
        Enemy.prototype.update = function () {
            _super.prototype.update.call(this);
        };
        return Enemy;
    }(player_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Enemy;
});
define("main4", ["require", "exports", "engine/gameEngine", "system/drawing/circle", "system/drawing/text", "system/drawing/color"], function (require, exports, gameEngine_4, circle_6, text_3, color_17) {
    "use strict";
    var engine = new gameEngine_4.default(230, 640);
    engine.fullScreenPrompt = false;
    var fpsText = new text_3.default(10, 10, '0 fps', color_17.default.white);
    fpsText.stroke = false;
    var circle = new circle_6.default(0, 0, 40, color_17.default.random(), color_17.default.random());
    engine.init = function () {
    };
    engine.windowResize = function (e) {
    };
    engine.render = function (ctx) {
        //fpsText.render(ctx);
        circle.render(ctx);
        circle.position.x += 1;
        circle.position.y += 1;
    };
    engine.tick = function () {
        fpsText.text = engine.fps + ' fps';
        //circle.position = circle.position.lerp(engine.mousePos, 0.01);
    };
    engine.run();
});
define("system/sound/sound", ["require", "exports", "system/helpers/array"], function (require, exports, array_4) {
    "use strict";
    /**
     * A class that allows playing multiple instances of the same audio file.
     */
    var Sound = (function () {
        /**
         * Creates a new instance of Sound.
         * @param url Url to the audio source file.
         */
        function Sound(url) {
            var _this = this;
            this._audioPlayers = [];
            this._url = '';
            this._isLoaded = false;
            this._volume = 1.0;
            /**
             * Maximum number of channels (instances) the sound can play at the same time.
             */
            this.maxChannels = 32;
            /**
             * Triggered when the audio file has finished loading and can be played.
             */
            this.onLoaded = function (e) { };
            /**
             * Reacts to the initial audio player canplaythrough event.
             * @param e The event.
             */
            this._canPlayThrough = function (e) {
                _this._isLoaded = true;
                _this.onLoaded(e);
            };
            /**
             * Reacts to the ended event of Audio element.
             * @param e The event object.
             */
            this.onAudioEnded = function (e) {
                array_4.array_remove(_this._audioPlayers, e.srcElement);
            };
            this._url = url;
            this._initialAudioPlayer = new Audio(this.url);
            this._initialAudioPlayer.addEventListener('canplaythrough', this._canPlayThrough);
        }
        Object.defineProperty(Sound.prototype, "count", {
            /**
             * Number of currently playing channels.
             */
            get: function () {
                return this._audioPlayers.length;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Whether or not there is at least one active channel playing.
         */
        Sound.prototype.isPlaying = function () {
            return this.count > 0;
        };
        Object.defineProperty(Sound.prototype, "url", {
            /**
             * URL to the audio source file.
             */
            get: function () {
                return this._url;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sound.prototype, "volume", {
            /**
             * Volume used to play the sound, between 0.0 and 1.0.
             */
            get: function () {
                return this._volume;
            },
            /**
             * Volume used to play the sound, between 0.0 and 1.0.
             * @param value The value to set the volume to.
             */
            set: function (value) {
                this._volume = value;
                this._updateVolume();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sound.prototype, "isLoaded", {
            /**
             * Whether or not the audio file is available for playing.
             */
            get: function () {
                return this._isLoaded;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Plays the sound if the maximum number of channels is not reached.
         * @returns Returns true if the sound was played.
         */
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
        /**
         * Updates the volume to the all currently existing audio players.
         */
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
define("spaceWars", ["require", "exports", "engine/gameEngine", "system/drawing/rectangle", "system/drawing/circle", "system/drawing/text", "system/drawing/polygon", "system/drawing/color", "system/drawing/vector2d", "system/drawing/padding", "system/random", "system/helpers/math", "system/helpers/array", "spaceWars/player", "spaceWars/enemy", "system/simulation/projectile/projectileSystem", "system/simulation/projectile/projectileSystemEntry", "system/sound/sound"], function (require, exports, gameEngine_5, rectangle_5, circle_7, text_4, polygon_5, color_18, vector2d_15, padding_2, random_4, math_9, array_5, player_2, enemy_1, projectileSystem_1, projectileSystemEntry_1, sound_1) {
    "use strict";
    var enableKills = true;
    var enemyCanShoot = false;
    var engine = new gameEngine_5.default(230, 640);
    engine.fullScreenPrompt = true;
    var player;
    var text = new text_4.default(20, 50, '', color_18.default.white, color_18.default.black);
    var fpsText = new text_4.default(10, 10, '0 fps', color_18.default.white);
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
        scoreText = new text_4.default(10, engine.height - 20, 'Score: 0', color_18.default.white);
        scoreText.stroke = false;
        rect = new rectangle_5.default(engine.width / 2, engine.height / 2, 50, 500, color_18.default.random(), color_18.default.random());
        projectileSystem = new projectileSystem_1.default();
        player = new player_2.default(engine.width / 2, engine.height / 2, engine.bounds, 1000);
        player.fillStyle = color_18.default.green;
        player.strokeStyle = color_18.default.white;
        player.projectileDamage = 10;
        //player.aimZoneEnabled = true;
        enemyDied(null);
        projectileSystem.onProjectileHit.subscribe(onProjectileHit);
        polygon = new polygon_5.default(color_18.default.random(), color_18.default.random());
        circle = new circle_7.default(0, 0, 5, color_18.default.red, color_18.default.white);
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
            var enemyPos = engine.getRandomPosition(new padding_2.default(100));
            var newEnemy = new enemy_1.default(enemyPos.x, enemyPos.y, engine.bounds, 100);
            newEnemy.projectileDamage = 1;
            newEnemy.fillStyle = new color_18.default(150, 0, 0, 1);
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
                player.targetPosition = new vector2d_15.default(engine.mousePos);
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
        //polygon.addVertex(engine.mousePos.copy());
        //player.targetPosition.set(engine.mousePos);
    };
    engine.render = function (ctx) {
        scoreText.render(ctx);
        polygon.render(ctx);
        //circle.render(ctx);
        //rect.render(ctx);
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
        //fpsText.render(ctx);
    };
    engine.tick = function () {
        scoreText.text = 'Score: ' + score;
        //rect.rotation = normalizeRadians(rect.rotation + 0.01);
        fpsText.text = engine.fps + ' fps';
        if (polygon_5.default.intersects2(polygon.vertices, engine.mousePos)) {
            polygon.fillStyle = color_18.default.red;
        }
        else {
            polygon.fillStyle = color_18.default.green;
        }
        //player.rotation = rotateTowards(player.rotation, normalizeRadians(player.position.getAngleTowards(engine.mousePos)), rotationStep);
        player.rotation = math_9.normalizeRadians(player.position.getAngleTowardsVector(engine.mousePos));
        for (var _i = 0, enemies_2 = enemies; _i < enemies_2.length; _i++) {
            var enemy = enemies_2[_i];
            enemy.rotation = math_9.normalizeRadians(enemy.position.getAngleTowardsVector(player.position));
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
            text.fillStyle = color_18.default.red;
        }
    };
    window.setTimeout(function () {
        //enemy.targetPosition = engine.getRandomPosition({top: 100, right: 100, bottom: 100, left: 100});
        enemyCanShoot = true;
    }, 2000);
    window.setInterval(function () {
        if (enemies.length < maxEnemies) {
            enemyDied(null);
        }
        //player.shoot();
    }, 5000);
    engine.run();
});
//# sourceMappingURL=combined.js.map