module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
        options: {
            banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
            mangle: true,
            compress: true,
            sourceMap: true,
            sourceMapName: 'responsive-picture-show.min.js.map'
        },
        files: {
            'pictureList.min.js': [
                'src/jquery.slides.js',
                'src/jquery.jscrollpane.js',
                'src/jquery.mousewheel.js',
                'src/mwheelIntent.js',
                'src/pictureListShow.js'
            ]
        },
        dist: {
            src: 'responsive-picture-show.js',
            dest: 'responsive-picture-show.min.js'
        }
    },
      concat: {
          options: {
            separator: ';'
          },
            dist: {
                src: [
                    'src/jquery.slides.js',
                    'src/jquery.jscrollpane.js',
                    'src/jquery.mousewheel.js',
                    'src/mwheelIntent.js',
                    'src/pictureListShow.js'
                ],
                dest: 'responsive-picture-show.js'
            }
    }
//      'jsmin-sourcemap': {
//          all: {
//              src:  [ 'pictureListShow.js'],
//              dest: 'pictureList.min.js',
//              destMap: 'pictureListShow.min.js.map'
//          }
//      }

  });

//    grunt.initConfig({
//        pkg: grunt.file.readJSON('package.json'),
//        'jsmin-sourcemap': {
//            all: {
//                src:  [ 'src/jquery.slides.js','src/jquery.jscrollpane.js','src/jquery.mousewheel.js','src/mwheelIntent.js','src/pictureListShow.js'],
//                dest: 'pictureListShow.min.js',
//                destMap: 'pictureListShow.js.map'
//            }
//        }
//    });

//    grunt.registerTask('default', ['jsmin-sourcemap']);
   grunt.loadNpmTasks('grunt-contrib-uglify');
   grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-jsmin-sourcemap');

  grunt.registerTask('default', [ 'concat','uglify']);
    grunt.registerTask('map', [ 'jsmin-sourcemap']);
};