class Cliente {
    constructor(nome, cpf, sexo, renda) {
        this.nome = nome
        this.cpf = cpf
        this.sexo = sexo
        this.renda = renda
    }
}

let clientes = []

async function carregarClientes() {
    if (!localStorage.getItem("clientes")) {
        try {
            const resposta = await fetch("clientes.json")
            const dadosJson = await resposta.json()
            clientes = dadosJson.map(c => new Cliente(c.nome, c.cpf, c.sexo, c.renda))
            salvarDados()
            alert("50 clientes já estão cadastrados!")
        } catch (erro) {
            alert("Erro ao carregar clientes do arquivo JSON.")
            console.error(erro)
        }
    } else {
        clientes = JSON.parse(localStorage.getItem("clientes")).map(
            c => new Cliente(c.nome, c.cpf, c.sexo, c.renda)
        )
    }
}

function salvarDados() {
    localStorage.setItem("clientes", JSON.stringify(clientes))
}

function mostrarOpcoes() {
    const entrada = prompt(
        "Sistema de Clientes Machine Invest (SCMI)\n" +
        "1 - Adicionar um novo cliente\n" +
        "2 - Listar clientes\n" +
        "3 - Excluir um cliente\n" +
        "4 - Excluir todos os clientes\n" +
        "5 - Buscar um cliente\n" +
        "6 - Editar dados de um cliente\n" +
        "7 - Encerrar o programa\n"
    )

    if (entrada === null) return 7

    const numero = parseInt(entrada)
    return isNaN(numero) ? -1 : numero
}

async function adicionarCliente() {
    let nome = prompt("Digite o nome do cliente:")
    let cpf = prompt("Digite o CPF do cliente:")
    let sexo = prompt("Digite o sexo do cliente (M ou F):")
    let renda = prompt(
        "Qual sua renda mensal?\n" +
        "a) R$0 - R$1.000\n" +
        "b) R$1.000 - R$5.000\n" +
        "c) R$5.000 - R$100.000\n" +
        "d) R$1M+"
    )

    let cliente = new Cliente(nome, cpf, sexo, renda)
    clientes.push(cliente)
    salvarDados()
    alert("Cliente cadastrado com sucesso!")
}

function listarClientes() {
    if (clientes.length === 0) {
        alert("Não há clientes cadastrados.")
        return
    }

    let lista = clientes.map((c, i) =>
        `${i + 1}. Nome: ${c.nome} | CPF: ${c.cpf} | Sexo: ${c.sexo} | Renda: ${c.renda}`
    ).join("\n")

    alert("Lista de Clientes:\n\n" + lista)
}

function removerTodosOsClientes() {
    if (confirm("Tem certeza que deseja remover todos os clientes?")) {
        clientes = []
        salvarDados()
        alert("Todos os clientes foram removidos.")
    }
}

function excluirUmCliente() {
    if (clientes.length === 0) {
        alert("Nenhum cliente para excluir.")
        return
    }

    let cpf = prompt("Digite o CPF do cliente que deseja excluir:")
    let index = clientes.findIndex(c => c.cpf === cpf)

    if (index !== -1) {
        clientes.splice(index, 1)
        salvarDados()
        alert("Cliente removido com sucesso.")
    } else {
        alert("Cliente não encontrado.")
    }
}

function buscarCliente() {
    let termo = prompt("Digite o nome ou CPF do cliente:")
    let encontrados = clientes.filter(c =>
        c.nome.toLowerCase().includes(termo.toLowerCase()) || c.cpf.includes(termo)
    )

    if (encontrados.length > 0) {
        let resultado = encontrados.map((c, i) =>
            `${i + 1}. Nome: ${c.nome} | CPF: ${c.cpf} | Sexo: ${c.sexo} | Renda: ${c.renda}`
        ).join("\n")
        alert("Clientes encontrados:\n\n" + resultado)
    } else {
        alert("Nenhum cliente encontrado.")
    }
}

function editarDadosDoCliente() {
    let cpf = prompt("Digite o CPF do cliente que deseja editar:")
    let index = clientes.findIndex(c => c.cpf === cpf)

    if (index !== -1) {
        let cliente = clientes[index]
        let novoNome = prompt(`Novo nome (atual: ${cliente.nome}):`)
        let novoSexo = prompt(`Novo sexo (atual: ${cliente.sexo}):`)
        let novaRenda = prompt(`Nova renda (atual: ${cliente.renda}):`)

        cliente.nome = novoNome || cliente.nome
        cliente.sexo = novoSexo || cliente.sexo
        cliente.renda = novaRenda || cliente.renda

        salvarDados()
        alert("Cliente atualizado com sucesso.")
    } else {
        alert("Cliente não encontrado.")
    }
}

function programaEncerrado() {
    alert("Programa encerrado. A Machine Invest agradece.")
}

(async () => {
    await carregarClientes()

    let opcao = -1
    while (opcao !== 7) {
        opcao = mostrarOpcoes()

        switch (opcao) {
            case 1: await adicionarCliente(); break
            case 2: listarClientes(); break
            case 3: excluirUmCliente(); break
            case 4: removerTodosOsClientes(); break
            case 5: buscarCliente(); break
            case 6: editarDadosDoCliente(); break
            case 7: programaEncerrado(); break
            default: alert("Opção inválida. Escolha um número de 1 a 7.")
        }
    }
})()
