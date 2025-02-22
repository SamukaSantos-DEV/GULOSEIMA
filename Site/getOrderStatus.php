<?php
require_once 'config.php';

if (isset($_GET['codigoConfirmacao'])) {
    $codigoConfirmacao = $_GET['codigoConfirmacao'];

    // Busca o status do pedido no banco de dados
    $stmt = $conexao->prepare("SELECT statusPedido FROM pedido WHERE codigoConfirmacao = ?");
    $stmt->bind_param('s', $codigoConfirmacao);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        echo json_encode(['statusPedido' => $row['statusPedido']]);
    } else {
        echo json_encode(['statusPedido' => '']);
    }

    $stmt->close();
} else {
    echo json_encode(['statusPedido' => '']);
}

$conexao->close();
?>
