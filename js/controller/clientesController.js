import { getClientes, getCliente, crearCliente, actualizarCliente, eliminarCliente } from "../services/clientesService.js";

const tablaClientes = document.getElementById("tablaClientes");
const tableroContainer = document.getElementById("tableroContainer");
const cargando = document.getElementById("cargando");
const txtId = document.getElementById("txtId");
const txtNombre = document.getElementById("txtNombre");
const txtApellido = document.getElementById("txtApellido");
const txtTelefono = document.getElementById("txtTelefono");
const txtEmail = document.getElementById("txtEmail");
const txtDireccion = document.getElementById("txtDireccion");
const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");
const btnRecargar = document.getElementById("btnRecargar");
const formCliente = document.getElementById("formCliente");
const mensajeDiv = document.getElementById("mensaje");

async function cargarClientes() {
    try {
        mostrarCargando(true);
        const clientes = await getClientes();
        tablaClientes.innerHTML = "";

        if (clientes.length === 0) {
            tablaClientes.innerHTML = `<tr><td colspan="7" class="text-center text-muted">No hay clientes registrados</td></tr>`;
            mostrarCargando(false);
            return;
        }

        clientes.forEach((cliente) => {
            tablaClientes.innerHTML += `
                <tr>
                    <td>${cliente.idCliente}</td>
                    <td>${cliente.nombre}</td>
                    <td>${cliente.apellido}</td>
                    <td>${cliente.telefono}</td>
                    <td>${cliente.email}</td>
                    <td>${cliente.direccion ?? "-"}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editarCliente(${cliente.idCliente})">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="confirmarEliminar(${cliente.idCliente})">Eliminar</button>
                    </td>
                </tr>`;
        });
        mostrarCargando(false);
    }
    catch (error) {
        mostrarMensaje("Error al cargar los clientes: " + error.message, "danger");
        mostrarCargando(false);
    }
}

function mostrarCargando(mostrar) {
    if (mostrar) {
        cargando.classList.remove("d-none");
        tableroContainer.classList.add("d-none");
    } else {
        cargando.classList.add("d-none");
        tableroContainer.classList.remove("d-none");
    }
}

function mostrarMensaje(texto, tipo = "info") {
    mensajeDiv.textContent = texto;
    mensajeDiv.className = `alert alert-${tipo}`;
    mensajeDiv.classList.remove("d-none");
    setTimeout(() => mensajeDiv.classList.add("d-none"), 4000);
}

function limpiarFormulario() {
    formCliente.reset();
    txtId.value = "";
    btnGuardar.textContent = "Guardar Cliente";
    btnCancelar.classList.add("d-none");
}

function validarCliente(cliente) {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cliente.nombre || !cliente.apellido || !cliente.telefono 
        || !cliente.email) {
        return "Nombre, apellido, tefono y el correo son obligatorios";
    }
    if (!regexEmail.test(cliente.email)) {
        return "El email no tiene un formato válido";
    }
    return null;
}

async function editarCliente(id) {
    try {
        const cliente = await getCliente(id);
        txtId.value = cliente.idCliente;
        txtNombre.value = cliente.nombre;
        txtApellido.value = cliente.apellido;
        txtTelefono.value = cliente.telefono;
        txtEmail.value = cliente.email;
        txtDireccion.value = cliente.direccion ?? "";
        btnGuardar.textContent = "Actualizar Cliente";
        btnCancelar.classList.remove("d-none");
        formCliente.scrollIntoView({ behavior: "smooth" });
    }

    
    catch (error) {
        mostrarMensaje("Error al cargar el cliente: " + error.message, "danger");
    }
}

async function confirmarEliminar(id) {
    if (!confirm("Estas seguro de que deseas eliminar este cliente?")) {
        return;
    }
    try {
        const mensaje = await eliminarCliente(id);
        mostrarMensaje(mensaje, "success");
        limpiarFormulario();
        await cargarClientes();
    }
    catch (error) {
        mostrarMensaje(error.message, "danger");
    }
}

formCliente.addEventListener("submit", async function (e) {
    e.preventDefault();

    const id = txtId.value.trim();
    const cliente = {
        nombre: txtNombre.value.trim(),
        apellido: txtApellido.value.trim(),
        telefono: txtTelefono.value.trim(),
        email: txtEmail.value.trim(),
        direccion: txtDireccion.value.trim()
    };

    const error = validarCliente(cliente);
    if (error) {
        mostrarMensaje(error, "warning");
        return;
    }

    try {
        let mensaje;
        if (id) {
            mensaje = await actualizarCliente(id, cliente);
        } else {
            mensaje = await crearCliente(cliente);
        }
        mostrarMensaje(mensaje, "success");
        limpiarFormulario();
        await cargarClientes();
    }
    catch (error) {
        mostrarMensaje(error.message, "danger");
    }
});

btnCancelar.addEventListener("click", limpiarFormulario);
btnRecargar.addEventListener("click", cargarClientes);

window.editarCliente = editarCliente;
window.confirmarEliminar = confirmarEliminar;

document.addEventListener("DOMContentLoaded", cargarClientes);
