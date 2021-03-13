$(document).ready(function () {
  var form = $('#addOrder')[0];
  form.addEventListener('submit', (event) => {
    addOrderEvent();
  });
});

function addOrderEvent() {
  var order = new Object();
  order.id = null;
  order.name = $('#firstName').val();
  order.email = $('#email').val();
  order.phone = $('#phone').val();
  console.log(order);
}
