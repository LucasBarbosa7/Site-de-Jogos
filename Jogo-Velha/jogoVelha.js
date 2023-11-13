const currentPlayer = document.querySelector(".currentPlayer");

let selected;
let player = "X";

// Matriz que representa todas as combinações vencedoras no jogo da velha
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
  selected = [];

  // Atualiza a mensagem exibida no HTML para indicar o jogador da vez
  currentPlayer.innerHTML = `JOGADOR DA VEZ: ${player}`;

  // Adiciona eventos de clique para todos os botões do jogo
  document.querySelectorAll(".game button").forEach((item) => {
    item.innerHTML = "";
    item.addEventListener("click", newMove);
  });
}

init();

// Função chamada quando um novo movimento é feito
function newMove(e) {
  const index = e.target.getAttribute("data-i");// Obtém o índice do botão clicado
  e.target.innerHTML = player; // Define o conteúdo do botão como o jogador atual
  e.target.removeEventListener("click", newMove); // Remove o evento de clique do botão
  selected[index] = player; // Armazena o movimento do jogador no array

  // Aguarda um curto período antes de verificar o resultado do jogo
  setTimeout(() => {
    check();
  }, [100]);

  // Alterna entre jogadores (X e O)
  player = player === "X" ? "O" : "X";
  currentPlayer.innerHTML = `JOGADOR DA VEZ: ${player}`;// Atualiza a mensagem exibida no HTML para indicar o jogador da vez
}

// Função para verificar o resultado do jogo
function check() {
  // Determina o jogador que fez o último moviment
  let playerLastMove = player === "X" ? "O" : "X";

  // Filtra os índices das posições selecionadas pelo jogador que fez o último movimento
  const items = selected
    .map((item, i) => [item, i])
    .filter((item) => item[0] === playerLastMove)
    .map((item) => item[1]);

// Verifica se alguma combinação vencedora foi alcançada
  for (pos of positions) {
    if (pos.every((item) => items.includes(item))) {
      alert("O JOGADOR '" + playerLastMove + "' GANHOU!");
      init();
      return;
    }
  }

// Verifica se o jogo resultou em empate (todos os espaços preenchidos)
  if (selected.filter((item) => item).length === 9) {
    alert("DEU EMPATE!");
    init();
    return;
  }
}