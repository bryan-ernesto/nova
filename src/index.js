/* eslint-disable camelcase */
const http = require('http');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
const jwt = require('express-jwt');
const ActiveDirectory = require('activedirectory');
const { getConnNova, getConnGroupNova } = require('./conn/bdd');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const secret = { secret: process.env.SECRET || 'secret' };
const server = http.createServer(app);

function validateIpAndHost(req, res, next) {
  const allowedIps = ['127.0.0.1', '192.168.1.1', '192.168.0.8'];
  const allowedHosts = ['example.com', 'localhost', '::ffff:192.168.2.83'];
  const { hostname } = req.body;
  const { ip } = req.body;

  if (allowedIps.includes(ip) && allowedHosts.includes(hostname)) {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden' });
  }
}

/*
  Nombre: TESTER
  Descripción: Realiza una prueba de API para ver si la conexion es correcta

  Fecha creación: 27-Feb-2023
  Fecha modificación: 27-Feb-2023
  Creado por: carlos.vicente@groupnova.com.gt
  Modificado por: carlos.vicente@groupnova.com.gt
*/
app.post('/api/tester', async (req, res) => {
  res.send('success go home');
});

/*
  Nombre: GET USER
  Descripción: Obtiene a todos los usuarios del NOVA

  Fecha creación: 27-Feb-2023
  Fecha modificación: 27-Feb-2023
  Creado por: carlos.vicente@groupnova.com.gt
  Modificado por: carlos.vicente@groupnova.com.gt
*/
app.post('/api/users', validateIpAndHost, async (req, res) => {
  const response = await getConnNova.query('select * from nova.users u');
  res.status(200).json(response.rows);
});

/*
  Nombre: Get_ValidateStatusUser
  Descripción: Valida si las credenciales del usuario son validas en el AD (Active Directory)

  Fecha creación: 27-Feb-2023
  Fecha modificación: 27-Feb-2023
  Creado por: carlos.vicente@groupnova.com.gt
  Modificado por: carlos.vicente@groupnova.com.gt
*/
app.post('/api/AD/Get_validate_status_user', (req, res) => {
  const username = `${req.body.username}@novales.com.gt`;
  const { password } = req.body;

  const config = {
    url: 'ldap://SRVDC01.novales.com.gt:389',
    baseDN: 'DC=novales,DC=com,DC=gt',
    username,
    password,
  };

  try {
    const ad = new ActiveDirectory(config);

    ad.authenticate(username, password, (err, auth) => {
      if (err) {
        res.json({ authenticated: false });
      }

      if (auth) {
        res.json({ authenticated: true });
      } else {
        res.json({ authenticated: false });
      }
    });
  } catch (err) {
    res.send('Ha ocurrido un error al momento de procesar la consulta');
  }
});

/*
  ////////////////////////////////////////////////// TICKETS - Init
*/
/*
  Nombre: Get_TicketAll
  Descripción: Obtiene todos los tickets que se encuentren en tbl_bit_ticket

  Fecha creación: 27-Feb-2023
  Fecha modificación: 27-Feb-2023
  Creado por: carlos.vicente@groupnova.com.gt
  Modificado por: carlos.vicente@groupnova.com.gt
*/
app.post('/api/nova_ticket/get_ticket_all', async (req, res) => {
  const {
    string_nombre_referencia,
    int_id_prioridad,
    int_estado_resolucion,
    int_id_proceso,
    int_id_cat_tipo,
    int_id_cat_canal,
    int_id_cat_equipo,
    int_id_cat_seguimiento,
    int_id_cat_responsable,
    int_id_cat_solicitante,
    int_id_cat_creado_por,
    date_asignacion_inicio,
    date_asignacion_fin,
    date_resolucion_inicio,
    date_resolucion_fin,
    date_ultima_vista_inicio,
    date_ultima_vista_fin,
    date_vencimiento_inicio,
    date_vencimiento_fin,
    date_primera_respuesta_inicio,
    date_primera_respuesta_fin,
    date_creacion_inicio,
    date_creacion_fin,
    date_actualizacion_inicio,
    date_actualizacion_fin,
  } = req.body;
  const response = await getConnGroupNova.query('SELECT * from usuarios.get_ticket_all($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25)', [string_nombre_referencia, int_id_prioridad, int_estado_resolucion, int_id_proceso, int_id_cat_tipo, int_id_cat_canal, int_id_cat_equipo, int_id_cat_seguimiento, int_id_cat_responsable, int_id_cat_solicitante, int_id_cat_creado_por, date_asignacion_inicio, date_asignacion_fin, date_resolucion_inicio, date_resolucion_fin, date_ultima_vista_inicio, date_ultima_vista_fin, date_vencimiento_inicio, date_vencimiento_fin, date_primera_respuesta_inicio, date_primera_respuesta_fin, date_creacion_inicio, date_creacion_fin, date_actualizacion_inicio, date_actualizacion_fin]);

  res.status(200).json(response.rows);
});

/*
  Nombre: Post_TicketPrimario
  Descripción: Inserta un nuevo ticket primario en la tabla tbl_bit_ticket y genera su correlativo

  Fecha creación: 27-Feb-2023
  Fecha modificación: 28-Feb-2023
  Creado por: carlos.vicente@groupnova.com.gt
  Modificado por: carlos.vicente@groupnova.com.gt
*/
app.post('/api/nova_ticket/Set_Ticket', async (req, res) => {
  const {
    str_resumen,
    str_descripcion,
    int_id_cat_equipo,
    int_id_estado_proceso,
    int_estado_resolucion,
    int_id_responsable,
    int_id_solicitante,
    int_id_cat_proceso,
    int_id_ticket_canal,
    int_id_ticket_prioridad,
    int_estado,
    int_creado_por,
    int_actualizado_por,
  } = req.body;
  const response = await getConnGroupNova.query('SELECT nova_ticket.add_ticket_primario($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)', [str_resumen, str_descripcion, int_id_cat_equipo, int_id_estado_proceso, int_estado_resolucion, int_id_responsable, null, int_id_solicitante, int_id_cat_proceso, int_id_ticket_canal, int_id_ticket_prioridad, int_estado, int_creado_por, int_actualizado_por]);
  res.status(200).json(response.rows);
});

