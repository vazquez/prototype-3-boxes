$(document).ready(function(){
  $('#default').click(function(event) {
    event.preventDefault();
    $('.container').attr('id', 'default');
  });
  $('#navy').click(function(event) {
    event.preventDefault();
    $('.container').attr('id', 'navy');
  });
  $('#green').click(function(event) {
    event.preventDefault();
    $('.container').attr('id', 'green');
  });
  $('#teal').click(function(event) {
    event.preventDefault();
    $('.container').attr('id', 'teal');
  });
  $('#magenta').click(function(event) {
    event.preventDefault();
    $('.container').attr('id', 'magenta');
  });
});
