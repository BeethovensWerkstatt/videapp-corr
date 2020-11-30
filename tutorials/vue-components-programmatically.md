
*based on [css-tricks](https://css-tricks.com/creating-vue-js-component-instances-programmatically/)*

To create Vue-dynamic overlays in OpenSeaDragon, predefined components
need to be created dynamically. The mentioned blog post describes the
needed steps. Here is a little example for using Vue-Components with
OpenSeaDragon.

*needed:*

`import OpenSeadragon from 'openseadragon'`

`const viewer`

1. import vue component: `import TheComponent from '@/components/TheComponent.vue'`
2. create constructor for the component: `TheComponentClass = Vue.extend(TheComponent)`
3. create instance: `var theComponentInstance = new TheComponentClass({ propsData: {...} })`
4. *optionally* set slot data: `theComponentInstance.$slots.default = [ 'Click me!' ]`
5. render html: `theComponentInstance.$mount()`
6. add overlay: `viewer.addOverlay(theComponentInstance.$el, ...)`

**TBD**

* Management of images and overlays int the store
* synchronisation of image and related overlays

