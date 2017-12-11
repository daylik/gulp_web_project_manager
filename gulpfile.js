//===== cmd ======
//gulp
//gulp --name project_name
//buckup --name project_name
//bild

//gulp site --name site_name
//gulp site --name max_pro


// переменные ===================================
var gulp                    = require('gulp'),
    replace                 = require('gulp-replace'),
    jade                    = require('gulp-jade'),
    ftp                     = require('vinyl-ftp'),
    gutil                   = require('gulp-util'),
    zip                     = require('gulp-zip'),
    stylish                 = require('jshint-stylish'),
    uglify                  = require('gulp-uglify'),
    //jshint                = require('gulp-jshint'),
    filter                  = require('gulp-filter'),
    //jade2php              = require('gulp-jade-php'),
    cached                  = require('gulp-cached'),
    concat                  = require('gulp-concat'),
    postcss                 = require('gulp-postcss'),
    rename                  = require('gulp-rename'),
    sourcemaps              = require('gulp-sourcemaps'),
    sass                    = require('gulp-sass'),
    less                    = require('gulp-less'),
    cssFormat               = require('gulp-css-format'),
    postcss_sass            = require('postcss-sass'),
    cssnano                 = require('cssnano'),
    browserSync_localhost   = require('browser-sync').create(),
    browserSync_proxy       = require('browser-sync').create(),
    mainBowerFiles          = require('main-bower-files'),
    imagemin                = require('gulp-imagemin'),
    replace_task            = require('gulp-replace-task'),
    args                    = require('yargs').argv,
    del                     = require('del'),   
    node_path               = require('path'),
    newer                   = require('gulp-newer'),
    remember                = require('gulp-remember'),
    autoprefixer            = require('gulp-autoprefixer');
//=== GULP config file
var GULP_config = require('./gulp_config.js');
var SITES = GULP_config.config_ftp;
var ftp_params = GULP_config.ftp_set;

// output files
var v = {};
    v.plugins_js = 'compiled_pack.js';
    v.plugins_css = 'plugins_compiled_pack.css';
    v.scss_to_css = 'style_compiled.css';
    v.autoprefix_browsers_v1 = ['last 12 versions', '> 0.01%'];
    v.autoprefix_browsers_v2 = [
      "Android 2.3",
      "Android >= 4",
      "Chrome >= 20",
      "Firefox >= 24",
      "Explorer >= 8",
      "iOS >= 6",
      "Opera >= 12",
      "Safari >= 6"
    ];
var V_autoprefix_params = { browsers: v.autoprefix_browsers_v2, cascade: false };

// SITES[agrs.site].ftp или SITES[site_name].ftp
// LOCAL[local_project].folder

var LAB_local_folder = 'LAB/LOCAL_projects/';
var LAB_FTP_folder   = 'LAB/FTP_projects/';
var LAB_FTP_plugins  = 'LAB/FTP_plugins/';

var local_project    = args.name || 'app';
var site_name        = args.name || 'max_pro';

var LOCAL = {
    v1: {
        folder: 'verstka_M'
    }
};

var LOCAL_project_PATH = LAB_local_folder + LOCAL[local_project].folder;
//=== Задания ===================================

gulp.task('task_browserSync_localhost', function() {
    browserSync_localhost.init({
        server: {
            baseDir: './'+ LOCAL_project_PATH +'/public'
        }
    })
});

gulp.task('task_browserSyncProxy', function() {
    browserSync_proxy.init({
        proxy: SITES[site_name].url
    });
});


//=== FTP ================================
gulp.task('ftp_send_all', function() {
    var FTP_connect = ftp.create( SITES[site_name].ftp );
    gulp.src( LAB_FTP_folder + SITES[site_name].theme_folder + '/**')
        .pipe( FTP_connect.dest( SITES[site_name].ftp_path ));
});

