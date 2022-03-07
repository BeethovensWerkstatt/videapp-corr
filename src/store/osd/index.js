import OpenSeadragon from 'openseadragon'
import { OSDnames } from './names'

/**
 * @namespace store.osd
 */
const OSDmodule = {
  /**
   * @namespace store.osd.state
   * @property {OpenSeadragon.Viewer} viewer OpenSeadragon object
   * @property {Number} scale zoom factor of OpenSeadragon
   * @property {Object} deskDimensions width and height of desktop in millimeter
   */
  state: {
    [OSDnames.state.viewer]: null,
    [OSDnames.state.scale]: 1,
    [OSDnames.state.deskDimensions]: { width: 1600, height: 1000 }
  },
  /**
   * @namespace store.osd.mutations
   */
  mutations: {
    /**
     * set dimension of desktop in mm
     * @memberof store.osd.mutations
     * @param {Object} state
     * @param {Object} dim - { width, height }
     */
    [OSDnames.mutations.SET_DESK_DIMENSIONS] (state, dim) {
      const { width, height } = dim
      state.deskDimensions = { width, height }
    },
    /**
     * update scale variable
     * @memberof store.osd.mutations
     * @param {Object} state
     */
    [OSDnames.mutations.UPDATE_SCALE] (state) {
      // console.log(state.viewer)
      if (state.viewer) {
        // state.scale = state.viewer.viewport.viewportToImageZoom(state.viewer.viewport.getZoom(true))
        /*
        var p0 = new OpenSeadragon.Point(0, 0)
        var p1 = new OpenSeadragon.Point(10, 10)
        p0 = state.viewer.viewport.viewerElementToViewportCoordinates(p0)
        p1 = state.viewer.viewport.viewerElementToViewportCoordinates(p1)
        const scale1 = 10 / (p1.x - p0.x)
        */
        // const scale2 = state.viewer.viewport.getZoom(false) / state.viewer.viewport.getHomeZoom()
        // const scale3 = state.viewer.world.getItemAt(0).viewportToImageZoom(1)
        // console.log('update scale', scale1, scale2, scale3)
        const zoom = state.viewer.viewport.getZoom(true)
        const scale4 = state.viewer.viewport._containerInnerSize.x * zoom
        state.scale = scale4
      } else {
        state.scale = 1
      }
    }
  },
  /**
   * @namespace store.osd.actions
   */
  actions: {
    /**
     * create OpenSeadragon canvas
     * @memberof store.osd.actions
     */
    [OSDnames.actions.createOpenSeaDragon] ({ state }, { config, TIback, handler }) {
      // console.log(payload)
      // console.log(state)

      const viewer = OpenSeadragon(config)

      viewer.addTiledImage(TIback)

      if (state.viewer) {
        console.warn('viewer set twice!')
      }
      state.viewer = viewer

      for (const k in handler) {
        // console.log('handler :' + k)
        viewer.addHandler(k, handler[k])
      }
    },
    /**
     * destroy OpenSeadragon canvas
     * @memberof store.osd.actions
     */
    [OSDnames.actions.destroyOpenSeaDragon] ({ state }) {
      if (state.viewer) {
        state.viewer.destroy()
        state.viewer = null
      }
    }
  },
  /**
   * @namespace store.osd.getters
   * @property {Object} viewer OpenSeadragon object
   * @property {Number} scale OpenSeadragon zoom factor
   * @property {Object} deskDimensions desktop dimensions (width, height) in mm
   */
  getters: {
    [OSDnames.getters.viewer]: (state) => {
      return state.viewer
    },
    [OSDnames.getters.scale]: (state) => {
      return state.scale
    },
    [OSDnames.getters.deskDimensions]: (state) => {
      return state.deskDimensions
    }
  }
}

export default OSDmodule
