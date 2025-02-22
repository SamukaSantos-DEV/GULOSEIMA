<?php
require_once 'config.php';

$email = $_POST['email'];
$token = $_POST['token'];

// Verifica o email e token
$sql = "SELECT token FROM estudante WHERE email = ?";
$stmt = $conexao->prepare($sql);
$stmt->bind_param('s', $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $storedToken = $row['token'];

    // Remove espaços extras e converte para minúsculas para garantir comparação correta
    $token = trim($token); // Remove espaços no início e no fim
    $storedToken = trim($storedToken);

    if ($token === $storedToken) {
        echo "true"; // Token válido
    } else {
        echo "false"; // Token inválido
    }
} else {
    echo "false"; // Email não encontrado
}
?>
