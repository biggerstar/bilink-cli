export default function createMainJs(res) {
    return `import {createApp} from 'vue'
import ${res.camelName} from './${res.camelName}.vue'
const app = createApp(${res.camelName})
app.mount('#app')`

}
