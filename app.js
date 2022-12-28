// [{id, x, name: x, quantity: x, value: x, description: x}...]
let stock = []
let extract = []

window.addEventListener('load', () => {
    let stockExists = localStorage.getItem('stock')
    let sctractExists = localStorage.getItem('extract')

    if(stockExists) {
        stock = JSON.parse(localStorage.getItem('stock'))
    }

    if(sctractExists) {
        extract = JSON.parse(localStorage.getItem('extract'))
    }

    startAplication()
})

function startAplication() {
    showMenu()
}

function saveData() {
    localStorage.setItem('stock', JSON.stringify(stock))
    localStorage.setItem('extract', JSON.stringify(extract))
}

function showMenu() {
    let action = ""

    do {
        action = prompt(
            "Escolha a ação desejada: \n" +
            "\n1 - Visualizar produtos em estoque" +
            "\n2 - Visualizar detalhes do produto" +
            "\n3 - Cadastrar produto" +
            "\n4 - Substituir informações do produto" + 
            "\n5 - Adicionar estoque de um produto" + 
            "\n6 - Cadastrar compra" +
            "\n7 - Visualiar extrato" +
            "\n\nCaso deseje encerrar o sistema, digite: 'Sair'"
        )

        action = action.toLocaleUpperCase()

        switch (action) {
            case '1':
                viewStock()
                break;
            case '2':
                viewProduct()
                break;
            case '3':
                createProduct()
                break;
            case '4':
                alterProduct()
                break;
            case '5':
                addSotckQuantity()
                break;
            case '6':
                registerPurchease()
                break;
            case '7':
                pullExtract()
                break;
            case 'SAIR':
                let exitSistem = confirm('Deseja encerrar o sistema ?')

                if(!exitSistem) {
                    showMenu()
                }else {
                    return
                }

                break;
            default:
                alert('Opção invalida.')
            break;
        }

    } while(action !== "SAIR")
}

function viewStock() {
    let message = '-> PRODUTOS EM ESTOQUE <-'
    message += "\n\n"

    if(stock.length === 0) {
        return alert('Nenhum produto em estoque')
    } 

    message += stock.reduce(function (currentString, product, currentIndex){
        currentString += `${product.id} | ${currentIndex + 1}. ${product.name} (${product.quantity} unidades em estoque)\n`
        currentString += `| Valor unitario: R$${product.value} reais \n\n`

        return currentString
    }, "")

    alert(message)
}

function createProduct() {
    let name = prompt('Insira o nome do novo produto a ser cadastrado: ')

    let quantity;
    do { 
        quantity = Number(prompt(`Insira a quantidade em estoque do produto '${name}': `))
    } while(isNaN(quantity) || !quantity)

    let value;
    do {
        value = Number(prompt(`Insira o valor unitario do produto '${name}' (somente utilize ponto nos centavos): `))
    } while(isNaN(value) || !value)

    let description = prompt(`Insira a descrição resumida do produto '${name}': `)

    let confirmCreate = confirm(
        'Deseja criar um produto com essas informações?\n\n' + 
        `${name} (${quantity} unidades em estoque)\n` +
        `| Valor unitario: R$${value} reais \n\n` +
        '| Descrição: \n\n' + 
        description
    )

    if(!confirmCreate) {
        return
    }

    let product = {
        id: createUnicId(4),
        name,
        quantity,
        value,
        description
    }

    stock.push(product)
    saveData()
}

function createUnicId(length) {
    let id = ''
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789'

    let allIds = []

    stock.forEach((element) => {
        allIds.push(element.id)
    })

    do {
        for(let index = 0; index < length; index++) {
            
            id += characters.charAt(Math.floor(Math.random() * characters.length))
        }
    } while(allIds.includes(id))

    return id
}

