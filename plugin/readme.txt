=== Kebo Code ===
Contributors: PeterBooker
Tags: code highlighter, syntax highlighter, code, syntax
Requires at least: 4.9.8
Tested up to: 4.9
Stable tag: 1.0.2
License: GPLv2
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Lightweight syntax / code highlighter which outputs plain HTML, no bloat or JavaScript.

== Description ==

**(note: Gutenberg Editor Required)**

A syntax / code highlighter Gutenberg block. Paste your code into the block, set the language and see your code highlighted exactly like it will display on the frontend.

= Features =

* Syntax highlighting block for the Gutenberg Editor
* Switch between editor and preview, see exactly what will appear on the frontend.
* Supports 121 languages, listed [here](https://codemirror.net/mode/).
* 2 Themes, VSCode Dark+ and Github, see the screenshots below. *(more coming soon)*
* Static HTML output, no frontend scripts or user tracking.

== Frequently Asked Questions ==

= Why does it require Gutenberg? =

The way the plugin highlights the text, as it is being edited, requires the Gutenberg editor/environment, which means the plugin would do nothing without it.

Specifically, it uses CodeMirror's [runMode](https://codemirror.net/demo/runmode.html) function to process highlighting in real-time.

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