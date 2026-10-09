document.addEventListener('DOMContentLoaded', () => {
  setFechasHoy();
  setHoraActualAtraso();
});

// Asignar fecha actual a todos los inputs de fecha automáticamente
function setFechasHoy() {
  const hoy = new Date().toISOString().split('T')[0];
  const fechaAtraso = document.getElementById('atraso-fecha');
  const fechaRetiro = document.getElementById('retiro-fecha');

  if (fechaAtraso) fechaAtraso.value = hoy;
  if (fechaRetiro) fechaRetiro.value = hoy;
}

// Asignar hora actual por defecto en la pestaña de Atrasos
function setHoraActualAtraso() {
  const horaInput = document.getElementById('atraso-hora');
  if (horaInput) {
    const ahora = new Date();
    const hh = String(ahora.getHours()).padStart(2, '0');
    const mm = String(ahora.getMinutes()).padStart(2, '0');
    horaInput.value = `${hh}:${mm}`;
  }
}

// Cambiar de pestaña
function switchTab(tabId) {
  const tabs = document.querySelectorAll('.tab-content');
  const buttons = document.querySelectorAll('.tab-btn');

  tabs.forEach(tab => tab.classList.remove('active'));
  buttons.forEach(btn => btn.classList.remove('active'));

  document.getElementById(`tab-${tabId}`).classList.add('active');
  event.currentTarget.classList.add('active');
}

// Registrar Atraso con destacado por color según hora
function handleAtrasoSubmit(e) {
  e.preventDefault();

  const curso = document.getElementById('atraso-curso').value;
  const alumno = document.getElementById('atraso-alumno').value;
  const fecha = document.getElementById('atraso-fecha').value;
  const hora = document.getElementById('atraso-hora').value; // e.g. "08:02"

  // Determinar color de alerta según la gravedad del atraso
  let claseAtraso = '';
  if (hora > '09:00') {
    claseAtraso = 'atraso-grave'; // Rojo suave (> 09:00)
  } else if (hora > '08:10') {
    claseAtraso = 'atraso-leve';  // Amarillo suave (> 08:10)
  }
  // Si llegó entre 08:01 y 08:10, se registra como atraso normal sin color destacado.

  const tbody = document.getElementById('tabla-atrasos');
  const tr = document.createElement('tr');
  if (claseAtraso) {
    tr.classList.add(claseAtraso);
  }

  tr.innerHTML = `
    <td>${fecha}</td>
    <td>${hora} hrs</td>
    <td>${curso}</td>
    <td>${alumno}</td>
  `;
  tbody.appendChild(tr);

  alert('Atraso registrado exitosamente');
  document.getElementById('form-atraso').reset();
  setFechasHoy();
  setHoraActualAtraso();
}

// Registrar Retiro
function handleRetiroSubmit(e) {
  e.preventDefault();

  const curso = document.getElementById('retiro-curso').value;
  const alumno = document.getElementById('retiro-alumno').value;
  const fecha = document.getElementById('retiro-fecha').value;
  const motivo = document.getElementById('retiro-motivo').value;

  const tbody = document.getElementById('tabla-retiros');
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${fecha}</td>
    <td>${curso}</td>
    <td>${alumno}</td>
    <td>${motivo}</td>
  `;
  tbody.appendChild(tr);

  alert('Retiro registrado exitosamente');
  document.getElementById('form-retiro').reset();
  setFechasHoy();
}

// Agregar Dinámicamente Pregunta y Respuesta
function agregarPregunta() {
  const contenedor = document.getElementById('contenedor-preguntas');
  const nuevoPar = document.createElement('div');
  nuevoPar.className = 'qa-pair';
  nuevoPar.innerHTML = `
    <div class="qa-header">
      <span class="qa-num">Nueva Pregunta</span>
      <button type="button" class="btn-delete-qa" onclick="eliminarPregunta(this)">✕ Eliminar</button>
    </div>
    <input type="text" class="qa-pregunta" placeholder="Escriba la pregunta del apoderado..." required />
    <textarea class="qa-respuesta" rows="2" placeholder="Escriba la respuesta dada..."></textarea>
  `;
  contenedor.appendChild(nuevoPar);
}

// Eliminar un par de Pregunta/Respuesta
function eliminarPregunta(btn) {
  const qaPair = btn.closest('.qa-pair');
  qaPair.remove();
}

// Buscador en tiempo real para Preuniversitario
function filtrarPreu() {
  const filtro = document.getElementById('buscar-preu').value.toLowerCase();
  const filas = document.querySelectorAll('#tabla-preu tbody tr');

  filas.forEach(fila => {
    const textoFila = fila.textContent.toLowerCase();
    if (textoFila.includes(filtro)) {
      fila.style.display = '';
    } else {
      fila.style.display = 'none';
    }
  });
}

// Guardar Acta de Reunión
function handleReunionSubmit(e) {
  e.preventDefault();
  alert('Acta de reunión guardada correctamente.');
  document.getElementById('form-reunion').reset();
  
  const contenedor = document.getElementById('contenedor-preguntas');
  contenedor.innerHTML = `
    <div class="qa-pair">
      <input type="text" class="qa-pregunta" placeholder="Escriba la pregunta del apoderado..." required />
      <textarea class="qa-respuesta" rows="2" placeholder="Escriba la respuesta dada..."></textarea>
    </div>
  `;
}