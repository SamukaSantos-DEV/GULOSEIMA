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
    // Cadastro de tipoProduto
    if (isset($_POST["tipoProduto"])) {
        $tipoProduto = $_POST["tipoProduto"];

        $sql = "INSERT INTO tipoProduto (tipoProduto) VALUES ('$tipoProduto')";

        if ($conexao->query($sql) === TRUE) {
            if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] == 'XMLHttpRequest') {
                echo "Tipo de produto cadastrado com sucesso!";
                exit;
            } else {
                header('Location: ' . $_SERVER['PHP_SELF']);
                exit;
            }
        } else {
            if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] == 'XMLHttpRequest') {
                echo "Erro ao cadastrar o tipo de produto: " . $conexao->error;
                exit;
            } else {
                echo "Erro ao cadastrar o tipo de produto: " . $conexao->error;
            }
        }
    }

   // Exclusão de produto
if (isset($_POST["delete_id"])) {
    $delete_id = intval($_POST["delete_id"]);

    // Atualizar os produtos para o tipo "Não Categorizado" antes de excluir o tipo
    $sql_update = "UPDATE produto SET fk_tipoProduto_id = 1 WHERE fk_tipoProduto_id = $delete_id";

    if ($conexao->query($sql_update) === TRUE) {
        // Após atualizar os produtos, excluir o tipo
        $sql_delete = "DELETE FROM tipoproduto WHERE id = $delete_id";
        if ($conexao->query($sql_delete) === TRUE) {
            if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] == 'XMLHttpRequest') {
                echo "Tipo excluído com sucesso! Os produtos foram movidos para 'Não Categorizado'.";
                exit;
            } else {
                header('Location: ' . $_SERVER['PHP_SELF']);
                exit;
            }
        } else {
            echo "Erro ao excluir o tipo: " . $conexao->error;
        }
    } else {
        echo "Erro ao atualizar produtos para 'Não Categorizado': " . $conexao->error;
    }
}

    // Atualização de produto
    if (isset($_POST['edit_id'])) {
        $edit_id = $conexao->real_escape_string($_POST['edit_id']);
        $edit_tipoProduto = $conexao->real_escape_string($_POST['edit_tipoProduto']);

        $stmt = $conexao->prepare("UPDATE tipoProduto SET tipoProduto=? WHERE id=?");
        $stmt->bind_param("si", $edit_tipoProduto, $edit_id);
        $stmt->execute();

        if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] == 'XMLHttpRequest') {
            echo "Tipo de produto atualizado com sucesso!";
            exit;
        } else {
            header('Location: ' . $_SERVER['PHP_SELF']);
            exit;
        }
    }
}

// Consulta SQL para obter os produtos
$sql = "SELECT * FROM tipoProduto where id !=1";
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
        #confirmationModal {
            display: none; /* Mantém o modal oculto por padrão */
    position: fixed; /* Fixa o modal na tela */
    top: 50%; /* Coloca no meio da tela verticalmente */
    left: 50%; /* Coloca no meio da tela horizontalmente */
    transform: translate(-50%, -50%); /* Ajusta o modal para que ele fique perfeitamente centralizado */
    width: 80%; /* Pode ajustar a largura do modal conforme necessário */
    max-width: 800px; /* Define uma largura máxima */
   
    box-shadow: 0px 187px 75px rgba(0, 0, 0, 0.01), 0px 105px 63px rgba(0, 0, 0, 0.05), 0px 47px 47px rgba(0, 0, 0, 0.09), 0px 12px 26px rgba(0, 0, 0, 0.1), 0px 0px 0px rgba(0, 0, 0, 0.1);
    border-radius: 26px;
    z-index: 9999; /* Garante que o modal fique acima de outros elementos */
    padding: 20px;
    overflow-y: auto; /* Permite rolar o conteúdo, se necessário */
    
}

