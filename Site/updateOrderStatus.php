<?php
require_once 'config.php';

if (isset($_GET['codigoConfirmacao']) && isset($_GET['statusPedido'])) {
    $codigoConfirmacao = $_GET['codigoConfirmacao'];
    $novoStatus = $_GET['statusPedido'];

    // Atualizar o status do pedido no banco de dados
    $stmt = $conexao->prepare("UPDATE pedido SET statusPedido = ? WHERE codigoConfirmacao = ?");
    $stmt->bind_param('ss', $novoStatus, $codigoConfirmacao);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Erro ao atualizar o status.']);
    }

    $stmt->close();
} else {
    echo json_encode(['success' => false, 'error' => 'Dados insuficientes fornecidos.']);
}

$conexao->close();
?>
