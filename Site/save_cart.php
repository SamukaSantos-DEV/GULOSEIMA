<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $purchases = $_POST['purchases'];
    $pedido_id = 1; // Substitua isso pelo ID do pedido real

    foreach ($purchases as $item) {
        $nomeProd = $item['name'];
        $quantidade = $item['quantity'];
        $valorUnitario = $item['price'];

        // Busca o ID do produto e a quantidade atual no banco de dados
        $sql = "SELECT id, quantidade FROM produto WHERE nomeProd = '$nomeProd'";
        $result = $conexao->query($sql);
        if ($result->num_rows > 0) {
            $produto = $result->fetch_assoc();
            $produto_id = $produto['id'];
            $quantidadeAtual = $produto['quantidade'];

            // Verifica se há estoque suficiente
            if ($quantidadeAtual >= $quantidade) {
                // Insere os dados no banco de dados
                $sql = "INSERT INTO item_pedido (valorItemPedido, quantidadeItemPedido, FK_pedido_id, FK_produto_id) 
                        VALUES ('$valorUnitario', '$quantidade', '$pedido_id', '$produto_id')";
                if ($conexao->query($sql)) {
                    // Subtrai a quantidade do estoque
                    $novaQuantidade = $quantidadeAtual - $quantidade;
                    $sql = "UPDATE produto SET quantidade = '$novaQuantidade' WHERE id = '$produto_id'";
                    if (!$conexao->query($sql)) {
                        echo "Error ao atualizar a quantidade do produto: " . $conexao->error;
                    }
                } else {
                    echo "Error ao inserir o item no pedido: " . $conexao->error;
                }
            } else {
                echo "Quantidade insuficiente em estoque para o produto: $nomeProd";
            }
        } else {
            echo "Produto não encontrado: $nomeProd";
        }
    }
    echo "Items saved successfully";
}
?>
