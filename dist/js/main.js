"use strict";

if ( !window.COUCH ) var COUCH = {};

/* Data */

COUCH.data = {};

/* Elements */

COUCH.el = {};

/* Methods */

/**
 * Add leave listener
 */
COUCH.addLeaveListener = function() {
    $( function(){
        var form = COUCH.el.$content.find( "#k_admin_frm" );
        if( form.length ){
            COUCH.updateRichTextContent();
            COUCH.data.formOriginal = form.serialize();

            form.on( "submit", function() {
                window.onbeforeunload = null;
            });

            window.onbeforeunload = function() {
                COUCH.updateRichTextContent();
                var cur_data = form.serialize();
                if ( COUCH.data.formOriginal !== cur_data ) return COUCH.lang.leave;
            };
        }
    });
};

/**
 * Bind Magnific Popup AJAX
 * @param {jQuery Object} $elements
 * @param {Boolean}       [code]
 */
COUCH.bindPopupAJAX = function( $elements, code ) {
    $elements.magnificPopup({
        callbacks: {
            parseAjax: code ? function( response ) {
                response.data = '<div class="popup-blank popup-code"><div class="popup-code-content">' + response.data.replace( "<", "&lt;" ).replace( ">", "&gt;" ) + '</div></div>';
            } : false
        },
        closeOnBgClick: false,
        preloader:      false,
        type:           "ajax"
    });
};

/**
 * Bind Magnific Popup gallery
 */
COUCH.bindPopupGallery = function() {
    this.el.$content.find( ".gallery-listing" ).magnificPopup({
        delegate: ".popup-gallery",
        gallery: {
            enabled: true
        },
        type: "image"
    });
};

/**
 * Bind Magnific Popup iframe
 * @param {jQuery Object} $elements
 * @param {Function}      [callbackOpen]
 * @param {Function}      [callbackClosed]
 */
COUCH.bindPopupIframe = function( $elements, callbackOpen, callbackClosed ) {
    $elements.magnificPopup({
        callbacks: {
            afterClose: callbackClosed,
            beforeOpen: callbackOpen
        },
        closeOnBgClick: false,
        preloader:      false,
        type:           "iframe"
    });
};

/**
 * Bind Magnific Popup image preview
 * @param {jQuery Object} $elements
 */
COUCH.bindPopupImage = function( $elements ) {
    $elements.magnificPopup({
        type: "image"
    });
};

/**
 * Bind Magnific Popup inline
 * @param {jQuery Object} $elements
 */
COUCH.bindPopupInline = function( $elements ) {
    $elements.magnificPopup({
        preloader: false,
        type:      "inline"
    });
};


/**
 * Browse choose file action
 * @param {jQuery Object} $button
 * @param {String}        file
 */
COUCH.browseChooseFile = function( $button, file ) {
    var id = $button.attr('data-kc-finder');
    $('#' + id).val( file );
    try{
        $("#" + id + "_preview").attr( "href", file );
        $("#" + id + "_img_preview").attr( "src", file );
    }
    catch( e ){}

    $.magnificPopup.close();
};

/**
 * Close callback for KCFinder file manager modal
 */
COUCH.browseKCFinderClose = function() {
    window.KCFinder = null;
};

/**
 * Open callback for KCFinder file manager modal
 */
COUCH.browseKCFinderOpen = function() {
    var $this = $( this.st.el );  // this is $.magnificPopup.instance
    window.KCFinder = {
        callBack: function( file ) {
            COUCH.browseChooseFile( $this, file );
        }
    };
};

/**
 * Plupload bulk file upload finish
 * @param {jQuery Object} $button
 * @param {String}        result
 */
COUCH.bulkPluploadFinish = function( $button, result ) {
    var msg = $.trim( result );

    if ( msg.length ) {
        $.magnificPopup.dialog({
            icon:     "x",
            iconType: "error",
            text:     msg,
            closedCallback: function() {
                $button.focus();
            }
        });
    } else {
        window.location.reload();
    }
};

