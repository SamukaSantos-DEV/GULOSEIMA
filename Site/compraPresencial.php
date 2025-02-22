<?php
session_start();


// Verificar se o usuário está logado
if (!isset($_SESSION['nome'])) {
  header('Location: index.html');
  exit;
}
require_once 'config.php';

$sql = "SELECT id, quantidade, nomeProd, valor, imagem, disponibilidade FROM produto WHERE disponibilidade = 1";
$result = $conexao->query($sql);

$sql_categories = "SELECT DISTINCT tipoproduto, produto.disponibilidade FROM tipoproduto
INNER JOIN produto ON tipoproduto.id = produto.fk_tipoProduto_id
WHERE disponibilidade = 1";
$result_categories = $conexao->query($sql_categories);

// Obter a quantidade total de produtos
$sql_count = "SELECT COUNT(*) as total FROM produto";
$result_count = $conexao->query($sql_count);

$total_products = 0;

$result_count = $conexao->query("SELECT COUNT(*) as total FROM produto WHERE disponibilidade = 1");

if ($result_count->num_rows > 0) {
  $row_count = $result_count->fetch_assoc();
  $total_products = $row_count['total'];
}



?>


<!DOCTYPE html>
<html lang="en">

<head>
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <title>GULOSEIMA</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
  <link rel="stylesheet" href="style.css" />
  <link rel="icon" href="Imagens/GULOSEIMA LOGO NOVO.png">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

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

    .containerf {
      gap: 20px;
      width: 74%;
      justify-content: center;
    }

    .job_cardmin {
      border: 1px solid #ccc;
      padding: 20px;
      width: 100%;
      border-radius: 10px;
      flex-direction: column;
      align-items: center;
      text-align: center;

    }

    .img img {
      height: 80px;
    }

    .buttons {
      margin-top: 20px;
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

    .job_cardmin {
      border: 1px solid #ccc;
      padding: 20px;
      padding-top: 30px;
      width: 100%;
      border-radius: 10px;
      flex-direction: column;
      align-items: center;
      text-align: center;
      margin-left: 10px;
    }

    .containerf .job_cardmin:first-child {
      margin-left: 15px;
    }
    .suggestions {
    position: absolute;
    top: 34%; /* Move as sugestões para abaixo da caixa de input */
    left: 6%;
    border-radius: 10px;
    background: white;
    list-style: none;
    padding: 0;
    margin: 0;
    
    font-size: 13px;
    z-index: 1000;
    width: calc(90% - 10px);
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); /* Adiciona um sombreamento para destaque */
}

.suggestions li {
    padding: 8px;
    cursor: pointer;
}

.suggestions li:hover {
    background-color: #f0f0f0;
    border-radius: 10px;
}
  </style>
</head>

