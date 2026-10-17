<?php
/**
 * Hostinger Shared hosting ke liye PHP bootstrap
 * JSON files = database (MySQL/Node/Vercel ki zaroorat nahi)
 */
declare(strict_types=1);

session_name('vh_admin_session');
session_start();

define('VH_ROOT', dirname(__DIR__));
define('VH_DATA', VH_ROOT . '/data');
define('VH_UPLOADS', VH_ROOT . '/uploads');

if (!is_dir(VH_DATA)) mkdir(VH_DATA, 0755, true);
if (!is_dir(VH_UPLOADS)) mkdir(VH_UPLOADS, 0755, true);

function vh_read(string $file, $fallback = []) {
    $path = VH_DATA . '/' . $file;
    if (!is_file($path)) {
        vh_write($file, $fallback);
        return $fallback;
    }
    $fp = fopen($path, 'r');
    if (!$fp) return $fallback;
    flock($fp, LOCK_SH);
    $raw = stream_get_contents($fp);
    flock($fp, LOCK_UN);
    fclose($fp);
    $data = json_decode($raw ?: 'null', true);
    return $data === null ? $fallback : $data;
}

function vh_write(string $file, $data): void {
    $path = VH_DATA . '/' . $file;
    $fp = fopen($path, 'c+');
    if (!$fp) return;
    flock($fp, LOCK_EX);
    ftruncate($fp, 0);
    rewind($fp);
    fwrite($fp, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
    fflush($fp);
    flock($fp, LOCK_UN);
    fclose($fp);
}

function e(?string $s): string {
    return htmlspecialchars((string)$s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function vh_settings(): array {
    $s = vh_read('settings.json', []);
    return is_array($s) ? $s : [];
}

function vh_domain(): string {
    $s = vh_settings();
    $d = trim((string)($s['domain'] ?? ''));
    if ($d === '' || str_contains($d, '[')) {
        $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
            || ((int)($_SERVER['SERVER_PORT'] ?? 80) === 443);
        $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
        $d = ($https ? 'https://' : 'http://') . $host;
    }
    $d = preg_replace('#^http://#', 'https://', $d);
    if (str_contains($d, 'localhost')) {
        $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
        $d = ($https ? 'https://' : 'http://') . ($_SERVER['HTTP_HOST'] ?? 'localhost');
    }
    return rtrim(str_replace('://www.', '://', $d), '/');
}

function vh_canonical(string $path = ''): string {
    $path = preg_replace('#\?.*$#', '', $path);
    $path = trim($path, '/');
    if ($path === '' || $path === 'home') return vh_domain() . '/';
    return vh_domain() . '/' . $path . '/';
}

function vh_path(): string {
    $uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
    $scriptDir = rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '')), '/');
    if ($scriptDir && $scriptDir !== '/' && str_starts_with($uri, $scriptDir)) {
        $uri = substr($uri, strlen($scriptDir)) ?: '/';
    }
    return '/' . trim($uri, '/');
}

function vh_redirects(): array {
    $r = vh_read('redirects.json', []);
    return is_array($r) ? $r : [];
}

function vh_apply_redirects(): void {
    $path = rtrim(vh_path(), '/') . '/';
    if ($path === '//') $path = '/';
    foreach (vh_redirects() as $row) {
        $from = $row['fromPath'] ?? '';
        $to = $row['toPath'] ?? '';
        if ($from && rtrim($from, '/') . '/' === $path && $to) {
            $code = (int)($row['statusCode'] ?? 301);
            if (str_starts_with($to, 'http')) {
                header('Location: ' . $to, true, $code);
            } else {
                header('Location: ' . vh_domain() . '/' . trim($to, '/') . '/', true, $code);
            }
            exit;
        }
    }
}

function vh_csrf_token(): string {
    if (empty($_SESSION['csrf'])) {
        $_SESSION['csrf'] = bin2hex(random_bytes(16));
    }
    return $_SESSION['csrf'];
}

function vh_csrf_ok(): bool {
    $t = $_POST['csrf'] ?? '';
    return is_string($t) && hash_equals($_SESSION['csrf'] ?? '', $t);
}

function vh_slug(string $text): string {
    $text = strtolower(trim($text));
    $text = preg_replace('/[^\p{L}\p{N}\s-]+/u', '', $text);
    $text = preg_replace('/[\s_]+/', '-', $text);
    return trim($text, '-') ?: ('page-' . time());
}

function vh_rate_ok(string $key, int $max = 5, int $window = 900): bool {
    $all = vh_read('ratelimit.json', []);
    $now = time();
    $row = $all[$key] ?? ['count' => 0, 'reset' => $now + $window];
    if ($now > ($row['reset'] ?? 0)) {
        $row = ['count' => 1, 'reset' => $now + $window];
        $all[$key] = $row;
        vh_write('ratelimit.json', $all);
        return true;
    }
    if (($row['count'] ?? 0) >= $max) return false;
    $row['count']++;
    $all[$key] = $row;
    vh_write('ratelimit.json', $all);
    return true;
}

function vh_ensure_admin(): void {
    $users = vh_read('users.json', []);
    if (!empty($users)) return;
    vh_write('users.json', [[
        'id' => 1,
        'email' => 'admin@vrindavanhotel.com',
        'name' => 'Hotel Owner',
        'passwordHash' => password_hash('Vrindavan@123', PASSWORD_DEFAULT),
    ]]);
}

function vh_admin_logged(): bool {
    return !empty($_SESSION['admin_id']);
}

function vh_require_admin(): void {
    if (!vh_admin_logged()) {
        header('Location: ' . vh_base() . '/admin/login/');
        exit;
    }
}

function vh_base(): string {
    $scriptDir = rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '')), '/');
    return $scriptDir === '/' ? '' : $scriptDir;
}

function vh_ip(): string {
    return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
}

vh_ensure_admin();
