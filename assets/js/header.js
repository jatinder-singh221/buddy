document.addEventListener("DOMContentLoaded", async () => {
    try {
        const navbar = await fetch('navbar.html')
        const response = await navbar.text()
        const header = document.createElement("header")
        header.innerHTML = response
        document.body.prepend(header)

        const footer = await fetch('footer.html')
        const footerResponse = await footer.text()
        const footerElement = document.createElement("footer")
        footerElement.innerHTML = footerResponse
        document.body.appendChild(footerElement)

        const button = document.querySelector('#menu-button')

        button.addEventListener('click', () => {
            const menu = document.getElementById('menu')
            menu.classList.toggle('hidden')
        })

        const location = window.location.pathname.replace('/', '')
        let link = ''
        if (location == '') {
            link = document.getElementById('index.html')
        } else
            link = document.getElementById(`${location}`)
        link.classList.remove('text-slate-700')
        link.classList.add('font-semibold', 'text-[#6927DA]')


        document.querySelector("form").addEventListener("submit", handleCalculateTax)


        if (location == 'tax-calculator.html') 
            getTaxTableData()


    } catch (error) {
        console.error(error)
    }
})

const getSetLocalStorage = (name, data) => {
    let existingData = JSON.parse(localStorage.getItem(name)) || []
    existingData.push(data)
    localStorage.setItem(name, JSON.stringify(existingData))
}

const getTaxTableData = () => {
    const taxData = JSON.parse(localStorage.getItem("taxHistory"))
    const historyBody = document.getElementById("historyBody")
    const totalHistoryElement = document.getElementById('total-history-amount')
    let totalSum = 0

    historyBody.innerHTML = ""
    
    if (taxData){
        taxData.forEach((item, index)  => {
            const row = document.createElement("tr")
            totalSum += item.total
    
            row.innerHTML = `
            <td class="border border-gray-300 px-4 py-2">${index+1}</td>
            <td class="border border-gray-300 px-4 py-2">${item.name || 'Null'}</td>
                <td class="border border-gray-300 px-4 py-2">${item.taxableValue}</td>
                <td class="border border-gray-300 px-4 py-2">${item.percentage}% - ${item.percentage}%</td>
                <td class="border border-gray-300 px-4 py-2">${item.csgstAmount} - ${item.csgstAmount}</td>
                <td class="border border-gray-300 px-4 py-2">${item.total}</td>
            `
            historyBody.appendChild(row)
        })
    }
    totalHistoryElement.innerHTML = totalSum
}


const handleCalculateTax = (event) => {
    event.preventDefault()

    // inputs
    const name = document.getElementById('name').value
    const quantity = document.getElementById('quantity').value
    const amount = document.getElementById('amount').value
    const IGST = document.getElementById('IGST').value

    // elements
    const taxableValueElement = document.getElementById('taxable-value')
    const cgstAmountElement = document.getElementById('cgst-amount')
    const cgstPercentageElement = document.getElementById('cgst-percentage')
    const totalElement = document.getElementById('total-amount')

    const totalAmount = Math.round(quantity * amount)
    const taxableAmount = Math.round(totalAmount / (100 + parseInt(IGST)) * 100)

    totalElement.innerHTML = totalAmount
    taxableValueElement.innerHTML = taxableAmount
    cgstPercentageElement.innerHTML = parseInt(IGST) / 2
    cgstAmountElement.innerHTML = (totalAmount - taxableAmount) / 2

    const data = {
        'name': name || '',
        'taxableValue': taxableAmount,
        'percentage': parseInt(IGST) / 2,
        'csgstAmount': (totalAmount - taxableAmount) / 2,
        'total': totalAmount
    }

    getSetLocalStorage('taxHistory', data)
    getTaxTableData()
}


const clearStorage = (name) => {
    window.localStorage.removeItem(name)
    getTaxTableData()
}