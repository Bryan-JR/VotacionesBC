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
      cargarCenso(file){
        Papa.parse(file, {
          header: true,
          dynamicTyping: true,
          complete: function(resultado) {
            this.datos = resultado.data;
            this.datos.splice(this.datos.length-1, 1)
            console.log(this.datos);
            
            let vecUsuario = this.datos.map(obj => ({
              "identificacion": obj.identificacion,
              "nombre": obj.nombre,
              "apellido1": obj.apellido1,
              "apellido2": obj.apellido2,
              "tipo_documento": obj.tipo_documento,
              "numero_celular": obj.numero_celular,
              "contraseña": obj.contraseña
            }));
            let vecEstudiantes = this.datos.map(obj => ({
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
            console.log(this.usuarios);

            this.estudiantes = {
              tabla: "estudiante",
              keys: Object.keys(vecEstudiantes[0]),
              values: Object.values(vecEstudiantes)
            };
            console.log(this.estudiantes);
            
            this.body = {
              usuarios: this.usuarios, 
              estudiantes: this.estudiantes
            }
            localStorage.setItem('body', JSON.stringify(this.body));
          }
        });
         
        this.axios.post('/censo', JSON.parse(localStorage.getItem('body')))
        .then( res => {
          localStorage.removeItem('body');
          console.log(res);
          this.$swal.fire({icon: 'succes', title:'Archivo cargado', text: 'Los datos fueron cargados correctamente'})
        })
        .catch( error => {
          console.log(error);
        });
      },
    },
}
</script>

<style scoped>

</style>