<?php
require_once 'config.php';

$email = $_POST['email'];
$totalPrice = $_POST['totalPrice'];

$sql = "SELECT saldo FROM estudante WHERE email = '$email'";
$result = $conexao->query($sql);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $saldo = $row['saldo'];

    if ($saldo >= $totalPrice) {
        // Aluno tem crédito o suficiente, prossegue normalmente
        echo "true";
    } else {
        // Aluno não tem crédito o suficiente, exibe mensagem de erro
        echo "false";
    }
} else {
    // Email não existe, exibe mensagem de erro
    echo "false";
}
?>