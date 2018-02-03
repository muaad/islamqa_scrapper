// // Saves options to chrome.storage
// function save_options() {
//   var endpointURL = document.getElementById('endpointURL').value;
//   chrome.storage.sync.set({
//     endpointURL
//   }, function() {
//     // Update status to let user know options were saved.
//     var status = document.getElementById('status');
//     status.className = "alert alert-success";
//     status.textContent = 'URL successfully saved.';
//     setTimeout(function() {
//       status.className = ""
//       status.textContent = '';
//     }, 2000);
//   });
// }

// // Restores URL field using the preferences stored in chrome.storage.
// function restore_options() {
//   chrome.storage.sync.get({
//     endpointURL: ''
//   }, function(items) {
//     document.getElementById('endpointURL').value = items.endpointURL;
//   });
// }
document.addEventListener('DOMContentLoaded', loadQuestions);
// document.getElementById('save').addEventListener('click',
//     save_options);

function loadQuestions() {
  $('#questions').html('data')
  document.getElementById('questions').innerHTML = 'Hello'
  chrome.storage.sync.get({
    userID: ''
  }, function (items) {
    $.ajax({
      type: "GET",
      url: "https://islamqa-8d514.firebaseio.com/" + items.userID,
      dataType: 'json',
      success: function (data, textStatus, jqXhr) {
        $('#questions').html(data)
      },
      error: function (request, status, error) {
        console.log(request.responseText);
      }
    });
  });
}