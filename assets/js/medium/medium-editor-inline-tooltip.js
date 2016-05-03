

    var parentElements = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre'];//contentEditor.parentElements;

    function showInlineToolTipMenu()
    {
        $('.inline-tooltip2').addClass('is-open is-menu-active is-opening');
    }
    function hideInlineToolTipMenu()
    {
        $('.inline-tooltip2').removeClass('is-open is-menu-active is-opening');
    }
    function hideInlineToolTip2()
    {
        $('.inline-tooltip2').removeClass('is-open is-opening is-menu-active').removeClass('is-active')
        setTimeout(function(){
            if(!$('.inline-tooltip2').hasClass('is-active'))
                $('.inline-tooltip2').css({'left':-100,'top':-100})
        }, 100);
    }
    function showInlineToolTip2(top, left)
    {
        $('.inline-tooltip2').css('left',left-35).css('top',top-4);
        $('.inline-tooltip2').addClass('is-active');

    }
    function updateInlineToolTip()
    {
        var $focusedParagraph = getCurrentFocusedElement();
        if($focusedParagraph.hasClass('paragraph-empty'))
        {
            var position = $focusedParagraph.offset();
            showInlineToolTip2(position.top, position.left);
        }else{
            hideInlineToolTip2();
        }
    }
    function updateInlineMediaToolTip()
    {
        var $focusedMedia = getCurrentFocusedElement();
        if($focusedMedia.hasClass('post-media'))
        {
            var position = $focusedMedia.offset();
            $('.inline-media-tooltip').css({'left':position.left+$focusedMedia.width()+50,'top':position.top}).addClass('is-active');
        }else{
            $('.inline-media-tooltip').removeClass('is-active').css({'left':-100,'top':-100});
        }
    }

    function onFocusEmptyParagraph()
    {
        var position = $(this).offset();
        hideInlineToolTip2();
        showInlineToolTip2(position.top, position.left);
    }

    function readFile(file, callback)
    {
        var reader = new FileReader();
        // Closure to capture the file information.
        reader.onload = (function(theFile) {
            return function(e) {
                callback(e.target.result);
            };
        })(file);
        // Read in the image file as a data URL.
        reader.readAsDataURL(file);
    }
    function previewSelectedImage2(file, $img)
    {
        var reader = new FileReader();
        // Closure to capture the file information.
        reader.onload = (function(theFile) {
            return function(e) {
                // Render.
                $img.attr('src', e.target.result );
            };
        })(file);
        // Read in the image file as a data URL.
        reader.readAsDataURL(file);
    }

    var $lastFocusedElement = null;
    function getCurrentFocusedElement()
    {
        return $('.is-focused');
    }
    function getLastFocusedElement()
    {
        return $lastFocusedElement;
    }
    function clearFocus()
    {
        $('.is-focused').removeClass('is-focused');
    }
    function updateFocusedElement(newFocusable)
    {
        $lastFocusedElement = getCurrentFocusedElement();
        clearFocus();
        $(newFocusable).addClass('is-focused');
    }


    function insertImage($element, url)
    {
        $element.replaceWith(
            '<figure tabindex="0" contenteditable="false" class="is-media-selected">'+
                '<div class="aspect-ratio-placeholder aspect-ratio-fill post-media is-focused">'+
                '<img src="'+url+'">'+
                '</div>'+
                '<figcaption class="image-caption" data-placeholder="Type caption for image (optional)" data-disable-double-return="true" data-disable-return="true">'+
                '</figcaption>'+
                '</figure>');
        var figCaption = new MediumEditor('.is-media-selected figcaption', { 'buttons' : ['bold', 'anchor']});
        $('.is-media-selected').removeClass('is-media-selected');
        $('.contenteditable').trigger('input');
        updateInlineMediaToolTip();
    }
    function insertVideo($element, link)
    {
        var videoId = link.split('watch?v=')[1]; // for youtube

        // create figure with iframe
        $element.replaceWith(
            '<figure tabindex="0" contenteditable="false" class="is-media-selected">'+
                '<div class="iframe-container post-media is-focused">'+
                '<iframe width="640" height="480" frameborder="0" src="//www.youtube.com/embed/'+videoId+'"> </iframe>'+
                '</div>'+
                '<figcaption class="image-caption" data-placeholder="Type caption for embed (optional)" data-disable-double-return="true" data-disable-return="true">'+
                '<p><a href="'+link+'" target="_blank"></a>'+link+'</p>'+
                '</figcaption>'+
                '</figure>');
        var figCaption = new MediumEditor('.is-media-selected figcaption', { 'buttons' : ['bold', 'anchor']});
        $('.is-media-selected').removeClass('is-media-selected');
        $('.contenteditable').trigger('input');
        updateInlineMediaToolTip();
    }
    function convertLinkIntoEmbedVideo()
    {
        $('.contenteditable').find('.is-video-embed').each(function(){
            var $element = $(this);
            var link = $element.text();//$element.find('a').attr('href');
            insertVideo($element, link);
        })
        $('.contenteditable').trigger('input');
    }

