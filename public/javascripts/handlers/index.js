$(document).ready(function(){

	console.log($.lazyload);

	// 2. This code loads the IFrame Player API code asynchronously.
	var tag = document.createElement('script');

	tag.src = "https://www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode
	  .insertBefore(tag, firstScriptTag);

	// 3. This function creates an <iframe> (and YouTube player)
	//    after the API code downloads.
	var player;

	function onYouTubeIframeAPIReady() {
	  player = new YT.Player('newstools-player', {
	    height: '390',
	    width: '640',
	    videoId: 'I3Dhw6YCT-U',
	    events: {}
	  });
	}

	$("img.lazy").lazyload({
	 	threshold : 240
	});

	$(".slick").slick({
		lazyLoad: 'ondemand',
		autoplay: true,
		autoplaySpeed: 3000,
	});
	
	$(".slide.hide").toggleClass('hide');
	
	$(".slick-prev").html("&lsaquo;");
	$(".slick-next").html("&rsaquo;");
	
	$('#login-form').on('submit', function(evt){
		evt.preventDefault();
		
		var errDialog = $('#login-err'),
			emailInput = document.getElementById('login-email'),
			passInput = document.getElementById('login-password');
			
		if (errDialog.css('display') != 'none')
			errDialog.slideUp();
			
		if (emailInput.value == '' && emailInput.className.indexOf('error') == -1){
			emailInput.className += ' error';
			return false;
		}
		if (passInput.value == '' && passInput.className.indexOf('error') == -1){
			passInput.className += ' error';
			return false;
		}
		
		$.ajax({
			url: "/scripts/user/login",
			method: 'post',
			contentType: "application/json",
			data: JSON.stringify({
				email: emailInput.value,
				password: passInput.value
			}),
			dataType: 'json',
			success: function(result, status, xhr){
				if (result.err)
					return this.error(null, null, result.err);
				
				window.location.replace('/content');
			},
			error: function(xhr, status, error){
				switch(error){
					case 'Unauthorized':
					case 'ERR_UNAUTHORIZED':
						$.snackbar({content: 'Invalid username or password'});
						break;
					default:
						$.snackbar({content: resolveError(error)});
				}
			}
		});
		
		return false;
	});
	
	$('#partner-signup-submit').click(function(e) {
		e.preventDefault();
		$(this).attr('disabled', 'disabled');
		$(this).html('Sending');
		
		var _this = this,
			params = {
			title: $('#tools_outlet').val(),
			link: $('#tools_website').val(),
			state: $('#tools_state').val(),
			type: $('#tools_type').val(),
			contact_firstname: $('#tools_first_name').val(),
			contact_lastname: $('#tools_last_name').val(),
			contact_phone: $('#tools_ph').val(),
			contact_email: $('#tools_em').val(),
			contact_password: $('#tools_pw').val(),
		};
		
		var valid = true;
		
		if (!params.title){
			valid = false;
			$.snackbar({content: 'Please enter a valid outlet title'});
		}else if (!params.type){
			valid = false;
			$.snackbar({content: 'Please choose an outlet type'});
		}else if (!params.contact_firstname){
			valid = false;
			$.snackbar({content: 'Please enter a valid first name'});
		}else if (!params.contact_lastname){
			valid = false;
			$.snackbar({content: 'Please enter a valid last name'});
		}else if (!params.contact_phone){
			valid = false;
			$.snackbar({content: 'Please enter a valid phone number'});
		}else if (!/(?:(?:)?[ ])*(?:(?:(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:)?[ ])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:)?[ ]))*"(?:(?:)?[ ])*)(?:\.(?:(?:)?[ ])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:)?[ ])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:)?[ ]))*"(?:(?:)?[ ])*))*@(?:(?:)?[ ])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:)?[ ])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:)?[ ])*)(?:\.(?:(?:)?[ ])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:)?[ ])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:)?[ ])*))*|(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:)?[ ])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:)?[ ]))*"(?:(?:)?[ ])*)*\<(?:(?:)?[ ])*(?:@(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:)?[ ])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:)?[ ])*)(?:\.(?:(?:)?[ ])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:)?[ ])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:)?[ ])*))*(?:,@(?:(?:)?[ ])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:)?[ ])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:)?[ ])*)(?:\.(?:(?:)?[ ])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:)?[ ])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:)?[ ])*))*)*:(?:(?:)?[ ])*)?(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:)?[ ])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:)?[ ]))*"(?:(?:)?[ ])*)(?:\.(?:(?:)?[ ])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:)?[ ])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:)?[ ]))*"(?:(?:)?[ ])*))*@(?:(?:)?[ ])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:)?[ ])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:)?[ ])*)(?:\.(?:(?:)?[ ])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:)?[ ])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:)?[ ])*))*\>(?:(?:)?[ ])*)|(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:)?[ ])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:)?[ ]))*"(?:(?:)?[ ])*)*:(?:(?:)?[ ])*(?:(?:(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:)?[ ])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:)?[ ]))*"(?:(?:)?[ ])*)(?:\.(?:(?:)?[ ])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:)?[ ])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:)?[ ]))*"(?:(?:)?[ ])*))*@(?:(?:)?[ ])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:)?[ ])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:)?[ ])*)(?:\.(?:(?:)?[ ])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:)?[ ])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:)?[ ])*))*|(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:)?[ ])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:)?[ ]))*"(?:(?:)?[ ])*)*\<(?:(?:)?[ ])*(?:@(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:)?[ ])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:)?[ ])*)(?:\.(?:(?:)?[ ])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:)?[ ])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:)?[ ])*))*(?:,@(?:(?:)?[ ])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:)?[ ])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:)?[ ])*)(?:\.(?:(?:)?[ ])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:)?[ ])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:)?[ ])*))*)*:(?:(?:)?[ ])*)?(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:)?[ ])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:)?[ ]))*"(?:(?:)?[ ])*)(?:\.(?:(?:)?[ ])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:)?[ ])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:)?[ ]))*"(?:(?:)?[ ])*))*@(?:(?:)?[ ])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:)?[ ])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:)?[ ])*)(?:\.(?:(?:)?[ ])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:)?[ ])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:)?[ ])*))*\>(?:(?:)?[ ])*)(?:,\s*(?:(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:)?[ ])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:)?[ ]))*"(?:(?:)?[ ])*)(?:\.(?:(?:)?[ ])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:)?[ ])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:)?[ ]))*"(?:(?:)?[ ])*))*@(?:(?:)?[ ])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:)?[ ])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:)?[ ])*)(?:\.(?:(?:)?[ ])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:)?[ ])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:)?[ ])*))*|(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:)?[ ])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:)?[ ]))*"(?:(?:)?[ ])*)*\<(?:(?:)?[ ])*(?:@(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:)?[ ])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:)?[ ])*)(?:\.(?:(?:)?[ ])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:)?[ ])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:)?[ ])*))*(?:,@(?:(?:)?[ ])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:)?[ ])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:)?[ ])*)(?:\.(?:(?:)?[ ])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:)?[ ])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:)?[ ])*))*)*:(?:(?:)?[ ])*)?(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:)?[ ])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:)?[ ]))*"(?:(?:)?[ ])*)(?:\.(?:(?:)?[ ])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:)?[ ])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:)?[ ]))*"(?:(?:)?[ ])*))*@(?:(?:)?[ ])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:)?[ ])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:)?[ ])*)(?:\.(?:(?:)?[ ])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:)?[ ])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:)?[ ])*))*\>(?:(?:)?[ ])*))*)?;\s*)/.test(params.contact_email)){
			valid = false;
			$.snackbar({content: 'Please enter a valid email'});
		}else if (!params.contact_password){
			valid = false;
			$.snackbar({content: 'Please enter a password'});
		}
		
		if (!valid){
			$(_this).attr('disabled', '');
			$(_this).html('Submit');
			return false;
		}
		
		$.ajax({
			url: "/scripts/outlet/create",
			method: 'post',
			contentType: "application/json",
			data: JSON.stringify(params),
			dataType: 'json',
			success: function(result, status, xhr){
				if (result.err)
					return this.error(null, null, result.err);
				
				window.location.replace('/content');
			},
			error: function(xhr, status, error){
				console.log(error);
				
				switch(error){
					case 'Unauthorized':
					case 'ERR_UNAUTHORIZED':
						$.snackbar({content: 'Invalid username or password'});
						break;
					case 'ERR_TITLE_TAKEN':
						$.snackbar({content: 'An outlet with this title already exists.'});
						break;
					default:
						$.snackbar({content:'There was an error processing your request.  If this continues, please contact us at <a href="mailto:support@fresconews.com" style="color:white">support@fresconews.com</a>', htmlAllowed: true});
				}
			},
			complete: function(){
				$(_this).attr('disabled', '');
				$(_this).html('Submit');
			}
		});
		
		return false;
	});

	var body = $("body");
	$("[data-toggle-role='controller']").on("click", function(event) {
		event.stopImmediatePropagation();
		var id = $(this).attr("data-toggle-id");
		var target = $("[data-toggle-id='" + id + "'][data-toggle-role='target']");
		var action = $(this).attr("data-toggle-action");
		if (action == "enable") {
			target.transition({top: "0"}).transition({opacity: 1});
			target.children("span").transition({y: "0px"});
			target.children("div").transition({y: "0"});
			body.addClass("toggled");
		} else if (action == "disable") {
			target.transition({opacity: 0}).transition({top: "200%"});
			target.children("span").transition({y: "-96px"});
			target.children("div").transition({y: "100%"});
			body.removeClass("toggled");

			if (typeof player !== 'undefined')
				player.pauseVideo();
			} else {
			// target.toggleClass("toggled");
				// body.toggleClass("toggled");
		}
	});
	
	//Forgot password buttons
	$('.forgot-password').on('click', function(e){
		e.preventDefault();
		
		var email = $(this).siblings('input.email').val();
		
		if (!email)
			return $.snackbar({content: 'Please enter an email address'});
		
		$.ajax({
			url: API_URL + '/v1/user/forgot',
			dataType: 'json',
			method: 'post',
			contentType: "application/json",
			data: JSON.stringify({
				email: email
			}),
			success: function(result){
				if (result.err) return this.error(null, null, result.err);

				$.snackbar({content: 'Check your inbox for a link to reset your password.'});
			},
			error: function(xhr, status, error){console.log(error);
				$.snackbar({content: resolveError(error)});
			}
		});
	});
});