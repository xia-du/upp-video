(function($) {
  'use strict';
  // homepage
  $('.item').on('mouseenter', function() {
    $(this).find('h2').addClass('large');
  });
  $('.item').on('mouseleave', function() {
    $(this).find('h2').removeClass('large');
  });
  // end of homepage
})(jQuery);
