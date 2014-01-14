/*!
 * jQuery JavaScript Library v1.10.2
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03T13:48Z
 */

(function( window, undefined ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//"use strict";
var
	// The deferred used on DOM ready
	readyList,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// Support: IE<10
	// For `typeof xmlNode.method` instead of `xmlNode.method !== undefined`
	core_strundefined = typeof undefined,

	// Use the correct document accordingly with window argument (sandbox)
	location = window.location,
	document = window.document,
	docElem = document.documentElement,

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// [[Class]] -> type pairs
	class2type = {},

	// List of deleted data cache ids, so we can reuse them
	core_deletedIds = [],

	core_version = "1.10.2",

	// Save a reference to some core methods
	core_concat = core_deletedIds.concat,
	core_push = core_deletedIds.push,
	core_slice = core_deletedIds.slice,
	core_indexOf = core_deletedIds.indexOf,
	core_toString = class2type.toString,
	core_hasOwn = class2type.hasOwnProperty,
	core_trim = core_version.trim,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

	// Used for splitting on whitespace
	core_rnotwhite = /\S+/g,

	// Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	},

	// The ready event handler
	completed = function( event ) {

		// readyState === "complete" is good enough for us to call the dom ready in oldIE
		if ( document.addEventListener || event.type === "load" || document.readyState === "complete" ) {
			detach();
			jQuery.ready();
		}
	},
	// Clean-up method for dom ready events
	detach = function() {
		if ( document.addEventListener ) {
			document.removeEventListener( "DOMContentLoaded", completed, false );
			window.removeEventListener( "load", completed, false );

		} else {
			document.detachEvent( "onreadystatechange", completed );
			window.detachEvent( "onload", completed );
		}
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: core_version,

	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},

	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( !document.body ) {
			return setTimeout( jQuery.ready );
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		/* jshint eqeqeq: false */
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return String( obj );
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ core_toString.call(obj) ] || "object" :
			typeof obj;
	},

	isPlainObject: function( obj ) {
		var key;

		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!core_hasOwn.call(obj, "constructor") &&
				!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Support: IE<9
		// Handle iteration over inherited properties before own properties.
		if ( jQuery.support.ownLast ) {
			for ( key in obj ) {
				return core_hasOwn.call( obj, key );
			}
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		for ( key in obj ) {}

		return key === undefined || core_hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	parseHTML: function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
		context = context || document;

		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];

		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts );
		if ( scripts ) {
			jQuery( scripts ).remove();
		}
		return jQuery.merge( [], parsed.childNodes );
	},

	parseJSON: function( data ) {
		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		if ( data === null ) {
			return data;
		}

		if ( typeof data === "string" ) {

			// Make sure leading/trailing whitespace is removed (IE can't handle it)
			data = jQuery.trim( data );

			if ( data ) {
				// Make sure the incoming data is actual JSON
				// Logic borrowed from http://json.org/json2.js
				if ( rvalidchars.test( data.replace( rvalidescape, "@" )
					.replace( rvalidtokens, "]" )
					.replace( rvalidbraces, "")) ) {

					return ( new Function( "return " + data ) )();
				}
			}
		}

		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && jQuery.trim( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Use native String.trim function wherever possible
	trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
		function( text ) {
			return text == null ?
				"" :
				core_trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				core_push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( core_indexOf ) {
				return core_indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return core_concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var args, proxy, tmp;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			bulk = key == null;

		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}

		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < length; i++ ) {
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: function() {
		return ( new Date() ).getTime();
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations.
	// Note: this method belongs to the css module but it's needed here for the support module.
	// If support gets modularized, this method should be moved back to the css module.
	swap: function( elem, options, callback, args ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.apply( elem, args || [] );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );

		// If IE event model is used
		} else {
			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", completed );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", completed );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch(e) {}

			if ( top && top.doScroll ) {
				(function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {
							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll("left");
						} catch(e) {
							return setTimeout( doScrollCheck, 50 );
						}

						// detach all dom ready events
						detach();

						// and execute any waiting functions
						jQuery.ready();
					}
				})();
			}
		}
	}
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || type !== "function" &&
		( length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj );
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
/*!
 * Sizzle CSS Selector Engine v1.10.2
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03
 */
(function( window, undefined ) {

var i,
	support,
	cachedruns,
	Expr,
	getText,
	isXML,
	compile,
	outermostContext,
	sortInput,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	hasDuplicate = false,
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}
		return 0;
	},

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

	// Prefer arguments quoted,
	//   then not containing pseudos/brackets,
	//   then attribute selectors/non-parenthetical expressions,
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rsibling = new RegExp( whitespace + "*[+~]" ),
	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			// BMP codepoint
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( documentIsHTML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, context.getElementsByTagName( selector ) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
				push.apply( results, context.getElementsByClassName( m ) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
			nid = old = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && context.parentNode || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key += " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = attrs.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Detect xml
 * @param {Element|Object} elem An element or a document
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var doc = node ? node.ownerDocument || node : preferredDoc,
		parent = doc.defaultView;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsHTML = !isXML( doc );

	// Support: IE>8
	// If iframe document is assigned to "document" variable and if iframe has been reloaded,
	// IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
	// IE6-8 do not support the defaultView property so parent will be undefined
	if ( parent && parent.attachEvent && parent !== parent.top ) {
		parent.attachEvent( "onbeforeunload", function() {
			setDocument();
		});
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if getElementsByClassName can be trusted
	support.getElementsByClassName = assert(function( div ) {
		div.innerHTML = "<div class='a'></div><div class='a i'></div>";

		// Support: Safari<4
		// Catch class over-caching
		div.firstChild.className = "i";
		// Support: Opera<10
		// Catch gEBCN failure to find non-leading classes
		return div.getElementsByClassName("i").length === 2;
	});

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select><option selected=''></option></select>";

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {

			// Support: Opera 10-12/IE8
			// ^= $= *= and empty values
			// Should not select anything
			// Support: Windows 8 Native Apps
			// The type attribute is restricted during .innerHTML assignment
			var input = doc.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "t", "" );

			if ( div.querySelectorAll("[t^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = rnative.test( docElem.contains ) || docElem.compareDocumentPosition ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = docElem.compareDocumentPosition ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b );

		if ( compare ) {
			// Disconnected nodes
			if ( compare & 1 ||
				(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

				// Choose the first element that is related to our preferred document
				if ( a === doc || contains(preferredDoc, a) ) {
					return -1;
				}
				if ( b === doc || contains(preferredDoc, b) ) {
					return 1;
				}

				// Maintain original order
				return sortInput ?
					( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
					0;
			}

			return compare & 4 ? -1 : 1;
		}

		// Not directly comparable, sort on existence of method
		return a.compareDocumentPosition ? -1 : 1;
	} :
	function( a, b ) {
		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Parentless nodes are either documents or disconnected
		} else if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return doc;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [elem] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val === undefined ?
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null :
		val;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (see #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[5] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] && match[4] !== undefined ) {
				match[2] = match[4];

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
			//   not comment, processing instructions, or others
			// Thanks to Diego Perini for the nodeName shortcut
			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( tokens = [] );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var data, cache, outerCache,
				dirkey = dirruns + " " + doneName;

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
							if ( (data = cache[1]) === true || data === cachedruns ) {
								return data === true;
							}
						} else {
							cache = outerCache[ dir ] = [ dirkey ];
							cache[1] = matcher( elem, context, xml ) || cachedruns;
							if ( cache[1] === true ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	// A counter to specify which element is currently being matched
	var matcherCachedRuns = 0,
		bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, expandContext ) {
			var elem, j, matcher,
				setMatched = [],
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				outermost = expandContext != null,
				contextBackup = outermostContext,
				// We must always have either seed elements or context
				elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);

			if ( outermost ) {
				outermostContext = context !== document && context;
				cachedruns = matcherCachedRuns;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
						cachedruns = ++matcherCachedRuns;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		match = tokenize( selector );

	if ( !seed ) {
		// Try to minimize operations if there is only one group
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					support.getById && context.nodeType === 9 && documentIsHTML &&
					Expr.relative[ tokens[1].type ] ) {

				context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
				if ( !context ) {
					return results;
				}
				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && context.parentNode || context
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, seed );
							return results;
						}

						break;
					}
				}
			}
		}
	}

	// Compile and execute a filtering function
	// Provide `match` to avoid retokenization if we modified the selector above
	compile( selector, match )(
		seed,
		context,
		!documentIsHTML,
		results,
		rsibling.test( selector )
	);
	return results;
}

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome<14
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return (val = elem.getAttributeNode( name )) && val.specified ?
				val.value :
				elem[ name ] === true ? name.toLowerCase() : null;
		}
	});
}

jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				firingLength = 0;
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( list && ( !fired || stack ) ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};
jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});
jQuery.support = (function( support ) {

	var all, a, input, select, fragment, opt, eventName, isSupported, i,
		div = document.createElement("div");

	// Setup
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// Finish early in limited (non-browser) environments
	all = div.getElementsByTagName("*") || [];
	a = div.getElementsByTagName("a")[ 0 ];
	if ( !a || !a.style || !all.length ) {
		return support;
	}

	// First batch of tests
	select = document.createElement("select");
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName("input")[ 0 ];

	a.style.cssText = "top:1px;float:left;opacity:.5";

	// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
	support.getSetAttribute = div.className !== "t";

	// IE strips leading whitespace when .innerHTML is used
	support.leadingWhitespace = div.firstChild.nodeType === 3;

	// Make sure that tbody elements aren't automatically inserted
	// IE will insert them into empty tables
	support.tbody = !div.getElementsByTagName("tbody").length;

	// Make sure that link elements get serialized correctly by innerHTML
	// This requires a wrapper element in IE
	support.htmlSerialize = !!div.getElementsByTagName("link").length;

	// Get the style information from getAttribute
	// (IE uses .cssText instead)
	support.style = /top/.test( a.getAttribute("style") );

	// Make sure that URLs aren't manipulated
	// (IE normalizes it by default)
	support.hrefNormalized = a.getAttribute("href") === "/a";

	// Make sure that element opacity exists
	// (IE uses filter instead)
	// Use a regex to work around a WebKit issue. See #5145
	support.opacity = /^0.5/.test( a.style.opacity );

	// Verify style float existence
	// (IE uses styleFloat instead of cssFloat)
	support.cssFloat = !!a.style.cssFloat;

	// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
	support.checkOn = !!input.value;

	// Make sure that a selected-by-default option has a working selected property.
	// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
	support.optSelected = opt.selected;

	// Tests for enctype support on a form (#6743)
	support.enctype = !!document.createElement("form").enctype;

	// Makes sure cloning an html5 element does not cause problems
	// Where outerHTML is undefined, this still works
	support.html5Clone = document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>";

	// Will be defined later
	support.inlineBlockNeedsLayout = false;
	support.shrinkWrapBlocks = false;
	support.pixelPosition = false;
	support.deleteExpando = true;
	support.noCloneEvent = true;
	support.reliableMarginRight = true;
	support.boxSizingReliable = true;

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE<9
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	// Check if we can trust getAttribute("value")
	input = document.createElement("input");
	input.setAttribute( "value", "" );
	support.input = input.getAttribute( "value" ) === "";

	// Check if an input maintains its value after becoming a radio
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "checked", "t" );
	input.setAttribute( "name", "t" );

	fragment = document.createDocumentFragment();
	fragment.appendChild( input );

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<9
	// Opera does not clone events (and typeof div.attachEvent === undefined).
	// IE9-10 clones events bound via attachEvent, but they don't trigger with .click()
	if ( div.attachEvent ) {
		div.attachEvent( "onclick", function() {
			support.noCloneEvent = false;
		});

		div.cloneNode( true ).click();
	}

	// Support: IE<9 (lack submit/change bubble), Firefox 17+ (lack focusin event)
	// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
	for ( i in { submit: true, change: true, focusin: true }) {
		div.setAttribute( eventName = "on" + i, "t" );

		support[ i + "Bubbles" ] = eventName in window || div.attributes[ eventName ].expando === false;
	}

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Support: IE<9
	// Iteration over object's inherited properties before its own.
	for ( i in jQuery( support ) ) {
		break;
	}
	support.ownLast = i !== "0";

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, marginDiv, tds,
			divReset = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

		body.appendChild( container ).appendChild( div );

		// Support: IE8
		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName("td");
		tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Support: IE8
		// Check if empty table cells still have offsetWidth/Height
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Check box-sizing and margin behavior.
		div.innerHTML = "";
		div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";

		// Workaround failing boxSizing test due to offsetWidth returning wrong value
		// with some non-1 values of body zoom, ticket #13543
		jQuery.swap( body, body.style.zoom != null ? { zoom: 1 } : {}, function() {
			support.boxSizing = div.offsetWidth === 4;
		});

		// Use window.getComputedStyle because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// Fails in WebKit before Feb 2011 nightlies
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = div.appendChild( document.createElement("div") );
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";

			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		if ( typeof div.style.zoom !== core_strundefined ) {
			// Support: IE<8
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			div.innerHTML = "";
			div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

			// Support: IE6
			// Check if elements with layout shrink-wrap their children
			div.style.display = "block";
			div.innerHTML = "<div></div>";
			div.firstChild.style.width = "5px";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );

			if ( support.inlineBlockNeedsLayout ) {
				// Prevent IE 6 from affecting layout for positioned elements #11048
				// Prevent IE from shrinking the body in IE 7 mode #12869
				// Support: IE<8
				body.style.zoom = 1;
			}
		}

		body.removeChild( container );

		// Null elements to avoid leaks in IE
		container = div = tds = marginDiv = null;
	});

	// Null elements to avoid leaks in IE
	all = select = fragment = opt = a = input = null;

	return support;
})({});

var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

function internalData( elem, name, data, pvt /* Internal Use Only */ ){
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var ret, thisCache,
		internalKey = jQuery.expando,

		// We have to handle DOM nodes and JS objects differently because IE6-7
		// can't GC object references properly across the DOM-JS boundary
		isNode = elem.nodeType,

		// Only DOM nodes need the global jQuery cache; JS object data is
		// attached directly to the object so GC can occur automatically
		cache = isNode ? jQuery.cache : elem,

		// Only defining an ID for JS objects if its cache already exists allows
		// the code to shortcut on the same path as a DOM node with no cache
		id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

	// Avoid doing any more work than we need to when trying to get data on an
	// object that has no data at all
	if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && data === undefined && typeof name === "string" ) {
		return;
	}

	if ( !id ) {
		// Only DOM nodes need a new unique ID for each element since their data
		// ends up in the global cache
		if ( isNode ) {
			id = elem[ internalKey ] = core_deletedIds.pop() || jQuery.guid++;
		} else {
			id = internalKey;
		}
	}

	if ( !cache[ id ] ) {
		// Avoid exposing jQuery metadata on plain JS objects when the object
		// is serialized using JSON.stringify
		cache[ id ] = isNode ? {} : { toJSON: jQuery.noop };
	}

	// An object can be passed to jQuery.data instead of a key/value pair; this gets
	// shallow copied over onto the existing cache
	if ( typeof name === "object" || typeof name === "function" ) {
		if ( pvt ) {
			cache[ id ] = jQuery.extend( cache[ id ], name );
		} else {
			cache[ id ].data = jQuery.extend( cache[ id ].data, name );
		}
	}

	thisCache = cache[ id ];

	// jQuery data() is stored in a separate object inside the object's internal data
	// cache in order to avoid key collisions between internal data and user-defined
	// data.
	if ( !pvt ) {
		if ( !thisCache.data ) {
			thisCache.data = {};
		}

		thisCache = thisCache.data;
	}

	if ( data !== undefined ) {
		thisCache[ jQuery.camelCase( name ) ] = data;
	}

	// Check for both converted-to-camel and non-converted data property names
	// If a data property was specified
	if ( typeof name === "string" ) {

		// First Try to find as-is property data
		ret = thisCache[ name ];

		// Test for null|undefined property data
		if ( ret == null ) {

			// Try to find the camelCased property
			ret = thisCache[ jQuery.camelCase( name ) ];
		}
	} else {
		ret = thisCache;
	}

	return ret;
}

function internalRemoveData( elem, name, pvt ) {
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var thisCache, i,
		isNode = elem.nodeType,

		// See jQuery.data for more information
		cache = isNode ? jQuery.cache : elem,
		id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

	// If there is already no cache entry for this object, there is no
	// purpose in continuing
	if ( !cache[ id ] ) {
		return;
	}

	if ( name ) {

		thisCache = pvt ? cache[ id ] : cache[ id ].data;

		if ( thisCache ) {

			// Support array or space separated string names for data keys
			if ( !jQuery.isArray( name ) ) {

				// try the string as a key before any manipulation
				if ( name in thisCache ) {
					name = [ name ];
				} else {

					// split the camel cased version by spaces unless a key with the spaces exists
					name = jQuery.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						name = name.split(" ");
					}
				}
			} else {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = name.concat( jQuery.map( name, jQuery.camelCase ) );
			}

			i = name.length;
			while ( i-- ) {
				delete thisCache[ name[i] ];
			}

			// If there is no data left in the cache, we want to continue
			// and let the cache object itself get destroyed
			if ( pvt ? !isEmptyDataObject(thisCache) : !jQuery.isEmptyObject(thisCache) ) {
				return;
			}
		}
	}

	// See jQuery.data for more information
	if ( !pvt ) {
		delete cache[ id ].data;

		// Don't destroy the parent cache unless the internal data object
		// had been the only thing left in it
		if ( !isEmptyDataObject( cache[ id ] ) ) {
			return;
		}
	}

	// Destroy the cache
	if ( isNode ) {
		jQuery.cleanData( [ elem ], true );

	// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
	/* jshint eqeqeq: false */
	} else if ( jQuery.support.deleteExpando || cache != cache.window ) {
		/* jshint eqeqeq: true */
		delete cache[ id ];

	// When all else fails, null
	} else {
		cache[ id ] = null;
	}
}

jQuery.extend({
	cache: {},

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"applet": true,
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data ) {
		return internalData( elem, name, data );
	},

	removeData: function( elem, name ) {
		return internalRemoveData( elem, name );
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return internalData( elem, name, data, true );
	},

	_removeData: function( elem, name ) {
		return internalRemoveData( elem, name, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		// Do not set data on non-element because it will not be cleared (#8335).
		if ( elem.nodeType && elem.nodeType !== 1 && elem.nodeType !== 9 ) {
			return false;
		}

		var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

		// nodes accept data unless otherwise specified; rejection can be conditional
		return !noData || noData !== true && elem.getAttribute("classid") === noData;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var attrs, name,
			data = null,
			i = 0,
			elem = this[0];

		// Special expections of .data basically thwart jQuery.access,
		// so implement the relevant behavior ourselves

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					attrs = elem.attributes;
					for ( ; i < attrs.length; i++ ) {
						name = attrs[i].name;

						if ( name.indexOf("data-") === 0 ) {
							name = jQuery.camelCase( name.slice(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		return arguments.length > 1 ?

			// Sets one value
			this.each(function() {
				jQuery.data( this, key, value );
			}) :

			// Gets one value
			// Try to fetch any internally stored data first
			elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : null;
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
						data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}
jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray(data) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				jQuery._removeData( elem, type + "queue" );
				jQuery._removeData( elem, key );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var nodeHook, boolHook,
	rclass = /[\t\r\n\f]/g,
	rreturn = /\r/g,
	rfocusable = /^(?:input|select|textarea|button|object)$/i,
	rclickable = /^(?:a|area)$/i,
	ruseDefault = /^(?:checked|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute,
	getSetInput = jQuery.support.input;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}
					elem.className = jQuery.trim( cur );

				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = arguments.length === 0 || typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}
					elem.className = value ? jQuery.trim( cur ) : "";
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					classNames = value.match( core_rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( type === core_strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var ret, hooks, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// Use proper attribute retrieval(#6932, #12072)
				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :
					elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];
					if ( (option.selected = jQuery.inArray( jQuery(option).val(), values ) >= 0) ) {
						optionSet = true;
					}
				}

				// force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attr: function( elem, name, value ) {
		var hooks, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === core_strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {
			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( core_rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {
					// Set corresponding property to false
					if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
						elem[ propName ] = false;
					// Support: IE<9
					// Also clear defaultChecked/defaultSelected (if appropriate)
					} else {
						elem[ jQuery.camelCase( "default-" + name ) ] =
							elem[ propName ] = false;
					}

				// See #9699 for explanation of this approach (setting first, then removal)
				} else {
					jQuery.attr( elem, name, "" );
				}

				elem.removeAttribute( getSetAttribute ? name : propName );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
				ret :
				( elem[ name ] = value );

		} else {
			return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
				ret :
				elem[ name ];
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				return tabindex ?
					parseInt( tabindex, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						-1;
			}
		}
	}
});

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
			// IE<8 needs the *property* name
			elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );

		// Use defaultChecked and defaultSelected for oldIE
		} else {
			elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
		}

		return name;
	}
};
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = jQuery.expr.attrHandle[ name ] || jQuery.find.attr;

	jQuery.expr.attrHandle[ name ] = getSetInput && getSetAttribute || !ruseDefault.test( name ) ?
		function( elem, name, isXML ) {
			var fn = jQuery.expr.attrHandle[ name ],
				ret = isXML ?
					undefined :
					/* jshint eqeqeq: false */
					(jQuery.expr.attrHandle[ name ] = undefined) !=
						getter( elem, name, isXML ) ?

						name.toLowerCase() :
						null;
			jQuery.expr.attrHandle[ name ] = fn;
			return ret;
		} :
		function( elem, name, isXML ) {
			return isXML ?
				undefined :
				elem[ jQuery.camelCase( "default-" + name ) ] ?
					name.toLowerCase() :
					null;
		};
});

// fix oldIE attroperties
if ( !getSetInput || !getSetAttribute ) {
	jQuery.attrHooks.value = {
		set: function( elem, value, name ) {
			if ( jQuery.nodeName( elem, "input" ) ) {
				// Does not return so that setAttribute is also used
				elem.defaultValue = value;
			} else {
				// Use nodeHook if defined (#1954); otherwise setAttribute is fine
				return nodeHook && nodeHook.set( elem, value, name );
			}
		}
	};
}

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = {
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				elem.setAttributeNode(
					(ret = elem.ownerDocument.createAttribute( name ))
				);
			}

			ret.value = value += "";

			// Break association with cloned elements by also using setAttribute (#9646)
			return name === "value" || value === elem.getAttribute( name ) ?
				value :
				undefined;
		}
	};
	jQuery.expr.attrHandle.id = jQuery.expr.attrHandle.name = jQuery.expr.attrHandle.coords =
		// Some attributes are constructed with empty-string values when not defined
		function( elem, name, isXML ) {
			var ret;
			return isXML ?
				undefined :
				(ret = elem.getAttributeNode( name )) && ret.value !== "" ?
					ret.value :
					null;
		};
	jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			return ret && ret.specified ?
				ret.value :
				undefined;
		},
		set: nodeHook.set
	};

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		set: function( elem, value, name ) {
			nodeHook.set( elem, value === "" ? false : value, name );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		};
	});
}


// Some attributes require a special call on IE
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !jQuery.support.hrefNormalized ) {
	// href/src property should get the full normalized URL (#10299/#12915)
	jQuery.each([ "href", "src" ], function( i, name ) {
		jQuery.propHooks[ name ] = {
			get: function( elem ) {
				return elem.getAttribute( name, 4 );
			}
		};
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Note: IE uppercases css property names, but if we were to .toLowerCase()
			// .cssText, that would destroy case senstitivity in URL's, like in "background"
			return elem.style.cssText || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	};
}

jQuery.each([
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
});

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	};
	if ( !jQuery.support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			// Support: Webkit
			// "" is returned instead of "on" if a value isn't specified
			return elem.getAttribute("value") === null ? "on" : elem.value;
		};
	}
});
var rformElems = /^(?:input|select|textarea)$/i,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {
		var tmp, events, t, handleObjIn,
			special, eventHandle, handleObj,
			handlers, type, namespaces, origType,
			elemData = jQuery._data( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {
		var j, handleObj, tmp,
			origCount, t, events,
			special, handlers, type,
			namespaces, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery._removeData( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		var handle, ontype, cur,
			bubbleType, special, tmp, i,
			eventPath = [ elem || document ],
			type = core_hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = core_hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
				jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					try {
						elem[ type ]();
					} catch ( e ) {
						// IE<9 dies on focus/blur to hidden element (#1486,#12518)
						// only reproducible on winXP IE8 native, not IE9 in IE8 mode
					}
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, ret, handleObj, matched, j,
			handlerQueue = [],
			args = core_slice.call( arguments ),
			handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var sel, handleObj, matches, i,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			/* jshint eqeqeq: false */
			for ( ; cur != this; cur = cur.parentNode || this ) {
				/* jshint eqeqeq: true */

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click") ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: IE<9
		// Fix target property (#1925)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Support: Chrome 23+, Safari?
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Support: IE<9
		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
		event.metaKey = !!event.metaKey;

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var body, eventDoc, doc,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					try {
						this.focus();
						return false;
					} catch ( e ) {
						// Support: IE<9
						// If we error on focus to hidden element (#1486, #12518),
						// let .trigger() run the handlers
					}
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Even when returnValue equals to undefined Firefox will still show alert
				if ( event.result !== undefined ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8
			// detachEvent needed property on element, by name of that event, to properly expose it to GC
			if ( typeof elem[ name ] === core_strundefined ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;
		if ( !e ) {
			return;
		}

		// If preventDefault exists, run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// Support: IE
		// Otherwise set the returnValue property of the original event to false
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;
		if ( !e ) {
			return;
		}
		// If stopPropagation exists, run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}

		// Support: IE
		// Set the cancelBubble property of the original event to true
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !jQuery._data( form, "submitBubbles" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					jQuery._data( form, "submitBubbles", true );
				}
			});
			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
						}
						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event, true );
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "changeBubbles" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					jQuery._data( elem, "changeBubbles", true );
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var type, origFn;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});
var isSimple = /^.[^:#\[\.,]*$/,
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	rneedsContext = jQuery.expr.match.needsContext,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var i,
			ret = [],
			self = this,
			len = self.length;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},

	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter(function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector || [], true) );
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector || [], false) );
	},

	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			ret = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[i]; cur && cur !== context; cur = cur.parentNode ) {
				// Always skip document fragments
				if ( cur.nodeType < 11 && (pos ?
					pos.index(cur) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector(cur, selectors)) ) {

					cur = ret.push( cur );
					break;
				}
			}
		}

		return this.pushStack( ret.length > 1 ? jQuery.unique( ret ) : ret );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( jQuery.unique(all) );
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		if ( this.length > 1 ) {
			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				ret = jQuery.unique( ret );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				ret = ret.reverse();
			}
		}

		return this.pushStack( ret );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		var elem = elems[ 0 ];

		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 && elem.nodeType === 1 ?
			jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
			jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
				return elem.nodeType === 1;
			}));
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		});

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		});

	}

	if ( typeof qualifier === "string" ) {
		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) !== not;
	});
}
function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
		safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		area: [ 1, "<map>", "</map>" ],
		param: [ 1, "<object>", "</object>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
		// unless wrapped in a div with non-breaking characters in front of it.
		_default: jQuery.support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>"  ]
	},
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement("div") );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	append: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		var elem,
			elems = selector ? jQuery.filter( selector, this ) : this,
			i = 0;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( !keepData && elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem ) );
			}

			if ( elem.parentNode ) {
				if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
					setGlobalEval( getAll( elem, "script" ) );
				}
				elem.parentNode.removeChild( elem );
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem, false ) );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}

			// If this is a select, ensure that it displays empty (#12336)
			// Support: IE<9
			if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
				elem.options.length = 0;
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[0] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( jQuery.support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						// Remove element nodes and prevent memory leaks
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var
			// Snapshot the DOM in case .domManip sweeps something relevant into its fragment
			args = jQuery.map( this, function( elem ) {
				return [ elem.nextSibling, elem.parentNode ];
			}),
			i = 0;

		// Make the changes, replacing each context element with the new content
		this.domManip( arguments, function( elem ) {
			var next = args[ i++ ],
				parent = args[ i++ ];

			if ( parent ) {
				// Don't use the snapshot next if it has moved (#13810)
				if ( next && next.parentNode !== parent ) {
					next = this.nextSibling;
				}
				jQuery( this ).remove();
				parent.insertBefore( elem, next );
			}
		// Allow new content to include elements from the context set
		}, true );

		// Force removal if there was no new content (e.g., from empty arguments)
		return i ? this : this.remove();
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, callback, allowIntersection ) {

		// Flatten any nested arrays
		args = core_concat.apply( [], args );

		var first, node, hasScripts,
			scripts, doc, fragment,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[0],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction || !( l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[0] = value.call( this, index, self.html() );
				}
				self.domManip( args, callback, allowIntersection );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, !allowIntersection && this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call( this[i], node, i );
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!jQuery._data( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Hope ajax is available...
								jQuery._evalUrl( node.src );
							} else {
								jQuery.globalEval( ( node.text || node.textContent || node.innerHTML || "" ).replace( rcleanScript, "" ) );
							}
						}
					}
				}

				// Fix #11809: Avoid leaking memory
				fragment = first = null;
			}
		}

		return this;
	}
});

// Support: IE<8
// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType === 1 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName("tbody")[0] ||
			elem.appendChild( elem.ownerDocument.createElement("tbody") ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = (jQuery.find.attr( elem, "type" ) !== null) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );
	if ( match ) {
		elem.type = match[1];
	} else {
		elem.removeAttribute("type");
	}
	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var elem,
		i = 0;
	for ( ; (elem = elems[i]) != null; i++ ) {
		jQuery._data( elem, "globalEval", !refElements || jQuery._data( refElements[i], "globalEval" ) );
	}
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function fixCloneNodeIssues( src, dest ) {
	var nodeName, e, data;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 copies events bound via attachEvent when using cloneNode.
	if ( !jQuery.support.noCloneEvent && dest[ jQuery.expando ] ) {
		data = jQuery._data( dest );

		for ( e in data.events ) {
			jQuery.removeEvent( dest, e, data.handle );
		}

		// Event data gets referenced instead of copied if the expando gets copied too
		dest.removeAttribute( jQuery.expando );
	}

	// IE blanks contents when cloning scripts, and tries to evaluate newly-set text
	if ( nodeName === "script" && dest.text !== src.text ) {
		disableScript( dest ).text = src.text;
		restoreScript( dest );

	// IE6-10 improperly clones children of object elements using classid.
	// IE10 throws NoModificationAllowedError if parent is null, #12132.
	} else if ( nodeName === "object" ) {
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( jQuery.support.html5Clone && ( src.innerHTML && !jQuery.trim(dest.innerHTML) ) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && manipulation_rcheckableType.test( src.type ) ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.defaultSelected = dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone(true);
			jQuery( insert[i] )[ original ]( elems );

			// Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
			core_push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});

function getAll( context, tag ) {
	var elems, elem,
		i = 0,
		found = typeof context.getElementsByTagName !== core_strundefined ? context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== core_strundefined ? context.querySelectorAll( tag || "*" ) :
			undefined;

	if ( !found ) {
		for ( found = [], elems = context.childNodes || context; (elem = elems[i]) != null; i++ ) {
			if ( !tag || jQuery.nodeName( elem, tag ) ) {
				found.push( elem );
			} else {
				jQuery.merge( found, getAll( elem, tag ) );
			}
		}
	}

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], found ) :
		found;
}

// Used in buildFragment, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( manipulation_rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var destElements, node, clone, i, srcElements,
			inPage = jQuery.contains( elem.ownerDocument, elem );

		if ( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			// Fix all IE cloning issues
			for ( i = 0; (node = srcElements[i]) != null; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					fixCloneNodeIssues( node, destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0; (node = srcElements[i]) != null; i++ ) {
					cloneCopyEvent( node, destElements[i] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		destElements = srcElements = node = null;

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var j, elem, contains,
			tmp, tag, tbody, wrap,
			l = elems.length,

			// Ensure a safe fragment
			safe = createSafeFragment( context ),

			nodes = [],
			i = 0;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || safe.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;

					tmp.innerHTML = wrap[1] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[2];

					// Descend through wrappers to the right content
					j = wrap[0];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Manually add leading whitespace removed by IE
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[0] ) );
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						elem = tag === "table" && !rtbody.test( elem ) ?
							tmp.firstChild :

							// String was a bare <thead> or <tfoot>
							wrap[1] === "<table>" && !rtbody.test( elem ) ?
								tmp :
								0;

						j = elem && elem.childNodes.length;
						while ( j-- ) {
							if ( jQuery.nodeName( (tbody = elem.childNodes[j]), "tbody" ) && !tbody.childNodes.length ) {
								elem.removeChild( tbody );
							}
						}
					}

					jQuery.merge( nodes, tmp.childNodes );

					// Fix #12392 for WebKit and IE > 9
					tmp.textContent = "";

					// Fix #12392 for oldIE
					while ( tmp.firstChild ) {
						tmp.removeChild( tmp.firstChild );
					}

					// Remember the top-level container for proper cleanup
					tmp = safe.lastChild;
				}
			}
		}

		// Fix #11356: Clear elements from fragment
		if ( tmp ) {
			safe.removeChild( tmp );
		}

		// Reset defaultChecked for any radios and checkboxes
		// about to be appended to the DOM in IE 6/7 (#8060)
		if ( !jQuery.support.appendChecked ) {
			jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
		}

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( safe.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		tmp = null;

		return safe;
	},

	cleanData: function( elems, /* internal */ acceptData ) {
		var elem, type, id, data,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			deleteExpando = jQuery.support.deleteExpando,
			special = jQuery.event.special;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( acceptData || jQuery.acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// IE does not allow us to delete expando properties from nodes,
						// nor does it have a removeAttribute function on Document nodes;
						// we must handle all of these cases
						if ( deleteExpando ) {
							delete elem[ internalKey ];

						} else if ( typeof elem.removeAttribute !== core_strundefined ) {
							elem.removeAttribute( internalKey );

						} else {
							elem[ internalKey ] = null;
						}

						core_deletedIds.push( id );
					}
				}
			}
		}
	},

	_evalUrl: function( url ) {
		return jQuery.ajax({
			url: url,
			type: "GET",
			dataType: "script",
			async: false,
			global: false,
			"throws": true
		});
	}
});
jQuery.fn.extend({
	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	}
});
var iframe, getStyles, curCSS,
	ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity\s*=\s*([^)]*)/,
	rposition = /^(top|right|bottom|left)$/,
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rmargin = /^margin/,
	rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
	rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + core_pnum + ")", "i" ),
	elemdisplay = { BODY: "block" },

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	},

	cssExpand = [ "Top", "Right", "Bottom", "Left" ],
	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function isHidden( elem, el ) {
	// isHidden might be called from jQuery#filter function;
	// in that case, element will be second argument
	elem = el || elem;
	return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = jQuery._data( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = jQuery._data( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
			}
		} else {

			if ( !values[ index ] ) {
				hidden = isHidden( elem );

				if ( display && display !== "none" || !hidden ) {
					jQuery._data( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
				}
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.fn.extend({
	css: function( name, value ) {
		return jQuery.access( this, function( elem, name, value ) {
			var len, styles,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each(function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			if ( !jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {

				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var num, val, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	}
});

// NOTE: we've included the "window" in window.getComputedStyle
// because jsdom on node.js will break without it.
if ( window.getComputedStyle ) {
	getStyles = function( elem ) {
		return window.getComputedStyle( elem, null );
	};

	curCSS = function( elem, name, _computed ) {
		var width, minWidth, maxWidth,
			computed = _computed || getStyles( elem ),

			// getPropertyValue is only needed for .css('filter') in IE9, see #12537
			ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined,
			style = elem.style;

		if ( computed ) {

			if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
			// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
			if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret;
	};
} else if ( document.documentElement.currentStyle ) {
	getStyles = function( elem ) {
		return elem.currentStyle;
	};

	curCSS = function( elem, name, _computed ) {
		var left, rs, rsLeft,
			computed = _computed || getStyles( elem ),
			ret = computed ? computed[ name ] : undefined,
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are proportional to the parent element instead
		// and we can't measure the parent instead because it might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rs = elem.runtimeStyle;
			rsLeft = rs && rs.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				rs.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				rs.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {
			// Use the already-created iframe if possible
			iframe = ( iframe ||
				jQuery("<iframe frameborder='0' width='0' height='0'/>")
				.css( "cssText", "display:block !important" )
			).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[0].contentWindow || iframe[0].contentDocument ).document;
			doc.write("<!doctype html><html><body>");
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}

// Called ONLY from within css_defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
		display = jQuery.css( elem[0], "display" );
	elem.remove();
	return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, "display" ) ) ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			// if value === "", then remove inline opacity #12685
			if ( ( value >= 1 || value === "" ) &&
					jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
					style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there is no filter style applied in a css rule or unset inline opacity, we are done
				if ( value === "" || currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				if ( computed ) {
					// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
					// Work around by temporarily setting element display to inline-block
					return jQuery.swap( elem, { "display": "inline-block" },
						curCSS, [ elem, "marginRight" ] );
				}
			}
		};
	}

	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// getComputedStyle returns percent when specified for top/left/bottom/right
	// rather than make the css module depend on the offset module, we just check for it here
	if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
		jQuery.each( [ "top", "left" ], function( i, prop ) {
			jQuery.cssHooks[ prop ] = {
				get: function( elem, computed ) {
					if ( computed ) {
						computed = curCSS( elem, prop );
						// if curCSS returns percentage, fallback to offset
						return rnumnonpx.test( computed ) ?
							jQuery( elem ).position()[ prop ] + "px" :
							computed;
					}
				}
			};
		});
	}

});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		// Support: Opera <= 12.12
		// Opera reports offsetWidths and offsetHeights less than zero on some elements
		return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 ||
			(!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});
var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function(){
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function(){
			var type = this.type;
			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !manipulation_rcheckableType.test( type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

//Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}
jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.extend({
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	}
});
var
	// Document location
	ajaxLocParts,
	ajaxLocation,
	ajax_nonce = jQuery.now(),

	ajax_rquery = /\?/,
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var deep, key,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, response, type,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = url.slice( off, url.length );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ){
	jQuery.fn[ type ] = function( fn ){
		return this.on( type, fn );
	};
});

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Cross-domain detection vars
			parts,
			// Loop variable
			i,
			// URL without anti-cache param
			cacheURL,
			// Response headers as string
			responseHeadersString,
			// timeout handle
			timeoutTimer,

			// To know if global events are to be dispatched
			fireGlobals,

			transport,
			// Response headers
			responseHeaders,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( core_rnotwhite ) || [""];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + ajax_nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ajax_nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {
	var firstDataType, ct, finalDataType, type,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s[ "throws" ] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}
// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || jQuery("head")[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement("script");

				script.async = true;

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( script.parentNode ) {
							script.parentNode.removeChild( script );
						}

						// Dereference the script
						script = null;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};

				// Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
				// Use native DOM manipulation to avoid our domManip AJAX trickery
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( undefined, true );
				}
			}
		};
	}
});
var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( ajax_nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( ajax_rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});
var xhrCallbacks, xhrSupported,
	xhrId = 0,
	// #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject && function() {
		// Abort all pending requests
		var key;
		for ( key in xhrCallbacks ) {
			xhrCallbacks[ key ]( undefined, true );
		}
	};

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject("Microsoft.XMLHTTP");
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
xhrSupported = jQuery.ajaxSettings.xhr();
jQuery.support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
xhrSupported = jQuery.support.ajax = !!xhrSupported;

// Create transport if the browser can provide an xhr
if ( xhrSupported ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var handle, i,
						xhr = s.xhr();

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers["X-Requested-With"] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( err ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {
						var status, responseHeaders, statusText, responses;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occurred
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									responses = {};
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();

									// When requesting binary data, IE6-9 will throw an exception
									// on any attempt to access responseText (#11426)
									if ( typeof xhr.responseText === "string" ) {
										responses.text = xhr.responseText;
									}

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					if ( !s.async ) {
						// if we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {
						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						setTimeout( callback );
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback( undefined, true );
					}
				}
			};
		}
	});
}
var fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [function( prop, value ) {
			var tween = this.createTween( prop, value ),
				target = tween.cur(),
				parts = rfxnum.exec( value ),
				unit = parts && parts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

				// Starting value computation is required for potential unit mismatches
				start = ( jQuery.cssNumber[ prop ] || unit !== "px" && +target ) &&
					rfxnum.exec( jQuery.css( tween.elem, prop ) ),
				scale = 1,
				maxIterations = 20;

			if ( start && start[ 3 ] !== unit ) {
				// Trust units reported by jQuery.css
				unit = unit || start[ 3 ];

				// Make sure we update the tween properties later on
				parts = parts || [];

				// Iteratively approximate from a nonzero starting point
				start = +target || 1;

				do {
					// If previous iteration zeroed out, double until we get *something*
					// Use a string for doubling factor so we don't accidentally see scale as unchanged below
					scale = scale || ".5";

					// Adjust and apply
					start = start / scale;
					jQuery.style( tween.elem, prop, start + unit );

				// Update scale, tolerating zero or NaN from tween.cur()
				// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
				} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
			}

			// Update tween properties
			if ( parts ) {
				start = tween.start = +start || +target || 0;
				tween.unit = unit;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[ 1 ] ?
					start + ( parts[ 1 ] + 1 ) * parts[ 2 ] :
					+parts[ 2 ];
			}

			return tween;
		}]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( (tween = collection[ index ].call( animation, prop, value )) ) {

			// we're done with this property
			return tween;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = jQuery._data( elem, "fxshow" );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		if ( jQuery.css( elem, "display" ) === "inline" &&
				jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay( elem.nodeName ) === "inline" ) {
				style.display = "inline-block";

			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !jQuery.support.shrinkWrapBlocks ) {
			anim.always(function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			});
		}
	}


	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {
				continue;
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = jQuery._data( elem, "fxshow", {} );
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;
			jQuery._removeData( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}
	}
}

function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9
// Panic based approach to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || jQuery._data( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = jQuery._data( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth? 1 : 0;
	for( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p*Math.PI ) / 2;
	}
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	if ( timer() && jQuery.timers.push( timer ) ) {
		jQuery.fx.start();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}
jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var docElem, win,
		box = { top: 0, left: 0 },
		elem = this[ 0 ],
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return;
	}

	docElem = doc.documentElement;

	// Make sure it's not a disconnected DOM node
	if ( !jQuery.contains( docElem, elem ) ) {
		return box;
	}

	// If we don't have gBCR, just use 0,0 rather than error
	// BlackBerry 5, iOS 3 (original iPhone)
	if ( typeof elem.getBoundingClientRect !== core_strundefined ) {
		box = elem.getBoundingClientRect();
	}
	win = getWindow( doc );
	return {
		top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
		left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
	};
};

jQuery.offset = {

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			parentOffset = { top: 0, left: 0 },
			elem = this[ 0 ];

		// fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// we assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();
		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		return {
			top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true)
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || docElem;
			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position") === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || docElem;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return jQuery.access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});
// Limit scope pollution from any deprecated API
// (function() {

// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;

// })();
if ( typeof module === "object" && module && typeof module.exports === "object" ) {
	// Expose jQuery as module.exports in loaders that implement the Node
	// module pattern (including browserify). Do not create the global, since
	// the user will be storing it themselves locally, and globals are frowned
	// upon in the Node module world.
	module.exports = jQuery;
} else {
	// Otherwise expose jQuery to the global object as usual
	window.jQuery = window.$ = jQuery;

	// Register as a named AMD module, since jQuery can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and jQuery is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of jQuery, it will work.
	if ( typeof define === "function" && define.amd ) {
		define( "jquery", [], function () { return jQuery; } );
	}
}

})( window );
(function($, undefined) {

/**
 * Unobtrusive scripting adapter for jQuery
 * https://github.com/rails/jquery-ujs
 *
 * Requires jQuery 1.7.0 or later.
 *
 * Released under the MIT license
 *
 */

  // Cut down on the number of issues from people inadvertently including jquery_ujs twice
  // by detecting and raising an error when it happens.
  if ( $.rails !== undefined ) {
    $.error('jquery-ujs has already been loaded!');
  }

  // Shorthand to make it a little easier to call public rails functions from within rails.js
  var rails;
  var $document = $(document);

  $.rails = rails = {
    // Link elements bound by jquery-ujs
    linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote], a[data-disable-with]',

    // Button elements boud jquery-ujs
    buttonClickSelector: 'button[data-remote]',

    // Select elements bound by jquery-ujs
    inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',

    // Form elements bound by jquery-ujs
    formSubmitSelector: 'form',

    // Form input elements bound by jquery-ujs
    formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type])',

    // Form input elements disabled during form submission
    disableSelector: 'input[data-disable-with], button[data-disable-with], textarea[data-disable-with]',

    // Form input elements re-enabled after form submission
    enableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled',

    // Form required input elements
    requiredInputSelector: 'input[name][required]:not([disabled]),textarea[name][required]:not([disabled])',

    // Form file input elements
    fileInputSelector: 'input[type=file]',

    // Link onClick disable selector with possible reenable after remote submission
    linkDisableSelector: 'a[data-disable-with]',

    // Make sure that every Ajax request sends the CSRF token
    CSRFProtection: function(xhr) {
      var token = $('meta[name="csrf-token"]').attr('content');
      if (token) xhr.setRequestHeader('X-CSRF-Token', token);
    },

    // Triggers an event on an element and returns false if the event result is false
    fire: function(obj, name, data) {
      var event = $.Event(name);
      obj.trigger(event, data);
      return event.result !== false;
    },

    // Default confirm dialog, may be overridden with custom confirm dialog in $.rails.confirm
    confirm: function(message) {
      return confirm(message);
    },

    // Default ajax function, may be overridden with custom function in $.rails.ajax
    ajax: function(options) {
      return $.ajax(options);
    },

    // Default way to get an element's href. May be overridden at $.rails.href.
    href: function(element) {
      return element.attr('href');
    },

    // Submits "remote" forms and links with ajax
    handleRemote: function(element) {
      var method, url, data, elCrossDomain, crossDomain, withCredentials, dataType, options;

      if (rails.fire(element, 'ajax:before')) {
        elCrossDomain = element.data('cross-domain');
        crossDomain = elCrossDomain === undefined ? null : elCrossDomain;
        withCredentials = element.data('with-credentials') || null;
        dataType = element.data('type') || ($.ajaxSettings && $.ajaxSettings.dataType);

        if (element.is('form')) {
          method = element.attr('method');
          url = element.attr('action');
          data = element.serializeArray();
          // memoized value from clicked submit button
          var button = element.data('ujs:submit-button');
          if (button) {
            data.push(button);
            element.data('ujs:submit-button', null);
          }
        } else if (element.is(rails.inputChangeSelector)) {
          method = element.data('method');
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else if (element.is(rails.buttonClickSelector)) {
          method = element.data('method') || 'get';
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else {
          method = element.data('method');
          url = rails.href(element);
          data = element.data('params') || null;
        }

        options = {
          type: method || 'GET', data: data, dataType: dataType,
          // stopping the "ajax:beforeSend" event will cancel the ajax request
          beforeSend: function(xhr, settings) {
            if (settings.dataType === undefined) {
              xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
            }
            return rails.fire(element, 'ajax:beforeSend', [xhr, settings]);
          },
          success: function(data, status, xhr) {
            element.trigger('ajax:success', [data, status, xhr]);
          },
          complete: function(xhr, status) {
            element.trigger('ajax:complete', [xhr, status]);
          },
          error: function(xhr, status, error) {
            element.trigger('ajax:error', [xhr, status, error]);
          },
          crossDomain: crossDomain
        };

        // There is no withCredentials for IE6-8 when
        // "Enable native XMLHTTP support" is disabled
        if (withCredentials) {
          options.xhrFields = {
            withCredentials: withCredentials
          };
        }

        // Only pass url to `ajax` options if not blank
        if (url) { options.url = url; }

        var jqxhr = rails.ajax(options);
        element.trigger('ajax:send', jqxhr);
        return jqxhr;
      } else {
        return false;
      }
    },

    // Handles "data-method" on links such as:
    // <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
    handleMethod: function(link) {
      var href = rails.href(link),
        method = link.data('method'),
        target = link.attr('target'),
        csrf_token = $('meta[name=csrf-token]').attr('content'),
        csrf_param = $('meta[name=csrf-param]').attr('content'),
        form = $('<form method="post" action="' + href + '"></form>'),
        metadata_input = '<input name="_method" value="' + method + '" type="hidden" />';

      if (csrf_param !== undefined && csrf_token !== undefined) {
        metadata_input += '<input name="' + csrf_param + '" value="' + csrf_token + '" type="hidden" />';
      }

      if (target) { form.attr('target', target); }

      form.hide().append(metadata_input).appendTo('body');
      form.submit();
    },

    /* Disables form elements:
      - Caches element value in 'ujs:enable-with' data store
      - Replaces element text with value of 'data-disable-with' attribute
      - Sets disabled property to true
    */
    disableFormElements: function(form) {
      form.find(rails.disableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        element.data('ujs:enable-with', element[method]());
        element[method](element.data('disable-with'));
        element.prop('disabled', true);
      });
    },

    /* Re-enables disabled form elements:
      - Replaces element text with cached value from 'ujs:enable-with' data store (created in `disableFormElements`)
      - Sets disabled property to false
    */
    enableFormElements: function(form) {
      form.find(rails.enableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        if (element.data('ujs:enable-with')) element[method](element.data('ujs:enable-with'));
        element.prop('disabled', false);
      });
    },

   /* For 'data-confirm' attribute:
      - Fires `confirm` event
      - Shows the confirmation dialog
      - Fires the `confirm:complete` event

      Returns `true` if no function stops the chain and user chose yes; `false` otherwise.
      Attaching a handler to the element's `confirm` event that returns a `falsy` value cancels the confirmation dialog.
      Attaching a handler to the element's `confirm:complete` event that returns a `falsy` value makes this function
      return false. The `confirm:complete` event is fired whether or not the user answered true or false to the dialog.
   */
    allowAction: function(element) {
      var message = element.data('confirm'),
          answer = false, callback;
      if (!message) { return true; }

      if (rails.fire(element, 'confirm')) {
        answer = rails.confirm(message);
        callback = rails.fire(element, 'confirm:complete', [answer]);
      }
      return answer && callback;
    },

    // Helper function which checks for blank inputs in a form that match the specified CSS selector
    blankInputs: function(form, specifiedSelector, nonBlank) {
      var inputs = $(), input, valueToCheck,
          selector = specifiedSelector || 'input,textarea',
          allInputs = form.find(selector);

      allInputs.each(function() {
        input = $(this);
        valueToCheck = input.is('input[type=checkbox],input[type=radio]') ? input.is(':checked') : input.val();
        // If nonBlank and valueToCheck are both truthy, or nonBlank and valueToCheck are both falsey
        if (!valueToCheck === !nonBlank) {

          // Don't count unchecked required radio if other radio with same name is checked
          if (input.is('input[type=radio]') && allInputs.filter('input[type=radio]:checked[name="' + input.attr('name') + '"]').length) {
            return true; // Skip to next input
          }

          inputs = inputs.add(input);
        }
      });
      return inputs.length ? inputs : false;
    },

    // Helper function which checks for non-blank inputs in a form that match the specified CSS selector
    nonBlankInputs: function(form, specifiedSelector) {
      return rails.blankInputs(form, specifiedSelector, true); // true specifies nonBlank
    },

    // Helper function, needed to provide consistent behavior in IE
    stopEverything: function(e) {
      $(e.target).trigger('ujs:everythingStopped');
      e.stopImmediatePropagation();
      return false;
    },

    //  replace element's html with the 'data-disable-with' after storing original html
    //  and prevent clicking on it
    disableElement: function(element) {
      element.data('ujs:enable-with', element.html()); // store enabled state
      element.html(element.data('disable-with')); // set to disabled state
      element.bind('click.railsDisable', function(e) { // prevent further clicking
        return rails.stopEverything(e);
      });
    },

    // restore element to its original state which was disabled by 'disableElement' above
    enableElement: function(element) {
      if (element.data('ujs:enable-with') !== undefined) {
        element.html(element.data('ujs:enable-with')); // set to old enabled state
        element.removeData('ujs:enable-with'); // clean up cache
      }
      element.unbind('click.railsDisable'); // enable element
    }

  };

  if (rails.fire($document, 'rails:attachBindings')) {

    $.ajaxPrefilter(function(options, originalOptions, xhr){ if ( !options.crossDomain ) { rails.CSRFProtection(xhr); }});

    $document.delegate(rails.linkDisableSelector, 'ajax:complete', function() {
        rails.enableElement($(this));
    });

    $document.delegate(rails.linkClickSelector, 'click.rails', function(e) {
      var link = $(this), method = link.data('method'), data = link.data('params');
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      if (link.is(rails.linkDisableSelector)) rails.disableElement(link);

      if (link.data('remote') !== undefined) {
        if ( (e.metaKey || e.ctrlKey) && (!method || method === 'GET') && !data ) { return true; }

        var handleRemote = rails.handleRemote(link);
        // response from rails.handleRemote() will either be false or a deferred object promise.
        if (handleRemote === false) {
          rails.enableElement(link);
        } else {
          handleRemote.error( function() { rails.enableElement(link); } );
        }
        return false;

      } else if (link.data('method')) {
        rails.handleMethod(link);
        return false;
      }
    });

    $document.delegate(rails.buttonClickSelector, 'click.rails', function(e) {
      var button = $(this);
      if (!rails.allowAction(button)) return rails.stopEverything(e);

      rails.handleRemote(button);
      return false;
    });

    $document.delegate(rails.inputChangeSelector, 'change.rails', function(e) {
      var link = $(this);
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      rails.handleRemote(link);
      return false;
    });

    $document.delegate(rails.formSubmitSelector, 'submit.rails', function(e) {
      var form = $(this),
        remote = form.data('remote') !== undefined,
        blankRequiredInputs = rails.blankInputs(form, rails.requiredInputSelector),
        nonBlankFileInputs = rails.nonBlankInputs(form, rails.fileInputSelector);

      if (!rails.allowAction(form)) return rails.stopEverything(e);

      // skip other logic when required values are missing or file upload is present
      if (blankRequiredInputs && form.attr("novalidate") == undefined && rails.fire(form, 'ajax:aborted:required', [blankRequiredInputs])) {
        return rails.stopEverything(e);
      }

      if (remote) {
        if (nonBlankFileInputs) {
          // slight timeout so that the submit button gets properly serialized
          // (make it easy for event handler to serialize form without disabled values)
          setTimeout(function(){ rails.disableFormElements(form); }, 13);
          var aborted = rails.fire(form, 'ajax:aborted:file', [nonBlankFileInputs]);

          // re-enable form elements if event bindings return false (canceling normal form submission)
          if (!aborted) { setTimeout(function(){ rails.enableFormElements(form); }, 13); }

          return aborted;
        }

        rails.handleRemote(form);
        return false;

      } else {
        // slight timeout so that the submit button gets properly serialized
        setTimeout(function(){ rails.disableFormElements(form); }, 13);
      }
    });

    $document.delegate(rails.formInputClickSelector, 'click.rails', function(event) {
      var button = $(this);

      if (!rails.allowAction(button)) return rails.stopEverything(event);

      // register the pressed submit button
      var name = button.attr('name'),
        data = name ? {name:name, value:button.val()} : null;

      button.closest('form').data('ujs:submit-button', data);
    });

    $document.delegate(rails.formSubmitSelector, 'ajax:beforeSend.rails', function(event) {
      if (this == event.target) rails.disableFormElements($(this));
    });

    $document.delegate(rails.formSubmitSelector, 'ajax:complete.rails', function(event) {
      if (this == event.target) rails.enableFormElements($(this));
    });

    $(function(){
      // making sure that all forms have actual up-to-date token(cached forms contain old one)
      var csrf_token = $('meta[name=csrf-token]').attr('content');
      var csrf_param = $('meta[name=csrf-param]').attr('content');
      $('form input[name="' + csrf_param + '"]').val(csrf_token);
    });
  }

})( jQuery );
/*
 * Foundation Responsive Library
 * http://foundation.zurb.com
 * Copyright 2013, ZURB
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
*/


(function ($, window, document, undefined) {
  'use strict';

  // Used to retrieve Foundation media queries from CSS.
  if($('head').has('.foundation-mq-small').length === 0) {
    $('head').append('<meta class="foundation-mq-small">');
  }

  if($('head').has('.foundation-mq-medium').length === 0) {
    $('head').append('<meta class="foundation-mq-medium">');
  }

  if($('head').has('.foundation-mq-large').length === 0) {
    $('head').append('<meta class="foundation-mq-large">');
  }

  if($('head').has('.foundation-mq-xlarge').length === 0) {
    $('head').append('<meta class="foundation-mq-xlarge">');
  }

  if($('head').has('.foundation-mq-xxlarge').length === 0) {
    $('head').append('<meta class="foundation-mq-xxlarge">');
  }

  // Embed FastClick (this should be removed later)
  function FastClick(layer){'use strict';var oldOnClick,self=this;this.trackingClick=false;this.trackingClickStart=0;this.targetElement=null;this.touchStartX=0;this.touchStartY=0;this.lastTouchIdentifier=0;this.touchBoundary=10;this.layer=layer;if(!layer||!layer.nodeType){throw new TypeError('Layer must be a document node');}this.onClick=function(){return FastClick.prototype.onClick.apply(self,arguments)};this.onMouse=function(){return FastClick.prototype.onMouse.apply(self,arguments)};this.onTouchStart=function(){return FastClick.prototype.onTouchStart.apply(self,arguments)};this.onTouchMove=function(){return FastClick.prototype.onTouchMove.apply(self,arguments)};this.onTouchEnd=function(){return FastClick.prototype.onTouchEnd.apply(self,arguments)};this.onTouchCancel=function(){return FastClick.prototype.onTouchCancel.apply(self,arguments)};if(FastClick.notNeeded(layer)){return}if(this.deviceIsAndroid){layer.addEventListener('mouseover',this.onMouse,true);layer.addEventListener('mousedown',this.onMouse,true);layer.addEventListener('mouseup',this.onMouse,true)}layer.addEventListener('click',this.onClick,true);layer.addEventListener('touchstart',this.onTouchStart,false);layer.addEventListener('touchmove',this.onTouchMove,false);layer.addEventListener('touchend',this.onTouchEnd,false);layer.addEventListener('touchcancel',this.onTouchCancel,false);if(!Event.prototype.stopImmediatePropagation){layer.removeEventListener=function(type,callback,capture){var rmv=Node.prototype.removeEventListener;if(type==='click'){rmv.call(layer,type,callback.hijacked||callback,capture)}else{rmv.call(layer,type,callback,capture)}};layer.addEventListener=function(type,callback,capture){var adv=Node.prototype.addEventListener;if(type==='click'){adv.call(layer,type,callback.hijacked||(callback.hijacked=function(event){if(!event.propagationStopped){callback(event)}}),capture)}else{adv.call(layer,type,callback,capture)}}}if(typeof layer.onclick==='function'){oldOnClick=layer.onclick;layer.addEventListener('click',function(event){oldOnClick(event)},false);layer.onclick=null}}FastClick.prototype.deviceIsAndroid=navigator.userAgent.indexOf('Android')>0;FastClick.prototype.deviceIsIOS=/iP(ad|hone|od)/.test(navigator.userAgent);FastClick.prototype.deviceIsIOS4=FastClick.prototype.deviceIsIOS&&(/OS 4_\d(_\d)?/).test(navigator.userAgent);FastClick.prototype.deviceIsIOSWithBadTarget=FastClick.prototype.deviceIsIOS&&(/OS ([6-9]|\d{2})_\d/).test(navigator.userAgent);FastClick.prototype.needsClick=function(target){'use strict';switch(target.nodeName.toLowerCase()){case'button':case'select':case'textarea':if(target.disabled){return true}break;case'input':if((this.deviceIsIOS&&target.type==='file')||target.disabled){return true}break;case'label':case'video':return true}return(/\bneedsclick\b/).test(target.className)};FastClick.prototype.needsFocus=function(target){'use strict';switch(target.nodeName.toLowerCase()){case'textarea':case'select':return true;case'input':switch(target.type){case'button':case'checkbox':case'file':case'image':case'radio':case'submit':return false}return!target.disabled&&!target.readOnly;default:return(/\bneedsfocus\b/).test(target.className)}};FastClick.prototype.sendClick=function(targetElement,event){'use strict';var clickEvent,touch;if(document.activeElement&&document.activeElement!==targetElement){document.activeElement.blur()}touch=event.changedTouches[0];clickEvent=document.createEvent('MouseEvents');clickEvent.initMouseEvent('click',true,true,window,1,touch.screenX,touch.screenY,touch.clientX,touch.clientY,false,false,false,false,0,null);clickEvent.forwardedTouchEvent=true;targetElement.dispatchEvent(clickEvent)};FastClick.prototype.focus=function(targetElement){'use strict';var length;if(this.deviceIsIOS&&targetElement.setSelectionRange){length=targetElement.value.length;targetElement.setSelectionRange(length,length)}else{targetElement.focus()}};FastClick.prototype.updateScrollParent=function(targetElement){'use strict';var scrollParent,parentElement;scrollParent=targetElement.fastClickScrollParent;if(!scrollParent||!scrollParent.contains(targetElement)){parentElement=targetElement;do{if(parentElement.scrollHeight>parentElement.offsetHeight){scrollParent=parentElement;targetElement.fastClickScrollParent=parentElement;break}parentElement=parentElement.parentElement}while(parentElement)}if(scrollParent){scrollParent.fastClickLastScrollTop=scrollParent.scrollTop}};FastClick.prototype.getTargetElementFromEventTarget=function(eventTarget){'use strict';if(eventTarget.nodeType===Node.TEXT_NODE){return eventTarget.parentNode}return eventTarget};FastClick.prototype.onTouchStart=function(event){'use strict';var targetElement,touch,selection;if(event.targetTouches.length>1){return true}targetElement=this.getTargetElementFromEventTarget(event.target);touch=event.targetTouches[0];if(this.deviceIsIOS){selection=window.getSelection();if(selection.rangeCount&&!selection.isCollapsed){return true}if(!this.deviceIsIOS4){if(touch.identifier===this.lastTouchIdentifier){event.preventDefault();return false}this.lastTouchIdentifier=touch.identifier;this.updateScrollParent(targetElement)}}this.trackingClick=true;this.trackingClickStart=event.timeStamp;this.targetElement=targetElement;this.touchStartX=touch.pageX;this.touchStartY=touch.pageY;if((event.timeStamp-this.lastClickTime)<200){event.preventDefault()}return true};FastClick.prototype.touchHasMoved=function(event){'use strict';var touch=event.changedTouches[0],boundary=this.touchBoundary;if(Math.abs(touch.pageX-this.touchStartX)>boundary||Math.abs(touch.pageY-this.touchStartY)>boundary){return true}return false};FastClick.prototype.onTouchMove=function(event){'use strict';if(!this.trackingClick){return true}if(this.targetElement!==this.getTargetElementFromEventTarget(event.target)||this.touchHasMoved(event)){this.trackingClick=false;this.targetElement=null}return true};FastClick.prototype.findControl=function(labelElement){'use strict';if(labelElement.control!==undefined){return labelElement.control}if(labelElement.htmlFor){return document.getElementById(labelElement.htmlFor)}return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea')};FastClick.prototype.onTouchEnd=function(event){'use strict';var forElement,trackingClickStart,targetTagName,scrollParent,touch,targetElement=this.targetElement;if(!this.trackingClick){return true}if((event.timeStamp-this.lastClickTime)<200){this.cancelNextClick=true;return true}this.lastClickTime=event.timeStamp;trackingClickStart=this.trackingClickStart;this.trackingClick=false;this.trackingClickStart=0;if(this.deviceIsIOSWithBadTarget){touch=event.changedTouches[0];targetElement=document.elementFromPoint(touch.pageX-window.pageXOffset,touch.pageY-window.pageYOffset)||targetElement;targetElement.fastClickScrollParent=this.targetElement.fastClickScrollParent}targetTagName=targetElement.tagName.toLowerCase();if(targetTagName==='label'){forElement=this.findControl(targetElement);if(forElement){this.focus(targetElement);if(this.deviceIsAndroid){return false}targetElement=forElement}}else if(this.needsFocus(targetElement)){if((event.timeStamp-trackingClickStart)>100||(this.deviceIsIOS&&window.top!==window&&targetTagName==='input')){this.targetElement=null;return false}this.focus(targetElement);if(!this.deviceIsIOS4||targetTagName!=='select'){this.targetElement=null;event.preventDefault()}return false}if(this.deviceIsIOS&&!this.deviceIsIOS4){scrollParent=targetElement.fastClickScrollParent;if(scrollParent&&scrollParent.fastClickLastScrollTop!==scrollParent.scrollTop){return true}}if(!this.needsClick(targetElement)){event.preventDefault();this.sendClick(targetElement,event)}return false};FastClick.prototype.onTouchCancel=function(){'use strict';this.trackingClick=false;this.targetElement=null};FastClick.prototype.onMouse=function(event){'use strict';if(!this.targetElement){return true}if(event.forwardedTouchEvent){return true}if(!event.cancelable){return true}if(!this.needsClick(this.targetElement)||this.cancelNextClick){if(event.stopImmediatePropagation){event.stopImmediatePropagation()}else{event.propagationStopped=true}event.stopPropagation();event.preventDefault();return false}return true};FastClick.prototype.onClick=function(event){'use strict';var permitted;if(this.trackingClick){this.targetElement=null;this.trackingClick=false;return true}if(event.target.type==='submit'&&event.detail===0){return true}permitted=this.onMouse(event);if(!permitted){this.targetElement=null}return permitted};FastClick.prototype.destroy=function(){'use strict';var layer=this.layer;if(this.deviceIsAndroid){layer.removeEventListener('mouseover',this.onMouse,true);layer.removeEventListener('mousedown',this.onMouse,true);layer.removeEventListener('mouseup',this.onMouse,true)}layer.removeEventListener('click',this.onClick,true);layer.removeEventListener('touchstart',this.onTouchStart,false);layer.removeEventListener('touchmove',this.onTouchMove,false);layer.removeEventListener('touchend',this.onTouchEnd,false);layer.removeEventListener('touchcancel',this.onTouchCancel,false)};FastClick.notNeeded=function(layer){'use strict';var metaViewport;if(typeof window.ontouchstart==='undefined'){return true}if((/Chrome\/[0-9]+/).test(navigator.userAgent)){if(FastClick.prototype.deviceIsAndroid){metaViewport=document.querySelector('meta[name=viewport]');if(metaViewport&&metaViewport.content.indexOf('user-scalable=no')!==-1){return true}}else{return true}}if(layer.style.msTouchAction==='none'){return true}return false};FastClick.attach=function(layer){'use strict';return new FastClick(layer)};if(typeof define!=='undefined'&&define.amd){define(function(){'use strict';return FastClick})}else if(typeof module!=='undefined'&&module.exports){module.exports=FastClick.attach;module.exports.FastClick=FastClick}else{window.FastClick=FastClick}


  // Enable FastClick
  if(typeof FastClick !== 'undefined') {
    FastClick.attach(document.body);
  }

  // private Fast Selector wrapper,
  // returns jQuery object. Only use where
  // getElementById is not available.
  var S = function (selector, context) {
    if (typeof selector === 'string') {
      if (context) {
        return $(context.querySelectorAll(selector));
      }

      return $(document.querySelectorAll(selector));
    }

    return $(selector, context);
  };

  /*
    https://github.com/paulirish/matchMedia.js
  */

  window.matchMedia = window.matchMedia || (function( doc, undefined ) {

    "use strict";

    var bool,
        docElem = doc.documentElement,
        refNode = docElem.firstElementChild || docElem.firstChild,
        // fakeBody required for <FF4 when executed in <head>
        fakeBody = doc.createElement( "body" ),
        div = doc.createElement( "div" );

    div.id = "mq-test-1";
    div.style.cssText = "position:absolute;top:-100em";
    fakeBody.style.background = "none";
    fakeBody.appendChild(div);

    return function(q){

      div.innerHTML = "&shy;<style media=\"" + q + "\"> #mq-test-1 { width: 42px; }</style>";

      docElem.insertBefore( fakeBody, refNode );
      bool = div.offsetWidth === 42;
      docElem.removeChild( fakeBody );

      return {
        matches: bool,
        media: q
      };

    };

  }( document ));

  /*
   * jquery.requestAnimationFrame
   * https://github.com/gnarf37/jquery-requestAnimationFrame
   * Requires jQuery 1.8+
   *
   * Copyright (c) 2012 Corey Frang
   * Licensed under the MIT license.
   */

  (function( $ ) {

  // requestAnimationFrame polyfill adapted from Erik Möller
  // fixes from Paul Irish and Tino Zijdel
  // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
  // http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating


  var animating,
    lastTime = 0,
    vendors = ['webkit', 'moz'],
    requestAnimationFrame = window.requestAnimationFrame,
    cancelAnimationFrame = window.cancelAnimationFrame;

  for(; lastTime < vendors.length && !requestAnimationFrame; lastTime++) {
    requestAnimationFrame = window[ vendors[lastTime] + "RequestAnimationFrame" ];
    cancelAnimationFrame = cancelAnimationFrame ||
      window[ vendors[lastTime] + "CancelAnimationFrame" ] || 
      window[ vendors[lastTime] + "CancelRequestAnimationFrame" ];
  }

  function raf() {
    if ( animating ) {
      requestAnimationFrame( raf );
      jQuery.fx.tick();
    }
  }

  if ( requestAnimationFrame ) {
    // use rAF
    window.requestAnimationFrame = requestAnimationFrame;
    window.cancelAnimationFrame = cancelAnimationFrame;
    jQuery.fx.timer = function( timer ) {
      if ( timer() && jQuery.timers.push( timer ) && !animating ) {
        animating = true;
        raf();
      }
    };

    jQuery.fx.stop = function() {
      animating = false;
    };
  } else {
    // polyfill
    window.requestAnimationFrame = function( callback, element ) {
      var currTime = new Date().getTime(),
        timeToCall = Math.max( 0, 16 - ( currTime - lastTime ) ),
        id = window.setTimeout( function() {
          callback( currTime + timeToCall );
        }, timeToCall );
      lastTime = currTime + timeToCall;
      return id;
    };

    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
      
  }

  }( jQuery ));


  function removeQuotes (string) {
    if (typeof string === 'string' || string instanceof String) {
      string = string.replace(/^[\\/'"]+|(;\s?})+|[\\/'"]+$/g, '');
    }

    return string;
  }

  window.Foundation = {
    name : 'Foundation',

    version : '5.0.0',

    media_queries : {
      small : S('.foundation-mq-small').css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, ''),
      medium : S('.foundation-mq-medium').css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, ''),
      large : S('.foundation-mq-large').css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, ''),
      xlarge: S('.foundation-mq-xlarge').css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, ''),
      xxlarge: S('.foundation-mq-xxlarge').css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, '')
    },

    stylesheet : $('<style></style>').appendTo('head')[0].sheet,

    init : function (scope, libraries, method, options, response) {
      var library_arr,
          args = [scope, method, options, response],
          responses = [];

      // check RTL
      this.rtl = /rtl/i.test(S('html').attr('dir'));

      // set foundation global scope
      this.scope = scope || this.scope;

      if (libraries && typeof libraries === 'string' && !/reflow/i.test(libraries)) {
        if (this.libs.hasOwnProperty(libraries)) {
          responses.push(this.init_lib(libraries, args));
        }
      } else {
        for (var lib in this.libs) {
          responses.push(this.init_lib(lib, libraries));
        }
      }

      return scope;
    },

    init_lib : function (lib, args) {
      if (this.libs.hasOwnProperty(lib)) {
        this.patch(this.libs[lib]);

        if (args && args.hasOwnProperty(lib)) {
          return this.libs[lib].init.apply(this.libs[lib], [this.scope, args[lib]]);
        }

        return this.libs[lib].init.apply(this.libs[lib], args);
      }

      return function () {};
    },

    patch : function (lib) {
      lib.scope = this.scope;
      lib['data_options'] = this.lib_methods.data_options;
      lib['bindings'] = this.lib_methods.bindings;
      lib['S'] = S;
      lib.rtl = this.rtl;
    },

    inherit : function (scope, methods) {
      var methods_arr = methods.split(' ');

      for (var i = methods_arr.length - 1; i >= 0; i--) {
        if (this.lib_methods.hasOwnProperty(methods_arr[i])) {
          this.libs[scope.name][methods_arr[i]] = this.lib_methods[methods_arr[i]];
        }
      }
    },

    random_str : function (length) {
      var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

      if (!length) {
        length = Math.floor(Math.random() * chars.length);
      }

      var str = '';
      for (var i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
      }
      return str;
    },

    libs : {},

    // methods that can be inherited in libraries
    lib_methods : {
      throttle : function(fun, delay) {
        var timer = null;

        return function () {
          var context = this, args = arguments;

          clearTimeout(timer);
          timer = setTimeout(function () {
            fun.apply(context, args);
          }, delay);
        };
      },

      // parses data-options attribute
      data_options : function (el) {
        var opts = {}, ii, p, opts_arr, opts_len,
            data_options = el.data('options');

        if (typeof data_options === 'object') {
          return data_options;
        }

        opts_arr = (data_options || ':').split(';'),
        opts_len = opts_arr.length;

        function isNumber (o) {
          return ! isNaN (o-0) && o !== null && o !== "" && o !== false && o !== true;
        }

        function trim(str) {
          if (typeof str === 'string') return $.trim(str);
          return str;
        }

        // parse options
        for (ii = opts_len - 1; ii >= 0; ii--) {
          p = opts_arr[ii].split(':');

          if (/true/i.test(p[1])) p[1] = true;
          if (/false/i.test(p[1])) p[1] = false;
          if (isNumber(p[1])) p[1] = parseInt(p[1], 10);

          if (p.length === 2 && p[0].length > 0) {
            opts[trim(p[0])] = trim(p[1]);
          }
        }

        return opts;
      },

      delay : function (fun, delay) {
        return setTimeout(fun, delay);
      },

      // test for empty object or array
      empty : function (obj) {
        if (obj.length && obj.length > 0)    return false;
        if (obj.length && obj.length === 0)  return true;

        for (var key in obj) {
          if (hasOwnProperty.call(obj, key))    return false;
        }

        return true;
      },

      register_media : function(media, media_class) {
        if(Foundation.media_queries[media] === undefined) {
          $('head').append('<meta class="' + media_class + '">');
          Foundation.media_queries[media] = removeQuotes($('.' + media_class).css('font-family'));
        }
      },

      addCustomRule : function(rule, media) {
        if(media === undefined) {
          Foundation.stylesheet.insertRule(rule, Foundation.stylesheet.cssRules.length);
        } else {
          var query = Foundation.media_queries[media];
          if(query !== undefined) {
            Foundation.stylesheet.insertRule('@media ' + 
              Foundation.media_queries[media] + '{ ' + rule + ' }');
          }
        }
      },

      loaded : function (image, callback) {
        function loaded () {
          callback(image[0]);
        }

        function bindLoad () {
          this.one('load', loaded);

          if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
            var src = this.attr( 'src' ),
                param = src.match( /\?/ ) ? '&' : '?';

            param += 'random=' + (new Date()).getTime();
            this.attr('src', src + param);
          }
        }

        if (!image.attr('src')) {
          loaded();
          return;
        }

        if (image[0].complete || image[0].readyState === 4) {
          loaded();
        } else {
          bindLoad.call(image);
        }
      },

      bindings : function (method, options) {
        var self = this,
            should_bind_events = !S(this).data(this.name + '-init');

        if (typeof method === 'string') {
          return this[method].call(this);
        }

        if (S(this.scope).is('[data-' + this.name +']')) {
          S(this.scope).data(this.name + '-init', $.extend({}, this.settings, (options || method), this.data_options(S(this.scope))));

          if (should_bind_events) {
            this.events(this.scope);
          }

        } else {
          S('[data-' + this.name + ']', this.scope).each(function () {
            var should_bind_events = !S(this).data(self.name + '-init');

            S(this).data(self.name + '-init', $.extend({}, self.settings, (options || method), self.data_options(S(this))));

            if (should_bind_events) {
              self.events(this);
            }
          });
        }
      }
    }
  };

  $.fn.foundation = function () {
    var args = Array.prototype.slice.call(arguments, 0);

    return this.each(function () {
      Foundation.init.apply(Foundation, [this].concat(args));
      return this;
    });
  };

}(jQuery, this, this.document));
;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.topbar = {
    name : 'topbar',

    version: '5.0.1',

    settings : {
      index : 0,
      sticky_class : 'sticky',
      custom_back_text: true,
      back_text: 'Back',
      is_hover: true,
      mobile_show_parent_link: false,
      scrolltop : true // jump to top when sticky nav menu toggle is clicked
    },

    init : function (section, method, options) {
      Foundation.inherit(this, 'addCustomRule register_media throttle');
      var self = this;

      self.register_media('topbar', 'foundation-mq-topbar');

      this.bindings(method, options);

      $('[data-topbar]', this.scope).each(function () {
        var topbar = $(this),
            settings = topbar.data('topbar-init'),
            section = $('section', this),
            titlebar = $('> ul', this).first();

        topbar.data('index', 0);

        var topbarContainer = topbar.parent();
        if(topbarContainer.hasClass('fixed') || topbarContainer.hasClass(settings.sticky_class)) {
          self.settings.sticky_class = settings.sticky_class;
          self.settings.stick_topbar = topbar;
          topbar.data('height', topbarContainer.outerHeight());
          topbar.data('stickyoffset', topbarContainer.offset().top);
        } else {
          topbar.data('height', topbar.outerHeight());
        }

        if (!settings.assembled) self.assemble(topbar);

        if (settings.is_hover) {
          $('.has-dropdown', topbar).addClass('not-click');
        } else {
          $('.has-dropdown', topbar).removeClass('not-click');
        }

        // Pad body when sticky (scrolled) or fixed.
        self.addCustomRule('.f-topbar-fixed { padding-top: ' + topbar.data('height') + 'px }');

        if (topbarContainer.hasClass('fixed')) {
          $('body').addClass('f-topbar-fixed');
        }
      });

    },

    toggle: function (toggleEl) {
      var self = this;

      if (toggleEl) {
        var topbar = $(toggleEl).closest('[data-topbar]');
      } else {
        var topbar = $('[data-topbar]');
      }

      var settings = topbar.data('topbar-init');

      var section = $('section, .section', topbar);

      if (self.breakpoint()) {
        if (!self.rtl) {
          section.css({left: '0%'});
          $('>.name', section).css({left: '100%'});
        } else {
          section.css({right: '0%'});
          $('>.name', section).css({right: '100%'});
        }

        $('li.moved', section).removeClass('moved');
        topbar.data('index', 0);

        topbar
          .toggleClass('expanded')
          .css('height', '');
      }

      if (settings.scrolltop) {
        if (!topbar.hasClass('expanded')) {
          if (topbar.hasClass('fixed')) {
            topbar.parent().addClass('fixed');
            topbar.removeClass('fixed');
            $('body').addClass('f-topbar-fixed');
          }
        } else if (topbar.parent().hasClass('fixed')) {
          if (settings.scrolltop) {
            topbar.parent().removeClass('fixed');
            topbar.addClass('fixed');
            $('body').removeClass('f-topbar-fixed');

            window.scrollTo(0,0);
          } else {
              topbar.parent().removeClass('expanded');
          }
        }
      } else {
        if(topbar.parent().hasClass(self.settings.sticky_class)) {
          topbar.parent().addClass('fixed');
        }

        if(topbar.parent().hasClass('fixed')) {
          if (!topbar.hasClass('expanded')) {
            topbar.removeClass('fixed');
            topbar.parent().removeClass('expanded');
            self.update_sticky_positioning();
          } else {
            topbar.addClass('fixed');
            topbar.parent().addClass('expanded');
          }
        }
      }
    },

    timer : null,

    events : function (bar) {
      var self = this;
      $(this.scope)
        .off('.topbar')
        .on('click.fndtn.topbar', '[data-topbar] .toggle-topbar', function (e) {
          e.preventDefault();
          self.toggle(this);
        })
        .on('click.fndtn.topbar', '[data-topbar] li.has-dropdown', function (e) {
          var li = $(this),
              target = $(e.target),
              topbar = li.closest('[data-topbar]'),
              settings = topbar.data('topbar-init');

          if(target.data('revealId')) {
            self.toggle();
            return;
          }

          if (self.breakpoint()) return;
          if (settings.is_hover && !Modernizr.touch) return;

          e.stopImmediatePropagation();

          if (li.hasClass('hover')) {
            li
              .removeClass('hover')
              .find('li')
              .removeClass('hover');

            li.parents('li.hover')
              .removeClass('hover');
          } else {
            li.addClass('hover');

            if (target[0].nodeName === 'A' && target.parent().hasClass('has-dropdown')) {
              e.preventDefault();
            }
          }
        })
        .on('click.fndtn.topbar', '[data-topbar] .has-dropdown>a', function (e) {
          if (self.breakpoint()) {

            e.preventDefault();

            var $this = $(this),
                topbar = $this.closest('[data-topbar]'),
                section = topbar.find('section, .section'),
                dropdownHeight = $this.next('.dropdown').outerHeight(),
                $selectedLi = $this.closest('li');

            topbar.data('index', topbar.data('index') + 1);
            $selectedLi.addClass('moved');

            if (!self.rtl) {
              section.css({left: -(100 * topbar.data('index')) + '%'});
              section.find('>.name').css({left: 100 * topbar.data('index') + '%'});
            } else {
              section.css({right: -(100 * topbar.data('index')) + '%'});
              section.find('>.name').css({right: 100 * topbar.data('index') + '%'});
            }

            topbar.css('height', $this.siblings('ul').outerHeight(true) + topbar.data('height'));
          }
        });
      
      $(window).off('.topbar').on('resize.fndtn.topbar', self.throttle(function () {
        self.resize.call(self);
      }, 50)).trigger('resize');

      $('body').off('.topbar').on('click.fndtn.topbar touchstart.fndtn.topbar', function (e) {
        var parent = $(e.target).closest('li').closest('li.hover');

        if (parent.length > 0) {
          return;
        }

        $('[data-topbar] li').removeClass('hover');
      });

      // Go up a level on Click
      $(this.scope).on('click.fndtn.topbar', '[data-topbar] .has-dropdown .back', function (e) {
        e.preventDefault();

        var $this = $(this),
            topbar = $this.closest('[data-topbar]'),
            section = topbar.find('section, .section'),
            settings = topbar.data('topbar-init'),
            $movedLi = $this.closest('li.moved'),
            $previousLevelUl = $movedLi.parent();

        topbar.data('index', topbar.data('index') - 1);

        if (!self.rtl) {
          section.css({left: -(100 * topbar.data('index')) + '%'});
          section.find('>.name').css({left: 100 * topbar.data('index') + '%'});
        } else {
          section.css({right: -(100 * topbar.data('index')) + '%'});
          section.find('>.name').css({right: 100 * topbar.data('index') + '%'});
        }

        if (topbar.data('index') === 0) {
          topbar.css('height', '');
        } else {
          topbar.css('height', $previousLevelUl.outerHeight(true) + topbar.data('height'));
        }

        setTimeout(function () {
          $movedLi.removeClass('moved');
        }, 300);
      });
    },

    resize : function () {
      var self = this;
      $('[data-topbar]').each(function () {
        var topbar = $(this),
            settings = topbar.data('topbar-init');

        var stickyContainer = topbar.parent('.' + self.settings.sticky_class);
        var stickyOffset;

        if (!self.breakpoint()) {
          var doToggle = topbar.hasClass('expanded');
          topbar
            .css('height', '')
            .removeClass('expanded')
            .find('li')
            .removeClass('hover');

            if(doToggle) {
              self.toggle(topbar);
            }
        }

        if(stickyContainer.length > 0) {
          if(stickyContainer.hasClass('fixed')) {
            // Remove the fixed to allow for correct calculation of the offset.
            stickyContainer.removeClass('fixed');

            stickyOffset = stickyContainer.offset().top;
            if($(document.body).hasClass('f-topbar-fixed')) {
              stickyOffset -= topbar.data('height');
            }

            topbar.data('stickyoffset', stickyOffset);
            stickyContainer.addClass('fixed');
          } else {
            stickyOffset = stickyContainer.offset().top;
            topbar.data('stickyoffset', stickyOffset);
          }
        }

      });
    },

    breakpoint : function () {
      return !matchMedia(Foundation.media_queries['topbar']).matches;
    },

    assemble : function (topbar) {
      var self = this,
          settings = topbar.data('topbar-init'),
          section = $('section', topbar),
          titlebar = $('> ul', topbar).first();

      // Pull element out of the DOM for manipulation
      section.detach();

      $('.has-dropdown>a', section).each(function () {
        var $link = $(this),
            $dropdown = $link.siblings('.dropdown'),
            url = $link.attr('href');

        if (settings.mobile_show_parent_link && url && url.length > 1) {
          var $titleLi = $('<li class="title back js-generated"><h5><a href="#"></a></h5></li><li><a class="parent-link js-generated" href="' + url + '">' + $link.text() +'</a></li>');
        } else {
          var $titleLi = $('<li class="title back js-generated"><h5><a href="#"></a></h5></li>');
        }

        // Copy link to subnav
        if (settings.custom_back_text == true) {
          $('h5>a', $titleLi).html(settings.back_text);
        } else {
          $('h5>a', $titleLi).html('&laquo; ' + $link.html());
        }
        $dropdown.prepend($titleLi);
      });

      // Put element back in the DOM
      section.appendTo(topbar);

      // check for sticky
      this.sticky();

      this.assembled(topbar);
    },

    assembled : function (topbar) {
      topbar.data('topbar-init', $.extend({}, topbar.data('topbar-init'), {assembled: true}));
    },

    height : function (ul) {
      var total = 0,
          self = this;

      $('> li', ul).each(function () { total += $(this).outerHeight(true); });

      return total;
    },

    sticky : function () {
      var $window = $(window),
          self = this;

      $(window).on('scroll', function() {
        self.update_sticky_positioning();
      });
    },

    update_sticky_positioning: function() {
      var klass = '.' + this.settings.sticky_class;
      var $window = $(window);

      if ($(klass).length > 0) {
        var distance = this.settings.sticky_topbar.data('stickyoffset');
        if (!$(klass).hasClass('expanded')) {
          if ($window.scrollTop() > (distance)) {
            if (!$(klass).hasClass('fixed')) {
              $(klass).addClass('fixed');
              $('body').addClass('f-topbar-fixed');
            }
          } else if ($window.scrollTop() <= distance) {
            if ($(klass).hasClass('fixed')) {
              $(klass).removeClass('fixed');
              $('body').removeClass('f-topbar-fixed');
            }
          }
        }
      }
    },

    off : function () {
      $(this.scope).off('.fndtn.topbar');
      $(window).off('.fndtn.topbar');
    },

    reflow : function () {}
  };
}(jQuery, this, this.document));
;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.tooltip = {
    name : 'tooltip',

    version : '5.0.0',

    settings : {
      additional_inheritable_classes : [],
      tooltip_class : '.tooltip',
      append_to: 'body',
      touch_close_text: 'Tap To Close',
      disable_for_touch: false,
      tip_template : function (selector, content) {
        return '<span data-selector="' + selector + '" class="' 
          + Foundation.libs.tooltip.settings.tooltip_class.substring(1) 
          + '">' + content + '<span class="nub"></span></span>';
      }
    },

    cache : {},

    init : function (scope, method, options) {
      this.bindings(method, options);
    },

    events : function () {
      var self = this;

      if (Modernizr.touch) {
        $(this.scope)
          .off('.tooltip')
          .on('click.fndtn.tooltip touchstart.fndtn.tooltip touchend.fndtn.tooltip', 
            '[data-tooltip]', function (e) {
            var settings = $.extend({}, self.settings, self.data_options($(this)));
            if (!settings.disable_for_touch) {
              e.preventDefault();
              $(settings.tooltip_class).hide();
              self.showOrCreateTip($(this));
            }
          })
          .on('click.fndtn.tooltip touchstart.fndtn.tooltip touchend.fndtn.tooltip', 
            this.settings.tooltip_class, function (e) {
            e.preventDefault();
            $(this).fadeOut(150);
          });
      } else {
        $(this.scope)
          .off('.tooltip')
          .on('mouseenter.fndtn.tooltip mouseleave.fndtn.tooltip', 
            '[data-tooltip]', function (e) {
            var $this = $(this);

            if (/enter|over/i.test(e.type)) {
              self.showOrCreateTip($this);
            } else if (e.type === 'mouseout' || e.type === 'mouseleave') {
              self.hide($this);
            }
          });
      }
    },

    showOrCreateTip : function ($target) {
      var $tip = this.getTip($target);

      if ($tip && $tip.length > 0) {
        return this.show($target);
      }

      return this.create($target);
    },

    getTip : function ($target) {
      var selector = this.selector($target),
          tip = null;

      if (selector) {
        tip = $('span[data-selector="' + selector + '"]' + this.settings.tooltip_class);
      }

      return (typeof tip === 'object') ? tip : false;
    },

    selector : function ($target) {
      var id = $target.attr('id'),
          dataSelector = $target.attr('data-tooltip') || $target.attr('data-selector');

      if ((id && id.length < 1 || !id) && typeof dataSelector != 'string') {
        dataSelector = 'tooltip' + Math.random().toString(36).substring(7);
        $target.attr('data-selector', dataSelector);
      }

      return (id && id.length > 0) ? id : dataSelector;
    },

    create : function ($target) {
      var $tip = $(this.settings.tip_template(this.selector($target), $('<div></div>').html($target.attr('title')).html())),
          classes = this.inheritable_classes($target);

      $tip.addClass(classes).appendTo(this.settings.append_to);
      if (Modernizr.touch) {
        $tip.append('<span class="tap-to-close">'+this.settings.touch_close_text+'</span>');
      }
      $target.removeAttr('title').attr('title','');
      this.show($target);
    },

    reposition : function (target, tip, classes) {
      var width, nub, nubHeight, nubWidth, column, objPos;

      tip.css('visibility', 'hidden').show();

      width = target.data('width');
      nub = tip.children('.nub');
      nubHeight = nub.outerHeight();
      nubWidth = nub.outerHeight();

      objPos = function (obj, top, right, bottom, left, width) {
        return obj.css({
          'top' : (top) ? top : 'auto',
          'bottom' : (bottom) ? bottom : 'auto',
          'left' : (left) ? left : 'auto',
          'right' : (right) ? right : 'auto',
          'width' : (width) ? width : 'auto'
        }).end();
      };

      objPos(tip, (target.offset().top + target.outerHeight() + 10), 'auto', 'auto', target.offset().left, width);

      if (this.small()) {
        objPos(tip, (target.offset().top + target.outerHeight() + 10), 'auto', 'auto', 12.5, $(this.scope).width());
        tip.addClass('tip-override');
        objPos(nub, -nubHeight, 'auto', 'auto', target.offset().left);
      } else {
        var left = target.offset().left;
        if (Foundation.rtl) {
          left = target.offset().left + target.offset().width - tip.outerWidth();
        }
        objPos(tip, (target.offset().top + target.outerHeight() + 10), 'auto', 'auto', left, width);
        tip.removeClass('tip-override');
        if (classes && classes.indexOf('tip-top') > -1) {
          objPos(tip, (target.offset().top - tip.outerHeight()), 'auto', 'auto', left, width)
            .removeClass('tip-override');
        } else if (classes && classes.indexOf('tip-left') > -1) {
          objPos(tip, (target.offset().top + (target.outerHeight() / 2) - nubHeight*2.5), 'auto', 'auto', (target.offset().left - tip.outerWidth() - nubHeight), width)
            .removeClass('tip-override');
        } else if (classes && classes.indexOf('tip-right') > -1) {
          objPos(tip, (target.offset().top + (target.outerHeight() / 2) - nubHeight*2.5), 'auto', 'auto', (target.offset().left + target.outerWidth() + nubHeight), width)
            .removeClass('tip-override');
        }
      }

      tip.css('visibility', 'visible').hide();
    },

    small : function () {
      return matchMedia(Foundation.media_queries.small).matches;
    },

    inheritable_classes : function (target) {
      var inheritables = ['tip-top', 'tip-left', 'tip-bottom', 'tip-right', 'noradius'].concat(this.settings.additional_inheritable_classes),
          classes = target.attr('class'),
          filtered = classes ? $.map(classes.split(' '), function (el, i) {
            if ($.inArray(el, inheritables) !== -1) {
              return el;
            }
          }).join(' ') : '';

      return $.trim(filtered);
    },

    show : function ($target) {
      var $tip = this.getTip($target);

      this.reposition($target, $tip, $target.attr('class'));
      $tip.fadeIn(150);
    },

    hide : function ($target) {
      var $tip = this.getTip($target);

      $tip.fadeOut(150);
    },

    // deprecate reload
    reload : function () {
      var $self = $(this);

      return ($self.data('fndtn-tooltips')) ? $self.foundationTooltips('destroy').foundationTooltips('init') : $self.foundationTooltips('init');
    },

    off : function () {
      $(this.scope).off('.fndtn.tooltip');
      $(this.settings.tooltip_class).each(function (i) {
        $('[data-tooltip]').get(i).attr('title', $(this).text());
      }).remove();
    },

    reflow : function () {}
  };
}(jQuery, this, this.document));
(function() {
  var CSRFToken, allowLinkExtensions, anchoredLink, browserCompatibleDocumentParser, browserIsntBuggy, browserSupportsCustomEvents, browserSupportsPushState, browserSupportsTurbolinks, cacheCurrentPage, cacheSize, changePage, constrainPageCacheTo, createDocument, crossOriginLink, currentState, enableTransitionCache, executeScriptTags, extractLink, extractTitleAndBody, fetch, fetchHistory, fetchReplacement, handleClick, historyStateIsDefined, htmlExtensions, ignoreClick, initializeTurbolinks, installClickHandlerLast, installDocumentReadyPageEventTriggers, installHistoryChangeHandler, installJqueryAjaxSuccessPageUpdateTrigger, loadedAssets, noTurbolink, nonHtmlLink, nonStandardClick, pageCache, pageChangePrevented, pagesCached, popCookie, processResponse, recallScrollPosition, referer, reflectNewUrl, reflectRedirectedUrl, rememberCurrentState, rememberCurrentUrl, rememberReferer, removeHash, removeHashForIE10compatiblity, removeNoscriptTags, requestMethodIsSafe, resetScrollPosition, targetLink, transitionCacheEnabled, transitionCacheFor, triggerEvent, visit, xhr, _ref,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __slice = [].slice;

  pageCache = {};

  cacheSize = 10;

  transitionCacheEnabled = false;

  currentState = null;

  loadedAssets = null;

  htmlExtensions = ['html'];

  referer = null;

  createDocument = null;

  xhr = null;

  fetch = function(url) {
    var cachedPage;
    rememberReferer();
    cacheCurrentPage();
    reflectNewUrl(url);
    if (transitionCacheEnabled && (cachedPage = transitionCacheFor(url))) {
      fetchHistory(cachedPage);
      return fetchReplacement(url);
    } else {
      return fetchReplacement(url, resetScrollPosition);
    }
  };

  transitionCacheFor = function(url) {
    var cachedPage;
    cachedPage = pageCache[url];
    if (cachedPage && !cachedPage.transitionCacheDisabled) {
      return cachedPage;
    }
  };

  enableTransitionCache = function(enable) {
    if (enable == null) {
      enable = true;
    }
    return transitionCacheEnabled = enable;
  };

  fetchReplacement = function(url, onLoadFunction) {
    var _this = this;
    if (onLoadFunction == null) {
      onLoadFunction = function() {};
    }
    triggerEvent('page:fetch', {
      url: url
    });
    if (xhr != null) {
      xhr.abort();
    }
    xhr = new XMLHttpRequest;
    xhr.open('GET', removeHashForIE10compatiblity(url), true);
    xhr.setRequestHeader('Accept', 'text/html, application/xhtml+xml, application/xml');
    xhr.setRequestHeader('X-XHR-Referer', referer);
    xhr.onload = function() {
      var doc;
      triggerEvent('page:receive');
      if (doc = processResponse()) {
        changePage.apply(null, extractTitleAndBody(doc));
        reflectRedirectedUrl();
        onLoadFunction();
        return triggerEvent('page:load');
      } else {
        return document.location.href = url;
      }
    };
    xhr.onloadend = function() {
      return xhr = null;
    };
    xhr.onerror = function() {
      return document.location.href = url;
    };
    return xhr.send();
  };

  fetchHistory = function(cachedPage) {
    if (xhr != null) {
      xhr.abort();
    }
    changePage(cachedPage.title, cachedPage.body);
    recallScrollPosition(cachedPage);
    return triggerEvent('page:restore');
  };

  cacheCurrentPage = function() {
    pageCache[currentState.url] = {
      url: document.location.href,
      body: document.body,
      title: document.title,
      positionY: window.pageYOffset,
      positionX: window.pageXOffset,
      cachedAt: new Date().getTime(),
      transitionCacheDisabled: document.querySelector('[data-no-transition-cache]') != null
    };
    return constrainPageCacheTo(cacheSize);
  };

  pagesCached = function(size) {
    if (size == null) {
      size = cacheSize;
    }
    if (/^[\d]+$/.test(size)) {
      return cacheSize = parseInt(size);
    }
  };

  constrainPageCacheTo = function(limit) {
    var cacheTimesRecentFirst, key, pageCacheKeys, _i, _len, _results;
    pageCacheKeys = Object.keys(pageCache);
    cacheTimesRecentFirst = pageCacheKeys.map(function(url) {
      return pageCache[url].cachedAt;
    }).sort(function(a, b) {
      return b - a;
    });
    _results = [];
    for (_i = 0, _len = pageCacheKeys.length; _i < _len; _i++) {
      key = pageCacheKeys[_i];
      if (!(pageCache[key].cachedAt <= cacheTimesRecentFirst[limit])) {
        continue;
      }
      triggerEvent('page:expire', pageCache[key]);
      _results.push(delete pageCache[key]);
    }
    return _results;
  };

  changePage = function(title, body, csrfToken, runScripts) {
    document.title = title;
    document.documentElement.replaceChild(body, document.body);
    if (csrfToken != null) {
      CSRFToken.update(csrfToken);
    }
    if (runScripts) {
      executeScriptTags();
    }
    currentState = window.history.state;
    triggerEvent('page:change');
    return triggerEvent('page:update');
  };

  executeScriptTags = function() {
    var attr, copy, nextSibling, parentNode, script, scripts, _i, _j, _len, _len1, _ref, _ref1;
    scripts = Array.prototype.slice.call(document.body.querySelectorAll('script:not([data-turbolinks-eval="false"])'));
    for (_i = 0, _len = scripts.length; _i < _len; _i++) {
      script = scripts[_i];
      if (!((_ref = script.type) === '' || _ref === 'text/javascript')) {
        continue;
      }
      copy = document.createElement('script');
      _ref1 = script.attributes;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        attr = _ref1[_j];
        copy.setAttribute(attr.name, attr.value);
      }
      copy.appendChild(document.createTextNode(script.innerHTML));
      parentNode = script.parentNode, nextSibling = script.nextSibling;
      parentNode.removeChild(script);
      parentNode.insertBefore(copy, nextSibling);
    }
  };

  removeNoscriptTags = function(node) {
    node.innerHTML = node.innerHTML.replace(/<noscript[\S\s]*?<\/noscript>/ig, '');
    return node;
  };

  reflectNewUrl = function(url) {
    if (url !== referer) {
      return window.history.pushState({
        turbolinks: true,
        url: url
      }, '', url);
    }
  };

  reflectRedirectedUrl = function() {
    var location, preservedHash;
    if (location = xhr.getResponseHeader('X-XHR-Redirected-To')) {
      preservedHash = removeHash(location) === location ? document.location.hash : '';
      return window.history.replaceState(currentState, '', location + preservedHash);
    }
  };

  rememberReferer = function() {
    return referer = document.location.href;
  };

  rememberCurrentUrl = function() {
    return window.history.replaceState({
      turbolinks: true,
      url: document.location.href
    }, '', document.location.href);
  };

  rememberCurrentState = function() {
    return currentState = window.history.state;
  };

  recallScrollPosition = function(page) {
    return window.scrollTo(page.positionX, page.positionY);
  };

  resetScrollPosition = function() {
    if (document.location.hash) {
      return document.location.href = document.location.href;
    } else {
      return window.scrollTo(0, 0);
    }
  };

  removeHashForIE10compatiblity = function(url) {
    return removeHash(url);
  };

  removeHash = function(url) {
    var link;
    link = url;
    if (url.href == null) {
      link = document.createElement('A');
      link.href = url;
    }
    return link.href.replace(link.hash, '');
  };

  popCookie = function(name) {
    var value, _ref;
    value = ((_ref = document.cookie.match(new RegExp(name + "=(\\w+)"))) != null ? _ref[1].toUpperCase() : void 0) || '';
    document.cookie = name + '=; expires=Thu, 01-Jan-70 00:00:01 GMT; path=/';
    return value;
  };

  triggerEvent = function(name, data) {
    var event;
    event = document.createEvent('Events');
    if (data) {
      event.data = data;
    }
    event.initEvent(name, true, true);
    return document.dispatchEvent(event);
  };

  pageChangePrevented = function() {
    return !triggerEvent('page:before-change');
  };

  processResponse = function() {
    var assetsChanged, clientOrServerError, doc, extractTrackAssets, intersection, validContent;
    clientOrServerError = function() {
      var _ref;
      return (400 <= (_ref = xhr.status) && _ref < 600);
    };
    validContent = function() {
      return xhr.getResponseHeader('Content-Type').match(/^(?:text\/html|application\/xhtml\+xml|application\/xml)(?:;|$)/);
    };
    extractTrackAssets = function(doc) {
      var node, _i, _len, _ref, _results;
      _ref = doc.head.childNodes;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        if ((typeof node.getAttribute === "function" ? node.getAttribute('data-turbolinks-track') : void 0) != null) {
          _results.push(node.getAttribute('src') || node.getAttribute('href'));
        }
      }
      return _results;
    };
    assetsChanged = function(doc) {
      var fetchedAssets;
      loadedAssets || (loadedAssets = extractTrackAssets(document));
      fetchedAssets = extractTrackAssets(doc);
      return fetchedAssets.length !== loadedAssets.length || intersection(fetchedAssets, loadedAssets).length !== loadedAssets.length;
    };
    intersection = function(a, b) {
      var value, _i, _len, _ref, _results;
      if (a.length > b.length) {
        _ref = [b, a], a = _ref[0], b = _ref[1];
      }
      _results = [];
      for (_i = 0, _len = a.length; _i < _len; _i++) {
        value = a[_i];
        if (__indexOf.call(b, value) >= 0) {
          _results.push(value);
        }
      }
      return _results;
    };
    if (!clientOrServerError() && validContent()) {
      doc = createDocument(xhr.responseText);
      if (doc && !assetsChanged(doc)) {
        return doc;
      }
    }
  };

  extractTitleAndBody = function(doc) {
    var title;
    title = doc.querySelector('title');
    return [title != null ? title.textContent : void 0, removeNoscriptTags(doc.body), CSRFToken.get(doc).token, 'runScripts'];
  };

  CSRFToken = {
    get: function(doc) {
      var tag;
      if (doc == null) {
        doc = document;
      }
      return {
        node: tag = doc.querySelector('meta[name="csrf-token"]'),
        token: tag != null ? typeof tag.getAttribute === "function" ? tag.getAttribute('content') : void 0 : void 0
      };
    },
    update: function(latest) {
      var current;
      current = this.get();
      if ((current.token != null) && (latest != null) && current.token !== latest) {
        return current.node.setAttribute('content', latest);
      }
    }
  };

  browserCompatibleDocumentParser = function() {
    var createDocumentUsingDOM, createDocumentUsingParser, createDocumentUsingWrite, e, testDoc, _ref;
    createDocumentUsingParser = function(html) {
      return (new DOMParser).parseFromString(html, 'text/html');
    };
    createDocumentUsingDOM = function(html) {
      var doc;
      doc = document.implementation.createHTMLDocument('');
      doc.documentElement.innerHTML = html;
      return doc;
    };
    createDocumentUsingWrite = function(html) {
      var doc;
      doc = document.implementation.createHTMLDocument('');
      doc.open('replace');
      doc.write(html);
      doc.close();
      return doc;
    };
    try {
      if (window.DOMParser) {
        testDoc = createDocumentUsingParser('<html><body><p>test');
        return createDocumentUsingParser;
      }
    } catch (_error) {
      e = _error;
      testDoc = createDocumentUsingDOM('<html><body><p>test');
      return createDocumentUsingDOM;
    } finally {
      if ((testDoc != null ? (_ref = testDoc.body) != null ? _ref.childNodes.length : void 0 : void 0) !== 1) {
        return createDocumentUsingWrite;
      }
    }
  };

  installClickHandlerLast = function(event) {
    if (!event.defaultPrevented) {
      document.removeEventListener('click', handleClick, false);
      return document.addEventListener('click', handleClick, false);
    }
  };

  handleClick = function(event) {
    var link;
    if (!event.defaultPrevented) {
      link = extractLink(event);
      if (link.nodeName === 'A' && !ignoreClick(event, link)) {
        if (!pageChangePrevented()) {
          visit(link.href);
        }
        return event.preventDefault();
      }
    }
  };

  extractLink = function(event) {
    var link;
    link = event.target;
    while (!(!link.parentNode || link.nodeName === 'A')) {
      link = link.parentNode;
    }
    return link;
  };

  crossOriginLink = function(link) {
    return location.protocol !== link.protocol || location.host !== link.host;
  };

  anchoredLink = function(link) {
    return ((link.hash && removeHash(link)) === removeHash(location)) || (link.href === location.href + '#');
  };

  nonHtmlLink = function(link) {
    var url;
    url = removeHash(link);
    return url.match(/\.[a-z]+(\?.*)?$/g) && !url.match(new RegExp("\\.(?:" + (htmlExtensions.join('|')) + ")?(\\?.*)?$", 'g'));
  };

  noTurbolink = function(link) {
    var ignore;
    while (!(ignore || link === document)) {
      ignore = link.getAttribute('data-no-turbolink') != null;
      link = link.parentNode;
    }
    return ignore;
  };

  targetLink = function(link) {
    return link.target.length !== 0;
  };

  nonStandardClick = function(event) {
    return event.which > 1 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
  };

  ignoreClick = function(event, link) {
    return crossOriginLink(link) || anchoredLink(link) || nonHtmlLink(link) || noTurbolink(link) || targetLink(link) || nonStandardClick(event);
  };

  allowLinkExtensions = function() {
    var extension, extensions, _i, _len;
    extensions = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    for (_i = 0, _len = extensions.length; _i < _len; _i++) {
      extension = extensions[_i];
      htmlExtensions.push(extension);
    }
    return htmlExtensions;
  };

  installDocumentReadyPageEventTriggers = function() {
    return document.addEventListener('DOMContentLoaded', (function() {
      triggerEvent('page:change');
      return triggerEvent('page:update');
    }), true);
  };

  installJqueryAjaxSuccessPageUpdateTrigger = function() {
    if (typeof jQuery !== 'undefined') {
      return jQuery(document).on('ajaxSuccess', function(event, xhr, settings) {
        if (!jQuery.trim(xhr.responseText)) {
          return;
        }
        return triggerEvent('page:update');
      });
    }
  };

  installHistoryChangeHandler = function(event) {
    var cachedPage, _ref;
    if ((_ref = event.state) != null ? _ref.turbolinks : void 0) {
      if (cachedPage = pageCache[event.state.url]) {
        cacheCurrentPage();
        return fetchHistory(cachedPage);
      } else {
        return visit(event.target.location.href);
      }
    }
  };

  initializeTurbolinks = function() {
    rememberCurrentUrl();
    rememberCurrentState();
    createDocument = browserCompatibleDocumentParser();
    document.addEventListener('click', installClickHandlerLast, true);
    return window.addEventListener('popstate', installHistoryChangeHandler, false);
  };

  historyStateIsDefined = window.history.state !== void 0 || navigator.userAgent.match(/Firefox\/26/);

  browserSupportsPushState = window.history && window.history.pushState && window.history.replaceState && historyStateIsDefined;

  browserIsntBuggy = !navigator.userAgent.match(/CriOS\//);

  requestMethodIsSafe = (_ref = popCookie('request_method')) === 'GET' || _ref === '';

  browserSupportsTurbolinks = browserSupportsPushState && browserIsntBuggy && requestMethodIsSafe;

  browserSupportsCustomEvents = document.addEventListener && document.createEvent;

  if (browserSupportsCustomEvents) {
    installDocumentReadyPageEventTriggers();
    installJqueryAjaxSuccessPageUpdateTrigger();
  }

  if (browserSupportsTurbolinks) {
    visit = fetch;
    initializeTurbolinks();
  } else {
    visit = function(url) {
      return document.location.href = url;
    };
  }

  this.Turbolinks = {
    visit: visit,
    pagesCached: pagesCached,
    enableTransitionCache: enableTransitionCache,
    allowLinkExtensions: allowLinkExtensions,
    supported: browserSupportsTurbolinks
  };

}).call(this);
//
// ChemDoodle Web Components 6.0.0
//
// http://web.chemdoodle.com
//
// Copyright 2009-2013 iChemLabs, LLC.  All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// As a special exception to the GPL, any HTML file in a public website
// or any free web service which merely makes function calls to this
// code, and for that purpose includes it by reference, shall be deemed
// a separate work for copyright law purposes. If you modify this code,
// you may extend this exception to your version of the code, but you
// are not obligated to do so. If you do not wish to do so, delete this
// exception statement from your version.
//
// As an additional exception to the GPL, you may distribute this
// packed form of the code without the copy of the GPL license normally
// required, provided you include this license notice and a URL through
// which recipients can access the corresponding unpacked source code.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// Please contact iChemLabs <http://www.ichemlabs.com/contact-us> for
// alternate licensing options.
//
var ChemDoodle=function(){var b={iChemLabs:{},informatics:{},io:{},lib:{},structures:{}};b.structures.d2={};b.structures.d3={};b.getVersion=function(){return"6.0.0"};return b}();
(function(b,j,m){function l(x){var a=x.length,c=o.type(x);return o.isWindow(x)?!1:1===x.nodeType&&a?!0:"array"===c||"function"!==c&&(0===a||"number"===typeof a&&0<a&&a-1 in x)}function g(x,a,c,h){if(o.acceptData(x)){var e=o.expando,f=x.nodeType,d=f?o.cache:x,b=f?x[e]:x[e]&&e;if(b&&d[b]&&(h||d[b].data)||!(c===m&&"string"===typeof a)){b||(b=f?x[e]=ha.pop()||o.guid++:e);d[b]||(d[b]=f?{}:{toJSON:o.noop});if("object"===typeof a||"function"===typeof a)h?d[b]=o.extend(d[b],a):d[b].data=o.extend(d[b].data,
a);x=d[b];h||(x.data||(x.data={}),x=x.data);c!==m&&(x[o.camelCase(a)]=c);"string"===typeof a?(c=x[a],null==c&&(c=x[o.camelCase(a)])):c=x;return c}}}function d(x,c,h){if(o.acceptData(x)){var e,d,f=x.nodeType,b=f?o.cache:x,k=f?x[o.expando]:o.expando;if(b[k]){if(c&&(e=h?b[k]:b[k].data)){o.isArray(c)?c=c.concat(o.map(c,o.camelCase)):c in e?c=[c]:(c=o.camelCase(c),c=c in e?[c]:c.split(" "));for(d=c.length;d--;)delete e[c[d]];if(h?!a(e):!o.isEmptyObject(e))return}if(!h&&(delete b[k].data,!a(b[k])))return;
f?o.cleanData([x],!0):o.support.deleteExpando||b!=b.window?delete b[k]:b[k]=null}}}function f(x,a,c){if(c===m&&1===x.nodeType)if(c="data-"+a.replace(zc,"-$1").toLowerCase(),c=x.getAttribute(c),"string"===typeof c){try{c="true"===c?!0:"false"===c?!1:"null"===c?null:+c+""===c?+c:Ac.test(c)?o.parseJSON(c):c}catch(h){}o.data(x,a,c)}else c=m;return c}function a(x){for(var c in x)if(!("data"===c&&o.isEmptyObject(x[c]))&&"toJSON"!==c)return!1;return!0}function e(){return!0}function t(){return!1}function k(){try{return J.activeElement}catch(x){}}
function q(x,c){do x=x[c];while(x&&1!==x.nodeType);return x}function n(x,c,a){if(o.isFunction(c))return o.grep(x,function(x,h){return!!c.call(x,h,x)!==a});if(c.nodeType)return o.grep(x,function(x){return x===c!==a});if("string"===typeof c){if(Bc.test(c))return o.filter(c,x,a);c=o.filter(c,x)}return o.grep(x,function(x){return 0<=o.inArray(x,c)!==a})}function y(x){var c=Ob.split("|");x=x.createDocumentFragment();if(x.createElement)for(;c.length;)x.createElement(c.pop());return x}function z(x,c){return o.nodeName(x,
"table")&&o.nodeName(1===c.nodeType?c:c.firstChild,"tr")?x.getElementsByTagName("tbody")[0]||x.appendChild(x.ownerDocument.createElement("tbody")):x}function p(x){x.type=(null!==o.find.attr(x,"type"))+"/"+x.type;return x}function u(x){var c=Cc.exec(x.type);c?x.type=c[1]:x.removeAttribute("type");return x}function r(x,c){for(var a,h=0;null!=(a=x[h]);h++)o._data(a,"globalEval",!c||o._data(c[h],"globalEval"))}function v(x,c){if(1===c.nodeType&&o.hasData(x)){var a,h,e;h=o._data(x);var d=o._data(c,h),
f=h.events;if(f)for(a in delete d.handle,d.events={},f){h=0;for(e=f[a].length;h<e;h++)o.event.add(c,a,f[a][h])}d.data&&(d.data=o.extend({},d.data))}}function w(x,c){var a,h,e=0,d=typeof x.getElementsByTagName!==$?x.getElementsByTagName(c||"*"):typeof x.querySelectorAll!==$?x.querySelectorAll(c||"*"):m;if(!d){d=[];for(a=x.childNodes||x;null!=(h=a[e]);e++)!c||o.nodeName(h,c)?d.push(h):o.merge(d,w(h,c))}return c===m||c&&o.nodeName(x,c)?o.merge([x],d):d}function A(x){nb.test(x.type)&&(x.defaultChecked=
x.checked)}function B(x,c){if(c in x)return c;for(var a=c.charAt(0).toUpperCase()+c.slice(1),h=c,e=Pb.length;e--;)if(c=Pb[e]+a,c in x)return c;return h}function c(x,c){x=c||x;return"none"===o.css(x,"display")||!o.contains(x.ownerDocument,x)}function h(x,a){for(var h,e,d,f=[],b=0,k=x.length;b<k;b++)if(e=x[b],e.style)if(f[b]=o._data(e,"olddisplay"),h=e.style.display,a)!f[b]&&"none"===h&&(e.style.display=""),""===e.style.display&&c(e)&&(f[b]=o._data(e,"olddisplay",F(e.nodeName)));else if(!f[b]&&(d=c(e),
h&&"none"!==h||!d))o._data(e,"olddisplay",d?h:o.css(e,"display"));for(b=0;b<k;b++)if(e=x[b],e.style&&(!a||"none"===e.style.display||""===e.style.display))e.style.display=a?f[b]||"":"none";return x}function D(x,c,a){return(x=Dc.exec(c))?Math.max(0,x[1]-(a||0))+(x[2]||"px"):c}function C(x,c,a,h,e){c=a===(h?"border":"content")?4:"width"===c?1:0;for(var d=0;4>c;c+=2)"margin"===a&&(d+=o.css(x,a+Aa[c],!0,e)),h?("content"===a&&(d-=o.css(x,"padding"+Aa[c],!0,e)),"margin"!==a&&(d-=o.css(x,"border"+Aa[c]+"Width",
!0,e))):(d+=o.css(x,"padding"+Aa[c],!0,e),"padding"!==a&&(d+=o.css(x,"border"+Aa[c]+"Width",!0,e)));return d}function H(x,c,a){var h=!0,e="width"===c?x.offsetWidth:x.offsetHeight,d=Ba(x),f=o.support.boxSizing&&"border-box"===o.css(x,"boxSizing",!1,d);if(0>=e||null==e){e=Ca(x,c,d);if(0>e||null==e)e=x.style[c];if(Wa.test(e))return e;h=f&&(o.support.boxSizingReliable||e===x.style[c]);e=parseFloat(e)||0}return e+C(x,c,a||(f?"border":"content"),h,d)+"px"}function F(x){var c=J,a=Qb[x];if(!a){a=G(x,c);if("none"===
a||!a)Qa=(Qa||o("\x3ciframe frameborder\x3d'0' width\x3d'0' height\x3d'0'/\x3e").css("cssText","display:block !important")).appendTo(c.documentElement),c=(Qa[0].contentWindow||Qa[0].contentDocument).document,c.write("\x3c!doctype html\x3e\x3chtml\x3e\x3cbody\x3e"),c.close(),a=G(x,c),Qa.detach();Qb[x]=a}return a}function G(x,c){var a=o(c.createElement(x)).appendTo(c.body),h=o.css(a[0],"display");a.remove();return h}function K(x,c,a,h){var e;if(o.isArray(c))o.each(c,function(c,e){a||Ec.test(x)?h(x,
e):K(x+"["+("object"===typeof e?c:"")+"]",e,a,h)});else if(!a&&"object"===o.type(c))for(e in c)K(x+"["+e+"]",c[e],a,h);else h(x,c)}function I(x){return function(c,a){"string"!==typeof c&&(a=c,c="*");var h,e=0,d=c.toLowerCase().match(pa)||[];if(o.isFunction(a))for(;h=d[e++];)"+"===h[0]?(h=h.slice(1)||"*",(x[h]=x[h]||[]).unshift(a)):(x[h]=x[h]||[]).push(a)}}function W(x,c,a,h){function e(b){var k;d[b]=!0;o.each(x[b]||[],function(x,b){var n=b(c,a,h);if("string"===typeof n&&!f&&!d[n])return c.dataTypes.unshift(n),
e(n),!1;if(f)return!(k=n)});return k}var d={},f=x===ob;return e(c.dataTypes[0])||!d["*"]&&e("*")}function E(x,c){var a,h,e=o.ajaxSettings.flatOptions||{};for(h in c)c[h]!==m&&((e[h]?x:a||(a={}))[h]=c[h]);a&&o.extend(!0,x,a);return x}function N(){try{return new b.XMLHttpRequest}catch(x){}}function P(){setTimeout(function(){Ka=m});return Ka=o.now()}function ca(x,c,a){for(var h,e=(Ra[c]||[]).concat(Ra["*"]),d=0,f=e.length;d<f;d++)if(h=e[d].call(a,c,x))return h}function da(x,c,a){var h,e,d=0,f=Xa.length,
b=o.Deferred().always(function(){delete k.elem}),k=function(){if(e)return!1;for(var c=Ka||P(),c=Math.max(0,n.startTime+n.duration-c),a=1-(c/n.duration||0),h=0,d=n.tweens.length;h<d;h++)n.tweens[h].run(a);b.notifyWith(x,[n,a,c]);if(1>a&&d)return c;b.resolveWith(x,[n]);return!1},n=b.promise({elem:x,props:o.extend({},c),opts:o.extend(!0,{specialEasing:{}},a),originalProperties:c,originalOptions:a,startTime:Ka||P(),duration:a.duration,tweens:[],createTween:function(c,a){var h=o.Tween(x,n.opts,c,a,n.opts.specialEasing[c]||
n.opts.easing);n.tweens.push(h);return h},stop:function(c){var a=0,h=c?n.tweens.length:0;if(e)return this;for(e=!0;a<h;a++)n.tweens[a].run(1);c?b.resolveWith(x,[n,c]):b.rejectWith(x,[n,c]);return this}});c=n.props;a=n.opts.specialEasing;var g,q,t,j;for(h in c)if(g=o.camelCase(h),q=a[g],t=c[h],o.isArray(t)&&(q=t[1],t=c[h]=t[0]),h!==g&&(c[g]=t,delete c[h]),(j=o.cssHooks[g])&&"expand"in j)for(h in t=j.expand(t),delete c[g],t)h in c||(c[h]=t[h],a[h]=q);else a[g]=q;for(;d<f;d++)if(h=Xa[d].call(n,x,c,n.opts))return h;
o.map(c,ca,n);o.isFunction(n.opts.start)&&n.opts.start.call(x,n);o.fx.timer(o.extend(k,{elem:x,anim:n,queue:n.opts.queue}));return n.progress(n.opts.progress).done(n.opts.done,n.opts.complete).fail(n.opts.fail).always(n.opts.always)}function U(x,c,a,h,e){return new U.prototype.init(x,c,a,h,e)}function S(x,c){var a,h={height:x},e=0;for(c=c?1:0;4>e;e+=2-c)a=Aa[e],h["margin"+a]=h["padding"+a]=x;c&&(h.opacity=h.width=x);return h}function ja(x){return o.isWindow(x)?x:9===x.nodeType?x.defaultView||x.parentWindow:
!1}var aa,Sa,$=typeof m,Gc=b.location,J=b.document,ba=J.documentElement,ea=b.jQuery,fa=b.$,X={},ha=[],sa=ha.concat,qa=ha.push,R=ha.slice,Rb=ha.indexOf,Hc=X.toString,La=X.hasOwnProperty,pb="1.10.2".trim,o=function(x,c){return new o.fn.init(x,c,Sa)},Ya=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,pa=/\S+/g,Ic=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,Jc=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,Sb=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,Kc=/^[\],:{}\s]*$/,Lc=/(?:^|:|,)(?:\s*\[)+/g,Mc=/\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
Nc=/"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,Oc=/^-ms-/,Pc=/-([\da-z])/gi,Qc=function(x,c){return c.toUpperCase()},ta=function(x){if(J.addEventListener||"load"===x.type||"complete"===J.readyState)Tb(),o.ready()},Tb=function(){J.addEventListener?(J.removeEventListener("DOMContentLoaded",ta,!1),b.removeEventListener("load",ta,!1)):(J.detachEvent("onreadystatechange",ta),b.detachEvent("onload",ta))};o.fn=o.prototype={jquery:"1.10.2",constructor:o,init:function(x,c,a){var h;if(!x)return this;
if("string"===typeof x){if((h="\x3c"===x.charAt(0)&&"\x3e"===x.charAt(x.length-1)&&3<=x.length?[null,x,null]:Jc.exec(x))&&(h[1]||!c)){if(h[1]){if(c=c instanceof o?c[0]:c,o.merge(this,o.parseHTML(h[1],c&&c.nodeType?c.ownerDocument||c:J,!0)),Sb.test(h[1])&&o.isPlainObject(c))for(h in c)if(o.isFunction(this[h]))this[h](c[h]);else this.attr(h,c[h])}else{if((c=J.getElementById(h[2]))&&c.parentNode){if(c.id!==h[2])return a.find(x);this.length=1;this[0]=c}this.context=J;this.selector=x}return this}return!c||
c.jquery?(c||a).find(x):this.constructor(c).find(x)}if(x.nodeType)return this.context=this[0]=x,this.length=1,this;if(o.isFunction(x))return a.ready(x);x.selector!==m&&(this.selector=x.selector,this.context=x.context);return o.makeArray(x,this)},selector:"",length:0,toArray:function(){return R.call(this)},get:function(x){return null==x?this.toArray():0>x?this[this.length+x]:this[x]},pushStack:function(x){x=o.merge(this.constructor(),x);x.prevObject=this;x.context=this.context;return x},each:function(x,
c){return o.each(this,x,c)},ready:function(x){o.ready.promise().done(x);return this},slice:function(){return this.pushStack(R.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(x){var c=this.length;x=+x+(0>x?c:0);return this.pushStack(0<=x&&x<c?[this[x]]:[])},map:function(x){return this.pushStack(o.map(this,function(c,a){return x.call(c,a,c)}))},end:function(){return this.prevObject||this.constructor(null)},push:qa,sort:[].sort,splice:[].splice};
o.fn.init.prototype=o.fn;o.extend=o.fn.extend=function(){var x,c,a,h,e,d=arguments[0]||{},f=1,b=arguments.length,k=!1;"boolean"===typeof d&&(k=d,d=arguments[1]||{},f=2);"object"!==typeof d&&!o.isFunction(d)&&(d={});b===f&&(d=this,--f);for(;f<b;f++)if(null!=(e=arguments[f]))for(h in e)x=d[h],a=e[h],d!==a&&(k&&a&&(o.isPlainObject(a)||(c=o.isArray(a)))?(c?(c=!1,x=x&&o.isArray(x)?x:[]):x=x&&o.isPlainObject(x)?x:{},d[h]=o.extend(k,x,a)):a!==m&&(d[h]=a));return d};o.extend({expando:"jQuery"+("1.10.2"+Math.random()).replace(/\D/g,
""),noConflict:function(x){b.$===o&&(b.$=fa);x&&b.jQuery===o&&(b.jQuery=ea);return o},isReady:!1,readyWait:1,holdReady:function(x){x?o.readyWait++:o.ready(!0)},ready:function(x){if(!(!0===x?--o.readyWait:o.isReady)){if(!J.body)return setTimeout(o.ready);o.isReady=!0;!0!==x&&0<--o.readyWait||(aa.resolveWith(J,[o]),o.fn.trigger&&o(J).trigger("ready").off("ready"))}},isFunction:function(x){return"function"===o.type(x)},isArray:Array.isArray||function(x){return"array"===o.type(x)},isWindow:function(x){return null!=
x&&x==x.window},isNumeric:function(x){return!isNaN(parseFloat(x))&&isFinite(x)},type:function(x){return null==x?String(x):"object"===typeof x||"function"===typeof x?X[Hc.call(x)]||"object":typeof x},isPlainObject:function(x){var c;if(!x||"object"!==o.type(x)||x.nodeType||o.isWindow(x))return!1;try{if(x.constructor&&!La.call(x,"constructor")&&!La.call(x.constructor.prototype,"isPrototypeOf"))return!1}catch(a){return!1}if(o.support.ownLast)for(c in x)return La.call(x,c);for(c in x);return c===m||La.call(x,
c)},isEmptyObject:function(x){for(var c in x)return!1;return!0},error:function(x){throw Error(x);},parseHTML:function(x,c,a){if(!x||"string"!==typeof x)return null;"boolean"===typeof c&&(a=c,c=!1);c=c||J;var h=Sb.exec(x);a=!a&&[];if(h)return[c.createElement(h[1])];h=o.buildFragment([x],c,a);a&&o(a).remove();return o.merge([],h.childNodes)},parseJSON:function(x){if(b.JSON&&b.JSON.parse)return b.JSON.parse(x);if(null===x)return x;if("string"===typeof x&&(x=o.trim(x))&&Kc.test(x.replace(Mc,"@").replace(Nc,
"]").replace(Lc,"")))return(new Function("return "+x))();o.error("Invalid JSON: "+x)},parseXML:function(x){var c,a;if(!x||"string"!==typeof x)return null;try{b.DOMParser?(a=new DOMParser,c=a.parseFromString(x,"text/xml")):(c=new ActiveXObject("Microsoft.XMLDOM"),c.async="false",c.loadXML(x))}catch(h){c=m}(!c||!c.documentElement||c.getElementsByTagName("parsererror").length)&&o.error("Invalid XML: "+x);return c},noop:function(){},globalEval:function(c){c&&o.trim(c)&&(b.execScript||function(c){b.eval.call(b,
c)})(c)},camelCase:function(c){return c.replace(Oc,"ms-").replace(Pc,Qc)},nodeName:function(c,a){return c.nodeName&&c.nodeName.toLowerCase()===a.toLowerCase()},each:function(c,a,h){var e,d=0,f=c.length;e=l(c);if(h)if(e)for(;d<f&&!(e=a.apply(c[d],h),!1===e);d++);else for(d in c){if(e=a.apply(c[d],h),!1===e)break}else if(e)for(;d<f&&!(e=a.call(c[d],d,c[d]),!1===e);d++);else for(d in c)if(e=a.call(c[d],d,c[d]),!1===e)break;return c},trim:pb&&!pb.call("\ufeff\u00a0")?function(c){return null==c?"":pb.call(c)}:
function(c){return null==c?"":(c+"").replace(Ic,"")},makeArray:function(c,a){var h=a||[];null!=c&&(l(Object(c))?o.merge(h,"string"===typeof c?[c]:c):qa.call(h,c));return h},inArray:function(c,a,h){var e;if(a){if(Rb)return Rb.call(a,c,h);e=a.length;for(h=h?0>h?Math.max(0,e+h):h:0;h<e;h++)if(h in a&&a[h]===c)return h}return-1},merge:function(c,a){var h=a.length,e=c.length,d=0;if("number"===typeof h)for(;d<h;d++)c[e++]=a[d];else for(;a[d]!==m;)c[e++]=a[d++];c.length=e;return c},grep:function(c,a,h){var e,
d=[],f=0,b=c.length;for(h=!!h;f<b;f++)e=!!a(c[f],f),h!==e&&d.push(c[f]);return d},map:function(c,a,h){var e,d=0,f=c.length,b=[];if(l(c))for(;d<f;d++)e=a(c[d],d,h),null!=e&&(b[b.length]=e);else for(d in c)e=a(c[d],d,h),null!=e&&(b[b.length]=e);return sa.apply([],b)},guid:1,proxy:function(c,a){var h,e;"string"===typeof a&&(e=c[a],a=c,c=e);if(!o.isFunction(c))return m;h=R.call(arguments,2);e=function(){return c.apply(a||this,h.concat(R.call(arguments)))};e.guid=c.guid=c.guid||o.guid++;return e},access:function(c,
a,h,e,d,f,b){var k=0,n=c.length,g=null==h;if("object"===o.type(h))for(k in d=!0,h)o.access(c,a,k,h[k],!0,f,b);else if(e!==m&&(d=!0,o.isFunction(e)||(b=!0),g&&(b?(a.call(c,e),a=null):(g=a,a=function(c,a,x){return g.call(o(c),x)})),a))for(;k<n;k++)a(c[k],h,b?e:e.call(c[k],k,a(c[k],h)));return d?c:g?a.call(c):n?a(c[0],h):f},now:function(){return(new Date).getTime()},swap:function(c,a,h,e){var d,f={};for(d in a)f[d]=c.style[d],c.style[d]=a[d];h=h.apply(c,e||[]);for(d in a)c.style[d]=f[d];return h}});
o.ready.promise=function(c){if(!aa)if(aa=o.Deferred(),"complete"===J.readyState)setTimeout(o.ready);else if(J.addEventListener)J.addEventListener("DOMContentLoaded",ta,!1),b.addEventListener("load",ta,!1);else{J.attachEvent("onreadystatechange",ta);b.attachEvent("onload",ta);var a=!1;try{a=null==b.frameElement&&J.documentElement}catch(h){}a&&a.doScroll&&function yc(){if(!o.isReady){try{a.doScroll("left")}catch(c){return setTimeout(yc,50)}Tb();o.ready()}}()}return aa.promise(c)};o.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),
function(c,a){X["[object "+a+"]"]=a.toLowerCase()});Sa=o(J);var qb=b,Q=function(c,a,h,e){var d,f,b,k,n;(a?a.ownerDocument||a:ra)!==Y&&Da(a);a=a||Y;h=h||[];if(!c||"string"!==typeof c)return h;if(1!==(k=a.nodeType)&&9!==k)return[];if(ma&&!e){if(d=Rc.exec(c))if(b=d[1])if(9===k)if((f=a.getElementById(b))&&f.parentNode){if(f.id===b)return h.push(f),h}else return h;else{if(a.ownerDocument&&(f=a.ownerDocument.getElementById(b))&&Ta(a,f)&&f.id===b)return h.push(f),h}else{if(d[2])return ua.apply(h,a.getElementsByTagName(c)),
h;if((b=d[3])&&T.getElementsByClassName&&a.getElementsByClassName)return ua.apply(h,a.getElementsByClassName(b)),h}if(T.qsa&&(!ga||!ga.test(c))){f=d=V;b=a;n=9===k&&c;if(1===k&&"object"!==a.nodeName.toLowerCase()){k=Za(c);(d=a.getAttribute("id"))?f=d.replace(Sc,"\\$\x26"):a.setAttribute("id",f);f="[id\x3d'"+f+"'] ";for(b=k.length;b--;)k[b]=f+$a(k[b]);b=rb.test(c)&&a.parentNode||a;n=k.join(",")}if(n)try{return ua.apply(h,b.querySelectorAll(n)),h}catch(g){}finally{d||a.removeAttribute("id")}}}var q;
a:{c=c.replace(ab,"$1");f=Za(c);if(!e&&1===f.length){d=f[0]=f[0].slice(0);if(2<d.length&&"ID"===(q=d[0]).type&&T.getById&&9===a.nodeType&&ma&&O.relative[d[1].type]){a=(O.find.ID(q.matches[0].replace(va,wa),a)||[])[0];if(!a){q=h;break a}c=c.slice(d.shift().value.length)}for(k=bb.needsContext.test(c)?0:d.length;k--;){q=d[k];if(O.relative[b=q.type])break;if(b=O.find[b])if(e=b(q.matches[0].replace(va,wa),rb.test(d[0].type)&&a.parentNode||a)){d.splice(k,1);c=e.length&&$a(d);if(!c){ua.apply(h,e);q=h;break a}break}}}sb(c,
f)(e,a,!ma,h,rb.test(c));q=h}return q},tb=function(){function c(h,e){a.push(h+=" ")>O.cacheLength&&delete c[a.shift()];return c[h]=e}var a=[];return c},ka=function(c){c[V]=!0;return c},la=function(c){var a=Y.createElement("div");try{return!!c(a)}catch(h){return!1}finally{a.parentNode&&a.parentNode.removeChild(a)}},ub=function(c,a){for(var h=c.split("|"),e=c.length;e--;)O.attrHandle[h[e]]=a},Vb=function(c,a){var h=a&&c,e=h&&1===c.nodeType&&1===a.nodeType&&(~a.sourceIndex||Ub)-(~c.sourceIndex||Ub);
if(e)return e;if(h)for(;h=h.nextSibling;)if(h===a)return-1;return c?1:-1},Tc=function(c){return function(a){return"input"===a.nodeName.toLowerCase()&&a.type===c}},Uc=function(c){return function(a){var h=a.nodeName.toLowerCase();return("input"===h||"button"===h)&&a.type===c}},Ea=function(c){return ka(function(a){a=+a;return ka(function(h,e){for(var d,f=c([],h.length,a),b=f.length;b--;)if(h[d=f[b]])h[d]=!(e[d]=h[d])})})},Wb=function(){},Za=function(c,a){var h,e,d,f,b,k,n;if(b=Xb[c+" "])return a?0:b.slice(0);
b=c;k=[];for(n=O.preFilter;b;){if(!h||(e=Vc.exec(b)))e&&(b=b.slice(e[0].length)||b),k.push(d=[]);h=!1;if(e=Wc.exec(b))h=e.shift(),d.push({value:h,type:e[0].replace(ab," ")}),b=b.slice(h.length);for(f in O.filter)if((e=bb[f].exec(b))&&(!n[f]||(e=n[f](e))))h=e.shift(),d.push({value:h,type:f,matches:e}),b=b.slice(h.length);if(!h)break}return a?b.length:b?Q.error(c):Xb(c,k).slice(0)},$a=function(c){for(var a=0,h=c.length,e="";a<h;a++)e+=c[a].value;return e},vb=function(c,a,h){var e=a.dir,d=h&&"parentNode"===
e,f=Xc++;return a.first?function(a,h,f){for(;a=a[e];)if(1===a.nodeType||d)return c(a,h,f)}:function(a,h,b){var k,n,g,q=na+" "+f;if(b)for(;a=a[e];){if((1===a.nodeType||d)&&c(a,h,b))return!0}else for(;a=a[e];)if(1===a.nodeType||d)if(g=a[V]||(a[V]={}),(n=g[e])&&n[0]===q){if(!0===(k=n[1])||k===cb)return!0===k}else if(n=g[e]=[q],n[1]=c(a,h,b)||cb,!0===n[1])return!0}},wb=function(c){return 1<c.length?function(a,h,e){for(var d=c.length;d--;)if(!c[d](a,h,e))return!1;return!0}:c[0]},db=function(c,a,h,e,d){for(var f,
b=[],k=0,n=c.length,g=null!=a;k<n;k++)if(f=c[k])if(!h||h(f,e,d))b.push(f),g&&a.push(k);return b},xb=function(c,a,h,e,d,f){e&&!e[V]&&(e=xb(e));d&&!d[V]&&(d=xb(d,f));return ka(function(f,b,k,n){var g,q,t=[],j=[],l=b.length,D;if(!(D=f)){D=a||"*";for(var o=k.nodeType?[k]:k,y=[],m=0,p=o.length;m<p;m++)Q(D,o[m],y);D=y}D=c&&(f||!a)?db(D,t,c,k,n):D;o=h?d||(f?c:l||e)?[]:b:D;h&&h(D,o,k,n);if(e){g=db(o,j);e(g,[],k,n);for(k=g.length;k--;)if(q=g[k])o[j[k]]=!(D[j[k]]=q)}if(f){if(d||c){if(d){g=[];for(k=o.length;k--;)if(q=
o[k])g.push(D[k]=q);d(null,o=[],g,n)}for(k=o.length;k--;)if((q=o[k])&&-1<(g=d?Fa.call(f,q):t[k]))f[g]=!(b[g]=q)}}else o=db(o===b?o.splice(l,o.length):o),d?d(null,b,o,n):ua.apply(b,o)})},yb=function(c){var a,h,e,d=c.length,f=O.relative[c[0].type];h=f||O.relative[" "];for(var b=f?1:0,k=vb(function(c){return c===a},h,!0),n=vb(function(c){return-1<Fa.call(a,c)},h,!0),g=[function(c,x,h){return!f&&(h||x!==eb)||((a=x).nodeType?k(c,x,h):n(c,x,h))}];b<d;b++)if(h=O.relative[c[b].type])g=[vb(wb(g),h)];else{h=
O.filter[c[b].type].apply(null,c[b].matches);if(h[V]){for(e=++b;e<d&&!O.relative[c[e].type];e++);return xb(1<b&&wb(g),1<b&&$a(c.slice(0,b-1).concat({value:" "===c[b-2].type?"*":""})).replace(ab,"$1"),h,b<e&&yb(c.slice(b,e)),e<d&&yb(c=c.slice(e)),e<d&&$a(c))}g.push(h)}return wb(g)},Ma,T,cb,O,fb,Yb,sb,eb,Ga,Da,Y,oa,ma,ga,Ha,gb,Ta,V="sizzle"+-new Date,ra=qb.document,na=0,Xc=0,Zb=tb(),Xb=tb(),$b=tb(),Na=!1,zb=function(c,a){c===a&&(Na=!0);return 0},Ub=-2147483648,Yc={}.hasOwnProperty,xa=[],Zc=xa.pop,$c=
xa.push,ua=xa.push,ac=xa.slice,Fa=xa.indexOf||function(c){for(var a=0,h=this.length;a<h;a++)if(this[a]===c)return a;return-1},bc="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+".replace("w","w#"),cc="\\[[\\x20\\t\\r\\n\\f]*((?:\\\\.|[\\w-]|[^\\x00-\\xa0])+)[\\x20\\t\\r\\n\\f]*(?:([*^$|!~]?\x3d)[\\x20\\t\\r\\n\\f]*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|("+bc+")|)|)[\\x20\\t\\r\\n\\f]*\\]",Ab=":((?:\\\\.|[\\w-]|[^\\x00-\\xa0])+)(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|"+cc.replace(3,8)+")*)|.*)\\)|)",
ab=RegExp("^[\\x20\\t\\r\\n\\f]+|((?:^|[^\\\\])(?:\\\\.)*)[\\x20\\t\\r\\n\\f]+$","g"),Vc=/^[\x20\t\r\n\f]*,[\x20\t\r\n\f]*/,Wc=/^[\x20\t\r\n\f]*([>+~]|[\x20\t\r\n\f])[\x20\t\r\n\f]*/,rb=/[\x20\t\r\n\f]*[+~]/,ad=RegExp("\x3d[\\x20\\t\\r\\n\\f]*([^\\]'\"]*)[\\x20\\t\\r\\n\\f]*\\]","g"),bd=RegExp(Ab),cd=RegExp("^"+bc+"$"),bb={ID:/^#((?:\\.|[\w-]|[^\x00-\xa0])+)/,CLASS:/^\.((?:\\.|[\w-]|[^\x00-\xa0])+)/,TAG:RegExp("^("+"(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+".replace("w","w*")+")"),ATTR:RegExp("^"+cc),PSEUDO:RegExp("^"+
Ab),CHILD:RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\([\\x20\\t\\r\\n\\f]*(even|odd|(([+-]|)(\\d*)n|)[\\x20\\t\\r\\n\\f]*(?:([+-]|)[\\x20\\t\\r\\n\\f]*(\\d+)|))[\\x20\\t\\r\\n\\f]*\\)|)","i"),bool:RegExp("^(?:checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped)$","i"),needsContext:RegExp("^[\\x20\\t\\r\\n\\f]*[\x3e+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\([\\x20\\t\\r\\n\\f]*((?:-\\d)?\\d*)[\\x20\\t\\r\\n\\f]*\\)|)(?\x3d[^-]|$)",
"i")},Bb=/^[^{]+\{\s*\[native \w/,Rc=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,dd=/^(?:input|select|textarea|button)$/i,ed=/^h\d$/i,Sc=/'|\\/g,va=RegExp("\\\\([\\da-f]{1,6}[\\x20\\t\\r\\n\\f]?|([\\x20\\t\\r\\n\\f])|.)","ig"),wa=function(c,a,h){c="0x"+a-65536;return c!==c||h?a:0>c?String.fromCharCode(c+65536):String.fromCharCode(c>>10|55296,c&1023|56320)};try{ua.apply(xa=ac.call(ra.childNodes),ra.childNodes),xa[ra.childNodes.length].nodeType}catch(Hd){ua={apply:xa.length?function(c,a){$c.apply(c,ac.call(a))}:
function(c,a){for(var h=c.length,e=0;c[h++]=a[e++];);c.length=h-1}}}Yb=Q.isXML=function(c){return(c=c&&(c.ownerDocument||c).documentElement)?"HTML"!==c.nodeName:!1};T=Q.support={};Da=Q.setDocument=function(c){var a=c?c.ownerDocument||c:ra;c=a.defaultView;if(a===Y||9!==a.nodeType||!a.documentElement)return Y;Y=a;oa=a.documentElement;ma=!Yb(a);c&&(c.attachEvent&&c!==c.top)&&c.attachEvent("onbeforeunload",function(){Da()});T.attributes=la(function(c){c.className="i";return!c.getAttribute("className")});
T.getElementsByTagName=la(function(c){c.appendChild(a.createComment(""));return!c.getElementsByTagName("*").length});T.getElementsByClassName=la(function(c){c.innerHTML="\x3cdiv class\x3d'a'\x3e\x3c/div\x3e\x3cdiv class\x3d'a i'\x3e\x3c/div\x3e";c.firstChild.className="i";return 2===c.getElementsByClassName("i").length});T.getById=la(function(c){oa.appendChild(c).id=V;return!a.getElementsByName||!a.getElementsByName(V).length});T.getById?(O.find.ID=function(c,a){if("undefined"!==typeof a.getElementById&&
ma){var x=a.getElementById(c);return x&&x.parentNode?[x]:[]}},O.filter.ID=function(c){var a=c.replace(va,wa);return function(c){return c.getAttribute("id")===a}}):(delete O.find.ID,O.filter.ID=function(c){var a=c.replace(va,wa);return function(c){return(c="undefined"!==typeof c.getAttributeNode&&c.getAttributeNode("id"))&&c.value===a}});O.find.TAG=T.getElementsByTagName?function(c,a){if("undefined"!==typeof a.getElementsByTagName)return a.getElementsByTagName(c)}:function(c,a){var x,h=[],e=0,d=a.getElementsByTagName(c);
if("*"===c){for(;x=d[e++];)1===x.nodeType&&h.push(x);return h}return d};O.find.CLASS=T.getElementsByClassName&&function(c,a){if("undefined"!==typeof a.getElementsByClassName&&ma)return a.getElementsByClassName(c)};Ha=[];ga=[];if(T.qsa=Bb.test(a.querySelectorAll))la(function(c){c.innerHTML="\x3cselect\x3e\x3coption selected\x3d''\x3e\x3c/option\x3e\x3c/select\x3e";c.querySelectorAll("[selected]").length||ga.push("\\[[\\x20\\t\\r\\n\\f]*(?:value|checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped)");
c.querySelectorAll(":checked").length||ga.push(":checked")}),la(function(c){var x=a.createElement("input");x.setAttribute("type","hidden");c.appendChild(x).setAttribute("t","");c.querySelectorAll("[t^\x3d'']").length&&ga.push("[*^$]\x3d[\\x20\\t\\r\\n\\f]*(?:''|\"\")");c.querySelectorAll(":enabled").length||ga.push(":enabled",":disabled");c.querySelectorAll("*,:x");ga.push(",.*:")});(T.matchesSelector=Bb.test(gb=oa.webkitMatchesSelector||oa.mozMatchesSelector||oa.oMatchesSelector||oa.msMatchesSelector))&&
la(function(c){T.disconnectedMatch=gb.call(c,"div");gb.call(c,"[s!\x3d'']:x");Ha.push("!\x3d",Ab)});ga=ga.length&&RegExp(ga.join("|"));Ha=Ha.length&&RegExp(Ha.join("|"));Ta=Bb.test(oa.contains)||oa.compareDocumentPosition?function(c,a){var x=9===c.nodeType?c.documentElement:c,h=a&&a.parentNode;return c===h||!(!h||!(1===h.nodeType&&(x.contains?x.contains(h):c.compareDocumentPosition&&c.compareDocumentPosition(h)&16)))}:function(c,a){if(a)for(;a=a.parentNode;)if(a===c)return!0;return!1};zb=oa.compareDocumentPosition?
function(c,x){if(c===x)return Na=!0,0;var h=x.compareDocumentPosition&&c.compareDocumentPosition&&c.compareDocumentPosition(x);return h?h&1||!T.sortDetached&&x.compareDocumentPosition(c)===h?c===a||Ta(ra,c)?-1:x===a||Ta(ra,x)?1:Ga?Fa.call(Ga,c)-Fa.call(Ga,x):0:h&4?-1:1:c.compareDocumentPosition?-1:1}:function(c,x){var h,e=0;h=c.parentNode;var d=x.parentNode,f=[c],b=[x];if(c===x)return Na=!0,0;if(!h||!d)return c===a?-1:x===a?1:h?-1:d?1:Ga?Fa.call(Ga,c)-Fa.call(Ga,x):0;if(h===d)return Vb(c,x);for(h=
c;h=h.parentNode;)f.unshift(h);for(h=x;h=h.parentNode;)b.unshift(h);for(;f[e]===b[e];)e++;return e?Vb(f[e],b[e]):f[e]===ra?-1:b[e]===ra?1:0};return a};Q.matches=function(c,a){return Q(c,null,null,a)};Q.matchesSelector=function(c,a){(c.ownerDocument||c)!==Y&&Da(c);a=a.replace(ad,"\x3d'$1']");if(T.matchesSelector&&ma&&(!Ha||!Ha.test(a))&&(!ga||!ga.test(a)))try{var h=gb.call(c,a);if(h||T.disconnectedMatch||c.document&&11!==c.document.nodeType)return h}catch(e){}return 0<Q(a,Y,null,[c]).length};Q.contains=
function(c,a){(c.ownerDocument||c)!==Y&&Da(c);return Ta(c,a)};Q.attr=function(c,a){(c.ownerDocument||c)!==Y&&Da(c);var h=O.attrHandle[a.toLowerCase()],h=h&&Yc.call(O.attrHandle,a.toLowerCase())?h(c,a,!ma):void 0;return void 0===h?T.attributes||!ma?c.getAttribute(a):(h=c.getAttributeNode(a))&&h.specified?h.value:null:h};Q.error=function(c){throw Error("Syntax error, unrecognized expression: "+c);};Q.uniqueSort=function(c){var a,h=[],e=0,d=0;Na=!T.detectDuplicates;Ga=!T.sortStable&&c.slice(0);c.sort(zb);
if(Na){for(;a=c[d++];)a===c[d]&&(e=h.push(d));for(;e--;)c.splice(h[e],1)}return c};fb=Q.getText=function(c){var a,h="",e=0;if(a=c.nodeType)if(1===a||9===a||11===a){if("string"===typeof c.textContent)return c.textContent;for(c=c.firstChild;c;c=c.nextSibling)h+=fb(c)}else{if(3===a||4===a)return c.nodeValue}else for(;a=c[e];e++)h+=fb(a);return h};O=Q.selectors={cacheLength:50,createPseudo:ka,match:bb,attrHandle:{},find:{},relative:{"\x3e":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",
first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(c){c[1]=c[1].replace(va,wa);c[3]=(c[4]||c[5]||"").replace(va,wa);"~\x3d"===c[2]&&(c[3]=" "+c[3]+" ");return c.slice(0,4)},CHILD:function(c){c[1]=c[1].toLowerCase();"nth"===c[1].slice(0,3)?(c[3]||Q.error(c[0]),c[4]=+(c[4]?c[5]+(c[6]||1):2*("even"===c[3]||"odd"===c[3])),c[5]=+(c[7]+c[8]||"odd"===c[3])):c[3]&&Q.error(c[0]);return c},PSEUDO:function(c){var a,h=!c[5]&&c[2];if(bb.CHILD.test(c[0]))return null;if(c[3]&&void 0!==c[4])c[2]=c[4];
else if(h&&bd.test(h)&&(a=Za(h,!0))&&(a=h.indexOf(")",h.length-a)-h.length))c[0]=c[0].slice(0,a),c[2]=h.slice(0,a);return c.slice(0,3)}},filter:{TAG:function(c){var a=c.replace(va,wa).toLowerCase();return"*"===c?function(){return!0}:function(c){return c.nodeName&&c.nodeName.toLowerCase()===a}},CLASS:function(c){var a=Zb[c+" "];return a||(a=RegExp("(^|[\\x20\\t\\r\\n\\f])"+c+"([\\x20\\t\\r\\n\\f]|$)"))&&Zb(c,function(c){return a.test("string"===typeof c.className&&c.className||"undefined"!==typeof c.getAttribute&&
c.getAttribute("class")||"")})},ATTR:function(c,a,h){return function(e){e=Q.attr(e,c);if(null==e)return"!\x3d"===a;if(!a)return!0;e+="";return"\x3d"===a?e===h:"!\x3d"===a?e!==h:"^\x3d"===a?h&&0===e.indexOf(h):"*\x3d"===a?h&&-1<e.indexOf(h):"$\x3d"===a?h&&e.slice(-h.length)===h:"~\x3d"===a?-1<(" "+e+" ").indexOf(h):"|\x3d"===a?e===h||e.slice(0,h.length+1)===h+"-":!1}},CHILD:function(c,a,h,e,d){var f="nth"!==c.slice(0,3),b="last"!==c.slice(-4),k="of-type"===a;return 1===e&&0===d?function(c){return!!c.parentNode}:
function(a,h,n){var g,q,t,j,l;h=f!==b?"nextSibling":"previousSibling";var o=a.parentNode,D=k&&a.nodeName.toLowerCase();n=!n&&!k;if(o){if(f){for(;h;){for(q=a;q=q[h];)if(k?q.nodeName.toLowerCase()===D:1===q.nodeType)return!1;l=h="only"===c&&!l&&"nextSibling"}return!0}l=[b?o.firstChild:o.lastChild];if(b&&n){n=o[V]||(o[V]={});g=n[c]||[];j=g[0]===na&&g[1];t=g[0]===na&&g[2];for(q=j&&o.childNodes[j];q=++j&&q&&q[h]||(t=j=0)||l.pop();)if(1===q.nodeType&&++t&&q===a){n[c]=[na,j,t];break}}else if(n&&(g=(a[V]||
(a[V]={}))[c])&&g[0]===na)t=g[1];else for(;q=++j&&q&&q[h]||(t=j=0)||l.pop();)if((k?q.nodeName.toLowerCase()===D:1===q.nodeType)&&++t)if(n&&((q[V]||(q[V]={}))[c]=[na,t]),q===a)break;t-=d;return t===e||0===t%e&&0<=t/e}}},PSEUDO:function(c,a){var h,e=O.pseudos[c]||O.setFilters[c.toLowerCase()]||Q.error("unsupported pseudo: "+c);return e[V]?e(a):1<e.length?(h=[c,c,"",a],O.setFilters.hasOwnProperty(c.toLowerCase())?ka(function(c,h){for(var x,d=e(c,a),f=d.length;f--;)x=Fa.call(c,d[f]),c[x]=!(h[x]=d[f])}):
function(c){return e(c,0,h)}):e}},pseudos:{not:ka(function(c){var a=[],h=[],e=sb(c.replace(ab,"$1"));return e[V]?ka(function(c,a,h,x){x=e(c,null,x,[]);for(var d=c.length;d--;)if(h=x[d])c[d]=!(a[d]=h)}):function(c,x,d){a[0]=c;e(a,null,d,h);return!h.pop()}}),has:ka(function(c){return function(a){return 0<Q(c,a).length}}),contains:ka(function(c){return function(a){return-1<(a.textContent||a.innerText||fb(a)).indexOf(c)}}),lang:ka(function(c){cd.test(c||"")||Q.error("unsupported lang: "+c);c=c.replace(va,
wa).toLowerCase();return function(a){var h;do if(h=ma?a.lang:a.getAttribute("xml:lang")||a.getAttribute("lang"))return h=h.toLowerCase(),h===c||0===h.indexOf(c+"-");while((a=a.parentNode)&&1===a.nodeType);return!1}}),target:function(c){var a=qb.location&&qb.location.hash;return a&&a.slice(1)===c.id},root:function(c){return c===oa},focus:function(c){return c===Y.activeElement&&(!Y.hasFocus||Y.hasFocus())&&!(!c.type&&!c.href&&!~c.tabIndex)},enabled:function(c){return!1===c.disabled},disabled:function(c){return!0===
c.disabled},checked:function(c){var a=c.nodeName.toLowerCase();return"input"===a&&!!c.checked||"option"===a&&!!c.selected},selected:function(c){c.parentNode&&c.parentNode.selectedIndex;return!0===c.selected},empty:function(c){for(c=c.firstChild;c;c=c.nextSibling)if("@"<c.nodeName||3===c.nodeType||4===c.nodeType)return!1;return!0},parent:function(c){return!O.pseudos.empty(c)},header:function(c){return ed.test(c.nodeName)},input:function(c){return dd.test(c.nodeName)},button:function(c){var a=c.nodeName.toLowerCase();
return"input"===a&&"button"===c.type||"button"===a},text:function(c){var a;return"input"===c.nodeName.toLowerCase()&&"text"===c.type&&(null==(a=c.getAttribute("type"))||a.toLowerCase()===c.type)},first:Ea(function(){return[0]}),last:Ea(function(c,a){return[a-1]}),eq:Ea(function(c,a,h){return[0>h?h+a:h]}),even:Ea(function(c,a){for(var h=0;h<a;h+=2)c.push(h);return c}),odd:Ea(function(c,a){for(var h=1;h<a;h+=2)c.push(h);return c}),lt:Ea(function(c,a,h){for(a=0>h?h+a:h;0<=--a;)c.push(a);return c}),gt:Ea(function(c,
a,h){for(h=0>h?h+a:h;++h<a;)c.push(h);return c})}};O.pseudos.nth=O.pseudos.eq;for(Ma in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})O.pseudos[Ma]=Tc(Ma);for(Ma in{submit:!0,reset:!0})O.pseudos[Ma]=Uc(Ma);Wb.prototype=O.filters=O.pseudos;O.setFilters=new Wb;sb=Q.compile=function(c,a){var h,e=[],d=[],f=$b[c+" "];if(!f){a||(a=Za(c));for(h=a.length;h--;)f=yb(a[h]),f[V]?e.push(f):d.push(f);var b=0,k=0<e.length,n=0<d.length;h=function(c,a,h,x,f){var g,q,t=[],j=0,l="0",o=c&&[],D=null!=f,y=eb,mb=c||
n&&O.find.TAG("*",f&&a.parentNode||a),m=na+=null==y?1:Math.random()||0.1;D&&(eb=a!==Y&&a,cb=b);for(;null!=(f=mb[l]);l++){if(n&&f){for(g=0;q=d[g++];)if(q(f,a,h)){x.push(f);break}D&&(na=m,cb=++b)}k&&((f=!q&&f)&&j--,c&&o.push(f))}j+=l;if(k&&l!==j){for(g=0;q=e[g++];)q(o,t,a,h);if(c){if(0<j)for(;l--;)!o[l]&&!t[l]&&(t[l]=Zc.call(x));t=db(t)}ua.apply(x,t);D&&(!c&&0<t.length&&1<j+e.length)&&Q.uniqueSort(x)}D&&(na=m,eb=y);return o};h=k?ka(h):h;f=$b(c,h)}return f};T.sortStable=V.split("").sort(zb).join("")===
V;T.detectDuplicates=Na;Da();T.sortDetached=la(function(c){return c.compareDocumentPosition(Y.createElement("div"))&1});la(function(c){c.innerHTML="\x3ca href\x3d'#'\x3e\x3c/a\x3e";return"#"===c.firstChild.getAttribute("href")})||ub("type|href|height|width",function(c,a,h){if(!h)return c.getAttribute(a,"type"===a.toLowerCase()?1:2)});(!T.attributes||!la(function(c){c.innerHTML="\x3cinput/\x3e";c.firstChild.setAttribute("value","");return""===c.firstChild.getAttribute("value")}))&&ub("value",function(c,
a,h){if(!h&&"input"===c.nodeName.toLowerCase())return c.defaultValue});la(function(c){return null==c.getAttribute("disabled")})||ub("checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",function(c,a,h){var e;if(!h)return(e=c.getAttributeNode(a))&&e.specified?e.value:!0===c[a]?a.toLowerCase():null});o.find=Q;o.expr=Q.selectors;o.expr[":"]=o.expr.pseudos;o.unique=Q.uniqueSort;o.text=Q.getText;o.isXMLDoc=Q.isXML;o.contains=Q.contains;
var dc={};o.Callbacks=function(c){var a;if("string"===typeof c){if(!(a=dc[c])){a=c;var h=dc[a]={};o.each(a.match(pa)||[],function(c,a){h[a]=!0});a=h}}else a=o.extend({},c);c=a;var e,d,f,b,k,n,g=[],q=!c.once&&[],t=function(a){d=c.memory&&a;f=!0;k=n||0;n=0;b=g.length;for(e=!0;g&&k<b;k++)if(!1===g[k].apply(a[0],a[1])&&c.stopOnFalse){d=!1;break}e=!1;g&&(q?q.length&&t(q.shift()):d?g=[]:j.disable())},j={add:function(){if(g){var a=g.length;(function Fc(a){o.each(a,function(a,h){var e=o.type(h);"function"===
e?(!c.unique||!j.has(h))&&g.push(h):h&&(h.length&&"string"!==e)&&Fc(h)})})(arguments);e?b=g.length:d&&(n=a,t(d))}return this},remove:function(){g&&o.each(arguments,function(c,a){for(var h;-1<(h=o.inArray(a,g,h));)g.splice(h,1),e&&(h<=b&&b--,h<=k&&k--)});return this},has:function(c){return c?-1<o.inArray(c,g):!(!g||!g.length)},empty:function(){g=[];b=0;return this},disable:function(){g=q=d=m;return this},disabled:function(){return!g},lock:function(){q=m;d||j.disable();return this},locked:function(){return!q},
fireWith:function(c,a){if(g&&(!f||q))a=a||[],a=[c,a.slice?a.slice():a],e?q.push(a):t(a);return this},fire:function(){j.fireWith(this,arguments);return this},fired:function(){return!!f}};return j};o.extend({Deferred:function(c){var a=[["resolve","done",o.Callbacks("once memory"),"resolved"],["reject","fail",o.Callbacks("once memory"),"rejected"],["notify","progress",o.Callbacks("memory")]],h="pending",e={state:function(){return h},always:function(){d.done(arguments).fail(arguments);return this},then:function(){var c=
arguments;return o.Deferred(function(h){o.each(a,function(a,x){var f=x[0],b=o.isFunction(c[a])&&c[a];d[x[1]](function(){var c=b&&b.apply(this,arguments);if(c&&o.isFunction(c.promise))c.promise().done(h.resolve).fail(h.reject).progress(h.notify);else h[f+"With"](this===e?h.promise():this,b?[c]:arguments)})});c=null}).promise()},promise:function(c){return null!=c?o.extend(c,e):e}},d={};e.pipe=e.then;o.each(a,function(c,x){var f=x[2],b=x[3];e[x[1]]=f.add;b&&f.add(function(){h=b},a[c^1][2].disable,a[2][2].lock);
d[x[0]]=function(){d[x[0]+"With"](this===d?e:this,arguments);return this};d[x[0]+"With"]=f.fireWith});e.promise(d);c&&c.call(d,d);return d},when:function(c){var a=0,h=R.call(arguments),e=h.length,d=1!==e||c&&o.isFunction(c.promise)?e:0,f=1===d?c:o.Deferred(),b=function(c,a,h){return function(e){a[c]=this;h[c]=1<arguments.length?R.call(arguments):e;h===k?f.notifyWith(a,h):--d||f.resolveWith(a,h)}},k,n,g;if(1<e){k=Array(e);n=Array(e);for(g=Array(e);a<e;a++)h[a]&&o.isFunction(h[a].promise)?h[a].promise().done(b(a,
g,h)).fail(f.reject).progress(b(a,n,k)):--d}d||f.resolveWith(g,h);return f.promise()}});var fd=o;var L={},Cb,ya,Z,hb,ib,jb,Db,ec,Ua,M=J.createElement("div");M.setAttribute("className","t");M.innerHTML="  \x3clink/\x3e\x3ctable\x3e\x3c/table\x3e\x3ca href\x3d'/a'\x3ea\x3c/a\x3e\x3cinput type\x3d'checkbox'/\x3e";Cb=M.getElementsByTagName("*")||[];if((ya=M.getElementsByTagName("a")[0])&&ya.style&&Cb.length){hb=J.createElement("select");jb=hb.appendChild(J.createElement("option"));Z=M.getElementsByTagName("input")[0];
ya.style.cssText="top:1px;float:left;opacity:.5";L.getSetAttribute="t"!==M.className;L.leadingWhitespace=3===M.firstChild.nodeType;L.tbody=!M.getElementsByTagName("tbody").length;L.htmlSerialize=!!M.getElementsByTagName("link").length;L.style=/top/.test(ya.getAttribute("style"));L.hrefNormalized="/a"===ya.getAttribute("href");L.opacity=/^0.5/.test(ya.style.opacity);L.cssFloat=!!ya.style.cssFloat;L.checkOn=!!Z.value;L.optSelected=jb.selected;L.enctype=!!J.createElement("form").enctype;L.html5Clone=
"\x3c:nav\x3e\x3c/:nav\x3e"!==J.createElement("nav").cloneNode(!0).outerHTML;L.inlineBlockNeedsLayout=!1;L.shrinkWrapBlocks=!1;L.pixelPosition=!1;L.deleteExpando=!0;L.noCloneEvent=!0;L.reliableMarginRight=!0;L.boxSizingReliable=!0;Z.checked=!0;L.noCloneChecked=Z.cloneNode(!0).checked;hb.disabled=!0;L.optDisabled=!jb.disabled;try{delete M.test}catch(Id){L.deleteExpando=!1}Z=J.createElement("input");Z.setAttribute("value","");L.input=""===Z.getAttribute("value");Z.value="t";Z.setAttribute("type","radio");
L.radioValue="t"===Z.value;Z.setAttribute("checked","t");Z.setAttribute("name","t");ib=J.createDocumentFragment();ib.appendChild(Z);L.appendChecked=Z.checked;L.checkClone=ib.cloneNode(!0).cloneNode(!0).lastChild.checked;M.attachEvent&&(M.attachEvent("onclick",function(){L.noCloneEvent=!1}),M.cloneNode(!0).click());for(Ua in{submit:!0,change:!0,focusin:!0})M.setAttribute(Db="on"+Ua,"t"),L[Ua+"Bubbles"]=Db in b||!1===M.attributes[Db].expando;M.style.backgroundClip="content-box";M.cloneNode(!0).style.backgroundClip=
"";L.clearCloneStyle="content-box"===M.style.backgroundClip;for(Ua in o(L))break;L.ownLast="0"!==Ua;o(function(){var c,a,h=J.getElementsByTagName("body")[0];h&&(c=J.createElement("div"),c.style.cssText="border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px",h.appendChild(c).appendChild(M),M.innerHTML="\x3ctable\x3e\x3ctr\x3e\x3ctd\x3e\x3c/td\x3e\x3ctd\x3et\x3c/td\x3e\x3c/tr\x3e\x3c/table\x3e",a=M.getElementsByTagName("td"),a[0].style.cssText="padding:0;margin:0;border:0;display:none",
ec=0===a[0].offsetHeight,a[0].style.display="",a[1].style.display="none",L.reliableHiddenOffsets=ec&&0===a[0].offsetHeight,M.innerHTML="",M.style.cssText="box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;",o.swap(h,null!=h.style.zoom?{zoom:1}:{},function(){L.boxSizing=4===M.offsetWidth}),b.getComputedStyle&&(L.pixelPosition="1%"!==(b.getComputedStyle(M,null)||{}).top,L.boxSizingReliable=
"4px"===(b.getComputedStyle(M,null)||{width:"4px"}).width,a=M.appendChild(J.createElement("div")),a.style.cssText=M.style.cssText="padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",a.style.marginRight=a.style.width="0",M.style.width="1px",L.reliableMarginRight=!parseFloat((b.getComputedStyle(a,null)||{}).marginRight)),typeof M.style.zoom!==$&&(M.innerHTML="",M.style.cssText="padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;width:1px;padding:1px;display:inline;zoom:1",
L.inlineBlockNeedsLayout=3===M.offsetWidth,M.style.display="block",M.innerHTML="\x3cdiv\x3e\x3c/div\x3e",M.firstChild.style.width="5px",L.shrinkWrapBlocks=3!==M.offsetWidth,L.inlineBlockNeedsLayout&&(h.style.zoom=1)),h.removeChild(c),c=M=a=a=null)});Cb=hb=ib=jb=ya=Z=null}fd.support=L;var Ac=/(?:\{[\s\S]*\}|\[[\s\S]*\])$/,zc=/([A-Z])/g;o.extend({cache:{},noData:{applet:!0,embed:!0,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"},hasData:function(c){c=c.nodeType?o.cache[c[o.expando]]:c[o.expando];
return!!c&&!a(c)},data:function(c,a,h){return g(c,a,h)},removeData:function(c,a){return d(c,a)},_data:function(c,a,h){return g(c,a,h,!0)},_removeData:function(c,a){return d(c,a,!0)},acceptData:function(c){if(c.nodeType&&1!==c.nodeType&&9!==c.nodeType)return!1;var a=c.nodeName&&o.noData[c.nodeName.toLowerCase()];return!a||!0!==a&&c.getAttribute("classid")===a}});o.fn.extend({data:function(c,a){var h,e,d=null,b=0,k=this[0];if(c===m){if(this.length&&(d=o.data(k),1===k.nodeType&&!o._data(k,"parsedAttrs"))){for(h=
k.attributes;b<h.length;b++)e=h[b].name,0===e.indexOf("data-")&&(e=o.camelCase(e.slice(5)),f(k,e,d[e]));o._data(k,"parsedAttrs",!0)}return d}return"object"===typeof c?this.each(function(){o.data(this,c)}):1<arguments.length?this.each(function(){o.data(this,c,a)}):k?f(k,c,o.data(k,c)):null},removeData:function(c){return this.each(function(){o.removeData(this,c)})}});o.extend({queue:function(c,a,h){var e;if(c)return a=(a||"fx")+"queue",e=o._data(c,a),h&&(!e||o.isArray(h)?e=o._data(c,a,o.makeArray(h)):
e.push(h)),e||[]},dequeue:function(c,a){a=a||"fx";var h=o.queue(c,a),e=h.length,d=h.shift(),f=o._queueHooks(c,a),b=function(){o.dequeue(c,a)};"inprogress"===d&&(d=h.shift(),e--);d&&("fx"===a&&h.unshift("inprogress"),delete f.stop,d.call(c,b,f));!e&&f&&f.empty.fire()},_queueHooks:function(c,a){var h=a+"queueHooks";return o._data(c,h)||o._data(c,h,{empty:o.Callbacks("once memory").add(function(){o._removeData(c,a+"queue");o._removeData(c,h)})})}});o.fn.extend({queue:function(c,a){var h=2;"string"!==
typeof c&&(a=c,c="fx",h--);return arguments.length<h?o.queue(this[0],c):a===m?this:this.each(function(){var h=o.queue(this,c,a);o._queueHooks(this,c);"fx"===c&&"inprogress"!==h[0]&&o.dequeue(this,c)})},dequeue:function(c){return this.each(function(){o.dequeue(this,c)})},delay:function(c,a){c=o.fx?o.fx.speeds[c]||c:c;return this.queue(a||"fx",function(a,h){var e=setTimeout(a,c);h.stop=function(){clearTimeout(e)}})},clearQueue:function(c){return this.queue(c||"fx",[])},promise:function(c,a){var h,e=
1,d=o.Deferred(),f=this,b=this.length,k=function(){--e||d.resolveWith(f,[f])};"string"!==typeof c&&(a=c,c=m);for(c=c||"fx";b--;)if((h=o._data(f[b],c+"queueHooks"))&&h.empty)e++,h.empty.add(k);k();return d.promise(a)}});var Oa,fc,Eb=/[\t\r\n\f]/g,gd=/\r/g,hd=/^(?:input|select|textarea|button|object)$/i,id=/^(?:a|area)$/i,Fb=/^(?:checked|selected)$/i,Ia=o.support.getSetAttribute,kb=o.support.input;o.fn.extend({attr:function(c,a){return o.access(this,o.attr,c,a,1<arguments.length)},removeAttr:function(c){return this.each(function(){o.removeAttr(this,
c)})},prop:function(c,a){return o.access(this,o.prop,c,a,1<arguments.length)},removeProp:function(c){c=o.propFix[c]||c;return this.each(function(){try{this[c]=m,delete this[c]}catch(a){}})},addClass:function(c){var a,h,e,d,f,b=0,k=this.length;a="string"===typeof c&&c;if(o.isFunction(c))return this.each(function(a){o(this).addClass(c.call(this,a,this.className))});if(a)for(a=(c||"").match(pa)||[];b<k;b++)if(h=this[b],e=1===h.nodeType&&(h.className?(" "+h.className+" ").replace(Eb," "):" ")){for(f=
0;d=a[f++];)0>e.indexOf(" "+d+" ")&&(e+=d+" ");h.className=o.trim(e)}return this},removeClass:function(c){var a,h,e,d,f,b=0,k=this.length;a=0===arguments.length||"string"===typeof c&&c;if(o.isFunction(c))return this.each(function(a){o(this).removeClass(c.call(this,a,this.className))});if(a)for(a=(c||"").match(pa)||[];b<k;b++)if(h=this[b],e=1===h.nodeType&&(h.className?(" "+h.className+" ").replace(Eb," "):"")){for(f=0;d=a[f++];)for(;0<=e.indexOf(" "+d+" ");)e=e.replace(" "+d+" "," ");h.className=
c?o.trim(e):""}return this},toggleClass:function(c,a){var h=typeof c;return"boolean"===typeof a&&"string"===h?a?this.addClass(c):this.removeClass(c):o.isFunction(c)?this.each(function(h){o(this).toggleClass(c.call(this,h,this.className,a),a)}):this.each(function(){if("string"===h)for(var a,e=0,d=o(this),f=c.match(pa)||[];a=f[e++];)d.hasClass(a)?d.removeClass(a):d.addClass(a);else if(h===$||"boolean"===h)this.className&&o._data(this,"__className__",this.className),this.className=this.className||!1===
c?"":o._data(this,"__className__")||""})},hasClass:function(c){c=" "+c+" ";for(var a=0,h=this.length;a<h;a++)if(1===this[a].nodeType&&0<=(" "+this[a].className+" ").replace(Eb," ").indexOf(c))return!0;return!1},val:function(c){var a,h,e,d=this[0];if(arguments.length)return e=o.isFunction(c),this.each(function(a){if(1===this.nodeType&&(a=e?c.call(this,a,o(this).val()):c,null==a?a="":"number"===typeof a?a+="":o.isArray(a)&&(a=o.map(a,function(c){return null==c?"":c+""})),h=o.valHooks[this.type]||o.valHooks[this.nodeName.toLowerCase()],
!h||!("set"in h)||h.set(this,a,"value")===m))this.value=a});if(d){if((h=o.valHooks[d.type]||o.valHooks[d.nodeName.toLowerCase()])&&"get"in h&&(a=h.get(d,"value"))!==m)return a;a=d.value;return"string"===typeof a?a.replace(gd,""):null==a?"":a}}});o.extend({valHooks:{option:{get:function(c){var a=o.find.attr(c,"value");return null!=a?a:c.text}},select:{get:function(c){for(var a,h=c.options,e=c.selectedIndex,d=(c="select-one"===c.type||0>e)?null:[],f=c?e+1:h.length,b=0>e?f:c?e:0;b<f;b++)if(a=h[b],(a.selected||
b===e)&&(o.support.optDisabled?!a.disabled:null===a.getAttribute("disabled"))&&(!a.parentNode.disabled||!o.nodeName(a.parentNode,"optgroup"))){a=o(a).val();if(c)return a;d.push(a)}return d},set:function(c,a){for(var h,e,d=c.options,f=o.makeArray(a),b=d.length;b--;)if(e=d[b],e.selected=0<=o.inArray(o(e).val(),f))h=!0;h||(c.selectedIndex=-1);return f}}},attr:function(c,a,h){var e,d,f=c.nodeType;if(c&&!(3===f||8===f||2===f)){if(typeof c.getAttribute===$)return o.prop(c,a,h);if(1!==f||!o.isXMLDoc(c))a=
a.toLowerCase(),e=o.attrHooks[a]||(o.expr.match.bool.test(a)?fc:Oa);if(h!==m)if(null===h)o.removeAttr(c,a);else{if(e&&"set"in e&&(d=e.set(c,h,a))!==m)return d;c.setAttribute(a,h+"");return h}else{if(e&&"get"in e&&null!==(d=e.get(c,a)))return d;d=o.find.attr(c,a);return null==d?m:d}}},removeAttr:function(c,a){var h,e,d=0,f=a&&a.match(pa);if(f&&1===c.nodeType)for(;h=f[d++];)e=o.propFix[h]||h,o.expr.match.bool.test(h)?kb&&Ia||!Fb.test(h)?c[e]=!1:c[o.camelCase("default-"+h)]=c[e]=!1:o.attr(c,h,""),c.removeAttribute(Ia?
h:e)},attrHooks:{type:{set:function(c,a){if(!o.support.radioValue&&"radio"===a&&o.nodeName(c,"input")){var h=c.value;c.setAttribute("type",a);h&&(c.value=h);return a}}}},propFix:{"for":"htmlFor","class":"className"},prop:function(c,a,h){var e,d,f;f=c.nodeType;if(c&&!(3===f||8===f||2===f)){if(f=1!==f||!o.isXMLDoc(c))a=o.propFix[a]||a,d=o.propHooks[a];return h!==m?d&&"set"in d&&(e=d.set(c,h,a))!==m?e:c[a]=h:d&&"get"in d&&null!==(e=d.get(c,a))?e:c[a]}},propHooks:{tabIndex:{get:function(c){var a=o.find.attr(c,
"tabindex");return a?parseInt(a,10):hd.test(c.nodeName)||id.test(c.nodeName)&&c.href?0:-1}}}});fc={set:function(c,a,h){!1===a?o.removeAttr(c,h):kb&&Ia||!Fb.test(h)?c.setAttribute(!Ia&&o.propFix[h]||h,h):c[o.camelCase("default-"+h)]=c[h]=!0;return h}};o.each(o.expr.match.bool.source.match(/\w+/g),function(c,a){var h=o.expr.attrHandle[a]||o.find.attr;o.expr.attrHandle[a]=kb&&Ia||!Fb.test(a)?function(c,a,e){var d=o.expr.attrHandle[a];c=e?m:(o.expr.attrHandle[a]=m)!=h(c,a,e)?a.toLowerCase():null;o.expr.attrHandle[a]=
d;return c}:function(c,a,h){return h?m:c[o.camelCase("default-"+a)]?a.toLowerCase():null}});if(!kb||!Ia)o.attrHooks.value={set:function(c,a,h){if(o.nodeName(c,"input"))c.defaultValue=a;else return Oa&&Oa.set(c,a,h)}};Ia||(Oa={set:function(c,a,h){var e=c.getAttributeNode(h);e||c.setAttributeNode(e=c.ownerDocument.createAttribute(h));e.value=a+="";return"value"===h||a===c.getAttribute(h)?a:m}},o.expr.attrHandle.id=o.expr.attrHandle.name=o.expr.attrHandle.coords=function(c,a,h){var e;return h?m:(e=c.getAttributeNode(a))&&
""!==e.value?e.value:null},o.valHooks.button={get:function(c,a){var h=c.getAttributeNode(a);return h&&h.specified?h.value:m},set:Oa.set},o.attrHooks.contenteditable={set:function(c,a,h){Oa.set(c,""===a?!1:a,h)}},o.each(["width","height"],function(c,a){o.attrHooks[a]={set:function(c,h){if(""===h)return c.setAttribute(a,"auto"),h}}}));o.support.hrefNormalized||o.each(["href","src"],function(c,a){o.propHooks[a]={get:function(c){return c.getAttribute(a,4)}}});o.support.style||(o.attrHooks.style={get:function(c){return c.style.cssText||
m},set:function(c,a){return c.style.cssText=a+""}});o.support.optSelected||(o.propHooks.selected={get:function(c){if(c=c.parentNode)c.selectedIndex,c.parentNode&&c.parentNode.selectedIndex;return null}});o.each("tabIndex readOnly maxLength cellSpacing cellPadding rowSpan colSpan useMap frameBorder contentEditable".split(" "),function(){o.propFix[this.toLowerCase()]=this});o.support.enctype||(o.propFix.enctype="encoding");o.each(["radio","checkbox"],function(){o.valHooks[this]={set:function(c,a){if(o.isArray(a))return c.checked=
0<=o.inArray(o(c).val(),a)}};o.support.checkOn||(o.valHooks[this].get=function(c){return null===c.getAttribute("value")?"on":c.value})});var Gb=/^(?:input|select|textarea)$/i,jd=/^key/,kd=/^(?:mouse|contextmenu)|click/,gc=/^(?:focusinfocus|focusoutblur)$/,hc=/^([^.]*)(?:\.(.+)|)$/;o.event={global:{},add:function(c,a,h,e,d){var f,b,k,n,g,q,t,j,l;if(k=o._data(c)){h.handler&&(n=h,h=n.handler,d=n.selector);h.guid||(h.guid=o.guid++);if(!(b=k.events))b=k.events={};if(!(g=k.handle))g=k.handle=function(c){return typeof o!==
$&&(!c||o.event.triggered!==c.type)?o.event.dispatch.apply(g.elem,arguments):m},g.elem=c;a=(a||"").match(pa)||[""];for(k=a.length;k--;)if(f=hc.exec(a[k])||[],j=q=f[1],l=(f[2]||"").split(".").sort(),j){f=o.event.special[j]||{};j=(d?f.delegateType:f.bindType)||j;f=o.event.special[j]||{};q=o.extend({type:j,origType:q,data:e,handler:h,guid:h.guid,selector:d,needsContext:d&&o.expr.match.needsContext.test(d),namespace:l.join(".")},n);if(!(t=b[j]))if(t=b[j]=[],t.delegateCount=0,!f.setup||!1===f.setup.call(c,
e,l,g))c.addEventListener?c.addEventListener(j,g,!1):c.attachEvent&&c.attachEvent("on"+j,g);f.add&&(f.add.call(c,q),q.handler.guid||(q.handler.guid=h.guid));d?t.splice(t.delegateCount++,0,q):t.push(q);o.event.global[j]=!0}c=null}},remove:function(c,a,h,e,d){var f,b,k,n,g,q,t,j,l,D,y,m=o.hasData(c)&&o._data(c);if(m&&(q=m.events)){a=(a||"").match(pa)||[""];for(g=a.length;g--;)if(k=hc.exec(a[g])||[],l=y=k[1],D=(k[2]||"").split(".").sort(),l){t=o.event.special[l]||{};l=(e?t.delegateType:t.bindType)||
l;j=q[l]||[];k=k[2]&&RegExp("(^|\\.)"+D.join("\\.(?:.*\\.|)")+"(\\.|$)");for(n=f=j.length;f--;)if(b=j[f],(d||y===b.origType)&&(!h||h.guid===b.guid)&&(!k||k.test(b.namespace))&&(!e||e===b.selector||"**"===e&&b.selector))j.splice(f,1),b.selector&&j.delegateCount--,t.remove&&t.remove.call(c,b);n&&!j.length&&((!t.teardown||!1===t.teardown.call(c,D,m.handle))&&o.removeEvent(c,l,m.handle),delete q[l])}else for(l in q)o.event.remove(c,l+a[g],h,e,!0);o.isEmptyObject(q)&&(delete m.handle,o._removeData(c,"events"))}},
trigger:function(c,a,h,e){var d,f,k,n,g,q,t=[h||J],j=La.call(c,"type")?c.type:c;g=La.call(c,"namespace")?c.namespace.split("."):[];k=d=h=h||J;if(!(3===h.nodeType||8===h.nodeType)&&!gc.test(j+o.event.triggered))if(0<=j.indexOf(".")&&(g=j.split("."),j=g.shift(),g.sort()),f=0>j.indexOf(":")&&"on"+j,c=c[o.expando]?c:new o.Event(j,"object"===typeof c&&c),c.isTrigger=e?2:3,c.namespace=g.join("."),c.namespace_re=c.namespace?RegExp("(^|\\.)"+g.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,c.result=m,c.target||(c.target=
h),a=null==a?[c]:o.makeArray(a,[c]),g=o.event.special[j]||{},e||!(g.trigger&&!1===g.trigger.apply(h,a))){if(!e&&!g.noBubble&&!o.isWindow(h)){n=g.delegateType||j;gc.test(n+j)||(k=k.parentNode);for(;k;k=k.parentNode)t.push(k),d=k;if(d===(h.ownerDocument||J))t.push(d.defaultView||d.parentWindow||b)}for(q=0;(k=t[q++])&&!c.isPropagationStopped();)c.type=1<q?n:g.bindType||j,(d=(o._data(k,"events")||{})[c.type]&&o._data(k,"handle"))&&d.apply(k,a),(d=f&&k[f])&&(o.acceptData(k)&&d.apply&&!1===d.apply(k,a))&&
c.preventDefault();c.type=j;if(!e&&!c.isDefaultPrevented()&&(!g._default||!1===g._default.apply(t.pop(),a))&&o.acceptData(h)&&f&&h[j]&&!o.isWindow(h)){(d=h[f])&&(h[f]=null);o.event.triggered=j;try{h[j]()}catch(l){}o.event.triggered=m;d&&(h[f]=d)}return c.result}},dispatch:function(c){c=o.event.fix(c);var a,h,e,d,f=[],b=R.call(arguments);a=(o._data(this,"events")||{})[c.type]||[];var k=o.event.special[c.type]||{};b[0]=c;c.delegateTarget=this;if(!(k.preDispatch&&!1===k.preDispatch.call(this,c))){f=
o.event.handlers.call(this,c,a);for(a=0;(e=f[a++])&&!c.isPropagationStopped();){c.currentTarget=e.elem;for(d=0;(h=e.handlers[d++])&&!c.isImmediatePropagationStopped();)if(!c.namespace_re||c.namespace_re.test(h.namespace))if(c.handleObj=h,c.data=h.data,h=((o.event.special[h.origType]||{}).handle||h.handler).apply(e.elem,b),h!==m&&!1===(c.result=h))c.preventDefault(),c.stopPropagation()}k.postDispatch&&k.postDispatch.call(this,c);return c.result}},handlers:function(c,a){var h,e,d,f,b=[],k=a.delegateCount,
n=c.target;if(k&&n.nodeType&&(!c.button||"click"!==c.type))for(;n!=this;n=n.parentNode||this)if(1===n.nodeType&&(!0!==n.disabled||"click"!==c.type)){d=[];for(f=0;f<k;f++)e=a[f],h=e.selector+" ",d[h]===m&&(d[h]=e.needsContext?0<=o(h,this).index(n):o.find(h,this,null,[n]).length),d[h]&&d.push(e);d.length&&b.push({elem:n,handlers:d})}k<a.length&&b.push({elem:this,handlers:a.slice(k)});return b},fix:function(c){if(c[o.expando])return c;var a,h,e;a=c.type;var d=c,f=this.fixHooks[a];f||(this.fixHooks[a]=
f=kd.test(a)?this.mouseHooks:jd.test(a)?this.keyHooks:{});e=f.props?this.props.concat(f.props):this.props;c=new o.Event(d);for(a=e.length;a--;)h=e[a],c[h]=d[h];c.target||(c.target=d.srcElement||J);3===c.target.nodeType&&(c.target=c.target.parentNode);c.metaKey=!!c.metaKey;return f.filter?f.filter(c,d):c},props:"altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:["char","charCode","key","keyCode"],
filter:function(c,a){null==c.which&&(c.which=null!=a.charCode?a.charCode:a.keyCode);return c}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(c,a){var h,e,d=a.button,f=a.fromElement;null==c.pageX&&null!=a.clientX&&(h=c.target.ownerDocument||J,e=h.documentElement,h=h.body,c.pageX=a.clientX+(e&&e.scrollLeft||h&&h.scrollLeft||0)-(e&&e.clientLeft||h&&h.clientLeft||0),c.pageY=a.clientY+(e&&e.scrollTop||h&&
h.scrollTop||0)-(e&&e.clientTop||h&&h.clientTop||0));!c.relatedTarget&&f&&(c.relatedTarget=f===c.target?a.toElement:f);!c.which&&d!==m&&(c.which=d&1?1:d&2?3:d&4?2:0);return c}},special:{load:{noBubble:!0},focus:{trigger:function(){if(this!==k()&&this.focus)try{return this.focus(),!1}catch(c){}},delegateType:"focusin"},blur:{trigger:function(){if(this===k()&&this.blur)return this.blur(),!1},delegateType:"focusout"},click:{trigger:function(){if(o.nodeName(this,"input")&&"checkbox"===this.type&&this.click)return this.click(),
!1},_default:function(c){return o.nodeName(c.target,"a")}},beforeunload:{postDispatch:function(c){c.result!==m&&(c.originalEvent.returnValue=c.result)}}},simulate:function(c,a,h,e){c=o.extend(new o.Event,h,{type:c,isSimulated:!0,originalEvent:{}});e?o.event.trigger(c,null,a):o.event.dispatch.call(a,c);c.isDefaultPrevented()&&h.preventDefault()}};o.removeEvent=J.removeEventListener?function(c,a,h){c.removeEventListener&&c.removeEventListener(a,h,!1)}:function(c,a,h){a="on"+a;c.detachEvent&&(typeof c[a]===
$&&(c[a]=null),c.detachEvent(a,h))};o.Event=function(c,a){if(!(this instanceof o.Event))return new o.Event(c,a);c&&c.type?(this.originalEvent=c,this.type=c.type,this.isDefaultPrevented=c.defaultPrevented||!1===c.returnValue||c.getPreventDefault&&c.getPreventDefault()?e:t):this.type=c;a&&o.extend(this,a);this.timeStamp=c&&c.timeStamp||o.now();this[o.expando]=!0};o.Event.prototype={isDefaultPrevented:t,isPropagationStopped:t,isImmediatePropagationStopped:t,preventDefault:function(){var c=this.originalEvent;
this.isDefaultPrevented=e;c&&(c.preventDefault?c.preventDefault():c.returnValue=!1)},stopPropagation:function(){var c=this.originalEvent;this.isPropagationStopped=e;c&&(c.stopPropagation&&c.stopPropagation(),c.cancelBubble=!0)},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=e;this.stopPropagation()}};o.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(c,a){o.event.special[c]={delegateType:a,bindType:a,handle:function(c){var h,e=c.relatedTarget,d=c.handleObj;if(!e||
e!==this&&!o.contains(this,e))c.type=d.origType,h=d.handler.apply(this,arguments),c.type=a;return h}}});o.support.submitBubbles||(o.event.special.submit={setup:function(){if(o.nodeName(this,"form"))return!1;o.event.add(this,"click._submit keypress._submit",function(c){c=c.target;if((c=o.nodeName(c,"input")||o.nodeName(c,"button")?c.form:m)&&!o._data(c,"submitBubbles"))o.event.add(c,"submit._submit",function(c){c._submit_bubble=!0}),o._data(c,"submitBubbles",!0)})},postDispatch:function(c){c._submit_bubble&&
(delete c._submit_bubble,this.parentNode&&!c.isTrigger&&o.event.simulate("submit",this.parentNode,c,!0))},teardown:function(){if(o.nodeName(this,"form"))return!1;o.event.remove(this,"._submit")}});o.support.changeBubbles||(o.event.special.change={setup:function(){if(Gb.test(this.nodeName)){if("checkbox"===this.type||"radio"===this.type)o.event.add(this,"propertychange._change",function(c){"checked"===c.originalEvent.propertyName&&(this._just_changed=!0)}),o.event.add(this,"click._change",function(c){this._just_changed&&
!c.isTrigger&&(this._just_changed=!1);o.event.simulate("change",this,c,!0)});return!1}o.event.add(this,"beforeactivate._change",function(c){c=c.target;Gb.test(c.nodeName)&&!o._data(c,"changeBubbles")&&(o.event.add(c,"change._change",function(c){this.parentNode&&(!c.isSimulated&&!c.isTrigger)&&o.event.simulate("change",this.parentNode,c,!0)}),o._data(c,"changeBubbles",!0))})},handle:function(c){var a=c.target;if(this!==a||c.isSimulated||c.isTrigger||"radio"!==a.type&&"checkbox"!==a.type)return c.handleObj.handler.apply(this,
arguments)},teardown:function(){o.event.remove(this,"._change");return!Gb.test(this.nodeName)}});o.support.focusinBubbles||o.each({focus:"focusin",blur:"focusout"},function(c,a){var h=0,e=function(c){o.event.simulate(a,c.target,o.event.fix(c),!0)};o.event.special[a]={setup:function(){0===h++&&J.addEventListener(c,e,!0)},teardown:function(){0===--h&&J.removeEventListener(c,e,!0)}}});o.fn.extend({on:function(c,a,h,e,d){var f,b;if("object"===typeof c){"string"!==typeof a&&(h=h||a,a=m);for(f in c)this.on(f,
a,h,c[f],d);return this}null==h&&null==e?(e=a,h=a=m):null==e&&("string"===typeof a?(e=h,h=m):(e=h,h=a,a=m));if(!1===e)e=t;else if(!e)return this;1===d&&(b=e,e=function(c){o().off(c);return b.apply(this,arguments)},e.guid=b.guid||(b.guid=o.guid++));return this.each(function(){o.event.add(this,c,e,h,a)})},one:function(c,a,h,e){return this.on(c,a,h,e,1)},off:function(c,a,h){var e;if(c&&c.preventDefault&&c.handleObj)return e=c.handleObj,o(c.delegateTarget).off(e.namespace?e.origType+"."+e.namespace:e.origType,
e.selector,e.handler),this;if("object"===typeof c){for(e in c)this.off(e,a,c[e]);return this}if(!1===a||"function"===typeof a)h=a,a=m;!1===h&&(h=t);return this.each(function(){o.event.remove(this,c,h,a)})},trigger:function(c,a){return this.each(function(){o.event.trigger(c,a,this)})},triggerHandler:function(c,a){var h=this[0];if(h)return o.event.trigger(c,a,h,!0)}});var Bc=/^.[^:#\[\.,]*$/,ld=/^(?:parents|prev(?:Until|All))/,ic=o.expr.match.needsContext,md={children:!0,contents:!0,next:!0,prev:!0};
o.fn.extend({find:function(c){var a,h=[],e=this,d=e.length;if("string"!==typeof c)return this.pushStack(o(c).filter(function(){for(a=0;a<d;a++)if(o.contains(e[a],this))return!0}));for(a=0;a<d;a++)o.find(c,e[a],h);h=this.pushStack(1<d?o.unique(h):h);h.selector=this.selector?this.selector+" "+c:c;return h},has:function(c){var a,h=o(c,this),e=h.length;return this.filter(function(){for(a=0;a<e;a++)if(o.contains(this,h[a]))return!0})},not:function(c){return this.pushStack(n(this,c||[],!0))},filter:function(c){return this.pushStack(n(this,
c||[],!1))},is:function(c){return!!n(this,"string"===typeof c&&ic.test(c)?o(c):c||[],!1).length},closest:function(c,a){for(var h,e=0,d=this.length,f=[],b=ic.test(c)||"string"!==typeof c?o(c,a||this.context):0;e<d;e++)for(h=this[e];h&&h!==a;h=h.parentNode)if(11>h.nodeType&&(b?-1<b.index(h):1===h.nodeType&&o.find.matchesSelector(h,c))){f.push(h);break}return this.pushStack(1<f.length?o.unique(f):f)},index:function(c){return!c?this[0]&&this[0].parentNode?this.first().prevAll().length:-1:"string"===typeof c?
o.inArray(this[0],o(c)):o.inArray(c.jquery?c[0]:c,this)},add:function(c,a){var h="string"===typeof c?o(c,a):o.makeArray(c&&c.nodeType?[c]:c),h=o.merge(this.get(),h);return this.pushStack(o.unique(h))},addBack:function(c){return this.add(null==c?this.prevObject:this.prevObject.filter(c))}});o.each({parent:function(c){return(c=c.parentNode)&&11!==c.nodeType?c:null},parents:function(c){return o.dir(c,"parentNode")},parentsUntil:function(c,a,h){return o.dir(c,"parentNode",h)},next:function(c){return q(c,
"nextSibling")},prev:function(c){return q(c,"previousSibling")},nextAll:function(c){return o.dir(c,"nextSibling")},prevAll:function(c){return o.dir(c,"previousSibling")},nextUntil:function(c,a,h){return o.dir(c,"nextSibling",h)},prevUntil:function(c,a,h){return o.dir(c,"previousSibling",h)},siblings:function(c){return o.sibling((c.parentNode||{}).firstChild,c)},children:function(c){return o.sibling(c.firstChild)},contents:function(c){return o.nodeName(c,"iframe")?c.contentDocument||c.contentWindow.document:
o.merge([],c.childNodes)}},function(c,a){o.fn[c]=function(h,e){var d=o.map(this,a,h);"Until"!==c.slice(-5)&&(e=h);e&&"string"===typeof e&&(d=o.filter(e,d));1<this.length&&(md[c]||(d=o.unique(d)),ld.test(c)&&(d=d.reverse()));return this.pushStack(d)}});o.extend({filter:function(c,a,h){var e=a[0];h&&(c=":not("+c+")");return 1===a.length&&1===e.nodeType?o.find.matchesSelector(e,c)?[e]:[]:o.find.matches(c,o.grep(a,function(c){return 1===c.nodeType}))},dir:function(c,a,h){var e=[];for(c=c[a];c&&9!==c.nodeType&&
(h===m||1!==c.nodeType||!o(c).is(h));)1===c.nodeType&&e.push(c),c=c[a];return e},sibling:function(c,a){for(var h=[];c;c=c.nextSibling)1===c.nodeType&&c!==a&&h.push(c);return h}});var Ob="abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",nd=/ jQuery\d+="(?:null|\d+)"/g,jc=RegExp("\x3c(?:"+Ob+")[\\s/\x3e]","i"),Hb=/^\s+/,kc=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
lc=/<([\w:]+)/,mc=/<tbody/i,od=/<|&#?\w+;/,pd=/<(?:script|style|link)/i,nb=/^(?:checkbox|radio)$/i,qd=/checked\s*(?:[^=]|=\s*.checked.)/i,nc=/^$|\/(?:java|ecma)script/i,Cc=/^true\/(.*)/,rd=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,ia={option:[1,"\x3cselect multiple\x3d'multiple'\x3e","\x3c/select\x3e"],legend:[1,"\x3cfieldset\x3e","\x3c/fieldset\x3e"],area:[1,"\x3cmap\x3e","\x3c/map\x3e"],param:[1,"\x3cobject\x3e","\x3c/object\x3e"],thead:[1,"\x3ctable\x3e","\x3c/table\x3e"],tr:[2,"\x3ctable\x3e\x3ctbody\x3e",
"\x3c/tbody\x3e\x3c/table\x3e"],col:[2,"\x3ctable\x3e\x3ctbody\x3e\x3c/tbody\x3e\x3ccolgroup\x3e","\x3c/colgroup\x3e\x3c/table\x3e"],td:[3,"\x3ctable\x3e\x3ctbody\x3e\x3ctr\x3e","\x3c/tr\x3e\x3c/tbody\x3e\x3c/table\x3e"],_default:o.support.htmlSerialize?[0,"",""]:[1,"X\x3cdiv\x3e","\x3c/div\x3e"]},Ib=y(J).appendChild(J.createElement("div"));ia.optgroup=ia.option;ia.tbody=ia.tfoot=ia.colgroup=ia.caption=ia.thead;ia.th=ia.td;o.fn.extend({text:function(c){return o.access(this,function(c){return c===
m?o.text(this):this.empty().append((this[0]&&this[0].ownerDocument||J).createTextNode(c))},null,c,arguments.length)},append:function(){return this.domManip(arguments,function(c){(1===this.nodeType||11===this.nodeType||9===this.nodeType)&&z(this,c).appendChild(c)})},prepend:function(){return this.domManip(arguments,function(c){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var a=z(this,c);a.insertBefore(c,a.firstChild)}})},before:function(){return this.domManip(arguments,function(c){this.parentNode&&
this.parentNode.insertBefore(c,this)})},after:function(){return this.domManip(arguments,function(c){this.parentNode&&this.parentNode.insertBefore(c,this.nextSibling)})},remove:function(c,a){for(var h,e=c?o.filter(c,this):this,d=0;null!=(h=e[d]);d++)!a&&1===h.nodeType&&o.cleanData(w(h)),h.parentNode&&(a&&o.contains(h.ownerDocument,h)&&r(w(h,"script")),h.parentNode.removeChild(h));return this},empty:function(){for(var c,a=0;null!=(c=this[a]);a++){for(1===c.nodeType&&o.cleanData(w(c,!1));c.firstChild;)c.removeChild(c.firstChild);
c.options&&o.nodeName(c,"select")&&(c.options.length=0)}return this},clone:function(c,a){c=null==c?!1:c;a=null==a?c:a;return this.map(function(){return o.clone(this,c,a)})},html:function(c){return o.access(this,function(c){var a=this[0]||{},h=0,e=this.length;if(c===m)return 1===a.nodeType?a.innerHTML.replace(nd,""):m;if("string"===typeof c&&!pd.test(c)&&(o.support.htmlSerialize||!jc.test(c))&&(o.support.leadingWhitespace||!Hb.test(c))&&!ia[(lc.exec(c)||["",""])[1].toLowerCase()]){c=c.replace(kc,"\x3c$1\x3e\x3c/$2\x3e");
try{for(;h<e;h++)a=this[h]||{},1===a.nodeType&&(o.cleanData(w(a,!1)),a.innerHTML=c);a=0}catch(d){}}a&&this.empty().append(c)},null,c,arguments.length)},replaceWith:function(){var c=o.map(this,function(c){return[c.nextSibling,c.parentNode]}),a=0;this.domManip(arguments,function(h){var e=c[a++],d=c[a++];d&&(e&&e.parentNode!==d&&(e=this.nextSibling),o(this).remove(),d.insertBefore(h,e))},!0);return a?this:this.remove()},detach:function(c){return this.remove(c,!0)},domManip:function(c,a,h){c=sa.apply([],
c);var e,d,f,b,k=0,n=this.length,g=this,q=n-1,t=c[0],j=o.isFunction(t);if(j||!(1>=n||"string"!==typeof t||o.support.checkClone||!qd.test(t)))return this.each(function(e){var d=g.eq(e);j&&(c[0]=t.call(this,e,d.html()));d.domManip(c,a,h)});if(n&&(b=o.buildFragment(c,this[0].ownerDocument,!1,!h&&this),e=b.firstChild,1===b.childNodes.length&&(b=e),e)){f=o.map(w(b,"script"),p);for(d=f.length;k<n;k++)e=b,k!==q&&(e=o.clone(e,!0,!0),d&&o.merge(f,w(e,"script"))),a.call(this[k],e,k);if(d){b=f[f.length-1].ownerDocument;
o.map(f,u);for(k=0;k<d;k++)if(e=f[k],nc.test(e.type||"")&&!o._data(e,"globalEval")&&o.contains(b,e))e.src?o._evalUrl(e.src):o.globalEval((e.text||e.textContent||e.innerHTML||"").replace(rd,""))}b=e=null}return this}});o.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(c,a){o.fn[c]=function(c){for(var h=0,e=[],d=o(c),f=d.length-1;h<=f;h++)c=h===f?this:this.clone(!0),o(d[h])[a](c),qa.apply(e,c.get());return this.pushStack(e)}});
o.extend({clone:function(c,a,h){var e,d,f,b,k,n=o.contains(c.ownerDocument,c);o.support.html5Clone||o.isXMLDoc(c)||!jc.test("\x3c"+c.nodeName+"\x3e")?f=c.cloneNode(!0):(Ib.innerHTML=c.outerHTML,Ib.removeChild(f=Ib.firstChild));if((!o.support.noCloneEvent||!o.support.noCloneChecked)&&(1===c.nodeType||11===c.nodeType)&&!o.isXMLDoc(c)){e=w(f);k=w(c);for(b=0;null!=(d=k[b]);++b)if(e[b]){var g=e[b],q=void 0,t=void 0,j=void 0;if(1===g.nodeType){q=g.nodeName.toLowerCase();if(!o.support.noCloneEvent&&g[o.expando]){j=
o._data(g);for(t in j.events)o.removeEvent(g,t,j.handle);g.removeAttribute(o.expando)}if("script"===q&&g.text!==d.text)p(g).text=d.text,u(g);else if("object"===q)g.parentNode&&(g.outerHTML=d.outerHTML),o.support.html5Clone&&(d.innerHTML&&!o.trim(g.innerHTML))&&(g.innerHTML=d.innerHTML);else if("input"===q&&nb.test(d.type))g.defaultChecked=g.checked=d.checked,g.value!==d.value&&(g.value=d.value);else if("option"===q)g.defaultSelected=g.selected=d.defaultSelected;else if("input"===q||"textarea"===q)g.defaultValue=
d.defaultValue}}}if(a)if(h){k=k||w(c);e=e||w(f);for(b=0;null!=(d=k[b]);b++)v(d,e[b])}else v(c,f);e=w(f,"script");0<e.length&&r(e,!n&&w(c,"script"));return f},buildFragment:function(c,a,h,e){for(var d,f,b,k,g,n,q=c.length,t=y(a),j=[],l=0;l<q;l++)if((f=c[l])||0===f)if("object"===o.type(f))o.merge(j,f.nodeType?[f]:f);else if(od.test(f)){b=b||t.appendChild(a.createElement("div"));k=(lc.exec(f)||["",""])[1].toLowerCase();n=ia[k]||ia._default;b.innerHTML=n[1]+f.replace(kc,"\x3c$1\x3e\x3c/$2\x3e")+n[2];
for(d=n[0];d--;)b=b.lastChild;!o.support.leadingWhitespace&&Hb.test(f)&&j.push(a.createTextNode(Hb.exec(f)[0]));if(!o.support.tbody)for(d=(f="table"===k&&!mc.test(f)?b.firstChild:"\x3ctable\x3e"===n[1]&&!mc.test(f)?b:0)&&f.childNodes.length;d--;)o.nodeName(g=f.childNodes[d],"tbody")&&!g.childNodes.length&&f.removeChild(g);o.merge(j,b.childNodes);for(b.textContent="";b.firstChild;)b.removeChild(b.firstChild);b=t.lastChild}else j.push(a.createTextNode(f));b&&t.removeChild(b);o.support.appendChecked||
o.grep(w(j,"input"),A);for(l=0;f=j[l++];)if(!(e&&-1!==o.inArray(f,e))&&(c=o.contains(f.ownerDocument,f),b=w(t.appendChild(f),"script"),c&&r(b),h))for(d=0;f=b[d++];)nc.test(f.type||"")&&h.push(f);return t},cleanData:function(c,a){for(var h,e,d,f,b=0,k=o.expando,g=o.cache,n=o.support.deleteExpando,q=o.event.special;null!=(h=c[b]);b++)if(a||o.acceptData(h))if(f=(d=h[k])&&g[d]){if(f.events)for(e in f.events)q[e]?o.event.remove(h,e):o.removeEvent(h,e,f.handle);g[d]&&(delete g[d],n?delete h[k]:typeof h.removeAttribute!==
$?h.removeAttribute(k):h[k]=null,ha.push(d))}},_evalUrl:function(c){return o.ajax({url:c,type:"GET",dataType:"script",async:!1,global:!1,"throws":!0})}});o.fn.extend({wrapAll:function(c){if(o.isFunction(c))return this.each(function(a){o(this).wrapAll(c.call(this,a))});if(this[0]){var a=o(c,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&a.insertBefore(this[0]);a.map(function(){for(var c=this;c.firstChild&&1===c.firstChild.nodeType;)c=c.firstChild;return c}).append(this)}return this},wrapInner:function(c){return o.isFunction(c)?
this.each(function(a){o(this).wrapInner(c.call(this,a))}):this.each(function(){var a=o(this),h=a.contents();h.length?h.wrapAll(c):a.append(c)})},wrap:function(c){var a=o.isFunction(c);return this.each(function(h){o(this).wrapAll(a?c.call(this,h):c)})},unwrap:function(){return this.parent().each(function(){o.nodeName(this,"body")||o(this).replaceWith(this.childNodes)}).end()}});var Qa,Ba,Ca,Jb=/alpha\([^)]*\)/i,sd=/opacity\s*=\s*([^)]*)/,td=/^(top|right|bottom|left)$/,ud=/^(none|table(?!-c[ea]).+)/,
oc=/^margin/,Dc=RegExp("^("+Ya+")(.*)$","i"),Wa=RegExp("^("+Ya+")(?!px)[a-z%]+$","i"),vd=RegExp("^([+-])\x3d("+Ya+")","i"),Qb={BODY:"block"},wd={position:"absolute",visibility:"hidden",display:"block"},pc={letterSpacing:0,fontWeight:400},Aa=["Top","Right","Bottom","Left"],Pb=["Webkit","O","Moz","ms"];o.fn.extend({css:function(c,a){return o.access(this,function(c,a,h){var e,d={},f=0;if(o.isArray(a)){e=Ba(c);for(h=a.length;f<h;f++)d[a[f]]=o.css(c,a[f],!1,e);return d}return h!==m?o.style(c,a,h):o.css(c,
a)},c,a,1<arguments.length)},show:function(){return h(this,!0)},hide:function(){return h(this)},toggle:function(a){return"boolean"===typeof a?a?this.show():this.hide():this.each(function(){c(this)?o(this).show():o(this).hide()})}});o.extend({cssHooks:{opacity:{get:function(c,a){if(a){var h=Ca(c,"opacity");return""===h?"1":h}}}},cssNumber:{columnCount:!0,fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":o.support.cssFloat?"cssFloat":
"styleFloat"},style:function(c,a,h,e){if(c&&!(3===c.nodeType||8===c.nodeType||!c.style)){var d,f,b,k=o.camelCase(a),g=c.style;a=o.cssProps[k]||(o.cssProps[k]=B(g,k));b=o.cssHooks[a]||o.cssHooks[k];if(h!==m){f=typeof h;if("string"===f&&(d=vd.exec(h)))h=(d[1]+1)*d[2]+parseFloat(o.css(c,a)),f="number";if(!(null==h||"number"===f&&isNaN(h)))if("number"===f&&!o.cssNumber[k]&&(h+="px"),!o.support.clearCloneStyle&&(""===h&&0===a.indexOf("background"))&&(g[a]="inherit"),!b||!("set"in b)||(h=b.set(c,h,e))!==
m)try{g[a]=h}catch(n){}}else return b&&"get"in b&&(d=b.get(c,!1,e))!==m?d:g[a]}},css:function(c,a,h,e){var d,f;f=o.camelCase(a);a=o.cssProps[f]||(o.cssProps[f]=B(c.style,f));(f=o.cssHooks[a]||o.cssHooks[f])&&"get"in f&&(d=f.get(c,!0,h));d===m&&(d=Ca(c,a,e));"normal"===d&&a in pc&&(d=pc[a]);return""===h||h?(c=parseFloat(d),!0===h||o.isNumeric(c)?c||0:d):d}});b.getComputedStyle?(Ba=function(c){return b.getComputedStyle(c,null)},Ca=function(c,a,h){var e,d=(h=h||Ba(c))?h.getPropertyValue(a)||h[a]:m,f=
c.style;h&&(""===d&&!o.contains(c.ownerDocument,c)&&(d=o.style(c,a)),Wa.test(d)&&oc.test(a)&&(c=f.width,a=f.minWidth,e=f.maxWidth,f.minWidth=f.maxWidth=f.width=d,d=h.width,f.width=c,f.minWidth=a,f.maxWidth=e));return d}):J.documentElement.currentStyle&&(Ba=function(c){return c.currentStyle},Ca=function(c,a,h){var e,d,f=(h=h||Ba(c))?h[a]:m,b=c.style;null==f&&(b&&b[a])&&(f=b[a]);if(Wa.test(f)&&!td.test(a)){h=b.left;if(d=(e=c.runtimeStyle)&&e.left)e.left=c.currentStyle.left;b.left="fontSize"===a?"1em":
f;f=b.pixelLeft+"px";b.left=h;d&&(e.left=d)}return""===f?"auto":f});o.each(["height","width"],function(c,a){o.cssHooks[a]={get:function(c,h,e){if(h)return 0===c.offsetWidth&&ud.test(o.css(c,"display"))?o.swap(c,wd,function(){return H(c,a,e)}):H(c,a,e)},set:function(c,h,e){var d=e&&Ba(c);return D(c,h,e?C(c,a,e,o.support.boxSizing&&"border-box"===o.css(c,"boxSizing",!1,d),d):0)}}});o.support.opacity||(o.cssHooks.opacity={get:function(c,a){return sd.test((a&&c.currentStyle?c.currentStyle.filter:c.style.filter)||
"")?0.01*parseFloat(RegExp.$1)+"":a?"1":""},set:function(c,a){var h=c.style,e=c.currentStyle,d=o.isNumeric(a)?"alpha(opacity\x3d"+100*a+")":"",f=e&&e.filter||h.filter||"";h.zoom=1;if((1<=a||""===a)&&""===o.trim(f.replace(Jb,""))&&h.removeAttribute)if(h.removeAttribute("filter"),""===a||e&&!e.filter)return;h.filter=Jb.test(f)?f.replace(Jb,d):f+" "+d}});o(function(){o.support.reliableMarginRight||(o.cssHooks.marginRight={get:function(c,a){if(a)return o.swap(c,{display:"inline-block"},Ca,[c,"marginRight"])}});
!o.support.pixelPosition&&o.fn.position&&o.each(["top","left"],function(c,a){o.cssHooks[a]={get:function(c,h){if(h)return h=Ca(c,a),Wa.test(h)?o(c).position()[a]+"px":h}}})});o.expr&&o.expr.filters&&(o.expr.filters.hidden=function(c){return 0>=c.offsetWidth&&0>=c.offsetHeight||!o.support.reliableHiddenOffsets&&"none"===(c.style&&c.style.display||o.css(c,"display"))},o.expr.filters.visible=function(c){return!o.expr.filters.hidden(c)});o.each({margin:"",padding:"",border:"Width"},function(c,a){o.cssHooks[c+
a]={expand:function(h){var e=0,d={};for(h="string"===typeof h?h.split(" "):[h];4>e;e++)d[c+Aa[e]+a]=h[e]||h[e-2]||h[0];return d}};oc.test(c)||(o.cssHooks[c+a].set=D)});var xd=/%20/g,Ec=/\[\]$/,qc=/\r?\n/g,yd=/^(?:submit|button|image|reset|file)$/i,zd=/^(?:input|select|textarea|keygen)/i;o.fn.extend({serialize:function(){return o.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var c=o.prop(this,"elements");return c?o.makeArray(c):this}).filter(function(){var c=this.type;
return this.name&&!o(this).is(":disabled")&&zd.test(this.nodeName)&&!yd.test(c)&&(this.checked||!nb.test(c))}).map(function(c,a){var h=o(this).val();return null==h?null:o.isArray(h)?o.map(h,function(c){return{name:a.name,value:c.replace(qc,"\r\n")}}):{name:a.name,value:h.replace(qc,"\r\n")}}).get()}});o.param=function(c,a){var h,e=[],d=function(c,a){a=o.isFunction(a)?a():null==a?"":a;e[e.length]=encodeURIComponent(c)+"\x3d"+encodeURIComponent(a)};a===m&&(a=o.ajaxSettings&&o.ajaxSettings.traditional);
if(o.isArray(c)||c.jquery&&!o.isPlainObject(c))o.each(c,function(){d(this.name,this.value)});else for(h in c)K(h,c[h],a,d);return e.join("\x26").replace(xd,"+")};o.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(c,a){o.fn[a]=function(c,h){return 0<arguments.length?this.on(a,null,c,h):this.trigger(a)}});o.fn.extend({hover:function(c,
a){return this.mouseenter(c).mouseleave(a||c)},bind:function(c,a,h){return this.on(c,null,a,h)},unbind:function(c,a){return this.off(c,null,a)},delegate:function(c,a,h,e){return this.on(a,c,h,e)},undelegate:function(c,a,h){return 1===arguments.length?this.off(c,"**"):this.off(a,c||"**",h)}});var Ja,za,Kb=o.now(),Lb=/\?/,Ad=/#.*$/,rc=/([?&])_=[^&]*/,Bd=/^(.*?):[ \t]*([^\r\n]*)\r?$/mg,Cd=/^(?:GET|HEAD)$/,Dd=/^\/\//,sc=/^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,tc=o.fn.load,uc={},ob={},vc="*/".concat("*");
try{za=Gc.href}catch(Jd){za=J.createElement("a"),za.href="",za=za.href}Ja=sc.exec(za.toLowerCase())||[];o.fn.load=function(c,a,h){if("string"!==typeof c&&tc)return tc.apply(this,arguments);var e,d,f,b=this,k=c.indexOf(" ");0<=k&&(e=c.slice(k,c.length),c=c.slice(0,k));o.isFunction(a)?(h=a,a=m):a&&"object"===typeof a&&(f="POST");0<b.length&&o.ajax({url:c,type:f,dataType:"html",data:a}).done(function(c){d=arguments;b.html(e?o("\x3cdiv\x3e").append(o.parseHTML(c)).find(e):c)}).complete(h&&function(c,
a){b.each(h,d||[c.responseText,a,c])});return this};o.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "),function(c,a){o.fn[a]=function(c){return this.on(a,c)}});o.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:za,type:"GET",isLocal:/^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(Ja[1]),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset\x3dUTF-8",accepts:{"*":vc,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",
json:"application/json, text/javascript"},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":o.parseJSON,"text xml":o.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(c,a){return a?E(E(c,o.ajaxSettings),a):E(o.ajaxSettings,c)},ajaxPrefilter:I(uc),ajaxTransport:I(ob),ajax:function(c,a){function h(c,a,e,d){var q,x,u,C;C=a;if(2!==r){r=2;k&&clearTimeout(k);n=m;b=d||
"";v.readyState=0<c?4:0;d=200<=c&&300>c||304===c;if(e){u=t;for(var z=v,w,H,F,G,A=u.contents,E=u.dataTypes;"*"===E[0];)E.shift(),H===m&&(H=u.mimeType||z.getResponseHeader("Content-Type"));if(H)for(G in A)if(A[G]&&A[G].test(H)){E.unshift(G);break}if(E[0]in e)F=E[0];else{for(G in e){if(!E[0]||u.converters[G+" "+E[0]]){F=G;break}w||(w=G)}F=F||w}F?(F!==E[0]&&E.unshift(F),u=e[F]):u=void 0}a:{e=t;w=u;H=v;F=d;var B,K,I,z={},A=e.dataTypes.slice();if(A[1])for(K in e.converters)z[K.toLowerCase()]=e.converters[K];
for(G=A.shift();G;)if(e.responseFields[G]&&(H[e.responseFields[G]]=w),!I&&(F&&e.dataFilter)&&(w=e.dataFilter(w,e.dataType)),I=G,G=A.shift())if("*"===G)G=I;else if("*"!==I&&I!==G){K=z[I+" "+G]||z["* "+G];if(!K)for(B in z)if(u=B.split(" "),u[1]===G&&(K=z[I+" "+u[0]]||z["* "+u[0]])){!0===K?K=z[B]:!0!==z[B]&&(G=u[0],A.unshift(u[1]));break}if(!0!==K)if(K&&e["throws"])w=K(w);else try{w=K(w)}catch(mb){u={state:"parsererror",error:K?mb:"No conversion from "+I+" to "+G};break a}}u={state:"success",data:w}}if(d)t.ifModified&&
((C=v.getResponseHeader("Last-Modified"))&&(o.lastModified[f]=C),(C=v.getResponseHeader("etag"))&&(o.etag[f]=C)),204===c||"HEAD"===t.type?C="nocontent":304===c?C="notmodified":(C=u.state,q=u.data,x=u.error,d=!x);else if(x=C,c||!C)C="error",0>c&&(c=0);v.status=c;v.statusText=(a||C)+"";d?D.resolveWith(j,[q,C,v]):D.rejectWith(j,[v,C,x]);v.statusCode(p);p=m;g&&l.trigger(d?"ajaxSuccess":"ajaxError",[v,t,d?q:x]);y.fireWith(j,[v,C]);g&&(l.trigger("ajaxComplete",[v,t]),--o.active||o.event.trigger("ajaxStop"))}}
"object"===typeof c&&(a=c,c=m);a=a||{};var e,d,f,b,k,g,n,q,t=o.ajaxSetup({},a),j=t.context||t,l=t.context&&(j.nodeType||j.jquery)?o(j):o.event,D=o.Deferred(),y=o.Callbacks("once memory"),p=t.statusCode||{},u={},C={},r=0,z="canceled",v={readyState:0,getResponseHeader:function(c){var a;if(2===r){if(!q)for(q={};a=Bd.exec(b);)q[a[1].toLowerCase()]=a[2];a=q[c.toLowerCase()]}return null==a?null:a},getAllResponseHeaders:function(){return 2===r?b:null},setRequestHeader:function(c,a){var h=c.toLowerCase();
r||(c=C[h]=C[h]||c,u[c]=a);return this},overrideMimeType:function(c){r||(t.mimeType=c);return this},statusCode:function(c){var a;if(c)if(2>r)for(a in c)p[a]=[p[a],c[a]];else v.always(c[v.status]);return this},abort:function(c){c=c||z;n&&n.abort(c);h(0,c);return this}};D.promise(v).complete=y.add;v.success=v.done;v.error=v.fail;t.url=((c||t.url||za)+"").replace(Ad,"").replace(Dd,Ja[1]+"//");t.type=a.method||a.type||t.method||t.type;t.dataTypes=o.trim(t.dataType||"*").toLowerCase().match(pa)||[""];
null==t.crossDomain&&(e=sc.exec(t.url.toLowerCase()),t.crossDomain=!(!e||!(e[1]!==Ja[1]||e[2]!==Ja[2]||(e[3]||("http:"===e[1]?"80":"443"))!==(Ja[3]||("http:"===Ja[1]?"80":"443")))));t.data&&(t.processData&&"string"!==typeof t.data)&&(t.data=o.param(t.data,t.traditional));W(uc,t,a,v);if(2===r)return v;(g=t.global)&&0===o.active++&&o.event.trigger("ajaxStart");t.type=t.type.toUpperCase();t.hasContent=!Cd.test(t.type);f=t.url;t.hasContent||(t.data&&(f=t.url+=(Lb.test(f)?"\x26":"?")+t.data,delete t.data),
!1===t.cache&&(t.url=rc.test(f)?f.replace(rc,"$1_\x3d"+Kb++):f+(Lb.test(f)?"\x26":"?")+"_\x3d"+Kb++));t.ifModified&&(o.lastModified[f]&&v.setRequestHeader("If-Modified-Since",o.lastModified[f]),o.etag[f]&&v.setRequestHeader("If-None-Match",o.etag[f]));(t.data&&t.hasContent&&!1!==t.contentType||a.contentType)&&v.setRequestHeader("Content-Type",t.contentType);v.setRequestHeader("Accept",t.dataTypes[0]&&t.accepts[t.dataTypes[0]]?t.accepts[t.dataTypes[0]]+("*"!==t.dataTypes[0]?", "+vc+"; q\x3d0.01":""):
t.accepts["*"]);for(d in t.headers)v.setRequestHeader(d,t.headers[d]);if(t.beforeSend&&(!1===t.beforeSend.call(j,v,t)||2===r))return v.abort();z="abort";for(d in{success:1,error:1,complete:1})v[d](t[d]);if(n=W(ob,t,a,v)){v.readyState=1;g&&l.trigger("ajaxSend",[v,t]);t.async&&0<t.timeout&&(k=setTimeout(function(){v.abort("timeout")},t.timeout));try{r=1,n.send(u,h)}catch(w){if(2>r)h(-1,w);else throw w;}}else h(-1,"No Transport");return v},getJSON:function(c,a,h){return o.get(c,a,h,"json")},getScript:function(c,
a){return o.get(c,m,a,"script")}});o.each(["get","post"],function(c,a){o[a]=function(c,h,e,d){o.isFunction(h)&&(d=d||e,e=h,h=m);return o.ajax({url:c,type:a,dataType:d,data:h,success:e})}});o.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/(?:java|ecma)script/},converters:{"text script":function(c){o.globalEval(c);return c}}});o.ajaxPrefilter("script",function(c){c.cache===m&&(c.cache=!1);c.crossDomain&&(c.type=
"GET",c.global=!1)});o.ajaxTransport("script",function(c){if(c.crossDomain){var a,h=J.head||o("head")[0]||J.documentElement;return{send:function(e,d){a=J.createElement("script");a.async=!0;c.scriptCharset&&(a.charset=c.scriptCharset);a.src=c.url;a.onload=a.onreadystatechange=function(c,h){if(h||!a.readyState||/loaded|complete/.test(a.readyState))a.onload=a.onreadystatechange=null,a.parentNode&&a.parentNode.removeChild(a),a=null,h||d(200,"success")};h.insertBefore(a,h.firstChild)},abort:function(){if(a)a.onload(m,
!0)}}}});var wc=[],Mb=/(=)\?(?=&|$)|\?\?/;o.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var c=wc.pop()||o.expando+"_"+Kb++;this[c]=!0;return c}});o.ajaxPrefilter("json jsonp",function(c,a,h){var e,d,f,k=!1!==c.jsonp&&(Mb.test(c.url)?"url":"string"===typeof c.data&&!(c.contentType||"").indexOf("application/x-www-form-urlencoded")&&Mb.test(c.data)&&"data");if(k||"jsonp"===c.dataTypes[0])return e=c.jsonpCallback=o.isFunction(c.jsonpCallback)?c.jsonpCallback():c.jsonpCallback,k?c[k]=c[k].replace(Mb,
"$1"+e):!1!==c.jsonp&&(c.url+=(Lb.test(c.url)?"\x26":"?")+c.jsonp+"\x3d"+e),c.converters["script json"]=function(){f||o.error(e+" was not called");return f[0]},c.dataTypes[0]="json",d=b[e],b[e]=function(){f=arguments},h.always(function(){b[e]=d;c[e]&&(c.jsonpCallback=a.jsonpCallback,wc.push(e));f&&o.isFunction(d)&&d(f[0]);f=d=m}),"script"});var Pa,Va,Ed=0,Nb=b.ActiveXObject&&function(){for(var c in Pa)Pa[c](m,!0)};o.ajaxSettings.xhr=b.ActiveXObject?function(){var c;if(!(c=!this.isLocal&&N()))a:{try{c=
new b.ActiveXObject("Microsoft.XMLHTTP");break a}catch(a){}c=void 0}return c}:N;Va=o.ajaxSettings.xhr();o.support.cors=!!Va&&"withCredentials"in Va;(Va=o.support.ajax=!!Va)&&o.ajaxTransport(function(c){if(!c.crossDomain||o.support.cors){var a;return{send:function(h,e){var d,f,k=c.xhr();c.username?k.open(c.type,c.url,c.async,c.username,c.password):k.open(c.type,c.url,c.async);if(c.xhrFields)for(f in c.xhrFields)k[f]=c.xhrFields[f];c.mimeType&&k.overrideMimeType&&k.overrideMimeType(c.mimeType);!c.crossDomain&&
!h["X-Requested-With"]&&(h["X-Requested-With"]="XMLHttpRequest");try{for(f in h)k.setRequestHeader(f,h[f])}catch(g){}k.send(c.hasContent&&c.data||null);a=function(h,f){var b,g,n,q;try{if(a&&(f||4===k.readyState))if(a=m,d&&(k.onreadystatechange=o.noop,Nb&&delete Pa[d]),f)4!==k.readyState&&k.abort();else{q={};b=k.status;g=k.getAllResponseHeaders();"string"===typeof k.responseText&&(q.text=k.responseText);try{n=k.statusText}catch(t){n=""}!b&&c.isLocal&&!c.crossDomain?b=q.text?200:404:1223===b&&(b=204)}}catch(j){f||
e(-1,j)}q&&e(b,n,q,g)};c.async?4===k.readyState?setTimeout(a):(d=++Ed,Nb&&(Pa||(Pa={},o(b).unload(Nb)),Pa[d]=a),k.onreadystatechange=a):a()},abort:function(){a&&a(m,!0)}}}});var Ka,lb,Fd=/^(?:toggle|show|hide)$/,xc=RegExp("^(?:([+-])\x3d|)("+Ya+")([a-z%]*)$","i"),Gd=/queueHooks$/,Xa=[function(a,h,e){var d,f,b,k,g,n=this,q={},t=a.style,j=a.nodeType&&c(a),l=o._data(a,"fxshow");e.queue||(k=o._queueHooks(a,"fx"),null==k.unqueued&&(k.unqueued=0,g=k.empty.fire,k.empty.fire=function(){k.unqueued||g()}),
k.unqueued++,n.always(function(){n.always(function(){k.unqueued--;o.queue(a,"fx").length||k.empty.fire()})}));if(1===a.nodeType&&("height"in h||"width"in h))e.overflow=[t.overflow,t.overflowX,t.overflowY],"inline"===o.css(a,"display")&&"none"===o.css(a,"float")&&(!o.support.inlineBlockNeedsLayout||"inline"===F(a.nodeName)?t.display="inline-block":t.zoom=1);e.overflow&&(t.overflow="hidden",o.support.shrinkWrapBlocks||n.always(function(){t.overflow=e.overflow[0];t.overflowX=e.overflow[1];t.overflowY=
e.overflow[2]}));for(d in h)if(f=h[d],Fd.exec(f)&&(delete h[d],b=b||"toggle"===f,f!==(j?"hide":"show")))q[d]=l&&l[d]||o.style(a,d);if(!o.isEmptyObject(q))for(d in l?"hidden"in l&&(j=l.hidden):l=o._data(a,"fxshow",{}),b&&(l.hidden=!j),j?o(a).show():n.done(function(){o(a).hide()}),n.done(function(){var c;o._removeData(a,"fxshow");for(c in q)o.style(a,c,q[c])}),q)h=ca(j?l[d]:0,d,n),d in l||(l[d]=h.start,j&&(h.end=h.start,h.start="width"===d||"height"===d?1:0))}],Ra={"*":[function(c,a){var h=this.createTween(c,
a),e=h.cur(),d=xc.exec(a),f=d&&d[3]||(o.cssNumber[c]?"":"px"),b=(o.cssNumber[c]||"px"!==f&&+e)&&xc.exec(o.css(h.elem,c)),k=1,g=20;if(b&&b[3]!==f){f=f||b[3];d=d||[];b=+e||1;do k=k||".5",b/=k,o.style(h.elem,c,b+f);while(k!==(k=h.cur()/e)&&1!==k&&--g)}d&&(b=h.start=+b||+e||0,h.unit=f,h.end=d[1]?b+(d[1]+1)*d[2]:+d[2]);return h}]};o.Animation=o.extend(da,{tweener:function(c,a){o.isFunction(c)?(a=c,c=["*"]):c=c.split(" ");for(var h,e=0,d=c.length;e<d;e++)h=c[e],Ra[h]=Ra[h]||[],Ra[h].unshift(a)},prefilter:function(c,
a){a?Xa.unshift(c):Xa.push(c)}});o.Tween=U;U.prototype={constructor:U,init:function(c,a,h,e,d,f){this.elem=c;this.prop=h;this.easing=d||"swing";this.options=a;this.start=this.now=this.cur();this.end=e;this.unit=f||(o.cssNumber[h]?"":"px")},cur:function(){var c=U.propHooks[this.prop];return c&&c.get?c.get(this):U.propHooks._default.get(this)},run:function(c){var a,h=U.propHooks[this.prop];this.pos=this.options.duration?a=o.easing[this.easing](c,this.options.duration*c,0,1,this.options.duration):a=
c;this.now=(this.end-this.start)*a+this.start;this.options.step&&this.options.step.call(this.elem,this.now,this);h&&h.set?h.set(this):U.propHooks._default.set(this);return this}};U.prototype.init.prototype=U.prototype;U.propHooks={_default:{get:function(c){if(null!=c.elem[c.prop]&&(!c.elem.style||null==c.elem.style[c.prop]))return c.elem[c.prop];c=o.css(c.elem,c.prop,"");return!c||"auto"===c?0:c},set:function(c){if(o.fx.step[c.prop])o.fx.step[c.prop](c);else c.elem.style&&(null!=c.elem.style[o.cssProps[c.prop]]||
o.cssHooks[c.prop])?o.style(c.elem,c.prop,c.now+c.unit):c.elem[c.prop]=c.now}}};U.propHooks.scrollTop=U.propHooks.scrollLeft={set:function(c){c.elem.nodeType&&c.elem.parentNode&&(c.elem[c.prop]=c.now)}};o.each(["toggle","show","hide"],function(c,a){var h=o.fn[a];o.fn[a]=function(c,e,d){return null==c||"boolean"===typeof c?h.apply(this,arguments):this.animate(S(a,!0),c,e,d)}});o.fn.extend({fadeTo:function(a,h,e,d){return this.filter(c).css("opacity",0).show().end().animate({opacity:h},a,e,d)},animate:function(c,
a,h,e){var d=o.isEmptyObject(c),f=o.speed(a,h,e);a=function(){var a=da(this,o.extend({},c),f);(d||o._data(this,"finish"))&&a.stop(!0)};a.finish=a;return d||!1===f.queue?this.each(a):this.queue(f.queue,a)},stop:function(c,a,h){var e=function(c){var a=c.stop;delete c.stop;a(h)};"string"!==typeof c&&(h=a,a=c,c=m);a&&!1!==c&&this.queue(c||"fx",[]);return this.each(function(){var a=!0,d=null!=c&&c+"queueHooks",f=o.timers,b=o._data(this);if(d)b[d]&&b[d].stop&&e(b[d]);else for(d in b)b[d]&&(b[d].stop&&Gd.test(d))&&
e(b[d]);for(d=f.length;d--;)if(f[d].elem===this&&(null==c||f[d].queue===c))f[d].anim.stop(h),a=!1,f.splice(d,1);(a||!h)&&o.dequeue(this,c)})},finish:function(c){!1!==c&&(c=c||"fx");return this.each(function(){var a,h=o._data(this),e=h[c+"queue"];a=h[c+"queueHooks"];var d=o.timers,f=e?e.length:0;h.finish=!0;o.queue(this,c,[]);a&&a.stop&&a.stop.call(this,!0);for(a=d.length;a--;)d[a].elem===this&&d[a].queue===c&&(d[a].anim.stop(!0),d.splice(a,1));for(a=0;a<f;a++)e[a]&&e[a].finish&&e[a].finish.call(this);
delete h.finish})}});o.each({slideDown:S("show"),slideUp:S("hide"),slideToggle:S("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(c,a){o.fn[c]=function(c,h,e){return this.animate(a,c,h,e)}});o.speed=function(c,a,h){var e=c&&"object"===typeof c?o.extend({},c):{complete:h||!h&&a||o.isFunction(c)&&c,duration:c,easing:h&&a||a&&!o.isFunction(a)&&a};e.duration=o.fx.off?0:"number"===typeof e.duration?e.duration:e.duration in o.fx.speeds?o.fx.speeds[e.duration]:
o.fx.speeds._default;if(null==e.queue||!0===e.queue)e.queue="fx";e.old=e.complete;e.complete=function(){o.isFunction(e.old)&&e.old.call(this);e.queue&&o.dequeue(this,e.queue)};return e};o.easing={linear:function(c){return c},swing:function(c){return 0.5-Math.cos(c*Math.PI)/2}};o.timers=[];o.fx=U.prototype.init;o.fx.tick=function(){var c,a=o.timers,h=0;for(Ka=o.now();h<a.length;h++)c=a[h],!c()&&a[h]===c&&a.splice(h--,1);a.length||o.fx.stop();Ka=m};o.fx.timer=function(c){c()&&o.timers.push(c)&&o.fx.start()};
o.fx.interval=13;o.fx.start=function(){lb||(lb=setInterval(o.fx.tick,o.fx.interval))};o.fx.stop=function(){clearInterval(lb);lb=null};o.fx.speeds={slow:600,fast:200,_default:400};o.fx.step={};o.expr&&o.expr.filters&&(o.expr.filters.animated=function(c){return o.grep(o.timers,function(a){return c===a.elem}).length});o.fn.offset=function(c){if(arguments.length)return c===m?this:this.each(function(a){o.offset.setOffset(this,c,a)});var a,h,e={top:0,left:0},d=(h=this[0])&&h.ownerDocument;if(d){a=d.documentElement;
if(!o.contains(a,h))return e;typeof h.getBoundingClientRect!==$&&(e=h.getBoundingClientRect());h=ja(d);return{top:e.top+(h.pageYOffset||a.scrollTop)-(a.clientTop||0),left:e.left+(h.pageXOffset||a.scrollLeft)-(a.clientLeft||0)}}};o.offset={setOffset:function(c,a,h){var e=o.css(c,"position");"static"===e&&(c.style.position="relative");var d=o(c),f=d.offset(),b=o.css(c,"top"),k=o.css(c,"left"),g={},n={};("absolute"===e||"fixed"===e)&&-1<o.inArray("auto",[b,k])?(n=d.position(),e=n.top,k=n.left):(e=parseFloat(b)||
0,k=parseFloat(k)||0);o.isFunction(a)&&(a=a.call(c,h,f));null!=a.top&&(g.top=a.top-f.top+e);null!=a.left&&(g.left=a.left-f.left+k);"using"in a?a.using.call(c,g):d.css(g)}};o.fn.extend({position:function(){if(this[0]){var c,a,h={top:0,left:0},e=this[0];"fixed"===o.css(e,"position")?a=e.getBoundingClientRect():(c=this.offsetParent(),a=this.offset(),o.nodeName(c[0],"html")||(h=c.offset()),h.top+=o.css(c[0],"borderTopWidth",!0),h.left+=o.css(c[0],"borderLeftWidth",!0));return{top:a.top-h.top-o.css(e,
"marginTop",!0),left:a.left-h.left-o.css(e,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){for(var c=this.offsetParent||ba;c&&!o.nodeName(c,"html")&&"static"===o.css(c,"position");)c=c.offsetParent;return c||ba})}});o.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(c,a){var h=/Y/.test(a);o.fn[c]=function(e){return o.access(this,function(c,e,d){var f=ja(c);if(d===m)return f?a in f?f[a]:f.document.documentElement[e]:c[e];f?f.scrollTo(!h?d:o(f).scrollLeft(),h?
d:o(f).scrollTop()):c[e]=d},c,e,arguments.length,null)}});o.each({Height:"height",Width:"width"},function(c,a){o.each({padding:"inner"+c,content:a,"":"outer"+c},function(h,e){o.fn[e]=function(e,d){var f=arguments.length&&(h||"boolean"!==typeof e),b=h||(!0===e||!0===d?"margin":"border");return o.access(this,function(a,h,e){return o.isWindow(a)?a.document.documentElement["client"+c]:9===a.nodeType?(h=a.documentElement,Math.max(a.body["scroll"+c],h["scroll"+c],a.body["offset"+c],h["offset"+c],h["client"+
c])):e===m?o.css(a,h,b):o.style(a,h,e,b)},a,f?e:m,f,null)}})});o.fn.size=function(){return this.length};o.fn.andSelf=o.fn.addBack;j.jQuery=o})(window,ChemDoodle.lib);
(function(b){"function"===typeof define&&define.amd?define(["jquery"],b):"object"===typeof exports?module.exports=b:b(ChemDoodle.lib.jQuery)})(function(b){function j(k){var g=k||window.event,t=d.call(arguments,1),j=0,l=0,u=0,r=0;k=b.event.fix(g);k.type="mousewheel";"detail"in g&&(u=-1*g.detail);"wheelDelta"in g&&(u=g.wheelDelta);"wheelDeltaY"in g&&(u=g.wheelDeltaY);"wheelDeltaX"in g&&(l=-1*g.wheelDeltaX);"axis"in g&&g.axis===g.HORIZONTAL_AXIS&&(l=-1*u,u=0);j=0===u?l:u;"deltaY"in g&&(j=u=-1*g.deltaY);
"deltaX"in g&&(l=g.deltaX,0===u&&(j=-1*l));if(!(0===u&&0===l)){1===g.deltaMode?(g=b.data(this,"mousewheel-line-height"),j*=g,u*=g,l*=g):2===g.deltaMode&&(g=b.data(this,"mousewheel-page-height"),j*=g,u*=g,l*=g);r=Math.max(Math.abs(u),Math.abs(l));if(!e||r<e)e=r,120===e&&(f=!0,e/=40);f&&(j/=40,l/=40,u/=40);j=Math[1<=j?"floor":"ceil"](j/e);l=Math[1<=l?"floor":"ceil"](l/e);u=Math[1<=u?"floor":"ceil"](u/e);k.deltaX=l;k.deltaY=u;k.deltaFactor=e;k.deltaMode=0;t.unshift(k,j,l,u);a&&clearTimeout(a);a=setTimeout(m,
200);return(b.event.dispatch||b.event.handle).apply(this,t)}}function m(){f=e=null}var l=["wheel","mousewheel","DOMMouseScroll","MozMousePixelScroll"],g="onwheel"in document||9<=document.documentMode?["wheel"]:["mousewheel","DomMouseScroll","MozMousePixelScroll"],d=Array.prototype.slice,f,a,e;if(b.event.fixHooks)for(var t=l.length;t;)b.event.fixHooks[l[--t]]=b.event.mouseHooks;var k=b.event.special.mousewheel={version:"3.1.8",setup:function(){if(this.addEventListener)for(var a=g.length;a;)this.addEventListener(g[--a],
j,!1);else this.onmousewheel=j;b.data(this,"mousewheel-line-height",k.getLineHeight(this));b.data(this,"mousewheel-page-height",k.getPageHeight(this))},teardown:function(){if(this.removeEventListener)for(var a=g.length;a;)this.removeEventListener(g[--a],j,!1);else this.onmousewheel=null},getLineHeight:function(a){return parseInt(b(a)["offsetParent"in b.fn?"offsetParent":"parent"]().css("fontSize"),10)},getPageHeight:function(a){return b(a).height()}};b.fn.extend({mousewheel:function(a){return a?this.bind("mousewheel",
a):this.trigger("mousewheel")},unmousewheel:function(a){return this.unbind("mousewheel",a)}})});
(function(b,j){"object"===typeof exports?module.exports=j(global):"function"===typeof define&&define.amd?define([],function(){return j(b)}):j(b)})(ChemDoodle.lib,function(b){function j(c){return f=c}function m(){return f="undefined"!==typeof Float32Array?Float32Array:Array}var l={};if("undefined"!=typeof Float32Array){var g=new Float32Array(1),d=new Int32Array(g.buffer);l.invsqrt=function(c){g[0]=c;d[0]=1597463007-(d[0]>>1);var a=g[0];return a*(1.5-0.5*c*a*a)}}else l.invsqrt=function(c){return 1/
Math.sqrt(c)};var f=null;m();var a={create:function(c){var a=new f(3);c?(a[0]=c[0],a[1]=c[1],a[2]=c[2]):a[0]=a[1]=a[2]=0;return a},createFrom:function(c,a,e){var d=new f(3);d[0]=c;d[1]=a;d[2]=e;return d},set:function(c,a){a[0]=c[0];a[1]=c[1];a[2]=c[2];return a},equal:function(c,a){return c===a||1E-6>Math.abs(c[0]-a[0])&&1E-6>Math.abs(c[1]-a[1])&&1E-6>Math.abs(c[2]-a[2])},add:function(c,a,e){if(!e||c===e)return c[0]+=a[0],c[1]+=a[1],c[2]+=a[2],c;e[0]=c[0]+a[0];e[1]=c[1]+a[1];e[2]=c[2]+a[2];return e},
subtract:function(c,a,e){if(!e||c===e)return c[0]-=a[0],c[1]-=a[1],c[2]-=a[2],c;e[0]=c[0]-a[0];e[1]=c[1]-a[1];e[2]=c[2]-a[2];return e},multiply:function(c,a,e){if(!e||c===e)return c[0]*=a[0],c[1]*=a[1],c[2]*=a[2],c;e[0]=c[0]*a[0];e[1]=c[1]*a[1];e[2]=c[2]*a[2];return e},negate:function(c,a){a||(a=c);a[0]=-c[0];a[1]=-c[1];a[2]=-c[2];return a},scale:function(c,a,e){if(!e||c===e)return c[0]*=a,c[1]*=a,c[2]*=a,c;e[0]=c[0]*a;e[1]=c[1]*a;e[2]=c[2]*a;return e},normalize:function(c,a){a||(a=c);var e=c[0],
d=c[1],f=c[2],b=Math.sqrt(e*e+d*d+f*f);if(b){if(1===b)return a[0]=e,a[1]=d,a[2]=f,a}else return a[0]=0,a[1]=0,a[2]=0,a;b=1/b;a[0]=e*b;a[1]=d*b;a[2]=f*b;return a},cross:function(c,a,e){e||(e=c);var d=c[0],f=c[1];c=c[2];var b=a[0],k=a[1];a=a[2];e[0]=f*a-c*k;e[1]=c*b-d*a;e[2]=d*k-f*b;return e},length:function(c){var a=c[0],e=c[1];c=c[2];return Math.sqrt(a*a+e*e+c*c)},squaredLength:function(c){var a=c[0],e=c[1];c=c[2];return a*a+e*e+c*c},dot:function(c,a){return c[0]*a[0]+c[1]*a[1]+c[2]*a[2]},direction:function(c,
a,e){e||(e=c);var d=c[0]-a[0],f=c[1]-a[1];c=c[2]-a[2];a=Math.sqrt(d*d+f*f+c*c);if(!a)return e[0]=0,e[1]=0,e[2]=0,e;a=1/a;e[0]=d*a;e[1]=f*a;e[2]=c*a;return e},lerp:function(c,a,e,d){d||(d=c);d[0]=c[0]+e*(a[0]-c[0]);d[1]=c[1]+e*(a[1]-c[1]);d[2]=c[2]+e*(a[2]-c[2]);return d},dist:function(c,a){var e=a[0]-c[0],d=a[1]-c[1],f=a[2]-c[2];return Math.sqrt(e*e+d*d+f*f)}},e=null,t=new f(4);a.unproject=function(c,a,d,f,b){b||(b=c);e||(e=p.create());var k=e;t[0]=2*(c[0]-f[0])/f[2]-1;t[1]=2*(c[1]-f[1])/f[3]-1;t[2]=
2*c[2]-1;t[3]=1;p.multiply(d,a,k);if(!p.inverse(k))return null;p.multiplyVec4(k,t);if(0===t[3])return null;b[0]=t[0]/t[3];b[1]=t[1]/t[3];b[2]=t[2]/t[3];return b};var k=a.createFrom(1,0,0),q=a.createFrom(0,1,0),n=a.createFrom(0,0,1),y=a.create();a.rotationTo=function(c,h,e){e||(e=u.create());var d=a.dot(c,h);if(1<=d)u.set(r,e);else if(-0.999999>d)a.cross(k,c,y),1E-6>a.length(y)&&a.cross(q,c,y),1E-6>a.length(y)&&a.cross(n,c,y),a.normalize(y),u.fromAngleAxis(Math.PI,y,e);else{var d=Math.sqrt(2*(1+d)),
f=1/d;a.cross(c,h,y);e[0]=y[0]*f;e[1]=y[1]*f;e[2]=y[2]*f;e[3]=0.5*d;u.normalize(e)}1<e[3]?e[3]=1:-1>e[3]&&(e[3]=-1);return e};a.str=function(c){return"["+c[0]+", "+c[1]+", "+c[2]+"]"};var z={create:function(c){var a=new f(9);c?(a[0]=c[0],a[1]=c[1],a[2]=c[2],a[3]=c[3],a[4]=c[4],a[5]=c[5],a[6]=c[6],a[7]=c[7],a[8]=c[8]):a[0]=a[1]=a[2]=a[3]=a[4]=a[5]=a[6]=a[7]=a[8]=0;return a},createFrom:function(c,a,e,d,b,k,g,n,t){var q=new f(9);q[0]=c;q[1]=a;q[2]=e;q[3]=d;q[4]=b;q[5]=k;q[6]=g;q[7]=n;q[8]=t;return q},
determinant:function(c){var a=c[3],e=c[4],d=c[5],f=c[6],b=c[7],k=c[8];return c[0]*(k*e-d*b)+c[1]*(-k*a+d*f)+c[2]*(b*a-e*f)},inverse:function(c,a){var e=c[0],d=c[1],f=c[2],b=c[3],k=c[4],g=c[5],n=c[6],t=c[7],q=c[8],j=q*k-g*t,l=-q*b+g*n,y=t*b-k*n,m=e*j+d*l+f*y;if(!m)return null;m=1/m;a||(a=z.create());a[0]=j*m;a[1]=(-q*d+f*t)*m;a[2]=(g*d-f*k)*m;a[3]=l*m;a[4]=(q*e-f*n)*m;a[5]=(-g*e+f*b)*m;a[6]=y*m;a[7]=(-t*e+d*n)*m;a[8]=(k*e-d*b)*m;return a},multiply:function(c,a,e){e||(e=c);var d=c[0],f=c[1],b=c[2],
k=c[3],g=c[4],n=c[5],t=c[6],q=c[7];c=c[8];var j=a[0],l=a[1],y=a[2],m=a[3],u=a[4],p=a[5],r=a[6],z=a[7];a=a[8];e[0]=j*d+l*k+y*t;e[1]=j*f+l*g+y*q;e[2]=j*b+l*n+y*c;e[3]=m*d+u*k+p*t;e[4]=m*f+u*g+p*q;e[5]=m*b+u*n+p*c;e[6]=r*d+z*k+a*t;e[7]=r*f+z*g+a*q;e[8]=r*b+z*n+a*c;return e},multiplyVec2:function(c,a,e){e||(e=a);var d=a[0];a=a[1];e[0]=d*c[0]+a*c[3]+c[6];e[1]=d*c[1]+a*c[4]+c[7];return e},multiplyVec3:function(c,a,e){e||(e=a);var d=a[0],f=a[1];a=a[2];e[0]=d*c[0]+f*c[3]+a*c[6];e[1]=d*c[1]+f*c[4]+a*c[7];
e[2]=d*c[2]+f*c[5]+a*c[8];return e},set:function(c,a){a[0]=c[0];a[1]=c[1];a[2]=c[2];a[3]=c[3];a[4]=c[4];a[5]=c[5];a[6]=c[6];a[7]=c[7];a[8]=c[8];return a},equal:function(c,a){return c===a||1E-6>Math.abs(c[0]-a[0])&&1E-6>Math.abs(c[1]-a[1])&&1E-6>Math.abs(c[2]-a[2])&&1E-6>Math.abs(c[3]-a[3])&&1E-6>Math.abs(c[4]-a[4])&&1E-6>Math.abs(c[5]-a[5])&&1E-6>Math.abs(c[6]-a[6])&&1E-6>Math.abs(c[7]-a[7])&&1E-6>Math.abs(c[8]-a[8])},identity:function(c){c||(c=z.create());c[0]=1;c[1]=0;c[2]=0;c[3]=0;c[4]=1;c[5]=
0;c[6]=0;c[7]=0;c[8]=1;return c},transpose:function(c,a){if(!a||c===a){var e=c[1],d=c[2],f=c[5];c[1]=c[3];c[2]=c[6];c[3]=e;c[5]=c[7];c[6]=d;c[7]=f;return c}a[0]=c[0];a[1]=c[3];a[2]=c[6];a[3]=c[1];a[4]=c[4];a[5]=c[7];a[6]=c[2];a[7]=c[5];a[8]=c[8];return a},toMat4:function(c,a){a||(a=p.create());a[15]=1;a[14]=0;a[13]=0;a[12]=0;a[11]=0;a[10]=c[8];a[9]=c[7];a[8]=c[6];a[7]=0;a[6]=c[5];a[5]=c[4];a[4]=c[3];a[3]=0;a[2]=c[2];a[1]=c[1];a[0]=c[0];return a},str:function(c){return"["+c[0]+", "+c[1]+", "+c[2]+
", "+c[3]+", "+c[4]+", "+c[5]+", "+c[6]+", "+c[7]+", "+c[8]+"]"}},p={create:function(c){var a=new f(16);c&&(a[0]=c[0],a[1]=c[1],a[2]=c[2],a[3]=c[3],a[4]=c[4],a[5]=c[5],a[6]=c[6],a[7]=c[7],a[8]=c[8],a[9]=c[9],a[10]=c[10],a[11]=c[11],a[12]=c[12],a[13]=c[13],a[14]=c[14],a[15]=c[15]);return a},createFrom:function(c,a,e,d,b,k,g,n,t,q,j,l,y,m,u,p){var r=new f(16);r[0]=c;r[1]=a;r[2]=e;r[3]=d;r[4]=b;r[5]=k;r[6]=g;r[7]=n;r[8]=t;r[9]=q;r[10]=j;r[11]=l;r[12]=y;r[13]=m;r[14]=u;r[15]=p;return r},set:function(c,
a){a[0]=c[0];a[1]=c[1];a[2]=c[2];a[3]=c[3];a[4]=c[4];a[5]=c[5];a[6]=c[6];a[7]=c[7];a[8]=c[8];a[9]=c[9];a[10]=c[10];a[11]=c[11];a[12]=c[12];a[13]=c[13];a[14]=c[14];a[15]=c[15];return a},equal:function(c,a){return c===a||1E-6>Math.abs(c[0]-a[0])&&1E-6>Math.abs(c[1]-a[1])&&1E-6>Math.abs(c[2]-a[2])&&1E-6>Math.abs(c[3]-a[3])&&1E-6>Math.abs(c[4]-a[4])&&1E-6>Math.abs(c[5]-a[5])&&1E-6>Math.abs(c[6]-a[6])&&1E-6>Math.abs(c[7]-a[7])&&1E-6>Math.abs(c[8]-a[8])&&1E-6>Math.abs(c[9]-a[9])&&1E-6>Math.abs(c[10]-a[10])&&
1E-6>Math.abs(c[11]-a[11])&&1E-6>Math.abs(c[12]-a[12])&&1E-6>Math.abs(c[13]-a[13])&&1E-6>Math.abs(c[14]-a[14])&&1E-6>Math.abs(c[15]-a[15])},identity:function(c){c||(c=p.create());c[0]=1;c[1]=0;c[2]=0;c[3]=0;c[4]=0;c[5]=1;c[6]=0;c[7]=0;c[8]=0;c[9]=0;c[10]=1;c[11]=0;c[12]=0;c[13]=0;c[14]=0;c[15]=1;return c},transpose:function(c,a){if(!a||c===a){var e=c[1],d=c[2],f=c[3],b=c[6],k=c[7],g=c[11];c[1]=c[4];c[2]=c[8];c[3]=c[12];c[4]=e;c[6]=c[9];c[7]=c[13];c[8]=d;c[9]=b;c[11]=c[14];c[12]=f;c[13]=k;c[14]=g;
return c}a[0]=c[0];a[1]=c[4];a[2]=c[8];a[3]=c[12];a[4]=c[1];a[5]=c[5];a[6]=c[9];a[7]=c[13];a[8]=c[2];a[9]=c[6];a[10]=c[10];a[11]=c[14];a[12]=c[3];a[13]=c[7];a[14]=c[11];a[15]=c[15];return a},determinant:function(c){var a=c[0],e=c[1],d=c[2],f=c[3],b=c[4],k=c[5],g=c[6],n=c[7],t=c[8],q=c[9],j=c[10],l=c[11],y=c[12],m=c[13],u=c[14];c=c[15];return y*q*g*f-t*m*g*f-y*k*j*f+b*m*j*f+t*k*u*f-b*q*u*f-y*q*d*n+t*m*d*n+y*e*j*n-a*m*j*n-t*e*u*n+a*q*u*n+y*k*d*l-b*m*d*l-y*e*g*l+a*m*g*l+b*e*u*l-a*k*u*l-t*k*d*c+b*q*d*
c+t*e*g*c-a*q*g*c-b*e*j*c+a*k*j*c},inverse:function(c,a){a||(a=c);var e=c[0],d=c[1],f=c[2],b=c[3],k=c[4],g=c[5],n=c[6],t=c[7],q=c[8],j=c[9],l=c[10],y=c[11],m=c[12],u=c[13],p=c[14],r=c[15],z=e*g-d*k,v=e*n-f*k,w=e*t-b*k,A=d*n-f*g,B=d*t-b*g,ba=f*t-b*n,ea=q*u-j*m,fa=q*p-l*m,X=q*r-y*m,ha=j*p-l*u,sa=j*r-y*u,qa=l*r-y*p,R=z*qa-v*sa+w*ha+A*X-B*fa+ba*ea;if(!R)return null;R=1/R;a[0]=(g*qa-n*sa+t*ha)*R;a[1]=(-d*qa+f*sa-b*ha)*R;a[2]=(u*ba-p*B+r*A)*R;a[3]=(-j*ba+l*B-y*A)*R;a[4]=(-k*qa+n*X-t*fa)*R;a[5]=(e*qa-f*
X+b*fa)*R;a[6]=(-m*ba+p*w-r*v)*R;a[7]=(q*ba-l*w+y*v)*R;a[8]=(k*sa-g*X+t*ea)*R;a[9]=(-e*sa+d*X-b*ea)*R;a[10]=(m*B-u*w+r*z)*R;a[11]=(-q*B+j*w-y*z)*R;a[12]=(-k*ha+g*fa-n*ea)*R;a[13]=(e*ha-d*fa+f*ea)*R;a[14]=(-m*A+u*v-p*z)*R;a[15]=(q*A-j*v+l*z)*R;return a},toRotationMat:function(c,a){a||(a=p.create());a[0]=c[0];a[1]=c[1];a[2]=c[2];a[3]=c[3];a[4]=c[4];a[5]=c[5];a[6]=c[6];a[7]=c[7];a[8]=c[8];a[9]=c[9];a[10]=c[10];a[11]=c[11];a[12]=0;a[13]=0;a[14]=0;a[15]=1;return a},toMat3:function(c,a){a||(a=z.create());
a[0]=c[0];a[1]=c[1];a[2]=c[2];a[3]=c[4];a[4]=c[5];a[5]=c[6];a[6]=c[8];a[7]=c[9];a[8]=c[10];return a},toInverseMat3:function(c,a){var e=c[0],d=c[1],f=c[2],b=c[4],k=c[5],g=c[6],n=c[8],t=c[9],q=c[10],j=q*k-g*t,l=-q*b+g*n,y=t*b-k*n,m=e*j+d*l+f*y;if(!m)return null;m=1/m;a||(a=z.create());a[0]=j*m;a[1]=(-q*d+f*t)*m;a[2]=(g*d-f*k)*m;a[3]=l*m;a[4]=(q*e-f*n)*m;a[5]=(-g*e+f*b)*m;a[6]=y*m;a[7]=(-t*e+d*n)*m;a[8]=(k*e-d*b)*m;return a},multiply:function(c,a,e){e||(e=c);var d=c[0],f=c[1],b=c[2],k=c[3],g=c[4],n=
c[5],t=c[6],q=c[7],j=c[8],l=c[9],y=c[10],m=c[11],u=c[12],p=c[13],r=c[14];c=c[15];var z=a[0],v=a[1],w=a[2],A=a[3];e[0]=z*d+v*g+w*j+A*u;e[1]=z*f+v*n+w*l+A*p;e[2]=z*b+v*t+w*y+A*r;e[3]=z*k+v*q+w*m+A*c;z=a[4];v=a[5];w=a[6];A=a[7];e[4]=z*d+v*g+w*j+A*u;e[5]=z*f+v*n+w*l+A*p;e[6]=z*b+v*t+w*y+A*r;e[7]=z*k+v*q+w*m+A*c;z=a[8];v=a[9];w=a[10];A=a[11];e[8]=z*d+v*g+w*j+A*u;e[9]=z*f+v*n+w*l+A*p;e[10]=z*b+v*t+w*y+A*r;e[11]=z*k+v*q+w*m+A*c;z=a[12];v=a[13];w=a[14];A=a[15];e[12]=z*d+v*g+w*j+A*u;e[13]=z*f+v*n+w*l+A*p;
e[14]=z*b+v*t+w*y+A*r;e[15]=z*k+v*q+w*m+A*c;return e},multiplyVec3:function(c,a,e){e||(e=a);var d=a[0],f=a[1];a=a[2];e[0]=c[0]*d+c[4]*f+c[8]*a+c[12];e[1]=c[1]*d+c[5]*f+c[9]*a+c[13];e[2]=c[2]*d+c[6]*f+c[10]*a+c[14];return e},multiplyVec4:function(c,a,e){e||(e=a);var d=a[0],f=a[1],b=a[2];a=a[3];e[0]=c[0]*d+c[4]*f+c[8]*b+c[12]*a;e[1]=c[1]*d+c[5]*f+c[9]*b+c[13]*a;e[2]=c[2]*d+c[6]*f+c[10]*b+c[14]*a;e[3]=c[3]*d+c[7]*f+c[11]*b+c[15]*a;return e},translate:function(c,a,e){var d=a[0],f=a[1];a=a[2];var b,k,
g,n,t,q,j,l,y,m,u,p;if(!e||c===e)return c[12]=c[0]*d+c[4]*f+c[8]*a+c[12],c[13]=c[1]*d+c[5]*f+c[9]*a+c[13],c[14]=c[2]*d+c[6]*f+c[10]*a+c[14],c[15]=c[3]*d+c[7]*f+c[11]*a+c[15],c;b=c[0];k=c[1];g=c[2];n=c[3];t=c[4];q=c[5];j=c[6];l=c[7];y=c[8];m=c[9];u=c[10];p=c[11];e[0]=b;e[1]=k;e[2]=g;e[3]=n;e[4]=t;e[5]=q;e[6]=j;e[7]=l;e[8]=y;e[9]=m;e[10]=u;e[11]=p;e[12]=b*d+t*f+y*a+c[12];e[13]=k*d+q*f+m*a+c[13];e[14]=g*d+j*f+u*a+c[14];e[15]=n*d+l*f+p*a+c[15];return e},scale:function(c,a,e){var d=a[0],f=a[1];a=a[2];
if(!e||c===e)return c[0]*=d,c[1]*=d,c[2]*=d,c[3]*=d,c[4]*=f,c[5]*=f,c[6]*=f,c[7]*=f,c[8]*=a,c[9]*=a,c[10]*=a,c[11]*=a,c;e[0]=c[0]*d;e[1]=c[1]*d;e[2]=c[2]*d;e[3]=c[3]*d;e[4]=c[4]*f;e[5]=c[5]*f;e[6]=c[6]*f;e[7]=c[7]*f;e[8]=c[8]*a;e[9]=c[9]*a;e[10]=c[10]*a;e[11]=c[11]*a;e[12]=c[12];e[13]=c[13];e[14]=c[14];e[15]=c[15];return e},rotate:function(c,a,e,d){var f=e[0],b=e[1];e=e[2];var k=Math.sqrt(f*f+b*b+e*e),g,n,t,q,j,l,y,m,u,p,r,z,v,w,A,B,ba,ea,fa,X;if(!k)return null;1!==k&&(k=1/k,f*=k,b*=k,e*=k);g=Math.sin(a);
n=Math.cos(a);t=1-n;a=c[0];k=c[1];q=c[2];j=c[3];l=c[4];y=c[5];m=c[6];u=c[7];p=c[8];r=c[9];z=c[10];v=c[11];w=f*f*t+n;A=b*f*t+e*g;B=e*f*t-b*g;ba=f*b*t-e*g;ea=b*b*t+n;fa=e*b*t+f*g;X=f*e*t+b*g;f=b*e*t-f*g;b=e*e*t+n;d?c!==d&&(d[12]=c[12],d[13]=c[13],d[14]=c[14],d[15]=c[15]):d=c;d[0]=a*w+l*A+p*B;d[1]=k*w+y*A+r*B;d[2]=q*w+m*A+z*B;d[3]=j*w+u*A+v*B;d[4]=a*ba+l*ea+p*fa;d[5]=k*ba+y*ea+r*fa;d[6]=q*ba+m*ea+z*fa;d[7]=j*ba+u*ea+v*fa;d[8]=a*X+l*f+p*b;d[9]=k*X+y*f+r*b;d[10]=q*X+m*f+z*b;d[11]=j*X+u*f+v*b;return d},
rotateX:function(c,a,e){var d=Math.sin(a);a=Math.cos(a);var f=c[4],b=c[5],k=c[6],g=c[7],n=c[8],t=c[9],q=c[10],j=c[11];e?c!==e&&(e[0]=c[0],e[1]=c[1],e[2]=c[2],e[3]=c[3],e[12]=c[12],e[13]=c[13],e[14]=c[14],e[15]=c[15]):e=c;e[4]=f*a+n*d;e[5]=b*a+t*d;e[6]=k*a+q*d;e[7]=g*a+j*d;e[8]=f*-d+n*a;e[9]=b*-d+t*a;e[10]=k*-d+q*a;e[11]=g*-d+j*a;return e},rotateY:function(c,a,e){var d=Math.sin(a);a=Math.cos(a);var f=c[0],b=c[1],k=c[2],g=c[3],n=c[8],t=c[9],q=c[10],j=c[11];e?c!==e&&(e[4]=c[4],e[5]=c[5],e[6]=c[6],e[7]=
c[7],e[12]=c[12],e[13]=c[13],e[14]=c[14],e[15]=c[15]):e=c;e[0]=f*a+n*-d;e[1]=b*a+t*-d;e[2]=k*a+q*-d;e[3]=g*a+j*-d;e[8]=f*d+n*a;e[9]=b*d+t*a;e[10]=k*d+q*a;e[11]=g*d+j*a;return e},rotateZ:function(c,a,e){var d=Math.sin(a);a=Math.cos(a);var f=c[0],b=c[1],k=c[2],g=c[3],n=c[4],t=c[5],q=c[6],j=c[7];e?c!==e&&(e[8]=c[8],e[9]=c[9],e[10]=c[10],e[11]=c[11],e[12]=c[12],e[13]=c[13],e[14]=c[14],e[15]=c[15]):e=c;e[0]=f*a+n*d;e[1]=b*a+t*d;e[2]=k*a+q*d;e[3]=g*a+j*d;e[4]=f*-d+n*a;e[5]=b*-d+t*a;e[6]=k*-d+q*a;e[7]=g*
-d+j*a;return e},frustum:function(c,a,e,d,f,b,k){k||(k=p.create());var g=a-c,n=d-e,t=b-f;k[0]=2*f/g;k[1]=0;k[2]=0;k[3]=0;k[4]=0;k[5]=2*f/n;k[6]=0;k[7]=0;k[8]=(a+c)/g;k[9]=(d+e)/n;k[10]=-(b+f)/t;k[11]=-1;k[12]=0;k[13]=0;k[14]=-(2*b*f)/t;k[15]=0;return k},perspective:function(c,a,e,d,f){c=e*Math.tan(c*Math.PI/360);a*=c;return p.frustum(-a,a,-c,c,e,d,f)},ortho:function(c,a,e,d,f,b,k){k||(k=p.create());var g=a-c,n=d-e,t=b-f;k[0]=2/g;k[1]=0;k[2]=0;k[3]=0;k[4]=0;k[5]=2/n;k[6]=0;k[7]=0;k[8]=0;k[9]=0;k[10]=
-2/t;k[11]=0;k[12]=-(c+a)/g;k[13]=-(d+e)/n;k[14]=-(b+f)/t;k[15]=1;return k},lookAt:function(c,a,e,d){d||(d=p.create());var f,b,k,g,n,t,q,j,l=c[0],y=c[1];c=c[2];k=e[0];g=e[1];b=e[2];q=a[0];e=a[1];f=a[2];if(l===q&&y===e&&c===f)return p.identity(d);a=l-q;e=y-e;q=c-f;j=1/Math.sqrt(a*a+e*e+q*q);a*=j;e*=j;q*=j;f=g*q-b*e;b=b*a-k*q;k=k*e-g*a;(j=Math.sqrt(f*f+b*b+k*k))?(j=1/j,f*=j,b*=j,k*=j):k=b=f=0;g=e*k-q*b;n=q*f-a*k;t=a*b-e*f;(j=Math.sqrt(g*g+n*n+t*t))?(j=1/j,g*=j,n*=j,t*=j):t=n=g=0;d[0]=f;d[1]=g;d[2]=
a;d[3]=0;d[4]=b;d[5]=n;d[6]=e;d[7]=0;d[8]=k;d[9]=t;d[10]=q;d[11]=0;d[12]=-(f*l+b*y+k*c);d[13]=-(g*l+n*y+t*c);d[14]=-(a*l+e*y+q*c);d[15]=1;return d},fromRotationTranslation:function(c,a,e){e||(e=p.create());var d=c[0],f=c[1],b=c[2],k=c[3],g=d+d,n=f+f,t=b+b;c=d*g;var q=d*n,d=d*t,j=f*n,f=f*t,b=b*t,g=k*g,n=k*n,k=k*t;e[0]=1-(j+b);e[1]=q+k;e[2]=d-n;e[3]=0;e[4]=q-k;e[5]=1-(c+b);e[6]=f+g;e[7]=0;e[8]=d+n;e[9]=f-g;e[10]=1-(c+j);e[11]=0;e[12]=a[0];e[13]=a[1];e[14]=a[2];e[15]=1;return e},str:function(c){return"["+
c[0]+", "+c[1]+", "+c[2]+", "+c[3]+", "+c[4]+", "+c[5]+", "+c[6]+", "+c[7]+", "+c[8]+", "+c[9]+", "+c[10]+", "+c[11]+", "+c[12]+", "+c[13]+", "+c[14]+", "+c[15]+"]"}},u={create:function(c){var a=new f(4);c?(a[0]=c[0],a[1]=c[1],a[2]=c[2],a[3]=c[3]):a[0]=a[1]=a[2]=a[3]=0;return a},createFrom:function(c,a,e,d){var b=new f(4);b[0]=c;b[1]=a;b[2]=e;b[3]=d;return b},set:function(c,a){a[0]=c[0];a[1]=c[1];a[2]=c[2];a[3]=c[3];return a},equal:function(c,a){return c===a||1E-6>Math.abs(c[0]-a[0])&&1E-6>Math.abs(c[1]-
a[1])&&1E-6>Math.abs(c[2]-a[2])&&1E-6>Math.abs(c[3]-a[3])},identity:function(c){c||(c=u.create());c[0]=0;c[1]=0;c[2]=0;c[3]=1;return c}},r=u.identity();u.calculateW=function(c,a){var e=c[0],d=c[1],f=c[2];if(!a||c===a)return c[3]=-Math.sqrt(Math.abs(1-e*e-d*d-f*f)),c;a[0]=e;a[1]=d;a[2]=f;a[3]=-Math.sqrt(Math.abs(1-e*e-d*d-f*f));return a};u.dot=function(c,a){return c[0]*a[0]+c[1]*a[1]+c[2]*a[2]+c[3]*a[3]};u.inverse=function(c,a){var e=c[0],d=c[1],f=c[2],b=c[3],e=(e=e*e+d*d+f*f+b*b)?1/e:0;if(!a||c===
a)return c[0]*=-e,c[1]*=-e,c[2]*=-e,c[3]*=e,c;a[0]=-c[0]*e;a[1]=-c[1]*e;a[2]=-c[2]*e;a[3]=c[3]*e;return a};u.conjugate=function(c,a){if(!a||c===a)return c[0]*=-1,c[1]*=-1,c[2]*=-1,c;a[0]=-c[0];a[1]=-c[1];a[2]=-c[2];a[3]=c[3];return a};u.length=function(c){var a=c[0],e=c[1],d=c[2];c=c[3];return Math.sqrt(a*a+e*e+d*d+c*c)};u.normalize=function(c,a){a||(a=c);var e=c[0],d=c[1],f=c[2],b=c[3],k=Math.sqrt(e*e+d*d+f*f+b*b);if(0===k)return a[0]=0,a[1]=0,a[2]=0,a[3]=0,a;k=1/k;a[0]=e*k;a[1]=d*k;a[2]=f*k;a[3]=
b*k;return a};u.add=function(c,a,e){if(!e||c===e)return c[0]+=a[0],c[1]+=a[1],c[2]+=a[2],c[3]+=a[3],c;e[0]=c[0]+a[0];e[1]=c[1]+a[1];e[2]=c[2]+a[2];e[3]=c[3]+a[3];return e};u.multiply=function(c,a,e){e||(e=c);var d=c[0],f=c[1],b=c[2];c=c[3];var k=a[0],g=a[1],n=a[2];a=a[3];e[0]=d*a+c*k+f*n-b*g;e[1]=f*a+c*g+b*k-d*n;e[2]=b*a+c*n+d*g-f*k;e[3]=c*a-d*k-f*g-b*n;return e};u.multiplyVec3=function(c,a,e){e||(e=a);var d=a[0],f=a[1],b=a[2];a=c[0];var k=c[1],g=c[2];c=c[3];var n=c*d+k*b-g*f,t=c*f+g*d-a*b,q=c*b+
a*f-k*d,d=-a*d-k*f-g*b;e[0]=n*c+d*-a+t*-g-q*-k;e[1]=t*c+d*-k+q*-a-n*-g;e[2]=q*c+d*-g+n*-k-t*-a;return e};u.scale=function(c,a,e){if(!e||c===e)return c[0]*=a,c[1]*=a,c[2]*=a,c[3]*=a,c;e[0]=c[0]*a;e[1]=c[1]*a;e[2]=c[2]*a;e[3]=c[3]*a;return e};u.toMat3=function(a,e){e||(e=z.create());var d=a[0],f=a[1],b=a[2],k=a[3],g=d+d,n=f+f,t=b+b,q=d*g,j=d*n,d=d*t,l=f*n,f=f*t,b=b*t,g=k*g,n=k*n,k=k*t;e[0]=1-(l+b);e[1]=j+k;e[2]=d-n;e[3]=j-k;e[4]=1-(q+b);e[5]=f+g;e[6]=d+n;e[7]=f-g;e[8]=1-(q+l);return e};u.toMat4=function(a,
e){e||(e=p.create());var d=a[0],f=a[1],b=a[2],k=a[3],g=d+d,n=f+f,t=b+b,q=d*g,j=d*n,d=d*t,l=f*n,f=f*t,b=b*t,g=k*g,n=k*n,k=k*t;e[0]=1-(l+b);e[1]=j+k;e[2]=d-n;e[3]=0;e[4]=j-k;e[5]=1-(q+b);e[6]=f+g;e[7]=0;e[8]=d+n;e[9]=f-g;e[10]=1-(q+l);e[11]=0;e[12]=0;e[13]=0;e[14]=0;e[15]=1;return e};u.slerp=function(a,e,d,f){f||(f=a);var b=a[0]*e[0]+a[1]*e[1]+a[2]*e[2]+a[3]*e[3],k,g;if(1<=Math.abs(b))return f!==a&&(f[0]=a[0],f[1]=a[1],f[2]=a[2],f[3]=a[3]),f;k=Math.acos(b);g=Math.sqrt(1-b*b);if(0.001>Math.abs(g))return f[0]=
0.5*a[0]+0.5*e[0],f[1]=0.5*a[1]+0.5*e[1],f[2]=0.5*a[2]+0.5*e[2],f[3]=0.5*a[3]+0.5*e[3],f;b=Math.sin((1-d)*k)/g;d=Math.sin(d*k)/g;f[0]=a[0]*b+e[0]*d;f[1]=a[1]*b+e[1]*d;f[2]=a[2]*b+e[2]*d;f[3]=a[3]*b+e[3]*d;return f};u.fromRotationMatrix=function(a,e){e||(e=u.create());var d=a[0]+a[4]+a[8],f;if(0<d)f=Math.sqrt(d+1),e[3]=0.5*f,f=0.5/f,e[0]=(a[7]-a[5])*f,e[1]=(a[2]-a[6])*f,e[2]=(a[3]-a[1])*f;else{f=u.fromRotationMatrix.s_iNext=u.fromRotationMatrix.s_iNext||[1,2,0];d=0;a[4]>a[0]&&(d=1);a[8]>a[3*d+d]&&
(d=2);var b=f[d],k=f[b];f=Math.sqrt(a[3*d+d]-a[3*b+b]-a[3*k+k]+1);e[d]=0.5*f;f=0.5/f;e[3]=(a[3*k+b]-a[3*b+k])*f;e[b]=(a[3*b+d]+a[3*d+b])*f;e[k]=(a[3*k+d]+a[3*d+k])*f}return e};z.toQuat4=u.fromRotationMatrix;var v=z.create();u.fromAxes=function(a,e,d,f){v[0]=e[0];v[3]=e[1];v[6]=e[2];v[1]=d[0];v[4]=d[1];v[7]=d[2];v[2]=a[0];v[5]=a[1];v[8]=a[2];return u.fromRotationMatrix(v,f)};u.identity=function(a){a||(a=u.create());a[0]=0;a[1]=0;a[2]=0;a[3]=1;return a};u.fromAngleAxis=function(a,e,d){d||(d=u.create());
a*=0.5;var f=Math.sin(a);d[3]=Math.cos(a);d[0]=f*e[0];d[1]=f*e[1];d[2]=f*e[2];return d};u.toAngleAxis=function(a,e){e||(e=a);var d=a[0]*a[0]+a[1]*a[1]+a[2]*a[2];0<d?(e[3]=2*Math.acos(a[3]),d=l.invsqrt(d),e[0]=a[0]*d,e[1]=a[1]*d,e[2]=a[2]*d):(e[3]=0,e[0]=1,e[1]=0,e[2]=0);return e};u.str=function(a){return"["+a[0]+", "+a[1]+", "+a[2]+", "+a[3]+"]"};var w={create:function(a){var e=new f(2);a?(e[0]=a[0],e[1]=a[1]):(e[0]=0,e[1]=0);return e},createFrom:function(a,e){var d=new f(2);d[0]=a;d[1]=e;return d},
add:function(a,e,d){d||(d=e);d[0]=a[0]+e[0];d[1]=a[1]+e[1];return d},subtract:function(a,e,d){d||(d=e);d[0]=a[0]-e[0];d[1]=a[1]-e[1];return d},multiply:function(a,e,d){d||(d=e);d[0]=a[0]*e[0];d[1]=a[1]*e[1];return d},divide:function(a,e,d){d||(d=e);d[0]=a[0]/e[0];d[1]=a[1]/e[1];return d},scale:function(a,e,d){d||(d=a);d[0]=a[0]*e;d[1]=a[1]*e;return d},dist:function(a,e){var d=e[0]-a[0],f=e[1]-a[1];return Math.sqrt(d*d+f*f)},set:function(a,e){e[0]=a[0];e[1]=a[1];return e},equal:function(a,e){return a===
e||1E-6>Math.abs(a[0]-e[0])&&1E-6>Math.abs(a[1]-e[1])},negate:function(a,e){e||(e=a);e[0]=-a[0];e[1]=-a[1];return e},normalize:function(a,e){e||(e=a);var d=a[0]*a[0]+a[1]*a[1];0<d?(d=Math.sqrt(d),e[0]=a[0]/d,e[1]=a[1]/d):e[0]=e[1]=0;return e},cross:function(a,e,d){a=a[0]*e[1]-a[1]*e[0];if(!d)return a;d[0]=d[1]=0;d[2]=a;return d},length:function(a){var e=a[0];a=a[1];return Math.sqrt(e*e+a*a)},squaredLength:function(a){var e=a[0];a=a[1];return e*e+a*a},dot:function(a,e){return a[0]*e[0]+a[1]*e[1]},
direction:function(a,e,d){d||(d=a);var f=a[0]-e[0];a=a[1]-e[1];e=f*f+a*a;if(!e)return d[0]=0,d[1]=0,d[2]=0,d;e=1/Math.sqrt(e);d[0]=f*e;d[1]=a*e;return d},lerp:function(a,e,d,f){f||(f=a);f[0]=a[0]+d*(e[0]-a[0]);f[1]=a[1]+d*(e[1]-a[1]);return f},str:function(a){return"["+a[0]+", "+a[1]+"]"}},A={create:function(a){var e=new f(4);a?(e[0]=a[0],e[1]=a[1],e[2]=a[2],e[3]=a[3]):e[0]=e[1]=e[2]=e[3]=0;return e},createFrom:function(a,e,d,b){var k=new f(4);k[0]=a;k[1]=e;k[2]=d;k[3]=b;return k},set:function(a,
e){e[0]=a[0];e[1]=a[1];e[2]=a[2];e[3]=a[3];return e},equal:function(a,e){return a===e||1E-6>Math.abs(a[0]-e[0])&&1E-6>Math.abs(a[1]-e[1])&&1E-6>Math.abs(a[2]-e[2])&&1E-6>Math.abs(a[3]-e[3])},identity:function(a){a||(a=A.create());a[0]=1;a[1]=0;a[2]=0;a[3]=1;return a},transpose:function(a,e){if(!e||a===e){var d=a[1];a[1]=a[2];a[2]=d;return a}e[0]=a[0];e[1]=a[2];e[2]=a[1];e[3]=a[3];return e},determinant:function(a){return a[0]*a[3]-a[2]*a[1]},inverse:function(a,e){e||(e=a);var d=a[0],f=a[1],b=a[2],
k=a[3],g=d*k-b*f;if(!g)return null;g=1/g;e[0]=k*g;e[1]=-f*g;e[2]=-b*g;e[3]=d*g;return e},multiply:function(a,e,d){d||(d=a);var f=a[0],b=a[1],k=a[2];a=a[3];d[0]=f*e[0]+b*e[2];d[1]=f*e[1]+b*e[3];d[2]=k*e[0]+a*e[2];d[3]=k*e[1]+a*e[3];return d},rotate:function(a,e,d){d||(d=a);var f=a[0],b=a[1],k=a[2];a=a[3];var g=Math.sin(e);e=Math.cos(e);d[0]=f*e+b*g;d[1]=f*-g+b*e;d[2]=k*e+a*g;d[3]=k*-g+a*e;return d},multiplyVec2:function(a,e,d){d||(d=e);var f=e[0];e=e[1];d[0]=f*a[0]+e*a[1];d[1]=f*a[2]+e*a[3];return d},
scale:function(a,e,d){d||(d=a);var f=a[1],b=a[2],k=a[3],g=e[0];e=e[1];d[0]=a[0]*g;d[1]=f*e;d[2]=b*g;d[3]=k*e;return d},str:function(a){return"["+a[0]+", "+a[1]+", "+a[2]+", "+a[3]+"]"}},B={create:function(a){var e=new f(4);a?(e[0]=a[0],e[1]=a[1],e[2]=a[2],e[3]=a[3]):(e[0]=0,e[1]=0,e[2]=0,e[3]=0);return e},createFrom:function(a,e,d,b){var k=new f(4);k[0]=a;k[1]=e;k[2]=d;k[3]=b;return k},add:function(a,e,d){d||(d=e);d[0]=a[0]+e[0];d[1]=a[1]+e[1];d[2]=a[2]+e[2];d[3]=a[3]+e[3];return d},subtract:function(a,
e,d){d||(d=e);d[0]=a[0]-e[0];d[1]=a[1]-e[1];d[2]=a[2]-e[2];d[3]=a[3]-e[3];return d},multiply:function(a,e,d){d||(d=e);d[0]=a[0]*e[0];d[1]=a[1]*e[1];d[2]=a[2]*e[2];d[3]=a[3]*e[3];return d},divide:function(a,e,d){d||(d=e);d[0]=a[0]/e[0];d[1]=a[1]/e[1];d[2]=a[2]/e[2];d[3]=a[3]/e[3];return d},scale:function(a,e,d){d||(d=a);d[0]=a[0]*e;d[1]=a[1]*e;d[2]=a[2]*e;d[3]=a[3]*e;return d},set:function(a,e){e[0]=a[0];e[1]=a[1];e[2]=a[2];e[3]=a[3];return e},equal:function(a,e){return a===e||1E-6>Math.abs(a[0]-e[0])&&
1E-6>Math.abs(a[1]-e[1])&&1E-6>Math.abs(a[2]-e[2])&&1E-6>Math.abs(a[3]-e[3])},negate:function(a,e){e||(e=a);e[0]=-a[0];e[1]=-a[1];e[2]=-a[2];e[3]=-a[3];return e},length:function(a){var e=a[0],d=a[1],f=a[2];a=a[3];return Math.sqrt(e*e+d*d+f*f+a*a)},squaredLength:function(a){var e=a[0],d=a[1],f=a[2];a=a[3];return e*e+d*d+f*f+a*a},lerp:function(a,e,d,f){f||(f=a);f[0]=a[0]+d*(e[0]-a[0]);f[1]=a[1]+d*(e[1]-a[1]);f[2]=a[2]+d*(e[2]-a[2]);f[3]=a[3]+d*(e[3]-a[3]);return f},str:function(a){return"["+a[0]+", "+
a[1]+", "+a[2]+", "+a[3]+"]"}};b&&(b.glMatrixArrayType=f,b.MatrixArray=f,b.setMatrixArrayType=j,b.determineMatrixArrayType=m,b.glMath=l,b.vec2=w,b.vec3=a,b.vec4=B,b.mat2=A,b.mat3=z,b.mat4=p,b.quat4=u);return{glMatrixArrayType:f,MatrixArray:f,setMatrixArrayType:j,determineMatrixArrayType:m,glMath:l,vec2:w,vec3:a,vec4:B,mat2:A,mat3:z,mat4:p,quat4:u}});
ChemDoodle.animations=function(b){var j={};b.requestAnimFrame=b.requestAnimationFrame||b.webkitRequestAnimationFrame||b.mozRequestAnimationFrame||b.oRequestAnimationFrame||b.msRequestAnimationFrame||function(j){b.setTimeout(j,1E3/60)};j.requestInterval=function(j,l){function g(){(new Date).getTime()-d>=l&&(j.call(),d=(new Date).getTime());f.value=b.requestAnimFrame(g)}if(!b.requestAnimationFrame&&!b.webkitRequestAnimationFrame&&(!b.mozRequestAnimationFrame||!b.mozCancelRequestAnimationFrame)&&!b.oRequestAnimationFrame&&
!b.msRequestAnimationFrame)return b.setInterval(j,l);var d=(new Date).getTime(),f={};f.value=b.requestAnimFrame(g);return f};j.clearRequestInterval=function(j){b.cancelAnimationFrame?b.cancelAnimationFrame(j.value):b.webkitCancelAnimationFrame?b.webkitCancelAnimationFrame(j.value):b.webkitCancelRequestAnimationFrame?b.webkitCancelRequestAnimationFrame(j.value):b.mozCancelRequestAnimationFrame?b.mozCancelRequestAnimationFrame(j.value):b.oCancelRequestAnimationFrame?b.oCancelRequestAnimationFrame(j.value):
b.msCancelRequestAnimationFrame?b.msCancelRequestAnimationFrame(j.value):clearInterval(j)};j.requestTimeout=function(j,l){function g(){(new Date).getTime()-d>=l?j.call():f.value=b.requestAnimFrame(g)}if(!b.requestAnimationFrame&&!b.webkitRequestAnimationFrame&&(!b.mozRequestAnimationFrame||!b.mozCancelRequestAnimationFrame)&&!b.oRequestAnimationFrame&&!b.msRequestAnimationFrame)return b.setTimeout(j,l);var d=(new Date).getTime(),f={};f.value=b.requestAnimFrame(g);return f};j.clearRequestTimeout=function(j){b.cancelAnimationFrame?
b.cancelAnimationFrame(j.value):b.webkitCancelAnimationFrame?b.webkitCancelAnimationFrame(j.value):b.webkitCancelRequestAnimationFrame?b.webkitCancelRequestAnimationFrame(j.value):b.mozCancelRequestAnimationFrame?b.mozCancelRequestAnimationFrame(j.value):b.oCancelRequestAnimationFrame?b.oCancelRequestAnimationFrame(j.value):b.msCancelRequestAnimationFrame?b.msCancelRequestAnimationFrame(j.value):clearTimeout(j)};return j}(window);
ChemDoodle.extensions=function(b,j,m){return{stringStartsWith:function(b,g){return b.slice(0,g.length)===g},vec3AngleFrom:function(b,g){var d=j.length(b),f=j.length(g),d=j.dot(b,g)/d/f;return m.acos(d)},contextHashTo:function(j,g,d,f,a,e,t){var k=0,q=(new b.Point(g,d)).distance(new b.Point(f,a)),n=!1,y=g,m=d;g=f-g;for(d=a-d;k<q;){if(n)if(k+t>q){j.moveTo(f,a);break}else{var p=t/q,y=y+p*g,m=m+p*d;j.moveTo(y,m);k+=t}else if(k+e>q){j.lineTo(f,a);break}else p=e/q,y+=p*g,m+=p*d,j.lineTo(y,m),k+=e;n=!n}},
contextRoundRect:function(b,g,d,f,a,e){b.beginPath();b.moveTo(g+e,d);b.lineTo(g+f-e,d);b.quadraticCurveTo(g+f,d,g+f,d+e);b.lineTo(g+f,d+a-e);b.quadraticCurveTo(g+f,d+a,g+f-e,d+a);b.lineTo(g+e,d+a);b.quadraticCurveTo(g,d+a,g,d+a-e);b.lineTo(g,d+e);b.quadraticCurveTo(g,d,g+e,d);b.closePath()},contextEllipse:function(b,g,d,f,a){var e=0.5522848*(f/2),t=0.5522848*(a/2),k=g+f,q=d+a;f=g+f/2;a=d+a/2;b.beginPath();b.moveTo(g,a);b.bezierCurveTo(g,a-t,f-e,d,f,d);b.bezierCurveTo(f+e,d,k,a-t,k,a);b.bezierCurveTo(k,
a+t,f+e,q,f,q);b.bezierCurveTo(f-e,q,g,a+t,g,a);b.closePath()},getFontString:function(b,g,d,f){var a=[];d&&a.push("bold ");f&&a.push("italic ");a.push(b+"px ");b=0;for(d=g.length;b<d;b++)f=g[b],-1!==f.indexOf(" ")&&(f='"'+f+'"'),a.push((0!==b?",":"")+f);return a.join("")}}}(ChemDoodle.structures,ChemDoodle.lib.vec3,Math);
ChemDoodle.math=function(b,j,m){var l={},g={aliceblue:"#f0f8ff",antiquewhite:"#faebd7",aqua:"#00ffff",aquamarine:"#7fffd4",azure:"#f0ffff",beige:"#f5f5dc",bisque:"#ffe4c4",black:"#000000",blanchedalmond:"#ffebcd",blue:"#0000ff",blueviolet:"#8a2be2",brown:"#a52a2a",burlywood:"#deb887",cadetblue:"#5f9ea0",chartreuse:"#7fff00",chocolate:"#d2691e",coral:"#ff7f50",cornflowerblue:"#6495ed",cornsilk:"#fff8dc",crimson:"#dc143c",cyan:"#00ffff",darkblue:"#00008b",darkcyan:"#008b8b",darkgoldenrod:"#b8860b",
darkgray:"#a9a9a9",darkgreen:"#006400",darkkhaki:"#bdb76b",darkmagenta:"#8b008b",darkolivegreen:"#556b2f",darkorange:"#ff8c00",darkorchid:"#9932cc",darkred:"#8b0000",darksalmon:"#e9967a",darkseagreen:"#8fbc8f",darkslateblue:"#483d8b",darkslategray:"#2f4f4f",darkturquoise:"#00ced1",darkviolet:"#9400d3",deeppink:"#ff1493",deepskyblue:"#00bfff",dimgray:"#696969",dodgerblue:"#1e90ff",firebrick:"#b22222",floralwhite:"#fffaf0",forestgreen:"#228b22",fuchsia:"#ff00ff",gainsboro:"#dcdcdc",ghostwhite:"#f8f8ff",
gold:"#ffd700",goldenrod:"#daa520",gray:"#808080",green:"#008000",greenyellow:"#adff2f",honeydew:"#f0fff0",hotpink:"#ff69b4","indianred ":"#cd5c5c","indigo ":"#4b0082",ivory:"#fffff0",khaki:"#f0e68c",lavender:"#e6e6fa",lavenderblush:"#fff0f5",lawngreen:"#7cfc00",lemonchiffon:"#fffacd",lightblue:"#add8e6",lightcoral:"#f08080",lightcyan:"#e0ffff",lightgoldenrodyellow:"#fafad2",lightgrey:"#d3d3d3",lightgreen:"#90ee90",lightpink:"#ffb6c1",lightsalmon:"#ffa07a",lightseagreen:"#20b2aa",lightskyblue:"#87cefa",
lightslategray:"#778899",lightsteelblue:"#b0c4de",lightyellow:"#ffffe0",lime:"#00ff00",limegreen:"#32cd32",linen:"#faf0e6",magenta:"#ff00ff",maroon:"#800000",mediumaquamarine:"#66cdaa",mediumblue:"#0000cd",mediumorchid:"#ba55d3",mediumpurple:"#9370d8",mediumseagreen:"#3cb371",mediumslateblue:"#7b68ee",mediumspringgreen:"#00fa9a",mediumturquoise:"#48d1cc",mediumvioletred:"#c71585",midnightblue:"#191970",mintcream:"#f5fffa",mistyrose:"#ffe4e1",moccasin:"#ffe4b5",navajowhite:"#ffdead",navy:"#000080",
oldlace:"#fdf5e6",olive:"#808000",olivedrab:"#6b8e23",orange:"#ffa500",orangered:"#ff4500",orchid:"#da70d6",palegoldenrod:"#eee8aa",palegreen:"#98fb98",paleturquoise:"#afeeee",palevioletred:"#d87093",papayawhip:"#ffefd5",peachpuff:"#ffdab9",peru:"#cd853f",pink:"#ffc0cb",plum:"#dda0dd",powderblue:"#b0e0e6",purple:"#800080",red:"#ff0000",rosybrown:"#bc8f8f",royalblue:"#4169e1",saddlebrown:"#8b4513",salmon:"#fa8072",sandybrown:"#f4a460",seagreen:"#2e8b57",seashell:"#fff5ee",sienna:"#a0522d",silver:"#c0c0c0",
skyblue:"#87ceeb",slateblue:"#6a5acd",slategray:"#708090",snow:"#fffafa",springgreen:"#00ff7f",steelblue:"#4682b4",tan:"#d2b48c",teal:"#008080",thistle:"#d8bfd8",tomato:"#ff6347",turquoise:"#40e0d0",violet:"#ee82ee",wheat:"#f5deb3",white:"#ffffff",whitesmoke:"#f5f5f5",yellow:"#ffff00",yellowgreen:"#9acd32"};l.angleBetweenLargest=function(d){if(0===d.length)return{angle:0,largest:2*m.PI};if(1===d.length)return{angle:d[0]+m.PI,largest:2*m.PI};for(var f=0,a=0,e=0,b=d.length-1;e<b;e++){var k=d[e+1]-d[e];
k>f&&(f=k,a=(d[e+1]+d[e])/2)}e=d[0]+2*m.PI-d[d.length-1];e>f&&(a=d[0]-e/2,f=e,0>a&&(a+=2*m.PI));return{angle:a,largest:f}};l.isBetween=function(d,f,a){if(f>a){var e=f;f=a;a=e}return d>=f&&d<=a};l.getRGB=function(d,f){var a=[0,0,0];g[d.toLowerCase()]&&(d=g[d.toLowerCase()]);if("#"===d.charAt(0))return 4===d.length&&(d="#"+d.charAt(1)+d.charAt(1)+d.charAt(2)+d.charAt(2)+d.charAt(3)+d.charAt(3)),[parseInt(d.substring(1,3),16)/255*f,parseInt(d.substring(3,5),16)/255*f,parseInt(d.substring(5,7),16)/255*
f];if(b.stringStartsWith(d,"rgb")){var e=d.replace(/rgb\(|\)/g,"").split(",");return 3!==e.length?a:[parseInt(e[0])/255*f,parseInt(e[1])/255*f,parseInt(e[2])/255*f]}return a};l.idx2color=function(d){d=d.toString(16);for(var f=0,a=6-d.length;f<a;f++)d="0"+d;return"#"+d};l.distanceFromPointToLineInclusive=function(d,f,a){var e=f.distance(a);a=f.angle(a);a=m.PI/2-a;a=f.angle(d)+a;d=f.distance(d);d=new j.Point(d*m.cos(a),-d*m.sin(a));return l.isBetween(-d.y,0,e)?m.abs(d.x):-1};l.calculateDistanceInterior=
function(d,f,a){if(this.isBetween(f.x,a.x,a.x+a.w)&&this.isBetween(f.y,a.y,a.y+a.w))return d.distance(f);var e=[];e.push({x1:a.x,y1:a.y,x2:a.x+a.w,y2:a.y});e.push({x1:a.x,y1:a.y+a.h,x2:a.x+a.w,y2:a.y+a.h});e.push({x1:a.x,y1:a.y,x2:a.x,y2:a.y+a.h});e.push({x1:a.x+a.w,y1:a.y,x2:a.x+a.w,y2:a.y+a.h});a=[];for(var b=0;4>b;b++){var k=e[b];(k=this.intersectLines(f.x,f.y,d.x,d.y,k.x1,k.y1,k.x2,k.y2))&&a.push(k)}if(0===a.length)return 0;b=f=0;for(e=a.length;b<e;b++){var k=a[b],g=d.x-k.x,k=d.y-k.y;f=m.max(f,
m.sqrt(g*g+k*k))}return f};l.intersectLines=function(d,f,a,e,b,k,g,n){a-=d;e-=f;g-=b;n-=k;var j=e*g-a*n;if(0===j)return!1;g=(n*(d-b)-g*(f-k))/j;b=(e*(d-b)-a*(f-k))/j;return 0<=b&&1>=b&&0<=g&&1>=g?{x:d+g*a,y:f+g*e}:!1};l.hsl2rgb=function(d,f,a){var e=function(a,e,d){0>d?d+=1:1<d&&(d-=1);return d<1/6?a+6*(e-a)*d:0.5>d?e:d<2/3?a+6*(e-a)*(2/3-d):a};if(0===f)a=f=d=a;else{var b=0.5>a?a*(1+f):a+f-a*f,k=2*a-b;a=e(k,b,d+1/3);f=e(k,b,d);d=e(k,b,d-1/3)}return[255*a,255*f,255*d]};l.isPointInPoly=function(d,f){for(var a=
!1,e=-1,b=d.length,k=b-1;++e<b;k=e)(d[e].y<=f.y&&f.y<d[k].y||d[k].y<=f.y&&f.y<d[e].y)&&f.x<(d[k].x-d[e].x)*(f.y-d[e].y)/(d[k].y-d[e].y)+d[e].x&&(a=!a);return a};l.clamp=function(d,f,a){return d<f?f:d>a?a:d};l.rainbowAt=function(d,f,a){1>a.length?a.push("#000000","#FFFFFF"):2>a.length&&a.push("#FFFFFF");var e=f/(a.length-1);f=m.floor(d/e);d=(d-f*e)/e;e=l.getRGB(a[f],1);a=l.getRGB(a[f+1],1);return"rgb("+[255*(e[0]+(a[0]-e[0])*d),255*(e[1]+(a[1]-e[1])*d),255*(e[2]+(a[2]-e[2])*d)].join()+")"};l.angleBounds=
function(d,f,a){for(var e=2*m.PI;0>d;)d+=e;for(;d>e;)d-=e;a&&d>m.PI&&(d=2*m.PI-d);f&&(d=180*d/m.PI);return d};return l}(ChemDoodle.extensions,ChemDoodle.structures,Math);
(function(b,j){b.Bounds=function(){};var m=b.Bounds.prototype;m.minX=m.minY=m.minZ=Infinity;m.maxX=m.maxY=m.maxZ=-Infinity;m.expand=function(l,g,d,f){l instanceof b.Bounds?(this.minX=j.min(this.minX,l.minX),this.minY=j.min(this.minY,l.minY),this.maxX=j.max(this.maxX,l.maxX),this.maxY=j.max(this.maxY,l.maxY),Infinity!==l.maxZ&&(this.minZ=j.min(this.minZ,l.minZ),this.maxZ=j.max(this.maxZ,l.maxZ))):(this.minX=j.min(this.minX,l),this.maxX=j.max(this.maxX,l),this.minY=j.min(this.minY,g),this.maxY=j.max(this.maxY,
g),void 0!==d&&void 0!==f&&(this.minX=j.min(this.minX,d),this.maxX=j.max(this.maxX,d),this.minY=j.min(this.minY,f),this.maxY=j.max(this.maxY,f)))};m.expand3D=function(b,g,d,f,a,e){this.minX=j.min(this.minX,b);this.maxX=j.max(this.maxX,b);this.minY=j.min(this.minY,g);this.maxY=j.max(this.maxY,g);this.minZ=j.min(this.minZ,d);this.maxZ=j.max(this.maxZ,d);void 0!==f&&(void 0!==a&&void 0!==e)&&(this.minX=j.min(this.minX,f),this.maxX=j.max(this.maxX,f),this.minY=j.min(this.minY,a),this.maxY=j.max(this.maxY,
a),this.minZ=j.min(this.minZ,e),this.maxZ=j.max(this.maxZ,e))}})(ChemDoodle.math,Math);
(function(){var b={subtract:function(a,e){return{x:a.x-e.x,y:a.y-e.y}},dotProduct:function(a,e){return a.x*e.x+a.y*e.y},square:function(a){return Math.sqrt(a.x*a.x+a.y*a.y)},scale:function(a,e){return{x:a.x*e,y:a.y*e}}},j=Math.pow(2,-65),m=function(a,e){for(var d=[],f=e.length-1,t=2*f-1,j=[],m=[],r=[],v=[],w=[[1,0.6,0.3,0.1],[0.4,0.6,0.6,0.4],[0.1,0.3,0.6,1]],A=0;A<=f;A++)j[A]=b.subtract(e[A],a);for(A=0;A<=f-1;A++)m[A]=b.subtract(e[A+1],e[A]),m[A]=b.scale(m[A],3);for(A=0;A<=f-1;A++)for(var B=0;B<=
f;B++)r[A]||(r[A]=[]),r[A][B]=b.dotProduct(m[A],j[B]);for(A=0;A<=t;A++)v[A]||(v[A]=[]),v[A].y=0,v[A].x=parseFloat(A)/t;t=f-1;for(j=0;j<=f+t;j++){A=Math.max(0,j-t);for(m=Math.min(j,f);A<=m;A++)B=j-A,v[A+B].y+=r[B][A]*w[B][A]}f=e.length-1;v=l(v,2*f-1,d,0);t=b.subtract(a,e[0]);r=b.square(t);for(A=w=0;A<v;A++)t=b.subtract(a,g(e,f,d[A],null,null)),t=b.square(t),t<r&&(r=t,w=d[A]);t=b.subtract(a,e[f]);t=b.square(t);t<r&&(r=t,w=1);return{location:w,distance:r}},l=function(a,e,d,f){var b=[],t=[],m=[],r=[],
v=0,w,A;A=0==a[0].y?0:0<a[0].y?1:-1;for(var B=1;B<=e;B++)w=0==a[B].y?0:0<a[B].y?1:-1,w!=A&&v++,A=w;switch(v){case 0:return 0;case 1:if(64<=f)return d[0]=(a[0].x+a[e].x)/2,1;var c,h,D,v=a[0].y-a[e].y;w=a[e].x-a[0].x;A=a[0].x*a[e].y-a[e].x*a[0].y;B=c=0;for(h=1;h<e;h++)D=v*a[h].x+w*a[h].y+A,D>c?c=D:D<B&&(B=D);D=w;h=0*D-1*v;c=(1*(A-c)-0*D)*(1/h);D=w;h=0*D-1*v;v=(1*(A-B)-0*D)*(1/h);w=Math.min(c,v);if(Math.max(c,v)-w<j)return m=a[e].x-a[0].x,r=a[e].y-a[0].y,d[0]=0+1*(m*(a[0].y-0)-r*(a[0].x-0))*(1/(0*m-
1*r)),1}g(a,e,0.5,b,t);a=l(b,e,m,f+1);e=l(t,e,r,f+1);for(f=0;f<a;f++)d[f]=m[f];for(f=0;f<e;f++)d[f+a]=r[f];return a+e},g=function(a,e,d,f,b){for(var g=[[]],t=0;t<=e;t++)g[0][t]=a[t];for(a=1;a<=e;a++)for(t=0;t<=e-a;t++)g[a]||(g[a]=[]),g[a][t]||(g[a][t]={}),g[a][t].x=(1-d)*g[a-1][t].x+d*g[a-1][t+1].x,g[a][t].y=(1-d)*g[a-1][t].y+d*g[a-1][t+1].y;if(null!=f)for(t=0;t<=e;t++)f[t]=g[t][0];if(null!=b)for(t=0;t<=e;t++)b[t]=g[e-t][t];return g[e][0]},d={},f=function(a,e){var f,b=a.length-1;f=d[b];if(!f){f=[];
var g=function(a){return function(){return a}},t=function(){return function(a){return a}},j=function(){return function(a){return 1-a}},l=function(a){return function(c){for(var e=1,d=0;d<a.length;d++)e*=a[d](c);return e}};f.push(new function(){return function(a){return Math.pow(a,b)}});for(var m=1;m<b;m++){for(var w=[new g(b)],A=0;A<b-m;A++)w.push(new t);for(A=0;A<m;A++)w.push(new j);f.push(new l(w))}f.push(new function(){return function(a){return Math.pow(1-a,b)}});d[b]=f}for(j=t=g=0;j<a.length;j++)g+=
a[j].x*f[j](e),t+=a[j].y*f[j](e);return{x:g,y:t}},a=function(a,e){return Math.sqrt(Math.pow(a.x-e.x,2)+Math.pow(a.y-e.y,2))},e=function(e,d,b){for(var g=f(e,d),t=0,j=0<b?1:-1,l=null;t<Math.abs(b);)d+=0.005*j,l=f(e,d),t+=a(l,g),g=l;return{point:l,location:d}},t=function(a,e){var d=f(a,e),b=f(a.slice(0,a.length-1),e),g=b.y-d.y,d=b.x-d.x;return 0==g?Infinity:Math.atan(g/d)};ChemDoodle.math.jsBezier={distanceFromCurve:m,gradientAtPoint:t,gradientAtPointAlongCurveFrom:function(a,d,f){d=e(a,d,f);1<d.location&&
(d.location=1);0>d.location&&(d.location=0);return t(a,d.location)},nearestPointOnCurve:function(a,e){var d=m(a,e);return{point:g(e,e.length-1,d.location,null,null),location:d.location}},pointOnCurve:f,pointAlongCurveFrom:function(a,d,f){return e(a,d,f).point},perpendicularToCurveAt:function(a,d,f,b){d=e(a,d,null==b?0:b);a=t(a,d.location);b=Math.atan(-1/a);a=f/2*Math.sin(b);f=f/2*Math.cos(b);return[{x:d.point.x+f,y:d.point.y+a},{x:d.point.x-f,y:d.point.y-a}]},locationAlongCurveFrom:function(a,d,f){return e(a,
d,f).location},getLength:function(e){for(var d=f(e,0),b=0,g=0,t=null;1>g;)g+=0.005,t=f(e,g),b+=a(t,d),d=t;return b}}})(ChemDoodle.math);
ChemDoodle.featureDetection=function(b,j,m,l){var g={supports_canvas:function(){return!!m.createElement("canvas").getContext},supports_canvas_text:function(){return!g.supports_canvas()?!1:"function"===typeof m.createElement("canvas").getContext("2d").fillText},supports_webgl:function(){var d=m.createElement("canvas");try{if(d.getContext("webgl")||d.getContext("experimental-webgl"))return!0}catch(f){}return!1},supports_xhr2:function(){return j.support.cors},supports_touch:function(){return"ontouchstart"in
l&&navigator.userAgent.match(/iPhone|iPad|iPod|Android|BlackBerry|BB10/i)},supports_gesture:function(){return"ongesturestart"in l}};return g}(ChemDoodle.iChemLabs,ChemDoodle.lib.jQuery,document,window);ChemDoodle.SYMBOLS="H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr Rf Db Sg Bh Hs Mt Ds Rg Cn Uut Uuq Uup Uuh Uus Uuo".split(" ");
ChemDoodle.ELEMENT=function(){function b(b,j,g,d,f,a,e,t,k){this.symbol=b;this.name=j;this.atomicNumber=g;this.addH=d;this.jmolColor=this.pymolColor=f;this.covalentRadius=a;this.vdWRadius=e;this.valency=t;this.mass=k}var j=[];j.H=new b("H","Hydrogen",1,!1,"#FFFFFF",0.31,1.2,1,1);j.He=new b("He","Helium",2,!1,"#D9FFFF",0.28,1.4,0,4);j.Li=new b("Li","Lithium",3,!1,"#CC80FF",1.28,1.82,1,7);j.Be=new b("Be","Beryllium",4,!1,"#C2FF00",0.96,0,2,9);j.B=new b("B","Boron",5,!0,"#FFB5B5",0.84,0,3,11);j.C=new b("C",
"Carbon",6,!0,"#909090",0.76,1.7,4,12);j.N=new b("N","Nitrogen",7,!0,"#3050F8",0.71,1.55,3,14);j.O=new b("O","Oxygen",8,!0,"#FF0D0D",0.66,1.52,2,16);j.F=new b("F","Fluorine",9,!0,"#90E050",0.57,1.47,1,19);j.Ne=new b("Ne","Neon",10,!1,"#B3E3F5",0.58,1.54,0,20);j.Na=new b("Na","Sodium",11,!1,"#AB5CF2",1.66,2.27,1,23);j.Mg=new b("Mg","Magnesium",12,!1,"#8AFF00",1.41,1.73,0,24);j.Al=new b("Al","Aluminum",13,!1,"#BFA6A6",1.21,0,0,27);j.Si=new b("Si","Silicon",14,!0,"#F0C8A0",1.11,2.1,4,28);j.P=new b("P",
"Phosphorus",15,!0,"#FF8000",1.07,1.8,3,31);j.S=new b("S","Sulfur",16,!0,"#FFFF30",1.05,1.8,2,32);j.Cl=new b("Cl","Chlorine",17,!0,"#1FF01F",1.02,1.75,1,35);j.Ar=new b("Ar","Argon",18,!1,"#80D1E3",1.06,1.88,0,40);j.K=new b("K","Potassium",19,!1,"#8F40D4",2.03,2.75,0,39);j.Ca=new b("Ca","Calcium",20,!1,"#3DFF00",1.76,0,0,40);j.Sc=new b("Sc","Scandium",21,!1,"#E6E6E6",1.7,0,0,45);j.Ti=new b("Ti","Titanium",22,!1,"#BFC2C7",1.6,0,1,48);j.V=new b("V","Vanadium",23,!1,"#A6A6AB",1.53,0,1,51);j.Cr=new b("Cr",
"Chromium",24,!1,"#8A99C7",1.39,0,2,52);j.Mn=new b("Mn","Manganese",25,!1,"#9C7AC7",1.39,0,3,55);j.Fe=new b("Fe","Iron",26,!1,"#E06633",1.32,0,2,56);j.Co=new b("Co","Cobalt",27,!1,"#F090A0",1.26,0,1,59);j.Ni=new b("Ni","Nickel",28,!1,"#50D050",1.24,1.63,1,58);j.Cu=new b("Cu","Copper",29,!1,"#C88033",1.32,1.4,0,63);j.Zn=new b("Zn","Zinc",30,!1,"#7D80B0",1.22,1.39,0,64);j.Ga=new b("Ga","Gallium",31,!1,"#C28F8F",1.22,1.87,0,69);j.Ge=new b("Ge","Germanium",32,!1,"#668F8F",1.2,0,4,74);j.As=new b("As",
"Arsenic",33,!0,"#BD80E3",1.19,1.85,3,75);j.Se=new b("Se","Selenium",34,!0,"#FFA100",1.2,1.9,2,80);j.Br=new b("Br","Bromine",35,!0,"#A62929",1.2,1.85,1,79);j.Kr=new b("Kr","Krypton",36,!1,"#5CB8D1",1.16,2.02,0,84);j.Rb=new b("Rb","Rubidium",37,!1,"#702EB0",2.2,0,0,85);j.Sr=new b("Sr","Strontium",38,!1,"#00FF00",1.95,0,0,88);j.Y=new b("Y","Yttrium",39,!1,"#94FFFF",1.9,0,0,89);j.Zr=new b("Zr","Zirconium",40,!1,"#94E0E0",1.75,0,0,90);j.Nb=new b("Nb","Niobium",41,!1,"#73C2C9",1.64,0,1,93);j.Mo=new b("Mo",
"Molybdenum",42,!1,"#54B5B5",1.54,0,2,98);j.Tc=new b("Tc","Technetium",43,!1,"#3B9E9E",1.47,0,3,0);j.Ru=new b("Ru","Ruthenium",44,!1,"#248F8F",1.46,0,2,102);j.Rh=new b("Rh","Rhodium",45,!1,"#0A7D8C",1.42,0,1,103);j.Pd=new b("Pd","Palladium",46,!1,"#006985",1.39,1.63,0,106);j.Ag=new b("Ag","Silver",47,!1,"#C0C0C0",1.45,1.72,0,107);j.Cd=new b("Cd","Cadmium",48,!1,"#FFD98F",1.44,1.58,0,114);j.In=new b("In","Indium",49,!1,"#A67573",1.42,1.93,0,115);j.Sn=new b("Sn","Tin",50,!1,"#668080",1.39,2.17,4,120);
j.Sb=new b("Sb","Antimony",51,!1,"#9E63B5",1.39,0,3,121);j.Te=new b("Te","Tellurium",52,!0,"#D47A00",1.38,2.06,2,130);j.I=new b("I","Iodine",53,!0,"#940094",1.39,1.98,1,127);j.Xe=new b("Xe","Xenon",54,!1,"#429EB0",1.4,2.16,0,132);j.Cs=new b("Cs","Cesium",55,!1,"#57178F",2.44,0,0,133);j.Ba=new b("Ba","Barium",56,!1,"#00C900",2.15,0,0,138);j.La=new b("La","Lanthanum",57,!1,"#70D4FF",2.07,0,0,139);j.Ce=new b("Ce","Cerium",58,!1,"#FFFFC7",2.04,0,0,140);j.Pr=new b("Pr","Praseodymium",59,!1,"#D9FFC7",2.03,
0,0,141);j.Nd=new b("Nd","Neodymium",60,!1,"#C7FFC7",2.01,0,0,142);j.Pm=new b("Pm","Promethium",61,!1,"#A3FFC7",1.99,0,0,0);j.Sm=new b("Sm","Samarium",62,!1,"#8FFFC7",1.98,0,0,152);j.Eu=new b("Eu","Europium",63,!1,"#61FFC7",1.98,0,0,153);j.Gd=new b("Gd","Gadolinium",64,!1,"#45FFC7",1.96,0,0,158);j.Tb=new b("Tb","Terbium",65,!1,"#30FFC7",1.94,0,0,159);j.Dy=new b("Dy","Dysprosium",66,!1,"#1FFFC7",1.92,0,0,164);j.Ho=new b("Ho","Holmium",67,!1,"#00FF9C",1.92,0,0,165);j.Er=new b("Er","Erbium",68,!1,"#00E675",
1.89,0,0,166);j.Tm=new b("Tm","Thulium",69,!1,"#00D452",1.9,0,0,169);j.Yb=new b("Yb","Ytterbium",70,!1,"#00BF38",1.87,0,0,174);j.Lu=new b("Lu","Lutetium",71,!1,"#00AB24",1.87,0,0,175);j.Hf=new b("Hf","Hafnium",72,!1,"#4DC2FF",1.75,0,0,180);j.Ta=new b("Ta","Tantalum",73,!1,"#4DA6FF",1.7,0,1,181);j.W=new b("W","Tungsten",74,!1,"#2194D6",1.62,0,2,184);j.Re=new b("Re","Rhenium",75,!1,"#267DAB",1.51,0,3,187);j.Os=new b("Os","Osmium",76,!1,"#266696",1.44,0,2,192);j.Ir=new b("Ir","Iridium",77,!1,"#175487",
1.41,0,3,193);j.Pt=new b("Pt","Platinum",78,!1,"#D0D0E0",1.36,1.75,0,195);j.Au=new b("Au","Gold",79,!1,"#FFD123",1.36,1.66,1,197);j.Hg=new b("Hg","Mercury",80,!1,"#B8B8D0",1.32,1.55,0,202);j.Tl=new b("Tl","Thallium",81,!1,"#A6544D",1.45,1.96,0,205);j.Pb=new b("Pb","Lead",82,!1,"#575961",1.46,2.02,4,208);j.Bi=new b("Bi","Bismuth",83,!1,"#9E4FB5",1.48,0,3,209);j.Po=new b("Po","Polonium",84,!1,"#AB5C00",1.4,0,2,0);j.At=new b("At","Astatine",85,!0,"#754F45",1.5,0,1,0);j.Rn=new b("Rn","Radon",86,!1,"#428296",
1.5,0,0,0);j.Fr=new b("Fr","Francium",87,!1,"#420066",2.6,0,0,0);j.Ra=new b("Ra","Radium",88,!1,"#007D00",2.21,0,0,0);j.Ac=new b("Ac","Actinium",89,!1,"#70ABFA",2.15,0,0,0);j.Th=new b("Th","Thorium",90,!1,"#00BAFF",2.06,0,0,232);j.Pa=new b("Pa","Protactinium",91,!1,"#00A1FF",2,0,0,231);j.U=new b("U","Uranium",92,!1,"#008FFF",1.96,1.86,0,238);j.Np=new b("Np","Neptunium",93,!1,"#0080FF",1.9,0,0,0);j.Pu=new b("Pu","Plutonium",94,!1,"#006BFF",1.87,0,0,0);j.Am=new b("Am","Americium",95,!1,"#545CF2",1.8,
0,0,0);j.Cm=new b("Cm","Curium",96,!1,"#785CE3",1.69,0,0,0);j.Bk=new b("Bk","Berkelium",97,!1,"#8A4FE3",0,0,0,0);j.Cf=new b("Cf","Californium",98,!1,"#A136D4",0,0,0,0);j.Es=new b("Es","Einsteinium",99,!1,"#B31FD4",0,0,0,0);j.Fm=new b("Fm","Fermium",100,!1,"#B31FBA",0,0,0,0);j.Md=new b("Md","Mendelevium",101,!1,"#B30DA6",0,0,0,0);j.No=new b("No","Nobelium",102,!1,"#BD0D87",0,0,0,0);j.Lr=new b("Lr","Lawrencium",103,!1,"#C70066",0,0,0,0);j.Rf=new b("Rf","Rutherfordium",104,!1,"#CC0059",0,0,0,0);j.Db=
new b("Db","Dubnium",105,!1,"#D1004F",0,0,0,0);j.Sg=new b("Sg","Seaborgium",106,!1,"#D90045",0,0,0,0);j.Bh=new b("Bh","Bohrium",107,!1,"#E00038",0,0,0,0);j.Hs=new b("Hs","Hassium",108,!1,"#E6002E",0,0,0,0);j.Mt=new b("Mt","Meitnerium",109,!1,"#EB0026",0,0,0,0);j.Ds=new b("Ds","Darmstadtium",110,!1,"#000000",0,0,0,0);j.Rg=new b("Rg","Roentgenium",111,!1,"#000000",0,0,0,0);j.Cn=new b("Cn","Copernicium",112,!1,"#000000",0,0,0,0);j.Uut=new b("Uut","Ununtrium",113,!1,"#000000",0,0,0,0);j.Uuq=new b("Uuq",
"Ununquadium",114,!1,"#000000",0,0,0,0);j.Uup=new b("Uup","Ununpentium",115,!1,"#000000",0,0,0,0);j.Uuh=new b("Uuh","Ununhexium",116,!1,"#000000",0,0,0,0);j.Uus=new b("Uus","Ununseptium",117,!1,"#000000",0,0,0,0);j.Uuo=new b("Uuo","Ununoctium",118,!1,"#000000",0,0,0,0);j.H.pymolColor="#E6E6E6";j.C.pymolColor="#33FF33";j.N.pymolColor="#3333FF";j.O.pymolColor="#FF4D4D";j.F.pymolColor="#B3FFFF";j.S.pymolColor="#E6C640";return j}(ChemDoodle.SYMBOLS);
ChemDoodle.RESIDUE=function(){function b(b,j,g,d,f,a){this.symbol=b;this.name=j;this.polar=g;this.aminoColor=d;this.shapelyColor=f;this.acidity=a}var j=[];j.Ala=new b("Ala","Alanine",!1,"#C8C8C8","#8CFF8C",0);j.Arg=new b("Arg","Arginine",!0,"#145AFF","#00007C",1);j.Asn=new b("Asn","Asparagine",!0,"#00DCDC","#FF7C70",0);j.Asp=new b("Asp","Aspartic Acid",!0,"#E60A0A","#A00042",-1);j.Cys=new b("Cys","Cysteine",!0,"#E6E600","#FFFF70",0);j.Gln=new b("Gln","Glutamine",!0,"#00DCDC","#FF4C4C",0);j.Glu=new b("Glu",
"Glutamic Acid",!0,"#E60A0A","#660000",-1);j.Gly=new b("Gly","Glycine",!1,"#EBEBEB","#FFFFFF",0);j.His=new b("His","Histidine",!0,"#8282D2","#7070FF",1);j.Ile=new b("Ile","Isoleucine",!1,"#0F820F","#004C00",0);j.Leu=new b("Leu","Leucine",!1,"#0F820F","#455E45",0);j.Lys=new b("Lys","Lysine",!0,"#145AFF","#4747B8",1);j.Met=new b("Met","Methionine",!1,"#E6E600","#B8A042",0);j.Phe=new b("Phe","Phenylalanine",!1,"#3232AA","#534C52",0);j.Pro=new b("Pro","Proline",!1,"#DC9682","#525252",0);j.Ser=new b("Ser",
"Serine",!0,"#FA9600","#FF7042",0);j.Thr=new b("Thr","Threonine",!0,"#FA9600","#B84C00",0);j.Trp=new b("Trp","Tryptophan",!0,"#B45AB4","#4F4600",0);j.Tyr=new b("Tyr","Tyrosine",!0,"#3232AA","#8C704C",0);j.Val=new b("Val","Valine",!1,"#0F820F","#FF8CFF",0);j.Asx=new b("Asx","Asparagine/Aspartic Acid",!0,"#FF69B4","#FF00FF",0);j.Glx=new b("Glx","Glutamine/Glutamic Acid",!0,"#FF69B4","#FF00FF",0);j["*"]=new b("*","Other",!1,"#BEA06E","#FF00FF",0);j.A=new b("A","Adenine",!1,"#BEA06E","#A0A0FF",0);j.G=
new b("G","Guanine",!1,"#BEA06E","#FF7070",0);j.I=new b("I","",!1,"#BEA06E","#80FFFF",0);j.C=new b("C","Cytosine",!1,"#BEA06E","#FF8C4B",0);j.T=new b("T","Thymine",!1,"#BEA06E","#A0FFA0",0);j.U=new b("U","Uracil",!1,"#BEA06E","#FF8080",0);return j}();
(function(b){b.Queue=function(){this.queue=[]};b=b.Queue.prototype;b.queueSpace=0;b.getSize=function(){return this.queue.length-this.queueSpace};b.isEmpty=function(){return 0===this.queue.length};b.enqueue=function(b){this.queue.push(b)};b.dequeue=function(){var b;this.queue.length&&(b=this.queue[this.queueSpace],2*++this.queueSpace>=this.queue.length&&(this.queue=this.queue.slice(this.queueSpace),this.queueSpace=0));return b};b.getOldestElement=function(){var b;this.queue.length&&(b=this.queue[this.queueSpace]);
return b}})(ChemDoodle.structures);
(function(b,j){b.Point=function(b,g){this.x=b?b:0;this.y=g?g:0};var m=b.Point.prototype;m.sub=function(b){this.x-=b.x;this.y-=b.y};m.add=function(b){this.x+=b.x;this.y+=b.y};m.distance=function(b){var g=b.x-this.x;b=b.y-this.y;return j.sqrt(g*g+b*b)};m.angleForStupidCanvasArcs=function(b){var g=b.x-this.x;b=b.y-this.y;for(var d=0,d=0===g?0===b?0:0<b?j.PI/2:3*j.PI/2:0===b?0<g?0:j.PI:0>g?j.atan(b/g)+j.PI:0>b?j.atan(b/g)+2*j.PI:j.atan(b/g);0>d;)d+=2*j.PI;return d%=2*j.PI};m.angle=function(b){var g=b.x-
this.x;b=this.y-b.y;for(var d=0,d=0===g?0===b?0:0<b?j.PI/2:3*j.PI/2:0===b?0<g?0:j.PI:0>g?j.atan(b/g)+j.PI:0>b?j.atan(b/g)+2*j.PI:j.atan(b/g);0>d;)d+=2*j.PI;return d%=2*j.PI}})(ChemDoodle.structures,Math);
(function(b,j,m,l,g,d){l.Atom=function(d,a,e,g){this.label=d?d.replace(/\s/g,""):"C";b[this.label]||(this.label="C");this.x=a?a:0;this.y=e?e:0;this.z=g?g:0};l=l.Atom.prototype=new l.Point(0,0);l.charge=0;l.numLonePair=0;l.numRadical=0;l.mass=-1;l.coordinationNumber=0;l.bondNumber=0;l.angleOfLeastInterference=0;l.isHidden=!1;l.altLabel=void 0;l.any=!1;l.rgroup=-1;l.isLone=!1;l.isHover=!1;l.isSelected=!1;l.add3D=function(d){this.x+=d.x;this.y+=d.y;this.z+=d.z};l.sub3D=function(d){this.x-=d.x;this.y-=
d.y;this.z-=d.z};l.distance3D=function(d){var a=d.x-this.x,e=d.y-this.y;d=d.z-this.z;return g.sqrt(a*a+e*e+d*d)};l.draw=function(d,a){if(this.isLassoed){var e=d.createRadialGradient(this.x-1,this.y-1,0,this.x,this.y,7);e.addColorStop(0,"rgba(212, 99, 0, 0)");e.addColorStop(0.7,"rgba(212, 99, 0, 0.8)");d.fillStyle=e;d.beginPath();d.arc(this.x,this.y,5,0,2*g.PI,!1);d.fill()}this.textBounds=[];this.specs&&(a=this.specs);var b=j.getFontString(a.atoms_font_size_2D,a.atoms_font_families_2D,a.atoms_font_bold_2D,
a.atoms_font_italic_2D);d.font=b;d.fillStyle=this.getElementColor(a.atoms_useJMOLColors,a.atoms_usePYMOLColors,a.atoms_color,2);"H"===this.label&&a.atoms_HBlack_2D&&(d.fillStyle="black");var k;if(this.isLone&&!a.atoms_displayAllCarbonLabels_2D||a.atoms_circles_2D)d.beginPath(),d.arc(this.x,this.y,a.atoms_circleDiameter_2D/2,0,2*g.PI,!1),d.fill(),0<a.atoms_circleBorderWidth_2D&&(d.lineWidth=a.atoms_circleBorderWidth_2D,d.strokeStyle="black",d.stroke(this.x,this.y,0,2*g.PI,a.atoms_circleDiameter_2D/
2));else if(this.isLabelVisible(a))if(d.textAlign="center",d.textBaseline="middle",void 0!==this.altLabel){d.fillText(this.altLabel,this.x,this.y);var q=d.measureText(this.altLabel).width;this.textBounds.push({x:this.x-q/2,y:this.y-a.atoms_font_size_2D/2+1,w:q,h:a.atoms_font_size_2D-2})}else if(this.any)d.font=j.getFontString(a.atoms_font_size_2D+5,a.atoms_font_families_2D,!0),d.fillText("*",this.x+1,this.y+3),q=d.measureText("*").width,this.textBounds.push({x:this.x-q/2,y:this.y-a.atoms_font_size_2D/
2+1,w:q,h:a.atoms_font_size_2D-2});else if(-1!==this.rgroup)e="R"+this.rgroup,d.fillText(e,this.x,this.y),q=d.measureText(e).width,this.textBounds.push({x:this.x-q/2,y:this.y-a.atoms_font_size_2D/2+1,w:q,h:a.atoms_font_size_2D-2});else{d.fillText(this.label,this.x,this.y);q=d.measureText(this.label).width;this.textBounds.push({x:this.x-q/2,y:this.y-a.atoms_font_size_2D/2+1,w:q,h:a.atoms_font_size_2D-2});var n=0;if(-1!==this.mass){var l=j.getFontString(0.7*a.atoms_font_size_2D,a.atoms_font_families_2D,
a.atoms_font_bold_2D,a.atoms_font_italic_2D),e=d.font;d.font=j.getFontString(0.7*a.atoms_font_size_2D,a.atoms_font_families_2D,a.atoms_font_bold_2D,a.atoms_font_italic_2D);n=d.measureText(this.mass).width;d.fillText(this.mass,this.x-n-0.5,this.y-a.atoms_font_size_2D/2+1);this.textBounds.push({x:this.x-q/2-n-0.5,y:this.y-1.7*a.atoms_font_size_2D/2+1,w:n,h:a.atoms_font_size_2D/2-1});d.font=e}var e=q/2,z=this.getImplicitHydrogenCount();if(a.atoms_implicitHydrogens_2D&&0<z){k=0;var p=d.measureText("H").width,
u=!0;if(1<z){var r=q/2+p/2,v=0,l=j.getFontString(0.8*a.atoms_font_size_2D,a.atoms_font_families_2D,a.atoms_font_bold_2D,a.atoms_font_italic_2D);d.font=l;var w=d.measureText(z).width;1===this.bondNumber?this.angleOfLeastInterference>g.PI/2&&this.angleOfLeastInterference<3*g.PI/2&&(r=-q/2-w-p/2-n/2,u=!1,k=g.PI):this.angleOfLeastInterference<=g.PI/4||(this.angleOfLeastInterference<3*g.PI/4?(r=0,v=0.9*-a.atoms_font_size_2D,0!==this.charge&&(v-=0.3*a.atoms_font_size_2D),u=!1,k=g.PI/2):this.angleOfLeastInterference<=
5*g.PI/4?(r=-q/2-w-p/2-n/2,u=!1,k=g.PI):this.angleOfLeastInterference<7*g.PI/4&&(r=0,v=0.9*a.atoms_font_size_2D,u=!1,k=3*g.PI/2));d.font=b;d.fillText("H",this.x+r,this.y+v);d.font=l;d.fillText(z,this.x+r+p/2+w/2,this.y+v+0.3*a.atoms_font_size_2D);this.textBounds.push({x:this.x+r-p/2,y:this.y+v-a.atoms_font_size_2D/2+1,w:p,h:a.atoms_font_size_2D-2});this.textBounds.push({x:this.x+r+p/2,y:this.y+v+0.3*a.atoms_font_size_2D-a.atoms_font_size_2D/2+1,w:w,h:0.8*a.atoms_font_size_2D-2})}else r=q/2+p/2,v=
0,1===this.bondNumber?this.angleOfLeastInterference>g.PI/2&&this.angleOfLeastInterference<3*g.PI/2&&(r=-q/2-p/2-n/2,u=!1,k=g.PI):this.angleOfLeastInterference<=g.PI/4||(this.angleOfLeastInterference<3*g.PI/4?(r=0,v=0.9*-a.atoms_font_size_2D,u=!1,k=g.PI/2):this.angleOfLeastInterference<=5*g.PI/4?(r=-q/2-p/2-n/2,u=!1,k=g.PI):this.angleOfLeastInterference<7*g.PI/4&&(r=0,v=0.9*a.atoms_font_size_2D,u=!1,k=3*g.PI/2)),d.fillText("H",this.x+r,this.y+v),this.textBounds.push({x:this.x+r-p/2,y:this.y+v-a.atoms_font_size_2D/
2+1,w:p,h:a.atoms_font_size_2D-2});u&&(e+=p)}0!==this.charge&&(b=this.charge.toFixed(0),b="1"===b?"+":"-1"===b?"\u2013":j.stringStartsWith(b,"-")?b.substring(1)+"\u2013":b+"+",q=d.measureText(b).width,e+=q/2,d.textAlign="center",d.textBaseline="middle",d.font=j.getFontString(g.floor(0.8*a.atoms_font_size_2D),a.atoms_font_families_2D,a.atoms_font_bold_2D,a.atoms_font_italic_2D),d.fillText(b,this.x+e-1,this.y-a.atoms_font_size_2D/2+1),this.textBounds.push({x:this.x+e-q/2-1,y:this.y-1.8*a.atoms_font_size_2D/
2+5,w:q,h:a.atoms_font_size_2D/2-1}))}if(0<this.numLonePair||0<this.numRadical){d.fillStyle="black";l=this.angles.slice(0);e=this.angleOfLeastInterference;b=this.largestAngle;void 0!==k&&(l.push(k),l.sort(),b=m.angleBetweenLargest(l),e=b.angle%(2*g.PI),b=b.largest);q=[];for(n=0;n<this.numLonePair;n++)q.push({t:2});for(n=0;n<this.numRadical;n++)q.push({t:1});if(void 0===k&&g.abs(b-2*g.PI/l.length)<g.PI/60){l=g.ceil(q.length/l.length);n=0;for(z=q.length;n<z;n+=l,e+=b)this.drawElectrons(d,a,q.slice(n,
g.min(q.length,n+l)),e,b,k)}else this.drawElectrons(d,a,q,e,b,k)}};l.drawElectrons=function(d,a,e,b,k,j){j=k/(e.length+(0===this.bonds.length&&void 0===j?0:1));k=b-k/2+j;for(var n=0;n<e.length;n++){var l=e[n];b=k+n*j;var m=this.x+Math.cos(b)*a.atoms_lonePairDistance_2D,p=this.y-Math.sin(b)*a.atoms_lonePairDistance_2D;2===l.t?(l=b+Math.PI/2,b=Math.cos(l)*a.atoms_lonePairSpread_2D/2,l=-Math.sin(l)*a.atoms_lonePairSpread_2D/2,d.beginPath(),d.arc(m+b,p+l,a.atoms_lonePairDiameter_2D,0,2*g.PI,!1),d.fill(),
d.beginPath(),d.arc(m-b,p-l,a.atoms_lonePairDiameter_2D,0,2*g.PI,!1),d.fill()):1===l.t&&(d.beginPath(),d.arc(m,p,a.atoms_lonePairDiameter_2D,0,2*g.PI,!1),d.fill())}};l.drawDecorations=function(d){if(this.isHover||this.isSelected)d.strokeStyle=this.isHover?"#885110":"#0060B2",d.lineWidth=1.2,d.beginPath(),d.arc(this.x,this.y,this.isHover?7:15,0,2*g.PI,!1),d.stroke();this.isOverlap&&(d.strokeStyle="#C10000",d.lineWidth=1.2,d.beginPath(),d.arc(this.x,this.y,7,0,2*g.PI,!1),d.stroke())};l.render=function(f,
a,e){this.specs&&(a=this.specs);var g=d.translate(f.modelViewMatrix,[this.x,this.y,this.z],[]),k=a.atoms_useVDWDiameters_3D?b[this.label].vdWRadius*a.atoms_vdwMultiplier_3D:a.atoms_sphereDiameter_3D/2;0===k&&(k=1);d.scale(g,[k,k,k]);e||(e=a.atoms_color,a.atoms_useJMOLColors?e=b[this.label].jmolColor:a.atoms_usePYMOLColors&&(e=b[this.label].pymolColor),f.material.setDiffuseColor(e));f.setMatrixUniforms(g);f.drawElements(f.TRIANGLES,(this.renderAsStar?f.starBuffer:f.sphereBuffer).vertexIndexBuffer.numItems,
f.UNSIGNED_SHORT,0)};l.renderHighlight=function(f,a){if(this.isSelected||this.isHover){this.specs&&(a=this.specs);var e=d.translate(f.modelViewMatrix,[this.x,this.y,this.z],[]),g=a.atoms_useVDWDiameters_3D?b[this.label].vdWRadius*a.atoms_vdwMultiplier_3D:a.atoms_sphereDiameter_3D/2;0===g&&(g=1);g*=1.3;d.scale(e,[g,g,g]);f.setMatrixUniforms(e);f.material.setDiffuseColor(this.isHover?"#885110":"#0060B2");f.drawElements(f.TRIANGLES,(this.renderAsStar?f.starBuffer:f.sphereBuffer).vertexIndexBuffer.numItems,
f.UNSIGNED_SHORT,0)}};l.isLabelVisible=function(d){return d.atoms_displayAllCarbonLabels_2D||"C"!==this.label||this.altLabel||(this.any||-1!==this.rgroup)||(-1!==this.mass||0!==this.charge)||d.atoms_showAttributedCarbons_2D&&(0!==this.numRadical||0!==this.numLonePair)||this.isHidden&&d.atoms_showHiddenCarbons_2D||d.atoms_displayTerminalCarbonLabels_2D&&1===this.bondNumber?!0:!1};l.getImplicitHydrogenCount=function(){if("H"===this.label||!b[this.label]||!b[this.label].addH)return 0;var d=b[this.label].valency,
a=d-this.coordinationNumber;0<this.numRadical&&(a=g.max(0,a-this.numRadical));0<this.charge?(d=4-d,a=this.charge<=d?a+this.charge:4-this.coordinationNumber-this.charge+d):a+=this.charge;return 0>a?0:g.floor(a)};l.getBounds=function(){var d=new m.Bounds;d.expand(this.x,this.y);if(this.textBounds)for(var a=0,e=this.textBounds.length;a<e;a++){var b=this.textBounds[a];d.expand(b.x,b.y,b.x+b.w,b.y+b.h)}return d};l.getBounds3D=function(){var d=new m.Bounds;d.expand3D(this.x,this.y,this.z);return d};l.getElementColor=
function(d,a,e,g){if(2==g&&this.any||-1!==this.rgroup)return e;d?e=b[this.label].jmolColor:a&&(e=b[this.label].pymolColor);return e}})(ChemDoodle.ELEMENT,ChemDoodle.extensions,ChemDoodle.math,ChemDoodle.structures,Math,ChemDoodle.lib.mat4);
(function(b,j,m,l,g,d,f){m.Bond=function(a,e,d){this.a1=a;this.a2=e;this.bondOrder=void 0!==d?d:1};m.Bond.STEREO_NONE="none";m.Bond.STEREO_PROTRUDING="protruding";m.Bond.STEREO_RECESSED="recessed";m.Bond.STEREO_AMBIGUOUS="ambiguous";b=m.Bond.prototype;b.stereo=m.Bond.STEREO_NONE;b.isHover=!1;b.ring=void 0;b.getCenter=function(){return new m.Point((this.a1.x+this.a2.x)/2,(this.a1.y+this.a2.y)/2)};b.getLength=function(){return this.a1.distance(this.a2)};b.getLength3D=function(){return this.a1.distance3D(this.a2)};
b.contains=function(a){return a===this.a1||a===this.a2};b.getNeighbor=function(a){if(a===this.a1)return this.a2;if(a===this.a2)return this.a1};b.draw=function(a,e){if(!(this.a1.x===this.a2.x&&this.a1.y===this.a2.y)){this.specs&&(e=this.specs);var d=this.a1.x,b=this.a2.x,f=this.a1.y,n=this.a2.y,y=this.a1.distance(this.a2),z=b-d,p=n-f;if(this.a1.isLassoed&&this.a2.isLassoed){var u=a.createLinearGradient(d,f,b,n);u.addColorStop(0,"rgba(212, 99, 0, 0)");u.addColorStop(0.5,"rgba(212, 99, 0, 0.8)");u.addColorStop(1,
"rgba(212, 99, 0, 0)");var r=2.5,v=this.a1.angle(this.a2)+g.PI/2,w=g.cos(v),v=g.sin(v),A=d-w*r,B=f+v*r,c=d+w*r,h=f-v*r,D=b+w*r,C=n-v*r,w=b-w*r,v=n+v*r;a.fillStyle=u;a.beginPath();a.moveTo(A,B);a.lineTo(c,h);a.lineTo(D,C);a.lineTo(w,v);a.closePath();a.fill()}if(e.atoms_display&&!e.atoms_circles_2D&&this.a1.isLabelVisible(e)&&this.a1.textBounds){r=w=0;for(A=this.a1.textBounds.length;r<A;r++)w=Math.max(w,l.calculateDistanceInterior(this.a1,this.a2,this.a1.textBounds[r]));w+=e.bonds_atomLabelBuffer_2D;
w/=y;d+=z*w;f+=p*w}if(e.atoms_display&&!e.atoms_circles_2D&&this.a2.isLabelVisible(e)&&this.a2.textBounds){r=w=0;for(A=this.a2.textBounds.length;r<A;r++)w=Math.max(w,l.calculateDistanceInterior(this.a2,this.a1,this.a2.textBounds[r]));w+=e.bonds_atomLabelBuffer_2D;w/=y;b-=z*w;n-=p*w}e.bonds_clearOverlaps_2D&&(w=d+0.15*z,v=f+0.15*p,r=b-0.15*z,y=n-0.15*p,a.strokeStyle=e.backgroundColor,a.lineWidth=e.bonds_width_2D+2*e.bonds_overlapClearWidth_2D,a.lineCap="round",a.beginPath(),a.moveTo(w,v),a.lineTo(r,
y),a.closePath(),a.stroke());a.strokeStyle=e.bonds_color;a.fillStyle=e.bonds_color;a.lineWidth=e.bonds_width_2D;a.lineCap=e.bonds_ends_2D;if(e.bonds_useJMOLColors||e.bonds_usePYMOLColors)w=a.createLinearGradient(d,f,b,n),v=this.a1.getElementColor(e.bonds_useJMOLColors,e.bonds_usePYMOLColors,e.atoms_color,2),r=this.a2.getElementColor(e.bonds_useJMOLColors,e.bonds_usePYMOLColors,e.atoms_color,2),w.addColorStop(0,v),e.bonds_colorGradient||(w.addColorStop(0.5,v),w.addColorStop(0.51,r)),w.addColorStop(1,
r),a.strokeStyle=w,a.fillStyle=w;if(e.bonds_lewisStyle_2D&&0===this.bondOrder%1)this.drawLewisStyle(a,e,d,f,b,n);else switch(this.bondOrder){case 0:b-=d;n-=f;b=g.sqrt(b*b+n*n);n=g.floor(b/e.bonds_dotSize_2D);b=(b-(n-1)*e.bonds_dotSize_2D)/2;1===n%2?b+=e.bonds_dotSize_2D/4:(b-=e.bonds_dotSize_2D/4,n+=2);n/=2;p=this.a1.angle(this.a2);w=d+b*Math.cos(p);v=f-b*Math.sin(p);a.beginPath();for(r=0;r<n;r++)a.arc(w,v,e.bonds_dotSize_2D/2,0,2*g.PI,!1),w+=2*e.bonds_dotSize_2D*Math.cos(p),v-=2*e.bonds_dotSize_2D*
Math.sin(p);a.fill();break;case 0.5:a.beginPath();a.moveTo(d,f);j.contextHashTo(a,d,f,b,n,e.bonds_hashSpacing_2D,e.bonds_hashSpacing_2D);a.stroke();break;case 1:if(this.stereo===m.Bond.STEREO_PROTRUDING||this.stereo===m.Bond.STEREO_RECESSED)p=e.bonds_width_2D/2,r=this.a1.distance(this.a2)*e.bonds_wedgeThickness_2D/2,v=this.a1.angle(this.a2)+g.PI/2,w=g.cos(v),v=g.sin(v),A=d-w*p,B=f+v*p,c=d+w*p,h=f-v*p,D=b+w*r,C=n-v*r,w=b-w*r,v=n+v*r,a.beginPath(),a.moveTo(A,B),a.lineTo(c,h),a.lineTo(D,C),a.lineTo(w,
v),a.closePath(),this.stereo===m.Bond.STEREO_PROTRUDING?a.fill():(a.save(),a.clip(),a.lineWidth=2*r,a.lineCap="butt",a.beginPath(),a.moveTo(d,f),j.contextHashTo(a,d,f,b,n,e.bonds_hashWidth_2D,e.bonds_hashSpacing_2D),a.stroke(),a.restore());else if(this.stereo===m.Bond.STEREO_AMBIGUOUS){a.beginPath();a.moveTo(d,f);b=g.floor(g.sqrt(z*z+p*p)/e.bonds_wavyLength_2D);v=this.a1.angle(this.a2)+g.PI/2;w=g.cos(v);v=g.sin(v);n=z/b;p/=b;r=0;for(A=b;r<A;r++)d+=n,f+=p,b=e.bonds_wavyLength_2D*w+d-0.5*n,y=e.bonds_wavyLength_2D*
-v+f-0.5*p,z=e.bonds_wavyLength_2D*-w+d-0.5*n,B=e.bonds_wavyLength_2D*v+f-0.5*p,0===r%2?a.quadraticCurveTo(b,y,d,f):a.quadraticCurveTo(z,B,d,f);a.stroke();break}else a.beginPath(),a.moveTo(d,f),a.lineTo(b,n),a.stroke();break;case 1.5:case 2:this.stereo===m.Bond.STEREO_AMBIGUOUS?(r=this.a1.distance(this.a2)*e.bonds_saturationWidth_2D/2,v=this.a1.angle(this.a2)+g.PI/2,w=g.cos(v),v=g.sin(v),A=d-w*r,B=f+v*r,c=d+w*r,h=f-v*r,D=b+w*r,C=n-v*r,w=b-w*r,v=n+v*r,a.beginPath(),a.moveTo(A,B),a.lineTo(D,C),a.moveTo(c,
h),a.lineTo(w,v),a.stroke()):!e.bonds_symmetrical_2D&&(this.ring||"C"===this.a1.label&&"C"===this.a2.label)?(a.beginPath(),a.moveTo(d,f),a.lineTo(b,n),w=0,y=this.a1.distance(this.a2),p=this.a1.angle(this.a2),v=p+g.PI/2,r=y*e.bonds_saturationWidth_2D,z=e.bonds_saturationAngle_2D,z<g.PI/2&&(w=-(r/g.tan(z))),g.abs(w)<y/2&&(z=d-g.cos(p)*w,d=b+g.cos(p)*w,b=f+g.sin(p)*w,f=n-g.sin(p)*w,w=g.cos(v),v=g.sin(v),A=z-w*r,B=b+v*r,c=z+w*r,h=b-v*r,D=d-w*r,C=f+v*r,w=d+w*r,v=f-v*r,!this.ring||this.ring.center.angle(this.a1)>
this.ring.center.angle(this.a2)&&!(this.ring.center.angle(this.a1)-this.ring.center.angle(this.a2)>g.PI)||this.ring.center.angle(this.a1)-this.ring.center.angle(this.a2)<-g.PI?(a.moveTo(A,B),2===this.bondOrder?a.lineTo(D,C):j.contextHashTo(a,A,B,D,C,e.bonds_hashSpacing_2D,e.bonds_hashSpacing_2D)):(a.moveTo(c,h),2===this.bondOrder?a.lineTo(w,v):j.contextHashTo(a,c,h,w,v,e.bonds_hashSpacing_2D,e.bonds_hashSpacing_2D)),a.stroke())):(r=this.a1.distance(this.a2)*e.bonds_saturationWidth_2D/2,v=this.a1.angle(this.a2)+
g.PI/2,w=g.cos(v),v=g.sin(v),A=d-w*r,B=f+v*r,c=d+w*r,h=f-v*r,D=b+w*r,C=n-v*r,w=b-w*r,v=n+v*r,a.beginPath(),a.moveTo(A,B),a.lineTo(w,v),a.moveTo(c,h),2===this.bondOrder?a.lineTo(D,C):j.contextHashTo(a,c,h,D,C,e.bonds_hashSpacing_2D,e.bonds_hashSpacing_2D),a.stroke());break;case 3:r=this.a1.distance(this.a2)*e.bonds_saturationWidth_2D,v=this.a1.angle(this.a2)+g.PI/2,w=g.cos(v),v=g.sin(v),A=d-w*r,B=f+v*r,c=d+w*r,h=f-v*r,D=b+w*r,C=n-v*r,w=b-w*r,v=n+v*r,a.beginPath(),a.moveTo(A,B),a.lineTo(w,v),a.moveTo(c,
h),a.lineTo(D,C),a.moveTo(d,f),a.lineTo(b,n),a.stroke()}}};b.drawDecorations=function(a){if(this.isHover||this.isSelected){var e=2*g.PI,d=(this.a1.angleForStupidCanvasArcs(this.a2)+g.PI/2)%e;a.strokeStyle=this.isHover?"#885110":"#0060B2";a.lineWidth=1.2;a.beginPath();var b=(d+g.PI)%e,b=b%(2*g.PI);a.arc(this.a1.x,this.a1.y,7,d,b,!1);a.stroke();a.beginPath();d+=g.PI;b=(d+g.PI)%e;a.arc(this.a2.x,this.a2.y,7,d,b,!1);a.stroke()}};b.drawLewisStyle=function(a,e,d,b,f,n){var j=this.a1.angle(this.a2),l=j+
g.PI/2;f-=d;n-=b;f=g.sqrt(f*f+n*n)/(this.bondOrder+1);n=f*g.cos(j);j=-f*g.sin(j);d+=n;b+=j;for(f=0;f<this.bondOrder;f++){var m=e.atoms_lonePairSpread_2D/2,u=d-g.cos(l)*m,r=b+g.sin(l)*m,v=d+g.cos(l)*m,m=b-g.sin(l)*m;a.beginPath();a.arc(u-e.atoms_lonePairDiameter_2D/2,r-e.atoms_lonePairDiameter_2D/2,e.atoms_lonePairDiameter_2D,0,2*g.PI,!1);a.fill();a.beginPath();a.arc(v-e.atoms_lonePairDiameter_2D/2,m-e.atoms_lonePairDiameter_2D/2,e.atoms_lonePairDiameter_2D,0,2*g.PI,!1);a.fill();d+=n;b+=j}};b.render=
function(a,e,b){this.specs&&(e=this.specs);var k=this.a1.distance3D(this.a2);if(0!==k){var q=e.bonds_cylinderDiameter_3D/2,n=e.bonds_color,l,m=d.translate(a.modelViewMatrix,[this.a1.x,this.a1.y,this.a1.z],[]),p,u=[this.a2.x-this.a1.x,this.a2.y-this.a1.y,this.a2.z-this.a1.z],r=[0,1,0],v=0;this.a1.x===this.a2.x&&this.a1.z===this.a2.z?(r=[0,0,1],this.a2.y<this.a1.y&&(v=g.PI)):(v=j.vec3AngleFrom(r,u),r=f.cross(r,u,[]));var w=e.bonds_useJMOLColors,A=e.bonds_usePYMOLColors;if(w||A)n=this.a1.getElementColor(w,
A,n),l=this.a2.getElementColor(w,A,e.bonds_color),n!=l&&(p=d.translate(a.modelViewMatrix,[this.a2.x,this.a2.y,this.a2.z],[]));var w=[0],B;if(b){e.bonds_showBondOrders_3D&&1<this.bondOrder&&(w=[e.bonds_cylinderDiameter_3D],B=[0,0,1],b=d.inverse(a.rotationMatrix,[]),d.multiplyVec3(b,B),B=f.cross(u,B,[]),f.normalize(B));var q=1,c=e.bonds_pillSpacing_3D,u=e.bonds_pillHeight_3D;0==this.bondOrder&&(e.bonds_renderAsLines_3D?u=c:(u=e.bonds_pillDiameter_3D,u<e.bonds_cylinderDiameter_3D&&(u/=2),q=u/2,k/=q,
c/=q/2));b=u+c;var A=g.floor(k/b),h=(c+e.bonds_pillDiameter_3D+(k-b*A))/2,D=A;p&&(D=g.floor(A/2));k=0;for(c=w.length;k<c;k++){var C=d.set(m,[]);0!==w[k]&&d.translate(C,f.scale(B,w[k],[]));0!==v&&d.rotate(C,v,r);1!=q&&d.scale(C,[q,q,q]);n&&a.material.setDiffuseColor(n);d.translate(C,[0,h,0]);for(var H=0;H<D;H++)e.bonds_renderAsLines_3D?0==this.bondOrder?(a.setMatrixUniforms(C),a.drawArrays(a.POINTS,0,1)):(d.scale(C,[1,u,1]),a.setMatrixUniforms(C),a.drawArrays(a.LINES,0,a.lineBuffer.vertexPositionBuffer.numItems),
d.scale(C,[1,1/u,1])):(a.setMatrixUniforms(C),0==this.bondOrder?a.drawElements(a.TRIANGLES,a.sphereBuffer.vertexIndexBuffer.numItems,a.UNSIGNED_SHORT,0):a.drawElements(a.TRIANGLES,a.pillBuffer.vertexIndexBuffer.numItems,a.UNSIGNED_SHORT,0)),d.translate(C,[0,b,0]);if(p){var F,G;e.bonds_renderAsLines_3D?(F=u,F/=2,G=0):(F=2/3,G=(1-F)/2);0!=A%2&&(d.scale(C,[1,F,1]),a.setMatrixUniforms(C),e.bonds_renderAsLines_3D?0==this.bondOrder?a.drawArrays(a.POINTS,0,1):a.drawArrays(a.LINES,0,a.lineBuffer.vertexPositionBuffer.numItems):
0==this.bondOrder?a.drawElements(a.TRIANGLES,a.sphereBuffer.vertexIndexBuffer.numItems,a.UNSIGNED_SHORT,0):a.drawElements(a.TRIANGLES,a.pillBuffer.vertexIndexBuffer.numItems,a.UNSIGNED_SHORT,0),d.translate(C,[0,b*(1+G),0]),d.scale(C,[1,1/F,1]));d.set(p,C);0!==w[k]&&d.translate(C,f.scale(B,w[k],[]));d.rotate(C,v+g.PI,r);1!=q&&d.scale(C,[q,q,q]);l&&a.material.setDiffuseColor(l);d.translate(C,[0,h,0]);for(H=0;H<D;H++)e.bonds_renderAsLines_3D?0==this.bondOrder?(a.setMatrixUniforms(C),a.drawArrays(a.POINTS,
0,1)):(d.scale(C,[1,u,1]),a.setMatrixUniforms(C),a.drawArrays(a.LINES,0,a.lineBuffer.vertexPositionBuffer.numItems),d.scale(C,[1,1/u,1])):(a.setMatrixUniforms(C),0==this.bondOrder?a.drawElements(a.TRIANGLES,a.sphereBuffer.vertexIndexBuffer.numItems,a.UNSIGNED_SHORT,0):a.drawElements(a.TRIANGLES,a.pillBuffer.vertexIndexBuffer.numItems,a.UNSIGNED_SHORT,0)),d.translate(C,[0,b,0]);0!=A%2&&(d.scale(C,[1,F,1]),a.setMatrixUniforms(C),e.bonds_renderAsLines_3D?0==this.bondOrder?a.drawArrays(a.POINTS,0,1):
a.drawArrays(a.LINES,0,a.lineBuffer.vertexPositionBuffer.numItems):0==this.bondOrder?a.drawElements(a.TRIANGLES,a.sphereBuffer.vertexIndexBuffer.numItems,a.UNSIGNED_SHORT,0):a.drawElements(a.TRIANGLES,a.pillBuffer.vertexIndexBuffer.numItems,a.UNSIGNED_SHORT,0),d.translate(C,[0,b*(1+G),0]),d.scale(C,[1,1/F,1]))}}}else{if(e.bonds_showBondOrders_3D){switch(this.bondOrder){case 1.5:w=[-e.bonds_cylinderDiameter_3D];break;case 2:w=[-e.bonds_cylinderDiameter_3D,e.bonds_cylinderDiameter_3D];break;case 3:w=
[-1.2*e.bonds_cylinderDiameter_3D,0,1.2*e.bonds_cylinderDiameter_3D]}1<this.bondOrder&&(B=[0,0,1],b=d.inverse(a.rotationMatrix,[]),d.multiplyVec3(b,B),B=f.cross(u,B,[]),f.normalize(B))}else switch(this.bondOrder){case 0:q*=0.25;break;case 0.5:case 1.5:q*=0.5}p&&(k/=2);q=[q,k,q];k=0;for(c=w.length;k<c;k++)C=d.set(m,[]),0!==w[k]&&d.translate(C,f.scale(B,w[k],[])),0!==v&&d.rotate(C,v,r),d.scale(C,q),n&&a.material.setDiffuseColor(n),a.setMatrixUniforms(C),e.bonds_renderAsLines_3D?a.drawArrays(a.LINES,
0,a.lineBuffer.vertexPositionBuffer.numItems):a.drawArrays(a.TRIANGLE_STRIP,0,a.cylinderBuffer.vertexPositionBuffer.numItems),p&&(d.set(p,C),0!==w[k]&&d.translate(C,f.scale(B,w[k],[])),d.rotate(C,v+g.PI,r),d.scale(C,q),l&&a.material.setDiffuseColor(l),a.setMatrixUniforms(C),e.bonds_renderAsLines_3D?a.drawArrays(a.LINES,0,a.lineBuffer.vertexPositionBuffer.numItems):a.drawArrays(a.TRIANGLE_STRIP,0,a.cylinderBuffer.vertexPositionBuffer.numItems))}}};b.renderHighlight=function(a,e){if(this.isSelected||
this.isHover){this.specs&&(e=this.specs);this.specs&&(e=this.specs);var b=this.a1.distance3D(this.a2);if(0!==b){var k=e.bonds_cylinderDiameter_3D/1.2,q=d.translate(a.modelViewMatrix,[this.a1.x,this.a1.y,this.a1.z],[]),n=[this.a2.x-this.a1.x,this.a2.y-this.a1.y,this.a2.z-this.a1.z],l=[0,1,0],m=0;this.a1.x===this.a2.x&&this.a1.z===this.a2.z?(n=[0,0,1],this.a2.y<this.a1.y&&(m=g.PI)):(m=j.vec3AngleFrom(l,n),n=f.cross(l,n,[]));b=[k,b,k];0!==m&&d.rotate(q,m,n);d.scale(q,b);a.setMatrixUniforms(q);a.material.setDiffuseColor(this.isHover?
"#885110":"#0060B2");a.drawArrays(a.TRIANGLE_STRIP,0,a.cylinderBuffer.vertexPositionBuffer.numItems)}}};b.renderPicker=function(a,e){this.specs&&(e=this.specs);var b=this.a1.distance3D(this.a2);if(0!==b){var k=e.bonds_cylinderDiameter_3D/2,q=d.translate(a.modelViewMatrix,[this.a1.x,this.a1.y,this.a1.z],[]),n=[this.a2.x-this.a1.x,this.a2.y-this.a1.y,this.a2.z-this.a1.z],l=[0,1,0],m=0;this.a1.x===this.a2.x&&this.a1.z===this.a2.z?(l=[0,0,1],this.a2.y<this.a1.y&&(m=g.PI)):(m=j.vec3AngleFrom(l,n),l=f.cross(l,
n,[]));var p=[0],u;if(e.bonds_showBondOrders_3D)if(e.bonds_renderAsLines_3D){switch(this.bondOrder){case 1.5:case 2:p=[-e.bonds_cylinderDiameter_3D,e.bonds_cylinderDiameter_3D];break;case 3:p=[-1.2*e.bonds_cylinderDiameter_3D,0,1.2*e.bonds_cylinderDiameter_3D]}if(1<this.bondOrder){u=[0,0,1];var r=d.inverse(a.rotationMatrix,[]);d.multiplyVec3(r,u);u=f.cross(n,u,[]);f.normalize(u)}}else switch(this.bondOrder){case 1.5:case 2:k*=3;break;case 3:k*=3.4}else switch(this.bondOrder){case 0:k*=0.25;break;
case 0.5:case 1.5:k*=0.5}b=[k,b,k];k=0;for(n=p.length;k<n;k++)r=d.set(q,[]),0!==p[k]&&d.translate(r,f.scale(u,p[k],[])),0!==m&&d.rotate(r,m,l),d.scale(r,b),a.setMatrixUniforms(r),e.bonds_renderAsLines_3D?a.drawArrays(a.LINES,0,a.lineBuffer.vertexPositionBuffer.numItems):a.drawArrays(a.TRIANGLE_STRIP,0,a.cylinderBuffer.vertexPositionBuffer.numItems)}}})(ChemDoodle.ELEMENT,ChemDoodle.extensions,ChemDoodle.structures,ChemDoodle.math,Math,ChemDoodle.lib.mat4,ChemDoodle.lib.vec3);
(function(b,j){b.Ring=function(){this.atoms=[];this.bonds=[]};var m=b.Ring.prototype;m.center=void 0;m.setupBonds=function(){for(var b=0,g=this.bonds.length;b<g;b++)this.bonds[b].ring=this;this.center=this.getCenter()};m.getCenter=function(){for(var l=Infinity,g=Infinity,d=-Infinity,f=-Infinity,a=0,e=this.atoms.length;a<e;a++)l=j.min(this.atoms[a].x,l),g=j.min(this.atoms[a].y,g),d=j.max(this.atoms[a].x,d),f=j.max(this.atoms[a].y,f);return new b.Point((d+l)/2,(f+g)/2)}})(ChemDoodle.structures,Math);
(function(b,j,m,l,g){m.Molecule=function(){this.atoms=[];this.bonds=[];this.rings=[]};var d=m.Molecule.prototype;d.findRings=!0;d.draw=function(d,a){this.specs&&(a=this.specs);if(a.atoms_display&&!a.atoms_circles_2D)for(var e=0,b=this.atoms.length;e<b;e++)this.atoms[e].draw(d,a);if(a.bonds_display){e=0;for(b=this.bonds.length;e<b;e++)this.bonds[e].draw(d,a)}if(a.atoms_display&&a.atoms_circles_2D){e=0;for(b=this.atoms.length;e<b;e++)this.atoms[e].draw(d,a)}};d.render=function(d,a){this.specs&&(a=this.specs);
var e=0<this.atoms.length&&void 0!==this.atoms[0].hetatm;if(e){if(a.macro_displayBonds){0<this.bonds.length&&(a.bonds_renderAsLines_3D&&!this.residueSpecs||this.residueSpecs&&this.residueSpecs.bonds_renderAsLines_3D?(d.lineWidth(this.residueSpecs?this.residueSpecs.bonds_width_2D:a.bonds_width_2D),d.lineBuffer.bindBuffers(d)):d.cylinderBuffer.bindBuffers(d),d.material.setTempColors(a.bonds_materialAmbientColor_3D,void 0,a.bonds_materialSpecularColor_3D,a.bonds_materialShininess_3D));for(var b=0,k=
this.bonds.length;b<k;b++){var g=this.bonds[b];if(!g.a1.hetatm&&(-1===a.macro_atomToLigandDistance||void 0!==g.a1.closestDistance&&a.macro_atomToLigandDistance>=g.a1.closestDistance&&a.macro_atomToLigandDistance>=g.a2.closestDistance))g.render(d,this.residueSpecs?this.residueSpecs:a)}}if(a.macro_displayAtoms){0<this.atoms.length&&(d.sphereBuffer.bindBuffers(d),d.material.setTempColors(a.atoms_materialAmbientColor_3D,void 0,a.atoms_materialSpecularColor_3D,a.atoms_materialShininess_3D));b=0;for(k=
this.atoms.length;b<k;b++)if(g=this.atoms[b],!g.hetatm&&(-1===a.macro_atomToLigandDistance||void 0!==g.closestDistance&&a.macro_atomToLigandDistance>=g.closestDistance))g.render(d,this.residueSpecs?this.residueSpecs:a)}}if(a.bonds_display){var n=[],y=[];0<this.bonds.length&&(a.bonds_renderAsLines_3D?(d.lineWidth(a.bonds_width_2D),d.lineBuffer.bindBuffers(d)):d.cylinderBuffer.bindBuffers(d),d.material.setTempColors(a.bonds_materialAmbientColor_3D,void 0,a.bonds_materialSpecularColor_3D,a.bonds_materialShininess_3D));
b=0;for(k=this.bonds.length;b<k;b++)if(g=this.bonds[b],!e||g.a1.hetatm)a.bonds_showBondOrders_3D?0==g.bondOrder?y.push(g):0.5==g.bondOrder?n.push(g):(1.5==g.bondOrder&&n.push(g),g.render(d,a)):g.render(d,a);if(0<n.length){a.bonds_renderAsLines_3D||d.pillBuffer.bindBuffers(d);b=0;for(k=n.length;b<k;b++)n[b].render(d,a,!0)}if(0<y.length){a.bonds_renderAsLines_3D||d.sphereBuffer.bindBuffers(d);b=0;for(k=y.length;b<k;b++)y[b].render(d,a,!0)}}if(a.atoms_display){b=0;for(k=this.atoms.length;b<k;b++)g=this.atoms[b],
g.bondNumber=0,g.renderAsStar=!1;b=0;for(k=this.bonds.length;b<k;b++)g=this.bonds[b],g.a1.bondNumber++,g.a2.bondNumber++;0<this.atoms.length&&(d.sphereBuffer.bindBuffers(d),d.material.setTempColors(a.atoms_materialAmbientColor_3D,void 0,a.atoms_materialSpecularColor_3D,a.atoms_materialShininess_3D));n=[];b=0;for(k=this.atoms.length;b<k;b++)if(g=this.atoms[b],!e||g.hetatm&&(a.macro_showWater||!g.isWater))a.atoms_nonBondedAsStars_3D&&0===g.bondNumber?(g.renderAsStar=!0,n.push(g)):g.render(d,a);if(0<
n.length){d.starBuffer.bindBuffers(d);b=0;for(k=n.length;b<k;b++)n[b].render(d,a)}}if(this.chains){d.setMatrixUniforms(d.modelViewMatrix);if(a.proteins_displayRibbon){d.material.setTempColors(a.proteins_materialAmbientColor_3D,void 0,a.proteins_materialSpecularColor_3D,a.proteins_materialShininess_3D);e=0;for(n=this.ribbons.length;e<n;e++)if(g=a.proteins_ribbonCartoonize?this.cartoons[e]:this.ribbons[e],"none"!==a.proteins_residueColor){g.front.bindBuffers(d);y="rainbow"===a.proteins_residueColor;
b=0;for(k=g.front.segments.length;b<k;b++)y&&d.material.setDiffuseColor(j.rainbowAt(b,k,a.macro_rainbowColors)),g.front.segments[b].render(d,a);g.back.bindBuffers(d);b=0;for(k=g.back.segments.length;b<k;b++)y&&d.material.setDiffuseColor(j.rainbowAt(b,k,a.macro_rainbowColors)),g.back.segments[b].render(d,a)}else if(a.proteins_ribbonCartoonize){g.front.bindBuffers(d);b=0;for(k=g.front.cartoonSegments.length;b<k;b++)g.front.cartoonSegments[b].render(d,a);g.back.bindBuffers(d);b=0;for(k=g.back.cartoonSegments.length;b<
k;b++)g.back.cartoonSegments[b].render(d,a)}else g.front.render(d,a),g.back.render(d,a)}if(a.proteins_displayBackbone){if(!this.alphaCarbonTrace){this.alphaCarbonTrace={nodes:[],edges:[]};e=0;for(n=this.chains.length;e<n;e++)if(y=this.chains[e],!(2<y.length&&l[y[2].name]&&"#BEA06E"===l[y[2].name].aminoColor)&&0<y.length){b=1;for(k=y.length-2;b<k;b++)g=y[b].cp1,g.chainColor=y.chainColor,this.alphaCarbonTrace.nodes.push(g),g=new m.Bond(y[b].cp1,y[b+1].cp1),g.residueName=y[b].name,g.chainColor=y.chainColor,
this.alphaCarbonTrace.edges.push(g),b===y.length-3&&(g=y[b+1].cp1,g.chainColor=y.chainColor,this.alphaCarbonTrace.nodes.push(g))}}if(0<this.alphaCarbonTrace.nodes.length){e=new m.VisualSpecifications;e.atoms_display=!0;e.bonds_display=!0;e.atoms_sphereDiameter_3D=a.proteins_backboneThickness;e.bonds_cylinderDiameter_3D=a.proteins_backboneThickness;e.bonds_useJMOLColors=!1;e.atoms_color=a.proteins_backboneColor;e.bonds_color=a.proteins_backboneColor;e.atoms_useVDWDiameters_3D=!1;d.material.setTempColors(a.proteins_materialAmbientColor_3D,
void 0,a.proteins_materialSpecularColor_3D,a.proteins_materialShininess_3D);d.material.setDiffuseColor(a.proteins_backboneColor);b=0;for(k=this.alphaCarbonTrace.nodes.length;b<k;b++)g=this.alphaCarbonTrace.nodes[b],a.macro_colorByChain&&(e.atoms_color=g.chainColor),d.sphereBuffer.bindBuffers(d),g.render(d,e);b=0;for(k=this.alphaCarbonTrace.edges.length;b<k;b++){var g=this.alphaCarbonTrace.edges[b],z,n=l[g.residueName]?l[g.residueName]:l["*"];a.macro_colorByChain?z=g.chainColor:"shapely"===a.proteins_residueColor?
z=n.shapelyColor:"amino"===a.proteins_residueColor?z=n.aminoColor:"polarity"===a.proteins_residueColor?z=n.polar?"#C10000":"#FFFFFF":"acidity"===a.proteins_residueColor?z=1===n.acidity?"#0000FF":-1===n.acidity?"#FF0000":n.polar?"#FFFFFF":"#773300":"rainbow"===a.proteins_residueColor&&(z=j.rainbowAt(b,k,a.macro_rainbowColors));z&&(e.bonds_color=z);d.cylinderBuffer.bindBuffers(d);g.render(d,e)}}}if(a.nucleics_display){d.material.setTempColors(a.nucleics_materialAmbientColor_3D,void 0,a.nucleics_materialSpecularColor_3D,
a.nucleics_materialShininess_3D);e=0;for(n=this.tubes.length;e<n;e++)d.setMatrixUniforms(d.modelViewMatrix),g=this.tubes[e],g.render(d,a)}}a.crystals_displayUnitCell&&this.unitCell&&(d.setMatrixUniforms(d.modelViewMatrix),this.unitCell.bindBuffers(d),d.material.setDiffuseColor(a.crystals_unitCellColor),d.lineWidth(a.crystals_unitCellLineWidth),d.drawElements(d.LINES,this.unitCell.vertexIndexBuffer.numItems,d.UNSIGNED_SHORT,0));if(a.atoms_display){z=!1;b=0;for(k=this.atoms.length;b<k;b++)if(g=this.atoms[b],
g.isHover||g.isSelected){z=!0;break}if(!z){b=0;for(k=this.bonds.length;b<k;b++)if(g=this.bonds[b],g.isHover||g.isSelected){z=!0;break}}if(z){d.sphereBuffer.bindBuffers(d);d.blendFunc(d.SRC_ALPHA,d.ONE);d.material.setTempColors(a.atoms_materialAmbientColor_3D,void 0,"#000000",0);d.enable(d.BLEND);d.depthMask(!1);d.material.setAlpha(0.4);d.sphereBuffer.bindBuffers(d);b=0;for(k=this.atoms.length;b<k;b++)g=this.atoms[b],(g.isHover||g.isSelected)&&g.renderHighlight(d,a);d.cylinderBuffer.bindBuffers(d);
b=0;for(k=this.bonds.length;b<k;b++)g=this.bonds[b],(g.isHover||g.isSelected)&&g.renderHighlight(d,a);d.depthMask(!0);d.disable(d.BLEND);d.blendFuncSeparate(d.SRC_ALPHA,d.ONE_MINUS_SRC_ALPHA,d.ONE,d.ONE_MINUS_SRC_ALPHA)}}this.surface&&a.surfaces_display&&(d.setMatrixUniforms(d.modelViewMatrix),this.surface.bindBuffers(d),d.material.setTempColors(a.surfaces_materialAmbientColor_3D,a.surfaces_color,a.surfaces_materialSpecularColor_3D,a.surfaces_materialShininess_3D),"Dot"===a.surfaces_style?d.drawArrays(d.POINTS,
0,this.surface.vertexPositionBuffer.numItems):d.drawElements(d.TRIANGLES,this.surface.vertexIndexBuffer.numItems,d.UNSIGNED_SHORT,0))};d.renderPickFrame=function(d,a,e){this.specs&&(a=this.specs);var b=0<this.atoms.length&&void 0!==this.atoms[0].hetatm;if(a.bonds_display){0<this.bonds.length&&(a.bonds_renderAsLines_3D?(d.lineWidth(a.bonds_width_2D),d.lineBuffer.bindBuffers(d)):d.cylinderBuffer.bindBuffers(d));for(var g=0,l=this.bonds.length;g<l;g++){var n=this.bonds[g];if(!b||n.a1.hetatm)d.material.setDiffuseColor(j.idx2color(e.length)),
n.renderPicker(d,a),e.push(n)}}if(a.atoms_display){g=0;for(l=this.atoms.length;g<l;g++)n=this.atoms[g],n.bondNumber=0,n.renderAsStar=!1;g=0;for(l=this.bonds.length;g<l;g++)n=this.bonds[g],n.a1.bondNumber++,n.a2.bondNumber++;0<this.atoms.length&&d.sphereBuffer.bindBuffers(d);for(var m=[],g=0,l=this.atoms.length;g<l;g++)if(n=this.atoms[g],!b||n.hetatm&&(a.macro_showWater||!n.isWater))a.atoms_nonBondedAsStars_3D&&0===n.bondNumber?(n.renderAsStar=!0,m.push(n)):(d.material.setDiffuseColor(j.idx2color(e.length)),
n.render(d,a,!0),e.push(n));if(0<m.length){d.starBuffer.bindBuffers(d);g=0;for(l=m.length;g<l;g++)n=m[g],d.material.setDiffuseColor(j.idx2color(e.length)),n.render(d,a,!0),e.push(n)}}};d.getCenter3D=function(){if(1===this.atoms.length)return new m.Atom("C",this.atoms[0].x,this.atoms[0].y,this.atoms[0].z);var d=Infinity,a=Infinity,e=Infinity,b=-Infinity,k=-Infinity,j=-Infinity;if(this.chains)for(var n=0,l=this.chains.length;n<l;n++)for(var z=this.chains[n],p=0,u=z.length;p<u;p++)var r=z[p],d=g.min(r.cp1.x,
r.cp2.x,d),a=g.min(r.cp1.y,r.cp2.y,a),e=g.min(r.cp1.z,r.cp2.z,e),b=g.max(r.cp1.x,r.cp2.x,b),k=g.max(r.cp1.y,r.cp2.y,k),j=g.max(r.cp1.z,r.cp2.z,j);n=0;for(l=this.atoms.length;n<l;n++)d=g.min(this.atoms[n].x,d),a=g.min(this.atoms[n].y,a),e=g.min(this.atoms[n].z,e),b=g.max(this.atoms[n].x,b),k=g.max(this.atoms[n].y,k),j=g.max(this.atoms[n].z,j);return new m.Atom("C",(b+d)/2,(k+a)/2,(j+e)/2)};d.getCenter=function(){if(1===this.atoms.length)return new m.Point(this.atoms[0].x,this.atoms[0].y);for(var d=
Infinity,a=Infinity,e=-Infinity,b=-Infinity,k=0,j=this.atoms.length;k<j;k++)d=g.min(this.atoms[k].x,d),a=g.min(this.atoms[k].y,a),e=g.max(this.atoms[k].x,e),b=g.max(this.atoms[k].y,b);return new m.Point((e+d)/2,(b+a)/2)};d.getDimension=function(){if(1===this.atoms.length)return new m.Point(0,0);var d=Infinity,a=Infinity,e=-Infinity,b=-Infinity;if(this.chains){for(var k=0,j=this.chains.length;k<j;k++)for(var n=this.chains[k],l=0,z=n.length;l<z;l++)var p=n[l],d=g.min(p.cp1.x,p.cp2.x,d),a=g.min(p.cp1.y,
p.cp2.y,a),e=g.max(p.cp1.x,p.cp2.x,e),b=g.max(p.cp1.y,p.cp2.y,b);d-=30;a-=30;e+=30;b+=30}k=0;for(j=this.atoms.length;k<j;k++)d=g.min(this.atoms[k].x,d),a=g.min(this.atoms[k].y,a),e=g.max(this.atoms[k].x,e),b=g.max(this.atoms[k].y,b);return new m.Point(e-d,b-a)};d.check=function(d){if(d&&this.doChecks){if(this.findRings)if(this.bonds.length-this.atoms.length!==this.fjNumCache){this.rings=(new b.informatics.SSSRFinder(this)).rings;for(var a=0,e=this.bonds.length;a<e;a++)this.bonds[a].ring=void 0;a=
0;for(e=this.rings.length;a<e;a++)this.rings[a].setupBonds()}else{a=0;for(e=this.rings.length;a<e;a++){var g=this.rings[a];g.center=g.getCenter()}}a=0;for(e=this.atoms.length;a<e;a++)if(this.atoms[a].isLone=!1,"C"===this.atoms[a].label){for(var k=g=0,j=this.bonds.length;k<j;k++)(this.bonds[k].a1===this.atoms[a]||this.bonds[k].a2===this.atoms[a])&&g++;0===g&&(this.atoms[a].isLone=!0)}g=!1;a=0;for(e=this.atoms.length;a<e;a++)0!==this.atoms[a].z&&(g=!0);g&&(this.sortAtomsByZ(),this.sortBondsByZ());this.setupMetaData();
this.atomNumCache=this.atoms.length;this.bondNumCache=this.bonds.length;this.fjNumCache=this.bonds.length-this.atoms.length}this.doChecks=!d};d.getAngles=function(d){for(var a=[],e=0,b=this.bonds.length;e<b;e++)this.bonds[e].contains(d)&&a.push(d.angle(this.bonds[e].getNeighbor(d)));a.sort();return a};d.getCoordinationNumber=function(d){for(var a=0,e=0,b=d.length;e<b;e++)a+=d[e].bondOrder;return a};d.getBonds=function(d){for(var a=[],e=0,b=this.bonds.length;e<b;e++)this.bonds[e].contains(d)&&a.push(this.bonds[e]);
return a};d.sortAtomsByZ=function(){for(var d=1,a=this.atoms.length;d<a;d++)for(var e=d;0<e&&this.atoms[e].z<this.atoms[e-1].z;){var b=this.atoms[e];this.atoms[e]=this.atoms[e-1];this.atoms[e-1]=b;e--}};d.sortBondsByZ=function(){for(var d=1,a=this.bonds.length;d<a;d++)for(var e=d;0<e&&this.bonds[e].a1.z+this.bonds[e].a2.z<this.bonds[e-1].a1.z+this.bonds[e-1].a2.z;){var b=this.bonds[e];this.bonds[e]=this.bonds[e-1];this.bonds[e-1]=b;e--}};d.setupMetaData=function(){for(var d=this.getCenter(),a=0,e=
this.atoms.length;a<e;a++){var b=this.atoms[a];b.bonds=this.getBonds(b);b.angles=this.getAngles(b);b.isHidden=2===b.bonds.length&&g.abs(g.abs(b.angles[1]-b.angles[0])-g.PI)<g.PI/30&&b.bonds[0].bondOrder===b.bonds[1].bondOrder;var k=j.angleBetweenLargest(b.angles);b.angleOfLeastInterference=k.angle%(2*g.PI);b.largestAngle=k.largest;b.coordinationNumber=this.getCoordinationNumber(b.bonds);b.bondNumber=b.bonds.length;b.molCenter=d}a=0;for(e=this.bonds.length;a<e;a++)this.bonds[a].molCenter=d};d.scaleToAverageBondLength=
function(d){var a=this.getAverageBondLength();if(0!==a){d/=a;for(var a=0,e=this.atoms.length;a<e;a++)this.atoms[a].x*=d,this.atoms[a].y*=d}};d.getAverageBondLength=function(){if(0===this.bonds.length)return 0;for(var d=0,a=0,e=this.bonds.length;a<e;a++)d+=this.bonds[a].getLength();return d/=this.bonds.length};d.getBounds=function(){for(var d=new j.Bounds,a=0,e=this.atoms.length;a<e;a++)d.expand(this.atoms[a].getBounds());if(this.chains){a=0;for(e=this.chains.length;a<e;a++)for(var b=this.chains[a],
g=0,l=b.length;g<l;g++){var n=b[g];d.expand(n.cp1.x,n.cp1.y);d.expand(n.cp2.x,n.cp2.y)}d.minX-=30;d.minY-=30;d.maxX+=30;d.maxY+=30}return d};d.getBounds3D=function(){for(var d=new j.Bounds,a=0,e=this.atoms.length;a<e;a++)d.expand(this.atoms[a].getBounds3D());if(this.chains){a=0;for(e=this.chains.length;a<e;a++)for(var b=this.chains[a],g=0,l=b.length;g<l;g++){var n=b[g];d.expand3D(n.cp1.x,n.cp1.y,n.cp1.z);d.expand3D(n.cp2.x,n.cp2.y,n.cp2.z)}}return d}})(ChemDoodle,ChemDoodle.math,ChemDoodle.structures,
ChemDoodle.RESIDUE,Math);
(function(b,j,m,l){var g,d=-1;b.Residue=function(a){this.resSeq=a};var f=b.Residue.prototype;f.setup=function(a,e){this.horizontalResolution=e;var d=[a.x-this.cp1.x,a.y-this.cp1.y,a.z-this.cp1.z],f=l.cross(d,[this.cp2.x-this.cp1.x,this.cp2.y-this.cp1.y,this.cp2.z-this.cp1.z],[]);this.D=l.cross(f,d,[]);l.normalize(f);l.normalize(this.D);this.guidePointsSmall=[];this.guidePointsLarge=[];d=[(a.x+this.cp1.x)/2,(a.y+this.cp1.y)/2,(a.z+this.cp1.z)/2];this.helix&&(l.scale(f,1.5),l.add(d,f));this.guidePointsSmall[0]=
new b.Atom("",d[0]-this.D[0]/2,d[1]-this.D[1]/2,d[2]-this.D[2]/2);for(f=1;f<e;f++)this.guidePointsSmall[f]=new b.Atom("",this.guidePointsSmall[0].x+this.D[0]*f/e,this.guidePointsSmall[0].y+this.D[1]*f/e,this.guidePointsSmall[0].z+this.D[2]*f/e);l.scale(this.D,4);this.guidePointsLarge[0]=new b.Atom("",d[0]-this.D[0]/2,d[1]-this.D[1]/2,d[2]-this.D[2]/2);for(f=1;f<e;f++)this.guidePointsLarge[f]=new b.Atom("",this.guidePointsLarge[0].x+this.D[0]*f/e,this.guidePointsLarge[0].y+this.D[1]*f/e,this.guidePointsLarge[0].z+
this.D[2]*f/e)};f.getGuidePointSet=function(a){if(0===a)return this.helix||this.sheet?this.guidePointsLarge:this.guidePointsSmall;if(1===a)return this.guidePointsSmall;if(2===a)return this.guidePointsLarge};f.computeLineSegments=function(a,e,b,f,j){if(j!==d){var n=j*j,l=j*j*j;g=m.multiply([-1/6,0.5,-0.5,1/6,0.5,-1,0.5,0,-0.5,0,0.5,0,1/6,2/3,1/6,0],[6/l,0,0,0,6/l,2/n,0,0,1/l,1/n,1/j,0,0,0,0,1],[]);d=j}this.split=e.helix!==this.helix||e.sheet!==this.sheet;this.lineSegments=this.innerCompute(0,a,e,b,
!1,j);f&&(this.lineSegmentsCartoon=this.innerCompute(e.helix||e.sheet?2:1,a,e,b,!0,j))};f.innerCompute=function(a,e,d,f,q,n){var y=[],z=this.getGuidePointSet(a);e=e.getGuidePointSet(a);d=d.getGuidePointSet(a);for(var p=f.getGuidePointSet(a),u=0,r=this.guidePointsLarge.length;u<r;u++){for(var v=m.multiply([e[u].x,e[u].y,e[u].z,1,z[u].x,z[u].y,z[u].z,1,d[u].x,d[u].y,d[u].z,1,p[u].x,p[u].y,p[u].z,1],g,[]),w=[],A=0;A<n;A++){for(a=3;0<a;a--)for(f=0;4>f;f++)v[4*a+f]+=v[4*(a-1)+f];w[A]=new b.Atom("",v[12]/
v[15],v[13]/v[15],v[14]/v[15])}y[u]=w}if(q&&this.arrow)for(a=0;a<n;a++){q=1.5-1.3*a/n;z=j.floor(this.horizontalResolution/2);e=y[z];f=0;for(d=y.length;f<d;f++)f!==z&&(p=e[a],u=y[f][a],r=[u.x-p.x,u.y-p.y,u.z-p.z],l.scale(r,q),u.x=p.x+r[0],u.y=p.y+r[1],u.z=p.z+r[2])}return y}})(ChemDoodle.structures,Math,ChemDoodle.lib.mat4,ChemDoodle.lib.vec3);
(function(b,j,m,l,g){j.Spectrum=function(){this.data=[];this.metadata=[];this.dataDisplay=[];this.memory={offsetTop:0,offsetLeft:0,offsetBottom:0,flipXAxis:!1,scale:1,width:0,height:0}};l=j.Spectrum.prototype;l.title=void 0;l.xUnit=void 0;l.yUnit=void 0;l.continuous=!0;l.integrationSensitivity=0.01;l.draw=function(d,f,a,e){this.specs&&(f=this.specs);var j=5,k=0,l=0;d.fillStyle=f.text_color;d.textAlign="center";d.textBaseline="alphabetic";d.font=b.getFontString(f.text_font_size,f.text_font_families);
this.xUnit&&(l+=f.text_font_size,d.fillText(this.xUnit,a/2,e-2));this.yUnit&&f.plots_showYAxis&&(k+=f.text_font_size,d.save(),d.translate(f.text_font_size,e/2),d.rotate(-g.PI/2),d.fillText(this.yUnit,0,0),d.restore());this.title&&(j+=f.text_font_size,d.fillText(this.title,a/2,f.text_font_size));l+=5+f.text_font_size;f.plots_showYAxis&&(k+=5+d.measureText("1000").width);f.plots_showGrid&&(d.strokeStyle=f.plots_gridColor,d.lineWidth=f.plots_gridLineWidth,d.strokeRect(k,j,a-k,e-l-j));d.textAlign="center";
d.textBaseline="top";for(var n=this.maxX-this.minX,m=n/100,z=0.001;z<m||25<n/z;)z*=10;for(var p=0,u=f.plots_flipXAxis?a:0,n=g.round(this.minX/z)*z;n<=this.maxX;n+=z/2){var r=this.getTransformedX(n,f,a,k);if(r>k)if(d.strokeStyle="black",d.lineWidth=1,0===p%2){d.beginPath();d.moveTo(r,e-l);d.lineTo(r,e-l+2);d.stroke();for(m=n.toFixed(5);"0"===m.charAt(m.length-1);)m=m.substring(0,m.length-1);"."===m.charAt(m.length-1)&&(m=m.substring(0,m.length-1));var v=d.measureText(m).width;f.plots_flipXAxis&&(v*=
-1);var w=r-v/2;if(f.plots_flipXAxis?w<u:w>u)d.fillText(m,r,e-l+2),u=r+v/2;f.plots_showGrid&&(d.strokeStyle=f.plots_gridColor,d.lineWidth=f.plots_gridLineWidth,d.beginPath(),d.moveTo(r,e-l),d.lineTo(r,j),d.stroke())}else d.beginPath(),d.moveTo(r,e-l),d.lineTo(r,e-l+2),d.stroke();p++}if(f.plots_showYAxis||f.plots_showGrid){z=1/f.scale;d.textAlign="right";d.textBaseline="middle";for(n=0;10>=n;n++)if(m=z/10*n,p=j+(e-l-j)*(1-m*f.scale),f.plots_showGrid&&(d.strokeStyle=f.plots_gridColor,d.lineWidth=f.plots_gridLineWidth,
d.beginPath(),d.moveTo(k,p),d.lineTo(a,p),d.stroke()),f.plots_showYAxis){d.strokeStyle="black";d.lineWidth=1;d.beginPath();d.moveTo(k,p);d.lineTo(k-3,p);d.stroke();m*=100;u=g.max(0,3-g.floor(m).toString().length);m=m.toFixed(u);if(0<u)for(;"0"===m.charAt(m.length-1);)m=m.substring(0,m.length-1);"."===m.charAt(m.length-1)&&(m=m.substring(0,m.length-1));d.fillText(m,k-3,p)}}d.strokeStyle="black";d.lineWidth=1;d.beginPath();d.moveTo(a,e-l);d.lineTo(k,e-l);f.plots_showYAxis&&d.lineTo(k,j);d.stroke();
if(0<this.dataDisplay.length){d.textAlign="left";d.textBaseline="top";n=m=0;for(z=this.dataDisplay.length;n<z;n++)if(this.dataDisplay[n].value)d.fillText([this.dataDisplay[n].display,": ",this.dataDisplay[n].value].join(""),k+10,j+10+m*(f.text_font_size+5)),m++;else if(this.dataDisplay[n].tag){p=0;for(u=this.metadata.length;p<u;p++)if(b.stringStartsWith(this.metadata[p],this.dataDisplay[n].tag)){u=this.metadata[p];this.dataDisplay[n].display&&(u=this.metadata[p].indexOf("\x3d"),u=[this.dataDisplay[n].display,
": ",-1<u?this.metadata[p].substring(u+2):this.metadata[p]].join(""));d.fillText(u,k+10,j+10+m*(f.text_font_size+5));m++;break}}}this.drawPlot(d,f,a,e,j,k,l);this.memory.offsetTop=j;this.memory.offsetLeft=k;this.memory.offsetBottom=l;this.memory.flipXAxis=f.plots_flipXAxis;this.memory.scale=f.scale;this.memory.width=a;this.memory.height=e};l.drawPlot=function(d,b,a,e,l,k,q){this.specs&&(b=this.specs);d.strokeStyle=b.plots_color;d.lineWidth=b.plots_width;var n=[];d.beginPath();if(this.continuous)for(var m=
!1,z=0,p=!1,u=0,r=this.data.length;u<r;u++){var v=this.getTransformedX(this.data[u].x,b,a,k),w;u<r&&!m&&(w=this.getTransformedX(this.data[u+1].x,b,a,k));if(v>=k&&v<a||void 0!==w&&w>=k&&w<a){var A=this.getTransformedY(this.data[u].y,b,e,q,l);b.plots_showIntegration&&g.abs(this.data[u].y)>this.integrationSensitivity&&n.push(new j.Point(this.data[u].x,this.data[u].y));m||(d.moveTo(v,A),m=!0);d.lineTo(v,A);z++;0===z%1E3&&(d.stroke(),d.beginPath(),d.moveTo(v,A));if(p)break}else m&&(p=!0)}else{u=0;for(r=
this.data.length;u<r;u++)v=this.getTransformedX(this.data[u].x,b,a,k),v>=k&&v<a&&(d.moveTo(v,e-q),d.lineTo(v,this.getTransformedY(this.data[u].y,b,e,q,l)))}d.stroke();if(b.plots_showIntegration&&1<n.length){d.strokeStyle=b.plots_integrationColor;d.lineWidth=b.plots_integrationLineWidth;d.beginPath();u=n[1].x>n[0].x;if(this.flipXAxis&&!u||!this.flipXAxis&&u){for(u=n.length-2;0<=u;u--)n[u].y+=n[u+1].y;m=n[0].y}else{u=1;for(r=n.length;u<r;u++)n[u].y+=n[u-1].y;m=n[n.length-1].y}u=0;for(r=n.length;u<r;u++)v=
this.getTransformedX(n[u].x,b,a,k),A=this.getTransformedY(n[u].y/b.scale/m,b,e,q,l),0===u?d.moveTo(v,A):d.lineTo(v,A);d.stroke()}};l.getTransformedY=function(d,b,a,e,g){return g+(a-e-g)*(1-d*b.scale)};l.getInverseTransformedY=function(d){return 100*((1-(d-this.memory.offsetTop)/(this.memory.height-this.memory.offsetBottom-this.memory.offsetTop))/this.memory.scale)};l.getTransformedX=function(d,b,a,e){d=e+(d-this.minX)/(this.maxX-this.minX)*(a-e);b.plots_flipXAxis&&(d=a+e-d);return d};l.getInverseTransformedX=
function(d){this.memory.flipXAxis&&(d=this.memory.width+this.memory.offsetLeft-d);return(d-this.memory.offsetLeft)*(this.maxX-this.minX)/(this.memory.width-this.memory.offsetLeft)+this.minX};l.setup=function(){for(var d=Number.MAX_VALUE,b=Number.MIN_VALUE,a=Number.MIN_VALUE,e=0,j=this.data.length;e<j;e++)d=g.min(d,this.data[e].x),b=g.max(b,this.data[e].x),a=g.max(a,this.data[e].y);this.continuous?(this.minX=d,this.maxX=b):(this.minX=d-1,this.maxX=b+1);e=0;for(j=this.data.length;e<j;e++)this.data[e].y/=
a};l.zoom=function(d,b,a,e){d=this.getInverseTransformedX(d);b=this.getInverseTransformedX(b);this.minX=g.min(d,b);this.maxX=g.max(d,b);if(e){e=Number.MIN_VALUE;b=0;for(d=this.data.length;b<d;b++)m.isBetween(this.data[b].x,this.minX,this.maxX)&&(e=g.max(e,this.data[b].y));return 1/e}};l.translate=function(d,b){var a=d/(b-this.memory.offsetLeft)*(this.maxX-this.minX)*(this.memory.flipXAxis?1:-1);this.minX+=a;this.maxX+=a};l.alertMetadata=function(){alert(this.metadata.join("\n"))};l.getInternalCoordinates=
function(d,b){return new ChemDoodle.structures.Point(this.getInverseTransformedX(d),this.getInverseTransformedY(b))};l.getClosestPlotInternalCoordinates=function(d){var b=this.getInverseTransformedX(d-1);d=this.getInverseTransformedX(d+1);if(b>d){var a=b,b=d;d=a}for(var a=-1,e=-Infinity,g=!1,k=0,j=this.data.length;k<j;k++){var n=this.data[k];if(m.isBetween(n.x,b,d))n.y>e&&(g=!0,e=n.y,a=k);else if(g)break}if(-1!==a)return n=this.data[a],new ChemDoodle.structures.Point(n.x,100*n.y)};l.getClosestPeakInternalCoordinates=
function(d){var b=this.getInverseTransformedX(d);d=0;for(var a=Infinity,e=0,j=this.data.length;e<j;e++){var k=g.abs(this.data[e].x-b);if(k<=a)a=k,d=e;else break}b=highestRight=d;a=maxRight=this.data[d].y;e=d+1;for(j=this.data.length;e<j;e++)if(this.data[e].y+0.05>maxRight)maxRight=this.data[e].y,highestRight=e;else break;for(e=d-1;0<=e;e--)if(this.data[e].y+0.05>a)a=this.data[e].y,b=e;else break;d=this.data[b-d>highestRight-d?highestRight:b];return new ChemDoodle.structures.Point(d.x,100*d.y)}})(ChemDoodle.extensions,
ChemDoodle.structures,ChemDoodle.math,ChemDoodle.lib.jQuery,Math);
(function(b,j,m){j._Shape=function(){};j=j._Shape.prototype;j.drawDecorations=function(b,g){if(this.isHover)for(var d=this.getPoints(),f=0,a=d.length;f<a;f++){var e=d[f];this.drawAnchor(b,g,e,e===this.hoverPoint)}};j.getBounds=function(){for(var j=new b.Bounds,g=this.getPoints(),d=0,f=g.length;d<f;d++){var a=g[d];j.expand(a.x,a.y)}return j};j.drawAnchor=function(b,g,d,f){b.save();b.translate(d.x,d.y);b.rotate(m.PI/4);b.scale(1/g.scale,1/g.scale);b.beginPath();b.moveTo(-4,-4);b.lineTo(4,-4);b.lineTo(4,
4);b.lineTo(-4,4);b.closePath();b.fillStyle=f?"#885110":"white";b.fill();b.beginPath();b.moveTo(-4,-2);b.lineTo(-4,-4);b.lineTo(-2,-4);b.moveTo(2,-4);b.lineTo(4,-4);b.lineTo(4,-2);b.moveTo(4,2);b.lineTo(4,4);b.lineTo(2,4);b.moveTo(-2,4);b.lineTo(-4,4);b.lineTo(-4,2);b.moveTo(-4,-2);b.strokeStyle="rgba(0,0,0,.2)";b.lineWidth=5;b.stroke();b.strokeStyle="blue";b.lineWidth=1;b.stroke();b.restore()}})(ChemDoodle.math,ChemDoodle.structures.d2,Math);
(function(b,j,m,l,g){l.Bracket=function(d,b){this.p1=d?d:new m.Point;this.p2=b?b:new m.Point};l=l.Bracket.prototype=new l._Shape;l.charge=0;l.mult=0;l.repeat=0;l.draw=function(d,f){var a=g.min(this.p1.x,this.p2.x),e=g.max(this.p1.x,this.p2.x),j=g.min(this.p1.y,this.p2.y),k=g.max(this.p1.y,this.p2.y),l=k-j,n=l/10;d.beginPath();d.moveTo(a+n,j);d.lineTo(a,j);d.lineTo(a,k);d.lineTo(a+n,k);d.moveTo(e-n,k);d.lineTo(e,k);d.lineTo(e,j);d.lineTo(e-n,j);this.isLassoed&&(n=d.createLinearGradient(this.p1.x,this.p1.y,
this.p2.x,this.p2.y),n.addColorStop(0,"rgba(212, 99, 0, 0)"),n.addColorStop(0.5,"rgba(212, 99, 0, 0.8)"),n.addColorStop(1,"rgba(212, 99, 0, 0)"),d.lineWidth=f.shapes_lineWidth_2D+5,d.strokeStyle=n,d.lineJoin="miter",d.lineCap="square",d.stroke());d.strokeStyle=f.shapes_color;d.lineWidth=f.shapes_lineWidth_2D;d.lineJoin="miter";d.lineCap="butt";d.stroke();0!==this.charge&&(d.fillStyle=f.text_color,d.textAlign="left",d.textBaseline="alphabetic",d.font=b.getFontString(f.text_font_size,f.text_font_families),
n=this.charge.toFixed(0),n="1"===n?"+":"-1"===n?"\u2013":b.stringStartsWith(n,"-")?n.substring(1)+"\u2013":n+"+",d.fillText(n,e+5,j+5));0!==this.mult&&(d.fillStyle=f.text_color,d.textAlign="right",d.textBaseline="middle",d.font=b.getFontString(f.text_font_size,f.text_font_families),d.fillText(this.mult.toFixed(0),a-5,j+l/2));0!==this.repeat&&(d.fillStyle=f.text_color,d.textAlign="left",d.textBaseline="top",d.font=b.getFontString(f.text_font_size,f.text_font_families),n=this.repeat.toFixed(0),d.fillText(n,
e+5,k-5))};l.getPoints=function(){return[this.p1,this.p2]};l.isOver=function(d){return j.isBetween(d.x,this.p1.x,this.p2.x)&&j.isBetween(d.y,this.p1.y,this.p2.y)}})(ChemDoodle.extensions,ChemDoodle.math,ChemDoodle.structures,ChemDoodle.structures.d2,Math);
(function(b,j,m,l){m.Line=function(d,b){this.p1=d?d:new j.Point;this.p2=b?b:new j.Point};m.Line.ARROW_SYNTHETIC="synthetic";m.Line.ARROW_RETROSYNTHETIC="retrosynthetic";m.Line.ARROW_RESONANCE="resonance";m.Line.ARROW_EQUILIBRIUM="equilibrium";var g=m.Line.prototype=new m._Shape;g.arrowType=void 0;g.topText=void 0;g.bottomText=void 0;g.draw=function(d,b){if(this.isLassoed){var a=d.createLinearGradient(this.p1.x,this.p1.y,this.p2.x,this.p2.y);a.addColorStop(0,"rgba(212, 99, 0, 0)");a.addColorStop(0.5,
"rgba(212, 99, 0, 0.8)");a.addColorStop(1,"rgba(212, 99, 0, 0)");var e=2.5,g=this.p1.angle(this.p2)+l.PI/2,k=l.cos(g),g=l.sin(g),j=this.p1.x-k*e,n=this.p1.y+g*e,y=this.p1.x+k*e,z=this.p1.y-g*e,p=this.p2.x+k*e,u=this.p2.y-g*e,r=this.p2.x-k*e,v=this.p2.y+g*e;d.fillStyle=a;d.beginPath();d.moveTo(j,n);d.lineTo(y,z);d.lineTo(p,u);d.lineTo(r,v);d.closePath();d.fill()}d.strokeStyle=b.shapes_color;d.fillStyle=b.shapes_color;d.lineWidth=b.shapes_lineWidth_2D;d.lineJoin="miter";d.lineCap="butt";if(this.p1.x!==
this.p2.x||this.p1.y!==this.p2.y){if(this.arrowType===m.Line.ARROW_RETROSYNTHETIC){var a=2*l.sqrt(2),e=b.shapes_arrowLength_2D/a,k=this.p1.angle(this.p2),g=k+l.PI/2,a=b.shapes_arrowLength_2D/a,w=l.cos(k),A=l.sin(k),k=l.cos(g),g=l.sin(g),j=this.p1.x-k*e,n=this.p1.y+g*e,y=this.p1.x+k*e,z=this.p1.y-g*e,p=this.p2.x+k*e-w*a,u=this.p2.y-g*e+A*a,r=this.p2.x-k*e-w*a,v=this.p2.y+g*e+A*a,B=this.p2.x+2*k*e-2*w*a,c=this.p2.y-2*g*e+2*A*a,h=this.p2.x-2*k*e-2*w*a,e=this.p2.y+2*g*e+2*A*a;d.beginPath();d.moveTo(y,
z);d.lineTo(p,u);d.moveTo(B,c);d.lineTo(this.p2.x,this.p2.y);d.lineTo(h,e);d.moveTo(r,v);d.lineTo(j,n)}else this.arrowType===m.Line.ARROW_EQUILIBRIUM?(a=2*l.sqrt(2),e=b.shapes_arrowLength_2D/a/2,k=this.p1.angle(this.p2),g=k+l.PI/2,a=2*b.shapes_arrowLength_2D/l.sqrt(3),w=l.cos(k),A=l.sin(k),k=l.cos(g),g=l.sin(g),j=this.p1.x-k*e,n=this.p1.y+g*e,y=this.p1.x+k*e,z=this.p1.y-g*e,p=this.p2.x+k*e,u=this.p2.y-g*e,r=this.p2.x-k*e,v=this.p2.y+g*e,d.beginPath(),d.moveTo(y,z),d.lineTo(p,u),d.moveTo(r,v),d.lineTo(j,
n),d.stroke(),y=p-0.8*w*a,z=u+0.8*A*a,B=p+k*b.shapes_arrowLength_2D/3-w*a,c=u-g*b.shapes_arrowLength_2D/3+A*a,d.beginPath(),d.moveTo(p,u),d.lineTo(B,c),d.lineTo(y,z),d.closePath(),d.fill(),d.stroke(),y=j+0.8*w*a,z=n-0.8*A*a,B=j-k*b.shapes_arrowLength_2D/3+w*a,c=n+g*b.shapes_arrowLength_2D/3-A*a,d.beginPath(),d.moveTo(j,n),d.lineTo(B,c),d.lineTo(y,z),d.closePath(),d.fill()):this.arrowType===m.Line.ARROW_SYNTHETIC?(k=this.p1.angle(this.p2),g=k+l.PI/2,a=2*b.shapes_arrowLength_2D/l.sqrt(3),w=l.cos(k),
A=l.sin(k),k=l.cos(g),g=l.sin(g),d.beginPath(),d.moveTo(this.p1.x,this.p1.y),d.lineTo(this.p2.x-w*a/2,this.p2.y+A*a/2),d.stroke(),y=this.p2.x-0.8*w*a,z=this.p2.y+0.8*A*a,B=this.p2.x+k*b.shapes_arrowLength_2D/3-w*a,c=this.p2.y-g*b.shapes_arrowLength_2D/3+A*a,h=this.p2.x-k*b.shapes_arrowLength_2D/3-w*a,e=this.p2.y+g*b.shapes_arrowLength_2D/3+A*a,d.beginPath(),d.moveTo(this.p2.x,this.p2.y),d.lineTo(h,e),d.lineTo(y,z),d.lineTo(B,c),d.closePath(),d.fill()):this.arrowType===m.Line.ARROW_RESONANCE?(k=this.p1.angle(this.p2),
g=k+l.PI/2,a=2*b.shapes_arrowLength_2D/l.sqrt(3),w=l.cos(k),A=l.sin(k),k=l.cos(g),g=l.sin(g),d.beginPath(),d.moveTo(this.p1.x+w*a/2,this.p1.y-A*a/2),d.lineTo(this.p2.x-w*a/2,this.p2.y+A*a/2),d.stroke(),y=this.p2.x-0.8*w*a,z=this.p2.y+0.8*A*a,B=this.p2.x+k*b.shapes_arrowLength_2D/3-w*a,c=this.p2.y-g*b.shapes_arrowLength_2D/3+A*a,h=this.p2.x-k*b.shapes_arrowLength_2D/3-w*a,e=this.p2.y+g*b.shapes_arrowLength_2D/3+A*a,d.beginPath(),d.moveTo(this.p2.x,this.p2.y),d.lineTo(h,e),d.lineTo(y,z),d.lineTo(B,
c),d.closePath(),d.fill(),d.stroke(),y=this.p1.x+0.8*w*a,z=this.p1.y-0.8*A*a,B=this.p1.x-k*b.shapes_arrowLength_2D/3+w*a,c=this.p1.y+g*b.shapes_arrowLength_2D/3-A*a,h=this.p1.x+k*b.shapes_arrowLength_2D/3+w*a,e=this.p1.y-g*b.shapes_arrowLength_2D/3-A*a,d.beginPath(),d.moveTo(this.p1.x,this.p1.y),d.lineTo(h,e),d.lineTo(y,z),d.lineTo(B,c),d.closePath(),d.fill()):(d.beginPath(),d.moveTo(this.p1.x,this.p1.y),d.lineTo(this.p2.x,this.p2.y));d.stroke();this.topText&&(d.textAlign="center",d.textBaseline=
"bottom",d.fillText(this.topText,(this.p1.x+this.p2.x)/2,this.p1.y-5));this.bottomText&&(d.textAlign="center",d.textBaseline="top",d.fillText(this.bottomText,(this.p1.x+this.p2.x)/2,this.p1.y+5))}};g.getPoints=function(){return[this.p1,this.p2]};g.isOver=function(d,f){var a=b.distanceFromPointToLineInclusive(d,this.p1,this.p2);return-1!==a&&a<f}})(ChemDoodle.math,ChemDoodle.structures,ChemDoodle.structures.d2,Math);
(function(b,j,m,l,g){var d=function(a){var d=[];if(a instanceof m.Atom)if(0===a.bondNumber)d.push(g.PI);else{if(a.angles){if(1===a.angles.length)d.push(a.angles[0]+g.PI);else{for(var b=1,f=a.angles.length;b<f;b++)d.push(a.angles[b-1]+(a.angles[b]-a.angles[b-1])/2);b=a.angles[a.angles.length-1];d.push(b+(a.angles[0]+2*g.PI-b)/2)}a.largestAngle>g.PI&&(d=[a.angleOfLeastInterference]);if(a.bonds){b=0;for(f=a.bonds.length;b<f;b++){var j=a.bonds[b];if(2===j.bondOrder&&(j=j.getNeighbor(a),"O"===j.label)){d=
[j.angle(a)];break}}}}}else a=a.a1.angle(a.a2),d.push(a+g.PI/2),d.push(a+3*g.PI/2);b=0;for(f=d.length;b<f;b++){for(;d[b]>2*g.PI;)d[b]-=2*g.PI;for(;0>d[b];)d[b]+=2*g.PI}return d},f=function(a,d){var b=3;if(a instanceof m.Atom){if(a.isLabelVisible(d)&&(b=8),0!==a.charge||0!==a.numRadical||0!==a.numLonePair)b=13}else a instanceof m.Point?b=0:1<a.bondOrder&&(b=5);return b},a=function(a,d,b,j,n,l,z,p,u,r){var v=l.angle(n),w=z.angle(p),A=v+g.PI/2,B=g.cos(v),v=g.sin(v),A=f(b,d);n.x-=B*A;n.y+=v*A;A=w+g.PI/
2;b=2*d.shapes_arrowLength_2D/g.sqrt(3);var B=g.cos(w),v=g.sin(w),c=g.cos(A),h=g.sin(A);p.x-=5*B;p.y+=5*v;w=new m.Point(p.x,p.y);A=f(j,d)/3;w.x-=B*A;w.y+=v*A;p.x-=B*(0.8*b+A);p.y+=v*(0.8*b+A);j=w.x-0.8*B*b;var A=w.y+0.8*v*b,D=new m.Point(w.x+c*d.shapes_arrowLength_2D/3-B*b,w.y-h*d.shapes_arrowLength_2D/3+v*b);d=new m.Point(w.x-c*d.shapes_arrowLength_2D/3-B*b,w.y+h*d.shapes_arrowLength_2D/3+v*b);v=B=!0;1===u&&(D.distance(l)>d.distance(l)?v=!1:B=!1);a.beginPath();a.moveTo(w.x,w.y);v&&a.lineTo(d.x,d.y);
a.lineTo(j,A);B&&a.lineTo(D.x,D.y);a.closePath();a.fill();a.stroke();a.beginPath();a.moveTo(n.x,n.y);a.bezierCurveTo(l.x,l.y,z.x,z.y,p.x,p.y);a.stroke();r.push([n,l,z,p])};l.Pusher=function(a,d,b){this.o1=a;this.o2=d;this.numElectron=b?b:1};l=l.Pusher.prototype=new l._Shape;l.drawDecorations=function(a,d){if(this.isHover)for(var b=this.o1 instanceof m.Atom?new m.Point(this.o1.x,this.o1.y):this.o1.getCenter(),f=this.o2 instanceof m.Atom?new m.Point(this.o2.x,this.o2.y):this.o2.getCenter(),b=[b,f],
f=0,g=b.length;f<g;f++){var j=b[f];this.drawAnchor(a,d,j,j===this.hoverPoint)}};l.draw=function(e,f){if(this.o1&&this.o2){e.strokeStyle=f.shapes_color;e.fillStyle=f.shapes_color;e.lineWidth=f.shapes_lineWidth_2D;e.lineJoin="miter";e.lineCap="butt";for(var k=this.o1 instanceof m.Atom?new m.Point(this.o1.x,this.o1.y):this.o1.getCenter(),j=this.o2 instanceof m.Atom?new m.Point(this.o2.x,this.o2.y):this.o2.getCenter(),n=d(this.o1),l=d(this.o2),z,p,u=Infinity,r=0,v=n.length;r<v;r++)for(var w=0,A=l.length;w<
A;w++){var B=new m.Point(k.x+35*g.cos(n[r]),k.y-35*g.sin(n[r])),c=new m.Point(j.x+35*g.cos(l[w]),j.y-35*g.sin(l[w])),h=B.distance(c);h<u&&(u=h,z=B,p=c)}this.caches=[];-1===this.numElectron?(r=k.distance(j)/2,l=k.angle(j),n=l+g.PI/2,v=g.cos(l),w=g.sin(l),l=new m.Point(k.x+(r-1)*v,k.y-(r-1)*w),u=new m.Point(l.x+35*g.cos(n+g.PI/6),l.y-35*g.sin(n+g.PI/6)),r=new m.Point(k.x+(r+1)*v,k.y-(r+1)*w),n=new m.Point(r.x+35*g.cos(n-g.PI/6),r.y-35*g.sin(n-g.PI/6)),a(e,f,this.o1,l,k,z,u,l,1,this.caches),a(e,f,this.o2,
r,j,p,n,r,1,this.caches)):(b.intersectLines(k.x,k.y,z.x,z.y,j.x,j.y,p.x,p.y)&&(n=z,z=p,p=n),n=z.angle(k),l=p.angle(j),u=g.max(n,l)-g.min(n,l),0.001>g.abs(u-g.PI)&&this.o1.molCenter===this.o2.molCenter&&(n+=g.PI/2,l-=g.PI/2,z.x=k.x+35*g.cos(n+g.PI),z.y=k.y-35*g.sin(n+g.PI),p.x=j.x+35*g.cos(l+g.PI),p.y=j.y-35*g.sin(l+g.PI)),a(e,f,this.o1,this.o2,k,z,p,j,this.numElectron,this.caches))}};l.getPoints=function(){return[]};l.isOver=function(a,d){for(var b=0,f=this.caches.length;b<f;b++)if(j.distanceFromCurve(a,
this.caches[b]).distance<d)return!0;return!1}})(ChemDoodle.math,ChemDoodle.math.jsBezier,ChemDoodle.structures,ChemDoodle.structures.d2,Math);
(function(b){b._Mesh=function(){};b=b._Mesh.prototype;b.storeData=function(b,m,l){this.positionData=b;this.normalData=m;this.indexData=l};b.setupBuffers=function(b){this.vertexPositionBuffer=b.createBuffer();b.bindBuffer(b.ARRAY_BUFFER,this.vertexPositionBuffer);b.bufferData(b.ARRAY_BUFFER,new Float32Array(this.positionData),b.STATIC_DRAW);this.vertexPositionBuffer.itemSize=3;this.vertexPositionBuffer.numItems=this.positionData.length/3;this.vertexNormalBuffer=b.createBuffer();b.bindBuffer(b.ARRAY_BUFFER,
this.vertexNormalBuffer);b.bufferData(b.ARRAY_BUFFER,new Float32Array(this.normalData),b.STATIC_DRAW);this.vertexNormalBuffer.itemSize=3;this.vertexNormalBuffer.numItems=this.normalData.length/3;this.indexData&&(this.vertexIndexBuffer=b.createBuffer(),b.bindBuffer(b.ELEMENT_ARRAY_BUFFER,this.vertexIndexBuffer),b.bufferData(b.ELEMENT_ARRAY_BUFFER,new Uint16Array(this.indexData),b.STATIC_DRAW),this.vertexIndexBuffer.itemSize=1,this.vertexIndexBuffer.numItems=this.indexData.length);if(this.partitions)for(var m=
0,l=this.partitions.length;m<l;m++){var g=this.partitions[m],d=this.generateBuffers(b,g.positionData,g.normalData,g.indexData);g.vertexPositionBuffer=d[0];g.vertexNormalBuffer=d[1];g.vertexIndexBuffer=d[2]}};b.generateBuffers=function(b,m,l,g){var d=b.createBuffer();b.bindBuffer(b.ARRAY_BUFFER,d);b.bufferData(b.ARRAY_BUFFER,new Float32Array(m),b.STATIC_DRAW);d.itemSize=3;d.numItems=m.length/3;m=b.createBuffer();b.bindBuffer(b.ARRAY_BUFFER,m);b.bufferData(b.ARRAY_BUFFER,new Float32Array(l),b.STATIC_DRAW);
m.itemSize=3;m.numItems=l.length/3;var f;g&&(f=b.createBuffer(),b.bindBuffer(b.ELEMENT_ARRAY_BUFFER,f),b.bufferData(b.ELEMENT_ARRAY_BUFFER,new Uint16Array(g),b.STATIC_DRAW),f.itemSize=1,f.numItems=g.length);return[d,m,f]};b.bindBuffers=function(b){this.vertexPositionBuffer||this.setupBuffers(b);b.bindBuffer(b.ARRAY_BUFFER,this.vertexPositionBuffer);b.vertexAttribPointer(b.shader.vertexPositionAttribute,this.vertexPositionBuffer.itemSize,b.FLOAT,!1,0,0);b.bindBuffer(b.ARRAY_BUFFER,this.vertexNormalBuffer);
b.vertexAttribPointer(b.shader.vertexNormalAttribute,this.vertexNormalBuffer.itemSize,b.FLOAT,!1,0,0);this.vertexIndexBuffer&&b.bindBuffer(b.ELEMENT_ARRAY_BUFFER,this.vertexIndexBuffer)}})(ChemDoodle.structures.d3,Math);
(function(b){b._Measurement=function(){};(b._Measurement.prototype=new b._Mesh).render=function(b,m){b.setMatrixUniforms(b.modelViewMatrix);m.measurement_update_3D&&(this.text=this.vertexPositionBuffer=void 0);this.vertexPositionBuffer||this.calculateData(m);this.bindBuffers(b);b.material.setDiffuseColor(m.shapes_color);b.lineWidth(1);b.drawElements(b.LINES,this.vertexIndexBuffer.numItems,b.UNSIGNED_SHORT,0);if(m.measurement_displayText_3D){this.text||(this.text=this.getText(m));var l={position:[],
texCoord:[],translation:[]};b.textImage.pushVertexData(this.text.value,this.text.pos,0,l);b.textMesh.storeData(b,l.position,l.texCoord,l.translation);b.enable(b.BLEND);b.depthMask(!1);b.enableVertexAttribArray(b.shader.vertexTexCoordAttribute);b.textImage.useTexture(b);b.textMesh.render(b);b.disableVertexAttribArray(b.shader.vertexTexCoordAttribute);b.disable(b.BLEND);b.depthMask(!0)}}})(ChemDoodle.structures.d3);
(function(b,j,m,l,g,d,f){m.Angle=function(a,d,b){this.a1=a;this.a2=d;this.a3=b};b=m.Angle.prototype=new m._Measurement;b.calculateData=function(a){var d=[],b=[],k=[],l=this.a2.distance3D(this.a1),n=this.a2.distance3D(this.a3);this.distUse=g.min(l,n)/2;this.vec1=f.normalize([this.a1.x-this.a2.x,this.a1.y-this.a2.y,this.a1.z-this.a2.z]);this.vec2=f.normalize([this.a3.x-this.a2.x,this.a3.y-this.a2.y,this.a3.z-this.a2.z]);this.angle=j.vec3AngleFrom(this.vec1,this.vec2);l=f.normalize(f.cross(this.vec1,
this.vec2,[]));l=f.normalize(f.cross(l,this.vec1,[]));a=a.measurement_angleBands_3D;for(n=0;n<=a;++n){var m=this.angle*n/a,z=f.scale(this.vec1,g.cos(m),[]),m=f.scale(l,g.sin(m),[]),z=f.scale(f.normalize(f.add(z,m,[])),this.distUse);d.push(this.a2.x+z[0],this.a2.y+z[1],this.a2.z+z[2]);b.push(0,0,0);n<a&&k.push(n,n+1)}this.storeData(d,b,k)};b.getText=function(){var a=f.scale(f.normalize(f.add(this.vec1,this.vec2,[])),this.distUse+0.3);return{pos:[this.a2.x+a[0],this.a2.y+a[1],this.a2.z+a[2]],value:[l.angleBounds(this.angle,
!0).toFixed(2)," \u00b0"].join("")}}})(ChemDoodle.ELEMENT,ChemDoodle.extensions,ChemDoodle.structures.d3,ChemDoodle.math,Math,ChemDoodle.lib.mat4,ChemDoodle.lib.vec3);
(function(b,j){b.Arrow=function(b,l){for(var g=[],d=[],f=0;f<=l;f++){var a=2*f*j.PI/l,e=j.sin(a),a=j.cos(a);d.push(0,0,-1,0,0,-1,a,e,0,a,e,0,0,0,-1,0,0,-1,a,e,1,a,e,1);g.push(0,0,0,b*a,b*e,0,b*a,b*e,0,b*a,b*e,2,b*a,b*e,2,2*b*a,2*b*e,2,2*b*a,2*b*e,2,0,0,3)}f=[];for(e=0;e<l;e++)for(var a=8*e,t=0;7>t;t++){var k=t+a,q=k+7+2;f.push(k,q,k+1,q,k,q-1)}this.storeData(g,d,f)};b.Arrow.prototype=new b._Mesh})(ChemDoodle.structures.d3,Math);
(function(b,j,m){b.LineArrow=function(){this.storeData([0,0,-3,0.1,0,-2.8,0,0,-3,-0.1,0,-2.8,0,0,-3,0,0,3,0,0,3,0.1,0,2.8,0,0,3,-0.1,0,2.8],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])};b.LineArrow.prototype=new b._Mesh;b.Compass=function(g,d){this.textImage=new b.TextImage;this.textImage.init(g);this.textImage.updateFont(g,d.text_font_size,d.text_font_families,d.text_font_bold,d.text_font_italic,d.text_font_stroke_3D);this.textMesh=new b.TextMesh;this.textMesh.init(g);var f=3/(d.compass_size_3D/
g.canvas.clientHeight),a=j.tan(d.projectionPerspectiveVerticalFieldOfView_3D/360*j.PI),e=f/a,l=j.max(e-f,0.1),k=g.canvas.clientWidth/g.canvas.clientHeight,q,n;d.projectionPerspective_3D?(n=l,q=m.frustum):(n=e,q=m.ortho);var y=2*(n/g.canvas.clientHeight)*a,a=a*n;n=-a;var z=k*n,k=k*a;if(0===d.compass_type_3D){var p=(-(g.canvas.clientWidth-d.compass_size_3D)/2+this.textImage.charHeight)*y,y=(-(g.canvas.clientHeight-d.compass_size_3D)/2+this.textImage.charHeight)*y,z=z-p,k=k-p;n-=y;a-=y}this.projectionMatrix=
q(z,k,n,a,l,e+f);this.translationMatrix=m.translate(m.identity([]),[0,0,-e]);f={position:[],texCoord:[],translation:[]};this.textImage.pushVertexData("X",[3.5,0,0],0,f);this.textImage.pushVertexData("Y",[0,3.5,0],0,f);this.textImage.pushVertexData("Z",[0,0,3.5],0,f);this.textMesh.storeData(g,f.position,f.texCoord,f.translation)};var l=b.Compass.prototype;l.renderArrow=function(b,d,f,a){b.material.setDiffuseColor(f);b.setMatrixUniforms(a);1===d?b.drawArrays(b.LINES,0,b.lineArrowBuffer.vertexPositionBuffer.numItems):
b.drawElements(b.TRIANGLES,b.arrowBuffer.vertexIndexBuffer.numItems,b.UNSIGNED_SHORT,0)};l.render=function(b,d){1===d.compass_type_3D?b.lineArrowBuffer.bindBuffers(b):b.arrowBuffer.bindBuffers(b);b.material.setTempColors(d.bonds_materialAmbientColor_3D,void 0,d.bonds_materialSpecularColor_3D,d.bonds_materialShininess_3D);var f=m.multiply(this.translationMatrix,b.rotationMatrix,[]),a=j.PI/2;b.fogging.setMode(0);this.renderArrow(b,d.compass_type_3D,d.compass_axisXColor_3D,m.rotateY(f,a,[]));this.renderArrow(b,
d.compass_type_3D,d.compass_axisYColor_3D,m.rotateX(f,-a,[]));this.renderArrow(b,d.compass_type_3D,d.compass_axisZColor_3D,f)};l.renderAxis=function(b){var d=m.multiply(this.translationMatrix,b.rotationMatrix,[]);b.setMatrixUniforms(d);this.textImage.useTexture(b);this.textMesh.render(b)}})(ChemDoodle.structures.d3,Math,ChemDoodle.lib.mat4);
(function(b,j){b.Cylinder=function(b,l,g){for(var d=[],f=[],a=0;a<g;a++){var e=2*a*j.PI/g,t=j.cos(e),e=j.sin(e);f.push(t,0,e);d.push(b*t,0,b*e);f.push(t,0,e);d.push(b*t,l,b*e)}f.push(1,0,0);d.push(b,0,0);f.push(1,0,0);d.push(b,l,0);this.storeData(d,f)};b.Cylinder.prototype=new b._Mesh})(ChemDoodle.structures.d3,Math);
(function(b,j,m,l){j.Distance=function(b,d,f,a){this.a1=b;this.a2=d;this.node=f;this.offset=a?a:0};j=j.Distance.prototype=new j._Measurement;j.calculateData=function(g){var d=[this.a1.x,this.a1.y,this.a1.z,this.a2.x,this.a2.y,this.a2.z];this.node&&(this.move=this.offset+m.max(g.atoms_useVDWDiameters_3D?b[this.a1.label].vdWRadius*g.atoms_vdwMultiplier_3D:g.atoms_sphereDiameter_3D/2,g.atoms_useVDWDiameters_3D?b[this.a2.label].vdWRadius*g.atoms_vdwMultiplier_3D:g.atoms_sphereDiameter_3D/2),this.displacement=
[(this.a1.x+this.a2.x)/2-this.node.x,(this.a1.y+this.a2.y)/2-this.node.y,(this.a1.z+this.a2.z)/2-this.node.z],l.normalize(this.displacement),g=l.scale(this.displacement,this.move,[]),d[0]+=g[0],d[1]+=g[1],d[2]+=g[2],d[3]+=g[0],d[4]+=g[1],d[5]+=g[2]);this.storeData(d,[0,0,0,0,0,0],[0,1])};j.getText=function(){var b=this.a1.distance3D(this.a2),d=[(this.a1.x+this.a2.x)/2,(this.a1.y+this.a2.y)/2,(this.a1.z+this.a2.z)/2];if(this.node){var f=l.scale(this.displacement,this.move+0.1,[]);d[0]+=f[0];d[1]+=
f[1];d[2]+=f[2]}return{pos:d,value:[b.toFixed(2)," \u212b"].join("")}}})(ChemDoodle.ELEMENT,ChemDoodle.structures.d3,Math,ChemDoodle.lib.vec3);
(function(b,j){j.Fog=function(b){this.gl=b;this.mUL=b.getUniformLocation(b.program,"u_fog.mode");this.cUL=b.getUniformLocation(b.program,"u_fog.color");this.sUL=b.getUniformLocation(b.program,"u_fog.start");this.eUL=b.getUniformLocation(b.program,"u_fog.end");this.dUL=b.getUniformLocation(b.program,"u_fog.density")};var m=j.Fog.prototype;m.setTempParameter=function(j,g,d,f){if(!this.cCache||this.cCache!==j)this.cCache=j,j=b.getRGB(j,1),this.gl.uniform3f(this.cUL,j[0],j[1],j[2]);if(!this.sCache||this.sCache!==
g)this.sCache=g,this.gl.uniform1f(this.sUL,g);if(!this.eCache||this.eCache!==d)this.eCache=d,this.gl.uniform1f(this.eUL,d);if(!this.dCache||this.dCache!==f)this.dCache=f,this.gl.uniform1f(this.dUL,f)};m.setMode=function(b){if(!this.mCache||this.mCache!==b)this.mCache=b,this.gl.uniform1i(this.mUL,b)}})(ChemDoodle.math,ChemDoodle.structures.d3,ChemDoodle.lib.vec3);
(function(b,j){j.Label=function(){this.textImage=new j.TextImage};var m=j.Label.prototype;m.init=function(b,g){this.textImage.init(b);this.textImage.updateFont(b,g.atoms_font_size_2D,g.atoms_font_families_2D,g.atoms_font_bold_2D,g.atoms_font_italic_2D,g.text_font_stroke_3D)};m.updateVerticesBuffer=function(j,g,d){for(var f=0,a=g.length;f<a;f++){for(var e=g[f],m=e.labelMesh,k=e.atoms,q=this.textImage,n={position:[],texCoord:[],translation:[]},y=0<k.length&&void 0!=k[0].hetatm,z=0,p=k.length;z<p;z++){var u=
k[z],r=u.label,v=0.05;if(d.atoms_useVDWDiameters_3D){var w=b[r].vdWRadius*d.atoms_vdwMultiplier_3D;0===w&&(w=1);v+=w}else d.atoms_sphereDiameter_3D&&(v+=1.5*(d.atoms_sphereDiameter_3D/2));if(y)if(u.hetatm){if(u.isWater&&!d.macro_showWaters)continue}else if(!d.macro_displayAtoms)continue;q.pushVertexData(r,[u.x,u.y,u.z],v,n)}if((e=e.chains)&&(d.proteins_displayRibbon||d.proteins_displayBackbone)){z=0;for(p=e.length;z<p;z++){k=e[z];y=0;for(r=k.length;y<r;y++)v=k[y],v.name&&(u=v.cp1,q.pushVertexData(v.name,
[u.x,u.y,u.z],2,n))}}m.storeData(j,n.position,n.texCoord,n.translation,n.zDepth)}};m.render=function(b,g,d){b.setMatrixUniforms(b.modelViewMatrix);this.textImage.useTexture(b);g=0;for(var f=d.length;g<f;g++)d[g].labelMesh&&d[g].labelMesh.render(b)}})(ChemDoodle.ELEMENT,ChemDoodle.structures.d3);
(function(b,j){b.Sphere=function(b,l,g){for(var d=[],f=[],a=0;a<=l;a++)for(var e=a*j.PI/l,t=j.sin(e),k=j.cos(e),e=0;e<=g;e++){var q=2*e*j.PI/g,n=j.sin(q),q=j.cos(q)*t,y=k,n=n*t;f.push(q,y,n);d.push(b*q,b*y,b*n)}b=[];g+=1;for(a=0;a<l;a++)for(e=0;e<g;e++)t=a*g+e%g,k=t+g,b.push(t,t+1,k),e<g-1&&b.push(k,t+1,k+1);this.storeData(d,f,b)};b.Sphere.prototype=new b._Mesh})(ChemDoodle.structures.d3,Math);
(function(b,j,m,l){function g(a,d,b,f){this.entire=a;this.name=d;this.indexes=b;this.pi=f}var d=function(a,d){a.bindBuffer(a.ARRAY_BUFFER,d.vertexPositionBuffer);a.vertexAttribPointer(a.shader.vertexPositionAttribute,d.vertexPositionBuffer.itemSize,a.FLOAT,!1,0,0);a.bindBuffer(a.ARRAY_BUFFER,d.vertexNormalBuffer);a.vertexAttribPointer(a.shader.vertexNormalAttribute,d.vertexNormalBuffer.itemSize,a.FLOAT,!1,0,0);a.bindBuffer(a.ELEMENT_ARRAY_BUFFER,d.vertexIndexBuffer)},f=g.prototype;f.getColor=function(a){return a.macro_colorByChain?
this.chainColor:this.name?this.getResidueColor(b[this.name]?this.name:"*",a):this.helix?this.entire.front?a.proteins_ribbonCartoonHelixPrimaryColor:a.proteins_ribbonCartoonHelixSecondaryColor:this.sheet?a.proteins_ribbonCartoonSheetColor:this.entire.front?a.proteins_primaryColor:a.proteins_secondaryColor};f.getResidueColor=function(a,d){var f=b[a];if("shapely"===d.proteins_residueColor)return f.shapelyColor;if("amino"===d.proteins_residueColor)return f.aminoColor;if("polarity"===d.proteins_residueColor){if(f.polar)return"#C10000"}else if("acidity"===
d.proteins_residueColor){if(1===f.acidity)return"#0000FF";if(-1===f.acidity)return"#FF0000";if(!f.polar)return"#773300"}return"#FFFFFF"};f.render=function(a,e,b){this.entire.partitions&&this.pi!==this.entire.partitions.lastRender&&(d(a,this.entire.partitions[this.pi]),this.entire.partitions.lastRender=this.pi);this.vertexIndexBuffer||(this.vertexIndexBuffer=a.createBuffer(),a.bindBuffer(a.ELEMENT_ARRAY_BUFFER,this.vertexIndexBuffer),a.bufferData(a.ELEMENT_ARRAY_BUFFER,new Uint16Array(this.indexes),
a.STATIC_DRAW),this.vertexIndexBuffer.itemSize=1,this.vertexIndexBuffer.numItems=this.indexes.length);a.bindBuffer(a.ELEMENT_ARRAY_BUFFER,this.vertexIndexBuffer);!b&&"rainbow"!==e.proteins_residueColor&&a.material.setDiffuseColor(this.getColor(e));a.drawElements(a.TRIANGLES,this.vertexIndexBuffer.numItems,a.UNSIGNED_SHORT,0)};j.Ribbon=function(a,d,b){var f=a[0].lineSegments.length,j=a[0].lineSegments[0].length;this.partitions=[];this.partitions.lastRender=0;var n;this.front=0<d;for(var y=0,z=a.length-
1;y<z;y++){if(!n||65E3<n.positionData.length)0<this.partitions.length&&y--,n={count:0,positionData:[],normalData:[],indexData:[]},this.partitions.push(n);var p=a[y];n.count++;for(var u=0;u<f;u++)for(var r=b?p.lineSegmentsCartoon[u]:p.lineSegments[u],v=0===u,w=!1,A=0;A<j;A++){var B=r[A],c=y,h=A+1;y===a.length-2&&A===j-1?h--:A===j-1&&(c++,h=0);var h=b?a[c].lineSegmentsCartoon[u][h]:a[c].lineSegments[u][h],c=!1,D=u+1;u===f-1&&(D-=2,c=!0);var D=b?p.lineSegmentsCartoon[D][A]:p.lineSegments[D][A],h=[h.x-
B.x,h.y-B.y,h.z-B.z],D=[D.x-B.x,D.y-B.y,D.z-B.z],C=l.cross(h,D,[]);0===A&&(l.normalize(h),l.scale(h,-1),n.normalData.push(h[0],h[1],h[2]),n.positionData.push(B.x,B.y,B.z));v||w?(l.normalize(D),l.scale(D,-1),n.normalData.push(D[0],D[1],D[2]),n.positionData.push(B.x,B.y,B.z),v&&A===j-1&&(v=!1,A=-1)):(l.normalize(C),(c&&!this.front||!c&&this.front)&&l.scale(C,-1),n.normalData.push(C[0],C[1],C[2]),l.scale(C,m.abs(d)),n.positionData.push(B.x+C[0],B.y+C[1],B.z+C[2]),u===f-1&&A===j-1&&(w=!0,A=-1));if(-1===
A||A===j-1)l.normalize(h),n.normalData.push(h[0],h[1],h[2]),n.positionData.push(B.x,B.y,B.z)}}f+=2;j+=2;b&&(this.cartoonSegments=[]);this.segments=[];d=0;for(p=this.partitions.length;d<p;d++){n=this.partitions[d];var H;b&&(H=[]);y=0;for(z=n.count-1;y<z;y++){r=y;for(u=0;u<d;u++)r+=this.partitions[u].count-1;u=a[r];0<y&&(b&&u.split)&&(A=new g(this,void 0,H,d),u.helix&&(A.helix=!0),u.sheet&&(A.sheet=!0),this.cartoonSegments.push(A),H=[]);v=y*f*j;w=[];u=0;for(B=f-1;u<B;u++){c=v+u*j;for(A=0;A<j;A++)h=
1,y===n.count-1?h=0:A===j-1&&(h=f*j-A),h=[c+A,c+j+A,c+j+A+h,c+A,c+A+h,c+j+A+h],A!==j-1&&(this.front?w.push(h[0],h[1],h[2],h[3],h[5],h[4]):w.push(h[0],h[2],h[1],h[3],h[4],h[5])),A===j-2&&y<n.count-1&&(D=f*j-A,h[2]+=D,h[4]+=D,h[5]+=D),this.front?n.indexData.push(h[0],h[1],h[2],h[3],h[5],h[4]):n.indexData.push(h[0],h[2],h[1],h[3],h[4],h[5]),b&&(this.front?H.push(h[0],h[1],h[2],h[3],h[5],h[4]):H.push(h[0],h[2],h[1],h[3],h[4],h[5]))}this.segments.push(new g(this,a[r+1].name,w,d))}if(b){A=new g(this,void 0,
H,d);r=n.count-1;for(u=0;u<d;u++)r+=this.partitions[u].count-1;u=a[r];u.helix&&(A.helix=!0);u.sheet&&(A.sheet=!0);this.cartoonSegments.push(A)}}this.storeData(this.partitions[0].positionData,this.partitions[0].normalData,this.partitions[0].indexData);1===this.partitions.length&&(this.partitions=void 0)};(j.Ribbon.prototype=new j._Mesh).render=function(a,e){this.bindBuffers(a);var b=e.macro_colorByChain?this.chainColor:void 0;b||(b=this.front?e.proteins_primaryColor:e.proteins_secondaryColor);a.material.setDiffuseColor(b);
a.drawElements(a.TRIANGLES,this.vertexIndexBuffer.numItems,a.UNSIGNED_SHORT,0);if(this.partitions)for(var b=1,f=this.partitions.length;b<f;b++){var g=this.partitions[b];d(a,g);a.drawElements(a.TRIANGLES,g.vertexIndexBuffer.numItems,a.UNSIGNED_SHORT,0)}}})(ChemDoodle.RESIDUE,ChemDoodle.structures.d3,Math,ChemDoodle.lib.vec3);
(function(b,j,m){j.Light=function(j,g,d){this.diffuseRGB=b.getRGB(j,1);this.specularRGB=b.getRGB(g,1);this.direction=d};j.Light.prototype.lightScene=function(b){b.uniform3f(b.getUniformLocation(b.program,"u_light.diffuse_color"),this.diffuseRGB[0],this.diffuseRGB[1],this.diffuseRGB[2]);b.uniform3f(b.getUniformLocation(b.program,"u_light.specular_color"),this.specularRGB[0],this.specularRGB[1],this.specularRGB[2]);var g=m.create(this.direction);m.normalize(g);m.negate(g);b.uniform3f(b.getUniformLocation(b.program,
"u_light.direction"),g[0],g[1],g[2]);var d=[0,0,0],g=[d[0]+g[0],d[1]+g[1],d[2]+g[2]],d=m.length(g);0===d?g=[0,0,1]:m.scale(1/d);b.uniform3f(b.getUniformLocation(b.program,"u_light.half_vector"),g[0],g[1],g[2])}})(ChemDoodle.math,ChemDoodle.structures.d3,ChemDoodle.lib.vec3);(function(b){b.Line=function(){this.storeData([0,0,0,0,1,0],[0,0,0,0,0,0])};b.Line.prototype=new b._Mesh})(ChemDoodle.structures.d3);
(function(b,j){j.Material=function(b){this.gl=b;this.aUL=b.getUniformLocation(b.program,"u_material.ambient_color");this.dUL=b.getUniformLocation(b.program,"u_material.diffuse_color");this.sUL=b.getUniformLocation(b.program,"u_material.specular_color");this.snUL=b.getUniformLocation(b.program,"u_material.shininess");this.alUL=b.getUniformLocation(b.program,"u_material.alpha")};var m=j.Material.prototype;m.setTempColors=function(j,g,d,f){if(!this.aCache||this.aCache!==j)this.aCache=j,j=b.getRGB(j,
1),this.gl.uniform3f(this.aUL,j[0],j[1],j[2]);if(g&&(!this.dCache||this.dCache!==g))this.dCache=g,j=b.getRGB(g,1),this.gl.uniform3f(this.dUL,j[0],j[1],j[2]);if(!this.sCache||this.sCache!==d)this.sCache=d,j=b.getRGB(d,1),this.gl.uniform3f(this.sUL,j[0],j[1],j[2]);if(!this.snCache||this.snCache!==f)this.snCache=f,this.gl.uniform1f(this.snUL,f);this.alCache=1;this.gl.uniform1f(this.alUL,1)};m.setDiffuseColor=function(j){if(!this.dCache||this.dCache!==j)this.dCache=j,j=b.getRGB(j,1),this.gl.uniform3f(this.dUL,
j[0],j[1],j[2])};m.setAlpha=function(b){if(!this.alCache||this.alCache!==b)this.alCache=b,this.gl.uniform1f(this.alUL,b)}})(ChemDoodle.math,ChemDoodle.structures.d3);
(function(b,j,m,l){j.MolecularSurface=function(g,d,f,a,e){function j(a,c,d,e){var b=a.index;if(a.contained)for(var b=-1,f=Infinity,g=0,k=c.length;g<k;g++)for(var h=c[g],n=0,l=h.length;n<l;n++){var q=h[n];if(!q.contained&&q.index!==d&&q.index!==e){var m=q.distance3D(a);m<f&&(b=q.index,f=m)}}return b}for(var k=[],q=[],n=[],y=[],z=0;z<=d;z++)for(var p=z*l.PI/d,u=l.sin(p),r=l.cos(p),p=0;p<=f;p++){var v=2*p*l.PI/f;y.push(l.cos(v)*u,r,l.sin(v)*u)}u=[];z=0;for(p=g.atoms.length;z<p;z++){for(var r=[],w=g.atoms[z],
A=m[w.label][e]+a,B=[],v=0,c=g.atoms.length;v<c;v++)if(v!==z){var h=g.atoms[v];h.index=v;w.distance3D(h)<A+m[h.label][e]+a&&B.push(h)}v=0;for(c=y.length;v<c;v+=3){for(var D=new b.Atom("C",w.x+A*y[v],w.y+A*y[v+1],w.z+A*y[v+2]),C=0,H=B.length;C<H;C++)if(h=B[C],D.distance3D(h)<m[h.label][e]+a){D.contained=!0;break}r.push(D)}u.push(r)}g=[];f++;for(z=0;z<d;z++)for(p=0;p<f;p++)e=z*f+p%f,a=e+f,g.push(e),g.push(a),g.push(e+1),p<f-1&&(g.push(a),g.push(a+1),g.push(e+1));z=C=0;for(p=u.length;z<p;z++){r=u[z];
v=0;for(c=r.length;v<c;v++)D=r[v],D.contained||(D.index=C,C++,k.push(D.x,D.y,D.z),q.push(y[3*v],y[3*v+1],y[3*v+2]));v=0;for(c=g.length;v<c;v+=3)e=r[g[v]],a=r[g[v+1]],D=r[g[v+2]],!e.contained&&(!a.contained&&!D.contained)&&n.push(e.index,a.index,D.index)}y=[];z=0;for(p=u.length;z<p;z++){r=u[z];v=0;for(c=g.length;v<c;v+=3){e=r[g[v]];a=r[g[v+1]];D=r[g[v+2]];B=[];C=0;for(H=u.length;C<H;C++)C!==z&&B.push(u[C]);if((!e.contained||!a.contained||!D.contained)&&(e.contained||a.contained||D.contained))if(d=
j(e,B,-1,-1),f=j(a,B,d,-1),B=j(D,B,d,f),-1!==d&&-1!==f&&-1!==B){a=!1;C=0;for(H=y.length;C<H;C+=3)if(e=y[C],D=y[C+1],w=y[C+2],A=f===e||f===D||f===w,h=B===e||B===D||B===w,(d===e||d===D||d===w)&&A&&h){a=!0;break}a||y.push(d,f,B)}}}n=n.concat(y);this.storeData(k,q,n)};j.MolecularSurface.prototype=new j._Mesh})(ChemDoodle.structures,ChemDoodle.structures.d3,ChemDoodle.ELEMENT,Math);
(function(b){b.Picker=function(){};b=b.Picker.prototype;b.init=function(b){this.framebuffer=b.createFramebuffer();var m=b.createTexture(),l=b.createRenderbuffer();b.bindTexture(b.TEXTURE_2D,m);b.texParameteri(b.TEXTURE_2D,b.TEXTURE_MAG_FILTER,b.NEAREST);b.texParameteri(b.TEXTURE_2D,b.TEXTURE_MIN_FILTER,b.NEAREST);b.texParameteri(b.TEXTURE_2D,b.TEXTURE_WRAP_S,b.CLAMP_TO_EDGE);b.texParameteri(b.TEXTURE_2D,b.TEXTURE_WRAP_T,b.CLAMP_TO_EDGE);b.bindRenderbuffer(b.RENDERBUFFER,l);b.bindFramebuffer(b.FRAMEBUFFER,
this.framebuffer);b.framebufferTexture2D(b.FRAMEBUFFER,b.COLOR_ATTACHMENT0,b.TEXTURE_2D,m,0);b.framebufferRenderbuffer(b.FRAMEBUFFER,b.DEPTH_ATTACHMENT,b.RENDERBUFFER,l);b.bindTexture(b.TEXTURE_2D,null);b.bindRenderbuffer(b.RENDERBUFFER,null);b.bindFramebuffer(b.FRAMEBUFFER,null)};b.setDimension=function(b,m,l){b.bindFramebuffer(b.FRAMEBUFFER,this.framebuffer);var g=b.getFramebufferAttachmentParameter(b.FRAMEBUFFER,b.DEPTH_ATTACHMENT,b.FRAMEBUFFER_ATTACHMENT_OBJECT_NAME);b.isRenderbuffer(g)&&(b.bindRenderbuffer(b.RENDERBUFFER,
g),b.renderbufferStorage(b.RENDERBUFFER,b.DEPTH_COMPONENT16,m,l),b.bindRenderbuffer(b.RENDERBUFFER,null));g=b.getFramebufferAttachmentParameter(b.FRAMEBUFFER,b.COLOR_ATTACHMENT0,b.FRAMEBUFFER_ATTACHMENT_OBJECT_NAME);b.isTexture(g)&&(b.bindTexture(b.TEXTURE_2D,g),b.texImage2D(b.TEXTURE_2D,0,b.RGBA,m,l,0,b.RGBA,b.UNSIGNED_BYTE,null),b.bindTexture(b.TEXTURE_2D,null));b.bindFramebuffer(b.FRAMEBUFFER,null)};b.pick=function(b,m,l,g,d){var f=void 0,a=b.getParameter(b.COLOR_CLEAR_VALUE);b.bindFramebuffer(b.FRAMEBUFFER,
this.framebuffer);b.clearColor(1,1,1,0);b.clear(b.COLOR_BUFFER_BIT|b.DEPTH_BUFFER_BIT);b.fogging.setMode(0);b.disableVertexAttribArray(b.shader.vertexNormalAttribute);var e=[];b.material.setAlpha(255);for(var t=0,k=m.length;t<k;t++)m[t].renderPickFrame(b,l,e);b.flush();m=new Uint8Array(4);b.readPixels(g-2,d+2,1,1,b.RGBA,b.UNSIGNED_BYTE,m);0<m[3]&&(f=e[m[2]|m[1]<<8|m[0]<<16]);b.enableVertexAttribArray(b.shader.vertexNormalAttribute);b.fogging.setMode(l.fog_mode_3D);b.bindFramebuffer(b.FRAMEBUFFER,
null);b.clearColor(a[0],a[1],a[2],a[3]);return f}})(ChemDoodle.structures.d3,ChemDoodle.math,document);
(function(b,j){b.Pill=function(b,l,g,d){var f=1,a=2*b;l-=a;0>l?(f=0,l+=a):l<a&&(f=l/a,l=a);for(var a=[],e=[],t=0;t<=g;t++)for(var k=t*j.PI/g,q=j.sin(k),n=j.cos(k)*f,k=0;k<=d;k++){var y=2*k*j.PI/d,z=j.sin(y),y=j.cos(y)*q,p=n,z=z*q;e.push(y,p,z);a.push(b*y,b*p+(t<g/2?l:0),b*z)}b=[];d+=1;for(t=0;t<g;t++)for(k=0;k<d;k++)l=t*d+k%d,f=l+d,b.push(l,l+1,f),k<d-1&&b.push(f,l+1,f+1);this.storeData(a,e,b)};b.Pill.prototype=new b._Mesh})(ChemDoodle.structures.d3,Math);
(function(b,j){b.Shader=function(){};var m=b.Shader.prototype;m.init=function(b){var g=this.getShader(b,"vertex-shader");g||(g=this.loadDefaultVertexShader(b));var d=this.getShader(b,"fragment-shader");d||(d=this.loadDefaultFragmentShader(b));b.attachShader(b.program,g);b.attachShader(b.program,d);this.vertexPositionAttribute=0;b.bindAttribLocation(b.program,this.vertexPositionAttribute,"a_vertex_position");b.linkProgram(b.program);b.getProgramParameter(b.program,b.LINK_STATUS)||alert("Could not initialize shaders: "+
b.getProgramInfoLog(b.program));b.useProgram(b.program);b.enableVertexAttribArray(this.vertexPositionAttribute);this.vertexTexCoordAttribute=b.getAttribLocation(b.program,"a_vertex_texcoord");this.vertexNormalAttribute=b.getAttribLocation(b.program,"a_vertex_normal");b.enableVertexAttribArray(this.vertexNormalAttribute);this.dimensionUniform=b.getUniformLocation(b.program,"u_dimension")};m.getShader=function(b,g){var d=j.getElementById(g);if(d){for(var f=[],a=d.firstChild;a;)3===a.nodeType&&f.push(a.textContent),
a=a.nextSibling;if("x-shader/x-fragment"===d.type)a=b.createShader(b.FRAGMENT_SHADER);else if("x-shader/x-vertex"===d.type)a=b.createShader(b.VERTEX_SHADER);else return;b.shaderSource(a,f.join(""));b.compileShader(a);if(b.getShaderParameter(a,b.COMPILE_STATUS))return a;alert(d.type+" "+b.getShaderInfoLog(a))}};m.loadDefaultVertexShader=function(b){var g=b.createShader(b.VERTEX_SHADER);b.shaderSource(g,"precision mediump float;struct Light{vec3 diffuse_color;vec3 specular_color;vec3 direction;vec3 half_vector;};struct Material{vec3 ambient_color;vec3 diffuse_color;vec3 specular_color;float shininess;float alpha;};attribute vec3 a_vertex_position;attribute vec3 a_vertex_normal;attribute vec2 a_vertex_texcoord;uniform Light u_light;uniform Material u_material;uniform mat4 u_model_view_matrix;uniform mat4 u_projection_matrix;uniform mat3 u_normal_matrix;uniform vec2 u_dimension;varying vec2 v_texcoord;varying vec3 v_diffuse;varying vec4 v_ambient;varying vec3 v_normal;void main() {v_texcoord \x3d a_vertex_texcoord;if(length(a_vertex_texcoord) !\x3d 0.0) {gl_Position \x3d u_model_view_matrix * vec4(a_vertex_position, 1.0);vec4 depth_pos \x3d vec4(gl_Position);depth_pos.z +\x3d a_vertex_normal.z;gl_Position \x3d u_projection_matrix * gl_Position;depth_pos \x3d u_projection_matrix * depth_pos;gl_Position /\x3d gl_Position.w;gl_Position.xy +\x3d a_vertex_normal.xy / u_dimension * 2.0;gl_Position.z \x3d depth_pos.z / depth_pos.w;} else {v_normal \x3d length(a_vertex_normal)\x3d\x3d0.0 ? a_vertex_normal : normalize(u_normal_matrix * a_vertex_normal);v_ambient \x3d vec4(u_material.ambient_color, 1.0);v_diffuse \x3d u_material.diffuse_color * u_light.diffuse_color;gl_Position \x3d u_projection_matrix * u_model_view_matrix * vec4(a_vertex_position, 1.0);gl_Position /\x3d gl_Position.w;gl_PointSize \x3d 2.0;}}");
b.compileShader(g);if(b.getShaderParameter(g,b.COMPILE_STATUS))return g;alert("Vertex shader failed to compile: "+b.getShaderInfoLog(g))};m.loadDefaultFragmentShader=function(b){var g=b.createShader(b.FRAGMENT_SHADER);b.shaderSource(g,"precision mediump float;\nstruct Light{vec3 diffuse_color;vec3 specular_color;vec3 direction;vec3 half_vector;};struct Material{vec3 ambient_color;vec3 diffuse_color;vec3 specular_color;float shininess;float alpha;};struct Fog{int mode;vec3 color;float density;float start;float end;};uniform Light u_light;uniform Material u_material;uniform Fog u_fog;uniform sampler2D u_image;varying vec2 v_texcoord;varying vec3 v_diffuse;varying vec4 v_ambient;varying vec3 v_normal;void main(void){if(length(v_texcoord)!\x3d0.0) {gl_FragColor \x3d texture2D(u_image, v_texcoord);}else if(length(v_normal)\x3d\x3d0.0){gl_FragColor \x3d vec4(vec3(v_diffuse.rgb),u_material.alpha);}else{float nDotL \x3d max(dot(v_normal, u_light.direction), 0.0);vec4 color \x3d vec4(v_diffuse*nDotL, 1.0);float nDotHV \x3d max(dot(v_normal, u_light.half_vector), 0.0);vec3 specular \x3d u_material.specular_color * u_light.specular_color;color+\x3dvec4(specular * pow(nDotHV, u_material.shininess), 1.0);gl_FragColor \x3d color+v_ambient;gl_FragColor.a*\x3du_material.alpha;float fogCoord \x3d gl_FragCoord.z/gl_FragCoord.w;float fogFactor \x3d 1.;if(u_fog.mode \x3d\x3d 1){if(fogCoord \x3c u_fog.start){fogFactor \x3d 1.;}else if(fogCoord \x3e u_fog.end){fogFactor \x3d 0.;}else{fogFactor \x3d clamp((u_fog.end - fogCoord) / (u_fog.end - u_fog.start), 0.0, 1.0);}}else if(u_fog.mode \x3d\x3d 2) {fogFactor \x3d clamp(exp(-u_fog.density*fogCoord), 0.0, 1.0);}else if(u_fog.mode \x3d\x3d 3) {fogFactor \x3d clamp(exp(-pow(u_fog.density*fogCoord, 2.0)), 0.0, 1.0);}gl_FragColor \x3d mix(vec4(vec3(u_fog.color), 1.), gl_FragColor, fogFactor);}}");
b.compileShader(g);if(b.getShaderParameter(g,b.COMPILE_STATUS))return g;alert("Fragment shader failed to compile: "+b.getShaderInfoLog(g))}})(ChemDoodle.structures.d3,document);
(function(b,j,m){j.Shape=function(j,g){for(var d=j.length,f=[],a=[],e=new b.Point,t=0,k=d;t<k;t++){var q=t+1;t===k-1&&(q=0);for(var n=j[t],q=j[q],y=m.cross([0,0,1],[q.x-n.x,q.y-n.y,0]),z=0;2>z;z++)f.push(n.x,n.y,g/2),f.push(n.x,n.y,-g/2),f.push(q.x,q.y,g/2),f.push(q.x,q.y,-g/2);for(z=0;4>z;z++)a.push(y[0],y[1],y[2]);a.push(0,0,1);a.push(0,0,-1);a.push(0,0,1);a.push(0,0,-1);e.add(n)}e.x/=d;e.y/=d;a.push(0,0,1);f.push(e.x,e.y,g/2);a.push(0,0,-1);f.push(e.x,e.y,-g/2);e=[];n=8*d;t=0;for(k=d;t<k;t++)d=
8*t,e.push(d),e.push(d+3),e.push(d+1),e.push(d),e.push(d+2),e.push(d+3),e.push(d+4),e.push(n),e.push(d+6),e.push(d+5),e.push(d+7),e.push(n+1);this.storeData(f,a,e)};j.Shape.prototype=new j._Mesh})(ChemDoodle.structures,ChemDoodle.structures.d3,ChemDoodle.lib.vec3);
(function(b,j,m){b.Star=function(){for(var b=[0.8944,0.4472,0,0.2764,0.4472,0.8506,0.2764,0.4472,-0.8506,-0.7236,0.4472,0.5257,-0.7236,0.4472,-0.5257,-0.3416,0.4472,0,-0.1056,0.4472,0.3249,-0.1056,0.4472,-0.3249,0.2764,0.4472,0.2008,0.2764,0.4472,-0.2008,-0.8944,-0.4472,0,-0.2764,-0.4472,0.8506,-0.2764,-0.4472,-0.8506,0.7236,-0.4472,0.5257,0.7236,-0.4472,-0.5257,0.3416,-0.4472,0,0.1056,-0.4472,0.3249,0.1056,-0.4472,-0.3249,-0.2764,-0.4472,0.2008,-0.2764,-0.4472,-0.2008,-0.5527,0.1058,0,-0.1708,0.1058,
0.5527,-0.1708,0.1058,-0.5527,0.4471,0.1058,0.3249,0.4471,0.1058,-0.3249,0.5527,-0.1058,0,0.1708,-0.1058,0.5527,0.1708,-0.1058,-0.5527,-0.4471,-0.1058,0.3249,-0.4471,-0.1058,-0.3249,0,1,0,0,-1,0],g=[0,9,8,2,7,9,4,5,7,3,6,5,1,8,6,0,8,23,30,6,8,3,21,6,11,26,21,13,23,26,2,9,24,30,8,9,1,23,8,13,25,23,14,24,25,4,7,22,30,9,7,0,24,9,14,27,24,12,22,27,3,5,20,30,7,5,2,22,7,12,29,22,10,20,29,1,6,21,30,5,6,4,20,5,10,28,20,11,21,28,10,19,18,12,17,19,14,15,17,13,16,15,11,18,16,31,19,17,14,17,27,2,27,22,4,22,29,
10,29,19,31,18,19,12,19,29,4,29,20,3,20,28,11,28,18,31,16,18,10,18,28,3,28,21,1,21,26,13,26,16,31,15,16,11,16,26,1,26,23,0,23,25,14,25,15,31,17,15,13,15,25,0,25,24,2,24,27,12,27,17],d=[],f=[],a=[],e=0,j=g.length;e<j;e+=3){var k=3*g[e],q=3*g[e+1],n=3*g[e+2],k=[b[k],b[k+1],b[k+2]],q=[b[q],b[q+1],b[q+2]],n=[b[n],b[n+1],b[n+2]],y=m.cross([n[0]-q[0],n[1]-q[1],n[2]-q[2]],[k[0]-q[0],k[1]-q[1],k[2]-q[2]],[]);m.normalize(y);d.push(k[0],k[1],k[2],q[0],q[1],q[2],n[0],n[1],n[2]);f.push(y[0],y[1],y[2],y[0],y[1],
y[2],y[0],y[1],y[2]);a.push(e,e+1,e+2)}this.storeData(d,f,a)};b.Star.prototype=new b._Mesh})(ChemDoodle.structures.d3,Math,ChemDoodle.lib.vec3);
(function(b,j,m){b.TextImage=function(){this.ctx=m.createElement("canvas").getContext("2d");this.data=[];this.text="";this.charHeight=0};b=b.TextImage.prototype;b.init=function(b){this.textureImage=b.createTexture();b.bindTexture(b.TEXTURE_2D,this.textureImage);b.pixelStorei(b.UNPACK_FLIP_Y_WEBGL,!1);b.texParameteri(b.TEXTURE_2D,b.TEXTURE_WRAP_S,b.CLAMP_TO_EDGE);b.texParameteri(b.TEXTURE_2D,b.TEXTURE_WRAP_T,b.CLAMP_TO_EDGE);b.texParameteri(b.TEXTURE_2D,b.TEXTURE_MIN_FILTER,b.NEAREST);b.texParameteri(b.TEXTURE_2D,
b.TEXTURE_MAG_FILTER,b.NEAREST);b.bindTexture(b.TEXTURE_2D,null);this.updateFont(b,12,["Sans-serif"],!1,!1,!1)};b.charData=function(b){b=this.text.indexOf(b);return 0<=b?this.data[b]:null};b.updateFont=function(b,g,d,f,a,e){var m=this.ctx,k=this.ctx.canvas,q=[],n="";a=j.getFontString(g,d,f,a);m.font=a;m.save();var y=0;g*=1.5;d=32;for(f=127;d<f;d++){var z=String.fromCharCode(d),p=m.measureText(z).width;q.push({text:z,width:p,height:g});y+=2*p}var u=["\u00b0","\u212b","\u00ae"];d=0;for(f=u.length;d<
f;d++)z=u[d],p=m.measureText(z).width,q.push({text:z,width:p,height:g}),y+=2*p;d=Math.sqrt(y*g);d=Math.ceil(d/g);y=Math.ceil(y/(d-1));k.width=y;k.height=d*g;m.font=a;m.textAlign="left";m.textBaseline="middle";m.strokeStyle="#000";m.lineWidth=1.4;m.fillStyle="#fff";d=z=a=0;for(f=q.length;d<f;d++){p=q[d];u=2*p.width;g=p.height;var r=p.text;z+u>y&&(a++,z=0);var v=a*g;e&&m.strokeText(r,z,v+g/2);m.fillText(r,z,v+g/2);p.x=z;p.y=v;n+=r;z+=u}this.text=n;this.data=q;this.charHeight=g;b.bindTexture(b.TEXTURE_2D,
this.textureImage);b.texImage2D(b.TEXTURE_2D,0,b.RGBA,b.RGBA,b.UNSIGNED_BYTE,k);b.bindTexture(b.TEXTURE_2D,null)};b.pushVertexData=function(b,g,d,f){var a=b.toString().split(""),e=this.getHeight(),j=this.getWidth();b=-this.textWidth(b)/2;for(var k=-this.charHeight/2,q=0,n=a.length;q<n;q++){var m=this.charData(a[q]),z=m.width,p=m.x/j,u=p+1.8*m.width/j,r=m.y/e,m=r+m.height/e,v=b+1.8*z,w=this.charHeight/2;f.position.push(g[0],g[1],g[2],g[0],g[1],g[2],g[0],g[1],g[2],g[0],g[1],g[2],g[0],g[1],g[2],g[0],
g[1],g[2]);f.texCoord.push(p,r,u,m,u,r,p,r,p,m,u,m);f.translation.push(b,w,d,v,k,d,v,w,d,b,w,d,b,k,d,v,k,d);b=v+z-1.8*z}};b.getCanvas=function(){return this.ctx.canvas};b.getHeight=function(){return this.getCanvas().height};b.getWidth=function(){return this.getCanvas().width};b.textWidth=function(b){return this.ctx.measureText(b).width};b.test=function(){m.body.appendChild(this.getCanvas())};b.useTexture=function(b){b.bindTexture(b.TEXTURE_2D,this.textureImage)}})(ChemDoodle.structures.d3,ChemDoodle.extensions,
document);
(function(b){b.TextMesh=function(){};b=b.TextMesh.prototype;b.init=function(b){this.vertexPositionBuffer=b.createBuffer();this.vertexTexCoordBuffer=b.createBuffer();this.vertexTranslationBuffer=b.createBuffer()};b.setVertexData=function(b,m,l,g){b.bindBuffer(b.ARRAY_BUFFER,m);b.bufferData(b.ARRAY_BUFFER,new Float32Array(l),b.STATIC_DRAW);m.itemSize=g;m.numItems=l.length/g};b.storeData=function(b,m,l,g){this.setVertexData(b,this.vertexPositionBuffer,m,3);this.setVertexData(b,this.vertexTexCoordBuffer,l,
2);this.setVertexData(b,this.vertexTranslationBuffer,g,3)};b.bindBuffers=function(b){b.bindBuffer(b.ARRAY_BUFFER,this.vertexPositionBuffer);b.vertexAttribPointer(b.shader.vertexPositionAttribute,this.vertexPositionBuffer.itemSize,b.FLOAT,!1,0,0);b.bindBuffer(b.ARRAY_BUFFER,this.vertexTexCoordBuffer);b.vertexAttribPointer(b.shader.vertexTexCoordAttribute,this.vertexTexCoordBuffer.itemSize,b.FLOAT,!1,0,0);b.bindBuffer(b.ARRAY_BUFFER,this.vertexTranslationBuffer);b.vertexAttribPointer(b.shader.vertexNormalAttribute,
this.vertexTranslationBuffer.itemSize,b.FLOAT,!1,0,0)};b.render=function(b){var m=this.vertexPositionBuffer.numItems;m&&(this.bindBuffers(b),b.drawArrays(b.TRIANGLES,0,m))}})(ChemDoodle.structures.d3,Math);
(function(b,j,m,l,g,d,f){l.Torsion=function(a,b,d,f){this.a1=a;this.a2=b;this.a3=d;this.a4=f};b=l.Torsion.prototype=new l._Measurement;b.calculateData=function(a){var b=[],d=[],k=[],j=this.a2.distance3D(this.a1),n=this.a2.distance3D(this.a3);this.distUse=g.min(j,n)/2;var n=[this.a2.x-this.a1.x,this.a2.y-this.a1.y,this.a2.z-this.a1.z],j=[this.a3.x-this.a2.x,this.a3.y-this.a2.y,this.a3.z-this.a2.z],l=[this.a4.x-this.a3.x,this.a4.y-this.a3.y,this.a4.z-this.a3.z],m=f.cross(n,j,[]),l=f.cross(j,l,[]);f.scale(n,
f.length(j));this.torsion=g.atan2(f.dot(n,l),f.dot(m,l));n=f.normalize(f.cross(m,j,[]));m=f.normalize(f.cross(j,n,[]));this.pos=f.add([this.a2.x,this.a2.y,this.a2.z],f.scale(f.normalize(j,[]),this.distUse));var l=[],p=a.measurement_angleBands_3D;for(a=0;a<=p;++a){var u=this.torsion*a/p,r=f.scale(n,g.cos(u),[]),u=f.scale(m,g.sin(u),[]),r=f.scale(f.normalize(f.add(r,u,[])),this.distUse);0==a&&(l=r);b.push(this.pos[0]+r[0],this.pos[1]+r[1],this.pos[2]+r[2]);d.push(0,0,0);a<p&&k.push(a,a+1)}this.vecText=
f.normalize(f.add(l,r,[]));j=f.normalize(j,[]);f.scale(j,0.0625);u=this.torsion-2*g.asin(0.125)*this.torsion/g.abs(this.torsion);r=f.scale(n,g.cos(u),[]);u=f.scale(m,g.sin(u),[]);r=f.scale(f.normalize(f.add(r,u,[])),this.distUse);b.push(this.pos[0]+j[0]+r[0],this.pos[1]+j[1]+r[1],this.pos[2]+j[2]+r[2]);d.push(0,0,0);b.push(this.pos[0]-j[0]+r[0],this.pos[1]-j[1]+r[1],this.pos[2]-j[2]+r[2]);d.push(0,0,0);k.push(--a,a+1,a,a+2);this.storeData(b,d,k)};b.getText=function(){f.add(this.pos,f.scale(this.vecText,
this.distUse+0.3,[]));return{pos:this.pos,value:[j.angleBounds(this.torsion,!0,!0).toFixed(2)," \u00b0"].join("")}}})(ChemDoodle.ELEMENT,ChemDoodle.math,ChemDoodle.extensions,ChemDoodle.structures.d3,Math,ChemDoodle.lib.mat4,ChemDoodle.lib.vec3);
(function(b,j,m,l,g,d,f,a){var e=function(a,b,e){var f=g.sqrt(b[1]*b[1]+b[2]*b[2]),j=[1,0,0,0,0,b[2]/f,-b[1]/f,0,0,b[1]/f,b[2]/f,0,0,0,0,1],l=[1,0,0,0,0,b[2]/f,b[1]/f,0,0,-b[1]/f,b[2]/f,0,0,0,0,1],m=[f,0,-b[0],0,0,1,0,0,b[0],0,f,0,0,0,0,1];b=[f,0,b[0],0,0,1,0,0,-b[0],0,f,0,0,0,0,1];e=[g.cos(e),-g.sin(e),0,0,g.sin(e),g.cos(e),0,0,0,0,1,0,0,0,0,1];var u=d.multiply(j,d.multiply(m,d.multiply(e,d.multiply(b,l,[]))));this.rotate=function(){return d.multiplyVec3(u,a)}};l.Tube=function(l,k,q){var n=l[0].lineSegments[0].length;
this.partitions=[];var y;this.ends=[];this.ends.push(l[0].lineSegments[0][0]);this.ends.push(l[l.length-2].lineSegments[0][0]);for(var z=[1,0,0],p=0,u=l.length-1;p<u;p++){if(!y||65E3<y.positionData.length)0<this.partitions.length&&p--,y={count:0,positionData:[],normalData:[],indexData:[]},this.partitions.push(y);var r=l[p];y.count++;for(var v=Infinity,w=new m.Atom("",l[p+1].cp1.x,l[p+1].cp1.y,l[p+1].cp1.z),A=0;A<n;A++){var B=r.lineSegments[0][A],c;c=A===n-1?p===l.length-2?r.lineSegments[0][A-1]:l[p+
1].lineSegments[0][0]:r.lineSegments[0][A+1];c=[c.x-B.x,c.y-B.y,c.z-B.z];f.normalize(c);p===l.length-2&&A===n-1&&f.scale(c,-1);var h=f.cross(c,z,[]);f.normalize(h);f.scale(h,k/2);h=new e(h,c,2*Math.PI/q);c=0;for(var D=q;c<D;c++){var C=h.rotate();c===g.floor(q/4)&&(z=[C[0],C[1],C[2]]);y.normalData.push(C[0],C[1],C[2]);y.positionData.push(B.x+C[0],B.y+C[1],B.z+C[2])}w&&(c=B.distance3D(w),c<v&&(v=c,l[p+1].pPoint=B))}}z=0;for(r=this.partitions.length;z<r;z++){y=this.partitions[z];p=0;for(u=y.count-1;p<
u;p++){v=p*n*q;A=0;for(w=n;A<w;A++){B=v+A*q;for(c=0;c<q;c++)h=B+c,y.indexData.push(h),y.indexData.push(h+q),y.indexData.push(h+q+1),y.indexData.push(h),y.indexData.push(h+q+1),y.indexData.push(h+1)}}}this.storeData(this.partitions[0].positionData,this.partitions[0].normalData,this.partitions[0].indexData);q=[new m.Point(2,0)];for(p=0;60>p;p++)n=p/60*g.PI,q.push(new m.Point(2*g.cos(n),-2*g.sin(n)));q.push(new m.Point(-2,0),new m.Point(-2,4),new m.Point(2,4));var H=new m.d3.Shape(q,1);this.render=function(c,
e){this.bindBuffers(c);c.material.setDiffuseColor(e.macro_colorByChain?this.chainColor:e.nucleics_tubeColor);c.drawElements(c.TRIANGLES,this.vertexIndexBuffer.numItems,c.UNSIGNED_SHORT,0);if(this.partitions)for(var h=1,n=this.partitions.length;h<n;h++){var q=this.partitions[h],u=c,p=q;u.bindBuffer(u.ARRAY_BUFFER,p.vertexPositionBuffer);u.vertexAttribPointer(u.shader.vertexPositionAttribute,p.vertexPositionBuffer.itemSize,u.FLOAT,!1,0,0);u.bindBuffer(u.ARRAY_BUFFER,p.vertexNormalBuffer);u.vertexAttribPointer(u.shader.vertexNormalAttribute,
p.vertexNormalBuffer.itemSize,u.FLOAT,!1,0,0);u.bindBuffer(u.ELEMENT_ARRAY_BUFFER,p.vertexIndexBuffer);c.drawElements(c.TRIANGLES,q.vertexIndexBuffer.numItems,c.UNSIGNED_SHORT,0)}c.sphereBuffer.bindBuffers(c);for(h=0;2>h;h++)q=this.ends[h],q=d.translate(c.modelViewMatrix,[q.x,q.y,q.z],[]),n=k/2,d.scale(q,[n,n,n]),c.setMatrixUniforms(q),c.drawElements(c.TRIANGLES,c.sphereBuffer.vertexIndexBuffer.numItems,c.UNSIGNED_SHORT,0);c.cylinderBuffer.bindBuffers(c);h=1;for(n=l.length-1;h<n;h++){var p=l[h],r=
p.pPoint,y=new m.Atom("",p.cp2.x,p.cp2.y,p.cp2.z),q=1.001*r.distance3D(y),p=[k/4,q,k/4],q=d.translate(c.modelViewMatrix,[r.x,r.y,r.z],[]),v=[0,1,0],w=0,u=[y.x-r.x,y.y-r.y,y.z-r.z];r.x===y.x&&r.z===y.z?(v=[0,0,1],r.y<r.y&&(w=g.PI)):(w=b.vec3AngleFrom(v,u),v=f.cross(v,u,[]));0!==w&&d.rotate(q,w,v);d.scale(q,p);c.setMatrixUniforms(q);c.drawArrays(c.TRIANGLE_STRIP,0,c.cylinderBuffer.vertexPositionBuffer.numItems)}H.bindBuffers(c);"none"===e.nucleics_residueColor&&!e.macro_colorByChain&&c.material.setDiffuseColor(e.nucleics_baseColor);
h=1;for(n=l.length-1;h<n;h++)p=l[h],y=p.cp2,q=d.translate(c.modelViewMatrix,[y.x,y.y,y.z],[]),v=[0,1,0],w=0,r=p.cp3,u=[r.x-y.x,r.y-y.y,r.z-y.z],y.x===r.x&&y.z===r.z?(v=[0,0,1],y.y<y.y&&(w=g.PI)):(w=b.vec3AngleFrom(v,u),v=f.cross(v,u,[])),0!==w&&d.rotate(q,w,v),y=[1,0,0],w=d.rotate(d.identity([]),w,v),d.multiplyVec3(w,y),w=p.cp4,r=p.cp5,w.y===r.y&&w.z===r.z||(w=[r.x-w.x,r.y-w.y,r.z-w.z],r=b.vec3AngleFrom(y,w),0>f.dot(u,f.cross(y,w))&&(r*=-1),d.rotateY(q,r)),e.macro_colorByChain||("shapely"===e.nucleics_residueColor?
j[p.name]?c.material.setDiffuseColor(j[p.name].shapelyColor):c.material.setDiffuseColor(j["*"].shapelyColor):"rainbow"===e.nucleics_residueColor&&c.material.setDiffuseColor(a.rainbowAt(h,n,e.macro_rainbowColors))),c.setMatrixUniforms(q),c.drawElements(c.TRIANGLES,H.vertexIndexBuffer.numItems,c.UNSIGNED_SHORT,0)}};l.Tube.prototype=new l._Mesh})(ChemDoodle.extensions,ChemDoodle.RESIDUE,ChemDoodle.structures,ChemDoodle.structures.d3,Math,ChemDoodle.lib.mat4,ChemDoodle.lib.vec3,ChemDoodle.math);
(function(b){b.UnitCell=function(b){var m=[],l=[],g=function(b,a,d,g){m.push(b[0],b[1],b[2]);m.push(a[0],a[1],a[2]);m.push(d[0],d[1],d[2]);m.push(g[0],g[1],g[2]);for(b=0;4>b;b++)l.push(0,0,0)};g(b.o,b.x,b.xy,b.y);g(b.o,b.y,b.yz,b.z);g(b.o,b.z,b.xz,b.x);g(b.yz,b.y,b.xy,b.xyz);g(b.xyz,b.xz,b.z,b.yz);g(b.xy,b.x,b.xz,b.xyz);b=[];for(g=0;6>g;g++){var d=4*g;b.push(d,d+1,d+1,d+2,d+2,d+3,d+3,d)}this.storeData(m,l,b)};b.UnitCell.prototype=new b._Mesh})(ChemDoodle.structures.d3,ChemDoodle.lib.vec3);
(function(b,j,m){b.Plate=function(b){this.lanes=Array(b);i=0;for(ii=b;i<ii;i++)this.lanes[i]=[]};var l=b.Plate.prototype;l.sort=function(){i=0;for(ii=this.lanes.length;i<ii;i++)this.lanes[i].sort(function(b,d){return b-d})};l.draw=function(b){var d=b.canvas.width,f=b.canvas.height;this.origin=9*f/10;this.front=f/10;this.laneLength=this.origin-this.front;b.strokeStyle="#000000";b.beginPath();b.moveTo(0,this.front);j.contextHashTo(b,0,this.front,d,this.front,3,3);b.closePath();b.stroke();b.beginPath();
b.moveTo(0,this.origin);b.lineTo(d,this.origin);b.closePath();b.stroke();i=0;for(ii=this.lanes.length;i<ii;i++){f=(i+1)*d/(ii+1);b.beginPath();b.moveTo(f,this.origin);b.lineTo(f,this.origin+3);b.closePath();b.stroke();s=0;for(ss=this.lanes[i].length;s<ss;s++){var a=this.origin-this.laneLength*this.lanes[i][s].rf;switch(this.lanes[i][s].type){case "compact":b.beginPath();b.arc(f,a,3,0,2*m.PI,!1);b.closePath();break;case "expanded":b.beginPath();b.arc(f,a,7,0,2*m.PI,!1);b.closePath();break;case "widened":j.contextOval(b,
f-18,a-10,36,10);break;case "cresent":b.beginPath(),b.arc(f,a,9,0,m.PI,!0),b.closePath()}switch(this.lanes[i][s].style){case "solid":b.fillStyle="#000000";b.fill();break;case "transparent":b.stroke()}}}};b.Plate.Spot=function(b,d,f){this.type=b;this.rf=d;this.style=f?f:"solid"}})(ChemDoodle.structures,ChemDoodle.extensions,Math);
(function(b,j,m){b.default_backgroundColor="#FFFFFF";b.default_scale=1;b.default_rotateAngle=0;b.default_bondLength_2D=20;b.default_angstromsPerBondLength=1.25;b.default_lightDirection_3D=[-0.1,-0.1,-1];b.default_lightDiffuseColor_3D="#FFFFFF";b.default_lightSpecularColor_3D="#FFFFFF";b.default_projectionPerspective_3D=!0;b.default_projectionPerspectiveVerticalFieldOfView_3D=45;b.default_projectionOrthoWidth_3D=40;b.default_projectionWidthHeightRatio_3D=void 0;b.default_projectionFrontCulling_3D=
0.1;b.default_projectionBackCulling_3D=1E4;b.default_cullBackFace_3D=!0;b.default_fog_mode_3D=0;b.default_fog_color_3D="#000000";b.default_fog_start_3D=0;b.default_fog_end_3D=1;b.default_fog_density_3D=1;b.default_atoms_display=!0;b.default_atoms_color="#000000";b.default_atoms_font_size_2D=12;b.default_atoms_font_families_2D=["Helvetica","Arial","Dialog"];b.default_atoms_font_bold_2D=!1;b.default_atoms_font_italic_2D=!1;b.default_atoms_circles_2D=!1;b.default_atoms_circleDiameter_2D=10;b.default_atoms_circleBorderWidth_2D=
1;b.default_atoms_lonePairDistance_2D=8;b.default_atoms_lonePairSpread_2D=4;b.default_atoms_lonePairDiameter_2D=1;b.default_atoms_useJMOLColors=!1;b.default_atoms_usePYMOLColors=!1;b.default_atoms_resolution_3D=60;b.default_atoms_sphereDiameter_3D=0.8;b.default_atoms_useVDWDiameters_3D=!1;b.default_atoms_vdwMultiplier_3D=1;b.default_atoms_materialAmbientColor_3D="#000000";b.default_atoms_materialSpecularColor_3D="#555555";b.default_atoms_materialShininess_3D=32;b.default_atoms_implicitHydrogens_2D=
!0;b.default_atoms_displayTerminalCarbonLabels_2D=!1;b.default_atoms_showHiddenCarbons_2D=!0;b.default_atoms_showAttributedCarbons_2D=!0;b.default_atoms_displayAllCarbonLabels_2D=!1;b.default_atoms_nonBondedAsStars_3D=!1;b.default_atoms_displayLabels_3D=!1;b.default_atoms_HBlack_2D=!0;b.default_bonds_display=!0;b.default_bonds_color="#000000";b.default_bonds_width_2D=1;b.default_bonds_saturationWidth_2D=0.2;b.default_bonds_ends_2D="round";b.default_bonds_useJMOLColors=!1;b.default_bonds_usePYMOLColors=
!1;b.default_bonds_colorGradient=!1;b.default_bonds_saturationAngle_2D=m.PI/3;b.default_bonds_symmetrical_2D=!1;b.default_bonds_clearOverlaps_2D=!1;b.default_bonds_overlapClearWidth_2D=0.5;b.default_bonds_atomLabelBuffer_2D=1;b.default_bonds_wedgeThickness_2D=0.22;b.default_bonds_hashWidth_2D=1;b.default_bonds_hashSpacing_2D=2.5;b.default_bonds_dotSize_2D=2;b.default_bonds_lewisStyle_2D=!1;b.default_bonds_showBondOrders_3D=!1;b.default_bonds_resolution_3D=60;b.default_bonds_renderAsLines_3D=!1;b.default_bonds_cylinderDiameter_3D=
0.3;b.default_bonds_pillLatitudeResolution_3D=10;b.default_bonds_pillLongitudeResolution_3D=20;b.default_bonds_pillHeight_3D=0.3;b.default_bonds_pillSpacing_3D=0.1;b.default_bonds_pillDiameter_3D=0.3;b.default_bonds_materialAmbientColor_3D="#222222";b.default_bonds_materialSpecularColor_3D="#555555";b.default_bonds_materialShininess_3D=32;b.default_proteins_displayRibbon=!0;b.default_proteins_displayBackbone=!1;b.default_proteins_backboneThickness=1.5;b.default_proteins_backboneColor="#CCCCCC";b.default_proteins_ribbonCartoonize=
!1;b.default_proteins_residueColor="none";b.default_proteins_primaryColor="#FF0D0D";b.default_proteins_secondaryColor="#FFFF30";b.default_proteins_ribbonCartoonHelixPrimaryColor="#00E740";b.default_proteins_ribbonCartoonHelixSecondaryColor="#9905FF";b.default_proteins_ribbonCartoonSheetColor="#E8BB99";b.default_proteins_ribbonThickness=0.2;b.default_proteins_verticalResolution=10;b.default_proteins_horizontalResolution=9;b.default_proteins_materialAmbientColor_3D="#222222";b.default_proteins_materialSpecularColor_3D=
"#555555";b.default_proteins_materialShininess_3D=32;b.default_nucleics_display=!0;b.default_nucleics_tubeColor="#CCCCCC";b.default_nucleics_baseColor="#C10000";b.default_nucleics_residueColor="none";b.default_nucleics_tubeThickness=1.5;b.default_nucleics_tubeResolution_3D=60;b.default_nucleics_verticalResolution=10;b.default_nucleics_materialAmbientColor_3D="#222222";b.default_nucleics_materialSpecularColor_3D="#555555";b.default_nucleics_materialShininess_3D=32;b.default_macro_displayAtoms=!1;b.default_macro_displayBonds=
!1;b.default_macro_atomToLigandDistance=-1;b.default_macro_showWater=!1;b.default_macro_colorByChain=!1;b.default_macro_rainbowColors=["#0000FF","#00FFFF","#00FF00","#FFFF00","#FF0000"];b.default_surfaces_display=!0;b.default_surfaces_style="Dot";b.default_surfaces_color="#E9B862";b.default_surfaces_materialAmbientColor_3D="#000000";b.default_surfaces_materialSpecularColor_3D="#000000";b.default_surfaces_materialShininess_3D=32;b.default_crystals_displayUnitCell=!0;b.default_crystals_unitCellColor=
"green";b.default_crystals_unitCellLineWidth=1;b.default_plots_color="#000000";b.default_plots_width=1;b.default_plots_showIntegration=!1;b.default_plots_integrationColor="#c10000";b.default_plots_integrationLineWidth=1;b.default_plots_showGrid=!1;b.default_plots_gridColor="gray";b.default_plots_gridLineWidth=0.5;b.default_plots_showYAxis=!0;b.default_plots_flipXAxis=!1;b.default_text_font_size=12;b.default_text_font_families=["Helvetica","Arial","Dialog"];b.default_text_font_bold=!0;b.default_text_font_italic=
!1;b.default_text_font_stroke_3D=!0;b.default_text_color="#000000";b.default_shapes_color="#000000";b.default_shapes_lineWidth_2D=1;b.default_shapes_arrowLength_2D=8;b.default_compass_display=!1;b.default_compass_axisXColor_3D="#FF0000";b.default_compass_axisYColor_3D="#00FF00";b.default_compass_axisZColor_3D="#0000FF";b.default_compass_size_3D=50;b.default_compass_resolution_3D=10;b.default_compass_displayText_3D=!0;b.default_compass_type_3D=0;b.default_measurement_update_3D=!1;b.default_measurement_angleBands_3D=
10;b.default_measurement_displayText_3D=!0;j.VisualSpecifications=function(){this.backgroundColor=b.default_backgroundColor;this.scale=b.default_scale;this.rotateAngle=b.default_rotateAngle;this.bondLength=b.default_bondLength_2D;this.angstromsPerBondLength=b.default_angstromsPerBondLength;this.lightDirection_3D=b.default_lightDirection_3D.slice(0);this.lightDiffuseColor_3D=b.default_lightDiffuseColor_3D;this.lightSpecularColor_3D=b.default_lightSpecularColor_3D;this.projectionPerspective_3D=b.default_projectionPerspective_3D;
this.projectionPerspectiveVerticalFieldOfView_3D=b.default_projectionPerspectiveVerticalFieldOfView_3D;this.projectionOrthoWidth_3D=b.default_projectionOrthoWidth_3D;this.projectionWidthHeightRatio_3D=b.default_projectionWidthHeightRatio_3D;this.projectionFrontCulling_3D=b.default_projectionFrontCulling_3D;this.projectionBackCulling_3D=b.default_projectionBackCulling_3D;this.cullBackFace_3D=b.default_cullBackFace_3D;this.fog_mode_3D=b.default_fog_mode_3D;this.fog_color_3D=b.default_fog_color_3D;this.fog_start_3D=
b.default_fog_start_3D;this.fog_end_3D=b.default_fog_end_3D;this.fog_density_3D=b.default_fog_density_3D;this.atoms_display=b.default_atoms_display;this.atoms_color=b.default_atoms_color;this.atoms_font_size_2D=b.default_atoms_font_size_2D;this.atoms_font_families_2D=b.default_atoms_font_families_2D.slice(0);this.atoms_font_bold_2D=b.default_atoms_font_bold_2D;this.atoms_font_italic_2D=b.default_atoms_font_italic_2D;this.atoms_circles_2D=b.default_atoms_circles_2D;this.atoms_circleDiameter_2D=b.default_atoms_circleDiameter_2D;
this.atoms_circleBorderWidth_2D=b.default_atoms_circleBorderWidth_2D;this.atoms_lonePairDistance_2D=b.default_atoms_lonePairDistance_2D;this.atoms_lonePairSpread_2D=b.default_atoms_lonePairSpread_2D;this.atoms_lonePairDiameter_2D=b.default_atoms_lonePairDiameter_2D;this.atoms_useJMOLColors=b.default_atoms_useJMOLColors;this.atoms_usePYMOLColors=b.default_atoms_usePYMOLColors;this.atoms_resolution_3D=b.default_atoms_resolution_3D;this.atoms_sphereDiameter_3D=b.default_atoms_sphereDiameter_3D;this.atoms_useVDWDiameters_3D=
b.default_atoms_useVDWDiameters_3D;this.atoms_vdwMultiplier_3D=b.default_atoms_vdwMultiplier_3D;this.atoms_materialAmbientColor_3D=b.default_atoms_materialAmbientColor_3D;this.atoms_materialSpecularColor_3D=b.default_atoms_materialSpecularColor_3D;this.atoms_materialShininess_3D=b.default_atoms_materialShininess_3D;this.atoms_implicitHydrogens_2D=b.default_atoms_implicitHydrogens_2D;this.atoms_displayTerminalCarbonLabels_2D=b.default_atoms_displayTerminalCarbonLabels_2D;this.atoms_showHiddenCarbons_2D=
b.default_atoms_showHiddenCarbons_2D;this.atoms_showAttributedCarbons_2D=b.default_atoms_showAttributedCarbons_2D;this.atoms_displayAllCarbonLabels_2D=b.default_atoms_displayAllCarbonLabels_2D;this.atoms_nonBondedAsStars_3D=b.default_atoms_nonBondedAsStars_3D;this.atoms_displayLabels_3D=b.default_atoms_displayLabels_3D;this.atoms_HBlack_2D=b.default_atoms_HBlack_2D;this.bonds_display=b.default_bonds_display;this.bonds_color=b.default_bonds_color;this.bonds_width_2D=b.default_bonds_width_2D;this.bonds_saturationWidth_2D=
b.default_bonds_saturationWidth_2D;this.bonds_ends_2D=b.default_bonds_ends_2D;this.bonds_useJMOLColors=b.default_bonds_useJMOLColors;this.bonds_usePYMOLColors=b.default_bonds_usePYMOLColors;this.bonds_colorGradient=b.default_bonds_colorGradient;this.bonds_saturationAngle_2D=b.default_bonds_saturationAngle_2D;this.bonds_symmetrical_2D=b.default_bonds_symmetrical_2D;this.bonds_clearOverlaps_2D=b.default_bonds_clearOverlaps_2D;this.bonds_overlapClearWidth_2D=b.default_bonds_overlapClearWidth_2D;this.bonds_atomLabelBuffer_2D=
b.default_bonds_atomLabelBuffer_2D;this.bonds_wedgeThickness_2D=b.default_bonds_wedgeThickness_2D;this.bonds_hashWidth_2D=b.default_bonds_hashWidth_2D;this.bonds_hashSpacing_2D=b.default_bonds_hashSpacing_2D;this.bonds_dotSize_2D=b.default_bonds_dotSize_2D;this.bonds_lewisStyle_2D=b.default_bonds_lewisStyle_2D;this.bonds_showBondOrders_3D=b.default_bonds_showBondOrders_3D;this.bonds_resolution_3D=b.default_bonds_resolution_3D;this.bonds_renderAsLines_3D=b.default_bonds_renderAsLines_3D;this.bonds_cylinderDiameter_3D=
b.default_bonds_cylinderDiameter_3D;this.bonds_pillHeight_3D=b.default_bonds_pillHeight_3D;this.bonds_pillLatitudeResolution_3D=b.default_bonds_pillLatitudeResolution_3D;this.bonds_pillLongitudeResolution_3D=b.default_bonds_pillLongitudeResolution_3D;this.bonds_pillSpacing_3D=b.default_bonds_pillSpacing_3D;this.bonds_pillDiameter_3D=b.default_bonds_pillDiameter_3D;this.bonds_materialAmbientColor_3D=b.default_bonds_materialAmbientColor_3D;this.bonds_materialSpecularColor_3D=b.default_bonds_materialSpecularColor_3D;
this.bonds_materialShininess_3D=b.default_bonds_materialShininess_3D;this.proteins_displayRibbon=b.default_proteins_displayRibbon;this.proteins_displayBackbone=b.default_proteins_displayBackbone;this.proteins_backboneThickness=b.default_proteins_backboneThickness;this.proteins_backboneColor=b.default_proteins_backboneColor;this.proteins_ribbonCartoonize=b.default_proteins_ribbonCartoonize;this.proteins_residueColor=b.default_proteins_residueColor;this.proteins_primaryColor=b.default_proteins_primaryColor;
this.proteins_secondaryColor=b.default_proteins_secondaryColor;this.proteins_ribbonCartoonHelixPrimaryColor=b.default_proteins_ribbonCartoonHelixPrimaryColor;this.proteins_ribbonCartoonHelixSecondaryColor=b.default_proteins_ribbonCartoonHelixSecondaryColor;this.proteins_ribbonCartoonSheetColor=b.default_proteins_ribbonCartoonSheetColor;this.proteins_ribbonThickness=b.default_proteins_ribbonThickness;this.proteins_verticalResolution=b.default_proteins_verticalResolution;this.proteins_horizontalResolution=
b.default_proteins_horizontalResolution;this.proteins_materialAmbientColor_3D=b.default_proteins_materialAmbientColor_3D;this.proteins_materialSpecularColor_3D=b.default_proteins_materialSpecularColor_3D;this.proteins_materialShininess_3D=b.default_proteins_materialShininess_3D;this.macro_displayAtoms=b.default_macro_displayAtoms;this.macro_displayBonds=b.default_macro_displayBonds;this.macro_atomToLigandDistance=b.default_macro_atomToLigandDistance;this.nucleics_display=b.default_nucleics_display;
this.nucleics_tubeColor=b.default_nucleics_tubeColor;this.nucleics_baseColor=b.default_nucleics_baseColor;this.nucleics_residueColor=b.default_nucleics_residueColor;this.nucleics_tubeThickness=b.default_nucleics_tubeThickness;this.nucleics_tubeResolution_3D=b.default_nucleics_tubeResolution_3D;this.nucleics_verticalResolution=b.default_nucleics_verticalResolution;this.nucleics_materialAmbientColor_3D=b.default_nucleics_materialAmbientColor_3D;this.nucleics_materialSpecularColor_3D=b.default_nucleics_materialSpecularColor_3D;
this.nucleics_materialShininess_3D=b.default_nucleics_materialShininess_3D;this.macro_showWater=b.default_macro_showWater;this.macro_colorByChain=b.default_macro_colorByChain;this.macro_rainbowColors=b.default_macro_rainbowColors.slice(0);this.surfaces_display=b.default_surfaces_display;this.surfaces_style=b.default_surfaces_style;this.surfaces_color=b.default_surfaces_color;this.surfaces_materialAmbientColor_3D=b.default_surfaces_materialAmbientColor_3D;this.surfaces_materialSpecularColor_3D=b.default_surfaces_materialSpecularColor_3D;
this.surfaces_materialShininess_3D=b.default_surfaces_materialShininess_3D;this.crystals_displayUnitCell=b.default_crystals_displayUnitCell;this.crystals_unitCellColor=b.default_crystals_unitCellColor;this.crystals_unitCellLineWidth=b.default_crystals_unitCellLineWidth;this.plots_color=b.default_plots_color;this.plots_width=b.default_plots_width;this.plots_showIntegration=b.default_plots_showIntegration;this.plots_integrationColor=b.default_plots_integrationColor;this.plots_integrationLineWidth=b.default_plots_integrationLineWidth;
this.plots_showGrid=b.default_plots_showGrid;this.plots_gridColor=b.default_plots_gridColor;this.plots_gridLineWidth=b.default_plots_gridLineWidth;this.plots_showYAxis=b.default_plots_showYAxis;this.plots_flipXAxis=b.default_plots_flipXAxis;this.text_font_size=b.default_text_font_size;this.text_font_families=b.default_text_font_families.slice(0);this.text_font_bold=b.default_text_font_bold;this.text_font_italic=b.default_text_font_italic;this.text_font_stroke_3D=b.default_text_font_stroke_3D;this.text_color=
b.default_text_color;this.shapes_color=b.default_shapes_color;this.shapes_lineWidth_2D=b.default_shapes_lineWidth_2D;this.shapes_arrowLength_2D=b.default_shapes_arrowLength_2D;this.compass_display=b.default_compass_display;this.compass_axisXColor_3D=b.default_compass_axisXColor_3D;this.compass_axisYColor_3D=b.default_compass_axisYColor_3D;this.compass_axisZColor_3D=b.default_compass_axisZColor_3D;this.compass_size_3D=b.default_compass_size_3D;this.compass_resolution_3D=b.default_compass_resolution_3D;
this.compass_displayText_3D=b.default_compass_displayText_3D;this.compass_type_3D=b.default_compass_type_3D;this.measurement_update_3D=b.default_measurement_update_3D;this.measurement_angleBands_3D=b.default_measurement_angleBands_3D;this.measurement_displayText_3D=b.default_measurement_displayText_3D};j.VisualSpecifications.prototype.set3DRepresentation=function(j){this.bonds_display=this.atoms_display=!0;this.bonds_color="#777777";this.bonds_showBondOrders_3D=this.bonds_useJMOLColors=this.atoms_useJMOLColors=
this.atoms_useVDWDiameters_3D=!0;this.bonds_renderAsLines_3D=!1;"Ball and Stick"===j?(this.atoms_vdwMultiplier_3D=0.3,this.bonds_useJMOLColors=!1,this.bonds_cylinderDiameter_3D=0.3,this.bonds_materialAmbientColor_3D=b.default_atoms_materialAmbientColor_3D,this.bonds_pillDiameter_3D=0.15):"van der Waals Spheres"===j?(this.bonds_display=!1,this.atoms_vdwMultiplier_3D=1):"Stick"===j?(this.bonds_showBondOrders_3D=this.atoms_useVDWDiameters_3D=!1,this.bonds_cylinderDiameter_3D=this.atoms_sphereDiameter_3D=
0.8,this.bonds_materialAmbientColor_3D=this.atoms_materialAmbientColor_3D):"Wireframe"===j?(this.atoms_useVDWDiameters_3D=!1,this.bonds_cylinderDiameter_3D=this.bonds_pillDiameter_3D=0.05,this.atoms_sphereDiameter_3D=0.15,this.bonds_materialAmbientColor_3D=b.default_atoms_materialAmbientColor_3D):"Line"===j?(this.atoms_display=!1,this.bonds_renderAsLines_3D=!0,this.bonds_width_2D=1,this.bonds_cylinderDiameter_3D=0.05):alert('"'+j+'" is not recognized. Use one of the following strings:\n\n1. Ball and Stick\n2. van der Waals Spheres\n3. Stick\n4. Wireframe\n5. Line\n')}})(ChemDoodle,
ChemDoodle.structures,Math);
(function(b,j,m,l){m.getPointsPerAngstrom=function(){return b.default_bondLength_2D/b.default_angstromsPerBondLength};m.BondDeducer=function(){};var g=m.BondDeducer.prototype;g.margin=1.1;g.deduceCovalentBonds=function(b,f){var a=m.getPointsPerAngstrom();f&&(a=f);for(var e=0,g=b.atoms.length;e<g;e++)for(var k=e+1;k<g;k++){var q=b.atoms[e],n=b.atoms[k];q.distance3D(n)<(j[q.label].covalentRadius+j[n.label].covalentRadius)*a*this.margin&&b.bonds.push(new l.Bond(q,n,1))}}})(ChemDoodle,ChemDoodle.ELEMENT,
ChemDoodle.informatics,ChemDoodle.structures);(function(b){b.HydrogenDeducer=function(){};b.HydrogenDeducer.prototype.removeHydrogens=function(b){for(var m=[],l=[],g=0,d=b.bonds.length;g<d;g++)"H"!==b.bonds[g].a1.label&&"H"!==b.bonds[g].a2.label&&l.push(b.bonds[g]);g=0;for(d=b.atoms.length;g<d;g++)"H"!==b.atoms[g].label&&m.push(b.atoms[g]);b.atoms=m;b.bonds=l}})(ChemDoodle.informatics);
(function(b,j,m){j.MolecularSurfaceGenerator=function(){};j.MolecularSurfaceGenerator.prototype.generateSurface=function(b,g,d,f,a){return new m.MolecularSurface(b,g,d,f,a)}})(ChemDoodle,ChemDoodle.informatics,ChemDoodle.structures.d3);
(function(b,j){b.Splitter=function(){};b.Splitter.prototype.split=function(b){for(var l=[],g=0,d=b.atoms.length;g<d;g++)b.atoms[g].visited=!1;g=0;for(d=b.bonds.length;g<d;g++)b.bonds[g].visited=!1;g=0;for(d=b.atoms.length;g<d;g++){var f=b.atoms[g];if(!f.visited){var a=new j.Molecule;a.atoms.push(f);f.visited=!0;var e=new j.Queue;for(e.enqueue(f);!e.isEmpty();)for(var f=e.dequeue(),t=0,k=b.bonds.length;t<k;t++){var q=b.bonds[t];q.contains(f)&&!q.visited&&(q.visited=!0,a.bonds.push(q),q=q.getNeighbor(f),
q.visited||(q.visited=!0,a.atoms.push(q),e.enqueue(q)))}l.push(a)}}return l}})(ChemDoodle.informatics,ChemDoodle.structures);(function(b,j){b.StructureBuilder=function(){};b.StructureBuilder.prototype.copy=function(b){var l=new j.JSONInterpreter;return l.molFrom(l.molTo(b))}})(ChemDoodle.informatics,ChemDoodle.io,ChemDoodle.structures);
(function(b){b._Counter=function(){};b=b._Counter.prototype;b.value=0;b.molecule=void 0;b.setMolecule=function(b){this.value=0;this.molecule=b;this.innerCalculate&&this.innerCalculate()}})(ChemDoodle.informatics);(function(b){b.FrerejacqueNumberCounter=function(b){this.setMolecule(b)};(b.FrerejacqueNumberCounter.prototype=new b._Counter).innerCalculate=function(){this.value=this.molecule.bonds.length-this.molecule.atoms.length+(new b.NumberOfMoleculesCounter(this.molecule)).value}})(ChemDoodle.informatics);
(function(b,j){j.NumberOfMoleculesCounter=function(b){this.setMolecule(b)};(j.NumberOfMoleculesCounter.prototype=new j._Counter).innerCalculate=function(){for(var j=0,l=this.molecule.atoms.length;j<l;j++)this.molecule.atoms[j].visited=!1;j=0;for(l=this.molecule.atoms.length;j<l;j++)if(!this.molecule.atoms[j].visited){this.value++;var g=new b.Queue;this.molecule.atoms[j].visited=!0;for(g.enqueue(this.molecule.atoms[j]);!g.isEmpty();)for(var d=g.dequeue(),f=0,a=this.molecule.bonds.length;f<a;f++){var e=
this.molecule.bonds[f];e.contains(d)&&(e=e.getNeighbor(d),e.visited||(e.visited=!0,g.enqueue(e)))}}}})(ChemDoodle.structures,ChemDoodle.informatics);
(function(b){b._RingFinder=function(){};b=b._RingFinder.prototype;b.atoms=void 0;b.bonds=void 0;b.rings=void 0;b.reduce=function(b){for(var m=0,l=b.atoms.length;m<l;m++)b.atoms[m].visited=!1;m=0;for(l=b.bonds.length;m<l;m++)b.bonds[m].visited=!1;for(var g=!0;g;){g=!1;m=0;for(l=b.atoms.length;m<l;m++){for(var d=0,f,a=0,e=b.bonds.length;a<e;a++)if(b.bonds[a].contains(b.atoms[m])&&!b.bonds[a].visited){d++;if(2===d)break;f=b.bonds[a]}1===d&&(g=!0,f.visited=!0,b.atoms[m].visited=!0)}}m=0;for(l=b.atoms.length;m<
l;m++)b.atoms[m].visited||this.atoms.push(b.atoms[m]);m=0;for(l=b.bonds.length;m<l;m++)b.bonds[m].visited||this.bonds.push(b.bonds[m]);0===this.bonds.length&&0!==this.atoms.length&&(this.atoms=[])};b.setMolecule=function(b){this.atoms=[];this.bonds=[];this.rings=[];this.reduce(b);2<this.atoms.length&&this.innerGetRings&&this.innerGetRings()};b.fuse=function(){for(var b=0,m=this.rings.length;b<m;b++)for(var l=0,g=this.bonds.length;l<g;l++)-1!==this.rings[b].atoms.indexOf(this.bonds[l].a1)&&-1!==this.rings[b].atoms.indexOf(this.bonds[l].a2)&&
this.rings[b].bonds.push(this.bonds[l])}})(ChemDoodle.informatics);
(function(b,j){function m(b,d){this.atoms=[];if(d)for(var f=0,a=d.atoms.length;f<a;f++)this.atoms[f]=d.atoms[f];this.atoms.push(b)}var l=m.prototype;l.grow=function(b,d){for(var f=this.atoms[this.atoms.length-1],a=[],e=0,j=b.length;e<j;e++)if(b[e].contains(f)){var k=b[e].getNeighbor(f);-1===d.indexOf(k)&&a.push(k)}f=[];e=0;for(j=a.length;e<j;e++)f.push(new m(a[e],this));return f};l.check=function(b,d,f){for(var a=0,e=d.atoms.length-1;a<e;a++)if(-1!==this.atoms.indexOf(d.atoms[a]))return;var l;if(d.atoms[d.atoms.length-
1]===this.atoms[this.atoms.length-1]){l=new j.Ring;l.atoms[0]=f;a=0;for(e=this.atoms.length;a<e;a++)l.atoms.push(this.atoms[a]);for(a=d.atoms.length-2;0<=a;a--)l.atoms.push(d.atoms[a])}else{for(var k=[],a=0,e=b.length;a<e;a++)b[a].contains(d.atoms[d.atoms.length-1])&&k.push(b[a]);a=0;for(e=k.length;a<e;a++)if((1===d.atoms.length||!k[a].contains(d.atoms[d.atoms.length-2]))&&k[a].contains(this.atoms[this.atoms.length-1])){l=new j.Ring;l.atoms[0]=f;b=0;for(f=this.atoms.length;b<f;b++)l.atoms.push(this.atoms[b]);
for(b=d.atoms.length-1;0<=b;b--)l.atoms.push(d.atoms[b]);break}}return l};b.EulerFacetRingFinder=function(b){this.setMolecule(b)};l=b.EulerFacetRingFinder.prototype=new b._RingFinder;l.fingerBreak=5;l.innerGetRings=function(){for(var b=0,d=this.atoms.length;b<d;b++){for(var f=[],a=0,e=this.bonds.length;a<e;a++)this.bonds[a].contains(this.atoms[b])&&f.push(this.bonds[a].getNeighbor(this.atoms[b]));a=0;for(e=f.length;a<e;a++)for(var j=a+1;j<f.length;j++){var k=[];k[0]=new m(f[a]);k[1]=new m(f[j]);var l=
[];l[0]=this.atoms[b];for(var n=0,y=f.length;n<y;n++)n!==a&&n!==j&&l.push(f[n]);var z=[];for((n=k[0].check(this.bonds,k[1],this.atoms[b]))&&(z[0]=n);0===z.length&&0<k.length&&k[0].atoms.length<this.fingerBreak;){for(var p=[],n=0,y=k.length;n<y;n++)for(var u=k[n].grow(this.bonds,l),r=0,v=u.length;r<v;r++)p.push(u[r]);k=p;n=0;for(y=k.length;n<y;n++)for(r=n+1;r<y;r++)(v=k[n].check(this.bonds,k[r],this.atoms[b]))&&z.push(v);if(0===z.length){p=[];n=0;for(y=l.length;n<y;n++){r=0;for(v=this.bonds.length;r<
v;r++)this.bonds[r].contains(l[n])&&(f=this.bonds[r].getNeighbor(l[n]),-1===l.indexOf(f)&&-1===p.indexOf(f)&&p.push(f))}n=0;for(y=p.length;n<y;n++)l.push(p[n])}}if(0<z.length){k=void 0;n=0;for(y=z.length;n<y;n++)if(!k||k.atoms.length>z[n].atoms.length)k=z[n];z=!1;n=0;for(y=this.rings.length;n<y;n++){l=!0;r=0;for(v=k.atoms.length;r<v;r++)if(-1===this.rings[n].atoms.indexOf(k.atoms[r])){l=!1;break}if(l){z=!0;break}}z||this.rings.push(k)}}}this.fuse()}})(ChemDoodle.informatics,ChemDoodle.structures);
(function(b){b.SSSRFinder=function(j){this.rings=[];if(0<j.atoms.length){var m=(new b.FrerejacqueNumberCounter(j)).value,l=(new b.EulerFacetRingFinder(j)).rings;l.sort(function(a,b){return a.atoms.length-b.atoms.length});for(var g=0,d=j.bonds.length;g<d;g++)j.bonds[g].visited=!1;g=0;for(d=l.length;g<d;g++){j=!1;for(var f=0,a=l[g].bonds.length;f<a;f++)if(!l[g].bonds[f].visited){j=!0;break}if(j){f=0;for(a=l[g].bonds.length;f<a;f++)l[g].bonds[f].visited=!0;this.rings.push(l[g])}if(this.rings.length===
m)break}}}})(ChemDoodle.informatics);(function(b){b._Interpreter=function(){};b._Interpreter.prototype.fit=function(b,m,l){for(var g=b.length,d=[],f=0;f<m-g;f++)d.push(" ");return l?b+d.join(""):d.join("")+b}})(ChemDoodle.io);
(function(b,j,m,l,g,d){var f=/\s+/g,a=/\(|\)|\s+/g,e=/\'|\s+/g,t=/,|\'|\s+/g,k=/^\s+/,q=/[0-9]/g,n=/[0-9]|\+|\-/g,y=function(a){return 0!==a.length},z={P:[],A:[[0,0.5,0.5]],B:[[0.5,0,0.5]],C:[[0.5,0.5,0]],I:[[0.5,0.5,0.5]],R:[[2/3,1/3,1/3],[1/3,2/3,2/3]],S:[[1/3,1/3,2/3],[2/3,2/3,1/3]],T:[[1/3,2/3,1/3],[2/3,1/3,2/3]],F:[[0,0.5,0.5],[0.5,0,0.5],[0.5,0.5,0]]},p=function(a){var b=0,d=0,e=0,f=0,c=a.indexOf("x"),g=a.indexOf("y"),k=a.indexOf("z");-1!==c&&(d++,0<c&&"+"!==a.charAt(c-1)&&(d*=-1));-1!==g&&
(e++,0<g&&"+"!==a.charAt(g-1)&&(e*=-1));-1!==k&&(f++,0<k&&"+"!==a.charAt(k-1)&&(f*=-1));if(2<a.length){c="+";g=0;for(k=a.length;g<k;g++){var n=a.charAt(g);if(("-"===n||"/"===n)&&(g===a.length-1||a.charAt(g+1).match(q)))c=n;n.match(q)&&("+"===c?b+=parseInt(n):"-"===c?b-=parseInt(n):"/"===c&&(b/=parseInt(n)))}}return[b,d,e,f]};m.CIFInterpreter=function(){};(m.CIFInterpreter.prototype=new m._Interpreter).read=function(q,m,u,A){m=m?m:1;u=u?u:1;A=A?A:1;var B=new l.Molecule;if(!q)return B;for(var c=q.split("\n"),
h=0,D=0,C=0,H=q=0,F=0,G="P",K,I,W,E,N=!0;0<c.length;)if(N?E=c.shift():N=!0,0<E.length)if(j.stringStartsWith(E,"_cell_length_a"))h=parseFloat(E.split(a)[1]);else if(j.stringStartsWith(E,"_cell_length_b"))D=parseFloat(E.split(a)[1]);else if(j.stringStartsWith(E,"_cell_length_c"))C=parseFloat(E.split(a)[1]);else if(j.stringStartsWith(E,"_cell_angle_alpha"))q=g.PI*parseFloat(E.split(a)[1])/180;else if(j.stringStartsWith(E,"_cell_angle_beta"))H=g.PI*parseFloat(E.split(a)[1])/180;else if(j.stringStartsWith(E,
"_cell_angle_gamma"))F=g.PI*parseFloat(E.split(a)[1])/180;else if(j.stringStartsWith(E,"_symmetry_space_group_name_H-M"))G=E.split(e)[1];else if(j.stringStartsWith(E,"loop_")){for(var P={fields:[],lines:[]},ca=!1;void 0!==(E=c.shift())&&!j.stringStartsWith(E=E.replace(k,""),"loop_")&&0<E.length;)if(j.stringStartsWith(E,"_")){if(ca)break;P.fields=P.fields.concat(E.split(f).filter(y))}else ca=!0,P.lines.push(E);if(0!==c.length&&(j.stringStartsWith(E,"loop_")||j.stringStartsWith(E,"_")))N=!1;-1!==P.fields.indexOf("_symmetry_equiv_pos_as_xyz")||
-1!==P.fields.indexOf("_space_group_symop_operation_xyz")?K=P:-1!==P.fields.indexOf("_atom_site_label")?I=P:-1!==P.fields.indexOf("_geom_bond_atom_site_label_1")&&(W=P)}E=h;q=(g.cos(q)-g.cos(F)*g.cos(H))/g.sin(F);q=[E,0,0,0,D*g.cos(F),D*g.sin(F),0,0,C*g.cos(H),C*q,C*g.sqrt(1-g.pow(g.cos(H),2)-q*q),0,0,0,0,1];if(I){P=N=h=c=C=-1;F=0;for(H=I.fields.length;F<H;F++)E=I.fields[F],"_atom_site_type_symbol"===E?C=F:"_atom_site_label"===E?c=F:"_atom_site_fract_x"===E?h=F:"_atom_site_fract_y"===E?N=F:"_atom_site_fract_z"===
E&&(P=F);F=0;for(H=I.lines.length;F<H;F++)E=I.lines[F],D=E.split(f).filter(y),E=new l.Atom(D[-1===C?c:C].split(n)[0],parseFloat(D[h]),parseFloat(D[N]),parseFloat(D[P])),B.atoms.push(E),-1!==c&&(E.cifId=D[c],E.cifPart=0)}if(K&&!W){F=D=0;for(H=K.fields.length;F<H;F++)if(E=K.fields[F],"_symmetry_equiv_pos_as_xyz"===E||"_space_group_symop_operation_xyz"===E)D=F;N=z[G];c=[];F=0;for(H=K.lines.length;F<H;F++){E=K.lines[F].split(t).filter(y);for(var P=p(E[D]),ca=p(E[D+1]),da=p(E[D+2]),G=0,h=B.atoms.length;G<
h;G++){E=B.atoms[G];var U=E.x*P[1]+E.y*P[2]+E.z*P[3]+P[0],S=E.x*ca[1]+E.y*ca[2]+E.z*ca[3]+ca[0],ja=E.x*da[1]+E.y*da[2]+E.z*da[3]+da[0];I=new l.Atom(E.label,U,S,ja);c.push(I);void 0!==E.cifId&&(I.cifId=E.cifId,I.cifPart=F+1);if(N){I=0;for(C=N.length;I<C;I++){var aa=N[I],aa=new l.Atom(E.label,U+aa[0],S+aa[1],ja+aa[2]);c.push(aa);void 0!==E.cifId&&(aa.cifId=E.cifId,aa.cifPart=F+1)}}}}F=0;for(H=c.length;F<H;F++){for(E=c[F];1<=E.x;)E.x--;for(;0>E.x;)E.x++;for(;1<=E.y;)E.y--;for(;0>E.y;)E.y++;for(;1<=E.z;)E.z--;
for(;0>E.z;)E.z++}I=[];F=0;for(H=c.length;F<H;F++){C=!1;E=c[F];G=0;for(h=B.atoms.length;G<h;G++)if(1E-4>B.atoms[G].distance3D(E)){C=!0;break}if(!C){G=0;for(h=I.length;G<h;G++)if(1E-4>I[G].distance3D(E)){C=!0;break}C||I.push(E)}}B.atoms=B.atoms.concat(I)}H=[];for(F=0;F<m;F++)for(G=0;G<u;G++)for(I=0;I<A;I++)if(!(0===F&&0===G&&0===I)){C=0;for(D=B.atoms.length;C<D;C++)E=B.atoms[C],c=new l.Atom(E.label,E.x+F,E.y+G,E.z+I),H.push(c),void 0!==E.cifId&&(c.cifId=E.cifId,c.cifPart=E.cifPart+(K?K.lines.length:
0)+F+10*G+100*I)}B.atoms=B.atoms.concat(H);F=0;for(H=B.atoms.length;F<H;F++)E=B.atoms[F],K=d.multiplyVec3(q,[E.x,E.y,E.z]),E.x=K[0],E.y=K[1],E.z=K[2];if(W){c=K=-1;F=0;for(H=W.fields.length;F<H;F++)E=W.fields[F],"_geom_bond_atom_site_label_1"===E?K=F:"_geom_bond_atom_site_label_2"===E&&(c=F);I=0;for(C=W.lines.length;I<C;I++){D=W.lines[I].split(f).filter(y);E=D[K];D=D[c];F=0;for(H=B.atoms.length;F<H;F++)for(G=F+1;G<H;G++){h=B.atoms[F];N=B.atoms[G];if(h.cifPart!==N.cifPart)break;(h.cifId===E&&N.cifId===
D||h.cifId===D&&N.cifId===E)&&B.bonds.push(new l.Bond(h,N))}}}else(new b.informatics.BondDeducer).deduceCovalentBonds(B,1);m=[-m/2,-u/2,-A/2];B.unitCellVectors={o:d.multiplyVec3(q,m,[]),x:d.multiplyVec3(q,[m[0]+1,m[1],m[2]]),y:d.multiplyVec3(q,[m[0],m[1]+1,m[2]]),z:d.multiplyVec3(q,[m[0],m[1],m[2]+1]),xy:d.multiplyVec3(q,[m[0]+1,m[1]+1,m[2]]),xz:d.multiplyVec3(q,[m[0]+1,m[1],m[2]+1]),yz:d.multiplyVec3(q,[m[0],m[1]+1,m[2]+1]),xyz:d.multiplyVec3(q,[m[0]+1,m[1]+1,m[2]+1])};return B};var u=new m.CIFInterpreter;
b.readCIF=function(a,b,d,e){return u.read(a,b,d,e)}})(ChemDoodle,ChemDoodle.extensions,ChemDoodle.io,ChemDoodle.structures,Math,ChemDoodle.lib.mat4,ChemDoodle.lib.vec3);
(function(b,j,m,l){j.CMLInterpreter=function(){};var g=j.CMLInterpreter.prototype=new j._Interpreter;g.read=function(b){var a=[];b=l.parseXML(b);b=l(b).find("cml");for(var d=0,g=b.length;d<g;d++)for(var k=l(b[d]).find("molecule"),j=0,n=k.length;j<n;j++){for(var y=a[j]=new m.Molecule,z=[],p=l(k[j]).find("atom"),u=0,r=p.length;u<r;u++){var v=l(p[u]),w=v.attr("elementType"),A,B,c;void 0==v.attr("x2")?(A=v.attr("x3"),B=v.attr("y3"),c=v.attr("z3")):(A=v.attr("x2"),B=v.attr("y2"),c=0);w=a[j].atoms[u]=new m.Atom(w,
A,B,c);z[u]=v.attr("id");void 0!=v.attr("formalCharge")&&(w.charge=v.attr("formalCharge"))}p=l(k[j]).find("bond");u=0;for(r=p.length;u<r;u++){v=l(p[u]);A=v.attr("atomRefs2").split(" ");w=y.atoms[l.inArray(A[0],z)];A=y.atoms[l.inArray(A[1],z)];switch(v.attr("order")){case "2":case "D":B=2;break;case "3":case "T":B=3;break;case "A":B=1.5;break;default:B=1}w=a[j].bonds[u]=new m.Bond(w,A,B);switch(v.find("bondStereo").text()){case "W":w.stereo=m.Bond.STEREO_PROTRUDING;break;case "H":w.stereo=m.Bond.STEREO_RECESSED}}}return a};
g.write=function(b){var a=[];a.push('\x3c?xml version\x3d"1.0" encoding\x3d"UTF-8"?\x3e\n');a.push('\x3ccml convention\x3d"conventions:molecular" xmlns\x3d"http://www.xml-cml.org/schema" xmlns:conventions\x3d"http://www.xml-cml.org/convention/" xmlns:dc\x3d"http://purl.org/dc/elements/1.1/"\x3e\n');for(var d=0,g=b.length;d<g;d++){a.push('\x3cmolecule id\x3d"m');a.push(d);a.push('"\x3e');a.push("\x3catomArray\x3e");for(var k=0,j=b[d].atoms.length;k<j;k++){var n=b[d].atoms[k];a.push('\x3catom elementType\x3d"');
a.push(n.label);a.push('" id\x3d"a');a.push(k);a.push('" ');a.push('x3\x3d"');a.push(n.x);a.push('" y3\x3d"');a.push(n.y);a.push('" z3\x3d"');a.push(n.z);a.push('" ');0!=n.charge&&(a.push('formalCharge\x3d"'),a.push(n.charge),a.push('" '));a.push("/\x3e")}a.push("\x3c/atomArray\x3e");a.push("\x3cbondArray\x3e");k=0;for(j=b[d].bonds.length;k<j;k++){n=b[d].bonds[k];a.push('\x3cbond atomRefs2\x3d"a');a.push(b[d].atoms.indexOf(n.a1));a.push(" a");a.push(b[d].atoms.indexOf(n.a2));a.push('" order\x3d"');
switch(n.bondOrder){case 1.5:a.push("A");break;case 1:case 2:case 3:a.push(n.bondOrder);break;default:a.push("S")}a.push('"/\x3e')}a.push("\x3c/bondArray\x3e");a.push("\x3c/molecule\x3e")}a.push("\x3c/cml\x3e");return a.join("")};var d=new j.CMLInterpreter;b.readCML=function(b){return d.read(b)};b.writeCML=function(b){return d.write(b)}})(ChemDoodle,ChemDoodle.io,ChemDoodle.structures,ChemDoodle.lib.jQuery);
(function(b,j,m,l){m.MOLInterpreter=function(){};var g=m.MOLInterpreter.prototype=new m._Interpreter;g.read=function(d,a){a||(a=b.default_bondLength_2D);var e=new l.Molecule;if(!d)return e;for(var g=d.split("\n"),k=g[3],m=parseInt(k.substring(0,3)),k=parseInt(k.substring(3,6)),n=0;n<m;n++){var y=g[4+n];e.atoms[n]=new l.Atom(y.substring(31,34),parseFloat(y.substring(0,10))*a,(1===a?1:-1)*parseFloat(y.substring(10,20))*a,parseFloat(y.substring(20,30))*a);var z=parseInt(y.substring(34,36));0!==z&&j[e.atoms[n].label]&&
(e.atoms[n].mass=j[e.atoms[n].label].mass+z);switch(parseInt(y.substring(36,39))){case 1:e.atoms[n].charge=3;break;case 2:e.atoms[n].charge=2;break;case 3:e.atoms[n].charge=1;break;case 5:e.atoms[n].charge=-1;break;case 6:e.atoms[n].charge=-2;break;case 7:e.atoms[n].charge=-3}}for(n=0;n<k;n++){var y=g[4+m+n],p=parseInt(y.substring(6,9)),z=parseInt(y.substring(9,12));if(3<p)switch(p){case 4:p=1.5;break;default:p=1}y=new l.Bond(e.atoms[parseInt(y.substring(0,3))-1],e.atoms[parseInt(y.substring(3,6))-
1],p);switch(z){case 3:y.stereo=l.Bond.STEREO_AMBIGUOUS;break;case 1:y.stereo=l.Bond.STEREO_PROTRUDING;break;case 6:y.stereo=l.Bond.STEREO_RECESSED}e.bonds[n]=y}return e};g.write=function(d){var a=[];a.push("Molecule from ChemDoodle Web Components\n\nhttp://www.ichemlabs.com\n");a.push(this.fit(d.atoms.length.toString(),3));a.push(this.fit(d.bonds.length.toString(),3));a.push("  0  0  0  0            999 V2000\n");for(var e=d.getCenter(),g=0,k=d.atoms.length;g<k;g++){var m=d.atoms[g],n=" 0";if(-1!==
m.mass&&j[m.label]){var y=m.mass-j[m.label].mass;5>y&&-4<y&&(n=(-1<y?" ":"")+y)}y="  0";if(0!==m.charge)switch(m.charge){case 3:y="  1";break;case 2:y="  2";break;case 1:y="  3";break;case -1:y="  5";break;case -2:y="  6";break;case -3:y="  7"}a.push(this.fit(((m.x-e.x)/b.default_bondLength_2D).toFixed(4),10));a.push(this.fit((-(m.y-e.y)/b.default_bondLength_2D).toFixed(4),10));a.push(this.fit((m.z/b.default_bondLength_2D).toFixed(4),10));a.push(" ");a.push(this.fit(m.label,3,!0));a.push(n);a.push(y);
a.push("  0  0  0  0\n")}g=0;for(k=d.bonds.length;g<k;g++){m=d.bonds[g];e=0;m.stereo===l.Bond.STEREO_AMBIGUOUS?e=3:m.stereo===l.Bond.STEREO_PROTRUDING?e=1:m.stereo===l.Bond.STEREO_RECESSED&&(e=6);a.push(this.fit((d.atoms.indexOf(m.a1)+1).toString(),3));a.push(this.fit((d.atoms.indexOf(m.a2)+1).toString(),3));m=m.bondOrder;if(1.5==m)m=4;else if(3<m||0!=m%1)m=1;a.push(this.fit(m,3));a.push("  ");a.push(e);a.push("     0  0\n")}a.push("M  END");return a.join("")};var d=new m.MOLInterpreter;b.readMOL=
function(b,a){return d.read(b,a)};b.writeMOL=function(b){return d.write(b)}})(ChemDoodle,ChemDoodle.ELEMENT,ChemDoodle.io,ChemDoodle.structures);
(function(b,j,m,l,g,d,f){function a(a,b,d,e,f){for(var g=0,j=b.length;g<j;g++){var l=b[g];if(l.id===d&&e>=l.start&&e<=l.end){f?a.helix=!0:a.sheet=!0;e+1===l.end&&(a.arrow=!0);break}}}m.PDBInterpreter=function(){};var e=m.PDBInterpreter.prototype=new m._Interpreter;e.calculateRibbonDistances=!1;e.deduceResidueBonds=!1;e.read=function(e,m){var n=new l.Molecule;n.chains=[];if(!e)return n;var t=e.split("\n");m||(m=1);for(var z=[],p=[],u,r=[],v=[],w=[],A=0,B=t.length;A<B;A++){var c=t[A];if(j.stringStartsWith(c,
"HELIX"))z.push({id:c.substring(19,20),start:parseInt(c.substring(21,25)),end:parseInt(c.substring(33,37))});else if(j.stringStartsWith(c,"SHEET"))p.push({id:c.substring(21,22),start:parseInt(c.substring(22,26)),end:parseInt(c.substring(33,37))});else if(j.stringStartsWith(c,"ATOM")){var h=c.substring(16,17);if(" "===h||"A"===h){h=d(c.substring(76,78));if(0===h.length){var D=d(c.substring(12,14));"HD"===D?h="H":0<D.length&&(h=1<D.length?D.charAt(0)+D.substring(1).toLowerCase():D)}D=new l.Atom(h,parseFloat(c.substring(30,
38))*m,parseFloat(c.substring(38,46))*m,parseFloat(c.substring(46,54))*m);D.hetatm=!1;v.push(D);var C=parseInt(c.substring(22,26));if(0===r.length)for(h=0;2>h;h++){var H=new l.Residue(-1);H.cp1=D;H.cp2=D;r.push(H)}C!==Number.NaN&&r[r.length-1].resSeq!==C&&(h=new l.Residue(C),h.name=d(c.substring(17,20)),3===h.name.length?h.name=h.name.substring(0,1)+h.name.substring(1).toLowerCase():2===h.name.length&&"D"===h.name.charAt(0)&&(h.name=h.name.substring(1)),r.push(h),H=c.substring(21,22),a(h,z,H,C,!0),
a(h,p,H,C,!1));c=d(c.substring(12,16));h=r[r.length-1];if("CA"===c||"P"===c||"O5'"===c)h.cp1||(h.cp1=D);else if("N3"===c&&("C"===h.name||"U"===h.name||"T"===h.name)||"N1"===c&&("A"===h.name||"G"===h.name))h.cp3=D;else if("C2"===c)h.cp4=D;else if("C4"===c&&("C"===h.name||"U"===h.name||"T"===h.name)||"C6"===c&&("A"===h.name||"G"===h.name))h.cp5=D;else if("O"===c||"C6"===c&&("C"===h.name||"U"===h.name||"T"===h.name)||"N9"===c){if(!r[r.length-1].cp2){if("C6"===c||"N9"===c)u=D;h.cp2=D}}else"C"===c&&(u=
D)}}else if(j.stringStartsWith(c,"HETATM"))h=d(c.substring(76,78)),0===h.length&&(h=d(c.substring(12,16))),1<h.length&&(h=h.substring(0,1)+h.substring(1).toLowerCase()),h=new l.Atom(h,parseFloat(c.substring(30,38))*m,parseFloat(c.substring(38,46))*m,parseFloat(c.substring(46,54))*m),h.hetatm=!0,"HOH"===d(c.substring(17,20))&&(h.isWater=!0),n.atoms.push(h),w[parseInt(d(c.substring(6,11)))]=h;else if(j.stringStartsWith(c,"CONECT")){if(h=parseInt(d(c.substring(6,11))),w[h]){D=w[h];for(C=0;4>C;C++)if(h=
d(c.substring(11+5*C,16+5*C)),0!==h.length&&(h=parseInt(h),w[h])){for(var H=w[h],F=!1,h=0,G=n.bonds.length;h<G;h++){var K=n.bonds[h];if(K.a1===D&&K.a2===H||K.a1===H&&K.a2===D){F=!0;break}}F||n.bonds.push(new l.Bond(D,H))}}}else if(j.stringStartsWith(c,"TER"))this.endChain(n,r,u,v),r=[];else if(j.stringStartsWith(c,"ENDMDL"))break}this.endChain(n,r,u,v);0===n.bonds.size&&(new b.informatics.BondDeducer).deduceCovalentBonds(n,m);if(this.deduceResidueBonds){A=0;for(B=v.length;A<B;A++){t=f.min(B,A+20);
for(h=A+1;h<t;h++)z=v[A],p=v[h],z.distance3D(p)<1.1*(g[z.label].covalentRadius+g[p.label].covalentRadius)&&n.bonds.push(new l.Bond(z,p,1))}}n.atoms=n.atoms.concat(v);this.calculateRibbonDistances&&this.calculateDistances(n,v);return n};e.endChain=function(a,b,d,e){if(0<b.length){var f=b[b.length-1];f.cp1||(f.cp1=e[e.length-2]);f.cp2||(f.cp2=e[e.length-1]);for(e=0;4>e;e++)f=new l.Residue(-1),f.cp1=d,f.cp2=b[b.length-1].cp2,b.push(f);a.chains.push(b)}};e.calculateDistances=function(a,b){for(var d=[],
e=0,f=a.atoms.length;e<f;e++){var g=a.atoms[e];g.hetatm&&(g.isWater||d.push(g))}e=0;for(f=b.length;e<f;e++)if(g=b[e],g.closestDistance=Number.POSITIVE_INFINITY,0===d.length)g.closestDistance=0;else for(var j=0,l=d.length;j<l;j++)g.closestDistance=Math.min(g.closestDistance,g.distance3D(d[j]))};var t=new m.PDBInterpreter;b.readPDB=function(a,b){return t.read(a,b)}})(ChemDoodle,ChemDoodle.extensions,ChemDoodle.io,ChemDoodle.structures,ChemDoodle.ELEMENT,ChemDoodle.lib.jQuery.trim,Math);
(function(b,j,m,l,g,d){var f={"@":0,A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,a:-1,b:-2,c:-3,d:-4,e:-5,f:-6,g:-7,h:-8,i:-9},a={"%":0,J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,j:-1,k:-2,l:-3,m:-4,n:-5,o:-6,p:-7,q:-8,r:-9},e={S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8,s:9};m.JCAMPInterpreter=function(){};g=m.JCAMPInterpreter.prototype=new m._Interpreter;g.convertHZ2PPM=!1;g.read=function(b){this.isBreak=function(c){return void 0!==f[c]||void 0!==a[c]||void 0!==e[c]||" "===c||"-"===c||"+"===c};this.getValue=function(c,b){var d=
c.charAt(0),e=c.substring(1);return void 0!==f[d]?parseFloat(f[d]+e):void 0!==a[d]?parseFloat(a[d]+e)+b:parseFloat(e)};var g=new l.Spectrum;if(void 0===b||0===b.length)return g;b=b.split("\n");for(var n=[],m,t,p,u,r=1,v=1,w=1,A=-1,B=-1,c=-1,h=!0,D=!1,C=0,H=b.length;C<H;C++){var F=d(b[C]),G=F.indexOf("$$");-1!==G&&(F=F.substring(0,G));if(0===n.length||!j.stringStartsWith(b[C],"##"))0!==n.length&&n.push("\n"),n.push(d(F));else if(G=n.join(""),h&&100>G.length&&g.metadata.push(G),n=[F],j.stringStartsWith(G,
"##TITLE\x3d"))g.title=d(G.substring(8));else if(j.stringStartsWith(G,"##XUNITS\x3d"))g.xUnit=d(G.substring(9)),this.convertHZ2PPM&&"HZ"===g.xUnit.toUpperCase()&&(g.xUnit="PPM",D=!0);else if(j.stringStartsWith(G,"##YUNITS\x3d"))g.yUnit=d(G.substring(9));else if(!j.stringStartsWith(G,"##XYPAIRS\x3d"))if(j.stringStartsWith(G,"##FIRSTX\x3d"))t=parseFloat(d(G.substring(9)));else if(j.stringStartsWith(G,"##LASTX\x3d"))m=parseFloat(d(G.substring(8)));else if(j.stringStartsWith(G,"##FIRSTY\x3d"))p=parseFloat(d(G.substring(9)));
else if(j.stringStartsWith(G,"##NPOINTS\x3d"))u=parseFloat(d(G.substring(10)));else if(j.stringStartsWith(G,"##XFACTOR\x3d"))r=parseFloat(d(G.substring(10)));else if(j.stringStartsWith(G,"##YFACTOR\x3d"))v=parseFloat(d(G.substring(10)));else if(j.stringStartsWith(G,"##DELTAX\x3d"))A=parseFloat(d(G.substring(9)));else if(j.stringStartsWith(G,"##.OBSERVE FREQUENCY\x3d"))this.convertHZ2PPM&&(w=parseFloat(d(G.substring(21))));else if(j.stringStartsWith(G,"##.SHIFT REFERENCE\x3d"))this.convertHZ2PPM&&
(c=G.substring(19).split(","),B=parseInt(d(c[2])),c=parseFloat(d(c[3])));else if(j.stringStartsWith(G,"##XYDATA\x3d")){D||(w=1);var F=h=!1,G=G.split("\n"),K=(m-t)/(u-1);if(-1!==A)for(var I=1,W=G.length;I<W;I++)if("|"===G[I].charAt(0)){K=A;break}for(var E=t-K,N=p,P=0,ca,I=1,W=G.length;I<W;I++){for(var da=[],E=d(G[I]),n=[],U=!1,S=0,ja=E.length;S<ja;S++)this.isBreak(E.charAt(S))?(0<n.length&&!(1===n.length&&" "===n[0])&&da.push(n.join("")),n=[E.charAt(S)]):"|"===E.charAt(S)?U=!0:n.push(E.charAt(S));
da.push(n.join(""));E=parseFloat(da[0])*r-K;S=1;for(ja=da.length;S<ja;S++)if(N=da[S],void 0!==e[N.charAt(0)])for(var aa=parseInt(e[N.charAt(0)]+N.substring(1))-1,Sa=0;Sa<aa;Sa++)E+=K,P=this.getValue(ca,P),N=P*v,$++,g.data[g.data.length-1]=new l.Point(E/w,N);else void 0!==f[N.charAt(0)]&&F?(N=this.getValue(N,P)*v,U&&(E+=K,g.data.push(new l.Point(E/w,N)))):(F=void 0!==a[N.charAt(0)],ca=N,E+=K,P=this.getValue(N,P),N=P*v,$++,g.data.push(new l.Point(E/w,N)))}if(-1!==B){F=c-g.data[B-1].x;C=0;for(H=g.data.length;C<
H;C++)g.data[C].x+=F}}else if(j.stringStartsWith(G,"##PEAK TABLE\x3d")){h=!1;g.continuous=!1;for(var G=G.split("\n"),$=0,I=1,W=G.length;I<W;I++){F=G[I].split(/[\s,]+/);$+=F.length/2;S=0;for(ja=F.length;S+1<ja;S+=2)g.data.push(new l.Point(parseFloat(d(F[S])),parseFloat(d(F[S+1]))))}}}g.setup();return g};var t=new m.JCAMPInterpreter;t.convertHZ2PPM=!0;b.readJCAMP=function(a){return t.read(a)}})(ChemDoodle,ChemDoodle.extensions,ChemDoodle.io,ChemDoodle.structures,ChemDoodle.lib.jQuery,ChemDoodle.lib.jQuery.trim);
(function(b,j,m,l,g,d){j.JSONInterpreter=function(){};var f=j.JSONInterpreter.prototype;f.contentTo=function(a,b){for(var d=0,f=0,g=0,j=a.length;g<j;g++){for(var l=a[g],m=0,u=l.atoms.length;m<u;m++)l.atoms[m].tmpid="a"+d++;m=0;for(u=l.bonds.length;m<u;m++)l.bonds[m].tmpid="b"+f++}g=d=0;for(j=b.length;g<j;g++)b[g].tmpid="s"+d++;d={};if(a&&0<a.length){d.m=[];g=0;for(j=a.length;g<j;g++)d.m.push(this.molTo(a[g]))}if(b&&0<b.length){d.s=[];g=0;for(j=b.length;g<j;g++)d.s.push(this.shapeTo(b[g]))}g=0;for(j=
a.length;g<j;g++){l=a[g];m=0;for(u=l.atoms.length;m<u;m++)l.atoms[m].tmpid=void 0;m=0;for(u=l.bonds.length;m<u;m++)l.bonds[m].tmpid=void 0}g=0;for(j=b.length;g<j;g++)b[g].tmpid=void 0;return d};f.contentFrom=function(a){var b={molecules:[],shapes:[]};if(a.m)for(var d=0,f=a.m.length;d<f;d++)b.molecules.push(this.molFrom(a.m[d]));if(a.s){d=0;for(f=a.s.length;d<f;d++)b.shapes.push(this.shapeFrom(a.s[d],b.molecules))}d=0;for(f=b.molecules.length;d<f;d++){a=b.molecules[d];for(var g=0,j=a.atoms.length;g<
j;g++)a.atoms[g].tmpid=void 0;g=0;for(j=a.bonds.length;g<j;g++)a.bonds[g].tmpid=void 0}d=0;for(f=b.shapes.length;d<f;d++)b.shapes[d].tmpid=void 0;return b};f.molTo=function(a){for(var b={a:[]},d=0,f=a.atoms.length;d<f;d++){var g=a.atoms[d],j={x:g.x,y:g.y};g.tmpid&&(j.i=g.tmpid);"C"!==g.label&&(j.l=g.label);0!==g.z&&(j.z=g.z);0!==g.charge&&(j.c=g.charge);-1!==g.mass&&(j.m=g.mass);0!==g.numRadical&&(j.r=g.numRadical);0!==g.numLonePair&&(j.p=g.numLonePair);g.any&&(j.q=!0);-1!==g.rgroup&&(j.rg=g.rgroup);
b.a.push(j)}if(0<a.bonds.length){b.b=[];d=0;for(f=a.bonds.length;d<f;d++)g=a.bonds[d],j={b:a.atoms.indexOf(g.a1),e:a.atoms.indexOf(g.a2)},g.tmpid&&(j.i=g.tmpid),1!==g.bondOrder&&(j.o=g.bondOrder),g.stereo!==m.Bond.STEREO_NONE&&(j.s=g.stereo),b.b.push(j)}return b};f.molFrom=function(a){for(var b=new m.Molecule,d=0,f=a.a.length;d<f;d++){var g=a.a[d],j=new m.Atom(g.l?g.l:"C",g.x,g.y);g.i&&(j.tmpid=g.i);g.z&&(j.z=g.z);g.c&&(j.charge=g.c);g.m&&(j.mass=g.m);g.r&&(j.numRadical=g.r);g.p&&(j.numLonePair=g.p);
g.q&&(j.any=!0);g.rg&&(j.rgroup=g.rg);void 0!==g.p_h&&(j.hetatm=g.p_h);void 0!==g.p_w&&(j.isWater=g.p_w);void 0!==g.p_d&&(j.closestDistance=g.p_d);b.atoms.push(j)}if(a.b){d=0;for(f=a.b.length;d<f;d++)g=a.b[d],j=new m.Bond(b.atoms[g.b],b.atoms[g.e],void 0===g.o?1:g.o),g.i&&(j.tmpid=g.i),g.s&&(j.stereo=g.s),b.bonds.push(j)}return b};f.shapeTo=function(a){var b={};a.tmpid&&(b.i=a.tmpid);a instanceof l.Line?(b.t="Line",b.x1=a.p1.x,b.y1=a.p1.y,b.x2=a.p2.x,b.y2=a.p2.y,b.a=a.arrowType):a instanceof l.Pusher?
(b.t="Pusher",b.o1=a.o1.tmpid,b.o2=a.o2.tmpid,1!==a.numElectron&&(b.e=a.numElectron)):a instanceof l.Bracket?(b.t="Bracket",b.x1=a.p1.x,b.y1=a.p1.y,b.x2=a.p2.x,b.y2=a.p2.y,0!==a.charge&&(b.c=a.charge),0!==a.mult&&(b.m=a.mult),0!==a.repeat&&(b.r=a.repeat)):a instanceof g.Distance?(b.t="Distance",b.a1=a.a1.tmpid,b.a2=a.a2.tmpid,a.node&&(b.n=a.node,b.o=a.offset)):a instanceof g.Angle?(b.t="Angle",b.a1=a.a1.tmpid,b.a2=a.a2.tmpid,b.a3=a.a3.tmpid):a instanceof g.Torsion&&(b.t="Torsion",b.a1=a.a1.tmpid,
b.a2=a.a2.tmpid,b.a3=a.a3.tmpid,b.a4=a.a4.tmpid);return b};f.shapeFrom=function(a,b){var d;if("Line"===a.t)d=new l.Line(new m.Point(a.x1,a.y1),new m.Point(a.x2,a.y2)),d.arrowType=a.a;else if("Pusher"===a.t){var f,j;d=0;for(var y=b.length;d<y;d++){for(var z=b[d],p=0,u=z.atoms.length;p<u;p++){var r=z.atoms[p];r.tmpid===a.o1?f=r:r.tmpid===a.o2&&(j=r)}p=0;for(u=z.bonds.length;p<u;p++){var v=z.bonds[p];v.tmpid===a.o1?f=v:v.tmpid===a.o2&&(j=v)}}d=new l.Pusher(f,j);a.e&&(d.numElectron=a.e)}else if("Bracket"===
a.t)d=new l.Bracket(new m.Point(a.x1,a.y1),new m.Point(a.x2,a.y2)),void 0!==a.c&&(d.charge=a.c),void 0!==a.m&&(d.mult=a.m),void 0!==a.r&&(d.repeat=a.r);else if("Distance"===a.t){var w;d=0;for(y=b.length;d<y;d++){z=b[d];p=0;for(u=z.atoms.length;p<u;p++)r=z.atoms[p],r.tmpid===a.a1?v=r:r.tmpid===a.a2&&(w=r)}d=new g.Distance(v,w,a.n,a.o)}else if("Angle"===a.t){var A;d=0;for(y=b.length;d<y;d++){z=b[d];p=0;for(u=z.atoms.length;p<u;p++)r=z.atoms[p],r.tmpid===a.a1?v=r:r.tmpid===a.a2?w=r:r.tmpid===a.a3&&(A=
r)}d=new g.Angle(v,w,A)}else if("Torsion"===a.t){var B;d=0;for(y=b.length;d<y;d++){z=b[d];p=0;for(u=z.atoms.length;p<u;p++)r=z.atoms[p],r.tmpid===a.a1?v=r:r.tmpid===a.a2?w=r:r.tmpid===a.a3?A=r:r.tmpid===a.a4&&(B=r)}d=new g.Torsion(v,w,A,B)}return d};f.pdbFrom=function(a){var b=this.molFrom(a.mol);b.findRings=!1;b.fromJSON=!0;b.chains=this.chainsFrom(a.ribbons);return b};f.chainsFrom=function(a){for(var b=[],d=0,f=a.cs.length;d<f;d++){for(var g=a.cs[d],j=[],l=0,p=g.length;l<p;l++){var u=g[l],r=new m.Residue;
r.name=u.n;r.cp1=new m.Atom("",u.x1,u.y1,u.z1);r.cp2=new m.Atom("",u.x2,u.y2,u.z2);u.x3&&(r.cp3=new m.Atom("",u.x3,u.y3,u.z3),r.cp4=new m.Atom("",u.x4,u.y4,u.z4),r.cp5=new m.Atom("",u.x5,u.y5,u.z5));r.helix=u.h;r.sheet=u.s;r.arrow=u.a;j.push(r)}b.push(j)}return b};var a=new j.JSONInterpreter;b.readJSON=function(b){var f;try{f=d.parse(b)}catch(g){return}if(f)return f.m||f.s?a.contentFrom(f):f.a?{molecules:[a.molFrom(f)],shapes:[]}:{molecules:[],shapes:[]}};b.writeJSON=function(b,f){return d.stringify(a.contentTo(b,
f))}})(ChemDoodle,ChemDoodle.io,ChemDoodle.structures,ChemDoodle.structures.d2,ChemDoodle.structures.d3,JSON);
(function(b,j,m){j.RXNInterpreter=function(){};var l=j.RXNInterpreter.prototype=new j._Interpreter;l.read=function(d,f){f||(f=b.default_bondLength_2D);var a=[],e;if(d){e=d.split("$MOL\n");for(var g=e[0].split("\n")[4],j=parseInt(g.substring(0,3)),g=parseInt(g.substring(3,6)),l=1,n=0,y=0,z=j+g;y<z;y++){a[y]=b.readMOL(e[l],f);var p=a[y].getBounds(),p=p.maxX-p.minX,n=n-(p+40);l++}y=0;for(z=j;y<z;y++){var p=a[y].getBounds(),p=p.maxX-p.minX,l=a[y].getCenter(),u=0;for(e=a[y].atoms.length;u<e;u++){var r=
a[y].atoms[u];r.x+=n+p/2-l.x;r.y-=l.y}n+=p+40}e=new m.d2.Line(new m.Point(n,0),new m.Point(n+40,0));n+=80;y=j;for(z=j+g;y<z;y++){p=a[y].getBounds();p=p.maxX-p.minX;l=a[y].getCenter();for(u=0;u<a[y].atoms.length;u++)r=a[y].atoms[u],r.x+=n+p/2-l.x,r.y-=l.y;n+=p+40}}else a.push(new m.Molecule),e=new m.d2.Line(new m.Point(-20,0),new m.Point(20,0));e.arrowType=m.d2.Line.ARROW_SYNTHETIC;return{molecules:a,shapes:[e]}};l.write=function(d,f){var a=[[],[]],e=void 0;if(d&&f){g=0;for(j=f.length;g<j;g++)if(f[g]instanceof
m.d2.Line){e=f[g].getPoints();break}if(!e)return"";for(var g=0,j=d.length;g<j;g++)d[g].getCenter().x<e[1].x?a[0].push(d[g]):a[1].push(d[g]);e=[];e.push("$RXN\nReaction from ChemDoodle Web Components\n\nhttp://www.ichemlabs.com\n");e.push(this.fit(a[0].length.toString(),3));e.push(this.fit(a[1].length.toString(),3));e.push("\n");for(g=0;2>g;g++)for(var j=0,l=a[g].length;j<l;j++)e.push("$MOL\n"),e.push(b.writeMOL(a[g][j])),e.push("\n");return e.join("")}};var g=new j.RXNInterpreter;b.readRXN=function(b,
f){return g.read(b,f)};b.writeRXN=function(b,f){return g.write(b,f)}})(ChemDoodle,ChemDoodle.io,ChemDoodle.structures);
(function(b,j,m,l,g,d){l.XYZInterpreter=function(){};j=l.XYZInterpreter.prototype=new l._Interpreter;j.deduceCovalentBonds=!0;j.read=function(a){var e=new g.Molecule;if(!a)return e;a=a.split("\n");for(var f=parseInt(d(a[0])),j=0;j<f;j++){var l=a[j+2].split(/\s+/g);e.atoms[j]=new g.Atom(isNaN(l[0])?l[0]:m[parseInt(l[0])-1],parseFloat(l[1]),parseFloat(l[2]),parseFloat(l[3]))}this.deduceCovalentBonds&&(new b.informatics.BondDeducer).deduceCovalentBonds(e,1);return e};var f=new l.XYZInterpreter;b.readXYZ=
function(a){return f.read(a)}})(ChemDoodle,ChemDoodle.ELEMENT,ChemDoodle.SYMBOLS,ChemDoodle.io,ChemDoodle.structures,ChemDoodle.lib.jQuery.trim);
ChemDoodle.monitor=function(b,j,m){var l={CANVAS_DRAGGING:void 0,CANVAS_OVER:void 0,ALT:!1,SHIFT:!1,META:!1};b.supports_touch()||j(m).ready(function(){j(m).mousemove(function(b){l.CANVAS_DRAGGING&&l.CANVAS_DRAGGING.drag&&(l.CANVAS_DRAGGING.prehandleEvent(b),l.CANVAS_DRAGGING.drag(b))});j(m).mouseup(function(b){l.CANVAS_DRAGGING&&l.CANVAS_DRAGGING!==l.CANVAS_OVER&&l.CANVAS_DRAGGING.mouseup&&(l.CANVAS_DRAGGING.prehandleEvent(b),l.CANVAS_DRAGGING.mouseup(b));l.CANVAS_DRAGGING=void 0});j(m).keydown(function(b){l.SHIFT=
b.shiftKey;l.ALT=b.altKey;l.META=b.metaKey||b.ctrlKey;var d=l.CANVAS_OVER;l.CANVAS_DRAGGING&&(d=l.CANVAS_DRAGGING);d&&d.keydown&&(d.prehandleEvent(b),d.keydown(b))});j(m).keypress(function(b){var d=l.CANVAS_OVER;l.CANVAS_DRAGGING&&(d=l.CANVAS_DRAGGING);d&&d.keypress&&(d.prehandleEvent(b),d.keypress(b))});j(m).keyup(function(b){l.SHIFT=b.shiftKey;l.ALT=b.altKey;l.META=b.metaKey||b.ctrlKey;var d=l.CANVAS_OVER;l.CANVAS_DRAGGING&&(d=l.CANVAS_DRAGGING);d&&d.keyup&&(d.prehandleEvent(b),d.keyup(b))})});
return l}(ChemDoodle.featureDetection,ChemDoodle.lib.jQuery,document);
(function(b,j,m,l,g,d,f,a,e,t){b._Canvas=function(){};var k=b._Canvas.prototype;k.molecules=void 0;k.shapes=void 0;k.emptyMessage=void 0;k.image=void 0;k.repaint=function(){if(!this.test){var a=e.getElementById(this.id);if(a.getContext){var b=a.getContext("2d");1!==this.pixelRatio&&a.width===this.width&&(a.width=this.width*this.pixelRatio,a.height=this.height*this.pixelRatio,b.scale(this.pixelRatio,this.pixelRatio));this.image?b.drawImage(this.image,0,0):(this.specs.backgroundColor&&this.bgCache!==
a.style.backgroundColor&&(a.style.backgroundColor=this.specs.backgroundColor,this.bgCache=a.style.backgroundColor),b.fillStyle=this.specs.backgroundColor,b.fillRect(0,0,this.width,this.height));if(this.innerRepaint)this.innerRepaint(b);else if(0!==this.molecules.length||0!==this.shapes.length){b.save();b.translate(this.width/2,this.height/2);b.rotate(this.specs.rotateAngle);b.scale(this.specs.scale,this.specs.scale);b.translate(-this.width/2,-this.height/2);for(var a=0,d=this.molecules.length;a<d;a++)this.molecules[a].check(!0),
this.molecules[a].draw(b,this.specs);a=0;for(d=this.shapes.length;a<d;a++)this.shapes[a].draw(b,this.specs);b.restore()}else this.emptyMessage&&(b.fillStyle="#737683",b.textAlign="center",b.textBaseline="middle",b.font="18px Helvetica, Verdana, Arial, Sans-serif",b.fillText(this.emptyMessage,this.width/2,this.height/2));this.drawChildExtras&&this.drawChildExtras(b)}}};k.resize=function(a,e){var f=d("#"+this.id);f.attr({width:a,height:e});f.css("width",a);f.css("height",e);this.width=a;this.height=
e;if(b._Canvas3D&&this instanceof b._Canvas3D)this.gl.viewport(0,0,a,e),this.setupScene();else if(0<this.molecules.length){this.center();for(var f=0,g=this.molecules.length;f<g;f++)this.molecules[f].check()}this.repaint()};k.setBackgroundImage=function(a){this.image=new Image;var b=this;this.image.onload=function(){b.repaint()};this.image.src=a};k.loadMolecule=function(a){this.clear();this.molecules.push(a);this.center();b._Canvas3D&&this instanceof b._Canvas3D||a.check();this.afterLoadContent&&this.afterLoadContent();
this.repaint()};k.loadContent=function(a,d){this.molecules=a?a:[];this.shapes=d?d:[];this.center();if(!(b._Canvas3D&&this instanceof b._Canvas3D))for(var e=0,f=this.molecules.length;e<f;e++)this.molecules[e].check();this.afterLoadContent&&this.afterLoadContent();this.repaint()};k.addMolecule=function(a){this.molecules.push(a);b._Canvas3D&&this instanceof b._Canvas3D||a.check();this.repaint()};k.removeMolecule=function(a){this.molecules=d.grep(this.molecules,function(b){return b!==a});this.repaint()};
k.getMolecule=function(){return 0<this.molecules.length?this.molecules[0]:void 0};k.getMolecules=function(){return this.molecules};k.addShape=function(a){this.shapes.push(a);this.repaint()};k.removeShape=function(a){this.shapes=d.grep(this.shapes,function(b){return b!==a});this.repaint()};k.getShapes=function(){return this.shapes};k.clear=function(){this.molecules=[];this.shapes=[];this.specs.scale=1;this.repaint()};k.center=function(){for(var b=this.getContentBounds(),d=new g.Point((this.width-b.minX-
b.maxX)/2,(this.height-b.minY-b.maxY)/2),e=0,f=this.molecules.length;e<f;e++)for(var j=this.molecules[e],k=0,l=j.atoms.length;k<l;k++)j.atoms[k].add(d);e=0;for(f=this.shapes.length;e<f;e++){j=this.shapes[e].getPoints();k=0;for(l=j.length;k<l;k++)j[k].add(d)}this.specs.scale=1;d=b.maxX-b.minX;b=b.maxY-b.minY;if(d>this.width||b>this.height)this.specs.scale=0.85*a.min(this.width/d,this.height/b)};k.bondExists=function(a,b){for(var d=0,e=this.molecules.length;d<e;d++)for(var f=this.molecules[d],g=0,j=
f.bonds.length;g<j;g++){var k=f.bonds[g];if(k.contains(a)&&k.contains(b))return!0}return!1};k.getBond=function(a,b){for(var d=0,e=this.molecules.length;d<e;d++)for(var f=this.molecules[d],g=0,j=f.bonds.length;g<j;g++){var k=f.bonds[g];if(k.contains(a)&&k.contains(b))return k}};k.getMoleculeByAtom=function(a){for(var b=0,d=this.molecules.length;b<d;b++){var e=this.molecules[b];if(-1!==e.atoms.indexOf(a))return e}};k.getAllAtoms=function(){for(var a=[],b=0,d=this.molecules.length;b<d;b++)a=a.concat(this.molecules[b].atoms);
return a};k.getAllPoints=function(){for(var a=[],b=0,d=this.molecules.length;b<d;b++)a=a.concat(this.molecules[b].atoms);b=0;for(d=this.shapes.length;b<d;b++)a=a.concat(this.shapes[b].getPoints());return a};k.getContentBounds=function(){for(var a=new m.Bounds,b=0,d=this.molecules.length;b<d;b++)a.expand(this.molecules[b].getBounds());b=0;for(d=this.shapes.length;b<d;b++)a.expand(this.shapes[b].getBounds());return a};k.create=function(k,n,m){this.id=k;this.width=n;this.height=m;this.molecules=[];this.shapes=
[];if(e.getElementById(k)){var z=d("#"+k);n?z.attr("width",n):this.width=z.attr("width");m?z.attr("height",m):this.height=z.attr("height");z.attr("class","ChemDoodleWebComponent")}else{if(!b.featureDetection.supports_canvas_text()&&f.msie&&"6"<=f.version){e.writeln('\x3cdiv style\x3d"border: 1px solid black;" width\x3d"'+n+'" height\x3d"'+m+'"\x3ePlease install \x3ca href\x3d"http://code.google.com/chrome/chromeframe/"\x3eGoogle Chrome Frame\x3c/a\x3e, then restart Internet Explorer.\x3c/div\x3e');
return}e.writeln('\x3ccanvas class\x3d"ChemDoodleWebComponent" id\x3d"'+k+'" width\x3d"'+n+'" height\x3d"'+m+'" alt\x3d"ChemDoodle Web Component"\x3eThis browser does not support HTML5/Canvas.\x3c/canvas\x3e')}k=d("#"+k);k.css("width",this.width);k.css("height",this.height);this.pixelRatio=t.devicePixelRatio?t.devicePixelRatio:1;this.specs=new g.VisualSpecifications;var p=this;j.supports_touch()?(k.bind("touchstart",function(a){var b=(new Date).getTime();if(!j.supports_gesture()&&2===a.originalEvent.touches.length){var d=
a.originalEvent.touches,e=new g.Point(d[0].pageX,d[0].pageY),d=new g.Point(d[1].pageX,d[1].pageY);p.implementedGestureDist=e.distance(d);p.implementedGestureAngle=e.angle(d);p.gesturestart&&(p.prehandleEvent(a),p.gesturestart(a))}p.lastTouch&&1===a.originalEvent.touches.length&&500>b-p.lastTouch?p.dbltap?(p.prehandleEvent(a),p.dbltap(a)):p.dblclick?(p.prehandleEvent(a),p.dblclick(a)):p.touchstart?(p.prehandleEvent(a),p.touchstart(a)):p.mousedown&&(p.prehandleEvent(a),p.mousedown(a)):p.touchstart?
(p.prehandleEvent(a),p.touchstart(a),this.hold&&clearTimeout(this.hold),this.touchhold&&(this.hold=setTimeout(function(){p.touchhold(a)},1E3))):p.mousedown&&(p.prehandleEvent(a),p.mousedown(a));p.lastTouch=b}),k.bind("touchmove",function(b){this.hold&&(clearTimeout(this.hold),this.hold=void 0);if(!j.supports_gesture()&&2===b.originalEvent.touches.length&&p.gesturechange){var d=b.originalEvent.touches,e=new g.Point(d[0].pageX,d[0].pageY),f=new g.Point(d[1].pageX,d[1].pageY),d=e.distance(f),e=e.angle(f);
b.originalEvent.scale=d/p.implementedGestureDist;b.originalEvent.rotation=180*(p.implementedGestureAngle-e)/a.PI;p.prehandleEvent(b);p.gesturechange(b)}if(1<b.originalEvent.touches.length&&p.multitouchmove){e=b.originalEvent.touches.length;p.prehandleEvent(b);d=new g.Point(-b.offset.left*e,-b.offset.top*e);for(f=0;f<e;f++)d.x+=b.originalEvent.changedTouches[f].pageX,d.y+=b.originalEvent.changedTouches[f].pageY;d.x/=e;d.y/=e;b.p=d;p.multitouchmove(b,e)}else p.touchmove?(p.prehandleEvent(b),p.touchmove(b)):
p.drag&&(p.prehandleEvent(b),p.drag(b))}),k.bind("touchend",function(a){this.hold&&(clearTimeout(this.hold),this.hold=void 0);!j.supports_gesture()&&p.implementedGestureDist&&(p.implementedGestureDist=void 0,p.implementedGestureAngle=void 0,p.gestureend&&(p.prehandleEvent(a),p.gestureend(a)));p.touchend?(p.prehandleEvent(a),p.touchend(a)):p.mouseup&&(p.prehandleEvent(a),p.mouseup(a));250>(new Date).getTime()-p.lastTouch&&(p.tap?(p.prehandleEvent(a),p.tap(a)):p.click&&(p.prehandleEvent(a),p.click(a)))}),
k.bind("gesturestart",function(a){p.gesturestart&&(p.prehandleEvent(a),p.gesturestart(a))}),k.bind("gesturechange",function(a){p.gesturechange&&(p.prehandleEvent(a),p.gesturechange(a))}),k.bind("gestureend",function(a){p.gestureend&&(p.prehandleEvent(a),p.gestureend(a))})):(k.click(function(a){switch(a.which){case 1:p.click&&(p.prehandleEvent(a),p.click(a));break;case 2:p.middleclick&&(p.prehandleEvent(a),p.middleclick(a));break;case 3:p.rightclick&&(p.prehandleEvent(a),p.rightclick(a))}}),k.dblclick(function(a){p.dblclick&&
(p.prehandleEvent(a),p.dblclick(a))}),k.mousedown(function(a){switch(a.which){case 1:l.CANVAS_DRAGGING=p;p.mousedown&&(p.prehandleEvent(a),p.mousedown(a));break;case 2:p.middlemousedown&&(p.prehandleEvent(a),p.middlemousedown(a));break;case 3:p.rightmousedown&&(p.prehandleEvent(a),p.rightmousedown(a))}}),k.mousemove(function(a){!l.CANVAS_DRAGGING&&p.mousemove&&(p.prehandleEvent(a),p.mousemove(a))}),k.mouseout(function(a){l.CANVAS_OVER=void 0;p.mouseout&&(p.prehandleEvent(a),p.mouseout(a))}),k.mouseover(function(a){l.CANVAS_OVER=
p;p.mouseover&&(p.prehandleEvent(a),p.mouseover(a))}),k.mouseup(function(a){switch(a.which){case 1:p.mouseup&&(p.prehandleEvent(a),p.mouseup(a));break;case 2:p.middlemouseup&&(p.prehandleEvent(a),p.middlemouseup(a));break;case 3:p.rightmouseup&&(p.prehandleEvent(a),p.rightmouseup(a))}}),k.mousewheel(function(a,b){p.mousewheel&&(p.prehandleEvent(a),p.mousewheel(a,b))}));this.subCreate&&this.subCreate()};k.prehandleEvent=function(a){a.originalEvent.changedTouches&&(a.pageX=a.originalEvent.changedTouches[0].pageX,
a.pageY=a.originalEvent.changedTouches[0].pageY);a.preventDefault();a.offset=d("#"+this.id).offset();a.p=new g.Point(a.pageX-a.offset.left,a.pageY-a.offset.top)}})(ChemDoodle,ChemDoodle.featureDetection,ChemDoodle.math,ChemDoodle.monitor,ChemDoodle.structures,ChemDoodle.lib.jQuery,ChemDoodle.lib.jQuery.browser,Math,document,window);
(function(b,j){b._AnimatorCanvas=function(b,g,d){b&&this.create(b,g,d)};var m=b._AnimatorCanvas.prototype=new b._Canvas;m.timeout=33;m.startAnimation=function(){this.stopAnimation();this.lastTime=(new Date).getTime();var b=this;this.nextFrame&&(this.handle=j.requestInterval(function(){var g=(new Date).getTime();b.nextFrame(g-b.lastTime);b.repaint();b.lastTime=g},this.timeout))};m.stopAnimation=function(){this.handle&&(j.clearRequestInterval(this.handle),this.handle=void 0)};m.isRunning=function(){return void 0!==
this.handle}})(ChemDoodle,ChemDoodle.animations);
(function(b,j){b.FileCanvas=function(b,l,g,d){b&&this.create(b,l,g);j.writeln('\x3cbr\x3e\x3cform name\x3d"FileForm" enctype\x3d"multipart/form-data" method\x3d"POST" action\x3d"'+d+'" target\x3d"HiddenFileFrame"\x3e\x3cinput type\x3d"file" name\x3d"f" /\x3e\x3cinput type\x3d"submit" name\x3d"submitbutton" value\x3d"Show File" /\x3e\x3c/form\x3e\x3ciframe id\x3d"HFF-'+b+'" name\x3d"HiddenFileFrame" height\x3d"0" width\x3d"0" style\x3d"display:none;" onLoad\x3d"GetMolFromFrame(\'HFF-'+b+"', "+b+')"\x3e\x3c/iframe\x3e');
this.emptyMessage="Click below to load file";this.repaint()};b.FileCanvas.prototype=new b._Canvas})(ChemDoodle,document);
(function(b){b.HyperlinkCanvas=function(b,m,l,g,d,f){b&&this.create(b,m,l);this.urlOrFunction=g;this.color=d?d:"blue";this.size=f?f:2};b=b.HyperlinkCanvas.prototype=new b._Canvas;b.openInNewWindow=!0;b.hoverImage=void 0;b.drawChildExtras=function(b){this.e&&(this.hoverImage?b.drawImage(this.hoverImage,0,0):(b.strokeStyle=this.color,b.lineWidth=2*this.size,b.strokeRect(0,0,this.width,this.height)))};b.setHoverImage=function(b){this.hoverImage=new Image;this.hoverImage.src=b};b.click=function(){this.e=
void 0;this.repaint();this.urlOrFunction instanceof Function?this.urlOrFunction():this.openInNewWindow?window.open(this.urlOrFunction):location.href=this.urlOrFunction};b.mouseout=function(){this.e=void 0;this.repaint()};b.mouseover=function(b){this.e=b;this.repaint()}})(ChemDoodle);
(function(b,j,m,l){b.MolGrabberCanvas=function(b,d,f){b&&this.create(b,d,f);d=[];d.push('\x3cbr\x3e\x3cinput type\x3d"text" id\x3d"');d.push(b);d.push('_query" size\x3d"32" value\x3d"" /\x3e');d.push("\x3cbr\x3e\x3cnobr\x3e");d.push('\x3cselect id\x3d"');d.push(b);d.push('_select"\x3e');d.push('\x3coption value\x3d"chemexper"\x3eChemExper');d.push('\x3coption value\x3d"chemspider"\x3eChemSpider');d.push('\x3coption value\x3d"pubchem" selected\x3ePubChem');d.push("\x3c/select\x3e");d.push('\x3cbutton id\x3d"');
d.push(b);d.push('_submit"\x3eShow Molecule\x3c/button\x3e');d.push("\x3c/nobr\x3e");l.getElementById(b);m("#"+b).after(d.join(""));var a=this;m("#"+b+"_submit").click(function(){a.search()});m("#"+b+"_query").keypress(function(b){13===b.which&&a.search()});this.emptyMessage="Enter search term below";this.repaint()};b=b.MolGrabberCanvas.prototype=new b._Canvas;b.setSearchTerm=function(b){m("#"+this.id+"_query").val(b);this.search()};b.search=function(){this.emptyMessage="Searching...";this.clear();
var b=this;j.getMoleculeFromDatabase(m("#"+this.id+"_query").val(),{database:m("#"+this.id+"_select").val()},function(d){b.loadMolecule(d)})}})(ChemDoodle,ChemDoodle.iChemLabs,ChemDoodle.lib.jQuery,document);
(function(b,j,m){var l=[],g=[1,0,0],d=[0,1,0],f=[0,0,1];b.RotatorCanvas=function(a,b,d,f){a&&this.create(a,b,d);this.rotate3D=f};b=b.RotatorCanvas.prototype=new b._AnimatorCanvas;j=j.PI/15;b.xIncrement=j;b.yIncrement=j;b.zIncrement=j;b.nextFrame=function(a){if(0===this.molecules.length&&0===this.shapes.length)this.stopAnimation();else if(a/=1E3,this.rotate3D){m.identity(l);m.rotate(l,this.xIncrement*a,g);m.rotate(l,this.yIncrement*a,d);m.rotate(l,this.zIncrement*a,f);a=0;for(var b=this.molecules.length;a<
b;a++){for(var j=this.molecules[a],k=0,q=j.atoms.length;k<q;k++){var n=j.atoms[k],y=[n.x-this.width/2,n.y-this.height/2,n.z];m.multiplyVec3(l,y);n.x=y[0]+this.width/2;n.y=y[1]+this.height/2;n.z=y[2]}k=0;for(q=j.rings.length;k<q;k++)j.rings[k].center=j.rings[k].getCenter();this.specs.atoms_display&&this.specs.atoms_circles_2D&&j.sortAtomsByZ();this.specs.bonds_display&&this.specs.bonds_clearOverlaps_2D&&j.sortBondsByZ()}a=0;for(b=this.shapes.length;a<b;a++){j=this.shapes[a].getPoints();k=0;for(q=j.length;k<
q;k++)n=j[k],y=[n.x-this.width/2,n.y-this.height/2,0],m.multiplyVec3(l,y),n.x=y[0]+this.width/2,n.y=y[1]+this.height/2}}else this.specs.rotateAngle+=this.zIncrement*a};b.dblclick=function(){this.isRunning()?this.stopAnimation():this.startAnimation()}})(ChemDoodle,Math,ChemDoodle.lib.mat4);
(function(b,j,m){b.SlideshowCanvas=function(b,g,d){b&&this.create(b,g,d)};b=b.SlideshowCanvas.prototype=new b._AnimatorCanvas;b.frames=[];b.curIndex=0;b.timeout=5E3;b.alpha=0;b.innerHandle=void 0;b.phase=0;b.drawChildExtras=function(b){var g=m.getRGB(this.specs.backgroundColor,255);b.fillStyle="rgba("+g[0]+", "+g[1]+", "+g[2]+", "+this.alpha+")";b.fillRect(0,0,this.width,this.height)};b.nextFrame=function(){if(0===this.frames.length)this.stopAnimation();else{this.phase=0;var b=this,g=1;this.innerHandle=
setInterval(function(){b.alpha=g/15;b.repaint();15===g&&b.breakInnerHandle();g++},33)}};b.breakInnerHandle=function(){this.innerHandle&&(clearInterval(this.innerHandle),this.innerHandle=void 0);if(0===this.phase){this.curIndex++;this.curIndex>this.frames.length-1&&(this.curIndex=0);this.alpha=1;var b=this.frames[this.curIndex];this.loadContent(b.mols,b.shapes);this.phase=1;var g=this,d=1;this.innerHandle=setInterval(function(){g.alpha=(15-d)/15;g.repaint();15===d&&g.breakInnerHandle();d++},33)}else 1===
this.phase&&(this.alpha=0,this.repaint())};b.addFrame=function(b,g){0===this.frames.length&&this.loadContent(b,g);this.frames.push({mols:b,shapes:g})}})(ChemDoodle,ChemDoodle.animations,ChemDoodle.math);
(function(b,j,m,l,g){b.TransformCanvas=function(b,f,a,e){b&&this.create(b,f,a);this.rotate3D=e};b=b.TransformCanvas.prototype=new b._Canvas;b.lastPoint=void 0;b.rotationMultMod=1.3;b.lastPinchScale=1;b.lastGestureRotate=0;b.mousedown=function(b){this.lastPoint=b.p};b.dblclick=function(){this.center();this.repaint()};b.drag=function(b){if(!this.lastPoint.multi){if(j.ALT){var f=new m.Point(b.p.x,b.p.y);f.sub(this.lastPoint);for(var a=0,e=this.molecules.length;a<e;a++){for(var t=this.molecules[a],k=
0,q=t.atoms.length;k<q;k++)t.atoms[k].add(f);t.check()}a=0;for(e=this.shapes.length;a<e;a++){t=this.shapes[a].getPoints();k=0;for(q=t.length;k<q;k++)t[k].add(f)}this.lastPoint=b.p}else if(!0===this.rotate3D){q=l.max(this.width/4,this.height/4);k=(b.p.x-this.lastPoint.x)/q*this.rotationMultMod;q=-(b.p.y-this.lastPoint.y)/q*this.rotationMultMod;f=[];g.identity(f);g.rotate(f,q,[1,0,0]);g.rotate(f,k,[0,1,0]);a=0;for(e=this.molecules.length;a<e;a++){t=this.molecules[a];k=0;for(q=t.atoms.length;k<q;k++)a=
t.atoms[k],e=[a.x-this.width/2,a.y-this.height/2,a.z],g.multiplyVec3(f,e),a.x=e[0]+this.width/2,a.y=e[1]+this.height/2,a.z=e[2];a=0;for(e=t.rings.length;a<e;a++)t.rings[a].center=t.rings[a].getCenter();this.lastPoint=b.p;this.specs.atoms_display&&this.specs.atoms_circles_2D&&t.sortAtomsByZ();this.specs.bonds_display&&this.specs.bonds_clearOverlaps_2D&&t.sortBondsByZ()}}else q=new m.Point(this.width/2,this.height/2),k=q.angle(this.lastPoint),q=q.angle(b.p),this.specs.rotateAngle-=q-k,this.lastPoint=
b.p;this.repaint()}};b.mousewheel=function(b,f){this.specs.scale+=f/50;0.01>this.specs.scale&&(this.specs.scale=0.01);this.repaint()};b.multitouchmove=function(b,f){if(2===f)if(this.lastPoint.multi){var a=new m.Point(b.p.x,b.p.y);a.sub(this.lastPoint);for(var e=0,g=this.molecules.length;e<g;e++){for(var j=this.molecules[e],l=0,n=j.atoms.length;l<n;l++)j.atoms[l].add(a);j.check()}e=0;for(g=this.shapes.length;e<g;e++){j=this.shapes[e].getPoints();l=0;for(n=j.length;l<n;l++)j[l].add(a)}this.lastPoint=
b.p;this.lastPoint.multi=!0;this.repaint()}else this.lastPoint=b.p,this.lastPoint.multi=!0};b.gesturechange=function(b){0!==b.originalEvent.scale-this.lastPinchScale&&(this.specs.scale*=b.originalEvent.scale/this.lastPinchScale,0.01>this.specs.scale&&(this.specs.scale=0.01),this.lastPinchScale=b.originalEvent.scale);if(0!==this.lastGestureRotate-b.originalEvent.rotation){for(var f=(this.lastGestureRotate-b.originalEvent.rotation)/180*j.PI,a=new m.Point(this.width/2,this.height/2),e=0,g=this.molecules.length;e<
g;e++){for(var j=this.molecules[e],l=0,n=j.atoms.length;l<n;l++){var y=j.atoms[l],z=a.distance(y),p=a.angle(y)+f;y.x=a.x+z*j.cos(p);y.y=a.y-z*j.sin(p)}j.check()}this.lastGestureRotate=b.originalEvent.rotation}this.repaint()};b.gestureend=function(){this.lastPinchScale=1;this.lastGestureRotate=0}})(ChemDoodle,ChemDoodle.monitor,ChemDoodle.structures,Math,ChemDoodle.lib.mat4);(function(b){b.ViewerCanvas=function(b,m,l){b&&this.create(b,m,l)};b.ViewerCanvas.prototype=new b._Canvas})(ChemDoodle);
(function(b){b._SpectrumCanvas=function(b,m,l){b&&this.create(b,m,l)};b=b._SpectrumCanvas.prototype=new b._Canvas;b.spectrum=void 0;b.emptyMessage="No Spectrum Loaded or Recognized";b.loadMolecule=void 0;b.getMolecule=void 0;b.innerRepaint=function(b){this.spectrum&&0<this.spectrum.data.length?this.spectrum.draw(b,this.specs,this.width,this.height):this.emptyMessage&&(b.fillStyle="#737683",b.textAlign="center",b.textBaseline="middle",b.font="18px Helvetica, Verdana, Arial, Sans-serif",b.fillText(this.emptyMessage,
this.width/2,this.height/2))};b.loadSpectrum=function(b){this.spectrum=b;this.repaint()};b.getSpectrum=function(){return this.spectrum};b.getSpectrumCoordinates=function(b,m){return spectrum.getInternalCoordinates(b,m,this.width,this.height)}})(ChemDoodle,document);(function(b){b.ObserverCanvas=function(b,m,l){b&&this.create(b,m,l)};b.ObserverCanvas.prototype=new b._SpectrumCanvas})(ChemDoodle);
(function(b){b.OverlayCanvas=function(b,m,l){b&&this.create(b,m,l)};b=b.OverlayCanvas.prototype=new b._SpectrumCanvas;b.overlaySpectra=[];b.superRepaint=b.innerRepaint;b.innerRepaint=function(b){this.superRepaint(b);if(this.spectrum&&0<this.spectrum.data.length)for(var m=0,l=this.overlaySpectra.length;m<l;m++){var g=this.overlaySpectra[m];g&&0<g.data.length&&(g.minX=this.spectrum.minX,g.maxX=this.spectrum.maxX,g.drawPlot(b,this.specs,this.width,this.height,this.spectrum.memory.offsetTop,this.spectrum.memory.offsetLeft,
this.spectrum.memory.offsetBottom))}};b.addSpectrum=function(b){this.spectrum?this.overlaySpectra.push(b):this.spectrum=b}})(ChemDoodle);
(function(b,j,m){b.PerspectiveCanvas=function(b,d,f){b&&this.create(b,d,f)};var l=b.PerspectiveCanvas.prototype=new b._SpectrumCanvas;l.dragRange=void 0;l.rescaleYAxisOnZoom=!0;l.lastPinchScale=1;l.mousedown=function(g){this.dragRange=new b.structures.Point(g.p.x,g.p.x)};l.mouseup=function(b){this.dragRange&&this.dragRange.x!==this.dragRange.y&&(this.dragRange.multi||(b=this.spectrum.zoom(this.dragRange.x,b.p.x,this.width,this.rescaleYAxisOnZoom),this.rescaleYAxisOnZoom&&(this.specs.scale=b)),this.dragRange=
void 0,this.repaint())};l.drag=function(b){this.dragRange&&(this.dragRange.multi?this.dragRange=void 0:(j.SHIFT&&(this.spectrum.translate(b.p.x-this.dragRange.x,this.width),this.dragRange.x=b.p.x),this.dragRange.y=b.p.x),this.repaint())};l.drawChildExtras=function(b){if(this.dragRange){var d=m.min(this.dragRange.x,this.dragRange.y),f=m.max(this.dragRange.x,this.dragRange.y);b.strokeStyle="gray";b.lineStyle=1;b.beginPath();for(b.moveTo(d,this.height/2);d<=f;d++)5>d%10?b.lineTo(d,m.round(this.height/
2)):b.moveTo(d,m.round(this.height/2));b.stroke()}};l.mousewheel=function(b,d){this.specs.scale+=d/10;0.01>this.specs.scale&&(this.specs.scale=0.01);this.repaint()};l.dblclick=function(){this.spectrum.setup();this.specs.scale=1;this.repaint()};l.multitouchmove=function(g,d){2===d&&(!this.dragRange||!this.dragRange.multi?(this.dragRange=new b.structures.Point(g.p.x,g.p.x),this.dragRange.multi=!0):(this.spectrum.translate(g.p.x-this.dragRange.x,this.width),this.dragRange.x=g.p.x,this.dragRange.y=g.p.x,
this.repaint()))};l.gesturechange=function(b){this.specs.scale*=b.originalEvent.scale/this.lastPinchScale;0.01>this.specs.scale&&(this.specs.scale=0.01);this.lastPinchScale=b.originalEvent.scale;this.repaint()};l.gestureend=function(){this.lastPinchScale=1}})(ChemDoodle,ChemDoodle.monitor,Math);
(function(b,j,m){b.SeekerCanvas=function(b,d,f,a){b&&this.create(b,d,f);this.seekType=a};var l=b.SeekerCanvas.prototype=new b._SpectrumCanvas;l.superRepaint=l.innerRepaint;l.innerRepaint=function(g){this.superRepaint(g);if(this.spectrum&&0<this.spectrum.data.length&&this.p){var d,f;if(this.seekType===b.SeekerCanvas.SEEK_POINTER)d=this.p,f=this.spectrum.getInternalCoordinates(d.x,d.y);else if(this.seekType===b.SeekerCanvas.SEEK_PLOT||this.seekType===b.SeekerCanvas.SEEK_PEAK){f=this.seekType===b.SeekerCanvas.SEEK_PLOT?
this.spectrum.getClosestPlotInternalCoordinates(this.p.x):this.spectrum.getClosestPeakInternalCoordinates(this.p.x);if(!f)return;d={x:this.spectrum.getTransformedX(f.x,this.specs,this.width,this.spectrum.memory.offsetLeft),y:this.spectrum.getTransformedY(f.y/100,this.specs,this.height,this.spectrum.memory.offsetBottom,this.spectrum.memory.offsetTop)}}g.fillStyle="white";g.strokeStyle=this.specs.plots_color;g.lineWidth=this.specs.plots_width;g.beginPath();g.arc(d.x,d.y,3,0,2*m.PI,!1);g.fill();g.stroke();
g.font=j.getFontString(this.specs.text_font_size,this.specs.text_font_families);g.textAlign="left";g.textBaseline="bottom";f="x:"+f.x.toFixed(3)+", y:"+f.y.toFixed(3);var a=d.x+3,e=g.measureText(f).width;a+e>this.width-2&&(a-=6+e);d=d.y;0>d-this.specs.text_font_size-2&&(d+=this.specs.text_font_size);g.fillRect(a,d-this.specs.text_font_size,e,this.specs.text_font_size);g.fillStyle="black";g.fillText(f,a,d)}};l.mouseout=function(){this.p=void 0;this.repaint()};l.mousemove=function(b){this.p={x:b.p.x-
2,y:b.p.y-3};this.repaint()};l.touchstart=function(b){this.mousemove(b)};l.touchmove=function(b){this.mousemove(b)};l.touchend=function(b){this.mouseout(b)};b.SeekerCanvas.SEEK_POINTER="pointer";b.SeekerCanvas.SEEK_PLOT="plot";b.SeekerCanvas.SEEK_PEAK="peak"})(ChemDoodle,ChemDoodle.extensions,Math);
(function(b,j,m,l,g,d,f,a,e,t,k){b._Canvas3D=function(a,b,d){a&&this.create(a,b,d)};var q=b._Canvas3D.prototype=new b._Canvas;q.rotationMatrix=void 0;q.translationMatrix=void 0;q.lastPoint=void 0;q.emptyMessage="WebGL is Unavailable!";q.lastPinchScale=1;q.lastGestureRotate=0;q.afterLoadContent=function(){for(var a=new m.Bounds,b=0,d=this.molecules.length;b<d;b++)a.expand(this.molecules[b].getBounds3D());var g=k.dist([a.maxX,a.maxY,a.maxZ],[a.minX,a.minY,a.minZ])/2+1.5,b=45,d=Math.tan(b/360*Math.PI)/
0.8;this.depth=g/d;var d=f.max(this.depth-g,0.1),g=this.depth+g,j=this.gl.canvas.clientWidth/this.gl.canvas.clientHeight;1>j&&(b/=j);this.specs.projectionOrthoWidth_3D=2*(Math.tan(b/360*Math.PI)*this.depth)*j;this.specs.projectionPerspectiveVerticalFieldOfView_3D=b;this.specs.projectionFrontCulling_3D=d;this.specs.projectionBackCulling_3D=g;this.specs.projectionWidthHeightRatio_3D=j;this.translationMatrix=e.translate(e.identity([]),[0,0,-this.depth]);this.maxDimension=f.max(a.maxX-a.minX,a.maxY-a.minY);
this.setupScene()};q.setViewDistance=function(a){this.specs.projectionPerspectiveVerticalFieldOfView_3D=m.clamp(this.specs.projectionPerspectiveVerticalFieldOfView_3D/a,0.1,179.9);this.specs.projectionOrthoWidth_3D=2*(f.tan(this.specs.projectionPerspectiveVerticalFieldOfView_3D/360*Math.PI)*this.depth)*this.specs.projectionWidthHeightRatio_3D;this.updateScene()};q.repaint=function(){if(this.gl){this.gl.clear(this.gl.COLOR_BUFFER_BIT|this.gl.DEPTH_BUFFER_BIT);this.gl.modelViewMatrix=e.multiply(this.translationMatrix,
this.rotationMatrix,[]);this.gl.rotationMatrix=this.rotationMatrix;var a=this.gl.getUniformLocation(this.gl.program,"u_projection_matrix");this.gl.uniformMatrix4fv(a,!1,this.gl.projectionMatrix);this.gl.fogging.setMode(this.specs.fog_mode_3D);for(var b=0,d=this.molecules.length;b<d;b++)this.molecules[b].render(this.gl,this.specs);b=0;for(d=this.shapes.length;b<d;b++)this.shapes[b].render(this.gl,this.specs);this.specs.compass_display&&(this.gl.uniformMatrix4fv(a,!1,this.compass.projectionMatrix),
this.compass.render(this.gl,this.specs),this.gl.setMatrixUniforms(this.gl.modelViewMatrix),this.gl.uniformMatrix4fv(a,!1,this.gl.projectionMatrix));this.gl.enable(this.gl.BLEND);this.gl.depthMask(!1);this.gl.enableVertexAttribArray(this.gl.shader.vertexTexCoordAttribute);this.specs.atoms_displayLabels_3D&&this.label3D.render(this.gl,this.specs,this.getMolecules());this.specs.compass_display&&this.specs.compass_displayText_3D&&(this.gl.uniformMatrix4fv(a,!1,this.compass.projectionMatrix),this.compass.renderAxis(this.gl),
this.gl.setMatrixUniforms(this.gl.modelViewMatrix),this.gl.uniformMatrix4fv(a,!1,this.gl.projectionMatrix));this.gl.disableVertexAttribArray(this.gl.shader.vertexTexCoordAttribute);this.gl.disable(this.gl.BLEND);this.gl.depthMask(!0);this.gl.disable(this.gl.DEPTH_TEST);this.drawChildExtras&&this.drawChildExtras(this.gl);this.gl.enable(this.gl.DEPTH_TEST);this.gl.flush()}};q.pick=function(a,b){if(this.gl){e.multiply(this.translationMatrix,this.rotationMatrix,this.gl.modelViewMatrix);this.gl.rotationMatrix=
this.rotationMatrix;var d=this.gl.getUniformLocation(this.gl.program,"u_projection_matrix");this.gl.uniformMatrix4fv(d,!1,this.gl.projectionMatrix);return this.picker.pick(this.gl,this.molecules,this.specs,a,this.height-b)}};q.center=function(){a.getElementById(this.id);for(var b=new l.Atom,d=0,e=this.molecules.length;d<e;d++){var f=this.molecules[d];b.add3D(f.getCenter3D())}b.x/=this.molecules.length;b.y/=this.molecules.length;d=0;for(e=this.molecules.length;d<e;d++){for(var f=this.molecules[d],
g=0,j=f.atoms.length;g<j;g++)f.atoms[g].sub3D(b);if(f.chains&&f.fromJSON){g=0;for(j=f.chains.length;g<j;g++)for(var k=f.chains[g],m=0,q=k.length;m<q;m++){var t=k[m];t.cp1.sub3D(b);t.cp2.sub3D(b);t.cp3&&(t.cp3.sub3D(b),t.cp4.sub3D(b),t.cp5.sub3D(b))}}}};q.subCreate=function(){try{var b=a.getElementById(this.id);this.gl=b.getContext("webgl");this.gl||(this.gl=b.getContext("experimental-webgl"))}catch(d){}this.gl?(this.rotationMatrix=e.identity([]),this.translationMatrix=e.identity([]),this.gl.viewport(0,
0,this.width,this.height),this.gl.program=this.gl.createProgram(),this.gl.shader=new g.Shader,this.gl.shader.init(this.gl),this.gl.programLabel=this.gl.createProgram(),this.setupScene()):this.displayMessage()};b._Canvas.prototype.displayMessage=function(){var b=a.getElementById(this.id);b.getContext&&(b=b.getContext("2d"),this.specs.backgroundColor&&(b.fillStyle=this.specs.backgroundColor,b.fillRect(0,0,this.width,this.height)),this.emptyMessage&&(b.fillStyle="#737683",b.textAlign="center",b.textBaseline=
"middle",b.font="18px Helvetica, Verdana, Arial, Sans-serif",b.fillText(this.emptyMessage,this.width/2,this.height/2)))};q.renderText=function(a,b){if(this.gl){var d={position:[],texCoord:[],translation:[]};this.gl.textImage.pushVertexData(a,b,0,d);this.gl.textMesh.storeData(this.gl,d.position,d.texCoord,d.translation);this.gl.enable(this.gl.BLEND);this.gl.depthMask(!1);this.gl.enableVertexAttribArray(this.gl.shader.vertexTexCoordAttribute);this.gl.textImage.useTexture(this.gl);this.gl.textMesh.render(this.gl);
this.gl.disableVertexAttribArray(this.gl.shader.vertexTexCoordAttribute);this.gl.disable(this.gl.BLEND);this.gl.depthMask(!0)}};q.setupScene=function(){if(this.gl){var a=m.getRGB(this.specs.backgroundColor,1);this.gl.clearColor(a[0],a[1],a[2],1);this.gl.clearDepth(1);this.gl.enable(this.gl.DEPTH_TEST);this.gl.depthFunc(this.gl.LEQUAL);this.gl.blendFuncSeparate(this.gl.SRC_ALPHA,this.gl.ONE_MINUS_SRC_ALPHA,this.gl.ONE,this.gl.ONE_MINUS_SRC_ALPHA);this.specs.cullBackFace_3D&&this.gl.enable(this.gl.CULL_FACE);
this.gl.sphereBuffer=new g.Sphere(1,this.specs.atoms_resolution_3D,this.specs.atoms_resolution_3D);this.gl.starBuffer=new g.Star;this.gl.cylinderBuffer=new g.Cylinder(1,1,this.specs.bonds_resolution_3D);this.gl.pillBuffer=new g.Pill(this.specs.bonds_pillDiameter_3D/2,this.specs.bonds_pillHeight_3D,this.specs.bonds_pillLatitudeResolution_3D,this.specs.bonds_pillLongitudeResolution_3D);this.gl.lineBuffer=new g.Line;this.gl.lineArrowBuffer=new g.LineArrow;this.gl.arrowBuffer=new g.Arrow(0.3,this.specs.compass_resolution_3D);
this.gl.textMesh=new g.TextMesh;this.gl.textMesh.init(this.gl);this.gl.textImage=new g.TextImage;this.gl.textImage.init(this.gl);this.gl.textImage.updateFont(this.gl,this.specs.text_font_size,this.specs.text_font_families,this.specs.text_font_bold,this.specs.text_font_italic,this.specs.text_font_stroke_3D);this.label3D=new g.Label;this.label3D.init(this.gl,this.specs);for(var q=0,z=this.molecules.length;q<z;q++)if(a=this.molecules[q],a.labelMesh instanceof g.TextMesh||(a.labelMesh=new g.TextMesh,
a.labelMesh.init(this.gl)),a.unitCellVectors&&(a.unitCell=new g.UnitCell(a.unitCellVectors)),a.chains){a.ribbons=[];a.cartoons=[];a.tubes=[];for(var p=0,u=a.chains.length;p<u;p++){var r=a.chains[p],v=2<r.length&&d[r[2].name]&&"#BEA06E"===d[r[2].name].aminoColor;if(0<r.length&&!r[0].lineSegments){for(var w=0,A=r.length-1;w<A;w++)r[w].setup(r[w+1].cp1,v?1:this.specs.proteins_horizontalResolution);if(!v){w=1;for(A=r.length-1;w<A;w++)j.vec3AngleFrom(r[w-1].D,r[w].D)>f.PI/2&&(r[w].guidePointsSmall.reverse(),
r[w].guidePointsLarge.reverse(),k.scale(r[w].D,-1))}w=1;for(A=r.length-3;w<A;w++)r[w].computeLineSegments(r[w-1],r[w+1],r[w+2],!v,v?this.specs.nucleics_verticalResolution:this.specs.proteins_verticalResolution);r.pop();r.pop();r.pop();r.shift()}var w=m.hsl2rgb(1===u?0.5:p/u,1,0.5),B="rgb("+w[0]+","+w[1]+","+w[2]+")";r.chainColor=B;if(v)w=new g.Tube(r,this.specs.nucleics_tubeThickness,this.specs.nucleics_tubeResolution_3D),w.chainColor=B,a.tubes.push(w);else{v={front:new g.Ribbon(r,this.specs.proteins_ribbonThickness,
!1),back:new g.Ribbon(r,-this.specs.proteins_ribbonThickness,!1)};v.front.chainColor=B;v.back.chainColor=B;w=0;for(A=v.front.segments.length;w<A;w++)v.front.segments[w].chainColor=B;w=0;for(A=v.back.segments.length;w<A;w++)v.back.segments[w].chainColor=B;a.ribbons.push(v);r={front:new g.Ribbon(r,this.specs.proteins_ribbonThickness,!0),back:new g.Ribbon(r,-this.specs.proteins_ribbonThickness,!0)};r.front.chainColor=B;r.back.chainColor=B;w=0;for(A=r.front.segments.length;w<A;w++)r.front.segments[w].chainColor=
B;w=0;for(A=r.back.segments.length;w<A;w++)r.back.segments[w].chainColor=B;w=0;for(A=r.front.cartoonSegments.length;w<A;w++)r.front.cartoonSegments[w].chainColor=B;w=0;for(A=r.back.cartoonSegments.length;w<A;w++)r.back.cartoonSegments[w].chainColor=B;a.cartoons.push(r)}}}this.label3D.updateVerticesBuffer(this.gl,this.getMolecules(),this.specs);if(this instanceof b.MovieCanvas3D&&this.frames){w=0;for(A=this.frames.length;w<A;w++){q=this.frames[w];p=0;for(u=q.mols.length;p<u;p++)a=q.mols[p],a.labelMesh instanceof
l.d3.TextMesh||(a.labelMesh=new l.d3.TextMesh,a.labelMesh.init(this.gl));this.label3D.updateVerticesBuffer(this.gl,q.mols,this.specs)}}this.gl.lighting=new g.Light(this.specs.lightDiffuseColor_3D,this.specs.lightSpecularColor_3D,this.specs.lightDirection_3D);this.gl.lighting.lightScene(this.gl);this.gl.material=new g.Material(this.gl);this.gl.fogging=new g.Fog(this.gl);this.gl.fogging.setTempParameter(this.specs.fog_color_3D||this.specs.backgroundColor,this.specs.fog_start_3D,this.specs.fog_end_3D,
this.specs.fog_density_3D);this.compass=new g.Compass(this.gl,this.specs);a=this.width/this.height;this.specs.projectionWidthHeightRatio_3D&&(a=this.specs.projectionWidthHeightRatio_3D);this.gl.projectionMatrix=this.specs.projectionPerspective_3D?e.perspective(this.specs.projectionPerspectiveVerticalFieldOfView_3D,a,this.specs.projectionFrontCulling_3D,this.specs.projectionBackCulling_3D):e.ortho(-this.specs.projectionOrthoWidth_3D/2,this.specs.projectionOrthoWidth_3D/2,-this.specs.projectionOrthoWidth_3D/
2/a,this.specs.projectionOrthoWidth_3D/2/a,this.specs.projectionFrontCulling_3D,this.specs.projectionBackCulling_3D);a=this.gl.getUniformLocation(this.gl.program,"u_projection_matrix");this.gl.uniformMatrix4fv(a,!1,this.gl.projectionMatrix);var c=this.gl.getUniformLocation(this.gl.program,"u_model_view_matrix"),h=this.gl.getUniformLocation(this.gl.program,"u_normal_matrix");this.gl.setMatrixUniforms=function(a){this.uniformMatrix4fv(c,!1,a);a=t.transpose(e.toInverseMat3(a,[]));this.uniformMatrix3fv(h,
!1,a)};p=this.gl.getUniformLocation(this.gl.program,"u_dimension");this.gl.uniformMatrix4fv(a,!1,this.gl.projectionMatrix);this.gl.uniform2f(p,this.gl.canvas.clientWidth,this.gl.canvas.clientHeight);this.picker=new g.Picker;this.picker.init(this.gl);this.picker.setDimension(this.gl,this.width,this.height)}};q.updateScene=function(){this.gl.fogging.setTempParameter(this.specs.fog_color_3D||this.specs.backgroundColor,this.specs.fog_start_3D,this.specs.fog_end_3D,this.specs.fog_density_3D);var a=this.width/
this.height;this.specs.projectionWidthHeightRatio_3D&&(a=this.specs.projectionWidthHeightRatio_3D);this.gl.projectionMatrix=this.specs.projectionPerspective_3D?e.perspective(this.specs.projectionPerspectiveVerticalFieldOfView_3D,a,this.specs.projectionFrontCulling_3D,this.specs.projectionBackCulling_3D):e.ortho(-this.specs.projectionOrthoWidth_3D/2,this.specs.projectionOrthoWidth_3D/2,-this.specs.projectionOrthoWidth_3D/2/a,this.specs.projectionOrthoWidth_3D/2/a,this.specs.projectionFrontCulling_3D,
this.specs.projectionBackCulling_3D);this.repaint()};q.mousedown=function(a){this.lastPoint=a.p};q.mouseup=function(){this.lastPoint=void 0};q.rightmousedown=function(a){this.lastPoint=a.p};q.drag=function(a){if(b.monitor.ALT){var d=new l.Point(a.p.x,a.p.y);d.sub(this.lastPoint);var g=f.tan(this.specs.projectionPerspectiveVerticalFieldOfView_3D/360*f.PI),g=this.depth/(this.height/2/g);e.translate(this.translationMatrix,[d.x*g,-d.y*g,0])}else g=a.p.x-this.lastPoint.x,d=a.p.y-this.lastPoint.y,g=e.rotate(e.identity([]),
g*f.PI/180,[0,1,0]),e.rotate(g,d*f.PI/180,[1,0,0]),this.rotationMatrix=e.multiply(g,this.rotationMatrix);this.lastPoint=a.p;this.repaint()};q.mousewheel=function(a,b){var d=this.specs.projectionPerspectiveVerticalFieldOfView_3D+b;this.specs.projectionPerspectiveVerticalFieldOfView_3D=0.1>d?0.1:179.9<d?179.9:d;this.specs.projectionOrthoWidth_3D=2*(Math.tan(this.specs.projectionPerspectiveVerticalFieldOfView_3D/360*Math.PI)*this.depth)*this.specs.projectionWidthHeightRatio_3D;this.updateScene()};q.multitouchmove=
function(a,b){if(2===b)if(this.lastPoint.multi){var d=new l.Point(a.p.x,a.p.y);d.sub(this.lastPoint);var g=f.tan(this.specs.projectionPerspectiveVerticalFieldOfView_3D/360*f.PI),g=this.depth/(this.height/2/g);e.translate(this.translationMatrix,[d.x*g,-d.y*g,0]);this.lastPoint=a.p;this.repaint()}else this.lastPoint=a.p,this.lastPoint.multi=!0};q.gesturechange=function(a){if(0!==a.originalEvent.scale-this.lastPinchScale){var b=this.specs.projectionPerspectiveVerticalFieldOfView_3D+30*-(a.originalEvent.scale/
this.lastPinchScale-1);this.specs.projectionPerspectiveVerticalFieldOfView_3D=0.1>b?0.1:179.9<b?179.9:b;this.specs.projectionOrthoWidth_3D=2*(Math.tan(this.specs.projectionPerspectiveVerticalFieldOfView_3D/360*Math.PI)*this.depth)*this.specs.projectionWidthHeightRatio_3D;this.updateScene();this.lastPinchScale=a.originalEvent.scale}this.repaint()};q.gestureend=function(){this.lastPinchScale=1;this.lastGestureRotate=0}})(ChemDoodle,ChemDoodle.extensions,ChemDoodle.math,ChemDoodle.structures,ChemDoodle.structures.d3,
ChemDoodle.RESIDUE,Math,document,ChemDoodle.lib.mat4,ChemDoodle.lib.mat3,ChemDoodle.lib.vec3,window);
(function(b,j,m,l){b.MolGrabberCanvas3D=function(b,d,f){b&&this.create(b,d,f);d=[];d.push('\x3cbr\x3e\x3cinput type\x3d"text" id\x3d"');d.push(b);d.push('_query" size\x3d"32" value\x3d"" /\x3e');d.push("\x3cbr\x3e\x3cnobr\x3e");d.push('\x3cselect id\x3d"');d.push(b);d.push('_select"\x3e');d.push('\x3coption value\x3d"pubchem" selected\x3ePubChem');d.push("\x3c/select\x3e");d.push('\x3cbutton id\x3d"');d.push(b);d.push('_submit"\x3eShow Molecule\x3c/button\x3e');d.push("\x3c/nobr\x3e");l.writeln(d.join(""));
var a=this;m("#"+b+"_submit").click(function(){a.search()});m("#"+b+"_query").keypress(function(b){13===b.which&&a.search()})};b=b.MolGrabberCanvas3D.prototype=new b._Canvas3D;b.setSearchTerm=function(b){m("#"+this.id+"_query").val(b);this.search()};b.search=function(){var b=this;j.getMoleculeFromDatabase(m("#"+this.id+"_query").val(),{database:m("#"+this.id+"_select").val(),dimension:3},function(d){b.loadMolecule(d)})}})(ChemDoodle,ChemDoodle.iChemLabs,ChemDoodle.lib.jQuery,document);
(function(b,j){b.MovieCanvas3D=function(b,g,d){b&&this.create(b,g,d);this.frames=[]};b.MovieCanvas3D.PLAY_ONCE=0;b.MovieCanvas3D.PLAY_LOOP=1;b.MovieCanvas3D.PLAY_SPRING=2;var m=b.MovieCanvas3D.prototype=new b._Canvas3D;m.timeout=50;m.frameNumber=0;m.playMode=2;m.reverse=!1;m.startAnimation=b._AnimatorCanvas.prototype.startAnimation;m.stopAnimation=b._AnimatorCanvas.prototype.stopAnimation;m.isRunning=b._AnimatorCanvas.prototype.isRunning;m.dblclick=b.RotatorCanvas.prototype.dblclick;m.nextFrame=function(){var b=
this.frames[this.frameNumber];this.molecules=b.mols;this.shapes=b.shapes;2===this.playMode&&this.reverse?(this.frameNumber--,0>this.frameNumber&&(this.frameNumber=1,this.reverse=!1)):(this.frameNumber++,this.frameNumber>=this.frames.length&&(2===this.playMode?(this.frameNumber-=2,this.reverse=!0):(this.frameNumber=0,0===this.playMode&&this.stopAnimation())))};m.center=function(){for(var b=new j.Atom,g=this.frames[0],d=0,f=g.mols.length;d<f;d++)b.add3D(g.mols[d].getCenter3D());b.x/=g.mols.length;b.y/=
g.mols.length;g=new j.Atom;g.sub3D(b);for(var b=0,a=this.frames.length;b<a;b++)for(var e=this.frames[b],d=0,f=e.mols.length;d<f;d++)for(var m=e.mols[d],k=0,q=m.atoms.length;k<q;k++)m.atoms[k].add3D(g)};m.addFrame=function(b,g){this.frames.push({mols:b,shapes:g})}})(ChemDoodle,ChemDoodle.structures);
(function(b,j,m){var l=[],g=[1,0,0],d=[0,1,0],f=[0,0,1];b.RotatorCanvas3D=function(a,b,d){a&&this.create(a,b,d)};var a=b.RotatorCanvas3D.prototype=new b._Canvas3D;a.timeout=33;j=j.PI/15;a.xIncrement=j;a.yIncrement=j;a.zIncrement=j;a.startAnimation=b._AnimatorCanvas.prototype.startAnimation;a.stopAnimation=b._AnimatorCanvas.prototype.stopAnimation;a.isRunning=b._AnimatorCanvas.prototype.isRunning;a.dblclick=b.RotatorCanvas.prototype.dblclick;a.mousedown=void 0;a.rightmousedown=void 0;a.drag=void 0;
a.mousewheel=void 0;a.nextFrame=function(a){0===this.molecules.length&&0===this.shapes.length?this.stopAnimation():(m.identity(l),a/=1E3,m.rotate(l,this.xIncrement*a,g),m.rotate(l,this.yIncrement*a,d),m.rotate(l,this.zIncrement*a,f),m.multiply(this.rotationMatrix,l))}})(ChemDoodle,Math,ChemDoodle.lib.mat4);(function(b){b.TransformCanvas3D=function(b,m,l){b&&this.create(b,m,l)};b.TransformCanvas3D.prototype=new b._Canvas3D})(ChemDoodle);
(function(b){b.ViewerCanvas3D=function(b,m,l){b&&this.create(b,m,l)};b=b.ViewerCanvas3D.prototype=new b._Canvas3D;b.mousedown=void 0;b.rightmousedown=void 0;b.drag=void 0;b.mousewheel=void 0})(ChemDoodle);
(function(b,j,m){function l(b,f,a,e){this.element=b;this.x=f;this.y=a;this.dimension=e}b.PeriodicTableCanvas=function(b,f){this.padding=5;b&&this.create(b,18*f+2*this.padding,10*f+2*this.padding);this.cellDimension=f?f:20;this.setupTable();this.repaint()};var g=b.PeriodicTableCanvas.prototype=new b._Canvas;g.loadMolecule=void 0;g.getMolecule=void 0;g.getHoveredElement=function(){if(this.hovered)return this.hovered.element};g.innerRepaint=function(b){for(var f=0,a=this.cells.length;f<a;f++)this.drawCell(b,
this.specs,this.cells[f]);this.hovered&&this.drawCell(b,this.specs,this.hovered);this.selected&&this.drawCell(b,this.specs,this.selected)};g.setupTable=function(){this.cells=[];for(var d=this.padding,f=this.padding,a=0,e=0,g=b.SYMBOLS.length;e<g;e++){18===a&&(a=0,f+=this.cellDimension,d=this.padding);var j=b.ELEMENT[b.SYMBOLS[e]];if(2===j.atomicNumber)d+=16*this.cellDimension,a+=16;else if(5===j.atomicNumber||13===j.atomicNumber)d+=10*this.cellDimension,a+=10;if((58>j.atomicNumber||71<j.atomicNumber&&
90>j.atomicNumber||103<j.atomicNumber)&&113>j.atomicNumber)this.cells.push(new l(j,d,f,this.cellDimension)),d+=this.cellDimension,a++}f+=2*this.cellDimension;d=3*this.cellDimension+this.padding;for(e=57;104>e;e++)if(j=b.ELEMENT[b.SYMBOLS[e]],90===j.atomicNumber&&(f+=this.cellDimension,d=3*this.cellDimension+this.padding),58<=j.atomicNumber&&71>=j.atomicNumber||90<=j.atomicNumber&&103>=j.atomicNumber)this.cells.push(new l(j,d,f,this.cellDimension)),d+=this.cellDimension};g.drawCell=function(b,f,a){var e=
b.createRadialGradient(a.x+a.dimension/3,a.y+a.dimension/3,1.5*a.dimension,a.x+a.dimension/3,a.y+a.dimension/3,a.dimension/10);e.addColorStop(0,"#000000");e.addColorStop(0.7,a.element.jmolColor);e.addColorStop(1,"#FFFFFF");b.fillStyle=e;j.contextRoundRect(b,a.x,a.y,a.dimension,a.dimension,a.dimension/8);if(a===this.hovered||a===this.selected)b.lineWidth=2,b.strokeStyle="#c10000",b.stroke(),b.fillStyle="white";b.fill();b.font=j.getFontString(f.text_font_size,f.text_font_families);b.fillStyle=f.text_color;
b.textAlign="center";b.textBaseline="middle";b.fillText(a.element.symbol,a.x+a.dimension/2,a.y+a.dimension/2)};g.click=function(){this.hovered&&(this.selected=this.hovered,this.repaint())};g.touchstart=function(b){this.mousemove(b)};g.mousemove=function(b){var f=b.p.x;b=b.p.y;this.hovered=void 0;for(var a=0,e=this.cells.length;a<e;a++){var g=this.cells[a];if(m.isBetween(f,g.x,g.x+g.dimension)&&m.isBetween(b,g.y,g.y+g.dimension)){this.hovered=g;break}}this.repaint()};g.mouseout=function(){this.hovered=
void 0;this.repaint()}})(ChemDoodle,ChemDoodle.extensions,ChemDoodle.math,document);(function(b,j,m){b.png={};b.png.create=function(b){m.open(j.getElementById(b.id).toDataURL("image/png"))}})(ChemDoodle.io,document,window);(function(b,j){b.file={};b.file.content=function(b,l){j.get(b,"",l)}})(ChemDoodle.io,ChemDoodle.lib.jQuery);
(function(b,j,m,l,g){j.SERVER_URL="http://ichemlabs.cloud.chemdoodle.com/icl_cdc_v050000/WebHQ";j.inRelay=!1;j.asynchronous=!0;j.INFO={userAgent:navigator.userAgent,v_cwc:b.getVersion(),v_jQuery:g.version,v_jQuery_ui:g.ui?g.ui.version:"N/A"};var d=new m.JSONInterpreter;j._contactServer=function(b,a,d,l,k){this.inRelay?alert("Already connecting to the server, please wait for the first request to finish."):(j.inRelay=!0,g.ajax({dataType:"text",type:"POST",data:JSON.stringify({call:b,content:a,options:d,
info:j.INFO}),url:this.SERVER_URL,success:function(a){j.inRelay=!1;a=JSON.parse(a);a.message&&alert(a.message);l&&(a.content&&!a.stop)&&l(a.content);a.stop&&k&&k()},error:function(){j.inRelay=!1;alert("Call failed. Please try again. If you continue to see this message, please contact iChemLabs customer support.");k&&k()},xhrFields:{withCredentials:!0},async:j.asynchronous}))};j.authenticate=function(b,a,d,g){this._contactServer("authenticate",{credential:b},a,function(a){d(a)},g)};j.calculate=function(b,
a,e,g){this._contactServer("calculate",{mol:d.molTo(b)},a,function(a){e(a)},g)};j.createLewisDotStructure=function(b,a,e,g){this._contactServer("createLewisDot",{mol:d.molTo(b)},a,function(a){e(d.molFrom(a.mol))},g)};j.generateImage=function(b,a,e,g){this._contactServer("generateImage",{mol:d.molTo(b)},a,function(a){e(a.link)},g)};j.generateIUPACName=function(b,a,e,g){this._contactServer("generateIUPACName",{mol:d.molTo(b)},a,function(a){e(a.iupac)},g)};j.getAd=function(b,a){this._contactServer("getAd",
{},{},function(a){b(a.image_url,a.target_url)},a)};j.getMoleculeFromContent=function(b,a,e,g){this._contactServer("getMoleculeFromContent",{content:b},a,function(a){for(var b=!1,f=0,g=a.mol.a.length;f<g;f++)if(0!==a.mol.a[f].z){b=!0;break}if(b){f=0;for(g=a.mol.a.length;f<g;f++)a.mol.a[f].x/=20,a.mol.a[f].y/=20,a.mol.a[f].z/=20}e(d.molFrom(a.mol))},g)};j.getMoleculeFromDatabase=function(b,a,e,g){this._contactServer("getMoleculeFromDatabase",{query:b},a,function(b){if(3===a.dimension)for(var f=0,g=
b.mol.a.length;f<g;f++)b.mol.a[f].x/=20,b.mol.a[f].y/=-20,b.mol.a[f].z/=20;e(d.molFrom(b.mol))},g)};j.getOptimizedPDBStructure=function(b,a,e,g){this._contactServer("getOptimizedPDBStructure",{id:b},a,function(a){var b;b=a.mol?d.molFrom(a.mol):new l.Molecule;b.chains=d.chainsFrom(a.ribbons);b.fromJSON=!0;e(b)},g)};j.getZeoliteFromIZA=function(b,a,d,g){this._contactServer("getZeoliteFromIZA",{query:b},a,function(b){d(ChemDoodle.readCIF(b.cif,a.xSuper,a.ySuper,a.zSuper))},g)};j.isGraphIsomorphism=function(b,
a,e,g,j){this._contactServer("isGraphIsomorphism",{arrow:d.molTo(b),target:d.molTo(a)},e,function(a){g(a.value)},j)};j.isSubgraphIsomorphism=function(b,a,e,g,j){this._contactServer("isSubgraphIsomorphism",{arrow:d.molTo(b),target:d.molTo(a)},e,function(a){g(a.value)},j)};j.kekulize=function(b,a,e,g){this._contactServer("kekulize",{mol:d.molTo(b)},a,function(a){e(d.molFrom(a.mol))},g)};j.optimize=function(b,a,e,g){this._contactServer("optimize",{mol:d.molTo(b)},a,function(g){g=d.molFrom(g.mol);if(2===
a.dimension){for(var j=0,l=g.atoms.length;j<l;j++)b.atoms[j].x=g.atoms[j].x,b.atoms[j].y=g.atoms[j].y;e()}else if(3===a.dimension){j=0;for(l=g.atoms.length;j<l;j++)g.atoms[j].x/=20,g.atoms[j].y/=-20,g.atoms[j].z/=20;e(g)}},g)};j.readIUPACName=function(b,a,e,g){this._contactServer("readIUPACName",{iupac:b},a,function(a){e(d.molFrom(a.mol))},g)};j.readSMILES=function(b,a,e,g){this._contactServer("readSMILES",{smiles:b},a,function(a){e(d.molFrom(a.mol))},g)};j.saveFile=function(b,a,e,g){this._contactServer("saveFile",
{mol:d.molTo(b)},a,function(a){e(a.link)},g)};j.simulate13CNMR=function(f,a,e,g){a.nucleus="C";a.isotope=13;this._contactServer("simulateNMR",{mol:d.molTo(f)},a,function(a){e(b.readJCAMP(a.jcamp))},g)};j.simulate1HNMR=function(f,a,e,g){a.nucleus="H";a.isotope=1;this._contactServer("simulateNMR",{mol:d.molTo(f)},a,function(a){e(b.readJCAMP(a.jcamp))},g)};j.simulateMassParentPeak=function(f,a,e,g){this._contactServer("simulateMassParentPeak",{mol:d.molTo(f)},a,function(a){e(b.readJCAMP(a.jcamp))},g)};
j.writeSMILES=function(b,a,e,g){this._contactServer("writeSMILES",{mol:d.molTo(b)},a,function(a){e(a.smiles)},g)};j.version=function(b,a,d){this._contactServer("version",{},b,function(b){a(b.value)},d)}})(ChemDoodle,ChemDoodle.iChemLabs,ChemDoodle.io,ChemDoodle.structures,ChemDoodle.lib.jQuery);
// Custom ChemDoodle Web Components functions.
//$(function() {
  // the module
  // (function(ChemDoodle) {

  //   // private variables go here, they cannot be accessed beyond this local scope
  //   var labelToMatch = 'N';

  //   // append the function to the ChemDoodle variable
  //   ChemDoodle.countNitrogens = function(molecule){
  //     var count = 0;
  //     for(var i = 0, ii = molecule.atoms.length; i<ii; i++){
  //       if(molecule.atoms[i].label==labelToMatch){
  //         count++;
  //       }
  //     }
  //     return count;
  //   };

  // })(ChemDoodle);

//}); // jQuery ready.
;
var pdb_1B8E = new ChemDoodle.io.JSONInterpreter().pdbFrom({"ribbons":{"cs":[[{"s":false,"z1":36.079,"a":false,"y1":22.146,"y2":22.146,"z2":36.079,"x2":6.557,"h":false,"x1":6.557},{"s":false,"z1":36.079,"a":false,"y1":22.146,"y2":22.146,"z2":36.079,"x2":6.557,"h":false,"x1":6.557},{"s":false,"z1":35.478,"a":false,"y1":20.874,"n":"Leu","y2":20.764,"z2":37.665,"x2":7.981,"h":false,"x1":7.098},{"s":false,"z1":37.61,"a":false,"y1":18.064,"n":"Ile","y2":17.838,"z2":36.223,"x2":10.569,"h":true,"x1":8.625},{"s":false,"z1":38.131,"a":false,"y1":17.088,"n":"Val","y2":15.908,"z2":36.494,"x2":13.597,"h":true,"x1":12.283},{"s":false,"z1":36.078,"a":false,"y1":13.939,"n":"Thr","y2":13.451,"z2":33.801,"x2":11.744,"h":true,"x1":11.747},{"s":false,"z1":32.835,"a":true,"y1":15.826,"n":"Gln","y2":16.82,"z2":31.008,"x2":12.124,"h":true,"x1":10.855},{"s":false,"z1":32.63,"a":false,"y1":17.698,"n":"Thr","y2":15.576,"z2":32.765,"x2":15.328,"h":true,"x1":14.126},{"s":false,"z1":31.501,"a":false,"y1":16.5,"n":"Met","y2":16.884,"z2":33.396,"x2":18.924,"h":false,"x1":17.472},{"s":false,"z1":33.527,"a":false,"y1":14.212,"n":"Lys","y2":14.108,"z2":31.666,"x2":21.158,"h":false,"x1":19.646},{"s":false,"z1":33.212,"a":false,"y1":14.573,"n":"Gly","y2":15.539,"z2":31.483,"x2":24.709,"h":false,"x1":23.416},{"s":false,"z1":31.223,"a":false,"y1":17.833,"n":"Leu","y2":18.604,"z2":32.663,"x2":25.093,"h":false,"x1":23.367},{"s":false,"z1":30.592,"a":false,"y1":19.209,"n":"Asp","y2":20.647,"z2":28.659,"x2":26.753,"h":true,"x1":26.905},{"s":false,"z1":30.001,"a":false,"y1":22.868,"n":"Ile","y2":23.835,"z2":28.012,"x2":26.803,"h":true,"x1":26.077},{"s":false,"z1":28.345,"a":false,"y1":23.568,"n":"Gln","y2":23.736,"z2":26.029,"x2":29.738,"h":true,"x1":29.478},{"s":false,"z1":25.321,"a":false,"y1":21.338,"n":"Lys","y2":21.748,"z2":23.294,"x2":27.381,"h":true,"x1":28.569},{"s":false,"z1":24.32,"a":true,"y1":23.473,"n":"Val","y2":25.519,"z2":23.06,"x2":25.304,"h":true,"x1":25.531},{"s":false,"z1":23.551,"a":false,"y1":26.493,"n":"Ala","y2":25.634,"z2":21.344,"x2":27.904,"h":true,"x1":27.782},{"s":true,"z1":20.149,"a":true,"y1":28.107,"n":"Gly","y2":28.74,"z2":20.282,"x2":25.205,"h":false,"x1":27.472},{"s":true,"z1":17.558,"a":false,"y1":29.061,"n":"Thr","y2":26.79,"z2":17.512,"x2":24.059,"h":false,"x1":24.901},{"s":false,"z1":17.448,"a":false,"y1":27.618,"n":"Trp","y2":29.665,"z2":16.527,"x2":20.508,"h":false,"x1":21.401},{"s":true,"z1":15.454,"a":false,"y1":28.418,"n":"Tyr","y2":26.713,"z2":16.34,"x2":16.86,"h":false,"x1":18.26},{"s":true,"z1":16.865,"a":false,"y1":28.413,"n":"Ser","y2":28.604,"z2":14.88,"x2":13.42,"h":false,"x1":14.685},{"s":true,"z1":14.608,"a":false,"y1":25.951,"n":"Leu","y2":25.885,"z2":13.959,"x2":10.46,"h":false,"x1":12.785},{"s":true,"z1":16.474,"a":false,"y1":25.628,"n":"Ala","y2":25.985,"z2":18.739,"x2":10.178,"h":false,"x1":9.478},{"s":true,"z1":19.506,"a":false,"y1":26.974,"n":"Met","y2":26.386,"z2":18.931,"x2":5.483,"h":false,"x1":7.711},{"s":true,"z1":21.602,"a":true,"y1":26.177,"n":"Ala","y2":26.878,"z2":23.743,"x2":5.501,"h":false,"x1":4.617},{"s":true,"z1":24.665,"a":false,"y1":27.621,"n":"Ala","y2":26.753,"z2":24.484,"x2":0.789,"h":false,"x1":3},{"s":false,"z1":27.229,"a":false,"y1":26.749,"n":"Ser","y2":27.413,"z2":27.344,"x2":-1.947,"h":false,"x1":0.345},{"s":false,"z1":26.605,"a":false,"y1":30.073,"n":"Asp","y2":31.315,"z2":25.049,"x2":-0.075,"h":true,"x1":-1.423},{"s":false,"z1":23.224,"a":false,"y1":31.693,"n":"Ile","y2":33.359,"z2":22.524,"x2":-0.578,"h":true,"x1":-2.185},{"s":false,"z1":24.518,"a":false,"y1":35.134,"n":"Ser","y2":36.164,"z2":24.681,"x2":0.874,"h":true,"x1":-1.237},{"s":false,"z1":25.316,"a":false,"y1":33.985,"n":"Leu","y2":34.832,"z2":24.021,"x2":4.134,"h":true,"x1":2.322},{"s":false,"z1":21.582,"a":true,"y1":33.841,"n":"Leu","y2":34.5,"z2":19.296,"x2":2.867,"h":true,"x1":3.219},{"s":false,"z1":19.728,"a":false,"y1":35.68,"n":"Asp","y2":36.111,"z2":17.548,"x2":1.251,"h":true,"x1":0.409},{"s":false,"z1":17.925,"a":false,"y1":38.694,"n":"Ala","y2":38.478,"z2":19.212,"x2":3.961,"h":false,"x1":1.912},{"s":false,"z1":17.172,"a":false,"y1":39.542,"n":"Gln","y2":39.941,"z2":18.746,"x2":7.316,"h":false,"x1":5.558},{"s":false,"z1":20.412,"a":false,"y1":41.591,"n":"Ser","y2":41.316,"z2":22.776,"x2":6.003,"h":false,"x1":5.827},{"s":false,"z1":22.905,"a":false,"y1":38.917,"n":"Ala","y2":38.517,"z2":22.866,"x2":7.11,"h":false,"x1":4.742},{"s":false,"z1":25.6,"a":false,"y1":38.788,"n":"Pro","y2":37.42,"z2":25.566,"x2":9.392,"h":false,"x1":7.447},{"s":false,"z1":25.133,"a":false,"y1":35.051,"n":"Leu","y2":33.585,"z2":23.389,"x2":8.725,"h":false,"x1":8.098},{"s":false,"z1":21.31,"a":false,"y1":35.18,"n":"Arg","y2":36.747,"z2":20.433,"x2":9.79,"h":false,"x1":8.166},{"s":false,"z1":21.148,"a":false,"y1":35.346,"n":"Val","y2":33.093,"z2":20.477,"x2":12.383,"h":false,"x1":12.021},{"s":true,"z1":18.701,"a":false,"y1":33.644,"n":"Tyr","y2":34.503,"z2":19.331,"x2":16.519,"h":false,"x1":14.412},{"s":true,"z1":20.115,"a":false,"y1":32.063,"n":"Val","y2":31.494,"z2":17.933,"x2":18.374,"h":false,"x1":17.578},{"s":true,"z1":18.289,"a":false,"y1":32.965,"n":"Glu","y2":31.654,"z2":17.935,"x2":22.698,"h":false,"x1":20.759},{"s":true,"z1":20.563,"a":false,"y1":31.66,"n":"Glu","y2":32.117,"z2":22.731,"x2":22.823,"h":false,"x1":23.523},{"s":true,"z1":23.966,"a":false,"y1":29.956,"n":"Leu","y2":29.666,"z2":23.667,"x2":26.449,"h":false,"x1":24.086},{"s":true,"z1":25.938,"a":true,"y1":30.906,"n":"Lys","y2":31.478,"z2":28.262,"x2":27.066,"h":false,"x1":27.202},{"s":true,"z1":29.094,"a":false,"y1":28.966,"n":"Pro","y2":30.163,"z2":28.905,"x2":29.906,"h":false,"x1":27.825},{"s":false,"z1":31.549,"a":false,"y1":30.734,"n":"Thr","y2":28.576,"z2":32.569,"x2":30.48,"h":false,"x1":30.097},{"s":false,"z1":33.303,"a":false,"y1":29.144,"n":"Pro","y2":27.696,"z2":35.147,"x2":32.74,"h":false,"x1":33.086},{"s":false,"z1":36.497,"a":false,"y1":29.4,"n":"Glu","y2":28.244,"z2":37.356,"x2":29.17,"h":false,"x1":31.025},{"s":false,"z1":35.069,"a":false,"y1":27.253,"n":"Gly","y2":27.318,"z2":34.893,"x2":25.827,"h":false,"x1":28.189},{"s":false,"z1":34.3,"a":false,"y1":30.015,"n":"Asp","y2":29.536,"z2":32.027,"x2":26.319,"h":false,"x1":25.658},{"s":true,"z1":30.859,"a":false,"y1":30.425,"n":"Leu","y2":32.322,"z2":30.693,"x2":22.553,"h":false,"x1":24.045},{"s":true,"z1":28.78,"a":false,"y1":33.558,"n":"Glu","y2":32.318,"z2":26.74,"x2":23.787,"h":false,"x1":24.145},{"s":true,"z1":26.15,"a":false,"y1":33.658,"n":"Ile","y2":35.864,"z2":25.707,"x2":20.826,"h":false,"x1":21.412},{"s":true,"z1":22.976,"a":false,"y1":35.747,"n":"Leu","y2":34.337,"z2":21.669,"x2":20.186,"h":false,"x1":21.598},{"s":true,"z1":21.563,"a":false,"y1":36.242,"n":"Leu","y2":38.539,"z2":20.809,"x2":18.273,"h":false,"x1":18.126},{"s":true,"z1":18.805,"a":false,"y1":38.161,"n":"Gln","y2":37.275,"z2":19.323,"x2":14.252,"h":false,"x1":16.419},{"s":true,"z1":19.416,"a":false,"y1":39.808,"n":"Lys","y2":41.703,"z2":17.989,"x2":13.491,"h":false,"x1":13.074},{"s":true,"z1":17.207,"a":true,"y1":41.984,"n":"Trp","y2":42.882,"z2":19.042,"x2":9.602,"h":false,"x1":10.871},{"s":true,"z1":18.639,"a":false,"y1":45.501,"n":"Glu","y2":46.951,"z2":16.938,"x2":11.384,"h":false,"x1":10.509},{"s":false,"z1":16.613,"a":false,"y1":48.362,"n":"Asn","y2":49.153,"z2":14.512,"x2":9.702,"h":false,"x1":9.011},{"s":false,"z1":13.102,"a":false,"y1":46.877,"n":"Gly","y2":46.875,"z2":11.753,"x2":11.472,"h":false,"x1":9.476},{"s":true,"z1":13.818,"a":false,"y1":45.881,"n":"Glu","y2":43.927,"z2":15.13,"x2":12.447,"h":false,"x1":13.083},{"s":true,"z1":14.906,"a":false,"y1":42.768,"n":"Cys","y2":43.456,"z2":15.652,"x2":17.102,"h":false,"x1":14.953},{"s":true,"z1":18.287,"a":false,"y1":43.628,"n":"Ala","y2":41.291,"z2":18.922,"x2":16.664,"h":false,"x1":16.445},{"s":true,"z1":20.126,"a":false,"y1":41.702,"n":"Gln","y2":43.131,"z2":22.073,"x2":18.995,"h":false,"x1":19.096},{"s":true,"z1":23.824,"a":false,"y1":41,"n":"Lys","y2":38.71,"z2":23.914,"x2":19.686,"h":false,"x1":18.857},{"s":true,"z1":26.166,"a":false,"y1":39.275,"n":"Lys","y2":40.043,"z2":28.344,"x2":20.522,"h":false,"x1":21.246},{"s":true,"z1":29.265,"a":false,"y1":37.572,"n":"Ile","y2":35.571,"z2":29.239,"x2":21.271,"h":false,"x1":19.91},{"s":true,"z1":31.896,"a":false,"y1":35.555,"n":"Ile","y2":35.116,"z2":33.485,"x2":20.057,"h":false,"x1":21.755},{"s":true,"z1":33.264,"a":false,"y1":32.361,"n":"Ala","y2":31.064,"z2":33.8,"x2":22.194,"h":false,"x1":20.187},{"s":true,"z1":36.523,"a":true,"y1":31.424,"n":"Glu","y2":29.632,"z2":37.041,"x2":20.521,"h":false,"x1":21.943},{"s":true,"z1":37.687,"a":false,"y1":27.849,"n":"Lys","y2":28.889,"z2":39.774,"x2":21.572,"h":false,"x1":22.508},{"s":false,"z1":40.482,"a":false,"y1":26.625,"n":"Thr","y2":24.678,"z2":40.575,"x2":21.628,"h":false,"x1":20.288},{"s":false,"z1":42.775,"a":false,"y1":23.598,"n":"Lys","y2":21.266,"z2":42.181,"x2":20.493,"h":false,"x1":20.524},{"s":false,"z1":40.179,"a":false,"y1":21.598,"n":"Ile","y2":22.79,"z2":38.283,"x2":19.476,"h":false,"x1":18.616},{"s":false,"z1":37.197,"a":false,"y1":20.585,"n":"Pro","y2":20.331,"z2":36.293,"x2":18.451,"h":false,"x1":20.686},{"s":false,"z1":33.876,"a":false,"y1":21.629,"n":"Ala","y2":22.955,"z2":33.194,"x2":17.211,"h":false,"x1":19.103},{"s":true,"z1":35.619,"a":false,"y1":24.36,"n":"Val","y2":25.624,"z2":36.704,"x2":18.774,"h":false,"x1":17.055},{"s":true,"z1":35.278,"a":false,"y1":27.968,"n":"Phe","y2":28.926,"z2":35.257,"x2":16.153,"h":false,"x1":18.324},{"s":true,"z1":36.73,"a":true,"y1":31.131,"n":"Lys","y2":32.87,"z2":36.346,"x2":18.405,"h":false,"x1":16.826},{"s":true,"z1":35.054,"a":false,"y1":34.484,"n":"Ile","y2":35.458,"z2":36.439,"x2":14.912,"h":false,"x1":16.585},{"s":false,"z1":38.144,"a":false,"y1":36.65,"n":"Asp","y2":38.999,"z2":38.662,"x2":17.039,"h":false,"x1":16.834},{"s":false,"z1":36.758,"a":false,"y1":39.744,"n":"Ala","y2":39.397,"z2":38.51,"x2":13.481,"h":false,"x1":15.104},{"s":false,"z1":38.312,"a":false,"y1":41.831,"n":"Leu","y2":40.625,"z2":39.121,"x2":10.374,"h":false,"x1":12.304},{"s":false,"z1":36.723,"a":false,"y1":39.29,"n":"Asn","y2":37.858,"z2":35.511,"x2":11.421,"h":false,"x1":9.895},{"s":false,"z1":37.409,"a":false,"y1":35.862,"n":"Glu","y2":34.641,"z2":36.166,"x2":9.716,"h":false,"x1":11.359},{"s":true,"z1":34.747,"a":false,"y1":33.185,"n":"Asn","y2":32.347,"z2":35.31,"x2":13.673,"h":false,"x1":11.556},{"s":true,"z1":34.813,"a":false,"y1":29.687,"n":"Lys","y2":29.32,"z2":32.555,"x2":12.305,"h":false,"x1":13.036},{"s":true,"z1":31.837,"a":false,"y1":28.051,"n":"Val","y2":26.281,"z2":33.135,"x2":15.69,"h":false,"x1":14.703},{"s":true,"z1":31.804,"a":false,"y1":24.275,"n":"Leu","y2":23.709,"z2":29.544,"x2":14.219,"h":false,"x1":14.364},{"s":true,"z1":29.51,"a":false,"y1":22.042,"n":"Val","y2":19.929,"z2":30.53,"x2":15.995,"h":false,"x1":16.418},{"s":true,"z1":28.582,"a":false,"y1":19.068,"n":"Leu","y2":16.847,"z2":28.478,"x2":15.08,"h":false,"x1":14.292},{"s":true,"z1":26.312,"a":true,"y1":17.247,"n":"Asp","y2":18.961,"z2":24.715,"x2":17.262,"h":false,"x1":16.761},{"s":true,"z1":23.901,"a":false,"y1":17.728,"n":"Thr","y2":15.752,"z2":24.393,"x2":20.918,"h":false,"x1":19.644},{"s":false,"z1":21.994,"a":false,"y1":15.614,"n":"Asp","y2":15.957,"z2":21.151,"x2":24.405,"h":false,"x1":22.149},{"s":false,"z1":21.85,"a":false,"y1":18.656,"n":"Tyr","y2":20.16,"z2":20.086,"x2":25.074,"h":false,"x1":24.459},{"s":false,"z1":18.13,"a":false,"y1":18.244,"n":"Lys","y2":18.831,"z2":15.999,"x2":24.473,"h":false,"x1":25.255},{"s":false,"z1":16.527,"a":false,"y1":18.618,"n":"Lys","y2":20.404,"z2":16.48,"x2":20.242,"h":false,"x1":21.82},{"s":true,"z1":18.769,"a":false,"y1":19.643,"n":"Tyr","y2":19.294,"z2":21.022,"x2":19.726,"h":false,"x1":18.959},{"s":true,"z1":22.125,"a":false,"y1":21.18,"n":"Leu","y2":22.405,"z2":21.584,"x2":16.098,"h":false,"x1":18.068},{"s":true,"z1":23.652,"a":false,"y1":21.346,"n":"Leu","y2":21.6,"z2":25.92,"x2":15.194,"h":false,"x1":14.581},{"s":true,"z1":26.361,"a":false,"y1":23.872,"n":"Phe","y2":24.961,"z2":25.468,"x2":11.948,"h":false,"x1":13.838},{"s":true,"z1":28.056,"a":false,"y1":25.707,"n":"Cys","y2":26.822,"z2":29.729,"x2":12.399,"h":false,"x1":11.021},{"s":true,"z1":29.721,"a":false,"y1":29.125,"n":"Met","y2":28.956,"z2":29.915,"x2":8.316,"h":false,"x1":10.733},{"s":true,"z1":32.641,"a":true,"y1":29.245,"n":"Glu","y2":31.227,"z2":33.776,"x2":9.14,"h":false,"x1":8.349},{"s":true,"z1":34.281,"a":false,"y1":32.154,"n":"Asn","y2":31.385,"z2":35.571,"x2":4.74,"h":false,"x1":6.596},{"s":false,"z1":37.937,"a":false,"y1":31.241,"n":"Ser","y2":32.101,"z2":39.021,"x2":4.074,"h":false,"x1":6.042},{"s":false,"z1":38.996,"a":false,"y1":34.741,"n":"Ala","y2":35.434,"z2":39.153,"x2":2.647,"h":false,"x1":4.935},{"s":false,"z1":36.72,"a":false,"y1":34.296,"n":"Glu","y2":32.395,"z2":38.156,"x2":1.503,"h":false,"x1":1.887},{"s":false,"z1":37.652,"a":false,"y1":32.354,"n":"Pro","y2":30.369,"z2":38.7,"x2":-0.415,"h":false,"x1":-1.239},{"s":false,"z1":36.669,"a":false,"y1":28.693,"n":"Glu","y2":27.71,"z2":37.02,"x2":0.927,"h":false,"x1":-1.226},{"s":false,"z1":34.37,"a":false,"y1":27.508,"n":"Gln","y2":27.488,"z2":31.998,"x2":1.205,"h":false,"x1":1.517},{"s":true,"z1":31.695,"a":false,"y1":29.921,"n":"Ser","y2":29.519,"z2":32.1,"x2":4.909,"h":false,"x1":2.579},{"s":true,"z1":29.824,"a":false,"y1":27.851,"n":"Leu","y2":28,"z2":27.671,"x2":4.205,"h":false,"x1":5.162},{"s":true,"z1":26.337,"a":false,"y1":28.403,"n":"Ala","y2":27.708,"z2":26.88,"x2":8.838,"h":false,"x1":6.637},{"s":true,"z1":24.874,"a":false,"y1":25.732,"n":"Cys","y2":26.446,"z2":22.595,"x2":8.683,"h":false,"x1":8.962},{"s":true,"z1":21.839,"a":false,"y1":25.721,"n":"Gln","y2":23.84,"z2":22.345,"x2":12.593,"h":false,"x1":11.209},{"s":true,"z1":19.575,"a":false,"y1":23.274,"n":"Cys","y2":24.732,"z2":17.901,"x2":13.8,"h":false,"x1":12.904},{"s":true,"z1":18.734,"a":true,"y1":24.522,"n":"Leu","y2":22.412,"z2":18.299,"x2":17.33,"h":false,"x1":16.424},{"s":true,"z1":15.982,"a":false,"y1":23.073,"n":"Val","y2":25.02,"z2":15.642,"x2":20.033,"h":false,"x1":18.646},{"s":false,"z1":15.247,"a":false,"y1":23.609,"n":"Arg","y2":25.217,"z2":13.642,"x2":23.154,"h":false,"x1":22.362},{"s":false,"z1":11.529,"a":false,"y1":23.928,"n":"Thr","y2":22.7,"z2":11.279,"x2":19.771,"h":false,"x1":21.859},{"s":false,"z1":9.212,"a":false,"y1":24.319,"n":"Pro","y2":23.109,"z2":7.348,"x2":17.99,"h":false,"x1":18.894},{"s":false,"z1":7.734,"a":false,"y1":20.79,"n":"Glu","y2":20.606,"z2":8.514,"x2":17.245,"h":false,"x1":19.479},{"s":false,"z1":6.419,"a":false,"y1":18.883,"n":"Val","y2":16.682,"z2":6.434,"x2":15.359,"h":false,"x1":16.395},{"s":false,"z1":8.951,"a":false,"y1":16.048,"n":"Asp","y2":17.599,"z2":10.448,"x2":14.965,"h":false,"x1":15.875},{"s":false,"z1":11.339,"a":false,"y1":16.05,"n":"Asp","y2":15.214,"z2":13.426,"x2":12.009,"h":true,"x1":12.884},{"s":false,"z1":14.264,"a":false,"y1":14.142,"n":"Glu","y2":14.735,"z2":16.378,"x2":13.418,"h":true,"x1":14.377},{"s":false,"z1":16.363,"a":false,"y1":17.348,"n":"Ala","y2":17.732,"z2":17.652,"x2":12.372,"h":true,"x1":14.37},{"s":false,"z1":15.445,"a":false,"y1":18.104,"n":"Leu","y2":17.227,"z2":16.733,"x2":8.957,"h":true,"x1":10.759},{"s":false,"z1":16.337,"a":false,"y1":14.564,"n":"Glu","y2":14.243,"z2":18.636,"x2":8.919,"h":true,"x1":9.603},{"s":false,"z1":19.698,"a":false,"y1":14.679,"n":"Lys","y2":15.66,"z2":21.537,"x2":10.219,"h":true,"x1":11.369},{"s":false,"z1":20.406,"a":false,"y1":18.144,"n":"Phe","y2":17.984,"z2":21.649,"x2":7.736,"h":true,"x1":9.801},{"s":false,"z1":19.535,"a":false,"y1":16.743,"n":"Asp","y2":15.854,"z2":21.316,"x2":5.087,"h":true,"x1":6.4},{"s":false,"z1":21.833,"a":false,"y1":13.79,"n":"Lys","y2":13.953,"z2":24.209,"x2":6.527,"h":true,"x1":6.962},{"s":false,"z1":24.702,"a":true,"y1":15.91,"n":"Ala","y2":16.744,"z2":26.267,"x2":6.746,"h":true,"x1":8.311},{"s":false,"z1":24.485,"a":false,"y1":18.18,"n":"Leu","y2":18.055,"z2":24.826,"x2":2.822,"h":true,"x1":5.191},{"s":false,"z1":24.523,"a":false,"y1":15.305,"n":"Lys","y2":15.325,"z2":26.15,"x2":0.917,"h":true,"x1":2.668},{"s":false,"z1":28.325,"a":true,"y1":15.578,"n":"Ala","y2":17.03,"z2":29.981,"x2":1.692,"h":true,"x1":2.541},{"s":false,"z1":28.458,"a":false,"y1":19.348,"n":"Leu","y2":19.545,"z2":26.519,"x2":0.427,"h":true,"x1":1.868},{"s":false,"z1":27.626,"a":false,"y1":21.465,"n":"Pro","y2":23.85,"z2":27.244,"x2":-0.904,"h":false,"x1":-1.174},{"s":false,"z1":24.685,"a":false,"y1":23.568,"n":"Met","y2":23.329,"z2":23.226,"x2":-1.833,"h":false,"x1":0.051},{"s":false,"z1":23.107,"a":false,"y1":25.864,"n":"His","y2":27.064,"z2":21.083,"x2":-3.082,"h":false,"x1":-2.599},{"s":true,"z1":20.349,"a":false,"y1":27.414,"n":"Ile","y2":26.505,"z2":20.86,"x2":1.636,"h":false,"x1":-0.488},{"s":true,"z1":18.23,"a":false,"y1":25.767,"n":"Arg","y2":26.578,"z2":16.095,"x2":1.649,"h":false,"x1":2.162},{"s":true,"z1":15.573,"a":true,"y1":27.491,"n":"Leu","y2":26.268,"z2":15.887,"x2":6.343,"h":false,"x1":4.314},{"s":true,"z1":13.129,"a":false,"y1":26.066,"n":"Ser","y2":27.472,"z2":11.207,"x2":6.668,"h":false,"x1":6.818},{"s":false,"z1":11.186,"a":false,"y1":28.04,"n":"Phe","y2":26.25,"z2":9.87,"x2":10.373,"h":false,"x1":9.428},{"s":false,"z1":7.621,"a":false,"y1":28.046,"n":"Asn","y2":28.375,"z2":6.941,"x2":12.867,"h":false,"x1":10.598},{"s":false,"z1":7.251,"a":false,"y1":28.931,"y2":28.375,"z2":6.941,"x2":12.867,"h":false,"x1":11.782},{"s":false,"z1":7.251,"a":false,"y1":28.931,"y2":28.375,"z2":6.941,"x2":12.867,"h":false,"x1":11.782},{"s":false,"z1":7.251,"a":false,"y1":28.931,"y2":28.375,"z2":6.941,"x2":12.867,"h":false,"x1":11.782},{"s":false,"z1":7.251,"a":false,"y1":28.931,"y2":28.375,"z2":6.941,"x2":12.867,"h":false,"x1":11.782}]]},"mol":{"b":[],"a":[{"p_w":true,"p_h":true,"l":"O","z":35.308,"y":42.981,"x":14.595},{"p_w":true,"p_h":true,"l":"O","z":32.404,"y":38.947,"x":19.743},{"p_w":true,"p_h":true,"l":"O","z":34.276,"y":41.905,"x":11.812},{"p_w":true,"p_h":true,"l":"O","z":14.395,"y":25.181,"x":25.976},{"p_w":true,"p_h":true,"l":"O","z":37.301,"y":24.429,"x":21.296},{"p_w":true,"p_h":true,"l":"O","z":36.113,"y":36.136,"x":19.837},{"p_w":true,"p_h":true,"l":"O","z":33.169,"y":37.392,"x":12.801},{"p_w":true,"p_h":true,"l":"O","z":29.641,"y":26.574,"x":-3.932},{"p_w":true,"p_h":true,"l":"O","z":26.41,"y":25.939,"x":31.662},{"p_w":true,"p_h":true,"l":"O","z":23.254,"y":31.108,"x":9.276},{"p_w":true,"p_h":true,"l":"O","z":15.082,"y":31.475,"x":21.958},{"p_w":true,"p_h":true,"l":"O","z":13.297,"y":20.47,"x":21.262},{"p_w":true,"p_h":true,"l":"O","z":35.09,"y":17.46,"x":24.15},{"p_w":true,"p_h":true,"l":"O","z":33.302,"y":20.908,"x":26.202},{"p_w":true,"p_h":true,"l":"O","z":34.936,"y":24.836,"x":25.528},{"p_w":true,"p_h":true,"l":"O","z":35.289,"y":33.591,"x":28.505},{"p_w":true,"p_h":true,"l":"O","z":5.169,"y":28.743,"x":14.695},{"p_w":true,"p_h":true,"l":"O","z":40.139,"y":39.295,"x":19.995},{"p_w":true,"p_h":true,"l":"O","z":21.318,"y":20.426,"x":29.092},{"p_w":true,"p_h":true,"l":"O","z":13.26,"y":17.38,"x":16.826},{"p_w":true,"p_h":true,"l":"O","z":40.552,"y":25.501,"x":15.509},{"p_w":true,"p_h":true,"l":"O","z":25.77,"y":30.276,"x":-4.844},{"p_w":true,"p_h":true,"l":"O","z":20.908,"y":17.137,"x":2.716},{"p_w":true,"p_h":true,"l":"O","z":44.697,"y":20.831,"x":21.42},{"p_w":true,"p_h":true,"l":"O","z":29.261,"y":28.626,"x":32.504},{"p_w":true,"p_h":true,"l":"O","z":32.996,"y":25.952,"x":-0.526},{"p_w":true,"p_h":true,"l":"O","z":5.376,"y":31.069,"x":13.475},{"p_w":true,"p_h":true,"l":"O","z":29.279,"y":35.647,"x":-3.765},{"p_w":true,"p_h":true,"l":"O","z":13.052,"y":18.479,"x":23.383},{"p_w":true,"p_h":true,"l":"O","z":34.449,"y":41.801,"x":17.198},{"p_w":true,"p_h":true,"l":"O","z":14.886,"y":20.371,"x":26.888},{"p_w":true,"p_h":true,"l":"O","z":10.415,"y":12.098,"x":8.381},{"p_w":true,"p_h":true,"l":"O","z":32.494,"y":21.141,"x":30.589},{"p_w":true,"p_h":true,"l":"O","z":14.196,"y":33.382,"x":20.035},{"p_w":true,"p_h":true,"l":"O","z":15.146,"y":37.539,"x":8.007},{"p_w":true,"p_h":true,"l":"O","z":14.192,"y":40.621,"x":18.619},{"p_w":true,"p_h":true,"l":"O","z":26.101,"y":41.902,"x":7.717},{"p_w":true,"p_h":true,"l":"O","z":39.22,"y":26.6,"x":9.773},{"p_w":true,"p_h":true,"l":"O","z":34.13,"y":36.585,"x":-1.264},{"p_w":true,"p_h":true,"l":"O","z":18.527,"y":38.71,"x":9.549},{"p_w":true,"p_h":true,"l":"O","z":29.774,"y":25.775,"x":-6.226},{"p_w":true,"p_h":true,"l":"O","z":41.643,"y":20.408,"x":23.448},{"p_w":true,"p_h":true,"l":"O","z":34.516,"y":40.074,"x":21.928},{"p_w":true,"p_h":true,"l":"O","z":39.605,"y":31.636,"x":11.991},{"p_w":true,"p_h":true,"l":"O","z":29.247,"y":19.633,"x":32.596},{"p_w":true,"p_h":true,"l":"O","z":18.282,"y":14.384,"x":1.697},{"p_w":true,"p_h":true,"l":"O","z":15.52,"y":31.637,"x":16.433},{"p_w":true,"p_h":true,"l":"O","z":15.897,"y":26.576,"x":27.005},{"p_w":true,"p_h":true,"l":"O","z":9.026,"y":30.758,"x":13.613},{"p_w":true,"p_h":true,"l":"O","z":7.695,"y":25.739,"x":12.323},{"p_w":true,"p_h":true,"l":"O","z":37.501,"y":30.322,"x":9.474},{"p_w":true,"p_h":true,"l":"O","z":41.138,"y":30.125,"x":4.958},{"p_w":true,"p_h":true,"l":"O","z":15.07,"y":40.666,"x":1.934},{"p_w":true,"p_h":true,"l":"O","z":34.607,"y":22.052,"x":4.464},{"p_w":true,"p_h":true,"l":"O","z":13.867,"y":33.674,"x":16.899},{"p_w":true,"p_h":true,"l":"O","z":13.502,"y":30.827,"x":13.435},{"p_w":true,"p_h":true,"l":"O","z":33.755,"y":20.882,"x":28.687},{"p_w":true,"p_h":true,"l":"O","z":14.584,"y":49.647,"x":12.022},{"p_w":true,"p_h":true,"l":"O","z":30.837,"y":25.477,"x":-2.08},{"p_w":true,"p_h":true,"l":"O","z":13.572,"y":30.2,"x":16.545},{"p_w":true,"p_h":true,"l":"O","z":21.943,"y":30.711,"x":28.854},{"p_w":true,"p_h":true,"l":"O","z":32.951,"y":23.2,"x":1.192},{"p_w":true,"p_h":true,"l":"O","z":41.632,"y":10.593,"x":11.01},{"p_w":true,"p_h":true,"l":"O","z":20.983,"y":34.24,"x":30.574},{"p_w":true,"p_h":true,"l":"O","z":15.262,"y":40.183,"x":13.036},{"p_w":true,"p_h":true,"l":"O","z":9.683,"y":27.755,"x":14.616},{"p_w":true,"p_h":true,"l":"O","z":42.136,"y":29.273,"x":24.126},{"p_w":true,"p_h":true,"l":"O","z":13.772,"y":38.257,"x":13.083},{"p_w":true,"p_h":true,"l":"O","z":11.346,"y":30.068,"x":14.802},{"p_w":true,"p_h":true,"l":"O","z":24.94,"y":31.641,"x":22.102},{"p_w":true,"p_h":true,"l":"O","z":23.829,"y":13.587,"x":13.529},{"p_w":true,"p_h":true,"l":"O","z":18.389,"y":12.272,"x":6.943},{"p_w":true,"p_h":true,"l":"O","z":15.499,"y":21.686,"x":5.917},{"p_w":true,"p_h":true,"l":"O","z":18.074,"y":50.543,"x":12.403},{"p_w":true,"p_h":true,"l":"O","z":34.24,"y":18.774,"x":9.56},{"p_w":true,"p_h":true,"l":"O","z":35.235,"y":28.365,"x":3.937},{"p_w":true,"p_h":true,"l":"O","z":23.107,"y":13.299,"x":11.055},{"p_w":true,"p_h":true,"l":"O","z":12.727,"y":51.63,"x":8.06},{"p_w":true,"p_h":true,"l":"O","z":20.673,"y":43.217,"x":12.668},{"p_w":true,"p_h":true,"l":"O","z":6.398,"y":16.408,"x":18.842},{"p_w":true,"p_h":true,"l":"O","z":20.241,"y":22.086,"x":1.84},{"p_w":true,"p_h":true,"l":"O","z":36.234,"y":17.816,"x":17.209},{"p_w":true,"p_h":true,"l":"O","z":41.704,"y":17.592,"x":15.507},{"p_w":true,"p_h":true,"l":"O","z":41.441,"y":29.547,"x":8.429},{"p_w":true,"p_h":true,"l":"O","z":41.625,"y":41.499,"x":10.115},{"p_w":true,"p_h":true,"l":"O","z":17.515,"y":45.366,"x":13.347},{"p_w":true,"p_h":true,"l":"O","z":40.745,"y":32.517,"x":19.981},{"p_w":true,"p_h":true,"l":"O","z":4.393,"y":21.152,"x":14.392},{"p_w":true,"p_h":true,"l":"O","z":17.39,"y":44.661,"x":6.944},{"p_w":true,"p_h":true,"l":"O","z":35.033,"y":38.377,"x":18.838},{"p_w":true,"p_h":true,"l":"O","z":11.49,"y":41.485,"x":18.195},{"p_w":true,"p_h":true,"l":"O","z":19.941,"y":24.228,"x":-2.598},{"p_w":true,"p_h":true,"l":"O","z":16.308,"y":25.113,"x":25.174},{"p_w":true,"p_h":true,"l":"O","z":37.093,"y":26.48,"x":5.358},{"p_w":true,"p_h":true,"l":"O","z":20.073,"y":33.147,"x":-0.644},{"p_w":true,"p_h":true,"l":"O","z":33.695,"y":37.608,"x":20.806},{"p_w":true,"p_h":true,"l":"O","z":39.075,"y":29.433,"x":3.054},{"p_w":true,"p_h":true,"l":"O","z":10.942,"y":46.906,"x":18.371},{"p_w":true,"p_h":true,"l":"O","z":33.535,"y":23.775,"x":30.656},{"p_w":true,"p_h":true,"l":"O","z":22.622,"y":38.213,"x":15},{"p_w":true,"p_h":true,"l":"O","z":40.135,"y":46.201,"x":11.25},{"p_w":true,"p_h":true,"l":"O","z":18.064,"y":44.835,"x":3.394},{"p_w":true,"p_h":true,"l":"O","z":22.936,"y":44.279,"x":15.033},{"p_w":true,"p_h":true,"l":"O","z":9.008,"y":24.23,"x":8.645}]}});
var pdb_1BEB = new ChemDoodle.io.JSONInterpreter().pdbFrom({"ribbons":{"cs":[[{"s":false,"z1":-4.336,"a":false,"y1":14.212,"y2":14.212,"z2":-4.336,"x2":-25.924,"h":false,"x1":-25.924},{"s":false,"z1":-4.336,"a":false,"y1":14.212,"y2":14.212,"z2":-4.336,"x2":-25.924,"h":false,"x1":-25.924},{"s":false,"z1":-4.427,"a":false,"y1":15.615,"n":"Gln","y2":16.703,"z2":-4.806,"x2":-24.374,"h":false,"x1":-26.461},{"s":false,"z1":-7.381,"a":false,"y1":17.507,"n":"Thr","y2":19.642,"z2":-6.903,"x2":-26.039,"h":false,"x1":-25.054},{"s":false,"z1":-8.437,"a":false,"y1":21.052,"n":"Met","y2":20.946,"z2":-10.562,"x2":-25.31,"h":false,"x1":-24.189},{"s":false,"z1":-10.024,"a":false,"y1":23.037,"n":"Lys","y2":25.134,"z2":-10.103,"x2":-25.906,"h":false,"x1":-27.036},{"s":false,"z1":-12.771,"a":false,"y1":25.439,"n":"Gly","y2":26.456,"z2":-13.139,"x2":-24.029,"h":false,"x1":-26.126},{"s":false,"z1":-13.28,"a":false,"y1":24.084,"n":"Leu","y2":24.227,"z2":-15.671,"x2":-22.962,"h":false,"x1":-22.603},{"s":false,"z1":-16.023,"a":false,"y1":26.032,"n":"Asp","y2":25.914,"z2":-15.65,"x2":-18.505,"h":false,"x1":-20.866},{"s":false,"z1":-17.254,"a":false,"y1":23.681,"n":"Ile","y2":24.037,"z2":-17.642,"x2":-15.806,"h":true,"x1":-18.148},{"s":false,"z1":-19.132,"a":false,"y1":26.287,"n":"Gln","y2":27.244,"z2":-18.245,"x2":-14.092,"h":true,"x1":-16.104},{"s":false,"z1":-15.842,"a":true,"y1":28.021,"n":"Lys","y2":27.696,"z2":-14.077,"x2":-13.657,"h":true,"x1":-15.23},{"s":false,"z1":-14.467,"a":false,"y1":25.004,"n":"Val","y2":23.877,"z2":-14.724,"x2":-11.236,"h":true,"x1":-13.324},{"s":false,"z1":-17.165,"a":false,"y1":25.041,"n":"Ala","y2":26.451,"z2":-15.709,"x2":-9.459,"h":false,"x1":-10.669},{"s":false,"z1":-15.769,"a":false,"y1":24.933,"n":"Gly","y2":22.711,"z2":-14.856,"x2":-7.174,"h":false,"x1":-7.173},{"s":false,"z1":-13.326,"a":false,"y1":23.278,"n":"Thr","y2":24.217,"z2":-11.552,"x2":-6.158,"h":false,"x1":-4.802},{"s":false,"z1":-10.068,"a":false,"y1":21.804,"n":"Trp","y2":20.066,"z2":-10.029,"x2":-4.551,"h":false,"x1":-6.18},{"s":true,"z1":-7.304,"a":false,"y1":19.74,"n":"Tyr","y2":19.504,"z2":-5.877,"x2":-6.376,"h":false,"x1":-4.498},{"s":true,"z1":-5.331,"a":false,"y1":16.803,"n":"Ser","y2":16.493,"z2":-3.482,"x2":-4.47,"h":false,"x1":-5.97},{"s":true,"z1":-1.728,"a":false,"y1":18.058,"n":"Leu","y2":16.552,"z2":0.137,"x2":-5.784,"h":false,"x1":-6.032},{"s":true,"z1":-0.306,"a":false,"y1":15.26,"n":"Ala","y2":14.666,"z2":-2.233,"x2":-9.397,"h":false,"x1":-8.118},{"s":true,"z1":-1.38,"a":false,"y1":12.035,"n":"Met","y2":10.87,"z2":0.737,"x2":-9.797,"h":false,"x1":-9.789},{"s":true,"z1":0.184,"a":true,"y1":9.388,"n":"Ala","y2":8.622,"z2":-1.805,"x2":-13.166,"h":false,"x1":-12.072},{"s":true,"z1":-0.893,"a":false,"y1":6.086,"n":"Ala","y2":5.168,"z2":1.229,"x2":-14.241,"h":false,"x1":-13.577},{"s":false,"z1":0.136,"a":false,"y1":3.756,"n":"Ser","y2":1.869,"z2":1.611,"x2":-16.135,"h":false,"x1":-16.386},{"s":false,"z1":0.168,"a":false,"y1":0.765,"n":"Asp","y2":1.729,"z2":-0.581,"x2":-11.973,"h":false,"x1":-14.032},{"s":false,"z1":1.653,"a":false,"y1":0.896,"n":"Ile","y2":1.196,"z2":0.198,"x2":-8.601,"h":true,"x1":-10.536},{"s":false,"z1":-1.257,"a":true,"y1":-1.102,"n":"Ser","y2":-0.298,"z2":-3.258,"x2":-8.041,"h":true,"x1":-9.044},{"s":false,"z1":-3.739,"a":false,"y1":1.64,"n":"Leu","y2":3.15,"z2":-4.614,"x2":-8.229,"h":true,"x1":-9.909},{"s":false,"z1":-2.174,"a":false,"y1":3.981,"n":"Leu","y2":4.19,"z2":-1.263,"x2":-5.153,"h":false,"x1":-7.334},{"s":false,"z1":0.01,"a":false,"y1":1.717,"n":"Asp","y2":0.546,"z2":-1.675,"x2":-3.972,"h":false,"x1":-5.178},{"s":false,"z1":-1.26,"a":false,"y1":1.984,"n":"Ala","y2":3.031,"z2":-3.213,"x2":-2.536,"h":false,"x1":-1.588},{"s":false,"z1":-3.965,"a":false,"y1":4.277,"n":"Gln","y2":4.341,"z2":-6.175,"x2":-1.011,"h":false,"x1":-0.132},{"s":false,"z1":-6.426,"a":false,"y1":1.552,"n":"Ser","y2":0.605,"z2":-7.4,"x2":-3.001,"h":false,"x1":-1.035},{"s":false,"z1":-5.315,"a":false,"y1":1.321,"n":"Ala","y2":2.795,"z2":-7.236,"x2":-4.851,"h":false,"x1":-4.702},{"s":false,"z1":-8.359,"a":false,"y1":1.491,"n":"Pro","y2":2.391,"z2":-6.821,"x2":-8.432,"h":false,"x1":-7.047},{"s":false,"z1":-8.028,"a":false,"y1":4.917,"n":"Leu","y2":6.942,"z2":-6.942,"x2":-8.326,"h":false,"x1":-8.649},{"s":false,"z1":-6.301,"a":false,"y1":6.453,"n":"Arg","y2":6.944,"z2":-7.939,"x2":-4.037,"h":false,"x1":-5.705},{"s":false,"z1":-9.021,"a":false,"y1":9.115,"n":"Val","y2":11.084,"z2":-7.979,"x2":-6.335,"h":false,"x1":-5.436},{"s":true,"z1":-8.89,"a":false,"y1":12.762,"n":"Tyr","y2":13.431,"z2":-11.167,"x2":-3.925,"h":false,"x1":-4.268},{"s":true,"z1":-11.081,"a":false,"y1":15.365,"n":"Val","y2":16.862,"z2":-10.379,"x2":-4.177,"h":false,"x1":-5.928},{"s":true,"z1":-13.035,"a":false,"y1":17.585,"n":"Glu","y2":19.907,"z2":-13.289,"x2":-4.039,"h":false,"x1":-3.521},{"s":true,"z1":-15.327,"a":false,"y1":19.442,"n":"Glu","y2":17.91,"z2":-15.821,"x2":-7.68,"h":false,"x1":-5.915},{"s":true,"z1":-16.26,"a":false,"y1":19.986,"n":"Leu","y2":21.933,"z2":-17.604,"x2":-9.346,"h":false,"x1":-9.561},{"s":true,"z1":-19.914,"a":true,"y1":20.802,"n":"Lys","y2":19.611,"z2":-21.076,"x2":-11.872,"h":false,"x1":-10.143},{"s":true,"z1":-20.978,"a":false,"y1":21.574,"n":"Pro","y2":22.523,"z2":-22.932,"x2":-12.666,"h":false,"x1":-13.708},{"s":false,"z1":-24.72,"a":false,"y1":21.223,"n":"Thr","y2":22.389,"z2":-24.298,"x2":-16.316,"h":false,"x1":-14.261},{"s":false,"z1":-26.55,"a":false,"y1":23.917,"n":"Pro","y2":24.09,"z2":-26.417,"x2":-18.657,"h":false,"x1":-16.255},{"s":false,"z1":-26.921,"a":false,"y1":21.376,"n":"Glu","y2":20.365,"z2":-25.609,"x2":-20.789,"h":false,"x1":-19.091},{"s":false,"z1":-23.192,"a":false,"y1":20.894,"n":"Gly","y2":19.405,"z2":-21.337,"x2":-19.552,"h":false,"x1":-19.628},{"s":false,"z1":-22.479,"a":false,"y1":17.735,"n":"Asp","y2":19.296,"z2":-21.705,"x2":-15.941,"h":false,"x1":-17.625},{"s":true,"z1":-20.082,"a":false,"y1":17.492,"n":"Leu","y2":15.273,"z2":-20.373,"x2":-13.907,"h":false,"x1":-14.723},{"s":true,"z1":-20.519,"a":false,"y1":16.133,"n":"Glu","y2":17.394,"z2":-18.724,"x2":-10.307,"h":false,"x1":-11.272},{"s":true,"z1":-17.216,"a":false,"y1":15.273,"n":"Ile","y2":13.4,"z2":-17.609,"x2":-8.249,"h":false,"x1":-9.678},{"s":true,"z1":-17.011,"a":false,"y1":14.749,"n":"Leu","y2":15.084,"z2":-14.671,"x2":-5.706,"h":false,"x1":-5.913},{"s":true,"z1":-14.191,"a":false,"y1":12.697,"n":"Leu","y2":11.687,"z2":-15.252,"x2":-2.59,"h":false,"x1":-4.481},{"s":true,"z1":-12.691,"a":false,"y1":11.156,"n":"Gln","y2":10.027,"z2":-10.951,"x2":-2.549,"h":false,"x1":-1.356},{"s":true,"z1":-11.598,"a":true,"y1":7.542,"n":"Lys","y2":6.688,"z2":-12.623,"x2":0.617,"h":false,"x1":-1.392},{"s":true,"z1":-10.221,"a":false,"y1":5.524,"n":"Trp","y2":3.334,"z2":-10.265,"x2":0.54,"h":false,"x1":1.562},{"s":false,"z1":-12.37,"a":false,"y1":2.409,"n":"Glu","y2":0.503,"z2":-11.211,"x2":3.008,"h":false,"x1":1.986},{"s":false,"z1":-12.631,"a":false,"y1":0.656,"n":"Asn","y2":2.985,"z2":-12.414,"x2":5.64,"h":false,"x1":5.399},{"s":false,"z1":-10.64,"a":false,"y1":2.951,"n":"Gly","y2":5.291,"z2":-10.296,"x2":7.705,"h":false,"x1":7.826},{"s":false,"z1":-12.894,"a":false,"y1":5.94,"n":"Glu","y2":5.752,"z2":-12.068,"x2":4.629,"h":false,"x1":6.912},{"s":true,"z1":-12.306,"a":false,"y1":8.49,"n":"Cys","y2":9.623,"z2":-14.43,"x2":4.09,"h":false,"x1":4.186},{"s":true,"z1":-15.399,"a":false,"y1":7.974,"n":"Ala","y2":9.403,"z2":-14.568,"x2":0.285,"h":false,"x1":2.038},{"s":true,"z1":-17.021,"a":false,"y1":10.329,"n":"Gln","y2":9.01,"z2":-18.809,"x2":-1.283,"h":false,"x1":-0.431},{"s":true,"z1":-18.009,"a":false,"y1":9.227,"n":"Lys","y2":11.282,"z2":-17.572,"x2":-5.088,"h":false,"x1":-3.953},{"s":true,"z1":-19.944,"a":false,"y1":11.202,"n":"Lys","y2":9.624,"z2":-20.878,"x2":-8.06,"h":false,"x1":-6.51},{"s":true,"z1":-19.299,"a":false,"y1":10.507,"n":"Ile","y2":12.723,"z2":-19.727,"x2":-11.017,"h":false,"x1":-10.196},{"s":true,"z1":-21.601,"a":true,"y1":11.864,"n":"Ile","y2":10.471,"z2":-20.713,"x2":-14.662,"h":false,"x1":-12.901},{"s":true,"z1":-19.754,"a":false,"y1":12.656,"n":"Ala","y2":14.439,"z2":-21.076,"x2":-16.987,"h":false,"x1":-16.101},{"s":false,"z1":-21.838,"a":false,"y1":13.069,"n":"Glu","y2":13.21,"z2":-20.002,"x2":-20.8,"h":false,"x1":-19.244},{"s":false,"z1":-20.91,"a":false,"y1":15.593,"n":"Lys","y2":13.909,"z2":-21.786,"x2":-23.317,"h":false,"x1":-21.908},{"s":false,"z1":-20.14,"a":false,"y1":14.572,"n":"Thr","y2":16.892,"z2":-20.148,"x2":-25.97,"h":false,"x1":-25.45},{"s":false,"z1":-19.543,"a":false,"y1":16.51,"n":"Lys","y2":18.601,"z2":-18.37,"x2":-28.641,"h":false,"x1":-28.677},{"s":false,"z1":-16.097,"a":false,"y1":17.49,"n":"Ile","y2":17.082,"z2":-16.37,"x2":-25.099,"h":false,"x1":-27.446},{"s":false,"z1":-16.326,"a":false,"y1":19.863,"n":"Pro","y2":19.204,"z2":-15.69,"x2":-22.225,"h":false,"x1":-24.424},{"s":false,"z1":-13.118,"a":false,"y1":18.367,"n":"Ala","y2":16.326,"z2":-12.449,"x2":-21.885,"h":false,"x1":-22.979},{"s":true,"z1":-14.269,"a":false,"y1":14.763,"n":"Val","y2":14.959,"z2":-16.638,"x2":-23.041,"h":false,"x1":-23.068},{"s":true,"z1":-16.873,"a":true,"y1":13.159,"n":"Phe","y2":11.016,"z2":-15.818,"x2":-20.777,"h":false,"x1":-20.854},{"s":true,"z1":-18.337,"a":false,"y1":9.716,"n":"Lys","y2":10.214,"z2":-19.523,"x2":-18.418,"h":false,"x1":-20.421},{"s":false,"z1":-18.452,"a":false,"y1":8.038,"n":"Ile","y2":5.778,"z2":-18.185,"x2":-17.836,"h":false,"x1":-16.996},{"s":false,"z1":-19.39,"a":false,"y1":4.648,"n":"Asp","y2":4.298,"z2":-19.812,"x2":-13.257,"h":false,"x1":-15.577},{"s":false,"z1":-17.136,"a":false,"y1":4.549,"n":"Ala","y2":4.512,"z2":-14.944,"x2":-13.409,"h":false,"x1":-12.505},{"s":false,"z1":-13.929,"a":false,"y1":2.912,"n":"Leu","y2":2.216,"z2":-12.164,"x2":-12.689,"h":false,"x1":-11.235},{"s":false,"z1":-13.87,"a":false,"y1":0.643,"n":"Asn","y2":1.014,"z2":-12.778,"x2":-16.303,"h":false,"x1":-14.237},{"s":false,"z1":-13.215,"a":false,"y1":3.757,"n":"Glu","y2":3.964,"z2":-15.566,"x2":-16.577,"h":false,"x1":-16.298},{"s":false,"z1":-15.401,"a":false,"y1":5.128,"n":"Asn","y2":6.983,"z2":-16.104,"x2":-20.447,"h":false,"x1":-19.073},{"s":true,"z1":-13.792,"a":false,"y1":8.41,"n":"Lys","y2":8.923,"z2":-12.102,"x2":-18.521,"h":false,"x1":-20.154},{"s":true,"z1":-12.702,"a":false,"y1":11.668,"n":"Val","y2":13.034,"z2":-12.999,"x2":-20.49,"h":false,"x1":-18.559},{"s":true,"z1":-10.33,"a":false,"y1":13.847,"n":"Leu","y2":14.907,"z2":-8.817,"x2":-19.089,"h":false,"x1":-20.625},{"s":true,"z1":-9.599,"a":false,"y1":17.467,"n":"Val","y2":18.093,"z2":-8.672,"x2":-21.757,"h":false,"x1":-19.642},{"s":true,"z1":-6.042,"a":false,"y1":18.192,"n":"Leu","y2":20.149,"z2":-5.41,"x2":-22.058,"h":false,"x1":-20.859},{"s":true,"z1":-5.641,"a":true,"y1":21.857,"n":"Asp","y2":21.807,"z2":-6.148,"x2":-17.528,"h":false,"x1":-19.889},{"s":true,"z1":-6.819,"a":false,"y1":24.497,"n":"Thr","y2":26.412,"z2":-7.098,"x2":-18.855,"h":false,"x1":-17.42},{"s":false,"z1":-6.551,"a":false,"y1":28.196,"n":"Asp","y2":29.891,"z2":-7.873,"x2":-15.742,"h":false,"x1":-16.836},{"s":false,"z1":-9.751,"a":false,"y1":28.009,"n":"Tyr","y2":28.299,"z2":-10.207,"x2":-12.335,"h":false,"x1":-14.683},{"s":false,"z1":-8.18,"a":false,"y1":30.185,"n":"Lys","y2":29.768,"z2":-7.291,"x2":-9.817,"h":false,"x1":-12.004},{"s":false,"z1":-5.586,"a":false,"y1":27.867,"n":"Lys","y2":25.627,"z2":-5.478,"x2":-9.741,"h":false,"x1":-10.518},{"s":true,"z1":-4.942,"a":false,"y1":24.49,"n":"Tyr","y2":24.586,"z2":-6.393,"x2":-14.063,"h":false,"x1":-12.16},{"s":true,"z1":-6.736,"a":false,"y1":21.81,"n":"Leu","y2":19.881,"z2":-5.722,"x2":-13.201,"h":false,"x1":-14.145},{"s":true,"z1":-5.209,"a":false,"y1":18.679,"n":"Leu","y2":18.153,"z2":-6.804,"x2":-17.325,"h":false,"x1":-15.629},{"s":true,"z1":-7.25,"a":false,"y1":15.609,"n":"Phe","y2":13.867,"z2":-5.952,"x2":-15.408,"h":false,"x1":-16.435},{"s":true,"z1":-7.07,"a":false,"y1":11.871,"n":"Cys","y2":11.646,"z2":-9.34,"x2":-17.696,"h":false,"x1":-16.988},{"s":true,"z1":-9.564,"a":true,"y1":9.038,"n":"Met","y2":7.555,"z2":-7.749,"x2":-17.231,"h":false,"x1":-16.739},{"s":true,"z1":-9.266,"a":false,"y1":5.856,"n":"Glu","y2":5.454,"z2":-11.576,"x2":-19.122,"h":false,"x1":-18.722},{"s":false,"z1":-11.087,"a":false,"y1":2.843,"n":"Asn","y2":2.037,"z2":-9.545,"x2":-21.734,"h":false,"x1":-20.074},{"s":false,"z1":-11.089,"a":false,"y1":3.167,"n":"Ser","y2":1.671,"z2":-9.881,"x2":-25.281,"h":false,"x1":-23.838},{"s":false,"z1":-10.972,"a":false,"y1":-0.63,"n":"Ala","y2":-1.865,"z2":-8.982,"x2":-24.719,"h":false,"x1":-24.16},{"s":false,"z1":-7.504,"a":false,"y1":-0.805,"n":"Glu","y2":0.217,"z2":-6.782,"x2":-20.576,"h":false,"x1":-22.613},{"s":false,"z1":-5.845,"a":false,"y1":2.589,"n":"Pro","y2":2.931,"z2":-4.3,"x2":-19.98,"h":true,"x1":-21.801},{"s":false,"z1":-2.549,"a":true,"y1":0.915,"n":"Glu","y2":0.57,"z2":-1.736,"x2":-18.564,"h":true,"x1":-20.811},{"s":false,"z1":-4.076,"a":false,"y1":-0.651,"n":"Gln","y2":-0.089,"z2":-5.662,"x2":-15.984,"h":true,"x1":-17.705},{"s":false,"z1":-6.482,"a":false,"y1":2.255,"n":"Ser","y2":4.354,"z2":-6.85,"x2":-16.165,"h":false,"x1":-17.204},{"s":false,"z1":-4.794,"a":false,"y1":5.593,"n":"Leu","y2":5.617,"z2":-3.272,"x2":-15.692,"h":false,"x1":-17.57},{"s":true,"z1":-4.611,"a":false,"y1":7.749,"n":"Val","y2":9.618,"z2":-6.054,"x2":-14.928,"h":false,"x1":-14.434},{"s":true,"z1":-4.079,"a":false,"y1":11.512,"n":"Cys","y2":11.731,"z2":-3.086,"x2":-12.411,"h":false,"x1":-14.542},{"s":true,"z1":-4.19,"a":false,"y1":14.237,"n":"Gln","y2":16.188,"z2":-4.405,"x2":-13.309,"h":false,"x1":-11.931},{"s":true,"z1":-3.056,"a":false,"y1":17.783,"n":"Cys","y2":18.01,"z2":-3.603,"x2":-9.143,"h":false,"x1":-11.46},{"s":true,"z1":-5.66,"a":true,"y1":19.823,"n":"Leu","y2":21.971,"z2":-5.033,"x2":-10.445,"h":false,"x1":-9.619},{"s":true,"z1":-5.158,"a":false,"y1":23.19,"n":"Val","y2":22.986,"z2":-7.003,"x2":-6.345,"h":false,"x1":-7.897},{"s":false,"z1":-7.742,"a":false,"y1":25.655,"n":"Arg","y2":25.636,"z2":-8.5,"x2":-4.273,"h":false,"x1":-6.552},{"s":false,"z1":-6.083,"a":false,"y1":26.457,"n":"Thr","y2":24.851,"z2":-4.337,"x2":-3.566,"h":false,"x1":-3.23},{"s":false,"z1":-4.212,"a":false,"y1":24.019,"n":"Pro","y2":24.441,"z2":-2.166,"x2":0.271,"h":false,"x1":-0.904},{"s":false,"z1":-0.751,"a":false,"y1":25.226,"n":"Glu","y2":24.083,"z2":-0.894,"x2":-4.058,"h":false,"x1":-1.99},{"s":false,"z1":1.747,"a":false,"y1":23.638,"n":"Val","y2":25.653,"z2":2.83,"x2":-4.935,"h":false,"x1":-4.292},{"s":false,"z1":1.892,"a":false,"y1":25.467,"n":"Asp","y2":23.824,"z2":2.602,"x2":-9.203,"h":false,"x1":-7.6},{"s":false,"z1":5.207,"a":false,"y1":24.679,"n":"Asp","y2":24.008,"z2":5.413,"x2":-11.677,"h":true,"x1":-9.368},{"s":false,"z1":3.791,"a":false,"y1":26.003,"n":"Glu","y2":24.261,"z2":3.056,"x2":-14.105,"h":true,"x1":-12.66},{"s":false,"z1":0.837,"a":false,"y1":23.605,"n":"Ala","y2":21.433,"z2":1.195,"x2":-13.515,"h":true,"x1":-12.53},{"s":false,"z1":3.204,"a":false,"y1":20.701,"n":"Leu","y2":19.528,"z2":4.122,"x2":-13.667,"h":true,"x1":-11.772},{"s":false,"z1":5.471,"a":false,"y1":21.727,"n":"Glu","y2":20.573,"z2":5.029,"x2":-16.717,"h":true,"x1":-14.646},{"s":false,"z1":2.513,"a":false,"y1":21.722,"n":"Lys","y2":19.634,"z2":1.872,"x2":-18.067,"h":true,"x1":-17.094},{"s":false,"z1":1.554,"a":false,"y1":18.334,"n":"Phe","y2":16.521,"z2":2.389,"x2":-16.974,"h":true,"x1":-15.62},{"s":false,"z1":4.981,"a":false,"y1":16.829,"n":"Asp","y2":15.801,"z2":5.408,"x2":-18.367,"h":true,"x1":-16.233},{"s":false,"z1":4.98,"a":false,"y1":18.059,"n":"Lys","y2":16.533,"z2":4.194,"x2":-21.5,"h":true,"x1":-19.83},{"s":false,"z1":1.553,"a":true,"y1":16.658,"n":"Ala","y2":14.401,"z2":1.189,"x2":-21.296,"h":true,"x1":-20.625},{"s":false,"z1":2.65,"a":false,"y1":13.334,"n":"Leu","y2":11.572,"z2":4.118,"x2":-19.804,"h":true,"x1":-19.205},{"s":false,"z1":6.033,"a":false,"y1":13.224,"n":"Lys","y2":11.401,"z2":6.794,"x2":-22.242,"h":false,"x1":-20.945},{"s":false,"z1":4.511,"a":false,"y1":11.264,"n":"Ala","y2":9.015,"z2":3.69,"x2":-24.204,"h":false,"x1":-23.813},{"s":false,"z1":2.333,"a":false,"y1":8.918,"n":"Leu","y2":8.133,"z2":4.253,"x2":-20.544,"h":false,"x1":-21.751},{"s":false,"z1":3.318,"a":false,"y1":5.445,"n":"Pro","y2":4.28,"z2":2.548,"x2":-18.296,"h":false,"x1":-20.27},{"s":false,"z1":3.247,"a":false,"y1":6.342,"n":"Met","y2":5.742,"z2":5.52,"x2":-16.111,"h":false,"x1":-16.498},{"s":false,"z1":4.967,"a":false,"y1":3.966,"n":"His","y2":3.75,"z2":5.698,"x2":-11.842,"h":false,"x1":-14.074},{"s":true,"z1":3.988,"a":false,"y1":5.663,"n":"Ile","y2":7.474,"z2":2.571,"x2":-11.604,"h":false,"x1":-10.88},{"s":true,"z1":3.825,"a":false,"y1":9.331,"n":"Arg","y2":9.299,"z2":4.832,"x2":-7.739,"h":false,"x1":-9.931},{"s":true,"z1":2.946,"a":true,"y1":11.034,"n":"Leu","y2":13.018,"z2":1.98,"x2":-7.559,"h":false,"x1":-6.637},{"s":true,"z1":2.904,"a":false,"y1":14.667,"n":"Ser","y2":14.328,"z2":3.529,"x2":-3.217,"h":false,"x1":-5.524},{"s":false,"z1":1.522,"a":false,"y1":15.925,"n":"Phe","y2":18.159,"z2":2.279,"x2":-2.53,"h":false,"x1":-2.205},{"s":false,"z1":2.574,"a":false,"y1":18.669,"n":"Asn","y2":18.656,"z2":0.287,"x2":0.804,"h":false,"x1":0.188},{"s":false,"z1":0.22,"a":false,"y1":21.322,"n":"Pro","y2":20.782,"z2":-1.668,"x2":3.04,"h":true,"x1":1.654},{"s":false,"z1":-0.114,"a":false,"y1":19.318,"n":"Thr","y2":18.119,"z2":-2.148,"x2":4.997,"h":true,"x1":4.855},{"s":false,"z1":-1.524,"a":true,"y1":16.363,"n":"Gln","y2":16.37,"z2":-3.803,"x2":2.152,"h":true,"x1":2.945},{"s":false,"z1":-3.528,"a":false,"y1":18.667,"n":"Leu","y2":19.07,"z2":-5.903,"x2":0.956,"h":true,"x1":0.629},{"s":false,"z1":-5.679,"a":false,"y1":19.873,"n":"Glu","y2":19.184,"z2":-7.263,"x2":5.228,"h":false,"x1":3.558},{"s":false,"z1":-6.551,"a":false,"y1":16.509,"n":"Glu","y2":15.35,"z2":-7.1,"x2":3.115,"h":false,"x1":5.15},{"s":false,"z1":-9.4,"a":false,"y1":14.152,"n":"Gln","y2":12.289,"z2":-7.937,"x2":4.491,"h":false,"x1":4.151},{"s":false,"z1":-7.943,"a":false,"y1":11.497,"n":"Cys","y2":10.63,"z2":-5.715,"x2":1.813,"h":false,"x1":1.831},{"s":false,"z1":-6.419,"a":false,"y1":11.67,"y2":10.63,"z2":-5.715,"x2":1.813,"h":false,"x1":1.875},{"s":false,"z1":-6.419,"a":false,"y1":11.67,"y2":10.63,"z2":-5.715,"x2":1.813,"h":false,"x1":1.875},{"s":false,"z1":-6.419,"a":false,"y1":11.67,"y2":10.63,"z2":-5.715,"x2":1.813,"h":false,"x1":1.875},{"s":false,"z1":-6.419,"a":false,"y1":11.67,"y2":10.63,"z2":-5.715,"x2":1.813,"h":false,"x1":1.875}],[{"s":false,"z1":24.715,"a":false,"y1":15.059,"y2":15.059,"z2":24.715,"x2":-6.555,"h":false,"x1":-6.555},{"s":false,"z1":24.715,"a":false,"y1":15.059,"y2":15.059,"z2":24.715,"x2":-6.555,"h":false,"x1":-6.555},{"s":false,"z1":26.029,"a":false,"y1":14.688,"n":"Gln","y2":12.416,"z2":25.634,"x2":-6.545,"h":false,"x1":-7.166},{"s":false,"z1":28.256,"a":false,"y1":11.879,"n":"Thr","y2":12.524,"z2":30.022,"x2":-7.526,"h":false,"x1":-6.03},{"s":false,"z1":30.445,"a":false,"y1":9.986,"n":"Met","y2":9.374,"z2":32.428,"x2":-7.33,"h":false,"x1":-8.532},{"s":false,"z1":34.013,"a":false,"y1":11.195,"n":"Lys","y2":9.691,"z2":34.41,"x2":-10.559,"h":false,"x1":-8.736},{"s":false,"z1":36.427,"a":false,"y1":8.356,"n":"Gly","y2":6.24,"z2":36.042,"x2":-10.314,"h":false,"x1":-9.313},{"s":false,"z1":34.093,"a":false,"y1":5.453,"n":"Leu","y2":4.429,"z2":35.854,"x2":-7.24,"h":false,"x1":-8.556},{"s":false,"z1":35.919,"a":false,"y1":2.104,"n":"Asp","y2":0.4,"z2":34.334,"x2":-9.143,"h":false,"x1":-8.727},{"s":false,"z1":33.796,"a":false,"y1":-0.004,"n":"Ile","y2":-2.226,"z2":33.033,"x2":-6.871,"h":true,"x1":-6.473},{"s":false,"z1":35.399,"a":false,"y1":-3.272,"n":"Gln","y2":-4.706,"z2":34.16,"x2":-9.11,"h":true,"x1":-7.634},{"s":false,"z1":33.724,"a":true,"y1":-2.841,"n":"Lys","y2":-3.06,"z2":31.567,"x2":-12.038,"h":true,"x1":-11.018},{"s":false,"z1":30.134,"a":false,"y1":-2.801,"n":"Val","y2":-4.349,"z2":28.416,"x2":-9.022,"h":true,"x1":-9.715},{"s":false,"z1":30.225,"a":false,"y1":-6.413,"n":"Ala","y2":-7.143,"z2":29.423,"x2":-10.644,"h":false,"x1":-8.526},{"s":false,"z1":27.46,"a":false,"y1":-8.703,"n":"Gly","y2":-7.822,"z2":25.598,"x2":-8.393,"h":false,"x1":-9.62},{"s":false,"z1":23.746,"a":false,"y1":-9.101,"n":"Thr","y2":-7.354,"z2":23.772,"x2":-11.75,"h":false,"x1":-10.119},{"s":false,"z1":21.644,"a":false,"y1":-5.977,"n":"Trp","y2":-7.03,"z2":19.651,"x2":-9.648,"h":false,"x1":-10.506},{"s":true,"z1":17.901,"a":false,"y1":-5.312,"n":"Tyr","y2":-2.94,"z2":17.919,"x2":-11.267,"h":false,"x1":-10.928},{"s":true,"z1":15.943,"a":false,"y1":-2.411,"n":"Ser","y2":-2.696,"z2":13.836,"x2":-10.492,"h":false,"x1":-9.414},{"s":true,"z1":14.384,"a":false,"y1":-0.747,"n":"Leu","y2":0.479,"z2":12.325,"x2":-12.52,"h":false,"x1":-12.479},{"s":true,"z1":13.15,"a":false,"y1":2.399,"n":"Ala","y2":2.647,"z2":14.737,"x2":-8.962,"h":false,"x1":-10.739},{"s":true,"z1":13.006,"a":false,"y1":4.037,"n":"Met","y2":5.481,"z2":11.106,"x2":-7.693,"h":false,"x1":-7.306},{"s":true,"z1":11.981,"a":true,"y1":7.427,"n":"Ala","y2":7.381,"z2":13.418,"x2":-3.993,"h":false,"x1":-5.9},{"s":true,"z1":11.688,"a":false,"y1":8.866,"n":"Ala","y2":10.732,"z2":10.223,"x2":-2.807,"h":false,"x1":-2.397},{"s":false,"z1":11.382,"a":false,"y1":12.265,"n":"Ser","y2":13.129,"z2":9.238,"x2":-0.334,"h":false,"x1":-0.847},{"s":false,"z1":8.497,"a":false,"y1":11.119,"n":"Asp","y2":8.801,"z2":8.197,"x2":0.888,"h":false,"x1":1.338},{"s":false,"z1":5.61,"a":false,"y1":9.137,"n":"Ile","y2":6.754,"z2":5.808,"x2":0.195,"h":true,"x1":-0.141},{"s":false,"z1":5.33,"a":true,"y1":6.874,"n":"Ser","y2":4.694,"z2":6.379,"x2":3.015,"h":true,"x1":2.889},{"s":false,"z1":8.847,"a":false,"y1":5.56,"n":"Leu","y2":3.311,"z2":9.192,"x2":1.407,"h":true,"x1":2.192},{"s":false,"z1":7.706,"a":false,"y1":3.627,"n":"Leu","y2":2.229,"z2":6.056,"x2":-1.918,"h":false,"x1":-0.925},{"s":false,"z1":3.919,"a":false,"y1":3.676,"n":"Asp","y2":2.053,"z2":3.84,"x2":0.747,"h":false,"x1":-1.033},{"s":false,"z1":2.704,"a":false,"y1":0.034,"n":"Ala","y2":-0.399,"z2":5.053,"x2":-0.49,"h":false,"x1":-0.843},{"s":false,"z1":4.834,"a":false,"y1":-3.139,"n":"Gln","y2":-3.628,"z2":6.676,"x2":0.534,"h":false,"x1":-0.92},{"s":false,"z1":5.228,"a":false,"y1":-3.224,"n":"Ser","y2":-2.131,"z2":6.83,"x2":4.225,"h":false,"x1":2.841},{"s":false,"z1":6.859,"a":false,"y1":0.224,"n":"Ala","y2":-1.135,"z2":8.858,"x2":2.686,"h":false,"x1":2.76},{"s":false,"z1":10.232,"a":false,"y1":0.36,"n":"Pro","y2":-0.23,"z2":12.455,"x2":3.944,"h":false,"x1":4.692},{"s":false,"z1":12.409,"a":false,"y1":1.522,"n":"Leu","y2":1.205,"z2":12.71,"x2":-0.613,"h":false,"x1":1.769},{"s":false,"z1":10.619,"a":false,"y1":-0.575,"n":"Arg","y2":-2.974,"z2":10.91,"x2":-0.544,"h":false,"x1":-0.795},{"s":true,"z1":13.606,"a":false,"y1":-2.884,"n":"Val","y2":-2.091,"z2":14.339,"x2":-3.429,"h":false,"x1":-1.288},{"s":true,"z1":14.985,"a":false,"y1":-4.668,"n":"Tyr","y2":-6.307,"z2":16.619,"x2":-3.763,"h":false,"x1":-4.378},{"s":true,"z1":18.682,"a":false,"y1":-4.975,"n":"Val","y2":-6.248,"z2":18.411,"x2":-7.015,"h":false,"x1":-5.016},{"s":true,"z1":19.729,"a":false,"y1":-8.482,"n":"Glu","y2":-8.987,"z2":21.46,"x2":-7.429,"h":false,"x1":-5.874},{"s":true,"z1":23.492,"a":false,"y1":-8.266,"n":"Glu","y2":-6.862,"z2":23.913,"x2":-3.863,"h":false,"x1":-5.757},{"s":true,"z1":26.388,"a":false,"y1":-5.957,"n":"Leu","y2":-7.154,"z2":28.158,"x2":-5.963,"h":false,"x1":-4.938},{"s":true,"z1":29.525,"a":true,"y1":-7.679,"n":"Lys","y2":-6.806,"z2":30.557,"x2":-1.657,"h":false,"x1":-3.638},{"s":true,"z1":32.451,"a":false,"y1":-5.355,"n":"Pro","y2":-7.378,"z2":33.7,"x2":-2.832,"h":false,"x1":-2.87},{"s":false,"z1":35.062,"a":false,"y1":-6.749,"n":"Thr","y2":-5.174,"z2":36.487,"x2":-1.528,"h":false,"x1":-0.497},{"s":false,"z1":38.745,"a":false,"y1":-6.616,"n":"Pro","y2":-4.531,"z2":39.928,"x2":-1.35,"h":false,"x1":-1.455},{"s":false,"z1":39.111,"a":false,"y1":-3.938,"n":"Glu","y2":-1.625,"z2":38.448,"x2":1.486,"h":false,"x1":1.272},{"s":false,"z1":36.667,"a":false,"y1":-1.633,"n":"Gly","y2":-0.295,"z2":34.795,"x2":0.087,"h":false,"x1":-0.561},{"s":false,"z1":33.607,"a":false,"y1":-2.295,"n":"Asp","y2":-3.443,"z2":32.95,"x2":-0.444,"h":false,"x1":1.541},{"s":true,"z1":30.311,"a":false,"y1":-3.244,"n":"Leu","y2":-3.474,"z2":28.551,"x2":1.597,"h":false,"x1":0},{"s":true,"z1":27.982,"a":false,"y1":-6.067,"n":"Glu","y2":-6.137,"z2":27.008,"x2":-1.379,"h":false,"x1":0.829},{"s":true,"z1":24.556,"a":false,"y1":-5.418,"n":"Ile","y2":-6.424,"z2":22.998,"x2":0.888,"h":false,"x1":-0.628},{"s":true,"z1":21.968,"a":false,"y1":-8.147,"n":"Leu","y2":-7.265,"z2":20.652,"x2":-2.733,"h":false,"x1":-0.952},{"s":true,"z1":18.315,"a":false,"y1":-7.272,"n":"Leu","y2":-8.893,"z2":17.295,"x2":0.047,"h":false,"x1":-1.35},{"s":true,"z1":14.692,"a":false,"y1":-8.467,"n":"Gln","y2":-6.28,"z2":13.722,"x2":-1.088,"h":false,"x1":-1.131},{"s":true,"z1":12.076,"a":true,"y1":-6.855,"n":"Lys","y2":-8.821,"z2":10.895,"x2":1.787,"h":false,"x1":1.087},{"s":true,"z1":8.433,"a":false,"y1":-7.779,"n":"Trp","y2":-6.445,"z2":8.064,"x2":3.466,"h":false,"x1":1.502},{"s":false,"z1":7.992,"a":false,"y1":-8.494,"n":"Glu","y2":-8.233,"z2":6.032,"x2":6.577,"h":false,"x1":5.193},{"s":false,"z1":5.573,"a":false,"y1":-10.905,"n":"Asn","y2":-13.146,"z2":5.17,"x2":5.974,"h":false,"x1":6.772},{"s":false,"z1":3.494,"a":false,"y1":-12.316,"n":"Gly","y2":-13.731,"z2":4.064,"x2":2.025,"h":false,"x1":3.905},{"s":false,"z1":6.748,"a":false,"y1":-13.259,"n":"Glu","y2":-11.205,"z2":7.976,"x2":2.372,"h":false,"x1":2.203},{"s":true,"z1":9.647,"a":false,"y1":-11.883,"n":"Cys","y2":-13.298,"z2":11.565,"x2":0.511,"h":false,"x1":0.217},{"s":true,"z1":12.603,"a":false,"y1":-11.712,"n":"Ala","y2":-10.41,"z2":13.859,"x2":1.029,"h":false,"x1":2.649},{"s":true,"z1":16.289,"a":false,"y1":-11.478,"n":"Gln","y2":-11.401,"z2":17.12,"x2":4.076,"h":false,"x1":1.835},{"s":true,"z1":18.505,"a":false,"y1":-8.978,"n":"Lys","y2":-8.414,"z2":19.947,"x2":1.842,"h":false,"x1":3.637},{"s":true,"z1":22.234,"a":false,"y1":-8.426,"n":"Lys","y2":-7.16,"z2":22.422,"x2":5.571,"h":false,"x1":3.527},{"s":true,"z1":23.654,"a":false,"y1":-5.004,"n":"Ile","y2":-5.023,"z2":25.5,"x2":2.973,"h":false,"x1":4.439},{"s":true,"z1":27.349,"a":true,"y1":-4.259,"n":"Ile","y2":-2.048,"z2":27.232,"x2":5.872,"h":false,"x1":4.921},{"s":true,"z1":28.215,"a":false,"y1":-0.791,"n":"Ala","y2":-1.101,"z2":30.505,"x2":3.177,"h":false,"x1":3.736},{"s":false,"z1":31.455,"a":false,"y1":0.63,"n":"Glu","y2":2.824,"z2":31.292,"x2":4.221,"h":false,"x1":5.153},{"s":false,"z1":33.732,"a":false,"y1":2.732,"n":"Lys","y2":3.813,"z2":34.202,"x2":5.111,"h":false,"x1":3.021},{"s":false,"z1":34.584,"a":false,"y1":6.314,"n":"Thr","y2":6.036,"z2":36.194,"x2":2.176,"h":false,"x1":3.889},{"s":false,"z1":37.366,"a":false,"y1":8.533,"n":"Lys","y2":9.253,"z2":37.716,"x2":0.262,"h":false,"x1":2.516},{"s":false,"z1":34.989,"a":false,"y1":9.403,"n":"Ile","y2":7.425,"z2":33.668,"x2":-0.226,"h":false,"x1":-0.278},{"s":false,"z1":34.727,"a":false,"y1":6.346,"n":"Pro","y2":4.959,"z2":32.817,"x2":-2.986,"h":false,"x1":-2.614},{"s":false,"z1":31.106,"a":false,"y1":7.003,"n":"Ala","y2":7.14,"z2":28.909,"x2":-2.636,"h":false,"x1":-3.634},{"s":true,"z1":29.894,"a":false,"y1":7.416,"n":"Val","y2":5.999,"z2":31.428,"x2":1.095,"h":false,"x1":-0.023},{"s":true,"z1":29.471,"a":true,"y1":4.503,"n":"Phe","y2":5.369,"z2":27.578,"x2":3.54,"h":false,"x1":2.365},{"s":true,"z1":28.199,"a":false,"y1":4.178,"n":"Lys","y2":1.791,"z2":28.032,"x2":5.941,"h":false,"x1":5.949},{"s":false,"z1":25.374,"a":false,"y1":1.85,"n":"Ile","y2":3.262,"z2":24.328,"x2":8.519,"h":false,"x1":6.872},{"s":false,"z1":23.206,"a":false,"y1":1.108,"n":"Asp","y2":-1.019,"z2":22.089,"x2":10.037,"h":false,"x1":9.869},{"s":false,"z1":20.111,"a":false,"y1":-0.394,"n":"Ala","y2":1.453,"z2":19.28,"x2":7.04,"h":false,"x1":8.257},{"s":false,"z1":16.595,"a":false,"y1":0.63,"n":"Leu","y2":2.892,"z2":15.846,"x2":7.031,"h":false,"x1":7.282},{"s":false,"z1":16.846,"a":false,"y1":3.707,"n":"Asn","y2":5.864,"z2":17.471,"x2":8.749,"h":false,"x1":9.513},{"s":false,"z1":19.405,"a":false,"y1":4.88,"n":"Glu","y2":3.755,"z2":21.154,"x2":8.196,"h":false,"x1":6.975},{"s":false,"z1":23.028,"a":false,"y1":5.656,"n":"Asn","y2":5.957,"z2":25.284,"x2":6.881,"h":false,"x1":7.721},{"s":true,"z1":24.473,"a":false,"y1":6.615,"n":"Lys","y2":5.934,"z2":22.758,"x2":2.797,"h":false,"x1":4.327},{"s":true,"z1":24.621,"a":false,"y1":5.237,"n":"Val","y2":6.332,"z2":26.656,"x2":0.132,"h":false,"x1":0.791},{"s":true,"z1":25.594,"a":false,"y1":7.55,"n":"Leu","y2":6.585,"z2":24.428,"x2":-3.906,"h":false,"x1":-2.064},{"s":true,"z1":26.622,"a":false,"y1":6.279,"n":"Val","y2":8.31,"z2":27.605,"x2":-6.284,"h":false,"x1":-5.449},{"s":true,"z1":25.526,"a":false,"y1":8.909,"n":"Leu","y2":9.716,"z2":26.908,"x2":-9.774,"h":false,"x1":-7.967},{"s":true,"z1":26.736,"a":true,"y1":7.414,"n":"Asp","y2":5.185,"z2":25.812,"x2":-11.192,"h":false,"x1":-11.266},{"s":true,"z1":27.523,"a":false,"y1":4.222,"n":"Thr","y2":4.824,"z2":29.463,"x2":-14.419,"h":false,"x1":-13.166},{"s":false,"z1":28.917,"a":false,"y1":2.997,"n":"Asp","y2":1.079,"z2":30.152,"x2":-17.095,"h":false,"x1":-16.443},{"s":false,"z1":29.548,"a":false,"y1":-0.278,"n":"Tyr","y2":-2.4,"z2":28.499,"x2":-14.955,"h":false,"x1":-14.673},{"s":false,"z1":28.349,"a":false,"y1":-2.129,"n":"Lys","y2":-3.429,"z2":26.362,"x2":-17.978,"h":false,"x1":-17.763},{"s":false,"z1":24.68,"a":false,"y1":-1.266,"n":"Lys","y2":-1.58,"z2":23.021,"x2":-16.056,"h":false,"x1":-17.73},{"s":true,"z1":23.296,"a":false,"y1":0.845,"n":"Tyr","y2":1.717,"z2":25.334,"x2":-14.007,"h":false,"x1":-14.912},{"s":true,"z1":24.105,"a":false,"y1":2.307,"n":"Leu","y2":2.541,"z2":21.886,"x2":-10.686,"h":false,"x1":-11.517},{"s":true,"z1":22.252,"a":false,"y1":5.096,"n":"Leu","y2":5.759,"z2":23.92,"x2":-8.055,"h":false,"x1":-9.656},{"s":true,"z1":22.321,"a":false,"y1":5.377,"n":"Phe","y2":5.575,"z2":20.019,"x2":-5.345,"h":false,"x1":-5.877},{"s":true,"z1":20.531,"a":false,"y1":6.823,"n":"Cys","y2":6.217,"z2":22.141,"x2":-1.288,"h":false,"x1":-2.939},{"s":true,"z1":20.19,"a":true,"y1":6.012,"n":"Met","y2":7.769,"z2":18.619,"x2":0.889,"h":false,"x1":0.686},{"s":true,"z1":19.469,"a":false,"y1":8.534,"n":"Glu","y2":7.788,"z2":20.892,"x2":5.096,"h":false,"x1":3.338},{"s":false,"z1":19.646,"a":false,"y1":9.33,"n":"Asn","y2":11.682,"z2":19.355,"x2":7.093,"h":false,"x1":7.002},{"s":false,"z1":22.124,"a":false,"y1":12.203,"n":"Ser","y2":14.41,"z2":21.587,"x2":8.055,"h":false,"x1":7.33},{"s":false,"z1":20.098,"a":false,"y1":13.528,"n":"Ala","y2":15.331,"z2":18.507,"x2":10.328,"h":false,"x1":10.341},{"s":false,"z1":16.97,"a":false,"y1":14.172,"n":"Glu","y2":12.758,"z2":15.91,"x2":6.646,"h":false,"x1":8.285},{"s":false,"z1":17.468,"a":false,"y1":13.738,"n":"Pro","y2":12.852,"z2":15.595,"x2":3.327,"h":true,"x1":4.512},{"s":false,"z1":14.035,"a":true,"y1":15.127,"n":"Glu","y2":13.697,"z2":12.23,"x2":3.111,"h":true,"x1":3.719},{"s":false,"z1":12.104,"a":false,"y1":12.368,"n":"Gln","y2":10.029,"z2":12.341,"x2":5.908,"h":true,"x1":5.4},{"s":false,"z1":14.545,"a":false,"y1":9.712,"n":"Ser","y2":8.203,"z2":15.643,"x2":2.872,"h":false,"x1":4.425},{"s":false,"z1":15.927,"a":false,"y1":10.08,"n":"Leu","y2":9.32,"z2":14.081,"x2":-0.42,"h":false,"x1":0.906},{"s":true,"z1":15.447,"a":false,"y1":7.036,"n":"Val","y2":6.444,"z2":17.658,"x2":-1.984,"h":false,"x1":-1.311},{"s":true,"z1":17.121,"a":false,"y1":6.531,"n":"Cys","y2":5.307,"z2":15.395,"x2":-5.808,"h":false,"x1":-4.686},{"s":true,"z1":17.187,"a":false,"y1":3.704,"n":"Gln","y2":4.228,"z2":19.141,"x2":-8.522,"h":false,"x1":-7.191},{"s":true,"z1":18.109,"a":false,"y1":2.955,"n":"Cys","y2":0.744,"z2":17.27,"x2":-11.001,"h":false,"x1":-10.796},{"s":true,"z1":19.74,"a":true,"y1":-0.422,"n":"Leu","y2":0.142,"z2":20.962,"x2":-13.087,"h":false,"x1":-11.119},{"s":true,"z1":20.458,"a":false,"y1":-2.267,"n":"Val","y2":-4.464,"z2":20.594,"x2":-13.306,"h":false,"x1":-14.301},{"s":false,"z1":22.642,"a":false,"y1":-5.312,"n":"Arg","y2":-7.598,"z2":21.837,"x2":-15.069,"h":false,"x1":-14.983},{"s":false,"z1":20.136,"a":false,"y1":-7.203,"n":"Thr","y2":-5.584,"z2":18.402,"x2":-16.948,"h":false,"x1":-17.203},{"s":false,"z1":16.356,"a":false,"y1":-7.418,"n":"Pro","y2":-7.433,"z2":14.586,"x2":-18.283,"h":false,"x1":-16.667},{"s":false,"z1":15.418,"a":false,"y1":-5.129,"n":"Glu","y2":-3.136,"z2":15.962,"x2":-18.318,"h":false,"x1":-19.544},{"s":false,"z1":14.026,"a":false,"y1":-1.599,"n":"Val","y2":-1.046,"z2":14.978,"x2":-21.591,"h":false,"x1":-19.423},{"s":false,"z1":16.836,"a":false,"y1":0.785,"n":"Asp","y2":2.844,"z2":16.617,"x2":-19.168,"h":false,"x1":-20.424},{"s":false,"z1":15.57,"a":false,"y1":4.322,"n":"Asp","y2":6.395,"z2":16.478,"x2":-20.457,"h":true,"x1":-21.23},{"s":false,"z1":19.074,"a":false,"y1":5.793,"n":"Glu","y2":6.921,"z2":19.439,"x2":-19.026,"h":true,"x1":-21.091},{"s":false,"z1":19.391,"a":false,"y1":4.57,"n":"Ala","y2":6.209,"z2":18.543,"x2":-15.979,"h":true,"x1":-17.529},{"s":false,"z1":15.934,"a":false,"y1":5.992,"n":"Leu","y2":8.322,"z2":15.73,"x2":-16.341,"h":true,"x1":-16.836},{"s":false,"z1":17.012,"a":false,"y1":9.127,"n":"Glu","y2":10.77,"z2":17.55,"x2":-16.97,"h":true,"x1":-18.627},{"s":false,"z1":20.038,"a":false,"y1":9.557,"n":"Lys","y2":10.687,"z2":19.761,"x2":-14.235,"h":true,"x1":-16.357},{"s":false,"z1":17.978,"a":false,"y1":8.771,"n":"Phe","y2":10.683,"z2":17.211,"x2":-12.057,"h":true,"x1":-13.276},{"s":false,"z1":15.484,"a":false,"y1":11.534,"n":"Asp","y2":13.723,"z2":15.879,"x2":-13.059,"h":true,"x1":-13.947},{"s":false,"z1":18.219,"a":false,"y1":14.104,"n":"Lys","y2":15.337,"z2":18.861,"x2":-12.491,"h":true,"x1":-14.459},{"s":false,"z1":19.896,"a":false,"y1":13.096,"n":"Ala","y2":14.362,"z2":19.176,"x2":-9.317,"h":true,"x1":-11.226},{"s":false,"z1":16.561,"a":true,"y1":13.566,"n":"Leu","y2":15.108,"z2":14.753,"x2":-9.333,"h":true,"x1":-9.511},{"s":false,"z1":15.671,"a":false,"y1":16.868,"n":"Lys","y2":18.746,"z2":14.902,"x2":-9.799,"h":true,"x1":-11.076},{"s":false,"z1":17.125,"a":false,"y1":18.868,"n":"Ala","y2":18.929,"z2":17.366,"x2":-5.736,"h":false,"x1":-8.138},{"s":false,"z1":15.925,"a":false,"y1":16.567,"n":"Leu","y2":16.611,"z2":13.655,"x2":-6.142,"h":false,"x1":-5.344},{"s":false,"z1":12.518,"a":false,"y1":16.747,"n":"Pro","y2":15,"z2":11.215,"x2":-2.502,"h":false,"x1":-3.571},{"s":false,"z1":11.028,"a":false,"y1":13.407,"n":"Met","y2":14.293,"z2":9.039,"x2":-5.688,"h":false,"x1":-4.747},{"s":false,"z1":7.35,"a":false,"y1":12.952,"n":"His","y2":11.616,"z2":5.454,"x2":-4.604,"h":false,"x1":-3.992},{"s":true,"z1":6.967,"a":false,"y1":9.411,"n":"Ile","y2":8.69,"z2":9.189,"x2":-5.833,"h":false,"x1":-5.311},{"s":true,"z1":8.455,"a":false,"y1":7.635,"n":"Arg","y2":6.418,"z2":6.588,"x2":-9.191,"h":false,"x1":-8.347},{"s":true,"z1":8.004,"a":true,"y1":4.032,"n":"Leu","y2":3.601,"z2":10.182,"x2":-10.329,"h":false,"x1":-9.538},{"s":true,"z1":9.381,"a":false,"y1":2.348,"n":"Ser","y2":0.989,"z2":7.521,"x2":-13.204,"h":false,"x1":-12.645},{"s":false,"z1":9.056,"a":false,"y1":-1.372,"n":"Phe","y2":-1.249,"z2":9.672,"x2":-15.585,"h":false,"x1":-13.283},{"s":false,"z1":8.298,"a":false,"y1":-3.693,"n":"Asn","y2":-5.308,"z2":9.572,"x2":-14.962,"h":false,"x1":-16.165},{"s":false,"z1":10.649,"a":false,"y1":-6.499,"n":"Pro","y2":-8.346,"z2":10.734,"x2":-15.684,"h":true,"x1":-17.238},{"s":false,"z1":7.907,"a":false,"y1":-8.739,"n":"Thr","y2":-9.484,"z2":8.584,"x2":-13.646,"h":true,"x1":-15.867},{"s":false,"z1":8.209,"a":false,"y1":-6.963,"n":"Gln","y2":-7.193,"z2":10.017,"x2":-11.021,"h":true,"x1":-12.528},{"s":false,"z1":12.011,"a":false,"y1":-7.077,"n":"Leu","y2":-8.692,"z2":13.321,"x2":-11.77,"h":true,"x1":-12.965},{"s":false,"z1":12.31,"a":true,"y1":-10.864,"n":"Glu","y2":-12.171,"z2":12.281,"x2":-11.091,"h":true,"x1":-13.108},{"s":false,"z1":9.718,"a":false,"y1":-11.283,"n":"Glu","y2":-11.157,"z2":10.798,"x2":-8.21,"h":true,"x1":-10.356},{"s":false,"z1":11.049,"a":false,"y1":-8.263,"n":"Gln","y2":-7.131,"z2":9.279,"x2":-7.275,"h":false,"x1":-8.462},{"s":false,"z1":9.373,"a":false,"y1":-8.896,"n":"Cys","y2":-11.242,"z2":9.058,"x2":-5.485,"h":false,"x1":-5.142},{"s":false,"z1":8.532,"a":false,"y1":-10.179,"y2":-11.242,"z2":9.058,"x2":-5.485,"h":false,"x1":-5.059},{"s":false,"z1":8.532,"a":false,"y1":-10.179,"y2":-11.242,"z2":9.058,"x2":-5.485,"h":false,"x1":-5.059},{"s":false,"z1":8.532,"a":false,"y1":-10.179,"y2":-11.242,"z2":9.058,"x2":-5.485,"h":false,"x1":-5.059},{"s":false,"z1":8.532,"a":false,"y1":-10.179,"y2":-11.242,"z2":9.058,"x2":-5.485,"h":false,"x1":-5.059}]]},"mol":{"b":[{"e":1,"b":0},{"e":2,"b":0},{"e":3,"b":0},{"e":4,"b":0}],"a":[{"p_h":true,"l":"S","z":17.197,"y":-3.15,"x":10.085},{"p_h":true,"l":"O","z":16.373,"y":-3.679,"x":8.996},{"p_h":true,"l":"O","z":16.561,"y":-2.236,"x":11.062},{"p_h":true,"l":"O","z":18.1,"y":-4.103,"x":10.747},{"p_h":true,"l":"O","z":18.077,"y":-2.564,"x":9.08},{"p_w":true,"p_h":true,"l":"O","z":-9.626,"y":26.792,"x":-0.365},{"p_w":true,"p_h":true,"l":"H","z":-9.385,"y":26.68,"x":-1.277},{"p_w":true,"p_h":true,"l":"H","z":-9.658,"y":25.934,"x":0.02},{"p_w":true,"p_h":true,"l":"O","z":7.569,"y":7.159,"x":-13.287},{"p_w":true,"p_h":true,"l":"H","z":7.006,"y":7.905,"x":-13.496},{"p_w":true,"p_h":true,"l":"H","z":8.111,"y":7.444,"x":-12.569},{"p_w":true,"p_h":true,"l":"O","z":2.957,"y":-0.877,"x":-13.722},{"p_w":true,"p_h":true,"l":"H","z":3.304,"y":-1.679,"x":-13.26},{"p_w":true,"p_h":true,"l":"H","z":2.081,"y":-1.136,"x":-13.971},{"p_w":true,"p_h":true,"l":"O","z":-0.831,"y":3.434,"x":2.09},{"p_w":true,"p_h":true,"l":"H","z":-1.287,"y":2.995,"x":2.806},{"p_w":true,"p_h":true,"l":"H","z":-0.677,"y":2.746,"x":1.443},{"p_w":true,"p_h":true,"l":"O","z":-20.197,"y":7.919,"x":-13.927},{"p_w":true,"p_h":true,"l":"H","z":-20.468,"y":7.03,"x":-14.179},{"p_w":true,"p_h":true,"l":"H","z":-20.687,"y":8.489,"x":-14.539},{"p_w":true,"p_h":true,"l":"O","z":-12.806,"y":30.118,"x":-8.245},{"p_w":true,"p_h":true,"l":"H","z":-12.618,"y":30.836,"x":-7.659},{"p_w":true,"p_h":true,"l":"H","z":-12.067,"y":30.1,"x":-8.872},{"p_w":true,"p_h":true,"l":"O","z":-17.246,"y":1.713,"x":-16.145},{"p_w":true,"p_h":true,"l":"H","z":-17.412,"y":0.797,"x":-15.906},{"p_w":true,"p_h":true,"l":"H","z":-16.308,"y":1.812,"x":-16.126},{"p_w":true,"p_h":true,"l":"O","z":-19.825,"y":29.017,"x":-22.739},{"p_w":true,"p_h":true,"l":"H","z":-19.736,"y":29.775,"x":-23.26},{"p_w":true,"p_h":true,"l":"H","z":-20.563,"y":28.505,"x":-23.102},{"p_w":true,"p_h":true,"l":"O","z":-0.547,"y":22.728,"x":-20.904},{"p_w":true,"p_h":true,"l":"H","z":-1.037,"y":23.033,"x":-20.129},{"p_w":true,"p_h":true,"l":"H","z":0.288,"y":22.427,"x":-20.535},{"p_w":true,"p_h":true,"l":"O","z":-14.408,"y":-2.224,"x":-15.656},{"p_w":true,"p_h":true,"l":"H","z":-13.888,"y":-1.419,"x":-15.522},{"p_w":true,"p_h":true,"l":"H","z":-14.654,"y":-2.158,"x":-16.593},{"p_w":true,"p_h":true,"l":"O","z":-17.029,"y":0.782,"x":-13.331},{"p_w":true,"p_h":true,"l":"H","z":-17.667,"y":0.088,"x":-13.513},{"p_w":true,"p_h":true,"l":"H","z":-17.344,"y":1.519,"x":-13.905},{"p_w":true,"p_h":true,"l":"O","z":-16.298,"y":11.572,"x":-27.752},{"p_w":true,"p_h":true,"l":"H","z":-15.574,"y":10.949,"x":-27.656},{"p_w":true,"p_h":true,"l":"H","z":-16.28,"y":12.081,"x":-26.949},{"p_w":true,"p_h":true,"l":"O","z":-8.325,"y":3.644,"x":-26.772},{"p_w":true,"p_h":true,"l":"H","z":-7.853,"y":4.487,"x":-26.743},{"p_w":true,"p_h":true,"l":"H","z":-8.621,"y":3.541,"x":-25.857},{"p_w":true,"p_h":true,"l":"O","z":-12.26,"y":0.019,"x":-3.504},{"p_w":true,"p_h":true,"l":"H","z":-11.309,"y":0.157,"x":-3.394},{"p_w":true,"p_h":true,"l":"H","z":-12.648,"y":0.703,"x":-2.953},{"p_w":true,"p_h":true,"l":"O","z":-19.386,"y":8.962,"x":2.419},{"p_w":true,"p_h":true,"l":"H","z":-18.455,"y":9.085,"x":2.545},{"p_w":true,"p_h":true,"l":"H","z":-19.525,"y":8.936,"x":1.472},{"p_w":true,"p_h":true,"l":"O","z":2.205,"y":-0.763,"x":-17.425},{"p_w":true,"p_h":true,"l":"H","z":2.531,"y":-0.338,"x":-16.629},{"p_w":true,"p_h":true,"l":"H","z":1.549,"y":-0.122,"x":-17.758},{"p_w":true,"p_h":true,"l":"O","z":-25.121,"y":21.85,"x":-10.702},{"p_w":true,"p_h":true,"l":"H","z":-25.375,"y":21.211,"x":-10.031},{"p_w":true,"p_h":true,"l":"H","z":-24.266,"y":21.512,"x":-11.015},{"p_w":true,"p_h":true,"l":"O","z":-20.032,"y":23.687,"x":-7.338},{"p_w":true,"p_h":true,"l":"H","z":-19.718,"y":23.42,"x":-6.476},{"p_w":true,"p_h":true,"l":"H","z":-20.773,"y":24.275,"x":-7.147},{"p_w":true,"p_h":true,"l":"O","z":-11.186,"y":26.659,"x":-3.988},{"p_w":true,"p_h":true,"l":"H","z":-10.361,"y":26.201,"x":-4.226},{"p_w":true,"p_h":true,"l":"H","z":-10.897,"y":27.351,"x":-3.384},{"p_w":true,"p_h":true,"l":"O","z":-12.816,"y":26.879,"x":-5.991},{"p_w":true,"p_h":true,"l":"H","z":-12.356,"y":26.022,"x":-5.982},{"p_w":true,"p_h":true,"l":"H","z":-12.409,"y":27.339,"x":-5.248},{"p_w":true,"p_h":true,"l":"O","z":7.059,"y":12.171,"x":-7.945},{"p_w":true,"p_h":true,"l":"H","z":6.594,"y":11.767,"x":-8.668},{"p_w":true,"p_h":true,"l":"H","z":6.769,"y":11.694,"x":-7.168},{"p_w":true,"p_h":true,"l":"O","z":-16.331,"y":20.734,"x":-1.503},{"p_w":true,"p_h":true,"l":"H","z":-16.97,"y":20.007,"x":-1.378},{"p_w":true,"p_h":true,"l":"H","z":-15.675,"y":20.581,"x":-0.842},{"p_w":true,"p_h":true,"l":"O","z":-0.426,"y":-4.972,"x":-13.832},{"p_w":true,"p_h":true,"l":"H","z":0.494,"y":-5.216,"x":-13.898},{"p_w":true,"p_h":true,"l":"H","z":-0.414,"y":-4.007,"x":-13.93},{"p_w":true,"p_h":true,"l":"O","z":-16.615,"y":-1.01,"x":-17.393},{"p_w":true,"p_h":true,"l":"H","z":-17.056,"y":-1.769,"x":-17.777},{"p_w":true,"p_h":true,"l":"H","z":-17.322,"y":-0.405,"x":-17.178},{"p_w":true,"p_h":true,"l":"O","z":-8.213,"y":-4.469,"x":-25.023},{"p_w":true,"p_h":true,"l":"H","z":-8.223,"y":-5.4,"x":-25.299},{"p_w":true,"p_h":true,"l":"H","z":-7.364,"y":-4.38,"x":-24.589},{"p_w":true,"p_h":true,"l":"O","z":-14.265,"y":12.654,"x":2.033},{"p_w":true,"p_h":true,"l":"H","z":-13.865,"y":12.795,"x":2.893},{"p_w":true,"p_h":true,"l":"H","z":-14.449,"y":11.718,"x":1.994},{"p_w":true,"p_h":true,"l":"O","z":-18.149,"y":17.167,"x":-23.137},{"p_w":true,"p_h":true,"l":"H","z":-18.594,"y":16.831,"x":-22.359},{"p_w":true,"p_h":true,"l":"H","z":-17.48,"y":16.473,"x":-23.324},{"p_w":true,"p_h":true,"l":"O","z":-22.027,"y":8.158,"x":-11.943},{"p_w":true,"p_h":true,"l":"H","z":-22.379,"y":7.53,"x":-11.315},{"p_w":true,"p_h":true,"l":"H","z":-21.574,"y":8.799,"x":-11.407},{"p_w":true,"p_h":true,"l":"O","z":-21.05,"y":7.096,"x":-4.786},{"p_w":true,"p_h":true,"l":"H","z":-20.543,"y":7.698,"x":-4.246},{"p_w":true,"p_h":true,"l":"H","z":-21.124,"y":7.524,"x":-5.645},{"p_w":true,"p_h":true,"l":"O","z":-20.623,"y":10.16,"x":-27.889},{"p_w":true,"p_h":true,"l":"H","z":-21.029,"y":10.61,"x":-27.164},{"p_w":true,"p_h":true,"l":"H","z":-19.788,"y":10.583,"x":-28.03},{"p_w":true,"p_h":true,"l":"O","z":-31.971,"y":21.379,"x":-22.608},{"p_w":true,"p_h":true,"l":"H","z":-32.557,"y":22.021,"x":-22.229},{"p_w":true,"p_h":true,"l":"H","z":-32.469,"y":20.931,"x":-23.282},{"p_w":true,"p_h":true,"l":"O","z":-10.511,"y":-2.935,"x":-14.773},{"p_w":true,"p_h":true,"l":"H","z":-10.466,"y":-2.631,"x":-15.678},{"p_w":true,"p_h":true,"l":"H","z":-11.051,"y":-2.264,"x":-14.336},{"p_w":true,"p_h":true,"l":"O","z":-22.638,"y":24.712,"x":-19.645},{"p_w":true,"p_h":true,"l":"H","z":-21.698,"y":24.655,"x":-19.569},{"p_w":true,"p_h":true,"l":"H","z":-22.999,"y":24.217,"x":-18.914},{"p_w":true,"p_h":true,"l":"O","z":-9.809,"y":1.605,"x":-14.295},{"p_w":true,"p_h":true,"l":"H","z":-9.456,"y":0.862,"x":-13.792},{"p_w":true,"p_h":true,"l":"H","z":-10.597,"y":1.874,"x":-13.839},{"p_w":true,"p_h":true,"l":"O","z":-24.479,"y":4.164,"x":-16.019},{"p_w":true,"p_h":true,"l":"H","z":-24.93,"y":3.591,"x":-15.385},{"p_w":true,"p_h":true,"l":"H","z":-25.125,"y":4.824,"x":-16.25},{"p_w":true,"p_h":true,"l":"O","z":-17.449,"y":1.373,"x":-9.262},{"p_w":true,"p_h":true,"l":"H","z":-16.504,"y":1.384,"x":-9.244},{"p_w":true,"p_h":true,"l":"H","z":-17.7,"y":1.929,"x":-10.008},{"p_w":true,"p_h":true,"l":"O","z":-18.013,"y":23.595,"x":-22.136},{"p_w":true,"p_h":true,"l":"H","z":-17.16,"y":23.976,"x":-22.364},{"p_w":true,"p_h":true,"l":"H","z":-17.98,"y":22.714,"x":-22.577},{"p_w":true,"p_h":true,"l":"O","z":-25.048,"y":3.291,"x":-18.691},{"p_w":true,"p_h":true,"l":"H","z":-24.164,"y":3.24,"x":-19.064},{"p_w":true,"p_h":true,"l":"H","z":-24.876,"y":3.122,"x":-17.744},{"p_w":true,"p_h":true,"l":"O","z":-10.551,"y":19.589,"x":-1.796},{"p_w":true,"p_h":true,"l":"H","z":-10.067,"y":19.747,"x":-2.616},{"p_w":true,"p_h":true,"l":"H","z":-9.867,"y":19.516,"x":-1.125},{"p_w":true,"p_h":true,"l":"O","z":-20.891,"y":1.945,"x":-21.732},{"p_w":true,"p_h":true,"l":"H","z":-20.455,"y":2.738,"x":-22.028},{"p_w":true,"p_h":true,"l":"H","z":-20.743,"y":1.946,"x":-20.773},{"p_w":true,"p_h":true,"l":"O","z":-28.431,"y":16.923,"x":-23.533},{"p_w":true,"p_h":true,"l":"H","z":-27.808,"y":16.21,"x":-23.694},{"p_w":true,"p_h":true,"l":"H","z":-27.914,"y":17.569,"x":-23.035},{"p_w":true,"p_h":true,"l":"O","z":-13.182,"y":20.963,"x":-25.83},{"p_w":true,"p_h":true,"l":"H","z":-12.827,"y":20.617,"x":-24.992},{"p_w":true,"p_h":true,"l":"H","z":-12.355,"y":21.21,"x":-26.291},{"p_w":true,"p_h":true,"l":"O","z":-27.631,"y":2.013,"x":-18.259},{"p_w":true,"p_h":true,"l":"H","z":-26.762,"y":2.06,"x":-17.843},{"p_w":true,"p_h":true,"l":"H","z":-28.24,"y":2.279,"x":-17.584},{"p_w":true,"p_h":true,"l":"O","z":9.075,"y":22.077,"x":-9.888},{"p_w":true,"p_h":true,"l":"H","z":9.121,"y":22.178,"x":-8.937},{"p_w":true,"p_h":true,"l":"H","z":9.855,"y":21.591,"x":-10.123},{"p_w":true,"p_h":true,"l":"O","z":-12.338,"y":23.498,"x":1.513},{"p_w":true,"p_h":true,"l":"H","z":-11.387,"y":23.532,"x":1.719},{"p_w":true,"p_h":true,"l":"H","z":-12.748,"y":23.399,"x":2.369},{"p_w":true,"p_h":true,"l":"O","z":-11.221,"y":19.144,"x":-26.979},{"p_w":true,"p_h":true,"l":"H","z":-11.982,"y":19.06,"x":-27.554},{"p_w":true,"p_h":true,"l":"H","z":-10.718,"y":18.348,"x":-27.12},{"p_w":true,"p_h":true,"l":"O","z":-4.637,"y":27.389,"x":-20.104},{"p_w":true,"p_h":true,"l":"H","z":-3.821,"y":27.369,"x":-20.614},{"p_w":true,"p_h":true,"l":"H","z":-4.928,"y":26.467,"x":-20.119},{"p_w":true,"p_h":true,"l":"O","z":-12.356,"y":20.857,"x":0.211},{"p_w":true,"p_h":true,"l":"H","z":-13.019,"y":20.167,"x":0.238},{"p_w":true,"p_h":true,"l":"H","z":-12.708,"y":21.503,"x":-0.402},{"p_w":true,"p_h":true,"l":"O","z":-20.006,"y":0.065,"x":-19.733},{"p_w":true,"p_h":true,"l":"H","z":-20.637,"y":0.374,"x":-19.067},{"p_w":true,"p_h":true,"l":"H","z":-19.152,"y":0.329,"x":-19.386},{"p_w":true,"p_h":true,"l":"O","z":-12.686,"y":20.613,"x":-30.646},{"p_w":true,"p_h":true,"l":"H","z":-13.593,"y":20.323,"x":-30.658},{"p_w":true,"p_h":true,"l":"H","z":-12.441,"y":20.635,"x":-29.729},{"p_w":true,"p_h":true,"l":"O","z":-21.871,"y":-0.915,"x":-22.387},{"p_w":true,"p_h":true,"l":"H","z":-21.634,"y":-0.512,"x":-21.54},{"p_w":true,"p_h":true,"l":"H","z":-22.589,"y":-0.368,"x":-22.704},{"p_w":true,"p_h":true,"l":"O","z":-11.677,"y":23.4,"x":-31.518},{"p_w":true,"p_h":true,"l":"H","z":-11.612,"y":24.305,"x":-31.799},{"p_w":true,"p_h":true,"l":"H","z":-11.936,"y":22.914,"x":-32.309},{"p_w":true,"p_h":true,"l":"O","z":-19.801,"y":19.932,"x":-24.971},{"p_w":true,"p_h":true,"l":"H","z":-19.373,"y":19.993,"x":-25.828},{"p_w":true,"p_h":true,"l":"H","z":-20.08,"y":19.022,"x":-24.909},{"p_w":true,"p_h":true,"l":"O","z":-8.768,"y":22.104,"x":3.674},{"p_w":true,"p_h":true,"l":"H","z":-8.34,"y":21.272,"x":3.892},{"p_w":true,"p_h":true,"l":"H","z":-9.027,"y":22.461,"x":4.513},{"p_w":true,"p_h":true,"l":"O","z":-23.977,"y":22.642,"x":-8.18},{"p_w":true,"p_h":true,"l":"H","z":-23.989,"y":22.363,"x":-7.266},{"p_w":true,"p_h":true,"l":"H","z":-23.447,"y":22.024,"x":-8.645},{"p_w":true,"p_h":true,"l":"O","z":-17.15,"y":14.182,"x":-32.889},{"p_w":true,"p_h":true,"l":"H","z":-16.948,"y":13.553,"x":-33.584},{"p_w":true,"p_h":true,"l":"H","z":-17.094,"y":13.666,"x":-32.084},{"p_w":true,"p_h":true,"l":"O","z":-23.019,"y":7.966,"x":-17.032},{"p_w":true,"p_h":true,"l":"H","z":-22.804,"y":7.837,"x":-17.95},{"p_w":true,"p_h":true,"l":"H","z":-22.359,"y":8.568,"x":-16.698},{"p_w":true,"p_h":true,"l":"O","z":-3.002,"y":-6.039,"x":-15.728},{"p_w":true,"p_h":true,"l":"H","z":-3.303,"y":-6.901,"x":-15.982},{"p_w":true,"p_h":true,"l":"H","z":-2.983,"y":-6.042,"x":-14.776},{"p_w":true,"p_h":true,"l":"O","z":-8.333,"y":-0.726,"x":-14.589},{"p_w":true,"p_h":true,"l":"H","z":-7.856,"y":-0.269,"x":-15.284},{"p_w":true,"p_h":true,"l":"H","z":-7.617,"y":-1.156,"x":-14.085},{"p_w":true,"p_h":true,"l":"O","z":2.186,"y":-3.101,"x":-6.528},{"p_w":true,"p_h":true,"l":"H","z":2.28,"y":-2.159,"x":-6.463},{"p_w":true,"p_h":true,"l":"H","z":2.132,"y":-3.405,"x":-5.618},{"p_w":true,"p_h":true,"l":"O","z":-10.028,"y":0.196,"x":-11.37},{"p_w":true,"p_h":true,"l":"H","z":-9.364,"y":0.883,"x":-11.42},{"p_w":true,"p_h":true,"l":"H","z":-10.819,"y":0.591,"x":-11.734},{"p_w":true,"p_h":true,"l":"O","z":9.542,"y":19.916,"x":-15.96},{"p_w":true,"p_h":true,"l":"H","z":8.703,"y":19.585,"x":-15.644},{"p_w":true,"p_h":true,"l":"H","z":10.205,"y":19.449,"x":-15.478},{"p_w":true,"p_h":true,"l":"O","z":-17.702,"y":3.331,"x":13.035},{"p_w":true,"p_h":true,"l":"H","z":-17.396,"y":2.908,"x":12.239},{"p_w":true,"p_h":true,"l":"H","z":-17.862,"y":4.229,"x":12.817},{"p_w":true,"p_h":true,"l":"O","z":-3.595,"y":-0.093,"x":-24.07},{"p_w":true,"p_h":true,"l":"H","z":-4.382,"y":-0.503,"x":-23.686},{"p_w":true,"p_h":true,"l":"H","z":-3.915,"y":0.689,"x":-24.504},{"p_w":true,"p_h":true,"l":"O","z":-3.935,"y":31.051,"x":-1.041},{"p_w":true,"p_h":true,"l":"H","z":-3.881,"y":30.547,"x":-1.872},{"p_w":true,"p_h":true,"l":"H","z":-4.836,"y":31.354,"x":-1.025},{"p_w":true,"p_h":true,"l":"O","z":2.869,"y":25.765,"x":-0.936},{"p_w":true,"p_h":true,"l":"H","z":3.158,"y":25.882,"x":-1.844},{"p_w":true,"p_h":true,"l":"H","z":3.597,"y":26.1,"x":-0.41},{"p_w":true,"p_h":true,"l":"O","z":5.829,"y":11.32,"x":-15.746},{"p_w":true,"p_h":true,"l":"H","z":6.158,"y":10.55,"x":-15.281},{"p_w":true,"p_h":true,"l":"H","z":5.95,"y":12.041,"x":-15.116},{"p_w":true,"p_h":true,"l":"O","z":5.176,"y":2.717,"x":-9.72},{"p_w":true,"p_h":true,"l":"H","z":4.915,"y":1.948,"x":-10.207},{"p_w":true,"p_h":true,"l":"H","z":5.052,"y":2.489,"x":-8.806},{"p_w":true,"p_h":true,"l":"O","z":-5.915,"y":9.301,"x":-9.105},{"p_w":true,"p_h":true,"l":"H","z":-6.295,"y":9.925,"x":-8.489},{"p_w":true,"p_h":true,"l":"H","z":-6.274,"y":8.437,"x":-8.815},{"p_w":true,"p_h":true,"l":"O","z":-2.372,"y":26.321,"x":-4.975},{"p_w":true,"p_h":true,"l":"H","z":-3.158,"y":26.114,"x":-4.479},{"p_w":true,"p_h":true,"l":"H","z":-2.377,"y":27.273,"x":-5.08},{"p_w":true,"p_h":true,"l":"O","z":-2.58,"y":12.743,"x":5.249},{"p_w":true,"p_h":true,"l":"H","z":-2.031,"y":12.406,"x":5.935},{"p_w":true,"p_h":true,"l":"H","z":-2.263,"y":13.626,"x":5.064},{"p_w":true,"p_h":true,"l":"O","z":-18.766,"y":25.508,"x":-5.721},{"p_w":true,"p_h":true,"l":"H","z":-19.177,"y":24.893,"x":-5.125},{"p_w":true,"p_h":true,"l":"H","z":-19.198,"y":26.353,"x":-5.492},{"p_w":true,"p_h":true,"l":"O","z":-3.922,"y":27.318,"x":-7.447},{"p_w":true,"p_h":true,"l":"H","z":-3.581,"y":27.308,"x":-8.341},{"p_w":true,"p_h":true,"l":"H","z":-3.302,"y":27.862,"x":-6.964},{"p_w":true,"p_h":true,"l":"O","z":-7.893,"y":6.41,"x":-1.266},{"p_w":true,"p_h":true,"l":"H","z":-7.275,"y":5.759,"x":-1.651},{"p_w":true,"p_h":true,"l":"H","z":-7.879,"y":6.24,"x":-0.347},{"p_w":true,"p_h":true,"l":"O","z":-11.357,"y":-3.126,"x":5.585},{"p_w":true,"p_h":true,"l":"H","z":-11.354,"y":-3.952,"x":6.082},{"p_w":true,"p_h":true,"l":"H","z":-10.784,"y":-3.327,"x":4.837},{"p_w":true,"p_h":true,"l":"O","z":-16.115,"y":3.823,"x":4.418},{"p_w":true,"p_h":true,"l":"H","z":-16.974,"y":3.998,"x":4.007},{"p_w":true,"p_h":true,"l":"H","z":-15.521,"y":3.712,"x":3.693},{"p_w":true,"p_h":true,"l":"O","z":-17.427,"y":2.39,"x":9.232},{"p_w":true,"p_h":true,"l":"H","z":-17.665,"y":1.926,"x":10},{"p_w":true,"p_h":true,"l":"H","z":-17.527,"y":3.33,"x":9.447},{"p_w":true,"p_h":true,"l":"O","z":2.309,"y":-3.653,"x":-9.182},{"p_w":true,"p_h":true,"l":"H","z":1.542,"y":-3.605,"x":-8.633},{"p_w":true,"p_h":true,"l":"H","z":2.043,"y":-3.45,"x":-10.063},{"p_w":true,"p_h":true,"l":"O","z":2.368,"y":9.941,"x":2.762},{"p_w":true,"p_h":true,"l":"H","z":2.618,"y":9.065,"x":2.996},{"p_w":true,"p_h":true,"l":"H","z":3.155,"y":10.474,"x":2.832},{"p_w":true,"p_h":true,"l":"O","z":-15.596,"y":-3.39,"x":6.171},{"p_w":true,"p_h":true,"l":"H","z":-15.423,"y":-3.384,"x":7.125},{"p_w":true,"p_h":true,"l":"H","z":-16.319,"y":-3.989,"x":6.063},{"p_w":true,"p_h":true,"l":"O","z":-24.286,"y":19.121,"x":-10.252},{"p_w":true,"p_h":true,"l":"H","z":-23.859,"y":19.31,"x":-9.41},{"p_w":true,"p_h":true,"l":"H","z":-24.437,"y":18.168,"x":-10.218},{"p_w":true,"p_h":true,"l":"O","z":-17.114,"y":0.109,"x":-2.41},{"p_w":true,"p_h":true,"l":"H","z":-16.672,"y":-0.317,"x":-3.142},{"p_w":true,"p_h":true,"l":"H","z":-17.952,"y":-0.343,"x":-2.329},{"p_w":true,"p_h":true,"l":"O","z":-10.766,"y":18.029,"x":-31.341},{"p_w":true,"p_h":true,"l":"H","z":-10.504,"y":18.026,"x":-30.422},{"p_w":true,"p_h":true,"l":"H","z":-10.456,"y":17.226,"x":-31.704},{"p_w":true,"p_h":true,"l":"O","z":-9.169,"y":5.918,"x":-25.692},{"p_w":true,"p_h":true,"l":"H","z":-9.614,"y":6.768,"x":-25.786},{"p_w":true,"p_h":true,"l":"H","z":-8.74,"y":5.955,"x":-24.845},{"p_w":true,"p_h":true,"l":"O","z":-26.258,"y":17.901,"x":-26.682},{"p_w":true,"p_h":true,"l":"H","z":-26.135,"y":18.3,"x":-25.819},{"p_w":true,"p_h":true,"l":"H","z":-25.398,"y":17.599,"x":-26.944},{"p_w":true,"p_h":true,"l":"O","z":-10.265,"y":33.983,"x":-10.292},{"p_w":true,"p_h":true,"l":"H","z":-10.075,"y":34.828,"x":-9.882},{"p_w":true,"p_h":true,"l":"H","z":-11.064,"y":34.146,"x":-10.804},{"p_w":true,"p_h":true,"l":"O","z":-7.991,"y":16.381,"x":-3.034},{"p_w":true,"p_h":true,"l":"H","z":-8.71,"y":16.761,"x":-2.508},{"p_w":true,"p_h":true,"l":"H","z":-7.269,"y":16.297,"x":-2.396},{"p_w":true,"p_h":true,"l":"O","z":4.533,"y":18.568,"x":-4.076},{"p_w":true,"p_h":true,"l":"H","z":3.795,"y":18.07,"x":-3.684},{"p_w":true,"p_h":true,"l":"H","z":4.41,"y":19.448,"x":-3.728},{"p_w":true,"p_h":true,"l":"O","z":-8.798,"y":3.55,"x":-2.687},{"p_w":true,"p_h":true,"l":"H","z":-9.733,"y":3.443,"x":-2.859},{"p_w":true,"p_h":true,"l":"H","z":-8.762,"y":3.9,"x":-1.798},{"p_w":true,"p_h":true,"l":"O","z":-19.271,"y":12.86,"x":-29.405},{"p_w":true,"p_h":true,"l":"H","z":-18.603,"y":12.165,"x":-29.325},{"p_w":true,"p_h":true,"l":"H","z":-19.704,"y":12.661,"x":-30.244},{"p_w":true,"p_h":true,"l":"O","z":-8.012,"y":16.566,"x":-0.063},{"p_w":true,"p_h":true,"l":"H","z":-7.736,"y":16.716,"x":0.858},{"p_w":true,"p_h":true,"l":"H","z":-7.528,"y":17.236,"x":-0.54},{"p_w":true,"p_h":true,"l":"O","z":-27.637,"y":6.802,"x":-15.09},{"p_w":true,"p_h":true,"l":"H","z":-26.75,"y":6.547,"x":-15.381},{"p_w":true,"p_h":true,"l":"H","z":-27.762,"y":7.671,"x":-15.444},{"p_w":true,"p_h":true,"l":"O","z":-16.093,"y":2.486,"x":-5.553},{"p_w":true,"p_h":true,"l":"H","z":-16.742,"y":2.726,"x":-6.229},{"p_w":true,"p_h":true,"l":"H","z":-16.505,"y":2.691,"x":-4.733},{"p_w":true,"p_h":true,"l":"O","z":-20.461,"y":-0.34,"x":-17.015},{"p_w":true,"p_h":true,"l":"H","z":-19.569,"y":-0.039,"x":-17.152},{"p_w":true,"p_h":true,"l":"H","z":-20.491,"y":-1.234,"x":-17.336},{"p_w":true,"p_h":true,"l":"O","z":-8.384,"y":-0.859,"x":5.627},{"p_w":true,"p_h":true,"l":"H","z":-8.985,"y":-1.189,"x":6.285},{"p_w":true,"p_h":true,"l":"H","z":-8.934,"y":-0.503,"x":4.932},{"p_w":true,"p_h":true,"l":"O","z":-4.662,"y":10.568,"x":-23.002},{"p_w":true,"p_h":true,"l":"H","z":-5.617,"y":10.707,"x":-22.874},{"p_w":true,"p_h":true,"l":"H","z":-4.315,"y":11.466,"x":-22.958},{"p_w":true,"p_h":true,"l":"O","z":-13.908,"y":2.449,"x":8.709},{"p_w":true,"p_h":true,"l":"H","z":-14.403,"y":2.886,"x":7.992},{"p_w":true,"p_h":true,"l":"H","z":-13.032,"y":2.331,"x":8.341},{"p_w":true,"p_h":true,"l":"O","z":-18.036,"y":1.285,"x":-21.776},{"p_w":true,"p_h":true,"l":"H","z":-18.062,"y":1.665,"x":-20.906},{"p_w":true,"p_h":true,"l":"H","z":-18.822,"y":0.722,"x":-21.821},{"p_w":true,"p_h":true,"l":"O","z":-13.731,"y":0.781,"x":10.847},{"p_w":true,"p_h":true,"l":"H","z":-13.604,"y":1.717,"x":10.645},{"p_w":true,"p_h":true,"l":"H","z":-13.599,"y":0.35,"x":10.005},{"p_w":true,"p_h":true,"l":"O","z":-5.182,"y":14.78,"x":-0.386},{"p_w":true,"p_h":true,"l":"H","z":-5.55,"y":14.034,"x":0.15},{"p_w":true,"p_h":true,"l":"H","z":-5.477,"y":14.576,"x":-1.268},{"p_w":true,"p_h":true,"l":"O","z":-2.945,"y":12.792,"x":2.387},{"p_w":true,"p_h":true,"l":"H","z":-3.413,"y":11.939,"x":2.279},{"p_w":true,"p_h":true,"l":"H","z":-3.693,"y":13.418,"x":2.314},{"p_w":true,"p_h":true,"l":"O","z":-3.058,"y":11.057,"x":-26.974},{"p_w":true,"p_h":true,"l":"H","z":-2.94,"y":10.077,"x":-26.893},{"p_w":true,"p_h":true,"l":"H","z":-3.381,"y":11.294,"x":-26.109},{"p_w":true,"p_h":true,"l":"O","z":-5.595,"y":12.183,"x":-25.056},{"p_w":true,"p_h":true,"l":"H","z":-5.07,"y":12.124,"x":-25.841},{"p_w":true,"p_h":true,"l":"H","z":-5.952,"y":11.263,"x":-24.982},{"p_w":true,"p_h":true,"l":"O","z":-20.37,"y":5.279,"x":-1.971},{"p_w":true,"p_h":true,"l":"H","z":-21.088,"y":5.82,"x":-2.313},{"p_w":true,"p_h":true,"l":"H","z":-20.663,"y":4.38,"x":-2.136},{"p_w":true,"p_h":true,"l":"O","z":13.524,"y":16.4,"x":-21.154},{"p_w":true,"p_h":true,"l":"H","z":13.754,"y":15.5,"x":-20.914},{"p_w":true,"p_h":true,"l":"H","z":13.205,"y":16.784,"x":-20.332},{"p_w":true,"p_h":true,"l":"O","z":-2.559,"y":8.157,"x":-26.513},{"p_w":true,"p_h":true,"l":"H","z":-1.964,"y":8.069,"x":-25.743},{"p_w":true,"p_h":true,"l":"H","z":-3.395,"y":7.842,"x":-26.171},{"p_w":true,"p_h":true,"l":"O","z":-22.867,"y":3.487,"x":-20.631},{"p_w":true,"p_h":true,"l":"H","z":-23.826,"y":3.639,"x":-20.583},{"p_w":true,"p_h":true,"l":"H","z":-22.686,"y":3.651,"x":-21.566},{"p_w":true,"p_h":true,"l":"O","z":-26.159,"y":5.871,"x":-18.049},{"p_w":true,"p_h":true,"l":"H","z":-25.89,"y":6.786,"x":-17.977},{"p_w":true,"p_h":true,"l":"H","z":-26.999,"y":5.925,"x":-18.547},{"p_w":true,"p_h":true,"l":"O","z":-20.577,"y":29.1,"x":-12.834},{"p_w":true,"p_h":true,"l":"H","z":-19.66,"y":28.812,"x":-12.998},{"p_w":true,"p_h":true,"l":"H","z":-20.454,"y":29.861,"x":-12.258},{"p_w":true,"p_h":true,"l":"O","z":-10.397,"y":31.281,"x":-9.24},{"p_w":true,"p_h":true,"l":"H","z":-10.012,"y":31.83,"x":-8.544},{"p_w":true,"p_h":true,"l":"H","z":-11.301,"y":31.536,"x":-9.279},{"p_w":true,"p_h":true,"l":"O","z":4.246,"y":14.917,"x":-0.418},{"p_w":true,"p_h":true,"l":"H","z":3.759,"y":14.515,"x":0.272},{"p_w":true,"p_h":true,"l":"H","z":3.83,"y":14.575,"x":-1.254},{"p_w":true,"p_h":true,"l":"O","z":-20.865,"y":5.061,"x":-10.683},{"p_w":true,"p_h":true,"l":"H","z":-20.405,"y":5.555,"x":-11.363},{"p_w":true,"p_h":true,"l":"H","z":-20.953,"y":4.178,"x":-11.059},{"p_w":true,"p_h":true,"l":"O","z":-8.788,"y":28.285,"x":-26.724},{"p_w":true,"p_h":true,"l":"H","z":-8.489,"y":29.166,"x":-26.88},{"p_w":true,"p_h":true,"l":"H","z":-9.595,"y":28.392,"x":-26.196},{"p_w":true,"p_h":true,"l":"O","z":0.968,"y":12.053,"x":5.237},{"p_w":true,"p_h":true,"l":"H","z":0.619,"y":12.427,"x":4.413},{"p_w":true,"p_h":true,"l":"H","z":0.23,"y":12.094,"x":5.833},{"p_w":true,"p_h":true,"l":"O","z":-2.762,"y":-1.484,"x":-5.668},{"p_w":true,"p_h":true,"l":"H","z":-2.653,"y":-0.589,"x":-6.033},{"p_w":true,"p_h":true,"l":"H","z":-3.114,"y":-1.985,"x":-6.385},{"p_w":true,"p_h":true,"l":"O","z":7.968,"y":19.441,"x":-11.591},{"p_w":true,"p_h":true,"l":"H","z":8.061,"y":18.611,"x":-12.072},{"p_w":true,"p_h":true,"l":"H","z":8.773,"y":19.548,"x":-11.114},{"p_w":true,"p_h":true,"l":"O","z":-9.851,"y":-4.552,"x":3.591},{"p_w":true,"p_h":true,"l":"H","z":-9.998,"y":-3.65,"x":3.313},{"p_w":true,"p_h":true,"l":"H","z":-9.302,"y":-4.929,"x":2.9},{"p_w":true,"p_h":true,"l":"O","z":-21.299,"y":5.475,"x":-19.948},{"p_w":true,"p_h":true,"l":"H","z":-20.797,"y":6.238,"x":-20.179},{"p_w":true,"p_h":true,"l":"H","z":-22.072,"y":5.492,"x":-20.523},{"p_w":true,"p_h":true,"l":"O","z":-8.253,"y":8.597,"x":-26.393},{"p_w":true,"p_h":true,"l":"H","z":-8.122,"y":8.527,"x":-27.346},{"p_w":true,"p_h":true,"l":"H","z":-7.987,"y":7.743,"x":-26.06},{"p_w":true,"p_h":true,"l":"O","z":-6.868,"y":-7.401,"x":-25.835},{"p_w":true,"p_h":true,"l":"H","z":-6.05,"y":-7.763,"x":-25.503},{"p_w":true,"p_h":true,"l":"H","z":-7.247,"y":-8.136,"x":-26.351},{"p_w":true,"p_h":true,"l":"O","z":-0.219,"y":14.746,"x":-31.07},{"p_w":true,"p_h":true,"l":"H","z":-0.991,"y":15.197,"x":-30.675},{"p_w":true,"p_h":true,"l":"H","z":0.253,"y":14.39,"x":-30.333},{"p_w":true,"p_h":true,"l":"O","z":-24.223,"y":4.03,"x":-22.812},{"p_w":true,"p_h":true,"l":"H","z":-24.257,"y":4.993,"x":-22.82},{"p_w":true,"p_h":true,"l":"H","z":-25.179,"y":3.797,"x":-22.819},{"p_w":true,"p_h":true,"l":"O","z":5.832,"y":9.726,"x":-18.398},{"p_w":true,"p_h":true,"l":"H","z":6.277,"y":10.28,"x":-17.764},{"p_w":true,"p_h":true,"l":"H","z":6.169,"y":8.848,"x":-18.257},{"p_w":true,"p_h":true,"l":"O","z":-1.2,"y":14.557,"x":-23.469},{"p_w":true,"p_h":true,"l":"H","z":-0.346,"y":14.172,"x":-23.12},{"p_w":true,"p_h":true,"l":"H","z":-1.326,"y":14.04,"x":-24.248},{"p_w":true,"p_h":true,"l":"O","z":-18.242,"y":20.82,"x":-21.454},{"p_w":true,"p_h":true,"l":"H","z":-19.022,"y":21.311,"x":-21.217},{"p_w":true,"p_h":true,"l":"H","z":-18.404,"y":19.933,"x":-21.12},{"p_w":true,"p_h":true,"l":"O","z":-0.663,"y":12.449,"x":-25.379},{"p_w":true,"p_h":true,"l":"H","z":-1.387,"y":12.714,"x":-25.884},{"p_w":true,"p_h":true,"l":"H","z":-0.323,"y":11.647,"x":-25.829},{"p_w":true,"p_h":true,"l":"O","z":-23.933,"y":27.015,"x":-20.442},{"p_w":true,"p_h":true,"l":"H","z":-24.638,"y":26.377,"x":-20.349},{"p_w":true,"p_h":true,"l":"H","z":-24.04,"y":27.338,"x":-21.351},{"p_w":true,"p_h":true,"l":"O","z":1.436,"y":20.652,"x":-20.478},{"p_w":true,"p_h":true,"l":"H","z":1.351,"y":20.896,"x":-21.394},{"p_w":true,"p_h":true,"l":"H","z":1.954,"y":19.834,"x":-20.497},{"p_w":true,"p_h":true,"l":"O","z":-11.857,"y":21.403,"x":-33.757},{"p_w":true,"p_h":true,"l":"H","z":-11.844,"y":22.347,"x":-33.758},{"p_w":true,"p_h":true,"l":"H","z":-12.774,"y":21.156,"x":-33.748},{"p_w":true,"p_h":true,"l":"O","z":-2.133,"y":5.63,"x":-24.674},{"p_w":true,"p_h":true,"l":"H","z":-2.716,"y":5.852,"x":-23.939},{"p_w":true,"p_h":true,"l":"H","z":-1.897,"y":4.709,"x":-24.499},{"p_w":true,"p_h":true,"l":"O","z":-23.751,"y":7.413,"x":-4.79},{"p_w":true,"p_h":true,"l":"H","z":-23.744,"y":7.188,"x":-3.858},{"p_w":true,"p_h":true,"l":"H","z":-22.9,"y":7.855,"x":-4.912},{"p_w":true,"p_h":true,"l":"O","z":-14.805,"y":19.173,"x":1.171},{"p_w":true,"p_h":true,"l":"H","z":-15.39,"y":19.787,"x":0.752},{"p_w":true,"p_h":true,"l":"H","z":-14.308,"y":19.694,"x":1.806},{"p_w":true,"p_h":true,"l":"O","z":-13.165,"y":30.062,"x":-21.779},{"p_w":true,"p_h":true,"l":"H","z":-12.88,"y":29.305,"x":-21.252},{"p_w":true,"p_h":true,"l":"H","z":-13.14,"y":30.796,"x":-21.176},{"p_w":true,"p_h":true,"l":"O","z":33.809,"y":9.32,"x":-4.964},{"p_w":true,"p_h":true,"l":"H","z":34.003,"y":10.155,"x":-5.398},{"p_w":true,"p_h":true,"l":"H","z":34.34,"y":9.342,"x":-4.168},{"p_w":true,"p_h":true,"l":"O","z":34.041,"y":4.694,"x":0.155},{"p_w":true,"p_h":true,"l":"H","z":34.928,"y":4.562,"x":-0.187},{"p_w":true,"p_h":true,"l":"H","z":33.753,"y":3.866,"x":0.474},{"p_w":true,"p_h":true,"l":"O","z":12.598,"y":-16.364,"x":2.053},{"p_w":true,"p_h":true,"l":"H","z":12.202,"y":-15.527,"x":1.793},{"p_w":true,"p_h":true,"l":"H","z":13.247,"y":-16.539,"x":1.375},{"p_w":true,"p_h":true,"l":"O","z":18.403,"y":0.612,"x":11.479},{"p_w":true,"p_h":true,"l":"H","z":17.732,"y":-0.108,"x":11.35},{"p_w":true,"p_h":true,"l":"H","z":17.943,"y":1.406,"x":11.385},{"p_w":true,"p_h":true,"l":"O","z":6.428,"y":-7.372,"x":-8.591},{"p_w":true,"p_h":true,"l":"H","z":7.385,"y":-7.292,"x":-8.647},{"p_w":true,"p_h":true,"l":"H","z":6.246,"y":-7.34,"x":-7.658},{"p_w":true,"p_h":true,"l":"O","z":9.599,"y":1.255,"x":-16.979},{"p_w":true,"p_h":true,"l":"H","z":9.785,"y":0.317,"x":-16.858},{"p_w":true,"p_h":true,"l":"H","z":9.885,"y":1.454,"x":-17.867},{"p_w":true,"p_h":true,"l":"O","z":36.531,"y":2.57,"x":-5.264},{"p_w":true,"p_h":true,"l":"H","z":36.721,"y":2.005,"x":-6.003},{"p_w":true,"p_h":true,"l":"H","z":36.245,"y":3.411,"x":-5.669},{"p_w":true,"p_h":true,"l":"O","z":38.642,"y":-1.299,"x":-4.079},{"p_w":true,"p_h":true,"l":"H","z":38.569,"y":-1.792,"x":-4.906},{"p_w":true,"p_h":true,"l":"H","z":38.934,"y":-1.95,"x":-3.442},{"p_w":true,"p_h":true,"l":"O","z":5.313,"y":12.839,"x":1.053},{"p_w":true,"p_h":true,"l":"H","z":5.698,"y":13.321,"x":0.332},{"p_w":true,"p_h":true,"l":"H","z":4.38,"y":13.059,"x":1.036},{"p_w":true,"p_h":true,"l":"O","z":34.549,"y":2.966,"x":-3.357},{"p_w":true,"p_h":true,"l":"H","z":34.61,"y":2.335,"x":-2.666},{"p_w":true,"p_h":true,"l":"H","z":35.19,"y":2.68,"x":-4.02},{"p_w":true,"p_h":true,"l":"O","z":39.6,"y":1.001,"x":-2.122},{"p_w":true,"p_h":true,"l":"H","z":38.671,"y":1.125,"x":-2.222},{"p_w":true,"p_h":true,"l":"H","z":39.722,"y":0.422,"x":-1.382},{"p_w":true,"p_h":true,"l":"O","z":36.095,"y":1.895,"x":-1.026},{"p_w":true,"p_h":true,"l":"H","z":35.142,"y":1.763,"x":-1.044},{"p_w":true,"p_h":true,"l":"H","z":36.427,"y":1.115,"x":-0.595},{"p_w":true,"p_h":true,"l":"O","z":10.943,"y":7.279,"x":-13.617},{"p_w":true,"p_h":true,"l":"H","z":11.371,"y":7.988,"x":-14.085},{"p_w":true,"p_h":true,"l":"H","z":11.141,"y":7.425,"x":-12.699},{"p_w":true,"p_h":true,"l":"O","z":13.27,"y":7.662,"x":-22.152},{"p_w":true,"p_h":true,"l":"H","z":13.021,"y":6.764,"x":-21.977},{"p_w":true,"p_h":true,"l":"H","z":14.227,"y":7.657,"x":-22.201},{"p_w":true,"p_h":true,"l":"O","z":13.018,"y":0.78,"x":7.763},{"p_w":true,"p_h":true,"l":"H","z":12.75,"y":0.739,"x":8.68},{"p_w":true,"p_h":true,"l":"H","z":12.381,"y":0.24,"x":7.299},{"p_w":true,"p_h":true,"l":"O","z":14.144,"y":8.108,"x":9.17},{"p_w":true,"p_h":true,"l":"H","z":14.667,"y":7.889,"x":8.404},{"p_w":true,"p_h":true,"l":"H","z":14.545,"y":7.636,"x":9.896},{"p_w":true,"p_h":true,"l":"O","z":16.825,"y":-9.992,"x":-7.904},{"p_w":true,"p_h":true,"l":"H","z":16.92,"y":-9.216,"x":-7.356},{"p_w":true,"p_h":true,"l":"H","z":16.22,"y":-10.556,"x":-7.463},{"p_w":true,"p_h":true,"l":"O","z":12.675,"y":4.053,"x":7.546},{"p_w":true,"p_h":true,"l":"H","z":13.502,"y":3.805,"x":7.079},{"p_w":true,"p_h":true,"l":"H","z":12.127,"y":4.378,"x":6.831},{"p_w":true,"p_h":true,"l":"O","z":11.045,"y":18.005,"x":-10.377},{"p_w":true,"p_h":true,"l":"H","z":10.244,"y":18.461,"x":-10.568},{"p_w":true,"p_h":true,"l":"H","z":10.807,"y":17.084,"x":-10.285},{"p_w":true,"p_h":true,"l":"O","z":20.804,"y":-11.956,"x":5.233},{"p_w":true,"p_h":true,"l":"H","z":21.488,"y":-12.396,"x":5.765},{"p_w":true,"p_h":true,"l":"H","z":21.307,"y":-11.301,"x":4.733},{"p_w":true,"p_h":true,"l":"O","z":8.139,"y":-0.427,"x":-19.814},{"p_w":true,"p_h":true,"l":"H","z":8.475,"y":-0.596,"x":-18.931},{"p_w":true,"p_h":true,"l":"H","z":8.858,"y":0.074,"x":-20.232},{"p_w":true,"p_h":true,"l":"O","z":24.891,"y":18,"x":-8.056},{"p_w":true,"p_h":true,"l":"H","z":24.76,"y":18.979,"x":-8.112},{"p_w":true,"p_h":true,"l":"H","z":24.933,"y":17.743,"x":-8.985},{"p_w":true,"p_h":true,"l":"O","z":23.169,"y":21.391,"x":-9.635},{"p_w":true,"p_h":true,"l":"H","z":22.411,"y":21.089,"x":-9.135},{"p_w":true,"p_h":true,"l":"H","z":23.337,"y":20.713,"x":-10.274},{"p_w":true,"p_h":true,"l":"O","z":27.477,"y":0.135,"x":9.391},{"p_w":true,"p_h":true,"l":"H","z":27.377,"y":-0.633,"x":8.82},{"p_w":true,"p_h":true,"l":"H","z":27.67,"y":0.854,"x":8.794},{"p_w":true,"p_h":true,"l":"O","z":35.709,"y":-1.258,"x":7.124},{"p_w":true,"p_h":true,"l":"H","z":35.124,"y":-1.803,"x":6.595},{"p_w":true,"p_h":true,"l":"H","z":36.542,"y":-1.274,"x":6.616},{"p_w":true,"p_h":true,"l":"O","z":11.073,"y":7.032,"x":-17.242},{"p_w":true,"p_h":true,"l":"H","z":11.856,"y":6.49,"x":-17.354},{"p_w":true,"p_h":true,"l":"H","z":11.406,"y":7.857,"x":-16.894},{"p_w":true,"p_h":true,"l":"O","z":20.998,"y":4.022,"x":-26.506},{"p_w":true,"p_h":true,"l":"H","z":20.305,"y":3.369,"x":-26.611},{"p_w":true,"p_h":true,"l":"H","z":21.224,"y":3.996,"x":-25.588},{"p_w":true,"p_h":true,"l":"O","z":22.232,"y":11.444,"x":-14.564},{"p_w":true,"p_h":true,"l":"H","z":21.666,"y":10.692,"x":-14.423},{"p_w":true,"p_h":true,"l":"H","z":21.625,"y":12.188,"x":-14.617},{"p_w":true,"p_h":true,"l":"O","z":26.574,"y":-16.007,"x":-4.989},{"p_w":true,"p_h":true,"l":"H","z":26.04,"y":-16.757,"x":-4.739},{"p_w":true,"p_h":true,"l":"H","z":25.952,"y":-15.289,"x":-5.09},{"p_w":true,"p_h":true,"l":"O","z":26.097,"y":-0.661,"x":13.868},{"p_w":true,"p_h":true,"l":"H","z":25.412,"y":-0.294,"x":14.417},{"p_w":true,"p_h":true,"l":"H","z":26.744,"y":-1.017,"x":14.453},{"p_w":true,"p_h":true,"l":"O","z":12.791,"y":7.237,"x":11.621},{"p_w":true,"p_h":true,"l":"H","z":12.525,"y":6.442,"x":12.057},{"p_w":true,"p_h":true,"l":"H","z":12.128,"y":7.892,"x":11.863},{"p_w":true,"p_h":true,"l":"O","z":7.579,"y":14.62,"x":2.516},{"p_w":true,"p_h":true,"l":"H","z":7.369,"y":15.54,"x":2.344},{"p_w":true,"p_h":true,"l":"H","z":8.024,"y":14.331,"x":1.71},{"p_w":true,"p_h":true,"l":"O","z":18.136,"y":4.363,"x":-24.114},{"p_w":true,"p_h":true,"l":"H","z":17.96,"y":4.427,"x":-23.183},{"p_w":true,"p_h":true,"l":"H","z":18.589,"y":3.53,"x":-24.228},{"p_w":true,"p_h":true,"l":"O","z":10.122,"y":-12.29,"x":5.526},{"p_w":true,"p_h":true,"l":"H","z":10.293,"y":-13.25,"x":5.551},{"p_w":true,"p_h":true,"l":"H","z":10.579,"y":-11.958,"x":6.292},{"p_w":true,"p_h":true,"l":"O","z":38.408,"y":0.382,"x":-6.119},{"p_w":true,"p_h":true,"l":"H","z":39.251,"y":0.764,"x":-5.835},{"p_w":true,"p_h":true,"l":"H","z":38.482,"y":0.335,"x":-7.068},{"p_w":true,"p_h":true,"l":"O","z":26.604,"y":10.42,"x":9.398},{"p_w":true,"p_h":true,"l":"H","z":26.014,"y":9.743,"x":9.009},{"p_w":true,"p_h":true,"l":"H","z":26.042,"y":11.187,"x":9.472},{"p_w":true,"p_h":true,"l":"O","z":19.254,"y":7.6,"x":13.517},{"p_w":true,"p_h":true,"l":"H","z":19.357,"y":8.246,"x":12.801},{"p_w":true,"p_h":true,"l":"H","z":19.62,"y":8.067,"x":14.274},{"p_w":true,"p_h":true,"l":"O","z":14.451,"y":-12.111,"x":-19.285},{"p_w":true,"p_h":true,"l":"H","z":14.448,"y":-12.986,"x":-18.884},{"p_w":true,"p_h":true,"l":"H","z":13.673,"y":-11.685,"x":-18.956},{"p_w":true,"p_h":true,"l":"O","z":26.83,"y":7.723,"x":8.259},{"p_w":true,"p_h":true,"l":"H","z":27.093,"y":6.897,"x":7.857},{"p_w":true,"p_h":true,"l":"H","z":27.635,"y":8.068,"x":8.66},{"p_w":true,"p_h":true,"l":"O","z":17.508,"y":10.98,"x":4.139},{"p_w":true,"p_h":true,"l":"H","z":18.073,"y":10.295,"x":4.472},{"p_w":true,"p_h":true,"l":"H","z":18.122,"y":11.578,"x":3.706},{"p_w":true,"p_h":true,"l":"O","z":19.025,"y":-3.175,"x":-19.082},{"p_w":true,"p_h":true,"l":"H","z":19.935,"y":-2.999,"x":-19.328},{"p_w":true,"p_h":true,"l":"H","z":18.98,"y":-4.138,"x":-19.089},{"p_w":true,"p_h":true,"l":"O","z":9.057,"y":-4.827,"x":-0.621},{"p_w":true,"p_h":true,"l":"H","z":9.367,"y":-3.921,"x":-0.406},{"p_w":true,"p_h":true,"l":"H","z":9.824,"y":-5.234,"x":-1.003},{"p_w":true,"p_h":true,"l":"O","z":34.133,"y":-0.924,"x":-24.118},{"p_w":true,"p_h":true,"l":"H","z":34.127,"y":0.035,"x":-24.108},{"p_w":true,"p_h":true,"l":"H","z":33.201,"y":-1.16,"x":-24.108},{"p_w":true,"p_h":true,"l":"O","z":21.527,"y":-3.686,"x":-18.326},{"p_w":true,"p_h":true,"l":"H","z":21.803,"y":-2.786,"x":-18.558},{"p_w":true,"p_h":true,"l":"H","z":21.767,"y":-3.766,"x":-17.412},{"p_w":true,"p_h":true,"l":"O","z":37.438,"y":4.834,"x":-0.178},{"p_w":true,"p_h":true,"l":"H","z":37.108,"y":4.017,"x":0.193},{"p_w":true,"p_h":true,"l":"H","z":37.87,"y":4.574,"x":-0.987},{"p_w":true,"p_h":true,"l":"O","z":13.002,"y":-9.288,"x":-21.019},{"p_w":true,"p_h":true,"l":"H","z":12.899,"y":-9.293,"x":-21.975},{"p_w":true,"p_h":true,"l":"H","z":12.528,"y":-10.037,"x":-20.708},{"p_w":true,"p_h":true,"l":"O","z":37.68,"y":4.484,"x":6.518},{"p_w":true,"p_h":true,"l":"H","z":37.459,"y":4.02,"x":7.327},{"p_w":true,"p_h":true,"l":"H","z":38.564,"y":4.793,"x":6.637},{"p_w":true,"p_h":true,"l":"O","z":5.093,"y":13.522,"x":4.949},{"p_w":true,"p_h":true,"l":"H","z":5.277,"y":12.703,"x":4.458},{"p_w":true,"p_h":true,"l":"H","z":5.951,"y":13.751,"x":5.31},{"p_w":true,"p_h":true,"l":"O","z":13.406,"y":-7.013,"x":-22.835},{"p_w":true,"p_h":true,"l":"H","z":14.242,"y":-6.886,"x":-22.391},{"p_w":true,"p_h":true,"l":"H","z":13.584,"y":-6.829,"x":-23.756},{"p_w":true,"p_h":true,"l":"O","z":42.86,"y":0.782,"x":-3.327},{"p_w":true,"p_h":true,"l":"H","z":43.367,"y":0.499,"x":-4.076},{"p_w":true,"p_h":true,"l":"H","z":43.032,"y":1.719,"x":-3.241},{"p_w":true,"p_h":true,"l":"O","z":37.931,"y":-7.493,"x":2.47},{"p_w":true,"p_h":true,"l":"H","z":38.794,"y":-7.095,"x":2.456},{"p_w":true,"p_h":true,"l":"H","z":37.331,"y":-6.794,"x":2.175},{"p_w":true,"p_h":true,"l":"O","z":25.219,"y":10.985,"x":-15.469},{"p_w":true,"p_h":true,"l":"H","z":26.103,"y":11.06,"x":-15.114},{"p_w":true,"p_h":true,"l":"H","z":24.985,"y":10.063,"x":-15.313},{"p_w":true,"p_h":true,"l":"O","z":20.118,"y":-0.311,"x":-23.972},{"p_w":true,"p_h":true,"l":"H","z":20.698,"y":-0.784,"x":-24.581},{"p_w":true,"p_h":true,"l":"H","z":20.672,"y":-0.037,"x":-23.26},{"p_w":true,"p_h":true,"l":"O","z":22.745,"y":-11.07,"x":7.443},{"p_w":true,"p_h":true,"l":"H","z":22.011,"y":-10.803,"x":6.884},{"p_w":true,"p_h":true,"l":"H","z":23.313,"y":-10.299,"x":7.477},{"p_w":true,"p_h":true,"l":"O","z":21.658,"y":16.478,"x":-6.537},{"p_w":true,"p_h":true,"l":"H","z":22.466,"y":16.018,"x":-6.652},{"p_w":true,"p_h":true,"l":"H","z":21.827,"y":17.133,"x":-5.847},{"p_w":true,"p_h":true,"l":"O","z":22.589,"y":14.31,"x":-8.054},{"p_w":true,"p_h":true,"l":"H","z":21.775,"y":13.767,"x":-8.238},{"p_w":true,"p_h":true,"l":"H","z":22.279,"y":15.18,"x":-8.36},{"p_w":true,"p_h":true,"l":"O","z":22.54,"y":17.37,"x":-9.566},{"p_w":true,"p_h":true,"l":"H","z":22.86,"y":17.323,"x":-8.675},{"p_w":true,"p_h":true,"l":"H","z":23.071,"y":18.022,"x":-10.003},{"p_w":true,"p_h":true,"l":"O","z":5.355,"y":-9.949,"x":-8.169},{"p_w":true,"p_h":true,"l":"H","z":6.022,"y":-10.103,"x":-7.471},{"p_w":true,"p_h":true,"l":"H","z":4.69,"y":-9.431,"x":-7.73},{"p_w":true,"p_h":true,"l":"O","z":6.236,"y":-4.079,"x":-6.22},{"p_w":true,"p_h":true,"l":"H","z":7.077,"y":-3.897,"x":-5.809},{"p_w":true,"p_h":true,"l":"H","z":5.901,"y":-4.814,"x":-5.68},{"p_w":true,"p_h":true,"l":"O","z":14.143,"y":-11.54,"x":-9.134},{"p_w":true,"p_h":true,"l":"H","z":14.43,"y":-11.25,"x":-8.299},{"p_w":true,"p_h":true,"l":"H","z":13.18,"y":-11.51,"x":-9.109},{"p_w":true,"p_h":true,"l":"O","z":2.554,"y":-6.155,"x":-10.984},{"p_w":true,"p_h":true,"l":"H","z":2.907,"y":-6.86,"x":-10.429},{"p_w":true,"p_h":true,"l":"H","z":1.655,"y":-6.368,"x":-11.126},{"p_w":true,"p_h":true,"l":"O","z":12.098,"y":-15.212,"x":-9.51},{"p_w":true,"p_h":true,"l":"H","z":11.672,"y":-14.816,"x":-8.748},{"p_w":true,"p_h":true,"l":"H","z":12.243,"y":-14.465,"x":-10.107},{"p_w":true,"p_h":true,"l":"O","z":14.118,"y":5.912,"x":6.194},{"p_w":true,"p_h":true,"l":"H","z":14.889,"y":5.364,"x":6.256},{"p_w":true,"p_h":true,"l":"H","z":14.426,"y":6.736,"x":5.806},{"p_w":true,"p_h":true,"l":"O","z":5.566,"y":-0.626,"x":-14.3},{"p_w":true,"p_h":true,"l":"H","z":6.078,"y":-1.28,"x":-14.715},{"p_w":true,"p_h":true,"l":"H","z":6.185,"y":-0.012,"x":-13.867}]}});
var pdb_1BLF = new ChemDoodle.io.JSONInterpreter().pdbFrom({"ribbons":{"cs":[[{"s":false,"z1":50.446,"a":false,"y1":73.569,"y2":73.569,"z2":50.446,"x2":43.69,"h":false,"x1":43.69},{"s":false,"z1":50.446,"a":false,"y1":73.569,"y2":73.569,"z2":50.446,"x2":43.69,"h":false,"x1":43.69},{"s":false,"z1":49.673,"a":false,"y1":74.507,"n":"Asn","y2":74.771,"z2":47.536,"x2":43.974,"h":false,"x1":42.86},{"s":true,"z1":46.025,"a":false,"y1":74.113,"n":"Val","y2":75.401,"z2":45.942,"x2":39.738,"h":false,"x1":41.748},{"s":true,"z1":44.033,"a":false,"y1":77.107,"n":"Arg","y2":76.26,"z2":41.787,"x2":40.63,"h":false,"x1":40.659},{"s":true,"z1":41.646,"a":false,"y1":76.057,"n":"Trp","y2":78.24,"z2":41.405,"x2":37.026,"h":false,"x1":37.931},{"s":true,"z1":38.648,"a":true,"y1":78.228,"n":"Cys","y2":76.915,"z2":37.552,"x2":35.475,"h":false,"x1":37.184},{"s":true,"z1":37.838,"a":false,"y1":78.935,"n":"Thr","y2":81.119,"z2":36.874,"x2":33.862,"h":false,"x1":33.495},{"s":false,"z1":34.725,"a":false,"y1":80.722,"n":"Ile","y2":82.091,"z2":33.736,"x2":30.652,"h":false,"x1":32.337},{"s":false,"z1":35.878,"a":false,"y1":81.971,"n":"Ser","y2":81.291,"z2":38.18,"x2":28.966,"h":false,"x1":28.939},{"s":false,"z1":38.83,"a":false,"y1":83.117,"n":"Gln","y2":81.531,"z2":40.415,"x2":26.135,"h":true,"x1":26.835},{"s":false,"z1":38.767,"a":false,"y1":79.918,"n":"Pro","y2":78.104,"z2":40.052,"x2":25.629,"h":true,"x1":24.773},{"s":false,"z1":38.642,"a":false,"y1":77.969,"n":"Glu","y2":77.493,"z2":40.639,"x2":29.236,"h":true,"x1":28.01},{"s":false,"z1":41.4,"a":false,"y1":80.188,"n":"Trp","y2":79.543,"z2":43.709,"x2":29.248,"h":true,"x1":29.454},{"s":false,"z1":43.55,"a":false,"y1":79.636,"n":"Phe","y2":77.849,"z2":45.162,"x2":26.27,"h":true,"x1":26.387},{"s":false,"z1":43.29,"a":false,"y1":75.81,"n":"Lys","y2":74.551,"z2":44.84,"x2":28.216,"h":true,"x1":26.837},{"s":false,"z1":44.127,"a":false,"y1":76.021,"n":"Cys","y2":75.637,"z2":46.416,"x2":31.174,"h":true,"x1":30.523},{"s":false,"z1":47.201,"a":false,"y1":78.054,"n":"Arg","y2":76.925,"z2":49.254,"x2":29.258,"h":true,"x1":29.796},{"s":false,"z1":48.003,"a":false,"y1":75.537,"n":"Arg","y2":73.527,"z2":49.245,"x2":27.495,"h":true,"x1":27.071},{"s":false,"z1":47.573,"a":false,"y1":72.782,"n":"Trp","y2":72.087,"z2":49.33,"x2":31.161,"h":true,"x1":29.677},{"s":false,"z1":49.563,"a":false,"y1":74.717,"n":"Gln","y2":73.994,"z2":51.814,"x2":32.697,"h":true,"x1":32.288},{"s":false,"z1":52.735,"a":false,"y1":74.873,"n":"Trp","y2":73.023,"z2":54.243,"x2":30.112,"h":true,"x1":30.145},{"s":false,"z1":52.192,"a":false,"y1":71.28,"n":"Arg","y2":69.232,"z2":52.915,"x2":30.062,"h":true,"x1":29.002},{"s":false,"z1":52.16,"a":false,"y1":70.087,"n":"Met","y2":68.931,"z2":54.127,"x2":33.317,"h":true,"x1":32.607},{"s":false,"z1":55.502,"a":false,"y1":71.589,"n":"Lys","y2":70.216,"z2":57.21,"x2":34.925,"h":true,"x1":33.9},{"s":false,"z1":57.784,"a":true,"y1":68.872,"n":"Lys","y2":66.625,"z2":58.299,"x2":33.214,"h":true,"x1":32.521},{"s":false,"z1":55.778,"a":false,"y1":66.079,"n":"Leu","y2":65.066,"z2":55.769,"x2":36.347,"h":true,"x1":34.158},{"s":false,"z1":56.523,"a":false,"y1":67.465,"n":"Gly","y2":66.2,"z2":55.133,"x2":39.151,"h":false,"x1":37.627},{"s":false,"z1":53.762,"a":false,"y1":68.586,"n":"Ala","y2":66.719,"z2":52.358,"x2":39.341,"h":false,"x1":40.024},{"s":false,"z1":51.361,"a":false,"y1":69.916,"n":"Pro","y2":70.719,"z2":51.081,"x2":38.396,"h":false,"x1":40.662},{"s":false,"z1":51.361,"a":false,"y1":73.321,"n":"Ser","y2":73.613,"z2":49.1,"x2":39.815,"h":false,"x1":39.035},{"s":true,"z1":48.192,"a":false,"y1":74.669,"n":"Ile","y2":76.61,"z2":48.979,"x2":36.401,"h":false,"x1":37.527},{"s":true,"z1":47.03,"a":false,"y1":78.29,"n":"Thr","y2":77.569,"z2":44.812,"x2":37.083,"h":false,"x1":37.592},{"s":true,"z1":44.286,"a":false,"y1":79.584,"n":"Cys","y2":81.94,"z2":43.905,"x2":35.192,"h":false,"x1":35.302},{"s":true,"z1":41.812,"a":true,"y1":81.851,"n":"Val","y2":81.228,"z2":40.078,"x2":35.495,"h":false,"x1":37.027},{"s":true,"z1":39.543,"a":false,"y1":83.764,"n":"Arg","y2":85.292,"z2":38.353,"x2":36.108,"h":false,"x1":34.677},{"s":false,"z1":35.823,"a":false,"y1":84.209,"n":"Arg","y2":83.856,"z2":35.311,"x2":33.116,"h":false,"x1":35.427},{"s":false,"z1":32.704,"a":false,"y1":84.725,"n":"Ala","y2":83.274,"z2":31.254,"x2":32.138,"h":false,"x1":33.311},{"s":false,"z1":30.227,"a":false,"y1":82.083,"n":"Phe","y2":81.347,"z2":31.402,"x2":36.275,"h":false,"x1":34.339},{"s":false,"z1":29.799,"a":false,"y1":78.948,"n":"Ala","y2":78.887,"z2":30.498,"x2":38.752,"h":true,"x1":36.471},{"s":false,"z1":28.493,"a":false,"y1":80.642,"n":"Leu","y2":81.48,"z2":29.924,"x2":41.404,"h":true,"x1":39.632},{"s":false,"z1":31.395,"a":false,"y1":83.061,"n":"Glu","y2":82.596,"z2":33.336,"x2":40.952,"h":true,"x1":39.615},{"s":false,"z1":33.741,"a":false,"y1":80.082,"n":"Cys","y2":79.075,"z2":34.39,"x2":41.833,"h":true,"x1":39.737},{"s":false,"z1":31.653,"a":false,"y1":78.583,"n":"Ile","y2":78.985,"z2":32.43,"x2":44.71,"h":true,"x1":42.477},{"s":false,"z1":31.989,"a":false,"y1":81.77,"n":"Arg","y2":82.238,"z2":33.948,"x2":45.706,"h":true,"x1":44.41},{"s":false,"z1":35.731,"a":false,"y1":81.942,"n":"Ala","y2":81.114,"z2":37.382,"x2":45.019,"h":true,"x1":43.525},{"s":false,"z1":36.42,"a":true,"y1":78.476,"n":"Ile","y2":78.333,"z2":37.014,"x2":47.169,"h":true,"x1":44.847},{"s":false,"z1":34.336,"a":false,"y1":79.129,"n":"Ala","y2":80.061,"z2":35.459,"x2":49.919,"h":true,"x1":47.994},{"s":false,"z1":36.219,"a":false,"y1":82.345,"n":"Glu","y2":83.041,"z2":38.433,"x2":48.923,"h":false,"x1":48.599},{"s":false,"z1":39.552,"a":false,"y1":80.512,"n":"Lys","y2":81.5,"z2":41.562,"x2":47.295,"h":false,"x1":48.15},{"s":false,"z1":40.353,"a":false,"y1":82.501,"n":"Lys","y2":81.873,"z2":41.527,"x2":42.958,"h":false,"x1":44.991},{"s":false,"z1":40.276,"a":false,"y1":79.32,"n":"Ala","y2":77.984,"z2":39.646,"x2":44.876,"h":false,"x1":42.949},{"s":false,"z1":40.427,"a":false,"y1":75.578,"n":"Asp","y2":73.764,"z2":38.873,"x2":43.634,"h":false,"x1":43.722},{"s":false,"z1":38.7,"a":false,"y1":73.597,"n":"Ala","y2":75.212,"z2":38.339,"x2":39.135,"h":false,"x1":40.879},{"s":true,"z1":36.073,"a":false,"y1":73.701,"n":"Val","y2":71.706,"z2":34.96,"x2":38.86,"h":false,"x1":38.129},{"s":true,"z1":33.919,"a":true,"y1":71.1,"n":"Thr","y2":72.414,"z2":32.314,"x2":35.341,"h":false,"x1":36.404},{"s":true,"z1":30.196,"a":false,"y1":71.452,"n":"Leu","y2":69.178,"z2":29.588,"x2":36.308,"h":false,"x1":36.627},{"s":false,"z1":27.062,"a":false,"y1":69.945,"n":"Asp","y2":70.691,"z2":26.377,"x2":37.363,"h":false,"x1":35.171},{"s":false,"z1":24.669,"a":false,"y1":68.361,"n":"Gly","y2":69.377,"z2":23.684,"x2":39.683,"h":true,"x1":37.765},{"s":false,"z1":22.493,"a":false,"y1":71.451,"n":"Gly","y2":72.94,"z2":22.991,"x2":39.933,"h":true,"x1":38.157},{"s":false,"z1":25.59,"a":false,"y1":73.421,"n":"Met","y2":73.435,"z2":26.632,"x2":41.207,"h":true,"x1":39.091},{"s":false,"z1":26.827,"a":false,"y1":70.625,"n":"Val","y2":70.788,"z2":26.51,"x2":43.666,"h":true,"x1":41.267},{"s":false,"z1":23.681,"a":false,"y1":70.981,"n":"Phe","y2":72.345,"z2":23.841,"x2":45.221,"h":true,"x1":43.264},{"s":false,"z1":23.999,"a":false,"y1":74.706,"n":"Glu","y2":75.863,"z2":25.322,"x2":45.303,"h":true,"x1":43.698},{"s":false,"z1":27.649,"a":true,"y1":74.494,"n":"Ala","y2":74.255,"z2":28.557,"x2":46.824,"h":true,"x1":44.618},{"s":false,"z1":26.933,"a":false,"y1":72.111,"n":"Gly","y2":72.68,"z2":26.562,"x2":49.775,"h":true,"x1":47.475},{"s":false,"z1":24.558,"a":false,"y1":74.609,"n":"Arg","y2":75.886,"z2":26.6,"x2":49.538,"h":false,"x1":49.115},{"s":false,"z1":25.337,"a":false,"y1":77.353,"n":"Asp","y2":78.687,"z2":24.225,"x2":49.843,"h":false,"x1":51.527},{"s":false,"z1":27.294,"a":false,"y1":79.285,"n":"Pro","y2":78.929,"z2":29.654,"x2":51.42,"h":false,"x1":51.598},{"s":false,"z1":29.498,"a":false,"y1":77.61,"n":"Tyr","y2":76.387,"z2":31.291,"x2":49.945,"h":false,"x1":49.025},{"s":false,"z1":29.481,"a":false,"y1":74.14,"n":"Lys","y2":73.156,"z2":31.658,"x2":50.388,"h":false,"x1":50.545},{"s":true,"z1":31.46,"a":false,"y1":72.515,"n":"Leu","y2":70.787,"z2":29.863,"x2":47.334,"h":false,"x1":47.766},{"s":true,"z1":31.777,"a":false,"y1":68.808,"n":"Arg","y2":68.93,"z2":33.449,"x2":45.349,"h":false,"x1":47.064},{"s":true,"z1":32.448,"a":false,"y1":66.775,"n":"Pro","y2":64.87,"z2":33.334,"x2":44.973,"h":false,"x1":43.885},{"s":true,"z1":35.813,"a":false,"y1":65.277,"n":"Val","y2":63.174,"z2":36.695,"x2":43.502,"h":false,"x1":44.221},{"s":true,"z1":36.027,"a":false,"y1":63.552,"n":"Ala","y2":64.805,"z2":34.433,"x2":39.611,"h":false,"x1":40.823},{"s":true,"z1":33.603,"a":false,"y1":62.673,"n":"Ala","y2":61.483,"z2":35.102,"x2":36.622,"h":false,"x1":38.04},{"s":true,"z1":33.997,"a":true,"y1":62.466,"n":"Glu","y2":60.94,"z2":32.188,"x2":34.153,"h":false,"x1":34.298},{"s":true,"z1":33.592,"a":false,"y1":59.06,"n":"Ile","y2":59.699,"z2":34.176,"x2":30.632,"h":false,"x1":32.847},{"s":false,"z1":31.932,"a":false,"y1":58.652,"n":"Tyr","y2":56.272,"z2":32.185,"x2":29.69,"h":false,"x1":29.475},{"s":false,"z1":31.129,"a":false,"y1":55.691,"n":"Gly","y2":56.153,"z2":33.048,"x2":25.909,"h":false,"x1":27.268},{"s":false,"z1":33.633,"a":false,"y1":53.498,"n":"Thr","y2":53.03,"z2":34.552,"x2":27.597,"h":false,"x1":25.46},{"s":false,"z1":37.015,"a":false,"y1":52.141,"n":"Lys","y2":50.602,"z2":37.161,"x2":28.383,"h":false,"x1":26.514},{"s":false,"z1":35.595,"a":false,"y1":48.697,"n":"Glu","y2":47.828,"z2":33.814,"x2":28.504,"h":false,"x1":27.177},{"s":false,"z1":32.197,"a":false,"y1":49.96,"n":"Ser","y2":52.218,"z2":31.486,"x2":27.887,"h":false,"x1":28.108},{"s":false,"z1":32.456,"a":false,"y1":53.021,"n":"Pro","y2":52.284,"z2":30.414,"x2":31.282,"h":false,"x1":30.274},{"s":false,"z1":29.684,"a":false,"y1":54.81,"n":"Gln","y2":56.947,"z2":30.744,"x2":32.359,"h":false,"x1":32.063},{"s":false,"z1":29.427,"a":false,"y1":57.509,"n":"Thr","y2":58.495,"z2":27.678,"x2":35.953,"h":false,"x1":34.654},{"s":true,"z1":26.148,"a":false,"y1":58.994,"n":"His","y2":58.656,"z2":26.697,"x2":31.314,"h":false,"x1":33.589},{"s":true,"z1":24.593,"a":false,"y1":60.072,"n":"Tyr","y2":59.877,"z2":22.346,"x2":31.06,"h":false,"x1":30.341},{"s":true,"z1":21.254,"a":false,"y1":60.485,"n":"Tyr","y2":62.228,"z2":21.414,"x2":27.102,"h":false,"x1":28.687},{"s":true,"z1":19.206,"a":false,"y1":63.577,"n":"Ala","y2":62.151,"z2":17.457,"x2":27.205,"h":false,"x1":28.048},{"s":true,"z1":17.465,"a":false,"y1":63.349,"n":"Val","y2":65.703,"z2":17.542,"x2":24.084,"h":false,"x1":24.668},{"s":true,"z1":15.466,"a":false,"y1":65.508,"n":"Ala","y2":64.109,"z2":15.274,"x2":20.287,"h":false,"x1":22.246},{"s":true,"z1":16.832,"a":true,"y1":65.723,"n":"Val","y2":67.842,"z2":15.93,"x2":17.979,"h":false,"x1":18.725},{"s":true,"z1":14.576,"a":false,"y1":66.589,"n":"Val","y2":65.253,"z2":15.912,"x2":14.416,"h":false,"x1":15.882},{"s":true,"z1":15.24,"a":false,"y1":66.772,"n":"Lys","y2":65.95,"z2":13.014,"x2":12.057,"h":false,"x1":12.181},{"s":false,"z1":13.745,"a":false,"y1":63.871,"n":"Lys","y2":65.434,"z2":13.058,"x2":8.563,"h":false,"x1":10.241},{"s":false,"z1":10.44,"a":false,"y1":64.744,"n":"Gly","y2":67.13,"z2":10.139,"x2":9.002,"h":false,"x1":8.741},{"s":false,"z1":8.482,"a":false,"y1":66.755,"n":"Ser","y2":64.783,"z2":7.316,"x2":11.89,"h":false,"x1":11.254},{"s":false,"z1":4.977,"a":false,"y1":65.953,"n":"Asn","y2":65.186,"z2":3.862,"x2":14.314,"h":false,"x1":12.318},{"s":false,"z1":5.237,"a":false,"y1":66.975,"n":"Phe","y2":65.207,"z2":6.851,"x2":16.402,"h":false,"x1":15.984},{"s":false,"z1":5.74,"a":false,"y1":64.634,"n":"Gln","y2":66.659,"z2":5.968,"x2":20.029,"h":false,"x1":18.853},{"s":false,"z1":6.726,"a":false,"y1":65.29,"n":"Leu","y2":67.158,"z2":5.881,"x2":23.734,"h":false,"x1":22.439},{"s":false,"z1":3.214,"a":false,"y1":66.492,"n":"Asp","y2":68.772,"z2":2.451,"x2":22.978,"h":false,"x1":23.277},{"s":false,"z1":3.125,"a":false,"y1":68.784,"n":"Gln","y2":70.334,"z2":4.543,"x2":19.049,"h":false,"x1":20.232},{"s":false,"z1":5.961,"a":false,"y1":71.096,"n":"Leu","y2":73.406,"z2":6.387,"x2":21.832,"h":false,"x1":21.317},{"s":false,"z1":3.775,"a":false,"y1":74.066,"n":"Gln","y2":74.428,"z2":3.107,"x2":19.932,"h":false,"x1":22.186},{"s":false,"z1":4.377,"a":false,"y1":76.849,"n":"Gly","y2":76.545,"z2":5.289,"x2":17.524,"h":false,"x1":19.729},{"s":false,"z1":7.596,"a":false,"y1":75.405,"n":"Arg","y2":77.076,"z2":8.619,"x2":19.81,"h":false,"x1":18.463},{"s":false,"z1":11.087,"a":false,"y1":76.881,"n":"Lys","y2":74.884,"z2":12.398,"x2":18.371,"h":false,"x1":18.583},{"s":true,"z1":13.676,"a":false,"y1":75.129,"n":"Ser","y2":76.807,"z2":15.291,"x2":21.373,"h":false,"x1":20.725},{"s":true,"z1":17.308,"a":true,"y1":74.9,"n":"Cys","y2":73.092,"z2":17.295,"x2":22.974,"h":false,"x1":21.395},{"s":true,"z1":18.696,"a":false,"y1":74.59,"n":"His","y2":75.854,"z2":20.729,"x2":24.634,"h":false,"x1":24.883},{"s":false,"z1":22.226,"a":false,"y1":74.039,"n":"Thr","y2":75.768,"z2":23.547,"x2":27.194,"h":false,"x1":26.175},{"s":false,"z1":21.745,"a":false,"y1":76.277,"n":"Gly","y2":75.252,"z2":19.949,"x2":30.405,"h":false,"x1":29.206},{"s":false,"z1":19.508,"a":false,"y1":77.485,"n":"Leu","y2":77.094,"z2":21.103,"x2":33.701,"h":false,"x1":31.996},{"s":false,"z1":19.65,"a":false,"y1":75.023,"n":"Gly","y2":73.506,"z2":21.438,"x2":35.378,"h":false,"x1":34.812},{"s":false,"z1":21.618,"a":false,"y1":72.423,"n":"Arg","y2":71.178,"z2":19.623,"x2":32.682,"h":false,"x1":32.86},{"s":false,"z1":20.842,"a":false,"y1":68.682,"n":"Ser","y2":68.271,"z2":18.824,"x2":31.936,"h":false,"x1":33.132},{"s":false,"z1":20.188,"a":false,"y1":67.62,"n":"Ala","y2":68.616,"z2":18.434,"x2":28.249,"h":false,"x1":29.544},{"s":false,"z1":19.413,"a":false,"y1":71.125,"n":"Gly","y2":72.497,"z2":17.485,"x2":28.454,"h":false,"x1":28.441},{"s":false,"z1":17.001,"a":false,"y1":72.335,"n":"Trp","y2":71.305,"z2":14.965,"x2":31.791,"h":false,"x1":31.096},{"s":false,"z1":16.227,"a":false,"y1":70.335,"n":"Ile","y2":68.971,"z2":14.288,"x2":34.257,"h":true,"x1":34.26},{"s":false,"z1":15.499,"a":false,"y1":67.054,"n":"Ile","y2":66.7,"z2":13.253,"x2":31.934,"h":true,"x1":32.568},{"s":false,"z1":13.286,"a":false,"y1":68.341,"n":"Pro","y2":68.835,"z2":10.958,"x2":29.996,"h":true,"x1":29.705},{"s":false,"z1":11.336,"a":false,"y1":70.83,"n":"Met","y2":70.471,"z2":9.377,"x2":33.207,"h":true,"x1":31.842},{"s":false,"z1":10.235,"a":false,"y1":68.119,"n":"Gly","y2":66.666,"z2":8.324,"x2":34.202,"h":true,"x1":34.296},{"s":false,"z1":8.576,"a":false,"y1":66.33,"n":"Ile","y2":66.738,"z2":6.338,"x2":30.652,"h":true,"x1":31.443},{"s":false,"z1":6.955,"a":false,"y1":69.301,"n":"Leu","y2":70.545,"z2":4.969,"x2":30.181,"h":true,"x1":29.738},{"s":false,"z1":5.466,"a":false,"y1":70.629,"n":"Arg","y2":71.378,"z2":3.233,"x2":33.505,"h":true,"x1":33.03},{"s":false,"z1":1.962,"a":false,"y1":69.158,"n":"Pro","y2":70.508,"z2":0.291,"x2":31.375,"h":true,"x1":32.5},{"s":false,"z1":1.837,"a":true,"y1":70.827,"n":"Tyr","y2":73.048,"z2":1.45,"x2":28.427,"h":true,"x1":29.117},{"s":false,"z1":3.099,"a":false,"y1":74.109,"n":"Leu","y2":76.207,"z2":1.967,"x2":30.377,"h":true,"x1":30.476},{"s":false,"z1":-0.189,"a":false,"y1":75.249,"n":"Ser","y2":77.516,"z2":-0.025,"x2":33.062,"h":false,"x1":32.178},{"s":false,"z1":1.968,"a":false,"y1":76.812,"n":"Trp","y2":76.13,"z2":0.807,"x2":36.863,"h":false,"x1":34.868},{"s":false,"z1":0.131,"a":false,"y1":78.721,"n":"Thr","y2":80.653,"z2":1.507,"x2":37.758,"h":false,"x1":37.411},{"s":false,"z1":2.935,"a":false,"y1":79.16,"n":"Glu","y2":81.068,"z2":3.878,"x2":40.982,"h":false,"x1":39.893},{"s":false,"z1":1.418,"a":false,"y1":82.208,"n":"Ser","y2":84.476,"z2":2.243,"x2":41.383,"h":false,"x1":41.697},{"s":false,"z1":1.46,"a":false,"y1":84.576,"n":"Leu","y2":85.937,"z2":3.41,"x2":38.266,"h":false,"x1":38.698},{"s":false,"z1":4.847,"a":false,"y1":83.88,"n":"Glu","y2":81.662,"z2":5.235,"x2":38.072,"h":false,"x1":37.2},{"s":false,"z1":7.962,"a":false,"y1":81.659,"n":"Pro","y2":80.942,"z2":7.212,"x2":35.449,"h":false,"x1":37.603},{"s":false,"z1":8.81,"a":false,"y1":78.612,"n":"Leu","y2":78.734,"z2":8.725,"x2":33.106,"h":true,"x1":35.495},{"s":false,"z1":10.671,"a":false,"y1":80.82,"n":"Gln","y2":81.676,"z2":9.574,"x2":31.093,"h":true,"x1":33.041},{"s":false,"z1":7.486,"a":false,"y1":82.827,"n":"Gly","y2":82.274,"z2":5.833,"x2":30.852,"h":true,"x1":32.5},{"s":false,"z1":5.42,"a":false,"y1":79.704,"n":"Ala","y2":78.643,"z2":5.253,"x2":29.621,"h":true,"x1":31.785},{"s":false,"z1":8.058,"a":true,"y1":78.327,"n":"Val","y2":78.809,"z2":7.97,"x2":27.127,"h":true,"x1":29.499},{"s":false,"z1":8.313,"a":false,"y1":81.649,"n":"Ala","y2":81.843,"z2":7.18,"x2":25.461,"h":true,"x1":27.584},{"s":false,"z1":4.719,"a":false,"y1":81.548,"n":"Lys","y2":80.061,"z2":3.359,"x2":25.21,"h":false,"x1":26.466},{"s":false,"z1":4.871,"a":false,"y1":77.831,"n":"Phe","y2":77.298,"z2":4.656,"x2":23.405,"h":false,"x1":25.765},{"s":false,"z1":7.4,"a":false,"y1":77.741,"n":"Phe","y2":80.122,"z2":7.094,"x2":23.12,"h":false,"x1":22.922},{"s":false,"z1":7.509,"a":false,"y1":80.624,"n":"Ser","y2":82.195,"z2":8.926,"x2":21.588,"h":false,"x1":20.429},{"s":false,"z1":11.085,"a":false,"y1":81.603,"n":"Ala","y2":79.358,"z2":11.425,"x2":20.47,"h":false,"x1":19.878},{"s":true,"z1":14.008,"a":false,"y1":79.825,"n":"Ser","y2":81.664,"z2":15.562,"x2":21.617,"h":false,"x1":21.492},{"s":true,"z1":17.603,"a":true,"y1":79.966,"n":"Cys","y2":77.851,"z2":18.109,"x2":23.628,"h":false,"x1":22.564},{"s":true,"z1":18.224,"a":false,"y1":79.093,"n":"Val","y2":81.14,"z2":18.664,"x2":27.25,"h":false,"x1":26.157},{"s":false,"z1":21.479,"a":false,"y1":80.873,"n":"Pro","y2":79.953,"z2":20.991,"x2":29.284,"h":false,"x1":27.121},{"s":false,"z1":21.948,"a":false,"y1":82.388,"n":"Cys","y2":83.425,"z2":20.547,"x2":32.318,"h":false,"x1":30.654},{"s":false,"z1":18.282,"a":false,"y1":83.468,"n":"Ile","y2":85.576,"z2":19.137,"x2":29.862,"h":false,"x1":30.612},{"s":false,"z1":17.265,"a":false,"y1":87.052,"n":"Asp","y2":87.258,"z2":15.486,"x2":29.838,"h":false,"x1":31.46},{"s":false,"z1":17.394,"a":false,"y1":88.428,"n":"Arg","y2":89.613,"z2":15.576,"x2":26.894,"h":false,"x1":27.92},{"s":false,"z1":15.564,"a":false,"y1":91.605,"n":"Gln","y2":91.724,"z2":13.13,"x2":28.848,"h":false,"x1":28.918},{"s":false,"z1":12.783,"a":false,"y1":89.759,"n":"Ala","y2":88.667,"z2":10.819,"x2":29.88,"h":false,"x1":30.739},{"s":false,"z1":12.218,"a":false,"y1":86.743,"n":"Tyr","y2":85.644,"z2":13.798,"x2":26.931,"h":false,"x1":28.42},{"s":false,"z1":13.489,"a":false,"y1":87.837,"n":"Pro","y2":86.554,"z2":14.039,"x2":22.971,"h":true,"x1":24.941},{"s":false,"z1":11.685,"a":true,"y1":84.999,"n":"Asn","y2":82.898,"z2":12.634,"x2":22.466,"h":true,"x1":23.109},{"s":false,"z1":13.813,"a":false,"y1":82.511,"n":"Leu","y2":81.869,"z2":16.152,"x2":24.839,"h":true,"x1":25.007},{"s":false,"z1":16.877,"a":false,"y1":84.341,"n":"Cys","y2":85.17,"z2":17.888,"x2":21.667,"h":false,"x1":23.673},{"s":false,"z1":15.368,"a":false,"y1":85.227,"n":"Gln","y2":84.999,"z2":16.481,"x2":18.161,"h":false,"x1":20.27},{"s":false,"z1":16.913,"a":false,"y1":82.302,"n":"Leu","y2":81.554,"z2":19.101,"x2":17.819,"h":false,"x1":18.442},{"s":false,"z1":20.364,"a":false,"y1":82.834,"n":"Cys","y2":84.69,"z2":20.965,"x2":18.594,"h":false,"x1":20.007},{"s":false,"z1":23.145,"a":false,"y1":83.338,"n":"Lys","y2":84.707,"z2":25.084,"x2":17.065,"h":false,"x1":17.47},{"s":false,"z1":25.221,"a":false,"y1":85.772,"n":"Gly","y2":87.676,"z2":24.139,"x2":18.568,"h":false,"x1":19.589},{"s":false,"z1":26.429,"a":false,"y1":89.3,"n":"Glu","y2":89.593,"z2":25.992,"x2":21.139,"h":false,"x1":18.844},{"s":false,"z1":24.549,"a":false,"y1":92.017,"n":"Gly","y2":92.664,"z2":26.475,"x2":22.051,"h":false,"x1":20.771},{"s":false,"z1":24.983,"a":false,"y1":92.364,"n":"Glu","y2":91.514,"z2":26.807,"x2":25.969,"h":false,"x1":24.581},{"s":false,"z1":26.816,"a":false,"y1":89.033,"n":"Asn","y2":86.697,"z2":26.554,"x2":23.832,"h":false,"x1":24.44},{"s":false,"z1":24.036,"a":false,"y1":87.286,"n":"Gln","y2":87.528,"z2":22.936,"x2":24.713,"h":false,"x1":22.634},{"s":false,"z1":22.331,"a":false,"y1":84.645,"n":"Cys","y2":84.478,"z2":22.508,"x2":27.231,"h":false,"x1":24.816},{"s":false,"z1":25.35,"a":false,"y1":84.765,"n":"Ala","y2":82.358,"z2":25.247,"x2":27.13,"h":false,"x1":27.198},{"s":false,"z1":26.128,"a":false,"y1":82.028,"n":"Cys","y2":81.028,"z2":28.128,"x2":30.564,"h":false,"x1":29.688},{"s":false,"z1":29.3,"a":false,"y1":80.759,"n":"Ser","y2":81.006,"z2":28.493,"x2":25.79,"h":false,"x1":28.005},{"s":false,"z1":31.153,"a":false,"y1":80.098,"n":"Ser","y2":81.053,"z2":30.931,"x2":22.535,"h":false,"x1":24.763},{"s":false,"z1":30.436,"a":false,"y1":83.752,"n":"Arg","y2":84.106,"z2":29.171,"x2":21.708,"h":false,"x1":23.714},{"s":false,"z1":27.043,"a":false,"y1":82.585,"n":"Glu","y2":80.402,"z2":28.029,"x2":22.554,"h":false,"x1":22.621},{"s":false,"z1":27.69,"a":false,"y1":80.156,"n":"Pro","y2":77.866,"z2":27.023,"x2":19.682,"h":false,"x1":19.755},{"s":false,"z1":24.505,"a":false,"y1":78.333,"n":"Tyr","y2":77.002,"z2":23.524,"x2":22.313,"h":false,"x1":20.55},{"s":false,"z1":25.594,"a":false,"y1":77.671,"n":"Phe","y2":75.902,"z2":26.869,"x2":23.216,"h":false,"x1":24.148},{"s":false,"z1":26.319,"a":false,"y1":74.09,"n":"Gly","y2":73.39,"z2":24.527,"x2":23.869,"h":true,"x1":25.24},{"s":false,"z1":25.358,"a":false,"y1":70.728,"n":"Tyr","y2":70.665,"z2":24.57,"x2":21.535,"h":true,"x1":23.802},{"s":false,"z1":27.069,"a":false,"y1":71.286,"n":"Ser","y2":72.587,"z2":26.113,"x2":18.694,"h":true,"x1":20.472},{"s":false,"z1":25.825,"a":false,"y1":74.871,"n":"Gly","y2":75.29,"z2":23.746,"x2":19.236,"h":true,"x1":20.31},{"s":false,"z1":22.331,"a":false,"y1":73.51,"n":"Ala","y2":72.977,"z2":20.993,"x2":18.961,"h":true,"x1":20.87},{"s":false,"z1":22.818,"a":false,"y1":71.072,"n":"Phe","y2":71.724,"z2":22.309,"x2":15.76,"h":true,"x1":17.993},{"s":false,"z1":24.061,"a":false,"y1":73.937,"n":"Lys","y2":75.266,"z2":22.61,"x2":14.432,"h":true,"x1":15.812},{"s":false,"z1":20.82,"a":false,"y1":75.771,"n":"Cys","y2":75.612,"z2":18.925,"x2":15.039,"h":true,"x1":16.572},{"s":false,"z1":18.886,"a":true,"y1":72.814,"n":"Leu","y2":72.681,"z2":18.483,"x2":12.759,"h":true,"x1":15.144},{"s":false,"z1":21.331,"a":false,"y1":72.261,"n":"Gln","y2":73.313,"z2":21.113,"x2":10.13,"h":true,"x1":12.267},{"s":false,"z1":21.174,"a":false,"y1":75.861,"n":"Asp","y2":77.223,"z2":19.367,"x2":10.335,"h":false,"x1":11.141},{"s":false,"z1":17.381,"a":false,"y1":75.356,"n":"Gly","y2":76.946,"z2":15.66,"x2":11.544,"h":false,"x1":11.18},{"s":false,"z1":16.746,"a":false,"y1":77.945,"n":"Ala","y2":78.014,"z2":14.539,"x2":14.832,"h":false,"x1":13.855},{"s":false,"z1":14.869,"a":false,"y1":75.693,"n":"Gly","y2":73.789,"z2":15.165,"x2":14.835,"h":false,"x1":16.228},{"s":false,"z1":12.724,"a":false,"y1":72.641,"n":"Asp","y2":70.316,"z2":13.173,"x2":16.003,"h":false,"x1":15.619},{"s":true,"z1":14.269,"a":false,"y1":70.76,"n":"Val","y2":72.51,"z2":15.403,"x2":19.792,"h":false,"x1":18.546},{"s":true,"z1":17.395,"a":false,"y1":70.771,"n":"Ala","y2":68.544,"z2":17.084,"x2":21.482,"h":false,"x1":20.616},{"s":true,"z1":17.679,"a":false,"y1":69.224,"n":"Phe","y2":70.001,"z2":19.659,"x2":25.112,"h":false,"x1":24.074},{"s":true,"z1":21.174,"a":true,"y1":67.762,"n":"Val","y2":65.653,"z2":20.471,"x2":25.286,"h":false,"x1":24.438},{"s":true,"z1":22.966,"a":false,"y1":64.552,"n":"Lys","y2":63.945,"z2":22.777,"x2":23.124,"h":false,"x1":25.449},{"s":false,"z1":22.983,"a":false,"y1":61.178,"n":"Glu","y2":60.394,"z2":24.026,"x2":21.593,"h":false,"x1":23.633},{"s":false,"z1":26.415,"a":false,"y1":61.644,"n":"Thr","y2":62.869,"z2":27.548,"x2":20.287,"h":false,"x1":21.947},{"s":false,"z1":25.946,"a":false,"y1":65.208,"n":"Thr","y2":65.768,"z2":26.638,"x2":18.35,"h":true,"x1":20.605},{"s":false,"z1":24.774,"a":false,"y1":64.147,"n":"Val","y2":63.355,"z2":26.085,"x2":15.287,"h":true,"x1":17.15},{"s":false,"z1":27.548,"a":false,"y1":61.64,"n":"Phe","y2":62.094,"z2":29.684,"x2":15.875,"h":true,"x1":16.841},{"s":false,"z1":30.234,"a":true,"y1":64.147,"n":"Glu","y2":65.851,"z2":31.284,"x2":16.291,"h":true,"x1":17.609},{"s":false,"z1":28.934,"a":false,"y1":66.643,"n":"Asn","y2":66.926,"z2":29.022,"x2":12.722,"h":true,"x1":15.101},{"s":false,"z1":27.973,"a":false,"y1":64.483,"n":"Leu","y2":62.126,"z2":27.943,"x2":12.297,"h":false,"x1":12.104},{"s":false,"z1":30.757,"a":false,"y1":61.841,"n":"Pro","y2":59.55,"z2":30.267,"x2":10.919,"h":false,"x1":11.524},{"s":false,"z1":29.079,"a":false,"y1":60.165,"n":"Glu","y2":60.931,"z2":26.939,"x2":9.366,"h":false,"x1":8.598},{"s":false,"z1":25.779,"a":false,"y1":58.343,"n":"Lys","y2":59.245,"z2":23.618,"x2":8.602,"h":true,"x1":8.991},{"s":false,"z1":24.264,"a":false,"y1":60.08,"n":"Ala","y2":61.663,"z2":22.464,"x2":6.204,"h":true,"x1":5.905},{"s":false,"z1":24.037,"a":false,"y1":63.417,"n":"Asp","y2":63.854,"z2":22.357,"x2":9.385,"h":true,"x1":7.697},{"s":false,"z1":23.042,"a":false,"y1":61.576,"n":"Arg","y2":60.653,"z2":20.919,"x2":11.554,"h":true,"x1":10.875},{"s":false,"z1":20.207,"a":true,"y1":59.984,"n":"Asp","y2":60.641,"z2":17.93,"x2":8.789,"h":true,"x1":8.944},{"s":false,"z1":18.485,"a":false,"y1":63.355,"n":"Gln","y2":64.807,"z2":17.144,"x2":10.122,"h":true,"x1":8.689},{"s":true,"z1":17.805,"a":false,"y1":63.473,"n":"Tyr","y2":61.165,"z2":17.162,"x2":12.752,"h":false,"x1":12.485},{"s":true,"z1":15.565,"a":true,"y1":61.65,"n":"Glu","y2":63.087,"z2":15.933,"x2":16.934,"h":false,"x1":15.009},{"s":true,"z1":14.676,"a":false,"y1":61.302,"n":"Leu","y2":60.228,"z2":12.554,"x2":18.793,"h":false,"x1":18.715},{"s":false,"z1":11.403,"a":false,"y1":62.23,"n":"Leu","y2":61.613,"z2":11.978,"x2":22.621,"h":false,"x1":20.363},{"s":false,"z1":10.541,"a":false,"y1":59.415,"n":"Cys","y2":60.628,"z2":8.505,"x2":23.125,"h":false,"x1":22.727},{"s":false,"z1":8.48,"a":false,"y1":59.724,"n":"Leu","y2":59.908,"z2":6.102,"x2":26.094,"h":false,"x1":25.902},{"s":false,"z1":5.595,"a":false,"y1":57.627,"n":"Asn","y2":57.919,"z2":3.866,"x2":22.871,"h":false,"x1":24.532},{"s":false,"z1":5.085,"a":false,"y1":60.405,"n":"Asn","y2":59.93,"z2":4.349,"x2":19.69,"h":false,"x1":21.942},{"s":false,"z1":6.692,"a":false,"y1":58.455,"n":"Ser","y2":60.44,"z2":8.023,"x2":18.799,"h":false,"x1":19.189},{"s":false,"z1":9.983,"a":false,"y1":58.965,"n":"Arg","y2":56.644,"z2":10.486,"x2":17.09,"h":false,"x1":17.391},{"s":false,"z1":13.211,"a":false,"y1":56.944,"n":"Ala","y2":58.612,"z2":14.767,"x2":16.161,"h":false,"x1":16.872},{"s":false,"z1":16.671,"a":false,"y1":56.859,"n":"Pro","y2":56.694,"z2":17.488,"x2":17.461,"h":false,"x1":15.185},{"s":false,"z1":19.711,"a":false,"y1":58.464,"n":"Val","y2":57.737,"z2":21.114,"x2":18.753,"h":false,"x1":16.932},{"s":false,"z1":21.471,"a":false,"y1":55.178,"n":"Asp","y2":53.414,"z2":21.15,"x2":19.445,"h":false,"x1":17.841},{"s":false,"z1":18.402,"a":false,"y1":54.021,"n":"Ala","y2":54.982,"z2":16.933,"x2":21.422,"h":false,"x1":19.771},{"s":false,"z1":19.046,"a":false,"y1":56.567,"n":"Phe","y2":56.475,"z2":17.97,"x2":24.704,"h":false,"x1":22.553},{"s":false,"z1":19.13,"a":false,"y1":53.913,"n":"Lys","y2":52.749,"z2":17.419,"x2":26.572,"h":false,"x1":25.315},{"s":false,"z1":15.46,"a":false,"y1":53.375,"n":"Glu","y2":54.612,"z2":13.409,"x2":24.386,"h":false,"x1":24.597},{"s":false,"z1":14.532,"a":false,"y1":56.776,"n":"Cys","y2":59.028,"z2":15.432,"x2":23.273,"h":false,"x1":23.292},{"s":false,"z1":15.886,"a":false,"y1":59.12,"n":"His","y2":59.118,"z2":13.71,"x2":26.957,"h":false,"x1":25.956},{"s":false,"z1":14.216,"a":false,"y1":61.286,"n":"Leu","y2":60.724,"z2":13.558,"x2":30.754,"h":false,"x1":28.527},{"s":true,"z1":16.266,"a":false,"y1":60.459,"n":"Ala","y2":60.671,"z2":18.488,"x2":30.757,"h":false,"x1":31.642},{"s":true,"z1":19.677,"a":false,"y1":59.179,"n":"Gln","y2":60.263,"z2":19.605,"x2":34.859,"h":false,"x1":32.702},{"s":true,"z1":21.629,"a":true,"y1":61.953,"n":"Val","y2":61.071,"z2":23.737,"x2":33.863,"h":false,"x1":34.342},{"s":true,"z1":24.746,"a":false,"y1":61.668,"n":"Pro","y2":63.73,"z2":25.388,"x2":35.444,"h":false,"x1":36.487},{"s":false,"z1":27.972,"a":false,"y1":62.73,"n":"Ser","y2":64.262,"z2":28.207,"x2":36.78,"h":false,"x1":34.886},{"s":false,"z1":29.727,"a":false,"y1":66.089,"n":"His","y2":64.85,"z2":31.623,"x2":35.995,"h":false,"x1":35.258},{"s":true,"z1":31.99,"a":false,"y1":66.396,"n":"Ala","y2":68.758,"z2":32.38,"x2":38.3,"h":false,"x1":38.239},{"s":true,"z1":34.94,"a":false,"y1":68.458,"n":"Val","y2":67.798,"z2":34.448,"x2":41.516,"h":false,"x1":39.283},{"s":true,"z1":34.279,"a":false,"y1":70.342,"n":"Val","y2":71.868,"z2":36.124,"x2":42.55,"h":false,"x1":42.489},{"s":true,"z1":36.369,"a":true,"y1":71.614,"n":"Ala","y2":71.591,"z2":34.511,"x2":46.881,"h":false,"x1":45.35},{"s":true,"z1":36.029,"a":false,"y1":72.874,"n":"Arg","y2":70.653,"z2":36.664,"x2":49.568,"h":false,"x1":48.859},{"s":false,"z1":34.708,"a":false,"y1":70.7,"n":"Ser","y2":69.673,"z2":36.032,"x2":53.402,"h":false,"x1":51.678},{"s":false,"z1":37.344,"a":false,"y1":72.086,"n":"Val","y2":73.875,"z2":38.232,"x2":52.712,"h":false,"x1":53.989},{"s":false,"z1":40.894,"a":false,"y1":72.662,"n":"Asp","y2":73.522,"z2":41.426,"x2":50.597,"h":false,"x1":52.719},{"s":false,"z1":39.741,"a":false,"y1":71.756,"n":"Gly","y2":71.816,"z2":40.621,"x2":46.973,"h":false,"x1":49.186},{"s":false,"z1":43.203,"a":false,"y1":70.659,"n":"Lys","y2":69.302,"z2":43.537,"x2":45.929,"h":false,"x1":47.866},{"s":false,"z1":41.502,"a":false,"y1":67.402,"n":"Glu","y2":65.579,"z2":42.378,"x2":45.46,"h":true,"x1":46.735},{"s":false,"z1":44.738,"a":false,"y1":65.437,"n":"Asp","y2":65.018,"z2":45.903,"x2":44.928,"h":true,"x1":46.953},{"s":false,"z1":46.572,"a":false,"y1":67.782,"n":"Leu","y2":67.493,"z2":46.367,"x2":42.284,"h":true,"x1":44.64},{"s":false,"z1":43.524,"a":false,"y1":68.001,"n":"Ile","y2":66.551,"z2":43.505,"x2":40.521,"h":true,"x1":42.432},{"s":false,"z1":43.375,"a":false,"y1":64.25,"n":"Trp","y2":63.182,"z2":44.669,"x2":40.312,"h":true,"x1":42.049},{"s":false,"z1":47.165,"a":false,"y1":64.028,"n":"Lys","y2":63.861,"z2":47.954,"x2":39.274,"h":true,"x1":41.529},{"s":false,"z1":47.009,"a":false,"y1":66.498,"n":"Leu","y2":65.765,"z2":46.51,"x2":36.587,"h":true,"x1":38.786},{"s":false,"z1":43.958,"a":false,"y1":64.846,"n":"Leu","y2":62.992,"z2":43.869,"x2":35.767,"h":true,"x1":37.238},{"s":false,"z1":45.407,"a":false,"y1":61.421,"n":"Ser","y2":60.588,"z2":46.442,"x2":35.364,"h":true,"x1":37.344},{"s":false,"z1":48.671,"a":false,"y1":62.252,"n":"Lys","y2":62.464,"z2":48.971,"x2":33.261,"h":true,"x1":35.611},{"s":false,"z1":46.988,"a":false,"y1":64.497,"n":"Ala","y2":63.562,"z2":46.469,"x2":30.901,"h":true,"x1":33.032},{"s":false,"z1":44.617,"a":false,"y1":61.773,"n":"Gln","y2":59.965,"z2":45.203,"x2":30.552,"h":true,"x1":32.046},{"s":false,"z1":47.51,"a":true,"y1":59.355,"n":"Glu","y2":59.03,"z2":49.075,"x2":30.167,"h":true,"x1":31.961},{"s":false,"z1":49.615,"a":false,"y1":61.646,"n":"Lys","y2":62.008,"z2":49.442,"x2":27.494,"h":true,"x1":29.838},{"s":false,"z1":47.287,"a":false,"y1":63.632,"n":"Phe","y2":64.137,"z2":45.016,"x2":27.326,"h":false,"x1":27.623},{"s":false,"z1":44.137,"a":false,"y1":61.654,"n":"Gly","y2":61.909,"z2":43.959,"x2":25.527,"h":false,"x1":27.921},{"s":false,"z1":41.889,"a":false,"y1":60.073,"n":"Lys","y2":58.111,"z2":43.27,"x2":25.381,"h":false,"x1":25.353},{"s":false,"z1":44.261,"a":false,"y1":58.72,"n":"Asn","y2":57.605,"z2":46.332,"x2":23.256,"h":false,"x1":22.663},{"s":false,"z1":47.394,"a":false,"y1":59.601,"n":"Lys","y2":60.016,"z2":49.695,"x2":24.236,"h":false,"x1":24.671},{"s":false,"z1":49.319,"a":false,"y1":62.317,"n":"Ser","y2":63.182,"z2":47.727,"x2":21.206,"h":false,"x1":22.816},{"s":false,"z1":49.778,"a":false,"y1":64.212,"n":"Arg","y2":66.378,"z2":48.877,"x2":19.067,"h":false,"x1":19.573},{"s":false,"z1":50.43,"a":false,"y1":67.663,"n":"Ser","y2":69.308,"z2":48.707,"x2":21.402,"h":false,"x1":21.036},{"s":false,"z1":47.74,"a":false,"y1":68.102,"n":"Phe","y2":65.952,"z2":46.921,"x2":24.327,"h":false,"x1":23.653},{"s":false,"z1":44.242,"a":false,"y1":66.681,"n":"Gln","y2":68.474,"z2":42.865,"x2":24.913,"h":false,"x1":24.041},{"s":false,"z1":42.638,"a":false,"y1":67.198,"n":"Leu","y2":68.045,"z2":40.412,"x2":27.706,"h":false,"x1":27.488},{"s":false,"z1":39.314,"a":false,"y1":65.904,"n":"Phe","y2":65.758,"z2":38.034,"x2":24.315,"h":false,"x1":26.296},{"s":false,"z1":39.637,"a":false,"y1":67.584,"n":"Gly","y2":69.704,"z2":40.611,"x2":23.478,"h":false,"x1":22.95},{"s":false,"z1":38.612,"a":false,"y1":71.145,"n":"Ser","y2":70.75,"z2":37.656,"x2":19.921,"h":false,"x1":22.125},{"s":false,"z1":38.316,"a":false,"y1":73.502,"n":"Pro","y2":73.348,"z2":35.934,"x2":19.123,"h":false,"x1":18.974},{"s":false,"z1":35.58,"a":false,"y1":73.652,"n":"Pro","y2":76.001,"z2":35.603,"x2":16.453,"h":false,"x1":16.298},{"s":false,"z1":33.056,"a":false,"y1":76.173,"n":"Gly","y2":77.417,"z2":32.435,"x2":19.267,"h":false,"x1":17.321},{"s":false,"z1":34.071,"a":false,"y1":75.962,"n":"Gln","y2":74.233,"z2":35.545,"x2":21.806,"h":false,"x1":20.994},{"s":false,"z1":33.529,"a":false,"y1":72.442,"n":"Arg","y2":73.314,"z2":32.795,"x2":24.364,"h":false,"x1":22.268},{"s":false,"z1":33.9,"a":false,"y1":70.973,"n":"Asp","y2":72.598,"z2":33.862,"x2":27.428,"h":false,"x1":25.726},{"s":false,"z1":36.434,"a":false,"y1":73.35,"n":"Leu","y2":71.706,"z2":37.867,"x2":28.019,"h":false,"x1":27.073},{"s":false,"z1":37.249,"a":false,"y1":72.605,"n":"Leu","y2":71.252,"z2":35.962,"x2":32.284,"h":false,"x1":30.78},{"s":false,"z1":36.026,"a":false,"y1":69.036,"n":"Phe","y2":69.513,"z2":35.147,"x2":28.351,"h":false,"x1":30.52},{"s":false,"z1":33.621,"a":false,"y1":67.23,"n":"Lys","y2":66.095,"z2":35.605,"x2":27.431,"h":false,"x1":28.234},{"s":false,"z1":34.89,"a":false,"y1":66.251,"n":"Asp","y2":64.381,"z2":33.433,"x2":24.857,"h":false,"x1":24.824},{"s":false,"z1":35.659,"a":false,"y1":62.591,"n":"Ser","y2":60.885,"z2":34.475,"x2":25.603,"h":false,"x1":24.326},{"s":false,"z1":35.453,"a":false,"y1":61.852,"n":"Ala","y2":61.239,"z2":37.707,"x2":27.62,"h":false,"x1":28.02},{"s":false,"z1":37.561,"a":false,"y1":58.819,"n":"Leu","y2":58.988,"z2":39.686,"x2":29.984,"h":false,"x1":28.871},{"s":true,"z1":38.64,"a":false,"y1":60.03,"n":"Gly","y2":60.666,"z2":36.689,"x2":33.544,"h":false,"x1":32.27},{"s":true,"z1":38.076,"a":false,"y1":60.692,"n":"Phe","y2":58.865,"z2":38.92,"x2":37.204,"h":false,"x1":35.894},{"s":true,"z1":36.495,"a":true,"y1":58.582,"n":"Leu","y2":60.337,"z2":35.799,"x2":40.059,"h":false,"x1":38.563},{"s":true,"z1":37.617,"a":false,"y1":59.637,"n":"Arg","y2":58.176,"z2":36.042,"x2":43.19,"h":false,"x1":42.067},{"s":false,"z1":34.733,"a":false,"y1":60.292,"n":"Ile","y2":61.09,"z2":35.964,"x2":46.378,"h":false,"x1":44.488},{"s":false,"z1":34.701,"a":false,"y1":58.974,"n":"Pro","y2":60.964,"z2":33.396,"x2":48.574,"h":false,"x1":48.132},{"s":false,"z1":34.943,"a":false,"y1":61.636,"n":"Ser","y2":63.02,"z2":33.168,"x2":51.795,"h":false,"x1":50.925},{"s":false,"z1":31.488,"a":false,"y1":60.993,"n":"Lys","y2":61.699,"z2":29.256,"x2":51.788,"h":false,"x1":52.398},{"s":false,"z1":29.7,"a":false,"y1":61.496,"n":"Val","y2":63.572,"z2":30.667,"x2":48.448,"h":false,"x1":49.079},{"s":false,"z1":28.379,"a":false,"y1":64.986,"n":"Asp","y2":64.179,"z2":27.335,"x2":46.845,"h":false,"x1":48.849},{"s":false,"z1":26.693,"a":false,"y1":66.846,"n":"Ser","y2":65.947,"z2":24.868,"x2":44.768,"h":true,"x1":45.993},{"s":false,"z1":23.249,"a":false,"y1":65.589,"n":"Ala","y2":63.539,"z2":22.532,"x2":45.977,"h":true,"x1":46.985},{"s":false,"z1":24.486,"a":false,"y1":61.996,"n":"Leu","y2":60.48,"z2":24.567,"x2":45.55,"h":true,"x1":47.42},{"s":false,"z1":26.377,"a":true,"y1":62.168,"n":"Tyr","y2":61.394,"z2":25.208,"x2":42.178,"h":true,"x1":44.125},{"s":false,"z1":23.334,"a":false,"y1":63.479,"n":"Leu","y2":62.006,"z2":21.638,"x2":41.523,"h":true,"x1":42.312},{"s":false,"z1":20.994,"a":false,"y1":61.036,"n":"Gly","y2":62.565,"z2":19.22,"x2":43.363,"h":false,"x1":43.97},{"s":false,"z1":17.361,"a":false,"y1":61.286,"n":"Ser","y2":62.21,"z2":15.469,"x2":44.118,"h":true,"x1":45.236},{"s":false,"z1":15.865,"a":false,"y1":60.651,"n":"Arg","y2":62.595,"z2":15.006,"x2":40.633,"h":true,"x1":41.774},{"s":false,"z1":17.588,"a":false,"y1":63.641,"n":"Tyr","y2":65.84,"z2":16.801,"x2":40.644,"h":true,"x1":40.174},{"s":false,"z1":17.203,"a":false,"y1":65.497,"n":"Leu","y2":66.947,"z2":15.413,"x2":43.919,"h":true,"x1":43.428},{"s":false,"z1":13.478,"a":false,"y1":65.038,"n":"Thr","y2":67.042,"z2":12.456,"x2":42.663,"h":true,"x1":43.383},{"s":false,"z1":12.984,"a":false,"y1":66.354,"n":"Thr","y2":68.68,"z2":12.7,"x2":39.317,"h":true,"x1":39.826},{"s":false,"z1":15.209,"a":false,"y1":69.369,"n":"Leu","y2":71.382,"z2":14.15,"x2":41.272,"h":true,"x1":40.492},{"s":false,"z1":13.593,"a":false,"y1":70.239,"n":"Lys","y2":71.365,"z2":11.507,"x2":44.045,"h":true,"x1":43.784},{"s":false,"z1":10.102,"a":false,"y1":69.524,"n":"Asn","y2":71.115,"z2":8.611,"x2":41.459,"h":true,"x1":42.434},{"s":false,"z1":10.574,"a":true,"y1":72.267,"n":"Leu","y2":74.583,"z2":10.028,"x2":40.167,"h":true,"x1":39.849},{"s":false,"z1":11.335,"a":false,"y1":74.618,"n":"Arg","y2":75.879,"z2":9.812,"x2":44.073,"h":true,"x1":42.68},{"s":false,"z1":8.111,"a":false,"y1":73.735,"n":"Glu","y2":73.644,"z2":6.963,"x2":42.398,"h":false,"x1":44.501},{"s":false,"z1":4.501,"a":false,"y1":73.903,"n":"Thr","y2":71.596,"z2":4.495,"x2":44.11,"h":false,"x1":43.479},{"s":false,"z1":2.151,"a":false,"y1":71.073,"n":"Ala","y2":69.396,"z2":1.662,"x2":44.194,"h":true,"x1":42.606},{"s":false,"z1":0.468,"a":false,"y1":71.217,"n":"Glu","y2":70.144,"z2":1.245,"x2":47.895,"h":true,"x1":45.923},{"s":false,"z1":3.779,"a":false,"y1":71.359,"n":"Glu","y2":69.307,"z2":4.749,"x2":48.546,"h":true,"x1":47.779},{"s":false,"z1":4.919,"a":false,"y1":68.361,"n":"Val","y2":66.222,"z2":4.429,"x2":46.801,"h":true,"x1":45.829},{"s":false,"z1":1.598,"a":false,"y1":66.622,"n":"Lys","y2":65.119,"z2":1.638,"x2":48.348,"h":true,"x1":46.467},{"s":false,"z1":1.86,"a":false,"y1":67.318,"n":"Ala","y2":65.918,"z2":3.035,"x2":51.76,"h":true,"x1":50.218},{"s":false,"z1":5.476,"a":false,"y1":66.163,"n":"Arg","y2":63.948,"z2":5.97,"x2":51.099,"h":true,"x1":50.343},{"s":false,"z1":4.624,"a":true,"y1":62.723,"n":"Tyr","y2":60.918,"z2":3.811,"x2":50.341,"h":true,"x1":48.99},{"s":false,"z1":1.709,"a":false,"y1":62.417,"n":"Thr","y2":61.425,"z2":1.934,"x2":53.531,"h":true,"x1":51.349},{"s":false,"z1":3.651,"a":false,"y1":63.384,"n":"Arg","y2":62.088,"z2":5.498,"x2":53.592,"h":false,"x1":54.438},{"s":true,"z1":6.095,"a":false,"y1":61.089,"n":"Val","y2":62.404,"z2":6.656,"x2":58.012,"h":false,"x1":56.086},{"s":true,"z1":9.23,"a":false,"y1":62.616,"n":"Val","y2":60.851,"z2":10.809,"x2":57.596,"h":false,"x1":57.373},{"s":true,"z1":10.585,"a":false,"y1":60.758,"n":"Trp","y2":62.541,"z2":12.027,"x2":61.018,"h":false,"x1":60.345},{"s":true,"z1":14.288,"a":false,"y1":61.028,"n":"Cys","y2":59.625,"z2":14.49,"x2":63.258,"h":false,"x1":61.248},{"s":true,"z1":15.101,"a":true,"y1":61.788,"n":"Ala","y2":62.791,"z2":17.264,"x2":64.709,"h":false,"x1":64.911},{"s":true,"z1":18.558,"a":false,"y1":61.096,"n":"Val","y2":61.365,"z2":18.233,"x2":68.794,"h":false,"x1":66.396},{"s":false,"z1":19.386,"a":false,"y1":63.753,"n":"Gly","y2":64.475,"z2":17.057,"x2":68.768,"h":false,"x1":68.956},{"s":false,"z1":17.505,"a":false,"y1":66.45,"n":"Pro","y2":66.402,"z2":15.104,"x2":71.245,"h":true,"x1":70.998},{"s":false,"z1":15.154,"a":false,"y1":64.242,"n":"Glu","y2":63.596,"z2":12.962,"x2":72.333,"h":true,"x1":73.095},{"s":false,"z1":14.048,"a":false,"y1":62.266,"n":"Glu","y2":62.919,"z2":12.131,"x2":68.794,"h":true,"x1":70.065},{"s":false,"z1":13.267,"a":false,"y1":65.468,"n":"Gln","y2":66.263,"z2":10.986,"x2":68.171,"h":true,"x1":68.186},{"s":false,"z1":10.996,"a":false,"y1":66.588,"n":"Lys","y2":66.06,"z2":8.674,"x2":71.046,"h":true,"x1":71.034},{"s":false,"z1":9.155,"a":false,"y1":63.332,"n":"Lys","y2":63.112,"z2":7.277,"x2":69.482,"h":true,"x1":70.93},{"s":false,"z1":8.849,"a":false,"y1":63.538,"n":"Cys","y2":64.564,"z2":6.936,"x2":66.137,"h":true,"x1":67.175},{"s":false,"z1":7.506,"a":false,"y1":67.089,"n":"Gln","y2":67.577,"z2":5.175,"x2":67.542,"h":true,"x1":67.334},{"s":false,"z1":4.888,"a":false,"y1":65.954,"n":"Gln","y2":65.234,"z2":2.768,"x2":68.999,"h":true,"x1":69.824},{"s":false,"z1":3.97,"a":false,"y1":63.148,"n":"Trp","y2":63.621,"z2":2.178,"x2":65.979,"h":true,"x1":67.462},{"s":false,"z1":3.776,"a":false,"y1":65.527,"n":"Ser","y2":66.378,"z2":1.569,"x2":63.907,"h":true,"x1":64.502},{"s":false,"z1":1.41,"a":true,"y1":67.957,"n":"Gln","y2":67.546,"z2":-0.946,"x2":66.206,"h":true,"x1":66.271},{"s":false,"z1":-0.669,"a":false,"y1":65.085,"n":"Gln","y2":63.988,"z2":-2.351,"x2":66.268,"h":true,"x1":67.562},{"s":false,"z1":-0.665,"a":false,"y1":63.516,"n":"Ser","y2":64.075,"z2":-1.71,"x2":62.074,"h":false,"x1":64.11},{"s":false,"z1":-1.906,"a":false,"y1":66.809,"n":"Gly","y2":67.326,"z2":-1.644,"x2":60.342,"h":false,"x1":62.668},{"s":false,"z1":1.241,"a":false,"y1":67.123,"n":"Gln","y2":66.271,"z2":1.639,"x2":58.392,"h":false,"x1":60.591},{"s":false,"z1":0.769,"a":false,"y1":63.693,"n":"Asn","y2":62.515,"z2":2.62,"x2":58.002,"h":false,"x1":59.029},{"s":true,"z1":4.223,"a":false,"y1":62.837,"n":"Val","y2":65.012,"z2":4.484,"x2":61.268,"h":false,"x1":60.328},{"s":true,"z1":6.986,"a":false,"y1":65.45,"n":"Thr","y2":63.82,"z2":8.703,"x2":60.307,"h":false,"x1":60.006},{"s":true,"z1":10.427,"a":false,"y1":65.447,"n":"Cys","y2":67.127,"z2":11.58,"x2":60.385,"h":false,"x1":61.667},{"s":true,"z1":14.002,"a":false,"y1":65.726,"n":"Ala","y2":64.203,"z2":14.617,"x2":62.364,"h":false,"x1":60.643},{"s":true,"z1":16.882,"a":true,"y1":65.467,"n":"Thr","y2":66.347,"z2":18.761,"x2":61.813,"h":false,"x1":62.99},{"s":true,"z1":20.427,"a":false,"y1":64.351,"n":"Ala","y2":63.607,"z2":20.275,"x2":65.047,"h":false,"x1":62.767},{"s":false,"z1":22.918,"a":false,"y1":63.966,"n":"Ser","y2":62.028,"z2":23.545,"x2":66.87,"h":false,"x1":65.586},{"s":false,"z1":23.73,"a":false,"y1":60.356,"n":"Thr","y2":60.25,"z2":22.083,"x2":62.973,"h":false,"x1":64.701},{"s":false,"z1":21.93,"a":false,"y1":57.439,"n":"Thr","y2":57.284,"z2":21.521,"x2":60.816,"h":true,"x1":63.165},{"s":false,"z1":24.285,"a":false,"y1":57.375,"n":"Asp","y2":58.448,"z2":23.583,"x2":58.157,"h":true,"x1":60.228},{"s":false,"z1":23.42,"a":false,"y1":61.009,"n":"Asp","y2":61.538,"z2":21.641,"x2":57.939,"h":true,"x1":59.433},{"s":false,"z1":19.796,"a":false,"y1":60.068,"n":"Cys","y2":59.336,"z2":18.631,"x2":57.55,"h":true,"x1":59.494},{"s":false,"z1":20.468,"a":false,"y1":57.274,"n":"Ile","y2":57.822,"z2":19.956,"x2":54.733,"h":true,"x1":56.997},{"s":false,"z1":22.118,"a":false,"y1":59.762,"n":"Val","y2":60.846,"z2":20.77,"x2":53.113,"h":true,"x1":54.739},{"s":false,"z1":19.074,"a":false,"y1":62.027,"n":"Leu","y2":61.858,"z2":17.127,"x2":53.573,"h":true,"x1":54.993},{"s":false,"z1":16.809,"a":false,"y1":59.124,"n":"Val","y2":58.967,"z2":16.257,"x2":51.727,"h":true,"x1":54.058},{"s":false,"z1":19.045,"a":true,"y1":58.446,"n":"Leu","y2":59.553,"z2":18.655,"x2":48.987,"h":true,"x1":51.095},{"s":false,"z1":18.835,"a":false,"y1":62.119,"n":"Lys","y2":63.313,"z2":17.082,"x2":49.043,"h":true,"x1":50.123},{"s":false,"z1":15.082,"a":false,"y1":62.074,"n":"Gly","y2":63.532,"z2":13.395,"x2":51.234,"h":false,"x1":50.385},{"s":false,"z1":15.133,"a":false,"y1":64.693,"n":"Glu","y2":64.897,"z2":13.4,"x2":54.801,"h":false,"x1":53.131},{"s":false,"z1":13.629,"a":false,"y1":62.196,"n":"Ala","y2":60.575,"z2":13.6,"x2":53.782,"h":false,"x1":55.555},{"s":false,"z1":11.457,"a":false,"y1":59.179,"n":"Asp","y2":56.87,"z2":12.12,"x2":54.906,"h":false,"x1":54.815},{"s":true,"z1":12.075,"a":false,"y1":56.702,"n":"Ala","y2":58.121,"z2":12.505,"x2":59.575,"h":false,"x1":57.653},{"s":true,"z1":13.304,"a":false,"y1":55.741,"n":"Leu","y2":53.372,"z2":13.623,"x2":60.647,"h":false,"x1":61.128},{"s":true,"z1":13.288,"a":true,"y1":52.631,"n":"Asn","y2":53.258,"z2":15.427,"x2":64.253,"h":false,"x1":63.347},{"s":true,"z1":16.733,"a":false,"y1":50.989,"n":"Leu","y2":48.674,"z2":16.399,"x2":63.943,"h":false,"x1":63.603},{"s":false,"z1":18.794,"a":false,"y1":48.419,"n":"Asp","y2":48.321,"z2":19.899,"x2":63.38,"h":false,"x1":65.502},{"s":false,"z1":19.923,"a":false,"y1":45.45,"n":"Gly","y2":45.488,"z2":21.428,"x2":61.544,"h":true,"x1":63.374},{"s":false,"z1":23.561,"a":false,"y1":46.522,"n":"Gly","y2":47.984,"z2":24.393,"x2":61.253,"h":true,"x1":63.005},{"s":false,"z1":22.421,"a":false,"y1":49.844,"n":"Tyr","y2":50.214,"z2":21.833,"x2":59.333,"h":true,"x1":61.629},{"s":false,"z1":20.025,"a":false,"y1":47.982,"n":"Ile","y2":47.626,"z2":20.593,"x2":57.053,"h":true,"x1":59.357},{"s":false,"z1":23.044,"a":false,"y1":46.346,"n":"Tyr","y2":47.334,"z2":23.894,"x2":55.714,"h":true,"x1":57.751},{"s":false,"z1":24.465,"a":false,"y1":49.764,"n":"Thr","y2":50.732,"z2":23.869,"x2":54.93,"h":true,"x1":57.016},{"s":false,"z1":21.149,"a":false,"y1":51.001,"n":"Ala","y2":50.698,"z2":20.411,"x2":53.385,"h":true,"x1":55.672},{"s":false,"z1":20.639,"a":false,"y1":47.909,"n":"Gly","y2":47.803,"z2":21.473,"x2":51.277,"h":true,"x1":53.511},{"s":false,"z1":24.083,"a":true,"y1":48.351,"n":"Lys","y2":49.926,"z2":24.937,"x2":50.435,"h":true,"x1":52.04},{"s":false,"z1":22.939,"a":false,"y1":51.791,"n":"Cys","y2":52.643,"z2":21.107,"x2":49.752,"h":true,"x1":51.004},{"s":false,"z1":19.794,"a":false,"y1":50.272,"n":"Gly","y2":50.454,"z2":17.443,"x2":49.592,"h":false,"x1":49.646},{"s":false,"z1":17.127,"a":false,"y1":50.972,"n":"Leu","y2":48.618,"z2":17.213,"x2":52.691,"h":false,"x1":52.281},{"s":true,"z1":14.542,"a":false,"y1":48.282,"n":"Val","y2":49.375,"z2":13.331,"x2":54.578,"h":false,"x1":52.861},{"s":true,"z1":12.759,"a":false,"y1":46.986,"n":"Pro","y2":46.632,"z2":10.817,"x2":54.585,"h":false,"x1":55.939},{"s":true,"z1":9.141,"a":false,"y1":47.914,"n":"Val","y2":46.443,"z2":7.43,"x2":57.105,"h":false,"x1":56.346},{"s":true,"z1":7.931,"a":false,"y1":46.951,"n":"Leu","y2":47.607,"z2":9.838,"x2":61.062,"h":false,"x1":59.773},{"s":true,"z1":9.599,"a":false,"y1":45.379,"n":"Ala","y2":45.504,"z2":7.635,"x2":64.154,"h":false,"x1":62.804},{"s":true,"z1":9.123,"a":false,"y1":46.021,"n":"Glu","y2":43.681,"z2":9.519,"x2":66.942,"h":false,"x1":66.515},{"s":true,"z1":7.067,"a":true,"y1":43.351,"n":"Asn","y2":44.521,"z2":5.654,"x2":69.726,"h":false,"x1":68.195},{"s":true,"z1":6.692,"a":false,"y1":43.15,"n":"Arg","y2":41.19,"z2":5.358,"x2":71.478,"h":false,"x1":71.974},{"s":false,"z1":4.615,"a":false,"y1":40.834,"n":"Lys","y2":39.4,"z2":6.529,"x2":74.707,"h":false,"x1":74.225},{"s":false,"z1":5.307,"a":false,"y1":37.112,"n":"Ser","y2":36.807,"z2":4.126,"x2":75.751,"h":false,"x1":73.645},{"s":false,"z1":4.889,"a":false,"y1":34.144,"n":"Ser","y2":32.8,"z2":2.939,"x2":76.448,"h":false,"x1":75.969},{"s":false,"z1":2.452,"a":false,"y1":32.238,"n":"Lys","y2":32.796,"z2":0.113,"x2":74.139,"h":false,"x1":73.748},{"s":false,"z1":-0.182,"a":false,"y1":34.242,"n":"His","y2":36.339,"z2":0.016,"x2":72.932,"h":false,"x1":71.734},{"s":false,"z1":-2.939,"a":false,"y1":36.564,"n":"Ser","y2":37.662,"z2":-4.838,"x2":71.687,"h":false,"x1":72.8},{"s":false,"z1":-4.945,"a":false,"y1":35.276,"n":"Ser","y2":36.908,"z2":-5.526,"x2":68.198,"h":false,"x1":69.872},{"s":false,"z1":-3.019,"a":false,"y1":36.375,"n":"Leu","y2":38.003,"z2":-2.028,"x2":68.293,"h":false,"x1":66.829},{"s":false,"z1":-2.83,"a":false,"y1":40.174,"n":"Asp","y2":39.776,"z2":-0.695,"x2":65.586,"h":false,"x1":66.554},{"s":false,"z1":0.55,"a":false,"y1":41.766,"n":"Cys","y2":41.874,"z2":2.376,"x2":65.797,"h":false,"x1":67.358},{"s":false,"z1":0.711,"a":false,"y1":43.162,"n":"Val","y2":41.932,"z2":1.889,"x2":62.094,"h":false,"x1":63.805},{"s":false,"z1":0.267,"a":false,"y1":39.713,"n":"Leu","y2":37.657,"z2":1.519,"x2":62.466,"h":false,"x1":62.335},{"s":false,"z1":2.247,"a":false,"y1":38.039,"n":"Arg","y2":39.362,"z2":4.222,"x2":64.682,"h":false,"x1":65.13},{"s":false,"z1":5.912,"a":false,"y1":37.04,"n":"Pro","y2":37.465,"z2":6.443,"x2":66.792,"h":false,"x1":64.471},{"s":false,"z1":8.873,"a":false,"y1":38.698,"n":"Thr","y2":36.574,"z2":9.908,"x2":65.978,"h":false,"x1":66.108},{"s":false,"z1":10.838,"a":false,"y1":36.618,"n":"Glu","y2":35.961,"z2":13.136,"x2":68.332,"h":false,"x1":68.488},{"s":false,"z1":14.118,"a":false,"y1":38.457,"n":"Gly","y2":38,"z2":14.033,"x2":71.06,"h":false,"x1":68.721},{"s":true,"z1":16.01,"a":false,"y1":39.663,"n":"Tyr","y2":38.497,"z2":17.963,"x2":71.127,"h":false,"x1":71.741},{"s":true,"z1":18.677,"a":false,"y1":38.018,"n":"Leu","y2":39.873,"z2":19.617,"x2":74.942,"h":false,"x1":73.784},{"s":true,"z1":22.107,"a":false,"y1":39.602,"n":"Ala","y2":37.904,"z2":23.248,"x2":75.014,"h":false,"x1":73.739},{"s":true,"z1":23.745,"a":false,"y1":39.544,"n":"Val","y2":41.547,"z2":25.117,"x2":77.094,"h":false,"x1":77.181},{"s":true,"z1":26.931,"a":true,"y1":40.486,"n":"Ala","y2":39.389,"z2":26.764,"x2":81.221,"h":false,"x1":79.078},{"s":true,"z1":26.079,"a":false,"y1":41.797,"n":"Val","y2":43.383,"z2":27.888,"x2":82.965,"h":false,"x1":82.54},{"s":true,"z1":28.333,"a":true,"y1":42.406,"n":"Val","y2":42.191,"z2":26.472,"x2":87.045,"h":false,"x1":85.532},{"s":true,"z1":27.896,"a":false,"y1":43.2,"n":"Lys","y2":41.308,"z2":29.352,"x2":89.44,"h":false,"x1":89.252},{"s":false,"z1":27.777,"a":false,"y1":40.071,"n":"Lys","y2":39.211,"z2":29.832,"x2":92.35,"h":false,"x1":91.449},{"s":false,"z1":30.237,"a":false,"y1":41.634,"n":"Ala","y2":42.062,"z2":32.597,"x2":94.021,"h":false,"x1":93.913},{"s":false,"z1":33.144,"a":false,"y1":41.397,"n":"Asn","y2":39.751,"z2":33.261,"x2":89.781,"h":false,"x1":91.473},{"s":false,"z1":33.767,"a":false,"y1":37.698,"n":"Glu","y2":38.253,"z2":36.057,"x2":91.103,"h":false,"x1":91.681},{"s":false,"z1":36.312,"a":false,"y1":36.117,"n":"Gly","y2":36.819,"z2":37.193,"x2":87.242,"h":false,"x1":89.386},{"s":false,"z1":34.868,"a":false,"y1":37.958,"n":"Leu","y2":36.71,"z2":32.928,"x2":85.834,"h":false,"x1":86.479},{"s":false,"z1":34.227,"a":false,"y1":35.422,"n":"Thr","y2":37.094,"z2":35.052,"x2":82.287,"h":false,"x1":83.807},{"s":false,"z1":34.129,"a":false,"y1":35.704,"n":"Trp","y2":36.445,"z2":36.083,"x2":78.677,"h":false,"x1":79.97},{"s":false,"z1":37.786,"a":false,"y1":34.522,"n":"Asn","y2":36.09,"z2":39.597,"x2":79.869,"h":true,"x1":79.947},{"s":false,"z1":38.986,"a":true,"y1":37.226,"n":"Ser","y2":39.477,"z2":38.279,"x2":82.791,"h":true,"x1":82.332},{"s":false,"z1":37.624,"a":false,"y1":40.06,"n":"Leu","y2":42.268,"z2":38.216,"x2":79.512,"h":true,"x1":80.154},{"s":false,"z1":40.816,"a":false,"y1":41.632,"n":"Lys","y2":42.244,"z2":41.341,"x2":81.063,"h":false,"x1":78.827},{"s":false,"z1":41.798,"a":false,"y1":44.988,"n":"Asp","y2":46.095,"z2":41.247,"x2":82.353,"h":false,"x1":80.286},{"s":false,"z1":38.561,"a":false,"y1":45.494,"n":"Lys","y2":47.068,"z2":38.135,"x2":80.392,"h":false,"x1":82.128},{"s":true,"z1":36.235,"a":false,"y1":48.411,"n":"Lys","y2":47.067,"z2":34.266,"x2":81.6,"h":false,"x1":81.662},{"s":true,"z1":33.378,"a":false,"y1":47.981,"n":"Ser","y2":50.296,"z2":32.788,"x2":78.868,"h":false,"x1":79.215},{"s":true,"z1":30.045,"a":true,"y1":49.647,"n":"Cys","y2":47.87,"z2":28.893,"x2":77.334,"h":false,"x1":78.494},{"s":true,"z1":28.465,"a":false,"y1":49.345,"n":"His","y2":51.457,"z2":27.448,"x2":75.207,"h":false,"x1":75.061},{"s":false,"z1":25.112,"a":false,"y1":50.675,"n":"Thr","y2":52.955,"z2":24.996,"x2":72.998,"h":false,"x1":73.83},{"s":false,"z1":26.967,"a":false,"y1":52.262,"n":"Ala","y2":50.081,"z2":27.544,"x2":69.951,"h":false,"x1":70.818},{"s":false,"z1":29.272,"a":false,"y1":51.139,"n":"Val","y2":51.495,"z2":27.278,"x2":66.703,"h":false,"x1":68.007},{"s":false,"z1":27.755,"a":false,"y1":49.058,"n":"Asp","y2":48.209,"z2":25.618,"x2":64.729,"h":false,"x1":65.156},{"s":false,"z1":24.794,"a":false,"y1":48.067,"n":"Arg","y2":46.154,"z2":26.073,"x2":67.721,"h":false,"x1":67.251},{"s":false,"z1":23.846,"a":false,"y1":44.414,"n":"Thr","y2":43.282,"z2":25.448,"x2":69.075,"h":false,"x1":67.66},{"s":false,"z1":23.944,"a":false,"y1":43.836,"n":"Ala","y2":43.914,"z2":25.985,"x2":72.732,"h":false,"x1":71.447},{"s":false,"z1":26.373,"a":false,"y1":46.582,"n":"Gly","y2":46.839,"z2":28.705,"x2":72.063,"h":false,"x1":72.383},{"s":false,"z1":28.798,"a":false,"y1":46.076,"n":"Trp","y2":44.14,"z2":30.103,"x2":69.055,"h":false,"x1":69.544},{"s":false,"z1":28.521,"a":false,"y1":43.418,"n":"Asn","y2":41.296,"z2":29.62,"x2":66.876,"h":true,"x1":66.759},{"s":false,"z1":27.998,"a":false,"y1":40.334,"n":"Ile","y2":39.212,"z2":30.005,"x2":69.543,"h":true,"x1":68.952},{"s":false,"z1":30.679,"a":false,"y1":40.796,"n":"Pro","y2":40.326,"z2":32.948,"x2":71.202,"h":true,"x1":71.685},{"s":false,"z1":33.319,"a":false,"y1":42.541,"n":"Met","y2":41.317,"z2":34.827,"x2":68.183,"h":true,"x1":69.55},{"s":false,"z1":32.754,"a":false,"y1":40.063,"n":"Gly","y2":38.143,"z2":34.214,"x2":66.674,"h":true,"x1":66.707},{"s":false,"z1":33.197,"a":false,"y1":37.203,"n":"Leu","y2":36.372,"z2":35.429,"x2":69.725,"h":true,"x1":69.187},{"s":false,"z1":36.255,"a":false,"y1":38.827,"n":"Ile","y2":38.273,"z2":38.446,"x2":70.044,"h":true,"x1":70.831},{"s":false,"z1":37.996,"a":false,"y1":39.491,"n":"Val","y2":37.848,"z2":39.525,"x2":66.686,"h":true,"x1":67.511},{"s":false,"z1":37.448,"a":false,"y1":35.907,"n":"Asn","y2":34.161,"z2":38.935,"x2":67.097,"h":true,"x1":66.566},{"s":false,"z1":38.754,"a":true,"y1":34.614,"n":"Gln","y2":34.327,"z2":41.014,"x2":70.584,"h":true,"x1":69.817},{"s":false,"z1":41.724,"a":false,"y1":36.884,"n":"Thr","y2":36.195,"z2":43.628,"x2":68.761,"h":true,"x1":69.974},{"s":false,"z1":42.368,"a":false,"y1":36.346,"n":"Gly","y2":37.614,"z2":44.087,"x2":65.203,"h":false,"x1":66.32},{"s":false,"z1":43.077,"a":false,"y1":40.007,"n":"Ser","y2":40.626,"z2":40.805,"x2":65.916,"h":false,"x1":66.073},{"s":false,"z1":41.378,"a":false,"y1":43.15,"n":"Cys","y2":45.443,"z2":40.853,"x2":65.297,"h":false,"x1":64.802},{"s":false,"z1":42.556,"a":false,"y1":45.586,"n":"Ala","y2":45.427,"z2":42.104,"x2":69.854,"h":false,"x1":67.488},{"s":false,"z1":39.342,"a":false,"y1":45.873,"n":"Phe","y2":47.109,"z2":38.924,"x2":71.577,"h":true,"x1":69.533},{"s":false,"z1":40.459,"a":true,"y1":49.314,"n":"Asp","y2":49.609,"z2":41.335,"x2":72.762,"h":true,"x1":70.579},{"s":false,"z1":43.193,"a":false,"y1":47.698,"n":"Glu","y2":45.846,"z2":43.647,"x2":73.98,"h":true,"x1":72.555},{"s":false,"z1":41.098,"a":false,"y1":44.886,"n":"Phe","y2":44.635,"z2":41.47,"x2":76.433,"h":false,"x1":74.081},{"s":false,"z1":39.472,"a":false,"y1":46.514,"n":"Phe","y2":48.273,"z2":40.972,"x2":76.441,"h":false,"x1":77.066},{"s":false,"z1":41.442,"a":false,"y1":49.056,"n":"Ser","y2":51.375,"z2":41.518,"x2":78.421,"h":false,"x1":79.07},{"s":true,"z1":38.792,"a":false,"y1":51.76,"n":"Gln","y2":50.462,"z2":36.857,"x2":79.202,"h":false,"x1":78.744},{"s":true,"z1":35.299,"a":true,"y1":51.73,"n":"Ser","y2":54.09,"z2":35.074,"x2":77.234,"h":false,"x1":77.392},{"s":true,"z1":32.325,"a":false,"y1":53.808,"n":"Cys","y2":52.353,"z2":30.584,"x2":75.81,"h":false,"x1":76.635},{"s":false,"z1":31.149,"a":false,"y1":52.883,"n":"Ala","y2":54.465,"z2":31.833,"x2":71.627,"h":false,"x1":73.201},{"s":false,"z1":29.36,"a":false,"y1":55.962,"n":"Pro","y2":54.721,"z2":28.917,"x2":69.805,"h":false,"x1":71.788},{"s":false,"z1":30.35,"a":false,"y1":56.363,"n":"Gly","y2":56.177,"z2":32.142,"x2":66.59,"h":false,"x1":68.17},{"s":false,"z1":34.098,"a":false,"y1":55.746,"n":"Ala","y2":58.18,"z2":34.127,"x2":68.504,"h":false,"x1":68.476},{"s":false,"z1":36.92,"a":false,"y1":58.351,"n":"Asp","y2":57.97,"z2":37.37,"x2":70.65,"h":false,"x1":68.325},{"s":false,"z1":36.432,"a":false,"y1":60.633,"n":"Pro","y2":60.753,"z2":37.91,"x2":73.313,"h":false,"x1":71.418},{"s":false,"z1":40.14,"a":false,"y1":60.852,"n":"Lys","y2":59.301,"z2":41.831,"x2":72.398,"h":false,"x1":71.721},{"s":false,"z1":40.442,"a":false,"y1":57.071,"n":"Ser","y2":57.168,"z2":39.213,"x2":73.667,"h":false,"x1":71.614},{"s":false,"z1":40.156,"a":false,"y1":54.729,"n":"Arg","y2":53.638,"z2":38.328,"x2":75.827,"h":false,"x1":74.633},{"s":false,"z1":36.661,"a":false,"y1":53.504,"n":"Leu","y2":54.223,"z2":34.408,"x2":74.102,"h":false,"x1":73.556},{"s":false,"z1":35.225,"a":false,"y1":56.824,"n":"Cys","y2":58.023,"z2":34.698,"x2":76.45,"h":false,"x1":74.447},{"s":false,"z1":37.271,"a":false,"y1":57.139,"n":"Ala","y2":57.964,"z2":36.536,"x2":79.839,"h":false,"x1":77.687},{"s":false,"z1":34.362,"a":false,"y1":56.281,"n":"Leu","y2":56.813,"z2":32.059,"x2":80.454,"h":false,"x1":79.994},{"s":false,"z1":31.647,"a":false,"y1":58.215,"n":"Cys","y2":60.231,"z2":32.438,"x2":79.182,"h":false,"x1":78.196},{"s":false,"z1":29.941,"a":false,"y1":60.956,"n":"Ala","y2":63.357,"z2":30.065,"x2":79.974,"h":false,"x1":80.101},{"s":false,"z1":28.505,"a":false,"y1":63.585,"n":"Gly","y2":63.018,"z2":26.498,"x2":78.919,"h":false,"x1":77.742},{"s":false,"z1":25.5,"a":false,"y1":65.564,"n":"Asp","y2":65.4,"z2":26.685,"x2":81.095,"h":false,"x1":78.992},{"s":false,"z1":25.055,"a":false,"y1":67.074,"n":"Asp","y2":68.497,"z2":26.431,"x2":83.809,"h":false,"x1":82.429},{"s":false,"z1":27.589,"a":false,"y1":69.767,"n":"Gln","y2":69.555,"z2":29.943,"x2":81.008,"h":false,"x1":81.496},{"s":false,"z1":29.703,"a":false,"y1":66.937,"n":"Gly","y2":66.889,"z2":31.348,"x2":78.367,"h":false,"x1":80.118},{"s":false,"z1":29.776,"a":false,"y1":68.124,"n":"Leu","y2":66.438,"z2":28.179,"x2":76.09,"h":false,"x1":76.503},{"s":false,"z1":29.318,"a":false,"y1":65.875,"n":"Asp","y2":63.623,"z2":28.639,"x2":73.897,"h":false,"x1":73.432},{"s":false,"z1":31.06,"a":false,"y1":62.96,"n":"Lys","y2":62.434,"z2":31.9,"x2":73.016,"h":false,"x1":75.145},{"s":false,"z1":30.781,"a":false,"y1":59.691,"n":"Cys","y2":59.081,"z2":30.042,"x2":71.011,"h":false,"x1":73.213},{"s":false,"z1":28.036,"a":false,"y1":61.053,"n":"Val","y2":59.323,"z2":26.657,"x2":71.911,"h":false,"x1":70.948},{"s":false,"z1":25.649,"a":false,"y1":58.436,"n":"Pro","y2":58.533,"z2":23.481,"x2":68.678,"h":false,"x1":69.64},{"s":false,"z1":22.377,"a":false,"y1":59.769,"n":"Asn","y2":59.8,"z2":23.042,"x2":73.085,"h":false,"x1":70.822},{"s":false,"z1":20.294,"a":false,"y1":59.978,"n":"Ser","y2":60.979,"z2":20.676,"x2":76.132,"h":false,"x1":73.986},{"s":false,"z1":22.077,"a":false,"y1":63.124,"n":"Lys","y2":63.205,"z2":23.798,"x2":76.82,"h":false,"x1":75.169},{"s":false,"z1":25.136,"a":false,"y1":61.014,"n":"Glu","y2":59.219,"z2":23.782,"x2":76.774,"h":false,"x1":75.972},{"s":false,"z1":24.577,"a":false,"y1":59.661,"n":"Lys","y2":57.45,"z2":23.709,"x2":79.977,"h":false,"x1":79.533},{"s":false,"z1":25.772,"a":false,"y1":56.2,"n":"Tyr","y2":54.477,"z2":25.835,"x2":77.153,"h":false,"x1":78.816},{"s":false,"z1":24.279,"a":false,"y1":55.814,"n":"Tyr","y2":55.076,"z2":22.064,"x2":76.066,"h":false,"x1":75.346},{"s":false,"z1":21.976,"a":false,"y1":52.979,"n":"Gly","y2":51.659,"z2":22.965,"x2":76.061,"h":true,"x1":74.348},{"s":false,"z1":20.603,"a":false,"y1":50.083,"n":"Tyr","y2":49.893,"z2":21.18,"x2":78.607,"h":true,"x1":76.252},{"s":false,"z1":19.66,"a":false,"y1":52.221,"n":"Thr","y2":52.562,"z2":21.315,"x2":80.923,"h":true,"x1":79.201},{"s":false,"z1":22.908,"a":false,"y1":54.146,"n":"Gly","y2":53.524,"z2":24.872,"x2":80.457,"h":true,"x1":79.318},{"s":false,"z1":25.245,"a":false,"y1":51.174,"n":"Ala","y2":49.997,"z2":26.1,"x2":80.921,"h":true,"x1":79.011},{"s":false,"z1":23.535,"a":false,"y1":49.471,"n":"Phe","y2":49.927,"z2":24.432,"x2":84.145,"h":true,"x1":81.954},{"s":false,"z1":23.751,"a":false,"y1":52.748,"n":"Arg","y2":53.17,"z2":25.659,"x2":85.293,"h":true,"x1":83.866},{"s":false,"z1":27.452,"a":false,"y1":52.749,"n":"Cys","y2":51.781,"z2":28.966,"x2":84.752,"h":true,"x1":83.128},{"s":false,"z1":27.742,"a":true,"y1":49.307,"n":"Leu","y2":49.144,"z2":28.017,"x2":87.102,"h":true,"x1":84.711},{"s":false,"z1":25.367,"a":false,"y1":50.16,"n":"Ala","y2":51.061,"z2":26.103,"x2":89.68,"h":true,"x1":87.571},{"s":false,"z1":27.337,"a":false,"y1":53.245,"n":"Glu","y2":53.808,"z2":29.554,"x2":89.026,"h":false,"x1":88.497},{"s":false,"z1":30.475,"a":false,"y1":51.179,"n":"Asp","y2":51.951,"z2":32.734,"x2":88.007,"h":false,"x1":88.35},{"s":false,"z1":32.089,"a":false,"y1":53.207,"n":"Val","y2":52.362,"z2":33.942,"x2":84.315,"h":false,"x1":85.579},{"s":false,"z1":32.701,"a":false,"y1":49.997,"n":"Gly","y2":48.558,"z2":31.613,"x2":85.213,"h":false,"x1":83.637},{"s":false,"z1":33.096,"a":false,"y1":46.341,"n":"Asp","y2":44.479,"z2":31.599,"x2":84.47,"h":false,"x1":84.553},{"s":true,"z1":30.829,"a":false,"y1":44.896,"n":"Val","y2":46.822,"z2":30.422,"x2":80.51,"h":false,"x1":81.912},{"s":true,"z1":27.759,"a":false,"y1":45.997,"n":"Ala","y2":43.82,"z2":26.785,"x2":79.383,"h":false,"x1":79.972},{"s":true,"z1":26.799,"a":false,"y1":44.437,"n":"Phe","y2":46.034,"z2":25.419,"x2":75.512,"h":false,"x1":76.67},{"s":true,"z1":23.073,"a":true,"y1":44.932,"n":"Val","y2":42.634,"z2":22.656,"x2":75.887,"h":false,"x1":76.429},{"s":true,"z1":19.925,"a":false,"y1":42.849,"n":"Lys","y2":43.189,"z2":19.557,"x2":78.413,"h":false,"x1":76.064},{"s":false,"z1":18.085,"a":false,"y1":40.778,"n":"Asn","y2":41.981,"z2":17.223,"x2":80.612,"h":true,"x1":78.687},{"s":false,"z1":15.111,"a":false,"y1":43.169,"n":"Asp","y2":44.854,"z2":14.803,"x2":80.67,"h":true,"x1":79.05},{"s":false,"z1":17.261,"a":false,"y1":46.058,"n":"Thr","y2":46.823,"z2":17.274,"x2":82.375,"h":true,"x1":80.123},{"s":false,"z1":18.343,"a":false,"y1":44.364,"n":"Val","y2":44.704,"z2":17.063,"x2":85.239,"h":true,"x1":83.264},{"s":false,"z1":14.806,"a":true,"y1":43.497,"n":"Trp","y2":44.995,"z2":13.419,"x2":85.355,"h":true,"x1":84.141},{"s":false,"z1":13.422,"a":false,"y1":46.878,"n":"Glu","y2":48.988,"z2":13.415,"x2":84.359,"h":true,"x1":83.312},{"s":false,"z1":15.954,"a":false,"y1":48.749,"n":"Asn","y2":48.974,"z2":17.145,"x2":87.38,"h":false,"x1":85.305},{"s":false,"z1":15.962,"a":false,"y1":46.748,"n":"Thr","y2":46.425,"z2":13.583,"x2":88.338,"h":false,"x1":88.463},{"s":false,"z1":13.499,"a":false,"y1":45.917,"n":"Asn","y2":46.165,"z2":11.084,"x2":91.089,"h":false,"x1":91.221},{"s":false,"z1":11.227,"a":false,"y1":48.945,"n":"Gly","y2":49.816,"z2":9.495,"x2":89.716,"h":false,"x1":91.146},{"s":false,"z1":10.607,"a":false,"y1":48.742,"n":"Glu","y2":50.798,"z2":10.008,"x2":86.318,"h":false,"x1":87.399},{"s":false,"z1":12.549,"a":false,"y1":51.862,"n":"Ser","y2":52.398,"z2":12.648,"x2":88.968,"h":false,"x1":86.63},{"s":false,"z1":11.618,"a":false,"y1":54.916,"n":"Thr","y2":56.887,"z2":12.638,"x2":89.574,"h":false,"x1":88.644},{"s":false,"z1":14.795,"a":false,"y1":56.72,"n":"Ala","y2":55.362,"z2":15.945,"x2":89.286,"h":false,"x1":87.716},{"s":false,"z1":16.895,"a":false,"y1":57.667,"n":"Asp","y2":56.403,"z2":18.621,"x2":91.78,"h":false,"x1":90.714},{"s":false,"z1":20.014,"a":false,"y1":55.892,"n":"Trp","y2":53.591,"z2":20.46,"x2":90.066,"h":false,"x1":89.503},{"s":false,"z1":18.134,"a":false,"y1":52.646,"n":"Ala","y2":51.053,"z2":16.646,"x2":89.872,"h":false,"x1":88.891},{"s":false,"z1":15.533,"a":false,"y1":52.965,"n":"Lys","y2":51.293,"z2":15.038,"x2":93.334,"h":false,"x1":91.66},{"s":false,"z1":17.635,"a":false,"y1":51.228,"n":"Asn","y2":49.639,"z2":19.4,"x2":94.517,"h":false,"x1":94.323},{"s":false,"z1":18.763,"a":false,"y1":48.316,"n":"Leu","y2":46.699,"z2":17,"x2":91.874,"h":false,"x1":92.154},{"s":false,"z1":18.317,"a":false,"y1":44.796,"n":"Asn","y2":44.053,"z2":20.145,"x2":92.035,"h":false,"x1":93.359},{"s":false,"z1":18.47,"a":false,"y1":42.396,"n":"Arg","y2":40.599,"z2":20.019,"x2":89.934,"h":true,"x1":90.48},{"s":false,"z1":20.418,"a":true,"y1":39.871,"n":"Glu","y2":39.604,"z2":22.714,"x2":93.36,"h":true,"x1":92.639},{"s":false,"z1":23.406,"a":false,"y1":42.15,"n":"Asp","y2":42.544,"z2":25.306,"x2":91.149,"h":true,"x1":92.59},{"s":true,"z1":24.047,"a":false,"y1":41.277,"n":"Phe","y2":39.022,"z2":23.186,"x2":88.854,"h":false,"x1":88.921},{"s":true,"z1":25.143,"a":false,"y1":38.218,"n":"Arg","y2":39.385,"z2":25.451,"x2":84.896,"h":false,"x1":86.993},{"s":true,"z1":25.364,"a":true,"y1":37.059,"n":"Leu","y2":35.113,"z2":26.614,"x2":83.59,"h":false,"x1":83.39},{"s":true,"z1":28.556,"a":false,"y1":36.024,"n":"Leu","y2":35.552,"z2":27.374,"x2":79.877,"h":false,"x1":81.887},{"s":false,"z1":28.138,"a":false,"y1":32.903,"n":"Cys","y2":32.87,"z2":30.518,"x2":79.525,"h":false,"x1":79.848},{"s":false,"z1":30.293,"a":false,"y1":31.832,"n":"Leu","y2":30.244,"z2":32.038,"x2":76.559,"h":false,"x1":76.925},{"s":false,"z1":31.374,"a":false,"y1":28.686,"n":"Asp","y2":28.05,"z2":32.764,"x2":80.633,"h":false,"x1":78.79},{"s":false,"z1":33.224,"a":false,"y1":30.627,"n":"Gly","y2":30.796,"z2":33.14,"x2":83.825,"h":false,"x1":81.439},{"s":false,"z1":30.508,"a":false,"y1":30.535,"n":"Thr","y2":32.496,"z2":29.462,"x2":83.074,"h":false,"x1":84.005},{"s":true,"z1":28.373,"a":false,"y1":33.22,"n":"Arg","y2":31.466,"z2":26.964,"x2":86.231,"h":false,"x1":85.526},{"s":true,"z1":24.643,"a":true,"y1":32.949,"n":"Lys","y2":35.26,"z2":24.228,"x2":86.194,"h":false,"x1":85.928},{"s":true,"z1":21.844,"a":false,"y1":34.968,"n":"Pro","y2":34.546,"z2":20.812,"x2":85.355,"h":false,"x1":87.483},{"s":false,"z1":19.594,"a":false,"y1":37.141,"n":"Val","y2":36.776,"z2":17.651,"x2":84.037,"h":false,"x1":85.393},{"s":false,"z1":16.776,"a":false,"y1":34.585,"n":"Thr","y2":32.888,"z2":16.095,"x2":83.917,"h":false,"x1":85.509},{"s":false,"z1":18.617,"a":false,"y1":32.181,"n":"Glu","y2":32.279,"z2":20.484,"x2":81.695,"h":false,"x1":83.196},{"s":false,"z1":19.271,"a":false,"y1":34.3,"n":"Ala","y2":33.495,"z2":19.995,"x2":78.037,"h":false,"x1":80.165},{"s":false,"z1":17.893,"a":false,"y1":31.557,"n":"Gln","y2":29.961,"z2":19.227,"x2":76.775,"h":false,"x1":77.998},{"s":false,"z1":20.818,"a":false,"y1":29.308,"n":"Ser","y2":29.356,"z2":23.236,"x2":79.094,"h":false,"x1":78.949},{"s":false,"z1":23.341,"a":false,"y1":32.086,"n":"Cys","y2":34.531,"z2":23.206,"x2":79.042,"h":false,"x1":79.222},{"s":false,"z1":23.328,"a":false,"y1":34.613,"n":"His","y2":33.446,"z2":24.901,"x2":74.971,"h":false,"x1":76.328},{"s":false,"z1":25.652,"a":false,"y1":35.706,"n":"Leu","y2":34.57,"z2":25.788,"x2":71.457,"h":false,"x1":73.54},{"s":true,"z1":23.295,"a":false,"y1":35.494,"n":"Ala","y2":36.669,"z2":21.53,"x2":71.647,"h":false,"x1":70.6},{"s":true,"z1":19.756,"a":true,"y1":36.177,"n":"Val","y2":37.019,"z2":20.387,"x2":67.527,"h":false,"x1":69.676},{"s":true,"z1":19.377,"a":false,"y1":39.493,"n":"Ala","y2":39.291,"z2":17.055,"x2":67.914,"h":false,"x1":67.861},{"s":false,"z1":16.66,"a":false,"y1":40.34,"n":"Pro","y2":42.489,"z2":17.001,"x2":66.267,"h":false,"x1":65.353},{"s":false,"z1":14.275,"a":false,"y1":43.063,"n":"Asn","y2":44.207,"z2":14.959,"x2":64.455,"h":false,"x1":66.488},{"s":false,"z1":14.701,"a":false,"y1":46.716,"n":"His","y2":46.611,"z2":12.432,"x2":64.819,"h":false,"x1":65.66},{"s":true,"z1":12.927,"a":false,"y1":47.684,"n":"Ala","y2":49.735,"z2":13.968,"x2":61.825,"h":false,"x1":62.427},{"s":true,"z1":11.754,"a":false,"y1":50.59,"n":"Val","y2":49.501,"z2":11.833,"x2":58.29,"h":false,"x1":60.427},{"s":true,"z1":13.742,"a":true,"y1":51.125,"n":"Val","y2":53.284,"z2":12.776,"x2":57.074,"h":false,"x1":57.281},{"s":true,"z1":12.862,"a":false,"y1":53.247,"n":"Ser","y2":51.958,"z2":14.095,"x2":52.717,"h":false,"x1":54.283},{"s":false,"z1":13.559,"a":false,"y1":53.712,"n":"Arg","y2":53.021,"z2":11.292,"x2":50.405,"h":false,"x1":50.61},{"s":false,"z1":11.96,"a":false,"y1":51.171,"n":"Ser","y2":51.049,"z2":9.645,"x2":47.662,"h":false,"x1":48.176},{"s":false,"z1":9.534,"a":false,"y1":53.644,"n":"Asp","y2":54.772,"z2":7.58,"x2":47.477,"h":false,"x1":46.699},{"s":false,"z1":8.471,"a":false,"y1":55.062,"n":"Arg","y2":54.441,"z2":6.834,"x2":51.666,"h":false,"x1":50.034},{"s":false,"z1":8.104,"a":false,"y1":51.759,"n":"Ala","y2":51.258,"z2":6.225,"x2":53.249,"h":true,"x1":51.885},{"s":false,"z1":4.467,"a":false,"y1":51.065,"n":"Ala","y2":51.848,"z2":2.668,"x2":52.442,"h":true,"x1":51.069},{"s":false,"z1":3.337,"a":false,"y1":54.549,"n":"His","y2":54.947,"z2":2.641,"x2":54.166,"h":true,"x1":51.94},{"s":false,"z1":5.314,"a":false,"y1":54.592,"n":"Val","y2":53.857,"z2":4.216,"x2":57.072,"h":true,"x1":55.069},{"s":false,"z1":3.894,"a":false,"y1":51.227,"n":"Lys","y2":51.39,"z2":2.059,"x2":57.557,"h":true,"x1":56.043},{"s":false,"z1":0.274,"a":false,"y1":52.287,"n":"Gln","y2":53.207,"z2":-0.981,"x2":57.315,"h":true,"x1":55.471},{"s":false,"z1":0.758,"a":false,"y1":55.464,"n":"Val","y2":55.501,"z2":0.348,"x2":59.729,"h":true,"x1":57.372},{"s":false,"z1":2.502,"a":false,"y1":53.762,"n":"Leu","y2":52.82,"z2":1.471,"x2":62.189,"h":true,"x1":60.283},{"s":false,"z1":-0.321,"a":false,"y1":51.326,"n":"Leu","y2":51.837,"z2":-2.025,"x2":62.221,"h":true,"x1":60.643},{"s":false,"z1":-2.763,"a":false,"y1":54.208,"n":"His","y2":55.227,"z2":-3.276,"x2":62.942,"h":true,"x1":60.794},{"s":false,"z1":-0.614,"a":false,"y1":56.015,"n":"Gln","y2":55.715,"z2":-0.832,"x2":65.728,"h":true,"x1":63.368},{"s":false,"z1":-0.254,"a":false,"y1":52.911,"n":"Gln","y2":52.404,"z2":-1.662,"x2":67.408,"h":true,"x1":65.513},{"s":false,"z1":-4.001,"a":false,"y1":52.607,"n":"Ala","y2":53.591,"z2":-5.272,"x2":67.684,"h":true,"x1":65.916},{"s":false,"z1":-4.255,"a":true,"y1":56.12,"n":"Leu","y2":56.693,"z2":-3.899,"x2":69.506,"h":true,"x1":67.223},{"s":false,"z1":-1.201,"a":false,"y1":56.317,"n":"Phe","y2":55.403,"z2":0.473,"x2":70.77,"h":true,"x1":69.362},{"s":false,"z1":0.032,"a":false,"y1":52.792,"n":"Gly","y2":52.995,"z2":-1.084,"x2":72.165,"h":false,"x1":70.084},{"s":false,"z1":-0.386,"a":false,"y1":50.336,"n":"Lys","y2":50.448,"z2":-2.323,"x2":74.472,"h":false,"x1":73.026},{"s":false,"z1":-4.091,"a":false,"y1":50.039,"n":"Asn","y2":50.871,"z2":-5.482,"x2":70.678,"h":false,"x1":72.447},{"s":false,"z1":-4.13,"a":false,"y1":53.337,"n":"Gly","y2":53.991,"z2":-5.57,"x2":72.442,"h":false,"x1":70.666},{"s":false,"z1":-7.265,"a":false,"y1":55.468,"n":"Lys","y2":57.069,"z2":-7.553,"x2":72.567,"h":false,"x1":70.772},{"s":false,"z1":-5.331,"a":false,"y1":58.587,"n":"Asn","y2":59.174,"z2":-3.769,"x2":73.549,"h":false,"x1":71.78},{"s":false,"z1":-3.087,"a":false,"y1":56.644,"n":"Cys","y2":55.146,"z2":-4.891,"x2":74.784,"h":false,"x1":74.151},{"s":false,"z1":-2.836,"a":false,"y1":57.185,"n":"Pro","y2":59.312,"z2":-2.372,"x2":77.831,"h":false,"x1":76.888},{"s":false,"z1":-4.781,"a":false,"y1":60.438,"n":"Asp","y2":62.628,"z2":-3.873,"x2":76.803,"h":false,"x1":77.212},{"s":false,"z1":-3.451,"a":false,"y1":62.264,"n":"Lys","y2":62.861,"z2":-1.134,"x2":74.265,"h":false,"x1":74.125},{"s":false,"z1":-0.216,"a":false,"y1":60.597,"n":"Phe","y2":58.353,"z2":-0.751,"x2":72.164,"h":false,"x1":72.929},{"s":false,"z1":1.542,"a":false,"y1":57.278,"n":"Cys","y2":57.772,"z2":3.879,"x2":73.064,"h":false,"x1":73.255},{"s":false,"z1":4.06,"a":false,"y1":56.436,"n":"Leu","y2":55.779,"z2":6.335,"x2":70.918,"h":false,"x1":70.568},{"s":false,"z1":5.848,"a":false,"y1":53.743,"n":"Phe","y2":53.273,"z2":6.975,"x2":74.498,"h":false,"x1":72.506},{"s":false,"z1":6.3,"a":false,"y1":55.555,"n":"Lys","y2":57.75,"z2":6.963,"x2":75.08,"h":false,"x1":75.78},{"s":false,"z1":9.36,"a":false,"y1":57.683,"n":"Ser","y2":58.673,"z2":11.014,"x2":77.802,"h":false,"x1":76.419},{"s":false,"z1":9.93,"a":false,"y1":57.52,"n":"Glu","y2":57.283,"z2":12.306,"x2":80.785,"h":false,"x1":80.248},{"s":false,"z1":12.34,"a":false,"y1":54.491,"n":"Thr","y2":54.677,"z2":14.715,"x2":79.425,"h":false,"x1":79.871},{"s":false,"z1":14.374,"a":false,"y1":56.29,"n":"Lys","y2":55.637,"z2":15.759,"x2":75.469,"h":false,"x1":77.271},{"s":false,"z1":13.544,"a":false,"y1":54.236,"n":"Asn","y2":55.034,"z2":14.656,"x2":72.157,"h":false,"x1":74.129},{"s":false,"z1":13.131,"a":false,"y1":57.327,"n":"Leu","y2":56.631,"z2":11.028,"x2":71.112,"h":false,"x1":72.007},{"s":false,"z1":12.039,"a":false,"y1":56.554,"n":"Leu","y2":54.457,"z2":12.067,"x2":67.189,"h":false,"x1":68.412},{"s":false,"z1":11.014,"a":false,"y1":52.965,"n":"Phe","y2":53.499,"z2":11.413,"x2":71.687,"h":false,"x1":69.385},{"s":false,"z1":11.824,"a":false,"y1":50.805,"n":"Asn","y2":50.698,"z2":9.453,"x2":72.591,"h":false,"x1":72.411},{"s":false,"z1":9.496,"a":false,"y1":51.403,"n":"Asp","y2":50.165,"z2":7.493,"x2":75.912,"h":false,"x1":75.333},{"s":false,"z1":8.687,"a":false,"y1":47.673,"n":"Asn","y2":46.12,"z2":7.241,"x2":74.381,"h":false,"x1":75.509},{"s":true,"z1":7.294,"a":false,"y1":47.595,"n":"Thr","y2":48.508,"z2":5.178,"x2":72.531,"h":false,"x1":71.94},{"s":true,"z1":3.808,"a":false,"y1":46.21,"n":"Glu","y2":47.486,"z2":2.107,"x2":70.678,"h":false,"x1":71.833},{"s":true,"z1":3.374,"a":false,"y1":47.14,"n":"Cys","y2":46.279,"z2":5.484,"x2":67.406,"h":false,"x1":68.204},{"s":true,"z1":5.036,"a":false,"y1":47.369,"n":"Leu","y2":46.412,"z2":3.203,"x2":63.635,"h":false,"x1":64.847},{"s":true,"z1":4.583,"a":true,"y1":44.072,"n":"Ala","y2":44.684,"z2":6.029,"x2":61.199,"h":false,"x1":63.056},{"s":true,"z1":4.244,"a":false,"y1":43.428,"n":"Lys","y2":41.395,"z2":5.354,"x2":59.799,"h":false,"x1":59.294},{"s":false,"z1":7.023,"a":false,"y1":41.544,"n":"Leu","y2":41.017,"z2":5.289,"x2":56.063,"h":false,"x1":57.664},{"s":false,"z1":6.74,"a":false,"y1":38.982,"n":"Gly","y2":40.839,"z2":7.211,"x2":53.418,"h":false,"x1":54.921},{"s":false,"z1":6.864,"a":false,"y1":39.334,"n":"Gly","y2":38.491,"z2":9.077,"x2":50.762,"h":false,"x1":51.163},{"s":false,"z1":9.983,"a":false,"y1":41.121,"n":"Arg","y2":39.92,"z2":11.842,"x2":50.742,"h":false,"x1":49.839},{"s":false,"z1":12.385,"a":false,"y1":41.154,"n":"Pro","y2":43.406,"z2":13.212,"x2":52.351,"h":false,"x1":52.422},{"s":false,"z1":15.828,"a":false,"y1":42.591,"n":"Thr","y2":42.056,"z2":15.906,"x2":54.29,"h":false,"x1":51.963},{"s":false,"z1":18.194,"a":false,"y1":43.558,"n":"Tyr","y2":41.844,"z2":18.602,"x2":56.289,"h":true,"x1":54.696},{"s":false,"z1":19.877,"a":false,"y1":40.14,"n":"Glu","y2":38.177,"z2":19.209,"x2":55.504,"h":true,"x1":54.365},{"s":false,"z1":16.605,"a":false,"y1":38.325,"n":"Glu","y2":37.552,"z2":15.785,"x2":56.767,"h":true,"x1":54.662},{"s":false,"z1":15.51,"a":true,"y1":40.164,"n":"Tyr","y2":39.266,"z2":16.157,"x2":59.921,"h":true,"x1":57.776},{"s":false,"z1":18.847,"a":false,"y1":40.053,"n":"Leu","y2":38.025,"z2":19.379,"x2":60.715,"h":true,"x1":59.585},{"s":false,"z1":19.787,"a":false,"y1":36.577,"n":"Gly","y2":37.127,"z2":22.087,"x2":58.675,"h":false,"x1":58.431},{"s":false,"z1":22.795,"a":false,"y1":35.091,"n":"Thr","y2":35.569,"z2":25.071,"x2":57.271,"h":true,"x1":56.595},{"s":false,"z1":24.712,"a":false,"y1":34.093,"n":"Glu","y2":35.559,"z2":26.361,"x2":60.621,"h":true,"x1":59.736},{"s":false,"z1":24.464,"a":false,"y1":37.525,"n":"Tyr","y2":39.214,"z2":26.051,"x2":60.764,"h":true,"x1":61.381},{"s":false,"z1":25.179,"a":false,"y1":39.243,"n":"Val","y2":39.864,"z2":27.473,"x2":57.657,"h":true,"x1":58.048},{"s":false,"z1":28.318,"a":false,"y1":37.166,"n":"Thr","y2":37.702,"z2":30.379,"x2":58.674,"h":true,"x1":57.608},{"s":false,"z1":29.18,"a":false,"y1":37.821,"n":"Ala","y2":39.629,"z2":30.679,"x2":61.756,"h":true,"x1":61.22},{"s":false,"z1":28.89,"a":false,"y1":41.522,"n":"Ile","y2":42.548,"z2":30.965,"x2":60.013,"h":true,"x1":60.662},{"s":false,"z1":30.838,"a":false,"y1":41.136,"n":"Ala","y2":41.772,"z2":33.157,"x2":57.401,"h":true,"x1":57.413},{"s":false,"z1":33.916,"a":false,"y1":39.539,"n":"Asn","y2":40.821,"z2":35.686,"x2":59.964,"h":true,"x1":58.976},{"s":false,"z1":33.979,"a":false,"y1":42.127,"n":"Leu","y2":44.127,"z2":35.285,"x2":61.542,"h":true,"x1":61.792},{"s":false,"z1":33.732,"a":true,"y1":44.896,"n":"Lys","y2":46.006,"z2":35.393,"x2":57.926,"h":true,"x1":59.225},{"s":false,"z1":37.035,"a":false,"y1":43.819,"n":"Lys","y2":44.696,"z2":39.26,"x2":57.987,"h":true,"x1":57.691},{"s":false,"z1":38.868,"a":false,"y1":45.123,"n":"Cys","y2":47.18,"z2":40.015,"x2":60.929,"h":false,"x1":60.701},{"s":false,"z1":37.874,"a":false,"y1":48.711,"n":"Ser","y2":48.519,"z2":35.922,"x2":58.646,"h":false,"x1":60.067},{"s":false,"z1":36.539,"a":false,"y1":50.793,"n":"Thr","y2":52.87,"z2":36.058,"x2":58.28,"h":false,"x1":57.126},{"s":false,"z1":33.498,"a":false,"y1":53.089,"n":"Ser","y2":53.197,"z2":33.181,"x2":54.9,"h":false,"x1":57.248},{"s":false,"z1":33.443,"a":false,"y1":56.13,"n":"Pro","y2":56.312,"z2":31.94,"x2":53.102,"h":true,"x1":54.926},{"s":false,"z1":29.684,"a":false,"y1":55.814,"n":"Leu","y2":54.509,"z2":28.646,"x2":53.001,"h":true,"x1":54.73},{"s":false,"z1":30.087,"a":false,"y1":52.227,"n":"Leu","y2":51.613,"z2":30.389,"x2":51.393,"h":true,"x1":53.697},{"s":false,"z1":32.613,"a":false,"y1":53.326,"n":"Glu","y2":53.964,"z2":31.899,"x2":48.892,"h":true,"x1":51.082},{"s":false,"z1":30.232,"a":false,"y1":55.988,"n":"Ala","y2":55.614,"z2":28.643,"x2":48.22,"h":true,"x1":49.912},{"s":false,"z1":27.285,"a":false,"y1":53.593,"n":"Cys","y2":52.141,"z2":26.765,"x2":47.733,"h":true,"x1":49.565},{"s":false,"z1":29.496,"a":false,"y1":51.295,"n":"Ala","y2":51.284,"z2":29.097,"x2":45.263,"h":true,"x1":47.628},{"s":false,"z1":30.051,"a":true,"y1":54.005,"n":"Phe","y2":54.597,"z2":28.512,"x2":43.323,"h":true,"x1":45.071},{"s":false,"z1":26.337,"a":false,"y1":54.825,"n":"Leu","y2":53.864,"z2":24.603,"x2":43.658,"h":true,"x1":44.983},{"s":false,"z1":25.468,"a":false,"y1":51.209,"n":"Thr","y2":49.568,"z2":27.114,"x2":43.463,"h":false,"x1":44.187},{"s":false,"z1":27.971,"a":false,"y1":51.408,"n":"Arg","y2":49.251,"z2":28.614,"x2":40.481,"h":false,"x1":41.275},{"s":false,"z1":27.788,"a":false,"y1":50.182,"y2":49.251,"z2":28.614,"x2":40.481,"h":false,"x1":40.373},{"s":false,"z1":27.788,"a":false,"y1":50.182,"y2":49.251,"z2":28.614,"x2":40.481,"h":false,"x1":40.373},{"s":false,"z1":27.788,"a":false,"y1":50.182,"y2":49.251,"z2":28.614,"x2":40.481,"h":false,"x1":40.373},{"s":false,"z1":27.788,"a":false,"y1":50.182,"y2":49.251,"z2":28.614,"x2":40.481,"h":false,"x1":40.373}]]},"mol":{"b":[{"e":1,"b":0},{"e":11,"b":0},{"e":2,"b":1},{"e":8,"b":1},{"e":3,"b":2},{"e":9,"b":2},{"e":4,"b":3},{"e":10,"b":3},{"e":5,"b":4},{"e":11,"b":4},{"e":12,"b":5},{"e":7,"b":6},{"e":8,"b":6},{"e":13,"b":6},{"e":15,"b":14},{"e":25,"b":14},{"e":16,"b":15},{"e":22,"b":15},{"e":17,"b":16},{"e":23,"b":16},{"e":18,"b":17},{"e":24,"b":17},{"e":19,"b":18},{"e":25,"b":18},{"e":26,"b":19},{"e":21,"b":20},{"e":22,"b":20},{"e":27,"b":20},{"e":28,"b":24},{"e":29,"b":28},{"e":39,"b":28},{"e":30,"b":29},{"e":36,"b":29},{"e":31,"b":30},{"e":37,"b":30},{"e":32,"b":31},{"e":38,"b":31},{"e":33,"b":32},{"e":39,"b":32},{"e":40,"b":33},{"e":35,"b":34},{"e":36,"b":34},{"e":41,"b":34},{"e":42,"b":38},{"e":43,"b":42},{"e":51,"b":42},{"e":44,"b":43},{"e":48,"b":43},{"e":45,"b":44},{"e":49,"b":44},{"e":46,"b":45},{"e":50,"b":45},{"e":47,"b":46},{"e":51,"b":46},{"e":52,"b":47},{"e":54,"b":53},{"e":64,"b":53},{"e":55,"b":54},{"e":61,"b":54},{"e":56,"b":55},{"e":62,"b":55},{"e":57,"b":56},{"e":63,"b":56},{"e":58,"b":57},{"e":64,"b":57},{"e":65,"b":58},{"e":60,"b":59},{"e":61,"b":59},{"e":66,"b":59},{"e":67,"b":63},{"e":68,"b":67},{"e":78,"b":67},{"e":69,"b":68},{"e":75,"b":68},{"e":70,"b":69},{"e":76,"b":69},{"e":71,"b":70},{"e":77,"b":70},{"e":72,"b":71},{"e":78,"b":71},{"e":79,"b":72},{"e":74,"b":73},{"e":75,"b":73},{"e":80,"b":73},{"e":81,"b":77},{"e":82,"b":81},{"e":90,"b":81},{"e":83,"b":82},{"e":87,"b":82},{"e":84,"b":83},{"e":88,"b":83},{"e":85,"b":84},{"e":89,"b":84},{"e":86,"b":85},{"e":90,"b":85},{"e":91,"b":86},{"e":92,"b":91},{"e":93,"b":92},{"e":101,"b":92},{"e":94,"b":93},{"e":98,"b":93},{"e":95,"b":94},{"e":99,"b":94},{"e":96,"b":95},{"e":100,"b":95},{"e":97,"b":96},{"e":101,"b":96},{"e":102,"b":97},{"e":103,"b":99},{"e":114,"b":102},{"e":104,"b":103},{"e":112,"b":103},{"e":105,"b":104},{"e":109,"b":104},{"e":106,"b":105},{"e":110,"b":105},{"e":107,"b":106},{"e":111,"b":106},{"e":108,"b":107},{"e":112,"b":107},{"e":113,"b":108},{"e":115,"b":114},{"e":123,"b":114},{"e":116,"b":115},{"e":120,"b":115},{"e":117,"b":116},{"e":121,"b":116},{"e":118,"b":117},{"e":122,"b":117},{"e":119,"b":118},{"e":123,"b":118},{"e":124,"b":119},{"e":128,"b":125},{"e":129,"b":125},{"e":132,"b":126},{"e":133,"b":126},{"e":128,"b":127},{"e":129,"b":127},{"e":130,"b":127},{"e":132,"b":131},{"e":133,"b":131},{"e":134,"b":131}],"a":[{"p_h":true,"z":-3.918,"y":61.83,"x":58.832},{"p_h":true,"z":-4.86,"y":61.416,"x":59.973},{"p_h":true,"z":-6.305,"y":61.627,"x":59.529},{"p_h":true,"z":-6.551,"y":60.76,"x":58.284},{"p_h":true,"z":-5.542,"y":61.137,"x":57.193},{"p_h":true,"z":-5.701,"y":60.276,"x":55.951},{"p_h":true,"z":-3.857,"y":61.614,"x":62.19},{"p_h":true,"z":-3.97,"y":62.269,"x":63.537},{"p_h":true,"l":"N","z":-4.627,"y":62.123,"x":61.221},{"p_h":true,"l":"O","z":-7.199,"y":61.248,"x":60.568},{"p_h":true,"l":"O","z":-7.882,"y":60.94,"x":57.812},{"p_h":true,"l":"O","z":-4.194,"y":61.011,"x":57.693},{"p_h":true,"l":"O","z":-5.395,"y":58.927,"x":56.27},{"p_h":true,"l":"O","z":-3.149,"y":60.644,"x":62.024},{"p_h":true,"z":33.981,"y":34.753,"x":63.447},{"p_h":true,"z":32.478,"y":34.459,"x":63.502},{"p_h":true,"z":31.902,"y":34.367,"x":62.081},{"p_h":true,"z":32.74,"y":33.372,"x":61.247},{"p_h":true,"z":34.188,"y":33.861,"x":61.234},{"p_h":true,"z":35.109,"y":32.996,"x":60.386},{"p_h":true,"z":30.85,"y":35.35,"x":65.099},{"p_h":true,"z":30.323,"y":36.581,"x":65.782},{"p_h":true,"l":"N","z":31.81,"y":35.55,"x":64.195},{"p_h":true,"l":"O","z":30.536,"y":33.944,"x":62.125},{"p_h":true,"l":"O","z":32.254,"y":33.312,"x":59.91},{"p_h":true,"l":"O","z":34.66,"y":33.871,"x":62.566},{"p_h":true,"l":"O","z":35.09,"y":31.649,"x":60.864},{"p_h":true,"l":"O","z":30.429,"y":34.248,"x":65.386},{"p_h":true,"z":31.895,"y":32.033,"x":59.501},{"p_h":true,"z":32.097,"y":31.927,"x":57.988},{"p_h":true,"z":31.606,"y":30.581,"x":57.485},{"p_h":true,"z":30.144,"y":30.323,"x":57.923},{"p_h":true,"z":30.002,"y":30.569,"x":59.436},{"p_h":true,"z":28.558,"y":30.458,"x":59.915},{"p_h":true,"z":33.94,"y":33.032,"x":56.85},{"p_h":true,"z":35.421,"y":33.095,"x":56.647},{"p_h":true,"l":"N","z":33.497,"y":32.055,"x":57.635},{"p_h":true,"l":"O","z":31.681,"y":30.586,"x":56.066},{"p_h":true,"l":"O","z":29.867,"y":28.938,"x":57.679},{"p_h":true,"l":"O","z":30.508,"y":31.862,"x":59.803},{"p_h":true,"l":"O","z":27.999,"y":31.759,"x":60.083},{"p_h":true,"l":"O","z":33.214,"y":33.853,"x":56.339},{"p_h":true,"z":28.733,"y":28.678,"x":56.92},{"p_h":true,"z":28.068,"y":27.398,"x":57.455},{"p_h":true,"z":26.888,"y":27.011,"x":56.564},{"p_h":true,"z":27.379,"y":26.843,"x":55.134},{"p_h":true,"z":28.078,"y":28.133,"x":54.681},{"p_h":true,"z":28.6,"y":28.045,"x":53.249},{"p_h":true,"l":"O","z":28.977,"y":26.304,"x":57.531},{"p_h":true,"l":"O","z":26.309,"y":25.79,"x":57.013},{"p_h":true,"l":"O","z":26.267,"y":26.569,"x":54.295},{"p_h":true,"l":"O","z":29.162,"y":28.458,"x":55.575},{"p_h":true,"l":"O","z":29.864,"y":27.392,"x":53.233},{"p_h":true,"z":13.965,"y":38.992,"x":79.879},{"p_h":true,"z":12.997,"y":37.89,"x":79.468},{"p_h":true,"z":11.774,"y":37.91,"x":80.381},{"p_h":true,"z":11.154,"y":39.319,"x":80.436},{"p_h":true,"z":12.223,"y":40.359,"x":80.77},{"p_h":true,"z":11.702,"y":41.783,"x":80.647},{"p_h":true,"z":13.834,"y":35.826,"x":78.529},{"p_h":true,"z":14.607,"y":34.561,"x":78.768},{"p_h":true,"l":"N","z":13.63,"y":36.596,"x":79.59},{"p_h":true,"l":"O","z":10.811,"y":37.012,"x":79.852},{"p_h":true,"l":"O","z":10.173,"y":39.35,"x":81.465},{"p_h":true,"l":"O","z":13.29,"y":40.237,"x":79.871},{"p_h":true,"l":"O","z":11.461,"y":42.091,"x":79.277},{"p_h":true,"l":"O","z":13.454,"y":36.13,"x":77.416},{"p_h":true,"z":8.953,"y":39.797,"x":81.018},{"p_h":true,"z":8.17,"y":40.422,"x":82.182},{"p_h":true,"z":6.757,"y":40.764,"x":81.732},{"p_h":true,"z":6.101,"y":39.527,"x":81.098},{"p_h":true,"z":6.989,"y":39.022,"x":79.969},{"p_h":true,"z":6.37,"y":37.872,"x":79.192},{"p_h":true,"z":9.491,"y":41.782,"x":83.717},{"p_h":true,"z":10.028,"y":43.146,"x":84.027},{"p_h":true,"l":"N","z":8.779,"y":41.672,"x":82.604},{"p_h":true,"l":"O","z":6.003,"y":41.234,"x":82.848},{"p_h":true,"l":"O","z":4.849,"y":39.879,"x":80.55},{"p_h":true,"l":"O","z":8.268,"y":38.675,"x":80.486},{"p_h":true,"l":"O","z":7.355,"y":36.874,"x":78.936},{"p_h":true,"l":"O","z":9.693,"y":40.847,"x":84.452},{"p_h":true,"z":3.795,"y":39.438,"x":81.312},{"p_h":true,"z":2.679,"y":38.969,"x":80.382},{"p_h":true,"z":1.39,"y":38.716,"x":81.175},{"p_h":true,"z":1.054,"y":39.981,"x":81.953},{"p_h":true,"z":2.231,"y":40.312,"x":82.852},{"p_h":true,"z":1.988,"y":41.495,"x":83.742},{"p_h":true,"l":"O","z":2.424,"y":39.887,"x":79.322},{"p_h":true,"l":"O","z":0.32,"y":38.37,"x":80.292},{"p_h":true,"l":"O","z":-0.128,"y":39.814,"x":82.727},{"p_h":true,"l":"O","z":3.378,"y":40.564,"x":82.06},{"p_h":true,"l":"O","z":3.204,"y":41.785,"x":84.395},{"p_h":true,"z":3.01,"y":42.561,"x":85.532},{"p_h":true,"z":4.173,"y":42.336,"x":86.497},{"p_h":true,"z":5.492,"y":42.748,"x":85.837},{"p_h":true,"z":5.381,"y":44.176,"x":85.275},{"p_h":true,"z":4.095,"y":44.38,"x":84.45},{"p_h":true,"z":3.88,"y":45.85,"x":84.15},{"p_h":true,"l":"O","z":4.01,"y":43.031,"x":87.728},{"p_h":true,"l":"O","z":6.503,"y":42.75,"x":86.844},{"p_h":true,"l":"O","z":6.506,"y":44.429,"x":84.444},{"p_h":true,"l":"O","z":2.949,"y":43.924,"x":85.182},{"p_h":true,"l":"O","z":3.676,"y":46.526,"x":85.39},{"p_h":true,"z":7.409,"y":41.694,"x":86.727},{"p_h":true,"z":8.743,"y":42.125,"x":87.349},{"p_h":true,"z":8.549,"y":42.384,"x":88.837},{"p_h":true,"z":8.028,"y":41.103,"x":89.483},{"p_h":true,"z":6.722,"y":40.69,"x":88.791},{"p_h":true,"z":6.119,"y":39.421,"x":89.376},{"p_h":true,"l":"O","z":9.756,"y":41.15,"x":87.178},{"p_h":true,"l":"O","z":9.787,"y":42.764,"x":89.425},{"p_h":true,"l":"O","z":7.8,"y":41.31,"x":90.87},{"p_h":true,"l":"O","z":6.936,"y":40.522,"x":87.375},{"p_h":true,"l":"O","z":5.057,"y":38.974,"x":88.546},{"p_h":true,"z":3.454,"y":47.9,"x":85.255},{"p_h":true,"z":3.286,"y":48.544,"x":86.642},{"p_h":true,"z":4.629,"y":48.564,"x":87.377},{"p_h":true,"z":5.664,"y":49.286,"x":86.513},{"p_h":true,"z":5.768,"y":48.557,"x":85.176},{"p_h":true,"z":6.83,"y":49.145,"x":84.262},{"p_h":true,"l":"O","z":2.743,"y":49.859,"x":86.58},{"p_h":true,"l":"O","z":4.489,"y":49.23,"x":88.625},{"p_h":true,"l":"O","z":6.929,"y":49.297,"x":87.166},{"p_h":true,"l":"O","z":4.488,"y":48.557,"x":84.519},{"p_h":true,"l":"O","z":6.215,"y":49.916,"x":83.237},{"p_h":true,"l":"F","z":25.39,"y":68.008,"x":31.384},{"p_h":true,"l":"F","z":19.468,"y":46.274,"x":69.551},{"p_h":true,"z":23.766,"y":69.402,"x":30.416},{"p_h":true,"l":"O","z":23.601,"y":68.19,"x":30.857},{"p_h":true,"l":"O","z":24.94,"y":69.957,"x":30.444},{"p_h":true,"l":"O","z":22.747,"y":70.05,"x":29.936},{"p_h":true,"z":21.491,"y":47.009,"x":70.434},{"p_h":true,"l":"O","z":21.212,"y":45.777,"x":70.094},{"p_h":true,"l":"O","z":20.573,"y":47.926,"x":70.342},{"p_h":true,"l":"O","z":22.668,"y":47.327,"x":70.873},{"p_w":true,"p_h":true,"l":"O","z":18.584,"y":51.898,"x":67.095},{"p_w":true,"p_h":true,"l":"O","z":13.158,"y":56.518,"x":65.024},{"p_w":true,"p_h":true,"l":"O","z":28.112,"y":52.919,"x":77.743},{"p_w":true,"p_h":true,"l":"O","z":23.658,"y":65.393,"x":62.252},{"p_w":true,"p_h":true,"l":"O","z":5.5,"y":54.142,"x":49.24},{"p_w":true,"p_h":true,"l":"O","z":18.829,"y":55.374,"x":66.326},{"p_w":true,"p_h":true,"l":"O","z":17.479,"y":55.846,"x":72.451},{"p_w":true,"p_h":true,"l":"O","z":18.301,"y":53.183,"x":76.197},{"p_w":true,"p_h":true,"l":"O","z":19.332,"y":44.008,"x":66.507},{"p_w":true,"p_h":true,"l":"O","z":1.653,"y":73.7,"x":34.542},{"p_w":true,"p_h":true,"l":"O","z":16.104,"y":46.562,"x":71.477},{"p_w":true,"p_h":true,"l":"O","z":31.955,"y":68.412,"x":31.873},{"p_w":true,"p_h":true,"l":"O","z":36.57,"y":73.29,"x":34.364},{"p_w":true,"p_h":true,"l":"O","z":23.682,"y":70.2,"x":47.155},{"p_w":true,"p_h":true,"l":"O","z":15.472,"y":52.539,"x":48.628},{"p_w":true,"p_h":true,"l":"O","z":24.9,"y":66.856,"x":35.126},{"p_w":true,"p_h":true,"l":"O","z":33.127,"y":47.43,"x":64.066},{"p_w":true,"p_h":true,"l":"O","z":24.824,"y":77.686,"x":34.194},{"p_w":true,"p_h":true,"l":"O","z":26.225,"y":52.081,"x":61.131},{"p_w":true,"p_h":true,"l":"O","z":37.461,"y":68.839,"x":26.447},{"p_w":true,"p_h":true,"l":"O","z":28.428,"y":73.84,"x":34.587},{"p_w":true,"p_h":true,"l":"O","z":17.502,"y":63.138,"x":71.745},{"p_w":true,"p_h":true,"l":"O","z":26.714,"y":47.795,"x":61.492},{"p_w":true,"p_h":true,"l":"O","z":31.704,"y":33.386,"x":82.004},{"p_w":true,"p_h":true,"l":"O","z":14.38,"y":48.36,"x":75.409},{"p_w":true,"p_h":true,"l":"O","z":23.692,"y":78.274,"x":46.458},{"p_w":true,"p_h":true,"l":"O","z":29.715,"y":27.119,"x":88.288},{"p_w":true,"p_h":true,"l":"O","z":28.286,"y":65.423,"x":29.594},{"p_w":true,"p_h":true,"l":"O","z":18.663,"y":56.335,"x":75.52},{"p_w":true,"p_h":true,"l":"O","z":23.476,"y":56.46,"x":66.335},{"p_w":true,"p_h":true,"l":"O","z":26.694,"y":54.282,"x":66.833},{"p_w":true,"p_h":true,"l":"O","z":13.427,"y":44.096,"x":73.65},{"p_w":true,"p_h":true,"l":"O","z":38.777,"y":73.573,"x":46.5},{"p_w":true,"p_h":true,"l":"O","z":35.889,"y":76.683,"x":33.888},{"p_w":true,"p_h":true,"l":"O","z":32.587,"y":75.142,"x":33.743},{"p_w":true,"p_h":true,"l":"O","z":7.718,"y":51.937,"x":48.416},{"p_w":true,"p_h":true,"l":"O","z":14.397,"y":50.449,"x":89.417},{"p_w":true,"p_h":true,"l":"O","z":22.623,"y":64.846,"x":58.24},{"p_w":true,"p_h":true,"l":"O","z":34.128,"y":74.743,"x":51.791},{"p_w":true,"p_h":true,"l":"O","z":28.143,"y":70.802,"x":25.312},{"p_w":true,"p_h":true,"l":"O","z":11.989,"y":49.046,"x":76.425},{"p_w":true,"p_h":true,"l":"O","z":26,"y":31.953,"x":77.005},{"p_w":true,"p_h":true,"l":"O","z":33.752,"y":30.949,"x":75.035},{"p_w":true,"p_h":true,"l":"O","z":1.758,"y":54.023,"x":72.547},{"p_w":true,"p_h":true,"l":"O","z":9.699,"y":54.839,"x":73.615},{"p_w":true,"p_h":true,"l":"O","z":38.539,"y":36.219,"x":76.264},{"p_w":true,"p_h":true,"l":"O","z":34.202,"y":39.448,"x":64.22},{"p_w":true,"p_h":true,"l":"O","z":19.673,"y":55.651,"x":68.443},{"p_w":true,"p_h":true,"l":"O","z":14.67,"y":50.733,"x":68.41},{"p_w":true,"p_h":true,"l":"O","z":30.091,"y":30.401,"x":87.194}]}});
var pdb_1F6S = new ChemDoodle.io.JSONInterpreter().pdbFrom({"ribbons":{"cs":[[{"s":false,"z1":-3.001,"a":false,"y1":99.616,"y2":99.616,"z2":-3.001,"x2":39.13,"h":false,"x1":39.13},{"s":false,"z1":-3.001,"a":false,"y1":99.616,"y2":99.616,"z2":-3.001,"x2":39.13,"h":false,"x1":39.13},{"s":false,"z1":-3.161,"a":false,"y1":98.927,"n":"Glu","y2":98.417,"z2":-0.939,"x2":37.064,"h":false,"x1":37.816},{"s":false,"z1":-0.877,"a":false,"y1":100.493,"n":"Gln","y2":99.884,"z2":-1.734,"x2":33.029,"h":false,"x1":35.195},{"s":false,"z1":0.091,"a":false,"y1":97.822,"n":"Leu","y2":99.58,"z2":1.484,"x2":31.768,"h":false,"x1":32.639},{"s":false,"z1":1.534,"a":false,"y1":98.562,"n":"Thr","y2":96.705,"z2":3.007,"x2":29.601,"h":true,"x1":29.184},{"s":false,"z1":5.002,"a":false,"y1":97.61,"n":"Lys","y2":95.262,"z2":5.515,"x2":27.914,"h":true,"x1":27.932},{"s":false,"z1":3.741,"a":false,"y1":94.62,"n":"Cys","y2":92.465,"z2":3.127,"x2":26.731,"h":true,"x1":25.924},{"s":false,"z1":1.411,"a":false,"y1":93.367,"n":"Glu","y2":91.645,"z2":2.345,"x2":30.028,"h":true,"x1":28.652},{"s":false,"z1":4.489,"a":false,"y1":93.234,"n":"Val","y2":91.233,"z2":5.812,"x2":30.759,"h":true,"x1":30.878},{"s":false,"z1":6.447,"a":false,"y1":91.565,"n":"Phe","y2":89.158,"z2":6.479,"x2":28.238,"h":true,"x1":28.083},{"s":false,"z1":3.747,"a":false,"y1":88.892,"n":"Arg","y2":86.999,"z2":3.948,"x2":29.339,"h":true,"x1":27.864},{"s":false,"z1":3.151,"a":true,"y1":88.378,"n":"Glu","y2":87.124,"z2":4.368,"x2":33.237,"h":true,"x1":31.597},{"s":false,"z1":6.851,"a":false,"y1":88.044,"n":"Leu","y2":86.658,"z2":8.759,"x2":32.034,"h":true,"x1":32.512},{"s":false,"z1":7.419,"a":false,"y1":85.13,"n":"Lys","y2":83.821,"z2":9.376,"x2":30.538,"h":true,"x1":30.115},{"s":false,"z1":8.471,"a":false,"y1":82.716,"n":"Asp","y2":82.445,"z2":10.501,"x2":34.132,"h":true,"x1":32.887},{"s":false,"z1":11.4,"a":true,"y1":84.991,"n":"Leu","y2":85.342,"z2":13.598,"x2":32.908,"h":true,"x1":33.757},{"s":false,"z1":12.884,"a":false,"y1":84.928,"n":"Lys","y2":82.939,"z2":14.138,"x2":30.742,"h":true,"x1":30.278},{"s":false,"z1":16.578,"a":false,"y1":84.207,"n":"Gly","y2":83.239,"z2":18.045,"x2":32.177,"h":true,"x1":30.571},{"s":false,"z1":16.282,"a":false,"y1":83.214,"n":"Tyr","y2":85.197,"z2":17.57,"x2":34.619,"h":true,"x1":34.219},{"s":false,"z1":19.535,"a":false,"y1":83.914,"n":"Gly","y2":85.401,"z2":21.245,"x2":35.257,"h":true,"x1":36.027},{"s":false,"z1":20.707,"a":true,"y1":84.984,"n":"Gly","y2":87.142,"z2":20.834,"x2":31.572,"h":true,"x1":32.599},{"s":false,"z1":18.418,"a":false,"y1":88.011,"n":"Val","y2":87.189,"z2":16.384,"x2":31.597,"h":true,"x1":32.57},{"s":false,"z1":16.665,"a":false,"y1":88.624,"n":"Ser","y2":90.221,"z2":15.29,"x2":30.378,"h":true,"x1":29.251},{"s":false,"z1":13.013,"a":false,"y1":89.556,"n":"Leu","y2":91.826,"z2":12.549,"x2":29.599,"h":true,"x1":28.948},{"s":false,"z1":13.887,"a":false,"y1":93,"n":"Pro","y2":94.766,"z2":13.97,"x2":29.139,"h":true,"x1":27.5},{"s":false,"z1":16.018,"a":false,"y1":93.663,"n":"Glu","y2":94.684,"z2":15.033,"x2":32.523,"h":true,"x1":30.585},{"s":false,"z1":12.993,"a":false,"y1":92.814,"n":"Trp","y2":94.498,"z2":11.436,"x2":33.442,"h":true,"x1":32.746},{"s":false,"z1":10.56,"a":false,"y1":95.053,"n":"Val","y2":97.214,"z2":10.452,"x2":31.963,"h":true,"x1":30.932},{"s":false,"z1":13.103,"a":false,"y1":97.849,"n":"Cys","y2":99.126,"z2":13.007,"x2":33.405,"h":true,"x1":31.379},{"s":false,"z1":13.832,"a":false,"y1":97.057,"n":"Thr","y2":98.137,"z2":12.568,"x2":36.758,"h":true,"x1":35.022},{"s":false,"z1":10.195,"a":false,"y1":96.964,"n":"Thr","y2":98.955,"z2":9.091,"x2":36.846,"h":true,"x1":36.124},{"s":false,"z1":9.44,"a":false,"y1":100.308,"n":"Phe","y2":101.968,"z2":9.514,"x2":36.254,"h":true,"x1":34.516},{"s":false,"z1":12.272,"a":false,"y1":102.079,"n":"His","y2":102.044,"z2":13.048,"x2":38.632,"h":true,"x1":36.355},{"s":false,"z1":11.162,"a":false,"y1":100.291,"n":"Thr","y2":100.842,"z2":9.601,"x2":41.222,"h":true,"x1":39.489},{"s":false,"z1":7.401,"a":true,"y1":100.86,"n":"Ser","y2":101.79,"z2":5.362,"x2":38.728,"h":true,"x1":39.568},{"s":false,"z1":6.35,"a":false,"y1":102.374,"n":"Gly","y2":101.992,"z2":4.243,"x2":35.266,"h":true,"x1":36.285},{"s":false,"z1":4.405,"a":false,"y1":99.187,"n":"Tyr","y2":98.523,"z2":2.131,"x2":35.845,"h":false,"x1":35.422},{"s":false,"z1":2.009,"a":false,"y1":99.775,"n":"Asp","y2":98.568,"z2":2.876,"x2":40.204,"h":false,"x1":38.317},{"s":false,"z1":1.148,"a":false,"y1":96.486,"n":"Thr","y2":96.051,"z2":0.857,"x2":42.384,"h":false,"x1":40.044},{"s":false,"z1":-0.261,"a":false,"y1":98.501,"n":"Gln","y2":100.147,"z2":0.388,"x2":44.591,"h":false,"x1":42.948},{"s":false,"z1":2.866,"a":false,"y1":100.596,"n":"Ala","y2":99.109,"z2":3.475,"x2":45.28,"h":false,"x1":43.509},{"s":true,"z1":3.686,"a":false,"y1":101.126,"n":"Ile","y2":103.46,"z2":4.208,"x2":47.453,"h":false,"x1":47.181},{"s":true,"z1":6.797,"a":false,"y1":102.982,"n":"Val","y2":101.463,"z2":7.821,"x2":49.826,"h":false,"x1":48.311},{"s":true,"z1":8.118,"a":true,"y1":103.289,"n":"Gln","y2":105.532,"z2":8.734,"x2":52.404,"h":false,"x1":51.833},{"s":true,"z1":11.457,"a":false,"y1":104.875,"n":"Asn","y2":103.183,"z2":12.529,"x2":54.056,"h":false,"x1":52.755},{"s":false,"z1":12.719,"a":false,"y1":104.779,"n":"Asn","y2":103.819,"z2":10.668,"x2":57.126,"h":false,"x1":56.331},{"s":false,"z1":11.906,"a":false,"y1":101.459,"n":"Asp","y2":99.137,"z2":11.669,"x2":57.382,"h":false,"x1":57.992},{"s":true,"z1":10.898,"a":false,"y1":99.655,"n":"Ser","y2":101.248,"z2":9.757,"x2":53.439,"h":false,"x1":54.79},{"s":true,"z1":7.913,"a":false,"y1":99.403,"n":"Thr","y2":97.18,"z2":8.164,"x2":51.557,"h":false,"x1":52.468},{"s":true,"z1":8.242,"a":true,"y1":98.053,"n":"Glu","y2":98.835,"z2":6.148,"x2":48.062,"h":false,"x1":48.905},{"s":true,"z1":5.416,"a":false,"y1":96.317,"n":"Tyr","y2":95.025,"z2":6.158,"x2":45.163,"h":false,"x1":47.068},{"s":false,"z1":4.106,"a":false,"y1":95.913,"n":"Gly","y2":97.065,"z2":5.945,"x2":42.549,"h":false,"x1":43.56},{"s":false,"z1":5.45,"a":false,"y1":95.792,"n":"Leu","y2":96.356,"z2":7.731,"x2":39.597,"h":false,"x1":40.048},{"s":false,"z1":8.804,"a":false,"y1":94.519,"n":"Phe","y2":95.124,"z2":10.563,"x2":42.814,"h":false,"x1":41.322},{"s":false,"z1":8.941,"a":false,"y1":96.568,"n":"Gln","y2":95.91,"z2":10.878,"x2":45.8,"h":false,"x1":44.533},{"s":true,"z1":9.648,"a":true,"y1":93.632,"n":"Ile","y2":94.277,"z2":8.38,"x2":48.8,"h":false,"x1":46.869},{"s":true,"z1":10.526,"a":false,"y1":94.932,"n":"Asn","y2":92.738,"z2":10.093,"x2":51.227,"h":false,"x1":50.348},{"s":false,"z1":9.065,"a":false,"y1":93.733,"n":"Asn","y2":93.443,"z2":9.787,"x2":55.909,"h":false,"x1":53.634},{"s":false,"z1":12.468,"a":false,"y1":93.787,"n":"Lys","y2":91.871,"z2":13.133,"x2":56.598,"h":false,"x1":55.32},{"s":false,"z1":13.316,"a":false,"y1":90.186,"n":"Ile","y2":88.035,"z2":12.654,"x2":53.563,"h":false,"x1":54.422},{"s":false,"z1":11.165,"a":false,"y1":89.008,"n":"Trp","y2":87.361,"z2":9.453,"x2":51.63,"h":false,"x1":51.489},{"s":false,"z1":7.488,"a":false,"y1":89.121,"n":"Cys","y2":90.778,"z2":7.693,"x2":54.248,"h":false,"x1":52.523},{"s":false,"z1":5.739,"a":false,"y1":89.721,"n":"Lys","y2":90.212,"z2":3.595,"x2":54.931,"h":false,"x1":55.872},{"s":false,"z1":3.201,"a":false,"y1":92.51,"n":"Asp","y2":92.538,"z2":3.411,"x2":58.792,"h":false,"x1":56.408},{"s":false,"z1":1.711,"a":false,"y1":94.681,"n":"Asp","y2":95.35,"z2":3.142,"x2":60.934,"h":false,"x1":59.145},{"s":false,"z1":4.465,"a":false,"y1":97.299,"n":"Gln","y2":97.054,"z2":6.296,"x2":61.003,"h":false,"x1":59.47},{"s":false,"z1":7.038,"a":false,"y1":94.584,"n":"Asn","y2":92.274,"z2":7.11,"x2":59.472,"h":false,"x1":60.137},{"s":false,"z1":5.662,"a":false,"y1":91.358,"n":"Pro","y2":89.285,"z2":6.858,"x2":61.43,"h":false,"x1":61.668},{"s":false,"z1":9.234,"a":false,"y1":90.31,"n":"His","y2":90.334,"z2":11.312,"x2":61.279,"h":false,"x1":62.476},{"s":false,"z1":10.188,"a":false,"y1":89.919,"n":"Ser","y2":87.537,"z2":10.127,"x2":59.1,"h":false,"x1":58.814},{"s":false,"z1":12.458,"a":false,"y1":87.113,"n":"Ser","y2":85.103,"z2":11.42,"x2":56.837,"h":false,"x1":57.662},{"s":false,"z1":9.764,"a":false,"y1":86.505,"n":"Asn","y2":84.226,"z2":9.717,"x2":54.275,"h":false,"x1":55.049},{"s":false,"z1":12.051,"a":false,"y1":84.491,"n":"Ile","y2":82.766,"z2":11.32,"x2":51.278,"h":false,"x1":52.758},{"s":false,"z1":9.377,"a":false,"y1":84.268,"n":"Cys","y2":83.052,"z2":7.321,"x2":49.892,"h":false,"x1":50.067},{"s":false,"z1":6.967,"a":false,"y1":82.89,"n":"Asn","y2":82.506,"z2":4.853,"x2":51.62,"h":false,"x1":52.679},{"s":false,"z1":4.106,"a":false,"y1":85.117,"n":"Ile","y2":87.213,"z2":4.747,"x2":52.595,"h":false,"x1":51.626},{"s":false,"z1":2.166,"a":false,"y1":88.126,"n":"Ser","y2":88.846,"z2":2.007,"x2":50.536,"h":false,"x1":52.817},{"s":false,"z1":3.25,"a":false,"y1":91.28,"n":"Cys","y2":92.069,"z2":2.199,"x2":48.992,"h":true,"x1":51.002},{"s":false,"z1":-0.32,"a":false,"y1":92.207,"n":"Asp","y2":91.827,"z2":-1.23,"x2":47.878,"h":true,"x1":50.063},{"s":false,"z1":-0.181,"a":false,"y1":89.303,"n":"Lys","y2":89.36,"z2":0.419,"x2":45.266,"h":true,"x1":47.59},{"s":false,"z1":2.16,"a":true,"y1":91.503,"n":"Phe","y2":93.432,"z2":2.083,"x2":44.127,"h":true,"x1":45.546},{"s":false,"z1":-0.501,"a":false,"y1":94.151,"n":"Leu","y2":94.731,"z2":-2.392,"x2":43.5,"h":true,"x1":44.846},{"s":false,"z1":-3.052,"a":false,"y1":92.17,"n":"Asp","y2":92.234,"z2":-1.437,"x2":41.038,"h":false,"x1":42.787},{"s":false,"z1":-3.208,"a":false,"y1":91.425,"n":"Asp","y2":90.025,"z2":-2.019,"x2":37.538,"h":false,"x1":39.06},{"s":false,"z1":-1.815,"a":false,"y1":87.899,"n":"Asp","y2":87.879,"z2":-0.048,"x2":40.876,"h":false,"x1":39.242},{"s":false,"z1":1.986,"a":false,"y1":88.091,"n":"Leu","y2":86.747,"z2":3.935,"x2":39.359,"h":true,"x1":38.96},{"s":false,"z1":2.539,"a":false,"y1":84.364,"n":"Thr","y2":83.79,"z2":4.468,"x2":40.775,"h":true,"x1":39.487},{"s":false,"z1":3.485,"a":false,"y1":84.578,"n":"Asp","y2":85.373,"z2":5.646,"x2":43.842,"h":true,"x1":43.154},{"s":false,"z1":5.412,"a":false,"y1":87.833,"n":"Asp","y2":87.368,"z2":7.771,"x2":42.338,"h":true,"x1":42.54},{"s":false,"z1":7.53,"a":false,"y1":86.05,"n":"Ile","y2":84.819,"z2":9.478,"x2":40.561,"h":true,"x1":39.923},{"s":false,"z1":8.2,"a":false,"y1":83.064,"n":"Met","y2":83.247,"z2":10.256,"x2":43.416,"h":true,"x1":42.188},{"s":false,"z1":9.502,"a":false,"y1":85.513,"n":"Cys","y2":86.259,"z2":11.782,"x2":44.677,"h":true,"x1":44.797},{"s":false,"z1":11.554,"a":false,"y1":87.368,"n":"Val","y2":86.674,"z2":13.868,"x2":42.06,"h":true,"x1":42.186},{"s":false,"z1":13.294,"a":false,"y1":84.063,"n":"Lys","y2":83.528,"z2":15.32,"x2":42.529,"h":true,"x1":41.389},{"s":false,"z1":14.254,"a":false,"y1":83.562,"n":"Lys","y2":84.534,"z2":16.344,"x2":45.697,"h":true,"x1":45.029},{"s":false,"z1":15.644,"a":false,"y1":87.098,"n":"Ile","y2":87.284,"z2":17.974,"x2":44.493,"h":true,"x1":45.036},{"s":false,"z1":17.68,"a":false,"y1":86.455,"n":"Leu","y2":85.578,"z2":19.885,"x2":42.233,"h":true,"x1":41.875},{"s":false,"z1":19.04,"a":false,"y1":83.165,"n":"Asp","y2":83.144,"z2":21.043,"x2":44.518,"h":true,"x1":43.217},{"s":false,"z1":20.109,"a":true,"y1":84.884,"n":"Lys","y2":86.127,"z2":22.125,"x2":46.71,"h":true,"x1":46.425},{"s":false,"z1":21.094,"a":false,"y1":88.544,"n":"Val","y2":89.847,"z2":22.203,"x2":44.359,"h":true,"x1":46.025},{"s":false,"z1":21.001,"a":false,"y1":88.644,"n":"Gly","y2":90.516,"z2":19.513,"x2":42.442,"h":true,"x1":42.244},{"s":false,"z1":19.679,"a":false,"y1":91.131,"n":"Ile","y2":93.45,"z2":19.19,"x2":40.102,"h":true,"x1":39.719},{"s":false,"z1":21.411,"a":true,"y1":93.961,"n":"Asn","y2":95.516,"z2":20.697,"x2":43.293,"h":true,"x1":41.603},{"s":false,"z1":18.504,"a":false,"y1":94.042,"n":"Tyr","y2":96.232,"z2":17.516,"x2":44.14,"h":true,"x1":44.059},{"s":false,"z1":16.999,"a":false,"y1":96.272,"n":"Trp","y2":97.063,"z2":18.628,"x2":39.78,"h":true,"x1":41.355},{"s":false,"z1":19.31,"a":false,"y1":99.27,"n":"Leu","y2":100.151,"z2":20.203,"x2":39.36,"h":true,"x1":41.396},{"s":false,"z1":17.815,"a":false,"y1":100.245,"n":"Ala","y2":99.916,"z2":18.809,"x2":35.908,"h":true,"x1":38.043},{"s":false,"z1":19.148,"a":false,"y1":97.214,"n":"His","y2":97.945,"z2":20.699,"x2":34.453,"h":true,"x1":36.128},{"s":false,"z1":22.815,"a":false,"y1":98.21,"n":"Lys","y2":99.829,"z2":23.421,"x2":34.592,"h":true,"x1":36.258},{"s":false,"z1":22.116,"a":false,"y1":101.918,"n":"Ala","y2":103.014,"z2":22.012,"x2":33.752,"h":true,"x1":35.869},{"s":false,"z1":19.717,"a":true,"y1":101.815,"n":"Leu","y2":100.783,"z2":18.855,"x2":30.933,"h":true,"x1":32.907},{"s":false,"z1":18.908,"a":false,"y1":98.284,"n":"Cys","y2":96.027,"z2":19.575,"x2":31.38,"h":true,"x1":31.829},{"s":false,"z1":22.192,"a":false,"y1":96.708,"n":"Ser","y2":96.241,"z2":23.411,"x2":28.767,"h":false,"x1":30.777},{"s":false,"z1":22.528,"a":false,"y1":98.527,"n":"Glu","y2":99.301,"z2":20.272,"x2":27.447,"h":false,"x1":27.442},{"s":false,"z1":20.097,"a":false,"y1":99.515,"n":"Lys","y2":99.354,"z2":17.999,"x2":25.845,"h":false,"x1":24.697},{"s":false,"z1":17.581,"a":false,"y1":96.708,"n":"Leu","y2":96.162,"z2":15.395,"x2":24.411,"h":true,"x1":25.177},{"s":false,"z1":15.92,"a":false,"y1":96.417,"n":"Asp","y2":96.908,"z2":13.594,"x2":21.471,"h":true,"x1":21.777},{"s":false,"z1":13.734,"a":false,"y1":99.445,"n":"Gln","y2":99.194,"z2":11.445,"x2":23.217,"h":true,"x1":22.54},{"s":false,"z1":12.021,"a":true,"y1":97.336,"n":"Trp","y2":95.363,"z2":10.697,"x2":25.468,"h":true,"x1":25.192},{"s":false,"z1":10.843,"a":false,"y1":94.531,"n":"Leu","y2":95.997,"z2":9.095,"x2":22.145,"h":true,"x1":22.856},{"s":false,"z1":7.321,"a":false,"y1":93.901,"n":"Cys","y2":92.102,"z2":8.044,"x2":20.092,"h":false,"x1":21.496},{"s":false,"z1":5.929,"a":false,"y1":92.315,"n":"Glu","y2":92.313,"z2":3.53,"x2":18.617,"h":false,"x1":18.315},{"s":false,"z1":3.213,"a":false,"y1":89.761,"n":"Lys","y2":89.419,"z2":1.519,"x2":19.051,"h":false,"x1":17.391},{"s":false,"z1":2.649,"a":false,"y1":89.07,"y2":89.419,"z2":1.519,"x2":19.051,"h":false,"x1":18.636},{"s":false,"z1":2.649,"a":false,"y1":89.07,"y2":89.419,"z2":1.519,"x2":19.051,"h":false,"x1":18.636},{"s":false,"z1":2.649,"a":false,"y1":89.07,"y2":89.419,"z2":1.519,"x2":19.051,"h":false,"x1":18.636},{"s":false,"z1":2.649,"a":false,"y1":89.07,"y2":89.419,"z2":1.519,"x2":19.051,"h":false,"x1":18.636}],[{"s":false,"z1":35.299,"a":false,"y1":104.305,"y2":104.305,"z2":35.299,"x2":63.19,"h":false,"x1":63.19},{"s":false,"z1":35.299,"a":false,"y1":104.305,"y2":104.305,"z2":35.299,"x2":63.19,"h":false,"x1":63.19},{"s":false,"z1":34.946,"a":false,"y1":105.518,"n":"Glu","y2":106.186,"z2":37.23,"x2":64.263,"h":false,"x1":63.981},{"s":false,"z1":36.971,"a":false,"y1":106.629,"n":"Gln","y2":108.85,"z2":36.38,"x2":67.68,"h":false,"x1":67.005},{"s":false,"z1":38.248,"a":false,"y1":110.094,"n":"Leu","y2":110.059,"z2":39.131,"x2":68.3,"h":false,"x1":66.057},{"s":false,"z1":39.589,"a":false,"y1":112.799,"n":"Thr","y2":113.781,"z2":40.996,"x2":66.687,"h":true,"x1":68.363},{"s":false,"z1":42.957,"a":false,"y1":114.557,"n":"Lys","y2":115.64,"z2":43.596,"x2":66.465,"h":true,"x1":68.509},{"s":false,"z1":41.643,"a":false,"y1":117.593,"n":"Cys","y2":117.726,"z2":41,"x2":64.274,"h":true,"x1":66.586},{"s":false,"z1":39.332,"a":false,"y1":115.544,"n":"Glu","y2":114.912,"z2":40.089,"x2":62.194,"h":true,"x1":64.386},{"s":false,"z1":42.43,"a":false,"y1":113.731,"n":"Val","y2":114.728,"z2":43.817,"x2":61.435,"h":true,"x1":63.132},{"s":false,"z1":44.302,"a":false,"y1":117.032,"n":"Phe","y2":118.006,"z2":44.704,"x2":60.759,"h":true,"x1":62.906},{"s":false,"z1":42.088,"a":false,"y1":118.566,"n":"Arg","y2":117.95,"z2":42.245,"x2":57.925,"h":true,"x1":60.23},{"s":false,"z1":41.286,"a":true,"y1":115.384,"n":"Glu","y2":114.534,"z2":42.493,"x2":56.402,"h":true,"x1":58.288},{"s":false,"z1":44.949,"a":false,"y1":114.634,"n":"Leu","y2":115.844,"z2":46.93,"x2":57.017,"h":true,"x1":57.6},{"s":false,"z1":45.602,"a":false,"y1":118.09,"n":"Lys","y2":118.499,"z2":47.537,"x2":54.795,"h":true,"x1":56.143},{"s":false,"z1":46.868,"a":false,"y1":116.761,"n":"Asp","y2":115.806,"z2":48.967,"x2":52.122,"h":true,"x1":52.789},{"s":false,"z1":49.683,"a":true,"y1":115,"n":"Leu","y2":115.602,"z2":51.917,"x2":55.27,"h":true,"x1":54.65},{"s":false,"z1":51.221,"a":false,"y1":118.16,"n":"Lys","y2":118.828,"z2":52.403,"x2":54.097,"h":true,"x1":56.078},{"s":false,"z1":54.884,"a":false,"y1":118.243,"n":"Gly","y2":117.092,"z2":56.545,"x2":53.863,"h":true,"x1":55.12},{"s":false,"z1":54.858,"a":false,"y1":115.287,"n":"Tyr","y2":113.998,"z2":55.707,"x2":54.57,"h":true,"x1":52.743},{"s":false,"z1":58.006,"a":false,"y1":113.249,"n":"Gly","y2":113.255,"z2":59.47,"x2":55.156,"h":true,"x1":53.257},{"s":false,"z1":59.019,"a":true,"y1":115.895,"n":"Gly","y2":115.681,"z2":59.121,"x2":58.124,"h":true,"x1":55.757},{"s":false,"z1":56.461,"a":false,"y1":114.943,"n":"Val","y2":116.296,"z2":54.589,"x2":57.801,"h":true,"x1":58.435},{"s":false,"z1":54.389,"a":false,"y1":117.574,"n":"Ser","y2":115.771,"z2":53.192,"x2":61.265,"h":true,"x1":60.265},{"s":false,"z1":50.781,"a":false,"y1":117.119,"n":"Leu","y2":115.55,"z2":50.376,"x2":63.117,"h":true,"x1":61.344},{"s":false,"z1":51.527,"a":false,"y1":117.031,"n":"Pro","y2":114.818,"z2":51.714,"x2":65.986,"h":true,"x1":65.098},{"s":false,"z1":53.873,"a":false,"y1":114.124,"n":"Glu","y2":111.928,"z2":52.889,"x2":64.545,"h":true,"x1":64.395},{"s":false,"z1":51.01,"a":false,"y1":112.436,"n":"Trp","y2":111.039,"z2":49.481,"x2":63.762,"h":true,"x1":62.552},{"s":false,"z1":48.382,"a":false,"y1":113.117,"n":"Val","y2":111.328,"z2":48.209,"x2":66.825,"h":true,"x1":65.215},{"s":false,"z1":50.808,"a":false,"y1":111.676,"n":"Cys","y2":109.293,"z2":50.65,"x2":68.019,"h":true,"x1":67.779},{"s":false,"z1":51.883,"a":false,"y1":108.781,"n":"Thr","y2":106.725,"z2":50.676,"x2":65.753,"h":true,"x1":65.594},{"s":false,"z1":48.336,"a":false,"y1":107.694,"n":"Thr","y2":106.16,"z2":47.123,"x2":66.137,"h":true,"x1":64.749},{"s":false,"z1":47.312,"a":false,"y1":107.695,"n":"Phe","y2":105.493,"z2":47.388,"x2":69.336,"h":true,"x1":68.408},{"s":false,"z1":50.135,"a":false,"y1":105.31,"n":"His","y2":103.144,"z2":50.852,"x2":68.557,"h":true,"x1":69.244},{"s":false,"z1":49.375,"a":false,"y1":103.079,"n":"Thr","y2":101.215,"z2":47.905,"x2":66.135,"h":true,"x1":66.272},{"s":false,"z1":45.598,"a":true,"y1":102.705,"n":"Ser","y2":103.019,"z2":43.509,"x2":67.342,"h":true,"x1":66.225},{"s":false,"z1":44.402,"a":false,"y1":104.948,"n":"Gly","y2":105.836,"z2":42.184,"x2":68.952,"h":true,"x1":69.017},{"s":false,"z1":42.491,"a":false,"y1":107.075,"n":"Tyr","y2":106.88,"z2":40.245,"x2":65.678,"h":false,"x1":66.497},{"s":false,"z1":40.222,"a":false,"y1":104.15,"n":"Asp","y2":102.945,"z2":41.282,"x2":63.774,"h":false,"x1":65.567},{"s":false,"z1":39.588,"a":false,"y1":103.973,"n":"Thr","y2":102.121,"z2":39.366,"x2":60.297,"h":false,"x1":61.806},{"s":false,"z1":38.221,"a":false,"y1":100.437,"n":"Gln","y2":98.249,"z2":38.766,"x2":62.908,"h":false,"x1":62.121},{"s":false,"z1":41.215,"a":false,"y1":99.025,"n":"Ala","y2":98.257,"z2":42.188,"x2":61.912,"h":false,"x1":63.966},{"s":true,"z1":42.276,"a":false,"y1":95.599,"n":"Ile","y2":94.397,"z2":42.662,"x2":64.778,"h":false,"x1":62.749},{"s":true,"z1":45.312,"a":true,"y1":93.87,"n":"Val","y2":93.039,"z2":46.531,"x2":62.32,"h":false,"x1":64.218},{"s":true,"z1":46.869,"a":false,"y1":90.514,"n":"Gln","y2":90.299,"z2":48.155,"x2":65.425,"h":false,"x1":63.428},{"s":false,"z1":50.568,"a":false,"y1":90.039,"n":"Asn","y2":87.762,"z2":50.09,"x2":63.571,"h":false,"x1":64.114},{"s":false,"z1":52.714,"a":false,"y1":87.049,"n":"Asn","y2":85.914,"z2":50.815,"x2":62.228,"h":false,"x1":63.155},{"s":false,"z1":51.486,"a":false,"y1":86.401,"n":"Asp","y2":87.559,"z2":51.71,"x2":57.523,"h":false,"x1":59.631},{"s":false,"z1":49.961,"a":false,"y1":89.63,"n":"Ser","y2":90.307,"z2":48.865,"x2":60.344,"h":false,"x1":58.316},{"s":true,"z1":46.964,"a":false,"y1":91.842,"n":"Thr","y2":93.7,"z2":47.396,"x2":57.637,"h":false,"x1":59.077},{"s":true,"z1":47.052,"a":true,"y1":95.613,"n":"Glu","y2":96.023,"z2":44.937,"x2":60.665,"h":false,"x1":59.618},{"s":true,"z1":44.119,"a":false,"y1":97.856,"n":"Tyr","y2":100.104,"z2":44.878,"x2":58.393,"h":false,"x1":58.735},{"s":false,"z1":42.668,"a":false,"y1":101.213,"n":"Gly","y2":101.608,"z2":44.298,"x2":61.435,"h":false,"x1":59.727},{"s":false,"z1":43.911,"a":false,"y1":104.397,"n":"Leu","y2":104.586,"z2":46.134,"x2":62.178,"h":false,"x1":61.329},{"s":false,"z1":47.35,"a":false,"y1":103.976,"n":"Phe","y2":102.399,"z2":49.124,"x2":59.809,"h":false,"x1":59.798},{"s":false,"z1":47.489,"a":false,"y1":100.235,"n":"Gln","y2":99.438,"z2":49.529,"x2":59.31,"h":false,"x1":60.306},{"s":true,"z1":48.485,"a":true,"y1":99.491,"n":"Ile","y2":97.454,"z2":47.235,"x2":56.669,"h":false,"x1":56.713},{"s":true,"z1":49.352,"a":false,"y1":95.792,"n":"Asn","y2":95.855,"z2":49.06,"x2":53.844,"h":false,"x1":56.252},{"s":false,"z1":48.092,"a":false,"y1":93.188,"n":"Asn","y2":91.306,"z2":48.925,"x2":52.545,"h":false,"x1":53.766},{"s":false,"z1":51.574,"a":false,"y1":91.809,"n":"Lys","y2":91.579,"z2":52.319,"x2":50.936,"h":false,"x1":53.202},{"s":false,"z1":52.632,"a":false,"y1":94.255,"n":"Ile","y2":95.929,"z2":51.987,"x2":48.881,"h":false,"x1":50.474},{"s":false,"z1":50.493,"a":false,"y1":97.411,"n":"Trp","y2":98.104,"z2":48.708,"x2":49.207,"h":false,"x1":50.63},{"s":false,"z1":46.866,"a":false,"y1":96.263,"n":"Cys","y2":94.011,"z2":47.164,"x2":50.923,"h":false,"x1":50.174},{"s":false,"z1":45.189,"a":false,"y1":92.967,"n":"Lys","y2":93.576,"z2":42.941,"x2":49.914,"h":false,"x1":49.365},{"s":false,"z1":42.425,"a":false,"y1":91.196,"n":"Asp","y2":89.101,"z2":43.037,"x2":50.253,"h":false,"x1":51.257},{"s":false,"z1":40.929,"a":false,"y1":87.684,"n":"Asp","y2":85.641,"z2":42.147,"x2":51.601,"h":false,"x1":51.355},{"s":false,"z1":43.574,"a":false,"y1":86.435,"n":"Gln","y2":85.108,"z2":45.381,"x2":52.957,"h":false,"x1":53.801},{"s":false,"z1":46.353,"a":false,"y1":87.064,"n":"Asn","y2":88.801,"z2":46.546,"x2":49.671,"h":false,"x1":51.3},{"s":false,"z1":45.142,"a":false,"y1":87.512,"n":"Pro","y2":88.313,"z2":46.427,"x2":45.832,"h":false,"x1":47.705},{"s":false,"z1":48.821,"a":false,"y1":87.196,"n":"His","y2":88.357,"z2":50.896,"x2":47.09,"h":false,"x1":46.728},{"s":false,"z1":49.738,"a":false,"y1":90.483,"n":"Ser","y2":91.326,"z2":49.691,"x2":46.158,"h":false,"x1":48.4},{"s":false,"z1":52.107,"a":false,"y1":92.674,"n":"Ser","y2":94.258,"z2":51.1,"x2":44.879,"h":false,"x1":46.384},{"s":false,"z1":49.295,"a":false,"y1":95.186,"n":"Asn","y2":96.85,"z2":49.353,"x2":45.091,"h":false,"x1":46.812},{"s":false,"z1":51.512,"a":false,"y1":98.185,"n":"Ile","y2":100.174,"z2":50.716,"x2":45.114,"h":false,"x1":46.165},{"s":false,"z1":48.692,"a":false,"y1":100.617,"n":"Cys","y2":101.145,"z2":46.574,"x2":45.896,"h":false,"x1":46.899},{"s":false,"z1":46.509,"a":false,"y1":98.804,"n":"Asn","y2":99.883,"z2":44.367,"x2":44.353,"h":false,"x1":44.341},{"s":false,"z1":43.502,"a":false,"y1":98.64,"n":"Ile","y2":96.843,"z2":44.07,"x2":48.147,"h":false,"x1":46.64},{"s":false,"z1":41.448,"a":false,"y1":96.368,"n":"Ser","y2":98.11,"z2":41.211,"x2":50.497,"h":false,"x1":48.87},{"s":false,"z1":42.342,"a":false,"y1":96.644,"n":"Cys","y2":98.019,"z2":41.147,"x2":54.124,"h":true,"x1":52.565},{"s":false,"z1":38.696,"a":false,"y1":96.999,"n":"Asp","y2":99.103,"z2":37.689,"x2":54.166,"h":true,"x1":53.604},{"s":false,"z1":38.824,"a":false,"y1":100.49,"n":"Lys","y2":102.544,"z2":39.249,"x2":53.277,"h":true,"x1":52.089},{"s":false,"z1":41.013,"a":true,"y1":101.417,"n":"Phe","y2":101.555,"z2":40.709,"x2":57.468,"h":true,"x1":55.081},{"s":false,"z1":38.111,"a":false,"y1":100.676,"n":"Leu","y2":101.642,"z2":36.178,"x2":58.422,"h":true,"x1":57.404},{"s":false,"z1":35.502,"a":false,"y1":103.228,"n":"Asp","y2":104.687,"z2":36.961,"x2":57.525,"h":false,"x1":56.315},{"s":false,"z1":35.316,"a":false,"y1":106.876,"n":"Asp","y2":109.048,"z2":36.163,"x2":56.859,"h":false,"x1":57.377},{"s":false,"z1":36.81,"a":false,"y1":108.419,"n":"Asp","y2":107.039,"z2":38.707,"x2":53.72,"h":false,"x1":54.254},{"s":false,"z1":40.561,"a":false,"y1":108.792,"n":"Leu","y2":109.136,"z2":42.546,"x2":53.556,"h":true,"x1":54.851},{"s":false,"z1":41.195,"a":false,"y1":109.925,"n":"Thr","y2":109.132,"z2":43.195,"x2":50.225,"h":true,"x1":51.274},{"s":false,"z1":42.421,"a":false,"y1":106.592,"n":"Asp","y2":105.893,"z2":44.628,"x2":50.549,"h":true,"x1":49.947},{"s":false,"z1":44.169,"a":false,"y1":105.691,"n":"Asp","y2":106.071,"z2":46.538,"x2":53.149,"h":true,"x1":53.246},{"s":false,"z1":46.282,"a":false,"y1":108.803,"n":"Ile","y2":108.691,"z2":48.334,"x2":51.488,"h":true,"x1":52.726},{"s":false,"z1":47.165,"a":false,"y1":108.112,"n":"Met","y2":106.927,"z2":49.196,"x2":48.721,"h":true,"x1":49.104},{"s":false,"z1":48.558,"a":false,"y1":104.806,"n":"Cys","y2":104.732,"z2":50.826,"x2":51.109,"h":true,"x1":50.33},{"s":false,"z1":50.413,"a":false,"y1":106.479,"n":"Val","y2":107.024,"z2":52.721,"x2":52.786,"h":true,"x1":53.21},{"s":false,"z1":52.205,"a":false,"y1":108.721,"n":"Lys","y2":107.91,"z2":54.307,"x2":49.892,"h":true,"x1":50.708},{"s":false,"z1":53.299,"a":false,"y1":105.659,"n":"Lys","y2":104.774,"z2":55.436,"x2":49.366,"h":true,"x1":48.75},{"s":false,"z1":54.649,"a":false,"y1":104.094,"n":"Ile","y2":104.595,"z2":56.946,"x2":52.395,"h":true,"x1":51.945},{"s":false,"z1":56.501,"a":false,"y1":107.34,"n":"Leu","y2":107.428,"z2":58.749,"x2":51.904,"h":true,"x1":52.718},{"s":false,"z1":58.038,"a":false,"y1":107.459,"n":"Asp","y2":106.423,"z2":60.129,"x2":48.741,"h":true,"x1":49.224},{"s":false,"z1":59.29,"a":true,"y1":103.912,"n":"Lys","y2":103.267,"z2":61.264,"x2":50.723,"h":true,"x1":49.575},{"s":false,"z1":60.118,"a":false,"y1":103.017,"n":"Val","y2":103.961,"z2":60.995,"x2":55.177,"h":true,"x1":53.169},{"s":false,"z1":59.625,"a":false,"y1":106.302,"n":"Gly","y2":105.327,"z2":57.962,"x2":56.415,"h":true,"x1":54.98},{"s":false,"z1":58.148,"a":false,"y1":107.354,"n":"Ile","y2":106.012,"z2":57.618,"x2":60.202,"h":true,"x1":58.295},{"s":false,"z1":59.833,"a":false,"y1":104.4,"n":"Asn","y2":102.162,"z2":59.172,"x2":60.564,"h":true,"x1":60.044},{"s":false,"z1":57.119,"a":true,"y1":102.062,"n":"Tyr","y2":100.973,"z2":55.934,"x2":60.593,"h":true,"x1":58.803},{"s":false,"z1":55.46,"a":false,"y1":103.382,"n":"Trp","y2":104.564,"z2":57.079,"x2":63.295,"h":true,"x1":61.977},{"s":false,"z1":57.624,"a":false,"y1":102.441,"n":"Leu","y2":104.072,"z2":58.3,"x2":66.6,"h":true,"x1":64.968},{"s":false,"z1":55.73,"a":false,"y1":104.856,"n":"Ala","y2":107.013,"z2":56.485,"x2":67.859,"h":true,"x1":67.189},{"s":false,"z1":57.171,"a":false,"y1":107.852,"n":"His","y2":109.237,"z2":58.651,"x2":66.612,"h":true,"x1":65.35},{"s":false,"z1":60.789,"a":false,"y1":107.542,"n":"Lys","y2":108.251,"z2":61.304,"x2":68.664,"h":true,"x1":66.432},{"s":false,"z1":59.944,"a":false,"y1":106.161,"n":"Ala","y2":107.813,"z2":59.86,"x2":71.619,"h":true,"x1":69.889},{"s":false,"z1":57.306,"a":true,"y1":108.636,"n":"Leu","y2":110.8,"z2":56.325,"x2":71.021,"h":true,"x1":71.117},{"s":false,"z1":56.535,"a":false,"y1":111.107,"n":"Cys","y2":112.598,"z2":57.19,"x2":66.587,"h":true,"x1":68.331},{"s":false,"z1":59.833,"a":false,"y1":112.696,"n":"Ser","y2":115.012,"z2":60.478,"x2":67.425,"h":false,"x1":67.343},{"s":false,"z1":59.949,"a":false,"y1":115.281,"n":"Glu","y2":114.551,"z2":57.911,"x2":71.174,"h":false,"x1":70.136},{"s":false,"z1":57.71,"a":false,"y1":116.764,"n":"Lys","y2":116.331,"z2":55.347,"x2":72.768,"h":true,"x1":72.846},{"s":false,"z1":55.018,"a":false,"y1":117.36,"n":"Leu","y2":118.586,"z2":52.981,"x2":69.931,"h":true,"x1":70.208},{"s":false,"z1":53.389,"a":false,"y1":120.231,"n":"Asp","y2":120.344,"z2":50.999,"x2":72.304,"h":true,"x1":72.102},{"s":false,"z1":50.76,"a":false,"y1":117.868,"n":"Gln","y2":117.203,"z2":48.641,"x2":72.586,"h":true,"x1":73.504},{"s":false,"z1":49.491,"a":true,"y1":117.186,"n":"Trp","y2":118.165,"z2":49.062,"x2":67.81,"h":true,"x1":69.958},{"s":false,"z1":49.001,"a":false,"y1":120.76,"n":"Leu","y2":122.086,"z2":47.308,"x2":69.765,"h":true,"x1":68.73},{"s":false,"z1":45.282,"a":false,"y1":121.274,"n":"Cys","y2":123.335,"z2":46.005,"x2":67.122,"h":false,"x1":68.128},{"s":false,"z1":44.106,"a":false,"y1":124.893,"n":"Glu","y2":124.458,"z2":41.846,"x2":69.108,"h":false,"x1":68.436},{"s":false,"z1":42.686,"a":false,"y1":125.335,"y2":124.458,"z2":41.846,"x2":69.108,"h":false,"x1":68.802},{"s":false,"z1":42.686,"a":false,"y1":125.335,"y2":124.458,"z2":41.846,"x2":69.108,"h":false,"x1":68.802},{"s":false,"z1":42.686,"a":false,"y1":125.335,"y2":124.458,"z2":41.846,"x2":69.108,"h":false,"x1":68.802},{"s":false,"z1":42.686,"a":false,"y1":125.335,"y2":124.458,"z2":41.846,"x2":69.108,"h":false,"x1":68.802}],[{"s":false,"z1":24.307,"a":false,"y1":51.202,"y2":51.202,"z2":24.307,"x2":45.51,"h":false,"x1":45.51},{"s":false,"z1":24.307,"a":false,"y1":51.202,"y2":51.202,"z2":24.307,"x2":45.51,"h":false,"x1":45.51},{"s":false,"z1":24.7,"a":false,"y1":52.492,"n":"Glu","y2":53.171,"z2":22.467,"x2":44.287,"h":false,"x1":44.877},{"s":false,"z1":23.125,"a":false,"y1":53.684,"n":"Gln","y2":55.87,"z2":24.004,"x2":41.168,"h":false,"x1":41.62},{"s":false,"z1":21.847,"a":false,"y1":57.22,"n":"Leu","y2":57.083,"z2":20.702,"x2":40.144,"h":false,"x1":42.246},{"s":false,"z1":20.769,"a":false,"y1":59.842,"n":"Thr","y2":60.791,"z2":19.247,"x2":41.283,"h":true,"x1":39.709},{"s":false,"z1":17.4,"a":false,"y1":61.57,"n":"Lys","y2":62.784,"z2":16.872,"x2":41.371,"h":true,"x1":39.37},{"s":false,"z1":18.608,"a":false,"y1":64.864,"n":"Cys","y2":65.326,"z2":18.961,"x2":43.134,"h":true,"x1":40.817},{"s":false,"z1":20.638,"a":false,"y1":63.182,"n":"Glu","y2":62.786,"z2":19.883,"x2":45.792,"h":true,"x1":43.545},{"s":false,"z1":17.635,"a":false,"y1":61.374,"n":"Val","y2":62.486,"z2":16.169,"x2":46.601,"h":true,"x1":45.047},{"s":false,"z1":15.702,"a":false,"y1":64.649,"n":"Phe","y2":66.074,"z2":15.562,"x2":46.817,"h":true,"x1":44.882},{"s":false,"z1":18.299,"a":false,"y1":65.96,"n":"Arg","y2":65.694,"z2":17.853,"x2":49.677,"h":true,"x1":47.339},{"s":false,"z1":18.499,"a":true,"y1":62.989,"n":"Glu","y2":62.249,"z2":17.014,"x2":51.435,"h":true,"x1":49.709},{"s":false,"z1":14.718,"a":false,"y1":62.631,"n":"Leu","y2":63.878,"z2":12.724,"x2":50.46,"h":true,"x1":50.001},{"s":false,"z1":14.052,"a":false,"y1":66.173,"n":"Lys","y2":66.537,"z2":12.029,"x2":52.467,"h":true,"x1":51.245},{"s":false,"z1":12.788,"a":false,"y1":65.06,"n":"Asp","y2":64.537,"z2":10.515,"x2":55.204,"h":true,"x1":54.658},{"s":false,"z1":9.922,"a":true,"y1":63.418,"n":"Leu","y2":64.241,"z2":7.858,"x2":51.843,"h":true,"x1":52.744},{"s":false,"z1":8.96,"a":false,"y1":66.695,"n":"Lys","y2":67.6,"z2":7.748,"x2":52.944,"h":true,"x1":51.084},{"s":false,"z1":5.275,"a":false,"y1":67.114,"n":"Gly","y2":65.9,"z2":3.415,"x2":52.718,"h":false,"x1":51.847},{"s":false,"z1":4.922,"a":false,"y1":64.35,"n":"Tyr","y2":63.116,"z2":3.914,"x2":52.659,"h":true,"x1":54.453},{"s":false,"z1":1.665,"a":true,"y1":62.427,"n":"Gly","y2":62.286,"z2":0.193,"x2":52.213,"h":true,"x1":54.092},{"s":false,"z1":0.673,"a":false,"y1":64.831,"n":"Gly","y2":64.445,"z2":0.659,"x2":48.992,"h":true,"x1":51.347},{"s":false,"z1":3.31,"a":false,"y1":63.673,"n":"Val","y2":65.055,"z2":5.137,"x2":49.571,"h":false,"x1":48.863},{"s":false,"z1":5.758,"a":false,"y1":65.887,"n":"Ser","y2":64.046,"z2":6.84,"x2":45.884,"h":true,"x1":46.961},{"s":false,"z1":9.378,"a":false,"y1":65.186,"n":"Leu","y2":63.549,"z2":9.668,"x2":44.275,"h":true,"x1":45.997},{"s":false,"z1":8.54,"a":false,"y1":65.023,"n":"Pro","y2":62.834,"z2":8.206,"x2":41.353,"h":true,"x1":42.279},{"s":false,"z1":6.258,"a":false,"y1":62.121,"n":"Glu","y2":59.879,"z2":7.141,"x2":43.189,"h":true,"x1":43.183},{"s":false,"z1":8.941,"a":false,"y1":60.359,"n":"Trp","y2":58.801,"z2":10.4,"x2":44.158,"h":true,"x1":45.24},{"s":false,"z1":11.66,"a":false,"y1":60.746,"n":"Val","y2":58.778,"z2":11.776,"x2":41.236,"h":true,"x1":42.602},{"s":false,"z1":9.302,"a":false,"y1":59.262,"n":"Cys","y2":56.854,"z2":9.369,"x2":39.919,"h":true,"x1":40.023},{"s":false,"z1":7.993,"a":false,"y1":56.526,"n":"Thr","y2":54.428,"z2":9.119,"x2":42.261,"h":true,"x1":42.329},{"s":false,"z1":11.412,"a":false,"y1":55.326,"n":"Thr","y2":53.836,"z2":12.799,"x2":42.242,"h":true,"x1":43.485},{"s":false,"z1":12.631,"a":false,"y1":55.186,"n":"Phe","y2":53.005,"z2":12.526,"x2":38.897,"h":true,"x1":39.892},{"s":false,"z1":9.768,"a":false,"y1":52.884,"n":"His","y2":50.719,"z2":9.076,"x2":39.708,"h":true,"x1":38.935},{"s":false,"z1":10.227,"a":false,"y1":50.993,"n":"Thr","y2":48.98,"z2":11.507,"x2":42.299,"h":true,"x1":42.188},{"s":false,"z1":13.939,"a":true,"y1":50.25,"n":"Ser","y2":50.416,"z2":16.123,"x2":41.381,"h":true,"x1":42.313},{"s":false,"z1":15.487,"a":false,"y1":52.292,"n":"Gly","y2":53.024,"z2":17.753,"x2":39.746,"h":true,"x1":39.535},{"s":false,"z1":17.314,"a":false,"y1":54.4,"n":"Tyr","y2":54.101,"z2":19.469,"x2":43.119,"h":false,"x1":42.137},{"s":false,"z1":19.336,"a":false,"y1":51.402,"n":"Asp","y2":50.481,"z2":18.14,"x2":45.154,"h":false,"x1":43.296},{"s":false,"z1":19.911,"a":false,"y1":51.523,"n":"Thr","y2":49.769,"z2":20.053,"x2":48.673,"h":false,"x1":47.051},{"s":false,"z1":21.124,"a":false,"y1":47.9,"n":"Gln","y2":45.68,"z2":20.378,"x2":46.434,"h":false,"x1":46.944},{"s":false,"z1":18.049,"a":false,"y1":46.49,"n":"Ala","y2":45.883,"z2":16.97,"x2":47.262,"h":false,"x1":45.19},{"s":true,"z1":16.806,"a":false,"y1":43.193,"n":"Ile","y2":41.724,"z2":16.43,"x2":44.721,"h":false,"x1":46.563},{"s":true,"z1":13.736,"a":true,"y1":41.572,"n":"Val","y2":40.894,"z2":12.406,"x2":46.954,"h":false,"x1":45.073},{"s":true,"z1":12.305,"a":false,"y1":38.221,"n":"Gln","y2":37.731,"z2":11.037,"x2":44.172,"h":false,"x1":46.137},{"s":false,"z1":8.589,"a":false,"y1":37.733,"n":"Asn","y2":37.471,"z2":6.944,"x2":47.173,"h":false,"x1":45.423},{"s":false,"z1":6.589,"a":false,"y1":34.732,"n":"Asn","y2":35.476,"z2":5.773,"x2":48.809,"h":false,"x1":46.671},{"s":false,"z1":7.811,"a":false,"y1":34.26,"n":"Asp","y2":36.021,"z2":6.795,"x2":51.518,"h":false,"x1":50.228},{"s":false,"z1":8.68,"a":false,"y1":37.946,"n":"Ser","y2":38.633,"z2":9.959,"x2":48.797,"h":false,"x1":50.712},{"s":true,"z1":11.877,"a":false,"y1":39.95,"n":"Thr","y2":41.888,"z2":11.35,"x2":51.572,"h":false,"x1":50.259},{"s":true,"z1":11.897,"a":true,"y1":43.69,"n":"Glu","y2":43.911,"z2":14.073,"x2":48.514,"h":false,"x1":49.518},{"s":true,"z1":14.887,"a":false,"y1":45.898,"n":"Tyr","y2":48.202,"z2":14.202,"x2":50.292,"h":false,"x1":50.261},{"s":false,"z1":16.556,"a":false,"y1":49.055,"n":"Gly","y2":49.375,"z2":15.007,"x2":47.213,"h":false,"x1":49.031},{"s":false,"z1":15.524,"a":false,"y1":52.165,"n":"Leu","y2":52.472,"z2":13.374,"x2":46.208,"h":false,"x1":47.205},{"s":false,"z1":11.98,"a":false,"y1":51.954,"n":"Phe","y2":50.474,"z2":10.096,"x2":48.579,"h":false,"x1":48.57},{"s":false,"z1":11.641,"a":false,"y1":48.165,"n":"Gln","y2":47.488,"z2":9.54,"x2":49.344,"h":false,"x1":48.369},{"s":true,"z1":10.483,"a":true,"y1":47.726,"n":"Ile","y2":45.662,"z2":11.678,"x2":52.193,"h":false,"x1":51.957},{"s":true,"z1":9.48,"a":false,"y1":44.106,"n":"Asn","y2":44.429,"z2":9.629,"x2":55.015,"h":false,"x1":52.639},{"s":false,"z1":10.607,"a":false,"y1":41.808,"n":"Asn","y2":40.298,"z2":9.554,"x2":56.98,"h":false,"x1":55.454},{"s":false,"z1":7.047,"a":false,"y1":40.625,"n":"Lys","y2":40.761,"z2":5.965,"x2":58.009,"h":false,"x1":55.868},{"s":false,"z1":5.751,"a":false,"y1":43.513,"n":"Ile","y2":44.93,"z2":6.525,"x2":59.752,"h":false,"x1":57.973},{"s":false,"z1":8.19,"a":false,"y1":46.418,"n":"Trp","y2":47.006,"z2":9.891,"x2":59.66,"h":false,"x1":58.112},{"s":false,"z1":11.695,"a":false,"y1":45.146,"n":"Cys","y2":42.881,"z2":11.161,"x2":58.383,"h":false,"x1":58.829},{"s":false,"z1":13.141,"a":false,"y1":41.853,"n":"Lys","y2":42.316,"z2":15.453,"x2":59.534,"h":false,"x1":59.899},{"s":false,"z1":15.994,"a":false,"y1":39.852,"n":"Asp","y2":37.895,"z2":15.219,"x2":59.587,"h":false,"x1":58.441},{"s":false,"z1":17.54,"a":false,"y1":36.427,"n":"Asp","y2":34.399,"z2":16.28,"x2":59.341,"h":false,"x1":59.166},{"s":false,"z1":14.719,"a":false,"y1":34.894,"n":"Gln","y2":36.62,"z2":13.485,"x2":58.204,"h":false,"x1":57.12},{"s":false,"z1":11.261,"a":false,"y1":35.175,"n":"Asn","y2":37.27,"z2":11.291,"x2":59.904,"h":false,"x1":58.708},{"s":false,"z1":12.704,"a":false,"y1":36.364,"n":"Pro","y2":37.607,"z2":11.653,"x2":63.84,"h":false,"x1":62.065},{"s":false,"z1":9.129,"a":false,"y1":36.533,"n":"His","y2":38.17,"z2":7.37,"x2":63.421,"h":false,"x1":63.39},{"s":false,"z1":8.297,"a":false,"y1":39.48,"n":"Ser","y2":40.686,"z2":8.234,"x2":63.192,"h":false,"x1":61.114},{"s":false,"z1":6.043,"a":false,"y1":42.166,"n":"Ser","y2":43.744,"z2":7.178,"x2":63.959,"h":false,"x1":62.541},{"s":false,"z1":9.02,"a":false,"y1":44.487,"n":"Asn","y2":46.18,"z2":8.942,"x2":63.73,"h":false,"x1":62.035},{"s":false,"z1":6.929,"a":false,"y1":47.622,"n":"Ile","y2":49.72,"z2":7.745,"x2":63.321,"h":false,"x1":62.509},{"s":false,"z1":9.922,"a":false,"y1":49.767,"n":"Cys","y2":50.274,"z2":11.965,"x2":62.839,"h":false,"x1":61.683},{"s":false,"z1":11.866,"a":false,"y1":47.955,"n":"Asn","y2":48.923,"z2":14.056,"x2":64.518,"h":false,"x1":64.407},{"s":false,"z1":14.969,"a":false,"y1":47.637,"n":"Ile","y2":45.721,"z2":14.447,"x2":60.885,"h":false,"x1":62.254},{"s":false,"z1":17.099,"a":false,"y1":45.124,"n":"Ser","y2":46.677,"z2":17.48,"x2":58.616,"h":false,"x1":60.406},{"s":false,"z1":16.305,"a":false,"y1":45.087,"n":"Cys","y2":46.155,"z2":17.678,"x2":55.018,"h":true,"x1":56.677},{"s":false,"z1":20.085,"a":false,"y1":45.197,"n":"Asp","y2":47.14,"z2":21.103,"x2":55.09,"h":true,"x1":56.054},{"s":false,"z1":20.06,"a":false,"y1":48.866,"n":"Lys","y2":50.748,"z2":19.809,"x2":55.56,"h":true,"x1":57},{"s":false,"z1":17.986,"a":false,"y1":49.566,"n":"Phe","y2":49.688,"z2":18.47,"x2":51.546,"h":true,"x1":53.891},{"s":false,"z1":20.851,"a":true,"y1":48.279,"n":"Leu","y2":48.881,"z2":22.981,"x2":50.788,"h":true,"x1":51.735},{"s":false,"z1":23.563,"a":false,"y1":50.832,"n":"Asp","y2":52.339,"z2":22.224,"x2":51.315,"h":true,"x1":52.607},{"s":false,"z1":24.074,"a":false,"y1":54.376,"n":"Asp","y2":56.475,"z2":22.946,"x2":51.474,"h":false,"x1":51.28},{"s":false,"z1":22.623,"a":false,"y1":56.344,"n":"Asp","y2":55.115,"z2":20.664,"x2":54.838,"h":false,"x1":54.195},{"s":false,"z1":18.892,"a":false,"y1":56.793,"n":"Leu","y2":57.462,"z2":16.914,"x2":54.708,"h":true,"x1":53.519},{"s":false,"z1":18.251,"a":false,"y1":58.092,"n":"Thr","y2":57.535,"z2":16.004,"x2":57.711,"h":true,"x1":57.051},{"s":false,"z1":16.624,"a":false,"y1":54.992,"n":"Asp","y2":54.542,"z2":14.38,"x2":57.793,"h":true,"x1":58.513},{"s":false,"z1":15.035,"a":false,"y1":54.089,"n":"Asp","y2":54.636,"z2":12.689,"x2":55.179,"h":true,"x1":55.147},{"s":false,"z1":13.113,"a":false,"y1":57.373,"n":"Ile","y2":57.294,"z2":11.034,"x2":56.5,"h":true,"x1":55.305},{"s":false,"z1":12.212,"a":false,"y1":56.821,"n":"Met","y2":55.97,"z2":9.968,"x2":59.071,"h":true,"x1":58.961},{"s":false,"z1":10.611,"a":false,"y1":53.544,"n":"Cys","y2":53.47,"z2":8.356,"x2":57.176,"h":true,"x1":57.952},{"s":false,"z1":8.818,"a":false,"y1":55.098,"n":"Val","y2":55.712,"z2":6.505,"x2":55.243,"h":true,"x1":54.972},{"s":false,"z1":6.971,"a":false,"y1":57.613,"n":"Lys","y2":56.937,"z2":4.79,"x2":57.944,"h":true,"x1":57.16},{"s":false,"z1":5.716,"a":false,"y1":54.691,"n":"Lys","y2":53.812,"z2":3.573,"x2":58.652,"h":true,"x1":59.277},{"s":false,"z1":4.412,"a":false,"y1":53.026,"n":"Ile","y2":53.549,"z2":2.202,"x2":55.35,"h":true,"x1":56.14},{"s":false,"z1":2.692,"a":false,"y1":56.203,"n":"Leu","y2":56.338,"z2":0.413,"x2":55.706,"h":true,"x1":55.01},{"s":false,"z1":0.978,"a":false,"y1":56.784,"n":"Asp","y2":55.637,"z2":-1.044,"x2":58.934,"h":true,"x1":58.356},{"s":false,"z1":-0.053,"a":false,"y1":53.122,"n":"Lys","y2":52.33,"z2":-2.053,"x2":57.334,"h":true,"x1":58.368},{"s":false,"z1":-1.022,"a":true,"y1":52.276,"n":"Val","y2":53.085,"z2":-1.589,"x2":52.607,"h":true,"x1":54.8},{"s":false,"z1":-0.324,"a":false,"y1":55.465,"n":"Gly","y2":54.119,"z2":1.186,"x2":51.619,"h":true,"x1":52.895},{"s":false,"z1":1.353,"a":false,"y1":56.028,"n":"Ile","y2":54.561,"z2":1.775,"x2":47.705,"h":true,"x1":49.539},{"s":false,"z1":-0.533,"a":true,"y1":53.133,"n":"Asn","y2":50.888,"z2":0.079,"x2":47.345,"h":true,"x1":47.912},{"s":false,"z1":2.021,"a":false,"y1":50.681,"n":"Tyr","y2":49.436,"z2":3.354,"x2":47.704,"h":true,"x1":49.284},{"s":false,"z1":3.96,"a":false,"y1":51.683,"n":"Trp","y2":52.847,"z2":2.54,"x2":44.606,"h":true,"x1":46.149},{"s":false,"z1":1.866,"a":false,"y1":50.636,"n":"Leu","y2":52.327,"z2":1.494,"x2":41.489,"h":true,"x1":43.139},{"s":false,"z1":4.198,"a":false,"y1":52.648,"n":"Ala","y2":54.588,"z2":3.201,"x2":39.912,"h":true,"x1":40.911},{"s":false,"z1":2.804,"a":false,"y1":55.9,"n":"His","y2":56.794,"z2":0.733,"x2":41.509,"h":true,"x1":42.309},{"s":false,"z1":-0.764,"a":false,"y1":54.604,"n":"Lys","y2":55.964,"z2":-2.343,"x2":41.241,"h":true,"x1":42.417},{"s":false,"z1":-1.136,"a":false,"y1":55.698,"n":"Ala","y2":57.472,"z2":-0.253,"x2":37.444,"h":true,"x1":38.792},{"s":false,"z1":2.148,"a":true,"y1":56.18,"n":"Leu","y2":58.016,"z2":3.674,"x2":36.692,"h":true,"x1":36.918},{"s":false,"z1":3.459,"a":false,"y1":58.917,"n":"Cys","y2":60.538,"z2":3.028,"x2":40.976,"h":true,"x1":39.256},{"s":false,"z1":0.542,"a":false,"y1":61.237,"n":"Ser","y2":63.21,"z2":-0.606,"x2":39.316,"h":false,"x1":40.054},{"s":false,"z1":0.78,"a":false,"y1":63.384,"n":"Glu","y2":62.752,"z2":2.99,"x2":36.201,"h":false,"x1":36.915},{"s":false,"z1":3.32,"a":false,"y1":64.948,"n":"Lys","y2":64.559,"z2":5.677,"x2":34.802,"h":true,"x1":34.532},{"s":false,"z1":5.73,"a":false,"y1":65.36,"n":"Leu","y2":65.982,"z2":8.033,"x2":37.223,"h":true,"x1":37.462},{"s":false,"z1":7.491,"a":false,"y1":68.06,"n":"Asp","y2":68.009,"z2":9.884,"x2":35.492,"h":true,"x1":35.429},{"s":false,"z1":10.146,"a":false,"y1":65.74,"n":"Gln","y2":64.871,"z2":12.12,"x2":35.056,"h":true,"x1":33.988},{"s":false,"z1":10.875,"a":true,"y1":64.42,"n":"Trp","y2":65.315,"z2":12.103,"x2":39.349,"h":true,"x1":37.492},{"s":false,"z1":11.263,"a":false,"y1":67.929,"n":"Leu","y2":69.013,"z2":12.848,"x2":37.453,"h":true,"x1":38.881},{"s":false,"z1":15.001,"a":false,"y1":68.559,"n":"Cys","y2":70.209,"z2":15.675,"x2":40.716,"h":false,"x1":39.104},{"s":false,"z1":14.732,"a":false,"y1":72.357,"n":"Glu","y2":73.366,"z2":16.615,"x2":38.103,"h":false,"x1":39.211},{"s":false,"z1":18.269,"a":false,"y1":73.192,"n":"Lys","y2":72.958,"z2":19.572,"x2":42.309,"h":false,"x1":40.328},{"s":false,"z1":18.612,"a":false,"y1":73.55,"y2":72.958,"z2":19.572,"x2":42.309,"h":false,"x1":41.767},{"s":false,"z1":18.612,"a":false,"y1":73.55,"y2":72.958,"z2":19.572,"x2":42.309,"h":false,"x1":41.767},{"s":false,"z1":18.612,"a":false,"y1":73.55,"y2":72.958,"z2":19.572,"x2":42.309,"h":false,"x1":41.767},{"s":false,"z1":18.612,"a":false,"y1":73.55,"y2":72.958,"z2":19.572,"x2":42.309,"h":false,"x1":41.767}],[{"s":false,"z1":41.792,"a":false,"y1":79.437,"y2":79.437,"z2":41.792,"x2":88.157,"h":false,"x1":88.157},{"s":false,"z1":41.792,"a":false,"y1":79.437,"y2":79.437,"z2":41.792,"x2":88.157,"h":false,"x1":88.157},{"s":false,"z1":41.768,"a":false,"y1":80.707,"n":"Glu","y2":80.995,"z2":39.404,"x2":89.16,"h":false,"x1":88.944},{"s":false,"z1":39.34,"a":false,"y1":83.407,"n":"Gln","y2":85.419,"z2":39.985,"x2":88.996,"h":false,"x1":87.836},{"s":false,"z1":37.893,"a":false,"y1":85.271,"n":"Leu","y2":86.425,"z2":36.418,"x2":89.336,"h":false,"x1":90.837},{"s":false,"z1":36.081,"a":false,"y1":88.621,"n":"Thr","y2":87.828,"z2":34.776,"x2":92.855,"h":true,"x1":91.002},{"s":false,"z1":32.554,"a":false,"y1":89.404,"n":"Lys","y2":88.598,"z2":32.212,"x2":94.436,"h":true,"x1":92.197},{"s":false,"z1":33.775,"a":false,"y1":90.541,"n":"Cys","y2":89.04,"z2":34.272,"x2":97.423,"h":true,"x1":95.626},{"s":false,"z1":36.264,"a":false,"y1":87.692,"n":"Glu","y2":85.867,"z2":35.357,"x2":97.315,"h":true,"x1":96.046},{"s":false,"z1":33.425,"a":false,"y1":85.243,"n":"Val","y2":84.575,"z2":32.25,"x2":97.372,"h":true,"x1":95.379},{"s":false,"z1":31.188,"a":false,"y1":87.109,"n":"Phe","y2":86.149,"z2":31.201,"x2":100.007,"h":true,"x1":97.815},{"s":false,"z1":33.845,"a":false,"y1":86.741,"n":"Arg","y2":84.792,"z2":34.139,"x2":101.855,"h":true,"x1":100.503},{"s":false,"z1":34.799,"a":true,"y1":83.137,"n":"Glu","y2":81.126,"z2":33.767,"x2":100.57,"h":true,"x1":99.794},{"s":false,"z1":31.186,"a":false,"y1":81.877,"n":"Leu","y2":81.795,"z2":29.321,"x2":101.416,"h":true,"x1":99.897},{"s":false,"z1":30.663,"a":false,"y1":83.238,"n":"Lys","y2":82.388,"z2":28.769,"x2":104.623,"h":true,"x1":103.429},{"s":false,"z1":29.7,"a":false,"y1":79.785,"n":"Asp","y2":78.667,"z2":27.591,"x2":104.836,"h":true,"x1":104.756},{"s":false,"z1":26.742,"a":true,"y1":79.471,"n":"Leu","y2":80.243,"z2":24.465,"x2":102.371,"h":true,"x1":102.359},{"s":false,"z1":25.001,"a":false,"y1":82.609,"n":"Lys","y2":81.421,"z2":23.865,"x2":105.43,"h":true,"x1":103.697},{"s":false,"z1":21.394,"a":false,"y1":81.635,"n":"Gly","y2":79.681,"z2":20.058,"x2":104.497,"h":true,"x1":104.27},{"s":false,"z1":22.022,"a":false,"y1":77.896,"n":"Tyr","y2":77.946,"z2":21.078,"x2":101.674,"h":true,"x1":103.873},{"s":false,"z1":18.88,"a":false,"y1":76.468,"n":"Gly","y2":77.622,"z2":17.39,"x2":100.831,"h":true,"x1":102.31},{"s":false,"z1":17.406,"a":true,"y1":79.983,"n":"Gly","y2":81.587,"z2":17.189,"x2":100.484,"h":true,"x1":102.251},{"s":false,"z1":19.83,"a":false,"y1":81.371,"n":"Val","y2":82.268,"z2":21.575,"x2":101.045,"h":true,"x1":99.664},{"s":false,"z1":21.43,"a":false,"y1":84.809,"n":"Ser","y2":84.428,"z2":22.725,"x2":98.067,"h":true,"x1":100.045},{"s":false,"z1":25.043,"a":false,"y1":85.546,"n":"Leu","y2":85.792,"z2":25.485,"x2":96.729,"h":true,"x1":99.075},{"s":false,"z1":24.041,"a":false,"y1":87.995,"n":"Pro","y2":86.954,"z2":24.027,"x2":94.177,"h":true,"x1":96.348},{"s":false,"z1":22.056,"a":false,"y1":85.145,"n":"Glu","y2":83.709,"z2":23.11,"x2":93.204,"h":true,"x1":94.812},{"s":false,"z1":25.12,"a":false,"y1":82.888,"n":"Trp","y2":82.882,"z2":26.665,"x2":93.064,"h":true,"x1":94.898},{"s":false,"z1":27.388,"a":false,"y1":85.507,"n":"Val","y2":85.304,"z2":27.543,"x2":90.937,"h":true,"x1":93.331},{"s":false,"z1":24.87,"a":false,"y1":85.875,"n":"Cys","y2":84.387,"z2":25.106,"x2":88.644,"h":true,"x1":90.501},{"s":false,"z1":24.488,"a":false,"y1":82.118,"n":"Thr","y2":81.028,"z2":25.926,"x2":88.544,"h":true,"x1":90.102},{"s":false,"z1":28.168,"a":false,"y1":81.229,"n":"Thr","y2":81.433,"z2":29.384,"x2":87.981,"h":true,"x1":90.033},{"s":false,"z1":28.689,"a":false,"y1":84.016,"n":"Phe","y2":83.18,"z2":28.844,"x2":85.25,"h":true,"x1":87.482},{"s":false,"z1":26.192,"a":false,"y1":82.507,"n":"His","y2":80.34,"z2":25.988,"x2":84.025,"h":true,"x1":85.034},{"s":false,"z1":27.422,"a":false,"y1":79.02,"n":"Thr","y2":77.81,"z2":29.039,"x2":84.659,"h":true,"x1":85.943},{"s":false,"z1":31.206,"a":true,"y1":79.245,"n":"Ser","y2":80.466,"z2":33.216,"x2":85.113,"h":true,"x1":85.588},{"s":false,"z1":32.062,"a":false,"y1":82.923,"n":"Gly","y2":83.898,"z2":34.096,"x2":85.938,"h":true,"x1":85.13},{"s":false,"z1":33.872,"a":false,"y1":82.806,"n":"Tyr","y2":82.222,"z2":36.147,"x2":89.016,"h":false,"x1":88.483},{"s":false,"z1":36.381,"a":false,"y1":80.337,"n":"Asp","y2":78.141,"z2":35.63,"x2":87.576,"h":false,"x1":87.018},{"s":false,"z1":37.388,"a":false,"y1":77.788,"n":"Thr","y2":75.456,"z2":37.969,"x2":89.425,"h":false,"x1":89.68},{"s":false,"z1":38.994,"a":false,"y1":75.737,"n":"Gln","y2":74.784,"z2":38.507,"x2":84.763,"h":false,"x1":86.901},{"s":false,"z1":35.89,"a":false,"y1":75.645,"n":"Ala","y2":73.429,"z2":35.551,"x2":85.589,"h":false,"x1":84.746},{"s":true,"z1":35.163,"a":false,"y1":72.327,"n":"Ile","y2":72.573,"z2":34.756,"x2":80.68,"h":false,"x1":83.025},{"s":true,"z1":32.093,"a":false,"y1":71.814,"n":"Val","y2":69.667,"z2":31.41,"x2":81.619,"h":false,"x1":80.831},{"s":true,"z1":31.571,"a":true,"y1":68.461,"n":"Gln","y2":68.538,"z2":30.47,"x2":77.027,"h":false,"x1":79.162},{"s":true,"z1":28.063,"a":false,"y1":67.528,"n":"Asn","y2":65.437,"z2":29.143,"x2":77.546,"h":false,"x1":78.016},{"s":false,"z1":27.003,"a":false,"y1":64.457,"n":"Asn","y2":62.87,"z2":28.815,"x2":76.039,"h":false,"x1":76.022},{"s":false,"z1":28.272,"a":false,"y1":61.947,"n":"Asp","y2":61.316,"z2":28.502,"x2":80.899,"h":false,"x1":78.59},{"s":true,"z1":28.716,"a":false,"y1":63.935,"n":"Ser","y2":65.836,"z2":29.809,"x2":80.851,"h":false,"x1":81.802},{"s":true,"z1":31.286,"a":false,"y1":66.41,"n":"Thr","y2":66.599,"z2":30.842,"x2":85.446,"h":false,"x1":83.096},{"s":true,"z1":30.738,"a":true,"y1":69.359,"n":"Glu","y2":70.639,"z2":32.701,"x2":84.937,"h":false,"x1":85.442},{"s":true,"z1":33.575,"a":false,"y1":70.713,"n":"Tyr","y2":72.049,"z2":32.728,"x2":89.407,"h":false,"x1":87.579},{"s":false,"z1":34.672,"a":false,"y1":74.007,"n":"Gly","y2":75.227,"z2":32.747,"x2":88.29,"h":false,"x1":89.074},{"s":false,"z1":33.036,"a":false,"y1":77.16,"n":"Leu","y2":77.57,"z2":30.763,"x2":89.743,"h":false,"x1":90.349},{"s":false,"z1":29.787,"a":false,"y1":75.358,"n":"Phe","y2":74.01,"z2":28.134,"x2":90.016,"h":false,"x1":91.099},{"s":false,"z1":29.867,"a":false,"y1":73.001,"n":"Gln","y2":71.473,"z2":28.007,"x2":88.236,"h":false,"x1":88.085},{"s":true,"z1":29.251,"a":true,"y1":69.87,"n":"Ile","y2":68.469,"z2":30.737,"x2":88.881,"h":false,"x1":90.156},{"s":true,"z1":28.723,"a":false,"y1":66.871,"n":"Asn","y2":65.274,"z2":29.149,"x2":89.613,"h":false,"x1":87.856},{"s":false,"z1":30.363,"a":false,"y1":63.456,"n":"Asn","y2":61.163,"z2":29.679,"x2":87.677,"h":false,"x1":87.826},{"s":false,"z1":27.007,"a":false,"y1":61.734,"n":"Lys","y2":59.93,"z2":26.526,"x2":88.813,"h":false,"x1":87.329},{"s":false,"z1":26.03,"a":false,"y1":61.474,"n":"Ile","y2":61.632,"z2":26.683,"x2":93.285,"h":false,"x1":90.989},{"s":false,"z1":27.937,"a":false,"y1":64.043,"n":"Trp","y2":63.538,"z2":29.729,"x2":94.552,"h":false,"x1":93.054},{"s":false,"z1":31.66,"a":false,"y1":63.27,"n":"Cys","y2":62.089,"z2":31.38,"x2":90.509,"h":false,"x1":92.575},{"s":false,"z1":33.667,"a":false,"y1":60.574,"n":"Lys","y2":61.407,"z2":35.92,"x2":90.756,"h":false,"x1":90.762},{"s":false,"z1":36.266,"a":false,"y1":60.953,"n":"Asp","y2":58.679,"z2":35.874,"x2":87.342,"h":false,"x1":88.023},{"s":false,"z1":37.759,"a":false,"y1":58.677,"n":"Asp","y2":57.372,"z2":36.525,"x2":83.776,"h":false,"x1":85.351},{"s":false,"z1":35.015,"a":false,"y1":59.49,"n":"Gln","y2":57.721,"z2":33.568,"x2":82.108,"h":false,"x1":82.827},{"s":false,"z1":32.842,"a":false,"y1":56.964,"n":"Asn","y2":57.39,"z2":32.195,"x2":86.94,"h":false,"x1":84.668},{"s":false,"z1":34.145,"a":false,"y1":55.57,"n":"Pro","y2":54.666,"z2":33.122,"x2":89.975,"h":false,"x1":88.011},{"s":false,"z1":30.678,"a":false,"y1":54.2,"n":"His","y2":54.774,"z2":28.416,"x2":89.338,"h":false,"x1":88.794},{"s":false,"z1":28.899,"a":false,"y1":57.458,"n":"Ser","y2":56.703,"z2":29.271,"x2":91.902,"h":false,"x1":89.671},{"s":false,"z1":26.829,"a":false,"y1":57.625,"n":"Ser","y2":57.742,"z2":27.926,"x2":94.988,"h":false,"x1":92.862},{"s":false,"z1":29.555,"a":false,"y1":59.871,"n":"Asn","y2":59.924,"z2":29.635,"x2":96.655,"h":false,"x1":94.238},{"s":false,"z1":27.201,"a":false,"y1":61.24,"n":"Ile","y2":62.018,"z2":28.137,"x2":98.963,"h":false,"x1":96.901},{"s":false,"z1":29.731,"a":false,"y1":63.88,"n":"Cys","y2":63.682,"z2":31.861,"x2":98.996,"h":false,"x1":97.914},{"s":false,"z1":32.183,"a":false,"y1":61.001,"n":"Asn","y2":61.917,"z2":34.258,"x2":99.066,"h":false,"x1":98.282},{"s":false,"z1":35.042,"a":false,"y1":62.858,"n":"Ile","y2":62.699,"z2":34.491,"x2":94.3,"h":false,"x1":96.63},{"s":false,"z1":37.092,"a":false,"y1":62.884,"n":"Ser","y2":65.284,"z2":37.183,"x2":93.453,"h":false,"x1":93.444},{"s":false,"z1":35.838,"a":false,"y1":65.597,"n":"Cys","y2":67.77,"z2":36.805,"x2":90.765,"h":true,"x1":91.051},{"s":false,"z1":39.403,"a":false,"y1":66.894,"n":"Asp","y2":68.956,"z2":40.196,"x2":91.595,"h":true,"x1":90.637},{"s":false,"z1":39.187,"a":false,"y1":68.45,"n":"Lys","y2":70.688,"z2":38.529,"x2":94.661,"h":true,"x1":94.115},{"s":false,"z1":36.707,"a":true,"y1":70.941,"n":"Phe","y2":72.749,"z2":36.749,"x2":91.001,"h":true,"x1":92.594},{"s":false,"z1":39.385,"a":false,"y1":72.427,"n":"Leu","y2":74.055,"z2":41.136,"x2":90.269,"h":true,"x1":90.343},{"s":false,"z1":41.899,"a":false,"y1":73.788,"n":"Asp","y2":75.52,"z2":40.24,"x2":92.948,"h":false,"x1":92.852},{"s":false,"z1":41.674,"a":false,"y1":77.163,"n":"Asp","y2":78.209,"z2":40.65,"x2":96.491,"h":false,"x1":94.611},{"s":false,"z1":40.383,"a":false,"y1":75.946,"n":"Asp","y2":74.348,"z2":38.659,"x2":97.472,"h":false,"x1":97.964},{"s":false,"z1":36.572,"a":false,"y1":76.096,"n":"Leu","y2":75.092,"z2":34.768,"x2":99.208,"h":true,"x1":97.992},{"s":false,"z1":36.255,"a":false,"y1":74.355,"n":"Thr","y2":72.893,"z2":34.349,"x2":101.445,"h":true,"x1":101.358},{"s":false,"z1":35.415,"a":false,"y1":70.933,"n":"Asp","y2":70.467,"z2":33.306,"x2":98.888,"h":true,"x1":99.916},{"s":false,"z1":33.45,"a":false,"y1":72.456,"n":"Asp","y2":72.42,"z2":31.057,"x2":97.36,"h":true,"x1":96.984},{"s":false,"z1":31.181,"a":false,"y1":74.222,"n":"Ile","y2":73.076,"z2":29.258,"x2":100.353,"h":true,"x1":99.496},{"s":false,"z1":30.682,"a":false,"y1":71.101,"n":"Met","y2":69.602,"z2":28.876,"x2":101.158,"h":true,"x1":101.592},{"s":false,"z1":29.459,"a":false,"y1":69.255,"n":"Cys","y2":69.401,"z2":27.125,"x2":98.006,"h":true,"x1":98.501},{"s":false,"z1":27.216,"a":false,"y1":72.172,"n":"Val","y2":72.068,"z2":24.938,"x2":98.271,"h":true,"x1":97.562},{"s":false,"z1":25.522,"a":false,"y1":72.011,"n":"Lys","y2":70.692,"z2":23.549,"x2":101.187,"h":true,"x1":100.967},{"s":false,"z1":24.751,"a":false,"y1":68.337,"n":"Lys","y2":67.798,"z2":22.708,"x2":99.241,"h":true,"x1":100.374},{"s":false,"z1":23.316,"a":false,"y1":69.158,"n":"Ile","y2":69.675,"z2":20.972,"x2":96.966,"h":true,"x1":96.977},{"s":false,"z1":21.152,"a":false,"y1":71.794,"n":"Leu","y2":71.152,"z2":19.008,"x2":99.547,"h":true,"x1":98.708},{"s":false,"z1":19.951,"a":false,"y1":69.399,"n":"Asp","y2":68.165,"z2":17.925,"x2":101.099,"h":true,"x1":101.44},{"s":false,"z1":18.852,"a":true,"y1":66.852,"n":"Lys","y2":66.997,"z2":16.86,"x2":97.568,"h":true,"x1":98.876},{"s":false,"z1":17.96,"a":false,"y1":68.576,"n":"Val","y2":70.409,"z2":16.596,"x2":94.907,"h":true,"x1":95.61},{"s":false,"z1":17.822,"a":false,"y1":72.277,"n":"Gly","y2":72.648,"z2":19.164,"x2":94.481,"h":true,"x1":96.44},{"s":false,"z1":19.005,"a":false,"y1":75.442,"n":"Ile","y2":75.676,"z2":19.481,"x2":92.369,"h":true,"x1":94.707},{"s":false,"z1":17.266,"a":true,"y1":74.302,"n":"Asn","y2":73.429,"z2":18.215,"x2":89.49,"h":true,"x1":91.508},{"s":false,"z1":20.18,"a":false,"y1":72.003,"n":"Tyr","y2":72.608,"z2":21.215,"x2":88.625,"h":true,"x1":90.705},{"s":false,"z1":21.538,"a":false,"y1":75.306,"n":"Trp","y2":76.945,"z2":19.823,"x2":89.087,"h":true,"x1":89.355},{"s":false,"z1":19.262,"a":false,"y1":76.303,"n":"Leu","y2":78.517,"z2":18.397,"x2":86.137,"h":true,"x1":86.454},{"s":false,"z1":20.826,"a":false,"y1":79.773,"n":"Ala","y2":81.663,"z2":19.593,"x2":87.147,"h":true,"x1":86.323},{"s":false,"z1":19.376,"a":false,"y1":80.681,"n":"His","y2":82.263,"z2":17.583,"x2":89.7,"h":true,"x1":89.716},{"s":false,"z1":15.661,"a":false,"y1":80.426,"n":"Lys","y2":82.338,"z2":14.751,"x2":87.816,"h":true,"x1":88.942},{"s":false,"z1":16.154,"a":false,"y1":81.847,"n":"Ala","y2":84.223,"z2":15.996,"x2":85.151,"h":true,"x1":85.46},{"s":false,"z1":18.459,"a":true,"y1":84.813,"n":"Leu","y2":86.571,"z2":19.261,"x2":87.508,"h":true,"x1":86.12},{"s":false,"z1":19.024,"a":false,"y1":85.246,"n":"Cys","y2":85.12,"z2":18.39,"x2":92.134,"h":true,"x1":89.847},{"s":false,"z1":15.727,"a":false,"y1":85.248,"n":"Ser","y2":86.611,"z2":14.328,"x2":93.08,"h":false,"x1":91.712},{"s":false,"z1":14.736,"a":false,"y1":88.93,"n":"Glu","y2":90.404,"z2":16.016,"x2":93.102,"h":false,"x1":91.709},{"s":false,"z1":17.168,"a":false,"y1":91.8,"n":"Lys","y2":90.253,"z2":18.977,"x2":91.338,"h":false,"x1":91.041},{"s":false,"z1":20.348,"a":false,"y1":91.779,"n":"Leu","y2":92.634,"z2":22.497,"x2":93.762,"h":true,"x1":93.133},{"s":false,"z1":21.918,"a":false,"y1":95.242,"n":"Asp","y2":95.131,"z2":24.311,"x2":93.133,"h":true,"x1":93.197},{"s":false,"z1":24.477,"a":false,"y1":94.455,"n":"Gln","y2":93.128,"z2":26.46,"x2":90.572,"h":true,"x1":90.496},{"s":false,"z1":25.571,"a":true,"y1":91.409,"n":"Trp","y2":90.736,"z2":26.701,"x2":94.514,"h":true,"x1":92.522},{"s":false,"z1":26.422,"a":false,"y1":93.173,"n":"Leu","y2":94.421,"z2":28.233,"x2":94.81,"h":true,"x1":95.776},{"s":false,"z1":30.009,"a":false,"y1":93.784,"n":"Cys","y2":94.693,"z2":29.929,"x2":99.039,"h":false,"x1":96.815},{"s":false,"z1":30.123,"a":false,"y1":97.341,"n":"Glu","y2":98.755,"z2":32.039,"x2":98.471,"h":false,"x1":98.192},{"s":false,"z1":33.349,"a":false,"y1":96.927,"n":"Lys","y2":95.315,"z2":35.088,"x2":99.933,"h":false,"x1":100.214},{"s":false,"z1":33.967,"a":false,"y1":95.55,"y2":95.315,"z2":35.088,"x2":99.933,"h":false,"x1":100.443},{"s":false,"z1":33.967,"a":false,"y1":95.55,"y2":95.315,"z2":35.088,"x2":99.933,"h":false,"x1":100.443},{"s":false,"z1":33.967,"a":false,"y1":95.55,"y2":95.315,"z2":35.088,"x2":99.933,"h":false,"x1":100.443},{"s":false,"z1":33.967,"a":false,"y1":95.55,"y2":95.315,"z2":35.088,"x2":99.933,"h":false,"x1":100.443}],[{"s":false,"z1":15.405,"a":false,"y1":78.943,"y2":78.943,"z2":15.405,"x2":57.714,"h":false,"x1":57.714},{"s":false,"z1":15.405,"a":false,"y1":78.943,"y2":78.943,"z2":15.405,"x2":57.714,"h":false,"x1":57.714},{"s":false,"z1":15.201,"a":false,"y1":77.82,"n":"Glu","y2":77.089,"z2":17.459,"x2":59.026,"h":false,"x1":58.676},{"s":false,"z1":16.997,"a":false,"y1":74.519,"n":"Gln","y2":73.823,"z2":16.286,"x2":60.266,"h":false,"x1":58.081},{"s":false,"z1":18.8,"a":false,"y1":73.065,"n":"Leu","y2":71.424,"z2":20.049,"x2":59.868,"h":false,"x1":61.099},{"s":false,"z1":20.307,"a":false,"y1":69.702,"n":"Thr","y2":70.679,"z2":21.624,"x2":63.785,"h":true,"x1":62.038},{"s":false,"z1":23.894,"a":false,"y1":69.221,"n":"Lys","y2":69.965,"z2":24.451,"x2":65.427,"h":true,"x1":63.211},{"s":false,"z1":22.543,"a":false,"y1":68.406,"n":"Cys","y2":70.089,"z2":22.247,"x2":68.364,"h":true,"x1":66.68},{"s":false,"z1":20.526,"a":false,"y1":71.626,"n":"Glu","y2":73.431,"z2":21.729,"x2":67.874,"h":true,"x1":66.83},{"s":false,"z1":23.492,"a":false,"y1":73.739,"n":"Val","y2":74.556,"z2":24.873,"x2":67.547,"h":true,"x1":65.752},{"s":false,"z1":25.525,"a":false,"y1":72.026,"n":"Phe","y2":73.372,"z2":25.965,"x2":70.396,"h":true,"x1":68.46},{"s":false,"z1":23.378,"a":false,"y1":73.326,"n":"Arg","y2":75.572,"z2":23.595,"x2":72.14,"h":true,"x1":71.332},{"s":false,"z1":22.877,"a":true,"y1":76.708,"n":"Glu","y2":78.578,"z2":24.216,"x2":70.397,"h":true,"x1":69.678},{"s":false,"z1":26.552,"a":false,"y1":77.64,"n":"Leu","y2":77.739,"z2":28.495,"x2":70.67,"h":true,"x1":69.263},{"s":false,"z1":27.121,"a":false,"y1":76.762,"n":"Lys","y2":77.49,"z2":29.223,"x2":73.86,"h":true,"x1":72.936},{"s":false,"z1":28.627,"a":false,"y1":80.217,"n":"Asp","y2":81.208,"z2":30.759,"x2":73.13,"h":true,"x1":73.595},{"s":false,"z1":31.264,"a":true,"y1":79.689,"n":"Leu","y2":78.724,"z2":33.443,"x2":70.683,"h":true,"x1":70.898},{"s":false,"z1":32.927,"a":false,"y1":76.56,"n":"Lys","y2":77.992,"z2":34.313,"x2":73.631,"h":true,"x1":72.275},{"s":false,"z1":36.673,"a":false,"y1":77.048,"n":"Gly","y2":78.857,"z2":38.212,"x2":72.41,"h":true,"x1":72.569},{"s":false,"z1":36.376,"a":false,"y1":80.738,"n":"Tyr","y2":80.25,"z2":37.177,"x2":69.482,"h":true,"x1":71.693},{"s":false,"z1":39.503,"a":false,"y1":81.654,"n":"Gly","y2":80.166,"z2":40.786,"x2":68.401,"h":true,"x1":69.766},{"s":false,"z1":40.602,"a":true,"y1":78.044,"n":"Gly","y2":76.124,"z2":40.383,"x2":68.749,"h":true,"x1":70.165},{"s":false,"z1":37.818,"a":false,"y1":76.757,"n":"Val","y2":76.363,"z2":36.098,"x2":69.546,"h":true,"x1":67.921},{"s":false,"z1":35.849,"a":false,"y1":73.662,"n":"Ser","y2":73.937,"z2":34.375,"x2":67.085,"h":true,"x1":68.962},{"s":false,"z1":32.114,"a":false,"y1":73.081,"n":"Leu","y2":72.48,"z2":31.469,"x2":66.192,"h":true,"x1":68.424},{"s":false,"z1":32.897,"a":false,"y1":70.178,"n":"Pro","y2":70.595,"z2":32.951,"x2":63.726,"h":true,"x1":66.088},{"s":false,"z1":34.826,"a":false,"y1":72.617,"n":"Glu","y2":73.813,"z2":33.636,"x2":62.165,"h":true,"x1":63.869},{"s":false,"z1":31.976,"a":false,"y1":75.134,"n":"Trp","y2":74.949,"z2":30.373,"x2":62.184,"h":true,"x1":63.955},{"s":false,"z1":29.317,"a":false,"y1":72.551,"n":"Val","y2":72.378,"z2":28.908,"x2":60.729,"h":true,"x1":63.086},{"s":false,"z1":31.484,"a":false,"y1":71.415,"n":"Cys","y2":72.559,"z2":31.344,"x2":58.068,"h":true,"x1":60.181},{"s":false,"z1":32.276,"a":false,"y1":74.972,"n":"Thr","y2":75.94,"z2":30.824,"x2":57.414,"h":true,"x1":59.071},{"s":false,"z1":28.653,"a":false,"y1":76.126,"n":"Thr","y2":75.679,"z2":27.118,"x2":57.302,"h":true,"x1":59.093},{"s":false,"z1":27.614,"a":false,"y1":73.027,"n":"Phe","y2":73.278,"z2":27.257,"x2":54.814,"h":true,"x1":57.165},{"s":false,"z1":29.859,"a":false,"y1":73.957,"n":"His","y2":75.733,"z2":29.746,"x2":52.652,"h":true,"x1":54.237},{"s":false,"z1":29.23,"a":false,"y1":77.677,"n":"Thr","y2":78.77,"z2":27.54,"x2":53.189,"h":true,"x1":54.483},{"s":false,"z1":25.441,"a":true,"y1":77.878,"n":"Ser","y2":76.81,"z2":23.303,"x2":54.66,"h":true,"x1":54.726},{"s":false,"z1":24.279,"a":false,"y1":74.275,"n":"Gly","y2":73.533,"z2":22.285,"x2":55.798,"h":true,"x1":54.711},{"s":false,"z1":22.782,"a":false,"y1":74.967,"n":"Tyr","y2":75.845,"z2":20.715,"x2":59.017,"h":false,"x1":58.163},{"s":false,"z1":20.178,"a":false,"y1":77.401,"n":"Asp","y2":79.569,"z2":21.22,"x2":56.754,"h":false,"x1":56.812},{"s":false,"z1":19.786,"a":false,"y1":80.564,"n":"Thr","y2":82.867,"z2":19.451,"x2":58.368,"h":false,"x1":58.928},{"s":false,"z1":18.185,"a":false,"y1":82.361,"n":"Gln","y2":82.912,"z2":18.606,"x2":53.682,"h":false,"x1":55.974},{"s":false,"z1":21.004,"a":false,"y1":81.581,"n":"Ala","y2":83.754,"z2":21.916,"x2":54.051,"h":false,"x1":53.572},{"s":true,"z1":22.112,"a":false,"y1":84.464,"n":"Ile","y2":83.573,"z2":22.271,"x2":49.171,"h":false,"x1":51.377},{"s":true,"z1":24.955,"a":true,"y1":84.106,"n":"Val","y2":86.08,"z2":26.301,"x2":49.033,"h":false,"x1":48.873},{"s":true,"z1":25.935,"a":false,"y1":86.786,"n":"Gln","y2":86.252,"z2":27.56,"x2":44.721,"h":false,"x1":46.391},{"s":false,"z1":29.683,"a":false,"y1":86.246,"n":"Asn","y2":88.25,"z2":29.322,"x2":45.222,"h":false,"x1":46.484},{"s":false,"z1":31.662,"a":false,"y1":88.033,"n":"Asn","y2":89.847,"z2":30.358,"x2":42.868,"h":false,"x1":43.749},{"s":false,"z1":30.883,"a":false,"y1":91.571,"n":"Asp","y2":92.988,"z2":29.554,"x2":46.316,"h":false,"x1":44.901},{"s":false,"z1":29.505,"a":false,"y1":91.26,"n":"Ser","y2":89.141,"z2":28.443,"x2":48.081,"h":false,"x1":48.437},{"s":true,"z1":26.498,"a":false,"y1":89.559,"n":"Thr","y2":89.847,"z2":27.258,"x2":52.236,"h":false,"x1":49.987},{"s":true,"z1":26.977,"a":true,"y1":87.198,"n":"Glu","y2":85.874,"z2":24.979,"x2":52.824,"h":false,"x1":52.917},{"s":true,"z1":24.199,"a":false,"y1":86.536,"n":"Tyr","y2":85.467,"z2":25.117,"x2":57.398,"h":false,"x1":55.434},{"s":false,"z1":22.946,"a":false,"y1":83.706,"n":"Gly","y2":82.106,"z2":24.539,"x2":56.743,"h":false,"x1":57.59},{"s":false,"z1":24.39,"a":false,"y1":80.6,"n":"Leu","y2":79.916,"z2":26.567,"x2":58.391,"h":false,"x1":59.133},{"s":false,"z1":27.836,"a":false,"y1":82.195,"n":"Phe","y2":83.227,"z2":29.472,"x2":57.99,"h":false,"x1":59.396},{"s":false,"z1":27.646,"a":false,"y1":84.094,"n":"Gln","y2":85.454,"z2":29.592,"x2":55.836,"h":false,"x1":56.115},{"s":true,"z1":28.672,"a":true,"y1":87.455,"n":"Ile","y2":88.551,"z2":27.32,"x2":55.925,"h":false,"x1":57.564},{"s":true,"z1":29.345,"a":false,"y1":89.917,"n":"Asn","y2":91.944,"z2":29.199,"x2":56.012,"h":false,"x1":54.726},{"s":false,"z1":27.798,"a":false,"y1":93.303,"n":"Asn","y2":95.22,"z2":28.599,"x2":52.751,"h":false,"x1":53.943},{"s":false,"z1":31.243,"a":false,"y1":94.674,"n":"Lys","y2":96.648,"z2":32.035,"x2":54.298,"h":false,"x1":53.196},{"s":false,"z1":32.744,"a":false,"y1":95.388,"n":"Ile","y2":95.671,"z2":32.367,"x2":58.94,"h":false,"x1":56.594},{"s":false,"z1":30.769,"a":false,"y1":93.472,"n":"Trp","y2":94.399,"z2":29.092,"x2":60.649,"h":false,"x1":59.222},{"s":false,"z1":27.079,"a":false,"y1":94.33,"n":"Cys","y2":95.045,"z2":27.315,"x2":56.512,"h":false,"x1":58.778},{"s":false,"z1":25.354,"a":false,"y1":96.985,"n":"Lys","y2":96.149,"z2":23.12,"x2":56.981,"h":false,"x1":56.699},{"s":false,"z1":22.488,"a":false,"y1":96.385,"n":"Asp","y2":98.528,"z2":22.854,"x2":53.276,"h":false,"x1":54.289},{"s":false,"z1":20.733,"a":false,"y1":98.326,"n":"Asp","y2":99.438,"z2":22.153,"x2":49.945,"h":false,"x1":51.53},{"s":false,"z1":22.991,"a":false,"y1":97.103,"n":"Gln","y2":98.742,"z2":24.629,"x2":48.122,"h":false,"x1":48.732},{"s":false,"z1":26.09,"a":false,"y1":98.5,"n":"Asn","y2":98.927,"z2":26.229,"x2":52.822,"h":false,"x1":50.463},{"s":false,"z1":25.233,"a":false,"y1":101.51,"n":"Pro","y2":102.086,"z2":26.562,"x2":54.601,"h":false,"x1":52.69},{"s":false,"z1":28.823,"a":false,"y1":102.746,"n":"His","y2":102.051,"z2":30.623,"x2":54.586,"h":false,"x1":53.138},{"s":false,"z1":29.788,"a":false,"y1":99.383,"n":"Ser","y2":100.645,"z2":29.698,"x2":56.736,"h":false,"x1":54.706},{"s":false,"z1":32.185,"a":false,"y1":99.908,"n":"Ser","y2":100,"z2":31.442,"x2":59.882,"h":false,"x1":57.608},{"s":false,"z1":29.587,"a":false,"y1":97.928,"n":"Asn","y2":98.442,"z2":29.83,"x2":61.907,"h":false,"x1":59.579},{"s":false,"z1":32.033,"a":false,"y1":96.807,"n":"Ile","y2":96.431,"z2":31.4,"x2":64.543,"h":false,"x1":62.263},{"s":false,"z1":29.412,"a":false,"y1":94.666,"n":"Cys","y2":95.294,"z2":27.503,"x2":65.289,"h":false,"x1":63.977},{"s":false,"z1":27.11,"a":false,"y1":97.701,"n":"Asn","y2":97.058,"z2":25.097,"x2":65.109,"h":false,"x1":63.968},{"s":false,"z1":23.971,"a":false,"y1":95.861,"n":"Ile","y2":95.503,"z2":24.321,"x2":60.6,"h":false,"x1":62.943},{"s":false,"z1":21.614,"a":false,"y1":95.39,"n":"Ser","y2":93.047,"z2":21.424,"x2":60.429,"h":false,"x1":60.01},{"s":false,"z1":22.516,"a":false,"y1":92.281,"n":"Cys","y2":90.151,"z2":21.428,"x2":58.299,"h":true,"x1":58.007},{"s":false,"z1":18.875,"a":false,"y1":91.115,"n":"Asp","y2":89.554,"z2":17.941,"x2":59.692,"h":true,"x1":58.142},{"s":false,"z1":19.268,"a":false,"y1":90.538,"n":"Lys","y2":88.458,"z2":19.851,"x2":62.903,"h":true,"x1":61.871},{"s":false,"z1":21.317,"a":true,"y1":87.512,"n":"Phe","y2":85.471,"z2":21.017,"x2":59.489,"h":true,"x1":60.726},{"s":false,"z1":18.387,"a":false,"y1":85.996,"n":"Leu","y2":84.621,"z2":16.442,"x2":59.105,"h":true,"x1":58.822},{"s":false,"z1":16.042,"a":false,"y1":85.246,"n":"Asp","y2":83.429,"z2":17.571,"x2":62.099,"h":false,"x1":61.732},{"s":false,"z1":16.016,"a":false,"y1":82.194,"n":"Asp","y2":81.322,"z2":17.121,"x2":65.968,"h":false,"x1":64.02},{"s":false,"z1":17.769,"a":false,"y1":83.794,"n":"Asp","y2":85.076,"z2":19.567,"x2":66.029,"h":false,"x1":67.001},{"s":false,"z1":21.528,"a":false,"y1":83.236,"n":"Leu","y2":84.242,"z2":23.545,"x2":67.469,"h":true,"x1":66.676},{"s":false,"z1":22.446,"a":false,"y1":85.186,"n":"Thr","y2":86.685,"z2":24.319,"x2":69.749,"h":true,"x1":69.813},{"s":false,"z1":23.304,"a":false,"y1":88.336,"n":"Asp","y2":88.631,"z2":25.298,"x2":66.532,"h":true,"x1":67.841},{"s":false,"z1":24.897,"a":false,"y1":86.426,"n":"Asp","y2":86.409,"z2":27.292,"x2":65.223,"h":true,"x1":64.949},{"s":false,"z1":27.184,"a":false,"y1":84.923,"n":"Ile","y2":85.97,"z2":29.24,"x2":68.193,"h":true,"x1":67.58},{"s":false,"z1":28.155,"a":false,"y1":88.29,"n":"Met","y2":89.049,"z2":30.253,"x2":68.158,"h":true,"x1":69.046},{"s":false,"z1":29.282,"a":false,"y1":89.403,"n":"Cys","y2":88.863,"z2":31.498,"x2":64.861,"h":true,"x1":65.585},{"s":false,"z1":31.147,"a":false,"y1":86.134,"n":"Val","y2":86.12,"z2":33.489,"x2":65.525,"h":true,"x1":64.996},{"s":false,"z1":33.14,"a":false,"y1":86.849,"n":"Lys","y2":88.058,"z2":35.203,"x2":67.96,"h":true,"x1":68.151},{"s":false,"z1":34.065,"a":false,"y1":90.301,"n":"Lys","y2":90.281,"z2":36.2,"x2":65.726,"h":true,"x1":66.839},{"s":false,"z1":35.313,"a":false,"y1":88.606,"n":"Ile","y2":87.97,"z2":37.621,"x2":63.688,"h":true,"x1":63.665},{"s":false,"z1":37.304,"a":false,"y1":86,"n":"Leu","y2":86.632,"z2":39.572,"x2":65.968,"h":true,"x1":65.582},{"s":false,"z1":38.953,"a":false,"y1":88.691,"n":"Asp","y2":89.98,"z2":40.866,"x2":67.062,"h":true,"x1":67.712},{"s":false,"z1":39.832,"a":false,"y1":90.731,"n":"Lys","y2":90.442,"z2":41.72,"x2":63.207,"h":true,"x1":64.641},{"s":false,"z1":40.642,"a":true,"y1":88.417,"n":"Val","y2":86.228,"z2":41.414,"x2":61.122,"h":true,"x1":61.73},{"s":false,"z1":40.391,"a":false,"y1":85.006,"n":"Gly","y2":84.519,"z2":38.924,"x2":61.525,"h":true,"x1":63.362},{"s":false,"z1":38.906,"a":false,"y1":81.74,"n":"Ile","y2":81.094,"z2":38.258,"x2":59.9,"h":true,"x1":62.116},{"s":false,"z1":40.471,"a":true,"y1":82.196,"n":"Asn","y2":82.721,"z2":39.435,"x2":56.563,"h":true,"x1":58.66},{"s":false,"z1":37.554,"a":false,"y1":84.433,"n":"Tyr","y2":83.648,"z2":36.156,"x2":55.863,"h":true,"x1":57.649},{"s":false,"z1":35.831,"a":false,"y1":81.098,"n":"Trp","y2":79.251,"z2":37.358,"x2":56.913,"h":true,"x1":56.975},{"s":false,"z1":37.873,"a":false,"y1":79.534,"n":"Leu","y2":77.213,"z2":38.47,"x2":54.268,"h":true,"x1":54.184},{"s":false,"z1":35.873,"a":false,"y1":76.331,"n":"Ala","y2":74.397,"z2":36.574,"x2":55.874,"h":true,"x1":54.663},{"s":false,"z1":37.387,"a":false,"y1":75.779,"n":"His","y2":73.949,"z2":38.927,"x2":58.177,"h":true,"x1":58.107},{"s":false,"z1":41.029,"a":false,"y1":75.391,"n":"Lys","y2":73.396,"z2":41.835,"x2":56.061,"h":true,"x1":57.123},{"s":false,"z1":40.051,"a":false,"y1":73.541,"n":"Ala","y2":71.223,"z2":39.672,"x2":53.536,"h":true,"x1":53.952},{"s":false,"z1":37.586,"a":true,"y1":70.935,"n":"Leu","y2":69.56,"z2":36.682,"x2":56.927,"h":true,"x1":55.213},{"s":false,"z1":37.262,"a":false,"y1":71.208,"n":"Cys","y2":71.713,"z2":38.257,"x2":61.082,"h":true,"x1":58.959},{"s":false,"z1":40.783,"a":false,"y1":70.864,"n":"Ser","y2":69.254,"z2":42.494,"x2":60.754,"h":false,"x1":60.3},{"s":false,"z1":40.844,"a":false,"y1":67.055,"n":"Glu","y2":66.304,"z2":38.683,"x2":59.605,"h":false,"x1":60.358},{"s":false,"z1":38.673,"a":false,"y1":64.02,"n":"Lys","y2":64.581,"z2":36.414,"x2":60.669,"h":false,"x1":61.216},{"s":false,"z1":35.904,"a":false,"y1":65.885,"n":"Leu","y2":65.574,"z2":33.987,"x2":64.417,"h":true,"x1":63.022},{"s":false,"z1":34.395,"a":false,"y1":62.912,"n":"Asp","y2":62.793,"z2":32.004,"x2":65.038,"h":true,"x1":64.86},{"s":false,"z1":31.596,"a":false,"y1":62.533,"n":"Gln","y2":63.546,"z2":29.424,"x2":62.419,"h":true,"x1":62.295},{"s":false,"z1":30.358,"a":true,"y1":66.014,"n":"Trp","y2":67.031,"z2":28.948,"x2":64.867,"h":true,"x1":63.225},{"s":false,"z1":29.473,"a":false,"y1":65.219,"n":"Leu","y2":64.203,"z2":27.573,"x2":65.806,"h":true,"x1":66.846},{"s":false,"z1":25.77,"a":false,"y1":65.037,"n":"Cys","y2":62.666,"z2":25.507,"x2":67.379,"h":false,"x1":67.706},{"s":false,"z1":24.701,"a":false,"y1":62.162,"n":"Glu","y2":61.582,"z2":25.09,"x2":72.284,"h":false,"x1":70.001},{"s":false,"z1":24.405,"a":false,"y1":62.272,"y2":61.582,"z2":25.09,"x2":72.284,"h":false,"x1":71.496},{"s":false,"z1":24.405,"a":false,"y1":62.272,"y2":61.582,"z2":25.09,"x2":72.284,"h":false,"x1":71.496},{"s":false,"z1":24.405,"a":false,"y1":62.272,"y2":61.582,"z2":25.09,"x2":72.284,"h":false,"x1":71.496},{"s":false,"z1":24.405,"a":false,"y1":62.272,"y2":61.582,"z2":25.09,"x2":72.284,"h":false,"x1":71.496}],[{"s":false,"z1":63.202,"a":false,"y1":60.153,"y2":60.153,"z2":63.202,"x2":75.054,"h":false,"x1":75.054},{"s":false,"z1":63.202,"a":false,"y1":60.153,"y2":60.153,"z2":63.202,"x2":75.054,"h":false,"x1":75.054},{"s":false,"z1":63.796,"a":false,"y1":59.194,"n":"Glu","y2":58.839,"z2":61.541,"x2":73.372,"h":false,"x1":74.087},{"s":false,"z1":62.249,"a":false,"y1":56.792,"n":"Gln","y2":57.132,"z2":63.111,"x2":69.364,"h":false,"x1":71.579},{"s":false,"z1":61.055,"a":false,"y1":58.738,"n":"Leu","y2":56.656,"z2":60.062,"x2":67.843,"h":false,"x1":68.514},{"s":false,"z1":59.948,"a":false,"y1":57.317,"n":"Thr","y2":59.265,"z2":58.641,"x2":64.739,"h":true,"x1":65.187},{"s":false,"z1":56.87,"a":false,"y1":57.924,"n":"Lys","y2":60.264,"z2":56.436,"x2":62.76,"h":true,"x1":63.057},{"s":false,"z1":58.246,"a":false,"y1":60.644,"n":"Cys","y2":62.898,"z2":58.918,"x2":61.223,"h":true,"x1":60.782},{"s":false,"z1":60.321,"a":false,"y1":62.318,"n":"Glu","y2":64.237,"z2":59.201,"x2":64.397,"h":true,"x1":63.484},{"s":false,"z1":57.185,"a":false,"y1":62.751,"n":"Val","y2":64.662,"z2":55.813,"x2":65.137,"h":true,"x1":65.586},{"s":false,"z1":55.411,"a":false,"y1":64.001,"n":"Phe","y2":66.401,"z2":55.202,"x2":62.33,"h":true,"x1":62.47},{"s":false,"z1":57.966,"a":false,"y1":66.825,"n":"Arg","y2":68.799,"z2":57.575,"x2":63.549,"h":true,"x1":62.243},{"s":false,"z1":58.127,"a":true,"y1":67.632,"n":"Glu","y2":68.875,"z2":56.679,"x2":67.397,"h":true,"x1":65.962},{"s":false,"z1":54.348,"a":false,"y1":68.009,"n":"Leu","y2":69.269,"z2":52.511,"x2":65.42,"h":true,"x1":66.336},{"s":false,"z1":54.146,"a":false,"y1":70.582,"n":"Lys","y2":71.849,"z2":52.117,"x2":63.38,"h":true,"x1":63.536},{"s":false,"z1":52.52,"a":false,"y1":73.272,"n":"Asp","y2":73.65,"z2":50.321,"x2":66.581,"h":true,"x1":65.698},{"s":false,"z1":49.558,"a":true,"y1":71.036,"n":"Leu","y2":70.601,"z2":47.493,"x2":65.441,"h":true,"x1":66.559},{"s":false,"z1":48.587,"a":false,"y1":70.76,"n":"Lys","y2":72.772,"z2":47.286,"x2":62.812,"h":true,"x1":62.902},{"s":false,"z1":44.879,"a":false,"y1":71.471,"n":"Gly","y2":72.149,"z2":43.04,"x2":63.989,"h":true,"x1":62.645},{"s":false,"z1":44.538,"a":false,"y1":72.84,"n":"Tyr","y2":70.763,"z2":43.63,"x2":66.974,"h":true,"x1":66.183},{"s":false,"z1":41.145,"a":false,"y1":71.822,"n":"Gly","y2":69.957,"z2":39.765,"x2":66.95,"h":true,"x1":67.549},{"s":false,"z1":40.443,"a":true,"y1":70.078,"n":"Gly","y2":67.744,"z2":40.543,"x2":63.731,"h":true,"x1":64.269},{"s":false,"z1":43.066,"a":false,"y1":67.38,"n":"Val","y2":68.348,"z2":45.121,"x2":64.011,"h":true,"x1":64.773},{"s":false,"z1":45.393,"a":false,"y1":66.601,"n":"Ser","y2":65.221,"z2":46.612,"x2":63.399,"h":true,"x1":61.858},{"s":false,"z1":49.039,"a":false,"y1":65.554,"n":"Leu","y2":63.387,"z2":49.434,"x2":63.025,"h":true,"x1":62.116},{"s":false,"z1":48.232,"a":false,"y1":61.968,"n":"Pro","y2":60.34,"z2":47.818,"x2":62.725,"h":true,"x1":60.977},{"s":false,"z1":45.731,"a":false,"y1":61.752,"n":"Glu","y2":60.832,"z2":46.506,"x2":65.899,"h":true,"x1":63.823},{"s":false,"z1":48.362,"a":false,"y1":62.883,"n":"Trp","y2":61.285,"z2":49.808,"x2":67.418,"h":true,"x1":66.365},{"s":false,"z1":51.138,"a":false,"y1":60.598,"n":"Val","y2":58.505,"z2":51.154,"x2":66.305,"h":true,"x1":65.109},{"s":false,"z1":48.684,"a":false,"y1":57.691,"n":"Cys","y2":56.62,"z2":48.541,"x2":67.501,"h":true,"x1":65.346},{"s":false,"z1":47.367,"a":false,"y1":58.783,"n":"Thr","y2":57.806,"z2":48.501,"x2":70.625,"h":true,"x1":68.748},{"s":false,"z1":50.786,"a":false,"y1":59.248,"n":"Thr","y2":57.301,"z2":51.84,"x2":71.224,"h":true,"x1":70.331},{"s":false,"z1":51.976,"a":false,"y1":55.954,"n":"Phe","y2":54.249,"z2":51.847,"x2":70.544,"h":true,"x1":68.864},{"s":false,"z1":49.09,"a":false,"y1":54.275,"n":"His","y2":54.069,"z2":48.247,"x2":72.928,"h":true,"x1":70.7},{"s":false,"z1":49.401,"a":false,"y1":56.382,"n":"Thr","y2":55.574,"z2":50.619,"x2":75.719,"h":true,"x1":73.833},{"s":false,"z1":53.113,"a":true,"y1":56.238,"n":"Ser","y2":55.255,"z2":55.266,"x2":74.327,"h":true,"x1":74.665},{"s":false,"z1":54.711,"a":false,"y1":54.231,"n":"Gly","y2":54.706,"z2":56.929,"x2":71.157,"h":true,"x1":71.873},{"s":false,"z1":56.516,"a":false,"y1":57.447,"n":"Tyr","y2":58.251,"z2":58.684,"x2":71.503,"h":false,"x1":70.829},{"s":false,"z1":58.505,"a":false,"y1":57.362,"n":"Asp","y2":58.806,"z2":57.247,"x2":75.517,"h":false,"x1":74.075},{"s":false,"z1":59.016,"a":false,"y1":60.855,"n":"Thr","y2":61.662,"z2":58.891,"x2":77.724,"h":false,"x1":75.49},{"s":false,"z1":59.974,"a":false,"y1":59.345,"n":"Gln","y2":57.614,"z2":59.397,"x2":80.374,"h":false,"x1":78.836},{"s":false,"z1":56.994,"a":false,"y1":57.058,"n":"Ala","y2":58.686,"z2":56.086,"x2":80.661,"h":false,"x1":79.153},{"s":true,"z1":55.59,"a":false,"y1":56.842,"n":"Ile","y2":54.552,"z2":55.134,"x2":83.195,"h":false,"x1":82.687},{"s":true,"z1":52.4,"a":true,"y1":54.957,"n":"Val","y2":56.54,"z2":51.193,"x2":84.948,"h":false,"x1":83.615},{"s":true,"z1":51.535,"a":false,"y1":55.121,"n":"Gln","y2":52.82,"z2":51.024,"x2":87.788,"h":false,"x1":87.306},{"s":false,"z1":49.412,"a":false,"y1":53.49,"n":"Asn","y2":55.332,"z2":49.979,"x2":91.414,"h":false,"x1":89.993},{"s":false,"z1":48.5,"a":false,"y1":54.504,"n":"Asn","y2":56.734,"z2":48.027,"x2":94.281,"h":false,"x1":93.556},{"s":false,"z1":46.127,"a":false,"y1":57.229,"n":"Asp","y2":59.496,"z2":46.83,"x2":91.976,"h":false,"x1":92.348},{"s":false,"z1":47.764,"a":false,"y1":59.06,"n":"Ser","y2":57.355,"z2":49.196,"x2":88.568,"h":false,"x1":89.44},{"s":true,"z1":50.74,"a":false,"y1":59.156,"n":"Thr","y2":61.117,"z2":50.201,"x2":85.844,"h":false,"x1":87.103},{"s":true,"z1":50.735,"a":true,"y1":59.967,"n":"Glu","y2":59.167,"z2":52.931,"x2":82.876,"h":false,"x1":83.39},{"s":true,"z1":53.79,"a":false,"y1":61.536,"n":"Tyr","y2":62.516,"z2":53.282,"x2":79.613,"h":false,"x1":81.749},{"s":false,"z1":55.672,"a":false,"y1":61.58,"n":"Gly","y2":60.332,"z2":53.957,"x2":77.373,"h":false,"x1":78.474},{"s":false,"z1":54.711,"a":false,"y1":61.341,"n":"Leu","y2":60.579,"z2":52.552,"x2":74.199,"h":false,"x1":74.824},{"s":false,"z1":51.194,"a":false,"y1":62.593,"n":"Phe","y2":62.034,"z2":49.297,"x2":76.834,"h":false,"x1":75.478},{"s":false,"z1":50.763,"a":false,"y1":60.868,"n":"Gln","y2":61.458,"z2":48.655,"x2":79.868,"h":false,"x1":78.828},{"s":true,"z1":49.481,"a":true,"y1":63.992,"n":"Ile","y2":63.264,"z2":50.547,"x2":82.655,"h":false,"x1":80.644},{"s":true,"z1":48.273,"a":false,"y1":63.136,"n":"Asn","y2":65.416,"z2":48.349,"x2":84.986,"h":false,"x1":84.184},{"s":false,"z1":49.288,"a":false,"y1":64.686,"n":"Asn","y2":65.328,"z2":48.272,"x2":89.605,"h":false,"x1":87.53},{"s":false,"z1":45.712,"a":false,"y1":64.834,"n":"Lys","y2":66.862,"z2":44.584,"x2":89.4,"h":false,"x1":88.773},{"s":false,"z1":44.591,"a":false,"y1":67.908,"n":"Ile","y2":70.087,"z2":45.356,"x2":86.185,"h":false,"x1":86.834},{"s":false,"z1":47.242,"a":false,"y1":69.197,"n":"Trp","y2":70.801,"z2":49.01,"x2":84.551,"h":false,"x1":84.434},{"s":false,"z1":50.679,"a":false,"y1":69.245,"n":"Cys","y2":67.999,"z2":50.237,"x2":88.041,"h":false,"x1":86.052},{"s":false,"z1":52.107,"a":false,"y1":69.384,"n":"Lys","y2":68.628,"z2":54.283,"x2":88.913,"h":false,"x1":89.545},{"s":false,"z1":54.422,"a":false,"y1":66.661,"n":"Asp","y2":66.813,"z2":53.69,"x2":93.107,"h":false,"x1":90.827},{"s":false,"z1":55.466,"a":false,"y1":64.909,"n":"Asp","y2":64.28,"z2":53.835,"x2":95.656,"h":false,"x1":94.035},{"s":false,"z1":52.742,"a":false,"y1":62.24,"n":"Gln","y2":62.606,"z2":50.753,"x2":95.449,"h":false,"x1":94.147},{"s":false,"z1":50.052,"a":false,"y1":64.922,"n":"Asn","y2":67.078,"z2":50.208,"x2":93.013,"h":false,"x1":94.08},{"s":false,"z1":51.47,"a":false,"y1":68.306,"n":"Pro","y2":70.43,"z2":50.703,"x2":94.456,"h":false,"x1":95.271},{"s":false,"z1":48.09,"a":false,"y1":70.031,"n":"His","y2":70.174,"z2":46.032,"x2":93.984,"h":false,"x1":95.218},{"s":false,"z1":47.096,"a":false,"y1":69.103,"n":"Ser","y2":71.496,"z2":47.201,"x2":91.545,"h":false,"x1":91.687},{"s":false,"z1":44.945,"a":false,"y1":71.742,"n":"Ser","y2":73.651,"z2":45.985,"x2":88.96,"h":false,"x1":89.984},{"s":false,"z1":47.983,"a":false,"y1":72.11,"n":"Asn","y2":74.191,"z2":48.158,"x2":86.558,"h":false,"x1":87.741},{"s":false,"z1":45.866,"a":false,"y1":73.731,"n":"Ile","y2":75.324,"z2":47.017,"x2":83.634,"h":false,"x1":85.002},{"s":false,"z1":48.998,"a":false,"y1":73.628,"n":"Cys","y2":73.266,"z2":50.121,"x2":84.956,"h":false,"x1":82.88},{"s":false,"z1":51.106,"a":false,"y1":75.705,"n":"Asn","y2":76.019,"z2":53.415,"x2":84.673,"h":false,"x1":85.244},{"s":false,"z1":54.117,"a":false,"y1":73.398,"n":"Ile","y2":71.476,"z2":53.438,"x2":86.403,"h":false,"x1":85.12},{"s":false,"z1":56.014,"a":false,"y1":70.594,"n":"Ser","y2":69.516,"z2":56.417,"x2":84.701,"h":false,"x1":86.819},{"s":false,"z1":55.205,"a":false,"y1":67.13,"n":"Cys","y2":66.087,"z2":56.567,"x2":83.72,"h":true,"x1":85.379},{"s":false,"z1":58.999,"a":false,"y1":66.575,"n":"Asp","y2":66.466,"z2":60.114,"x2":82.975,"h":true,"x1":85.089},{"s":false,"z1":59.094,"a":false,"y1":68.863,"n":"Lys","y2":68.421,"z2":58.818,"x2":79.692,"h":true,"x1":82.046},{"s":false,"z1":57.104,"a":true,"y1":66.259,"n":"Phe","y2":64.135,"z2":57.517,"x2":79.043,"h":true,"x1":80.066},{"s":false,"z1":59.944,"a":false,"y1":63.752,"n":"Leu","y2":63.179,"z2":62.146,"x2":79.636,"h":true,"x1":80.393},{"s":false,"z1":62.694,"a":false,"y1":65.597,"n":"Asp","y2":65.09,"z2":61.394,"x2":76.551,"h":false,"x1":78.498},{"s":false,"z1":63.271,"a":false,"y1":65.922,"n":"Asp","y2":67.149,"z2":62.534,"x2":72.8,"h":false,"x1":74.726},{"s":false,"z1":61.859,"a":false,"y1":69.408,"n":"Asp","y2":69.529,"z2":59.821,"x2":75.477,"h":false,"x1":74.21},{"s":false,"z1":58.173,"a":false,"y1":68.976,"n":"Leu","y2":70.266,"z2":56.16,"x2":73.193,"h":true,"x1":73.282},{"s":false,"z1":57.418,"a":false,"y1":72.714,"n":"Thr","y2":73.409,"z2":55.348,"x2":74.058,"h":true,"x1":73.078},{"s":false,"z1":56.005,"a":false,"y1":72.829,"n":"Asp","y2":72.04,"z2":53.783,"x2":77.098,"h":true,"x1":76.611},{"s":false,"z1":54.269,"a":false,"y1":69.408,"n":"Asp","y2":69.706,"z2":51.939,"x2":75.754,"h":true,"x1":76.32},{"s":false,"z1":52.504,"a":false,"y1":70.83,"n":"Ile","y2":72.027,"z2":50.438,"x2":73.49,"h":true,"x1":73.265},{"s":false,"z1":51.515,"a":false,"y1":74.022,"n":"Met","y2":73.932,"z2":49.296,"x2":75.966,"h":true,"x1":75.092},{"s":false,"z1":49.854,"a":false,"y1":71.866,"n":"Cys","y2":70.959,"z2":47.656,"x2":77.424,"h":true,"x1":77.709},{"s":false,"z1":48.224,"a":false,"y1":69.624,"n":"Val","y2":70.223,"z2":45.943,"x2":74.621,"h":true,"x1":75.104},{"s":false,"z1":46.582,"a":false,"y1":72.681,"n":"Lys","y2":73.301,"z2":44.385,"x2":74.232,"h":true,"x1":73.495},{"s":false,"z1":45.091,"a":false,"y1":73.6,"n":"Lys","y2":72.745,"z2":42.901,"x2":77.303,"h":true,"x1":76.875},{"s":false,"z1":43.714,"a":false,"y1":70.093,"n":"Ile","y2":69.679,"z2":41.506,"x2":76.57,"h":true,"x1":77.387},{"s":false,"z1":42.083,"a":false,"y1":70.314,"n":"Leu","y2":71.086,"z2":39.823,"x2":73.951,"h":true,"x1":73.966},{"s":false,"z1":40.444,"a":false,"y1":73.663,"n":"Asp","y2":73.629,"z2":38.288,"x2":75.756,"h":true,"x1":74.725},{"s":false,"z1":39.121,"a":false,"y1":72.331,"n":"Lys","y2":71.033,"z2":37.108,"x2":78.098,"h":true,"x1":78.044},{"s":false,"z1":38.307,"a":true,"y1":68.649,"n":"Val","y2":67.061,"z2":37.429,"x2":75.928,"h":true,"x1":77.484},{"s":false,"z1":38.829,"a":false,"y1":67.936,"n":"Gly","y2":66.188,"z2":40.373,"x2":74.397,"h":true,"x1":73.784},{"s":false,"z1":40.543,"a":false,"y1":65.198,"n":"Ile","y2":63.035,"z2":41.153,"x2":72.631,"h":true,"x1":71.791},{"s":false,"z1":38.747,"a":true,"y1":62.539,"n":"Asn","y2":61.237,"z2":39.234,"x2":75.803,"h":true,"x1":73.852},{"s":false,"z1":41.193,"a":false,"y1":62.898,"n":"Tyr","y2":60.897,"z2":42.451,"x2":77.217,"h":true,"x1":76.73},{"s":false,"z1":43.173,"a":false,"y1":60.462,"n":"Trp","y2":59.432,"z2":41.861,"x2":72.799,"h":true,"x1":74.537},{"s":false,"z1":41.076,"a":false,"y1":57.295,"n":"Leu","y2":55.956,"z2":40.716,"x2":72.417,"h":true,"x1":74.367},{"s":false,"z1":43.348,"a":false,"y1":55.926,"n":"Ala","y2":55.908,"z2":42.722,"x2":69.338,"h":true,"x1":71.647},{"s":false,"z1":42.174,"a":false,"y1":58.589,"n":"His","y2":57.746,"z2":40.9,"x2":67.365,"h":true,"x1":69.221},{"s":false,"z1":38.578,"a":false,"y1":57.408,"n":"Lys","y2":55.542,"z2":38.144,"x2":67.411,"h":true,"x1":68.836},{"s":false,"z1":39.369,"a":false,"y1":53.701,"n":"Ala","y2":52.168,"z2":40.087,"x2":67.42,"h":true,"x1":69.1},{"s":false,"z1":42.377,"a":true,"y1":53.501,"n":"Leu","y2":54.132,"z2":43.531,"x2":64.844,"h":true,"x1":66.818},{"s":false,"z1":42.849,"a":false,"y1":56.743,"n":"Cys","y2":58.823,"z2":41.974,"x2":64.163,"h":true,"x1":64.923},{"s":false,"z1":39.47,"a":false,"y1":57.819,"n":"Ser","y2":58.788,"z2":39,"x2":61.415,"h":false,"x1":63.545},{"s":false,"z1":39.367,"a":false,"y1":56.501,"n":"Glu","y2":57.142,"z2":41.076,"x2":58.41,"h":false,"x1":59.98},{"s":false,"z1":42.262,"a":false,"y1":54.581,"n":"Lys","y2":54.707,"z2":44.518,"x2":59.2,"h":true,"x1":58.373},{"s":false,"z1":44.801,"a":false,"y1":57.416,"n":"Leu","y2":58.192,"z2":46.89,"x2":57.795,"h":true,"x1":58.648},{"s":false,"z1":46.772,"a":false,"y1":56.802,"n":"Asp","y2":56.371,"z2":49.136,"x2":55.353,"h":true,"x1":55.452},{"s":false,"z1":49.129,"a":false,"y1":54.658,"n":"Gln","y2":55.218,"z2":51.183,"x2":58.663,"h":true,"x1":57.548},{"s":false,"z1":50.416,"a":true,"y1":57.781,"n":"Trp","y2":60.021,"z2":51.235,"x2":59.336,"h":true,"x1":59.326},{"s":false,"z1":51.397,"a":false,"y1":60.282,"n":"Leu","y2":59.169,"z2":53.448,"x2":56.054,"h":true,"x1":56.638},{"s":false,"z1":55.012,"a":false,"y1":61.461,"n":"Cys","y2":63.263,"z2":56.361,"x2":55.361,"h":false,"x1":56.205},{"s":false,"z1":54.669,"a":false,"y1":63.877,"n":"Glu","y2":64.288,"z2":52.392,"x2":52.598,"h":false,"x1":53.242},{"s":false,"z1":52.854,"a":false,"y1":63.867,"n":"Lys","y2":62.128,"z2":51.227,"x2":49.685,"h":false,"x1":49.865},{"s":false,"z1":51.488,"a":false,"y1":63.249,"y2":62.128,"z2":51.227,"x2":49.685,"h":false,"x1":50.177},{"s":false,"z1":51.488,"a":false,"y1":63.249,"y2":62.128,"z2":51.227,"x2":49.685,"h":false,"x1":50.177},{"s":false,"z1":51.488,"a":false,"y1":63.249,"y2":62.128,"z2":51.227,"x2":49.685,"h":false,"x1":50.177},{"s":false,"z1":51.488,"a":false,"y1":63.249,"y2":62.128,"z2":51.227,"x2":49.685,"h":false,"x1":50.177}]]},"mol":{"b":[{"e":15,"b":0},{"e":16,"b":0},{"e":36,"b":1},{"e":38,"b":1},{"e":48,"b":2},{"e":49,"b":2},{"e":61,"b":3},{"e":62,"b":3},{"e":67,"b":4},{"e":80,"b":5},{"e":81,"b":5}],"a":[{"p_h":true,"z":0.368,"y":88.63,"x":43.041},{"p_h":true,"z":39.247,"y":104.701,"x":53.524},{"p_h":true,"z":19.946,"y":52.876,"x":55.222},{"p_h":true,"z":38.44,"y":72.509,"x":96.036},{"p_h":true,"z":19.89,"y":86.948,"x":64.553},{"p_h":true,"z":59.154,"y":68.898,"x":77.444},{"p_w":true,"p_h":true,"l":"O","z":2.626,"y":98.389,"x":25.073},{"p_w":true,"p_h":true,"l":"O","z":6.681,"y":86.857,"x":26.878},{"p_w":true,"p_h":true,"l":"O","z":5.321,"y":84.569,"x":33.508},{"p_w":true,"p_h":true,"l":"O","z":18.215,"y":80.069,"x":34.507},{"p_w":true,"p_h":true,"l":"O","z":21.716,"y":89.833,"x":32.512},{"p_w":true,"p_h":true,"l":"O","z":23.174,"y":86.974,"x":30.059},{"p_w":true,"p_h":true,"l":"O","z":15.086,"y":99.178,"x":40.312},{"p_w":true,"p_h":true,"l":"O","z":2.57,"y":93.594,"x":41.449},{"p_w":true,"p_h":true,"l":"O","z":17.067,"y":92.983,"x":49.858},{"p_w":true,"p_h":true,"l":"O","z":-1.309,"y":86.832,"x":43.813},{"p_w":true,"p_h":true,"l":"O","z":0.609,"y":91.058,"x":42.198},{"p_w":true,"p_h":true,"l":"O","z":-5.924,"y":89.479,"x":39.921},{"p_w":true,"p_h":true,"l":"O","z":-0.109,"y":87.872,"x":36.087},{"p_w":true,"p_h":true,"l":"O","z":5.77,"y":81.909,"x":38.402},{"p_w":true,"p_h":true,"l":"O","z":0.115,"y":83.391,"x":46.547},{"p_w":true,"p_h":true,"l":"O","z":10.73,"y":80.462,"x":43.515},{"p_w":true,"p_h":true,"l":"O","z":13.893,"y":78.231,"x":41.124},{"p_w":true,"p_h":true,"l":"O","z":21.686,"y":97.18,"x":39.518},{"p_w":true,"p_h":true,"l":"O","z":6.027,"y":92.887,"x":42.838},{"p_w":true,"p_h":true,"l":"O","z":2.668,"y":103.925,"x":36.094},{"p_w":true,"p_h":true,"l":"O","z":-1.369,"y":91.758,"x":28.237},{"p_w":true,"p_h":true,"l":"O","z":2.29,"y":86.088,"x":34.36},{"p_w":true,"p_h":true,"l":"O","z":13.565,"y":81.165,"x":32.699},{"p_w":true,"p_h":true,"l":"O","z":17.838,"y":99.852,"x":22.761},{"p_w":true,"p_h":true,"l":"O","z":24.836,"y":89.295,"x":30.557},{"p_w":true,"p_h":true,"l":"O","z":-1.462,"y":91.843,"x":35.693},{"p_w":true,"p_h":true,"l":"O","z":53.538,"y":103.115,"x":65.094},{"p_w":true,"p_h":true,"l":"O","z":54.422,"y":100.419,"x":63.693},{"p_w":true,"p_h":true,"l":"O","z":48.805,"y":97.771,"x":64.718},{"p_w":true,"p_h":true,"l":"O","z":41.251,"y":104.09,"x":58.886},{"p_w":true,"p_h":true,"l":"O","z":39.541,"y":104.183,"x":56.028},{"p_w":true,"p_h":true,"l":"O","z":55.937,"y":96.89,"x":54.966},{"p_w":true,"p_h":true,"l":"O","z":37.659,"y":104.899,"x":51.408},{"p_w":true,"p_h":true,"l":"O","z":38.836,"y":103.747,"x":47.267},{"p_w":true,"p_h":true,"l":"O","z":30.079,"y":107.505,"x":58.335},{"p_w":true,"p_h":true,"l":"O","z":59.783,"y":102.964,"x":44.697},{"p_w":true,"p_h":true,"l":"O","z":56.055,"y":102.508,"x":42.493},{"p_w":true,"p_h":true,"l":"O","z":61.103,"y":107.88,"x":62.716},{"p_w":true,"p_h":true,"l":"O","z":44.59,"y":102.989,"x":57.428},{"p_w":true,"p_h":true,"l":"O","z":35.341,"y":102.832,"x":65.233},{"p_w":true,"p_h":true,"l":"O","z":43.71,"y":90.951,"x":65.829},{"p_w":true,"p_h":true,"l":"O","z":47.118,"y":104.196,"x":46.916},{"p_w":true,"p_h":true,"l":"O","z":19.747,"y":52.4,"x":52.732},{"p_w":true,"p_h":true,"l":"O","z":21.675,"y":52.908,"x":57.542},{"p_w":true,"p_h":true,"l":"O","z":14.57,"y":51.411,"x":51.02},{"p_w":true,"p_h":true,"l":"O","z":24.077,"y":49.738,"x":43.607},{"p_w":true,"p_h":true,"l":"O","z":17.994,"y":51.956,"x":50.025},{"p_w":true,"p_h":true,"l":"O","z":36.949,"y":89.436,"x":104.607},{"p_w":true,"p_h":true,"l":"O","z":32.847,"y":80.155,"x":102.727},{"p_w":true,"p_h":true,"l":"O","z":29.855,"y":78.756,"x":108.164},{"p_w":true,"p_h":true,"l":"O","z":23.411,"y":78.595,"x":100.333},{"p_w":true,"p_h":true,"l":"O","z":35.865,"y":75.502,"x":91.835},{"p_w":true,"p_h":true,"l":"O","z":32.932,"y":73.698,"x":92.138},{"p_w":true,"p_h":true,"l":"O","z":39.564,"y":62.648,"x":89.24},{"p_w":true,"p_h":true,"l":"O","z":43.361,"y":69.333,"x":95.152},{"p_w":true,"p_h":true,"l":"O","z":39.968736,"y":71.238,"x":97.44},{"p_w":true,"p_h":true,"l":"O","z":38.057,"y":73.791,"x":94.201},{"p_w":true,"p_h":true,"l":"O","z":15.61,"y":85.344,"x":88.406},{"p_w":true,"p_h":true,"l":"O","z":36.486,"y":75.541,"x":81.306},{"p_w":true,"p_h":true,"l":"O","z":32.089,"y":103.738,"x":56.905},{"p_w":true,"p_h":true,"l":"O","z":21.774,"y":82.788,"x":60.859},{"p_w":true,"p_h":true,"l":"O","z":19.845,"y":85.096,"x":62.878},{"p_w":true,"p_h":true,"l":"O","z":24.891,"y":84.457,"x":60.422},{"p_w":true,"p_h":true,"l":"O","z":21.294,"y":81.036,"x":50.443},{"p_w":true,"p_h":true,"l":"O","z":36.005,"y":89.942,"x":42.782},{"p_w":true,"p_h":true,"l":"O","z":33.728,"y":79.326,"x":54.529},{"p_w":true,"p_h":true,"l":"O","z":38.527,"y":61.848,"x":63.519},{"p_w":true,"p_h":true,"l":"O","z":58.459,"y":54.24,"x":63.379},{"p_w":true,"p_h":true,"l":"O","z":39.668,"y":65.398,"x":64.187},{"p_w":true,"p_h":true,"l":"O","z":57.41,"y":52.127,"x":70.038},{"p_w":true,"p_h":true,"l":"O","z":62.933,"y":64.904,"x":63.951},{"p_w":true,"p_h":true,"l":"O","z":60.705,"y":68.903,"x":70.559},{"p_w":true,"p_h":true,"l":"O","z":45.969,"y":69.584,"x":67.487},{"p_w":true,"p_h":true,"l":"O","z":41.811,"y":64.527,"x":82.831},{"p_w":true,"p_h":true,"l":"O","z":60.7,"y":70.799,"x":78.524},{"p_w":true,"p_h":true,"l":"O","z":58.95,"y":66.527,"x":77.249},{"p_w":true,"p_h":true,"l":"O","z":45.684,"y":77.029,"x":74.14},{"p_w":true,"p_h":true,"l":"O","z":39.175,"y":59.176,"x":71.849},{"p_w":true,"p_h":true,"l":"O","z":53.865,"y":64.505,"x":77.336},{"p_w":true,"p_h":true,"l":"O","z":57.303,"y":63.792,"x":76.377},{"p_w":true,"p_h":true,"l":"O","z":45.177,"y":57.685,"x":74.337},{"p_w":true,"p_h":true,"l":"O","z":63.219,"y":57.679,"x":76.209},{"p_w":true,"p_h":true,"l":"O","z":47.237,"y":67.72,"x":59.473},{"p_w":true,"p_h":true,"l":"O","z":48.909,"y":56.201,"x":80.04},{"p_w":true,"p_h":true,"l":"O","z":46.414,"y":59.59,"x":78.909},{"p_w":true,"p_h":true,"l":"O","z":51.061,"y":75.108,"x":79.882},{"p_w":true,"p_h":true,"l":"O","z":59.001,"y":74.194,"x":80.83},{"p_w":true,"p_h":true,"l":"O","z":39.063,"y":68.049,"x":70.031},{"p_w":true,"p_h":true,"l":"O","z":37.829,"y":60.899,"x":69.178}]}});
var mol_GLYCINE = 'Glycine\n  -ISIS-            3D\nd36 C2H5O2N NCC(O)=O\n 10  9  0  0  0  0  0  0  0  0  0\n    0.0000    0.0000    0.0000 N   0  0  0  0  0\n    1.4638    0.0000    0.0000 C   0  0  0  0  0\n    1.9497    1.4586    0.0000 C   0  0  0  0  0\n    1.9908    2.2067    0.9761 O   0  0  0  0  0\n    2.3831    1.9151   -1.2001 O   0  0  0  0  0\n   -0.3529    0.1725    0.9291 H   0  0  0  0  0\n   -0.3331   -0.9177   -0.2515 H   0  0  0  0  0\n    2.6573    2.8242   -1.2173 H   0  0  0  0  0\n    1.8326   -0.5442   -0.9027 H   0  0  0  0  0\n    1.9140   -0.5197    0.8843 H   0  0  0  0  0\n  1  2  1  0  0  0\n  1  6  1  0  0  0\n  1  7  1  0  0  0\n  2  3  1  0  0  0\n  2  9  1  0  0  0\n  2 10  1  0  0  0\n  3  4  2  0  0  0\n  3  5  1  0  0  0\n  5  8  1  0  0  0\nM  END';
(function() {


}).call(this);
// == menu click events ==
$(function() { // jQuery document ready

  // Display Modes.
  // Set 'Ball and Stick'.
  $("#BS").click(function() {
    $(this).addClass("success");
    $("#SF").removeClass("success");
    $("#WF").removeClass("success");
    viewer.specs.set3DRepresentation('Ball and Stick');
    viewer.updateScene()
  });

  // Set 'Space Filling'.
  $("#SF").click(function() {
    $(this).addClass("success");
    $("#BS").removeClass("success");
    $("#WF").removeClass("success");
    viewer.specs.set3DRepresentation('van der Waals Spheres');
    viewer.updateScene()
  });

  // Set 'Wireframe'.
  $("#WF").click(function() {
    $(this).addClass("success");
    $("#BS").removeClass("success");
    $("#SF").removeClass("success");
    viewer.specs.set3DRepresentation('Wireframe');
    viewer.updateScene()
  });

  // Togle amino acid labels.
  $("#Labs").click(function() {
    viewer.specs.atoms_displayLabels_3D =! viewer.specs.atoms_displayLabels_3D;
    viewer.updateScene()
  }); // End display modes.

  // // Count nitrogen atoms test.
  // $("#test").click(function() {
  //   alert(ChemDoodle.countNitrogens(file));
  // });

  // Load models
  var model;
  $("#PS").change(function() {
    model = $("#PS").val();
    switch(model) {
      case "4F5S":
        file = pdb_4F5S;
        viewer.loadMolecule(file);
        break;
      case "1BEB":
        file = pdb_1BEB;
        viewer.loadMolecule(file);
        break;
      case "1BLF":
        file = pdb_1BLF;
        viewer.loadMolecule(file);
        break;
      case "1B8E":
        file = pdb_1B8E;
        viewer.loadMolecule(file);
        break;
      case "1F6S":
        file = pdb_1F6S;
        viewer.loadMolecule(file);
        break;
    }
  });

  // Right click canvas popup.
  $("#viewer").bind('contextmenu', function(e) {
    // $("#header").css("background-color", "#F49AC2");
    // $("#header").text("Testing.");
    $("#popup").css({
      top: e.pageY - 19,
      left: e.pageX + 6
    }).fadeIn('fast');

    //popupViewer.startAnimation();
    return false;
  });

  // Close popup.
  // Click.
  $("#close").click(function() {
    $("#popup").fadeOut("fast");
    //popupViewer.stopAnimation();
  });
  // Escape key.
  $(document).keydown(function(e) {
    if (e.keyCode == 27) {
      $("#popup").fadeOut("fast");
      //popupViewer.stopAnimation();
    };
  });

});
// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//






// Available components
// require foundation/foundation
// require foundation/foundation.abide
// require foundation/foundation.alerts
// require foundation/foundation.clearing
// require foundation/foundation.cookie
// require foundation/foundation.dropdown
// require foundation/foundation.forms
// require foundation/foundation.magellan
// require foundation/foundation.orbit
// require foundation/foundation.reveal
// require foundation/foundation.section
// require foundation/foundation.tooltip
// require foundation/foundation.topbar
// require foundation/foundation.interchange
// require foundation/foundation.placeholder





$(function(){ $(document).foundation(); });