function viewProduct() {
    let message = '-> DETALHES DO PRODUTO <-'
    message += "\n\n"

    let productId = ""

    let allIds = []

    stock.forEach((element) => {
        allIds.push(element.id)
    })

    do {
        productId = prompt('Favor digite o código do produto a ser consultado: ')
        
        if(productId === null) {
            return
        }
    } while(!allIds.includes(productId))

    let searchElement = {}

    stock.forEach(element => {
        if(element.id === productId) {
            searchElement = element
        }
    })

    message += `${searchElement.id}. ${searchElement.name} (${searchElement.quantity} unidades em estoque)\n`
    message += `| Valor unitario: R$${searchElement.value} reais \n\n`
    message += `| Descrição: \n\n` + searchElement.description

    alert(message)
}

function alterProduct() {
    let product = ""

    let allIds = []

    stock.forEach((element) => {
        allIds.push(element.id)
    })
    
    do {
        product = prompt("Insira o código do produto que deseja substituir os dados:")
    } while(!allIds.includes(product))

    let searchElement = {}

    stock.forEach(element => {
        if(element.id === product) {
            searchElement = element
        }
    })

    let newName = prompt(`Insira o nome para o produto que irá substituir '${searchElement.name}': `)

    let newQuantity;
    do { 
        newQuantity = Number(prompt(`Insira estoque do produto '${newName}': `))
    } while(isNaN(newQuantity) || !newQuantity)

    let newValue;
    do {
        newValue = Number(prompt(`Insira preço do produto '${newName}' (somente utilize ponto nos centavos): `))
    } while(isNaN(newValue) || !newValue)

    let newDescription = prompt(`Insira a descrição do produto '${newName}': `)

    let confirmAlterProduct = confirm(
        `Deseja substituir o produto ${searchElement.name} por essas informações?\n\n` + 
        `${newName} (${newQuantity} unidades em estoque)\n` +
        `| Valor unitario: R$${newValue} reais \n\n` +
        '| Descrição: \n\n' + 
        newDescription
    )

    if(!confirmAlterProduct) {
        return
    }

    stock.forEach(element => {
        if(element.id === product) {
            element.name = newName
            element.quantity = newQuantity
            element.value = newValue
            element.description = newDescription
        }
    })

    saveData()
}

function addSotckQuantity() {
    let product = ""
    let addAmount;

    let allIds = []
    let allProductsNames = []

    stock.forEach((element) => {
        allIds.push(element.id)
        allProductsNames.push(element.name)
    })
    
    do {
        product = prompt("Insira o código (ou o nome exato) do produto que deseja adicionar quantidades em estoque:")
    } while(!allIds.includes(product) && !allProductsNames.includes(product))

    do {
        addAmount = Number(prompt(`Insira a quantidade a ser adicionada ao estoque ao produto: `))
    } while(isNaN(addAmount) || !addAmount)

    stock.forEach(element => {
        if(element.id === product || element.name === product) {
            element.quantity += addAmount
        }
    })

    saveData()
}

