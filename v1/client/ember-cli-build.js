/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                           Copyright 2016 Chuan Ji                         *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/*jshint node:true*/
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var Funnel = require('broccoli-funnel');
var asciidocToHtml = require('broccoli-asciidoc');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    fingerprint: {
      exclude: [
        'assets/ace-editor',
        'assets/highlightjs',
        'assets/asciidoctor.js/css'
      ]
    }
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  app.import(
    'bower_components/bootstrap-sass/assets/javascripts/bootstrap.js',
    { type: 'vendor' });
  var bootstrapFonts = new Funnel(
    'bower_components/bootstrap-sass/assets/fonts/bootstrap',
    { destDir: '/fonts' });
  app.import(
    'bower_components/jquery-ui/jquery-ui.js',
    { type: 'vendor' });
  app.import(
    'bower_components/dropbox/dropbox.js',
    { type: 'vendor' });
  app.import(
    'bower_components/js-cookie/src/js.cookie.js',
    { type: 'vendor' });
  app.import(
    'bower_components/js-base64/base64.js',
    { type: 'vendor' });
  app.import(
    'bower_components/seiyria-bootstrap-slider/dist/bootstrap-slider.js',
    { type: 'vendor' });
  app.import(
    'bower_components/seiyria-bootstrap-slider/dist/css/bootstrap-slider.css',
    { type: 'vendor' });

  // asciidoctor.js, js-beautify and highlight.js are both used by the Web
  // Worker compiler thread, so they must be exported separately. We also need
  // to import them into the main app in case web workers aren't supported.
  var asciidoctor = new Funnel(
    'bower_components/asciidoctor.js/dist',
    {
      destDir: '/assets/asciidoctor.js',
      files: ['asciidoctor-all.min.js', 'css/asciidoctor.css']
    });
  app.import(
    'bower_components/asciidoctor.js/dist/asciidoctor-all.js',
    { type: 'vendor' });

  var highlightjs = new Funnel(
    'bower_components/highlightjs',
    {
      destDir: '/assets/highlightjs',
      files: ['highlight.pack.min.js']
    });
  app.import(
    'bower_components/highlightjs/highlight.pack.min.js',
    { type: 'vendor' });
  var highlightjsStyles = new Funnel(
    'bower_components/highlightjs/styles',
    { destDir: '/assets/highlightjs' });

  var jsBeautify = new Funnel(
    'bower_components/js-beautify/js/lib',
    {
      destDir: '/assets/js-beautify',
      files: ['beautify-html.js']
    });
  app.import(
    'bower_components/js-beautify/js/lib/beautify-html.js',
    { type: 'vendor' });

  var workers = new Funnel(
    'workers',
    { destDir: '/assets/workers' });

  var aceEditor = new Funnel(
    'bower_components/ace-builds/src-min-noconflict',
    { destDir: '/assets/ace-editor' });

  var asciidocHtmlAssets = new Funnel(
    asciidocToHtml('public/assets'),
    { destDir: '/assets' });

  return app.toTree([
    bootstrapFonts,
    asciidoctor,
    aceEditor,
    highlightjs,
    highlightjsStyles,
    jsBeautify,
    workers,
    asciidocHtmlAssets
  ]);
};
