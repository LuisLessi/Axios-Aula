import axios from 'axios'


const http = axios.create({
    baseURL: "http://localhost:3000"
})

http.interceptors.request.use(config => {
    console.log('Interceptando requisição: ', config)
    config.data = {
        ...config.data,
        curso: "Vue JS"
    }

    return config
   /* return new Promise((resolve, reject) => {
        console.log('Fazendo requisição aguardar')
        setTimeout(() => {
            console.log('Enviando requisição...')
            resolve(config)
        }, 2000)
        })
        */
    }, error => {
        console.log('Erro ao fazer requisição', error)
        return Promise.reject(error)
    })

export default http;