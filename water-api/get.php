<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include 'db.php';

$user = $_GET['user'];

$sql = "SELECT * FROM water_data WHERE user='$user' ORDER BY id DESC";
$result = $conn->query($sql);

$data = [];

while($row = $result->fetch_assoc()){
    $data[] = $row;
}

echo json_encode($data);
?>