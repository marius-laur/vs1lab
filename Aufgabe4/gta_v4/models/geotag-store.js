// File origin: VS1LAB A3

const GeoTag = require("./geotag");

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * A class for in-memory-storage of geotags
 * 
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.
 * 
 * Provide a method 'addGeoTag' to add a geotag to the store.
 * 
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 * 
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 * 
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields. 
 */
class InMemoryGeoTagStore {
    #geotags;

    constructor() {
        this.#geotags = [];
    }

    /**
    * A function that calculates the shortest distance between two points on a sphere using the haversine formula.
    * Sources:
    * https://www.geeksforgeeks.org/dsa/haversine-formula-to-find-distance-between-two-points-on-a-sphere/
    * https://www.math.ksu.edu/~dbski/writings/haversine.pdf
    * 
    * @param {number} latOrigin    latitude of origin in degrees
    * @param {number} longOrigin   longitude of origin in degrees
    * @param {number} latTarget    latitude of target in degrees
    * @param {number} longTarget   longitude of target in degrees
    * @param {number} sphereRadius radius of the sphere these points are on
    * @returns {number} distance between those points
    */
    #haversine(latOrigin, longOrigin, latTarget, longTarget, sphereRadius) {
        let distanceLatitude = (latOrigin - latTarget) * Math.PI / 180.0;
        let distanceLongitude = (longOrigin - longTarget) * Math.PI / 180.0;
        let latitudeOriginRad = latOrigin * Math.PI / 180.0;
        let latitudeTargetRad = latTarget * Math.PI / 180.0;

        let haversinLat = Math.pow(Math.sin(distanceLatitude /2), 2);
        let haversinLong = Math.pow(Math.sin(distanceLongitude / 2), 2);
        let haversinA = haversinLat + Math.cos(latitudeOriginRad) * Math.cos(latitudeTargetRad) * haversinLong;
        return 2 * sphereRadius * Math.asin(Math.sqrt(haversinA));
    }

    /**
     * Adds a geotag.
     *
     * @param {GeoTag} geotag geotag
     */
    addGeoTag(geotag) {
        this.#geotags.push(geotag);
    }

    /**
     * Removes a specific geotag.
     *
     * @param {string} name name of geotag
     */
    removeGeoTag(name) {
        for (let i = 0; i < this.#geotags.length; i++) {
            if (this.#geotags[i].name === name) {
                this.#geotags.splice(i, 1);
            }
        }
    }

    /**
     * Returns all geotags within a specific area around a point.
     *
     * @param {number} latitude  point latitude in degrees
     * @param {number} longitude point longitude in degrees
     * @param {number} radius    radius (in km) which determines the area around point
     * @returns {GeoTag[]} geotags as array
     */
    getNearbyGeoTags(latitude, longitude, radius) {
        let taglist = [];
        let earthRadius = 6371; //in km

        for (let i = 0; i < this.#geotags.length; i++) {
            let distance = this.#haversine(this.#geotags[i].latitude, this.#geotags[i].longitude, 
                latitude, longitude, earthRadius);

            if (distance < radius) {
                taglist.push(this.#geotags[i]);
            }
        }

        return taglist;
    }

    /**
     * Returns all geotags that have a matching name/hashtag (not case-sensitive) and are within a specific area.
     *
     * @param {number} latitude  latitude in degrees
     * @param {number} longitude longitude in degrees
     * @param {number} radius    radius (in km) which determines the area around point
     * @param {string} keyword   keyword
     * @returns {GeoTag[]} geotags as array
     */
    searchNearbyGeoTags(latitude, longitude, radius, keyword) {
        let taglistNearby = this.getNearbyGeoTags(latitude, longitude, radius);

        if (!keyword || keyword.trim() === '') {
            return taglistNearby;
        }
        keyword = keyword.toLowerCase();

        return taglistNearby.filter(tag =>
            tag.name.toLowerCase().includes(keyword) ||
            tag.hashtag.toLowerCase().includes(keyword)
        );
    }

    /**
     * Returns a geotag by id
     *
     * @param {number} id   unique of the geotag
     * @returns {GeoTag} geotag
     */
    getGeoTagById(id) {
    
        for (let i = 0; i < this.#geotags.length; i++) {
            if (id === this.#geotags[i].id) {
                return this.#geotags[i];
            }
        }
        return null;
    }

    /**
     * Removes a geotag by id
     *
     * @param {number} id   unique of the geotag
     */
    removeGeoTagById(id) {
    
        for (let i = 0; i < this.#geotags.length; i++) {
            if (id === this.#geotags[i].id) {
                this.#geotags.splice(i, 1);
            }
        }
    }

    /**
     * returns all geotags
     *
     * @returns {GeoTag[]} geotags as array
     */
    getAllGeoTags() {
        return this.#geotags;
    }
}

module.exports = InMemoryGeoTagStore;
