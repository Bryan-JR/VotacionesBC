<template>
    <div>
      <v-toolbar class="bg-lime-lighten-4">
        <div>
          <v-img
            :width="150"
            aspect-ratio="16/9"
            alt="Logo"
            class="ma-3"
            src="../img/logoUnicor.png"
          ></v-img>
        </div>
        <v-spacer></v-spacer>
        <div class="d-flex flex-row"  >
          <v-toolbar-items @click="$router.push(`${log.type==='view' ? '/' : '/'+log.type}`)" class="mx-3 text-primary btn text-h6 d-flex align-center">
            <v-icon icon="mdi-home-circle" class="mr-2"></v-icon>
            <span class="font-weight-bold">Inicio</span>
          </v-toolbar-items>
          <v-toolbar-items class="mx-3 text-primary text-h6 btn" v-if="!log.log" @click="$router.push('/convocatorias')">
            <v-icon icon="mdi-account-edit" class="mr-2"></v-icon>
            <span class="font-weight-bold">Convocatorias</span>
          </v-toolbar-items>
          <v-toolbar-items class="mx-3 text-primary text-h6 btn" v-if="!log.log" @click="$router.push('/elecciones')">
            <v-icon icon="mdi-vote" class="mr-2"></v-icon>
            <span class="font-weight-bold">Elecciones</span>
          </v-toolbar-items>
        </div>
        <div class="d-flex flex-row">
          <v-toolbar-items v-if="log.log&&log.type==='usuario'" class="mx-3 text-primary text-h6 d-flex align-center">
            <PanelNotificacion />
          </v-toolbar-items>
          <div class="" v-if="log.log">
              <v-menu>
                <template v-slot:activator="{ props }">
                  <v-toolbar-items v-bind="props"  class="mx-4 ml-7 btn text-primary text-h6 d-flex flex-column">
                    <span class="font-weight-bold">{{ usuario.nombre+" "+usuario.apellido1+" "+usuario.apellido2 }}</span>
                    <span class="text-subtitle-1" v-if="log.type=='usuario'">{{ usuario.programa+", Sem "+usuario.sem }}</span>
                    <span class="text-subtitle-1" v-else-if="log.type=='admin'">Administrador</span>  
                  </v-toolbar-items>
                </template>
                <v-list>
                  <v-list-item class="btn" @click="cerrarSesion()">
                    <v-list-item-title><v-icon color="primary" icon="mdi-exit-to-app"></v-icon>  CERRAR SESIÓN</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
          </div>
        </div>
      </v-toolbar>
    </div>
  </template>

  <script>
  import PanelNotificacion from './PanelNotificaciones.vue'
  export default {
    components: { PanelNotificacion }, 
    props: [ 'log', 'usuario' ],
    data(){
      return {

      }
    },
    methods: {
      cerrarSesion(){
        localStorage.setItem("log", JSON.stringify({log: false, type: "view"}));
        localStorage.removeItem("usuario");
        this.$emit('cargar');
        this.$router.push('/');
      }
    },
  }
  </script>

  <style scoped>
    .btn{
      cursor: pointer;
      user-select: none;
    }
  </style>