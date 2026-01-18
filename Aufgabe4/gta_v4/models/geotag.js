// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/** * 
 * A class representing geotags.
 * GeoTag objects should contain at least all fields of the tagging form.
 */
class GeoTag {
    static id = 0;

    constructor(name, latitude, longitude, hashtag) {
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
        this.hashtag = hashtag;
        this.id++;
    }    
}

module.exports = GeoTag;
