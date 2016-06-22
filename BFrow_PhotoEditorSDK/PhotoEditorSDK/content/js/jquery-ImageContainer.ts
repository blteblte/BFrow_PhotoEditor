
/* jQuery */
(function ($) {
    $.fn.ImageContainer = function (options) {
        var imageContainer = new PhotoEditor.ImageContainer(this, options);

        imageContainer.GetImages().then(() => {
            imageContainer.LoadEditors().then(() => {
                imageContainer.InitNavigationUI();
            });
        });
    };
})(jQuery);

