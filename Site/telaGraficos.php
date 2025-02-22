<?php

session_start();


// Verificar se o usuário está logado
if (!isset($_SESSION['nome'])) {
  header('Location: index.html');
  exit;
}
// Configurações de conexão com o banco de dados.
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "guloseima";

// Cria a conexão
$conn = new mysqli($servername, $username, $password, $dbname);

// Checa a conexão
if ($conn->connect_error) {
  die("A conexão falhou: " . $conn->connect_error);
}

// Consulta SQL para somar a coluna quantidade
$sql_quantidade = "SELECT SUM(quantidade) AS total_quantidade FROM produto";
$result_quantidade = $conn->query($sql_quantidade);

if ($result_quantidade->num_rows > 0) {
  // Obtém o resultado
  $row_quantidade = $result_quantidade->fetch_assoc();
  $total_quantidade = $row_quantidade['total_quantidade'];
} else {
  $total_quantidade = 0;
}


$sql_pedidos = "SELECT sum(quantidadeItemPedido ) AS total_pedidos FROM item_pedido";
$result_pedidos = $conn->query($sql_pedidos);

if ($result_pedidos->num_rows > 0) {
  // Obtém o resultado
  $row_pedidos = $result_pedidos->fetch_assoc();
  $total_pedidos = $row_pedidos['total_pedidos'];
} else {
  $total_pedidos = 0;
}


$sql_npedidos = "SELECT COUNT(id) AS total_pedidos FROM item_pedido";
$result_npedidos = $conn->query($sql_npedidos);

if ($result_pedidos->num_rows > 0) {
  // Obtém o resultado
  $row_npedidos = $result_npedidos->fetch_assoc();
  $total_npedidos = $row_npedidos['total_pedidos'];
} else {
  $total_npedidos = 0;
}

$produtos_abaixo = [];

$sql = "
  SELECT nomeProd, quantidade, alerta FROM produto
";
$stmt = $conn->prepare($sql);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
  while ($row = $result->fetch_assoc()) {
    if ($row['quantidade'] < $row['alerta']) {
      $produtos_abaixo[] = [
        'nomeProd' => $row['nomeProd'],
        'quantidade' => $row['quantidade'],
        'alerta' => $row['alerta']
      ];
    }
  }
}

$stmt->close();




// Fecha a conexão
$conn->close();
?>



