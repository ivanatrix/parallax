/**
 
(function ($, Drupal, window, document, undefined) {


  Drupal.behaviors.parallax_block = {
    attach: function(context, settings) {

    $(function() {
      var targets = $("[data-parallax]").toArray();

      // Enable parallax only if not mobile device
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) === false) {
        enableParallax(targets);
      } else {
        setStaticBackgrounds(targets);
      }
    });
    }
  };

  // This function currently accepts an array of target selectors in the form
  // of strings, cycled through for parallax effects.
  function enableParallax(targetsObj) {
    $.each(targetsObj, function() {
      //OLD var currentObj = "#" + $(this).attr('id').toString();
      var currentObj = $(this); // NEW

      // check if object exists on page
      if (currentObj.length > 0) {
        $(window).load(function() {
          parallaxCalculation(currentObj);
        });
        $(window).scroll(function() {
          parallaxCalculation(currentObj);
        });
        $(window).resize(function() {
          parallaxCalculation(currentObj);
        });
      }
    });
  }

  // Determines if each element passed to enableParallax is in the viewport and
  // passes through TRUE when element dimensions first are visible in viewport
  function isScrolledIntoView(elem) {
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    if ($(elem).offset() !== null) {
      var elemTop = $(elem).offset().top;
      var elemBottom = elemTop + $(elem).height();

      return ((elemTop <= docViewBottom) && (elemBottom >= docViewTop));
    } else {
      return true;
    }
  }

  function parallaxCalculation(currentObj) {

    if (isScrolledIntoView(currentObj)) {   //On Scroll or Load, check if object is in view

      // Calculate position of top of target element relative to top of page
      // and height of target element
      var divTop = currentObj.offset().top;
      var divHeight = currentObj.height();

      // Calculate distance scrolled from top, the center of the viewport
      // (necessary for calculations), and the height of the viewport
      var docViewTop = $(window).scrollTop();
      var docViewSize = $(window).height();
      var docViewCenter = docViewTop + (docViewSize / 2);

      // Calculate the full range of effective parallax movement on the page
      var fullRange = docViewSize + divHeight;

      // My head hurts too much to explain this one. Ask Kyle.
      var currPosition = docViewCenter - (divTop - (docViewSize / 2));

      // Calculate percentage location of current position baseed on full range of parallax movement
      var currVerticalPercentage = (currPosition / fullRange) * 100;
      var currHorizontalPercentage = (currPosition / fullRange) * 100;

      // Determines if vertical parallax direction is opposite, and invertes the value
      // on a scale of 1-100
      if (($(currentObj).attr('data-parallax').indexOf("bottom-to-top") > -1)) {
        currentObj.attr("data-position-vertical", currVerticalPercentage);
        currVerticalPercentage = 100 - currentObj.attr("data-position-vertical");
      }
      if (($(currentObj).attr('data-parallax').indexOf("right-to-left") > -1)) {
        currentObj.attr("data-position-horizontal", currHorizontalPercentage);
        currHorizontalPercentage = 100 - currentObj.attr("data-position-horizontal");
      }

      var dataValues = currentObj.attr("data-parallax").split(" ");

      // Horizontal Background Percentage
      if (dataValues[0] != "none") {
        coords = currHorizontalPercentage + "%";
      } else {
        coords = "50%";
      }

      // Vertical Background Percentage
      if (dataValues[1] != "none") {
        coords += " " + currVerticalPercentage + "%";
      } else {
        coords += " 50%";
      }

      var bgSize = currentObj.attr("data-background-size");
      var bgImage = currentObj.attr("data-background-image");

      // Apply background Position and apply background-size: Cover to avoid image tiling

      currentObj.css({ "backgroundPosition": coords,
                       "backgroundSize": bgSize,
                       "background-image": "url(" + bgImage + ")"});
    }
  }

  function setStaticBackgrounds(targetsObj) {
    $.each(targetsObj, function() {
      var currentObj = $(this);

      var bgSize = currentObj.attr("data-background-size");
      var bgImage = currentObj.attr("data-background-image");

      // Apply background Position and apply background-size: Cover to avoid image tiling
      currentObj.css({
        "backgroundPosition": "50% 50%",
        "backgroundSize": bgSize,
        "background-image": "url(" + bgImage + ")"
      });
    });
  }
})(jQuery, Drupal, this, this.document);
