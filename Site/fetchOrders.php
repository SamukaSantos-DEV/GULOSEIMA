<?php
include 'db.php'; 
function fetchOrders($timePeriod = null, $filterType = null) {
    global $conn;
    $query = "SELECT 
                pedido.id AS pedidoId, 
                codigoConfirmacao, 
                estudante.nome AS estudanteNome, 
                pedido.totalPedido, 
                pedido.dataPedido,  
                pedido.horaPedido,  
                pedido.statusPedido,
                pedido.FK_estudante_id,
                produto.nomeProd AS nomeProd,  
                item_pedido.valorItemPedido, 
                item_pedido.quantidadeItemPedido
              FROM pedido
              JOIN estudante ON pedido.FK_estudante_id = estudante.id
              JOIN item_pedido ON pedido.id = item_pedido.FK_pedido_id
              JOIN produto ON item_pedido.FK_produto_id = produto.id
              JOIN horario ON pedido.FK_horario_id = horario.id"; // Certifique-se de que 'FK_horario_id' é a chave estrangeira correta

    $query .= " WHERE pedido.statusPedido IN ('Aguardando Retirada','Aguardando Pagamento')";

    // Filtra por tipo de pedido
    if ($filterType === 'aluno') {
        $query .= " AND pedido.FK_estudante_id <> 1"; // Filtra pedidos de alunos
    } elseif ($filterType === 'presencial') {
        $query .= " AND pedido.FK_estudante_id = 1"; // Filtra pedidos de compra presencial
    }

    if ($timePeriod) {
        $query .= " AND horario.horario = :timePeriod"; // Filtra pelo horário
    }

    // Ordena por dataPedido e horaPedido
    $query .= " ORDER BY pedido.dataPedido ASC, pedido.horaPedido ASC";

    $stmt = $conn->prepare($query);

    if ($timePeriod) {
        $stmt->bindParam(':timePeriod', $timePeriod);
    }

    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Agrupar os resultados por pedido
    $orders = [];
    foreach ($results as $row) {
        $pedidoId = $row['pedidoId'];
        
        if (!isset($orders[$pedidoId])) {
            $orders[$pedidoId] = [
                'pedidoId' => $pedidoId,
                'codigoConfirmacao' => $row['codigoConfirmacao'],
                'estudanteNome' => $row['estudanteNome'],
                'totalPedido' => $row['totalPedido'],
                'dataPedido' => $row['dataPedido'],
                'horaPedido' => $row['horaPedido'],
                'statusPedido' => $row['statusPedido'],
                'FK_estudante_id' => $row['FK_estudante_id'],
                'itens' => []
            ];
        }

        $orders[$pedidoId]['itens'][] = [
            'nome_produto' => $row['nomeProd'],
            'valor_item' => $row['valorItemPedido'],
            'quantidade' => $row['quantidadeItemPedido']
        ];
    }

    return array_values($orders); // Retorna como um array indexado
}
?>