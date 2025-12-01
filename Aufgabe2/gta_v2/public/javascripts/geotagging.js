// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

/**
  * A class to help using the HTML5 Geolocation API.
  */
class LocationHelper {
    // Location values for latitude and longitude are private properties to protect them from changes.
    #latitude = '';

    /**
     * Getter method allows read access to privat location property.
     */
    get latitude() {
        return this.#latitude;
    }

    #longitude = '';

    get longitude() {
        return this.#longitude;
    }

    /**
     * Create LocationHelper instance if coordinates are known.
     * @param {string} latitude 
     * @param {string} longitude 
     */
    constructor(latitude, longitude) {
        this.#latitude = (parseFloat(latitude)).toFixed(5);
        this.#longitude = (parseFloat(longitude)).toFixed(5);
    }

    /**
     * The 'findLocation' method requests the current location details through the geolocation API.
     * It is a static method that should be used to obtain an instance of LocationHelper.
     * Throws an exception if the geolocation API is not available.
     * @param {*} callback a function that will be called with a LocationHelper instance as parameter, that has the current location details
     */
    static findLocation(callback) {
        const geoLocationApi = navigator.geolocation;

        if (!geoLocationApi) {
            throw new Error("The GeoLocation API is unavailable.");
        }

        // Call to the HTML5 geolocation API.
        // Takes a first callback function as argument that is called in case of success.
        // Second callback is optional for handling errors.
        // These callbacks are given as arrow function expressions.
        geoLocationApi.getCurrentPosition((location) => {
            // Create and initialize LocationHelper object.
            const helper = new LocationHelper(location.coords.latitude, location.coords.longitude);
            // Pass the locationHelper object to the callback.
            callback(helper);
        }, (error) => {
            alert(error.message);



            // Fallback auf feste Koordinaten, damit trotzdem eine Karte aufgebaut wird
            const helper = new LocationHelper(49.01513103745519, 8.390081162863467);
            callback(helper);
        });



    }
}

/**
 * A class to help using the Leaflet map service.
 */
class MapManager {

    #map
    #markers

    /**
    * Initialize a Leaflet map
    * @param {number} latitude The map center latitude
    * @param {number} longitude The map center longitude
    * @param {number} zoom The map zoom, defaults to 18
    */
    initMap(latitude, longitude, zoom = 18) {
        // set up dynamic Leaflet map
        this.#map = L.map('map').setView([latitude, longitude], zoom);
        var mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';

        //'https://api.maptiler.com/maps/satellite/{z}/{x}/{y}.jpg?key=yVoenMkXIb0XhXyQtAbs'


        L.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; ' + mapLink + ' Contributors'
        }).addTo(this.#map);

        this.#markers = L.layerGroup().addTo(this.#map);
    }

    /**
    * Update the Markers of a Leaflet map
    * @param {number} latitude The map center latitude
    * @param {number} longitude The map center longitude
    * @param {{latitude, longitude, name}[]} tags The map tags, defaults to just the current location
    */
    updateMarkers(latitude, longitude, tags = []) {
        // delete all markers
        this.#markers.clearLayers();
        L.marker([latitude, longitude])
            .bindPopup("Your Location")
            .addTo(this.#markers);
        for (const tag of tags) {
            L.marker([tag.latitude, tag.longitude])
                .bindPopup(tag.name)
                .addTo(this.#markers);
        }
    }
}


const mapManager = new MapManager();

/**
 * TODO: 'updateLocation'
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
function updateLocation() {

    LocationHelper.findLocation((location) => {
        const tagLatitude = document.getElementById("tag-latitude-input");
        const tagLongitude = document.getElementById("tag-longitude-input");
        const discoveryLatitude = document.getElementById("discovery-latitude-input");
        const discoveryLongitude = document.getElementById("discovery-longitude-input");

        tagLatitude.value = location.latitude;
        tagLongitude.value = location.longitude;
        discoveryLatitude.value = location.latitude;
        discoveryLongitude.value = location.longitude;

        //Insert Marker into Leaflet Map
        mapManager.initMap(location.latitude, location.longitude);
        mapManager.updateMarkers(location.latitude, location.longitude);

        //Marker onto the map
        const placeholderImg = document.querySelector(".discovery__map img");
        const placeholderText = document.querySelector(".discovery__map span");
        if (placeholderImg) {
            placeholderImg.remove();
        }
        if (placeholderText) {
            placeholderText.remove();
        }

    });
}


// Execute this function automatically after loading the page
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
});

