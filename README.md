# GenieCodes

Welcome to the **GenieCodes** project! This repository contains code and resources for [brief description of the project].

## Features

- [Feature 1]
- [Feature 2]
- [Feature 3]

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/GenieCodes.git
    ```
2. Navigate to the project directory:
    ```bash
    cd GenieCodes
    ```
3. Install dependencies:
    ```bash
    [insert installation command]
    ```

## Usage

Run the following command to start the project:
```bash
[insert usage command]
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch:
    ```bash
    git checkout -b feature-name
    ```
3. Commit your changes:
    ```bash
    git commit -m "Add feature-name"
    ```
4. Push to the branch:
    ```bash
    git push origin feature-name
    ```
5. Open a pull request.

## Contact

For questions or feedback, please contact sdofficial247@gmail.com.

APIs

User APIs 
POST- Sign up - /users/register
POST- Log In- /users/login
GET- Get Profile details- /users/profile
GET- Logout- /users/logout
GET- Get All Users- /users/all-users

Project APIs

POST - Create Project(By authenticated user)- /projects/create
Get All Project (Created by the user) - /projects/all
PUT- Add user to existing project - /projects/add-user (pass a json body request of
{
    "projectId": "allreadycreatedprojectibytheauthenticateduser"
    "users": ["existinguseridwhoisnotpartofproject"]
}

)
GET- Get Project by ID- /projects/get-project/<pass the actual project id>
