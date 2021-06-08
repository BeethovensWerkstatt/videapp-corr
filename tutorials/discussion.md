## JSON validation

* use <https://ajv.js.org/> for JSON validation -- sync with swagger?
* introduce classes for JSON data from eXist server
* think typescript interfaces and classes

---

## Q1 2021

### history
#### data structures/classes

* we should define classes for `source` and `page` that contains logic for page flipping and positioning
* *extra* data like position and pagenr should be stored separate to the core source data.

## Dec. 2020

### history
#### OpenSeadragon

* The `OpenSeadragonComponent` is not generic for any OSD aware application.
* Some code should be prepared by mixins to allow component inheritance.

#### TiledImages and Overlays

* Information about a source is collected in the SourceFacsimile component.
* If this is moved, all related Overlays have to be moved too.

