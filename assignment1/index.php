<?php

// Load database connection, helpers, etc.
require_once(__DIR__ . '/errors.php');
require_once(__DIR__ . '/include.php');

// Prepare query
$result = $db
	->prepare('
		SELECT venues.name AS venue_name, items.name AS item_name, bookingitems.locked_total_price AS price, (users.first_name || \' \' || users.last_name) AS name
		FROM bookingitems
		JOIN items ON items.id = bookingitems.item_id
		JOIN venues ON venues.id = items.venue_id
		JOIN bookings ON bookings.id = bookingitems.booking_id
		JOIN bookers ON bookers.id = bookings.booker_id
		JOIN users ON users.id = bookers.user_id
	')
	->run()
;
?>
<!doctype html>
<html>
	<head>
		<title>Assignment 1: Create a Report (SQL)</title>
		<meta http-equiv="content-type" content="text/html; charset=utf-8" />
		<style type="text/css">
			.report-table
			{
				width: 100%;
				border: 1px solid #000000;
			}
			.report-table td,
			.report-table th
			{
				text-align: left;
				border: 1px solid #000000;
				padding: 5px;
			}
			.report-table .right
			{
				text-align: right;
			}
		</style>
	</head>
	<body>
		<h1>Report:</h1>
		<table class="report-table">
			<thead>
				<tr>
					<th>Venue</th>
					<th>Item</th>
					<th class="right">Price</th>
					<th>Name</th>
				</tr>
			</thead>
			<tbody>
				<?php foreach ($result as $index => $row): ?>
					<tr>
						<td><?= safe($row->venue_name) ?></td>
						<td><?= safe($row->item_name) ?></td>
						<td class="right"><?= safe(number_format($row->price, 2)) ?></td>
						<td><?= safe($row->name) ?></td>
					</tr>
				<?php endforeach; ?>
			</tbody>
			<tfoot>
				<tr>
					<td colspan="3" class="right">Total rows:</td>
					<td><?= $index + 1 ?></td>
				</tr>
			</tfoot>
		</table>
	</body>
</html>