/*
  Nombre: Post_TicketSecundario
  Descripción: Inserta un nuevo ticket secundario en la tabla tbl_bit_ticket y genera su correlativo

  Fecha creación: 27-Feb-2023
  Fecha modificación: 27-Feb-2023
  Creado por: carlos.vicente@groupnova.com.gt
  Modificado por: carlos.vicente@groupnova.com.gt
*/
app.post('/api/nova_ticket/Set_Subticket', async (req, res) => {
  const {
    str_resumen,
    str_descripcion,
    int_id_cat_equipo,
    int_id_estado_proceso,
    int_estado_resolucion,
    int_id_responsable,
    str_ref_ticket_padre,
    int_id_solicitante,
    int_id_cat_proceso,
    int_id_ticket_canal,
    int_id_ticket_prioridad,
    int_estado,
    int_creado_por,
    int_actualizado_por,
  } = req.body;
  await getConnGroupNova.query('CALL nova_ticket.sp_set_subticket($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14);', [str_resumen, str_descripcion, int_id_cat_equipo, int_id_estado_proceso, int_estado_resolucion, int_id_responsable, str_ref_ticket_padre, int_id_solicitante, int_id_cat_proceso, int_id_ticket_canal, int_id_ticket_prioridad, int_estado, int_creado_por, int_actualizado_por]);

  res.send('SubTicket creado correctamente');
});

/*
  Nombre: Get_TicketPorUsuario
  Descripción: Obtiene los registros de los tickets en base a el id del usuario y tipo de ticket

  Fecha creación: 27-Feb-2023
  Fecha modificación: 27-Feb-2023
  Creado por: carlos.vicente@groupnova.com.gt
  Modificado por: carlos.vicente@groupnova.com.gt
*/
app.post('/api/nova_ticket/Get_ticket_por_usuario', async (req, res) => {
  // Get_ticket_por_usuario
  const { int_id_cat_tipo, int_creado_por } = req.body;
  const response = await getConnGroupNova.query('SELECT * from nova_ticket.get_referencia_ticket_creado($1,$2);', [int_id_cat_tipo, int_creado_por]);

  res.status(200).json(response.rows);
});

/*
  Nombre: Post_TicketPrimario
  Descripción: Inserta un nuevo ticket en la tabla tbl_bit_ticket y genera su correlativo

  Fecha creación: 27-Feb-2023
  Fecha modificación: 27-Feb-2023
  Creado por: carlos.vicente@groupnova.com.gt
  Modificado por: carlos.vicente@groupnova.com.gt
*/
app.get('/api/comentarios', async (req, res) => {
  const response = await getConnGroupNova.query('select tbtc.descripcion  from nova_proceso_tarea.tbl_bit_tarea_comentario tbtc join nova_proceso_tarea.tbl_bit_tarea_registro tbtr  on tbtr.id_bit_tarea_registro  = tbtc.id_bit_tarea_registro  where tbtr.id_cat_usuario  = 1');
  res.status(200).json(response.rows);
});

// get perfiles por usuario
app.post('/api/perfiles', jwt(secret), async (req, res) => {
  if (req.user.admin) {
    const { id_cat_usuario } = req.body;
    const response = await getConnGroupNova.query("select tcp.id_cat_puesto , tcp.nombre , tduap.predeterminado  from usuarios.tbl_det_usuario_asignacion_puesto tduap join usuarios.tbl_cat_usuario tcu on tduap.id_cat_usuario  = tcu.id_cat_usuario join usuarios.tbl_det_puesto_asignacion_equipo tdpae on tdpae.id_det_puesto_asignacion_equipo = tduap.id_det_puesto_asignacion_equipo join usuarios.tbl_cat_puesto tcp on tcp.id_cat_puesto  = tdpae.id_cat_puesto where tcu.id_cat_usuario  = $1 and (tduap.predeterminado  = '1' or tduap.predeterminado = '0')", [id_cat_usuario]);
    res.status(200).json(response.rows);
  }
  res.status(401);
});

// get usuario
app.post('/api/usuario_existe', jwt(secret), async (req, res) => {
  if (req.user.admin) {
    const { user_principal_name } = req.body;
    const response = await getConnGroupNova.query("select tcu.id_cat_usuario,tcu.estado  from usuarios.tbl_cat_usuario tcu  where tcu.user_principal_name = $1 and tcu.estado = '1'", [user_principal_name]);
    res.status(200).json(response.rows);
  }
  res.status(401);
});

// get dispositivo por hostname, ip
app.post('/api/dispositivo_ip_hostname', jwt(secret), async (req, res) => {
  if (req.user.admin) {
    const { hostname, ip } = req.body;
    const response = await getConnGroupNova.query('SELECT id_cat_dispositivo, hostname, ip, sistema_operativo, cpu_nombre, disco_primario_total, disco_primario_tipo, ram_total, product_id, ultimo_logueo, estado, fecha_creacion, fecha_actualizacion, creado_por, modificado_por FROM nova_dispositivo.tbl_cat_dispositivo where hostname=$1 and ip=$2', [hostname, ip]);
    res.status(200).json(response.rows);
  }
  res.status(401);
});

// add estado dispositivo
app.post('/api/dispositivo_bit_add', jwt(secret), async (req, res) => {
  if (req.user.admin) {
    const {
      id_cat_dispositivo,
      in_cpu_uso,
      in_cpu_tiempo_activo,
      in_cpu_tiempo_activo_dia,
      in_ram_disponible_mb,
      in_disco_disponible_mb,
      in_internet_descarga_mb,
      in_internet_carga_mb,
      in_internet_latencia_descarga_ms,
      in_internet_latencia_carga_ms,
      in_creado_por,
      in_actualizado_por,
    } = req.body;
    await getConnGroupNova.query('CALL nova_dispositivo.sp_bit_dispositivo_diagnostico_add($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12);', [id_cat_dispositivo, in_cpu_uso, in_cpu_tiempo_activo, in_cpu_tiempo_activo_dia, in_ram_disponible_mb, in_disco_disponible_mb, in_internet_descarga_mb, in_internet_carga_mb, in_internet_latencia_descarga_ms, in_internet_latencia_carga_ms, in_creado_por, in_actualizado_por]);
    res.send('Agregado correctamente a la bitacora');
  }
  res.status(401);
});

// obtiene todos los dispositivos
app.get('/api/dispositivo_all', jwt(secret), async (req, res) => {
  if (req.user.admin) {
    const response = await getConnGroupNova.query('SELECT id_cat_dispositivo, hostname, ip, sistema_operativo, cpu_nombre, disco_primario_total, disco_primario_tipo, ram_total, product_id, ultimo_logueo, estado, fecha_creacion, fecha_actualizacion, creado_por, modificado_por FROM nova_dispositivo.tbl_cat_dispositivo');
    res.status(200).json(response.rows);
  }
  res.status(401);
});

