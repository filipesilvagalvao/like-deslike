//ao clicar adiciona um like ou deslike
//enviar dados para a api
document.querySelectorAll('.liker').forEach((like, index)=>{
    const num = document.querySelectorAll('.num');
    async function setFeedbackReload() {
        try {
            const resposta = await fetch(`https://680bcc3f2ea307e081d25cc5.mockapi.io/liker`);
    
            if (!resposta.ok) {
                throw new Error('Erro na requisição: ' + resposta.status);
            }
    
            const dados = await resposta.json();
            num[index].innerHTML = dados[index].numFeedback
            
        }catch (erro) {
            console.error('Erro:', erro);
        }
    }
    setFeedbackReload()
    like.style.pointerEvents = localStorage.getItem('feedback')
})

document.querySelectorAll('.liker').forEach((btn, index) => {
    
    btn.addEventListener('click', () => {
        const num = document.querySelectorAll('.num'); // NodeList de números
        const likers = document.querySelectorAll('.liker'); // NodeList de números
        likers[0].style.pointerEvents = 'none'
        likers[1].style.pointerEvents = 'none'
        
        let feedback = 0
        async function getFeedback() {
            try {
                const resposta = await fetch(`https://680bcc3f2ea307e081d25cc5.mockapi.io/liker`);

                if (!resposta.ok) {
                    throw new Error('Erro na requisição: ' + resposta.status);
                }

                const dados = await resposta.json();
                feedback = dados[index].numFeedback
                
                setFeedback();
            }catch (erro) {
                console.error('Erro:', erro);
            }
            
        }
        getFeedback()
        async function setFeedback() {
            try {
                const resposta = await fetch(`https://680bcc3f2ea307e081d25cc5.mockapi.io/liker/${index + 1}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: index + 1,
                        numFeedback: Number(feedback) + 1
                    })
                });

                if (!resposta.ok) {
                    throw new Error('Erro na requisição: ' + resposta.status);
                }

                const dados = await resposta.json();

                // Corrigido aqui: acessa diretamente a posição certa
                num[index].innerHTML = dados.numFeedback;
                blockFeedback()

            } catch (erro) {
                console.error('Erro:', erro);
            }
        }

        
    });
});

function blockFeedback(){
    localStorage.setItem('feedback','none')
}
//impede de dar novamente o feedback, só permite trocar
//regitra que já foi votado no localStorage