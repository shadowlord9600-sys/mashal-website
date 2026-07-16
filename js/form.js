/* Contact form — delivers straight to the Mashal inbox via FormSubmit.
   (formsubmit.co: free static-form service, no account; delivery begins after
   the one-time "Activate" email it sends to the address.)

   With JS: submit over AJAX so the visitor stays on the page and gets an
   inline confirmation. Without JS: the browser performs a normal POST to the
   same service, which shows its own thank-you page. Either way the message
   lands in the inbox — nothing here depends on the visitor's mail setup. */
(function () {
  'use strict';

  var form = document.getElementById('contact-form');
  if (!form) return;

  var action = form.getAttribute('action') || '';
  // Only take over for FormSubmit + fetch-capable browsers; otherwise the
  // native POST handles everything on its own.
  if (!window.fetch || action.indexOf('formsubmit.co') === -1) return;

  var AJAX_ENDPOINT = action.replace('formsubmit.co/', 'formsubmit.co/ajax/');

  var note = document.getElementById('form-note');
  var button = form.querySelector('.form__submit');
  var defaultNote = note ? note.textContent : '';
  var buttonLabel = button ? button.textContent : '';

  function setNote(text, state) {
    if (!note) return;
    note.textContent = text;
    if (state) note.setAttribute('data-state', state);
    else note.removeAttribute('data-state');
  }

  form.addEventListener('submit', function (e) {
    // Let the browser paint its own validation UI first.
    if (!form.checkValidity()) return;
    e.preventDefault();

    var data = new FormData(form);
    var val = function (k) { return String(data.get(k) || '').trim(); };

    // Honeypot: humans never see the field, bots fill it. Pretend success.
    if (val('_honey')) { form.reset(); setNote('Thanks — your message is on its way.', 'sent'); return; }

    var role = val('role');
    var org = val('organisation');
    var payload = {
      name: val('name'),
      email: val('email'),           // FormSubmit uses this as the reply-to
      role: role,
      organisation: org,
      message: val('message'),
      _subject: role === 'School'
        ? 'Mashal session request' + (org ? ' — ' + org : '')
        : 'Mashal website — ' + (role || 'enquiry'),
      _template: 'table'
    };

    button.disabled = true;
    button.textContent = 'Sending…';

    fetch(AJAX_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        return res.json().then(function (json) { return { ok: res.ok, json: json }; });
      })
      .then(function (r) {
        var success = r.ok && (r.json.success === true || r.json.success === 'true');
        if (!success) throw new Error(r.json.message || 'send failed');
        form.reset();
        setNote('Sent — your message is in our inbox. We’ll reply to the email you entered.', 'sent');
      })
      .catch(function () {
        setNote('Couldn’t send just now — please email contact.mashal.ai@gmail.com directly.', null);
      })
      .then(function () {
        button.disabled = false;
        button.textContent = buttonLabel;
        window.setTimeout(function () {
          if (note && note.getAttribute('data-state') === 'sent') setNote(defaultNote, null);
        }, 12000);
      });
  });
})();
