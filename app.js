const Keycloak = require('keycloak-connect');
const express = require('express');
const session = require('express-session');

const app = express();

const useAuth = true;

const memoryStore = new session.MemoryStore();
const keycloak = new Keycloak({ store: memoryStore });

function protect(req, res, next) {
    console.log('auth disabled');
    next();
};

const middle = useAuth ? keycloak.protect(): protect;

//session
app.use(session({
  secret:'thisShouldBeLongAndSecret',
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));

if (useAuth) {
    app.use(keycloak.middleware({ logout: '/logout'}));
}

app.get('/', middle, function(req,res){
    res.send('main');
});

app.get('/signin', middle, function(req,res){
    console.log('signin');
    res.send('redirect');
});

app.get('/logout', function(req,res){
    console.log('logout');
    res.send('logout');
});


app.listen(8000, function () {
  console.log('Listening at http://localhost:8000');
});