<?php
include 'db_connect_estoque.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $id = $_POST['id'];

    $sql = "DELETE FROM produto WHERE id=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo "Produto excluído com sucesso!";
    } else {
        echo "Erro ao excluir o produto: " . $conn->error;
    }

    $stmt->close();
    $conn->close();

    header("Location: cardapioAlimentos.php");
    exit();
}
?>
