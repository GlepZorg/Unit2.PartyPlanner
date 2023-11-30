const url = 'https://fsa-crud-2aa9294fe819.herokuapp.com/api/2310-FSA-ET-WEB-PT-SF/events';


const getParties = async () => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        
        console.log('API response:', data);

        
        const parties = Array.isArray(data) ? data : data.data; 
        
        if (!Array.isArray(parties)) {
            throw new Error('Parties is not an array');
        }

        
        partyList.splice(0, partyList.length, ...parties);
        
        renderParties();
    } catch (error) {
        console.error('Error fetching parties:', error);
    }
};



const renderParties = () => {
    const partyListElement = document.getElementById('party-list');
    partyListElement.innerHTML = partyList.map(party =>
        `<div class="party">
            <h3>${party.name}</h3>
            <p>${party.date} at ${party.time}</p>
            <p>Location: ${party.location}</p>
            <p>${party.description}</p>
            <button onclick="deleteParty(${party.id})">Delete</button>
        </div>`
    ).join('');
};

const addParty = async (event) => {
    event.preventDefault(); 
    try {
        const name = document.getElementById('name').value;
        const dateValue = document.getElementById('date').value;
        const timeValue = document.getElementById('time').value;

        const dateTime = new Date(`${dateValue}T${timeValue}:00.000Z`).toISOString();
        const location = document.getElementById('location').value;
        const description = document.getElementById('description').value;

        const eventData = {
            name,
            date: dateTime, 
            location,
            description,
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventData)
        });

        if (!response.ok) {
            const errorInfo = await response.json(); 
            console.error('Error response body:', errorInfo);
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        document.getElementById('new-party-form').reset();
        await getParties();
    } catch (error) {
        console.error('Error adding party:', error);
    }
};





const deleteParty = async (partyId) => {
    try {
        const response = await fetch(`${url}/${partyId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        
        await getParties();
    } catch (error) {
        console.error('Error deleting party:', error);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('new-party-form').addEventListener('submit', addParty);
    
    getParties();
});

const partyList = [];
