/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 *
 * Version: 5.1.6 (2020-01-28)
 */
(function(domGlobals) {
    var Cell = function(initial) {
        let value = initial;
        const get = function() {
            return value;
        };
        const set = function(v) {
            value = v;
        };
        const clone = function() {
            return Cell(get());
        };
        return {
            get,
            set,
            clone,
        };
    };

    const global$1 = tinymce.util.Tools.resolve('tinymce.PluginManager');

    const hasProPlugin = function(editor) {
        if (
            /(^|[ ,])powerpaste([, ]|$)/.test(editor.settings.plugins) &&
            global$1.get('powerpaste')
        ) {
            if (
                typeof domGlobals.window.console !== 'undefined' &&
                domGlobals.window.console.log
            ) {
                domGlobals.window.console.log(
                    "PowerPaste is incompatible with Paste plugin! Remove 'paste' from the 'plugins' option.",
                );
            }
            return true;
        }
        return false;
    };
    const DetectProPlugin = { hasProPlugin };

    const get = function(clipboard, quirks) {
        return {
            clipboard,
            quirks,
        };
    };
    const Api = { get };

    const firePastePreProcess = function(editor, html, internal, isWordHtml) {
        return editor.fire('PastePreProcess', {
            content: html,
            internal,
            wordContent: isWordHtml,
        });
    };
    const firePastePostProcess = function(editor, node, internal, isWordHtml) {
        return editor.fire('PastePostProcess', {
            node,
            internal,
            wordContent: isWordHtml,
        });
    };
    const firePastePlainTextToggle = function(editor, state) {
        return editor.fire('PastePlainTextToggle', { state });
    };
    const firePaste = function(editor, ieFake) {
        return editor.fire('paste', { ieFake });
    };
    const Events = {
        firePastePreProcess,
        firePastePostProcess,
        firePastePlainTextToggle,
        firePaste,
    };

    const togglePlainTextPaste = function(editor, clipboard) {
        if (clipboard.pasteFormat.get() === 'text') {
            clipboard.pasteFormat.set('html');
            Events.firePastePlainTextToggle(editor, false);
        } else {
            clipboard.pasteFormat.set('text');
            Events.firePastePlainTextToggle(editor, true);
        }
        editor.focus();
    };
    const Actions = { togglePlainTextPaste };

    const register = function(editor, clipboard) {
        editor.addCommand('mceTogglePlainTextPaste', function() {
            Actions.togglePlainTextPaste(editor, clipboard);
        });
        editor.addCommand('mceInsertClipboardContent', function(ui, value) {
            if (value.content) {
                clipboard.pasteHtml(value.content, value.internal);
            }
            if (value.text) {
                clipboard.pasteText(value.text);
            }
        });
    };
    const Commands = { register };

    const noop = function() {};
    const constant = function(value) {
        return function() {
            return value;
        };
    };
    const never = constant(false);
    const always = constant(true);

    const none = function() {
        return NONE;
    };
    var NONE = (function() {
        const eq = function(o) {
            return o.isNone();
        };
        const call = function(thunk) {
            return thunk();
        };
        const id = function(n) {
            return n;
        };
        const me = {
            fold(n, s) {
                return n();
            },
            is: never,
            isSome: never,
            isNone: always,
            getOr: id,
            getOrThunk: call,
            getOrDie(msg) {
                throw new Error(msg || 'error: getOrDie called on none.');
            },
            getOrNull: constant(null),
            getOrUndefined: constant(undefined),
            or: id,
            orThunk: call,
            map: none,
            each: noop,
            bind: none,
            exists: never,
            forall: always,
            filter: none,
            equals: eq,
            equals_: eq,
            toArray() {
                return [];
            },
            toString: constant('none()'),
        };
        if (Object.freeze) {
            Object.freeze(me);
        }
        return me;
    })();
    var some = function(a) {
        const constant_a = constant(a);
        const self = function() {
            return me;
        };
        const bind = function(f) {
            return f(a);
        };
        var me = {
            fold(n, s) {
                return s(a);
            },
            is(v) {
                return a === v;
            },
            isSome: always,
            isNone: never,
            getOr: constant_a,
            getOrThunk: constant_a,
            getOrDie: constant_a,
            getOrNull: constant_a,
            getOrUndefined: constant_a,
            or: self,
            orThunk: self,
            map(f) {
                return some(f(a));
            },
            each(f) {
                f(a);
            },
            bind,
            exists: bind,
            forall: bind,
            filter(f) {
                return f(a) ? me : NONE;
            },
            toArray() {
                return [a];
            },
            toString() {
                return `some(${a})`;
            },
            equals(o) {
                return o.is(a);
            },
            equals_(o, elementEq) {
                return o.fold(never, function(b) {
                    return elementEq(a, b);
                });
            },
        };
        return me;
    };
    const from = function(value) {
        return value === null || value === undefined ? NONE : some(value);
    };
    const Option = {
        some,
        none,
        from,
    };

    const typeOf = function(x) {
        if (x === null) {
            return 'null';
        }
        const t = typeof x;
        if (
            t === 'object' &&
            (Array.prototype.isPrototypeOf(x) ||
                (x.constructor && x.constructor.name === 'Array'))
        ) {
            return 'array';
        }
        if (
            t === 'object' &&
            (String.prototype.isPrototypeOf(x) ||
                (x.constructor && x.constructor.name === 'String'))
        ) {
            return 'string';
        }
        return t;
    };
    const isType = function(type) {
        return function(value) {
            return typeOf(value) === type;
        };
    };
    const isFunction = isType('function');

    const nativeSlice = Array.prototype.slice;
    const map = function(xs, f) {
        const len = xs.length;
        const r = new Array(len);
        for (let i = 0; i < len; i++) {
            const x = xs[i];
            r[i] = f(x, i);
        }
        return r;
    };
    const each = function(xs, f) {
        for (let i = 0, len = xs.length; i < len; i++) {
            const x = xs[i];
            f(x, i);
        }
    };
    const filter = function(xs, pred) {
        const r = [];
        for (let i = 0, len = xs.length; i < len; i++) {
            const x = xs[i];
            if (pred(x, i)) {
                r.push(x);
            }
        }
        return r;
    };
    const foldl = function(xs, f, acc) {
        each(xs, function(x) {
            acc = f(acc, x);
        });
        return acc;
    };
    const from$1 = isFunction(Array.from)
        ? Array.from
        : function(x) {
              return nativeSlice.call(x);
          };

    const exports$1 = {};
    const module = { exports: exports$1 };
    (function(define, exports, module, require) {
        (function(f) {
            if (typeof exports === 'object' && typeof module !== 'undefined') {
                module.exports = f();
            } else if (typeof define === 'function' && define.amd) {
                define([], f);
            } else {
                let g;
                if (typeof window !== 'undefined') {
                    g = window;
                } else if (typeof global !== 'undefined') {
                    g = global;
                } else if (typeof self !== 'undefined') {
                    g = self;
                } else {
                    g = this;
                }
                g.EphoxContactWrapper = f();
            }
        })(function() {
            return (function() {
                function r(e, n, t) {
                    function o(i, f) {
                        if (!n[i]) {
                            if (!e[i]) {
                                const c =
                                    typeof require === 'function' && require;
                                if (!f && c) return c(i, !0);
                                if (u) return u(i, !0);
                                const a = new Error(
                                    `Cannot find module '${i}'`,
                                );
                                throw ((a.code = 'MODULE_NOT_FOUND'), a);
                            }
                            const p = (n[i] = { exports: {} });
                            e[i][0].call(
                                p.exports,
                                function(r) {
                                    const n = e[i][1][r];
                                    return o(n || r);
                                },
                                p,
                                p.exports,
                                r,
                                e,
                                n,
                                t,
                            );
                        }
                        return n[i].exports;
                    }
                    for (
                        var u = typeof require === 'function' && require, i = 0;
                        i < t.length;
                        i++
                    )
                        o(t[i]);
                    return o;
                }
                return r;
            })()(
                {
                    1: [
                        function(require, module, exports) {
                            const process = (module.exports = {});
                            let cachedSetTimeout;
                            let cachedClearTimeout;
                            function defaultSetTimout() {
                                throw new Error(
                                    'setTimeout has not been defined',
                                );
                            }
                            function defaultClearTimeout() {
                                throw new Error(
                                    'clearTimeout has not been defined',
                                );
                            }
                            (function() {
                                try {
                                    if (typeof setTimeout === 'function') {
                                        cachedSetTimeout = setTimeout;
                                    } else {
                                        cachedSetTimeout = defaultSetTimout;
                                    }
                                } catch (e) {
                                    cachedSetTimeout = defaultSetTimout;
                                }
                                try {
                                    if (typeof clearTimeout === 'function') {
                                        cachedClearTimeout = clearTimeout;
                                    } else {
                                        cachedClearTimeout = defaultClearTimeout;
                                    }
                                } catch (e) {
                                    cachedClearTimeout = defaultClearTimeout;
                                }
                            })();
                            function runTimeout(fun) {
                                if (cachedSetTimeout === setTimeout) {
                                    return setTimeout(fun, 0);
                                }
                                if (
                                    (cachedSetTimeout === defaultSetTimout ||
                                        !cachedSetTimeout) &&
                                    setTimeout
                                ) {
                                    cachedSetTimeout = setTimeout;
                                    return setTimeout(fun, 0);
                                }
                                try {
                                    return cachedSetTimeout(fun, 0);
                                } catch (e) {
                                    try {
                                        return cachedSetTimeout.call(
                                            null,
                                            fun,
                                            0,
                                        );
                                    } catch (e) {
                                        return cachedSetTimeout.call(
                                            this,
                                            fun,
                                            0,
                                        );
                                    }
                                }
                            }
                            function runClearTimeout(marker) {
                                if (cachedClearTimeout === clearTimeout) {
                                    return clearTimeout(marker);
                                }
                                if (
                                    (cachedClearTimeout ===
                                        defaultClearTimeout ||
                                        !cachedClearTimeout) &&
                                    clearTimeout
                                ) {
                                    cachedClearTimeout = clearTimeout;
                                    return clearTimeout(marker);
                                }
                                try {
                                    return cachedClearTimeout(marker);
                                } catch (e) {
                                    try {
                                        return cachedClearTimeout.call(
                                            null,
                                            marker,
                                        );
                                    } catch (e) {
                                        return cachedClearTimeout.call(
                                            this,
                                            marker,
                                        );
                                    }
                                }
                            }
                            let queue = [];
                            let draining = false;
                            let currentQueue;
                            let queueIndex = -1;
                            function cleanUpNextTick() {
                                if (!draining || !currentQueue) {
                                    return;
                                }
                                draining = false;
                                if (currentQueue.length) {
                                    queue = currentQueue.concat(queue);
                                } else {
                                    queueIndex = -1;
                                }
                                if (queue.length) {
                                    drainQueue();
                                }
                            }
                            function drainQueue() {
                                if (draining) {
                                    return;
                                }
                                const timeout = runTimeout(cleanUpNextTick);
                                draining = true;
                                let len = queue.length;
                                while (len) {
                                    currentQueue = queue;
                                    queue = [];
                                    while (++queueIndex < len) {
                                        if (currentQueue) {
                                            currentQueue[queueIndex].run();
                                        }
                                    }
                                    queueIndex = -1;
                                    len = queue.length;
                                }
                                currentQueue = null;
                                draining = false;
                                runClearTimeout(timeout);
                            }
                            process.nextTick = function(fun) {
                                const args = new Array(arguments.length - 1);
                                if (arguments.length > 1) {
                                    for (let i = 1; i < arguments.length; i++) {
                                        args[i - 1] = arguments[i];
                                    }
                                }
                                queue.push(new Item(fun, args));
                                if (queue.length === 1 && !draining) {
                                    runTimeout(drainQueue);
                                }
                            };
                            function Item(fun, array) {
                                this.fun = fun;
                                this.array = array;
                            }
                            Item.prototype.run = function() {
                                this.fun.apply(null, this.array);
                            };
                            process.title = 'browser';
                            process.browser = true;
                            process.env = {};
                            process.argv = [];
                            process.version = '';
                            process.versions = {};
                            function noop() {}
                            process.on = noop;
                            process.addListener = noop;
                            process.once = noop;
                            process.off = noop;
                            process.removeListener = noop;
                            process.removeAllListeners = noop;
                            process.emit = noop;
                            process.prependListener = noop;
                            process.prependOnceListener = noop;
                            process.listeners = function(name) {
                                return [];
                            };
                            process.binding = function(name) {
                                throw new Error(
                                    'process.binding is not supported',
                                );
                            };
                            process.cwd = function() {
                                return '/';
                            };
                            process.chdir = function(dir) {
                                throw new Error(
                                    'process.chdir is not supported',
                                );
                            };
                            process.umask = function() {
                                return 0;
                            };
                        },
                        {},
                    ],
                    2: [
                        function(require, module, exports) {
                            (function(setImmediate) {
                                (function(root) {
                                    const setTimeoutFunc = setTimeout;
                                    function noop() {}
                                    function bind(fn, thisArg) {
                                        return function() {
                                            fn.apply(thisArg, arguments);
                                        };
                                    }
                                    function Promise(fn) {
                                        if (typeof this !== 'object')
                                            throw new TypeError(
                                                'Promises must be constructed via new',
                                            );
                                        if (typeof fn !== 'function')
                                            throw new TypeError(
                                                'not a function',
                                            );
                                        this._state = 0;
                                        this._handled = false;
                                        this._value = undefined;
                                        this._deferreds = [];
                                        doResolve(fn, this);
                                    }
                                    function handle(self, deferred) {
                                        while (self._state === 3) {
                                            self = self._value;
                                        }
                                        if (self._state === 0) {
                                            self._deferreds.push(deferred);
                                            return;
                                        }
                                        self._handled = true;
                                        Promise._immediateFn(function() {
                                            const cb =
                                                self._state === 1
                                                    ? deferred.onFulfilled
                                                    : deferred.onRejected;
                                            if (cb === null) {
                                                (self._state === 1
                                                    ? resolve
                                                    : reject)(
                                                    deferred.promise,
                                                    self._value,
                                                );
                                                return;
                                            }
                                            let ret;
                                            try {
                                                ret = cb(self._value);
                                            } catch (e) {
                                                reject(deferred.promise, e);
                                                return;
                                            }
                                            resolve(deferred.promise, ret);
                                        });
                                    }
                                    function resolve(self, newValue) {
                                        try {
                                            if (newValue === self)
                                                throw new TypeError(
                                                    'A promise cannot be resolved with itself.',
                                                );
                                            if (
                                                newValue &&
                                                (typeof newValue === 'object' ||
                                                    typeof newValue ===
                                                        'function')
                                            ) {
                                                const { then } = newValue;
                                                if (
                                                    newValue instanceof Promise
                                                ) {
                                                    self._state = 3;
                                                    self._value = newValue;
                                                    finale(self);
                                                    return;
                                                }
                                                if (
                                                    typeof then === 'function'
                                                ) {
                                                    doResolve(
                                                        bind(then, newValue),
                                                        self,
                                                    );
                                                    return;
                                                }
                                            }
                                            self._state = 1;
                                            self._value = newValue;
                                            finale(self);
                                        } catch (e) {
                                            reject(self, e);
                                        }
                                    }
                                    function reject(self, newValue) {
                                        self._state = 2;
                                        self._value = newValue;
                                        finale(self);
                                    }
                                    function finale(self) {
                                        if (
                                            self._state === 2 &&
                                            self._deferreds.length === 0
                                        ) {
                                            Promise._immediateFn(function() {
                                                if (!self._handled) {
                                                    Promise._unhandledRejectionFn(
                                                        self._value,
                                                    );
                                                }
                                            });
                                        }
                                        for (
                                            let i = 0,
                                                len = self._deferreds.length;
                                            i < len;
                                            i++
                                        ) {
                                            handle(self, self._deferreds[i]);
                                        }
                                        self._deferreds = null;
                                    }
                                    function Handler(
                                        onFulfilled,
                                        onRejected,
                                        promise,
                                    ) {
                                        this.onFulfilled =
                                            typeof onFulfilled === 'function'
                                                ? onFulfilled
                                                : null;
                                        this.onRejected =
                                            typeof onRejected === 'function'
                                                ? onRejected
                                                : null;
                                        this.promise = promise;
                                    }
                                    function doResolve(fn, self) {
                                        let done = false;
                                        try {
                                            fn(
                                                function(value) {
                                                    if (done) return;
                                                    done = true;
                                                    resolve(self, value);
                                                },
                                                function(reason) {
                                                    if (done) return;
                                                    done = true;
                                                    reject(self, reason);
                                                },
                                            );
                                        } catch (ex) {
                                            if (done) return;
                                            done = true;
                                            reject(self, ex);
                                        }
                                    }
                                    Promise.prototype.catch = function(
                                        onRejected,
                                    ) {
                                        return this.then(null, onRejected);
                                    };
                                    Promise.prototype.then = function(
                                        onFulfilled,
                                        onRejected,
                                    ) {
                                        const prom = new this.constructor(noop);
                                        handle(
                                            this,
                                            new Handler(
                                                onFulfilled,
                                                onRejected,
                                                prom,
                                            ),
                                        );
                                        return prom;
                                    };
                                    Promise.all = function(arr) {
                                        const args = Array.prototype.slice.call(
                                            arr,
                                        );
                                        return new Promise(function(
                                            resolve,
                                            reject,
                                        ) {
                                            if (args.length === 0)
                                                return resolve([]);
                                            let remaining = args.length;
                                            function res(i, val) {
                                                try {
                                                    if (
                                                        val &&
                                                        (typeof val ===
                                                            'object' ||
                                                            typeof val ===
                                                                'function')
                                                    ) {
                                                        const { then } = val;
                                                        if (
                                                            typeof then ===
                                                            'function'
                                                        ) {
                                                            then.call(
                                                                val,
                                                                function(val) {
                                                                    res(i, val);
                                                                },
                                                                reject,
                                                            );
                                                            return;
                                                        }
                                                    }
                                                    args[i] = val;
                                                    if (--remaining === 0) {
                                                        resolve(args);
                                                    }
                                                } catch (ex) {
                                                    reject(ex);
                                                }
                                            }
                                            for (
                                                let i = 0;
                                                i < args.length;
                                                i++
                                            ) {
                                                res(i, args[i]);
                                            }
                                        });
                                    };
                                    Promise.resolve = function(value) {
                                        if (
                                            value &&
                                            typeof value === 'object' &&
                                            value.constructor === Promise
                                        ) {
                                            return value;
                                        }
                                        return new Promise(function(resolve) {
                                            resolve(value);
                                        });
                                    };
                                    Promise.reject = function(value) {
                                        return new Promise(function(
                                            resolve,
                                            reject,
                                        ) {
                                            reject(value);
                                        });
                                    };
                                    Promise.race = function(values) {
                                        return new Promise(function(
                                            resolve,
                                            reject,
                                        ) {
                                            for (
                                                let i = 0, len = values.length;
                                                i < len;
                                                i++
                                            ) {
                                                values[i].then(resolve, reject);
                                            }
                                        });
                                    };
                                    Promise._immediateFn =
                                        typeof setImmediate === 'function'
                                            ? function(fn) {
                                                  setImmediate(fn);
                                              }
                                            : function(fn) {
                                                  setTimeoutFunc(fn, 0);
                                              };
                                    Promise._unhandledRejectionFn = function _unhandledRejectionFn(
                                        err,
                                    ) {
                                        if (
                                            typeof console !== 'undefined' &&
                                            console
                                        ) {
                                            console.warn(
                                                'Possible Unhandled Promise Rejection:',
                                                err,
                                            );
                                        }
                                    };
                                    Promise._setImmediateFn = function _setImmediateFn(
                                        fn,
                                    ) {
                                        Promise._immediateFn = fn;
                                    };
                                    Promise._setUnhandledRejectionFn = function _setUnhandledRejectionFn(
                                        fn,
                                    ) {
                                        Promise._unhandledRejectionFn = fn;
                                    };
                                    if (
                                        typeof module !== 'undefined' &&
                                        module.exports
                                    ) {
                                        module.exports = Promise;
                                    } else if (!root.Promise) {
                                        root.Promise = Promise;
                                    }
                                })(this);
                            }.call(this, require('timers').setImmediate));
                        },
                        { timers: 3 },
                    ],
                    3: [
                        function(require, module, exports) {
                            (function(setImmediate, clearImmediate) {
                                const {
                                    nextTick,
                                } = require('process/browser.js');
                                const { apply } = Function.prototype;
                                const { slice } = Array.prototype;
                                const immediateIds = {};
                                let nextImmediateId = 0;
                                exports.setTimeout = function() {
                                    return new Timeout(
                                        apply.call(
                                            setTimeout,
                                            window,
                                            arguments,
                                        ),
                                        clearTimeout,
                                    );
                                };
                                exports.setInterval = function() {
                                    return new Timeout(
                                        apply.call(
                                            setInterval,
                                            window,
                                            arguments,
                                        ),
                                        clearInterval,
                                    );
                                };
                                exports.clearTimeout = exports.clearInterval = function(
                                    timeout,
                                ) {
                                    timeout.close();
                                };
                                function Timeout(id, clearFn) {
                                    this._id = id;
                                    this._clearFn = clearFn;
                                }
                                Timeout.prototype.unref = Timeout.prototype.ref = function() {};
                                Timeout.prototype.close = function() {
                                    this._clearFn.call(window, this._id);
                                };
                                exports.enroll = function(item, msecs) {
                                    clearTimeout(item._idleTimeoutId);
                                    item._idleTimeout = msecs;
                                };
                                exports.unenroll = function(item) {
                                    clearTimeout(item._idleTimeoutId);
                                    item._idleTimeout = -1;
                                };
                                exports._unrefActive = exports.active = function(
                                    item,
                                ) {
                                    clearTimeout(item._idleTimeoutId);
                                    const msecs = item._idleTimeout;
                                    if (msecs >= 0) {
                                        item._idleTimeoutId = setTimeout(
                                            function onTimeout() {
                                                if (item._onTimeout)
                                                    item._onTimeout();
                                            },
                                            msecs,
                                        );
                                    }
                                };
                                exports.setImmediate =
                                    typeof setImmediate === 'function'
                                        ? setImmediate
                                        : function(fn) {
                                              const id = nextImmediateId++;
                                              const args =
                                                  arguments.length < 2
                                                      ? false
                                                      : slice.call(
                                                            arguments,
                                                            1,
                                                        );
                                              immediateIds[id] = true;
                                              nextTick(function onNextTick() {
                                                  if (immediateIds[id]) {
                                                      if (args) {
                                                          fn.apply(null, args);
                                                      } else {
                                                          fn.call(null);
                                                      }
                                                      exports.clearImmediate(
                                                          id,
                                                      );
                                                  }
                                              });
                                              return id;
                                          };
                                exports.clearImmediate =
                                    typeof clearImmediate === 'function'
                                        ? clearImmediate
                                        : function(id) {
                                              delete immediateIds[id];
                                          };
                            }.call(
                                this,
                                require('timers').setImmediate,
                                require('timers').clearImmediate,
                            ));
                        },
                        {
                            'process/browser.js': 1,
                            timers: 3,
                        },
                    ],
                    4: [
                        function(require, module, exports) {
                            const promisePolyfill = require('promise-polyfill');
                            const Global = (function() {
                                if (typeof window !== 'undefined') {
                                    return window;
                                }
                                return Function('return this;')();
                            })();
                            module.exports = {
                                boltExport: Global.Promise || promisePolyfill,
                            };
                        },
                        { 'promise-polyfill': 2 },
                    ],
                },
                {},
                [4],
            )(4);
        });
    })(undefined, exports$1, module, undefined);
    const Promise = module.exports.boltExport;

    var nu = function(baseFn) {
        let data = Option.none();
        let callbacks = [];
        const map = function(f) {
            return nu(function(nCallback) {
                get(function(data) {
                    nCallback(f(data));
                });
            });
        };
        var get = function(nCallback) {
            if (isReady()) {
                call(nCallback);
            } else {
                callbacks.push(nCallback);
            }
        };
        const set = function(x) {
            data = Option.some(x);
            run(callbacks);
            callbacks = [];
        };
        var isReady = function() {
            return data.isSome();
        };
        var run = function(cbs) {
            each(cbs, call);
        };
        var call = function(cb) {
            data.each(function(x) {
                domGlobals.setTimeout(function() {
                    cb(x);
                }, 0);
            });
        };
        baseFn(set);
        return {
            get,
            map,
            isReady,
        };
    };
    const pure = function(a) {
        return nu(function(callback) {
            callback(a);
        });
    };
    const LazyValue = {
        nu,
        pure,
    };

    const errorReporter = function(err) {
        domGlobals.setTimeout(function() {
            throw err;
        }, 0);
    };
    var make = function(run) {
        const get = function(callback) {
            run().then(callback, errorReporter);
        };
        const map = function(fab) {
            return make(function() {
                return run().then(fab);
            });
        };
        const bind = function(aFutureB) {
            return make(function() {
                return run().then(function(v) {
                    return aFutureB(v).toPromise();
                });
            });
        };
        const anonBind = function(futureB) {
            return make(function() {
                return run().then(function() {
                    return futureB.toPromise();
                });
            });
        };
        const toLazy = function() {
            return LazyValue.nu(get);
        };
        const toCached = function() {
            let cache = null;
            return make(function() {
                if (cache === null) {
                    cache = run();
                }
                return cache;
            });
        };
        const toPromise = run;
        return {
            map,
            bind,
            anonBind,
            toLazy,
            toCached,
            toPromise,
            get,
        };
    };
    const nu$1 = function(baseFn) {
        return make(function() {
            return new Promise(baseFn);
        });
    };
    const pure$1 = function(a) {
        return make(function() {
            return Promise.resolve(a);
        });
    };
    const Future = {
        nu: nu$1,
        pure: pure$1,
    };

    const par = function(asyncValues, nu) {
        return nu(function(callback) {
            const r = [];
            let count = 0;
            const cb = function(i) {
                return function(value) {
                    r[i] = value;
                    count++;
                    if (count >= asyncValues.length) {
                        callback(r);
                    }
                };
            };
            if (asyncValues.length === 0) {
                callback([]);
            } else {
                each(asyncValues, function(asyncValue, i) {
                    asyncValue.get(cb(i));
                });
            }
        });
    };

    const par$1 = function(futures) {
        return par(futures, Future.nu);
    };
    const traverse = function(array, fn) {
        return par$1(map(array, fn));
    };

    const value = function() {
        const subject = Cell(Option.none());
        const clear = function() {
            subject.set(Option.none());
        };
        const set = function(s) {
            subject.set(Option.some(s));
        };
        const on = function(f) {
            subject.get().each(f);
        };
        const isSet = function() {
            return subject.get().isSome();
        };
        return {
            clear,
            set,
            isSet,
            on,
        };
    };

    const global$2 = tinymce.util.Tools.resolve('tinymce.Env');

    const global$3 = tinymce.util.Tools.resolve('tinymce.util.Delay');

    const global$4 = tinymce.util.Tools.resolve('tinymce.util.Tools');

    const global$5 = tinymce.util.Tools.resolve('tinymce.util.VK');

    const internalMimeType = 'x-tinymce/html';
    const internalMark = `<!-- ${internalMimeType} -->`;
    const mark = function(html) {
        return internalMark + html;
    };
    const unmark = function(html) {
        return html.replace(internalMark, '');
    };
    const isMarked = function(html) {
        return html.indexOf(internalMark) !== -1;
    };
    const InternalHtml = {
        mark,
        unmark,
        isMarked,
        internalHtmlMime() {
            return internalMimeType;
        },
    };

    const global$6 = tinymce.util.Tools.resolve('tinymce.html.Entities');

    const isPlainText = function(text) {
        return !/<(?:\/?(?!(?:div|p|br|span)>)\w+|(?:(?!(?:span style="white-space:\s?pre;?">)|br\s?\/>))\w+\s[^>]+)>/i.test(
            text,
        );
    };
    const toBRs = function(text) {
        return text.replace(/\r?\n/g, '<br>');
    };
    const openContainer = function(rootTag, rootAttrs) {
        let key;
        const attrs = [];
        let tag = `<${rootTag}`;
        if (typeof rootAttrs === 'object') {
            for (key in rootAttrs) {
                if (rootAttrs.hasOwnProperty(key)) {
                    attrs.push(
                        `${key}="${global$6.encodeAllRaw(rootAttrs[key])}"`,
                    );
                }
            }
            if (attrs.length) {
                tag += ` ${attrs.join(' ')}`;
            }
        }
        return `${tag}>`;
    };
    const toBlockElements = function(text, rootTag, rootAttrs) {
        const blocks = text.split(/\n\n/);
        const tagOpen = openContainer(rootTag, rootAttrs);
        const tagClose = `</${rootTag}>`;
        const paragraphs = global$4.map(blocks, function(p) {
            return p.split(/\n/).join('<br />');
        });
        const stitch = function(p) {
            return tagOpen + p + tagClose;
        };
        return paragraphs.length === 1
            ? paragraphs[0]
            : global$4.map(paragraphs, stitch).join('');
    };
    const convert = function(text, rootTag, rootAttrs) {
        return rootTag
            ? toBlockElements(text, rootTag === true ? 'p' : rootTag, rootAttrs)
            : toBRs(text);
    };
    const Newlines = {
        isPlainText,
        convert,
        toBRs,
        toBlockElements,
    };

    const global$7 = tinymce.util.Tools.resolve('tinymce.html.DomParser');

    const global$8 = tinymce.util.Tools.resolve('tinymce.html.Serializer');

    const global$9 = tinymce.util.Tools.resolve('tinymce.html.Node');

    const global$a = tinymce.util.Tools.resolve('tinymce.html.Schema');

    const shouldBlockDrop = function(editor) {
        return editor.getParam('paste_block_drop', false);
    };
    const shouldPasteDataImages = function(editor) {
        return editor.getParam('paste_data_images', false);
    };
    const shouldFilterDrop = function(editor) {
        return editor.getParam('paste_filter_drop', true);
    };
    const getPreProcess = function(editor) {
        return editor.getParam('paste_preprocess');
    };
    const getPostProcess = function(editor) {
        return editor.getParam('paste_postprocess');
    };
    const getWebkitStyles = function(editor) {
        return editor.getParam('paste_webkit_styles');
    };
    const shouldRemoveWebKitStyles = function(editor) {
        return editor.getParam('paste_remove_styles_if_webkit', true);
    };
    const shouldMergeFormats = function(editor) {
        return editor.getParam('paste_merge_formats', true);
    };
    const isSmartPasteEnabled = function(editor) {
        return editor.getParam('smart_paste', true);
    };
    const isPasteAsTextEnabled = function(editor) {
        return editor.getParam('paste_as_text', false);
    };
    const getRetainStyleProps = function(editor) {
        return editor.getParam('paste_retain_style_properties');
    };
    const getWordValidElements = function(editor) {
        const defaultValidElements =
            '-strong/b,-em/i,-u,-span,-p,-ol,-ul,-li,-h1,-h2,-h3,-h4,-h5,-h6,' +
            '-p/div,-a[href|name],sub,sup,strike,br,del,table[width],tr,' +
            'td[colspan|rowspan|width],th[colspan|rowspan|width],thead,tfoot,tbody';
        return editor.getParam(
            'paste_word_valid_elements',
            defaultValidElements,
        );
    };
    const shouldConvertWordFakeLists = function(editor) {
        return editor.getParam('paste_convert_word_fake_lists', true);
    };
    const shouldUseDefaultFilters = function(editor) {
        return editor.getParam('paste_enable_default_filters', true);
    };
    const Settings = {
        shouldBlockDrop,
        shouldPasteDataImages,
        shouldFilterDrop,
        getPreProcess,
        getPostProcess,
        getWebkitStyles,
        shouldRemoveWebKitStyles,
        shouldMergeFormats,
        isSmartPasteEnabled,
        isPasteAsTextEnabled,
        getRetainStyleProps,
        getWordValidElements,
        shouldConvertWordFakeLists,
        shouldUseDefaultFilters,
    };

    function filter$1(content, items) {
        global$4.each(items, function(v) {
            if (v.constructor === RegExp) {
                content = content.replace(v, '');
            } else {
                content = content.replace(v[0], v[1]);
            }
        });
        return content;
    }
    function innerText(html) {
        const schema = global$a();
        const domParser = global$7({}, schema);
        let text = '';
        const shortEndedElements = schema.getShortEndedElements();
        const ignoreElements = global$4.makeMap(
            'script noscript style textarea video audio iframe object',
            ' ',
        );
        const blockElements = schema.getBlockElements();
        function walk(node) {
            const { name } = node;
            const currentNode = node;
            if (name === 'br') {
                text += '\n';
                return;
            }
            if (name === 'wbr') {
                return;
            }
            if (shortEndedElements[name]) {
                text += ' ';
            }
            if (ignoreElements[name]) {
                text += ' ';
                return;
            }
            if (node.type === 3) {
                text += node.value;
            }
            if (!node.shortEnded) {
                if ((node = node.firstChild)) {
                    do {
                        walk(node);
                    } while ((node = node.next));
                }
            }
            if (blockElements[name] && currentNode.next) {
                text += '\n';
                if (name === 'p') {
                    text += '\n';
                }
            }
        }
        html = filter$1(html, [/<!\[[^\]]+\]>/g]);
        walk(domParser.parse(html));
        return text;
    }
    function trimHtml(html) {
        function trimSpaces(all, s1, s2) {
            if (!s1 && !s2) {
                return ' ';
            }
            return '\xA0';
        }
        html = filter$1(html, [
            /^[\s\S]*<body[^>]*>\s*|\s*<\/body[^>]*>[\s\S]*$/gi,
            /<!--StartFragment-->|<!--EndFragment-->/g,
            [
                /( ?)<span class="Apple-converted-space">\u00a0<\/span>( ?)/g,
                trimSpaces,
            ],
            /<br class="Apple-interchange-newline">/g,
            /<br>$/i,
        ]);
        return html;
    }
    function createIdGenerator(prefix) {
        let count = 0;
        return function() {
            return prefix + count++;
        };
    }
    const isMsEdge = function() {
        return domGlobals.navigator.userAgent.indexOf(' Edge/') !== -1;
    };
    const Utils = {
        filter: filter$1,
        innerText,
        trimHtml,
        createIdGenerator,
        isMsEdge,
    };

    function isWordContent(content) {
        return (
            /<font face="Times New Roman"|class="?Mso|style="[^"]*\bmso-|style='[^'']*\bmso-|w:WordDocument/i.test(
                content,
            ) ||
            /class="OutlineElement/.test(content) ||
            /id="?docs\-internal\-guid\-/.test(content)
        );
    }
    function isNumericList(text) {
        let found;
        let patterns;
        patterns = [
            /^[IVXLMCD]{1,2}\.[ \u00a0]/,
            /^[ivxlmcd]{1,2}\.[ \u00a0]/,
            /^[a-z]{1,2}[\.\)][ \u00a0]/,
            /^[A-Z]{1,2}[\.\)][ \u00a0]/,
            /^[0-9]+\.[ \u00a0]/,
            /^[\u3007\u4e00\u4e8c\u4e09\u56db\u4e94\u516d\u4e03\u516b\u4e5d]+\.[ \u00a0]/,
            /^[\u58f1\u5f10\u53c2\u56db\u4f0d\u516d\u4e03\u516b\u4e5d\u62fe]+\.[ \u00a0]/,
        ];
        text = text.replace(/^[\u00a0 ]+/, '');
        global$4.each(patterns, function(pattern) {
            if (pattern.test(text)) {
                found = true;
                return false;
            }
        });
        return found;
    }
    function isBulletList(text) {
        return /^[\s\u00a0]*[\u2022\u00b7\u00a7\u25CF]\s*/.test(text);
    }
    function convertFakeListsToProperLists(node) {
        let currentListNode;
        let prevListNode;
        let lastLevel = 1;
        function getText(node) {
            let txt = '';
            if (node.type === 3) {
                return node.value;
            }
            if ((node = node.firstChild)) {
                do {
                    txt += getText(node);
                } while ((node = node.next));
            }
            return txt;
        }
        function trimListStart(node, regExp) {
            if (node.type === 3) {
                if (regExp.test(node.value)) {
                    node.value = node.value.replace(regExp, '');
                    return false;
                }
            }
            if ((node = node.firstChild)) {
                do {
                    if (!trimListStart(node, regExp)) {
                        return false;
                    }
                } while ((node = node.next));
            }
            return true;
        }
        function removeIgnoredNodes(node) {
            if (node._listIgnore) {
                node.remove();
                return;
            }
            if ((node = node.firstChild)) {
                do {
                    removeIgnoredNodes(node);
                } while ((node = node.next));
            }
        }
        function convertParagraphToLi(paragraphNode, listName, start) {
            const level = paragraphNode._listLevel || lastLevel;
            if (level !== lastLevel) {
                if (level < lastLevel) {
                    if (currentListNode) {
                        currentListNode = currentListNode.parent.parent;
                    }
                } else {
                    prevListNode = currentListNode;
                    currentListNode = null;
                }
            }
            if (!currentListNode || currentListNode.name !== listName) {
                prevListNode = prevListNode || currentListNode;
                currentListNode = new global$9(listName, 1);
                if (start > 1) {
                    currentListNode.attr('start', `${start}`);
                }
                paragraphNode.wrap(currentListNode);
            } else {
                currentListNode.append(paragraphNode);
            }
            paragraphNode.name = 'li';
            if (level > lastLevel && prevListNode) {
                prevListNode.lastChild.append(currentListNode);
            }
            lastLevel = level;
            removeIgnoredNodes(paragraphNode);
            trimListStart(paragraphNode, /^\u00a0+/);
            trimListStart(
                paragraphNode,
                /^\s*([\u2022\u00b7\u00a7\u25CF]|\w+\.)/,
            );
            trimListStart(paragraphNode, /^\u00a0+/);
        }
        const elements = [];
        let child = node.firstChild;
        while (typeof child !== 'undefined' && child !== null) {
            elements.push(child);
            child = child.walk();
            if (child !== null) {
                while (typeof child !== 'undefined' && child.parent !== node) {
                    child = child.walk();
                }
            }
        }
        for (let i = 0; i < elements.length; i++) {
            node = elements[i];
            if (node.name === 'p' && node.firstChild) {
                const nodeText = getText(node);
                if (isBulletList(nodeText)) {
                    convertParagraphToLi(node, 'ul');
                    continue;
                }
                if (isNumericList(nodeText)) {
                    const matches = /([0-9]+)\./.exec(nodeText);
                    let start = 1;
                    if (matches) {
                        start = parseInt(matches[1], 10);
                    }
                    convertParagraphToLi(node, 'ol', start);
                    continue;
                }
                if (node._listLevel) {
                    convertParagraphToLi(node, 'ul', 1);
                    continue;
                }
                currentListNode = null;
            } else {
                prevListNode = currentListNode;
                currentListNode = null;
            }
        }
    }
    function filterStyles(editor, validStyles, node, styleValue) {
        let outputStyles = {};
        let matches;
        const styles = editor.dom.parseStyle(styleValue);
        global$4.each(styles, function(value, name) {
            switch (name) {
                case 'mso-list':
                    matches = /\w+ \w+([0-9]+)/i.exec(styleValue);
                    if (matches) {
                        node._listLevel = parseInt(matches[1], 10);
                    }
                    if (/Ignore/i.test(value) && node.firstChild) {
                        node._listIgnore = true;
                        node.firstChild._listIgnore = true;
                    }
                    break;
                case 'horiz-align':
                    name = 'text-align';
                    break;
                case 'vert-align':
                    name = 'vertical-align';
                    break;
                case 'font-color':
                case 'mso-foreground':
                    name = 'color';
                    break;
                case 'mso-background':
                case 'mso-highlight':
                    name = 'background';
                    break;
                case 'font-weight':
                case 'font-style':
                    if (value !== 'normal') {
                        outputStyles[name] = value;
                    }
                    return;
                case 'mso-element':
                    if (/^(comment|comment-list)$/i.test(value)) {
                        node.remove();
                        return;
                    }
                    break;
            }
            if (name.indexOf('mso-comment') === 0) {
                node.remove();
                return;
            }
            if (name.indexOf('mso-') === 0) {
                return;
            }
            if (
                Settings.getRetainStyleProps(editor) === 'all' ||
                (validStyles && validStyles[name])
            ) {
                outputStyles[name] = value;
            }
        });
        if (/(bold)/i.test(outputStyles['font-weight'])) {
            delete outputStyles['font-weight'];
            node.wrap(new global$9('b', 1));
        }
        if (/(italic)/i.test(outputStyles['font-style'])) {
            delete outputStyles['font-style'];
            node.wrap(new global$9('i', 1));
        }
        outputStyles = editor.dom.serializeStyle(outputStyles, node.name);
        if (outputStyles) {
            return outputStyles;
        }
        return null;
    }
    const filterWordContent = function(editor, content) {
        let retainStyleProperties;
        let validStyles;
        retainStyleProperties = Settings.getRetainStyleProps(editor);
        if (retainStyleProperties) {
            validStyles = global$4.makeMap(retainStyleProperties.split(/[, ]/));
        }
        content = Utils.filter(content, [
            /<br class="?Apple-interchange-newline"?>/gi,
            /<b[^>]+id="?docs-internal-[^>]*>/gi,
            /<!--[\s\S]+?-->/gi,
            /<(!|script[^>]*>.*?<\/script(?=[>\s])|\/?(\?xml(:\w+)?|img|meta|link|style|\w:\w+)(?=[\s\/>]))[^>]*>/gi,
            [/<(\/?)s>/gi, '<$1strike>'],
            [/&nbsp;/gi, '\xA0'],
            [
                /<span\s+style\s*=\s*"\s*mso-spacerun\s*:\s*yes\s*;?\s*"\s*>([\s\u00a0]*)<\/span>/gi,
                function(str, spaces) {
                    return spaces.length > 0
                        ? spaces
                              .replace(/./, ' ')
                              .slice(Math.floor(spaces.length / 2))
                              .split('')
                              .join('\xA0')
                        : '';
                },
            ],
        ]);
        const validElements = Settings.getWordValidElements(editor);
        const schema = global$a({
            valid_elements: validElements,
            valid_children: '-li[p]',
        });
        global$4.each(schema.elements, function(rule) {
            if (!rule.attributes.class) {
                rule.attributes.class = {};
                rule.attributesOrder.push('class');
            }
            if (!rule.attributes.style) {
                rule.attributes.style = {};
                rule.attributesOrder.push('style');
            }
        });
        const domParser = global$7({}, schema);
        domParser.addAttributeFilter('style', function(nodes) {
            let i = nodes.length;
            let node;
            while (i--) {
                node = nodes[i];
                node.attr(
                    'style',
                    filterStyles(editor, validStyles, node, node.attr('style')),
                );
                if (
                    node.name === 'span' &&
                    node.parent &&
                    !node.attributes.length
                ) {
                    node.unwrap();
                }
            }
        });
        domParser.addAttributeFilter('class', function(nodes) {
            let i = nodes.length;
            let node;
            let className;
            while (i--) {
                node = nodes[i];
                className = node.attr('class');
                if (
                    /^(MsoCommentReference|MsoCommentText|msoDel)$/i.test(
                        className,
                    )
                ) {
                    node.remove();
                }
                node.attr('class', null);
            }
        });
        domParser.addNodeFilter('del', function(nodes) {
            let i = nodes.length;
            while (i--) {
                nodes[i].remove();
            }
        });
        domParser.addNodeFilter('a', function(nodes) {
            let i = nodes.length;
            let node;
            let href;
            let name;
            while (i--) {
                node = nodes[i];
                href = node.attr('href');
                name = node.attr('name');
                if (href && href.indexOf('#_msocom_') !== -1) {
                    node.remove();
                    continue;
                }
                if (href && href.indexOf('file://') === 0) {
                    href = href.split('#')[1];
                    if (href) {
                        href = `#${href}`;
                    }
                }
                if (!href && !name) {
                    node.unwrap();
                } else {
                    if (name && !/^_?(?:toc|edn|ftn)/i.test(name)) {
                        node.unwrap();
                        continue;
                    }
                    node.attr({
                        href,
                        name,
                    });
                }
            }
        });
        const rootNode = domParser.parse(content);
        if (Settings.shouldConvertWordFakeLists(editor)) {
            convertFakeListsToProperLists(rootNode);
        }
        content = global$8(
            { validate: editor.settings.validate },
            schema,
        ).serialize(rootNode);
        return content;
    };
    const preProcess = function(editor, content) {
        return Settings.shouldUseDefaultFilters(editor)
            ? filterWordContent(editor, content)
            : content;
    };
    const WordFilter = {
        preProcess,
        isWordContent,
    };

    const preProcess$1 = function(editor, html) {
        const parser = global$7({}, editor.schema);
        parser.addNodeFilter('meta', function(nodes) {
            global$4.each(nodes, function(node) {
                return node.remove();
            });
        });
        const fragment = parser.parse(html, {
            forced_root_block: false,
            isRootContent: true,
        });
        return global$8(
            { validate: editor.settings.validate },
            editor.schema,
        ).serialize(fragment);
    };
    const processResult = function(content, cancelled) {
        return {
            content,
            cancelled,
        };
    };
    const postProcessFilter = function(editor, html, internal, isWordHtml) {
        const tempBody = editor.dom.create(
            'div',
            { style: 'display:none' },
            html,
        );
        const postProcessArgs = Events.firePastePostProcess(
            editor,
            tempBody,
            internal,
            isWordHtml,
        );
        return processResult(
            postProcessArgs.node.innerHTML,
            postProcessArgs.isDefaultPrevented(),
        );
    };
    const filterContent = function(editor, content, internal, isWordHtml) {
        const preProcessArgs = Events.firePastePreProcess(
            editor,
            content,
            internal,
            isWordHtml,
        );
        const filteredContent = preProcess$1(editor, preProcessArgs.content);
        if (
            editor.hasEventListeners('PastePostProcess') &&
            !preProcessArgs.isDefaultPrevented()
        ) {
            return postProcessFilter(
                editor,
                filteredContent,
                internal,
                isWordHtml,
            );
        }
        return processResult(
            filteredContent,
            preProcessArgs.isDefaultPrevented(),
        );
    };
    const process = function(editor, html, internal) {
        const isWordHtml = WordFilter.isWordContent(html);
        const content = isWordHtml ? WordFilter.preProcess(editor, html) : html;
        return filterContent(editor, content, internal, isWordHtml);
    };
    const ProcessFilters = { process };

    const pasteHtml = function(editor, html) {
        editor.insertContent(html, {
            merge: Settings.shouldMergeFormats(editor),
            paste: true,
        });
        return true;
    };
    const isAbsoluteUrl = function(url) {
        return /^https?:\/\/[\w\?\-\/+=.&%@~#]+$/i.test(url);
    };
    const isImageUrl = function(url) {
        return isAbsoluteUrl(url) && /.(gif|jpe?g|png)$/.test(url);
    };
    const createImage = function(editor, url, pasteHtmlFn) {
        editor.undoManager.extra(
            function() {
                pasteHtmlFn(editor, url);
            },
            function() {
                editor.insertContent(`<img src="${url}">`);
            },
        );
        return true;
    };
    const createLink = function(editor, url, pasteHtmlFn) {
        editor.undoManager.extra(
            function() {
                pasteHtmlFn(editor, url);
            },
            function() {
                editor.execCommand('mceInsertLink', false, url);
            },
        );
        return true;
    };
    const linkSelection = function(editor, html, pasteHtmlFn) {
        return editor.selection.isCollapsed() === false && isAbsoluteUrl(html)
            ? createLink(editor, html, pasteHtmlFn)
            : false;
    };
    const insertImage = function(editor, html, pasteHtmlFn) {
        return isImageUrl(html)
            ? createImage(editor, html, pasteHtmlFn)
            : false;
    };
    const smartInsertContent = function(editor, html) {
        global$4.each([linkSelection, insertImage, pasteHtml], function(
            action,
        ) {
            return action(editor, html, pasteHtml) !== true;
        });
    };
    const insertContent = function(editor, html, pasteAsText) {
        if (pasteAsText || Settings.isSmartPasteEnabled(editor) === false) {
            pasteHtml(editor, html);
        } else {
            smartInsertContent(editor, html);
        }
    };
    const SmartPaste = {
        isImageUrl,
        isAbsoluteUrl,
        insertContent,
    };

    const isCollapsibleWhitespace = function(c) {
        return ' \f\t\x0B'.indexOf(c) !== -1;
    };
    const isNewLineChar = function(c) {
        return c === '\n' || c === '\r';
    };
    const isNewline = function(text, idx) {
        return idx < text.length && idx >= 0 ? isNewLineChar(text[idx]) : false;
    };
    const normalizeWhitespace = function(text) {
        const result = foldl(
            text,
            function(acc, c) {
                if (isCollapsibleWhitespace(c) || c === '\xA0') {
                    if (
                        acc.pcIsSpace ||
                        acc.str === '' ||
                        acc.str.length === text.length - 1 ||
                        isNewline(text, acc.str.length + 1)
                    ) {
                        return {
                            pcIsSpace: false,
                            str: `${acc.str}\xA0`,
                        };
                    }
                    return {
                        pcIsSpace: true,
                        str: `${acc.str} `,
                    };
                }
                return {
                    pcIsSpace: isNewLineChar(c),
                    str: acc.str + c,
                };
            },
            {
                pcIsSpace: false,
                str: '',
            },
        );
        return result.str;
    };

    const doPaste = function(editor, content, internal, pasteAsText) {
        const args = ProcessFilters.process(editor, content, internal);
        if (args.cancelled === false) {
            SmartPaste.insertContent(editor, args.content, pasteAsText);
        }
    };
    const pasteHtml$1 = function(editor, html, internalFlag) {
        const internal = internalFlag || InternalHtml.isMarked(html);
        doPaste(editor, InternalHtml.unmark(html), internal, false);
    };
    const pasteText = function(editor, text) {
        const encodedText = editor.dom.encode(text).replace(/\r\n/g, '\n');
        const normalizedText = normalizeWhitespace(encodedText);
        const html = Newlines.convert(
            normalizedText,
            editor.settings.forced_root_block,
            editor.settings.forced_root_block_attrs,
        );
        doPaste(editor, html, false, true);
    };
    const getDataTransferItems = function(dataTransfer) {
        const items = {};
        const mceInternalUrlPrefix = 'data:text/mce-internal,';
        if (dataTransfer) {
            if (dataTransfer.getData) {
                const legacyText = dataTransfer.getData('Text');
                if (legacyText && legacyText.length > 0) {
                    if (legacyText.indexOf(mceInternalUrlPrefix) === -1) {
                        items['text/plain'] = legacyText;
                    }
                }
            }
            if (dataTransfer.types) {
                for (let i = 0; i < dataTransfer.types.length; i++) {
                    const contentType = dataTransfer.types[i];
                    try {
                        items[contentType] = dataTransfer.getData(contentType);
                    } catch (ex) {
                        items[contentType] = '';
                    }
                }
            }
        }
        return items;
    };
    const getClipboardContent = function(editor, clipboardEvent) {
        const content = getDataTransferItems(
            clipboardEvent.clipboardData || editor.getDoc().dataTransfer,
        );
        return Utils.isMsEdge()
            ? global$4.extend(content, { 'text/html': '' })
            : content;
    };
    const hasContentType = function(clipboardContent, mimeType) {
        return (
            mimeType in clipboardContent &&
            clipboardContent[mimeType].length > 0
        );
    };
    const hasHtmlOrText = function(content) {
        return (
            hasContentType(content, 'text/html') ||
            hasContentType(content, 'text/plain')
        );
    };
    const getBase64FromUri = function(uri) {
        let idx;
        idx = uri.indexOf(',');
        if (idx !== -1) {
            return uri.substr(idx + 1);
        }
        return null;
    };
    const isValidDataUriImage = function(settings, imgElm) {
        return settings.images_dataimg_filter
            ? settings.images_dataimg_filter(imgElm)
            : true;
    };
    const extractFilename = function(editor, str) {
        const m = str.match(/([\s\S]+?)\.(?:jpeg|jpg|png|gif)$/i);
        return m ? editor.dom.encode(m[1]) : null;
    };
    const uniqueId = Utils.createIdGenerator('mceclip');
    const pasteImage = function(editor, imageItem) {
        const base64 = getBase64FromUri(imageItem.uri);
        const id = uniqueId();
        const name =
            editor.settings.images_reuse_filename && imageItem.blob.name
                ? extractFilename(editor, imageItem.blob.name)
                : id;
        const img = new domGlobals.Image();
        img.src = imageItem.uri;
        if (isValidDataUriImage(editor.settings, img)) {
            const { blobCache } = editor.editorUpload;
            let blobInfo = void 0;
            let existingBlobInfo = void 0;
            existingBlobInfo = blobCache.findFirst(function(cachedBlobInfo) {
                return cachedBlobInfo.base64() === base64;
            });
            if (!existingBlobInfo) {
                blobInfo = blobCache.create(id, imageItem.blob, base64, name);
                blobCache.add(blobInfo);
            } else {
                blobInfo = existingBlobInfo;
            }
            pasteHtml$1(editor, `<img src="${blobInfo.blobUri()}">`, false);
        } else {
            pasteHtml$1(editor, `<img src="${imageItem.uri}">`, false);
        }
    };
    const isClipboardEvent = function(event) {
        return event.type === 'paste';
    };
    const readBlobsAsDataUris = function(items) {
        return traverse(items, function(item) {
            return Future.nu(function(resolve) {
                const blob = item.getAsFile ? item.getAsFile() : item;
                const reader = new window.FileReader();
                reader.onload = function() {
                    resolve({
                        blob,
                        uri: reader.result,
                    });
                };
                reader.readAsDataURL(blob);
            });
        });
    };
    const getImagesFromDataTransfer = function(dataTransfer) {
        const items = dataTransfer.items
            ? map(from$1(dataTransfer.items), function(item) {
                  return item.getAsFile();
              })
            : [];
        const files = dataTransfer.files ? from$1(dataTransfer.files) : [];
        const images = filter(items.length > 0 ? items : files, function(file) {
            return /^image\/(jpeg|png|gif|bmp)$/.test(file.type);
        });
        return images;
    };
    const pasteImageData = function(editor, e, rng) {
        const dataTransfer = isClipboardEvent(e)
            ? e.clipboardData
            : e.dataTransfer;
        if (editor.settings.paste_data_images && dataTransfer) {
            const images = getImagesFromDataTransfer(dataTransfer);
            if (images.length > 0) {
                e.preventDefault();
                readBlobsAsDataUris(images).get(function(blobResults) {
                    if (rng) {
                        editor.selection.setRng(rng);
                    }
                    each(blobResults, function(result) {
                        pasteImage(editor, result);
                    });
                });
                return true;
            }
        }
        return false;
    };
    const isBrokenAndroidClipboardEvent = function(e) {
        const { clipboardData } = e;
        return (
            domGlobals.navigator.userAgent.indexOf('Android') !== -1 &&
            clipboardData &&
            clipboardData.items &&
            clipboardData.items.length === 0
        );
    };
    const isKeyboardPasteEvent = function(e) {
        return (
            (global$5.metaKeyPressed(e) && e.keyCode === 86) ||
            (e.shiftKey && e.keyCode === 45)
        );
    };
    const registerEventHandlers = function(editor, pasteBin, pasteFormat) {
        const keyboardPasteEvent = value();
        let keyboardPastePlainTextState;
        editor.on('keydown', function(e) {
            function removePasteBinOnKeyUp(e) {
                if (isKeyboardPasteEvent(e) && !e.isDefaultPrevented()) {
                    pasteBin.remove();
                }
            }
            if (isKeyboardPasteEvent(e) && !e.isDefaultPrevented()) {
                keyboardPastePlainTextState = e.shiftKey && e.keyCode === 86;
                if (
                    keyboardPastePlainTextState &&
                    global$2.webkit &&
                    domGlobals.navigator.userAgent.indexOf('Version/') !== -1
                ) {
                    return;
                }
                e.stopImmediatePropagation();
                keyboardPasteEvent.set(e);
                window.setTimeout(function() {
                    keyboardPasteEvent.clear();
                }, 100);
                if (global$2.ie && keyboardPastePlainTextState) {
                    e.preventDefault();
                    Events.firePaste(editor, true);
                    return;
                }
                pasteBin.remove();
                pasteBin.create();
                editor.once('keyup', removePasteBinOnKeyUp);
                editor.once('paste', function() {
                    editor.off('keyup', removePasteBinOnKeyUp);
                });
            }
        });
        function insertClipboardContent(
            clipboardContent,
            isKeyBoardPaste,
            plainTextMode,
            internal,
        ) {
            let content;
            let isPlainTextHtml;
            let isImage;
            if (hasContentType(clipboardContent, 'text/html')) {
                content = clipboardContent['text/html'];
            } else {
                content = pasteBin.getHtml();
                internal = internal || InternalHtml.isMarked(content);
                if (pasteBin.isDefaultContent(content)) {
                    plainTextMode = true;
                }
            }
            content = Utils.trimHtml(content);
            pasteBin.remove();
            isPlainTextHtml =
                internal === false && Newlines.isPlainText(content);
            isImage = SmartPaste.isImageUrl(content);
            if (!content.length || (isPlainTextHtml && !isImage)) {
                plainTextMode = true;
            }
            if (plainTextMode || isImage) {
                if (
                    hasContentType(clipboardContent, 'text/plain') &&
                    isPlainTextHtml
                ) {
                    content = clipboardContent['text/plain'];
                } else {
                    content = Utils.innerText(content);
                }
            }
            if (pasteBin.isDefaultContent(content)) {
                if (!isKeyBoardPaste) {
                    editor.windowManager.alert(
                        'Please use Ctrl+V/Cmd+V keyboard shortcuts to paste contents.',
                    );
                }
                return;
            }
            if (plainTextMode) {
                pasteText(editor, content);
            } else {
                pasteHtml$1(editor, content, internal);
            }
        }
        const getLastRng = function() {
            return pasteBin.getLastRng() || editor.selection.getRng();
        };
        editor.on('paste', function(e) {
            const isKeyBoardPaste = keyboardPasteEvent.isSet();
            const clipboardContent = getClipboardContent(editor, e);
            const plainTextMode =
                pasteFormat.get() === 'text' || keyboardPastePlainTextState;
            let internal = hasContentType(
                clipboardContent,
                InternalHtml.internalHtmlMime(),
            );
            keyboardPastePlainTextState = false;
            if (e.isDefaultPrevented() || isBrokenAndroidClipboardEvent(e)) {
                pasteBin.remove();
                return;
            }
            if (
                !hasHtmlOrText(clipboardContent) &&
                pasteImageData(editor, e, getLastRng())
            ) {
                pasteBin.remove();
                return;
            }
            if (!isKeyBoardPaste) {
                e.preventDefault();
            }
            if (
                global$2.ie &&
                (!isKeyBoardPaste || e.ieFake) &&
                !hasContentType(clipboardContent, 'text/html')
            ) {
                pasteBin.create();
                editor.dom.bind(pasteBin.getEl(), 'paste', function(e) {
                    e.stopPropagation();
                });
                editor.getDoc().execCommand('Paste', false, null);
                clipboardContent['text/html'] = pasteBin.getHtml();
            }
            if (hasContentType(clipboardContent, 'text/html')) {
                e.preventDefault();
                if (!internal) {
                    internal = InternalHtml.isMarked(
                        clipboardContent['text/html'],
                    );
                }
                insertClipboardContent(
                    clipboardContent,
                    isKeyBoardPaste,
                    plainTextMode,
                    internal,
                );
            } else {
                global$3.setEditorTimeout(
                    editor,
                    function() {
                        insertClipboardContent(
                            clipboardContent,
                            isKeyBoardPaste,
                            plainTextMode,
                            internal,
                        );
                    },
                    0,
                );
            }
        });
    };
    const registerEventsAndFilters = function(editor, pasteBin, pasteFormat) {
        registerEventHandlers(editor, pasteBin, pasteFormat);
        let src;
        editor.parser.addNodeFilter('img', function(nodes, name, args) {
            const isPasteInsert = function(args) {
                return args.data && args.data.paste === true;
            };
            const remove = function(node) {
                if (
                    !node.attr('data-mce-object') &&
                    src !== global$2.transparentSrc
                ) {
                    node.remove();
                }
            };
            const isWebKitFakeUrl = function(src) {
                return src.indexOf('webkit-fake-url') === 0;
            };
            const isDataUri = function(src) {
                return src.indexOf('data:') === 0;
            };
            if (!editor.settings.paste_data_images && isPasteInsert(args)) {
                let i = nodes.length;
                while (i--) {
                    src = nodes[i].attr('src');
                    if (!src) {
                        continue;
                    }
                    if (isWebKitFakeUrl(src)) {
                        remove(nodes[i]);
                    } else if (
                        !editor.settings.allow_html_data_urls &&
                        isDataUri(src)
                    ) {
                        remove(nodes[i]);
                    }
                }
            }
        });
    };

    const getPasteBinParent = function(editor) {
        return global$2.ie && editor.inline
            ? domGlobals.document.body
            : editor.getBody();
    };
    const isExternalPasteBin = function(editor) {
        return getPasteBinParent(editor) !== editor.getBody();
    };
    const delegatePasteEvents = function(
        editor,
        pasteBinElm,
        pasteBinDefaultContent,
    ) {
        if (isExternalPasteBin(editor)) {
            editor.dom.bind(pasteBinElm, 'paste keyup', function(e) {
                if (!isDefault(editor, pasteBinDefaultContent)) {
                    editor.fire('paste');
                }
            });
        }
    };
    const create = function(editor, lastRngCell, pasteBinDefaultContent) {
        const { dom } = editor;
        const body = editor.getBody();
        let pasteBinElm;
        lastRngCell.set(editor.selection.getRng());
        pasteBinElm = editor.dom.add(
            getPasteBinParent(editor),
            'div',
            {
                id: 'mcepastebin',
                class: 'mce-pastebin',
                contentEditable: true,
                'data-mce-bogus': 'all',
                style:
                    'position: fixed; top: 50%; width: 10px; height: 10px; overflow: hidden; opacity: 0',
            },
            pasteBinDefaultContent,
        );
        if (global$2.ie || global$2.gecko) {
            dom.setStyle(
                pasteBinElm,
                'left',
                dom.getStyle(body, 'direction', true) === 'rtl'
                    ? 65535
                    : -65535,
            );
        }
        dom.bind(pasteBinElm, 'beforedeactivate focusin focusout', function(e) {
            e.stopPropagation();
        });
        delegatePasteEvents(editor, pasteBinElm, pasteBinDefaultContent);
        pasteBinElm.focus();
        editor.selection.select(pasteBinElm, true);
    };
    const remove = function(editor, lastRngCell) {
        if (getEl(editor)) {
            let pasteBinClone = void 0;
            const lastRng = lastRngCell.get();
            while ((pasteBinClone = editor.dom.get('mcepastebin'))) {
                editor.dom.remove(pasteBinClone);
                editor.dom.unbind(pasteBinClone);
            }
            if (lastRng) {
                editor.selection.setRng(lastRng);
            }
        }
        lastRngCell.set(null);
    };
    var getEl = function(editor) {
        return editor.dom.get('mcepastebin');
    };
    const getHtml = function(editor) {
        let pasteBinElm;
        let pasteBinClones;
        let i;
        let dirtyWrappers;
        let cleanWrapper;
        const copyAndRemove = function(toElm, fromElm) {
            toElm.appendChild(fromElm);
            editor.dom.remove(fromElm, true);
        };
        pasteBinClones = global$4.grep(
            getPasteBinParent(editor).childNodes,
            function(elm) {
                return elm.id === 'mcepastebin';
            },
        );
        pasteBinElm = pasteBinClones.shift();
        global$4.each(pasteBinClones, function(pasteBinClone) {
            copyAndRemove(pasteBinElm, pasteBinClone);
        });
        dirtyWrappers = editor.dom.select('div[id=mcepastebin]', pasteBinElm);
        for (i = dirtyWrappers.length - 1; i >= 0; i--) {
            cleanWrapper = editor.dom.create('div');
            pasteBinElm.insertBefore(cleanWrapper, dirtyWrappers[i]);
            copyAndRemove(cleanWrapper, dirtyWrappers[i]);
        }
        return pasteBinElm ? pasteBinElm.innerHTML : '';
    };
    const getLastRng = function(lastRng) {
        return lastRng.get();
    };
    const isDefaultContent = function(pasteBinDefaultContent, content) {
        return content === pasteBinDefaultContent;
    };
    const isPasteBin = function(elm) {
        return elm && elm.id === 'mcepastebin';
    };
    var isDefault = function(editor, pasteBinDefaultContent) {
        const pasteBinElm = getEl(editor);
        return (
            isPasteBin(pasteBinElm) &&
            isDefaultContent(pasteBinDefaultContent, pasteBinElm.innerHTML)
        );
    };
    const PasteBin = function(editor) {
        const lastRng = Cell(null);
        const pasteBinDefaultContent = '%MCEPASTEBIN%';
        return {
            create() {
                return create(editor, lastRng, pasteBinDefaultContent);
            },
            remove() {
                return remove(editor, lastRng);
            },
            getEl() {
                return getEl(editor);
            },
            getHtml() {
                return getHtml(editor);
            },
            getLastRng() {
                return getLastRng(lastRng);
            },
            isDefault() {
                return isDefault(editor, pasteBinDefaultContent);
            },
            isDefaultContent(content) {
                return isDefaultContent(pasteBinDefaultContent, content);
            },
        };
    };

    const Clipboard = function(editor, pasteFormat) {
        const pasteBin = PasteBin(editor);
        editor.on('PreInit', function() {
            return registerEventsAndFilters(editor, pasteBin, pasteFormat);
        });
        return {
            pasteFormat,
            pasteHtml(html, internalFlag) {
                return pasteHtml$1(editor, html, internalFlag);
            },
            pasteText(text) {
                return pasteText(editor, text);
            },
            pasteImageData(e, rng) {
                return pasteImageData(editor, e, rng);
            },
            getDataTransferItems,
            hasHtmlOrText,
            hasContentType,
        };
    };

    const hasWorkingClipboardApi = function(clipboardData) {
        return (
            global$2.iOS === false &&
            clipboardData !== undefined &&
            typeof clipboardData.setData === 'function' &&
            Utils.isMsEdge() !== true
        );
    };
    const setHtml5Clipboard = function(clipboardData, html, text) {
        if (hasWorkingClipboardApi(clipboardData)) {
            try {
                clipboardData.clearData();
                clipboardData.setData('text/html', html);
                clipboardData.setData('text/plain', text);
                clipboardData.setData(InternalHtml.internalHtmlMime(), html);
                return true;
            } catch (e) {
                return false;
            }
        } else {
            return false;
        }
    };
    const setClipboardData = function(evt, data, fallback, done) {
        if (setHtml5Clipboard(evt.clipboardData, data.html, data.text)) {
            evt.preventDefault();
            done();
        } else {
            fallback(data.html, done);
        }
    };
    const fallback = function(editor) {
        return function(html, done) {
            const markedHtml = InternalHtml.mark(html);
            const outer = editor.dom.create('div', {
                contenteditable: 'false',
                'data-mce-bogus': 'all',
            });
            const inner = editor.dom.create(
                'div',
                { contenteditable: 'true' },
                markedHtml,
            );
            editor.dom.setStyles(outer, {
                position: 'fixed',
                top: '0',
                left: '-3000px',
                width: '1000px',
                overflow: 'hidden',
            });
            outer.appendChild(inner);
            editor.dom.add(editor.getBody(), outer);
            const range = editor.selection.getRng();
            inner.focus();
            const offscreenRange = editor.dom.createRng();
            offscreenRange.selectNodeContents(inner);
            editor.selection.setRng(offscreenRange);
            global$3.setTimeout(function() {
                editor.selection.setRng(range);
                outer.parentNode.removeChild(outer);
                done();
            }, 0);
        };
    };
    const getData = function(editor) {
        return {
            html: editor.selection.getContent({ contextual: true }),
            text: editor.selection.getContent({ format: 'text' }),
        };
    };
    const isTableSelection = function(editor) {
        return !!editor.dom.getParent(
            editor.selection.getStart(),
            'td[data-mce-selected],th[data-mce-selected]',
            editor.getBody(),
        );
    };
    const hasSelectedContent = function(editor) {
        return !editor.selection.isCollapsed() || isTableSelection(editor);
    };
    const cut = function(editor) {
        return function(evt) {
            if (hasSelectedContent(editor)) {
                setClipboardData(
                    evt,
                    getData(editor),
                    fallback(editor),
                    function() {
                        if (global$2.browser.isChrome()) {
                            const rng_1 = editor.selection.getRng();
                            global$3.setEditorTimeout(
                                editor,
                                function() {
                                    editor.selection.setRng(rng_1);
                                    editor.execCommand('Delete');
                                },
                                0,
                            );
                        } else {
                            editor.execCommand('Delete');
                        }
                    },
                );
            }
        };
    };
    const copy = function(editor) {
        return function(evt) {
            if (hasSelectedContent(editor)) {
                setClipboardData(
                    evt,
                    getData(editor),
                    fallback(editor),
                    function() {},
                );
            }
        };
    };
    const register$1 = function(editor) {
        editor.on('cut', cut(editor));
        editor.on('copy', copy(editor));
    };
    const CutCopy = { register: register$1 };

    const global$b = tinymce.util.Tools.resolve('tinymce.dom.RangeUtils');

    const getCaretRangeFromEvent = function(editor, e) {
        return global$b.getCaretRangeFromPoint(
            e.clientX,
            e.clientY,
            editor.getDoc(),
        );
    };
    const isPlainTextFileUrl = function(content) {
        const plainTextContent = content['text/plain'];
        return plainTextContent
            ? plainTextContent.indexOf('file://') === 0
            : false;
    };
    const setFocusedRange = function(editor, rng) {
        editor.focus();
        editor.selection.setRng(rng);
    };
    const setup = function(editor, clipboard, draggingInternallyState) {
        if (Settings.shouldBlockDrop(editor)) {
            editor.on(
                'dragend dragover draggesture dragdrop drop drag',
                function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                },
            );
        }
        if (!Settings.shouldPasteDataImages(editor)) {
            editor.on('drop', function(e) {
                const { dataTransfer } = e;
                if (
                    dataTransfer &&
                    dataTransfer.files &&
                    dataTransfer.files.length > 0
                ) {
                    e.preventDefault();
                }
            });
        }
        editor.on('drop', function(e) {
            let dropContent;
            let rng;
            rng = getCaretRangeFromEvent(editor, e);
            if (e.isDefaultPrevented() || draggingInternallyState.get()) {
                return;
            }
            dropContent = clipboard.getDataTransferItems(e.dataTransfer);
            const internal = clipboard.hasContentType(
                dropContent,
                InternalHtml.internalHtmlMime(),
            );
            if (
                (!clipboard.hasHtmlOrText(dropContent) ||
                    isPlainTextFileUrl(dropContent)) &&
                clipboard.pasteImageData(e, rng)
            ) {
                return;
            }
            if (rng && Settings.shouldFilterDrop(editor)) {
                let content_1 =
                    dropContent['mce-internal'] ||
                    dropContent['text/html'] ||
                    dropContent['text/plain'];
                if (content_1) {
                    e.preventDefault();
                    global$3.setEditorTimeout(editor, function() {
                        editor.undoManager.transact(function() {
                            if (dropContent['mce-internal']) {
                                editor.execCommand('Delete');
                            }
                            setFocusedRange(editor, rng);
                            content_1 = Utils.trimHtml(content_1);
                            if (!dropContent['text/html']) {
                                clipboard.pasteText(content_1);
                            } else {
                                clipboard.pasteHtml(content_1, internal);
                            }
                        });
                    });
                }
            }
        });
        editor.on('dragstart', function(e) {
            draggingInternallyState.set(true);
        });
        editor.on('dragover dragend', function(e) {
            if (
                Settings.shouldPasteDataImages(editor) &&
                draggingInternallyState.get() === false
            ) {
                e.preventDefault();
                setFocusedRange(editor, getCaretRangeFromEvent(editor, e));
            }
            if (e.type === 'dragend') {
                draggingInternallyState.set(false);
            }
        });
    };
    const DragDrop = { setup };

    const setup$1 = function(editor) {
        const plugin = editor.plugins.paste;
        const preProcess = Settings.getPreProcess(editor);
        if (preProcess) {
            editor.on('PastePreProcess', function(e) {
                preProcess.call(plugin, plugin, e);
            });
        }
        const postProcess = Settings.getPostProcess(editor);
        if (postProcess) {
            editor.on('PastePostProcess', function(e) {
                postProcess.call(plugin, plugin, e);
            });
        }
    };
    const PrePostProcess = { setup: setup$1 };

    function addPreProcessFilter(editor, filterFunc) {
        editor.on('PastePreProcess', function(e) {
            e.content = filterFunc(
                editor,
                e.content,
                e.internal,
                e.wordContent,
            );
        });
    }
    function addPostProcessFilter(editor, filterFunc) {
        editor.on('PastePostProcess', function(e) {
            filterFunc(editor, e.node);
        });
    }
    function removeExplorerBrElementsAfterBlocks(editor, html) {
        if (!WordFilter.isWordContent(html)) {
            return html;
        }
        const blockElements = [];
        global$4.each(editor.schema.getBlockElements(), function(
            block,
            blockName,
        ) {
            blockElements.push(blockName);
        });
        const explorerBlocksRegExp = new RegExp(
            `(?:<br>&nbsp;[\\s\\r\\n]+|<br>)*(<\\/?(${blockElements.join(
                '|',
            )})[^>]*>)(?:<br>&nbsp;[\\s\\r\\n]+|<br>)*`,
            'g',
        );
        html = Utils.filter(html, [[explorerBlocksRegExp, '$1']]);
        html = Utils.filter(html, [
            [/<br><br>/g, '<BR><BR>'],
            [/<br>/g, ' '],
            [/<BR><BR>/g, '<br>'],
        ]);
        return html;
    }
    function removeWebKitStyles(editor, content, internal, isWordHtml) {
        if (isWordHtml || internal) {
            return content;
        }
        const webKitStylesSetting = Settings.getWebkitStyles(editor);
        let webKitStyles;
        if (
            Settings.shouldRemoveWebKitStyles(editor) === false ||
            webKitStylesSetting === 'all'
        ) {
            return content;
        }
        if (webKitStylesSetting) {
            webKitStyles = webKitStylesSetting.split(/[, ]/);
        }
        if (webKitStyles) {
            const dom_1 = editor.dom;
            const node_1 = editor.selection.getNode();
            content = content.replace(
                /(<[^>]+) style="([^"]*)"([^>]*>)/gi,
                function(all, before, value, after) {
                    const inputStyles = dom_1.parseStyle(dom_1.decode(value));
                    let outputStyles = {};
                    if (webKitStyles === 'none') {
                        return before + after;
                    }
                    for (let i = 0; i < webKitStyles.length; i++) {
                        let inputValue = inputStyles[webKitStyles[i]];
                        let currentValue = dom_1.getStyle(
                            node_1,
                            webKitStyles[i],
                            true,
                        );
                        if (/color/.test(webKitStyles[i])) {
                            inputValue = dom_1.toHex(inputValue);
                            currentValue = dom_1.toHex(currentValue);
                        }
                        if (currentValue !== inputValue) {
                            outputStyles[webKitStyles[i]] = inputValue;
                        }
                    }
                    outputStyles = dom_1.serializeStyle(outputStyles, 'span');
                    if (outputStyles) {
                        return `${before} style="${outputStyles}"${after}`;
                    }
                    return before + after;
                },
            );
        } else {
            content = content.replace(
                /(<[^>]+) style="([^"]*)"([^>]*>)/gi,
                '$1$3',
            );
        }
        content = content.replace(
            /(<[^>]+) data-mce-style="([^"]+)"([^>]*>)/gi,
            function(all, before, value, after) {
                return `${before} style="${value}"${after}`;
            },
        );
        return content;
    }
    function removeUnderlineAndFontInAnchor(editor, root) {
        editor
            .$('a', root)
            .find('font,u')
            .each(function(i, node) {
                editor.dom.remove(node, true);
            });
    }
    const setup$2 = function(editor) {
        if (global$2.webkit) {
            addPreProcessFilter(editor, removeWebKitStyles);
        }
        if (global$2.ie) {
            addPreProcessFilter(editor, removeExplorerBrElementsAfterBlocks);
            addPostProcessFilter(editor, removeUnderlineAndFontInAnchor);
        }
    };
    const Quirks = { setup: setup$2 };

    const makeSetupHandler = function(editor, clipboard) {
        return function(api) {
            api.setActive(clipboard.pasteFormat.get() === 'text');
            const pastePlainTextToggleHandler = function(e) {
                return api.setActive(e.state);
            };
            editor.on('PastePlainTextToggle', pastePlainTextToggleHandler);
            return function() {
                return editor.off(
                    'PastePlainTextToggle',
                    pastePlainTextToggleHandler,
                );
            };
        };
    };
    const register$2 = function(editor, clipboard) {
        editor.ui.registry.addToggleButton('pastetext', {
            active: false,
            icon: 'paste-text',
            tooltip: 'Paste as text',
            onAction() {
                return editor.execCommand('mceTogglePlainTextPaste');
            },
            onSetup: makeSetupHandler(editor, clipboard),
        });
        editor.ui.registry.addToggleMenuItem('pastetext', {
            text: 'Paste as text',
            onAction() {
                return editor.execCommand('mceTogglePlainTextPaste');
            },
            onSetup: makeSetupHandler(editor, clipboard),
        });
    };
    const Buttons = { register: register$2 };

    function Plugin() {
        global$1.add('paste', function(editor) {
            if (DetectProPlugin.hasProPlugin(editor) === false) {
                const draggingInternallyState = Cell(false);
                const pasteFormat = Cell(
                    Settings.isPasteAsTextEnabled(editor) ? 'text' : 'html',
                );
                const clipboard = Clipboard(editor, pasteFormat);
                const quirks = Quirks.setup(editor);
                Buttons.register(editor, clipboard);
                Commands.register(editor, clipboard);
                PrePostProcess.setup(editor);
                CutCopy.register(editor);
                DragDrop.setup(editor, clipboard, draggingInternallyState);
                return Api.get(clipboard, quirks);
            }
        });
    }

    Plugin();
})(window);
