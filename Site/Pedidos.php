<?php
session_start();
if (!isset($_SESSION['nome'])) {
  header('Location: index.html');
  exit;
}
require_once 'config.php';
$conexao->close();
include 'fetchOrders.php';
$timePeriod = isset($_GET['timePeriod']) ? $_GET['timePeriod'] : null;
?>

<!DOCTYPE html>
<html lang="PT-BR">

<head>
  <title>GULOSEIMA</title>
  <link rel="stylesheet" href="style.css" />
  <link rel="icon" href="Imagens/GULOSEIMA LOGO NOVO.png">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
  <style>
    body {
      overflow: hidden;
    }

    .main {
      flex: 1;
    }

    .main-body {
      max-height: 97vh;
      overflow-y: auto;
    }

    .user-name {
      color: #D35400;
      font-weight: bold;
      margin-right: 20px;
      display: flex;
      align-items: center;
    }

    .user-name i {
      margin-right: 8px;
    }

    .job_card {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      border: 1px solid #ddd;
      padding: 10px;
      width: 99%;
      margin-bottom: 10px;
      border-radius: 8px;
      background-color: #fff;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: border 0.4s;
    }

    .produtos {
      display: flex;
      height: 50px;
      margin-bottom: 20px;
      flex-direction: row;
      align-items: center;
    }
    


    #search-bar {
      padding: 10px;
      width: 70%;
      border: 1px solid #ccc;
      border-radius: 4px;
    }

    .search-bar {
      display: flex;
      height: 50px;
      margin-bottom: 20px;
      flex-direction: row;
      align-items: center;
    }

    .search-bar input,
    .search-bar select,
    .search-bar button {
      border-radius: 8px;
      height: 50px;
      margin: 0 20px 10px 0;
    }

    .search-bar input {
      width: 70%;
    }

    .search-bar select {
      width: 150px;
      padding: 0 10px;
      border: 1px solid rgb(190, 190, 190);
    }

    #acceptButton {
      --color: #48de26;
      font-family: inherit;
      display: inline-block;
      width: 28%;
      height: 2.6em;
      line-height: 2.5em;
      position: absolute;
      overflow: hidden;
      border: 2px solid var(--color);
      transition: color .5s;
      z-index: 0;
      font-size: 22px;
      font-weight: 800;
      border-radius: 6px;
      color: var(--color);
      bottom: 20px;
      right: 20px;
    }
    
  

    #acceptButton:before {
      content: "";
      position: absolute;
      z-index: -1;
      background: var(--color);
      height: 150px;
      width: 200px;
      border-radius: 50%;
    }

    #acceptButton:hover {
      color: #fff;
    }

    #acceptButton:before {
      top: 100%;
      left: 100%;
      transition: all .7s;
    }

    #acceptButton:hover:before {
      top: -30px;
      left: -30px;
    }

    #acceptButton:active:before {
      background: #48de26;
      transition: background 0s;
    }

    .close {
      font-weight: 700;
      background: linear-gradient(0deg, #f29446 0%, #ed842b 50%, #E26A05 100%);
      border: none;
      outline: none;
      color: #ffffff;
      font-size: 19px;
      text-align: center;
      padding: 10px;
      cursor: pointer;
      border-radius: 8px;
      box-shadow: 0px 0px 0px 0px #FFFFFF, 0px 0px 0px 0px #000000;
      transition: all 0.3s cubic-bezier(0.15, 0.83, 0.66, 1);
      height: 40px;
      width: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      right: 20px;
      top: 20px;
    }

    .close:hover {
      box-shadow: 0px 0px 0px 2px #FFFFFF, 0px 0px 0px 4px #0000003a;
    }

    .modal {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.3);
      z-index: 1000;
      border-radius: 0px;
      overflow: auto;
    }

    .modal-content {
      background-color: #fefefe;
      border-radius: 11px;
      padding: 20px;
      border: 1px solid #888;
      width: 80%;
      max-width: 600px;
      margin: 15% auto;
      position: relative;
    }
  </style>
</head>

