import CodeMirror from 'codemirror'
import { encode } from 'he'
import 'codemirror/addon/runmode/runmode'
import 'codemirror/mode/meta'

const { __ } = wp.i18n
const { 
    registerBlockType,
} = wp.blocks
const {
    ToggleControl,
    SelectControl,
    SandBox,
    PanelBody
} = wp.components
const {
    InspectorControls,
    PlainText,
} = wp.editor

import '../scss/editor.scss'
import '../scss/theme.scss'

registerBlockType( 'kebo/code', {
    title: 'Kebo Code',
    description: 'Syntax Highlighting for a wide variety of languages/scripts.',
    icon: 'editor-code',
    category: 'formatting',
    keywords: [ __( 'code' ), 'syntax', 'highlighting' ],
    useOnce: false,

    attributes: {
		lang: {
            type: 'string',
            default: 'php',
		},
		theme: {
            type: 'string',
			default: 'github',
        },
        lines: {
            type: 'boolean',
			default: false,
        },
        content: {
            type: 'string',
            default: '',
        },
        highlighted: {
            type: 'string',
            default: '',
        },
    },
    
    supports: {
		customClassName: false,
		html: false,
    },
    
    edit: ( props ) => {

        const { attributes: { lang, theme, lines, content, highlighted }, setAttributes, className, isSelected } = props

        const onChangeContent = ( newContent ) => {
            setAttributes( {
                content: newContent,
                highlighted: highlightCode( newContent, theme, lang, lines )
            } )
        }

        const onChangeLang = ( newLang ) => {
            setAttributes( {
                lang: newLang,
                highlighted: highlightCode( content, theme, newLang, lines )
            } )
        }

        const onChangeTheme = ( newTheme ) => {
            setAttributes( {
                theme: newTheme,
                highlighted: highlightCode( content, newTheme, lang, lines )
            } )
        };

        function onChangeLines() {
            setAttributes( {
                lines: ! lines,
                highlighted: highlightCode( content, theme, lang, ! lines )
            } )
        }

        function highlightCode( content, theme, lang, lines ) {
            let code = [], line = [], nums = [], size = 0
            let numbersHTML = '', codeHTML = ''

            let langMIME = '', modeName = ''
            var found = CodeMirror.findModeByName(lang)
            if ( found ) {
                modeName = found.mode
                langMIME = found.mime
                if ( ! CodeMirror.modes[modeName] ) {
                    require( 'codemirror/mode/' + modeName + '/' + modeName + '.js' )
                }
            } else {
                langMIME = 'meta'
            }

            CodeMirror.runMode( content, langMIME, ( token, style ) => {
                if ( token == '\n' ) {
                    nums.push( '<div class="kbco-num">'+(++size)+'</div>' )
                    if ( line.length == 0 ) {
                        code.push( '<pre class="kbco-line">\n</pre>' )
                    } else {
                        code.push( '<pre class="kbco-line">' + line.join('') + '</pre>' )
                    }
                    line = []
                } else if ( style ) {
                    line.push( '<span class="kbco-' + style + '">' + encode( token ) + '</span>' )
                } else {
                    if ( token == ' ' ) {
                        token = '&nbsp;'
                    }
                    line.push( token )
                }
            });

            nums.push( '<div class="kbco-num">' + (++size) + '</div>' )
            code.push( '<pre class="kbco-line">' + line.join('') + '</pre>' )

            if ( lines ) {
                numbersHTML = '<div class="kbco-nums">'+ nums.join('') +'</div>'
            }
            codeHTML = '<div class="kbco-code"><div class="kbco-lines">'+ code.join('') +'</div></div>'

            return `
                <div class="kbco-block kbco-${theme}">
                    ` + numbersHTML + `
                    ` + codeHTML + `
                </div>`
        }

        const site_url = kebo_code_vars.site_url;
        const enqueue = '<link rel="stylesheet" id="kebo-code-themes-css" href="' + site_url + 'assets/css/theme.css' + '" type="text/css" media="all"></link>';

        const controls = (
        <InspectorControls>
            <PanelBody title={ 'Display Options' }>
                <SelectControl
                    label={ 'Language' }
                    value={ lang }
                    options={ availableLangs }
                    onChange={ onChangeLang }
                />
                <SelectControl
                    label={ 'Theme' }
                    value={ theme }
                    options={ availableThemes }
                    onChange={ onChangeTheme }
                />
                <ToggleControl
                    label={ 'Show Lines' }
                    checked={ lines }
                    onChange={ onChangeLines }
                />
            </PanelBody>
        </InspectorControls>
        )

        return (
		<div className={ className }>
            { isSelected && controls }
            { isSelected ? (
                <PlainText
                    value={ content }
                    onChange={ onChangeContent }
                    placeholder={ __( 'Write code…' ) }
                    aria-label={ __( 'Code' ) }
                />
            ) : (
                <div>
                    <SandBox
                        html={ highlighted + enqueue }
                        onFocus={ () => console.log( 'iframe is focused' ) }
                        onBlur={ () => console.log( 'iframe is focused' ) }
                    />
                </div>
            )}
        </div>
	    )
    },
    
    save: () => {
        return null
    },
    
} )

