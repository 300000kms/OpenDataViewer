var urlPath, svgPath, menuBorder, webgl, spincss, status;

function textos() {
    i18next.use(i18nextXHRBackend).use(i18nextBrowserLanguageDetector).init({
        returnNull: !1,
        returnEmptyString: !1,
        debug: !1,
        fallbackLng: "es",
        load: "current",
        whitelist: ["es", "en"],
        backend: {
            loadPath: "lng/{{lng}}/{{ns}}.json",
            crossDomain: !0
        },
        detection: {
            order: ["querystring", "cookie", "localStorage", "navigator", "htmlTag"],
            lookupQuerystring: "lng",
            lookupCookie: "i18next",
            lookupLocalStorage: "i18nextLng",
            caches: ["localStorage", "cookie"]
        }
    }, function() {
        jqueryI18next.init(i18next, $), lng = window.i18next.language, ns = "", lng !== "ca" && lng !== "es" && lng !== "en" && (lng = "ca"), $("body").localize(), $(document).trigger("i18next"), lngbutt()
    })
}

function lngbutt() {
    lng = i18next.language, es = ["es", "ES", "es-ES"], es.indexOf(lng) != -1 ? $('a[href$="index.html?lng=es"]').addClass("active") : $('a[href$="index.html?lng=en"]').addClass("active")
}

function _ft(t) {
    var e = (Math.round(t * 100) / 100).toLocaleString(void 0, {
        minimumFractionDigits: 2
    });
    return e.toString() == "NaN" ? t : e
}

function _tr(e) {
    var a, i;
    a = Array.isArray(e), a == 1 || a == 0 && (e = [e]), i = [];
    for (t in e) {
        t = tostr(e[t]), ltx = t.split("/"), response = [];
        for (l in ltx) ltx[l] == "" ? response.push("--") : Number.isFinite(Number(ltx[l])) == 1 ? response.push(Number(ltx[l])) : (r = i18next.t(ltx[l]), r == null && (r = ltx[l]), response.push(r));
        response.length > 1 ? response = response.join(" / ") : [response = response[0]], i.push(response)
    }
    return a == 1 ? i : a == 0 ? i[0] : void 0
}

function _tr_axis(e) {
    return console.log(e), t = tostr(e[t]), ltx = t.split("<br>"), console.log(_tr(ltx)), r = _tr(ltx).join("<br>"), console.log(r), r
}

function toint(t) {
    return t == "" ? null : isNaN(parseFloat(t)) ? t : parseInt(parseFloat(t))
}

function toreal(t) {
    var e;
    return e = t == "" || t == null || t == void 0 ? null : isNaN(Number(t)) ? t == void 0 ? null : t.replace("/", "/") : Number(t)
}

function tostr(t) {
    return t == null ? "" : t.toString()
}

function getMax(t) {
    ll = [];
    for (i in t) isNaN(t[i]) == 0 && ll.push(t[i]);
    return Math.max.apply(null, ll)
}

function getMin(t) {
    ll = [];
    for (i in t) isNaN(t[i]) == 0 && ll.push(t[i]);
    return Math.min.apply(null, ll)
}

function parseJson(t) {
    dd = jQuery.parseJSON(t);
    for (_dd in dd) Array.isArray(dd[_dd]) == 0 && (dd[_dd] = [dd[_dd]]);
    return dd
}

function getColorList(t) {
    for (scalec = chroma.scale(["rgba(255,10,10,0.7)", "rgba(0,0,0,1)"]).domain([0, t]), list = [], i = 0; t > i; i++) list.push("rgba(" + scalec(i).rgba().join(",") + ")");
    return list
}

function getColors(t, e) {
    return e == 1 ? colorscale[t] : e == 2 ? colorscale[t] : e == 3 ? colorscale[e - t - 1] : e == 4 ? colorscale[e - t - 1] : (scalec = chroma.scale(["rgba(255,80,80,0.5)", "rgba(255,10,10,0.8)", "rgba(0,0,0,1)"]).domain([0, e]), "rgba(" + scalec(t).rgba().join(",") + ")")
}

function len(t) {
    return t = String(t), t.length
}

function breakline(t) {
    var e, a;
    return t.length > 40 && typeof t == "string" && (e = t.substr(0, parseInt(t.length / 2)), a = t.substr(parseInt(t.length / 2) + 1), t = e + "<br>" + a), t
}

function parsePlotlyData(t, e, a, i, s) {
    var r, o, l, c, d, h, p, g, u, _, f, m, v;
    if (e = e.toLowerCase(), (s == void 0 || s == "") && (s = "markers"), ["default", "stack", "pie"].indexOf(a) != -1) {
        r = {}, o = parseJson(i), o.x == void 0 && (o.x = [0]);
        for (l in t) {
            csvString = t[l], csv = csvString.splice(1), headers = csvString[0], series = {}, strace = [], t[l] = csvString.concat(csv);
            for (y in o.y) {
                c = {}, d = [];
                for (row in csv) d.push(toreal(csv[row][o.y[y]]));
                o.x.length == o.y.length ? x = y : o.x.length != o.y.length && (x = 0), h = [];
                for (row in csv) h.push(toreal(csv[row][o.x[x]]));
                c.yaxis = _tr(headers[o.y[y]]), c.xaxis = _tr(headers[o.x[x]]), p = [];
                for (row in csv) p.push(csv[row][0]);
                if (c.type = e, c.mode = s, c.name = _tr(headers[o.x[x]]) + " <br> " + _tr(headers[o.y[y]]), c.marker = {
                        color: getColors(y, o.y.length)
                    }, c.line = {
                        color: getColors(y, o.y.length)
                    }, c.hoverinfo = "none", c.textinfo = "none", o.s != void 0) {
                    sy = 0, o.s.length == o.y.length ? sy = y : o.x.length != o.y.length && (sy = 0), g = [];
                    for (row in csv) g.push(toint(csv[row][o.s[sy]]) || 1);
                    volum2 = (getMax(d) - getMin(d)) * (getMax(h) - getMin(h)), lsdiff = getMax(g) - getMin(g), c.marker.sizeref = Math.max(volum2 / 400, 80), c.marker.sizemin = 3, c.marker.sizemode = "diameter"
                } else g = 5;
                u = [], _ = [], f = [], m = [];
                for (n in d) u.push(h[n]), _.push(d[n]), Array.isArray(p) == 1 ? f.push(p[n]) : f = p, Array.isArray(g) == 1 ? m.push(g[n]) : m = g;
                h = u, d = _, p = f, g = m, lxlength = h.map(len), max_lxlength = Math.max.apply(null, lxlength), v = 10, window.plotly_bottom = v > max_lxlength ? v + 10 : max_lxlength > 50 ? 50 : max_lxlength * 1.5 + 20, ln_translated = _tr(p), c.text = ln_translated, e == "pie" && (colorpie = getColorList(d.length), c.marker = {
                    colors: colorpie
                }), e == "pie" ? (c.values = d, c.labels = _tr(h), c.hoverinfo = "none", c.hole = .9) : (c.y = d, c.x = _tr(h)), c.marker.size = g, arrayset = Array.from(new Set(c.y)), arrayset[0] == null && arrayset.length == 1 || arrayset.length == 0 && e != "pie" || (o.j == "j" || a == "stack" ? strace.push(c) : (fix = headers[o.x[x]] + "**" + headers[o.y[y]], series[fix] = c))
            }
            strace.length != 0 ? (series.stacked = strace, r[l] = series) : Object.keys(series).length != 0 && (r[l] = series)
        }
        return r
    }
}

