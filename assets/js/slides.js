let slideIndex = [1];
/* Class the members of each slideshow group with different CSS classes */
let slideId = ["mySlides3"]
showSlides(1, 0);


function plusSlides(n, no) {
  showSlides(slideIndex[no] += n, no);
}

function currentSlide(n, no)
{
    slideIndex[no] = n;
    showSlides(n, no);
}

function showSlides(n, no) {
  let i;
  let x = document.getElementsByClassName(slideId[no]);
  console.log(x);
  if (n > x.length) {slideIndex[no] = 1}
  if (n < 1) {slideIndex[no] = x.length}
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  x[slideIndex[no]].style.display = "block";
}



function adjustDivSize() {
    //var embedDiv = document.getElementById('full-width-element');
    //var widgetDiv = document.getElementById('widget-div');
    //if (window.innerWidth < 1075) {
    //    // Content overflows vertically, add a class or change styles
    //    embedDiv.style.display = 'none';
    //    widgetDiv.style.display = 'inline';
    //    // Or set a specific height
    //    // myDiv.style.height = '300px';
    //} else {
    //    widgetDiv.style.display = 'none';
    //    embedDiv.style.display = 'inline';
    //}
}

// Call the function on page load and window resize
window.addEventListener('load', adjustDivSize);
window.addEventListener('resize', adjustDivSize);