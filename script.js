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
let encontroConfirmado = false;

function marcarSelecionado(seletor, valor) {
    document.querySelectorAll(seletor).forEach((botao) => {
        const selecionado = botao.getAttribute("onclick").includes("'" + valor + "'");
        botao.classList.toggle("selecionado", selecionado);
        botao.setAttribute("aria-pressed", selecionado ? "true" : "false");
    });
}

function escolherDia(dia) {
    diaEscolhido = dia;
    marcarSelecionado(".encontro .dias button", dia);
    document.getElementById("confirmacao").innerHTML = "";
}

function escolherPasseio(passeio) {
    passeioEscolhido = passeio;
    marcarSelecionado(".encontro .opcoes button", passeio);
    document.getElementById("confirmacao").innerHTML = "";
}

async function confirmarEncontro() {
    const confirmacao = document.getElementById("confirmacao");
    const botao = document.querySelector(".encontro > button");

    if (diaEscolhido === "" || passeioEscolhido === "") {
        confirmacao.innerHTML = "Escolha o dia e o passeio, meu amor! ❤️";
        return;
    }

    botao.disabled = true;
    confirmacao.innerHTML = "Salvando nosso encontro... 💗";

    try {
        const resposta = await fetch("/api/respostas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                tipo: "encontro",
                resposta: "Dia: " + diaEscolhido + " | Passeio: " + passeioEscolhido,
            }),
        });

        if (!resposta.ok) throw new Error("Falha ao salvar");

        encontroConfirmado = true;
        confirmacao.innerHTML =
            "Combinado! Nosso encontro vai ser no " + diaEscolhido +
            " e vamos para " + passeioEscolhido + "! Mal posso esperar! ❤️";
    } catch {
        confirmacao.innerHTML = "Não consegui salvar agora, tenta de novo, meu amor! 💗";
    } finally {
        botao.disabled = false;
    }
}
setInterval(criarCoracao, 700);
