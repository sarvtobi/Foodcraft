-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jun 03, 2026 at 11:04 AM
-- Server version: 8.4.3
-- PHP Version: 8.5.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `be_foodcraft`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_log`
--

CREATE TABLE `activity_log` (
  `id` bigint UNSIGNED NOT NULL,
  `log_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subject_id` bigint UNSIGNED DEFAULT NULL,
  `event` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `causer_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `causer_id` bigint UNSIGNED DEFAULT NULL,
  `attribute_changes` json DEFAULT NULL,
  `properties` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `activity_log`
--

INSERT INTO `activity_log` (`id`, `log_name`, `description`, `subject_type`, `subject_id`, `event`, `causer_type`, `causer_id`, `attribute_changes`, `properties`, `created_at`, `updated_at`) VALUES
(1, 'auth', 'tch (owner) berhasil login', 'App\\Models\\User', 1, 'login', 'App\\Models\\User', 1, '[]', '{\"ip\": \"127.0.0.1\", \"user_agent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0\"}', '2026-05-25 22:18:48', '2026-05-25 22:18:48'),
(2, 'auth', 'tch (owner) berhasil login', 'App\\Models\\User', 1, 'login', 'App\\Models\\User', 1, '[]', '{\"ip\": \"127.0.0.1\", \"user_agent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0\"}', '2026-05-26 04:38:38', '2026-05-26 04:38:38'),
(3, 'auth', 'tch (owner) berhasil login', 'App\\Models\\User', 1, 'login', 'App\\Models\\User', 1, '[]', '{\"ip\": \"127.0.0.1\", \"user_agent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0\"}', '2026-05-26 04:44:16', '2026-05-26 04:44:16'),
(4, 'umkm', 'UMKM manut telah di-created', 'App\\Models\\Umkm', 1, 'created', 'App\\Models\\User', 1, '{\"attributes\": {\"name\": \"manut\", \"phone\": null, \"address\": \"ngawi\", \"description\": \"nyenii\"}}', '[]', '2026-05-26 04:44:33', '2026-05-26 04:44:33'),
(5, 'auth', 'tch (owner) berhasil login', 'App\\Models\\User', 1, 'login', 'App\\Models\\User', 1, '[]', '{\"ip\": \"127.0.0.1\", \"user_agent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0\"}', '2026-05-30 03:27:30', '2026-05-30 03:27:30'),
(6, 'auth', 'Owner baru tch telah mendaftar', 'App\\Models\\User', 2, 'registered', 'App\\Models\\User', 2, '[]', '{\"ip\": \"127.0.0.1\"}', '2026-05-30 03:28:48', '2026-05-30 03:28:48'),
(7, 'auth', 'tch (owner) berhasil login', 'App\\Models\\User', 2, 'login', 'App\\Models\\User', 2, '[]', '{\"ip\": \"127.0.0.1\", \"user_agent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0\"}', '2026-05-30 03:28:54', '2026-05-30 03:28:54'),
(8, 'auth', 'tch (owner) berhasil login', 'App\\Models\\User', 2, 'login', 'App\\Models\\User', 2, '[]', '{\"ip\": \"127.0.0.1\", \"user_agent\": \"Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1 Edg/148.0.0.0\"}', '2026-05-30 03:32:39', '2026-05-30 03:32:39'),
(9, 'auth', 'tch (owner) berhasil login', 'App\\Models\\User', 2, 'login', 'App\\Models\\User', 2, '[]', '{\"ip\": \"127.0.0.1\", \"user_agent\": \"Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1 Edg/148.0.0.0\"}', '2026-05-30 03:32:48', '2026-05-30 03:32:48'),
(10, 'auth', 'tch (owner) berhasil login', 'App\\Models\\User', 2, 'login', 'App\\Models\\User', 2, '[]', '{\"ip\": \"127.0.0.1\", \"user_agent\": \"Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1 Edg/148.0.0.0\"}', '2026-05-30 03:32:54', '2026-05-30 03:32:54'),
(11, 'auth', 'tch (owner) berhasil login', 'App\\Models\\User', 2, 'login', 'App\\Models\\User', 2, '[]', '{\"ip\": \"127.0.0.1\", \"user_agent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0\"}', '2026-05-30 03:33:06', '2026-05-30 03:33:06'),
(12, 'auth', 'tch (owner) berhasil login', 'App\\Models\\User', 2, 'login', 'App\\Models\\User', 2, '[]', '{\"ip\": \"127.0.0.1\", \"user_agent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0\"}', '2026-05-30 03:37:16', '2026-05-30 03:37:16'),
(13, 'auth', 'tch (owner) berhasil login', 'App\\Models\\User', 1, 'login', 'App\\Models\\User', 1, '[]', '{\"ip\": \"127.0.0.1\", \"user_agent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0\"}', '2026-05-30 03:55:13', '2026-05-30 03:55:13'),
(14, 'auth', 'tch (owner) berhasil login', 'App\\Models\\User', 1, 'login', 'App\\Models\\User', 1, '[]', '{\"ip\": \"127.0.0.1\", \"user_agent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0\"}', '2026-05-30 03:59:07', '2026-05-30 03:59:07'),
(15, 'auth', 'tch (owner) berhasil login', 'App\\Models\\User', 1, 'login', 'App\\Models\\User', 1, '[]', '{\"ip\": \"127.0.0.1\", \"user_agent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0\"}', '2026-05-30 04:08:54', '2026-05-30 04:08:54'),
(16, 'auth', 'tch (owner) berhasil login', 'App\\Models\\User', 1, 'login', 'App\\Models\\User', 1, '[]', '{\"ip\": \"127.0.0.1\", \"user_agent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0\"}', '2026-05-30 04:09:21', '2026-05-30 04:09:21'),
(17, 'auth', 'tch (owner) berhasil login', 'App\\Models\\User', 1, 'login', 'App\\Models\\User', 1, '[]', '{\"ip\": \"127.0.0.1\", \"user_agent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0\"}', '2026-05-30 04:09:36', '2026-05-30 04:09:36'),
(18, 'auth', 'Owner baru tch telah mendaftar', 'App\\Models\\User', 3, 'registered', 'App\\Models\\User', 3, '[]', '{\"ip\": \"127.0.0.1\"}', '2026-05-30 04:12:11', '2026-05-30 04:12:11'),
(19, 'auth', 'tch (owner) berhasil login', 'App\\Models\\User', 3, 'login', 'App\\Models\\User', 3, '[]', '{\"ip\": \"127.0.0.1\", \"user_agent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0\"}', '2026-05-30 04:12:16', '2026-05-30 04:12:16'),
(20, 'auth', 'tch (owner) berhasil login', 'App\\Models\\User', 3, 'login', 'App\\Models\\User', 3, '[]', '{\"ip\": \"127.0.0.1\", \"user_agent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0\"}', '2026-05-30 04:13:55', '2026-05-30 04:13:55'),
(21, 'auth', 'tch (owner) berhasil login', 'App\\Models\\User', 1, 'login', 'App\\Models\\User', 1, '[]', '{\"ip\": \"127.0.0.1\", \"user_agent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0\"}', '2026-05-30 04:39:33', '2026-05-30 04:39:33'),
(22, 'auth', 'tch (owner) berhasil login', 'App\\Models\\User', 1, 'login', 'App\\Models\\User', 1, '[]', '{\"ip\": \"127.0.0.1\", \"user_agent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0\"}', '2026-05-30 04:41:43', '2026-05-30 04:41:43'),
(23, 'auth', 'tch (owner) berhasil login', 'App\\Models\\User', 1, 'login', 'App\\Models\\User', 1, '[]', '{\"ip\": \"127.0.0.1\", \"user_agent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0\"}', '2026-05-30 04:43:04', '2026-05-30 04:43:04'),
(24, 'auth', 'tch (owner) berhasil login', 'App\\Models\\User', 1, 'login', 'App\\Models\\User', 1, '[]', '{\"ip\": \"127.0.0.1\", \"user_agent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0\"}', '2026-05-30 04:47:51', '2026-05-30 04:47:51'),
(25, 'auth', 'tch (owner) berhasil login', 'App\\Models\\User', 1, 'login', 'App\\Models\\User', 1, '[]', '{\"ip\": \"127.0.0.1\", \"user_agent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0\"}', '2026-05-30 04:56:47', '2026-05-30 04:56:47'),
(26, 'auth', 'tch telah logout', 'App\\Models\\User', 1, 'logout', 'App\\Models\\User', 1, '[]', '{\"ip\": \"127.0.0.1\"}', '2026-05-30 04:58:04', '2026-05-30 04:58:04'),
(27, 'auth', 'tch (owner) berhasil login', 'App\\Models\\User', 1, 'login', 'App\\Models\\User', 1, '[]', '{\"ip\": \"127.0.0.1\", \"user_agent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0\"}', '2026-05-30 04:58:10', '2026-05-30 04:58:10');

-- --------------------------------------------------------

--
-- Table structure for table `api_request_logs`
--