/**
 * Bind scroll to top click scroll action
 */
COUCH.bindTopScroll = function() {
    $( "#top" ).on( "click", function( e ) {
        e.preventDefault();

        $( this ).blur();

        $( "html, body, #scroll-content" ).animate({
            scrollTop: 0
        }, 400 );
    });
};

/**
 * Create tooltips
 * @param {jQuery Object} $element
 * @param {String}        [selector]
 */
COUCH.createTooltips = function( $element, selector ) {
    $element.doOnce(function() {
        $( this ).tooltip({
            animation: false,
            container: "body",
            selector: selector ? selector : false
        });
    });
};

/**
 * Set Magnific Popup default settings
 */
COUCH.setMagnificPopupDefaults = function() {
    if ( !$.magnificPopup ) return;

    $.extend( true, $.magnificPopup.defaults, {
        ajax: {
            tError: COUCH.lang.popup.ajaxError
        },
        gallery: {
            tCounter: COUCH.lang.popup.counter,
            tNext:    COUCH.lang.popup.next,
            tPrev:    COUCH.lang.popup.previous
        },
        image: {
            titleSrc: "data-popup-title",
            tError:   COUCH.lang.popup.imgError
        },
        mainClass:    "mfp-fade",
        removalDelay: 210,
        tClose:       COUCH.lang.popup.close,
        tLoading:     COUCH.lang.popup.loading
    });
};

/**
 * Slide up, fade out, and hide the element, then optionally call the callback function
 * @param {jQuery Object} $element
 * @param {Number|String} speed
 * @param {Function}      [callback]
 */
COUCH.slideFadeHide = function( $element, speed, callback ) {
    $element.removeClass( "in" );

    setTimeout(function() {
        $element.slideUp( speed, function() {
            if ( $.isFunction( callback ) ) callback.call( this );
        });
    }, speed );
};

/**
 * Slide down, fade in, and show the element, then optionally call the callback function
 * @param {jQuery Object} $element
 * @param {Number|String} speed
 * @param {Function}      [callback]
 */
COUCH.slideFadeShow = function( $element, speed, callback ) {
    $element.slideDown( speed, function() {
        $( this ).addClass( "in" );

        if ( $.isFunction( callback ) ) {
            setTimeout(function() {
                callback.call( this );
            }, speed );
        }
    });
};

/**
 * Update rich text form content
 */
COUCH.updateRichTextContent = function() {
    if ( window.CKEDITOR ) {
        var key, obj;

        for ( key in CKEDITOR.instances ) {
            obj = CKEDITOR.instances[ key ];

            if ( CKEDITOR.instances.hasOwnProperty( key ) ) obj.updateElement();
        }
    }

    if ( window.nicEditors ) {
        var i = nicEditors.editors.length - 1;

        do {
            try {
                nicEditors.editors[ i ].nicInstances[ 0 ].saveContent();
            } catch ( e ) {}

            i--;
        } while ( i > -1 );
    }
};

/**
 * Initialize Couch application
 */
COUCH.init = function() {
    $(function() {
        COUCH.el.$content = $( ".content-wrapper" );
        COUCH.el.$sidebar = $( ".main-sidebar" );

        COUCH.setMagnificPopupDefaults();
        COUCH.createTooltips( $( "body" ), ".tt" );
        COUCH.bindTopScroll();
        COUCH.addLeaveListener();
        COUCH.bindPopupAJAX( COUCH.el.$sidebar.find( ".popup-ajax" ), true );
    });
};

COUCH.lang = {
    leave: "Any unsaved changes will be lost.",

    popup: {
        ajaxError: "<a href='%url%' target='_blank'>The content</a> could not be loaded.",
        close:     "Close (Esc)",
        counter:   "%curr% of %total%",
        imgError:  "<a href='%url%' target='_blank'>The image</a> could not be loaded.",
        loading:   "Loading\u2026",
        next:      "Next",
        previous:  "Previous"
    }
};

COUCH.init();
