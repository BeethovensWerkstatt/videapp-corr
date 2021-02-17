import OpenSeadragon from 'openseadragon'
import { registerMutations, registerActions } from './names'

const toStore = {
  state: {
    viewer: null,
    scale: 1,
    deskDimensions: { width: 1600, height: 1000 }
  },
  mutations: {
    /**
     * set dimension of desktop in mm
     * @param {Object} state
     * @param {Object} dim - { width, height }
     */
    SET_DESK_DIMENSIONS (state, dim) {
      state.deskDimensions = dim
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
        var p0 = new OpenSeadragon.Point(0, 0)
        var p1 = new OpenSeadragon.Point(1, 1)
        p0 = state.viewer.viewport.viewerElementToViewportCoordinates(p0)
        p1 = state.viewer.viewport.viewerElementToViewportCoordinates(p1)
        state.scale = 1 / (p1.x - p0.x)
        // console.log('update scale ' + state.scale)
      } else {
        state.scale = 1
      }
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
    }
  }
}

// console.log(registerActions)
registerMutations(toStore.mutations)
registerActions(toStore.actions)
// console.log(actions)

export default toStore
