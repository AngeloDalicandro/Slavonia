const { Client } = require('pg');

const client = new Client({
  user: 'slavo', 
  host: 'localhost', 
  database: 'slavocchia', 
  password: 'vivaslavonia', 
  port: 5432, 
});

const createTablesQuery = `

  CREATE TYPE gender_enum AS ENUM ('male', 'female');
  CREATE TYPE type_enum AS ENUM ('Cena Grande', 'Alta Dieta');

  -- Create table: slavo
  CREATE TABLE IF NOT EXISTS slavo (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    alias VARCHAR(100) NOT NULL,
    city VARCHAR(100),
    email VARCHAR(255),
    gender gender_enum,
    phone_number VARCHAR(15),
    alive BOOLEAN NOT NULL DEFAULT TRUE
  );

  -- Create table: carica
  CREATE TABLE IF NOT EXISTS carica (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    number INT NOT NULL,
    official BOOLEAN NOT NULL -- Required boolean column
  );

  -- Create table: cena
  CREATE TABLE IF NOT EXISTS cena (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    type type_enum
  );

  -- Create table: presenze (join table)
  CREATE TABLE IF NOT EXISTS presenze (
    id SERIAL PRIMARY KEY,
    slavo_id INT NOT NULL REFERENCES slavo(id) ON DELETE CASCADE,
    carica_id INT NOT NULL REFERENCES carica(id) ON DELETE CASCADE,
    cena_id INT NOT NULL REFERENCES cena(id) ON DELETE CASCADE
  );
`;

const seedDataQuery = `
  -- Seed slavo table
  INSERT INTO slavo (firstname, lastname, alias, city, email, gender, phone_number)
  VALUES
    ('John', 'Doe', 'JD', 'New York', 'john.doe@example.com', 'male', '123-456-7890'),
    ('Jane', 'Smith', 'JSmith', 'Los Angeles', 'jane.smith@example.com', 'female', '987-654-3210'),
    ('Chris', 'Johnson', 'CJ', 'Chicago', 'chris.johnson@example.com', 'male', '555-123-4567'),
    ('Emily', 'Davis', 'ED', 'Houston', 'emily.davis@example.com', 'female', '444-555-6666');

  -- Seed carica table
  INSERT INTO carica (name, number, official)
  VALUES
    ('Manager', 1, true),
    ('Assistant', 2, true),
    ('Coordinator', 3, false);

  -- Seed cena table
  INSERT INTO cena (date, type)
  VALUES
    ('2024-12-25', 'Cena Grande'),
    ('2024-12-31', 'Alta Dieta');

  -- Seed presenze table
  INSERT INTO presenze (slavo_id, carica_id, cena_id)
  VALUES
    (1, 1, 1), -- John is Manager at Cena Grande
    (2, 2, 1), -- Jane is Assistant at Cena Grande
    (3, 3, 2), -- Chris is Coordinator at Alta Dieta
    (4, 2, 2); -- Emily is Assistant at Alta Dieta
`;

const seedDatabase = async () => {
  try {
    await client.connect();
    console.log('Connected to the database.');

    console.log('Creating tables...');
    await client.query(createTablesQuery);
    console.log('Tables created successfully.');

    console.log('Seeding data...');
    await client.query(seedDataQuery);
    console.log('Data seeded successfully.');
  } catch (error) {
    console.error('Error while seeding the database:', error.message);
  } finally {
    await client.end();
    console.log('Database connection closed.');
  }
};

seedDatabase();
