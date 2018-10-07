# Kebo Code

[![Build Status](https://travis-ci.org/KeboHQ/wp-kebo-code.svg?branch=master)](https://travis-ci.org/KeboHQ/wp-kebo-code)

A lightweight Syntax Highlighter for WordPress. Outputs static HTML. (Gutenberg / WP 5.0 only)

## Why another syntax highlighter?

The existing plugins I found all required external services or JavaScript libraries on the frontend, increasing load times and using browser resources unnecessarily.

Kebo Code avoids that by using CodeMirror's `runMode` to syntax highlight code live in the editor, allowing the frontend to be static HTML.

## Why Gutenberg Only?

The plugin relies on using JavaScript to produce the syntax highlighted code before it can be displayed, which lends itself to Gutenberg but not Shortcodes. Unfortunately this means it requires the Gutenberg / WordPress 5.0 editor.

## Highlighter Styles

There are only two styles/themes initially, mimicking the Github and VS Code Dark+ themes. I will add more as time passes but you are welcome to let me know which your favourites are. You can also disable the plugin styles and use your own.

## Installation

1. Upload to your plugins folder, usually `wp-content/plugins/`
2. Activate the plugin on the plugin screen.
3. When editing posts you will now have the `Kebo Code` block available.

## License

Licensed under MIT.