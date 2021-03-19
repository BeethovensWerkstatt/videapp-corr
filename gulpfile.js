const gulp = require('gulp')
const git = require('gulp-git')

gulp.task('gitlog', async function () {
  git.exec({ args: 'log -n 1 --pretty="%ai %H%n%s (%an)"' }, function (err, stdout) {
    if (err) throw err
  })
})
