const gulp = require('gulp')
const git = require('gulp-git')
const fs = require('fs')

gulp.task('gitlog', async function () {
  git.exec(
    {
      args: 'log -n 1 --pretty="%ai %H (%an)%n%s"',
      log: false
    },
    function (err, stdout) {
      if (err) throw err
      // store in config/version.json
      const json = { version: stdout }
      fs.writeFile('src/config/version.json', JSON.stringify(json, null, 2), function () {
        console.log('fertig')
      })
    }
  )
})
