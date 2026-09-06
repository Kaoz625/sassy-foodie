/* Chef Daija — the order builder.
   She has no card processor. The order becomes a text message to her phone and
   a Cash App deep link. See DESIGN.md §8 — do not replace this with a fake
   checkout that implies card payment. */
window.SF = (function () {
  'use strict';

  var KEY   = 'sf_order_v1';
  var PHONE = '+12676160427';
  var CASHTAG = 'DaijaRob';

  /* --- storage --------------------------------------------------------- */
  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      var v = raw ? JSON.parse(raw) : [];
      return Array.isArray(v) ? v : [];
    } catch (e) {
      return [];                       // private mode / blocked storage
    }
  }
  function save(items) {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) { /* non-fatal */ }
  }

  var items = load();

  /* --- money ----------------------------------------------------------- */
  function money(n) { return '$' + n.toFixed(2); }
  function total() {
    return items.reduce(function (s, it) { return s + (it.price || 0) * it.qty; }, 0);
  }
  function count() {
    return items.reduce(function (s, it) { return s + it.qty; }, 0);
  }
  // items with no confirmed price cannot be totalled — say so honestly
  function hasAskPrice() {
    return items.some(function (it) { return !it.price; });
  }

  /* --- mutation -------------------------------------------------------- */
  function find(id) {
    for (var i = 0; i < items.length; i++) if (items[i].id === id) return i;
    return -1;
  }
  function add(item, qty) {
    qty = qty || 1;
    var i = find(item.id);
    if (i > -1) items[i].qty += qty;
    else items.push({ id: item.id, name: item.name, price: item.price || 0, menu: item.menu || 'kitchen', qty: qty });
    commit();
  }
  function setQty(id, qty) {
    var i = find(id);
    if (i < 0) return;
    if (qty <= 0) items.splice(i, 1);
    else items[i].qty = qty;
    commit();
  }
  function clear() { items = []; commit(); }

  function commit() {
    save(items);
    render();
    document.dispatchEvent(new CustomEvent('sf:change', { detail: { items: items } }));
  }

  /* --- the message she receives ---------------------------------------- */
  function orderText(extra) {
    var lines = ['New order from your website:', ''];
    items.forEach(function (it) {
      var tag = it.menu === 'infusion' ? ' [infusion]' : '';
      var pr = it.price ? '  ' + money(it.price * it.qty) : '  (ask price)';
      lines.push(it.qty + 'x ' + it.name + tag + pr);
    });
    lines.push('');
    lines.push(hasAskPrice()
      ? 'Subtotal on priced items: ' + money(total())
      : 'Total: ' + money(total()));
    if (extra && extra.name)  lines.push('', 'Name: ' + extra.name);
    if (extra && extra.when)  lines.push('Pickup / delivery: ' + extra.when);
    if (extra && extra.notes) lines.push('Notes: ' + extra.notes);
    return lines.join('\n');
  }

  /* iOS wants ?&body=, most Android builds accept ?body= */
  function smsHref(body) {
    var isApple = /iP(hone|ad|od)|Macintosh/.test(navigator.userAgent);
    return 'sms:' + PHONE + (isApple ? '?&' : '?') + 'body=' + encodeURIComponent(body);
  }
  function cashHref() {
    var t = total();
    return 'https://cash.app/$' + CASHTAG + (t > 0 ? '/' + t.toFixed(2) : '');
  }

  /* --- the sticky bar -------------------------------------------------- */
  function render() {
    var bar = document.querySelector('.order-bar');
    if (bar) {
      var n = count();
      bar.setAttribute('data-open', n > 0 ? 'true' : 'false');
      var sum = bar.querySelector('[data-order-sum]');
      if (sum) {
        sum.innerHTML = n + (n === 1 ? ' item' : ' items') +
          ' &middot; <strong>' + money(total()) + (hasAskPrice() ? '+' : '') + '</strong>';
      }
    }
    document.querySelectorAll('[data-order-count]').forEach(function (el) {
      el.textContent = String(count());
    });
    // reflect quantities back onto any menu card on screen
    document.querySelectorAll('[data-qty-for]').forEach(function (out) {
      var i = find(out.getAttribute('data-qty-for'));
      out.textContent = i > -1 ? String(items[i].qty) : '0';
    });
  }

  /* --- wire up menu cards ---------------------------------------------- */
  function bind(root) {
    (root || document).querySelectorAll('[data-add]').forEach(function (btn) {
      if (btn.__sfBound) return;
      btn.__sfBound = true;
      btn.addEventListener('click', function () {
        add({
          id:    btn.getAttribute('data-add'),
          name:  btn.getAttribute('data-name'),
          price: parseFloat(btn.getAttribute('data-price')) || 0,
          menu:  btn.getAttribute('data-menu') || 'kitchen'
        }, 1);
        var was = btn.textContent;
        btn.textContent = 'Added';
        setTimeout(function () { btn.textContent = was; }, 900);
      });
    });
    (root || document).querySelectorAll('[data-step]').forEach(function (btn) {
      if (btn.__sfBound) return;
      btn.__sfBound = true;
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-step');
        var dir = parseInt(btn.getAttribute('data-dir'), 10) || 1;
        var i = find(id);
        setQty(id, (i > -1 ? items[i].qty : 0) + dir);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () { bind(); render(); });

  return {
    add: add, setQty: setQty, clear: clear, bind: bind, render: render,
    items: function () { return items.slice(); },
    total: total, count: count, money: money, hasAskPrice: hasAskPrice,
    orderText: orderText, smsHref: smsHref, cashHref: cashHref,
    PHONE: PHONE, CASHTAG: CASHTAG
  };
})();
