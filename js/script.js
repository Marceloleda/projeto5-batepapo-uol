const UOL_API = "https://mock-api.driven.com.br/api/v4/uol";
let usuario;
const TEMPOOBTERMENSAGENS = 3000;
const TEMPOATUALIZACAOCONEXAO = 5000;

function obterMensagens() {
    const promise = axios.get(`${UOL_API}/messages`);
    promise.then(resposta => {
      console.log(resposta.data);
      renderizarMensagens(resposta.data);
      focarNaUltimaMensagem();
    });
    promise.catch( erro => {
      console.error(erro.response);
      alert("erro na hora de receber mensagens!");
    })
  }
function nomeUsuario() {
    usuario = prompt("digite o seu lindo nome: ");
    const promise = axios.post(`${UOL_API}/participants`, { name: usuario });
    promise.then(() => {
      obterMensagens();
  
      setInterval(obterMensagens, TEMPOOBTERMENSAGENS);
      setInterval(manterUsuario, TEMPOATUALIZACAOCONEXAO);
    });
    promise.catch(erro => nomeUsuario());
  }

  function renderizarMensagens(mensagens) {
    const ul = document.querySelector("main ul");
    ul.innerHTML = "";
  
    mensagens.forEach( mensagem => {
      const tipo = mensagem.type;
      const texto = mensagem.text;
      const remetente = mensagem.from;
      const destinatario = mensagem.to;
      const horario = mensagem.time;
  
      let mensagemHTML;
      if(tipo === "status") {
        mensagemHTML = `
        <li class="mensagem status">
          <span class="horario">(${horario})</span>
          <span class="pessoas"><b>${remetente}</b></span>
          <span class="texto">${texto}</span>
        </li>
        `
      } else {
        if(tipo === "message") {
          mensagemHTML = `
          <li class="msg publica">
          <span class="horario">(${horario})</span>
            <span class="pessoas"><b>${remetente}</b> para <b>${destinatario}</b>: </span>
            <span class="texto">${texto}</span>
          </li>
          `;
        } else {
          
            if(remetente === usuario || destinatario === usuario){
            mensagemHTML = `
            <li class="msg reservada">
            <span class="horario">(${horario})</span>
              <span class="pessoas"><b>${remetente}</b> reservadamente para <b>${destinatario}</b>: </span>
              <span class="texto">${texto}</span>
            </li>
            `;
          }
        }
      }
      if(mensagemHTML !== null) {
        ul.innerHTML += mensagemHTML;
      }
    })
}

function focarNaUltimaMensagem() {
    const ul = document.querySelector("main ul");
    const ultimaMensagem = ul.lastElementChild;
    ultimaMensagem.scrollIntoView();
  }
  
  function enviarMensagem() {
    const input = document.querySelector("footer input");
    const mensagem = input.value;
    const promise = axios.post(`${UOL_API}/messages`, {
      from: usuario,
      to: "Todos",
      text: mensagem,
      type: "message"
    });
  
    promise.then(function(response){
      console.log("Mensagem enviada, sucesso!");
    });
    promise.catch(function (erro) {
      console.error("Erro na hora de enviar mensagem!");
      alert("mensagem não enviada!");
    });
  
    input.value = "";
    
  }
  
  function manterUsuario() {
    const promise = axios.post(`${UOL_API}/status`, { name: usuario });
    promise.then(resposta => console.info("Usuário continua ativo"));
    promise.catch(erro => {
      console.error(erro.response);
      alert("Ops! Parece que você caiu! (ou foi kickado...)");
      window.location.reload();
    })
  }
  nomeUsuario();
