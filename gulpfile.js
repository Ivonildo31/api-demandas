var gulp = require( 'gulp' )
var ts = require( 'gulp-typescript' )
var fs = require( 'fs' )
var moment = require( 'moment' )
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

gulp.task( 'pre-test', [ 'ts' ], function () {
  return gulp.src( destJS.concat( [ `!${sourcePath}/**/*.Spec.js` ] ) )
    .pipe( istanbul() )
    .pipe( istanbul.hookRequire() ) // Force `require` to return covered files
} )

gulp.task( 'test', [ 'pre-test' ], function () {
  return runTest()
    .once( 'error', ( err ) => {
      console.error( err )
      process.exit( 1 )
    } )
    .once( 'end', () => process.exit() )
} )

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

gulp.task( 'feedback', function () {
  let listDemands = []
  fs.readFile( 'feedback.json', 'utf8', function ( err, data ) {
    a = JSON.parse( data )
    a = a.map( function ( value ) {
      let payload = value.payload
      return {
        tipo: getTypeDemand( value.type ),
        criadoEm: moment( value.createdAt ).format( 'DD/MM/YYYY HH:mm:ss' ),
        hora: payload.date ? moment( value.createdAt.substring( 0, 11 ) + payload.date.substring( 11 ) ).format( 'HH:mm' ) : '',
        linha: payload.line ? `${payload.line}` : '',
        ponto: payload.stop ? `${payload.stop}` : '',
        descricao: payload.text ? `${payload.text.replace( '\n', ' ' )}` : '',
        usuario: payload.user ? `${getUser( payload.user )}` : ''
      }
    } )

    let csvJson = ''
    for ( var property in a[ 0 ] ) {
      if ( a[ 0 ].hasOwnProperty( property ) ) {
        csvJson += '' + property + ';'
      }
    }
    csvJson += '\n'
    csvJson += a.map( function ( value ) {
      let row = ''
      for ( var property in value ) {
        if ( value.hasOwnProperty( property ) ) {
          row += value[ property ] + ';'
        }
      }
      return row + '\n'
    } )

    fs.writeFile( 'feedback.csv', csvJson, function ( err ) {
      if ( err ) {
        console.error( err )
      }
    } )
  } )
} )

var getTypeDemand = function ( type ) {
  switch ( type ) {
    case 0: return 'Linha nao aparece'
    case 1: return 'Localizacao errada'
    case 2: return 'Erro no horario'
    case 3: return 'Erro na previsao'
    default: return 'Outro problema'
  }
}

const getUser = function ( user ) {
  if ( user.anonymous ) {
    return 'usuario anonimo'
  } else {
    return `nome: ${user.nome} email: ${user.email}`
  }
}