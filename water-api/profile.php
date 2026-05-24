<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include 'db.php';

$user = $_GET['user'] ?? '';

if ($user == '') {
    echo json_encode(["status" => "error", "msg" => "User missing"]);
    exit;
}

$userSql = "SELECT username, phone FROM users WHERE username='$user'";
$userResult = $conn->query($userSql);

if ($userResult->num_rows == 0) {
    echo json_encode(["status" => "error", "msg" => "User not found"]);
    exit;
}

$userRow = $userResult->fetch_assoc();

$totalSql = "SELECT COUNT(*) AS total FROM water_data WHERE user='$user'";
$totalResult = $conn->query($totalSql);
$total = $totalResult->fetch_assoc()['total'];

$goodSql = "SELECT COUNT(*) AS good FROM water_data WHERE user='$user' AND quality='Good'";
$goodResult = $conn->query($goodSql);
$good = $goodResult->fetch_assoc()['good'];

$poorSql = "SELECT COUNT(*) AS poor FROM water_data WHERE user='$user' AND quality='Poor'";
$poorResult = $conn->query($poorSql);
$poor = $poorResult->fetch_assoc()['poor'];

echo json_encode([
    "status" => "success",
    "username" => $userRow['username'],
    "phone" => $userRow['phone'],
    "totalRecords" => $total,
    "goodWater" => $good,
    "poorWater" => $poor
]);

?>