// agregar dispositivo
app.post('/api/dispositivo_add', jwt(secret), async (req, res) => {
  if (req.user.admin) {
    const {
      hostname,
      ip,
      sistema_operativo,
      cpu,
      disco_primario_total,
      disco_primario_tipo,
      ram_total,
      product_id,
      ultimo_logueo,
      estado,
      fecha_actualizacion,
      creado_por,
      modificado_por,
    } = req.body;
    await getConnGroupNova.query('CALL nova_dispositivo.sp_tbl_cat_dispositivo_add($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)', [hostname, ip, sistema_operativo, cpu, disco_primario_total, disco_primario_tipo, ram_total, product_id, ultimo_logueo, estado, fecha_actualizacion, creado_por, modificado_por]);

    res.send('Dispositivo creado');
  }
  res.status(401);
});

// Actualiza el dispositivo
app.put('/api/dispositivo_upd', jwt(secret), async (req, res) => {
  if (req.user.admin) {
    const {
      hostname,
      ip,
      ultimo_logueo,
      modificado_por,
    } = req.body;
    await getConnGroupNova.query('CALL nova_dispositivo.sp_tbl_cat_dispositivo_upd($1,$2,$3,$4)', [hostname, ip, ultimo_logueo, modificado_por]);

    res.send('Dispositivo actualizado');
  }
  res.status(401);
});

/// /Apis que pertenecen a aplicaciones
// add aplicacion
app.post('/api/nova_aplicacion/app_add', jwt(secret), async (req, res) => {
  if (req.user.admin) {
    const {
      str_nombre, str_descripcion, int_estado, int_creado_por, int_modificado_por,
    } = req.body;
    await getConnGroupNova.query('CALL nova_aplicacion.sp_nova_aplicacion_add($1,$2,$3,$4,$5);', [str_nombre, str_descripcion, int_estado, int_creado_por, int_modificado_por]);
    res.send('Aplicacion agregada correctamente');
  }
  res.status(401);
});

// get all apps and filter
app.post('/api/nova_aplicacion/get_all_apps', jwt(secret), async (req, res) => {
  if (req.user.admin) {
    const {
      int_cat_aplicacion,
      str_nombre,
      int_estado,
      int_creado_por,
      int_modificado_por,
      str_fecha_creacion_i,
      str_fecha_actualizacion_f,
    } = req.body;
    const response = await getConnGroupNova.query('SELECT * from nova_aplicacion.get_aplicacion_all($1,$2,$3,$4,$5,$6,$7);', [int_cat_aplicacion, str_nombre, int_estado, int_creado_por, int_modificado_por, str_fecha_creacion_i, str_fecha_actualizacion_f]);
    res.status(200).json(response.rows);
  }
  res.status(401);
});

// add aplicacion registro add
// Agregado el 05/01/2023 - EIPEREZ
// Modificado el
app.post('/api/nova_aplicacion/registros_app_add', jwt(secret), async (req, res) => {
  if (req.user.admin) {
    const {
      int_id_cat_usuario,
      int_id_cat_aplicacion,
      int_estado,
      int_creado_por,
      int_modificado_por,
      int_id_bit_tarea_registro,
      str_descripcion,
    } = req.body;
    await getConnGroupNova.query('CALL nova_aplicacion.sp_bit_aplicacion_registro_add($1,$2,$3,$4,$5,$6,$7);', [int_id_cat_usuario, int_id_cat_aplicacion, int_estado, int_creado_por, int_modificado_por, int_id_bit_tarea_registro, str_descripcion]);
    res.send('Aplicacion de la app agregada correctamente');
  }
  res.status(401);
});
/// /Apis que pertenecen a aplicaciones

/// /Apis que pertenecen a equipos inicio
// get puesto asignacion equipo

/*
  Nombre: Post_Usuario
  Descripción: Inserta un nuevo usuario en la tabla tbl_cat_usuario

  Fecha creación: 28-Feb-2023
  Fecha modificación: 28-Feb-2023
  Creado por: carlos.vicente@groupnova.com.gt
  Modificado por: carlos.vicente@groupnova.com.gt
*/
app.post('/api/usuarios/Post_Usuario', async (req, res) => {
  const {
    str_nombre,
    str_id_ad,
    str_correo,
    int_creado_por,
    str_user_principal_name,
    bit_apagado_automatico,
    int_telefono,
    int_codigo_pais,
    int_id_cat_usuario_dominio,
    int_tipo_usuario,
    int_id_cat_usuario_categoria,
    str_username,
  } = req.body;
  const response = await getConnGroupNova.query('SELECT * FROM usuarios.add_usuario($1,$2,$3,$4,$5,B$6,$7,$8,$9,$10,$11,$12)', [str_nombre, str_id_ad, str_correo, int_creado_por, str_user_principal_name, bit_apagado_automatico, int_telefono, int_codigo_pais, int_id_cat_usuario_dominio, int_tipo_usuario, int_id_cat_usuario_categoria, str_username]);
  res.status(200).json(response.rows);
});

/// Get_Puestos
// Agregado el 10/01/2023 - EIPEREZ
// Modificado el
app.post('/api/usuarios/Get_Puestos', async (req, res) => {
  const { str_puesto_nombre, int_creado_por, int_actualizado_por } = req.body;
  const response = await getConnGroupNova.query('SELECT * from usuarios.get_puestos($1,$2,$3);', [str_puesto_nombre, int_creado_por, int_actualizado_por]);
  res.status(200).json(response.rows);
});

/// Get_Puestos_Equipo
// Agregado el 10/01/2023 - EIPEREZ
// Modificado el
app.post('/api/usuarios/Get_Puestos_Equipo', async (req, res) => {
  const { int_id_cat_puesto } = req.body;
  const response = await getConnGroupNova.query('SELECT * from usuarios.get_asignacion_equipo($1);', [int_id_cat_puesto]);
  res.status(200).json(response.rows);
});

/// Get_Equipos
// Agregado el 11/01/2023 - EIPEREZ
// Modificado el
app.post('/api/usuarios/Get_Equipos', async (req, res) => {
  const {
    str_equipo_nombre, int_id_cat_departamento, int_creado_por, int_actualizado_por,
  } = req.body;
  const response = await getConnGroupNova.query('SELECT * from usuarios.get_equipos($1,$2,$3,$4);', [str_equipo_nombre, int_id_cat_departamento, int_creado_por, int_actualizado_por]);
  res.status(200).json(response.rows);
});

