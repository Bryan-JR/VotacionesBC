// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import { createVuetify  } from 'vuetify'
import { VExpansionPanels, VExpansionPanel, VDataTable, VDataTableVirtual, VExpansionPanelTitle, VExpansionPanelText, VOtpInput } from 'vuetify/lib/components/index.mjs';

export default createVuetify({
  components: {
    VExpansionPanels, VExpansionPanel, VExpansionPanelTitle, VExpansionPanelText, VOtpInput,
    VDataTable, VDataTableVirtual,
  },
  theme: {
    themes: {
      light: {
        colors: {
          primary: '#008000',
          secondary: '#5CBBF6',
        },
      },
    },
  },
})
