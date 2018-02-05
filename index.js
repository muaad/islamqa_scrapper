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

$(document).on('click', '#see-questions', function(e) {
	e.preventDefault();
	var btn = $(this)
	btn.html('<i class="fa fa-spinner fa-spin"></i> Finding Questions...');
	chrome.storage.sync.get({
		userID: ''
	}, function (items) {
		$.get("https://kasoko.co.ke/firebase/links?user=" + items.userID, function(data) {
			var questions = '';
			var urls = []
			var header = '🕌 Islam post 8\n\n🏠Fiqh of The Family\nInvalid Marriage\n\n💫Peace be upon you\n🌎Muslims Around The World\nWhatsapp\n📞0096597409027\n\n🚨You just have to click the question you want, then the answer appears in another window👇🏻🏻\n'

			var footer = '🔔If you have any question regarding The Religion of Islam, send it to us through WhatsApp\n\n🌎 Muslims Around The World🌎_ \n📞009657409027\n\n💯The belief of the people of the Sunnah and Community'

			$.map(data.response, function (link) {
				if (urls.indexOf(link.url) === -1) {
					urls.push(link.url)
					questions += '💠' + link.text + '\nhttps://islamqa.success' + link.url + '\n\n';
				// questions += '<div class="well well-sm"><p>💠' + link.text + '<br><a href="https://islamqa.success' + link.url + '">https://islamqa.success' + link.url + '</a><br><br><br></p></div>'
				}
			});
			var md = '<div class="container"><div id="questionsModal" class="modal fade bs-example-modal-sm" tabindex="-1" role="dialog">< div class="modal-dialog modal-sm" role = "document" >	<div class="modal-content">		<div class="modal-header">			<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>			<h4 class="modal-title">Questions (' + urls.length + ')</h4>		</div>		<div class="modal-body">			<div class="alert alert-info">Here are the questions you have added to your list. Edit them to your liking and click <strong>"Copy"</strong> below. If you would like the questions removed from your list after you have copied them, click <strong>"Copy And Remove"</strong>.</div><textarea id="questionBody" class="form-control" rows="25">' + header + questions + footer + '</textarea>		</div>		<div class="modal-footer">			<button type="button" class="btn btn-success" id="copyAndRemove"><i class="fa fa-copy"></i> Copy And Remove<button type="button" class="btn btn-success" id="copyQuestions"><i class="fa fa-copy"></i> Copy</button><button type="button" class="btn btn-danger" data-dismiss="modal"><i class="fa fa-times"></i> Close</button></div>	</div></div ></div ></div >'
			$('body').append(md)
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
				if ($('.ftwa-single-q').length === 1) {
					var url = window.location.pathname;
					var text = $('.ftwa-single-title').text().split(':')[1].trim();
					$('.panel-title').append('<br><br><span class="pull-right" style="background: white;"><a href="#" class="add-to-list btn btn-sm btn-success" data-url="' + url + '" data-text="' + text + '"><i class="fa fa-plus"></i> Add To List</a></span><br><br>')
				}
				$('.panel-title').append('<a href="#" id="see-questions" class="pull-right btn btn-sm btn-success"><i class="fa fa-eye"></i> See Your Questions</a><br>')
				$('.panel-title').css('margin-bottom', '6px')
			}
			var elements = $('.list-group-item')
			elements.each(function(el) {
				var url = $(this).attr('href')
				var text = $(this).html().split('<')[0].split('-')[1]
				if (text !== '' && text !== null && text !== undefined) {
					text = text.trim();
					$(this).append('<br><br><span class="pull-right" style="background: white;"><a href="#" class="add-to-list btn btn-sm btn-success" data-url="' + url + '" data-text="' + text + '"><i class="fa fa-plus"></i> Add To List</a></span><br><br>')
				}
			})
      }
    }
}
