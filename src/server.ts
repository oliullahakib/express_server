import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { Pool } from "pg";
import config from "./config";
const app: Application = express();
const port = config.port;

//middlewaer
app.use(express.json());

const pool = new Pool({
  connectionString: config.connection_string,
});

const dbinit = async () => {
  try {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        age INT,
        is_Active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        );
        `);
    console.log("Database connected successfully");
  } catch (error) {
    console.log(error);
  }
};

dbinit();

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ status: true, message: "Welcome to the server!" });
});

//create user
app.post("/api/v1/users", async (req: Request, res: Response) => {
  try {
    const { name, email, password, age } = req.body;
    const result = await pool.query(
      `
  INSERT INTO users (name,email,password,age) VALUES
  ($1,$2,$3,$4) RETURNING name,email,age
    `,
      [name, email, password, age],
    );
    res.status(201).json({
      status: true,
      message: "Create User Successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({ status: false, message: error.message });
  }
});

//get all users
app.get("/api/v1/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
        SELECT * FROM users
        `);
    res.status(200).json({
      status: true,
      message: "Retrive all users",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({ status: false, message: error.message });
  }
});

//get single user
app.get("/api/v1/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `
        SELECT * FROM users WHERE id = $1
        `,
      [id],
    );
    if (result.rowCount === 0) {
      res.status(404).json({ status: false, message: "User not found!" });
    }
    res.status(200).json({
      status: true,
      message: "Retrive a single user",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({ status: false, message: error.message });
  }
});

//update user
app.put("/api/v1/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, age, password } = req.body;
  try {
    const result = await pool.query(
      `
    UPDATE users
    SET 
    name = COALESCE($1,name),
    email = COALESCE($2,email),
    age = COALESCE($3,age),
    password = COALESCE($4,password),
    updated_at = NOW()
    WHERE id = $5
    RETURNING *
    `,
      [name ?? null, email ?? null, age ?? null, password ?? null, id],
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ status: false, message: "User not found!" });
    }
    res.status(200).json({
      status: true,
      message: "Updated user successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({ status: false, message: error.message });
  }
});

//delete user
app.delete("/api/v1/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `
  DELETE FROM users WHERE id = $1
  `,
      [id],
    );
    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ status: false, message: "User not found!" });
    }
    res.status(200).json({
      status: true,
      message: "Delete user successfully",
    });
  } catch (error: any) {
    res.status(500).json({ status: false, message: error.message });
  }
});
app.listen(port, () => {
  console.log(`server running on port ${config.port}`);
});
