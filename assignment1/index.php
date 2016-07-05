<?php

// Load database connection, helpers, etc.
require_once(__DIR__ . '/errors.php');
require_once(__DIR__ . '/include.php');

// Vars
$period = 6; // Life-Time of 12 months
$commission = 0.10; // 10% commission

// Prepare query
// This query returns the following results: the booker id, a month specified by a year-month format, the amount of bookings for that month by that booker and the total turnover for that month by that booker.
//TODO filter out turnover from booked products, as only booked spaces should count towards the LTV
$db_result = $db
    ->prepare('
      SELECT bookers.id AS booker, COUNT(bookings.id) AS booking_count, strftime("%Y-%m", datetime(end_timestamp, "unixepoch")) AS "year_month", SUM(locked_total_price) AS turnover
      FROM bookings
        JOIN bookers ON bookers.id = bookings.booker_id
        JOIN bookingitems ON bookings.id = bookingitems.booking_id
      GROUP BY booker, year_month
      ORDER BY booker, end_timestamp
	')
    ->run();


// Filter out bookings in months beyond the LTV period and put the results in an array
$array = array();
foreach ($db_result as $index => $row) {
    $month_counter = 0;

    array_push($array, array(
        "booker" => $row->booker,
        "booking_count" => $row->booking_count,
        "year_month" => $row->year_month,
        "turnover" => $row->turnover
    ));
    $next_row = $db_result->fetch();

    while ($row->booker == $next_row->booker) {
        // Aggregate the data of this booker if it is still in the Life Time Value period, else skip
        if ($month_counter < $period) {
            $array[$index]["booking_count"] += $next_row->booking_count;
            $array[$index]["turnover"] += $next_row->turnover;
            $month_counter++;
            //FIXME this introduces bugs when the booker skips months!
        }
        $next_row = $db_result->fetch();
    }

    $row = $next_row;
}

// Sort the array by month
usort($array, function ($a, $b) {
    $a = $a['year_month'];
    $b = $b['year_month'];
    if ($a < $b) {
        return -1;
    } else if ($a > $b) {
        return 1;
    } else {
        return 0;
    }
});


// Group the bookers from the same month together
// The result is an array with the booking counts and turnover per month (and all within the LTV period of the bookers that made the bookings/turnover)
$grouped_array = array();
array_push($grouped_array, $array[0]);
foreach ($array as $value) {
    if ($value["year_month"] != $grouped_array[count($grouped_array) - 1]["year_month"]) {
        array_push($grouped_array, $value);
        $grouped_array[count($grouped_array) - 1]["booker_count"] = 1;
    } else {
        $grouped_array[count($grouped_array) - 1]["booking_count"] += $value["booking_count"];

        if (isset($grouped_array[count($grouped_array) - 1]["booker_count"])) {
            $grouped_array[count($grouped_array) - 1]["booker_count"]++;
            $grouped_array[count($grouped_array) - 1]["turnover"] += $value["turnover"];
        } else {
            $grouped_array[count($grouped_array) - 1]["booker_count"] = 1;
        }
    }
}?>

<!doctype html>
<html>
<head>
    <title>Assignment 1: Create a Report (SQL)</title>
    <meta http-equiv="content-type" content="text/html; charset=utf-8"/>
    <style type="text/css">
        .report-table {
            width: 100%;
            border: 1px solid #000000;
        }

        .report-table td,
        .report-table th {
            text-align: left;
            border: 1px solid #000000;
            padding: 5px;
        }

        .report-table .right {
            text-align: right;
        }
    </style>
</head>
<body>
<h1>Report:</h1>
<table class="report-table">
    <thead>
    <tr>
        <th>Start</th>
        <th>Bookers</th>
        <th># of bookings (avg)</th>
        <th>Turnover (avg)</th>
        <th>LTV</th>
    </tr>
    </thead>
    <tbody>
    <?php foreach ($grouped_array as $index => $row): ?>
        <tr>
            <td><?php echo $row["year_month"] ?></td>
            <td><?php echo $row["booker_count"] ?></td>
            <td><?php echo number_format($row["booking_count"] / $row["booker_count"], 1) ?></td>
            <td><?php echo number_format($row["turnover"] / $row["booker_count"], 2) ?></td>
            <td><?php echo number_format(($row["turnover"] / $row["booker_count"]) * $commission, 2) ?></td>
        </tr>
    <?php endforeach; ?>
    </tbody>
    <tfoot>
    <tr>
        <td colspan="4" class="right"><strong>Total rows:</strong></td>
        <td><?= $index + 1 ?></td>
    </tr>
    </tfoot>
</table>
</body>
</html>
