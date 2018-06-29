import {ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy} from '@angular/router';

export class CustomReuseStrategy implements RouteReuseStrategy {

    handlers: {[key: string]: DetachedRouteHandle} = {};

    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        return route.data && (route.data as any).shouldDetach;
    }

    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
        this.handlers[route.routeConfig.path] = handle;
    }

    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        return !!route.routeConfig && !!this.handlers[route.routeConfig.path];
    }

    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
        if (!route.routeConfig) return null;
        return this.handlers[route.routeConfig.path];
    }

    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        return future.routeConfig === curr.routeConfig;
    }

}


// export class CustomReuseStrategy implements RouteReuseStrategy {
//     routesToDelete = new Map<string, string>();

//     routesToCache: string[] = 
//     ["desarrollo", "cerrados", "espera", "recepcion", "escaneados", "asignados", "enproceso", "terminados", "cerradas", "busqueda", "lista", "pendientes", "aperturados", "buscarCaso"];
//     storedRouteHandles = new Map<string, DetachedRouteHandle>();
   
//     // Decides if the route should be stored
//     shouldDetach(route: ActivatedRouteSnapshot): boolean {
//        return this.routesToCache.indexOf(route.routeConfig.path) > -1;
//     }
   
//     //Store the information for the route we're destructing
//     store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
//         this.routesToDelete.set(route.routeConfig.path, Date());
        
//         this.storedRouteHandles.set(route.routeConfig.path, handle);
//     }
   
//    //Return true if we have a stored route object for the next route
//     shouldAttach(route: ActivatedRouteSnapshot): boolean {
//         // var algo = this.storedRouteHandles.entries();
//         // this.storedRouteHandles.
//         // console.log(algo);
//         // if(this.routesToDelete.has("asignados")){
//         //     let horaAsignado = moment(this.routesToDelete.get("asignados"));
//         //     let horaActual = moment();
//         //     console.log("dateAsignado " + horaAsignado);
//         //     console.log("fechaActual " + horaActual);
//         //     if(horaActual.diff(horaAsignado, 'mm') > 5){
//         //        console.log("llego");
//         //     }
//         // }
//         //console.log("asig value: " + this.routesToDelete.get("asignados"));
        
        
//         //this.storedRouteHandles.delete("asignados")

//         return this.storedRouteHandles.has(route.routeConfig.path);
//     }
   
//     //If we returned true in shouldAttach(), now return the actual route data for restoration
//     retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
//         return this.storedRouteHandles.get(route.routeConfig.path);
//     }
   
//     //Reuse the route if we're going to and from the same route
//     shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
//         return future.routeConfig === curr.routeConfig;
//     }
//    }