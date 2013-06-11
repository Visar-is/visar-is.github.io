/* Vísar.is - konnun.js 
	- Created by Brennan Novak, June 2013
	- Requires the Mac OS application CodeKit to compile prepend tags below
	- http://incident57.com/codekit

	Import JS Libraries
	@codekit-prepend "lib/jquery.1.9.1.min.js";
	@codekit-prepend "lib/enquire.js";
	@codekit-prepend "lib/html5shiv.js";
*/

$(document).ready(function() {

	// Smooth Scrolling
	$('a.scroll-link[href*=#]:not([href=#])').click(function() {
	    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') 
	        || location.hostname == this.hostname) {
	        var target = $(this.hash);
	        target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
	           if (target.length) {
				var link_height = target.offset().top - 108;		           
	             $('html,body').animate({
	                 scrollTop: link_height
	            }, 1000);
	            return false;
	        }
	    }
	});

	
	// Learn More
	var $target = $("a.learn-more");
	
	// Show & Close Lightbox
	var showLightBox = function(project) {
		lightbox_content = $('#projects-' + project).html(),
		lightbox_content = lightbox_content.replace('<a href="#" data-project="' + project + '" class="learn-more">Lesa meira</a>', ''),
		lightbox_content = lightbox_content.replace('<a href="#" data-project="' + project + '" class="right learn-more">Lesa meira</a>', '');
		$('#lightbox-content').html(lightbox_content).prepend('<a href="#" id="lightbox-close">X Loka</a>').find('.projects-content').show().addClass('bounceInDown');
		$('#lightbox').show();			
	
		$('#lightbox-close').on("click", function(e) {
			e.preventDefault();
			$('#lightbox-content').addClass('bounceOutDown');
			setTimeout(function() {
				$('#lightbox-content').removeClass('bounceOutDown');
				$('#lightbox').hide();
			}, 750);
		});		
	};
	
	// Web
	enquire.register("screen and (min-width: 1024px)", {
		match: function() {
			$target.on("click", function(e) {
				e.preventDefault();
				showLightBox($(this).data('project'));
			});	
		},
		unmatch: function() {
			$target.off("click");
		}
	});
	
	// Tablet
	enquire.register("screen and (min-width: 768px) and (max-width: 959px)", {
		match: function() {
	
			console.log('here in tablet size');
	
			$target.on("click", function(e) {
				e.preventDefault();
				showLightBox($(this).data('project'));										
			});
		},
		unmatch: function() {				
			$target.off("click");
		}
	});
	
	// Mobile
	enquire.register("screen and (max-width: 480px)", {
		match: function() {
			console.log('here in mobile size');
		
			$target.on("click", function(e) {
			
				console.log('clicked in mobile learn more');
			
				e.preventDefault();
				$(this).fadeOut();
				$('#projects-content-' + $(this).data('project')).fadeIn();
			});
		},
		unmatch: function() {
			$target.off("click");
		}
	});
	
	
	// Contact
	$('#contact_form').bind('submit', function(e){
		e.preventDefault();
		var contact_data = $('#contact_form').serialize();
		$.ajax({
			url		: 'http://static-visar.herokuapp.com/contact.php',
			type	: 'POST',
			dataType: 'json',
			data	: contact_data,
			success	: function(result) {
				$('#contact_name').val('');
				$('#contact_phone').val('');
				$('#contact_email').val('');				
				$('#contact_comment').val('');
				$('#contact_message').html(result.message);
			}
		});			
	});

});