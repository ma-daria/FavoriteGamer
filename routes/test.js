const prom = new Promise(function(resolve, reject) {
    let a = 1;

    if (a === 0)
        resolve('yes');
    else
        reject("no");

});
prom
    .then((data) => {
        console.log(data);
    })
    .catch((error) => {
        console.log(error); // вывести ошибку
    });