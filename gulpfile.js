let gulp = require('gulp');
let plumber = require("gulp-plumber");//コンパイルエラーが起きても watch を抜けないようになる
let concat  = require('gulp-concat');
let browserify = require("gulp-browserify");//NodeJSのコードをブラウザ向けコードに変換


// summernoteEditor フィールド を処理
gulp.task('summernoteEditor:js', function(){
	return gulp.src(["./src_gulp/fields/multilang_summernote/summernote.js"])
		.pipe(plumber())
		.pipe(browserify({}))
		.pipe(concat('summernote.js'))
		.pipe(gulp.dest( './px-files/fields/multilang_summernote/' ))
	;
});
gulp.task('summernoteEditor:css', function(){
	return gulp.src(["./src_gulp/fields/multilang_summernote/summernote.css"])
		.pipe(plumber())
		.pipe(concat('summernote.css'))
		.pipe(gulp.dest( './px-files/fields/multilang_summernote/' ))
	;
});


let _tasks = gulp.parallel(
	'summernoteEditor:js',
	'summernoteEditor:css'
);

// src 中のすべての拡張子を監視して処理
gulp.task("watch", function() {
	return gulp.watch(["src_gulp/**/*"], _tasks);
});


// src 中のすべての拡張子を処理(default)
gulp.task("default", _tasks);
