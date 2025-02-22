<?php
require_once 'config.php'; // Inclua o arquivo de configuração para conectar ao banco de dados

// Consulta para buscar os horários
$query = "SELECT horario FROM horario";
$result = $conexao->query($query);

$horarios = [];
while ($row = $result->fetch_assoc()) {
    $horarios[] = $row['horario'];
}

echo json_encode($horarios);

$conexao->close(); // Fechar a conexão
?>