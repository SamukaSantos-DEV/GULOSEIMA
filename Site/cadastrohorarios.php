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
    // Cadastro de horário
    if (isset($_POST["horario"])) {
        $horario = $conexao->real_escape_string($_POST["horario"]);

        $sql = "INSERT INTO horario (horario) VALUES ('$horario')";

        if ($conexao->query($sql) === TRUE) {
            header('Location: ' . $_SERVER['PHP_SELF']);
            exit;
        } else {
            echo "Erro ao cadastrar o horário: " . $conexao->error;
        }
    }

    // Exclusão de horário
    if (isset($_POST["delete_id"])) {
        $delete_id = (int) $_POST["delete_id"];
        $sql_delete = "DELETE FROM horario WHERE id = $delete_id";
        if ($conexao->query($sql_delete) === TRUE) {
            header('Location: ' . $_SERVER['PHP_SELF']);
            exit;
        } else {
            echo "Erro ao excluir o horário: " . $conexao->error;
        }
    }

    // Atualização de horário
    if (isset($_POST['edit_id'])) {
        $edit_id = $conexao->real_escape_string($_POST['edit_id']);
        $edit_horario = $conexao->real_escape_string($_POST['edit_horario']);

        $stmt = $conexao->prepare("UPDATE horario SET horario=? WHERE id=?");
        $stmt->bind_param("si", $edit_horario, $edit_id);
        $stmt->execute();

        header('Location: ' . $_SERVER['PHP_SELF']);
        exit;
    }

        // Atualização de disponibilidade
        if (isset($_POST['update_id']) && isset($_POST['update_disponibilidade'])) {
            $update_id = (int) $_POST['update_id'];
            $update_disponibilidade = (int) $_POST['update_disponibilidade'];
    
            $stmt = $conexao->prepare("UPDATE horario SET disponibilidade=? WHERE id=?");
            $stmt->bind_param("ii", $update_disponibilidade, $update_id);
            $stmt->execute();
    
            // Resposta para o AJAX
            echo "Disponibilidade atualizada com sucesso";
            exit;
        }
}

// Consulta SQL para obter os horários
$sql = "SELECT * FROM horario";
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

        .availability-btn {
    background-color: #FFA500; /* Cor de fundo laranja */
    color: white; /* Cor do texto */
    border: none; /* Remover a borda */
    padding: 5px 10px; /* Espaçamento interno */
    text-align: center; /* Centralizar o texto */
    text-decoration: none; /* Remover o sublinhado */
    display: inline-block; /* Exibir como um bloco inline */
    font-size: 16px; /* Tamanho da fonte */
    cursor: pointer; /* Cursor de ponteiro */
    border-radius: 5px; /* Cantos arredondados */
}

.availability-btn:hover {
    background-color: #FF8C00; /* Cor de fundo laranja escuro ao passar o mouse */
}

    </style>

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script>
        function edithorario(prodid) {
            var row = $("#prod-" + prodid);
            var horarioCell = row.find(".horario");
            var editButton = row.find(".edit-btn");

            if (editButton.text() === "Editar") {
                // Transformar as células em campos de entrada
                var horario = horarioCell.text();

                horarioCell.html('<input type="text" value="' + horario + '" />');
                // Mudar o botão para "Confirmar"
                editButton.text("Confirmar");
            } else {
                // Enviar as alterações para o servidor
                var newhorario = horarioCell.find("input[type='text']").val();

                if (newhorario === "") {
                    alert("O campo não pode estar vazio.");
                    return;
                }

                var formData = new FormData();
                formData.append('edit_id', prodid);
                formData.append('edit_horario', newhorario);

                $.ajax({
                    type: "POST",
                    url: "<?php echo $_SERVER['PHP_SELF']; ?>",
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function (response) {
                        location.reload(); // Recarrega a página para refletir as alterações
                    },
                    error: function (xhr, status, error) {
                        alert("Erro ao atualizar o horário: " + xhr.responseText);
                    }
                });
            }
        }
    </script>

<script>
    function alterarDisponibilidade(id) {
        var row = $("#prod-" + id);
        var availabilityCell = row.find("td:eq(2)"); // Seleciona a célula da disponibilidade

        // Verifica o valor atual da disponibilidade
        var currentAvailability = availabilityCell.text().trim();

        // Define o novo valor com base no valor atual
        var newAvailability = (currentAvailability === "Disponível") ? 0 : 1;

        // Envia a atualização via AJAX
        var formData = new FormData();
        formData.append('update_id', id);
        formData.append('update_disponibilidade', newAvailability);

        $.ajax({
            type: "POST",
            url: "<?php echo $_SERVER['PHP_SELF']; ?>",
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                // Atualiza a célula com o novo valor
                availabilityCell.text(newAvailability === 1 ? "Disponível" : "Indisponível");
            },
            error: function(xhr, status, error) {
                alert("Erro ao alterar a disponibilidade: " + xhr.responseText);
            }
        });
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
                            <i class="fas fa-solid fa-list"></i>
                            <span class="nav-item">Cadastro tipos </span>
                        </a>
                    </li>
                    <li><a href="cadastrohorarios.php">
                            <i class="fas fa-solid fa-clock" style="color: #ed842b;"></i>
                            <span class="nav-item" style="color: #ed842b; font-weight: 600;">Cadastro horarios</span>
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

                <form class="form" method="POST" action="<?php echo $_SERVER['PHP_SELF']; ?>"
                    enctype="multipart/form-data">
                    <div class="separator">
                        <hr class="line">
                        <p>Cadastre o horário</p>
                        <hr class="line">
                    </div>
                    <div class="credit-card-info--form">
                        <div class="input_container">
                            <label for="password_field" class="input_label">Horário:</label>
                            <input id="password_field" class="input_field" type="text" name="horario"
                                title="Input title" placeholder="Horário" required>
                            <label for="password_field" class="input_label" style="padding-left: 5px; color: #ed862b;">*
                                Campo Obrigatório</label>
                        </div>
                    </div>
                    <button class="btn" type="submit">Cadastrar</button>
                </form>

                <table>
    <thead>
        <tr>
            <th>Horário</th>
            <th>Ações</th>
            <th>Disponibilidade</th>
        </tr>
    </thead>
    <tbody>
        <?php while ($row = $result->fetch_assoc()): ?>
            <tr id="prod-<?php echo $row['id']; ?>">
                <td class="horario"><?php echo $row["horario"]; ?></td>
                <td>
                    <form method='POST' action='<?php echo $_SERVER['PHP_SELF']; ?>' style='display: inline;'>
                        <input type='hidden' name='delete_id' value='<?php echo $row["id"]; ?>' />
                        <button type='submit' class='action-btn delete-btn'>Excluir</button>
                    </form>
                    <button class='action-btn edit-btn' onclick='edithorario(<?php echo $row["id"]; ?>)'>Editar</button>
                    <button class='action-btn availability-btn' onclick='alterarDisponibilidade(<?php echo $row["id"]; ?>)'>Alterar Disponibilidade</button>
                </td>
                <td>
                    <?php echo $row["disponibilidade"] == 1 ? "Disponível" : "Indisponível"; ?>
                </td>
            </tr>
        <?php endwhile; ?>
    </tbody>
</table>

            </div>
        </section>
    </div>
</body>

</html>