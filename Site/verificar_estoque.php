<?php
require_once 'config.php'; // Conexão com o banco de dados

if (isset($_POST['produto']) && isset($_POST['quantidade'])) {
    $produto = $_POST['produto'];
    $quantidade = (int)$_POST['quantidade'];

    // Query para verificar a quantidade disponível
    $sql = "SELECT quantidade FROM produto WHERE nomeProd = ?";
    $stmt = $conexao->prepare($sql);
    $stmt->bind_param("s", $produto);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        if ($row['quantidade'] >= $quantidade) {
            echo "true"; // Estoque suficiente
        } else {
            echo "false"; // Estoque insuficiente
        }
    } else {
        echo "false"; // Produto não encontrado
    }
}
?>