/// Get_Equipo_Responsable
// Agregado el 11/01/2023 - EIPEREZ
// Modificado el
app.post('/api/usuarios/Get_Equipo_Responsable', async (req, res) => {
  const { int_id_cat_usuario, int_cat_equipo } = req.body;
  const response = await getConnGroupNova.query('SELECT * from usuarios.get_equipo_responsable($1,$2);', [int_id_cat_usuario, int_cat_equipo]);
  res.status(200).json(response.rows);
});

/// Get_Equipo_Usuarios
// Agregado el 11/01/2023 - EIPEREZ
// Modificado el
app.post('/api/usuarios/Get_Equipo_Usuarios', async (req, res) => {
  const { int_id_cat_usuario, int_cat_equipo } = req.body;
  const response = await getConnGroupNova.query('SELECT * from usuarios.get_equipo_usuario($1,$2);', [int_id_cat_usuario, int_cat_equipo]);
  res.status(200).json(response.rows);
});

/// /Apis que pertenecen a usuarios inicio
// Agregado el 11/01/2023 - EIPEREZ
// Get_Usuarios
// Modificado el
app.post('/api/usuarios/Get_usuarios', async (req, res) => {
  const {
    str_usuario_nombre, int_creado_por, int_actualizado_por, str_username,
  } = req.body;
  const response = await getConnGroupNova.query('SELECT * from usuarios.get_usuarios($1,$2,$3,$4);', [str_usuario_nombre, int_creado_por, int_actualizado_por, str_username]);
  res.status(200).json(response.rows);
});

// Agregado el 11/01/2023 - EIPEREZ
// Get_Usuario_Puestos
// Modificado el
app.post('/api/usuarios/Get_usuario_puestos', async (req, res) => {
  const { int_id_cat_usuario, predeterminado } = req.body;
  const response = await getConnGroupNova.query('SELECT * from usuarios.get_usuario_puestos($1,$2);', [int_id_cat_usuario, predeterminado]);
  res.status(200).json(response.rows);
});

/// /Apis que pertenecen a usuarios fin

/// /Apis que pertenecen a ajuste presupuesto inicio
// Agregado el 10/01/2023 - EIPEREZ
/*
Esta api registra el ajuste del presupuesto tambien realiza el ajuste entre el abono y
el cargo en base al id de la cuenta
*/
// Modificado el
app.post('/api/compras_presupuesto/PostAjustePresupuesto', async (req, res) => {
  const {
    det_presupuesto_id, mes, cuenta_abono_id, cuenta_cargo_id, monto, justificacion, creado_por,
  } = req.body;
  await getConnGroupNova.query('CALL compras_presupuesto.sp_bit_presupuesto_ajuste_add($1,$2,$3,$4,$5,$6,$7);', [det_presupuesto_id, mes, cuenta_abono_id, cuenta_cargo_id, monto, justificacion, creado_por]);
  res.send('Ajuste agregado correctamente');
});

// Agregado el 08/02/2023 - EIPEREZ
// Esta api obtiene el detalle del presupuesto tambien contiene filtros
// Modificado el
app.post('/api/compras_presupuesto/GetDetallePresupuesto', async (req, res) => {
  const { id_cat_presupuesto } = req.body;
  const response = await getConnGroupNova.query('SELECT * from compras_presupuesto.get_detalle_presupuesto($1);', [id_cat_presupuesto]);
  res.status(200).json(response.rows);
});

// Agregado el 08/02/2023 - EIPEREZ
// Esta api obtiene todos los ajustes que se han realizado tambien contiene filtros
// Modificado el
app.post('/api/compras_presupuesto/GetAjustePresupuesto', async (req, res) => {
  const {
    cuenta_abono_id, cuenta_cargo_id, presupuesto_id, creado_por, actualizado_por,
  } = req.body;
  const response = await getConnGroupNova.query('SELECT * from compras_presupuesto.get_bit_presupuesto_ajuste($1,$2,$3,$4,$5);', [cuenta_abono_id, cuenta_cargo_id, presupuesto_id, creado_por, actualizado_por]);
  res.status(200).json(response.rows);
});

/// /Apis que pertenecen a ajuste presupuesto fin

/// /Apis que pertenecen a cuentas clasificacion inicio
// Agregado el 19/02/2023 - EIPEREZ
// Esta api almacena la clasificacion de la cuenta PostCuentaClasificacion
// Modificado el
app.post('/api/compras_cuenta/PostCuentaClasificacion', async (req, res) => {
  const { nombre, creado_por } = req.body;
  await getConnGroupNova.query('CALL compras_cuenta.sp_tbl_cat_cuenta_clasificacion_add($1,$2);', [nombre, creado_por]);
  res.send('Cuenta clasificacion agregada correctamente');
});

// Agregado el 19/02/2023 - EIPEREZ
// Esta api obtiene toda la informacion de las cuentas de la clasificacion
// Modificado el
app.post('/api/compras_cuenta/GetCuentaClasificacion', async (req, res) => {
  const { cuenta_clasficacion_nombre, creado_por, actualizado_por } = req.body;
  const response = await getConnGroupNova.query('SELECT * from compras_cuenta.get_cuenta_clasificacion($1,$2,$3);', [cuenta_clasficacion_nombre, creado_por, actualizado_por]);
  res.status(200).json(response.rows);
});

// Agregado el 19/02/2023 - EIPEREZ
// Esta api actualiza el registro por id de la cuenta clasificacion
// Modificado el
app.put('/api/compras_cuenta/UpdateCuentaClasificacion', async (req, res) => {
  const {
    clasificacion_id, nombre, estado, actualizado_por,
  } = req.body;
  await getConnGroupNova.query('CALL compras_cuenta.sp_tbl_cat_cuenta_clasificacion_update($1,$2,$3,$4);', [clasificacion_id, nombre, estado, actualizado_por]);
  res.send('Cuenta clasificacion actualizada correctamente');
});

/// /Apis que pertenecen a cuentas clasificacion inicio

/// /Apis que pertenecen a cuentas inicio
// Agregado el 19/02/2023 - EIPEREZ
// Esta api registra una nueva cuenta
// Modificado el
app.post('/api/compras_cuenta/PostCuenta', async (req, res) => {
  const {
    clasificacion_id, nombre, descripcion, creado_por,
  } = req.body;
  await getConnGroupNova.query('CALL compras_cuenta.sp_tbl_cat_cuenta_add($1,$2,$3,$4);', [clasificacion_id, nombre, descripcion, creado_por]);
  res.send('Cuenta agregada correctamente');
});

