/*global Scroller */

function generateScroller(container) {
	var content = container.getElementsByTagName("div")[0],
		/*refreshElem = content.getElementsByTagName("div")[0],*/
		render = Scroller.renderingEngine(content),
		scroller, rect, insertItems, i, row, mousedown;

	insertItems = function () {
		for (i = 0; i < 50; i++) {
			row = document.createElement("div");
			row.className = "row";
			row.style.backgroundColor = i % 2 > 0 ? "#ddd" : "";
			row.innerHTML = Math.random();

			if (content.firstChild === content.lastChild) {
				content.appendChild(row);
			} else {
				content.insertBefore(row, content.childNodes[1]);
			}
		}

		// Update Scroller dimensions for changed content
		scroller.setDimensions(container.clientWidth, container.clientHeight, content.offsetWidth, content.offsetHeight - 50);
	};

	// Initialize Scroller
	scroller = new Scroller(render, {
		scrollingX: false
	});

	// Activate pull-to-refresh
	/*scroller.activatePullToRefresh(50, function () {
		refreshElem.className += " active";
		refreshElem.innerHTML = "Release to Refresh";
	}, function () {
		refreshElem.className = refreshElem.className.replace(" active", "");
		refreshElem.innerHTML = "Pull to Refresh";
	}, function () {
		refreshElem.className += " running";
		refreshElem.innerHTML = "Refreshing...";
		setTimeout(function () {
			refreshElem.className = refreshElem.className.replace(" running", "");
			insertItems();
			scroller.finishPullToRefresh();
		}, 2000);
	});*/

	// Setup Scroller
	rect = container.getBoundingClientRect();
	scroller.setPosition(rect.left + container.clientLeft, rect.top + container.clientTop);

	// Fill Scroller
	insertItems();

	// Event Handler
	if ('ontouchstart' in window) {
		container.addEventListener("touchstart", function (e) {
			// Don't react if initial down happens on a form element
			if (e.target.tagName.match(/input|textarea|select/i)) {
				return;
			}

			scroller.doTouchStart(e.touches, e.timeStamp);
			e.preventDefault();
		}, false);

		document.addEventListener("touchmove", function (e) {
			scroller.doTouchMove(e.touches, e.timeStamp);
		}, false);

		document.addEventListener("touchend", function (e) {
			scroller.doTouchEnd(e.timeStamp);
		}, false);

		container.addEventListener("touchinertia", function (e) {
			console.log([e.translateX, e.translateY, e.zoom].join(", "));
		}, false);

	} else {
		mousedown = false;

		container.addEventListener("mousedown", function (e) {
			// Don't react if initial down happens on a form element
			if (e.target.tagName.match(/input|textarea|select/i)) {
				return;
			}

			scroller.doTouchStart([{
				pageX: e.pageX,
				pageY: e.pageY
			}], e.timeStamp);

			mousedown = true;
		}, false);

		document.addEventListener("mousemove", function (e) {
			if (!mousedown) {
				return;
			}

			scroller.doTouchMove([{
				pageX: e.pageX,
				pageY: e.pageY
			}], e.timeStamp);

			mousedown = true;
		}, false);

		document.addEventListener("mouseup", function (e) {
			if (!mousedown) {
				return;
			}

			scroller.doTouchEnd(e.timeStamp);

			mousedown = false;
		}, false);
	}
}

window.addEventListener("DOMContentLoaded", function () {
	generateScroller(document.getElementById("container-1"));
	generateScroller(document.getElementById("container-2"));
});
