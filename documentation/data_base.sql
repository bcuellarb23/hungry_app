
CREATE TABLE users (
    id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    age SMALLINT UNSIGNED NOT NULL,
    gender ENUM('male', 'female', 'other') NOT NULL,
    weight DECIMAL(5,2) NOT NULL,
    height DECIMAL(5,2) NOT NULL
 );
 
CREATE TABLE nutrition_data (
   product_id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
   product_name varchar(255) NOT NULL UNIQUE,
   calories_per_100g DECIMAL(6,2) not null,
   protein_per_100g DECIMAL(6,2) not null,
   carbs_per_100g DECIMAL(6,2) not null,
   fats_per_100g DECIMAL(6,2) not null
 ); 

CREATE TABLE login (
   user_id INT UNSIGNED PRIMARY KEY,
   email VARCHAR(100) NOT NULL UNIQUE,
   password_hash VARCHAR(255) NOT NULL,
   created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
   FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE user_metrics_history (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNSIGNED NOT NULL,
    tdee DECIMAL(6,2) NOT NULL,
    max_protein DECIMAL(6,2) NOT NULL,
    max_carbs DECIMAL(6,2) NOT NULL,
    max_fats DECIMAL(6,2) NOT NULL,
    activity ENUM('sedentary','light', 'moderate', 'active', 'very-active') NOT NULL,
    goals ENUM('weight-loss', 'nuscle-gain', 'maintenance') NOT NULL,
    difficulty ENUM('beginner', 'intermediate', 'advanced') NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
 );

CREATE TABLE food_entries (
   entry_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
   user_id INT UNSIGNED NOT NULL,
   product_id INT UNSIGNED NOT NULL,
   serving_size DECIMAL(5,2) NOT NULL,
   entry_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
   FOREIGN KEY (user_id) REFERENCES users(id),
   FOREIGN KEY (product_id) REFERENCES nutrition_data(product_id)
); 