function chartHeight() {
    return r = $(window).height() - $("#chart_title").height() - $("#chart_but").height() - 60
}

function plot(e, a, i) {
    var s, r;
    Plotly.purge(e), s = JSON.parse(JSON.stringify(layouts[i].layout)), i.toLowerCase() == "pie" && (a.xaxis = "", a.yaxis = ""), Array.isArray(a) == 1 && ($("#legend").remove(), $("#chart_agg_ctrl").prepend('<div id="legend"></div>'), $("#legend").append('<div class = "label"> legend </div>'), $("#legend").click(function() {
        $(this).hasClass("active") ? (Plotly.relayout("chart_chart", {
            showlegend: !1
        }), $(this).removeClass("active")) : (Plotly.relayout("chart_chart", {
            showlegend: !0
        }), $(this).addClass("active"))
    })), s.xaxis.title = a.xaxis, s.yaxis.title = a.yaxis, s.height = chartHeight(), Plotly.newPlot(e, [], s, JSON.parse(JSON.stringify(layouts[i].confOptions))), Plotly.addTraces(e, a), i.toLowerCase() != "pie" && Plotly.relayout("chart_chart", {
        margin: {
            l: 50,
            t: 10,
            b: plotly_bottom * 3.1,
            r: 0
        }
    }), r = document.getElementById("chart_chart"), r.on("plotly_afterplot", function() {
        Plotly.d3.selectAll(".xtick text").each(function() {
            Plotly.d3.select(this).html().length > 30 && Plotly.d3.select(this).html(Plotly.d3.select(this).html().substr(0, 25) + "...")
        }), Plotly.d3.selectAll(".g-xtitle text").each(function() {
            Plotly.d3.select(this).html().length > 100 && Plotly.d3.select(this).html(Plotly.d3.select(this).html().substr(0, 100) + "...")
        }), Plotly.d3.selectAll(".g-ytitle text").each(function() {
            Plotly.d3.select(this).html().length > 50 && Plotly.d3.select(this).html(Plotly.d3.select(this).html().substr(0, 50) + "...")
        })
    }), r.on("plotly_hover", function(e) {
        cx = e.event.clientX, cy = e.event.clientY - 20, e.points[0].data == void 0 ? (v = e.points[0].v, l = e.points[0].label, text = "", text += _tr(l.split("**")).join("<br>"), text += " : " + v, doTooltip(cx, cy, text)) : e.points[0].data.type == "scatter" ? (x = e.points[0].x, y = e.points[0].y, n = e.points[0].fullData.name, t = e.points[0].text, xt = e.points[0].xaxis.title, yt = e.points[0].yaxis.title, text = "", text += "<strong>" + t + "</strong><br>", text += n.split("<br>")[0] + " : " + "<strong>" + _tr(x) + "</strong>", text += "<br> ", text += n.split("<br>")[1] + " : " + "<strong>" + _tr(y) + "</strong>", doTooltip(cx, cy, text)) : e.points[0].data.type == "bar" && (x = e.points[0].x, y = e.points[0].y, n = e.points[0].fullData.name, t = e.points[0].text, text = n + "<br>", text += "<hr>", text += t + " : ", text += "<strong>" + _tr(y) + "</strong>", doTooltip(cx, cy, text))
    }).on("plotly_unhover", function() {
        $("#chart_tooltip").css("display", "none")
    })
}

function doTooltip(t, e, a) {
    $("#chart_tooltip").html(""), $("#chart_tooltip").html(a), $("#chart_tooltip").css("top", e), $("#chart_tooltip").css("left", t), $("#chart_tooltip").css("margin-left", -$("#chart_tooltip").width() / 2), $("#chart_tooltip").css("margin-top", -$("#chart_tooltip").height() - 5), $("#chart_tooltip").css("display", "block")
}

function addSubAggBut(t, e, a, i) {
    if (kkeys = Object.keys(t[e]), $("#chart_sub_agg").css("display", "block"), $("#chart_sub_agg").html(""), kkeys.length > 1) {
        $("#chart_sub_agg").append('<p class="chart_sub_agg_tit">' + _tr("dimensiones") + "</p>");
        for (k in kkeys) i.toLowerCase() == "bar" ? (arr = kkeys[k].split("**"), arr = _tr(arr[arr.length - 1])) : arr = _tr(kkeys[k].split("**")).join("  + "), $("#chart_sub_agg").append('<p class="but_sub_agg" value="' + kkeys[k] + '"><i class="fa fa-circle-o" aria-hidden="true"></i><i class="fa fa-circle" aria-hidden="true"></i> ' + arr + "</p>");
        i != "Pie" && ($("#chart_sub_agg").css("display", "block"), $("#chart_sub_agg").append('<p class="but_sub_agg right" value="all"><i class="fa fa-dot-circle-o" aria-hidden="true"></i><i class="fa fa-circle" aria-hidden="true"></i>' + _tr("all") + "</p>"))
    } else {
        $("#chart_sub_agg").css("display", "none");
        for (k in kkeys) $("#chart_sub_agg").append('<p class="but_sub_agg" style="display:none" value="' + kkeys[k] + '">' + kkeys[k] + "</p>")
    }
    $(".but_sub_agg").click(function() {
        if ($(".but_sub_agg").each(function() {
                $(this).removeClass("active")
            }), $(this).addClass("active"), $(this).attr("value") == "all") {
            lio = [];
            for (sk in t[e]) lio.push(t[e][sk]);
            plot("chart_chart", lio, a)
        } else plot("chart_chart", t[e][$(this).attr("value")], a)
    })
}

