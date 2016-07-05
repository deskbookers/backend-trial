<?php

// Helpers
///////////////////////////////////////////////

/**
 * Safely output plain text in HTML.
 * 
 * @param string $value Plain text
 * @param bool $doubleEncode Double encode the input
 * @return string Safe HTML string
 */
function safe($value, $doubleEncode = true)
{
	return htmlspecialchars( (string) $value, ENT_QUOTES, 'utf-8', $doubleEncode);
}

// Database connection
///////////////////////////////////////////////

/**
 * DatabaseStatement
 * 
 * @author Leon van der Veen <l.vanderveen@deskbookers.com>
 */
class DatabaseStatement extends PDOStatement
{
	/**
	 * Database
	 * 
	 * @var Database
	 */
	protected $db_;

	/**
	 * Constructor
	 * 
	 * @param PDO $pdo
	 */
	protected function __construct(Database $db)
	{
		$this->db_ = $db;
	}

	/**
	 * Database
	 * 
	 * @return Database
	 */
	public function db()
	{
		return $this->db_;
	}

	/**
	 * Bind a param by reference.
	 * 
	 * @param string|int $param
	 * @param mixed& $reference
	 */
	public function bind($param, &$reference, $type = PDO::PARAM_STR)
	{
		$this->bindParam($param, $reference, $type);
		return $this;
	}

	/**
	 * Bind param by value.
	 * 
	 * @param string|int $param
	 * @param mixed $value
	 */
	public function param($param, $value, $type = PDO::PARAM_STR)
	{
		$this->bindValue($param, $value, $type);
		return $this;
	}

	/**
	 * Apply the binded params and execute the query.
	 * 
	 * @return DatabaseStatement Self, now ready for a foreach loop.
	 */
	public function run()
	{
		$this->execute();
		return $this;
	}
}

/**
 * Database
 * 
 * @author Leon van der Veen <l.vanderveen@deskbookers.com>
 */
class Database
{
	/**
	 * Connection
	 * 
	 * @var PDO
	 */
	protected $db_;

	/**
	 * Constructor
	 */
	public function __construct()
	{
		// Open PDO connection
		$this->db_ = new PDO('sqlite:' . __DIR__ . '/db/assignment1.db');

		// Settings
		$this->db_->setAttribute(PDO::ATTR_ERRMODE,            PDO::ERRMODE_EXCEPTION);
		$this->db_->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_OBJ);
		$this->db_->setAttribute(PDO::ATTR_STATEMENT_CLASS,    ['DatabaseStatement', [$this]]);
	}

	/**
	 * Prepare query.
	 * 
	 * @param string $sql
	 * @return DatabaseStatement
	 */
	public function prepare($sql)
	{
		return $this->db_->prepare($sql);
	}

	/**
	 * Run query (with applied data).
	 * 
	 * For example:
	 *   $db->query('SELECT * FROM table WHERE col1 < :val1 AND col2 = :val2', [
	 *       ':val1' => [4, PDO::PARAM_INT], // Set type explicitly
	 *       ':val2' => 'Test', // PARAM_STR by default
	 *   ]);
	 * 
	 * @param string $sql
	 * @param mixed[mixed] $params Params, key/value pairs, to be binded to the query. When the value is an array with length two, the first item will be binded and the second item will be the type.
	 * @return DatabaseStatement A Database Statement object which is directly usable to use in a foreach loop.
	 */
	public function query($sql, array $params = [])
	{
		// Prepare the statement
		$statement = $this->prepare($sql);

		// Bind params
		foreach ($params as $param => &$val)
		{
			if (is_array($val) && count($val) >= 2)
			{
				$statement->bindByRef($param, $val[0], $val[1]);
			}
			else
			{
				$statement->bindByRef($param, $val);
			}
		}

		// Run query
		return $statement->run();
	}
}

// Database instance
$db = new Database();
