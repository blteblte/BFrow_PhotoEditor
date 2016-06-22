/* jQuery */
(function ($) {
    $.fn.ImageContainer = function (options) {
        var imageContainer = new PhotoEditor.ImageContainer(this, options);
        imageContainer.GetImages().then(function () {
            imageContainer.LoadEditors().then(function () {
                imageContainer.InitNavigationUI();
            });
        });
    };
})(jQuery);
