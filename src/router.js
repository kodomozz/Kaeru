import createHistory from 'history/createHashHistory';

const history = createHistory({ hashType: 'slash' });

history.listen(function (location, action) {
    console.log(location, '========');
    console.log(history.length)
});

setTimeout(function () {
    // history.push('/home') // window.location.hash is #home
    history.push('home', { some: 'state' });
}, 1000)


