// Camshaft specifications calculator
function calcCamSpecs() {
  const ivo = parseFloat(document.getElementById('ivo').value); 
  const ivc = parseFloat(document.getElementById('ivc').value); 
  const evo = parseFloat(document.getElementById('evo').value); 
  const evc = parseFloat(document.getElementById('evc').value); 
  
  if ([ivo, ivc, evo, evc].some(isNaN)) {
    document.getElementById('result').textContent = 'Please enter all cam specs';
    return;
  }

  const intakeDuration = 180 + ivo + ivc;
  const exhaustDuration = 180 + evo + evc;
  const totalDuration = intakeDuration + exhaustDuration;
  
  const intakeLC = (intakeDuration / 2) - ivo;
  const exhaustLC = (exhaustDuration / 2) - evc;
  const lobeSeparation = (intakeLC + exhaustLC) / 2;
  const overlap = ivo + evc;

  document.getElementById('result').innerHTML = `
    Intake Duration: ${intakeDuration.toFixed(2)}°<br>
    Exhaust Duration: ${exhaustDuration.toFixed(2)}°<br>
    Total Duration: ${totalDuration.toFixed(2)}°<br>
    Intake Lobe Center: ${intakeLC.toFixed(2)}°<br>
    Exhaust Lobe Center: ${exhaustLC.toFixed(2)}°<br>
    Lobe Separation Angle: ${lobeSeparation.toFixed(2)}°<br>
    Overlap: ${overlap.toFixed(2)}°
  `;
  drawCamProfileChart(ivo, ivc, evo, evc);
}

