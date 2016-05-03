// Check for the various File API support.
if (window.File && window.FileReader && window.FileList && window.Blob) {
    // Great success! All the File APIs are supported.
} else {
    console.log('The File APIs are not fully supported in this browser.');
}


//////////////////////////////////////////////////////////////////////
//						Global function								//
//////////////////////////////////////////////////////////////////////

function getImageSize(img) {
    var clone = img.clone();
    clone.width("auto")
        .height("auto")
        .css("position", "absolute")
        .css("left", -9999)
        .css("top", -9999);
    $(document.body).append(clone);
    var width = clone.width();
    var height = clone.height();
    clone.remove();
    return {width:width, height:height};
}

function uploadFile(url, param, callback) {
    var data = new FormData();
    for(var key in param){
        data.append(key,param[key]);
    }
    $.ajax({
        url: url,
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST',
        success: callback
    });
}

function previewSelectedImage(evt, $img) {
    var files = evt.target.files; // FileList object
    $input = $(this);
    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {
        // Only process image files.
        if (!f.type.match('image.*')) {
            continue;
        }
        var reader = new FileReader();
        // Closure to capture the file information.
        reader.onload = (function(theFile) {
            return function(e) {
                // Render thumbnail.
                $img.attr('src', e.target.result);
            };
        })(f);
        // Read in the image file as a data URL.
        reader.readAsDataURL(f);
    }
}

function handleDropFile(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    $input = $(this);
    var files = evt.dataTransfer.files; // FileList object.
    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {
        // Only process image files.
        if (!f.type.match('image.*')) {
            continue;
        }
        var reader = new FileReader();
        // Closure to capture the file information.
        reader.onload = (function(theFile) {
            return function(e) {
                // Render thumbnail.
                $input.parent().find('.upload').html('<img class="thumb" src="' +
                    e.target.result + '" title="' + escape(theFile.name) +'"/>');
            };
        })(f);
        // Read in the image file as a data URL.
        reader.readAsDataURL(f);
    }

}
function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

//////////////////////////////////////////////////////////////////////
//							Triggers								//
//////////////////////////////////////////////////////////////////////
$(document).ready(function() {
    //if(GLobal.supportFileReader){
        //$('input[type="file"]').live('change',previewSelectedImage);
    //}
    // When clicked.
    //$('.upload').live('click',function () {
    //    $(this).parents('.upload-wrap').find('input[type="file"]').click();
    //});


    /*		Drop/resize/crop	 */
    //$('.drop_zone').on('dragover',handleDragOver);
    //$('.drop_zone').on('drop',previewSelectedImage);
    var dropZone = document.getElementById('drop_zone');
    if(dropZone != null){
        dropZone.addEventListener('dragover', handleDragOver, false);
        dropZone.addEventListener('drop', handleDropFile, false);
    }




});