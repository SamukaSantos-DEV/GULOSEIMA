<?php
require_once 'config.php';

if (isset($_GET['email']) && isset($_GET['quantidade'])) {
    $email = $_GET['email'];
    $quantidade = $_GET['quantidade'];

    $sql = "UPDATE estudante SET saldo = saldo + ? WHERE email = ?";
    $stmt = mysqli_prepare($conexao, $sql);
    mysqli_stmt_bind_param($stmt, "ds", $quantidade, $email);
    if (mysqli_stmt_execute($stmt)) {
        // Redirecionar após sucesso
        header('Location: AdicionarCredito.php?success=1');
        exit();
    } else {
        echo "Erro ao adicionar crédito: " . mysqli_error($conexao);
    }
}
?>