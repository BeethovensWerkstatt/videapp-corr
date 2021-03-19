const gulp = require('gulp')
const git = require('gulp-git')

gulp.task('gitlog', async function () {
  git.exec({ args: 'log -n 1 --pretty="%ai %H (%an)%n%s"', log: true }, function (err, stdout) {
    if (err) throw err
  })
})
