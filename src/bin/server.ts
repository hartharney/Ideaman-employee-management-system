import app from '../../src/index';
import sequelize from '../../src/database/db';

// instantiate port number
const PORT = process.env.PORT ?? 5000;

// connect to the database
sequelize.sync().then(() => {
    console.log('Database connected');
}
).catch((err : any) => {
    console.log('Error connecting to the database', err?.message);
}
);

// start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}
);