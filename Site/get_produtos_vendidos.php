<?php
header('Content-Type: application/json');

// Configurações de conexão com o banco de dados
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "guloseima";

$conn = new mysqli($servername, $username, $password, $dbname);

// Verifica a conexão
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Inicializa a cláusula WHERE e os parâmetros
$whereClause = "";
$params = array();

if (!empty($_GET['mes'])) {
    $whereClause .= " AND MONTH(ped.dataPedido) = ?";
    $params[] = $_GET['mes'];
}
if (!empty($_GET['ano'])) {
    $whereClause .= " AND YEAR(ped.dataPedido) = ?";
    $params[] = $_GET['ano'];
}
if (!empty($_GET['dia'])) {
    $whereClause .= " AND DAY(ped.dataPedido) = ?";
    $params[] = $_GET['dia'];
}

// Consulta SQL
$sql = "
    SELECT 
        p.nomeProd AS produto_nome,
        SUM(ip.quantidadeItemPedido) AS total_vendido
    FROM item_pedido ip
    JOIN produto p ON ip.FK_produto_id = p.id
    JOIN pedido ped ON ip.FK_pedido_id = ped.id
    WHERE 1=1 " . $whereClause . "
    GROUP BY p.nomeProd
    ORDER BY total_vendido DESC
";

$stmt = $conn->prepare($sql);

// Verifica se há parâmetros e os vincula à consulta
if (!empty($params)) {
    $types = str_repeat('i', count($params)); // Usa 'i' para inteiros (dia, mês e ano)
    $stmt->bind_param($types, ...$params);
}

// Executa a consulta e processa os resultados
$stmt->execute();
$result = $stmt->get_result();

$data = array();
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

// Fecha a conexão
$stmt->close();
$conn->close();

// Retorna os dados como JSON
echo json_encode($data);
?>
