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

$phone = $data['phone'] ?? '';
$otp = $data['otp'] ?? '';
$password = $data['password'] ?? '';

if($phone == '' || $otp == '' || $password == ''){
    echo json_encode(["status"=>"error", "msg"=>"All fields required"]);
    exit;
}

if (!preg_match('/^[6-9][0-9]{9}$/', $phone)) {
    echo json_encode(["status"=>"error", "msg"=>"Invalid Indian mobile number"]);
    exit;
}

$check = "SELECT * FROM users WHERE phone='$phone' AND otp='$otp'";
$result = $conn->query($check);

if($result->num_rows == 0){
    echo json_encode(["status"=>"error", "msg"=>"Invalid OTP"]);
    exit;
}

$update = "UPDATE users SET password='$password', otp='' WHERE phone='$phone'";

if($conn->query($update)){
    echo json_encode(["status"=>"success", "msg"=>"Password updated successfully"]);
} else {
    echo json_encode(["status"=>"error", "msg"=>"Password update failed"]);
}
?>