function addAggBut(t, e, a, i) {
    if (e.length > 1) {
        $("#chart_agg").append('<p class="chart_agg_tit">' + _tr("agregaciones") + "</p>");
        for (k in e) $("#chart_agg").append('<p class="but_agg" value="' + e[k] + '"><i class="fa fa-circle-o" aria-hidden="true"></i><i class="fa fa-circle" aria-hidden="true"></i> ' + e[k] + "</p>")
    } else
        for (k in e) $("#chart_agg").append('<p class="but_agg" style="display:none" value="' + e[k] + '"><i class="fa fa-circle-o" aria-hidden="true"></i><i class="fa fa-circle" aria-hidden="true"></i> ' + e[k] + "</p>");
    $(".but_agg").click(function() {
        $(".but_agg").each(function() {
            $(this).removeClass("active")
        }), $(this).addClass("active"), plot("chart_chart", t[$(this).attr("value")][Object.keys(t[$(this).attr("value")])[0]], a), addSubAggBut(t, $(this).attr("value"), a, i), $(".but_sub_agg").first().addClass("active")
    })
}

function cleaniface() {
    $("#chart_sub_agg").height() == 0 && $("#chart_sub_agg").remove(), $("#chart_agg").height() == 0 && $("#chart_agg").remove()
}

function loadChart(t) {
    chapters = {
        continente: "1_",
        contenido: "2_",
        funcionamiento: "3_",
        epilogo: "4_"
    }, name = $(".name", t).text(), chap = $(".chapter", t).text(), url = (urlPath + chapters[chap] + name + ".json").toLowerCase(), $.getJSON(url, function(e) {
        var a, i, s, r, o;
        Object.keys(e), a = $(".type-chart", t).text(), i = $(".layout", t).text(), s = $(".data", t).text(), r = $(".chart-subtype", t).text(), a == "Scattergeo" && (a = "Bar"), a == "Pie" && (i = "pie"), i == "map" && (i = "default"), lay = i, datap = parsePlotlyData(e, a, i, s, r), datapKeys = Object.keys(datap), datapKeys.indexOf("Totales") != -1 && (o = datapKeys.indexOf("Totales"), datapKeys.splice(o, 1), datapKeys.push("Totales")), datapKeys.indexOf("totales") != -1 && (o = datapKeys.indexOf("totales"), datapKeys.splice(o, 1), datapKeys.push("totales")), a == "Pie" && (xaxis = "", yaxis = ""), addSubAggBut(datap, datapKeys[0], lay, a), addAggBut(datap, datapKeys, lay, a), showcsv(e), $(".but_agg").first().trigger("click"), cleaniface()
    })
}

function cookieParse() {
    if (chapters = ["continente", "contenido", "funcionamiento", "epilogo"], Cookies.getJSON("grid") != void 0) {
        grid = Cookies.getJSON("grid");
        for (g in grid) grid[g] == 1 && putMark(g)
    }
}

function cookieMark(t) {
    chapters = ["continente", "contenido", "funcionamiento", "epilogo"], c = Cookies.getJSON("grid"), c == void 0 && (c = {}), c[t] = 1, Cookies.set("grid", c), putMark(t)
}

function putMark(e) {
    chapters = ["continente", "contenido", "funcionamiento", "epilogo"], c = parseFloat(e.split("_")[0]) - 1, t = e.split("_")[1], $("#" + chapters[c] + "_" + t).append('<div class="viewed"></div>')
}

function chartTable() {
    dp = window.dataParser, chapters_dict = {
        continente: "1_",
        contenido: "2_",
        funcionamiento: "3_",
        epilogo: "4_"
    }, t = '<table id="datatable_down" class="display" cellspacing="0" width="100%">', t += "<thead><tr>", t += "<th>download</th> <th>lab</th> <th>id</th> <th>page</th> <th>subchapter</th> <th>table name</th> <th>title</th> ", t += "</tr></thead>", t += "<tbody>";
    for (d in dp) desc = i18next.t(chapters_dict[dp[d].chapter] + dp[d].name), xls = chapters_dict[dp[d].chapter] + dp[d].name + ".xls", dp[d].name != "" && (t += "<tr>", t += '<td><a class="down" href="data/tables_xls/' + xls.toLowerCase() + '"><i class="fa fa-file-excel-o" aria-hidden="true"></i></a></td> <td class="rawlab" value="' + xls + '"><i class="fa fa-bar-chart" aria-hidden="true"></i></td>', t += "<td>" + d + "</td> <td>" + dp[d].page_book + "</td> <td>" + dp[d].sc.split("_")[1] + "</td> <td><b>" + dp[d].name + "</b></td> <td>" + desc + "</td> ", t += "</tr>");
    t += "</tbody>", t += "</table>", $("#downloads").append(t), $("#datatable_down").DataTable({
        bFilter: !1,
        bPaginate: !1,
        bLengthChange: !1,
        bInfo: !1,
        bAutoWidth: !0,
        scrollY: $("#downloads").height() - 60,
        pageLength: 10,
        paging: !1,
        responsive: {
            details: !0
        },
        columns: [null, null, null, null, null, null, {
            width: "100%"
        }]
    }), $(".rawlab").click(function() {
        xls2 = $(this).attr("value"), openRaw(xls2)
    }), $("#raw_close").click(function() {
        closeRaw()
    })
}

function openRaw(t) {
    $("#raw_window").html(""), $("#raw_window").html('<object data="/raw/#tables_xls/' + t.toLowerCase() + '">'), $("#raw_popup").show(), $("#frame").show(), $.fn.fullpage.setMouseWheelScrolling(!1), $.fn.fullpage.setAllowScrolling(!1), $.fn.fullpage.setKeyboardScrolling(!1)
}

