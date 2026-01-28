// Inline JavaScript
let chatTimeEdited = false;
    let statusBarTimeEdited = false;
    let currentImageUrl = '';
    let currentModel = 'A';
    let advancedOpen = false;

    function updateTimeInputs() {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const time = `${h}:${m}`;
      if (!chatTimeEdited) document.getElementById('modelA_chatTimeInput').value = time;
      if (!statusBarTimeEdited) document.getElementById('modelA_statusBarTimeInput').value = time;
    }

    function showToast(msg, ok = true) {
      const t = document.getElementById('toast');
      const i = t.querySelector('i');
      const s = t.querySelector('span');
      s.textContent = msg;
      t.className = 'show ' + (ok ? 'success' : 'error');
      i.className = ok ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
      setTimeout(() => t.classList.remove('show'), 3500);
    }

    const tb = document.getElementById('sidebarToggle');
    const sb = document.getElementById('socialSidebar');
    const ti = document.getElementById('toggleIcon');
    tb.addEventListener('click', () => {
      sb.classList.toggle('open');
      ti.classList.toggle('fa-bars');
      ti.classList.toggle('fa-xmark');
      ti.classList.toggle('rotated');
    });
    document.addEventListener('click', e => {
      if (sb.classList.contains('open') && !sb.contains(e.target) && !tb.contains(e.target)) {
        sb.classList.remove('open');
        ti.className = 'fas fa-bars toggle-icon';
      }
    });

    const modelChips = document.querySelectorAll('.model-chip');
    const fieldsA = document.getElementById('fieldsA');
    const fieldsB = document.getElementById('fieldsB');
    const advancedSection = document.getElementById('advancedFieldsSection');
    const toggleBtn = document.getElementById('toggleAdvanced');

    modelChips.forEach(chip => {
      chip.addEventListener('click', () => {
        modelChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        currentModel = chip.dataset.model;

        if (currentModel === 'A') {
          fieldsA.classList.add('active');
          fieldsB.classList.remove('active');
          updateTimeInputs();
        } else {
          fieldsA.classList.remove('active');
          fieldsB.classList.add('active');
        }

        if (advancedOpen) advancedSection.classList.add('active');
      });
    });

    toggleBtn.addEventListener('click', () => {
      advancedOpen = !advancedOpen;
      advancedSection.classList.toggle('active', advancedOpen);
      toggleBtn.innerHTML = advancedOpen
        ? '<i class="fas fa-times"></i> <span>Sembunyikan Detail</span>'
        : '<i class="fas fa-sliders-h"></i> <span>Atur Detail</span>';
    });

    function initChipSelectors() {
      document.querySelectorAll('.chip-selector').forEach(container => {
        const chips = container.querySelectorAll('.chip');
        chips.forEach(chip => {
          chip.addEventListener('click', () => {
            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
          });
        });
      });
    }

    let activeColorInput = null;
    let ctx = null;

    function openColorModal(inputId, previewId) {
      activeColorInput = { inputId, previewId };
      const color = document.getElementById(inputId).value || '#FFFFFF';
      document.getElementById('modalHexInput').value = color;
      drawColorWheel();
      document.getElementById('colorWheelModal').style.display = 'flex';
    }

    function closeColorModal() {
      document.getElementById('colorWheelModal').style.display = 'none';
      activeColorInput = null;
    }

    function rgbToHex(r, g, b) {
      return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase();
    }

    function drawColorWheel() {
      const canvas = document.getElementById('colorWheel');
      if (!ctx) ctx = canvas.getContext('2d');
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) - 10;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let angle = 0; angle < 360; angle++) {
        const startAngle = (angle - 1) * Math.PI / 180;
        const endAngle = (angle + 1) * Math.PI / 180;

        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        gradient.addColorStop(0, 'white');
        gradient.addColorStop(1, `hsl(${angle}, 100%, 50%)`);

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      const overlay = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      overlay.addColorStop(0, 'rgba(255,255,255,0)');
      overlay.addColorStop(1, 'rgba(0,0,0,1)');
      ctx.fillStyle = overlay;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    document.getElementById('colorWheel').addEventListener('click', (e) => {
      if (!activeColorInput || !ctx) return;
      const canvas = document.getElementById('colorWheel');
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const pixel = ctx.getImageData(x, y, 1, 1).data;
      const hex = rgbToHex(pixel[0], pixel[1], pixel[2]);
      document.getElementById('modalHexInput').value = hex;
      updateActiveColor(hex);
    });

    document.getElementById('modalHexInput').addEventListener('input', (e) => {
      let val = e.target.value.trim().toUpperCase();
      if (val === '') return;
      if (!val.startsWith('#')) val = '#' + val;
      if (/^#[0-9A-F]{6}$/.test(val)) updateActiveColor(val);
    });

    function updateActiveColor(hex) {
      if (!activeColorInput) return;
      document.getElementById(activeColorInput.inputId).value = hex;
      document.getElementById(activeColorInput.previewId).style.backgroundColor = hex;
    }

    document.getElementById('closeColorModal').addEventListener('click', closeColorModal);
    window.addEventListener('click', (e) => {
      if (e.target === document.getElementById('colorWheelModal')) closeColorModal();
    });

    function setupColorPickers() {
      document.getElementById('bubblePreview').addEventListener('click', () => openColorModal('modelA_bubbleColorInput', 'bubblePreview'));
      document.getElementById('menuPreview').addEventListener('click', () => openColorModal('modelA_menuColorInput', 'menuPreview'));
      document.getElementById('textPreview').addEventListener('click', () => openColorModal('modelA_textColorInput', 'textPreview'));
    }

    document.getElementById('generateBtn').addEventListener('click', () => {
      const mainText = document.getElementById('mainTextInput').value.trim();
      if (!mainText) return showToast('Masukkan pesan!', false);

      const btn = document.getElementById('generateBtn');
      const img = document.getElementById('resultImage');
      const dl = document.getElementById('downloadButton');

      let url = '';

      if (currentModel === 'A') {
        const chatTime = document.getElementById('modelA_chatTimeInput').value;
        const statusBarTime = document.getElementById('modelA_statusBarTimeInput').value;
        const signalName = document.querySelector('#modelA_signalNameInput .chip.active').dataset.value;
        const fontName = document.querySelector('#modelA_fontNameInput .chip.active').dataset.value;
        const bubbleColor = document.getElementById('modelA_bubbleColorInput').value;
        const menuColor = document.getElementById('modelA_menuColorInput').value;
        const textColor = document.getElementById('modelA_textColorInput').value;

        url = `https://anabot.my.id/api/maker/iqc?text=${encodeURIComponent(mainText)}&chatTime=${encodeURIComponent(chatTime)}&statusBarTime=${encodeURIComponent(statusBarTime)}&signalName=${encodeURIComponent(signalName)}&bubbleColor=${encodeURIComponent(bubbleColor)}&menuColor=${encodeURIComponent(menuColor)}&textColor=${encodeURIComponent(textColor)}&fontName=${encodeURIComponent(fontName)}&apikey=freeApikey`;
      } else {
        const time = document.getElementById('modelB_time').value;
        const carrier = document.querySelector('#modelB_carrier .chip.active').dataset.value;
        const battery = document.getElementById('modelB_battery').value;
        const signal = document.getElementById('modelB_signal').value;
        const emoji = "apple";

        url = `https://brat.siputzx.my.id/iphone-quoted?time=${encodeURIComponent(time)}&messageText=${encodeURIComponent(mainText)}&carrierName=${encodeURIComponent(carrier)}&batteryPercentage=${battery}&signalStrength=${signal}&emojiStyle=${encodeURIComponent(emoji)}`;
      }

      currentImageUrl = url;
      btn.disabled = true;
      btn.innerHTML = '<span class="btn-loader"></span> <span>Sedang Menghasilkan...</span>';
      img.style.display = 'none';
      dl.style.display = 'none';

      img.onload = () => {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> <span>Generate Gambar</span>';
        img.style.display = 'block';
        dl.style.display = 'flex';
        showToast('Gambar berhasil dibuat!');
      };

      img.onerror = () => {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> <span>Generate Gambar</span>';
        showToast('Gagal memuat gambar. Coba lagi!', false);
      };

      img.src = url;
    });

    /* === FIXED DOWNLOAD SYSTEM (NO TAB, NO REDIRECT, DIRECT TO DOWNLOADS) === */

    document.getElementById('downloadButton').addEventListener('click', async (e) => {
  e.preventDefault();
  e.stopPropagation();

  if (!currentImageUrl) {
    showToast('Tidak ada gambar untuk diunduh.', false);
    return;
  }

  const filename = `iphone-quote-${Date.now()}.png`;

  showToast('Sedang mengunduh...');

  try {
    const resp = await fetch(currentImageUrl, { cache: 'no-store' });
    const blob = await resp.blob();

    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(blobUrl);
    showToast('Gambar diunduh!');
  } 
  catch (err) {
    // fallback 100% sama seperti sistem BRAT milik Paduka
    const a = document.createElement('a');
    a.href = currentImageUrl;
    a.download = filename;
    a.target = '_self';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
});


    document.addEventListener('DOMContentLoaded', () => {
      updateTimeInputs();
      setInterval(updateTimeInputs, 1000);
      initChipSelectors();
      setupColorPickers();
      drawColorWheel();
    });

