export let BASEURL = 'http://localhost:51735/';
export let APIURL = {
    taller: {
        consulta: BASEURL + 'Taller/GetTalleres',    
        insertar: BASEURL + 'Taller/SetTaller',
        temas: BASEURL + 'Taller/GetTemas_Taller?Taller_Numero=',
        tallerID: BASEURL + 'Taller/GetTaller?Taller_Numero=',
        editar: BASEURL + 'Taller/EditTaller',
        cancelar: BASEURL + 'Taller/CancelaTaller',
        estados: BASEURL + 'Taller/GetEstadosTalleres',
        tipoUsuario: BASEURL + 'Taller/GetTiposUsuarios',
    },
    tema: {
        consulta: BASEURL + 'Tema/GetTemas',
        temaId: BASEURL + 'Tema/GetTemasId?Tema_Numero=',
        insertar: BASEURL + 'Tema/SetTemas',
        editar: BASEURL + 'Tema/EditTemas?Tema_Numero=',
        borrar: BASEURL + 'Tema/DeleteTemas?Tema_Numero=',
    }    
};
