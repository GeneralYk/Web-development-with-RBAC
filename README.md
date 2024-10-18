Overview

This project is a simple two-page website that allows users to browse, select, and manage postcodes. The website includes a unique design and implements user authentication, role-based access control (RBAC), and distance calculation between postcodes based on a spherical Earth model.
Features

    Postcode List: Displays a list of valid postcodes.
    Postcode Information: Users can view detailed information about a selected postcode.
    Distance Calculation: Users can select two postcodes and calculate the distance between them in miles.
    User Authentication: Only authenticated users can add, edit, or remove postcodes from the list.
    RBAC: Role-Based Access Control ensures that only authorized users can modify the postcode list.
    Persistent Data: Postcodes are stored in a database, and the list persists across sessions.
    Unique Design: Custom user interface design for a user-friendly experience.

Tech Stack

    Frontend: HTML, CSS, JavaScript
    Backend: PHP
    Database: MySQL
    Authentication: PHP Sessions / JWT (optional)
    Distance Calculation: Custom formula for spherical distance between postcodes
