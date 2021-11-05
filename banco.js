async function conectar() {
    if (global.connection && global.connection.state != 'disconected') {
        return global.connection
    }
    //const dbConfig = require('./dbConfig.json')
    //const srtConexao = 'mysql://'+dbConfig.db.usuario+';'
    const mysql = require('mysql2/promise')
        //                                                    usuario:senha@host:porta/banco
    const conexao = await mysql.createConnection('mysql://root:teste123@localhost:3306/biblioteca')
    global.connection = conexao
    return conexao
}

async function buscarUsuario(usuario, senha) {
    const conexao = await conectar()
    const sql = 'select * from usuarios where usulogin=? and ususenha=?;'
    const [linhas] = await conexao.query(sql, [usuario, senha])
    return linhas
}

async function listaLivros() {
    const conexao = await conectar()
    const sql = 'select * from livros order by livtitulo;'
    const [linhas] = await conexao.query(sql)
    return linhas
}

async function excluirLivro(id) {
    const conexao = await conectar()
    const sql = 'delete from livros where livcodigo=?;'
    return await conexao.query(sql, [id])
}

async function incluirLivro(dados) {
    const conexao = await conectar()
    const sql = 'insert into livros (livtitulo, livautor, livpaginas) values (?,?,?);'
    return await conexao.query(sql, dados)
}

async function buscarLivro(id) {
    const conexao = await conectar()
    const sql = 'select * from livros where livcodigo=?;'
    const [dadosLivro] = await conexao.query(sql, [id])
    if (dadosLivro.length > 0) return dadosLivro[0]
    else return {}
}

async function alterarLivro(dados) {
    const conexao = await conectar()
    const sql = 'update livros set livtitulo=?, livautor=?, livpaginas=? where livcodigo=?;'
    return await conexao.query(sql, dados)
}

module.exports = { buscarUsuario, listaLivros, excluirLivro, incluirLivro, buscarLivro, alterarLivro }