// Agregado el 19/02/2023 - EIPEREZ
// Esta api actualiza una cuenta por id
// Modificado el
app.put('/api/compras_cuenta/UpdateCuenta', async (req, res) => {
  const {
    cuenta_id, clasificacion_id, nombre, descripcion, estado, actualizado_por,
  } = req.body;
  await getConnGroupNova.query('CALL compras_cuenta.sp_tbl_cat_cuenta_update($1,$2,$3,$4,$5,$6);', [cuenta_id, clasificacion_id, nombre, descripcion, estado, actualizado_por]);
  res.send('Cuenta actualizada correctamente');
});

// Agregado el 19/02/2023 - EIPEREZ
// Esta api obtiene todos los registros de la tabla get_cuenta
// Modificado el
app.post('/api/compras_cuenta/GetCuenta', async (req, res) => {
  const {
    cuenta_nombre, clasificacion_id, id_creado_por, id_actualizado_por,
  } = req.body;
  const response = await getConnGroupNova.query('SELECT * from compras_cuenta.get_cuenta($1,$2,$3,$4);', [cuenta_nombre, clasificacion_id, id_creado_por, id_actualizado_por]);
  res.status(200).json(response.rows);
});

/// /Apis que pertenecen a cuentas inicio

/// /Apis que pertenecen a equipos fin

/// /Apis que pertenecen a empresas inicio
// Agregado el 10/01/2023 - EIPEREZ
// get_empresas
// Modificado el
app.post('/api/usuarios/Get_empresas', async (req, res) => {
  const { str_empresa_nombre, int_creado_por, int_actualizado_por } = req.body;
  const response = await getConnGroupNova.query('SELECT * from usuarios.get_empresas($1,$2,$3);', [str_empresa_nombre, int_creado_por, int_actualizado_por]);
  res.status(200).json(response.rows);
});

// Agregado el 10/01/2023 - EIPEREZ
// get_empresa_responsable
// Modificado el
app.post('/api/usuarios/Get_empresa_responsable', async (req, res) => {
  const { int_id_cat_usuario, int_id_cat_empresa } = req.body;
  const response = await getConnGroupNova.query('SELECT * from usuarios.get_empresa_responsable($1,$2);', [int_id_cat_usuario, int_id_cat_empresa]);
  res.status(200).json(response.rows);
});

/// /Apis que pertenecen a empresas fin

/// /Apis que pertenecen a comentarios inicio

// Agregado el 12/01/2023 - EIPEREZ
// Add_Comentario_Tarea
// Modificado el
app.post('/api/usuarios/Add_Comentario_Tarea', jwt(secret), async (req, res) => {
  if (req.user.admin) {
    const {
      int_id_bit_tarea_registro, str_descripcion, int_estado, int_id_cat_usuario,
    } = req.body;
    await getConnGroupNova.query('CALL nova_proceso_tarea.sp_tbl_cat_comentario_add($1,$2,$3,$4);', [int_id_bit_tarea_registro, str_descripcion, int_estado, int_id_cat_usuario]);
    res.send('Comentario agregado correctamente');
  }
  res.status(401);
});

/// /Apis que pertenecen a comentarios fin

/// /Apis que pertenecen a departamentos inicio
// Agregado el 10/01/2023 - EIPEREZ
// get_departamentos
// Modificado el
app.post('/api/usuarios/Get_departamentos', async (req, res) => {
  const {
    str_departamento_nombre, int_creado_por, int_actualizado_por, int_id_cat_empresa,
  } = req.body;
  const response = await getConnGroupNova.query('SELECT * from usuarios.get_departamentos($1,$2,$3,$4);', [str_departamento_nombre, int_creado_por, int_actualizado_por, int_id_cat_empresa]);
  res.status(200).json(response.rows);
});

// Agregado el 10/01/2023 - EIPEREZ
// get_departamento_responsable
// Modificado el
app.post('/api/usuarios/Get_departamento_responsable', async (req, res) => {
  const { int_id_cat_departamento } = req.body;
  const response = await getConnGroupNova.query('SELECT * from usuarios.get_departamento_responsable($1);', [int_id_cat_departamento]);
  res.status(200).json(response.rows);
});

/// /Apis que pertenecen a departamentos fin

/// /Apis que pertenecen a las tareas inicio

// get tareas por puesto y por usuario
// Agregado el 05/01/2023 - EIPEREZ
// Modificado el
app.post('/api/nova_proceso_tarea/get_tareas', jwt(secret), async (req, res) => {
  if (req.user.admin) {
    const { id_cat_usuario, id_cat_puesto } = req.body;
    const response = await getConnGroupNova.query('SELECT tdpap.id_det_proceso_asignacion_puesto,tcp.id_cat_puesto,tct.id_cat_tarea,tct.nombre,tct.descripcion,tcp.nombre AS nombre_puesto,tcp2.nombre  as nombre_proceso FROM nova_proceso_tarea.tbl_det_proceso_asignacion_puesto tdpap JOIN usuarios.tbl_cat_puesto tcp ON tcp.id_cat_puesto = tdpap.id_cat_puesto JOIN nova_proceso_tarea.tbl_cat_tarea tct ON tct.id_cat_proceso = tdpap.id_cat_proceso JOIN nova_proceso_tarea.tbl_cat_proceso tcp2 ON tcp2.id_cat_proceso = tdpap.id_cat_proceso JOIN usuarios.tbl_det_puesto_asignacion_equipo tdpae ON tdpae.id_cat_puesto = tcp.id_cat_puesto JOIN usuarios.tbl_det_usuario_asignacion_puesto tduap ON tduap.id_det_puesto_asignacion_equipo = tdpae.id_det_puesto_asignacion_equipo WHERE tdpap.id_cat_puesto = $2 AND tduap.id_cat_usuario = $1', [id_cat_usuario, id_cat_puesto]);
    res.status(200).json(response.rows);
  }
  res.status(401);
});

// add tareas bit registro
// Agregado el 05/01/2023 - EIPEREZ
// Modificado el
app.post('/api/nova_proceso_tarea/registros_tareas_add', jwt(secret), async (req, res) => {
  if (req.user.admin) {
    const {
      int_id_cat_usuario,
      int_id_cat_tarea_estado,
      int_id_cat_tarea,
      dt_fecha,
      int_estado,
      int_creado_por,
      int_modificado_por,
    } = req.body;
    await getConnGroupNova.query('CALL nova_proceso_tarea.sp_bit_tarea_registro_add($1,$2,$3,$4,$5,$6,$7);', [int_id_cat_usuario, int_id_cat_tarea_estado, int_id_cat_tarea, dt_fecha, int_estado, int_creado_por, int_modificado_por]);
    res.send('Tarea iniciada correctamente');
  }
  res.status(401);
});

