<?php

session_start();

// Verificar se o usuário está logado
if (!isset($_SESSION['nome'])) {
    header('Location: index.html');
    exit;
}

require_once 'config.php';

function getHorariosDisponiveis($pdo)
{
    $query = "SELECT id, horario FROM horario WHERE disponibilidade = 1";
    $stmt = $pdo->prepare($query);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function getProductIdByName($name, $pdo)
{
    $query = "SELECT id FROM produto WHERE nomeProd = :name";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':name', $name);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    return $result ? $result['id'] : null;
}

function getProductQuantity($productId, $pdo)
{
    $query = "SELECT quantidade FROM produto WHERE id = :productId";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':productId', $productId);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    return $result ? $result['quantidade'] : 0;
}

function updateProductQuantity($productId, $quantity, $pdo)
{
    $query = "UPDATE produto SET quantidade = quantidade - :quantity WHERE id = :productId AND quantidade >= :quantity";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':quantity', $quantity);
    $stmt->bindParam(':productId', $productId);
    $stmt->execute();
    return $stmt->rowCount() > 0;
}

function generateRandomCode()
{
    return mt_rand(1000, 9999);
}

function formatCartItems($cartItems, $pdo)
{
    $formattedItems = [];
    foreach ($cartItems as $item) {
        $productId = getProductIdByName($item['name'], $pdo);
        $formattedItems[] = htmlspecialchars(urldecode($item['name'])) . " - Quantidade: " . htmlspecialchars($item['quantity']) . " - Preço: R$ " . htmlspecialchars($item['price']) . " - ID: " . htmlspecialchars($productId);
    }
    return implode(' | ', $formattedItems); // Separador opcional
}

$erroMensagem = '';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Obter os dados via GET
    $cartItems = json_decode($_GET['cartItems'], true);
    $totalPrice = urldecode($_GET['totalPrice']);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['confirmar'])) {
    // Obter os dados do formulário via POST
    $cartItems = json_decode($_POST['cartItems'], true);
    $totalPrice = urldecode($_POST['totalPrice']);
    $horarioId = $_POST['horario'];

    // ID do estudante fixo (pode ser dinâmico em outro contexto)
    $studentId = 1;

    // Gere um código de confirmação aleatório
    $codigoConfirmacao = generateRandomCode();

    try {
        // Iniciar uma transação
        $pdo->beginTransaction();

        // Verificar se o estoque é suficiente
        foreach ($cartItems as $item) {
            $productId = getProductIdByName($item['name'], $pdo);
            if ($productId) {
                $stockQuantity = getProductQuantity($productId, $pdo);
                if ($stockQuantity < $item['quantity']) {
                    $erroMensagem = "Estoque insuficiente para o produto: " . htmlspecialchars($item['name']);
                    throw new Exception($erroMensagem);
                }
            }
        }

        // Criar o pedido
        $query = "INSERT INTO pedido (codigoConfirmacao, totalPedido, dataPedido, horaPedido, FK_horario_id, FK_estudante_id, statusPedido) 
                  VALUES (:codigoConfirmacao, :totalPrice, CURDATE(), CURTIME(), :horarioId, :studentId, 'Aguardando Retirada')";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':codigoConfirmacao', $codigoConfirmacao);
        $stmt->bindParam(':totalPrice', $totalPrice);
        $stmt->bindParam(':horarioId', $horarioId);
        $stmt->bindParam(':studentId', $studentId);
        $stmt->execute();

        // Obter o ID do pedido criado
        $pedidoId = $pdo->lastInsertId();

        // Criar um novo item_pedido para cada item no carrinho
        $query = "INSERT INTO item_pedido (valorItemPedido, quantidadeItemPedido, FK_pedido_id, FK_produto_id) 
                  VALUES (:price, :quantity, :pedidoId, :productId)";
        $stmt = $pdo->prepare($query);
        foreach ($cartItems as $item) {
            $productId = getProductIdByName($item['name'], $pdo);
            if ($productId) {
                // Atualizar o estoque do produto
                if (!updateProductQuantity($productId, $item['quantity'], $pdo)) {
                    throw new Exception("Erro ao atualizar o estoque do produto: " . htmlspecialchars($item['name']));
                }

                // Inserir o item do pedido
                $stmt->bindParam(':price', $item['price']);
                $stmt->bindParam(':quantity', $item['quantity']);
                $stmt->bindParam(':pedidoId', $pedidoId);
                $stmt->bindParam(':productId', $productId);
                $stmt->execute();
            }
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
        $erroMensagem = htmlspecialchars($e->getMessage());
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
                <form method="POST" action="">

                    <div class="input_container">
                        <label for="input_name" class="input_label">Nome:</label>
                        <input id="input_name" class="input_field" type="text" value="Compra Presencial" readonly>
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

                    <div class="input_container">
                        <label for="password_field" class="input_label" style="padding-left: 5px; color: #ed862b; font-size: 17px">Total: R$ <?php echo htmlspecialchars($totalPrice); ?></label>
                    </div>

                    <input type="hidden" name="cartItems" value="<?php echo htmlspecialchars(json_encode($cartItems)); ?>">
                    <input type="hidden" name="totalPrice" value="<?php echo htmlspecialchars($totalPrice); ?>">

                    <!-- Botão de confirmação -->
                    <input type="submit" value="Confirmar pedido" class="btn" name="confirmar">

                    <?php if ($erroMensagem): ?>
                        <script>
                            alert('<?php echo $erroMensagem; ?>');
                        </script>
                    <?php endif; ?>
                </form>
            </div>
    </div>
</body>

</html>
