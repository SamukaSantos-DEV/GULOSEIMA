<?php
session_start();
if (!isset($_SESSION['nome'])) {
    header('Location: index.html');
    exit;
}

require_once 'config.php';

// Conectar ao banco de dados
if ($conexao->connect_error) {
    die("Conexão falhou: " . $conexao->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Cadastro de produto
    if (isset($_POST["nomeProd"]) && isset($_POST["quantidade"]) && isset($_POST["valor"]) && isset($_POST["alerta"])) {
        $nomeProd = $_POST["nomeProd"];
        $quantidade = $_POST["quantidade"];
        $valor = $_POST["valor"];
        $alerta = $_POST["alerta"];

        if (isset($_FILES["FotoProd"]) && !empty($_FILES["FotoProd"]["name"])) {
            if ($_FILES["FotoProd"]["error"] == UPLOAD_ERR_OK && !$_FILES["FotoProd"]["error"]) {
                $imagem = "ImagensProdutos/" . basename($_FILES["FotoProd"]["name"]);
                move_uploaded_file($_FILES["FotoProd"]["tmp_name"], $imagem);
            } else {
                $imagem = "ERROO";
            }
        } else {
            $imagem = "Imagem padrão"; // Ou defina um valor adequado
        }

        $tipo_produto_id = $_POST["tipo_produto"];

        $stmt = $conexao->prepare("INSERT INTO produto (nomeProd, quantidade, valor, imagem, fk_tipoProduto_id, alerta) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssis", $nomeProd, $quantidade, $valor, $imagem, $tipo_produto_id, $alerta);

        if ($stmt->execute()) {
            header('Location: ' . $_SERVER['PHP_SELF']);
            exit();
        } else {
            echo "Erro ao cadastrar o produto: " . $stmt->error;
        }
        $stmt->close();
    }

    // Atualização de produto
    if (isset($_POST['edit_id'])) {
        $edit_id = intval($_POST['edit_id']);
        $edit_nome = $_POST['edit_nome'];
        $edit_quantidade = $_POST['edit_quantidade'];
        $edit_valor = $_POST['edit_valor'];
        $edit_tipo = $_POST['edit_tipo'];

        if (isset($_FILES["edit_imagem"]) && $_FILES["edit_imagem"]["error"] == UPLOAD_ERR_OK) {
            $imagem = "ImagensProdutos/" . basename($_FILES["edit_imagem"]["name"]);
            move_uploaded_file($_FILES["edit_imagem"]["tmp_name"], $imagem);
        } else {
            $imagem = null; // Nenhuma nova imagem foi enviada
        }

        $sql = "UPDATE produto SET nomeProd=?, quantidade=?, valor=?, fk_tipoProduto_id=?";
        if ($imagem) {
            $sql .= ", imagem=?";
        }
        $sql .= " WHERE id=?";

        $stmt = $conexao->prepare($sql);
        if ($imagem) {
            $stmt->bind_param("ssssi", $edit_nome, $edit_quantidade, $edit_valor, $edit_tipo, $imagem, $edit_id);
        } else {
            $stmt->bind_param("ssssi", $edit_nome, $edit_quantidade, $edit_valor, $edit_tipo, $edit_id);
        }

        if ($stmt->execute()) {
            header('Location: ' . $_SERVER['PHP_SELF']);
            exit();
        } else {
            echo "Erro ao atualizar o produto: " . $stmt->error;
        }
        $stmt->close();
    }

    // Exclusão de produto
    if (isset($_POST["delete_id"])) {
        $delete_id = intval($_POST["delete_id"]);

        $stmt = $conexao->prepare("DELETE FROM produto WHERE id = ?");
        $stmt->bind_param("i", $delete_id);

        if ($stmt->execute()) {
            echo "Produto excluído com sucesso!";
        } else {
            echo "Erro ao excluir o produto: " . $stmt->error;
        }
        $stmt->close();
        exit();
    }
}

// Consulta SQL para obter os produtos
$sql = "SELECT * FROM produto";
$result = $conexao->query($sql);
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

        table {
            width: 96%;
            margin: 2%;
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

        .action-btn {
            padding: 1px;
            text-align: center;
            width: 98%;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 12px;
        }

        .edit-btn {
            background-color: #4CAF50;
            color: white;
        }

        .delete-btn {
            background-color: #f44336;
            color: white;
        }

        .btn {
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #D35400;
            color: white;
            border: none;
            border-radius: 11px;
            cursor: pointer;
        }

        .modal {
            width: fit-content;
            height: fit-content;
            background: #FFFFFF;
            box-shadow: 0px 187px 75px rgba(0, 0, 0, 0.01), 0px 105px 63px rgba(0, 0, 0, 0.05), 0px 47px 47px rgba(0, 0, 0, 0.09), 0px 12px 26px rgba(0, 0, 0, 0.1), 0px 0px 0px rgba(0, 0, 0, 0.1);
            border-radius: 26px;
            width: 800px;
        }

        .payment--options {
            padding: 20px 200px;
        }

        .product-image {
            width: 100px;
            height: auto;
        }
    </style>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script>
        function editProd(prodid) {
            var row = $("#prod-" + prodid);
            var nomeProdCell = row.find(".nomeProd");
            var quantidadeCell = row.find(".quantidade");
            var valorCell = row.find(".valor");
            var tipoCell = row.find(".tipo");
            var imagemCell = row.find(".imagem");
            var editButton = row.find(".edit-btn");

            if (editButton.text() === "Editar") {
                // Transformar as células em campos de entrada
                var nomeProd = nomeProdCell.text();
                var quantidade = quantidadeCell.text();
                var valor = valorCell.text();
                var tipo = tipoCell.text();
                var imagem = imagemCell.text(); // Assumindo que você exibe o nome da imagem

                nomeProdCell.html('<input type="text" value="' + nomeProd + '" />');
                quantidadeCell.html('<input type="text" value="' + quantidade + '" />');
                valorCell.html('<input type="text" value="' + valor + '" />');
                tipoCell.html('<input type="text" value="' + tipo + '" />');
                imagemCell.html('<input type="file" />');

                editButton.text("Salvar");
            } else {
                // Atualizar produto
                var newnomeProd = nomeProdCell.find("input").val();
                var newquantidade = quantidadeCell.find("input").val();
                var newvalor = valorCell.find("input").val();
                var newtipo = tipoCell.find("input").val();
                var newimagem = imagemCell.find("input").prop('files')[0]; // Nova imagem

                var formData = new FormData();
                formData.append('edit_id', prodid);
                formData.append('edit_nome', newnomeProd);
                formData.append('edit_quantidade', newquantidade);
                formData.append('edit_valor', newvalor);
                formData.append('edit_tipo', newtipo);
                if (newimagem) {
                    formData.append('edit_imagem', newimagem);
                }

                $.ajax({
                    type: "POST",
                    url: "<?php echo $_SERVER['PHP_SELF']; ?>",
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function (response) {
                        alert(response); // Exibe a resposta do servidor
                        location.reload(); // Recarrega a página para refletir as alterações
                    },
                    error: function (xhr, status, error) {
                        alert("Erro ao atualizar o produto: " + xhr.responseText);
                    }
                });
            }
        }
    </script>
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
                            <i class="fas fa-solid fa-chart-bar fa-rotate-90"></i>
                            <span class="nav-item">Estoque</span>
                        </a>
                    </li>
                    <li><a href="cadastroAlimentos.php">
                            <i class="fas fa-solid fa-hamburger" style="color: #ed842b;"></i>
                            <span class="nav-item" style="color: #ed842b; font-weight: 600;">Cadastro alimentos</span>
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


                    <li><a href="tela-login/index.html">
                            <i class="fas fa-solid fa-power-off"></i>
                            <span class="nav-item">Sair</span>
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
        <div style="top: 50vh; transform: translate(-50%, -50%);position: absolute; left: 60%; ">
            <section
                style="border-radius: 20px; overflow-y:hidden;animation: pulse; animation-duration: 1s; box-shadow: 0 0px 20px 1px rgba(0, 0, 0, 0.2);">
                <div class="modal" style="max-height: 90vh ; overflow-y: auto;   ">
                    <form class="form" method="POST" action="<?php echo $_SERVER['PHP_SELF']; ?>"
                        enctype="multipart/form-data">
                        <div class="payment--options">
                            <label for="file" class="labelFile">
                                <span class="icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 184 184" width="25px"
                                        height="25px">
                                        <g>
                                            <g>
                                                <g>
                                                    <path
                                                        d="M149.968,50.186c-8.017-14.308-23.796-22.515-40.717-19.813
                          C102.609,16.43,88.713,7.576,73.087,7.576c-22.117,0-40.112,17.994-40.112,40.115c0,0.913,0.036,1.854,0.118,2.834
                          C14.004,54.875,0,72.11,0,91.959c0,23.456,19.082,42.535,42.538,42.535h33.623v-7.025H42.538
                          c-19.583,0-35.509-15.929-35.509-35.509c0-17.526,13.084-32.621,30.442-35.105c0.931-0.132,1.768-0.633,2.326-1.392
                          c0.555-0.755,0.795-1.704,0.644-2.63c-0.297-1.904-0.447-3.582-0.447-5.139c0-18.249,14.852-33.094,33.094-33.094
                          c13.703,0,25.789,8.26,30.803,21.04c0.63,1.621,2.351,2.534,4.058,2.14c15.425-3.568,29.919,3.883,36.604,17.168
                          c0.508,1.027,1.503,1.736,2.641,1.897c17.368,2.473,30.481,17.569,30.481,35.112c0,19.58-15.937,35.509-35.52,35.509H97.391
                          v7.025h44.761c23.459,0,42.538-19.079,42.538-42.535C184.69,71.545,169.884,53.901,149.968,50.186z"
                                                        style="fill:#333333;"></path>
                                                </g>
                                                <g>
                                                    <path d="M108.586,90.201c1.406-1.403,1.406-3.672,0-5.075L88.541,65.078
                          c-0.701-0.698-1.614-1.045-2.534-1.045l-0.064,0.011c-0.018,0-0.036-0.011-0.054-0.011c-0.931,0-1.85,0.361-2.534,1.045
                          L63.31,85.127c-1.403,1.403-1.403,3.672,0,5.075c1.403,1.406,3.672,1.406,5.075,0L82.296,76.29v97.227
                          c0,1.99,1.603,3.597,3.593,3.597c1.979,0,3.59-1.607,3.59-3.597V76.165l14.033,14.036
                          C104.91,91.608,107.183,91.608,108.586,90.201z" style="fill:#ed862b;"></path>
                                                </g>
                                            </g>
                                        </g>
                                    </svg>
                                </span>
                                <p>Envie a imagem do produto!</p>
                            </label>
                            <input class="input" name="FotoProd" id="file" type="file" accept="image/*"
                                onchange="displayFileName(this)" required />

                        </div>
                        <div id="fileNameDisplay"></div>

                        <div class="separator">
                            <hr class="line">
                            <p>Cadastre seu produto</p>
                            <hr class="line">
                        </div>
                        <div class="credit-card-info--form">
                            <div class="input_container">
                                <label for="password_field" class="input_label">Nome do Produto:</label>
                                <input id="password_field" class="input_field" type="text" name="nomeProd"
                                    title="Input title" placeholder="Nome do Produto" required>
                                <label for="password_field" class="input_label"
                                    style="padding-left: 5px; color: #ed862b;">*
                                    Campo Obrigatório</label>
                            </div>
                            <div class="input_container">
                                <label for="password_field" class="input_label">Quantidade:</label>
                                <input id="password_field" class="input_field" type="number" name="quantidade"
                                    title="Input title" placeholder="Quantidade" min="1" step="1" required>
                                <label for="password_field" class="input_label"
                                    style="padding-left: 5px; color: #ed862b;">*
                                    Campo Obrigatório</label>
                            </div>
                            <div class="input_container">
                                <label for="tipo_produto" class="input_label">Tipo:</label>
                                <?php
                                $sql_tipoproduto = "SELECT id, tipoproduto FROM tipoproduto where id !=1";
                                $result_tipoproduto = $conexao->query($sql_tipoproduto);
                                if ($result_tipoproduto->num_rows > 0) {
                                    echo '<select class="input_field" name="tipo_produto">';
                                    while ($row_tipoproduto = $result_tipoproduto->fetch_assoc()) {
                                        echo "<option value='" . $row_tipoproduto["id"] . "'>" . $row_tipoproduto["tipoproduto"] . "</option>";
                                    }
                                    echo '</select>';
                                } else {
                                    echo '<input class="input_field" readonly style="padding-top:3" placeholder="Nenhum tipo de produto encontrado">';
                                }
                                ?>
                                <label for="password_field" class="input_label"
                                    style="padding-left: 5px; color: #ed862b;">*
                                    Campos Obrigatórios</label>
                            </div>
                            <div class="input_container">
                                <label for="password_field" class="input_label">Valor</label>
                                <input id="password_field" class="input_field" type="number" name="valor" title="CVV"
                                    placeholder="Valor" min="0.01" step="0.01" required>
                                <label for="password_field" class="input_label"
                                    style="padding-left: 5px; color: #ed862b;">*
                                    Campos Obrigatórios</label>
                            </div>
                            <div class="input_container">
                                <label for="password_field" class="input_label">Alerta</label>
                                <input id="password_field" class="input_field" type="number" name="alerta" title="CVV"
                                    placeholder="Alerta" min="0.01" step="0.01" required>
                                <label for="password_field" class="input_label"
                                    style="padding-left: 5px; color: #ed862b;">*
                                    Campos Obrigatórios</label>
                            </div>
                        </div>
                        <button class="btn" type="submit">Cadastrar</button>
                    </form>

                    <script>
                       function displayFileName(input) {
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    const label = document.querySelector('.labelFile p'); // Seleciona o parágrafo dentro do label

    if (input.files.length > 0) {
        // Obtém o nome do arquivo
        const fileName = input.files[0].name;
        // Atualiza o texto do parágrafo
        label.textContent = fileName; 
    } else {
        // Se nenhum arquivo for selecionado, exibe a mensagem padrão
        label.textContent = "Envie a imagem do produto!";
    }
}
                        document.addEventListener('DOMContentLoaded', function () {
                            document.getElementById('productForm').onsubmit = function () {
                                const fileInput = document.getElementById('file');
                                const file = fileInput.files[0];

                                if (!file || !file.type.startsWith('image/')) {
                                    alert('Por favor, selecione uma imagem antes de enviar o formulário.');
                                    return false; // Impede o envio do formulário
                                }

                                return true; // Permite o envio do formulário
                            };
                        });
                    </script>

                    <table>
                        <thead>
                            <tr>
                                <th>Nome do Produto</th>
                                <th>Quantidade</th>
                                <th>Valor</th>
                                <th>Alerta</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php while ($row = $result->fetch_assoc()) { ?>
                                <tr id="prod-<?php echo $row['id']; ?>">
                                    <td class="nomeProd"><?php echo $row['nomeProd']; ?></td>
                                    <td class="quantidade"><?php echo $row['quantidade']; ?></td>
                                    <td class="valor"><?php echo $row['valor']; ?></td>
                                    <td class="alerta"><?php echo $row['alerta']; ?></td>
                                    <td>
                                        <button class="delete-btn action-btn"
                                            onclick="deleteProd(<?php echo $row['id']; ?>)">Excluir</button>
                                    </td>
                                </tr>
                            <?php } ?>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    </div>
</body>

<script>
    function deleteProd(prodid) {
        if (confirm('Tem certeza que deseja excluir este produto?')) {
            $.ajax({
                type: "POST",
                url: "<?php echo $_SERVER['PHP_SELF']; ?>",
                data: {
                    delete_id: prodid
                },
                success: function (response) {
                    alert('Produto excluído com sucesso!');
                    location.reload(); // Recarrega a página para refletir as alterações

                },
                error: function (xhr, status, error) {
                    alert('Erro ao excluir o produto: ' + xhr.responseText);
                }
            });
        }
    }
</script>


</html>