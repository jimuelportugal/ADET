-- Added two new colum: borrowed_book and borrow_status
-- burrow_book: store the title of a book
-- borrow_status: if the user returned the book(Default "TRUE" if no book is borrowed)

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    refresh_token VARCHAR(255),
    borrowed_book VARCHAR(255) DEFAULT 'None',  
    borrow_status BOOLEAN DEFAULT TRUE,         
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE positions (
    position_id INT AUTO_INCREMENT PRIMARY KEY,
    position_code VARCHAR(100) NOT NULL UNIQUE,
    position_name VARCHAR(300) NOT NULL UNIQUE,
    id INT NOT NULL,
    FOREIGN KEY (id) REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
