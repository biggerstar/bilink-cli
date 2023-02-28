import writeFileSync from "../writeFileSync.js";

export default function createVueTemplate(res) {
    return `<template>\n
</template>
<script>
export default {
  name: "${res.camelName}"
}
</script>
<style scoped>
</style>`
}
