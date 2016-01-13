var modalTransitionLength = 300,
	landingWrap = document.getElementById('_landing-wrap'),
	nav = document.getElementById('_nav'),
	navList = nav.getElementsByTagName('ul')[0].children,
	modals = document.getElementsByClassName('modal'),
	modalActions = document.getElementsByClassName('modal-action'),
	footerList = document.getElementById('footer-actions').children;

//Set the active modal if it exists
for (var i = 0; i < modals.length; i++) {
	if(modals[i].className.indexOf('active') > -1){
		window.modal = modals[i];
		loadScript('/js/handlers/modals/' + window.modal.id.slice(1) + '.js');
		break;
	}
};

for (var i = 0; i < modalActions.length; i++) {
	modalActions[i].addEventListener('click', handleClick);
};

for (var i = 0; i < navList.length; i++) {
	navList[i].addEventListener('click', handleClick);
};

for (var i = 0; i < footerList.length; i++) {
	footerList[i].addEventListener('click', handleClick);
};

/**
 * Click listener for navigaiton actions
 */

function handleClick(e) {

	var item = e.target,
		event = item.dataset.event;

	//Scroll Event
	if(event == 'scroll'){

		var element = document.getElementById(item.dataset.element);

		//Scroll to element
		$("html").velocity("scroll", { offset: $(element).offset().top - 150, mobileHA: false,  duration: 1000 });

	}
	//Modal Transition
	else if(event == 'modal'){

		loadModal(item.dataset.modal);

		$('.wrapper').addClass('full');

	}
	//Back to landing page transition
	else if(event == 'landing') {
		returnToLanding();
	}
}

/**
 * Sends back to the landing page
 */

function returnToLanding() {
	fromModal = true;
	
	//Update window history state
	window.history.replaceState({home: 'landing'}, null, '/');
	
	$(window.modal).velocity({ translateY : '150%' }, { 
		duration: 450, 
		easing: 'ease-out',
		complete: function(){

			//Hide the modal after the animation
			window.modal.style.display = 'none';
			$(window.modal).removeClass('active-modal');
			
			$('#_nav').velocity('fadeOut', { 
				duration: modalTransitionLength, 
				complete: function(){

					//Reset the wrapper height
					$('.wrapper').removeClass('full');

					//Adjust nav menu list items to reflect the page
					navList[0].style.display = 'inline-block';
					navList[1].style.display = 'inline-block';
					navList[3].style.display = 'inline-block';
					navList[2].style.display = 'none';
					nav.className = nav.className.replace(/\btransparent\b/,'');

					$('#_nav, #_landing-wrap, #_footer').velocity('fadeIn', { 
						duration: modalTransitionLength, 
						complete: function () {
							init();
							resizeCall();
						}
					});
				}

			});
		}
	});
}


/**
 * Presents a modal
 * @param  {string} modal Modal's unique identifier
 */

function loadModal(modalId) {

	var modal = document.getElementById('_' + modalId);

	//Save modal to winodw
	window.modal = modal;

	//Update window history state
	window.history.pushState({modal : modalId}, "modal", modalId);

	loadScript('/js/handlers/modals/' + modalId + '.js');

	//Coming from landing page
	if($(landingWrap).css('display') == 'block'){

		//Fade out landing page elements
		$('#_landing-wrap, #_nav, #_footer').velocity('fadeOut', { 
			duration: modalTransitionLength, 
			complete: function(){

				$(modal).velocity({ translateY : '100%' }, {
					duration: 0, 
					delay: 0,
					complete: function(){

						//Adjust nav menu list items to reflec tthe pag 
						navList[0].style.display = 'none';
						navList[1].style.display = 'none';
						navList[3].style.display = 'inlie-block';
						navList[2].style.display = 'inline-block';
						nav.className += ' transparent';
						modal.style.display = 'block';
						modal.style.opacity = 1;

						$(nav).velocity({ opacity: 1 }, { display: "block" });
						$(modal).velocity({ translateY : '0'}, { duration: modalTransitionLength, easing: 'ease-out' });

						resizeCall();

					}
				});
			}
		}); 

	}
	else{

		$('.modal').velocity('fadeOut', {
			duration: modalTransitionLength,
			complete: function() {

				$(modal).velocity({ translateY : '100%' }, {
					duration: 0, 
					delay: 500,
					complete: function(){

						modal.style.display = 'block';
						modal.style.opacity = 1;

						$(modal).velocity({ translateY : '0'}, { duration: modalTransitionLength, easing: 'ease-out' });

						resizeCall();

					}
				});
			}
		})
	}
}

/**
 * Adds script to dom
 * @param {string} src Source of the script to load
 */

function loadScript(src) {
	$('.wrapper').addClass('full');
	//Add script to dom
	var s = document.createElement('script');
		s.type = 'text/javascript';
		s.async = true;
		s.src = src;
		var x = document.getElementsByTagName('script')[0];
		x.parentNode.insertBefore(s, x);
}

function resizeCall(width) {

	var modal = document.getElementsByClassName('active-modal')[0];

	if(modal && modal.className.indexOf('xs') > -1){
		if(window.innerWidth < screen.mobile){
			nav.style.display = 'none';
		}
		else
			nav.style.display = 'block';
	} else{
		nav.style.display = 'block';
	}
}

window.addEventListener('resize', function() {
	resizeCall(window.innerWidth);
});


window.onpopstate = function(event) {

	if(event.state == null) return;

	if(event.state && event.state.modal){

		loadModal(event.state.modal);

	}
	else{
		returnToLanding();

	}
}