<body>

  <dialog id="modalConfirmacao" style="top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        position: absolute;
        padding: 20px; border-radius: 20px;        
        animation:fadeIn;
        animation-duration: 1s;">
    <p style="text-align: center; font-weight: 600; font-size: 20px;">O estudante possui conta?</p>
    <div class="containert" style="justify-content: center;">
      <button id="possuiConta" onclick="temconta()" class="buttonAcet">Sim</button>
      <button id="naoPossuiConta" onclick="naotemconta()" class="buttonDel">Não</button>

    </div>
  </dialog>

  <!-- Modal opção "Tem Conta" -->
  <!-- Modal opção "Tem Conta" -->
  <dialog id="modaltemconta" style="top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      position: absolute;
      padding: 20px; border-radius: 20px;
      animation:fadeIn;
      animation-duration: 1s;
      ">
    <p style="text-align: center; font-weight: 600; font-size: 20px;">Inserir email do aluno:</p>
    <div class="containert" style="justify-content: center;">
      <input id="email_field" type="text" id="email_field" placeholder="Email" style="padding: 5px; border: 1px solid rgb(175, 175, 175); border-radius: 5px; width: 100%; margin: 10px 0;">
      <ul id="email_suggestions" class="suggestions"></ul>
    </div>
    <p style="text-align: center; font-weight: 600; font-size: 20px;">Inserir token de segurança:</p>
    <div class="containert" style="justify-content: center;">
        <input type="text" id="token_field" placeholder="Token" style="padding: 5px; border: 1px solid rgb(175, 175, 175); border-radius: 5px; width: 100%; margin: 10px 0;">
    </div>
    <div class="containert" style="justify-content: center;">
      <button id="confirmarTemConta" class="buttonAcet">Confirmar</button>
      <button id="naotemconta3" class="buttonDel" onclick="naotemconta3()">Cancelar</button>
    </div>
  </dialog>
  <script>
        document.addEventListener('DOMContentLoaded', function () {
            const emailInput = document.getElementById('email_field');
            const suggestionsContainer = document.getElementById('email_suggestions');

            emailInput.addEventListener('input', function () {
                const searchTerm = emailInput.value.trim();

                if (searchTerm.length > 1) {
                    fetch(`buscarEmails.php?term=${encodeURIComponent(searchTerm)}`)
                        .then(response => response.json())
                        .then(data => {
                            suggestionsContainer.innerHTML = '';
                            if (data.length > 0) {
                                data.forEach(email => {
                                    const li = document.createElement('li');
                                    li.textContent = email;
                                    li.addEventListener('click', function () {
                                        emailInput.value = email;
                                        suggestionsContainer.innerHTML = '';
                                    });
                                    suggestionsContainer.appendChild(li);
                                });
                            } else {
                                const li = document.createElement('li');
                                li.textContent = 'Nenhum email encontrado';
                                suggestionsContainer.appendChild(li);
                            }
                        })
                        .catch(error => console.error('Erro ao buscar emails:', error));
                } else {
                    suggestionsContainer.innerHTML = '';
                }
            });

            document.addEventListener('click', function (e) {
                if (!emailInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
                    suggestionsContainer.innerHTML = '';
                }
            });
        });
    </script>

  <script>
    document.getElementById('confirmarTemConta').addEventListener('click', () => {
  const emailInput = document.querySelector('#modaltemconta input[type="text"]');
  const email = emailInput.value.trim();
  const tokenInput = document.querySelector('#token_field');
  const token = tokenInput.value.trim();

  console.log("Token Inserido:", token); // Verifica o token inserido


  // Verifica se o email termina com @etec.sp.gov.br
  if (!email.endsWith('@etec.sp.gov.br')) {
    alert('O email deve ser válido');
    return; // Impede o envio do formulário e a navegação para a próxima tela
  }

  // Valida o token
  if (token === '') {
    alert('O token de segurança é obrigatório');
    return; // Impede a continuidade até que o token seja preenchido
  }

  $.ajax({
    url: 'verificar_email.php',
    type: 'POST',
    data: {
      email: email
    },
    success: function(response) {
      if (response == "true") {
        // Verifica o token no banco de dados
        $.ajax({
          url: 'verificar_token.php', // Um novo arquivo PHP para validar o token
          type: 'POST',
          data: {
            email: email,
            token: token
          },
          success: function(tokenResponse) {
            console.log("Resposta do PHP:", tokenResponse); // Verifica a resposta do PHP
            if (tokenResponse == "true") {
              // Token correto, prossegue com a verificação do crédito
              $.ajax({
                url: 'verificar_credito.php',
                type: 'POST',
                data: {
                  email: email,
                  totalPrice: total
                },
                success: function(response) {
                  if (response == "true") {
                    // Aluno tem crédito suficiente, prossegue normalmente
                    const cartItems = purchases.map(product => ({
                      name: product.name,
                      quantity: product.quantity,
                      price: product.price.toFixed(2)
                    }));
                    const totalPrice = total.toFixed(2);

                    const formData = new FormData();
                    formData.append('email', email);
                    formData.append('cartItems', JSON.stringify(cartItems));
                    formData.append('totalPrice', totalPrice);

                    fetch('confirmacaoTemConta.php', {
                        method: 'POST',
                        body: formData
                      })
                      .then(response => response.text())
                      .then(text => {
                        // Após processar, redireciona para a página de confirmação passando os dados via URL
                        const cartItemsQuery = JSON.stringify(cartItems);
                        window.location.href = 'confirmacaoTemConta.php?email=' + encodeURIComponent(email) + '&cartItems=' + encodeURIComponent(cartItemsQuery) + '&totalPrice=' + totalPrice;
                      })
                      .catch(error => console.error('Error:', error));
                  } else {
                    // Aluno não tem crédito o suficiente, exibe mensagem de erro
                    alert("Saldo insuficiente");
                  }
                },
                error: function(error) {
                  console.error('Erro ao verificar crédito:', error);
                }
              });
            } else {
              // Token inválido
              alert("Token de segurança inválido");
              console.log(tokenResponse);
            }
          },
          error: function(error) {
            console.error('Erro ao verificar token:', error);
          }
        });
      } else {
        // Email não existe
        alert("Aluno Inexistente");
      }
    },
    error: function(error) {
      console.error('Erro ao verificar email:', error);
    }
  });
});
  </script>


  <script>
    function naotemconta() {
      modalConfirmacao.close();

      const cartItems = purchases.map(product => ({
        name: product.name,
        quantity: product.quantity,
        price: product.price.toFixed(2)
      }));
      const totalPrice = total.toFixed(2);

      // Enviar os dados para o servidor ou redirecionar
      window.location.href = `confirmacaoNaoTemConta.php?cartItems=${encodeURIComponent(JSON.stringify(cartItems))}&totalPrice=${totalPrice}`;
    }

    function naotemconta2(productName, productPrice) {
      modalConfirmacao.close();

      const product = {
        name: productName,
        price: productPrice.toFixed(2),
        quantity: 1 // Caso tenha sempre uma unidade, pode ajustar se necessário
      };

      // Converte o objeto em string e codifica para a URL
      const productData = encodeURIComponent(JSON.stringify([product]));
      const totalPrice = product.price; // Como só tem 1 produto, o total é igual ao preço do produto

      // Redireciona para a página de confirmação com os dados do produto e preço total
      window.location.href = `confirmacaoNaoTemConta.php?cartItems=${productData}&totalPrice=${totalPrice}`;
    }
  </script>
  <script>
    function naotemconta3() {
      modaltemconta.close();
    }
  </script>




  <div class="container">
    <nav>
      <div class="navbar">
        <div class="logo">
          <img src="Imagens/GULOSEIMA LOGO NOVO.png" alt>
          <h1>GULOSEIMA</h1>
        </div>
        <ul>
          <li class="user-name">
            <i class="fas fa-user-circle"></i> <!-- Ícone de usuário -->
            Bem-vindo, <?php echo $_SESSION['nome']; ?>!
          </li> <!-- Exibindo o nome do usuário com ícone -->
          <li><a href="compraPresencial.php">
              <i class="fas fa-solid fa-cash-register" style="color: #ed842b;"></i>
              <span class="nav-item" style="color: #ed842b; font-weight: 600;">Compra
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
              <i class="fas fa-solid fa-bell"></i>
              <span class="nav-item">Pedidos</span>
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


          <li><a href="logout.php">
              <i class="fas fa-solid fa-power-off"></i>
              <span class="nav-item">Sair</span>
            </a>
          </li>
        </ul>
      </div>
    </nav>

    <section class="main">
      <div class="main-top">
        <p>Faça sua compra!</p>
      </div>
      <div class="main-body">
        <h1>Compra presencial</h1>

        <div class="search_bar">
          <input type="search" style="border-radius: 5px; padding-left: 15px" placeholder="Pesquise seu produto...">
          <select name="categoria" id="tipoProduto" style="width:10%; border-radius:5px ;">
            <option value="">Categoria</option>
            <?php
            if ($result_categories->num_rows > 0) {
              while ($row_category = $result_categories->fetch_assoc()) {
                echo '<option value="' . $row_category["tipoproduto"] . '">' . $row_category["tipoproduto"] . '</option>';
              }
            }
            ?>
          </select>
        </div>

        <div class="row">
          <p>Produtos Disponíveis: <span><?php echo $total_products; ?></span></p>
        </div>
        <div class="containerf">
          <?php
          if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
          ?>
              <div class="job_cardmin show-popup" id="product<?php echo $row['id']; ?>">
                <div class="job_details2 show-popup">
                  <div class="content" style="margin-left: 20px;">
                    <div class="img">
                      <img src="<?php echo $row["imagem"]; ?>" alt="" style="height: 80px; border-radius: 10px">
                    </div>
                    <div class="text" style="text-align: left;">
                      <h2><?php echo $row["nomeProd"]; ?></h2>
                      <h4>Valor: R$ <?php echo number_format($row["valor"], 2, ',', '.'); ?></h4>
                      <p>Quantidade disponível: <strong><?php echo $row["quantidade"]; ?></strong></p> <!-- Adicionado -->
                    </div>
                  </div>
                  <div class="buttons">
                    <button id="product-<?php echo $row['id']; ?>-buy" class="buttonComp"
                      onclick="naotemconta2('<?php echo $row['nomeProd']; ?>', <?php echo $row['valor']; ?>)">Comprar</button>
                    <button id="product-<?php echo $row['id']; ?>-cart" class="buttonCar">Carrinho</button>
                  </div>
                </div>
              </div>
          <?php
            }
          }
          ?>
        </div>


        <div class="containercar">
          <div class="top-right-element">
            <div class="tras">
              <h2>Carrinho</h2>
            </div>
            <div id="last-purchases" style="margin-top: 20px;"></div>
          </div>
          <div class="confir">
            <div id="last-purchases">
            </div>
            <p id="totalPrice">Total: R$ 0.00</p>
            <div class="buttons">
              <button id="openCartButton" class="buttonComp" onclick=mostrarConfirmacao()>Comprar</button>
              <button onclick="clearCart()" class="buttonCar">Limpar
                Carrinho</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>

  <script>
    function verificarEstoque() {
      let suficiente = true; // Assume que tudo está suficiente
      let mensagens = []; // Para armazenar mensagens de erro

      purchases.forEach(product => {
        const produtoEstoque = parseInt(product.quantity); // Quantidade no carrinho

        $.ajax({
          url: 'verificar_estoque.php', // Crie esse arquivo para verificar o estoque
          type: 'POST',
          async: false, // Para garantir que a verificação complete antes de prosseguir
          data: {
            produto: product.name,
            quantidade: produtoEstoque
          },
          success: function(response) {
            if (response == "false") {
              suficiente = false;
              mensagens.push(`Item ${product.name} não possui quantidade suficiente no estoque.`);
            }
          }
        });
      });

      return {
        suficiente,
        mensagens
      };
    }
  </script>

  <script>
    let purchases = [];
    let total = 0;

    // Adicionando evento de clique aos botões de compra
    document.querySelectorAll('.buttonComp').forEach(button => {
      button.addEventListener('click', () => {
        const productName = button.parentElement.parentElement.querySelector('.text h2').innerText;
        const productPriceText = button.parentElement.parentElement.querySelector('.text h4').innerText;
        const productPrice = parseFloat(productPriceText.replace('Valor: R$', '').replace(',', '.'));
        openModal(productName, productPrice);
      });
    });

    // Função para abrir o modal do produto
    function openModal(productName, productPrice) {
      const modal = document.getElementById('modal');
      const modalContent = modal.querySelector('h1');
      const modalDescription = modal.querySelector('h2');

      modalContent.textContent = productName;
      modalDescription.textContent = `Preço: R$ ${productPrice.toFixed(2)}`;

      modal.showModal();
    }

    // Event listener para fechar o modal
    document.getElementById('modalCloseButton').addEventListener('click', () => {
      const modal = document.getElementById('modal');
      modal.close();
    });

    // Função para adicionar produto ao carrinho
    function addToCart(productName, productPrice) {
      const existingProduct = purchases.find(product => product.name === productName);
      if (existingProduct) {
        existingProduct.quantity = (existingProduct.quantity || 1) + 1;
        total += productPrice;
      } else {
        purchases.push({
          name: productName,
          price: productPrice,
          quantity: 1
        });
        total += productPrice;
      }
      updateCart();
    }
    // Função para remover produto do carrinho
    function removeFromCart(index) {
      const product = purchases[index];
      if (product.quantity > 1) {
        product.quantity--;
        total -= product.price;
      } else {
        total -= product.price;
        purchases.splice(index, 1);
      }
      updateCart();
    }

    function updateCart() {
      const lastPurchasesContainer = document.getElementById('last-purchases');
      const totalPriceElement = document.getElementById('totalPrice');

      lastPurchasesContainer.innerHTML = '';
      totalPriceElement.textContent = `Total: R$ ${total.toFixed(2)}`;

      purchases.forEach((product, index) => {
        const purchaseElement = document.createElement('div');
        purchaseElement.classList.add('purchase');
        purchaseElement.innerHTML = `<p><strong>${product.name}</strong> x ${product.quantity} - R$ ${product.price.toFixed(2)}</p>`;

        const removeDot = document.createElement('div');
        removeDot.classList.add('remove-dot');
        removeDot.innerHTML = '<i class="fas fa-times"></i>';
        removeDot.addEventListener('click', () => {
          removeFromCart(index);
        });

        purchaseElement.appendChild(removeDot);
        lastPurchasesContainer.appendChild(purchaseElement);
      });
    }

    // Função para limpar o carrinho
    function clearCart() {
      purchases = [];
      total = 0;
      updateCart();
    }

    // Função para abrir o modal do carrinho
    function openCartModal() {
      const cartItems = document.getElementById('last-purchases').innerHTML;
      const totalPrice = document.getElementById('totalPrice').textContent;
      const totalPriceModal = document.getElementById('totalPriceModal');
      totalPriceModal.textContent = totalPrice;

      const modalBody = document.querySelector('#cartModal .modal-body');
      modalBody.innerHTML = cartItems;

      const cartModal = document.getElementById('cartModal');
      cartModal.showModal();
    }

    // Função para fechar o modal do carrinho
    function closeCartModal() {
      const cartModal = document.getElementById('cartModal');
      cartModal.close();
    }

    // Função para abrir o modal de pagamento
    function openPaymentModal() {
      const paymentModal = document.getElementById('paymentModal');
      paymentModal.classList.add('modal');
      paymentModal.showModal();
    }

    // Função para confirmar o pagamento
    function confirmPayment() {
      // Aqui você pode adicionar a lógica para lidar com o pagamento
      // Por exemplo, validar os inputs e enviar os dados para o servidor

      // Depois de lidar com o pagamento, você pode fechar o modal
      const paymentModal = document.getElementById('paymentModal');
      paymentModal.close();
    }

    // Função para cancelar o pagamento
    function cancelPayment() {
      const paymentModal = document.getElementById('paymentModal');
      paymentModal.close();
    }
  </script>
  <script>
    //Script tem conta ou não
    function mostrarConfirmacao() {
      if (total > 0) {
        const {
          suficiente,
          mensagens
        } = verificarEstoque();

        if (!suficiente) {
          alert(mensagens.join('\n')); // Mostra todas as mensagens de erro
          return; // Não prossegue para a tela de confirmação
        }

        modalConfirmacao.showModal(); // Abre o modal de confirmação
      } else {
        alert("O carrinho está vazio. Adicione produtos antes de continuar.");
      }
    }
  </script>
  <script>
    const modalTemConta = document.getElementById('modaltemconta');

    function temconta() {
      modalConfirmacao.close(); // Fecha o modal de confirmação
      modalTemConta.showModal(); // Abre o modal "modaltemconta"
    }
  </script>






  <script>
    $(document).ready(function() {
      // Evento change no select de categoria
      $('#tipoProduto').on('change', function() {
        var selectedTipoProduto = $(this).val();
        console.log('Selected TipoProduto:', selectedTipoProduto);

        $.ajax({
          url: 'fetch_products.php',
          type: 'POST',
          data: {
            tipo_produto: selectedTipoProduto
          },
          success: function(response) {
            $('.containerf').html(response);
          },
          error: function(error) {
            console.error('Erro ao buscar produtos:', error);
          }
        });
      });

      // Evento de procura na barra de pesquisa
      $('input[type="search"]').on('input', function() {
        var searchText = $(this).val().toLowerCase();

        $('.job_cardmin').each(function() {
          var productName = $(this).find('h2').text().toLowerCase();

          if (productName.includes(searchText)) {
            $(this).show();
          } else {
            $(this).hide();
          }
        });
      });
    });


    document.querySelector('.containerf').addEventListener('click', function(event) {
      if (event.target.classList.contains('buttonCar')) {
        const productName = event.target.parentElement.parentElement.querySelector('.text h2').innerText;
        const productPriceText = event.target.parentElement.parentElement.querySelector('.text h4').innerText;
        const productPrice = parseFloat(productPriceText.replace('Valor: R$', '').replace(',', '.'));
        addToCart(productName, productPrice);
      } else if (event.target.classList.contains('buttonComp')) {
        const productName = event.target.parentElement.parentElement.querySelector('.text h2').innerText;
        const productPriceText = event.target.parentElement.parentElement.querySelector('.text h4').innerText;
        const productPrice = parseFloat(productPriceText.replace('Valor: R$', '').replace(',', '.'));

        naotemconta2(productName, productPrice);

      }
    });
  </script>

</body>

</html>
