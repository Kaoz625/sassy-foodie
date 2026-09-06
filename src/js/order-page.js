/* The order page: render the table, keep the send links in sync.
   Depends on window.SF from order.js. */
(function () {
  'use strict';
  if (!window.SF) return;

  var tableWrap = document.getElementById('order-table');
  var empty     = document.getElementById('order-empty');
  var form      = document.getElementById('order-form');
  var btnSms    = document.getElementById('btn-sms');
  var btnCash   = document.getElementById('btn-cash');
  var btnClear  = document.getElementById('order-clear');
  var copyBox   = document.getElementById('order-copy');
  var btnCopy   = document.getElementById('btn-copy');

  function extras() {
    if (!form) return {};
    return {
      name:  (form.elements.name  || {}).value || '',
      when:  (form.elements.when  || {}).value || '',
      notes: (form.elements.notes || {}).value || ''
    };
  }

  function draw() {
    var items = SF.items();

    if (!items.length) {
      if (tableWrap) tableWrap.innerHTML = '';
      if (empty) empty.hidden = false;
      [btnSms, btnCash].forEach(function (b) {
        if (!b) return;
        b.setAttribute('aria-disabled', 'true');
        b.classList.add('is-off');
      });
      if (copyBox) copyBox.value = '';
      return;
    }

    if (empty) empty.hidden = true;
    [btnSms, btnCash].forEach(function (b) {
      if (!b) return;
      b.removeAttribute('aria-disabled');
      b.classList.remove('is-off');
    });

    // a real table so a screen reader reads it as one (DESIGN.md §9)
    var rows = items.map(function (it) {
      return '<tr>' +
        '<td>' + it.name + (it.menu === 'infusion' ? ' <span class="pill">Infusion</span>' : '') + '</td>' +
        '<td><div class="qty" role="group" aria-label="Quantity for ' + it.name + '">' +
          '<button type="button" data-step="' + it.id + '" data-dir="-1" aria-label="One less ' + it.name + '">&minus;</button>' +
          '<output data-qty-for="' + it.id + '">' + it.qty + '</output>' +
          '<button type="button" data-step="' + it.id + '" data-dir="1" aria-label="One more ' + it.name + '">+</button>' +
        '</div></td>' +
        '<td>' + (it.price ? SF.money(it.price * it.qty) : 'Ask') + '</td>' +
      '</tr>';
    }).join('');

    tableWrap.innerHTML =
      '<table class="otable"><caption class="vh">Items in your order</caption>' +
      '<thead><tr><th scope="col">Item</th><th scope="col">Qty</th><th scope="col">Price</th></tr></thead>' +
      '<tbody>' + rows + '</tbody>' +
      '<tfoot><tr><td colspan="2">' + (SF.hasAskPrice() ? 'Subtotal (priced items)' : 'Total') + '</td>' +
      '<td>' + SF.money(SF.total()) + '</td></tr></tfoot></table>' +
      (SF.hasAskPrice() ? '<p class="note" style="margin-top:.75rem">Some items are priced by the day. She will confirm the final total when she replies.</p>' : '');

    SF.bind(tableWrap);
    syncLinks();
  }

  function syncLinks() {
    var text = SF.orderText(extras());
    if (btnSms)  btnSms.href  = SF.smsHref(text);
    if (btnCash) btnCash.href = SF.cashHref();
    if (copyBox) copyBox.value = text;
  }

  // block the send links while the order is empty
  [btnSms, btnCash].forEach(function (b) {
    if (!b) return;
    b.addEventListener('click', function (e) {
      if (b.getAttribute('aria-disabled') === 'true') {
        e.preventDefault();
        var m = document.getElementById('order-empty');
        if (m) { m.hidden = false; m.scrollIntoView({ block: 'center' }); }
      }
    });
  });

  if (form) form.addEventListener('input', syncLinks);
  if (btnClear) btnClear.addEventListener('click', function () { SF.clear(); });
  if (btnCopy && copyBox) {
    btnCopy.addEventListener('click', function () {
      copyBox.select();
      var done = function () { btnCopy.textContent = 'Copied'; setTimeout(function () { btnCopy.textContent = 'Copy to clipboard'; }, 1200); };
      if (navigator.clipboard) navigator.clipboard.writeText(copyBox.value).then(done, done);
      else { try { document.execCommand('copy'); } catch (e) {} done(); }
    });
  }

  document.addEventListener('sf:change', draw);
  document.addEventListener('DOMContentLoaded', draw);
  if (document.readyState !== 'loading') draw();
})();
