<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
function respond(int $status, string $message): void {
    http_response_code($status);
    echo json_encode(['ok' => $status === 200, 'message' => $message]);
    exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { respond(405, 'Use the contact form to send an enquiry.'); }
if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 16000) { respond(413, 'Your message is too large.'); }
$config = require __DIR__ . '/contact-config.php';
$recipient = $config['recipient'] ?? '';
$sender = $config['sender'] ?? '';
$origin = rtrim($config['site_origin'] ?? '', '/');
if (!filter_var($recipient, FILTER_VALIDATE_EMAIL) || !filter_var($sender, FILTER_VALIDATE_EMAIL) || !preg_match('~^https://[^/]+$~', $origin)) {
    respond(503, 'The contact form is not configured yet. Please use the email link instead.');
}
if (rtrim($_SERVER['HTTP_ORIGIN'] ?? '', '/') !== $origin) { respond(403, 'Please send this message from the portfolio website.'); }
if (!empty($_POST['website'])) { respond(400, 'Please try again using the contact form.'); }
$fields = [];
foreach (['name', 'email', 'project', 'message'] as $key) {
    if (!isset($_POST[$key]) || !is_string($_POST[$key])) { respond(400, 'Please fill in every field.'); }
    $fields[$key] = trim($_POST[$key]);
}
if (strlen($fields['name']) < 1 || strlen($fields['name']) > 100 || strlen($fields['email']) > 254 || !filter_var($fields['email'], FILTER_VALIDATE_EMAIL)) {
    respond(400, 'Please enter a valid name and email address.');
}
if (preg_match('/[\r\n]/', $fields['email']) || preg_match('/[\r\n]/', $sender) || preg_match('/[\r\n]/', $recipient)) { respond(400, 'Invalid email address.'); }
if (!in_array($fields['project'], ['AI film', 'Brand film / ad', 'Editing', 'Something else'], true) || strlen($fields['message']) < 10 || strlen($fields['message']) > 5000) {
    respond(400, 'Choose a project type and write a brief of 10 to 5000 characters.');
}
// IP hashes only, stored outside the public website. Three accepted enquiries per 10 minutes.
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rateFile = sys_get_temp_dir() . '/palash-contact-' . hash('sha256', __DIR__ . '|' . $ip) . '.json';
$handle = @fopen($rateFile, 'c+');
if (!$handle || !flock($handle, LOCK_EX)) { respond(503, 'Please email Palash directly while the form is unavailable.'); }
@chmod($rateFile, 0600);
$history = json_decode(stream_get_contents($handle) ?: '[]', true);
if (!is_array($history)) { $history = []; }
$now = time();
$history = array_values(array_filter($history, static function ($t) use ($now) { return is_int($t) && $t > $now - 600; }));
if (count($history) >= 3) { flock($handle, LOCK_UN); fclose($handle); respond(429, 'Please wait 10 minutes before sending another enquiry.'); }
$subject = 'Portfolio enquiry: ' . $fields['project'];
$body = 'Name: ' . $fields['name'] . "\nEmail: " . $fields['email'] . "\nProject: " . $fields['project'] . "\n\n" . $fields['message'];
$headers = ['From' => $sender, 'Reply-To' => $fields['email'], 'Content-Type' => 'text/plain; charset=UTF-8'];
$sent = function_exists('mail') && @mail($recipient, $subject, $body, $headers);
if ($sent) { $history[] = $now; rewind($handle); ftruncate($handle, 0); fwrite($handle, json_encode($history)); }
flock($handle, LOCK_UN); fclose($handle);
if (!$sent) { respond(503, 'The mail server could not accept this message. Please use the email link instead.'); }
respond(200, 'Your enquiry was accepted by the mail server. Inbox delivery can take a little time.');
