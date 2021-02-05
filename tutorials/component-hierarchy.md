## DesktopComponent

The desktop component ({@link module:components/DesktopComponent}) is responsible for
the vue template part of the OpenSeadragon canvas.

### lifecycle
#### `mounted`

On mount it dispatches `createOpenSeadragon`. The store then creates an
`OpenSeadragon.Viewer` using the given payload which is an object of properties
`divid`, `handler`, `config` and `TIback`.

* `divid`  
  Id string to identify `div` element for the OpenSeadragon canvas.
* `handler`  
  Object with named properties to inject handlers, e.g. `resize` or `zoom`.
* `config`  
  Config parameter for OpenSeadragon constructor
* `TIback`  
  Image source for a background image. Default is a beige rectangle.


## SourceComponent

A Source component manages display and accessibility of one source.
It provides one overlay with three knobs to flip pages and to move the source on the desktop.
The images are displayed using two PageComponents (recto/verso).

### lifecycle
#### `beforeDestroy`

* destroy Overlay -- *do we need that?*

## PageComponent

A page component manages one TiledImage and one Overlay containing the measure zones.
The zones are created with ZoneComponents which receive width and height in relation to the page width.

### lifecycle
#### `beforeDestroy`

* destroy Overlay -- *do we need that?*
* destroy TiledImage  
  1. `setOpacity(0)`
  2. `destroy()`

## ZoneComponent

On measure zone. Styled with CSS `top`, `left`, `width` and `height` attributes with percentage values.


