const inquirer = require('inquirer');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Chessie1!',
    database: 'employee_db'
});

const employeeTrack = () => {
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
                case 'View all Employees by Department':
                    viewByDepartment();
                    break;
                case 'View all Employees by Manager':
                    viewByManager();
                    break;
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
    connection.query(
        'select a.id, a.first_name, a.last_name, title, department_id, salary, d.concatName from employee_db.employee a left join employee_db.role b on a.role_id=b.id left join employee_db.department c on b.department_id=c.id left join ( select a.first_name, a.last_name, concat(b.first_name,b.last_name) as concatName, a.manager_id,a.id from employee_db.employee a inner join employee_db.employee b on a.manager_id=b.id) d on a.id =d.id',
        (err, res) => {
            if (err) throw err;
            console.table(res);
            employeeTrack();
        })

}

const viewByDepartment = () => {
    connection.query(
        'select a.id, a.name, b.first_name, b.last_name, c.title, c.salary, concatName from department a left join role c on a.id = c.department_id left join employee b on c.id = b.role_id left join ( select a.first_name, a.last_name, concat(b.first_name,b.last_name) as concatName, a.manager_id,a.id from employee_db.employee a inner join employee_db.employee b on a.manager_id=b.id) d on a.id =d.id order by a.name',
        (err, res) => {
            if (err) throw err;
            console.table(res);
            employeeTrack();
        })
}

const viewByManager = () => {
    connection.query(
        'select concatName, b.first_name, b.last_name, c.title, c.salary from department a left join role c on a.id = c.department_id left join employee b on c.id = b.role_id left join ( select a.first_name, a.last_name, concat(b.first_name,b.last_name) as concatName, a.manager_id,a.id from employee_db.employee a inner join employee_db.employee b on a.manager_id=b.id) d on a.id =d.id order by concatName desc',
        (err, res) => {
            if (err) throw err;
            console.table(res);
            employeeTrack();
        })
}

connection.connect((err) => {
    if (err) throw err;
    employeeTrack();
});