function closeRaw() {
    $("#raw_window").html(""), $("#raw_popup").hide(), $("#frame").hide(), $(".popup").css("display") != "block" && ($.fn.fullpage.setMouseWheelScrolling(!0), $.fn.fullpage.setAllowScrolling(!0), $.fn.fullpage.setKeyboardScrolling(!0))
}

function showcsv(e) {
    $("#chart_agg_ctrl").append('<p id="but_raw"><i class="fa fa-bar-chart" aria-hidden="true"></i> edit chart</p>'), $("#but_raw").click(function() {
        chapters = {
            continente: "1_",
            contenido: "2_",
            funcionamiento: "3_",
            epilogo: "4_"
        }, table = $("p.table").html(), chap = $(".grid-item.active .chapter").html(), chapter = chapters[chap], openRaw(chapter + table + ".xls")
    }), $("#chart_agg_ctrl").append('<p id="but_csv"><i class="fa fa-table" aria-hidden="true"></i> view chart</p>'), $("#but_csv").click(function() {
        s = $(".but_agg.active").attr("value"), s == void 0 && (k = Object.keys(e), s = k[0]), $("#chart").append('<div id="tableviewer"><div class="tableviewercenter"><div id="closetable"><i class="fa fa-times" aria-hidden="true"></i></div><div class="datatable"></div></div></div>'), $(".datatable").width($(window).width() - 100), kk = e[s][0], t = '<table id="datatable" class="display" cellspacing="0" width="100%">', t += "<thead><tr>";
        for (d in kk) t += "<th>" + tostr(_tr(kk[d])) + "</th>";
        t += "</tr></thead>", t += "<tfoot><tr>";
        for (d in kk) t += "<th>" + tostr(_tr(kk[d])) + "</th>";
        for (t += "</tr></tfoot>", t += "<tbody>", dd = 1; e[s].length > dd; dd++) {
            t += "<tr>";
            for (d in kk) t += "<td>" + _tr(e[s][dd][d]) + "</td>";
            t += "</tr>"
        }
        t += "</tbody>", t += "</table>", $(".datatable").html(t), $("#datatable").DataTable({
            bFilter: !1,
            dom: "Bfrtip",
            scrollY: "50vh",
            scrollCollapse: !0,
            paging: !1,
            responsive: {
                details: !0
            },
            buttons: [{
                extend: "csv",
                text: 'csv <i class="fa fa-download" aria-hidden="true"></i>'
            }, {
                extend: "excel",
                text: 'xls <i class="fa fa-download" aria-hidden="true"></i>'
            }]
        }), $("#closetable").click(function() {
            $("#tableviewer").remove()
        })
    })
}

function loadPict(t) {
    var e, a, i;
    e = {
        continente: "1_",
        contenido: "2_",
        funcionamiento: "3_",
        epilogo: "4_"
    }, a = $(".name", t).text(), i = $(".chapter", t).text(), $(".type-chart", t).text(), $(".layout", t).text(), $(".data", t).text(), $(".chart-subtype", t).text(), $("#chart_chart").css("height", chartHeight()), url = (svgPath + e[i] + a + ".svg").toLowerCase(), $("#chart_chart").html('<div class="pict"><img src="' + url + '"></div>'), url2 = (urlPath + e[i] + a + ".json").toLowerCase(), $.getJSON(url2, function(t) {
        showcsv(t)
    })
}

function loadtext(t) {
    var e, a, i;
    e = {
        continente: "1_",
        contenido: "2_",
        funcionamiento: "3_",
        epilogo: "4_"
    }, a = $(".name", t).text(), i = $(".chapter", t).text(), $(".type-chart", t).text(), $(".layout", t).text(), $(".data", t).text(), $(".chart-subtype", t).text(), url = (urlPath + e[i] + a + ".json").toLowerCase(), $.getJSON(url, function(t) {
        for (k = Object.keys(t), $("#chart_chart").css("height", chartHeight()), $("#chart_chart").html(""), html = "", html += '<div class="datatext">', kk = 1; t[k[0]].length > kk; kk++) html += _tr(t[k[0]][kk][0]) + "<br><strong>" + t[k[0]][kk][1] + "</strong><br>";
        html += "</div>", $("#chart_chart").append(html), $("#chart_chart").css("display", "flex"), $("#chart_chart").css("justify-content", "center"), $("#chart_chart").css("align-items", "center"), $("#chart_chart").addClass("chart_value"), showcsv(t), cleaniface()
    })
}

function addTopoData(t) {
    $("#chart_chart").css("height", chartHeight()), $("#chart_chart").html(""), baseLayer = L.tileLayer("tileserver/basemap/{z}/{x}/{y}.png"), bounds = [
        [41.40185748724254, 2.2115993499755864],
        [41.36218686975544, 2.1429347991943364]
    ], window.map = L.map("chart_chart", {
        layers: [baseLayer],
        maxZoom: 17,
        minZoom: 14,
        scrollWheelZoom: !0,
        maxBounds: bounds
    }), map.setView([41.38272, 2.17836], 15), topoLayer = new L.TopoJSON, topoLayer.addData(t), topoLayer.setStyle(styleEasy), topoLayer.addTo(map)
}

function getColor(t) {
    return t > 1e3 ? "#800026" : t > 500 ? "#BD0026" : t > 200 ? "#E31A1C" : t > 100 ? "#FC4E2A" : t > 50 ? "#FD8D3C" : t > 20 ? "#FEB24C" : t > 10 ? "#FED976" : "#FFEDA0"
}

function styleEasy() {
    return {
        fillColor: "rgba(64,64,64,0)",
        weight: .1,
        opacity: 1,
        color: "white",
        fillOpacity: 1
    }
}

