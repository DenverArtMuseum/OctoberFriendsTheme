var Rover = {};

Rover.slidActivity = null;

Rover.coverButtons = function(activity, delta) {
    if (delta == null) {
      delta = parseInt(activity.style.right, 10);
    }

    var speed = 5;

    if (delta <= speed) {
      delta = 0;
    }
    else {
      delta -= speed;
    }

    activity.style.right = delta + 'px';
    
    if (delta > 0) {
      setTimeout(function() {
        Rover.coverButtons(activity, delta);
      })
    }
};

Rover.prepareActivityList = function () {

  // Get the activity for the targeted element in an event
  function getActivity(event) {
    var activity = event.target;

    if (!activity.classList.contains('rover-activity')) {
      while ((activity = activity.parentElement) && !activity.classList.contains('rover-activity'));
    }

    return activity;
  }

  // Check if activity other than currently interacting activity is slid over
  // If yes, slide that activity back.
  function resetInactiveActivity(activity) {
    if (Rover.slidActivity && activity.id !== Rover.slidActivity.id) {
      Rover.coverButtons(Rover.slidActivity, null);
      Rover.slidActivity = null;
    }
  }

  // Get the pixel width of the associated buttons container for an activity
  function getButtonsWidth(activity) {
    var listItem = activity.parentElement;

    if (!listItem.classList.contains('rover-activity-list-item')) {
      while ((listItem = listItem.parentElement) && !listItem.classList.contains('rover-activity-list-item'));
    }

    var buttons =  listItem.querySelector('.buttons');

    return buttons.offsetWidth;
  }

  // Slide Activity back over buttons
  function coverButtons(activity, delta) {
    if (delta == null) {
      delta = parseInt(activity.style.right, 10);
    }

    var speed = 5;

    if (delta <= speed) {
      delta = 0;
    }
    else {
      delta -= speed;
    }

    activity.style.right = delta + 'px';
    
    if (delta > 0) {
      setTimeout(function() {
        coverButtons(activity, delta);
      })
    }
  }

  // Show/Hide extended details for activity
  function toggleDetails(event) {
    var activity = getActivity(event);

    if (Rover.slidActivity) {
      Rover.coverButtons(Rover.slidActivity, null);
    }

    if (activity.classList.contains('reveal')) {
      activity.classList.remove('reveal');
    }
    else {
      activity.classList.add('reveal');
    }
  }

  // Drag activity to left.
  function dragActivity(event) {
    var activity = getActivity(event);

    resetInactiveActivity(activity);

    var delta = Math.abs(event.deltaX);

    activity.style.right = delta + 'px';

    var buttons = getButtonsWidth(activity);

    if (delta > buttons) {
      activity.style.right = buttons + 'px';
    }
  }

  // move activity to left to reveal buttons on swipe left
  function revealActivityButtons(event) {
    var activity = getActivity(event);

    resetInactiveActivity(activity);

    var buttons = getButtonsWidth(activity);
    activity.style.right = buttons + 'px';
    Rover.slidActivity = activity;
  }

  // Move activity back over buttons on pan/swipe right
  function resetActivity(event) {
    var activity = getActivity(event);

    Rover.coverButtons(activity, null);
  }

  // On panend (drag stop), check current position of activity.
  // If buttons revealed, leave revealed. If not, slide activity back over buttons.
  function dragStopActivity(event) {
    var activity = getActivity(event);

    var delta = parseInt(activity.style.right, 10);

    var buttons = getButtonsWidth(activity);

    if (delta < buttons) {
      resetActivity(event);
    }
    else {
      Rover.slidActivity = activity;
    }
  }

  // Each activity in the list gets its event listeners assigned here
  function prepareActivity(activity) {
    var activityControl = new Hammer(activity);

    activityControl.on('tap',        toggleDetails);
    activityControl.on('panleft',    dragActivity);
    activityControl.on('swipeleft',  revealActivityButtons);
    activityControl.on('panright',   resetActivity);
    activityControl.on('swiperight', resetActivity);
    activityControl.on('panend',     dragStopActivity);
  }

  // Find the list of activities in the page
  var activities = document.querySelectorAll('.rover-activity');

  // Set current 'slid' activity to null
  //var Rover.slidActivity = null;

  // assign event listeners to each activity
  for (var i = 0; i < activities.length; i += 1) {
    prepareActivity(activities[i]);
  }
};

