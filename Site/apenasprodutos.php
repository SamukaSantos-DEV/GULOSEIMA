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


// Verificar a conexão com o banco de dados
if ($conexao->connect_error) {
    die("Conexão falhou: " . $conexao->connect_error);
}


// Consulta para obter os horários cadastrados dinamicamente, incluindo o ID do horário
$sql_horarios = "SELECT id, horario FROM horario"; // Certifique-se de que 'id' é o nome correto da coluna de ID na tabela 'horario'
$result_horarios = $conexao->query($sql_horarios);

$horarios = [];
if ($result_horarios->num_rows > 0) {
    while ($row = $result_horarios->fetch_assoc()) {
        $horarios[] = $row; // Armazena o ID e o horário em cada entrada do array
    }
}

// Monta a consulta SQL para puxar os produtos e as quantidades por horário
$sql_produtos = "SELECT pr.nomeProd AS nome_produto, ";

foreach ($horarios as $horario) {
    $horario_id = $horario['id'];
    $sql_produtos .= "SUM(CASE WHEN p.FK_horario_id = '$horario_id' THEN ip.quantidadeItemPedido ELSE 0 END) AS quantidade_{$horario_id}, ";
}





// Monta a consulta SQL para puxar os produtos e as quantidades por horário
$sql_produtos = "SELECT pr.nomeProd AS nome_produto, ";

foreach ($horarios as $horario) {
    $horario_id = $horario['id'];
    $sql_produtos .= "SUM(CASE WHEN p.FK_horario_id = '$horario_id' THEN ip.quantidadeItemPedido ELSE 0 END) AS quantidade_{$horario_id}, ";
}

$sql_produtos .= "SUM(ip.quantidadeItemPedido) AS quantidade_total
                  FROM pedido p
                  JOIN item_pedido ip ON p.id = ip.FK_pedido_id
                  JOIN produto pr ON ip.FK_produto_id = pr.id
                  WHERE p.statusPedido = 'Aguardando Retirada'
                  GROUP BY pr.nomeProd";

$result_produtos = $conexao->query($sql_produtos);
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
            margin-bottom: 20px;
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
                            <i class="fas fa-solid fa-clock"></i>
                            <span class="nav-item">Cadastro horarios</span>
                        </a>
                    </li>
                    <li><a href="Pedidos.php">
                            <i class="fas fa-solid fa-bell" style="color: #ed842b;"></i>
                            <span class="nav-item" style="color: #ed842b; font-weight: 600;">Pedidos</span>
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
                        <h1 style="transform: rotate(180deg); position: absolute; margin-top: 27.7px;"><a href="Pedidos.php" style=" position: absolute; font-size: 22px; color: #ed842b;">➜</a></h1>
                        <hr class="line" style="margin-left: 20%; width: 100%;">
                        <p>Produtos ainda não retirados</p>
                        <hr class="line" style="margin-left: -17%; width: 110%;">
                    </div>

                </form>
                <table>
                    <thead>
                        <tr>
                            <th>Produto</th>
                            <?php foreach ($horarios as $horario): ?>
                                <th><?php echo htmlspecialchars($horario['horario']); ?></th>
                            <?php endforeach; ?>

                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php while ($row = $result_produtos->fetch_assoc()): ?>
                            <tr>
                                <td class="nome_produto"><?php echo htmlspecialchars($row["nome_produto"]); ?></td>

                                <?php foreach ($horarios as $horario): ?>
                                    <td class="quantidade_<?php echo strtolower($horario['id']); ?>">
                                        <?php echo htmlspecialchars($row["quantidade_" . $horario['id']]); ?>
                                    </td>
                                <?php endforeach; ?>


                                <td class="quantidade_total"><?php echo htmlspecialchars($row["quantidade_total"]); ?></td>
                            </tr>
                        <?php endwhile; ?>
                    </tbody>
                </table>
            </div>



    </div>
</body>

</html>
