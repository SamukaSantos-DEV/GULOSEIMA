<?php
require_once 'config.php';

$codigoConfirmacao = $_GET['codigoConfirmacao'];

// Verifique se o código de confirmação foi passado
if (!$codigoConfirmacao) {
    echo json_encode(['error' => 'Código de confirmação não fornecido']);
    exit;
}

// Prepare e execute a consulta
$sql = "SELECT 
            pedido.id AS pedidoId, 
            pedido.dataPedido, 
            pedido.codigoConfirmacao, 
            estudante.nome AS estudanteNome, 
            pedido.totalPedido, 
            produto.nomeProd, 
            item_pedido.quantidadeItemPedido,
            horario.horario,
            pedido.statusPedido
        FROM pedido
        JOIN estudante ON pedido.FK_estudante_id = estudante.id
        JOIN item_pedido ON pedido.id = item_pedido.FK_pedido_id
        JOIN produto ON item_pedido.FK_produto_id = produto.id
        JOIN horario ON pedido.FK_horario_id = horario.id
        WHERE pedido.codigoConfirmacao = ?";

$stmt = $conexao->prepare($sql);
$stmt->bind_param('s', $codigoConfirmacao);
$stmt->execute();
$result = $stmt->get_result();

$order = [];
while ($row = $result->fetch_assoc()) {
    $order['pedidoId'] = $row['pedidoId'];
    $order['dataPedido'] = $row['dataPedido'];
    $order['codigoConfirmacao'] = $row['codigoConfirmacao'];
    $order['estudanteNome'] = $row['estudanteNome'];
    $order['totalPedido'] = $row['totalPedido'];
    $order['horario'] = $row['horario'];
    $order['statusPedido'] = $row['statusPedido'];  // Adiciona o status no retorno

    $order['produtos'][] = [
        'nomeProd' => $row['nomeProd'],
        'quantidade' => $row['quantidadeItemPedido']
    ];
}

if ($order) {
    echo json_encode($order);
} else {
    echo json_encode(['error' => 'Pedido não encontrado']);
}

$stmt->close();
$conexao->close();
?>