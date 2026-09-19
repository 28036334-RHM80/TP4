/**
 * ==============================================================================
 * TP N° 4: GESTIÓN DE RECURSOS E INTERBLOQUEOS (DEADLOCKS)
 * Cátedra: Teoría de Sistemas Operativos (TSO) — UNJu Facultad de Ingeniería
 * Ciclo Lectivo 2026 | Responsable: Ing. María Fernanda Vázquez | JTP: Ing. Fabio D. Argañaraz
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. ESTADO GLOBAL DE LA APLICACIÓN
  // ==========================================
  const state = {
    student: {
      name: '',
      dni: '',
      career: 'Ingeniería Informática',
      github_user: ''
    },
    answers: {
      ej1_banquero_necesidad_y_ejecucion: {},
      ej2_condiciones_riesgo_coffman: {},
      ej3_solicitud_dinamica_p1: {},
      ej4_reduccion_grafos_tabla: {},
      ej5_modelado_rag_matrices: {},
      ej6_evaluacion_solicitudes_rag: {},
      ej7_deteccion_bloqueos_multi_instancia: {},
      ej8_recuperacion_seleccion_victima: {},
      ej9_solicitud_p2_actualizacion: {},
      ej10_estrategias_combinadas_jerarquia: {}
    }
  };

  const EXERCISE_KEYS = [
    'ej1_banquero_necesidad_y_ejecucion',
    'ej2_condiciones_riesgo_coffman',
    'ej3_solicitud_dinamica_p1',
    'ej4_reduccion_grafos_tabla',
    'ej5_modelado_rag_matrices',
    'ej6_evaluacion_solicitudes_rag',
    'ej7_deteccion_bloqueos_multi_instancia',
    'ej8_recuperacion_seleccion_victima',
    'ej9_solicitud_p2_actualizacion',
    'ej10_estrategias_combinadas_jerarquia'
  ];

  const EXERCISE_REQUIREMENTS = {
    ej1_banquero_necesidad_y_ejecucion: [
      'need_p0_a', 'need_p0_b', 'need_p0_c', 'need_p0_d',
      'need_p1_a', 'need_p1_b', 'need_p1_c', 'need_p1_d',
      'need_p2_a', 'need_p2_b', 'need_p2_c', 'need_p2_d',
      'need_p3_a', 'need_p3_b', 'need_p3_c', 'need_p3_d',
      'need_p4_a', 'need_p4_b', 'need_p4_c', 'need_p4_d',
      'iter1_proc', 'iter2_proc', 'iter3_proc', 'iter4_proc', 'iter5_proc',
      'secuencia_segura', 'estado_sistema'
    ],
    ej2_condiciones_riesgo_coffman: [
      'cond_exclusion_mutua', 'just_exclusion_mutua',
      'cond_retener_esperar', 'just_retener_esperar',
      'cond_no_expropiacion', 'just_no_expropiacion',
      'cond_espera_circular', 'just_espera_circular',
      'recurso_mayor_restriccion'
    ],
    ej3_solicitud_dinamica_p1: [
      'sol_menor_necesidad', 'sol_menor_disponible', 'disp_sim_a', 'disp_sim_b', 'disp_sim_c', 'disp_sim_d',
      'puede_concederse', 'mantiene_seguro'
    ],
    ej4_reduccion_grafos_tabla: [
      'red_proc_1', 'red_lib_1_a', 'red_lib_1_b', 'red_lib_1_c',
      'red_disp_1_a', 'red_disp_1_b', 'red_disp_1_c',
      'red_proc_2', 'red_disp_2_a', 'red_disp_2_b', 'red_disp_2_c',
      'grafo_reducido_total', 'existe_interbloqueo'
    ],
    ej5_modelado_rag_matrices: [
      'disp_rag_a', 'disp_rag_b', 'disp_rag_c',
      'alloc_p0_a', 'alloc_p0_b', 'alloc_p0_c',
      'alloc_p1_a', 'alloc_p1_b', 'alloc_p1_c',
      'alloc_p2_a', 'alloc_p2_b', 'alloc_p2_c',
      'alloc_p3_a', 'alloc_p3_b', 'alloc_p3_c',
      'alloc_p4_a', 'alloc_p4_b', 'alloc_p4_c',
      'need_p0_a', 'need_p0_b', 'need_p0_c',
      'need_p1_a', 'need_p1_b', 'need_p1_c',
      'need_p2_a', 'need_p2_b', 'need_p2_c',
      'need_p3_a', 'need_p3_b', 'need_p3_c',
      'need_p4_a', 'need_p4_b', 'need_p4_c'
    ],
    ej6_evaluacion_solicitudes_rag: [
      'estado_inicial_seguro', 'atender_p0', 'atender_p1'
    ],
    ej7_deteccion_bloqueos_multi_instancia: [
      'finalizo_alguno_inicial', 'existe_bloqueo', 'cantidad_procesos_bloqueados', 'procesos_bloqueados_lista'
    ],
    ej8_recuperacion_seleccion_victima: [
      'proceso_victima', 'disp_recup_a', 'disp_recup_b', 'disp_recup_c', 'disp_recup_d',
      'primer_proceso_desbloqueado', 'recupera_completo'
    ],
    ej9_solicitud_p2_actualizacion: [
      'sol_p2_menor_necesidad', 'sol_p2_menor_disponible',
      'disp_p2_a', 'disp_p2_b', 'disp_p2_c', 'disp_p2_d', 'surge_interbloqueo'
    ],
    ej10_estrategias_combinadas_jerarquia: [
      'clase_swap', 'clase_procesos', 'clase_memoria', 'mecanismo_interclase'
    ]
  };

  let hasTriggeredConfetti = false;

  // ==========================================
  // 2. TEMA DARK / LIGHT
  // ==========================================
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const savedTheme = localStorage.getItem('TSO_TP4_THEME') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('TSO_TP4_THEME', nextTheme);
    });
  }

  // ==========================================
  // 3. CAMPOS DEL ESTUDIANTE
  // ==========================================
  const inputName = document.getElementById('student-name');
  const inputDni = document.getElementById('student-dni');
  const inputCareer = document.getElementById('student-career');
  const inputGithub = document.getElementById('student-github');

  function bindStudentInput(elem, key) {
    if (!elem) return;
    elem.addEventListener('input', (e) => {
      state.student[key] = e.target.value;
      saveLocalState();
      updateProgress();
    });
  }

  bindStudentInput(inputName, 'name');
  bindStudentInput(inputDni, 'dni');
  bindStudentInput(inputCareer, 'career');
  bindStudentInput(inputGithub, 'github_user');

  // ==========================================
  // 4. BINDING DE CELDAS MATRICIALES (NUMÉRICAS)
  // ==========================================
  const matrixInputs = document.querySelectorAll('.matrix-input');
  matrixInputs.forEach(input => {
    input.addEventListener('input', (e) => {
      const exId = e.target.getAttribute('data-ex');
      const itemKey = e.target.getAttribute('data-item');
      const val = e.target.value.trim();

      if (!state.answers[exId]) state.answers[exId] = {};
      if (val !== '') {
        state.answers[exId][itemKey] = val;
        e.target.classList.add('filled');
      } else {
        delete state.answers[exId][itemKey];
        e.target.classList.remove('filled');
      }

      saveLocalState();
      updateProgress();
    });

    // Permitir navegación con teclas Enter / Flechas entre celdas
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const next = input.closest('tr')?.nextElementSibling?.querySelector('.matrix-input') ||
                     input.nextElementSibling ||
                     Array.from(matrixInputs)[Array.from(matrixInputs).indexOf(input) + 1];
        if (next) next.focus();
      }
    });
  });

  // ==========================================
  // 5. BINDING DE SWITCHES SEGMENTADOS (SÍ / NO)
  // ==========================================
  const switchGroups = document.querySelectorAll('.switch-group');
  switchGroups.forEach(group => {
    const exId = group.getAttribute('data-ex');
    const itemKey = group.getAttribute('data-item');
    const buttons = group.querySelectorAll('.switch-btn');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const val = btn.getAttribute('data-val');
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (!state.answers[exId]) state.answers[exId] = {};
        state.answers[exId][itemKey] = val;

        saveLocalState();
        updateProgress();
      });
    });
  });

  // ==========================================
  // 6. BINDING DE SELECTS NORMALIZADOS
  // ==========================================
  const selectElements = document.querySelectorAll('select[data-ex]');
  selectElements.forEach(select => {
    select.addEventListener('change', (e) => {
      const exId = e.target.getAttribute('data-ex');
      const itemKey = e.target.getAttribute('data-item');
      const val = e.target.value;

      if (!state.answers[exId]) state.answers[exId] = {};
      if (val) {
        state.answers[exId][itemKey] = val;
      } else {
        delete state.answers[exId][itemKey];
      }

      saveLocalState();
      updateProgress();
    });
  });

  // ==========================================
  // 7. BINDING DE TIRA DE SECUENCIA ORDENABLE
  // ==========================================
  const seqStripEj1 = document.getElementById('seq-strip-ej1');
  if (seqStripEj1 && window.Sortable) {
    new Sortable(seqStripEj1, {
      animation: 150,
      ghostClass: 'sortable-ghost',
      onEnd: () => {
        updateSequenceOrder();
        saveLocalState();
        updateProgress();
      }
    });
  }

  function updateSequenceOrder() {
    if (!seqStripEj1) return;
    const exId = seqStripEj1.getAttribute('data-ex');
    const itemKey = seqStripEj1.getAttribute('data-item');
    const pills = seqStripEj1.querySelectorAll('.seq-pill');
    const order = Array.from(pills).map(p => p.getAttribute('data-id').toLowerCase()).join('-');

    if (!state.answers[exId]) state.answers[exId] = {};
    state.answers[exId][itemKey] = order;
  }

  // ==========================================
  // 8. CÁLCULO ESTRICTO DE PROGRESO ACADÉMICO
  // ==========================================
  const progressBar = document.getElementById('progress-bar');
  const progressPercentage = document.getElementById('progress-percentage');
  const btnExportJson = document.getElementById('btn-export-json');

  function updateProgress() {
    let completedCount = 0;

    EXERCISE_KEYS.forEach(exId => {
      const card = document.getElementById(`card-${exId}`);
      const badge = card ? card.querySelector('.ex-badge') : null;
      const requiredItems = EXERCISE_REQUIREMENTS[exId] || [];
      const currentAns = state.answers[exId] || {};

      const isCompleted = requiredItems.every(req => {
        const val = currentAns[req];
        return val !== undefined && val !== null && String(val).trim() !== '';
      });

      if (isCompleted) {
        completedCount++;
        if (badge) {
          badge.textContent = '✓ Completado';
          badge.className = 'ex-badge completed';
        }
      } else {
        if (badge) {
          badge.textContent = 'Pendiente';
          badge.className = 'ex-badge pending';
        }
      }
    });

    const totalExercises = EXERCISE_KEYS.length;
    const percentage = Math.round((completedCount / totalExercises) * 100);

    if (progressBar) progressBar.style.width = `${percentage}%`;
    if (progressPercentage) progressPercentage.textContent = `${percentage}% (${completedCount}/${totalExercises} completados)`;

    const studentOk = Boolean(state.student.name && state.student.name.trim()) &&
                      Boolean(state.student.dni && state.student.dni.trim());
    const isReady = (completedCount === totalExercises) && studentOk;

    if (btnExportJson) {
      btnExportJson.disabled = !isReady;
      if (!isReady) {
        if (completedCount === totalExercises && !studentOk) {
          btnExportJson.title = 'Completa tu Nombre y DNI en la cabecera para habilitar la descarga';
        } else {
          btnExportJson.title = 'Completa las matrices y tablas de los 10 ejercicios para exportar';
        }
      } else {
        btnExportJson.title = 'Descargar respuestas_tp4.json';
      }
    }

    if (percentage === 100 && !hasTriggeredConfetti) {
      hasTriggeredConfetti = true;
      if (window.confetti) {
        window.confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }
    }
  }

  // ==========================================
  // 9. PERSISTENCIA EN LOCALSTORAGE
  // ==========================================
  function saveLocalState() {
    try {
      localStorage.setItem('TSO_TP4_STATE_V2', JSON.stringify(state));
    } catch (e) {
      console.warn('Error al guardar estado en localStorage:', e);
    }
  }

  function loadLocalState() {
    try {
      const raw = localStorage.getItem('TSO_TP4_STATE_V2');
      if (!raw) return;
      const parsed = JSON.parse(raw);

      if (parsed.student) {
        state.student = { ...state.student, ...parsed.student };
        if (inputName) inputName.value = state.student.name || '';
        if (inputDni) inputDni.value = state.student.dni || '';
        if (inputCareer) inputCareer.value = state.student.career || '';
        if (inputGithub) inputGithub.value = state.student.github_user || '';
      }

      if (parsed.answers) {
        state.answers = { ...state.answers, ...parsed.answers };

        // Restaurar celdas matriciales
        matrixInputs.forEach(input => {
          const exId = input.getAttribute('data-ex');
          const itemKey = input.getAttribute('data-item');
          if (state.answers[exId] && state.answers[exId][itemKey] !== undefined) {
            input.value = state.answers[exId][itemKey];
            input.classList.add('filled');
          }
        });

        // Restaurar switches
        switchGroups.forEach(group => {
          const exId = group.getAttribute('data-ex');
          const itemKey = group.getAttribute('data-item');
          if (state.answers[exId] && state.answers[exId][itemKey] !== undefined) {
            const savedVal = state.answers[exId][itemKey];
            const btn = group.querySelector(`.switch-btn[data-val="${savedVal}"]`);
            if (btn) {
              group.querySelectorAll('.switch-btn').forEach(b => b.classList.remove('active'));
              btn.classList.add('active');
            }
          }
        });

        // Restaurar selects
        selectElements.forEach(select => {
          const exId = select.getAttribute('data-ex');
          const itemKey = select.getAttribute('data-item');
          if (state.answers[exId] && state.answers[exId][itemKey] !== undefined) {
            select.value = state.answers[exId][itemKey];
          }
        });

        // Restaurar orden de pills
        if (seqStripEj1 && state.answers['ej1_banquero_necesidad_y_ejecucion']?.secuencia_segura) {
          const order = state.answers['ej1_banquero_necesidad_y_ejecucion'].secuencia_segura.split('-');
          order.forEach(id => {
            const pill = seqStripEj1.querySelector(`.seq-pill[data-id="${id}"]`);
            if (pill) seqStripEj1.appendChild(pill);
          });
        }
      }
    } catch (e) {
      console.warn('Error al cargar estado de localStorage:', e);
    }
  }

  // ==========================================
  // 10. EXPORTACIÓN E IMPORTACIÓN JSON
  // ==========================================
  if (btnExportJson) {
    btnExportJson.addEventListener('click', () => {
      // Asegurar que la secuencia de pills esté guardada
      updateSequenceOrder();

      const submissionData = {
        student: {
          name: state.student.name.trim(),
          dni: state.student.dni.trim(),
          career: state.student.career.trim(),
          github_user: state.student.github_user.trim()
        },
        tp_metadata: {
          tp_id: 'TSO-2026-TP4',
          title: 'TP N° 4: Gestión de Recursos e Interbloqueos (Deadlocks)',
          catedra: 'Teoría de Sistemas Operativos - UNJu Facultad de Ingeniería',
          ciclo_lectivo: '2026',
          submitted_at: new Date().toISOString()
        },
        answers: state.answers
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(submissionData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', 'respuestas_tp4.json');
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    });
  }

  const btnImportJson = document.getElementById('btn-import-json');
  const fileImportInput = document.getElementById('file-import-input');

  if (btnImportJson && fileImportInput) {
    btnImportJson.addEventListener('click', () => fileImportInput.click());
    fileImportInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target.result);
          if (imported.student) {
            state.student = { ...state.student, ...imported.student };
            if (inputName) inputName.value = state.student.name || '';
            if (inputDni) inputDni.value = state.student.dni || '';
            if (inputCareer) inputCareer.value = state.student.career || '';
            if (inputGithub) inputGithub.value = state.student.github_user || '';
          }
          if (imported.answers) {
            state.answers = imported.answers;
            // Restaurar celdas matriciales
            matrixInputs.forEach(input => {
              const exId = input.getAttribute('data-ex');
              const itemKey = input.getAttribute('data-item');
              if (state.answers[exId] && state.answers[exId][itemKey] !== undefined) {
                input.value = state.answers[exId][itemKey];
                input.classList.add('filled');
              } else {
                input.value = '';
                input.classList.remove('filled');
              }
            });

            // Restaurar switches
            switchGroups.forEach(group => {
              const exId = group.getAttribute('data-ex');
              const itemKey = group.getAttribute('data-item');
              group.querySelectorAll('.switch-btn').forEach(b => b.classList.remove('active'));
              if (state.answers[exId] && state.answers[exId][itemKey] !== undefined) {
                const savedVal = state.answers[exId][itemKey];
                const btn = group.querySelector(`.switch-btn[data-val="${savedVal}"]`);
                if (btn) btn.classList.add('active');
              }
            });

            // Restaurar selects
            selectElements.forEach(select => {
              const exId = select.getAttribute('data-ex');
              const itemKey = select.getAttribute('data-item');
              if (state.answers[exId] && state.answers[exId][itemKey] !== undefined) {
                select.value = state.answers[exId][itemKey];
              } else {
                select.value = '';
              }
            });

            // Restaurar pills
            if (seqStripEj1 && state.answers['ej1_banquero_necesidad_y_ejecucion']?.secuencia_segura) {
              const order = state.answers['ej1_banquero_necesidad_y_ejecucion'].secuencia_segura.split('-');
              order.forEach(id => {
                const pill = seqStripEj1.querySelector(`.seq-pill[data-id="${id}"]`);
                if (pill) seqStripEj1.appendChild(pill);
              });
            }
          }

          saveLocalState();
          updateProgress();
          alert('¡Respuestas importadas exitosamente!');
        } catch (err) {
          alert('Error al procesar el archivo JSON: ' + err.message);
        }
      };
      reader.readAsText(file);
    });
  }

  // ==========================================
  // 11. MODALES INFORMATIVOS
  // ==========================================
  const modalBiblio = document.getElementById('modal-biblio');
  const btnOpenBiblioAll = document.getElementById('btn-open-biblio-all');
  const modalBiblioClose = document.getElementById('modal-biblio-close');

  if (btnOpenBiblioAll && modalBiblio) btnOpenBiblioAll.addEventListener('click', () => modalBiblio.classList.add('active'));
  if (modalBiblioClose && modalBiblio) modalBiblioClose.addEventListener('click', () => modalBiblio.classList.remove('active'));

  const modalGit = document.getElementById('modal-git');
  const btnGitGuide = document.getElementById('btn-git-guide');
  const modalGitClose = document.getElementById('modal-git-close');

  if (btnGitGuide && modalGit) btnGitGuide.addEventListener('click', () => modalGit.classList.add('active'));
  if (modalGitClose && modalGit) modalGitClose.addEventListener('click', () => modalGit.classList.remove('active'));

  window.addEventListener('click', (e) => {
    if (e.target === modalBiblio) modalBiblio.classList.remove('active');
    if (e.target === modalGit) modalGit.classList.remove('active');
  });

  // ==========================================
  // 12. SIMULADORES (RAG STUDIO & BANQUERO)
  // ==========================================
  const ragSvg = document.getElementById('rag-svg-canvas');
  const ragStatusTitle = document.getElementById('rag-status-title');
  const ragStatusDesc = document.getElementById('rag-status-desc');
  const ragStatusCard = document.getElementById('rag-status-card');

  let currentRag = { nodes: [], edges: [] };

  function loadRagPreset(preset) {
    if (preset === 'silber') {
      currentRag = {
        nodes: [
          { id: 'P0', type: 'proc', label: 'P0', x: 230, y: 190 },
          { id: 'P1', type: 'proc', label: 'P1', x: 280, y: 310 },
          { id: 'P2', type: 'proc', label: 'P2', x: 420, y: 340 },
          { id: 'P3', type: 'proc', label: 'P3', x: 380, y: 65 },
          { id: 'P4', type: 'proc', label: 'P4', x: 500, y: 190 },
          { id: 'RA', type: 'res', label: 'A (10)', instances: 10, x: 100, y: 190 },
          { id: 'RB', type: 'res', label: 'B (5)', instances: 5, x: 350, y: 190 },
          { id: 'RC', type: 'res', label: 'C (7)', instances: 7, x: 600, y: 190 }
        ],
        edges: [
          { from: 'RA', to: 'P1', type: 'alloc', label: '2 inst' },
          { from: 'RA', to: 'P2', type: 'alloc', label: '3 inst' },
          { from: 'RA', to: 'P3', type: 'alloc', label: '2 inst' },
          { from: 'RB', to: 'P0', type: 'alloc', label: '1 inst' },
          { from: 'RB', to: 'P3', type: 'alloc', label: '1 inst' },
          { from: 'RC', to: 'P2', type: 'alloc', label: '2 inst' },
          { from: 'RC', to: 'P3', type: 'alloc', label: '1 inst' },
          { from: 'RC', to: 'P4', type: 'alloc', label: '2 inst' }
        ]
      };
      setRagStatus('safe', 'Instantánea Inicial: Estado Seguro (Acíclico)', 'Asignaciones del Ejercicio 5. Disponibles: A=3, B=3, C=2. Sin ciclos bloqueantes.');
    } else if (preset === 'deadlock') {
      currentRag = {
        nodes: [
          { id: 'P1', type: 'proc', label: 'P1', x: 240, y: 200 },
          { id: 'P2', type: 'proc', label: 'P2', x: 460, y: 200 },
          { id: 'R1', type: 'res', label: 'R1 (1)', instances: 1, x: 350, y: 100 },
          { id: 'R2', type: 'res', label: 'R2 (1)', instances: 1, x: 350, y: 300 }
        ],
        edges: [
          { from: 'R1', to: 'P1', type: 'alloc' },
          { from: 'P1', to: 'R2', type: 'req' },
          { from: 'R2', to: 'P2', type: 'alloc' },
          { from: 'P2', to: 'R1', type: 'req' }
        ]
      };
      setRagStatus('deadlock', 'Ciclo Detectado: Deadlock', 'Ciclo cerrado P1 -> R2 -> P2 -> R1 -> P1 en recursos de instancia única.');
    } else if (preset === 'ej2') {
      currentRagPresetName = 'ej2';
      currentEj2ReductionStep = 0;
      currentRag = {
        nodes: [
          { id: 'P0', type: 'proc', label: 'P0', x: 120, y: 80 },
          { id: 'P1', type: 'proc', label: 'P1', x: 320, y: 70 },
          { id: 'P2', type: 'proc', label: 'P2', x: 530, y: 70 },
          { id: 'P3', type: 'proc', label: 'P3', x: 230, y: 330 },
          { id: 'P4', type: 'proc', label: 'P4', x: 470, y: 330 },
          { id: 'RA', type: 'res', label: 'A (6)', instances: 6, x: 170, y: 200 },
          { id: 'RB', type: 'res', label: 'B (5)', instances: 5, x: 350, y: 200 },
          { id: 'RC', type: 'res', label: 'C (6)', instances: 6, x: 530, y: 200 }
        ],
        edges: [
          // Asignaciones (Verdes): Alloc P0=(1,0,0), P1=(2,0,1), P2=(1,0,1), P3=(0,3,2), P4=(1,2,1)
          { from: 'RA', to: 'P0', type: 'alloc', label: '1 inst' },
          { from: 'RA', to: 'P1', type: 'alloc', label: '2 inst' },
          { from: 'RA', to: 'P2', type: 'alloc', label: '1 inst' },
          { from: 'RA', to: 'P4', type: 'alloc', label: '1 inst' },
          { from: 'RB', to: 'P3', type: 'alloc', label: '3 inst' },
          { from: 'RB', to: 'P4', type: 'alloc', label: '2 inst' },
          { from: 'RC', to: 'P1', type: 'alloc', label: '1 inst' },
          { from: 'RC', to: 'P2', type: 'alloc', label: '1 inst' },
          { from: 'RC', to: 'P3', type: 'alloc', label: '2 inst' },
          { from: 'RC', to: 'P4', type: 'alloc', label: '1 inst' },
          // Solicitudes Pendientes (Naranjas): Need P0=(2,2,1), P1=(1,1,2), P2=(1,1,1), P3=(1,0,0), P4=(1,0,2)
          { from: 'P3', to: 'RA', type: 'req', label: '1 inst' },
          { from: 'P2', to: 'RB', type: 'req', label: '1 inst' },
          { from: 'P1', to: 'RB', type: 'req', label: '1 inst' },
          { from: 'P4', to: 'RA', type: 'req', label: '1 inst' },
          { from: 'P0', to: 'RB', type: 'req', label: '2 inst' }
        ]
      };
      setRagStatus('safe', 'Escenario Ejercicio 2 (Reducción)', 'Disponible: A=1, B=0, C=1. P3 es el único que puede arrancar con Need=(1,0,0). Pulsa "Reducir Grafo".');
    }
    renderRagSvg();
  }

  let currentRagPresetName = 'silber';
  let currentEj2ReductionStep = 0;

  const ej2ReductionOrder = [
    {
      proc: 'P3',
      released: 'B=3, C=2',
      newAvail: 'A=1, B=3, C=3',
      title: 'Paso 1: P3 Finalizado',
      desc: 'P3 satisface su necesidad de A=1 con el Disponible inicial (1,0,1). Concluye y libera Alloc=(0,3,2). Nuevo Disponible: (1, 3, 3).'
    },
    {
      proc: 'P2',
      released: 'A=1, C=1',
      newAvail: 'A=2, B=3, C=4',
      title: 'Paso 2: P2 Finalizado',
      desc: 'Con Disponible=(1,3,3), P2 satisface Need=(1,1,1). Concluye y libera Alloc=(1,0,1). Nuevo Disponible: (2, 3, 4).'
    },
    {
      proc: 'P1',
      released: 'A=2, C=1',
      newAvail: 'A=4, B=3, C=5',
      title: 'Paso 3: P1 Finalizado',
      desc: 'Con Disponible=(2,3,4), P1 satisface Need=(1,1,2). Concluye y libera Alloc=(2,0,1). Nuevo Disponible: (4, 3, 5).'
    },
    {
      proc: 'P4',
      released: 'A=1, B=2, C=1',
      newAvail: 'A=5, B=5, C=6',
      title: 'Paso 4: P4 Finalizado',
      desc: 'Con Disponible=(4,3,5), P4 satisface Need=(1,0,2). Concluye y libera Alloc=(1,2,1). Nuevo Disponible: (5, 5, 6).'
    },
    {
      proc: 'P0',
      released: 'A=1',
      newAvail: 'A=6, B=5, C=6 (Todos libres)',
      title: 'Paso 5: P0 Finalizado',
      desc: 'P0 concluye y libera Alloc=(1,0,0). Todos los procesos concluyeron y el grafo está completamente reducido.'
    }
  ];

  function setRagStatus(type, title, desc) {
    if (!ragStatusCard) return;
    ragStatusCard.className = `rag-status-card ${type}`;
    if (ragStatusTitle) ragStatusTitle.textContent = title;
    if (ragStatusDesc) ragStatusDesc.textContent = desc;
  }

  function renderRagSvg(highlightCycle = false) {
    if (!ragSvg) return;
    ragSvg.innerHTML = '';

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `
      <marker id="arrow-alloc" markerWidth="9" markerHeight="9" refX="8" refY="4" orient="auto">
        <polygon points="0 1, 8 4, 0 7" fill="#10b981" />
      </marker>
      <marker id="arrow-req" markerWidth="9" markerHeight="9" refX="8" refY="4" orient="auto">
        <polygon points="0 1, 8 4, 0 7" fill="#f59e0b" />
      </marker>
      <marker id="arrow-cycle" markerWidth="10" markerHeight="10" refX="9" refY="4" orient="auto">
        <polygon points="0 1, 9 4, 0 7" fill="#ef4444" />
      </marker>
    `;
    ragSvg.appendChild(defs);

    currentRag.edges.forEach(edge => {
      const fromNode = currentRag.nodes.find(n => n.id === edge.from);
      const toNode = currentRag.nodes.find(n => n.id === edge.to);
      if (!fromNode || !toNode) return;

      const dx = toNode.x - fromNode.x;
      const dy = toNode.y - fromNode.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist === 0) return;

      // Compensar radio de nodos para que la punta de la flecha sea visible sobre el borde
      const sourceOffset = (fromNode.type === 'proc') ? 23 : 26;
      const targetOffset = (toNode.type === 'proc') ? 25 : 28;

      const x1 = fromNode.x + (dx / dist) * sourceOffset;
      const y1 = fromNode.y + (dy / dist) * sourceOffset;
      const x2 = toNode.x - (dx / dist) * targetOffset;
      const y2 = toNode.y - (dy / dist) * targetOffset;

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      path.setAttribute('x1', x1);
      path.setAttribute('y1', y1);
      path.setAttribute('x2', x2);
      path.setAttribute('y2', y2);

      if (highlightCycle) {
        path.setAttribute('stroke', '#ef4444');
        path.setAttribute('stroke-width', '3');
        path.setAttribute('marker-end', 'url(#arrow-cycle)');
      } else if (edge.type === 'alloc') {
        path.setAttribute('stroke', '#10b981');
        path.setAttribute('stroke-width', '2.2');
        path.setAttribute('marker-end', 'url(#arrow-alloc)');
      } else {
        path.setAttribute('stroke', '#f59e0b');
        path.setAttribute('stroke-width', '2');
        path.setAttribute('stroke-dasharray', '5,4');
        path.setAttribute('marker-end', 'url(#arrow-req)');
      }
      ragSvg.appendChild(path);

      // Si tiene etiqueta de instancias asignadas/solicitadas
      if (edge.label) {
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', midX);
        text.setAttribute('y', midY - 4);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', edge.type === 'alloc' ? '#34d399' : '#fbbf24');
        text.setAttribute('font-size', '9.5');
        text.setAttribute('font-weight', '700');
        text.textContent = edge.label;
        ragSvg.appendChild(text);
      }
    });

    currentRag.nodes.forEach(node => {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('transform', `translate(${node.x}, ${node.y})`);

      if (node.type === 'proc') {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('r', '22');
        circle.setAttribute('fill', '#1e293b');
        circle.setAttribute('stroke', '#38bdf8');
        circle.setAttribute('stroke-width', '2.5');
        g.appendChild(circle);

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dy', '5');
        text.setAttribute('fill', '#f8fafc');
        text.setAttribute('font-size', '12');
        text.setAttribute('font-weight', '700');
        text.textContent = node.label;
        g.appendChild(text);
      } else {
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', '-25');
        rect.setAttribute('y', '-25');
        rect.setAttribute('width', '50');
        rect.setAttribute('height', '50');
        rect.setAttribute('rx', '6');
        rect.setAttribute('fill', '#0f172a');
        rect.setAttribute('stroke', '#a855f7');
        rect.setAttribute('stroke-width', '2.5');
        g.appendChild(rect);

        const dotCount = Math.min(node.instances || 1, 5);
        for (let i = 0; i < dotCount; i++) {
          const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          const offset = (i - (dotCount - 1) / 2) * 8;
          dot.setAttribute('cx', offset);
          dot.setAttribute('cy', '6');
          dot.setAttribute('r', '2.5');
          dot.setAttribute('fill', '#ec4899');
          g.appendChild(dot);
        }

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('y', '-8');
        text.setAttribute('fill', '#f8fafc');
        text.setAttribute('font-size', '11');
        text.setAttribute('font-weight', '700');
        text.textContent = node.label;
        g.appendChild(text);
      }

      ragSvg.appendChild(g);
    });
  }

  document.getElementById('rag-btn-preset-silber')?.addEventListener('click', () => {
    currentRagPresetName = 'silber';
    loadRagPreset('silber');
  });
  document.getElementById('rag-btn-preset-deadlock')?.addEventListener('click', () => {
    currentRagPresetName = 'deadlock';
    loadRagPreset('deadlock');
  });
  document.getElementById('rag-btn-preset-ej2')?.addEventListener('click', () => {
    currentRagPresetName = 'ej2';
    loadRagPreset('ej2');
  });
  document.getElementById('rag-btn-reset')?.addEventListener('click', () => {
    loadRagPreset(currentRagPresetName);
  });

  document.getElementById('rag-btn-detect-cycles')?.addEventListener('click', () => {
    const hasDeadlockEdges = currentRag.edges.some(e => e.from === 'P2' && e.to === 'R1');
    if (hasDeadlockEdges) {
      renderRagSvg(true);
      setRagStatus('deadlock', '¡Ciclo Detectado!', 'Ciclo P1 -> R2 -> P2 -> R1 -> P1. Sistema en interbloqueo.');
    } else {
      renderRagSvg(false);
      setRagStatus('safe', 'Sin Ciclos Bloqueantes', 'El grafo es acíclico o reducible.');
    }
  });

  document.getElementById('rag-btn-step-reduce')?.addEventListener('click', () => {
    if (currentRagPresetName === 'deadlock') {
      setRagStatus('deadlock', 'Grafo Irreducible: Deadlock', 'P1 espera R2 (retenido por P2) y P2 espera R1 (retenido por P1). Ningún proceso puede finalizar.');
      return;
    }

    if (currentRagPresetName === 'ej2') {
      if (currentEj2ReductionStep < ej2ReductionOrder.length) {
        const stepData = ej2ReductionOrder[currentEj2ReductionStep];
        const procId = stepData.proc;

        // Eliminar proceso y sus aristas
        currentRag.nodes = currentRag.nodes.filter(n => n.id !== procId);
        currentRag.edges = currentRag.edges.filter(e => e.from !== procId && e.to !== procId);
        renderRagSvg();

        setRagStatus('safe', stepData.title, stepData.desc);
        currentEj2ReductionStep++;
      } else {
        setRagStatus('safe', 'Grafo Completamente Reducido', 'Todos los procesos concluyeron exitosamente en secuencia < P3, P2, P1, P4, P0 >. NO hay interbloqueo.');
      }
      return;
    }

    // Comportamiento por defecto para otros presets
    const procIndex = currentRag.nodes.findIndex(n => n.type === 'proc');
    if (procIndex >= 0) {
      const removedProc = currentRag.nodes.splice(procIndex, 1)[0];
      currentRag.edges = currentRag.edges.filter(e => e.from !== removedProc.id && e.to !== removedProc.id);
      renderRagSvg();
      setRagStatus('safe', `Reducción: ${removedProc.label} Finalizado`, `El proceso ${removedProc.label} concluyó y liberó sus recursos.`);
    } else {
      setRagStatus('safe', 'Grafo Completamente Reducido', 'Todos los procesos han finalizado exitosamente.');
    }
  });

  // Banquero Cockpit
  const bankerDataEj1 = {
    resources: ['A', 'B', 'C', 'D'],
    processes: ['P0', 'P1', 'P2', 'P3', 'P4'],
    available: [2, 3, 1, 1],
    alloc: [[0, 0, 1, 2], [1, 0, 0, 1], [1, 3, 3, 0], [0, 2, 1, 2], [1, 0, 1, 2]],
    max: [[0, 3, 1, 2], [1, 3, 2, 2], [2, 3, 4, 2], [0, 4, 5, 2], [1, 1, 5, 3]]
  };
  const bankerDataSilber = {
    resources: ['A', 'B', 'C'],
    processes: ['P0', 'P1', 'P2', 'P3', 'P4'],
    available: [3, 3, 2],
    alloc: [[0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2]],
    max: [[7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3]]
  };

  let currentBankerScenario = 'ej1';
  let activeBankerData = JSON.parse(JSON.stringify(bankerDataEj1));
  let isBankerSimulating = false;

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  function renderBankerTables() {
    const tableAvail = document.getElementById('table-banker-avail');
    const tableAlloc = document.getElementById('table-banker-alloc');
    const tableMax = document.getElementById('table-banker-max');
    const tableNeed = document.getElementById('table-banker-need');
    if (!tableAvail || !tableAlloc || !tableMax || !tableNeed) return;

    const res = activeBankerData.resources;
    const procs = activeBankerData.processes;

    let availHtml = `<thead><tr>${res.map(r => `<th>Recurso ${r}</th>`).join('')}</tr></thead><tbody><tr>`;
    availHtml += activeBankerData.available.map((v, j) => `<td class="res-val" data-res-idx="${j}" style="font-size:1.15rem; font-weight:700;">${v}</td>`).join('');
    availHtml += `</tr></tbody>`;
    tableAvail.innerHTML = availHtml;

    function buildMatrixHtml(matrix, matrixType) {
      let h = `<thead><tr><th>Proc</th>${res.map(r => `<th>${r}</th>`).join('')}</tr></thead><tbody>`;
      matrix.forEach((row, i) => {
        h += `<tr data-proc="${procs[i]}" data-matrix="${matrixType}"><td class="proc-cell"><strong>${procs[i]}</strong></td>${row.map((v, j) => `<td data-col="${j}">${v}</td>`).join('')}</tr>`;
      });
      h += `</tbody>`;
      return h;
    }

    tableAlloc.innerHTML = buildMatrixHtml(activeBankerData.alloc, 'alloc');
    tableMax.innerHTML = buildMatrixHtml(activeBankerData.max, 'max');

    const needMatrix = activeBankerData.max.map((row, i) => {
      return row.map((mVal, j) => mVal - activeBankerData.alloc[i][j]);
    });
    tableNeed.innerHTML = buildMatrixHtml(needMatrix, 'need');
  }

  function getSimulationDelay() {
    const sel = document.getElementById('banker-speed-select');
    return sel ? parseInt(sel.value, 10) : 1800;
  }

  function updateAvailCells(workVector, highlight = true) {
    const tableAvail = document.getElementById('table-banker-avail');
    if (!tableAvail) return;
    const cells = tableAvail.querySelectorAll('td.res-val');
    cells.forEach((cell, idx) => {
      if (workVector[idx] !== undefined) {
        cell.textContent = workVector[idx];
        if (highlight) {
          cell.classList.add('cell-highlight-avail');
          setTimeout(() => cell.classList.remove('cell-highlight-avail'), 900);
        }
      }
    });
  }

  function clearRowClasses() {
    document.querySelectorAll('#table-banker-alloc tr, #table-banker-need tr').forEach(tr => {
      tr.classList.remove('active-eval', 'finished-row', 'blocked-row');
      const pill = tr.querySelector('.row-status-pill');
      if (pill) pill.remove();
    });
    document.querySelectorAll('#table-banker-avail td').forEach(td => {
      td.classList.remove('cell-highlight-avail', 'cell-highlight-danger');
    });
  }

  function markProcRow(procId, statusClass, pillText = null, pillType = 'eval') {
    const rows = document.querySelectorAll(`tr[data-proc="${procId}"]`);
    rows.forEach(tr => {
      tr.classList.remove('active-eval', 'finished-row', 'blocked-row');
      if (statusClass) tr.classList.add(statusClass);

      const oldPill = tr.querySelector('.row-status-pill');
      if (oldPill) oldPill.remove();

      if (pillText) {
        const procCell = tr.querySelector('.proc-cell');
        if (procCell) {
          const pill = document.createElement('span');
          pill.className = `row-status-pill ${pillType}`;
          pill.textContent = pillText;
          procCell.appendChild(pill);
        }
      }
    });
  }

  const bankerTraceLog = document.getElementById('banker-trace-log');
  const bankerAvailStateBadge = document.getElementById('banker-avail-state-badge');

  // Estado para la ejecución manual "Paso a Paso"
  let bankerStepState = {
    initialized: false,
    work: [],
    finish: [],
    safeSequence: [],
    stepCount: 1,
    logHtml: []
  };

  function stepBankerSafetyAlgorithm() {
    if (isBankerSimulating) return;

    const btnStep = document.getElementById('banker-btn-step-safety');
    const procs = activeBankerData.processes;
    const res = activeBankerData.resources;
    const n = procs.length;
    const m = res.length;

    // Inicializar si es el primer clic del paso a paso
    if (!bankerStepState.initialized) {
      clearRowClasses();
      renderBankerTables();
      bankerStepState.initialized = true;
      bankerStepState.work = [...activeBankerData.available];
      bankerStepState.finish = new Array(n).fill(false);
      bankerStepState.safeSequence = [];
      bankerStepState.stepCount = 1;
      bankerStepState.logHtml = [
        `<div style="color:var(--accent-blue); font-weight:700;">[MODO PASO A PASO INICIADO] Vector Inicial Work = (${bankerStepState.work.join(', ')})</div>`,
        `<div style="color:var(--text-secondary); margin-bottom:4px;">Presiona 'Paso a Paso' para avanzar proceso por proceso.</div>`
      ];
      if (bankerTraceLog) {
        bankerTraceLog.innerHTML = bankerStepState.logHtml.join('');
        bankerTraceLog.scrollTop = bankerTraceLog.scrollHeight;
      }
      if (bankerAvailStateBadge) {
        bankerAvailStateBadge.className = 'badge-tag amber';
        bankerAvailStateBadge.textContent = 'Paso a Paso: Evaluando...';
      }
      if (btnStep) btnStep.textContent = '⏭ Siguiente Proceso';
      return;
    }

    // Buscar el siguiente proceso que pueda ejecutar (Need <= Work)
    let foundIndex = -1;
    for (let i = 0; i < n; i++) {
      if (!bankerStepState.finish[i]) {
        const needRow = activeBankerData.max[i].map((maxV, j) => maxV - activeBankerData.alloc[i][j]);
        const canRun = needRow.every((needV, j) => needV <= bankerStepState.work[j]);
        if (canRun) {
          foundIndex = i;
          break;
        }
      }
    }

    if (foundIndex !== -1) {
      const pName = procs[foundIndex];
      const needRow = activeBankerData.max[foundIndex].map((maxV, j) => maxV - activeBankerData.alloc[foundIndex][j]);
      const allocRow = activeBankerData.alloc[foundIndex];

      // Liberar recursos
      for (let j = 0; j < m; j++) {
        bankerStepState.work[j] += allocRow[j];
      }
      bankerStepState.finish[foundIndex] = true;
      bankerStepState.safeSequence.push(pName);

      // Actualizar DOM
      markProcRow(pName, 'finished-row', `✓ Paso ${bankerStepState.stepCount}`, 'success');
      updateAvailCells(bankerStepState.work, true);

      bankerStepState.logHtml.push(
        `<div style="color:#10b981; font-weight:600; margin-bottom:4px; padding:4px 6px; background:rgba(16,185,129,0.08); border-radius:4px;">
          ✓ Paso ${bankerStepState.stepCount}: Proceso <strong>${pName}</strong> cumple Need=(${needRow.join(',')}) &le; Work.
          Finaliza y libera Alloc=(${allocRow.join(',')}) &rarr; <strong>Nuevo Work = (${bankerStepState.work.join(', ')})</strong>
        </div>`
      );

      const allFinished = bankerStepState.finish.every(f => f === true);
      if (allFinished) {
        bankerStepState.logHtml.push(
          `<div style="margin-top:8px; padding:8px; background:rgba(16,185,129,0.18); border-left:4px solid #10b981; border-radius:4px; color:#10b981; font-weight:700;">
            🎉 ¡ESTADO SEGURO! Todos los procesos concluyeron. Secuencia: &lt; ${bankerStepState.safeSequence.join(', ')} &gt;
          </div>`
        );
        if (bankerAvailStateBadge) {
          bankerAvailStateBadge.className = 'badge-tag green';
          bankerAvailStateBadge.textContent = `✅ Estado Seguro: < ${bankerStepState.safeSequence.join(', ')} >`;
        }
        if (btnStep) {
          btnStep.textContent = '✓ Secuencia Completa';
          btnStep.disabled = true;
        }
      } else {
        bankerStepState.stepCount++;
        if (bankerAvailStateBadge) {
          bankerAvailStateBadge.className = 'badge-tag amber';
          bankerAvailStateBadge.textContent = `Paso ${bankerStepState.stepCount - 1} completado (Clic para Paso ${bankerStepState.stepCount})`;
        }
        if (btnStep) btnStep.textContent = `⏭ Ejecutar Paso ${bankerStepState.stepCount}`;
      }
    } else {
      // Ningún proceso restante puede ejecutar
      for (let i = 0; i < n; i++) {
        if (!bankerStepState.finish[i]) {
          markProcRow(procs[i], 'blocked-row', '⛔ Bloqueado', 'danger');
        }
      }
      bankerStepState.logHtml.push(
        `<div style="margin-top:8px; padding:8px; background:rgba(239,68,68,0.18); border-left:4px solid #ef4444; border-radius:4px; color:#ef4444; font-weight:700;">
          ⛔ ¡ESTADO INSEGURO! Ningún proceso restante puede satisfacer sus necesidades con el vector Work actual.
        </div>`
      );
      if (bankerAvailStateBadge) {
        bankerAvailStateBadge.className = 'badge-tag red';
        bankerAvailStateBadge.textContent = '⚠️ ESTADO INSEGURO';
      }
      if (btnStep) {
        btnStep.textContent = '⛔ Interbloqueo / Inseguro';
        btnStep.disabled = true;
      }
    }

    if (bankerTraceLog) {
      bankerTraceLog.innerHTML = bankerStepState.logHtml.join('');
      bankerTraceLog.scrollTop = bankerTraceLog.scrollHeight;
    }
  }

  async function runBankerSafetyAlgorithm() {
    if (isBankerSimulating) return;
    isBankerSimulating = true;

    const btnRun = document.getElementById('banker-btn-run-safety');
    const btnStep = document.getElementById('banker-btn-step-safety');
    const btnTest = document.getElementById('banker-btn-test-request');
    const delay = getSimulationDelay();

    if (btnRun) {
      btnRun.disabled = true;
      btnRun.textContent = '⏳ Auto-ejecutando...';
    }
    if (btnStep) btnStep.disabled = true;
    if (btnTest) btnTest.disabled = true;

    clearRowClasses();
    renderBankerTables(); // asegura estado limpio correspondiente

    // Reiniciar estado manual
    bankerStepState.initialized = false;

    const res = activeBankerData.resources;
    const procs = activeBankerData.processes;
    const n = procs.length;
    const m = res.length;

    let work = [...activeBankerData.available];
    let finish = new Array(n).fill(false);
    let safeSequence = [];
    let logHtml = [];

    if (bankerAvailStateBadge) {
      bankerAvailStateBadge.className = 'badge-tag amber';
      bankerAvailStateBadge.textContent = 'Evaluando Seguridad...';
    }

    logHtml.push(`<div style="color:var(--accent-blue); font-weight:700;">[INICIO AUTO] Vector Inicial Work = (${work.join(', ')}) (Pausa: ${(delay/1000).toFixed(1)}s)</div>`);
    if (bankerTraceLog) {
      bankerTraceLog.innerHTML = logHtml.join('');
      bankerTraceLog.scrollTop = bankerTraceLog.scrollHeight;
    }

    await sleep(Math.round(delay * 0.4));

    let step = 1;
    let changed = true;

    while (changed) {
      changed = false;
      for (let i = 0; i < n; i++) {
        if (!finish[i]) {
          const pName = procs[i];
          const needRow = activeBankerData.max[i].map((maxV, j) => maxV - activeBankerData.alloc[i][j]);

          // Resaltar proceso candidato en evaluación
          markProcRow(pName, 'active-eval', 'Evaluando...', 'eval');
          logHtml.push(`<div style="color:var(--text-secondary); margin-top:4px;">🔍 Verificando ${pName}: Need=(${needRow.join(',')}) vs Work=(${work.join(',')})</div>`);
          if (bankerTraceLog) {
            bankerTraceLog.innerHTML = logHtml.join('');
            bankerTraceLog.scrollTop = bankerTraceLog.scrollHeight;
          }

          await sleep(Math.round(delay * 0.45));

          const canRun = needRow.every((needV, j) => needV <= work[j]);

          if (canRun) {
            // El proceso puede ejecutar y liberar recursos
            for (let j = 0; j < m; j++) {
              work[j] += activeBankerData.alloc[i][j];
            }
            finish[i] = true;
            safeSequence.push(pName);
            changed = true;

            // Actualizar fila como finalizada
            markProcRow(pName, 'finished-row', `✓ Paso ${step}`, 'success');

            // Actualizar visualmente la tabla de Available en tiempo real
            updateAvailCells(work, true);

            logHtml.push(`<div style="color:#10b981; font-weight:600; margin-bottom:4px; padding:4px 6px; background:rgba(16,185,129,0.08); border-radius:4px;">
              ✓ Paso ${step}: ${pName} cumple Need &le; Work &rarr; Concluye y libera recursos. <strong>Nuevo Work = (${work.join(', ')})</strong>
            </div>`);
            if (bankerTraceLog) {
              bankerTraceLog.innerHTML = logHtml.join('');
              bankerTraceLog.scrollTop = bankerTraceLog.scrollHeight;
            }

            step++;
            await sleep(Math.round(delay * 0.55));
            break;
          } else {
            // No puede ejecutar en este momento, remover resaltado de evaluación temporal
            markProcRow(pName, null, null);
          }
        }
      }
    }

    const isSafe = finish.every(f => f === true);
    if (isSafe) {
      logHtml.push(`<div style="margin-top:8px; padding:8px; background:rgba(16,185,129,0.18); border-left:4px solid #10b981; border-radius:4px; color:#10b981; font-weight:700;">
        🎉 ¡ESTADO SEGURO CONFIRMADO! Secuencia de ejecución válida: &lt; ${safeSequence.join(', ')} &gt;
      </div>`);
      if (bankerAvailStateBadge) {
        bankerAvailStateBadge.className = 'badge-tag green';
        bankerAvailStateBadge.textContent = `✅ Estado Seguro: < ${safeSequence.join(', ')} >`;
      }
    } else {
      // Marcar los no finalizados como bloqueados
      for (let i = 0; i < n; i++) {
        if (!finish[i]) {
          markProcRow(procs[i], 'blocked-row', 'Bloqueado', 'danger');
        }
      }
      logHtml.push(`<div style="margin-top:8px; padding:8px; background:rgba(239,68,68,0.18); border-left:4px solid #ef4444; border-radius:4px; color:#ef4444; font-weight:700;">
        ⛔ ¡ESTADO INSEGURO! El sistema no puede garantizar la finalización de todos los procesos.
      </div>`);
      if (bankerAvailStateBadge) {
        bankerAvailStateBadge.className = 'badge-tag red';
        bankerAvailStateBadge.textContent = '⚠️ Estado Inseguro';
      }
    }

    if (bankerTraceLog) {
      bankerTraceLog.innerHTML = logHtml.join('');
      bankerTraceLog.scrollTop = bankerTraceLog.scrollHeight;
    }

    if (btnRun) {
      btnRun.disabled = false;
      btnRun.textContent = '▶ Auto-Ejecutar';
    }
    if (btnStep) btnStep.disabled = false;
    if (btnTest) btnTest.disabled = false;
    isBankerSimulating = false;
  }

  async function testBankerDynamicRequest() {
    if (isBankerSimulating) return;
    isBankerSimulating = true;

    const btnRun = document.getElementById('banker-btn-run-safety');
    const btnStep = document.getElementById('banker-btn-step-safety');
    const btnTest = document.getElementById('banker-btn-test-request');
    const delay = getSimulationDelay();

    if (btnTest) {
      btnTest.disabled = true;
      btnTest.textContent = '⏳ Simulando Solicitud...';
    }
    if (btnRun) btnRun.disabled = true;
    if (btnStep) btnStep.disabled = true;

    clearRowClasses();
    renderBankerTables();
    bankerStepState.initialized = false;

    let logHtml = [];

    if (currentBankerScenario === 'ej1') {
      // Solicitud de P1 = (0, 3, 0, 0)
      logHtml.push(`<div style="color:var(--accent-amber); font-weight:700;">[SOLICITUD DINÁMICA] Proceso P1 solicita: (A=0, B=3, C=0, D=0)</div>`);
      if (bankerTraceLog) {
        bankerTraceLog.innerHTML = logHtml.join('');
        bankerTraceLog.scrollTop = bankerTraceLog.scrollHeight;
      }

      await sleep(Math.round(delay * 0.45));

      // Paso 1: Solicitud <= Need P1
      logHtml.push(`<div>1. ¿Solicitud (0,3,0,0) &le; Need P1 (0,3,2,1)? <strong style="color:#10b981;">SÍ (Válida)</strong></div>`);
      // Paso 2: Solicitud <= Disponible
      logHtml.push(`<div>2. ¿Solicitud (0,3,0,0) &le; Disponible (2,3,1,1)? <strong style="color:#10b981;">SÍ (Recursos libres suficientes)</strong></div>`);
      if (bankerTraceLog) {
        bankerTraceLog.innerHTML = logHtml.join('');
        bankerTraceLog.scrollTop = bankerTraceLog.scrollHeight;
      }

      await sleep(Math.round(delay * 0.5));

      // Paso 3: Asignación provisional en el DOM
      logHtml.push(`<div style="color:var(--accent-blue); margin-top:4px;">3. Simulación de asignación provisional en matrices...</div>`);

      // Actualizar Available provisional en DOM: (2, 0, 1, 1)
      const simAvail = [2, 0, 1, 1];
      const tableAvail = document.getElementById('table-banker-avail');
      if (tableAvail) {
        const cells = tableAvail.querySelectorAll('td.res-val');
        cells.forEach((cell, idx) => {
          cell.textContent = simAvail[idx];
          if (idx === 1) { // B = 0 en peligro
            cell.classList.add('cell-highlight-danger');
          } else {
            cell.classList.add('cell-highlight-avail');
          }
        });
      }

      // Actualizar Alloc de P1 provisional: (1, 3, 0, 1)
      const allocRowP1 = document.querySelector('#table-banker-alloc tr[data-proc="P1"]');
      if (allocRowP1) {
        allocRowP1.querySelectorAll('td[data-col]').forEach((td, colIdx) => {
          const simulatedAllocP1 = [1, 3, 0, 1];
          td.textContent = simulatedAllocP1[colIdx];
        });
      }
      // Actualizar Need de P1 provisional: (0, 0, 2, 1)
      const needRowP1 = document.querySelector('#table-banker-need tr[data-proc="P1"]');
      if (needRowP1) {
        needRowP1.querySelectorAll('td[data-col]').forEach((td, colIdx) => {
          const simulatedNeedP1 = [0, 0, 2, 1];
          td.textContent = simulatedNeedP1[colIdx];
        });
      }

      markProcRow('P1', 'active-eval', 'P1 Modificado', 'eval');

      logHtml.push(`<div>&nbsp;&nbsp;&bull; Disponible' = (2, <strong style="color:#ef4444;">0</strong>, 1, 1)</div>`);
      logHtml.push(`<div>&nbsp;&nbsp;&bull; Alloc(P1)' = (1, 3, 0, 1), Need(P1)' = (0, 0, 2, 1)</div>`);
      if (bankerTraceLog) {
        bankerTraceLog.innerHTML = logHtml.join('');
        bankerTraceLog.scrollTop = bankerTraceLog.scrollHeight;
      }

      await sleep(Math.round(delay * 0.6));

      // Paso 4: Evaluar seguridad en estado provisional
      logHtml.push(`<div style="color:var(--accent-amber); margin-top:4px;">4. Ejecutando Algoritmo de Seguridad con Disponible' = (2, 0, 1, 1)...</div>`);
      logHtml.push(`<div>&nbsp;&nbsp;&bull; P0 necesita B=3 (Disponible B=0) &rarr; <span style="color:#ef4444;">No puede</span></div>`);
      logHtml.push(`<div>&nbsp;&nbsp;&bull; P1 necesita C=2 (Disponible C=1) &rarr; <span style="color:#ef4444;">No puede</span></div>`);
      logHtml.push(`<div>&nbsp;&nbsp;&bull; P2 necesita D=2 (Disponible D=1) &rarr; <span style="color:#ef4444;">No puede</span></div>`);
      logHtml.push(`<div>&nbsp;&nbsp;&bull; P3 necesita B=2, C=4 (Disponible B=0, C=1) &rarr; <span style="color:#ef4444;">No puede</span></div>`);
      logHtml.push(`<div>&nbsp;&nbsp;&bull; P4 necesita B=1, C=4 (Disponible B=0, C=1) &rarr; <span style="color:#ef4444;">No puede</span></div>`);

      // Marcar todos los procesos como bloqueados
      ['P0', 'P1', 'P2', 'P3', 'P4'].forEach(p => {
        markProcRow(p, 'blocked-row', '⛔ Bloqueado', 'danger');
      });

      logHtml.push(`<div style="margin-top:8px; padding:10px; background:rgba(239,68,68,0.2); border-left:4px solid #ef4444; border-radius:4px; color:#f87171; font-weight:700;">
        ⚠️ DICTAMEN DEL SISTEMA OPERATIVO:<br>
        El estado simulado es <strong>INSEGURO</strong> (ningún proceso puede terminar si se conceden los 3 recursos de B).
        Por lo tanto, <strong>la solicitud NO se concede inmediatamente</strong>. P1 pasa al estado BLOQUEADO en espera de que otros procesos liberen instancias de B.
      </div>`);

      if (bankerAvailStateBadge) {
        bankerAvailStateBadge.className = 'badge-tag red';
        bankerAvailStateBadge.textContent = '⚠️ ESTADO INSEGURO — Solicitud Suspendida';
      }

    } else {
      // Escenario Silberschatz: P1 solicita (1, 0, 2)
      logHtml.push(`<div style="color:var(--accent-amber); font-weight:700;">[SOLICITUD DINÁMICA - Silberschatz] P1 solicita: (A=1, B=0, C=2)</div>`);
      logHtml.push(`<div>1. ¿Solicitud (1,0,2) &le; Need P1 (1,2,2)? <strong style="color:#10b981;">SÍ</strong></div>`);
      logHtml.push(`<div>2. ¿Solicitud (1,0,2) &le; Disponible (3,3,2)? <strong style="color:#10b981;">SÍ</strong></div>`);

      await sleep(Math.round(delay * 0.45));

      // Disponible provisional: (2, 3, 0)
      const simAvail = [2, 3, 0];
      updateAvailCells(simAvail, true);

      markProcRow('P1', 'active-eval', '+ Solicitud', 'eval');

      logHtml.push(`<div style="color:#10b981; margin-top:6px;">3. Concesión provisional: Disponible' = (2, 3, 0).</div>`);
      logHtml.push(`<div>4. Verificación de seguridad: P1 puede finalizar con Need=(0,2,0) &le; (2,3,0). Secuencia válida: &lt; P1, P3, P4, P0, P2 &gt;.</div>`);
      logHtml.push(`<div style="margin-top:8px; padding:8px; background:rgba(16,185,129,0.18); border-left:4px solid #10b981; border-radius:4px; color:#10b981; font-weight:700;">
        ✓ SOLICITUD APROBADA: El sistema permanece en ESTADO SEGURO.
      </div>`);

      markProcRow('P1', 'finished-row', 'Aprobado', 'success');

      if (bankerAvailStateBadge) {
        bankerAvailStateBadge.className = 'badge-tag green';
        bankerAvailStateBadge.textContent = '✓ Solicitud Concedida (Seguro)';
      }
    }

    if (bankerTraceLog) {
      bankerTraceLog.innerHTML = logHtml.join('');
      bankerTraceLog.scrollTop = bankerTraceLog.scrollHeight;
    }

    if (btnTest) {
      btnTest.disabled = false;
      btnTest.textContent = '🧪 Test Solicitud Dinámica';
    }
    if (btnRun) btnRun.disabled = false;
    if (btnStep) btnStep.disabled = false;
    isBankerSimulating = false;
  }

  const btnLoadEj1 = document.getElementById('banker-btn-load-ej1');
  const btnLoadSilber = document.getElementById('banker-btn-load-silber');
  const btnResetBanker = document.getElementById('banker-btn-reset');

  function resetBankerState() {
    isBankerSimulating = false;
    bankerStepState.initialized = false;

    if (currentBankerScenario === 'ej1') {
      activeBankerData = JSON.parse(JSON.stringify(bankerDataEj1));
      if (btnLoadEj1) btnLoadEj1.classList.add('active');
      if (btnLoadSilber) btnLoadSilber.classList.remove('active');
    } else {
      activeBankerData = JSON.parse(JSON.stringify(bankerDataSilber));
      if (btnLoadSilber) btnLoadSilber.classList.add('active');
      if (btnLoadEj1) btnLoadEj1.classList.remove('active');
    }

    clearRowClasses();
    renderBankerTables();

    if (bankerAvailStateBadge) {
      bankerAvailStateBadge.className = 'badge-tag green';
      bankerAvailStateBadge.textContent = 'Estado: Seguro';
    }

    if (bankerTraceLog) {
      bankerTraceLog.innerHTML = "Presiona 'Paso a Paso' o 'Auto-Ejecutar' para visualizar los cambios en Work y Finish.";
    }

    const btnRun = document.getElementById('banker-btn-run-safety');
    const btnStep = document.getElementById('banker-btn-step-safety');
    const btnTest = document.getElementById('banker-btn-test-request');
    if (btnRun) {
      btnRun.disabled = false;
      btnRun.textContent = '▶ Auto-Ejecutar';
    }
    if (btnStep) {
      btnStep.disabled = false;
      btnStep.textContent = '⏭ Paso a Paso';
    }
    if (btnTest) {
      btnTest.disabled = false;
      btnTest.textContent = '🧪 Test Solicitud Dinámica';
    }
  }

  btnLoadEj1?.addEventListener('click', () => {
    currentBankerScenario = 'ej1';
    resetBankerState();
  });

  btnLoadSilber?.addEventListener('click', () => {
    currentBankerScenario = 'silber';
    resetBankerState();
  });

  btnResetBanker?.addEventListener('click', () => {
    resetBankerState();
  });

  document.getElementById('banker-btn-step-safety')?.addEventListener('click', stepBankerSafetyAlgorithm);
  document.getElementById('banker-btn-run-safety')?.addEventListener('click', runBankerSafetyAlgorithm);
  document.getElementById('banker-btn-test-request')?.addEventListener('click', testBankerDynamicRequest);

  const tabBtnRag = document.getElementById('tab-btn-rag');
  const tabBtnBanker = document.getElementById('tab-btn-banker');
  const panelRag = document.getElementById('panel-rag-studio');
  const panelBanker = document.getElementById('panel-banker-studio');

  if (tabBtnRag && tabBtnBanker && panelRag && panelBanker) {
    tabBtnRag.addEventListener('click', () => {
      tabBtnRag.classList.add('active');
      tabBtnBanker.classList.remove('active');
      panelRag.style.display = 'grid';
      panelBanker.style.display = 'none';
    });
    tabBtnBanker.addEventListener('click', () => {
      tabBtnBanker.classList.add('active');
      tabBtnRag.classList.remove('active');
      panelRag.style.display = 'none';
      panelBanker.style.display = 'flex';
      renderBankerTables();
    });
  }

  // ==========================================
  // 13. INICIALIZACIÓN
  // ==========================================
  loadLocalState();
  updateSequenceOrder();
  updateProgress();
  loadRagPreset('silber');
  renderBankerTables();
});
