// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import { createVuetify  } from 'vuetify'
import { VExpansionPanels, VExpansionPanel, VExpansionPanelTitle, VExpansionPanelText } from 'vuetify/lib/components/index.mjs';
import { VDataTable } from 'vuetify/labs/components'

export default createVuetify({
  components: {
    VExpansionPanels, VExpansionPanel, VExpansionPanelTitle, VExpansionPanelText,
    VDataTable,
  },
})
