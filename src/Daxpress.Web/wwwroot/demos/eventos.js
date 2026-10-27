// Demo: menús para eventos. Todo vive en el navegador (localStorage) para que lo que el cliente
// cargue no se pierda cuando el hosting gratuito reinicia el servidor.
(() => {
  const CLAVE = 'daxpress-demo-eventos-v1';
  const MAX = 9999;
  const CATEGORIAS = [
    { id: 'entradas', nombre: 'Entradas', unica: false, ayuda: 'Elegí todas las que quieras e indicá la cantidad.' },
    { id: 'calientes', nombre: 'Platos calientes', unica: false, ayuda: 'Elegí todos los que quieras e indicá la cantidad.' },
    { id: 'principales', nombre: 'Plato principal', unica: true, ayuda: 'Elegí una sola opción e indicá la cantidad de porciones.' },
  ];
  const INFORMES = {
    costo: 'Informe de costo',
    publico: 'Presupuesto',
    personal: 'Cantidades para el personal',
  };

  // ---------- Estado ----------
  const ejemplo = JSON.parse(document.getElementById('platos-ejemplo').textContent);
  const estadoInicial = () => ({
    platos: structuredClone(ejemplo),
    cantidades: {},
    principalId: null,
    evento: { nombre: '', fecha: '', adultos: '', adolescentes: '', ninos: '' },
  });

  let estado;
  try { estado = JSON.parse(localStorage.getItem(CLAVE)); } catch { estado = null; }
  if (!estado || !Array.isArray(estado.platos)) estado = estadoInicial();
  // Versión anterior de la demo: un solo campo "personas" y porciones del principal cargadas a mano
  if (estado.evento.adultos === undefined) estado.evento.adultos = estado.evento.personas ?? '';
  delete estado.evento.personas;
  delete estado.principalCantidad;

  const guardar = () => { try { localStorage.setItem(CLAVE, JSON.stringify(estado)); } catch { /* sin almacenamiento: sigue en memoria */ } };

  // ---------- Utilidades ----------
  const $ = (sel, raiz = document) => raiz.querySelector(sel);
  const $$ = (sel, raiz = document) => [...raiz.querySelectorAll(sel)];
  const esc = t => String(t ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pesos = n => '$ ' + Math.round(n).toLocaleString('es-UY');
  const entero = v => Math.min(MAX, Math.max(0, parseInt(v, 10) || 0));
  const aPack = (n, pack) => (n <= 0 ? 0 : Math.min(MAX, Math.ceil(n / pack) * pack));
  const plato = id => estado.platos.find(p => p.id === id);
  const platosDe = cat => estado.platos.filter(p => p.categoria === cat).sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  const margen = p => (p.precio > 0 ? (p.precio - p.costo) / p.precio : 0);
  const porc = x => `${Math.round(x * 100)}%`;
  const deA = p => (p.pack > 1 ? `de a ${p.pack}` : 'por unidad');

  /** Invitados del evento por grupo de edad. */
  function invitados() {
    const ev = estado.evento;
    const adultos = entero(ev.adultos), adolescentes = entero(ev.adolescentes), ninos = entero(ev.ninos);
    return { adultos, adolescentes, ninos, total: adultos + adolescentes + ninos };
  }

  /** Mínimos recomendados: entradas 6/3/3 y calientes 3/2/2 (adulto/adolescente/niño). */
  function minimos() {
    const i = invitados();
    return {
      entradas: 6 * i.adultos + 3 * i.adolescentes + 3 * i.ninos,
      calientes: 3 * i.adultos + 2 * i.adolescentes + 2 * i.ninos,
    };
  }

  /** El plato principal es uno por adulto (redondeado a la presentación del plato). */
  function porcionesPrincipal() {
    const p = plato(estado.principalId);
    return p ? aPack(invitados().adultos, p.pack) : 0;
  }

  const unidadesDe = cat => platosDe(cat).reduce((s, p) => s + (estado.cantidades[p.id] || 0), 0);

  /** Líneas elegidas, agrupadas por categoría, en el orden del menú. */
  function lineas() {
    return CATEGORIAS.map(cat => {
      let items;
      if (cat.unica) {
        const p = plato(estado.principalId);
        const porciones = porcionesPrincipal();
        items = p && p.categoria === cat.id && porciones > 0 ? [{ plato: p, cantidad: porciones }] : [];
      } else {
        items = platosDe(cat.id).map(p => ({ plato: p, cantidad: estado.cantidades[p.id] || 0 })).filter(x => x.cantidad > 0);
      }
      return { cat, items };
    });
  }

  function totales(grupos) {
    let venta = 0, costo = 0;
    grupos.forEach(g => g.items.forEach(({ plato: p, cantidad }) => { venta += p.precio * cantidad; costo += p.costo * cantidad; }));
    return { venta, costo, ganancia: venta - costo };
  }

  // ---------- Pestañas ----------
  function irA(tab) {
    $$('[data-tab]').forEach(b => b.setAttribute('aria-selected', String(b.dataset.tab === tab)));
    $$('[data-panel-tab]').forEach(s => { s.hidden = s.dataset.panelTab !== tab; });
    $('[data-vista-informes]').hidden = true;
    if (tab === 'armar') renderArmado();
    if (tab === 'platos') renderListaPlatos();
    history.replaceState(null, '', tab === 'platos' ? '#platos' : location.pathname);
  }
  $$('[data-tab]').forEach(b => b.addEventListener('click', () => irA(b.dataset.tab)));

  // ---------- Armar menú ----------
  const contenedorCategorias = $('[data-categorias]');

  function contador(nombreInput, valor, pack, etiqueta) {
    return `<div class="contador" data-pack="${pack}">
      <button type="button" data-paso="-1" aria-label="Quitar ${pack > 1 ? pack + ' unidades' : 'una unidad'} de ${esc(etiqueta)}">−</button>
      <input type="number" ${nombreInput} value="${valor > 0 ? valor : ''}" placeholder="0" min="0" step="${pack}" inputmode="numeric" aria-label="Cantidad de ${esc(etiqueta)}" />
      <button type="button" data-paso="1" aria-label="Agregar ${pack > 1 ? pack + ' unidades' : 'una unidad'} de ${esc(etiqueta)}">+</button>
    </div>`;
  }

  function renderArmado() {
    // Limpia selecciones de platos que ya no existen o cambiaron de categoría
    Object.keys(estado.cantidades).forEach(id => {
      const p = plato(id);
      if (!p || p.categoria === 'principales') delete estado.cantidades[id];
    });
    const principal = plato(estado.principalId);
    if (!principal || principal.categoria !== 'principales') estado.principalId = null;

    contenedorCategorias.innerHTML = CATEGORIAS.map(cat => {
      const platos = platosDe(cat.id);
      const cuerpo = platos.length === 0
        ? `<p class="vacio">No hay platos en esta categoría. Agregalos en <button type="button" class="enlace-boton" data-ir-platos>Platos y precios</button>.</p>`
        : cat.unica ? renderPrincipales(platos) : `<div class="platos">${platos.map(renderPlato).join('')}</div>`;
      const medidor = cat.unica ? '' : `<div class="medidor" data-medidor="${cat.id}">
          <div class="medidor__texto"><span data-medidor-texto></span><span class="medidor__estado" data-medidor-estado></span></div>
          <div class="medidor__barra"><span></span></div>
        </div>`;
      return `<section class="categoria"><h2>${cat.nombre}</h2><p class="ayuda">${cat.ayuda}</p>${medidor}${cuerpo}</section>`;
    }).join('');

    actualizarSeleccion();
  }

  function cargarEvento() {
    $$('[data-evento]').forEach(i => { i.value = estado.evento[i.dataset.evento] ?? ''; });
  }

  function renderPlato(p) {
    const cantidad = estado.cantidades[p.id] || 0;
    return `<div class="plato ${cantidad > 0 ? 'plato--activo' : ''}" data-plato="${esc(p.id)}">
      <div>
        <h3>${esc(p.nombre)}</h3>
        ${p.descripcion ? `<p>${esc(p.descripcion)}</p>` : ''}
        <p class="precio">${pesos(p.precio)} c/u · <span class="pack">${deA(p)}</span></p>
      </div>
      <div class="plato__pie">
        <span class="marca-seleccion">Seleccionado</span>
        ${contador(`data-cantidad="${esc(p.id)}"`, cantidad, p.pack, p.nombre)}
      </div>
    </div>`;
  }

  function renderPrincipales(platos) {
    const elegido = plato(estado.principalId);
    const opciones = platos.map(p => {
      const activo = p.id === estado.principalId;
      return `<label class="plato plato--opcion ${activo ? 'plato--activo' : ''}">
        <input type="radio" name="principal" value="${esc(p.id)}" ${activo ? 'checked' : ''} />
        <span class="plato__texto">
          <span class="plato__nombre">${esc(p.nombre)}</span>
          ${p.descripcion ? `<span class="plato__desc">${esc(p.descripcion)}</span>` : ''}
          <span class="precio">${pesos(p.precio)} c/u · <span class="pack">${deA(p)}</span></span>
        </span>
        <span class="marca-seleccion">Elegido</span>
      </label>`;
    }).join('');
    const porciones = elegido
      ? `<div class="porciones"><span>Porciones de <strong>${esc(elegido.nombre)}</strong></span>
          <span data-porciones-texto></span></div>`
      : '';
    return `<div class="platos" role="radiogroup" aria-label="Plato principal">${opciones}</div>${porciones}`;
  }

  function fijarCantidad(input, valor) {
    if (valor > 0) estado.cantidades[input.dataset.cantidad] = valor; else delete estado.cantidades[input.dataset.cantidad];
    input.closest('.plato').classList.toggle('plato--activo', valor > 0);
    guardar();
    actualizarSeleccion();
  }

  contenedorCategorias.addEventListener('click', e => {
    if (e.target.closest('[data-ir-platos]')) return irA('platos');
    const boton = e.target.closest('[data-paso]');
    if (!boton) return;
    const caja = boton.closest('.contador');
    const pack = +caja.dataset.pack;
    const input = $('input', caja);
    const actual = aPack(entero(input.value), pack);
    const nuevo = Math.max(0, Math.min(MAX, actual + (+boton.dataset.paso) * pack));
    input.value = nuevo > 0 ? nuevo : '';
    fijarCantidad(input, nuevo);
  });

  // Mientras escribe se toma el número tal cual; al salir del campo se redondea al pack
  contenedorCategorias.addEventListener('input', e => {
    if (e.target.matches('.contador input')) fijarCantidad(e.target, entero(e.target.value));
  });
  contenedorCategorias.addEventListener('change', e => {
    const t = e.target;
    if (t.matches('.contador input')) {
      const valor = aPack(entero(t.value), +t.closest('.contador').dataset.pack);
      t.value = valor > 0 ? valor : '';
      fijarCantidad(t, valor);
    } else if (t.name === 'principal') {
      estado.principalId = t.value;
      guardar();
      renderArmado();
    }
  });

  $$('[data-evento]').forEach(i => i.addEventListener('input', () => {
    estado.evento[i.dataset.evento] = i.value;
    guardar();
    actualizarSeleccion();
  }));

  /** Unidades elegidas frente al mínimo recomendado, por categoría. */
  function estadoMinimos() {
    const min = minimos();
    return ['entradas', 'calientes'].map(id => {
      const elegidas = unidadesDe(id), minimo = min[id];
      return { id, nombre: CATEGORIAS.find(c => c.id === id).nombre, elegidas, minimo, ok: minimo > 0 && elegidas >= minimo };
    });
  }

  function actualizarMedidores(estados) {
    estados.forEach(m => {
      const caja = $(`[data-medidor="${m.id}"]`);
      if (!caja) return;
      const sinDatos = m.minimo === 0;
      caja.classList.toggle('medidor--ok', m.ok);
      caja.classList.toggle('medidor--sin-datos', sinDatos);
      $('[data-medidor-texto]', caja).innerHTML = sinDatos
        ? `Elegidas: <strong>${m.elegidas} u.</strong> · cargá los invitados para ver el mínimo recomendado`
        : `Elegidas: <strong>${m.elegidas} u.</strong> · mínimo recomendado: <strong>${m.minimo} u.</strong>`;
      $('[data-medidor-estado]', caja).textContent = sinDatos ? '' : m.ok ? '✓ Cumple el mínimo' : `Faltan ${m.minimo - m.elegidas} u.`;
      $('.medidor__barra span', caja).style.width = sinDatos ? '0' : `${Math.min(100, (m.elegidas / m.minimo) * 100)}%`;
    });
  }

  function actualizarSeleccion() {
    const grupos = lineas();
    const elegido = plato(estado.principalId);
    const { adultos } = invitados();

    const porcionesTexto = $('[data-porciones-texto]');
    if (porcionesTexto) {
      porcionesTexto.innerHTML = adultos > 0
        ? `<strong>${porcionesPrincipal()}</strong> · 1 por adulto`
        : '<span class="falta">Cargá la cantidad de adultos</span>';
    }

    const html = grupos.map(({ cat, items }) => {
      let filas = items.map(({ plato: p, cantidad }) => `<li><span>${esc(p.nombre)}</span><strong>${cantidad} ${cat.unica ? 'porc.' : 'u.'}</strong></li>`);
      if (cat.unica && elegido && adultos === 0) filas = [`<li><span>${esc(elegido.nombre)}</span><strong class="falta">faltan adultos</strong></li>`];
      return filas.length ? `<h3>${cat.nombre}</h3><ul>${filas.join('')}</ul>` : '';
    }).join('');

    const estados = estadoMinimos();
    actualizarMedidores(estados);
    const conMinimo = estados.filter(m => m.minimo > 0);
    const bloqueMinimos = conMinimo.length
      ? `<dl class="minimos">${conMinimo.map(m => `<div class="${m.ok ? 'ok' : ''}"><dt>${m.nombre}</dt><dd>${m.elegidas} / ${m.minimo} u.</dd></div>`).join('')}</dl>
         ${conMinimo.some(m => !m.ok) ? '<p class="aviso-minimo">Por debajo del mínimo recomendado.</p>' : ''}`
      : '';

    const t = totales(grupos);
    $('[data-seleccion]').innerHTML = (html
      ? `${html}<dl class="totales"><div><dt>Venta</dt><dd>${pesos(t.venta)}</dd></div><div><dt>Costo</dt><dd>${pesos(t.costo)}</dd></div><div class="totales__fuerte"><dt>Ganancia</dt><dd>${pesos(t.ganancia)}</dd></div></dl>`
      : '<p class="vacio">Todavía no elegiste ningún plato.</p>') + bloqueMinimos;

    const n = grupos.reduce((s, g) => s + g.items.length, 0);
    $('[data-conteo]').textContent = n === 0 ? 'Ningún plato elegido' : `${n} ${n === 1 ? 'plato' : 'platos'} · ${pesos(t.venta)}`;
    $('[data-errores]').hidden = true;
  }

  function validar() {
    const errores = [];
    const grupos = lineas();
    if (!grupos.some(g => !g.cat.unica && g.items.length)) errores.push('Elegí al menos una entrada o un plato caliente.');
    if (!estado.principalId) errores.push('Elegí un plato principal.');
    if (invitados().adultos === 0) errores.push('Cargá la cantidad de adultos (el plato principal es uno por adulto).');
    return errores;
  }

  // ---------- Informes ----------
  let informeActual = 'costo';

  $$('[data-ver-informes]').forEach(b => b.addEventListener('click', () => {
    const errores = validar();
    const caja = $('[data-errores]');
    if (errores.length) {
      caja.innerHTML = `<ul>${errores.map(x => `<li>${x}</li>`).join('')}</ul>`;
      caja.hidden = false;
      if (window.matchMedia('(max-width: 959px)').matches) alert(errores.join('\n'));
      return;
    }
    $('[data-panel-tab="armar"]').hidden = true;
    $('[data-vista-informes]').hidden = false;
    renderInforme();
    window.scrollTo({ top: 0 });
  }));

  $('[data-volver]').addEventListener('click', () => irA('armar'));
  $('[data-imprimir]').addEventListener('click', () => window.print());
  $$('[data-informe]').forEach(b => b.addEventListener('click', () => {
    informeActual = b.dataset.informe;
    renderInforme();
  }));

  function encabezadoEvento() {
    const ev = estado.evento;
    const fecha = ev.fecha ? new Date(ev.fecha + 'T12:00').toLocaleDateString('es-UY', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '';
    const i = invitados();
    const grupos = [[i.adultos, 'adulto', 'adultos'], [i.adolescentes, 'adolescente', 'adolescentes'], [i.ninos, 'niño', 'niños']]
      .filter(([n]) => n > 0).map(([n, uno, varios]) => `${n} ${n === 1 ? uno : varios}`);
    const personas = grupos.length ? `${i.total} invitados (${grupos.join(', ')})` : '';
    const datos = [fecha, personas].filter(Boolean).join(' · ');
    return `<p class="hoja__evento">${esc(ev.nombre || 'Evento sin nombre')}</p>${datos ? `<p class="hoja__datos">${esc(datos)}</p>` : ''}`;
  }

  function renderInforme() {
    $$('[data-informe]').forEach(b => b.setAttribute('aria-selected', String(b.dataset.informe === informeActual)));
    const grupos = lineas().filter(g => g.items.length);
    const t = totales(grupos);
    const tipo = informeActual;

    const columnas = {
      costo: ['Plato', 'Cantidad', 'Compra c/u', 'Subtotal'],
      publico: ['Plato', 'Cantidad', 'Precio c/u', 'Subtotal'],
      personal: ['Plato', 'Cantidad', 'Presentación'],
    }[tipo];

    const fila = (p, cantidad, unidad) => {
      const cant = `${cantidad} ${unidad}`;
      if (tipo === 'personal') {
        const presentacion = p.pack > 1 ? `${cantidad / p.pack} × ${p.pack} u.` : '—';
        return `<tr><td>${esc(p.nombre)}</td><td class="num">${cant}</td><td class="num">${presentacion}</td></tr>`;
      }
      const unitario = tipo === 'costo' ? p.costo : p.precio;
      return `<tr><td>${esc(p.nombre)}</td><td class="num">${cant}</td><td class="num">${pesos(unitario)}</td><td class="num">${pesos(unitario * cantidad)}</td></tr>`;
    };

    const cuerpo = grupos.map(({ cat, items }) => {
      const unidad = cat.unica ? 'porc.' : 'u.';
      const subtotal = items.reduce((s, { plato: p, cantidad }) => s + (tipo === 'costo' ? p.costo : p.precio) * cantidad, 0);
      const pie = tipo === 'personal' ? '' : `<tr class="subtotal"><td colspan="3">Subtotal ${cat.nombre.toLowerCase()}</td><td class="num">${pesos(subtotal)}</td></tr>`;
      return `<tbody><tr class="grupo"><th colspan="${columnas.length}" scope="colgroup">${cat.nombre}</th></tr>${items.map(i => fila(i.plato, i.cantidad, unidad)).join('')}${pie}</tbody>`;
    }).join('');

    let resumen = '';
    if (tipo === 'costo') {
      resumen = `<dl class="hoja__totales">
        <div><dt>Costo total</dt><dd>${pesos(t.costo)}</dd></div>
        <div><dt>Venta total</dt><dd>${pesos(t.venta)}</dd></div>
        <div class="fuerte"><dt>Ganancia</dt><dd>${pesos(t.ganancia)} <small>(${porc(t.venta ? t.ganancia / t.venta : 0)} de la venta)</small></dd></div>
      </dl>`;
    } else if (tipo === 'publico') {
      const personas = invitados().total;
      resumen = `<dl class="hoja__totales">
        <div class="fuerte"><dt>Total</dt><dd>${pesos(t.venta)}</dd></div>
        ${personas > 0 ? `<div><dt>Por persona</dt><dd>${pesos(t.venta / personas)}</dd></div>` : ''}
      </dl>`;
    }

    const nota = { costo: 'Uso interno: no compartir con el cliente.', publico: 'Precios en pesos uruguayos.', personal: 'Sin precios: para la cocina y el personal de servicio.' }[tipo];

    $('[data-hoja]').innerHTML = `
      <header class="hoja__cabecera">
        <div><p class="hoja__marca">Tu Evento</p><h2>${INFORMES[tipo]}</h2></div>
        <div class="hoja__meta">${encabezadoEvento()}</div>
      </header>
      <table class="hoja__tabla">
        <thead><tr>${columnas.map((c, i) => `<th scope="col" class="${i ? 'num' : ''}">${c}</th>`).join('')}</tr></thead>
        ${cuerpo}
      </table>
      ${resumen}
      <p class="hoja__nota">${nota}</p>`;
  }

  // ---------- Platos y precios ----------
  const form = $('[data-form-plato]');
  let editando = null;

  function vistaMargen() {
    const costo = parseFloat(form.costo.value), precio = parseFloat(form.precio.value);
    const caja = $('[data-margen]');
    if (!(costo >= 0) || !(precio > 0)) { caja.textContent = ''; return; }
    const g = precio - costo;
    caja.textContent = `Ganancia por unidad: ${pesos(g)} (${porc(g / precio)} del precio de venta)`;
    caja.classList.toggle('margen--negativo', g < 0);
  }
  form.addEventListener('input', vistaMargen);

  function limpiarForm() {
    editando = null;
    form.reset();
    form.pack.value = 1;
    $('[data-form-titulo]').textContent = 'Nuevo plato';
    $('[data-form-guardar]').textContent = 'Agregar plato';
    $('[data-form-cancelar]').hidden = true;
    $('[data-form-errores]').hidden = true;
    vistaMargen();
  }
  $('[data-form-cancelar]').addEventListener('click', limpiarForm);

  form.addEventListener('submit', e => {
    e.preventDefault();
    const datos = {
      nombre: form.nombre.value.trim(),
      descripcion: form.descripcion.value.trim(),
      categoria: form.categoria.value,
      costo: parseFloat(form.costo.value),
      precio: parseFloat(form.precio.value),
      pack: parseInt(form.pack.value, 10),
    };
    const errores = [];
    if (!datos.nombre) errores.push('Poné un nombre.');
    if (!(datos.costo >= 0)) errores.push('Indicá el precio de compra.');
    if (!(datos.precio >= 0)) errores.push('Indicá el precio de venta.');
    if (!(datos.pack >= 1)) errores.push('"Se vende de a" tiene que ser 1 o más.');
    const caja = $('[data-form-errores]');
    if (errores.length) { caja.textContent = errores.join(' '); caja.hidden = false; return; }

    if (editando) {
      Object.assign(plato(editando), datos);
      // Si cambió el pack, ajusta lo ya elegido a múltiplos del nuevo pack
      if (estado.cantidades[editando]) estado.cantidades[editando] = aPack(estado.cantidades[editando], datos.pack);
    } else {
      estado.platos.push({ id: 'p-' + Date.now().toString(36), ...datos });
    }
    guardar();
    limpiarForm();
    renderListaPlatos();
  });

  function renderListaPlatos() {
    $('[data-lista-platos]').innerHTML = CATEGORIAS.map(cat => {
      const platos = platosDe(cat.id);
      const filas = platos.map(p => `<tr>
          <td><strong>${esc(p.nombre)}</strong>${p.descripcion ? `<br><small>${esc(p.descripcion)}</small>` : ''}</td>
          <td class="num">${p.pack}</td>
          <td class="num">${pesos(p.costo)}</td>
          <td class="num">${pesos(p.precio)}</td>
          <td class="num ${p.precio < p.costo ? 'negativo' : ''}">${porc(margen(p))}</td>
          <td class="acciones"><button type="button" class="enlace-boton" data-editar="${esc(p.id)}">Editar</button>
            <button type="button" class="enlace-boton enlace-boton--peligro" data-eliminar="${esc(p.id)}">Eliminar</button></td>
        </tr>`).join('');
      return `<section class="lista-cat"><h2>${cat.nombre} <small>${platos.length}</small></h2>
        ${platos.length ? `<div class="tabla-scroll"><table class="tabla-platos">
          <thead><tr><th>Plato</th><th class="num">De a</th><th class="num">Compra</th><th class="num">Venta</th><th class="num">Margen</th><th></th></tr></thead>
          <tbody>${filas}</tbody></table></div>` : '<p class="vacio">Sin platos todavía.</p>'}
      </section>`;
    }).join('');
  }

  $('[data-lista-platos]').addEventListener('click', e => {
    const editar = e.target.closest('[data-editar]');
    const eliminar = e.target.closest('[data-eliminar]');
    if (editar) {
      const p = plato(editar.dataset.editar);
      editando = p.id;
      ['nombre', 'descripcion', 'categoria', 'costo', 'precio', 'pack'].forEach(k => { form[k].value = p[k]; });
      $('[data-form-titulo]').textContent = 'Editar plato';
      $('[data-form-guardar]').textContent = 'Guardar cambios';
      $('[data-form-cancelar]').hidden = false;
      vistaMargen();
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
      form.nombre.focus({ preventScroll: true });
    } else if (eliminar) {
      const p = plato(eliminar.dataset.eliminar);
      if (!confirm(`¿Eliminar "${p.nombre}"?`)) return;
      estado.platos = estado.platos.filter(x => x.id !== p.id);
      delete estado.cantidades[p.id];
      if (estado.principalId === p.id) estado.principalId = null;
      if (editando === p.id) limpiarForm();
      guardar();
      renderListaPlatos();
    }
  });

  $('[data-restablecer]').addEventListener('click', () => {
    if (!confirm('Se borran los platos que cargaste y la selección actual, y vuelven los platos de ejemplo. ¿Continuar?')) return;
    estado = estadoInicial();
    guardar();
    cargarEvento();
    limpiarForm();
    renderListaPlatos();
  });

  // ---------- Inicio ----------
  cargarEvento();
  irA(location.hash === '#platos' ? 'platos' : 'armar');
})();
