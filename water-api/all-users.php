<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include 'db.php';

$users = [];

$q = $conn->query("
  SELECT id, username, phone, role
  FROM users
  WHERE deleted = 0
  ORDER BY id DESC
");

while($row = $q->fetch_assoc()){
  $users[] = $row;
}

echo json_encode($users);

?>