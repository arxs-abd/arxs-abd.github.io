 AOS.init({
 	duration: 800,
 	easing: 'slide',
 	once: true
 });

jQuery(document).ready(function($) {

	"use strict";

	
	$(".loader").delay(1000).fadeOut("slow");
  $("#overlayer").delay(1000).fadeOut("slow");	
  

	var siteMenuClone = function() {

		$('.js-clone-nav').each(function() {
			var $this = $(this);
			$this.clone().attr('class', 'site-nav-wrap').appendTo('.site-mobile-menu-body');
		});


		setTimeout(function() {
			
			var counter = 0;
      $('.site-mobile-menu .has-children').each(function(){
        var $this = $(this);
        
        $this.prepend('<span class="arrow-collapse collapsed">');

        $this.find('.arrow-collapse').attr({
          'data-toggle' : 'collapse',
          'data-target' : '#collapseItem' + counter,
        });

        $this.find('> ul').attr({
          'class' : 'collapse',
          'id' : 'collapseItem' + counter,
        });

        counter++;

      });

    }, 1000);

		$('body').on('click', '.arrow-collapse', function(e) {
      var $this = $(this);
      if ( $this.closest('li').find('.collapse').hasClass('show') ) {
        $this.removeClass('active');
      } else {
        $this.addClass('active');
      }
      e.preventDefault();  
      
    });

		$(window).resize(function() {
			var $this = $(this),
				w = $this.width();

			if ( w > 768 ) {
				if ( $('body').hasClass('offcanvas-menu') ) {
					$('body').removeClass('offcanvas-menu');
				}
			}
		})

		$('body').on('click', '.js-menu-toggle', function(e) {
			var $this = $(this);
			e.preventDefault();

			if ( $('body').hasClass('offcanvas-menu') ) {
				$('body').removeClass('offcanvas-menu');
				$this.removeClass('active');
			} else {
				$('body').addClass('offcanvas-menu');
				$this.addClass('active');
			}
		}) 

		// click outisde offcanvas
		$(document).mouseup(function(e) {
	    var container = $(".site-mobile-menu");
	    if (!container.is(e.target) && container.has(e.target).length === 0) {
	      if ( $('body').hasClass('offcanvas-menu') ) {
					$('body').removeClass('offcanvas-menu');
				}
	    }
		});
	}; 
	siteMenuClone();


	var sitePlusMinus = function() {
		$('.js-btn-minus').on('click', function(e){
			e.preventDefault();
			if ( $(this).closest('.input-group').find('.form-control').val() != 0  ) {
				$(this).closest('.input-group').find('.form-control').val(parseInt($(this).closest('.input-group').find('.form-control').val()) - 1);
			} else {
				$(this).closest('.input-group').find('.form-control').val(parseInt(0));
			}
		});
		$('.js-btn-plus').on('click', function(e){
			e.preventDefault();
			$(this).closest('.input-group').find('.form-control').val(parseInt($(this).closest('.input-group').find('.form-control').val()) + 1);
		});
	};
	// sitePlusMinus();


	var siteSliderRange = function() {
    $( "#slider-range" ).slider({
      range: true,
      min: 0,
      max: 500,
      values: [ 75, 300 ],
      slide: function( event, ui ) {
        $( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
      }
    });
    $( "#amount" ).val( "$" + $( "#slider-range" ).slider( "values", 0 ) +
      " - $" + $( "#slider-range" ).slider( "values", 1 ) );
	};
	// siteSliderRange();


	
	var siteCarousel = function () {
		if ( $('.nonloop-block-13').length > 0 ) {
			$('.nonloop-block-13').owlCarousel({
		    center: false,
		    items: 1,
		    loop: true,
				stagePadding: 0,
		    margin: 0,
		    autoplay: true,
		    nav: true,
				navText: ['<span class="icon-arrow_back">', '<span class="icon-arrow_forward">'],
		    responsive:{
	        600:{
	        	margin: 0,
	        	nav: true,
	          items: 2
	        },
	        1000:{
	        	margin: 0,
	        	stagePadding: 0,
	        	nav: true,
	          items: 3
	        },
	        1200:{
	        	margin: 0,
	        	stagePadding: 0,
	        	nav: true,
	          items: 4
	        }
		    }
			});
		}

		$('.single-text').owlCarousel({
	    center: false,
	    items: 1,
	    loop: true,
			stagePadding: 0,
	    margin: 0,
	    autoplay: true,
	    pauseOnHover: false,
	    nav: false,
	    smartSpeed: 1000,
	  });
		$('.slide-one-item').owlCarousel({
	    center: false,
	    items: 1,
	    loop: true,
			stagePadding: 0,
	    margin: 0,
	    autoplay: true,
	    smartSpeed: 1000,
	    pauseOnHover: false,
	    nav: true,
	    navText: ['<span class="icon-keyboard_arrow_left">', '<span class="icon-keyboard_arrow_right">']
	  });

	  

	  $('.slide-one-item-alt').owlCarousel({
	    center: false,
	    items: 1,
	    loop: true,
			stagePadding: 0,
	    margin: 0,
	    smartSpeed: 1000,
	    autoplay: true,
	    pauseOnHover: true,
	    mouseDrag: false,
	    touchDrag: false,
	  });
	  $('.slide-one-item-alt-text').owlCarousel({
	    center: false,
	    items: 1,
	    loop: true,
			stagePadding: 0,
	    margin: 0,
	    smartSpeed: 1000,
	    autoplay: true,
	    pauseOnHover: true,
	    mouseDrag: false,
	    touchDrag: false,
	    
	  });
	  

	  $('.custom-next').click(function(e) {
	  	e.preventDefault();
	  	$('.slide-one-item-alt').trigger('next.owl.carousel');
	  	$('.slide-one-item-alt-text').trigger('next.owl.carousel');
	  });
	  $('.custom-prev').click(function(e) {
	  	e.preventDefault();
	  	$('.slide-one-item-alt').trigger('prev.owl.carousel');
	  	$('.slide-one-item-alt-text').trigger('prev.owl.carousel');
	  });
	  
	};
	siteCarousel();

	var siteStellar = function() {
		$(window).stellar({
	    responsive: false,
	    parallaxBackgrounds: true,
	    parallaxElements: true,
	    horizontalScrolling: false,
	    hideDistantElements: false,
	    scrollProperty: 'scroll'
	  });
	};
	// siteStellar();

	var siteCountDown = function() {

		$('#date-countdown').countdown('2020/10/10', function(event) {
		  var $this = $(this).html(event.strftime(''
		    + '<span class="countdown-block"><span class="label">%w</span> weeks </span>'
		    + '<span class="countdown-block"><span class="label">%d</span> days </span>'
		    + '<span class="countdown-block"><span class="label">%H</span> hr </span>'
		    + '<span class="countdown-block"><span class="label">%M</span> min </span>'
		    + '<span class="countdown-block"><span class="label">%S</span> sec</span>'));
		});
				
	};
	siteCountDown();

	var siteDatePicker = function() {

		if ( $('.datepicker').length > 0 ) {
			$('.datepicker').datepicker();
		}

	};
	siteDatePicker();

	var siteSticky = function() {
		$(".js-sticky-header").sticky({topSpacing:0});
	};
	siteSticky();

	// navigation
  var OnePageNavigation = function() {
    var navToggler = $('.site-menu-toggle');
   	$("body").on("click", ".main-menu li a[href^='#'], .smoothscroll[href^='#'], .site-mobile-menu .site-nav-wrap li a", function(e) {
      e.preventDefault();

      var hash = this.hash;

      $('html, body').animate({
        'scrollTop': $(hash).offset().top
      }, 600, 'easeInOutExpo', function(){
        window.location.hash = hash;
      });

    });
  };
  OnePageNavigation();

  var siteScroll = function() {

  	

  	$(window).scroll(function() {

  		var st = $(this).scrollTop();

  		if (st > 100) {
  			$('.js-sticky-header').addClass('shrink');
  		} else {
  			$('.js-sticky-header').removeClass('shrink');
  		}

  	}) 

  };
  siteScroll();


  var siteIstotope = function() {
  	/* activate jquery isotope */
	  var $container = $('#posts').isotope({
	    itemSelector : '.item',
	    isFitWidth: true
	  });

	  $(window).resize(function(){
	    $container.isotope({
	      columnWidth: '.col-sm-3'
	    });
	  });
	  
	  $container.isotope({ filter: '*' });

	    // filter items on button click
	  $('#filters').on( 'click', 'button', function() {
	    var filterValue = $(this).attr('data-filter');
	    $container.isotope({ filter: filterValue });
	    $('#filters button').removeClass('active');
	    $(this).addClass('active');
	  });
  }

  siteIstotope();


  $('.fancybox').on('click', function() {
	  var visibleLinks = $('.fancybox');

	  $.fancybox.open( visibleLinks, {}, visibleLinks.index( this ) );

	  return false;
	});

});

// My Script.js
const activeCases = document.querySelector('#active-cases')
const deathCases = document.querySelector('#death-cases')
const recoveryCases = document.querySelector('#recovery-cases')
const lastUpdateP =document.querySelector('#last-update')

// Fetching Coronavirus API
fetch('https://covid19.mathdro.id/api')
	.then(response => response.json())
	.then(data => {
		const lastUpdate = new Date(data.lastUpdate)
		lastUpdateP.innerHTML +=`${lastUpdate.toDateString()} ${lastUpdate.getHours()}:${lastUpdate.getMinutes()}`
		activeCases.innerHTML = formatNumber(data.confirmed.value)
		deathCases.innerHTML = formatNumber(data.deaths.value)
		recoveryCases.innerHTML = (data.recovered.value != 0) ? formatNumber(data.recovered.value) : "205,789,021"
	})

// Send To Spreadsheet
const scriptURL = 'https://script.google.com/macros/s/AKfycbwzbbVTLW1OW-eS91Lb6mJ9bQKbMNh4Tw9aAqGgqyGvoUHykig_O2FXb441N-mWtddDNA/exec'
const form = document.forms['send-to-spreadsheet']
const sendButton = document.querySelector('#send')
const loadingSpinner = document.querySelector('#loading')
const successAlert = document.querySelector('#success')

const user = document.querySelector('#name')
const email = document.querySelector('#email')
const feedback = document.querySelector('#feedback')



let afterSend = (localStorage.getItem('user') !== null ? localStorage.getItem('user') : '')

if (afterSend !== '') {
	sendButton.disabled = true
	successAlert.classList.toggle('d-none')
	successAlert.innerHTML = `Terima Kasih <strong>${afterSend}</strong>  Atas Sarannya<button type="button" class="close" data-dismiss="alert" aria-label="Close">
	<span aria-hidden="true">&times;</span>
  </button>`
}

user.addEventListener('keyup', function() {
	checkInputError(this)
})
email.addEventListener('keyup', function() {
	
	if (validateEmail(this.value)) {
		this.classList.add('is-valid')
		this.classList.remove('is-invalid')
	} else {
		this.classList.remove('is-valid')
		this.classList.add('is-invalid')

	}
})
feedback.addEventListener('keyup', function() {
	checkInputError(this)
})

form.addEventListener('submit', e => {
	e.preventDefault()

	if (user.value == '') return
	if (email.value == '') return
	if (feedback.value == '') return

	if (afterSend !== '') {
		alert('Anda Telah Mengisi Form Ini, Terima Kasih')
		return
	}
	
	loadingSpinner.classList.toggle('d-none')
	fetch(scriptURL, { method: 'POST', body: new FormData(form)})
		.then(response => {
			loadingSpinner.classList.toggle('d-none')
			sendButton.disabled = true
			successAlert.innerHTML = `Terima Kasih <strong>${user.value}</strong>  Atas Sarannya<button type="button" class="close" data-dismiss="alert" aria-label="Close">
									<span aria-hidden="true">&times;</span>
									</button>`
			successAlert.classList.toggle('d-none')
			localStorage.setItem('user', user.value)
			console.log('Success!', response)
		} )
		.catch(error => console.error('Error!', error.message))
})

// Number Format Function
function formatNumber(num) {
	return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

// Check Input error
function checkInputError(input) {
	if (input.value != '') {
		input.classList.add('is-valid')
		input.classList.remove('is-invalid')
	} else {
		input.classList.remove('is-valid')
		input.classList.add('is-invalid')

	}
}

// Email Validation
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// MY SCRIPT
// https://script.google.com/macros/s/AKfycbwzbbVTLW1OW-eS91Lb6mJ9bQKbMNh4Tw9aAqGgqyGvoUHykig_O2FXb441N-mWtddDNA/exec