function setYear(y) {
  document.querySelectorAll('.year-pill').forEach(el => el.classList.remove('active'));
  event.target.classList.add('active');
}
function setMonth(m) {
  document.querySelectorAll('.month-pill').forEach(el => el.classList.remove('active'));
  event.target.classList.add('active');
}
