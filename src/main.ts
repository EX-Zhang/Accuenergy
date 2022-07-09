import { createApp } from 'vue';
import 'xe-utils';
import VXETable from 'vxe-table';
import 'vxe-table/lib/style.css';
import axios from 'axios';

import i18n from './i18n';

import App from './App.vue';


VXETable.setup({

    i18n: (key, args) => i18n.global.t(key, args) // Set languaged of vxe-table module to English

});

//axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

createApp(App).use(i18n).use(VXETable).mount('#app')
