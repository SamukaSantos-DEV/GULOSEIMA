<?php
session_start();
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Captura os dados do POST
    $email = $_POST['email'];
    $horarioId = $_POST['horario'];
    $cartItems = json_decode($_POST['cartItems'], true);
    $totalPrice = $_POST['totalPrice'];

    // Gera um código de confirmação de 4 dígitos aleatórios
    $codigoConfirmacao = str_pad(mt_rand(0, 9999), 4, '0', STR_PAD_LEFT);

    // Data e hora atuais
    $dataPedido = date('Y-m-d');
    $horaPedido = date('H:i:s');

    // Obtém o ID do estudante
    $stmtEstudante = $pdo->prepare("SELECT id, saldo FROM estudante WHERE email = :email LIMIT 1");
    $stmtEstudante->bindParam(':email', $email);
    $stmtEstudante->execute();

    if ($stmtEstudante->rowCount() > 0) {
        $estudanteRow = $stmtEstudante->fetch();
        $estudanteId = $estudanteRow['id'];
        $saldoEstudante = $estudanteRow['saldo'];

        // Verifica se o estudante tem saldo suficiente
        if ($saldoEstudante < $totalPrice) {
            echo "Saldo insuficiente para concluir o pedido.";
            exit();
        }

        // Insere um novo registro na tabela `pedido` com status "Aguardando Retirada"
        $stmtPedido = $pdo->prepare("
            INSERT INTO pedido (codigoConfirmacao, totalPedido, dataPedido, horaPedido, FK_horario_id, FK_estudante_id, statusPedido) 
            VALUES (:codigoConfirmacao, :totalPedido, :dataPedido, :horaPedido, :FK_horario_id, :FK_estudante_id, 'Retirado')
        ");
        $stmtPedido->bindParam(':codigoConfirmacao', $codigoConfirmacao);
        $stmtPedido->bindParam(':totalPedido', $totalPrice);
        $stmtPedido->bindParam(':dataPedido', $dataPedido);
        $stmtPedido->bindParam(':horaPedido', $horaPedido);
        $stmtPedido->bindParam(':FK_horario_id', $horarioId);
        $stmtPedido->bindParam(':FK_estudante_id', $estudanteId);
        $stmtPedido->execute();

        // Obtém o ID do pedido recém-criado
        $pedidoId = $pdo->lastInsertId();

        // Insere os itens do carrinho na tabela `item_pedido`
        $stmtItemPedido = $pdo->prepare("
            INSERT INTO item_pedido (valorItemPedido, quantidadeItemPedido, FK_pedido_id, FK_produto_id) 
            VALUES (:valorItemPedido, :quantidadeItemPedido, :FK_pedido_id, :FK_produto_id)
        ");

        foreach ($cartItems as $item) {
            $stmtItemPedido->bindParam(':valorItemPedido', $item['price']);
            $stmtItemPedido->bindParam(':quantidadeItemPedido', $item['quantity']);
            $stmtItemPedido->bindParam(':FK_pedido_id', $pedidoId);
            $stmtItemPedido->bindParam(':FK_produto_id', $item['productId']);
            $stmtItemPedido->execute();

            // Atualiza a quantidade do produto na tabela `produto`
            $stmtProduto = $pdo->prepare("
                UPDATE produto 
                SET quantidade = quantidade - :quantidade 
                WHERE id = :produtoId
            ");
            $stmtProduto->bindParam(':quantidade', $item['quantity']);
            $stmtProduto->bindParam(':produtoId', $item['productId']);
            $stmtProduto->execute();
        }

        // Atualiza o saldo do estudante
        $novoSaldo = $saldoEstudante - $totalPrice;
        $stmtAtualizaSaldo = $pdo->prepare("
            UPDATE estudante 
            SET saldo = :novoSaldo 
            WHERE id = :estudanteId
        ");
        $stmtAtualizaSaldo->bindParam(':novoSaldo', $novoSaldo);
        $stmtAtualizaSaldo->bindParam(':estudanteId', $estudanteId);
        $stmtAtualizaSaldo->execute();

        // Confirmação para o usuário
        echo "Pedido realizado com sucesso!<br>";
        echo "Código de Confirmação: " . htmlspecialchars($codigoConfirmacao) . "<br>";
        echo "Total do Pedido: R$ " . htmlspecialchars($totalPrice) . "<br>";

        // Botão para voltar
        echo "<a href='compraPresencial.php'><button>Voltar</button></a>";
    } else {
        echo "Estudante não encontrado.";
    }
} else {
    echo "Método de requisição inválido.";
}
?>
