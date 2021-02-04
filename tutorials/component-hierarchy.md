## Desktop Component

The desktop component ({@link module:components/DesktopComponent}) is responsible for
the vue template part of the OpenSeadragon canvas.

### `mounted`

On mount it dispatches `createOpenSeadragon`. The store then creates an
`OpenSeadragon.Viewer` using the given payload which is an object of properties
`divid`, `handler`, `config` and `TIback`.

