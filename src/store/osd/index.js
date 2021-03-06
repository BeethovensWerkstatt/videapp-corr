import OpenSeadragon from 'openseadragon'
import { registerMutations, registerActions } from '../names'

const toStore = {
  state: {
    viewer: null,
    scale: 1,
    deskDimensions: { width: 1600, height: 1000 },
    displayMeasures: false
  },
  mutations: {
    /**
     * set dimension of desktop in mm
     * @param {Object} state
     * @param {Object} dim - { width, height }
     */
    SET_DESK_DIMENSIONS (state, dim) {
      const { width, height } = dim
      state.deskDimensions = { width, height }
    },
    /**
     * update scale variable
     * @memberof store.mutations
     * @param {Object} state
     */
    UPDATE_SCALE (state) {
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
        const scale2 = state.viewer.viewport.getZoom(false) / state.viewer.viewport.getHomeZoom()
        // const scale3 = state.viewer.viewport.getZoom(true) / state.viewer.viewport.getHomeZoom()
        // console.log('update scale', scale1, scale2, scale3)
        state.scale = scale2
      } else {
        state.scale = 1
      }
    },
    /**
     * toggle display of measure numbers
     * @param {Object} state
     */
    SET_DISPLAY_MEASURES (state, display) {
      state.displayMeasures = display
    }
  },
  actions: {
    /**
     * create OpenSeadragon canvas
     * @memberof store.actions
     */
    createOpenSeaDragon ({ commit, state }, { config, TIback, handler }) {
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
     * @memberof store.actions
     */
    destroyOpenSeaDragon ({ commit, state }) {
      if (state.viewer) {
        state.viewer.destroy()
        state.viewer = null
      }
    }
  },
  getters: {
    viewer: (state) => {
      return state.viewer
    },
    scale: (state) => {
      return state.scale
    },
    deskDimensions: (state) => {
      return state.deskDimensions
    },
    displayMeasures: (state) => {
      return state.displayMeasures
    }
  }
}

// console.log(registerActions)
registerMutations(toStore.mutations)
registerActions(toStore.actions)
// console.log(actions)

export default toStore