<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>GULOSEIMA</title>

  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap"
    rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />

  <link rel="icon" href="Imagens/GULOSEIMA LOGO NOVO.png">
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css">

  <link rel="stylesheet" href="style.css">
  <style>
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

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }

    table,
    th,
    td {
      border: 1px solid #ddd;
    }

    th,
    td {
      padding: 12px;
      text-align: left;
    }

    th {
      background-color: #f2f2f2;
    }

    tr:hover {
      background-color: #f1f1f1;
    }

    .btn {
      height: 30px;
      background: #F2F2F2;
      border-radius: 7px;
      border: 0;
      outline: none;
      color: #ffffff;
      font-size: 16px;
      font-weight: 500;
      background: linear-gradient(0deg, #f29446 0%, #ed842b 50%, #E26A05 100%);
      box-shadow: 0px 0px 0px 0px #FFFFFF, 0px 0px 0px 0px #000000;
      transition: all 0.3s cubic-bezier(0.15, 0.83, 0.66, 1);
      padding: 0px 20px;
      margin-top: 10px;
      cursor: pointer;
    }

    .header {
      bottom: 95%;
      width: 85%;
      left: 15%;
      height: 5%;
      position: fixed;
      z-index: 1;
      background-color: white;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      font-size: 18px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: rgb(43, 43, 43);


    }
  </style>

</head>

<body>
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
          </a
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
            <i class="fas fa-solid fa-chart-pie" style="color: #ed842b;"></i>
            <span class="nav-item" style="color: #ed842b; font-weight: 600;">Estatísticas</span>
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

  <header class="header">
    <div class="main-top">
      <p>ESTATÍSTICAS</p>
    </div>
  </header>

  <main class="main-container" style="
  margin-top: -48%;">
    <div class="main-cards">

      <a href=cardapioAlimentos.php>
        <div class="card">
          <div class="card-inner">
            <span class="material-icons-outlined text-blue">inventory_2</span>
            <p class="text-primary">PRODUTOS</p>
          </div>
          <span class="text-primary font-weight-bold"><?php echo $total_quantidade; ?></span>
        </div>
      </a>


      <div class="card" style="cursor: pointer;" onclick="window.location.href='pedidos.php'">


        <div class="card-inner">
          <span class="material-icons-outlined text-orange">add_shopping_cart</span>
          <p class="text-primary">PEDIDOS</p>
        </div>
        <span class="text-primary font-weight-bold"><?php echo $total_npedidos; ?></span>
      </div>

      <div class="card">
        <div class="card-inner">
          <span class="material-icons-outlined text-green">shopping_cart</span>
          <p class="text-primary">PRODUTOS VENDIDOS</p>

        </div>
        <span class="text-primary font-weight-bold"><?php echo $total_pedidos; ?></span>
      </div>
    </div>



    <div class="main-alerta">
      <div class="cards">
        <div class="card-inner">

          <span class="material-icons-outlined text-red">notification_important</span>
          <p class="text-primary">ALERTA DE ESTOQUE</p>
        </div>
        <span class="text-primary font-weight-bold">
          <?php if (!empty($produtos_abaixo)): ?>
            <p>Produtos com Quantidade Abaixo do Limite</p>
            <table>
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Quantidade</th>
                </tr>
              </thead>
              <tbody>
                <?php foreach ($produtos_abaixo as $produto): ?>
                  <tr>
                    <td><?php echo htmlspecialchars($produto['nomeProd']); ?></td>
                    <td><?php echo htmlspecialchars($produto['quantidade']); ?></td>
                  </tr>
                <?php endforeach; ?>
              </tbody>
            </table>
          <?php else: ?>
            <p>Não há produtos com quantidade abaixo do limite minimo .</p>
          <?php endif; ?>
        </span>
      </div>

      <br />
    </div>


    <div class="charts-card">
      <p class="chart-title">Saldo Líquido</p>

      <div class="filters">
        <label for="filtro-mes">Mês:</label>
        <select id="filtro-mes">
          <option value="">Todos</option>
        </select>
        <label for="filtro-ano">Ano:</label>
        <select id="filtro-ano">
          <option value="">Todos</option>
        </select>
        <label for="filtro-dia">Dia:</label>
        <select id="filtro-dia">
          <option value="">Todos</option>
        </select>
        <button class="btn" id="filtro-btn">Filtrar</button>
      </div>
      <div id="area-chart"></div>
    </div>


    <div class="charts-card">
      <p class="chart-title">Venda de Produtos</p>
      <form id="filtro-form">
        <select id="dia">
          <option value="">Dia</option>
          <!-- Opções de dia de 1 a 31 -->
          <?php for ($i = 1; $i <= 31; $i++) {
            echo "<option value=\"$i\">$i</option>";
          } ?>
        </select>

        <select id="mes">
          <option value="">Mês</option>
          <!-- Opções de mês de 1 a 12 -->
          <?php for ($i = 1; $i <= 12; $i++) {
            echo "<option value=\"$i\">$i</option>";
          } ?>
        </select>

        <select id="ano">
          <option value="">Ano</option>
          <!-- Opções de ano, você pode ajustar conforme necessário -->
          <?php for ($i = 2020; $i <= date("Y"); $i++) {
            echo "<option value=\"$i\">$i</option>";
          } ?>
        </select>

        <button type="button" class="btn" onclick="filtrar()">Filtrar</button>
      </form>
      <div id="bar-chart"></div>

    </div>




  </main>

  </div>

  <!-- Scripts -->
  <!-- ApexCharts -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/apexcharts/3.35.3/apexcharts.min.js"></script>
  <!-- Custom JS -->
  <!-- scrypt grafico produto -->
  <script src="assets/produto.js"></script>
  <!-- scrypt grafico gasto & lucro -->
  <script src="assets/gasto_lucro.js"></script>

</body>

</html>