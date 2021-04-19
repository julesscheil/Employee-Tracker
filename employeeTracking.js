const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Chessie1!',
    database: 'employee_db'
});

const employeeTrack = () => {
    console.log("Welcome to our Employee Manager!");
    console.log(" ");
    inquirer
        .prompt({
            name: 'action',
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                'View all Employees',
                'View all Employees by Department',
                'View all Employees by Manager',
                'Add Employee',
                'Remove Employee',
                'Update Employee Role',
                'Update Employee Manager',
                'View all Roles',
                'Add Role',
                'Remove Role'
            ]
        })
        .then((answer) => {
            console.log(answer.action);
            switch (answer.action) {
                case 'View all Employees':
                    viewEmployees();
                    break;
                    //     case 'View all Employees by Department':
                    //         viewByDepartment();
                    //         break;
                    //     case 'View all Employees by Manager':
                    //         viewByManager();
                    //         break;
                    //     case 'Add Employee':
                    //         addEmployee();
                    //         break;
                    //     case 'Remove Employee':
                    //         removeEmployee();
                    //         break;
                    //     case 'Update Employee Role':
                    //         updateRole();
                    //         break;
                    //     case 'Update Employee Manager':
                    //         updateManager();
                    //     case 'View all Roles':
                    //         viewRoles();
                    //         break;
                    //     case 'Add Role':
                    //         addRole();
                    //         break;
                    //     case 'Remove Role':
                    //         removeRole();
                    //         break;
                default:
                    console.log(`Invalid action: ${answer.action}`);
                    break;
            }

        })
}


const viewEmployees = () => {

}


connection.connect((err) => {
    if (err) throw err;
    employeeTrack();
});