const express = require('express')
const session = require('express-session')
const ejs = require('ejs')
const bodyParser = require('body-parser')
const banco = require('./banco')

const porta = 4000
const app = express()
const caminhoTelas = __dirname + '\telas'

app.use(session({ secret: 'uhterere' }))
app.use(bodyParser.urlencoded({ extended: true }))
app.engine('html', ejs.renderFile)
app.set('view engine', 'html')
app.set('telas', caminhoTelas)

//responder http://localhost:3000
app.get('/', (req, res) => {
    res.render('Login') // manda mostrar a pagina login.HTML
    res.end()
})

//responder http://localhost:3000/livros
app.get('/livros', async(req, res) => {
    if (req.session.usuario) {
        const livros = await banco.listaLivros()
        res.render('listaLivros', { livros }) // manda mostrar a pagina listalivros.HTML
    } else res.render('safadinho')
})

app.get('/cadLivro', async(req, res) => {
    if (req.session.usuario) {
        res.render('formLivro', { titulo: 'Cadastro de livro', rota: '/cadLivro', dadosLivro: {} })
    } else res.render('safadinho')
})

app.post('/cadLivro', async(req, res) => {
    if (req.session.usuario) {
        const tit = req.body.txtTitulo
        const aut = req.body.txtAutor
        const pag = parseInt(req.body.numPaginas)

        await banco.incluirLivro([tit, aut, pag])
        res.redirect('/livros')
    } else res.render('safadinho')
})

app.post('/altLivro/:id', async(req, res) => {
    if (req.session.usuario) {
        const cod = parseInt(req.params.id)
        const tit = req.body.txtTitulo
        const aut = req.body.txtAutor
        const pag = parseInt(req.body.numPaginas)

        await banco.alterarLivro([tit, aut, pag, cod])
        res.redirect('/livros')
    }
})

app.get('/altLivro/:id', async(req, res) => {
    if (req.session.usuario) {
        const id = parseInt(req.params.id)
        const dadosLivro = await banco.buscarLivro(id)
        res.render('formLivro', { titulo: 'Alteração de livro', rota: '/altLivro/' + id, dadosLivro })
    } else res.render('safadinho')
})

app.get('/excLivro/:id', async(req, res) => {
    console.log(req.params)
    if (req.session.usuario) {
        const livros = await banco.excluirLivro(req.params.id)
        res.redirect('/livros')
    } else res.render('safadinho')
})

//recebe os dados do formulário de login
app.post('/', async(req, res) => {
    //pegar os dados do formulário
    const usuarioForm = req.body.txtUsuario
    const senhaForm = req.body.pswSenha

    //verificar se os dados do formulário estão no BD
    const linhas = await banco.buscarUsuario(usuarioForm, senhaForm)

    //se o usuário existir, mostrar a página de menu
    let usuarioValido = false
    if (linhas.length > 0) usuarioValido = true

    //se o usuário não existir, mostrar a página de erro
    if (usuarioValido) {
        req.session.usuario = usuarioForm
        res.render('menu')
    } else res.render('errou')
})

app.listen(porta, () => {
    console.log('Servidor Online')
})