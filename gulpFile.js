'use strict'
const { src, dest, parallel,watch } = require('gulp');

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

function css() {
    return src('./development/sass/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            errorLogToConsole: true,
            // outputStyle: 'compressed'
        }))
        .on('error', console.error.bind(console))
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(dest('./prodaction/css/'))
        .pipe(minifyCSS())
        .pipe(rename({ suffix: '.min' }))
        // .pipe(rev())
        .pipe(sourcemaps.write())
        .pipe(dest('./prodaction/css/'))
        // .pipe(rev.manifest())
        // .pipe(dest('development/manifest/css/'))
        .pipe(browserSync.stream());
}

exports.css = css;


function js() {
    return src('./development/js/**/*.js')
        .pipe(concat('all.js'))
        .pipe(dest('./prodaction/js/'))
        .pipe(rename({ suffix: '.min' }))
        // .pipe(rev())
        .pipe(uglify())

        .pipe(dest('./prodaction/js/'))
        // .pipe(rev.manifest())
        // .pipe(dest('development/manifest/js/'))
        .pipe(browserSync.stream())

}

exports.js = js;

function img() {
    return src('./development/images/**/*')
        .pipe(imagemin([
            imagemin.gifsicle({ interlaced: true }),
            imagemin.jpegtran({ progressive: true }),
            imagemin.optipng({ optimizationLevel: 5 }),
            imagemin.svgo({
                plugins: [
                    { removeViewBox: true },
                    { cleanupIDs: false }
                ]
            })
        ]))
        .pipe(dest('./prodaction/images/'))

}

exports.img = img;




function html() {

    return src('./development/*.html')
        .pipe(rigger())
        .pipe(wiredep({
            directory: "development/bower_components/main"

        }))
        .pipe(dest('./prodaction'))
        .pipe(browserSync.stream());

}

exports.html = html;



// function revCollectorHtml() {

//     return src(['development/manifest/**/*.json', 'development/templates/**/*.html'])
//         .pipe(revCollector({
//             replaceReved: true
//         }))

//         .pipe(dest('./development/templates'));

// }

// exports.revCollectorHtml = revCollectorHtml;

// function cleaner() {
//     return through.obj(function(file, enc, cb){
//         rimraf( path.resolve( (file.cwd || process.cwd()), file.path), function (err) {
//             if (err) {
//                 this.emit('error', new gutil.PluginError('Cleanup old files', err));
//             }
//             this.push(file);
//             cb();
//         }.bind(this));
//     });
// }



// function cleanProcessing() {
//     return src( ['./prodaction/css/*.*'], {read: false})
//         .pipe( revOutdated(1) ) // leave 1 latest asset file for every file name prefix.
//         .pipe( cleaner() )
// }

// exports.cleanProcessing = cleanProcessing;






function watcher() {
    browserSync.init({
        server: {
            baseDir: "./prodaction"
        },
        port: 3000
    });
    watch("./development/sass/**/*",css);
    watch("./development/js/**/*",js);
    watch("./development/images/**/*",img);
    watch("./development/*.html",html);
    // gulp.watch('bower.json',bowerProcessing);

}

exports.watcher = watcher;




exports.default = parallel(css,js,img,html,watcher);


// gulp.task('default', gulp.parallel('build', 'watcher'));

// function bowerProcessing(callback) {
//     gulp.src( 'prodaction/template/*.html')
//         .pipe(wiredep({
//         directory:"development/bower_components"
//       }))
//       .pipe(gulp.dest('development/template'));
//     callback();
// }

// gulp.task(bowerProcessing);