function style(t, e, a, s, o, l, n, c) {
    return scale = chroma.scale(["rgba(255,80,80,0.5)", "rgba(255,10,10,0.8)", "rgba(0,0,0,1)"]).domain([0, 100]), nodatacolor = "rgb(206, 206, 206)", errorcolor = "rgb(173, 173, 173)", distri = t.properties.c_distri, barri = t.properties.c_barri, masa = t.properties.c_manzana, c == "d" ? sql = "SELECT [" + s + "]  FROM ? where [" + a[0] + "] = " + tosql(distri) : c == "b" ? sql = "SELECT [" + s + "]  FROM ? where [" + a[0] + "] = " + tosql(distri) + " AND [" + a[1] + "] = " + tosql(barri) : c == "m" && (sql = "SELECT [" + s + "]  FROM ? where [" + a[0] + "] = " + tosql(distri) + " AND [" + a[1] + "] = " + tosql(barri) + " AND [" + a[2] + "] = " + tosql(masa)), r = alasql(sql, [e]), r.length > 0 && r[0][s] != void 0 ? (i = r[0][s], ii = n.getClass(i), col = scale(ii / n.bounds.length * 100).rgba(), col = "rgba(" + col.join(",") + ")", {
        fillColor: col,
        weight: .5,
        opacity: 1,
        color: "rgb(64,64,64)",
        fillOpacity: 1
    }) : r.length > 0 && r[0][s] == void 0 ? {
        fillColor: errorcolor,
        weight: .5,
        opacity: 1,
        color: errorcolor,
        fillOpacity: 1
    } : {
        fillColor: "rgba(0,0,0,0)",
        weight: .5,
        opacity: 1,
        color: nodatacolor,
        fillOpacity: 1
    }
}

function onMapClick(t, e, a, i, s) {
    distri = t.target.feature.properties.c_distri, barri = t.target.feature.properties.c_barri, masa = tosql(t.target.feature.properties.c_manzana), s == "d" ? sql = "SELECT [" + a + "]  FROM ? where [" + e[0] + "] = " + tosql(distri) : s == "b" ? sql = "SELECT [" + a + "]  FROM ? where [" + e[0] + "] = " + tosql(distri) + " AND [" + e[1] + "] = " + tosql(barri) : s == "m" && (sql = "SELECT [" + a + "]  FROM ? where [" + e[0] + "] = " + tosql(distri) + " AND [" + e[1] + "] = " + tosql(barri) + " AND [" + e[2] + "] = " + tosql(masa)), r = alasql(sql, [i]), r.length > 0 && r[0][a] != void 0 && (r_d = r[0][a], popup.setLatLng(t.latlng).setContent(_tr(i[0][a]) + " : " + r_d).openOn(map))
}

function getStats(t, e) {
    serie = [], t = t.slice(1);
    for (d in t) t[d][e] != null && serie.push(t[d][e]);
    return sn = 10 > serie.length ? serie.length : 10, gserie = new geostats(serie), gserie.getClassJenks(sn - 1), min = Math.min.apply(null, serie), max = Math.max.apply(null, serie), {
        min: min,
        max: max,
        "class": gserie
    }
}

function toObj(t) {
    for (csv = [], r = 1; t.length > r; r++) {
        row = {};
        for (h in t[0]) row[String(h)] = t[r][h];
        csv.push(row)
    }
    return csv
}

function isVoidSerie(t, e) {
    var a = [];
    if (t == void 0) return !1;
    for (i = 1; t.length > i; i++) a.push(t[i][e]);
    return s = Array.from(new Set(a)), s.length == 1 && s[0] == null ? !0 : s.length == 0 ? !0 : !1
}

function filterMap(t, e) {
    var a = t[e];
    d_c = 0, b_c = 1, m_c = 2, agregacion = "", agregacion = isVoidSerie(a, 2) ? isVoidSerie(a, 1) ? "d" : "b" : "m", $("#chart_sub_agg").html(""), $("#chart_sub_agg").append('<p class="chart_sub_agg_tit">' + _tr("dimensiones") + "</p>");
    for (k in a[0]) k != m_c && k != d_c && k != b_c && isVoidSerie(a, k) == 0 && $("#chart_sub_agg").append('<p class="but_sub_agg" value="' + k + '"><i class="fa fa-circle-o" aria-hidden="true"></i><i class="fa fa-circle" aria-hidden="true"></i> ' + _tr(a[0][k]) + "</p>");
    $(".but_sub_agg").click(function() {
        $(".but_sub_agg").each(function() {
            $(this).removeClass("active")
        }), $(this).addClass("active"), window.fieldGeom = [d_c, b_c, m_c], window.fieldData = $(this).attr("value"), stats = getStats(a, fieldData), dsob = toObj(a), topoLayer.setStyle(function(t) {
            return style(t, dsob, fieldGeom, fieldData, stats.min, stats.max, stats["class"], agregacion)
        }), window.popup = L.popup(), topoLayer.eachLayer(function(t) {
            t.on("mouseover", function(t) {
                onMapClick(t, fieldGeom, fieldData, a, agregacion)
            })
        })
    }), $(".but_sub_agg").first().trigger("click")
}

function tosql(t) {
    return isNaN(Number(t)) ? "'" + t + "'" : t
}

function loadmapchoro(t) {
    chapters = {
        continente: "1_",
        contenido: "2_",
        funcionamiento: "3_",
        epilogo: "4_"
    }, name = $(".name", t).text(), desc = $(".description", t).text(), chap = $(".chapter", t).text(), url = (urlPath + chapters[chap] + name + ".json").toLowerCase(), new L.TopoJSON, $.getJSON("geom/cerda_4326_6.geojson").done(function(e) {
        $.getJSON(url, function(a) {
            addTopoData(e), keys = Object.keys(a), type_chart = $(".type-chart", t).text(), $("#chart_agg").append('<p class="chart_agg_tit">' + _tr("agregaciones") + "</p>");
            for (k in keys) $("#chart_agg").append('<p class="but_agg" value="' + keys[k] + '"><i class="fa fa-circle-o" aria-hidden="true"></i><i class="fa fa-circle" aria-hidden="true"></i> ' + _tr(keys[k]) + "</p>");
            $(".but_agg").click(function() {
                $(".but_agg").each(function() {
                    $(this).removeClass("active")
                }), $(this).addClass("active"), filterMap(a, $(this).attr("value"), 0)
            }), $(".but_agg").first().trigger("click"), cleaniface(), showcsv(a)
        })
    })
}

function goright() {
    $(".grid-item.active").next()[0] != void 0 && (Plotly.purge("chart_chart"), window.map && (console.log(window.map), window.map.remove(), window.map = void 0), loadviz($(".grid-item.active").next()))
}