// upd tareas bit registro
// Agregado el 09/01/2023 - EIPEREZ
// Modificado el
app.put('/api/nova_proceso_tarea/proceso_tarea_fin_upd', jwt(secret), async (req, res) => {
  if (req.user.admin) {
    const { int_id_cat_usuario, int_id_bit_tarea_registro } = req.body;
    await getConnGroupNova.query('CALL nova_proceso_tarea.sp_bit_proceso_tarea_fin_upd($1,$2);', [int_id_cat_usuario, int_id_bit_tarea_registro]);
    res.send('Tarea actualizada correctamente');
  }
  res.status(401);
});

// obtiene el total de tareas que estan en proceso en base al usuario
// Agregado el 11/01/2023 - EIPEREZ
// Modificado el
app.post('/api/nova_proceso_tarea/Get_count_tareas_activas', jwt(secret), async (req, res) => {
  if (req.user.admin) {
    const { int_id_cat_usuario } = req.body;
    const response = await getConnGroupNova.query('SELECT * from nova_proceso_tarea.get_count_tareas_activas($1);', [int_id_cat_usuario]);
    res.status(200).json(response.rows);
  }
  res.status(401);
});

// obtiene el total de tiempo que se invierte por tarea esto se obtiene del dia en curso
// Agregado el 17/01/2023 - EIPEREZ
// Modificado el
app.post('/api/nova_proceso_tarea/Get_tiempo_activo_por_tarea', jwt(secret), async (req, res) => {
  if (req.user.admin) {
    const { int_id_cat_usuario, int_id_cat_tarea } = req.body;
    const response = await getConnGroupNova.query('SELECT * from nova_proceso_tarea.get_count_tiempo_activo_x_dia_actual($1,$2);', [int_id_cat_usuario, int_id_cat_tarea]);
    res.status(200).json(response.rows);
  }
  res.status(401);
});

// obtiene el total de tiempo que se invierte por tarea esto se obtiene del dia en curso
// Agregado el 18/01/2023 - EIPEREZ
// Modificado el
app.post('/api/nova_proceso_tarea/Get_tiempo_inactivo_por_usuario', jwt(secret), async (req, res) => {
  if (req.user.admin) {
    const { int_id_cat_usuario } = req.body;
    const response = await getConnGroupNova.query('SELECT * from nova_proceso_tarea.get_count_tiempo_inactivo_x_dia_actual_usuario($1);', [int_id_cat_usuario]);
    res.status(200).json(response.rows);
  }
  res.status(401);
});

/// /Apis que pertenecen a las tareas

/*
  ///////////////////////////////////////////////////////  COMPRAS - Init
*/

/// /Apis que pertenecen a la tabla compras_proveedor.tbl_cat_proveedor_tipo Inicio

// obtiene los registros de la tabla compras_proveedor.tbl_cat_proveedor_tipo - GetProveedorTipo
// Agregado el 22/02/2023 - EIPEREZ
// Modificado el
app.post('/api/compras_proveedor/GetProveedorTipo', async (req, res) => {
  const { nombre, creado_por, actualizado_por } = req.body;
  const response = await getConnGroupNova.query('SELECT * from compras_proveedor.get_cat_proveedor_tipo($1,$2,$3);', [nombre, creado_por, actualizado_por]);
  res.status(200).json(response.rows);
});

/*
almacena un nuevo registro en la tabla
compras_proveedor.tbl_cat_proveedor_tipo - PostProveedorTipo
*/
// Agregado el 22/02/2023 - EIPEREZ
// Modificado el
app.post('/api/compras_proveedor/PostProveedorTipo', async (req, res) => {
  const { nombre, creado_por } = req.body;
  await getConnGroupNova.query('CALL compras_proveedor.sp_tbl_cat_proveedor_tipo_add($1,$2);', [nombre, creado_por]);
  res.send('Tipo proveedor agregado correctamente');
});

// actualiza un registro en la tabla compras_proveedor.tbl_cat_proveedor_tipo - UpdateProveedorTipo
// Agregado el 22/02/2023 - EIPEREZ
// Modificado el
app.put('/api/compras_proveedor/UpdateProveedorTipo', async (req, res) => {
  const {
    tipo_id, nombre, estado, actualizado_por,
  } = req.body;
  await getConnGroupNova.query('CALL compras_proveedor.sp_tbl_cat_proveedor_tipo_update($1,$2,$3,$4);', [tipo_id, nombre, estado, actualizado_por]);
  res.send('Tipo proveedor actualizado correctamente');
});

// obtiene los registros de la tabla compras_proveedor.tbl_cat_proveedor_giro - GetProveedorGiro
// Agregado el 22/02/2023 - EIPEREZ
// Modificado el
app.post('/api/compras_proveedor/GetProveedorGiro', async (req, res) => {
  const { nombre, creado_por, actualizado_por } = req.body;
  const response = await getConnGroupNova.query('SELECT * from compras_proveedor.get_cat_proveedor_giro($1,$2,$3);', [nombre, creado_por, actualizado_por]);
  res.status(200).json(response.rows);
});

/*
almacena un nuevo registro en la tabla compras_proveedor.tbl_cat_proveedor_giro - PostProveedorGiro
*/
// Agregado el 22/02/2023 - EIPEREZ
// Modificado el
app.post('/api/compras_proveedor/PostProveedorGiro', async (req, res) => {
  const { nombre, descripcion, creado_por } = req.body;
  await getConnGroupNova.query('CALL compras_proveedor.sp_tbl_cat_proveedor_giro_add($1,$2,$3);', [nombre, descripcion, creado_por]);
  res.send('Giro proveedor agregado correctamente');
});

// actualiza un registro en la tabla compras_proveedor.tbl_cat_proveedor_giro - UpdateProveedorGiro
// Agregado el 22/02/2023 - EIPEREZ
// Modificado el
app.put('/api/compras_proveedor/UpdateProveedorGiro', async (req, res) => {
  const {
    giro_id, nombre, descripcion, estado, actualizado_por,
  } = req.body;
  await getConnGroupNova.query('CALL compras_proveedor.sp_tbl_cat_proveedor_giro_update($1,$2,$3,$4,$5);', [giro_id, nombre, descripcion, estado, actualizado_por]);
  res.send('Giro proveedor actualizado correctamente');
});

