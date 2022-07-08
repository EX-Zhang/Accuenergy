import { createApp } from 'vue';
import 'xe-utils';
import VXETable from 'vxe-table';
import 'vxe-table/lib/style.css';
import axios from 'axios';

import i18n from './i18n';

import App from './App.vue';


VXETable.setup({

    translate(key, args) {

        if (key && key.indexOf('app.') > -1) {

            return i18n.global.t(key, args);

        }

        return key;
    }

});

//axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

createApp(App).use(i18n).use(VXETable).mount('#app')
