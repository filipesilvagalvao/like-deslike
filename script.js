// Classe responsável por gerenciar os feedbacks (likes/dislikes)
// Faz a comunicação com a API para buscar e atualizar os valores
class Feedbacker {
    // URL da API mockada (endpoint privado da classe)
    #api = 'https://680bcc3f2ea307e081d25cc5.mockapi.io/liker'
    
    // Construtor da classe - inicializa os elementos da DOM
    constructor() {
        // Seleciona todos os elementos com classe 'num' (onde os números são exibidos)
        this.feedback = document.querySelectorAll('.num')
    }

    // Método para definir/atualizar os feedbacks
    // Parâmetros:
    // - typeMethod: tipo de requisição (GET ou PUT)
    // - id: ID do item a ser atualizado (opcional, usado apenas no PUT)
    // - likeAndDislike: valor do feedback (opcional, usado apenas no PUT)
    async setNumFeedbacks(typeMethod, id = '', likeAndDislike) {
        // Se for uma requisição PUT (atualização)
        if (typeMethod === 'PUT') {
            // Faz a requisição PUT para atualizar o feedback específico
            await fetch(`${this.#api}/${id}`, {
                method: typeMethod,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    numFeedback: Number(likeAndDislike)
                })
            })

            // Após atualizar, busca todos os dados novamente para garantir a consistência
            const respostaGeral = await fetch(this.#api)
            const dados = await respostaGeral.json()
            
            // Atualiza os valores na interface para ambos os feedbacks
            this.feedback[0].innerHTML = dados[0].numFeedback
            this.feedback[1].innerHTML = dados[1].numFeedback

        } else {
            // Se for uma requisição GET (busca inicial)
            const resposta = await fetch(this.#api)
            const dados = await resposta.json()
            
            // Define os valores iniciais dos feedbacks
            this.feedback[0].innerText = dados[0].numFeedback
            this.feedback[1].innerText = dados[1].numFeedback
            
            // Configura os eventos de pointer com base no localStorage
            // (para desabilitar novos clicks se já votou)
            document.querySelector('.feedback-container').style.pointerEvents = localStorage.getItem('feedback')
        }
    }
}

// Cria uma instância da classe Feedbacker e carrega os valores iniciais
const setReload = new Feedbacker()
setReload.setNumFeedbacks()  // Chama sem parâmetros para fazer GET inicial

// Configura os event listeners para os botões de like/dislike
document.querySelectorAll('.liker').forEach((like, index) => {
    // Seleciona todos os elementos que mostram os números
    const num = document.querySelectorAll('.num')
    
    // Adiciona um listener de clique para cada botão
    like.addEventListener('click', async () => {
        // Incrementa o número do feedback clicado
        let number = await Number(num[index].innerText)
        number++
        num[index].innerHTML = number
        
        // Desabilita novos clicks e armazena no localStorage
        document.querySelector('.feedback-container').style.pointerEvents = 'none'
        localStorage.setItem('feedback', 'none')
        
        // Cria nova instância e atualiza o valor na API
        const set = new Feedbacker()
        set.setNumFeedbacks('PUT', num[index].id, num[index].innerText)
    })
})