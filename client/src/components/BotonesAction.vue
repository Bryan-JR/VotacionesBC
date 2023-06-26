<template>
    <v-row>
        <v-col>
          <v-card
            class="mx-auto d-flex flex-column align-center justify-center opcion"
            width="300"
            height="300"
            @click="abrirConvocatorias"
          >
          <v-icon 
              size="70px"
              color="green-darken-2"
              icon="mdi-account-edit"></v-icon>
            <v-card-title>
              CONVOCATORIAS
            </v-card-title>

            <v-card-text class="texto">
              Convocatorias para ser Representante Estudiantil
            </v-card-text>
          </v-card>
        </v-col>
        <v-col>
            <v-card
              class="mx-auto d-flex flex-column align-center justify-center opcion"
              width="300"
              height="300"
              @click="abrirElecciones"
            >
            <v-icon 
                size="70px"
                color="green-darken-2"
                icon="mdi-archive"></v-icon>
              <v-card-title>
                ELECCIONES
              </v-card-title>

              <v-card-text class="texto">
                Elecciones para aspirante a Representante Estudiantil
              </v-card-text>
            </v-card>
        </v-col>
      </v-row>
</template>

<script>
export default {
    name: 'BotonesAction',
    data() {
      return {
        typeUser: JSON.parse(localStorage.getItem("log")).type,
      }
    },
    methods: {
      abrirConvocatorias(){
        this.$router.push("/"+this.typeUser+"/convocatorias");
      },
      abrirElecciones(){
          this.$router.push("/"+this.typeUser+"/elecciones");
      }
    },
}
</script>

<style scoped>

</style>