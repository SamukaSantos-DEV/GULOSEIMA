<?php
header('Content-Type: application/json');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "guloseima";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$whereClause = "";
$params = array();
if (!empty($_GET['mes'])) {
    $whereClause .= " AND MONTH(p.dataPedido) = ?";
    $params[] = $_GET['mes'];
}
if (!empty($_GET['ano'])) {
    $whereClause .= " AND YEAR(p.dataPedido) = ?";
    $params[] = $_GET['ano'];
}
if (!empty($_GET['dia'])) {
    $whereClause .= " AND DAY(p.dataPedido) = ?";
    $params[] = $_GET['dia'];
}
$sql = "SELECT 
            DATE_FORMAT(p.dataPedido, '%Y-%m-%d') as data_pedido,
            SUM(ip.valorItemPedido * ip.quantidadeItemPedido) as total_lucro
        FROM item_pedido ip
        JOIN pedido p ON ip.FK_pedido_id = p.id
        WHERE 1 = 1 " . $whereClause . "
        GROUP BY data_pedido
        ORDER BY data_pedido";
$stmt = $conn->prepare($sql);
if (!empty($params)) {
    $types = str_repeat('s', count($params));
    $stmt->bind_param($types, ...$params);
}
$stmt->execute();
$result = $stmt->get_result();

$data = array();
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
} else {
    echo json_encode(array());
}

$stmt->close();
$conn->close();
echo json_encode($data);
