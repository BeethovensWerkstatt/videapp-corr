# Basic Decisions
## jsdoc

* shall the docs folder be committed or ignored? (see `.gitignore`)
  It is accessible without `npm install`, but OTOH it will be a lot of files to carry there.
* To start jsdoc there is a bash-script `./jsdoc.sh`

## lint

* class, methods and functions now need jsdocs (`eslintrc.js`)

## jest

* unit tests shall be placed in `tests/unit/`
* example `tests/unit/example.spec.js`

# TODOs and MAYBEs
## Vue Components

* Most Vue components should have a corresponding unit test
