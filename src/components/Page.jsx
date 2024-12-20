import Card from './Card.jsx'
import '../styles/Page.css'
import { useEffect, useState } from 'react'

const pokemonArray = [
                        {name: "bulbasaur", id: 1, url: ''}, {name: "ivysaur", id: 2, url: ''},
                        {name: "venusaur", id: 3, url: ''}, {name: "charmander", id: 4, url: ''},
                        {name: "charmeleon", id: 5, url: ''}, {name: "charizard", id: 6, url: ''},
                        {name: "squirtle", id: 7, url: ''}, {name: "wartortle", id: 8, url: ''},
                        {name: "blastoise", id: 9, url: ''}, {name: "caterpie", id: 10, url: ''},
                        {name: "metapod", id: 11, url: ''}, {name: "butterfree", id: 12, url: ''}
]
//array and variable for working with points
let nameStorage = []
let bestScore = 0

export default function Page () {

const [values, setValues] = useState(pokemonArray)
const [click, setClick] = useState(true)

function changeClick () {
    setClick(!click)
}
//for randomly rendered images create array with randomly arranged numbers from 0 to 11
function getArrayRandomIndexes() {
    const result = []
    while (result.length < 12) {
        const randomNumber = Math.floor(Math.random() * (11 - 0 + 1) ) + 0
        if (!result.includes(randomNumber)) 
            result.push(randomNumber)
    }
    return result
}

const cards = () => {
    console.log('!')
    return values.map(item => <Card
                                countPoints={countPoints}
                                changeClick={changeClick}
                                key={item.id}
                                id={item.id}
                                name={item.name}
                                url={item.url}
    />) 
} 
        
//logic for working with points
function countPoints(name) {
    if (nameStorage.includes(name)) nameStorage = []
    else {
        nameStorage.push(name)
        if (nameStorage.length  > bestScore) bestScore = nameStorage.length 
    }
}
    




useEffect (() => {
    //fill array with random names using array of random indexes
    function getArrayRandomNames() {
        const result = []
        let counter = 0
        const rundomIndexes = getArrayRandomIndexes()
        pokemonArray.forEach(item => {
            result[rundomIndexes[counter]] = item.name
            counter++
        })
        return result
    }

    //get array of promises from all fetch
    function fetchAll () {
        const arrayRandomNames = getArrayRandomNames()
        const promises = []
        arrayRandomNames.forEach(item => {
        promises.push(fetch(`https://pokeapi.co/api/v2/pokemon/${item}`, {mode: 'cors'}))
    })
        return Promise.all(promises)
    }
    //get data array from array of promises and pass it to changeValues() function
    function getUrlsArray () {
        fetchAll()
        .then(responses => responses.map(resp => resp.json()))
        .then(arrayOfPromises => {
            Promise.all(arrayOfPromises)
            .then(data => {changeValues(data)}) 
        })
    }
 
    function changeValues(array) { 
        let counter = 0
        const newValues = values.map(item => {
            const result = {
                name: array[counter].name,
                id: item.id,
                url: array[counter].sprites.other['official-artwork'].front_default
            }
            counter++
            return result
        })
        setValues(newValues)
    }

getUrlsArray ()


     
    

}, [click])

return <div className='page'>
     <div className='counter'>
<h2>Pokemon Memory Game</h2>
<p>Get points by clicking on an image but don't click on any more than once!</p>
        <b>Score:</b> {nameStorage.length} <b>Best score:</b> {bestScore}
        </div>

    
       <div className='cardsContainer'>
    {cards ()
    
    }
    </div>
</div>
}


