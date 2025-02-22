<?php
session_start();

// Verificar se o usuário está logado TESTE DE COMMIT
//Teste conta André
if (!isset($_SESSION['nome'])) {
    header('Location: index.php');
    exit;
}

if ($_SESSION['id'] != 1) {
    header('Location: index.php');
}



require_once 'config.php';

// Verifica a conexão
if ($conexao->connect_error) {
    die("Conexão falhou: " . $conexao->connect_error);
}

// Processa o formulário de cadastro
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['nome']) && isset($_POST['senha'])) {
    $nome = $conexao->real_escape_string($_POST["nome"]);
    $senha = $conexao->real_escape_string($_POST["senha"]);

    $sql = "INSERT INTO administrador (nome, senha) VALUES ('$nome', '$senha')";

    if ($conexao->query($sql) === TRUE) {
        echo json_encode([
            'success' => true,
            'message' => 'Cadastrado com sucesso!'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Erro ao cadastrar o administrador: ' . $conexao->error
        ]);
    }
    exit();
}

// Processa a exclusão via AJAX
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['delete_id'])) {
    $delete_id = $conexao->real_escape_string($_POST['delete_id']);

    $sql = "DELETE FROM administrador WHERE id = $delete_id";

    if ($conexao->query($sql) === TRUE) {
        echo "Administrador apagado com sucesso!";
    } else {
        echo "Erro ao apagar o administrador.";
    }
    exit();
}

// Processa a edição via AJAX
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['edit_id'])) {
    $edit_id = $conexao->real_escape_string($_POST['edit_id']);
    $edit_nome = $conexao->real_escape_string($_POST['edit_nome']);

    $sql = "UPDATE administrador SET nome='$edit_nome' WHERE id=$edit_id";

    if ($conexao->query($sql) === TRUE) {
        echo json_encode([
            'success' => true,
            'message' => 'Administrador atualizado com sucesso!'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Erro ao atualizar o administrador: ' . $conexao->error
        ]);
    }
    exit();
}

