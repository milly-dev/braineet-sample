/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 *
 * Version: 5.1.6 (2020-01-28)
 */
(function(domGlobals) {
    var __assign = function() {
        __assign =
            Object.assign ||
            function __assign(t) {
                for (var s, i = 1, n = arguments.length; i < n; i++) {
                    s = arguments[i];
                    for (const p in s)
                        if (Object.prototype.hasOwnProperty.call(s, p))
                            t[p] = s[p];
                }
                return t;
            };
        return __assign.apply(this, arguments);
    };
    function __rest(s, e) {
        const t = {};
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
                t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === 'function')
            for (
                var i = 0, p = Object.getOwnPropertySymbols(s);
                i < p.length;
                i++
            ) {
                if (
                    e.indexOf(p[i]) < 0 &&
                    Object.prototype.propertyIsEnumerable.call(s, p[i])
                )
                    t[p[i]] = s[p[i]];
            }
        return t;
    }
    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++)
            s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (let a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }

    const noop = function() {};
    const compose = function(fa, fb) {
        return function() {
            const args = [];
            for (let _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return fa(fb.apply(null, args));
        };
    };
    const constant = function(value) {
        return function() {
            return value;
        };
    };
    const identity = function(x) {
        return x;
    };
    function curry(fn) {
        const initialArgs = [];
        for (let _i = 1; _i < arguments.length; _i++) {
            initialArgs[_i - 1] = arguments[_i];
        }
        return function() {
            const restArgs = [];
            for (let _i = 0; _i < arguments.length; _i++) {
                restArgs[_i] = arguments[_i];
            }
            const all = initialArgs.concat(restArgs);
            return fn.apply(null, all);
        };
    }
    const not = function(f) {
        return function() {
            const args = [];
            for (let _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return !f.apply(null, args);
        };
    };
    const die = function(msg) {
        return function() {
            throw new Error(msg);
        };
    };
    const apply = function(f) {
        return f();
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

    const { keys } = Object;
    const { hasOwnProperty } = Object;
    const each = function(obj, f) {
        const props = keys(obj);
        for (let k = 0, len = props.length; k < len; k++) {
            const i = props[k];
            const x = obj[i];
            f(x, i);
        }
    };
    const map = function(obj, f) {
        return tupleMap(obj, function(x, i) {
            return {
                k: i,
                v: f(x, i),
            };
        });
    };
    var tupleMap = function(obj, f) {
        const r = {};
        each(obj, function(x, i) {
            const tuple = f(x, i);
            r[tuple.k] = tuple.v;
        });
        return r;
    };
    const mapToArray = function(obj, f) {
        const r = [];
        each(obj, function(value, name) {
            r.push(f(value, name));
        });
        return r;
    };
    const find = function(obj, pred) {
        const props = keys(obj);
        for (let k = 0, len = props.length; k < len; k++) {
            const i = props[k];
            const x = obj[i];
            if (pred(x, i, obj)) {
                return Option.some(x);
            }
        }
        return Option.none();
    };
    const values = function(obj) {
        return mapToArray(obj, function(v) {
            return v;
        });
    };
    const has = function(obj, key) {
        return hasOwnProperty.call(obj, key);
    };

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

    const firstMatch = function(regexes, s) {
        for (let i = 0; i < regexes.length; i++) {
            const x = regexes[i];
            if (x.test(s)) {
                return x;
            }
        }
        return undefined;
    };
    const find$1 = function(regexes, agent) {
        const r = firstMatch(regexes, agent);
        if (!r) {
            return {
                major: 0,
                minor: 0,
            };
        }
        const group = function(i) {
            return Number(agent.replace(r, `$${i}`));
        };
        return nu(group(1), group(2));
    };
    const detect = function(versionRegexes, agent) {
        const cleanedAgent = String(agent).toLowerCase();
        if (versionRegexes.length === 0) {
            return unknown();
        }
        return find$1(versionRegexes, cleanedAgent);
    };
    var unknown = function() {
        return nu(0, 0);
    };
    var nu = function(major, minor) {
        return {
            major,
            minor,
        };
    };
    const Version = {
        nu,
        detect,
        unknown,
    };

    const edge = 'Edge';
    const chrome = 'Chrome';
    const ie = 'IE';
    const opera = 'Opera';
    const firefox = 'Firefox';
    const safari = 'Safari';
    const isBrowser = function(name, current) {
        return function() {
            return current === name;
        };
    };
    const unknown$1 = function() {
        return nu$1({
            current: undefined,
            version: Version.unknown(),
        });
    };
    var nu$1 = function(info) {
        const { current } = info;
        const { version } = info;
        return {
            current,
            version,
            isEdge: isBrowser(edge, current),
            isChrome: isBrowser(chrome, current),
            isIE: isBrowser(ie, current),
            isOpera: isBrowser(opera, current),
            isFirefox: isBrowser(firefox, current),
            isSafari: isBrowser(safari, current),
        };
    };
    const Browser = {
        unknown: unknown$1,
        nu: nu$1,
        edge: constant(edge),
        chrome: constant(chrome),
        ie: constant(ie),
        opera: constant(opera),
        firefox: constant(firefox),
        safari: constant(safari),
    };

    const windows = 'Windows';
    const ios = 'iOS';
    const android = 'Android';
    const linux = 'Linux';
    const osx = 'OSX';
    const solaris = 'Solaris';
    const freebsd = 'FreeBSD';
    const chromeos = 'ChromeOS';
    const isOS = function(name, current) {
        return function() {
            return current === name;
        };
    };
    const unknown$2 = function() {
        return nu$2({
            current: undefined,
            version: Version.unknown(),
        });
    };
    var nu$2 = function(info) {
        const { current } = info;
        const { version } = info;
        return {
            current,
            version,
            isWindows: isOS(windows, current),
            isiOS: isOS(ios, current),
            isAndroid: isOS(android, current),
            isOSX: isOS(osx, current),
            isLinux: isOS(linux, current),
            isSolaris: isOS(solaris, current),
            isFreeBSD: isOS(freebsd, current),
            isChromeOS: isOS(chromeos, current),
        };
    };
    const OperatingSystem = {
        unknown: unknown$2,
        nu: nu$2,
        windows: constant(windows),
        ios: constant(ios),
        android: constant(android),
        linux: constant(linux),
        osx: constant(osx),
        solaris: constant(solaris),
        freebsd: constant(freebsd),
        chromeos: constant(chromeos),
    };

    const DeviceType = function(os, browser, userAgent, mediaMatch) {
        const isiPad = os.isiOS() && /ipad/i.test(userAgent) === true;
        const isiPhone = os.isiOS() && !isiPad;
        const isMobile = os.isiOS() || os.isAndroid();
        const isTouch = isMobile || mediaMatch('(pointer:coarse)');
        const isTablet =
            isiPad ||
            (!isiPhone && isMobile && mediaMatch('(min-device-width:768px)'));
        const isPhone = isiPhone || (isMobile && !isTablet);
        const iOSwebview =
            browser.isSafari() &&
            os.isiOS() &&
            /safari/i.test(userAgent) === false;
        const isDesktop = !isPhone && !isTablet && !iOSwebview;
        return {
            isiPad: constant(isiPad),
            isiPhone: constant(isiPhone),
            isTablet: constant(isTablet),
            isPhone: constant(isPhone),
            isTouch: constant(isTouch),
            isAndroid: os.isAndroid,
            isiOS: os.isiOS,
            isWebView: constant(iOSwebview),
            isDesktop: constant(isDesktop),
        };
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
    const isString = isType('string');
    const isObject = isType('object');
    const isArray = isType('array');
    const isBoolean = isType('boolean');
    const isFunction = isType('function');
    const isNumber = isType('number');

    const nativeSlice = Array.prototype.slice;
    const nativeIndexOf = Array.prototype.indexOf;
    const nativePush = Array.prototype.push;
    const rawIndexOf = function(ts, t) {
        return nativeIndexOf.call(ts, t);
    };
    const contains = function(xs, x) {
        return rawIndexOf(xs, x) > -1;
    };
    const exists = function(xs, pred) {
        for (let i = 0, len = xs.length; i < len; i++) {
            const x = xs[i];
            if (pred(x, i)) {
                return true;
            }
        }
        return false;
    };
    const map$1 = function(xs, f) {
        const len = xs.length;
        const r = new Array(len);
        for (let i = 0; i < len; i++) {
            const x = xs[i];
            r[i] = f(x, i);
        }
        return r;
    };
    const each$1 = function(xs, f) {
        for (let i = 0, len = xs.length; i < len; i++) {
            const x = xs[i];
            f(x, i);
        }
    };
    const eachr = function(xs, f) {
        for (let i = xs.length - 1; i >= 0; i--) {
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
    const foldr = function(xs, f, acc) {
        eachr(xs, function(x) {
            acc = f(acc, x);
        });
        return acc;
    };
    const foldl = function(xs, f, acc) {
        each$1(xs, function(x) {
            acc = f(acc, x);
        });
        return acc;
    };
    const find$2 = function(xs, pred) {
        for (let i = 0, len = xs.length; i < len; i++) {
            const x = xs[i];
            if (pred(x, i)) {
                return Option.some(x);
            }
        }
        return Option.none();
    };
    const findIndex = function(xs, pred) {
        for (let i = 0, len = xs.length; i < len; i++) {
            const x = xs[i];
            if (pred(x, i)) {
                return Option.some(i);
            }
        }
        return Option.none();
    };
    const flatten = function(xs) {
        const r = [];
        for (let i = 0, len = xs.length; i < len; ++i) {
            if (!isArray(xs[i])) {
                throw new Error(
                    `Arr.flatten item ${i} was not an array, input: ${xs}`,
                );
            }
            nativePush.apply(r, xs[i]);
        }
        return r;
    };
    const bind = function(xs, f) {
        const output = map$1(xs, f);
        return flatten(output);
    };
    const forall = function(xs, pred) {
        for (let i = 0, len = xs.length; i < len; ++i) {
            const x = xs[i];
            if (pred(x, i) !== true) {
                return false;
            }
        }
        return true;
    };
    const reverse = function(xs) {
        const r = nativeSlice.call(xs, 0);
        r.reverse();
        return r;
    };
    const difference = function(a1, a2) {
        return filter(a1, function(x) {
            return !contains(a2, x);
        });
    };
    const pure = function(x) {
        return [x];
    };
    const from$1 = isFunction(Array.from)
        ? Array.from
        : function(x) {
              return nativeSlice.call(x);
          };

    const detect$1 = function(candidates, userAgent) {
        const agent = String(userAgent).toLowerCase();
        return find$2(candidates, function(candidate) {
            return candidate.search(agent);
        });
    };
    const detectBrowser = function(browsers, userAgent) {
        return detect$1(browsers, userAgent).map(function(browser) {
            const version = Version.detect(browser.versionRegexes, userAgent);
            return {
                current: browser.name,
                version,
            };
        });
    };
    const detectOs = function(oses, userAgent) {
        return detect$1(oses, userAgent).map(function(os) {
            const version = Version.detect(os.versionRegexes, userAgent);
            return {
                current: os.name,
                version,
            };
        });
    };
    const UaString = {
        detectBrowser,
        detectOs,
    };

    const checkRange = function(str, substr, start) {
        if (substr === '') {
            return true;
        }
        if (str.length < substr.length) {
            return false;
        }
        const x = str.substr(start, start + substr.length);
        return x === substr;
    };
    const supplant = function(str, obj) {
        const isStringOrNumber = function(a) {
            const t = typeof a;
            return t === 'string' || t === 'number';
        };
        return str.replace(/\$\{([^{}]*)\}/g, function(fullMatch, key) {
            const value = obj[key];
            return isStringOrNumber(value) ? value.toString() : fullMatch;
        });
    };
    const contains$1 = function(str, substr) {
        return str.indexOf(substr) !== -1;
    };
    const endsWith = function(str, suffix) {
        return checkRange(str, suffix, str.length - suffix.length);
    };
    const trim = function(str) {
        return str.replace(/^\s+|\s+$/g, '');
    };

    const normalVersionRegex = /.*?version\/\ ?([0-9]+)\.([0-9]+).*/;
    const checkContains = function(target) {
        return function(uastring) {
            return contains$1(uastring, target);
        };
    };
    const browsers = [
        {
            name: 'Edge',
            versionRegexes: [/.*?edge\/ ?([0-9]+)\.([0-9]+)$/],
            search(uastring) {
                return (
                    contains$1(uastring, 'edge/') &&
                    contains$1(uastring, 'chrome') &&
                    contains$1(uastring, 'safari') &&
                    contains$1(uastring, 'applewebkit')
                );
            },
        },
        {
            name: 'Chrome',
            versionRegexes: [
                /.*?chrome\/([0-9]+)\.([0-9]+).*/,
                normalVersionRegex,
            ],
            search(uastring) {
                return (
                    contains$1(uastring, 'chrome') &&
                    !contains$1(uastring, 'chromeframe')
                );
            },
        },
        {
            name: 'IE',
            versionRegexes: [
                /.*?msie\ ?([0-9]+)\.([0-9]+).*/,
                /.*?rv:([0-9]+)\.([0-9]+).*/,
            ],
            search(uastring) {
                return (
                    contains$1(uastring, 'msie') ||
                    contains$1(uastring, 'trident')
                );
            },
        },
        {
            name: 'Opera',
            versionRegexes: [
                normalVersionRegex,
                /.*?opera\/([0-9]+)\.([0-9]+).*/,
            ],
            search: checkContains('opera'),
        },
        {
            name: 'Firefox',
            versionRegexes: [/.*?firefox\/\ ?([0-9]+)\.([0-9]+).*/],
            search: checkContains('firefox'),
        },
        {
            name: 'Safari',
            versionRegexes: [
                normalVersionRegex,
                /.*?cpu os ([0-9]+)_([0-9]+).*/,
            ],
            search(uastring) {
                return (
                    (contains$1(uastring, 'safari') ||
                        contains$1(uastring, 'mobile/')) &&
                    contains$1(uastring, 'applewebkit')
                );
            },
        },
    ];
    const oses = [
        {
            name: 'Windows',
            search: checkContains('win'),
            versionRegexes: [/.*?windows\ nt\ ?([0-9]+)\.([0-9]+).*/],
        },
        {
            name: 'iOS',
            search(uastring) {
                return (
                    contains$1(uastring, 'iphone') ||
                    contains$1(uastring, 'ipad')
                );
            },
            versionRegexes: [
                /.*?version\/\ ?([0-9]+)\.([0-9]+).*/,
                /.*cpu os ([0-9]+)_([0-9]+).*/,
                /.*cpu iphone os ([0-9]+)_([0-9]+).*/,
            ],
        },
        {
            name: 'Android',
            search: checkContains('android'),
            versionRegexes: [/.*?android\ ?([0-9]+)\.([0-9]+).*/],
        },
        {
            name: 'OSX',
            search: checkContains('mac os x'),
            versionRegexes: [/.*?mac\ os\ x\ ?([0-9]+)_([0-9]+).*/],
        },
        {
            name: 'Linux',
            search: checkContains('linux'),
            versionRegexes: [],
        },
        {
            name: 'Solaris',
            search: checkContains('sunos'),
            versionRegexes: [],
        },
        {
            name: 'FreeBSD',
            search: checkContains('freebsd'),
            versionRegexes: [],
        },
        {
            name: 'ChromeOS',
            search: checkContains('cros'),
            versionRegexes: [/.*?chrome\/([0-9]+)\.([0-9]+).*/],
        },
    ];
    const PlatformInfo = {
        browsers: constant(browsers),
        oses: constant(oses),
    };

    const detect$2 = function(userAgent, mediaMatch) {
        const browsers = PlatformInfo.browsers();
        const oses = PlatformInfo.oses();
        const browser = UaString.detectBrowser(browsers, userAgent).fold(
            Browser.unknown,
            Browser.nu,
        );
        const os = UaString.detectOs(oses, userAgent).fold(
            OperatingSystem.unknown,
            OperatingSystem.nu,
        );
        const deviceType = DeviceType(os, browser, userAgent, mediaMatch);
        return {
            browser,
            os,
            deviceType,
        };
    };
    const PlatformDetection = { detect: detect$2 };

    const mediaMatch = function(query) {
        return domGlobals.window.matchMedia(query).matches;
    };
    const platform = Cell(
        PlatformDetection.detect(domGlobals.navigator.userAgent, mediaMatch),
    );
    const detect$3 = function() {
        return platform.get();
    };

    const touchstart = constant('touchstart');
    const touchmove = constant('touchmove');
    const touchend = constant('touchend');
    const mousedown = constant('mousedown');
    const mousemove = constant('mousemove');
    const mouseup = constant('mouseup');
    const mouseover = constant('mouseover');
    const keydown = constant('keydown');
    const keyup = constant('keyup');
    const input = constant('input');
    const change = constant('change');
    const click = constant('click');
    const transitionend = constant('transitionend');
    const selectstart = constant('selectstart');

    const alloy = { tap: constant('alloy.tap') };
    const focus = constant('alloy.focus');
    const postBlur = constant('alloy.blur.post');
    const postPaste = constant('alloy.paste.post');
    const receive = constant('alloy.receive');
    const execute = constant('alloy.execute');
    const focusItem = constant('alloy.focus.item');
    const { tap } = alloy;
    const longpress = constant('alloy.longpress');
    const systemInit = constant('alloy.system.init');
    const attachedToDom = constant('alloy.system.attached');
    const detachedFromDom = constant('alloy.system.detached');
    const focusShifted = constant('alloy.focusmanager.shifted');
    const highlight = constant('alloy.highlight');
    const dehighlight = constant('alloy.dehighlight');

    const emit = function(component, event) {
        dispatchWith(component, component.element(), event, {});
    };
    const emitWith = function(component, event, properties) {
        dispatchWith(component, component.element(), event, properties);
    };
    const emitExecute = function(component) {
        emit(component, execute());
    };
    const dispatch = function(component, target, event) {
        dispatchWith(component, target, event, {});
    };
    var dispatchWith = function(component, target, event, properties) {
        const data = { target, ...properties };
        component.getSystem().triggerEvent(event, target, map(data, constant));
    };
    const dispatchEvent = function(component, target, event, simulatedEvent) {
        component
            .getSystem()
            .triggerEvent(event, target, simulatedEvent.event());
    };
    const dispatchFocus = function(component, target) {
        component.getSystem().triggerFocus(target, component.element());
    };

    const cached = function(f) {
        let called = false;
        let r;
        return function() {
            const args = [];
            for (let _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (!called) {
                called = true;
                r = f.apply(null, args);
            }
            return r;
        };
    };

    const fromHtml = function(html, scope) {
        const doc = scope || domGlobals.document;
        const div = doc.createElement('div');
        div.innerHTML = html;
        if (!div.hasChildNodes() || div.childNodes.length > 1) {
            domGlobals.console.error(
                'HTML does not have a single root node',
                html,
            );
            throw new Error('HTML must have a single root node');
        }
        return fromDom(div.childNodes[0]);
    };
    const fromTag = function(tag, scope) {
        const doc = scope || domGlobals.document;
        const node = doc.createElement(tag);
        return fromDom(node);
    };
    const fromText = function(text, scope) {
        const doc = scope || domGlobals.document;
        const node = doc.createTextNode(text);
        return fromDom(node);
    };
    var fromDom = function(node) {
        if (node === null || node === undefined) {
            throw new Error('Node cannot be null or undefined');
        }
        return { dom: constant(node) };
    };
    const fromPoint = function(docElm, x, y) {
        const doc = docElm.dom();
        return Option.from(doc.elementFromPoint(x, y)).map(fromDom);
    };
    const Element = {
        fromHtml,
        fromTag,
        fromText,
        fromDom,
        fromPoint,
    };

    const ATTRIBUTE = domGlobals.Node.ATTRIBUTE_NODE;
    const CDATA_SECTION = domGlobals.Node.CDATA_SECTION_NODE;
    const COMMENT = domGlobals.Node.COMMENT_NODE;
    const DOCUMENT = domGlobals.Node.DOCUMENT_NODE;
    const DOCUMENT_TYPE = domGlobals.Node.DOCUMENT_TYPE_NODE;
    const DOCUMENT_FRAGMENT = domGlobals.Node.DOCUMENT_FRAGMENT_NODE;
    const ELEMENT = domGlobals.Node.ELEMENT_NODE;
    const TEXT = domGlobals.Node.TEXT_NODE;
    const PROCESSING_INSTRUCTION = domGlobals.Node.PROCESSING_INSTRUCTION_NODE;
    const ENTITY_REFERENCE = domGlobals.Node.ENTITY_REFERENCE_NODE;
    const ENTITY = domGlobals.Node.ENTITY_NODE;
    const NOTATION = domGlobals.Node.NOTATION_NODE;

    const Global =
        typeof domGlobals.window !== 'undefined'
            ? domGlobals.window
            : Function('return this;')();

    const name = function(element) {
        const r = element.dom().nodeName;
        return r.toLowerCase();
    };
    const type = function(element) {
        return element.dom().nodeType;
    };
    const isType$1 = function(t) {
        return function(element) {
            return type(element) === t;
        };
    };
    const isElement = isType$1(ELEMENT);
    const isText = isType$1(TEXT);

    const inBody = function(element) {
        const dom = isText(element) ? element.dom().parentNode : element.dom();
        return (
            dom !== undefined &&
            dom !== null &&
            dom.ownerDocument.body.contains(dom)
        );
    };
    const body = cached(function() {
        return getBody(Element.fromDom(domGlobals.document));
    });
    var getBody = function(doc) {
        const b = doc.dom().body;
        if (b === null || b === undefined) {
            throw new Error('Body is not available yet');
        }
        return Element.fromDom(b);
    };

    const Immutable = function() {
        const fields = [];
        for (let _i = 0; _i < arguments.length; _i++) {
            fields[_i] = arguments[_i];
        }
        return function() {
            const values = [];
            for (let _i = 0; _i < arguments.length; _i++) {
                values[_i] = arguments[_i];
            }
            if (fields.length !== values.length) {
                throw new Error(
                    `Wrong number of arguments to struct. Expected "[${fields.length}]", got ${values.length} arguments`,
                );
            }
            const struct = {};
            each$1(fields, function(name, i) {
                struct[name] = constant(values[i]);
            });
            return struct;
        };
    };

    const sort = function(arr) {
        return arr.slice(0).sort();
    };
    const reqMessage = function(required, keys) {
        throw new Error(
            `All required keys (${sort(required).join(
                ', ',
            )}) were not specified. Specified keys were: ${sort(keys).join(
                ', ',
            )}.`,
        );
    };
    const unsuppMessage = function(unsupported) {
        throw new Error(
            `Unsupported keys for object: ${sort(unsupported).join(', ')}`,
        );
    };
    const validateStrArr = function(label, array) {
        if (!isArray(array)) {
            throw new Error(
                `The ${label} fields must be an array. Was: ${array}.`,
            );
        }
        each$1(array, function(a) {
            if (!isString(a)) {
                throw new Error(
                    `The value ${a} in the ${label} fields was not a string.`,
                );
            }
        });
    };
    const checkDupes = function(everything) {
        const sorted = sort(everything);
        const dupe = find$2(sorted, function(s, i) {
            return i < sorted.length - 1 && s === sorted[i + 1];
        });
        dupe.each(function(d) {
            throw new Error(
                `The field: ${d} occurs more than once in the combined fields: [${sorted.join(
                    ', ',
                )}].`,
            );
        });
    };

    const MixedBag = function(required, optional) {
        const everything = required.concat(optional);
        if (everything.length === 0) {
            throw new Error(
                'You must specify at least one required or optional field.',
            );
        }
        validateStrArr('required', required);
        validateStrArr('optional', optional);
        checkDupes(everything);
        return function(obj) {
            const keys$1 = keys(obj);
            const allReqd = forall(required, function(req) {
                return contains(keys$1, req);
            });
            if (!allReqd) {
                reqMessage(required, keys$1);
            }
            const unsupported = filter(keys$1, function(key) {
                return !contains(everything, key);
            });
            if (unsupported.length > 0) {
                unsuppMessage(unsupported);
            }
            const r = {};
            each$1(required, function(req) {
                r[req] = constant(obj[req]);
            });
            each$1(optional, function(opt) {
                r[opt] = constant(
                    Object.prototype.hasOwnProperty.call(obj, opt)
                        ? Option.some(obj[opt])
                        : Option.none(),
                );
            });
            return r;
        };
    };

    const compareDocumentPosition = function(a, b, match) {
        return (a.compareDocumentPosition(b) & match) !== 0;
    };
    const documentPositionPreceding = function(a, b) {
        return compareDocumentPosition(
            a,
            b,
            domGlobals.Node.DOCUMENT_POSITION_PRECEDING,
        );
    };
    const documentPositionContainedBy = function(a, b) {
        return compareDocumentPosition(
            a,
            b,
            domGlobals.Node.DOCUMENT_POSITION_CONTAINED_BY,
        );
    };
    const Node = {
        documentPositionPreceding,
        documentPositionContainedBy,
    };

    const ELEMENT$1 = ELEMENT;
    const DOCUMENT$1 = DOCUMENT;
    const is = function(element, selector) {
        const dom = element.dom();
        if (dom.nodeType !== ELEMENT$1) {
            return false;
        }
        const elem = dom;
        if (elem.matches !== undefined) {
            return elem.matches(selector);
        }
        if (elem.msMatchesSelector !== undefined) {
            return elem.msMatchesSelector(selector);
        }
        if (elem.webkitMatchesSelector !== undefined) {
            return elem.webkitMatchesSelector(selector);
        }
        if (elem.mozMatchesSelector !== undefined) {
            return elem.mozMatchesSelector(selector);
        }
        throw new Error('Browser lacks native selectors');
    };
    const bypassSelector = function(dom) {
        return (
            (dom.nodeType !== ELEMENT$1 && dom.nodeType !== DOCUMENT$1) ||
            dom.childElementCount === 0
        );
    };
    const all = function(selector, scope) {
        const base = scope === undefined ? domGlobals.document : scope.dom();
        return bypassSelector(base)
            ? []
            : map$1(base.querySelectorAll(selector), Element.fromDom);
    };
    const one = function(selector, scope) {
        const base = scope === undefined ? domGlobals.document : scope.dom();
        return bypassSelector(base)
            ? Option.none()
            : Option.from(base.querySelector(selector)).map(Element.fromDom);
    };

    const eq = function(e1, e2) {
        return e1.dom() === e2.dom();
    };
    const regularContains = function(e1, e2) {
        const d1 = e1.dom();
        const d2 = e2.dom();
        return d1 === d2 ? false : d1.contains(d2);
    };
    const ieContains = function(e1, e2) {
        return Node.documentPositionContainedBy(e1.dom(), e2.dom());
    };
    const { browser } = detect$3();
    const contains$2 = browser.isIE() ? ieContains : regularContains;

    const owner = function(element) {
        return Element.fromDom(element.dom().ownerDocument);
    };
    const defaultView = function(element) {
        return Element.fromDom(element.dom().ownerDocument.defaultView);
    };
    const parent = function(element) {
        return Option.from(element.dom().parentNode).map(Element.fromDom);
    };
    const parents = function(element, isRoot) {
        const stop = isFunction(isRoot) ? isRoot : never;
        let dom = element.dom();
        const ret = [];
        while (dom.parentNode !== null && dom.parentNode !== undefined) {
            const rawParent = dom.parentNode;
            const p = Element.fromDom(rawParent);
            ret.push(p);
            if (stop(p) === true) {
                break;
            } else {
                dom = rawParent;
            }
        }
        return ret;
    };
    const siblings = function(element) {
        const filterSelf = function(elements) {
            return filter(elements, function(x) {
                return !eq(element, x);
            });
        };
        return parent(element)
            .map(children)
            .map(filterSelf)
            .getOr([]);
    };
    const nextSibling = function(element) {
        return Option.from(element.dom().nextSibling).map(Element.fromDom);
    };
    var children = function(element) {
        return map$1(element.dom().childNodes, Element.fromDom);
    };
    const child = function(element, index) {
        const cs = element.dom().childNodes;
        return Option.from(cs[index]).map(Element.fromDom);
    };
    const firstChild = function(element) {
        return child(element, 0);
    };
    const spot = Immutable('element', 'offset');

    const before = function(marker, element) {
        const parent$1 = parent(marker);
        parent$1.each(function(v) {
            v.dom().insertBefore(element.dom(), marker.dom());
        });
    };
    const after = function(marker, element) {
        const sibling = nextSibling(marker);
        sibling.fold(
            function() {
                const parent$1 = parent(marker);
                parent$1.each(function(v) {
                    append(v, element);
                });
            },
            function(v) {
                before(v, element);
            },
        );
    };
    const prepend = function(parent, element) {
        const firstChild$1 = firstChild(parent);
        firstChild$1.fold(
            function() {
                append(parent, element);
            },
            function(v) {
                parent.dom().insertBefore(element.dom(), v.dom());
            },
        );
    };
    var append = function(parent, element) {
        parent.dom().appendChild(element.dom());
    };
    const appendAt = function(parent, element, index) {
        child(parent, index).fold(
            function() {
                append(parent, element);
            },
            function(v) {
                before(v, element);
            },
        );
    };

    const append$1 = function(parent, elements) {
        each$1(elements, function(x) {
            append(parent, x);
        });
    };

    const empty = function(element) {
        element.dom().textContent = '';
        each$1(children(element), function(rogue) {
            remove(rogue);
        });
    };
    var remove = function(element) {
        const dom = element.dom();
        if (dom.parentNode !== null) {
            dom.parentNode.removeChild(dom);
        }
    };

    var fireDetaching = function(component) {
        emit(component, detachedFromDom());
        const children = component.components();
        each$1(children, fireDetaching);
    };
    var fireAttaching = function(component) {
        const children = component.components();
        each$1(children, fireAttaching);
        emit(component, attachedToDom());
    };
    const attach = function(parent, child) {
        append(parent.element(), child.element());
    };
    const detachChildren = function(component) {
        each$1(component.components(), function(childComp) {
            return remove(childComp.element());
        });
        empty(component.element());
        component.syncComponents();
    };
    const replaceChildren = function(component, newChildren) {
        const subs = component.components();
        detachChildren(component);
        const deleted = difference(subs, newChildren);
        each$1(deleted, function(comp) {
            fireDetaching(comp);
            component.getSystem().removeFromWorld(comp);
        });
        each$1(newChildren, function(childComp) {
            if (!childComp.getSystem().isConnected()) {
                component.getSystem().addToWorld(childComp);
                attach(component, childComp);
                if (inBody(component.element())) {
                    fireAttaching(childComp);
                }
            } else {
                attach(component, childComp);
            }
            component.syncComponents();
        });
    };

    const attach$1 = function(parent, child) {
        attachWith(parent, child, append);
    };
    var attachWith = function(parent, child, insertion) {
        parent.getSystem().addToWorld(child);
        insertion(parent.element(), child.element());
        if (inBody(parent.element())) {
            fireAttaching(child);
        }
        parent.syncComponents();
    };
    const doDetach = function(component) {
        fireDetaching(component);
        remove(component.element());
        component.getSystem().removeFromWorld(component);
    };
    const detach = function(component) {
        const parent$1 = parent(component.element()).bind(function(p) {
            return component
                .getSystem()
                .getByDom(p)
                .toOption();
        });
        doDetach(component);
        parent$1.each(function(p) {
            p.syncComponents();
        });
    };
    const attachSystemAfter = function(element, guiSystem) {
        attachSystemWith(element, guiSystem, after);
    };
    var attachSystemWith = function(element, guiSystem, inserter) {
        inserter(element, guiSystem.element());
        const children$1 = children(guiSystem.element());
        each$1(children$1, function(child) {
            guiSystem.getByDom(child).each(fireAttaching);
        });
    };
    const detachSystem = function(guiSystem) {
        const children$1 = children(guiSystem.element());
        each$1(children$1, function(child) {
            guiSystem.getByDom(child).each(fireDetaching);
        });
        remove(guiSystem.element());
    };

    var value = function(o) {
        const is = function(v) {
            return o === v;
        };
        const or = function(opt) {
            return value(o);
        };
        const orThunk = function(f) {
            return value(o);
        };
        const map = function(f) {
            return value(f(o));
        };
        const mapError = function(f) {
            return value(o);
        };
        const each = function(f) {
            f(o);
        };
        const bind = function(f) {
            return f(o);
        };
        const fold = function(_, onValue) {
            return onValue(o);
        };
        const exists = function(f) {
            return f(o);
        };
        const forall = function(f) {
            return f(o);
        };
        const toOption = function() {
            return Option.some(o);
        };
        return {
            is,
            isValue: always,
            isError: never,
            getOr: constant(o),
            getOrThunk: constant(o),
            getOrDie: constant(o),
            or,
            orThunk,
            fold,
            map,
            mapError,
            each,
            bind,
            exists,
            forall,
            toOption,
        };
    };
    var error = function(message) {
        const getOrThunk = function(f) {
            return f();
        };
        const getOrDie = function() {
            return die(String(message))();
        };
        const or = function(opt) {
            return opt;
        };
        const orThunk = function(f) {
            return f();
        };
        const map = function(f) {
            return error(message);
        };
        const mapError = function(f) {
            return error(f(message));
        };
        const bind = function(f) {
            return error(message);
        };
        const fold = function(onError, _) {
            return onError(message);
        };
        return {
            is: never,
            isValue: never,
            isError: always,
            getOr: identity,
            getOrThunk,
            getOrDie,
            or,
            orThunk,
            fold,
            map,
            mapError,
            each: noop,
            bind,
            exists: never,
            forall: always,
            toOption: Option.none,
        };
    };
    const fromOption = function(opt, err) {
        return opt.fold(function() {
            return error(err);
        }, value);
    };
    const Result = {
        value,
        error,
        fromOption,
    };

    const generate = function(cases) {
        if (!isArray(cases)) {
            throw new Error('cases must be an array');
        }
        if (cases.length === 0) {
            throw new Error('there must be at least one case');
        }
        const constructors = [];
        const adt = {};
        each$1(cases, function(acase, count) {
            const keys$1 = keys(acase);
            if (keys$1.length !== 1) {
                throw new Error('one and only one name per case');
            }
            const key = keys$1[0];
            const value = acase[key];
            if (adt[key] !== undefined) {
                throw new Error(`duplicate key detected:${key}`);
            } else if (key === 'cata') {
                throw new Error('cannot have a case named cata (sorry)');
            } else if (!isArray(value)) {
                throw new Error('case arguments must be an array');
            }
            constructors.push(key);
            adt[key] = function() {
                const argLength = arguments.length;
                if (argLength !== value.length) {
                    throw new Error(
                        `Wrong number of arguments to case ${key}. Expected ${value.length} (${value}), got ${argLength}`,
                    );
                }
                const args = new Array(argLength);
                for (let i = 0; i < args.length; i++) {
                    args[i] = arguments[i];
                }
                const match = function(branches) {
                    const branchKeys = keys(branches);
                    if (constructors.length !== branchKeys.length) {
                        throw new Error(
                            `Wrong number of arguments to match. Expected: ${constructors.join(
                                ',',
                            )}\nActual: ${branchKeys.join(',')}`,
                        );
                    }
                    const allReqd = forall(constructors, function(reqKey) {
                        return contains(branchKeys, reqKey);
                    });
                    if (!allReqd) {
                        throw new Error(
                            `Not all branches were specified when using match. Specified: ${branchKeys.join(
                                ', ',
                            )}\nRequired: ${constructors.join(', ')}`,
                        );
                    }
                    return branches[key].apply(null, args);
                };
                return {
                    fold() {
                        if (arguments.length !== cases.length) {
                            throw new Error(
                                `Wrong number of arguments to fold. Expected ${cases.length}, got ${arguments.length}`,
                            );
                        }
                        const target = arguments[count];
                        return target.apply(null, args);
                    },
                    match,
                    log(label) {
                        domGlobals.console.log(label, {
                            constructors,
                            constructor: key,
                            params: args,
                        });
                    },
                };
            };
        });
        return adt;
    };
    const Adt = { generate };

    const hasOwnProperty$1 = Object.prototype.hasOwnProperty;
    const shallow = function(old, nu) {
        return nu;
    };
    const deep = function(old, nu) {
        const bothObjects = isObject(old) && isObject(nu);
        return bothObjects ? deepMerge(old, nu) : nu;
    };
    const baseMerge = function(merger) {
        return function() {
            const objects = new Array(arguments.length);
            for (let i = 0; i < objects.length; i++) {
                objects[i] = arguments[i];
            }
            if (objects.length === 0) {
                throw new Error("Can't merge zero objects");
            }
            const ret = {};
            for (let j = 0; j < objects.length; j++) {
                const curObject = objects[j];
                for (const key in curObject) {
                    if (hasOwnProperty$1.call(curObject, key)) {
                        ret[key] = merger(ret[key], curObject[key]);
                    }
                }
            }
            return ret;
        };
    };
    var deepMerge = baseMerge(deep);
    const merge = baseMerge(shallow);

    const adt = Adt.generate([
        { strict: [] },
        { defaultedThunk: ['fallbackThunk'] },
        { asOption: [] },
        { asDefaultedOptionThunk: ['fallbackThunk'] },
        { mergeWithThunk: ['baseThunk'] },
    ]);
    const defaulted = function(fallback) {
        return adt.defaultedThunk(constant(fallback));
    };
    const mergeWith = function(base) {
        return adt.mergeWithThunk(constant(base));
    };
    const { strict } = adt;
    const { asOption } = adt;
    const { defaultedThunk } = adt;
    const { mergeWithThunk } = adt;

    const exclude = function(obj, fields) {
        const r = {};
        each(obj, function(v, k) {
            if (!contains(fields, k)) {
                r[k] = v;
            }
        });
        return r;
    };

    const readOpt = function(key) {
        return function(obj) {
            return has(obj, key) ? Option.from(obj[key]) : Option.none();
        };
    };
    const readOr = function(key, fallback) {
        return function(obj) {
            return has(obj, key) ? obj[key] : fallback;
        };
    };
    const readOptFrom = function(obj, key) {
        return readOpt(key)(obj);
    };
    const hasKey = function(obj, key) {
        return has(obj, key) && obj[key] !== undefined && obj[key] !== null;
    };

    const wrap = function(key, value) {
        const r = {};
        r[key] = value;
        return r;
    };
    const wrapAll = function(keyvalues) {
        const r = {};
        each$1(keyvalues, function(kv) {
            r[kv.key] = kv.value;
        });
        return r;
    };

    const comparison = Adt.generate([
        {
            bothErrors: ['error1', 'error2'],
        },
        {
            firstError: ['error1', 'value2'],
        },
        {
            secondError: ['value1', 'error2'],
        },
        {
            bothValues: ['value1', 'value2'],
        },
    ]);
    const partition = function(results) {
        const errors = [];
        const values = [];
        each$1(results, function(result) {
            result.fold(
                function(err) {
                    errors.push(err);
                },
                function(value) {
                    values.push(value);
                },
            );
        });
        return {
            errors,
            values,
        };
    };

    const exclude$1 = function(obj, fields) {
        return exclude(obj, fields);
    };
    const readOpt$1 = function(key) {
        return readOpt(key);
    };
    const readOr$1 = function(key, fallback) {
        return readOr(key, fallback);
    };
    const readOptFrom$1 = function(obj, key) {
        return readOptFrom(obj, key);
    };
    const wrap$1 = function(key, value) {
        return wrap(key, value);
    };
    const wrapAll$1 = function(keyvalues) {
        return wrapAll(keyvalues);
    };
    const mergeValues = function(values, base) {
        return values.length === 0
            ? Result.value(base)
            : Result.value(deepMerge(base, merge.apply(undefined, values)));
    };
    const mergeErrors = function(errors) {
        return Result.error(flatten(errors));
    };
    const consolidate = function(objs, base) {
        const partitions = partition(objs);
        return partitions.errors.length > 0
            ? mergeErrors(partitions.errors)
            : mergeValues(partitions.values, base);
    };
    const hasKey$1 = function(obj, key) {
        return hasKey(obj, key);
    };

    let SimpleResultType;
    (function(SimpleResultType) {
        SimpleResultType[(SimpleResultType.Error = 0)] = 'Error';
        SimpleResultType[(SimpleResultType.Value = 1)] = 'Value';
    })(SimpleResultType || (SimpleResultType = {}));
    const fold = function(res, onError, onValue) {
        return res.stype === SimpleResultType.Error
            ? onError(res.serror)
            : onValue(res.svalue);
    };
    const partition$1 = function(results) {
        const values = [];
        const errors = [];
        each$1(results, function(obj) {
            fold(
                obj,
                function(err) {
                    return errors.push(err);
                },
                function(val) {
                    return values.push(val);
                },
            );
        });
        return {
            values,
            errors,
        };
    };
    const mapError = function(res, f) {
        if (res.stype === SimpleResultType.Error) {
            return {
                stype: SimpleResultType.Error,
                serror: f(res.serror),
            };
        }
        return res;
    };
    const map$2 = function(res, f) {
        if (res.stype === SimpleResultType.Value) {
            return {
                stype: SimpleResultType.Value,
                svalue: f(res.svalue),
            };
        }
        return res;
    };
    const bind$1 = function(res, f) {
        if (res.stype === SimpleResultType.Value) {
            return f(res.svalue);
        }
        return res;
    };
    const bindError = function(res, f) {
        if (res.stype === SimpleResultType.Error) {
            return f(res.serror);
        }
        return res;
    };
    const svalue = function(v) {
        return {
            stype: SimpleResultType.Value,
            svalue: v,
        };
    };
    const serror = function(e) {
        return {
            stype: SimpleResultType.Error,
            serror: e,
        };
    };
    const toResult = function(res) {
        return fold(res, Result.error, Result.value);
    };
    const fromResult = function(res) {
        return res.fold(serror, svalue);
    };
    const SimpleResult = {
        fromResult,
        toResult,
        svalue,
        partition: partition$1,
        serror,
        bind: bind$1,
        bindError,
        map: map$2,
        mapError,
        fold,
    };

    const mergeValues$1 = function(values, base) {
        return values.length > 0
            ? SimpleResult.svalue(
                  deepMerge(base, merge.apply(undefined, values)),
              )
            : SimpleResult.svalue(base);
    };
    const mergeErrors$1 = function(errors) {
        return compose(SimpleResult.serror, flatten)(errors);
    };
    const consolidateObj = function(objects, base) {
        const partition = SimpleResult.partition(objects);
        return partition.errors.length > 0
            ? mergeErrors$1(partition.errors)
            : mergeValues$1(partition.values, base);
    };
    const consolidateArr = function(objects) {
        const partitions = SimpleResult.partition(objects);
        return partitions.errors.length > 0
            ? mergeErrors$1(partitions.errors)
            : SimpleResult.svalue(partitions.values);
    };
    const ResultCombine = {
        consolidateObj,
        consolidateArr,
    };

    const typeAdt = Adt.generate([
        {
            setOf: ['validator', 'valueType'],
        },
        { arrOf: ['valueType'] },
        { objOf: ['fields'] },
        { itemOf: ['validator'] },
        {
            choiceOf: ['key', 'branches'],
        },
        { thunk: ['description'] },
        {
            func: ['args', 'outputSchema'],
        },
    ]);
    const fieldAdt = Adt.generate([
        {
            field: ['name', 'presence', 'type'],
        },
        { state: ['name'] },
    ]);

    const formatObj = function(input) {
        return isObject(input) && keys(input).length > 100
            ? ' removed due to size'
            : JSON.stringify(input, null, 2);
    };
    const formatErrors = function(errors) {
        const es =
            errors.length > 10
                ? errors.slice(0, 10).concat([
                      {
                          path: [],
                          getErrorInfo() {
                              return '... (only showing first ten failures)';
                          },
                      },
                  ])
                : errors;
        return map$1(es, function(e) {
            return `Failed path: (${e.path.join(' > ')})\n${e.getErrorInfo()}`;
        });
    };

    const nu$3 = function(path, getErrorInfo) {
        return SimpleResult.serror([
            {
                path,
                getErrorInfo,
            },
        ]);
    };
    const missingStrict = function(path, key, obj) {
        return nu$3(path, function() {
            return `Could not find valid *strict* value for "${key}" in ${formatObj(obj)}`;
        });
    };
    const missingKey = function(path, key) {
        return nu$3(path, function() {
            return `Choice schema did not contain choice key: "${key}"`;
        });
    };
    const missingBranch = function(path, branches, branch) {
        return nu$3(path, function() {
            return `The chosen schema: "${branch}" did not exist in branches: ${formatObj(branches)}`;
        });
    };
    const unsupportedFields = function(path, unsupported) {
        return nu$3(path, function() {
            return `There are unsupported fields: [${unsupported.join(
                ', ',
            )}] specified`;
        });
    };
    const custom = function(path, err) {
        return nu$3(path, function() {
            return err;
        });
    };

    const adt$1 = Adt.generate([
        {
            field: ['key', 'okey', 'presence', 'prop'],
        },
        {
            state: ['okey', 'instantiator'],
        },
    ]);
    const strictAccess = function(path, obj, key) {
        return readOptFrom(obj, key).fold(function() {
            return missingStrict(path, key, obj);
        }, SimpleResult.svalue);
    };
    const fallbackAccess = function(obj, key, fallbackThunk) {
        const v = readOptFrom(obj, key).fold(function() {
            return fallbackThunk(obj);
        }, identity);
        return SimpleResult.svalue(v);
    };
    const optionAccess = function(obj, key) {
        return SimpleResult.svalue(readOptFrom(obj, key));
    };
    const optionDefaultedAccess = function(obj, key, fallback) {
        const opt = readOptFrom(obj, key).map(function(val) {
            return val === true ? fallback(obj) : val;
        });
        return SimpleResult.svalue(opt);
    };
    const cExtractOne = function(path, obj, field, strength) {
        return field.fold(
            function(key, okey, presence, prop) {
                const bundle = function(av) {
                    const result = prop.extract(
                        path.concat([key]),
                        strength,
                        av,
                    );
                    return SimpleResult.map(result, function(res) {
                        return wrap(okey, strength(res));
                    });
                };
                const bundleAsOption = function(optValue) {
                    return optValue.fold(
                        function() {
                            const outcome = wrap(okey, strength(Option.none()));
                            return SimpleResult.svalue(outcome);
                        },
                        function(ov) {
                            const result = prop.extract(
                                path.concat([key]),
                                strength,
                                ov,
                            );
                            return SimpleResult.map(result, function(res) {
                                return wrap(okey, strength(Option.some(res)));
                            });
                        },
                    );
                };
                return (function() {
                    return presence.fold(
                        function() {
                            return SimpleResult.bind(
                                strictAccess(path, obj, key),
                                bundle,
                            );
                        },
                        function(fallbackThunk) {
                            return SimpleResult.bind(
                                fallbackAccess(obj, key, fallbackThunk),
                                bundle,
                            );
                        },
                        function() {
                            return SimpleResult.bind(
                                optionAccess(obj, key),
                                bundleAsOption,
                            );
                        },
                        function(fallbackThunk) {
                            return SimpleResult.bind(
                                optionDefaultedAccess(obj, key, fallbackThunk),
                                bundleAsOption,
                            );
                        },
                        function(baseThunk) {
                            const base = baseThunk(obj);
                            const result = SimpleResult.map(
                                fallbackAccess(obj, key, constant({})),
                                function(v) {
                                    return deepMerge(base, v);
                                },
                            );
                            return SimpleResult.bind(result, bundle);
                        },
                    );
                })();
            },
            function(okey, instantiator) {
                const state = instantiator(obj);
                return SimpleResult.svalue(wrap(okey, strength(state)));
            },
        );
    };
    const cExtract = function(path, obj, fields, strength) {
        const results = map$1(fields, function(field) {
            return cExtractOne(path, obj, field, strength);
        });
        return ResultCombine.consolidateObj(results, {});
    };
    const value$1 = function(validator) {
        const extract = function(path, strength, val) {
            return SimpleResult.bindError(validator(val, strength), function(
                err,
            ) {
                return custom(path, err);
            });
        };
        const toString = function() {
            return 'val';
        };
        const toDsl = function() {
            return typeAdt.itemOf(validator);
        };
        return {
            extract,
            toString,
            toDsl,
        };
    };
    const getSetKeys = function(obj) {
        const keys$1 = keys(obj);
        return filter(keys$1, function(k) {
            return hasKey$1(obj, k);
        });
    };
    const objOfOnly = function(fields) {
        const delegate = objOf(fields);
        const fieldNames = foldr(
            fields,
            function(acc, f) {
                return f.fold(function(key) {
                    return deepMerge(acc, wrap$1(key, true));
                }, constant(acc));
            },
            {},
        );
        const extract = function(path, strength, o) {
            const keys = isBoolean(o) ? [] : getSetKeys(o);
            const extra = filter(keys, function(k) {
                return !hasKey$1(fieldNames, k);
            });
            return extra.length === 0
                ? delegate.extract(path, strength, o)
                : unsupportedFields(path, extra);
        };
        return {
            extract,
            toString: delegate.toString,
            toDsl: delegate.toDsl,
        };
    };
    var objOf = function(fields) {
        const extract = function(path, strength, o) {
            return cExtract(path, o, fields, strength);
        };
        const toString = function() {
            const fieldStrings = map$1(fields, function(field) {
                return field.fold(
                    function(key, okey, presence, prop) {
                        return `${key} -> ${prop.toString()}`;
                    },
                    function(okey, instantiator) {
                        return `state(${okey})`;
                    },
                );
            });
            return `obj{\n${fieldStrings.join('\n')}}`;
        };
        const toDsl = function() {
            return typeAdt.objOf(
                map$1(fields, function(f) {
                    return f.fold(
                        function(key, okey, presence, prop) {
                            return fieldAdt.field(key, presence, prop);
                        },
                        function(okey, instantiator) {
                            return fieldAdt.state(okey);
                        },
                    );
                }),
            );
        };
        return {
            extract,
            toString,
            toDsl,
        };
    };
    const arrOf = function(prop) {
        const extract = function(path, strength, array) {
            const results = map$1(array, function(a, i) {
                return prop.extract(path.concat([`[${i}]`]), strength, a);
            });
            return ResultCombine.consolidateArr(results);
        };
        const toString = function() {
            return `array(${prop.toString()})`;
        };
        const toDsl = function() {
            return typeAdt.arrOf(prop);
        };
        return {
            extract,
            toString,
            toDsl,
        };
    };
    const setOf = function(validator, prop) {
        const validateKeys = function(path, keys) {
            return arrOf(value$1(validator)).extract(path, identity, keys);
        };
        const extract = function(path, strength, o) {
            const keys$1 = keys(o);
            const validatedKeys = validateKeys(path, keys$1);
            return SimpleResult.bind(validatedKeys, function(validKeys) {
                const schema = map$1(validKeys, function(vk) {
                    return adt$1.field(vk, vk, strict(), prop);
                });
                return objOf(schema).extract(path, strength, o);
            });
        };
        const toString = function() {
            return `setOf(${prop.toString()})`;
        };
        const toDsl = function() {
            return typeAdt.setOf(validator, prop);
        };
        return {
            extract,
            toString,
            toDsl,
        };
    };
    const anyValue = constant(value$1(SimpleResult.svalue));
    const { state } = adt$1;
    const { field } = adt$1;

    const chooseFrom = function(path, strength, input, branches, ch) {
        const fields = readOptFrom$1(branches, ch);
        return fields.fold(
            function() {
                return missingBranch(path, branches, ch);
            },
            function(vp) {
                return vp.extract(
                    path.concat([`branch: ${ch}`]),
                    strength,
                    input,
                );
            },
        );
    };
    const choose = function(key, branches) {
        const extract = function(path, strength, input) {
            const choice = readOptFrom$1(input, key);
            return choice.fold(
                function() {
                    return missingKey(path, key);
                },
                function(chosen) {
                    return chooseFrom(path, strength, input, branches, chosen);
                },
            );
        };
        const toString = function() {
            return `chooseOn(${key}). Possible values: ${keys(branches)}`;
        };
        const toDsl = function() {
            return typeAdt.choiceOf(key, branches);
        };
        return {
            extract,
            toString,
            toDsl,
        };
    };

    const _anyValue = value$1(SimpleResult.svalue);
    const valueOf = function(validator) {
        return value$1(function(v) {
            return validator(v).fold(SimpleResult.serror, SimpleResult.svalue);
        });
    };
    const setOf$1 = function(validator, prop) {
        return setOf(function(v) {
            return SimpleResult.fromResult(validator(v));
        }, prop);
    };
    const extract = function(label, prop, strength, obj) {
        const res = prop.extract([label], strength, obj);
        return SimpleResult.mapError(res, function(errs) {
            return {
                input: obj,
                errors: errs,
            };
        });
    };
    const asRaw = function(label, prop, obj) {
        return SimpleResult.toResult(extract(label, prop, identity, obj));
    };
    const getOrDie = function(extraction) {
        return extraction.fold(function(errInfo) {
            throw new Error(formatError(errInfo));
        }, identity);
    };
    const asRawOrDie = function(label, prop, obj) {
        return getOrDie(asRaw(label, prop, obj));
    };
    var formatError = function(errInfo) {
        return `Errors: \n${formatErrors(
            errInfo.errors,
        )}\n\nInput object: ${formatObj(errInfo.input)}`;
    };
    const choose$1 = function(key, branches) {
        return choose(key, map(branches, objOf));
    };
    const anyValue$1 = constant(_anyValue);
    const typedValue = function(validator, expectedType) {
        return value$1(function(a) {
            const actualType = typeof a;
            return validator(a)
                ? SimpleResult.svalue(a)
                : SimpleResult.serror(
                      `Expected type: ${expectedType} but got: ${actualType}`,
                  );
        });
    };
    const functionProcessor = typedValue(isFunction, 'function');

    const strict$1 = function(key) {
        return field(key, key, strict(), anyValue());
    };
    const strictOf = function(key, schema) {
        return field(key, key, strict(), schema);
    };
    const strictFunction = function(key) {
        return strictOf(key, functionProcessor);
    };
    const forbid = function(key, message) {
        return field(
            key,
            key,
            asOption(),
            value$1(function(v) {
                return SimpleResult.serror(
                    `The field: ${key} is forbidden. ${message}`,
                );
            }),
        );
    };
    const strictObjOf = function(key, objSchema) {
        return field(key, key, strict(), objOf(objSchema));
    };
    const option = function(key) {
        return field(key, key, asOption(), anyValue());
    };
    const optionOf = function(key, schema) {
        return field(key, key, asOption(), schema);
    };
    const optionObjOf = function(key, objSchema) {
        return optionOf(key, objOf(objSchema));
    };
    const optionObjOfOnly = function(key, objSchema) {
        return optionOf(key, objOfOnly(objSchema));
    };
    const defaulted$1 = function(key, fallback) {
        return field(key, key, defaulted(fallback), anyValue());
    };
    const defaultedOf = function(key, fallback, schema) {
        return field(key, key, defaulted(fallback), schema);
    };
    const defaultedObjOf = function(key, fallback, objSchema) {
        return defaultedOf(key, fallback, objOf(objSchema));
    };
    const state$1 = function(okey, instantiator) {
        return state(okey, instantiator);
    };

    const isSource = function(component, simulatedEvent) {
        return eq(component.element(), simulatedEvent.event().target());
    };

    function ClosestOrAncestor(is, ancestor, scope, a, isRoot) {
        return is(scope, a)
            ? Option.some(scope)
            : isFunction(isRoot) && isRoot(scope)
            ? Option.none()
            : ancestor(scope, a, isRoot);
    }

    const ancestor = function(scope, predicate, isRoot) {
        let element = scope.dom();
        const stop = isFunction(isRoot) ? isRoot : constant(false);
        while (element.parentNode) {
            element = element.parentNode;
            const el = Element.fromDom(element);
            if (predicate(el)) {
                return Option.some(el);
            }
            if (stop(el)) {
                break;
            }
        }
        return Option.none();
    };
    const closest = function(scope, predicate, isRoot) {
        const is = function(s, test) {
            return test(s);
        };
        return ClosestOrAncestor(is, ancestor, scope, predicate, isRoot);
    };
    const descendant = function(scope, predicate) {
        var descend = function(node) {
            for (let i = 0; i < node.childNodes.length; i++) {
                const child_1 = Element.fromDom(node.childNodes[i]);
                if (predicate(child_1)) {
                    return Option.some(child_1);
                }
                const res = descend(node.childNodes[i]);
                if (res.isSome()) {
                    return res;
                }
            }
            return Option.none();
        };
        return descend(scope.dom());
    };

    const closest$1 = function(target, transform, isRoot) {
        const delegate = closest(
            target,
            function(elem) {
                return transform(elem).isSome();
            },
            isRoot,
        );
        return delegate.bind(transform);
    };

    const nu$4 = function(parts) {
        if (
            !hasKey$1(parts, 'can') &&
            !hasKey$1(parts, 'abort') &&
            !hasKey$1(parts, 'run')
        ) {
            throw new Error(
                `EventHandler defined by: ${JSON.stringify(
                    parts,
                    null,
                    2,
                )} does not have can, abort, or run!`,
            );
        }
        return asRawOrDie(
            'Extracting event.handler',
            objOfOnly([
                defaulted$1('can', constant(true)),
                defaulted$1('abort', constant(false)),
                defaulted$1('run', noop),
            ]),
            parts,
        );
    };
    const all$1 = function(handlers, f) {
        return function() {
            const args = [];
            for (let _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return foldl(
                handlers,
                function(acc, handler) {
                    return acc && f(handler).apply(undefined, args);
                },
                true,
            );
        };
    };
    const any = function(handlers, f) {
        return function() {
            const args = [];
            for (let _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return foldl(
                handlers,
                function(acc, handler) {
                    return acc || f(handler).apply(undefined, args);
                },
                false,
            );
        };
    };
    const read = function(handler) {
        return isFunction(handler)
            ? {
                  can: constant(true),
                  abort: constant(false),
                  run: handler,
              }
            : handler;
    };
    const fuse = function(handlers) {
        const can = all$1(handlers, function(handler) {
            return handler.can;
        });
        const abort = any(handlers, function(handler) {
            return handler.abort;
        });
        const run = function() {
            const args = [];
            for (let _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            each$1(handlers, function(handler) {
                handler.run.apply(undefined, args);
            });
        };
        return nu$4({
            can,
            abort,
            run,
        });
    };

    const derive = function(configs) {
        return wrapAll$1(configs);
    };
    const abort = function(name, predicate) {
        return {
            key: name,
            value: nu$4({ abort: predicate }),
        };
    };
    const can = function(name, predicate) {
        return {
            key: name,
            value: nu$4({ can: predicate }),
        };
    };
    const run = function(name, handler) {
        return {
            key: name,
            value: nu$4({ run: handler }),
        };
    };
    const runActionExtra = function(name, action, extra) {
        return {
            key: name,
            value: nu$4({
                run(component, simulatedEvent) {
                    action.apply(
                        undefined,
                        [component, simulatedEvent].concat(extra),
                    );
                },
            }),
        };
    };
    const runOnName = function(name) {
        return function(handler) {
            return run(name, handler);
        };
    };
    const runOnSourceName = function(name) {
        return function(handler) {
            return {
                key: name,
                value: nu$4({
                    run(component, simulatedEvent) {
                        if (isSource(component, simulatedEvent)) {
                            handler(component, simulatedEvent);
                        }
                    },
                }),
            };
        };
    };
    const redirectToUid = function(name, uid) {
        return run(name, function(component, simulatedEvent) {
            component
                .getSystem()
                .getByUid(uid)
                .each(function(redirectee) {
                    dispatchEvent(
                        redirectee,
                        redirectee.element(),
                        name,
                        simulatedEvent,
                    );
                });
        });
    };
    const redirectToPart = function(name, detail, partName) {
        const uid = detail.partUids[partName];
        return redirectToUid(name, uid);
    };
    const cutter = function(name) {
        return run(name, function(component, simulatedEvent) {
            simulatedEvent.cut();
        });
    };
    const stopper = function(name) {
        return run(name, function(component, simulatedEvent) {
            simulatedEvent.stop();
        });
    };
    const runOnSource = function(name, f) {
        return runOnSourceName(name)(f);
    };
    const runOnAttached = runOnSourceName(attachedToDom());
    const runOnDetached = runOnSourceName(detachedFromDom());
    const runOnInit = runOnSourceName(systemInit());
    const runOnExecute = runOnName(execute());

    const markAsBehaviourApi = function(f, apiName, apiFunction) {
        const delegate = apiFunction.toString();
        const endIndex = delegate.indexOf(')') + 1;
        const openBracketIndex = delegate.indexOf('(');
        const parameters = delegate
            .substring(openBracketIndex + 1, endIndex - 1)
            .split(/,\s*/);
        f.toFunctionAnnotation = function() {
            return {
                name: apiName,
                parameters: cleanParameters(
                    parameters.slice(0, 1).concat(parameters.slice(3)),
                ),
            };
        };
        return f;
    };
    var cleanParameters = function(parameters) {
        return map$1(parameters, function(p) {
            return endsWith(p, '/*')
                ? p.substring(0, p.length - '/*'.length)
                : p;
        });
    };
    const markAsExtraApi = function(f, extraName) {
        const delegate = f.toString();
        const endIndex = delegate.indexOf(')') + 1;
        const openBracketIndex = delegate.indexOf('(');
        const parameters = delegate
            .substring(openBracketIndex + 1, endIndex - 1)
            .split(/,\s*/);
        f.toFunctionAnnotation = function() {
            return {
                name: extraName,
                parameters: cleanParameters(parameters),
            };
        };
        return f;
    };
    const markAsSketchApi = function(f, apiFunction) {
        const delegate = apiFunction.toString();
        const endIndex = delegate.indexOf(')') + 1;
        const openBracketIndex = delegate.indexOf('(');
        const parameters = delegate
            .substring(openBracketIndex + 1, endIndex - 1)
            .split(/,\s*/);
        f.toFunctionAnnotation = function() {
            return {
                name: 'OVERRIDE',
                parameters: cleanParameters(parameters.slice(1)),
            };
        };
        return f;
    };

    const nu$5 = function(s) {
        return {
            classes: s.classes !== undefined ? s.classes : [],
            attributes: s.attributes !== undefined ? s.attributes : {},
            styles: s.styles !== undefined ? s.styles : {},
        };
    };
    const merge$1 = function(defnA, mod) {
        return {
            ...defnA,
            attributes: { ...defnA.attributes, ...mod.attributes },
            styles: { ...defnA.styles, ...mod.styles },
            classes: defnA.classes.concat(mod.classes),
        };
    };

    const executeEvent = function(bConfig, bState, executor) {
        return runOnExecute(function(component) {
            executor(component, bConfig, bState);
        });
    };
    const loadEvent = function(bConfig, bState, f) {
        return runOnInit(function(component, simulatedEvent) {
            f(component, bConfig, bState);
        });
    };
    const create = function(schema, name, active, apis, extra, state) {
        const configSchema = objOfOnly(schema);
        const schemaSchema = optionObjOf(name, [
            optionObjOfOnly('config', schema),
        ]);
        return doCreate(
            configSchema,
            schemaSchema,
            name,
            active,
            apis,
            extra,
            state,
        );
    };
    const createModes = function(modes, name, active, apis, extra, state) {
        const configSchema = modes;
        const schemaSchema = optionObjOf(name, [optionOf('config', modes)]);
        return doCreate(
            configSchema,
            schemaSchema,
            name,
            active,
            apis,
            extra,
            state,
        );
    };
    const wrapApi = function(bName, apiFunction, apiName) {
        const f = function(component) {
            const rest = [];
            for (let _i = 1; _i < arguments.length; _i++) {
                rest[_i - 1] = arguments[_i];
            }
            const args = [component].concat(rest);
            return component.config({ name: constant(bName) }).fold(
                function() {
                    throw new Error(
                        `We could not find any behaviour configuration for: ${bName}. Using API: ${apiName}`,
                    );
                },
                function(info) {
                    const rest = Array.prototype.slice.call(args, 1);
                    return apiFunction.apply(
                        undefined,
                        [component, info.config, info.state].concat(rest),
                    );
                },
            );
        };
        return markAsBehaviourApi(f, apiName, apiFunction);
    };
    const revokeBehaviour = function(name) {
        return {
            key: name,
            value: undefined,
        };
    };
    var doCreate = function(
        configSchema,
        schemaSchema,
        name,
        active,
        apis,
        extra,
        state,
    ) {
        const getConfig = function(info) {
            return hasKey$1(info, name) ? info[name]() : Option.none();
        };
        const wrappedApis = map(apis, function(apiF, apiName) {
            return wrapApi(name, apiF, apiName);
        });
        const wrappedExtra = map(extra, function(extraF, extraName) {
            return markAsExtraApi(extraF, extraName);
        });
        var me = {
            ...wrappedExtra,
            ...wrappedApis,
            revoke: curry(revokeBehaviour, name),
            config(spec) {
                const prepared = asRawOrDie(
                    `${name}-config`,
                    configSchema,
                    spec,
                );
                return {
                    key: name,
                    value: {
                        config: prepared,
                        me,
                        configAsRaw: cached(function() {
                            return asRawOrDie(
                                `${name}-config`,
                                configSchema,
                                spec,
                            );
                        }),
                        initialConfig: spec,
                        state,
                    },
                };
            },
            schema() {
                return schemaSchema;
            },
            exhibit(info, base) {
                return getConfig(info)
                    .bind(function(behaviourInfo) {
                        return readOptFrom$1(active, 'exhibit').map(function(
                            exhibitor,
                        ) {
                            return exhibitor(
                                base,
                                behaviourInfo.config,
                                behaviourInfo.state,
                            );
                        });
                    })
                    .getOr(nu$5({}));
            },
            name() {
                return name;
            },
            handlers(info) {
                return getConfig(info)
                    .map(function(behaviourInfo) {
                        const getEvents = readOr$1('events', function(a, b) {
                            return {};
                        })(active);
                        return getEvents(
                            behaviourInfo.config,
                            behaviourInfo.state,
                        );
                    })
                    .getOr({});
            },
        };
        return me;
    };

    const NoState = {
        init() {
            return nu$6({
                readState() {
                    return 'No State required';
                },
            });
        },
    };
    var nu$6 = function(spec) {
        return spec;
    };

    const derive$1 = function(capabilities) {
        return wrapAll$1(capabilities);
    };
    const simpleSchema = objOfOnly([
        strict$1('fields'),
        strict$1('name'),
        defaulted$1('active', {}),
        defaulted$1('apis', {}),
        defaulted$1('state', NoState),
        defaulted$1('extra', {}),
    ]);
    const create$1 = function(data) {
        const value = asRawOrDie(
            `Creating behaviour: ${data.name}`,
            simpleSchema,
            data,
        );
        return create(
            value.fields,
            value.name,
            value.active,
            value.apis,
            value.extra,
            value.state,
        );
    };
    const modeSchema = objOfOnly([
        strict$1('branchKey'),
        strict$1('branches'),
        strict$1('name'),
        defaulted$1('active', {}),
        defaulted$1('apis', {}),
        defaulted$1('state', NoState),
        defaulted$1('extra', {}),
    ]);
    const createModes$1 = function(data) {
        const value = asRawOrDie(
            `Creating behaviour: ${data.name}`,
            modeSchema,
            data,
        );
        return createModes(
            choose$1(value.branchKey, value.branches),
            value.name,
            value.active,
            value.apis,
            value.extra,
            value.state,
        );
    };
    const revoke = constant(undefined);

    const rawSet = function(dom, key, value) {
        if (isString(value) || isBoolean(value) || isNumber(value)) {
            dom.setAttribute(key, `${value}`);
        } else {
            domGlobals.console.error(
                'Invalid call to Attr.set. Key ',
                key,
                ':: Value ',
                value,
                ':: Element ',
                dom,
            );
            throw new Error('Attribute value was not simple');
        }
    };
    const set = function(element, key, value) {
        rawSet(element.dom(), key, value);
    };
    const setAll = function(element, attrs) {
        const dom = element.dom();
        each(attrs, function(v, k) {
            rawSet(dom, k, v);
        });
    };
    const get = function(element, key) {
        const v = element.dom().getAttribute(key);
        return v === null ? undefined : v;
    };
    const has$1 = function(element, key) {
        const dom = element.dom();
        return dom && dom.hasAttribute ? dom.hasAttribute(key) : false;
    };
    const remove$1 = function(element, key) {
        element.dom().removeAttribute(key);
    };

    const read$1 = function(element, attr) {
        const value = get(element, attr);
        return value === undefined || value === '' ? [] : value.split(' ');
    };
    const add = function(element, attr, id) {
        const old = read$1(element, attr);
        const nu = old.concat([id]);
        set(element, attr, nu.join(' '));
        return true;
    };
    const remove$2 = function(element, attr, id) {
        const nu = filter(read$1(element, attr), function(v) {
            return v !== id;
        });
        if (nu.length > 0) {
            set(element, attr, nu.join(' '));
        } else {
            remove$1(element, attr);
        }
        return false;
    };

    const supports = function(element) {
        return element.dom().classList !== undefined;
    };
    const get$1 = function(element) {
        return read$1(element, 'class');
    };
    const add$1 = function(element, clazz) {
        return add(element, 'class', clazz);
    };
    const remove$3 = function(element, clazz) {
        return remove$2(element, 'class', clazz);
    };

    const add$2 = function(element, clazz) {
        if (supports(element)) {
            element.dom().classList.add(clazz);
        } else {
            add$1(element, clazz);
        }
    };
    const cleanClass = function(element) {
        const classList = supports(element)
            ? element.dom().classList
            : get$1(element);
        if (classList.length === 0) {
            remove$1(element, 'class');
        }
    };
    const remove$4 = function(element, clazz) {
        if (supports(element)) {
            const { classList } = element.dom();
            classList.remove(clazz);
        } else {
            remove$3(element, clazz);
        }
        cleanClass(element);
    };
    const has$2 = function(element, clazz) {
        return supports(element) && element.dom().classList.contains(clazz);
    };

    const swap = function(element, addCls, removeCls) {
        remove$4(element, removeCls);
        add$2(element, addCls);
    };
    const toAlpha = function(component, swapConfig, swapState) {
        swap(component.element(), swapConfig.alpha, swapConfig.omega);
    };
    const toOmega = function(component, swapConfig, swapState) {
        swap(component.element(), swapConfig.omega, swapConfig.alpha);
    };
    const clear = function(component, swapConfig, swapState) {
        remove$4(component.element(), swapConfig.alpha);
        remove$4(component.element(), swapConfig.omega);
    };
    const isAlpha = function(component, swapConfig, swapState) {
        return has$2(component.element(), swapConfig.alpha);
    };
    const isOmega = function(component, swapConfig, swapState) {
        return has$2(component.element(), swapConfig.omega);
    };

    const SwapApis = /* #__PURE__ */ Object.freeze({
        toAlpha,
        toOmega,
        isAlpha,
        isOmega,
        clear,
    });

    const SwapSchema = [strict$1('alpha'), strict$1('omega')];

    const Swapping = create$1({
        fields: SwapSchema,
        name: 'swapping',
        apis: SwapApis,
    });

    const focus$1 = function(element) {
        element.dom().focus();
    };
    const blur = function(element) {
        element.dom().blur();
    };
    const hasFocus = function(element) {
        const doc = owner(element).dom();
        return element.dom() === doc.activeElement;
    };
    const active = function(_doc) {
        const doc = _doc !== undefined ? _doc.dom() : domGlobals.document;
        return Option.from(doc.activeElement).map(Element.fromDom);
    };
    const search = function(element) {
        return active(owner(element)).filter(function(e) {
            return element.dom().contains(e.dom());
        });
    };

    const global$1 = tinymce.util.Tools.resolve('tinymce.dom.DOMUtils');

    const global$2 = tinymce.util.Tools.resolve('tinymce.ThemeManager');

    const openLink = function(target) {
        const link = domGlobals.document.createElement('a');
        link.target = '_blank';
        link.href = target.href;
        link.rel = 'noreferrer noopener';
        const nuEvt = domGlobals.document.createEvent('MouseEvents');
        nuEvt.initMouseEvent(
            'click',
            true,
            true,
            domGlobals.window,
            0,
            0,
            0,
            0,
            0,
            false,
            false,
            false,
            false,
            0,
            null,
        );
        domGlobals.document.body.appendChild(link);
        link.dispatchEvent(nuEvt);
        domGlobals.document.body.removeChild(link);
    };
    const TinyCodeDupe = { openLink };

    const isSkinDisabled = function(editor) {
        return editor.settings.skin === false;
    };
    const readOnlyOnInit = function(editor) {
        return false;
    };

    const formatChanged = 'formatChanged';
    const orientationChanged = 'orientationChanged';
    const dropupDismissed = 'dropupDismissed';
    const TinyChannels = {
        formatChanged: constant(formatChanged),
        orientationChanged: constant(orientationChanged),
        dropupDismissed: constant(dropupDismissed),
    };

    const fromHtml$1 = function(html, scope) {
        const doc = scope || domGlobals.document;
        const div = doc.createElement('div');
        div.innerHTML = html;
        return children(Element.fromDom(div));
    };

    const get$2 = function(element) {
        return element.dom().innerHTML;
    };
    const set$1 = function(element, content) {
        const owner$1 = owner(element);
        const docDom = owner$1.dom();
        const fragment = Element.fromDom(docDom.createDocumentFragment());
        const contentElements = fromHtml$1(content, docDom);
        append$1(fragment, contentElements);
        empty(element);
        append(element, fragment);
    };
    const getOuter = function(element) {
        const container = Element.fromTag('div');
        const clone = Element.fromDom(element.dom().cloneNode(true));
        append(container, clone);
        return get$2(container);
    };

    const clone = function(original, isDeep) {
        return Element.fromDom(original.dom().cloneNode(isDeep));
    };
    const shallow$1 = function(original) {
        return clone(original, false);
    };

    const getHtml = function(element) {
        const clone = shallow$1(element);
        return getOuter(clone);
    };

    const element = function(elem) {
        return getHtml(elem);
    };

    const chooseChannels = function(channels, message) {
        return message.universal()
            ? channels
            : filter(channels, function(ch) {
                  return contains(message.channels(), ch);
              });
    };
    const events = function(receiveConfig) {
        return derive([
            run(receive(), function(component, message) {
                const channelMap = receiveConfig.channels;
                const channels = keys(channelMap);
                const targetChannels = chooseChannels(channels, message);
                each$1(targetChannels, function(ch) {
                    const channelInfo = channelMap[ch];
                    const channelSchema = channelInfo.schema;
                    const data = asRawOrDie(
                        `channel[${ch}] data\nReceiver: ${element(
                            component.element(),
                        )}`,
                        channelSchema,
                        message.data(),
                    );
                    channelInfo.onReceive(component, data);
                });
            }),
        ]);
    };

    const ActiveReceiving = /* #__PURE__ */ Object.freeze({
        events,
    });

    const cat = function(arr) {
        const r = [];
        const push = function(x) {
            r.push(x);
        };
        for (let i = 0; i < arr.length; i++) {
            arr[i].each(push);
        }
        return r;
    };
    const sequence = function(arr) {
        const r = [];
        for (let i = 0; i < arr.length; i++) {
            const x = arr[i];
            if (x.isSome()) {
                r.push(x.getOrDie());
            } else {
                return Option.none();
            }
        }
        return Option.some(r);
    };
    const findMap = function(arr, f) {
        for (let i = 0; i < arr.length; i++) {
            const r = f(arr[i], i);
            if (r.isSome()) {
                return r;
            }
        }
        return Option.none();
    };
    const someIf = function(b, a) {
        return b ? Option.some(a) : Option.none();
    };

    const unknown$3 = 'unknown';
    let EventConfiguration;
    (function(EventConfiguration) {
        EventConfiguration[(EventConfiguration.STOP = 0)] = 'STOP';
        EventConfiguration[(EventConfiguration.NORMAL = 1)] = 'NORMAL';
        EventConfiguration[(EventConfiguration.LOGGING = 2)] = 'LOGGING';
    })(EventConfiguration || (EventConfiguration = {}));
    const eventConfig = Cell({});
    const makeEventLogger = function(eventName, initialTarget) {
        const sequence = [];
        const startTime = new Date().getTime();
        return {
            logEventCut(name, target, purpose) {
                sequence.push({
                    outcome: 'cut',
                    target,
                    purpose,
                });
            },
            logEventStopped(name, target, purpose) {
                sequence.push({
                    outcome: 'stopped',
                    target,
                    purpose,
                });
            },
            logNoParent(name, target, purpose) {
                sequence.push({
                    outcome: 'no-parent',
                    target,
                    purpose,
                });
            },
            logEventNoHandlers(name, target) {
                sequence.push({
                    outcome: 'no-handlers-left',
                    target,
                });
            },
            logEventResponse(name, target, purpose) {
                sequence.push({
                    outcome: 'response',
                    purpose,
                    target,
                });
            },
            write() {
                const finishTime = new Date().getTime();
                if (
                    contains(
                        ['mousemove', 'mouseover', 'mouseout', systemInit()],
                        eventName,
                    )
                ) {
                    return;
                }
                domGlobals.console.log(eventName, {
                    event: eventName,
                    time: finishTime - startTime,
                    target: initialTarget.dom(),
                    sequence: map$1(sequence, function(s) {
                        if (
                            !contains(['cut', 'stopped', 'response'], s.outcome)
                        ) {
                            return s.outcome;
                        }
                        return `{${
                            s.purpose
                        }} ${s.outcome} at (${element(s.target)})`;
                    }),
                });
            },
        };
    };
    const processEvent = function(eventName, initialTarget, f) {
        const status = readOptFrom$1(eventConfig.get(), eventName)
            .orThunk(function() {
                const patterns = keys(eventConfig.get());
                return findMap(patterns, function(p) {
                    return eventName.indexOf(p) > -1
                        ? Option.some(eventConfig.get()[p])
                        : Option.none();
                });
            })
            .getOr(EventConfiguration.NORMAL);
        switch (status) {
            case EventConfiguration.NORMAL:
                return f(noLogger());
            case EventConfiguration.LOGGING: {
                const logger = makeEventLogger(eventName, initialTarget);
                const output = f(logger);
                logger.write();
                return output;
            }
            case EventConfiguration.STOP:
                return true;
        }
    };
    const path = ['alloy/data/Fields', 'alloy/debugging/Debugging'];
    const getTrace = function() {
        const err = new Error();
        if (err.stack !== undefined) {
            const lines = err.stack.split('\n');
            return find$2(lines, function(line) {
                return (
                    line.indexOf('alloy') > 0 &&
                    !exists(path, function(p) {
                        return line.indexOf(p) > -1;
                    })
                );
            }).getOr(unknown$3);
        }
        return unknown$3;
    };
    const ignoreEvent = {
        logEventCut: noop,
        logEventStopped: noop,
        logNoParent: noop,
        logEventNoHandlers: noop,
        logEventResponse: noop,
        write: noop,
    };
    const monitorEvent = function(eventName, initialTarget, f) {
        return processEvent(eventName, initialTarget, f);
    };
    var noLogger = constant(ignoreEvent);

    const menuFields = constant([strict$1('menu'), strict$1('selectedMenu')]);
    const itemFields = constant([strict$1('item'), strict$1('selectedItem')]);
    const schema = constant(objOf(itemFields().concat(menuFields())));
    const itemSchema = constant(objOf(itemFields()));

    const _initSize = strictObjOf('initSize', [
        strict$1('numColumns'),
        strict$1('numRows'),
    ]);
    const itemMarkers = function() {
        return strictOf('markers', itemSchema());
    };
    const tieredMenuMarkers = function() {
        return strictObjOf(
            'markers',
            [strict$1('backgroundMenu')]
                .concat(menuFields())
                .concat(itemFields()),
        );
    };
    const markers = function(required) {
        return strictObjOf('markers', map$1(required, strict$1));
    };
    const onPresenceHandler = function(label, fieldName, presence) {
        const trace = getTrace();
        return field(
            fieldName,
            fieldName,
            presence,
            valueOf(function(f) {
                return Result.value(function() {
                    const args = [];
                    for (let _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    return f.apply(undefined, args);
                });
            }),
        );
    };
    const onHandler = function(fieldName) {
        return onPresenceHandler('onHandler', fieldName, defaulted(noop));
    };
    const onKeyboardHandler = function(fieldName) {
        return onPresenceHandler(
            'onKeyboardHandler',
            fieldName,
            defaulted(Option.none),
        );
    };
    const onStrictHandler = function(fieldName) {
        return onPresenceHandler('onHandler', fieldName, strict());
    };
    const onStrictKeyboardHandler = function(fieldName) {
        return onPresenceHandler('onKeyboardHandler', fieldName, strict());
    };
    const output = function(name, value) {
        return state$1(name, constant(value));
    };
    const snapshot = function(name) {
        return state$1(name, identity);
    };
    const initSize = constant(_initSize);

    const ReceivingSchema = [
        strictOf(
            'channels',
            setOf$1(
                Result.value,
                objOfOnly([
                    onStrictHandler('onReceive'),
                    defaulted$1('schema', anyValue$1()),
                ]),
            ),
        ),
    ];

    const Receiving = create$1({
        fields: ReceivingSchema,
        name: 'receiving',
        active: ActiveReceiving,
    });

    const updateAriaState = function(component, toggleConfig, toggleState) {
        const ariaInfo = toggleConfig.aria;
        ariaInfo.update(component, ariaInfo, toggleState.get());
    };
    const updateClass = function(component, toggleConfig, toggleState) {
        toggleConfig.toggleClass.each(function(toggleClass) {
            if (toggleState.get()) {
                add$2(component.element(), toggleClass);
            } else {
                remove$4(component.element(), toggleClass);
            }
        });
    };
    const toggle = function(component, toggleConfig, toggleState) {
        set$2(component, toggleConfig, toggleState, !toggleState.get());
    };
    const on = function(component, toggleConfig, toggleState) {
        toggleState.set(true);
        updateClass(component, toggleConfig, toggleState);
        updateAriaState(component, toggleConfig, toggleState);
    };
    const off = function(component, toggleConfig, toggleState) {
        toggleState.set(false);
        updateClass(component, toggleConfig, toggleState);
        updateAriaState(component, toggleConfig, toggleState);
    };
    var set$2 = function(component, toggleConfig, toggleState, state) {
        const action = state ? on : off;
        action(component, toggleConfig, toggleState);
    };
    const isOn = function(component, toggleConfig, toggleState) {
        return toggleState.get();
    };
    const onLoad = function(component, toggleConfig, toggleState) {
        set$2(component, toggleConfig, toggleState, toggleConfig.selected);
    };

    const ToggleApis = /* #__PURE__ */ Object.freeze({
        onLoad,
        toggle,
        isOn,
        on,
        off,
        set: set$2,
    });

    const exhibit = function(base, toggleConfig, toggleState) {
        return nu$5({});
    };
    const events$1 = function(toggleConfig, toggleState) {
        const execute = executeEvent(toggleConfig, toggleState, toggle);
        const load = loadEvent(toggleConfig, toggleState, onLoad);
        return derive(
            flatten([toggleConfig.toggleOnExecute ? [execute] : [], [load]]),
        );
    };

    const ActiveToggle = /* #__PURE__ */ Object.freeze({
        exhibit,
        events: events$1,
    });

    const SetupBehaviourCellState = function(initialState) {
        const init = function() {
            const cell = Cell(initialState);
            const get = function() {
                return cell.get();
            };
            const set = function(newState) {
                return cell.set(newState);
            };
            const clear = function() {
                return cell.set(initialState);
            };
            const readState = function() {
                return cell.get();
            };
            return {
                get,
                set,
                clear,
                readState,
            };
        };
        return { init };
    };

    const updatePressed = function(component, ariaInfo, status) {
        set(component.element(), 'aria-pressed', status);
        if (ariaInfo.syncWithExpanded) {
            updateExpanded(component, ariaInfo, status);
        }
    };
    const updateSelected = function(component, ariaInfo, status) {
        set(component.element(), 'aria-selected', status);
    };
    const updateChecked = function(component, ariaInfo, status) {
        set(component.element(), 'aria-checked', status);
    };
    var updateExpanded = function(component, ariaInfo, status) {
        set(component.element(), 'aria-expanded', status);
    };

    const ToggleSchema = [
        defaulted$1('selected', false),
        option('toggleClass'),
        defaulted$1('toggleOnExecute', true),
        defaultedOf(
            'aria',
            { mode: 'none' },
            choose$1('mode', {
                pressed: [
                    defaulted$1('syncWithExpanded', false),
                    output('update', updatePressed),
                ],
                checked: [output('update', updateChecked)],
                expanded: [output('update', updateExpanded)],
                selected: [output('update', updateSelected)],
                none: [output('update', noop)],
            }),
        ),
    ];

    const Toggling = create$1({
        fields: ToggleSchema,
        name: 'toggling',
        active: ActiveToggle,
        apis: ToggleApis,
        state: SetupBehaviourCellState(false),
    });

    const format = function(command, update) {
        return Receiving.config({
            channels: wrap$1(TinyChannels.formatChanged(), {
                onReceive(button, data) {
                    if (data.command === command) {
                        update(button, data.state);
                    }
                },
            }),
        });
    };
    const orientation = function(onReceive) {
        return Receiving.config({
            channels: wrap$1(TinyChannels.orientationChanged(), {
                onReceive,
            }),
        });
    };
    const receive$1 = function(channel, onReceive) {
        return {
            key: channel,
            value: { onReceive },
        };
    };
    const Receivers = {
        format,
        orientation,
        receive: receive$1,
    };

    const prefix = 'tinymce-mobile';
    const resolve = function(p) {
        return `${prefix}-${p}`;
    };
    const Styles = {
        resolve,
        prefix: constant(prefix),
    };

    const pointerEvents = function() {
        const onClick = function(component, simulatedEvent) {
            simulatedEvent.stop();
            emitExecute(component);
        };
        return [
            run(click(), onClick),
            run(tap(), onClick),
            cutter(touchstart()),
            cutter(mousedown()),
        ];
    };
    const events$2 = function(optAction) {
        const executeHandler = function(action) {
            return runOnExecute(function(component, simulatedEvent) {
                action(component);
                simulatedEvent.stop();
            });
        };
        return derive(
            flatten([optAction.map(executeHandler).toArray(), pointerEvents()]),
        );
    };

    const focus$2 = function(component, focusConfig) {
        if (!focusConfig.ignore) {
            focus$1(component.element());
            focusConfig.onFocus(component);
        }
    };
    const blur$1 = function(component, focusConfig) {
        if (!focusConfig.ignore) {
            blur(component.element());
        }
    };
    const isFocused = function(component) {
        return hasFocus(component.element());
    };

    const FocusApis = /* #__PURE__ */ Object.freeze({
        focus: focus$2,
        blur: blur$1,
        isFocused,
    });

    const exhibit$1 = function(base, focusConfig) {
        const mod = focusConfig.ignore
            ? {}
            : { attributes: { tabindex: '-1' } };
        return nu$5(mod);
    };
    const events$3 = function(focusConfig) {
        return derive(
            [
                run(focus(), function(component, simulatedEvent) {
                    focus$2(component, focusConfig);
                    simulatedEvent.stop();
                }),
            ].concat(
                focusConfig.stopMousedown
                    ? [
                          run(mousedown(), function(_, simulatedEvent) {
                              simulatedEvent.event().prevent();
                          }),
                      ]
                    : [],
            ),
        );
    };

    const ActiveFocus = /* #__PURE__ */ Object.freeze({
        exhibit: exhibit$1,
        events: events$3,
    });

    const FocusSchema = [
        onHandler('onFocus'),
        defaulted$1('stopMousedown', false),
        defaulted$1('ignore', false),
    ];

    const Focusing = create$1({
        fields: FocusSchema,
        name: 'focusing',
        active: ActiveFocus,
        apis: FocusApis,
    });

    const isSupported = function(dom) {
        return (
            dom.style !== undefined && isFunction(dom.style.getPropertyValue)
        );
    };

    const internalSet = function(dom, property, value) {
        if (!isString(value)) {
            domGlobals.console.error(
                'Invalid call to CSS.set. Property ',
                property,
                ':: Value ',
                value,
                ':: Element ',
                dom,
            );
            throw new Error(`CSS value must be a string: ${value}`);
        }
        if (isSupported(dom)) {
            dom.style.setProperty(property, value);
        }
    };
    const internalRemove = function(dom, property) {
        if (isSupported(dom)) {
            dom.style.removeProperty(property);
        }
    };
    const set$3 = function(element, property, value) {
        const dom = element.dom();
        internalSet(dom, property, value);
    };
    const setAll$1 = function(element, css) {
        const dom = element.dom();
        each(css, function(v, k) {
            internalSet(dom, k, v);
        });
    };
    const get$3 = function(element, property) {
        const dom = element.dom();
        const styles = domGlobals.window.getComputedStyle(dom);
        const r = styles.getPropertyValue(property);
        const v =
            r === '' && !inBody(element) ? getUnsafeProperty(dom, property) : r;
        return v === null ? undefined : v;
    };
    var getUnsafeProperty = function(dom, property) {
        return isSupported(dom) ? dom.style.getPropertyValue(property) : '';
    };
    const getRaw = function(element, property) {
        const dom = element.dom();
        const raw = getUnsafeProperty(dom, property);
        return Option.from(raw).filter(function(r) {
            return r.length > 0;
        });
    };
    const remove$5 = function(element, property) {
        const dom = element.dom();
        internalRemove(dom, property);
        if (has$1(element, 'style') && trim(get(element, 'style')) === '') {
            remove$1(element, 'style');
        }
    };
    const reflow = function(e) {
        return e.dom().offsetWidth;
    };

    function Dimension(name, getOffset) {
        const set = function(element, h) {
            if (!isNumber(h) && !h.match(/^[0-9]+$/)) {
                throw new Error(
                    `${name}.set accepts only positive integer values. Value was ${h}`,
                );
            }
            const dom = element.dom();
            if (isSupported(dom)) {
                dom.style[name] = `${h}px`;
            }
        };
        const get = function(element) {
            const r = getOffset(element);
            if (r <= 0 || r === null) {
                const css = get$3(element, name);
                return parseFloat(css) || 0;
            }
            return r;
        };
        const getOuter = get;
        const aggregate = function(element, properties) {
            return foldl(
                properties,
                function(acc, property) {
                    const val = get$3(element, property);
                    const value = val === undefined ? 0 : parseInt(val, 10);
                    return isNaN(value) ? acc : acc + value;
                },
                0,
            );
        };
        const max = function(element, value, properties) {
            const cumulativeInclusions = aggregate(element, properties);
            const absoluteMax =
                value > cumulativeInclusions ? value - cumulativeInclusions : 0;
            return absoluteMax;
        };
        return {
            set,
            get,
            getOuter,
            aggregate,
            max,
        };
    }

    const api = Dimension('height', function(element) {
        const dom = element.dom();
        return inBody(element)
            ? dom.getBoundingClientRect().height
            : dom.offsetHeight;
    });
    const get$4 = function(element) {
        return api.get(element);
    };

    const ancestors = function(scope, predicate, isRoot) {
        return filter(parents(scope, isRoot), predicate);
    };
    const siblings$1 = function(scope, predicate) {
        return filter(siblings(scope), predicate);
    };

    const all$2 = function(selector) {
        return all(selector);
    };
    const ancestors$1 = function(scope, selector, isRoot) {
        return ancestors(
            scope,
            function(e) {
                return is(e, selector);
            },
            isRoot,
        );
    };
    const siblings$2 = function(scope, selector) {
        return siblings$1(scope, function(e) {
            return is(e, selector);
        });
    };
    const descendants = function(scope, selector) {
        return all(selector, scope);
    };

    const first = function(selector) {
        return one(selector);
    };
    const ancestor$1 = function(scope, selector, isRoot) {
        return ancestor(
            scope,
            function(e) {
                return is(e, selector);
            },
            isRoot,
        );
    };
    const descendant$1 = function(scope, selector) {
        return one(selector, scope);
    };
    const closest$2 = function(scope, selector, isRoot) {
        return ClosestOrAncestor(is, ancestor$1, scope, selector, isRoot);
    };

    const BACKSPACE = function() {
        return [8];
    };
    const TAB = function() {
        return [9];
    };
    const ENTER = function() {
        return [13];
    };
    const ESCAPE = function() {
        return [27];
    };
    const SPACE = function() {
        return [32];
    };
    const LEFT = function() {
        return [37];
    };
    const UP = function() {
        return [38];
    };
    const RIGHT = function() {
        return [39];
    };
    const DOWN = function() {
        return [40];
    };

    const cyclePrev = function(values, index, predicate) {
        const before = reverse(values.slice(0, index));
        const after = reverse(values.slice(index + 1));
        return find$2(before.concat(after), predicate);
    };
    const tryPrev = function(values, index, predicate) {
        const before = reverse(values.slice(0, index));
        return find$2(before, predicate);
    };
    const cycleNext = function(values, index, predicate) {
        const before = values.slice(0, index);
        const after = values.slice(index + 1);
        return find$2(after.concat(before), predicate);
    };
    const tryNext = function(values, index, predicate) {
        const after = values.slice(index + 1);
        return find$2(after, predicate);
    };

    const inSet = function(keys) {
        return function(event) {
            const raw = event.raw();
            return contains(keys, raw.which);
        };
    };
    const and = function(preds) {
        return function(event) {
            return forall(preds, function(pred) {
                return pred(event);
            });
        };
    };
    const isShift = function(event) {
        const raw = event.raw();
        return raw.shiftKey === true;
    };
    const isControl = function(event) {
        const raw = event.raw();
        return raw.ctrlKey === true;
    };
    const isNotShift = not(isShift);

    const rule = function(matches, action) {
        return {
            matches,
            classification: action,
        };
    };
    const choose$2 = function(transitions, event) {
        const transition = find$2(transitions, function(t) {
            return t.matches(event);
        });
        return transition.map(function(t) {
            return t.classification;
        });
    };

    const cycleBy = function(value, delta, min, max) {
        const r = value + delta;
        if (r > max) {
            return min;
        }
        return r < min ? max : r;
    };
    const cap = function(value, min, max) {
        if (value <= min) {
            return min;
        }
        return value >= max ? max : value;
    };

    const dehighlightAllExcept = function(component, hConfig, hState, skip) {
        const highlighted = descendants(
            component.element(),
            `.${hConfig.highlightClass}`,
        );
        each$1(highlighted, function(h) {
            if (
                !exists(skip, function(skipComp) {
                    return skipComp.element() === h;
                })
            ) {
                remove$4(h, hConfig.highlightClass);
                component
                    .getSystem()
                    .getByDom(h)
                    .each(function(target) {
                        hConfig.onDehighlight(component, target);
                        emit(target, dehighlight());
                    });
            }
        });
    };
    const dehighlightAll = function(component, hConfig, hState) {
        return dehighlightAllExcept(component, hConfig, hState, []);
    };
    const dehighlight$1 = function(component, hConfig, hState, target) {
        if (isHighlighted(component, hConfig, hState, target)) {
            remove$4(target.element(), hConfig.highlightClass);
            hConfig.onDehighlight(component, target);
            emit(target, dehighlight());
        }
    };
    const highlight$1 = function(component, hConfig, hState, target) {
        dehighlightAllExcept(component, hConfig, hState, [target]);
        if (!isHighlighted(component, hConfig, hState, target)) {
            add$2(target.element(), hConfig.highlightClass);
            hConfig.onHighlight(component, target);
            emit(target, highlight());
        }
    };
    const highlightFirst = function(component, hConfig, hState) {
        getFirst(component, hConfig).each(function(firstComp) {
            highlight$1(component, hConfig, hState, firstComp);
        });
    };
    const highlightLast = function(component, hConfig, hState) {
        getLast(component, hConfig).each(function(lastComp) {
            highlight$1(component, hConfig, hState, lastComp);
        });
    };
    const highlightAt = function(component, hConfig, hState, index) {
        getByIndex(component, hConfig, hState, index).fold(
            function(err) {
                throw new Error(err);
            },
            function(firstComp) {
                highlight$1(component, hConfig, hState, firstComp);
            },
        );
    };
    const highlightBy = function(component, hConfig, hState, predicate) {
        const candidates = getCandidates(component, hConfig);
        const targetComp = find$2(candidates, predicate);
        targetComp.each(function(c) {
            highlight$1(component, hConfig, hState, c);
        });
    };
    var isHighlighted = function(component, hConfig, hState, queryTarget) {
        return has$2(queryTarget.element(), hConfig.highlightClass);
    };
    const getHighlighted = function(component, hConfig, hState) {
        return descendant$1(
            component.element(),
            `.${hConfig.highlightClass}`,
        ).bind(function(e) {
            return component
                .getSystem()
                .getByDom(e)
                .toOption();
        });
    };
    var getByIndex = function(component, hConfig, hState, index) {
        const items = descendants(component.element(), `.${hConfig.itemClass}`);
        return Option.from(items[index]).fold(function() {
            return Result.error(`No element found with index ${index}`);
        }, component.getSystem().getByDom);
    };
    var getFirst = function(component, hConfig, hState) {
        return descendant$1(component.element(), `.${hConfig.itemClass}`).bind(
            function(e) {
                return component
                    .getSystem()
                    .getByDom(e)
                    .toOption();
            },
        );
    };
    var getLast = function(component, hConfig, hState) {
        const items = descendants(component.element(), `.${hConfig.itemClass}`);
        const last =
            items.length > 0
                ? Option.some(items[items.length - 1])
                : Option.none();
        return last.bind(function(c) {
            return component
                .getSystem()
                .getByDom(c)
                .toOption();
        });
    };
    const getDelta = function(component, hConfig, hState, delta) {
        const items = descendants(component.element(), `.${hConfig.itemClass}`);
        const current = findIndex(items, function(item) {
            return has$2(item, hConfig.highlightClass);
        });
        return current.bind(function(selected) {
            const dest = cycleBy(selected, delta, 0, items.length - 1);
            return component
                .getSystem()
                .getByDom(items[dest])
                .toOption();
        });
    };
    const getPrevious = function(component, hConfig, hState) {
        return getDelta(component, hConfig, hState, -1);
    };
    const getNext = function(component, hConfig, hState) {
        return getDelta(component, hConfig, hState, +1);
    };
    var getCandidates = function(component, hConfig, hState) {
        const items = descendants(component.element(), `.${hConfig.itemClass}`);
        return cat(
            map$1(items, function(i) {
                return component
                    .getSystem()
                    .getByDom(i)
                    .toOption();
            }),
        );
    };

    const HighlightApis = /* #__PURE__ */ Object.freeze({
        dehighlightAll,
        dehighlight: dehighlight$1,
        highlight: highlight$1,
        highlightFirst,
        highlightLast,
        highlightAt,
        highlightBy,
        isHighlighted,
        getHighlighted,
        getFirst,
        getLast,
        getPrevious,
        getNext,
        getCandidates,
    });

    const HighlightSchema = [
        strict$1('highlightClass'),
        strict$1('itemClass'),
        onHandler('onHighlight'),
        onHandler('onDehighlight'),
    ];

    const Highlighting = create$1({
        fields: HighlightSchema,
        name: 'highlighting',
        apis: HighlightApis,
    });

    const reportFocusShifting = function(component, prevFocus, newFocus) {
        const noChange = prevFocus.exists(function(p) {
            return newFocus.exists(function(n) {
                return eq(n, p);
            });
        });
        if (!noChange) {
            emitWith(component, focusShifted(), {
                prevFocus,
                newFocus,
            });
        }
    };
    const dom = function() {
        const get = function(component) {
            return search(component.element());
        };
        const set = function(component, focusee) {
            const prevFocus = get(component);
            component.getSystem().triggerFocus(focusee, component.element());
            const newFocus = get(component);
            reportFocusShifting(component, prevFocus, newFocus);
        };
        return {
            get,
            set,
        };
    };
    const highlights = function() {
        const get = function(component) {
            return Highlighting.getHighlighted(component).map(function(item) {
                return item.element();
            });
        };
        const set = function(component, element) {
            const prevFocus = get(component);
            component
                .getSystem()
                .getByDom(element)
                .fold(noop, function(item) {
                    Highlighting.highlight(component, item);
                });
            const newFocus = get(component);
            reportFocusShifting(component, prevFocus, newFocus);
        };
        return {
            get,
            set,
        };
    };

    let FocusInsideModes;
    (function(FocusInsideModes) {
        FocusInsideModes.OnFocusMode = 'onFocus';
        FocusInsideModes.OnEnterOrSpaceMode = 'onEnterOrSpace';
        FocusInsideModes.OnApiMode = 'onApi';
    })(FocusInsideModes || (FocusInsideModes = {}));

    const typical = function(
        infoSchema,
        stateInit,
        getKeydownRules,
        getKeyupRules,
        optFocusIn,
    ) {
        const schema = function() {
            return infoSchema.concat([
                defaulted$1('focusManager', dom()),
                defaultedOf(
                    'focusInside',
                    'onFocus',
                    valueOf(function(val) {
                        return contains(
                            ['onFocus', 'onEnterOrSpace', 'onApi'],
                            val,
                        )
                            ? Result.value(val)
                            : Result.error('Invalid value for focusInside');
                    }),
                ),
                output('handler', me),
                output('state', stateInit),
                output('sendFocusIn', optFocusIn),
            ]);
        };
        const processKey = function(
            component,
            simulatedEvent,
            getRules,
            keyingConfig,
            keyingState,
        ) {
            const rules = getRules(
                component,
                simulatedEvent,
                keyingConfig,
                keyingState,
            );
            return choose$2(rules, simulatedEvent.event()).bind(function(rule) {
                return rule(
                    component,
                    simulatedEvent,
                    keyingConfig,
                    keyingState,
                );
            });
        };
        const toEvents = function(keyingConfig, keyingState) {
            const onFocusHandler =
                keyingConfig.focusInside !== FocusInsideModes.OnFocusMode
                    ? Option.none()
                    : optFocusIn(keyingConfig).map(function(focusIn) {
                          return run(focus(), function(
                              component,
                              simulatedEvent,
                          ) {
                              focusIn(component, keyingConfig, keyingState);
                              simulatedEvent.stop();
                          });
                      });
            const tryGoInsideComponent = function(component, simulatedEvent) {
                const isEnterOrSpace = inSet(SPACE().concat(ENTER()))(
                    simulatedEvent.event(),
                );
                if (
                    keyingConfig.focusInside ===
                        FocusInsideModes.OnEnterOrSpaceMode &&
                    isEnterOrSpace &&
                    isSource(component, simulatedEvent)
                ) {
                    optFocusIn(keyingConfig).each(function(focusIn) {
                        focusIn(component, keyingConfig, keyingState);
                        simulatedEvent.stop();
                    });
                }
            };
            return derive(
                onFocusHandler.toArray().concat([
                    run(keydown(), function(component, simulatedEvent) {
                        processKey(
                            component,
                            simulatedEvent,
                            getKeydownRules,
                            keyingConfig,
                            keyingState,
                        ).fold(
                            function() {
                                tryGoInsideComponent(component, simulatedEvent);
                            },
                            function(_) {
                                simulatedEvent.stop();
                            },
                        );
                    }),
                    run(keyup(), function(component, simulatedEvent) {
                        processKey(
                            component,
                            simulatedEvent,
                            getKeyupRules,
                            keyingConfig,
                            keyingState,
                        ).each(function(_) {
                            simulatedEvent.stop();
                        });
                    }),
                ]),
            );
        };
        var me = {
            schema,
            processKey,
            toEvents,
        };
        return me;
    };

    const create$2 = function(cyclicField) {
        const schema = [
            option('onEscape'),
            option('onEnter'),
            defaulted$1(
                'selector',
                '[data-alloy-tabstop="true"]:not(:disabled)',
            ),
            defaulted$1('firstTabstop', 0),
            defaulted$1('useTabstopAt', constant(true)),
            option('visibilitySelector'),
        ].concat([cyclicField]);
        const isVisible = function(tabbingConfig, element) {
            const target = tabbingConfig.visibilitySelector
                .bind(function(sel) {
                    return closest$2(element, sel);
                })
                .getOr(element);
            return get$4(target) > 0;
        };
        const findInitial = function(component, tabbingConfig) {
            const tabstops = descendants(
                component.element(),
                tabbingConfig.selector,
            );
            const visibles = filter(tabstops, function(elem) {
                return isVisible(tabbingConfig, elem);
            });
            return Option.from(visibles[tabbingConfig.firstTabstop]);
        };
        const findCurrent = function(component, tabbingConfig) {
            return tabbingConfig.focusManager
                .get(component)
                .bind(function(elem) {
                    return closest$2(elem, tabbingConfig.selector);
                });
        };
        const isTabstop = function(tabbingConfig, element) {
            return (
                isVisible(tabbingConfig, element) &&
                tabbingConfig.useTabstopAt(element)
            );
        };
        const focusIn = function(component, tabbingConfig) {
            findInitial(component, tabbingConfig).each(function(target) {
                tabbingConfig.focusManager.set(component, target);
            });
        };
        const goFromTabstop = function(
            component,
            tabstops,
            stopIndex,
            tabbingConfig,
            cycle,
        ) {
            return cycle(tabstops, stopIndex, function(elem) {
                return isTabstop(tabbingConfig, elem);
            }).fold(
                function() {
                    return tabbingConfig.cyclic
                        ? Option.some(true)
                        : Option.none();
                },
                function(target) {
                    tabbingConfig.focusManager.set(component, target);
                    return Option.some(true);
                },
            );
        };
        const go = function(component, simulatedEvent, tabbingConfig, cycle) {
            const tabstops = descendants(
                component.element(),
                tabbingConfig.selector,
            );
            return findCurrent(component, tabbingConfig).bind(function(
                tabstop,
            ) {
                const optStopIndex = findIndex(tabstops, curry(eq, tabstop));
                return optStopIndex.bind(function(stopIndex) {
                    return goFromTabstop(
                        component,
                        tabstops,
                        stopIndex,
                        tabbingConfig,
                        cycle,
                    );
                });
            });
        };
        const goBackwards = function(
            component,
            simulatedEvent,
            tabbingConfig,
            tabbingState,
        ) {
            const navigate = tabbingConfig.cyclic ? cyclePrev : tryPrev;
            return go(component, simulatedEvent, tabbingConfig, navigate);
        };
        const goForwards = function(
            component,
            simulatedEvent,
            tabbingConfig,
            tabbingState,
        ) {
            const navigate = tabbingConfig.cyclic ? cycleNext : tryNext;
            return go(component, simulatedEvent, tabbingConfig, navigate);
        };
        const execute = function(
            component,
            simulatedEvent,
            tabbingConfig,
            tabbingState,
        ) {
            return tabbingConfig.onEnter.bind(function(f) {
                return f(component, simulatedEvent);
            });
        };
        const exit = function(
            component,
            simulatedEvent,
            tabbingConfig,
            tabbingState,
        ) {
            return tabbingConfig.onEscape.bind(function(f) {
                return f(component, simulatedEvent);
            });
        };
        const getKeydownRules = constant([
            rule(and([isShift, inSet(TAB())]), goBackwards),
            rule(inSet(TAB()), goForwards),
            rule(inSet(ESCAPE()), exit),
            rule(and([isNotShift, inSet(ENTER())]), execute),
        ]);
        const getKeyupRules = constant([]);
        return typical(
            schema,
            NoState.init,
            getKeydownRules,
            getKeyupRules,
            function() {
                return Option.some(focusIn);
            },
        );
    };

    const AcyclicType = create$2(state$1('cyclic', constant(false)));

    const CyclicType = create$2(state$1('cyclic', constant(true)));

    const inside = function(target) {
        return (
            (name(target) === 'input' && get(target, 'type') !== 'radio') ||
            name(target) === 'textarea'
        );
    };

    const doDefaultExecute = function(component, simulatedEvent, focused) {
        dispatch(component, focused, execute());
        return Option.some(true);
    };
    const defaultExecute = function(component, simulatedEvent, focused) {
        return inside(focused) && inSet(SPACE())(simulatedEvent.event())
            ? Option.none()
            : doDefaultExecute(component, simulatedEvent, focused);
    };
    const stopEventForFirefox = function(component, simulatedEvent) {
        return Option.some(true);
    };

    const schema$1 = [
        defaulted$1('execute', defaultExecute),
        defaulted$1('useSpace', false),
        defaulted$1('useEnter', true),
        defaulted$1('useControlEnter', false),
        defaulted$1('useDown', false),
    ];
    const execute$1 = function(component, simulatedEvent, executeConfig) {
        return executeConfig.execute(
            component,
            simulatedEvent,
            component.element(),
        );
    };
    const getKeydownRules = function(
        component,
        simulatedEvent,
        executeConfig,
        executeState,
    ) {
        const spaceExec =
            executeConfig.useSpace && !inside(component.element())
                ? SPACE()
                : [];
        const enterExec = executeConfig.useEnter ? ENTER() : [];
        const downExec = executeConfig.useDown ? DOWN() : [];
        const execKeys = spaceExec.concat(enterExec).concat(downExec);
        return [rule(inSet(execKeys), execute$1)].concat(
            executeConfig.useControlEnter
                ? [rule(and([isControl, inSet(ENTER())]), execute$1)]
                : [],
        );
    };
    const getKeyupRules = function(
        component,
        simulatedEvent,
        executeConfig,
        executeState,
    ) {
        return executeConfig.useSpace && !inside(component.element())
            ? [rule(inSet(SPACE()), stopEventForFirefox)]
            : [];
    };
    const ExecutionType = typical(
        schema$1,
        NoState.init,
        getKeydownRules,
        getKeyupRules,
        function() {
            return Option.none();
        },
    );

    const flatgrid = function(spec) {
        const dimensions = Cell(Option.none());
        const setGridSize = function(numRows, numColumns) {
            dimensions.set(
                Option.some({
                    numRows: constant(numRows),
                    numColumns: constant(numColumns),
                }),
            );
        };
        const getNumRows = function() {
            return dimensions.get().map(function(d) {
                return d.numRows();
            });
        };
        const getNumColumns = function() {
            return dimensions.get().map(function(d) {
                return d.numColumns();
            });
        };
        return nu$6({
            readState() {
                return dimensions
                    .get()
                    .map(function(d) {
                        return {
                            numRows: d.numRows(),
                            numColumns: d.numColumns(),
                        };
                    })
                    .getOr({
                        numRows: '?',
                        numColumns: '?',
                    });
            },
            setGridSize,
            getNumRows,
            getNumColumns,
        });
    };
    const init = function(spec) {
        return spec.state(spec);
    };

    const KeyingState = /* #__PURE__ */ Object.freeze({
        flatgrid,
        init,
    });

    const onDirection = function(isLtr, isRtl) {
        return function(element) {
            return getDirection(element) === 'rtl' ? isRtl : isLtr;
        };
    };
    var getDirection = function(element) {
        return get$3(element, 'direction') === 'rtl' ? 'rtl' : 'ltr';
    };

    const useH = function(movement) {
        return function(component, simulatedEvent, config, state) {
            const move = movement(component.element());
            return use(move, component, simulatedEvent, config, state);
        };
    };
    const west = function(moveLeft, moveRight) {
        const movement = onDirection(moveLeft, moveRight);
        return useH(movement);
    };
    const east = function(moveLeft, moveRight) {
        const movement = onDirection(moveRight, moveLeft);
        return useH(movement);
    };
    const useV = function(move) {
        return function(component, simulatedEvent, config, state) {
            return use(move, component, simulatedEvent, config, state);
        };
    };
    var use = function(move, component, simulatedEvent, config, state) {
        const outcome = config.focusManager
            .get(component)
            .bind(function(focused) {
                return move(component.element(), focused, config, state);
            });
        return outcome.map(function(newFocus) {
            config.focusManager.set(component, newFocus);
            return true;
        });
    };
    const north = useV;
    const south = useV;
    const move = useV;

    const isHidden = function(dom) {
        return dom.offsetWidth <= 0 && dom.offsetHeight <= 0;
    };
    const isVisible = function(element) {
        const dom = element.dom();
        return !isHidden(dom);
    };

    const indexInfo = MixedBag(['index', 'candidates'], []);
    const locate = function(candidates, predicate) {
        return findIndex(candidates, predicate).map(function(index) {
            return indexInfo({
                index,
                candidates,
            });
        });
    };

    const locateVisible = function(container, current, selector) {
        const predicate = curry(eq, current);
        const candidates = descendants(container, selector);
        const visible = filter(candidates, isVisible);
        return locate(visible, predicate);
    };
    const findIndex$1 = function(elements, target) {
        return findIndex(elements, function(elem) {
            return eq(target, elem);
        });
    };

    const withGrid = function(values, index, numCols, f) {
        const oldRow = Math.floor(index / numCols);
        const oldColumn = index % numCols;
        return f(oldRow, oldColumn).bind(function(address) {
            const newIndex = address.row() * numCols + address.column();
            return newIndex >= 0 && newIndex < values.length
                ? Option.some(values[newIndex])
                : Option.none();
        });
    };
    const cycleHorizontal = function(values, index, numRows, numCols, delta) {
        return withGrid(values, index, numCols, function(oldRow, oldColumn) {
            const onLastRow = oldRow === numRows - 1;
            const colsInRow = onLastRow
                ? values.length - oldRow * numCols
                : numCols;
            const newColumn = cycleBy(oldColumn, delta, 0, colsInRow - 1);
            return Option.some({
                row: constant(oldRow),
                column: constant(newColumn),
            });
        });
    };
    const cycleVertical = function(values, index, numRows, numCols, delta) {
        return withGrid(values, index, numCols, function(oldRow, oldColumn) {
            const newRow = cycleBy(oldRow, delta, 0, numRows - 1);
            const onLastRow = newRow === numRows - 1;
            const colsInRow = onLastRow
                ? values.length - newRow * numCols
                : numCols;
            const newCol = cap(oldColumn, 0, colsInRow - 1);
            return Option.some({
                row: constant(newRow),
                column: constant(newCol),
            });
        });
    };
    const cycleRight = function(values, index, numRows, numCols) {
        return cycleHorizontal(values, index, numRows, numCols, +1);
    };
    const cycleLeft = function(values, index, numRows, numCols) {
        return cycleHorizontal(values, index, numRows, numCols, -1);
    };
    const cycleUp = function(values, index, numRows, numCols) {
        return cycleVertical(values, index, numRows, numCols, -1);
    };
    const cycleDown = function(values, index, numRows, numCols) {
        return cycleVertical(values, index, numRows, numCols, +1);
    };

    const schema$2 = [
        strict$1('selector'),
        defaulted$1('execute', defaultExecute),
        onKeyboardHandler('onEscape'),
        defaulted$1('captureTab', false),
        initSize(),
    ];
    const focusIn = function(component, gridConfig, gridState) {
        descendant$1(component.element(), gridConfig.selector).each(function(
            first,
        ) {
            gridConfig.focusManager.set(component, first);
        });
    };
    const findCurrent = function(component, gridConfig) {
        return gridConfig.focusManager.get(component).bind(function(elem) {
            return closest$2(elem, gridConfig.selector);
        });
    };
    const execute$2 = function(
        component,
        simulatedEvent,
        gridConfig,
        gridState,
    ) {
        return findCurrent(component, gridConfig).bind(function(focused) {
            return gridConfig.execute(component, simulatedEvent, focused);
        });
    };
    const doMove = function(cycle) {
        return function(element, focused, gridConfig, gridState) {
            return locateVisible(element, focused, gridConfig.selector).bind(
                function(identified) {
                    return cycle(
                        identified.candidates(),
                        identified.index(),
                        gridState
                            .getNumRows()
                            .getOr(gridConfig.initSize.numRows),
                        gridState
                            .getNumColumns()
                            .getOr(gridConfig.initSize.numColumns),
                    );
                },
            );
        };
    };
    const handleTab = function(
        component,
        simulatedEvent,
        gridConfig,
        gridState,
    ) {
        return gridConfig.captureTab ? Option.some(true) : Option.none();
    };
    const doEscape = function(
        component,
        simulatedEvent,
        gridConfig,
        gridState,
    ) {
        return gridConfig.onEscape(component, simulatedEvent);
    };
    const moveLeft = doMove(cycleLeft);
    const moveRight = doMove(cycleRight);
    const moveNorth = doMove(cycleUp);
    const moveSouth = doMove(cycleDown);
    const getKeydownRules$1 = constant([
        rule(inSet(LEFT()), west(moveLeft, moveRight)),
        rule(inSet(RIGHT()), east(moveLeft, moveRight)),
        rule(inSet(UP()), north(moveNorth)),
        rule(inSet(DOWN()), south(moveSouth)),
        rule(and([isShift, inSet(TAB())]), handleTab),
        rule(and([isNotShift, inSet(TAB())]), handleTab),
        rule(inSet(ESCAPE()), doEscape),
        rule(inSet(SPACE().concat(ENTER())), execute$2),
    ]);
    const getKeyupRules$1 = constant([
        rule(inSet(SPACE()), stopEventForFirefox),
    ]);
    const FlatgridType = typical(
        schema$2,
        flatgrid,
        getKeydownRules$1,
        getKeyupRules$1,
        function() {
            return Option.some(focusIn);
        },
    );

    const horizontal = function(container, selector, current, delta) {
        const isDisabledButton = function(candidate) {
            return (
                name(candidate) === 'button' &&
                get(candidate, 'disabled') === 'disabled'
            );
        };
        var tryCycle = function(initial, index, candidates) {
            const newIndex = cycleBy(index, delta, 0, candidates.length - 1);
            if (newIndex === initial) {
                return Option.none();
            }
            return isDisabledButton(candidates[newIndex])
                ? tryCycle(initial, newIndex, candidates)
                : Option.from(candidates[newIndex]);
        };
        return locateVisible(container, current, selector).bind(function(
            identified,
        ) {
            const index = identified.index();
            const candidates = identified.candidates();
            return tryCycle(index, index, candidates);
        });
    };

    const schema$3 = [
        strict$1('selector'),
        defaulted$1('getInitial', Option.none),
        defaulted$1('execute', defaultExecute),
        onKeyboardHandler('onEscape'),
        defaulted$1('executeOnMove', false),
        defaulted$1('allowVertical', true),
    ];
    const findCurrent$1 = function(component, flowConfig) {
        return flowConfig.focusManager.get(component).bind(function(elem) {
            return closest$2(elem, flowConfig.selector);
        });
    };
    const execute$3 = function(component, simulatedEvent, flowConfig) {
        return findCurrent$1(component, flowConfig).bind(function(focused) {
            return flowConfig.execute(component, simulatedEvent, focused);
        });
    };
    const focusIn$1 = function(component, flowConfig) {
        flowConfig
            .getInitial(component)
            .orThunk(function() {
                return descendant$1(component.element(), flowConfig.selector);
            })
            .each(function(first) {
                flowConfig.focusManager.set(component, first);
            });
    };
    const moveLeft$1 = function(element, focused, info) {
        return horizontal(element, info.selector, focused, -1);
    };
    const moveRight$1 = function(element, focused, info) {
        return horizontal(element, info.selector, focused, +1);
    };
    const doMove$1 = function(movement) {
        return function(component, simulatedEvent, flowConfig) {
            return movement(component, simulatedEvent, flowConfig).bind(
                function() {
                    return flowConfig.executeOnMove
                        ? execute$3(component, simulatedEvent, flowConfig)
                        : Option.some(true);
                },
            );
        };
    };
    const doEscape$1 = function(
        component,
        simulatedEvent,
        flowConfig,
        _flowState,
    ) {
        return flowConfig.onEscape(component, simulatedEvent);
    };
    const getKeydownRules$2 = function(
        _component,
        _se,
        flowConfig,
        _flowState,
    ) {
        const westMovers = LEFT().concat(flowConfig.allowVertical ? UP() : []);
        const eastMovers = RIGHT().concat(
            flowConfig.allowVertical ? DOWN() : [],
        );
        return [
            rule(inSet(westMovers), doMove$1(west(moveLeft$1, moveRight$1))),
            rule(inSet(eastMovers), doMove$1(east(moveLeft$1, moveRight$1))),
            rule(inSet(ENTER()), execute$3),
            rule(inSet(SPACE()), execute$3),
            rule(inSet(ESCAPE()), doEscape$1),
        ];
    };
    const getKeyupRules$2 = constant([
        rule(inSet(SPACE()), stopEventForFirefox),
    ]);
    const FlowType = typical(
        schema$3,
        NoState.init,
        getKeydownRules$2,
        getKeyupRules$2,
        function() {
            return Option.some(focusIn$1);
        },
    );

    const outcome = MixedBag(['rowIndex', 'columnIndex', 'cell'], []);
    const toCell = function(matrix, rowIndex, columnIndex) {
        return Option.from(matrix[rowIndex]).bind(function(row) {
            return Option.from(row[columnIndex]).map(function(cell) {
                return outcome({
                    rowIndex,
                    columnIndex,
                    cell,
                });
            });
        });
    };
    const cycleHorizontal$1 = function(matrix, rowIndex, startCol, deltaCol) {
        const row = matrix[rowIndex];
        const colsInRow = row.length;
        const newColIndex = cycleBy(startCol, deltaCol, 0, colsInRow - 1);
        return toCell(matrix, rowIndex, newColIndex);
    };
    const cycleVertical$1 = function(matrix, colIndex, startRow, deltaRow) {
        const nextRowIndex = cycleBy(startRow, deltaRow, 0, matrix.length - 1);
        const colsInNextRow = matrix[nextRowIndex].length;
        const nextColIndex = cap(colIndex, 0, colsInNextRow - 1);
        return toCell(matrix, nextRowIndex, nextColIndex);
    };
    const moveHorizontal = function(matrix, rowIndex, startCol, deltaCol) {
        const row = matrix[rowIndex];
        const colsInRow = row.length;
        const newColIndex = cap(startCol + deltaCol, 0, colsInRow - 1);
        return toCell(matrix, rowIndex, newColIndex);
    };
    const moveVertical = function(matrix, colIndex, startRow, deltaRow) {
        const nextRowIndex = cap(startRow + deltaRow, 0, matrix.length - 1);
        const colsInNextRow = matrix[nextRowIndex].length;
        const nextColIndex = cap(colIndex, 0, colsInNextRow - 1);
        return toCell(matrix, nextRowIndex, nextColIndex);
    };
    const cycleRight$1 = function(matrix, startRow, startCol) {
        return cycleHorizontal$1(matrix, startRow, startCol, +1);
    };
    const cycleLeft$1 = function(matrix, startRow, startCol) {
        return cycleHorizontal$1(matrix, startRow, startCol, -1);
    };
    const cycleUp$1 = function(matrix, startRow, startCol) {
        return cycleVertical$1(matrix, startCol, startRow, -1);
    };
    const cycleDown$1 = function(matrix, startRow, startCol) {
        return cycleVertical$1(matrix, startCol, startRow, +1);
    };
    const moveLeft$2 = function(matrix, startRow, startCol) {
        return moveHorizontal(matrix, startRow, startCol, -1);
    };
    const moveRight$2 = function(matrix, startRow, startCol) {
        return moveHorizontal(matrix, startRow, startCol, +1);
    };
    const moveUp = function(matrix, startRow, startCol) {
        return moveVertical(matrix, startCol, startRow, -1);
    };
    const moveDown = function(matrix, startRow, startCol) {
        return moveVertical(matrix, startCol, startRow, +1);
    };

    const schema$4 = [
        strictObjOf('selectors', [strict$1('row'), strict$1('cell')]),
        defaulted$1('cycles', true),
        defaulted$1('previousSelector', Option.none),
        defaulted$1('execute', defaultExecute),
    ];
    const focusIn$2 = function(component, matrixConfig) {
        const focused = matrixConfig
            .previousSelector(component)
            .orThunk(function() {
                const { selectors } = matrixConfig;
                return descendant$1(component.element(), selectors.cell);
            });
        focused.each(function(cell) {
            matrixConfig.focusManager.set(component, cell);
        });
    };
    const execute$4 = function(component, simulatedEvent, matrixConfig) {
        return search(component.element()).bind(function(focused) {
            return matrixConfig.execute(component, simulatedEvent, focused);
        });
    };
    const toMatrix = function(rows, matrixConfig) {
        return map$1(rows, function(row) {
            return descendants(row, matrixConfig.selectors.cell);
        });
    };
    const doMove$2 = function(ifCycle, ifMove) {
        return function(element, focused, matrixConfig) {
            const move = matrixConfig.cycles ? ifCycle : ifMove;
            return closest$2(focused, matrixConfig.selectors.row).bind(function(
                inRow,
            ) {
                const cellsInRow = descendants(
                    inRow,
                    matrixConfig.selectors.cell,
                );
                return findIndex$1(cellsInRow, focused).bind(function(
                    colIndex,
                ) {
                    const allRows = descendants(
                        element,
                        matrixConfig.selectors.row,
                    );
                    return findIndex$1(allRows, inRow).bind(function(rowIndex) {
                        const matrix = toMatrix(allRows, matrixConfig);
                        return move(matrix, rowIndex, colIndex).map(function(
                            next,
                        ) {
                            return next.cell();
                        });
                    });
                });
            });
        };
    };
    const moveLeft$3 = doMove$2(cycleLeft$1, moveLeft$2);
    const moveRight$3 = doMove$2(cycleRight$1, moveRight$2);
    const moveNorth$1 = doMove$2(cycleUp$1, moveUp);
    const moveSouth$1 = doMove$2(cycleDown$1, moveDown);
    const getKeydownRules$3 = constant([
        rule(inSet(LEFT()), west(moveLeft$3, moveRight$3)),
        rule(inSet(RIGHT()), east(moveLeft$3, moveRight$3)),
        rule(inSet(UP()), north(moveNorth$1)),
        rule(inSet(DOWN()), south(moveSouth$1)),
        rule(inSet(SPACE().concat(ENTER())), execute$4),
    ]);
    const getKeyupRules$3 = constant([
        rule(inSet(SPACE()), stopEventForFirefox),
    ]);
    const MatrixType = typical(
        schema$4,
        NoState.init,
        getKeydownRules$3,
        getKeyupRules$3,
        function() {
            return Option.some(focusIn$2);
        },
    );

    const schema$5 = [
        strict$1('selector'),
        defaulted$1('execute', defaultExecute),
        defaulted$1('moveOnTab', false),
    ];
    const execute$5 = function(component, simulatedEvent, menuConfig) {
        return menuConfig.focusManager.get(component).bind(function(focused) {
            return menuConfig.execute(component, simulatedEvent, focused);
        });
    };
    const focusIn$3 = function(component, menuConfig) {
        descendant$1(component.element(), menuConfig.selector).each(function(
            first,
        ) {
            menuConfig.focusManager.set(component, first);
        });
    };
    const moveUp$1 = function(element, focused, info) {
        return horizontal(element, info.selector, focused, -1);
    };
    const moveDown$1 = function(element, focused, info) {
        return horizontal(element, info.selector, focused, +1);
    };
    const fireShiftTab = function(component, simulatedEvent, menuConfig) {
        return menuConfig.moveOnTab
            ? move(moveUp$1)(component, simulatedEvent, menuConfig)
            : Option.none();
    };
    const fireTab = function(component, simulatedEvent, menuConfig) {
        return menuConfig.moveOnTab
            ? move(moveDown$1)(component, simulatedEvent, menuConfig)
            : Option.none();
    };
    const getKeydownRules$4 = constant([
        rule(inSet(UP()), move(moveUp$1)),
        rule(inSet(DOWN()), move(moveDown$1)),
        rule(and([isShift, inSet(TAB())]), fireShiftTab),
        rule(and([isNotShift, inSet(TAB())]), fireTab),
        rule(inSet(ENTER()), execute$5),
        rule(inSet(SPACE()), execute$5),
    ]);
    const getKeyupRules$4 = constant([
        rule(inSet(SPACE()), stopEventForFirefox),
    ]);
    const MenuType = typical(
        schema$5,
        NoState.init,
        getKeydownRules$4,
        getKeyupRules$4,
        function() {
            return Option.some(focusIn$3);
        },
    );

    const schema$6 = [
        onKeyboardHandler('onSpace'),
        onKeyboardHandler('onEnter'),
        onKeyboardHandler('onShiftEnter'),
        onKeyboardHandler('onLeft'),
        onKeyboardHandler('onRight'),
        onKeyboardHandler('onTab'),
        onKeyboardHandler('onShiftTab'),
        onKeyboardHandler('onUp'),
        onKeyboardHandler('onDown'),
        onKeyboardHandler('onEscape'),
        defaulted$1('stopSpaceKeyup', false),
        option('focusIn'),
    ];
    const getKeydownRules$5 = function(component, simulatedEvent, specialInfo) {
        return [
            rule(inSet(SPACE()), specialInfo.onSpace),
            rule(and([isNotShift, inSet(ENTER())]), specialInfo.onEnter),
            rule(and([isShift, inSet(ENTER())]), specialInfo.onShiftEnter),
            rule(and([isShift, inSet(TAB())]), specialInfo.onShiftTab),
            rule(and([isNotShift, inSet(TAB())]), specialInfo.onTab),
            rule(inSet(UP()), specialInfo.onUp),
            rule(inSet(DOWN()), specialInfo.onDown),
            rule(inSet(LEFT()), specialInfo.onLeft),
            rule(inSet(RIGHT()), specialInfo.onRight),
            rule(inSet(SPACE()), specialInfo.onSpace),
            rule(inSet(ESCAPE()), specialInfo.onEscape),
        ];
    };
    const getKeyupRules$5 = function(component, simulatedEvent, specialInfo) {
        return specialInfo.stopSpaceKeyup
            ? [rule(inSet(SPACE()), stopEventForFirefox)]
            : [];
    };
    const SpecialType = typical(
        schema$6,
        NoState.init,
        getKeydownRules$5,
        getKeyupRules$5,
        function(specialInfo) {
            return specialInfo.focusIn;
        },
    );

    const acyclic = AcyclicType.schema();
    const cyclic = CyclicType.schema();
    const flow = FlowType.schema();
    const flatgrid$1 = FlatgridType.schema();
    const matrix = MatrixType.schema();
    const execution = ExecutionType.schema();
    const menu = MenuType.schema();
    const special = SpecialType.schema();

    const KeyboardBranches = /* #__PURE__ */ Object.freeze({
        acyclic,
        cyclic,
        flow,
        flatgrid: flatgrid$1,
        matrix,
        execution,
        menu,
        special,
    });

    const Keying = createModes$1({
        branchKey: 'mode',
        branches: KeyboardBranches,
        name: 'keying',
        active: {
            events(keyingConfig, keyingState) {
                const { handler } = keyingConfig;
                return handler.toEvents(keyingConfig, keyingState);
            },
        },
        apis: {
            focusIn(component, keyConfig, keyState) {
                keyConfig.sendFocusIn(keyConfig).fold(
                    function() {
                        component
                            .getSystem()
                            .triggerFocus(
                                component.element(),
                                component.element(),
                            );
                    },
                    function(sendFocusIn) {
                        sendFocusIn(component, keyConfig, keyState);
                    },
                );
            },
            setGridSize(component, keyConfig, keyState, numRows, numColumns) {
                if (!hasKey$1(keyState, 'setGridSize')) {
                    domGlobals.console.error(
                        'Layout does not support setGridSize',
                    );
                } else {
                    keyState.setGridSize(numRows, numColumns);
                }
            },
        },
        state: KeyingState,
    });

    const field$1 = function(name, forbidden) {
        return defaultedObjOf(
            name,
            {},
            map$1(forbidden, function(f) {
                return forbid(
                    f.name(),
                    `Cannot configure ${f.name()} for ${name}`,
                );
            }).concat([state$1('dump', identity)]),
        );
    };
    const get$5 = function(data) {
        return data.dump;
    };
    const augment = function(data, original) {
        return { ...data.dump, ...derive$1(original) };
    };
    const SketchBehaviours = {
        field: field$1,
        augment,
        get: get$5,
    };

    const _placeholder = 'placeholder';
    const adt$2 = Adt.generate([
        {
            single: ['required', 'valueThunk'],
        },
        {
            multiple: ['required', 'valueThunks'],
        },
    ]);
    const subPlaceholder = function(owner, detail, compSpec, placeholders) {
        if (
            owner.exists(function(o) {
                return o !== compSpec.owner;
            })
        ) {
            return adt$2.single(true, constant(compSpec));
        }
        return readOptFrom$1(placeholders, compSpec.name).fold(
            function() {
                throw new Error(
                    `Unknown placeholder component: ${
                        compSpec.name
                    }\nKnown: [${keys(placeholders)}]\nNamespace: ${owner.getOr(
                        'none',
                    )}\nSpec: ${JSON.stringify(compSpec, null, 2)}`,
                );
            },
            function(newSpec) {
                return newSpec.replace();
            },
        );
    };
    const scan = function(owner, detail, compSpec, placeholders) {
        if (compSpec.uiType === _placeholder) {
            return subPlaceholder(owner, detail, compSpec, placeholders);
        }
        return adt$2.single(false, constant(compSpec));
    };
    var substitute = function(owner, detail, compSpec, placeholders) {
        const base = scan(owner, detail, compSpec, placeholders);
        return base.fold(
            function(req, valueThunk) {
                const value = valueThunk(
                    detail,
                    compSpec.config,
                    compSpec.validated,
                );
                const childSpecs = readOptFrom$1(value, 'components').getOr([]);
                const substituted = bind(childSpecs, function(c) {
                    return substitute(owner, detail, c, placeholders);
                });
                return [{ ...value, components: substituted }];
            },
            function(req, valuesThunk) {
                const values = valuesThunk(
                    detail,
                    compSpec.config,
                    compSpec.validated,
                );
                const preprocessor = compSpec.validated.preprocess.getOr(
                    identity,
                );
                return preprocessor(values);
            },
        );
    };
    const substituteAll = function(owner, detail, components, placeholders) {
        return bind(components, function(c) {
            return substitute(owner, detail, c, placeholders);
        });
    };
    const oneReplace = function(label, replacements) {
        let called = false;
        const used = function() {
            return called;
        };
        const replace = function() {
            if (called === true) {
                throw new Error(
                    `Trying to use the same placeholder more than once: ${label}`,
                );
            }
            called = true;
            return replacements;
        };
        const required = function() {
            return replacements.fold(
                function(req, _) {
                    return req;
                },
                function(req, _) {
                    return req;
                },
            );
        };
        return {
            name: constant(label),
            required,
            used,
            replace,
        };
    };
    const substitutePlaces = function(owner, detail, components, placeholders) {
        const ps = map(placeholders, function(ph, name) {
            return oneReplace(name, ph);
        });
        const outcome = substituteAll(owner, detail, components, ps);
        each(ps, function(p) {
            if (p.used() === false && p.required()) {
                throw new Error(
                    `Placeholder: ${p.name()} was not found in components list\nNamespace: ${owner.getOr(
                        'none',
                    )}\nComponents: ${JSON.stringify(
                        detail.components,
                        null,
                        2,
                    )}`,
                );
            }
        });
        return outcome;
    };
    const { single } = adt$2;
    const { multiple } = adt$2;
    const placeholder = constant(_placeholder);

    let unique = 0;
    const generate$1 = function(prefix) {
        const date = new Date();
        const time = date.getTime();
        const random = Math.floor(Math.random() * 1000000000);
        unique++;
        return `${prefix}_${random}${unique}${String(time)}`;
    };

    const adt$3 = Adt.generate([
        { required: ['data'] },
        { external: ['data'] },
        { optional: ['data'] },
        { group: ['data'] },
    ]);
    const fFactory = defaulted$1('factory', { sketch: identity });
    const fSchema = defaulted$1('schema', []);
    const fName = strict$1('name');
    const fPname = field(
        'pname',
        'pname',
        defaultedThunk(function(typeSpec) {
            return `<alloy.${generate$1(typeSpec.name)}>`;
        }),
        anyValue$1(),
    );
    const fGroupSchema = state$1('schema', function() {
        return [option('preprocess')];
    });
    const fDefaults = defaulted$1('defaults', constant({}));
    const fOverrides = defaulted$1('overrides', constant({}));
    const requiredSpec = objOf([
        fFactory,
        fSchema,
        fName,
        fPname,
        fDefaults,
        fOverrides,
    ]);
    const optionalSpec = objOf([
        fFactory,
        fSchema,
        fName,
        fPname,
        fDefaults,
        fOverrides,
    ]);
    const groupSpec = objOf([
        fFactory,
        fGroupSchema,
        fName,
        strict$1('unit'),
        fPname,
        fDefaults,
        fOverrides,
    ]);
    const asNamedPart = function(part) {
        return part.fold(Option.some, Option.none, Option.some, Option.some);
    };
    const name$1 = function(part) {
        const get = function(data) {
            return data.name;
        };
        return part.fold(get, get, get, get);
    };
    const convert = function(adtConstructor, partSchema) {
        return function(spec) {
            const data = asRawOrDie('Converting part type', partSchema, spec);
            return adtConstructor(data);
        };
    };
    const required = convert(adt$3.required, requiredSpec);
    const optional = convert(adt$3.optional, optionalSpec);
    const group = convert(adt$3.group, groupSpec);
    const original = constant('entirety');

    const combine = function(detail, data, partSpec, partValidated) {
        return deepMerge(
            data.defaults(detail, partSpec, partValidated),
            partSpec,
            { uid: detail.partUids[data.name] },
            data.overrides(detail, partSpec, partValidated),
        );
    };
    const subs = function(owner, detail, parts) {
        const internals = {};
        const externals = {};
        each$1(parts, function(part) {
            part.fold(
                function(data) {
                    internals[data.pname] = single(true, function(
                        detail,
                        partSpec,
                        partValidated,
                    ) {
                        return data.factory.sketch(
                            combine(detail, data, partSpec, partValidated),
                        );
                    });
                },
                function(data) {
                    const partSpec = detail.parts[data.name];
                    externals[data.name] = constant(
                        data.factory.sketch(
                            combine(detail, data, partSpec[original()]),
                            partSpec,
                        ),
                    );
                },
                function(data) {
                    internals[data.pname] = single(false, function(
                        detail,
                        partSpec,
                        partValidated,
                    ) {
                        return data.factory.sketch(
                            combine(detail, data, partSpec, partValidated),
                        );
                    });
                },
                function(data) {
                    internals[data.pname] = multiple(true, function(
                        detail,
                        _partSpec,
                        _partValidated,
                    ) {
                        const units = detail[data.name];
                        return map$1(units, function(u) {
                            return data.factory.sketch(
                                deepMerge(
                                    data.defaults(detail, u, _partValidated),
                                    u,
                                    data.overrides(detail, u),
                                ),
                            );
                        });
                    });
                },
            );
        });
        return {
            internals: constant(internals),
            externals: constant(externals),
        };
    };

    const generate$2 = function(owner, parts) {
        const r = {};
        each$1(parts, function(part) {
            asNamedPart(part).each(function(np) {
                const g = doGenerateOne(owner, np.pname);
                r[np.name] = function(config) {
                    const validated = asRawOrDie(
                        `Part: ${np.name} in ${owner}`,
                        objOf(np.schema),
                        config,
                    );
                    return { ...g, config, validated };
                };
            });
        });
        return r;
    };
    var doGenerateOne = function(owner, pname) {
        return {
            uiType: placeholder(),
            owner,
            name: pname,
        };
    };
    const generateOne = function(owner, pname, config) {
        return {
            uiType: placeholder(),
            owner,
            name: pname,
            config,
            validated: {},
        };
    };
    const schemas = function(parts) {
        return bind(parts, function(part) {
            return part
                .fold(Option.none, Option.some, Option.none, Option.none)
                .map(function(data) {
                    return strictObjOf(
                        data.name,
                        data.schema.concat([snapshot(original())]),
                    );
                })
                .toArray();
        });
    };
    const names = function(parts) {
        return map$1(parts, name$1);
    };
    const substitutes = function(owner, detail, parts) {
        return subs(owner, detail, parts);
    };
    const components = function(owner, detail, internals) {
        return substitutePlaces(
            Option.some(owner),
            detail,
            detail.components,
            internals,
        );
    };
    const getPart = function(component, detail, partKey) {
        const uid = detail.partUids[partKey];
        return component
            .getSystem()
            .getByUid(uid)
            .toOption();
    };
    const getPartOrDie = function(component, detail, partKey) {
        return getPart(component, detail, partKey).getOrDie(
            `Could not find part: ${partKey}`,
        );
    };
    const getAllParts = function(component, detail) {
        const system = component.getSystem();
        return map(detail.partUids, function(pUid, k) {
            return constant(system.getByUid(pUid));
        });
    };
    const defaultUids = function(baseUid, partTypes) {
        const partNames = names(partTypes);
        return wrapAll$1(
            map$1(partNames, function(pn) {
                return {
                    key: pn,
                    value: `${baseUid}-${pn}`,
                };
            }),
        );
    };
    const defaultUidsSchema = function(partTypes) {
        return field(
            'partUids',
            'partUids',
            mergeWithThunk(function(spec) {
                return defaultUids(spec.uid, partTypes);
            }),
            anyValue$1(),
        );
    };

    const premadeTag = generate$1('alloy-premade');
    const premade = function(comp) {
        return wrap$1(premadeTag, comp);
    };
    const getPremade = function(spec) {
        return readOptFrom$1(spec, premadeTag);
    };
    const makeApi = function(f) {
        return markAsSketchApi(function(component) {
            const rest = [];
            for (let _i = 1; _i < arguments.length; _i++) {
                rest[_i - 1] = arguments[_i];
            }
            return f.apply(
                undefined,
                [component.getApis()].concat([component].concat(rest)),
            );
        }, f);
    };

    const prefix$1 = constant('alloy-id-');
    const idAttr = constant('data-alloy-id');

    const prefix$2 = prefix$1();
    const idAttr$1 = idAttr();
    const write = function(label, elem) {
        const id = generate$1(prefix$2 + label);
        writeOnly(elem, id);
        return id;
    };
    var writeOnly = function(elem, uid) {
        Object.defineProperty(elem.dom(), idAttr$1, {
            value: uid,
            writable: true,
        });
    };
    const read$2 = function(elem) {
        const id = isElement(elem) ? elem.dom()[idAttr$1] : null;
        return Option.from(id);
    };
    const generate$3 = function(prefix) {
        return generate$1(prefix);
    };

    const base = function(partSchemas, partUidsSchemas) {
        const ps =
            partSchemas.length > 0 ? [strictObjOf('parts', partSchemas)] : [];
        return ps
            .concat([
                strict$1('uid'),
                defaulted$1('dom', {}),
                defaulted$1('components', []),
                snapshot('originalSpec'),
                defaulted$1('debug.sketcher', {}),
            ])
            .concat(partUidsSchemas);
    };
    const asRawOrDie$1 = function(
        label,
        schema,
        spec,
        partSchemas,
        partUidsSchemas,
    ) {
        const baseS = base(partSchemas, partUidsSchemas);
        return asRawOrDie(
            `${label} [SpecSchema]`,
            objOfOnly(baseS.concat(schema)),
            spec,
        );
    };

    const single$1 = function(owner, schema, factory, spec) {
        const specWithUid = supplyUid(spec);
        const detail = asRawOrDie$1(owner, schema, specWithUid, [], []);
        return factory(detail, specWithUid);
    };
    const composite = function(owner, schema, partTypes, factory, spec) {
        const specWithUid = supplyUid(spec);
        const partSchemas = schemas(partTypes);
        const partUidsSchema = defaultUidsSchema(partTypes);
        const detail = asRawOrDie$1(owner, schema, specWithUid, partSchemas, [
            partUidsSchema,
        ]);
        const subs = substitutes(owner, detail, partTypes);
        const components$1 = components(owner, detail, subs.internals());
        return factory(detail, components$1, specWithUid, subs.externals());
    };
    var supplyUid = function(spec) {
        return spec.hasOwnProperty('uid')
            ? spec
            : { ...spec, uid: generate$3('uid') };
    };

    function isSketchSpec(spec) {
        return spec.uid !== undefined;
    }
    const singleSchema = objOfOnly([
        strict$1('name'),
        strict$1('factory'),
        strict$1('configFields'),
        defaulted$1('apis', {}),
        defaulted$1('extraApis', {}),
    ]);
    const compositeSchema = objOfOnly([
        strict$1('name'),
        strict$1('factory'),
        strict$1('configFields'),
        strict$1('partFields'),
        defaulted$1('apis', {}),
        defaulted$1('extraApis', {}),
    ]);
    const single$2 = function(rawConfig) {
        const config = asRawOrDie(
            `Sketcher for ${rawConfig.name}`,
            singleSchema,
            rawConfig,
        );
        const sketch = function(spec) {
            return single$1(
                config.name,
                config.configFields,
                config.factory,
                spec,
            );
        };
        const apis = map(config.apis, makeApi);
        const extraApis = map(config.extraApis, function(f, k) {
            return markAsExtraApi(f, k);
        });
        return {
            name: constant(config.name),
            partFields: constant([]),
            configFields: constant(config.configFields),
            sketch,
            ...apis,
            ...extraApis,
        };
    };
    const composite$1 = function(rawConfig) {
        const config = asRawOrDie(
            `Sketcher for ${rawConfig.name}`,
            compositeSchema,
            rawConfig,
        );
        const sketch = function(spec) {
            return composite(
                config.name,
                config.configFields,
                config.partFields,
                config.factory,
                spec,
            );
        };
        const parts = generate$2(config.name, config.partFields);
        const apis = map(config.apis, makeApi);
        const extraApis = map(config.extraApis, function(f, k) {
            return markAsExtraApi(f, k);
        });
        return {
            name: constant(config.name),
            partFields: constant(config.partFields),
            configFields: constant(config.configFields),
            sketch,
            parts: constant(parts),
            ...apis,
            ...extraApis,
        };
    };

    const factory = function(detail) {
        const events = events$2(detail.action);
        const { tag } = detail.dom;
        const lookupAttr = function(attr) {
            return readOptFrom$1(detail.dom, 'attributes').bind(function(
                attrs,
            ) {
                return readOptFrom$1(attrs, attr);
            });
        };
        const getModAttributes = function() {
            if (tag === 'button') {
                const type = lookupAttr('type').getOr('button');
                const roleAttrs = lookupAttr('role')
                    .map(function(role) {
                        return { role };
                    })
                    .getOr({});
                return { type, ...roleAttrs };
            }
            const role = lookupAttr('role').getOr('button');
            return { role };
        };
        return {
            uid: detail.uid,
            dom: detail.dom,
            components: detail.components,
            events,
            behaviours: SketchBehaviours.augment(detail.buttonBehaviours, [
                Focusing.config({}),
                Keying.config({
                    mode: 'execution',
                    useSpace: true,
                    useEnter: true,
                }),
            ]),
            domModification: { attributes: getModAttributes() },
            eventOrder: detail.eventOrder,
        };
    };
    const Button = single$2({
        name: 'Button',
        factory,
        configFields: [
            defaulted$1('uid', undefined),
            strict$1('dom'),
            defaulted$1('components', []),
            SketchBehaviours.field('buttonBehaviours', [Focusing, Keying]),
            option('action'),
            option('role'),
            defaulted$1('eventOrder', {}),
        ],
    });

    const exhibit$2 = function(base, unselectConfig) {
        return nu$5({
            styles: {
                '-webkit-user-select': 'none',
                'user-select': 'none',
                '-ms-user-select': 'none',
                '-moz-user-select': '-moz-none',
            },
            attributes: { unselectable: 'on' },
        });
    };
    const events$4 = function(unselectConfig) {
        return derive([abort(selectstart(), constant(true))]);
    };

    const ActiveUnselecting = /* #__PURE__ */ Object.freeze({
        events: events$4,
        exhibit: exhibit$2,
    });

    const Unselecting = create$1({
        fields: [],
        name: 'unselecting',
        active: ActiveUnselecting,
    });

    const getAttrs = function(elem) {
        const attributes =
            elem.dom().attributes !== undefined ? elem.dom().attributes : [];
        return foldl(
            attributes,
            function(b, attr) {
                let _a;
                if (attr.name === 'class') {
                    return b;
                }
                return {
                    ...b,
                    ...((_a = {}), (_a[attr.name] = attr.value), _a),
                };
            },
            {},
        );
    };
    const getClasses = function(elem) {
        return Array.prototype.slice.call(elem.dom().classList, 0);
    };
    const fromHtml$2 = function(html) {
        const elem = Element.fromHtml(html);
        const children$1 = children(elem);
        const attrs = getAttrs(elem);
        const classes = getClasses(elem);
        const contents =
            children$1.length === 0 ? {} : { innerHtml: get$2(elem) };
        return {
            tag: name(elem),
            classes,
            attributes: attrs,
            ...contents,
        };
    };

    const dom$1 = function(rawHtml) {
        const html = supplant(rawHtml, { prefix: Styles.prefix() });
        return fromHtml$2(html);
    };
    const spec = function(rawHtml) {
        const sDom = dom$1(rawHtml);
        return { dom: sDom };
    };

    const forToolbarCommand = function(editor, command) {
        return forToolbar(
            command,
            function() {
                editor.execCommand(command);
            },
            {},
            editor,
        );
    };
    const getToggleBehaviours = function(command) {
        return derive$1([
            Toggling.config({
                toggleClass: Styles.resolve('toolbar-button-selected'),
                toggleOnExecute: false,
                aria: { mode: 'pressed' },
            }),
            Receivers.format(command, function(button, status) {
                const toggle = status ? Toggling.on : Toggling.off;
                toggle(button);
            }),
        ]);
    };
    const forToolbarStateCommand = function(editor, command) {
        const extraBehaviours = getToggleBehaviours(command);
        return forToolbar(
            command,
            function() {
                editor.execCommand(command);
            },
            extraBehaviours,
            editor,
        );
    };
    const forToolbarStateAction = function(editor, clazz, command, action) {
        const extraBehaviours = getToggleBehaviours(command);
        return forToolbar(clazz, action, extraBehaviours, editor);
    };
    const getToolbarIconButton = function(clazz, editor) {
        const { icons } = editor.ui.registry.getAll();
        const optOxideIcon = Option.from(icons[clazz]);
        return optOxideIcon.fold(
            function() {
                return dom$1(
                    `<span class="\${prefix}-toolbar-button \${prefix}-toolbar-group-item \${prefix}-icon-${clazz} \${prefix}-icon"></span>`,
                );
            },
            function(icon) {
                return dom$1(
                    `<span class="\${prefix}-toolbar-button \${prefix}-toolbar-group-item">${icon}</span>`,
                );
            },
        );
    };
    var forToolbar = function(clazz, action, extraBehaviours, editor) {
        return Button.sketch({
            dom: getToolbarIconButton(clazz, editor),
            action,
            buttonBehaviours: deepMerge(
                derive$1([Unselecting.config({})]),
                extraBehaviours,
            ),
        });
    };
    const Buttons = {
        forToolbar,
        forToolbarCommand,
        forToolbarStateAction,
        forToolbarStateCommand,
        getToolbarIconButton,
    };

    const labelPart = optional({
        schema: [strict$1('dom')],
        name: 'label',
    });
    const edgePart = function(name) {
        return optional({
            name: `${name}-edge`,
            overrides(detail) {
                const action = detail.model.manager.edgeActions[name];
                return action.fold(
                    function() {
                        return {};
                    },
                    function(a) {
                        return {
                            events: derive([
                                runActionExtra(touchstart(), a, [detail]),
                                runActionExtra(mousedown(), a, [detail]),
                                runActionExtra(
                                    mousemove(),
                                    function(l, se, det) {
                                        if (det.mouseIsDown.get()) {
                                            a(l, det);
                                        }
                                    },
                                    [detail],
                                ),
                            ]),
                        };
                    },
                );
            },
        });
    };
    const tlEdgePart = edgePart('top-left');
    const tedgePart = edgePart('top');
    const trEdgePart = edgePart('top-right');
    const redgePart = edgePart('right');
    const brEdgePart = edgePart('bottom-right');
    const bedgePart = edgePart('bottom');
    const blEdgePart = edgePart('bottom-left');
    const ledgePart = edgePart('left');
    const thumbPart = required({
        name: 'thumb',
        defaults: constant({ dom: { styles: { position: 'absolute' } } }),
        overrides(detail) {
            return {
                events: derive([
                    redirectToPart(touchstart(), detail, 'spectrum'),
                    redirectToPart(touchmove(), detail, 'spectrum'),
                    redirectToPart(touchend(), detail, 'spectrum'),
                    redirectToPart(mousedown(), detail, 'spectrum'),
                    redirectToPart(mousemove(), detail, 'spectrum'),
                    redirectToPart(mouseup(), detail, 'spectrum'),
                ]),
            };
        },
    });
    const spectrumPart = required({
        schema: [
            state$1('mouseIsDown', function() {
                return Cell(false);
            }),
        ],
        name: 'spectrum',
        overrides(detail) {
            const modelDetail = detail.model;
            const model = modelDetail.manager;
            const setValueFrom = function(component, simulatedEvent) {
                return model
                    .getValueFromEvent(simulatedEvent)
                    .map(function(value) {
                        return model.setValueFrom(component, detail, value);
                    });
            };
            return {
                behaviours: derive$1([
                    Keying.config({
                        mode: 'special',
                        onLeft(spectrum) {
                            return model.onLeft(spectrum, detail);
                        },
                        onRight(spectrum) {
                            return model.onRight(spectrum, detail);
                        },
                        onUp(spectrum) {
                            return model.onUp(spectrum, detail);
                        },
                        onDown(spectrum) {
                            return model.onDown(spectrum, detail);
                        },
                    }),
                    Focusing.config({}),
                ]),
                events: derive([
                    run(touchstart(), setValueFrom),
                    run(touchmove(), setValueFrom),
                    run(mousedown(), setValueFrom),
                    run(mousemove(), function(spectrum, se) {
                        if (detail.mouseIsDown.get()) {
                            setValueFrom(spectrum, se);
                        }
                    }),
                ]),
            };
        },
    });
    const SliderParts = [
        labelPart,
        ledgePart,
        redgePart,
        tedgePart,
        bedgePart,
        tlEdgePart,
        trEdgePart,
        blEdgePart,
        brEdgePart,
        thumbPart,
        spectrumPart,
    ];

    const onLoad$1 = function(component, repConfig, repState) {
        repConfig.store.manager.onLoad(component, repConfig, repState);
    };
    const onUnload = function(component, repConfig, repState) {
        repConfig.store.manager.onUnload(component, repConfig, repState);
    };
    const setValue = function(component, repConfig, repState, data) {
        repConfig.store.manager.setValue(component, repConfig, repState, data);
    };
    const getValue = function(component, repConfig, repState) {
        return repConfig.store.manager.getValue(component, repConfig, repState);
    };
    const getState = function(component, repConfig, repState) {
        return repState;
    };

    const RepresentApis = /* #__PURE__ */ Object.freeze({
        onLoad: onLoad$1,
        onUnload,
        setValue,
        getValue,
        getState,
    });

    const events$5 = function(repConfig, repState) {
        const es = repConfig.resetOnDom
            ? [
                  runOnAttached(function(comp, se) {
                      onLoad$1(comp, repConfig, repState);
                  }),
                  runOnDetached(function(comp, se) {
                      onUnload(comp, repConfig, repState);
                  }),
              ]
            : [loadEvent(repConfig, repState, onLoad$1)];
        return derive(es);
    };

    const ActiveRepresenting = /* #__PURE__ */ Object.freeze({
        events: events$5,
    });

    const memory = function() {
        const data = Cell(null);
        const readState = function() {
            return {
                mode: 'memory',
                value: data.get(),
            };
        };
        const isNotSet = function() {
            return data.get() === null;
        };
        const clear = function() {
            data.set(null);
        };
        return nu$6({
            set: data.set,
            get: data.get,
            isNotSet,
            clear,
            readState,
        });
    };
    const manual = function() {
        const readState = function() {};
        return nu$6({ readState });
    };
    const dataset = function() {
        const dataByValue = Cell({});
        const dataByText = Cell({});
        const readState = function() {
            return {
                mode: 'dataset',
                dataByValue: dataByValue.get(),
                dataByText: dataByText.get(),
            };
        };
        const clear = function() {
            dataByValue.set({});
            dataByText.set({});
        };
        const lookup = function(itemString) {
            return readOptFrom$1(dataByValue.get(), itemString).orThunk(
                function() {
                    return readOptFrom$1(dataByText.get(), itemString);
                },
            );
        };
        const update = function(items) {
            const currentDataByValue = dataByValue.get();
            const currentDataByText = dataByText.get();
            const newDataByValue = {};
            const newDataByText = {};
            each$1(items, function(item) {
                newDataByValue[item.value] = item;
                readOptFrom$1(item, 'meta').each(function(meta) {
                    readOptFrom$1(meta, 'text').each(function(text) {
                        newDataByText[text] = item;
                    });
                });
            });
            dataByValue.set({ ...currentDataByValue, ...newDataByValue });
            dataByText.set({ ...currentDataByText, ...newDataByText });
        };
        return nu$6({
            readState,
            lookup,
            update,
            clear,
        });
    };
    const init$1 = function(spec) {
        return spec.store.manager.state(spec);
    };

    const RepresentState = /* #__PURE__ */ Object.freeze({
        memory,
        dataset,
        manual,
        init: init$1,
    });

    const setValue$1 = function(component, repConfig, repState, data) {
        const { store } = repConfig;
        repState.update([data]);
        store.setValue(component, data);
        repConfig.onSetValue(component, data);
    };
    const getValue$1 = function(component, repConfig, repState) {
        const { store } = repConfig;
        const key = store.getDataKey(component);
        return repState.lookup(key).fold(
            function() {
                return store.getFallbackEntry(key);
            },
            function(data) {
                return data;
            },
        );
    };
    const onLoad$2 = function(component, repConfig, repState) {
        const { store } = repConfig;
        store.initialValue.each(function(data) {
            setValue$1(component, repConfig, repState, data);
        });
    };
    const onUnload$1 = function(component, repConfig, repState) {
        repState.clear();
    };
    const DatasetStore = [
        option('initialValue'),
        strict$1('getFallbackEntry'),
        strict$1('getDataKey'),
        strict$1('setValue'),
        output('manager', {
            setValue: setValue$1,
            getValue: getValue$1,
            onLoad: onLoad$2,
            onUnload: onUnload$1,
            state: dataset,
        }),
    ];

    const getValue$2 = function(component, repConfig, repState) {
        return repConfig.store.getValue(component);
    };
    const setValue$2 = function(component, repConfig, repState, data) {
        repConfig.store.setValue(component, data);
        repConfig.onSetValue(component, data);
    };
    const onLoad$3 = function(component, repConfig, repState) {
        repConfig.store.initialValue.each(function(data) {
            repConfig.store.setValue(component, data);
        });
    };
    const ManualStore = [
        strict$1('getValue'),
        defaulted$1('setValue', noop),
        option('initialValue'),
        output('manager', {
            setValue: setValue$2,
            getValue: getValue$2,
            onLoad: onLoad$3,
            onUnload: noop,
            state: NoState.init,
        }),
    ];

    const setValue$3 = function(component, repConfig, repState, data) {
        repState.set(data);
        repConfig.onSetValue(component, data);
    };
    const getValue$3 = function(component, repConfig, repState) {
        return repState.get();
    };
    const onLoad$4 = function(component, repConfig, repState) {
        repConfig.store.initialValue.each(function(initVal) {
            if (repState.isNotSet()) {
                repState.set(initVal);
            }
        });
    };
    const onUnload$2 = function(component, repConfig, repState) {
        repState.clear();
    };
    const MemoryStore = [
        option('initialValue'),
        output('manager', {
            setValue: setValue$3,
            getValue: getValue$3,
            onLoad: onLoad$4,
            onUnload: onUnload$2,
            state: memory,
        }),
    ];

    const RepresentSchema = [
        defaultedOf(
            'store',
            { mode: 'memory' },
            choose$1('mode', {
                memory: MemoryStore,
                manual: ManualStore,
                dataset: DatasetStore,
            }),
        ),
        onHandler('onSetValue'),
        defaulted$1('resetOnDom', false),
    ];

    var Representing = create$1({
        fields: RepresentSchema,
        name: 'representing',
        active: ActiveRepresenting,
        apis: RepresentApis,
        extra: {
            setValueFrom(component, source) {
                const value = Representing.getValue(source);
                Representing.setValue(component, value);
            },
        },
        state: RepresentState,
    });

    const api$1 = Dimension('width', function(element) {
        return element.dom().offsetWidth;
    });
    const set$4 = function(element, h) {
        api$1.set(element, h);
    };
    const get$6 = function(element) {
        return api$1.get(element);
    };

    var r = function(left, top) {
        const translate = function(x, y) {
            return r(left + x, top + y);
        };
        return {
            left: constant(left),
            top: constant(top),
            translate,
        };
    };
    const Position = r;

    const _sliderChangeEvent = 'slider.change.value';
    const sliderChangeEvent = constant(_sliderChangeEvent);
    const isTouchEvent = function(evt) {
        return evt.type.indexOf('touch') !== -1;
    };
    const getEventSource = function(simulatedEvent) {
        const evt = simulatedEvent.event().raw();
        if (isTouchEvent(evt)) {
            const touchEvent = evt;
            return touchEvent.touches !== undefined &&
                touchEvent.touches.length === 1
                ? Option.some(touchEvent.touches[0]).map(function(t) {
                      return Position(t.clientX, t.clientY);
                  })
                : Option.none();
        }
        const mouseEvent = evt;
        return mouseEvent.clientX !== undefined
            ? Option.some(mouseEvent).map(function(me) {
                  return Position(me.clientX, me.clientY);
              })
            : Option.none();
    };

    const t = 'top';
    const r$1 = 'right';
    const b = 'bottom';
    const l = 'left';
    const minX = function(detail) {
        return detail.model.minX;
    };
    const minY = function(detail) {
        return detail.model.minY;
    };
    const min1X = function(detail) {
        return detail.model.minX - 1;
    };
    const min1Y = function(detail) {
        return detail.model.minY - 1;
    };
    const maxX = function(detail) {
        return detail.model.maxX;
    };
    const maxY = function(detail) {
        return detail.model.maxY;
    };
    const max1X = function(detail) {
        return detail.model.maxX + 1;
    };
    const max1Y = function(detail) {
        return detail.model.maxY + 1;
    };
    const range = function(detail, max, min) {
        return max(detail) - min(detail);
    };
    const xRange = function(detail) {
        return range(detail, maxX, minX);
    };
    const yRange = function(detail) {
        return range(detail, maxY, minY);
    };
    const halfX = function(detail) {
        return xRange(detail) / 2;
    };
    const halfY = function(detail) {
        return yRange(detail) / 2;
    };
    const step = function(detail) {
        return detail.stepSize;
    };
    const snap = function(detail) {
        return detail.snapToGrid;
    };
    const snapStart = function(detail) {
        return detail.snapStart;
    };
    const rounded = function(detail) {
        return detail.rounded;
    };
    const hasEdge = function(detail, edgeName) {
        return detail[`${edgeName}-edge`] !== undefined;
    };
    const hasLEdge = function(detail) {
        return hasEdge(detail, l);
    };
    const hasREdge = function(detail) {
        return hasEdge(detail, r$1);
    };
    const hasTEdge = function(detail) {
        return hasEdge(detail, t);
    };
    const hasBEdge = function(detail) {
        return hasEdge(detail, b);
    };
    const currentValue = function(detail) {
        return detail.model.value.get();
    };

    const xValue = function(x) {
        return { x: constant(x) };
    };
    const yValue = function(y) {
        return { y: constant(y) };
    };
    const xyValue = function(x, y) {
        return {
            x: constant(x),
            y: constant(y),
        };
    };
    const fireSliderChange = function(component, value) {
        emitWith(component, sliderChangeEvent(), { value });
    };
    const setToTLEdgeXY = function(edge, detail) {
        fireSliderChange(edge, xyValue(min1X(detail), min1Y(detail)));
    };
    const setToTEdge = function(edge, detail) {
        fireSliderChange(edge, yValue(min1Y(detail)));
    };
    const setToTEdgeXY = function(edge, detail) {
        fireSliderChange(edge, xyValue(halfX(detail), min1Y(detail)));
    };
    const setToTREdgeXY = function(edge, detail) {
        fireSliderChange(edge, xyValue(max1X(detail), min1Y(detail)));
    };
    const setToREdge = function(edge, detail) {
        fireSliderChange(edge, xValue(max1X(detail)));
    };
    const setToREdgeXY = function(edge, detail) {
        fireSliderChange(edge, xyValue(max1X(detail), halfY(detail)));
    };
    const setToBREdgeXY = function(edge, detail) {
        fireSliderChange(edge, xyValue(max1X(detail), max1Y(detail)));
    };
    const setToBEdge = function(edge, detail) {
        fireSliderChange(edge, yValue(max1Y(detail)));
    };
    const setToBEdgeXY = function(edge, detail) {
        fireSliderChange(edge, xyValue(halfX(detail), max1Y(detail)));
    };
    const setToBLEdgeXY = function(edge, detail) {
        fireSliderChange(edge, xyValue(min1X(detail), max1Y(detail)));
    };
    const setToLEdge = function(edge, detail) {
        fireSliderChange(edge, xValue(min1X(detail)));
    };
    const setToLEdgeXY = function(edge, detail) {
        fireSliderChange(edge, xyValue(min1X(detail), halfY(detail)));
    };

    const reduceBy = function(value, min, max, step) {
        if (value < min) {
            return value;
        }
        if (value > max) {
            return max;
        }
        if (value === min) {
            return min - 1;
        }
        return Math.max(min, value - step);
    };
    const increaseBy = function(value, min, max, step) {
        if (value > max) {
            return value;
        }
        if (value < min) {
            return min;
        }
        if (value === max) {
            return max + 1;
        }
        return Math.min(max, value + step);
    };
    const capValue = function(value, min, max) {
        return Math.max(min, Math.min(max, value));
    };
    const snapValueOf = function(value, min, max, step, snapStart) {
        return snapStart.fold(
            function() {
                const initValue = value - min;
                const extraValue = Math.round(initValue / step) * step;
                return capValue(min + extraValue, min - 1, max + 1);
            },
            function(start) {
                const remainder = (value - start) % step;
                const adjustment = Math.round(remainder / step);
                const rawSteps = Math.floor((value - start) / step);
                const maxSteps = Math.floor((max - start) / step);
                const numSteps = Math.min(maxSteps, rawSteps + adjustment);
                const r = start + numSteps * step;
                return Math.max(start, r);
            },
        );
    };
    const findOffsetOf = function(value, min, max) {
        return Math.min(max, Math.max(value, min)) - min;
    };
    const findValueOf = function(args) {
        const { min } = args;
        const { max } = args;
        const { range } = args;
        const { value } = args;
        const { step } = args;
        const { snap } = args;
        const { snapStart } = args;
        const { rounded } = args;
        const { hasMinEdge } = args;
        const { hasMaxEdge } = args;
        const { minBound } = args;
        const { maxBound } = args;
        const { screenRange } = args;
        const capMin = hasMinEdge ? min - 1 : min;
        const capMax = hasMaxEdge ? max + 1 : max;
        if (value < minBound) {
            return capMin;
        }
        if (value > maxBound) {
            return capMax;
        }
        const offset = findOffsetOf(value, minBound, maxBound);
        const newValue = capValue(
            (offset / screenRange) * range + min,
            capMin,
            capMax,
        );
        if (snap && newValue >= min && newValue <= max) {
            return snapValueOf(newValue, min, max, step, snapStart);
        }
        if (rounded) {
            return Math.round(newValue);
        }
        return newValue;
    };
    const findOffsetOfValue = function(args) {
        const { min } = args;
        const { max } = args;
        const { range } = args;
        const { value } = args;
        const { hasMinEdge } = args;
        const { hasMaxEdge } = args;
        const { maxBound } = args;
        const { maxOffset } = args;
        const { centerMinEdge } = args;
        const { centerMaxEdge } = args;
        if (value < min) {
            return hasMinEdge ? 0 : centerMinEdge;
        }
        if (value > max) {
            return hasMaxEdge ? maxBound : centerMaxEdge;
        }
        return ((value - min) / range) * maxOffset;
    };

    const top = 'top';
    const right = 'right';
    const bottom = 'bottom';
    const left = 'left';
    const width = 'width';
    const height = 'height';
    const getBounds = function(component) {
        return component
            .element()
            .dom()
            .getBoundingClientRect();
    };
    const getBoundsProperty = function(bounds, property) {
        return bounds[property];
    };
    const getMinXBounds = function(component) {
        const bounds = getBounds(component);
        return getBoundsProperty(bounds, left);
    };
    const getMaxXBounds = function(component) {
        const bounds = getBounds(component);
        return getBoundsProperty(bounds, right);
    };
    const getMinYBounds = function(component) {
        const bounds = getBounds(component);
        return getBoundsProperty(bounds, top);
    };
    const getMaxYBounds = function(component) {
        const bounds = getBounds(component);
        return getBoundsProperty(bounds, bottom);
    };
    const getXScreenRange = function(component) {
        const bounds = getBounds(component);
        return getBoundsProperty(bounds, width);
    };
    const getYScreenRange = function(component) {
        const bounds = getBounds(component);
        return getBoundsProperty(bounds, height);
    };
    const getCenterOffsetOf = function(
        componentMinEdge,
        componentMaxEdge,
        spectrumMinEdge,
    ) {
        return (componentMinEdge + componentMaxEdge) / 2 - spectrumMinEdge;
    };
    const getXCenterOffSetOf = function(component, spectrum) {
        const componentBounds = getBounds(component);
        const spectrumBounds = getBounds(spectrum);
        const componentMinEdge = getBoundsProperty(componentBounds, left);
        const componentMaxEdge = getBoundsProperty(componentBounds, right);
        const spectrumMinEdge = getBoundsProperty(spectrumBounds, left);
        return getCenterOffsetOf(
            componentMinEdge,
            componentMaxEdge,
            spectrumMinEdge,
        );
    };
    const getYCenterOffSetOf = function(component, spectrum) {
        const componentBounds = getBounds(component);
        const spectrumBounds = getBounds(spectrum);
        const componentMinEdge = getBoundsProperty(componentBounds, top);
        const componentMaxEdge = getBoundsProperty(componentBounds, bottom);
        const spectrumMinEdge = getBoundsProperty(spectrumBounds, top);
        return getCenterOffsetOf(
            componentMinEdge,
            componentMaxEdge,
            spectrumMinEdge,
        );
    };

    const fireSliderChange$1 = function(spectrum, value) {
        emitWith(spectrum, sliderChangeEvent(), { value });
    };
    const sliderValue = function(x) {
        return { x: constant(x) };
    };
    const findValueOfOffset = function(spectrum, detail, left) {
        const args = {
            min: minX(detail),
            max: maxX(detail),
            range: xRange(detail),
            value: left,
            step: step(detail),
            snap: snap(detail),
            snapStart: snapStart(detail),
            rounded: rounded(detail),
            hasMinEdge: hasLEdge(detail),
            hasMaxEdge: hasREdge(detail),
            minBound: getMinXBounds(spectrum),
            maxBound: getMaxXBounds(spectrum),
            screenRange: getXScreenRange(spectrum),
        };
        return findValueOf(args);
    };
    const setValueFrom = function(spectrum, detail, value) {
        const xValue = findValueOfOffset(spectrum, detail, value);
        const sliderVal = sliderValue(xValue);
        fireSliderChange$1(spectrum, sliderVal);
        return xValue;
    };
    const setToMin = function(spectrum, detail) {
        const min = minX(detail);
        fireSliderChange$1(spectrum, sliderValue(min));
    };
    const setToMax = function(spectrum, detail) {
        const max = maxX(detail);
        fireSliderChange$1(spectrum, sliderValue(max));
    };
    const moveBy = function(direction, spectrum, detail) {
        const f = direction > 0 ? increaseBy : reduceBy;
        const xValue = f(
            currentValue(detail).x(),
            minX(detail),
            maxX(detail),
            step(detail),
        );
        fireSliderChange$1(spectrum, sliderValue(xValue));
        return Option.some(xValue);
    };
    const handleMovement = function(direction) {
        return function(spectrum, detail) {
            return moveBy(direction, spectrum, detail).map(function() {
                return true;
            });
        };
    };
    const getValueFromEvent = function(simulatedEvent) {
        const pos = getEventSource(simulatedEvent);
        return pos.map(function(p) {
            return p.left();
        });
    };
    const findOffsetOfValue$1 = function(
        spectrum,
        detail,
        value,
        minEdge,
        maxEdge,
    ) {
        const minOffset = 0;
        const maxOffset = getXScreenRange(spectrum);
        const centerMinEdge = minEdge
            .bind(function(edge) {
                return Option.some(getXCenterOffSetOf(edge, spectrum));
            })
            .getOr(minOffset);
        const centerMaxEdge = maxEdge
            .bind(function(edge) {
                return Option.some(getXCenterOffSetOf(edge, spectrum));
            })
            .getOr(maxOffset);
        const args = {
            min: minX(detail),
            max: maxX(detail),
            range: xRange(detail),
            value,
            hasMinEdge: hasLEdge(detail),
            hasMaxEdge: hasREdge(detail),
            minBound: getMinXBounds(spectrum),
            minOffset,
            maxBound: getMaxXBounds(spectrum),
            maxOffset,
            centerMinEdge,
            centerMaxEdge,
        };
        return findOffsetOfValue(args);
    };
    const findPositionOfValue = function(
        slider,
        spectrum,
        value,
        minEdge,
        maxEdge,
        detail,
    ) {
        const offset = findOffsetOfValue$1(
            spectrum,
            detail,
            value,
            minEdge,
            maxEdge,
        );
        return getMinXBounds(spectrum) - getMinXBounds(slider) + offset;
    };
    const setPositionFromValue = function(slider, thumb, detail, edges) {
        const value = currentValue(detail);
        const pos = findPositionOfValue(
            slider,
            edges.getSpectrum(slider),
            value.x(),
            edges.getLeftEdge(slider),
            edges.getRightEdge(slider),
            detail,
        );
        const thumbRadius = get$6(thumb.element()) / 2;
        set$3(thumb.element(), 'left', `${pos - thumbRadius}px`);
    };
    const onLeft = handleMovement(-1);
    const onRight = handleMovement(1);
    const onUp = Option.none;
    const onDown = Option.none;
    const edgeActions = {
        'top-left': Option.none(),
        top: Option.none(),
        'top-right': Option.none(),
        right: Option.some(setToREdge),
        'bottom-right': Option.none(),
        bottom: Option.none(),
        'bottom-left': Option.none(),
        left: Option.some(setToLEdge),
    };

    const HorizontalModel = /* #__PURE__ */ Object.freeze({
        setValueFrom,
        setToMin,
        setToMax,
        findValueOfOffset,
        getValueFromEvent,
        findPositionOfValue,
        setPositionFromValue,
        onLeft,
        onRight,
        onUp,
        onDown,
        edgeActions,
    });

    const fireSliderChange$2 = function(spectrum, value) {
        emitWith(spectrum, sliderChangeEvent(), { value });
    };
    const sliderValue$1 = function(y) {
        return { y: constant(y) };
    };
    const findValueOfOffset$1 = function(spectrum, detail, top) {
        const args = {
            min: minY(detail),
            max: maxY(detail),
            range: yRange(detail),
            value: top,
            step: step(detail),
            snap: snap(detail),
            snapStart: snapStart(detail),
            rounded: rounded(detail),
            hasMinEdge: hasTEdge(detail),
            hasMaxEdge: hasBEdge(detail),
            minBound: getMinYBounds(spectrum),
            maxBound: getMaxYBounds(spectrum),
            screenRange: getYScreenRange(spectrum),
        };
        return findValueOf(args);
    };
    const setValueFrom$1 = function(spectrum, detail, value) {
        const yValue = findValueOfOffset$1(spectrum, detail, value);
        const sliderVal = sliderValue$1(yValue);
        fireSliderChange$2(spectrum, sliderVal);
        return yValue;
    };
    const setToMin$1 = function(spectrum, detail) {
        const min = minY(detail);
        fireSliderChange$2(spectrum, sliderValue$1(min));
    };
    const setToMax$1 = function(spectrum, detail) {
        const max = maxY(detail);
        fireSliderChange$2(spectrum, sliderValue$1(max));
    };
    const moveBy$1 = function(direction, spectrum, detail) {
        const f = direction > 0 ? increaseBy : reduceBy;
        const yValue = f(
            currentValue(detail).y(),
            minY(detail),
            maxY(detail),
            step(detail),
        );
        fireSliderChange$2(spectrum, sliderValue$1(yValue));
        return Option.some(yValue);
    };
    const handleMovement$1 = function(direction) {
        return function(spectrum, detail) {
            return moveBy$1(direction, spectrum, detail).map(function() {
                return true;
            });
        };
    };
    const getValueFromEvent$1 = function(simulatedEvent) {
        const pos = getEventSource(simulatedEvent);
        return pos.map(function(p) {
            return p.top();
        });
    };
    const findOffsetOfValue$2 = function(
        spectrum,
        detail,
        value,
        minEdge,
        maxEdge,
    ) {
        const minOffset = 0;
        const maxOffset = getYScreenRange(spectrum);
        const centerMinEdge = minEdge
            .bind(function(edge) {
                return Option.some(getYCenterOffSetOf(edge, spectrum));
            })
            .getOr(minOffset);
        const centerMaxEdge = maxEdge
            .bind(function(edge) {
                return Option.some(getYCenterOffSetOf(edge, spectrum));
            })
            .getOr(maxOffset);
        const args = {
            min: minY(detail),
            max: maxY(detail),
            range: yRange(detail),
            value,
            hasMinEdge: hasTEdge(detail),
            hasMaxEdge: hasBEdge(detail),
            minBound: getMinYBounds(spectrum),
            minOffset,
            maxBound: getMaxYBounds(spectrum),
            maxOffset,
            centerMinEdge,
            centerMaxEdge,
        };
        return findOffsetOfValue(args);
    };
    const findPositionOfValue$1 = function(
        slider,
        spectrum,
        value,
        minEdge,
        maxEdge,
        detail,
    ) {
        const offset = findOffsetOfValue$2(
            spectrum,
            detail,
            value,
            minEdge,
            maxEdge,
        );
        return getMinYBounds(spectrum) - getMinYBounds(slider) + offset;
    };
    const setPositionFromValue$1 = function(slider, thumb, detail, edges) {
        const value = currentValue(detail);
        const pos = findPositionOfValue$1(
            slider,
            edges.getSpectrum(slider),
            value.y(),
            edges.getTopEdge(slider),
            edges.getBottomEdge(slider),
            detail,
        );
        const thumbRadius = get$4(thumb.element()) / 2;
        set$3(thumb.element(), 'top', `${pos - thumbRadius}px`);
    };
    const onLeft$1 = Option.none;
    const onRight$1 = Option.none;
    const onUp$1 = handleMovement$1(-1);
    const onDown$1 = handleMovement$1(1);
    const edgeActions$1 = {
        'top-left': Option.none(),
        top: Option.some(setToTEdge),
        'top-right': Option.none(),
        right: Option.none(),
        'bottom-right': Option.none(),
        bottom: Option.some(setToBEdge),
        'bottom-left': Option.none(),
        left: Option.none(),
    };

    const VerticalModel = /* #__PURE__ */ Object.freeze({
        setValueFrom: setValueFrom$1,
        setToMin: setToMin$1,
        setToMax: setToMax$1,
        findValueOfOffset: findValueOfOffset$1,
        getValueFromEvent: getValueFromEvent$1,
        findPositionOfValue: findPositionOfValue$1,
        setPositionFromValue: setPositionFromValue$1,
        onLeft: onLeft$1,
        onRight: onRight$1,
        onUp: onUp$1,
        onDown: onDown$1,
        edgeActions: edgeActions$1,
    });

    const fireSliderChange$3 = function(spectrum, value) {
        emitWith(spectrum, sliderChangeEvent(), { value });
    };
    const sliderValue$2 = function(x, y) {
        return {
            x: constant(x),
            y: constant(y),
        };
    };
    const setValueFrom$2 = function(spectrum, detail, value) {
        const xValue = findValueOfOffset(spectrum, detail, value.left());
        const yValue = findValueOfOffset$1(spectrum, detail, value.top());
        const val = sliderValue$2(xValue, yValue);
        fireSliderChange$3(spectrum, val);
        return val;
    };
    const moveBy$2 = function(direction, isVerticalMovement, spectrum, detail) {
        const f = direction > 0 ? increaseBy : reduceBy;
        const xValue = isVerticalMovement
            ? currentValue(detail).x()
            : f(
                  currentValue(detail).x(),
                  minX(detail),
                  maxX(detail),
                  step(detail),
              );
        const yValue = !isVerticalMovement
            ? currentValue(detail).y()
            : f(
                  currentValue(detail).y(),
                  minY(detail),
                  maxY(detail),
                  step(detail),
              );
        fireSliderChange$3(spectrum, sliderValue$2(xValue, yValue));
        return Option.some(xValue);
    };
    const handleMovement$2 = function(direction, isVerticalMovement) {
        return function(spectrum, detail) {
            return moveBy$2(
                direction,
                isVerticalMovement,
                spectrum,
                detail,
            ).map(function() {
                return true;
            });
        };
    };
    const setToMin$2 = function(spectrum, detail) {
        const mX = minX(detail);
        const mY = minY(detail);
        fireSliderChange$3(spectrum, sliderValue$2(mX, mY));
    };
    const setToMax$2 = function(spectrum, detail) {
        const mX = maxX(detail);
        const mY = maxY(detail);
        fireSliderChange$3(spectrum, sliderValue$2(mX, mY));
    };
    const getValueFromEvent$2 = function(simulatedEvent) {
        return getEventSource(simulatedEvent);
    };
    const setPositionFromValue$2 = function(slider, thumb, detail, edges) {
        const value = currentValue(detail);
        const xPos = findPositionOfValue(
            slider,
            edges.getSpectrum(slider),
            value.x(),
            edges.getLeftEdge(slider),
            edges.getRightEdge(slider),
            detail,
        );
        const yPos = findPositionOfValue$1(
            slider,
            edges.getSpectrum(slider),
            value.y(),
            edges.getTopEdge(slider),
            edges.getBottomEdge(slider),
            detail,
        );
        const thumbXRadius = get$6(thumb.element()) / 2;
        const thumbYRadius = get$4(thumb.element()) / 2;
        set$3(thumb.element(), 'left', `${xPos - thumbXRadius}px`);
        set$3(thumb.element(), 'top', `${yPos - thumbYRadius}px`);
    };
    const onLeft$2 = handleMovement$2(-1, false);
    const onRight$2 = handleMovement$2(1, false);
    const onUp$2 = handleMovement$2(-1, true);
    const onDown$2 = handleMovement$2(1, true);
    const edgeActions$2 = {
        'top-left': Option.some(setToTLEdgeXY),
        top: Option.some(setToTEdgeXY),
        'top-right': Option.some(setToTREdgeXY),
        right: Option.some(setToREdgeXY),
        'bottom-right': Option.some(setToBREdgeXY),
        bottom: Option.some(setToBEdgeXY),
        'bottom-left': Option.some(setToBLEdgeXY),
        left: Option.some(setToLEdgeXY),
    };

    const TwoDModel = /* #__PURE__ */ Object.freeze({
        setValueFrom: setValueFrom$2,
        setToMin: setToMin$2,
        setToMax: setToMax$2,
        getValueFromEvent: getValueFromEvent$2,
        setPositionFromValue: setPositionFromValue$2,
        onLeft: onLeft$2,
        onRight: onRight$2,
        onUp: onUp$2,
        onDown: onDown$2,
        edgeActions: edgeActions$2,
    });

    const SliderSchema = [
        defaulted$1('stepSize', 1),
        defaulted$1('onChange', noop),
        defaulted$1('onChoose', noop),
        defaulted$1('onInit', noop),
        defaulted$1('onDragStart', noop),
        defaulted$1('onDragEnd', noop),
        defaulted$1('snapToGrid', false),
        defaulted$1('rounded', true),
        option('snapStart'),
        strictOf(
            'model',
            choose$1('mode', {
                x: [
                    defaulted$1('minX', 0),
                    defaulted$1('maxX', 100),
                    state$1('value', function(spec) {
                        return Cell(spec.mode.minX);
                    }),
                    strict$1('getInitialValue'),
                    output('manager', HorizontalModel),
                ],
                y: [
                    defaulted$1('minY', 0),
                    defaulted$1('maxY', 100),
                    state$1('value', function(spec) {
                        return Cell(spec.mode.minY);
                    }),
                    strict$1('getInitialValue'),
                    output('manager', VerticalModel),
                ],
                xy: [
                    defaulted$1('minX', 0),
                    defaulted$1('maxX', 100),
                    defaulted$1('minY', 0),
                    defaulted$1('maxY', 100),
                    state$1('value', function(spec) {
                        return Cell({
                            x: constant(spec.mode.minX),
                            y: constant(spec.mode.minY),
                        });
                    }),
                    strict$1('getInitialValue'),
                    output('manager', TwoDModel),
                ],
            }),
        ),
        field$1('sliderBehaviours', [Keying, Representing]),
        state$1('mouseIsDown', function() {
            return Cell(false);
        }),
    ];

    const mouseReleased = constant('mouse.released');

    const sketch = function(detail, components, _spec, _externals) {
        let _a;
        const getThumb = function(component) {
            return getPartOrDie(component, detail, 'thumb');
        };
        const getSpectrum = function(component) {
            return getPartOrDie(component, detail, 'spectrum');
        };
        const getLeftEdge = function(component) {
            return getPart(component, detail, 'left-edge');
        };
        const getRightEdge = function(component) {
            return getPart(component, detail, 'right-edge');
        };
        const getTopEdge = function(component) {
            return getPart(component, detail, 'top-edge');
        };
        const getBottomEdge = function(component) {
            return getPart(component, detail, 'bottom-edge');
        };
        const modelDetail = detail.model;
        const model = modelDetail.manager;
        const refresh = function(slider, thumb) {
            model.setPositionFromValue(slider, thumb, detail, {
                getLeftEdge,
                getRightEdge,
                getTopEdge,
                getBottomEdge,
                getSpectrum,
            });
        };
        const changeValue = function(slider, newValue) {
            modelDetail.value.set(newValue);
            const thumb = getThumb(slider);
            refresh(slider, thumb);
            detail.onChange(slider, thumb, newValue);
            return Option.some(true);
        };
        const resetToMin = function(slider) {
            model.setToMin(slider, detail);
        };
        const resetToMax = function(slider) {
            model.setToMax(slider, detail);
        };
        const choose = function(slider) {
            const fireOnChoose = function() {
                getPart(slider, detail, 'thumb').each(function(thumb) {
                    const value = modelDetail.value.get();
                    detail.onChoose(slider, thumb, value);
                });
            };
            const wasDown = detail.mouseIsDown.get();
            detail.mouseIsDown.set(false);
            if (wasDown) {
                fireOnChoose();
            }
        };
        const onDragStart = function(slider, simulatedEvent) {
            simulatedEvent.stop();
            detail.mouseIsDown.set(true);
            detail.onDragStart(slider, getThumb(slider));
        };
        const onDragEnd = function(slider, simulatedEvent) {
            simulatedEvent.stop();
            detail.onDragEnd(slider, getThumb(slider));
            choose(slider);
        };
        return {
            uid: detail.uid,
            dom: detail.dom,
            components,
            behaviours: augment(detail.sliderBehaviours, [
                Keying.config({
                    mode: 'special',
                    focusIn(slider) {
                        return getPart(slider, detail, 'spectrum')
                            .map(Keying.focusIn)
                            .map(constant(true));
                    },
                }),
                Representing.config({
                    store: {
                        mode: 'manual',
                        getValue(_) {
                            return modelDetail.value.get();
                        },
                    },
                }),
                Receiving.config({
                    channels:
                        ((_a = {}),
                        (_a[mouseReleased()] = { onReceive: choose }),
                        _a),
                }),
            ]),
            events: derive([
                run(sliderChangeEvent(), function(slider, simulatedEvent) {
                    changeValue(slider, simulatedEvent.event().value());
                }),
                runOnAttached(function(slider, simulatedEvent) {
                    const getInitial = modelDetail.getInitialValue();
                    modelDetail.value.set(getInitial);
                    const thumb = getThumb(slider);
                    refresh(slider, thumb);
                    const spectrum = getSpectrum(slider);
                    detail.onInit(
                        slider,
                        thumb,
                        spectrum,
                        modelDetail.value.get(),
                    );
                }),
                run(touchstart(), onDragStart),
                run(touchend(), onDragEnd),
                run(mousedown(), onDragStart),
                run(mouseup(), onDragEnd),
            ]),
            apis: {
                resetToMin,
                resetToMax,
                changeValue,
                refresh,
            },
            domModification: { styles: { position: 'relative' } },
        };
    };

    const Slider = composite$1({
        name: 'Slider',
        configFields: SliderSchema,
        partFields: SliderParts,
        factory: sketch,
        apis: {
            resetToMin(apis, slider) {
                apis.resetToMin(slider);
            },
            resetToMax(apis, slider) {
                apis.resetToMax(slider);
            },
            refresh(apis, slider) {
                apis.refresh(slider);
            },
        },
    });

    const button = function(realm, clazz, makeItems, editor) {
        return Buttons.forToolbar(
            clazz,
            function() {
                const items = makeItems();
                realm.setContextToolbar([
                    {
                        label: `${clazz} group`,
                        items,
                    },
                ]);
            },
            {},
            editor,
        );
    };

    const BLACK = -1;
    const makeSlider = function(spec$1) {
        const getColor = function(hue) {
            if (hue < 0) {
                return 'black';
            }
            if (hue > 360) {
                return 'white';
            }
            return `hsl(${hue}, 100%, 50%)`;
        };
        const onInit = function(slider, thumb, spectrum, value) {
            const color = getColor(value.x());
            set$3(thumb.element(), 'background-color', color);
        };
        const onChange = function(slider, thumb, value) {
            const color = getColor(value.x());
            set$3(thumb.element(), 'background-color', color);
            spec$1.onChange(slider, thumb, color);
        };
        return Slider.sketch({
            dom: dom$1(
                '<div class="${prefix}-slider ${prefix}-hue-slider-container"></div>',
            ),
            components: [
                Slider.parts()['left-edge'](
                    spec('<div class="${prefix}-hue-slider-black"></div>'),
                ),
                Slider.parts().spectrum({
                    dom: dom$1(
                        '<div class="${prefix}-slider-gradient-container"></div>',
                    ),
                    components: [
                        spec('<div class="${prefix}-slider-gradient"></div>'),
                    ],
                    behaviours: derive$1([
                        Toggling.config({
                            toggleClass: Styles.resolve('thumb-active'),
                        }),
                    ]),
                }),
                Slider.parts()['right-edge'](
                    spec('<div class="${prefix}-hue-slider-white"></div>'),
                ),
                Slider.parts().thumb({
                    dom: dom$1('<div class="${prefix}-slider-thumb"></div>'),
                    behaviours: derive$1([
                        Toggling.config({
                            toggleClass: Styles.resolve('thumb-active'),
                        }),
                    ]),
                }),
            ],
            onChange,
            onDragStart(slider, thumb) {
                Toggling.on(thumb);
            },
            onDragEnd(slider, thumb) {
                Toggling.off(thumb);
            },
            onInit,
            stepSize: 10,
            model: {
                mode: 'x',
                minX: 0,
                maxX: 360,
                getInitialValue() {
                    return {
                        x() {
                            return spec$1.getInitialValue();
                        },
                    };
                },
            },
            sliderBehaviours: derive$1([Receivers.orientation(Slider.refresh)]),
        });
    };
    const makeItems = function(spec) {
        return [makeSlider(spec)];
    };
    const sketch$1 = function(realm, editor) {
        const spec = {
            onChange(slider, thumb, color) {
                editor.undoManager.transact(function() {
                    editor.formatter.apply('forecolor', { value: color });
                    editor.nodeChanged();
                });
            },
            getInitialValue() {
                return BLACK;
            },
        };
        return button(
            realm,
            'color-levels',
            function() {
                return makeItems(spec);
            },
            editor,
        );
    };
    const ColorSlider = {
        makeItems,
        sketch: sketch$1,
    };

    const schema$7 = objOfOnly([
        strict$1('getInitialValue'),
        strict$1('onChange'),
        strict$1('category'),
        strict$1('sizes'),
    ]);
    const sketch$2 = function(rawSpec) {
        const spec$1 = asRawOrDie('SizeSlider', schema$7, rawSpec);
        const isValidValue = function(valueIndex) {
            return valueIndex >= 0 && valueIndex < spec$1.sizes.length;
        };
        const onChange = function(slider, thumb, valueIndex) {
            const index = valueIndex.x();
            if (isValidValue(index)) {
                spec$1.onChange(index);
            }
        };
        return Slider.sketch({
            dom: {
                tag: 'div',
                classes: [
                    Styles.resolve(`slider-${spec$1.category}-size-container`),
                    Styles.resolve('slider'),
                    Styles.resolve('slider-size-container'),
                ],
            },
            onChange,
            onDragStart(slider, thumb) {
                Toggling.on(thumb);
            },
            onDragEnd(slider, thumb) {
                Toggling.off(thumb);
            },
            model: {
                mode: 'x',
                minX: 0,
                maxX: spec$1.sizes.length - 1,
                getInitialValue() {
                    return {
                        x() {
                            return spec$1.getInitialValue();
                        },
                    };
                },
            },
            stepSize: 1,
            snapToGrid: true,
            sliderBehaviours: derive$1([Receivers.orientation(Slider.refresh)]),
            components: [
                Slider.parts().spectrum({
                    dom: dom$1(
                        '<div class="${prefix}-slider-size-container"></div>',
                    ),
                    components: [
                        spec('<div class="${prefix}-slider-size-line"></div>'),
                    ],
                }),
                Slider.parts().thumb({
                    dom: dom$1('<div class="${prefix}-slider-thumb"></div>'),
                    behaviours: derive$1([
                        Toggling.config({
                            toggleClass: Styles.resolve('thumb-active'),
                        }),
                    ]),
                }),
            ],
        });
    };
    const SizeSlider = { sketch: sketch$2 };

    const candidates = [
        '9px',
        '10px',
        '11px',
        '12px',
        '14px',
        '16px',
        '18px',
        '20px',
        '24px',
        '32px',
        '36px',
    ];
    const defaultSize = 'medium';
    const defaultIndex = 2;
    const indexToSize = function(index) {
        return Option.from(candidates[index]);
    };
    const sizeToIndex = function(size) {
        return findIndex(candidates, function(v) {
            return v === size;
        });
    };
    const getRawOrComputed = function(isRoot, rawStart) {
        const optStart = isElement(rawStart)
            ? Option.some(rawStart)
            : parent(rawStart).filter(isElement);
        return optStart
            .map(function(start) {
                const inline = closest(
                    start,
                    function(elem) {
                        return getRaw(elem, 'font-size').isSome();
                    },
                    isRoot,
                ).bind(function(elem) {
                    return getRaw(elem, 'font-size');
                });
                return inline.getOrThunk(function() {
                    return get$3(start, 'font-size');
                });
            })
            .getOr('');
    };
    const getSize = function(editor) {
        const node = editor.selection.getStart();
        const elem = Element.fromDom(node);
        const root = Element.fromDom(editor.getBody());
        const isRoot = function(e) {
            return eq(root, e);
        };
        const elemSize = getRawOrComputed(isRoot, elem);
        return find$2(candidates, function(size) {
            return elemSize === size;
        }).getOr(defaultSize);
    };
    const applySize = function(editor, value) {
        const currentValue = getSize(editor);
        if (currentValue !== value) {
            editor.execCommand('fontSize', false, value);
        }
    };
    const get$7 = function(editor) {
        const size = getSize(editor);
        return sizeToIndex(size).getOr(defaultIndex);
    };
    const apply$1 = function(editor, index) {
        indexToSize(index).each(function(size) {
            applySize(editor, size);
        });
    };
    const FontSizes = {
        candidates: constant(candidates),
        get: get$7,
        apply: apply$1,
    };

    const sizes = FontSizes.candidates();
    const makeSlider$1 = function(spec) {
        return SizeSlider.sketch({
            onChange: spec.onChange,
            sizes,
            category: 'font',
            getInitialValue: spec.getInitialValue,
        });
    };
    const makeItems$1 = function(spec$1) {
        return [
            spec(
                '<span class="${prefix}-toolbar-button ${prefix}-icon-small-font ${prefix}-icon"></span>',
            ),
            makeSlider$1(spec$1),
            spec(
                '<span class="${prefix}-toolbar-button ${prefix}-icon-large-font ${prefix}-icon"></span>',
            ),
        ];
    };
    const sketch$3 = function(realm, editor) {
        const spec = {
            onChange(value) {
                FontSizes.apply(editor, value);
            },
            getInitialValue() {
                return FontSizes.get(editor);
            },
        };
        return button(
            realm,
            'font-size',
            function() {
                return makeItems$1(spec);
            },
            editor,
        );
    };

    const record = function(spec) {
        const uid =
            isSketchSpec(spec) && hasKey$1(spec, 'uid')
                ? spec.uid
                : generate$3('memento');
        const get = function(anyInSystem) {
            return anyInSystem
                .getSystem()
                .getByUid(uid)
                .getOrDie();
        };
        const getOpt = function(anyInSystem) {
            return anyInSystem
                .getSystem()
                .getByUid(uid)
                .toOption();
        };
        const asSpec = function() {
            return { ...spec, uid };
        };
        return {
            get,
            getOpt,
            asSpec,
        };
    };

    const promise = function() {
        const Promise = function(fn) {
            if (typeof this !== 'object') {
                throw new TypeError('Promises must be constructed via new');
            }
            if (typeof fn !== 'function') {
                throw new TypeError('not a function');
            }
            this._state = null;
            this._value = null;
            this._deferreds = [];
            doResolve(fn, bind(resolve, this), bind(reject, this));
        };
        const asap =
            Promise.immediateFn ||
            (typeof window.setImmediate === 'function' &&
                window.setImmediate) ||
            function(fn) {
                domGlobals.setTimeout(fn, 1);
            };
        function bind(fn, thisArg) {
            return function() {
                return fn.apply(thisArg, arguments);
            };
        }
        const isArray =
            Array.isArray ||
            function(value) {
                return (
                    Object.prototype.toString.call(value) === '[object Array]'
                );
            };
        function handle(deferred) {
            const me = this;
            if (this._state === null) {
                this._deferreds.push(deferred);
                return;
            }
            asap(function() {
                const cb = me._state
                    ? deferred.onFulfilled
                    : deferred.onRejected;
                if (cb === null) {
                    (me._state ? deferred.resolve : deferred.reject)(me._value);
                    return;
                }
                let ret;
                try {
                    ret = cb(me._value);
                } catch (e) {
                    deferred.reject(e);
                    return;
                }
                deferred.resolve(ret);
            });
        }
        function resolve(newValue) {
            try {
                if (newValue === this) {
                    throw new TypeError(
                        'A promise cannot be resolved with itself.',
                    );
                }
                if (
                    newValue &&
                    (typeof newValue === 'object' ||
                        typeof newValue === 'function')
                ) {
                    const { then } = newValue;
                    if (typeof then === 'function') {
                        doResolve(
                            bind(then, newValue),
                            bind(resolve, this),
                            bind(reject, this),
                        );
                        return;
                    }
                }
                this._state = true;
                this._value = newValue;
                finale.call(this);
            } catch (e) {
                reject.call(this, e);
            }
        }
        function reject(newValue) {
            this._state = false;
            this._value = newValue;
            finale.call(this);
        }
        function finale() {
            for (let _i = 0, _a = this._deferreds; _i < _a.length; _i++) {
                const deferred = _a[_i];
                handle.call(this, deferred);
            }
            this._deferreds = [];
        }
        function Handler(onFulfilled, onRejected, resolve, reject) {
            this.onFulfilled =
                typeof onFulfilled === 'function' ? onFulfilled : null;
            this.onRejected =
                typeof onRejected === 'function' ? onRejected : null;
            this.resolve = resolve;
            this.reject = reject;
        }
        function doResolve(fn, onFulfilled, onRejected) {
            let done = false;
            try {
                fn(
                    function(value) {
                        if (done) {
                            return;
                        }
                        done = true;
                        onFulfilled(value);
                    },
                    function(reason) {
                        if (done) {
                            return;
                        }
                        done = true;
                        onRejected(reason);
                    },
                );
            } catch (ex) {
                if (done) {
                    return;
                }
                done = true;
                onRejected(ex);
            }
        }
        Promise.prototype.catch = function(onRejected) {
            return this.then(null, onRejected);
        };
        Promise.prototype.then = function(onFulfilled, onRejected) {
            const me = this;
            return new Promise(function(resolve, reject) {
                handle.call(
                    me,
                    new Handler(onFulfilled, onRejected, resolve, reject),
                );
            });
        };
        Promise.all = function() {
            const values = [];
            for (let _i = 0; _i < arguments.length; _i++) {
                values[_i] = arguments[_i];
            }
            const args = Array.prototype.slice.call(
                values.length === 1 && isArray(values[0]) ? values[0] : values,
            );
            return new Promise(function(resolve, reject) {
                if (args.length === 0) {
                    return resolve([]);
                }
                let remaining = args.length;
                function res(i, val) {
                    try {
                        if (
                            val &&
                            (typeof val === 'object' ||
                                typeof val === 'function')
                        ) {
                            const { then } = val;
                            if (typeof then === 'function') {
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
                for (let i = 0; i < args.length; i++) {
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
        Promise.reject = function(reason) {
            return new Promise(function(resolve, reject) {
                reject(reason);
            });
        };
        Promise.race = function(values) {
            return new Promise(function(resolve, reject) {
                for (
                    let _i = 0, values_1 = values;
                    _i < values_1.length;
                    _i++
                ) {
                    const value = values_1[_i];
                    value.then(resolve, reject);
                }
            });
        };
        return Promise;
    };
    const Promise = window.Promise ? window.Promise : promise();

    function blobToDataUri(blob) {
        return new Promise(function(resolve) {
            const reader = new domGlobals.FileReader();
            reader.onloadend = function() {
                resolve(reader.result);
            };
            reader.readAsDataURL(blob);
        });
    }
    function blobToBase64(blob) {
        return blobToDataUri(blob).then(function(dataUri) {
            return dataUri.split(',')[1];
        });
    }

    const blobToBase64$1 = function(blob) {
        return blobToBase64(blob);
    };

    const addImage = function(editor, blob) {
        blobToBase64$1(blob).then(function(base64) {
            editor.undoManager.transact(function() {
                const cache = editor.editorUpload.blobCache;
                const info = cache.create(generate$1('mceu'), blob, base64);
                cache.add(info);
                const img = editor.dom.createHTML('img', {
                    src: info.blobUri(),
                });
                editor.insertContent(img);
            });
        });
    };
    const extractBlob = function(simulatedEvent) {
        const event = simulatedEvent.event();
        const files =
            event.raw().target.files || event.raw().dataTransfer.files;
        return Option.from(files[0]);
    };
    const sketch$4 = function(editor) {
        const pickerDom = {
            tag: 'input',
            attributes: {
                accept: 'image/*',
                type: 'file',
                title: '',
            },
            styles: {
                visibility: 'hidden',
                position: 'absolute',
            },
        };
        const memPicker = record({
            dom: pickerDom,
            events: derive([
                cutter(click()),
                run(change(), function(picker, simulatedEvent) {
                    extractBlob(simulatedEvent).each(function(blob) {
                        addImage(editor, blob);
                    });
                }),
            ]),
        });
        return Button.sketch({
            dom: Buttons.getToolbarIconButton('image', editor),
            components: [memPicker.asSpec()],
            action(button) {
                const picker = memPicker.get(button);
                picker
                    .element()
                    .dom()
                    .click();
            },
        });
    };

    const get$8 = function(element) {
        return element.dom().textContent;
    };
    const set$5 = function(element, value) {
        element.dom().textContent = value;
    };

    const isNotEmpty = function(val) {
        return val.length > 0;
    };
    const defaultToEmpty = function(str) {
        return str === undefined || str === null ? '' : str;
    };
    const noLink = function(editor) {
        const text = editor.selection.getContent({ format: 'text' });
        return {
            url: '',
            text,
            title: '',
            target: '',
            link: Option.none(),
        };
    };
    const fromLink = function(link) {
        const text = get$8(link);
        const url = get(link, 'href');
        const title = get(link, 'title');
        const target = get(link, 'target');
        return {
            url: defaultToEmpty(url),
            text: text !== url ? defaultToEmpty(text) : '',
            title: defaultToEmpty(title),
            target: defaultToEmpty(target),
            link: Option.some(link),
        };
    };
    const getInfo = function(editor) {
        return query(editor).fold(
            function() {
                return noLink(editor);
            },
            function(link) {
                return fromLink(link);
            },
        );
    };
    const wasSimple = function(link) {
        const prevHref = get(link, 'href');
        const prevText = get$8(link);
        return prevHref === prevText;
    };
    const getTextToApply = function(link, url, info) {
        return info.text
            .toOption()
            .filter(isNotEmpty)
            .fold(function() {
                return wasSimple(link) ? Option.some(url) : Option.none();
            }, Option.some);
    };
    const unlinkIfRequired = function(editor, info) {
        const activeLink = info.link.bind(identity);
        activeLink.each(function(link) {
            editor.execCommand('unlink');
        });
    };
    const getAttrs$1 = function(url, info) {
        const attrs = {};
        attrs.href = url;
        info.title
            .toOption()
            .filter(isNotEmpty)
            .each(function(title) {
                attrs.title = title;
            });
        info.target
            .toOption()
            .filter(isNotEmpty)
            .each(function(target) {
                attrs.target = target;
            });
        return attrs;
    };
    const applyInfo = function(editor, info) {
        info.url
            .toOption()
            .filter(isNotEmpty)
            .fold(
                function() {
                    unlinkIfRequired(editor, info);
                },
                function(url) {
                    const attrs = getAttrs$1(url, info);
                    const activeLink = info.link.bind(identity);
                    activeLink.fold(
                        function() {
                            const text = info.text
                                .toOption()
                                .filter(isNotEmpty)
                                .getOr(url);
                            editor.insertContent(
                                editor.dom.createHTML(
                                    'a',
                                    attrs,
                                    editor.dom.encode(text),
                                ),
                            );
                        },
                        function(link) {
                            const text = getTextToApply(link, url, info);
                            setAll(link, attrs);
                            text.each(function(newText) {
                                set$5(link, newText);
                            });
                        },
                    );
                },
            );
    };
    var query = function(editor) {
        const start = Element.fromDom(editor.selection.getStart());
        return closest$2(start, 'a');
    };
    const LinkBridge = {
        getInfo,
        applyInfo,
        query,
    };

    const platform$1 = detect$3();
    const preserve = function(f, editor) {
        const rng = editor.selection.getRng();
        f();
        editor.selection.setRng(rng);
    };
    const forAndroid = function(editor, f) {
        const wrapper = platform$1.os.isAndroid() ? preserve : apply;
        wrapper(f, editor);
    };
    const RangePreserver = { forAndroid };

    const events$6 = function(name, eventHandlers) {
        const events = derive(eventHandlers);
        return create$1({
            fields: [strict$1('enabled')],
            name,
            active: { events: constant(events) },
        });
    };
    const config = function(name, eventHandlers) {
        const me = events$6(name, eventHandlers);
        return {
            key: name,
            value: {
                config: {},
                me,
                configAsRaw: constant({}),
                initialConfig: {},
                state: NoState,
            },
        };
    };

    const getCurrent = function(component, composeConfig, composeState) {
        return composeConfig.find(component);
    };

    const ComposeApis = /* #__PURE__ */ Object.freeze({
        getCurrent,
    });

    const ComposeSchema = [strict$1('find')];

    const Composing = create$1({
        fields: ComposeSchema,
        name: 'composing',
        apis: ComposeApis,
    });

    const factory$1 = function(detail) {
        const _a = detail.dom;
        const { attributes } = _a;
        const domWithoutAttributes = __rest(_a, ['attributes']);
        return {
            uid: detail.uid,
            dom: {
                tag: 'div',
                attributes: { role: 'presentation', ...attributes },
                ...domWithoutAttributes,
            },
            components: detail.components,
            behaviours: get$5(detail.containerBehaviours),
            events: detail.events,
            domModification: detail.domModification,
            eventOrder: detail.eventOrder,
        };
    };
    const Container = single$2({
        name: 'Container',
        factory: factory$1,
        configFields: [
            defaulted$1('components', []),
            field$1('containerBehaviours', []),
            defaulted$1('events', {}),
            defaulted$1('domModification', {}),
            defaulted$1('eventOrder', {}),
        ],
    });

    const factory$2 = function(detail) {
        return {
            uid: detail.uid,
            dom: detail.dom,
            behaviours: SketchBehaviours.augment(detail.dataBehaviours, [
                Representing.config({
                    store: {
                        mode: 'memory',
                        initialValue: detail.getInitialValue(),
                    },
                }),
                Composing.config({ find: Option.some }),
            ]),
            events: derive([
                runOnAttached(function(component, simulatedEvent) {
                    Representing.setValue(component, detail.getInitialValue());
                }),
            ]),
        };
    };
    const DataField = single$2({
        name: 'DataField',
        factory: factory$2,
        configFields: [
            strict$1('uid'),
            strict$1('dom'),
            strict$1('getInitialValue'),
            SketchBehaviours.field('dataBehaviours', [Representing, Composing]),
        ],
    });

    const get$9 = function(element) {
        return element.dom().value;
    };
    const set$6 = function(element, value) {
        if (value === undefined) {
            throw new Error('Value.set was undefined');
        }
        element.dom().value = value;
    };

    const schema$8 = constant([
        option('data'),
        defaulted$1('inputAttributes', {}),
        defaulted$1('inputStyles', {}),
        defaulted$1('tag', 'input'),
        defaulted$1('inputClasses', []),
        onHandler('onSetValue'),
        defaulted$1('styles', {}),
        defaulted$1('eventOrder', {}),
        field$1('inputBehaviours', [Representing, Focusing]),
        defaulted$1('selectOnFocus', true),
    ]);
    const focusBehaviours = function(detail) {
        return derive$1([
            Focusing.config({
                onFocus:
                    detail.selectOnFocus === false
                        ? noop
                        : function(component) {
                              const input = component.element();
                              const value = get$9(input);
                              input.dom().setSelectionRange(0, value.length);
                          },
            }),
        ]);
    };
    const behaviours = function(detail) {
        return {
            ...focusBehaviours(detail),
            ...augment(detail.inputBehaviours, [
                Representing.config({
                    store: {
                        mode: 'manual',
                        initialValue: detail.data.getOr(undefined),
                        getValue(input) {
                            return get$9(input.element());
                        },
                        setValue(input, data) {
                            const current = get$9(input.element());
                            if (current !== data) {
                                set$6(input.element(), data);
                            }
                        },
                    },
                    onSetValue: detail.onSetValue,
                }),
            ]),
        };
    };
    const dom$2 = function(detail) {
        return {
            tag: detail.tag,
            attributes: { type: 'text', ...detail.inputAttributes },
            styles: detail.inputStyles,
            classes: detail.inputClasses,
        };
    };

    const factory$3 = function(detail, spec) {
        return {
            uid: detail.uid,
            dom: dom$2(detail),
            components: [],
            behaviours: behaviours(detail),
            eventOrder: detail.eventOrder,
        };
    };
    const Input = single$2({
        name: 'Input',
        configFields: schema$8(),
        factory: factory$3,
    });

    const exhibit$3 = function(base, tabConfig) {
        return nu$5({
            attributes: wrapAll$1([
                {
                    key: tabConfig.tabAttr,
                    value: 'true',
                },
            ]),
        });
    };

    const ActiveTabstopping = /* #__PURE__ */ Object.freeze({
        exhibit: exhibit$3,
    });

    const TabstopSchema = [defaulted$1('tabAttr', 'data-alloy-tabstop')];

    const Tabstopping = create$1({
        fields: TabstopSchema,
        name: 'tabstopping',
        active: ActiveTabstopping,
    });

    const global$3 = tinymce.util.Tools.resolve('tinymce.util.I18n');

    const clearInputBehaviour = 'input-clearing';
    const field$2 = function(name, placeholder) {
        const inputSpec = record(
            Input.sketch({
                inputAttributes: {
                    placeholder: global$3.translate(placeholder),
                },
                onSetValue(input$1, data) {
                    emit(input$1, input());
                },
                inputBehaviours: derive$1([
                    Composing.config({ find: Option.some }),
                    Tabstopping.config({}),
                    Keying.config({ mode: 'execution' }),
                ]),
                selectOnFocus: false,
            }),
        );
        const buttonSpec = record(
            Button.sketch({
                dom: dom$1(
                    '<button class="${prefix}-input-container-x ${prefix}-icon-cancel-circle ${prefix}-icon"></button>',
                ),
                action(button) {
                    const input = inputSpec.get(button);
                    Representing.setValue(input, '');
                },
            }),
        );
        return {
            name,
            spec: Container.sketch({
                dom: dom$1('<div class="${prefix}-input-container"></div>'),
                components: [inputSpec.asSpec(), buttonSpec.asSpec()],
                containerBehaviours: derive$1([
                    Toggling.config({
                        toggleClass: Styles.resolve('input-container-empty'),
                    }),
                    Composing.config({
                        find(comp) {
                            return Option.some(inputSpec.get(comp));
                        },
                    }),
                    config(clearInputBehaviour, [
                        run(input(), function(iContainer) {
                            const input = inputSpec.get(iContainer);
                            const val = Representing.getValue(input);
                            const f =
                                val.length > 0 ? Toggling.off : Toggling.on;
                            f(iContainer);
                        }),
                    ]),
                ]),
            }),
        };
    };
    const hidden = function(name) {
        return {
            name,
            spec: DataField.sketch({
                dom: {
                    tag: 'span',
                    styles: { display: 'none' },
                },
                getInitialValue() {
                    return Option.none();
                },
            }),
        };
    };

    const nativeDisabled = ['input', 'button', 'textarea', 'select'];
    const onLoad$5 = function(component, disableConfig, disableState) {
        if (disableConfig.disabled) {
            disable(component, disableConfig);
        }
    };
    const hasNative = function(component, config) {
        return (
            config.useNative === true &&
            contains(nativeDisabled, name(component.element()))
        );
    };
    const nativeIsDisabled = function(component) {
        return has$1(component.element(), 'disabled');
    };
    const nativeDisable = function(component) {
        set(component.element(), 'disabled', 'disabled');
    };
    const nativeEnable = function(component) {
        remove$1(component.element(), 'disabled');
    };
    const ariaIsDisabled = function(component) {
        return get(component.element(), 'aria-disabled') === 'true';
    };
    const ariaDisable = function(component) {
        set(component.element(), 'aria-disabled', 'true');
    };
    const ariaEnable = function(component) {
        set(component.element(), 'aria-disabled', 'false');
    };
    var disable = function(component, disableConfig, disableState) {
        disableConfig.disableClass.each(function(disableClass) {
            add$2(component.element(), disableClass);
        });
        const f = hasNative(component, disableConfig)
            ? nativeDisable
            : ariaDisable;
        f(component);
        disableConfig.onDisabled(component);
    };
    const enable = function(component, disableConfig, disableState) {
        disableConfig.disableClass.each(function(disableClass) {
            remove$4(component.element(), disableClass);
        });
        const f = hasNative(component, disableConfig)
            ? nativeEnable
            : ariaEnable;
        f(component);
        disableConfig.onEnabled(component);
    };
    const isDisabled = function(component, disableConfig) {
        return hasNative(component, disableConfig)
            ? nativeIsDisabled(component)
            : ariaIsDisabled(component);
    };
    const set$7 = function(component, disableConfig, disableState, disabled) {
        const f = disabled ? disable : enable;
        f(component, disableConfig, disableState);
    };

    const DisableApis = /* #__PURE__ */ Object.freeze({
        enable,
        disable,
        isDisabled,
        onLoad: onLoad$5,
        set: set$7,
    });

    const exhibit$4 = function(base, disableConfig, disableState) {
        return nu$5({
            classes: disableConfig.disabled
                ? disableConfig.disableClass.map(pure).getOr([])
                : [],
        });
    };
    const events$7 = function(disableConfig, disableState) {
        return derive([
            abort(execute(), function(component, simulatedEvent) {
                return isDisabled(component, disableConfig);
            }),
            loadEvent(disableConfig, disableState, onLoad$5),
        ]);
    };

    const ActiveDisable = /* #__PURE__ */ Object.freeze({
        exhibit: exhibit$4,
        events: events$7,
    });

    const DisableSchema = [
        defaulted$1('disabled', false),
        defaulted$1('useNative', true),
        option('disableClass'),
        onHandler('onDisabled'),
        onHandler('onEnabled'),
    ];

    const Disabling = create$1({
        fields: DisableSchema,
        name: 'disabling',
        active: ActiveDisable,
        apis: DisableApis,
    });

    const owner$1 = 'form';
    const schema$9 = [field$1('formBehaviours', [Representing])];
    const getPartName = function(name) {
        return `<alloy.field.${name}>`;
    };
    const sketch$5 = function(fSpec) {
        const parts = (function() {
            const record = [];
            const field = function(name, config) {
                record.push(name);
                return generateOne(owner$1, getPartName(name), config);
            };
            return {
                field,
                record() {
                    return record;
                },
            };
        })();
        const spec = fSpec(parts);
        const partNames = parts.record();
        const fieldParts = map$1(partNames, function(n) {
            return required({
                name: n,
                pname: getPartName(n),
            });
        });
        return composite(owner$1, schema$9, fieldParts, make, spec);
    };
    const toResult$1 = function(o, e) {
        return o.fold(function() {
            return Result.error(e);
        }, Result.value);
    };
    var make = function(detail, components, spec) {
        return {
            uid: detail.uid,
            dom: detail.dom,
            components,
            behaviours: augment(detail.formBehaviours, [
                Representing.config({
                    store: {
                        mode: 'manual',
                        getValue(form) {
                            const resPs = getAllParts(form, detail);
                            return map(resPs, function(resPThunk, pName) {
                                return resPThunk()
                                    .bind(function(v) {
                                        const opt = Composing.getCurrent(v);
                                        return toResult$1(
                                            opt,
                                            'missing current',
                                        );
                                    })
                                    .map(Representing.getValue);
                            });
                        },
                        setValue(form, values) {
                            each(values, function(newValue, key) {
                                getPart(form, detail, key).each(function(
                                    wrapper,
                                ) {
                                    Composing.getCurrent(wrapper).each(function(
                                        field,
                                    ) {
                                        Representing.setValue(field, newValue);
                                    });
                                });
                            });
                        },
                    },
                }),
            ]),
            apis: {
                getField(form, key) {
                    return getPart(form, detail, key).bind(
                        Composing.getCurrent,
                    );
                },
            },
        };
    };
    const Form = {
        getField: makeApi(function(apis, component, key) {
            return apis.getField(component, key);
        }),
        sketch: sketch$5,
    };

    const api$2 = function() {
        const subject = Cell(Option.none());
        const revoke = function() {
            subject.get().each(function(s) {
                s.destroy();
            });
        };
        const clear = function() {
            revoke();
            subject.set(Option.none());
        };
        const set = function(s) {
            revoke();
            subject.set(Option.some(s));
        };
        const run = function(f) {
            subject.get().each(f);
        };
        const isSet = function() {
            return subject.get().isSome();
        };
        return {
            clear,
            isSet,
            set,
            run,
        };
    };
    const value$2 = function() {
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

    const SWIPING_LEFT = 1;
    const SWIPING_RIGHT = -1;
    const SWIPING_NONE = 0;
    const init$2 = function(xValue) {
        return {
            xValue,
            points: [],
        };
    };
    const move$1 = function(model, xValue) {
        if (xValue === model.xValue) {
            return model;
        }
        const currentDirection =
            xValue - model.xValue > 0 ? SWIPING_LEFT : SWIPING_RIGHT;
        const newPoint = {
            direction: currentDirection,
            xValue,
        };
        const priorPoints = (function() {
            if (model.points.length === 0) {
                return [];
            }
            const prev = model.points[model.points.length - 1];
            return prev.direction === currentDirection
                ? model.points.slice(0, model.points.length - 1)
                : model.points;
        })();
        return {
            xValue,
            points: priorPoints.concat([newPoint]),
        };
    };
    const complete = function(model) {
        if (model.points.length === 0) {
            return SWIPING_NONE;
        }
        const firstDirection = model.points[0].direction;
        const lastDirection = model.points[model.points.length - 1].direction;
        return firstDirection === SWIPING_RIGHT &&
            lastDirection === SWIPING_RIGHT
            ? SWIPING_RIGHT
            : firstDirection === SWIPING_LEFT && lastDirection === SWIPING_LEFT
            ? SWIPING_LEFT
            : SWIPING_NONE;
    };
    const SwipingModel = {
        init: init$2,
        move: move$1,
        complete,
    };

    const sketch$6 = function(rawSpec) {
        const navigateEvent = 'navigateEvent';
        const wrapperAdhocEvents = 'serializer-wrapper-events';
        const formAdhocEvents = 'form-events';
        const schema = objOf([
            strict$1('fields'),
            defaulted$1('maxFieldIndex', rawSpec.fields.length - 1),
            strict$1('onExecute'),
            strict$1('getInitialValue'),
            state$1('state', function() {
                return {
                    dialogSwipeState: value$2(),
                    currentScreen: Cell(0),
                };
            }),
        ]);
        const spec$1 = asRawOrDie('SerialisedDialog', schema, rawSpec);
        const navigationButton = function(direction, directionName, enabled) {
            return Button.sketch({
                dom: dom$1(
                    `<span class="\${prefix}-icon-${directionName} \${prefix}-icon"></span>`,
                ),
                action(button) {
                    emitWith(button, navigateEvent, { direction });
                },
                buttonBehaviours: derive$1([
                    Disabling.config({
                        disableClass: Styles.resolve(
                            'toolbar-navigation-disabled',
                        ),
                        disabled: !enabled,
                    }),
                ]),
            });
        };
        const reposition = function(dialog, message) {
            descendant$1(
                dialog.element(),
                `.${Styles.resolve('serialised-dialog-chain')}`,
            ).each(function(parent) {
                set$3(
                    parent,
                    'left',
                    `${-spec$1.state.currentScreen.get() * message.width}px`,
                );
            });
        };
        const navigate = function(dialog, direction) {
            const screens = descendants(
                dialog.element(),
                `.${Styles.resolve('serialised-dialog-screen')}`,
            );
            descendant$1(
                dialog.element(),
                `.${Styles.resolve('serialised-dialog-chain')}`,
            ).each(function(parent) {
                if (
                    spec$1.state.currentScreen.get() + direction >= 0 &&
                    spec$1.state.currentScreen.get() + direction <
                        screens.length
                ) {
                    getRaw(parent, 'left').each(function(left) {
                        const currentLeft = parseInt(left, 10);
                        const w = get$6(screens[0]);
                        set$3(
                            parent,
                            'left',
                            `${currentLeft - direction * w}px`,
                        );
                    });
                    spec$1.state.currentScreen.set(
                        spec$1.state.currentScreen.get() + direction,
                    );
                }
            });
        };
        const focusInput = function(dialog) {
            const inputs = descendants(dialog.element(), 'input');
            const optInput = Option.from(
                inputs[spec$1.state.currentScreen.get()],
            );
            optInput.each(function(input) {
                dialog
                    .getSystem()
                    .getByDom(input)
                    .each(function(inputComp) {
                        dispatchFocus(dialog, inputComp.element());
                    });
            });
            const dotitems = memDots.get(dialog);
            Highlighting.highlightAt(
                dotitems,
                spec$1.state.currentScreen.get(),
            );
        };
        const resetState = function() {
            spec$1.state.currentScreen.set(0);
            spec$1.state.dialogSwipeState.clear();
        };
        const memForm = record(
            Form.sketch(function(parts) {
                return {
                    dom: dom$1(
                        '<div class="${prefix}-serialised-dialog"></div>',
                    ),
                    components: [
                        Container.sketch({
                            dom: dom$1(
                                '<div class="${prefix}-serialised-dialog-chain" style="left: 0px; position: absolute;"></div>',
                            ),
                            components: map$1(spec$1.fields, function(
                                field,
                                i,
                            ) {
                                return i <= spec$1.maxFieldIndex
                                    ? Container.sketch({
                                          dom: dom$1(
                                              '<div class="${prefix}-serialised-dialog-screen"></div>',
                                          ),
                                          components: [
                                              navigationButton(
                                                  -1,
                                                  'previous',
                                                  i > 0,
                                              ),
                                              parts.field(
                                                  field.name,
                                                  field.spec,
                                              ),
                                              navigationButton(
                                                  +1,
                                                  'next',
                                                  i < spec$1.maxFieldIndex,
                                              ),
                                          ],
                                      })
                                    : parts.field(field.name, field.spec);
                            }),
                        }),
                    ],
                    formBehaviours: derive$1([
                        Receivers.orientation(function(dialog, message) {
                            reposition(dialog, message);
                        }),
                        Keying.config({
                            mode: 'special',
                            focusIn(dialog) {
                                focusInput(dialog);
                            },
                            onTab(dialog) {
                                navigate(dialog, +1);
                                return Option.some(true);
                            },
                            onShiftTab(dialog) {
                                navigate(dialog, -1);
                                return Option.some(true);
                            },
                        }),
                        config(formAdhocEvents, [
                            runOnAttached(function(dialog, simulatedEvent) {
                                resetState();
                                const dotitems = memDots.get(dialog);
                                Highlighting.highlightFirst(dotitems);
                                spec$1
                                    .getInitialValue(dialog)
                                    .each(function(v) {
                                        Representing.setValue(dialog, v);
                                    });
                            }),
                            runOnExecute(spec$1.onExecute),
                            run(transitionend(), function(
                                dialog,
                                simulatedEvent,
                            ) {
                                const event = simulatedEvent.event();
                                if (event.raw().propertyName === 'left') {
                                    focusInput(dialog);
                                }
                            }),
                            run(navigateEvent, function(
                                dialog,
                                simulatedEvent,
                            ) {
                                const event = simulatedEvent.event();
                                const direction = event.direction();
                                navigate(dialog, direction);
                            }),
                        ]),
                    ]),
                };
            }),
        );
        var memDots = record({
            dom: dom$1('<div class="${prefix}-dot-container"></div>'),
            behaviours: derive$1([
                Highlighting.config({
                    highlightClass: Styles.resolve('dot-active'),
                    itemClass: Styles.resolve('dot-item'),
                }),
            ]),
            components: bind(spec$1.fields, function(_f, i) {
                return i <= spec$1.maxFieldIndex
                    ? [
                          spec(
                              '<div class="${prefix}-dot-item ${prefix}-icon-full-dot ${prefix}-icon"></div>',
                          ),
                      ]
                    : [];
            }),
        });
        return {
            dom: dom$1('<div class="${prefix}-serializer-wrapper"></div>'),
            components: [memForm.asSpec(), memDots.asSpec()],
            behaviours: derive$1([
                Keying.config({
                    mode: 'special',
                    focusIn(wrapper) {
                        const form = memForm.get(wrapper);
                        Keying.focusIn(form);
                    },
                }),
                config(wrapperAdhocEvents, [
                    run(touchstart(), function(wrapper, simulatedEvent) {
                        const event = simulatedEvent.event();
                        spec$1.state.dialogSwipeState.set(
                            SwipingModel.init(event.raw().touches[0].clientX),
                        );
                    }),
                    run(touchmove(), function(wrapper, simulatedEvent) {
                        const event = simulatedEvent.event();
                        spec$1.state.dialogSwipeState.on(function(state) {
                            simulatedEvent.event().prevent();
                            spec$1.state.dialogSwipeState.set(
                                SwipingModel.move(
                                    state,
                                    event.raw().touches[0].clientX,
                                ),
                            );
                        });
                    }),
                    run(touchend(), function(wrapper) {
                        spec$1.state.dialogSwipeState.on(function(state) {
                            const dialog = memForm.get(wrapper);
                            const direction = -1 * SwipingModel.complete(state);
                            navigate(dialog, direction);
                        });
                    }),
                ]),
            ]),
        };
    };

    const getGroups = cached(function(realm, editor) {
        return [
            {
                label: 'the link group',
                items: [
                    sketch$6({
                        fields: [
                            field$2('url', 'Type or paste URL'),
                            field$2('text', 'Link text'),
                            field$2('title', 'Link title'),
                            field$2('target', 'Link target'),
                            hidden('link'),
                        ],
                        maxFieldIndex:
                            ['url', 'text', 'title', 'target'].length - 1,
                        getInitialValue() {
                            return Option.some(LinkBridge.getInfo(editor));
                        },
                        onExecute(dialog) {
                            const info = Representing.getValue(dialog);
                            LinkBridge.applyInfo(editor, info);
                            realm.restoreToolbar();
                            editor.focus();
                        },
                    }),
                ],
            },
        ];
    });
    const sketch$7 = function(realm, editor) {
        return Buttons.forToolbarStateAction(
            editor,
            'link',
            'link',
            function() {
                const groups = getGroups(realm, editor);
                realm.setContextToolbar(groups);
                RangePreserver.forAndroid(editor, function() {
                    realm.focusToolbar();
                });
                LinkBridge.query(editor).each(function(link) {
                    editor.selection.select(link.dom());
                });
            },
        );
    };

    const DefaultStyleFormats = [
        {
            title: 'Headings',
            items: [
                {
                    title: 'Heading 1',
                    format: 'h1',
                },
                {
                    title: 'Heading 2',
                    format: 'h2',
                },
                {
                    title: 'Heading 3',
                    format: 'h3',
                },
                {
                    title: 'Heading 4',
                    format: 'h4',
                },
                {
                    title: 'Heading 5',
                    format: 'h5',
                },
                {
                    title: 'Heading 6',
                    format: 'h6',
                },
            ],
        },
        {
            title: 'Inline',
            items: [
                {
                    title: 'Bold',
                    icon: 'bold',
                    format: 'bold',
                },
                {
                    title: 'Italic',
                    icon: 'italic',
                    format: 'italic',
                },
                {
                    title: 'Underline',
                    icon: 'underline',
                    format: 'underline',
                },
                {
                    title: 'Strikethrough',
                    icon: 'strikethrough',
                    format: 'strikethrough',
                },
                {
                    title: 'Superscript',
                    icon: 'superscript',
                    format: 'superscript',
                },
                {
                    title: 'Subscript',
                    icon: 'subscript',
                    format: 'subscript',
                },
                {
                    title: 'Code',
                    icon: 'code',
                    format: 'code',
                },
            ],
        },
        {
            title: 'Blocks',
            items: [
                {
                    title: 'Paragraph',
                    format: 'p',
                },
                {
                    title: 'Blockquote',
                    format: 'blockquote',
                },
                {
                    title: 'Div',
                    format: 'div',
                },
                {
                    title: 'Pre',
                    format: 'pre',
                },
            ],
        },
        {
            title: 'Alignment',
            items: [
                {
                    title: 'Left',
                    icon: 'alignleft',
                    format: 'alignleft',
                },
                {
                    title: 'Center',
                    icon: 'aligncenter',
                    format: 'aligncenter',
                },
                {
                    title: 'Right',
                    icon: 'alignright',
                    format: 'alignright',
                },
                {
                    title: 'Justify',
                    icon: 'alignjustify',
                    format: 'alignjustify',
                },
            ],
        },
    ];

    const isRecursive = function(component, originator, target) {
        return eq(originator, component.element()) && !eq(originator, target);
    };
    const events$8 = derive([
        can(focus(), function(component, simulatedEvent) {
            const originator = simulatedEvent.event().originator();
            const target = simulatedEvent.event().target();
            if (isRecursive(component, originator, target)) {
                domGlobals.console.warn(
                    `${focus()} did not get interpreted by the desired target. ` +
                        `\nOriginator: ${element(
                            originator,
                        )}\nTarget: ${element(
                            target,
                        )}\nCheck the ${focus()} event handlers`,
                );
                return false;
            }
            return true;
        }),
    ]);

    const DefaultEvents = /* #__PURE__ */ Object.freeze({
        events: events$8,
    });

    const make$1 = identity;

    const NoContextApi = function(getComp) {
        const fail = function(event) {
            return function() {
                throw new Error(
                    `The component must be in a context to send: ${event}\n${element(
                        getComp().element(),
                    )} is not in context.`,
                );
            };
        };
        return {
            debugInfo: constant('fake'),
            triggerEvent: fail('triggerEvent'),
            triggerFocus: fail('triggerFocus'),
            triggerEscape: fail('triggerEscape'),
            build: fail('build'),
            addToWorld: fail('addToWorld'),
            removeFromWorld: fail('removeFromWorld'),
            addToGui: fail('addToGui'),
            removeFromGui: fail('removeFromGui'),
            getByUid: fail('getByUid'),
            getByDom: fail('getByDom'),
            broadcast: fail('broadcast'),
            broadcastOn: fail('broadcastOn'),
            broadcastEvent: fail('broadcastEvent'),
            isConnected: constant(false),
        };
    };
    const singleton = NoContextApi();

    const generateFrom = function(spec, all) {
        const schema = map$1(all, function(a) {
            return optionObjOf(a.name(), [
                strict$1('config'),
                defaulted$1('state', NoState),
            ]);
        });
        const validated = asRaw(
            'component.behaviours',
            objOf(schema),
            spec.behaviours,
        ).fold(
            function(errInfo) {
                throw new Error(
                    `${formatError(errInfo)}\nComplete spec:\n${JSON.stringify(
                        spec,
                        null,
                        2,
                    )}`,
                );
            },
            function(v) {
                return v;
            },
        );
        return {
            list: all,
            data: map(validated, function(optBlobThunk) {
                const optBlob = optBlobThunk;
                const output = optBlob.map(function(blob) {
                    return {
                        config: blob.config,
                        state: blob.state.init(blob.config),
                    };
                });
                return function() {
                    return output;
                };
            }),
        };
    };
    const getBehaviours = function(bData) {
        return bData.list;
    };
    const getData = function(bData) {
        return bData.data;
    };

    const byInnerKey = function(data, tuple) {
        const r = {};
        each(data, function(detail, key) {
            each(detail, function(value, indexKey) {
                const chain = readOr$1(indexKey, [])(r);
                r[indexKey] = chain.concat([tuple(key, value)]);
            });
        });
        return r;
    };

    const combine$1 = function(info, baseMod, behaviours, base) {
        const modsByBehaviour = { ...baseMod };
        each$1(behaviours, function(behaviour) {
            modsByBehaviour[behaviour.name()] = behaviour.exhibit(info, base);
        });
        const nameAndMod = function(name, modification) {
            return {
                name,
                modification,
            };
        };
        const byAspect = byInnerKey(modsByBehaviour, nameAndMod);
        const combineObjects = function(objects) {
            return foldr(
                objects,
                function(b, a) {
                    return { ...a.modification, ...b };
                },
                {},
            );
        };
        const combinedClasses = foldr(
            byAspect.classes,
            function(b, a) {
                return a.modification.concat(b);
            },
            [],
        );
        const combinedAttributes = combineObjects(byAspect.attributes);
        const combinedStyles = combineObjects(byAspect.styles);
        return nu$5({
            classes: combinedClasses,
            attributes: combinedAttributes,
            styles: combinedStyles,
        });
    };

    const sortKeys = function(label, keyName, array, order) {
        const sliced = array.slice(0);
        try {
            const sorted = sliced.sort(function(a, b) {
                const aKey = a[keyName]();
                const bKey = b[keyName]();
                const aIndex = order.indexOf(aKey);
                const bIndex = order.indexOf(bKey);
                if (aIndex === -1) {
                    throw new Error(
                        `The ordering for ${label} does not have an entry for ${aKey}.\nOrder specified: ${JSON.stringify(
                            order,
                            null,
                            2,
                        )}`,
                    );
                }
                if (bIndex === -1) {
                    throw new Error(
                        `The ordering for ${label} does not have an entry for ${bKey}.\nOrder specified: ${JSON.stringify(
                            order,
                            null,
                            2,
                        )}`,
                    );
                }
                if (aIndex < bIndex) {
                    return -1;
                }
                if (bIndex < aIndex) {
                    return 1;
                }
                return 0;
            });
            return Result.value(sorted);
        } catch (err) {
            return Result.error([err]);
        }
    };

    const uncurried = function(handler, purpose) {
        return {
            handler,
            purpose: constant(purpose),
        };
    };
    const curried = function(handler, purpose) {
        return {
            cHandler: handler,
            purpose: constant(purpose),
        };
    };
    const curryArgs = function(descHandler, extraArgs) {
        return curried(
            curry.apply(undefined, [descHandler.handler].concat(extraArgs)),
            descHandler.purpose(),
        );
    };
    const getCurried = function(descHandler) {
        return descHandler.cHandler;
    };

    const behaviourTuple = function(name, handler) {
        return {
            name: constant(name),
            handler: constant(handler),
        };
    };
    const nameToHandlers = function(behaviours, info) {
        const r = {};
        each$1(behaviours, function(behaviour) {
            r[behaviour.name()] = behaviour.handlers(info);
        });
        return r;
    };
    const groupByEvents = function(info, behaviours, base) {
        const behaviourEvents = {
            ...base,
            ...nameToHandlers(behaviours, info),
        };
        return byInnerKey(behaviourEvents, behaviourTuple);
    };
    const combine$2 = function(info, eventOrder, behaviours, base) {
        const byEventName = groupByEvents(info, behaviours, base);
        return combineGroups(byEventName, eventOrder);
    };
    const assemble = function(rawHandler) {
        const handler = read(rawHandler);
        return function(component, simulatedEvent) {
            const rest = [];
            for (let _i = 2; _i < arguments.length; _i++) {
                rest[_i - 2] = arguments[_i];
            }
            const args = [component, simulatedEvent].concat(rest);
            if (handler.abort.apply(undefined, args)) {
                simulatedEvent.stop();
            } else if (handler.can.apply(undefined, args)) {
                handler.run.apply(undefined, args);
            }
        };
    };
    const missingOrderError = function(eventName, tuples) {
        return Result.error([
            `The event (${eventName}) has more than one behaviour that listens to it.\nWhen this occurs, you must ` +
                `specify an event ordering for the behaviours in your spec (e.g. [ "listing", "toggling" ]).\nThe behaviours that ` +
                `can trigger it are: ${JSON.stringify(
                    map$1(tuples, function(c) {
                        return c.name();
                    }),
                    null,
                    2,
                )}`,
        ]);
    };
    const fuse$1 = function(tuples, eventOrder, eventName) {
        const order = eventOrder[eventName];
        if (!order) {
            return missingOrderError(eventName, tuples);
        }
        return sortKeys(`Event: ${eventName}`, 'name', tuples, order).map(
            function(sortedTuples) {
                const handlers = map$1(sortedTuples, function(tuple) {
                    return tuple.handler();
                });
                return fuse(handlers);
            },
        );
    };
    var combineGroups = function(byEventName, eventOrder) {
        const r = mapToArray(byEventName, function(tuples, eventName) {
            const combined =
                tuples.length === 1
                    ? Result.value(tuples[0].handler())
                    : fuse$1(tuples, eventOrder, eventName);
            return combined.map(function(handler) {
                const assembled = assemble(handler);
                const purpose =
                    tuples.length > 1
                        ? filter(eventOrder[eventName], function(o) {
                              return exists(tuples, function(t) {
                                  return t.name() === o;
                              });
                          }).join(' > ')
                        : tuples[0].name();
                return wrap$1(eventName, uncurried(assembled, purpose));
            });
        });
        return consolidate(r, {});
    };

    const toInfo = function(spec) {
        return asRaw(
            'custom.definition',
            objOf([
                field(
                    'dom',
                    'dom',
                    strict(),
                    objOf([
                        strict$1('tag'),
                        defaulted$1('styles', {}),
                        defaulted$1('classes', []),
                        defaulted$1('attributes', {}),
                        option('value'),
                        option('innerHtml'),
                    ]),
                ),
                strict$1('components'),
                strict$1('uid'),
                defaulted$1('events', {}),
                defaulted$1('apis', {}),
                field(
                    'eventOrder',
                    'eventOrder',
                    mergeWith({
                        'alloy.execute': [
                            'disabling',
                            'alloy.base.behaviour',
                            'toggling',
                            'typeaheadevents',
                        ],
                        'alloy.focus': [
                            'alloy.base.behaviour',
                            'focusing',
                            'keying',
                        ],
                        'alloy.system.init': [
                            'alloy.base.behaviour',
                            'disabling',
                            'toggling',
                            'representing',
                        ],
                        input: [
                            'alloy.base.behaviour',
                            'representing',
                            'streaming',
                            'invalidating',
                        ],
                        'alloy.system.detached': [
                            'alloy.base.behaviour',
                            'representing',
                            'item-events',
                            'tooltipping',
                        ],
                        mousedown: [
                            'focusing',
                            'alloy.base.behaviour',
                            'item-type-events',
                        ],
                        touchstart: [
                            'focusing',
                            'alloy.base.behaviour',
                            'item-type-events',
                        ],
                        mouseover: ['item-type-events', 'tooltipping'],
                    }),
                    anyValue$1(),
                ),
                option('domModification'),
            ]),
            spec,
        );
    };
    const toDefinition = function(detail) {
        return {
            ...detail.dom,
            uid: detail.uid,
            domChildren: map$1(detail.components, function(comp) {
                return comp.element();
            }),
        };
    };
    const toModification = function(detail) {
        return detail.domModification.fold(function() {
            return nu$5({});
        }, nu$5);
    };
    const toEvents = function(info) {
        return info.events;
    };

    const add$3 = function(element, classes) {
        each$1(classes, function(x) {
            add$2(element, x);
        });
    };
    const remove$6 = function(element, classes) {
        each$1(classes, function(x) {
            remove$4(element, x);
        });
    };

    const renderToDom = function(definition) {
        const subject = Element.fromTag(definition.tag);
        setAll(subject, definition.attributes);
        add$3(subject, definition.classes);
        setAll$1(subject, definition.styles);
        definition.innerHtml.each(function(html) {
            return set$1(subject, html);
        });
        const children = definition.domChildren;
        append$1(subject, children);
        definition.value.each(function(value) {
            set$6(subject, value);
        });
        if (!definition.uid) {
            debugger;
        }
        writeOnly(subject, definition.uid);
        return subject;
    };

    const getBehaviours$1 = function(spec) {
        const behaviours = readOr$1('behaviours', {})(spec);
        const keys$1 = filter(keys(behaviours), function(k) {
            return behaviours[k] !== undefined;
        });
        return map$1(keys$1, function(k) {
            return behaviours[k].me;
        });
    };
    const generateFrom$1 = function(spec, all) {
        return generateFrom(spec, all);
    };
    const generate$4 = function(spec) {
        const all = getBehaviours$1(spec);
        return generateFrom$1(spec, all);
    };

    const getDomDefinition = function(info, bList, bData) {
        const definition = toDefinition(info);
        const infoModification = toModification(info);
        const baseModification = {
            'alloy.base.modification': infoModification,
        };
        const modification =
            bList.length > 0
                ? combine$1(bData, baseModification, bList, definition)
                : infoModification;
        return merge$1(definition, modification);
    };
    const getEvents = function(info, bList, bData) {
        const baseEvents = { 'alloy.base.behaviour': toEvents(info) };
        return combine$2(bData, info.eventOrder, bList, baseEvents).getOrDie();
    };
    const build = function(spec) {
        const getMe = function() {
            return me;
        };
        const systemApi = Cell(singleton);
        const info = getOrDie(toInfo(spec));
        const bBlob = generate$4(spec);
        const bList = getBehaviours(bBlob);
        const bData = getData(bBlob);
        const modDefinition = getDomDefinition(info, bList, bData);
        const item = renderToDom(modDefinition);
        const events = getEvents(info, bList, bData);
        const subcomponents = Cell(info.components);
        const connect = function(newApi) {
            systemApi.set(newApi);
        };
        const disconnect = function() {
            systemApi.set(NoContextApi(getMe));
        };
        const syncComponents = function() {
            const children$1 = children(item);
            const subs = bind(children$1, function(child) {
                return systemApi
                    .get()
                    .getByDom(child)
                    .fold(
                        function() {
                            return [];
                        },
                        function(c) {
                            return [c];
                        },
                    );
            });
            subcomponents.set(subs);
        };
        const config = function(behaviour) {
            const b = bData;
            const f = isFunction(b[behaviour.name()])
                ? b[behaviour.name()]
                : function() {
                      throw new Error(
                          `Could not find ${behaviour.name()} in ${JSON.stringify(
                              spec,
                              null,
                              2,
                          )}`,
                      );
                  };
            return f();
        };
        const hasConfigured = function(behaviour) {
            return isFunction(bData[behaviour.name()]);
        };
        const getApis = function() {
            return info.apis;
        };
        const readState = function(behaviourName) {
            return bData[behaviourName]()
                .map(function(b) {
                    return b.state.readState();
                })
                .getOr('not enabled');
        };
        var me = {
            getSystem: systemApi.get,
            config,
            hasConfigured,
            spec: constant(spec),
            readState,
            getApis,
            connect,
            disconnect,
            element: constant(item),
            syncComponents,
            components: subcomponents.get,
            events: constant(events),
        };
        return me;
    };

    const buildSubcomponents = function(spec) {
        const components = readOr$1('components', [])(spec);
        return map$1(components, build$1);
    };
    const buildFromSpec = function(userSpec) {
        const _a = make$1(userSpec);
        const specEvents = _a.events;
        const spec = __rest(_a, ['events']);
        const components = buildSubcomponents(spec);
        const completeSpec = {
            ...spec,
            events: { ...DefaultEvents, ...specEvents },
            components,
        };
        return Result.value(build(completeSpec));
    };
    const text = function(textContent) {
        const element = Element.fromText(textContent);
        return external({ element });
    };
    var external = function(spec) {
        const extSpec = asRawOrDie(
            'external.component',
            objOfOnly([strict$1('element'), option('uid')]),
            spec,
        );
        const systemApi = Cell(NoContextApi());
        const connect = function(newApi) {
            systemApi.set(newApi);
        };
        const disconnect = function() {
            systemApi.set(
                NoContextApi(function() {
                    return me;
                }),
            );
        };
        extSpec.uid.each(function(uid) {
            writeOnly(extSpec.element, uid);
        });
        var me = {
            getSystem: systemApi.get,
            config: Option.none,
            hasConfigured: constant(false),
            connect,
            disconnect,
            getApis() {
                return {};
            },
            element: constant(extSpec.element),
            spec: constant(spec),
            readState: constant('No state'),
            syncComponents: noop,
            components: constant([]),
            events: constant({}),
        };
        return premade(me);
    };
    const uids = generate$3;
    var build$1 = function(spec) {
        return getPremade(spec).fold(
            function() {
                const userSpecWithUid = spec.hasOwnProperty('uid')
                    ? spec
                    : { uid: uids(''), ...spec };
                return buildFromSpec(userSpecWithUid).getOrDie();
            },
            function(prebuilt) {
                return prebuilt;
            },
        );
    };
    const premade$1 = premade;

    const hoverEvent = 'alloy.item-hover';
    const focusEvent = 'alloy.item-focus';
    const onHover = function(item) {
        if (search(item.element()).isNone() || Focusing.isFocused(item)) {
            if (!Focusing.isFocused(item)) {
                Focusing.focus(item);
            }
            emitWith(item, hoverEvent, { item });
        }
    };
    const onFocus = function(item) {
        emitWith(item, focusEvent, { item });
    };
    const hover = constant(hoverEvent);
    const focus$3 = constant(focusEvent);

    const builder = function(detail) {
        return {
            dom: detail.dom,
            domModification: {
                ...detail.domModification,
                attributes: {
                    role: detail.toggling.isSome()
                        ? 'menuitemcheckbox'
                        : 'menuitem',
                    ...detail.domModification.attributes,
                    'aria-haspopup': detail.hasSubmenu,
                    ...(detail.hasSubmenu ? { 'aria-expanded': false } : {}),
                },
            },
            behaviours: SketchBehaviours.augment(detail.itemBehaviours, [
                detail.toggling.fold(Toggling.revoke, function(tConfig) {
                    return Toggling.config({
                        aria: { mode: 'checked' },
                        ...tConfig,
                    });
                }),
                Focusing.config({
                    ignore: detail.ignoreFocus,
                    stopMousedown: detail.ignoreFocus,
                    onFocus(component) {
                        onFocus(component);
                    },
                }),
                Keying.config({ mode: 'execution' }),
                Representing.config({
                    store: {
                        mode: 'memory',
                        initialValue: detail.data,
                    },
                }),
                config(
                    'item-type-events',
                    __spreadArrays(pointerEvents(), [
                        run(mouseover(), onHover),
                        run(focusItem(), Focusing.focus),
                    ]),
                ),
            ]),
            components: detail.components,
            eventOrder: detail.eventOrder,
        };
    };
    const schema$a = [
        strict$1('data'),
        strict$1('components'),
        strict$1('dom'),
        defaulted$1('hasSubmenu', false),
        option('toggling'),
        SketchBehaviours.field('itemBehaviours', [
            Toggling,
            Focusing,
            Keying,
            Representing,
        ]),
        defaulted$1('ignoreFocus', false),
        defaulted$1('domModification', {}),
        output('builder', builder),
        defaulted$1('eventOrder', {}),
    ];

    const builder$1 = function(detail) {
        return {
            dom: detail.dom,
            components: detail.components,
            events: derive([stopper(focusItem())]),
        };
    };
    const schema$b = [
        strict$1('dom'),
        strict$1('components'),
        output('builder', builder$1),
    ];

    const owner$2 = function() {
        return 'item-widget';
    };
    const parts = constant([
        required({
            name: 'widget',
            overrides(detail) {
                return {
                    behaviours: derive$1([
                        Representing.config({
                            store: {
                                mode: 'manual',
                                getValue(component) {
                                    return detail.data;
                                },
                                setValue() {},
                            },
                        }),
                    ]),
                };
            },
        }),
    ]);

    const builder$2 = function(detail) {
        const subs = substitutes(owner$2(), detail, parts());
        const components$1 = components(owner$2(), detail, subs.internals());
        const focusWidget = function(component) {
            return getPart(component, detail, 'widget').map(function(widget) {
                Keying.focusIn(widget);
                return widget;
            });
        };
        const onHorizontalArrow = function(component, simulatedEvent) {
            return inside(simulatedEvent.event().target())
                ? Option.none()
                : (function() {
                      if (detail.autofocus) {
                          simulatedEvent.setSource(component.element());
                          return Option.none();
                      }
                      return Option.none();
                  })();
        };
        return {
            dom: detail.dom,
            components: components$1,
            domModification: detail.domModification,
            events: derive([
                runOnExecute(function(component, simulatedEvent) {
                    focusWidget(component).each(function(widget) {
                        simulatedEvent.stop();
                    });
                }),
                run(mouseover(), onHover),
                run(focusItem(), function(component, simulatedEvent) {
                    if (detail.autofocus) {
                        focusWidget(component);
                    } else {
                        Focusing.focus(component);
                    }
                }),
            ]),
            behaviours: SketchBehaviours.augment(detail.widgetBehaviours, [
                Representing.config({
                    store: {
                        mode: 'memory',
                        initialValue: detail.data,
                    },
                }),
                Focusing.config({
                    ignore: detail.ignoreFocus,
                    onFocus(component) {
                        onFocus(component);
                    },
                }),
                Keying.config({
                    mode: 'special',
                    focusIn: detail.autofocus
                        ? function(component) {
                              focusWidget(component);
                          }
                        : revoke(),
                    onLeft: onHorizontalArrow,
                    onRight: onHorizontalArrow,
                    onEscape(component, simulatedEvent) {
                        if (
                            !Focusing.isFocused(component) &&
                            !detail.autofocus
                        ) {
                            Focusing.focus(component);
                            return Option.some(true);
                        }
                        if (detail.autofocus) {
                            simulatedEvent.setSource(component.element());
                            return Option.none();
                        }
                        return Option.none();
                    },
                }),
            ]),
        };
    };
    const schema$c = [
        strict$1('uid'),
        strict$1('data'),
        strict$1('components'),
        strict$1('dom'),
        defaulted$1('autofocus', false),
        defaulted$1('ignoreFocus', false),
        SketchBehaviours.field('widgetBehaviours', [
            Representing,
            Focusing,
            Keying,
        ]),
        defaulted$1('domModification', {}),
        defaultUidsSchema(parts()),
        output('builder', builder$2),
    ];

    const itemSchema$1 = choose$1('type', {
        widget: schema$c,
        item: schema$a,
        separator: schema$b,
    });
    const configureGrid = function(detail, movementInfo) {
        return {
            mode: 'flatgrid',
            selector: `.${detail.markers.item}`,
            initSize: {
                numColumns: movementInfo.initSize.numColumns,
                numRows: movementInfo.initSize.numRows,
            },
            focusManager: detail.focusManager,
        };
    };
    const configureMatrix = function(detail, movementInfo) {
        return {
            mode: 'matrix',
            selectors: {
                row: movementInfo.rowSelector,
                cell: `.${detail.markers.item}`,
            },
            focusManager: detail.focusManager,
        };
    };
    const configureMenu = function(detail, movementInfo) {
        return {
            mode: 'menu',
            selector: `.${detail.markers.item}`,
            moveOnTab: movementInfo.moveOnTab,
            focusManager: detail.focusManager,
        };
    };
    const parts$1 = constant([
        group({
            factory: {
                sketch(spec) {
                    const itemInfo = asRawOrDie(
                        'menu.spec item',
                        itemSchema$1,
                        spec,
                    );
                    return itemInfo.builder(itemInfo);
                },
            },
            name: 'items',
            unit: 'item',
            defaults(detail, u) {
                return u.hasOwnProperty('uid')
                    ? u
                    : { ...u, uid: generate$3('item') };
            },
            overrides(detail, u) {
                return {
                    type: u.type,
                    ignoreFocus: detail.fakeFocus,
                    domModification: { classes: [detail.markers.item] },
                };
            },
        }),
    ]);
    const schema$d = constant([
        strict$1('value'),
        strict$1('items'),
        strict$1('dom'),
        strict$1('components'),
        defaulted$1('eventOrder', {}),
        field$1('menuBehaviours', [
            Highlighting,
            Representing,
            Composing,
            Keying,
        ]),
        defaultedOf(
            'movement',
            {
                mode: 'menu',
                moveOnTab: true,
            },
            choose$1('mode', {
                grid: [initSize(), output('config', configureGrid)],
                matrix: [
                    output('config', configureMatrix),
                    strict$1('rowSelector'),
                ],
                menu: [
                    defaulted$1('moveOnTab', true),
                    output('config', configureMenu),
                ],
            }),
        ),
        itemMarkers(),
        defaulted$1('fakeFocus', false),
        defaulted$1('focusManager', dom()),
        onHandler('onHighlight'),
    ]);

    const focus$4 = constant('alloy.menu-focus');

    const make$2 = function(detail, components, spec, externals) {
        return {
            uid: detail.uid,
            dom: detail.dom,
            markers: detail.markers,
            behaviours: augment(detail.menuBehaviours, [
                Highlighting.config({
                    highlightClass: detail.markers.selectedItem,
                    itemClass: detail.markers.item,
                    onHighlight: detail.onHighlight,
                }),
                Representing.config({
                    store: {
                        mode: 'memory',
                        initialValue: detail.value,
                    },
                }),
                Composing.config({ find: Option.some }),
                Keying.config(detail.movement.config(detail, detail.movement)),
            ]),
            events: derive([
                run(focus$3(), function(menu, simulatedEvent) {
                    const event = simulatedEvent.event();
                    menu.getSystem()
                        .getByDom(event.target())
                        .each(function(item) {
                            Highlighting.highlight(menu, item);
                            simulatedEvent.stop();
                            emitWith(menu, focus$4(), {
                                menu,
                                item,
                            });
                        });
                }),
                run(hover(), function(menu, simulatedEvent) {
                    const item = simulatedEvent.event().item();
                    Highlighting.highlight(menu, item);
                }),
            ]),
            components,
            eventOrder: detail.eventOrder,
            domModification: { attributes: { role: 'menu' } },
        };
    };

    const Menu = composite$1({
        name: 'Menu',
        configFields: schema$d(),
        partFields: parts$1(),
        factory: make$2,
    });

    const preserve$1 = function(f, container) {
        const ownerDoc = owner(container);
        const refocus = active(ownerDoc).bind(function(focused) {
            const hasFocus = function(elem) {
                return eq(focused, elem);
            };
            return hasFocus(container)
                ? Option.some(container)
                : descendant(container, hasFocus);
        });
        const result = f(container);
        refocus.each(function(oldFocus) {
            active(ownerDoc)
                .filter(function(newFocus) {
                    return eq(newFocus, oldFocus);
                })
                .fold(function() {
                    focus$1(oldFocus);
                }, noop);
        });
        return result;
    };

    const set$8 = function(component, replaceConfig, replaceState, data) {
        preserve$1(function() {
            const newChildren = map$1(data, component.getSystem().build);
            replaceChildren(component, newChildren);
        }, component.element());
    };
    const insert = function(component, replaceConfig, insertion, childSpec) {
        const child = component.getSystem().build(childSpec);
        attachWith(component, child, insertion);
    };
    const append$2 = function(
        component,
        replaceConfig,
        replaceState,
        appendee,
    ) {
        insert(component, replaceConfig, append, appendee);
    };
    const prepend$1 = function(
        component,
        replaceConfig,
        replaceState,
        prependee,
    ) {
        insert(component, replaceConfig, prepend, prependee);
    };
    const remove$7 = function(component, replaceConfig, replaceState, removee) {
        const children = contents(component);
        const foundChild = find$2(children, function(child) {
            return eq(removee.element(), child.element());
        });
        foundChild.each(detach);
    };
    var contents = function(component, replaceConfig) {
        return component.components();
    };
    const replaceAt = function(
        component,
        replaceConfig,
        replaceState,
        replaceeIndex,
        replacer,
    ) {
        const children = contents(component);
        return Option.from(children[replaceeIndex]).map(function(replacee) {
            remove$7(component, replaceConfig, replaceState, replacee);
            replacer.each(function(r) {
                insert(
                    component,
                    replaceConfig,
                    function(p, c) {
                        appendAt(p, c, replaceeIndex);
                    },
                    r,
                );
            });
            return replacee;
        });
    };
    const replaceBy = function(
        component,
        replaceConfig,
        replaceState,
        replaceePred,
        replacer,
    ) {
        const children = contents(component);
        return findIndex(children, replaceePred).bind(function(replaceeIndex) {
            return replaceAt(
                component,
                replaceConfig,
                replaceState,
                replaceeIndex,
                replacer,
            );
        });
    };

    const ReplaceApis = /* #__PURE__ */ Object.freeze({
        append: append$2,
        prepend: prepend$1,
        remove: remove$7,
        replaceAt,
        replaceBy,
        set: set$8,
        contents,
    });

    const Replacing = create$1({
        fields: [],
        name: 'replacing',
        apis: ReplaceApis,
    });

    const transpose = function(obj) {
        return tupleMap(obj, function(v, k) {
            return {
                k: v,
                v: k,
            };
        });
    };
    var trace = function(items, byItem, byMenu, finish) {
        return readOptFrom$1(byMenu, finish)
            .bind(function(triggerItem) {
                return readOptFrom$1(items, triggerItem).bind(function(
                    triggerMenu,
                ) {
                    const rest = trace(items, byItem, byMenu, triggerMenu);
                    return Option.some([triggerMenu].concat(rest));
                });
            })
            .getOr([]);
    };
    const generate$5 = function(menus, expansions) {
        const items = {};
        each(menus, function(menuItems, menu) {
            each$1(menuItems, function(item) {
                items[item] = menu;
            });
        });
        const byItem = expansions;
        const byMenu = transpose(expansions);
        const menuPaths = map(byMenu, function(_triggerItem, submenu) {
            return [submenu].concat(trace(items, byItem, byMenu, submenu));
        });
        return map(items, function(menu) {
            return readOptFrom$1(menuPaths, menu).getOr([menu]);
        });
    };

    const init$3 = function() {
        const expansions = Cell({});
        const menus = Cell({});
        const paths = Cell({});
        const primary = Cell(Option.none());
        const directory = Cell({});
        const clear = function() {
            expansions.set({});
            menus.set({});
            paths.set({});
            primary.set(Option.none());
        };
        const isClear = function() {
            return primary.get().isNone();
        };
        const setMenuBuilt = function(menuName, built) {
            let _a;
            menus.set({
                ...menus.get(),
                ...((_a = {}),
                (_a[menuName] = {
                    type: 'prepared',
                    menu: built,
                }),
                _a),
            });
        };
        const setContents = function(sPrimary, sMenus, sExpansions, dir) {
            primary.set(Option.some(sPrimary));
            expansions.set(sExpansions);
            menus.set(sMenus);
            directory.set(dir);
            const sPaths = generate$5(dir, sExpansions);
            paths.set(sPaths);
        };
        const getTriggeringItem = function(menuValue) {
            return find(expansions.get(), function(v, k) {
                return v === menuValue;
            });
        };
        const getTriggerData = function(menuValue, getItemByValue, path) {
            return getPreparedMenu(menuValue).bind(function(menu) {
                return getTriggeringItem(menuValue).bind(function(
                    triggeringItemValue,
                ) {
                    return getItemByValue(triggeringItemValue).map(function(
                        triggeredItem,
                    ) {
                        return {
                            triggeredMenu: menu,
                            triggeringItem: triggeredItem,
                            triggeringPath: path,
                        };
                    });
                });
            });
        };
        const getTriggeringPath = function(itemValue, getItemByValue) {
            const extraPath = filter(lookupItem(itemValue).toArray(), function(
                menuValue,
            ) {
                return getPreparedMenu(menuValue).isSome();
            });
            return readOptFrom$1(paths.get(), itemValue).bind(function(path) {
                const revPath = reverse(extraPath.concat(path));
                const triggers = bind(revPath, function(menuValue, menuIndex) {
                    return getTriggerData(
                        menuValue,
                        getItemByValue,
                        revPath.slice(0, menuIndex + 1),
                    ).fold(
                        function() {
                            return primary.get().is(menuValue)
                                ? []
                                : [Option.none()];
                        },
                        function(data) {
                            return [Option.some(data)];
                        },
                    );
                });
                return sequence(triggers);
            });
        };
        const expand = function(itemValue) {
            return readOptFrom$1(expansions.get(), itemValue).map(function(
                menu,
            ) {
                const current = readOptFrom$1(paths.get(), itemValue).getOr([]);
                return [menu].concat(current);
            });
        };
        const collapse = function(itemValue) {
            return readOptFrom$1(paths.get(), itemValue).bind(function(path) {
                return path.length > 1
                    ? Option.some(path.slice(1))
                    : Option.none();
            });
        };
        const refresh = function(itemValue) {
            return readOptFrom$1(paths.get(), itemValue);
        };
        var getPreparedMenu = function(menuValue) {
            return lookupMenu(menuValue).bind(extractPreparedMenu);
        };
        var lookupMenu = function(menuValue) {
            return readOptFrom$1(menus.get(), menuValue);
        };
        var lookupItem = function(itemValue) {
            return readOptFrom$1(expansions.get(), itemValue);
        };
        const otherMenus = function(path) {
            const menuValues = directory.get();
            return difference(keys(menuValues), path);
        };
        const getPrimary = function() {
            return primary.get().bind(getPreparedMenu);
        };
        const getMenus = function() {
            return menus.get();
        };
        return {
            setMenuBuilt,
            setContents,
            expand,
            refresh,
            collapse,
            lookupMenu,
            lookupItem,
            otherMenus,
            getPrimary,
            getMenus,
            clear,
            isClear,
            getTriggeringPath,
        };
    };
    var extractPreparedMenu = function(prep) {
        return prep.type === 'prepared'
            ? Option.some(prep.menu)
            : Option.none();
    };
    const LayeredState = {
        init: init$3,
        extractPreparedMenu,
    };

    const make$3 = function(detail, rawUiSpec) {
        const submenuParentItems = Cell(Option.none());
        const buildMenus = function(container, primaryName, menus) {
            return map(menus, function(spec, name) {
                const makeSketch = function() {
                    return Menu.sketch({
                        dom: spec.dom,
                        ...spec,
                        value: name,
                        items: spec.items,
                        markers: detail.markers,
                        fakeFocus: detail.fakeFocus,
                        onHighlight: detail.onHighlight,
                        focusManager: detail.fakeFocus ? highlights() : dom(),
                    });
                };
                return name === primaryName
                    ? {
                          type: 'prepared',
                          menu: container.getSystem().build(makeSketch()),
                      }
                    : {
                          type: 'notbuilt',
                          nbMenu: makeSketch,
                      };
            });
        };
        const layeredState = LayeredState.init();
        const setup = function(container) {
            const componentMap = buildMenus(
                container,
                detail.data.primary,
                detail.data.menus,
            );
            const directory = toDirectory();
            layeredState.setContents(
                detail.data.primary,
                componentMap,
                detail.data.expansions,
                directory,
            );
            return layeredState.getPrimary();
        };
        const getItemValue = function(item) {
            return Representing.getValue(item).value;
        };
        const getItemByValue = function(container, menus, itemValue) {
            return findMap(menus, function(menu) {
                if (!menu.getSystem().isConnected()) {
                    return Option.none();
                }
                const candidates = Highlighting.getCandidates(menu);
                return find$2(candidates, function(c) {
                    return getItemValue(c) === itemValue;
                });
            });
        };
        var toDirectory = function(container) {
            return map(detail.data.menus, function(data, menuName) {
                return bind(data.items, function(item) {
                    return item.type === 'separator' ? [] : [item.data.value];
                });
            });
        };
        const setActiveMenu = function(container, menu) {
            Highlighting.highlight(container, menu);
            Highlighting.getHighlighted(menu)
                .orThunk(function() {
                    return Highlighting.getFirst(menu);
                })
                .each(function(item) {
                    dispatch(container, item.element(), focusItem());
                });
        };
        const getMenus = function(state, menuValues) {
            return cat(
                map$1(menuValues, function(mv) {
                    return state.lookupMenu(mv).bind(function(prep) {
                        return prep.type === 'prepared'
                            ? Option.some(prep.menu)
                            : Option.none();
                    });
                }),
            );
        };
        const closeOthers = function(container, state, path) {
            const others = getMenus(state, state.otherMenus(path));
            each$1(others, function(o) {
                remove$6(o.element(), [detail.markers.backgroundMenu]);
                if (!detail.stayInDom) {
                    Replacing.remove(container, o);
                }
            });
        };
        const getSubmenuParents = function(container) {
            return submenuParentItems.get().getOrThunk(function() {
                const r = {};
                const items = descendants(
                    container.element(),
                    `.${detail.markers.item}`,
                );
                const parentItems = filter(items, function(i) {
                    return get(i, 'aria-haspopup') === 'true';
                });
                each$1(parentItems, function(i) {
                    container
                        .getSystem()
                        .getByDom(i)
                        .each(function(itemComp) {
                            const key = getItemValue(itemComp);
                            r[key] = itemComp;
                        });
                });
                submenuParentItems.set(Option.some(r));
                return r;
            });
        };
        const updateAriaExpansions = function(container, path) {
            const parentItems = getSubmenuParents(container);
            each(parentItems, function(v, k) {
                const expanded = contains(path, k);
                set(v.element(), 'aria-expanded', expanded);
            });
        };
        const updateMenuPath = function(container, state, path) {
            return Option.from(path[0]).bind(function(latestMenuName) {
                return state
                    .lookupMenu(latestMenuName)
                    .bind(function(menuPrep) {
                        if (menuPrep.type === 'notbuilt') {
                            return Option.none();
                        }
                        const activeMenu = menuPrep.menu;
                        const rest = getMenus(state, path.slice(1));
                        each$1(rest, function(r) {
                            add$2(r.element(), detail.markers.backgroundMenu);
                        });
                        if (!inBody(activeMenu.element())) {
                            Replacing.append(container, premade$1(activeMenu));
                        }
                        remove$6(activeMenu.element(), [
                            detail.markers.backgroundMenu,
                        ]);
                        setActiveMenu(container, activeMenu);
                        closeOthers(container, state, path);
                        return Option.some(activeMenu);
                    });
            });
        };
        let ExpandHighlightDecision;
        (function(ExpandHighlightDecision) {
            ExpandHighlightDecision[
                (ExpandHighlightDecision.HighlightSubmenu = 0)
            ] = 'HighlightSubmenu';
            ExpandHighlightDecision[
                (ExpandHighlightDecision.HighlightParent = 1)
            ] = 'HighlightParent';
        })(ExpandHighlightDecision || (ExpandHighlightDecision = {}));
        const buildIfRequired = function(container, menuName, menuPrep) {
            if (menuPrep.type === 'notbuilt') {
                const menu = container.getSystem().build(menuPrep.nbMenu());
                layeredState.setMenuBuilt(menuName, menu);
                return menu;
            }
            return menuPrep.menu;
        };
        const expandRight = function(container, item, decision) {
            if (decision === void 0) {
                decision = ExpandHighlightDecision.HighlightSubmenu;
            }
            const value = getItemValue(item);
            return layeredState.expand(value).bind(function(path) {
                updateAriaExpansions(container, path);
                return Option.from(path[0]).bind(function(menuName) {
                    return layeredState
                        .lookupMenu(menuName)
                        .bind(function(activeMenuPrep) {
                            const activeMenu = buildIfRequired(
                                container,
                                menuName,
                                activeMenuPrep,
                            );
                            if (!inBody(activeMenu.element())) {
                                Replacing.append(
                                    container,
                                    premade$1(activeMenu),
                                );
                            }
                            detail.onOpenSubmenu(
                                container,
                                item,
                                activeMenu,
                                reverse(path),
                            );
                            if (
                                decision ===
                                ExpandHighlightDecision.HighlightSubmenu
                            ) {
                                Highlighting.highlightFirst(activeMenu);
                                return updateMenuPath(
                                    container,
                                    layeredState,
                                    path,
                                );
                            }
                            Highlighting.dehighlightAll(activeMenu);
                            return Option.some(item);
                        });
                });
            });
        };
        const collapseLeft = function(container, item) {
            const value = getItemValue(item);
            return layeredState.collapse(value).bind(function(path) {
                updateAriaExpansions(container, path);
                return updateMenuPath(container, layeredState, path).map(
                    function(activeMenu) {
                        detail.onCollapseMenu(container, item, activeMenu);
                        return activeMenu;
                    },
                );
            });
        };
        const updateView = function(container, item) {
            const value = getItemValue(item);
            return layeredState.refresh(value).bind(function(path) {
                updateAriaExpansions(container, path);
                return updateMenuPath(container, layeredState, path);
            });
        };
        const onRight = function(container, item) {
            return inside(item.element())
                ? Option.none()
                : expandRight(
                      container,
                      item,
                      ExpandHighlightDecision.HighlightSubmenu,
                  );
        };
        const onLeft = function(container, item) {
            return inside(item.element())
                ? Option.none()
                : collapseLeft(container, item);
        };
        const onEscape = function(container, item) {
            return collapseLeft(container, item).orThunk(function() {
                return detail.onEscape(container, item).map(function() {
                    return container;
                });
            });
        };
        const keyOnItem = function(f) {
            return function(container, simulatedEvent) {
                return closest$2(
                    simulatedEvent.getSource(),
                    `.${detail.markers.item}`,
                ).bind(function(target) {
                    return container
                        .getSystem()
                        .getByDom(target)
                        .toOption()
                        .bind(function(item) {
                            return f(container, item).map(function() {
                                return true;
                            });
                        });
                });
            };
        };
        const events = derive(
            [
                run(focus$4(), function(sandbox, simulatedEvent) {
                    const item = simulatedEvent.event().item();
                    layeredState
                        .lookupItem(getItemValue(item))
                        .each(function() {
                            const menu = simulatedEvent.event().menu();
                            Highlighting.highlight(sandbox, menu);
                            const value = getItemValue(
                                simulatedEvent.event().item(),
                            );
                            layeredState.refresh(value).each(function(path) {
                                return closeOthers(sandbox, layeredState, path);
                            });
                        });
                }),
                runOnExecute(function(component, simulatedEvent) {
                    const target = simulatedEvent.event().target();
                    component
                        .getSystem()
                        .getByDom(target)
                        .each(function(item) {
                            const itemValue = getItemValue(item);
                            if (itemValue.indexOf('collapse-item') === 0) {
                                collapseLeft(component, item);
                            }
                            expandRight(
                                component,
                                item,
                                ExpandHighlightDecision.HighlightSubmenu,
                            ).fold(
                                function() {
                                    detail.onExecute(component, item);
                                },
                                function() {},
                            );
                        });
                }),
                runOnAttached(function(container, simulatedEvent) {
                    setup(container).each(function(primary) {
                        Replacing.append(container, premade$1(primary));
                        detail.onOpenMenu(container, primary);
                        if (detail.highlightImmediately) {
                            setActiveMenu(container, primary);
                        }
                    });
                }),
            ].concat(
                detail.navigateOnHover
                    ? [
                          run(hover(), function(sandbox, simulatedEvent) {
                              const item = simulatedEvent.event().item();
                              updateView(sandbox, item);
                              expandRight(
                                  sandbox,
                                  item,
                                  ExpandHighlightDecision.HighlightParent,
                              );
                              detail.onHover(sandbox, item);
                          }),
                      ]
                    : [],
            ),
        );
        const getActiveItem = function(container) {
            return Highlighting.getHighlighted(container).bind(
                Highlighting.getHighlighted,
            );
        };
        const collapseMenuApi = function(container) {
            getActiveItem(container).each(function(currentItem) {
                collapseLeft(container, currentItem);
            });
        };
        const highlightPrimary = function(container) {
            layeredState.getPrimary().each(function(primary) {
                setActiveMenu(container, primary);
            });
        };
        const extractMenuFromContainer = function(container) {
            return Option.from(container.components()[0]).filter(function(
                comp,
            ) {
                return get(comp.element(), 'role') === 'menu';
            });
        };
        const repositionMenus = function(container) {
            const maybeActivePrimary = layeredState
                .getPrimary()
                .bind(function(primary) {
                    return getActiveItem(container)
                        .bind(function(currentItem) {
                            const itemValue = getItemValue(currentItem);
                            const allMenus = values(layeredState.getMenus());
                            const preparedMenus = cat(
                                map$1(
                                    allMenus,
                                    LayeredState.extractPreparedMenu,
                                ),
                            );
                            return layeredState.getTriggeringPath(
                                itemValue,
                                function(v) {
                                    return getItemByValue(
                                        container,
                                        preparedMenus,
                                        v,
                                    );
                                },
                            );
                        })
                        .map(function(triggeringPath) {
                            return {
                                primary,
                                triggeringPath,
                            };
                        });
                });
            maybeActivePrimary.fold(
                function() {
                    extractMenuFromContainer(container).each(function(
                        primaryMenu,
                    ) {
                        detail.onRepositionMenu(container, primaryMenu, []);
                    });
                },
                function(_a) {
                    const { primary } = _a;
                    const { triggeringPath } = _a;
                    detail.onRepositionMenu(container, primary, triggeringPath);
                },
            );
        };
        const apis = {
            collapseMenu: collapseMenuApi,
            highlightPrimary,
            repositionMenus,
        };
        return {
            uid: detail.uid,
            dom: detail.dom,
            markers: detail.markers,
            behaviours: augment(detail.tmenuBehaviours, [
                Keying.config({
                    mode: 'special',
                    onRight: keyOnItem(onRight),
                    onLeft: keyOnItem(onLeft),
                    onEscape: keyOnItem(onEscape),
                    focusIn(container, keyInfo) {
                        layeredState.getPrimary().each(function(primary) {
                            dispatch(container, primary.element(), focusItem());
                        });
                    },
                }),
                Highlighting.config({
                    highlightClass: detail.markers.selectedMenu,
                    itemClass: detail.markers.menu,
                }),
                Composing.config({
                    find(container) {
                        return Highlighting.getHighlighted(container);
                    },
                }),
                Replacing.config({}),
            ]),
            eventOrder: detail.eventOrder,
            apis,
            events,
        };
    };
    const collapseItem = constant('collapse-item');

    const tieredData = function(primary, menus, expansions) {
        return {
            primary,
            menus,
            expansions,
        };
    };
    const singleData = function(name, menu) {
        return {
            primary: name,
            menus: wrap$1(name, menu),
            expansions: {},
        };
    };
    const collapseItem$1 = function(text) {
        return {
            value: generate$1(collapseItem()),
            meta: { text },
        };
    };
    const tieredMenu = single$2({
        name: 'TieredMenu',
        configFields: [
            onStrictKeyboardHandler('onExecute'),
            onStrictKeyboardHandler('onEscape'),
            onStrictHandler('onOpenMenu'),
            onStrictHandler('onOpenSubmenu'),
            onStrictHandler('onRepositionMenu'),
            onHandler('onCollapseMenu'),
            defaulted$1('highlightImmediately', true),
            strictObjOf('data', [
                strict$1('primary'),
                strict$1('menus'),
                strict$1('expansions'),
            ]),
            defaulted$1('fakeFocus', false),
            onHandler('onHighlight'),
            onHandler('onHover'),
            tieredMenuMarkers(),
            strict$1('dom'),
            defaulted$1('navigateOnHover', true),
            defaulted$1('stayInDom', false),
            field$1('tmenuBehaviours', [
                Keying,
                Highlighting,
                Composing,
                Replacing,
            ]),
            defaulted$1('eventOrder', {}),
        ],
        apis: {
            collapseMenu(apis, tmenu) {
                apis.collapseMenu(tmenu);
            },
            highlightPrimary(apis, tmenu) {
                apis.highlightPrimary(tmenu);
            },
            repositionMenus(apis, tmenu) {
                apis.repositionMenus(tmenu);
            },
        },
        factory: make$3,
        extraApis: {
            tieredData,
            singleData,
            collapseItem: collapseItem$1,
        },
    });

    const findRoute = function(component, transConfig, transState, route) {
        return readOptFrom$1(transConfig.routes, route.start).bind(function(
            sConfig,
        ) {
            return readOptFrom$1(sConfig, route.destination);
        });
    };
    const getTransition = function(comp, transConfig, transState) {
        const route = getCurrentRoute(comp, transConfig);
        return route.bind(function(r) {
            return getTransitionOf(comp, transConfig, transState, r);
        });
    };
    var getTransitionOf = function(comp, transConfig, transState, route) {
        return findRoute(comp, transConfig, transState, route).bind(function(
            r,
        ) {
            return r.transition.map(function(t) {
                return {
                    transition: t,
                    route: r,
                };
            });
        });
    };
    const disableTransition = function(comp, transConfig, transState) {
        getTransition(comp, transConfig, transState).each(function(
            routeTransition,
        ) {
            const t = routeTransition.transition;
            remove$4(comp.element(), t.transitionClass);
            remove$1(comp.element(), transConfig.destinationAttr);
        });
    };
    const getNewRoute = function(comp, transConfig, transState, destination) {
        return {
            start: get(comp.element(), transConfig.stateAttr),
            destination,
        };
    };
    var getCurrentRoute = function(comp, transConfig, transState) {
        const el = comp.element();
        return has$1(el, transConfig.destinationAttr)
            ? Option.some({
                  start: get(comp.element(), transConfig.stateAttr),
                  destination: get(comp.element(), transConfig.destinationAttr),
              })
            : Option.none();
    };
    const jumpTo = function(comp, transConfig, transState, destination) {
        disableTransition(comp, transConfig, transState);
        if (
            has$1(comp.element(), transConfig.stateAttr) &&
            get(comp.element(), transConfig.stateAttr) !== destination
        ) {
            transConfig.onFinish(comp, destination);
        }
        set(comp.element(), transConfig.stateAttr, destination);
    };
    const fasttrack = function(comp, transConfig, transState, destination) {
        if (has$1(comp.element(), transConfig.destinationAttr)) {
            set(
                comp.element(),
                transConfig.stateAttr,
                get(comp.element(), transConfig.destinationAttr),
            );
            remove$1(comp.element(), transConfig.destinationAttr);
        }
    };
    const progressTo = function(comp, transConfig, transState, destination) {
        fasttrack(comp, transConfig);
        const route = getNewRoute(comp, transConfig, transState, destination);
        getTransitionOf(comp, transConfig, transState, route).fold(
            function() {
                jumpTo(comp, transConfig, transState, destination);
            },
            function(routeTransition) {
                disableTransition(comp, transConfig, transState);
                const t = routeTransition.transition;
                add$2(comp.element(), t.transitionClass);
                set(comp.element(), transConfig.destinationAttr, destination);
            },
        );
    };
    const getState$1 = function(comp, transConfig, transState) {
        const e = comp.element();
        return has$1(e, transConfig.stateAttr)
            ? Option.some(get(e, transConfig.stateAttr))
            : Option.none();
    };

    const TransitionApis = /* #__PURE__ */ Object.freeze({
        findRoute,
        disableTransition,
        getCurrentRoute,
        jumpTo,
        progressTo,
        getState: getState$1,
    });

    const events$9 = function(transConfig, transState) {
        return derive([
            run(transitionend(), function(component, simulatedEvent) {
                const raw = simulatedEvent.event().raw();
                getCurrentRoute(component, transConfig).each(function(route) {
                    findRoute(component, transConfig, transState, route).each(
                        function(rInfo) {
                            rInfo.transition.each(function(rTransition) {
                                if (raw.propertyName === rTransition.property) {
                                    jumpTo(
                                        component,
                                        transConfig,
                                        transState,
                                        route.destination,
                                    );
                                    transConfig.onTransition(component, route);
                                }
                            });
                        },
                    );
                });
            }),
            runOnAttached(function(comp, se) {
                jumpTo(comp, transConfig, transState, transConfig.initialState);
            }),
        ]);
    };

    const ActiveTransitioning = /* #__PURE__ */ Object.freeze({
        events: events$9,
    });

    const TransitionSchema = [
        defaulted$1('destinationAttr', 'data-transitioning-destination'),
        defaulted$1('stateAttr', 'data-transitioning-state'),
        strict$1('initialState'),
        onHandler('onTransition'),
        onHandler('onFinish'),
        strictOf(
            'routes',
            setOf$1(
                Result.value,
                setOf$1(
                    Result.value,
                    objOfOnly([
                        optionObjOfOnly('transition', [
                            strict$1('property'),
                            strict$1('transitionClass'),
                        ]),
                    ]),
                ),
            ),
        ),
    ];

    const createRoutes = function(routes) {
        const r = {};
        each(routes, function(v, k) {
            const waypoints = k.split('<->');
            r[waypoints[0]] = wrap$1(waypoints[1], v);
            r[waypoints[1]] = wrap$1(waypoints[0], v);
        });
        return r;
    };
    const createBistate = function(first, second, transitions) {
        return wrapAll$1([
            {
                key: first,
                value: wrap$1(second, transitions),
            },
            {
                key: second,
                value: wrap$1(first, transitions),
            },
        ]);
    };
    const createTristate = function(first, second, third, transitions) {
        return wrapAll$1([
            {
                key: first,
                value: wrapAll$1([
                    {
                        key: second,
                        value: transitions,
                    },
                    {
                        key: third,
                        value: transitions,
                    },
                ]),
            },
            {
                key: second,
                value: wrapAll$1([
                    {
                        key: first,
                        value: transitions,
                    },
                    {
                        key: third,
                        value: transitions,
                    },
                ]),
            },
            {
                key: third,
                value: wrapAll$1([
                    {
                        key: first,
                        value: transitions,
                    },
                    {
                        key: second,
                        value: transitions,
                    },
                ]),
            },
        ]);
    };
    const Transitioning = create$1({
        fields: TransitionSchema,
        name: 'transitioning',
        active: ActiveTransitioning,
        apis: TransitionApis,
        extra: {
            createRoutes,
            createBistate,
            createTristate,
        },
    });

    const scrollable = Styles.resolve('scrollable');
    const register = function(element) {
        add$2(element, scrollable);
    };
    const deregister = function(element) {
        remove$4(element, scrollable);
    };
    const Scrollable = {
        register,
        deregister,
        scrollable: constant(scrollable),
    };

    const getValue$4 = function(item) {
        return readOptFrom$1(item, 'format').getOr(item.title);
    };
    const convert$1 = function(formats, memMenuThunk) {
        const mainMenu = makeMenu(
            'Styles',
            [].concat(
                map$1(formats.items, function(k) {
                    return makeItem(
                        getValue$4(k),
                        k.title,
                        k.isSelected(),
                        k.getPreview(),
                        hasKey$1(formats.expansions, getValue$4(k)),
                    );
                }),
            ),
            memMenuThunk,
            false,
        );
        const submenus = map(formats.menus, function(menuItems, menuName) {
            const items = map$1(menuItems, function(item) {
                return makeItem(
                    getValue$4(item),
                    item.title,
                    item.isSelected !== undefined ? item.isSelected() : false,
                    item.getPreview !== undefined ? item.getPreview() : '',
                    hasKey$1(formats.expansions, getValue$4(item)),
                );
            });
            return makeMenu(menuName, items, memMenuThunk, true);
        });
        const menus = deepMerge(submenus, wrap$1('styles', mainMenu));
        const tmenu = tieredMenu.tieredData(
            'styles',
            menus,
            formats.expansions,
        );
        return { tmenu };
    };
    var makeItem = function(value, text, selected, preview, isMenu) {
        return {
            data: {
                value,
                text,
            },
            type: 'item',
            dom: {
                tag: 'div',
                classes: isMenu ? [Styles.resolve('styles-item-is-menu')] : [],
            },
            toggling: {
                toggleOnExecute: false,
                toggleClass: Styles.resolve('format-matches'),
                selected,
            },
            itemBehaviours: derive$1(
                isMenu
                    ? []
                    : [
                          Receivers.format(value, function(comp, status) {
                              const toggle = status
                                  ? Toggling.on
                                  : Toggling.off;
                              toggle(comp);
                          }),
                      ],
            ),
            components: [
                {
                    dom: {
                        tag: 'div',
                        attributes: { style: preview },
                        innerHtml: text,
                    },
                },
            ],
        };
    };
    var makeMenu = function(value, items, memMenuThunk, collapsable) {
        return {
            value,
            dom: { tag: 'div' },
            components: [
                Button.sketch({
                    dom: {
                        tag: 'div',
                        classes: [Styles.resolve('styles-collapser')],
                    },
                    components: collapsable
                        ? [
                              {
                                  dom: {
                                      tag: 'span',
                                      classes: [
                                          Styles.resolve(
                                              'styles-collapse-icon',
                                          ),
                                      ],
                                  },
                              },
                              text(value),
                          ]
                        : [text(value)],
                    action(item) {
                        if (collapsable) {
                            const comp = memMenuThunk().get(item);
                            tieredMenu.collapseMenu(comp);
                        }
                    },
                }),
                {
                    dom: {
                        tag: 'div',
                        classes: [
                            Styles.resolve('styles-menu-items-container'),
                        ],
                    },
                    components: [Menu.parts().items({})],
                    behaviours: derive$1([
                        config('adhoc-scrollable-menu', [
                            runOnAttached(function(component, simulatedEvent) {
                                set$3(
                                    component.element(),
                                    'overflow-y',
                                    'auto',
                                );
                                set$3(
                                    component.element(),
                                    '-webkit-overflow-scrolling',
                                    'touch',
                                );
                                Scrollable.register(component.element());
                            }),
                            runOnDetached(function(component) {
                                remove$5(component.element(), 'overflow-y');
                                remove$5(
                                    component.element(),
                                    '-webkit-overflow-scrolling',
                                );
                                Scrollable.deregister(component.element());
                            }),
                        ]),
                    ]),
                },
            ],
            items,
            menuBehaviours: derive$1([
                Transitioning.config({
                    initialState: 'after',
                    routes: Transitioning.createTristate(
                        'before',
                        'current',
                        'after',
                        {
                            transition: {
                                property: 'transform',
                                transitionClass: 'transitioning',
                            },
                        },
                    ),
                }),
            ]),
        };
    };
    const sketch$8 = function(settings) {
        const dataset = convert$1(settings.formats, function() {
            return memMenu;
        });
        var memMenu = record(
            tieredMenu.sketch({
                dom: {
                    tag: 'div',
                    classes: [Styles.resolve('styles-menu')],
                },
                components: [],
                fakeFocus: true,
                stayInDom: true,
                onExecute(tmenu, item) {
                    const v = Representing.getValue(item);
                    settings.handle(item, v.value);
                    return Option.none();
                },
                onEscape() {
                    return Option.none();
                },
                onOpenMenu(container, menu) {
                    const w = get$6(container.element());
                    set$4(menu.element(), w);
                    Transitioning.jumpTo(menu, 'current');
                },
                onOpenSubmenu(container, item, submenu) {
                    const w = get$6(container.element());
                    const menu = ancestor$1(
                        item.element(),
                        '[role="menu"]',
                    ).getOrDie('hacky');
                    const menuComp = container
                        .getSystem()
                        .getByDom(menu)
                        .getOrDie();
                    set$4(submenu.element(), w);
                    Transitioning.progressTo(menuComp, 'before');
                    Transitioning.jumpTo(submenu, 'after');
                    Transitioning.progressTo(submenu, 'current');
                },
                onCollapseMenu(container, item, menu) {
                    const submenu = ancestor$1(
                        item.element(),
                        '[role="menu"]',
                    ).getOrDie('hacky');
                    const submenuComp = container
                        .getSystem()
                        .getByDom(submenu)
                        .getOrDie();
                    Transitioning.progressTo(submenuComp, 'after');
                    Transitioning.progressTo(menu, 'current');
                },
                navigateOnHover: false,
                highlightImmediately: true,
                data: dataset.tmenu,
                markers: {
                    backgroundMenu: Styles.resolve('styles-background-menu'),
                    menu: Styles.resolve('styles-menu'),
                    selectedMenu: Styles.resolve('styles-selected-menu'),
                    item: Styles.resolve('styles-item'),
                    selectedItem: Styles.resolve('styles-selected-item'),
                },
            }),
        );
        return memMenu.asSpec();
    };
    const StylesMenu = { sketch: sketch$8 };

    const getFromExpandingItem = function(item) {
        const newItem = deepMerge(exclude$1(item, ['items']), { menu: true });
        const rest = expand(item.items);
        const newMenus = deepMerge(rest.menus, wrap$1(item.title, rest.items));
        const newExpansions = deepMerge(
            rest.expansions,
            wrap$1(item.title, item.title),
        );
        return {
            item: newItem,
            menus: newMenus,
            expansions: newExpansions,
        };
    };
    const getFromItem = function(item) {
        return hasKey$1(item, 'items')
            ? getFromExpandingItem(item)
            : {
                  item,
                  menus: {},
                  expansions: {},
              };
    };
    var expand = function(items) {
        return foldr(
            items,
            function(acc, item) {
                const newData = getFromItem(item);
                return {
                    menus: deepMerge(acc.menus, newData.menus),
                    items: [newData.item].concat(acc.items),
                    expansions: deepMerge(acc.expansions, newData.expansions),
                };
            },
            {
                menus: {},
                expansions: {},
                items: [],
            },
        );
    };
    const StyleConversions = { expand };

    const register$1 = function(editor, settings) {
        const isSelectedFor = function(format) {
            return function() {
                return editor.formatter.match(format);
            };
        };
        const getPreview = function(format) {
            return function() {
                const styles = editor.formatter.getCssText(format);
                return styles;
            };
        };
        const enrichSupported = function(item) {
            return deepMerge(item, {
                isSelected: isSelectedFor(item.format),
                getPreview: getPreview(item.format),
            });
        };
        const enrichMenu = function(item) {
            return deepMerge(item, {
                isSelected: constant(false),
                getPreview: constant(''),
            });
        };
        const enrichCustom = function(item) {
            const formatName = generate$1(item.title);
            const newItem = deepMerge(item, {
                format: formatName,
                isSelected: isSelectedFor(formatName),
                getPreview: getPreview(formatName),
            });
            editor.formatter.register(formatName, newItem);
            return newItem;
        };
        const formats = readOptFrom$1(settings, 'style_formats').getOr(
            DefaultStyleFormats,
        );
        var doEnrich = function(items) {
            return map$1(items, function(item) {
                if (hasKey$1(item, 'items')) {
                    const newItems = doEnrich(item.items);
                    return deepMerge(enrichMenu(item), { items: newItems });
                }
                if (hasKey$1(item, 'format')) {
                    return enrichSupported(item);
                }
                return enrichCustom(item);
            });
        };
        return doEnrich(formats);
    };
    const prune = function(editor, formats) {
        var doPrune = function(items) {
            return bind(items, function(item) {
                if (item.items !== undefined) {
                    const newItems = doPrune(item.items);
                    return newItems.length > 0 ? [item] : [];
                }
                const keep = hasKey$1(item, 'format')
                    ? editor.formatter.canApply(item.format)
                    : true;
                return keep ? [item] : [];
            });
        };
        const prunedItems = doPrune(formats);
        return StyleConversions.expand(prunedItems);
    };
    const ui = function(editor, formats, onDone) {
        const pruned = prune(editor, formats);
        return StylesMenu.sketch({
            formats: pruned,
            handle(item, value) {
                editor.undoManager.transact(function() {
                    if (Toggling.isOn(item)) {
                        editor.formatter.remove(value);
                    } else {
                        editor.formatter.apply(value);
                    }
                });
                onDone();
            },
        });
    };
    const StyleFormats = {
        register: register$1,
        ui,
    };

    const defaults = [
        'undo',
        'bold',
        'italic',
        'link',
        'image',
        'bullist',
        'styleselect',
    ];
    const extract$1 = function(rawToolbar) {
        const toolbar = rawToolbar.replace(/\|/g, ' ').trim();
        return toolbar.length > 0 ? toolbar.split(/\s+/) : [];
    };
    var identifyFromArray = function(toolbar) {
        return bind(toolbar, function(item) {
            return isArray(item) ? identifyFromArray(item) : extract$1(item);
        });
    };
    const identify = function(settings) {
        const toolbar =
            settings.toolbar !== undefined ? settings.toolbar : defaults;
        return isArray(toolbar)
            ? identifyFromArray(toolbar)
            : extract$1(toolbar);
    };
    const setup = function(realm, editor) {
        const commandSketch = function(name) {
            return function() {
                return Buttons.forToolbarCommand(editor, name);
            };
        };
        const stateCommandSketch = function(name) {
            return function() {
                return Buttons.forToolbarStateCommand(editor, name);
            };
        };
        const actionSketch = function(name, query, action) {
            return function() {
                return Buttons.forToolbarStateAction(
                    editor,
                    name,
                    query,
                    action,
                );
            };
        };
        const undo = commandSketch('undo');
        const redo = commandSketch('redo');
        const bold = stateCommandSketch('bold');
        const italic = stateCommandSketch('italic');
        const underline = stateCommandSketch('underline');
        const removeformat = commandSketch('removeformat');
        const link = function() {
            return sketch$7(realm, editor);
        };
        const unlink = actionSketch('unlink', 'link', function() {
            editor.execCommand('unlink', null, false);
        });
        const image = function() {
            return sketch$4(editor);
        };
        const bullist = actionSketch('unordered-list', 'ul', function() {
            editor.execCommand('InsertUnorderedList', null, false);
        });
        const numlist = actionSketch('ordered-list', 'ol', function() {
            editor.execCommand('InsertOrderedList', null, false);
        });
        const fontsizeselect = function() {
            return sketch$3(realm, editor);
        };
        const forecolor = function() {
            return ColorSlider.sketch(realm, editor);
        };
        const styleFormats = StyleFormats.register(editor, editor.settings);
        const styleFormatsMenu = function() {
            return StyleFormats.ui(editor, styleFormats, function() {
                editor.fire('scrollIntoView');
            });
        };
        const styleselect = function() {
            return Buttons.forToolbar(
                'style-formats',
                function(button) {
                    editor.fire('toReading');
                    realm
                        .dropup()
                        .appear(styleFormatsMenu, Toggling.on, button);
                },
                derive$1([
                    Toggling.config({
                        toggleClass: Styles.resolve('toolbar-button-selected'),
                        toggleOnExecute: false,
                        aria: { mode: 'pressed' },
                    }),
                    Receiving.config({
                        channels: wrapAll$1([
                            Receivers.receive(
                                TinyChannels.orientationChanged(),
                                Toggling.off,
                            ),
                            Receivers.receive(
                                TinyChannels.dropupDismissed(),
                                Toggling.off,
                            ),
                        ]),
                    }),
                ]),
                editor,
            );
        };
        const feature = function(prereq, sketch) {
            return {
                isSupported() {
                    const { buttons } = editor.ui.registry.getAll();
                    return prereq.forall(function(p) {
                        return hasKey$1(buttons, p);
                    });
                },
                sketch,
            };
        };
        return {
            undo: feature(Option.none(), undo),
            redo: feature(Option.none(), redo),
            bold: feature(Option.none(), bold),
            italic: feature(Option.none(), italic),
            underline: feature(Option.none(), underline),
            removeformat: feature(Option.none(), removeformat),
            link: feature(Option.none(), link),
            unlink: feature(Option.none(), unlink),
            image: feature(Option.none(), image),
            bullist: feature(Option.some('bullist'), bullist),
            numlist: feature(Option.some('numlist'), numlist),
            fontsizeselect: feature(Option.none(), fontsizeselect),
            forecolor: feature(Option.none(), forecolor),
            styleselect: feature(Option.none(), styleselect),
        };
    };
    const detect$4 = function(settings, features) {
        const itemNames = identify(settings);
        const present = {};
        return bind(itemNames, function(iName) {
            const r =
                !hasKey$1(present, iName) &&
                hasKey$1(features, iName) &&
                features[iName].isSupported()
                    ? [features[iName].sketch()]
                    : [];
            present[iName] = true;
            return r;
        });
    };
    const Features = {
        identify,
        setup,
        detect: detect$4,
    };

    const mkEvent = function(target, x, y, stop, prevent, kill, raw) {
        return {
            target: constant(target),
            x: constant(x),
            y: constant(y),
            stop,
            prevent,
            kill,
            raw: constant(raw),
        };
    };
    const fromRawEvent = function(rawEvent) {
        const target = Element.fromDom(rawEvent.target);
        const stop = function() {
            rawEvent.stopPropagation();
        };
        const prevent = function() {
            rawEvent.preventDefault();
        };
        const kill = compose(prevent, stop);
        return mkEvent(
            target,
            rawEvent.clientX,
            rawEvent.clientY,
            stop,
            prevent,
            kill,
            rawEvent,
        );
    };
    const handle = function(filter, handler) {
        return function(rawEvent) {
            if (!filter(rawEvent)) {
                return;
            }
            handler(fromRawEvent(rawEvent));
        };
    };
    const binder = function(element, event, filter, handler, useCapture) {
        const wrapped = handle(filter, handler);
        element.dom().addEventListener(event, wrapped, useCapture);
        return { unbind: curry(unbind, element, event, wrapped, useCapture) };
    };
    const bind$2 = function(element, event, filter, handler) {
        return binder(element, event, filter, handler, false);
    };
    const capture = function(element, event, filter, handler) {
        return binder(element, event, filter, handler, true);
    };
    var unbind = function(element, event, handler, useCapture) {
        element.dom().removeEventListener(event, handler, useCapture);
    };

    const filter$1 = constant(true);
    const bind$3 = function(element, event, handler) {
        return bind$2(element, event, filter$1, handler);
    };
    const capture$1 = function(element, event, handler) {
        return capture(element, event, filter$1, handler);
    };

    const global$4 = tinymce.util.Tools.resolve('tinymce.util.Delay');

    const INTERVAL = 50;
    const INSURANCE = 1000 / INTERVAL;
    const get$a = function(outerWindow) {
        const isPortrait = outerWindow.matchMedia('(orientation: portrait)')
            .matches;
        return { isPortrait: constant(isPortrait) };
    };
    const getActualWidth = function(outerWindow) {
        const isIos = detect$3().os.isiOS();
        const isPortrait = get$a(outerWindow).isPortrait();
        return isIos && !isPortrait
            ? outerWindow.screen.height
            : outerWindow.screen.width;
    };
    const onChange = function(outerWindow, listeners) {
        const win = Element.fromDom(outerWindow);
        let poller = null;
        const change = function() {
            global$4.clearInterval(poller);
            const orientation = get$a(outerWindow);
            listeners.onChange(orientation);
            onAdjustment(function() {
                listeners.onReady(orientation);
            });
        };
        const orientationHandle = bind$3(win, 'orientationchange', change);
        var onAdjustment = function(f) {
            global$4.clearInterval(poller);
            const flag = outerWindow.innerHeight;
            let insurance = 0;
            poller = global$4.setInterval(function() {
                if (flag !== outerWindow.innerHeight) {
                    global$4.clearInterval(poller);
                    f(Option.some(outerWindow.innerHeight));
                } else if (insurance > INSURANCE) {
                    global$4.clearInterval(poller);
                    f(Option.none());
                }
                insurance++;
            }, INTERVAL);
        };
        const destroy = function() {
            orientationHandle.unbind();
        };
        return {
            onAdjustment,
            destroy,
        };
    };
    const Orientation = {
        get: get$a,
        onChange,
        getActualWidth,
    };

    function DelayedFunction(fun, delay) {
        let ref = null;
        const schedule = function() {
            const args = [];
            for (let _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            ref = domGlobals.setTimeout(function() {
                fun.apply(null, args);
                ref = null;
            }, delay);
        };
        const cancel = function() {
            if (ref !== null) {
                domGlobals.clearTimeout(ref);
                ref = null;
            }
        };
        return {
            cancel,
            schedule,
        };
    }

    const SIGNIFICANT_MOVE = 5;
    const LONGPRESS_DELAY = 400;
    const getTouch = function(event) {
        const raw = event.raw();
        if (raw.touches === undefined || raw.touches.length !== 1) {
            return Option.none();
        }
        return Option.some(raw.touches[0]);
    };
    const isFarEnough = function(touch, data) {
        const distX = Math.abs(touch.clientX - data.x());
        const distY = Math.abs(touch.clientY - data.y());
        return distX > SIGNIFICANT_MOVE || distY > SIGNIFICANT_MOVE;
    };
    const monitor = function(settings) {
        const startData = Cell(Option.none());
        const longpressFired = Cell(false);
        const longpress$1 = DelayedFunction(function(event) {
            settings.triggerEvent(longpress(), event);
            longpressFired.set(true);
        }, LONGPRESS_DELAY);
        const handleTouchstart = function(event) {
            getTouch(event).each(function(touch) {
                longpress$1.cancel();
                const data = {
                    x: constant(touch.clientX),
                    y: constant(touch.clientY),
                    target: event.target,
                };
                longpress$1.schedule(event);
                longpressFired.set(false);
                startData.set(Option.some(data));
            });
            return Option.none();
        };
        const handleTouchmove = function(event) {
            longpress$1.cancel();
            getTouch(event).each(function(touch) {
                startData.get().each(function(data) {
                    if (isFarEnough(touch, data)) {
                        startData.set(Option.none());
                    }
                });
            });
            return Option.none();
        };
        const handleTouchend = function(event) {
            longpress$1.cancel();
            const isSame = function(data) {
                return eq(data.target(), event.target());
            };
            return startData
                .get()
                .filter(isSame)
                .map(function(data) {
                    if (longpressFired.get()) {
                        event.prevent();
                        return false;
                    }
                    return settings.triggerEvent(tap(), event);
                });
        };
        const handlers = wrapAll$1([
            {
                key: touchstart(),
                value: handleTouchstart,
            },
            {
                key: touchmove(),
                value: handleTouchmove,
            },
            {
                key: touchend(),
                value: handleTouchend,
            },
        ]);
        const fireIfReady = function(event, type) {
            return readOptFrom$1(handlers, type).bind(function(handler) {
                return handler(event);
            });
        };
        return { fireIfReady };
    };

    const monitor$1 = function(editorApi) {
        const tapEvent = monitor({
            triggerEvent(type, evt) {
                editorApi.onTapContent(evt);
            },
        });
        const onTouchend = function() {
            return bind$3(editorApi.body(), 'touchend', function(evt) {
                tapEvent.fireIfReady(evt, 'touchend');
            });
        };
        const onTouchmove = function() {
            return bind$3(editorApi.body(), 'touchmove', function(evt) {
                tapEvent.fireIfReady(evt, 'touchmove');
            });
        };
        const fireTouchstart = function(evt) {
            tapEvent.fireIfReady(evt, 'touchstart');
        };
        return {
            fireTouchstart,
            onTouchend,
            onTouchmove,
        };
    };
    const TappingEvent = { monitor: monitor$1 };

    const isAndroid6 = detect$3().os.version.major >= 6;
    const initEvents = function(editorApi, toolstrip, alloy) {
        const tapping = TappingEvent.monitor(editorApi);
        const outerDoc = owner(toolstrip);
        const isRanged = function(sel) {
            return (
                !eq(sel.start(), sel.finish()) ||
                sel.soffset() !== sel.foffset()
            );
        };
        const hasRangeInUi = function() {
            return active(outerDoc)
                .filter(function(input) {
                    return name(input) === 'input';
                })
                .exists(function(input) {
                    return (
                        input.dom().selectionStart !== input.dom().selectionEnd
                    );
                });
        };
        const updateMargin = function() {
            const rangeInContent =
                editorApi
                    .doc()
                    .dom()
                    .hasFocus() && editorApi.getSelection().exists(isRanged);
            alloy
                .getByDom(toolstrip)
                .each(
                    (rangeInContent || hasRangeInUi()) === true
                        ? Toggling.on
                        : Toggling.off,
                );
        };
        const listeners = [
            bind$3(editorApi.body(), 'touchstart', function(evt) {
                editorApi.onTouchContent();
                tapping.fireTouchstart(evt);
            }),
            tapping.onTouchmove(),
            tapping.onTouchend(),
            bind$3(toolstrip, 'touchstart', function(evt) {
                editorApi.onTouchToolstrip();
            }),
            editorApi.onToReading(function() {
                blur(editorApi.body());
            }),
            editorApi.onToEditing(noop),
            editorApi.onScrollToCursor(function(tinyEvent) {
                tinyEvent.preventDefault();
                editorApi.getCursorBox().each(function(bounds) {
                    const cWin = editorApi.win();
                    const isOutside =
                        bounds.top() > cWin.innerHeight ||
                        bounds.bottom() > cWin.innerHeight;
                    const cScrollBy = isOutside
                        ? bounds.bottom() - cWin.innerHeight + 50
                        : 0;
                    if (cScrollBy !== 0) {
                        cWin.scrollTo(
                            cWin.pageXOffset,
                            cWin.pageYOffset + cScrollBy,
                        );
                    }
                });
            }),
        ].concat(
            isAndroid6 === true
                ? []
                : [
                      bind$3(
                          Element.fromDom(editorApi.win()),
                          'blur',
                          function() {
                              alloy.getByDom(toolstrip).each(Toggling.off);
                          },
                      ),
                      bind$3(outerDoc, 'select', updateMargin),
                      bind$3(editorApi.doc(), 'selectionchange', updateMargin),
                  ],
        );
        const destroy = function() {
            each$1(listeners, function(l) {
                l.unbind();
            });
        };
        return { destroy };
    };
    const AndroidEvents = { initEvents };

    const safeParse = function(element, attribute) {
        const parsed = parseInt(get(element, attribute), 10);
        return isNaN(parsed) ? 0 : parsed;
    };
    const DataAttributes = { safeParse };

    function NodeValue(is, name) {
        const get = function(element) {
            if (!is(element)) {
                throw new Error(`Can only get ${name} value of a ${name} node`);
            }
            return getOption(element).getOr('');
        };
        var getOption = function(element) {
            return is(element)
                ? Option.from(element.dom().nodeValue)
                : Option.none();
        };
        const set = function(element, value) {
            if (!is(element)) {
                throw new Error(
                    `Can only set raw ${name} value of a ${name} node`,
                );
            }
            element.dom().nodeValue = value;
        };
        return {
            get,
            getOption,
            set,
        };
    }

    const api$3 = NodeValue(isText, 'text');
    const get$b = function(element) {
        return api$3.get(element);
    };
    const getOption = function(element) {
        return api$3.getOption(element);
    };

    const getEnd = function(element) {
        return name(element) === 'img'
            ? 1
            : getOption(element).fold(
                  function() {
                      return children(element).length;
                  },
                  function(v) {
                      return v.length;
                  },
              );
    };
    const NBSP = '\xA0';
    const isTextNodeWithCursorPosition = function(el) {
        return getOption(el)
            .filter(function(text) {
                return text.trim().length !== 0 || text.indexOf(NBSP) > -1;
            })
            .isSome();
    };
    const elementsWithCursorPosition = ['img', 'br'];
    const isCursorPosition = function(elem) {
        const hasCursorPosition = isTextNodeWithCursorPosition(elem);
        return (
            hasCursorPosition ||
            contains(elementsWithCursorPosition, name(elem))
        );
    };

    const create$3 = Immutable('start', 'soffset', 'finish', 'foffset');
    const SimRange = { create: create$3 };

    const adt$4 = Adt.generate([
        { before: ['element'] },
        {
            on: ['element', 'offset'],
        },
        { after: ['element'] },
    ]);
    const cata = function(subject, onBefore, onOn, onAfter) {
        return subject.fold(onBefore, onOn, onAfter);
    };
    const getStart = function(situ) {
        return situ.fold(identity, identity, identity);
    };
    const before$1 = adt$4.before;
    const on$1 = adt$4.on;
    const after$1 = adt$4.after;
    const Situ = {
        before: before$1,
        on: on$1,
        after: after$1,
        cata,
        getStart,
    };

    const adt$5 = Adt.generate([
        { domRange: ['rng'] },
        {
            relative: ['startSitu', 'finishSitu'],
        },
        {
            exact: ['start', 'soffset', 'finish', 'foffset'],
        },
    ]);
    const exactFromRange = function(simRange) {
        return adt$5.exact(
            simRange.start(),
            simRange.soffset(),
            simRange.finish(),
            simRange.foffset(),
        );
    };
    const getStart$1 = function(selection) {
        return selection.match({
            domRange(rng) {
                return Element.fromDom(rng.startContainer);
            },
            relative(startSitu, finishSitu) {
                return Situ.getStart(startSitu);
            },
            exact(start, soffset, finish, foffset) {
                return start;
            },
        });
    };
    const { domRange } = adt$5;
    const { relative } = adt$5;
    const { exact } = adt$5;
    const getWin = function(selection) {
        const start = getStart$1(selection);
        return defaultView(start);
    };
    const range$1 = SimRange.create;
    const Selection = {
        domRange,
        relative,
        exact,
        exactFromRange,
        getWin,
        range: range$1,
    };

    const setStart = function(rng, situ) {
        situ.fold(
            function(e) {
                rng.setStartBefore(e.dom());
            },
            function(e, o) {
                rng.setStart(e.dom(), o);
            },
            function(e) {
                rng.setStartAfter(e.dom());
            },
        );
    };
    const setFinish = function(rng, situ) {
        situ.fold(
            function(e) {
                rng.setEndBefore(e.dom());
            },
            function(e, o) {
                rng.setEnd(e.dom(), o);
            },
            function(e) {
                rng.setEndAfter(e.dom());
            },
        );
    };
    const relativeToNative = function(win, startSitu, finishSitu) {
        const range = win.document.createRange();
        setStart(range, startSitu);
        setFinish(range, finishSitu);
        return range;
    };
    const exactToNative = function(win, start, soffset, finish, foffset) {
        const rng = win.document.createRange();
        rng.setStart(start.dom(), soffset);
        rng.setEnd(finish.dom(), foffset);
        return rng;
    };
    const toRect = function(rect) {
        return {
            left: constant(rect.left),
            top: constant(rect.top),
            right: constant(rect.right),
            bottom: constant(rect.bottom),
            width: constant(rect.width),
            height: constant(rect.height),
        };
    };
    const getFirstRect = function(rng) {
        const rects = rng.getClientRects();
        const rect = rects.length > 0 ? rects[0] : rng.getBoundingClientRect();
        return rect.width > 0 || rect.height > 0
            ? Option.some(rect).map(toRect)
            : Option.none();
    };

    const adt$6 = Adt.generate([
        {
            ltr: ['start', 'soffset', 'finish', 'foffset'],
        },
        {
            rtl: ['start', 'soffset', 'finish', 'foffset'],
        },
    ]);
    const fromRange = function(win, type, range) {
        return type(
            Element.fromDom(range.startContainer),
            range.startOffset,
            Element.fromDom(range.endContainer),
            range.endOffset,
        );
    };
    const getRanges = function(win, selection) {
        return selection.match({
            domRange(rng) {
                return {
                    ltr: constant(rng),
                    rtl: Option.none,
                };
            },
            relative(startSitu, finishSitu) {
                return {
                    ltr: cached(function() {
                        return relativeToNative(win, startSitu, finishSitu);
                    }),
                    rtl: cached(function() {
                        return Option.some(
                            relativeToNative(win, finishSitu, startSitu),
                        );
                    }),
                };
            },
            exact(start, soffset, finish, foffset) {
                return {
                    ltr: cached(function() {
                        return exactToNative(
                            win,
                            start,
                            soffset,
                            finish,
                            foffset,
                        );
                    }),
                    rtl: cached(function() {
                        return Option.some(
                            exactToNative(win, finish, foffset, start, soffset),
                        );
                    }),
                };
            },
        });
    };
    const doDiagnose = function(win, ranges) {
        const rng = ranges.ltr();
        if (rng.collapsed) {
            const reversed = ranges.rtl().filter(function(rev) {
                return rev.collapsed === false;
            });
            return reversed
                .map(function(rev) {
                    return adt$6.rtl(
                        Element.fromDom(rev.endContainer),
                        rev.endOffset,
                        Element.fromDom(rev.startContainer),
                        rev.startOffset,
                    );
                })
                .getOrThunk(function() {
                    return fromRange(win, adt$6.ltr, rng);
                });
        }
        return fromRange(win, adt$6.ltr, rng);
    };
    const diagnose = function(win, selection) {
        const ranges = getRanges(win, selection);
        return doDiagnose(win, ranges);
    };
    const asLtrRange = function(win, selection) {
        const diagnosis = diagnose(win, selection);
        return diagnosis.match({
            ltr(start, soffset, finish, foffset) {
                const rng = win.document.createRange();
                rng.setStart(start.dom(), soffset);
                rng.setEnd(finish.dom(), foffset);
                return rng;
            },
            rtl(start, soffset, finish, foffset) {
                const rng = win.document.createRange();
                rng.setStart(finish.dom(), foffset);
                rng.setEnd(start.dom(), soffset);
                return rng;
            },
        });
    };

    const searchForPoint = function(rectForOffset, x, y, maxX, length) {
        if (length === 0) {
            return 0;
        }
        if (x === maxX) {
            return length - 1;
        }
        let xDelta = maxX;
        for (let i = 1; i < length; i++) {
            const rect = rectForOffset(i);
            const curDeltaX = Math.abs(x - rect.left);
            if (y <= rect.bottom) {
                if (y < rect.top || curDeltaX > xDelta) {
                    return i - 1;
                }
                xDelta = curDeltaX;
            }
        }
        return 0;
    };
    const inRect = function(rect, x, y) {
        return (
            x >= rect.left &&
            x <= rect.right &&
            y >= rect.top &&
            y <= rect.bottom
        );
    };

    const locateOffset = function(doc, textnode, x, y, rect) {
        const rangeForOffset = function(o) {
            const r = doc.dom().createRange();
            r.setStart(textnode.dom(), o);
            r.collapse(true);
            return r;
        };
        const rectForOffset = function(o) {
            const r = rangeForOffset(o);
            return r.getBoundingClientRect();
        };
        const { length } = get$b(textnode);
        const offset = searchForPoint(rectForOffset, x, y, rect.right, length);
        return rangeForOffset(offset);
    };
    const locate$1 = function(doc, node, x, y) {
        const r = doc.dom().createRange();
        r.selectNode(node.dom());
        const rects = r.getClientRects();
        const foundRect = findMap(rects, function(rect) {
            return inRect(rect, x, y) ? Option.some(rect) : Option.none();
        });
        return foundRect.map(function(rect) {
            return locateOffset(doc, node, x, y, rect);
        });
    };

    const searchInChildren = function(doc, node, x, y) {
        const r = doc.dom().createRange();
        const nodes = children(node);
        return findMap(nodes, function(n) {
            r.selectNode(n.dom());
            return inRect(r.getBoundingClientRect(), x, y)
                ? locateNode(doc, n, x, y)
                : Option.none();
        });
    };
    var locateNode = function(doc, node, x, y) {
        return isText(node)
            ? locate$1(doc, node, x, y)
            : searchInChildren(doc, node, x, y);
    };
    const locate$2 = function(doc, node, x, y) {
        const r = doc.dom().createRange();
        r.selectNode(node.dom());
        const rect = r.getBoundingClientRect();
        const boundedX = Math.max(rect.left, Math.min(rect.right, x));
        const boundedY = Math.max(rect.top, Math.min(rect.bottom, y));
        return locateNode(doc, node, boundedX, boundedY);
    };

    const first$1 = function(element) {
        return descendant(element, isCursorPosition);
    };
    const last = function(element) {
        return descendantRtl(element, isCursorPosition);
    };
    var descendantRtl = function(scope, predicate) {
        var descend = function(element) {
            const children$1 = children(element);
            for (let i = children$1.length - 1; i >= 0; i--) {
                const child = children$1[i];
                if (predicate(child)) {
                    return Option.some(child);
                }
                const res = descend(child);
                if (res.isSome()) {
                    return res;
                }
            }
            return Option.none();
        };
        return descend(scope);
    };

    const COLLAPSE_TO_LEFT = true;
    const COLLAPSE_TO_RIGHT = false;
    const getCollapseDirection = function(rect, x) {
        return x - rect.left < rect.right - x
            ? COLLAPSE_TO_LEFT
            : COLLAPSE_TO_RIGHT;
    };
    const createCollapsedNode = function(doc, target, collapseDirection) {
        const r = doc.dom().createRange();
        r.selectNode(target.dom());
        r.collapse(collapseDirection);
        return r;
    };
    const locateInElement = function(doc, node, x) {
        const cursorRange = doc.dom().createRange();
        cursorRange.selectNode(node.dom());
        const rect = cursorRange.getBoundingClientRect();
        const collapseDirection = getCollapseDirection(rect, x);
        const f = collapseDirection === COLLAPSE_TO_LEFT ? first$1 : last;
        return f(node).map(function(target) {
            return createCollapsedNode(doc, target, collapseDirection);
        });
    };
    const locateInEmpty = function(doc, node, x) {
        const rect = node.dom().getBoundingClientRect();
        const collapseDirection = getCollapseDirection(rect, x);
        return Option.some(createCollapsedNode(doc, node, collapseDirection));
    };
    const search$1 = function(doc, node, x) {
        const f = children(node).length === 0 ? locateInEmpty : locateInElement;
        return f(doc, node, x);
    };

    const caretPositionFromPoint = function(doc, x, y) {
        return Option.from(doc.dom().caretPositionFromPoint(x, y)).bind(
            function(pos) {
                if (pos.offsetNode === null) {
                    return Option.none();
                }
                const r = doc.dom().createRange();
                r.setStart(pos.offsetNode, pos.offset);
                r.collapse();
                return Option.some(r);
            },
        );
    };
    const caretRangeFromPoint = function(doc, x, y) {
        return Option.from(doc.dom().caretRangeFromPoint(x, y));
    };
    const searchTextNodes = function(doc, node, x, y) {
        const r = doc.dom().createRange();
        r.selectNode(node.dom());
        const rect = r.getBoundingClientRect();
        const boundedX = Math.max(rect.left, Math.min(rect.right, x));
        const boundedY = Math.max(rect.top, Math.min(rect.bottom, y));
        return locate$2(doc, node, boundedX, boundedY);
    };
    const searchFromPoint = function(doc, x, y) {
        return Element.fromPoint(doc, x, y).bind(function(elem) {
            const fallback = function() {
                return search$1(doc, elem, x);
            };
            return children(elem).length === 0
                ? fallback()
                : searchTextNodes(doc, elem, x, y).orThunk(fallback);
        });
    };
    const availableSearch = document.caretPositionFromPoint
        ? caretPositionFromPoint
        : document.caretRangeFromPoint
        ? caretRangeFromPoint
        : searchFromPoint;

    const beforeSpecial = function(element, offset) {
        const name$1 = name(element);
        if (name$1 === 'input') {
            return Situ.after(element);
        }
        if (!contains(['br', 'img'], name$1)) {
            return Situ.on(element, offset);
        }
        return offset === 0 ? Situ.before(element) : Situ.after(element);
    };
    const preprocessExact = function(start, soffset, finish, foffset) {
        const startSitu = beforeSpecial(start, soffset);
        const finishSitu = beforeSpecial(finish, foffset);
        return Selection.relative(startSitu, finishSitu);
    };

    const makeRange = function(start, soffset, finish, foffset) {
        const doc = owner(start);
        const rng = doc.dom().createRange();
        rng.setStart(start.dom(), soffset);
        rng.setEnd(finish.dom(), foffset);
        return rng;
    };
    const after$2 = function(start, soffset, finish, foffset) {
        const r = makeRange(start, soffset, finish, foffset);
        const same = eq(start, finish) && soffset === foffset;
        return r.collapsed && !same;
    };

    const doSetNativeRange = function(win, rng) {
        Option.from(win.getSelection()).each(function(selection) {
            selection.removeAllRanges();
            selection.addRange(rng);
        });
    };
    const doSetRange = function(win, start, soffset, finish, foffset) {
        const rng = exactToNative(win, start, soffset, finish, foffset);
        doSetNativeRange(win, rng);
    };
    const setLegacyRtlRange = function(
        win,
        selection,
        start,
        soffset,
        finish,
        foffset,
    ) {
        selection.collapse(start.dom(), soffset);
        selection.extend(finish.dom(), foffset);
    };
    const setRangeFromRelative = function(win, relative) {
        return diagnose(win, relative).match({
            ltr(start, soffset, finish, foffset) {
                doSetRange(win, start, soffset, finish, foffset);
            },
            rtl(start, soffset, finish, foffset) {
                const selection = win.getSelection();
                if (selection.setBaseAndExtent) {
                    selection.setBaseAndExtent(
                        start.dom(),
                        soffset,
                        finish.dom(),
                        foffset,
                    );
                } else if (selection.extend) {
                    try {
                        setLegacyRtlRange(
                            win,
                            selection,
                            start,
                            soffset,
                            finish,
                            foffset,
                        );
                    } catch (e) {
                        doSetRange(win, finish, foffset, start, soffset);
                    }
                } else {
                    doSetRange(win, finish, foffset, start, soffset);
                }
            },
        });
    };
    const setExact = function(win, start, soffset, finish, foffset) {
        const relative = preprocessExact(start, soffset, finish, foffset);
        setRangeFromRelative(win, relative);
    };
    const readRange = function(selection) {
        if (selection.rangeCount > 0) {
            const firstRng = selection.getRangeAt(0);
            const lastRng = selection.getRangeAt(selection.rangeCount - 1);
            return Option.some(
                SimRange.create(
                    Element.fromDom(firstRng.startContainer),
                    firstRng.startOffset,
                    Element.fromDom(lastRng.endContainer),
                    lastRng.endOffset,
                ),
            );
        }
        return Option.none();
    };
    const doGetExact = function(selection) {
        const anchor = Element.fromDom(selection.anchorNode);
        const focus = Element.fromDom(selection.focusNode);
        return after$2(
            anchor,
            selection.anchorOffset,
            focus,
            selection.focusOffset,
        )
            ? Option.some(
                  SimRange.create(
                      anchor,
                      selection.anchorOffset,
                      focus,
                      selection.focusOffset,
                  ),
              )
            : readRange(selection);
    };
    const getExact = function(win) {
        return Option.from(win.getSelection())
            .filter(function(sel) {
                return sel.rangeCount > 0;
            })
            .bind(doGetExact);
    };
    const get$c = function(win) {
        return getExact(win).map(function(range) {
            return Selection.exact(
                range.start(),
                range.soffset(),
                range.finish(),
                range.foffset(),
            );
        });
    };
    const getFirstRect$1 = function(win, selection) {
        const rng = asLtrRange(win, selection);
        return getFirstRect(rng);
    };
    const clear$1 = function(win) {
        const selection = win.getSelection();
        selection.removeAllRanges();
    };

    const COLLAPSED_WIDTH = 2;
    const collapsedRect = function(rect) {
        return {
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
            width: constant(COLLAPSED_WIDTH),
            height: rect.height,
        };
    };
    const toRect$1 = function(rawRect) {
        return {
            left: constant(rawRect.left),
            top: constant(rawRect.top),
            right: constant(rawRect.right),
            bottom: constant(rawRect.bottom),
            width: constant(rawRect.width),
            height: constant(rawRect.height),
        };
    };
    const getRectsFromRange = function(range) {
        if (!range.collapsed) {
            return map$1(range.getClientRects(), toRect$1);
        }
        const start_1 = Element.fromDom(range.startContainer);
        return parent(start_1)
            .bind(function(parent) {
                const selection = Selection.exact(
                    start_1,
                    range.startOffset,
                    parent,
                    getEnd(parent),
                );
                const optRect = getFirstRect$1(
                    range.startContainer.ownerDocument.defaultView,
                    selection,
                );
                return optRect.map(collapsedRect).map(pure);
            })
            .getOr([]);
    };
    const getRectangles = function(cWin) {
        const sel = cWin.getSelection();
        return sel !== undefined && sel.rangeCount > 0
            ? getRectsFromRange(sel.getRangeAt(0))
            : [];
    };
    const Rectangles = { getRectangles };

    const autocompleteHack = function() {
        return function(f) {
            global$4.setTimeout(function() {
                f();
            }, 0);
        };
    };
    const resume = function(cWin) {
        cWin.focus();
        const iBody = Element.fromDom(cWin.document.body);
        const inInput = active().exists(function(elem) {
            return contains(['input', 'textarea'], name(elem));
        });
        const transaction = inInput ? autocompleteHack() : apply;
        transaction(function() {
            active().each(blur);
            focus$1(iBody);
        });
    };
    const ResumeEditing = { resume };

    const EXTRA_SPACING = 50;
    const data = `data-${Styles.resolve('last-outer-height')}`;
    const setLastHeight = function(cBody, value) {
        set(cBody, data, value);
    };
    const getLastHeight = function(cBody) {
        return DataAttributes.safeParse(cBody, data);
    };
    const getBoundsFrom = function(rect) {
        return {
            top: constant(rect.top()),
            bottom: constant(rect.top() + rect.height()),
        };
    };
    const getBounds$1 = function(cWin) {
        const rects = Rectangles.getRectangles(cWin);
        return rects.length > 0
            ? Option.some(rects[0]).map(getBoundsFrom)
            : Option.none();
    };
    const findDelta = function(outerWindow, cBody) {
        const last = getLastHeight(cBody);
        const current = outerWindow.innerHeight;
        return last > current ? Option.some(last - current) : Option.none();
    };
    const calculate = function(cWin, bounds, delta) {
        const isOutside =
            bounds.top() > cWin.innerHeight ||
            bounds.bottom() > cWin.innerHeight;
        return isOutside
            ? Math.min(
                  delta,
                  bounds.bottom() - cWin.innerHeight + EXTRA_SPACING,
              )
            : 0;
    };
    const setup$1 = function(outerWindow, cWin) {
        const cBody = Element.fromDom(cWin.document.body);
        const toEditing = function() {
            ResumeEditing.resume(cWin);
        };
        const onResize = bind$3(
            Element.fromDom(outerWindow),
            'resize',
            function() {
                findDelta(outerWindow, cBody).each(function(delta) {
                    getBounds$1(cWin).each(function(bounds) {
                        const cScrollBy = calculate(cWin, bounds, delta);
                        if (cScrollBy !== 0) {
                            cWin.scrollTo(
                                cWin.pageXOffset,
                                cWin.pageYOffset + cScrollBy,
                            );
                        }
                    });
                });
                setLastHeight(cBody, outerWindow.innerHeight);
            },
        );
        setLastHeight(cBody, outerWindow.innerHeight);
        const destroy = function() {
            onResize.unbind();
        };
        return {
            toEditing,
            destroy,
        };
    };
    const AndroidSetup = { setup: setup$1 };

    const getBodyFromFrame = function(frame) {
        return Option.some(
            Element.fromDom(frame.dom().contentWindow.document.body),
        );
    };
    const getDocFromFrame = function(frame) {
        return Option.some(Element.fromDom(frame.dom().contentWindow.document));
    };
    const getWinFromFrame = function(frame) {
        return Option.from(frame.dom().contentWindow);
    };
    const getSelectionFromFrame = function(frame) {
        const optWin = getWinFromFrame(frame);
        return optWin.bind(getExact);
    };
    const getFrame = function(editor) {
        return editor.getFrame();
    };
    const getOrDerive = function(name, f) {
        return function(editor) {
            const g = editor[name].getOrThunk(function() {
                const frame = getFrame(editor);
                return function() {
                    return f(frame);
                };
            });
            return g();
        };
    };
    const getOrListen = function(editor, doc, name, type) {
        return editor[name].getOrThunk(function() {
            return function(handler) {
                return bind$3(doc, type, handler);
            };
        });
    };
    const toRect$2 = function(rect) {
        return {
            left: constant(rect.left),
            top: constant(rect.top),
            right: constant(rect.right),
            bottom: constant(rect.bottom),
            width: constant(rect.width),
            height: constant(rect.height),
        };
    };
    const getActiveApi = function(editor) {
        const frame = getFrame(editor);
        const tryFallbackBox = function(win) {
            const isCollapsed = function(sel) {
                return (
                    eq(sel.start(), sel.finish()) &&
                    sel.soffset() === sel.foffset()
                );
            };
            const toStartRect = function(sel) {
                const rect = sel
                    .start()
                    .dom()
                    .getBoundingClientRect();
                return rect.width > 0 || rect.height > 0
                    ? Option.some(rect).map(toRect$2)
                    : Option.none();
            };
            return getExact(win)
                .filter(isCollapsed)
                .bind(toStartRect);
        };
        return getBodyFromFrame(frame).bind(function(body) {
            return getDocFromFrame(frame).bind(function(doc) {
                return getWinFromFrame(frame).map(function(win) {
                    const html = Element.fromDom(doc.dom().documentElement);
                    const getCursorBox = editor.getCursorBox.getOrThunk(
                        function() {
                            return function() {
                                return get$c(win).bind(function(sel) {
                                    return getFirstRect$1(win, sel).orThunk(
                                        function() {
                                            return tryFallbackBox(win);
                                        },
                                    );
                                });
                            };
                        },
                    );
                    const setSelection = editor.setSelection.getOrThunk(
                        function() {
                            return function(start, soffset, finish, foffset) {
                                setExact(win, start, soffset, finish, foffset);
                            };
                        },
                    );
                    const clearSelection = editor.clearSelection.getOrThunk(
                        function() {
                            return function() {
                                clear$1(win);
                            };
                        },
                    );
                    return {
                        body: constant(body),
                        doc: constant(doc),
                        win: constant(win),
                        html: constant(html),
                        getSelection: curry(getSelectionFromFrame, frame),
                        setSelection,
                        clearSelection,
                        frame: constant(frame),
                        onKeyup: getOrListen(editor, doc, 'onKeyup', 'keyup'),
                        onNodeChanged: getOrListen(
                            editor,
                            doc,
                            'onNodeChanged',
                            'SelectionChange',
                        ),
                        onDomChanged: editor.onDomChanged,
                        onScrollToCursor: editor.onScrollToCursor,
                        onScrollToElement: editor.onScrollToElement,
                        onToReading: editor.onToReading,
                        onToEditing: editor.onToEditing,
                        onToolbarScrollStart: editor.onToolbarScrollStart,
                        onTouchContent: editor.onTouchContent,
                        onTapContent: editor.onTapContent,
                        onTouchToolstrip: editor.onTouchToolstrip,
                        getCursorBox,
                    };
                });
            });
        });
    };
    const PlatformEditor = {
        getBody: getOrDerive('getBody', getBodyFromFrame),
        getDoc: getOrDerive('getDoc', getDocFromFrame),
        getWin: getOrDerive('getWin', getWinFromFrame),
        getSelection: getOrDerive('getSelection', getSelectionFromFrame),
        getFrame,
        getActiveApi,
    };

    const attr = 'data-ephox-mobile-fullscreen-style';
    const siblingStyles = 'display:none!important;';
    const ancestorPosition = 'position:absolute!important;';
    const ancestorStyles =
        'top:0!important;left:0!important;margin:0!important;padding:0!important;width:100%!important;height:100%!important;overflow:visible!important;';
    const bgFallback = 'background-color:rgb(255,255,255)!important;';
    const isAndroid = detect$3().os.isAndroid();
    const matchColor = function(editorBody) {
        const color = get$3(editorBody, 'background-color');
        return color !== undefined && color !== ''
            ? `background-color:${color}!important`
            : bgFallback;
    };
    const clobberStyles = function(container, editorBody) {
        const gatherSibilings = function(element) {
            const siblings = siblings$2(element, '*');
            return siblings;
        };
        const clobber = function(clobberStyle) {
            return function(element) {
                const styles = get(element, 'style');
                const backup =
                    styles === undefined ? 'no-styles' : styles.trim();
                if (backup === clobberStyle) {
                } else {
                    set(element, attr, backup);
                    set(element, 'style', clobberStyle);
                }
            };
        };
        const ancestors = ancestors$1(container, '*');
        const siblings = bind(ancestors, gatherSibilings);
        const bgColor = matchColor(editorBody);
        each$1(siblings, clobber(siblingStyles));
        each$1(ancestors, clobber(ancestorPosition + ancestorStyles + bgColor));
        const containerStyles = isAndroid === true ? '' : ancestorPosition;
        clobber(containerStyles + ancestorStyles + bgColor)(container);
    };
    const restoreStyles = function() {
        const clobberedEls = all$2(`[${attr}]`);
        each$1(clobberedEls, function(element) {
            const restore = get(element, attr);
            if (restore !== 'no-styles') {
                set(element, 'style', restore);
            } else {
                remove$1(element, 'style');
            }
            remove$1(element, attr);
        });
    };
    const Thor = {
        clobberStyles,
        restoreStyles,
    };

    const tag = function() {
        const head = first('head').getOrDie();
        const nu = function() {
            const meta = Element.fromTag('meta');
            set(meta, 'name', 'viewport');
            append(head, meta);
            return meta;
        };
        const element = first('meta[name="viewport"]').getOrThunk(nu);
        const backup = get(element, 'content');
        const maximize = function() {
            set(
                element,
                'content',
                'width=device-width, initial-scale=1.0, user-scalable=no, maximum-scale=1.0',
            );
        };
        const restore = function() {
            if (backup !== undefined && backup !== null && backup.length > 0) {
                set(element, 'content', backup);
            } else {
                set(element, 'content', 'user-scalable=yes');
            }
        };
        return {
            maximize,
            restore,
        };
    };
    const MetaViewport = { tag };

    const create$4 = function(platform, mask) {
        const meta = MetaViewport.tag();
        const androidApi = api$2();
        const androidEvents = api$2();
        const enter = function() {
            mask.hide();
            add$2(platform.container, Styles.resolve('fullscreen-maximized'));
            add$2(platform.container, Styles.resolve('android-maximized'));
            meta.maximize();
            add$2(platform.body, Styles.resolve('android-scroll-reload'));
            androidApi.set(
                AndroidSetup.setup(
                    platform.win,
                    PlatformEditor.getWin(platform.editor).getOrDie('no'),
                ),
            );
            PlatformEditor.getActiveApi(platform.editor).each(function(
                editorApi,
            ) {
                Thor.clobberStyles(platform.container, editorApi.body());
                androidEvents.set(
                    AndroidEvents.initEvents(
                        editorApi,
                        platform.toolstrip,
                        platform.alloy,
                    ),
                );
            });
        };
        const exit = function() {
            meta.restore();
            mask.show();
            remove$4(
                platform.container,
                Styles.resolve('fullscreen-maximized'),
            );
            remove$4(platform.container, Styles.resolve('android-maximized'));
            Thor.restoreStyles();
            remove$4(platform.body, Styles.resolve('android-scroll-reload'));
            androidEvents.clear();
            androidApi.clear();
        };
        return {
            enter,
            exit,
        };
    };
    const AndroidMode = { create: create$4 };

    const first$2 = function(fn, rate) {
        let timer = null;
        const cancel = function() {
            if (timer !== null) {
                domGlobals.clearTimeout(timer);
                timer = null;
            }
        };
        const throttle = function() {
            const args = [];
            for (let _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (timer === null) {
                timer = domGlobals.setTimeout(function() {
                    fn.apply(null, args);
                    timer = null;
                }, rate);
            }
        };
        return {
            cancel,
            throttle,
        };
    };
    const last$1 = function(fn, rate) {
        let timer = null;
        const cancel = function() {
            if (timer !== null) {
                domGlobals.clearTimeout(timer);
                timer = null;
            }
        };
        const throttle = function() {
            const args = [];
            for (let _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (timer !== null) {
                domGlobals.clearTimeout(timer);
            }
            timer = domGlobals.setTimeout(function() {
                fn.apply(null, args);
                timer = null;
            }, rate);
        };
        return {
            cancel,
            throttle,
        };
    };

    const sketch$9 = function(onView, translate) {
        const memIcon = record(
            Container.sketch({
                dom: dom$1(
                    '<div aria-hidden="true" class="${prefix}-mask-tap-icon"></div>',
                ),
                containerBehaviours: derive$1([
                    Toggling.config({
                        toggleClass: Styles.resolve('mask-tap-icon-selected'),
                        toggleOnExecute: false,
                    }),
                ]),
            }),
        );
        const onViewThrottle = first$2(onView, 200);
        return Container.sketch({
            dom: dom$1('<div class="${prefix}-disabled-mask"></div>'),
            components: [
                Container.sketch({
                    dom: dom$1(
                        '<div class="${prefix}-content-container"></div>',
                    ),
                    components: [
                        Button.sketch({
                            dom: dom$1(
                                '<div class="${prefix}-content-tap-section"></div>',
                            ),
                            components: [memIcon.asSpec()],
                            action(button) {
                                onViewThrottle.throttle();
                            },
                            buttonBehaviours: derive$1([
                                Toggling.config({
                                    toggleClass: Styles.resolve(
                                        'mask-tap-icon-selected',
                                    ),
                                }),
                            ]),
                        }),
                    ],
                }),
            ],
        });
    };
    const TapToEditMask = { sketch: sketch$9 };

    const MobileSchema = objOf([
        strictObjOf('editor', [
            strict$1('getFrame'),
            option('getBody'),
            option('getDoc'),
            option('getWin'),
            option('getSelection'),
            option('setSelection'),
            option('clearSelection'),
            option('cursorSaver'),
            option('onKeyup'),
            option('onNodeChanged'),
            option('getCursorBox'),
            strict$1('onDomChanged'),
            defaulted$1('onTouchContent', noop),
            defaulted$1('onTapContent', noop),
            defaulted$1('onTouchToolstrip', noop),
            defaulted$1('onScrollToCursor', constant({ unbind: noop })),
            defaulted$1('onScrollToElement', constant({ unbind: noop })),
            defaulted$1('onToEditing', constant({ unbind: noop })),
            defaulted$1('onToReading', constant({ unbind: noop })),
            defaulted$1('onToolbarScrollStart', identity),
        ]),
        strict$1('socket'),
        strict$1('toolstrip'),
        strict$1('dropup'),
        strict$1('toolbar'),
        strict$1('container'),
        strict$1('alloy'),
        state$1('win', function(spec) {
            return owner(spec.socket).dom().defaultView;
        }),
        state$1('body', function(spec) {
            return Element.fromDom(spec.socket.dom().ownerDocument.body);
        }),
        defaulted$1('translate', identity),
        defaulted$1('setReadOnly', noop),
        defaulted$1('readOnlyOnInit', constant(true)),
    ]);

    const produce = function(raw) {
        const mobile = asRawOrDie(
            'Getting AndroidWebapp schema',
            MobileSchema,
            raw,
        );
        set$3(mobile.toolstrip, 'width', '100%');
        const onTap = function() {
            mobile.setReadOnly(mobile.readOnlyOnInit());
            mode.enter();
        };
        const mask = build$1(TapToEditMask.sketch(onTap, mobile.translate));
        mobile.alloy.add(mask);
        const maskApi = {
            show() {
                mobile.alloy.add(mask);
            },
            hide() {
                mobile.alloy.remove(mask);
            },
        };
        append(mobile.container, mask.element());
        var mode = AndroidMode.create(mobile, maskApi);
        return {
            setReadOnly: mobile.setReadOnly,
            refreshStructure: noop,
            enter: mode.enter,
            exit: mode.exit,
            destroy: noop,
        };
    };
    const AndroidWebapp = { produce };

    const schema$e = constant([
        strict$1('dom'),
        defaulted$1('shell', true),
        field$1('toolbarBehaviours', [Replacing]),
    ]);
    const enhanceGroups = function(detail) {
        return { behaviours: derive$1([Replacing.config({})]) };
    };
    const parts$2 = constant([
        optional({
            name: 'groups',
            overrides: enhanceGroups,
        }),
    ]);

    const factory$4 = function(detail, components, spec, _externals) {
        const setGroups = function(toolbar, groups) {
            getGroupContainer(toolbar).fold(
                function() {
                    domGlobals.console.error(
                        'Toolbar was defined to not be a shell, but no groups container was specified in components',
                    );
                    throw new Error(
                        'Toolbar was defined to not be a shell, but no groups container was specified in components',
                    );
                },
                function(container) {
                    Replacing.set(container, groups);
                },
            );
        };
        var getGroupContainer = function(component) {
            return detail.shell
                ? Option.some(component)
                : getPart(component, detail, 'groups');
        };
        const extra = detail.shell
            ? {
                  behaviours: [Replacing.config({})],
                  components: [],
              }
            : {
                  behaviours: [],
                  components,
              };
        return {
            uid: detail.uid,
            dom: detail.dom,
            components: extra.components,
            behaviours: augment(detail.toolbarBehaviours, extra.behaviours),
            apis: { setGroups },
            domModification: { attributes: { role: 'group' } },
        };
    };
    const Toolbar = composite$1({
        name: 'Toolbar',
        configFields: schema$e(),
        partFields: parts$2(),
        factory: factory$4,
        apis: {
            setGroups(apis, toolbar, groups) {
                apis.setGroups(toolbar, groups);
            },
        },
    });

    const schema$f = constant([
        strict$1('items'),
        markers(['itemSelector']),
        field$1('tgroupBehaviours', [Keying]),
    ]);
    const parts$3 = constant([
        group({
            name: 'items',
            unit: 'item',
        }),
    ]);

    const factory$5 = function(detail, components, spec, _externals) {
        return {
            uid: detail.uid,
            dom: detail.dom,
            components,
            behaviours: augment(detail.tgroupBehaviours, [
                Keying.config({
                    mode: 'flow',
                    selector: detail.markers.itemSelector,
                }),
            ]),
            domModification: { attributes: { role: 'toolbar' } },
        };
    };
    const ToolbarGroup = composite$1({
        name: 'ToolbarGroup',
        configFields: schema$f(),
        partFields: parts$3(),
        factory: factory$5,
    });

    const dataHorizontal = `data-${Styles.resolve('horizontal-scroll')}`;
    const canScrollVertically = function(container) {
        container.dom().scrollTop = 1;
        const result = container.dom().scrollTop !== 0;
        container.dom().scrollTop = 0;
        return result;
    };
    const canScrollHorizontally = function(container) {
        container.dom().scrollLeft = 1;
        const result = container.dom().scrollLeft !== 0;
        container.dom().scrollLeft = 0;
        return result;
    };
    const hasVerticalScroll = function(container) {
        return container.dom().scrollTop > 0 || canScrollVertically(container);
    };
    const hasHorizontalScroll = function(container) {
        return (
            container.dom().scrollLeft > 0 || canScrollHorizontally(container)
        );
    };
    const markAsHorizontal = function(container) {
        set(container, dataHorizontal, 'true');
    };
    const hasScroll = function(container) {
        return get(container, dataHorizontal) === 'true'
            ? hasHorizontalScroll(container)
            : hasVerticalScroll(container);
    };
    const exclusive = function(scope, selector) {
        return bind$3(scope, 'touchmove', function(event) {
            closest$2(event.target(), selector)
                .filter(hasScroll)
                .fold(function() {
                    event.raw().preventDefault();
                }, noop);
        });
    };
    const Scrollables = {
        exclusive,
        markAsHorizontal,
    };

    function ScrollingToolbar() {
        const makeGroup = function(gSpec) {
            const scrollClass =
                gSpec.scrollable === true
                    ? '${prefix}-toolbar-scrollable-group'
                    : '';
            return {
                dom: dom$1(
                    `<div aria-label="${gSpec.label}" class="\${prefix}-toolbar-group ${scrollClass}"></div>`,
                ),
                tgroupBehaviours: derive$1([
                    config(
                        'adhoc-scrollable-toolbar',
                        gSpec.scrollable === true
                            ? [
                                  runOnInit(function(
                                      component,
                                      simulatedEvent,
                                  ) {
                                      set$3(
                                          component.element(),
                                          'overflow-x',
                                          'auto',
                                      );
                                      Scrollables.markAsHorizontal(
                                          component.element(),
                                      );
                                      Scrollable.register(component.element());
                                  }),
                              ]
                            : [],
                    ),
                ]),
                components: [
                    Container.sketch({
                        components: [ToolbarGroup.parts().items({})],
                    }),
                ],
                markers: {
                    itemSelector: `.${Styles.resolve('toolbar-group-item')}`,
                },
                items: gSpec.items,
            };
        };
        const toolbar = build$1(
            Toolbar.sketch({
                dom: dom$1('<div class="${prefix}-toolbar"></div>'),
                components: [Toolbar.parts().groups({})],
                toolbarBehaviours: derive$1([
                    Toggling.config({
                        toggleClass: Styles.resolve('context-toolbar'),
                        toggleOnExecute: false,
                        aria: { mode: 'none' },
                    }),
                    Keying.config({ mode: 'cyclic' }),
                ]),
                shell: true,
            }),
        );
        const wrapper = build$1(
            Container.sketch({
                dom: { classes: [Styles.resolve('toolstrip')] },
                components: [premade$1(toolbar)],
                containerBehaviours: derive$1([
                    Toggling.config({
                        toggleClass: Styles.resolve(
                            'android-selection-context-toolbar',
                        ),
                        toggleOnExecute: false,
                    }),
                ]),
            }),
        );
        const resetGroups = function() {
            Toolbar.setGroups(toolbar, initGroups.get());
            Toggling.off(toolbar);
        };
        var initGroups = Cell([]);
        const setGroups = function(gs) {
            initGroups.set(gs);
            resetGroups();
        };
        const createGroups = function(gs) {
            return map$1(gs, compose(ToolbarGroup.sketch, makeGroup));
        };
        const refresh = function() {};
        const setContextToolbar = function(gs) {
            Toggling.on(toolbar);
            Toolbar.setGroups(toolbar, gs);
        };
        const restoreToolbar = function() {
            if (Toggling.isOn(toolbar)) {
                resetGroups();
            }
        };
        const focus = function() {
            Keying.focusIn(toolbar);
        };
        return {
            wrapper: constant(wrapper),
            toolbar: constant(toolbar),
            createGroups,
            setGroups,
            setContextToolbar,
            restoreToolbar,
            refresh,
            focus,
        };
    }

    const makeEditSwitch = function(webapp) {
        return build$1(
            Button.sketch({
                dom: dom$1(
                    '<div class="${prefix}-mask-edit-icon ${prefix}-icon"></div>',
                ),
                action() {
                    webapp.run(function(w) {
                        w.setReadOnly(false);
                    });
                },
            }),
        );
    };
    const makeSocket = function() {
        return build$1(
            Container.sketch({
                dom: dom$1('<div class="${prefix}-editor-socket"></div>'),
                components: [],
                containerBehaviours: derive$1([Replacing.config({})]),
            }),
        );
    };
    const showEdit = function(socket, switchToEdit) {
        Replacing.append(socket, premade$1(switchToEdit));
    };
    const hideEdit = function(socket, switchToEdit) {
        Replacing.remove(socket, switchToEdit);
    };
    const updateMode = function(socket, switchToEdit, readOnly, root) {
        const swap = readOnly === true ? Swapping.toAlpha : Swapping.toOmega;
        swap(root);
        const f = readOnly ? showEdit : hideEdit;
        f(socket, switchToEdit);
    };
    const CommonRealm = {
        makeEditSwitch,
        makeSocket,
        updateMode,
    };

    const getAnimationRoot = function(component, slideConfig) {
        return slideConfig.getAnimationRoot.fold(
            function() {
                return component.element();
            },
            function(get) {
                return get(component);
            },
        );
    };

    const getDimensionProperty = function(slideConfig) {
        return slideConfig.dimension.property;
    };
    const getDimension = function(slideConfig, elem) {
        return slideConfig.dimension.getDimension(elem);
    };
    const disableTransitions = function(component, slideConfig) {
        const root = getAnimationRoot(component, slideConfig);
        remove$6(root, [slideConfig.shrinkingClass, slideConfig.growingClass]);
    };
    const setShrunk = function(component, slideConfig) {
        remove$4(component.element(), slideConfig.openClass);
        add$2(component.element(), slideConfig.closedClass);
        set$3(component.element(), getDimensionProperty(slideConfig), '0px');
        reflow(component.element());
    };
    const setGrown = function(component, slideConfig) {
        remove$4(component.element(), slideConfig.closedClass);
        add$2(component.element(), slideConfig.openClass);
        remove$5(component.element(), getDimensionProperty(slideConfig));
    };
    const doImmediateShrink = function(
        component,
        slideConfig,
        slideState,
        _calculatedSize,
    ) {
        slideState.setCollapsed();
        set$3(
            component.element(),
            getDimensionProperty(slideConfig),
            getDimension(slideConfig, component.element()),
        );
        reflow(component.element());
        disableTransitions(component, slideConfig);
        setShrunk(component, slideConfig);
        slideConfig.onStartShrink(component);
        slideConfig.onShrunk(component);
    };
    const doStartShrink = function(
        component,
        slideConfig,
        slideState,
        calculatedSize,
    ) {
        const size = calculatedSize.getOrThunk(function() {
            return getDimension(slideConfig, component.element());
        });
        slideState.setCollapsed();
        set$3(component.element(), getDimensionProperty(slideConfig), size);
        reflow(component.element());
        const root = getAnimationRoot(component, slideConfig);
        remove$4(root, slideConfig.growingClass);
        add$2(root, slideConfig.shrinkingClass);
        setShrunk(component, slideConfig);
        slideConfig.onStartShrink(component);
    };
    const doStartSmartShrink = function(component, slideConfig, slideState) {
        const size = getDimension(slideConfig, component.element());
        const shrinker = size === '0px' ? doImmediateShrink : doStartShrink;
        shrinker(component, slideConfig, slideState, Option.some(size));
    };
    const doStartGrow = function(component, slideConfig, slideState) {
        const root = getAnimationRoot(component, slideConfig);
        const wasShrinking = has$2(root, slideConfig.shrinkingClass);
        const beforeSize = getDimension(slideConfig, component.element());
        setGrown(component, slideConfig);
        const fullSize = getDimension(slideConfig, component.element());
        const startPartialGrow = function() {
            set$3(
                component.element(),
                getDimensionProperty(slideConfig),
                beforeSize,
            );
            reflow(component.element());
        };
        const startCompleteGrow = function() {
            setShrunk(component, slideConfig);
        };
        const setStartSize = wasShrinking
            ? startPartialGrow
            : startCompleteGrow;
        setStartSize();
        remove$4(root, slideConfig.shrinkingClass);
        add$2(root, slideConfig.growingClass);
        setGrown(component, slideConfig);
        set$3(component.element(), getDimensionProperty(slideConfig), fullSize);
        slideState.setExpanded();
        slideConfig.onStartGrow(component);
    };
    const refresh = function(component, slideConfig, slideState) {
        if (slideState.isExpanded()) {
            remove$5(component.element(), getDimensionProperty(slideConfig));
            const fullSize = getDimension(slideConfig, component.element());
            set$3(
                component.element(),
                getDimensionProperty(slideConfig),
                fullSize,
            );
        }
    };
    const grow = function(component, slideConfig, slideState) {
        if (!slideState.isExpanded()) {
            doStartGrow(component, slideConfig, slideState);
        }
    };
    const shrink = function(component, slideConfig, slideState) {
        if (slideState.isExpanded()) {
            doStartSmartShrink(component, slideConfig, slideState);
        }
    };
    const immediateShrink = function(component, slideConfig, slideState) {
        if (slideState.isExpanded()) {
            doImmediateShrink(component, slideConfig, slideState);
        }
    };
    const hasGrown = function(component, slideConfig, slideState) {
        return slideState.isExpanded();
    };
    const hasShrunk = function(component, slideConfig, slideState) {
        return slideState.isCollapsed();
    };
    const isGrowing = function(component, slideConfig, slideState) {
        const root = getAnimationRoot(component, slideConfig);
        return has$2(root, slideConfig.growingClass) === true;
    };
    const isShrinking = function(component, slideConfig, slideState) {
        const root = getAnimationRoot(component, slideConfig);
        return has$2(root, slideConfig.shrinkingClass) === true;
    };
    const isTransitioning = function(component, slideConfig, slideState) {
        return (
            isGrowing(component, slideConfig) === true ||
            isShrinking(component, slideConfig) === true
        );
    };
    const toggleGrow = function(component, slideConfig, slideState) {
        const f = slideState.isExpanded() ? doStartSmartShrink : doStartGrow;
        f(component, slideConfig, slideState);
    };

    const SlidingApis = /* #__PURE__ */ Object.freeze({
        refresh,
        grow,
        shrink,
        immediateShrink,
        hasGrown,
        hasShrunk,
        isGrowing,
        isShrinking,
        isTransitioning,
        toggleGrow,
        disableTransitions,
    });

    const exhibit$5 = function(base, slideConfig) {
        const { expanded } = slideConfig;
        return expanded
            ? nu$5({
                  classes: [slideConfig.openClass],
                  styles: {},
              })
            : nu$5({
                  classes: [slideConfig.closedClass],
                  styles: wrap$1(slideConfig.dimension.property, '0px'),
              });
    };
    const events$a = function(slideConfig, slideState) {
        return derive([
            runOnSource(transitionend(), function(component, simulatedEvent) {
                const raw = simulatedEvent.event().raw();
                if (raw.propertyName === slideConfig.dimension.property) {
                    disableTransitions(component, slideConfig);
                    if (slideState.isExpanded()) {
                        remove$5(
                            component.element(),
                            slideConfig.dimension.property,
                        );
                    }
                    const notify = slideState.isExpanded()
                        ? slideConfig.onGrown
                        : slideConfig.onShrunk;
                    notify(component);
                }
            }),
        ]);
    };

    const ActiveSliding = /* #__PURE__ */ Object.freeze({
        exhibit: exhibit$5,
        events: events$a,
    });

    const SlidingSchema = [
        strict$1('closedClass'),
        strict$1('openClass'),
        strict$1('shrinkingClass'),
        strict$1('growingClass'),
        option('getAnimationRoot'),
        onHandler('onShrunk'),
        onHandler('onStartShrink'),
        onHandler('onGrown'),
        onHandler('onStartGrow'),
        defaulted$1('expanded', false),
        strictOf(
            'dimension',
            choose$1('property', {
                width: [
                    output('property', 'width'),
                    output('getDimension', function(elem) {
                        return `${get$6(elem)}px`;
                    }),
                ],
                height: [
                    output('property', 'height'),
                    output('getDimension', function(elem) {
                        return `${get$4(elem)}px`;
                    }),
                ],
            }),
        ),
    ];

    const init$4 = function(spec) {
        const state = Cell(spec.expanded);
        const readState = function() {
            return `expanded: ${state.get()}`;
        };
        return nu$6({
            isExpanded() {
                return state.get() === true;
            },
            isCollapsed() {
                return state.get() === false;
            },
            setCollapsed: curry(state.set, false),
            setExpanded: curry(state.set, true),
            readState,
        });
    };

    const SlidingState = /* #__PURE__ */ Object.freeze({
        init: init$4,
    });

    const Sliding = create$1({
        fields: SlidingSchema,
        name: 'sliding',
        active: ActiveSliding,
        apis: SlidingApis,
        state: SlidingState,
    });

    const build$2 = function(refresh, scrollIntoView) {
        const dropup = build$1(
            Container.sketch({
                dom: {
                    tag: 'div',
                    classes: [Styles.resolve('dropup')],
                },
                components: [],
                containerBehaviours: derive$1([
                    Replacing.config({}),
                    Sliding.config({
                        closedClass: Styles.resolve('dropup-closed'),
                        openClass: Styles.resolve('dropup-open'),
                        shrinkingClass: Styles.resolve('dropup-shrinking'),
                        growingClass: Styles.resolve('dropup-growing'),
                        dimension: { property: 'height' },
                        onShrunk(component) {
                            refresh();
                            scrollIntoView();
                            Replacing.set(component, []);
                        },
                        onGrown(component) {
                            refresh();
                            scrollIntoView();
                        },
                    }),
                    Receivers.orientation(function(component, data) {
                        disappear(noop);
                    }),
                ]),
            }),
        );
        const appear = function(menu, update, component) {
            if (
                Sliding.hasShrunk(dropup) === true &&
                Sliding.isTransitioning(dropup) === false
            ) {
                domGlobals.window.requestAnimationFrame(function() {
                    update(component);
                    Replacing.set(dropup, [menu()]);
                    Sliding.grow(dropup);
                });
            }
        };
        var disappear = function(onReadyToShrink) {
            domGlobals.window.requestAnimationFrame(function() {
                onReadyToShrink();
                Sliding.shrink(dropup);
            });
        };
        return {
            appear,
            disappear,
            component: constant(dropup),
            element: dropup.element,
        };
    };

    const closest$3 = function(scope, selector, isRoot) {
        return closest$2(scope, selector, isRoot).isSome();
    };

    const isDangerous = function(event) {
        const keyEv = event.raw();
        return (
            keyEv.which === BACKSPACE()[0] &&
            !contains(['input', 'textarea'], name(event.target())) &&
            !closest$3(event.target(), '[contenteditable="true"]')
        );
    };
    const isFirefox = detect$3().browser.isFirefox();
    const settingsSchema = objOfOnly([
        strictFunction('triggerEvent'),
        defaulted$1('stopBackspace', true),
    ]);
    const bindFocus = function(container, handler) {
        if (isFirefox) {
            return capture$1(container, 'focus', handler);
        }
        return bind$3(container, 'focusin', handler);
    };
    const bindBlur = function(container, handler) {
        if (isFirefox) {
            return capture$1(container, 'blur', handler);
        }
        return bind$3(container, 'focusout', handler);
    };
    const setup$2 = function(container, rawSettings) {
        const settings = asRawOrDie(
            'Getting GUI events settings',
            settingsSchema,
            rawSettings,
        );
        const pointerEvents = [
            'touchstart',
            'touchmove',
            'touchend',
            'touchcancel',
            'gesturestart',
            'mousedown',
            'mouseup',
            'mouseover',
            'mousemove',
            'mouseout',
            'click',
        ];
        const tapEvent = monitor(settings);
        const simpleEvents = map$1(
            pointerEvents.concat([
                'selectstart',
                'input',
                'contextmenu',
                'change',
                'transitionend',
                'drag',
                'dragstart',
                'dragend',
                'dragenter',
                'dragleave',
                'dragover',
                'drop',
                'keyup',
            ]),
            function(type) {
                return bind$3(container, type, function(event) {
                    tapEvent
                        .fireIfReady(event, type)
                        .each(function(tapStopped) {
                            if (tapStopped) {
                                event.kill();
                            }
                        });
                    const stopped = settings.triggerEvent(type, event);
                    if (stopped) {
                        event.kill();
                    }
                });
            },
        );
        const pasteTimeout = Cell(Option.none());
        const onPaste = bind$3(container, 'paste', function(event) {
            tapEvent.fireIfReady(event, 'paste').each(function(tapStopped) {
                if (tapStopped) {
                    event.kill();
                }
            });
            const stopped = settings.triggerEvent('paste', event);
            if (stopped) {
                event.kill();
            }
            pasteTimeout.set(
                Option.some(
                    domGlobals.setTimeout(function() {
                        settings.triggerEvent(postPaste(), event);
                    }, 0),
                ),
            );
        });
        const onKeydown = bind$3(container, 'keydown', function(event) {
            const stopped = settings.triggerEvent('keydown', event);
            if (stopped) {
                event.kill();
            } else if (settings.stopBackspace === true && isDangerous(event)) {
                event.prevent();
            }
        });
        const onFocusIn = bindFocus(container, function(event) {
            const stopped = settings.triggerEvent('focusin', event);
            if (stopped) {
                event.kill();
            }
        });
        const focusoutTimeout = Cell(Option.none());
        const onFocusOut = bindBlur(container, function(event) {
            const stopped = settings.triggerEvent('focusout', event);
            if (stopped) {
                event.kill();
            }
            focusoutTimeout.set(
                Option.some(
                    domGlobals.setTimeout(function() {
                        settings.triggerEvent(postBlur(), event);
                    }, 0),
                ),
            );
        });
        const unbind = function() {
            each$1(simpleEvents, function(e) {
                e.unbind();
            });
            onKeydown.unbind();
            onFocusIn.unbind();
            onFocusOut.unbind();
            onPaste.unbind();
            pasteTimeout.get().each(domGlobals.clearTimeout);
            focusoutTimeout.get().each(domGlobals.clearTimeout);
        };
        return { unbind };
    };

    const derive$2 = function(rawEvent, rawTarget) {
        const source = readOptFrom$1(rawEvent, 'target')
            .map(function(getTarget) {
                return getTarget();
            })
            .getOr(rawTarget);
        return Cell(source);
    };

    const fromSource = function(event, source) {
        const stopper = Cell(false);
        const cutter = Cell(false);
        const stop = function() {
            stopper.set(true);
        };
        const cut = function() {
            cutter.set(true);
        };
        return {
            stop,
            cut,
            isStopped: stopper.get,
            isCut: cutter.get,
            event: constant(event),
            setSource: source.set,
            getSource: source.get,
        };
    };
    const fromExternal = function(event) {
        const stopper = Cell(false);
        const stop = function() {
            stopper.set(true);
        };
        return {
            stop,
            cut: noop,
            isStopped: stopper.get,
            isCut: constant(false),
            event: constant(event),
            setSource: die('Cannot set source of a broadcasted event'),
            getSource: die('Cannot get source of a broadcasted event'),
        };
    };

    const adt$7 = Adt.generate([
        { stopped: [] },
        { resume: ['element'] },
        { complete: [] },
    ]);
    const doTriggerHandler = function(
        lookup,
        eventType,
        rawEvent,
        target,
        source,
        logger,
    ) {
        const handler = lookup(eventType, target);
        const simulatedEvent = fromSource(rawEvent, source);
        return handler.fold(
            function() {
                logger.logEventNoHandlers(eventType, target);
                return adt$7.complete();
            },
            function(handlerInfo) {
                const descHandler = handlerInfo.descHandler();
                const eventHandler = getCurried(descHandler);
                eventHandler(simulatedEvent);
                if (simulatedEvent.isStopped()) {
                    logger.logEventStopped(
                        eventType,
                        handlerInfo.element(),
                        descHandler.purpose(),
                    );
                    return adt$7.stopped();
                }
                if (simulatedEvent.isCut()) {
                    logger.logEventCut(
                        eventType,
                        handlerInfo.element(),
                        descHandler.purpose(),
                    );
                    return adt$7.complete();
                }
                return parent(handlerInfo.element()).fold(
                    function() {
                        logger.logNoParent(
                            eventType,
                            handlerInfo.element(),
                            descHandler.purpose(),
                        );
                        return adt$7.complete();
                    },
                    function(parent) {
                        logger.logEventResponse(
                            eventType,
                            handlerInfo.element(),
                            descHandler.purpose(),
                        );
                        return adt$7.resume(parent);
                    },
                );
            },
        );
    };
    var doTriggerOnUntilStopped = function(
        lookup,
        eventType,
        rawEvent,
        rawTarget,
        source,
        logger,
    ) {
        return doTriggerHandler(
            lookup,
            eventType,
            rawEvent,
            rawTarget,
            source,
            logger,
        ).fold(
            function() {
                return true;
            },
            function(parent) {
                return doTriggerOnUntilStopped(
                    lookup,
                    eventType,
                    rawEvent,
                    parent,
                    source,
                    logger,
                );
            },
            function() {
                return false;
            },
        );
    };
    const triggerHandler = function(
        lookup,
        eventType,
        rawEvent,
        target,
        logger,
    ) {
        const source = derive$2(rawEvent, target);
        return doTriggerHandler(
            lookup,
            eventType,
            rawEvent,
            target,
            source,
            logger,
        );
    };
    const broadcast = function(listeners, rawEvent, logger) {
        const simulatedEvent = fromExternal(rawEvent);
        each$1(listeners, function(listener) {
            const descHandler = listener.descHandler();
            const handler = getCurried(descHandler);
            handler(simulatedEvent);
        });
        return simulatedEvent.isStopped();
    };
    const triggerUntilStopped = function(lookup, eventType, rawEvent, logger) {
        const rawTarget = rawEvent.target();
        return triggerOnUntilStopped(
            lookup,
            eventType,
            rawEvent,
            rawTarget,
            logger,
        );
    };
    var triggerOnUntilStopped = function(
        lookup,
        eventType,
        rawEvent,
        rawTarget,
        logger,
    ) {
        const source = derive$2(rawEvent, rawTarget);
        return doTriggerOnUntilStopped(
            lookup,
            eventType,
            rawEvent,
            rawTarget,
            source,
            logger,
        );
    };

    const eventHandler = Immutable('element', 'descHandler');
    const broadcastHandler = function(id, handler) {
        return {
            id: constant(id),
            descHandler: constant(handler),
        };
    };
    function EventRegistry() {
        const registry = {};
        const registerId = function(extraArgs, id, events) {
            each(events, function(v, k) {
                const handlers = registry[k] !== undefined ? registry[k] : {};
                handlers[id] = curryArgs(v, extraArgs);
                registry[k] = handlers;
            });
        };
        const findHandler = function(handlers, elem) {
            return read$2(elem).fold(
                function() {
                    return Option.none();
                },
                function(id) {
                    const reader = readOpt$1(id);
                    return handlers.bind(reader).map(function(descHandler) {
                        return eventHandler(elem, descHandler);
                    });
                },
            );
        };
        const filterByType = function(type) {
            return readOptFrom$1(registry, type)
                .map(function(handlers) {
                    return mapToArray(handlers, function(f, id) {
                        return broadcastHandler(id, f);
                    });
                })
                .getOr([]);
        };
        const find = function(isAboveRoot, type, target) {
            const readType = readOpt$1(type);
            const handlers = readType(registry);
            return closest$1(
                target,
                function(elem) {
                    return findHandler(handlers, elem);
                },
                isAboveRoot,
            );
        };
        const unregisterId = function(id) {
            each(registry, function(handlersById, eventName) {
                if (handlersById.hasOwnProperty(id)) {
                    delete handlersById[id];
                }
            });
        };
        return {
            registerId,
            unregisterId,
            filterByType,
            find,
        };
    }

    function Registry() {
        const events = EventRegistry();
        const components = {};
        const readOrTag = function(component) {
            const elem = component.element();
            return read$2(elem).fold(
                function() {
                    return write('uid-', component.element());
                },
                function(uid) {
                    return uid;
                },
            );
        };
        const failOnDuplicate = function(component, tagId) {
            const conflict = components[tagId];
            if (conflict === component) {
                unregister(component);
            } else {
                throw new Error(
                    `The tagId "${tagId}" is already used by: ${element(
                        conflict.element(),
                    )}\nCannot use it for: ${element(component.element())}\n` +
                        `The conflicting element is${
                            inBody(conflict.element()) ? ' ' : ' not '
                        }already in the DOM`,
                );
            }
        };
        const register = function(component) {
            const tagId = readOrTag(component);
            if (hasKey$1(components, tagId)) {
                failOnDuplicate(component, tagId);
            }
            const extraArgs = [component];
            events.registerId(extraArgs, tagId, component.events());
            components[tagId] = component;
        };
        var unregister = function(component) {
            read$2(component.element()).each(function(tagId) {
                delete components[tagId];
                events.unregisterId(tagId);
            });
        };
        const filter = function(type) {
            return events.filterByType(type);
        };
        const find = function(isAboveRoot, type, target) {
            return events.find(isAboveRoot, type, target);
        };
        const getById = function(id) {
            return readOpt$1(id)(components);
        };
        return {
            find,
            filter,
            register,
            unregister,
            getById,
        };
    }

    const takeover = function(root) {
        const isAboveRoot = function(el) {
            return parent(root.element()).fold(
                function() {
                    return true;
                },
                function(parent) {
                    return eq(el, parent);
                },
            );
        };
        const registry = Registry();
        const lookup = function(eventName, target) {
            return registry.find(isAboveRoot, eventName, target);
        };
        const domEvents = setup$2(root.element(), {
            triggerEvent(eventName, event) {
                return monitorEvent(eventName, event.target(), function(
                    logger,
                ) {
                    return triggerUntilStopped(
                        lookup,
                        eventName,
                        event,
                        logger,
                    );
                });
            },
        });
        var systemApi = {
            debugInfo: constant('real'),
            triggerEvent(eventName, target, data) {
                monitorEvent(eventName, target, function(logger) {
                    triggerOnUntilStopped(
                        lookup,
                        eventName,
                        data,
                        target,
                        logger,
                    );
                });
            },
            triggerFocus(target, originator) {
                read$2(target).fold(
                    function() {
                        focus$1(target);
                    },
                    function(_alloyId) {
                        monitorEvent(focus(), target, function(logger) {
                            triggerHandler(
                                lookup,
                                focus(),
                                {
                                    originator: constant(originator),
                                    kill: noop,
                                    prevent: noop,
                                    target: constant(target),
                                },
                                target,
                                logger,
                            );
                        });
                    },
                );
            },
            triggerEscape(comp, simulatedEvent) {
                systemApi.triggerEvent(
                    'keydown',
                    comp.element(),
                    simulatedEvent.event(),
                );
            },
            getByUid(uid) {
                return getByUid(uid);
            },
            getByDom(elem) {
                return getByDom(elem);
            },
            build: build$1,
            addToGui(c) {
                add(c);
            },
            removeFromGui(c) {
                remove$1(c);
            },
            addToWorld(c) {
                addToWorld(c);
            },
            removeFromWorld(c) {
                removeFromWorld(c);
            },
            broadcast(message) {
                broadcast$1(message);
            },
            broadcastOn(channels, message) {
                broadcastOn(channels, message);
            },
            broadcastEvent(eventName, event) {
                broadcastEvent(eventName, event);
            },
            isConnected: constant(true),
        };
        var addToWorld = function(component) {
            component.connect(systemApi);
            if (!isText(component.element())) {
                registry.register(component);
                each$1(component.components(), addToWorld);
                systemApi.triggerEvent(systemInit(), component.element(), {
                    target: constant(component.element()),
                });
            }
        };
        var removeFromWorld = function(component) {
            if (!isText(component.element())) {
                each$1(component.components(), removeFromWorld);
                registry.unregister(component);
            }
            component.disconnect();
        };
        var add = function(component) {
            attach$1(root, component);
        };
        var remove$1 = function(component) {
            detach(component);
        };
        const destroy = function() {
            domEvents.unbind();
            remove(root.element());
        };
        const broadcastData = function(data) {
            const receivers = registry.filter(receive());
            each$1(receivers, function(receiver) {
                const descHandler = receiver.descHandler();
                const handler = getCurried(descHandler);
                handler(data);
            });
        };
        var broadcast$1 = function(message) {
            broadcastData({
                universal: constant(true),
                data: constant(message),
            });
        };
        var broadcastOn = function(channels, message) {
            broadcastData({
                universal: constant(false),
                channels: constant(channels),
                data: constant(message),
            });
        };
        var broadcastEvent = function(eventName, event) {
            const listeners = registry.filter(eventName);
            return broadcast(listeners, event);
        };
        var getByUid = function(uid) {
            return registry.getById(uid).fold(function() {
                return Result.error(
                    new Error(
                        `Could not find component with uid: "${uid}" in system.`,
                    ),
                );
            }, Result.value);
        };
        var getByDom = function(elem) {
            const uid = read$2(elem).getOr('not found');
            return getByUid(uid);
        };
        addToWorld(root);
        return {
            root: constant(root),
            element: root.element,
            destroy,
            add,
            remove: remove$1,
            getByUid,
            getByDom,
            addToWorld,
            removeFromWorld,
            broadcast: broadcast$1,
            broadcastOn,
            broadcastEvent,
        };
    };

    const READ_ONLY_MODE_CLASS = constant(Styles.resolve('readonly-mode'));
    const EDIT_MODE_CLASS = constant(Styles.resolve('edit-mode'));
    function OuterContainer(spec) {
        const root = build$1(
            Container.sketch({
                dom: {
                    classes: [Styles.resolve('outer-container')].concat(
                        spec.classes,
                    ),
                },
                containerBehaviours: derive$1([
                    Swapping.config({
                        alpha: READ_ONLY_MODE_CLASS(),
                        omega: EDIT_MODE_CLASS(),
                    }),
                ]),
            }),
        );
        return takeover(root);
    }

    function AndroidRealm(scrollIntoView) {
        const alloy = OuterContainer({
            classes: [Styles.resolve('android-container')],
        });
        const toolbar = ScrollingToolbar();
        const webapp = api$2();
        const switchToEdit = CommonRealm.makeEditSwitch(webapp);
        const socket = CommonRealm.makeSocket();
        const dropup = build$2(noop, scrollIntoView);
        alloy.add(toolbar.wrapper());
        alloy.add(socket);
        alloy.add(dropup.component());
        const setToolbarGroups = function(rawGroups) {
            const groups = toolbar.createGroups(rawGroups);
            toolbar.setGroups(groups);
        };
        const setContextToolbar = function(rawGroups) {
            const groups = toolbar.createGroups(rawGroups);
            toolbar.setContextToolbar(groups);
        };
        const focusToolbar = function() {
            toolbar.focus();
        };
        const restoreToolbar = function() {
            toolbar.restoreToolbar();
        };
        const init = function(spec) {
            webapp.set(AndroidWebapp.produce(spec));
        };
        const exit = function() {
            webapp.run(function(w) {
                w.exit();
                Replacing.remove(socket, switchToEdit);
            });
        };
        const updateMode = function(readOnly) {
            CommonRealm.updateMode(
                socket,
                switchToEdit,
                readOnly,
                alloy.root(),
            );
        };
        return {
            system: constant(alloy),
            element: alloy.element,
            init,
            exit,
            setToolbarGroups,
            setContextToolbar,
            focusToolbar,
            restoreToolbar,
            updateMode,
            socket: constant(socket),
            dropup: constant(dropup),
        };
    }

    const input$1 = function(parent, operation) {
        const input = Element.fromTag('input');
        setAll$1(input, {
            opacity: '0',
            position: 'absolute',
            top: '-1000px',
            left: '-1000px',
        });
        append(parent, input);
        focus$1(input);
        operation(input);
        remove(input);
    };
    const CaptureBin = { input: input$1 };

    const refreshInput = function(input) {
        const start = input.dom().selectionStart;
        const end = input.dom().selectionEnd;
        const dir = input.dom().selectionDirection;
        global$4.setTimeout(function() {
            input.dom().setSelectionRange(start, end, dir);
            focus$1(input);
        }, 50);
    };
    const refresh$1 = function(winScope) {
        const sel = winScope.getSelection();
        if (sel.rangeCount > 0) {
            const br = sel.getRangeAt(0);
            const r = winScope.document.createRange();
            r.setStart(br.startContainer, br.startOffset);
            r.setEnd(br.endContainer, br.endOffset);
            sel.removeAllRanges();
            sel.addRange(r);
        }
    };
    const CursorRefresh = {
        refreshInput,
        refresh: refresh$1,
    };

    const resume$1 = function(cWin, frame) {
        active().each(function(active) {
            if (!eq(active, frame)) {
                blur(active);
            }
        });
        cWin.focus();
        focus$1(Element.fromDom(cWin.document.body));
        CursorRefresh.refresh(cWin);
    };
    const ResumeEditing$1 = { resume: resume$1 };

    const stubborn = function(outerBody, cWin, page, frame) {
        const toEditing = function() {
            ResumeEditing$1.resume(cWin, frame);
        };
        const toReading = function() {
            CaptureBin.input(outerBody, blur);
        };
        const captureInput = bind$3(page, 'keydown', function(evt) {
            if (!contains(['input', 'textarea'], name(evt.target()))) {
                toEditing();
            }
        });
        const onToolbarTouch = function() {};
        const destroy = function() {
            captureInput.unbind();
        };
        return {
            toReading,
            toEditing,
            onToolbarTouch,
            destroy,
        };
    };
    const timid = function(outerBody, cWin, page, frame) {
        const dismissKeyboard = function() {
            blur(frame);
        };
        const onToolbarTouch = function() {
            dismissKeyboard();
        };
        const toReading = function() {
            dismissKeyboard();
        };
        const toEditing = function() {
            ResumeEditing$1.resume(cWin, frame);
        };
        return {
            toReading,
            toEditing,
            onToolbarTouch,
            destroy: noop,
        };
    };
    const IosKeyboard = {
        stubborn,
        timid,
    };

    const initEvents$1 = function(
        editorApi,
        iosApi,
        toolstrip,
        socket,
        dropup,
    ) {
        const saveSelectionFirst = function() {
            iosApi.run(function(api) {
                api.highlightSelection();
            });
        };
        const refreshIosSelection = function() {
            iosApi.run(function(api) {
                api.refreshSelection();
            });
        };
        const scrollToY = function(yTop, height) {
            const y = yTop - socket.dom().scrollTop;
            iosApi.run(function(api) {
                api.scrollIntoView(y, y + height);
            });
        };
        const scrollToElement = function(target) {
            scrollToY(iosApi, socket);
        };
        const scrollToCursor = function() {
            editorApi.getCursorBox().each(function(box) {
                scrollToY(box.top(), box.height());
            });
        };
        const clearSelection = function() {
            iosApi.run(function(api) {
                api.clearSelection();
            });
        };
        const clearAndRefresh = function() {
            clearSelection();
            refreshThrottle.throttle();
        };
        const refreshView = function() {
            scrollToCursor();
            iosApi.run(function(api) {
                api.syncHeight();
            });
        };
        const reposition = function() {
            const toolbarHeight = get$4(toolstrip);
            iosApi.run(function(api) {
                api.setViewportOffset(toolbarHeight);
            });
            refreshIosSelection();
            refreshView();
        };
        const toEditing = function() {
            iosApi.run(function(api) {
                api.toEditing();
            });
        };
        const toReading = function() {
            iosApi.run(function(api) {
                api.toReading();
            });
        };
        const onToolbarTouch = function(event) {
            iosApi.run(function(api) {
                api.onToolbarTouch(event);
            });
        };
        const tapping = TappingEvent.monitor(editorApi);
        var refreshThrottle = last$1(refreshView, 300);
        const listeners = [
            editorApi.onKeyup(clearAndRefresh),
            editorApi.onNodeChanged(refreshIosSelection),
            editorApi.onDomChanged(refreshThrottle.throttle),
            editorApi.onDomChanged(refreshIosSelection),
            editorApi.onScrollToCursor(function(tinyEvent) {
                tinyEvent.preventDefault();
                refreshThrottle.throttle();
            }),
            editorApi.onScrollToElement(function(event) {
                scrollToElement(event.element());
            }),
            editorApi.onToEditing(toEditing),
            editorApi.onToReading(toReading),
            bind$3(editorApi.doc(), 'touchend', function(touchEvent) {
                if (
                    eq(editorApi.html(), touchEvent.target()) ||
                    eq(editorApi.body(), touchEvent.target())
                );
            }),
            bind$3(toolstrip, 'transitionend', function(transitionEvent) {
                if (transitionEvent.raw().propertyName === 'height') {
                    reposition();
                }
            }),
            capture$1(toolstrip, 'touchstart', function(touchEvent) {
                saveSelectionFirst();
                onToolbarTouch(touchEvent);
                editorApi.onTouchToolstrip();
            }),
            bind$3(editorApi.body(), 'touchstart', function(evt) {
                clearSelection();
                editorApi.onTouchContent();
                tapping.fireTouchstart(evt);
            }),
            tapping.onTouchmove(),
            tapping.onTouchend(),
            bind$3(editorApi.body(), 'click', function(event) {
                event.kill();
            }),
            bind$3(toolstrip, 'touchmove', function() {
                editorApi.onToolbarScrollStart();
            }),
        ];
        const destroy = function() {
            each$1(listeners, function(l) {
                l.unbind();
            });
        };
        return { destroy };
    };
    const IosEvents = { initEvents: initEvents$1 };

    function FakeSelection(win, frame) {
        const doc = win.document;
        const container = Element.fromTag('div');
        add$2(container, Styles.resolve('unfocused-selections'));
        append(Element.fromDom(doc.documentElement), container);
        const onTouch = bind$3(container, 'touchstart', function(event) {
            event.prevent();
            ResumeEditing$1.resume(win, frame);
            clear();
        });
        const make = function(rectangle) {
            const span = Element.fromTag('span');
            add$3(span, [
                Styles.resolve('layer-editor'),
                Styles.resolve('unfocused-selection'),
            ]);
            setAll$1(span, {
                left: `${rectangle.left()}px`,
                top: `${rectangle.top()}px`,
                width: `${rectangle.width()}px`,
                height: `${rectangle.height()}px`,
            });
            return span;
        };
        const update = function() {
            clear();
            const rectangles = Rectangles.getRectangles(win);
            const spans = map$1(rectangles, make);
            append$1(container, spans);
        };
        var clear = function() {
            empty(container);
        };
        const destroy = function() {
            onTouch.unbind();
            remove(container);
        };
        const isActive = function() {
            return children(container).length > 0;
        };
        return {
            update,
            isActive,
            destroy,
            clear,
        };
    }

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
    const Promise$1 = module.exports.boltExport;

    var nu$7 = function(baseFn) {
        let data = Option.none();
        let callbacks = [];
        const map = function(f) {
            return nu$7(function(nCallback) {
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
            each$1(cbs, call);
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
    const pure$1 = function(a) {
        return nu$7(function(callback) {
            callback(a);
        });
    };
    const LazyValue = {
        nu: nu$7,
        pure: pure$1,
    };

    const errorReporter = function(err) {
        domGlobals.setTimeout(function() {
            throw err;
        }, 0);
    };
    var make$4 = function(run) {
        const get = function(callback) {
            run().then(callback, errorReporter);
        };
        const map = function(fab) {
            return make$4(function() {
                return run().then(fab);
            });
        };
        const bind = function(aFutureB) {
            return make$4(function() {
                return run().then(function(v) {
                    return aFutureB(v).toPromise();
                });
            });
        };
        const anonBind = function(futureB) {
            return make$4(function() {
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
            return make$4(function() {
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
    const nu$8 = function(baseFn) {
        return make$4(function() {
            return new Promise$1(baseFn);
        });
    };
    const pure$2 = function(a) {
        return make$4(function() {
            return Promise$1.resolve(a);
        });
    };
    const Future = {
        nu: nu$8,
        pure: pure$2,
    };

    const adjust = function(value, destination, amount) {
        if (Math.abs(value - destination) <= amount) {
            return Option.none();
        }
        if (value < destination) {
            return Option.some(value + amount);
        }
        return Option.some(value - amount);
    };
    const create$5 = function() {
        let interval = null;
        const animate = function(
            getCurrent,
            destination,
            amount,
            increment,
            doFinish,
            rate,
        ) {
            let finished = false;
            const finish = function(v) {
                finished = true;
                doFinish(v);
            };
            global$4.clearInterval(interval);
            const abort = function(v) {
                global$4.clearInterval(interval);
                finish(v);
            };
            interval = global$4.setInterval(function() {
                const value = getCurrent();
                adjust(value, destination, amount).fold(
                    function() {
                        global$4.clearInterval(interval);
                        finish(destination);
                    },
                    function(s) {
                        increment(s, abort);
                        if (!finished) {
                            const newValue = getCurrent();
                            if (
                                newValue !== s ||
                                Math.abs(newValue - destination) >
                                    Math.abs(value - destination)
                            ) {
                                global$4.clearInterval(interval);
                                finish(destination);
                            }
                        }
                    },
                );
            }, rate);
        };
        return { animate };
    };
    const SmoothAnimation = {
        create: create$5,
        adjust,
    };

    const findDevice = function(deviceWidth, deviceHeight) {
        const devices = [
            {
                width: 320,
                height: 480,
                keyboard: {
                    portrait: 300,
                    landscape: 240,
                },
            },
            {
                width: 320,
                height: 568,
                keyboard: {
                    portrait: 300,
                    landscape: 240,
                },
            },
            {
                width: 375,
                height: 667,
                keyboard: {
                    portrait: 305,
                    landscape: 240,
                },
            },
            {
                width: 414,
                height: 736,
                keyboard: {
                    portrait: 320,
                    landscape: 240,
                },
            },
            {
                width: 768,
                height: 1024,
                keyboard: {
                    portrait: 320,
                    landscape: 400,
                },
            },
            {
                width: 1024,
                height: 1366,
                keyboard: {
                    portrait: 380,
                    landscape: 460,
                },
            },
        ];
        return findMap(devices, function(device) {
            return someIf(
                deviceWidth <= device.width && deviceHeight <= device.height,
                device.keyboard,
            );
        }).getOr({
            portrait: deviceHeight / 5,
            landscape: deviceWidth / 4,
        });
    };

    const softKeyboardLimits = function(outerWindow) {
        return findDevice(outerWindow.screen.width, outerWindow.screen.height);
    };
    const accountableKeyboardHeight = function(outerWindow) {
        const portrait = Orientation.get(outerWindow).isPortrait();
        const limits = softKeyboardLimits(outerWindow);
        const keyboard = portrait ? limits.portrait : limits.landscape;
        const visualScreenHeight = portrait
            ? outerWindow.screen.height
            : outerWindow.screen.width;
        return visualScreenHeight - outerWindow.innerHeight > keyboard
            ? 0
            : keyboard;
    };
    const getGreenzone = function(socket, dropup) {
        const outerWindow = owner(socket).dom().defaultView;
        const viewportHeight = get$4(socket) + get$4(dropup);
        const acc = accountableKeyboardHeight(outerWindow);
        return viewportHeight - acc;
    };
    const updatePadding = function(contentBody, socket, dropup) {
        const greenzoneHeight = getGreenzone(socket, dropup);
        const deltaHeight = get$4(socket) + get$4(dropup) - greenzoneHeight;
        set$3(contentBody, 'padding-bottom', `${deltaHeight}px`);
    };
    const DeviceZones = {
        getGreenzone,
        updatePadding,
    };

    const fixture = Adt.generate([
        {
            fixed: ['element', 'property', 'offsetY'],
        },
        {
            scroller: ['element', 'offsetY'],
        },
    ]);
    const yFixedData = `data-${Styles.resolve('position-y-fixed')}`;
    const yFixedProperty = `data-${Styles.resolve('y-property')}`;
    const yScrollingData = `data-${Styles.resolve('scrolling')}`;
    const windowSizeData = `data-${Styles.resolve('last-window-height')}`;
    const getYFixedData = function(element) {
        return DataAttributes.safeParse(element, yFixedData);
    };
    const getYFixedProperty = function(element) {
        return get(element, yFixedProperty);
    };
    const getLastWindowSize = function(element) {
        return DataAttributes.safeParse(element, windowSizeData);
    };
    const classifyFixed = function(element, offsetY) {
        const prop = getYFixedProperty(element);
        return fixture.fixed(element, prop, offsetY);
    };
    const classifyScrolling = function(element, offsetY) {
        return fixture.scroller(element, offsetY);
    };
    const classify = function(element) {
        const offsetY = getYFixedData(element);
        const classifier =
            get(element, yScrollingData) === 'true'
                ? classifyScrolling
                : classifyFixed;
        return classifier(element, offsetY);
    };
    const findFixtures = function(container) {
        const candidates = descendants(container, `[${yFixedData}]`);
        return map$1(candidates, classify);
    };
    const takeoverToolbar = function(toolbar) {
        const oldToolbarStyle = get(toolbar, 'style');
        setAll$1(toolbar, {
            position: 'absolute',
            top: '0px',
        });
        set(toolbar, yFixedData, '0px');
        set(toolbar, yFixedProperty, 'top');
        const restore = function() {
            set(toolbar, 'style', oldToolbarStyle || '');
            remove$1(toolbar, yFixedData);
            remove$1(toolbar, yFixedProperty);
        };
        return { restore };
    };
    const takeoverViewport = function(toolbarHeight, height, viewport) {
        const oldViewportStyle = get(viewport, 'style');
        Scrollable.register(viewport);
        setAll$1(viewport, {
            position: 'absolute',
            height: `${height}px`,
            width: '100%',
            top: `${toolbarHeight}px`,
        });
        set(viewport, yFixedData, `${toolbarHeight}px`);
        set(viewport, yScrollingData, 'true');
        set(viewport, yFixedProperty, 'top');
        const restore = function() {
            Scrollable.deregister(viewport);
            set(viewport, 'style', oldViewportStyle || '');
            remove$1(viewport, yFixedData);
            remove$1(viewport, yScrollingData);
            remove$1(viewport, yFixedProperty);
        };
        return { restore };
    };
    const takeoverDropup = function(dropup, toolbarHeight, viewportHeight) {
        const oldDropupStyle = get(dropup, 'style');
        setAll$1(dropup, {
            position: 'absolute',
            bottom: '0px',
        });
        set(dropup, yFixedData, '0px');
        set(dropup, yFixedProperty, 'bottom');
        const restore = function() {
            set(dropup, 'style', oldDropupStyle || '');
            remove$1(dropup, yFixedData);
            remove$1(dropup, yFixedProperty);
        };
        return { restore };
    };
    const deriveViewportHeight = function(
        viewport,
        toolbarHeight,
        dropupHeight,
    ) {
        const outerWindow = owner(viewport).dom().defaultView;
        const winH = outerWindow.innerHeight;
        set(viewport, windowSizeData, `${winH}px`);
        return winH - toolbarHeight - dropupHeight;
    };
    const takeover$1 = function(viewport, contentBody, toolbar, dropup) {
        const outerWindow = owner(viewport).dom().defaultView;
        const toolbarSetup = takeoverToolbar(toolbar);
        const toolbarHeight = get$4(toolbar);
        const dropupHeight = get$4(dropup);
        const viewportHeight = deriveViewportHeight(
            viewport,
            toolbarHeight,
            dropupHeight,
        );
        const viewportSetup = takeoverViewport(
            toolbarHeight,
            viewportHeight,
            viewport,
        );
        const dropupSetup = takeoverDropup(dropup);
        let isActive = true;
        const restore = function() {
            isActive = false;
            toolbarSetup.restore();
            viewportSetup.restore();
            dropupSetup.restore();
        };
        const isExpanding = function() {
            const currentWinHeight = outerWindow.innerHeight;
            const lastWinHeight = getLastWindowSize(viewport);
            return currentWinHeight > lastWinHeight;
        };
        const refresh = function() {
            if (isActive) {
                const newToolbarHeight = get$4(toolbar);
                const dropupHeight_1 = get$4(dropup);
                const newHeight = deriveViewportHeight(
                    viewport,
                    newToolbarHeight,
                    dropupHeight_1,
                );
                set(viewport, yFixedData, `${newToolbarHeight}px`);
                set$3(viewport, 'height', `${newHeight}px`);
                DeviceZones.updatePadding(contentBody, viewport, dropup);
            }
        };
        const setViewportOffset = function(newYOffset) {
            const offsetPx = `${newYOffset}px`;
            set(viewport, yFixedData, offsetPx);
            refresh();
        };
        DeviceZones.updatePadding(contentBody, viewport, dropup);
        return {
            setViewportOffset,
            isExpanding,
            isShrinking: not(isExpanding),
            refresh,
            restore,
        };
    };
    const IosViewport = {
        findFixtures,
        takeover: takeover$1,
        getYFixedData,
    };

    const animator = SmoothAnimation.create();
    const ANIMATION_STEP = 15;
    const NUM_TOP_ANIMATION_FRAMES = 10;
    const ANIMATION_RATE = 10;
    const lastScroll = `data-${Styles.resolve('last-scroll-top')}`;
    const getTop = function(element) {
        const raw = getRaw(element, 'top').getOr('0');
        return parseInt(raw, 10);
    };
    const getScrollTop = function(element) {
        return parseInt(element.dom().scrollTop, 10);
    };
    const moveScrollAndTop = function(element, destination, finalTop) {
        return Future.nu(function(callback) {
            const getCurrent = curry(getScrollTop, element);
            const update = function(newScroll) {
                element.dom().scrollTop = newScroll;
                set$3(element, 'top', `${getTop(element) + ANIMATION_STEP}px`);
            };
            const finish = function() {
                element.dom().scrollTop = destination;
                set$3(element, 'top', `${finalTop}px`);
                callback(destination);
            };
            animator.animate(
                getCurrent,
                destination,
                ANIMATION_STEP,
                update,
                finish,
                ANIMATION_RATE,
            );
        });
    };
    const moveOnlyScroll = function(element, destination) {
        return Future.nu(function(callback) {
            const getCurrent = curry(getScrollTop, element);
            set(element, lastScroll, getCurrent());
            const update = function(newScroll, abort) {
                const previous = DataAttributes.safeParse(element, lastScroll);
                if (previous !== element.dom().scrollTop) {
                    abort(element.dom().scrollTop);
                } else {
                    element.dom().scrollTop = newScroll;
                    set(element, lastScroll, newScroll);
                }
            };
            const finish = function() {
                element.dom().scrollTop = destination;
                set(element, lastScroll, destination);
                callback(destination);
            };
            const distance = Math.abs(destination - getCurrent());
            const step = Math.ceil(distance / NUM_TOP_ANIMATION_FRAMES);
            animator.animate(
                getCurrent,
                destination,
                step,
                update,
                finish,
                ANIMATION_RATE,
            );
        });
    };
    const moveOnlyTop = function(element, destination) {
        return Future.nu(function(callback) {
            const getCurrent = curry(getTop, element);
            const update = function(newTop) {
                set$3(element, 'top', `${newTop}px`);
            };
            const finish = function() {
                update(destination);
                callback(destination);
            };
            const distance = Math.abs(destination - getCurrent());
            const step = Math.ceil(distance / NUM_TOP_ANIMATION_FRAMES);
            animator.animate(
                getCurrent,
                destination,
                step,
                update,
                finish,
                ANIMATION_RATE,
            );
        });
    };
    const updateTop = function(element, amount) {
        const newTop = `${amount + IosViewport.getYFixedData(element)}px`;
        set$3(element, 'top', newTop);
    };
    const moveWindowScroll = function(toolbar, viewport, destY) {
        const outerWindow = owner(toolbar).dom().defaultView;
        return Future.nu(function(callback) {
            updateTop(toolbar, destY);
            updateTop(viewport, destY);
            outerWindow.scrollTo(0, destY);
            callback(destY);
        });
    };
    const IosScrolling = {
        moveScrollAndTop,
        moveOnlyScroll,
        moveOnlyTop,
        moveWindowScroll,
    };

    function BackgroundActivity(doAction) {
        const action = Cell(LazyValue.pure({}));
        const start = function(value) {
            const future = LazyValue.nu(function(callback) {
                return doAction(value).get(callback);
            });
            action.set(future);
        };
        const idle = function(g) {
            action.get().get(function() {
                g();
            });
        };
        return {
            start,
            idle,
        };
    }

    const scrollIntoView = function(cWin, socket, dropup, top, bottom) {
        const greenzone = DeviceZones.getGreenzone(socket, dropup);
        const refreshCursor = curry(CursorRefresh.refresh, cWin);
        if (top > greenzone || bottom > greenzone) {
            IosScrolling.moveOnlyScroll(
                socket,
                socket.dom().scrollTop - greenzone + bottom,
            ).get(refreshCursor);
        } else if (top < 0) {
            IosScrolling.moveOnlyScroll(
                socket,
                socket.dom().scrollTop + top,
            ).get(refreshCursor);
        }
    };
    const Greenzone = { scrollIntoView };

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
                each$1(asyncValues, function(asyncValue, i) {
                    asyncValue.get(cb(i));
                });
            }
        });
    };

    const par$1 = function(futures) {
        return par(futures, Future.nu);
    };

    const updateFixed = function(element, property, winY, offsetY) {
        const destination = winY + offsetY;
        set$3(element, property, `${destination}px`);
        return Future.pure(offsetY);
    };
    const updateScrollingFixed = function(element, winY, offsetY) {
        const destTop = winY + offsetY;
        const oldProp = getRaw(element, 'top').getOr(offsetY);
        const delta = destTop - parseInt(oldProp, 10);
        const destScroll = element.dom().scrollTop + delta;
        return IosScrolling.moveScrollAndTop(element, destScroll, destTop);
    };
    const updateFixture = function(fixture, winY) {
        return fixture.fold(
            function(element, property, offsetY) {
                return updateFixed(element, property, winY, offsetY);
            },
            function(element, offsetY) {
                return updateScrollingFixed(element, winY, offsetY);
            },
        );
    };
    const updatePositions = function(container, winY) {
        const fixtures = IosViewport.findFixtures(container);
        const updates = map$1(fixtures, function(fixture) {
            return updateFixture(fixture, winY);
        });
        return par$1(updates);
    };
    const IosUpdates = { updatePositions };

    const VIEW_MARGIN = 5;
    const register$2 = function(
        toolstrip,
        socket,
        container,
        outerWindow,
        structure,
        cWin,
    ) {
        const scroller = BackgroundActivity(function(y) {
            return IosScrolling.moveWindowScroll(toolstrip, socket, y);
        });
        const scrollBounds = function() {
            const rects = Rectangles.getRectangles(cWin);
            return Option.from(rects[0]).bind(function(rect) {
                const viewTop = rect.top() - socket.dom().scrollTop;
                const outside =
                    viewTop > outerWindow.innerHeight + VIEW_MARGIN ||
                    viewTop < -VIEW_MARGIN;
                return outside
                    ? Option.some({
                          top: constant(viewTop),
                          bottom: constant(viewTop + rect.height()),
                      })
                    : Option.none();
            });
        };
        const scrollThrottle = last$1(function() {
            scroller.idle(function() {
                IosUpdates.updatePositions(
                    container,
                    outerWindow.pageYOffset,
                ).get(function() {
                    const extraScroll = scrollBounds();
                    extraScroll.each(function(extra) {
                        socket.dom().scrollTop =
                            socket.dom().scrollTop + extra.top();
                    });
                    scroller.start(0);
                    structure.refresh();
                });
            });
        }, 1000);
        const onScroll = bind$3(
            Element.fromDom(outerWindow),
            'scroll',
            function() {
                if (outerWindow.pageYOffset < 0) {
                    return;
                }
                scrollThrottle.throttle();
            },
        );
        IosUpdates.updatePositions(container, outerWindow.pageYOffset).get(
            identity,
        );
        return { unbind: onScroll.unbind };
    };
    const setup$3 = function(bag) {
        const cWin = bag.cWin();
        const ceBody = bag.ceBody();
        const socket = bag.socket();
        const toolstrip = bag.toolstrip();
        const toolbar = bag.toolbar();
        const contentElement = bag.contentElement();
        const keyboardType = bag.keyboardType();
        const outerWindow = bag.outerWindow();
        const dropup = bag.dropup();
        const structure = IosViewport.takeover(
            socket,
            ceBody,
            toolstrip,
            dropup,
        );
        const keyboardModel = keyboardType(
            bag.outerBody(),
            cWin,
            body(),
            contentElement,
            toolstrip,
            toolbar,
        );
        const toEditing = function() {
            keyboardModel.toEditing();
            clearSelection();
        };
        const toReading = function() {
            keyboardModel.toReading();
        };
        const onToolbarTouch = function(event) {
            keyboardModel.onToolbarTouch(event);
        };
        const onOrientation = Orientation.onChange(outerWindow, {
            onChange: noop,
            onReady: structure.refresh,
        });
        onOrientation.onAdjustment(function() {
            structure.refresh();
        });
        const onResize = bind$3(
            Element.fromDom(outerWindow),
            'resize',
            function() {
                if (structure.isExpanding()) {
                    structure.refresh();
                }
            },
        );
        const onScroll = register$2(
            toolstrip,
            socket,
            bag.outerBody(),
            outerWindow,
            structure,
            cWin,
        );
        const unfocusedSelection = FakeSelection(cWin, contentElement);
        const refreshSelection = function() {
            if (unfocusedSelection.isActive()) {
                unfocusedSelection.update();
            }
        };
        const highlightSelection = function() {
            unfocusedSelection.update();
        };
        var clearSelection = function() {
            unfocusedSelection.clear();
        };
        const scrollIntoView = function(top, bottom) {
            Greenzone.scrollIntoView(cWin, socket, dropup, top, bottom);
        };
        const syncHeight = function() {
            set$3(
                contentElement,
                'height',
                `${
                    contentElement.dom().contentWindow.document.body
                        .scrollHeight
                }px`,
            );
        };
        const setViewportOffset = function(newYOffset) {
            structure.setViewportOffset(newYOffset);
            IosScrolling.moveOnlyTop(socket, newYOffset).get(identity);
        };
        const destroy = function() {
            structure.restore();
            onOrientation.destroy();
            onScroll.unbind();
            onResize.unbind();
            keyboardModel.destroy();
            unfocusedSelection.destroy();
            CaptureBin.input(body(), blur);
        };
        return {
            toEditing,
            toReading,
            onToolbarTouch,
            refreshSelection,
            clearSelection,
            highlightSelection,
            scrollIntoView,
            updateToolbarPadding: noop,
            setViewportOffset,
            syncHeight,
            refreshStructure: structure.refresh,
            destroy,
        };
    };
    const IosSetup = { setup: setup$3 };

    const create$6 = function(platform, mask) {
        const meta = MetaViewport.tag();
        const priorState = value$2();
        const scrollEvents = value$2();
        const iosApi = api$2();
        const iosEvents = api$2();
        const enter = function() {
            mask.hide();
            const doc = Element.fromDom(domGlobals.document);
            PlatformEditor.getActiveApi(platform.editor).each(function(
                editorApi,
            ) {
                priorState.set({
                    socketHeight: getRaw(platform.socket, 'height'),
                    iframeHeight: getRaw(editorApi.frame(), 'height'),
                    outerScroll: domGlobals.document.body.scrollTop,
                });
                scrollEvents.set({
                    exclusives: Scrollables.exclusive(
                        doc,
                        `.${Scrollable.scrollable()}`,
                    ),
                });
                add$2(
                    platform.container,
                    Styles.resolve('fullscreen-maximized'),
                );
                Thor.clobberStyles(platform.container, editorApi.body());
                meta.maximize();
                set$3(platform.socket, 'overflow', 'scroll');
                set$3(platform.socket, '-webkit-overflow-scrolling', 'touch');
                focus$1(editorApi.body());
                const setupBag = MixedBag(
                    [
                        'cWin',
                        'ceBody',
                        'socket',
                        'toolstrip',
                        'toolbar',
                        'dropup',
                        'contentElement',
                        'cursor',
                        'keyboardType',
                        'isScrolling',
                        'outerWindow',
                        'outerBody',
                    ],
                    [],
                );
                iosApi.set(
                    IosSetup.setup(
                        setupBag({
                            cWin: editorApi.win(),
                            ceBody: editorApi.body(),
                            socket: platform.socket,
                            toolstrip: platform.toolstrip,
                            toolbar: platform.toolbar,
                            dropup: platform.dropup.element(),
                            contentElement: editorApi.frame(),
                            cursor: noop,
                            outerBody: platform.body,
                            outerWindow: platform.win,
                            keyboardType: IosKeyboard.stubborn,
                            isScrolling() {
                                const scrollValue = scrollEvents;
                                return scrollValue.get().exists(function(s) {
                                    return s.socket.isScrolling();
                                });
                            },
                        }),
                    ),
                );
                iosApi.run(function(api) {
                    api.syncHeight();
                });
                iosEvents.set(
                    IosEvents.initEvents(
                        editorApi,
                        iosApi,
                        platform.toolstrip,
                        platform.socket,
                        platform.dropup,
                    ),
                );
            });
        };
        const exit = function() {
            meta.restore();
            iosEvents.clear();
            iosApi.clear();
            mask.show();
            priorState.on(function(s) {
                s.socketHeight.each(function(h) {
                    set$3(platform.socket, 'height', h);
                });
                s.iframeHeight.each(function(h) {
                    set$3(platform.editor.getFrame(), 'height', h);
                });
                domGlobals.document.body.scrollTop = s.scrollTop;
            });
            priorState.clear();
            scrollEvents.on(function(s) {
                s.exclusives.unbind();
            });
            scrollEvents.clear();
            remove$4(
                platform.container,
                Styles.resolve('fullscreen-maximized'),
            );
            Thor.restoreStyles();
            Scrollable.deregister(platform.toolbar);
            remove$5(platform.socket, 'overflow');
            remove$5(platform.socket, '-webkit-overflow-scrolling');
            blur(platform.editor.getFrame());
            PlatformEditor.getActiveApi(platform.editor).each(function(
                editorApi,
            ) {
                editorApi.clearSelection();
            });
        };
        const refreshStructure = function() {
            iosApi.run(function(api) {
                api.refreshStructure();
            });
        };
        return {
            enter,
            refreshStructure,
            exit,
        };
    };
    const IosMode = { create: create$6 };

    const produce$1 = function(raw) {
        const mobile = asRawOrDie(
            'Getting IosWebapp schema',
            MobileSchema,
            raw,
        );
        set$3(mobile.toolstrip, 'width', '100%');
        set$3(mobile.container, 'position', 'relative');
        const onView = function() {
            mobile.setReadOnly(mobile.readOnlyOnInit());
            mode.enter();
        };
        const mask = build$1(TapToEditMask.sketch(onView, mobile.translate));
        mobile.alloy.add(mask);
        const maskApi = {
            show() {
                mobile.alloy.add(mask);
            },
            hide() {
                mobile.alloy.remove(mask);
            },
        };
        var mode = IosMode.create(mobile, maskApi);
        return {
            setReadOnly: mobile.setReadOnly,
            refreshStructure: mode.refreshStructure,
            enter: mode.enter,
            exit: mode.exit,
            destroy: noop,
        };
    };
    const IosWebapp = { produce: produce$1 };

    function IosRealm(scrollIntoView) {
        const alloy = OuterContainer({
            classes: [Styles.resolve('ios-container')],
        });
        const toolbar = ScrollingToolbar();
        const webapp = api$2();
        const switchToEdit = CommonRealm.makeEditSwitch(webapp);
        const socket = CommonRealm.makeSocket();
        const dropup = build$2(function() {
            webapp.run(function(w) {
                w.refreshStructure();
            });
        }, scrollIntoView);
        alloy.add(toolbar.wrapper());
        alloy.add(socket);
        alloy.add(dropup.component());
        const setToolbarGroups = function(rawGroups) {
            const groups = toolbar.createGroups(rawGroups);
            toolbar.setGroups(groups);
        };
        const setContextToolbar = function(rawGroups) {
            const groups = toolbar.createGroups(rawGroups);
            toolbar.setContextToolbar(groups);
        };
        const focusToolbar = function() {
            toolbar.focus();
        };
        const restoreToolbar = function() {
            toolbar.restoreToolbar();
        };
        const init = function(spec) {
            webapp.set(IosWebapp.produce(spec));
        };
        const exit = function() {
            webapp.run(function(w) {
                Replacing.remove(socket, switchToEdit);
                w.exit();
            });
        };
        const updateMode = function(readOnly) {
            CommonRealm.updateMode(
                socket,
                switchToEdit,
                readOnly,
                alloy.root(),
            );
        };
        return {
            system: constant(alloy),
            element: alloy.element,
            init,
            exit,
            setToolbarGroups,
            setContextToolbar,
            focusToolbar,
            restoreToolbar,
            updateMode,
            socket: constant(socket),
            dropup: constant(dropup),
        };
    }

    const global$5 = tinymce.util.Tools.resolve('tinymce.EditorManager');

    const derive$3 = function(editor) {
        const base = readOptFrom$1(editor.settings, 'skin_url').fold(
            function() {
                return `${global$5.baseURL}/skins/ui/oxide`;
            },
            function(url) {
                return url;
            },
        );
        return {
            content: `${base}/content.mobile.min.css`,
            ui: `${base}/skin.mobile.min.css`,
        };
    };
    const CssUrls = { derive: derive$3 };

    const fontSizes = ['x-small', 'small', 'medium', 'large', 'x-large'];
    const fireChange = function(realm, command, state) {
        realm.system().broadcastOn([TinyChannels.formatChanged()], {
            command,
            state,
        });
    };
    const init$5 = function(realm, editor) {
        const allFormats = keys(editor.formatter.get());
        each$1(allFormats, function(command) {
            editor.formatter.formatChanged(command, function(state) {
                fireChange(realm, command, state);
            });
        });
        each$1(['ul', 'ol'], function(command) {
            editor.selection.selectorChanged(command, function(state, data) {
                fireChange(realm, command, state);
            });
        });
    };
    const FormatChangers = {
        init: init$5,
        fontSizes: constant(fontSizes),
    };

    const fireSkinLoaded = function(editor) {
        const done = function() {
            editor._skinLoaded = true;
            editor.fire('SkinLoaded');
        };
        return function() {
            if (editor.initialized) {
                done();
            } else {
                editor.on('init', done);
            }
        };
    };
    const SkinLoaded = { fireSkinLoaded };

    const READING = constant('toReading');
    const EDITING = constant('toEditing');
    const renderMobileTheme = function(editor) {
        const renderUI = function() {
            const targetNode = editor.getElement();
            const cssUrls = CssUrls.derive(editor);
            if (isSkinDisabled(editor) === false) {
                editor.contentCSS.push(cssUrls.content);
                global$1.DOM.styleSheetLoader.load(
                    cssUrls.ui,
                    SkinLoaded.fireSkinLoaded(editor),
                );
            } else {
                SkinLoaded.fireSkinLoaded(editor)();
            }
            const doScrollIntoView = function() {
                editor.fire('ScrollIntoView');
            };
            const realm = detect$3().os.isAndroid()
                ? AndroidRealm(doScrollIntoView)
                : IosRealm(doScrollIntoView);
            const original = Element.fromDom(targetNode);
            attachSystemAfter(original, realm.system());
            const findFocusIn = function(elem) {
                return search(elem).bind(function(focused) {
                    return realm
                        .system()
                        .getByDom(focused)
                        .toOption();
                });
            };
            const outerWindow = targetNode.ownerDocument.defaultView;
            const orientation = Orientation.onChange(outerWindow, {
                onChange() {
                    const alloy = realm.system();
                    alloy.broadcastOn([TinyChannels.orientationChanged()], {
                        width: Orientation.getActualWidth(outerWindow),
                    });
                },
                onReady: noop,
            });
            const setReadOnly = function(
                dynamicGroup,
                readOnlyGroups,
                mainGroups,
                ro,
            ) {
                if (ro === false) {
                    editor.selection.collapse();
                }
                const toolbars = configureToolbar(
                    dynamicGroup,
                    readOnlyGroups,
                    mainGroups,
                );
                realm.setToolbarGroups(
                    ro === true ? toolbars.readOnly : toolbars.main,
                );
                editor.setMode(ro === true ? 'readonly' : 'design');
                editor.fire(ro === true ? READING() : EDITING());
                realm.updateMode(ro);
            };
            var configureToolbar = function(
                dynamicGroup,
                readOnlyGroups,
                mainGroups,
            ) {
                const dynamic = dynamicGroup.get();
                const toolbars = {
                    readOnly: dynamic.backToMask.concat(readOnlyGroups.get()),
                    main: dynamic.backToMask.concat(mainGroups.get()),
                };
                return toolbars;
            };
            const bindHandler = function(label, handler) {
                editor.on(label, handler);
                return {
                    unbind() {
                        editor.off(label);
                    },
                };
            };
            editor.on('init', function() {
                realm.init({
                    editor: {
                        getFrame() {
                            return Element.fromDom(
                                editor.contentAreaContainer.querySelector(
                                    'iframe',
                                ),
                            );
                        },
                        onDomChanged() {
                            return { unbind: noop };
                        },
                        onToReading(handler) {
                            return bindHandler(READING(), handler);
                        },
                        onToEditing(handler) {
                            return bindHandler(EDITING(), handler);
                        },
                        onScrollToCursor(handler) {
                            editor.on('ScrollIntoView', function(tinyEvent) {
                                handler(tinyEvent);
                            });
                            const unbind = function() {
                                editor.off('ScrollIntoView');
                                orientation.destroy();
                            };
                            return { unbind };
                        },
                        onTouchToolstrip() {
                            hideDropup();
                        },
                        onTouchContent() {
                            const toolbar = Element.fromDom(
                                editor.editorContainer.querySelector(
                                    `.${Styles.resolve('toolbar')}`,
                                ),
                            );
                            findFocusIn(toolbar).each(emitExecute);
                            realm.restoreToolbar();
                            hideDropup();
                        },
                        onTapContent(evt) {
                            const target = evt.target();
                            if (name(target) === 'img') {
                                editor.selection.select(target.dom());
                                evt.kill();
                            } else if (name(target) === 'a') {
                                const component = realm
                                    .system()
                                    .getByDom(
                                        Element.fromDom(editor.editorContainer),
                                    );
                                component.each(function(container) {
                                    if (Swapping.isAlpha(container)) {
                                        TinyCodeDupe.openLink(target.dom());
                                    }
                                });
                            }
                        },
                    },
                    container: Element.fromDom(editor.editorContainer),
                    socket: Element.fromDom(editor.contentAreaContainer),
                    toolstrip: Element.fromDom(
                        editor.editorContainer.querySelector(
                            `.${Styles.resolve('toolstrip')}`,
                        ),
                    ),
                    toolbar: Element.fromDom(
                        editor.editorContainer.querySelector(
                            `.${Styles.resolve('toolbar')}`,
                        ),
                    ),
                    dropup: realm.dropup(),
                    alloy: realm.system(),
                    translate: noop,
                    setReadOnly(ro) {
                        setReadOnly(
                            dynamicGroup,
                            readOnlyGroups,
                            mainGroups,
                            ro,
                        );
                    },
                    readOnlyOnInit() {
                        return readOnlyOnInit();
                    },
                });
                var hideDropup = function() {
                    realm.dropup().disappear(function() {
                        realm
                            .system()
                            .broadcastOn([TinyChannels.dropupDismissed()], {});
                    });
                };
                const backToMaskGroup = {
                    label: 'The first group',
                    scrollable: false,
                    items: [
                        Buttons.forToolbar(
                            'back',
                            function() {
                                editor.selection.collapse();
                                realm.exit();
                            },
                            {},
                            editor,
                        ),
                    ],
                };
                const backToReadOnlyGroup = {
                    label: 'Back to read only',
                    scrollable: false,
                    items: [
                        Buttons.forToolbar(
                            'readonly-back',
                            function() {
                                setReadOnly(
                                    dynamicGroup,
                                    readOnlyGroups,
                                    mainGroups,
                                    true,
                                );
                            },
                            {},
                            editor,
                        ),
                    ],
                };
                const readOnlyGroup = {
                    label: 'The read only mode group',
                    scrollable: true,
                    items: [],
                };
                const features = Features.setup(realm, editor);
                const items = Features.detect(editor.settings, features);
                const actionGroup = {
                    label: 'the action group',
                    scrollable: true,
                    items,
                };
                const extraGroup = {
                    label: 'The extra group',
                    scrollable: false,
                    items: [],
                };
                var mainGroups = Cell([actionGroup, extraGroup]);
                var readOnlyGroups = Cell([readOnlyGroup, extraGroup]);
                var dynamicGroup = Cell({
                    backToMask: [backToMaskGroup],
                    backToReadOnly: [backToReadOnlyGroup],
                });
                FormatChangers.init(realm, editor);
            });
            editor.on('remove', function() {
                realm.exit();
            });
            editor.on('detach', function() {
                detachSystem(realm.system());
                realm.system().destroy();
            });
            return {
                iframeContainer: realm
                    .socket()
                    .element()
                    .dom(),
                editorContainer: realm.element().dom(),
            };
        };
        return {
            getNotificationManagerImpl() {
                return {
                    open: constant({
                        progressBar: { value: noop },
                        close: noop,
                        text: noop,
                        getEl: constant(null),
                        moveTo: noop,
                        moveRel: noop,
                        settings: {},
                    }),
                    close: noop,
                    reposition: noop,
                    getArgs: constant({}),
                };
            },
            renderUI,
        };
    };
    function Theme() {
        global$2.add('mobile', renderMobileTheme);
    }

    Theme();
})(window);
