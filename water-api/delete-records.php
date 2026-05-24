<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include 'db.php';

$id = $_GET['id'] ?? '';

if($id == ''){
    echo json_encode([
        "status" => "error",
        "msg" => "Missing ID"
    ]);
    exit;
}

$id = intval($id);

$sql = "DELETE FROM water_data WHERE id = $id";

if($conn->query($sql)){
    echo json_encode([
        "status" => "success",
        "deleted_id" => $id
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "msg" => $conn->error
    ]);
}
?>