function goleft() {
    $(".grid-item.active").prev()[0] != void 0 && (Plotly.purge("chart_chart"), window.map && (console.log(window.map), window.map.remove(), window.map = void 0), loadviz($(".grid-item.active").prev()))
}

function loadviz(t) {
    for (idd = $(t).find(".grid-content").attr("value"), $(".grid-item").each(function() {
            $(this).removeClass("active")
        }), $(t).addClass("active"), chapters_dict = {
            continente: "1_",
            contenido: "2_",
            funcionamiento: "3_",
            epilogo: "4_"
        }, cookieMark(chapters_dict[$(".chapter", t).text()] + $(".name", t).text()), dataParser[idd].t == "sc" || dataParser[idd].t == "c", chap = _tr($(".chapter", t).text()), schap = _tr($(".schapter", t).text()), table = $(".name", t).text(), desc = dataParser[idd].t == "v" ? i18next.t(chapters_dict[$(".chapter", t).text()] + $(".name", t).text()) : "", $.fn.fullpage.setMouseWheelScrolling(!1), $.fn.fullpage.setAllowScrolling(!1), $.fn.fullpage.setKeyboardScrolling(!1), $(".popup").fadeIn(), $("#frame").fadeIn(), html = '<div id="chart" class="chart">', html += '<div class="close"><i class="fa fa-times" aria-hidden="true"></i></div>', html += '<div id="chart_title">', html += '<p class="chapter">' + chap + '</p><p class="schapter">' + schap + '</p><p class="table">' + table + '</p><p class="table_desc">' + desc + "</p>", html += "</div>", html += '<div id="chart_but"></div>', html += '<div id="chart_tooltip"></div>', html += '<div id="chart_chart">' + spincss + "</div>", html += '<p id="chart_sub_agg"></p><div id="chart_agg"></div>', html += '<div id="chart_agg_ctrl"></div>', html += '<div id="chart_scan"></div>', html += '<div id="chart_left"><i class="fa fa-angle-left" aria-hidden="true"></i></div>', html += '<div id="chart_right"><i class="fa fa-angle-right" aria-hidden="true"></i></div>', html += '<div id="chart_notes"></div> ', html += '<div class="carousel"></div>', html += '<div class="topdots"></div> ', html += "</div>", $(".popup").html(html), $("#chart_chart").css("height", chartHeight()), $("#chart_right").click(function() {
            goright()
        }), $("#chart_left").click(function() {
            goleft()
        }), document.onkeydown = function(t) {
            if ($(".popup").is(":visible")) switch (t.keyCode) {
                case 27:
                    closeViz(this);
                    break;
                case 37:
                    goleft();
                    break;
                case 39:
                    goright()
            }
        }, $("#chart").slimScroll({
            height: $(window).height(),
            width: "100%"
        }), $(".close").click(function() {
            closeViz(this)
        }), tc = $(".type-chart", t).text(), tc == "-" ? loadPict(t) : tc == "txt" ? loadtext(t) : tc == "Choropleth" ? loadmapchoro(t) : tc == "" || loadChart(t), dataParser[idd].t == "v" ? (idd = $(t).find(".grid-content").attr("value"), $("#chart_notes").append('<div class="micro_tit">' + _tr("notas") + "</div>"), $("#chart_notes").append(i18next.t("n_" + dataParser[idd].notes))) : (idd = $(t).find(".grid-content").attr("value"), $("#chart_chart").html("<p>" + i18next.t("n_" + dataParser[idd].notes) + "</p><p></p>"), $("#chart_chart").css("min-height", chartHeight() - 50), $("#chart_chart").addClass("note"), $("#chart_notes").remove(), $("#chart_scan").remove(), $("#chart_agg").remove(), $("#chart_agg_ctrl").remove(), $("#chart_sub_agg").remove(), $(".carousel").remove()), pages = $(".page-pdf", t).text(), page1 = parseInt(pages.split("-")[0]), page2 = parseInt(pages.split("-").slice(-1)[0]), $('<div class="chart-block"><div class="micro_tit_carousel">' + _tr("tabla_o") + "</div></div>").insertBefore(".carousel"), i = page1; page2 >= i; i++) x = pad(i, 3), $(".carousel").append('<div><img data-lazy="book/t2_PÃ¡gina_' + x + ' copy.png" class="zoom" src="book/t2_PÃ¡gina_' + x + ' copy.png" /></div>');
    $(".carousel").slick({
        lazyLoad: "ondemand",
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: !1,
        fade: !1,
        dots: !0,
        appendDots: ".topdots",
        infinite: !1
    }), $(".carousel").height($(window).height() - 127), $(".carousel .slick-slide img").css("max-height", $(window).height() - 60 - $(".topdots").height()), $(".carousel .slick-slide img").css("max-width", "100%"), $(".carousel .slick-slide").zoom({
        magnify: .8,
        on: "click"
    }), $(window).trigger("resize")
}

function pad(t, e) {
    var a = t + "";
    while (e > a.length) a = "0" + a;
    return a
}

function closeViz() {
    $(".popup").fadeOut(), $("#frame").fadeOut(), Plotly.purge("chart_chart"), $.fn.fullpage.setMouseWheelScrolling(!0), $.fn.fullpage.setAllowScrolling(!0), $.fn.fullpage.setKeyboardScrolling(!0), $(".grid-item").each(function() {})
}

function getDataParser() {
    Papa.parse("data/data.csv", {
        download: !0,
        header: !0,
        complete: function(t) {
            window.dataParser = t.data, $(document).trigger("readcsv")
        }
    })
}

