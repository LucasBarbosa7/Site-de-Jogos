window.onload = function(){

    // Adicionando click nas imagens;

    document.getElementById('pedra').addEventListener('click', verific)
    document.getElementById('papel').addEventListener('click', verific)
    document.getElementById('tesoura').addEventListener('click', verific)

    // Placar;

    var user = document.getElementById('pUser')

    var comp = document.getElementById('pComp')

    var PlacarUser = 0
    var PlacarComp = 0


    // Função de verificação da opção escolhida;

    function verific(){

        var opcao = event.target.dataset

        var numComp = Math.floor(Math.random() * 3)
        
        var OpcaoUser = opcao.letra

        var OpcaoComp = ''

        // Conversor do número da máquina em letra;

        if(numComp == 0){
            OpcaoComp = 'a'
        }

        else if(numComp == 1){
            OpcaoComp = 'b'
        }

        else if(numComp == 2){
            OpcaoComp = 'c'
        }


        var divImg1 = document.getElementById('divImg1');
        var divImg2 = document.getElementById('divImg2');
        var divImg3 = document.getElementById('divImg3')


        // Verificando o vencedor;
        
        if(OpcaoUser == 'a'){

            if(OpcaoComp == 'a'){
                divImg1.classList.add('draw')

                setTimeout(function(){ divImg1.classList.remove('draw') }, 1000)

            }

            else if(OpcaoComp == 'b'){
                PlacarComp++
                
                comp.innerHTML = PlacarComp

                divImg2.classList.add('loser')
                setTimeout(function(){ divImg2.classList.remove('loser') }, 1000)

            }

            else if(OpcaoComp == 'c'){
                PlacarUser ++

                user.innerHTML = PlacarUser

                divImg1.classList.add('winner');
                setTimeout(function(){ divImg1.classList.remove('winner') }, 1000)

            }


        }

        else if(OpcaoUser == 'b'){

            if(OpcaoComp == 'b'){
                divImg2.classList.add('draw');
                setTimeout(function(){ divImg2.classList.remove('draw')}, 1000)

            }

            else if(OpcaoComp == 'c'){
                PlacarComp++
                
                comp.innerHTML = PlacarComp

                divImg3.classList.add('loser');
                setTimeout(function(){ divImg3.classList.remove('loser')}, 1000)

            }

            else if(OpcaoComp == 'a'){
                PlacarUser ++

                user.innerHTML = PlacarUser

                divImg2.classList.add('winner');
                setTimeout(function(){ divImg2.classList.remove('winner')}, 1000)

            }


        }


        else if(OpcaoUser == 'c'){

            if(OpcaoComp == 'c'){
                divImg3.classList.add('draw');
                setTimeout(function(){ divImg3.classList.remove('draw')}, 1000)

            }

            else if(OpcaoComp == 'a'){
                PlacarComp++
                
                comp.innerHTML = PlacarComp

                divImg1.classList.add('loser');
                setTimeout(function(){ divImg1.classList.remove('loser')}, 1000)

            }

            else if(OpcaoComp == 'b'){
                PlacarUser ++

                user.innerHTML = PlacarUser

                divImg3.classList.add('winner');
                setTimeout(function(){ divImg3.classList.remove('winner')}, 1000)

            }


        }

        
        
    }
}