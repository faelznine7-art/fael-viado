function salvarResposta(tipo, resposta) {
    fetch("/api/respostas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo, resposta }),
        keepalive: true,
    }).catch(() => {});
}

function mostrarMensagem() {
    salvarResposta("mensagem", "Clicou no botão da mensagem");
    document.getElementById("mensagem").innerHTML =
        "Você é uma das melhores coisas que já aconteceram na minha vida! ❤️";
}

function responder(correto) {
    const resultado = document.getElementById("resultado");
    salvarResposta("quiz", correto ? "05/09/2026 (acertou)" : "12/10/2026 (errou)");


    if (correto) {
        resultado.innerHTML = "Acertou! Essa data é muito especial! ❤️";
    } else {
        resultado.innerHTML = "Ops! Tente novamente, meu amor! 💗";
    }
}

// Contador desde 05/09/2026
function atualizarContador() {
    const inicio = new Date(2026, 8, 5);
    const agora = new Date();

    const diferenca = agora - inicio;

    if (diferenca < 0) {
        document.getElementById("tempo").innerHTML =
            "Nossa história está começando! ❤️";
        return;
    }

    const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
    const horas = Math.floor(diferenca / (1000 * 60 * 60) % 24);
    const minutos = Math.floor(diferenca / (1000 * 60) % 60);
    const segundos = Math.floor(diferenca / 1000 % 60);

    document.getElementById("tempo").innerHTML =
        `${dias} dias, ${horas} horas, ${minutos} minutos e ${segundos} segundos`;
}

setInterval(atualizarContador, 1000);
atualizarContador();

// Corações flutuantes
function criarCoracao() {
    const coracao = document.createElement("div");

    coracao.classList.add("heart");
    coracao.innerHTML = "❤️";

    coracao.style.left = Math.random() * 100 + "vw";
    coracao.style.fontSize = (Math.random() * 15 + 12) + "px";
    coracao.style.animationDuration = (Math.random() * 3 + 4) + "s";

    document.getElementById("hearts").appendChild(coracao);

    setTimeout(() => {
        coracao.remove();
    }, 7000);
}
let diaEscolhido = "";
let passeioEscolhido = "";

function escolherDia(dia) {
    diaEscolhido = dia;
    salvarResposta("dia", dia);
}

function escolherPasseio(passeio) {
    passeioEscolhido = passeio;
    salvarResposta("passeio", passeio);
}

function confirmarEncontro() {
    if (diaEscolhido === "" || passeioEscolhido === "") {
        document.getElementById("confirmacao").innerHTML =
            "Escolha o dia e o passeio, meu amor! ❤️";
        return;
    }

    salvarResposta("encontro", diaEscolhido + " - " + passeioEscolhido);

    document.getElementById("confirmacao").innerHTML =
        "Nosso encontro será domingo? Não! Será " +
        diaEscolhido + " e vamos para " +
        passeioEscolhido +
        "! Mal posso esperar! ❤️";
}
setInterval(criarCoracao, 700);
