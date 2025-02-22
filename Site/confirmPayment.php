<?php
require_once 'config.php';

if (isset($_GET['codigoConfirmacao'])) {
    $codigoConfirmacao = $_GET['codigoConfirmacao'];

    // Atualizar o status do pedido para "Pagamento Confirmado"
    $query = "UPDATE pedidos SET statusPedido = 'pagamento confirmado' WHERE codigoConfirmacao = ?";
    $stmt = $conexao->prepare($query);
    $stmt->bind_param('s', $codigoConfirmacao);
    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false]);
    }
}
?>
