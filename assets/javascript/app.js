(function($) {
  $('a.do-btn').click(function (){
    var code = $(this).data('activity-code');
    var input = $('input#activity-code');
    input.val(code);
    input.parent().submit();
    $(this).parent().addClass('completed');
  });

  var active_filters = [];

  $('a.filtertoggle').click(function () {
    var slug = $(this).data('category-slug');

    if ($(this).hasClass('toggle-off')) {
      $(this).removeClass('toggle-off').removeClass('icon-square-o').addClass('icon-check-square-o');
      var position = $.inArray(slug, active_filters);

      if ( ~position ) active_filters.splice(position, 1); 
    }
    else {
      $(this).addClass('toggle-off').removeClass('icon-check-square-o').addClass('icon-square-o');
      active_filters.push(slug);
    }

    updateRecommendationListFilters(active_filters)

    return false;

  });

  function updateRecommendationListFilters(active_filters) {
    $('.friends-activity.preview').each(function () {
      var activity = $(this);
      var categories = $(this).data('categories').split(' ');

      if (activity.hasClass('filtered')) activity.removeClass('filtered');

      active_filters.forEach(function(entry) {
        if (!$.inArray(entry, categories)) {
          activity.addClass('filtered');
        }
      });
    }); 
  }

  $('a.filters-menu').click(function () {
    var menubutton = $(this);
    var filters = menubutton.parent();

    if (filters.hasClass('toggle-on')) {
      filters.removeClass('toggle-on');
      menubutton.removeClass('icon-close').addClass('icon-filter');
    }
    else {
      filters.addClass('toggle-on');
      menubutton.removeClass('icon-filter').addClass('icon-close');
    }

  });

})(jQuery);