function drawCamProfileChart(ivo, ivc, evo, evc, intakeLift = 8.64, exhaustLift = 8.82) {
  const canvas = document.getElementById('camProfileChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Chart dimensions
  const w = canvas.width, h = canvas.height;
  const margin = 60;
  const zeroY = h - margin;
  const maxLift = 100;
  const liftScale = maxLift / Math.max(intakeLift, exhaustLift);

  function degToX(deg) {
    return margin + ((deg + 360) / 720) * (w - 2 * margin);
  }

  // Draw axes
  ctx.strokeStyle = "#888";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(margin, zeroY);
  ctx.lineTo(w - margin, zeroY);
  ctx.stroke();

  // Vertical lines for TDC/BDC
  [0, 180, -180].forEach((deg, i) => {
    ctx.beginPath();
    ctx.moveTo(degToX(deg), zeroY);
    ctx.lineTo(degToX(deg), margin);
    ctx.strokeStyle = "#bbb";
    ctx.stroke();
    ctx.fillStyle = "#222";
    ctx.font = "bold 15px Poppins, Arial";
    ctx.textAlign = "center";
    ctx.fillText(deg === 0 ? "TDC" : "BDC", degToX(deg), margin - 10);
  });

  // Draw exhaust lobe (centered at -180°)
  ctx.strokeStyle = "#c33";
  ctx.lineWidth = 2;
  ctx.beginPath();
  let started = false;
  const exOpenDeg = -180 - evo;
  const exCloseDeg = -180 + evc;
  for (let deg = exOpenDeg; deg <= exCloseDeg; deg += 2) {
    const x = (deg - exOpenDeg) / (exCloseDeg - exOpenDeg);
    const lift = exhaustLift * Math.sin(Math.PI * x);
    if (!started) {
      ctx.moveTo(degToX(deg), zeroY - lift * liftScale);
      started = true;
    } else {
      ctx.lineTo(degToX(deg), zeroY - lift * liftScale);
    }
  }
  ctx.stroke();

  // Draw intake lobe (centered at +90°)
  ctx.strokeStyle = "#3a3";
  ctx.lineWidth = 2;
  ctx.beginPath();
  started = false;
  const inOpenDeg = 0 + ivo;
  const inCloseDeg = 180 + ivc;
  for (let deg = inOpenDeg; deg <= inCloseDeg; deg += 2) {
    const x = (deg - inOpenDeg) / (inCloseDeg - inOpenDeg);
    const lift = intakeLift * Math.sin(Math.PI * x);
    if (!started) {
      ctx.moveTo(degToX(deg), zeroY - lift * liftScale);
      started = true;
    } else {
      ctx.lineTo(degToX(deg), zeroY - lift * liftScale);
    }
  }
  ctx.stroke();

  // 1mm lift line
  ctx.strokeStyle = "#888";
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(margin, zeroY - 1 * liftScale);
  ctx.lineTo(w - margin, zeroY - 1 * liftScale);
  ctx.stroke();
  ctx.setLineDash([]);

  // Max lift boxes
  ctx.font = "bold 15px Poppins, Arial";
  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#c33";
  ctx.lineWidth = 1;
  ctx.fillRect(degToX(-180) - 35, zeroY - exhaustLift * liftScale - 38, 70, 28);
  ctx.strokeRect(degToX(-180) - 35, zeroY - exhaustLift * liftScale - 38, 70, 28);
  ctx.fillStyle = "#c33";
  ctx.textAlign = "center";
  ctx.fillText(`${exhaustLift.toFixed(2)}mm`, degToX(-180), zeroY - exhaustLift * liftScale - 18);

  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#3a3";
  ctx.fillRect(degToX(90) - 35, zeroY - intakeLift * liftScale - 38, 70, 28);
  ctx.strokeRect(degToX(90) - 35, zeroY - intakeLift * liftScale - 38, 70, 28);
  ctx.fillStyle = "#3a3";
  ctx.fillText(`${intakeLift.toFixed(2)}mm`, degToX(90), zeroY - intakeLift * liftScale - 18);

  // Event boxes at 1mm lift
  ctx.font = "bold 14px Poppins, Arial";
  ctx.strokeStyle = "#c33";
  ctx.fillStyle = "#fff";
  // Exhaust Open
  ctx.fillRect(degToX(exOpenDeg) - 28, zeroY - 1 * liftScale - 18, 56, 24);
  ctx.strokeRect(degToX(exOpenDeg) - 28, zeroY - 1 * liftScale - 18, 56, 24);
  ctx.fillStyle = "#c33";
  ctx.textAlign = "center";
  ctx.fillText(`${evo}°`, degToX(exOpenDeg), zeroY - 1 * liftScale - 2);

  // Exhaust Close
  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#c33";
  ctx.fillRect(degToX(exCloseDeg) - 28, zeroY - 1 * liftScale - 18, 56, 24);
  ctx.strokeRect(degToX(exCloseDeg) - 28, zeroY - 1 * liftScale - 18, 56, 24);
  ctx.fillStyle = "#c33";
  ctx.fillText(`${evc}°`, degToX(exCloseDeg), zeroY - 1 * liftScale - 2);

  // Intake Open
  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#3a3";
  ctx.fillRect(degToX(inOpenDeg) - 28, zeroY - 1 * liftScale - 18, 56, 24);
  ctx.strokeRect(degToX(inOpenDeg) - 28, zeroY - 1 * liftScale - 18, 56, 24);
  ctx.fillStyle = "#3a3";
  ctx.fillText(`${ivo}°`, degToX(inOpenDeg), zeroY - 1 * liftScale - 2);

  // Intake Close
  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#3a3";
  ctx.fillRect(degToX(inCloseDeg) - 28, zeroY - 1 * liftScale - 18, 56, 24);
  ctx.strokeRect(degToX(inCloseDeg) - 28, zeroY - 1 * liftScale - 18, 56, 24);
  ctx.fillStyle = "#3a3";
  ctx.fillText(`${ivc}°`, degToX(inCloseDeg), zeroY - 1 * liftScale - 2);

  // Duration arrows and labels
  function drawArrow(x1, y1, x2, y2, color) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    // Arrowhead
    const angle = Math.atan2(y2 - y1, x2 - x1);
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - 10 * Math.cos(angle - Math.PI / 7), y2 - 10 * Math.sin(angle - Math.PI / 7));
    ctx.lineTo(x2 - 10 * Math.cos(angle + Math.PI / 7), y2 - 10 * Math.sin(angle + Math.PI / 7));
    ctx.lineTo(x2, y2);
    ctx.fill();
    ctx.restore();
  }

  // Exhaust duration arrow
  drawArrow(degToX(exOpenDeg), zeroY + 40, degToX(exCloseDeg), zeroY + 40, "#c33");
  ctx.fillStyle = "#c33";
  ctx.font = "bold 13px Poppins, Arial";
  ctx.textAlign = "center";
  ctx.fillText(`${180 + evo + evc}°`, (degToX(exOpenDeg) + degToX(exCloseDeg)) / 2, zeroY + 35);

  // Intake duration arrow
  drawArrow(degToX(inOpenDeg), zeroY + 60, degToX(inCloseDeg), zeroY + 60, "#3a3");
  ctx.fillStyle = "#3a3";
  ctx.fillText(`${180 + ivo + ivc}°`, (degToX(inOpenDeg) + degToX(inCloseDeg)) / 2, zeroY + 55);

  // Overlap arrow at TDC
  drawArrow(degToX(-10), zeroY + 80, degToX(ivo), zeroY + 80, "#222");
  drawArrow(degToX(-10), zeroY + 80, degToX(-180 + evc), zeroY + 80, "#222");
  ctx.fillStyle = "#222";
  ctx.textAlign = "left";
  ctx.fillText(`Overlap: ${ivo + evc}°`, degToX(-10) + 5, zeroY + 75);

  // Lobe center arrows and labels (top)
  const intakeLC = ((180 + ivo + ivc) / 2) - ivo;
  const exhaustLC = ((180 + evo + evc) / 2) - evc;
  drawArrow(degToX(-180), margin - 30, degToX(-180 + exhaustLC), margin - 30, "#c33");
  ctx.fillStyle = "#c33";
  ctx.textAlign = "center";
  ctx.fillText(`${exhaustLC.toFixed(0)}°`, degToX(-180 + exhaustLC / 2), margin - 35);

  drawArrow(degToX(0), margin - 30, degToX(intakeLC), margin - 30, "#3a3");
  ctx.fillStyle = "#3a3";
  ctx.fillText(`${intakeLC.toFixed(0)}°`, degToX(intakeLC / 2), margin - 35);

  // Lobe separation angle
  ctx.strokeStyle = "#222";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(degToX(-180 + exhaustLC), margin - 30);
  ctx.lineTo(degToX(intakeLC), margin - 30);
  ctx.stroke();
  ctx.fillStyle = "#222";
  ctx.font = "bold 13px Poppins, Arial";
  ctx.textAlign = "center";
  ctx.fillText(
    `Lobe Separation: ${((intakeLC + exhaustLC) / 2).toFixed(0)}°`,
    (degToX(-180 + exhaustLC) + degToX(intakeLC)) / 2,
    margin - 40
  );

  // Lobe labels
  ctx.font = "bold 16px Poppins, Arial";
  ctx.fillStyle = "#c33";
  ctx.textAlign = "left";
  ctx.fillText("EXHAUST LOBE", margin, margin - 30);
  ctx.fillStyle = "#3a3";
  ctx.textAlign = "right";
  ctx.fillText("INTAKE LOBE", w - margin, margin - 30);

  // Lobe area labels
  ctx.font = "bold 16px Poppins, Arial";
  ctx.fillStyle = "#c33";
  ctx.textAlign = "center";
  ctx.fillText("EXHAUST", degToX(-180), zeroY - exhaustLift * liftScale / 2 - 10);
  ctx.fillStyle = "#3a3";
  ctx.fillText("INTAKE", degToX(90), zeroY - intakeLift * liftScale / 2 - 10);

  // Stroke labels
  ctx.font = "13px Poppins, Arial";
  ctx.fillStyle = "#222";
  ctx.textAlign = "left";
  ctx.fillText("Power Stroke", margin - 30, zeroY + 110);
  ctx.textAlign = "center";
  ctx.fillText("Exhaust Stroke", degToX(-180), zeroY + 110);
  ctx.fillText("Intake Stroke", degToX(0), zeroY + 110);
  ctx.textAlign = "right";
  ctx.fillText("Compression Stroke", degToX(180) + 30, zeroY + 110);

  // Degree labels
  ctx.font = "12px Poppins, Arial";
  ctx.fillStyle = "#222";
  ctx.textAlign = "center";
  [-360, -270, -180, -90, 0, 90, 180, 270, 360].forEach(d => {
    ctx.fillText(`${d}`, degToX(d), zeroY + 15);
  });
}
function clearCamInputs() {
  document.getElementById('ivo').value = '';
  document.getElementById('ivc').value = '';
  document.getElementById('evo').value = '';
  document.getElementById('evc').value = '';
  document.getElementById('result').textContent = '';
  
  const canvas = document.getElementById('camProfileChart');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}
function exportPDF() {
  const element = document.querySelector('.container');
  const opt = {
    margin:       0.5,
    filename:     'camshaft-timing.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' },
    pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
  };
  html2pdf().set(opt).from(element).save();
}