Rover.prepActivitiesWhenReady = function () {
  document.addEventListener("DOMContentLoaded", Rover.prepareActivityList);

  var container = document.querySelectorAll('.rover-filtered-activity-list');

  // When the activity list is reloaded by a filter or refresh AJAX
  // event, assign new event listeners to new activities.
  // Have to use jQuery for this. October AJAX API events can't be caught by addEventListener
  $('.rover-filtered-activity-list').parent().on('ajaxUpdate', function(e){ Rover.prepareActivityList(); });
};

// Assign event listeners to activity list 
Rover.prepActivitiesWhenReady();

(function($) {

  // Display flash messages when they are received, set up close button handler(s)
  $('#flashMessages').on('ajaxUpdate', function(e) {
    $('body').append('<div id="rover-modal-background"></div>');
    $('#rover-modal-background').css('position', 'fixed')
      .hide()
      .css('top', 0)
      .css('left', 0)
      .css('bottom', 0)
      .css('right', 0)
      .css('z-index', 599)
      .css('background-color', '#fff')
      .fadeTo('fast',.5);
    $('#flashMessages').fadeIn(400);

    $('#flashMessages .close-btn').click(function() {
      $('#rover-modal-background').remove();
      $('#flashMessages').fadeOut(500, function() {
        $(this).children().remove();
      });
      var activity = jQuery(Rover.slidActivity);
      Rover.coverButtons(Rover.slidActivity,null);
      activity.hide();
    });

    $('#flashMessages .refresh-btn').click(function() {
      // Refresh active list pane (holy hell, none of this is written yet)
      refreshActiveList();
      $('#rover-modal-background').remove();
      $('#flashMessages').fadeOut(500, function() {
        $(this).children().remove();
      });
      var activity = jQuery(Rover.slidActivity);
      Rover.coverButtons(Rover.slidActivity,null);
      activity.hide();
    });
  });

  // This will need to be replaced after the demo, when we combine panes.
  function refreshActiveList() {
    var list = $('.rover-activity-filters-list');

    var active_filters = {
      categories: 'all',
      search: ''
    };
    
    // generate a list of active categories if not all categories are active
    if (list.find('.friends-activity-filter.inactive').length != 0) {
      active_filters['categories'] = list
        .find('.friends-activity-filter.active')
        .map(function(i, e) {
          return $(e).data('filter-name');
        })
        .get();
    }

    // initialize options for AJAX request
    var options = {
      data: { filters: JSON.stringify(active_filters) }
    };

    // Send the AJAX request to update the page
    $.request(list.data('filter-component'), options);    
  }

  // Submit activity code when "do" button used
  // TODO: Should be replaced with an API call at some point, needs new component
  function startActivityListeners() {
    $('a.do-btn').click(function (){
      var activity = $(this).data('activity-id');

      var completion = {
        activity: parseInt(activity)
      };

      var options = {
        data: { completion: JSON.stringify(completion) }
      };

      $.request('onComplete', options);

      return false;
    });

    $('a.ignore-btn').click(function() {
      var activity = $(this).data('activity-id');

      var rating = {
        activity: parseInt(activity),
        rating: 0
      };

      var options = {
        data: { rating: JSON.stringify(rating) }
      };

      $.request('onRate', options);

      return false;
    });
  }

  startActivityListeners();

  $('.rover-filtered-activity-list').parent().on('ajaxUpdate', function(e){ startActivityListeners(); });


  /* BEGIN FILTER THEME TWEAKS */

  // Reveal/Hide filters menu on menu button click
  $('.rover-filters-menu-btn').click(function () {
    var menubutton = $(this);
    var filters = menubutton.parent();

    if (filters.hasClass('toggle-on')) {
      filters.removeClass('toggle-on');
      $('#rover-modal-background').fadeOut('fast').remove();
    }
    else {
      $('body').append('<div id="rover-modal-background"></div>');
      $('#rover-modal-background').css('position', 'fixed')
        .hide()
        .css('top', 0)
        .css('left', 0)
        .css('bottom', 0)
        .css('right', 0)
        .css('z-index', 599)
        .css('background-color', '#000')
        .fadeTo('fast',.5);
      filters.addClass('toggle-on');
    }

    return false;
  });

  /* END FILTER THEME TWEAKS */

})(jQuery);