<template>
  <div class="desk">
    <desktop-component></desktop-component>
    <div id="canvas"></div>
    <div id="sidebar">
      <div>
        <div id="navigatorBox">
          <div id="navigator"></div>
        </div>
        <div id="btnBox">
          <btn-group>
            <btn id="zoomIn" icon="plus" size="sm"></btn>
            <btn id="zoomOut" icon="minus" size="sm"></btn>
            <btn id="desktopOverview" icon="hResize" size="sm"></btn>
          </btn-group>
        </div>
      </div>
      <!-- <ZoneAnnotation /> -->
    </div>
  </div>
</template>

<script>
import DesktopComponent from '@/components/DesktopComponent'
import OpenSeadragon from 'openseadragon'
// import ZoneAnnotation from '@/components/ZoneAnnotation'
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

    console.log('I need to start an annotation on zone ' + obj.zone)

    const annot = {
      '@context': 'http://www.w3.org/ns/anno.jsonld#',
      id: 'randomuuId',
      type: 'Annotation',
      body: {
        type: 'TextualBody',
        value: '<p>j\'adore !</p>',
        format: 'text/html',
        language: 'fr',
        creator: 'http://example.net/user2',
        created: '2014-06-02T17:00:00Z'
      },
      target: 'http://linkToSource#' + obj.zone
    }
    console.log(annot)
  })
  viewer.addOverlay(overlay, new OpenSeadragon.Rect(obj.x, obj.y, obj.width, obj.height))
}

// loads a IIIF image onto the viewer
const addPage = (page, source) => {
  const scaleFactor = parseInt(page.dimensions.width) / parseInt(page.pixels.width)

  // const placement = page.place === 'verso' ? OpenSeadragon.Placement.RIGHT : OpenSeadragon.Placement.LEFT

  const x = page.place === 'verso' ? source.position.x - (source.maxDimensions.width / 4) : source.position.x + (source.maxDimensions.width / 4)
  const y = source.position.y - (source.maxDimensions.height / 2)

  viewer.addTiledImage({
    tileSource: {
      '@context': 'http://iiif.io/api/image/2/context.json',
      '@id': page.uri,
      profile: 'http://iiif.io/api/image/2/level2.json',
      protocol: 'http://iiif.io/api/image',
      width: page.pixels.width,
      height: page.pixels.height
    },
    x,
    y,
    width: page.dimensions.width// ,
    // fitBounds: new OpenSeadragon.Rect(source.position.x, source.position.y, page.dimensions.width, page.dimensions.height),
    //  fitBoundsPlacement: placement,
    // degrees: source.rotation / 5
  })
  page.measures.forEach(zone => {
    zone.x = (parseInt(zone.x) * scaleFactor) + parseInt(x)
    zone.y = (parseInt(zone.y) * scaleFactor) + parseInt(y)
    zone.width = parseInt(zone.width) * scaleFactor
    zone.height = parseInt(zone.height) * scaleFactor
    drawMeasure(zone)
  })
  console.log('page: ' + page.uri + ' (' + page.pixels.width + 'x' + page.pixels.height + ')')
  console.log('viewer:')
  console.log(viewer)
  console.log('scaleFactor: ' + scaleFactor)
}

const addSource = (source, i) => {
  const sourceBack = document.createElement('div')
  sourceBack.classList.add('sourceBack')
  sourceBack.id = source.id + '_back'
  sourceBack.innerHTML = '<label>' + source.label + '</label>'

  // const centerX = source.position.x
  // const centerY = source.position.y

  // const leftPos = source.position.x
  // const topPos = source.position.y
  // viewer.addOverlay(sourceBack, new OpenSeadragon.Rect(leftPos, topPos, parseInt(source.width) + 20, parseInt(source.height) + 20))
  // console.log(JSON.stringify(source.pages))

  const leftPage = source.pages[0].v
  const rightPage = source.pages[0].r

  if (leftPage !== null) {
    addPage(leftPage, source)
  }
  if (rightPage !== null) {
    addPage(rightPage, source)
  }
  // console.log('source width: ' + sourceBack.clientWidth)
}