CREATE TABLE `api_request_logs` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `ip_address` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `method` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `url` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` json DEFAULT NULL,
  `status_code` int NOT NULL,
  `duration_ms` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `api_request_logs`
--

INSERT INTO `api_request_logs` (`id`, `user_id`, `ip_address`, `method`, `url`, `payload`, `status_code`, `duration_ms`, `created_at`) VALUES
(1, NULL, '127.0.0.1', 'POST', 'http://localhost:8000/api/register', '{\"name\": \"tch\", \"email\": \"gsptra77@gmail.com\", \"password\": \"[FILTERED]\", \"password_confirmation\": \"[FILTERED]\"}', 500, 966, '2026-05-26 05:12:46'),
(2, NULL, '127.0.0.1', 'POST', 'http://localhost:8000/api/register', '{\"name\": \"tch\", \"email\": \"gsptra77@gmail.com\", \"password\": \"[FILTERED]\", \"password_confirmation\": \"[FILTERED]\"}', 422, 167, '2026-05-26 05:18:40'),
(3, 1, '127.0.0.1', 'POST', 'http://localhost:8000/api/login', '{\"email\": \"gsptra77@gmail.com\", \"password\": \"[FILTERED]\"}', 200, 486, '2026-05-26 05:18:48'),
(4, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/dasbor-analitik?periode=2026-05', '{\"periode\": \"2026-05\"}', 403, 11, '2026-05-26 05:18:48'),
(5, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/dasbor-analitik?periode=2026-05', '{\"periode\": \"2026-05\"}', 403, 4, '2026-05-26 05:18:49'),
(6, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/pesanan', NULL, 404, 3, '2026-05-26 05:18:52'),
(7, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/produk', NULL, 404, 4, '2026-05-26 05:18:52'),
(8, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/pesanan', NULL, 404, 4, '2026-05-26 05:18:52'),
(9, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/produk', NULL, 404, 4, '2026-05-26 05:18:52'),
(10, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/staff/produk', NULL, 403, 2, '2026-05-26 05:18:52'),
(11, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/kapasitas', NULL, 404, 3, '2026-05-26 05:18:52'),
(12, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/staff/produk', NULL, 403, 1, '2026-05-26 05:18:52'),
(13, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/kapasitas', NULL, 404, 2, '2026-05-26 05:18:53'),
(14, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/bahan-baku', NULL, 404, 3, '2026-05-26 05:18:53'),
(15, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/bahan-baku', NULL, 404, 3, '2026-05-26 05:18:54'),
(16, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/pesanan', NULL, 404, 4, '2026-05-26 05:18:56'),
(17, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/produk', NULL, 404, 3, '2026-05-26 05:18:56'),
(18, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/pesanan', NULL, 404, 2, '2026-05-26 05:18:56'),
(19, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/produk', NULL, 404, 4, '2026-05-26 05:18:56'),
(20, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/staff/produk', NULL, 403, 1, '2026-05-26 05:18:56'),
(21, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/activity-logs?page=1', '{\"page\": \"1\"}', 404, 3, '2026-05-26 05:18:56'),
(22, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/staff/produk', NULL, 403, 1, '2026-05-26 05:18:56'),
(23, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/activity-logs?page=1', '{\"page\": \"1\"}', 404, 2, '2026-05-26 05:18:57'),
(24, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/pesanan', NULL, 404, 3, '2026-05-26 05:19:05'),
(25, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/produk', NULL, 404, 5, '2026-05-26 05:19:05'),
(26, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/pesanan', NULL, 404, 3, '2026-05-26 05:19:05'),
(27, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/produk', NULL, 404, 2, '2026-05-26 05:19:05'),
(28, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/staff/produk', NULL, 403, 1, '2026-05-26 05:19:06'),
(29, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/staff/produk', NULL, 403, 1, '2026-05-26 05:19:06'),
(30, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/profile', NULL, 200, 13, '2026-05-26 10:26:04'),
(31, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/profile', NULL, 200, 2, '2026-05-26 10:26:04'),
(32, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/pesanan', NULL, 404, 7, '2026-05-26 10:26:05'),
(33, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/produk', NULL, 404, 4, '2026-05-26 10:26:05'),
(34, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/pesanan', NULL, 404, 3, '2026-05-26 10:26:05'),
(35, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/produk', NULL, 404, 4, '2026-05-26 10:26:05'),
(36, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/staff/produk', NULL, 403, 1, '2026-05-26 10:26:05'),
(37, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/bahan-baku', NULL, 404, 4, '2026-05-26 10:26:06'),
(38, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/staff/produk', NULL, 403, 1, '2026-05-26 10:26:06'),
(39, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/bahan-baku', NULL, 404, 3, '2026-05-26 10:26:06'),
(40, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/kapasitas', NULL, 404, 5, '2026-05-26 10:26:07'),
(41, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/kapasitas', NULL, 404, 3, '2026-05-26 10:26:07'),
(42, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/staff/jadwal-produksi?tanggal=2026-05-26', '{\"tanggal\": \"2026-05-26\"}', 500, 909, '2026-05-26 10:26:23'),
(43, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/staff/jadwal-produksi?tanggal=2026-05-26', '{\"tanggal\": \"2026-05-26\"}', 500, 12, '2026-05-26 10:26:24'),
(44, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/kapasitas', NULL, 404, 4, '2026-05-26 10:26:32'),
(45, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/kapasitas', NULL, 404, 3, '2026-05-26 10:26:32'),
(46, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/bahan-baku', NULL, 404, 3, '2026-05-26 10:26:33'),
(47, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/bahan-baku', NULL, 404, 3, '2026-05-26 10:26:33'),
(48, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/dasbor-analitik?periode=2026-05', '{\"periode\": \"2026-05\"}', 403, 2, '2026-05-26 10:26:33'),
(49, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/dasbor-analitik?periode=2026-05', '{\"periode\": \"2026-05\"}', 403, 4, '2026-05-26 10:26:34'),
(50, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/pesanan', NULL, 404, 3, '2026-05-26 10:26:34'),
(51, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/produk', NULL, 404, 3, '2026-05-26 10:26:34'),
(52, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/pesanan', NULL, 404, 9, '2026-05-26 10:26:35'),
(53, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/produk', NULL, 404, 3, '2026-05-26 10:26:35'),
(54, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/staff/produk', NULL, 403, 1, '2026-05-26 10:26:35'),
(55, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/umkm', NULL, 404, 3, '2026-05-26 10:26:35'),
(56, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/staff/produk', NULL, 403, 1, '2026-05-26 10:26:35'),
(57, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/umkm', NULL, 404, 3, '2026-05-26 10:26:36'),
(58, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/staff/jadwal-produksi?tanggal=2026-05-26', '{\"tanggal\": \"2026-05-26\"}', 500, 11, '2026-05-26 10:26:36'),
(59, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/staff/jadwal-produksi?tanggal=2026-05-26', '{\"tanggal\": \"2026-05-26\"}', 500, 14, '2026-05-26 10:26:36'),
(60, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/produk', NULL, 404, 7, '2026-05-26 10:26:38'),
(61, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/bahan-baku', NULL, 404, 4, '2026-05-26 10:26:38'),
(62, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/produk', NULL, 404, 3, '2026-05-26 10:26:38'),
(63, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/bahan-baku', NULL, 404, 3, '2026-05-26 10:26:39'),
(64, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/profile', NULL, 200, 34, '2026-05-26 11:38:24'),
(65, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/profile', NULL, 200, 2, '2026-05-26 11:38:24'),
(66, 1, '127.0.0.1', 'POST', 'http://localhost:8000/api/login', '{\"email\": \"gsptra77@gmail.com\", \"password\": \"[FILTERED]\"}', 200, 521, '2026-05-26 11:38:38'),
(67, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/dasbor-analitik?periode=2026-05', '{\"periode\": \"2026-05\"}', 403, 53, '2026-05-26 11:38:38'),
(68, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/dasbor-analitik?periode=2026-05', '{\"periode\": \"2026-05\"}', 403, 4, '2026-05-26 11:38:39'),
(69, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/pesanan', NULL, 404, 8, '2026-05-26 11:38:41'),
(70, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/produk', NULL, 404, 3, '2026-05-26 11:38:41'),
(71, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/pesanan', NULL, 404, 4, '2026-05-26 11:38:41'),
(72, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/produk', NULL, 404, 4, '2026-05-26 11:38:42'),
(73, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/staff/produk', NULL, 403, 1, '2026-05-26 11:38:42'),
(74, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/kapasitas', NULL, 404, 3, '2026-05-26 11:38:42'),
(75, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/staff/produk', NULL, 403, 1, '2026-05-26 11:38:42'),
(76, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/kapasitas', NULL, 404, 4, '2026-05-26 11:38:42'),
(77, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/bahan-baku', NULL, 404, 2, '2026-05-26 11:38:43'),
(78, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/bahan-baku', NULL, 404, 3, '2026-05-26 11:38:43'),
(79, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/staff/jadwal-produksi?tanggal=2026-05-26', '{\"tanggal\": \"2026-05-26\"}', 500, 64, '2026-05-26 11:38:44'),
(80, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/staff/jadwal-produksi?tanggal=2026-05-26', '{\"tanggal\": \"2026-05-26\"}', 500, 19, '2026-05-26 11:38:44'),
(81, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/umkm', NULL, 404, 3, '2026-05-26 11:38:45'),
(82, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/umkm', NULL, 404, 3, '2026-05-26 11:38:45'),
(83, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/staff/jadwal-produksi?tanggal=2026-05-26', '{\"tanggal\": \"2026-05-26\"}', 500, 15, '2026-05-26 11:38:47'),
(84, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/staff/jadwal-produksi?tanggal=2026-05-26', '{\"tanggal\": \"2026-05-26\"}', 500, 24, '2026-05-26 11:38:47'),
(85, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/umkm', NULL, 404, 3, '2026-05-26 11:38:48'),
(86, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/umkm', NULL, 404, 6, '2026-05-26 11:38:48'),
(87, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/kapasitas', NULL, 404, 10, '2026-05-26 11:38:51'),
(88, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/kapasitas', NULL, 404, 4, '2026-05-26 11:38:51'),
(89, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/bahan-baku', NULL, 404, 3, '2026-05-26 11:38:53'),
(90, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/bahan-baku', NULL, 404, 3, '2026-05-26 11:38:53'),
(91, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/staff/jadwal-produksi?tanggal=2026-05-26', '{\"tanggal\": \"2026-05-26\"}', 500, 15, '2026-05-26 11:38:53'),
(92, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/staff/jadwal-produksi?tanggal=2026-05-26', '{\"tanggal\": \"2026-05-26\"}', 500, 14, '2026-05-26 11:38:53'),
(93, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/activity-logs?page=1', '{\"page\": \"1\"}', 404, 7, '2026-05-26 11:38:54'),
(94, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/activity-logs?page=1', '{\"page\": \"1\"}', 404, 4, '2026-05-26 11:38:54'),
(95, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/staff', NULL, 403, 8, '2026-05-26 11:38:57'),
(96, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/umkm', NULL, 404, 4, '2026-05-26 11:38:57'),
(97, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/staff', NULL, 403, 3, '2026-05-26 11:38:57'),
(98, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/umkm', NULL, 404, 3, '2026-05-26 11:38:57'),
(99, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/produk', NULL, 404, 3, '2026-05-26 11:38:57'),
(100, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/bahan-baku', NULL, 404, 3, '2026-05-26 11:38:57'),
(101, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/produk', NULL, 404, 3, '2026-05-26 11:38:58'),
(102, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/bahan-baku', NULL, 404, 3, '2026-05-26 11:38:58'),
(103, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/umkm', NULL, 404, 3, '2026-05-26 11:38:58'),
(104, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/umkm', NULL, 404, 3, '2026-05-26 11:38:58'),
(105, 1, '127.0.0.1', 'POST', 'http://localhost:8000/api/owner/umkm', '{\"name\": \"manut\", \"phone\": null, \"address\": \"ngawi\", \"description\": \"nyennii\"}', 500, 57, '2026-05-26 11:41:50'),
(106, 1, '127.0.0.1', 'POST', 'http://localhost:8000/api/owner/umkm', '{\"name\": \"manut\", \"phone\": null, \"address\": \"ngawi\", \"description\": \"nyennii\"}', 500, 23, '2026-05-26 11:41:54'),
(107, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/profile', NULL, 200, 34, '2026-05-26 11:44:10'),
(108, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/profile', NULL, 200, 2, '2026-05-26 11:44:10'),
(109, 1, '127.0.0.1', 'POST', 'http://localhost:8000/api/login', '{\"email\": \"gsptra77@gmail.com\", \"password\": \"[FILTERED]\"}', 200, 504, '2026-05-26 11:44:16'),
(110, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/dasbor-analitik?periode=2026-05', '{\"periode\": \"2026-05\"}', 403, 12, '2026-05-26 11:44:17'),
(111, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/dasbor-analitik?periode=2026-05', '{\"periode\": \"2026-05\"}', 403, 3, '2026-05-26 11:44:17'),
(112, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/umkm', NULL, 404, 7, '2026-05-26 11:44:19'),
(113, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/umkm', NULL, 404, 4, '2026-05-26 11:44:19'),
(114, 1, '127.0.0.1', 'POST', 'http://localhost:8000/api/owner/umkm', '{\"name\": \"manut\", \"phone\": null, \"address\": \"ngawi\", \"description\": \"nyenii\"}', 201, 47, '2026-05-26 11:44:33'),
(115, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/umkm', NULL, 200, 7, '2026-05-26 11:44:33'),
(116, 1, '127.0.0.1', 'PUT', 'http://localhost:8000/api/owner/umkm', '{\"name\": \"manut\", \"phone\": null, \"_method\": \"PUT\", \"address\": \"ngawi\", \"profile\": \"[FILE: sapoetra.png (119.47 KB)]\", \"description\": \"nyenii\"}', 200, 115, '2026-05-26 11:44:53'),
(117, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/umkm', NULL, 200, 7, '2026-05-26 11:44:54'),
(118, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/profile', NULL, 200, 5, '2026-05-26 11:45:12'),
(119, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/profile', NULL, 200, 2, '2026-05-26 11:45:12'),
(120, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/umkm', NULL, 200, 9, '2026-05-26 11:45:13'),
(121, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/umkm', NULL, 200, 6, '2026-05-26 11:45:13'),
(122, 1, '127.0.0.1', 'PUT', 'http://localhost:8000/api/owner/umkm', '{\"name\": \"manut\", \"phone\": null, \"_method\": \"PUT\", \"address\": \"ngawi\", \"profile\": \"[FILE: sapoetra.png (119.47 KB)]\", \"description\": \"nyenii\"}', 200, 53, '2026-05-26 11:45:22'),
(123, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/umkm', NULL, 200, 7, '2026-05-26 11:45:23'),
(124, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/produk', NULL, 200, 15, '2026-05-26 11:45:46'),
(125, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/bahan-baku', NULL, 200, 11, '2026-05-26 11:45:46'),
(126, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/produk', NULL, 200, 5, '2026-05-26 11:45:46'),
(127, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/bahan-baku', NULL, 200, 5, '2026-05-26 11:45:46'),
(128, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/dasbor-analitik?periode=2026-05', '{\"periode\": \"2026-05\"}', 200, 107, '2026-05-26 11:45:49'),
(129, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/dasbor-analitik?periode=2026-05', '{\"periode\": \"2026-05\"}', 200, 71, '2026-05-26 11:45:49'),
(130, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/pesanan', NULL, 200, 6, '2026-05-26 11:45:49'),
(131, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/produk', NULL, 200, 6, '2026-05-26 11:45:49'),
(132, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/pesanan', NULL, 200, 7, '2026-05-26 11:45:50'),
(133, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/produk', NULL, 200, 5, '2026-05-26 11:45:50'),
(134, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/dasbor-analitik?periode=2026-05', '{\"periode\": \"2026-05\"}', 200, 77, '2026-05-26 11:45:50'),
(135, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/pesanan', NULL, 200, 6, '2026-05-26 11:45:50'),
(136, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/produk', NULL, 200, 6, '2026-05-26 11:45:50'),
(137, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/dasbor-analitik?periode=2026-05', '{\"periode\": \"2026-05\"}', 200, 80, '2026-05-26 11:45:51'),
(138, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/pesanan', NULL, 200, 5, '2026-05-26 11:45:51'),
(139, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/produk', NULL, 200, 5, '2026-05-26 11:45:51'),
(140, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/dasbor-analitik?periode=2026-05', '{\"periode\": \"2026-05\"}', 200, 71, '2026-05-26 11:45:51'),
(141, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/pesanan', NULL, 200, 5, '2026-05-26 11:45:51'),
(142, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/produk', NULL, 200, 6, '2026-05-26 11:45:51'),
(143, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/dasbor-analitik?periode=2026-05', '{\"periode\": \"2026-05\"}', 200, 78, '2026-05-26 11:45:51'),
(144, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/pesanan', NULL, 200, 5, '2026-05-26 11:45:52'),
(145, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/produk', NULL, 200, 9, '2026-05-26 11:45:52'),
(146, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/dasbor-analitik?periode=2026-05', '{\"periode\": \"2026-05\"}', 200, 78, '2026-05-26 11:45:52'),
(147, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/pesanan', NULL, 200, 6, '2026-05-26 11:45:52'),
(148, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/produk', NULL, 200, 6, '2026-05-26 11:45:52'),
(149, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/dasbor-analitik?periode=2026-05', '{\"periode\": \"2026-05\"}', 200, 85, '2026-05-26 11:45:53'),
(150, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/pesanan', NULL, 200, 6, '2026-05-26 11:45:53'),
(151, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/produk', NULL, 200, 5, '2026-05-26 11:45:53'),
(152, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/dasbor-analitik?periode=2026-05', '{\"periode\": \"2026-05\"}', 200, 75, '2026-05-26 11:45:53'),
(153, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/pesanan', NULL, 200, 5, '2026-05-26 11:45:53'),
(154, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/produk', NULL, 200, 7, '2026-05-26 11:45:53'),
(155, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/dasbor-analitik?periode=2026-05', '{\"periode\": \"2026-05\"}', 200, 75, '2026-05-26 11:45:53'),
(156, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/pesanan', NULL, 200, 6, '2026-05-26 11:45:53'),
(157, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/produk', NULL, 200, 5, '2026-05-26 11:45:53'),
(158, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/dasbor-analitik?periode=2026-05', '{\"periode\": \"2026-05\"}', 200, 76, '2026-05-26 11:46:21'),
(159, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/dasbor-analitik?periode=2026-05', '{\"periode\": \"2026-05\"}', 200, 85, '2026-05-26 11:46:21'),
(160, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/staff/jadwal-produksi?tanggal=2026-05-26', '{\"tanggal\": \"2026-05-26\"}', 200, 12, '2026-05-26 11:46:35'),
(161, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/staff/jadwal-produksi?tanggal=2026-05-26', '{\"tanggal\": \"2026-05-26\"}', 200, 5, '2026-05-26 11:46:35'),
(162, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/umkm', NULL, 200, 6, '2026-05-26 11:46:36'),
(163, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/umkm', NULL, 200, 7, '2026-05-26 11:46:36'),
(164, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/produk', NULL, 200, 4, '2026-05-26 11:46:38'),
(165, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/bahan-baku', NULL, 200, 10, '2026-05-26 11:46:38'),
(166, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/produk', NULL, 200, 5, '2026-05-26 11:46:38'),
(167, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/bahan-baku', NULL, 200, 6, '2026-05-26 11:46:38'),
(168, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/umkm', NULL, 200, 13, '2026-05-26 11:49:54'),
(169, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/umkm', NULL, 200, 8, '2026-05-26 11:49:54'),
(170, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/staff/jadwal-produksi?tanggal=2026-05-26', '{\"tanggal\": \"2026-05-26\"}', 200, 17, '2026-05-26 11:52:11'),
(171, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/staff/jadwal-produksi?tanggal=2026-05-26', '{\"tanggal\": \"2026-05-26\"}', 200, 6, '2026-05-26 11:52:11'),
(172, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/bahan-baku', NULL, 200, 7, '2026-05-26 11:52:11'),
(173, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/bahan-baku', NULL, 200, 7, '2026-05-26 11:52:12'),
(174, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/dasbor-analitik?periode=2026-05', '{\"periode\": \"2026-05\"}', 200, 95, '2026-05-26 12:03:10'),
(175, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/dasbor-analitik?periode=2026-05', '{\"periode\": \"2026-05\"}', 200, 86, '2026-05-26 12:03:10'),
(176, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/pesanan', NULL, 200, 17, '2026-05-26 13:13:16'),
(177, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/produk', NULL, 200, 7, '2026-05-26 13:13:16'),
(178, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/pesanan', NULL, 200, 6, '2026-05-26 13:13:17'),
(179, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/produk', NULL, 200, 5, '2026-05-26 13:13:17'),
(180, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/dasbor-analitik?periode=2026-05', '{\"periode\": \"2026-05\"}', 200, 85, '2026-05-26 13:13:17'),
(181, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/dasbor-analitik?periode=2026-05', '{\"periode\": \"2026-05\"}', 200, 71, '2026-05-26 13:13:17'),
(182, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/profile', NULL, 200, 721, '2026-05-30 10:27:22'),
(183, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/profile', NULL, 200, 2, '2026-05-30 10:27:23'),
(184, 1, '127.0.0.1', 'POST', 'http://localhost:8000/api/login', '{\"email\": \"gsptra77@gmail.com\", \"password\": \"[FILTERED]\"}', 200, 1259, '2026-05-30 10:27:30'),
(185, NULL, '127.0.0.1', 'POST', 'http://localhost:8000/api/register', '{\"name\": \"tch\", \"email\": \"gsptra77@gmail.com\", \"password\": \"[FILTERED]\", \"password_confirmation\": \"[FILTERED]\"}', 422, 46, '2026-05-30 10:28:13'),
(186, NULL, '127.0.0.1', 'POST', 'http://localhost:8000/api/register', '{\"name\": \"tch\", \"email\": \"gsptra77@gmail.com\", \"password\": \"[FILTERED]\", \"password_confirmation\": \"[FILTERED]\"}', 422, 27, '2026-05-30 10:28:23'),
(187, NULL, '127.0.0.1', 'POST', 'http://localhost:8000/api/register', '{\"name\": \"tch\", \"email\": \"zerodekawa@gmail.com\", \"password\": \"[FILTERED]\", \"password_confirmation\": \"[FILTERED]\"}', 201, 402, '2026-05-30 10:28:48'),
(188, 2, '127.0.0.1', 'POST', 'http://localhost:8000/api/login', '{\"email\": \"zerodekawa@gmail.com\", \"password\": \"[FILTERED]\"}', 200, 416, '2026-05-30 10:28:54'),
(189, 2, '127.0.0.1', 'POST', 'http://localhost:8000/api/login', '{\"email\": \"zerodekawa@gmail.com\", \"password\": \"[FILTERED]\"}', 200, 436, '2026-05-30 10:32:39'),
(190, 2, '127.0.0.1', 'POST', 'http://localhost:8000/api/login', '{\"email\": \"zerodekawa@gmail.com\", \"password\": \"[FILTERED]\"}', 200, 411, '2026-05-30 10:32:48'),
(191, 2, '127.0.0.1', 'POST', 'http://localhost:8000/api/login', '{\"email\": \"zerodekawa@gmail.com\", \"password\": \"[FILTERED]\"}', 200, 398, '2026-05-30 10:32:54'),
(192, 2, '127.0.0.1', 'POST', 'http://localhost:8000/api/login', '{\"email\": \"zerodekawa@gmail.com\", \"password\": \"[FILTERED]\"}', 200, 401, '2026-05-30 10:33:06'),
(193, 2, '127.0.0.1', 'POST', 'http://localhost:8000/api/login', '{\"email\": \"zerodekawa@gmail.com\", \"password\": \"[FILTERED]\"}', 200, 460, '2026-05-30 10:37:16'),
(194, NULL, '127.0.0.1', 'POST', 'http://localhost:8000/api/login', '{\"email\": \"gsptra77@gmail.com\", \"password\": \"[FILTERED]\"}', 401, 5164, '2026-05-30 10:55:07'),
(195, 1, '127.0.0.1', 'POST', 'http://localhost:8000/api/login', '{\"email\": \"gsptra77@gmail.com\", \"password\": \"[FILTERED]\"}', 200, 1271, '2026-05-30 10:55:13'),
(196, 1, '127.0.0.1', 'POST', 'http://localhost:8000/api/login', '{\"email\": \"gsptra77@gmail.com\", \"password\": \"[FILTERED]\"}', 200, 547, '2026-05-30 10:59:07'),
(197, 1, '127.0.0.1', 'POST', 'http://localhost:8000/api/login', '{\"email\": \"gsptra77@gmail.com\", \"password\": \"[FILTERED]\"}', 200, 452, '2026-05-30 11:08:54'),
(198, 1, '127.0.0.1', 'POST', 'http://localhost:8000/api/login', '{\"email\": \"gsptra77@gmail.com\", \"password\": \"[FILTERED]\"}', 200, 427, '2026-05-30 11:09:21'),
(199, 1, '127.0.0.1', 'POST', 'http://localhost:8000/api/login', '{\"email\": \"gsptra77@gmail.com\", \"password\": \"[FILTERED]\"}', 200, 455, '2026-05-30 11:09:36'),
(200, NULL, '127.0.0.1', 'POST', 'http://localhost:8000/api/register', '{\"name\": \"tch\", \"email\": \"gsptra77@gmail.com\", \"password\": \"[FILTERED]\", \"password_confirmation\": \"[FILTERED]\"}', 422, 316, '2026-05-30 11:10:06'),
(201, NULL, '127.0.0.1', 'POST', 'http://localhost:8000/api/register', '{\"name\": \"tch\", \"email\": \"gsptra77@gmail.com\", \"password\": \"[FILTERED]\", \"password_confirmation\": \"[FILTERED]\"}', 422, 49, '2026-05-30 11:12:06'),
(202, NULL, '127.0.0.1', 'POST', 'http://localhost:8000/api/register', '{\"name\": \"tch\", \"email\": \"manut@gmail.com\", \"password\": \"[FILTERED]\", \"password_confirmation\": \"[FILTERED]\"}', 201, 476, '2026-05-30 11:12:11'),
(203, 3, '127.0.0.1', 'POST', 'http://localhost:8000/api/login', '{\"email\": \"manut@gmail.com\", \"password\": \"[FILTERED]\"}', 200, 418, '2026-05-30 11:12:16'),
(204, 3, '127.0.0.1', 'POST', 'http://localhost:8000/api/login', '{\"email\": \"manut@gmail.com\", \"password\": \"[FILTERED]\"}', 200, 471, '2026-05-30 11:13:55'),
(205, 1, '127.0.0.1', 'POST', 'http://localhost:8000/api/login', '{\"email\": \"gsptra77@gmail.com\", \"password\": \"[FILTERED]\"}', 200, 462, '2026-05-30 11:39:33'),
(206, 1, '127.0.0.1', 'POST', 'http://localhost:8000/api/login', '{\"email\": \"gsptra77@gmail.com\", \"password\": \"[FILTERED]\"}', 200, 516, '2026-05-30 11:41:43'),
(207, 1, '127.0.0.1', 'POST', 'http://localhost:8000/api/login', '{\"email\": \"gsptra77@gmail.com\", \"password\": \"[FILTERED]\"}', 200, 417, '2026-05-30 11:43:04'),
(208, 1, '127.0.0.1', 'POST', 'http://localhost:8000/api/login', '{\"email\": \"gsptra77@gmail.com\", \"password\": \"[FILTERED]\"}', 200, 454, '2026-05-30 11:47:51'),
(209, 1, '127.0.0.1', 'POST', 'http://localhost:8000/api/login', '{\"email\": \"gsptra77@gmail.com\", \"password\": \"[FILTERED]\"}', 200, 476, '2026-05-30 11:56:47'),
(210, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/dasbor-analitik?periode=2026-05', '{\"periode\": \"2026-05\"}', 200, 586, '2026-05-30 11:56:49'),
(211, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/dasbor-analitik?periode=2026-05', '{\"periode\": \"2026-05\"}', 200, 82, '2026-05-30 11:56:49'),
(212, 1, '127.0.0.1', 'POST', 'http://localhost:8000/api/logout', NULL, 200, 17, '2026-05-30 11:58:04'),
(213, 1, '127.0.0.1', 'POST', 'http://localhost:8000/api/login', '{\"email\": \"gsptra77@gmail.com\", \"password\": \"[FILTERED]\"}', 200, 439, '2026-05-30 11:58:10'),
(214, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/dasbor-analitik?periode=2026-05', '{\"periode\": \"2026-05\"}', 200, 79, '2026-05-30 11:58:10'),
(215, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/dasbor-analitik?periode=2026-05', '{\"periode\": \"2026-05\"}', 200, 70, '2026-05-30 11:58:11'),
(216, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/pesanan', NULL, 200, 9, '2026-05-30 12:01:56'),
(217, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/produk', NULL, 200, 99, '2026-05-30 12:01:57'),
(218, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/pesanan', NULL, 200, 5, '2026-05-30 12:01:57'),
(219, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/produk', NULL, 200, 5, '2026-05-30 12:01:57'),
(220, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/dasbor-analitik?periode=2026-05', '{\"periode\": \"2026-05\"}', 200, 78, '2026-05-30 12:01:57'),
(221, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/dasbor-analitik?periode=2026-05', '{\"periode\": \"2026-05\"}', 200, 70, '2026-05-30 12:01:57'),
(222, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/pesanan', NULL, 200, 11, '2026-05-30 12:02:06'),
(223, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/produk', NULL, 200, 7, '2026-05-30 12:02:06'),
(224, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/pesanan', NULL, 200, 7, '2026-05-30 12:02:06'),
(225, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/produk', NULL, 200, 6, '2026-05-30 12:02:06'),
(226, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/kapasitas', NULL, 200, 5, '2026-05-30 12:02:06'),
(227, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/kapasitas', NULL, 200, 5, '2026-05-30 12:02:06'),
(228, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/bahan-baku', NULL, 200, 8, '2026-05-30 12:02:07'),
(229, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/bahan-baku', NULL, 200, 5, '2026-05-30 12:02:07'),
(230, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/staff/jadwal-produksi?tanggal=2026-05-30', '{\"tanggal\": \"2026-05-30\"}', 200, 9, '2026-05-30 12:02:07'),
(231, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/staff/jadwal-produksi?tanggal=2026-05-30', '{\"tanggal\": \"2026-05-30\"}', 200, 6, '2026-05-30 12:02:08'),
(232, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/umkm', NULL, 200, 6, '2026-05-30 12:02:08'),
(233, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/umkm', NULL, 200, 10, '2026-05-30 12:02:09'),
(234, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/dasbor-analitik?periode=2026-05', '{\"periode\": \"2026-05\"}', 200, 73, '2026-05-30 12:02:11'),
(235, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/kapasitas', NULL, 200, 5, '2026-05-30 12:02:11'),
(236, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/dasbor-analitik?periode=2026-05', '{\"periode\": \"2026-05\"}', 200, 42, '2026-05-30 12:02:12'),
(237, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/kapasitas', NULL, 200, 5, '2026-05-30 12:02:12'),
(238, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/bahan-baku', NULL, 200, 5, '2026-05-30 12:02:13'),
(239, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/bahan-baku', NULL, 200, 4, '2026-05-30 12:02:14'),
(240, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/staff/jadwal-produksi?tanggal=2026-05-30', '{\"tanggal\": \"2026-05-30\"}', 200, 7, '2026-05-30 12:02:15'),
(241, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/staff/jadwal-produksi?tanggal=2026-05-30', '{\"tanggal\": \"2026-05-30\"}', 200, 5, '2026-05-30 12:02:15'),
(242, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/umkm', NULL, 200, 4, '2026-05-30 12:02:16'),
(243, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/umkm', NULL, 200, 6, '2026-05-30 12:02:16'),
(244, 1, '127.0.0.1', 'PUT', 'http://localhost:8000/api/owner/umkm', '{\"name\": \"manut\", \"phone\": null, \"_method\": \"PUT\", \"address\": \"ngawi\", \"profile\": \"[FILE: sapoetra.png (119.47 KB)]\", \"description\": \"nyenii\"}', 200, 1217, '2026-05-30 12:02:30'),
(245, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/umkm', NULL, 200, 4, '2026-05-30 12:02:30'),
(246, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/produk', NULL, 200, 11, '2026-05-30 12:02:36'),
(247, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/bahan-baku', NULL, 200, 6, '2026-05-30 12:02:36'),
(248, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/produk', NULL, 200, 6, '2026-05-30 12:02:37'),
(249, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/bahan-baku', NULL, 200, 4, '2026-05-30 12:02:37'),
(250, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/staff', NULL, 200, 5, '2026-05-30 12:02:37'),
(251, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/umkm', NULL, 200, 6, '2026-05-30 12:02:37'),
(252, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/staff', NULL, 200, 5, '2026-05-30 12:02:37'),
(253, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/umkm', NULL, 200, 6, '2026-05-30 12:02:37'),
(254, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/activity-logs?page=1', '{\"page\": \"1\"}', 200, 179, '2026-05-30 12:02:38'),
(255, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/activity-logs?page=1', '{\"page\": \"1\"}', 200, 25, '2026-05-30 12:02:38'),
(256, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/activity-logs?page=1', '{\"page\": \"1\"}', 200, 19, '2026-05-30 12:02:49'),
(257, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/dasbor-analitik?periode=2026-05', '{\"periode\": \"2026-05\"}', 200, 90, '2026-05-30 12:02:57'),
(258, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/dasbor-analitik?periode=2026-05', '{\"periode\": \"2026-05\"}', 200, 82, '2026-05-30 12:02:57'),
(259, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/pesanan', NULL, 200, 6, '2026-05-30 12:02:58'),
(260, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/produk', NULL, 200, 6, '2026-05-30 12:02:58'),
(261, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/pesanan', NULL, 200, 6, '2026-05-30 12:02:58'),
(262, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/produk', NULL, 200, 5, '2026-05-30 12:02:58'),
(263, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/kapasitas', NULL, 200, 5, '2026-05-30 12:02:59'),
(264, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/kapasitas', NULL, 200, 5, '2026-05-30 12:02:59'),
(265, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/bahan-baku', NULL, 200, 5, '2026-05-30 12:02:59'),
(266, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/bahan-baku', NULL, 200, 6, '2026-05-30 12:03:00'),
(267, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/dasbor-analitik?periode=2026-05', '{\"periode\": \"2026-05\"}', 200, 79, '2026-05-30 12:04:43'),
(268, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/dasbor-analitik?periode=2026-05', '{\"periode\": \"2026-05\"}', 200, 51, '2026-05-30 12:04:43'),
(269, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/profile', NULL, 200, 13, '2026-05-30 14:41:34'),
(270, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/profile', NULL, 200, 1, '2026-05-30 14:41:35'),
(271, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/dasbor-analitik?periode=2026-05', '{\"periode\": \"2026-05\"}', 200, 99, '2026-05-30 14:41:35'),
(272, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/owner/dasbor-analitik?periode=2026-05', '{\"periode\": \"2026-05\"}', 200, 74, '2026-05-30 14:41:36');

-- --------------------------------------------------------

--
-- Table structure for table `bahan_bakus`
--

CREATE TABLE `bahan_bakus` (
  `id` bigint UNSIGNED NOT NULL,
  `umkm_id` bigint UNSIGNED NOT NULL,
  `nama` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `satuan` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `stok` decimal(10,2) NOT NULL DEFAULT '0.00',
  `stok_dialokasikan` decimal(10,2) NOT NULL DEFAULT '0.00',
  `stok_minimum` decimal(10,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jadwal_produksis`
