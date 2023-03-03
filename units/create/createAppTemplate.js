export default function createAppTemplate(res) {
    const camelName = res.camelName
    return `<template>
  <${camelName}/> 
</template>

<script setup>
import ${camelName} from './components/${camelName}.vue'
</script>

<style scoped>
div{
  background: #f5f5f5;    
}
</style>`
}
