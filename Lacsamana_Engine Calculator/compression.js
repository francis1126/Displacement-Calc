
// Compression ratio calculator

const compTypeSelect = document.getElementById('compType');
if (compTypeSelect) {
  compTypeSelect.addEventListener('change', function() {
    document.getElementById('staticInputs').style.display = this.value === 'static' ? 'block' : 'none';
    document.getElementById('dynamicInputs').style.display = this.value === 'dynamic' ? 'block' : 'none';
  });
}

function calculateCR() {
  const compType = document.getElementById('compType').value;

  if (compType === 'static') {
  const swept = parseFloat(document.getElementById('swept').value);
  const tdcVol = parseFloat(document.getElementById('tdcVolume').value);
  const sparkThreadVol = parseFloat(document.getElementById('sparkThreadVol').value);

  if (isNaN(swept) || isNaN(tdcVol) || isNaN(sparkThreadVol)) {
    document.getElementById('result').textContent = 'Please enter all values';
    return;
  }

  const totalClearance = tdcVol + sparkThreadVol;
  const cr = (swept + totalClearance) / totalClearance;
  document.getElementById('result').textContent = `Static CR: ${cr.toFixed(2)}:1`;
  return;
}

  if (compType === 'dynamic') {
    const bore = parseFloat(document.getElementById('bore').value);
    const stroke = parseFloat(document.getElementById('stroke').value);
    const chamberVolTDC = parseFloat(document.getElementById('chamberVolTDC').value);
    const ivc = parseFloat(document.getElementById('ivc').value);

    if (isNaN(bore) || isNaN(stroke) || isNaN(chamberVolTDC) || isNaN(ivc)) {
      document.getElementById('result').textContent = 'Please enter all values';
      return;
    }

    const effectiveStroke = stroke * (1.147 - ivc / 180);
    const bore_cm = bore / 10;
    const effectiveStroke_cm = effectiveStroke / 10;
    const sweptVolume = (Math.PI / 4) * Math.pow(bore_cm, 2) * effectiveStroke_cm;
    const dynamicCR = (sweptVolume + chamberVolTDC) / chamberVolTDC;

    console.log(`DEBUG: effectiveStroke = ${effectiveStroke}`);
    console.log(`DEBUG: sweptVolume = ${sweptVolume}`);
    console.log(`DEBUG: dynamicCR = ${dynamicCR}`);

    document.getElementById('result').innerHTML = `
      Effective Stroke: ${effectiveStroke.toFixed(2)} mm<br>
      Dynamic CR: ${dynamicCR.toFixed(2)}:1
    `;
  }

  else {
    document.getElementById('result').textContent = 'Please select a compression type.';
  }
}

function clearCompressionInputs() {
  // Static inputs
  document.getElementById('swept').value = '';
  document.getElementById('tdcVolume').value = '';
  document.getElementById('sparkThreadVol').value = '';
  // Dynamic inputs
  document.getElementById('bore').value = '';
  document.getElementById('stroke').value = '';
  document.getElementById('rodLength').value = '';
  document.getElementById('chamberVolTDC').value = '';
  document.getElementById('ivc').value = '';
  document.getElementById('result').textContent = '';
}
function exportPDF() {
  const element = document.querySelector('.container');
  html2pdf().from(element).save('compression-ratio.pdf');
}
