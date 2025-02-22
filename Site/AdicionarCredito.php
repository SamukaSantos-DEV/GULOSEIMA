<?php
session_start();

// Verificar se o usuário está logado
if (!isset($_SESSION['nome'])) {
    header('Location: index.html');
    exit;
}

require_once 'config.php';

if (isset($_POST['email']) && isset($_POST['quantidade']) && isset($_POST['senha'])) {
    $email = $_POST['email'];
    $quantidade = $_POST['quantidade'];
    $senha = $_POST['senha'];

    // Verificar se a senha fornecida corresponde à do administrador logado
    $sqlAdmin = "SELECT senha FROM administrador WHERE nome = ?";
    $stmtAdmin = mysqli_prepare($conexao, $sqlAdmin);
    mysqli_stmt_bind_param($stmtAdmin, "s", $_SESSION['nome']);
    mysqli_stmt_execute($stmtAdmin);
    $resultAdmin = mysqli_stmt_get_result($stmtAdmin);

    if (mysqli_num_rows($resultAdmin) > 0) {
        $rowAdmin = mysqli_fetch_assoc($resultAdmin);
        if ($senha === $rowAdmin['senha']) {
            // Primeiro, selecione o nome do aluno
            $sql = "SELECT nome FROM estudante WHERE email = ?";
            $stmt = mysqli_prepare($conexao, $sql);
            mysqli_stmt_bind_param($stmt, "s", $email);
            mysqli_stmt_execute($stmt);
            $result = mysqli_stmt_get_result($stmt);

            if (mysqli_num_rows($result) > 0) {
                $row = mysqli_fetch_assoc($result);
                $nome = $row['nome'];

                // Exibir mensagem de confirmação
                echo "
                    <script>
                        if (confirm('Você está prestes a adicionar R$ $quantidade ao saldo do aluno $nome ($email). Confirma?')) {
                            location.href = 'confirmacaoCredito.php?email=$email&quantidade=$quantidade';
                        }
                    </script>
                ";
            } else {
                echo "<script>alert('Aluno não encontrado!');</script>";
            }
        } else {
            echo "<script>alert('Senha Não correspondida!');</script>";
        }
    } else {
        echo "<script>alert('Administrador não encontrado!');</script>";
    }
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <title>GULOSEIMA</title>
    <link rel="stylesheet" href="style.css">
    <link rel="icon" href="Imagens/GULOSEIMA LOGO NOVO.png">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
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

        .suggestions {
            position: absolute;
            top: 33%;
            left: 6%;
            border-radius: 10px;
            background: white;
            list-style: none;
            padding: 0;
            margin: 0;
            font-size: 13px;
            z-index: 1000;
            width: calc(90% - 10px);
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
            /* Adiciona um sombreamento para destaque */
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
                                <i class="fas fa-solid fa-user-plus"></i>
                                <span class="nav-item" >Adicionar Admin</span>
                            </a>
                        </li>
                    <?php } ?>


                    <li><a href="AdicionarCredito.php">
                            <i class="fas fa-coins" style="color: #ed842b;"></i>
                            <span class="nav-item" style="color: #ed842b; font-weight: 600;">Crédito</span>
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
        <section style="position: absolute; top: 50%; left: 60%; transform: translate(-50%, -50%); padding: 20px; border-radius: 20px;">
            <div class="modal" style="max-height: 97vh; overflow-y: auto; animation: pulse; animation-duration: 1.5s;">
                <form class="form" method="POST" enctype="multipart/form-data">
                    <div class="separator">
                        <hr class="line">
                        <p>Adicionar Crédito</p>
                        <hr class="line">
                    </div>
                    <div class="input_container">
                        <label for="email_field" class="input_label">Email Institucional:</label>
                        <input id="email_field" class="input_field" type="email" name="email" placeholder="Digite o email" required>
                        <ul id="email_suggestions" class="suggestions"></ul>
                        <label for="password_field" class="input_label" style="padding-left: 5px; color: #ed862b;">*
                            Campo Obrigatório</label>
                    </div>
                    <div class="input_container">
                        <label for="password_field" class="input_label">Quantidade:</label>
                        <input id="password_field" class="input_field" type="number" name="quantidade" placeholder="20" min="0.01" step="0.01" required>
                        <label for="password_field" class="input_label" style="padding-left: 5px; color: #ed862b;">*
                            Campo Obrigatório</label>
                    </div>
                    <div class="password-container">
                        <input type="password" id="password" name="senha" class="input_field" placeholder="Senha ADM" required>
                        <button type="button" id="togglePassword" class="toggle-password">
                            <i class="fas fa-eye"></i>
                        </button>
                        <label for="password_field" class="input_label" style="padding-left: 5px; color: #ed862b;">*
                            Campo Obrigatório</label>
                    </div>
                    <button style="margin-top: -10px;" class="btn" id="add-btn">Adicionar</button>
                </form>
            </div>
        </section>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const emailInput = document.getElementById('email_field');
            const suggestionsContainer = document.getElementById('email_suggestions');

            emailInput.addEventListener('input', function() {
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
                                    li.addEventListener('click', function() {
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

            document.addEventListener('click', function(e) {
                if (!emailInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
                    suggestionsContainer.innerHTML = '';
                }
            });
        });
    </script>

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