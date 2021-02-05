## TODOs and MAYBEs
### Vue Components

* ISSUE in Brave (Chrome) tiled images do not disappear in navigator on destroy
* TODO most Vue components should have a corresponding unit test
* QUESTION do we need `beforeDestroy()` for Page and Source or is it killed with OpenSeadragon?


## Basic Decisions
### jsdoc

* the /docs/ folder is created, but the contents are ignored
* To start jsdoc there is a bash-script `./jsdoc.sh`

### lint

* class, methods and functions now need jsdocs (`eslintrc.js`)

### jest

* unit tests shall be placed in `tests/unit/`
* example `tests/unit/example.spec.js`

