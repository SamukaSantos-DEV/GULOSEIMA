<?php
require_once 'config.php';

$email = $_POST['email'];

$sql = "SELECT * FROM estudante WHERE email = '$email'";
$result = $conexao->query($sql);

if ($result->num_rows > 0) {
    // Email existe, prossegue normalmente
    echo "true";
} else {
    // Email não existe, exibe mensagem de erro
    echo "false";
}
?>