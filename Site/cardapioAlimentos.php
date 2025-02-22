<?php
session_start();

// Verificar se o usuário está logado
if (!isset($_SESSION['nome'])) {
    header('Location: index.html');
    exit;
}

require_once 'config.php';
include 'db_connect_estoque.php';

$sql = "SELECT produto.id, produto.nomeProd, produto.quantidade, produto.valor, produto.imagem, tipoproduto.tipoProduto, produto.disponibilidade, produto.alerta
            FROM produto
            JOIN tipoproduto ON produto.fk_tipoProduto_id = tipoproduto.id";
$result = $conn->query($sql);

$tipos_sql = "SELECT id, tipoProduto FROM tipoproduto where id != 1";
$tipos_result = $conn->query($tipos_sql);
$tipos = [];
while ($tipo = $tipos_result->fetch_assoc()) {
    $tipos[] = $tipo;
}
?>

<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GULOSEIMA</title>
    <link rel="stylesheet" href="style.css" />
    <link rel="icon" href="Imagens/GULOSEIMA LOGO NOVO.png">
    <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap"
        rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet">
    <style>
        .container {
            height: calc(100vh);
        }

        .main-top {
            width: 85%;
            left: 15%;
            background: #fff;
            padding: 10px;
            text-align: center;
            font-size: 18px;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: rgb(43, 43, 43);

        }

        .grid-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-start;
            gap: 20px;
            width: 85%;
            margin: 0 auto;
            overflow-y: auto;
            padding: 20px 29px;
            margin-top: 6%;



        }

        .card2 {
            width: calc(33% - 10px);
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            padding: 20px;
            margin-bottom: 16px;
            display: flex;
            flex-direction: column;
            transition: all 0.3s ease;
        }




        .card2:hover {
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        }

        .card2 h2 {
            font-size: 18px;
            color: #000;
            margin-bottom: 10px;
        }

        .form-group {
            width: 100%;
            margin-bottom: 15px;
        }

        .form-group label {
            font-size: 0.9rem;
            margin-bottom: 5px;
        }

        .form-group input,
        .form-group select {
            width: 100%;
            padding: 8px;
            font-size: 1rem;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-sizing: border-box;
        }

        .btn {
            height: 50px;
            background: linear-gradient(0deg, #f29446 0%, #ed842b 50%, #E26A05 100%);
            border-radius: 11px;
            border: none;
            outline: none;
            color: #ffffff;
            font-size: 16px;
            font-weight: 700;
            transition: all 0.3s cubic-bezier(0.15, 0.83, 0.66, 1);
            padding: 10px 70px;
            margin-top: 10px;
            cursor: pointer;
        }

        button.excluir {
            height: 50px;
            background: linear-gradient(0deg, #ff7272 0%, #ed2b2b 50%, #e20505 100%);
            border-radius: 11px;
            border: none;
            outline: none;
            color: #ffffff;
            font-size: 16px;
            font-weight: 700;
            transition: all 0.3s cubic-bezier(0.15, 0.83, 0.66, 1);
            padding: 10px 70px;
            margin-top: 10px;
            cursor: pointer;
        }

        button.excluir:hover {
            box-shadow: 0px 0px 0px 2px #FFFFFF, 0px 0px 0px 4px #0000003a;
        }

        .product-image {
            width: 100px;
            height: 100px;
            object-fit: cover;
            border-radius: 10px;
            margin-bottom: 10px;
        }

        .user-name {
            color: #D35400;
            font-weight: bold;
            margin-right: 20px;
            display: flex;
            align-items: center;
        }

        .user-name i {
            margin-right: 8px;
        }

        .button-group {
            display: flex;
            justify-content: space-between;
            gap: 10px;
        }

        .search_bar {
            width: 82.3%;
            position: fixed;
            margin-left: 16%;
            margin-top: 3%;
        }

        .search_bar input {
            width: 100%;
            border: 1px solid rgb(190, 190, 190);
            box-shadow: 0 0px 10px rgba(0, 0, 0, 0.1);
        }


        .custom-file-upload {
            position: relative;
            cursor: pointer;
        }

        .custom-file-upload label {
            display: inline-block;
            padding: 10px 20px;
            color: #333;
            transition: background-color 0.3s;
            cursor: pointer;
            width: 100%;
            padding: 8px;
            font-size: 1rem;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-sizing: border-box;


        }

        .custom-file-upload label:hover {
            background-color: #eaeaea;
        }

        .custom-file-upload input[type="file"] {
            display: none;
        }
    </style>
</head>

<body>
    <div class="main-top" style="position: absolute;">
        <p>Gerencie Seu Estabelecimento!</p>
    </div>

    <div class="container">
        <nav>
            <div class="navbar">
                <div class="logo">
                    <img src="Imagens/GULOSEIMA LOGO NOVO.png" alt>
                    <h1>GULOSEIMA</h1>
                </div>
                <ul>
                    <li class="user-name">
                        <i class="fas fa-user-circle"></i>
                        Bem-vindo, <?php echo $_SESSION['nome']; ?>!
                    </li>
                    <li><a href="compraPresencial.php">
                            <i class="fas fa-solid fa-cash-register"></i>
                            <span class="nav-item">Compra presencial</span>
                        </a>
                    </li>
                    <li><a href="cardapioAlimentos.php">
                            <i class="fas fa-solid fa-chart-bar fa-rotate-90" style="color: #ed842b;"></i>
                            <span class="nav-item" style="color: #ed842b; font-weight: 600;">Estoque</span>
                        </a>
                    </li>
                    <li><a href="cadastroAlimentos.php">
                            <i class="fas fa-solid fa-hamburger"></i>
                            <span class="nav-item">Cadastro alimentos</span>
                        </a>
                    </li>
                    <li><a href="cadastrotipos.php">
                            <i class="fas fa-solid fa-list"></i>
                            <span class="nav-item">Cadastro tipos </span>
                        </a>
                    </li>
                    <li><a href="cadastrohorarios.php">
                            <i class="fas fa-solid fa-clock"></i>
                            <span class="nav-item">Cadastro horarios</span>
                        </a>
                    </li>
                    <li><a href="Pedidos.php">
                            <i class="fas fa-solid fa-bell"></i>
                            <span class="nav-item">Pedidos</span>
                        </a>
                    </li>
                    <li><a href="telaGraficos.php">
                            <i class="fas fa-solid fa-chart-pie"></i>
                            <span class="nav-item">Estatísticas</span>
                        </a>
                    </li>

                    <?php if (isset($_SESSION['id']) && $_SESSION['id'] == 1) { ?>
                        <li><a href="adicionarAdmin.php">
                                <i class="fas fa-solid fa-user-plus"></i>
                                <span class="nav-item">Adicionar Admin</span>
                            </a>
                        </li>
                    <?php } ?>

                    <li><a href="AdicionarCredito.php">
                            <i class="fas fa-coins"></i>
                            <span class="nav-item">Crédito</span>
                        </a>
                    </li>

                    <li><a href="tela-login/index.html">
                            <i class="fas fa-solid fa-power-off"></i>
                            <span class="nav-item">Sair</span>
                        </a>
                    </li>
                </ul>
            </div>
        </nav>

        <div class="search_bar">
            <input type="search" style="border-radius: 5px; padding-left: 15px" placeholder="Pesquise seu produto...">

        </div>
        <div class="grid-container">
            <?php
            if ($result->num_rows > 0) {
                while ($row = $result->fetch_assoc()) {
                    echo "<div class='card2'>";

                    $imagemSrc = !empty($row["imagem"]) ? '' . $row["imagem"] : 'Imagens/default.png';


                    echo "<img src='" . $imagemSrc . "' class='product-image' alt='Imagem do Produto'>";
                    echo "<h2>" . $row["nomeProd"] . "</h2>";
                    echo "<p>Quantidade em estoque: " . $row["quantidade"] . "</p>";
                    echo "<p>Valor: R$ " . number_format($row["valor"], 2, ',', '.') . "</p>";
                    echo "<p>Tipo: " . $row["tipoProduto"] . "</p>";

                    $disponibilidadeText = $row["disponibilidade"] ? 'Disponível' : 'Indisponível';
                    echo "<p>Disponibilidade: <span id='disponibilidade_" . $row["id"] . "'>$disponibilidadeText</span></p>";
                    echo "<button class='btn' style='margin-bottom: 20px;' onclick='alterarDisponibilidade(" . $row["id"] . ")'>Alterar Disponibilidade</button>";

                    echo "<form action='update_product.php' method='POST' enctype='multipart/form-data'>";
                    echo "<div class='form-group'>";
                    echo "<label for='nomeProd'>Nome do Produto:</label>";
                    echo "<input type='text' name='nomeProd' value='" . $row["nomeProd"] . "' required>";
                    echo "</div>";

                    echo "<div class='form-group'>";
                    echo "<label for='quantidade'>Nova Quantidade:</label>";
                    echo "<input type='number' min='1' step='1' name='quantidade' value='" . $row["quantidade"] . "' required>";
                    echo "</div>";

                    echo "<div class='form-group'>";
                    echo "<label for='valor'>Valor:</label>";
                    echo "<input type='number' min='0.01' step='0.01' name='valor' value='" . $row["valor"] . "' required>";
                    echo "</div>";

                    echo "<div class='form-group'>";
                    echo "<label for='alerta'>Alerta:</label>";
                    echo "<input type='number' min='0.01' step='0.01' name='alerta' value='" . $row["alerta"] . "' required>";
                    echo "</div>";

                    echo "<div class='form-group'>";
                    echo "<label for='tipo'>Novo Tipo:</label>";
                    echo "<select name='tipo' required>";
                    foreach ($tipos as $tipo) {
                        $selected = $tipo['tipoProduto'] == $row['tipoProduto'] ? 'selected' : '';
                        echo "<option value='" . $tipo['id'] . "' $selected>" . $tipo['tipoProduto'] . "</option>";
                    }
                    echo "</select>";
                    echo "</div>";

                    echo "<div class='form-group'>";
                    echo "<label for='imagem'>Nova Imagem:</label>";
                    echo "<div class='custom-file-upload'>";
                    echo "<input type='file' name='imagem' accept='image/*' id='fileInput_" . $row["id"] . "' style='display: none;' onchange='updateFileName(" . $row["id"] . ")'>";
                    echo "<label for='fileInput_" . $row["id"] . "' class='file-label'>Escolher arquivo...</label>";
                    echo "</div>";
                    echo "</div>";




                    echo "<input type='hidden' name='id' value='" . $row["id"] . "'>";

                    echo "<div class='button-group'>";
                    echo "<button class='btn' type='submit'>Atualizar</button>";
                    echo "</form>";

                    echo "<form action='delete_product.php' method='POST'>";
                    echo "<input type='hidden' name='id' value='" . $row["id"] . "'>";
                    echo "<button type='submit' class='excluir'>Excluir</button>";
                    echo "</form>";
                    echo "</div>";

                    echo "</div>";
                }
            } else {
                echo "Nenhum produto encontrado.";
            }
            $conn->close();
            ?>
        </div>
    </div>

    <script>
        function alterarDisponibilidade(id) {
            const xhr = new XMLHttpRequest();
            xhr.open("POST", "alterar_disponibilidade.php", true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    const disponibilidadeElement = document.getElementById("disponibilidade_" + id);
                    disponibilidadeElement.textContent = xhr.responseText === '1' ? 'Disponível' : 'Indisponível';
                }
            };
            xhr.send("id=" + id);
        }
        // Evento de procura na barra de pesquisa
        document.querySelector('input[type="search"]').addEventListener('input', function () {
            var searchText = this.value.toLowerCase();

            document.querySelectorAll('.card2').forEach(function (card) {
                var productName = card.querySelector('h2').textContent.toLowerCase();

                if (productName.includes(searchText)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });



        document.querySelector('.containerf').addEventListener('click', function (event) {
            if (event.target.classList.contains('buttonCar')) {
                const productName = event.target.parentElement.parentElement.querySelector('.text h2').innerText;
                const productPriceText = event.target.parentElement.parentElement.querySelector('.text h4').innerText;
                const productPrice = parseFloat(productPriceText.replace('Valor: R$', '').replace(',', '.'));
                addToCart(productName, productPrice);
            } else if (event.target.classList.contains('buttonComp')) {
                const productName = event.target.parentElement.parentElement.querySelector('.text h2').innerText;
                const productPriceText = event.target.parentElement.parentElement.querySelector('.text h4').innerText;
                const productPrice = parseFloat(productPriceText.replace('Valor: R$', '').replace(',', '.'));

                naotemconta2(productName, productPrice);

            }
        });

        function updateFileName(id) {
            const fileInput = document.getElementById('fileInput_' + id);
            const label = fileInput.nextElementSibling; // Obtém o label associado

            if (fileInput.files.length > 0) {
                label.textContent = fileInput.files[0].name; // Atualiza o texto do label com o nome do arquivo
            } else {
                label.textContent = 'Escolher arquivo...'; // Reset para texto padrão
            }
        }


    </script>
</body>

</html>