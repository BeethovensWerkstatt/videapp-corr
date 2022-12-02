import { sourcesNames } from './names'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'

// TODO compareSources
// TODO compareMovements
// TODO comparePages?

/**
 * @class Positioner
 * utility class to lay out multiple sources on the desktop
 */
export class Positioner {
  /**
   * @param {Object} config width, hgap, vgap, px, py, ph
   */
  constructor ({ width, hgap, vgap, px, py, ph }) {
    this.width = width || 1600
    this.hgap = hgap || 0
    this.vgap = vgap || 0
    this.px = px || hgap / 2
    this.py = py || 0
    this.ph = ph || 0
  }

  /**
   * layout next source
   * @param {Object} source
   */
  addSource (source) {
    if (this.px > this.hgap && (this.px + this.hgap + source.maxDimensions.width) > this.width) {
      // start new line
      this.px = 0
      this.py += this.ph + this.vgap
      this.ph = source.maxDimensions.height
      source.position.x = this.px + this.hgap + (source.maxDimensions.width / 2)
      source.position.y = this.py + this.vgap + (source.maxDimensions.height / 2)
    } else {
      // next horizontal position
      source.position.x = this.px + this.hgap + (source.maxDimensions.width / 2)
      source.position.y = this.py + this.vgap + (source.maxDimensions.height / 2)
      this.px += source.maxDimensions.width + this.hgap
      this.ph = Math.max(this.ph, source.maxDimensions.height)
    }
  }
}

/**
 * @namespace store.sources
 */
const sourcesModule = {
  /**
   * @namespace store.sources.state
   * @property {Object} movements movement objects
   * @property {Object[]} sources source objects
   * @property {String} activeSourceId id of selected source
   */
  state: {
    [sourcesNames.state.movements]: {},
    [sourcesNames.state.sources]: [],
    [sourcesNames.state.activeSourceId]: null,
    [sourcesNames.state.pages]: {}
  },
  mutations,
  actions,
  getters
}

export default sourcesModule
