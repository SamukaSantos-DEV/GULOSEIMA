<?php
session_start();

// Destrói a sessão
session_destroy();

// Redireciona para a tela de index
header('Location: index.php');
exit;
?>