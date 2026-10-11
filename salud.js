document.addEventListener('DOMContentLoaded', () => {
  setFechaIngresoHoy();
  filtrarLicencias(); // Aplicar filtro por defecto (Activas)
});

// Asignar fecha actual al formulario de ingreso
function setFechaIngresoHoy() {
  const fechaInput = document.getElementById('salud-fecha-ingreso');
  if (fechaInput) {
    const hoy = new Date().toISOString().split('T')[0];
    fechaInput.value = hoy;
  }
}

// Registrar nueva licencia médica
function handleLicenciaSubmit(e) {
  e.preventDefault();

  const curso = document.getElementById('salud-curso').value;
  const alumno = document.getElementById('salud-alumno').value;
  const fechaIngreso = document.getElementById('salud-fecha-ingreso').value;
  const fechaInicio = document.getElementById('salud-inicio').value;
  const fechaTermino = document.getElementById('salud-termino').value;

  // Validar fechas lógicas
  if (fechaTermino < fechaInicio) {
    alert('La fecha de término no puede ser anterior a la fecha de inicio.');
    return;
  }

  // Determinar si la licencia está Activa o Pasada según la fecha de hoy (2026-10-11)
  const hoyStr = new Date().toISOString().split('T')[0];
  let estado = 'activa';
  let badgeClass = 'badge-success';
  let badgeText = 'Activa';

  if (fechaTermino < hoyStr) {
    estado = 'pasada';
    badgeClass = 'badge-secondary';
    badgeText = 'Pasada';
  }

  const tbody = document.getElementById('tbody-licencias');
  const tr = document.createElement('tr');
  tr.setAttribute('data-estado', estado);
  tr.innerHTML = `
    <td>${curso}</td>
    <td>${alumno}</td>
    <td>${fechaIngreso}</td>
    <td>${fechaInicio}</td>
    <td>${fechaTermino}</td>
    <td><span class="badge ${badgeClass}">${badgeText}</span></td>
  `;
  tbody.appendChild(tr);

  alert('Licencia médica registrada con éxito');
  document.getElementById('form-licencia').reset();
  setFechaIngresoHoy();
  filtrarLicencias();
}

// Filtrar la tabla según el selector de Activas / Pasadas
function filtrarLicencias() {
  const filtro = document.getElementById('filtro-estado').value;
  const filas = document.querySelectorAll('#tbody-licencias tr');

  filas.forEach(fila => {
    const estadoFila = fila.getAttribute('data-estado');
    if (filtro === 'todas' || estadoFila === filtro) {
      fila.style.display = '';
    } else {
      fila.style.display = 'none';
    }
  });
}