.modal-content {
    background-color: #fff;
    padding: 20px;
    border:none;
    text-align: center;
    
  
    width: 100%;
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
            padding: 5px 10px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
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
            /* Largura da imagem */
            height: auto;
            /* Ajusta a altura proporcionalmente */
        }
    </style>

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script>
        // Exibir o modal de confirmação
        function confirmDelete(prodId) {
    var modal = document.getElementById("confirmationModal");
    var cancelButton = document.getElementById("cancelButton");
    var confirmButton = document.getElementById("confirmButton");

    // Exibir o modal
    modal.style.display = "block";

    // Cancelar a exclusão
    cancelButton.onclick = function() {
        modal.style.display = "none"; // Fechar o modal
    };

    // Confirmar a exclusão via AJAX
    confirmButton.onclick = function() {
        $.ajax({
            type: "POST",
            url: "<?php echo $_SERVER['PHP_SELF']; ?>",
            data: {delete_id: prodId},
            success: function(response) {
                alert(response);
                location.reload(); // Recarregar a página para refletir as alterações
            },
            error: function(xhr, status, error) {
                alert("Erro ao excluir o tipo de produto: " + xhr.responseText);
            }
        });

        modal.style.display = "none"; // Fechar o modal
    };
}


        function editProduto(prodid) {
            var row = $("#prod-" + prodid);
            var tipoProdutoCell = row.find(".tipoProduto");
            var editButton = row.find(".edit-btn");

            if (editButton.text() === "Editar") {
                // Transformar as células em campos de entrada
                var tipoProduto = tipoProdutoCell.text();


                tipoProdutoCell.html('<input type="text" value="' + tipoProduto + '" />');


                // Mudar o botão para "Confirmar"
                editButton.text("Confirmar");
            } else {
                // Enviar as alterações para o servidor
                var newtipoProduto = tipoProdutoCell.find("input[type='text']").val();

                if (newtipoProduto === "") {
                    alert("O campo não pode estar vazio.");
                    return;
                }


                var formData = new FormData();
                formData.append('edit_id', prodid);
                formData.append('edit_tipoProduto', newtipoProduto);


                $.ajax({
                    type: "POST",
                    url: "<?php echo $_SERVER['PHP_SELF']; ?>",
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function(response) {
                        alert(response); // Exibe a resposta do servidor
                        location.reload(); // Recarrega a página para refletir as alterações
                    },
                    error: function(xhr, status, error) {
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
                            <i class="fas fa-solid fa-hamburger"></i>
                            <span class="nav-item">Cadastro alimentos</span>
                        </a>
                    </li>
                    <li><a href="cadastrotipos.php">
                            <i class="fas fa-solid fa-list" style="color: #ed842b;"></i>
                            <span class="nav-item" style="color: #ed842b; font-weight: 600;">Cadastro tipos </span>
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

        <section style="
            top: 50%;
            left: 60%;
            transform: translate(-50%, -50%);
            position: absolute;
            padding: 20px;
            border-radius: 20px; ">
            <div class="modal" style=" max-height: 97vh; 
                overflow-y: auto;          
                animation: pulse;          
                animation-duration: 1.5s; ">

                <form class="form" method="POST" action="<?php echo $_SERVER['PHP_SELF']; ?>" enctype="multipart/form-data">


                    <div class="separator">
                        <hr class="line">
                        <p>Cadastre o tipo de produto</p>
                        <hr class="line">
                    </div>
                    <div class="credit-card-info--form">
                        <div class="input_container">
                            <label for="password_field" class="input_label">Tipo de Produto:</label>
                            <input id="password_field" class="input_field" type="text" name="tipoProduto" title="Input title" placeholder="Tipo de produto" required>
                            <label for="password_field" class="input_label" style="padding-left: 5px; color: #ed862b;">* Campo Obrigatório</label>
                        </div>



                    </div>
                    <button class="btn" type="submit">Cadastrar</button>
                </form>


                <table>
                    <thead>
                        <tr>
                            <th>Tipo</th>

                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php while ($row = $result->fetch_assoc()): ?>
                            <tr id="prod-<?php echo $row['id']; ?>">
                                <td class="tipoProduto"><?php echo $row["tipoProduto"]; ?></td>


                                <td>
                                    <form method='POST' action='<?php echo $_SERVER['PHP_SELF']; ?>' style='display: inline;'>
                                        <input type='hidden' name='delete_id' value='<?php echo $row["id"]; ?>' />
                                        <button type="button" class="action-btn delete-btn" onclick='confirmDelete(<?php echo $row["id"]; ?>)'>Excluir</button>


                                    </form>
                                    <button class='action-btn edit-btn' onclick='editProduto(<?php echo $row["id"]; ?>)'>Editar</button>
                                </td>
                            </tr>
                        <?php endwhile; ?>

                    </tbody>
                </table>
            </div>



    </div>
    <!-- Modal de Confirmação -->
<div id="confirmationModal" class="modal" style="display:none;">
    <div class="modal-content">
        <p>Caso exclua o tipo de produto, todos os produtos categorizados serão alterados para "Não Categorizado".</p>
        <button id="cancelButton" class="btn">Cancelar</button>
        <button id="confirmButton" class="btn">Confirmar</button>
    </div>
</div>

</body>

</html>