gulp.task('ftp_send_css', function() {
var FTP_connect = ftp.create( SITES[site_name].ftp );
    gulp.src([ 
        LAB_FTP_folder + SITES[site_name].theme_folder_css + '/*.{css,scss,sass,less}', 
        LAB_FTP_folder + SITES[site_name].local_folder_css + '/*.{scss,sass,less}'
        ])
        //.pipe( newer(SITES[site_name].theme_folder_css ))
        .pipe( FTP_connect.dest( SITES[site_name].ftp_path + SITES[site_name].ftp_folder.css ));
});

gulp.task('ftp_send_img', function() {
    var FTP_connect = ftp.create( SITES[site_name].ftp );
    gulp.src( LAB_FTP_folder + SITES[site_name].theme_folder_img + '/*', { buffer: false })
        .pipe( newer( LAB_FTP_folder + SITES[site_name].theme_folder_img ))
        .pipe( FTP_connect.newer( SITES[site_name].ftp_path + SITES[site_name].ftp_folder.img ));
});

gulp.task('ftp_plugins_send_all', function() {
    var FTP_connect = ftp.create( SITES[site_name].ftp );
    gulp.src( LAB_FTP_folder + SITES[site_name].local_folder_plugins + '/**')
        .pipe( FTP_connect.dest( SITES[site_name].ftp_plugins_path ));
});

//=== JADE ============================
gulp.task('jade', function() {
    return gulp.src( LOCAL_project_PATH + '/jade/**/*.jade')
        .pipe(jade({ pretty: true }))
        .pipe(gulp.dest( LOCAL_project_PATH ))
        .pipe(browserSync_localhost.reload({ stream: true }));
});

gulp.task('html', function() {
    return gulp.src( LOCAL_project_PATH + '/source/**/*.html')
        .pipe(gulp.dest( LOCAL_project_PATH +'/public' ))
        .pipe(browserSync_localhost.reload({ stream: true }));
});

gulp.task('jade_php', function() {
    return gulp.src( LAB_FTP_folder + SITES[site_name].theme_folder + '/**/*.jade')
        //.pipe(jade({  locals: { title: 'jade_php' }, pretty:true }))
        .pipe(jade({ pretty: true }))
        .pipe(rename({ extname: ".php" }))
        .pipe(gulp.dest( SITES[site_name].theme_folder )); //.pipe(browserSync_localhost.reload({   stream: true }));
});

//=== BOWER ===========================
gulp.task('vendor', function() {
    return gulp.src(mainBowerFiles())
        .pipe(filter('**/*.js'))
        //.pipe(jshint())
        //.pipe(jshint.reporter(stylish))
        //.pipe(uglify())
        .pipe(concat(v.plugins_js))
        .pipe(gulp.dest( LOCAL[local_project].folder + '/js'));
    //.pipe(browserSync_localhost.reload({  stream: true }));
});

gulp.task('js', function() {
    return gulp.src( LOCAL_project_PATH + '/source/js/*.js')
        //.pipe(jshint())
        //.pipe(jshint.reporter(stylish))
        //.pipe(uglify())
    //.pipe(concat(v.plugins_js))
    .pipe(gulp.dest( LOCAL_project_PATH + '/public/js'))
    .pipe(browserSync_localhost.reload({ stream: true }));
});

gulp.task('vendor_css', function() {
    return gulp.src(mainBowerFiles())
        .pipe(filter('**/*.css'))
        //.pipe(cssnano())
        .pipe(concat(v.plugins_css))
        .pipe(gulp.dest( LOCAL[local_project].folder + '/css'));
    //.pipe(browserSync_localhost.reload({  stream: true }));
});

// console_log functions
gulp.task('bower_files', function() {
    console.log(mainBowerFiles('**/*.js'));
    console.log('===== css =====');
    console.log(mainBowerFiles('**/*.css'));
});

//=== SCSS, SASS, POSTCSS > CSS ============
gulp.task('local_scss', function() {
    var processors = [
        //autoprefixer( V_autoprefix_params ),
        //postcss_sass(),
        autoprefixer()
        //, cssnano()
    ];
    return gulp.src( LOCAL_project_PATH + '/source/css/*.{sass,scss}')
        .pipe(sass({
            outputStyle: 'nested', //nested | compresed | compact
            //includePaths: ['node_modules/susy/sass']
        }).on('error', sass.logError))
        //.pipe(postcss( processors ))
        .pipe(rename(v.scss_to_css))
        .pipe(gulp.dest( LOCAL_project_PATH + '/public/css'))
        .pipe(browserSync_localhost.reload({ stream: true }));
});

