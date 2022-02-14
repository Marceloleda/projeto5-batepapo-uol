const promessa = axios.get('https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js');         //------ (request) solicitando acesso ao servidor
promessa.then(processarResposta);
promessa.catch(tratarErro);

function processarResposta(resposta){
    console.log("voltou a resposta");
}
console.log("Enviou a requisição");

function tratarErro(erro) {
    console.log("Status code: " + erro.response.status); // Ex: 404
    console.log("Mensagem de erro: " + erro.response.data); // Ex: Not Found
}

let nome;
prompt("Qual seu lindo nome?");



