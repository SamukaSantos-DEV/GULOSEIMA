<?php

$dbHost = 'localhost';
$dbUsername = 'root';
$dbPassword = '';
$dbName = 'guloseima';

// Cria a conexão
$conexao = new mysqli($dbHost,$dbUsername,$dbPassword,$dbName);




// Configurações do banco de dados
$host = 'localhost';
$dbname = 'guloseima';
$usuario = 'root';
$senha = '';

// Conexão PDO
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $usuario, $senha);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo "Erro de conexão: " . $e->getMessage();
    exit();
}



?>