/// /Apis que pertenecen a la tabla compras_proveedor.tbl_cat_proveedor_giro Fin

/// /Apis que pertenecen a la tabla compras_proveedor.tbl_cat_proveedor Inicio

// obtiene los registros de la tabla compras_proveedor.tbl_cat_proveedor - GetProveedor
// Agregado el 22/02/2023 - EIPEREZ
// Modificado el
app.post('/api/compras_proveedor/GetProveedor', async (req, res) => {
  const {
    nombre, nit, correo, proveedor_tipo_id, proveedor_giro_id, creado_por, actualizado_por,
  } = req.body;
  const response = await getConnGroupNova.query('SELECT * from compras_proveedor.get_cat_proveedor($1,$2,$3,$4,$5,$6,$7);', [nombre, nit, correo, proveedor_tipo_id, proveedor_giro_id, creado_por, actualizado_por]);
  res.status(200).json(response.rows);
});

// almacena un nuevo registro en la tabla compras_proveedor.tbl_cat_proveedor - PostProveedor
// Agregado el 22/02/2023 - EIPEREZ
// Modificado el
app.post('/api/compras_proveedor/PostProveedor', async (req, res) => {
  const {
    giro_id, tipo_id, nombre, nit, email, telefono, celular, archivo, creado_por, usuario_id,
  } = req.body;
  await getConnGroupNova.query('CALL compras_proveedor.sp_tbl_cat_proveedor_add($1,$2,$3,$4,$5,$6,$7,$8,$9,$10);', [giro_id, tipo_id, nombre, nit, email, telefono, celular, archivo, creado_por, usuario_id]);
  res.send('Proveedor agregado correctamente');
});

// actualiza un registro en la tabla compras_proveedor.tbl_cat_proveedor - UpdateProveedor
// Agregado el 22/02/2023 - EIPEREZ
// Modificado el
app.put('/api/compras_proveedor/UpdateProveedor', async (req, res) => {
  const {
    proveedor_id,
    giro_id,
    tipo_id,
    nombre,
    nit,
    email,
    telefono,
    celular,
    rtu,
    estado,
    actualizado_por,
    id_cat_usuario,
  } = req.body;
  await getConnGroupNova.query('CALL compras_proveedor.sp_tbl_cat_proveedor_update($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12);', [proveedor_id, giro_id, tipo_id, nombre, nit, email, telefono, celular, rtu, estado, actualizado_por, id_cat_usuario]);
  res.send('Proveedor actualizado correctamente');
});

/// /Apis que pertenecen a la tabla compras_proveedor.tbl_cat_proveedor Fin

/// /Apis que pertenecen a las presupuesto estado

// obtiene los registros de la tabla de presupuesto estado - GetPresupuestoEstado
// Agregado el 03/02/2023 - EIPEREZ
// Modificado el
app.post('/api/compras_presupuesto/GetPresupuestoEstado', async (req, res) => {
  const { nombre, creado_por, actualizado_por } = req.body;
  const response = await getConnGroupNova.query('SELECT * from compras_presupuesto.get_presupuesto_estado($1,$2,$3);', [nombre, creado_por, actualizado_por]);
  res.status(200).json(response.rows);
});

// Agrega un nuevo registro a la tabla de presupuesto estado
// Agregado el 03/02/2023 - EIPEREZ
// Modificado el
app.post('/api/compras_presupuesto/PostPresupuestoEstado', async (req, res) => {
  const { nombre, descripcion, creado_por } = req.body;
  await getConnGroupNova.query('CALL compras_presupuesto.sp_cat_presupuesto_estado_add($1,$2,$3);', [nombre, descripcion, creado_por]);
  res.send('Estado agregado correctamente');
});

// actualiza el estado del presupuesto
// Agregado el 03/02/2023 - EIPEREZ
// Modificado el
app.put('/api/compras_presupuesto/UpdatePresupuestoEstado', async (req, res) => {
  const {
    estado_id, nombre, descripcion, estado, actualizado_por,
  } = req.body;
  await getConnGroupNova.query('CALL compras_presupuesto.sp_cat_presupuesto_estado_update($1,$2,$3,$4,$5);', [estado_id, nombre, descripcion, estado, actualizado_por]);
  res.send('Estado actualizado correctamente');
});

/// /Apis que pertenecen a las presupuesto estado

/// /Apis que pertenecen a las presupuesto
// obtiene los registros de la tabla de presupuesto estado - GetPresupuesto
// Agregado el 03/02/2023 - EIPEREZ
// Modificado el
app.post('/api/compras_presupuesto/GetPresupuesto', async (req, res) => {
  const {
    empresa_id, presupuesto_estado_id, creado_por, actualizado_por,
  } = req.body;
  const response = await getConnGroupNova.query('SELECT * from compras_presupuesto.get_presupuesto($1,$2,$3,$4);', [empresa_id, presupuesto_estado_id, creado_por, actualizado_por]);
  res.status(200).json(response.rows);
});

// Agrega un nuevo registro a la tabla de presupuesto - PostPresupuesto
// Agregado el 03/02/2023 - EIPEREZ
// Modificado el
app.post('/api/compras_presupuesto/PostPresupuesto', async (req, res) => {
  const {
    empresa_id, monto, año, responsable_id, presupuesto_estado_id, creado_por,
  } = req.body;
  await getConnGroupNova.query('CALL compras_presupuesto.sp_cat_presupuesto_add($1,$2,$3,$4,$5,$6);', [empresa_id, monto, año, responsable_id, presupuesto_estado_id, creado_por]);
  res.send('Presupuesto agregado correctamente');
});

// actualiza el estado del presupuesto - UpdatePresupuesto
// Agregado el 03/02/2023 - EIPEREZ
// Modificado el
app.put('/api/compras_presupuesto/UpdatePresupuesto', async (req, res) => {
  const {
    presupuesto_id,
    empresa_id,
    responsable_id,
    presupuesto_estado_id,
    monto,
    año,
    estado,
    actualizado_por,
  } = req.body;
  await getConnGroupNova.query('CALL compras_presupuesto.sp_cat_presupuesto_update($1,$2,$3,$4,$5,$6,$7,$8);', [presupuesto_id, empresa_id, responsable_id, presupuesto_estado_id, monto, año, estado, actualizado_por]);
  res.send('Presupuesto actualizado correctamente');
});
/// /Apis que pertenecen a las presupuesto

