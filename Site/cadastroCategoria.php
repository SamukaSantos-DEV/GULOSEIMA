<?php
session_start();


// Verificar se o usuário está logado
if (!isset($_SESSION['nome'])) {
  header('Location: index.html');
  exit;
}
require_once 'config.php';



// Fecha a conexão
$conexao->close();
?>

<!DOCTYPE html>
<html lang="en">

<head>
  <title>GULOSEIMA</title>
  <link rel="stylesheet" href="style.css" />
  <link rel="icon" href="Imagens/GULOSEIMA LOGO NOVO.png">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css">
  <style>
    .user-name {
      color: #D35400;
      /* Cor laranja escura */
      font-weight: bold;
      margin-right: 20px;
      display: flex;
      align-items: center;
    }

    .user-name i {
      margin-right: 8px;
    }
  </style>
</head>

<body style="overflow: hidden;">
  <div class="container">
    <nav>
      <div class="navbar">
        <div class="logo">
          <img src="Imagens/GULOSEIMA LOGO NOVO.png" alt="">
          <h1>GULOSEIMA</h1>
        </div>
        <ul>
          <li class="user-name">
            <i class="fas fa-user-circle"></i> <!-- Ícone de usuário -->
            Bem-vindo, <?php echo $_SESSION['nome']; ?>!
          </li> <!-- Exibindo o nome do usuário com ícone -->
          <li><a href="compraPresencial.php">
              <i class="fas fa-solid fa-cash-register"></i>
              <span class="nav-item">Compra presencial</span>
            </a>
          </li>
          <li><a href="cardapioAlimentos.php">
              <i class="fas fa-solid fa-chart-bar fa-rotate-90"></i>
              <span class="nav-item">Cardápio</span>
            </a>
          </li>
          <li><a href="cadastroAlimentos.php">
              <i class="fas fa-solid fa-plus"></i>
              <span class="nav-item">Cadastro alimentos</span>
            </a>
          </li>
          <li><a href="Pedidos.php">
              <i class="fas fa-solid fa-bell"></i>
              <span class="nav-item">Pedidos</span>
            </a>
          </li>
          <li><a href="Categorias.php">
              <i class="fas fa-solid fa-table" style="color: #ed842b;"></i>
              <span class="nav-item" style="color: #ed842b; font-weight: 600;">Categorias</span>
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
    <section
      style="top: 50%; left: 60%; transform: translate(-50%, -50%); position: absolute; padding: 20px; border-radius: 20px ">
      <div class="modal" style="animation: pulse; animation-duration: 1.5s;">
        <form class="form">
          <h1 style="text-align: center;">Adicione sua Categoria</h1>
          <div class="credit-card-info--form">
            <div class="input_container">
              <label for="password_field" class="input_label">Nome da Categoria:</label>
              <input id="password_field" class="input_field" type="text" name="input-name" title="Inpit title"
                placeholder="Ex: Sorvetes" required>
              <label for="password_field" class="input_label" style="padding-left: 5px; color: #ed842b;">* Campo
                Obrigatório</label>
            </div>
            <button class="btn">Adicionar</button>
          </div>
        </form>
      </div>
    </section>
  </div>
  <script>
    function navigateTo(url) {
      const section = document.querySelector('section');
      section.classList.add('animate__animated', 'animate__fadeOutLeft');
      setTimeout(() => {
        window.location.href = url;
      }, 1000); // Tempo de espera correspondente à duração da animação (1000ms = 1 segundo)
    }
  </script>
</body>

</html>