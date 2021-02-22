/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 *
 * Version: 5.1.6 (2020-01-28)
 */
(function(domGlobals) {
    const global = tinymce.util.Tools.resolve('tinymce.PluginManager');

    const noop = function() {};
    const constant = function(value) {
        return function() {
            return value;
        };
    };
    const not = function(f) {
        return function() {
            const args = [];
            for (let _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return !f.apply(null, args);
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
    const isString = isType('string');
    const isArray = isType('array');
    const isBoolean = isType('boolean');
    const isFunction = isType('function');
    const isNumber = isType('number');

    const nativeSlice = Array.prototype.slice;
    const nativePush = Array.prototype.push;
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
    const groupBy = function(xs, f) {
        if (xs.length === 0) {
            return [];
        }
        let wasType = f(xs[0]);
        const r = [];
        let group = [];
        for (let i = 0, len = xs.length; i < len; i++) {
            const x = xs[i];
            const type = f(x);
            if (type !== wasType) {
                r.push(group);
                group = [];
            }
            wasType = type;
            group.push(x);
        }
        if (group.length !== 0) {
            r.push(group);
        }
        return r;
    };
    const foldl = function(xs, f, acc) {
        each(xs, function(x) {
            acc = f(acc, x);
        });
        return acc;
    };
    const find = function(xs, pred) {
        for (let i = 0, len = xs.length; i < len; i++) {
            const x = xs[i];
            if (pred(x, i)) {
                return Option.some(x);
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
        const output = map(xs, f);
        return flatten(output);
    };
    const reverse = function(xs) {
        const r = nativeSlice.call(xs, 0);
        r.reverse();
        return r;
    };
    const head = function(xs) {
        return xs.length === 0 ? Option.none() : Option.some(xs[0]);
    };
    const last = function(xs) {
        return xs.length === 0 ? Option.none() : Option.some(xs[xs.length - 1]);
    };
    const from$1 = isFunction(Array.from)
        ? Array.from
        : function(x) {
              return nativeSlice.call(x);
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

    const detect$1 = function(candidates, userAgent) {
        const agent = String(userAgent).toLowerCase();
        return find(candidates, function(candidate) {
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

    const contains = function(str, substr) {
        return str.indexOf(substr) !== -1;
    };

    const normalVersionRegex = /.*?version\/\ ?([0-9]+)\.([0-9]+).*/;
    const checkContains = function(target) {
        return function(uastring) {
            return contains(uastring, target);
        };
    };
    const browsers = [
        {
            name: 'Edge',
            versionRegexes: [/.*?edge\/ ?([0-9]+)\.([0-9]+)$/],
            search(uastring) {
                return (
                    contains(uastring, 'edge/') &&
                    contains(uastring, 'chrome') &&
                    contains(uastring, 'safari') &&
                    contains(uastring, 'applewebkit')
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
                    contains(uastring, 'chrome') &&
                    !contains(uastring, 'chromeframe')
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
                    contains(uastring, 'msie') || contains(uastring, 'trident')
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
                    (contains(uastring, 'safari') ||
                        contains(uastring, 'mobile/')) &&
                    contains(uastring, 'applewebkit')
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
                    contains(uastring, 'iphone') || contains(uastring, 'ipad')
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

    const ELEMENT$1 = ELEMENT;
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
    const contains$1 = browser.isIE() ? ieContains : regularContains;
    const is$1 = is;

    const global$1 = tinymce.util.Tools.resolve('tinymce.dom.RangeUtils');

    const global$2 = tinymce.util.Tools.resolve('tinymce.dom.TreeWalker');

    const global$3 = tinymce.util.Tools.resolve('tinymce.util.VK');

    const lift2 = function(oa, ob, f) {
        return oa.isSome() && ob.isSome()
            ? Option.some(f(oa.getOrDie(), ob.getOrDie()))
            : Option.none();
    };

    const fromElements = function(elements, scope) {
        const doc = scope || domGlobals.document;
        const fragment = doc.createDocumentFragment();
        each(elements, function(element) {
            fragment.appendChild(element.dom());
        });
        return Element.fromDom(fragment);
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
            each(fields, function(name, i) {
                struct[name] = constant(values[i]);
            });
            return struct;
        };
    };

    const { keys } = Object;
    const each$1 = function(obj, f) {
        const props = keys(obj);
        for (let k = 0, len = props.length; k < len; k++) {
            const i = props[k];
            const x = obj[i];
            f(x, i);
        }
    };

    const parent = function(element) {
        return Option.from(element.dom().parentNode).map(Element.fromDom);
    };
    const children = function(element) {
        return map(element.dom().childNodes, Element.fromDom);
    };
    const child = function(element, index) {
        const cs = element.dom().childNodes;
        return Option.from(cs[index]).map(Element.fromDom);
    };
    const firstChild = function(element) {
        return child(element, 0);
    };
    const lastChild = function(element) {
        return child(element, element.dom().childNodes.length - 1);
    };
    const spot = Immutable('element', 'offset');

    const before = function(marker, element) {
        const parent$1 = parent(marker);
        parent$1.each(function(v) {
            v.dom().insertBefore(element.dom(), marker.dom());
        });
    };
    const append = function(parent, element) {
        parent.dom().appendChild(element.dom());
    };

    const before$1 = function(marker, elements) {
        each(elements, function(x) {
            before(marker, x);
        });
    };
    const append$1 = function(parent, elements) {
        each(elements, function(x) {
            append(parent, x);
        });
    };

    const remove = function(element) {
        const dom = element.dom();
        if (dom.parentNode !== null) {
            dom.parentNode.removeChild(dom);
        }
    };

    const fireListEvent = function(editor, action, element) {
        return editor.fire('ListMutation', {
            action,
            element,
        });
    };

    const Global =
        typeof domGlobals.window !== 'undefined'
            ? domGlobals.window
            : Function('return this;')();

    const path = function(parts, scope) {
        let o = scope !== undefined && scope !== null ? scope : Global;
        for (
            let i = 0;
            i < parts.length && o !== undefined && o !== null;
            ++i
        ) {
            o = o[parts[i]];
        }
        return o;
    };
    const resolve = function(p, scope) {
        const parts = p.split('.');
        return path(parts, scope);
    };

    const unsafe = function(name, scope) {
        return resolve(name, scope);
    };
    const getOrDie = function(name, scope) {
        const actual = unsafe(name, scope);
        if (actual === undefined || actual === null) {
            throw new Error(`${name} not available on this browser`);
        }
        return actual;
    };
    const Global$1 = { getOrDie };

    const htmlElement = function(scope) {
        return Global$1.getOrDie('HTMLElement', scope);
    };
    const isPrototypeOf = function(x) {
        const scope = resolve('ownerDocument.defaultView', x);
        return htmlElement(scope).prototype.isPrototypeOf(x);
    };
    const HTMLElement = { isPrototypeOf };

    const global$4 = tinymce.util.Tools.resolve('tinymce.dom.DomQuery');

    const global$5 = tinymce.util.Tools.resolve('tinymce.util.Tools');

    const isTextNode = function(node) {
        return node && node.nodeType === 3;
    };
    const isListNode = function(node) {
        return node && /^(OL|UL|DL)$/.test(node.nodeName);
    };
    const isOlUlNode = function(node) {
        return node && /^(OL|UL)$/.test(node.nodeName);
    };
    const isListItemNode = function(node) {
        return node && /^(LI|DT|DD)$/.test(node.nodeName);
    };
    const isDlItemNode = function(node) {
        return node && /^(DT|DD)$/.test(node.nodeName);
    };
    const isTableCellNode = function(node) {
        return node && /^(TH|TD)$/.test(node.nodeName);
    };
    const isBr = function(node) {
        return node && node.nodeName === 'BR';
    };
    const isFirstChild = function(node) {
        return node.parentNode.firstChild === node;
    };
    const isLastChild = function(node) {
        return node.parentNode.lastChild === node;
    };
    const isTextBlock = function(editor, node) {
        return node && !!editor.schema.getTextBlockElements()[node.nodeName];
    };
    const isBlock = function(node, blockElements) {
        return node && node.nodeName in blockElements;
    };
    const isBogusBr = function(dom, node) {
        if (!isBr(node)) {
            return false;
        }
        if (dom.isBlock(node.nextSibling) && !isBr(node.previousSibling)) {
            return true;
        }
        return false;
    };
    const isEmpty = function(dom, elm, keepBookmarks) {
        const empty = dom.isEmpty(elm);
        if (
            keepBookmarks &&
            dom.select('span[data-mce-type=bookmark]', elm).length > 0
        ) {
            return false;
        }
        return empty;
    };
    const isChildOfBody = function(dom, elm) {
        return dom.isChildOf(elm, dom.getRoot());
    };
    const NodeType = {
        isTextNode,
        isListNode,
        isOlUlNode,
        isDlItemNode,
        isListItemNode,
        isTableCellNode,
        isBr,
        isFirstChild,
        isLastChild,
        isTextBlock,
        isBlock,
        isBogusBr,
        isEmpty,
        isChildOfBody,
    };

    const getParentList = function(editor) {
        const selectionStart = editor.selection.getStart(true);
        return editor.dom.getParent(
            selectionStart,
            'OL,UL,DL',
            getClosestListRootElm(editor, selectionStart),
        );
    };
    const isParentListSelected = function(parentList, selectedBlocks) {
        return (
            parentList &&
            selectedBlocks.length === 1 &&
            selectedBlocks[0] === parentList
        );
    };
    const findSubLists = function(parentList) {
        return global$5.grep(parentList.querySelectorAll('ol,ul,dl'), function(
            elm,
        ) {
            return NodeType.isListNode(elm);
        });
    };
    const getSelectedSubLists = function(editor) {
        const parentList = getParentList(editor);
        const selectedBlocks = editor.selection.getSelectedBlocks();
        if (isParentListSelected(parentList, selectedBlocks)) {
            return findSubLists(parentList);
        }
        return global$5.grep(selectedBlocks, function(elm) {
            return NodeType.isListNode(elm) && parentList !== elm;
        });
    };
    const findParentListItemsNodes = function(editor, elms) {
        const listItemsElms = global$5.map(elms, function(elm) {
            const parentLi = editor.dom.getParent(
                elm,
                'li,dd,dt',
                getClosestListRootElm(editor, elm),
            );
            return parentLi || elm;
        });
        return global$4.unique(listItemsElms);
    };
    const getSelectedListItems = function(editor) {
        const selectedBlocks = editor.selection.getSelectedBlocks();
        return global$5.grep(
            findParentListItemsNodes(editor, selectedBlocks),
            function(block) {
                return NodeType.isListItemNode(block);
            },
        );
    };
    const getSelectedDlItems = function(editor) {
        return filter(getSelectedListItems(editor), NodeType.isDlItemNode);
    };
    var getClosestListRootElm = function(editor, elm) {
        const parentTableCell = editor.dom.getParents(elm, 'TD,TH');
        const root =
            parentTableCell.length > 0 ? parentTableCell[0] : editor.getBody();
        return root;
    };
    const findLastParentListNode = function(editor, elm) {
        const parentLists = editor.dom.getParents(
            elm,
            'ol,ul',
            getClosestListRootElm(editor, elm),
        );
        return last(parentLists);
    };
    const getSelectedLists = function(editor) {
        const firstList = findLastParentListNode(
            editor,
            editor.selection.getStart(),
        );
        const subsequentLists = filter(
            editor.selection.getSelectedBlocks(),
            NodeType.isOlUlNode,
        );
        return firstList.toArray().concat(subsequentLists);
    };
    const getSelectedListRoots = function(editor) {
        const selectedLists = getSelectedLists(editor);
        return getUniqueListRoots(editor, selectedLists);
    };
    var getUniqueListRoots = function(editor, lists) {
        const listRoots = map(lists, function(list) {
            return findLastParentListNode(editor, list).getOr(list);
        });
        return global$4.unique(listRoots);
    };
    const isList = function(editor) {
        const list = getParentList(editor);
        return HTMLElement.isPrototypeOf(list);
    };
    const Selection = {
        isList,
        getParentList,
        getSelectedSubLists,
        getSelectedListItems,
        getClosestListRootElm,
        getSelectedDlItems,
        getSelectedListRoots,
    };

    const createTextBlock = function(editor, contentNode) {
        const { dom } = editor;
        const blockElements = editor.schema.getBlockElements();
        const fragment = dom.createFragment();
        let node;
        let textBlock;
        let blockName;
        let hasContentNode;
        if (editor.settings.forced_root_block) {
            blockName = editor.settings.forced_root_block;
        }
        if (blockName) {
            textBlock = dom.create(blockName);
            if (textBlock.tagName === editor.settings.forced_root_block) {
                dom.setAttribs(
                    textBlock,
                    editor.settings.forced_root_block_attrs,
                );
            }
            if (!NodeType.isBlock(contentNode.firstChild, blockElements)) {
                fragment.appendChild(textBlock);
            }
        }
        if (contentNode) {
            while ((node = contentNode.firstChild)) {
                const { nodeName } = node;
                if (
                    !hasContentNode &&
                    (nodeName !== 'SPAN' ||
                        node.getAttribute('data-mce-type') !== 'bookmark')
                ) {
                    hasContentNode = true;
                }
                if (NodeType.isBlock(node, blockElements)) {
                    fragment.appendChild(node);
                    textBlock = null;
                } else if (blockName) {
                    if (!textBlock) {
                        textBlock = dom.create(blockName);
                        fragment.appendChild(textBlock);
                    }
                    textBlock.appendChild(node);
                } else {
                    fragment.appendChild(node);
                }
            }
        }
        if (!editor.settings.forced_root_block) {
            fragment.appendChild(dom.create('br'));
        } else if (!hasContentNode) {
            textBlock.appendChild(dom.create('br', { 'data-mce-bogus': '1' }));
        }
        return fragment;
    };

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
    const setAll = function(element, attrs) {
        const dom = element.dom();
        each$1(attrs, function(v, k) {
            rawSet(dom, k, v);
        });
    };
    const clone = function(element) {
        return foldl(
            element.dom().attributes,
            function(acc, attr) {
                acc[attr.name] = attr.value;
                return acc;
            },
            {},
        );
    };

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
    const set = function(element, property, value) {
        const dom = element.dom();
        internalSet(dom, property, value);
    };

    const clone$1 = function(original, isDeep) {
        return Element.fromDom(original.dom().cloneNode(isDeep));
    };
    const deep = function(original) {
        return clone$1(original, true);
    };
    const shallowAs = function(original, tag) {
        const nu = Element.fromTag(tag);
        const attributes = clone(original);
        setAll(nu, attributes);
        return nu;
    };
    const mutate = function(original, tag) {
        const nu = shallowAs(original, tag);
        before(original, nu);
        const children$1 = children(original);
        append$1(nu, children$1);
        remove(original);
        return nu;
    };

    const joinSegment = function(parent, child) {
        append(parent.item, child.list);
    };
    const joinSegments = function(segments) {
        for (let i = 1; i < segments.length; i++) {
            joinSegment(segments[i - 1], segments[i]);
        }
    };
    const appendSegments = function(head$1, tail) {
        lift2(last(head$1), head(tail), joinSegment);
    };
    const createSegment = function(scope, listType) {
        const segment = {
            list: Element.fromTag(listType, scope),
            item: Element.fromTag('li', scope),
        };
        append(segment.list, segment.item);
        return segment;
    };
    const createSegments = function(scope, entry, size) {
        const segments = [];
        for (let i = 0; i < size; i++) {
            segments.push(createSegment(scope, entry.listType));
        }
        return segments;
    };
    const populateSegments = function(segments, entry) {
        for (let i = 0; i < segments.length - 1; i++) {
            set(segments[i].item, 'list-style-type', 'none');
        }
        last(segments).each(function(segment) {
            setAll(segment.list, entry.listAttributes);
            setAll(segment.item, entry.itemAttributes);
            append$1(segment.item, entry.content);
        });
    };
    const normalizeSegment = function(segment, entry) {
        if (name(segment.list) !== entry.listType) {
            segment.list = mutate(segment.list, entry.listType);
        }
        setAll(segment.list, entry.listAttributes);
    };
    const createItem = function(scope, attr, content) {
        const item = Element.fromTag('li', scope);
        setAll(item, attr);
        append$1(item, content);
        return item;
    };
    const appendItem = function(segment, item) {
        append(segment.list, item);
        segment.item = item;
    };
    const writeShallow = function(scope, cast, entry) {
        const newCast = cast.slice(0, entry.depth);
        last(newCast).each(function(segment) {
            const item = createItem(scope, entry.itemAttributes, entry.content);
            appendItem(segment, item);
            normalizeSegment(segment, entry);
        });
        return newCast;
    };
    const writeDeep = function(scope, cast, entry) {
        const segments = createSegments(
            scope,
            entry,
            entry.depth - cast.length,
        );
        joinSegments(segments);
        populateSegments(segments, entry);
        appendSegments(cast, segments);
        return cast.concat(segments);
    };
    const composeList = function(scope, entries) {
        const cast = foldl(
            entries,
            function(cast, entry) {
                return entry.depth > cast.length
                    ? writeDeep(scope, cast, entry)
                    : writeShallow(scope, cast, entry);
            },
            [],
        );
        return head(cast).map(function(segment) {
            return segment.list;
        });
    };

    const isList$1 = function(el) {
        return is$1(el, 'OL,UL');
    };
    const hasFirstChildList = function(el) {
        return firstChild(el)
            .map(isList$1)
            .getOr(false);
    };
    const hasLastChildList = function(el) {
        return lastChild(el)
            .map(isList$1)
            .getOr(false);
    };

    const isIndented = function(entry) {
        return entry.depth > 0;
    };
    const isSelected = function(entry) {
        return entry.isSelected;
    };
    const cloneItemContent = function(li) {
        const children$1 = children(li);
        const content = hasLastChildList(li)
            ? children$1.slice(0, -1)
            : children$1;
        return map(content, deep);
    };
    const createEntry = function(li, depth, isSelected) {
        return parent(li)
            .filter(isElement)
            .map(function(list) {
                return {
                    depth,
                    isSelected,
                    content: cloneItemContent(li),
                    itemAttributes: clone(li),
                    listAttributes: clone(list),
                    listType: name(list),
                };
            });
    };

    const indentEntry = function(indentation, entry) {
        switch (indentation) {
            case 'Indent':
                entry.depth++;
                break;
            case 'Outdent':
                entry.depth--;
                break;
            case 'Flatten':
                entry.depth = 0;
        }
    };

    const { hasOwnProperty } = Object.prototype;
    const shallow = function(old, nu) {
        return nu;
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
                    if (hasOwnProperty.call(curObject, key)) {
                        ret[key] = merger(ret[key], curObject[key]);
                    }
                }
            }
            return ret;
        };
    };
    const merge = baseMerge(shallow);

    const cloneListProperties = function(target, source) {
        target.listType = source.listType;
        target.listAttributes = merge({}, source.listAttributes);
    };
    const previousSiblingEntry = function(entries, start) {
        const { depth } = entries[start];
        for (let i = start - 1; i >= 0; i--) {
            if (entries[i].depth === depth) {
                return Option.some(entries[i]);
            }
            if (entries[i].depth < depth) {
                break;
            }
        }
        return Option.none();
    };
    const normalizeEntries = function(entries) {
        each(entries, function(entry, i) {
            previousSiblingEntry(entries, i).each(function(matchingEntry) {
                cloneListProperties(entry, matchingEntry);
            });
        });
    };

    const parseItem = function(depth, itemSelection, selectionState, item) {
        return firstChild(item)
            .filter(isList$1)
            .fold(
                function() {
                    itemSelection.each(function(selection) {
                        if (eq(selection.start, item)) {
                            selectionState.set(true);
                        }
                    });
                    const currentItemEntry = createEntry(
                        item,
                        depth,
                        selectionState.get(),
                    );
                    itemSelection.each(function(selection) {
                        if (eq(selection.end, item)) {
                            selectionState.set(false);
                        }
                    });
                    const childListEntries = lastChild(item)
                        .filter(isList$1)
                        .map(function(list) {
                            return parseList(
                                depth,
                                itemSelection,
                                selectionState,
                                list,
                            );
                        })
                        .getOr([]);
                    return currentItemEntry.toArray().concat(childListEntries);
                },
                function(list) {
                    return parseList(
                        depth,
                        itemSelection,
                        selectionState,
                        list,
                    );
                },
            );
    };
    var parseList = function(depth, itemSelection, selectionState, list) {
        return bind(children(list), function(element) {
            const parser = isList$1(element) ? parseList : parseItem;
            const newDepth = depth + 1;
            return parser(newDepth, itemSelection, selectionState, element);
        });
    };
    const parseLists = function(lists, itemSelection) {
        const selectionState = Cell(false);
        const initialDepth = 0;
        return map(lists, function(list) {
            return {
                sourceList: list,
                entries: parseList(
                    initialDepth,
                    itemSelection,
                    selectionState,
                    list,
                ),
            };
        });
    };

    const outdentedComposer = function(editor, entries) {
        return map(entries, function(entry) {
            const content = fromElements(entry.content);
            return Element.fromDom(createTextBlock(editor, content.dom()));
        });
    };
    const indentedComposer = function(editor, entries) {
        normalizeEntries(entries);
        return composeList(editor.contentDocument, entries).toArray();
    };
    const composeEntries = function(editor, entries) {
        return bind(groupBy(entries, isIndented), function(entries) {
            const groupIsIndented = head(entries)
                .map(isIndented)
                .getOr(false);
            return groupIsIndented
                ? indentedComposer(editor, entries)
                : outdentedComposer(editor, entries);
        });
    };
    const indentSelectedEntries = function(entries, indentation) {
        each(filter(entries, isSelected), function(entry) {
            return indentEntry(indentation, entry);
        });
    };
    const getItemSelection = function(editor) {
        const selectedListItems = map(
            Selection.getSelectedListItems(editor),
            Element.fromDom,
        );
        return lift2(
            find(selectedListItems, not(hasFirstChildList)),
            find(reverse(selectedListItems), not(hasFirstChildList)),
            function(start, end) {
                return {
                    start,
                    end,
                };
            },
        );
    };
    const listIndentation = function(editor, lists, indentation) {
        const entrySets = parseLists(lists, getItemSelection(editor));
        each(entrySets, function(entrySet) {
            indentSelectedEntries(entrySet.entries, indentation);
            const composedLists = composeEntries(editor, entrySet.entries);
            each(composedLists, function(composedList) {
                fireListEvent(
                    editor,
                    indentation === 'Indent' ? 'IndentList' : 'OutdentList',
                    composedList.dom(),
                );
            });
            before$1(entrySet.sourceList, composedLists);
            remove(entrySet.sourceList);
        });
    };

    const global$6 = tinymce.util.Tools.resolve('tinymce.dom.DOMUtils');

    const { DOM } = global$6;
    const splitList = function(editor, ul, li) {
        let tmpRng;
        let fragment;
        let bookmarks;
        let node;
        let newBlock;
        const removeAndKeepBookmarks = function(targetNode) {
            global$5.each(bookmarks, function(node) {
                targetNode.parentNode.insertBefore(node, li.parentNode);
            });
            DOM.remove(targetNode);
        };
        bookmarks = DOM.select('span[data-mce-type="bookmark"]', ul);
        newBlock = createTextBlock(editor, li);
        tmpRng = DOM.createRng();
        tmpRng.setStartAfter(li);
        tmpRng.setEndAfter(ul);
        fragment = tmpRng.extractContents();
        for (node = fragment.firstChild; node; node = node.firstChild) {
            if (node.nodeName === 'LI' && editor.dom.isEmpty(node)) {
                DOM.remove(node);
                break;
            }
        }
        if (!editor.dom.isEmpty(fragment)) {
            DOM.insertAfter(fragment, ul);
        }
        DOM.insertAfter(newBlock, ul);
        if (NodeType.isEmpty(editor.dom, li.parentNode)) {
            removeAndKeepBookmarks(li.parentNode);
        }
        DOM.remove(li);
        if (NodeType.isEmpty(editor.dom, ul)) {
            DOM.remove(ul);
        }
    };
    const SplitList = { splitList };

    const outdentDlItem = function(editor, item) {
        if (is$1(item, 'dd')) {
            mutate(item, 'dt');
        } else if (is$1(item, 'dt')) {
            parent(item).each(function(dl) {
                return SplitList.splitList(editor, dl.dom(), item.dom());
            });
        }
    };
    const indentDlItem = function(item) {
        if (is$1(item, 'dt')) {
            mutate(item, 'dd');
        }
    };
    const dlIndentation = function(editor, indentation, dlItems) {
        if (indentation === 'Indent') {
            each(dlItems, indentDlItem);
        } else {
            each(dlItems, function(item) {
                return outdentDlItem(editor, item);
            });
        }
    };

    const getNormalizedPoint = function(container, offset) {
        if (NodeType.isTextNode(container)) {
            return {
                container,
                offset,
            };
        }
        const node = global$1.getNode(container, offset);
        if (NodeType.isTextNode(node)) {
            return {
                container: node,
                offset:
                    offset >= container.childNodes.length
                        ? node.data.length
                        : 0,
            };
        }
        if (node.previousSibling && NodeType.isTextNode(node.previousSibling)) {
            return {
                container: node.previousSibling,
                offset: node.previousSibling.data.length,
            };
        }
        if (node.nextSibling && NodeType.isTextNode(node.nextSibling)) {
            return {
                container: node.nextSibling,
                offset: 0,
            };
        }
        return {
            container,
            offset,
        };
    };
    const normalizeRange = function(rng) {
        const outRng = rng.cloneRange();
        const rangeStart = getNormalizedPoint(
            rng.startContainer,
            rng.startOffset,
        );
        outRng.setStart(rangeStart.container, rangeStart.offset);
        const rangeEnd = getNormalizedPoint(rng.endContainer, rng.endOffset);
        outRng.setEnd(rangeEnd.container, rangeEnd.offset);
        return outRng;
    };
    const Range = {
        getNormalizedPoint,
        normalizeRange,
    };

    const selectionIndentation = function(editor, indentation) {
        const lists = map(
            Selection.getSelectedListRoots(editor),
            Element.fromDom,
        );
        const dlItems = map(
            Selection.getSelectedDlItems(editor),
            Element.fromDom,
        );
        let isHandled = false;
        if (lists.length || dlItems.length) {
            const bookmark = editor.selection.getBookmark();
            listIndentation(editor, lists, indentation);
            dlIndentation(editor, indentation, dlItems);
            editor.selection.moveToBookmark(bookmark);
            editor.selection.setRng(
                Range.normalizeRange(editor.selection.getRng()),
            );
            editor.nodeChanged();
            isHandled = true;
        }
        return isHandled;
    };
    const indentListSelection = function(editor) {
        return selectionIndentation(editor, 'Indent');
    };
    const outdentListSelection = function(editor) {
        return selectionIndentation(editor, 'Outdent');
    };
    const flattenListSelection = function(editor) {
        return selectionIndentation(editor, 'Flatten');
    };

    const global$7 = tinymce.util.Tools.resolve('tinymce.dom.BookmarkManager');

    const DOM$1 = global$6.DOM;
    const createBookmark = function(rng) {
        const bookmark = {};
        const setupEndPoint = function(start) {
            let offsetNode;
            let container;
            let offset;
            container = rng[start ? 'startContainer' : 'endContainer'];
            offset = rng[start ? 'startOffset' : 'endOffset'];
            if (container.nodeType === 1) {
                offsetNode = DOM$1.create('span', {
                    'data-mce-type': 'bookmark',
                });
                if (container.hasChildNodes()) {
                    offset = Math.min(offset, container.childNodes.length - 1);
                    if (start) {
                        container.insertBefore(
                            offsetNode,
                            container.childNodes[offset],
                        );
                    } else {
                        DOM$1.insertAfter(
                            offsetNode,
                            container.childNodes[offset],
                        );
                    }
                } else {
                    container.appendChild(offsetNode);
                }
                container = offsetNode;
                offset = 0;
            }
            bookmark[start ? 'startContainer' : 'endContainer'] = container;
            bookmark[start ? 'startOffset' : 'endOffset'] = offset;
        };
        setupEndPoint(true);
        if (!rng.collapsed) {
            setupEndPoint();
        }
        return bookmark;
    };
    const resolveBookmark = function(bookmark) {
        function restoreEndPoint(start) {
            let container;
            let offset;
            let node;
            const nodeIndex = function(container) {
                let node = container.parentNode.firstChild;
                let idx = 0;
                while (node) {
                    if (node === container) {
                        return idx;
                    }
                    if (
                        node.nodeType !== 1 ||
                        node.getAttribute('data-mce-type') !== 'bookmark'
                    ) {
                        idx++;
                    }
                    node = node.nextSibling;
                }
                return -1;
            };
            container = node =
                bookmark[start ? 'startContainer' : 'endContainer'];
            offset = bookmark[start ? 'startOffset' : 'endOffset'];
            if (!container) {
                return;
            }
            if (container.nodeType === 1) {
                offset = nodeIndex(container);
                container = container.parentNode;
                DOM$1.remove(node);
                if (!container.hasChildNodes() && DOM$1.isBlock(container)) {
                    container.appendChild(DOM$1.create('br'));
                }
            }
            bookmark[start ? 'startContainer' : 'endContainer'] = container;
            bookmark[start ? 'startOffset' : 'endOffset'] = offset;
        }
        restoreEndPoint(true);
        restoreEndPoint();
        const rng = DOM$1.createRng();
        rng.setStart(bookmark.startContainer, bookmark.startOffset);
        if (bookmark.endContainer) {
            rng.setEnd(bookmark.endContainer, bookmark.endOffset);
        }
        return Range.normalizeRange(rng);
    };
    const Bookmark = {
        createBookmark,
        resolveBookmark,
    };

    const isCustomList = function(list) {
        return /\btox\-/.test(list.className);
    };

    const listToggleActionFromListName = function(listName) {
        switch (listName) {
            case 'UL':
                return 'ToggleUlList';
            case 'OL':
                return 'ToggleOlList';
            case 'DL':
                return 'ToggleDLList';
        }
    };

    const updateListStyle = function(dom, el, detail) {
        const type = detail['list-style-type']
            ? detail['list-style-type']
            : null;
        dom.setStyle(el, 'list-style-type', type);
    };
    const setAttribs = function(elm, attrs) {
        global$5.each(attrs, function(value, key) {
            elm.setAttribute(key, value);
        });
    };
    const updateListAttrs = function(dom, el, detail) {
        setAttribs(el, detail['list-attributes']);
        global$5.each(dom.select('li', el), function(li) {
            setAttribs(li, detail['list-item-attributes']);
        });
    };
    const updateListWithDetails = function(dom, el, detail) {
        updateListStyle(dom, el, detail);
        updateListAttrs(dom, el, detail);
    };
    const removeStyles = function(dom, element, styles) {
        global$5.each(styles, function(style) {
            let _a;
            return dom.setStyle(element, ((_a = {}), (_a[style] = ''), _a));
        });
    };
    const getEndPointNode = function(editor, rng, start, root) {
        let container;
        let offset;
        container = rng[start ? 'startContainer' : 'endContainer'];
        offset = rng[start ? 'startOffset' : 'endOffset'];
        if (container.nodeType === 1) {
            container =
                container.childNodes[
                    Math.min(offset, container.childNodes.length - 1)
                ] || container;
        }
        if (!start && NodeType.isBr(container.nextSibling)) {
            container = container.nextSibling;
        }
        while (container.parentNode !== root) {
            if (NodeType.isTextBlock(editor, container)) {
                return container;
            }
            if (/^(TD|TH)$/.test(container.parentNode.nodeName)) {
                return container;
            }
            container = container.parentNode;
        }
        return container;
    };
    const getSelectedTextBlocks = function(editor, rng, root) {
        const textBlocks = [];
        const { dom } = editor;
        const startNode = getEndPointNode(editor, rng, true, root);
        const endNode = getEndPointNode(editor, rng, false, root);
        let block;
        const siblings = [];
        for (let node = startNode; node; node = node.nextSibling) {
            siblings.push(node);
            if (node === endNode) {
                break;
            }
        }
        global$5.each(siblings, function(node) {
            if (NodeType.isTextBlock(editor, node)) {
                textBlocks.push(node);
                block = null;
                return;
            }
            if (dom.isBlock(node) || NodeType.isBr(node)) {
                if (NodeType.isBr(node)) {
                    dom.remove(node);
                }
                block = null;
                return;
            }
            const { nextSibling } = node;
            if (global$7.isBookmarkNode(node)) {
                if (
                    NodeType.isTextBlock(editor, nextSibling) ||
                    (!nextSibling && node.parentNode === root)
                ) {
                    block = null;
                    return;
                }
            }
            if (!block) {
                block = dom.create('p');
                node.parentNode.insertBefore(block, node);
                textBlocks.push(block);
            }
            block.appendChild(node);
        });
        return textBlocks;
    };
    const hasCompatibleStyle = function(dom, sib, detail) {
        const sibStyle = dom.getStyle(sib, 'list-style-type');
        let detailStyle = detail ? detail['list-style-type'] : '';
        detailStyle = detailStyle === null ? '' : detailStyle;
        return sibStyle === detailStyle;
    };
    const applyList = function(editor, listName, detail) {
        if (detail === void 0) {
            detail = {};
        }
        const rng = editor.selection.getRng(true);
        let bookmark;
        let listItemName = 'LI';
        const root = Selection.getClosestListRootElm(
            editor,
            editor.selection.getStart(true),
        );
        const { dom } = editor;
        if (dom.getContentEditable(editor.selection.getNode()) === 'false') {
            return;
        }
        listName = listName.toUpperCase();
        if (listName === 'DL') {
            listItemName = 'DT';
        }
        bookmark = Bookmark.createBookmark(rng);
        global$5.each(getSelectedTextBlocks(editor, rng, root), function(
            block,
        ) {
            let listBlock;
            let sibling;
            sibling = block.previousSibling;
            if (
                sibling &&
                NodeType.isListNode(sibling) &&
                sibling.nodeName === listName &&
                hasCompatibleStyle(dom, sibling, detail)
            ) {
                listBlock = sibling;
                block = dom.rename(block, listItemName);
                sibling.appendChild(block);
            } else {
                listBlock = dom.create(listName);
                block.parentNode.insertBefore(listBlock, block);
                listBlock.appendChild(block);
                block = dom.rename(block, listItemName);
            }
            removeStyles(dom, block, [
                'margin',
                'margin-right',
                'margin-bottom',
                'margin-left',
                'margin-top',
                'padding',
                'padding-right',
                'padding-bottom',
                'padding-left',
                'padding-top',
            ]);
            updateListWithDetails(dom, listBlock, detail);
            mergeWithAdjacentLists(editor.dom, listBlock);
        });
        editor.selection.setRng(Bookmark.resolveBookmark(bookmark));
    };
    const isValidLists = function(list1, list2) {
        return (
            list1 &&
            list2 &&
            NodeType.isListNode(list1) &&
            list1.nodeName === list2.nodeName
        );
    };
    const hasSameListStyle = function(dom, list1, list2) {
        const targetStyle = dom.getStyle(list1, 'list-style-type', true);
        const style = dom.getStyle(list2, 'list-style-type', true);
        return targetStyle === style;
    };
    const hasSameClasses = function(elm1, elm2) {
        return elm1.className === elm2.className;
    };
    const shouldMerge = function(dom, list1, list2) {
        return (
            isValidLists(list1, list2) &&
            hasSameListStyle(dom, list1, list2) &&
            hasSameClasses(list1, list2)
        );
    };
    var mergeWithAdjacentLists = function(dom, listBlock) {
        let sibling;
        let node;
        sibling = listBlock.nextSibling;
        if (shouldMerge(dom, listBlock, sibling)) {
            while ((node = sibling.firstChild)) {
                listBlock.appendChild(node);
            }
            dom.remove(sibling);
        }
        sibling = listBlock.previousSibling;
        if (shouldMerge(dom, listBlock, sibling)) {
            while ((node = sibling.lastChild)) {
                listBlock.insertBefore(node, listBlock.firstChild);
            }
            dom.remove(sibling);
        }
    };
    const updateList = function(editor, list, listName, detail) {
        if (list.nodeName !== listName) {
            const newList = editor.dom.rename(list, listName);
            updateListWithDetails(editor.dom, newList, detail);
            fireListEvent(
                editor,
                listToggleActionFromListName(listName),
                newList,
            );
        } else {
            updateListWithDetails(editor.dom, list, detail);
            fireListEvent(editor, listToggleActionFromListName(listName), list);
        }
    };
    const toggleMultipleLists = function(
        editor,
        parentList,
        lists,
        listName,
        detail,
    ) {
        if (parentList.nodeName === listName && !hasListStyleDetail(detail)) {
            flattenListSelection(editor);
        } else {
            const bookmark = Bookmark.createBookmark(
                editor.selection.getRng(true),
            );
            global$5.each([parentList].concat(lists), function(elm) {
                updateList(editor, elm, listName, detail);
            });
            editor.selection.setRng(Bookmark.resolveBookmark(bookmark));
        }
    };
    var hasListStyleDetail = function(detail) {
        return 'list-style-type' in detail;
    };
    const toggleSingleList = function(editor, parentList, listName, detail) {
        if (parentList === editor.getBody()) {
            return;
        }
        if (parentList) {
            if (
                parentList.nodeName === listName &&
                !hasListStyleDetail(detail) &&
                !isCustomList(parentList)
            ) {
                flattenListSelection(editor);
            } else {
                const bookmark = Bookmark.createBookmark(
                    editor.selection.getRng(true),
                );
                updateListWithDetails(editor.dom, parentList, detail);
                const newList = editor.dom.rename(parentList, listName);
                mergeWithAdjacentLists(editor.dom, newList);
                editor.selection.setRng(Bookmark.resolveBookmark(bookmark));
                fireListEvent(
                    editor,
                    listToggleActionFromListName(listName),
                    newList,
                );
            }
        } else {
            applyList(editor, listName, detail);
            fireListEvent(
                editor,
                listToggleActionFromListName(listName),
                parentList,
            );
        }
    };
    const toggleList = function(editor, listName, detail) {
        const parentList = Selection.getParentList(editor);
        const selectedSubLists = Selection.getSelectedSubLists(editor);
        detail = detail || {};
        if (parentList && selectedSubLists.length > 0) {
            toggleMultipleLists(
                editor,
                parentList,
                selectedSubLists,
                listName,
                detail,
            );
        } else {
            toggleSingleList(editor, parentList, listName, detail);
        }
    };
    const ToggleList = {
        toggleList,
        mergeWithAdjacentLists,
    };

    const DOM$2 = global$6.DOM;
    const normalizeList = function(dom, ul) {
        let sibling;
        const { parentNode } = ul;
        if (parentNode.nodeName === 'LI' && parentNode.firstChild === ul) {
            sibling = parentNode.previousSibling;
            if (sibling && sibling.nodeName === 'LI') {
                sibling.appendChild(ul);
                if (NodeType.isEmpty(dom, parentNode)) {
                    DOM$2.remove(parentNode);
                }
            } else {
                DOM$2.setStyle(parentNode, 'listStyleType', 'none');
            }
        }
        if (NodeType.isListNode(parentNode)) {
            sibling = parentNode.previousSibling;
            if (sibling && sibling.nodeName === 'LI') {
                sibling.appendChild(ul);
            }
        }
    };
    const normalizeLists = function(dom, element) {
        global$5.each(global$5.grep(dom.select('ol,ul', element)), function(
            ul,
        ) {
            normalizeList(dom, ul);
        });
    };
    const NormalizeLists = {
        normalizeList,
        normalizeLists,
    };

    const findNextCaretContainer = function(editor, rng, isForward, root) {
        let node = rng.startContainer;
        const offset = rng.startOffset;
        if (
            NodeType.isTextNode(node) &&
            (isForward ? offset < node.data.length : offset > 0)
        ) {
            return node;
        }
        const nonEmptyBlocks = editor.schema.getNonEmptyElements();
        if (node.nodeType === 1) {
            node = global$1.getNode(node, offset);
        }
        const walker = new global$2(node, root);
        if (isForward) {
            if (NodeType.isBogusBr(editor.dom, node)) {
                walker.next();
            }
        }
        while ((node = walker[isForward ? 'next' : 'prev2']())) {
            if (node.nodeName === 'LI' && !node.hasChildNodes()) {
                return node;
            }
            if (nonEmptyBlocks[node.nodeName]) {
                return node;
            }
            if (NodeType.isTextNode(node) && node.data.length > 0) {
                return node;
            }
        }
    };
    const hasOnlyOneBlockChild = function(dom, elm) {
        const { childNodes } = elm;
        return (
            childNodes.length === 1 &&
            !NodeType.isListNode(childNodes[0]) &&
            dom.isBlock(childNodes[0])
        );
    };
    const unwrapSingleBlockChild = function(dom, elm) {
        if (hasOnlyOneBlockChild(dom, elm)) {
            dom.remove(elm.firstChild, true);
        }
    };
    const moveChildren = function(dom, fromElm, toElm) {
        let node;
        let targetElm;
        targetElm = hasOnlyOneBlockChild(dom, toElm) ? toElm.firstChild : toElm;
        unwrapSingleBlockChild(dom, fromElm);
        if (!NodeType.isEmpty(dom, fromElm, true)) {
            while ((node = fromElm.firstChild)) {
                targetElm.appendChild(node);
            }
        }
    };
    const mergeLiElements = function(dom, fromElm, toElm) {
        let node;
        let listNode;
        const ul = fromElm.parentNode;
        if (
            !NodeType.isChildOfBody(dom, fromElm) ||
            !NodeType.isChildOfBody(dom, toElm)
        ) {
            return;
        }
        if (NodeType.isListNode(toElm.lastChild)) {
            listNode = toElm.lastChild;
        }
        if (ul === toElm.lastChild) {
            if (NodeType.isBr(ul.previousSibling)) {
                dom.remove(ul.previousSibling);
            }
        }
        node = toElm.lastChild;
        if (node && NodeType.isBr(node) && fromElm.hasChildNodes()) {
            dom.remove(node);
        }
        if (NodeType.isEmpty(dom, toElm, true)) {
            dom.$(toElm).empty();
        }
        moveChildren(dom, fromElm, toElm);
        if (listNode) {
            toElm.appendChild(listNode);
        }
        const contains = contains$1(
            Element.fromDom(toElm),
            Element.fromDom(fromElm),
        );
        const nestedLists = contains
            ? dom.getParents(fromElm, NodeType.isListNode, toElm)
            : [];
        dom.remove(fromElm);
        each(nestedLists, function(list) {
            if (NodeType.isEmpty(dom, list) && list !== dom.getRoot()) {
                dom.remove(list);
            }
        });
    };
    const mergeIntoEmptyLi = function(editor, fromLi, toLi) {
        editor.dom.$(toLi).empty();
        mergeLiElements(editor.dom, fromLi, toLi);
        editor.selection.setCursorLocation(toLi);
    };
    const mergeForward = function(editor, rng, fromLi, toLi) {
        const { dom } = editor;
        if (dom.isEmpty(toLi)) {
            mergeIntoEmptyLi(editor, fromLi, toLi);
        } else {
            const bookmark = Bookmark.createBookmark(rng);
            mergeLiElements(dom, fromLi, toLi);
            editor.selection.setRng(Bookmark.resolveBookmark(bookmark));
        }
    };
    const mergeBackward = function(editor, rng, fromLi, toLi) {
        const bookmark = Bookmark.createBookmark(rng);
        mergeLiElements(editor.dom, fromLi, toLi);
        const resolvedBookmark = Bookmark.resolveBookmark(bookmark);
        editor.selection.setRng(resolvedBookmark);
    };
    const backspaceDeleteFromListToListCaret = function(editor, isForward) {
        const { dom } = editor;
        const { selection } = editor;
        const selectionStartElm = selection.getStart();
        const root = Selection.getClosestListRootElm(editor, selectionStartElm);
        const li = dom.getParent(selection.getStart(), 'LI', root);
        if (li) {
            const ul = li.parentNode;
            if (ul === editor.getBody() && NodeType.isEmpty(dom, ul)) {
                return true;
            }
            const rng_1 = Range.normalizeRange(selection.getRng());
            const otherLi_1 = dom.getParent(
                findNextCaretContainer(editor, rng_1, isForward, root),
                'LI',
                root,
            );
            if (otherLi_1 && otherLi_1 !== li) {
                editor.undoManager.transact(function() {
                    if (isForward) {
                        mergeForward(editor, rng_1, otherLi_1, li);
                    } else if (NodeType.isFirstChild(li)) {
                        outdentListSelection(editor);
                    } else {
                        mergeBackward(editor, rng_1, li, otherLi_1);
                    }
                });
                return true;
            }
            if (!otherLi_1) {
                if (
                    !isForward &&
                    rng_1.startOffset === 0 &&
                    rng_1.endOffset === 0
                ) {
                    editor.undoManager.transact(function() {
                        flattenListSelection(editor);
                    });
                    return true;
                }
            }
        }
        return false;
    };
    const removeBlock = function(dom, block, root) {
        const parentBlock = dom.getParent(block.parentNode, dom.isBlock, root);
        dom.remove(block);
        if (parentBlock && dom.isEmpty(parentBlock)) {
            dom.remove(parentBlock);
        }
    };
    const backspaceDeleteIntoListCaret = function(editor, isForward) {
        const { dom } = editor;
        const selectionStartElm = editor.selection.getStart();
        const root = Selection.getClosestListRootElm(editor, selectionStartElm);
        const block = dom.getParent(selectionStartElm, dom.isBlock, root);
        if (block && dom.isEmpty(block)) {
            const rng = Range.normalizeRange(editor.selection.getRng());
            const otherLi_2 = dom.getParent(
                findNextCaretContainer(editor, rng, isForward, root),
                'LI',
                root,
            );
            if (otherLi_2) {
                editor.undoManager.transact(function() {
                    removeBlock(dom, block, root);
                    ToggleList.mergeWithAdjacentLists(
                        dom,
                        otherLi_2.parentNode,
                    );
                    editor.selection.select(otherLi_2, true);
                    editor.selection.collapse(isForward);
                });
                return true;
            }
        }
        return false;
    };
    const backspaceDeleteCaret = function(editor, isForward) {
        return (
            backspaceDeleteFromListToListCaret(editor, isForward) ||
            backspaceDeleteIntoListCaret(editor, isForward)
        );
    };
    const backspaceDeleteRange = function(editor) {
        const selectionStartElm = editor.selection.getStart();
        const root = Selection.getClosestListRootElm(editor, selectionStartElm);
        const startListParent = editor.dom.getParent(
            selectionStartElm,
            'LI,DT,DD',
            root,
        );
        if (
            startListParent ||
            Selection.getSelectedListItems(editor).length > 0
        ) {
            editor.undoManager.transact(function() {
                editor.execCommand('Delete');
                NormalizeLists.normalizeLists(editor.dom, editor.getBody());
            });
            return true;
        }
        return false;
    };
    const backspaceDelete = function(editor, isForward) {
        return editor.selection.isCollapsed()
            ? backspaceDeleteCaret(editor, isForward)
            : backspaceDeleteRange(editor);
    };
    const setup = function(editor) {
        editor.on('keydown', function(e) {
            if (e.keyCode === global$3.BACKSPACE) {
                if (backspaceDelete(editor, false)) {
                    e.preventDefault();
                }
            } else if (e.keyCode === global$3.DELETE) {
                if (backspaceDelete(editor, true)) {
                    e.preventDefault();
                }
            }
        });
    };
    const Delete = {
        setup,
        backspaceDelete,
    };

    const get = function(editor) {
        return {
            backspaceDelete(isForward) {
                Delete.backspaceDelete(editor, isForward);
            },
        };
    };
    const Api = { get };

    const queryListCommandState = function(editor, listName) {
        return function() {
            const parentList = editor.dom.getParent(
                editor.selection.getStart(),
                'UL,OL,DL',
            );
            return parentList && parentList.nodeName === listName;
        };
    };
    const register = function(editor) {
        editor.on('BeforeExecCommand', function(e) {
            const cmd = e.command.toLowerCase();
            if (cmd === 'indent') {
                indentListSelection(editor);
            } else if (cmd === 'outdent') {
                outdentListSelection(editor);
            }
        });
        editor.addCommand('InsertUnorderedList', function(ui, detail) {
            ToggleList.toggleList(editor, 'UL', detail);
        });
        editor.addCommand('InsertOrderedList', function(ui, detail) {
            ToggleList.toggleList(editor, 'OL', detail);
        });
        editor.addCommand('InsertDefinitionList', function(ui, detail) {
            ToggleList.toggleList(editor, 'DL', detail);
        });
        editor.addCommand('RemoveList', function() {
            flattenListSelection(editor);
        });
        editor.addQueryStateHandler(
            'InsertUnorderedList',
            queryListCommandState(editor, 'UL'),
        );
        editor.addQueryStateHandler(
            'InsertOrderedList',
            queryListCommandState(editor, 'OL'),
        );
        editor.addQueryStateHandler(
            'InsertDefinitionList',
            queryListCommandState(editor, 'DL'),
        );
    };
    const Commands = { register };

    const shouldIndentOnTab = function(editor) {
        return editor.getParam('lists_indent_on_tab', true);
    };
    const Settings = { shouldIndentOnTab };

    const setupTabKey = function(editor) {
        editor.on('keydown', function(e) {
            if (e.keyCode !== global$3.TAB || global$3.metaKeyPressed(e)) {
                return;
            }
            editor.undoManager.transact(function() {
                if (
                    e.shiftKey
                        ? outdentListSelection(editor)
                        : indentListSelection(editor)
                ) {
                    e.preventDefault();
                }
            });
        });
    };
    const setup$1 = function(editor) {
        if (Settings.shouldIndentOnTab(editor)) {
            setupTabKey(editor);
        }
        Delete.setup(editor);
    };
    const Keyboard = { setup: setup$1 };

    const findIndex = function(list, predicate) {
        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            if (predicate(element)) {
                return index;
            }
        }
        return -1;
    };
    const listState = function(editor, listName) {
        return function(buttonApi) {
            const nodeChangeHandler = function(e) {
                const tableCellIndex = findIndex(
                    e.parents,
                    NodeType.isTableCellNode,
                );
                const parents =
                    tableCellIndex !== -1
                        ? e.parents.slice(0, tableCellIndex)
                        : e.parents;
                const lists = global$5.grep(parents, NodeType.isListNode);
                buttonApi.setActive(
                    lists.length > 0 &&
                        lists[0].nodeName === listName &&
                        !isCustomList(lists[0]),
                );
            };
            editor.on('NodeChange', nodeChangeHandler);
            return function() {
                return editor.off('NodeChange', nodeChangeHandler);
            };
        };
    };
    const register$1 = function(editor) {
        const hasPlugin = function(editor, plugin) {
            const plugins = editor.settings.plugins
                ? editor.settings.plugins
                : '';
            return global$5.inArray(plugins.split(/[ ,]/), plugin) !== -1;
        };
        const exec = function(command) {
            return function() {
                return editor.execCommand(command);
            };
        };
        if (!hasPlugin(editor, 'advlist')) {
            editor.ui.registry.addToggleButton('numlist', {
                icon: 'ordered-list',
                active: false,
                tooltip: 'Numbered list',
                onAction: exec('InsertOrderedList'),
                onSetup: listState(editor, 'OL'),
            });
            editor.ui.registry.addToggleButton('bullist', {
                icon: 'unordered-list',
                active: false,
                tooltip: 'Bullet list',
                onAction: exec('InsertUnorderedList'),
                onSetup: listState(editor, 'UL'),
            });
        }
    };
    const Buttons = { register: register$1 };

    function Plugin() {
        global.add('lists', function(editor) {
            Keyboard.setup(editor);
            Buttons.register(editor);
            Commands.register(editor);
            return Api.get(editor);
        });
    }

    Plugin();
})(window);