// Busca todos os administradores
$sql = "SELECT id, nome FROM administrador";
$result = $conexao->query($sql);

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
            width: 94%;
            margin: 3%;
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
            width: 600px;
            height: fit-content;
            background: #FFFFFF;
            box-shadow: 0px 187px 75px rgba(0, 0, 0, 0.01), 0px 105px 63px rgba(0, 0, 0, 0.05), 0px 47px 47px rgba(0, 0, 0, 0.09), 0px 12px 26px rgba(0, 0, 0, 0.1), 0px 0px 0px rgba(0, 0, 0, 0.1);
            border-radius: 26px;
        }

        .toggle-password {
            position: absolute;
            top: 50%;
            left: 93%;
            border: none;
            background: none;
            color: #3b3b3b;
            font-size: 16px;
            cursor: pointer;
        }
    </style>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script>
        $(document).ready(function() {
            $("#adminForm").on("submit", function(event) {
                event.preventDefault(); // Evita o comportamento padrão de envio do formulário

                $.ajax({
                    type: "POST",
                    url: "<?php echo $_SERVER['PHP_SELF']; ?>",
                    data: $(this).serialize(), // Envia todos os dados do formulário
                    dataType: "json",
                    success: function(response) {
                        if (response.success) {
                            alert(response.message);
                            $("#adminForm")[0].reset(); // Limpa o formulário após o sucesso
                            location.reload(); // Recarrega a página para atualizar a lista de administradores
                        } else {
                            alert(response.message);
                        }
                    },
                    error: function(xhr, status, error) {
                        alert("Erro: " + xhr.responseText);
                    }
                });
            });
        });



        function deleteAdmin(adminId) {
            if (confirm("Tem certeza que deseja apagar este administrador?")) {
                $.ajax({
                    type: "POST",
                    url: "<?php echo $_SERVER['PHP_SELF']; ?>",
                    data: {
                        delete_id: adminId
                    },
                    success: function(response) {
                        alert(response); // Exibe a resposta do servidor
                        location.reload(); // Recarrega a página para atualizar a lista de administradores
                    },
                    error: function(xhr, status, error) {
                        alert("Erro ao apagar o administrador: " + xhr.responseText);
                    }
                });
            }
        }

        function editAdmin(adminId) {
            var row = $("#admin-" + adminId);
            var nomeCell = row.find(".nome");
            var editButton = row.find(".edit-btn");

            if (editButton.text() === "Editar") {
                // Transformar a célula do nome em um campo de entrada
                var nome = nomeCell.text();
                nomeCell.html('<input type="text" value="' + nome + '" />');

                // Mudar o botão para "Confirmar"
                editButton.text("Confirmar");
            } else {
                // Enviar a alteração para o servidor
                var newNome = nomeCell.find("input").val().trim();

                if (newNome === "") {
                    alert("O campo Nome não pode estar vazio.");
                    return; // Impede o envio da solicitação
                }

                $.ajax({
                    type: "POST",
                    url: "<?php echo $_SERVER['PHP_SELF']; ?>",
                    data: {
                        edit_id: adminId,
                        edit_nome: newNome
                    },
                    dataType: "json",
                    success: function(response) {
                        alert(response.message);
                        location.reload(); // Recarrega a página para refletir as alterações
                    },
                    error: function(xhr, status, error) {
                        alert("Erro ao atualizar o administrador: " + xhr.responseText);
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
                                <i class="fas fa-solid fa-user-plus" style="color: #ed842b;"></i>
                                <span class="nav-item" style="color: #ed842b; font-weight: 600;">Adicionar Admin</span>
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
            style="top: 50%; left: 60%; transform: translate(-50%, -50%); position: absolute; padding: 20px; border-radius: 20px;">
            <div class="modal" style=" max-height: 97vh; 
                overflow-y: auto;          
                animation: pulse;          
                animation-duration: 1.5s; ">
                <form class="form" id="adminForm" method="POST" action="<?php echo $_SERVER['PHP_SELF']; ?>"
                    enctype="multipart/form-data">
                    <div class="separator">
                        <hr class="line">
                        <p>Novo Administrador</p>
                        <hr class="line">
                    </div>
                    <div class="credit-card-info--form">
                        <div class="input_container">
                            <label for="nome" class="input_label">Nome do Administrador:</label>
                            <input id="nome" class="input_field" type="text" name="nome"
                                placeholder="Nome do Administrador" maxlength="30" required>
                            <label for="nome" class="input_label" style="padding-left: 5px; color: #ed862b;">* Campo
                                Obrigatório</label>
                        </div>
                        <div class="input_container" style="position: relative;">
                            <label for="senha" class="input_label">Senha:</label>
                            <input id="password" class="input_field" type="password" minlength="8" 
                            maxlength="20" name="senha" placeholder="Senha" required>
                            <button type="button" id="togglePassword" class="toggle-password">
                                <i class="fas fa-eye"></i>
                            </button>
                            <label for="senha" class="input_label" style="padding-left: 5px; color: #ed862b;">* Campo Obrigatório</label>
                        </div>
                    </div>
                    <button class="btn">Cadastrar</button>
                </form>

                <table>
                    <tr>
                        <th>Nome</th>
                        <th>Senha</th>
                        <th>Ações</th>
                    </tr>
                    <?php if ($result->num_rows > 0): ?>
                        <?php while ($row = $result->fetch_assoc()): ?>
                            <tr id="admin-<?php echo $row['id']; ?>">
                                <td style="max-width: 200px;" class="nome"><?php echo $row['nome']; ?></td>
                                <td class="senha">********</td>
                                <td>
                                    <button class="action-btn edit-btn" onclick="editAdmin(<?php echo $row['id']; ?>)">Editar</button>
                                    <?php if ($row['id'] != 1): ?>
                                        <button class="action-btn delete-btn" onclick="deleteAdmin(<?php echo $row['id']; ?>)">Apagar</button>
                                    <?php endif; ?>
                                </td>
                            </tr>

                        <?php endwhile; ?>
                    <?php endif; ?>
                </table>
            </div>
        </section>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const togglePassword = document.getElementById('togglePassword');
            const passwordField = document.getElementById('password');

            togglePassword.addEventListener('click', function() {
                // Verifica o tipo atual do campo de senha e alterna entre 'password' e 'text'
                const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordField.setAttribute('type', type);

                // Alterna o ícone de olho aberto/fechado
                this.querySelector('i').classList.toggle('fa-eye');
                this.querySelector('i').classList.toggle('fa-eye-slash');
            });
        });
    </script>
</body>

</html>
