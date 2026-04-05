/* ═══════════════════════════════════════════
   Ata Flug Transfer – Booking Form Logic
   ═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {

  var PHONE = '905052281596';

  // ── Pre-fill from URL params (region cards link here with ?bolge=...)
  var params = new URLSearchParams(window.location.search);
  var bolgeParam = params.get('bolge');
  if (bolgeParam) {
    var dropoffEl = document.getElementById('dropoff');
    if (dropoffEl) dropoffEl.value = decodeURIComponent(bolgeParam);
  }

  // ── Transfer type toggle
  var typeRadios = document.querySelectorAll('input[name="transfer-type"]');
  var pickupLabel = document.getElementById('pickup-label');
  var dropoffLabel = document.getElementById('dropoff-label');

  typeRadios.forEach(function (radio) {
    radio.addEventListener('change', function () {
      if (pickupLabel && dropoffLabel) {
        if (radio.value === 'otel-havalimani') {
          pickupLabel.textContent = 'Otel / Konaklama Adı';
          dropoffLabel.textContent = 'Bırakış Noktası';
        } else if (radio.value === 'havalimani-otel') {
          pickupLabel.textContent = 'Alış Noktası';
          dropoffLabel.textContent = 'Otel / Konaklama Adı';
        } else {
          pickupLabel.textContent = 'Alış Noktası';
          dropoffLabel.textContent = 'Bırakış Noktası';
        }
      }
    });
  });

  // ── Form submission -> WhatsApp
  var bookingForm = document.getElementById('booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Gather values
      var typeEl = document.querySelector('input[name="transfer-type"]:checked');
      var transferType = typeEl ? typeEl.parentElement.textContent.trim() : 'Belirtilmedi';
      var pickup = val('pickup');
      var dropoff = val('dropoff');
      var date = val('date');
      var time = val('time');
      var passengers = val('passengers');
      var vehicle = selText('vehicle');
      var luggage = val('luggage');
      var name = val('fullname');
      var phone = val('phone');
      var email = val('email');
      var flight = val('flight');
      var notes = val('notes');

      // Validate required
      if (!pickup || !dropoff || !date || !time || !name || !phone) {
        showError('Lütfen zorunlu alanları doldurunuz.');
        return;
      }

      // Format date
      var formattedDate = formatDate(date);

      // Build WhatsApp message
      var msg = '🚗 *Yeni Transfer Rezervasyonu*\n';
      msg += '━━━━━━━━━━━━━━━━━━━━\n\n';
      msg += '📋 *Transfer Tipi:* ' + transferType + '\n';
      msg += '📍 *Alış:* ' + pickup + '\n';
      msg += '📍 *Bırakış:* ' + dropoff + '\n';
      msg += '📅 *Tarih:* ' + formattedDate + '\n';
      msg += '🕐 *Saat:* ' + time + '\n';
      msg += '👥 *Yolcu Sayısı:* ' + passengers + '\n';
      msg += '🚘 *Araç Tipi:* ' + vehicle + '\n';
      if (luggage) msg += '🧳 *Bavul Sayısı:* ' + luggage + '\n';
      msg += '\n👤 *Ad Soyad:* ' + name + '\n';
      msg += '📞 *Telefon:* ' + phone + '\n';
      if (email) msg += '📧 *E-posta:* ' + email + '\n';
      if (flight) msg += '✈️ *Uçuş No:* ' + flight + '\n';
      if (notes) msg += '\n📝 *Notlar:* ' + notes + '\n';
      msg += '\n━━━━━━━━━━━━━━━━━━━━\n';
      msg += '_Bu mesaj ataflugtransfer.com üzerinden gönderilmiştir._';

      var url = 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent(msg);
      window.open(url, '_blank');

      // Show success
      var successEl = document.getElementById('form-success');
      if (successEl) {
        successEl.style.display = 'block';
        bookingForm.style.display = 'none';
      }
    });
  }

  // ── Mini booking form on homepage
  var miniForm = document.getElementById('mini-booking');
  if (miniForm) {
    miniForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var pickup = miniForm.querySelector('[name="mini-pickup"]');
      var dropoff = miniForm.querySelector('[name="mini-dropoff"]');
      var date = miniForm.querySelector('[name="mini-date"]');
      var passengers = miniForm.querySelector('[name="mini-passengers"]');

      var queryParts = [];
      if (pickup && pickup.value) queryParts.push('pickup=' + encodeURIComponent(pickup.value));
      if (dropoff && dropoff.value) queryParts.push('bolge=' + encodeURIComponent(dropoff.value));
      if (date && date.value) queryParts.push('date=' + encodeURIComponent(date.value));
      if (passengers && passengers.value) queryParts.push('passengers=' + encodeURIComponent(passengers.value));

      window.location.href = 'rezervasyon' + (queryParts.length ? '?' + queryParts.join('&') : '');
    });
  }

  // ── Pre-fill full form from URL params (from mini form)
  if (params.get('pickup')) setVal('pickup', params.get('pickup'));
  if (params.get('date')) setVal('date', params.get('date'));
  if (params.get('passengers')) setVal('passengers', params.get('passengers'));

  // ── Contact form -> WhatsApp
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = val('contact-name');
      var phone = val('contact-phone');
      var message = val('contact-message');

      if (!name || !phone || !message) {
        showError('Lütfen tüm alanları doldurunuz.');
        return;
      }

      var msg = '📩 *İletişim Formu*\n';
      msg += '━━━━━━━━━━━━━━━━━━━━\n\n';
      msg += '👤 *Ad Soyad:* ' + name + '\n';
      msg += '📞 *Telefon:* ' + phone + '\n';
      msg += '💬 *Mesaj:* ' + message + '\n';
      msg += '\n_Bu mesaj ataflugtransfer.com üzerinden gönderilmiştir._';

      var url = 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent(msg);
      window.open(url, '_blank');

      var successEl = document.getElementById('contact-success');
      if (successEl) {
        successEl.style.display = 'block';
        contactForm.style.display = 'none';
      }
    });
  }

  // ── Helpers
  function val(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  function setVal(id, value) {
    var el = document.getElementById(id);
    if (el) el.value = decodeURIComponent(value);
  }

  function selText(id) {
    var el = document.getElementById(id);
    if (el && el.selectedIndex >= 0) return el.options[el.selectedIndex].text;
    return '';
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    var parts = dateStr.split('-');
    if (parts.length === 3) return parts[2] + '.' + parts[1] + '.' + parts[0];
    return dateStr;
  }

  function showError(msg) {
    var errEl = document.getElementById('form-error');
    if (errEl) {
      errEl.textContent = msg;
      errEl.style.display = 'block';
      setTimeout(function () { errEl.style.display = 'none'; }, 4000);
    } else {
      alert(msg);
    }
  }

});