function createTiles() {
    sc = "", sc_i = "even";
    for (t in dataParser)
        if (sc == dataParser[t].sc || (sc = dataParser[t].sc, sc_i = sc_i == "even" ? "odd" : "even"), dataParser[t].chapter != "" && (dataParser[t].t == "c" || dataParser[t].t == "v" || dataParser[t].t == "sc")) {
            var e;
            dataParser[t].t == "c" ? (e = "chap", item = "", item += '<div class="grid-item ' + e + '">', item += '<div class="grid-content" value="' + t + '">', item += '<h3 class="name">' + dataParser[t].description + "</h3>", item += '<p class="chapter">' + dataParser[t].chapter + "</p>", item += '<p class="type-chart"></p>', item += '<p class="description">' + dataParser[t].description + "</p>", item += "</div>", item += "</div>") : dataParser[t].t == "v" ? (e = dataParser[t].chapter, size = dataParser[t].size, item = "", item += '<div class="grid-item chart-' + size + " " + e + '" value="grid-' + size + '" >', item += '<div class="grid-content ' + sc_i + '"  id="' + dataParser[t].chapter + "_" + dataParser[t].name + '"  value="' + t + '">', item += '<h3 class="name">' + dataParser[t].name + "</h3>", item += '<p class="chapter">' + dataParser[t].chapter + "</p>", item += '<p class="schapter">' + dataParser[t].sc + "</p>", item += '<p class="page">pag.' + dataParser[t].page_book + "</p>", item += '<p class="page-pdf">' + dataParser[t].page_pdf + "</p>", item += '<p class="type-chart">' + dataParser[t].chart_type + "</p>", item += '<p class="chart-subtype">' + dataParser[t].chart_subtype + "</p>", item += '<p class="layout">' + dataParser[t].layout + "</p>", item += '<p class="data">' + dataParser[t].data + "</p>", item += '<p class="description">' + dataParser[t].description + "</p>", item += "</div>", item += "</div>") : dataParser[t].t == "sc" && (e = "schap", size = dataParser[t].size, item = "", item += '<div class="grid-item chart-' + size + " " + e + '" value="grid-' + size + '" >', item += '<div class="grid-content ' + sc_i + '"  id="' + dataParser[t].chapter + "_" + dataParser[t].name + '"  value="' + t + '">', item += '<p class="chapter">' + dataParser[t].chapter + "</p>", item += '<p class="schapter">' + dataParser[t].sc + "</p>", item += '<p class="data">' + dataParser[t].data + "</p>", item += "</div>", item += "</div>"), $(".grid").append(item)
        }
    cookieParse()
}

function isotopeRefresh(t, e) {
    scales = {
        "grid-xs": [1, .5],
        "grid-s": [1, 1],
        "grid-m": [1, 2],
        "grid-l": [2, 2],
        "grid-xl": [2, 3],
        "grid-xxl": [2, 3]
    }, h = Math.sqrt((Math.max($(window).width() * $(window).height()) - 50) / (280 - t)), $(".grid-item").each(function() {
        sz = $(this).attr("value"), sz != void 0 ? ($(this).css("height", parseInt(h * scales[sz][0] + scales[sz][0])), $(this).css("width", h * scales[sz][1]), $(".grid-content", this).css("height", parseInt(h * scales[sz][0]) - 5)) : ($(this).css("height", parseInt(h)), $(this).css("width", parseInt(h)), $(".grid-content", this).css("height", parseInt(h) - 5))
    }), $(".grid-item.chap").css("width", h * 3), $(".grid").css("width", parseInt(($(window).width() - 50) / h) * h), $(".grid").isotope("layout"), container = $(".container.contents").height(), ss = $(".title").height() + $(".grid-desc").height() + $(".grid-desc2").height() + $(".grid").height(), 0 > container - ss - 20 && 200 > t && 5 > e && isotopeRefresh(-t - 20, e + 1)
}

function builButtons() {
    $(".grid-item").click(function() {
        loadviz(this), $(".type-chart", this).text() != ""
    }), $(".grid-item").hover(function() {
        text = $(".description", this).text(), subchapter = _tr($(".schapter", this).text()), subchapter != 0 && ($(".grid-desc").html(subchapter), $(".grid-desc2").html(text)), $(this).on("mouseleave", function() {
            $(".grid-desc").html(""), $(".grid-desc2").html("")
        })
    })
}

function buildFilters() {
    $(".but1").click(function() {
        v = $(this).attr("value"), v == "*" ? grid.isotope({
            filter: v,
            layoutMode: "masonry",
            masonry: {
                columnWidth: ".grid-item.chart-s"
            }
        }) : grid.isotope({
            filter: "." + v,
            layoutMode: "masonry",
            masonry: {
                columnWidth: ".grid-item.chart-s"
            }
        })
    }), $(".contents").click(function(t) {
        $(t.toElement).hasClass("contents") == 1 && grid.isotope({
            filter: "*"
        })
    })
}

function spinner3d() {
    var t, e;
    t = {
        lines: 2,
        length: 0,
        width: 10,
        radius: 10,
        scale: 1,
        corners: 4,
        color: "rgb(255,250,250)",
        opacity: 0,
        rotate: 0,
        direction: 1,
        speed: 1.2,
        trail: 54,
        fps: 20,
        zIndex: 9e4,
        className: "spinner",
        top: "49%",
        left: "50%",
        shadow: !1,
        hwaccel: !1,
        position: "absolute"
    }, e = document.getElementById("td_telon"), $spinner = new Spinner(t).spin(e)
}

function spinner3doff() {
    $spinner.stop(), $("#td_telon").fadeOut()
}

function full() {
    $("body").find(".section"), $("#fullpage").fullpage({
        lockAnchors: !0,
        anchors: ["firstPage", "secondPage", "3rdP", "4thP", "5thP", "6thP", "7thP", "8thP", "9thP", "10thP", "11thP", "12thP", "13thP", "14thP", "15thP"],
        navigationPosition: "right",
        showActiveTooltip: !0,
        slidesNavPosition: "bottom",
        css3: !0,
        scrollingSpeed: 700,
        autoScrolling: !0,
        fitToSection: !0,
        fitToSectionDelay: 1e3,
        scrollBar: !1,
        easing: "easeInOutCubic",
        easingcss3: "ease",
        loopBottom: !1,
        loopTop: !1,
        loopHorizontal: !0,
        continuousVertical: !1,
        normalScrollElements: "#mapa",
        scrollOverflow: !1,
        touchSensitivity: 150,
        normalScrollElementTouchThreshold: 5,
        keyboardScrolling: !0,
        animateAnchor: !0,
        recordHistory: !0,
        controlArrows: !0,
        verticalCentered: !1,
        resize: !0,
        paddingTop: menuBorder,
        fixedElements: "#header",
        responsiveWidth: 0,
        responsiveHeight: 0,
        parallax: !1,
        sectionSelector: ".section",
        slideSelector: ".slide",
        onLeave: function() {},
        afterLoad: function(t, e) {
            $(".menu-item li").removeClass("active"), $($(".menu-item li")[e - 1]).addClass("active"), e == 4 && webgl ? $("#d3v").html() == "" && ($("#d3v").html('<object data="3d/index.html">'), $("#d3v").css("width", "100%"), $("#d3v").css("height", "100%")) : e == 4 && webgl ? $("#d3v").html("You need to use Chrome to see this interactive") : e == 4 ? $("#d3v").html("your computer don't suport wbgl apps") : $("#d3v").html("")
        },
        afterRender: function() {},
        afterResize: function() {},
        afterSlideLoad: function() {},
        onSlideLeave: function() {}
    })
}

