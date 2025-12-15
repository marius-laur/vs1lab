// File origin: VS1LAB A3

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

    // TODO: ... your code here ...
    constructor() {
        this.#geotags = [];
    }

    addGeoTag(geotag) {
        this.#geotags.push(geotag);
    }

    removeGeoTag(name) {
        for (let i = 0; i < this.#geotags.length; i++) {
            if (this.#geotags[i].name === name) {
                this.#geotags.splice(i, 1);
            }
        }
    }

    getNearbyGeoTags(longitude, latitude, radius) {
        var taglist = [];

        for (let i = 0; i < this.#geotags.length; i++) {
            var x = this.#geotags[i].longitude - longitude;
            var y = this.#geotags[i].latitude - latitude;

            var distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
            
            if (distance < radius) {
                taglist.push(this.#geotags[i]);
            }
        }
        return taglist;
    }

    searchNearbyGeoTags(location, keyword) {
        //TODO: this
    }

    getAllGeoTags() {
        return this.#geotags;
    }
}

module.exports = InMemoryGeoTagStore;
