let todosLosAlumnos = []; 

// Un solo DOMContentLoaded para iniciar todo
document.addEventListener('DOMContentLoaded', () => {
  setFechasHoy();
  setHoraActualAtraso();
  cargarCursos();
  cargarAlumnos();
  cargarAtrasos(); // <-- NUEVO: Cargar la tabla al inicio
});

// ==========================================
// CARGA INICIAL DE DATOS DESDE LA API
// ==========================================

async function cargarCursos() {
  try {
    const res = await fetch('http://localhost:3000/api/cursos');
    const cursos = await res.json();
    const selectCursos = document.querySelectorAll('#atraso-curso, #retiro-curso');
    
    selectCursos.forEach(select => {
      select.innerHTML = '<option value="">Seleccione un curso...</option>';
      cursos.forEach(c => {
        select.innerHTML += `<option value="${c.id_curso}">${c.numero}° Medio ${c.letra}</option>`;
      });
    });
  } catch (error) {
    console.error('Error cargando cursos', error);
  }
}

async function cargarAlumnos() {
  try {
    const res = await fetch('http://localhost:3000/api/alumnos');
    todosLosAlumnos = await res.json();
  } catch (error) {
    console.error('Error cargando alumnos', error);
  }
}

// NUEVO: Obtener el historial de atrasos y dibujarlo en la tabla
async function cargarAtrasos() {
  try {
    const res = await fetch('http://localhost:3000/api/atrasos');
    const atrasos = await res.json();
    const tbody = document.getElementById('tabla-atrasos');
    
    tbody.innerHTML = ''; // Limpiar la tabla antes de llenarla

    atrasos.forEach(a => {
      const tr = document.createElement('tr');
      
      // La API nos devuelve la hora como "08:05:00". Tomamos los primeros 5 caracteres.
      const horaLimpia = a.hora_llegada.substring(0, 5);
      
      let claseAtraso = '';
      if (horaLimpia > '09:00') claseAtraso = 'atraso-grave';
      else if (horaLimpia > '08:15') claseAtraso = 'atraso-leve';

      if (claseAtraso) tr.classList.add(claseAtraso);

      // Formatear la fecha (la BD envía un string largo)
      const fechaLimpia = a.fecha.split('T')[0];

      tr.innerHTML = `
        <td>${fechaLimpia}</td>
        <td>${horaLimpia} hrs</td>
        <td>${a.numero}° Medio ${a.letra}</td>
        <td>${a.nombre_completo}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error('Error cargando atrasos', error);
  }
}

// ==========================================
// LÓGICA DE LA INTERFAZ
// ==========================================

function filtrarAlumnos(idCurso, idSelectAlumno) {
  const selectAlumno = document.getElementById(idSelectAlumno);
  selectAlumno.innerHTML = '<option value="">Seleccione un alumno...</option>';
  
  if (!idCurso) return;

  const filtrados = todosLosAlumnos.filter(a => a.curso_actual == idCurso);
  filtrados.forEach(a => {
    selectAlumno.innerHTML += `<option value="${a.id_alumno}">${a.nombre_completo}</option>`;
  });
}

document.getElementById('atraso-curso').addEventListener('change', (e) => {
  filtrarAlumnos(e.target.value, 'atraso-alumno');
});
document.getElementById('retiro-curso').addEventListener('change', (e) => {
  filtrarAlumnos(e.target.value, 'retiro-alumno');
});

function setFechasHoy() {
  const hoy = new Date().toISOString().split('T')[0];
  const fechaAtraso = document.getElementById('atraso-fecha');
  const fechaRetiro = document.getElementById('retiro-fecha');

  if (fechaAtraso) fechaAtraso.value = hoy;
  if (fechaRetiro) fechaRetiro.value = hoy;
}

function setHoraActualAtraso() {
  const horaInput = document.getElementById('atraso-hora');
  if (horaInput) {
    const ahora = new Date();
    const hh = String(ahora.getHours()).padStart(2, '0');
    const mm = String(ahora.getMinutes()).padStart(2, '0');
    horaInput.value = `${hh}:${mm}`;
  }
}

function switchTab(tabId) {
  const tabs = document.querySelectorAll('.tab-content');
  const buttons = document.querySelectorAll('.tab-btn');

  tabs.forEach(tab => tab.classList.remove('active'));
  buttons.forEach(btn => btn.classList.remove('active'));

  document.getElementById(`tab-${tabId}`).classList.add('active');
  event.currentTarget.classList.add('active');
}

// ==========================================
// ENVÍO DE FORMULARIOS
// ==========================================

async function handleAtrasoSubmit(e) {
  e.preventDefault();

  const fecha = document.getElementById('atraso-fecha').value;
  const hora = document.getElementById('atraso-hora').value;
  const idAlumno = document.getElementById('atraso-alumno').value; 
  
  let idTipoAtraso = 1; 
  if (hora > '09:00') idTipoAtraso = 3;
  else if (hora > '08:15') idTipoAtraso = 2;

  const datosParaBackend = {
    fecha: fecha,
    id_alumno: idAlumno, 
    id_atraso: idTipoAtraso, 
    hora_llegada: hora
  };

  try {
    const respuesta = await fetch('http://localhost:3000/api/atrasos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datosParaBackend)
    });

    if (respuesta.ok) {
      alert('Atraso guardado en la base de datos exitosamente');
      
      // En lugar de dibujar la fila a mano, recargamos la tabla desde la BD
      await cargarAtrasos();

      document.getElementById('form-atraso').reset();
      setFechasHoy();
      setHoraActualAtraso();
      
      document.getElementById('atraso-alumno').innerHTML = '<option value="">Seleccione un curso primero...</option>';
    } else {
      alert('Error al guardar el atraso.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

function handleRetiroSubmit(e) {
  e.preventDefault();
  // Esta función todavía es visual. Luego la conectaremos a la API.
  const curso = document.getElementById('retiro-curso').options[document.getElementById('retiro-curso').selectedIndex].text;
  const alumno = document.getElementById('retiro-alumno').options[document.getElementById('retiro-alumno').selectedIndex].text;
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

  alert('Retiro registrado visualmente (Falta conectar BD)');
  document.getElementById('form-retiro').reset();
  setFechasHoy();
  document.getElementById('retiro-alumno').innerHTML = '<option value="">Seleccione un curso primero...</option>';
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