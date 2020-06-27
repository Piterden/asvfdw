function Info(objNameText) {
  var objText = document.getElementById(objNameText);
  if ( objText !== null ) {
    objText.style.display = (objText.style.display == '') ? 'none' : '';
  }
}