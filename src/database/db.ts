// using local

// import { Sequelize } from 'sequelize';

// const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;

// const sequelize = new Sequelize(
//     DB_NAME as string, 
//     DB_USER as string, 
//     DB_PASSWORD as string, 
//     {
//         dialect: 'mysql',
//         host: DB_HOST,
//         port: parseInt(DB_PORT as string),
//         logging: true,
//         dialectOptions: {
//             ssl: {
//                 require: true,
//                 rejectUnauthorized: false
//             }
//         }
//     }
// );


// using remote cockroach db

import { Sequelize } from "sequelize-cockroachdb";

// const { DATABASE_URL } = process.env;
const DATABASE_URL = "postgresql://hart_harney:Rh7Lom7IeISw58FKMfG9eQ@floaty-hacker-1979.j77.cockroachlabs.cloud:26257/idems?sslmode=verify-full";

if (!DATABASE_URL) {
    console.log(DATABASE_URL)
  throw new Error('DATABASE_URL environment variable is not defined');
}

const sequelize = new Sequelize(DATABASE_URL);


export default sequelize;