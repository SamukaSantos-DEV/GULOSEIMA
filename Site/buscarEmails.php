<?php
require_once 'config.php';

if (isset($_GET['term'])) {
    $term = '%' . $_GET['term'] . '%';
    $sql = "SELECT email FROM estudante WHERE email LIKE ? LIMIT 10";
    $stmt = mysqli_prepare($conexao, $sql);
    mysqli_stmt_bind_param($stmt, "s", $term);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    $emails = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $emails[] = $row['email'];
    }

    echo json_encode($emails);
}
?>
