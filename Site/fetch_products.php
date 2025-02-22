<?php
require_once 'config.php';

$tipoProduto = isset($_POST['tipo_produto']) ? $_POST['tipo_produto'] : '';

if ($tipoProduto) {
    $sql = "SELECT p.id, p.quantidade, p.nomeProd, p.valor, p.imagem, p.disponibilidade
            FROM produto p 
            JOIN tipoproduto t ON p.fk_tipoProduto_id = t.id 
            WHERE (t.tipoproduto = ? OR ? = '') AND p.disponibilidade = 1";
    $stmt = $conexao->prepare($sql);
    $stmt->bind_param('ss', $tipoProduto, $tipoProduto);
    $stmt->execute();
    $result = $stmt->get_result();
} else {
    $sql = "SELECT id, quantidade, nomeProd, valor, imagem, disponibilidade FROM produto WHERE disponibilidade = 1";
    $result = $conexao->query($sql);
}

$output = '';
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $output .= '<div class="job_cardmin show-popup" id="product' . $row['id'] . '">';
        $output .= '<div class="job_details2 show-popup">';
        $output .= '<div class="content">';
        $output .= '<div class="img"><img src="' . $row["imagem"] . '" alt="" style="height: 80px;"></div>';
        $output .= '<div class="text">';
        $output .= '<h2>' . $row["nomeProd"] . '</h2>';
        $output .= '<h4>Valor: R$ ' . number_format($row["valor"], 2, ',', '.') . '</h4>';
        $output .= '</div></div>';
        $output .= '<div class="buttons">';
        $output .= '<button id="product-' . $row['id'] . '-buy" class="buttonComp">Comprar</button>';
        $output .= '<button id="product-' . $row['id'] . '-cart" class="buttonCar">Carrinho</button>';
        $output .= '</div></div></div>';
    }
} else {
    $output = 'Nenhum produto encontrado.';
}

echo $output;
?>
