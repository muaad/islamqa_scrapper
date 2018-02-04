function saveLink(userID, url, text, btn) {
	$.ajax({
		type: "POST",
		url: 'https://islamqa-8d514.firebaseio.com/' + userID + '.json',
		dataType: 'json',
		data: JSON.stringify({url: url, text: text}),
		success: function (data, textStatus, jqXhr) {
			btn.html('<i class="fa fa-check"></i> Added');
			btn.prop('disabled', true)
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

function createModal() {
	// var md = '<div id="questionsModal" class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog">< div class="modal-dialog" role = "document" >	<div class="modal-content">		<div class="modal-header">			<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>			<h4 class="modal-title">Questions</h4>		</div>		<div class="modal-body">			<p id="questionBody"></p>		</div>		<div class="modal-footer">			<button type="button" class="btn btn-default" data-dismiss="modal">Close</button></div>	</div></div ></div >'
	// $('#pager').after(md)
}

$(document).on('click', '#see-questions', function(e) {
	e.preventDefault();
	var btn = $(this)
	btn.html('<i class="fa fa-spinner fa-spin"></i> Finding Questions...');
	chrome.storage.sync.get({
		userID: ''
	}, function (items) {
		$.get("https://kasoko.co.ke/firebase/links?user=" + items.userID, function(data) {
			var questions = '';
			$.map(data.response, function (link) {
				questions += '<div class="well well-sm"<p>💠' + link.text + '<br><a href="https://islamqa.info' + link.url + '">https://islamqa.info' + link.url + '</a><br><br><br></p></div>'
			});
			var md = '<div class="container"><div id="questionsModal" class="modal fade bs-example-modal-sm" tabindex="-1" role="dialog">< div class="modal-dialog modal-sm" role = "document" >	<div class="modal-content">		<div class="modal-header">			<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>			<h4 class="modal-title">Questions</h4>		</div>		<div class="modal-body">			<p id="questionBody">' + questions + '</p>		</div>		<div class="modal-footer">			<button type="button" class="btn btn-default" data-dismiss="modal">Close</button></div>	</div></div ></div ></div >'
			$('#pager').after(md)
			$('#questionsModal').modal('toggle');
			btn.html('<i class="fa fa-eye"></i> See Your Questions');
		})
	});
})

$(document).on('click', '.add-to-list', function(e) {
	e.preventDefault();
	var btn = $(this)
	var url = btn.data('url')
	var text = btn.data('text')
	btn.html('<i class="fa fa-spinner fa-spin"></i> Saving Link..');

	chrome.storage.sync.get({
		userID: ''
	}, function (items) {
		saveLink(items.userID, url, text, btn);
	});
})

window.addEventListener ("load", addLinks, false);

function addLinks (evt) {
	var jsInitChecktimer = setInterval (checkForJS_Finish, 500);
	setUserID()

    function checkForJS_Finish () {
		if (document.querySelector(".list-group-item") != null) {
			clearInterval (jsInitChecktimer);
			if ($('.panel-title').length === 1) {
				$('.panel-title').append('<a href="#" id="see-questions" class="pull-right btn btn-sm btn-info"><i class="fa fa-eye"></i> See Your Questions</a><br>')
				$('.panel-title').css('margin-bottom', '6px')
			}
			var elements = $('.list-group-item')
			elements.each(function(el) {
				var url = $(this).attr('href')
				var text = $(this).html().split('<')[0].split('-')[1].trim()
				$(this).append('<br><br><span class="pull-right" style="background: white;"><a href="#" class="add-to-list btn btn-sm btn-info" data-url="' + url + '" data-text="' + text + '"><i class="fa fa-plus"></i> Add To List</a></span><br><br>')
			})
      }
    }
}
