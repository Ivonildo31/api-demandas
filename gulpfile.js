var gulp = require( 'gulp' )
var ts = require( 'gulp-typescript' )
// var tslint from 'gulp-tslint'
// var sourcemaps from 'gulp-sourcemaps'
var mocha = require( 'gulp-mocha' )
var batch = require( 'gulp-batch' )
var shell = require( 'gulp-shell' )
var clean = require( 'gulp-clean' )
var istanbul = require( 'gulp-istanbul' )
var remapIstanbul = require( 'remap-istanbul/lib/gulpRemapIstanbul' )

var tsProject = ts.createProject( 'tsconfig.json' )

var sourcePath = 'server'
var destPath = 'build'
var sourceStatic = [ sourcePath + '/**/*', '!' + sourcePath + '/**/*.ts' ]
// const sourceTS = [ `${sourcePath}/**/*.ts` ]
var destJS = [ destPath + '/**/*.js' ]
var destTests = [ destPath + '/**/*.spec.js' ]

var runTest = function () {
  return gulp.src( destTests ) // take our transpiled test source
    .pipe( mocha( { timeout: 64000 } ) ) // runs tests
}

var tsCompile = function () {
  return tsProject.src()
    // .pipe( sourcemaps.init( { loadMaps: true } ) )
    .pipe( tsProject() ).js
    // .pipe( sourcemaps.write( '.', { includeContent: false, sourceRoot: sourcePath } ) )
    .pipe( gulp.dest( destPath ) )
}

gulp.task( 'default', [ 'build' ], shell.task( [ 'tsc -w -p .' ] ) )

gulp.task( 'clean', function () {
  return gulp.src( destPath, { read: false } )
    .pipe( clean() )
} )

gulp.task( 'build', [ 'clean' ], function () {
  return gulp.src( sourceStatic )
    .pipe( gulp.dest( 'build' ) )
} )

gulp.task( 'ts', [ 'build' ], tsCompile )

gulp.task( 'ts-inc', tsCompile )

// gulp.task( 'tslint', () => {
//   return gulp.src( sourceTS )
//     .pipe( tslint.default( {
//       configuration: 'tslint.json'
//     } ) )
//     .pipe( tslint.default.report() )
// } )

// gulp.task( 'pre-test', [ 'ts' ], () => {
//   return gulp.src( destJS.concat( [ `!${sourcePath}/**/*.Spec.js` ] ) )
//     .pipe( istanbul() )
//     .pipe( istanbul.hookRequire() ) // Force `require` to return covered files
// } )

// gulp.task( 'test', [ 'pre-test' ], () => {
//   return runTest()
//     .once( 'error', ( err: any ) => {
//       console.error( err )
//       process.exit( 1 )
//     } )
//     .once( 'end', () => process.exit() )
// } )

// gulp.task( 'watch:test', () => {
//   return gulp.watch( destTests, batch(( events: any, cb: any ) => {
//     return gulp.src( destTests )
//       .pipe( mocha( { timeout: 64000 } ) )
//   } ) )
// } )

// gulp.task( 'watch:single-test', () => {
//   return gulp.watch( destTests, batch(( events: any, cb: any ) => {
//     return events.pipe( mocha( { timeout: 64000 } ) )
//   } ) )
// } )

// gulp.task( 'test-coverage', [ 'pre-test' ], () => {
//   return runTest()
//     .once( 'error', () => process.exit( 1 ) )
//     .pipe( istanbul.writeReports( {
//       reporters: [ 'json' ] // this yields a basic non-sourcemapped coverage.json file
//     } ) )
// } )

// gulp.task( 'coverage', [ 'test-coverage' ], () => {
//   return gulp.src( './coverage/coverage-final.json' )
//     .pipe( remapIstanbul( {
//       basePath: '.',
//       reports: {
//         'html': './coverage',
//         'text-summary': null,
//         'lcovonly': './coverage/lcov.info'
//       }
//     } ) )
//     .once( 'end', () => process.exit() )
// } )
