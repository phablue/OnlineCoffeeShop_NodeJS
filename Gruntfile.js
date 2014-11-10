"use strict";

module.exports = function(grunt) {
  require("load-grunt-tasks")(grunt);
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    coffee: {
      compileScripts: {
        expand: true,
        flatten: true,
        cwd: 'public/coffeescripts',
        src: '**/*.coffee',
        dest: 'public/javascripts',
        ext: '.js'
      },
      compileSpecs: {
        expand: true,
        flatten: true,
        cwd: 'spec',
        src: '**/*.coffee',
        dest: 'spec/javascripts',
        ext: '.js'
      }
    },
    connect: {
      server: {
        options: {
          port: 8000,
          protocol: 'https',
          keepalive: true
        }
      }
    }
  });
};
