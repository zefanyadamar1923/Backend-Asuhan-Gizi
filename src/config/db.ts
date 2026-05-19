import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

const config: sql.config = {
  user: process.env.DB_USER as string,
  password: process.env.DB_PASS as string,
  server: process.env.DB_SERVER as string,
  database: process.env.DB_NAME as string,
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
  },
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log("✅ Connected to SQL Server");
    return pool;
  })
  .catch((err) => {
    console.error("❌ Database Connection Failed! Bad Config: ", err);
    process.exit(1);
  });

export { sql, poolPromise };
