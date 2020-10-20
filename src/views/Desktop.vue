<template>
  <div class="hello">
    <div id="canvas"></div>
  </div>
</template>

<script>

import OpenSeadragon from 'openseadragon'
// import osdConfiguration from '@/config/osd.config.js'

// will be populated when OSD is loaded
let viewer

// draws a measure rectangle
const drawMeasure = (obj) => {
  const overlay = document.createElement('div')
  overlay.classList.add('measure')
  overlay.id = obj.id
  overlay.innerHTML = obj.label
  overlay.addEventListener('click', (e) => {
    overlay.classList.toggle('active')
    console.log('I need to start an annotation on zone ' + obj.id)
  })
  viewer.addOverlay(overlay, new OpenSeadragon.Rect(obj.x, obj.y, obj.width, obj.height))
}

// loads a IIIF image onto the viewer
const addPage = (page) => {
  viewer.addTiledImage({
    tileSource: {
      '@context': 'http://iiif.io/api/image/2/context.json',
      '@id': page.uri,
      profile: 'http://iiif.io/api/image/2/level2.json',
      protocol: 'http://iiif.io/api/image',
      width: page.width,
      height: page.height
    },
    x: page.x,
    y: page.y,
    width: page.width
  })
  page.zones.forEach(zone => {
    zone.x = zone.x + page.x
    zone.y = zone.y + page.y
    drawMeasure(zone)
  })
}

export default {
  name: 'Desktop',
  mounted () {
    /* let tileSources = [{
      '@context': 'http://iiif.io/api/image/2/context.json',
      '@id': 'https://libimages1.princeton.edu/loris/pudl0001%2F4609321%2Fs42%2F00000001.jp2',
      height: 7200,
      width: 5233,
      profile: ['http://iiif.io/api/image/2/level2.json'],
      protocol: 'http://iiif.io/api/image',
      tiles: [{
        scaleFactors: [1, 2, 4, 8, 16, 32],
        width: 1024
      }]
    }]

    tileSources = [{
      // '@id': 'https://api.digitale-sammlungen.de/iiif/image/v2/bsb11151936_00001/full/full/0/default.jpg',
      '@context': 'http://iiif.io/api/image/2/context.json',
      '@id': 'https://api.digitale-sammlungen.de/iiif/image/v2/bsb11151936_00001',
      profile: 'http://iiif.io/api/image/2/level2.json',
      protocol: 'http://iiif.io/api/image',
      width: 2884,
      height: 3839,
      x: 0,
      y: 0
    }, {
      // '@id': 'https://api.digitale-sammlungen.de/iiif/image/v2/bsb11151936_00002/full/full/0/default.jpg',
      '@context': 'http://iiif.io/api/image/2/context.json',
      '@id': 'https://api.digitale-sammlungen.de/iiif/image/v2/bsb11151936_00002',
      profile: 'http://iiif.io/api/image/2/level2.json',
      protocol: 'http://iiif.io/api/image',
      width: 3001,
      height: 3802,
      x: 3000,
      y: 0
    }]
    */
    /*
    tileSource: positionedObject.uri,
                    x: positionedObject.x,
                    y: positionedObject.y,
                    width: positionedObject.width,
                    success: (e) => {
                        this._tiledImages.set(positionedObject.uri,e.item);
                    }
     */

    viewer = OpenSeadragon({
      id: 'canvas',

      tileSources: [],
      sequenceMode: false,
      animationTime: 1.5,
      showReferenceStrip: true,
      showRotationControl: true,
      showNavigator: true,
      navigatorRotate: false,
      // navigatorId: containerID + '_facsimileNavigator',
      showFullPageControl: false,
      // zoomInButton: containerID + '_zoomIn',
      // zoomOutButton: containerID + '_zoomOut',
      // homeButton: containerID + '_zoomHome',
      // rotateLeftButton: containerID + '_rotateLeft',
      // rotateRightButton: containerID + '_rotateRight',
      // toolbar: containerID + '_menubar',
      pixelsPerWheelLine: 60,
      // Enable touch rotation on tactile devices
      gestureSettingsTouch: {
        pinchRotate: true
      },
      gestureSettingsMouse: {
        clickToZoom: false,
        dblClickToZoom: true
      },
      collectionMode: false

    })
    // console.log(osdConfiguration)

    const pages = this.$store.getters.pages
    pages.forEach(page => {
      addPage(page)
    })
  },
  computed: {
    pages: function () {
      return (this.$store.getters.pages)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "@/scss/variables.scss";

#canvas {
  margin: 1rem 5rem;
  height: 10rem;
  border  : .5px solid $border-color;
}

.measure {
  width: 3rem;
  hight: 1rem;
  border: .5px solid $border-color;
  background-color: fuchsia;

  &.active {
    background-color: blue;
  }
}
</style>
