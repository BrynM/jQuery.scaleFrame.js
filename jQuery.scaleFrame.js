(function( jQ ) {
	jQ.fn.scaleFrame = function( opts, ele, onlyFirst ) {
		var classRgx = /\w/
			, cssFl = null
			, currOpts = null
			, jE       = ( typeof(ele) == 'object' ) ? jQ(ele) : this
			, ourClass = jQ.fn.scaleFrame._ourClass
			, ourNav   = jQ.fn.scaleFrame._ourClassNav
			, outX     = null
			, outY     = null
			, navs     = []
			, navsLast = -1
			, scale    = null
			, wrap     = null
			, zoom     = null;
		if ( onlyFirst ) {
			jE = jE.first();
		}
		if ( jE.length == 1 ) {
			currOpts = jQ.extend( {}, jQ.fn.scaleFrame._defaults );
			currOpts = ( typeof(opts) == 'object' ) ? jQ.extend( currOpts, opts ) : currOpts;
			if ( ( typeof(currOpts) == 'object' ) && jE.is( 'iframe' ) ) {
				if ( ( typeof(currOpts.denote) != 'string' ) || !(/^\S$/).test( currOpts.denote ) ) {
					currOpts.denote = jQ.fn.scaleFrame._defaults.denote;
				}
				scale = jQ.fn.scaleFrame._readScale( jE, true );
				if ( ( typeof(scale) == 'object' ) && ( typeof(scale.length) == 'number' ) && ( scale.length == 2 ) ) {
					if ( typeof(jE.get(0).scaleFrame) == 'object' ) {
						if ( currOpts.reApply ) {
							if ( jE.parent().is( '.'+ourClass ) ) {
								jE.parent().find( '.'+ourNav ).remove();
								jE.parent().replaceWith( jE.parent().contents() );
								jE.get(0).scaleFrame = null;
								jE.get(0).scaleFrameOpts = null;
							}
						} else {
							return this; // already done
						}
					}
					currOpts.zoom = parseFloat( currOpts.zoom );
					if ( !isNaN( currOpts.zoom ) && ( currOpts.zoom > 0 ) ) {
						zoom = jQ('<ul></ul>');
						zoom.addClass( ourNav );
						if ( currOpts.zoomControls && ( typeof(currOpts.zoomControls) == 'object' ) && ( typeof(currOpts.zoomControls.length) == 'number' ) && ( currOpts.zoomControls.length > 0 ) ) {
							for ( aZ = 0; aZ < currOpts.zoomControls.length; aZ++ ) {
								currOpts.zoomControls[aZ] = currOpts.zoomControls[aZ].toLowerCase();
								var zUp = currOpts.zoomControls[aZ].charAt(0).toUpperCase() + currOpts.zoomControls[aZ].slice(1);
								if ( ( typeof(currOpts['zoomStr'+zUp]) == 'string' ) && ( currOpts['zoomStr'+zUp].length > 0 ) ) {
									if ( ( currOpts.zoomControls[aZ] == 'min' )  && ( isNaN(currOpts.zoomMin) || ( parseFloat(currOpts.zoomMin) < 0 ) ) ) {
										continue;
									}
									if ( ( currOpts.zoomControls[aZ] == 'max' )  && ( isNaN(currOpts.zoomMax) || ( parseFloat(currOpts.zoomMax) <= 0 ) ) ) {
										continue;
									}
									navsLast = navs.push( jQ('<li></li>') ) - 1;
									navs[navsLast].text( currOpts['zoomStr'+zUp] );
									if ( ( typeof(ourNav) == 'string' ) && classRgx.test( ourNav ) ) {
										navs[navsLast].addClass( ourNav+'-control'+'-'+currOpts.zoomControls[aZ] );
									}
									if ( ( typeof(currOpts.zoomClass) == 'string' ) && classRgx.test( currOpts.zoomClass ) ) {
										navs[navsLast].addClass( currOpts.zoomClass+'-'+currOpts.zoomControls[aZ] );
										navs[navsLast].addClass( currOpts.zoomClass+'-item' );
									}
								}
							}
						}
						navsLast = navs.push( jQ('<li style="clear: both; height : 1px;">&nbsp;</li>') ) - 1;
						for ( var aN = 0; aN < navs.length; aN++ ) {
							if ( aN < navsLast ) {
								if ( ( typeof(ourNav) == 'string' ) && classRgx.test( ourNav ) ) {
									navs[aN].addClass( ourNav+'-control' );
								}
								navs[aN].click( jQ.fn.scaleFrame._handle_nav );
								navs[aN].get(0)._scaleFrameTarget = jE;
							}
							zoom.append( navs[aN] );
						}
						if ( ( typeof(currOpts.zoomClass) == 'string' ) && classRgx.test( currOpts.zoomClass ) ) {
							zoom.addClass( currOpts.zoomClass );
						}
					}
					cssFl = jE.css( 'float' );
					outX = jE.outerWidth();
					outY = jE.outerHeight();
					if ( !isNaN(outX) && ( outX > 0 ) && !isNaN(outY) && ( outY > 0 ) ) {
						wrap = jQ('<div></div>');
						wrap.addClass( ourClass );
						if ( jE.attr( 'id' ) ) {
							wrap.attr( 'id', jE.attr( 'id' ) + '_' + currOpts.denote );
						}
						 outX = Math.round( outX * scale[0] );
						 outY = Math.round( outY * scale[1] );
						wrap.css( {
							  'width'    : outX + 'px'
							, 'height'   : outY + 'px'
							, 'overflow' : 'hidden'
						} );
						if ( ( typeof(currOpts.wrapClass) == 'string' ) && classRgx.test( currOpts.wrapClass ) ) {
							wrap.addClass( currOpts.wrapClass );
						}
						jE.wrap( wrap );
						wrap = jE.parent().first();
						if ( zoom != null ) {
							jE.before( zoom );
							outY = parseInt( outY + zoom.outerHeight() );
							wrap.css( {
							  'height' : outY + 'px'
							} );
						}
						if ( cssFl && ( cssFl != 'none' ) ) {
							wrap.css( 'float', cssFl );
							wrap.append( '<div style="clear: both; height: 1px;">&nbsp;</div>' );
						}
						jE.get(0)._scaleFrame = wrap;
						jE.get(0)._scaleFrameTarget = jE;
						jE.get(0)._scaleFrameOpts = currOpts;
						jE.get(0)._scaleFrameOriginalScale = scale;
					}
				}
			}
		} else {
			for ( var aE = 0; aE < jE.length; aE++ ) {
				jQ.fn.scaleFrame( opts, jE[aE], true );
			}
		}
		return this;
	};
	// an internal class name
	jQ.fn.scaleFrame._ourClass = 'scaleFrame-added';
	// an internal nav class name
	jQ.fn.scaleFrame._ourClassNav = jQ.fn.scaleFrame._ourClass + '-zoom-nav';
	// browser specific extensions to the CSS we use
	jQ.fn.scaleFrame._bSpef = [ '-moz-', '-webkit-', '-o-', '-ms-', '' ];
	// default options
	jQ.fn.scaleFrame._defaults = {
		  reApply      : false
		, wrapClass    : ''
		, zoom         : 0
		, zoomClass    : ''
		, zoomMax      : 3
		, zoomMin      : 0.05
		, zoomControls : [ 'min', 'minus', 'reset', 'whole', 'plus', 'max' ]
		, zoomStrMax   : 'max'
		, zoomStrMin   : 'min'
		, zoomStrMinus : '-'
		, zoomStrPlus  : '+'
		, zoomStrReset : 'reset'
		, zoomStrWhole : '100%'
	};
	jQ.fn.scaleFrame._handle_nav = function ( ev ) {
		var jEle = null
			, jOrig = null
			, opts  = null
			, orig  = null
			, outX  = null
			, outY  = null
			, scale = null
			, add   = 0
			, xForm = {}
			, wrap  = null
			, tVal = null;
		if ( ( typeof(ev) == 'object' ) && ( typeof(ev.currentTarget) == 'object' ) ) {
			if ( typeof(ev.preventDefault) == 'function' ) {
				ev.preventDefault()
			}
			if ( typeof(ev.stopPropagation) == 'function' ) {
				ev.stopPropagation()
			}
			if ( ( typeof(ev.currentTarget._scaleFrameTarget) == 'object' ) && ( typeof(ev.currentTarget._scaleFrameTarget.get) == 'function' ) ) {
				orig = ev.currentTarget._scaleFrameTarget.get( 0 );
				jOrig = jQ(orig);
				if ( typeof(orig._scaleFrameOpts) == 'object' ) {
					jEle = jQ(ev.currentTarget);
					opts = orig._scaleFrameOpts;
					wrap = orig._scaleFrame;
					if ( ( typeof(opts.zoom) == 'number' ) && ( opts.zoom > 0 ) ) {
						switch ( true ) {
							case jEle.hasClass( jQ.fn.scaleFrame._ourClassNav+'-control-minus' ):
								scale = jQ.fn.scaleFrame._readScale( orig, true );
								add = 0 - parseFloat( opts.zoom );
								break;
							case jEle.hasClass( jQ.fn.scaleFrame._ourClassNav+'-control-min' ):
								if ( isNaN(opts.zoomMin) ) {
									break;
								}
								tVal = ( opts.zoomMin <= 0 ? 0 : opts.zoomMin );
								scale = [ tVal, tVal ];
								break;
							case jEle.hasClass( jQ.fn.scaleFrame._ourClassNav+'-control-max' ):
								if ( isNaN(opts.zoomMax) ) {
									break;
								}
								tVal = ( opts.zoomMax <= 0 ? 0 : opts.zoomMax );
								scale = [ tVal, tVal ];
								break;
							case jEle.hasClass( jQ.fn.scaleFrame._ourClassNav+'-control-plus' ):
								scale = jQ.fn.scaleFrame._readScale( orig, true );
								add = 0 + parseFloat( opts.zoom );
								break;
							case jEle.hasClass( jQ.fn.scaleFrame._ourClassNav+'-control-reset' ):
								scale = jQ.extend( [], orig._scaleFrameOriginalScale );
								break;
							case jEle.hasClass( jQ.fn.scaleFrame._ourClassNav+'-control-whole' ):
								scale = [ 1.0, 1.0 ];
								break;
						}
						if ( ( scale != null ) && ( typeof(scale) == 'object' ) &&  ( typeof(scale.length) == 'number' ) && ( scale.length == 2 ) ) {
							scale = jQ.fn.scaleFrame._incAll( scale, add, true, true );
							if ( !jEle.hasClass( jQ.fn.scaleFrame._ourClassNav+'-reset' ) ) {
								scale[0] = scale[0] > opts.zoomMax ? opts.zoomMax : scale[0];
								scale[0] = scale[0] < opts.zoomMin ? opts.zoomMin : scale[0];
								scale[1] = scale[1] > opts.zoomMax ? opts.zoomMax : scale[1];
								scale[1] = scale[1] < opts.zoomMin ? opts.zoomMin : scale[1];
							}
							scale[0] = scale[0] < 0 ? 0 : scale[0];
							scale[1] = scale[1] < 0 ? 0 : scale[1];
							for ( var bS = 0; bS < jQ.fn.scaleFrame._bSpef.length; bS++ ) {
								xForm[jQ.fn.scaleFrame._bSpef[bS]+'transform'] = 'scale('+scale[0]+','+scale[1]+')';
							}
							jOrig.css( xForm );
							outX = Math.round( jOrig.outerWidth() * scale[0] );
							outY = Math.round( jOrig.outerHeight() * scale[1] ) + jEle.parent().outerHeight();
							wrap.css( {
								  'width'  : outX + 'px'
								, 'height' : outY + 'px'
							} );
						}
					}
				}
			}
		}
		return false;
	};
	/**
	* Increment all numeric values in either an array or the top level of an object by a given amount.
	* Note that it does not return a jQuery object!
	* This func is actually part of bpmv.js.
	* See https://github.com/BrynM/bpmv for documentation.
	* Taken blatantly from myself by myself.
	*/
	jQ.fn.scaleFrame._incAll = function ( soil, fertilizer, weeds, flo ) {
		var nVal = false
			, wasStr = false;
		weeds = typeof(weeds) == 'undefined' ? true : weeds;
		fertilizer = typeof(fertilizer) == 'undefined' ? 1 : parseFloat(fertilizer);
		if ( ( typeof(soil) == 'object' ) ) {
			if ( !isNaN( fertilizer ) && ( fertilizer != 0 ) ) {
				for ( var aS in soil ) {
					nVal = false;
					if ( soil.hasOwnProperty( aS ) ) {
						wasStr = typeof(soil[aS]) == 'string';
						if ( ( wasStr && !weeds ) || isNaN( parseFloat(soil[aS]) ) ){
							continue;
						}
						if ( (/^[0-9]+\.([0-9]+([eE]\+[0-9]+)?)?$/).test( soil[aS].toString() ) ) { // float
							soil[aS] = parseFloat(soil[aS]) + parseFloat(fertilizer);
							nVal = true;
						} else if ( (/^[0-9]+$/).test( soil[aS].toString() ) ) { // int
							soil[aS] = ( parseInt(soil[aS]) + parseFloat(fertilizer) );
							if ( !flo ) {
								soil[aS] = Math.round( soil[aS] );
							}
							nVal = true;
						}
						if ( nVal ) {
							soil[aS] = wasStr ? ''+soil[aS] : soil[aS];
						}
					}
				}
			}
		}
		return soil;
	};
	/*
	*	read the CSS property transform as an array - note that it does not return a jQuery object!
	*/
	jQ.fn.scaleFrame._readMatrix = function( ele, onlyFirst ) {
		var jT = [],
			ret = [];
		if ( typeof(ele) == 'object' ) {
			jT = jQ(ele);
		} else {
			jT = jQ(this); // we do this to make a copy
			if ( ( typeof(ele) == 'boolean' ) && ( typeof(onlyFirst) == 'undefined' ) ) {
				onlyFirst = ele; // if they only really wanted second parm functionality
			}
		}
		if ( ( typeof(jT.length) == 'number' ) && ( jT.length > 0 ) ) {
			if ( jT.length > 1 ) {
				if ( onlyFirst ) {
					jT = jT.first();
				} else {
					// return an array of results
					for ( var aE = 0; aE < jT.length; aE++ ) {
						ret[aE] = jQ.fn.scaleFrame._readMatrix( jT[aE], true );
					}
				}
			}
			if ( jT.length == 1 ) {
				for ( var bS = 0; bS < jQ.fn.scaleFrame._bSpef.length; bS++ ) {
					var xForm = jT.css( jQ.fn.scaleFrame._bSpef[bS]+'transform' );
					if ( ( typeof(xForm) == 'string' ) && (/^matrix\([^\)]+\)$/).test( xForm ) ) {
						return xForm.match( /[0-9\.]+/g );
					}
				}
			}
		}
	};
	/*
	*	Read the scale portion of a CSS transform as an array - note that it does not return a jQuery object!
	*/
	jQ.fn.scaleFrame._readScale = function( ele, onlyFirst ) {
		var jT = []
			, matrix = null
			, ret    = [];
		if ( typeof(ele) == 'object' ) {
			jT = jQ(ele);
		} else if ( typeof(this.css) == 'function' ) {
			jT = jQ(this); // we do this to make a copy
		}
		if ( ( typeof(jT.length) == 'number' ) && ( jT.length > 0 ) ) {
			if ( jT.length > 1 ) {
				if ( onlyFirst ) {
					jT = jT.first();
				} else {
					for ( var aE = 0; aE < jT.length; aE++ ) {
						ret[aE] = jQ.fn.scaleFrame._readScale( jT[aE], true );
					}
					return ret;
				}
			}
			if ( jT.length == 1 ) {
				matrix = jQ.fn.scaleFrame._readMatrix( jT, true );
				if ( ( typeof(matrix.length) == 'number' ) && ( matrix.length == 6 ) ) {
					return [ matrix[0], matrix[3] ];
				} else {
					for ( var bS = 0; bS < jQ.fn.scaleFrame._bSpef.length; bS++ ) {
						var xForm = jT.css( jQ.fn.scaleFrame._bSpef[bS]+'transform' );
						if ( ( typeof(xForm) == 'string' ) && (/^scale\([^\)]+\)$/).test( xForm ) ) {
							return xForm.match( /[0-9\.]+/g );
						}
					}
				}
			}
		}
		return [ 1, 1 ];
	};
return jQ.fn.scaleFrame; })( jQuery ) && (function( jQ ) {
	/*
	* Make readScale() available to all - note that it does not return a jQuery object!
	*/
	jQ.fn.readScale = function() {
		return jQ.fn.scaleFrame._readScale( this );
	};
return jQ.fn.readScale; })( jQuery ) && (function( jQ ) {
	/*
	* Make readMatrix() available to all - note that it does not return a jQuery object!
	*/
	jQ.fn.readMatrix = function() {
		return jQ.fn.scaleFrame._readMatrix( this );
	};
return jQ.fn.readMatrix; })( jQuery ) && (function( jQ ) {
	/*
	* Make incrementAll() available to all - note that it does not return a jQuery object!
	*/
	jQ.incrementAll = function ( soil, fertilizer, weeds, flo ) {
		return jQ.fn.scaleFrame._incAll( soil, fertilizer, weeds, flo );
	}
return jQ.incrementAll; })( jQuery );
