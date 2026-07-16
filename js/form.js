/* Static contact form.
   There is no backend (CONTEXT.md non-goal), so the form composes a pre-filled
   message in the visitor's own mail client via a mailto: URL.

   Migration path: point the form's action at a Formspree (or similar) endpoint
   and delete the data-mailto attribute. This script then does nothing and the
   browser performs a normal POST. */
(function () {
  'use strict';

  var form = document.getElementById('contact-form');
  if (!form) return;

  var to = form.getAttribute('data-mailto');
  if (!to) return; // a real endpoint is configured — leave the form alone

  var note = document.getElementById('form-note');
  var defaultNote = note ? note.textContent : '';

  form.addEventListener('submit', function (e) {
    // Let the browser show its own validation UI first.
    if (!form.checkValidity()) return;

    e.preventDefault();

    var data = new FormData(form);
    var val = function (k) { return String(data.get(k) || '').trim(); };

    var role = val('role');
    var org = val('organisation');

    var subject = role === 'School'
      ? 'Mashal session request' + (org ? ' — ' + org : '')
      : 'Mashal — ' + (role || 'enquiry');

    var body = [
      'Name: ' + val('name'),
      'Email: ' + val('email'),
      'Writing as: ' + role,
      org ? 'School / organisation: ' + org : null,
      '',
      val('message')
    ].filter(function (line) { return line !== null; }).join('\n');

    /* Gmail's compose URL rather than mailto: — mailto depends on the
       visitor's OS having a default mail app and fails SILENTLY when there
       isn't one. Gmail compose always opens a page with To/Subject/Body
       pre-filled (after sign-in if needed), which matches this audience.
       The form's own action stays mailto: as the no-JS fallback. */
    var href = 'https://mail.google.com/mail/?view=cm&fs=1' +
      '&to=' + encodeURIComponent(to) +
      '&su=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);

    var win = window.open(href, '_blank', 'noopener');

    /* Belt and braces: also copy the composed message, so even a popup
       blocker can't leave the visitor with nothing. */
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText('To: ' + to + '\nSubject: ' + subject + '\n\n' + body)
        .catch(function () { /* clipboard denied — the note still names the address */ });
    }

    if (note) {
      note.textContent = win
        ? 'Opening Gmail with your message ready to send…'
        : 'Your browser blocked the Gmail tab — your message was copied instead. Paste it into any email to ' + to + '.';
      note.setAttribute('data-state', 'sent');
      window.setTimeout(function () {
        note.textContent = defaultNote;
        note.removeAttribute('data-state');
      }, 12000);
    }
  });
})();
