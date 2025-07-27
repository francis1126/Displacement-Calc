// Engine displacement calculator
function calcDisplacement() {
  const bore = parseFloat(document.getElementById('bore').value) / 10;
  const stroke = parseFloat(document.getElementById('stroke').value) / 10;
  const cyl = parseFloat(document.getElementById('cylinders').value);
  const disp = (Math.PI * (bore/2)**2) * stroke * cyl;
  document.getElementById('result').textContent = `Displacement: ${disp.toFixed(2)} cc`;
}

function clearDisplacementInputs() {
  document.getElementById('bore').value = '';
  document.getElementById('stroke').value = '';
  document.getElementById('cylinders').value = '';
  document.getElementById('result').textContent = '';
}
function exportPDF() {
  const element = document.querySelector('.container');
  html2pdf().from(element).save('engine-displacement.pdf');
}