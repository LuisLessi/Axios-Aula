<template>
    <div>
        <div class="row">
            <div class="col-sm-10">
                <h1 class="font-weight-light">Lista de Tarefas</h1>
            </div>
            <div class="col-sm-2">
                <button class="btn btn-primary float-right" 
                @click="exibirFormularioCriarTarefa">
                    <i class="fa fa-plus mr-2"></i>
                    <span>Criar</span>
                </button>
            </div>
        </div>
        <ul class="list-group" v-if="tarefas.length > 0">
            <TarefasListaIten v-for="tarefa in tarefasOrdenadas" :key="tarefa.id" :tarefa="tarefa" 
            @editar="selecionaTarefaEdicao"
            @deletar="deletarTarefa"
            @concluir="editarTarefa" />
        </ul>

        <p v-else-if="!mensagemErro">Nenhuma tarefa criada.</p>

        <div class="alert alert-danger" v-else>{{ mensagemErro }}</div>

        <TarefaSalvar v-if="exibirFormulario" :tarefa="tarefaSelecionada" @criar="criarTarefa" @editar="editarTarefa" />

    </div>
</template>

<script>

import TarefaSalvar from './TarefaSalvar.vue'
import TarefasListaIten from './TarefasListaIten.vue'
import api from '../services/api'
import axios from 'axios'

export default {
    components: {
        TarefaSalvar,
        TarefasListaIten
    },
    data() {
        return {
            tarefas: [],
            exibirFormulario: false,
            tarefaSelecionada: undefined,
            mensagemErro: undefined
        }
    },
    created() {
        api.get('/tarefas').then((res) => {
            this.tarefas = res.data
            return 'Axios'
        }, error => {
            console.log('Erro capturado no then: ', error)
            return Promise.reject(error)
        }).catch(error => {
            console.log('Erro capturado no catch: ', error)
            if (error.res){
                this.mensagemErro = `Servidor retornou um erro ${error.message} ${error.res.statusText}` 
                console.log('Erro [resposta]: ', error.res)
            } else if (error.request) {
                this.mensagemErro = `Erro ao tentar comunicar com o servidor: ${error.message}`
                console.log('Erro [requisiçao]: ', error.request)
            } else {
                this.mensagemErro = `Erro ao fazer requisição ao servidor: ${error.message}`
            }
            return "Curso vueJs"
        }).then((algumParametro) => {
            console.log('Sempre executado!', algumParametro)
        })
    },
    computed: {
        tarefasOrdenadas() {
            return this.tarefas.sort((t1, t2) => {
                if (t1.concluido === t2.concluido) {
                    return t1.titulo < t2.titulo
                    ? -1
                    : t1.titulo > t2.titulo
                        ? 1
                        : 0
                }
                return t1.concluido - t2.concluido
            })
        }
    },
    methods: {
        criarTarefa(tarefa) {
           /* api.post('/tarefas', tarefa).then((res) => {
                console.log(res)
                this.tarefas.push('POST:' + res.data)
                this.resetar()
            }) */
            axios.request({
                method: 'post',
                baseURL: api.defaults.baseURL,
                url: '/tarefas',
                data: tarefa
            }).then((res) => {
                console.log(res)
                this.tarefas.push('POST:' + res.data)
                this.resetar()
            })
        },
       
        async deletarTarefa(tarefa) {
            const confirmar = window.confirm(`Deseja deletar a tarefa "${tarefa.titulo}" ?`)
            if(confirmar) {
                /* api.delete(`/tarefas/${tarefa.id}`)
                .then(res => {
                    console.log(`Delete /tarefas/${tarefa.id}`, res)
                    const indice = this.tarefas.findIndex(t => t.id === tarefa.id)
                    this.tarefas.splice(indice, 1)

                }) */
                try {
               const res = await api.delete(`/tarefas/${tarefa.id}`)
               console.log(`Delete /tarefas/${tarefa.id}`, res)
               const indice = this.tarefas.findIndex(t => t.id === tarefa.id)
               this.tarefas.splice(indice, 1)
                } catch (error) {
                    console.log('Erro ao deletar tarefa: ', error)
                } finally {
                    console.log('sempre executado')
                }
               
            }
        },
        editarTarefa(tarefa) {
            console.log('Editar: ', tarefa)
            api.put(`/tarefas/${tarefa.id}`, tarefa)
                .then(res => {
                    console.log(`PUT /tarefas/${tarefa.id}`, res)
                    const indice = this.tarefas.findIndex(t => t.id === tarefa.id)
                    this.tarefas.splice(indice, 1, tarefa)
                    this.resetar()
                })
        },
        exibirFormularioCriarTarefa(){
            if(this.tarefaSelecionada) {
                this.tarefaSelecionada = undefined
                return
            }
            this.exibirFormulario = !this.exibirFormulario
        },
        resetar() {
            this.tarefaSelecionada = undefined
            this.exibirFormulario = undefined
        },
        selecionaTarefaEdicao(tarefa) {
            this.tarefaSelecionada = tarefa
            this.exibirFormulario = true
        }
    }
}
</script>
