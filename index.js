function saveLink(userID, url, text, btn) {
	url = 'https://islamqa.info' + url
	$.get(url, function(data) {
		var parser = new DOMParser();
		var doc = parser.parseFromString(data, "text/html");
		var question = doc.body.querySelectorAll('.ftwa-single-q')[0].firstChild.nodeValue
		var ans = Array.prototype.slice.call(doc.body.querySelectorAll('.ftwa-single-answer'))
		var answer = $(ans[0]).text();

		btn.html('<i class="fa fa-check"></i> Added');
		btn.prop('disabled', true)

		$.ajax({
			type: "POST",
			url: 'https://islamqa-8d514.firebaseio.com/' + userID + '.json',
			dataType: 'json',
			data: JSON.stringify({ url: url, text: text, used: false, question: question, answer: answer }),
			success: function (data, textStatus, jqXhr) {
				
			},
			error: function (request, status, error) {
				console.log(request.responseText);
			}
		});
	})
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

function clipboard(element) {
	return new Clipboard(element, {
		text: function (trigger) {
			return $(trigger).siblings().val();
		}
	});
}

function copyQuestions() {
	clipboard('#copyQuestions').on('success', function (e) {
		$('#copyQuestions').html('<i class="fa fa-check"></i> Copied!')
	});
	clipboard('#copyQuestions').on('error', function (e) {
		$('#copyQuestions').html('<i class="fa fa-copy"></i> Copy Failed!')
		$('#copyQuestions').className = 'btn btn-danger'
	});
}

function copyAndRemoveQuestions(ids, user) {
	clipboard('#copyAndRemove').on('success', function (e) {
		$('#copyAndRemove').html('<i class="fa fa-check"></i> Copied!')
		$.ajax({
			url: 'https://kasoko.co.ke/firebase/links/update?user=' + user,
			type: 'POST',
			data: {ids: ids},
			dataType: 'json',
			success: function (data, textStatus, jqXhr) {
				console.log(data);
			},
			error: function (request, status, error) {
				console.log(request.responseText);
			}
		})
	});
	clipboard('#copyAndRemove').on('error', function (e) {
		$('#copyAndRemove').html('<i class="fa fa-copy"></i> Copy Failed!')
		$('#copyAndRemove').className = 'btn btn-danger'
	});
}

$(document).on('click', '#copyQuestions', function(e) {
	e.preventDefault();
	console.log('Clicked')
	copyQuestions();
})

$(document).on('click', '#copyAndRemove', function(e) {
	e.preventDefault();
	console.log('Clicked')
	chrome.storage.sync.get({
		userID: ''
	}, function (items) {
		copyAndRemoveQuestions($('#copyAndRemove').data('ids'), items.userID);
	})
})

$(document).on('click', '#removeModal', function(e) {
	e.preventDefault()
	// $('#questionsModal').modal('toggle');
	$('#modalHolder').remove()
	$('.modal-backdrop').remove()
	$('body').removeClass('modal-open')
})

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
			var header = '🕌 Islam post 8\n\n🏠Fiqh of The Family\nInvalid Marriage\n\n💫Peace be upon you\n🌎Muslims Around The World\nWhatsapp\n📞0096597409027\n\n🚨You just have to click the question you want, then the answer appears in another window👇🏻🏻\n\n'

			var footer = '🔔If you have any question regarding The Religion of Islam, send it to us through WhatsApp\n\n🌎 Muslims Around The World🌎_ \n📞009657409027\n\n💯The belief of the people of the Sunnah and Community'
			$.extend({
				keys: function (obj) {
					var a = [];
					$.each(obj, function (k) { a.push(k) });
					return a;
				}
			})

			var ids = $.keys(data.response);			
			
			$.map(data.response, function (link) {				
				if (urls.indexOf(link.url) === -1) {
					if (!link.used) {
						urls.push(link.url)
						questions += '💠' + link.text + '\n' + link.url + '\n\n';
						// questions += '<div class="well well-sm"><p>💠' + link.text + '<br><a href="https://islamqa.success' + link.url + '">https://islamqa.success' + link.url + '</a><br><br><br></p></div>'
					}
				}
			});
			if (questions !== '') {
				questions = header + questions + footer;
			}
			var md = '<div class="container" id="modalHolder"><div id="questionsModal" class="modal fade bs-example-modal-sm" tabindex="-1" role="dialog">< div class="modal-dialog modal-sm" role = "document" >	<div class="modal-content">		<div class="modal-header">			<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>			<h4 class="modal-title">Questions (' + urls.length + ')</h4>		</div>		<div class="modal-body">			<div class="alert alert-info">Here are the questions you have added to your list. Edit them to your liking and <strong style="color: green">double click</strong> <strong>"Copy"</strong> below. If you would like the questions removed from your list after you have copied them, <strong style="color: green">double click</strong> <strong>"Copy And Remove"</strong>.</div><textarea id="questionBody" class="form-control" rows="25">' + questions + '</textarea>		</div>		<div class="modal-footer">			<button type="button" class="btn btn-success" id="copyAndRemove" data-ids=' + ids + ' data-clipboard-target="#questionBody"><i class="fa fa-copy"></i> Copy And Remove<button type="button" class="btn btn-success" id="copyQuestions" data-clipboard-target="#questionBody"><i class="fa fa-copy"></i> Copy</button><button type="button" class="btn btn-danger" id="removeModal" data-dismiss="modal"><i class="fa fa-times"></i> Close</button></div>	</div></div ></div ></div >'
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
		if (document.querySelector("#qa-date") != null) {
			clearInterval(jsInitChecktimer);
			$('#qa-date').append(' <a href="#" id="see-questions" class="pull-right btn btn-sm btn-success" style="background: #793218;"><i class="fa fa-eye"></i> See Your Questions</a><br>')
		}
		if (document.querySelector(".list-group-item") != null) {
			clearInterval (jsInitChecktimer);
			if ($('.panel-title').length === 1) {
				if ($('.ftwa-single-q').length === 1) {
					var url = window.location.pathname;
					var text = $('.ftwa-single-title').text().split(':')[1].trim();
					$('.panel-title').append('<br><br><span class="pull-right" style="background: white;"><a href="#" class="add-to-list btn btn-sm btn-success" data-url="' + url + '" data-text="' + text + '"><i class="fa fa-plus"></i> Add To List</a></span><br><br>')
				}
				$('.panel-title').css('margin-bottom', '6px')
			}

			
			var elements = $('.list-group-item')
			elements.each(function(el) {
				var url = $(this).attr('href')
				if ($(this).parent().attr("class") === 'related-item') {
					var text = $(this).html()
				} else {
					var text = $(this).html().split('<')[0].split('-')[1]
				}
				
				if (text !== '' && text !== null && text !== undefined) {
					text = text.trim();
					$(this).append('<br><br><span class="pull-right" style="background: white;"><a href="#" class="add-to-list btn btn-sm btn-success" data-url="' + url + '" data-text="' + text + '"><i class="fa fa-plus"></i> Add To List</a></span><br><br>')
				}
			})
		}
		else if (document.querySelector(".list-link") != null) {
			clearInterval(jsInitChecktimer);
			var listLinks = $('.list-link')
			listLinks.each(function () {
				var url = $(this).attr('href')
				var text = $(this).html()
				if (text !== '' && text !== null && text !== undefined) {
					text = text.trim();
					$(this).append('<span class="pull-right"><a href="#" class="add-to-list" data-url="' + url + '" data-text="' + text + '"><i class="fa fa-plus"></i> Add To List</a></span><br><br>')
				}
			})
		}
    }
}
