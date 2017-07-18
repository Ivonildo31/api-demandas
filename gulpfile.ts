/// <reference path="node_modules/@types/node/index.d.ts" />
/// <reference path="node_modules/@types/gulp/index.d.ts" />
/// <reference path="node_modules/@types/gulp-typescript/index.d.ts" />
// <reference path="node_modules/@types/gulp-tslint/index.d.ts" />
/// <reference path="node_modules/@types/gulp-sourcemaps/index.d.ts" />
/// <reference path="node_modules/@types/gulp-mocha/index.d.ts" />
/// <reference path="node_modules/@types/gulp-batch/index.d.ts" />
/// <reference path="node_modules/@types/gulp-shell/index.d.ts" />

import * as gulp from 'gulp'
import * as ts from 'gulp-typescript'
// import * as tslint from 'gulp-tslint'
import * as sourcemaps from 'gulp-sourcemaps'
import * as mocha from 'gulp-mocha'
import * as batch from 'gulp-batch'
import * as shell from 'gulp-shell'
const clean = require( 'gulp-clean' )
const istanbul = require( 'gulp-istanbul' )
const remapIstanbul = require( 'remap-istanbul/lib/gulpRemapIstanbul' )

const tsProject: any = ts.createProject( 'tsconfig.json' )

const sourcePath = 'server'
const destPath = 'build'
const sourceStatic = [ `${sourcePath}/**/*`, `!${sourcePath}/**/*.ts` ]
const sourceTS = [ `${sourcePath}/**/*.ts` ]
const destJS = [ `${destPath}/**/*.js` ]
const destTests = [ `${destPath}/**/*.spec.js` ]

const runTest = () => {
  return gulp.src( destTests ) // take our transpiled test source
    .pipe( mocha( { timeout: 64000 } ) ) // runs tests
}

const tsCompile = () => {
  return gulp
    .src( sourceTS ).pipe( sourcemaps.init( { loadMaps: true } ) )
    .pipe( tsProject() )
    .pipe( sourcemaps.write( '.', { includeContent: false, sourceRoot: sourcePath } ) )
    .pipe( gulp.dest( destPath ) )
}

gulp.task( 'default', [ 'build' ], shell.task( [ 'tsc -w -p .' ] ) )

gulp.task( 'clean', () => {
  return gulp.src( destPath, { read: false } )
    .pipe( clean() )
} )

gulp.task( 'build', [ 'clean' ], () => {
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

gulp.task( 'pre-test', [ 'ts' ], () => {
  return gulp.src( destJS.concat( [ `!${sourcePath}/**/*.Spec.js` ] ) )
    .pipe( istanbul() )
    .pipe( istanbul.hookRequire() ) // Force `require` to return covered files
} )

gulp.task( 'test', [ 'pre-test' ], () => {
  return runTest()
    .once( 'error', ( err: any ) => {
      console.error( err )
      process.exit( 1 )
    } )
    .once( 'end', () => process.exit() )
} )

gulp.task( 'watch:test', () => {
  return gulp.watch( destTests, batch(( events: any, cb: any ) => {
    return gulp.src( destTests )
      .pipe( mocha( { timeout: 64000 } ) )
  } ) )
} )

gulp.task( 'watch:single-test', () => {
  return gulp.watch( destTests, batch(( events: any, cb: any ) => {
    return events.pipe( mocha( { timeout: 64000 } ) )
  } ) )
} )

gulp.task( 'test-coverage', [ 'pre-test' ], () => {
  return runTest()
    .once( 'error', () => process.exit( 1 ) )
    .pipe( istanbul.writeReports( {
      reporters: [ 'json' ] // this yields a basic non-sourcemapped coverage.json file
    } ) )
} )

gulp.task( 'coverage', [ 'test-coverage' ], () => {
  return gulp.src( './coverage/coverage-final.json' )
    .pipe( remapIstanbul( {
      basePath: '.',
      reports: {
        'html': './coverage',
        'text-summary': null,
        'lcovonly': './coverage/lcov.info'
      }
    } ) )
    .once( 'end', () => process.exit() )
} )
