/*
 * Map switcher for Strava website.
 *
 * Copyright © 2016 Tomáš Janoušek.
 *
 * BOOKMARKLET:
 *
 *  javascript:jQuery('body').append(jQuery("<script src='https://rawgit.com/liskin/strava-map-switcher/master/fix.js'></script>"))
 *
 * LICENSE:
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

(function(){
	Strava.Maps.Mapbox.Base.mapIds.runbikehike_id = "mapbox.run-bike-hike";

	Strava.Maps.Mapbox.CustomControlView.prototype.mapTypeIdMap = function(t){
		var e;
		return(
			e=
				{terrain:"terrain"
				,standard:"standard"
				,satellite:"satellite"
				,runbikehike:"runbikehike"
				,openstreetmap:"openstreetmap"
				,opencyclemap:"opencyclemap"
				,transport:"transport"
				,outdoors:"outdoors"
				,mtbmap:"mtbmap"
				},
			e[t]
		);
	};

	var layerNames =
		{terrain: Strava.I18n.Locale.t("strava.maps.google.custom_control.terrain")
		,standard: Strava.I18n.Locale.t("strava.maps.google.custom_control.standard")
		,satellite: Strava.I18n.Locale.t("strava.maps.google.custom_control.satellite")
		,runbikehike: "Run/Bike/Hike"
		,openstreetmap: "OpenStreetMap"
		,opencyclemap: "OpenCycleMap"
		,transport: "Transport"
		,outdoors: "Outdoors"
		,mtbmap: "mtbmap.cz"
		};

	Strava.Maps.CustomControlView.prototype.handleMapTypeSelector = function(t) {
		var e, i, r;
		return(
			e = this.$$(t.target),
			r = e.data("map-type-id"),
			i = this.$("#selected-map").data("map-type-id"),
			e.data("map-type-id", i),
			e.html(layerNames[i]),
			this.$("#selected-map").data("map-type-id", r),
			this.$("#selected-map").html(layerNames[r]),
			this.changeMapType(r)
		);
	};

	function htmlToElement(html) {
		var template = document.createElement('template');
		template.innerHTML = html;
		return template.content.firstChild;
	}

	var opts = document.getElementById("map-type-control").getElementsByClassName("options")[0];
	opts.appendChild(htmlToElement('<li><a class="map-type-selector" data-map-type-id="runbikehike">Run/Bike/Hike</a></li>'));
	opts.appendChild(htmlToElement('<li><a class="map-type-selector" data-map-type-id="openstreetmap">OpenStreetMap</a></li>'));
	opts.appendChild(htmlToElement('<li><a class="map-type-selector" data-map-type-id="opencyclemap">OpenCycleMap</a></li>'));
	opts.appendChild(htmlToElement('<li><a class="map-type-selector" data-map-type-id="transport">Transport</a></li>'));
	opts.appendChild(htmlToElement('<li><a class="map-type-selector" data-map-type-id="outdoors">Outdoors</a></li>'));
	opts.appendChild(htmlToElement('<li><a class="map-type-selector" data-map-type-id="mtbmap">mtbmap.cz</a></li>'));

	var osmAttr = '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>';
	var thunderforestAttr = osmAttr + ', Tiles courtesy of <a href="http://www.thunderforest.com/" target="_blank">Andy Allan</a>';
	var mtbMapAttr = osmAttr + ', Tiles courtesy of <a href="http://mtbmap.cz/" target="_blank">mtbmap.cz</a>';
	function createOpenStreetMapLayer() {
		return L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {attribution: osmAttr});
	}
	function createOpenCycleMapLayer() {
		//return L.tileLayer("http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png", {attribution: ""});
		return L.tileLayer("https://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png", {attribution: thunderforestAttr});
	}
	function createTransportLayer() {
		return L.tileLayer("https://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png", {attribution: thunderforestAttr});
	}
	function createOutdoorsLayer() {
		return L.tileLayer("https://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png", {attribution: thunderforestAttr});
	}
	function createMtbMapLayer() {
		return L.tileLayer("http://tile.mtbmap.cz/mtbmap_tiles/{z}/{x}/{y}.png", {attribution: mtbMapAttr});
	}

	var once = true;
	Strava.Maps.Mapbox.CustomControlView.prototype.changeMapType = function(t){
		var map = this.map();

		if (once) {
			once = false;
			map.layers.runbikehike = map.createLayer("run-bike-hike");
			map.layers.openstreetmap = createOpenStreetMapLayer();
			map.layers.opencyclemap = createOpenCycleMapLayer();
			map.layers.transport = createTransportLayer();
			map.layers.outdoors = createOutdoorsLayer();
			map.layers.mtbmap = createMtbMapLayer();
			this.delegateEvents();
		}

		return map.setLayer(this.mapTypeIdMap(t));
	};

	// make sure delegateEvents is run at least once
	opts.children[0].children[0].click();
})()
