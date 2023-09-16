let mix = require('laravel-mix');

mix.js('resources/js/app.js', 'Public/js/app.js').sass('resources/scss/app.scss','Public/css/app.css');