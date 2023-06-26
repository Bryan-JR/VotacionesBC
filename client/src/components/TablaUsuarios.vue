<template>
    <v-container>
          <v-card>
            <v-card-title>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Buscar"
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>
            <v-data-table
              v-model:items-per-page="itemsPerPage"
              :loading="loading"
              :headers="cabezas"
              :search="search"
              :items="users"
              item-value="identificacion"
              class="elevation-1"
            ></v-data-table>
          </v-card>
        </v-container>
</template>

<script>
export default {
    name: 'TablaUsuarios',
    data() {
      return {
        search: '',
        cabezas: [
          {title: 'identificacion', key: 'identificacion'},
          {title: 'nombre', key: 'nombre'},
          {title: 'apellido1', key: 'apellido1'},
          {title: 'apellido2', key: 'apellido2'},
          {title: 'tipo_documento', key: 'tipo_documento'},
          {title: 'numero_celular', key: 'numero_celular'},
          {title: 'contraseña', key: 'contraseña'}
          ],
        users: [],
        itemsPerPage: 5,
        loading: true,
      }
    },
    methods: {
      cargarTabla(){
        this.axios.get('/usuario')
        .then( res => {
          this.users = res.data;
          this.loading = false;
        })
        .catch( error => {
          console.log(error);
        });
      }
    },
    mounted() {
      this.cargarTabla();
    },
}
</script>

