CREATE DATABASE IF NOT EXISTS paragraf;
CREATE USER 'paragraf'@'localhost' IDENTIFIED BY 'motdepasse';
GRANT ALL PRIVILEGES ON paragraf . * TO 'paragraf'@'localhost';
FLUSH PRIVILEGES;
