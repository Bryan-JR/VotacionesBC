<template>
    <v-footer
      class="bg-grey-darken-4 text-center d-flex flex-column"
    >
        <div>
            <v-btn
            v-for="icon in icons"
            :key="icon"
            class="mx-4"
            :icon="icon"
            variant="text"
            ></v-btn>
        </div>
  
      <div class="pt-0">
        Aplicacion web de votación electronica con tecnologias blockchain
      </div>
  
      <v-divider></v-divider>
  
      <div>
        <h3 class="font-weight-bold">Universidad de Córdoba</h3>
      </div>
    </v-footer>
  </template>

<script>
export default {
  data: () => ({
    icons: [
      'mdi-facebook',
      'mdi-twitter',
      'mdi-linkedin',
      'mdi-instagram',
    ],
  }),
}
</script>