const availableThemes = [
    //{ value: 'bitbucket',    label: 'Bitbucket' },
    //{ value: 'darcula',      label: 'Darcula' },
    { value: 'github',       label: 'Github' },
    { value: 'vsdark',       label: 'Visual Studio Dark' },
]

const availableLangs = [
    {label: "APL", mime: "text/apl", mode: "apl", ext: ["dyalog", "apl"]},
    {label: "PGP", mimes: ["application/pgp", "application/pgp-encrypted", "application/pgp-keys", "application/pgp-signature"], mode: "asciiarmor", ext: ["asc", "pgp", "sig"]},
    {label: "ASN.1", mime: "text/x-ttcn-asn", mode: "asn.1", ext: ["asn", "asn1"]},
    {label: "Asterisk", mime: "text/x-asterisk", mode: "asterisk", file: /^extensions\.conf$/i},
    {label: "Brainfuck", mime: "text/x-brainfuck", mode: "brainfuck", ext: ["b", "bf"]},
    {label: "C", mime: "text/x-csrc", mode: "clike", ext: ["c", "h", "ino"]},
    {label: "C++", mime: "text/x-c++src", mode: "clike", ext: ["cpp", "c++", "cc", "cxx", "hpp", "h++", "hh", "hxx"], alias: ["cpp"]},
    {label: "Cobol", mime: "text/x-cobol", mode: "cobol", ext: ["cob", "cpy"]},
    {label: "C#", mime: "text/x-csharp", mode: "clike", ext: ["cs"], alias: ["csharp"]},
    {label: "Clojure", mime: "text/x-clojure", mode: "clojure", ext: ["clj", "cljc", "cljx"]},
    {label: "ClojureScript", mime: "text/x-clojurescript", mode: "clojure", ext: ["cljs"]},
    {label: "Closure Stylesheets (GSS)", mime: "text/x-gss", mode: "css", ext: ["gss"]},
    {label: "CMake", mime: "text/x-cmake", mode: "cmake", ext: ["cmake", "cmake.in"], file: /^CMakeLists.txt$/},
    {label: "CoffeeScript", mimes: ["application/vnd.coffeescript", "text/coffeescript", "text/x-coffeescript"], mode: "coffeescript", ext: ["coffee"], alias: ["coffee", "coffee-script"]},
    {label: "Common Lisp", mime: "text/x-common-lisp", mode: "commonlisp", ext: ["cl", "lisp", "el"], alias: ["lisp"]},
    {label: "Cypher", mime: "application/x-cypher-query", mode: "cypher", ext: ["cyp", "cypher"]},
    {label: "Cython", mime: "text/x-cython", mode: "python", ext: ["pyx", "pxd", "pxi"]},
    {label: "Crystal", mime: "text/x-crystal", mode: "crystal", ext: ["cr"]},
    {label: "CSS", mime: "text/css", mode: "css", ext: ["css"]},
    {label: "CQL", mime: "text/x-cassandra", mode: "sql", ext: ["cql"]},
    {label: "D", mime: "text/x-d", mode: "d", ext: ["d"]},
    {label: "Dart", mimes: ["application/dart", "text/x-dart"], mode: "dart", ext: ["dart"]},
    {label: "diff", mime: "text/x-diff", mode: "diff", ext: ["diff", "patch"]},
    {label: "Django", mime: "text/x-django", mode: "django"},
    {label: "Dockerfile", mime: "text/x-dockerfile", mode: "dockerfile", file: /^Dockerfile$/},
    {label: "DTD", mime: "application/xml-dtd", mode: "dtd", ext: ["dtd"]},
    {label: "Dylan", mime: "text/x-dylan", mode: "dylan", ext: ["dylan", "dyl", "intr"]},
    {label: "EBNF", mime: "text/x-ebnf", mode: "ebnf"},
    {label: "ECL", mime: "text/x-ecl", mode: "ecl", ext: ["ecl"]},
    {label: "edn", mime: "application/edn", mode: "clojure", ext: ["edn"]},
    {label: "Eiffel", mime: "text/x-eiffel", mode: "eiffel", ext: ["e"]},
    {label: "Elm", mime: "text/x-elm", mode: "elm", ext: ["elm"]},
    {label: "Embedded Javascript", mime: "application/x-ejs", mode: "htmlembedded", ext: ["ejs"]},
    {label: "Embedded Ruby", mime: "application/x-erb", mode: "htmlembedded", ext: ["erb"]},
    {label: "Erlang", mime: "text/x-erlang", mode: "erlang", ext: ["erl"]},
    {label: "Esper", mime: "text/x-esper", mode: "sql"},
    {label: "Factor", mime: "text/x-factor", mode: "factor", ext: ["factor"]},
    {label: "FCL", mime: "text/x-fcl", mode: "fcl"},
    {label: "Forth", mime: "text/x-forth", mode: "forth", ext: ["forth", "fth", "4th"]},
    {label: "Fortran", mime: "text/x-fortran", mode: "fortran", ext: ["f", "for", "f77", "f90"]},
    {label: "F#", mime: "text/x-fsharp", mode: "mllike", ext: ["fs"], alias: ["fsharp"]},
    {label: "Gas", mime: "text/x-gas", mode: "gas", ext: ["s"]},
    {label: "Gherkin", mime: "text/x-feature", mode: "gherkin", ext: ["feature"]},
    {label: "GitHub Flavored Markdown", mime: "text/x-gfm", mode: "gfm", file: /^(readme|contributing|history).md$/i},
    {label: "Go", mime: "text/x-go", mode: "go", ext: ["go"]},
    {label: "Groovy", mime: "text/x-groovy", mode: "groovy", ext: ["groovy", "gradle"], file: /^Jenkinsfile$/},
    {label: "HAML", mime: "text/x-haml", mode: "haml", ext: ["haml"]},
    {label: "Haskell", mime: "text/x-haskell", mode: "haskell", ext: ["hs"]},
    {label: "Haskell (Literate)", mime: "text/x-literate-haskell", mode: "haskell-literate", ext: ["lhs"]},
    {label: "Haxe", mime: "text/x-haxe", mode: "haxe", ext: ["hx"]},
    {label: "HXML", mime: "text/x-hxml", mode: "haxe", ext: ["hxml"]},
    {label: "ASP.NET", mime: "application/x-aspx", mode: "htmlembedded", ext: ["aspx"], alias: ["asp", "aspx"]},
    {label: "HTML", mime: "text/html", mode: "htmlmixed", ext: ["html", "htm", "handlebars", "hbs"], alias: ["xhtml"]},
    {label: "HTTP", mime: "message/http", mode: "http"},
    {label: "IDL", mime: "text/x-idl", mode: "idl", ext: ["pro"]},
    {label: "Pug", mime: "text/x-pug", mode: "pug", ext: ["jade", "pug"], alias: ["jade"]},
    {label: "Java", mime: "text/x-java", mode: "clike", ext: ["java"]},
    {label: "Java Server Pages", mime: "application/x-jsp", mode: "htmlembedded", ext: ["jsp"], alias: ["jsp"]},
    {label: "JavaScript", mimes: ["text/javascript", "text/ecmascript", "application/javascript", "application/x-javascript", "application/ecmascript"], mode: "javascript", ext: ["js"], alias: ["ecmascript", "js", "node"]},
    {label: "JSON", mimes: ["application/json", "application/x-json"], mode: "javascript", ext: ["json", "map"], alias: ["json5"]},
    {label: "JSON-LD", mime: "application/ld+json", mode: "javascript", ext: ["jsonld"], alias: ["jsonld"]},
    {label: "JSX", mime: "text/jsx", mode: "jsx", ext: ["jsx"]},
    {label: "Jinja2", mime: "null", mode: "jinja2", ext: ["j2", "jinja", "jinja2"]},
    {label: "Julia", mime: "text/x-julia", mode: "julia", ext: ["jl"]},
    {label: "Kotlin", mime: "text/x-kotlin", mode: "clike", ext: ["kt"]},
    {label: "LESS", mime: "text/x-less", mode: "css", ext: ["less"]},
    {label: "LiveScript", mime: "text/x-livescript", mode: "livescript", ext: ["ls"], alias: ["ls"]},
    {label: "Lua", mime: "text/x-lua", mode: "lua", ext: ["lua"]},
    {label: "Markdown", mime: "text/x-markdown", mode: "markdown", ext: ["markdown", "md", "mkd"]},
    {label: "mIRC", mime: "text/mirc", mode: "mirc"},
    {label: "MariaDB SQL", mime: "text/x-mariadb", mode: "sql"},
    {label: "Mathematica", mime: "text/x-mathematica", mode: "mathematica", ext: ["m", "nb"]},
    {label: "Modelica", mime: "text/x-modelica", mode: "modelica", ext: ["mo"]},
    {label: "MUMPS", mime: "text/x-mumps", mode: "mumps", ext: ["mps"]},
    {label: "MS SQL", mime: "text/x-mssql", mode: "sql"},
    {label: "mbox", mime: "application/mbox", mode: "mbox", ext: ["mbox"]},
    {label: "MySQL", mime: "text/x-mysql", mode: "sql"},
    {label: "Nginx", mime: "text/x-nginx-conf", mode: "nginx", file: /nginx.*\.conf$/i},
    {label: "NSIS", mime: "text/x-nsis", mode: "nsis", ext: ["nsh", "nsi"]},
    {label: "NTriples", mimes: ["application/n-triples", "application/n-quads", "text/n-triples"], mode: "ntriples", ext: ["nt", "nq"]},
    {label: "Objective-C", mime: "text/x-objectivec", mode: "clike", ext: ["m", "mm"], alias: ["objective-c", "objc"]},
    {label: "OCaml", mime: "text/x-ocaml", mode: "mllike", ext: ["ml", "mli", "mll", "mly"]},
    {label: "Octave", mime: "text/x-octave", mode: "octave", ext: ["m"]},
    {label: "Oz", mime: "text/x-oz", mode: "oz", ext: ["oz"]},
    {label: "Pascal", mime: "text/x-pascal", mode: "pascal", ext: ["p", "pas"]},
    {label: "PEG.js", mime: "null", mode: "pegjs", ext: ["jsonld"]},
    {label: "Perl", mime: "text/x-perl", mode: "perl", ext: ["pl", "pm"]},
    {label: "PHP", mimes: ["text/x-php", "application/x-httpd-php", "application/x-httpd-php-open"], mode: "php", ext: ["php", "php3", "php4", "php5", "php7", "phtml"]},
    {label: "Pig", mime: "text/x-pig", mode: "pig", ext: ["pig"]},
    {label: "Plain Text", mime: "text/plain", mode: "null", ext: ["txt", "text", "conf", "def", "list", "log"]},
    {label: "PLSQL", mime: "text/x-plsql", mode: "sql", ext: ["pls"]},
    {label: "PowerShell", mime: "application/x-powershell", mode: "powershell", ext: ["ps1", "psd1", "psm1"]},
    {label: "Properties files", mime: "text/x-properties", mode: "properties", ext: ["properties", "ini", "in"], alias: ["ini", "properties"]},
    {label: "ProtoBuf", mime: "text/x-protobuf", mode: "protobuf", ext: ["proto"]},
    {label: "Python", mime: "text/x-python", mode: "python", ext: ["BUILD", "bzl", "py", "pyw"], file: /^(BUCK|BUILD)$/},
    {label: "Puppet", mime: "text/x-puppet", mode: "puppet", ext: ["pp"]},
    {label: "Q", mime: "text/x-q", mode: "q", ext: ["q"]},
    {label: "R", mime: "text/x-rsrc", mode: "r", ext: ["r", "R"], alias: ["rscript"]},
    {label: "reStructuredText", mime: "text/x-rst", mode: "rst", ext: ["rst"], alias: ["rst"]},
    {label: "RPM Changes", mime: "text/x-rpm-changes", mode: "rpm"},
    {label: "RPM Spec", mime: "text/x-rpm-spec", mode: "rpm", ext: ["spec"]},
    {label: "Ruby", mime: "text/x-ruby", mode: "ruby", ext: ["rb"], alias: ["jruby", "macruby", "rake", "rb", "rbx"]},
    {label: "Rust", mime: "text/x-rustsrc", mode: "rust", ext: ["rs"]},
    {label: "SAS", mime: "text/x-sas", mode: "sas", ext: ["sas"]},
    {label: "Sass", mime: "text/x-sass", mode: "sass", ext: ["sass"]},
    {label: "Scala", mime: "text/x-scala", mode: "clike", ext: ["scala"]},
    {label: "Scheme", mime: "text/x-scheme", mode: "scheme", ext: ["scm", "ss"]},
    {label: "SCSS", mime: "text/x-scss", mode: "css", ext: ["scss"]},
    {label: "Shell", mimes: ["text/x-sh", "application/x-sh"], mode: "shell", ext: ["sh", "ksh", "bash"], alias: ["bash", "sh", "zsh"], file: /^PKGBUILD$/},
    {label: "Sieve", mime: "application/sieve", mode: "sieve", ext: ["siv", "sieve"]},
    {label: "Slim", mimes: ["text/x-slim", "application/x-slim"], mode: "slim", ext: ["slim"]},
    {label: "Smalltalk", mime: "text/x-stsrc", mode: "smalltalk", ext: ["st"]},
    {label: "Smarty", mime: "text/x-smarty", mode: "smarty", ext: ["tpl"]},
    {label: "Solr", mime: "text/x-solr", mode: "solr"},
    {label: "SML", mime: "text/x-sml", mode: "mllike", ext: ["sml", "sig", "fun", "smackspec"]},
    {label: "Soy", mime: "text/x-soy", mode: "soy", ext: ["soy"], alias: ["closure template"]},
    {label: "SPARQL", mime: "application/sparql-query", mode: "sparql", ext: ["rq", "sparql"], alias: ["sparul"]},
    {label: "Spreadsheet", mime: "text/x-spreadsheet", mode: "spreadsheet", alias: ["excel", "formula"]},
    {label: "SQL", mime: "text/x-sql", mode: "sql", ext: ["sql"]},
    {label: "SQLite", mime: "text/x-sqlite", mode: "sql"},
    {label: "Squirrel", mime: "text/x-squirrel", mode: "clike", ext: ["nut"]},
    {label: "Stylus", mime: "text/x-styl", mode: "stylus", ext: ["styl"]},
    {label: "Swift", mime: "text/x-swift", mode: "swift", ext: ["swift"]},
    {label: "sTeX", mime: "text/x-stex", mode: "stex"},
    {label: "LaTeX", mime: "text/x-latex", mode: "stex", ext: ["text", "ltx", "tex"], alias: ["tex"]},
    {label: "SystemVerilog", mime: "text/x-systemverilog", mode: "verilog", ext: ["v", "sv", "svh"]},
    {label: "Tcl", mime: "text/x-tcl", mode: "tcl", ext: ["tcl"]},
    {label: "Textile", mime: "text/x-textile", mode: "textile", ext: ["textile"]},
    {label: "TiddlyWiki ", mime: "text/x-tiddlywiki", mode: "tiddlywiki"},
    {label: "Tiki wiki", mime: "text/tiki", mode: "tiki"},
    {label: "TOML", mime: "text/x-toml", mode: "toml", ext: ["toml"]},
    {label: "Tornado", mime: "text/x-tornado", mode: "tornado"},
    {label: "troff", mime: "text/troff", mode: "troff", ext: ["1", "2", "3", "4", "5", "6", "7", "8", "9"]},
    {label: "TTCN", mime: "text/x-ttcn", mode: "ttcn", ext: ["ttcn", "ttcn3", "ttcnpp"]},
    {label: "TTCN_CFG", mime: "text/x-ttcn-cfg", mode: "ttcn-cfg", ext: ["cfg"]},
    {label: "Turtle", mime: "text/turtle", mode: "turtle", ext: ["ttl"]},
    {label: "TypeScript", mime: "application/typescript", mode: "javascript", ext: ["ts"], alias: ["ts"]},
    {label: "TypeScript-JSX", mime: "text/typescript-jsx", mode: "jsx", ext: ["tsx"], alias: ["tsx"]},
    {label: "Twig", mime: "text/x-twig", mode: "twig"},
    {label: "Web IDL", mime: "text/x-webidl", mode: "webidl", ext: ["webidl"]},
    {label: "VB.NET", mime: "text/x-vb", mode: "vb", ext: ["vb"]},
    {label: "VBScript", mime: "text/vbscript", mode: "vbscript", ext: ["vbs"]},
    {label: "Velocity", mime: "text/velocity", mode: "velocity", ext: ["vtl"]},
    {label: "Verilog", mime: "text/x-verilog", mode: "verilog", ext: ["v"]},
    {label: "VHDL", mime: "text/x-vhdl", mode: "vhdl", ext: ["vhd", "vhdl"]},
    {label: "Vue.js Component", mimes: ["script/x-vue", "text/x-vue"], mode: "vue", ext: ["vue"]},
    {label: "XML", mimes: ["application/xml", "text/xml"], mode: "xml", ext: ["xml", "xsl", "xsd", "svg"], alias: ["rss", "wsdl", "xsd"]},
    {label: "XQuery", mime: "application/xquery", mode: "xquery", ext: ["xy", "xquery"]},
    {label: "Yacas", mime: "text/x-yacas", mode: "yacas", ext: ["ys"]},
    {label: "YAML", mimes: ["text/x-yaml", "text/yaml"], mode: "yaml", ext: ["yaml", "yml"], alias: ["yml"]},
    {label: "Z80", mime: "text/x-z80", mode: "z80", ext: ["z80"]},
    {label: "mscgen", mime: "text/x-mscgen", mode: "mscgen", ext: ["mscgen", "mscin", "msc"]},
    {label: "xu", mime: "text/x-xu", mode: "mscgen", ext: ["xu"]},
    {label: "msgenny", mime: "text/x-msgenny", mode: "mscgen", ext: ["msgenny"]}
]