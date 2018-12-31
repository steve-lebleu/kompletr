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
					"dist/js/jquery.kompleter.min.js": [
						'src/js/jquery.kompleter.js'
					],
					"demo/js/jquery.kompleter.min.js": [
						'src/js/jquery.kompleter.js'
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
					'src/js/kompleter.js'
				],
				dest: 'dist/js/app.js'
			}
		},
		sass: {                              // Task
			dist: {                            // Target
				options: {                       // Target options
					style: 'expanded'
				},
				files: {                         							
					'dist/css/kompleter.css': [ 'src/sass/kompleter.scss' ],
					'demo/css/demo.css': [ 'src/sass/demo.scss' ],
				}
			}
		},
		less: {
			main: {
				options: {
					paths: ["src/less/"]
				},
				files: {
					"dist/css/kompleter.css": "src/less/main.less",
					"demo/css/kompleter.css": "src/less/main.less",
					"demo/css/demo.css": "src/less/demo.less"
				}
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
						'src/css/kompleter.min.css': ['src/css/kompleter.css']
					}
				}
			}
		},
		sprity: {
			options: {
				'cssPath': 'assets/img/logos/',
				'processor': 'css',
				'orientation': 'binary-tree',
				'margin': 5,
				'prefix': 'spr'
			},
			sprite: {
				src: ['assets/img/logos/*'],
				dest: 'assets/img/logos/sprite'
			},
			base64: {
				options: {
					'base64': true
				},
				src: ['assets/img/logos/*'],
				dest: 'assets/css/base64.css'
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
	grunt.loadNpmTasks('grunt-sass');

	grunt.registerTask('default', ['watch']);
	grunt.registerTask('dev', ['watch']);
};