function registerPurchease() {
    let message = "->LISTA DE COMPRAS<-"
    message += "\n"
    message += "* Deseja finalizar a compra de todos os itens ?"
    message += "\n\n"

    // [{product: {id: x, name: ...}, quantity: x, total: x}]
    let shoppingCart = []

    let allProductsId = []
    let allProductsNames = []
    let product;
    let searchElement;

    stock.forEach(element => {
        allProductsId.push(element.id)
        allProductsNames.push(element.name)
    })

    let moreShopping;
    let quantity;

    do {

        do {
            product = prompt('Insira o código (ou o nome exato) do produto a ser registrado na compra: ')
    
            if(product === null) {
                return
            }
        } while(!allProductsId.includes(product) && !allProductsNames.includes(product))
    
        stock.forEach(element => {
            if(element.id === product || element.name === product) {
                searchElement = element
            }
        })
    
        do {
            quantity = Number(prompt(`Insira quantas unidades do produto '${searchElement.name}' serão compradas: `))
    
            if(quantity <= 0) {
                return
            }

            if(quantity > searchElement.quantity) {
                alert(`Existem apenas ${searchElement.quantity} unidades desse produto em estoque`)
                quantity = false
            }
        } while(isNaN(quantity) || !quantity)
    
        let item = {product: searchElement, shoppingQuantity: quantity, total: Number((searchElement.value * quantity).toFixed(2))}
    
        shoppingCart.push(item)

        moreShopping = confirm('Deseja cadastrar mais algum produto para compra ?')

    } while(moreShopping !== false)


    message += shoppingCart.reduce(function(result, currentValue) {
        result += `Produto: ${currentValue.product.name}\n`
        result += `Unidades: ${currentValue.shoppingQuantity} (R$ ${currentValue.product.value})\n`
        result += `Valor total do produto: R$ ${Number((currentValue.product.value * currentValue.shoppingQuantity).toFixed(2))} reais\n\n`

        return result
    }, "")


    let shoppingConfirmed = confirm(message)

    if(!shoppingConfirmed) {
        return
    }

    let discountConfirm = confirm('Sera aplicado um desconto nessa compra ?')
    let discount;

    if(discountConfirm) {
        discount = prompt('Qual a porcentagem de desconto a ser aplicado?')
    }

    message = '->TOTAL A PAGAR<-'
    message += '\n\n'
    message += 'Total da compra: '

    // Total da compra 
    let totalFinal = shoppingCart.reduce(function(result, currentValue) {
        result += currentValue.product.value * currentValue.shoppingQuantity

        return Number(result.toFixed(2))
    }, 0)

    message += totalFinal
    message += '\n'
    message += 'Desconto aplicado: '

    if(discount) {
        message += `${discount}%\n\n`
        discount = Number(discount)
    }else {
        message += 'Nenhum\n\n'
        discount = 0
    }

    totalFinal -= totalFinal * (discount / 100)
    totalFinal = Number(totalFinal.toFixed(2))

    message += `Total final da compra: ${totalFinal}`

    // Diminuir a quantidade do produto em estoque

    shoppingConfirmed = confirm(message)

    if(!shoppingConfirmed) {
        return
    }

    stock.forEach(element => {
        shoppingCart.forEach(product => {
            if(product.product == element) { 
                element.quantity -= product.shoppingQuantity
            }
        })
    })

    let invoice = confirm('Deseja CPF na nota ?')
    let cpf 

    if(invoice) {
        do {
            cpf = prompt('Insira o CPF a ser registrado: ')

            if(cpf === null) {
                cpf = 'Nenhum'
            }
        }while(!cpf)
    } else {
        cpf = 'Nenhum'
    }

    // Salvando o registro da compra no extrato (com ou sem CPF)

    let now = new Date
    let datePurchase = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`
    let timePurchase = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`

    let shopping = {
        products: shoppingCart,
        cpf,
        date: datePurchase, 
        hour: timePurchase,
        total: totalFinal,
        discount: discount += '%'
    }

    extract.push(shopping)

    saveData()
}

function pullExtract() {
    let message = "->EXTRATO DE TODAS AS COMPRAS<-"
    message += "\n\n\n"

    message += extract.reduce(function(result, shoppingCurrent, shoppingIndex){
        result += `${shoppingIndex + 1}ª COMPRA\n` 
        result += `------------------------\n` 
        result += `Data e hora: ${shoppingCurrent.date} as ${shoppingCurrent.hour}\n` 
        result += `CPF na nota: ${shoppingCurrent.cpf}\n\n`
        result += `Produtos: \n\n`

        result += shoppingCurrent.products.reduce(function(productsResult, productCurrent, indexCurrent){
            productsResult += ` | ${indexCurrent + 1}. ${productCurrent.product.name}\n`
            productsResult += `Unidades: ${productCurrent.shoppingQuantity}\n\n`

            return productsResult
        }, "")

        result += `\nTotal: R$ ${shoppingCurrent.total} reais\n`
        result += `Desconto aplicado: ${shoppingCurrent.discount} \n\n\n`

        return result
    }, "")

    document.body.innerText = message

    alert("O extrato pode ser muito grande para ser exibido por alerta, portanto, encerre o sistema para poder verifica-lo na tela.")
}