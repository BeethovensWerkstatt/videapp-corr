## Vue lifecycle

* Do we need `beforeDestroy()` for Page and Source or is it killed with OpenSeadragon?

---

## history
### OpenSeadragon

* The `OpenSeadragonComponent` is not generic for any OSD aware application.
* Some code should be prepared by mixins to allow component inheritance.

### TiledImages and Overlays

* Information about a source is collected in the SourceFacsimile component.
* If this is moved, all related Overlays have to be moved too.