gulp.task('local_css', function() {
    var processors = [
        //autoprefixer( V_autoprefix_params ),
        //postcss_sass(),
        autoprefixer()
        //, cssnano()
    ];
    return gulp.src( LOCAL_project_PATH + '/source/css/*.css')
        .pipe(gulp.dest( LOCAL_project_PATH + '/public/css'))
        .pipe(browserSync_localhost.reload({ stream: true }));
});


gulp.task('remote_css', function(done) {
    var processors = [
        autoprefixer( V_autoprefix_params ),
        //postcss_sass(),
        //autoprefixer()
        //, cssnano()
    ];

    var SOURCE_css_path = LAB_FTP_folder + SITES[site_name].local_folder_css;
    var PUBLIC_css_path = LAB_FTP_folder + SITES[site_name].theme_folder_css;

    gulp.src( SOURCE_css_path + '/*.{sass,scss}')
        //.pipe(sourcemaps.init())
        //.pipe( newer(SITES[site_name].local_folder_css ))
        .pipe(cached('remote_css'))
        .pipe(sass({
            outputStyle: 'compact', //nested | compresed | compact
            //includePaths: ['node_modules/susy/sass']
        }).on('error', sass.logError))
        .pipe(autoprefixer( V_autoprefix_params ))
        //.pipe(postcss( processors ))
        //.pipe(cssFormat({ indent: 1, hasSpace: true }))
         //.pipe(replace(/[;]/g, '; '))
        //.pipe(replace(/(\;[\s]+\})/g, '; }'))
        
        .pipe(replace(/\}[\n]{1}/g, '}'))
        .pipe(replace(/(\,\s\.)/g, ',\n.'))
        .pipe(replace(/(\,\s\#)/g, ',\n#'))
        //.pipe(replace(/(\})/g, '\n}'))
        .pipe(sourcemaps.write('.'))
        .pipe(rename({ extname: ".css" }))
        .pipe(gulp.dest( PUBLIC_css_path ))
        ;//.pipe(browserSync_proxy.reload({ stream: true }));

    //=== min.css
    gulp.src( SOURCE_css_path + '/*.{sass,scss}')
        .pipe(sass({
          outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(autoprefixer( V_autoprefix_params ))
        //.pipe(postcss( processors ))
        //.pipe(remember('remote_css'))
        .pipe(rename({ extname: ".min.css" }))
        .pipe(gulp.dest( PUBLIC_css_path ));

    //=== LESS
    gulp.src( SOURCE_css_path + '/*.less')
        .pipe(less(autoprefixer( V_autoprefix_params )))
        //.pipe(postcss( processors ))
        //.pipe(rename( 'style.css' ))
        .pipe(gulp.dest( PUBLIC_css_path )); //.pipe(browserSync_proxy.reload({ stream: true }));
    done();
});

gulp.task('remote_plugins_css', function(done) {
    var processors = [
        autoprefixer( V_autoprefix_params ),
        //postcss_sass(),
        //autoprefixer()
        //, cssnano()
    ];
    var LOCAL_plugin_path = LAB_FTP_plugins + SITES[site_name].local_folder_plugins;

    gulp.src( LOCAL_plugin_path + '/source/*.{sass,scss}')
        //.pipe(sourcemaps.init())
        //.pipe( newer(SITES[site_name].local_folder_css ))
        .pipe(cached('remote_css'))
        .pipe(sass({
            outputStyle: 'compact', //nested | compresed | compact
            //includePaths: ['node_modules/susy/sass']
        }).on('error', sass.logError))
        .pipe(autoprefixer( V_autoprefix_params ))
        //.pipe(postcss( processors ))
        //.pipe(cssFormat({ indent: 1, hasSpace: true }))
         //.pipe(replace(/[;]/g, '; '))
        //.pipe(replace(/(\;[\s]+\})/g, '; }'))
        
        .pipe(replace(/\}[\n]{1}/g, '}'))
        .pipe(replace(/(\,\s\.)/g, ',\n.'))
        .pipe(replace(/(\,\s\#)/g, ',\n#'))
        //.pipe(replace(/(\})/g, '\n}'))
        .pipe(sourcemaps.write('.'))
        .pipe(rename({ extname: ".css" }))
        .pipe(gulp.dest( LOCAL_plugin_path +'/public' ))
        ;//.pipe(browserSync_proxy.reload({ stream: true }));

    //=== min.css
    gulp.src( LOCAL_plugin_path + '/source/*.{sass,scss}')
        .pipe(sass({
          outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(autoprefixer( V_autoprefix_params ))
        //.pipe(postcss( processors ))
        //.pipe(remember('remote_css'))
        .pipe(rename({ extname: ".min.css" }))
        .pipe(gulp.dest( LOCAL_plugin_path +'/public' ));

    //=== LESS
    gulp.src( LOCAL_plugin_path + '/source/*.less')
        .pipe(less(autoprefixer( V_autoprefix_params )))
        //.pipe(postcss( processors ))
        //.pipe(rename( 'style.css' ))
        .pipe(gulp.dest( LOCAL_plugin_path +'/public')); //.pipe(browserSync_proxy.reload({ stream: true }));
    done();
});


//=== IMG min ==============================
gulp.task('imagemin', function() {
    return gulp.src( LAB_FTP_folder + SITES[site_name].local_folder_img + '/**')
        .pipe(newer( LAB_FTP_folder + SITES[site_name].theme_folder_img ))
        .pipe(imagemin())
        .pipe(gulp.dest( LAB_FTP_folder + SITES[site_name].theme_folder_img ))
        ; //.pipe(browserSync_proxy.reload({ stream: true }));
});

//=== BACKUP FOLDER ======================  //gulp backup --name max_pro
gulp.task('backup', function() {
    gulp.src([ LAB_FTP_folder + SITES[site_name].local_folder + '/**/*'])
        .pipe(gulp.dest( LAB_FTP_folder + SITES[site_name].local_folder + '_BACKUP'));
});

//=== BILD for new BLANK
gulp.task('bild', function(done) {
    
    var Latest_path = 'BILDS/LATEST_BLANK_BILD';

    gulp.task('clean_bild', function() {
        return del(Latest_path); 
    });

    //gulp.src(['LAB/LOCAL_projects/app/**/*.{js,scss,sass,jade,jpg,png,gif,svg}'])
    //    .pipe(gulp.dest('BILDS/LATEST_BLANK_BILD/app'));

    gulp.src(['LAB/FTP_plugins/new_plugin_name/**/*'])
        .pipe(gulp.dest(Latest_path + '/LAB/FTP_plugins/new_plugin_name'));

        gulp.src(['LAB/FTP_projects/new_project_name/**/*'])
        .pipe(gulp.dest(Latest_path + '/LAB/FTP_projects/new_project_name'));

    gulp.src(['LAB/LOCAL_projects/new_project_name/**/*'])
        .pipe(gulp.dest(Latest_path + '/LAB/LOCAL_projects/new_project_name'));

    gulp.src(['includes/**/*'])
        .pipe(gulp.dest(Latest_path + '/includes'));

    gulp.src(['bower.json', 'gulpfile.js', 'package.json', 'BLANK_gulp_config.js'])
        .pipe(gulp.dest(Latest_path));

    gulp.src(['BLANK_gulp_config.js'])
        .pipe(rename('gulp_config.js'))
        .pipe(gulp.dest(Latest_path));

    gulp.src(['*.bat']).pipe(gulp.dest(Latest_path));
    // all folder to zip
    gulp.src(['BILDS/LATEST_BLANK_BILD/*', '!BILDS/LATEST_BLANK_BILD/*.zip'])
        .pipe(zip('latest_bild_BLANK_GULP.zip'))
        .pipe(gulp.dest('BILDS'));
    done();
});

//=== CMD: gulp
gulp.task('default', [
    'vendor', 
    'vendor_css', 
    'task_browserSync_localhost', 
    'local_scss', 
    'local_css', 
    'jade', 
    'html', 
    'js'
    ], function(){
    
    gulp.watch( LOCAL_project_PATH + '/source/css/**/*.css',  ['local_css']); 
    gulp.watch( LOCAL_project_PATH + '/source/css/**/*.s*ss', ['local_scss']);
    gulp.watch( LOCAL_project_PATH + '/source/jade/**/*.jade', ['jade']); 
    gulp.watch( LOCAL_project_PATH + '/source/**/*.html',     ['html']);
    gulp.watch( LOCAL_project_PATH + '/source/js/*.js',       ['js']);

    //gulp.watch('app/*.html', browserSync.reload({stream: true}));
});

var reload_timer = 0;
gulp.task('browser_reload', function(){
    reload_timer++;
    if( reload_timer == 1 ){
        browserSync_proxy.reload();
        setTimeout(function(){
            reload_timer = 0;
        }, 1000);
    }
});

var browser_reload_func = function(){
      reload_timer++;
    if( reload_timer < 1 ){
        browserSync_proxy.reload();
        setTimeout(function(){
            reload_timer = 0;
        }, 1000);
    }
};

//==== gulp site --name site_name
gulp.task('site', [
    'remote_css', 
    'jade_php', 
    'imagemin', 
    'task_browserSyncProxy'
    ], function() {

    gulp.watch( LAB_FTP_folder + SITES[site_name].local_folder + '/**/*.jade', ['jade_php']);
    gulp.watch( LAB_FTP_folder + SITES[site_name].local_folder_css + '/*.s*ss', ['remote_css'])
        ;//.on('unlink', function(filepath){ //remember.forget('remote_css', node_path.resolve(filepath));
        //    delete chached.cashes.remote_css[ node_path.resolve(filepath)]; });
    gulp.watch( LAB_FTP_folder + SITES[site_name].theme_folder_css + '/*.{css,scss}', ['ftp_send_css']);
    gulp.watch( LAB_FTP_folder + SITES[site_name].theme_folder_css + '/*.{css,scss}', ['browser_reload']);
    //.on('change', browserSync_proxy.reload);

    gulp.watch( LAB_FTP_folder + SITES[site_name].local_folder_img + '/**', ['imagemin']);
        //.on('change', browserSync_proxy.reload);
        //.on('change', function() { console.log('img changed!'); });
    gulp.watch( LAB_FTP_folder + SITES[site_name].theme_folder_img  + '/**', ['ftp_send_img']);
});


//==== gulp site_plugin --name site_name
gulp.task('site_plugin', ['remote_plugins_css', 'task_browserSyncProxy'], function() {
    var LOCAL_plugin_path_watch = LAB_FTP_folder + SITES[site_name].local_folder_plugins;

    //gulp.watch( LOCAL_plugin_path_watch + '/**/*.jade', ['jade_php']);
    gulp.watch( LOCAL_plugin_path_watch + '/**/*.s*ss', ['remote_plugins_css']); //.on('unlink', function(filepath){ //remember.forget('remote_css', node_path.resolve(filepath));
        //    delete chached.cashes.remote_css[ node_path.resolve(filepath)]; });
    gulp.watch( LOCAL_plugin_path_watch + '/**/*.**', ['ftp_plugins_send_all']);
    gulp.watch( LOCAL_plugin_path_watch + '/**/*.{css,scss,sass,js,php}', ['browser_reload']);
    //.on('change', browserSync_proxy.reload);

    //gulp.watch( LOCAL_plugin_path_watch + '/**', ['imagemin']);
        //.on('change', browserSync_proxy.reload);
        //.on('change', function() { console.log('img changed!'); });
    //gulp.watch( LOCAL_plugin_path_watch  + '/**', ['ftp_send_img']);
});


//===== cmd ======
//gulp
//gulp --name project_name
//buckup --name project_name
//bild

//gulp site --name site_name
//gulp site --name max_pro