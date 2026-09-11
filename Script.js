JavaScript

// Configuração do Canvas (Tela de Desenho)
const canvas = document.getElementById("telaJogo");
const ctx = canvas.getContext("2d");

// Pegando os elementos do placar no HTML
const elementoPontosJogador = document.getElementById("pontosJogador");
const elementoPontosComputador = document.getElementById("pontosComputador");

// Variáveis de Pontuação
let pontosJogador = 0;
let pontosComputador = 0;

// Variáveis da Bola
let bolaX = 300, bolaY = 200;
let bolaTamanho = 10;
let velocidadeBolaX = 4, velocidadeBolaY = 4;

// Variáveis das Raquetes
const raqueteLargura = 10, raqueteAltura = 80;
let jogadorY = 160;
let computadorY = 160;
let velocidadeJogador = 0;

// FUNÇÃO PARA GERAR SOM (Web Audio API)
// Frequência em Hertz (Ex: 150 para batida, 300 para ponto)
function emitirSom(frequencia) {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscilador = audioCtx.createOscillator();
    const ganho = audioCtx.createGain();

    oscilador.type = "square"; // Som estilo videogame retrô (8-bits)
    oscilador.frequency.setValueAtTime(frequencia, audioCtx.currentTime);
    
    ganho.gain.setValueAtTime(0.1, audioCtx.currentTime); // Volume baixo para não assustar
    ganho.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1); // Efeito de sumir rápido

    oscilador.connect(ganho);
    ganho.connect(audioCtx.destination);
    
    oscilador.start();
    oscilador.stop(audioCtx.currentTime + 0.1); // Duração do som (0.1 segundos)
}

// Controles do Teclado (Jogador)
window.addEventListener("keydown", (evento) => {
    if (evento.key === "w" || evento.key === "W") velocidadeJogador = -6;
    if (evento.key === "s" || evento.key === "S") velocidadeJogador = 6;
});

window.addEventListener("keyup", (evento) => {
    if (evento.key === "w" || evento.key === "W" || evento.key === "s" || evento.key === "S") {
        velocidadeJogador = 0;
    }
});

// Reiniciar a bola no centro após um ponto
function resetarBola(quemPontuou) {
    bolaX = 300;
    bolaY = 200;
    // Inverte o lado para onde a bola vai começar
    velocidadeBolaX = quemPontuou === "jogador" ? -4 : 4;
    velocidadeBolaY = 4;
}

// LOOP PRINCIPAL DO JOGO
function atualizarJogo() {
    // 1. Movimentação dos elementos
    jogadorY += velocidadeJogador;
    bolaX += velocidadeBolaX;
    bolaY += velocidadeBolaY;

    // Inteligência Artificial do Computador (Segue a bola)
    if (computadorY + raqueteAltura / 2 < bolaY) {
        computadorY += 3.8;
    } else {
        computadorY -= 3.8;
    }

    // Limites da raquete do jogador para não sair da tela
    if (jogadorY < 0) jogadorY = 0;
    if (jogadorY > canvas.height - raqueteAltura) jogadorY = canvas.height - raqueteAltura;

    // 2. Colisão da bola com teto e chão
    if (bolaY <= 0 || bolaY >= canvas.height - bolaTamanho) {
        velocidadeBolaY = -velocidadeBolaY;
        emitirSom(150); // Som grave para batida na parede
    }

    // 3. Colisão com a Raquete do Jogador (Esquerda)
    if (bolaX <= raqueteLargura + 10) {
        if (bolaY > jogadorY && bolaY < jogadorY + raqueteAltura) {
            velocidadeBolaX = -velocidadeBolaX;
            emitirSom(250); // Som médio para rebatida
        } else if (bolaX < 0) {
            pontosComputador++;
            elementoPontosComputador.innerText = pontosComputador;
            emitirSom(100); // Som de erro (ponto do oponente)
            resetarBola("computador");
        }
    }

    // 4. Colisão com a Raquete do Computador (Direita)
    if (bolaX >= canvas.width - raqueteLargura - 10) {
        if (bolaY > computadorY && bolaY < computadorY + raqueteAltura) {
            velocidadeBolaX = -velocidadeBolaX;
            emitirSom(250); // Som médio para rebatida
        } else if (bolaX > canvas.width) {
            pontosJogador++;
            elementoPontosJogador.innerText = pontosJogador;
            emitirSom(450); // Som agudo/alegre para ponto do jogador!
            resetarBola("jogador");
        }
    }

    // 5. DESENHAR OS ELEMENTOS NA TELA
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o frame anterior

    ctx.fillStyle = "white";
    // Desenha raquete do jogador
    ctx.fillRect(10, jogadorY, raqueteLargura, raqueteAltura);
    // Desenha raquete do computador
    ctx.fillRect(canvas.width - raqueteLargura - 10, computadorY, raqueteLargura, raqueteAltura);
    // Desenha a bola
    ctx.fillRect(bolaX, bolaY, bolaTamanho, bolaTamanho);

    // Linha tracejada no meio de campo (estética clássica do Pong)
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.strokeStyle = "#333";
    ctx.stroke();

    // Chama o próximo frame da animação
    requestAnimationFrame(atualizarJogo);
}

// Inicia o jogo
atualizarJogo();



