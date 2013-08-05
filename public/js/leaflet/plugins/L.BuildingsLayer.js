(function (a) {
    function l(f, c) {
        var q = f[0] - c[0],
            h = f[1] - c[1];
        return q * q + h * h
    }

    function Ba(f) {
        for (var c = 0, q = 0, h = 0, a = f.length - 3; h < a; h += 2) c += f[h], q += f[h + 1];
        f = 2 * (f.length - 2);
        return [c / f << 0, q / f << 0]
    }

    function Ca(f) {
        var c = f.length / 2,
            q = new Z(c),
            h = 0,
            a = c - 1,
            k, e, j, B, l = [],
            G = [],
            H = [];
        for (q[h] = q[a] = 1; a;) {
            e = 0;
            for (k = h + 1; k < a; k++) {
                j = f[2 * k];
                var n = f[2 * k + 1],
                    y = f[2 * h],
                    z = f[2 * h + 1],
                    E = f[2 * a],
                    A = f[2 * a + 1],
                    r = E - y,
                    C = A - z,
                    w = void 0;
                if (0 !== r || 0 !== C) w = ((j - y) * r + (n - z) * C) / (r * r + C * C), 1 < w ? (y = E, z = A) : 0 < w && (y += r * w, z += C * w);
                r = j - y;
                C = n - z;
                j = r * r + C * C;
                j > e && (B =
                    k, e = j)
            }
            2 < e && (q[B] = 1, l.push(h), G.push(B), l.push(B), G.push(a));
            h = l.pop();
            a = G.pop()
        }
        for (k = 0; k < c; k++) q[k] && H.push(f[2 * k], f[2 * k + 1]);
        return H
    }
    var Da = Da || Array,
        Z = Z || Array,
        e = Math,
        Ma = e.exp,
        Na = e.log,
        Oa = e.sin,
        Pa = e.cos,
        va = e.tan,
        Qa = e.atan,
        aa = e.min,
        wa = e.max,
        pa = document,
        j, Ea = function (f) {
            var c, a, h;
            if (0 === f.s) c = a = h = f.l;
            else {
                h = 0.5 > f.l ? f.l * (1 + f.s) : f.l + f.s - f.l * f.s;
                var e = 2 * f.l - h;
                f.h /= 360;
                c = V(e, h, f.h + 1 / 3);
                a = V(e, h, f.h);
                h = V(e, h, f.h - 1 / 3)
            }
            return new j(255 * c << 0, 255 * a << 0, 255 * h << 0, f.a)
        }, V = function (f, c, a) {
            0 > a && (a += 1);
            1 < a && (a -=
                1);
            return a < 1 / 6 ? f + 6 * (c - f) * a : 0.5 > a ? c : a < 2 / 3 ? f + 6 * (c - f) * (2 / 3 - a) : f
        }, e = function (f, a, q, h) {
            this.r = f;
            this.g = a;
            this.b = q;
            this.a = 4 > arguments.length ? 1 : h
        }, W = e.prototype;
    W.toString = function () {
        return "rgba(" + [this.r << 0, this.g << 0, this.b << 0, this.a.toFixed(2)].join() + ")"
    };
    W.adjustLightness = function (a) {
        var c = j.toHSLA(this);
        c.l *= a;
        c.l = Math.min(1, Math.max(0, c.l));
        return Ea(c)
    };
    W.adjustAlpha = function (a) {
        return new j(this.r, this.g, this.b, this.a * a)
    };
    e.parse = function (a) {
        var c;
        a += "";
        if (~a.indexOf("#")) return c = a.match(/^#?(\w{2})(\w{2})(\w{2})(\w{2})?$/),
        new j(parseInt(c[1], 16), parseInt(c[2], 16), parseInt(c[3], 16), c[4] ? parseInt(c[4], 16) / 255 : 1);
        if (c = a.match(/rgba?\((\d+)\D+(\d+)\D+(\d+)(\D+([\d.]+))?\)/)) return new j(parseInt(c[1], 10), parseInt(c[2], 10), parseInt(c[3], 10), c[4] ? parseFloat(c[5]) : 1);
        if (c = a.match(/hsla?\(([\d.]+)\D+([\d.]+)\D+([\d.]+)(\D+([\d.]+))?\)/)) return Ea({
            h: parseInt(c[1], 10),
            s: parseFloat(c[2]),
            l: parseFloat(c[3]),
            a: c[4] ? parseFloat(c[5]) : 1
        })
    };
    e.toHSLA = function (a) {
        var c = a.r / 255,
            q = a.g / 255,
            h = a.b / 255,
            e = Math.max(c, q, h),
            k = Math.min(c, q, h),
            j, B = (e + k) / 2,
            l;
        if (e === k) j = k = 0;
        else {
            l = e - k;
            k = 0.5 < B ? l / (2 - e - k) : l / (e + k);
            switch (e) {
            case c:
                j = (q - h) / l + (q < h ? 6 : 0);
                break;
            case q:
                j = (h - c) / l + 2;
                break;
            case h:
                j = (c - q) / l + 4
            }
            j /= 6
        }
        return {
            h: 360 * j,
            s: k,
            l: B,
            a: a.a
        }
    };
    j = e;
    var Fa, e = Math,
        A = e.sin,
        F = e.cos,
        Ra = e.tan,
        Ga = e.asin,
        Ha = e.atan2,
        S = e.PI,
        n = 180 / S,
        Sa = 357.5291 / n,
        Ta = 0.98560028 / n,
        Ua = 1.9148 / n,
        Va = 0.02 / n,
        Wa = 3E-4 / n,
        Xa = 102.9372 / n,
        Ia = 23.45 / n,
        Ya = 280.16 / n,
        Za = 360.9856235 / n;
    Fa = function (a, c, e) {
        e = -e / n;
        c /= n;
        a = a.valueOf() / 864E5 - 0.5 + 2440588;
        var h = Sa + Ta * (a - 2451545),
            j = Ua * A(h) + Va * A(2 * h) + Wa * A(3 * h),
            j = h + Xa + j + S,
            h = Ga(A(j) * A(Ia)),
            j = Ha(A(j) * F(Ia), F(j));
        e = Ya + Za * (a - 2451545) - e - j;
        return {
            altitude: Ga(A(c) * A(h) + F(c) * F(h) * F(e)),
            azimuth: Ha(A(e), F(e) * A(c) - Ra(h) * F(c)) - S / 2
        }
    };
    var ba = Math.PI,
        Ja = ba / 2,
        $a = ba / 4,
        ab = 180 / ba,
        bb = 256,
        xa = 14,
        ca = "latitude",
        da = "longitude",
        Ka = 3,
        La = 4,
        G = 0,
        B = 1,
        H = 2,
        E = 3,
        qa = 4,
        T = 5,
        K = 6;
    a.OSMBuildings = function (f) {
        function c(b, N) {
            var d = {};
            b /= ea;
            N /= ea;
            d[ca] = 0 >= N ? 90 : 1 <= N ? -90 : ab * (2 * Qa(Ma(ba * (1 - 2 * N))) - Ja);
            d[da] = 360 * (1 === b ? 1 : (b % 1 + 1) % 1) - 180;
            return d
        }

        function e() {
            if (S && !(w < xa)) {
                var b = c(r - U, C - oa),
                    N = c(r + y + U, C +
                        z + oa);
                ra && ra.abort();
                var d = {
                    w: b[da],
                    n: b[ca],
                    e: N[da],
                    s: N[ca],
                    z: w
                }, b = S.replace(/\{ *([\w_]+) *\}/g, function (b, a) {
                        return d[a]
                    }),
                    g = h,
                    a = new XMLHttpRequest;
                a.onreadystatechange = function () {
                    4 === a.readyState && a.status && !(200 > a.status || 299 < a.status) && a.responseText && g(JSON.parse(a.responseText))
                };
                a.open("GET", b);
                a.send(null);
                ra = a
            }
        }

        function h(b) {
            var a, d, g, D, c = [],
                e = d = 0;
            X = xa;
            F(w);
            ra = null;
            if (b && b.meta.z === w) {
                D = b.meta;
                g = b.data;
                if (x && p && x.z === D.z) {
                    d = x.x - D.x;
                    e = x.y - D.y;
                    b = 0;
                    for (a = p.length; b < a; b++) c[b] = p[b][H][0] + d +
                        "," + (p[b][H][1] + e)
                }
                x = D;
                p = [];
                b = 0;
                for (a = g.length; b < a; b++)
                    if (D = [], !(g[b][B] > fa) && (d = Ca(g[b][H]), !(8 > d.length))) {
                        D[H] = d;
                        D[qa] = Ba(d);
                        D[G] = aa(g[b][G], fa);
                        D[B] = g[b][B];
                        d = D[H][0] + "," + D[H][1];
                        D[T] = !(c && ~c.indexOf(d));
                        D[E] = [];
                        D[K] = [];
                        d = g[b][Ka] ? j.parse(g[b][Ka]) : null;
                        e = g[b][La] ? j.parse(g[b][La]) : null;
                        D[E] = [d || null, d ? d.adjustLightness(0.8) : null, e ? e : d ? d.adjustLightness(1.2) : O];
                        for (d = 0; 3 > d; d++) D[E][d] && (D[K][d] = D[E][d].adjustAlpha(I) + "");
                        p.push(D)
                    }
                V()
            }
        }

        function n(b, a) {
            var d, g, c = [],
                e, f, h, m, j, P, l, k, p = ya - w;
            e = 0;
            for (f =
                b.length; e < f; e++)
                if (j = b[e], l = j[B] >> p, !(l > fa)) {
                    P = j[H];
                    k = new Da(P.length);
                    h = 0;
                    for (m = P.length - 1; h < m; h += 2) d = P[h + 1], g = aa(1, wa(0, 0.5 - Na(va($a + Ja * P[h] / 180)) / ba / 2)), d = (d / 360 + 0.5) * ea << 0, g = g * ea << 0, k[h] = d, k[h + 1] = g;
                    k = Ca(k);
                    if (!(8 > k.length)) {
                        m = [];
                        m[H] = k;
                        m[qa] = Ba(k);
                        m[G] = aa(j[G] >> p, fa);
                        m[B] = l;
                        m[T] = a;
                        m[E] = j[E];
                        m[K] = [];
                        for (h = 0; 3 > h; h++) m[E][h] && (m[K][h] = m[E][h].adjustAlpha(I) + "");
                        c.push(m)
                    }
                }
            return c
        }

        function k(b, a, d) {
            void 0 === d && (d = []);
            var g, c, h, e = b[0] ? b : b.features,
                f, m, l, P, p, q, z = a ? 1 : 0,
                u = a ? 0 : 1;
            if (e) {
                b = 0;
                for (g = e.length; b <
                    g; b++) k(e[b], a, d);
                return d
            }
            "Feature" === b.type && (g = b.geometry, m = b.properties);
            "Polygon" === g.type && (f = [g.coordinates]);
            "MultiPolygon" === g.type && (f = g.coordinates);
            if (f) {
                P = m.height;
                if (m.color || m.wallColor) p = j.parse(m.color || m.wallColor);
                m.roofColor && (q = j.parse(m.roofColor));
                b = 0;
                for (g = f.length; b < g; b++) {
                    a = f[b][0];
                    l = [];
                    c = e = 0;
                    for (h = a.length; c < h; c++) l.push(a[c][z], a[c][u]), e += P || a[c][2] || 0;
                    if (e) {
                        h = c = [];
                        var t = H;
                        for (var s = void 0, v = void 0, x = void 0, y = void 0, w = 0, r = void 0, C = void 0, r = 0, C = l.length - 3; r < C; r += 2) s = l[r],
                        v = l[r + 1], x = l[r + 2], y = l[r + 3], w += s * y - x * v;
                        if ("CW" !== (0 < w / 2 ? "CW" : "CCW")) {
                            s = [];
                            for (v = l.length - 2; 0 <= v; v -= 2) s.push(l[v], l[v + 1]);
                            l = s
                        }
                        h[t] = l;
                        c[G] = e / a.length << 0;
                        c[B] = m.minHeight;
                        c[E] = [p || null, p ? p.adjustLightness(0.8) : null, q ? q : p ? p.adjustLightness(1.2) : O];
                        d.push(c)
                    }
                }
            }
            return d
        }

        function A(b, a) {
            b ? (ga = k(b, a), X = 0, F(w), x = {
                n: 90,
                w: -180,
                s: -90,
                e: 180,
                x: 0,
                y: 0,
                z: w
            }, p = n(ga, !0), V()) : (ga = null, $())
        }

        function F(b) {
            var a, d, g;
            w = b;
            ea = bb << w;
            b = w;
            a = X;
            d = ya;
            b = aa(wa(b, a), d);
            I = 1 - aa(wa(0 + 0.4 * ((b - a) / (d - a)), 0), 0.4);
            za = R.adjustAlpha(I) + "";
            ha =
                sa.adjustAlpha(I) + "";
            ia = O.adjustAlpha(I) + "";
            if (p) {
                b = 0;
                for (a = p.length; b < a; b++) {
                    g = p[b];
                    g[K] = [];
                    for (d = 0; 3 > d; d++) g[E][d] && (g[K][d] = g[E][d].adjustAlpha(I) + "")
                }
            }
        }

        function V() {
            clearInterval(Aa);
            M = 0;
            ta.render();
            Aa = setInterval(function () {
                M += 0.1;
                if (1 < M) {
                    clearInterval(Aa);
                    M = 1;
                    for (var b = 0, a = p.length; b < a; b++) p[b][T] = 0
                }
                ua.render();
                $()
            }, 33)
        }

        function ma() {
            ua.render();
            ta.render();
            $()
        }

        function $() {
            J.clearRect(0, 0, y, z);
            if (x && p && !(w < X || ja)) {
                var b, a, d, g, c, e, h, f, m, j = r - x.x,
                    k = C - x.y,
                    q = ta.getMaxHeight(),
                    n = [ka + j, la + k],
                    Q, u,
                    t, s, v, A;
                p.sort(function (b, a) {
                    return l(a[qa], n) / a[G] - l(b[qa], n) / b[G]
                });
                b = 0;
                for (a = p.length; b < a; b++)
                    if (c = p[b], !(c[G] <= q)) {
                        u = !1;
                        e = c[H];
                        Q = [];
                        d = 0;
                        for (g = e.length - 1; d < g; d += 2) Q[d] = f = e[d] - j, Q[d + 1] = m = e[d + 1] - k, u || (u = 0 < f && f < y && 0 < m && m < z);
                        if (u) {
                            d = c[T] ? c[G] * M : c[G];
                            e = Y / (Y - d);
                            c[B] && (d = c[T] ? c[B] * M : c[B], h = Y / (Y - d));
                            f = [];
                            d = 0;
                            for (g = Q.length - 3; d < g; d += 2) m = Q[d], t = Q[d + 1], u = Q[d + 2], s = Q[d + 3], v = na(m, t, e), A = na(u, s, e), c[B] && (t = na(m, t, h), s = na(u, s, h), m = t.x, t = t.y, u = s.x, s = s.y), (u - m) * (v.y - t) > (v.x - m) * (s - t) && (J.fillStyle = m < u && t < s || m > u &&
                                t > s ? c[K][1] || ha : c[K][0] || za, W([u, s, m, t, v.x, v.y, A.x, A.y])), f[d] = v.x, f[d + 1] = v.y;
                            J.fillStyle = c[K][2] || ia;
                            J.strokeStyle = c[K][1] || ha;
                            W(f, !0)
                        }
                    }
            }
        }

        function W(b, a) {
            if (b.length) {
                J.beginPath();
                J.moveTo(b[0], b[1]);
                for (var d = 2, c = b.length; d < c; d += 2) J.lineTo(b[d], b[d + 1]);
                J.closePath();
                a && J.stroke();
                J.fill()
            }
        }

        function na(b, a, d) {
            return {
                x: (b - ka) * d + ka << 0,
                y: (a - la) * d + la << 0
            }
        }
        var y = 0,
            z = 0,
            U = 0,
            oa = 0,
            r = 0,
            C = 0,
            w, ea, ra, J, S, R = new j(200, 190, 180),
            sa = R.adjustLightness(0.8),
            O = R.adjustLightness(1.2),
            za = R + "",
            ha = sa + "",
            ia = O + "",
            ga, x, p, M =
                1,
            Aa, I = 1,
            X = xa,
            ya = 20,
            fa, ka, la, Y, ja, Z = {
                container: null,
                items: [],
                init: function (b) {
                    var a = this.container = pa.createElement("DIV");
                    a.style.pointerEvents = "none";
                    a.style.position = "absolute";
                    a.style.left = 0;
                    a.style.top = 0;
                    ua.init(this.create());
                    ta.init(this.create());
                    J = this.create();
                    b.appendChild(a);
                    return a
                },
                create: function () {
                    var b = pa.createElement("CANVAS");
                    b.style.webkitTransform = "translate3d(0,0,0)";
                    b.style.imageRendering = "optimizeSpeed";
                    b.style.position = "absolute";
                    b.style.left = 0;
                    b.style.top = 0;
                    var a = b.getContext("2d");
                    a.lineCap = "round";
                    a.lineJoin = "round";
                    a.lineWidth = 1;
                    try {
                        a.mozImageSmoothingEnabled = !1
                    } catch (d) {}
                    this.items.push(b);
                    this.container.appendChild(b);
                    return a
                },
                setSize: function (b, a) {
                    for (var d = this.items, c = 0, e = d.length; c < e; c++) d[c].width = b, d[c].height = a
                }
            }, ua = {
                context: null,
                color: new j(0, 0, 0),
                colorStr: this.color + "",
                date: null,
                alpha: 1,
                length: 0,
                directionX: 0,
                directionY: 0,
                init: function (b) {
                    this.context = b;
                    this.setDate((new Date).setHours(10))
                },
                render: function () {
                    var b = this.context,
                        a, d, g, e;
                    b.clearRect(0, 0, y, z);
                    if (x &&
                        p && !(w < X || ja))
                        if (a = c(r + U, C + oa), a = Fa(this.date, a.latitude, a.longitude), !(0 >= a.altitude)) {
                            d = 1 / va(a.altitude);
                            g = 0.4 / d;
                            this.directionX = Pa(a.azimuth) * d;
                            this.directionY = Oa(a.azimuth) * d;
                            this.color.a = g;
                            e = this.color + "";
                            var h, f, j, m, l, k, q = r - x.x,
                                A = C - x.y,
                                n, u, t, s, v, E, F = [];
                            b.beginPath();
                            a = 0;
                            for (d = p.length; a < d; a++) {
                                f = p[a];
                                u = !1;
                                j = f[H];
                                n = [];
                                g = 0;
                                for (h = j.length - 1; g < h; g += 2) n[g] = l = j[g] - q, n[g + 1] = k = j[g + 1] - A, u || (u = 0 < l && l < y && 0 < k && k < z);
                                if (u) {
                                    j = f[T] ? f[G] * M : f[G];
                                    f[B] && (m = f[T] ? f[B] * M : f[B]);
                                    l = null;
                                    g = 0;
                                    for (h = n.length - 3; g < h; g += 2) k =
                                        n[g], t = n[g + 1], u = n[g + 2], s = n[g + 3], v = this.project(k, t, j), E = this.project(u, s, j), f[B] && (t = this.project(k, t, m), s = this.project(u, s, m), k = t.x, t = t.y, u = s.x, s = s.y), (u - k) * (v.y - t) > (v.x - k) * (s - t) ? (1 === l && b.lineTo(k, t), l = 0, g || b.moveTo(k, t), b.lineTo(u, s)) : (0 === l && b.lineTo(v.x, v.y), l = 1, g || b.moveTo(v.x, v.y), b.lineTo(E.x, E.y));
                                    b.closePath();
                                    F.push(n)
                                }
                            }
                            b.fillStyle = e;
                            b.fill();
                            b.globalCompositeOperation = "destination-out";
                            b.beginPath();
                            a = 0;
                            for (d = F.length; a < d; a++) {
                                m = F[a];
                                b.moveTo(m[0], m[1]);
                                g = 2;
                                for (h = m.length; g < h; g += 2) b.lineTo(m[g],
                                    m[g + 1]);
                                b.lineTo(m[0], m[1]);
                                b.closePath()
                            }
                            b.fillStyle = "#00ff00";
                            b.fill();
                            b.globalCompositeOperation = "source-over"
                        }
                },
                project: function (a, c, d) {
                    return {
                        x: a + this.directionX * d,
                        y: c + this.directionY * d
                    }
                },
                setDate: function (a) {
                    this.date = a;
                    this.render()
                }
            }, ta = {
                context: null,
                maxHeight: 8,
                init: function (a) {
                    this.context = a
                },
                render: function () {
                    var a = this.context;
                    a.clearRect(0, 0, y, z);
                    if (x && p && !(w < X || ja)) {
                        var c, d, g, e, f, h, j, m = r - x.x,
                            l = C - x.y,
                            k, n;
                        a.beginPath();
                        c = 0;
                        for (d = p.length; c < d; c++) {
                            g = p[c];
                            n = !1;
                            f = g[H];
                            k = [];
                            g = 0;
                            for (e = f.length -
                                1; g < e; g += 2) k[g] = h = f[g] - m, k[g + 1] = j = f[g + 1] - l, n || (n = 0 < h && h < y && 0 < j && j < z);
                            if (n) {
                                g = 0;
                                for (e = k.length - 3; g < e; g += 2) n = k[g], f = k[g + 1], g ? a.lineTo(n, f) : a.moveTo(n, f);
                                a.closePath()
                            }
                        }
                        a.fillStyle = ia;
                        a.strokeStyle = ha;
                        a.stroke();
                        a.fill()
                    }
                },
                getMaxHeight: function () {
                    return this.maxHeight
                }
            };
        this.setStyle = function (a) {
            a = a || {};
            if (a.color || a.wallColor) R = j.parse(a.color || a.wallColor), za = R.adjustAlpha(I) + "", sa = R.adjustLightness(0.8), ha = sa.adjustAlpha(I) + "", O = R.adjustLightness(1.2), ia = O.adjustAlpha(I) + "";
            a.roofColor && (O = j.parse(a.roofColor),
                ia = O.adjustAlpha(I) + "");
            ma();
            return this
        };
        this.geoJSON = function (b, c) {
            if ("object" === typeof b) A(b, !c);
            else {
                var d = pa.documentElement,
                    e = pa.createElement("script");
                a.jsonpCallback = function (b) {
                    delete a.jsonpCallback;
                    d.removeChild(e);
                    A(b, !c)
                };
                d.insertBefore(e, d.lastChild).src = b.replace(/\{callback\}/, "jsonpCallback")
            }
            return this
        };
        this.setCamOffset = function (a, c) {
            ka = U + a;
            la = z + c
        };
        this.setMaxZoom = function (a) {
            ya = a
        };
        this.setDate = function (a) {
            ua.setDate(a);
            return this
        };
        this.appendTo = function (a) {
            return Z.init(a)
        };
        this.loadData = e;
        this.onMoveEnd = function () {
            var a = c(r, C),
                f = c(r + y, C + z);
            ma();
            x && (a[ca] > x.n || a[da] < x.w || f[ca] < x.s || f[da] > x.e) && e()
        };
        this.onZoomEnd = function (a) {
            ja = !1;
            F(a.zoom);
            ga ? (p = n(ga), ma()) : ($(), e())
        };
        this.onZoomStart = function () {
            ja = !0;
            ma()
        };
        this.setOrigin = function (a, c) {
            r = a;
            C = c
        };
        this.setSize = function (a, c) {
            y = a;
            z = c;
            U = y / 2 << 0;
            oa = z / 2 << 0;
            ka = U;
            la = z;
            Y = y / (1.5 / (window.devicePixelRatio || 1)) / va(45) << 0;
            Z.setSize(y, z);
            fa = Y - 50
        };
        this.setZoom = F;
        this.render = $;
        S = f
    };
    a.OSMBuildings.VERSION = "0.1.8a";
    a.OSMBuildings.ATTRIBUTION =
        '&copy; <a href="http://osmbuildings.org">OSM Buildings</a>'
})(this);
L.BuildingsLayer = L.Class.extend({
    map: null,
    osmb: null,
    container: null,
    blockMoveEvent: null,
    lastX: 0,
    lastY: 0,
    initialize: function (a) {
        L.Util.setOptions(this, a)
    },
    onMove: function () {
        var a = L.DomUtil.getPosition(this.map._mapPane);
        this.osmb.setCamOffset(this.lastX - a.x, this.lastY - a.y);
        this.osmb.render()
    },
    onMoveEnd: function () {
        if (this.blockMoveEvent) this.blockMoveEvent = !1;
        else {
            var a = L.DomUtil.getPosition(this.map._mapPane),
                l = this.map.getPixelOrigin();
            this.lastX = a.x;
            this.lastY = a.y;
            this.container.style.left = -a.x + "px";
            this.container.style.top = -a.y + "px";
            this.osmb.setCamOffset(0, 0);
            this.osmb.setSize(this.map._size.x, this.map._size.y);
            this.osmb.setOrigin(l.x - a.x, l.y - a.y);
            this.osmb.onMoveEnd()
        }
    },
    onZoomStart: function () {
        this.osmb.onZoomStart()
    },
    onZoomEnd: function () {
        var a = L.DomUtil.getPosition(this.map._mapPane),
            l = this.map.getPixelOrigin();
        this.osmb.setOrigin(l.x - a.x, l.y - a.y);
        this.osmb.onZoomEnd({
            zoom: this.map._zoom
        });
        this.blockMoveEvent = !0
    },
    addTo: function (a) {
        a.addLayer(this);
        return this
    },
    onAdd: function (a) {
        this.map = a;
        a = this.map._panes.overlayPane;
        this.osmb ? a.appendChild(this.container) : (this.osmb = new OSMBuildings(this.options.url), this.container = this.osmb.appendTo(a), this.osmb.maxZoom = this.map._layersMaxZoom);
        a = L.DomUtil.getPosition(this.map._mapPane);
        var l = this.map.getPixelOrigin();
        this.osmb.setSize(this.map._size.x, this.map._size.y);
        this.osmb.setOrigin(l.x - a.x, l.y - a.y);
        this.osmb.setZoom(this.map._zoom);
        this.container.style.left = -a.x + "px";
        this.container.style.top = -a.y + "px";
        this.map.on({
            move: this.onMove,
            moveend: this.onMoveEnd,
            zoomstart: this.onZoomStart,
            zoomend: this.onZoomEnd
        }, this);
        this.map.attributionControl.addAttribution(OSMBuildings.ATTRIBUTION);
        this.osmb.loadData();
        this.osmb.render()
    },
    onRemove: function (a) {
        a.attributionControl.removeAttribution(OSMBuildings.ATTRIBUTION);
        a.off({
            move: this.onMove,
            moveend: this.onMoveEnd,
            zoomstart: this.onZoomStart,
            zoomend: this.onZoomEnd
        }, this);
        this.container.parentNode.removeChild(this.container)
    },
    geoJSON: function (a, l) {
        return this.osmb.geoJSON(a, l)
    },
    setStyle: function (a) {
        return this.osmb.setStyle(a)
    },
    setDate: function (a) {
        return this.osmb.setDate(a)
    }
});