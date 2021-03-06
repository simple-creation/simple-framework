const gulp = require('gulp');
const babel = require('gulp-babel');
const clean = require('del');
// const ts = require('gulp-typescript');
const less=require('gulp-less');
const merge = require('merge2');

const path = require('path');
const alias = require('gulp-path-alias');

// const tsProject = ts.createProject('./tsconfig.json');
const ESDIR = './es';
const LIBDIR = './lib';

/* eslint-disable */
gulp.task('clean', () => {
    return clean(['lib']);
});

/* eslint-disable */
gulp.task('cleanEs', () => {
    return clean(['es']);
});

function moveLess(dir) {
    return gulp.src('./src/**/*.less').pipe(gulp.dest(dir));
}

function moveAndCompileLess(dir) {
    return gulp.src('./src/**/index.less')
    .pipe(alias({
        paths: {
          '~antd': path.resolve(__dirname, 'node_modules/antd'),
        }
      }))
    .pipe(less({javascriptEnabled: true})).pipe(gulp.dest(dir));
}

// function compileTs() {
//     return tsProject.src()
//         .pipe(tsProject());
// }

function babelConfig(moduleType) {
    return {
        babelrc: false,
        presets: [
            ["@babel/preset-env", { "modules": moduleType }],
            "@babel/preset-react",
        ],
        plugins: [
            "@babel/plugin-proposal-object-rest-spread",
            ["@babel/plugin-proposal-decorators", { "legacy": true }],
            "@babel/plugin-transform-runtime"
            // "@babel/plugin-proposal-class-properties",
            // "@babel/plugin-transform-classes"
        ]
    };
}

// gulp.task('copyLess',()=>{

// })

gulp.task('es', gulp.series('cleanEs', () => {
    // const tsSream = compileTs();
    // const jsStream = tsSream.js.pipe(babel(babelConfig(false))).pipe(gulp.dest(ESDIR));
    // const tsdStream = tsSream.dts
    //     .pipe(gulp.dest(ESDIR));
    // const cssStream = moveLess(ESDIR); // 处理css流
    // return merge(jsStream, tsdStream, cssStream);
  
    const jsStream = gulp.src(["./src/**/*.js","./src/**/*.jsx"]).pipe(babel(babelConfig(false))).pipe(gulp.dest(ESDIR));
    const cssStream = moveLess(ESDIR); // 处理css流
    return merge(jsStream,cssStream);


}));

// 发布打包
gulp.task('lib', gulp.series('clean', () => {
    //   const tsSream =  compileTs();
    //   const jsStream = tsSream.js.pipe(babel(babelConfig('commonjs'))).pipe(gulp.dest(LIBDIR));
    //   const tsdStream = tsSream.dts
    //     .pipe(gulp.dest(LIBDIR));
    //   const cssStream = moveLess(LIBDIR); // 处理css流
    //    return merge(jsStream, tsdStream, cssStream);
    const jsStream = gulp.src(["./src/**/*.js","./src/**/*.jsx"]).pipe(babel(babelConfig('commonjs'))).pipe(gulp.dest(LIBDIR));
    const lessStream = moveLess(LIBDIR); // 处理copy less流
    const cssStream = moveAndCompileLess(LIBDIR); // 处理编译less to css流
    return merge(jsStream, lessStream,cssStream);


}
));

gulp.task('default', gulp.series('lib', 'es'));
