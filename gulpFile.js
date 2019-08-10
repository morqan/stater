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
    .pipe(uglify())
    .pipe(gulp.dest('./prodaction/js/'))

    callback();
}

gulp.task(jsProcessing);



gulp.task('revCollector', function () {
    return gulp.src(['development/manifest/**/*.json', 'development/templates/**/*.html'])
        .pipe( revCollector({
            replaceReved: true
        }))
     
        .pipe( gulp.dest('dist') );
});

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
    .pipe( revCollector({replaceReved: true}))
    .pipe( gulp.dest('development/template') )

    gulp.src('./development/*.html')
    .pipe(rigger())
    .pipe(gulp.dest('./prodaction/'))

    callback();
}

gulp.task(htmlProcessing);

function cashProcessing(callback){
    gulp.src('./prodaction/index.html')
    .pipe(rev_append())
    .pipe(gulp.dest('./prodaction/'))

    callback();
}

gulp.task(cashProcessing);

  

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

function watchProcessing(){
    gulp.watch("./development/sass/**/*",cssProcessing);
    gulp.watch("./development/js/**/*",jsProcessing);
    gulp.watch("./development/images/**/*",imageProcessing);
    gulp.watch("./development/*.html",htmlProcessing);
}


gulp.task('default', gulp.series(cssProcessing,watchProcessing));

