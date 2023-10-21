(window.kakao = window.kakao || {}),
  (window.kakao.maps = window.kakao.maps || {}),
  window.daum && window.daum.maps
    ? (window.kakao.maps = window.daum.maps)
    : ((window.daum = window.daum || {}),
      (window.daum.maps = window.kakao.maps)),
  (function () {
    function a() {
      if (o.length) {
        n(s[o.shift()], a).start();
      } else e();
    }
    function n(a, n) {
      var e = document.createElement("script");
      return (
        (e.onload = n),
        (e.onreadystatechange = function () {
          /loaded|complete/.test(this.readyState) && n();
        }),
        {
          start: function () {
            (e.src = a || ""),
              document.getElementsByTagName("head")[0].appendChild(e),
              (e = null);
          },
        }
      );
    }
    function e() {
      for (; i[0]; ) i.shift()();
      t.readyState = 2;
    }
    var t = (kakao.maps = kakao.maps || {});
    if (void 0 === t.readyState) (t.onloadcallbacks = []), (t.readyState = 0);
    else if (2 === t.readyState) return;
    (t.URI_FUNC = {
      ROADMAP: function (a, n, e) {
        return (
          "map.daumcdn.net/map_k3f_prod/bakery/image_map_png/PNGSD01/v16_260kk/" +
          e +
          "/" +
          n +
          "/" +
          a +
          ".png"
        );
      },
      HYBRID: function (a, n, e) {
        return (
          "map.daumcdn.net/map_k3f_prod/bakery/image_map_png/PNGSD_SKYH01/v15_u50gu/" +
          e +
          "/" +
          n +
          "/" +
          a +
          ".png"
        );
      },
      ROADVIEW: function (a, n, e) {
        return (
          "map.daumcdn.net/map_k3f_prod/bakery/image_map_png/PNGSD_RV01/v08_faetr/" +
          e +
          "/" +
          n +
          "/" +
          a +
          ".png"
        );
      },
      BICYCLE: function (a, n, e) {
        return (
          "map.daumcdn.net/map_k3f_prod/bakery/image_map_png/PNGSD_BIKE01/v06_aroce/" +
          e +
          "/" +
          n +
          "/" +
          a +
          ".png"
        );
      },
      USE_DISTRICT: function (a, n, e) {
        return (
          "map.daumcdn.net/map_k3f_prod/bakery/image_map_png/PNGSD_CAD01/v08_aay0m/" +
          e +
          "/" +
          n +
          "/" +
          a +
          ".png"
        );
      },
      SR: function (a, n, e) {
        return (
          "map.daumcdn.net/map_k3f_prod/bakery/image_map_png/PNGSD_SR01/v21_xe5y9/" +
          e +
          "/" +
          n +
          "/" +
          a +
          ".png"
        );
      },
      BBOUND: function (a, n, e) {
        return (
          "map.daumcdn.net/map_k3f_prod/bakery/image_map_png/PNGSD_BBOUND01/v05_moskd/" +
          e +
          "/" +
          n +
          "/" +
          a +
          ".png"
        );
      },
      HBOUND: function (a, n, e) {
        return (
          "map.daumcdn.net/map_k3f_prod/bakery/image_map_png/PNGSD_HBOUND01/v05_1knbb/" +
          e +
          "/" +
          n +
          "/" +
          a +
          ".png"
        );
      },
      TRAFFIC: function (a, n, e) {
        return (
          "r.maps.daum-img.net/mapserver/file/realtimeroad/L" +
          e +
          "/" +
          n +
          "/" +
          a +
          ".png"
        );
      },
      ROADMAP_HD: function (a, n, e) {
        return (
          "map.daumcdn.net/map_k3f_prod/bakery/image_map_png/PNG01/v22_galhg/" +
          e +
          "/" +
          n +
          "/" +
          a +
          ".png"
        );
      },
      HYBRID_HD: function (a, n, e) {
        return (
          "map.daumcdn.net/map_k3f_prod/bakery/image_map_png/PNG_SKYH01/v14_jvqgx/" +
          e +
          "/" +
          n +
          "/" +
          a +
          ".png"
        );
      },
      ROADVIEW_HD: function (a, n, e) {
        return (
          "map.daumcdn.net/map_k3f_prod/bakery/image_map_png/PNG_RV01/v08_4blvx/" +
          e +
          "/" +
          n +
          "/" +
          a +
          ".png"
        );
      },
      BICYCLE_HD: function (a, n, e) {
        return (
          "map.daumcdn.net/map_k3f_prod/bakery/image_map_png/PNG_BIKE01/v06_xfzbg/" +
          e +
          "/" +
          n +
          "/" +
          a +
          ".png"
        );
      },
      USE_DISTRICT_HD: function (a, n, e) {
        return (
          "map.daumcdn.net/map_k3f_prod/bakery/image_map_png/PNG_CAD01/v11_vvqth/" +
          e +
          "/" +
          n +
          "/" +
          a +
          ".png"
        );
      },
      SR_HD: function (a, n, e) {
        return (
          "map.daumcdn.net/map_k3f_prod/bakery/image_map_png/PNGSD_SR01/v21_xe5y9/" +
          e +
          "/" +
          n +
          "/" +
          a +
          ".png"
        );
      },
      BBOUND_HD: function (a, n, e) {
        return (
          "map.daumcdn.net/map_k3f_prod/bakery/image_map_png/PNG_BBOUND01/v05_jfv03/" +
          e +
          "/" +
          n +
          "/" +
          a +
          ".png"
        );
      },
      HBOUND_HD: function (a, n, e) {
        return (
          "map.daumcdn.net/map_k3f_prod/bakery/image_map_png/PNG_HBOUND01/v05_ams0y/" +
          e +
          "/" +
          n +
          "/" +
          a +
          ".png"
        );
      },
      TRAFFIC_HD: function (a, n, e) {
        return (
          "r.maps.daum-img.net/mapserver/file/realtimeroad_hd/L" +
          e +
          "/" +
          n +
          "/" +
          a +
          ".png"
        );
      },
    }),
      (t.VERSION = {
        ROADMAP_SUFFIX: "",
        SKYVIEW_VERSION: "160114",
        SKYVIEW_HD_VERSION: "160107",
      }),
      (t.RESOURCE_PATH = {
        ROADVIEW_AJAX:
          "//t1.daumcdn.net/roadviewjscore/core/css3d/200204/standard/1580795088957/roadview.js",
        ROADVIEW_CSS:
          "//t1.daumcdn.net/roadviewjscore/core/openapi/standard/230727/roadview.js",
      });
    for (
      var r,
        p = "https:" == location.protocol ? "https:" : "http:",
        m = "",
        d = document.getElementsByTagName("script"),
        _ = d.length;
      (r = d[--_]);

    )
      if (
        /\/(beta-)?dapi\.kakao\.com\/v2\/maps\/sdk\.js\b/.test(r.src) ||
        /\/map_js_init\/open4\.test\.js\b/.test(r.src) ||
        /\/map_js_init\/open4\.cbt\.js\b/.test(r.src)
      ) {
        m = r.src;
        break;
      }
    d = null;
    var i = t.onloadcallbacks,
      o = ["v3"],
      c = "",
      s = {
        v3: p + "//t1.daumcdn.net/mapjsapi/js/main/4.4.14/kakao.js",
        services:
          p + "//t1.daumcdn.net/mapjsapi/js/libs/services/1.0.2/services.js",
        drawing:
          p + "//t1.daumcdn.net/mapjsapi/js/libs/drawing/1.2.6/drawing.js",
        clusterer:
          p + "//t1.daumcdn.net/mapjsapi/js/libs/clusterer/1.0.9/clusterer.js",
      },
      u = (function (a) {
        var n = {};
        return (
          a.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (a, e, t) {
            n[e] = t;
          }),
          n
        );
      })(m);
    (c = u.appkey), c && (t.apikey = c), (t.version = "4.4.14");
    var g = u.libraries;
    if ((g && (o = o.concat(g.split(","))), "false" !== u.autoload)) {
      for (var _ = 0, k = o.length; _ < k; _++)
        !(function (a) {
          a &&
            document.write('<script charset="UTF-8" src="' + a + '"></script>');
        })(s[o[_]]);
      t.readyState = 2;
    }
    t.load = function (n) {
      switch ((i.push(n), t.readyState)) {
        case 0:
          (t.readyState = 1), a();
          break;
        case 2:
          e();
      }
    };
  })();
