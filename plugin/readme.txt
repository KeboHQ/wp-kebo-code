=== Kebo Code ===
Contributors: PeterBooker
Tags: code syntax highlighter
Requires at least: 4.9
Tested up to: 5.0
Stable tag: 1.0.0
License: GPLv2
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Lightweight syntax/code highlighting which outputs plain HTML, no bloat or JavaScript.

== Description ==

** Gutenberg Editor Required **

This plugin contains a code/syntax highlighting Gutenberg block. It uses CodeMirror and supports the full range of [scripts and languages](https://codemirror.net/mode/). The highlighting is performed in the editor using CodeMirrors `runMode`, storing the resulting HTML to be used on the frontend.

== Frequently Asked Questions ==

= Why does it require Gutenberg? =

The way the plugin highlights the text, as it is being edited, requires the Gutenberg editor/environment, which means the plugin would do nothing without it.

= Which scipts and languages does it support? =

All scripts and languages supported by CodeMirror, [listed here](https://codemirror.net/mode/).

== Screenshots ==

1. Kebo Code block in the Gutenberg editor.
2. Frontend display using VSCode Dark+ Theme.
3. Frontend display using Github Theme.

== Changelog ==

= v 1.0.1 =
* Fix: Resolved error caused by bad filemtime() call, replaced with plugin version as more efficient.
* Fix: Corrected plugin version in main php file.

= v 1.0.0 =
* First public version of the plugin.
* Contains a single Gutenberg block which syntax highlights code.