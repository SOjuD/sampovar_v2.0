var gulp       = require('gulp'), 
	sass         = require('gulp-sass'), 
	browserSync  = require('browser-sync'), 
	concat       = require('gulp-concat'), 
	uglify       = require('gulp-uglifyjs'), 
	cssnano      = require('gulp-cssnano'), 
	rename       = require('gulp-rename'), 
	del          = require('del'), 
	imagemin     = require('gulp-imagemin'), 
	pngquant     = require('imagemin-pngquant'), 
	cache        = require('gulp-cache'), 
	autoprefixer = require('gulp-autoprefixer');
	notify         = require("gulp-notify"),
	imageminJpegRecompress = require('imagemin-jpeg-recompress'),
	responsive             = require('gulp-responsive'),
	pug = require('gulp-pug'),
	csso                   = require('gulp-csso'),
	plumber = require('gulp-plumber')
	

gulp.task('sass', function(){ 
	return gulp.src('app/sass/**/*.sass') 
		.pipe(sass({outputStyle: 'expand'}).on("error", notify.onError()))
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) 
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({stream: true})) 
});

gulp.task('pug', function() {
	return gulp.src("app/pug/*.pug")
	.pipe(plumber({
		errorHandler: notify.onError(function(err){
			  return {
					title: 'Pug',
					message: err.message
			  }
		})
  }))
		.pipe(pug({ pretty: true}))
		.pipe(gulp.dest('./app'))
		.pipe(browserSync.reload({stream: true}))
  });

gulp.task('browser-sync', function() { 
	browserSync({
		server: { 
			baseDir: 'app' 
		},
		open: false,
		notify: false 
	});
});

gulp.task('scripts', function() {
	return gulp.src([ // Берем все необходимые библиотеки
        'app/libs/jquery/jquery.min.js',                                  // Берем jQuery
        // 'app/libs/paroller/jquery.paroller.min.js',                             // Берём Paroller
        // 'app/libs/aos-master/dist/aos.js',                                      // Берём плавную анимацию при скролле
        'app/libs/jquery.maskedinput-master/dist/jquery.maskedinput.min.js',    // Берём маску InpuWt
        // 'app/libs/lightGallery/lightgallery-all.full.min.js',            // Берем light gallery
        //      'app/libs/owl-carousel/owl.carousel.min.js',                    // Берем owl-carousel
        // 'app/libs/Swiper-master/dist/js/swiper.min.js',                         // Берем Swiper-master слайдер
        //  'app/libs/twentytwenty-master/js/jquery.event.move.js',       // До и после
        //  'app/libs/twentytwenty-master/js/jquery.twentytwenty.js',     // До и после
                // 'app/libs/Scroll/scroll.min.js',                                // Берем плавный scroll
        //        'app/libs/jquery-easing/jquery.easing.min.js'                 // Анимация easing
        //        'app/libs/wb-stickylayer/wb.stickylayer.min.js',              // Гонялка по экрану
        // 'app/libs/materialize/dist/js/materialize.min.js',                      // materialize
		])
		.pipe(concat('libs.min.js')) 
		.pipe(uglify()) 
		.pipe(gulp.dest('app/js')); 
});

gulp.task('watch', ['browser-sync', 'pug', 'scripts'], function() {
	gulp.watch('app/sass/**/*.sass', ['sass']); 
	gulp.watch('app/pug/**/*.pug', ['pug']);
	gulp.watch('app/*.html', browserSync.reload);
	gulp.watch('app/js/**/*.js', browserSync.reload);  
});

gulp.task('clean', function() {
	return del.sync('dist'); 
});


gulp.task('imagemin', function() {
	return gulp.src('app/img/**/*')
	.pipe(imagemin([
		imagemin.gifsicle({interlaced: true}),
		imagemin.jpegtran({progressive: true}),
		imageminJpegRecompress({
		  loops: 5,
		  min: 70,
		  max: 80,
		  quality:'high',
			progressive: true,
			method:'ssim'
		}),
		imagemin.svgo(),
		imagemin.optipng({optimizationLevel: 3}),
		pngquant({quality: '70-80', speed: 1})
	  ],{
		verbose: true
	  }))
		  .pipe(gulp.dest('dist/img'));
});



//img-compressor 
gulp.task('goimg', function() {
	return gulp.src('img-compressor/**/*.*') // Берем все изображения из app
		.pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.jpegtran({progressive: true}),
      imageminJpegRecompress({
        loops: 5,
        min: 70,
        max: 80,
        quality:'high',
          progressive: true,
          method:'ssim'
      }),
      imagemin.svgo(),
      imagemin.optipng({optimizationLevel: 3}),
      pngquant({quality: '80-90', speed: 1})
    ],{
      verbose: true
    }))
		.pipe(gulp.dest('img-compressor/ok')); // Выгружаем на продакшен
});





gulp.task('gominjs', function(){
	var buildCommonJs = gulp.src('app/js/common.js')
	.pipe(uglify()) 
	.pipe(gulp.dest('dist/js'))
});



gulp.task('gomincss', function(){
	var buildCss = gulp.src([ 
		'app/css/main.css',
		'app/css/libs.min.css'
		])
	.pipe(csso()) 
	.pipe(gulp.dest('dist/css'))
});

//img resize
gulp.task('gores', function () {
	return gulp.src('img-compressor/*.*')
	  .pipe(responsive({
		'*.*': {
		  width: 372,
		  height: 372,
		  quality: 70
		}
	   }))
	   .pipe(rename({suffix: '-min'}))
	  
	  .pipe(gulp.dest('img-compressor/thumb/'));
  });
  

gulp.task('build', ['clean', 'imagemin', 'sass', 'scripts'], function() {

	var buildCss = gulp.src([ 
		'app/css/main.css',
		'app/css/libs.min.css'
		])
	.pipe(csso()) 
	.pipe(gulp.dest('dist/css'))
	

	var buildFonts = gulp.src('app/fonts/**/*') 
	.pipe(gulp.dest('dist/fonts'))


	var builLibsdJs = gulp.src('app/js/libs.min.js')
	.pipe(gulp.dest('dist/js'))
    
	var buildCommonJs = gulp.src('app/js/common.js')
	.pipe(uglify()) 
	.pipe(gulp.dest('dist/js'))

	var buildHtml = gulp.src('app/*.html') 
	.pipe(gulp.dest('dist'));

});

gulp.task('clear', function (callback) {
	return cache.clearAll();
})

gulp.task('default', ['watch']);
