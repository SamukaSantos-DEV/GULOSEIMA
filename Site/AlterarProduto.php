<?php
session_start();
if (!isset($_SESSION['nome'])) {
    header('Location: index.html');
    exit;
}

require_once 'config.php';

// Verificar se foi passado um ID válido via GET
if (isset($_GET['id'])) {
    $id = intval($_GET['id']); // Convertendo para inteiro para evitar SQL Injection

    // Consultar o produto pelo ID
    $sql = "SELECT * FROM produto WHERE id = $id";
    $result = $conexao->query($sql);

    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $nomeProd = $row['nomeProd'];
        $quantidade = $row['quantidade'];
        $valor = $row['valor'];
        $tipo_produto_id = $row['fk_tipoProduto_id'];
        $imagem = $row['imagem'];  // Campo da imagem
        
    } else {
        echo "Nenhum produto encontrado com o ID fornecido.";
        exit;
    }

    // Verificar se o formulário foi enviado via POST
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        // Obter os dados do formulário
        $nomeProd = $_POST['nomeProd'];
        $quantidade = $_POST['quantidade'];
        $valor = $_POST['valor'];
        $tipo_produto_id = $_POST['tipo_produto'];

        // Inicializar a variável de imagem com o valor atual
        $imagem = $row['imagem']; 

        // Verificar se um arquivo foi enviado
        if (isset($_FILES['FotoProd']) && $_FILES['FotoProd']['error'] === UPLOAD_ERR_OK) {
            $fileTmpPath = $_FILES['FotoProd']['tmp_name'];
            $fileName = $_FILES['FotoProd']['name'];
            $fileDestPath = 'ImagensProdutos/' . $fileName;
            
            // Mover o arquivo para o diretório de destino
            if (move_uploaded_file($fileTmpPath, $fileDestPath)) {
                $imagem = $fileDestPath;  // Atualizar o nome da imagem com o novo caminho
            } else {
                echo "Erro ao mover o arquivo.";
                exit;
            }
        }

        // Executar a lógica de atualização do produto
        $sql_update = "UPDATE produto SET nomeProd = '$nomeProd', quantidade = '$quantidade', valor = '$valor', fk_tipoProduto_id = '$tipo_produto_id', imagem = '$imagem' WHERE id = $id";

        if ($conexao->query($sql_update) === TRUE) {
            echo "Produto atualizado com sucesso.";
            header("Location: cardapioAlimentos.php");
            exit;
        } else {
            echo "Erro ao atualizar o produto: " . $conexao->error;
        }
    }
} else {
    echo "ID do produto não fornecido.";
}
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
        body {
            overflow: hidden;
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
              <i class="fas fa-solid fa-chart-bar fa-rotate-90" style="color: #ed842b;"></i>
              <span class="nav-item" style="color: #ed842b; font-weight: 600;">Estoque</span>
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
              <i class="fas fa-coins" ></i>
              <span class="nav-item" >Crédito</span>
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
        <section style="top: 50%; left: 60%; transform: translate(-50%, -50%); position: absolute; padding: 20px; border-radius: 20px;">
            <div class="modal" style="max-height: 97vh; overflow-y: auto; animation: pulse; animation-duration: 1.5s;">
                <form class="form" method="POST" action="<?php echo htmlspecialchars($_SERVER['PHP_SELF'] . '?id=' . $id); ?>" enctype="multipart/form-data">
                    <div class="payment--options">
                        <label for="file" class="labelFile" style="z-index: 1;">
                            <span>
                                <svg xml:space="preserve" viewBox="0 0 184.69 184.69" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" id="Capa_1" version="1.1" width="40px" height="40px">
                                    <g>
                                        <g>
                                            <g>
                                                <path d="M149.968,50.186c-8.017-14.308-23.796-22.515-40.717-19.813C102.609,16.43,88.713,7.576,73.087,7.576c-22.117,0-40.112,17.994-40.112,40.115c0,0.913,0.036,1.854,0.118,2.834C14.004,54.875,0,72.11,0,91.959c0,23.456,19.082,42.535,42.538,42.535h33.623v-7.025H42.538c-19.583,0-35.509-15.929-35.509-35.509c0-17.526,13.084-32.621,30.442-35.105c0.931-0.132,1.768-0.633,2.326-1.392c0.555-0.755,0.795-1.704,0.644-2.63c-0.297-1.904-0.447-3.582-0.447-5.139c0-18.249,14.852-33.094,33.094-33.094c13.703,0,25.789,8.26,30.803,21.04c0.63,1.621,2.351,2.534,4.058,2.14c15.425-3.568,29.919,3.883,36.604,17.168c0.508,1.027,1.503,1.736,2.641,1.897c17.368,2.473,30.481,17.569,30.481,35.112c0,19.58-15.937,35.509-35.52,35.509H97.391v7.025h44.761c23.459,0,42.538-19.079,42.538-42.535C184.69,71.545,169.884,53.901,149.968,50.186z" style="fill:#333333;"></path>
                                            </g>
                                            <g>
                                                <path d="M108.586,90.201c1.406-1.403,1.406-3.672,0-5.075L88.541,65.078c-0.701-0.698-1.614-1.045-2.534-1.045l-0.064,0.011c-0.018,0-0.036-0.011-0.054-0.011c-0.931,0-1.85,0.361-2.534,1.045L63.31,83.779c-1.404,1.403-1.404,3.672,0,5.075c1.404,1.403,3.674,1.403,5.078,0l14.676-14.676v81.49c0,1.984,1.61,3.594,3.594,3.594c1.984,0,3.594-1.61,3.594-3.594v-81.49l14.676,14.676C104.912,91.604,107.183,91.604,108.586,90.201z" style="fill:#333333;"></path>
                                            </g>
                                        </g>
                                    </g>
                                </svg>
                            </span>
                            <p>Envie a imagem do produto!</p>
                        </label>
                        <input class="input" name="FotoProd" id="file" type="file" onchange="displayFileName(this)" />
                    </div>

                    <!-- Elemento para mostrar o nome do arquivo selecionado -->
                    <div id="fileNameDisplay"><?php echo htmlspecialchars(basename($imagem)); ?></div>

                    <div class="separator">
                        <hr class="line">
                        <p>Atualizar Produto</p>
                        <hr class="line">
                    </div>
                    <div class="credit-card-info--form">
                        <div class="input_container">
                            <label for="nomeProd" class="input_label">Nome do Produto:</label>
                            <input id="nomeProd" class="input_field" type="text" name="nomeProd" placeholder="Nome do Produto" value="<?php echo htmlspecialchars($nomeProd); ?>" required>
                            <label class="input_label" style="padding-left: 5px; color: #ed862b;">* Campo Obrigatório</label>
                        </div>
                        
                        <div class="input_container">
                            <label for="quantidade" class="input_label">Quantidade:</label>
                            <input id="quantidade" class="input_field" type="text" name="quantidade" placeholder="Quantidade" value="<?php echo htmlspecialchars($quantidade); ?>" required>
                            <label class="input_label" style="padding-left: 5px; color: #ed862b;">* Campo Obrigatório</label>
                        </div>

                        <div class="input_container">
                            <label for="tipo_produto" class="input_label">Tipo:</label>
                            <?php
                            // Consulta SQL para obter os tipos de produtos da tabela "tipoproduto"
                            $sql_tipoproduto = "SELECT id, tipoproduto FROM tipoproduto";
                            $result_tipoproduto = $conexao->query($sql_tipoproduto);

                            if ($result_tipoproduto->num_rows > 0) {
                                echo '<select class="input_field" name="tipo_produto">';
                                while ($row_tipoproduto = $result_tipoproduto->fetch_assoc()) {
                                    $selected = ($row_tipoproduto['id'] == $tipo_produto_id) ? 'selected' : '';
                                    echo "<option value='" . $row_tipoproduto['id'] . "' $selected>" . $row_tipoproduto['tipoproduto'] . "</option>";
                                }
                                echo '</select>';
                            } else {
                                echo '<input class="input_field" readonly placeholder="Nenhum tipo de produto encontrado">';
                            }
                            ?>
                            <label class="input_label" style="padding-left: 5px; color: #ed862b;">* Campos Obrigatórios</label>
                        </div>

                        <div class="input_container">
                            <label for="valor" class="input_label">Valor:</label>
                            <input id="valor" class="input_field" type="number" name="valor" placeholder="Valor" min="0.01" step="0.01" value="<?php echo htmlspecialchars($valor); ?>" required>
                            <label class="input_label" style="padding-left: 5px; color: #ed862b;">* Campo Obrigatório</label>
                        </div>
                    </div>

                    <button class="btn" type="submit">Atualizar</button>
                </form>
            </div>
        </section>
    </div>

    <!-- Adicionar JavaScript para atualizar o nome do arquivo exibido -->
    <script>
        function displayFileName(input) {
            var fileName = input.files[0] ? input.files[0].name : '';
            document.getElementById('fileNameDisplay').textContent = fileName;
        }
    </script>
</body>
</html>
