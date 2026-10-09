const API_URL = "http://localhost:8080/api/clientes";

//Mostrar
export async function getClientes(){
    try{
        const respuesta = await fetch(API_URL);
        const json = await respuesta.json();
        if(!respuesta.ok){
            throw new Error(json.message);
        }
        return json.data;
    }
    catch(error){
        console.error("Error al obtener clientes: ", error);
        throw error;
    }
}

//Editar o traer informacion por id
export async function getCliente(id){
    try{
    const respuesta = await fetch('${API_URL}/${id}');
    const json = await respuesta.json();
        if(!respuesta.ok){
            throw new Error(json.message);
        }
        return json.data;
    }
    catch(error){
        console.error("Error al obtener informacion del cliente");
        throw error;
    }
}

//Crear

export async function crearCliente(cliente){
try{
    const respuesta = await fetch(API_URL,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(cliente)
    });
    const json= await respuesta.json();
    if(!respuesta.ok){
        throw new Error(json.message);
    }
    return json.message;
}
catch(error){
    console.error("Error al crear el cliente: ", error);
    throw error;
    }
}

//Actualizar
export async function actualizarCliente(id,cliente){
    try{
        const respuesta = await fetch('${API_URL}/${id}',{
            method:"PUT",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(cliente)
        });
        const json = await resouesta.json();
        if(!respuesta.ok){
            throw new Error(json.message);
        } 
        return json.message;
    }catch(error){
        console.error("Error al actualizar cliente: ", error);
        throw error;
    }
}


export async function eliminarCliente(id){
    try{
        const respuesta = await fetch('${API_URL}/${id}',{
            method: "DELETE"
        });
        const json = await respuesta.json();
        if(!respuesta.ok){
            throw new Error(json.message);
        }
        return json.message;
    }
    catch(error){
        console.error("Error al eliminar el cliente: ", error);
        throw error;
    }
}