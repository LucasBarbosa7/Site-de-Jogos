window.onload = function () {
  // Adicionando click nas imagens;

  document.getElementById("pedra").addEventListener("click", verific);
  document.getElementById("papel").addEventListener("click", verific);
  document.getElementById("tesoura").addEventListener("click", verific);

  // Placar;

  var user = document.getElementById("pUser");

  var comp = document.getElementById("pComp");

  var PlacarUser = 0;
  var PlacarComp = 0;

  // Função de verificação da opção escolhida;

  function verific() {
    var opcao = event.target.dataset;

    var numComp = Math.floor(Math.random() * 3);

    var OpcaoUser = opcao.letra;

    var OpcaoComp = "";

    // Conversor do número da máquina em letra;

    if (numComp == 0) {
      OpcaoComp = "a";
    } else if (numComp == 1) {
      OpcaoComp = "b";
    } else if (numComp == 2) {
      OpcaoComp = "c";
    }

    var divImg1 = document.getElementById("divImg1");
    var divImg2 = document.getElementById("divImg2");
    var divImg3 = document.getElementById("divImg3");

    // Verifica se a opção do usuário é 'a' (pedra)
    if (OpcaoUser == "a") {
      // Se a opção do computador também for 'a', é um empate
      if (OpcaoComp == "a") {
        // Adiciona a classe 'draw' para a animação de empate
        divImg1.classList.add("draw");

        // Remove a classe 'draw' após 1 segundo (tempo da animação)
        setTimeout(function () {
          divImg1.classList.remove("draw");
        }, 1000);
      }
      // Se a opção do computador for 'b' (papel), o computador ganha
      else if (OpcaoComp == "b") {
        // Incrementa o placar do computador
        PlacarComp++;

        // Atualiza o elemento HTML que exibe o placar do computador
        comp.innerHTML = PlacarComp;

        // Adiciona a classe 'loser' para a animação de derrota do usuário
        divImg2.classList.add("loser");

        // Remove a classe 'loser' após 1 segundo (tempo da animação)
        setTimeout(function () {
          divImg2.classList.remove("loser");
        }, 1000);
      }
      // Se a opção do computador for 'c' (tesoura), o usuário ganha
      else if (OpcaoComp == "c") {
        // Incrementa o placar do usuário
        PlacarUser++;

        // Atualiza o elemento HTML que exibe o placar do usuário
        user.innerHTML = PlacarUser;

        // Adiciona a classe 'winner' para a animação de vitória do usuário
        divImg1.classList.add("winner");

        // Remove a classe 'winner' após 1 segundo (tempo da animação)
        setTimeout(function () {
          divImg1.classList.remove("winner");
        }, 1000);
      }
    }


    // Similarmente, verifica se a opção do usuário é 'b' (papel) e processa as condições correspondentes.  
    else if (OpcaoUser == "b") {
      if (OpcaoComp == "b") {
        divImg2.classList.add("draw");
        setTimeout(function () {
          divImg2.classList.remove("draw");
        }, 1000);
      } else if (OpcaoComp == "c") {
        PlacarComp++;

        comp.innerHTML = PlacarComp;

        divImg3.classList.add("loser");
        setTimeout(function () {
          divImg3.classList.remove("loser");
        }, 1000);
      } else if (OpcaoComp == "a") {
        PlacarUser++;

        user.innerHTML = PlacarUser;

        divImg2.classList.add("winner");
        setTimeout(function () {
          divImg2.classList.remove("winner");
        }, 1000);
      }
    } 
    
    //Verifica se a opção do usuário é 'c' (tesoura) e processa as condições correspondentes.
    else if (OpcaoUser == "c") {
      if (OpcaoComp == "c") {
        divImg3.classList.add("draw");
        setTimeout(function () {
          divImg3.classList.remove("draw");
        }, 1000);
      } else if (OpcaoComp == "a") {
        PlacarComp++;

        comp.innerHTML = PlacarComp;

        divImg1.classList.add("loser");
        setTimeout(function () {
          divImg1.classList.remove("loser");
        }, 1000);
      } else if (OpcaoComp == "b") {
        PlacarUser++;

        user.innerHTML = PlacarUser;

        divImg3.classList.add("winner");
        setTimeout(function () {
          divImg3.classList.remove("winner");
        }, 1000);
      }
    }
  }
};
