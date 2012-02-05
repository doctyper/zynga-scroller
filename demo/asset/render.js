/*global opera, Scroller */

/* DOM-based rendering (Uses 3D when available, falls back on margin when transform not available) */
Scroller.renderingEngine = function (scope) {
	var docStyle = document.documentElement.style,
		engine, vendorPrefix, undef,
		helperElem = document.createElement("div"),
		perspectiveProperty, transformProperty;

	function dispatch(target, props) {
		var e = document.createEvent("Events"),
			name;

		e.initEvent("touchinertia", false, true);

		if (props) {
			for (name in props) {
				e[name] = props[name];
			}
		}

		return target.dispatchEvent(e);
	}

	if ("opera" in window && Object.prototype.toString.call(opera) === "[object Opera]") {
		engine = "presto";
	} else if ("MozAppearance" in docStyle) {
		engine = "gecko";
	} else if ("WebkitAppearance" in docStyle) {
		engine = "webkit";
	} else if (typeof navigator.cpuClass === "string") {
		engine = "trident";
	}

	vendorPrefix = {
		trident: "ms",
		gecko: "Moz",
		webkit: "Webkit",
		presto: "O"
	}[engine];

	perspectiveProperty = vendorPrefix + "Perspective";
	transformProperty = vendorPrefix + "Transform";

	if (helperElem.style[perspectiveProperty] !== undef) {

		return function (left, top, zoom) {
			scope.style[transformProperty] = "translate3d(" + (-left) + "px," + (-top) + "px,0) scale(" + zoom + ")";

			dispatch(scope, {
				translateX: left,
				translateY: top,
				zoom: zoom
			});
		};

	} else if (helperElem.style[transformProperty] !== undef) {

		return function (left, top, zoom) {
			scope.style[transformProperty] = "translate(" + (-left) + "px," + (-top) + "px) scale(" + zoom + ")";

			dispatch(scope, {
				translateX: left,
				translateY: top,
				zoom: zoom
			});
		};

	} else {

		return function (left, top, zoom) {
			scope.style.marginLeft = left ? (-left / zoom) + "px" : "";
			scope.style.marginTop = top ? (-top / zoom) + "px" : "";
			scope.style.zoom = zoom || "";

			dispatch(scope, {
				translateX: left,
				translateY: top,
				zoom: zoom
			});
		};

	}
};
