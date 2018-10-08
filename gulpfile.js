const gulp = require('gulp')
const del = require('del')
const archiver = require('gulp-archiver')
const sequence = require('run-sequence')
const phpcs = require('gulp-phpcs')
const pkg = require('./package.json')

var paths = {
  srcPHP:      'src/**/*.php',
  srcJS:       'src/**/*.js',
  srcCSS:      'src/**/*.css',
  srcReadme:   'plugin/readme.txt',
  srcAssets:   'plugin/assets/*',
  build:       'build',
  buildTrunk:  'build/trunk',
  buildAssets: 'build/assets',
  dist:        'dist',
}

gulp.task( 'clean:build', function() {
  return del([
    'build/**/*',
    '!build/',
    '!build/.gitkeep'
  ])
})

gulp.task( 'clean:dist', function() {
  return del([
    'dist/**/*',
    '!dist/',
    '!dist/.gitkeep'
  ])
})

gulp.task( 'copyphp', function() {
  return gulp.src( paths.srcPHP ).pipe( gulp.dest( paths.buildTrunk ) )
})

gulp.task( 'copyjs', function() {
  return gulp.src( paths.srcJS ).pipe( gulp.dest( paths.buildTrunk ) )
})

gulp.task( 'copycss', function() {
  return gulp.src( paths.srcCSS ).pipe( gulp.dest( paths.buildTrunk ) )
})

gulp.task( 'copyreadme', function() {
  return gulp.src( paths.srcReadme ).pipe( gulp.dest( paths.buildTrunk ) )
})

gulp.task( 'copyassets', function() {
  return gulp.src( paths.srcAssets ).pipe( gulp.dest( paths.buildAssets ) )
})

gulp.task( 'copybuild', function() {
  return gulp.src( 'build/trunk/**' ).pipe( gulp.dest( 'dist/' + pkg.name + '/' ) )
})

gulp.task( 'archive', function() {
  return gulp.src( 'dist/**' ).pipe( archiver( pkg.name + '.zip' ) ).pipe( gulp.dest( paths.dist ) )
})

gulp.task( 'phpcs', function() {
  return gulp.src([ 'src/**/*.php' ]).pipe( phpcs({ bin: 'vendor/bin/phpcs', standard: 'WordPress', warningSeverity: 0 }).on( 'error', function (e) {
    console.log(e)
  }) ).pipe( phpcs.reporter('log') )
})

gulp.task( 'default', function( callback ) {
  sequence( [ 'clean:dist', 'clean:build' ], [ 'clean:build', 'copyphp', 'copyjs', 'copycss', 'copyreadme', 'copyassets' ], callback );
})

gulp.task( 'build', function( callback ) {
  sequence( [ 'clean:dist', 'clean:build' ], [ 'copyphp', 'copyjs', 'copycss', 'copyreadme', 'copyassets' ], [ 'copybuild' ], [ 'archive' ], callback );
})

gulp.task( 'travis', function( callback ) {
  sequence( [ 'phpcs' ], callback );
})