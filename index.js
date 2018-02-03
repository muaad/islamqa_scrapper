function saveLink(userID, url, text) {
	$.ajax({
		type: "POST",
		url: 'https://islamqa-8d514.firebaseio.com/' + userID + '.json',
		dataType: 'json',
		data: JSON.stringify({url: url, text: text}),
		success: function (data, textStatus, jqXhr) {
			
		},
		error: function (request, status, error) {
			console.log(request.responseText);
		}
	});
}

function setUserID() {
	var id = Math.random().toString(36).split('.')[1];
	chrome.storage.sync.get({
		userID: ''
	}, function (items) {
		if (items.userID === '' || items.userID === undefined) {
			chrome.storage.sync.set({
				'userID': id
			})
		}
	});
}

$(document).on('click', '#see-questions', function(e) {
	e.preventDefault();
	chrome.storage.sync.get({
		userID: ''
	}, function (items) {
		$.ajax({
			type: "GET",
			url: "https://islamqa-8d514.firebaseio.com/" + items.userID,
			dataType: 'json',
			success: function (data, textStatus, jqXhr) {
				console.log(data)
			},
			error: function (request, status, error) {
				console.log(request.responseText);
			}
		});
	});
})

$(document).on('click', '.add-to-list', function(e) {
	e.preventDefault();
	var url = $(this).data('url')
	var text = $(this).data('text')
	$(this).html('<i class="fa fa-spinner"></i> Saving Link..');

	chrome.storage.sync.get({
		userID: ''
	}, function (items) {
		saveLink(items.userID, url, text);
	});
	 $(this).html('<i class="fa fa-check"></i> Added');
	 $(this).prop('disabled', true)
})

window.addEventListener ("load", addLinks, false);

function addLinks (evt) {
	var jsInitChecktimer = setInterval (checkForJS_Finish, 500);
	setUserID()

    function checkForJS_Finish () {
		if (document.querySelector(".list-group-item") != null) {
			clearInterval (jsInitChecktimer);
			$('.panel-title').append('<a href="#" id="see-questions" class="pull-right btn btn-sm btn-info"><i class="fa fa-eye"></i> See Your Questions</a><br>')
			$('.panel-title').css('margin-bottom', '6px')
			var elements = $('.list-group-item')
			elements.each(function(el) {
				var url = $(this).attr('href')
				var text = $(this).html().split('<')[0].split('-')[1].trim()
				$(this).append('<br><br><span class="pull-right" style="background: white;"><a href="#" class="add-to-list btn btn-sm btn-info" data-url="' + url + '" data-text="' + text + '"><i class="fa fa-plus"></i> Add To List</a></span><br><br>')
			})
      }
    }
}