<body>
  <div class="container">
    <nav>
      <div class="navbar">
        <div class="logo">
          <img src="Imagens/GULOSEIMA LOGO NOVO.png" alt>
          <h1>GULOSEIMA</h1>
        </div>
        <ul>
          <li class="user-name">
            <i class="fas fa-user-circle"></i> 
            Bem-vindo, <?php echo $_SESSION['nome']; ?>!
          </li>
          <li><a href="compraPresencial.php">
              <i class="fas fa-solid fa-cash-register"></i>
              <span class="nav-item">Compra
                presencial</span>
            </a>
          </li>
          <li><a href="cardapioAlimentos.php">
              <i class="fas fa-solid fa-chart-bar fa-rotate-90"></i>
              <span class="nav-item">Estoque</span>
            </a>
          </li>
          <li><a href="cadastroAlimentos.php">
              <i class="fas fa-solid fa-hamburger"></i>
              <span class="nav-item">Cadastro alimentos</span>
            </a>
          </li>
          <li><a href="cadastrotipos.php">
              <i class="fas fa-solid fa-list"></i>
              <span class="nav-item">Cadastro tipos </span>
            </a>
          </li>
          <li><a href="cadastrohorarios.php">
              <i class="fas fa-solid fa-clock"></i>
              <span class="nav-item">Cadastro horarios</span>
            </a>
          </li>
          <li><a href="Pedidos.php">
              <i class="fas fa-solid fa-bell" style="color: #ed842b;"></i>
              <span class="nav-item" style="color: #ed842b; font-weight: 600;">Pedidos</span>
            </a>
          </li>

          <li><a href="telaGraficos.php">
              <i class="fas fa-solid fa-chart-pie"></i>
              <span class="nav-item">Estatísticas</span>
            </a>
          </li>

          <?php if (isset($_SESSION['id']) && $_SESSION['id'] == 1) { ?>
            <li><a href="adicionarAdmin.php">
                <i class="fas fa-solid fa-user-plus"></i>
                <span class="nav-item">Adicionar Admin</span>
              </a>
            </li>
          <?php } ?>


          <li><a href="AdicionarCredito.php">
              <i class="fas fa-coins"></i>
              <span class="nav-item">Crédito</span>
            </a>
          </li>


          <li><a href="tela-login/index.html">
              <i class="fas fa-solid fa-power-off"></i>
              <span class="nav-item">Sair</span>
            </a>
          </li>
        </ul>
      </div>
    </nav>
    <section class="main">
      <div class="main-top">
        <p>Gerencie Seu Estabelecimento!</p>
      </div>
      <div class="main-body">
        <h1>Pedidos</h1>
          
        <div class="search-bar">
          <input type="number" id="search-bar" placeholder="Digite o código do pedido...">
          <button id="search-button" class="btn">Buscar</button>
          <hr style="height: 40px; border: none; border-left: 1px solid #bbb; margin: 0px 25px 7px 8px;">
          <form method="GET" action="pedidos.php" style="display: flex; align-items: center; margin: 0;">


            <select name="tipoPedido" id="tipoPedido">
              <option value="">Realizado por:</option>
              <option value="">Todos</option>
              <option value="alunos">Aplicativo</option>
              <option value="presencial">Presencial</option>
            </select>

            <select name="timePeriod" id="timePeriod">
            </select>
            <button class="btn" type="submit">Filtrar</button>
          </form>
          
          <hr style="height: 40px; border: none; border-left: 1px solid #bbb; margin: 0px 28px 7px 8px;">
          <button id="botaoprodutos" style="width: 30%;" class="btn" onclick="window.location.href='apenasprodutos.php'">Apenas Produtos</button>

          
        </div>


        <div class="orders" id="order-list">
        <div class="orders" id="order-list">
  <?php
  $orders = fetchOrders($timePeriod);

  if (empty($orders)) {
    echo '<p>Nenhum pedido encontrado.</p>';
  } else {
    foreach ($orders as $order) {
      if ($order['FK_estudante_id'] != 1) {
        if ($order['statusPedido'] == 'Aguardando Pagamento') {
          $mensagem = 'Relizado pelo Aplicativo - Aguardando Pagamento';
          $cor = 'red'; 
        } else {
          $mensagem = 'Relizado pelo Aplicativo - Pagamento realizado';
          $cor = '#00b825';
        }
      } else {
        $mensagem = null; 
      }

      echo '<div class="job_card" style="align-items: center;" id="pedido-' . htmlspecialchars($order['codigoConfirmacao']) . '">';
      echo '<div class="job_details">';

      echo '<div class="text show-popup" style="display: flex; align-items: center;">';
      echo '<span style="padding-right: 10px;">Pedido feito por:</span>';
      echo '<h3>' . htmlspecialchars($order['estudanteNome']) . '</h3>';
      if ($mensagem) {
        echo '<span style="color: ' . $cor . '; font-weight: bold; padding-left: 20px;">' . $mensagem . '</span>';
      }
      echo '</div>';
      echo '<h4 style="padding-left: 35px">Valor do Pedido: R$ ' . number_format($order['totalPedido'], 2, ',', '.') . '</h4>';
      echo '</div>';
      

      echo '<div class="job_salary">';      
      echo '<div class="PB-range-slider-div"></div>';      
      echo '<button class="buttonAlt">Conferir</button>';
      echo '</div>';
      echo '</div>';
      
    }
  }
  ?>
