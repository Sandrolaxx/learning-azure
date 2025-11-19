require('dotenv').config();
const express = require('express');
const session = require('express-session');
const msal = require('@azure/msal-node');
const path = require('path');
const { msalConfig, REDIRECT_URI, POST_LOGOUT_REDIRECT_URI } = require('./authConfig');

const app = express();
const PORT = process.env.PORT || 3000;

// Inicializar MSAL Confidential Client
const msalClient = new msal.ConfidentialClientApplication(msalConfig);

// Configuração de sessão
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-this',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // set to true em produção com HTTPS
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 24 horas
    }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Middleware para verificar autenticação
const isAuthenticated = (req, res, next) => {
    if (req.session.isAuthenticated) {
        return next();
    }
    res.redirect('/');
};

// Rota pública - Home
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para iniciar o login
app.get('/auth/signin', (req, res) => {
    const authCodeUrlParameters = {
        scopes: [".default"],
        redirectUri: REDIRECT_URI,
    };

    msalClient.getAuthCodeUrl(authCodeUrlParameters)
        .then((response) => {
            res.redirect(response);
        })
        .catch((error) => {
            console.log(JSON.stringify(error));
            res.status(500).send('Erro ao iniciar autenticação');
        });
});

// Rota de callback do Azure AD
app.get('/auth/redirect', (req, res) => {
    const tokenRequest = {
        code: req.query.code,
        scopes: [".default"],
        redirectUri: REDIRECT_URI,
    };

    msalClient.acquireTokenByCode(tokenRequest)
        .then((response) => {
            req.session.isAuthenticated = true;
            req.session.account = response.account;
            req.session.accessToken = response.accessToken;
            res.redirect('/profile');
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send('Erro ao processar autenticação');
        });
});

// Rota protegida - Profile (requer autenticação)
app.get('/profile', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});

// API para obter informações do usuário
app.get('/api/userinfo', isAuthenticated, (req, res) => {
    res.json({
        username: req.session.account.username,
        name: req.session.account.name,
        homeAccountId: req.session.account.homeAccountId
    });
});

// Rota de logout
app.get('/auth/signout', (req, res) => {
    const logoutUri = `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/logout?post_logout_redirect_uri=${POST_LOGOUT_REDIRECT_URI}`;
    
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        }
        res.redirect(logoutUri);
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📝 Área pública: http://localhost:${PORT}`);
    console.log(`🔒 Área autenticada: http://localhost:${PORT}/profile`);
});
