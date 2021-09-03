export const pagesNames = {
  state: {
    pages: 'pages'
  },
  mutations: {
    LOAD_PAGE: 'LOAD_PAGE'
  },
  actions: {},
  getters: {
    getPage: 'getPage'
  }
}

/**
 * @namespace store.processing
 */
const pagesModule = {
  state: {
    [pagesNames.state.pages]: {}
  },
  mutations: {
    [pagesNames.mutations.LOAD_PAGE] (state, page) {
      const pages = { ...state.pages }
      pages[page.id] = page
      state.pages = pages
    }
  },
  actions: {},
  getters: {
    [pagesNames.getters.getPage]: (state) => (id) => {
      /*
      for (const page in state.pages) {
        console.log(page, id)
      }
      */
      return state.pages[id]
    }
  }
}

export default pagesModule
