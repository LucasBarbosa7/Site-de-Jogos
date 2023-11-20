// Seleciona o elemento HTML com a classe "currentPlayer" para exibir o jogador atual
const currentPlayer = document.querySelector(".currentPlayer");

// Variáveis globais
let selected;
let player = "X";

// Arrays que representam as posições no tabuleiro onde um jogador pode ganhar
let positions = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [1, 4, 7],
  [2, 5, 8],
  [3, 6, 9],
  [1, 5, 9],
  [3, 5, 7],
];

// Função de inicialização do jogo
function init() {
  selected = []; // Array para armazenar as jogadas

  // Exibe o jogador atual no HTML
  currentPlayer.innerHTML = `JOGADOR DA VEZ: ${player}`;

  // Adiciona event listeners para cada botão do jogo
  document.querySelectorAll(".game button").forEach((item) => {
    item.innerHTML = ""; // Limpa o conteúdo dos botões
    item.addEventListener("click", newMove); // Adiciona o evento de clique
  });
}

// Inicializa o jogo ao carregar a página
init();

// Função chamada quando um botão do jogo é clicado
function newMove(e) {
  const index = e.target.getAttribute("data-i"); // Obtém o índice do botão clicado
  e.target.innerHTML = player; // Define o conteúdo do botão como o símbolo do jogador
  e.target.removeEventListener("click", newMove); // Remove o evento de clique para evitar jogadas repetidas
  selected[index] = player; // Armazena a jogada no array 'selected'

  // Verifica o resultado do jogo após um breve intervalo (100ms)
  setTimeout(() => {
    check();
  }, [100]);

  // Alterna o jogador atual entre "X" e "O"
  player = player === "X" ? "O" : "X";
  // Atualiza a mensagem exibindo o jogador atual
  currentPlayer.innerHTML = `JOGADOR DA VEZ: ${player}`;
}

// Função para verificar o resultado do jogo
function check() {
  // Determina o símbolo do jogador adversário
  let playerLastMove = player === "X" ? "O" : "X";

  // Filtra os índices das jogadas feitas pelo jogador adversário
  const items = selected
    .map((item, i) => [item, i])
    .filter((item) => item[0] === playerLastMove)
    .map((item) => item[1]);

  // Verifica se o jogador adversário ganhou em alguma das posições possíveis
  for (pos of positions) {
    if (pos.every((item) => items.includes(item))) {
      alert("O JOGADOR '" + playerLastMove + "' GANHOU!");
      init(); // Reinicia o jogo
      return;
    }
  }

  // Verifica se houve empate (todos os espaços ocupados)
  if (selected.filter((item) => item).length === 9) {
    alert("DEU EMPATE!");
    init(); // Reinicia o jogo
    return;
  }
}
