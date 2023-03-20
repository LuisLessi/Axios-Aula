<template>
  <div id="app">

    <div class="jumbotron jumbotron-fluid">
      <div class="container">
        <h1 class="display-4">Requisições HTTP no Vue</h1>
        <p class="lead">Usando a biblioteca Axios para fazer chamadas Ajax à uma API REST.</p>
      </div>
    </div>

    <div class="container">
      <TarefasLista />
      <button class="btn btn-primary mt-4 mb-2" @click="download">
        Baixar imagem
      </button>
      <div class="progress" role="progressbar" aria-label="Basic example" :aria-valuenow="progresso" aria-valuemin="0"
        aria-valuemax="100">
        <div class="progress-bar" :style="{width: progresso + '%'}">
          {{ progresso }} %</div>
      </div>

      <div v-if="imagem">
      <img :src="imagem" style="max-width: 100%;">
    </div>
    </div>

  </div>
</template>

<script>
import TarefasLista from './components/TarefasLista.vue'
import api from './services/api'
import axios from 'axios'

export default {
  components: {
    TarefasLista
  },
  data() {
    return {
      progresso: 0,
      imagem: undefined
    }
  },
  async created() {
    /*axios.all([
      api.get('/tarefas/2'),
      api.get('/tarefas/3')
    ]).then(axios.spread((tarefa1, tarefa3) => {
      console.log('Requisições simultâneas:')
      console.log('Tarefa 1: ', tarefa1)
      console.log('Tarefa 2: ', tarefa3)

    }))*/

    /* axios.all([
     api.get('/tarefas/2'),
     api.get('/tarefas/3')
   ]).then((res) => {
     const [tarefa2, tarefa3] = res
     console.log('Tarefa 1: ', tarefa2)
     console.log('Tarefa 2: ', tarefa3)
   }) */

    const tarefa2 = await api.get('/tarefas/2')
    const tarefa3 = await api.get('/tarefas/3')
    console.log('Tarefa 2: ', tarefa2)
    console.log('Tarefa 3: ', tarefa3)
  },
  methods: {
    download() {
      axios.get('https://images.unsplash.com/photo-1517976487492-5750f3195933?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80', {
        responseType: 'blob',
        onDownloadProgress: (progressEvent) => {
          console.log('Fazendo download...', progressEvent)
          this.progresso = (progressEvent.loaded / progressEvent.total * 100).toFixed(0)
        }
      }).then(res => {
        console.log('Download concluido !', res)

        const reader = new window.FileReader()
        reader.readAsDataURL(res.data)
        reader.onload = () => {
          this.imagem = reader.result
        }
      })
    }
  }
}
</script>