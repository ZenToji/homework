const users = [
    {
        name: 'dima',
        age: 23,
        isAdmin: false,
        sayHello(name){
            console.log(`Hello ${name}`)
        }
    },
    {
        name: 'john',
        age: 20,
        isAdmin: false
    },
    {
        name: 'alex',
        age: 26,
        isAdmin: true
    },
    {
        name: 'din',
        age: 35,
        isAdmin: true
    },
    {
        name: 'butch',
        age: 48,
        isAdmin: false
    },
]

let simple = 0

for(let i = 0; i < users.length; i++){
    if(users[i].isAdmin === false) {
        simple = simple + 1;
    } else {}
}

console.log(simple)
users[0].sayHello('Kurator')