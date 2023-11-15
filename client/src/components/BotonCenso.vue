<template>
    <v-col>
          <v-card
            class="mx-auto d-flex flex-column align-center justify-center opcion"
            width="300"
            height="300"
            @click="abrirArchivo()"
          >
            <v-icon 
              size="70px"
              color="green-darken-2"
              icon="mdi-account-box-multiple"></v-icon>
            <v-card-title>
              CARGAR CENSO
            </v-card-title>
            <v-card-text class="texto">
              Sitio para cargar los usuarios del sistema
            </v-card-text>
          </v-card>
        </v-col>
</template>

<script>
import Papa from 'papaparse';
export default {
    name: 'BotonCenso',
    data() {
      return {
            datos: [],
            usuarios: [],
            estudiantes: [],
            body: {},
        }
    },
    methods: {
        async abrirArchivo(){
        const {value: file} = await this.$swal.fire({
          title: 'Seleccionar CSV de CENSO',
          input: 'file',
          inputAttributes: {
            'accept': '*',
            'aria-label': 'Subir archivo .csv'
          }
        })
        if(file){
          this.cargarCenso(file);
        }
      },
      async cargarCenso(file){
        await Papa.parse(file, {
          header: true,
          dynamicTyping: true,
          complete: async function(resultado) {
            this.datos = resultado.data;
            this.datos.splice(this.datos.length-1, 1)
            console.log(this.datos);
            
            let vecUsuario = await this.datos.map(obj => ({
              "identificacion": obj.identificacion,
              "nombre": obj.nombre,
              "apellido1": obj.apellido1,
              "apellido2": obj.apellido2,
              "tipo_documento": obj.tipo_documento,
              "numero_celular": obj.numero_celular,
              "correo": obj.correo
            }));
            let vecEstudiantes = await this.datos.map(obj => ({
              "identificacion": obj.identificacion,
              "facultad": obj.facultad,
              "programa": obj.programa,
              "sem": obj.sem,
              "nota_pga": obj.nota_pga,
              "codigopwc": obj.codigopwc,
              "creditos_planAc": obj.creditos_planAc,
              "total_creditos_apro": obj.total_creditos_apro,
              "creditos_periodo": obj.creditos_periodo,
              "creditos_apro_periodo": obj.creditos_apro_periodo,
              "sanciones": obj.sanciones
            }));


            this.usuarios = {
              tabla: "usuario",
              keys: Object.keys(vecUsuario[0]),
              values: Object.values(vecUsuario)
            };

            this.estudiantes = {
              tabla: "estudiante",
              keys: Object.keys(vecEstudiantes[0]),
              values: Object.values(vecEstudiantes)
            };
            
            this.body = {
              usuarios: this.usuarios, 
              estudiantes: this.estudiantes
            }
            localStorage.setItem('body', JSON.stringify(this.body));
          }
        });
         
        await this.axios.post('/censo', await JSON.parse(localStorage.getItem('body')))
        .then(async res => {
          console.log(res);
          let msg = await res.data;
          await this.$swal.fire({
          timer: 3000,
          timerProgressBar: true,
          didOpen: () => {
              this.$swal.showLoading()
          }
          }).then((result) => {
          /* Read more about handling dismissals below */
          if (result.dismiss === this.$swal.DismissReason.timer) {
              this.mostrar = true;
          }
          })
          if (msg=="cargado") this.$swal.fire({icon: 'success', title:'Archivo cargado', text: 'Los datos fueron cargados correctamente'});
          else if (msg=="error") this.$swal.fire({icon: 'error', title:'Archivo no fue cargado', text: 'Intentelo nuevamente.'});
        })
        .catch( error => {
          console.log(error);
        });
      },
    },
}
</script>

<style scoped>

  .opcion{
    padding:60px 5px !important;
    cursor: pointer;
  }
  .opcion:hover{
    background-color: #f0f0f0;
  }
  .texto{
    color: #02a50d;
    text-align: center;
  }
</style>