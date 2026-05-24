<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include 'db.php';

$totalUsers = 0;
$totalRecords = 0;
$goodWater = 0;
$moderateWater = 0;
$poorWater = 0;
$userStats = [];

$q1 = $conn->query("
  SELECT COUNT(*) as total 
  FROM users 
  WHERE role='user' 
  AND deleted = 0
");
$totalUsers = $q1->fetch_assoc()['total'];

$q2 = $conn->query("
  SELECT COUNT(water_data.id) as total
  FROM water_data
  INNER JOIN users 
  ON users.username = water_data.user
  WHERE users.deleted = 0
");
$totalRecords = $q2->fetch_assoc()['total'];

$q3 = $conn->query("
  SELECT COUNT(water_data.id) as total
  FROM water_data
  INNER JOIN users 
  ON users.username = water_data.user
  WHERE water_data.quality='Good'
  AND users.deleted = 0
");
$goodWater = $q3->fetch_assoc()['total'];

$q4 = $conn->query("
  SELECT COUNT(water_data.id) as total
  FROM water_data
  INNER JOIN users 
  ON users.username = water_data.user
  WHERE water_data.quality='Moderate'
  AND users.deleted = 0
");
$moderateWater = $q4->fetch_assoc()['total'];

$q5 = $conn->query("
  SELECT COUNT(water_data.id) as total
  FROM water_data
  INNER JOIN users 
  ON users.username = water_data.user
  WHERE water_data.quality='Poor'
  AND users.deleted = 0
");
$poorWater = $q5->fetch_assoc()['total'];

$q6 = $conn->query("
  SELECT
    users.username AS user,
    COUNT(water_data.id) AS totalRecords,
    SUM(CASE WHEN water_data.quality='Good' THEN 1 ELSE 0 END) AS goodCount,
    SUM(CASE WHEN water_data.quality='Moderate' THEN 1 ELSE 0 END) AS moderateCount,
    SUM(CASE WHEN water_data.quality='Poor' THEN 1 ELSE 0 END) AS poorCount
  FROM users
  LEFT JOIN water_data
  ON users.username = water_data.user
  WHERE users.deleted = 0
  AND users.role = 'user'
  GROUP BY users.username
  ORDER BY totalRecords DESC
");

while($row = $q6->fetch_assoc()){
  $userStats[] = $row;
}

echo json_encode([
  "totalUsers" => $totalUsers,
  "totalRecords" => $totalRecords,
  "goodWater" => $goodWater,
  "moderateWater" => $moderateWater,
  "poorWater" => $poorWater,
  "userStats" => $userStats
]);

?>