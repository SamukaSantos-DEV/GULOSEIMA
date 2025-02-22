<?php
session_start();

// Verifica se o usuário está logado
if (!isset($_SESSION['nome'])) {
    header('Location: index.html');
    exit;
}

require_once 'config.php';
include 'db_connect_estoque.php';

$message = ''; // Variável para armazenar a mensagem de alerta

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id'];
    $nomeProd = $_POST['nomeProd'];
    $quantidade = $_POST['quantidade'];
    $valor = $_POST['valor'];
    $tipo = $_POST['tipo'];
    $alerta = $_POST['alerta'];
    $imagemAtual = null; // Variável para armazenar o nome da nova imagem

    // Verifica se uma nova imagem foi enviada
    if (!empty($_FILES['imagem']['name'])) {
        $imagem = $_FILES['imagem']['name'];
        $targetDir = "ImagensProdutos/";
        $targetFile = $targetDir . basename($imagem);
        $uploadOk = 1;

        // Verifica se a imagem é um arquivo de imagem real
        $check = getimagesize($_FILES['imagem']['tmp_name']);
        if ($check === false) {
            $message = "O arquivo não é uma imagem.";
            $uploadOk = 0;
        }

      
       

        // Apenas permitir certos formatos de arquivo
        $imageFileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));
        if (!in_array($imageFileType, ['jpg', 'jpeg', 'png', 'gif'])) {
            $message = "Desculpe, apenas arquivos JPG, JPEG, PNG e GIF são permitidos.";
            $uploadOk = 0;
        }

        // Se tudo estiver bem, tenta fazer o upload do arquivo
        if ($uploadOk === 1) {
            if (move_uploaded_file($_FILES['imagem']['tmp_name'], $targetFile)) {
                $imagemAtual = $targetFile; // Armazenando o caminho completo
                $message = "Imagem carregada com sucesso.";
            } else {
                $message = "Desculpe, houve um erro ao fazer o upload do seu arquivo.";
            }
        }
    }

    // Atualiza o banco de dados
    if ($imagemAtual) {
        // Se uma nova imagem foi enviada, atualize a imagem no banco
        $sql = "UPDATE produto SET nomeProd=?, quantidade=?, valor=?, fk_tipoProduto_id=?, imagem=?, alerta=? WHERE id=?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("siissii", $nomeProd, $quantidade, $valor, $tipo, $imagemAtual, $alerta, $id);
    } else {
        // Se não houve upload da nova imagem, atualize os outros campos sem alterar a imagem
        $sql = "UPDATE produto SET nomeProd=?, quantidade=?, valor=?, fk_tipoProduto_id=?, alerta=? WHERE id=?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("siisii", $nomeProd, $quantidade, $valor, $tipo, $alerta, $id);
    }


    // Execute a consulta e verifique o resultado
    if ($stmt->execute()) {
        $message = "Produto atualizado com sucesso.";
    } else {
        $message = "Erro ao atualizar o produto: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
}

?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Atualizar Produto</title>
</head>
<body>

<!-- Aqui você pode incluir seu formulário para atualizar o produto -->

<?php if ($message): ?>
    <script>
        alert("<?php echo addslashes($message); ?>");
        window.location.href = "cardapioalimentos.php"; // Redireciona após o alert
    </script>
<?php endif; ?>

</body>
</html>
