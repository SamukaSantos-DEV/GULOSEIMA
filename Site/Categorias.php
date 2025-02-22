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
<html lang="pt-br">

<head>
  <title>GULOSEIMA</title>
  <link rel="stylesheet" href="style.css" />
  <link rel="icon" href="Imagens/GULOSEIMA LOGO NOVO.png">
  <!-- Font Awesome Cdn Link -->
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

    .button {
      font-family: monospace;

      background: linear-gradient(0deg, #f29446 0%, #ed842b 50%, #E26A05 100%);
      color: #FFF;
      border: none;
      border-radius: 8px;
      width: 400px;
      height: 45px;
      transition: .3s;
      font-size: 20px;
      transform: translate(250px, 20px);
      margin-bottom: 40px;
    }

    .button:hover {
      box-shadow: 0px 0px 0px 2px #FFFFFF, 0px 0px 0px 4px #0000003a;
    }

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

<body>
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
        <h1>Categorias dos Produtos</h1>
        <div class="search_bar">
          <input type="search" placeholder="Pesquise sua categoria...">
        </div>

        <div class="form-group">
          <button class="button"><a href="cadastroCategoria.html" style="color: #FFF">ADICIONAR CATEGORIA +</a></button>
        </div>

        <div class="row">
          <p>Aqui estão as <span>categorias</span> dos seus produtos!</p>
        </div>

        <div class="job_card">
          <div class="job_details">
            <div class="img">
              <img src="Imagens/Usuario.png" alt="" style="height: 90px; ">
            </div>
            <div class="text show-popup">
              <h2 style="padding-top: 30px;">Salgado</h2>
            </div>
          </div>
          <div class="job_salary">
            <div class="PB-range-slider-div">
            </div>
            <button class="buttonDel"> Deletar
            </button>
          </div>
        </div>
        <div class="job_card">
          <div class="job_details">
            <div class="img">
              <img src="Imagens/Usuario.png" alt="" style="height: 90px; ">
            </div>
            <div class="text show-popup">
              <h2 style="padding-top: 30px;">Bebidas</h2>
            </div>
          </div>
          <div class="job_salary">
            <div class="PB-range-slider-div">
            </div>
            <button class="buttonDel"> Deletar
            </button>
          </div>
        </div>

        <div class="job_card">
          <div class="job_details">
            <div class="img">
              <img src="Imagens/Usuario.png" alt="" style="height: 90px; ">
            </div>
            <div class="text show-popup">
              <h2 style="padding-top: 30px;">Sorvetes</h2>
            </div>
          </div>
          <div class="job_salary">
            <div class="PB-range-slider-div">
            </div>
            <button class="buttonDel"> Deletar
            </button>
          </div>
        </div>

        <div class="job_card">
          <div class="job_details">
            <div class="img">
              <img src="Imagens/Usuario.png" alt="" style="height: 90px; ">
            </div>
            <div class="text show-popup">
              <h2 style="padding-top: 30px;">Sorvetes</h2>
            </div>
          </div>
          <div class="job_salary">
            <div class="PB-range-slider-div">
            </div>
            <button class="buttonDel"> Deletar
            </button>
          </div>
        </div>




      </div>
  </div>
  </section>
  </div>
  <script src="script.js"></script>
</body>

</html></span>