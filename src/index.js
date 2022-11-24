document.addEventListener('DOMContentLoaded', () => {
    const table = document.querySelector('table')
    const form = document.querySelector('form#dog-form')
    const nameForm = document.querySelector('form#dog-form input[name="name"]')
    const breedForm = document.querySelector('form#dog-form input[name="breed"]')
    const sexForm = document.querySelector('form#dog-form input[name="sex"]')
    let currentDogID = 0

    fetch('http://localhost:3000/dogs')
    .then(response => response.json())
    .then(data => {
        for(const dog of data) {
            renderDog(dog)
        }
    })
    .catch(() => alert('There was an error with the GET request.'))

    const renderDog = function (dogData) {
        const row = document.createElement('tr')

        const name = document.createElement('td')
        name.textContent = dogData.name

        const breed = document.createElement('td')
        breed.textContent = dogData.breed

        const sex = document.createElement('td')
        sex.textContent = dogData.sex

        const edit = document.createElement('td')
        const button = document.createElement('button')
        button.textContent = 'Edit Dog'
        button.addEventListener('click', () => {
            nameForm.value = dogData.name
            breedForm.value = dogData.breed
            sexForm.value = dogData.sex
            currentDogID = dogData.id
        })
        edit.appendChild(button)
        
        row.append(name, breed, sex, edit)
        table.appendChild(row)
    }

    form.addEventListener('submit', event => {
        event.preventDefault()

        if(currentDogID !== 0) {
            fetch(`http://localhost:3000/dogs/${currentDogID}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: event.target[0].value,
                    breed: event.target[1].value,
                    sex: event.target[2].value
                })
            })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(() => alert('There was an error with the PATCH request.'))
    
            table.innerHTML =
                `<thead class="blue">
                    <tr class="padding">
                        <th class="padding center">Name</th>
                        <th class="padding center">Breed</th>
                        <th class="padding center">Sex</th>
                        <th class="padding center">Edit Dog</th>
                    </tr>
                </thead>
                <tbody id="table-body"></tbody>`
    
            fetch('http://localhost:3000/dogs')
            .then(response => response.json())
            .then(data => {
                for(const dog of data) {
                    renderDog(dog)
                }
            })
            .catch(() => alert('There was an error with the GET request.'))
        }
        
        form.reset()
    })
})