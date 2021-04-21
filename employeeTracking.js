// require packages
const mysql = require('mysql');
const inquirer = require('inquirer');
const util = require("util");

// create the connection information for the sql database
const connection = mysql.createConnection({
    host: 'localhost',
    // port
    port: 3306,
    // username
    user: 'root',
    // password
    password: 'Chessie1!',
    // database to connect to
    database: 'employee_DB',
});

// promisify query for later use
connection.promisifiedQuery = util.promisify(connection.query);

// main function to prompt use around the database
const employeeTrack = () => {
    inquirer
        .prompt({
            name: 'action',
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                'View all Employees',
                'Add Employee',
                'Remove Employee',
                'View Roles',
                'Add Role',
                'Update Role',                
                'Remove Role',
                'View Departments',
                'Add Departments',
                'Remove Departments'
            ]
        })
        .then((answer) => {
            // based on the response, where should it go next
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
                 case 'View Roles':
                    viewRoles();
                    break;
                case 'Add Role':
                    addRole();
                    break;   
                case 'Update Role':
                    updateRole();
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
                case 'Remove Departments':
                    removeDepartments();
                    break;
                default:
                    console.log(`Invalid action: ${answer.action}`);
                    break;
            }
        })
}
const viewEmployees = () => {
    connection.query(
        'select a.id, a.first_name, a.last_name, title, department_id, salary, d.managerName from employee_db.employee a left join employee_db.role b on a.role_id=b.id left join employee_db.department c on b.department_id=c.id left join ( select a.first_name, a.last_name, concat(b.first_name, \" \",b.last_name) as managerName, a.manager_id,a.id from employee_db.employee a inner join employee_db.employee b on a.manager_id=b.id) d on a.id =d.id',
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
            .prompt([{
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
                    console.log("Role Removed!");
                        employeeTrack();
                }
            );
        });
};

const removeDepartments =  () => {
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
                type: "list",
                name: "removeDepartment",
                choices: dept,
                message: "Which role would you like to remove?",
            }, ])
            .then((answers) => {
                connection.query(
                    `DELETE FROM department WHERE id = ${answers.removeDepartment}`,
                    (err, data) => {
                        if (err) throw err;
                        console.log("Department Removed!");
                        employeeTrack();
                    }
                );
            });
    });
};

const removeEmployee =  () => {
    connection.query("SELECT id, concat(first_name, \" \", last_name) as empName FROM employee", (err, res) => {
        if (err) throw err;
        const empl = res.map((employee) => {
            return {
                name: employee.empName,
                value: employee.id,
            };
        });
        inquirer
            .prompt([{
                type: "list",
                name: "removeEmployee",
                choices: empl,
                message: "Which employee would you like to remove?",
            }, ])
            .then((answers) => {
                connection.query(
                    `DELETE FROM employee WHERE id = ${answers.removeEmployee}`,
                    (err, data) => {
                        if (err) throw err;
                        console.log("Employee Removed!");
                        employeeTrack();
                    }
                );
            });
    });
};

connection.connect((err) => {
    if (err) throw err;
    employeeTrack();
});