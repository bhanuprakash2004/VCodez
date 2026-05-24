<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include 'db.php';

$id = $_GET['id'] ?? '';

if($id == ''){
    echo json_encode([
        "status" => "error",
        "msg" => "User id missing"
    ]);
    exit;
}

$sql = "UPDATE users SET deleted = 0 WHERE id='$id'";

if($conn->query($sql)){
    echo json_encode([
        "status" => "success",
        "msg" => "User restored successfully"
    ]);
}else{
    echo json_encode([
        "status" => "error",
        "msg" => $conn->error
    ]);
}

?>