$(document).ready(function() {

    $(".inline-tooltip2-btn-control").on('click',function(){
        var $inlineTooltip = $(this).parent();
        $inlineTooltip.toggleClass('is-menu-active');
        if($inlineTooltip.hasClass('is-menu-active'))
        {
            $('.contenteditable').removeClass('medium-editor-placeholder')
            setTimeout(function(){
                $inlineTooltip.addClass('is-open is-opening');
                $inlineTooltip.removeClass('is-opening');
            },100);
            //setTimeout(hideInlineToolTipMenu, 5000);
        }else{
            $inlineTooltip.removeClass('is-open is-opening').addClass('is-closing');
            setTimeout(function(){$inlineTooltip.removeClass('is-closing')},100);
        }
    });


    $('.contenteditable').on('keyup click',function(){
        var selection = window.getSelection();
        if(selection.type === "None" || isVideoInsertionDetected)
        {
            clearFocus();
            return;
        }

        var current = selection.getRangeAt(0).commonAncestorContainer;

        var $parentElements = $(current).parents(parentElements.join(', '));
        if($parentElements.length > 0)
        {
            updateFocusedElement($parentElements[0]);
        }
        else if(!$(current).hasClass('contenteditable'))
        {
            updateFocusedElement(current);
        }else{
            // TODO: clear focused elements
            clearFocus();
        }

        // hide/show + position
        updateInlineToolTip();
        updateInlineMediaToolTip();
    });


    $('article .body').bind('clickoutside',function(){
        clearFocus();
        updateInlineToolTip();
        updateInlineMediaToolTip();
    });


    $('.contenteditable').on('input',function(html){
        // loop through parentElements
        $(this).find(parentElements.join(', ')).each(function(){
            $(this).unbind();
            if($(this).text() == ""){
                $(this).addClass('paragraph-empty');
                $(this).bind('click',onFocusEmptyParagraph);
            }else{
                $(this).removeClass('paragraph-empty');
                $(this).bind('click',hideInlineToolTip2);
            }
        })

        // update the last paragraph
        $(this).find('.paragraph-last').removeClass('paragraph-last');
        $(this).find(' > :last').addClass('paragraph-last');

        // we must add en empty paragraph if figure is the last one
        if($(this).find('.paragraph-last').is('figure')){
            $(this).append('<p><br></p>');
            $(this).trigger('input');
        }
    });


    ///
    ////////////////////////////////  Handle Image insertion ////////////////////////////////
    ///
    $('.inline-tooltip2 .inline-tooltip2-btn-insert-image').click(function(){
        var $selectFile = $('<input type="file">').click();
        hideInlineToolTip2();
        $selectFile.change(function () {
            var file = this.files[0];
            // Only process image files.
            if (!file.type.match('image.*'))
                return;

            readFile(file, function(url){
                insertImage(getCurrentFocusedElement(),url);
            });
        });
    });


    $(document).on('drop', '#contenteditable', function(e) {
        clearFocus();
        if(e.originalEvent.dataTransfer){
            if(e.originalEvent.dataTransfer.files.length) {
                // Stop the propagation of the event
                e.preventDefault();
                e.stopPropagation();
                $(this).css('border', 'none');
                readFile(e.originalEvent.dataTransfer.files[0], function(url){
                    var $lastElement = $('<p><br/></p>');
                    $('#contenteditable').append($lastElement);
                    insertImage($lastElement, url);
                    $("html, body").animate({ scrollTop: $(document).height()-$(window).height() });
                })
            }
        }
        else {
            $(this).css('border', 'none');
        }
        return false;
    });

    ///
    //////////////////////////////// Handle videos /////////////////////////////////////
    ///
    $('.inline-tooltip2 .inline-tooltip2-btn-insert-video').click(function(){
        hideInlineToolTip2();
        getCurrentFocusedElement()
            .addClass('media-video-insertion medium-editor-placeholder')
            .attr('data-placeholder',$(this).attr('data-action-value'));
        $('.contenteditable').one('input blur keyup',function(html){
            $('.media-video-insertion').removeClass('media-video-insertion medium-editor-placeholder').removeAttr('data-placeholder');
        });
    });

    var isVideoInsertionDetected = false;
    $('.contenteditable').on('keydown',function(e){
        if(e.which == 13)
        {
            var $focused = getCurrentFocusedElement();
            if($focused.parent('*[contenteditable="true"]').attr('data-allow-embed-video') === "true" /*&& $focused.find('a').length > 0*/)
            {
                var link = $focused.text()//$focused.find('a').attr('href');
                // check if it a video link
                isVideoInsertionDetected = link.indexOf("youtube.com") > -1;
                updateFocusedElement($focused);
            }
        }
    }).on('keyup',function(e){
        if(e.which == 13)
        {
            if(isVideoInsertionDetected)
            {
                isVideoInsertionDetected = false;
                var $element = getLastFocusedElement();
                var link = $element.text();
                insertVideo($element, link);
            }
        }
    })


    ///
    //  Media Tooltip
    ///
    $('.inline-media-tooltip-btn-remove-image').on('click',function(){
        var $focused = getCurrentFocusedElement();
        $focused.parent('figure').remove();
        updateInlineMediaToolTip();
        $('.contenteditable').trigger('input');
    });


    $( window ).on('resize',function() {
        updateInlineToolTip();
        updateInlineMediaToolTip();

    });

});