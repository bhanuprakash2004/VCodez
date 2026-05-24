<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

include 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$data = json_decode(file_get_contents("php://input"), true);

if(!$data){
    echo json_encode([
        "status"=>"error",
        "msg"=>"No data received"
    ]);
    exit;
}

$username = $data['username'] ?? '';
$phone = $data['phone'] ?? '';
$password = $data['password'] ?? '';
$secretCode = $data['secretCode'] ?? '';

if($username == '' || $phone == '' || $password == ''){
    echo json_encode([
        "status"=>"error",
        "msg"=>"All required fields must be filled"
    ]);
    exit;
}

if (!preg_match('/^[6-9][0-9]{9}$/', $phone)) {
    echo json_encode([
        "status"=>"error",
        "msg"=>"Invalid Indian mobile number"
    ]);
    exit;
}

if($secretCode === "Admin#119"){
    $role = "admin";
} else {
    $role = "user";
}

$checkUser = "
SELECT * FROM users
WHERE username='$username'
AND role='$role'
";

$userResult = $conn->query($checkUser);

if($userResult->num_rows > 0){

    echo json_encode([
        "status"=>"exists"
    ]);

    exit;
}

$checkPhone = "SELECT * FROM users WHERE phone='$phone'";
$phoneResult = $conn->query($checkPhone);

if($phoneResult->num_rows > 0){
    echo json_encode(["status"=>"phone_exists"]);
    exit;
}

$sql = "INSERT INTO users 
(username, phone, password, role, otp, deleted)
VALUES 
('$username','$phone','$password','$role','','0')";

if($conn->query($sql)){
    echo json_encode([
        "status"=>"success",
        "role"=>$role
    ]);
} else {
    echo json_encode([
        "status"=>"error",
        "msg"=>$conn->error
    ]);
}

?>