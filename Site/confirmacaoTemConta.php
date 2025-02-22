<?php
require_once 'config.php'; // Inclua o arquivo de configuração com as credenciais do banco de dados

// Função para buscar o nome do estudante
function getStudentNameByEmail($email, $pdo)
{
    $query = "SELECT nome FROM estudante WHERE email = :email";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':email', $email);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    return $result ? htmlspecialchars($result['nome']) : 'Estudante não encontrado';
}

// Função para buscar o ID do produto com base no nome
function getProductIdByName($name, $pdo)
{
    $query = "SELECT id FROM produto WHERE nomeProd = :name";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':name', $name);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    return $result ? $result['id'] : 'ID não encontrado';
}

// Função para gerar um código de confirmação aleatório
function generateRandomCode($length = 4)
{
    $characters = '0123456789';
    $code = '';
    for ($i = 0; $i < $length; $i++) {
        $code .= $characters[rand(0, strlen($characters) - 1)];
    }
    return $code;
}

// Função para obter o ID do estudante por e-mail
function getStudentIdByEmail($email, $pdo)
{
    $query = "SELECT id FROM estudante WHERE email = :email";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':email', $email);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    return $result ? $result['id'] : null;
}

// Função para obter os horários
function getHorariosDisponiveis($pdo)
{
    $query = "SELECT id, horario FROM horario WHERE disponibilidade = 1";
    $stmt = $pdo->prepare($query);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}


// Função para atualizar a quantidade do produto
function updateProductQuantity($productId, $quantity, $pdo)
{
    $query = "UPDATE produto SET quantidade = quantidade - :quantity WHERE id = :productId";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':quantity', $quantity);
    $stmt->bindParam(':productId', $productId);
    $stmt->execute();
}

// Função para atualizar o saldo do estudante
function updateStudentBalance($studentId, $totalPrice, $pdo)
{
    $query = "UPDATE estudante SET saldo = saldo - :totalPrice WHERE id = :studentId";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':totalPrice', $totalPrice);
    $stmt->bindParam(':studentId', $studentId);
    $stmt->execute();
}

// Conectar ao banco de dados usando a conexão estabelecida em config.php
$pdo = $GLOBALS['pdo']; // Supondo que a variável global $pdo é definida em config.php

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['confirmar'])) {
    // Obtenha os dados do formulário
    $email = urldecode($_POST['email']);
    $cartItems = json_decode($_POST['cartItems'], true);
    $totalPrice = urldecode($_POST['totalPrice']);
    $horarioId = $_POST['horario'];

    // Gere um código de confirmação aleatório
    $codigoConfirmacao = generateRandomCode();

    // Obtenha o ID do estudante
    $studentId = getStudentIdByEmail($email, $pdo);

    // Use ID 9 se o estudante não for encontrado
    if (!$studentId) {
        $studentId = 1;
    }

    try {
        // Iniciar uma transação
        $pdo->beginTransaction();

        // Crie um novo pedido
        $query = "INSERT INTO pedido (codigoConfirmacao, totalPedido, dataPedido, horaPedido, FK_horario_id, FK_estudante_id, statusPedido) VALUES (:codigoConfirmacao, :totalPrice, CURDATE(), CURTIME(), :horarioId, :studentId, 'Aguardando Retirada')";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':codigoConfirmacao', $codigoConfirmacao);
        $stmt->bindParam(':totalPrice', $totalPrice);
        $stmt->bindParam(':horarioId', $horarioId);
        $stmt->bindParam(':studentId', $studentId);
        $stmt->execute();

        // Obtenha o ID do pedido criado
        $pedidoId = $pdo->lastInsertId();

        // Crie um novo item_pedido para cada item no carrinho
        $query = "INSERT INTO item_pedido (valorItemPedido, quantidadeItemPedido, FK_pedido_id, FK_produto_id) VALUES (:price, :quantity, :pedidoId, :productId)";
        $stmt = $pdo->prepare($query);
        foreach ($cartItems as $item) {
            $productId = getProductIdByName($item['name'], $pdo);
            if ($productId) {
                // Atualize o estoque do produto
                updateProductQuantity($productId, $item['quantity'], $pdo);

                $stmt->bindParam(':price', $item['price']);
                $stmt->bindParam(':quantity', $item['quantity']);
                $stmt->bindParam(':pedidoId', $pedidoId);
                $stmt->bindParam(':productId', $productId);
                $stmt->execute();
            }
        }

        // Atualize o saldo do estudante se o estudante for encontrado
        if ($studentId != 9) {
            updateStudentBalance($studentId, $totalPrice, $pdo);
        }

        // Commit da transação
        $pdo->commit();
        echo '<script>
alert("Pedido criado com sucesso! Código de confirmação: ' . htmlspecialchars($codigoConfirmacao) . '");
window.location.href = "pedidos.php";
</script>';
    } catch (Exception $e) {
        // Rollback da transação em caso de erro
        $pdo->rollBack();
        echo "Erro ao criar o pedido: " . htmlspecialchars($e->getMessage());
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $email = urldecode($_GET['email']);
    $cartItems = json_decode($_GET['cartItems'], true);
    $totalPrice = urldecode($_GET['totalPrice']);

    // Obtendo o nome do estudante
    $studentName = getStudentNameByEmail($email, $pdo);
}
?>


