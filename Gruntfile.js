module.exports = function(grunt) {

	grunt.initConfig({
		uglify: {
			all: {
				options: {
					mangle: true,
					sourceMap: true,
					sourceMapName: 'dist/js/sourcemap.map'
				},
				files: {
					"dist/js/jquery.completer.min.js": [
						'src/js/jquery.completer.js'
					]
				}
			}
		},
		concat: {
			options: {
				separator: ';'
			},
			scripts: {
				src: [
					'src/vendors/jquery/dist/jquery.min.js',
					'src/js/completer.js'
				],
				dest: 'dist/js/app.js'
			}
		},
		less: {
			main: {
				options: {
					paths: ["src/less/"]
				},
				files: {
					"src/dist/css/completer.css": "src/less/main.less",
					"src/demo/css/completer.css": "src/less/main.less"
				}
			}
		},
		watch: {
			styles: {
				files: [
					'src/less/*.less'
				],
				tasks: ['less'],
				options: {
					spawn: false
				}
			},
			scripts: {
				files: [
					'src/js/**/*.js'
				],
				tasks: ['concat:scripts']
			}
		},
		cssmin: {
			main: {
				options: {
					shorthandCompacting: false,
					roundingPrecision: -1
				},
				target: {
					files: {
						'src/css/completer.min.css': ['src/css/completer.css']
					}
				}
			}
		},
		jshint: {
			options: {
				curly: true,
				eqeqeq: true,
				eqnull: true,
				browser: true,
				globals: {
					jQuery: true
				}
			},
			uses_defaults: [
				'src/js/*.js'
			],
			with_overrides: {
				options: {
					curly: false,
					undef: true
				},
				files: {
					src: [
						'src/js/*.js'
					]
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['watch']);
	grunt.registerTask('dev', ['watch']);
};