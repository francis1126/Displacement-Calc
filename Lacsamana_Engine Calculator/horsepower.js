// Horsepower calculator
function calcHp() {
  const torque = parseFloat(document.getElementById('torque').value);
  const rpm = parseFloat(document.getElementById('rpm').value);
  const showTorque = document.getElementById('showTorque') ? document.getElementById('showTorque').checked : true;
  if (isNaN(torque) || isNaN(rpm)) {
    document.getElementById('result').textContent = '';
    drawHpChart(0, 0, showTorque);
    return;
  }
  const hp = (torque * rpm) / 7127;
  document.getElementById('result').textContent = `Estimated HP: ${hp.toFixed(2)} hp`;
  drawHpChart(torque, rpm, showTorque);
}
function clearHorsepowerInputs() {
  document.getElementById('torque').value = '';
  document.getElementById('rpm').value = '';
  document.getElementById('result').textContent = '';
  const canvas = document.getElementById('hpChart');
  if (canvas) canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
}

function drawHpChart(torqueInput, rpmInput, showTorque = true) {
  const canvas = document.getElementById('hpChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Chart settings
  const w = canvas.width, h = canvas.height;
  const margin = 50;
  const minRpm = 1000, maxRpm = 14000, step = 500;
  let maxHp = 0, maxTorque = 0;
  const hpData = [], tqData = [];

  // Calculate HP and Torque for each RPM step
  for (let rpm = minRpm; rpm <= maxRpm; rpm += step) {
   
    const torque = torqueInput;
    const hp = (torque * rpm) / 7127;
    hpData.push({ rpm, hp });
    tqData.push({ rpm, torque });
    if (hp > maxHp) maxHp = hp;
    if (torque > maxTorque) maxTorque = torque;
  }

  // Axes
  ctx.strokeStyle = "#888";
  ctx.beginPath();
  ctx.moveTo(margin, h - margin);
  ctx.lineTo(w - margin, h - margin);
  ctx.moveTo(margin, h - margin);
  ctx.lineTo(margin, margin);
  ctx.stroke();

  // Labels
  ctx.font = "13px Poppins, Arial";
  ctx.fillStyle = "#222";
  ctx.textAlign = "center";
  ctx.fillText("RPM", w / 2, h - 10);
  ctx.save();
  ctx.translate(15, h / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText("Value", 0, 0);
  ctx.restore();

  // X axis ticks
  ctx.textAlign = "center";
  for (let rpm = minRpm; rpm <= maxRpm; rpm += 2000) {
    const x = margin + ((rpm - minRpm) / (maxRpm - minRpm)) * (w - 2 * margin);
    ctx.fillText(rpm, x, h - margin + 20);
    ctx.beginPath();
    ctx.moveTo(x, h - margin - 5);
    ctx.lineTo(x, h - margin + 5);
    ctx.stroke();
  }

  // Y axis ticks 
  const yMax = Math.max(maxHp, maxTorque);
  ctx.textAlign = "right";
  for (let v = 0; v <= yMax; v += Math.ceil(yMax / 5)) {
    const y = h - margin - (v / yMax) * (h - 2 * margin);
    ctx.fillText(v.toFixed(0), margin - 10, y + 4);
    ctx.beginPath();
    ctx.moveTo(margin - 5, y);
    ctx.lineTo(margin + 5, y);
    ctx.stroke();
  }

  // Plot HP curve
  ctx.strokeStyle = "#007bff";
  ctx.lineWidth = 2;
  ctx.beginPath();
  hpData.forEach((point, i) => {
    const x = margin + ((point.rpm - minRpm) / (maxRpm - minRpm)) * (w - 2 * margin);
    const y = h - margin - (point.hp / yMax) * (h - 2 * margin);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
  ctx.fillStyle = "#007bff";
  ctx.fillText("HP", w - margin - 20, margin + 10);

  // Plot Torque curve if enabled
  if (showTorque) {
    ctx.strokeStyle = "#ff9900";
    ctx.lineWidth = 2;
    ctx.beginPath();
    tqData.forEach((point, i) => {
      const x = margin + ((point.rpm - minRpm) / (maxRpm - minRpm)) * (w - 2 * margin);
      const y = h - margin - (point.torque / yMax) * (h - 2 * margin);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.fillStyle = "#ff9900";
    ctx.fillText("Torque", w - margin - 60, margin + 10);
  }

  // Draw vertical marker for current RPM if rpmInput is given
  if (rpmInput && rpmInput >= minRpm && rpmInput <= maxRpm) {
    const x = margin + ((rpmInput - minRpm) / (maxRpm - minRpm)) * (w - 2 * margin);
    ctx.strokeStyle = "#888";
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(x, h - margin);
    ctx.lineTo(x, margin);
    ctx.stroke();
    ctx.setLineDash([]);
  }
}

function exportPDF() {
  const element = document.querySelector('.container');
  const opt = {
    margin:       0.5,
    filename:     'horsepower.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' },
    pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
  };
  html2pdf().set(opt).from(element).save();
}
