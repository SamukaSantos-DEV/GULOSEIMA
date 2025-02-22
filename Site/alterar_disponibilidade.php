<?php
// Inclui o arquivo de conexão com o banco de dados
include 'db_connect_estoque.php'; // Certifique-se de que o arquivo conexao.php esteja corretamente configurado

if (isset($_POST['id'])) {
    $id = $_POST['id'];

    // Obter o estado atual da disponibilidade
    $query = $conn->prepare("SELECT disponibilidade FROM produto WHERE id = ?");
    $query->bind_param('i', $id);
    $query->execute();
    $result = $query->get_result();
    $produto = $result->fetch_assoc();

    if ($produto) {
        // Alternar o valor da disponibilidade (se 1 muda para 0, se 0 muda para 1)
        $novaDisponibilidade = $produto['disponibilidade'] ? 0 : 1;

        // Atualizar a disponibilidade no banco de dados
        $update = $conn->prepare("UPDATE produto SET disponibilidade = ? WHERE id = ?");
        $update->bind_param('ii', $novaDisponibilidade, $id);
        $update->execute();

        // Retornar o novo valor para o JavaScript atualizar na página
        echo $novaDisponibilidade;
    } else {
        echo "Erro: Produto não encontrado.";
    }
} else {
    echo "Erro: ID não fornecido.";
}


?>