--

CREATE TABLE `jadwal_produksis` (
  `id` bigint UNSIGNED NOT NULL,
  `umkm_id` bigint UNSIGNED NOT NULL,
  `pesanan_id` bigint UNSIGNED NOT NULL,
  `tanggal_produksi` date NOT NULL,
  `total_waktu_menit` int NOT NULL,
  `status` enum('menunggu','selesai') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'menunggu',
  `terlambat` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint UNSIGNED NOT NULL,
  `reserved_at` int UNSIGNED DEFAULT NULL,
  `available_at` int UNSIGNED NOT NULL,
  `created_at` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int UNSIGNED NOT NULL,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '0001_01_01_000003_create_umkms_table', 1),
(5, '0001_01_01_000004_create_master_data_tables', 1),
(6, '2026_03_14_180046_create_personal_access_tokens_table', 1),
(7, '2026_04_08_000001_add_waktu_produksi_to_produks_table', 1),
(8, '2026_04_08_000002_create_pengaturan_kapasitas_table', 1),
(9, '2026_04_14_000001_create_pesanans_and_items_table', 1),
(10, '2026_04_14_000002_add_stok_dialokasikan_to_bahan_bakus', 1),
(11, '2026_04_14_000003_create_jadwal_produksis_table', 1),
(12, '2026_04_14_000004_add_diselesaikan_pada_to_pesanans', 1),
(13, '2026_04_14_000005_create_riwayat_keterlambatans_table', 1),
(14, '2026_05_25_000001_create_activity_log_table', 1),
(15, '2026_05_25_174614_create_api_request_logs_table', 1),
(16, '2026_05_25_182403_create_system_errors_table', 1),
(17, '2026_05_26_061920_add_avatar_to_users_and_profile_to_umkms', 2);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pengaturan_kapasitas`
--

CREATE TABLE `pengaturan_kapasitas` (
  `id` bigint UNSIGNED NOT NULL,
  `umkm_id` bigint UNSIGNED NOT NULL,
  `kapasitas_harian_menit` int NOT NULL DEFAULT '480' COMMENT 'Total kapasitas mesin/pegawai dalam menit per hari',
  `hari_operasi` json DEFAULT NULL COMMENT 'Contoh: ["Senin", "Selasa"]',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint UNSIGNED NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', 1, 'auth_token', '8803371a71e1d37599e25016f572cbeb1c3365f17b7fff74db59a3d5c04219b7', '[\"*\"]', '2026-05-26 04:38:24', NULL, '2026-05-25 22:18:48', '2026-05-26 04:38:24'),
(2, 'App\\Models\\User', 1, 'auth_token', '67da3166731e8476f1ad41a07f3507fe8c983f436342ac57505c12c80a4afab1', '[\"*\"]', '2026-05-26 04:44:10', NULL, '2026-05-26 04:38:38', '2026-05-26 04:44:10'),
(3, 'App\\Models\\User', 1, 'auth_token', '25d353768267ecb20d1bce4f992b8023d587a18b30446b23a2eec010fc3f42b4', '[\"*\"]', '2026-05-30 03:27:23', NULL, '2026-05-26 04:44:16', '2026-05-30 03:27:23'),
(4, 'App\\Models\\User', 1, 'auth_token', '56dcf5e0d26a578cd6bff68a01a687dded5ae7b81186777768f4cb42a3535a2f', '[\"*\"]', NULL, NULL, '2026-05-30 03:27:29', '2026-05-30 03:27:29'),
(5, 'App\\Models\\User', 2, 'auth_token', '64ca7f3e4a2d37fef5719e2ffa182b64347025930e3dc0ff881eb8dc6b6d058e', '[\"*\"]', NULL, NULL, '2026-05-30 03:28:54', '2026-05-30 03:28:54'),
(6, 'App\\Models\\User', 2, 'auth_token', '7e53a645d037893acf4b2415d5f44e8dee66d74cf71dcf2e423a51314a07bab1', '[\"*\"]', NULL, NULL, '2026-05-30 03:32:39', '2026-05-30 03:32:39'),
(7, 'App\\Models\\User', 2, 'auth_token', '57d6c6f57606643ffede13396ffb408cdafe458cbc944df68633d4496b543824', '[\"*\"]', NULL, NULL, '2026-05-30 03:32:48', '2026-05-30 03:32:48'),
(8, 'App\\Models\\User', 2, 'auth_token', '12debad9e972752cb4964e4c5138fbf20e69c6219737b083b8d7451179797a66', '[\"*\"]', NULL, NULL, '2026-05-30 03:32:54', '2026-05-30 03:32:54'),
(9, 'App\\Models\\User', 2, 'auth_token', '407c1a3d729e9f65a4fcc8b24d2ed04d255cf885ea43aede27e9440d0de87465', '[\"*\"]', NULL, NULL, '2026-05-30 03:33:06', '2026-05-30 03:33:06'),
(10, 'App\\Models\\User', 2, 'auth_token', '2821e22665738645a941b0b7cc00d4fd30e7f8c3e24f07d47f6be2e7f8016a25', '[\"*\"]', NULL, NULL, '2026-05-30 03:37:16', '2026-05-30 03:37:16'),
(11, 'App\\Models\\User', 1, 'auth_token', '129e889a12dd3745e47584655094253dd9cc95184198a36d0d9adca3a871bb7c', '[\"*\"]', NULL, NULL, '2026-05-30 03:55:12', '2026-05-30 03:55:12'),
(12, 'App\\Models\\User', 1, 'auth_token', '1a151888471941f19002347b72decac28049015eed78588a07502c7b6891db57', '[\"*\"]', NULL, NULL, '2026-05-30 03:59:07', '2026-05-30 03:59:07'),
(13, 'App\\Models\\User', 1, 'auth_token', 'ef462c8a3056c10b214269ab6d86bcb9385266d59dc652e29d8791310fbf3551', '[\"*\"]', NULL, NULL, '2026-05-30 04:08:54', '2026-05-30 04:08:54'),
(14, 'App\\Models\\User', 1, 'auth_token', 'becaeccf1cbe7e076abc4e6c5007142f45e0f767eaae99a16b9c1ddf3a55aaf4', '[\"*\"]', NULL, NULL, '2026-05-30 04:09:21', '2026-05-30 04:09:21'),
(15, 'App\\Models\\User', 1, 'auth_token', '72a9480da322f1c1c812f93696f1d5c419802d2b1834638025f1024d9e8df22b', '[\"*\"]', NULL, NULL, '2026-05-30 04:09:36', '2026-05-30 04:09:36'),
(16, 'App\\Models\\User', 3, 'auth_token', 'f5ad4de8dc23864f65fd5a65414dd34aeceebcd2d715508d7374b7bfebd9de62', '[\"*\"]', NULL, NULL, '2026-05-30 04:12:16', '2026-05-30 04:12:16'),
(17, 'App\\Models\\User', 3, 'auth_token', '5c6984b6dec5e32614e4d2754a5f43847c60210c4de42f2b51fb65188e020cdc', '[\"*\"]', NULL, NULL, '2026-05-30 04:13:55', '2026-05-30 04:13:55'),
(18, 'App\\Models\\User', 1, 'auth_token', 'ceb2d1f1a5b7d2466067b63a011d43ba75424cc85b3dddeed1708ff0d25e7bdf', '[\"*\"]', NULL, NULL, '2026-05-30 04:39:33', '2026-05-30 04:39:33'),
(19, 'App\\Models\\User', 1, 'auth_token', 'd1acf7ebf83ed9d2f8804c229e59559ecba0519677bb074021b8295dda5491d7', '[\"*\"]', NULL, NULL, '2026-05-30 04:41:43', '2026-05-30 04:41:43'),
(20, 'App\\Models\\User', 1, 'auth_token', '7fa9a13b97ed9e7b0955a1292c8ad5cb0feec226d0fa5984bcaacf4a15882b78', '[\"*\"]', NULL, NULL, '2026-05-30 04:43:04', '2026-05-30 04:43:04'),
(21, 'App\\Models\\User', 1, 'auth_token', 'bfb3dbe701edd6e4065483f60aa29cc60e4ac3cfcd79388a93ffa4f742e2c94d', '[\"*\"]', NULL, NULL, '2026-05-30 04:47:51', '2026-05-30 04:47:51'),
(23, 'App\\Models\\User', 1, 'auth_token', '53c7f9f223eb9a18603d64b98c58b19ad9ec115aa8e9f7ac5b0be1789b41419b', '[\"*\"]', '2026-05-30 07:41:35', NULL, '2026-05-30 04:58:10', '2026-05-30 07:41:35');

-- --------------------------------------------------------

--
-- Table structure for table `pesanans`
--

CREATE TABLE `pesanans` (
  `id` bigint UNSIGNED NOT NULL,
  `umkm_id` bigint UNSIGNED NOT NULL,
  `pelanggan` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tenggat_waktu` date NOT NULL,
  `status` enum('pending','diproses','selesai','dibatalkan') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `diselesaikan_pada` timestamp NULL DEFAULT NULL,
  `prioritas` enum('tinggi','sedang','rendah') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'rendah',
  `total_harga` decimal(15,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pesanan_items`
--

CREATE TABLE `pesanan_items` (
  `id` bigint UNSIGNED NOT NULL,
  `pesanan_id` bigint UNSIGNED NOT NULL,
  `produk_id` bigint UNSIGNED NOT NULL,
  `kuantitas` int NOT NULL,
  `harga_satuan` decimal(15,2) NOT NULL,
  `subtotal` decimal(15,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `produks`
--

CREATE TABLE `produks` (
  `id` bigint UNSIGNED NOT NULL,
  `umkm_id` bigint UNSIGNED NOT NULL,
  `nama` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `deskripsi` text COLLATE utf8mb4_unicode_ci,
  `harga` decimal(15,2) NOT NULL,
  `waktu_produksi` int NOT NULL DEFAULT '0' COMMENT 'Waktu produksi 1 pcs produk dalam hitungan menit',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `resep_produks`
--

CREATE TABLE `resep_produks` (
  `id` bigint UNSIGNED NOT NULL,
  `produk_id` bigint UNSIGNED NOT NULL,
  `bahan_baku_id` bigint UNSIGNED NOT NULL,
  `kuantitas` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `riwayat_keterlambatans`
--

CREATE TABLE `riwayat_keterlambatans` (
  `id` bigint UNSIGNED NOT NULL,
  `umkm_id` bigint UNSIGNED NOT NULL,
  `pesanan_id` bigint UNSIGNED NOT NULL,
  `tenggat_waktu` date NOT NULL,
  `diselesaikan_pada` timestamp NOT NULL,
  `selisih_hari` int NOT NULL,
  `alasan_opsional` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `system_errors`
--

CREATE TABLE `system_errors` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `ip_address` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `method` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `url` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception_class` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `file` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `line` int NOT NULL,
  `trace` json NOT NULL,
  `payload` json DEFAULT NULL,
  `resolved` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `system_errors`
--

INSERT INTO `system_errors` (`id`, `user_id`, `ip_address`, `method`, `url`, `exception_class`, `message`, `file`, `line`, `trace`, `payload`, `resolved`, `created_at`) VALUES
(1, NULL, '127.0.0.1', 'POST', 'http://localhost:8000/api/register', 'Error', 'Call to undefined function App\\Http\\Controllers\\activity()', 'C:\\Users\\gilan\\files\\Foodcraft\\BE-FoodCraft\\app\\Http\\Controllers\\AuthController.php', 33, '[\"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Routing\\\\ControllerDispatcher.php:46 (register)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Routing\\\\Route.php:265 (dispatch)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Routing\\\\Route.php:211 (runController)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Routing\\\\Router.php:822 (run)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Pipeline\\\\Pipeline.php:180 ({closure:Illuminate\\\\Routing\\\\Router::runRouteWithinStack():821})\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\app\\\\Http\\\\Middleware\\\\ApiRequestLogMiddleware.php:25 ({closure:Illuminate\\\\Pipeline\\\\Pipeline::prepareDestination():178})\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Pipeline\\\\Pipeline.php:219 (handle)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Routing\\\\Middleware\\\\SubstituteBindings.php:50 ({closure:{closure:Illuminate\\\\Pipeline\\\\Pipeline::carry():194}:195})\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Pipeline\\\\Pipeline.php:219 (handle)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Pipeline\\\\Pipeline.php:137 ({closure:{closure:Illuminate\\\\Pipeline\\\\Pipeline::carry():194}:195})\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Routing\\\\Router.php:821 (then)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Routing\\\\Router.php:800 (runRouteWithinStack)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Routing\\\\Router.php:764 (runRoute)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Routing\\\\Router.php:753 (dispatchToRoute)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Foundation\\\\Http\\\\Kernel.php:200 (dispatch)\"]', '{\"name\": \"tch\", \"email\": \"gsptra77@gmail.com\", \"password\": \"[FILTERED]\", \"password_confirmation\": \"[FILTERED]\"}', 0, '2026-05-26 05:12:46'),
(2, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/staff/jadwal-produksi?tanggal=2026-05-26', 'ErrorException', 'Attempt to read property \"id\" on null', 'C:\\Users\\gilan\\files\\Foodcraft\\BE-FoodCraft\\app\\Http\\Controllers\\JadwalProduksiController.php', 25, '[\"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Foundation\\\\Bootstrap\\\\HandleExceptions.php:258 (handleError)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\app\\\\Http\\\\Controllers\\\\JadwalProduksiController.php:25 ({closure:Illuminate\\\\Foundation\\\\Bootstrap\\\\HandleExceptions::forwardsTo():257})\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Routing\\\\ControllerDispatcher.php:46 (index)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Routing\\\\Route.php:265 (dispatch)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Routing\\\\Route.php:211 (runController)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Routing\\\\Router.php:822 (run)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Pipeline\\\\Pipeline.php:180 ({closure:Illuminate\\\\Routing\\\\Router::runRouteWithinStack():821})\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\app\\\\Http\\\\Middleware\\\\RoleMiddleware.php:27 ({closure:Illuminate\\\\Pipeline\\\\Pipeline::prepareDestination():178})\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Pipeline\\\\Pipeline.php:219 (handle)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\app\\\\Http\\\\Middleware\\\\ApiRequestLogMiddleware.php:25 ({closure:{closure:Illuminate\\\\Pipeline\\\\Pipeline::carry():194}:195})\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Pipeline\\\\Pipeline.php:219 (handle)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Routing\\\\Middleware\\\\SubstituteBindings.php:50 ({closure:{closure:Illuminate\\\\Pipeline\\\\Pipeline::carry():194}:195})\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Pipeline\\\\Pipeline.php:219 (handle)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Auth\\\\Middleware\\\\Authenticate.php:63 ({closure:{closure:Illuminate\\\\Pipeline\\\\Pipeline::carry():194}:195})\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Pipeline\\\\Pipeline.php:219 (handle)\"]', '{\"tanggal\": \"2026-05-26\"}', 0, '2026-05-26 10:26:23'),
(3, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/staff/jadwal-produksi?tanggal=2026-05-26', 'ErrorException', 'Attempt to read property \"id\" on null', 'C:\\Users\\gilan\\files\\Foodcraft\\BE-FoodCraft\\app\\Http\\Controllers\\JadwalProduksiController.php', 25, '[\"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Foundation\\\\Bootstrap\\\\HandleExceptions.php:258 (handleError)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\app\\\\Http\\\\Controllers\\\\JadwalProduksiController.php:25 ({closure:Illuminate\\\\Foundation\\\\Bootstrap\\\\HandleExceptions::forwardsTo():257})\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Routing\\\\ControllerDispatcher.php:46 (index)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Routing\\\\Route.php:265 (dispatch)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Routing\\\\Route.php:211 (runController)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Routing\\\\Router.php:822 (run)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Pipeline\\\\Pipeline.php:180 ({closure:Illuminate\\\\Routing\\\\Router::runRouteWithinStack():821})\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\app\\\\Http\\\\Middleware\\\\RoleMiddleware.php:27 ({closure:Illuminate\\\\Pipeline\\\\Pipeline::prepareDestination():178})\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Pipeline\\\\Pipeline.php:219 (handle)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\app\\\\Http\\\\Middleware\\\\ApiRequestLogMiddleware.php:25 ({closure:{closure:Illuminate\\\\Pipeline\\\\Pipeline::carry():194}:195})\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Pipeline\\\\Pipeline.php:219 (handle)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Routing\\\\Middleware\\\\SubstituteBindings.php:50 ({closure:{closure:Illuminate\\\\Pipeline\\\\Pipeline::carry():194}:195})\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Pipeline\\\\Pipeline.php:219 (handle)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Auth\\\\Middleware\\\\Authenticate.php:63 ({closure:{closure:Illuminate\\\\Pipeline\\\\Pipeline::carry():194}:195})\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Pipeline\\\\Pipeline.php:219 (handle)\"]', '{\"tanggal\": \"2026-05-26\"}', 0, '2026-05-26 10:26:24'),
(4, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/staff/jadwal-produksi?tanggal=2026-05-26', 'ErrorException', 'Attempt to read property \"id\" on null', 'C:\\Users\\gilan\\files\\Foodcraft\\BE-FoodCraft\\app\\Http\\Controllers\\JadwalProduksiController.php', 25, '[\"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Foundation\\\\Bootstrap\\\\HandleExceptions.php:258 (handleError)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\app\\\\Http\\\\Controllers\\\\JadwalProduksiController.php:25 ({closure:Illuminate\\\\Foundation\\\\Bootstrap\\\\HandleExceptions::forwardsTo():257})\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Routing\\\\ControllerDispatcher.php:46 (index)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Routing\\\\Route.php:265 (dispatch)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Routing\\\\Route.php:211 (runController)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Routing\\\\Router.php:822 (run)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Pipeline\\\\Pipeline.php:180 ({closure:Illuminate\\\\Routing\\\\Router::runRouteWithinStack():821})\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\app\\\\Http\\\\Middleware\\\\RoleMiddleware.php:27 ({closure:Illuminate\\\\Pipeline\\\\Pipeline::prepareDestination():178})\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Pipeline\\\\Pipeline.php:219 (handle)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\app\\\\Http\\\\Middleware\\\\ApiRequestLogMiddleware.php:25 ({closure:{closure:Illuminate\\\\Pipeline\\\\Pipeline::carry():194}:195})\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Pipeline\\\\Pipeline.php:219 (handle)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Routing\\\\Middleware\\\\SubstituteBindings.php:50 ({closure:{closure:Illuminate\\\\Pipeline\\\\Pipeline::carry():194}:195})\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Pipeline\\\\Pipeline.php:219 (handle)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Auth\\\\Middleware\\\\Authenticate.php:63 ({closure:{closure:Illuminate\\\\Pipeline\\\\Pipeline::carry():194}:195})\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Pipeline\\\\Pipeline.php:219 (handle)\"]', '{\"tanggal\": \"2026-05-26\"}', 0, '2026-05-26 10:26:36'),
(5, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/staff/jadwal-produksi?tanggal=2026-05-26', 'ErrorException', 'Attempt to read property \"id\" on null', 'C:\\Users\\gilan\\files\\Foodcraft\\BE-FoodCraft\\app\\Http\\Controllers\\JadwalProduksiController.php', 25, '[\"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Foundation\\\\Bootstrap\\\\HandleExceptions.php:258 (handleError)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\app\\\\Http\\\\Controllers\\\\JadwalProduksiController.php:25 ({closure:Illuminate\\\\Foundation\\\\Bootstrap\\\\HandleExceptions::forwardsTo():257})\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Routing\\\\ControllerDispatcher.php:46 (index)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Routing\\\\Route.php:265 (dispatch)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Routing\\\\Route.php:211 (runController)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Routing\\\\Router.php:822 (run)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Pipeline\\\\Pipeline.php:180 ({closure:Illuminate\\\\Routing\\\\Router::runRouteWithinStack():821})\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\app\\\\Http\\\\Middleware\\\\RoleMiddleware.php:27 ({closure:Illuminate\\\\Pipeline\\\\Pipeline::prepareDestination():178})\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Pipeline\\\\Pipeline.php:219 (handle)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\app\\\\Http\\\\Middleware\\\\ApiRequestLogMiddleware.php:25 ({closure:{closure:Illuminate\\\\Pipeline\\\\Pipeline::carry():194}:195})\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Pipeline\\\\Pipeline.php:219 (handle)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Routing\\\\Middleware\\\\SubstituteBindings.php:50 ({closure:{closure:Illuminate\\\\Pipeline\\\\Pipeline::carry():194}:195})\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Pipeline\\\\Pipeline.php:219 (handle)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Auth\\\\Middleware\\\\Authenticate.php:63 ({closure:{closure:Illuminate\\\\Pipeline\\\\Pipeline::carry():194}:195})\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Pipeline\\\\Pipeline.php:219 (handle)\"]', '{\"tanggal\": \"2026-05-26\"}', 0, '2026-05-26 10:26:36'),
(6, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/staff/jadwal-produksi?tanggal=2026-05-26', 'ErrorException', 'Attempt to read property \"id\" on null', 'C:\\Users\\gilan\\files\\Foodcraft\\BE-FoodCraft\\app\\Http\\Controllers\\JadwalProduksiController.php', 25, '[\"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Foundation\\\\Bootstrap\\\\HandleExceptions.php:258 (handleError)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\app\\\\Http\\\\Controllers\\\\JadwalProduksiController.php:25 ({closure:Illuminate\\\\Foundation\\\\Bootstrap\\\\HandleExceptions::forwardsTo():257})\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Routing\\\\ControllerDispatcher.php:46 (index)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Routing\\\\Route.php:265 (dispatch)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Routing\\\\Route.php:211 (runController)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Routing\\\\Router.php:822 (run)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Pipeline\\\\Pipeline.php:180 ({closure:Illuminate\\\\Routing\\\\Router::runRouteWithinStack():821})\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\app\\\\Http\\\\Middleware\\\\RoleMiddleware.php:27 ({closure:Illuminate\\\\Pipeline\\\\Pipeline::prepareDestination():178})\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Pipeline\\\\Pipeline.php:219 (handle)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\app\\\\Http\\\\Middleware\\\\ApiRequestLogMiddleware.php:25 ({closure:{closure:Illuminate\\\\Pipeline\\\\Pipeline::carry():194}:195})\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Pipeline\\\\Pipeline.php:219 (handle)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Routing\\\\Middleware\\\\SubstituteBindings.php:50 ({closure:{closure:Illuminate\\\\Pipeline\\\\Pipeline::carry():194}:195})\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Pipeline\\\\Pipeline.php:219 (handle)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Auth\\\\Middleware\\\\Authenticate.php:63 ({closure:{closure:Illuminate\\\\Pipeline\\\\Pipeline::carry():194}:195})\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Pipeline\\\\Pipeline.php:219 (handle)\"]', '{\"tanggal\": \"2026-05-26\"}', 0, '2026-05-26 11:38:44'),
(7, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/staff/jadwal-produksi?tanggal=2026-05-26', 'ErrorException', 'Attempt to read property \"id\" on null', 'C:\\Users\\gilan\\files\\Foodcraft\\BE-FoodCraft\\app\\Http\\Controllers\\JadwalProduksiController.php', 25, '[\"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Foundation\\\\Bootstrap\\\\HandleExceptions.php:258 (handleError)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\app\\\\Http\\\\Controllers\\\\JadwalProduksiController.php:25 ({closure:Illuminate\\\\Foundation\\\\Bootstrap\\\\HandleExceptions::forwardsTo():257})\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Routing\\\\ControllerDispatcher.php:46 (index)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Routing\\\\Route.php:265 (dispatch)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Routing\\\\Route.php:211 (runController)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Routing\\\\Router.php:822 (run)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Pipeline\\\\Pipeline.php:180 ({closure:Illuminate\\\\Routing\\\\Router::runRouteWithinStack():821})\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\app\\\\Http\\\\Middleware\\\\RoleMiddleware.php:27 ({closure:Illuminate\\\\Pipeline\\\\Pipeline::prepareDestination():178})\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Pipeline\\\\Pipeline.php:219 (handle)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\app\\\\Http\\\\Middleware\\\\ApiRequestLogMiddleware.php:25 ({closure:{closure:Illuminate\\\\Pipeline\\\\Pipeline::carry():194}:195})\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Pipeline\\\\Pipeline.php:219 (handle)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Routing\\\\Middleware\\\\SubstituteBindings.php:50 ({closure:{closure:Illuminate\\\\Pipeline\\\\Pipeline::carry():194}:195})\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Pipeline\\\\Pipeline.php:219 (handle)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Auth\\\\Middleware\\\\Authenticate.php:63 ({closure:{closure:Illuminate\\\\Pipeline\\\\Pipeline::carry():194}:195})\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Pipeline\\\\Pipeline.php:219 (handle)\"]', '{\"tanggal\": \"2026-05-26\"}', 0, '2026-05-26 11:38:44'),
(8, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/staff/jadwal-produksi?tanggal=2026-05-26', 'ErrorException', 'Attempt to read property \"id\" on null', 'C:\\Users\\gilan\\files\\Foodcraft\\BE-FoodCraft\\app\\Http\\Controllers\\JadwalProduksiController.php', 25, '[\"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Foundation\\\\Bootstrap\\\\HandleExceptions.php:258 (handleError)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\app\\\\Http\\\\Controllers\\\\JadwalProduksiController.php:25 ({closure:Illuminate\\\\Foundation\\\\Bootstrap\\\\HandleExceptions::forwardsTo():257})\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Routing\\\\ControllerDispatcher.php:46 (index)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Routing\\\\Route.php:265 (dispatch)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Routing\\\\Route.php:211 (runController)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Routing\\\\Router.php:822 (run)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Pipeline\\\\Pipeline.php:180 ({closure:Illuminate\\\\Routing\\\\Router::runRouteWithinStack():821})\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\app\\\\Http\\\\Middleware\\\\RoleMiddleware.php:27 ({closure:Illuminate\\\\Pipeline\\\\Pipeline::prepareDestination():178})\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Pipeline\\\\Pipeline.php:219 (handle)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\app\\\\Http\\\\Middleware\\\\ApiRequestLogMiddleware.php:25 ({closure:{closure:Illuminate\\\\Pipeline\\\\Pipeline::carry():194}:195})\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Pipeline\\\\Pipeline.php:219 (handle)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Routing\\\\Middleware\\\\SubstituteBindings.php:50 ({closure:{closure:Illuminate\\\\Pipeline\\\\Pipeline::carry():194}:195})\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Pipeline\\\\Pipeline.php:219 (handle)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Auth\\\\Middleware\\\\Authenticate.php:63 ({closure:{closure:Illuminate\\\\Pipeline\\\\Pipeline::carry():194}:195})\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Pipeline\\\\Pipeline.php:219 (handle)\"]', '{\"tanggal\": \"2026-05-26\"}', 0, '2026-05-26 11:38:47'),
(9, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/staff/jadwal-produksi?tanggal=2026-05-26', 'ErrorException', 'Attempt to read property \"id\" on null', 'C:\\Users\\gilan\\files\\Foodcraft\\BE-FoodCraft\\app\\Http\\Controllers\\JadwalProduksiController.php', 25, '[\"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Foundation\\\\Bootstrap\\\\HandleExceptions.php:258 (handleError)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\app\\\\Http\\\\Controllers\\\\JadwalProduksiController.php:25 ({closure:Illuminate\\\\Foundation\\\\Bootstrap\\\\HandleExceptions::forwardsTo():257})\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Routing\\\\ControllerDispatcher.php:46 (index)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Routing\\\\Route.php:265 (dispatch)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Routing\\\\Route.php:211 (runController)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Routing\\\\Router.php:822 (run)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Pipeline\\\\Pipeline.php:180 ({closure:Illuminate\\\\Routing\\\\Router::runRouteWithinStack():821})\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\app\\\\Http\\\\Middleware\\\\RoleMiddleware.php:27 ({closure:Illuminate\\\\Pipeline\\\\Pipeline::prepareDestination():178})\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Pipeline\\\\Pipeline.php:219 (handle)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\app\\\\Http\\\\Middleware\\\\ApiRequestLogMiddleware.php:25 ({closure:{closure:Illuminate\\\\Pipeline\\\\Pipeline::carry():194}:195})\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Pipeline\\\\Pipeline.php:219 (handle)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Routing\\\\Middleware\\\\SubstituteBindings.php:50 ({closure:{closure:Illuminate\\\\Pipeline\\\\Pipeline::carry():194}:195})\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Pipeline\\\\Pipeline.php:219 (handle)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Auth\\\\Middleware\\\\Authenticate.php:63 ({closure:{closure:Illuminate\\\\Pipeline\\\\Pipeline::carry():194}:195})\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Pipeline\\\\Pipeline.php:219 (handle)\"]', '{\"tanggal\": \"2026-05-26\"}', 0, '2026-05-26 11:38:47'),
(10, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/staff/jadwal-produksi?tanggal=2026-05-26', 'ErrorException', 'Attempt to read property \"id\" on null', 'C:\\Users\\gilan\\files\\Foodcraft\\BE-FoodCraft\\app\\Http\\Controllers\\JadwalProduksiController.php', 25, '[\"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Foundation\\\\Bootstrap\\\\HandleExceptions.php:258 (handleError)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\app\\\\Http\\\\Controllers\\\\JadwalProduksiController.php:25 ({closure:Illuminate\\\\Foundation\\\\Bootstrap\\\\HandleExceptions::forwardsTo():257})\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Routing\\\\ControllerDispatcher.php:46 (index)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Routing\\\\Route.php:265 (dispatch)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Routing\\\\Route.php:211 (runController)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Routing\\\\Router.php:822 (run)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Pipeline\\\\Pipeline.php:180 ({closure:Illuminate\\\\Routing\\\\Router::runRouteWithinStack():821})\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\app\\\\Http\\\\Middleware\\\\RoleMiddleware.php:27 ({closure:Illuminate\\\\Pipeline\\\\Pipeline::prepareDestination():178})\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Pipeline\\\\Pipeline.php:219 (handle)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\app\\\\Http\\\\Middleware\\\\ApiRequestLogMiddleware.php:25 ({closure:{closure:Illuminate\\\\Pipeline\\\\Pipeline::carry():194}:195})\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Pipeline\\\\Pipeline.php:219 (handle)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Routing\\\\Middleware\\\\SubstituteBindings.php:50 ({closure:{closure:Illuminate\\\\Pipeline\\\\Pipeline::carry():194}:195})\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Pipeline\\\\Pipeline.php:219 (handle)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Auth\\\\Middleware\\\\Authenticate.php:63 ({closure:{closure:Illuminate\\\\Pipeline\\\\Pipeline::carry():194}:195})\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Pipeline\\\\Pipeline.php:219 (handle)\"]', '{\"tanggal\": \"2026-05-26\"}', 0, '2026-05-26 11:38:53'),
(11, 1, '127.0.0.1', 'GET', 'http://localhost:8000/api/staff/jadwal-produksi?tanggal=2026-05-26', 'ErrorException', 'Attempt to read property \"id\" on null', 'C:\\Users\\gilan\\files\\Foodcraft\\BE-FoodCraft\\app\\Http\\Controllers\\JadwalProduksiController.php', 25, '[\"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Foundation\\\\Bootstrap\\\\HandleExceptions.php:258 (handleError)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\app\\\\Http\\\\Controllers\\\\JadwalProduksiController.php:25 ({closure:Illuminate\\\\Foundation\\\\Bootstrap\\\\HandleExceptions::forwardsTo():257})\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Routing\\\\ControllerDispatcher.php:46 (index)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Routing\\\\Route.php:265 (dispatch)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Routing\\\\Route.php:211 (runController)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Routing\\\\Router.php:822 (run)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Pipeline\\\\Pipeline.php:180 ({closure:Illuminate\\\\Routing\\\\Router::runRouteWithinStack():821})\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\app\\\\Http\\\\Middleware\\\\RoleMiddleware.php:27 ({closure:Illuminate\\\\Pipeline\\\\Pipeline::prepareDestination():178})\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Pipeline\\\\Pipeline.php:219 (handle)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\app\\\\Http\\\\Middleware\\\\ApiRequestLogMiddleware.php:25 ({closure:{closure:Illuminate\\\\Pipeline\\\\Pipeline::carry():194}:195})\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Pipeline\\\\Pipeline.php:219 (handle)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Routing\\\\Middleware\\\\SubstituteBindings.php:50 ({closure:{closure:Illuminate\\\\Pipeline\\\\Pipeline::carry():194}:195})\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Pipeline\\\\Pipeline.php:219 (handle)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Auth\\\\Middleware\\\\Authenticate.php:63 ({closure:{closure:Illuminate\\\\Pipeline\\\\Pipeline::carry():194}:195})\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Pipeline\\\\Pipeline.php:219 (handle)\"]', '{\"tanggal\": \"2026-05-26\"}', 0, '2026-05-26 11:38:53'),
(12, 1, '127.0.0.1', 'POST', 'http://localhost:8000/api/owner/umkm', 'Illuminate\\Database\\QueryException', 'SQLSTATE[42S22]: Column not found: 1054 Unknown column \'profile\' in \'field list\' (Connection: mysql, Host: 127.0.0.1, Port: 3306, Database: be_foodcraft, SQL: insert into `umkms` (`name`, `description`, `address`, `phone`, `owner_id`, `profile`, `updated_at`, `created_at`) values (manut, nyennii, ngawi, ?, 1, ?, 2026-05-26 11:41:50, 2026-05-26 11:41:50))', 'C:\\Users\\gilan\\files\\Foodcraft\\BE-FoodCraft\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php', 838, '[\"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Database\\\\Connection.php:794 (runQueryCallback)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Database\\\\MySqlConnection.php:42 (run)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Database\\\\Query\\\\Processors\\\\MySqlProcessor.php:35 (insert)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Database\\\\Query\\\\Builder.php:4140 (processInsertGetId)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Database\\\\Eloquent\\\\Builder.php:2235 (insertGetId)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Database\\\\Eloquent\\\\Model.php:1436 (__call)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Database\\\\Eloquent\\\\Model.php:1401 (insertAndSetId)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Database\\\\Eloquent\\\\Model.php:1240 (performInsert)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Database\\\\Eloquent\\\\Builder.php:1219 (save)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Support\\\\helpers.php:388 ({closure:Illuminate\\\\Database\\\\Eloquent\\\\Builder::create():1218})\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Database\\\\Eloquent\\\\Builder.php:1218 (tap)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Support\\\\Traits\\\\ForwardsCalls.php:23 (create)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Database\\\\Eloquent\\\\Model.php:2540 (forwardCallTo)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Database\\\\Eloquent\\\\Model.php:2556 (__call)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\app\\\\Http\\\\Controllers\\\\UmkmController.php:39 (__callStatic)\"]', '{\"name\": \"manut\", \"phone\": null, \"address\": \"ngawi\", \"description\": \"nyennii\"}', 0, '2026-05-26 11:41:50'),
(13, 1, '127.0.0.1', 'POST', 'http://localhost:8000/api/owner/umkm', 'Illuminate\\Database\\QueryException', 'SQLSTATE[42S22]: Column not found: 1054 Unknown column \'profile\' in \'field list\' (Connection: mysql, Host: 127.0.0.1, Port: 3306, Database: be_foodcraft, SQL: insert into `umkms` (`name`, `description`, `address`, `phone`, `owner_id`, `profile`, `updated_at`, `created_at`) values (manut, nyennii, ngawi, ?, 1, ?, 2026-05-26 11:41:54, 2026-05-26 11:41:54))', 'C:\\Users\\gilan\\files\\Foodcraft\\BE-FoodCraft\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php', 838, '[\"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Database\\\\Connection.php:794 (runQueryCallback)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Database\\\\MySqlConnection.php:42 (run)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Database\\\\Query\\\\Processors\\\\MySqlProcessor.php:35 (insert)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Database\\\\Query\\\\Builder.php:4140 (processInsertGetId)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Database\\\\Eloquent\\\\Builder.php:2235 (insertGetId)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Database\\\\Eloquent\\\\Model.php:1436 (__call)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Database\\\\Eloquent\\\\Model.php:1401 (insertAndSetId)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Database\\\\Eloquent\\\\Model.php:1240 (performInsert)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Database\\\\Eloquent\\\\Builder.php:1219 (save)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Support\\\\helpers.php:388 ({closure:Illuminate\\\\Database\\\\Eloquent\\\\Builder::create():1218})\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Database\\\\Eloquent\\\\Builder.php:1218 (tap)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Support\\\\Traits\\\\ForwardsCalls.php:23 (create)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Database\\\\Eloquent\\\\Model.php:2540 (forwardCallTo)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Database\\\\Eloquent\\\\Model.php:2556 (__call)\", \"C:\\\\Users\\\\gilan\\\\files\\\\Foodcraft\\\\BE-FoodCraft\\\\app\\\\Http\\\\Controllers\\\\UmkmController.php:39 (__callStatic)\"]', '{\"name\": \"manut\", \"phone\": null, \"address\": \"ngawi\", \"description\": \"nyennii\"}', 0, '2026-05-26 11:41:54');

-- --------------------------------------------------------

--
-- Table structure for table `umkms`
--

CREATE TABLE `umkms` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `address` text COLLATE utf8mb4_unicode_ci,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `profile` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `owner_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `umkms`
--

INSERT INTO `umkms` (`id`, `name`, `description`, `address`, `phone`, `profile`, `owner_id`, `created_at`, `updated_at`) VALUES
(1, 'manut', 'nyenii', 'ngawi', NULL, 'umkm_profiles/HHCK4esqXOFSc9kYdqhCyZnGRZ4ANOqkltWlT12C.jpg', 1, '2026-05-26 04:44:33', '2026-05-30 05:02:30');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('super_admin','owner','staff') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'staff',
  `umkm_id` bigint UNSIGNED DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `avatar`, `password`, `role`, `umkm_id`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'tch', 'gsptra77@gmail.com', NULL, '$2y$12$suW5eC15Dke.aAWTFifBM.PX6c5X69PWMtXGi0R/F7p2.xFVpGFLi', 'owner', NULL, NULL, '2026-05-25 22:12:46', '2026-05-25 22:12:46'),
(2, 'tch', 'zerodekawa@gmail.com', NULL, '$2y$12$mwg3fy064b/AofEYNeV/cuMz6ecIp8cMhZ5tV55/zFb1TYbTs1xk.', 'owner', NULL, NULL, '2026-05-30 03:28:48', '2026-05-30 03:28:48'),
(3, 'tch', 'manut@gmail.com', NULL, '$2y$12$WlZdhh7H7zgbDVeUNhYVu.niMyL/cfjlhu0ns6thnueeUcbOsK2Le', 'owner', NULL, NULL, '2026-05-30 04:12:11', '2026-05-30 04:12:11');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_log`
--
ALTER TABLE `activity_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `subject` (`subject_type`,`subject_id`),
  ADD KEY `causer` (`causer_type`,`causer_id`),
  ADD KEY `activity_log_log_name_index` (`log_name`);

--
-- Indexes for table `api_request_logs`
--
ALTER TABLE `api_request_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `api_request_logs_user_id_foreign` (`user_id`);

--
-- Indexes for table `bahan_bakus`
--
ALTER TABLE `bahan_bakus`
  ADD PRIMARY KEY (`id`),
  ADD KEY `bahan_bakus_umkm_id_foreign` (`umkm_id`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `jadwal_produksis`
--
ALTER TABLE `jadwal_produksis`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jadwal_produksis_umkm_id_foreign` (`umkm_id`),
  ADD KEY `jadwal_produksis_pesanan_id_foreign` (`pesanan_id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_reserved_at_available_at_index` (`queue`,`reserved_at`,`available_at`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `pengaturan_kapasitas`
--
ALTER TABLE `pengaturan_kapasitas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `pengaturan_kapasitas_umkm_id_unique` (`umkm_id`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indexes for table `pesanans`
--
ALTER TABLE `pesanans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pesanans_umkm_id_foreign` (`umkm_id`);

--
-- Indexes for table `pesanan_items`
--
ALTER TABLE `pesanan_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pesanan_items_pesanan_id_foreign` (`pesanan_id`),
  ADD KEY `pesanan_items_produk_id_foreign` (`produk_id`);

--
-- Indexes for table `produks`
--
ALTER TABLE `produks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `produks_umkm_id_foreign` (`umkm_id`);

--
-- Indexes for table `resep_produks`
--
ALTER TABLE `resep_produks`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `resep_produks_produk_id_bahan_baku_id_unique` (`produk_id`,`bahan_baku_id`),
  ADD KEY `resep_produks_bahan_baku_id_foreign` (`bahan_baku_id`);

--
-- Indexes for table `riwayat_keterlambatans`
--
ALTER TABLE `riwayat_keterlambatans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `riwayat_keterlambatans_umkm_id_foreign` (`umkm_id`),
  ADD KEY `riwayat_keterlambatans_pesanan_id_foreign` (`pesanan_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `system_errors`
--
ALTER TABLE `system_errors`
  ADD PRIMARY KEY (`id`),
  ADD KEY `system_errors_user_id_foreign` (`user_id`);

--
-- Indexes for table `umkms`
--
ALTER TABLE `umkms`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `umkms_owner_id_unique` (`owner_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_log`
--
ALTER TABLE `activity_log`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `api_request_logs`
--
ALTER TABLE `api_request_logs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=273;

--
-- AUTO_INCREMENT for table `bahan_bakus`
--
ALTER TABLE `bahan_bakus`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jadwal_produksis`
--
ALTER TABLE `jadwal_produksis`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `pengaturan_kapasitas`
--
ALTER TABLE `pengaturan_kapasitas`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `pesanans`
--
ALTER TABLE `pesanans`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pesanan_items`
--
ALTER TABLE `pesanan_items`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `produks`
--
ALTER TABLE `produks`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `resep_produks`
--
ALTER TABLE `resep_produks`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `riwayat_keterlambatans`
--
ALTER TABLE `riwayat_keterlambatans`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `system_errors`
--
ALTER TABLE `system_errors`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `umkms`
--
ALTER TABLE `umkms`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `api_request_logs`
--
ALTER TABLE `api_request_logs`
  ADD CONSTRAINT `api_request_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `bahan_bakus`
--
ALTER TABLE `bahan_bakus`
  ADD CONSTRAINT `bahan_bakus_umkm_id_foreign` FOREIGN KEY (`umkm_id`) REFERENCES `umkms` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `jadwal_produksis`
--
ALTER TABLE `jadwal_produksis`
  ADD CONSTRAINT `jadwal_produksis_pesanan_id_foreign` FOREIGN KEY (`pesanan_id`) REFERENCES `pesanans` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `jadwal_produksis_umkm_id_foreign` FOREIGN KEY (`umkm_id`) REFERENCES `umkms` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `pengaturan_kapasitas`
--
ALTER TABLE `pengaturan_kapasitas`
  ADD CONSTRAINT `pengaturan_kapasitas_umkm_id_foreign` FOREIGN KEY (`umkm_id`) REFERENCES `umkms` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `pesanans`
--
ALTER TABLE `pesanans`
  ADD CONSTRAINT `pesanans_umkm_id_foreign` FOREIGN KEY (`umkm_id`) REFERENCES `umkms` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `pesanan_items`
--
ALTER TABLE `pesanan_items`
  ADD CONSTRAINT `pesanan_items_pesanan_id_foreign` FOREIGN KEY (`pesanan_id`) REFERENCES `pesanans` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `pesanan_items_produk_id_foreign` FOREIGN KEY (`produk_id`) REFERENCES `produks` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `produks`
--
ALTER TABLE `produks`
  ADD CONSTRAINT `produks_umkm_id_foreign` FOREIGN KEY (`umkm_id`) REFERENCES `umkms` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `resep_produks`
--
ALTER TABLE `resep_produks`
  ADD CONSTRAINT `resep_produks_bahan_baku_id_foreign` FOREIGN KEY (`bahan_baku_id`) REFERENCES `bahan_bakus` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `resep_produks_produk_id_foreign` FOREIGN KEY (`produk_id`) REFERENCES `produks` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `riwayat_keterlambatans`
--
ALTER TABLE `riwayat_keterlambatans`
  ADD CONSTRAINT `riwayat_keterlambatans_pesanan_id_foreign` FOREIGN KEY (`pesanan_id`) REFERENCES `pesanans` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `riwayat_keterlambatans_umkm_id_foreign` FOREIGN KEY (`umkm_id`) REFERENCES `umkms` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `system_errors`
--
ALTER TABLE `system_errors`
  ADD CONSTRAINT `system_errors_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `umkms`
--
ALTER TABLE `umkms`
  ADD CONSTRAINT `umkms_owner_id_foreign` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
