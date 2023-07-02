<template>
    <div class="text-center">
      <v-menu
        v-model="menu"
        :close-on-content-click="false"
        location="start"
      >
        <template v-slot:activator="{ props }">
          <v-btn
            color="primary"
            v-bind="props"
            variant="text"
            @click="leer()"
          >
          <v-icon size="x-large" v-if="notificacion.length==0||leido">mdi-bell</v-icon>
          <v-badge dot color="error" v-else-if="!leido">
            <v-icon size="x-large">mdi-bell</v-icon>
          </v-badge>
          </v-btn>
        </template>
         <v-list v-if="notificacion.length==0">
          <v-list-item
            title="No tiene notificaciones."
          >
          </v-list-item>
        </v-list>
        <v-card min-width="300" v-else>
          <v-list>
            <v-list-item
              :title="`${estudiante.nombre} ${estudiante.apellido1} ${estudiante.apellido2}`"
              :subtitle="`${estudiante.programa}, Sem ${estudiante.sem}`"
            >
            </v-list-item>
          </v-list>
  
          <v-divider></v-divider>
  
          <v-list>
            <v-list-item>
              <v-list-item-title v-if="emisor"> <strong>LO INVITASTE A UNIRSE A LA CONVOCATORIA:</strong></v-list-item-title>
              <v-list-item-title v-else-if="!emisor"><strong>TE INVITÓ A UNIRTE A LA CONVOCATORIA:</strong></v-list-item-title>
              <v-list-item-subtitle> A las {{ notificacion[0].hora }} del {{ notificacion[0].fecha }} </v-list-item-subtitle>
              <v-spacer></v-spacer>
              {{ convocatoria.titulo }}
              
            </v-list-item>
            <v-list-item v-if="emisor||notificacion[0].estado!='Enviado'">
              <strong >Estado:  <v-chip :color="color(notificacion[0].estado)"> {{ notificacion[0].estado }} </v-chip> </strong>
            </v-list-item>
          </v-list>
  
          <v-card-actions v-if="!emisor&&notificacion[0].estado=='Enviado'">
            <v-spacer></v-spacer>
            <v-btn
              variant="text"
              @click="menu = false"
            >
              CANCELAR
            </v-btn>
            <v-btn
              color="error"
              variant="text"
              @click="actualiza('Rechazado')"
            >
              RECHAZAR
            </v-btn>
            <v-btn
              color="green"
              variant="text"
              @click="actualiza('Aceptado')"
            >
              ACEPTAR
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </div>
  </template>

<script>
export default {
    name: "PanelNotificaciones",
    data() {
      return {
        idUser: Number(JSON.parse(localStorage.getItem("log")).id),
        menu: false,
        notificacion: [],
        emisor: false,
        estudiante: {},
        convocatoria: {},
        idInfo: '',
        leido: false,
      }
    },
    methods: {
      async cargarNotificaciones(){
            await this.axios.get('/notificacion/emisor/'+this.idUser)
            .then(res => {
                this.notificacion = res.data;
                if(this.notificacion.length>0){
                  this.idInfo = this.notificacion[0].idReceptor;
                  this.emisor = true;
                }
            })
            .catch(err => {
                console.log(err);
            });
            if(this.notificacion.length==0){
                await this.axios.get('/notificacion/receptor/'+this.idUser)
                .then(res => {
                    this.notificacion = res.data;
                    this.idInfo = this.notificacion[0].idEmisor;
                    this.emisor = false;
                })
                .catch(err => {
                    console.log(err);
                });
            }
            if(this.notificacion.length>0) await this.axios.get('/convocatoria/'+this.notificacion[0].idConvocatoria)
            .then( resp => {
              this.convocatoria = resp.data[0];
            }).
            catch( err => {
              console.error(err);
            });
        },
        async cargarEstudiante(){
          await this.cargarNotificaciones();
          await this.axios.get('/usuario/'+this.idInfo)
          .then( resp => {
            this.estudiante = { ...resp.data[0] };
          }).
          catch( err => {
            console.error(err);
          });
          await this.axios.get('/estudiante/'+this.idInfo)
          .then( res => {
            this.estudiante = {  ...this.estudiante, ...res.data[0] }
          })
          .catch(er => {
            console.error(er);
          });
          console.log(this.estudiante);
        },
        async actualiza(status){
          const obj = {
            idNotificacion: this.notificacion[0].idNotificacion,
            estado: status
          }
          const body = {
            tabla: 'notificacion',
            keys: Object.keys(obj),
            values: Object.values(obj)
          }
          await this.axios.put('/actualiza/'+obj.idNotificacion, body)
          .then(res => {
            console.log(res);
            this.cargarNotificaciones();
          })
          .catch(err => {
            console.log(err);
          });
          this.menu = false
        },
        async leer(){
            this.leido = this.notificacion.length==0 ? false : this.notificacion[0].leido;
            if(this.notificacion.length>0&&!this.leido&&!this.emisor){
              const obj = {
                  idNotificacion: this.notificacion[0].idNotificacion,
                  leido: true
                }
                const body = {
                  tabla: 'notificacion',
                  keys: Object.keys(obj),
                  values: Object.values(obj)
                }
                await this.axios.put('/actualiza/'+obj.idNotificacion, body)
                .then(res => {
                  console.log(res);
                })
                .catch(err => {
                  console.log(err);
                });
              }
            
          },
          color(estado){
              if(estado==="Enviado") return "blue-grey-darken-1";
              else if (estado==="Aceptado"||estado==="Postulado") return "green-accent-3";
              else return "red-accent-4";
          },
          
        
    },
    async mounted() {
      await this.cargarEstudiante();
    },
}
</script>