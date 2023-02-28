export default function createVueTemplate(res) {
    return `<template>\n
  <Hello></Hello>
</template>
<script>
import Hello from './view/Hello.vue'
export default {
  name: "${res.camelName}"
}
</script>
<style scoped>
</style>`
}