function launchVideo() {
    var t, e;
    html = '<video id="videoplayer"><source src="http://innovation.300000kms.net/video/innovation.mp4" type="video/mp4"> </video>', $("#video").html(html), t = Popcorn("#videoplayer"), t.play(), e = document.getElementById("videoplayer"), e.addEventListener("ended", function() {
        $.fn.fullpage.moveTo(3, 0)
    }, !1)
}

function slidetext(t) {
    $("#prologue").html(""), h = $(".title").height() + 200, h = $("#prologue").parent().height() - h, t = t.replace("\n", " \n "), text = t.split(" "), content = "", div = 0;
    while (text.length != 0) {
        d = "d" + div, $("#prologue").append('<div class="' + d + '"></div>');
        while (h > $("." + d).height() && text.length != 0) word = text.shift(), content = content + " " + word, $("." + d).html(content);
        text.length != 0 && (content = content.split(" "), content.pop(), content = content.join(" "), $("." + d).html(content), text.unshift(word)), content = "", div += 1
    }
    $("#prologue").slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: !0,
        fade: !1,
        dots: !0,
        infinite: !1
    })
}

function prologue() {
    lng = i18next.language, d = "", $("#prologue").html(""), lng == "es-ES" || lng == "es" ? $.get("lng/prologue_es.txt", function(t) {
        d = t, slidetext(t)
    }) : lng == "en" ? $.get("lng/prologue_en.txt", function(t) {
        d = t, slidetext(t)
    }) : $.get("lng/prologue_en.txt", function(t) {
        d = t, slidetext(t)
    })
}

function menu() {
    $("#menu li").click(function() {
        $("#menu li").removeClass("active"), $(this).addClass("active"), i = $("#menu li").index($(this)), $.fn.fullpage.moveTo(i + 1)
    })
}

function telon(t) {
    t == 1 ? $("#telon").fadeIn() : $("#telon").fadeOut()
}
urlPath = "data/tables_json/", svgPath = "data/img/", menuBorder = 30, webgl = !1, spincss = '<div class="sk-fading-circle"><div class="sk-circle1 sk-circle"></div><div class="sk-circle2 sk-circle"></div><div class="sk-circle3 sk-circle"></div><div class="sk-circle4 sk-circle"></div><div class="sk-circle5 sk-circle"></div><div class="sk-circle6 sk-circle"></div><div class="sk-circle7 sk-circle"></div><div class="sk-circle8 sk-circle"></div><div class="sk-circle9 sk-circle"></div><div class="sk-circle10 sk-circle"></div><div class="sk-circle11 sk-circle"></div><div class="sk-circle12 sk-circle"></div></div>', Modernizr.webgl && (webgl = !0), L.TopoJSON = L.GeoJSON.extend({
    addData: function(t) {
        if (t.type === "Topology")
            for (key in t.objects) geojson = topojson.feature(t, t.objects[key]), L.GeoJSON.prototype.addData.call(this, geojson);
        else L.GeoJSON.prototype.addData.call(this, t)
    }
}), colorscale = ["rgba(0,0,0,0.9)", "rgba(255,10,10,0.9)", "rgba(70,70,70,0.5)", "rgba(255,80,80,0.4)"], $(document).bind("readcsv", function() {
    createTiles(), builButtons(), window.grid = $(".grid").isotope({
        itemSelector: ".grid-item",
        layoutMode: "masonry",
        masonry: {
            columnWidth: ".grid-item.chart-s"
        }
    }), chartTable(), $(window).trigger("resize"), isotopeRefresh(0, 0), buildFilters()
}), $(window).on("resize", function() {
    $(".container").height($(window).height() - 50 - menuBorder), typeof grid != "undefined" && isotopeRefresh(0, 0), $(".dataTables_scrollBody").height($("#downloads").height() - 60), $(".carousel").height($(window).height() - 127), gh = $(".grid").height(), gv = $(".grid").width(), ga = Math.min(gh * gv / 4e4, 14), $(".grid-item .name").css("font-size", ga + "px"), $("#credits").slimScroll({
        height: $(".container").height(),
        width: "100%"
    }), $("#getthebook").slimScroll({
        height: $(".container").height(),
        width: "100%"
    })
}), status = 0, $(document).ready(function() {
    full(), textos(), $(document).bind("i18next", function() {
        menu(), getDataParser(), prologue(), $(window).trigger("resize");
        var t = !1 || !!document.documentMode;
        t == 0 ? telon(!1) : $("#telon").html("<p>este website no es compatible con el navegador Internet Explorer<br>this website is not compatible with Internet Explorer browser</p>")
    }), typeof console == "undefined" || typeof console.log != "function" || window.test || console.log("%c______ ______ ______ ______ ______ ______ __                                   __   \n|__    |      |      |      |      |      |  |--.--------.-----.  .-----.-----.|  |_ \n|__    |  --  |  --  |  --  |  --  |  --  |    <|        |__ --|__|     |  -__||   _|\n|______|______|______|______|______|______|__|__|__|__|__|_____|__|__|__|_____||____|\n                                                                                     \n/////////////////////////////////////////////////////////////////////////////////////\nif you like maps perhaps you want to see http://cartahistorica.muhba.cat \nor this other http://bigtimebcn.300000kms.net \nor this other http://innovation.300000kms.net/ \nor you want to take a beer with us? info@300000kms.net \n/////////////////////////////////////////////////////////////////////////////////////\n", "color:#00aad1")
});