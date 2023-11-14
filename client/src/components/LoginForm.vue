<template>
  <v-card
    class="mx-auto text-center my-16 pa-4 d-flex flex-column justify-center align-center"
    width="500"
    color="grey-lighten-5"
    height="330"
    title="INICIO DE SESIÓN"
  >
    <v-card-text class="w-100 d-flex flex-column justify-center align-center">
      <v-form ref="form" class="w-100 d-flex flex-column justify-center align-center">
      <v-text-field
        v-model="user"
        :rules="userRules"
        prepend-icon="mdi-account"
        type="number"
        variant="solo-filled"
        class=" w-100"
        clearable
        label="Número de documento"
        required
      ></v-text-field>

      <div class="d-flex mt-5 w-50 justify-center align-center">
        <v-btn
          class="mt-4"
          block
          color="green"
          @click="login()"
        >
          VALIDAR
        </v-btn>  
        
      </div>
    </v-form>
    </v-card-text>
    
  </v-card>
  <v-overlay 
        v-model="overlay"
        location-strategy="static"
        scroll-strategy="block"
        class="d-flex justify-center align-center"
        z-index="30"
  >
    <v-card
        class="py-8 px-6 text-center mx-auto ma-4"
        elevation="12"
        max-width="400"
        width="100%"
      >
        <h3 class="text-h6 mb-4">CÓDIGO DE VERIFICACIÓN</h3>

        <div class="text-body-2">
          El código de verificación fue enviado al correo <br> <strong>{{ ocultarCorreo(credencial.correo) }}</strong> <br><br>

          Por favor, copia y pega el código en el siguiente campo.
        </div>

        <v-sheet color="surface">
          <v-otp-input
            v-model="otp"
            placeholder="-"
            type="text"
            class="text-uppercase"
            required
            variant="solo-filled"
          ></v-otp-input>
        </v-sheet>

        <v-btn
          class="my-4"
          color="green"
          height="40"
          text="INGRESAR"
          variant="flat"
          :loading="loading"
          width="70%"
          @click="validar()"
        ></v-btn>

        <div class="text-caption">
          No te llegó el código? <a href="#" @click.prevent="login()">nuevo código</a>
        </div>
        <v-snackbar
          v-model="snackbar"
          :timeout="2000"
          color="red-darken-1"
          elevation="24"
        >
          El código no es correcto.
        </v-snackbar>
      </v-card>
  </v-overlay>
</template>

<script>

export default {
  name: 'LoginForm',
  data(){
    return {
      user: '',
      credencial: {},
      usuario: {},
      snackbar: false,
      text: '...',
      timeout: 2000,
      otp: '',
      overlay: false,
      userRules: [
        v => !!v || 'El número de documento es requerido.',
      ],
    }
  },
  methods: {
    async getUsuario(){
      await this.axios.get('/usuario/'+this.user)
          .then( resp => {
            this.usuario = resp.data[0];
          }).
          catch( err => {
            console.error(err);
          });
          await this.axios.get('/estudiante/'+this.user)
          .then( res => {
            this.usuario = {  ...this.usuario, ...res.data[0] }
            localStorage.setItem("usuario", JSON.stringify(this.usuario));
            
          })
          .catch(er => {
            console.error(er);
          });
    },
    async login(){
      await this.axios.post('/login',{id: this.user})
      .then( async res => {
        this.credencial = res.data;
        if(this.credencial.type === "noExiste"){
          this.snackbar = true;
          this.text = 'Usuario no existe';
          this.$swal.fire({
            icon: 'error',
            title: 'Usuario no aparece en el censo',
            text: 'Si tienes algún problema contacta con un administrador.'
          })
        } else if(this.credencial.correo !== undefined) {
          this.overlay = false;
          await this.$swal.fire({
            icon: 'success',
            title: 'Código enviado correctamente',
            text: 'El código fue enviado al correo electronico registrado.'
          })
          this.overlay = true;
        }
      })
      .catch(error => {
        console.log(error);
      });
    },
    async validar(){
      if (this.credencial.cod===this.otp) {
        if(this.credencial.type==="admin"){
          this.$swal.fire({
            icon: 'success',
            title: 'Inicio como Admin correcto',
            text: 'Puedes votar por un representante'
          });
          localStorage.setItem("log", JSON.stringify({log: true, type: "admin"}));
          await this.getUsuario();
          this.$router.push("/admin");
          this.$emit("cargar");
        } else if (this.credencial.type==="inicio") {
          this.$swal.fire({
            icon: 'success',
            title: 'Inicio como usuario correcto',
            text: 'Puedes votar por un representante'
          });
          localStorage.setItem("log", JSON.stringify({log: true, id: this.user, type: "usuario"}));
          await this.getUsuario();
          this.$router.push("/usuario");
          this.$emit("cargar");
        } 
      } else {
        this.snackbar = true;
        this.overlay = true;
      }
    },
    ocultarCorreo(correo) {
      // Dividir el correo electrónico en nombre de usuario y dominio
      var partes = correo.split('@');
      var nombreUsuario = partes[0];
      var dominio = partes[1];

      // Ocultar parte del nombre de usuario (puedes ajustar la cantidad de caracteres ocultos)
      var longitudVisible = 3;
      var parteVisible = nombreUsuario.slice(0, longitudVisible);
      var parteOculta = nombreUsuario.slice(longitudVisible).replace(/./g, '*');

      // Formar el correo electrónico oculto
      var correoOculto = parteVisible + parteOculta + '@' + dominio;

      return correoOculto;
    }
  },
}
</script>


<style scoped>
</style>
