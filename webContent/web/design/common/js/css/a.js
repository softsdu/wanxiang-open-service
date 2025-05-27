"use strict";

function _toConsumableArray(e) { if (Array.isArray(e)) { for (var t = 0, n = Array(e.length); t < e.length; t++) n[t] = e[t]; return n } return Array.from(e) }
var version = "2020-4-15-16-54",
    Glodon = window.Glodon || {};
if (Glodon.Version = version, function() {
        function e(e, t) { for (var n = t.split("."), o = e, i = n.length, a = 0; a < i; a++) void 0 === o[n[a]] && (o[n[a]] = {}), o = o[n[a]]; return o }
        e(Glodon, "Web.Lang.Utility.Namespace").ensureNamespace = e
    }(), function() {
        var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Common"),
            t = function(e) { "string" == typeof e && (e = JSON.parse(res)), this.code = e.code, this.message = e.message };
        t.prototype = { getErrorCode: function() { return this.code }, getErrorMessage: function() { return this.message } }, e.Error = t
    }(), function() {
        function e(e) {
            function t() {}
            return t.prototype = e, new t
        }

        function t(t, n) {
            var o = e(n.prototype);
            o.constructor = t, t.prototype = o
        }
        Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Lang.Utility.Type").inheritPrototype = t
    }(), function() {
        var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Lang.Utility.HttpRequest"),
            t = function(e) {
                var t, n = { type: "get", cache: !0, headers: { "Content-type": "application/x-www-form-urlencoded" }, data: null, async: !0, success: null, failure: null },
                    o = Object.assign(n, e);
                t = window.XMLHttpRequest ? new XMLHttpRequest : new ActiveXObject("Microsoft.XMLHTTP"), t.onreadystatechange = function() {
                    if (4 == t.readyState) {
                        var e = t.status;
                        e >= 200 && e < 300 || 0 == e ? o.success && o.success(t.responseText, t.responseXML) : o.failure && o.failure(e)
                    }
                }, t.open(o.type, o.url, o.async);
                for (var i in o.headers) t.setRequestHeader(i, o.headers[i]);
                t.send(o.data)
            },
            n = function(e, t) {
                var n = {};
                if (n[e]) t && t();
                else {
                    var o = document.createElement("script");
                    o.type = "text/javascript", o.src = e, document.head.appendChild(o), n[e] = !0, o.readyState ? o.onreadystatechange = function() { "loaded" != o.readyState && "complete" != o.readyState || (o.onreadystatechange = null, t && t()) } : o.onload = function() { t && t() }
                }
            },
            o = function(e, n) { return new Promise(function(o, i) { t({ url: e, method: "GET", success: function(e) { try { var t = JSON.parse(e) } catch (t) { return o(e) } "success" == t.code || "noCode" == n ? o("noCode" == n ? t : t.data) : i("requestError，dataCode:" + t.code + ", dataMessage:" + t.message) }, failure: function(e) { i(e) } }) }) };
        e.ajax = t, e.promiseJSONRequest = o, e.getScript = n
    }(), function() {
        var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Lang.Utility.FullScreen"),
            t = function(e) {
                if (!e) return !1;
                e.requestFullscreen ? e.requestFullscreen() : e.mozRequestFullScreen ? e.mozRequestFullScreen() : e.webkitRequestFullScreen ? e.webkitRequestFullScreen() : e.msRequestFullscreen && e.msRequestFullscreen()
            },
            n = function() { document.exitFullscreen ? document.exitFullscreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.webkitCancelFullScreen ? document.webkitCancelFullScreen() : document.msExitFullscreen && document.msExitFullscreen() },
            o = function() { return document.webkitIsFullScreen || !!document.mozFullScreenElement || !!document.msFullScreenElement || !1 },
            i = function(e) {
                var t = function() { e && e() };
                document.onfullscreenchange = t, document.onwebkitfullscreenchange = t, document.documentElement.onwebkitfullscreenchange = t, document.onmozfullscreenchange = t, document.onmsfullscreenchange = t
            };
        e.fullScreen = t, e.exitFullScreen = n, e.onFullScreenChanged = i, e.isFullScreen = o
    }(), function() {
        var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Lang.Utility.ClientHelper"),
            t = function() {
                var e = navigator.userAgent,
                    t = /(?:Windows Phone)/.test(e),
                    n = /(?:SymbianOS)/.test(e) || t,
                    o = /(?:Android)/.test(e),
                    i = /(?:Firefox)/.test(e),
                    a = (/(?:Chrome|CriOS)/.test(e), /(?:iPad|PlayBook)/.test(e) || o && !/(?:Mobile)/.test(e) || i && /(?:Tablet)/.test(e));
                return !(/(?:iPhone)/.test(e) && !a || o || n || a)
            },
            n = function() { return /(?:iPhone)/.test(navigator.userAgent) },
            o = function(e) {
                var t = function(e) { return e.replace("viewToken.json", "").replace(/\.\//g, "/").replace(/\/\//g, "/") };
                if (e.indexOf("://") > -1) {
                    var n = e.split("://");
                    e = n[0] + "://" + t(n[1])
                } else e = "./" != e.slice(0, 2) ? t(e) : "." + t(e.slice(1));
                return e
            },
            i = function(e, t, n) {
                n = n || "asc";
                var o = !1;
                return t ? t.indexOf(".") > -1 && (o = !0) : t = "name", e = e.sort(function(e, i) {
                    if (o) {
                        var a = l(e, t),
                            r = l(i, t);
                        return "asc" == n ? a.localeCompare(r) : r.localeCompare(a)
                    }
                    return "asc" == n ? e[t].localeCompare(i[t]) : i[t].localeCompare(e[t])
                }), s(e, t, o)
            },
            a = function(e, t, n) { n = n || "asc"; var o = !1; return t ? t.indexOf(".") > -1 && (o = !0) : t = "name", e = e.sort(r(t, o)), s(e, t, o) },
            r = function(e, t) {
                return function(n, o) {
                    function i(e, t, n) {
                        if (n) {
                            for (s = t;
                                (n = i(e, s)) < 76 && n > 65;) ++s;
                            return +e.slice(t - 1, s)
                        }
                        return n = f && f.indexOf(e.charAt(t)), n > -1 ? n + 76 : (n = e.charCodeAt(t) || 0) < 45 || n > 127 ? n : n < 46 ? 65 : n < 48 ? n - 1 : n < 58 ? n + 18 : n < 65 ? n - 11 : n < 91 ? n + 11 : n < 97 ? n - 37 : n < 123 ? n + 5 : n - 63
                    }
                    var a, r;
                    t ? (a = l(n, e), r = l(o, e)) : (a = n[e], r = o[e]);
                    var s, c, d = 1,
                        u = 0,
                        p = 0,
                        f = String.alphabet;
                    if ((a += "") != (r += ""))
                        for (; d;)
                            if (c = i(a, u++), d = i(r, p++), c < 76 && d < 76 && c > 66 && d > 66 && (c = i(a, u, u), d = i(r, p, u = s), p = s), c != d) return c < d ? -1 : 1;
                    return 0
                }
            },
            s = function(e, t, n) {
                var o = [],
                    i = [],
                    a = [],
                    r = [];
                return e.map(function(e, s) {
                    var c;
                    c = n ? l(e, t) : e[t], /^[a-zA-Z]*$/.test(c.slice(0, 1)) ? o.push(e) : /^[\u4e00-\u9fa5]*$/.test(c.slice(0, 1)) ? i.push(e) : /^\d+(\.\d+)?$/.test(c.slice(0, 1)) ? a.push(e) : r.push(e)
                }), r.concat(a, o, i)
            },
            l = function(e, t) {
                var n = t.split("."),
                    o = e;
                return n.map(function(e, t) { o = o[e] }), o
            },
            c = function() { return !!(window.ActiveXObject || "ActiveXObject" in window) },
            d = function(e, t, n, o, i, a) {
                var r = void 0,
                    s = void 0,
                    l = void 0,
                    c = void 0,
                    d = 0,
                    u = Math.sqrt((n - e) * (n - e) + (o - t) * (o - t));
                if (0 === u) return [0, { x: n, y: o }];
                var p = Math.sqrt((i - e) * (i - e) + (a - t) * (a - t));
                if (0 === p) return [0, { x: i, y: a }];
                var f = Math.sqrt((n - i) * (n - i) + (o - a) * (o - a));
                if (0 === f) return d = u, [d, { x: n, y: o }];
                if (u < p) {
                    if (o === a ? r = n < i ? 0 : Math.PI : (c = (i - n) / f, c - 1 > 1e-5 && (c = 1), r = Math.acos(c), o > a && (r = 2 * Math.PI - r)), c = (e - n) / u, c - 1 > 1e-5 && (c = 1), s = Math.acos(c), o > t && (s = 2 * Math.PI - s), l = s - r, l < 0 && (l = -l), l > Math.PI && (l = 2 * Math.PI - l), l > Math.PI / 2) return [u, { x: n, y: o }];
                    if (n === i) return [p * Math.sin(l), { x: n, y: t }];
                    if (o === a) return [p * Math.sin(l), { x: e, y: o }];
                    var h = 0,
                        m = 0,
                        g = (a - o) / i - n,
                        b = -1 / g,
                        v = t - e * b;
                    return h = (a - i * g - v) / (b - g), m = b * h + v, [u * Math.sin(l), { x: h, y: m }]
                }
                if (o === a ? r = n < i ? Math.PI : 0 : (c = (n - i) / f, c - 1 > 1e-5 && (c = 1), r = Math.acos(c), a > o && (r = 2 * Math.PI - r)), c = (e - i) / p, c - 1 > 1e-5 && (c = 1), s = Math.acos(c), a > t && (s = 2 * Math.PI - s), l = s - r, l < 0 && (l = -l), l > Math.PI && (l = 2 * Math.PI - l), l > Math.PI / 2) return [p, { x: i, y: a }];
                if (n === i) return [p * Math.sin(l), { x: n, y: t }];
                if (o === a) return [p * Math.sin(l), { x: e, y: o }];
                var y = 0,
                    w = 0,
                    C = (a - o) / i - n,
                    k = -1 / C,
                    B = t - e * k;
                return y = (a - i * C - B) / (k - C), w = k * y + B, [p * Math.sin(l), { x: y, y: w }]
            };
        e.getIsDesktop = t, e.getIsIphone = n, e.getIsIE = c, e.formatURL = o, e.sortByName = i, e.sortByRules = a, e.PointToLineDistance = d
    }(), function() {
        var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Lang.Utility.MouseMotion"),
            t = function(e) {
                function t() { n && "walk" == e.getViewer().getEditorManager().editor.name || (o.addClass("motion-zoom"), i = Date.now(), setTimeout(function() { Date.now() - i > 180 && o.removeClass("motion-zoom") }, 200)) }
                var n = !1,
                    o = e.getDomElement(),
                    i = void 0,
                    a = !1,
                    r = !1,
                    s = null;
                Glodon.Bimface.Viewer.Viewer3D && e instanceof Glodon.Bimface.Viewer.Viewer3D && (n = !0), o.addEventListener("keydown", function(e) { 17 == event.keyCode && (a = !0) }), o.addEventListener("keyup", function(e) { 17 == event.keyCode && (a = !1) }), o.addEventListener("mousedown", function(t) { e._opt.enableZoomRect || a || (s = { x: t.clientX, y: t.clientY }) }), o.addEventListener("mousemove", function(t) {
                    if (s && !r && !(Math.abs(s.x - t.clientX) < 2 && Math.abs(s.y - t.clientY) < 2)) {
                        if (n) {
                            var i = e.getUseLeftHandedInput();
                            if ("walk" == e.getViewer().getEditorManager().editor.name) 1 == t.buttons && o.addClass("motion-rotate");
                            else {
                                var a = e._getIsCursorEnabled();
                                1 == t.buttons ? a && o.addClass(i ? "motion-rotate" : "motion-translate") : o.addClass(i ? "motion-translate" : "motion-rotate")
                            }
                        } else 1 == t.buttons && o.addClass("motion-translate");
                        r = !0
                    }
                }), o.addEventListener("mousewheel", t, !1), o.addEventListener("DOMMouseScroll", t, !1), o.addEventListener("mouseup", function(e) { s = !1, r = !1, o.removeClass("motion-translate"), o.removeClass("motion-rotate") })
            };
        e.setCursor = t
    }(), function() {
        var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Lang.Utility.Dom"),
            t = function(e, t) { var n = document.createElement(e); return n.setAttribute("class", t), n };
        e.create = t
    }(), function() {
        var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Lang.Utility.Dom"),
            t = function(e, t) { var n = document.createElementNS("http://www.w3.org/2000/svg", e); return n.setAttribute("class", t), n };
        e.createNS = t
    }(), function() {
        var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Lang.Utility.Dom"),
            t = function(e) { return e.indexof("#") ? document.getElementById(e.replace("#", "")) : e.indexof(".") ? document.getElementsByClassName(e.replace(".", "")) : document.getElementsByTagName(e) };
        e.select = t
    }(), function() {
        var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Lang.Utility.Dom"),
            t = Glodon.Web.Lang.Utility.ClientHelper.getIsDesktop(),
            n = function(e) {
                var n = { element: null, handle: null, axis: "all", cursor: "move", distance: 0, start: null, move: null, stop: null },
                    o = Object.assign(n, e),
                    i = o.element;
                if (!i) return !1;
                var a = o.handle || i,
                    r = void 0,
                    s = !1,
                    l = function(e) { return Math.pow(e.x, 2) + Math.pow(e.y, 2) > Math.pow(o.distance, 2) && (o.start && o.start(r), !0) },
                    c = function(e) { var t = navigator.userAgent; return t.indexOf("compatible") > -1 && t.indexOf("MSIE") > -1 && !isOpera ? 1 == e : 0 == e },
                    d = function(e) {
                        var t = i.offsetLeft,
                            n = i.offsetTop,
                            a = t + e.x < 0 ? 0 : t + e.x,
                            r = n + e.y < 0 ? 0 : n + e.y;
                        switch (o.axis) {
                            case "x":
                                i.style.left = a + "px";
                                break;
                            case "y":
                                i.style.top = r + "px";
                                break;
                            case "all":
                            default:
                                i.style.left = a + "px", i.style.top = r + "px"
                        }
                    },
                    u = function(e) {
                        var n = e;
                        if (t) {
                            if (!c(n.button)) return;
                            r = { x: n.clientX, y: n.clientY }, document.addEventListener("mousemove", p)
                        } else r = { x: n.touches[0].clientX, y: n.touches[0].clientY }, a.addEventListener("touchmove", p);
                        o.start && o.start(r)
                    },
                    p = function(e) {
                        var n = e;
                        if (t) var i = { x: n.clientX, y: n.clientY };
                        else var i = { x: n.touches[0].clientX, y: n.touches[0].clientY };
                        var a = { x: i.x - r.x, y: i.y - r.y };
                        s ? (o.move && o.move(r, i, a), r = i, d(a)) : s = l(a), e.preventDefault(), e.stopPropagation()
                    },
                    f = function() { s && o.end && o.end(r), s = !1, document.removeEventListener("mousemove", p), a.removeEventListener("touchmove", p) };
                t ? (a.style.cursor = o.cursor, a.style.userSelect = "none", a.addEventListener("mousedown", u), document.addEventListener("mouseup", f)) : (a.addEventListener("touchend", f), a.addEventListener("touchstart", u))
            };
        e.drag = n
    }(), function() {
        var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Lang.Utility.Dom"),
            t = function(t) {
                var n = { element: null, axis: "all", minWidth: 100, minHeight: 100, distance: 0, start: null, sizable: null, stop: null },
                    o = Object.assign(n, t),
                    i = o.element;
                if (!i) return !1;
                var a, r, s = void 0,
                    l = !1,
                    c = e.create("div", "bf-resize"),
                    d = function(e) { return Math.pow(e.x, 2) + Math.pow(e.y, 2) > Math.pow(o.distance, 2) && (o.start && o.start(s), !0) },
                    u = function(e) { var t = navigator.userAgent; return t.indexOf("compatible") > -1 && t.indexOf("MSIE") > -1 && !isOpera ? 1 == e : 0 == e },
                    p = function(e) {
                        var t = i.offsetLeft,
                            n = i.offsetTop,
                            s = a + e.x < o.minWidth ? o.minWidth : a + e.x,
                            l = r + e.y < o.minHeight ? o.minHeight : r + e.y;
                        switch (o.resize && o.resize(s, l), i.style.left = t + "px", i.style.top = n + "px", o.axis) {
                            case "x":
                                i.style.width = s + "px";
                                break;
                            case "y":
                                i.style.height = l + "px";
                                break;
                            case "all":
                            default:
                                i.style.width = s + "px", i.style.height = l + "px"
                        }
                    },
                    f = function(e) {
                        a = i.clientWidth, r = i.clientHeight;
                        var t = e;
                        u(t.button) && (s = { x: t.clientX, y: t.clientY }, document.addEventListener("mousemove", h), document.addEventListener("touchmove", h))
                    },
                    h = function(e) {
                        var t = e,
                            n = { x: t.clientX, y: t.clientY },
                            i = { x: n.x - s.x, y: n.y - s.y };
                        l ? (o.sizable && o.sizable(s, n, i), p(i)) : l = d(i)
                    },
                    m = function() { l && o.end && o.end(s), l = !1, document.removeEventListener("mousemove", h), document.removeEventListener("touchmove", h) };
                i.addClass("bf-sizable"), i.appendChild(c), c.addEventListener("mousedown", f), c.addEventListener("touchstart", f), document.addEventListener("mouseup", m), document.addEventListener("touchend", m)
            };
        e.sizable = t
    }(), function() {
        var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Lang.Utility.Dom"),
            t = function(t) {
                var n = this,
                    o = { element: null, min: 0, max: 100, cur: 50, step: 1, isShowProgress: !0, input: null, change: null, currentColor: "#11dab7", defaultColor: "#999" },
                    i = Object.assign(o, t);
                this._opt = i;
                var a = e.create("div", "bf-range"),
                    r = e.create("input", "bf-input-range");
                n.input = r, r.setAttribute("type", "range"), r.setAttribute("step", i.step), r.setAttribute("min", i.min), r.setAttribute("max", i.max), r.setAttribute("value", i.cur);
                var s = e.create("span", "bf-range-min");
                s.innerText = i.min;
                var l = e.create("span", "bf-range-cur");
                n.cur = l, l.innerText = i.cur;
                var c = e.create("span", "bf-range-max");
                c.innerText = i.max;
                var d = e.create("span", "bf-range-progress");
                a.appendChild(r), i.isShowProgress && (a.appendChild(s), a.appendChild(l), a.appendChild(c)), a.appendChild(d), i.element.appendChild(a), n.setProgress(i.cur), r.addEventListener("input", function() { n.setProgress(this.value), i.input && i.input(this.value) }), r.addEventListener("change", function() { n.setProgress(this.value), i.change && i.change(this.value) })
            };
        t.prototype.setProgress = function(e) {
            var t = this._opt,
                n = t.max - t.min,
                o = this.input,
                i = this.cur,
                a = (e - t.min) / n * 100;
            o.value = e, o.style.background = "linear-gradient(to right," + t.currentColor + " 0%," + t.currentColor + "  " + a + "%," + t.defaultColor + " " + a + "%, " + t.defaultColor + " 100%)", i.innerText = e
        }, t.prototype.reset = function() { this.setProgress(this._opt.cur) }, e.range = t
    }(), function() {
        var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Lang.Utility.Dom"),
            t = function(e) {
                var t = { element: null, min: 0, max: 100, from: null, to: null, step: 1, currentColor: "#11dab7", defaultColor: "#999", change: null };
                this._opt = Object.assign(t, e), this._opt.from = this._opt.from || this._opt.min, this._opt.to = this._opt.to || this._opt.max, this.init()
            };
        t.prototype = {
            init: function() {
                var t = e.create("div", "bf-multiple-range"),
                    n = e.create("div", "bf-range-track"),
                    o = e.create("span", "bf-slider bf-slider-min");
                o.id = "minSlider", o.type = "minimum";
                var i = e.create("span", "bf-slider bf-slider-max");
                i.id = "maxSlider", i.type = "maximum", this._state = { from: this._opt.from, to: this._opt.to }, n.style.backgroundColor = this._opt.currentColor, t.style.backgroundColor = this._opt.defaultColor, t.appendChild(n), t.appendChild(o), t.appendChild(i), this._opt.element.appendChild(t), this._track = n, this._sliders = { min: o, max: i }, this._element = t, this.bindEvent(), this.update(!1)
            },
            bindEvent: function() {
                var e, t, n = this,
                    o = !1,
                    i = function(n) {
                        var n = n || event;
                        t = n.screenX, e = this, o = !0
                    },
                    a = function(i) {
                        if (o) {
                            var i = i || event,
                                a = i.screenX - t,
                                r = Math.round(a / n._pix / n._opt.step) * n._opt.step;
                            0 != r && (t = r * n._pix + t, "minimum" == e.type ? n._state.from += r : n._state.to += r, n.recalculate(e), n.update(!0))
                        }
                    },
                    r = function() { e = null, o = !1 };
                this._sliders.min.addEventListener("mousedown", i), this._sliders.max.addEventListener("mousedown", i), document.addEventListener("mousemove", a), document.addEventListener("mouseup", r)
            },
            update: function(e) {
                var t = this._sliders.min.offsetWidth,
                    n = this._sliders.max.offsetWidth;
                if (!this._pix) {
                    var o = this._element.offsetWidth,
                        i = this._opt.max - this._opt.min,
                        a = (o - t - n) / i;
                    this._pix = a
                }
                var r = (this._state.from - this._opt.min) * this._pix,
                    s = (this._state.to - this._opt.min) * this._pix + t + n;
                this._track.style.left = r + t / 2 + "px", this._track.style.width = s - r - t / 2 - n / 2 + "px", this._sliders.min.style.left = r + "px", this._sliders.max.style.left = s + "px", this._opt.change && e && this._opt.change(this._state)
            },
            recalculate: function(e) { this._state.to >= this._opt.max && (this._state.to = this._opt.max), this._state.from <= this._opt.min && (this._state.from = this._opt.min), e && ("maximum" == e.type && this._state.to <= this._state.from && (this._state.to = this._state.from), "minimum" == e.type && this._state.from >= this._state.to && (this._state.from = this._state.to)) },
            getProgress: function() { return this._state },
            setProgress: function(e) { this._state = e, this.recalculate(), this.update(!1) }
        }, e.multipleRange = t
    }(), function() {
        var e = function(e) {
            var t, n;
            this.addEventListener("touchstart", function(e) { t = Date.now() }), this.addEventListener("touchend", function(o) {
                (n = Date.now()) - t < 200 && e(o)
            })
        };
        HTMLElement.prototype.tap = e
    }(), function() {
        (window.ActiveXObject || "ActiveXObject" in window) && (HTMLElement.prototype.remove = function() { this.parentNode && this.parentNode.removeChild(this) }, window.Element && function(e) { e.matches = e.matches || e.matchesSelector || e.webkitMatchesSelector || e.msMatchesSelector || function(e) { for (var t = this, n = (t.parentNode || t.document).querySelectorAll(e), o = -1; n[++o] && n[o] != t;); return !!n[o] } }(Element.prototype), window.Element && function(e) { e.closest = e.closest || function(e) { for (var t = this; t.matches && !t.matches(e);) t = t.parentNode; return t.matches ? t : null } }(Element.prototype))
    }(), function() {
        var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Lang.Utility.UUID"),
            t = function() { for (var e = [], t = "0123456789abcdef", n = 0; n < 36; n++) e[n] = t.substr(Math.floor(16 * Math.random()), 1); return e[14] = "4", e[19] = t.substr(3 & e[19] | 8, 1), e[8] = e[13] = e[18] = e[23] = "-", e.join("") };
        e.createUUID = t
    }(), function() {
        var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Lang.Utility"),
            t = function(e, t) {
                var n = null,
                    o = Date.now();
                return void 0 == t && (t = 30),
                    function() {
                        var i = Date.now(),
                            a = t - (i - o),
                            r = this,
                            s = arguments;
                        clearTimeout(n), a <= 0 ? (e.apply(r, s), o = Date.now()) : n = setTimeout(e, a)
                    }
            };
        e.throttle = t
    }(), function() {
        var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Lang"),
            t = function() { this.container = {} };
        t.prototype.addEvent = function(e, t) { return "string" == typeof e && "function" == typeof t && (void 0 === this.container[e] ? this.container[e] = [t] : this.container[e].push(t)), this }, t.prototype.fireEvent = function(e) {
            if (e && this.container[e]) {
                var t = Array.prototype.slice.call(arguments);
                t.shift();
                for (var n = this.container[e].length, o = 0; o < n; o++) { this.container[e][o].apply(null, t) }
            }
            return this
        }, t.prototype.removeEvent = function(e, t) {
            if ("function" == typeof t && "string" == typeof e) {
                var n = this.container[e];
                if (n instanceof Array) {
                    for (var o = 0, i = n.length; o < i; o += 1)
                        if (n[o] === t) { n.splice(o, 1); break }
                    0 == n.length && delete this.container[e]
                }
                return this
            }
        }, e.EventManager = t
    }(), function() {
        var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Geometry"),
            t = function(e, t, n) { this.x = e, this.y = t, this.z = n };
        t.prototype = { get: function() { return { x: this.x, y: this.y, z: this.z } }, set: function(e, t, n) { this.x = e, this.y = t, this.z = n } }, e.Point3d = t
    }(), function() {
        var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Geometry"),
            t = function(t, n) {
                var o = {},
                    i = new e.Point3d,
                    a = new e.Point3d;
                return i.set(t.x, t.y, t.z), a.set(n.x, n.y, n.z), o.min = i, o.max = a, o
            };
        e.BoundingBox = t
    }(), function() {
        var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Graphics.Utility"),
            t = function(e) { var t = e.toString(16); return 1 == t.length && (t = "0" + t), t };
        e.RGBToHex = t
    }(), !hostConfig) var hostConfig = { APIHost: "https://api.bimface.com", resourceHost: "https://m.bimface.com", staticHost: "https://static.bimface.com", dataEnvType: "BIMFACE" };
! function() {
    function e(e, t) {
        function n(e) { return "FloorPlan" == e || "CeilingPlan" == e }
        if ("DrawingSheet" != t.viewType) return null;
        var o = t.viewInfo,
            i = o.preview.width,
            a = o.preview.height,
            r = o.outline[0],
            s = o.outline[2],
            l = o.outline[1],
            c = o.outline[3],
            d = s - r,
            u = c - l;
        o = t;
        for (var p = o.portsAndViews, f = 0; f < p.length; f++) {
            var h = p[f];
            if (n(h.viewType)) {
                var m = function(t, n, o, s, c) {
                    var p = e.x / i,
                        f = (a - e.y) / a;
                    if ("Elevation" == c.viewType) {
                        f = (i - e.x) / i, p = e.y / a;
                        var h = c.viewPoint.viewDirection;
                        1 != Math.round(h[0]) && -1 != Math.round(h[1]) || (p = (a - e.y) / a)
                    }
                    var m = (t - r) / d,
                        g = (n - r) / d;
                    if (p < m || p > g) return null;
                    var b = (o - l) / u,
                        v = (s - l) / u;
                    if (f < b || f > v) return null;
                    var y = (p - m) / (g - m),
                        w = (f - b) / (v - b),
                        C = ((c.outline[2] - c.outline[0]) * y + c.outline[0]) * c.viewPoint.scale,
                        k = ((c.outline[3] - c.outline[1]) * w + c.outline[1]) * c.viewPoint.scale;
                    return new THREE.Vector3(C, k, 0)
                }(h.viewport[0], h.viewport[3], h.viewport[1], h.viewport[4], h);
                if (null != m) {
                    if (n(h.viewType)) null !== m && (m.z = h.elevation);
                    else if ("Elevation" == h.viewType) {
                        var g = h.viewPoint.viewDirection,
                            b = h.cropBox;
                        0 != Math.round(g[0]) ? null !== m && (m.z = m.y, m.y = m.x, m.x = g[0] < 0 ? b[3] : b[0]) : 0 != Math.round(g[1]) && null !== m && (m.z = m.y, m.y = g[1] < 0 ? b[4] : b[1])
                    }
                    return m
                }
            }
        }
        return null
    }

    function t(e, t, n) {
        if ("DrawingSheet" != t.viewType) return !1;
        var o = t.preview.width,
            i = t.preview.height,
            a = t.outline[0],
            r = t.outline[2],
            s = t.outline[1],
            l = t.outline[3],
            c = t.portsAndViews;
        for (var d in c) {
            var u = c[d];
            if ("FloorPlan" === u.viewType) {
                var p = u.viewPoint.scale,
                    f = u.outline[0] * p,
                    h = u.outline[2] * p,
                    m = u.outline[1] * p,
                    g = u.outline[3] * p;
                if (!(e.x < f || e.x > h || e.y < m || e.y > g)) {
                    var b = (e.x - f) / (h - f),
                        v = (e.y - m) / (g - m),
                        y = u.viewport[3] - u.viewport[0],
                        w = u.viewport[4] - u.viewport[1];
                    n(o * ((u.viewport[0] + y * b - a) / (r - a)), i - i * ((u.viewport[1] + w * v - s) / (l - s)), u)
                }
            }
        }
        return !0
    }
    var n = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Graphics.Utility.Relation"),
        o = function(e, t, n) {
            Glodon.Web.Lang.Utility.HttpRequest.ajax({
                url: hostConfig.resourceHost + "/" + e + "/metadata/views.json",
                success: function(o) {
                    var i = JSON.parse(o).viewList,
                        o = [];
                    for (var a in i) {
                        var r = i[a];
                        r.viewType == t && (r.preview.path = hostConfig.resourceHost + "/" + e + "/" + r.preview.path, o.push(r))
                    }
                    n && n(o)
                }
            })
        },
        i = function(e, t, n) { Glodon.Web.Lang.Utility.HttpRequest.ajax({ url: hostConfig.resourceHost + "/" + e + "/metadata/drawings.json", success: function(e) { for (var o = JSON.parse(e).drawingList, i = 0; i < o.length; i++) { var a = o[i]; if (a.viewInfo.id == t) { n && n(a); break } } } }) },
        a = function(t, n) {
            if ("DrawingSheet" == n.viewType) return e(t, n);
            if ("FloorPlan" != n.viewType) return console.warn("Not support yet!"), null;
            var o = n.preview.width,
                i = n.preview.height,
                a = n.outline[0],
                r = n.outline[2],
                s = n.outline[1],
                l = n.outline[3],
                c = r - a,
                d = l - s,
                u = (0 - a) / c,
                p = l / d,
                f = (t.x - o * u) / o,
                h = (i * p - t.y) / i;
            return f = f * c * n.viewPoint.scale, h = h * d * n.viewPoint.scale, new Glodon.Web.Geometry.Point3d(f, h, n.elevation)
        },
        r = function(e, n) {
            var o = [];
            if (t(e, n, function(e, t, n) { o.append({ x: e, y: t }) })) return 0 == o.length ? null : o;
            if ("FloorPlan" != n.viewType) return console.warn("Not support yet!"), null;
            var i = n.preview.width,
                a = n.preview.height,
                r = n.outline[0],
                s = n.outline[2],
                l = n.outline[1],
                c = n.outline[3],
                d = s - r,
                u = c - l,
                p = (0 - r) / (s - r),
                f = c / (c - l),
                h = e.x / (d * n.viewPoint.scale),
                m = e.y / (u * n.viewPoint.scale);
            return h = h * i + i * p, m = a * f - m * a, { x: h, y: m, z: 0 }
        };
    n.getViews = o, n.getDrawingSheets = i, n.point2DToPoint3D = a, n.point3DToPoint2D = r
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Graphics.Utility"),
        t = function(e) { var t = new Image; return new Promise(function(n, o) { t.onload = function() { n(t) }, t.onerror = function(e) { o(e) }, t.crossOrigin = "anonymous", t.src = e, !0 === t.complete && n(t) }) };
    e.ImageContainer = t
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Graphics"),
        t = Glodon.Web.Graphics.Utility.RGBToHex,
        n = function(e, t, n, o) { this.red = e, this.green = t, this.blue = n, this.alpha = o },
        o = function(e, t) { /^#[0-9a-fA-F]{6}$/.test(e) && (this.red = parseInt(e.slice(1, 3), 16), this.green = parseInt(e.slice(3, 5), 16), this.blue = parseInt(e.slice(5), 16)), "number" == typeof t ? (t > 1 && (t = 1), t < 0 && (t = 0), this.alpha = t) : this.alpha = 1 },
        i = function() { arguments.length < 4 ? o.apply(this, arguments) : n.apply(this, arguments) };
    i.prototype = { getRGB: function() { return "rgba(" + this.red + "," + this.green + "," + this.blue + ")" }, getRGBA: function() { return "rgba(" + this.red + "," + this.green + "," + this.blue + "," + this.alpha + ")" }, getHEX: function() { return "" + t(this.red) + t(this.green) + t(this.blue) }, getAlpha: function() { return this.alpha }, fromObject: function(e) { return this.red = e.red, this.green = e.green, this.blue = e.blue, this.alpha = e.alpha, this } }, e.Color = i
}(),
function() {
    SVGElement.prototype.getClass = HTMLElement.prototype.getClass = function(e) { return this.getAttribute("class") }, SVGElement.prototype.hasClass = HTMLElement.prototype.hasClass = function(e) { var t = this.getClass(); return !!t && (t && t.split(" ")).indexOf(e) > -1 }, SVGElement.prototype.addClass = HTMLElement.prototype.addClass = function(e) {
        var t = this.getClass(),
            n = t && t.split(" ");
        return t ? -1 == n.indexOf(e) && (n.push(e), t = n.join(" "), this.setAttribute("class", "" + t)) : this.setAttribute("class", "" + e), this
    }, SVGElement.prototype.removeClass = HTMLElement.prototype.removeClass = function(e) { if (!this.hasClass(e)) return this; var t = this.getClass().replace(e, "").trim(); return t ? this.setAttribute("class", "" + t) : this.removeAttribute("class"), this }, SVGElement.prototype.toggleClass = HTMLElement.prototype.toggleClass = function(e, t) { var n = (this.getClass(), this.hasClass(e)); return void 0 != t ? (t && !n && this.addClass(e), t || this.removeClass(e)) : n ? this.removeClass(e) : this.addClass(e), !n }
}(),
function() {
    Array.prototype.getObjectByAttribute = function(e, t) {
        for (var n = this, o = n.length, i = 0; i < o; i++)
            if (n[i][e] == t) return n[i];
        return !1
    }, Array.prototype.removeObjectByAttribute = function(e, t) {
        for (var n = this, o = n.length, i = 0; i < o; i++)
            if (n[i][e] == t) return n = n.splice(i, 1);
        return !1
    }, Array.prototype.getAllObjectByAttribute = function(e, t) { for (var n = this, o = n.length, i = 0, a = []; i < o; i++) n[i][e] == t && a.push(n[i]); return a }, Array.prototype.removeByValue = function(e) { for (var t = this, n = t.length, o = n - 1; o >= 0; o--) t[o] == e && t.splice(o, 1); return t }, Array.prototype.insert = function(e, t) { return this.splice(e, 0, t), this }
}(),
function() {
    SVGElement.prototype.setCss = HTMLElement.prototype.setCss = function(e) {
        if (e)
            for (var t in e) this.style[t] = e[t]
    }, SVGElement.prototype.getCss = HTMLElement.prototype.getCss = function() { return this.style }
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Data"),
        t = (Glodon.Web.Lang.Utility.HttpRequest, null),
        n = {
            getInstance: function() {
                return null == t && (t = {}, t.sendingPeriod = 6e4, t.requestList = [], t.isEnabled = !0, t.modelType = "", t.modelId = "", t.send = function(e, n, o) {
                    if (t.isEnabled) {
                        var i = { functionName: e + "." + n },
                            a = Object.assign(i, o);
                        this.requestList.push(a)
                    }
                }, setInterval(function() {
                    if (t.isEnabled) {
                        var e = t.requestList,
                            n = e.length;
                        if (n > 0) {
                            var o = e.slice(0, n);
                            t._send(o), e.splice(0, n)
                        }
                    }
                }, t.sendingPeriod), t._send = function(e) {
                    var t = "https://api.bimface.com/inside/track?ModelType=" + this.modelType + "&ModelId=" + this.modelId,
                        n = { Events: e },
                        o = { "Content-Type": "application/json" };
                    fetch(t, { method: "PUT", mode: "cors", body: JSON.stringify(n), headers: o, cache: "default" }).then(function(e) {})
                }, t.setIsEnabled = function(e) { t.isEnabled = !0 === e }, t.getIsEnabled = function() { return t.isEnabled }), t
            }
        };
    e.StatisticsDataManager = n
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.UI.Control"),
        t = function() { return { id: null, tagName: "div", className: "bf-control", title: "", element: "" } };
    e.ControlConfig = t
}(),
function() {
    var e = Object.freeze({ Click: "Click", MouseEnter: "MouseEnter", MouseLeave: "MouseLeave", MouseMove: "MouseMove", StateChange: "StateChange", Change: "Change" });
    Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.UI.Control").ControlEvent = e
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.UI.Control"),
        t = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Lang.Utility.Dom"),
        n = function(e) {
            var n = this;
            n.eventManager = new Glodon.Web.Lang.EventManager, n.element = t.create(e.tagName, e.className), n.id = e.id || Glodon.Web.Lang.Utility.UUID.createUUID(), e.title && !e.isPanel && n.setTitle(e.title), e.element && e.element.appendChild(n.element)
        };
    n.prototype = {
        addEventListener: function(e, t) {
            var n = this,
                o = n.eventManager;
            n.element.addEventListener(e.toLocaleLowerCase(), t), o.addEvent(e, t)
        },
        removeEventListener: function(e, t) {
            var n = this;
            n.eventManager.removeEvent(e, t), n.element.removeEventListener(e.toLocaleLowerCase(), t)
        },
        show: function() { this.element.style.display = "" },
        hide: function() { this.element.style.display = "none" },
        setTitle: function(e) { this.element.setAttribute("title", e) },
        getTitle: function() { return this.element.getAttribute("title") },
        setClassNames: function(e) { this.element.setAttribute("class", e) },
        getClassNames: function() { return this.element.getClass() },
        addClassName: function(e) { this.element.addClass(e) },
        removeClassName: function(e) { this.element.removeClass(e) },
        toggleClassName: function(e, t) { this.element.toggleClass(e, t) },
        setDomId: function(e) { this.element.setAttribute("id", e) },
        getDomId: function() { return this.element.getAttribute("id") },
        getId: function() { return this.id },
        setHtml: function(e) { this.element.innerHTML = e },
        setStyle: function(e) { this.element.setCss(e) },
        destroy: function() { this.element.parentNode && this.element.parentNode.removeChild(this.element) }
    }, e.Control = n
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.UI.Toolbar"),
        t = new Glodon.Bimface.UI.Control.ControlConfig,
        n = function() { var e = { className: "bf-toolbar" }; return Object.assign({}, t, e) };
    e.ToolbarConfig = n
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.UI.Control"),
        t = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.UI.Toolbar"),
        n = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Lang.Utility"),
        o = (Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Lang.Utility.Dom"), function(t) { this._controls = [], e.Control.call(this, t), this.element.addEventListener("mousedown", this.bringToFront.bind(this)) });
    n.Type.inheritPrototype(o, e.Control), o.prototype.addControl = function(e) { this.getControls().push(e), this.element.appendChild(e.element) }, o.prototype.bringToFront = function() {
        if (!this.element.hasClass("bf-pinned")) {
            var e = document.querySelector(".bf-pinned");
            e && e.removeClass("bf-pinned"), this.element.addClass("bf-pinned")
        }
    }, o.prototype.addControls = function(e) { for (var t = this, n = 0, o = e.length; n < o; n++) t.addControl(e[n]); return this.getControls() }, o.prototype.insertControl = function(e, t) {
        var n = this.getControls();
        n.insert(e, t);
        var o = n[e + 1];
        o ? this.element.insertBefore(t.element, o.element) : this.element.appendChild(t.element)
    }, o.prototype.removeControl = function(e) {
        var t = this.getControls(),
            n = t.getObjectByAttribute("id", e);
        t.removeObjectByAttribute("id", e), this.element.removeChild(n.element)
    }, o.prototype.getControls = function() { return this._controls }, o.prototype.getControl = function(e) { return this.getControls().getObjectByAttribute("id", e) }, o.prototype.destroy = function() {
        for (var e = this.getControls(), t = 0; t < e.length; t++) e[t].destroy();
        this._controls = [], this.element.parentNode && this.element.parentNode.removeChild(this.element)
    }, t.Toolbar = o
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.UI.Button"),
        t = (Glodon.Bimface.UI.Button.ButtonOption, new Glodon.Bimface.UI.Control.ControlConfig),
        n = function() { var e = { className: "bf-button", title: "button", checkedState: !1, defaultClass: "", changeClass: "", inheritTitle: !1 }; return Object.assign({}, t, e) };
    e.ButtonConfig = n
}(),
function() {
    var e = (Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Lang.Utility.Dom"), Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.UI.Control")),
        t = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.UI.Button"),
        n = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Lang.Utility"),
        o = function(t) { e.Control.call(this, t) };
    n.Type.inheritPrototype(o, e.Control), o.prototype.addToolbar = function(e) { this.toolbar = e, this.element.appendChild(e.element) }, o.prototype.getToolbar = function(e) { return this.toolbar }, t.Button = o
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.UI.Button"),
        t = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Lang.Utility"),
        n = Glodon.Bimface.UI.Control.ControlEvent,
        o = function(t) {
            e.Button.call(this, t);
            var o = this;
            o._checked = t.checkedState, o._checked && this.addClassName("bf-checked"), o.addEventListener(n.Click, function() { o.toggleCheckedState() })
        };
    t.Type.inheritPrototype(o, e.Button), o.prototype.toggleCheckedState = function() { this.setCheckedState(!this._checked) }, o.prototype.setCheckedState = function(e) { this._checked != e && (this._checked = e, this.toggleClassName("bf-checked", e), this.eventManager.fireEvent(n.StateChange, e)) }, o.prototype.isChecked = function() { return this._checked }, e.ToggleButton = o
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.UI.Control"),
        t = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.UI.Button"),
        n = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.UI.Toolbar"),
        o = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Lang.Utility"),
        i = new n.ToolbarConfig,
        a = new e.ControlConfig,
        r = function(t) {
            e.Control.call(this, t);
            var o = this;
            o._inheritTitle = t.inheritTitle;
            var r = new e.Control(a);
            r.setClassNames("bf-current"), i.element = o.element, i.className = "bf-sub-toolbar bf-scroll-bar";
            var s = new n.Toolbar(i);
            o.currentElement = r, o._subToolbar = s, o.element.appendChild(o.currentElement.element), o.addEventListener("Click", function() { o.toggleDropDownList() })
        };
    o.Type.inheritPrototype(r, e.Control), r.prototype.toggleDropDownList = function() { this.checked = !this.checked, this.toggleClassName("bf-expand") }, r.prototype.showDropDownList = function() { this._checked = !0, this.addClassName("bf-expand") },
        r.prototype.hideDropDownList = function(e) { this._checked = !1, this.removeClassName("bf-expand") }, r.prototype.addControl = function(e) {
            var t = this,
                n = t.getControls();
            t._subToolbar.addControl(e), 1 == n.length && t.setSelectedControlById(e.id), e.addEventListener("Click", function() {
                for (var o = 0, i = n.length; o < i; o++) n[o].setCheckedState(!1);
                t.currentElement.setHtml(this.outerHTML.replace("checked", "")), e.setCheckedState(!0), t._currentControl = e, t.eventManager.fireEvent("Change", e)
            })
        }, r.prototype.removeControl = function(e) { this._subToolbar.removeControl(e) }, r.prototype.getControls = function() { return this._subToolbar.getControls() }, r.prototype.getControl = function(e) { return this._subToolbar.getControl(e) }, r.prototype.getCurrentControl = function() { return this._currentControl }, r.prototype.setSelectedControlById = function(e) {
            var t = this.getControl(e);
            t.setCheckedState(!1);
            var n = t.element.cloneNode(!0);
            this._inheritTitle || n.removeAttribute("title"), this.currentElement.setHtml(n.outerHTML), t.setCheckedState(!0), this._currentControl = t
        }, t.ComboBox = r
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.UI.Button"),
        t = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Lang.Utility"),
        n = function(t) { e.ComboBox.call(this, t), this.currentElement = t.home, this.home = t.home, this.element.appendChild(this.currentElement.element) };
    t.Type.inheritPrototype(n, e.ComboBox), n.prototype.addControl = function(e) {
        var t = this,
            n = t.getControls();
        t._subToolbar.addControl(e), e.addEventListener("Click", function() {
            for (var o = 0, i = n.length; o < i; o++) n[o].setCheckedState(!1);
            t.currentElement.setCheckedState(!1), t._currentControl = e, t.eventManager.fireEvent("Change", e)
        })
    }, n.prototype.recover = function() { this.home.setCheckedState(!1), this.hideDropDownList() }, e.TouchComboBox = n
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.UI.Button"),
        t = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Lang.Utility"),
        n = function(t) { e.ToggleButton.call(this, t) };
    t.Type.inheritPrototype(n, e.ToggleButton), e.ComboBoxOptionButton = n
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.UI.Button"),
        t = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Lang.Utility"),
        n = function(t) {
            e.Button.call(this, t);
            var n = this;
            n.addClassName(t.defaultClass), n._defaultClass = t.defaultClass, n._changeClass = t.changeClass, this.type = "default", n._title = t.title, n._changeTitle = t.changeTitle || t.title, n._checked && this.addClassName("bf-checked"), n.addEventListener("Click", function() { n.toggleState(), n.eventManager.fireEvent("Change", n.type) })
        };
    t.Type.inheritPrototype(n, e.Button), n.prototype.toggleState = function() { this.setState("change" == this.type ? "default" : "change") }, n.prototype.setState = function(e) { this.type = e, "default" == e ? (this.addClassName(this._defaultClass), this.removeClassName(this._changeClass)) : (this.addClassName(this._changeClass), this.removeClassName(this._defaultClass)) }, e.ChangeButton = n
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.UI.Button"),
        t = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Lang.Utility"),
        n = {},
        o = function(t) {
            e.Button.call(this, t);
            var o = this;
            o._checked = t.checkedState, o.addEventListener("Click", function() { o.setChecked() }), n[t.groupName] ? (n[t.groupName].push(o), this._groupList = n[t.groupName]) : (n[t.groupName] = [o], this._groupList = n[t.groupName], o.setChecked())
        };
    t.Type.inheritPrototype(o, e.Button), o.prototype.setChecked = function() {
        for (var e = this._groupList, t = 0, n = e.length; t < n; t++) e[t].removeClassName("bf-checked");
        this.addClassName("bf-checked")
    }, e.SingleButton = o
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.UI.Menu"),
        t = new Glodon.Bimface.UI.Control.ControlConfig,
        n = function() { var e = { className: "bf-menu", isSubMenu: !1, text: null }; return Object.assign({}, t, e) };
    e.MenuConfig = n
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.UI.Menu"),
        t = new Glodon.Bimface.UI.Control.ControlConfig,
        n = function() { var e = { className: "bf-menu-item" }; return Object.assign({}, t, e) };
    e.MenuItemConfig = n
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.UI.Button"),
        t = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.UI.Menu"),
        n = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Lang.Utility"),
        o = (Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Lang.Utility.Dom"), function(t) { this._controls = [], e.Button.call(this, t), this.isDisabled = !1 });
    n.Type.inheritPrototype(o, e.Button), o.prototype.setText = function(e) { this.element.innerText = e }, o.prototype.disabled = function(e) { this.element.addClass("bf-disabled"), this.isDisabled = !0 }, o.prototype.enabled = function(e) { this.element.removeClass("bf-disabled"), this.isDisabled = !1 }, o.prototype.hide = function(e) { this.element.addClass("bf-hide"), this.isHide = !0 }, o.prototype.show = function(e) { this.element.removeClass("bf-hide"), this.isHide = !1 }, o.prototype.addEventListener = function(e, t) {
        var n = this,
            o = n.eventManager;
        this.isDisabled || (n.element.addEventListener(e.toLocaleLowerCase(), t), o.addEvent(e, t))
    }, t.MenuItem = o
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.UI.Menu"),
        t = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Lang.Utility.Dom"),
        n = function() { this.element = t.create("div", "bf-spacer") };
    n.prototype.hide = function(e) { this.element.addClass("bf-hide"), this.isHide = !0 }, e.Spacer = n
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.UI.Toolbar"),
        t = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.UI.Menu"),
        n = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Lang.Utility"),
        o = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Lang.Utility.Dom"),
        i = function(t) {
            if (e.Toolbar.call(this, t), this.element.addEventListener("mousedown", function(e) { e.stopPropagation() }), this.element.addEventListener("contextmenu", function(e) { e.preventDefault() }), this.isDisabled = !1, t.isSubMenu) {
                var n = o.create("div", "bf-menu-item");
                n.innerText = t.text;
                var i = o.create("div", "bf-menu");
                this.element.appendChild(n), this.element.appendChild(i), this.subElement = i
            }
        };
    n.Type.inheritPrototype(i, e.Toolbar), i.prototype.setPosition = function(e) { this.element.style.left = e.x + "px", this.element.style.top = e.y + "px" }, i.prototype.addControl = function(e) { this.getControls().push(e), this.subElement ? this.subElement.appendChild(e.element) : this.element.appendChild(e.element) }, i.prototype.disabled = function(e) { this.element.addClass("bf-disabled"), this.isDisabled = !0 }, i.prototype.enabled = function(e) { this.element.removeClass("bf-disabled"), this.isDisabled = !1 }, i.prototype.destroy = function(e) { this.element && this.element.remove(), this.element = null }, t.Menu = i
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.UI.Control"),
        t = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.UI.Panel"),
        n = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Lang.Utility.Dom"),
        o = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Lang.Utility"),
        i = function(t) {
            t.isPanel = !0, this._opt = t, e.Control.call(this, t), this._controls = [];
            var o = this,
                i = o.element;
            o.isShow = !0;
            var a = n.create("div", "bf-panel-body"),
                r = n.create("div", "bf-panel-header"),
                s = n.create("div", "bf-panel-container bf-scroll-bar"),
                l = n.create("div", "bf-close"),
                c = t.css;
            for (var d in c) i.style[d] = "" + c[d];
            if (t.easyMode || i.appendChild(l), t.title) {
                var u = n.create("div", "bf-title");
                u.textContent = t.title, i.appendChild(u), i.addClass("bf-has-title"), o.headerElement = u, t.enableDrag && Glodon.Web.Lang.Utility.Dom.drag({ element: this.element, handle: u, move: function(e, t, n) { o.eventManager.fireEvent("Move", e, t, n) } })
            }
            a.appendChild(r), a.appendChild(s), i.appendChild(a), this.body = a, this.container = s, this.header = r, t.enableSizable && Glodon.Web.Lang.Utility.Dom.sizable({ element: this.element, axis: "all", sizable: function(e, t, n) { o.eventManager.fireEvent("Sizable", e, t, n) } }), i.addEventListener("mousedown", this.onMouseDown.bind(this)), i.addEventListener("mousemove", this.onMouseMove.bind(this)), document.addEventListener("mouseup", this.onMouseUp.bind(this)), l.addEventListener("click", function() { o.hide() }), s.addEventListener("click", function(e) { var t = e.target.closest(".bf-group-title"); if (t && t.hasClass("bf-group-title")) { t.parentNode.toggleClass("bf-collapse") } }), s.addEventListener("DOMNodeRemoved", function() { o.showTips() }), s.addEventListener("DOMNodeInserted", function() { o.hideTips() })
        };
    o.Type.inheritPrototype(i, e.Control), i.prototype.setData = function(e, t) {
        if (this.clear(), e && e.length > 0) {
            for (var n = '<table class="bf-table">', o = 0, i = e.length; o < i; o++) {
                for (var a = '<tbody class="bf-group ' + (t && "bf-collapse") + '"><tr class="bf-group-title"><td colspan="2"><i class="bf-icon"></i>' + e[o].group + "</td></tr>", r = e[o].items, s = 0, l = r.length; s < l; s++) {
                    var c = r[s];
                    a += '<tr class="bf-group-content"><td class="bf-key">' + c.key + '</td><td class="bf-value">' + c.value + "</td></tr>"
                }
                a += "</tbody>", n += a
            }
            n += "</table>", this.container.innerHTML = n
        }
    }, i.prototype.setTitleContent = function(e) { this.headerElement.textContent = e }, i.prototype.onMouseDown = function() { this.isMouseDown = !0, this.element.removeEventListener("mousemove", this.onMouseMove), this.bringToFront() }, i.prototype.onMouseMove = function(e) {!0 !== this.isMouseDown && (e.preventDefault(), e.stopPropagation()) }, i.prototype.onMouseUp = function() { this.isMouseDown = !1, this.element.addEventListener("mousemove", this.onMouseMove) }, i.prototype.bringToFront = function() {
        if (!this.element.hasClass("bf-pinned")) {
            var e = document.querySelector(".bf-pinned");
            e && e.removeClass("bf-pinned"), this.element.addClass("bf-pinned")
        }
    }, i.prototype.showTips = function() { if (this.tipsElement) return void this.body.insertBefore(this.tipsElement, this.body.childNodes[1]) }, i.prototype.setTips = function(e, t) {
        this.tipsElement && this.tipsElement.remove();
        var o = { default: "bf-panel-tips", loading: "bf-panel-loading" },
            i = o[t] || o.default,
            a = n.create("div", i);
        a.textContent = e, this.tipsElement = a, this.showTips()
    }, i.prototype.hideTips = function() { this.tipsElement && this.tipsElement.remove() }, i.prototype.setContainerHeader = function(e) {
        if ("String" == typeof e);
        else {
            e.style.right = "100%", e.style.bottom = "100%", document.body.appendChild(e);
            var t = e.offsetHeight;
            document.body.removeChild(e), e.removeAttribute("style"), e.style.marginTop = "-" + t + "px", this.body.style.paddingTop = t + "px", this.header.appendChild(e)
        }
    }, i.prototype.close = function() { this.destroy(), this.eventManager.fireEvent("Close") }, i.prototype.hide = function(e) { this.isShow = !1, this.element.style.display = "none", !0 !== e && this.eventManager.fireEvent("Hide") }, i.prototype.show = function(e) { this.isShow = !0, this.element.style.display = "", !0 !== e && this.eventManager.fireEvent("Show"), this.bringToFront() }, i.prototype.clear = function() { this.container.innerHTML = "" }, i.prototype.toggle = function() { this.isShow ? this.element.style.display = "none" : (this.element.style.display = "", this.bringToFront()), this.isShow = !this.isShow }, i.prototype.addControl = function(e) { this.getControls().push(e), this.container.appendChild(e.element) }, i.prototype.getControls = function() { return this._controls }, i.prototype.getControl = function(e) { return this.getControls().getObjectByAttribute("id", e) }, i.prototype.setHtml = function(e) { this.container.innerHTML = e }, i.prototype.addClass = function(e) { this.element.addClass(e) }, i.prototype.removeClass = function(e) { this.element.removeClass(e) }, i.prototype.setHeight = function(e) { this.element.style.height = e + "px" }, i.prototype.setWidth = function(e) { this.element.style.width = e + "px" }, i.prototype.setHeader = function(e) { this._opt.title = e, this.headerElement.textContent = e }, i.prototype.getTitle = function() { return this._opt.title }, t.Panel = i
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.UI.Panel"),
        t = new Glodon.Bimface.UI.Control.ControlConfig,
        n = function() { var e = { className: "bf-panel", title: "panel", css: { width: "200px", height: "200px", minWidth: "200px", minHeight: "200px" }, enableDrag: !0, enableSizable: !0 }; return Object.assign({}, t, e) };
    e.PanelConfig = n
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.UI.Tree"),
        t = function(e) {
            var t = this;
            t._root = e, t.element = e.element, t.eventManager = e.eventManager, t.addEventListener = e.addEventListener, t.removeEventListener = e.removeEventListener, e.addEventListener("SelectionChanged", function(e, n) { t._selectionNode == e ? n || (t._selectionNode = null) : (t._selectionNode && t._selectionNode.deselect(), t._selectionNode = e) })
        };
    t.prototype = {
        getRoot: function() { return this._root },
        getChecked: function() {
            function e(o, i) {
                var a = o.getCheckedState(),
                    r = o.element.getAttribute("data-filter");
                switch (a) {
                    case "unchecked":
                        break;
                    case "checked":
                        if (o == t) n = "all";
                        else {
                            var s = Object.assign({}, i);
                            s[r] = o.id, n.push(s)
                        }
                        break;
                    case "half":
                        var l = o.getControls(),
                            c = Object.assign({}, i);
                        o != t && (c[r] = o.id);
                        for (var d = 0, u = l.length; d < u; d++) e(l[d], c)
                }
            }
            var t = this._root,
                n = [];
            return e(t, {}), n
        },
        getSelection: function() {
            function e(t, n) {
                var o = t.element.getAttribute("data-filter"),
                    i = t.getParent();
                if (!i) return n;
                n[o] = t.id, e(i, n)
            }
            var t = this._selectionNode,
                n = {};
            return !!t && (e(t, n), n)
        },
        clear: function(e) {
            var t = this.getRoot();
            ! function t(n) {
                n.setCheckedState(e), n.setIconState("default");
                var o = n.getControls();
                if (o && o.length > 0)
                    for (var i = 0; i < o.length; i++) t(o[i])
            }(t)
        }
    }, e.Tree = t
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.UI.Toolbar"),
        t = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.UI.Tree"),
        n = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Lang.Utility"),
        o = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Lang.Utility.Dom"),
        i = function(t) {
            e.Toolbar.call(this, t), this._opt = Object.assign({}, t), t.hasCheckbox && (this._checkedState = t.isChecked ? "checked" : "unchecked"), this._iconState = !0;
            var n = o.create("div", "bf-tree-node bf-collapse");
            this._enabled = t.enabled, this._selection = t.selection, this._selectionState = "unSelected", this.treeNode = n
        };
    n.Type.inheritPrototype(i, e.Toolbar), i.prototype.setData = function(e, t) {
        var n = this,
            i = this._opt,
            a = this.treeNode;
        if (i.hasCheckbox) {
            var r = i.isChecked ? "bf-checked" : "",
                s = o.create("span", "bf-label " + r);
            s.innerHTML = '<input type="checkbox" checked="' + i.isChecked + '"><span class="bf-checkbox"></span>', this.checkbox = s, a.appendChild(s), s.addEventListener("click", function(e) {
                var t = s.getElementsByTagName("input")[0].checked,
                    o = t ? "unchecked" : "checked";
                n.setCheckedState(!t), n.eventManager.fireEvent("CheckedChanged", o, n)
            })
        }
        var l = o.create("span", "bf-tree-name");
        t = t || "未命名", l.textContent = t, n.setTitle(t), l.addEventListener("click", function(e) {
            if (n._enabled)
                if (n._selection) {
                    var t = this.hasClass("bf-selected");
                    t ? n.deselect() : n.select(), t = !t, n._selectionState = t ? "selected" : "unselected", n.eventManager.fireEvent("SelectionChanged", n, t)
                } else n.toggleExpansion()
        }), i.icon && (this.icon = i.icon, a.appendChild(i.icon.element), this.icon.addEventListener("Change", function(e) { n._iconState = "default" == e, n.setChildrenIconState(e), n.eventManager.fireEvent("IconChanged", n, e) })), a.appendChild(l), this.element.appendChild(a), this.treeName = l, this.id = e, this.name = t
    }, i.prototype.addChildNode = function(e) {
        var t = this;
        if (this._controls.push(e), e._parent = this, !this.subTree) {
            var n = o.create("span", "bf-icon"),
                i = this.treeNode;
            n.addEventListener("click", function() { t.toggleExpansion() }), i.insertBefore(n, this.treeNode.children[0]), this.subTree = o.create("div", "bf-sub-tree"), this.element.appendChild(this.subTree)
        }
        this.subTree.appendChild(e.element), e.addEventListener("CheckedChanged", function(e, n) { n._opt.propagation && t.setParentCheckedState(n), t.eventManager.fireEvent("CheckedChanged", e, n) }), e.addEventListener("SelectionChanged", function(e, n, o) { t.eventManager.fireEvent("SelectionChanged", e, n, o) }), e.addEventListener("IconChanged", function(n, o) { e._opt.propagation && t.setParentIconState(e), t.eventManager.fireEvent("IconChanged", n, o) })
    }, i.prototype.removeChildNode = function(e) {
        var t = this._controls.getObjectByAttribute("id", e);
        this.subTree.removeChild(t.element), this._controls.removeObjectByAttribute("id", e)
    }, i.prototype.getCheckedState = function() { return this._checkedState }, i.prototype.getIconState = function() { return this._iconState }, i.prototype.getSelectionState = function() { return this._selectionState }, i.prototype.getParent = function() { return !!this._parent && this._parent }, i.prototype.setCheckedState = function(e) {
        var t = this._opt;
        this._checkedState = e ? "checked" : "unchecked", t.hasCheckbox && this.checkbox && (this.checkbox.getElementsByTagName("input")[0].checked = e, this.checkbox.toggleClass("bf-checked", e), this.checkbox.toggleClass("bf-unchecked", !e), this.checkbox.removeClass("bf-half")), this.setChildrenCheckedState(e)
    }, i.prototype.setIconState = function(e) { this.icon && (this.icon.setState(e), this.setChildrenIconState(e), this._iconState = "default" == e) }, i.prototype.setParentCheckedState = function(e) {
        var t = this.getControls();
        if (t && t.length > 0) {
            for (var n, o = 0, i = t.length; o < i; o++) {
                var a = t[o].getCheckedState();
                n ? a != n && (n = "half") : n = a
            }
            this._checkedState = n
        }
        switch (this._checkedState) {
            case "checked":
                this.checkbox.getElementsByTagName("input")[0].checked = !0, this.checkbox.addClass("bf-checked"), this.checkbox.removeClass("bf-unchecked"), this.checkbox.removeClass("bf-half");
                break;
            case "unchecked":
                this.checkbox.getElementsByTagName("input")[0].checked = !1, this.checkbox.addClass("bf-unchecked"), this.checkbox.removeClass("bf-checked"), this.checkbox.removeClass("bf-half");
                break;
            case "half":
                this.checkbox.getElementsByTagName("input")[0].checked = !0, this.checkbox.addClass("bf-half"), this.checkbox.removeClass("bf-unchecked"), this.checkbox.removeClass("bf-checked")
        }
    }, i.prototype.setChildrenCheckedState = function(e) {
        var t = this.getControls(),
            n = t.length;
        if (t && n > 0)
            for (var o = 0; o < n; o++) t[o].setCheckedState(e)
    }, i.prototype.setParentIconState = function(e) {
        var t = this.getControls();
        if (t && t.length > 0) {
            for (var n = !1, o = 0, i = t.length; o < i; o++) { var a = t[o].getIconState(); if (a) { n = a; break } }
            this._iconState = n
        }
        n ? this.icon.setState("default") : this.icon.setState("change")
    }, i.prototype.setChildrenIconState = function(e) {
        var t = this.getControls(),
            n = t.length;
        if (t && n > 0)
            for (var o = 0; o < n; o++) t[o].setIconState(e)
    }, i.prototype.expand = function() {
        var e = this;
        this.treeNode.removeClass("bf-collapse"), this.eventManager.fireEvent("Expand", e)
    }, i.prototype.collapse = function() {
        var e = this;
        this.treeNode.addClass("bf-collapse"), this.eventManager.fireEvent("Collapse", e)
    }, i.prototype.toggleExpansion = function(e) {
        var t = this;
        this.treeNode.hasClass("bf-collapse") ? t.expand() : t.collapse()
    }, i.prototype.select = function() { if (this._selection) return this.treeName.addClass("bf-selected") }, i.prototype.deselect = function() { this.treeName && this.treeName.removeClass("bf-selected") }, i.prototype.disabled = function() { this._enabled = !1, this.treeName.addClass("bf-disabled") }, i.prototype.enabled = function() { this._enabled = !0, this.treeName.removeClass("bf-disabled") }, i.prototype.addNode = function(e) { this.treeNode.appendChild(e) }, i.prototype.removeNode = function(e) { this.treeNode.appendChild(e) }, t.TreeNode = i
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.UI.Tree"),
        t = new Glodon.Bimface.UI.Control.ControlConfig,
        n = function() { var e = { className: "bf-tree", title: "tree", icon: null, hasCheckbox: !0, isChecked: !0, enabled: !0, selection: !0, propagation: !0 }; return Object.assign(t, e) };
    e.TreeNodeConfig = n
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.UI.Select"),
        t = new Glodon.Bimface.UI.Control.ControlConfig,
        n = function() { var e = { className: "bf-select", options: ["请选择"], prefix: "", suffix: "", default: null }; return Object.assign({}, t, e) };
    e.SelectConfig = n
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.UI.Control"),
        t = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.UI.Select"),
        n = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Lang.Utility"),
        o = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Lang.Utility.Dom"),
        i = function(t) {
            this._controls = t.options, e.Control.call(this, t);
            var n = this;
            n._opt = t;
            var i = o.create("span", "bf-select-current");
            i.addEventListener("click", function() { i.toggleClass("bf-open") }), document.addEventListener("mousedown", function(e) { e.target.closest(".bf-select") || i.removeClass("bf-open") }), n._currentElement = i, t.default ? n.setCurrentOption(t.default) : n.setCurrentOption(t.options[0].id);
            for (var a = o.create("ul", "bf-select-list bf-scroll-bar"), r = n._controls, s = 0, l = r.length; s < l; s++) {
                var c = n.createElement(r[s]);
                a.appendChild(c)
            }
            n.element.appendChild(n._currentElement), n.element.appendChild(a), t.element && t.element.appendChild(n.element)
        };
    n.Type.inheritPrototype(i, e.Control), i.prototype.setCurrentOption = function(e) {
        if (!this.currentOption || e != this.currentOption.id) {
            var t = this.eventManager,
                n = this._controls,
                o = n.getObjectByAttribute("id", e);
            0 != o && (this.currentOption = o, this._currentElement.innerText = "" + this._opt.prefix + o.name + this._opt.suffix, t.fireEvent(Glodon.Bimface.UI.Control.ControlEvent.Change, o))
        }
    }, i.prototype.getCurrentOption = function() { return this.currentOption }, i.prototype.createElement = function(e) {
        var t = this,
            n = o.create("li", "bf-select-option");
        return n.innerText = e.name, n.setAttribute("id", e.id), n.addEventListener("click", function() { t.setCurrentOption(e.id), t._currentElement.removeClass("bf-open") }), n
    }, t.Select = i
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.UI.Tabs"),
        t = new Glodon.Bimface.UI.Control.ControlConfig,
        n = function() { var e = { className: "bf-select", options: [{ id: "default", name: "请选择", className: "bf-tabs-option", title: "请选择" }], default: null }; return Object.assign({}, t, e) };
    e.TabsConfig = n
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.UI.Control"),
        t = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.UI.Tabs"),
        n = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Lang.Utility"),
        o = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Lang.Utility.Dom"),
        i = function(t) {
            this._controls = t.options, e.Control.call(this, t);
            var n = this,
                i = o.create("ul", "bf-tabs-list");
            this.list = i;
            for (var a = n._controls, r = 0, s = a.length; r < s; r++) {
                var l = n.createElement(a[r]);
                i.appendChild(l)
            }
            t.default ? n.setCurrentOption(t.default) : n.setCurrentOption(t.options[0].id), n.element.appendChild(i), t.element && t.element.appendChild(n.element)
        };
    n.Type.inheritPrototype(i, e.Control), i.prototype.setCurrentOption = function(e) { for (var t = this.eventManager, n = this._controls, o = n.getObjectByAttribute("id", e), i = this.list.querySelectorAll("li"), a = 0, r = i.length; a < r; a++) i[a].id == e ? i[a].addClass("active") : i[a].removeClass("active"); - 1 != o && (this.currentOption = o, t.fireEvent(Glodon.Bimface.UI.Control.ControlEvent.Change, o)) }, i.prototype.getCurrentOption = function() { return this.currentOption }, i.prototype.createElement = function(e) {
        var t = this,
            n = (this.eventManager, o.create("li", "bf-tabs-option " + e.className));
        return n.innerText = e.name, n.setAttribute("id", e.id), n.addEventListener("click", function() { t.getCurrentOption().id != e.id && t.setCurrentOption(e.id) }), n
    }, i.prototype.addOption = function(e) {
        if (!this._controls.getObjectByAttribute("id", e.id)) {
            this._controls.push(e);
            var t = this.createElement(e);
            this.list.appendChild(t)
        }
    }, t.Tabs = i
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.UI.Tips"),
        t = new Glodon.Bimface.UI.Control.ControlConfig,
        n = function() { var e = { className: "bf-tips", element: null, html: "提示", timeOut: 0 }; return Object.assign({}, t, e) };
    e.TipsConfig = n
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.UI.Control"),
        t = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.UI.Tips"),
        n = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Lang.Utility"),
        o = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Lang.Utility.Dom"),
        i = function(t) {
            e.Control.call(this, t);
            var n = this,
                i = this.element,
                a = o.create("div", "bf-tips-container"),
                r = o.create("div", "bf-close");
            a.innerHTML = t.html, i.appendChild(a), i.appendChild(r), r.addEventListener("click", function() { n.hide() }), this.container = a, this.timeOut = t.timeOut, this.show()
        };
    n.Type.inheritPrototype(i, e.Control), i.prototype.close = function() { this.element.remove() }, i.prototype.hide = function() { this.element.style.display = "none" }, i.prototype.show = function() {
        var e = this;
        e.element.style.display = "", e.timeOut && (clearTimeout(e.counter), e.counter = setTimeout(function() { e.hide() }, e.timeOut))
    }, i.prototype.getHtml = function(e) { this.container.innerHTML = e }, i.prototype.setHtml = function(e) { return this.container.innerHTML }, t.Tips = i
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application"),
        t = function() {
            var e = { Toolbars: ["MainToolbar", "ModelTree"], Buttons: ["Home", "RectangleSelect", "Measure", "Section", "Walk", "Map", "Property", "Setting", "Information", "FullScreen"] },
                t = Glodon.Bimface.Viewer.Viewer3DConfig();
            return Object.assign({}, e, t)
        };
    e.WebApplication3DConfig = t
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application"),
        t = Object.freeze({ ViewAdded: "ViewAdded", ViewLoading: "ViewLoading", Rendered: "Rendered", PureRender: "PureRender", ComponentsSelectionChanged: "ComponentsSelectionChanged", ComponentsHoverChanged: "ComponentsHoverChanged", MouseClicked: "MouseClicked", MouseDragged: "MouseDragged", MouseDoubleClicked: "MouseDoubleClicked", ContextMenu: "ContextMenu", RectSelection: "RectSelection", Error: "Error", AddView: "AddView", RemoveView: "RemoveView", FamilyTypeChanged: "FamilyTypeChanged", MissingDrawingElement: "MissingDrawingElement", ToolbarHomeClick: "ToolbarHomeClick", DemandLoaded: "DemandLoaded", ButtonOnToolbarClicked: "ButtonOnToolbarClicked", AxisGridHover: "AxisGridHover", FloorExplosion: "FloorExplosion", Hover: "Hover" });
    e.WebApplication3DEvent = t
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application"),
        t = (Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Viewer"), Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Lang.Utility"), Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Lang.Utility.Dom")),
        n = Glodon.Bimface.Data.StatisticsDataManager.getInstance(),
        o = function(e) {
            var o, i = Glodon.Web.Lang.Utility.ClientHelper.getIsDesktop();
            if (i) o = t.create("div", "bf-container");
            else {
                e.Toolbars = ["MainToolbar", "ModelTree"], e.Buttons = ["Home", "ViewButton", "Measure", "Section", "Walk", "MobileProperty"], e.enableViewHouse = !1, o = t.create("div", "bf-container  bf-mobile ");
                var a = e.domElement.offsetWidth,
                    r = e.domElement.offsetHeight;
                o.style.fontSize = 90 * Math.min(a, r, 414) / 750 + "px"
            }
            var s = this,
                l = e;
            e.domElement.appendChild(o), l.domElement = o, this.getViewer = function() { return c }, this.getEventManager = function() { return u }, this.getToolbars = function() { return s.UI.getToolbars() }, this.getToolbar = function(e) { return "LeftToolbar" == e && (e = "ModelTree"), s.UI.getToolbar(e) }, this.getPanel = function(e) { return s.UI.getPanel(e) }, this.getPlugin = function(e) { return s.UI.getPlugin(e) }, this.render = function() { this.getViewer().render() }, this.addView = function(e) { c.addView(e) }, this.getAnnotationManager = function() { return s.getPlugin("Annotation") }, this.destroy = function() { this.UI.destroy(), this.UI = null, c.destroy(), c = null, o.onclick = null, o.remove() }, this.addEventListener = Glodon.Bimface.Viewer.Viewer3D.prototype.addEventListener, this.removeEventListener = Glodon.Bimface.Viewer.Viewer3D.prototype.removeEventListener;
            var c = new Glodon.Bimface.Viewer.Viewer3D(l),
                d = Glodon.Bimface.Viewer.Viewer3DEvent,
                u = c.getEventManager();
            c.addEventListener(d.ViewAdded, function() {
                s.UI.init();
                var e = c.getViewer(),
                    t = e.getNumOfElements(),
                    o = e.getNumOfTriangles(),
                    i = void 0,
                    a = c._data.modelType;
                i = "singleMode" == a ? "model" : a;
                var r = { eventId: "加载", loadModel: "normal", type: i, elements: t, triangles: o };
                n.send("Glodon.Bimface.Application.WebApplication3D", "ViewAdded", r)
            }), c.addEventListener(d.AddView, function(t) {
                if (1 === t) {
                    var n = new Glodon.Bimface.Application.UI.UIConfig;
                    n = Object.assign(n, e), n.element = o, n.viewer = c, s.UI = new Glodon.Bimface.Application.UI.UI(n)
                }
            }), c.addEventListener(d.RemoveView, function(e) { 0 == e && (s.UI.destroy(), s.UI = null) }), i && (o.onclick = function() {
                var e = document.activeElement,
                    t = document.getElementById("cloud-main-canvas");
                t && e != t && "INPUT" != e.tagName && "TEXTAREA" != e.tagName && t.focus()
            })
        };
    e.WebApplication3D = o
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application"),
        t = function() {
            var e = { Toolbars: ["MainToolbar"], Buttons: ["Home", "Measure", "Section", "Explode", "Setting", "FullScreen"], EnableFamilyList: !0 },
                t = Glodon.Bimface.Viewer.Viewer3DConfig();
            return t.enableExplosion = !0, Object.assign({}, e, t)
        };
    e.WebApplicationRfaConfig = t
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application"),
        t = Object.freeze({ ViewAdded: "ViewAdded", ViewLoading: "ViewLoading", ComponentsSelectionChanged: "ComponentsSelectionChanged", ComponentsHoverChanged: "ComponentsHoverChanged", Error: "Error" });
    e.WebApplicationRfaEvent = t
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application.UI.Button"),
        t = function(e, t) {
            var n = e.getViewer(),
                o = n instanceof Glodon.Bimface.Viewer.Viewer3D,
                i = Glodon.Bimface.UI.Control.ControlEvent,
                a = Glodon.Bimface.Viewer.Viewer3DEvent,
                r = new Glodon.Bimface.UI.Button.ButtonConfig;
            r.id = "Home", r.title = BimfaceLanguage.bf_btn_home, r.className = "bf-button gld-bf-home";
            var s = new Glodon.Bimface.UI.Button.Button(r);
            return s.addEventListener(i.Click, function() {
                var e = t.getControl("ViewButton");
                e && e.recover();
                var i = t.getControl("Interactive");
                if (i && i.hideDropDownList(), o) {
                    if (n.getViewHouseIsLoaded()) n.getEventManager().fireEvent(a.ToolbarHomeClick);
                    else {
                        var r = n.getDefaultHomeview();
                        n.setCameraStatus(r)
                    }
                } else n.home()
            }), s
        };
    e.Home = t
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application.UI.Button"),
        t = function(e, t) {
            var n = e.getViewer(),
                o = n instanceof Glodon.Bimface.Viewer.Viewer3D,
                i = Glodon.Bimface.UI.Control.ControlEvent;
            if (!o) return void console.log("The API is not supported on this viewer.");
            var a = Glodon.Bimface.Viewer.NavigationMode3D,
                r = { OrbitPoint: a.PickWithRect, OrbitCamera: a.Fly },
                s = new Glodon.Bimface.UI.Button.ButtonConfig;
            s.id = "OrbitButton", s.title = "导航", s.inheritTitle = !0;
            var l = new Glodon.Bimface.UI.Button.ComboBox(s),
                c = new Glodon.Bimface.UI.Button.ButtonConfig;
            c.id = "OrbitPoint", c.title = "绕构件旋转", c.className = "bf-button gld-bf-orbitpoint";
            var d = new Glodon.Bimface.UI.Button.ComboBoxOptionButton(c),
                u = new Glodon.Bimface.UI.Button.ButtonConfig;
            u.id = "OrbitCamera", u.title = "绕相机旋转", u.className = "bf-button gld-bf-orbitcamera";
            var p = new Glodon.Bimface.UI.Button.ComboBoxOptionButton(u);
            return l.addControl(d), l.addControl(p), l.addEventListener(i.Change, function(e) { t.getControl("Section").setCheckedState(!1), n.setNavigationMode(r[e.id]) }), l
        };
    e.OrbitButton = t
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application.UI.Button"),
        t = function(e, t) {
            var n = e.getViewer(),
                o = (e.getRootElement(), n instanceof Glodon.Bimface.Viewer.Viewer3D),
                i = Glodon.Bimface.UI.Control.ControlEvent;
            if (!o) return void console.log("The API is not supported on this viewer.");
            var a = new Glodon.Bimface.UI.Button.ButtonConfig;
            a.id = "Home", a.title = "Home", a.className = "bf-button gld-bf-view";
            var r = new Glodon.Bimface.UI.Button.ComboBoxOptionButton(a),
                s = new Glodon.Bimface.UI.Button.ButtonConfig;
            s.id = "ViewButton", s.title = "视角", s.className = "bf-combobox viewButton", s.inheritTitle = !0, s.home = r;
            var l = new Glodon.Bimface.UI.Button.TouchComboBox(s);
            l.element.addClass(BimfaceLanguage.name);
            var c = new Glodon.Bimface.UI.Button.ButtonConfig;
            c.id = "Top", c.title = "Top", c.className = "bf-button ";
            var d = new Glodon.Bimface.UI.Button.ComboBoxOptionButton(c);
            d.setHtml("" + BimfaceLanguage.bf_viewHouse_up);
            var u = new Glodon.Bimface.UI.Button.ButtonConfig;
            u.id = "Bottom", u.title = "Bottom", u.className = "bf-button ";
            var p = new Glodon.Bimface.UI.Button.ComboBoxOptionButton(u);
            p.setHtml("" + BimfaceLanguage.bf_viewHouse_down);
            var f = new Glodon.Bimface.UI.Button.ButtonConfig;
            f.id = "North", f.title = "North", f.className = "bf-button ";
            var h = new Glodon.Bimface.UI.Button.ComboBoxOptionButton(f);
            h.setHtml("" + BimfaceLanguage.bf_viewHouse_North);
            var m = new Glodon.Bimface.UI.Button.ButtonConfig;
            m.id = "South", m.title = "South", m.className = "bf-button";
            var g = new Glodon.Bimface.UI.Button.ComboBoxOptionButton(m);
            g.setHtml("" + BimfaceLanguage.bf_viewHouse_South);
            var b = new Glodon.Bimface.UI.Button.ButtonConfig;
            b.id = "West", b.title = "West", b.className = "bf-button ";
            var v = new Glodon.Bimface.UI.Button.ComboBoxOptionButton(b);
            v.setHtml("" + BimfaceLanguage.bf_viewHouse_West);
            var y = new Glodon.Bimface.UI.Button.ButtonConfig;
            y.id = "East", y.title = "East", y.className = "bf-button ";
            var w = new Glodon.Bimface.UI.Button.ComboBoxOptionButton(y);
            return w.setHtml("" + BimfaceLanguage.bf_viewHouse_east), l.addControl(d), l.addControl(p), l.addControl(w), l.addControl(g), l.addControl(v), l.addControl(h), l.addEventListener(i.Change, function(e) { n.setView(e.id) }), document.querySelector(".bf-mobile").addEventListener("touchstart", function(e) {
                if ("canvas" == e.target.tagName.toLowerCase()) {
                    var t = document.querySelector(".gld-bf-view.bf-checked");
                    t && t.click()
                }
            }), l
        };
    e.ViewButton = t
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application.UI.Button"),
        t = function(e, t) {
            var n = e.getViewer(),
                o = n instanceof Glodon.Bimface.Viewer.Viewer3D,
                i = Glodon.Bimface.UI.Control.ControlEvent,
                a = Glodon.Bimface.Viewer.Viewer3DEvent;
            if (!o) return void console.log("The API is not supported on this viewer.");
            var r = new Glodon.Bimface.UI.Button.ButtonConfig;
            r.id = "RectangleSelect", r.title = BimfaceLanguage.bf_btn_zoom, r.className = "bf-button gld-bf-zoomrect";
            var s = new Glodon.Bimface.UI.Button.ToggleButton(r),
                l = function(e) { e.end && s.setCheckedState(!1) };
            return s.addEventListener(i.StateChange, function(e) { e ? (n.enableZoomRect(!0), n.addEventListener(a.RectSelection, l)) : (n.enableZoomRect(!1), n.removeEventListener(a.RectSelection, l)) }), s
        };
    e.RectangleSelect = t
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application.UI.Panel"),
        t = function(e, t, n, o) {
            var i, a = this,
                r = Glodon.Bimface.Viewer.Viewer3DEvent,
                s = function(e) {
                    for (var t = [], n = 0; n < e.length; n++) {
                        for (var o = e[n].name, i = e[n].parameters, a = [], r = 0; r < i.length; r++) a = a.concat(i[r].items);
                        t = t.concat([{ group: o, items: a }])
                    }
                    return t
                },
                l = function() { p._tab && "components" != p._tab.getCurrentOption().id ? p.setTips(BimfaceLanguage.bf_panel_props_matSel) : p.setTips(BimfaceLanguage.bf_panel_props_propSel) },
                c = function(t) {
                    if (p.setTips(BimfaceLanguage.bf_panel_modelTree_loading, "loading"), p.clear(), !t || 1 != t.length) return l(), p.setData("");
                    !p._tab || p._tab && "components" == p._tab.getCurrentOption().id ? (i = t[0], e.getComponentProperty(t[0], function(e) { p.setTips(BimfaceLanguage.bf_panel_props_propSel), p.setData(e.properties) }, function(e) { l(), p.setData("") })) : (!p._tab || p._tab && "components" != p._tab.getCurrentOption().id) && (t ? (i = t[0], e.getMaterialProperty(i, function(e) {
                        if (p.setTips(BimfaceLanguage.bf_panel_props_matSel), e && e.length > 0) {
                            var t = s(e);
                            p.setData(t, !0)
                        } else p.setData("")
                    }, function() { p.setTips(BimfaceLanguage.bf_panel_props_matSel), p.setData("") })) : p.setData(""))
                },
                d = function(t) {
                    var n = e.getSelectedComponents();
                    if (!n || 1 != n.length) return "components" == t ? p.setTips(BimfaceLanguage.bf_panel_props_propSel) : p.setTips(BimfaceLanguage.bf_panel_props_matSel), p.setData("");
                    "components" == t ? n && n.length > 0 ? c([n[0]]) : i = "" : (p.setData(""), e.getMaterialProperty(i, function(e) {
                        if (e && e.length > 0) {
                            var t = s(e);
                            p.setData(t, !0)
                        } else l(), p.setData("")
                    }, function() { l(), p.setData("") }))
                };
            if (p) return p.show(), e.addEventListener(r.ComponentsSelectionChanged, c), p;
            var u = new Glodon.Bimface.UI.Panel.PanelConfig;
            u.title = BimfaceLanguage.bf_btn_props, u.css = o ? { left: 0, top: 0, width: "100%", height: "100%" } : { right: "10px", top: "10px", width: "300px", height: "416px" };
            var p = new Glodon.Bimface.UI.Panel.Panel(u);
            p.setTips(BimfaceLanguage.bf_panel_props_propSel), e.propertyPanel = p, p.addClass("property-panel"), p.addClass("bf-property-panel");
            var f = [{ id: "components", name: BimfaceLanguage.bf_panel_props_props }, { id: "material", name: BimfaceLanguage.bf_panel_props_mats }];
            if (!a._tab && e._manifest.Features.HasMaterialProperty) {
                var h = new Glodon.Bimface.UI.Tabs.TabsConfig;
                h.className = "bf-property-tab", h.default = "components", h.options = f;
                var m = new Glodon.Bimface.UI.Tabs.Tabs(h);
                m.addEventListener(Glodon.Bimface.UI.Control.ControlEvent.Change, function(e) { d(e.id) }), p._tab = m, p.setContainerHeader(m.element)
            }
            return d("components"), e.addEventListener(r.SelectionChanged, c), p.addEventListener("Hide", function() { e.removeEventListener(r.SelectionChanged, c) }), p
        };
    e.PropertyPanel = t
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application.UI.Button"),
        t = function(e, t) {
            var n = e.getViewer(),
                o = e.getRootElement(),
                i = n instanceof Glodon.Bimface.Viewer.Viewer3D,
                a = Glodon.Bimface.UI.Control.ControlEvent,
                r = Glodon.Bimface.Viewer.Viewer3DEvent;
            if (!i) return void console.log("The API is not supported on this viewer.");
            var s = new Glodon.Bimface.UI.Button.ButtonConfig;
            s.id = "Property", s.title = BimfaceLanguage.bf_btn_props, s.className = "bf-button gld-bf-properties";
            var l, c = new Glodon.Bimface.UI.Button.ToggleButton(s);
            return c.addEventListener(a.StateChange, function(i) { i ? (l = new Glodon.Bimface.Application.UI.Panel.PropertyPanel(n, o, t), l.addEventListener("Hide", function() { c.setCheckedState(!1) }), o.appendChild(l.element), l.bringToFront(), e.addPanel(l)) : (l.close(), e.removePanel(l.id)), n.getEventManager().fireEvent(r.ButtonOnToolbarClicked, { id: s.id, isChecked: i }) }), c
        };
    e.Property = t
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application.UI.Button"),
        t = function(e, t) {
            var n = e.getViewer(),
                o = e.getRootElement(),
                i = n instanceof Glodon.Bimface.Viewer.Viewer3D,
                a = Glodon.Bimface.UI.Control.ControlEvent;
            if (!i) return void console.log("The API is not supported on this viewer.");
            var r = new Glodon.Bimface.UI.Button.ButtonConfig;
            r.id = "MobileProperty", r.title = "属性", r.className = "bf-button gld-bf-properties";
            var s, l = new Glodon.Bimface.UI.Button.ToggleButton(r);
            return l.addEventListener(a.StateChange, function() { l.isChecked() ? (s = new Glodon.Bimface.Application.UI.Panel.PropertyPanel(n, o, t, !0), s.addEventListener("Hide", function() { "none" != s.element.style.display && o.removeChild(s.element), l.setCheckedState(!1) }), o.appendChild(s.element), e.addPanel(s)) : (o.removeChild(s.element), e.removePanel(s.id)) }), l
        };
    e.MobileProperty = t
}(),
function() {
    var e, t, n = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Lang.Utility.Dom"),
        o = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application.UI.Panel"),
        i = Glodon.Web.Lang.Utility.ClientHelper.getIsDesktop(),
        a = function(o, a) {
            t = o._opt.viewer;
            var r, s = n.create("div", "bf-tab-body"),
                l = n.create("div", "bf-tab-container"),
                c = n.create("ul", "bf-measure-tab"),
                d = n.create("div", "bf-measure-tabface");
            d.innerHTML = '<li class="bf-measure-tab-item" data-type="Distance">\n                            <i class="gld-bimface gld-bf-distance" ></i>\n                        </li>', c.innerHTML = '<li class="bf-measure-tab-item bf-active" data-type="Distance">\n                  <i class="gld-bimface gld-bf-distance" title="' + BimfaceLanguage.bf_tip_measure_distance + '"></i>\n                </li>\n                <li class="bf-measure-tab-item" data-type="Angle">\n                  <i class="gld-bimface gld-bf-angle" title="' + BimfaceLanguage.bf_tip_measure_angle + '"></i>\n                </li>\n                <li class="bf-measure-tab-item" data-type="MinimumDistance">\n                  <i class="gld-bimface gld-bf-distance-min" title="' + BimfaceLanguage.bf_tip_measure_mindis + '"></i>\n                </li>\n                <li class="bf-measure-tab-item" data-type="Elevation">\n                  <i class="gld-bimface gld-bf-elevation" title="' + BimfaceLanguage.bf_tip_measure_elevation + '"></i>\n                </li>';
            for (var u = c.querySelectorAll(".bf-measure-tab-item"), p = 0; p < u.length; p++) u[p].addEventListener("click", function() {
                for (var e = 0; e < u.length; e++) u[e].removeClass("bf-active");
                var t = this.getAttribute("data-type");
                this.addClass("bf-active"), o.setMeasureType(t), f(t, {})
            });
            l.appendChild(c), l.appendChild(s);
            var f = function(e, t) {
                    var n;
                    switch (e) {
                        case Glodon.Bimface.Plugins.Measure.MeasureTypeOption.Distance:
                            n = '<ul class="bf-measure-info">\n                  <li class="bf-measure-distance">' + BimfaceLanguage.bf_panel_measure_distance + '\n                    <span class="bf-measure-value">' + (t.distance ? t.distance.toLocaleString() : "--") + '</span> mm\n                    <span class="bf-measure-reset gld-bimface gld-bf-reset-box" title="' + BimfaceLanguage.bf_tip_section_resetBox + '"><span>\n                  </li>\n                  <li class="bf-measure-x">X： ' + (t.distanceX ? t.distanceX.toLocaleString() : "--") + '</li>\n                  <li class="bf-measure-y">Y： ' + (t.distanceY ? t.distanceY.toLocaleString() : "--") + '</li>\n                  <li class="bf-measure-z">Z： ' + (t.distanceZ ? t.distanceZ.toLocaleString() : "--") + "</li>\n                </ul>", s.innerHTML = n, i && (r.setHeight(190), r.element.style.marginBottom = 0), s.querySelector(".gld-bf-reset-box").addEventListener("click", function() { o.reset() });
                            break;
                        case Glodon.Bimface.Plugins.Measure.MeasureTypeOption.Angle:
                            n = '<ul class="bf-measure-info">\n                    <li class="bf-measure-distance">' + BimfaceLanguage.bf_panel_measure_angle + '\n                      <span class="bf-measure-value">' + (t.angle ? t.angle : "--") + "</span> " + BimfaceLanguage.bf_panel_measure_degree + '\n                      <span class="bf-measure-reset gld-bimface gld-bf-reset-box" title="' + BimfaceLanguage.bf_tip_section_resetBox + '"><span></li>\n                  </ul>', s.innerHTML = n, i && (r.setHeight(120), r.element.style.marginBottom = "70px"), s.querySelector(".gld-bf-reset-box").addEventListener("click", function() { o.reset() });
                            break;
                        case Glodon.Bimface.Plugins.Measure.MeasureTypeOption.MinimumDistance:
                            n = '<ul class="bf-measure-info">\n                    <li class="bf-measure-distance">' + BimfaceLanguage.bf_panel_measure_mindis + '\n                      <span class="bf-measure-value">' + (void 0 != t.distance ? t.distance : "--") + "</span> mm\n                    </li>\n                  </ul>", s.innerHTML = n, r.setHeight(120), r.element.style.marginBottom = "70px";
                            break;
                        case Glodon.Bimface.Plugins.Measure.MeasureTypeOption.Elevation:
                            var a = void 0 != t.points ? Math.round(t.points[0].z) / 1e3 : "--";
                            0 == a ? a = "±0.000" : "--" != a && (a = a.toFixed(3)), n = '<ul class="bf-measure-info">\n                    <li class="bf-measure-distance">' + BimfaceLanguage.bf_panel_measure_elevation + '\n                    <span class="bf-measure-value">' + a + '</span> m\n                    <span class="bf-measure-reset gld-bimface gld-bf-reset-box" title="' + BimfaceLanguage.bf_tip_section_resetBox + '"><span>\n                    </li>\n                  </ul>', s.innerHTML = n, s.querySelector(".gld-bf-reset-box").addEventListener("click", function() { o.reset() }), i && (r.setHeight(120), r.element.style.marginBottom = "70px")
                    }
                },
                h = new Glodon.Bimface.UI.Panel.PanelConfig;
            if (h.title = BimfaceLanguage.bf_btn_measure, h.id = "MeaurePanel", h.css = i ? { right: "10px", bottom: "260px", width: "160px", height: "190px" } : { maxWidth: "414px", left: "50%", transform: "translate(-50%)", bottom: "0.12em", width: "100%", height: "2.4em" }, h.enableSizable = !1, h.className = "bf-panel bf-measurement-panel", o.addEventListener(Glodon.Bimface.Plugins.Measure.MeasureEvent.Measuring, function() { f(o.getMeasureType(), {}) }), o.addEventListener(Glodon.Bimface.Plugins.Measure.MeasureEvent.Measured, function(e) { f(o.getMeasureType(), e), o.getMeasureType() == Glodon.Bimface.Plugins.Measure.MeasureTypeOption.MinimumDistance && (o.measureItem.setMinDistanceLine(e), o.measureItem.draw()) }), o.addEventListener(Glodon.Bimface.Plugins.Measure.MeasureEvent.Reset, function() { f(o.getMeasureType(), {}) }), r = new Glodon.Bimface.UI.Panel.Panel(h), t = o._opt.viewer, r.container.appendChild(l), !i) {
                var m = a.offsetWidth,
                    g = a.offsetHeight;
                r.element.style.fontSize = 100 * Math.min(m, g, 414) / 750 + "px", r.element.addClass("measure-panel");
                var b = r.element.querySelector(".bf-measure-tab"),
                    v = r.element.querySelector(".bf-close");
                v.innerHTML = "<span class='quit'>" + BimfaceLanguage.bf_general_exit + "</span>", b.measure = o, e = b.querySelectorAll(".bf-measure-tab-item");
                var y;
                b.id = "measureTabs", b.addEventListener("click", function(t) { b.hasClass("tab-open") ? (b.removeClass("tab-open"), r.element.removeClass("tab-open")) : (b.addClass("tab-open"), r.element.addClass("tab-open")), t.target.hasClass("gld-bf-distance") ? (y = e[0], r.element.removeClass("miniStyle"), f(Glodon.Bimface.Plugins.Measure.MeasureTypeOption.Distance, {}), b.measure.setMeasureType(Glodon.Bimface.Plugins.Measure.MeasureTypeOption.Distance)) : t.target.hasClass("gld-bf-angle") ? (y = e[1], r.element.addClass("miniStyle"), f(Glodon.Bimface.Plugins.Measure.MeasureTypeOption.Angle, {}), b.measure.setMeasureType(Glodon.Bimface.Plugins.Measure.MeasureTypeOption.Angle)) : (y = e[3], r.element.addClass("miniStyle"), f(Glodon.Bimface.Plugins.Measure.MeasureTypeOption.Elevation, {}), b.measure.setMeasureType(Glodon.Bimface.Plugins.Measure.MeasureTypeOption.Elevation)), b.querySelector(".bf-active").removeClass("bf-active"), y.addClass("bf-active"), d.innerHTML = "", d.appendChild(y.cloneNode(!0)), t.preventDefault(), t.stopPropagation() }, !0), d.addEventListener("click", function(e) { b.hasClass("tab-open") ? (b.removeClass("tab-open"), r.element.removeClass("tab-open")) : (b.addClass("tab-open"), r.element.addClass("tab-open")) }), v.addEventListener("click", function(e) { v.click() }, !0), r.element.appendChild(b), r.element.appendChild(d)
            }
            return "rfaView" == t._data.renderType && c.addClass("bf-measure-tab-rfa"), f(o.getMeasureType(), {}), r
        };
    o.MeasurePanel = a
}();
var hideSectionPanel = function(e) {
        var t = e.getToolbar("MainToolbar");
        if (t) {
            var n = t.getControl("Section");
            if (n) {
                var o = n.getToolbar();
                if (o) {
                    o.getControl("SectionBox").setCheckedState(!1);
                    o.getControl("SectionPlane").setCheckedState(!1)
                } else n.setCheckedState(!1)
            }
        }
    },
    clearSection = function(e) {
        hideSectionPanel(e);
        var t = e.getPlugin("SectionBox"),
            n = e.getPlugin("SectionPlane");
        t && (t.exit(), e.removePlugin("SectionBox")), n && (n.exit(), e.removePlugin("SectionPlane"))
    },
    resetSection = function(e) {
        var t = e.getPlugin("SectionBox"),
            n = e.getPlugin("SectionPlane");
        t && t.restore(), n && (n.restoreRotation(), n.setProgress(0))
    },
    updateSection = function(e, t) {
        var n = e.getViewer(),
            o = e.getPlugin("SectionBox");
        if (!o) { var i = e.getToolbar("MainToolbar"); if (i) { var a = i.getControl("Section"); if (a) { a.getToolbar().getControl("SectionBox").setCheckedState(!0), o = e.getPlugin("SectionBox") } } }
        o.setBox(t), n.zoomToBoundingBox(t)
    },
    getSectionState = function(e) {
        var t = e.getPlugin("SectionBox"),
            n = e.getPlugin("SectionPlane"),
            o = e.getToolbar("MainToolbar"),
            i = { enable: !1, button: null };
        (t || n) && (i.enable = !0);
        var a = o.getControl("Section");
        if (a) {
            var r = a.getToolbar(),
                s = r.getControl("SectionBox"),
                l = r.getControl("SectionPlane");
            s.isChecked() && (i.button = s), l.isChecked() && (i.button = l)
        }
        return i
    };
! function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application.UI.Button"),
        t = (Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Lang.Utility.Dom"), Glodon.Web.Lang.Utility.ClientHelper.getIsDesktop()),
        n = (Glodon.Web.Lang.Utility.ClientHelper.getIsIphone(), function(e, n) {
            var o = e.getViewer(),
                i = e.getRootElement(),
                a = o instanceof Glodon.Bimface.Viewer.Viewer3D,
                r = Glodon.Bimface.UI.Control.ControlEvent,
                s = Glodon.Bimface.Viewer.Viewer3DEvent;
            if (!a) return void console.log("The API is not supported on this viewer.");
            var l = new Glodon.Bimface.UI.Button.ButtonConfig;
            l.id = "Measure", l.title = BimfaceLanguage.bf_btn_measure, l.className = "bf-button gld-bf-measure";
            var c, d = new Glodon.Bimface.UI.Button.ToggleButton(l),
                u = new Glodon.Bimface.Plugins.Measure.MeasureConfig;
            u.viewer = o;
            var p;
            return d.addEventListener(r.StateChange, function(a) {
                if (a) {
                    t || clearSection(e);
                    var r = n.getControl("Explode");
                    r && r.setCheckedState(!1), p = new Glodon.Bimface.Plugins.Measure.Measure(u), p.id = "Measure", p.switchOn(), c = new Glodon.Bimface.Application.UI.Panel.MeasurePanel(p, i), c.addEventListener("Hide", function() { d.setCheckedState(!1) }), i.appendChild(c.element), c.bringToFront(), e.addPlugin(p), e.addPanel(c)
                } else e.removePlugin(p.id), e.removePanel(c.id), c.close(), c = null, p.switchOff();
                o.getEventManager().fireEvent(s.ButtonOnToolbarClicked, { id: l.id, isChecked: a })
            }), d
        });
    e.Measure = n
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application.UI.Button"),
        t = function(e, t) {
            var n = e.getViewer(),
                o = (Glodon.Bimface.Viewer.Viewer3D, Glodon.Bimface.UI.Control.ControlEvent),
                i = new Glodon.Bimface.UI.Button.ButtonConfig;
            i.id = "Annotation", i.title = "批注", i.className = "bf-button gld-bf-notes";
            var a = new Glodon.Bimface.UI.Button.Button(i),
                r = new Glodon.Bimface.Plugins.Annotation.AnnotationToolbarConfig;
            r.viewer = e.getViewer();
            var s = self._annotation = new Glodon.Bimface.Plugins.Annotation.AnnotationToolbar(r),
                l = Glodon.Bimface.Plugins.Annotation.AnnotationToolbarEvent;
            return a._annotationManager = s.getAnnotationManager(), a._annotationToolbar = s, e._plugins.push(a), a.addEventListener(o.Click, function() {
                t.hide();
                var e = t.getControl("Measure");
                e && e.setCheckedState(!1), s.show(), s.addEventListener(l.Saved, function() { t.show() }), s.addEventListener(l.Cancelled, function() { t.show() })
            }), a
        };
    e.Annotation = t
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Lang.Utility.Dom"),
        t = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application.UI.Panel"),
        n = function(t) {
            var n = t.getViewer(),
                o = (t.getRootElement(), new Glodon.Bimface.UI.Panel.PanelConfig);
            o.title = BimfaceLanguage.bf_panel_section_box, o.id = "SectionBoxPanel", o.css = { right: "10px", bottom: "60px", width: "160px", height: "190px" }, o.className = "bf-panel bf-section-panel bf-sectionBox-panel", o.enableSizable = !1;
            var i, a = new Glodon.Bimface.UI.Panel.Panel(o),
                r = t.getPlugin("SectionBox");
            return function() {
                var o = Glodon.Bimface.Application.UI.Toolbar.SectionToolbarConfig(),
                    s = Glodon.Bimface.Application.UI.Toolbar.Toolbar(o, t),
                    l = s.getControl("SectionReset");
                i = s.getControl("SectionBoxVisiable"), i.setCheckedState(!1), l.addEventListener(Glodon.Bimface.UI.Control.ControlEvent.Click, function() { i.setCheckedState(!1) });
                var c = e.create("div", "bf-range-container"),
                    d = '<ul class="bf-range-list">\n        <li>\n          <span class="bf-range-name">' + BimfaceLanguage.bf_panel_section_X + '</span>\n          <div class="bf-section-range" id="sectionX"></div>\n        </li>\n        <li>\n          <span class="bf-range-name">' + BimfaceLanguage.bf_panel_section_Y + '</span>\n          <div class="bf-section-range" id="sectionY"></div>\n        </li>\n        <li>\n          <span class="bf-range-name">' + BimfaceLanguage.bf_panel_section_Z + '</span>\n          <div class="bf-section-range" id="sectionZ"></div>\n        </li>\n      </ul>';
                if (c.innerHTML = d, a.addControl(s), a.container.appendChild(c), r && r._sectionBox) r.showBox();
                else {
                    var u = new Glodon.Bimface.Plugins.Section.SectionBoxConfig;
                    u.viewer = n, u.id = "SectionBox", r = new Glodon.Bimface.Plugins.Section.SectionBox(u), t.removePlugin("SectionBox"), t.addPlugin(r)
                }
                n.render()
            }(), a.hideBox = function() { i && i.setCheckedState(!0) }, a
        };
    t.SectionBoxPanel = n
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application.UI.Button"),
        t = Glodon.Web.Lang.Utility.ClientHelper.getIsDesktop(),
        n = function(e, n) {
            var o = void 0;
            if (t) {
                var i = new Glodon.Bimface.UI.Button.ButtonConfig;
                i.id = "Section", i.title = BimfaceLanguage.bf_btn_section, i.className = "bf-button bf-toolbar-button gld-bf-sectionbox", o = new Glodon.Bimface.UI.Button.Button(i);
                var a = new Glodon.Bimface.UI.Toolbar.ToolbarConfig;
                a.id = "SectionSub", a.title = BimfaceLanguage.bf_btn_section, a.className = "bf-sub-toolbar", a.buttons = ["SectionPlane", "SectionBox"];
                var n = new Glodon.Bimface.Application.UI.Toolbar.Toolbar(a, e);
                o.addToolbar(n)
            } else {
                var r = e.getViewer(),
                    s = e.getRootElement(),
                    l = r instanceof Glodon.Bimface.Viewer.Viewer3D,
                    c = Glodon.Bimface.UI.Control.ControlEvent;
                if (!l) return void console.log("The API is not supported on this viewer.");
                var d = function() {
                        var t = e.getPlugin("SectionBox");
                        if (t) {
                            var n = t.getProgress("x");
                            rangeX.setProgress({ from: n[0], to: n[1] });
                            var o = t.getProgress("y");
                            rangeY.setProgress({ from: o[0], to: o[1] });
                            var i = t.getProgress("z");
                            rangeZ.setProgress({ from: i[0], to: i[1] })
                        }
                    },
                    u = new Glodon.Bimface.UI.Button.ButtonConfig;
                u.id = "Section", u.title = BimfaceLanguage.bf_btn_section, u.className = "bf-button gld-bf-sectionbox", o = new Glodon.Bimface.UI.Button.ToggleButton(u);
                var p;
                o.addEventListener(c.StateChange, function(t) {
                    if (t) {
                        var i = n.getControl("Measure");
                        i && i.setCheckedState(!1);
                        var a = n.getControl("Explode");
                        a && a.setCheckedState(!1), p = new Glodon.Bimface.Application.UI.Panel.SectionPlanePanel(e), p.addEventListener("Hide", function() { o.setCheckedState(!1) }), s.appendChild(p.element), p.bringToFront(), r.addEventListener("Rendered", d), e.addPanel(p)
                    } else clearSection(e), p && (e.removePanel(p.id), p.close(), r.render())
                })
            }
            return o
        };
    e.Section = n
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application.UI.Button"),
        t = function(e, t) {
            var n, o, i, a = e.getViewer(),
                r = e.getRootElement(),
                s = a instanceof Glodon.Bimface.Viewer.Viewer3D,
                l = Glodon.Bimface.UI.Control.ControlEvent,
                c = Glodon.Bimface.Viewer.Viewer3DEvent;
            if (!s) return void console.log("The API is not supported on this viewer.");
            var d = function(t, n) {
                    var o = e.getPlugin("SectionBox");
                    if (o) {
                        var i = [n.from, n.to];
                        o.setProgress(t, i), a.render()
                    }
                },
                u = function() {
                    var e = a._sectionBox;
                    if (e) {
                        var t = e.getProgress("x");
                        n.setProgress({ from: t[0], to: t[1] });
                        var r = e.getProgress("y");
                        o.setProgress({ from: r[0], to: r[1] });
                        var s = e.getProgress("z");
                        i.setProgress({ from: s[0], to: s[1] })
                    }
                },
                p = new Glodon.Bimface.UI.Button.ButtonConfig;
            p.id = "SectionBox", p.title = BimfaceLanguage.bf_panel_section_box, p.className = "bf-button gld-bf-sectionbox1";
            var f, h = new Glodon.Bimface.UI.Button.ToggleButton(p);
            return h.addEventListener(l.StateChange, function(s) {
                if (s) {
                    var l = e.getToolbar("MainToolbar"),
                        m = l.getControl("Measure");
                    m && m.setCheckedState(!1);
                    var g = l.getControl("Explode");
                    g && g.setCheckedState(!1);
                    var b = t.getControl("SectionPlane");
                    b && b.setCheckedState(!1);
                    var v = e.getPlugin("SectionPlane");
                    v && e.removePlugin(v.id), f = new Glodon.Bimface.Application.UI.Panel.SectionBoxPanel(e), f.addEventListener("Hide", function() { h.setCheckedState(!1) }), r.appendChild(f.element), n = new Glodon.Web.Lang.Utility.Dom.multipleRange({ element: f.element.querySelector("#sectionX"), min: 0, max: 100, defaultColor: "#555555", currentColor: "#999999", change: function(e) { d("x", e) } }), o = new Glodon.Web.Lang.Utility.Dom.multipleRange({ element: f.element.querySelector("#sectionY"), min: 0, max: 100, defaultColor: "#555555", currentColor: "#999999", change: function(e) { d("y", e) } }), i = new Glodon.Web.Lang.Utility.Dom.multipleRange({ element: f.element.querySelector("#sectionZ"), min: 0, max: 100, defaultColor: "#555555", currentColor: "#999999", change: function(e) { d("z", e) } }), u(), a.addEventListener("Rendered", u), e.addPanel(f), a.render()
                } else {
                    var y = e.getPlugin("SectionBox");
                    y && y.hideBox(), f && (e.removePanel(f.id), f.close(), a.render())
                }
                a.getEventManager().fireEvent(c.ButtonOnToolbarClicked, { id: p.id, isChecked: s })
            }), h
        };
    e.SectionBox = t
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Lang.Utility.Dom"),
        t = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application.UI.Panel"),
        n = Glodon.Web.Lang.Utility.ClientHelper.getIsDesktop(),
        o = function(e) { return e = parseFloat(e), e < 0 ? 360 + e : e },
        i = function(t) {
            var i = t.getViewer(),
                a = t.getRootElement(),
                r = new Glodon.Bimface.UI.Panel.PanelConfig;
            r.title = BimfaceLanguage.bf_panel_section_plane, r.id = "SectionPlanePanel", r.css = n ? { right: "10px", bottom: "60px", width: "160px", height: "82px" } : { maxWidth: "414px", left: "50%", transform: "translate(-50%)", bottom: "0.12em", width: "100%", height: "1.02em" }, r.className = "bf-panel bf-section-panel bf-sectionPlane-panel", r.enableSizable = !1;
            var s = new Glodon.Bimface.UI.Panel.Panel(r),
                l = t.getPlugin("SectionPlane");
            return function() {
                var r = e.create("div", "bf-section-plane-head"),
                    c = new Glodon.Bimface.UI.Select.SelectConfig;
                l && (c.default = l._plane), c.className = "bf-select bf-select-axial", n ? (s.element.style.marginBottom = "0px", c.options = [{ id: "X", name: BimfaceLanguage.bf_panel_section_X }, { id: "Y", name: BimfaceLanguage.bf_panel_section_Y }, { id: "Z", name: BimfaceLanguage.bf_panel_section_Z }]) : c.options = [{ id: "X", name: "X" }, { id: "Y", name: "Y" }, { id: "Z", name: "Z" }];
                var d = new Glodon.Bimface.UI.Select.Select(c),
                    u = new Glodon.Bimface.Application.UI.Button.SectionPlaneVisiable(t),
                    p = new Glodon.Bimface.Application.UI.Button.SectionDirection(t);
                d.addEventListener("Change", function(e) { l && (l.setPlane(e.id), i.render()) });
                var f = e.create("div", "bf-section-range"),
                    h = new Glodon.Web.Lang.Utility.Dom.range({ element: f, min: 0, max: 100, cur: 50, defaultColor: "#666", currentColor: "#666", isShowProgress: !1, input: function(e) { l && (l.setProgress(e), i.render()) }, change: function(e) { l && (l.setProgress(e), i.render()) } }),
                    m = e.create("div", "bf-section-range");
                m.innerHTML = '<i class="bf-range-icon gld-bf-rotate-vertical"></i>';
                var g = e.create("div", "bf-section-range");
                g.innerHTML = '<i class="bf-range-icon gld-bf-rotate-horizontal"></i>';
                var b = new Glodon.Web.Lang.Utility.Dom.range({ element: m, min: -179, max: 180, cur: 0, defaultColor: "#666", currentColor: "#666", isShowProgress: !1, input: function(e) { l && (l.setRotateAngle(void 0, o(e)), i.render()) }, change: function(e) { l && (l.setRotateAngle(void 0, o(e)), i.render()) } }),
                    v = new Glodon.Web.Lang.Utility.Dom.range({ element: g, min: -179, max: 180, cur: 0, defaultColor: "#666", currentColor: "#666", isShowProgress: !1, input: function(e) { l && (l.setRotateAngle(o(e), void 0), i.render()) }, change: function(e) { l && (l.setRotateAngle(o(e), void 0), i.render()) } });
                if (i.addEventListener("Rendered", function() {
                        var e = i._sectionPlane;
                        if (e) {
                            var t = e.getProgress();
                            0 == n && h.setProgress(t);
                            var o = e.getRotateAngle();
                            b.setProgress(o.angleB > 180 ? o.angleB - 360 : o.angleB), v.setProgress(o.angleA > 180 ? o.angleA - 360 : o.angleA)
                        }
                    }), r.appendChild(d.element), s.container.appendChild(r), 0 == n && s.container.appendChild(f), n ? r.appendChild(u.element) : r.appendChild(p.element), l && n && l._sectionTool) l.showPlane();
                else {
                    var y = new Glodon.Bimface.Plugins.Section.SectionPlaneConfig;
                    y.viewer = i, y.id = "SectionPlane", l = new Glodon.Bimface.Plugins.Section.SectionPlane(y), t.removePlugin("SectionPlane"), t.addPlugin(l)
                }
                if (!n) {
                    var w = a.offsetWidth,
                        C = a.offsetHeight;
                    l.hidePlane(), s.element.style.fontSize = 100 * Math.min(C, w, 414) / 750 + "px", s.element.addClass("section-panel");
                    var k = s.element.querySelector(".bf-section-plane-head");
                    s.element.querySelector(".bf-close").innerHTML = "<span class='quit'>" + BimfaceLanguage.bf_general_exit + "</span>", s.element.appendChild(k)
                }
                i.render()
            }(), s
        };
    t.SectionPlanePanel = i
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application.UI.Button"),
        t = (Glodon.Web.Lang.Utility.ClientHelper.getIsDesktop(), function(e, t) {
            var n = e.getViewer(),
                o = e.getRootElement(),
                i = n instanceof Glodon.Bimface.Viewer.Viewer3D,
                a = Glodon.Bimface.UI.Control.ControlEvent,
                r = Glodon.Bimface.Viewer.Viewer3DEvent;
            if (!i) return void console.log("The API is not supported on this viewer.");
            var s = new Glodon.Bimface.UI.Button.ButtonConfig;
            s.id = "SectionPlane", s.title = BimfaceLanguage.bf_panel_section_plane, s.className = "bf-button gld-bf-section-axial";
            var l, c = new Glodon.Bimface.UI.Button.ToggleButton(s);
            return c.addEventListener(a.StateChange, function(i) {
                if (n.getEventManager().fireEvent(r.ButtonOnToolbarClicked, { id: s.id, isChecked: c.isChecked() }), i) {
                    var a = e.getToolbar("MainToolbar"),
                        d = a.getControl("Measure");
                    d && d.setCheckedState(!1);
                    var u = a.getControl("Explode");
                    u && u.setCheckedState(!1);
                    var p = t.getControl("SectionBox");
                    p && p.setCheckedState(!1);
                    var f = e.getPlugin("SectionBox");
                    f && e.removePlugin(f.id);
                    var h = n.getDomElement();
                    l = new Glodon.Bimface.Application.UI.Panel.SectionPlanePanel(e), l.addEventListener("Hide", function() { c.setCheckedState(!1), h.removeAttribute("style") }), h.style.cursor = "default", o.appendChild(l.element), l.bringToFront(), e.addPanel(l), n.render()
                } else {
                    var m = e.getPlugin("SectionPlane");
                    m && m.hidePlane(), l && (e.removePanel(l.id), l.close(), n.render())
                }
            }), c
        });
    e.SectionPlane = t
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application.UI.Button"),
        t = function(e, t) {
            var n = e.getViewer(),
                o = n instanceof Glodon.Bimface.Viewer.Viewer3D,
                i = Glodon.Bimface.UI.Control.ControlEvent;
            if (!o) return void console.log("The API is not supported on this viewer.");
            var a = new Glodon.Bimface.UI.Button.ButtonConfig;
            a.id = "SectionBoxVisiable", a.title = BimfaceLanguage.bf_tip_section_hide, a.className = "bf-button gld-bf-box-hide";
            var r = new Glodon.Bimface.UI.Button.ToggleButton(a);
            return r.addEventListener(i.StateChange, function(t) {
                var o = e.getPlugin("SectionBox");
                o && (t ? o.hideBox() : o.showBox()), n.render()
            }), r
        };
    e.SectionBoxVisiable = t
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application.UI.Button"),
        t = function(e, t) {
            var n = e.getViewer(),
                o = n instanceof Glodon.Bimface.Viewer.Viewer3D,
                i = Glodon.Bimface.UI.Control.ControlEvent;
            if (!o) return void console.log("The API is not supported on this viewer.");
            var a = new Glodon.Bimface.UI.Button.ButtonConfig;
            a.id = "SectionPlaneVisiable", a.title = BimfaceLanguage.bf_tip_section_hide, a.className = "bf-button gld-bf-hide-slice";
            var r = new Glodon.Bimface.UI.Button.ToggleButton(a);
            return r.addEventListener(i.StateChange, function(t) {
                var o = e.getPlugin("SectionPlane");
                o && (t ? o.hidePlane() : o.showPlane()), n.render()
            }), r
        };
    e.SectionPlaneVisiable = t
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application.UI.Button"),
        t = function(e, t) {
            var n = e.getViewer(),
                o = n instanceof Glodon.Bimface.Viewer.Viewer3D,
                i = Glodon.Bimface.UI.Control.ControlEvent;
            if (!o) return void console.log("The API is not supported on this viewer.");
            var a = new Glodon.Bimface.UI.Button.ButtonConfig;
            a.id = "SectionRotate", a.title = "旋转", a.className = "bf-button gld-bf-rotate-box";
            var r = new Glodon.Bimface.UI.Button.ToggleButton(a);
            return r.addEventListener(i.Click, function() {
                var e = Glodon.Bimface.Viewer.SectionBoxMode;
                r.isChecked() ? n.setSectionBoxMode(e.Rotate) : n.setSectionBoxMode(e.Default)
            }), r
        };
    e.SectionRotate = t
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application.UI.Button"),
        t = function(e, t) {
            var n = e.getViewer(),
                o = n instanceof Glodon.Bimface.Viewer.Viewer3D,
                i = Glodon.Bimface.UI.Control.ControlEvent;
            if (!o) return void console.log("The API is not supported on this viewer.");
            var a = new Glodon.Bimface.UI.Button.ButtonConfig;
            a.id = "SectionReset", a.title = BimfaceLanguage.bf_tip_section_resetBox, a.className = "bf-button gld-bf-reset-box";
            var r = new Glodon.Bimface.UI.Button.Button(a);
            return r.addEventListener(i.Click, function() {
                var t = e.getPlugin("SectionBox");
                t && t.reset(), n.render()
            }), r
        };
    e.SectionReset = t
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application.UI.Panel"),
        t = function(e) {
            var t = new Glodon.Bimface.UI.Panel.PanelConfig;
            t.title = BimfaceLanguage.bf_btn_info, t.css = { left: "50%", top: "50%", width: "300px", height: "210px", transform: "translate(-50%,-50%)" }, t.enableSizable = !1, t.className = "bf-panel bf-basicInfo-panel";
            var n = e.getInformation(),
                o = new Glodon.Bimface.UI.Panel.Panel(t),
                i = '<div class="bf-info">\n                  <ul class="bf-info-list">\n                    <li>' + BimfaceLanguage.bf_panel_info_component + '<span class="bf-info-value">' + n.elements + "</span></li>\n                    <li>" + BimfaceLanguage.bf_panel_info_mesh + '<span class="bf-info-value">' + n.triangles + "</span></li>\n                    <li>" + BimfaceLanguage.bf_panel_info_vertex + '<span class="bf-info-value">' + 3 * n.triangles + '</span></li>\n                  </ul>\n                  <div class="bf-info-power">Powered by <a target="_blank" href="http://bimface.com/">bimface.com</a></div>\n                </div>';
            return o.setHtml(i), o
        };
    e.InformationPanel = t
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application.UI.Button"),
        t = function(e, t) {
            var n = e.getViewer(),
                o = e.getRootElement(),
                i = n instanceof Glodon.Bimface.Viewer.Viewer3D,
                a = Glodon.Bimface.UI.Control.ControlEvent,
                r = Glodon.Bimface.Viewer.Viewer3DEvent;
            if (!i) return void console.log("The API is not supported on this viewer.");
            var s = new Glodon.Bimface.UI.Button.ButtonConfig;
            s.id = "Information", s.title = BimfaceLanguage.bf_btn_info, s.className = "bf-button gld-bf-information";
            var l, c = new Glodon.Bimface.UI.Button.ToggleButton(s);
            return c.addEventListener(a.StateChange, function(t) {
                t ? l ? l.show() : (l = new Glodon.Bimface.Application.UI.Panel.InformationPanel(n), l.addEventListener("Hide", function() { c.setCheckedState(!1) }), o.appendChild(l.element), l.bringToFront(), e.addPanel(l)) : l.hide(), n.getEventManager().fireEvent(r.ButtonOnToolbarClicked, { id: s.id, isChecked: t })
            }), c
        };
    e.Information = t
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application.UI.Button"),
        t = function(e, t) {
            var n = e.getViewer(),
                o = (Glodon.Bimface.Viewer.Viewer3D, Glodon.Bimface.UI.Control.ControlEvent),
                i = new Glodon.Bimface.UI.Button.ButtonConfig;
            i.id = "FullScreen", i.title = BimfaceLanguage.bf_btn_fullScreen, i.className = "bf-button gld-bf-maximize";
            var a = new Glodon.Bimface.UI.Button.ChangeButton(i);
            return a.addEventListener(o.Click, function() {
                var e = this.hasClass("gld-bf-maximize");
                n.enableFullScreen(e)
            }), Glodon.Web.Lang.Utility.FullScreen.onFullScreenChanged(function() {
                var e = a.getTitle();
                a.toggleClassName("gld-bf-maximize"), a.toggleClassName("gld-bf-minimize"), e == BimfaceLanguage.bf_btn_fullScreen_exit ? a.setTitle(BimfaceLanguage.bf_btn_fullScreen) : a.setTitle(BimfaceLanguage.bf_btn_fullScreen_exit)
            }), a
        };
    e.FullScreen = t
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application.UI.Button"),
        t = function(e, t) {
            var n = e.getViewer(),
                o = (Glodon.Bimface.Viewer.Viewer3D, Glodon.Bimface.UI.Control.ControlEvent),
                i = new Glodon.Bimface.UI.Button.ButtonConfig;
            i.id = "FamilyList", i.title = "FamilyList", i.className = "bf-combobox bf-family";
            var a = new Glodon.Bimface.UI.Button.ComboBox(i);
            return n.getFamilyTypes(function(e) {
                for (var t = 0, n = e.length; t < n; t++) {
                    var o = e[t],
                        i = new Glodon.Bimface.UI.Button.ButtonConfig;
                    i.id = o.id, i.title = o.name;
                    var r = new Glodon.Bimface.UI.Button.ComboBoxOptionButton(i);
                    r.setHtml('<span class="bf-button-name">' + o.name + "</span>"), a.addControl(r)
                }
            }), a.addEventListener(o.Change, function(e) { n.showFamilyTypeById(e.id), n.render() }), a
        };
    e.FamilyList = t
}();
var createTreeNode = function e(t) {
        if (t) {
            var n = new Glodon.Bimface.UI.Tree.TreeNodeConfig,
                o = new Glodon.Bimface.UI.Button.ButtonConfig;
            o.className = "bf-tree-icon", o.defaultClass = "gld-bf-untransparent", o.changeClass = "gld-bf-transparent", o.title = "半透明", n.selection = !1;
            var i = new Glodon.Bimface.UI.Button.ChangeButton(o);
            switch (t.type) {
                case "floor":
                    t.type = "levelName", n.isChecked = !0, n.hasCheckbox = !0, n.icon = i;
                    break;
                case "category":
                    t.type = "categoryId", n.isChecked = !0, n.hasCheckbox = !0, n.icon = i;
                    break;
                case "specialty":
                case "root":
                    n.isChecked = !0, n.hasCheckbox = !0, n.icon = i;
                    break;
                case "family":
                case "familyType":
                default:
                    n.isChecked = !1, n.hasCheckbox = !1
            }
            var a = new Glodon.Bimface.UI.Tree.TreeNode(n);
            if (a.filter = t.type, "categoryId" == t.type || "root" == t.type ? a.setData(t.id, t.name) : "未设专业" == t.name ? a.setData("", t.name) : a.setData(t.name, t.name), t.items && t.items.length > 0)
                for (var r = 0, s = t.items.length; r < s; r++) a.addChildNode(e(t.items[r]));
            return a
        }
    },
    createTree = function(e, t, n) {
        if (t && 0 != t.length) {
            var o = createTreeNode({ type: "root", id: "all", name: BimfaceLanguage.bf_panel_modelTree_allComponents });
            o.expand();
            var i = new Glodon.Bimface.UI.Tree.Tree(o);
            if ("singleModel" == n)
                for (var a = 0, r = t.length; a < r; a++)
                    if (1 == r && "floor" == t[a].type)
                        for (var s = t[a].items, l = 0; l < s.length; l++) o.addChildNode(createTreeNode(s[l]));
                    else if ("specialty" == t[0].type && "floor" == t[0].items[0].type && 1 == t[0].items.length)
                for (var s = t[0].items[0].items, l = 0; l < s.length; l++) o.addChildNode(createTreeNode(s[l]));
            else o.addChildNode(createTreeNode(t[a]));
            else
                for (var a = 0, r = t.items.length; a < r; a++) o.addChildNode(createTreeNode(t.items[a]));
            return i.addEventListener("CheckedChanged", function(t, n) {
                var o = getConditions(n),
                    i = n.getCheckedState(),
                    a = n.id;
                "unchecked" == i ? "all" == a ? e.hideAllComponents() : e.hideComponentsByObjectData(o) : "checked" == i && ("all" == a ? e.showAllComponents() : e.showComponentsByObjectData(o)), e.render()
            }), i.addEventListener("IconChanged", function(t, n) {
                var o = getConditions(t),
                    i = t.id;
                "change" == n ? "all" == i ? e.transparentAllComponents() : e.transparentComponentsByObjectData(o) : "all" == i ? e.opaqueAllComponents() : e.opaqueComponentsByObjectData(o), e.render()
            }), i
        }
    },
    getConditions = function(e) {
        var t = {};
        return t[e.filter] = e.id,
            function e(n) { if (n._parent) { var o = n._parent; "root" != o.filter && (t[o.filter] = o.id, e(o)) } }(e), [t]
    },
    getComponentsTree = function(e, t) {
        e.getModelTree(function(n, o) {
            var i = createTree(e, n, o);
            t && t(i)
        })
    },
    FAMILY_INSTANCE, TREE_TYPE, createTreeNode$1 = function e(t) {
        if (t) {
            var n = new Glodon.Bimface.UI.Tree.TreeNodeConfig,
                o = new Glodon.Bimface.UI.Button.ButtonConfig;
            o.className = "bf-tree-icon", o.defaultClass = "gld-bf-untransparent", o.changeClass = "gld-bf-transparent", o.title = "半透明", n.selection = !0;
            var i = new Glodon.Bimface.UI.Button.ChangeButton(o);
            switch (t.type) {
                case "floor":
                    t.type = "levelName", n.isChecked = !0, n.hasCheckbox = !0, n.icon = i;
                    break;
                case "category":
                    t.type = "categoryId", n.isChecked = !0, n.hasCheckbox = !0, n.icon = i;
                    break;
                case "specialty":
                    n.selection = !1;
                case "root":
                    n.isChecked = !0, n.hasCheckbox = !0, n.selection = !1, n.icon = i;
                    break;
                case "family":
                case "familyType":
                    n.isChecked = !0, n.hasCheckbox = !0, n.icon = i;
                    break;
                default:
                    n.isChecked = !1, n.hasCheckbox = !1
            }
            t.elementIds && (t.type = "fileId", n.isChecked = !0, n.hasCheckbox = !0, n.icon = i), t.type || (n.isChecked = !0, n.hasCheckbox = !0, n.icon = i);
            var a = new Glodon.Bimface.UI.Tree.TreeNode(n);
            if (a.filter = t.type, "familyType" == t.type && "old" != TREE_TYPE && (a.fileId = t.items[0].fileId), "categoryId" == t.type || "root" == t.type) a.setData(t.id, t.name);
            else if (t.elementIds || t.type) t.fileId ? a.setData(t.fileId, t.fileId) : "specialty" == t.type && "" == t.name ? a.setData("", "未设专业") : "未设专业" == t.name ? a.setData("", t.name) : a.setData(t.name, t.name);
            else {
                var r = FAMILY_INSTANCE + "[" + t + "]";
                a.setData(t, r)
            }
            if (t.items && t.items.length > 0)
                if ("family" == t.type && (FAMILY_INSTANCE = t.name), "old" != TREE_TYPE && "familyType" != t.type)
                    for (var s = 0, l = t.items.length; s < l; s++) a.addChildNode(e(t.items[s]));
                else if ("familyType" == t.type && t.items[0].elementIds && t.items[0].elementIds.length > 0)
                for (var s = 0, l = t.items[0].elementIds.length; s < l; s++) {
                    var c = t.items[0].elementIds[s];
                    a.addChildNode(e(c))
                } else
                    for (var s = 0, l = t.items.length; s < l; s++) a.addChildNode(e(t.items[s]));
            return a
        }
    },
    createTree$1 = function(e, t, n) {
        if (t && 0 != t.length) {
            var o = createTreeNode$1({ type: "root", id: "all", name: BimfaceLanguage.bf_panel_modelTree_allComponents });
            o.expand();
            var i = new Glodon.Bimface.UI.Tree.Tree(o);
            if ("singleModel" == n) {
                var a;
                a = "old" == TREE_TYPE ? t : t[0].items;
                for (var r = 0, s = a.length; r < s; r++)
                    if (1 == s && "floor" == a[r].type)
                        for (var l = a[0].items, c = 0; c < l.length; c++) {
                            var d = createTreeNode$1(l[c]);
                            d.addEventListener("SelectionChanged", function(t, n) { selectComponent(e, t, n) }), o.addChildNode(d)
                        } else {
                            var d = createTreeNode$1(a[r]);
                            d.addEventListener("SelectionChanged", function(t, n) { selectComponent(e, t, n) }), o.addChildNode(d)
                        }
            } else {
                var a;
                a = "old" == TREE_TYPE ? t.items : t;
                for (var r = 0, s = a.length; r < s; r++) {
                    var d = createTreeNode$1(a[r]);
                    d.addEventListener("SelectionChanged", function(t, n) { selectComponent(e, t, n) }), o.addChildNode(d)
                }
            }
            return i.addEventListener("CheckedChanged", function(t, n) {
                var o = getConditions$1(n),
                    i = n.getCheckedState(),
                    a = n.id;
                "unchecked" == i ? "all" == a ? e.hideAllComponents() : n.filter ? e.hideComponentsByObjectData(o) : e.hideComponentsById(o) : "checked" == i && ("all" == a ? e.showAllComponents() : n.filter ? e.showComponentsByObjectData(o) : e.showComponentsById(o)), e.render()
            }), i.addEventListener("IconChanged", function(t, n) {
                var o = getConditions$1(t),
                    i = t.id;
                "change" == n ? "all" == i ? e.transparentAllComponents() : t.filter ? e.transparentComponentsByObjectData(o) : e.transparentComponentsById(o) : "all" == i ? e.opaqueAllComponents() : t.filter ? e.opaqueComponentsByObjectData(o) : e.opaqueComponentsById(o), e.render()
            }), i
        }
    },
    getConditions$1 = function(e) {
        if (e.filter) {
            var t = {};
            t[e.filter] = e.id,
                function e(n) { if (n._parent) { var o = n._parent; "root" != o.filter && (t[o.filter] = o.id, e(o)) } }(e)
        } else {
            var n = e._parent.fileId;
            t = n ? n + "." + e.id : e.id
        }
        return [t]
    },
    selectComponent = function(e, t, n) {
        var o, i = getConditions$1(t);
        o = t.filter ? e.getViewer().getFilter().getMatchIds(i) : i, n ? (e.clearSelectedComponents(), e.addSelectedComponentsById(o), e.zoomToSelectedComponents(1)) : e.clearSelectedComponents(), e.render()
    },
    getComponentsRvtTree = function(e, t) {
        e.getRvtModelTree(function(n, o) {
            var i = createTree$1(e, n, o);
            t && t(i)
        }, function() {
            e.getModelTree(function(n, o) {
                TREE_TYPE = "old";
                var i = createTree$1(e, n, o);
                t && t(i)
            })
        })
    },
    tips = { property: "请选择一个构件，以查看对应属性", material: "暂无对应材质属性", drawing: "暂无对应图纸", area: "暂无对应空间", file: "暂无对应文件", links: "暂无对应文件", component: "暂无对应构件信息", loading: "加载中...", empty: "暂无对应数据", notFined: "找不到对应的三维构件" },
    showAreaProperty = function(e, t, n, o) { "area" == n ? e.getAreaProperty(o, function(e) { e && e.properties ? t.setData(e.properties) : t.setData({}) }) : e.getRoomProperty(o, function(e) { e && e.properties ? t.setData(e.properties) : t.setData({}) }) };
! function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application.UI.Panel"),
        t = Glodon.Web.Lang.Utility.ClientHelper.getIsDesktop(),
        n = function(e) {
            var n = (e.getViewer(), Glodon.Bimface.Viewer.Viewer3DEvent, new Glodon.Bimface.UI.Panel.PanelConfig);
            n.title = BimfaceLanguage.bf_tip_props_rooms, n.id = "AreaPropertyPanel", n.css = t ? { right: "10px", top: "10px", width: "300px", height: "416px" } : { left: "0", top: "0", width: "100%", height: "100%" };
            var o = new Glodon.Bimface.UI.Panel.Panel(n);
            return o.setTips(tips.area), o.element.addClass("area-panel"), o.show(), e.areaPanel = o, o
        };
    e.AreaPanel = n
}();
var zoomToArea = function(e, t, n, o) {
        var i = Glodon.Web.Lang.Utility.ClientHelper.getIsDesktop(),
            a = e.getViewer();
        e._objectTypes[t.id] = t.type, i || o || e.getPanel("ModelTree").hide();
        var r = e.getPanel("AreaPropertyPanel");
        if (n) {
            r && showAreaProperty(a, r, t.type, t.id);
            var s = t.elevation,
                l = t.height,
                c = t.maxPt,
                d = t.minPt,
                u = { min: d, max: { x: c.x, y: c.y, z: c.z + l } },
                p = a.getWorldBox(s - 20, s + 1600 + 10),
                f = t.boundary,
                h = CLOUD.ExtrudeBodyManager.getInstance(a.getViewer().getScene()).getNode(t.id);
            f && (a.hideAllRooms(), h ? a.showRoomsById([t.id]) : a.createRoom(f, 1600, t.id)), a.setSelectedComponentsById([t.id]);
            var m = a.getCameraAnimation();
            a.setCameraAnimation(!1), a.setView(Glodon.Bimface.Viewer.ViewOption.Top), a.zoomToBoundingBox(u), a.setCameraAnimation(m);
            var g = e.getPlugin("SectionBox");
            if (g) {
                var b = e.getPanel("SectionBoxPanel");
                b && b.hideBox()
            } else {
                var v = new Glodon.Bimface.Plugins.Section.SectionBoxConfig;
                v.viewer = a, v.id = "SectionBox", g = new Glodon.Bimface.Plugins.Section.SectionBox(v), e.addPlugin(g)
            }
            g.setBox(p), g.hideBox(), a.render()
        } else r && r.clear(), a.hideAllRooms(), a.clearIsolation(), i || clearSection(e), a.render()
    },
    createTreeNode$2 = function e(t, n, o, i, a) {
        var r = t.getViewer(),
            s = t.getRootElement();
        if (n) {
            var l = new Glodon.Bimface.UI.Tree.TreeNodeConfig;
            l.isChecked = !1, l.hasCheckbox = !1, l.selection = !1, l.className = "bf-tree bf-tree-area", "area" != o && "room" != o || (l.selection = !0);
            var c = new Glodon.Bimface.UI.Tree.TreeNode(l);
            if (c.type = o, c.setData(n.id, n.name), "area" == o || "room" == o) {
                c.elevation = i, c.height = a, c.boundary = n.boundary, c.maxPt = n.maxPt, c.minPt = n.minPt;
                var d = new Glodon.Bimface.UI.Button.ButtonConfig;
                d.className = "bf-property-icon", d.title = BimfaceLanguage.bf_tip_props_rooms;
                var u = new Glodon.Bimface.UI.Button.Button(d);
                c.addNode(u.element), u.addEventListener("Click", function() {
                    var e = t.getPanel("AreaPropertyPanel");
                    e || (e = new Glodon.Bimface.Application.UI.Panel.AreaPanel(t), e.addEventListener("Close", function() { t.removePanel(e.id) }), e.addEventListener("Hide", function() { e.close() }), showAreaProperty(r, e, c.type, c.id), s.appendChild(e.element), t.addPanel(e))
                })
            }
            var p, f, i, a;
            if ("areas" == o && n.areas && n.areas.length > 0 && (p = n.areas, f = "area", i = n.elevation, a = n.height), "rooms" == o && n.rooms && n.rooms.length > 0 && (p = n.rooms, f = "room", i = n.elevation, a = n.height), p)
                for (var h = 0; h < p.length; h++) {
                    var m = e(t, p[h], f, i, a);
                    m.addEventListener("SelectionChanged", function(e, n, o) { zoomToArea(t, e, n, o) }), c.addChildNode(m)
                }
            return "rooms" != o && "areas" != o || p || c.disabled(), c
        }
    },
    createTree$2 = function(e, t, n) {
        var o = e.getViewer();
        if (t && 0 != t.length) {
            var i = new Glodon.Bimface.UI.Tree.TreeNodeConfig;
            i.isChecked = !1, i.hasCheckbox = !1, i.selection = !1, i.className = "bf-tree bf-tree-empty";
            var a = new Glodon.Bimface.UI.Tree.TreeNode(i);
            a.expand();
            var r = new Glodon.Bimface.UI.Tree.TreeNode(i);
            r.setData("room", BimfaceLanguage.bf_panel_modelTree_rooms2), r.expand();
            var s = new Glodon.Bimface.UI.Tree.TreeNode(i);
            s.setData("area", BimfaceLanguage.bf_panel_modelTree_areas), s.expand();
            var l = new Glodon.Bimface.UI.Tree.Tree(a),
                c = o._manifest.Features.HasArea;
            o._manifest.Features.HasRoom && a.addChildNode(r), c && a.addChildNode(s);
            for (var d = 0, u = t.length; d < u; d++) r.addChildNode(createTreeNode$2(e, t[d], "rooms")), s.addChildNode(createTreeNode$2(e, t[d], "areas"));
            return l
        }
    },
    getAreaTree = function(e, t) {
        e.getViewer().getAreas(function(n) {
            if (n && n.length > 0) {
                var o = createTree$2(e, n);
                t && t(o)
            } else t && t()
        })
    },
    createTreeNode$3 = function(e) {
        if (e) {
            var t = new Glodon.Bimface.UI.Tree.TreeNodeConfig;
            t.isChecked = !0, t.hasCheckbox = !0, t.selection = !1;
            var n = new Glodon.Bimface.UI.Button.ButtonConfig;
            n.className = "bf-tree-icon", n.defaultClass = "gld-bf-untransparent", n.changeClass = "gld-bf-transparent", n.title = "半透明";
            var o = new Glodon.Bimface.UI.Button.ChangeButton(n);
            t.icon = o;
            var i = new Glodon.Bimface.UI.Tree.TreeNode(t);
            return i.filter = "fileId", i.setData("" + e.fileId, e.fileName), i.linkedId = e.linkedBy, i.databagId = e.databagId, i
        }
    },
    createTree$3 = function(e, t) {
        if (t && 0 != t.length) {
            var n = createTreeNode$3({ type: "root", fileId: "all", fileName: BimfaceLanguage.bf_panel_modelTree_allFiles });
            n.expand();
            for (var o = new Glodon.Bimface.UI.Tree.Tree(n), i = 0, a = t.length; i < a; i++) n.addChildNode(createTreeNode$3(t[i]));
            return o.addEventListener("CheckedChanged", function(t, n) {
                var o = n.filter,
                    i = n.id,
                    a = n.getCheckedState();
                if ("all" == i) "unchecked" == a ? e.hideAllComponents() : e.showAllComponents();
                else {
                    for (var r = n.linkedId, s = [{ sceneId: n.databagId + "." + i }], l = [], c = 0; c < r.length; c++) {
                        var d = {};
                        d[o] = r[c], l.push(d)
                    }
                    "unchecked" == a ? (e.hideComponentsByObjectData(l), e.hideComponentsByObjectData(s)) : (e.showComponentsByObjectData(l), e.showComponentsByObjectData(s))
                }
                e.render()
            }), o.addEventListener("IconChanged", function(t, n) {
                var o = t.filter;
                if ("all" == t.id) "change" == n ? e.transparentAllComponents() : e.opaqueAllComponents();
                else {
                    for (var i = t.linkedId, a = [], r = 0; r < i.length; r++) {
                        var s = {};
                        s[o] = i[r], a.push(s)
                    }
                    "change" == n ? e.transparentComponentsByObjectData(a) : e.opaqueComponentsByObjectData(a)
                }
                e.render()
            }), o
        }
    },
    getFileTree = function(e, t) {
        e.getFiles(function(n) {
            n = Glodon.Web.Lang.Utility.ClientHelper.sortByName(n, "fileName");
            var o = createTree$3(e, n);
            t && t(o)
        })
    },
    createTreeNode$4 = function e(t) {
        if (t) {
            var n = new Glodon.Bimface.UI.Tree.TreeNodeConfig;
            n.isChecked = !0, n.selection = !1, n.propagation = !1, n.hasCheckbox = !0;
            var o = new Glodon.Bimface.UI.Button.ButtonConfig;
            o.className = "bf-tree-icon", o.defaultClass = "gld-bf-untransparent", o.changeClass = "gld-bf-transparent", o.title = "半透明";
            var i = new Glodon.Bimface.UI.Button.ChangeButton(o);
            n.icon = i;
            var a = new Glodon.Bimface.UI.Tree.TreeNode(n);
            if (a.filter = "fileId", a.setData("" + t.fileId, t.name), a.linked = [t.linkPathHash], a.databagId = t.databagId, t.links && t.links.length > 0)
                for (var r = 0, s = t.links.length; r < s; r++) {
                    var l = e(t.links[r]);
                    a.linked = a.linked.concat(l.linked), a.addChildNode(e(t.links[r]))
                }
            return a
        }
    },
    createTree$4 = function(e, t, n) {
        if (t && 0 != t.length) {
            var o = createTreeNode$4({ type: "root", fileId: "all", name: BimfaceLanguage.bf_panel_modelTree_allFiles });
            o.expand();
            for (var i = new Glodon.Bimface.UI.Tree.Tree(o), a = 0, r = t.length; a < r; a++) o.addChildNode(createTreeNode$4(t[a]));
            return i.addEventListener("CheckedChanged", function(t, n) {
                var o = n.filter,
                    i = n.id,
                    a = n.getCheckedState();
                if ("all" == i) "unchecked" == a ? e.hideAllComponents() : e.showAllComponents();
                else {
                    for (var r = n.linked, s = [], l = 0; l < r.length; l++) {
                        var c = {};
                        c[o] = r[l], s.push(c)
                    }
                    "unchecked" == a ? e.hideComponentsByObjectData(s) : e.showComponentsByObjectData(s)
                }
                e.render()
            }), i.addEventListener("IconChanged", function(t, n) {
                for (var o = t.filter, i = t.id, a = t.linked, r = [], s = 0; s < a.length; s++) {
                    var l = {};
                    l[o] = a[s], r.push(l)
                }
                "change" == n ? "all" == i ? e.transparentAllComponents() : e.transparentComponentsByObjectData(r) : "all" == i ? e.opaqueAllComponents() : e.opaqueComponentsByObjectData(r), e.render()
            }), i
        }
    },
    getLinkedTree = function(e, t) {
        e.getLinkGraph(function(n) {
            var o = createTree$4(e, n);
            t && t(o)
        })
    },
    createTreeNode$5 = function(e, t) {
        if (e) {
            var n = new Glodon.Bimface.UI.Tree.TreeNodeConfig;
            n.isChecked = !1, n.hasCheckbox = !1, n.selection = !0;
            var o = new Glodon.Bimface.UI.Tree.TreeNode(n);
            return o.viewToken = t, o.setData(e.id, e.name), o
        }
    },
    createTree$5 = function(e, t, n, o) {
        if (t && 0 != t.length) {
            var i = new Glodon.Bimface.UI.Tree.TreeNodeConfig;
            i.isChecked = !1, i.hasCheckbox = !1, i.selection = !1, i.className = "bf-tree-drawing";
            for (var a = new Glodon.Bimface.UI.Tree.TreeNode(i), r = new Glodon.Bimface.UI.Tree.Tree(a), s = 0, l = t.length; s < l; s++) a.addChildNode(createTreeNode$5(t[s].viewInfo, e._data.viewToken));
            return r
        }
    },
    getDrawingTree = function(e, t) {
        e.getAllDrawingsheets(function(n) {
            if ((n = n.drawingList || n) && n.length > 0) {
                n = Glodon.Web.Lang.Utility.ClientHelper.sortByName(n, "viewInfo.name");
                var o = createTree$5(e, n);
                t && t(o)
            } else t && t()
        })
    },
    createTreeNode$6 = function(e, t, n) {
        if (t) {
            var o = new Glodon.Bimface.UI.Tree.TreeNodeConfig;
            o.isChecked = !1, o.hasCheckbox = !1, o.selection = !0;
            var i = new Glodon.Bimface.UI.Tree.TreeNode(o);
            return i.fileId = n, i.setData(t.id, t.name), i
        }
    },
    createFileNode = function(e, t) {
        var n = new Glodon.Bimface.UI.Tree.TreeNodeConfig;
        n.isChecked = !1, n.hasCheckbox = !1, n.selection = !1;
        var o = new Glodon.Bimface.UI.Tree.TreeNode(n);
        if (o.setData(t.fileId, t.fileName), t.drawingSheets && t.drawingSheets.length > 0)
            for (var i = 0; i < t.drawingSheets.length; i++) o.addChildNode(createTreeNode$6(e, t.drawingSheets[i].viewInfo, t.fileId));
        return o
    },
    createTree$6 = function(e, t) {
        if (t && 0 != t.length) {
            var n = new Glodon.Bimface.UI.Tree.TreeNodeConfig;
            n.hasCheckbox = !1, n.className = "bf-tree bf-tree-empty";
            var o = new Glodon.Bimface.UI.Tree.TreeNode(n);
            o.expand();
            for (var i = new Glodon.Bimface.UI.Tree.Tree(o), a = 0, r = t.length; a < r; a++) o.addChildNode(createFileNode(e, t[a]));
            return i
        }
    },
    getIntrgrateDrawing = function(e, t) {
        e.getAllDrawingsheets(function(n) {
            var o = {};
            n = n.drawingList || n;
            for (var i = 0, a = n.length; i < a; i++) o[n[i].fileId] ? o[n[i].fileId].push({ viewInfo: n[i].viewInfo }) : o[n[i].fileId] = [{ viewInfo: n[i].viewInfo }];
            e.getFiles(function(n) {
                for (var i = {}, a = 0, r = n.length; a < r; a++) i[n[a].fileId] = n[a].fileName;
                var s = [];
                for (var l in o) s.push({ fileId: l, fileName: i[l], drawingSheets: o[l] });
                s = Glodon.Web.Lang.Utility.ClientHelper.sortByName(s, "fileName");
                for (var c = 0, r = s.length; c < r; c++) s[c].drawingSheets && (s[c].drawingSheets = Glodon.Web.Lang.Utility.ClientHelper.sortByName(s[c].drawingSheets, "viewInfo.name"));
                var d = createTree$6(e, s);
                t && t(d)
            })
        })
    },
    selectComponent$1 = function(e, t, n, o) {
        var i = Glodon.Web.Lang.Utility.ClientHelper.getIsDesktop(),
            a = e.getViewer();
        i || o || e.getPanel("ModelTree").hide(), n ? (a.clearSelectedComponents(), a.addSelectedComponentsById(t.selectData), a.zoomToSelectedComponents(), a.render()) : (a.clearSelectedComponents(), i || clearSection(e), a.render())
    },
    createTreeNode$7 = function e(t, n, o) {
        t.getViewer(), t.getRootElement();
        if (n) {
            var i = new Glodon.Bimface.UI.Tree.TreeNodeConfig;
            i.isChecked = !1, i.hasCheckbox = !1, i.selection = !1, i.className = "bf-tree", "assembly" != o && "group" != o && "instances" != o || (i.selection = !0);
            var a = new Glodon.Bimface.UI.Tree.TreeNode(i);
            if (a.type = o, "instances" == o) a.setData(n.id, n.id), a.selectData = n.elements;
            else if (a.setData(n.id, n.name), n.instances) {
                var r = [];
                n.instances.forEach(function(e) { r.push.apply(r, e.elements) }), a.selectData = r
            }
            var s, l, c, d;
            if (n.types && n.types.length > 0 && (s = n.types), l = "assemblys" == o ? "assembly" : "group", n.instances && n.instances.length > 0 && (c = n.instances, d = "instances"), s)
                for (var u = 0; u < s.length; u++) {
                    var p = e(t, s[u], l);
                    p.addEventListener("SelectionChanged", function(e, n, o) { selectComponent$1(t, e, n, o) }), a.addChildNode(p)
                }
            if (c)
                for (var u = 0; u < c.length; u++) {
                    var f = e(t, c[u], d);
                    f.addEventListener("SelectionChanged", function(e, n, o) { selectComponent$1(t, e, n, o) }), a.addChildNode(f)
                }
            return "groups" != o && "assemblys" != o || s || a.disabled(), "group" != o && "assembly" != o || c || a.disabled(), a
        }
    },
    createTree$7 = function(e, t, n) {
        e.getViewer();
        if (t && 0 != t.length) {
            var o = new Glodon.Bimface.UI.Tree.TreeNodeConfig;
            o.isChecked = !1, o.hasCheckbox = !1, o.selection = !1, o.className = "bf-tree bf-tree-empty";
            var i = new Glodon.Bimface.UI.Tree.TreeNode(o);
            i.expand();
            var a = new Glodon.Bimface.UI.Tree.TreeNode(o);
            a.setData("group", BimfaceLanguage.bf_panel_modelTree_group), a.expand();
            var r = new Glodon.Bimface.UI.Tree.TreeNode(o);
            r.setData("assembly", BimfaceLanguage.bf_panel_modelTree_assembly), r.expand();
            var s = new Glodon.Bimface.UI.Tree.Tree(i);
            i.addChildNode(a), i.addChildNode(r);
            for (var l = 0, c = t.groups.length; l < c; l++) a.addChildNode(createTreeNode$7(e, t.groups[l], "groups"));
            for (var l = 0, c = t.assemblies.length; l < c; l++) r.addChildNode(createTreeNode$7(e, t.assemblies[l], "assemblys"));
            return s
        }
    },
    getModelGroupTree = function(e, t) {
        e.getViewer().getModelGroup(function(n) {
            if (n) {
                var o = createTree$7(e, n);
                t && t(o)
            } else t && t()
        })
    },
    isDesktop = Glodon.Web.Lang.Utility.ClientHelper.getIsDesktop(),
    MEP_SYSTEM_LENGTH = 0,
    LINK_PATH = [],
    FILE_ID, createTreeNode$8 = function e(t) {
        if (t) {
            var n = new Glodon.Bimface.UI.Tree.TreeNodeConfig;
            n.isChecked = !1, n.hasCheckbox = !1, n.selection = !1, t.type || (n.selection = !0);
            var o = new Glodon.Bimface.UI.Tree.TreeNode(n);
            if (o.setData(t.name, t.name), t.type || (o.network = t.network, o.fileId = FILE_ID), t.items && t.items.length > 0)
                for (var i = 0, a = t.items.length; i < a; i++) o.addChildNode(e(t.items[i]));
            return o
        }
    },
    createTree$8 = function(e, t, n) {
        if (n && 0 != n.length) {
            var o = new Glodon.Bimface.UI.Tree.TreeNodeConfig;
            o.isChecked = !1, o.hasCheckbox = !1, o.selection = !1;
            var i;
            i = new Glodon.Bimface.UI.Tree.TreeNode(o), i.expand();
            for (var a = new Glodon.Bimface.UI.Tree.Tree(i), r = 0, s = n.length; r < s; r++) {
                FILE_ID = n[r].id;
                var l = createTreeNode$8(n[r]);
                l.addEventListener("SelectionChanged", function(n, o, i) { selectComponent$2(e, t, n, n, o, i) }), i.addChildNode(l)
            }
            return a
        }
    },
    selectComponent$2 = function(e, t, n, o, i) {
        var a = [];
        if (n.fileId)
            if (t._data.config && t._data.config["integrate-with-links"]) {
                var r = void 0;
                LINK_PATH.map(function(e) { if (e.fileId == n.fileId) return void(r = e.linkedBy) }), r.map(function(e) {
                    n.network.map(function(t) {
                        var n = e + "." + t;
                        a.push(n)
                    })
                })
            } else n.network.map(function(e) {
                var t = n.fileId + "." + e;
                a.push(t)
            });
        else a = n.network;
        isDesktop || i || e.getPanel("ModelTree").hide(), o ? (t.clearSelectedComponents(), t.addSelectedComponentsById(a), t.zoomToSelectedComponents(1)) : t.clearSelectedComponents(), t.render()
    },
    formatSystemData = function(e, t, n, o) {
        var i = e.reduce(function(e, t, n) { return e[t.systemCategory] = e[t.systemCategory] || {}, e[t.systemCategory][t.systemType] = e[t.systemCategory][t.systemType] || [], e[t.systemCategory][t.systemType].push({ name: t.name, network: Object.keys(t.network) }), e }, {}),
            a = [];
        for (var r in i) { a.push({ type: "systemCategory", name: r, items: [] }); for (var s in i[r]) a[a.length - 1].items.push({ type: "systemType", name: s, items: i[r][s] }) }
        var l = [];
        t ? l.push({ type: "fileId", id: t, name: n, items: a }) : l = a, o && o(l)
    },
    sortMepName = function e(t) { return t = Glodon.Web.Lang.Utility.ClientHelper.sortByName(t, "name"), t.map(function(n) { n.items && n.items.length > 0 && ("systemType" == n.type ? t = Glodon.Web.Lang.Utility.ClientHelper.sortByRules(n.items, "name") : e(n.items)) }), t },
    getMepData = function(e, t, n, o) {
        e.getMepSystem(t, function(e) { e.systems && formatSystemData(e.systems, t, n, function(e) { o && o(e) }) }, function() {
            MEP_SYSTEM_LENGTH--;
            var e = [];
            o && o(e)
        })
    },
    getMepTree = function(e, t, n, o) {
        var i, a;
        if ("integrateModel" == n) {
            var r = [];
            t.getFiles(function(n) {
                MEP_SYSTEM_LENGTH = n.length, n.forEach(function(n) {
                    i = n.fileId.toString(), a = n.fileName.toString(), LINK_PATH.push({ fileId: i, linkedBy: n.linkedBy }), getMepData(t, i, a, function(n) {
                        if (0 != n.length && r.push(n[0]), r.length == MEP_SYSTEM_LENGTH) {
                            var i = sortMepName(r),
                                a = createTree$8(e, t, i);
                            o && o(a)
                        }
                    })
                })
            })
        } else getMepData(t, "", "", function(n) {
            var i = sortMepName(n),
                a = createTree$8(e, t, i);
            o && o(a)
        })
    };
! function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application.UI.Panel"),
        t = Glodon.Web.Lang.Utility.ClientHelper.getIsDesktop(),
        n = function(e, n) {
            var o = (e.getViewer(), e.getRootElement(), new Glodon.Bimface.UI.Panel.PanelConfig);
            o.title = "楼层平面图", o.id = "DrawingPanel", o.css = t ? { right: "10px", top: "10px", width: "400px", height: "420px" } : { left: "0", top: "2.68em", width: "100%", bottom: 0, paddingTop: 0 };
            var i = new Glodon.Bimface.UI.Panel.Panel(o);
            return t || i.element.addClass("view-panel"), i.setHeader(n.name), i
        };
    e.DrawingPanel = n
}();
var clearState = function(e) {
        var t = e.getViewer(),
            n = e.getPanel("AreaPanel"),
            o = e.getPanel("DrawingPanel");
        clearSection(e), n && (n.close(), e.removePanel("AreaPanel")), o && o.hide(), t.hideAllRooms(), t.clearIsolation(), t.opaqueAllComponents()
    },
    showDrawingPanel = function(e, t, n, o) {
        var i = e.getViewer(),
            a = i._data.viewToken,
            r = e.getRootElement(),
            s = "integrateModel" == o;
        e.fileId = n.fileId, e.subViewer ? "Local" == BimfaceLoaderConfig.dataEnvType ? e.subViewer.addModel(BimfaceLoaderConfig.MetaData, n.id, s && n.fileId) : (e.getPanel("DrawingPanel").setTitleContent(n.name), e.subViewer.load(a, n.id, n.fileId)) : (BimfaceLoaderConfig.viewToken = a, BimfaceLoaderConfig.viewType = BimfaceViewTypeOption.DrawingView, BimfaceSDKLoader.load(BimfaceLoaderConfig, function(o) {
            var l, c, d = function(e, t) {
                    var n, o = function(n) {
                        if (0 != n.length) {
                            for (var o = 0; o < n.length; o++) {
                                var i = n[o].areas,
                                    a = n[o].height,
                                    r = n[o].elevation;
                                if (i && i.length > 0)
                                    for (var s = 0; s < i.length; s++)
                                        if (e == i[s].id) return void t(i[s], r, a);
                                var l = n[o].rooms;
                                if (l && l.length > 0)
                                    for (var c = 0; c < l.length; c++)
                                        if (e == l[c].id) return void t(l[c], r, a)
                            }
                            t()
                        }
                    };
                    n ? o(n) : i.getAreas(function(e) { n = e, o(n) })
                },
                u = i.getViewer(),
                p = !0;
            u.registerEventListener(CLOUD.EVENTS.ON_SELECTION_FAILED, function() {
                if (l) l.show();
                else {
                    var e = new Glodon.Bimface.UI.Tips.TipsConfig;
                    e.element = r, e.timeOut = 3e3, e.html = BimfaceLanguage.bf_panel_modelTree_componentNotFound, l = new Glodon.Bimface.UI.Tips.Tips(e)
                }
                p = !1
            });
            var f = Glodon.Bimface.Viewer.Viewer3DEvent;
            i.addEventListener(f.MissingDrawingElement, function() {
                if (c) c.show();
                else {
                    var e = new Glodon.Bimface.UI.Tips.TipsConfig;
                    e.element = r, e.timeOut = 3e3, e.html = BimfaceLanguage.bf_panel_modelTree_entityNotFound, c = new Glodon.Bimface.UI.Tips.Tips(e)
                }
            });
            var h = new Glodon.Bimface.Viewer.ViewerDrawingConfig;
            h.domElement = t.container;
            var m = new Glodon.Bimface.Viewer.ViewerDrawing(h);
            "Local" == BimfaceLoaderConfig.dataEnvType ? (o.fileId = n.fileId || "", BimfaceLoaderConfig.MetaData = o, m.addModel(o, n.id, s && o.fileId)) : m.load(a, n.id, n.fileId), m.addEventListener("ComponentsSelectionChanged", function(t) {
                if (t && t.length > 0) {
                    var n = t[0],
                        o = m.toModelId(n);
                    if (2 == t.length) {
                        var a = m.toLinkRevitId(t[0], t[1]),
                            r = a instanceof Object ? a.fileId : e.fileId,
                            l = a instanceof Object ? a.revitId : o;
                        o = r + "_" + l
                    } else s && (o = e.fileId + "_" + o);
                    var c = e.getPlugin("SectionBox"),
                        u = e.getPanel("SectionPanel");
                    d(o, function(t, n, a) {
                        if (i.showAllComponents(), t) {
                            t.boundary && i.setArea(t.boundary, n);
                            var r = i.getWorldBox(n - 20, n + 1500);
                            if (c) u && u.hideBox();
                            else {
                                var l = new Glodon.Bimface.Plugins.Section.SectionBoxConfig;
                                l.viewer = i, l.id = "SectionBox", c = new Glodon.Bimface.Plugins.Section.SectionBox(l), e.addPlugin(c)
                            }
                            c.setBox(r), c.hideBox(), i.setView(Glodon.Bimface.Viewer.ViewOption.Top)
                        } else s && (o = o.replace("_", ".")), c && (c.reset(), c.hideBox()), u && u.hideBox(), i.clearAllRooms(), i.setSelectedComponentsById([o]), p ? (i.isolateComponentsById([o], Glodon.Bimface.Viewer.IsolateOption.MakeOthersTranslucent), i.zoomToSelectedComponents()) : (i.clearIsolation(), p = !0);
                        i.render()
                    })
                }
            });
            var g = function(e) {
                if (e.elementId) {
                    var t = e.elementId,
                        n = m.fromRevitId(t),
                        o = m.fromLinkRevitId(e.fileId, t);
                    if (!(n || o && o.ids)) { var a = Glodon.Bimface.Viewer.Viewer3DEvent; return void i.getEventManager().fireEvent(a.MissingDrawingElement) }
                    o instanceof Object ? m.zoomToObjectWithBlock(o.blockId, o.ids) : n && m.zoomToObject(n)
                }
            };
            t.addEventListener("Sizable", function() { m.resize() }), t.addEventListener("Hide", function() { i.removeEventListener("ComponentsSelectionChanged", g), t.close(), e.removePanel("DrawingPanel"), delete e.subViewer }), i.addEventListener("ComponentsSelectionChanged", g), e.subViewer = m
        }))
    },
    createDrawingPanel = function(e, t, n) {
        var o = e.getRootElement(),
            i = e.getPanel("DrawingPanel");
        if (i) i.show();
        else {
            var i = new Glodon.Bimface.Application.UI.Panel.DrawingPanel(e, t);
            o.appendChild(i.element), i.bringToFront(), e.addPanel(i)
        }
        showDrawingPanel(e, i, t, n)
    };
! function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Lang.Utility.Dom"),
        t = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application.UI.Panel"),
        n = function(t, n) {
            var o = "component",
                i = t.getViewer(),
                a = (t.getRootElement(), i._manifest),
                r = i._data.modelType,
                s = e.create("div", "bf-tree-header"),
                l = Glodon.Web.Lang.Utility.ClientHelper.getIsDesktop(),
                c = [],
                d = void 0,
                u = void 0;
            if (a.Features.HasComponentStructure && c.push({ id: "component", name: BimfaceLanguage.bf_panel_modelTree_components }), (a.Features.HasGroup || a.Features.HasAssemble) && c.push({ id: "modelGroup", name: BimfaceLanguage.bf_panel_modelTree_modelGroup }), a.Features.HasMEPSystem && c.push({ id: "mepSystem", name: BimfaceLanguage.bf_panel_modelTree_mep }), a.Features.HasFileList && c.push({ id: "file", name: BimfaceLanguage.bf_panel_modelTree_files }), (a.Features.HasRoom || a.Features.HasArea) && c.push({ id: "area", name: BimfaceLanguage.bf_panel_modelTree_rooms1 }), a.Features.HasDrawing && c.push({ id: "drawing", name: BimfaceLanguage.bf_panel_modelTree_drawings }), l) {
                var p = new Glodon.Bimface.UI.Select.SelectConfig;
                p.className = "bf-select bf-select-tree", p.options = c, p.element = s, d = new Glodon.Bimface.UI.Select.Select(p), u = new Glodon.Bimface.UI.Panel.PanelConfig, u.title = BimfaceLanguage.bf_btn_modelTree, u.id = "ModelTree", u.css = { left: "10px", top: "10px", width: "300px", height: "416px" }, u.className = "bf-panel bf-modelTree-panel"
            } else {
                var f = new Glodon.Bimface.UI.Tabs.TabsConfig,
                    h = ["oneTab", "twoTabs", "threeTabs", "fourTabs", "fiveTabs", "sixTabs", "sevenTabs"],
                    m = c.length > 7 ? 6 : c.length - 1;
                f.className = "bf-tabs bf-tabs-tree " + h[m], f.options = c, f.element = s, d = new Glodon.Bimface.UI.Tabs.Tabs(f), u = new Glodon.Bimface.UI.Panel.PanelConfig, u.title = BimfaceLanguage.bf_btn_modelTree, u.id = "ModelTree", u.css = { left: 0, top: 0, width: "100%", height: "100%" }
            }
            var g;
            a.Features.HasLinkRelation && (g = e.create("label", "bf-tree-label bf-checkbox"), g.innerHTML = '<input type="checkbox" class="bf-checkbox-input" name="hover">\n        <span class="bf-checkbox-display"></span>\n        <span class="bf-checkbox-value">' + BimfaceLanguage.bf_panel_modelTree_fileLink + "</span>", s.appendChild(g), g.addEventListener("change", function() {
                var e = this.firstElementChild.checked;
                b.setTips(BimfaceLanguage.bf_panel_modelTree_loading, "loading");
                t.getToolbar("MainToolbar");
                b.clear(), clearSection(t), clearState(t), y(e ? "links" : "file")
            }));
            var b = new Glodon.Bimface.UI.Panel.Panel(u);
            b.setContainerHeader(s);
            var v = b.container;
            b.setTips(BimfaceLanguage.bf_panel_modelTree_loading, "loading"), l || b.addClass("tree-panel"), b.addEventListener("Hide", function() {
                n.show(), l ? "area" != o && "drawing" != o || clearState(t) : "area" != o && "component" != o && clearState(t);
                var e = t.getPanel("AreaPropertyPanel");
                e && e.hide(), i.render()
            }), "rvt-integrate" == i._data.workerType || "rvt-translate" == i._data.workerType ? getComponentsRvtTree(i, function(e) { "component" == o && (b.setTips(BimfaceLanguage.bf_panel_modelTree_noComponent), v.innerHTML = "", t.tree = e, v.appendChild(e.element)) }) : getComponentsTree(i, function(e) { "component" == o && (b.setTips(BimfaceLanguage.bf_panel_modelTree_noComponent), v.innerHTML = "", t.tree = e, v.appendChild(e.element)) });
            var y = function(e) {
                switch (o = e, e) {
                    case "component":
                        "rvt-integrate" == i._data.workerType || "rvt-translate" == i._data.workerType ? getComponentsRvtTree(i, function(e) { "component" == o && (b.setTips(BimfaceLanguage.bf_panel_modelTree_noComponent), t.tree = e, e && (v.innerHTML = "", v.appendChild(e.element))) }) : getComponentsTree(i, function(e) { "component" == o && (b.setTips(BimfaceLanguage.bf_panel_modelTree_noComponent), t.tree = e, e && (v.innerHTML = "", v.appendChild(e.element))) });
                        break;
                    case "modelGroup":
                        getModelGroupTree(t, function(e) { "modelGroup" == o && (b.setTips(BimfaceLanguage.bf_panel_modelTree_noData), t.tree = e, e && v.appendChild(e.element)) });
                        break;
                    case "mepSystem":
                        getMepTree(t, i, r, function(e) { "mepSystem" == o && (b.setTips(BimfaceLanguage.bf_panel_modelTree_noSystem), t.tree = e, e && v.appendChild(e.element)) });
                        break;
                    case "area":
                        getAreaTree(t, function(e) { "area" == o && (b.setTips(BimfaceLanguage.bf_panel_modelTree_noRoom), e && (t.tree = e, v.appendChild(e.element))) });
                        break;
                    case "file":
                        getFileTree(i, function(e) { "file" == o && (b.setTips(BimfaceLanguage.bf_panel_modelTree_noFile), t.tree = e, e && v.appendChild(e.element)) });
                        break;
                    case "links":
                        getLinkedTree(i, function(e) { "links" == o && (b.setTips(BimfaceLanguage.bf_panel_modelTree_noFile), t.tree = e, e && v.appendChild(e.element)) });
                        break;
                    case "drawing":
                        "integrateModel" == r ? getIntrgrateDrawing(i, function(e) {
                            "drawing" == o && (b.setTips(BimfaceLanguage.bf_panel_modelTree_noDrawing), t.tree = e, e && (v.appendChild(e.element), e.addEventListener("SelectionChanged", function(e, n) {
                                if (n) createDrawingPanel(t, e, "integrateModel");
                                else {
                                    var o = t.getPanel("DrawingPanel");
                                    o && t.subViewer && t.subViewer.isInitialized && o.hide()
                                }
                            })))
                        }) : getDrawingTree(i, function(e) {
                            "drawing" == o && (b.setTips(BimfaceLanguage.bf_panel_modelTree_noDrawing), t.tree = e, e && "true" == i._data.config.exportDrawing && (v.appendChild(e.element), e.addEventListener("SelectionChanged", function(e, n) {
                                if (n) createDrawingPanel(t, e, "singleModel");
                                else {
                                    var o = t.getPanel("DrawingPanel");
                                    o && t.subViewer && t.subViewer.isInitialized && o.hide()
                                }
                            })))
                        })
                }
                i.showAllComponents(), i.render()
            };
            return d.addEventListener("Change", function(e) {
                t.getToolbar("MainToolbar");
                b.setTips(BimfaceLanguage.bf_panel_modelTree_loading, "loading"), b.clear(), clearSection(t), clearState(t), g && ("file" == e.id ? g.style.display = "block" : (g.style.display = "none", g.firstElementChild.checked = !1)), y(e.id)
            }), b.addEventListener("Show", function() {
                if (t.tree && t.tree._selectionNode) {
                    var e = t.tree._selectionNode;
                    e.eventManager.fireEvent("SelectionChanged", e, !0, !0)
                }
            }), b
        };
    t.ModelTreePanel = n
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application.UI.Button"),
        t = function(e, t) {
            var n = e.getViewer(),
                o = e.getRootElement(),
                i = (Glodon.Bimface.Viewer.Viewer3D, Glodon.Bimface.UI.Control.ControlEvent),
                a = new Glodon.Bimface.UI.Button.ButtonConfig;
            a.id = "ModelTree", a.title = BimfaceLanguage.bf_btn_modelTree, a.className = "bf-button gld-bf-tree";
            var r = new Glodon.Bimface.UI.Button.Button(a);
            return r.addEventListener(i.Click, function() {
                t.hide();
                var n = e.getPanel("ModelTree");
                if (n) {
                    n.show();
                    var i = e.tree;
                    i._selectionNode
                } else {
                    var a = new Glodon.Bimface.Application.UI.Panel.ModelTreePanel(e, t);
                    o.appendChild(a.element), e.addPanel(a)
                }
            }), r
        };
    e.ModelTree = t
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application.UI.Button"),
        t = function(e, t) {
            var n = e.getViewer(),
                o = e.getRootElement(),
                i = (Glodon.Bimface.Viewer.Viewer3D, Glodon.Bimface.UI.Control.ControlEvent),
                a = new Glodon.Bimface.UI.Button.ButtonConfig;
            a.id = "MobileModelTree", a.title = "构件树", a.className = "bf-button gld-bf-tree";
            var r = new Glodon.Bimface.UI.Button.Button(a);
            return r.addEventListener(i.Click, function() {
                t.hide();
                var e = new Glodon.Bimface.Application.UI.Panel.ModelTreePanel(n, o, t, !0);
                o.appendChild(e.element)
            }), r
        };
    e.MobileModelTree = t
}();
var Environmental = { dev: "dev", build: "build" },
    CurrentEnv = Environmental.build;
CurrentEnv || (CurrentEnv = Environmental.dev);
var Env = CurrentEnv;
! function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application.UI.Panel"),
        t = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Lang.Utility.Dom"),
        n = "dev" == Env,
        o = function(e) {
            var o = e.getViewer(),
                i = new Glodon.Bimface.UI.Panel.PanelConfig,
                a = this,
                r = e.state;
            n = n ? o.isSupportSSAO() : n, this.viewer = o;
            var s;
            s = o._data.dataEnvType == BimfaceEnvOption.Local ? o._data.sdkPath : hostConfig.staticHost, i.title = BimfaceLanguage.bf_btn_settings, i.id = "Setting", i.css = { left: "50%", top: "50%", transform: "translate(-50%,-200px)", width: "330px", height: "auto" }, i.enableSizable = !1, i.className = "bf-panel bf-settings-panel";
            var l = { 1: { type: "multiple", direction: "0deg", colors: [{ color: new Glodon.Web.Graphics.Color(246, 250, 255, 1), stop: "10%" }, { color: new Glodon.Web.Graphics.Color(214, 224, 235, 1), stop: "70%" }] }, 2: { type: "skybox", skyBoxType: "CloudySky" }, 3: { type: "single", color: new Glodon.Web.Graphics.Color(214, 214, 213, 1) }, 4: { type: "single", color: new Glodon.Web.Graphics.Color(92, 92, 92, 1) }, 5: { type: "single", color: new Glodon.Web.Graphics.Color(0, 0, 0, 1) }, 6: { type: "single", color: new Glodon.Web.Graphics.Color(50, 71, 91, 1) } },
                c = new Glodon.Bimface.UI.Panel.Panel(i),
                d = t.create("form", "bf-setting"),
                u = t.create("div", "bf-setting-foot"),
                p = [{ id: "default", name: BimfaceLanguage.bf_panel_settings_interaction, title: BimfaceLanguage.bf_panel_settings_interaction }, { id: "effect", name: BimfaceLanguage.bf_panel_settings_effect, title: BimfaceLanguage.bf_panel_settings_effect }],
                f = new Glodon.Bimface.UI.Tabs.TabsConfig;
            f.className = "bf-setting-tabs", f.default = "default", f.options = p;
            var h = new Glodon.Bimface.UI.Tabs.Tabs(f),
                m = '<ul class="bf-setting-tab-default bf-show">\n        <li class="bf-setting-li">\n          <span class="bf-setting-name">' + BimfaceLanguage.bf_panel_settings_contextMenu + '</span>\n          <div class="bf-setting-value contextMenu">\n            <label class="bf-radio">\n              <input type="radio" class="bf-radio-input" name="menu" ' + (r.menu ? "checked" : "") + ' data-value=\'true\'>\n              <span class="bf-radio-display"></span>\n              <span class="bf-radio-value">' + BimfaceLanguage.bf_general_on + '</span>\n            </label>\n            <label class="bf-radio">\n              <input type="radio" class="bf-radio-input" name="menu" ' + (r.menu ? "" : "checked") + ' data-value=\'false\'>\n              <span class="bf-radio-display"></span>\n              <span class="bf-radio-value">' + BimfaceLanguage.bf_general_off + '</span>\n            </label>\n          </div>\n        </li>\n\n        <li class="bf-setting-li">\n          <span class="bf-setting-name">' + BimfaceLanguage.bf_panel_settings_orbitBtn + '</span>\n          <div class="bf-setting-value setMouseBehavior">\n            <label class="bf-radio">\n              <input type="radio" class="bf-radio-input" name="orbit" ' + (r.hobby ? "checked" : "") + '>\n              <span class="bf-radio-display"></span>\n              <span class="bf-radio-value">' + BimfaceLanguage.bf_panel_settings_leftOrbit + '</span>\n            </label>\n            <label class="bf-radio">\n              <input type="radio" class="bf-radio-input" name="orbit" ' + (r.hobby ? "" : "checked") + '>\n              <span class="bf-radio-display"></span>\n              <span class="bf-radio-value">' + BimfaceLanguage.bf_panel_settings_rightOrbit + '</span>\n            </label>\n          </div>\n        </li>\n\n        <li class="bf-setting-li">\n          <span class="bf-setting-name">' + BimfaceLanguage.bf_panel_settings_hover + '</span>\n          <div class="bf-setting-value mouseHover">\n            <label class="bf-checkbox">\n              <input type="checkbox" class="bf-checkbox-input" name="hover" ' + (r.hover ? "checked" : "") + '>\n              <span class="bf-checkbox-display"></span>\n              <span class="bf-checkbox-value">' + BimfaceLanguage.bf_panel_settings_hoverEffect + '</span>\n            </label>\n          </div>\n        </li>\n        <li class="bf-setting-li">\n          <span class="bf-setting-name">' + BimfaceLanguage.bf_panel_settings_zoomDir + '</span>\n          <div class="bf-setting-value mouseScroll">\n            <label class="bf-checkbox">\n              <input type="checkbox" class="bf-checkbox-input" name="scroll" ' + (r.scroll ? "checked" : "") + '>\n              <span class="bf-checkbox-display"></span>\n              <span class="bf-checkbox-value">' + BimfaceLanguage.bf_panel_settings_reverseDir + '</span>\n            </label>\n          </div>\n        </li>\n        </ul>\n\n        <ul class="bf-setting-tab-effect bf-scroll-bar">\n        <li class="bf-setting-select">\n          <span class="bf-setting-name">' + BimfaceLanguage.bf_panel_settings_effect + '</span>\n          <div id="modeSelect"></div>\n        </li>\n        <li class="bf-setting-li checkbox">\n          <span class="bf-setting-name">' + BimfaceLanguage.bf_panel_settings_border + '</span>\n          <div class="bf-setting-value setBorderLine">\n            <label class="bf-checkbox">\n              <input type="checkbox" class="bf-checkbox-input" name="borderline" ' + (r.borderLine ? "checked" : "") + '>\n              <span class="bf-checkbox-display"></span>\n              <span class="bf-checkbox-value">' + BimfaceLanguage.bf_panel_settings_displayBorder + '</span>\n            </label>\n          </div>\n        </li>\n        <li class="bf-setting-li ' + (n ? "" : "bf-setting-none") + '" >\n          <span class="bf-setting-name">SSAO：</span>\n          <div class="bf-setting-value enableSSAO">\n            <label class="bf-checkbox">\n              <input type="checkbox" class="bf-checkbox-input" name="SSAO" ' + (r.SSAO ? "checked" : "") + '>\n              <span class="bf-checkbox-display"></span>\n              <span class="bf-checkbox-value">' + BimfaceLanguage.bf_panel_setting_ssao + '</span>\n            </label>\n          </div>\n        </li>\n        <li class="bf-setting-li">\n          <span class="bf-setting-name">' + BimfaceLanguage.bf_panel_settings_exposure + '</span>\n          <div class="bf-setting-value bf-setting-range" id="exposure"></div>\n        </li>\n\n        <li class="bf-li-more">\n          <div class="bf-panel-more">\n            <span>' + BimfaceLanguage.bf_panel_settings_moreOpt + '</span>\n            <i class="bf-arrow"></i>\n          </div>\n        </li>\n        <div class="bf-more-list">\n          <li class="bf-setting-li">\n            <span class="bf-setting-name">' + BimfaceLanguage.bf_panel_settings_bgColor + '</span>\n            <div class="bf-color">\n              <div class="bf-color-item ' + (1 == r.backgroundColor ? "bf-color-select" : "") + '" data-value="1">\n                <span class="bf-color-node" style="background: linear-gradient(180deg, rgb(214, 224, 235) 10%, rgb(246, 250, 255) 70%)"></span>\n              </div>\n              <div class="bf-color-item ' + (2 == r.backgroundColor ? "bf-color-select" : "") + '" data-value="2">\n              <span class="bf-color-node" style="background: linear-gradient(180deg, rgb(214, 224, 235) 10%, rgb(246, 250, 255) 70%)">\n                <img src="' + s + '/resources/SkyBox/thumbnails/CloudySky.png"/>\n              </span>\n            </div>\n              <div class="bf-color-item ' + (3 == r.backgroundColor ? "bf-color-select" : "") + '" data-value="3">\n                <span class="bf-color-node" style="background:#d6d6d5;"></span>\n              </div>\n              <div class="bf-color-item ' + (4 == r.backgroundColor ? "bf-color-select" : "") + '" data-value="4">\n                <span class="bf-color-node" style="background:#5c5c5c;"></span>\n              </div>\n              <div class="bf-color-item ' + (5 == r.backgroundColor ? "bf-color-select" : "") + '" data-value="5">\n                <span class="bf-color-node" style="background:#000000;"></span>\n              </div>\n              <div class="bf-color-item ' + (6 == r.backgroundColor ? "bf-color-select" : "") + '" data-value="6">\n                <span class="bf-color-node" style="background:#32475b;"></span>\n              </div>\n            </div>\n          </li>\n          <li style="display:block" class="bf-setting-li checkbox">\n            <span class="bf-setting-name">' + BimfaceLanguage.bf_panel_settings_ambientLight + '</span>\n            <div class="bf-setting-value ambientLight">\n              <label class="bf-checkbox">\n                <input type="checkbox" class="bf-checkbox-input" name="ambientLight" ' + (r.ambientLight ? "checked" : "") + '>\n                <span class="bf-checkbox-display"></span>\n                <span class="bf-checkbox-value">' + BimfaceLanguage.bf_panel_settings_enableAbientLight + '</span>\n              </label>\n            </div>\n          </li>\n          <li style="display:block" class="bf-thumbnail bf-setting-margin bf-enable-list ' + (r.ambientLight ? "" : "bf-setting-disabled") + '">\n            <span class="bf-setting-name">' + BimfaceLanguage.bf_panel_settings_iblSel + '</span>\n            <div class="bf-thumbnail-value IBL-thumbnail">\n              <label class="' + ("Gray" == r.IBLName ? "bf-thumbnail-item selected" : "bf-thumbnail-item") + '" id="Gray">\n                <img  src="' + s + '/resources/IBL/thumbnails/Gray.png" />\n              </label>\n              <label class="' + ("HarborSunRise" == r.IBLName ? "bf-thumbnail-item selected" : "bf-thumbnail-item") + '" id="HarborSunRise">\n                <img src="' + s + '/resources/IBL/thumbnails/HarborSunRise.png" />\n              </label>\n              <label class="' + ("ParkingLot" == r.IBLName ? "bf-thumbnail-item selected" : "bf-thumbnail-item") + '" id="ParkingLot">\n                <img src="' + s + '/resources/IBL/thumbnails/ParkingLot.png" />\n              </label>\n              <label class="' + ("RiverSide" == r.IBLName ? "bf-thumbnail-item selected" : "bf-thumbnail-item") + '" id="RiverSide">\n                <img src="' + s + '/resources/IBL/thumbnails/RiverSide.png" />\n              </label>\n              <label class="' + ("Sunrise" == r.IBLName ? "bf-thumbnail-item selected" : "bf-thumbnail-item") + '" id="Sunrise">\n                <img src="' + s + '/resources/IBL/thumbnails/Sunrise.png" />\n              </label>\n              <label class="' + ("SunsetGrass" == r.IBLName ? "bf-thumbnail-item selected" : "bf-thumbnail-item") + '" id="SunsetGrass">\n                <img src="' + s + '/resources/IBL/thumbnails/SunsetGrass.png" />\n              </label>\n            </div>\n          </li>\n          <li style="display:block" class="bf-setting-li bf-setting-margin bf-enable-list ' + (r.ambientLight ? "" : "bf-setting-disabled") + '">\n            <span class="bf-setting-name">' + BimfaceLanguage.bf_panel_settings_iblBg + '</span>\n            <div class="bf-setting-value IBLBackground">\n              <label class="bf-checkbox">\n                <input type="checkbox" class="bf-checkbox-input" name="enableIBLBackground" ' + (r.enableIBLBackground ? "checked" : "") + '>\n                <span class="bf-checkbox-display"></span>\n                <span class="bf-checkbox-value">' + BimfaceLanguage.bf_panel_settings_iblBgDisplay + "</span>\n              </label>\n            </div>\n          </li>\n        </div>\n        </ul>",
                g = '<div class="bf-reset">\n          <span class="reset">' + BimfaceLanguage.bf_panel_settings_restore + "</span>\n        </div>";
            d.innerHTML = m, u.innerHTML = g, h.addEventListener("Change", function(e) { "default" == e.id ? (c.body.querySelector(".bf-setting-tab-default").addClass("bf-show"), c.body.querySelector(".bf-setting-tab-effect").removeClass("bf-show")) : (c.body.querySelector(".bf-setting-tab-default").removeClass("bf-show"), c.body.querySelector(".bf-setting-tab-effect").addClass("bf-show")) });
            for (var b = d.querySelectorAll(".contextMenu .bf-radio-input"), v = 0, y = b.length; v < y; v++) b[v].addEventListener("change", function() { a.viewer.toggleContextMenuDisplay() });
            for (var w = d.querySelectorAll(".setMouseBehavior .bf-radio-input"), C = 0, k = w.length; C < k; C++) ! function(e, t) {
                w[e].addEventListener("change", function() {
                    var t = e;
                    o.setUseLeftHandedInput(!t)
                })
            }(C);
            var B = d.querySelector(".mouseHover .bf-checkbox-input");
            B.addEventListener("change", function() {
                var e = o.isEnableHover();
                o.enableHover(!e)
            });
            var M = d.querySelector(".mouseScroll .bf-checkbox-input");
            M.addEventListener("change", function() { o.setReverseWheelDirection(this.checked) });
            var T = d.querySelector(".setBorderLine .bf-checkbox-input");
            T.addEventListener("change", function() { o.setBorderLineEnabled(this.checked), o.render() });
            var L = function(e) {
                    switch (e) {
                        case "low":
                            T.checked = !0, o.setBorderLineEnabled(!0), o.setMinimumFPS(8);
                            break;
                        case "high":
                            T.checked = !1, o.setBorderLineEnabled(!1), o.setMinimumFPS(30)
                    }
                    o.render()
                },
                x = [{ id: "low", name: BimfaceLanguage.bf_panel_settings_bestAppear }, { id: "high", name: BimfaceLanguage.bf_panel_settings_bestPerform }],
                P = new Glodon.Bimface.UI.Select.SelectConfig;
            P.className = "bf-select bf-select-mode", P.options = x;
            var S = new Glodon.Bimface.UI.Select.Select(P);
            S.setCurrentOption(r.effect), d.querySelector("#modeSelect").appendChild(S.element), S.addEventListener("Change", function(e) { L(e.id) });
            var I = d.querySelector(".enableSSAO .bf-checkbox-input");
            I.addEventListener("change", function() { o.enableSSAO(this.checked), o.render() });
            var _ = new Glodon.Web.Lang.Utility.Dom.range({ element: d.querySelector("#exposure"), min: -1, max: 1, step: .1, cur: r.exposure, change: function(e) { o.setExposureShift(e), o.render() } }),
                G = d.querySelector(".bf-panel-more"),
                E = d.querySelector(".bf-more-list");
            G.addEventListener("click", function() { G.toggleClass("bf-show-more"), E.toggleClass("bf-show") });
            for (var N = d.querySelectorAll(".bf-color .bf-color-item"), U = 0, A = N.length; U < A; U++) ! function(e, t) {
                N[e].addEventListener("click", function() {
                    for (var n = this.getAttribute("data-value"), i = l[n], a = i.type, r = 0; r < t; r++) N[r].removeClass("bf-color-select");
                    if (N[e].addClass("bf-color-select"), "single" == a) {
                        o.enableSkyBox(!1);
                        var s = i.color;
                        o.setBackgroundColor(s)
                    } else if ("multiple" == a) {
                        o.enableSkyBox(!1);
                        var c = i.direction,
                            d = i.colors;
                        o.setBackgroundColors(d, c)
                    } else o._opt.skyBoxType = i.skyBoxType, o.enableSkyBox(!0)
                })
            }(U, A);
            var D = d.querySelector(".ambientLight .bf-checkbox-input"),
                W = d.querySelectorAll(".bf-enable-list");
            D.addEventListener("change", function() {
                for (var e = this.checked, t = 0; t < W.length; t++) W[t].toggleClass("bf-setting-disabled", !e);
                if (e) o.setLightingMode(Glodon.Bimface.Viewer.LightingMode.IBL);
                else {
                    o.enableIBLBackground(!1), o.setLightingMode(Glodon.Bimface.Viewer.LightingMode.Phong);
                    var n = d.querySelector(".IBL-thumbnail .selected");
                    n && n.removeClass("selected"), H.checked = !1, o._opt.enableSky && o.enableSkyBox(!0), o.render()
                }
            });
            var V = d.querySelector(".IBL-thumbnail"),
                O = V.querySelectorAll(".bf-thumbnail-item");
            V.addEventListener("click", function(e) {
                if (o.isEnableIBLBackground() && "IMG" == e.target.nodeName)
                    for (var t = e.target.parentNode, n = t.id, i = 0, a = O.length; i < a; i++) O[i].removeClass("selected"), O[i] == t && (t.addClass("selected"), o.setLightingMode(Glodon.Bimface.Viewer.LightingMode.IBL), o.loadIBLScene(n, H.checked))
            });
            var H = d.querySelector(".IBLBackground .bf-checkbox-input");
            return H.addEventListener("change", function() {
                if (!o.isEnableIBLBackground()) return void(this.checked = !1);
                var e = this.checked;
                o.enableIBLBackground(e), !e && o._opt.enableSkyBox && o.enableSkyBox(!0), o.render()
            }), u.querySelector(".reset").addEventListener("click", function() {
                h.setCurrentOption("default"), b[r.menu ? 0 : 1].checked = !0, o.toggleContextMenuDisplay(r.menu), w[0].click(), B.checked = r.hover, o.enableHover(r.hover), M.checked = r.scroll, o.setReverseWheelDirection(r.scroll), S.setCurrentOption(r.effect), L(r.effect), T.checked = r.borderLine, o.setBorderLineEnabled(r.borderLine), o.enableSSAO(!1), I.checked = !1, _.setProgress(r.exposure), o.setExposureShift(r.exposure), G.removeClass("bf-show-more"), E.removeClass("bf-show"), N[0].click(), D.checked != r.ambientLight && D.click();
                for (var e = 0, t = O.length; e < t; e++) O[e].removeClass("selected"), O[e].id == r.IBLName && O[e].addClass("selected");
                H.checked = r.enableIBLBackground, o.loadIBLScene(r.IBLName, r.enableIBLBackground), o.render()
            }), c.setContainerHeader(h.element), c.container.appendChild(d), c.container.appendChild(u), c
        };
    e.SettingPanel = o
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application.UI.Button"),
        t = function(e, t) {
            var n = e.getViewer(),
                o = e.getRootElement(),
                i = n instanceof Glodon.Bimface.Viewer.Viewer3D,
                a = Glodon.Bimface.UI.Control.ControlEvent,
                r = Glodon.Bimface.Viewer.Viewer3DEvent;
            if (!i) return void console.log("The API is not supported on this viewer.");
            var s = new Glodon.Bimface.UI.Button.ButtonConfig;
            s.id = "Setting", s.title = BimfaceLanguage.bf_btn_settings, s.className = "bf-button gld-bf-settings";
            var l = new Glodon.Bimface.UI.Button.ToggleButton(s);
            return l.addEventListener(a.StateChange, function(t) {
                var i = e.getPanel("Setting");
                t ? i ? i.show() : (i = new Glodon.Bimface.Application.UI.Panel.SettingPanel(e), i.addEventListener("Hide", function() { l.setCheckedState(!1) }), o.appendChild(i.element), i.bringToFront(), e.addPanel(i)) : i.hide(), n.getEventManager().fireEvent(r.ButtonOnToolbarClicked, { id: s.id, isChecked: t })
            }), l
        };
    e.Setting = t
}();
var createRoutePanel = function(e, t) {
    var n = 0,
        o = !1,
        i = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Lang.Utility.Dom"),
        a = i.create("div", "bf-route-form"),
        r = i.create("div", "bf-route-title"),
        s = i.create("span", "bf-route-add");
    s.innerHTML = '<i class="bf-icon-add"></i><span>' + BimfaceLanguage.bf_panel_nav_addKeyframe + "</span>";
    var l = i.create("span", "bf-route-clear");
    l.innerText = BimfaceLanguage.bf_panel_nav_clearKeyframe, r.appendChild(s), r.appendChild(l);
    var c = i.create("div", "bf-route-panel-tips");
    c.innerText = BimfaceLanguage.bf_panel_nav_addHere;
    var d = i.create("ul", "bf-route-list bf-scroll-bar"),
        u = i.create("div", "bf-route-foot"),
        p = i.create("div", "bf-route-time"),
        f = i.create("span", "bf-route-time-name");
    f.innerText = BimfaceLanguage.bf_panel_nav_time;
    var h = i.create("input", "bf-route-number");
    h.setAttribute("type", "number"), h.value = 20, h.setAttribute("min", "1"), h.setAttribute("max", "120");
    var m = i.create("span", "bf-route-tips");
    m.innerText = BimfaceLanguage.bf_panel_nav_timeInput, p.appendChild(f), p.appendChild(h), p.appendChild(m);
    var g = i.create("div", "bf-route-control bf-route-disabled");
    g.innerHTML = '<i class="bf-icon-play"></i><span>' + BimfaceLanguage.bf_panel_nav_playnav + "</span>", u.appendChild(p), u.appendChild(g), a.appendChild(r), a.appendChild(c), a.appendChild(d), a.appendChild(u);
    var b = !1;
    s.addEventListener("click", function() {
        if (!o) {
            c.style.display = "none";
            var a = i.create("div", "bf-route-li"),
                r = i.create("div", "bf-route-box"),
                s = i.create("span", "bf-route-button");
            s.innerText = BimfaceLanguage.bf_general_delete;
            var l = i.create("span", "bf-route-button bf-route-play");
            l.innerText = BimfaceLanguage.bf_panel_nav_play;
            var u = i.create("span", "bf-route-button");
            u.innerText = BimfaceLanguage.bf_panel_nav_position;
            var p = i.create("span", "bf-route-name");
            p.innerText = "" + BimfaceLanguage.bf_panel_nav_keyframe + n, a.camera = t.getCameraStatus(), a.keyFrame = e.addKeyFrame(), n++, r.appendChild(l), r.appendChild(u), r.appendChild(s), a.appendChild(p), a.appendChild(r), a.addEventListener("click", function(e) { e.target != s && (b ? b == a ? (b.removeClass("bf-selected"), b = !1) : (b.removeClass("bf-selected"), a.addClass("bf-selected"), b = a) : (a.addClass("bf-selected"), b = a)) }), l.addEventListener("click", function(e) { v(a.keyFrame.id) }), u.addEventListener("click", function(e) { t.setCameraStatus(a.camera) }), b ? b.after(a) : d.appendChild(a), d.childElementCount >= 2 && g.removeClass("bf-route-disabled"), s.addEventListener("click", function(e) { b == a && (b = null), d.removeChild(a), d.childElementCount < 2 && g.addClass("bf-route-disabled"), 0 == d.childElementCount && (c.style.display = "block") })
        }
    }), l.addEventListener("click", function() { o || (e.clearKeyFrames(), d.innerHTML = "", b = null, g.addClass("bf-route-disabled"), c.style.display = "block") });
    var v = function(t) {
        var n = parseFloat(h.value);
        if (n && n > 0) {
            for (var i = [], a = 0; a < d.childElementCount; a++) i.push(d.children[a].keyFrame);
            e.setKeyFrames(i), e.setWalkthroughTime(n), e.play(t), d.addClass("bf-route-disabled"), l.addClass("bf-route-disabled"), h.setAttribute("disabled", !0), g.innerHTML = '<i class="bf-icon-stop"></i><span>' + BimfaceLanguage.bf_panel_nav_stop + "</span>", o = !0
        } else console.log("漫游时间必须为大于0的整数。")
    };
    return g.addEventListener("click", function() { this.hasClass("bf-route-disabled") || (o ? (d.removeClass("bf-route-disabled"), l.removeClass("bf-route-disabled"), h.removeAttribute("disabled"), this.innerHTML = '<i class="bf-icon-play"></i><span>' + BimfaceLanguage.bf_panel_nav_playnav + "</span>", e.stop()) : v()) }), e.stopCallback(function() { d.removeClass("bf-route-disabled"), l.removeClass("bf-route-disabled"), h.removeAttribute("disabled"), g.innerHTML = '<i class="bf-icon-play"></i><span>' + BimfaceLanguage.bf_panel_nav_playnav + "</span>", o = !1 }), a
};
! function() {
    var e = (Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Lang.Utility.Dom"), Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application.UI.Panel")),
        t = function(e) {
            var t = e.getViewer(),
                n = new Glodon.Bimface.UI.Panel.PanelConfig;
            n.title = BimfaceLanguage.bf_panel_nav_walkthrough, n.id = "WalkRoutePanel", n.css = { right: "10px", top: "10px", width: "300px", height: "354px" }, n.enableSizable = !1;
            var o = new Glodon.Bimface.UI.Panel.Panel(n),
                n = new Glodon.Bimface.Plugins.Walkthrough.WalkthroughConfig;
            n.viewer = t;
            var i = new Glodon.Bimface.Plugins.Walkthrough.Walkthrough(n),
                a = createRoutePanel(i, t);
            return o.container.appendChild(a), o.addEventListener("Hide", function() { i.stop() }), o
        };
    e.WalkRoutePanel = t
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application.UI.Panel"),
        t = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Lang.Utility.Dom"),
        n = function(e) {
            function n() {
                var e = d[c];
                k.innerText = e + "X", s.setFlySpeedRate(parseFloat(e))
            }

            function o() { c < d.length - 1 && (c++, n()) }

            function i() { c && (c--, n()) }

            function a(e) {
                var t, n = v.querySelector(".gld-bf-map"),
                    o = document.querySelector(".gld-bf-min-");
                o && o.click(), !0 === e ? (t = !0, l.addClass("walker")) : t = !g._checked, t ? n.addClass("active") : n.removeClass("active"), g.setCheckedState(t)
            }

            function r() {
                var t = this,
                    n = v.querySelectorAll(".bf-walk-label"),
                    o = e.getPanel("WalkRoutePanel");
                if (t.hasClass("active")) { t.removeClass("active"), o && o.hide(); for (var i = 0; i < n.length; i++) n[i].removeClass("bf-walk-disabled"), B.disabled = !1, M.disabled = !1 } else {
                    if (t.addClass("active"), o) o.show();
                    else {
                        var a = new Glodon.Bimface.Application.UI.Panel.WalkRoutePanel(e);
                        a.addEventListener("Hide", function() {
                            t.removeClass("active");
                            for (var e = 0; e < n.length; e++) n[e].removeClass("bf-walk-disabled"), B.disabled = !1, M.disabled = !1;
                            B.disabled = !1, M.disabled = !1
                        }), l.appendChild(a.element), e.addPanel(a)
                    }
                    for (var i = 0; i < n.length; i++) n[i].addClass("bf-walk-disabled");
                    B.checked = !1, B.disabled = !0, s.enableGravity(!1), M.checked = !1, M.disabled = !0, s.enableHitDetection(!1)
                }
            }
            var s = e.getViewer(),
                l = e.getRootElement(),
                c = 0,
                d = ["1", "2", "4", "8", "16"],
                u = (s.getViewer(), Glodon.Bimface.UI.Control.ControlEvent),
                p = "sv_SE" === BimfaceLanguage.name ? "565px" : "530px",
                f = { element: l, className: "bf-panel bf-walk-panel bf-walkthrough-panel", id: "WalkPanel", css: { left: "50%", bottom: "10px", width: p, minWidth: 0, minHeight: 0, height: "50px" }, title: "", enableSizable: !1 },
                h = e.getToolbar("MainToolbar"),
                m = "",
                g = h.getControl("Map");
            g ? (m = '<div class="bf-button gld-bf-map active"></div>', g.addEventListener(u.StateChange, function(e) { if (!e) { v.querySelector(".gld-bf-map").removeClass("active") } })) : f.css.width = "461px";
            var b = new Glodon.Bimface.Application.Panel(f),
                v = t.create("div", "bf-person"),
                y = '<div class="bf-walk-button">' + m + '</div>\n                <div class="bf-walk-button"><div class="bf-button gld-bf-route" title="' + BimfaceLanguage.bf_panel_nav_walkthrough + '"></div></div>\n                      <div class="bf-walk-speed">\n                        <span class="bf-walk-name">' + BimfaceLanguage.bf_panel_nav_speed + '</span>\n                        <span class="gld-bf-minus speedBtn"></span><span class="speedNum">' + d[c] + ' X</span>\n                        <span class="gld-bf-add speedBtn"></span>\n                      </div>\n                      <label class="bf-checkbox bf-walk-label">\n                        <input type="checkbox" class="bf-checkbox-input bf-walk-gravity" name="gravity"}>\n                        <span class="bf-checkbox-display"></span>\n                        <span class="bf-checkbox-value">' + BimfaceLanguage.bf_panel_nav_gravity + '</span>\n                      </label>\n                      <label class="bf-checkbox bf-walk-label">\n                        <input type="checkbox" class="bf-checkbox-input bf-walk-collision" name="collision"}>\n                        <span class="bf-checkbox-display"></span>\n                        <span class="bf-checkbox-value">' + BimfaceLanguage.bf_panel_nav_collision + '</span>\n                      </label>\n                      <span class="bf-walk-exit">' + BimfaceLanguage.bf_general_exit + "</span>";
            v.innerHTML = y, v.querySelector(".gld-bf-add").addEventListener("click", o), v.querySelector(".gld-bf-minus").addEventListener("click", i), g && v.querySelector(".gld-bf-map").addEventListener("click", a), v.querySelector(".gld-bf-route").addEventListener("click", r), b.container.appendChild(v);
            var w = new Glodon.Bimface.UI.Tips.TipsConfig;
            w.element = l, w.html = "<div>\n                            " + BimfaceLanguage.bf_panel_nav_walkTips1 + '\n                            <span class="bf-tips-key">W</span>\n                            <span class="bf-tips-key">A</span>\n                            <span class="bf-tips-key">S</span>\n                            <span class="bf-tips-key">D</span>\n                            ' + BimfaceLanguage.bf_panel_nav_walkTips2 + '\n                            <span class="bf-tips-key">Q</span>\n                            <span class="bf-tips-key">E</span>\n                            ' + BimfaceLanguage.bf_panel_nav_walkTips3 + "\n                            </div>";
            var C = new Glodon.Bimface.UI.Tips.Tips(w);
            CLOUD.EditorConfig.NoKey && C.hide(), v.querySelector(".bf-walk-exit").addEventListener("click", function() { b.hide(); for (var t = e.getToolbars(), n = 0; n < t.length; n++) t[n].show() }), b.addEventListener("Close", function() { C.close() }), b.addEventListener("Hide", function() {
                C.hide(), l.removeClass("walker");
                var t = e.getPanel("WalkRoutePanel");
                t && t.hide()
            }), b.addEventListener("Show", function() { CLOUD.EditorConfig.NoKey || C.show(), l.addClass("walker"), g && a(!0) });
            var k = v.querySelector(".speedNum"),
                B = v.querySelector(".bf-walk-gravity");
            B.addEventListener("change", function() { s.enableGravity(this.checked) });
            var M = v.querySelector(".bf-walk-collision");
            return M.addEventListener("change", function() { s.enableHitDetection(this.checked) }), g && a(!0), b
        };
    e.WalkPanel = n
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application.UI.Panel"),
        t = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Lang.Utility.Dom"),
        n = function(e) {
            function n() {
                var e = v[b];
                L.innerText = e + "X", m.setFlySpeedRate(parseFloat(e))
            }

            function o(e) { e.preventDefault(), e.stopPropagation(), b < v.length - 1 && (b++, n()) }

            function i(e) { e.preventDefault(), e.stopPropagation(), b && (b--, n()) }

            function a(e) { e.preventDefault(), e.stopPropagation(), y.moveTo(CLOUD.MoveDirection.UP, 1) }

            function r(e) { e.preventDefault(), e.stopPropagation(), y.moveTo(CLOUD.MoveDirection.DOWN, 1) }

            function s() { x = T.getBoundingClientRect(), P = [x.left + .5 * x.width, x.top + .5 * x.height], S = T.querySelector(".ball"), _ = y.getCurrentEditor(), G = { panelRadius: x.width / 2, radiusPow: Math.pow(x.width / 2, 2), smallRadiusPow: Math.pow((x.width - S.offsetWidth) / 2, 2), up: [(x.width - S.offsetWidth) / 2, 0], down: [(x.width - S.offsetWidth) / 2, x.height - S.offsetHeight], left: [0, (x.height - S.offsetHeight) / 2], right: [x.width - S.offsetWidth, (x.height - S.offsetHeight) / 2], refresh: [(x.width - S.offsetWidth) / 2, (x.height - S.offsetHeight) / 2] } }

            function l(e) { e.preventDefault(), E = e.touches[0], p() }

            function c(e) { e.preventDefault(), E = e.touches[0], p() }

            function d(e) { f("refresh"), u() }

            function u() { y.moveTo(CLOUD.MoveDirection.FORWARD, 1, !1), y.moveTo(CLOUD.MoveDirection.BACK, 1, !1), y.moveTo(CLOUD.MoveDirection.UP, 1, !1), y.moveTo(CLOUD.MoveDirection.DOWN, 1, !1) }

            function p() {
                var e = E.pageY - P[1],
                    t = E.pageX - P[0];
                I = e / t, f(I > 0 ? I > 2.2 ? e > 0 ? "down" : "up" : e > 0 ? "right" : "left" : I < -2.2 ? e > 0 ? "down" : "up" : e > 0 ? "left" : "right")
            }

            function f(e) {
                switch (u(), e) {
                    case "up":
                        y.moveTo(CLOUD.MoveDirection.FORWARD, 1), y.render();
                        break;
                    case "down":
                        y.moveTo(CLOUD.MoveDirection.BACK, 1), y.render();
                        break;
                    case "left":
                        _._doRotate({ x: -1, y: 0 });
                        break;
                    case "right":
                        _._doRotate({ x: 1, y: 0 })
                }
                "refresh" == e ? h() : h(E)
            }

            function h(e) {
                if (e) {
                    var t = e.pageX - P[0],
                        n = e.pageY - P[1],
                        o = Math.pow(t, 2),
                        i = Math.pow(n, 2),
                        a = i + o;
                    if (Math.sqrt(a) + S.offsetWidth / 2 < G.panelRadius) var r = e.pageY - S.offsetHeight / 2 - x.top,
                        s = e.pageX - S.offsetWidth / 2 - x.left;
                    else {
                        var l = Math.sqrt(G.smallRadiusPow * o / a),
                            c = Math.sqrt(G.smallRadiusPow * i / a);
                        s = e.pageX - P[0] > 0 ? G.panelRadius + l - S.offsetWidth / 2 : G.panelRadius - l - S.offsetWidth / 2, r = e.pageY - P[1] > 0 ? G.panelRadius + c - S.offsetWidth / 2 : G.panelRadius - c - S.offsetWidth / 2
                    }
                    S.style.left = s + "px", S.style.top = r + "px"
                } else S.style.left = G.refresh[0] + "px", S.style.top = G.refresh[1] + "px"
            }
            var m = e.getViewer(),
                g = e.getRootElement(),
                b = 0,
                v = ["1", "2", "4", "8", "16"],
                y = m.getViewer(),
                w = { element: g, className: "bf-panel bf-walk-panel", id: "WalkPanel", css: { minWidth: "auto", minHeight: "auto", bottom: "0.12em", width: "100%", height: "3.5em" }, title: "", enableSizable: !1 },
                C = new Glodon.Bimface.Application.Panel(w),
                k = t.create("div", "bf-quit");
            k.innerHTML = '<span class="bf-walk-exit">' + BimfaceLanguage.bf_general_exit + "</span><span class='close'></span>", g.appendChild(k), C.addEventListener("Show", function() { k.style.display = "block" });
            var B = t.create("div", "bf-person"),
                M = '<div class="person-btns">\n\n                      <span class="gld-bf-minus speedBtn"></span>\n                      <span class="speedNum">' + v[b] + ' X</span>\n                      <span class="gld-bf-add speedBtn"></span>\n                      <label class="bf-checkbox bf-walk-gravity">\n                        <input type="checkbox" class="bf-checkbox-input bf-walk-input" name="gravity"}>\n                        <span class="bf-checkbox-display"></span>\n                        <span class="bf-checkbox-value">' + BimfaceLanguage.bf_panel_nav_gravity + '</span>\n                      </label>\n                      <div class=\'jump\'>\n\n                        <span class="bf-button gld-bf-up  arrow-up"></span>\n                        <span class="bf-button gld-bf-down  arrow-down"></span>\n                      </div>\n                    </div>',
                T = t.create("div", "controllerPanel");
            B.innerHTML = M, T.innerHTML = '<div class="ball">\n\n                    </div>', T.addEventListener("touchstart", l), T.addEventListener("touchmove", c), T.addEventListener("touchend", d), B.querySelector(".gld-bf-add").addEventListener("click", o), B.querySelector(".gld-bf-minus").addEventListener("click", i), B.querySelector(".arrow-up").addEventListener("touchstart", a), B.querySelector(".arrow-down").addEventListener("touchstart", r), B.querySelector(".arrow-up").addEventListener("touchend", u), B.querySelector(".arrow-down").addEventListener("touchend", u), C.container.appendChild(B), C.element.appendChild(T), k.addEventListener("click", function() { C.hide(), k.style.display = "none"; for (var t = e.getToolbars(), n = 0; n < t.length; n++) t[n].show() });
            var L = B.querySelector(".speedNum");
            B.querySelector(".bf-walk-input").addEventListener("change", function() { m.enableGravity(this.checked) });
            var x, P, S, I, _, G, E;
            return s(), window.onresize = function() { s() }, C
        };
    e.WalkMobilePanel = n
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application.UI.Button"),
        t = Glodon.Web.Lang.Utility.ClientHelper.getIsDesktop(),
        n = function(e, n) {
            var o = e.getViewer(),
                i = e.getRootElement(),
                a = o instanceof Glodon.Bimface.Viewer.Viewer3D,
                r = Glodon.Bimface.UI.Control.ControlEvent,
                s = Glodon.Bimface.Viewer.Viewer3DEvent;
            if (!a) return void console.log("The API is not supported on this viewer.");
            var l = new Glodon.Bimface.UI.Button.ButtonConfig;
            l.id = "Walk", l.title = BimfaceLanguage.bf_btn_nav, l.className = "bf-button gld-bf-firstperson";
            var c, d, u = new Glodon.Bimface.UI.Button.ToggleButton(l);
            o.getViewer();
            return u.addEventListener(r.StateChange, function() {
                if (o.getEventManager().fireEvent(s.ButtonOnToolbarClicked, { id: l.id, isChecked: u.isChecked() }), u.isChecked()) {
                    var a = n.getControl("RectangleSelect");
                    a && a.setCheckedState(!1), o.setNavigationMode(Glodon.Bimface.Viewer.NavigationMode3D.Select);
                    var r = n.getControl("Measure");
                    r && r.setCheckedState(!1), hideSectionPanel(e);
                    var p = n.getControl("RectangleSelect");
                    p && p.setCheckedState(!1);
                    var f = n.getControl("Property");
                    f && f.setCheckedState(!1);
                    var h = n.getControl("Information");
                    h && h.setCheckedState(!1);
                    var m = n.getControl("Setting");
                    m && m.setCheckedState(!1), e.modelTreePanel && e.modelTreePanel.hide();
                    for (var g = e.getToolbars(), b = e.getPanels(), v = 0; v < b.length; v++) "WalkPanel" != b[v].id && "MapPanel" != b[v].id && b[v].hide();
                    for (var y = 0; y < g.length; y++) g[y].hide();
                    if (d = !!document.querySelector(".bf-house canvas"), o.setNavigationMode(Glodon.Bimface.Viewer.NavigationMode3D.Walk), o.hideViewHouse(), o.setSelectedComponentsById(), o.render(), c) return void c.show();
                    c = t ? new Glodon.Bimface.Application.UI.Panel.WalkPanel(e) : new Glodon.Bimface.Application.UI.Panel.WalkMobilePanel(e), c.addEventListener("Hide", function() { u.setCheckedState(!1) }), i.appendChild(c.element), c.bringToFront(), e.addPanel(c)
                } else {
                    for (var g = e.getToolbars(), y = 0; y < g.length; y++) g[y].show();
                    o.setNavigationMode(Glodon.Bimface.Viewer.NavigationMode3D.PickWithRect), d && o.showViewHouse(), c.hide()
                }
            }), u
        };
    e.Walk = n
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application.UI.Button"),
        t = function(e, t) {
            var n = e.getViewer(),
                o = n instanceof Glodon.Bimface.Viewer.Viewer3D,
                i = Glodon.Bimface.UI.Control.ControlEvent;
            if (!o) return void console.log("The API is not supported on this viewer.");
            var a = new Glodon.Bimface.UI.Button.ButtonConfig;
            a.id = "Interactive", a.title = "交互", a.inheritTitle = !0;
            var r = new Glodon.Bimface.UI.Button.ComboBox(a),
                s = new Glodon.Bimface.UI.Button.ButtonConfig;
            s.id = "OrbitPoint", s.title = "绕构件旋转", s.className = "bf-button gld-bf-orbit";
            var l = new Glodon.Bimface.UI.Button.ComboBoxOptionButton(s),
                c = new Glodon.Bimface.UI.Button.ButtonConfig;
            c.id = "OrbitCamera", c.title = "绕相机旋转", c.className = "bf-button gld-bf-pan";
            var d = new Glodon.Bimface.UI.Button.ComboBoxOptionButton(c),
                u = new Glodon.Bimface.UI.Button.ButtonConfig;
            u.id = "OrbitCamera", u.title = "绕相机旋转", u.className = "bf-button gld-bf-zoom";
            var p = new Glodon.Bimface.UI.Button.ComboBoxOptionButton(u);
            return r.addControl(l), r.addControl(d), r.addControl(p), r.addEventListener(i.Change, function(e) {}), r.addEventListener(i.Click, function(e) {
                var n = t.getControl("ViewButton");
                n && n.recover()
            }), r
        };
    e.Interactive = t
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Lang.Utility.Dom"),
        t = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application.UI.Panel"),
        n = function(t) {
            var n = t.getViewer(),
                o = new Glodon.Bimface.UI.Panel.PanelConfig;
            o.title = "", o.id = "MapPanel", o.css = { left: "12px", bottom: "10px", width: "300px", height: "240px" }, o.className = "bf-panel bf-map bf-map-panel", o.enableSizable = !1;
            var i = new Glodon.Bimface.UI.Panel.Panel(o),
                a = Glodon.Bimface.Plugins.Map.MapEvents,
                r = e.create("div", "bf-map-header"),
                s = e.create("div", "bf-map-move"),
                l = e.create("div", "bf-map-foot"),
                c = e.create("div", "bf-map-container"),
                d = e.create("i", "bf-map-fit-panel-min gld-bimface gld-bf-fitpanel"),
                u = e.create("i", "bf-map-screen gld-bimface gld-bf-max-"),
                p = e.create("div", "bf-map-right");
            l.innerHTML = '<div class="bf-map-left"><i class="gld-bimface gld-bf-information"></i><span>' + BimfaceLanguage.bf_panel_map_cut + "</span></div>", l.appendChild(p);
            var f = new Glodon.Bimface.Plugins.Map.MapConfig;
            f.viewer = n, f.domElement = c, f.width = 298, f.height = 198, f.id = "Map";
            var h = new Glodon.Bimface.Plugins.Map.Map(f);
            t.addPlugin(h);
            var m = h.getFloorList(),
                g = new Glodon.Bimface.UI.Select.SelectConfig;
            g.className = "bf-select bf-select-map";
            var b = h.getDefaultFloorPlane(),
                v = m.getObjectByAttribute("name", b);
            0 != v && (g.default = v.id), g.options = m, g.element = r, g.prefix = BimfaceLanguage.bf_panel_map_level;
            var y = new Glodon.Bimface.UI.Select.Select(g);
            y.addEventListener("Change", function(e) { h.showFloorById(e.id) }), u.addEventListener("click", function() { i.showAsFull(u.hasClass("gld-bf-max-")), x && x.hide() }), d.addEventListener("click", function() { h.clearZoomAndPan(), d.getCss().display = "none" });
            var w = function(e) {
                    e.getToolbar("MainToolbar");
                    clearSection(e), e.tree && e.tree.clear(!0), n.restoreDefault()
                },
                C = new Glodon.Bimface.UI.Button.ButtonConfig;
            C.id = "mapIsolate", C.title = BimfaceLanguage.bf_panel_map_isolation, C.className = "bf-map-button bf-map-isolate";
            var k = new Glodon.Bimface.UI.Button.Button(C);
            k.setHtml(BimfaceLanguage.bf_panel_map_isolation), k.addEventListener("Click", function() {
                w(t);
                var e = h.getBoundingBox();
                n.isolateByBox(e, Glodon.Bimface.Viewer.IsolateOption.HideOthers), n.zoomToBoundingBox(e), h.clear(), x.hide(), n.render()
            });
            var B = new Glodon.Bimface.UI.Button.ButtonConfig;
            B.id = "mapSection", B.title = BimfaceLanguage.bf_panel_map_section, B.className = "bf-map-button bf-map-section";
            var M = new Glodon.Bimface.UI.Button.Button(B);
            M.setHtml(BimfaceLanguage.bf_panel_map_section), M.addEventListener("Click", function() {
                var e = h.getBoundingBox();
                updateSection(t, e), h.clear(), x.hide(), n.render()
            });
            var T = new Glodon.Bimface.UI.Button.ButtonConfig;
            T.id = "mapCancel", T.title = BimfaceLanguage.bf_general_cancel, T.className = "bf-map-button bf-map-cancel";
            var L = new Glodon.Bimface.UI.Button.Button(T);
            L.setHtml(BimfaceLanguage.bf_general_cancel), L.addEventListener("Click", function() { h.clear(), x.hide() });
            var x;
            return h.addEventListener(a.Zoom, function(e) { 1 == e.zoomFactor ? d.getCss().display = "none" : d.getCss().display = "block" }), h.addEventListener(a.MouseHoveredGrid, function(e) { p.innerHTML = "" }), h.addEventListener(a.FloorPlaneChanged, function(e) { y._currentElement.innerText = BimfaceLanguage.bf_panel_map_level + e }), h.addEventListener(a.SelectionChanged, function(e) {
                if (x) x.show();
                else {
                    var t = new Glodon.Bimface.UI.Toolbar.ToolbarConfig;
                    t.className = "bf-map-toolbar", x = new Glodon.Bimface.UI.Toolbar.Toolbar(t), x.addControls([k, M, L]), x.element.style.zIndex = 11, c.appendChild(x.element)
                }
                var n = { width: c.offsetWidth, height: c.offsetHeight },
                    o = { width: x.element.offsetWidth, height: x.element.offsetHeight };
                e.x + e.width < o.width ? x.element.style.left = e.x + "px" : x.element.style.left = e.x + e.width - o.width + "px", n.height < e.y + e.height + o.height ? x.element.style.top = e.y + e.height - o.height - 6 + "px" : x.element.style.top = e.y + e.height + 6 + "px"
            }), h.addEventListener(a.SelectionEditor, function(e) { x && x.hide() }), r.appendChild(u), r.appendChild(d), r.appendChild(s), i.container.appendChild(r), i.container.appendChild(c), i.container.appendChild(l), Glodon.Web.Lang.Utility.Dom.drag({ element: i.element, handle: s }), i.showAsFull = function(e) { e ? (u.removeClass("gld-bf-max-"), u.addClass("gld-bf-min-"), i.addClass("bf-map-big"), i.addClass("bf-map-big-panel"), i.element.style.left = "50%", i.element.style.top = "50%", i.element.style.bottom = "initial", d.removeClass("bf-map-fit-panel-min"), d.addClass("bf-map-fit-panel-max"), h.resize(528, 420, !0)) : (u.removeClass("gld-bf-min-"), u.addClass("gld-bf-max-"), i.removeClass("bf-map-big"), i.removeClass("bf-map-big-panel"), i.element.style.left = "12px", i.element.style.top = "initial", i.element.style.bottom = "10px", d.removeClass("bf-map-fit-panel-max"), d.addClass("bf-map-fit-panel-min"), h.resize(298, 198, !1)), d.getCss().display = "none" }, i
        };
    t.MapPanel = n
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application.UI.Button"),
        t = function(e, t) {
            var n = e.getViewer(),
                o = e.getRootElement(),
                i = n instanceof Glodon.Bimface.Viewer.Viewer3D,
                a = Glodon.Bimface.UI.Control.ControlEvent,
                r = Glodon.Bimface.Viewer.Viewer3DEvent;
            if (!i) return void console.log("The API is not supported on this viewer.");
            var s = new Glodon.Bimface.UI.Button.ButtonConfig;
            s.id = "Map", s.title = BimfaceLanguage.bf_btn_map, s.className = "bf-button gld-bf-map";
            var l, c = new Glodon.Bimface.UI.Button.ToggleButton(s);
            return c.addEventListener(a.StateChange, function(t) {
                if (l = e.getPanel("MapPanel"))
                    if (t) l.show();
                    else {
                        l.hide();
                        var i = e.getPlugin("Map");
                        i.clearZoomAndPan()
                    }
                else l = new Glodon.Bimface.Application.UI.Panel.MapPanel(e), l.addEventListener("Hide", function() { c.setCheckedState(!1) }), o.appendChild(l.element), l.bringToFront(), e.addPanel(l), n.render();
                n.getEventManager().fireEvent(r.ButtonOnToolbarClicked, { id: s.id, isChecked: t })
            }), c
        };
    e.Map = t
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application.UI.Button"),
        t = function(e, t) {
            var n = e.getViewer(),
                o = (e.getRootElement(), n instanceof Glodon.Bimface.Viewer.Viewer3D),
                i = Glodon.Bimface.UI.Control.ControlEvent;
            if (!o) return void console.log("The API is not supported on this viewer.");
            var a = new Glodon.Bimface.UI.Button.ButtonConfig;
            a.id = "SectionDirection", a.title = "剖切方向", a.className = "bf-button gld-bf-axial";
            var r = new Glodon.Bimface.UI.Button.Button(a);
            return r.addEventListener(i.Click, function() {
                var t = this.hasClass("gld-bf-axial");
                r.toggleClassName("gld-bf-axial"), r.toggleClassName("gld-bf-axial-");
                var o = e.getPlugin("SectionPlane");
                o && (o.setDirection(t ? "Reverse" : "Forward"), o.setProgress(50)), n.render()
            }), r
        };
    e.SectionDirection = t
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application.UI.Button"),
        t = function(e, t) {
            var n = e.getViewer(),
                o = n instanceof Glodon.Bimface.Viewer.Viewer3D,
                i = Glodon.Bimface.UI.Control.ControlEvent;
            if (!o) return void console.log("The API is not supported on this viewer.");
            var a = new Glodon.Bimface.UI.Button.ButtonConfig;
            a.id = "SectionRecalculation", a.title = BimfaceLanguage.bf_tip_section_fitBox, a.className = "bf-button gld-bf-fittobox";
            var r = new Glodon.Bimface.UI.Button.Button(a);
            return r.addEventListener(i.Click, function() {
                var t = e.getPlugin("SectionBox");
                t && t.fitToModel(), n.render()
            }), r
        };
    e.SectionRecalculation = t
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application.UI.Panel"),
        t = Glodon.Web.Lang.Utility.ClientHelper.getIsDesktop(),
        n = function(e) {
            var n = new Glodon.Bimface.UI.Panel.PanelConfig;
            n.title = BimfaceLanguage.bf_panel_explode, n.css = t ? { right: "10px", bottom: "60px", width: "160px", height: "90px" } : { maxWidth: "414px", left: "50%", transform: "translate(-50%)", bottom: "0.12em", width: "100%", height: "1.02em" }, n.enableSizable = !1, n.className = "bf-panel bf-explode-panel";
            var o = new Glodon.Bimface.UI.Panel.Panel(n);
            if (o.setHtml('<div class="bf-explode-range" id="dispersionRange"></div>'), !t) {
                var i = e.getRootElement(),
                    a = i.offsetWidth,
                    r = i.offsetHeight;
                o.element.style.fontSize = 100 * Math.min(r, a, 414) / 750 + "px", o.element.addClass("explode-panel");
                o.element.querySelector(".bf-close").innerHTML = "<span class='quit'>" + BimfaceLanguage.bf_general_exit + "</span>"
            }
            return o
        };
    e.ExplodePanel = n
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application.UI.Button"),
        t = (Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Lang.Utility.Dom"), Glodon.Web.Lang.Utility.ClientHelper.getIsDesktop(), Glodon.Web.Lang.Utility.ClientHelper.getIsIphone(), function(e, t) {
            window.viewer = e.getViewer();
            var n, o = e.getRootElement(),
                i = viewer instanceof Glodon.Bimface.Viewer.Viewer3D,
                a = Glodon.Bimface.UI.Control.ControlEvent,
                r = Glodon.Bimface.Viewer.Viewer3DEvent;
            if (!i) return void console.log("The API is not supported on this viewer.");
            var s = new Glodon.Bimface.UI.Button.ButtonConfig;
            s.id = "Explode", s.title = BimfaceLanguage.bf_btn_explode, s.className = "bf-button gld-bf-explode";
            var l, c = new Glodon.Bimface.UI.Button.ToggleButton(s);
            return c.addEventListener(a.StateChange, function(i) {
                if (i) {
                    var a = t.getControl("Measure");
                    a && a.setCheckedState(!1), clearSection(e);
                    var d = t.getControl("SectionBox");
                    d && d.setCheckedState(!1);
                    var u = t.getControl("SectionPlane");
                    u && u.setCheckedState(!1), viewer.setExplosionExtent(0), viewer.render(), l = new Glodon.Bimface.Application.UI.Panel.ExplodePanel(e), l.addEventListener("Hide", function() { c.setCheckedState(!1) }), o.appendChild(l.element), n = new Glodon.Web.Lang.Utility.Dom.range({ element: l.element.querySelector("#dispersionRange"), min: 0, cur: 0, max: 3, step: .1, isShowProgress: !1, defaultColor: "#555555", currentColor: "#999999", input: function(e) { viewer.setExplosionExtent(e), viewer.render() } }), e.addPanel(l)
                } else e.removePanel(l.id), l.close(), viewer.setExplosionExtent(0), viewer.render();
                viewer.getEventManager().fireEvent(r.ButtonOnToolbarClicked, { id: s.id, isChecked: i })
            }), c
        });
    e.Explode = t
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application.UI.Button"),
        t = function() { var e = new Glodon.Bimface.UI.Button.ButtonConfig; return e.id = "Drag", e.title = BimfaceLanguage.bf_tip_roomEdit_dragNode, e.className = "bf-button gld-bf-room-dragnode", new Glodon.Bimface.UI.Button.ToggleButton(e) };
    e.RoomEditingDrag = t
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application.UI.Button"),
        t = function() { var e = new Glodon.Bimface.UI.Button.ButtonConfig; return e.id = "Add", e.title = BimfaceLanguage.bf_tip_roomEdit_addNode, e.className = "bf-button gld-bf-room-addnode", new Glodon.Bimface.UI.Button.ToggleButton(e) };
    e.RoomEditingAdd = t
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application.UI.Button"),
        t = function() { var e = new Glodon.Bimface.UI.Button.ButtonConfig; return e.id = "Delete", e.title = BimfaceLanguage.bf_tip_roomEdit_deleteNode, e.className = "bf-button gld-bf-room-deletenode", new Glodon.Bimface.UI.Button.ToggleButton(e) };
    e.RoomEditingDelete = t
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application.UI.Toolbar"),
        t = function() {
            var e = { id: "MainToolbar", title: "主菜单", className: "bf-toolbar bf-toolbar-bottom", buttons: ["Home", "Person", "OrbitButton", "RectangleSelect", "Measure", "Section", "Annotation", "Property", "Information", "Setting", "FullScreen"] },
                t = new Glodon.Bimface.UI.Toolbar.ToolbarConfig;
            return Object.assign({}, t, e)
        };
    e.MainToolbarConfig = t
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application.UI.Toolbar"),
        t = function() {
            var e = { id: "SectionToolbar", title: "剖切", className: "bf-section-box", buttons: ["SectionBoxVisiable", "SectionRecalculation", "SectionReset"] },
                t = new Glodon.Bimface.UI.Toolbar.ToolbarConfig;
            return Object.assign({}, t, e)
        };
    e.SectionToolbarConfig = t
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application.UI.Toolbar"),
        t = function() {
            var e = { id: "FamilyTypes", title: "FamilyTypes", className: "bf-toolbar bf-toolbar bf-toolbar-select", buttons: ["FamilyList"] },
                t = new Glodon.Bimface.UI.Toolbar.ToolbarConfig;
            return Object.assign({}, t, e)
        };
    e.FamilyListConfig = t
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application.UI.Toolbar"),
        t = function() {
            var e = { id: "ModelTree", title: "ModelTree", className: "bf-toolbar bf-toolbar bf-tree-toolbar", buttons: ["ModelTree"] },
                t = new Glodon.Bimface.UI.Toolbar.ToolbarConfig;
            return Object.assign({}, t, e)
        };
    e.ModelTree = t
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application.UI.Toolbar"),
        t = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application.UI.Button"),
        n = function(e, n) {
            for (var o = new Glodon.Bimface.UI.Toolbar.Toolbar(e), i = 0, a = e.buttons.length; i < a; i++)
                if (t[e.buttons[i]]) {
                    var r = t[e.buttons[i]](n, o);
                    o.addControl(r)
                }
            return o
        };
    e.Toolbar = n
}();
var isDesktop$1 = Glodon.Web.Lang.Utility.ClientHelper.getIsDesktop();
! function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application.UI.Menu"),
        t = function(e, t, n) {
            var o = e.getViewer(),
                i = e.getRootElement(),
                a = (Glodon.Bimface.Viewer.Viewer3D, Glodon.Bimface.UI.Control.ControlEvent),
                r = null,
                s = new Glodon.Bimface.UI.Menu.MenuConfig;
            s.element = i;
            var l = new Glodon.Bimface.UI.Menu.Menu(s),
                c = function() { l && (l.destroy(), l = null), i.removeEventListener("mousedown", G), E.removeEventListener("mousedown", G) };
            t && 1 == t.length && (r = n[t[0]]);
            var d, u = e.getToolbar("MainToolbar");
            u && (d = u.getControl("Property") || u.getControl("MobileProperty"));
            var p = new Glodon.Bimface.UI.Menu.MenuItemConfig;
            p.id = "showProperty";
            var f = new Glodon.Bimface.UI.Menu.MenuItem(p);
            f.setText(BimfaceLanguage.bf_btn_props), f.addEventListener(a.Click, function() {!d || d.isChecked() || f.isDisabled || d.setCheckedState(!0), c() });
            var h = new Glodon.Bimface.UI.Menu.MenuItemConfig;
            h.id = "areaProperty";
            var m = new Glodon.Bimface.UI.Menu.MenuItem(h);
            m.setText(BimfaceLanguage.bf_tip_props_rooms), m.addEventListener(a.Click, function() {
                var n = e.getPanel("AreaPropertyPanel");
                n || (n = new Glodon.Bimface.Application.UI.Panel.AreaPanel(e), n.addEventListener("Close", function() { e.removePanel(n.id) }), n.addEventListener("Hide", function() { n.close() }), showAreaProperty(o, n, r, t[0]), i.appendChild(n.element), e.addPanel(n)), c()
            });
            var g = new Glodon.Bimface.UI.Menu.MenuItemConfig;
            g.id = "areaEdit";
            var b = new Glodon.Bimface.UI.Menu.MenuItem(g);
            b.setText(BimfaceLanguage.bf_contextmenu_roomEdit), b.addEventListener(a.Click, function() {
                if (c(), isDesktop$1) {
                    var n = e.getPlugin("RoomEditorToolbar");
                    if (n) {
                        n.roomId = t[0];
                        var i = n.switchToolbar.getControls();
                        n.uncheckOthers("Drag", i), n.roomEditor.activateByRoomId(t[0]), n.roomEditor.onEnter()
                    } else {
                        var a = new Glodon.Bimface.Plugins.SpatialRelation.RoomEditorToolbarConfig;
                        a.viewer = o, a.roomId = t[0], n = new Glodon.Bimface.Plugins.SpatialRelation.RoomEditorToolbar(a), e.addPlugin(n)
                    }
                    n.show()
                }
            });
            var v = new Glodon.Bimface.UI.Menu.MenuItemConfig;
            v.id = "HideComponents";
            var y = new Glodon.Bimface.UI.Menu.MenuItem(v);
            y.setText(BimfaceLanguage.bf_contextmenu_hide), y.addEventListener(a.Click, function() { o.hideComponents(t), o.setSelectedComponentsById(), o.render(), c() });
            var w = new Glodon.Bimface.UI.Menu.MenuItemConfig;
            w.id = "SetComponentsOpacityssddd";
            var C = new Glodon.Bimface.UI.Menu.MenuItem(w);
            C.setText(BimfaceLanguage.bf_contextmenu_transparent), C.addEventListener(a.Click, function() { o.setComponentsOpacity(t, Glodon.Bimface.Viewer.OpacityOption.Translucent), o.setSelectedComponentsById(), o.render(), c() });
            var k = new Glodon.Bimface.UI.Menu.MenuConfig;
            k.id = "IsolateMenu", k.isSubMenu = isDesktop$1 && !0 || !1, k.text = BimfaceLanguage.bf_contextmenu_isolate, k.className = "bf-sub-menu";
            var B = new Glodon.Bimface.UI.Menu.Menu(k),
                M = new Glodon.Bimface.UI.Menu.MenuItemConfig;
            M.id = "HideOthers";
            var T = new Glodon.Bimface.UI.Menu.MenuItem(M);
            T.setText(BimfaceLanguage.bf_contextmenu_isolate_hidden), T.addEventListener(a.Click, function() { t && t.length > 0 && (o.isolateComponentsById(t, Glodon.Bimface.Viewer.IsolateOption.HideOthers), o.setSelectedComponentsById(), o.render()), c() });
            var L = new Glodon.Bimface.UI.Menu.MenuItemConfig;
            L.id = "MakeOthersTranslucent";
            var x = new Glodon.Bimface.UI.Menu.MenuItem(L);
            x.setText(BimfaceLanguage.bf_contextmenu_isolate_translucent), x.addEventListener(a.Click, function() { t && t.length > 0 && (o.isolateComponentsById(t, Glodon.Bimface.Viewer.IsolateOption.MakeOthersTranslucent), o.setSelectedComponentsById(), o.render()), c() }), B.addControl(T), B.addControl(x);
            var P = new Glodon.Bimface.UI.Menu.Spacer,
                S = new Glodon.Bimface.UI.Menu.Spacer,
                I = new Glodon.Bimface.UI.Menu.MenuItemConfig;
            I.id = "ShowAll";
            var _ = new Glodon.Bimface.UI.Menu.MenuItem(I);
            _.setText(BimfaceLanguage.bf_contextmenu_showAll), _.addEventListener(a.Click, function() {
                resetSection(e), e.tree && e.tree.clear(!0), o.restoreDefault(), o.render(), c();
                var t = e.getPlugin("SectionPlane");
                t && t.coordinateSystem.update(!0)
            }), !r || "room" != r.toLocaleLowerCase() && "area" != r.toLocaleLowerCase() ? t && 0 == t.length ? (l.addControl(_), l.oneOption = !0) : (d && (l.addControl(f), l.addControl(P)), l.addControl(y), l.addControl(C), l.addControl(B), l.addControl(S), l.addControl(_), "ExternalComponent" == r && f.disabled()) : (l.addControl(m), l.addControl(b), !isDesktop$1 && b.disabled(), l.oneOption = !0);
            var G = function() { c() };
            i.addEventListener("mousedown", G);
            var E = o.getDomElement();
            return E.addEventListener("mousedown", G), l
        };
    e.ContextMenu = t
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application"),
        t = (Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Viewer"), Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Lang.Utility"), Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Lang.Utility.Dom")),
        n = Glodon.Bimface.Data.StatisticsDataManager.getInstance(),
        o = function(e) {
            var o, i = Glodon.Web.Lang.Utility.ClientHelper.getIsDesktop();
            if (i) o = t.create("div", "bf-container"), e.EnableFamilyList && !e.Toolbars.includes("FamilyList") && e.Toolbars.push("FamilyList"), !e.EnableFamilyList && e.Toolbars.includes("FamilyList") && e.Toolbars.removeByValue("FamilyList");
            else {
                e.Toolbars = ["FamilyList", "MainToolbar"], e.Buttons = ["Home", "ViewButton", "Measure", "Section", "Explode"], e.enableViewHouse = !1, o = t.create("div", "bf-container  bf-mobile bf-mobile-rfa");
                var a = e.domElement.offsetWidth,
                    r = e.domElement.offsetHeight;
                o.style.fontSize = 90 * Math.min(a, r, 414) / 750 + "px"
            }
            var s = this,
                l = e;
            s.toolbars = [], s._rootElement = o, e.domElement.appendChild(o), l.domElement = o, this.getViewer = function() { return c }, this.getEventManager = function() { return u }, this.getToolbars = function() { return s.UI.getToolbars() }, this.getToolbar = function(e) { return "LeftToolbar" == e && (e = "ModelTree"), s.UI.getToolbar(e) }, this.render = function() { this.getViewer().render() }, this.addView = function(e) { c.addView(e) }, this.getAnnotationManager = function() { return s.getPlugin("Annotation") }, this.addEventListener = Glodon.Bimface.Viewer.Viewer3D.prototype.addEventListener, this.removeEventListener = Glodon.Bimface.Viewer.Viewer3D.prototype.removeEventListener;
            var c = new Glodon.Bimface.Viewer.Viewer3D(l),
                d = Glodon.Bimface.Viewer.Viewer3DEvent,
                u = c.getEventManager();
            c.addEventListener(d.ViewAdded, function(e) {
                var t = c.getViewer(),
                    o = t.getNumOfElements(),
                    i = t.getNumOfTriangles(),
                    a = { eventId: "加载", loadModel: "normal", type: "rfa", elements: o, triangles: i };
                n.send("Glodon.Bimface.Application.WebApplicationRfa", "ViewAdded", a), c.getFamilyTypes(function(e) { c.showFamilyTypeById(e[0].id), c.render() }), s.UI.init()
            }), c.addEventListener(d.AddView, function(t) {
                if (1 === t) {
                    var n = new Glodon.Bimface.Application.UI.UIConfig;
                    n = Object.assign(n, e), n.element = o, n.viewer = c, s.UI = new Glodon.Bimface.Application.UI.UI(n)
                }
            }), c.addEventListener(d.RemoveView, function(e) { 0 == e && (s.UI.destroy(), s.UI = null) })
        };
    e.WebApplicationRfa = o
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application"),
        t = function() {
            var e = { Toolbars: ["MainToolbar", "LeftSubToolbar"], Buttons: ["Home", "RectZoom", "FullScreen"] },
                t = Glodon.Bimface.Viewer.Viewer2DConfig();
            return Object.assign({}, e, t)
        };
    e.WebApplication2DConfig = t
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application"),
        t = Object.freeze({ Loaded: "Loaded", Error: "Error" });
    e.WebApplication2DEvent = t
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application"),
        t = function(e) {
            var t = new Glodon.Bimface.UI.Toolbar.ToolbarConfig,
                n = Object.assign({}, t, e);
            return new Glodon.Bimface.UI.Toolbar.Toolbar(n)
        },
        n = function(e) {
            for (var n = [], o = 0, i = e.length; o < i; o++) n.push(t(e[o]));
            this._Toolbars = n
        };
    n.prototype.getToolbar = function(e) { return this._Toolbars.getObjectByAttribute("id", e) }, e.Toolbar = t, e.Toolbars = n
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application"),
        t = function(e) {
            var t = new Glodon.Bimface.UI.Button.ButtonConfig,
                n = Object.assign({ type: "Button" }, t, e),
                o = (Glodon.Bimface.UI.Control.ControlEvent, new Glodon.Bimface.UI.Button[n.type](n));
            for (var i in n.handles) o.addEventListener(i, n.handles[i]);
            return n.html && o.setHtml(n.html), o
        },
        n = function(e) {
            for (var n = [], o = 0, i = e.length; o < i; o++) {
                var a = t(e[o]);
                if ("ComboBox" == e[o].type) { var r = e[o].options; for (var s in r) a.addControl(t(r[s])) }
                n.push(a)
            }
            this._Buttons = n
        };
    n.prototype.getButtons = function(e) { return this._Buttons }, n.prototype.getButton = function(e) { return this._Buttons.getObjectByAttribute("id", e) }, e.Button = t, e.Buttons = n
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application"),
        t = function(e) {
            var t = new Glodon.Bimface.UI.Panel.PanelConfig,
                n = Object.assign({}, t.css, e.css),
                o = Object.assign({}, t, e);
            return o.css = n, new Glodon.Bimface.UI.Panel.Panel(o)
        };
    e.Panel = t
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application"),
        t = function(e, t, n, o, i) {
            var a = new Glodon.Bimface.UI.Tree.TreeNodeConfig;
            a.hasCheckbox = o, a.isChecked = !0, a.selection = i;
            var r = new Glodon.Bimface.UI.Tree.TreeNode(a);
            return r.element.setAttribute("data-filter", n), r.setTitle(""), r.setData(e, t), r
        };
    e.Tree = t
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application"),
        t = (Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Viewer"), Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Lang.Utility"), Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Lang.Utility.Dom")),
        n = Glodon.Bimface.Data.StatisticsDataManager.getInstance(),
        o = function(e) {
            var o, i = Glodon.Web.Lang.Utility.ClientHelper.getIsDesktop();
            if (i) o = t.create("div", "bf-container");
            else {
                e.Toolbars = ["LeftSubToolbar"], e.Buttons = [], e.enableViewHouse = !1, o = t.create("div", "bf-container  bf-mobile bf-mobile-dwg");
                var a = e.domElement.offsetHeight;
                o.style.fontSize = 75 * a / 1340 + "px"
            }
            var r = this,
                s = e,
                l = (Glodon.Bimface.Viewer.NavigationMode2D, Glodon.Bimface.Viewer.Viewer2DEvent);
            e.domElement.appendChild(o), s.domElement = o;
            var c = new Glodon.Bimface.Viewer.Viewer2D(s);
            this.load = function(e) { c.load(e) }, this.getViewer = function() { return c }, this.getToolbars = function() { return g }, this.getToolbar = function(e) { return g.getToolbar(e) }, this._panels = {};
            var d = { MainToolbar: { id: "MainToolbar", title: "MainToolbar", element: o, className: "bf-toolbar bf-toolbar-bottom" }, LeftSubToolbar: { id: "LeftSubToolbar", title: "LeftSubToolbar", element: o, className: "bf-toolbar bf-toolbar-select" } },
                u = {
                    Home: { id: "Home", title: "适应屏幕", className: "bf-button gld-bf-home", handles: { Click: function() { c.home() } } },
                    RectZoom: {
                        id: "RectZoom",
                        title: "框选",
                        type: "ToggleButton",
                        className: "bf-button gld-bf-zoomrect",
                        handles: {
                            Click: function() {
                                var e = b.getControl("RectZoom");
                                c.rectZoom(), c.addEventListener(Glodon.Bimface.Viewer.Viewer2DEvent.ViewZooming, function() { c.setNavigationMode(Glodon.Bimface.Viewer.NavigationMode2D.Pan), e.setCheckedState(!1), c._opt.enableZoomRect = !1 })
                            }
                        }
                    },
                    Information: {
                        id: "Information",
                        title: "关于BIMFACE",
                        className: "bf-button gld-bf-information",
                        type: "ToggleButton",
                        handles: {
                            Click: function() {
                                if (this.hasClass("bf-checked"))
                                    if (r._panels.InformationPanel) r._panels.InformationPanel.show();
                                    else {
                                        var e = new Glodon.Bimface.Application.Panel(p.Information);
                                        e.setHtml('<div class="bf-info"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANEAAAAfCAYAAAB52CgrAAAABGdBTUEAALGPC/xhBQAAFJlJREFUeAHlXAt8VcWZn5lzbyAQIIRAoSISEnyBVq1u17oqspqg5WeLq65WixV8oNQVpGopdqtWVizUoi1QFJDCyq9VKau7KyGAPBStRayPtVLzIKBSH0A0JCHJvWdm/9+5Z86dc+85ed5AKPPLZGa++WbmO+fMf75vvjPn8q/s3jDCbrJPZUaQ3KpiPD5MSB7RZNtSasSI/LLdHx4YyBrVWZrupIL9jSnZhymR46P3772lV4OKNDQ1nGfSbcFraoqKt5m0oHywbGrXgZHj3tP8A6pK/4HH+SBdTk1VlFXsLyjZmUrv6rJSiudVrb/UspUIG6tntnr1o+PHHQir13T01Qf50xDzNK2DaRztXuWc17a3PWSguZCNWI/2sr3t28KPMU4AXwGifx61pXGS5zPI96dkMT2Hceg6oog8vbZdlCaM1RhpaoqN54z/C2PqAt2cMzWfSTXZZs7Dc8jgmV5dsS9PgoaGYyEI2iQCV+w55E5VTCbBaIk5/Iu6wXWcC8XV6UypqQb/H/PKS5eeXtRj+WZ+ET3YwODIxtkVTLELNQNX4nHk76RyfnnpWZLxYYrLXynFBmsenXLODnEmLur/QelDB0aW/ARyK13XlWl+1dqT8ipLL2eKD8M9/EHgWJwtbGgSX0XdE4H1IOIe90IyB/EWxB6ImQi0AI1uT0eQoxD8OxD7Ib6O8nm4l3Z7+gjjRV80ka9HvBdxVBhfe+jo83bItyi1DehTQLsP8bjUug6WbfQ5TGCw+Yqp1QDl1rCOuMWnK8m+jRk4Blc8E9e9E+3QJiQQgKQagWlwFTTUjWiTzThf4OdWV71T0fT0GLXJ03b+ekjE2aMA739hvdiSWueUOeunbLWEWeIO8H6SygM571cxiYejZg0oL1vkPrBUtoyW88o3nCptthnAnyO5XIOL2JM2AACEe9KDFqq0OpcAWYci+zbiHYiZAhD1PgJ90yrcnjALzAQgCt9AvNLJdfIf5CCNQPNoBWJGAOSKdJKbOgk9d0Qag4CVKQBR3xZibgTLHfAAICk1DRMWtKRGIi4NIPCNwYSoIhpjcpZSYjYm7mq08zSSU+UCCPSrUV9GNOQnYYxlGGkBCp5GIh4AiQFI14VoJLr4X6LtdNwGdJTUSM5Yic4BJLaEW+ImbhsaibM/o8FeaKgJDhuTtw6oKI3cr9Qt93eROdK/cv1pTMY3YEzHvLQYXwSL+E6uYms8eV0AgWcy7nZLZscStCny2jH2LvIViJ3RpjG0fxr3k9I2Bdx/AvP1Kcw/Qvn3KbSOFJejkfN83MYNSN9C/NQtByWtXf9naDQ7peGdKH/PoH2E/JuIcYPWkez7aPTXhBZIAxKqYNNxkdBADoDShkgCyXuuBoBS2X1AYurrur4NQCIQmkDSTZOpUilA4vlCRO6RdhwPOnnPaeI+VrEuCiDdmGkgDdxVdkY8Fl+P0fK1YBjvRMHi52PxWIWL+C7uqaOBSA7NE5Tiemlilbh1jUgnYOKXBvEeBtoMjJGquc6AjOM6IxPaX45+rzbk/zXy96JPAlLGAsYR6Ow+o0PaDszAOJ0FkNclDZAIGkhk2in2CuORH5IJFwwg3YiAxHcirmGCzyMTDkKbN0YzOinqJmH1zcYFkFr1ArVpzbQDzy9d0+5lr6GZcYDkmnaCz5QyDjNIpW/ElZoIIK28SilSxRkJ+RXrvh6PyY3ozAOQ7him8jSmrFXQ4v9BJlxrAHLbjdftkc7rzGQ1+ml3Fvd8ABrdbDTcbORnGvmOZKcbjZbhGmGSZxZAbv/9kdJ1UChHnI5xMgYg6jTCo9Y0yuggbJsNLyx5ofqjlwbxJlmJh/8zXQcLcK+0xTLBlc9Gz+7R9zVpNfVuamjeDQEXa35LqP0S9gy2jtqedqr6WFlv1kbtch6TL2peSt/dE7sQCU1GJ0AT3sVEEufcthVke167s6K9+lTJpnq//DGZlcsLf7VfVDVwIV7SfaWmGz57eRSA9N6zndwgF5WX96hhVaN5VDyYOoYuSyUOwhpdzISaACB58oq42qd5UtJhRnmLkT/cWdqP9XYHfR3ptYi7EHsiXgCQnYvn/Rry7Qpol40G5xuNOgtIo6u0LI2lwzbIK3UhU2lExez5vs7gRKiuXD9+f1Ex2fEf++paLhxCdeikNZvuRwEeswKYNyOh6bw9Esp/QZW3wVRSPcpsO4kiy5pBsoHH2WPEGg6OAI8nP/ZgtTISnVyjdsMbyHapuL0GqQ/wWg5Re2jmxtp1swCk73YUSAMqN5xToyqvxKSYqGLp3kFnLM439eqd92RT/YErlC3PgGb6vpYBnkXaEz2ty0aaZeTrjfxhy+KaCDwEIh0exgT8BPSnQLjNJdLkJ7OsvYG8ktoSqEa/tI/pqoB1ywtt3gt6LdqQSU5QMGsnglLygja07RQLvM034OoCvHbB3XIAiEn7WwDNmCAOAhCzopNZPP4Yl/bgmqKStYyLCQBmUxA/0TAhrt5YsW5VR0w7AhBMxjLIkxvWP7T4puze+eP3fvXsBrj/bwOADsIkXR7K370qyK2uzWHaQL/gijcPqe3mx+MeeoueS2tL0stg0oaFQTq6sh6INIBa3gNl9uLwAJw9EiZbivvbP44HIMXG+msSJRNAmKi0yjmhq4CkAYR71SYAaXmQ3nE0AAnPhTThXYbcj0BbwGeChTbhoX3GraNVnjx1x3RwQHQkAKTveitAUh0FkO4/00BqI4A2aw2k5TDSowFI10Peoa7Me5CuMuSnLL0A1uEaPMMTdOFYTMWRBJC+4RpIOF3g00hwLPzQMeFCNBDWRc+EMzWQ7lenmQJSOwD0LTLh9PgBqQMkuL6XB9QdURKeBS2s9xhC/ALax7eXQPkd1GunEL0mudvgP+ayES6yXmPCMXGf11dv25JuUmDAcZ1RVkT43hv0ZtGdYO5Zz2LDzUY8bh2UQllcSNMGZiqnV2Xsy/pH0M9ak59Jvt0sk2wKssFm+G9Nt6V6V+f3FZXsyKvaUMCi1lxz99hs9yYb3hcISP0r1uH9C04RhDgbMIFoj8SCnA2dBRCcjAukiDxrCgWvnZ6IJvlI53GP2EmuEOQ9XBIi0MOgX+bWTcK9ewDg+jyE9++aHGF280mYVJNxE0brK7VwggH5EE+bKo3HbK3qyUj+dR1rXC+taBazJfUzTvcD73EZk6wvThT8Y5LGV/PaQ6uwfGFfbp+JfcVEp47zL4QQl2g+J1XxE5VtT4J8p2m6xZyzcxupTIB29rhx+QDev/TVPFn8YCXyFbqsUx+QNDElDQJSZwFEQ0jJpio7/k09HBwMfxCW/SHKuzWtm6TmHudxACNQo4L+Cu7VNsh8HiK5kachzkI85kIED3cJVsmbgIa7TSC16U4AQNAAvSQdqbBjpyohVpIX3gSS2Q9uPI4J8Z04GkPqvxbl9xXjK5C/3AKA9hUWv2HyS9t+UkTErTIuZ5hA0jyCs0Gom88iYjKO/Cw1gaR5UlMNJLy7OtnzMaUwmUB6qWrjWeSFa9GJoOCFy8m/qRUTzhuFAIR3Rn9hNiezabVXEZy5F/J8FlzVbiqZajtw3xcFtcQ4F4N+tltXh5ROEbQUSBv9j8twO9rPQd8HW2pwhOvOh4xPZFAGsnjmQyGoKF6Ith9ILoAgFM7FOae4oRTkw8oSM4OA5AEI5+4w8B/pQuAevhP7nsfwwuCczwuL0zQHWKIypp4UUXFzGJDgMjqOdwBIo9R7Gz+u3IOXUI4nisRJCYqtr15/muDyDLyfm002ZVAQFts+enjPbZv52fGg+lSaBhBOg9yHLv+UWh9Q/nYArTOka/HMluB5+PY5bofmS8/F4KlpZSAyR8m8JkuBPJX0/ujniN01nAzBKGYyvAgQUfADKUFr4b8BoDQuA0jol1Y+cosmNFACQL4mBCR8X0Q0MgcCAmSLMRNIaTypQEpjCCC8x0c1968srYSp+QdUmy83E9wwL62I3Koa2VBoz38P6AIkvtXK4YtCDs+mNTEBlFZ5+AhknqUBHsA6B/SxrhjNSB9186EJniuaqTlg0C+Mp6H8GOih7+ZCOzt6Kw65IKIrSAIJk8ag+69OwYOGs6kjcbMm+WuMUhJIjUBQBKsuVilHAxlMySwBKa+ilB0oGtcqkFScBcpmAglmUm2y9/BcTeG4/wWQrmC2SgcSVz9SjXwpi/L5vJnB7FSn+HviW7P68ss+HVxS76eHlDjAylUuaaAQjjDyQ6igPV4mAjmE6KM83K60YGqhFeDZm8qhVuScwifWpTptfg8+krEAcQji9xEXI3bHsAVCLc+gYO/jPu2JWBG4kY2gJM8tKCpedMCgmVmYbk9Db1yExiSQE/Ch3G7Ycv2U4KTSEwEbFJ6bs6ZnY130UBMbj1X7Bl2F4y6f41O9PjDjyjSN0n6fbCn4cvCFuzTNEtbdjEsMlwgSpwMKikoWatniIloVETGf/LZkkX0jiz3ZdNuwNBBIOGkAk3QQgDOaNcM8sayJ2Me9gH2Zo1lJA7ULQBic94j+jsdi16AHT944E23Z67yIe/1amPyZoGNBJBPnO25f2NWmm2RqRf9hsVjsd6j7msvnJJCNPkybh8ICl057azIXHZevydsN8h9AruWZliNix50bkOzX4nN2V677JxA2JYnJ3IGiEvIorUhS2pRL488rX7vOVqw42ZpvFQfrP0DZA5Et7bnJiYuJKMTc6sqy88HzErWLyNgIuLzpAerQLLiYTN/11BRe4rnCdWVYagIJi4TNIuoRaLznMTaCysMxoolYEhYi/4OOAIh6kQ3217hg/4wJdimVKQgmaU+00ikc2X/3Yni9WK3GRCtPFac53jwFtNNjy3IujE6qS12klqHup4iDEAsRr0IkwB0TwV1Z3Wt1vweSqkOHCjtxw/hWrPqr8bKVvD2BgQAEP/HxzucZgRwMALLgYpezLCmHB7OEUwlIzOJXYC79GDuGnwBAPTQ3Jj4+MOT4PIT9Z3s1kO4D78pmQZG9gn7Walp3SHFtx0OO6wxZ5hh5J6ueGZWF/dxNVICamppaj2tqBG2+QSdQHjMhCaIWPqjr2rvhAsh5N+V8b582nAcgxq5Jq0wQPAABjCeH8LRKJiDxCD5+4/wN8hqaEY2Prxl56ffavAcKGk3Zs7shkGZAVNorUSgDIN5MZJP/mxuq8f5ZDSQKXAkT1Mp82vukBmhqHAJOBPpoz9O4qYx/b+WIc0HdAUDwZngGhXGXDxeA9JDuLwOFODg0VydSAhK3ZjmftSjvY7FOdNjxppjoA9Da0TBuL2laiOjc5lOxODks+B+JxxtvQeEBh+D+A/i+RH+LUNRaiF7adiuta8qbybzAj3w4PyqCG3B1JjturS/8CFDChCMNRAAKDOLnjgkXooHgoGjSJlxnNFDg0F1JdDUSNN6LXTlMG/r+N/D0dvleBxA2pbZp/m3umbi355p0OHhuUZvGJBZgsyJh0pFpR4E+2vtmIpv2n1zoOujxdfmoSyPY/zwXEexiqAFPjcOLvCPsSoZ+WJonrR5JMxCMJw5hX1RXs0hzD//vhTXWZzf3jRwSoPtueP8hg2p3fVjzVHZz3fXQPjP1nhZOjk/McWVUPRux+SVA2FuaDrh5csLJ8eqAirKvYMO+3FRjPAunIrpZwMmQ38AT+kJSLCwBVq+nkuXDm8MEz8GIcJR4IVgLsXguvK4/87h0Ztc7ZNKRk8kLACF9tLcchCkukbTR5W7eTP5mFOh1SQ7a1hm0rsr65m2mBolYgo/Az05NxYXQBtMJFo/TJnGDW/QlDY3qbaUah2oiLn71W7v448IW2fgg7iF4ts9O1jWW1cZxdi6WPDsHwGytr/r4wZ7SvgcA9rxzAMr23KyexV/oxkgtyUdg1bsdmmqYJgMsjyO/nsoDK0qLpJI54HkQxSyiUeCNOFKT+J7eKXeHfzhaNUXavpX5FckaaLEyJ9ThFJVMsjx3wPeRegeQTSGiN9SRdkrTUCZPSn4uyjcjWoj00d5ozJH/M3lQrgX9z6CdiUgTm/ZlPvMQ5UyFJqOj0418xrL4MRq5DCYd/fqJb1VpywgEIFhiO4UtcbQ/Plco8SRcxG+Et004EeA9861sBKC+0Z7F1QUXmRiiY0RLIxaO2Qf9dhsGUdjsA7QzBXc8R6aJEC5Ct6jhL+Msx7OWVL77cLhEwwSmBecuYzzvozuD1qEs5kQVGj7jNsaj9fZIqf0tNgj4wRtFoO6KcACdahPznK4YJwJ7Nwdnz5bhEOckHOL8BQbxNFJLV6QB5J5EeA53y7K5XGQpcRt+tBDKI6mREv34vHCv675DAQQGgCTHjrOlkQibHLc53hklNZJuD/lPwY97OUCSeMkHuqeRNE/3SglA6jmuaC/Ith8h2f4V4x7njr0H6aoMy0Gm4bVun/TR3lTMl9qUMZaifCPiNxDJO7gYfGRevorYGe1ML7Dp14McDYQ0jn7pRTBpOwo0zpVI6R1djAidCHRi4Rlnr5IKpNY6RcPgs3Dw3zpA4nwKYGR0YwDI8MK1BCDdmGSz49wAkq5JpgFASlZ2q5wJIHKm4O/IBDK3dEj76E5XdDTF/HgHE5WcJpch0hyjA6rbEL3gTu7vgLAOUZtZxEexs2EwOvip0cl9yJOT41yXdglSip0OuM4d3kaLJqs27fBwaXUKDmEA0twEJKV+AxPrCeBlO25WoBeO6gJNON2PkSaABI1Epp1QgbIRkLRpJ5nsdqYd4GJooDBvpHHRXZvV94dWfNLeXRFmo1O9ktpBA2BukCPpPMR5iIeCeDpIwzvhZMA4ZM5djLgIMZ6syUhO8QHlpT/2dYXvQcYWFi8M+xmpIVUbT2i2Y9f52wg6oDkQL+LyNR1XYVu5OQuds3ON6lYAM7nscv7x/qKS32resHRA+dqZ/naqbmzhuAVatjBZ3J/7Cuv2iNDJq3ko7T6ovfuLLl2eKhBWN/r8YYhLX4NJ8GkqT2fK6D8H7U9BrETftGfokoBxCtBxP8S3MY4GVOBY4CVX91hEakPydTTQvVqJ8fRC4evHvfbhIPZB9JSIj6nthX0Y56//Dy5GPw14sZShAAAAAElFTkSuQmCC" /><p>Powered by BIMFACE</p><a target="_blank" href="https://bimface.com">https://bimface.com</a></div>'), r._panels.InformationPanel = e, e.addEventListener("Hide", function() { y.getButton("Information").setCheckedState(!1) })
                                    }
                                else r._panels.InformationPanel.hide()
                            }
                        }
                    },
                    FullScreen: {
                        id: "FullScreen",
                        title: "全屏",
                        className: "bf-button gld-bf-maximize",
                        handles: {
                            Click: function() {
                                var e = this.hasClass("gld-bf-maximize");
                                c.enableFullScreen(e), Glodon.Web.Lang.Utility.FullScreen.onFullScreenChanged(function() {
                                    var t = b.getControl("FullScreen");
                                    t.getTitle();
                                    t.toggleClassName("gld-bf-maximize"), t.toggleClassName("gld-bf-minimize"), e ? t.setTitle("全屏") : t.setTitle("取消全屏")
                                })
                            }
                        }
                    }
                },
                p = { Information: { element: o, title: "BIMFACE", css: { left: "50%", top: "50%", width: "330px", height: "278px", transform: "translate(-50%,-50%)", zIndex: 999 }, enableSizable: !1 } };
            if (!e.Toolbars || 0 == e.Toolbars.length) return !1;
            for (var f = [], h = 0, m = e.Toolbars.length; h < m; h++) f.push(d[e.Toolbars[h]]);
            var g = new Glodon.Bimface.Application.Toolbars(f),
                b = g.getToolbar("MainToolbar");
            if (b) {
                for (var v = [], h = 0, m = e.Buttons.length; h < m; h++) v.push(u[e.Buttons[h]]);
                var y = new Glodon.Bimface.Application.Buttons(v);
                b.addControls(y.getButtons())
            }
            var w = g.getToolbar("LeftSubToolbar");
            w && c.addEventListener(l.Loaded, function(e) {
                for (var t = e.getViews(), n = { type: "ComboBox", id: "Views", inheritTitle: !0, className: "bf-combobox bf-family", options: {}, handles: { Change: function(e) { c.showViewById(e.id) } } }, o = 0, i = t.length; o < i; o++) {
                    var a = t[o];
                    n.options[a.name] = { type: "ComboBoxOptionButton", title: a.name, id: a.id, className: "bf-button", html: '<span class="bf-button-name">' + a.name + "</span>" }
                }
                var n = new Glodon.Bimface.Application.Buttons([n]),
                    r = n.getButtons()[0];
                c.addEventListener(l.ViewChanged, function(e) { r.setSelectedControlById(e) }), w.addControls(n.getButtons())
            }), c.addEventListener(l.Loaded, function() {
                var e = { eventId: "加载", loadModel: "normal", type: "2d" };
                n.send("Glodon.Bimface.Application.WebApplication2D", "Loaded", e)
            })
        };
    e.WebApplication2D = o
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application"),
        t = "Glodon.Bimface.Application.WebApplicationDemo",
        n = Glodon.Bimface.Data.StatisticsDataManager.getInstance(),
        o = function(e, o) {
            var i;
            if ("dwgView" == e.viewType) {
                var a = new Glodon.Bimface.Application.WebApplication2DConfig;
                a.domElement = o;
                var r = Glodon.Bimface.Application.ApplicationEvent;
                i = new Glodon.Bimface.Application.WebApplication2D(a), i.load(e.viewToken), i.addEventListener(r.Loaded, function() {
                    var e = { eventId: "加载", loadModel: "normal", type: "demo" };
                    n.send(t, "Loaded", e)
                })
            } else if ("rfaView" == e.viewType) {
                var a = new Glodon.Bimface.Application.WebApplicationRfaConfig;
                a.domElement = o;
                var r = Glodon.Bimface.Application.WebApplicationRfaEvent;
                i = new Glodon.Bimface.Application.WebApplicationRfa(a), i.addView(e.viewToken), i.addEventListener(r.ViewAdded, function() {
                    var e = i.getViewer().getViewer(),
                        o = e.getNumOfElements(),
                        a = e.getNumOfTriangles(),
                        r = { eventId: "加载", loadModel: "normal", type: "demo", elements: o, triangles: a };
                    n.send(t, "ViewAdded", r), i.render()
                })
            } else if ("drawingView" == e.viewType) {
                var a = new Glodon.Bimface.Application.WebApplicationDrawingConfig;
                a.domElement = o, a.drawingUrl = e.drawingUrl, a.viewToken = e.viewToken;
                var r = Glodon.Bimface.Application.WebApplicationDrawingEvent;
                i = new Glodon.Bimface.Application.WebApplicationDrawing(a), i.load(e.viewToken), i.addEventListener(r.Loaded, function() {
                    var e = { eventId: "加载", loadModel: "normal", type: "demo" };
                    n.send(t, "Loaded", e)
                })
            } else {
                var a = new Glodon.Bimface.Application.WebApplication3DConfig;
                a.domElement = o;
                var r = Glodon.Bimface.Application.WebApplication3DEvent;
                i = new Glodon.Bimface.Application.WebApplication3D(a), i.addView(e.viewToken), i.addEventListener(r.ViewAdded, function() {
                    var e = i.getViewer().getViewer(),
                        o = e.getNumOfElements(),
                        a = e.getNumOfTriangles(),
                        r = { eventId: "加载", loadModel: "normal", type: "demo", elements: o, triangles: a };
                    n.send(t, "ViewAdded", r)
                })
            }
            this._application = i
        };
    o.prototype = { hideBimfaceInfo: function() { this._application.getToolbar("MainToolbar").getControl("Information").hide() } }, e.WebApplicationDemo = o
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application"),
        t = function() {
            var e = { Toolbars: ["MainToolbar", "LeftSubToolbar"], Buttons: ["Home", "RectZoom", "DrawingMeasure", "Map", "Layers", "Setting", "FullScreen"] },
                t = Glodon.Bimface.Viewer.ViewerDrawingConfig(),
                n = Object.assign({}, e, t);
            return n.staticPath = "/api/Glodon", n
        };
    e.WebApplicationDrawingConfig = t
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application"),
        t = Object.freeze({ ViewAdded: "ViewAdded", ViewLoading: "ViewLoading", ComponentsSelectionChanged: "ComponentsSelectionChanged", ComponentsHoverChanged: "ComponentsHoverChanged", Error: "Error", Loaded: "Loaded", MouseClicked: "MouseClicked", MouseDragged: "MouseDragged", Rendered: "Rendered", ViewChanged: "ViewChanged", ViewMoving: "ViewMoving", ViewMoved: "ViewMoved", ViewZooming: "ViewZooming", ViewZoomed: "ViewZoomed", Hover: "Hover", DrawingMeasure: "DrawingMeasure", ZoomFactorChanged: "ZoomFactorChanged" });
    e.WebApplicationDrawingEvent = t
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application.UI.Panel"),
        t = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Lang.Utility.Dom"),
        n = Glodon.Web.Lang.Utility.ClientHelper.getIsDesktop(),
        o = function(e, o) {
            var i = e.getViewer(),
                a = Glodon.Bimface.Viewer.Viewer3DEvent,
                r = function(e) {};
            if (l) return l.show(), i.addEventListener(a.ComponentsSelectionChanged, r), l;
            var s = new Glodon.Bimface.UI.Panel.PanelConfig;
            s.title = BimfaceLanguage.bf_btn_layers, s.className = "bf-panel bf-layers-panell", s.css = n ? { left: "10px", top: "10px", width: "300px", height: "416px" } : { left: 0, top: 0, width: "100%", height: "100%", zIndex: 9999 };
            var l = new Glodon.Bimface.UI.Panel.Panel(s);
            l.element.addClass("layers-panel");
            var c = e.getLayers();
            this.layers = c;
            var d = 0;
            c.map(function(e) { e.visible || d++ });
            var u = t.create("ul", "bf-layers bf-scroll-bar"),
                p = t.create("div", "bf-allLayers"),
                f = void 0;
            d == c.length ? (f = "gld-bf-hide", p.addClass("disable")) : f = "gld-bf-show", p.innerHTML = "<span title='显示' class='eyes " + f + "'></span><span   class='name'>" + BimfaceLanguage.bf_panel_layers_all + "</span>", p.addEventListener("click", function() {
                var t = this.hasClass("disable");
                t ? (e.showAllLayers(), h(!0)) : (e.hideAllLayers(), h(!1)), this.toggleClass("disable");
                var n = this.querySelector(".eyes");
                n.setAttribute("title", t ? "显示" : "隐藏"), n.toggleClass("gld-bf-show"), n.toggleClass("gld-bf-hide")
            });
            var h = function(e) {
                for (var t = u.querySelectorAll(".bf-layer"), n = 0, o = t.length; n < o; ++n) {
                    var i = t[n],
                        a = i.querySelector(".eyes");
                    e ? i.removeClass("disable") : i.addClass("disable"), i.setAttribute("visible", e), a.addClass(e ? "gld-bf-show" : "gld-bf-hide"), a.removeClass(e ? "gld-bf-hide" : "gld-bf-show"), a.setAttribute("title", e ? "显示" : "隐藏")
                }
            };
            c = Glodon.Web.Lang.Utility.ClientHelper.sortByName(c);
            for (var m = 0, g = c.length; m < g; ++m) {
                var b, v, y = t.create("li", "bf-layer"),
                    w = c[m],
                    C = e.getColor(w.color);
                w.visible ? (b = "gld-bf-show", v = "显示") : (b = "gld-bf-hide", v = "隐藏", y.addClass("disable")), y.innerHTML = "<span title='" + v + "' class='eyes " + b + "'></span><span class='color'style='background:" + C + "'></span><span   class='name'>" + w.name + "</span>", y.setAttribute("layer-id", w.id), y.setAttribute("visible", w.visible), y.addEventListener("click", function() {
                    this.toggleClass("disable");
                    var t = this.querySelector(".eyes");
                    t.toggleClass("gld-bf-show"), t.toggleClass("gld-bf-hide");
                    var n = this.getAttribute("visible"),
                        o = this.getAttribute("layer-id");
                    n = "true" != n, this.setAttribute("visible", n), this.querySelector(".eyes").setAttribute("title", n ? "显示" : "隐藏");
                    var i = p.querySelector(".eyes");
                    n ? (e.showLayer(o), p.removeClass("disable"), i.addClass("gld-bf-show"), i.removeClass("gld-bf-hide"), i.setAttribute("title", "显示")) : (0 == u.querySelectorAll(".gld-bf-show").length && (p.addClass("disable"), i.removeClass("gld-bf-show"), i.addClass("gld-bf-hide"), i.setAttribute("title", "隐藏")), e.hideLayer(o))
                }), u.appendChild(y)
            }
            return l.container.appendChild(p), l.container.appendChild(u), e.changeLayers(c), l.element.setCss({ border: "solid 1px #333333" }), l.addEventListener("Hide", function() { o.setCheckedState(!1) }), this.update = function(t) {
                for (var n = 0, o = this.layers.length; n < o; ++n) {
                    var i = this.layers[n];
                    i.id == t.id && (i.visible = t.visible)
                }
                e.changeLayers(this.layers), e.update()
            }, l
        };
    e.LayersPanel = o
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Lang.Utility.Dom"),
        t = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application.UI.Panel"),
        n = Glodon.Web.Lang.Utility.ClientHelper.getIsDesktop(),
        o = function(t, o) {
            var i, a = e.create("div", "bf-tab-body"),
                r = e.create("div", "bf-tab-container"),
                s = e.create("div", "bf-tab-foot"),
                l = e.create("ul", "bf-measure-tab");
            l.innerHTML = '<li class="bf-measure-tab-item bf-active" data-type="Distance">\n                  <i class="gld-bimface gld-bf-distance" title="' + BimfaceLanguage.bf_tip_measure_distance + '"></i>\n                </li>\n                <li class="bf-measure-tab-item" data-type="Area">\n                  <i class="gld-bimface gld-bf-area" title="' + BimfaceLanguage.bf_tip_measure_area + '"></i>\n                </li>';
            for (var c = l.querySelectorAll(".bf-measure-tab-item"), d = 0; d < c.length; d++) c[d].addEventListener("click", function() {
                for (var e = 0; e < c.length; e++) c[e].removeClass("bf-active");
                var n = this.getAttribute("data-type");
                this.addClass("bf-active"), t.setMeasureType(n), g()
            });
            s.innerHTML = '<div class="settingBtn">测量设置<div>', s.addEventListener("click", function() { p() }), r.appendChild(l), r.appendChild(a), r.appendChild(s);
            var u = { None: "无", Meter: "m", Centimeter: "cm", Millimeter: "mm" },
                p = function(e) {
                    f.style.display = "block", r.style.display = "none", i.element.querySelector(".bf-close").style.display = "none", i.setTitleContent("测量设置");
                    var n, o = t.getPrecision(),
                        a = t.getScale(),
                        s = t.getLengthUnits();
                    n = '<ul class="bf-measure-setting">\n                  <li class="bf-measure-scale">\n                      <span >比例 :</span>\n                      <div class="scaleWrap">\n                          1: <input type="number"min="1" max="2000" value ="' + a + '" >\n                          <span>请输入比例 , 1-2000</span>\n                      </div>\n                  </li>\n                  <li class="bf-measure-lengthUnits">\n                      <span >单位 :</span>\n                      <div class = \'unit\'></div>\n                      </li>\n                  <li class="bf-measure-precision">\n                      <span >精度 :</span>\n                      <div class = \'unit\'></div>\n                  </li>\n\n                </ul>', h.innerHTML = n;
                    var l = "";
                    h.querySelector(".scaleWrap input").oninput = function(e) {
                        var t = e.target.value;
                        if ("." == e.data || "e" == e.data) {
                            var n = (t || l).replace(/\./g, "").replace(/e/g, "");
                            e.target.setAttribute("value", n), e.target.value = n
                        }
                        l = e.target.value, !l || l > 2e3 || l < 1 ? e.target.addClass("error") : e.target.removeClass("error")
                    };
                    var c = { type: "ComboBox", id: "units", inheritTitle: !0, className: "bf-combobox", options: {}, handles: { Change: function(e) {} } },
                        d = new Glodon.Bimface.Application.Button(c);
                    for (var p in u) {
                        var b = u[p],
                            v = { type: "ComboBoxOptionButton", title: b, id: p, className: "bf-button", html: '<span class="bf-button-name">' + b + "</span>" };
                        d.addControl(new Glodon.Bimface.Application.Button(v))
                    }
                    d.setSelectedControlById(s), h.querySelector(".bf-measure-lengthUnits .unit").appendChild(d.element), d.element.onclick = function() { w.element.removeClass("bf-expand") };
                    var y = { type: "ComboBox", id: "units", inheritTitle: !0, className: "bf-combobox", options: {}, handles: { Change: function(e) {} } },
                        w = new Glodon.Bimface.Application.Button(y),
                        C = { 0: "0", 1: "0.0", 2: "0.00", 3: "0.000" };
                    for (var p in C) {
                        var b = C[p],
                            v = { type: "ComboBoxOptionButton", title: b, id: p.toString(), className: "bf-button", html: '<span class="bf-button-name">' + b + "</span>" };
                        w.addControl(new Glodon.Bimface.Application.Button(v))
                    }
                    w.setSelectedControlById(o), h.querySelector(".bf-measure-precision .unit").appendChild(w.element), w.element.onclick = function() { d.element.removeClass("bf-expand") }, m.innerHTML = "<div class=\"bf-measure-btns\">\n                                    <span class= 'save'>保存设置</span> <span class= cancel>取消</span>\n                               </div>", m.querySelector(".save").onclick = function() {
                        var e = w.getCurrentControl().id,
                            n = h.querySelector(".scaleWrap input").value,
                            o = d.getCurrentControl().id;
                        if (!(n < 1 || n > 2e3)) {
                            t.setPrecision(e), t.setScale(n), t.setLengthUnits(o), i.setTitleContent(BimfaceLanguage.bf_btn_measure);
                            i.element.querySelector(".bf-close").style.display = "block", f.style.display = "none", r.style.display = "block", g(i.data)
                        }
                    }, m.querySelector(".cancel").onclick = function() { f.style.display = "none", r.style.display = "block", i.setTitleContent(BimfaceLanguage.bf_btn_measure), i.element.querySelector(".bf-close").style.display = "block" }
                },
                f = e.create("div", "bf-setting-container"),
                h = e.create("div", "bf-setting-body"),
                m = e.create("div", "bf-setting-foot");
            f.appendChild(h), f.appendChild(m);
            var g = function(e) {
                    i.data = e;
                    var n, o = t.getMeasureType(),
                        r = t.getPrecision(),
                        s = t.getScale(),
                        l = t.getLengthUnits();
                    if (l = "None" != l && "<span class='units'>" + u[l] + "</span>" || "", o == Glodon.Bimface.Plugins.Measure.MeasureTypeOption.Distance) {
                        var c, d, p, f;
                        e && e.distance && (c = e.distance * s, d = e.distanceX * s, p = e.distanceY * s, c = parseInt(c * Math.pow(10, r)) / Math.pow(10, r), d = parseInt(d * Math.pow(10, r)) / Math.pow(10, r), p = parseInt(p * Math.pow(10, r)) / Math.pow(10, r), 0 != r ? (f = c.toFixed(r).split("."), c = Number(f[0]).toLocaleString() + "." + f[1], f = d.toFixed(r).split("."), d = Number(f[0]).toLocaleString() + "." + f[1], f = p.toFixed(r).split("."), p = Number(f[0]).toLocaleString() + "." + f[1]) : (c = c.toLocaleString(), d = d.toLocaleString(), p = p.toLocaleString())), n = '<ul class="bf-measure-info">\n                  <li class="bf-measure-distance">\n                  ' + BimfaceLanguage.bf_panel_measure_distance + '\n                    <span class="bf-measure-value">' + (c ? c + l : "--") + '</span>\n                    <span class="bf-measure-reset gld-bimface gld-bf-reset-box" title="' + BimfaceLanguage.bf_tip_section_resetBox + '"><span></li>\n                  <li class="bf-measure-x">X： ' + (d ? d + l : "--") + '</li>\n                  <li class="bf-measure-y">Y： ' + (p ? p + l : "--") + "</li>\n\n                </ul>"
                    } else {
                        var h, f;
                        e && e.area && (h = e.area * Math.pow(s, 2), h = parseInt(h * Math.pow(10, r)) / Math.pow(10, r), 0 != r ? (f = h.toFixed(r).split("."), h = Number(f[0]).toLocaleString() + "." + f[1]) : h = h.toLocaleString()), l && (l += "<i class='square'>2</i>"), n = '<ul class="bf-measure-info">\n                  <li class="bf-measure-distance">\n                  ' + BimfaceLanguage.bf_panel_measure_area + '\n                    <span class="bf-measure-value">' + (h ? h + l : "--") + '</span>\n                    <span class="bf-measure-reset gld-bimface gld-bf-reset-box" title="' + BimfaceLanguage.bf_tip_section_resetBox + '"><span></li>\n                </ul>'
                    }
                    a.innerHTML = n, a.querySelector(".gld-bf-reset-box").addEventListener("click", function() { t.reset() })
                },
                b = new Glodon.Bimface.UI.Panel.PanelConfig;
            if (b.title = BimfaceLanguage.bf_btn_measure, b.className = "bf-panel bf-measurement-panel", b.css = n ? { right: "10px", bottom: "220px", width: "202px", height: "222px" } : { maxWidth: "414px", left: "50%", transform: "translate(-50%)", bottom: "0.12em", width: "100%", height: "1.7em" }, b.enableSizable = !1, t.viewer.addEventListener(Glodon.Bimface.Plugins.Measure.MeasureEvent.Measured, function(e) {
                    if (e) {
                        if (!e.area) {
                            var t = e.end[0] - e.start[0],
                                n = e.end[1] - e.start[1];
                            e = { distance: Math.sqrt(t * t + n * n), distanceX: t, distanceY: n }
                        }
                        g(e)
                    } else g()
                }), t.addEventListener(Glodon.Bimface.Plugins.Measure.MeasureEvent.Reset, function() { g() }), i = new Glodon.Bimface.UI.Panel.Panel(b), i.container.appendChild(r), i.container.appendChild(f), i.bringToFront(), !n) {
                var v = o.offsetWidth,
                    y = o.offsetHeight;
                i.element.style.fontSize = 100 * Math.min(v, y, 414) / 750 + "px", i.element.addClass("measure-panel");
                i.element.querySelector(".bf-close").innerHTML = "<span class='quit'>" + BimfaceLanguage.bf_general_exit + "</span>"
            }
            return g(), i
        };
    t.DrawingMeasurePanel = o
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application.UI.Panel"),
        t = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Lang.Utility.Dom"),
        n = function(e) {
            var n = new Glodon.Bimface.UI.Panel.PanelConfig,
                o = this;
            this.viewer = e, this.status = { print: e.getDisplayMode() }, n.title = BimfaceLanguage.bf_btn_settings, n.css = { left: "50%", top: "50%", transform: "translate(-50%,-200px)", width: "330px", height: "auto" }, n.enableSizable = !1, n.className = "bf-panel bf-settings-panel";
            var i = new Glodon.Bimface.UI.Panel.Panel(n),
                a = t.create("form", "bf-setting"),
                r = t.create("div", "bf-setting-foot"),
                s = '<ul class="bf-setting-tab-default bf-show">\n\n        \n        <li class="bf-setting-li">\n          <span class="bf-setting-name">' + BimfaceLanguage.bf_panel_settings_displayMode + '</span>\n          <div class="bf-setting-value printmode">\n            <label class="bf-radio">\n              <input type="radio" class="bf-radio-input normal" name=\'menu\' mode="普通模式" ' + (0 == this.status.print ? "checked" : "") + '>\n              <span class="bf-radio-display"></span>\n              <span class="bf-radio-value">' + BimfaceLanguage.bf_panel_settings_normalMode + '</span>\n            </label>\n            <label class="bf-radio">\n              <input type="radio" class="bf-radio-input" name=\'menu\' mode="白底模式" ' + (1 == this.status.print ? "checked" : "") + '>\n              <span class="bf-radio-display"></span>\n              <span class="bf-radio-value">' + BimfaceLanguage.bf_panel_settings_whiteBgMode + '</span>\n            </label>\n            <label class="bf-radio">\n              <input type="radio" class="bf-radio-input" name=\'menu\' mode="黑白模式" ' + (2 == this.status.print ? "checked" : "") + '>\n              <span class="bf-radio-display"></span>\n              <span class="bf-radio-value">' + BimfaceLanguage.bf_panel_settings_monoBgMode + "</span>\n            </label>\n          </div>\n        </li>\n        </ul>\n       ",
                l = '<div class="bf-reset">\n          <span class="reset">' + BimfaceLanguage.bf_panel_settings_restore + "</span>\n        </div>";
            a.innerHTML = s, r.innerHTML = l;
            for (var c = a.querySelectorAll(".printmode .bf-radio-input"), d = 0, u = c.length; d < u; d++) ! function(t, n) {
                c[t].addEventListener("change", function() {
                    var n = t;
                    e.setDisplayMode(n)
                })
            }(d);
            return r.querySelector(".reset").addEventListener("click", function() { c[o.status.print].click() }), i.container.appendChild(a), i.container.appendChild(r), i
        };
    e.PrintModePanel = n
}(),
function() {
    var e = (Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Viewer"), Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application")),
        t = (Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Viewer"), Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Lang.Utility"), Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Lang.Utility.Dom"), Glodon.Bimface.Data.StatisticsDataManager.getInstance()),
        n = function(e) {
            function n(t) {
                if (r && r._Toolbars && r._Toolbars.length > 0)
                    for (var n = 0, s = r._Toolbars.length; n < s; n++) r._Toolbars[n].destroy();
                var d = o.getViewer(),
                    u = o.getDomElement();
                o.enableFullScreen = function(e) { e ? Glodon.Web.Lang.Utility.FullScreen.fullScreen(u) : Glodon.Web.Lang.Utility.FullScreen.exitFullScreen() };
                var p, f, h, m, g, b, v = { MainToolbar: { id: "MainToolbar", title: "MainToolbar", element: u, className: "bf-toolbar bf-toolbar-bottom" }, LeftSubToolbar: { id: "LeftSubToolbar", title: "LeftSubToolbar", element: u, className: "bf-toolbar bf-toolbar-select" } },
                    y = !1,
                    w = {},
                    C = {},
                    k = {
                        Home: { id: "Home", title: BimfaceLanguage.bf_btn_home, className: "bf-button gld-bf-home", handles: { Click: function() { o.home() } } },
                        Layers: {
                            id: "Layers",
                            title: BimfaceLanguage.bf_btn_layers,
                            type: "ToggleButton",
                            className: "bf-button gld-bf-layers",
                            handles: {
                                Click: function() {
                                    var e = M.getControl("Layers");
                                    e._checked ? (e.setCheckedState(!0), p ? p.show() : (p = new Glodon.Bimface.Application.UI.Panel.LayersPanel(o, e), i || p.element.addClass("layers-panel"), u.appendChild(p.element))) : (e.setCheckedState(!1), p.hide()), e.addEventListener(l.StateChange, function(e) { e || p.hide() })
                                }
                            }
                        },
                        Setting: {
                            id: "Setting",
                            title: BimfaceLanguage.bf_btn_settings,
                            type: "ToggleButton",
                            className: "bf-button gld-bf-settings",
                            handles: {
                                Click: function() {
                                    var e = M.getControl("Setting");
                                    if (e._checked) {
                                        if (b) return b.show();
                                        b = new Glodon.Bimface.Application.UI.Panel.PrintModePanel(o), b.addEventListener("Hide", function() { e.setCheckedState(!1), b.isShow && b.hide() }), u.appendChild(b.element)
                                    } else b.toggle()
                                }
                            }
                        },
                        DrawingMeasure: {
                            id: "DrawingMeasure",
                            title: BimfaceLanguage.bf_btn_measure,
                            type: "ToggleButton",
                            className: "bf-button gld-bf-measure",
                            handles: {
                                Click: function() {
                                    if (!h) {
                                        var e = new Glodon.Bimface.Plugins.Measure.MeasureConfig;
                                        e.viewer = o, h = new Glodon.Bimface.Plugins.Measure.Measure(e)
                                    }
                                    var n = M.getControl("DrawingMeasure"),
                                        i = d;
                                    n._checked ? (n.setCheckedState(!0), f = new Glodon.Bimface.Application.UI.Panel.DrawingMeasurePanel(h, u), f.addEventListener("Hide", function() { n.setCheckedState(!1), h.switchOff() }), u.appendChild(f.element), h.switchOn()) : (n.setCheckedState(!1), u.removeChild(f.element), f = null, h.switchOff()), n.addEventListener(l.StateChange, function(e) { e || (h.setMeasureType(Glodon.Bimface.Plugins.Measure.MeasureTypeOption.Distance), t.activeEditorByName("pick"), i.update(), f.hide()) })
                                }
                            }
                        },
                        RectZoom: {
                            id: "RectZoom",
                            title: BimfaceLanguage.bf_btn_zoom,
                            type: "ToggleButton",
                            className: "bf-button gld-bf-zoomrect",
                            handles: {
                                Click: function() {
                                    var e = M.getControl("RectZoom"),
                                        n = !1;
                                    !e._checked && n ? (t.activeEditorByName("pick"), n = !1) : (o.rectZoom(), n = !0, o.addEventListener(c.ViewZoomed, function() { e._checked && n && setTimeout(function() { e.setCheckedState(!1) }, 200) })), e.addEventListener(l.StateChange, function(e) {
                                        if (!e && n) {
                                            n = !1;
                                            var o = M.getControl("DrawingMeasure");
                                            o && o._checked ? t.activeEditorByName("measure") : t.activeEditorByName("pick")
                                        }
                                    })
                                }
                            }
                        },
                        Annotation: {
                            id: "Annotation",
                            title: "批注",
                            className: "bf-button gld-bf-notes",
                            handles: {
                                Click: function() {
                                    if (!m) {
                                        var e = new Glodon.Bimface.Plugins.Annotation.AnnotationToolbarConfig;
                                        e.viewer = o, m = a._annotation = new Glodon.Bimface.Plugins.Annotation.AnnotationToolbar(e), g = Glodon.Bimface.Plugins.Annotation.AnnotationToolbarEvent
                                    }
                                    M.hide();
                                    var t = M.getControl("Measure");
                                    t && t.setCheckedState(!1);
                                    var n = M.getControl("DrawingMeasure"),
                                        i = M.getControl("Layers");
                                    n._checked && n.toggleCheckedState(), i._checked && i.toggleCheckedState(), m.show(), y = !0, w = {}, m.addEventListener(g.Saved, function() { M.show(), y = !1 }), m.addEventListener(g.Cancelled, function() { M.show(), y = !1 })
                                }
                            }
                        },
                        FullScreen: {
                            id: "FullScreen",
                            title: BimfaceLanguage.bf_btn_fullScreen,
                            className: "bf-button gld-bf-maximize",
                            handles: {
                                Click: function() {
                                    var e = this.hasClass("gld-bf-maximize");
                                    o.enableFullScreen(e), Glodon.Web.Lang.Utility.FullScreen.onFullScreenChanged(function() {
                                        var t = M.getControl("FullScreen");
                                        t.getTitle();
                                        t.toggleClassName("gld-bf-maximize"), t.toggleClassName("gld-bf-minimize"), e ? t.setTitle(BimfaceLanguage.bf_btn_fullScreen_exit) : t.setTitle(BimfaceLanguage.bf_btn_fullScreen)
                                    })
                                }
                            }
                        },
                        Map: {
                            id: "Map",
                            title: BimfaceLanguage.bf_btn_map,
                            type: "ToggleButton",
                            className: "bf-button gld-bf-map",
                            handles: {
                                Click: function() {
                                    var e = M.getControl("Map");
                                    e._checked ? (e.setCheckedState(!0), o.enableMiniMap(!0)) : (e.setCheckedState(!1), o.enableMiniMap(!1))
                                }
                            }
                        }
                    };
                if (document.addEventListener("keydown", function(e) {
                        if (27 == e.which) {
                            var t = M.getControl("DrawingMeasure"),
                                n = M.getControl("RectZoom");
                            t && (f && f.data ? h.reset() : t.setCheckedState(!1)), n && n.setCheckedState(!1)
                        }
                    }), !e.Toolbars || 0 == e.Toolbars.length) return !1;
                for (var B = [], n = 0, s = e.Toolbars.length; n < s; n++) B.push(v[e.Toolbars[n]]);
                r = new Glodon.Bimface.Application.Toolbars(B);
                var M = r.getToolbar("MainToolbar");
                if (M) {
                    for (var T = [], n = 0, s = e.Buttons.length; n < s; n++) T.push(k[e.Buttons[n]]);
                    var L = new Glodon.Bimface.Application.Buttons(T);
                    M.addControls(L.getButtons())
                }
                var x = r.getToolbar("LeftSubToolbar");
                if (x) {
                    var P = d.getLayouts(),
                        S = {
                            type: "ComboBox",
                            id: "Views",
                            inheritTitle: !0,
                            className: "bf-combobox bf-family",
                            options: {},
                            handles: {
                                Change: function(e) {
                                    M.getControl("DrawingMeasure");
                                    f && f.hide();
                                    var t = o.getCurrentViewId();
                                    y && (w[t] = m._annotationManager.getAnnotationList()), C[t] = o.getCurrentState(), "Model" == e.id ? (i || document.querySelector(".gld-bf-measure").setCss({ display: "block" }), o.showViewById(0)) : (i || document.querySelector(".gld-bf-measure").setCss({ display: "none" }), o.showViewById(e.id)), setTimeout(function() { o.update(!0) }, 100), y && w[e.id] && m._annotationManager.setAnnotationList(w[e.id]);
                                    var n = "Model" == e.id && "0" || e.id;
                                    C[n] && o.setState(C[n]);
                                    var a = M.getControl("Map");
                                    "Model" != e.id ? a && (a.element.style.display = "none") : a && (a.element.style.display = "inline-block")
                                }
                            }
                        };
                    if (S.options.Model = { type: "ComboBoxOptionButton", title: "Model", id: "model", className: "bf-button", html: '<span class="bf-button-name">Model</span>' }, P.length)
                        for (var n = 0, s = P.length; n < s; n++) {
                            var I = P[n];
                            S.options[I.name] = { type: "ComboBoxOptionButton", title: I.name, id: I.id || "Model", className: "bf-button", html: '<span class="bf-button-name">' + I.name + "</span>" }
                        }
                    var S = new Glodon.Bimface.Application.Buttons([S]),
                        _ = S.getButtons()[0],
                        G = o.getCurrentViewId();
                    o.addEventListener(c.ViewChanged, function(e) { _.setSelectedControlById(e || "Model") }), x.addControls(S.getButtons()), G ? (_._currentControl.setCheckedState(!1),
                        _.setSelectedControlById(G)) : _.setSelectedControlById("Model")
                }
                o.getManifest(function(e) {
                    var t = e.Features,
                        n = !0,
                        o = !0;
                    t && (n = t.HasLayout, o = t.HasMiniMap), !o && i && M.removeControl("Map"), n || x.destroy()
                });
                var u = o.getDomElement();
                if (u.offsetWidth < 800 && i) { u.querySelector(".bf-toolbar-bottom").setCss({ left: "auto", right: "10px", transform: "translate(0,0)" }) }
            }
            var o, i = Glodon.Web.Lang.Utility.ClientHelper.getIsDesktop(),
                a = this,
                r = [],
                s = e,
                l = Glodon.Bimface.UI.Control.ControlEvent,
                c = Glodon.Bimface.Viewer.ViewerDrawingEvent;
            i || (e.Buttons = ["Home", "DrawingMeasure", "Layers"]);
            var d = new Glodon.Web.Lang.EventManager;
            this.getEventManager = function() { return d }, o = new Glodon.Bimface.Viewer.ViewerDrawing(s), o.addEventListener(c.ViewChanged, function(e) { a.getEventManager().fireEvent(c.ViewChanged, e) }), this.addEventListener = function(e, t) { this.getEventManager().addEvent(e, t) }, this.removeEventListener = function(e, t) { this.getEventManager().removeEvent(e, t) }, this.loadFrame = function(e, t) { o.loadFrame(e, t) }, this.getRenderInfo = function(e, t) { o.getRenderInfo(e, t) }, o.addEventListener(c.Loaded, function(e) {
                var o = { eventId: "加载", loadModel: "normal", type: "drawing" };
                t.send("Glodon.Bimface.Application.WebApplicationDrawing", "Loaded", o), n(e)
            }), this.getViewer = function() { return o }, this.getDrawingFrame = function(e) { o.getDrawingFrame(e) }, this.load = function(e, t) { o.load(e, t) }, this.getAxisInfo = function(e) { o.getAxisInfo(e) }, this.getToolbars = function() { return r }, this.getToolbar = function(e) { return r.getToolbar(e) }
        };
    e.WebApplicationDrawing = n
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application"),
        t = function() {
            var e = { Toolbars: ["MainToolbar", "LeftSubToolbar"], Buttons: ["Home", "RectZoom", "DrawingMeasure", "Annotation", "FullScreen", "Setting"] },
                t = Glodon.Bimface.Viewer.ViewerDrawingSetConfig(),
                n = Object.assign({}, e, t);
            return n.staticPath = "/api/Glodon", n
        };
    e.WebApplicationDrawingSetConfig = t
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application"),
        t = Object.freeze({ ViewAdded: "ViewAdded", ViewLoading: "ViewLoading", ComponentsSelectionChanged: "ComponentsSelectionChanged", ComponentsHoverChanged: "ComponentsHoverChanged", Error: "Error", Loaded: "Loaded", MouseClicked: "MouseClicked", MouseDragged: "MouseDragged", ActiveViewChanged: "ActiveViewChanged", Rendered: "Rendered", ViewChanged: "ViewChanged", ViewMoving: "ViewMoving", ViewMoved: "ViewMoved", ViewZooming: "ViewZooming", ViewZoomed: "ViewZoomed", AddDrawing: "AddDrawing", Hover: "Hover", ZoomFactorChanged: "ZoomFactorChanged", DrawingMeasure: "DrawingMeasure" });
    e.WebApplicationDrawingSetEvent = t
}(),
function() {
    var e = (Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Viewer"), Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application")),
        t = (Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Viewer"), Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Lang.Utility"), Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Web.Lang.Utility.Dom"), "Glodon.Bimface.Application.WebApplicationDrawingSet"),
        n = Glodon.Bimface.Data.StatisticsDataManager.getInstance(),
        o = function(e) {
            function o() {
                var o = { eventId: "加载", loadModel: "normal", type: "DrawingSet" };
                if (n.send(t, "Loaded", o), s && s._Toolbars && s._Toolbars.length > 0)
                    for (var l = 0, u = s._Toolbars.length; l < u; l++) s._Toolbars[l].destroy();
                var p, f, h, m, g, b = i.getRootElement(),
                    v = { MainToolbar: { id: "MainToolbar", title: "MainToolbar", element: b, className: "bf-toolbar bf-toolbar-bottom" }, LeftSubToolbar: { id: "LeftSubToolbar", title: "LeftSubToolbar", element: b, className: "bf-toolbar bf-toolbar-select" } },
                    y = {
                        Home: { id: "Home", title: BimfaceLanguage.bf_btn_home, className: "bf-button gld-bf-home", handles: { Click: function() { r.getViewer().home() } } },
                        PrintMode: {
                            id: "PrintMode",
                            title: BimfaceLanguage.bf_btn_settings,
                            type: "ToggleButton",
                            className: "bf-button gld-bf-settings",
                            handles: {
                                Click: function() {
                                    var e = C.getControl("PrintMode");
                                    if (e._checked) {
                                        if (g) return g.show();
                                        g = new Glodon.Bimface.Application.UI.Panel.PrintModePanel(r.getActiveViewer()), g.addEventListener("Hide", function() { e.setCheckedState(!1), g.isShow && g.hide() }), b.appendChild(g.element)
                                    } else g.toggle()
                                }
                            }
                        },
                        DrawingMeasure: {
                            id: "DrawingMeasure",
                            title: BimfaceLanguage.bf_btn_measure,
                            type: "ToggleButton",
                            className: "bf-button gld-bf-measure",
                            handles: {
                                Click: function() {
                                    var e = r.getActiveViewer(),
                                        t = (r.getViewer().getActiveDrawing(), new Glodon.Bimface.Plugins.Measure.MeasureConfig);
                                    t.viewer = e, f = new Glodon.Bimface.Plugins.Measure.Measure(t);
                                    var n = e.getDomElement(),
                                        o = C.getControl("DrawingMeasure");
                                    if (o._checked) {
                                        o.setCheckedState(!0);
                                        var i = r.getViewer();
                                        f.addEventListener("typeChange", function() { r.getActiveViewer().getViewer().mouseEditorMgr.editors[0].captureFail = function(e, t, n) { return e && i.verify(e, t, n), !1 } }), p = new Glodon.Bimface.Application.UI.Panel.DrawingMeasurePanel(f, n), p.addEventListener("Hide", function() { o.setCheckedState(!1), f.switchOff() }), n.appendChild(p.element), f.switchOn(), r.getActiveViewer().getViewer().mouseEditorMgr.editors[0].captureFail = function(e, t, n) { return i.verify(e, t, n), !1 }
                                    } else o.setCheckedState(!1), n.removeChild(p.element), p = null, f.switchOff();
                                    o.addEventListener(c.StateChange, function(e) {
                                        if (!e) {
                                            f.setMeasureType(Glodon.Bimface.Plugins.Measure.MeasureTypeOption.Distance);
                                            var t = r.getActiveViewer();
                                            t.getViewer().mouseEditorMgr.activeEditorByName("pick"), t.update(), p.hide()
                                        }
                                    })
                                }
                            }
                        },
                        RectZoom: {
                            id: "RectZoom",
                            title: BimfaceLanguage.bf_btn_zoom,
                            type: "ToggleButton",
                            className: "bf-button gld-bf-zoomrect",
                            handles: {
                                Click: function() {
                                    var e = C.getControl("RectZoom"),
                                        t = !1;
                                    !e._checked && t ? (i.setNavigationMode("pick"), t = !1) : (i.rectZoom(), t = !0, i.addEventListener(d.ViewZoomed, function() { e._checked && t && setTimeout(function() { e.setCheckedState(!1), i.isAlignment && i.startMoving(!0) }, 200) })), e.addEventListener(c.StateChange, function(e) {
                                        if (!e && t) {
                                            t = !1;
                                            var n = C.getControl("DrawingMeasure");
                                            n && n._checked ? i.setNavigationMode("measure") : i.isAlignment ? i.startMoving(!0) : i.setNavigationMode("pick")
                                        }
                                    })
                                }
                            }
                        },
                        Annotation: {
                            id: "Annotation",
                            title: "批注",
                            className: "bf-button gld-bf-notes",
                            handles: {
                                Click: function() {
                                    var e = new Glodon.Bimface.Plugins.Annotation.AnnotationToolbarConfig,
                                        t = r.getActiveViewer();
                                    e.viewer = t, h = r._annotation = new Glodon.Bimface.Plugins.Annotation.AnnotationToolbar(e), m = Glodon.Bimface.Plugins.Annotation.AnnotationToolbarEvent, C.hide();
                                    var n = C.getControl("Measure");
                                    n && n.setCheckedState(!1);
                                    var o = C.getControl("DrawingMeasure");
                                    o._checked && o.toggleCheckedState(), h.show(), h.addEventListener(m.Saved, function() { C.show(), t.setNavigationMode("pick") }), h.addEventListener(m.Cancelled, function() { C.show(), t.setNavigationMode("pick") })
                                }
                            }
                        },
                        FullScreen: {
                            id: "FullScreen",
                            title: BimfaceLanguage.bf_btn_fullScreen,
                            className: "bf-button gld-bf-maximize",
                            handles: {
                                Click: function() {
                                    var e = this.hasClass("gld-bf-maximize");
                                    i.enableFullScreen(e), Glodon.Web.Lang.Utility.FullScreen.onFullScreenChanged(function() {
                                        var t = C.getControl("FullScreen");
                                        t.getTitle();
                                        t.toggleClassName("gld-bf-maximize"), t.toggleClassName("gld-bf-minimize"), e ? t.setTitle(BimfaceLanguage.bf_btn_fullScreen_exit) : t.setTitle(BimfaceLanguage.bf_btn_fullScreen)
                                    })
                                }
                            }
                        },
                        Setting: {
                            id: "Setting",
                            title: BimfaceLanguage.bf_btn_settings,
                            type: "ToggleButton",
                            className: "bf-button gld-bf-settings",
                            handles: {
                                Click: function() {
                                    var e = C.getControl("Setting");
                                    if (e._checked) {
                                        if (g) return g.show();
                                        g = new Glodon.Bimface.Application.UI.Panel.PrintModePanel(i), g.addEventListener("Hide", function() { e.setCheckedState(!1), g.isShow && g.hide() }), b.appendChild(g.element)
                                    } else g.toggle()
                                }
                            }
                        }
                    };
                if (document.addEventListener("keydown", function(e) {
                        if (27 == e.which) {
                            var t = C.getControl("DrawingMeasure"),
                                n = C.getControl("RectZoom");
                            t && (p && p.data ? f.reset() : t.setCheckedState(!1)), n && n.setCheckedState(!1)
                        }
                    }), !e.Toolbars || 0 == e.Toolbars.length) return !1;
                for (var w = [], l = 0, u = e.Toolbars.length; l < u; l++) w.push(v[e.Toolbars[l]]);
                s = new Glodon.Bimface.Application.Toolbars(w);
                var C = s.getToolbar("MainToolbar");
                if (C) {
                    for (var k = [], l = 0, u = e.Buttons.length; l < u; l++) k.push(y[e.Buttons[l]]);
                    var B = new Glodon.Bimface.Application.Buttons(k);
                    C.addControls(B.getButtons())
                }
                var M = function(e) {
                        e && T.removeControl("Views");
                        var t = r.getActiveViewer(),
                            n = t.getViews(),
                            o = {
                                type: "ComboBox",
                                id: "Views",
                                inheritTitle: !0,
                                className: "bf-combobox bf-family",
                                options: {},
                                handles: {
                                    Change: function(e) {
                                        C.getControl("DrawingMeasure");
                                        p && p.hide(), "Model" == e.id ? (a || document.querySelector(".gld-bf-measure").setCss({ display: "block" }), t.showViewById(0)) : (a || document.querySelector(".gld-bf-measure").setCss({ display: "none" }), t.showViewById(e.id)), t.update(!0)
                                    }
                                }
                            };
                        if (o.options.Model = { type: "ComboBoxOptionButton", title: "Model", id: "model", className: "bf-button", html: '<span class="bf-button-name">Model</span>' }, n.length)
                            for (var i = 0, s = n.length; i < s; i++) {
                                var l = n[i];
                                o.options[l.name] = { type: "ComboBoxOptionButton", title: l.name, id: l.id || "Model", className: "bf-button", html: '<span class="bf-button-name">' + l.name + "</span>" }
                            }
                        var o = new Glodon.Bimface.Application.Buttons([o]),
                            c = o.getButtons()[0],
                            u = t.getCurrentViewId();
                        t.addEventListener(d.ViewChanged, function(e) { c.setSelectedControlById(e) }), T.addControls(o.getButtons()), u ? (c._currentControl.setCheckedState(!1), c.setSelectedControlById(u)) : c.setSelectedControlById("Model")
                    },
                    T = s.getToolbar("LeftSubToolbar");
                T && (M(), i.addEventListener(d.ActiveViewChanged, M)), i.getManifest(function(e) {
                    var t = e.Features,
                        n = void 0;
                    (n = !t || t.HasLayout) || T.destroy()
                });
                var L = r.getActiveViewer().getDomElement();
                if (L.offsetWidth < 800 && a) { L.querySelector(".bf-toolbar-bottom").setCss({ left: "auto", right: "10px", transform: "translate(0,0)" }) }
            }
            var i, a = Glodon.Web.Lang.Utility.ClientHelper.getIsDesktop(),
                r = this,
                s = [],
                l = e,
                c = Glodon.Bimface.UI.Control.ControlEvent,
                d = Glodon.Bimface.Viewer.ViewerDrawingSetEvent;
            i = new Glodon.Bimface.Viewer.ViewerDrawingSet(l), i.addEventListener(d.Loaded, o), this.getViewer = function() { return i }, this.getActiveViewer = function() { return i.getActiveDrawing().viewerDrawing }, this.addDrawing = function(e, t, n) { i.addDrawing(e, t, n) }, this.addDrawings = function(e, t) { i.addDrawings(e, t) }, this.getRenderInfo = function(e, t) { i.getRenderInfo(e, t) }, this.getToolbars = function() { return s }, this.getToolbar = function(e) { return s.getToolbar(e) }
        };
    e.WebApplicationDrawingSet = o
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application"),
        t = function(e, t) {
            var n, o = new Glodon.Bimface.Application.WebApplicationDrawingConfig;
            o.domElement = document.getElementById(t), o.domElementId = t, o.drawingUrl = e.drawingUrl;
            Glodon.Bimface.Application.WebApplicationDrawingEvent;
            n = new Glodon.Bimface.Application.WebApplicationDrawing(o), this._application = n
        };
    e.ApplicationDrawingDemo = t
}(),
function() {
    function e(t, n, o) {
        function i(r, s) {
            if (!n[r]) {
                if (!t[r]) { var l = "function" == typeof require && require; if (!s && l) return l(r, !0); if (a) return a(r, !0); var c = new Error("Cannot find module '" + r + "'"); throw c.code = "MODULE_NOT_FOUND", c }
                var d = n[r] = { exports: {} };
                t[r][0].call(d.exports, function(e) { return i(t[r][1][e] || e) }, d, d.exports, e, t, n, o)
            }
            return n[r].exports
        }
        for (var a = "function" == typeof require && require, r = 0; r < o.length; r++) i(o[r]);
        return i
    }
    return e
}()({
    1: [function(e, t, n) {
        var o = this && this.__extends || function() {
            var e = function(t, n) {
                return (e = Object.setPrototypeOf || { __proto__: [] }
                    instanceof Array && function(e, t) { e.__proto__ = t } || function(e, t) { for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]) })(t, n)
            };
            return function(t, n) {
                function o() { this.constructor = t }
                e(t, n), t.prototype = null === n ? Object.create(n) : (o.prototype = n.prototype, new o)
            }
        }();
        Object.defineProperty(n, "__esModule", { value: !0 });
        var i = e("./../Markups"),
            a = function(e) {
                function t(t, n, o, i) { var a = e.call(this) || this; return a.rotation = i || 0, a.markupType = "Arrow", a.drawPoints = t, a.strokeStyle = n, a.lineWidth = o, a.bNeedHitByBbox = !1, a }
                return o(t, e), t.prototype.draw = function(e, t, n, o) {
                    if (!(this.drawPoints.length < 2)) {
                        var i = e.worldToClientPoint([this.drawPoints[0][0], this.drawPoints[0][1], this.drawPoints[0][2]]),
                            a = e.worldToClientPoint([this.drawPoints[1][0], this.drawPoints[1][1], this.drawPoints[1][2]]),
                            r = 10 + this.lineWidth,
                            s = i[0],
                            l = i[1],
                            c = a[0],
                            d = a[1],
                            u = 180 * Math.atan2(l - d, s - c) / Math.PI,
                            p = (u + 30) * Math.PI / 180,
                            f = (u - 30) * Math.PI / 180,
                            h = r * Math.cos(p),
                            m = r * Math.sin(p),
                            g = r * Math.cos(f),
                            b = r * Math.sin(f),
                            v = s - h,
                            y = l - m,
                            w = [(i[0] + a[0]) / 2, (i[1] + a[1]) / 2];
                        t.fillStyle = t.strokeStyle, t.beginPath(), v = c + h, y = d + m, t.moveTo(v, y), t.lineTo(c, d), v = c + g, y = d + b, t.lineTo(v, y), t.closePath(), t.fill(), t.beginPath(), t.moveTo(s, l), h = (r - 3) * Math.cos(p), m = (r - 3) * Math.sin(p), g = (r - 3) * Math.cos(f), b = (r - 3) * Math.sin(f);
                        var C = [c + (h + g) / 2, d + (m + b) / 2];
                        t.lineTo(C[0], C[1]), t.stroke(), n.drawArrow(this, s, l, c, d, h, m, g, b, w, this.rotation, o, i, a)
                    }
                }, t.prototype.setPoints = function(e) { this.drawPoints = e }, t.prototype.getPoints = function() { return this.drawPoints }, t.prototype.getGrips = function(e) {
                    var t = e.worldToClientPoint(this.drawPoints[0]),
                        n = e.worldToClientPoint(this.drawPoints[1]);
                    return t.concat(n)
                }, t
            }(i.default);
        n.default = a
    }, { "./../Markups": 21 }],
    2: [function(e, t, n) {
        var o = this && this.__extends || function() {
            var e = function(t, n) {
                return (e = Object.setPrototypeOf || { __proto__: [] }
                    instanceof Array && function(e, t) { e.__proto__ = t } || function(e, t) { for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]) })(t, n)
            };
            return function(t, n) {
                function o() { this.constructor = t }
                e(t, n), t.prototype = null === n ? Object.create(n) : (o.prototype = n.prototype, new o)
            }
        }();
        Object.defineProperty(n, "__esModule", { value: !0 });
        var i = e("./ArrowMarkup"),
            a = e("..//MarkupTool"),
            r = e("../Mouse"),
            s = r.MouseButtons,
            l = function(e) {
                function t(t) { var n = e.call(this) || this; return n.markupManager = t, n }
                return o(t, e), t.prototype.begin = function(e, t, n, o) {
                    this.startX = t, this.startY = n;
                    var a = e.markupManager.getColor(),
                        r = e.markupManager.getLineWidth();
                    this.markup = new i.default([], a, r)
                }, t.prototype.onEditing = function(e, t, n, o) {
                    var i = e.clientToWorldPoint([this.startX, this.startY]),
                        a = e.clientToWorldPoint([t, n]);
                    this.markup.setPoints([i, a]), this.redraw(e)
                }, t.prototype.end = function(e, t, n, o) { return this.startX == t && this.startY == n ? (console.log("Ignore single point."), s.FINISHED) : (this.addMarkup(e, this.markup), this.markup = null, s.FINISHED) }, t
            }(a.default);
        n.default = l
    }, { "..//MarkupTool": 16, "../Mouse": 23, "./ArrowMarkup": 1 }],
    3: [function(e, t, n) {
        var o = this && this.__extends || function() {
            var e = function(t, n) {
                return (e = Object.setPrototypeOf || { __proto__: [] }
                    instanceof Array && function(e, t) { e.__proto__ = t } || function(e, t) { for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]) })(t, n)
            };
            return function(t, n) {
                function o() { this.constructor = t }
                e(t, n), t.prototype = null === n ? Object.create(n) : (o.prototype = n.prototype, new o)
            }
        }();
        Object.defineProperty(n, "__esModule", { value: !0 });
        var i = e("../MathUtil"),
            a = e("./../Markups"),
            r = e("../MarkupViewer"),
            s = function(e) {
                function t(t, n, o, i, a, r, s) { var l = e.call(this) || this; return l.rotation = a || 0, l.fillStyle = r || 0, l.close = s || !1, l.markupType = "Cloud", l.drawPoints = t, l.strokeStyle = n, l.lineWidth = o, l.controlPt = [], l.editPt = null, l.bNeedHitByBbox = !0, l }
                return o(t, e), t.prototype.draw = function(e, t, n, o) {
                    if (!(this.drawPoints.length < 2)) {
                        var i = e.markupManager.getMarkupCenter(e, o);
                        i || (i = [0, 0]), t.save(), t.translate(i[0], i[1]), t.rotate(this.rotation), t.beginPath(), n.ctx.save(), n.ctx.translate(i[0], i[1]), n.ctx.rotate(this.rotation), n.ctx.beginPath(), n.ctx.strokeStyle = "rgba(" + (2 * o + 2) + ",60,60,1)", n.ctx.fillStyle = "rgba(" + (2 * o + 2) + ",60,255,1)", n.ctx.lineWidth = r.MarkupViewer.isMobile ? 36 : this.lineWidth + n.lineWidth;
                        for (var a = 1, s = this.drawPoints.length; a < s; a++) {
                            var l = e.worldToClientPoint([this.drawPoints[a - 1][0], this.drawPoints[a - 1][1], this.drawPoints[a - 1][2]]),
                                c = e.worldToClientPoint([this.drawPoints[a][0], this.drawPoints[a][1], this.drawPoints[a][2]]),
                                d = void 0;
                            if (1 == a && (t.moveTo(l[0] - i[0], l[1] - i[1]), n.ctx.moveTo(l[0] - i[0], l[1] - i[1])), this.editPt && this.editPt[a - 1]) d = e.worldToClientPoint([this.editPt[a - 1][0], this.editPt[a - 1][1], this.editPt[a - 1][2]]);
                            else if (this.controlPt[a - 1] && a < s - 1) d = e.worldToClientPoint([this.controlPt[a - 1][0], this.controlPt[a - 1][1], this.controlPt[a - 1][2]]);
                            else {
                                d = this.getControlPt(l, c);
                                var u = e.clientToWorldPoint(d);
                                u[0] && u[1] && (this.controlPt[a - 1] = u)
                            }
                            t.quadraticCurveTo(d[0] - i[0], d[1] - i[1], c[0] - i[0], c[1] - i[1]), n.ctx.quadraticCurveTo(d[0] - i[0], d[1] - i[1], c[0] - i[0], c[1] - i[1])
                        }
                        n.ctx.stroke(), this.close && this.fillStyle && t.fill(), t.stroke(), t.restore(), n.ctx.restore()
                    }
                }, t.prototype.shouldClose = function(e, t, n) { if (this.drawPoints.length < 3) return !1; var o = e.worldToClientPoint([this.drawPoints[0][0], this.drawPoints[0][1], this.drawPoints[0][2]]); return i.default.distanceByArr(o, [t, n]) < 5 ? (this.close = !0, !0) : (this.close = !1, !1) }, t.prototype.getControlPt = function(e, t, n) {
                    var o = [(e[0] + t[0]) / 2, (e[1] + t[1]) / 2],
                        a = .6 * i.default.distanceByArr(e, t),
                        r = [t[1] - e[1], e[0] - t[0]];
                    return r = i.default.normalize(r), [o[0] + r[0] * a, o[1] + r[1] * a]
                }, t.prototype.setPoints = function(e) { this.drawPoints = e }, t.prototype.addPoint = function(e) { this.drawPoints.push(e) }, t.prototype.getStartPoint = function() { return this.drawPoints[0] }, t.prototype.popPoint = function() { this.drawPoints.pop() }, t.prototype.isEmpty = function() { return 0 == this.drawPoints.length }, t.prototype.getPoints = function() { return this.drawPoints }, t.prototype.getGrips = function(e, t) {
                    if (void 0 == t) return this.drawPoints;
                    var n = e.markupManager.getMarkupBbox(e, t),
                        o = [n[0], n[1]],
                        i = [n[2], n[3]],
                        a = [(o[0] + i[0]) / 2, (o[1] + i[1]) / 2],
                        r = [];
                    return r.push(o[0], o[1]), r.push(o[0], a[1]), r.push(o[0], i[1]), r.push(a[0], i[1]), r.push(i[0], i[1]), r.push(i[0], a[1]), r.push(i[0], o[1]), r.push(a[0], o[1]), r
                }, t
            }(a.default);
        n.default = s
    }, { "../MarkupViewer": 17, "../MathUtil": 22, "./../Markups": 21 }],
    4: [function(e, t, n) {
        var o = this && this.__extends || function() {
            var e = function(t, n) {
                return (e = Object.setPrototypeOf || { __proto__: [] }
                    instanceof Array && function(e, t) { e.__proto__ = t } || function(e, t) { for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]) })(t, n)
            };
            return function(t, n) {
                function o() { this.constructor = t }
                e(t, n), t.prototype = null === n ? Object.create(n) : (o.prototype = n.prototype, new o)
            }
        }();
        Object.defineProperty(n, "__esModule", { value: !0 });
        var i = e("./CloudMarkup"),
            a = e("./../MarkupTool"),
            r = e("../MathUtil"),
            s = e("./../Mouse"),
            l = s.MouseButtons,
            c = function(e) {
                function t(t) { var n = e.call(this) || this; return n.markupManager = t, n.bFirstCloudMarkup = !0, n.uncertainty = !1, n }
                return o(t, e), t.prototype.begin = function(e, t, n, o) {
                    if (this.bFirstCloudMarkup) {
                        if (e.markupManager.hitTest(e, t, n) > -1) return;
                        var a = e.markupManager.getColor(),
                            r = e.markupManager.getLineWidth(),
                            s = e.markupManager.getFillStyleState() ? e.markupManager.getFillColor() : void 0;
                        this.markup = new i.default([], a, r, null, 0, s), this.bFirstCloudMarkup = !1
                    }
                    if (this.markup.shouldClose(e, t, n)) this.addMarkup(e, this.markup), this.markup = null, this.redraw(e), this.bFirstCloudMarkup = !0;
                    else {
                        var l = e.clientToWorldPoint([t, n]);
                        this.markup.popPoint(), this.markup.addPoint(l)
                    }
                    this.uncertainty = !1
                }, t.prototype.onEditing = function(e, t, n, o) {
                    if (!this.bFirstCloudMarkup) {
                        var i = void 0;
                        i = this.markup.shouldClose(e, t, n) ? this.markup.getStartPoint() : e.clientToWorldPoint([t, n]), this.uncertainty && this.markup.drawPoints.length > 1 ? this.markup.popPoint() : this.uncertainty = !0, this.markup.addPoint(i), this.redraw(e)
                    }
                }, t.prototype.onMouseMove = function(e, t, n, o) { this.onEditing(e, t, n, o) }, t.prototype.end = function(e, t, n, o) { if (this.bFirstCloudMarkup) return l.FINISHED }, t.prototype.onMouseRightClick = function(e, t) { this.bFirstCloudMarkup || (this.markup.popPoint(), this.markup.drawPoints.length > 1 && this.addMarkup(e, this.markup), this.markup.close = !1, this.markup = null, this.redraw(e), this.bFirstCloudMarkup = !0) }, t.prototype.onDoubleClick = function(e, t) {
                    if (!this.bFirstCloudMarkup) {
                        this.markup.popPoint();
                        var n = this.markup.drawPoints.length;
                        n > 1 && this.addMarkup(e, this.markup);
                        var o = e.worldToClientPoint([this.markup.drawPoints[n - 1][0], this.markup.drawPoints[n - 1][1], this.markup.drawPoints[n - 1][2]]);
                        r.default.distanceByArr(o, [t.x, t.y]) < 5 && this.markup.popPoint(), this.markup = null, this.redraw(e), this.bFirstCloudMarkup = !0
                    }
                }, t
            }(a.default);
        n.default = c
    }, { "../MathUtil": 22, "./../MarkupTool": 16, "./../Mouse": 23, "./CloudMarkup": 3 }],
    5: [function(e, t, n) {
        var o = this && this.__extends || function() {
            var e = function(t, n) {
                return (e = Object.setPrototypeOf || { __proto__: [] }
                    instanceof Array && function(e, t) { e.__proto__ = t } || function(e, t) { for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]) })(t, n)
            };
            return function(t, n) {
                function o() { this.constructor = t }
                e(t, n), t.prototype = null === n ? Object.create(n) : (o.prototype = n.prototype, new o)
            }
        }();
        Object.defineProperty(n, "__esModule", { value: !0 });
        var i = e("./../Markups"),
            a = e("../MathUtil"),
            r = e("../MarkupViewer"),
            s = function(e) {
                function t(t, n, o, i, a) { var r = e.call(this) || this; return r.rotation = i || 0, r.markupType = "CloudRect", r.drawPoints = t, r.strokeStyle = n, r.lineWidth = o, r.fillStyle = a, r.baseUnit = "30", r.bNeedHitByBbox = !0, r }
                return o(t, e), t.prototype.draw = function(e, t, n, o) {
                    if (!(this.drawPoints.length < 2)) {
                        var i = e.worldToClientPoint([this.drawPoints[0][0], this.drawPoints[0][1], this.drawPoints[0][2]]),
                            a = e.worldToClientPoint([this.drawPoints[1][0], this.drawPoints[1][1], this.drawPoints[1][2]]),
                            s = this.getCenter(e),
                            l = a[1] - i[1],
                            c = a[0] - i[0],
                            d = Math.abs(c),
                            u = Math.abs(l),
                            p = d / this.baseUnit,
                            f = u / this.baseUnit,
                            h = parseInt(p),
                            m = parseInt(f),
                            g = 0 == h ? d : d / h,
                            b = 0 == m ? u : u / m;
                        t.save(), t.translate(s[0], s[1]), t.rotate(this.rotation), t.beginPath(), n.ctx.save(), n.ctx.translate(s[0], s[1]), n.ctx.rotate(this.rotation), n.ctx.beginPath();
                        var v = [-d / 2, -u / 2],
                            y = [d / 2, u / 2];
                        n.ctx.strokeStyle = "rgba(" + (2 * o + 2) + ",40,40,1)", n.ctx.lineWidth = r.MarkupViewer.isMobile ? 36 : this.lineWidth + n.lineWidth, t.lineJoin = "round", this.drawSide("orientation", g, d, v[0], v[1], t, null, o, n, !0), this.drawSide("portrait", b, u, y[0], v[1], t, null, o, n), this.drawSide("orientation", g, d, y[0], y[1], t, !0, o, n), this.drawSide("portrait", b, u, v[0], y[1], t, !0, o, n), this.fillStyle && t.fill(), t.stroke(), t.restore(), n.ctx.stroke(), n.ctx.restore()
                    }
                }, t.prototype.drawSide = function(e, t, n, o, i, a, r, s, l, c) {
                    var d, u = 0,
                        p = 0,
                        f = n / t,
                        h = o,
                        m = i;
                    "orientation" == e ? u = t : p = t;
                    for (var g = 0; g < f; g++) {
                        c && 0 == g && a.moveTo(o, i), d = r ? [o - u, i - p] : [o + u, i + p], u && Math.abs(d[0] - h) > n ? d[0] = r ? h - n : h + n : p && Math.abs(d[1] - m) > n && (d[1] = r ? m - n : m + n);
                        var b = this.getControlPt([o, i], d);
                        a.quadraticCurveTo(b[0], b[1], d[0], d[1]), l.drawCloudRect(o, i, b, d, s), o = d[0], i = d[1]
                    }
                }, t.prototype.getControlPt = function(e, t, n) {
                    var o = [(e[0] + t[0]) / 2, (e[1] + t[1]) / 2],
                        i = .5 * a.default.distanceByArr(e, t),
                        r = [t[1] - e[1], e[0] - t[0]];
                    return r = a.default.normalize(r), [o[0] + r[0] * i, o[1] + r[1] * i]
                }, t.prototype.setPoints = function(e) { this.drawPoints = e }, t.prototype.getPoints = function() { return this.drawPoints }, t.prototype.getGrips = function(e) {
                    var t = e.worldToClientPoint(this.drawPoints[0]),
                        n = e.worldToClientPoint(this.drawPoints[1]),
                        o = [(t[0] + n[0]) / 2, (t[1] + n[1]) / 2],
                        i = [];
                    return i.push(t[0], t[1]), i.push(t[0], o[1]), i.push(t[0], n[1]), i.push(o[0], n[1]), i.push(n[0], n[1]), i.push(n[0], o[1]), i.push(n[0], t[1]), i.push(o[0], t[1]), i
                }, t
            }(i.default);
        n.default = s
    }, { "../MarkupViewer": 17, "../MathUtil": 22, "./../Markups": 21 }],
    6: [function(e, t, n) {
        var o = this && this.__extends || function() {
            var e = function(t, n) {
                return (e = Object.setPrototypeOf || { __proto__: [] }
                    instanceof Array && function(e, t) { e.__proto__ = t } || function(e, t) { for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]) })(t, n)
            };
            return function(t, n) {
                function o() { this.constructor = t }
                e(t, n), t.prototype = null === n ? Object.create(n) : (o.prototype = n.prototype, new o)
            }
        }();
        Object.defineProperty(n, "__esModule", { value: !0 });
        var i = e("./../MarkupTool"),
            a = e("./CloudRectMarkup"),
            r = e("./../Mouse"),
            s = r.MouseButtons,
            l = function(e) {
                function t(t) { var n = e.call(this) || this; return n.markupManager = t, n }
                return o(t, e), t.prototype.begin = function(e, t, n, o) {
                    this.startX = t, this.startY = n;
                    var i = e.markupManager.getColor(),
                        r = e.markupManager.getLineWidth(),
                        s = e.markupManager.getFillStyleState() ? e.markupManager.getFillColor() : void 0;
                    this.markup = new a.default([], i, r, 0, s)
                }, t.prototype.onEditing = function(e, t, n, o) {
                    var i = e.clientToWorldPoint([this.startX, this.startY]),
                        a = e.clientToWorldPoint([t, n]);
                    this.markup.setPoints([i, a]), this.redraw(e)
                }, t.prototype.end = function(e, t, n, o) { return this.startX == t && this.startY == n ? (console.log("Ignore single point."), s.FINISHED) : (this.addMarkup(e, this.markup), this.markup = null, s.FINISHED) }, t
            }(i.default);
        n.default = l
    }, { "./../MarkupTool": 16, "./../Mouse": 23, "./CloudRectMarkup": 5 }],
    7: [function(e, t, n) {
        var o = this && this.__extends || function() {
            var e = function(t, n) {
                return (e = Object.setPrototypeOf || { __proto__: [] }
                    instanceof Array && function(e, t) { e.__proto__ = t } || function(e, t) { for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]) })(t, n)
            };
            return function(t, n) {
                function o() { this.constructor = t }
                e(t, n), t.prototype = null === n ? Object.create(n) : (o.prototype = n.prototype, new o)
            }
        }();
        Object.defineProperty(n, "__esModule", { value: !0 });
        var i = e("./../Markups"),
            a = e("../MarkupViewer"),
            r = function(e) {
                function t(t, n, o, i) { var a = e.call(this) || this; return a.rotation = i || 0, a.markupType = "Cross", a.drawPoints = t, a.strokeStyle = n, a.lineWidth = o, a.bNeedHitByBbox = !1, a }
                return o(t, e), t.prototype.draw = function(e, t, n, o) {
                    if (!(this.drawPoints.length < 2)) {
                        var i = e.worldToClientPoint([this.drawPoints[0][0], this.drawPoints[0][1], this.drawPoints[0][2]]),
                            r = e.worldToClientPoint([this.drawPoints[1][0], this.drawPoints[1][1], this.drawPoints[1][2]]),
                            s = this.getCenter(e);
                        t.save(), t.translate(s[0], s[1]), t.rotate(this.rotation), t.beginPath(), t.moveTo(-.5 * (r[0] - i[0]), -.5 * (r[1] - i[1])), t.lineTo(.5 * (r[0] - i[0]), .5 * (r[1] - i[1])), t.moveTo(-.5 * (r[0] - i[0]), .5 * (r[1] - i[1])), t.lineTo(.5 * (r[0] - i[0]), -.5 * (r[1] - i[1])), t.stroke(), t.restore(), n.ctx.lineWidth = a.MarkupViewer.isMobile ? 36 : this.lineWidth + n.lineWidth, n.drawCross(i, r, s, this.rotation, o)
                    }
                }, t.prototype.setPoints = function(e) { this.drawPoints = e }, t.prototype.getPoints = function() { return this.drawPoints }, t.prototype.getGrips = function(e) {
                    var t = e.worldToClientPoint(this.drawPoints[0]),
                        n = e.worldToClientPoint(this.drawPoints[1]),
                        o = [(t[0] + n[0]) / 2, (t[1] + n[1]) / 2],
                        i = [];
                    return i.push(t[0], t[1]), i.push(t[0], o[1]), i.push(t[0], n[1]), i.push(o[0], n[1]), i.push(n[0], n[1]), i.push(n[0], o[1]), i.push(n[0], t[1]), i.push(o[0], t[1]), i
                }, t
            }(i.default);
        n.default = r
    }, { "../MarkupViewer": 17, "./../Markups": 21 }],
    8: [function(e, t, n) {
        var o = this && this.__extends || function() {
            var e = function(t, n) {
                return (e = Object.setPrototypeOf || { __proto__: [] }
                    instanceof Array && function(e, t) { e.__proto__ = t } || function(e, t) { for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]) })(t, n)
            };
            return function(t, n) {
                function o() { this.constructor = t }
                e(t, n), t.prototype = null === n ? Object.create(n) : (o.prototype = n.prototype, new o)
            }
        }();
        Object.defineProperty(n, "__esModule", { value: !0 });
        var i = e("./../MarkupTool"),
            a = e("./CrossMarkup"),
            r = e("./../Mouse"),
            s = r.MouseButtons,
            l = function(e) {
                function t(t) { var n = e.call(this) || this; return n.markupManager = t, n }
                return o(t, e), t.prototype.begin = function(e, t, n, o) {
                    this.startX = t, this.startY = n;
                    var i = e.markupManager.getColor(),
                        r = e.markupManager.getLineWidth();
                    this.markup = new a.default([], i, r)
                }, t.prototype.onEditing = function(e, t, n, o) {
                    var i = e.clientToWorldPoint([this.startX, this.startY]),
                        a = e.clientToWorldPoint([t, n]);
                    this.markup.setPoints([i, a]), this.redraw(e)
                }, t.prototype.end = function(e, t, n, o) { return this.startX == t && this.startY == n ? (console.log("Ignore single point."), s.FINISHED) : (this.addMarkup(e, this.markup), this.markup = null, s.FINISHED) }, t
            }(i.default);
        n.default = l
    }, { "./../MarkupTool": 16, "./../Mouse": 23, "./CrossMarkup": 7 }],
    9: [function(e, t, n) {
        var o = this && this.__extends || function() {
            var e = function(t, n) {
                return (e = Object.setPrototypeOf || { __proto__: [] }
                    instanceof Array && function(e, t) { e.__proto__ = t } || function(e, t) { for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]) })(t, n)
            };
            return function(t, n) {
                function o() { this.constructor = t }
                e(t, n), t.prototype = null === n ? Object.create(n) : (o.prototype = n.prototype, new o)
            }
        }();
        Object.defineProperty(n, "__esModule", { value: !0 });
        var i = e("./../Markups"),
            a = e("../MarkupViewer"),
            r = function(e) {
                function t(t, n, o, i, a) { var r = e.call(this) || this; return r.rotation = i || 0, r.markupType = "Ellipse", r.drawPoints = t, r.strokeStyle = n, r.lineWidth = o, r.fillStyle = a, r.bNeedHitByBbox = !0, r }
                return o(t, e), t.prototype.draw = function(e, t, n, o) {
                    if (!(this.drawPoints.length < 2)) {
                        var i = e.worldToClientPoint([this.drawPoints[0][0], this.drawPoints[0][1], this.drawPoints[0][2]]),
                            r = e.worldToClientPoint([this.drawPoints[1][0], this.drawPoints[1][1], this.drawPoints[1][2]]),
                            s = .5 * Math.abs(r[0] - i[0]),
                            l = .5 * Math.abs(r[1] - i[1]),
                            c = this.getCenter(e);
                        t.save(), t.translate(c[0], c[1]), t.rotate(this.rotation), t.beginPath(), t.ellipse(0, 0, s, l, 0, 0, 2 * Math.PI), t.restore(), t.closePath(), this.fillStyle && t.fill(), t.stroke(), n.ctx.lineWidth = a.MarkupViewer.isMobile ? 36 : this.lineWidth + n.lineWidth, n.ctx.fillStyle = this.fillStyle, n.drawEllips(i, r, c, this.rotation, o, s, l)
                    }
                }, t.prototype.setPoints = function(e) { this.drawPoints = e }, t.prototype.getPoints = function() { return this.drawPoints }, t.prototype.getGrips = function(e) {
                    var t = e.worldToClientPoint(this.drawPoints[0]),
                        n = e.worldToClientPoint(this.drawPoints[1]),
                        o = [(t[0] + n[0]) / 2, (t[1] + n[1]) / 2],
                        i = [];
                    return i.push(t[0], t[1]), i.push(t[0], o[1]), i.push(t[0], n[1]), i.push(o[0], n[1]), i.push(n[0], n[1]), i.push(n[0], o[1]), i.push(n[0], t[1]), i.push(o[0], t[1]), i
                }, t
            }(i.default);
        n.default = r
    }, { "../MarkupViewer": 17, "./../Markups": 21 }],
    10: [function(e, t, n) {
        var o = this && this.__extends || function() {
            var e = function(t, n) {
                return (e = Object.setPrototypeOf || { __proto__: [] }
                    instanceof Array && function(e, t) { e.__proto__ = t } || function(e, t) { for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]) })(t, n)
            };
            return function(t, n) {
                function o() { this.constructor = t }
                e(t, n), t.prototype = null === n ? Object.create(n) : (o.prototype = n.prototype, new o)
            }
        }();
        Object.defineProperty(n, "__esModule", { value: !0 });
        var i = e("./../MarkupTool"),
            a = e("./EllipsMarkup"),
            r = e("./../Mouse"),
            s = r.MouseButtons,
            l = function(e) {
                function t(t) { var n = e.call(this) || this; return n.markupManager = t, n }
                return o(t, e), t.prototype.begin = function(e, t, n, o) {
                    this.startX = t, this.startY = n;
                    var i = e.markupManager.getColor(),
                        r = e.markupManager.getLineWidth(),
                        s = e.markupManager.getFillStyleState() ? e.markupManager.getFillColor() : void 0;
                    this.markup = new a.default([], i, r, 0, s)
                }, t.prototype.onEditing = function(e, t, n, o) {
                    var i = e.clientToWorldPoint([this.startX, this.startY]),
                        a = e.clientToWorldPoint([t, n]);
                    this.markup.setPoints([i, a]), this.redraw(e)
                }, t.prototype.end = function(e, t, n, o) { return this.startX == t && this.startY == n ? (console.log("Ignore single point."), s.FINISHED) : (this.addMarkup(e, this.markup), this.markup = null, s.FINISHED) }, t
            }(i.default);
        n.default = l
    }, { "./../MarkupTool": 16, "./../Mouse": 23, "./EllipsMarkup": 9 }],
    11: [function(e, t, n) { Object.defineProperty(n, "__esModule", { value: !0 }), e("./MarkupDrawing"), e("./MarkupViewer3D"), e("./MarkupViewer2D") }, { "./MarkupDrawing": 12, "./MarkupViewer2D": 18, "./MarkupViewer3D": 19 }],
    12: [function(e, t, n) {
        var o = this && this.__extends || function() {
            var e = function(t, n) {
                return (e = Object.setPrototypeOf || { __proto__: [] }
                    instanceof Array && function(e, t) { e.__proto__ = t } || function(e, t) { for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]) })(t, n)
            };
            return function(t, n) {
                function o() { this.constructor = t }
                e(t, n), t.prototype = null === n ? Object.create(n) : (o.prototype = n.prototype, new o)
            }
        }();
        Object.defineProperty(n, "__esModule", { value: !0 });
        var i = e("./MarkupViewer"),
            a = function(e) {
                function t(t, n) { var o = e.call(this, t, n) || this; return o.modelViewer.addEventListener("Rendered", function() { o.update() }), o.viewer.clientToWorldPoint = function(e) { return o.viewer.toWorldPoint(e) }, o.viewer.worldToClientPoint = function(e) { return e ? o.viewer.toScreenPoint([e[0], e[1]]) : [] }, o }
                return o(t, e), t.prototype.getCurrentState = function() { return { annotationList: this.getAnnotationList(), state: JSON.parse(this.modelViewer.getCurrentState()) } }, t.prototype.startDrawing = function() { this.canvas.style.zIndex = 10, this.work = !0, this.alwaysMode = !1, this.showCanvas(), this.switchMode() }, t.prototype.onTouchstart = function(e) {
                    if (!this.alwaysMode) {
                        var t = Date.now();
                        if (t - this.firstTouch < 500) return void this.editor.onDoubleTouch(this.viewer, e);
                        this.firstTouch = t, !this.work && this.restoreState && (this.restoreState = !1, this.endDrawing()), this.work && e.target == this.canvas && e.touches.length < 2 && (e.preventDefault(), this.editor.onTouchstart(this.viewer, e), this.containerSize = this.getContainerSize())
                    }
                }, t.prototype.onTouchmove = function(e) {
                    if (this.alwaysMode) return void this.update();
                    if (this.work) {
                        var t = e.touches[0],
                            n = this.containerSize,
                            o = n.left,
                            i = n.top,
                            a = n.width,
                            r = n.height;
                        e.touches.length < 2 ? (e.preventDefault(), e.stopPropagation(), t.pageX > o && t.pageX < o + a && t.pageY > i && t.pageY < i + r && this.editor.onTouchmove(this.viewer, e)) : this.update()
                    }
                }, t.prototype.showAnnotation = function() { this.alwaysMode = !0, this.canvas.style.zIndex = 5, this.editor.editIndex = -1, this.update(), this.showCanvas() }, t.prototype.hideAnnotation = function() { this.hideCanvas() }, t.prototype.setState = function(e) {
                    if ("string" != typeof e.state && (e.state = JSON.stringify(e.state)), this.modelViewer.setState(e.state), "string" == typeof e.annotationList) {
                        var t = this.markupManager.fromString(e.annotationList);
                        this.setAnnotationList(t)
                    } else e.annotationList[0].id ? this.setAnnotationList(this.transform(e.annotationList)) : this.setAnnotationList(e.annotationList)
                }, t.prototype.onMouseWheel = function(e) { if (this.alwaysMode) return void this.update();!this.work && this.restoreState && (this.restoreState = !1, this.endDrawing()), this.work && (e.preventDefault(), this.update(), this.editor.onMouseWheel(this.viewer, e)) }, t.prototype.createSnapshot = function(e) {
                    var t = this.viewer.snapshotPure(),
                        n = document.createElement("canvas");
                    n.width = this.wrapDom.clientWidth, n.height = this.wrapDom.clientHeight;
                    var o = n.getContext("2d");
                    o.beginPath(), o.fillStyle = this.wrapDom.style.background, o.fillRect(0, 0, n.width, n.height), o.drawImage(t, 0, 0), o.drawImage(this.canvas, 0, 0), e(n.toDataURL())
                }, t.prototype.switchMode = function() { this.work && this.getIsDesktop() ? this.modelViewer.setNavigationMode("pan") : this.modelViewer.setNavigationMode("pick") }, t
            }(i.MarkupViewer);
        n.MarkupDrawing = a, window.MarkupDrawing = a
    }, { "./MarkupViewer": 17 }],
    13: [function(e, t, n) {
        Object.defineProperty(n, "__esModule", { value: !0 });
        var o = e("./EllipsMarkup/EllipsMarkupTool"),
            i = e("./RectMarkup/RectMarkupTool"),
            a = e("./ArrowMarkup/ArrowMarkupTool"),
            r = e("./CrossMarkup/CrossMarkupTool"),
            s = e("./CloudMarkup/CloudMarkupTool"),
            l = e("./CloudRectMarkup/CloudRectMarkupTool"),
            c = e("./TextMarkup/TextMarkupTool"),
            d = e("./PolylineMarkup/PolylineMarkupTool"),
            u = e("./MarkupViewer"),
            p = e("./Mouse"),
            f = p.MouseButtons,
            h = function() {
                function e(e, t, n) { this.canvas = e, this.MarkupVirtualPad = n, this.ctx = e.getContext("2d"), this.markupManager = t, this.setMarkupType("arrow"), this.curIndex = -1, this.editIndex = -1, this.preEdit = -1, this.inEditMode = !1, this.currentGrip = -1, this.bFirstClick = !0, this.firstPos = [], this.touchPos = [], this.hightLightColor = "yellow", new c.default(this.markupManager).createDiv(c.default.divId) }
                return e.prototype.onDrawing = function(e, t, n) {
                    if (this.tool.onDrawing(e, t, this.MarkupVirtualPad, this.curIndex), this.curIndex != this.highLightId && this.highLightId >= 0) {
                        var o = e.markupManager.get(this.highLightId);
                        this.canvas.style.cursor = "", this.highLightId = -1
                    }
                    if (this.curIndex >= 0) {
                        var o = e.markupManager.get(this.curIndex);
                        if (!o) return;
                        n && e.markupManager.hitTest(e, n[0], n[1]) == this.curIndex && (this.canvas.style.cursor = "pointer", this.highLightId = this.curIndex)
                    }
                    if (this.editIndex >= 0) {
                        if (0 == e.markupManager.markups.length) return this.editIndex, !1;
                        var i = e.markupManager.getMarkupBbox(e, this.editIndex);
                        if (!i) return;
                        var a = [i[0], i[1]],
                            r = [i[2], i[3]],
                            o = e.markupManager.get(this.editIndex),
                            s = o.getGrips(e, this.editIndex),
                            l = e.markupManager.getMarkupCenter(e, this.editIndex);
                        if (!l) return;
                        t.save(), t.translate(l[0], l[1]), "Arrow" != o.markupType && t.rotate(o.rotation), t.beginPath(), t.lineWidth = "1", t.strokeStyle = "red", t.fillStyle = "#ffffff";
                        var c = (o.lineWidth || 0) / 2;
                        if (4 != s.length && (t.strokeRect(-.5 * (r[0] - a[0]) - c, -.5 * (r[1] - a[1]) - c, r[0] - a[0] + 2 * c, r[1] - a[1] + 2 * c), t.arc(0, a[1] - l[1] - 20, 6, 0, 2 * Math.PI, !1), t.fill(), t.stroke(), t.closePath(), t.beginPath(), t.arc(0, a[1] - l[1] - 20, 3, .5 * Math.PI, 1.8 * Math.PI, !1), t.moveTo(3, a[1] - l[1] - 21), t.lineTo(.5, a[1] - l[1] - 19.5), t.moveTo(3, a[1] - l[1] - 21), t.lineTo(3, a[1] - l[1] - 24.5), t.stroke()), t.closePath(), "Arrow" == o.markupType) {
                            var d = e.markupManager.getMarkupSize(e, this.editIndex),
                                u = Math.sqrt(d[0] * d[0] + d[1] * d[1]),
                                p = d[0] / u * 3,
                                f = d[1] / u * 3;
                            t.beginPath(), t.arc(s[0] - l[0] + (s[0] < s[2] ? -p / 2 : p / 2), s[1] - l[1] + (s[1] < s[3] ? -f / 2 : f / 2), 3, 0, 2 * Math.PI, !1), t.fill(), t.stroke(), t.closePath(), t.beginPath(), t.arc(s[2] - l[0] + (s[0] < s[2] ? p : -p), s[3] - l[1] + (s[1] < s[3] ? f : -f), 3, 0, 2 * Math.PI, !1), t.fill(), t.stroke(), t.closePath()
                        } else
                            for (var h = 0; h < s.length; h += 2) {
                                t.beginPath();
                                var m = [s[h], s[h + 1]];
                                switch (h) {
                                    case 0:
                                        t.arc(m[0] - l[0] - c, m[1] - l[1] - c, 3, 0, 2 * Math.PI, !1);
                                        break;
                                    case 2:
                                        t.arc(m[0] - l[0] - c, m[1] - l[1], 3, 0, 2 * Math.PI, !1);
                                        break;
                                    case 4:
                                        t.arc(m[0] - l[0] - c, m[1] - l[1] + c, 3, 0, 2 * Math.PI, !1);
                                        break;
                                    case 6:
                                        t.arc(m[0] - l[0], m[1] - l[1] + c, 3, 0, 2 * Math.PI, !1);
                                        break;
                                    case 8:
                                        t.arc(m[0] - l[0] + c, m[1] - l[1] + c, 3, 0, 2 * Math.PI, !1);
                                        break;
                                    case 10:
                                        t.arc(m[0] - l[0] + c, m[1] - l[1], 3, 0, 2 * Math.PI, !1);
                                        break;
                                    case 12:
                                        t.arc(m[0] - l[0] + c, m[1] - l[1] - c, 3, 0, 2 * Math.PI, !1);
                                        break;
                                    case 14:
                                        t.arc(m[0] - l[0], m[1] - l[1] - c, 3, 0, 2 * Math.PI, !1)
                                }
                                t.fill(), t.stroke(), t.closePath()
                            }
                        t.restore(), this.MarkupVirtualPad.drawEdit(a, r, l, o, s, this.editIndex, p, f, c)
                    }
                }, e.prototype.canCreateMarkup = function(e) { if (-1 == this.curIndex) return !0; var t = e.markupManager.get(this.curIndex); if (!t) return !0; var n = t.getGrips(e); return this.editIndex != this.curIndex && 0 != n.length && "Text" != t.markupType }, e.prototype.setMarkupType = function(e) {
                    switch (this.tool && this.tool.onExit(), this.crtMarkupType = e, this.start = !1, e) {
                        case "ellips":
                            this.tool = new o.default(this.markupManager);
                            break;
                        case "rectangle":
                            this.tool = new i.default(this.markupManager);
                            break;
                        case "arrow":
                            this.tool = new a.default(this.markupManager);
                            break;
                        case "cross":
                            this.tool = new r.default(this.markupManager);
                            break;
                        case "cloud":
                            this.tool = new s.default(this.markupManager);
                            break;
                        case "cloud-rect":
                            this.tool = new l.default(this.markupManager);
                            break;
                        case "text":
                            this.tool = new c.default(this.markupManager);
                            break;
                        case "polyline":
                            this.tool = new d.default(this.markupManager);
                            break;
                        default:
                            console.log("Current type is not supported.")
                    }
                    this.tool.redraw = this.redraw.bind(this), this.tool.type = e
                }, e.prototype.begin = function(e, t, n, o) {
                    this.curIndex = e.markupManager.hitTest(e, t, n, !0);
                    var i = this.curIndex < 0 && this.canCreateMarkup(e),
                        a = this.MarkupVirtualPad.isEdge(t, n);
                    i && !a && (o == f.LelftButton && (this.start = !0, this.textMarkupTool && (this.textMarkupTool.initDom(e), this.textMarkupTool = null), this.tool.begin(e, t, n, o)), this.start && o == f.RightButton && this.tool.begin(e, t, n, o)), this.bFirstClick = !0;
                    var r = this.editIndex;
                    this.preEdit = r, this.curIndex >= 0 ? (this.editIndex = this.curIndex, this.inEditMode = !0, this.redraw(e)) : (this.editIndex = -1, this.redraw(e)), this.editIndex != r && e.onSelectChange(this.editIndex)
                }, e.prototype.onEditing = function(e, t, n, o) {
                    if (this.start ? -1 != this.curIndex && this.editIndex == this.curIndex || this.tool.onEditing(e, t, n, o) : this.tool.onMouseMove(e, t, n, o), this.inEditMode) {
                        var i = e.markupManager.hitGrip(e, [t, n], this.editIndex);
                        if (this.bFirstClick) { this.firstPos = [t, n], this.bFirstClick = !1, this.currentGrip = i >= 0 ? i : -1; var a = e.markupManager.get(this.editIndex); if (!a) return; return a.originPoints = a.getPoints(), a.originRotation = a.rotation, "Text" == a.markupType && (this.editIndex == this.preEdit && a.userText && a.originUserText && this.currentGrip < 9 ? a.userText = a.originUserText : -1 != this.currentGrip && this.currentGrip < 9 && (a.originUserText = a.userText)), a.controlPt && (a.originControlPt = a.controlPt), void(a.editPt && (a.originEditPt = a.editPt)) }
                        var r = [t, n];
                        if (9 == this.currentGrip) e.markupManager.gripRotate(e, this.editIndex, this.firstPos, r), this.redraw(e, r);
                        else if (this.currentGrip >= 0 && this.currentGrip < 9) e.markupManager.gripDragging(e, this.editIndex, this.currentGrip, this.firstPos, r), this.redraw(e, r);
                        else {
                            var a = e.markupManager.get(this.editIndex);
                            e.markupManager.translatePos(e, this.editIndex, this.firstPos, r), this.redraw(e, r)
                        }
                    } else this.bFirstClick = !0, this.currentGrip = -1, this.curIndex = e.markupManager.hitTest(e, t, n), this.redraw(e, [t, n])
                }, e.prototype.end = function(e, t, n, o) { this.start && (-1 != this.curIndex && this.editIndex == this.curIndex || f.FINISHED == this.tool.end(e, t, n, o) && (this.start = !1)), this.inEditMode && (this.inEditMode = !1), this.start = !1 }, e.prototype.onExit = function(e) { this.tool.onExit(e) }, e.prototype.onMouseWheel = function(e, t) { this.start }, e.prototype.onKeyDown = function(e, t) { this.editIndex >= 0 && ("Delete" == t.code || "Backspace" == t.code) && (e.markupManager.remove(this.editIndex), this.curIndex = -1, this.editIndex = -1, this.redraw(e)) }, e.prototype.onDoubleClick = function(e, t) { this.tool.onDoubleClick && this.tool.onDoubleClick(e, t), this.editText(e) }, e.prototype.onDoubleTouch = function(e, t) { this.tool.onDoubleTouch && this.tool.onDoubleTouch(e, t), this.editText(e) }, e.prototype.editText = function(e) {
                    if (!(this.curIndex < 0 || void 0 == this.curIndex)) {
                        var t = e.markupManager.get(this.curIndex);
                        if (t) {
                            var n = t.getPoints();
                            if ("Text" == t.markupType) {
                                var o = new c.default(this.markupManager, t.rotation);
                                "" != c.default.lastTextareaId && o.initDom(e);
                                var i = e.worldToClientPoint([n[0][0], n[0][1], n[0][2]]);
                                o.setUserText(t.getPureText()), this.tool.rotation = t.rotation, o.begin(e, i[0], i[1], f.LelftButton), o.setEditBox(t.getTextSize()), e.markupManager.remove(this.curIndex), this.highLightId = -1, this.curIndex = -1, this.editIndex = -1, this.textMarkupTool = o, this.redraw(e)
                            }
                        }
                    }
                }, e.prototype.onMouseDown = function(e, t) { 2 == t.button ? (e.startX = null, e.startY = null, this.tool.onMouseRightClick && this.tool.onMouseRightClick(e, t)) : this.begin(e, t.offsetX, t.offsetY, t.buttons) }, e.prototype.onMouseMove = function(e, t) {
                    var n = this.formatEventOffset(e, t);
                    this.onEditing(e, n.x, n.y, t.buttons)
                }, e.prototype.onMouseUp = function(e, t, n) {
                    var o = this.formatEventOffset(e, t);
                    if (n) {
                        var i = e.markupManager.hitTest(e, o.x, o.y, !0);
                        if (i > -1) {
                            var a = e.markupManager.get(i);
                            e.markupManager.viewer.alwaysMode && 0 == t.button && e.onClick(a)
                        }
                    }
                    return this.end(e, o.x, o.y, t.buttons)
                }, e.prototype.onTouchstart = function(e, t) {
                    var n = this.formatEventOffset(e, t);
                    this.begin(e, n.x, n.y, 1)
                }, e.prototype.onTouchmove = function(e, t) {
                    var n = this.formatEventOffset(e, t);
                    this.touchPos = [n.x, n.y], this.onEditing(e, n.x, n.y, 1)
                }, e.prototype.onTouchend = function(e, t) { return this.end(e, this.touchPos[0], this.touchPos[1], 1) }, e.prototype.isPanMode = function(e) { return e == f.MiddleButton || e == f.RightButton }, e.prototype.formatEventOffset = function(e, t) { var n, o, i = this.canvas.getBoundingClientRect(); return u.MarkupViewer.isMobile ? (n = t.touches[0].pageX - (i.x || i.left), o = t.touches[0].pageY - (i.y || i.top)) : (n = t.clientX - (i.x || i.left), o = t.clientY - (i.y || i.top)), { x: n, y: o } }, e.prototype.redraw = function(e, t) { this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height), this.MarkupVirtualPad.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height), this.MarkupVirtualPad.ctx.fillStyle = "rgba(0,0,0,0)", this.MarkupVirtualPad.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height), this.markupManager.draw(e, this.ctx), this.onDrawing(e, this.ctx, t) }, e
            }();
        n.default = h
    }, { "./ArrowMarkup/ArrowMarkupTool": 2, "./CloudMarkup/CloudMarkupTool": 4, "./CloudRectMarkup/CloudRectMarkupTool": 6, "./CrossMarkup/CrossMarkupTool": 8, "./EllipsMarkup/EllipsMarkupTool": 10, "./MarkupViewer": 17, "./Mouse": 23, "./PolylineMarkup/PolylineMarkupTool": 25, "./RectMarkup/RectMarkupTool": 27, "./TextMarkup/TextMarkupTool": 29 }],
    14: [function(e, t, n) {
        Object.defineProperty(n, "__esModule", { value: !0 });
        var o = e("./RectMarkup/RectMarkup"),
            i = e("./EllipsMarkup/EllipsMarkup"),
            a = e("./ArrowMarkup/ArrowMarkup"),
            r = e("./CrossMarkup/CrossMarkup"),
            s = e("./CloudMarkup/CloudMarkup"),
            l = e("./CloudRectMarkup/CloudRectMarkup"),
            c = e("./TextMarkup/TextMarkup"),
            d = e("./PolylineMarkup/PolylineMarkup"),
            u = function() {
                function e() {}
                return e.markups2string = function(e) { return JSON.stringify(e) }, e.string2markups = function(e) { var t = JSON.parse(e); return this.transform2markups(t) }, e.transform2markups = function(e) {
                    for (var t = [], n = 0; n < e.length; n++) {
                        var u = e[n],
                            p = u.drawPoints,
                            f = u.strokeStyle,
                            h = u.lineWidth,
                            m = u.fillStyle,
                            g = u.close,
                            b = u.userText,
                            v = u.fontSize,
                            y = u.rotation,
                            w = u.fontFamily,
                            C = u.textAreaId,
                            k = u.center,
                            B = u.markupId,
                            M = u.controlPt,
                            T = null;
                        switch (u.markupType) {
                            case "Ellipse":
                                T = new i.default(p, f, h, y, m);
                                break;
                            case "Rectangle":
                                T = new o.default(p, f, h, y, m);
                                break;
                            case "Arrow":
                                T = new a.default(p, f, h);
                                break;
                            case "Cross":
                                T = new r.default(p, f, h, y);
                                break;
                            case "Cloud":
                                T = new s.default(p, f, h, M, y, m, g);
                                break;
                            case "CloudRect":
                                T = new l.default(p, f, h, y, m);
                                break;
                            case "Text":
                                if (2 == p.length && "number" == typeof p[0]) {
                                    if (T = new c.default(p, b, f, v, w, y, C, k, !0), u.pureText) {
                                        var L = T.getTextSize();
                                        T.resizeText(L)
                                    }
                                } else T = new c.default(p[0], b, f, v, w, y, C, k);
                                break;
                            case "Polyline":
                                T = new d.default(p, f, h, y, m, g);
                                break;
                            default:
                                console.log("Current type is not supported.")
                        }
                        B && (T.markupId = B), t.push(T)
                    }
                    return t
                }, e
            }();
        n.default = u
    }, { "./ArrowMarkup/ArrowMarkup": 1, "./CloudMarkup/CloudMarkup": 3, "./CloudRectMarkup/CloudRectMarkup": 5, "./CrossMarkup/CrossMarkup": 7, "./EllipsMarkup/EllipsMarkup": 9, "./PolylineMarkup/PolylineMarkup": 24, "./RectMarkup/RectMarkup": 26, "./TextMarkup/TextMarkup": 28 }],
    15: [function(e, t, n) {
        Object.defineProperty(n, "__esModule", { value: !0 });
        var o = e("./MarkupIO"),
            i = e("./MathUtil"),
            a = function() {
                function e(e, t) { this.MarkupVirtualPad = e, this.viewer = t, this.markups = [], this.strokeStyle = "red", this.lineWidth = 3, this.fontSize = 14, this.fontFamily = "Arial", this.fillStyle = "", this.enableFillStyle = !0 }
                return e.prototype.toString = function(e) { return o.default.markups2string(e || this.markups) }, e.prototype.fromString = function(e) { return o.default.string2markups(e) }, e.prototype.add = function(e) { e.markupId = Date.now(), this.markups.push(e) }, e.prototype.setMarkups = function(e) { this.markups = e.slice(), this.viewer.editor.editIndex = -1 }, e.prototype.clear = function() { this.markups = [], this.viewer.editor.tool.markup && (this.viewer.editor.tool.markup.setPoints([]), this.viewer.editor.tool.bFirstCloudMarkup = !0) }, e.prototype.draw = function(e, t) {
                    for (var n = this.markups, o = 0, i = n.length; o < i; ++o) {
                        var a = n[o];
                        t.strokeStyle = a.strokeStyle, t.lineWidth = a.lineWidth, t.fillStyle = a.fillStyle, t.fontFamily = a.fontFamily, a.highLight && (t.strokeStyle = a.highLight, a.highLight = null), a.draw(e, t, this.MarkupVirtualPad, o)
                    }
                }, e.prototype.getColor = function() { return this.strokeStyle }, e.prototype.setColor = function(e) { this.strokeStyle = e }, e.prototype.getFillColor = function() { return this.fillStyle }, e.prototype.setFillColor = function(e) { this.enableFillStyle = !0, e.getRGBA && (e = e.getRGBA()), this.fillStyle = e }, e.prototype.setFillStyleState = function(e) { this.enableFillStyle = e }, e.prototype.getFillStyleState = function() { return this.enableFillStyle }, e.prototype.getLineWidth = function() { return this.lineWidth }, e.prototype.setLineWidth = function(e) { this.lineWidth = e }, e.prototype.getFont = function() { return this.font }, e.prototype.getFontSize = function() { return this.fontSize }, e.prototype.setFont = function(e) { this.font = e }, e.prototype.get = function(e) { return this.markups[e] }, e.prototype.remove = function(e) { e < 0 || this.markups.splice(e, 1) }, e.prototype.hitTest = function(e, t, n, o) {
                    var a = this.MarkupVirtualPad.hitTest(t, n);
                    if (void 0 == o || a >= 0) return a;
                    a = -1;
                    for (var r = this.markups.length - 1; r >= 0; r--) {
                        var s = this.markups[r];
                        if (0 != s.bNeedHitByBbox && "rgba(255,255,255,0)" != s.fillStyle) {
                            var l = this.getMarkupBbox(e, r),
                                c = this.getMarkupCenter(e, r),
                                d = i.default.rotateAround([t, n], c, -s.rotation);
                            if (1 == !(d[0] < l[0] || d[0] > l[2] || d[1] < l[1] || d[1] > l[3])) { a = r; break }
                        }
                    }
                    return a
                }, e.prototype.getMarkupBbox = function(e, t) {
                    var n = this.markups[t];
                    if (!(t < 0) && n) {
                        var o = [Number.MAX_VALUE, Number.MAX_VALUE],
                            i = [-Number.MAX_VALUE, -Number.MAX_VALUE],
                            a = n.getPoints();
                        if ("Text" == n.markupType) { return n.getTextBbox(e) }
                        n.editPt ? a = a.concat(n.editPt) : n.controlPt && (a = a.concat(n.controlPt));
                        for (var r = 0; r < a.length; r++) {
                            var s = e.worldToClientPoint(a[r]);
                            s[0] < o[0] && (o[0] = s[0]), s[1] < o[1] && (o[1] = s[1]), s[0] > i[0] && (i[0] = s[0]), s[1] > i[1] && (i[1] = s[1])
                        }
                        return o.concat(i)
                    }
                }, e.prototype.getMarkupCenter = function(e, t) { var n = this.getMarkupBbox(e, t); if (n) { return [(n[0] + n[2]) / 2, (n[1] + n[3]) / 2] } }, e.prototype.setFontSize = function(e) { this.fontSize = e }, e.prototype.getMarkupSize = function(e, t) { var n = this.getMarkupBbox(e, t); return [Math.abs(n[2] - n[0]), Math.abs(n[3] - n[1])] }, e.prototype.getFontFamily = function() { return this.fontFamily }, e.prototype.setFontFamily = function(e) { this.fontFamily = e }, e.prototype.translatePos = function(e, t, n, o) {
                    var i = this.markups[t];
                    if (i.setPoints(i.originPoints), i.editPt && (i.editPt = i.originEditPt), i.controlPt && (i.controlPt = i.originControlPt), this.getMarkupCenter(e, t)) {
                        for (var a = o[0] - n[0], r = o[1] - n[1], s = i.originPoints, l = [], c = [], d = 0; d < s.length; d++) c[d] = e.worldToClientPoint(s[d]), c[d][0] += a, c[d][1] += r, l[d] = e.clientToWorldPoint(c[d]);
                        if (i.setPoints(l), "Cloud" == i.markupType) {
                            var u = (i.editPt && i.originEditPt || i.controlPt && i.originControlPt).slice();
                            if (u) {
                                for (var p = [], d = 0; d < u.length; d++) p[d] = e.worldToClientPoint(u[d]), p[d][0] += a, p[d][1] += r, u[d] = e.clientToWorldPoint(p[d]);
                                i.editPt ? i.editPt = u : i.controlPt = u
                            }
                        }
                    }
                }, e.prototype.isPointInCircle = function(e, t, n) { return i.default.distanceByArr(e, t) <= n }, e.prototype.hitGrip = function(e, t, n) { return this.MarkupVirtualPad.hitGrip(t[0], t[1]) }, e.prototype.getX = function(e, t, n, o) { return (o - t) / n + e }, e.prototype.getY = function(e, t, n, o) { return (o - e) * n + t }, e.prototype.gripRotate = function(e, t, n, o) {
                    var i = this.markups[t];
                    i.rotation = i.originRotation;
                    var a = this.getMarkupCenter(e, t),
                        r = Math.sqrt(Math.pow(n[0] - a[0], 2) + Math.pow(n[1] - a[1], 2)),
                        s = Math.sqrt(Math.pow(o[0] - a[0], 2) + Math.pow(o[1] - a[1], 2)),
                        l = Math.sqrt(Math.pow(o[0] - n[0], 2) + Math.pow(o[1] - n[1], 2)),
                        c = (l * l - r * r - s * s) / (-2 * r * s),
                        d = Math.acos(c),
                        u = (n[1] - a[1]) / (n[0] - a[0]),
                        p = this.getY(n[0], n[1], u, o[0]),
                        f = this.getX(n[0], n[1], u, o[1]);
                    n[0] > a[0] && n[1] < a[1] ? o[0] < f && o[1] < p && (d = 2 * Math.PI - d) : n[0] > a[0] && n[1] > a[1] ? o[0] > f && o[1] < p && (d = 2 * Math.PI - d) : n[0] < a[0] && n[1] > a[1] ? o[0] > f && o[1] > p && (d = 2 * Math.PI - d) : n[0] < a[0] && n[1] < a[1] && o[0] < f && o[1] > p && (d = 2 * Math.PI - d), i.rotation = i.originRotation + d
                }, e.prototype.rotateTransform = function(e, t, n, o, i) {
                    n %= 2 * Math.PI, n = -n;
                    var a, r, s = Math.sin(n),
                        l = Math.cos(n);
                    a = o - e, r = i - t;
                    var c = a * l - r * s,
                        d = a * s + r * l;
                    return a = c + e, r = d + t, [a, r]
                }, e.prototype.gripDragging = function(e, t, n, o, i) {
                    var a = this.markups[t],
                        r = a.originPoints;
                    a.setPoints(r), a.originUserText && (a.userText = a.originUserText);
                    var s = a.getGrips(e, t),
                        l = this.getMarkupSize(e, t),
                        c = l.slice(),
                        d = this.getMarkupCenter(e, t),
                        u = d.slice();
                    if ("Arrow" == a.markupType) {
                        var p = i[0] - o[0],
                            f = i[1] - o[1],
                            h = e.worldToClientPoint(r[0]),
                            m = e.worldToClientPoint(r[1]);
                        switch (n) {
                            case 0:
                                h[0] += p, h[1] += f;
                                break;
                            case 4:
                                m[0] += p, m[1] += f;
                                break;
                            default:
                                console.log("default grip id." + n)
                        }
                        return h = e.clientToWorldPoint(h), m = e.clientToWorldPoint(m), void a.setPoints([h, m])
                    }
                    var g = this.rotateTransform(o[0], o[1], a.rotation, i[0], i[1]),
                        b = g[0] - o[0],
                        v = g[1] - o[1];
                    switch (n) {
                        case 0:
                            u[0] += .5 * b * Math.cos(a.rotation), u[1] += .5 * b * Math.sin(a.rotation), u[0] -= .5 * v * Math.sin(a.rotation), u[1] += .5 * v * Math.cos(a.rotation), c[1] -= v, c[0] -= b;
                            break;
                        case 1:
                            u[0] += .5 * b * Math.cos(a.rotation), u[1] += .5 * b * Math.sin(a.rotation), c[0] -= b;
                            break;
                        case 2:
                            u[0] += .5 * b * Math.cos(a.rotation), u[1] += .5 * b * Math.sin(a.rotation), u[0] -= .5 * v * Math.sin(a.rotation), u[1] += .5 * v * Math.cos(a.rotation), c[1] += v, c[0] -= b;
                            break;
                        case 3:
                            u[0] -= .5 * v * Math.sin(a.rotation), u[1] += .5 * v * Math.cos(a.rotation), c[1] += v;
                            break;
                        case 4:
                            u[0] += .5 * b * Math.cos(a.rotation), u[1] += .5 * b * Math.sin(a.rotation), u[0] -= .5 * v * Math.sin(a.rotation), u[1] += .5 * v * Math.cos(a.rotation), c[0] += b, c[1] += v;
                            break;
                        case 5:
                            u[0] += .5 * b * Math.cos(a.rotation), u[1] += .5 * b * Math.sin(a.rotation), c[0] += b;
                            break;
                        case 6:
                            u[0] += .5 * b * Math.cos(a.rotation), u[1] += .5 * b * Math.sin(a.rotation), u[0] -= .5 * v * Math.sin(a.rotation), u[1] += .5 * v * Math.cos(a.rotation), c[1] -= v, c[0] += b;
                            break;
                        case 7:
                            u[0] -= .5 * v * Math.sin(a.rotation), u[1] += .5 * v * Math.cos(a.rotation), c[1] -= v
                    }
                    if ("Cloud" == a.markupType || "Polyline" == a.markupType) return void this.draggingMultipleGrip(e, a, n, o, i, b, v, s, l, c, d, u);
                    var y = [u[0] - .5 * c[0], u[1] - .5 * c[1]],
                        w = [u[0] + .5 * c[0], u[1] + .5 * c[1]];
                    "Text" == a.markupType && a.resizeText(c), y = e.clientToWorldPoint(y), w = e.clientToWorldPoint(w), a.setPoints([y, w])
                }, e.prototype.draggingMultipleGrip = function(e, t, n, o, i, a, r, s, l, c, d, u) {
                    var p = t.originPoints.slice(),
                        f = d[0] - l[0] / 2,
                        h = d[1] - l[1] / 2,
                        m = u[0] - c[0] / 2,
                        g = u[1] - c[1] / 2,
                        b = function(t) {
                            for (var n = 0; n < t.length; n++) {
                                var o = e.worldToClientPoint(t[n]),
                                    i = o[0],
                                    a = o[1],
                                    r = i - f,
                                    s = a - h;
                                o[0] = r / l[0] * c[0] + m, o[1] = s / l[1] * c[1] + g, t[n] = e.clientToWorldPoint(o)
                            }
                            return t
                        },
                        v = b(p);
                    if (t.setPoints(v), "Cloud" == t.markupType) {
                        var y = (t.originEditPt || t.originControlPt).slice();
                        t.editPt = b(y)
                    }
                }, e
            }();
        n.default = a
    }, { "./MarkupIO": 14, "./MathUtil": 22 }],
    16: [function(e, t, n) {
        Object.defineProperty(n, "__esModule", { value: !0 });
        var o = function() {
            function e() {}
            return e.prototype.onDrawing = function(e, t, n, o) { this.markup && (t.strokeStyle = this.markup.strokeStyle, t.lineWidth = this.markup.lineWidth, t.fillStyle = this.markup.fillStyle, this.markup.draw(e, t, n, o)) }, e.prototype.addMarkup = function(e, t) { t.drawEnd = !0, this.markupManager.add(t) }, e.prototype.redraw = function(e) {}, e.prototype.onExit = function(e) {}, e.prototype.onMouseMove = function(e, t, n, o) {}, e
        }();
        n.default = o
    }, {}],
    17: [function(e, t, n) {
        Object.defineProperty(n, "__esModule", { value: !0 });
        var o = e("./MarkupEditor"),
            i = e("./MarkupManager"),
            a = e("./MarkupVirtualPad"),
            r = e("./MarkupIO"),
            s = e("./Mouse"),
            l = s.MouseButtons,
            c = function() {
                function e(t, n) {
                    var r = this;
                    this.getIsDesktop = function() {
                        var e = navigator.userAgent,
                            t = /(?:Windows Phone)/.test(e),
                            n = /(?:SymbianOS)/.test(e) || t,
                            o = /(?:Android)/.test(e),
                            i = /(?:Firefox)/.test(e),
                            a = (/(?:Chrome|CriOS)/.test(e), /(?:iPad|PlayBook)/.test(e) || o && !/(?:Mobile)/.test(e) || i && /(?:Tablet)/.test(e));
                        return !(/(?:iPhone)/.test(e) && !a || o || n || a)
                    }, this.work = !1, this.alwaysMode = !1, this.restoreState = !1, this.firstTouch = 0, this.modelViewer = t, this.canvas = document.createElement("canvas"), this.canvas.id = "markup", this.canvas.style.zIndex = 10, this.canvas.width = n.clientWidth, this.canvas.height = n.clientHeight, this.canvas.style.position = "absolute", this.canvas.style.top = "0", this.canvas.style.left = "0", this.ctx = this.canvas.getContext("2d"), this.wrapDom = n, this.canvas.style.display = "none", e.isMobile = !this.getIsDesktop(), n.appendChild(this.canvas), this.bindEvent();
                    var s = this;
                    this.viewer = t.getViewer ? t.getViewer() : t, this.viewer.wrapDom = n, this.MarkupVirtualPad = new a.default(this.viewer, n, e.isMobile), this.viewer.markupManager = this.markupManager = new i.default(this.MarkupVirtualPad, this), this.editor = this.viewer.markupEditor = new o.default(this.canvas, this.markupManager, this.MarkupVirtualPad), this.editor.markupManager = this.viewer.markupManager, this.viewer.onSelectChange = function(e) {}, this.viewer.onClick = function(e) {}, window.onresize = function() { s.canvas.width = n.clientWidth, s.canvas.height = n.clientHeight, s.MarkupVirtualPad.canvas.width = n.clientWidth, s.MarkupVirtualPad.canvas.height = n.clientHeight, s.modelViewer.resize(), s.update() }, e.isMobile && (this.offsetHeight = this.wrapDom.offsetHeight, setInterval(function() {
                        var e = r.wrapDom.offsetHeight;
                        r.offsetHeight != e && (r.offsetHeight = e, r.resize())
                    }, 1e3))
                }
                return e.prototype.resize = function() { this.editor.tool.reposition && this.editor.tool.reposition(this.viewer) }, e.prototype.getContainerSize = function() { return this.wrapDom.getBoundingClientRect() }, e.prototype.hideCanvas = function() { this.canvas.style.display = "none" }, e.prototype.showCanvas = function() { this.canvas.style.display = "block" }, e.prototype.startDrawing = function() { this.work = !0, this.alwaysMode = !1, this.showCanvas() }, e.prototype.switchMode = function() {}, e.prototype.initStyle = function() {
                    var e = this.viewer.markupManager;
                    e.markups = [], e.strokeStyle = "red", e.lineWidth = 3, e.fontSize = 14, e.fontFamily = "Arial", e.fillStyle = "white", e.enableFillStyle = !1
                }, e.prototype.update = function() { this.editor.redraw(this.viewer) }, e.prototype.bindEvent = function() { this.getIsDesktop() ? (this.wrapDom.addEventListener("mousedown", this.onMouseDown.bind(this), !0), this.wrapDom.addEventListener("mouseup", this.onMouseUp.bind(this), !1), this.wrapDom.addEventListener("mousemove", this.onMouseMove.bind(this), !1), this.wrapDom.addEventListener("mousewheel", this.onMouseWheel.bind(this), !1), this.wrapDom.addEventListener("DOMMouseScroll", this.onMouseWheel.bind(this), !1), this.wrapDom.addEventListener("contextmenu", this.oncontextmenu.bind(this), !1)) : (this.wrapDom.addEventListener("touchstart", this.onTouchstart.bind(this), !0), this.wrapDom.addEventListener("touchend", this.onTouchend.bind(this), !0), this.wrapDom.addEventListener("touchmove", this.onTouchmove.bind(this), !0)), document.addEventListener("keydown", this.onKeyDown.bind(this)), document.addEventListener("keyup", this.onKeyUp.bind(this)) }, e.prototype.endDrawing = function() {
                    this.work = !1, this.clearAnnotations(), this.editor.redraw(this.viewer), this.hideCanvas(), this.switchMode();
                    var e = document.querySelector("#bf-drawing-textEditor");
                    if (e) {
                        var t = e.querySelectorAll("textarea");
                        t.length && (t[t.length - 1].style.display = "none", t[t.length - 1].value = "")
                    }
                }, e.prototype.clearAnnotations = function() { this.markupManager.clear(), this.update() }, e.prototype.removeSelectedAnnotation = function() {-1 != this.editor.editIndex && (this.markupManager.remove(this.editor.editIndex), this.editor.editIndex = -1, this.update()) }, e.prototype.createSnapshot = function(e) {}, e.prototype.showAnnotation = function() {}, e.prototype.setAnnotationType = function(e) { this.editor.setMarkupType(e) }, e.prototype.setAnnotationStyle = function(e) { e["stroke-color"] && this.markupManager.setColor(e["stroke-color"]), e["font-size"] && this.markupManager.setFontSize(e["font-size"]), e["stroke-width"] && this.markupManager.setLineWidth(e["stroke-width"]), e["fill-color"] && this.markupManager.setFillColor(e["fill-color"]), e["font-family"] && this.markupManager.setFontFamily(e["font-family"]) }, e.prototype.getAnnotationList = function() { return this.markupManager.markups.slice() }, e.prototype.setAnnotationList = function(e) {
                    var t = e[0];
                    if (!t) return this.clearAnnotations();
                    if (t.drawPoints && "number" == typeof t.drawPoints[0])
                        for (var n = 0; n < e.length; n++) {
                            for (var o = e[n].drawPoints, i = [], a = 0; a < o.length; a += 2) i.push([o[a], o[a + 1]]);
                            e[n].drawPoints = i
                        }
                    t && t.draw || (e = r.default.transform2markups(e)), this.markupManager.setMarkups(e), this.restoreState = !0, this.showCanvas(), this.update()
                }, e.prototype.editAnnotationEnd = function() { this.endDrawing() }, e.prototype.getCurrentState = function() { return { annotationList: this.getAnnotationList(), state: this.modelViewer.getCurrentState() } }, e.prototype.transform = function(e) { return e }, e.prototype.setState = function(e) {
                    var t = this;
                    this.clearAnnotations(), this.modelViewer.setState(e.state), setTimeout(function() {
                        if ("string" == typeof e.annotationList) {
                            var n = t.markupManager.fromString(e.annotationList);
                            t.setAnnotationList(n)
                        } else e.annotationList[0].id ? t.setAnnotationList(t.transform(e.annotationList)) : t.setAnnotationList(e.annotationList)
                    }, 1500)
                }, e.prototype.oncontextmenu = function(e) { e.preventDefault() }, e.prototype.onDoubleClick = function(e) { this.alwaysMode || (!this.work && this.restoreState && (this.restoreState = !1, this.endDrawing()), e.preventDefault(), this.editor.onDoubleClick(this.viewer, e)) }, e.prototype.onMouseDown = function(e) {
                    if (!this.alwaysMode && (!this.work && this.restoreState && (this.restoreState = !1, this.endDrawing()), this.work && e.target == this.canvas))
                        if (e.preventDefault(), e.buttons == l.LelftButton) {
                            e.stopPropagation();
                            var t = Date.now(),
                                n = [e.clientX, e.clientY];
                            t - this.prevTime < 500 && this.prevPoint[0] == n[0] ? this.onDoubleClick(e) : (this.prevTime = t, this.prevPoint = n, this.editor.onMouseDown(this.viewer, e))
                        } else this.editor.onMouseDown(this.viewer, e)
                }, e.prototype.onTouchstart = function(e) {
                    if (!this.alwaysMode && "CANVAS" == e.target.tagName.toUpperCase()) {
                        var t = Date.now();
                        if (t - this.firstTouch < 500) return void this.editor.onDoubleTouch(this.viewer, e);
                        this.firstTouch = t, !this.work && this.restoreState && (this.restoreState = !1, this.endDrawing()), this.work && e.target == this.canvas && (e.preventDefault(), e.buttons == l.LelftButton && e.stopPropagation(), this.editor.onTouchstart(this.viewer, e), this.containerSize = this.getContainerSize())
                    }
                }, e.prototype.onMouseMove = function(e) {
                    if (this.alwaysMode) return void this.update();
                    this.work && (e.preventDefault(), e.stopPropagation(), this.editor.onMouseMove(this.viewer, e))
                }, e.prototype.onTouchmove = function(e) {
                    if (this.alwaysMode || "CANVAS" != e.target.tagName.toUpperCase()) return void this.update();
                    if (this.work) {
                        var t = e.touches[0],
                            n = this.containerSize,
                            o = n.left,
                            i = n.top,
                            a = n.width,
                            r = n.height;
                        e.preventDefault(), e.stopPropagation(), t.pageX > o && t.pageX < o + a && t.pageY > i && t.pageY < i + r && this.editor.onTouchmove(this.viewer, e)
                    }
                }, e.prototype.onTouchend = function(e) { this.alwaysMode || "CANVAS" != e.target.tagName.toUpperCase() || (!this.work && this.restoreState && (this.restoreState = !1, this.endDrawing()), this.work && (e.preventDefault(), e.stopPropagation(), this.editor.onTouchend(this.viewer, e))) }, e.prototype.onMouseWheel = function(e) { this.alwaysMode || (!this.work && this.restoreState && (this.restoreState = !1, this.endDrawing()), this.work && (e.preventDefault(), e.stopPropagation(), this.editor.onMouseWheel(this.viewer, e))) }, e.prototype.onMouseUp = function(e) { if (this.alwaysMode) return void this.editor.onMouseUp(this.viewer, e, !0);!this.work && this.restoreState && (this.restoreState = !1, this.endDrawing()), this.work && (e.preventDefault(), e.stopPropagation(), this.editor.onMouseUp(this.viewer, e, !0)) }, e.prototype.onKeyDown = function(e) { this.work && ("textarea" != document.activeElement.tagName.toLowerCase() && e.stopPropagation(), this.editor.onKeyDown(this.viewer, e)) }, e.prototype.onKeyUp = function(e) { this.work && "textarea" != document.activeElement.tagName.toLowerCase() && (e.preventDefault(), e.stopPropagation()) }, e
            }();
        n.MarkupViewer = c
    }, { "./MarkupEditor": 13, "./MarkupIO": 14, "./MarkupManager": 15, "./MarkupVirtualPad": 20, "./Mouse": 23 }],
    18: [function(e, t, n) {
        var o = this && this.__extends || function() {
            var e = function(t, n) {
                return (e = Object.setPrototypeOf || { __proto__: [] }
                    instanceof Array && function(e, t) { e.__proto__ = t } || function(e, t) { for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]) })(t, n)
            };
            return function(t, n) {
                function o() { this.constructor = t }
                e(t, n), t.prototype = null === n ? Object.create(n) : (o.prototype = n.prototype, new o)
            }
        }();
        Object.defineProperty(n, "__esModule", { value: !0 });
        var i = e("./MarkupViewer"),
            a = e("./ArrowMarkup/ArrowMarkup"),
            r = e("./EllipsMarkup/EllipsMarkup"),
            s = e("./RectMarkup/RectMarkup"),
            l = e("./CrossMarkup/CrossMarkup"),
            c = e("./CloudMarkup/CloudMarkup"),
            d = e("./CloudRectMarkup/CloudRectMarkup"),
            u = e("./TextMarkup/TextMarkup"),
            p = e("./Mouse"),
            f = p.MouseButtons,
            h = function(e) {
                function t(t, n) { var o = e.call(this, t, n) || this; return o.absoluteBasePoint = null, o.screenBasePoint = null, o.zoomFactor = { x: 1, y: 1 }, o.viewBox = { width: 1e3, height: 1e3 }, o.viewer.clientToWorldPoint = function(e) { var t = o.viewer.clientToWorld({ x: e[0], y: e[1] }); return [t.x, t.y] }, o.viewer.worldToClientPoint = function(e) { var t = o.viewer.worldToClient({ x: e[0], y: e[1] }); return [t.x, t.y] }, o }
                return o(t, e), t.prototype.onMouseUp = function(e) {!this.work && this.restoreState && (this.restoreState = !1, this.endDrawing()), this.work && this.editor.onMouseUp(this.viewer, e) }, t.prototype.setState = function(e) {
                    if (this.modelViewer.setState(e.state), "string" == typeof e.annotationList) {
                        var t = this.markupManager.fromString(e.annotationList);
                        this.setAnnotationList(t)
                    } else e.annotationList[0].id ? this.setAnnotationList(this.transform(e.annotationList)) : this.setAnnotationList(e.annotationList)
                }, t.prototype.createSnapshot = function(e) {
                    var t = this;
                    this.viewer._imageRender.createSnapshotAsync("", function(n) { t.getScreenSnapshot(n, e) })
                }, t.prototype.getScreenSnapshot = function(e, t) {
                    var n = document.createElement("canvas"),
                        o = this.getContainerOffsetToClient(this.wrapDom);
                    n.width = o.width, n.height = o.height;
                    var i = n.getContext("2d"),
                        a = this;
                    if (t && e) {
                        var r = new Image;
                        return r.onload = function() {
                            i.drawImage(r, 0, 0), i.drawImage(a.canvas, 0, 0);
                            var e = n.toDataURL("image/png");
                            n = i = null, t(e)
                        }, r.src = e, null
                    }
                    if (e) {
                        var r = new Image;
                        r.src = e, i.drawImage(r, 0, 0)
                    }
                    i.drawImage(this.canvas, 0, 0);
                    var s = n.toDataURL("image/png");
                    return n = i = null, s
                }, t.prototype.transform = function(e) {
                    for (var t = [], n = 0; n < e.length; n++) {
                        var o, i = e[n],
                            p = i.style,
                            f = p["fill-opacity"];
                        switch (i.shapeType) {
                            case 0:
                                var h = this.getArrowPoints(i.size, i.position, -i.rotation);
                                o = new a.default(h, p["stroke-color"], p["stroke-width"], i.rotation);
                                break;
                            case 7:
                                o = new d.default(this.getDrawPoints(i.size, i.position), p["stroke-color"], p["stroke-width"], i.rotation, f && p["fill-color"]);
                                break;
                            case 4:
                                var m = this.getCloudPoints(i);
                                o = new c.default(m[0], p["stroke-color"], p["stroke-width"], m[1], i.rotation, f && p["fill-color"]);
                                break;
                            case 1:
                                o = new s.default(this.getDrawPoints(i.size, i.position), p["stroke-color"], p["stroke-width"], i.rotation, f && p["fill-color"]);
                                break;
                            case 2:
                                o = new r.default(this.getDrawPoints(i.size, i.position), p["stroke-color"], p["stroke-width"], i.rotation, f && p["fill-color"]);
                                break;
                            case 3:
                                o = new l.default(this.getDrawPoints(i.size, i.position), p["stroke-color"], p["stroke-width"], i.rotation);
                                break;
                            case 5:
                                var g = this.worldToClient({ x: i.position.x - .5 * i.size.width, y: i.position.y + .5 * i.size.height, z: i.position.z }),
                                    b = this.worldToClient(i.position),
                                    v = this.viewer.clientToWorldPoint([b.x, b.y]);
                                o = new u.default(this.viewer.clientToWorldPoint([g.x, g.y]), decodeURIComponent(i.text), p["stroke-color"], p["font-size"], p["font-family"], i.rotation, null, v)
                        }
                        t.push(o)
                    }
                    return t
                }, t.prototype.getContainerOffsetToClient = function(e) {
                    var t, n = function(e) {
                            for (var t = 0, n = 0; e;) t += e.offsetTop, n += e.offsetLeft, e = e.offsetParent;
                            var o = document.body,
                                i = document.documentElement,
                                a = window.pageYOffset || i.scrollTop || o.scrollTop,
                                r = window.pageXOffset || i.scrollLeft || o.scrollLeft;
                            return t -= a, n -= r, { top: t, left: n }
                        },
                        o = function(e) {
                            var t = e.getBoundingClientRect(),
                                n = document.body,
                                o = document.documentElement,
                                i = o.clientTop || n.clientTop,
                                a = o.clientLeft || n.clientLeft,
                                r = t.top - i,
                                s = t.left - a;
                            return { top: Math.round(r), left: Math.round(s) }
                        };
                    if (e != document) {
                        var i = function(e) { return e.getBoundingClientRect ? o(e) : n(e) }(e);
                        t = { width: e.offsetWidth, height: e.offsetHeight, left: i.left, top: i.top }
                    } else t = { width: window.innerWidth, height: window.innerHeight, left: 0, top: 0 };
                    return t
                }, t.prototype.getCloudPoints = function(e) {
                    for (var t = e.size.width / e.originSize.width, n = e.size.height / e.originSize.height, o = (new window.THREE.Matrix4).makeScale(t, n, 1), i = (new window.THREE.Matrix4).makeRotationZ(-e.rotation), a = (new window.THREE.Matrix4).makeTranslation(e.position.x, e.position.y, e.position.z), r = a.multiply(i).multiply(o), s = e.shapePoints.split(","), l = [], c = [], d = !0, u = (e.position, 1); u < s.length; u += 2) {
                        var p = new window.THREE.Vector3,
                            f = this.viewBoxToWorld({ x: parseInt(s[u - 1]), y: parseInt(s[u]) }, e.originSize);
                        p.x = f.x, p.y = f.y, p.z = 0, p.applyMatrix4(r);
                        var h = this.worldToClient(p),
                            m = this.viewer.clientToWorldPoint([h.x, h.y]);
                        d ? l.push(m) : c.push(m), d = !d
                    }
                    return [l, c]
                }, t.prototype.worldToClient = function(e) {
                    var t = this.getContainerOffsetToClient(this.wrapDom),
                        n = new window.THREE.Vector3,
                        o = this.absoluteBasePoint,
                        i = this.screenBasePoint;
                    return this.absoluteBasePoint || (o = { x: 0, y: 0 }), this.screenBasePoint || (i = { x: .5 * t.width, y: .5 * t.height }), n.x = (e.x - o.x) * this.zoomFactor.x + i.x, n.y = (-e.y - o.y) * this.zoomFactor.y + i.y, n.z = 0, n
                }, t.prototype.viewBoxToWorld = function(e, t) {
                    var n = t.width,
                        o = t.height,
                        i = this.viewBox.width,
                        a = this.viewBox.height;
                    return { x: e.x / i * n, y: e.y / a * o }
                }, t.prototype.getDrawPoints = function(e, t) {
                    var n = this.worldToClient({ x: t.x - .5 * e.width, y: t.y - .5 * e.height, z: t.z }),
                        o = this.worldToClient({ x: t.x + .5 * e.width, y: t.y + .5 * e.height, z: t.z });
                    return [this.viewer.clientToWorldPoint([n.x, n.y]), this.viewer.clientToWorldPoint([o.x, o.y])]
                }, t.prototype.getArrowPoints = function(e, t, n) {
                    var o = this.worldToClient({ x: t.x - .5 * e.width, y: t.y, z: t.z }),
                        i = this.worldToClient({ x: t.x + .5 * e.width, y: t.y, z: t.z }),
                        a = this.worldToClient(t);
                    return o = this.markupManager.rotateTransform(a.x, a.y, n, o.x, o.y), i = this.markupManager.rotateTransform(a.x, a.y, n, i.x, i.y), [this.viewer.clientToWorldPoint(o), this.viewer.clientToWorldPoint(i)]
                }, t.prototype.onMouseDown = function(e) {
                    if (!this.work && this.restoreState && (this.restoreState = !1, this.endDrawing()), this.work && e.target == this.canvas)
                        if (e.preventDefault(), e.buttons == f.LelftButton) {
                            e.stopPropagation();
                            var t = Date.now(),
                                n = [e.clientX, e.clientY];
                            t - this.prevTime < 500 && this.prevPoint[0] == n[0] ? this.onDoubleClick(e) : (this.prevTime = t, this.prevPoint = n, this.editor.onMouseDown(this.viewer, e))
                        } else this.editor.onMouseDown(this.viewer, e)
                }, t.prototype.onMouseWheel = function(e) { this.work && (e.preventDefault(), this.update(), this.editor.onMouseWheel(this.viewer, e)) }, t
            }(i.MarkupViewer);
        n.MarkupViewer2D = h, window.MarkupViewer2D = h
    }, { "./ArrowMarkup/ArrowMarkup": 1, "./CloudMarkup/CloudMarkup": 3, "./CloudRectMarkup/CloudRectMarkup": 5, "./CrossMarkup/CrossMarkup": 7, "./EllipsMarkup/EllipsMarkup": 9, "./MarkupViewer": 17, "./Mouse": 23, "./RectMarkup/RectMarkup": 26, "./TextMarkup/TextMarkup": 28 }],
    19: [function(e, t, n) {
        var o = this && this.__extends || function() {
            var e = function(t, n) {
                return (e = Object.setPrototypeOf || { __proto__: [] }
                    instanceof Array && function(e, t) { e.__proto__ = t } || function(e, t) { for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]) })(t, n)
            };
            return function(t, n) {
                function o() { this.constructor = t }
                e(t, n), t.prototype = null === n ? Object.create(n) : (o.prototype = n.prototype, new o)
            }
        }();
        Object.defineProperty(n, "__esModule", { value: !0 });
        var i = e("./MarkupViewer"),
            a = e("./ArrowMarkup/ArrowMarkup"),
            r = e("./EllipsMarkup/EllipsMarkup"),
            s = e("./RectMarkup/RectMarkup"),
            l = e("./CrossMarkup/CrossMarkup"),
            c = e("./CloudMarkup/CloudMarkup"),
            d = e("./CloudRectMarkup/CloudRectMarkup"),
            u = e("./TextMarkup/TextMarkup"),
            p = e("./Mouse"),
            f = (p.MouseButtons, function(e) {
                function t(t, n) {
                    var o = e.call(this, t, n) || this;
                    return o.cameraControl = o.viewer.cameraControl, o.viewBox = { width: 1e3, height: 1e3 }, o.viewer.clientToWorldPoint = function(e) {
                        var t = { x: e[0], y: e[1], z: 0 },
                            n = o.viewer.canvasToWorld(t);
                        return [n.x, n.y, n.z]
                    }, o.viewer.worldToClientPoint = function(e) {
                        var t = { x: e[0], y: e[1], z: e[2] || 0 },
                            n = o.viewer.worldToCanvas(t);
                        return [n.x, n.y]
                    }, o
                }
                return o(t, e), t.prototype.bindEvent = function() { this.getIsDesktop() ? (this.wrapDom.addEventListener("dblclick", this.onDoubleClick.bind(this), !0), this.wrapDom.addEventListener("mousedown", this.onMouseDown.bind(this), !0), this.wrapDom.addEventListener("mouseup", this.onMouseUp.bind(this), !0), this.wrapDom.addEventListener("mousemove", this.onMouseMove.bind(this), !0), this.wrapDom.addEventListener("mousewheel", this.onMouseWheel.bind(this), !0), this.wrapDom.addEventListener("DOMMouseScroll", this.onMouseWheel.bind(this), !0), this.wrapDom.addEventListener("contextmenu", this.oncontextmenu.bind(this), !0), document.addEventListener("keydown", this.onKeyDown.bind(this), !0), document.addEventListener("keyup", this.onKeyUp.bind(this), !0)) : (this.wrapDom.addEventListener("touchstart", this.onTouchstart.bind(this), !0), this.wrapDom.addEventListener("touchend", this.onTouchend.bind(this), !0), this.wrapDom.addEventListener("touchmove", this.onTouchmove.bind(this), !0)) }, t.prototype.createSnapshot = function(e) {
                    var t = this.wrapDom.querySelector(".bf-view canvas"),
                        n = document.createElement("canvas");
                    n.width = this.wrapDom.clientWidth, n.height = this.wrapDom.clientHeight;
                    var o = n.getContext("2d");
                    o.beginPath();
                    var i = window.devicePixelRatio || 1;
                    o.drawImage(t, 0, 0, n.width * i, n.height * i, 0, 0, n.width, n.height), o.drawImage(this.canvas, 0, 0), e(n.toDataURL())
                }, t.prototype.transform = function(e) {
                    for (var t = [], n = 0; n < e.length; n++) {
                        var o, i = e[n],
                            p = i.style,
                            f = p["fill-opacity"];
                        switch (i.shapeType) {
                            case 0:
                                var h = this.getArrowPoints(i.size, i.position, -i.rotation);
                                o = new a.default(h, p["stroke-color"], p["stroke-width"], i.rotation);
                                break;
                            case 7:
                                o = new d.default(this.getDrawPoints(i.size, i.position), p["stroke-color"], p["stroke-width"], i.rotation, f && p["fill-color"]);
                                break;
                            case 4:
                                var m = this.getCloudPoints(i);
                                o = new c.default(m[0], p["stroke-color"], p["stroke-width"], m[1], i.rotation, f && p["fill-color"], !0), o.close = !0;
                                break;
                            case 1:
                                o = new s.default(this.getDrawPoints(i.size, i.position), p["stroke-color"], p["stroke-width"], i.rotation, f && p["fill-color"]);
                                break;
                            case 2:
                                o = new r.default(this.getDrawPoints(i.size, i.position), p["stroke-color"], p["stroke-width"], i.rotation, f && p["fill-color"]);
                                break;
                            case 3:
                                o = new l.default(this.getDrawPoints(i.size, i.position), p["stroke-color"], p["stroke-width"], i.rotation);
                                break;
                            case 5:
                                var g = this.worldToClient({ x: i.position.x - .5 * i.size.width, y: i.position.y + .5 * i.size.height, z: i.position.z }),
                                    b = this.worldToClient(i.position),
                                    v = this.viewer.clientToWorldPoint([b.x, b.y]);
                                o = new u.default(this.viewer.clientToWorldPoint([g.x, g.y]), decodeURIComponent(i.text), p["stroke-color"], p["font-size"], p["font-family"], i.rotation, null, v)
                        }
                        t.push(o)
                    }
                    return t
                }, t.prototype.getCloudPoints = function(e) {
                    for (var t = e.size.width / e.originSize.width, n = e.size.height / e.originSize.height, o = (new window.THREE.Matrix4).makeScale(t, n, 1), i = (new window.THREE.Matrix4).makeRotationZ(-e.rotation), a = (new window.THREE.Matrix4).makeTranslation(e.position.x, e.position.y, e.position.z), r = a.multiply(i).multiply(o), s = e.shapePoints.split(","), l = [], c = [], d = !0, u = (e.position, 1); u < s.length; u += 2) {
                        var p = new window.THREE.Vector3,
                            f = this.viewBoxToWorld({ x: parseInt(s[u - 1]), y: parseInt(s[u]) }, e.originSize);
                        p.x = f.x, p.y = f.y, p.z = 0, p.applyMatrix4(r);
                        var h = this.worldToClient(p),
                            m = this.viewer.clientToWorldPoint([h.x, h.y]);
                        d ? l.push(m) : c.push(m), d = !d
                    }
                    return [l, c]
                }, t.prototype.viewBoxToWorld = function(e, t) {
                    var n = t.width,
                        o = t.height,
                        i = this.viewBox.width,
                        a = this.viewBox.height;
                    return { x: e.x / i * n, y: e.y / a * o }
                }, t.prototype.getDrawPoints = function(e, t) {
                    var n = this.worldToClient({ x: t.x - .5 * e.width, y: t.y - .5 * e.height, z: t.z }),
                        o = this.worldToClient({ x: t.x + .5 * e.width, y: t.y + .5 * e.height, z: t.z });
                    return [this.viewer.clientToWorldPoint([n.x, n.y]), this.viewer.clientToWorldPoint([o.x, o.y])]
                }, t.prototype.getArrowPoints = function(e, t, n) {
                    var o = this.worldToClient({ x: t.x - .5 * e.width, y: t.y, z: t.z }),
                        i = this.worldToClient({ x: t.x + .5 * e.width, y: t.y, z: t.z }),
                        a = this.worldToClient(t);
                    return o = this.markupManager.rotateTransform(a.x, a.y, n, o.x, o.y), i = this.markupManager.rotateTransform(a.x, a.y, n, i.x, i.y), [this.viewer.clientToWorldPoint(o), this.viewer.clientToWorldPoint(i)]
                }, t.prototype.worldToClient = function(e) {
                    var t = this.getContainerOffsetToClient(this.wrapDom),
                        n = this.cameraControl.getCamera(),
                        o = new window.THREE.Vector3(e.x, e.y, e.z);
                    return o.applyMatrix4(n.matrixWorld), o.sub(n.position), o.project(n), o.x = Math.floor(.5 * (o.x + 1) * t.width + .5), o.y = Math.floor(-.5 * (o.y - 1) * t.height + .5), o.z = 0, o
                }, t.prototype.getContainerOffsetToClient = function(e) {
                    var t, n = function(e) {
                            for (var t = 0, n = 0; e;) t += e.offsetTop, n += e.offsetLeft, e = e.offsetParent;
                            var o = document.body,
                                i = document.documentElement,
                                a = window.pageYOffset || i.scrollTop || o.scrollTop,
                                r = window.pageXOffset || i.scrollLeft || o.scrollLeft;
                            return t -= a, n -= r, { top: t, left: n }
                        },
                        o = function(e) {
                            var t = e.getBoundingClientRect(),
                                n = document.body,
                                o = document.documentElement,
                                i = o.clientTop || n.clientTop,
                                a = o.clientLeft || n.clientLeft,
                                r = t.top - i,
                                s = t.left - a;
                            return { top: Math.round(r), left: Math.round(s) }
                        };
                    if (e != document) {
                        var i = function(e) { return e.getBoundingClientRect ? o(e) : n(e) }(e);
                        t = { width: e.offsetWidth, height: e.offsetHeight, left: i.left, top: i.top }
                    } else t = { width: window.innerWidth, height: window.innerHeight, left: 0, top: 0 };
                    return t
                }, t
            }(i.MarkupViewer));
        n.MarkupViewer3D = f, window.MarkupViewer3D = f
    }, { "./ArrowMarkup/ArrowMarkup": 1, "./CloudMarkup/CloudMarkup": 3, "./CloudRectMarkup/CloudRectMarkup": 5, "./CrossMarkup/CrossMarkup": 7, "./EllipsMarkup/EllipsMarkup": 9, "./MarkupViewer": 17, "./Mouse": 23, "./RectMarkup/RectMarkup": 26, "./TextMarkup/TextMarkup": 28 }],
    20: [function(e, t, n) {
        Object.defineProperty(n, "__esModule", { value: !0 });
        var o = e("./MarkupViewer"),
            i = function() {
                function e(e, t, n) { this.isMobile = n, this.canvas = document.createElement("canvas"), this.viewer = e, this.canvas.id = "markupVirtual", this.canvas.width = t.clientWidth, this.canvas.height = t.clientHeight, document.body.appendChild(this.canvas), this.canvas.style.display = "none", this.ctx = this.canvas.getContext("2d"), this.lineWidth = o.MarkupViewer.isMobile ? 36 : 2 }
                return e.prototype.init = function(e, t) {
                    var n = this.ctx;
                    n.save(), n.translate(e[0], e[1]), n.rotate(t), n.beginPath()
                }, e.prototype.drawEdit = function(e, t, n, o, i, a, r, s, l) {
                    var c = this.ctx;
                    if (c.save(), c.translate(n[0], n[1]), "Arrow" != o.markupType && c.rotate(o.rotation), c.beginPath(), c.lineWidth = o.lineWidth + 2, c.fillStyle = "rgba(" + (2 * a + 2) + ",255,255,1)", c.fillRect(-.5 * (t[0] - e[0]), -.5 * (t[1] - e[1]), t[0] - e[0], t[1] - e[1]), c.fillStyle = c.strokeStyle = "rgba(" + (2 * a + 2) + ",100,255,1)", c.arc(0, e[1] - n[1] - 20, 13, 0, 2 * Math.PI, !1), c.fill(), "Arrow" == o.markupType) c.fillStyle = c.strokeStyle = "rgba(" + (2 * a + 2) + ",110,255,1)", c.beginPath(), c.arc(i[0] - n[0] + (i[0] < i[2] ? -r / 2 : r / 2), i[1] - n[1] + (i[1] < i[3] ? -s / 2 : s / 2), 10, 0, 2 * Math.PI, !1), c.fill(), c.stroke(), c.closePath(), c.fillStyle = c.strokeStyle = "rgba(" + (2 * a + 2) + ",150,255,1)", c.beginPath(), c.arc(i[2] - n[0] + (i[0] < i[2] ? r : -r), i[3] - n[1] + (i[1] < i[3] ? s : -s), 10, 0, 2 * Math.PI, !1), c.fill(), c.stroke(), c.closePath();
                    else
                        for (var d = 0; d < i.length; d += 2) {
                            c.fillStyle = c.strokeStyle = "rgba(" + (2 * a + 2) + "," + (5 * d + 110) + ",255,1)", c.beginPath();
                            var u = [i[d], i[d + 1]],
                                p = this.isMobile ? 10 : 3;
                            switch (d) {
                                case 0:
                                    c.arc(u[0] - n[0] - l, u[1] - n[1] - l, p, 0, 2 * Math.PI, !1);
                                    break;
                                case 2:
                                    c.arc(u[0] - n[0] - l, u[1] - n[1], p, 0, 2 * Math.PI, !1);
                                    break;
                                case 4:
                                    c.arc(u[0] - n[0] - l, u[1] - n[1] + l, p, 0, 2 * Math.PI, !1);
                                    break;
                                case 6:
                                    c.arc(u[0] - n[0], u[1] - n[1] + l, p, 0, 2 * Math.PI, !1);
                                    break;
                                case 8:
                                    c.arc(u[0] - n[0] + l, u[1] - n[1] + l, p, 0, 2 * Math.PI, !1);
                                    break;
                                case 10:
                                    c.arc(u[0] - n[0] + l, u[1] - n[1], p, 0, 2 * Math.PI, !1);
                                    break;
                                case 12:
                                    c.arc(u[0] - n[0] + l, u[1] - n[1] - l, p, 0, 2 * Math.PI, !1);
                                    break;
                                case 14:
                                    c.arc(u[0] - n[0], u[1] - n[1] - l, p, 0, 2 * Math.PI, !1)
                            }
                            c.fill(), c.stroke(), c.closePath()
                        }
                    c.restore()
                }, e.prototype.drawArrow = function(e, t, n, i, a, r, s, l, c, d, u, p, f, h) {
                    var m = t - r,
                        g = n - s,
                        b = this.ctx;
                    b.save(), b.lineWidth = o.MarkupViewer.isMobile ? 36 : e.lineWidth + this.lineWidth, b.strokeStyle = "rgba(" + (2 * p + 2) + ",20,20,1)", b.fillStyle = "rgba(" + (2 * p + 2) + ",20,255,1)", b.beginPath(), b.moveTo(t, n), b.lineTo(i, a), m = i + r, g = a + s, b.moveTo(m, g), b.lineTo(i, a), m = i + l, g = a + c, b.lineTo(m, g), b.stroke(), b.restore()
                }, e.prototype.drawRect = function(e, t, n, i, a, r) {
                    var s = this.ctx;
                    s.save(), s.translate(i[0], i[1]), s.rotate(a), s.beginPath(), s.lineWidth = o.MarkupViewer.isMobile ? 36 : e.lineWidth + this.lineWidth, s.strokeStyle = "rgba(" + (2 * r + 2) + ",10,10,1)", s.fillStyle = "rgba(" + (2 * r + 2) + ",10,255,1)", s.rect(-.5 * (n[0] - t[0]), -.5 * (n[1] - t[1]), n[0] - t[0], n[1] - t[1]), s.closePath(), s.stroke(), s.restore()
                }, e.prototype.drawCross = function(e, t, n, o, i) {
                    var a = this.ctx;
                    a.save(), a.translate(n[0], n[1]), a.rotate(o), a.strokeStyle = "rgba(" + (2 * i + 2) + ",30,30,1)", a.fillStyle = "rgba(" + (2 * i + 2) + ",30,255,1)", a.beginPath(), a.moveTo(-.5 * (t[0] - e[0]), -.5 * (t[1] - e[1])), a.lineTo(.5 * (t[0] - e[0]), .5 * (t[1] - e[1])), a.moveTo(-.5 * (t[0] - e[0]), .5 * (t[1] - e[1])), a.lineTo(.5 * (t[0] - e[0]), -.5 * (t[1] - e[1])), a.stroke(), a.restore()
                }, e.prototype.drawCloudRect = function(e, t, n, o, i) {
                    var a = this.ctx;
                    a.moveTo(e, t), a.quadraticCurveTo(n[0], n[1], o[0], o[1])
                }, e.prototype.drawEllips = function(e, t, n, o, i, a, r) {
                    var s = this.ctx;
                    s.save(), s.strokeStyle = "rgba(" + (2 * i + 2) + ",50,50,1)", s.fillStyle = "rgba(" + (2 * i + 2) + ",50,255,1)", s.translate(n[0], n[1]), s.rotate(o), s.beginPath(), s.ellipse(0, 0, a, r, 0, 0, 2 * Math.PI), s.closePath(), s.stroke(), s.restore()
                }, e.prototype.drawPolyline = function(e, t, n, o, i) {
                    var a = this.ctx;
                    a.strokeStyle = "rgba(" + (2 * i + 2) + ",70,70,1)", a.moveTo(e[0] - n[0], e[1] - n[1]), a.lineTo(t[0] - n[0], t[1] - n[1]), a.stroke()
                }, e.prototype.isEdge = function(e, t) {
                    var n = this.ctx.getImageData(e, t, 1, 1),
                        o = n.data,
                        i = o[0],
                        a = o[1],
                        r = o[2],
                        s = o[3];
                    return r == a && a < 100 && r % 10 == 0 && i >= 2 && 255 == s
                }, e.prototype.hitTest = function(e, t) {
                    var n = this.ctx.getImageData(e, t, 1, 1),
                        o = n.data,
                        i = o[0],
                        a = o[1],
                        r = o[2],
                        s = o[3];
                    return i + a + r < 3 ? -1 : r == a && a < 100 && r % 10 == 0 && i >= 2 && 255 == s ? (i - 2) / 2 : 255 == r && a > 99 ? (i - 2) / 2 : void 0
                }, e.prototype.hitGrip = function(e, t) {
                    var n = this.ctx.getImageData(e, t, 1, 1),
                        o = n.data,
                        i = o[0],
                        a = o[1],
                        r = o[2];
                    if (i + a + r + o[3] < 3) return -1;
                    if (255 == r) { if (100 == a) return 9; if (255 == a) return 10; if (a > 100) return (a - 110) / 10 }
                    return -1
                }, e
            }();
        n.MarkupVirtualPad = i, n.default = i
    }, { "./MarkupViewer": 17 }],
    21: [function(e, t, n) {
        Object.defineProperty(n, "__esModule", { value: !0 });
        var o = function() {
            function e() {}
            return e.prototype.getCenter = function(e) {
                var t = e.worldToClientPoint(this.drawPoints[0]),
                    n = e.worldToClientPoint(this.drawPoints[1]);
                return [(t[0] + n[0]) / 2, (t[1] + n[1]) / 2]
            }, e.prototype.setColor = function(e) { e && (this.highLight = e) }, e.prototype.getColor = function() { return this.strokeStyle }, e
        }();
        n.default = o
    }, {}],
    22: [function(e, t, n) {
        Object.defineProperty(n, "__esModule", { value: !0 });
        var o = function() {
            function e() {}
            return e.distance = function(e, t) {
                var n = t.x - e.x,
                    o = t.y - e.y;
                return Math.sqrt(n * n + o * o)
            }, e.center = function(e, t) { return { x: (t.x + e.x) / 2, y: (t.y + e.y) / 2 } }, e.centerByArr = function(e, t) { return [(t[0] + e[0]) / 2, (t[1] + e[1]) / 2] }, e.distanceByArr = function(e, t) {
                var n = t[0] - e[0],
                    o = t[1] - e[1];
                return Math.sqrt(n * n + o * o)
            }, e.normalize = function(e) { var t = Math.sqrt(e[0] * e[0] + e[1] * e[1]); return [e[0] / t, e[1] / t] }, e.isPointInBBox = function(e, t, n, o) { var i = .5 * o[0]; if (e < n[0] - i || e > n[0] + i) return !1; var a = .5 * o[1]; return !(t < n[1] - a || t > n[1] + a) }, e.rotateAround = function(e, t, n) {
                var o = [0, 0],
                    i = Math.cos(n),
                    a = Math.sin(n),
                    r = e[0] - t[0],
                    s = e[1] - t[1];
                return o[0] = r * i - s * a + t[0], o[1] = r * a + s * i + t[1], o
            }, e
        }();
        n.default = o
    }, {}],
    23: [function(e, t, n) { Object.defineProperty(n, "__esModule", { value: !0 });! function(e) { e[e.CONTINUE = 0] = "CONTINUE", e[e.FINISHED = 1] = "FINISHED", e[e.LelftButton = 1] = "LelftButton", e[e.RightButton = 2] = "RightButton", e[e.MiddleButton = 4] = "MiddleButton", e[e.MouseMode = 1] = "MouseMode", e[e.TouchMode = 2] = "TouchMode" }(n.MouseButtons || (n.MouseButtons = {})) }, {}],
    24: [function(e, t, n) {
        var o = this && this.__extends || function() {
            var e = function(t, n) {
                return (e = Object.setPrototypeOf || { __proto__: [] }
                    instanceof Array && function(e, t) { e.__proto__ = t } || function(e, t) { for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]) })(t, n)
            };
            return function(t, n) {
                function o() { this.constructor = t }
                e(t, n), t.prototype = null === n ? Object.create(n) : (o.prototype = n.prototype, new o)
            }
        }();
        Object.defineProperty(n, "__esModule", { value: !0 });
        var i = e("../MathUtil"),
            a = e("../MarkupViewer"),
            r = e("../Markups"),
            s = function(e) {
                function t(t, n, o, i, a, r) { var s = e.call(this) || this; return s.rotation = i || 0, s.close = r || !1, s.fillStyle = a, s.markupType = "Polyline", s.drawPoints = t, s.strokeStyle = n, s.lineWidth = o, s.editPt = null, s.bNeedHitByBbox = !1, s }
                return o(t, e), t.prototype.draw = function(e, t, n, o) {
                    if (!(this.drawPoints.length < 2)) {
                        var i = e.markupManager.getMarkupCenter(e, o);
                        i || (i = [0, 0]), t.save(), t.translate(i[0], i[1]), t.rotate(this.rotation), t.beginPath(), t.lineJoin = "round", n.init(i, this.rotation), n.ctx.lineWidth = a.MarkupViewer.isMobile ? 36 : this.lineWidth + n.lineWidth;
                        for (var r = 1, s = this.drawPoints.length; r < s; r++) {
                            var l = e.worldToClientPoint([this.drawPoints[r - 1][0], this.drawPoints[r - 1][1], this.drawPoints[r - 1][2]]),
                                c = e.worldToClientPoint([this.drawPoints[r][0], this.drawPoints[r][1], this.drawPoints[r][2]]);
                            1 == r && t.moveTo(l[0] - i[0], l[1] - i[1]), t.lineTo(c[0] - i[0], c[1] - i[1]), n.drawPolyline(l, c, i, this.rotation, o)
                        }
                        this.close && this.fillStyle && t.fill(), t.stroke(), t.restore(), n.ctx.restore()
                    }
                }, t.prototype.shouldClose = function(e, t, n) { if (this.drawPoints.length < 3) return !1; var o = e.worldToClientPoint([this.drawPoints[0][0], this.drawPoints[0][1], this.drawPoints[0][2]]); return i.default.distanceByArr(o, [t, n]) < 5 ? (this.close = !0, !0) : (this.close = !1, !1) }, t.prototype.setPoints = function(e) { this.drawPoints = e }, t.prototype.addPoint = function(e) { this.drawPoints.push(e) }, t.prototype.getStartPoint = function() { return this.drawPoints[0] }, t.prototype.popPoint = function() { this.drawPoints.pop() }, t.prototype.isEmpty = function() { return 0 == this.drawPoints.length }, t.prototype.getPoints = function() { return this.drawPoints }, t.prototype.getGrips = function(e, t) {
                    if (void 0 == t) return this.drawPoints;
                    var n = e.markupManager.getMarkupBbox(e, t),
                        o = [n[0], n[1]],
                        i = [n[2], n[3]],
                        a = [(o[0] + i[0]) / 2, (o[1] + i[1]) / 2],
                        r = [];
                    return r.push(o[0], o[1]), r.push(o[0], a[1]), r.push(o[0], i[1]), r.push(a[0], i[1]), r.push(i[0], i[1]), r.push(i[0], a[1]), r.push(i[0], o[1]), r.push(a[0], o[1]), r
                }, t
            }(r.default);
        n.default = s
    }, { "../MarkupViewer": 17, "../Markups": 21, "../MathUtil": 22 }],
    25: [function(e, t, n) {
        var o = this && this.__extends || function() {
            var e = function(t, n) {
                return (e = Object.setPrototypeOf || { __proto__: [] }
                    instanceof Array && function(e, t) { e.__proto__ = t } || function(e, t) { for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]) })(t, n)
            };
            return function(t, n) {
                function o() { this.constructor = t }
                e(t, n), t.prototype = null === n ? Object.create(n) : (o.prototype = n.prototype, new o)
            }
        }();
        Object.defineProperty(n, "__esModule", { value: !0 });
        var i = e("./PolylineMarkup"),
            a = e("../MarkupTool"),
            r = e("../Mouse"),
            s = r.MouseButtons,
            l = function(e) {
                function t(t) { var n = e.call(this) || this; return n.markupManager = t, n.bFirstCloudMarkup = !0, n.uncertainty = !1, n }
                return o(t, e), t.prototype.begin = function(e, t, n, o) {
                    if (this.bFirstCloudMarkup) {
                        if (e.markupManager.hitTest(e, t, n) > -1) return;
                        var a = e.markupManager.getColor(),
                            r = e.markupManager.getLineWidth(),
                            s = e.markupManager.getFillStyleState() ? e.markupManager.getFillColor() : void 0;
                        this.markup = new i.default([], a, r, 0, s), this.bFirstCloudMarkup = !1
                    }
                    if (this.markup.shouldClose(e, t, n)) this.addMarkup(e, this.markup), this.markup = null, this.redraw(e), this.bFirstCloudMarkup = !0;
                    else {
                        var l = e.clientToWorldPoint([t, n]);
                        this.markup.popPoint(), this.markup.addPoint(l)
                    }
                    this.uncertainty = !1
                }, t.prototype.onEditing = function(e, t, n, o) {
                    if (!this.bFirstCloudMarkup) {
                        var i = void 0;
                        i = this.markup.shouldClose(e, t, n) ? this.markup.getStartPoint() : e.clientToWorldPoint([t, n]), this.uncertainty && this.markup.drawPoints.length > 1 ? this.markup.popPoint() : this.uncertainty = !0, this.markup.addPoint(i), this.redraw(e)
                    }
                }, t.prototype.onMouseMove = function(e, t, n, o) { this.onEditing(e, t, n, o) }, t.prototype.end = function(e, t, n, o) { if (this.bFirstCloudMarkup) return s.FINISHED }, t.prototype.onMouseRightClick = function(e, t) { this.bFirstCloudMarkup || (this.markup.popPoint(), this.markup.drawPoints.length > 1 && this.addMarkup(e, this.markup), this.markup = null, this.redraw(e), this.bFirstCloudMarkup = !0) }, t.prototype.onDoubleClick = function(e, t) {
                    if (!this.bFirstCloudMarkup) {
                        this.markup.popPoint();
                        this.markup.drawPoints.length > 1 && this.addMarkup(e, this.markup), this.markup = null, this.redraw(e), this.bFirstCloudMarkup = !0
                    }
                }, t
            }(a.default);
        n.default = l
    }, { "../MarkupTool": 16, "../Mouse": 23, "./PolylineMarkup": 24 }],
    26: [function(e, t, n) {
        var o = this && this.__extends || function() {
            var e = function(t, n) {
                return (e = Object.setPrototypeOf || { __proto__: [] }
                    instanceof Array && function(e, t) { e.__proto__ = t } || function(e, t) { for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]) })(t, n)
            };
            return function(t, n) {
                function o() { this.constructor = t }
                e(t, n), t.prototype = null === n ? Object.create(n) : (o.prototype = n.prototype, new o)
            }
        }();
        Object.defineProperty(n, "__esModule", { value: !0 });
        var i = e("./../Markups"),
            a = e("../MarkupViewer"),
            r = function(e) {
                function t(t, n, o, i, a) { var r = e.call(this) || this; return r.rotation = i || 0, r.markupType = "Rectangle", r.drawPoints = t, r.strokeStyle = n, r.lineWidth = o, r.fillStyle = a, r.bNeedHitByBbox = !0, r }
                return o(t, e), t.prototype.draw = function(e, t, n, o) {
                    if (!(this.drawPoints.length < 2)) {
                        var i = e.worldToClientPoint([this.drawPoints[0][0], this.drawPoints[0][1], this.drawPoints[0][2]]),
                            r = e.worldToClientPoint([this.drawPoints[1][0], this.drawPoints[1][1], this.drawPoints[1][2]]),
                            s = this.getCenter(e);
                        t.save(), t.translate(s[0], s[1]), t.rotate(this.rotation), t.beginPath(), t.rect(-.5 * (r[0] - i[0]), -.5 * (r[1] - i[1]), r[0] - i[0], r[1] - i[1]), t.restore(), t.closePath(), this.fillStyle && t.fill(), t.stroke(), n.ctx.lineWidth = a.MarkupViewer.isMobile ? 36 : this.lineWidth + n.lineWidth, n.ctx.fillStyle = this.fillStyle, n.drawRect(this, i, r, s, this.rotation, o)
                    }
                }, t.prototype.setPoints = function(e) { this.drawPoints = e }, t.prototype.getPoints = function() { return this.drawPoints }, t.prototype.getGrips = function(e) {
                    var t = e.worldToClientPoint(this.drawPoints[0]),
                        n = e.worldToClientPoint(this.drawPoints[1]),
                        o = [(t[0] + n[0]) / 2, (t[1] + n[1]) / 2],
                        i = [];
                    return i.push(t[0], t[1]), i.push(t[0], o[1]), i.push(t[0], n[1]), i.push(o[0], n[1]), i.push(n[0], n[1]), i.push(n[0], o[1]), i.push(n[0], t[1]), i.push(o[0], t[1]), i
                }, t.prototype.getRotateGrips = function(e) {
                    var t = e.worldToClientPoint(this.drawPoints[0]),
                        n = e.worldToClientPoint(this.drawPoints[1]);
                    return [
                        [(t[0] + n[0]) / 2, (t[1] + n[1]) / 2][0], t[1] - 20
                    ]
                }, t
            }(i.default);
        n.default = r
    }, { "../MarkupViewer": 17, "./../Markups": 21 }],
    27: [function(e, t, n) {
        var o = this && this.__extends || function() {
            var e = function(t, n) {
                return (e = Object.setPrototypeOf || { __proto__: [] }
                    instanceof Array && function(e, t) { e.__proto__ = t } || function(e, t) { for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]) })(t, n)
            };
            return function(t, n) {
                function o() { this.constructor = t }
                e(t, n), t.prototype = null === n ? Object.create(n) : (o.prototype = n.prototype, new o)
            }
        }();
        Object.defineProperty(n, "__esModule", { value: !0 });
        var i = e("./../MarkupTool"),
            a = e("./RectMarkup"),
            r = e("./../Mouse"),
            s = r.MouseButtons,
            l = function(e) {
                function t(t) { var n = e.call(this) || this; return n.markupManager = t, n }
                return o(t, e), t.prototype.begin = function(e, t, n, o) {
                    this.startX = t, this.startY = n;
                    var i = e.markupManager.getColor(),
                        r = e.markupManager.getLineWidth(),
                        s = e.markupManager.getFillStyleState() ? e.markupManager.getFillColor() : void 0;
                    this.markup = new a.default([], i, r, 0, s)
                }, t.prototype.onEditing = function(e, t, n, o) {
                    var i = e.clientToWorldPoint([this.startX, this.startY]),
                        a = e.clientToWorldPoint([t, n]);
                    this.markup.setPoints([i, a]), this.redraw(e)
                }, t.prototype.end = function(e, t, n, o) { return this.startX == t && this.startY == n ? (console.log("Ignore single point."), s.FINISHED) : (this.addMarkup(e, this.markup), this.markup = null, s.FINISHED) }, t
            }(i.default);
        n.default = l
    }, { "./../MarkupTool": 16, "./../Mouse": 23, "./RectMarkup": 26 }],
    28: [function(e, t, n) {
        var o = this && this.__extends || function() {
            var e = function(t, n) {
                return (e = Object.setPrototypeOf || { __proto__: [] }
                    instanceof Array && function(e, t) { e.__proto__ = t } || function(e, t) { for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]) })(t, n)
            };
            return function(t, n) {
                function o() { this.constructor = t }
                e(t, n), t.prototype = null === n ? Object.create(n) : (o.prototype = n.prototype, new o)
            }
        }();
        Object.defineProperty(n, "__esModule", { value: !0 });
        var i = e("./../Markups"),
            a = function(e) {
                function t(t, n, o, i, a, r, s, l, c) {
                    var d = e.call(this) || this;
                    d.rotation = r || 0, d.textAreaId = s || null, d.center = l || null, d.markupType = "Text", d.drawPoints = c ? t : [t], d.pureText = n, d.userText = n, d.strokeStyle = o, d.fontSize = i, d.fontFamily = a;
                    var u = document.createElement("canvas");
                    return d.virtualCtx = u.getContext("2d"), d.bNeedHitByBbox = !1, d
                }
                return o(t, e), t.prototype.draw = function(e, t, n, o) {
                    var i = e.worldToClientPoint(this.drawPoints[0]),
                        a = this.getTextBbox(e),
                        r = [(a[2] + a[0]) / 2, (a[3] + a[1]) / 2];
                    this.center && (r = e.worldToClientPoint(this.center)), t.save(), t.translate(r[0], r[1]), t.rotate(this.rotation), t.beginPath(), n.init(r, this.rotation), t.fillStyle = t.strokeStyle, t.font = this.fontSize + "px " + this.fontFamily, t.zIndex = 120, n.ctx.font = "bold " + this.fontSize + "px " + this.fontFamily, n.ctx.strokeStyle = "rgba(" + (2 * o + 2) + ",80,80,1)", n.ctx.fillStyle = "rgba(" + (2 * o + 2) + ",80,80,1)";
                    for (var s = this.userText.split(/\n/), l = 0; l < s.length; l++) {
                        t.fillText(s[l], i[0] - r[0], i[1] - r[1] + (l + 1) * this.fontSize), n.ctx.fillText(s[l], i[0] - r[0], i[1] - r[1] + (l + 1) * this.fontSize);
                        var c = s[l].replace(/[a-z]/g, "aa").replace(/[^\u0000-\u00ff]/g, "aaaa").replace(/[A-Z]/g, "aaa").replace(/[0-9]/g, "aa").length;
                        n.ctx.fillRect(i[0] - r[0], i[1] - r[1] + l * this.fontSize, c * this.fontSize * 4 / 14, 20)
                    }
                    t.restore(), n.ctx.restore()
                }, t.prototype.setPoints = function(e) { this.drawPoints = e }, t.prototype.getPoints = function() { return this.drawPoints }, t.prototype.getId = function() { return this.textAreaId }, t.prototype.getUserText = function() { return this.userText }, t.prototype.getPureText = function() { return this.pureText }, t.prototype.setUserText = function(e) { this.userText = e }, t.prototype.setPureText = function(e) { this.pureText = e }, t.prototype.show = function(e) {
                    var t = e.worldToClientPoint([this.drawPoints[0][0], this.drawPoints[0][1], this.drawPoints[0][2]]),
                        n = document.getElementById(this.textAreaId),
                        o = e.wrapDom,
                        i = o.getBoundingClientRect();
                    n.style.left = t[0] + i.left + "px", n.style.top = t[1] + i.top + "px", n.style.fontFamily = this.fontFamily, n.style.fontSize = this.fontSize, n.style.border = "4px", n.style.resize = "none", n.style.zIndex = 100, n.style.display = "block", n.value = this.userText
                }, t.prototype.resizeText = function(e) {
                    this.virtualCtx.font = this.fontSize + "px " + this.fontFamily;
                    for (var t = this.pureText || this.userText, n = t.split(/\n/), o = e[0], i = e[1], a = (this.fontSize, 0); a < n.length; a++) {
                        for (var r = "", s = n[a].slice(), l = "", c = 0, d = 0; d < s.length; d++) {
                            var u = this.virtualCtx.measureText(s[d]).width;
                            c += u, r += s[d], c > o && r.length > 1 ? (l += "\n" + s[d], c = u, r = s[d]) : c == o ? (n[a] = s.slice(0, d + 1) + "\n" + s.slice(d + 1), l += s[d] + "\n", c = 0, r = "") : l += s[d]
                        }
                        n[a] = l
                    }
                    this.userText = n.join("\n")
                }, t.prototype.resizeTextarea = function() {
                    var e = document.getElementById(this.textAreaId);
                    e.value = this.userText;
                    var t = this.userText.split(/\n/),
                        n = 0;
                    e.rows = t.length;
                    for (var o = 0; o < t.length; o++) {
                        var i = t[o].replace(/[^\u0000-\u00ff]/g, "aa").replace(/[A-Z]/g, "aa").length;
                        i > n && (n = i)
                    }
                    e.cols = n
                }, t.prototype.getTextBbox = function(e) {
                    var t, n = this.getTextSize(),
                        o = e.worldToClientPoint(this.drawPoints[0]);
                    return t = this.drawPoints[1] ? e.worldToClientPoint(this.drawPoints[1]) : [o[0] + n[0], o[1] + n[1]], o.concat(t)
                }, t.prototype.getTextSize = function() {
                    var e = 0,
                        t = 0;
                    this.virtualCtx.font = this.fontSize + "px " + this.fontFamily;
                    for (var n, o = this.userText.split(/\n/), i = 0; i < o.length; i++) n = this.virtualCtx.measureText(o[i]), n.width > e && (e = n.width);
                    return t = o.length * this.fontSize, [e, t]
                }, t.prototype.getEndPt = function(e) { var t = this.getTextBbox(e); return [t[2], t[3]] }, t.prototype.getGrips = function(e) {
                    var t = e.worldToClientPoint(this.drawPoints[0]);
                    if (this.drawPoints[1]) { i = e.worldToClientPoint(this.drawPoints[1]); var n = [(t[0] + i[0]) / 2, (t[1] + i[1]) / 2] } else var o = this.getTextBbox(e),
                        n = [(o[2] + o[0]) / 2, (o[3] + o[1]) / 2],
                        i = [o[2], o[3]];
                    var a = [];
                    return a.push(t[0], t[1]), a.push(t[0], n[1]), a.push(t[0], i[1]), a.push(n[0], i[1]), a.push(i[0], i[1]), a.push(i[0], n[1]), a.push(i[0], t[1]), a.push(n[0], t[1]), a
                }, t
            }(i.default);
        n.default = a
    }, { "./../Markups": 21 }],
    29: [function(e, t, n) {
        var o = this && this.__extends || function() {
            var e = function(t, n) {
                return (e = Object.setPrototypeOf || { __proto__: [] }
                    instanceof Array && function(e, t) { e.__proto__ = t } || function(e, t) { for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]) })(t, n)
            };
            return function(t, n) {
                function o() { this.constructor = t }
                e(t, n), t.prototype = null === n ? Object.create(n) : (o.prototype = n.prototype, new o)
            }
        }();
        Object.defineProperty(n, "__esModule", { value: !0 });
        var i = e("./TextMarkup"),
            a = e("./../MarkupTool"),
            r = e("./../Mouse"),
            s = r.MouseButtons,
            l = function(e) {
                function t(t, n) { var o = e.call(this) || this; return o.editorMode = -1, o.rotation = n, o.worldPoint = [], o.markupManager = t, o }
                return o(t, e), t.prototype.begin = function(e, n, o, i) {
                    this.startX = n, this.startY = o, this.textAreaId = "";
                    var a = !0;
                    void 0 == this.userText && (a = this.initDom(e)), a && "" == t.lastTextareaId && (this.createDiv(t.divId), this.insertTextArea2Dom(e), this.addKeyDownListener(e), this.addInputListener(e))
                }, t.prototype.onEditing = function(e, t, n, o) {}, t.prototype.end = function(e, t, n, o) { return s.FINISHED }, t.prototype.onExit = function(e) { "" != t.lastTextareaId && (this.removeTextAreaInDom(t.lastTextareaId), t.lastTextareaId = "") }, t.prototype.initDom = function(e) {
                    if ("" != t.lastTextareaId) {
                        var n = document.getElementById(t.lastTextareaId),
                            o = n.value.trim();
                        if ("" == o) this.removeTextAreaInDom(t.lastTextareaId);
                        else {
                            var a = e.wrapDom,
                                r = a.getBoundingClientRect(),
                                s = parseInt(n.style.left.split("px")[0]),
                                l = parseInt(n.style.top.split("px")[0]),
                                c = [s - r.left, l - r.top],
                                d = e.clientToWorldPoint(c),
                                u = n.style.color,
                                p = e.markupManager.getFontSize(),
                                f = n.style.fontFamily,
                                h = new i.default(d, o, u, p, f, this.rotation || 0, t.lastTextareaId);
                            this.size && (h.setPureText(o), this.setPureText(o), h.resizeText(this.size)), this.rotation = 0, this.hideTextArea(t.lastTextareaId), this.addMarkup(e, h), h = null, this.redraw(e)
                        }
                        return t.lastTextareaId = "", !1
                    }
                    return !0
                }, t.prototype.createDiv = function(e) {
                    if (null == document.getElementById(e)) {
                        console.log("Create div in dom.");
                        var n = document.createElement("div");
                        n.addEventListener("mousedown", function() { event.stopImmediatePropagation() }), n.addEventListener("mouseup", function() { event.stopImmediatePropagation() }), n.addEventListener("mousemove", function() { event.stopImmediatePropagation() }), n.setAttribute("id", t.divId), n.style.position = "absolute", n.style.left = "0", n.style.top = "0", this.markupManager.viewer.wrapDom.appendChild(n);
                        var o = document.createElement("span");
                        o.id = "box", o.style.visibility = "hidden", n.appendChild(o);
                        var i = document.createElement("span");
                        o.id = "boxEdit", o.style.visibility = "hidden", o.style.wordBreak = "break-all", o.style.display = "inline-block", n.appendChild(i)
                    }
                }, t.prototype.setEditBox = function(e) { this.size = e }, t.prototype.hideTextArea = function(e) { document.getElementById(e).style.display = "none" }, t.prototype.showTextArea = function(e) { document.getElementById(e).style.display = "block" }, t.prototype.setUserText = function(e) { this.userText = e }, t.prototype.setPureText = function(e) { this.pureText = e }, t.prototype.addKeyDownListener = function(e) {
                    var t = this,
                        n = document.getElementById(this.textAreaId);
                    n && n.addEventListener("keydown", function(n) { return t.keyDownFunction(e, n) }, !0)
                }, t.prototype.addInputListener = function(e) {
                    var t = this,
                        n = document.getElementById(this.textAreaId);
                    n && (n.addEventListener("input", function(o) { t.resize(n, e) }), n.addEventListener("blur", function(n) { t.onExit(e) }))
                }, t.prototype.resize = function(e, n) {
                    var o = e.value.split(/\n/),
                        i = document.querySelectorAll("#" + t.divId + " span")[0];
                    i.innerText = e.value, i.style.fontSize = n.markupManager.getFontSize() + "px", e.style.width = i.offsetWidth + 10 + "px", e.rows = o.length
                }, t.prototype.keyDownFunction = function(e, t) {
                    var n = document.getElementById(this.textAreaId);
                    13 == t.keyCode && (n.rows = n.rows + 1, console.log("Key enter pressed."))
                }, t.prototype.addMouseDownListener = function() {
                    var e = document.getElementById(this.textAreaId);
                    e && e.addEventListener("click", function(e) { console.log("Mouse click textarea now.") })
                }, t.prototype.createTextArea = function(e) {
                    var t = [this.startX, this.startY];
                    this.worldPoint = e.clientToWorldPoint(t);
                    var n = document.createElement("textArea");
                    n.setAttribute("id", this.textAreaId), n.setAttribute("maxlength", 999), n.value = void 0 == this.userText ? "" : this.userText,
                        n.style.color = e.markupManager.getColor(), n.style.position = "fixed", n.style.lineHeight = "100%";
                    this.editorMode;
                    n.style.width = "10px", n.style.paddingLeft = "6px", n.style.overflow = "hidden", void 0 != this.userText ? this.resize(n, e) : n.rows = "1";
                    var o = e.wrapDom,
                        i = o.getBoundingClientRect();
                    return n.style.left = t[0] + i.left + "px", n.style.top = t[1] + i.top + "px", n.style.fontFamily = e.markupManager.getFontFamily(), n.style.fontSize = e.markupManager.getFontSize() + "px", n.style.border = "1px solid red", n.style.background = "transparent", n.style.outline = "none", n.style.resize = "none", n.style.zIndex = 100, n.style.display = "block", n
                }, t.prototype.insertTextArea2Dom = function(e) {
                    var n = document.getElementById(t.divId),
                        o = n.childElementCount + 1;
                    this.textAreaId = "textArea_" + o;
                    var i = this.createTextArea(e);
                    this.textArea = i, n.appendChild(i), i.focus(), t.lastTextareaId = this.textAreaId
                }, t.prototype.reposition = function(e) {
                    var t = e.worldToClientPoint(this.worldPoint),
                        n = e.wrapDom.getBoundingClientRect();
                    this.textArea.style.left = t[0] + n.left + "px", this.textArea.style.top = t[1] + n.top + "px"
                }, t.prototype.removeTextAreaInDom = function(e) {
                    var n = document.getElementById(t.divId),
                        o = document.getElementById(e);
                    try { n.removeChild(o) } catch (e) {}
                }, t.lastTextareaId = "", t.divId = "bf-drawing-textEditor", t
            }(a.default);
        n.default = l
    }, { "./../MarkupTool": 16, "./../Mouse": 23, "./TextMarkup": 28 }]
}, {}, [11]),
function() {
    function e(t, n, o) {
        function i(r, s) {
            if (!n[r]) {
                if (!t[r]) { var l = "function" == typeof require && require; if (!s && l) return l(r, !0); if (a) return a(r, !0); var c = new Error("Cannot find module '" + r + "'"); throw c.code = "MODULE_NOT_FOUND", c }
                var d = n[r] = { exports: {} };
                t[r][0].call(d.exports, function(e) { return i(t[r][1][e] || e) }, d, d.exports, e, t, n, o)
            }
            return n[r].exports
        }
        for (var a = "function" == typeof require && require, r = 0; r < o.length; r++) i(o[r]);
        return i
    }
    return e
}()({
    1: [function(e, t, n) {
        Object.defineProperty(n, "__esModule", { value: !0 });
        var o = function() {
            function e() {}
            return e.create = function(e, t, n) { var o = document.createElement(e); return o.id = t || "", o.style.position = "absolute", o.style.width = "100%", o.style.top = 0, o.style.bottom = 0, n && n.appendChild(o), o }, e.remove = function(e) {
                var t = e.parentNode;
                t && t.removeChild(e)
            }, e.setPosition = function(e, t) { e.position = t, e.style.left = t.x + "px", e.style.top = t.y + "px" }, e.setOpacity = function(t, n) { "opacity" in t.style ? t.style.opacity = n : "filter" in t.style && e._setOpacityIE(t, n) }, e._setOpacityIE = function(e, t) {
                var n = !1,
                    o = "DXImageTransform.Microsoft.Alpha";
                try { n = e.filters.item(o) } catch (e) { if (1 === t) return }
                t = Math.round(100 * t), n ? (n.Enabled = 100 !== t, n.Opacity = t) : e.style.filter += " progid:" + o + "(opacity=" + t + ")"
            }, e.splitStr = function(e) { return e.trim().split(/\s+/g) }, e.getContainerOffsetToClient = function(e) {
                var t, n = function(e) {
                        for (var t = 0, n = 0; e;) t += e.offsetTop, n += e.offsetLeft, e = e.offsetParent;
                        var o = document.body,
                            i = document.documentElement,
                            a = window.pageYOffset || i.scrollTop || o.scrollTop,
                            r = window.pageXOffset || i.scrollLeft || o.scrollLeft;
                        return t -= a, n -= r, { top: t, left: n }
                    },
                    o = function(e) {
                        var t = e.getBoundingClientRect(),
                            n = document.body,
                            o = document.documentElement,
                            i = o.clientTop || n.clientTop,
                            a = o.clientLeft || n.clientLeft,
                            r = t.top - i,
                            s = t.left - a;
                        return { top: Math.round(r), left: Math.round(s) }
                    };
                if (e != document) {
                    var i = function(e) { return e.getBoundingClientRect ? o(e) : n(e) }(e);
                    t = { width: e.offsetWidth, height: e.offsetHeight, left: i.left, top: i.top }
                } else t = { width: window.innerWidth, height: window.innerHeight, left: 0, top: 0 };
                return t
            }, e.setClassName = function(e, t) {
                var n = document.getElementById(e);
                n && (n.className = t)
            }, e.addClassName = function(e, t) {
                var n, o, i, a, r, s = /\s+/,
                    l = document.getElementById(e);
                if (l && (o = l, t && "string" == typeof t && (n = t.split(s), 1 === o.nodeType)))
                    if (o.className || 1 !== n.length) {
                        for (i = " " + o.className + " ", a = 0, r = n.length; a < r; ++a) i.indexOf(" " + n[a] + " ") < 0 && (i += n[0] + " ");
                        o.className = i.trim()
                    } else o.className = t
            }, e.removeClassName = function(e, t) {
                var n, o, i, a, r, s = /\s+/,
                    l = document.getElementById(e);
                if (l && (i = l, t && "string" == typeof t && (n = (t || "").split(s), 1 === i.nodeType && i.className))) {
                    for (o = (" " + i.className + " ").replace("O", " "), a = 0, r = n.length; a < r; a++)
                        for (; o.indexOf(" " + n[a] + " ") >= 0;) o = o.replace(" " + n[a] + " ", " ");
                    i.className = t ? o.trim() : ""
                }
            }, e.showOrHideElement = function(e, t) {
                var n = document.getElementById(e);
                n && (n.style.display = t ? "" : "none")
            }, e.prototype.getStyleString = function(e) {
                var t = [];
                for (var n in e) {
                    var o = e[n];
                    t.push(n), t.push(":"), t.push(o), t.push("; ")
                }
                return t.join("")
            }, e.cloneStyle = function(e) { var t = {}; for (var n in e) t[n] = e[n]; return t }, e.removeStyleAttribute = function(e, t) { Array.isArray(t) || (t = [t]), t.forEach(function(t) { t in e && delete e[t] }) }, e.trimRight = function(e) {
                if (0 === e.length) return "";
                for (var t = e.length - 1, n = t; n >= 0; --n)
                    if (" " !== e.charAt(n)) { t = n; break }
                return e.substr(0, t + 1)
            }, e.trimLeft = function(e) {
                if (0 === e.length) return "";
                for (var t = 0, n = 0; n < e.length; ++n)
                    if (" " !== e.charAt(n)) { t = n; break }
                return e.substr(t)
            }, e.matchesSelector = function(e, t) { if (e.matches) return e.matches(t); if (e.matchesSelector) return e.matchesSelector(t); if (e.webkitMatchesSelector) return e.webkitMatchesSelector(t); if (e.msMatchesSelector) return e.msMatchesSelector(t); if (e.mozMatchesSelector) return e.mozMatchesSelector(t); if (e.oMatchesSelector) return e.oMatchesSelector(t); if (e.querySelectorAll) { for (var n = (e.document || e.ownerDocument).querySelectorAll(t), o = 0; n[o] && n[o] !== e;) o++; return !!n[o] } return !1 }, e.toTranslate3d = function(e, t) { return "translate3d(" + e + "px," + t + "px,0)" }, e.setCursorStyle = function(e, t) {
                var n;
                switch (t) {
                    case "n":
                    case "s":
                        n = "ns-resize";
                        break;
                    case "w":
                    case "e":
                        n = "ew-resize";
                        break;
                    case "ne":
                    case "sw":
                        n = "nesw-resize";
                        break;
                    case "nw":
                    case "se":
                        n = "nwse-resize"
                }
                e.style.cursor = n
            }, e
        }();
        n.DomUtil2D = o
    }, {}],
    2: [function(e, t, n) {
        Object.defineProperty(n, "__esModule", { value: !0 });
        var o = function() {
            function e() {}
            return e.createSvgElement = function(e) { var t = document.createElementNS("http://www.w3.org/2000/svg", e); return t.setAttribute("pointer-events", "inherit"), t }, e.getRGBAString = function(e, t) { return t <= 0 ? "none" : ["rgba(" + parseInt("0x" + e.substr(1, 2)), ",", parseInt("0x" + e.substr(3, 2)), ",", parseInt("0x" + e.substr(5, 2)), ",", t, ")"].join("") }, e.makeFlag = function() { var e = this.createSvgElement("path"); return e.setAttribute("d", "M0 0 L0 -20 L15 -13 L4 -6.87 L4 0Z"), e }, e.makeBubble = function() { var e = this.createSvgElement("path"); return e.setAttribute("d", "m0.0035,-19.88544c-3.838253,0 -6.95,2.581968 -6.95,5.766754c0,3.185555 6.95,13.933247 6.95,13.933247s6.95,-10.747692 6.95,-13.933247c0,-3.184786 -3.11082,-5.766754 -6.95,-5.766754z"), e }, e.makeCommon = function(e, t) { var n = this.createSvgElement("image"); return n.href.baseVal = e, n.setAttribute("height", t.height.toString() + "px"), n.setAttribute("width", t.width.toString() + "px"), n }, e
        }();
        n.Shape2D = o
    }, {}],
    3: [function(e, t, n) { Object.defineProperty(n, "__esModule", { value: !0 }), e("./View3dAdapter"), e("./View2dAdapter"), e("./MarkerEditor") }, { "./MarkerEditor": 7, "./View2dAdapter": 9, "./View3dAdapter": 10 }],
    4: [function(e, t, n) {
        Object.defineProperty(n, "__esModule", { value: !0 });
        var o = e("../../Common/Utils/DomUtil2D"),
            i = function() {
                function e(t, n) { this.id = t, this.editor = n, this.position = new window.THREE.Vector3, this.boundingBox = new window.THREE.Box3, this.shape = null, this.style = e.getDefaultStyle(), this.selected = !1, this.highlighted = !1, this.highlightColor = "#000088", this.isDisableInteractions = !1, this.ratioW = 1, this.ratioH = 1, this.keys = { BACKSPACE: 8, ALT: 18, ESC: 27, LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40, DELETE: 46, ZERO: 48, A: 65, D: 68, E: 69, Q: 81, S: 83, W: 87, PLUS: 187, SUB: 189 }, this.onMouseDownBinded = this.onMouseDown.bind(this), this.onKeyUpBinded = this.onKeyUp.bind(this) }
                return e.prototype.addDomEventListeners = function() { this.shape.addEventListener("mousedown", this.onMouseDownBinded, !0), this.shape.addEventListener("touchstart", this.onMouseDownBinded, !0), window.addEventListener("keyup", this.onKeyUpBinded) }, e.prototype.removeDomEventListeners = function() { this.shape.removeEventListener("mousedown", this.onMouseDownBinded, !0), this.shape.removeEventListener("touchstart", this.onMouseDownBinded, !0), window.removeEventListener("keyup", this.onKeyUpBinded) }, e.prototype.onMouseDown = function(e) { e.preventDefault(), e.stopPropagation(), this.select(e.button) }, e.prototype.onKeyUp = function(e) {
                    switch (e.keyCode) {
                        case this.keys.DELETE:
                            this.editor.deselectMarker(), this.delete()
                    }
                }, e.prototype.createShape = function() {}, e.prototype.destroy = function() { this.removeDomEventListeners(), this.deselect(), this.setParent(null) }, e.prototype.set = function(e, t, n, i) { this.userId = e, this.position.set(t.x, t.y, t.z), this.boundingBox = n && n.clone(), i && (this.style = o.DomUtil2D.cloneStyle(i)), this.update() }, e.prototype.setRatio = function(e, t) { this.ratioW = e, this.ratioH = t }, e.prototype.setParent = function(e) {
                    var t = this.shape;
                    t && (t.parentNode && t.parentNode.removeChild(t), e && e.appendChild(t))
                }, e.prototype.setStyle = function(e) { this.style = o.DomUtil2D.cloneStyle(e), this.update() }, e.prototype.select = function(e) { this.selected || (this.selected = !0, this.highlight(!0)), this.editor.selectMarker(this, e) }, e.prototype.deselect = function() { this.highlight(!1), this.selected = !1 }, e.prototype.highlight = function(e) { this.isDisableInteractions || (this.highlighted = e, this.update()) }, e.prototype.disableInteractions = function(e) { this.isDisableInteractions = e }, e.prototype.delete = function() { this.editor.deleteMarker(this) }, e.prototype.getClientPosition = function() { return this.editor.getAdapter().worldToClient(this.position) }, e.prototype.getBoundingBox = function() { return this.boundingBox }, e.prototype.toNewObject = function() { return { id: this.id, userId: this.userId, shapeType: this.shapeType, cx: this.cx, cy: this.cy, position: this.position ? this.position.clone() : null, boundingBox: this.boundingBox ? this.boundingBox.clone() : null } }, e.prototype.show = function() { this.shape.style.display = "block" }, e.prototype.hide = function() { this.shape.style.display = "none" }, e.prototype.update = function() {
                    var e = this.style["stroke-width"],
                        t = this.highlighted ? this.highlightColor : this.style["stroke-color"],
                        n = this.style["stroke-opacity"],
                        o = this.style["fill-color"],
                        i = this.style["fill-opacity"],
                        a = this.getClientPosition();
                    if (!a) return void(this.shape.style.display = "none");
                    var r = a.x,
                        s = a.y;
                    if (2 == this.shapeType) var l = ["translate(", r - this.pictureSize.width * this.ratioW * .5, ",", s - this.pictureSize.height * this.ratioH * .5, ") "].join("");
                    else var l = ["translate(", r, ",", s, ") "].join("");
                    this.cx = r, this.cy = s, this.shape.setAttribute("transform", l), this.shape.setAttribute("stroke-width", e), this.shape.setAttribute("stroke", t), this.shape.setAttribute("stroke-opacity", n), this.shape.setAttribute("fill", o), this.shape.setAttribute("fill-opacity", i)
                }, e.shapeTypes = { BUBBLE: 0, FLAG: 1, COMMON: 2 }, e.getDefaultStyle = function() { var e = {}; return e["stroke-width"] = 2, e["stroke-color"] = "#fffaff", e["stroke-opacity"] = 1, e["fill-color"] = "#ff2129", e["fill-opacity"] = 1, e }, e
            }();
        n.Marker = i
    }, { "../../Common/Utils/DomUtil2D": 1 }],
    5: [function(e, t, n) {
        var o = this && this.__extends || function() {
            var e = function(t, n) {
                return (e = Object.setPrototypeOf || { __proto__: [] }
                    instanceof Array && function(e, t) { e.__proto__ = t } || function(e, t) { for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]) })(t, n)
            };
            return function(t, n) {
                function o() { this.constructor = t }
                e(t, n), t.prototype = null === n ? Object.create(n) : (o.prototype = n.prototype, new o)
            }
        }();
        Object.defineProperty(n, "__esModule", { value: !0 });
        var i = e("./Marker"),
            a = function(e) {
                function t(t, n) { var o = e.call(this, t, n) || this; return o.shapeType = i.Marker.shapeTypes.BUBBLE, o.createShape(), o.addDomEventListeners(), o }
                return o(t, e), t
            }(i.Marker);
        n.MarkerBubble = a
    }, { "./Marker": 4 }],
    6: [function(e, t, n) {
        var o = this && this.__extends || function() {
            var e = function(t, n) {
                return (e = Object.setPrototypeOf || { __proto__: [] }
                    instanceof Array && function(e, t) { e.__proto__ = t } || function(e, t) { for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]) })(t, n)
            };
            return function(t, n) {
                function o() { this.constructor = t }
                e(t, n), t.prototype = null === n ? Object.create(n) : (o.prototype = n.prototype, new o)
            }
        }();
        Object.defineProperty(n, "__esModule", { value: !0 });
        var i = e("./Marker"),
            a = e("./../../Common/Utils/Shape2D"),
            r = function(e) {
                function t(t, n, o, a) { var r = e.call(this, t, n) || this; return r.shapeType = i.Marker.shapeTypes.COMMON, r.pictureSize = a || { width: 20, height: 20 }, r.createShape(o), r.addDomEventListeners(), r }
                return o(t, e), t.prototype.createShape = function(e) { this.shape = a.Shape2D.makeCommon(e, this.pictureSize) }, t.prototype.reset = function() {
                    var e = this.pictureSize.width * this.ratioW,
                        t = this.pictureSize.height * this.ratioH;
                    this.shape.setAttribute("width", e.toString() + "px"), this.shape.setAttribute("height", t.toString() + "px")
                }, t
            }(i.Marker);
        n.MarkerCommon = r
    }, { "./../../Common/Utils/Shape2D": 2, "./Marker": 4 }],
    7: [function(e, t, n) {
        Object.defineProperty(n, "__esModule", { value: !0 });
        var o = e("./MarkerBubble"),
            i = e("./MarkerCommon"),
            a = e("./MarkerFlag"),
            r = e("./../../Common/Utils/Shape2D"),
            s = e("./Marker"),
            l = function() {
                function e(e) { this.disableInteractions = function(e) { this.isDisableInteractions = e }, this.adapter = e, this.markers = [], this.mapGroupMarkers = {}, this.groups = null, this.selectedMarker = null, this.flagColors = { red: "#ff2129", green: "#85af03", yellow: "#fe9829" }, this.bubbleColors = { red: "#f92a24", green: "#86b507", gray: "#ff9326" }, this.nextMarkerId = 0, this.initialized = !1, this.markerClickCallback = null, this.markerRightClickCallback = null, this.markersRatioH = 1, this.markersRatioW = 1 }
                return e.prototype.getAdapter = function() { return this.adapter }, e.prototype.updateDomContainer = function() {
                    var e = this.adapter.getDomContainer();
                    this.adapter.setDomContainer(e)
                }, e.prototype.getMarkers = function() { return this.markers }, e.prototype.getMarkersByGroupName = function(e) { return this.mapGroupMarkers.hasOwnProperty(e) ? this.mapGroupMarkers[e] : [] }, e.prototype.addMarkerToGroup = function(e, t) { this.mapGroupMarkers.hasOwnProperty(t) || (this.mapGroupMarkers[t] = []), this.mapGroupMarkers[t].push(e) }, e.prototype.setMarkerGroups = function(e) { this.groups = e }, e.prototype.removeMarkerInGroup = function(e, t) {
                    for (var n = this.mapGroupMarkers[t], o = 0, i = n.length; o < i; o++)
                        if (n[o].userId == e) return n.splice(o, 1), void this.updateByGroup()
                }, e.prototype.removeMarker = function(e) {
                    for (var t = this.markers, n = 0, o = t.length; n < o; n++)
                        if (t[n].userId == e) return t[n].destroy(), void t.splice(n, 1)
                }, e.prototype.clearMarkers = function() { this.unloadMarkers(!0), this.markers = [], this.mapGroupMarkers = {} }, e.prototype.setVisible = function(e, t) {
                    var n = this.mapGroupMarkers;
                    for (var o in n) {
                        var i = n[o];
                        if (i instanceof Array) {
                            var a = i.getObjectByAttribute("id", e);
                            a && (!0 === t ? a.show() : a.hide())
                        }
                    }
                }, e.prototype.updateByGroup = function(e) {
                    var t = e || this.groupName;
                    this.unloadMarkers();
                    var n = this.mapGroupMarkers[t];
                    if (n instanceof Array)
                        for (var o = 0, i = n.length; o < i; o++) n[o] && n[o].setParent(this.svgGroup)
                }, e.prototype.resize = function(e) {
                    var t = this.adapter.getInitialDomSize(),
                        n = e.width / t.width,
                        o = e.height / t.height;
                    this.markersRatioH = o, this.markersRatioW = n;
                    var i = this.mapGroupMarkers[this.groupName];
                    if (i instanceof Array) {
                        for (var a = 0, r = i.length; a < r; a++) {
                            var s = i[a];
                            s.setRatio(n, o), s.reset(), s.update()
                        }
                        e.width == t.width && e.height == t.height || (t = e), this.svg.setAttribute("width", e.width + ""), this.svg.setAttribute("height", e.height + "")
                    }
                }, e.prototype.setGroupName = function(e) { this.groupName = e }, e.prototype.updateGroupName = function() {
                    var e = this.adapter.getMinimap();
                    e && (this.groupName = e.getFloorPlaneName())
                }, e.prototype.onResize = function() {
                    if (this.svg) {
                        var e = this.adapter.getDomContainerBounds();
                        this.svg.setAttribute("width", e.width + ""), this.svg.setAttribute("height", e.height + ""), this.updateMarkers()
                    }
                }, e.prototype.init = function() {
                    if (!this.svg) {
                        var e = this.adapter.getDomContainerBounds(),
                            t = e.width,
                            n = e.height;
                        this.svg = r.Shape2D.createSvgElement("svg"), this.svg.style.position = "absolute", this.svg.style.display = "block", this.svg.style.position = "absolute", this.svg.style.display = "block", this.svg.style.left = "0", this.svg.style.top = "0", this.svg.setAttribute("width", t + ""), this.svg.setAttribute("height", n + "");
                        this.adapter.getDomContainer().appendChild(this.svg), this.svgGroup = r.Shape2D.createSvgElement("g"), this.svg.insertBefore(this.svgGroup, this.svg.firstChild)
                    }
                    this.initialized = !0
                }, e.prototype.uninit = function() { this.initialized = !1, this.svg && (this.unloadMarkers(), this.svgGroup && this.svgGroup.parentNode && this.svgGroup.parentNode.removeChild(this.svgGroup), this.svg.parentNode && this.svg.parentNode.removeChild(this.svg), this.svgGroup = null, this.svg = null, this.markerClickCallback = null, this.markerRightClickCallback = null) }, e.prototype.isInitialized = function() { return this.initialized }, e.prototype.generateMarkerId = function() { return ++this.nextMarkerId, this.nextMarkerId.toString(10) }, e.prototype.clear = function(e) {
                    var t = this.markers;
                    if (1 == e)
                        for (; t.length;) {
                            var n = t[0];
                            this.deleteMarker(n)
                        }
                    var o = this.svgGroup;
                    if (o && o.childNodes.length > 0)
                        for (; o.childNodes.length;) o.removeChild(o.childNodes[0])
                }, e.prototype.addMarker = function(e) {
                    if ("VIEW3D" == this.adapter.getName() && e.setParent(this.svgGroup), this.markers.push(e), this.groups)
                        for (var t = 0, n = this.groups.length; t < n; t++) this.addMarkerToGroup(e, this.groups[t]);
                    this.groupName && this.updateByGroup(this.groupName)
                }, e.prototype.deleteMarker = function(e) {
                    if (e) {
                        this.removeMarker(e.userId);
                        var t = this.mapGroupMarkers;
                        for (var n in t) this.removeMarkerInGroup(e.userId, n);
                        t && this.updateByGroup()
                    }
                }, e.prototype.selectMarker = function(e, t) {
                    if (!0 === this.isDisableInteractions) return this.markerClickCallback && 0 == t && this.markerClickCallback(e.toNewObject()), void(this.markerRightClickCallback && 2 == t && this.markerRightClickCallback(e.toNewObject()));
                    this.selectedMarker !== e ? (this.deselectMarker(), this.selectedMarker = e) : this.deselectMarker(), this.markerClickCallback && (this.selectedMarker ? this.markerClickCallback(this.selectedMarker.toNewObject()) : this.markerClickCallback(null))
                }, e.prototype.deselectMarker = function() { this.selectedMarker && (this.selectedMarker.deselect(), this.selectedMarker = null) }, e.prototype.enableSVGPaint = function(e) { e ? this.svg && this.svg.setAttribute("pointer-events", "painted") : this.svg && this.svg.setAttribute("pointer-events", "none") }, e.prototype.getMarkerColor = function(e, t) {
                    var n = this.bubbleColors.red;
                    switch (e < 0 && e > 1 && (e = 0), t > 2 && (t -= 3), t < 0 && t > 2 && (t = 0), t) {
                        case 0:
                            n = 0 === e ? this.bubbleColors.red : this.flagColors.red;
                            break;
                        case 1:
                            n = 0 === e ? this.bubbleColors.green : this.flagColors.green;
                            break;
                        case 2:
                            n = 0 === e ? this.bubbleColors.gray : this.flagColors.yellow
                    }
                    return n
                }, e.prototype.createMarkerByIntersect = function(e, t, n, o) {
                    var i = e.id || this.generateMarkerId(),
                        a = e.userId,
                        r = e.worldPosition || e.object.point,
                        s = e.worldBoundingBox || e.object && e.object.boundingBox,
                        l = { size: o, id: i, userId: a, position: r, boundingBox: s, shapeType: t, state: n };
                    this.createMarker(l)
                }, e.prototype.createMarker = function(e) {
                    if (e) {
                        var t = s.Marker.getDefaultStyle();
                        t["fill-color"] = this.getMarkerColor(e.shapeType, e.state);
                        var n, r = e.id || this.generateMarkerId(),
                            l = s.Marker.shapeTypes;
                        switch (e.shapeType) {
                            case l.BUBBLE:
                                n = new o.MarkerBubble(r, this);
                                break;
                            case l.COMMON:
                                n = new i.MarkerCommon(r, this, e.state, e.size), n.setRatio(this.markersRatioW, this.markersRatioH), n.reset();
                                break;
                            case l.FLAG:
                            default:
                                n = new a.MarkerFlag(r, this)
                        }
                        this.isDisableInteractions && n.disableInteractions(!0), n.set(e.userId, e.position, e.boundingBox, t), this.addMarker(n)
                    }
                }, e.prototype.getMarkersBoundingBox = function() {
                    if (this.markers.length < 1) return null;
                    for (var e = new window.THREE.Box3, t = 0, n = this.markers.length; t < n; t++) {
                        var o = this.markers[t];
                        o.getBoundingBox() && e.union(o.getBoundingBox())
                    }
                    return e
                }, e.prototype.getMarkerInfoList = function() {
                    for (var e = [], t = 0, n = this.markers.length; t < n; t++) {
                        var o = this.markers[t],
                            i = o.userId + "_" + t,
                            a = { id: o.id || i, userId: o.userId, shapeType: o.shapeType, position: o.position, boundingBox: o.boundingBox, state: o.state };
                        e.push(a)
                    }
                    return e
                }, e.prototype.loadMarkers = function(e) {
                    this.clear();
                    for (var t = 0, n = e.length; t < n; t++) {
                        var o = e[t],
                            i = o.userId + "_" + t,
                            a = o.id || i,
                            r = o.userId,
                            s = o.shapeType,
                            l = o.state,
                            c = o.position,
                            d = new window.THREE.Box3;
                        d.max.x = o.boundingBox.max.x, d.max.y = o.boundingBox.max.y, d.max.z = o.boundingBox.max.z, d.min.x = o.boundingBox.min.x, d.min.y = o.boundingBox.min.y, d.min.z = o.boundingBox.min.z;
                        var u = { id: a, userId: r, position: c, boundingBox: d, shapeType: s, state: l };
                        this.createMarker(u)
                    }
                }, e.prototype.loadMarkersFromIntersect = function(e, t, n) { this.clear(), this.createMarkerByIntersect(e, t, n) }, e.prototype.unloadMarkers = function(e) { this.clear(e) }, e.prototype.updateMarkers = function() { for (var e = 0, t = this.markers.length; e < t; e++) { this.markers[e].update() } }, e.prototype.getMarker = function(e) {
                    for (var t = this.markers, n = t.length, o = 0; o < n; ++o)
                        if (t[o].userId == e) return t[o];
                    return null
                }, e.prototype.getMarkerByUserId = function(e) {
                    for (var t = this.markers, n = t.length, o = 0; o < n; ++o)
                        if (t[o].userId == e) return t[o];
                    return null
                }, e.prototype.setMarkerClickCallback = function(e) { this.markerClickCallback = e }, e.prototype.setMarkerRightClickCallback = function(e) { this.markerRightClickCallback = e }, e.prototype.zoomAndPanMarkerById = function(e, t, n, o) {
                    var i = this.mapGroupMarkers,
                        a = this.svg.getAttribute("width"),
                        r = this.svg.getAttribute("height"),
                        s = new THREE.Vector2(.5 * a, .5 * r);
                    for (var l in i) {
                        var c = i[l];
                        if (c instanceof Array) {
                            var d = c.getObjectByAttribute("id", e);
                            if (d) {
                                var u = d.getClientPosition(),
                                    p = d.pictureSize.width * d.ratioW,
                                    f = d.pictureSize.height * d.ratioH,
                                    h = new THREE.Vector2(u.x, u.y),
                                    m = h.clone().sub(s);
                                m.multiplyScalar(o);
                                var g = s.x + m.x - .5 * p,
                                    b = s.y + m.y - .5 * f,
                                    v = g + t,
                                    y = b + n,
                                    w = "translate(" + v + "," + y + ")";
                                d.shape.setAttribute("transform", w)
                            }
                        }
                    }
                }, e
            }();
        n.MarkerEditor = l, window.MarkerEditor = l
    }, { "./../../Common/Utils/Shape2D": 2, "./Marker": 4, "./MarkerBubble": 5, "./MarkerCommon": 6, "./MarkerFlag": 8 }],
    8: [function(e, t, n) {
        var o = this && this.__extends || function() {
            var e = function(t, n) {
                return (e = Object.setPrototypeOf || { __proto__: [] }
                    instanceof Array && function(e, t) { e.__proto__ = t } || function(e, t) { for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]) })(t, n)
            };
            return function(t, n) {
                function o() { this.constructor = t }
                e(t, n), t.prototype = null === n ? Object.create(n) : (o.prototype = n.prototype, new o)
            }
        }();
        Object.defineProperty(n, "__esModule", { value: !0 });
        var i = e("./Marker"),
            a = e("./../../Common/Utils/Shape2D"),
            r = function(e) {
                function t(t, n) { var o = e.call(this, t, n) || this; return o.shapeType = i.Marker.shapeTypes.COMMON, o.createShape(), o.addDomEventListeners(), o }
                return o(t, e), t.prototype.createShape = function() { this.shape = a.Shape2D.makeFlag() }, t
            }(i.Marker);
        n.MarkerFlag = r
    }, { "./../../Common/Utils/Shape2D": 2, "./Marker": 4 }],
    9: [function(e, t, n) {
        var o = this && this.__extends || function() {
            var e = function(t, n) {
                return (e = Object.setPrototypeOf || { __proto__: [] }
                    instanceof Array && function(e, t) { e.__proto__ = t } || function(e, t) { for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]) })(t, n)
            };
            return function(t, n) {
                function o() { this.constructor = t }
                e(t, n), t.prototype = null === n ? Object.create(n) : (o.prototype = n.prototype, new o)
            }
        }();
        Object.defineProperty(n, "__esModule", { value: !0 });
        var i = e("./ViewAdapter"),
            a = function(e) {
                function t(t, n) {
                    var o = e.call(this) || this;
                    o.name = "VIEW2D", o.minimap = t, o.domContainer = t.getMapContainer(), o.cameraControl = n.cameraControl, o.scene = n.getScene();
                    var i = t.viewerFloor.vfData,
                        a = i.width || 298,
                        r = i.height || 198;
                    return o.initialDomSize = { width: a, height: r }, o.currentDomSize = { width: a, height: r }, o
                }
                return o(t, e), t.prototype.getInitialDomSize = function() { return this.initialDomSize }, t.prototype.resize = function(e) { this.currentDomSize = e }, t.prototype.getDomContainerBounds = function() { return this.currentDomSize }, t.prototype.getMinimap = function() { return this.minimap }, t.prototype.worldToClient = function(e) {
                    var t = new window.THREE.Vector3(e.x, e.y, e.z),
                        n = this.minimap.getAxisGridBox2D();
                    this.worldToNormalizedPoint(t, n);
                    var o = this.getDomContainerBounds(),
                        i = { width: o.width / 2, height: o.height / 2 };
                    return this.normalizedPointToScreen(t, i), t.x += i.width, t.y += i.height, t
                }, t.prototype.normalizedPointToScreen = function(e, t) { e.x = e.x * t.width, e.y = -e.y * t.height }, t.prototype.worldToNormalizedPoint = function(e, t) {
                    var n = t.getSize();
                    e.x = (e.x - t.min.x) / n.x * 2 - 1, e.y = (e.y - t.min.y) / n.y * 2 - 1
                }, t
            }(i.ViewAdapter);
        window.Glodon.Bimface.Marker.View2dAdapter = a
    }, { "./ViewAdapter": 11 }],
    10: [function(e, t, n) {
        var o = this && this.__extends || function() {
            var e = function(t, n) {
                return (e = Object.setPrototypeOf || { __proto__: [] }
                    instanceof Array && function(e, t) { e.__proto__ = t } || function(e, t) { for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]) })(t, n)
            };
            return function(t, n) {
                function o() { this.constructor = t }
                e(t, n), t.prototype = null === n ? Object.create(n) : (o.prototype = n.prototype, new o)
            }
        }();
        Object.defineProperty(n, "__esModule", { value: !0 });
        var i = e("./ViewAdapter"),
            a = function(e) {
                function t(t) { var n = e.call(this) || this; return n.name = "VIEW3D", n.domContainer = t.domElement, n.cameraControl = t.cameraControl, n.scene = t.getScene(), n }
                return o(t, e), t.prototype.worldToClient = function(e) {
                    var t = this.getDomContainerBounds(),
                        n = this.cameraControl.camera,
                        o = this.getSceneMatrix(),
                        i = new window.THREE.Vector3(e.x, e.y, e.z);
                    return i.applyMatrix4(o), i.project(n), Math.abs(i.z) > 1 ? null : (i.x = Math.round(.5 * (i.x + 1) * t.width), i.y = Math.round(-.5 * (i.y - 1) * t.height), i.z = 0, i)
                }, t
            }(i.ViewAdapter);
        window.Glodon.Bimface.Marker.View3dAdapter = a
    }, { "./ViewAdapter": 11 }],
    11: [function(e, t, n) {
        Object.defineProperty(n, "__esModule", { value: !0 });
        var o = e("../../Common/Utils/DomUtil2D"),
            i = function() {
                function e() { this.domContainer = null, this.cameraControl = null, this.scene = null, this.name = "" }
                return e.prototype.getName = function() { return this.name }, e.prototype.setDomContainer = function(e) { this.domContainer = e }, e.prototype.getDomContainer = function() { return this.domContainer }, e.prototype.worldToClient = function(e) {}, e.prototype.clientToWorld = function(e) {
                    var t = this.getDomContainerBounds(),
                        n = this.cameraControl.camera,
                        o = new window.THREE.Vector3;
                    o.x = e.x / t.width * 2 - 1, o.y = -e.y / t.height * 2 + 1, o.z = 0, o.unproject(n);
                    var i = this.getInverseSceneMatrix();
                    return o.applyMatrix4(i), o
                }, e.prototype.getSceneMatrix = function() { return this.scene.getMatrixGlobal() }, e.prototype.getInverseSceneMatrix = function() {
                    var e = this.getSceneMatrix(),
                        t = new window.THREE.Matrix4;
                    return t.getInverse(e), t
                }, e.prototype.clientToViewport = function(e) {
                    var t = this.getDomContainerBounds(),
                        n = new window.THREE.Vector3;
                    return n.x = e.x / t.width * 2 - 1, n.y = -e.y / t.height * 2 + 1, n.z = 0, n
                }, e.prototype.getDomContainerBounds = function(e) { return o.DomUtil2D.getContainerOffsetToClient(e || this.domContainer) }, e
            }();
        n.ViewAdapter = i, window.Glodon.Bimface.Marker = {}
    }, { "../../Common/Utils/DomUtil2D": 1 }]
}, {}, [3]),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application.UI"),
        t = function() { return { Toolbars: ["MainToolbar", "ModelTree"], Buttons: ["Home", "RectangleSelect", "Measure", "Section", "Walk", "Map", "Property", "Setting", "Information", "FullScreen"], contextMenu: !0, viewer: null, element: null } };
    e.UIConfig = t
}(),
function() {
    var e = Glodon.Web.Lang.Utility.Namespace.ensureNamespace(Glodon, "Bimface.Application.UI"),
        t = function(e) {
            var t = this,
                n = e.viewer;
            this._toolbars = [], this._panels = [], this._plugins = [], this._opt = e, this._objectTypes = {}, this._contextMenuCb = function(e) {
                n.contextMenu && n.contextMenu.element && n.contextMenu.destroy();
                var o = e.clientPosition,
                    i = e.containerBox,
                    a = n.getSelectedComponents(),
                    r = new Glodon.Bimface.Application.UI.Menu.ContextMenu(t, a, t._objectTypes),
                    s = {};
                i.width - o.x > 120 ? (s.x = o.x, r.element.removeClass("bf-menu-left"), r.element.addClass("bf-menu-right")) : (s.x = o.x - 120, r.element.addClass("bf-menu-left"), r.element.removeClass("bf-menu-right")), i.height - o.y > 182 ? s.y = o.y : s.y = o.y - (r.oneOption && 40 || 182), r.setPosition(s), n.contextMenu = r
            };
            var o = { initialized: !1, menu: !0, hobby: !0, hover: !1, scroll: !1, backgroundColor: 1, borderLine: !1, environment: "color", effect: "low", exposure: 0, enableIBLBackground: !1, ambientLight: !1, IBLName: "none", SSAO: !1 };
            o.setDefault = function() {
                var e = n.getInformation(),
                    t = n.getLoadIBLScene();
                o = Object.assign(o, { menu: n.isEnableToggleContextMenuDisplay(), hover: n.isEnableHover(), borderLine: n.isEnableBorderLine(), exposure: n.getExposureShift(), ambientLight: n.isEnableIBLBackground(), IBLName: t.IBLSceneOption, enableIBLBackground: t.withBackground }), e.elements > 8e4 && e.triangles > 2e7 ? o.effect = "high" : o.effect = "low"
            }, this.state = o
        };
    t.prototype = {
        init: function() {
            if (this.state.initialized) return !1;
            var e, t = this,
                n = this._opt,
                o = n.viewer,
                i = o._data,
                a = n.Toolbars,
                r = o._manifest,
                s = r.Features.HasComponentStructure || r.Features.HasFileList || r.Features.HasLinkRelation || r.Features.HasRoom || r.Features.HasArea || r.Features.HasDrawing || r.Features.HasMEPSystem || r.Features.HasGroup || r.Features.HasAssemble;
            if (r.Metadata.filetype) {
                var l = r.Metadata.FileType;
                e = "rfa" != l && "stp" != l && "step" != l
            } else e = -1 == i.workerType.indexOf("rfa-") && -1 == i.workerType.indexOf("stp-") && -1 == i.workerType.indexOf("step-");
            if (-1 != a.indexOf("MainToolbar")) {
                var c = Glodon.Bimface.UI.Toolbar.ToolbarConfig();
                c.id = "MainToolbar", c.title = "主菜单", c.className = "bf-toolbar bf-toolbar-bottom", c.element = n.element, c.buttons = [].concat(_toConsumableArray(n.Buttons)), r.Features.HasComponentProperty || (c.buttons.removeByValue("Property"), c.buttons.removeByValue("MobileProperty")), r.Features.HasMiniMap || c.buttons.removeByValue("Map"), e || c.buttons.removeByValue("Walk"), this.addToolbar(c)
            }
            if (s && -1 != a.indexOf("ModelTree") && !t._modelTree) {
                var d = Glodon.Bimface.UI.Toolbar.ToolbarConfig();
                d.id = "ModelTree", d.title = "目录树", d.className = "bf-toolbar bf-toolbar bf-tree-toolbar", d.element = n.element, d.buttons = ["ModelTree"], this.addToolbar(d)
            }
            if (r.Features.HasFamilyTypeList && n.EnableFamilyList) {
                var u = Glodon.Bimface.UI.Toolbar.ToolbarConfig();
                u.id = "FamilyTypes", u.title = "FamilyTypes", u.className = "bf-toolbar bf-toolbar bf-toolbar-select", u.element = n.element, u.buttons = ["FamilyList"], this.addToolbar(u)
            }
            n.contextMenu && (o.addEventListener(Glodon.Bimface.Viewer.Viewer3DEvent.ContextMenu, t._contextMenuCb), o.addEventListener(Glodon.Bimface.Viewer.Viewer3DEvent.ComponentsSelectionChanged, function(e) { e.objectId && (t._objectTypes[e.objectId] = e.objectType) })), this.onKeyUp = function(e) {
                if (e && 27 == e.keyCode && !CLOUD.EditorConfig.NoKey) {
                    var n = t.getToolbar("MainToolbar"),
                        i = n.getControl("RectangleSelect"),
                        a = n.getControl("Measure"),
                        r = getSectionState(t),
                        s = n.getControl("Walk");
                    if (i && i.isChecked()) i.setCheckedState(!1);
                    else if (a && a.isChecked()) {
                        var l = t.getPlugin("Measure");
                        l && l.getInfo().points.length > 0 ? l.redo() : a.setCheckedState(!1)
                    } else r.enable ? clearSection(t) : s && s.isChecked() && s.setCheckedState(!1);
                    o.render()
                }
            }, document.addEventListener("keyup", this.onKeyUp), t.state.setDefault(), t.state.initialized = !0
        },
        addToolbar: function(e) {
            var t = this,
                n = Glodon.Bimface.Application.UI.Toolbar.Toolbar(e, t);
            this._toolbars.push(n)
        },
        removeToolbar: function(e) { return this._toolbars.removeObjectByAttribute("id", e), [].concat(_toConsumableArray(this._toolbars)) },
        getToolbar: function(e) { return this._toolbars.getObjectByAttribute("id", e) },
        getToolbars: function() { return [].concat(_toConsumableArray(this._toolbars)) },
        getViewer: function() { return this._opt.viewer },
        getRootElement: function() { return this._opt.element },
        addPanel: function(e) { this._panels.push(e) },
        removePanel: function(e) { this._panels.removeObjectByAttribute("id", e) },
        getPanel: function(e) { return this._panels.getObjectByAttribute("id", e) },
        getPanels: function(e) { return [].concat(_toConsumableArray(this._panels)) },
        addPlugin: function(e) { this._plugins.push(e) },
        removePlugin: function(e) { this._plugins.removeObjectByAttribute("id", e) },
        getPlugin: function(e) { return this._plugins.getObjectByAttribute("id", e) },
        getPlugins: function(e) { return [].concat(_toConsumableArray(this._plugins)) },
        destroy: function() {
            document.removeEventListener("keyup", this.onKeyUp), this._opt.viewer.removeEventListener(Glodon.Bimface.Viewer.Viewer3DEvent.ContextMenu, this._contextMenuCb);
            for (var e = 0; e < this._toolbars.length; e++) this._toolbars[e].destroy();
            for (var t = 0; t < this._panels.length; t++) this._panels[t].destroy();
            for (var n = 0; n < this._plugins.length; n++) this._plugins[n].exit();
            this._toolbars = [], this._panels = [], this._plugins = [], this.state.initialized = !1, this._opt.viewer.render(), this._opt = null
        }
    }, e.UI = t
}();