/// /Apis que pertenecen a las detalle del presupuesto
// Agrega un nuevo registro a la tabla detalle del presupuesto - PostDetallePresupuesto
// Agregado el 03/02/2023 - EIPEREZ
// Modificado el
app.post('/api/compras_presupuesto/PostDetallePresupuesto', async (req, res) => {
  const {
    cat_presupuesto_id,
    cuenta_id,
    monto_inicial,
    monto_final,
    enero_inicial,
    enero_final,
    febrero_inicial,
    febrero_final,
    marzo_inicial,
    marzo_final,
    abril_inicial,
    abril_final,
    mayo_inicial,
    mayo_final,
    junio_inicial,
    junio_final,
    julio_inicial,
    julio_final,
    agosto_inicial,
    agosto_final,
    septiembre_inicial,
    septiembre_final,
    octubre_inicial,
    octubre_final,
    noviembre_inicial,
    noviembre_final,
    diciembre_inicial,
    diciembre_final,
    creado_por_id,
  } = req.body;
  await getConnGroupNova.query('CALL compras_presupuesto.sp_det_presupuesto_add($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29);', [cat_presupuesto_id, cuenta_id, monto_inicial, monto_final, enero_inicial, enero_final, febrero_inicial, febrero_final, marzo_inicial, marzo_final, abril_inicial, abril_final, mayo_inicial, mayo_final, junio_inicial, junio_final, julio_inicial, julio_final, agosto_inicial, agosto_final, septiembre_inicial, septiembre_final, octubre_inicial, octubre_final, noviembre_inicial, noviembre_final, diciembre_inicial, diciembre_final, creado_por_id]);
  res.send('Presupuesto detalle agregado correctamente');
});

// Agrega un nuevo registro a la tabla detalle del presupuesto - DeleteDetallePresupuesto
// Agregado el 03/02/2023 - EIPEREZ
// Modificado el
app.delete('/api/compras_presupuesto/DeleteDetallePresupuesto', async (req, res) => {
  const { det_presupuesto_id } = req.body;
  await getConnGroupNova.query('CALL compras_presupuesto.sp_tbl_det_presupuesto_delete($1);', [det_presupuesto_id]);
  res.send('Presupuesto detalle eliminado correctamente');
});

// actualiza el estado del presupuesto - UpdateDetallePresupuesto
// Agregado el 03/02/2023 - EIPEREZ
// Modificado el
app.put('/api/compras_presupuesto/UpdateDetallePresupuesto', async (req, res) => {
  const {
    det_presupuesto_id,
    cat_presupuesto_id,
    cuenta_id,
    monto_inicial,
    monto_final,
    enero_inicial,
    enero_final,
    febrero_inicial,
    febrero_final,
    marzo_inicial,
    marzo_final,
    abril_inicial,
    abril_final,
    mayo_inicial,
    mayo_final,
    junio_inicial,
    junio_final,
    julio_inicial,
    julio_final,
    agosto_inicial,
    agosto_final,
    septiembre_inicial,
    septiembre_final,
    octubre_inicial,
    octubre_final,
    noviembre_inicial,
    noviembre_final,
    diciembre_inicial,
    diciembre_final,
    estado,
    actualizado_por,
  } = req.body;
  await getConnGroupNova.query('CALL compras_presupuesto.sp_det_presupuesto_update($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31);', [det_presupuesto_id, cat_presupuesto_id, cuenta_id, monto_inicial, monto_final, enero_inicial, enero_final, febrero_inicial, febrero_final, marzo_inicial, marzo_final, abril_inicial, abril_final, mayo_inicial, mayo_final, junio_inicial, junio_final, julio_inicial, julio_final, agosto_inicial, agosto_final, septiembre_inicial, septiembre_final, octubre_inicial, octubre_final, noviembre_inicial, noviembre_final, diciembre_inicial, diciembre_final, estado, actualizado_por]);
  res.send('Presupuesto detalle actualizado correctamente');
});
/// /Apis que pertenecen a las detalle del presupuesto

/*
  ///////////////////////////////////////////////////////  COMPRAS - End
*/

// Agrega el horario de entrada por usuario
app.post('/api/horario_entrada_usuario', jwt(secret), async (req, res) => {
  if (req.user.admin) {
    const {
      int_id_cat_horario_accion,
      int_id_cat_dispositivo,
      int_id_cat_usuario,
      dtm_fecha_hora,
      int_creado_por,
      dtm_fecha_actualizacion,
    } = req.body;
    await getConnGroupNova.query('CALL nova_horario.sp_nova_horario_entrada($1,$2,$3,$4,$5,$6);', [int_id_cat_horario_accion, int_id_cat_dispositivo, int_id_cat_usuario, dtm_fecha_hora, int_creado_por, dtm_fecha_actualizacion]);

    // console.log(response);
    res.send('Horario de entrada agreado correctamente ...');
  }
  res.status(401);
});

// Agrega el horario de salida por usuario
app.post('/api/horario_salida_usuario', jwt(secret), async (req, res) => {
  if (req.user.admin) {
    const {
      int_id_cat_horario_accion,
      int_id_cat_dispositivo,
      int_id_cat_usuario,
      dtm_fecha_hora,
      int_creado_por,
      dtm_fecha_actualizacion,
    } = req.body;
    await getConnGroupNova.query('CALL nova_horario.sp_nova_horario_salida($1,$2,$3,$4,$5,$6);', [int_id_cat_horario_accion, int_id_cat_dispositivo, int_id_cat_usuario, dtm_fecha_hora, int_creado_por, dtm_fecha_actualizacion]);

    // console.log(response);
    res.send('Horario de salida agreado correctamente ...');
  }
  res.status(401);
});

/*
  ///////////////////////////////////////////////////////  COMPRAS - End
*/

/*
  Nombre: Post_Marcaje
  Descripción: Ingresa el marcaje por colaborador

  Fecha creación: 01-Mar-2023
  Fecha modificación: 01-Mar-2023
  Creado por: carlos.vicente@groupnova.com.gt
  Modificado por: carlos.vicente@groupnova.com.gt
*/
app.post('/api/usuarios/Post_Marcaje', async (req, res) => {
  const {
    str_usuario,
    str_accion,
  } = req.body;
  const response = await getConnGroupNova.query('SELECT * FROM general.add_marcaje($1,$2)', [str_usuario, str_accion]);
  res.status(200).json(response.rows);
});

server.listen(PORT, () => console.log(`Server ready in http://localhost:${PORT}`));
