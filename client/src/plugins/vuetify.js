// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import { createVuetify  } from 'vuetify'
import { VExpansionPanels, VExpansionPanel, VExpansionPanelTitle, VExpansionPanelText, VOtpInput } from 'vuetify/lib/components/index.mjs';
import { VDataTable, VDataTableVirtual } from 'vuetify/labs/components'

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
