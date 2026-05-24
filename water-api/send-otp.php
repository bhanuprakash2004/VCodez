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

if ($phone == '') {
    echo json_encode([
        "status" => "error",
        "msg" => "Phone number required"
    ]);
    exit;
}

if (!preg_match('/^[6-9][0-9]{9}$/', $phone)) {
    echo json_encode([
        "status" => "error",
        "msg" => "Invalid Indian mobile number"
    ]);
    exit;
}

/* CHECK USER */

$check = "SELECT * FROM users WHERE phone='$phone'";
$result = $conn->query($check);

if ($result->num_rows == 0) {
    echo json_encode([
        "status" => "error",
        "msg" => "Phone number not registered"
    ]);
    exit;
}

/* GENERATE OTP */

$otp = rand(100000, 999999);

/* SAVE OTP */

$update = "UPDATE users SET otp='$otp' WHERE phone='$phone'";

if (!$conn->query($update)) {
    echo json_encode([
        "status" => "error",
        "msg" => "Failed to save OTP"
    ]);
    exit;
}

/* MSG91 */

$authKey = "518403TwxfY8s76a0da147P1";

$template_id = "6a0da3422768e49a690efaa2";

$mobile = "91" . $phone;

$url = "https://api.msg91.com/api/v5/otp?template_id=$template_id&mobile=$mobile&otp=$otp";

$curl = curl_init();

curl_setopt_array($curl, array(
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => "",
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => "POST",
    CURLOPT_HTTPHEADER => array(
        "authkey: $authKey"
    ),
));
$response = curl_exec($curl);
$error = curl_error($curl);
$httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

curl_close($curl);

if ($error) {
    echo json_encode([
        "status" => "error",
        "msg" => $error
    ]);
    exit;
}

$decodedResponse = json_decode($response, true);

echo json_encode([
    "status" => "success",
    "msg" => "OTP sent successfully"
]);

?>