<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GULOSEIMA</title>
    <link rel="stylesheet" href="style.css">
    <link rel="icon" href="Imagens/GULOSEIMA LOGO NOVO.png">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css">
    <style>
        body {
            overflow: hidden;
            font-family: Arial, sans-serif;
        }

        .container {
            padding: 20px;
        }

        .form-container {
            max-height: 97vh;
            overflow-y: auto;
            animation: pulse;
            animation-duration: 1.5s;
            padding: 20px;
            width: fit-content;
            height: fit-content;
            background: #FFFFFF;
            box-shadow: 0px 187px 75px rgba(0, 0, 0, 0.01), 0px 105px 63px rgba(0, 0, 0, 0.05), 0px 47px 47px rgba(0, 0, 0, 0.09), 0px 12px 26px rgba(0, 0, 0, 0.1), 0px 0px 0px rgba(0, 0, 0, 0.1);
            border-radius: 26px;
            width: 400px;
        }

        .form-container h3 {
            text-align: center;
        }

        .form-container form {
            max-width: 600px;
            margin: 0 auto;
        }

        .form-container ul {
            list-style-type: none;
            padding: 0;
        }

        .form-container ul li {
            padding: 5px 0;
        }

        .btn {
            display: block;
            width: 100%;
            padding: 10px;
            background-color: #D35400;
            color: #fff;
            border: none;
            border-radius: 11px;
            font-size: 16px;
            text-align: center;
            cursor: pointer;

            margin-top: 22px;
        }

        .btn:hover {
            background-color: #E67E22;
        }

        .section {
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            position: absolute;
            padding: 20px;
            border-radius: 20px;
        }

        .input_field {
            box-sizing: border-box;
            overflow: auto;
            white-space: pre-wrap;
            width: auto;
            height: 50px;
            padding: 10px 12px;
            border-radius: 8px;
            margin-bottom: 15px;
            outline: none;
            height: max-content;
            resize: none;
        }
    </style>
</head>

<body>
    <div class="container">
        <section class="section">
            <div class="form-container">

                <div class="separator" style="margin-bottom: 20px;">
                    <h1 style="transform: rotate(180deg); position: absolute; margin-top: 27.7px;"><a href="compraPresencial.php" style=" position: absolute; font-size: 22px; color: #ed842b;">➜</a></h1>
                    <hr class="line" style="margin-left: 25%; width: 75%;">
                    <p>Confirmar Compra</p>
                    <hr class="line">
                </div>
                <div class="input_container">
                    <label for="input_name" class="input_label">Email:</label>
                    <input id="input_name" class="input_field" type="text" value="<?php echo htmlspecialchars($email); ?>" readonly>
                </div>
                <div class="input_container">
                    <label for="input_name" class="input_label">Nome:</label>
                    <input id="input_name" class="input_field" type="text" value="<?php echo $studentName; ?>" readonly>
                </div>

                <?php foreach ($cartItems as $index => $item): ?>
                    <div class="input_container">
                        <label for="input_cart_item_<?php echo $index; ?>" class="input_label">Item <?php echo $index + 1; ?>:</label>
                        <input id="input_cart_item_<?php echo $index; ?>" class="input_field" type="text" value="<?php echo htmlspecialchars($item['name']); ?> - x<?php echo htmlspecialchars($item['quantity']); ?> - R$ <?php echo htmlspecialchars($item['price']); ?>" readonly>
                    </div>
                <?php endforeach; ?>




                <form method="POST" action="">
                <div class="input_container">
    <label for="horario_field" class="input_label">Horário:</label>
    <select name="horario" class="input_field">
        <?php foreach (getHorariosDisponiveis($pdo) as $horario): ?>
            <option value="<?php echo htmlspecialchars($horario['id']); ?>">
                <?php echo htmlspecialchars($horario['horario']); ?>
            </option>
        <?php endforeach; ?>
    </select>
</div>
                    <input type="hidden" name="email" value="<?php echo htmlspecialchars($email); ?>">
                    <input type="hidden" name="cartItems" value="<?php echo htmlspecialchars(json_encode($cartItems)); ?>">
                    <input type="hidden" name="totalPrice" value="<?php echo htmlspecialchars($totalPrice); ?>">


                    <div class="input_container">
                        <label for="password_field" class="input_label" style="padding-left: 5px; color: #ed862b; font-size: 17px">Total: R$ <?php echo htmlspecialchars($totalPrice); ?></label>
                    </div>
                    <input type="submit" value="Confirmar pedido" name="confirmar" class="btn">
                </form>


            </div>
        </section>
    </div>
</body>

</html>