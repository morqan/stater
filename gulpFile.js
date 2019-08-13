'use strict'

const gulp = require('gulp');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const minifyCSS = require('gulp-minify-css');
const imagemin = require('gulp-imagemin');
const rigger = require('gulp-rigger');
const rev_append = require('gulp-rev-append');
const rev = require('gulp-rev');
const revCollector = require('gulp-rev-collector');
const gutil = require('gulp-util');
const rimraf = require('rimraf');
const revOutdated = require('gulp-rev-outdated');
const path = require('path');
const through = require('through2');
const wiredep = require('wiredep').stream;

const browserSync = require('browser-sync').create();





function cssProcessing(callback){
    
    gulp.src('./development/sass/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
        errorLogToConsole:true,
        // outputStyle: 'compressed'
    }))
    .on('error',console.error.bind(console))
    .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
    .pipe(gulp.dest('./prodaction/css/'))
    .pipe(minifyCSS())
    .pipe(rename({suffix: '.min'}))
    .pipe(rev())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./prodaction/css/'))
    .pipe( rev.manifest() )
    .pipe( gulp.dest( 'development/manifest/css/' ))
    .pipe(browserSync.stream());
     
    callback();
}

gulp.task(cssProcessing);

function jsProcessing(callback){
    gulp.src('./development/js/**/*.js')
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./prodaction/js/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(rev())
    .pipe(uglify())
    
    .pipe(gulp.dest('./prodaction/js/'))
    .pipe( rev.manifest() )
    .pipe( gulp.dest( 'development/manifest/js/' ))
    .pipe(browserSync.stream());
    callback();
}

gulp.task(jsProcessing);



// gulp.task('revCollector', function () {
//     return gulp.src(['development/manifest/**/*.json', 'development/templates/**/*.html'])
//         .pipe( revCollector({
//             replaceReved: true
//         }))
     
//         .pipe( gulp.dest('dist') );
// });



function imageProcessing(callback){
    gulp.src('./development/images/**/*')
    .pipe(imagemin([
        imagemin.gifsicle({interlaced: true}),
        imagemin.jpegtran({progressive: true}),
        imagemin.optipng({optimizationLevel: 5}),
        imagemin.svgo({
            plugins: [
                {removeViewBox: true},
                {cleanupIDs: false}
            ]
        })
    ]))
    .pipe(gulp.dest('./prodaction/images/'))

    callback();
}

gulp.task(imageProcessing);

function htmlProcessing(callback){

    gulp.src(['development/manifest/**/*.json', 'development/template/*.html'])
    .pipe( revCollector({
        replaceReved: true
    
    }))
    .pipe( gulp.dest('development/template') )

    gulp.src('./development/*.html')
    .pipe(rigger())
    .pipe(wiredep({
        directory:"development/bower_components/main"
       
      }))
    .pipe(gulp.dest('./prodaction'))
    .pipe(browserSync.stream());
    callback();
}

gulp.task(htmlProcessing);


function cleaner() {
    return through.obj(function(file, enc, cb){
        rimraf( path.resolve( (file.cwd || process.cwd()), file.path), function (err) {
            if (err) {
                this.emit('error', new gutil.PluginError('Cleanup old files', err));
            }
            this.push(file);
            cb();
        }.bind(this));
    });
}

function cleanProcessing(callback) {
    gulp.src( ['./prodaction/css/*.*'], {read: false})
        .pipe( revOutdated(1) ) // leave 1 latest asset file for every file name prefix.
        .pipe( cleaner() )

    callback();
}

gulp.task(cleanProcessing);

function bowerProcessing(callback) {
    gulp.src( 'prodaction/template/*.html')
        .pipe(wiredep({
        directory:"development/bower_components"
      }))
      .pipe(gulp.dest('development/template'));
    callback();
}

gulp.task(bowerProcessing);

function liveServer(callback) {
    browserSync.init({
        server: {
            baseDir:"./prodaction"
        },
        port: 3000
    });
    callback();
}

gulp.task(liveServer);
gulp.task('css', ['cssProcessing', 'htmlProcessing']);
gulp.task('js', ['jsProcessing', 'htmlProcessing']);
// gulp.task(css,gulp.series(cssProcessing,htmlProcessing));
// gulp.task(js,gulp.series(jsProcessing,htmlProcessing));
gulp.task('default', gulp.series(cssProcessing,jsProcessing,imageProcessing,htmlProcessing,bowerProcessing,watchProcessing));
// gulp.task('default', gulp.parallel(liveServer,start));



function watchProcessing(){
    gulp.watch("./development/sass/**/*",cssProcessing);
    gulp.watch("./development/js/**/*",jsProcessing);
    gulp.watch("./development/images/**/*",imageProcessing);
    gulp.watch("./development/*.html",htmlProcessing);
    gulp.watch('bower.json',bowerProcessing);
}

