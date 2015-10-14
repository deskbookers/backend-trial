<?php

// Max time
set_time_limit(0);
ini_set('memory_limit', '1024M');

// Error reporting
error_reporting(-1);
ini_set('display_errors', 1);

// Handle errors as exceptions
function errorToExceptionHandler($errno, $errstr, $errfile, $errline)
{
	throw new ErrorException($errstr, $errno, 1, $errfile, $errline);
}
function fatalErrorHandler()
{
	$error = error_get_last();
	if ($error !== null)
	{
		errorToExceptionHandler($error['type'], $error['message'], $error['file'], $error['line']);
	}
}
function uncaughtExceptionHandler(Exception $exception)
{
	echo '<pre>'
		. 'ERROR: ' . $exception->getMessage() . ' :: ' . $exception->getCode() . "\n"
		. 'In ' . $exception->getFile() . ':' . $exception->getLine() . "\n"
		. '-------------------------------------------------------------------------------------------------------' . "\n"
		. $exception->getTraceAsString()
		. '</pre>';
}
register_shutdown_function('fatalErrorHandler');
set_exception_handler('uncaughtExceptionHandler');
set_error_handler('errorToExceptionHandler');
