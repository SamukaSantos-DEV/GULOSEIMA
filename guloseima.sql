-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 26/11/2024 às 14:45
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `guloseima`
--
CREATE DATABASE IF NOT EXISTS `guloseima` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `guloseima`;

-- --------------------------------------------------------

--
-- Estrutura para tabela `administrador`
--

CREATE TABLE `administrador` (
  `id` int(11) NOT NULL,
  `nome` varchar(250) DEFAULT NULL,
  `senha` varchar(250) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Despejando dados para a tabela `administrador`
--

INSERT INTO `administrador` (`id`, `nome`, `senha`) VALUES
(1, 'admin', 'GULOSEIMA'),
(2, 'Daniel Tarossi', '123'),
(25, 'ANA CLARA', '2222654646'),
(26, 'THEO ERIC', '1010656656'),
(27, 'GUILHERME', '1010422222');

-- --------------------------------------------------------

--
-- Estrutura para tabela `carrinho`
--

CREATE TABLE `carrinho` (
  `id` int(11) NOT NULL,
  `data` date DEFAULT NULL,
  `FK_produto_id` int(11) DEFAULT NULL,
  `FK_estudante_id` int(11) DEFAULT NULL,
  `precoUnidade` decimal(10,2) DEFAULT NULL,
  `quantidade` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `carrinho`
--

INSERT INTO `carrinho` (`id`, `data`, `FK_produto_id`, `FK_estudante_id`, `precoUnidade`, `quantidade`) VALUES
(104, '2024-11-26', 40, 31, 2.00, 1);

-- --------------------------------------------------------

--
-- Estrutura para tabela `codigo`
--

CREATE TABLE `codigo` (
  `id` int(11) NOT NULL,
  `email` varchar(250) NOT NULL,
  `codigo` varchar(6) NOT NULL,
  `horarioCriacao` timestamp NOT NULL DEFAULT current_timestamp(),
  `horarioExpiracao` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `codigo`
--

INSERT INTO `codigo` (`id`, `email`, `codigo`, `horarioCriacao`, `horarioExpiracao`) VALUES
(1, 'Teste@etec.sp.gov.br', '478492', '2024-09-26 10:30:40', '2024-09-26 15:45:40'),
(2, 'teste@etec.sp.gov.br', '512033', '2024-09-26 10:34:18', '2024-09-26 15:49:18'),
(3, 'teste@etec.sp.gov.br', '619798', '2024-09-26 10:34:28', '2024-09-26 15:49:28'),
(4, 'teste@etec.sp.gov.br', '266385', '2024-09-26 10:35:18', '2024-09-26 15:50:18'),
(5, 'teste@etec.sp.gov.br', '917732', '2024-09-26 10:35:30', '2024-09-26 15:50:30'),
(6, 'teste@etec.sp.gov.br', '096040', '2024-09-26 10:35:34', '2024-09-26 15:50:34'),
(7, 'teste@etec.sp.gov.br', '938922', '2024-09-26 10:35:41', '2024-09-26 15:50:41'),
(8, 'teste@etec.sp.gov.br', '394494', '2024-09-26 10:35:42', '2024-09-26 15:50:42'),
(9, 'teste@etec.sp.gov.br', '532049', '2024-09-26 10:35:51', '2024-09-26 15:50:51'),
(10, 'teste@etec.sp.gov.br', '128742', '2024-09-26 10:35:52', '2024-09-26 15:50:52'),
(11, 'teste@etec.sp.gov.br', '843918', '2024-09-26 10:36:11', '2024-09-26 15:51:11'),
(12, 'Joao.gomes203@etec.sp.gov.br', '415335', '2024-09-26 11:20:49', '2024-09-26 16:35:49'),
(13, 'Joao.gomes203@etec.sp.gov.br', '457980', '2024-09-26 11:37:08', '2024-09-26 16:52:08'),
(14, 'Teste@etec.sp.gov.br', '860285', '2024-09-26 11:49:41', '2024-09-26 17:04:41'),
(15, 'Array', '655798', '2024-09-26 13:09:28', '2024-09-26 18:24:28'),
(16, 'Array', '735110', '2024-09-26 13:12:41', '2024-09-26 18:27:41'),
(17, 'Array', '318880', '2024-09-26 13:12:42', '2024-09-26 18:27:42'),
(18, 'Array', '076422', '2024-09-26 13:12:42', '2024-09-26 18:27:42'),
(19, 'Array', '058283', '2024-09-26 13:12:42', '2024-09-26 18:27:42'),
(20, 'Array', '006530', '2024-09-26 13:12:42', '2024-09-26 18:27:42'),
(21, 'Joao.gomes203@etec.sp.gov.br', '393229', '2024-09-26 13:12:42', '2024-09-26 18:27:42'),
(22, 'Array', '334141', '2024-09-26 13:12:57', '2024-09-26 18:27:57'),
(23, 'Joao.gomes203@etec.sp.gov.br', '788780', '2024-09-26 13:31:05', '2024-09-26 18:46:05'),
(24, 'Joao.gomes203@etec.sp.gov.br', '255910', '2024-09-26 13:36:01', '2024-09-26 18:51:01'),
(25, 'Joao.gomes203@etec.sp.gov.br', '313783', '2024-10-01 14:13:12', '2024-10-01 19:28:12'),
(26, 'Samuel.oliveira204@etec.sp.gov.br', '797969', '2024-10-22 13:21:53', '2024-10-22 18:36:53'),
(27, 'teste@etec.sp.gov.br', '902814', '2024-10-23 14:29:47', '2024-10-23 19:44:47'),
(28, 'Samuel.oliveira204@etec.sp.gov.br', '135292', '2024-10-23 14:30:27', '2024-10-23 19:45:27'),
(29, 'Samuel.oliveira204@etec.sp.gov.br', '949116', '2024-10-23 14:31:43', '2024-10-23 19:46:43'),
(30, 'teste@etec.sp.gov.br', '898787', '2024-11-21 02:58:30', '2024-11-21 07:13:30'),
(31, 'teste@etec.sp.gov.br', '607589', '2024-11-21 03:09:05', '2024-11-21 07:24:05'),
(32, 'teste@etec.sp.gov.br', '848485', '2024-11-21 03:09:38', '2024-11-21 07:24:38'),
(33, 'teste@etec.sp.gov.br', '447158', '2024-11-21 03:11:20', '2024-11-21 07:26:20'),
(34, 'teste@etec.sp.gov.br', '076098', '2024-11-21 03:11:27', '2024-11-21 07:26:27'),
(35, 'teste@etec.sp.gov.br', '105206', '2024-11-21 03:11:41', '2024-11-21 07:26:41'),
(36, 'teste@etec.sp.gov.br', '045814', '2024-11-21 03:34:50', '2024-11-21 07:49:50'),
(37, 'teste@etec.sp.gov.br', '081755', '2024-11-21 03:35:33', '2024-11-21 07:50:33'),
(38, 'teste@etec.sp.gov.br', '981166', '2024-11-21 03:35:45', '2024-11-21 07:50:45'),
(39, 'teste@etec.sp.gov.br', '525665', '2024-11-21 03:35:50', '2024-11-21 07:50:50'),
(40, 'teste@etec.sp.gov.br', '394729', '2024-11-21 03:35:54', '2024-11-21 07:50:54'),
(41, 'teste@etec.sp.gov.br', '105824', '2024-11-21 03:36:02', '2024-11-21 07:51:02'),
(42, 'teste@etec.sp.gov.br', '042812', '2024-11-21 03:36:33', '2024-11-21 07:51:33'),
(43, 'teste@etec.sp.gov.br', '652049', '2024-11-21 03:37:15', '2024-11-21 07:52:15'),
(44, 'teste@etec.sp.gov.br', '046722', '2024-11-21 03:37:19', '2024-11-21 07:52:19'),
(45, 'teste@etec.sp.gov.br', '655708', '2024-11-21 03:38:01', '2024-11-21 07:53:01'),
(46, 'teste@etec.sp.gov.br', '983478', '2024-11-21 03:38:06', '2024-11-21 07:53:06'),
(47, 'teste@etec.sp.gov.br', '862107', '2024-11-21 03:38:14', '2024-11-21 07:53:14'),
(48, 'teste@etec.sp.gov.br', '232931', '2024-11-21 03:38:20', '2024-11-21 07:53:20'),
(49, 'teste@etec.sp.gov.br', '969200', '2024-11-21 03:38:25', '2024-11-21 07:53:25'),
(50, 'teste@etec.sp.gov.br', '088652', '2024-11-21 03:39:01', '2024-11-21 07:54:01'),
(51, 'teste@etec.sp.gov.br', '785452', '2024-11-21 03:39:16', '2024-11-21 07:54:16'),
(52, 'teste@etec.sp.gov.br', '089071', '2024-11-21 03:39:24', '2024-11-21 07:54:24'),
(53, 'teste@etec.sp.gov.br', '071685', '2024-11-21 03:39:26', '2024-11-21 07:54:26'),
(54, 'teste@etec.sp.gov.br', '349368', '2024-11-21 03:39:32', '2024-11-21 07:54:32'),
(55, 'teste@etec.sp.gov.br', '477995', '2024-11-21 03:39:36', '2024-11-21 07:54:36'),
(56, 'teste@etec.sp.gov.br', '361776', '2024-11-21 03:39:38', '2024-11-21 07:54:38'),
(57, 'teste@etec.sp.gov.br', '398542', '2024-11-21 03:39:45', '2024-11-21 07:54:45'),
(58, 'teste@etec.sp.gov.br', '072160', '2024-11-21 03:39:49', '2024-11-21 07:54:49'),
(59, 'teste@etec.sp.gov.br', '153719', '2024-11-21 03:39:52', '2024-11-21 07:54:52'),
(60, 'teste@etec.sp.gov.br', '640828', '2024-11-21 03:39:53', '2024-11-21 07:54:53'),
(61, 'teste@etec.sp.gov.br', '736776', '2024-11-21 03:39:56', '2024-11-21 07:54:56'),
(62, 'teste@etec.sp.gov.br', '181570', '2024-11-21 03:40:04', '2024-11-21 07:55:04'),
(63, 'teste@etec.sp.gov.br', '864666', '2024-11-21 03:40:23', '2024-11-21 07:55:23'),
(64, 'teste@etec.sp.gov.br', '505825', '2024-11-21 03:40:49', '2024-11-21 07:55:49'),
(65, 'teste@etec.sp.gov.br', '280842', '2024-11-21 03:41:30', '2024-11-21 07:56:30'),
(66, 'teste@etec.sp.gov.br', '936923', '2024-11-21 03:41:37', '2024-11-21 07:56:37'),
(67, 'teste@etec.sp.gov.br', '085249', '2024-11-21 03:41:44', '2024-11-21 07:56:44'),
(68, 'teste@etec.sp.gov.br', '493749', '2024-11-21 03:42:42', '2024-11-21 07:57:42'),
(69, 'teste@etec.sp.gov.br', '052781', '2024-11-21 03:42:59', '2024-11-21 07:57:59'),
(70, 'teste@etec.sp.gov.br', '879403', '2024-11-21 03:43:00', '2024-11-21 07:58:00'),
(71, 'teste@etec.sp.gov.br', '031840', '2024-11-21 03:43:06', '2024-11-21 07:58:06'),
(72, 'teste@etec.sp.gov.br', '096373', '2024-11-21 03:43:35', '2024-11-21 07:58:35'),
(73, 'teste@etec.sp.gov.br', '107714', '2024-11-21 03:43:46', '2024-11-21 07:58:46'),
(74, 'teste@etec.sp.gov.br', '511140', '2024-11-21 03:43:59', '2024-11-21 07:58:59'),
(75, 'teste@etec.sp.gov.br', '590399', '2024-11-21 03:44:02', '2024-11-21 07:59:02'),
(76, 'teste@etec.sp.gov.br', '677382', '2024-11-21 03:44:05', '2024-11-21 07:59:05'),
(77, 'teste@etec.sp.gov.br', '235215', '2024-11-21 03:44:29', '2024-11-21 07:59:29'),
(78, 'teste@etec.sp.gov.br', '523869', '2024-11-21 03:44:37', '2024-11-21 07:59:37'),
(79, 'teste@etec.sp.gov.br', '660359', '2024-11-21 03:44:44', '2024-11-21 07:59:44'),
(80, 'teste@etec.sp.gov.br', '818436', '2024-11-21 03:47:15', '2024-11-21 08:02:15'),
(81, 'teste@etec.sp.gov.br', '627224', '2024-11-21 03:48:19', '2024-11-21 08:03:19'),
(82, 'teste@etec.sp.gov.br', '916512', '2024-11-21 03:54:23', '2024-11-21 08:09:23'),
(83, 'teste@etec.sp.gov.br', '116361', '2024-11-21 03:54:26', '2024-11-21 08:09:26'),
(84, 'teste@etec.sp.gov.br', '794719', '2024-11-21 03:54:35', '2024-11-21 08:09:35'),
(85, 'teste@etec.sp.gov.br', '738344', '2024-11-21 03:54:42', '2024-11-21 08:09:42'),
(86, 'teste@etec.sp.gov.br', '708506', '2024-11-21 03:57:18', '2024-11-21 08:12:18'),
(87, 'teste@etec.sp.gov.br', '980776', '2024-11-21 03:58:16', '2024-11-21 08:13:16'),
(88, 'teste@etec.sp.gov.br', '271076', '2024-11-21 03:58:26', '2024-11-21 08:13:26'),
(89, 'teste@etec.sp.gov.br', '085939', '2024-11-21 03:58:31', '2024-11-21 08:13:31'),
(90, 'teste@etec.sp.gov.br', '688617', '2024-11-21 03:58:42', '2024-11-21 08:13:42'),
(91, 'teste@etec.sp.gov.br', '745804', '2024-11-21 03:58:54', '2024-11-21 08:13:54'),
(92, 'teste@etec.sp.gov.br', '862699', '2024-11-21 03:59:55', '2024-11-21 08:14:55'),
(93, 'teste@etec.sp.gov.br', '809884', '2024-11-21 03:59:57', '2024-11-21 08:14:57'),
(94, 'teste@etec.sp.gov.br', '739590', '2024-11-21 04:00:05', '2024-11-21 08:15:05'),
(95, 'teste@etec.sp.gov.br', '976369', '2024-11-21 04:00:08', '2024-11-21 08:15:08'),
(96, 'teste@etec.sp.gov.br', '962733', '2024-11-21 04:00:14', '2024-11-21 08:15:14'),
(97, 'teste@etec.sp.gov.br', '945931', '2024-11-21 04:01:51', '2024-11-21 08:16:51'),
(98, 'teste@etec.sp.gov.br', '203833', '2024-11-21 04:02:27', '2024-11-21 08:17:27'),
(99, 'teste@etec.sp.gov.br', '507009', '2024-11-21 04:02:33', '2024-11-21 08:17:33'),
(100, 'teste@etec.sp.gov.br', '050026', '2024-11-21 04:02:43', '2024-11-21 08:17:43'),
(101, 'teste@etec.sp.gov.br', '711952', '2024-11-21 04:02:50', '2024-11-21 08:17:50'),
(102, 'teste@etec.sp.gov.br', '443431', '2024-11-21 04:04:53', '2024-11-21 08:19:53'),
(103, 'teste@etec.sp.gov.br', '556942', '2024-11-21 04:05:04', '2024-11-21 08:20:04'),
(104, 'teste@etec.sp.gov.br', '470880', '2024-11-21 04:05:06', '2024-11-21 08:20:06'),
(105, 'teste@etec.sp.gov.br', '523309', '2024-11-21 04:05:11', '2024-11-21 08:20:11'),
(106, 'teste@etec.sp.gov.br', '330718', '2024-11-21 04:05:12', '2024-11-21 08:20:12'),
(107, 'teste@etec.sp.gov.br', '431066', '2024-11-21 04:05:56', '2024-11-21 08:20:56'),
(108, 'teste@etec.sp.gov.br', '601242', '2024-11-21 04:06:11', '2024-11-21 08:21:11'),
(109, 'teste@etec.sp.gov.br', '525542', '2024-11-21 04:06:56', '2024-11-21 08:21:56'),
(110, 'teste@etec.sp.gov.br', '015683', '2024-11-21 04:07:00', '2024-11-21 08:22:00'),
(111, 'teste@etec.sp.gov.br', '278484', '2024-11-21 04:07:01', '2024-11-21 08:22:01'),
(112, 'teste@etec.sp.gov.br', '053585', '2024-11-21 04:07:07', '2024-11-21 08:22:07'),
(113, 'teste@etec.sp.gov.br', '004191', '2024-11-21 04:07:11', '2024-11-21 08:22:11'),
(114, 'teste@etec.sp.gov.br', '868133', '2024-11-21 04:09:41', '2024-11-21 08:24:41'),
(115, 'teste@etec.sp.gov.br', '615190', '2024-11-21 04:10:14', '2024-11-21 08:25:14'),
(116, 'teste@etec.sp.gov.br', '032372', '2024-11-21 04:15:36', '2024-11-21 08:30:36'),
(117, 'teste@etec.sp.gov.br', '541301', '2024-11-21 04:17:26', '2024-11-21 08:32:26'),
(118, 'teste@etec.sp.gov.br', '236885', '2024-11-21 04:23:23', '2024-11-21 08:38:23'),
(119, 'teste@etec.sp.gov.br', '712815', '2024-11-21 04:23:26', '2024-11-21 08:38:26'),
(120, 'teste@etec.sp.gov.br', '626786', '2024-11-21 04:23:27', '2024-11-21 08:38:27'),
(121, 'teste@etec.sp.gov.br', '760310', '2024-11-21 04:23:31', '2024-11-21 08:38:31'),
(122, 'teste@etec.sp.gov.br', '961478', '2024-11-21 04:23:33', '2024-11-21 08:38:33'),
(123, 'teste@etec.sp.gov.br', '958823', '2024-11-21 04:23:37', '2024-11-21 08:38:37'),
(124, 'teste@etec.sp.gov.br', '497141', '2024-11-21 04:23:41', '2024-11-21 08:38:41'),
(125, 'teste@etec.sp.gov.br', '889182', '2024-11-21 04:23:44', '2024-11-21 08:38:44'),
(126, 'teste@etec.sp.gov.br', '907327', '2024-11-21 04:23:48', '2024-11-21 08:38:48'),
(127, 'teste@etec.sp.gov.br', '858255', '2024-11-21 04:23:50', '2024-11-21 08:38:50'),
(128, 'teste@etec.sp.gov.br', '558569', '2024-11-21 04:23:53', '2024-11-21 08:38:53'),
(129, 'teste@etec.sp.gov.br', '329124', '2024-11-21 04:23:56', '2024-11-21 08:38:56'),
(130, 'Coisa@etec.sp.gov.br', '926515', '2024-11-21 05:25:20', '2024-11-21 09:40:20'),
(131, 'Fds@etec.sp.gov.br', '934888', '2024-11-21 05:29:00', '2024-11-21 09:44:00'),
(132, 'R@etec.sp.gov.br', '524699', '2024-11-21 05:29:49', '2024-11-21 09:44:49'),
(133, 'El@etec.sp.gov.br', '041452', '2024-11-21 05:30:16', '2024-11-21 09:45:16'),
(134, 'A@etec.sp.gov.br', '051516', '2024-11-21 05:30:43', '2024-11-21 09:45:43'),
(135, 'Al@etec.sp.gov.br', '814429', '2024-11-21 05:31:13', '2024-11-21 09:46:13'),
(136, 'Cu@etec.sp.gov.br', '856644', '2024-11-21 05:42:47', '2024-11-21 09:57:47'),
(137, 'roberta.cruz@etec.sp.gov.br', '081478', '2024-11-26 09:35:03', '2024-11-26 13:50:03'),
(138, 'guilherme.ritir@etec.sp.gov.br', '786350', '2024-11-26 12:00:05', '2024-11-26 16:15:05');

-- --------------------------------------------------------

--
-- Estrutura para tabela `estudante`
--

CREATE TABLE `estudante` (
  `id` int(11) NOT NULL,
  `nome` varchar(250) DEFAULT NULL,
  `email` varchar(250) DEFAULT NULL,
  `senha` varchar(250) DEFAULT NULL,
  `saldo` decimal(10,2) DEFAULT NULL,
  `verificacao` tinyint(1) NOT NULL,
  `token` int(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `estudante`
--

INSERT INTO `estudante` (`id`, `nome`, `email`, `senha`, `saldo`, `verificacao`, `token`) VALUES
(1, 'Compra Presencial', NULL, NULL, NULL, 0, NULL),
(19, 'Luis Gustavo', 'luisOliveira@etec.sp.gov.br', '1234', 981.00, 0, 152435),
(20, 'Luís Almeida', 'luis.almeida@etec.sp.gov.br', '1234', 978.50, 0, 142375),
(21, 'Larissa Carvalho', 'larissa.carvalho@etec.sp.gov.br', '1234', 1000.00, 0, 893412),
(22, 'Leonardo Mendes', 'leonardo.mendes@etec.sp.gov.br', '1234', 956.00, 0, 576908),
(23, 'Luana Ferreira', 'luana.ferreira@etec.sp.gov.br\r\n', '1234', 1234.00, 0, 304721),
(24, 'Amanda Oliveira', 'amanda.oliveira@etec.sp.gov.br', '1234', 989.00, 0, 482139),
(25, 'Arthur Silva', 'arthur.silva@etec.sp.gov.br', '1234', 1000.00, 0, 763204),
(26, 'Ana Paula Costa', 'ana.costa@etec.sp.gov.br', '1234', 948.00, 0, 915472),
(27, 'Alexandre Ramos', 'alexandre.ramos@etec.sp.gov.br', '1234', 957.00, 0, 607384),
(28, 'Aline Souza', 'aline.souza@etec.sp.gov.br', '1234', 1000.00, 0, 342861),
(29, 'Rafael Gomes', 'rafael.gomes@etec.sp.gov.br', '1234', 1000.00, 0, 781452),
(30, 'Renata Almeida', 'renata.almeida@etec.sp.gov.br', '1234', 1000.00, 0, 563028),
(31, 'GUILHERME', 'guilherme.ritir@etec.sp.gov.br', '1234', 962.50, 0, 194736),
(32, 'Samuel', 'samuel.oliveira204@etec.sp.gov.br', '1234', 963.00, 0, 835690),
(33, 'Rodrigo Carvalho', 'rodrigo.carvalho@etec.sp.gov.br', '1234', 970.00, 0, 249581);

-- --------------------------------------------------------

--
-- Estrutura para tabela `favorito`
--

CREATE TABLE `favorito` (
  `id` int(11) NOT NULL,
  `FK_estudante_id` int(11) DEFAULT NULL,
  `FK_produto_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `favorito`
--

INSERT INTO `favorito` (`id`, `FK_estudante_id`, `FK_produto_id`) VALUES
(13, 31, 35),
(14, 31, 45),
(16, 32, 42);

-- --------------------------------------------------------

--
-- Estrutura para tabela `horario`
--

CREATE TABLE `horario` (
  `id` int(11) NOT NULL,
  `horario` varchar(250) NOT NULL,
  `disponibilidade` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `horario`
--

INSERT INTO `horario` (`id`, `horario`, `disponibilidade`) VALUES
(1, 'MANHÃ 9:40 - 10:00', 0),
(2, 'MEIO-DIA 11:40 - 13:00', 1),
(4, 'TARDE 15:30 - 15:50', 1);

-- --------------------------------------------------------

--
-- Estrutura para tabela `item_pedido`
--

CREATE TABLE `item_pedido` (
  `id` int(11) NOT NULL,
  `valorItemPedido` decimal(10,2) DEFAULT NULL,
  `quantidadeItemPedido` int(11) DEFAULT NULL,
  `FK_pedido_id` int(11) DEFAULT NULL,
  `FK_produto_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `item_pedido`
--

INSERT INTO `item_pedido` (`id`, `valorItemPedido`, `quantidadeItemPedido`, `FK_pedido_id`, `FK_produto_id`) VALUES
(171, 5.00, 2, 193, 26),
(172, 5.50, 3, 193, 34),
(173, 5.50, 2, 194, 34),
(174, 5.00, 2, 194, 26),
(175, 5.50, 1, 194, 35),
(176, 2.50, 1, 195, 40),
(177, 3.50, 1, 195, 42),
(178, 4.50, 1, 195, 41),
(179, 3.50, 1, 195, 39),
(180, 5.50, 1, 196, 35),
(181, 5.50, 1, 196, 37),
(182, 5.50, 1, 196, 38),
(183, 2.50, 1, 196, 40),
(184, 5.50, 2, 197, 34),
(185, 5.00, 2, 197, 26),
(186, 5.50, 1, 197, 35),
(187, 5.50, 1, 198, 35),
(188, 5.50, 2, 198, 37),
(189, 5.50, 1, 198, 38),
(190, 5.50, 1, 198, 36),
(191, 5.50, 2, 199, 36),
(192, 5.50, 1, 199, 35),
(193, 2.50, 1, 199, 40),
(194, 5.50, 1, 199, 38),
(195, 4.50, 1, 200, 41),
(196, 3.50, 1, 200, 42),
(197, 3.00, 1, 200, 44),
(198, 4.00, 1, 200, 46),
(199, 5.50, 1, 201, 35),
(200, 5.50, 1, 201, 36),
(201, 5.50, 1, 201, 34),
(202, 5.00, 1, 201, 26),
(203, 5.50, 3, 202, 38),
(204, 4.00, 2, 203, 45),
(205, 4.50, 3, 203, 47),
(206, 4.50, 1, 203, 48),
(207, 4.00, 1, 203, 46),
(208, 5.50, 3, 204, 34),
(209, 5.50, 2, 204, 36),
(210, 5.50, 2, 204, 38),
(211, 3.50, 1, 204, 39),
(212, 5.50, 2, 205, 36),
(213, 5.50, 1, 206, 34),
(214, 5.50, 1, 206, 36),
(215, 5.50, 2, 207, 35),
(216, 3.50, 4, 208, 39),
(217, 5.50, 8, 209, 34),
(218, 5.00, 3, 210, 26),
(219, 5.50, 2, 210, 35),
(220, 5.50, 2, 210, 37),
(221, 5.50, 1, 211, 35),
(222, 5.50, 2, 211, 36),
(223, 4.50, 3, 212, 48),
(224, 4.50, 3, 212, 47),
(225, 4.50, 7, 212, 49),
(226, 3.50, 4, 213, 39),
(227, 4.50, 2, 213, 41),
(228, 3.50, 1, 213, 42),
(229, 3.00, 1, 213, 44),
(230, 4.00, 2, 213, 46),
(231, 3.00, 2, 214, 44),
(232, 4.00, 2, 214, 46),
(233, 5.50, 2, 215, 34),
(234, 5.00, 2, 216, 26),
(235, 5.50, 1, 216, 36),
(236, 3.50, 1, 217, 39),
(237, 5.50, 1, 218, 38),
(238, 5.50, 1, 219, 35),
(239, 3.50, 1, 220, 42),
(240, 4.00, 6, 221, 45),
(241, 2.50, 1, 222, 40),
(242, 3.00, 3, 223, 43),
(243, 5.50, 1, 224, 35),
(244, 4.50, 1, 225, 41),
(245, 5.50, 5, 226, 36),
(246, 5.50, 1, 226, 34),
(247, 3.50, 7, 226, 39),
(248, 3.50, 2, 227, 42),
(249, 3.00, 3, 227, 44),
(250, 4.50, 3, 228, 47),
(251, 4.50, 2, 228, 48),
(252, 4.50, 2, 228, 49),
(253, 5.50, 2, 229, 38),
(254, 4.50, 4, 230, 49),
(255, 4.50, 4, 231, 49),
(256, 4.50, 4, 232, 41),
(257, 3.50, 7, 232, 39),
(258, 5.50, 3, 233, 36),
(259, 3.50, 4, 234, 42),
(260, 4.00, 6, 235, 45),
(261, 3.50, 4, 236, 42),
(262, 5.50, 3, 237, 36),
(263, 5.50, 3, 238, 35),
(264, 3.50, 2, 239, 42),
(265, 3.00, 3, 240, 44),
(266, 5.00, 1, 241, 26),
(267, 5.00, 2, 242, 26),
(268, 4.00, 1, 243, 45),
(269, 3.00, 1, 244, 44),
(270, 3.00, 2, 244, 43),
(271, 5.00, 1, 245, 26),
(272, 3.00, 1, 246, 42),
(273, 4.00, 2, 246, 46),
(274, 5.00, 2, 247, 26);

-- --------------------------------------------------------

--
-- Estrutura para tabela `pedido`
--

CREATE TABLE `pedido` (
  `id` int(11) NOT NULL,
  `codigoConfirmacao` varchar(4) DEFAULT NULL,
  `totalPedido` decimal(10,2) DEFAULT NULL,
  `dataPedido` date DEFAULT NULL,
  `horaPedido` time DEFAULT NULL,
  `FK_horario_id` int(11) DEFAULT NULL,
  `FK_estudante_id` int(11) DEFAULT NULL,
  `statusPedido` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `pedido`
--

INSERT INTO `pedido` (`id`, `codigoConfirmacao`, `totalPedido`, `dataPedido`, `horaPedido`, `FK_horario_id`, `FK_estudante_id`, `statusPedido`) VALUES
(193, '7244', 26.50, '2024-10-20', '20:21:14', 1, 1, 'Retirado'),
(194, '4512', 26.50, '2024-09-21', '20:42:02', 1, 1, 'Retirado'),
(195, '3423', 14.00, '2024-09-20', '20:42:11', 1, 1, 'Retirado'),
(196, '9213', 19.00, '2024-09-20', '20:43:01', 1, 19, 'Retirado'),
(197, '0246', 26.50, '2024-10-21', '20:44:29', 1, 27, 'Retirado'),
(198, '2941', 27.50, '2024-01-20', '20:45:10', 1, 31, 'Retirado'),
(199, '2328', 24.50, '2024-01-21', '20:45:55', 1, 1, 'Retirado'),
(200, '6569', 15.00, '2024-01-05', '20:50:14', 1, 26, 'Retirado'),
(201, '7386', 21.50, '2024-09-20', '20:50:44', 1, 20, 'Retirado'),
(202, '9387', 16.50, '2024-09-21', '20:51:15', 4, 27, 'Retirado'),
(203, '7444', 30.00, '2024-09-21', '20:51:58', 2, 33, 'Retirado'),
(204, '8951', 42.00, '2024-09-21', '20:56:33', 4, 1, 'Retirado'),
(205, '1316', 11.00, '2024-11-19', '20:58:02', 4, 24, 'Retirado'),
(206, '4491', 11.00, '2024-11-15', '20:58:37', 4, 32, 'Retirado'),
(207, '2791', 11.00, '2024-11-16', '20:59:55', 4, 1, 'Retirado'),
(208, '1190', 14.00, '2024-11-16', '21:00:05', 1, 1, 'Retirado'),
(209, '8508', 44.00, '2024-11-21', '21:02:05', 1, 22, 'Retirado'),
(210, '7310', 37.00, '2024-02-19', '21:02:31', 2, 26, 'Retirado'),
(211, '2044', 16.50, '2024-02-05', '21:05:28', 4, 1, 'Retirado'),
(212, '7987', 58.50, '2024-02-10', '21:05:40', 2, 1, 'Retirado'),
(213, '3404', 37.50, '2024-03-05', '21:05:56', 2, 1, 'Retirado'),
(214, '9511', 14.00, '2024-03-21', '21:07:31', 4, 1, 'Retirado'),
(215, '4828', 11.00, '2024-03-10', '21:07:39', 1, 1, 'Retirado'),
(216, '8453', 15.50, '2024-04-01', '21:39:14', 1, 1, 'Retirado'),
(217, '5132', 3.50, '2024-04-01', '21:39:27', 1, 1, 'Retirado'),
(218, '7297', 5.50, '2024-04-21', '21:39:34', 1, 1, 'Retirado'),
(219, '8215', 5.50, '2024-04-21', '21:39:41', 1, 1, 'Retirado'),
(220, '7006', 3.50, '2024-04-20', '21:39:49', 1, 1, 'Retirado'),
(221, '3338', 24.00, '2024-11-21', '21:41:50', 1, 1, 'Retirado'),
(222, '9697', 2.50, '2024-05-21', '21:41:57', 1, 1, 'Retirado'),
(223, '4253', 9.00, '2024-05-21', '21:42:06', 1, 1, 'Retirado'),
(224, '1052', 5.50, '2024-05-08', '21:42:17', 1, 1, 'Retirado'),
(225, '9335', 4.50, '2024-05-06', '21:42:25', 1, 1, 'Retirado'),
(226, '7031', 57.50, '2024-06-21', '21:44:06', 1, 1, 'Retirado'),
(227, '4615', 16.00, '2024-06-20', '21:44:18', 1, 1, 'Retirado'),
(228, '8839', 31.50, '2024-06-19', '21:44:30', 1, 1, 'Retirado'),
(229, '4450', 11.00, '2024-06-21', '21:44:37', 1, 1, 'Retirado'),
(230, '5346', 18.00, '2024-06-21', '21:44:49', 1, 1, 'Retirado'),
(231, '7872', 18.00, '2024-11-21', '21:48:22', 4, 1, 'Retirado'),
(232, '8562', 42.50, '2024-07-21', '21:50:01', 4, 1, 'Retirado'),
(233, '8111', 16.50, '2024-07-21', '21:50:11', 1, 1, 'Retirado'),
(234, '8986', 14.00, '2024-07-20', '21:50:18', 1, 1, 'Retirado'),
(235, '1319', 24.00, '2024-07-19', '21:50:27', 1, 1, 'Retirado'),
(236, '2910', 14.00, '2024-08-21', '21:52:49', 1, 1, 'Aguardando Retirada'),
(237, '4898', 16.50, '2024-08-21', '21:52:56', 1, 1, 'Aguardando Retirada'),
(238, '2938', 16.50, '2024-08-08', '21:53:45', 1, 1, 'Aguardando Retirada'),
(239, '2432', 7.00, '2024-08-19', '21:53:52', 1, 1, 'Aguardando Retirada'),
(240, '4032', 9.00, '2024-08-02', '21:53:59', 1, 1, 'Aguardando Retirada'),
(241, '6611', 5.00, '2024-11-22', '13:22:01', 1, 1, 'Aguardando Retirada'),
(242, '6088', 10.00, '2024-11-25', '18:31:47', 2, 31, 'Aguardando Retirada'),
(243, '9316', 4.00, '2024-11-26', '09:01:48', 2, 32, 'Pedido Cancelado'),
(244, '7605', 9.00, '2024-11-26', '09:07:36', 4, 32, 'Pedido Cancelado'),
(245, '1688', 5.00, '2024-11-26', '09:08:27', 2, 32, 'Retirado'),
(246, '5490', 11.00, '2024-11-26', '09:36:22', 2, 32, 'Aguardando Retirada'),
(247, '7341', 10.00, '2024-11-26', '10:41:43', 2, 32, 'Aguardando Retirada');

-- --------------------------------------------------------

--
-- Estrutura para tabela `produto`
--

CREATE TABLE `produto` (
  `id` int(11) NOT NULL,
  `nomeProd` varchar(250) DEFAULT NULL,
  `quantidade` int(11) DEFAULT NULL,
  `valor` decimal(10,2) DEFAULT NULL,
  `disponibilidade` tinyint(1) NOT NULL,
  `imagem` varchar(500) DEFAULT NULL,
  `alerta` int(11) NOT NULL,
  `fk_tipoProduto_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `produto`
--

INSERT INTO `produto` (`id`, `nomeProd`, `quantidade`, `valor`, `disponibilidade`, `imagem`, `alerta`, `fk_tipoProduto_id`) VALUES
(26, 'Coxinha', 484, 5.00, 1, 'ImagensProdutos/coxinha.jpg', 5, 103),
(34, 'Salgado Calabresa', 477, 5.50, 1, 'ImagensProdutos/CalabresaSalgado.jpg', 10, 103),
(35, 'Croquete Salsicha', 484, 5.50, 1, 'ImagensProdutos/Croquete.jpg', 10, 103),
(36, 'Espetinho de Frango', 477, 5.50, 1, 'ImagensProdutos/espetinhofrango.jpg', 10, 103),
(37, 'Hambúrguer', 495, 5.00, 1, 'ImagensProdutos/Hamborg.jpg', 10, 103),
(38, 'Kibe', 489, 5.50, 1, 'ImagensProdutos/kibe.jpg', 10, 103),
(39, 'Trident', 575, 3.00, 1, 'ImagensProdutos/ChicleteTrident.jpg', 10, 105),
(40, 'Pé de Moleque', 696, 2.00, 1, 'ImagensProdutos/pedemoleque.jpg', 10, 107),
(41, 'Chocolate Talento', 491, 4.00, 1, 'ImagensProdutos/talento.jpg', 10, 107),
(42, 'Bom-Bom', 483, 3.00, 1, 'ImagensProdutos/ourobranco.jpg', 10, 107),
(43, 'Chocolate Trento', 497, 3.00, 1, 'ImagensProdutos/trento.png', 10, 107),
(44, 'Paçoca', 490, 3.00, 1, 'ImagensProdutos/images.jfif', 10, 107),
(45, 'Pepsi Lata', 486, 4.00, 1, 'ImagensProdutos/pepsi.png', 10, 3),
(46, 'Coca-Cola Lata', 492, 4.00, 1, 'ImagensProdutos/cocalata.png', 10, 3),
(47, 'Suco Lata Manga', 491, 4.00, 1, 'ImagensProdutos/sucomanga.jpeg', 10, 106),
(48, 'Suco Lata Uva', 494, 4.00, 1, 'ImagensProdutos/sucouva.webp', 10, 106),
(49, 'Suco Lata Pêssego', 483, 4.00, 1, 'ImagensProdutos/sucopessego.webp', 10, 106),
(50, 'Coca-Cola  Mini', 500, 2.50, 0, 'ImagensProdutos/cocamini.jpg', 10, 3);

-- --------------------------------------------------------

--
-- Estrutura para tabela `tipoproduto`
--

CREATE TABLE `tipoproduto` (
  `id` int(11) NOT NULL,
  `tipoProduto` varchar(250) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `tipoproduto`
--

INSERT INTO `tipoproduto` (`id`, `tipoProduto`) VALUES
(1, 'Nao Categorizado'),
(3, 'Bebida'),
(102, 'Sorvete'),
(103, 'Salgado'),
(104, 'Bala'),
(105, 'Chiclete'),
(106, 'Suco'),
(107, 'Doce');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `administrador`
--
ALTER TABLE `administrador`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `carrinho`
--
ALTER TABLE `carrinho`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_carrinho_1` (`FK_produto_id`),
  ADD KEY `FK_carrinho_2` (`FK_estudante_id`);

--
-- Índices de tabela `codigo`
--
ALTER TABLE `codigo`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `estudante`
--
ALTER TABLE `estudante`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `favorito`
--
ALTER TABLE `favorito`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_favorito_1` (`FK_estudante_id`),
  ADD KEY `FK_favorito_2` (`FK_produto_id`);

--
-- Índices de tabela `horario`
--
ALTER TABLE `horario`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `item_pedido`
--
ALTER TABLE `item_pedido`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_item_pedido_1` (`FK_pedido_id`),
  ADD KEY `FK_item_pedido_2` (`FK_produto_id`);

--
-- Índices de tabela `pedido`
--
ALTER TABLE `pedido`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_pedido_1` (`FK_horario_id`),
  ADD KEY `FK_estudante_id` (`FK_estudante_id`);

--
-- Índices de tabela `produto`
--
ALTER TABLE `produto`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_produto_1` (`fk_tipoProduto_id`);

--
-- Índices de tabela `tipoproduto`
--
ALTER TABLE `tipoproduto`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `administrador`
--
ALTER TABLE `administrador`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT de tabela `carrinho`
--
ALTER TABLE `carrinho`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=133;

--
-- AUTO_INCREMENT de tabela `codigo`
--
ALTER TABLE `codigo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=139;

--
-- AUTO_INCREMENT de tabela `estudante`
--
ALTER TABLE `estudante`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT de tabela `favorito`
--
ALTER TABLE `favorito`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de tabela `horario`
--
ALTER TABLE `horario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de tabela `item_pedido`
--
ALTER TABLE `item_pedido`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=275;

--
-- AUTO_INCREMENT de tabela `pedido`
--
ALTER TABLE `pedido`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=248;

--
-- AUTO_INCREMENT de tabela `produto`
--
ALTER TABLE `produto`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT de tabela `tipoproduto`
--
ALTER TABLE `tipoproduto`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=108;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `carrinho`
--
ALTER TABLE `carrinho`
  ADD CONSTRAINT `FK_carrinho_1` FOREIGN KEY (`FK_produto_id`) REFERENCES `produto` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_carrinho_2` FOREIGN KEY (`FK_estudante_id`) REFERENCES `estudante` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `favorito`
--
ALTER TABLE `favorito`
  ADD CONSTRAINT `FK_favorito_1` FOREIGN KEY (`FK_estudante_id`) REFERENCES `estudante` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_favorito_2` FOREIGN KEY (`FK_produto_id`) REFERENCES `produto` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `item_pedido`
--
ALTER TABLE `item_pedido`
  ADD CONSTRAINT `FK_item_pedido_1` FOREIGN KEY (`FK_pedido_id`) REFERENCES `pedido` (`id`),
  ADD CONSTRAINT `FK_item_pedido_2` FOREIGN KEY (`FK_produto_id`) REFERENCES `produto` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Restrições para tabelas `pedido`
--
ALTER TABLE `pedido`
  ADD CONSTRAINT `FK_pedido_1` FOREIGN KEY (`FK_horario_id`) REFERENCES `horario` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_pedido_2` FOREIGN KEY (`FK_estudante_id`) REFERENCES `estudante` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Restrições para tabelas `produto`
--
ALTER TABLE `produto`
  ADD CONSTRAINT `FK_produto_1` FOREIGN KEY (`fk_tipoProduto_id`) REFERENCES `tipoproduto` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