</div>


        <!-- Modal -->
        <div id="orderModal" class="modal">
          <div class="modal-content">
            <button class="close">x</button>
            <h2>Detalhes do Pedido</h2>
            <div id="modalBody">
              <!-- Informações do pedido serão carregadas aqui -->
            </div>
            <button id="acceptButton" style="display: none;" onClick="acceptOrder()">✔ - Aceitar</button>
          </div>
        </div>
      </div>
    </section>
  </div>

  <script>
    document.addEventListener('DOMContentLoaded', function() {
      var modal = document.getElementById('orderModal');
      var closeButton = document.querySelector('.close');

      function formatarDataParaPTBR(dataISO) {
        const data = new Date(dataISO);
        if (isNaN(data.getTime())) {
          return 'Data inválida';
        }
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
        return `${dia}/${mes}/${ano}`;
      }


      // Função para abrir o modal e carregar informações do pedido
    // Função para abrir o modal e carregar informações do pedido
function openModal(codigoConfirmacao) {
  fetch(`fetchOrderDetails.php?codigoConfirmacao=${codigoConfirmacao}`)
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        document.getElementById('modalBody').innerHTML = `<p>${data.error}</p>`;
      } else {
        const produtos = data.produtos.map(produto =>
          `<p>${produto.nomeProd} - Quantidade: ${produto.quantidade}</p>`
        ).join('');

        let mensagem = '';
        
        // Verifica o status do pedido e exibe a mensagem se necessário
        if (data.statusPedido === 'Aguardando Pagamento') {
          mensagem = '<p style="color: red; font-weight: bold;">Verifique se o pedido já foi pago.</p>';
        }

        document.getElementById('modalBody').innerHTML = `
          <p><strong>Código do Pedido:</strong> ${data.codigoConfirmacao}</p>
          <p><strong>Nome:</strong> ${data.estudanteNome}</p>
          <p><strong>Descrição:</strong> ${produtos}</p>
          <p><strong>Total:</strong> R$ ${data.totalPedido}</p>
          <p><strong>Data:</strong> ${data.dataPedido}</p>
        <p>  ${mensagem} </p>
        `;
        
        document.getElementById('acceptButton').onclick = function() {
          acceptOrder(data.codigoConfirmacao);
        };
        document.getElementById('acceptButton').style.display = 'block';
        modal.style.display = 'block'; // Exibe o modal
      }
    })
    .catch(error => {
      console.error('Erro ao buscar detalhes do pedido:', error);
    });
}


      // Evento para fechar o modal
      closeButton.onclick = function() {
        modal.style.display = 'none';
      }

      window.onclick = function(event) {
        if (event.target === modal) {
          modal.style.display = 'none';
        }
      }

      // Adiciona o evento de clique ao botão "Conferir"
      document.querySelectorAll('.buttonAlt').forEach(button => {
        button.addEventListener('click', function() {
          var codigoConfirmacao = this.parentElement.parentElement.id.split('-')[1];
          openModal(codigoConfirmacao);
        });
      });

      document.getElementById('search-button').addEventListener('click', function() {
        filterOrders();
      });

      function filterOrders() {

        const searchValue = document.getElementById('search-bar').value.toUpperCase();
        if (!/^\d{4}$/.test(searchValue)) {
          alert('Por favor, digite um código de pedido com exatamente 4 dígitos.'); 
          return;
        }
        const orders = document.querySelectorAll('.job_card');
        let foundOrder = false; 

        orders.forEach(order => {
          const codigoConfirmacao = order.id.split('-')[1];
          if (codigoConfirmacao.includes(searchValue)) {
            order.style.display = 'block'; 
            foundOrder = true; 
            openModal(codigoConfirmacao); 
          } else {
            order.style.display = 'none'; 
          }
        });

        if (!foundOrder) {
          alert('Nenhum pedido encontrado para o código informado.'); 
        }
      }

     

  // Função para abrir o modal e carregar informações do pedido
  function openModal(codigoConfirmacao) {
    fetch(`fetchOrderDetails.php?codigoConfirmacao=${codigoConfirmacao}`)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          document.getElementById('modalBody').innerHTML = `<p>${data.error}</p>`;
        } else {
          const produtos = data.produtos.map(produto =>
            `<p>${produto.nomeProd} - Quantidade: ${produto.quantidade}</p>`
          ).join('');

          let mensagem = '';
          
          // Verifica o status do pedido e exibe a mensagem se necessário
          if (data.statusPedido === 'Aguardando Pagamento') {
            mensagem = '<p style="color: red; font-weight: bold;">Verifique se o pedido já foi pago.</p>';
          }

          document.getElementById('modalBody').innerHTML = `
            <p><strong>Código do Pedido:</strong> ${data.codigoConfirmacao}</p>
            <p><strong>Nome:</strong> ${data.estudanteNome}</p>
            <p><strong>Descrição:</strong> ${produtos}</p>
            <p><strong>Total:</strong> R$ ${data.totalPedido}</p>
            <p><strong>Data:</strong> ${formatarDataParaPTBR(data.dataPedido)}</p>
            ${mensagem}
          `;
          
          document.getElementById('acceptButton').onclick = function() {
            acceptOrder(data.codigoConfirmacao);
          };
          document.getElementById('acceptButton').style.display = 'block';
          modal.style.display = 'block'; // Exibe o modal
        }
      })
      .catch(error => {
        console.error('Erro ao buscar detalhes do pedido:', error);
      });
  }

  // Função para fechar o modal
  closeButton.onclick = function() {
    modal.style.display = 'none';
  }

  window.onclick = function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  }
});


    setInterval(function() {
      fetch('fetchOrders.php')
        .then(response => response.text())
        .then(data => {
          const parser = new DOMParser();
          const tempContainer = parser.parseFromString(data, 'text/html');
          const newOrders = tempContainer.querySelectorAll('.job_card');

          newOrders.forEach(order => {
            const orderId = order.id;
            if (!document.getElementById(orderId)) {
              document.querySelector('.orders').appendChild(order);
            }
          });
        });
    }, 5000);

    function acceptOrder(codigoConfirmacao) {
    // Faz uma requisição para verificar o status do pedido
    fetch(`getOrderStatus.php?codigoConfirmacao=${codigoConfirmacao}`)
        .then(response => response.json())
        .then(data => {
            if (data.statusPedido === "Aguardando Pagamento") {
                // Exibe a primeira mensagem de confirmação
                const confirmacao1 = confirm("Tem certeza que deseja aceitar este pedido?");
                if (confirmacao1) {
                    // Exibe a segunda mensagem de confirmação apenas se o status for 'Aguardando Pagamento'
                    const confirmacao2 = confirm("Antes de aceitar, verifique se este pedido já foi pago.");
                    if (confirmacao2) {
                        // Faz a requisição para atualizar o status do pedido para "Retirado"
                        fetch(`updateOrderStatus.php?codigoConfirmacao=${codigoConfirmacao}&statusPedido=Retirado`)
                            .then(response => response.json())
                            .then(data => {
                                if (data.success) {
                                    alert("Pedido finalizado com sucesso.");
                                    location.reload(); // Recarrega a página para atualizar os dados
                                } else {
                                    alert("Erro ao atualizar o status do pedido.");
                                }
                            })
                            .catch(error => {
                                console.error("Erro ao aceitar o pedido:", error);
                                alert("Erro na solicitação.");
                            });
                    } else {
                        alert("Ação cancelada.");
                    }
                } else {
                    alert("Ação cancelada.");
                }
            } else {
                // Se o status não for 'Aguardando Pagamento', aceita o pedido diretamente
                const confirmacao1 = confirm("Tem certeza que deseja aceitar este pedido?");
                if (confirmacao1) {
                    // Faz a requisição para atualizar o status do pedido para "Retirado"
                    fetch(`updateOrderStatus.php?codigoConfirmacao=${codigoConfirmacao}&statusPedido=Retirado`)
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                alert("Pedido finalizado com sucesso.");
                                location.reload(); // Recarrega a página para atualizar os dados
                            } else {
                                alert("Erro ao atualizar o status do pedido.");
                            }
                        })
                        .catch(error => {
                            console.error("Erro ao aceitar o pedido:", error);
                            alert("Erro na solicitação.");
                        });
                } else {
                    alert("Ação cancelada.");
                }
            }
        })
        .catch(error => {
            console.error("Erro ao verificar o status do pedido:", error);
            alert("Erro na solicitação.");
        });
}



    document.addEventListener('DOMContentLoaded', function() {
      // Função para carregar os horários
      fetch('fetchHorarios.php')
        .then(response => response.json())
        .then(horarios => {
          const select = document.getElementById('timePeriod');
          select.innerHTML = '<option value="">Horário</option>';
          horarios.forEach(horario => {
            const option = document.createElement('option');
            option.value = horario;
            option.textContent = horario;
            select.appendChild(option);
          });
        })
        .catch(error => {
          console.error('Erro ao carregar horários:', error);
        });


    });
    document.addEventListener('DOMContentLoaded', function() {
      // Função para filtrar pedidos com base no tipo de pedido selecionado
      function filterOrdersByType() {
        const orders = document.querySelectorAll('.job_card'); // Seleciona todos os pedidos
        const tipoPedido = document.getElementById('tipoPedido').value; // Obtém o valor do tipo selecionado
        let foundOrder = false; // Variável para verificar se encontrou um pedido

        orders.forEach(order => {
          const estudanteNome = order.querySelector('h3').innerText; // Obtém o nome do estudante
          let shouldDisplay = false;

          if (tipoPedido === "") {
            // Exibe todos os pedidos se "Todos" estiver selecionado
            shouldDisplay = true;
          } else if (tipoPedido === "alunos" && estudanteNome !== "Compra Presencial") {
            shouldDisplay = true;
          } else if (tipoPedido === "presencial" && estudanteNome === "Compra Presencial") {
            shouldDisplay = true;
          }

          order.style.display = shouldDisplay ? 'flex' : 'none';

          if (shouldDisplay) {
            foundOrder = true;
          }
        });

        if (!foundOrder) {
          const alertMessage = tipoPedido === "alunos" ?
            'Nenhum pedido encontrado pelo aplicativo.' :
            (tipoPedido === "presencial" ? 'Nenhum pedido encontrado para compras presenciais.' : '');

          if (alertMessage) {
            alert(alertMessage);
          }
        }
      }
      document.getElementById('tipoPedido').addEventListener('change', filterOrdersByType);
    });
  </script>


</body>

</html>