export default {
  name: 'Desktop',
  components: {
    // ZoneAnnotation
    DesktopComponent
  },
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
      navigatorId: 'navigator',
      showFullPageControl: false,
      zoomInButton: 'zoomIn',
      zoomOutButton: 'zoomOut',
      homeButton: 'desktopOverview',
      // rotateLeftButton: containerID + '_rotateLeft',
      // rotateRightButton: containerID + '_rotateRight',
      // toolbar: 'desktopToolbar',
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

    // load desktop background
    viewer.addTiledImage({
      tileSource: {
        height: 1000,
        width: 1600,
        tileSize: 256,
        minLevel: 8,
        getTileUrl: function (level, x, y) {
          return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAKJGlDQ1BJQ0MgUHJvZmlsZQAASImVlgdQFNkWhm/35EQachzikHNGYMhZgmRRGGbIMMKQEROyqMCKIiICioBLVHB1iWtABFFBBBQwoAuyCCjrYkBUVF4ju+tubdV79f6qc+9Xp7vOOd23q/oHgBTLjI+PhfkAiOMkcb0crGn+AYE03DQgAgIgAzlAYbIS4608PFwBoj/3f+rdGIDW9rsaa7X+ff2/ip8dlsgCAPJAOJ6dyIpDuAthe1Y8NwkAGI+wfGpS/BqrIyzIRQZEmLHGEevsvcah6xz59R5vLxuEMwHAk5lMbgQAxP1InpbCikDqEOsQ1uawozgI30fYghXJZANAEkVYPS5u2xrbIqwc+rc6Ef+oGfpXTSYz4i9ef5avErZnckM1XG1sacoxzNioUG5UGDdJ5f98Of9LcbHJf/ZbOwEyO8zWDtlVkZAE9oAJuCAUaABXYANsAQ0ogxgkFwuikCwXWcOQNQkgQyWFpSWtFbHZFp/OjYqITKJZIScZRnPisDTVabraOiYArH0X663ecL52g/gJ33LcJwCYKiPJtG+5EF0AOoKR49D4lpPvRcZMB+DSflYyN2U9h15bMMgXxwsEgRiQBvLIpBpAFxgCM8AAdsAZuANvEAC2AhaIBHHI1KkgE+wBOSAPHAJHQSmoANWgDpwF50EbuAiuguugHwyBUfAITIIZ8AIsgndgBYIgHESBqJAYJAMpQmqQLmQMWUB2kCvkBQVAIVAExIGSoUxoL5QHFUKlUCVUD/0IdUBXoZvQMPQAmoLmodfQRxgFk2FBWApWgrVgY9gKdoG94S1wBJwAZ8DZ8EG4BK6Cz8Ct8FW4Hx6FJ+EX8BIKoEgoYZQsSgNljLJBuaMCUeEoLmonKhdVjKpCNaE6UX2ou6hJ1ALqAxqLpqJpaA20GdoR7YNmoRPQO9H56FJ0HboV3YO+i55CL6K/YCgYSYwaxhTjhPHHRGBSMTmYYkwNpgXTixnFzGDeYbFYYSwda4R1xAZgo7HbsfnYE9hmbBd2GDuNXcLhcGI4NZw5zh3HxCXhcnDHcWdwV3AjuBncezwJL4PXxdvjA/EcfBa+GN+Av4wfwc/iVwh8BEWCKcGdwCakEwoIpwmdhDuEGcIKkZ9IJ5oTvYnRxD3EEmITsZc4QXxDIpHkSCYkT1IUaTephHSOdIM0RfpAFiCrkm3IQeRk8kFyLbmL/ID8hkKhKFEYlEBKEuUgpZ5yjfKE8p6HyqPJ48TD5tnFU8bTyjPC85KXwKvIa8W7lTeDt5j3Au8d3gU+Ap8Snw0fk28nXxlfB9843xI/lV+H350/jj+fv4H/Jv+cAE5AScBOgC2QLVAtcE1gmoqiylNtqCzqXuppai91RhArSBd0EowWzBM8KzgouCgkIKQv5CuUJlQmdEloUhglrCTsJBwrXCB8XnhM+KOIlIiVSJjIAZEmkRGRZVEJUYZomGiuaLPoqOhHMZqYnViM2GGxNrHH4mhxVXFP8VTxk+K94gsSghJmEiyJXInzEg8lYUlVSS/J7ZLVkgOSS1LSUg5S8VLHpa5JLUgLSzOko6WLpC9Lz8tQZSxkomSKZK7IPKcJ0axosbQSWg9tUVZS1lE2WbZSdlB2RY4u5yOXJdcs91ieKG8sHy5fJN8tv6ggo+CmkKnQqPBQkaBorBipeEyxT3FZia7kp7RPqU1pji5Kd6Jn0BvpE8oUZUvlBOUq5XsqWBVjlRiVEypDqrCqgWqkapnqHTVYzVAtSu2E2rA6Rt1EnaNepT6uQdaw0kjRaNSY0hTWdNXM0mzTfKmloBWodVirT+uLtoF2rPZp7Uc6AjrOOlk6nTqvdVV1Wbpluvf0KHr2erv02vVe6avph+mf1L9vQDVwM9hn0G3w2dDIkGvYZDhvpGAUYlRuNG4saOxhnG98wwRjYm2yy+SiyQdTQ9Mk0/Omv5tpmMWYNZjNbaBvCNtwesO0uZw507zSfNKCZhFiccpi0lLWkmlZZfmUIc9gM2oYs1YqVtFWZ6xeWmtbc61brJdtTG122HTZomwdbHNtB+0E7HzsSu2e2MvZR9g32i86GDhsd+hyxDi6OB52HHeScmI51TstOhs573DucSG7bHIpdXnqqurKde10g92c3Y64TWxU3MjZ2OYO3J3cj7g/9qB7JHj87In19PAs83zmpeOV6dW3ibopeFPDpnfe1t4F3o98lH2Sfbp9eX2DfOt9l/1s/Qr9Jv21/Hf49weIB0QFtAfiAn0DawKXNtttPrp5JsggKCdobAt9S9qWm1vFt8ZuvRTMG8wMvhCCCfELaQj5xHRnVjGXQp1Cy0MXWTasY6wXbAa7iD0fZh5WGDYbbh5eGD4XYR5xJGI+0jKyOHIhyiaqNOpVtGN0RfRyjHtMbcxqrF9scxw+LiSugyPAieH0bJPelrZtOF4tPid+MsE04WjCIteFW5MIJW5JbE8SRH7AA8nKyd8lT6VYpJSlvE/1Tb2Qxp/GSRtIV00/kD6bYZ/xw3b0dtb27kzZzD2ZUzusdlTuhHaG7uzeJb8re9fMbofddXuIe2L23M7SzirMervXb29ntlT27uzp7xy+a8zhyeHmjO8z21exH70/av/gAb0Dxw98yWXn3srTzivO+5TPyr/1vc73Jd+vHgw/OFhgWHDyEPYQ59DYYcvDdYX8hRmF00fcjrQW0Ypyi94eDT56s1i/uOIY8VjysckS15L24wrHDx3/VBpZOlpmXdZcLll+oHz5BPvEyEnGyaYKqYq8io+nok7dr3SobK1SqiquxlanVD877Xu67wfjH+prxGvyaj7Xcmon67zqeuqN6usbJBsKGuHG5Mb5M0Fnhs7anm1v0miqbBZuzjsHziWfe/5jyI9j513Od18wvtD0k+JP5S3UltxWqDW9dbEtsm2yPaB9uMO5o7vTrLPlZ82fay/KXiy7JHSp4DLxcvbl1SsZV5a64rsWrkZcne4O7n50zf/avR7PnsFel94b1+2vX+uz6rtyw/zGxZumNztuGd9q6zfsbx0wGGi5bXC7ZdBwsPWO0Z32IZOhzuENw5dHLEeu3rW9e/2e073+0Y2jw2M+Y/fHg8Yn77Pvzz2IffDqYcrDlUe7JzATuY/5Hhc/kXxS9YvKL82ThpOXpmynBp5uevpomjX94tfEXz/NZD+jPCuelZmtn9OduzhvPz/0fPPzmRfxL1YWcn7j/638pfLLn35n/D6w6L8484r7avV1/huxN7Vv9d92L3ksPXkX925lOfe92Pu6D8Yf+j76fZxdSf2E+1TyWeVz5xeXLxOrcaur8Uwu86sVQCEBh4cD8LoWAEoAANQhxFttXvdtf/gc6G+O508Gnz9+45XqdW/3VYYA1DIA8NkNgGsXACeRUESYjOxrltObAWA9vb/iDyWG6+mu9yAhfheTuLr6FgMADov0aVhdXXm5uvq5Hxm2DICeY+t+cU1YxEWfoq/R7Qmxf3m1/wCI0sJhLZKsmQAAAIplWElmTU0AKgAAAAgABAEaAAUAAAABAAAAPgEbAAUAAAABAAAARgEoAAMAAAABAAIAAIdpAAQAAAABAAAATgAAAAAAAACQAAAAAQAAAJAAAAABAAOShgAHAAAAEgAAAHigAgAEAAAAAQAAAAKgAwAEAAAAAQAAAAIAAAAAQVNDSUkAAABTY3JlZW5zaG90dLUiigAAAAlwSFlzAAAWJQAAFiUBSVIk8AAAAdJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iPgogICAgICAgICA8ZXhpZjpQaXhlbFhEaW1lbnNpb24+MjwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOlVzZXJDb21tZW50PlNjcmVlbnNob3Q8L2V4aWY6VXNlckNvbW1lbnQ+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj4yPC9leGlmOlBpeGVsWURpbWVuc2lvbj4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+Cl89Cn4AAAAcaURPVAAAAAIAAAAAAAAAAQAAACgAAAABAAAAAQAAAEYJD6UAAAAAEklEQVQYGWL88uXdf8b//xkAAAAA///zu+VQAAAAD0lEQVRj/Prl3X9Ghv8MAG1gCq0TAUjmAAAAAElFTkSuQmCC'
        }
      },
      x: 0,
      y: 0,
      width: 1600
    })
    const sources = this.$store.getters.sources
    console.log(typeof addPage)
    console.log(sources)
    // let w = 10 // 10mm from left
    // let h = 10 // 10mm from top

    sources.forEach((source, i) => {
      addSource(source, i)
    })
    /* pages.forEach(page => {
      addPage(page)
    }) */
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

.desk {
  flex: 1 0 auto;
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  align-items: stretch;
  position: relative;
}

#dialog {
  position: absolute;
  left: 0;
  top: 0;
  width: 800px;
  height: 600px;
  z-index: -1;
  background-color: white;
  border-radius: 5px;

  &:hover {
    border: 1px black solid;
  }
  &.active {
    z-index: 10;
  }
}

#canvas {
  height: 100%;
  width: calc(100% - 15rem);
  flex: 1 1 auto;

  .measure {
    width: 3rem;
    height: 1rem;
    border: .5px solid $border-color;
    border-radius: 5px;
    box-shadow: 0 0 .5rem #00000099;
    opacity: 0;

    &:hover {
      opacity: 1;
    }

    &.active {
      background-color: rgba($color: #ffffff, $alpha: .5);
    }
  }

}

#sidebar {
  height: 100%;
  width: calc(15rem - .5px);
  flex: 1 1 auto;
  border-left: .5px solid $border-color;
  background-color: #f5f5f5;

  & > div {
    width: calc(100% - 1px - .4rem);
    margin: .2rem;
    border: .5px solid $border-color;
    border-radius: .3rem;
    background-color: #ffffff;
    box-shadow: 0 .1rem .5rem #00000033 inset;
  }

  #navigator {
    height: 5rem;
    width: 100%;
  }

  #btnBox > div {
    display: inline-block;
  }
}
</style>
