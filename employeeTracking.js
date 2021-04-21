const mysql = require('mysql');
const inquirer = require('inquirer');
const util = require("util");

// create the connection information for the sql database
const connection = mysql.createConnection({
    host: 'localhost',
    // Your port; if not 3306
    port: 3306,
    // Your username
    user: 'root',
    // Your password
    password: 'Chessie1!',
    database: 'employee_DB',
});

connection.promisifiedQuery = util.promisify(connection.query);

const employeeTrack = () => {
    inquirer
        .prompt({
            name: 'action',
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                'View all Employees',
                'View all Employees by Manager',
                'Add Employee',
                'Remove Employee',
                'Update Role',
                'Update Employee Manager',
                'View Roles',
                'Add Role',
                'Remove Role',
                'View Departments',
                'Add Departments',
                'Remove Departments'
            ]
        })
        .then((answer) => {
            console.log(answer.action);
            switch (answer.action) {
                case 'View all Employees':
                    viewEmployees();
                    break;
                case 'Add Employee':
                    addEmployee();
                    break;
                case 'Remove Employee':
                    removeEmployee();
                    break;
                case 'Update Role':
                    updateRole();
                    break;
                    //     case 'Update Manager':
                    //         updateManager();
                case 'View Roles':
                    viewRoles();
                    break;
                case 'Add Role':
                    addRole();
                    break;
                case 'Remove Role':
                    removeRole();
                    break;
                case 'View Departments':
                    viewDepartments();
                    break;
                case 'Add Departments':
                    addDepartment();
                    break;
                    // case 'Remove Departments':
                    //     removeDepartments();
                    //     break;
                default:
                    console.log(`Invalid action: ${answer.action}`);
                    break;
            }
        })
}
const viewEmployees = () => {
    connection.query(
        'select a.id, a.first_name, a.last_name, title, department_id, salary, d.concatName from employee_db.employee a left join employee_db.role b on a.role_id=b.id left join employee_db.department c on b.department_id=c.id left join ( select a.first_name, a.last_name, concat(b.first_name,b.last_name) as concatName, a.manager_id,a.id from employee_db.employee a inner join employee_db.employee b on a.manager_id=b.id) d on a.id =d.id',
        (err, res) => {
            if (err) throw err;
            console.table(res);
            employeeTrack();
        })
}
const viewRoles = () => {
    connection.query(
        'select * from role',
        (err, res) => {
            if (err) throw err;
            console.table(res);
            employeeTrack();
        })
}

const viewDepartments = () => {
    connection.query(
        'select * from department',
        (err, res) => {
            if (err) throw err;
            console.table(res);
            employeeTrack();
        })
}

const addEmployee = () => {
    connection.query("SELECT id, title FROM role", (err, res) => {
        if (err) throw err;
        const role = res.map((role) => {
            return {
                name: role.title,
                value: role.id,
            };
        });
        inquirer
            .prompt([{
                    name: "first_name",
                    type: "input",
                    message: "What is their first name:",
                },
                {
                    name: "last_name",
                    type: "input",
                    message: "What is their last name:",
                },
                {
                    name: "role",
                    type: "list",
                    message: "What is their role:",
                    choices: role,
                },
                {
                    name: "manager",
                    type: "input",
                    message: "Who is their manager(id format):",
                },
            ])
            .then((answers) => {
                connection.query(
                    `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${answers.first_name}", "${answers.last_name}", ${answers.role}, ${answers.manager})`,
                    (err, data) => {
                        if (err) throw err;
                        console.log("New employee added!");
                        employeeTrack();
                    }
                );
            });
    });
};
const addRole = () => {
    // Query to get department names
    connection.query("SELECT id, name FROM department", (err, res) => {
        if (err) throw err;
        const dept = res.map((department) => {
            return {
                name: department.name,
                value: department.id,
            };
        });
        inquirer
            .prompt([{
                    name: "title",
                    type: "input",
                    message: "What is the new role:",
                },
                {
                    name: "salary",
                    type: "input",
                    message: "What is the salary:",
                },
                {
                    name: "department",
                    type: "list",
                    message: "What department:",
                    choices: dept,
                },
            ])
            .then((answers) => {
                connection.query(
                    `INSERT INTO role (title, salary, department_id) VALUES ("${answers.title}", ${answers.salary}, ${answers.department})`,
                    (err, data) => {
                        if (err) throw err;
                        console.log("New role added!");
                        employeeTrack();
                    }
                );
            });
    });
};

const updateRole = () => {
    // Query to get department names
    connection.query("select*,a.id as empID, concat(first_name, \" \", last_name) as concatName from employee a left join role b on a.role_id = b.id", (err, res) => {
        if (err) throw err;
        const employeeUpdate = res.map((employeeUpdate) => {
            return {
                name: employeeUpdate.concatName,
                value: employeeUpdate.empID,
            };
        });
        const roleUpdate = res.map((roleUpdate) => {
            return {
                name: roleUpdate.title,
                value: roleUpdate.id,
            };
        });
        inquirer
            .prompt([
                {
                    name: "employee",
                    type: "list",
                    message: "What employee do you want to update:",
                    choices: employeeUpdate,
                },
                {
                    name: "newRole",
                    type: "list",
                    message: "What role do you want to give them?",
                    choices: roleUpdate,
                },
               
            ])
            .then((answers) => {
                connection.query(
                    `UPDATE employee SET role_id = ${answers.newRole} where employee.id = ${answers.employee}`,
                    (err, data) => {
                        if (err) throw err;
                        console.log("Role updated!");
                        employeeTrack();
                    }
                );
            });
    });
};

const addDepartment = () => {
    inquirer
        .prompt([{
            name: "title",
            type: "input",
            message: "What is the new department:",
        }, ])
        .then((answers) => {
            connection.query(
                `INSERT INTO department (name) VALUES ("${answers.title}")`,
                (err, data) => {
                    if (err) throw err;
                    console.log("New department added!");
                    employeeTrack();
                }
            );
        });
};
// const viewByManager = () => {
//     connection.query(
//         'select a.id, a.first_name, a.last_name, title, department_id, salary, d.concatName from employee_db.employee a left join employee_db.role b on a.role_id=b.id left join employee_db.department c on b.department_id=c.id left join ( select a.first_name, a.last_name, concat(b.first_name,b.last_name) as concatName, a.manager_id,a.id from employee_db.employee a inner join employee_db.employee b on a.manager_id=b.id) d on a.id =d.id',
//         (err, res) => {
//             if (err) throw err;
//             console.table(res);
//             employeeTrack();
//         })
// }
const getRoleArray = async () => {
    const roleArray = await connection.promisifiedQuery(
        "SELECT * FROM role"
    );
    return roleArray.map((role) => {
        return {
            name: role.title,
            value: role.id,
        };
    });
};

const removeRole = async () => {
    const roleArray = await getRoleArray();
    inquirer
        .prompt([{
            type: "list",
            name: "removeRole",
            choices: roleArray,
            message: "Which role would you like to remove?",
        }, ])
        .then(({
            removeRole
        }) => {
            connection.query(
                "DELETE FROM role WHERE ?", {
                    id: removeRole
                },
                (err, data) => {
                    if (err) throw err;
                }
            );
        });
};
connection.connect((err) => {
    if (err) throw err;
    employeeTrack();
});