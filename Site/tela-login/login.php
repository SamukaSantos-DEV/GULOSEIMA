<?php
// Incluir o arquivo de configuração que contém a conexão com o banco de dados
require_once '../config.php';

// Inicializar a variável de mensagem de erro
$errorMsg = '';

// Verificar se os campos foram submetidos via POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Receber os dados do formulário
    $nome = $_POST['nome'];
    $senha = $_POST['senha'];

    // Consulta SQL para verificar o usuário
    $query = "SELECT * FROM administrador WHERE BINARY nome = :nome AND BINARY senha = :senha";

    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':nome', $nome);
    $stmt->bindParam(':senha', $senha);
    $stmt->execute();

    // Verificar se encontrou um usuário correspondente
    if ($stmt->rowCount() == 1) {
        // Obter os dados do usuário
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

        session_start();
        $_SESSION['nome'] = $usuario['nome'];
        $_SESSION['id'] = $usuario['id']; // Certifique-se de que esta linha está presente

        // Verificar o ID do usuário para exibir alerta específico
        if ($usuario['id'] == 1) {
            $_SESSION['showWelcomeAlert'] = "Bem-vindo, Daniel!";
        } else {
            $_SESSION['showWelcomeAlert'] = "Bem-vindo, administrador!";
        }

        // Redirecionar para a página inicial do seu sistema (cardapioAlimentos.php neste caso)
        header('Location: ../compraPresencial.php');
        exit;
    } else {
        // Definir mensagem de erro para ser exibida via JavaScript
        $errorMsg = 'Usuário ou senha incorretos. Por favor, tente novamente.';
        echo "<script>alert('$errorMsg'); window.location.replace('index.html');</script>";
        exit;
    }
} else {
    // Caso não foram recebidos os dados do POST, redirecionar de volta para o formulário de login
    header('Location: index.html');
    exit;
}
?>
