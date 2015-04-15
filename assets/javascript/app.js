(function($) {
  $('a.do-btn').click(function (){
    var code = $(this).data('activity-code');
    var input = $('input#activity-code');
    input.val(code);
    input.parent().submit();
    $(this).parent().addClass('completed');
  });

  /* BEGIN FILTER THEME TWEAKS */

  // Initialize icon state of each filter
  $('a.friends-activity-filter').each(function() {
    var link = $(this);

    if (link.hasClass('active')) {
      link.addClass('icon-check-square-o');
    }
    else {
      link.addClass('icon-square-o');
    }
  });

  //var active_filters = [];

  $('a.friends-activity-filter').click(function () {
    // remove this line when AJAX works on Recommendations
    //var slug = $(this).data('filter-name');

    if ($(this).hasClass('icon-square-o')) {
      $(this).removeClass('icon-square-o').addClass('icon-check-square-o');
      // remove these two lines when AJAX works on Recommendations
      //var position = $.inArray(slug, active_filters);
      //if ( ~position ) active_filters.splice(position, 1); 
    }
    else {
      $(this).removeClass('icon-check-square-o').addClass('icon-square-o');
      // remove this line when AJAX works on Recommendations
      //active_filters.push(slug);
    }

    // remove this line when AJAX works on Recommendations
    //updateRecommendationListFilters(active_filters)

    return false;
  });

  $('a.friends-activity-filter-all').click(function () {
    $('a.friends-activity-filter').each(function () {
      if ($(this).hasClass('icon-square-o')) {
        $(this).removeClass('icon-square-o').addClass('icon-check-square-o');
      }
    });

  });

  // Reveal/Hide filters menu on menu button click
  $('a.filters-menu-btn').click(function () {
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

    return false;
  });

  /* END FILTER THEME TWEAKS */


  /* BEGIN EXTENDED CONTENT INTERACTIONS */
  $('.friends-activity.preview').click(function() {
    toggleExtendedContent($(this));
  });

  // CSS transitions don't work on box size properties without explicit lengths or percentages
  // Consequently, we'll probably have to rewrite this using jquery transitions
  function toggleExtendedContent(activity) {
    if (activity.hasClass('reveal')) {
      activity.removeClass('reveal');
    }
    else {
      activity.addClass('reveal');
    }
  }

  /* END EXTENDED CONTENT INTERACTIONS */

  /**
   * Cheater function. Demo only. Will be replaced with actual AJAX in final product
   */
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

})(jQuery);