import Card from "./Card.jsx";
import styles from "./Page.module.css";
import { useEffect, useState } from "react";

const pokemonArray = [
  { name: "bulbasaur", id: 1, url: "" },
  { name: "ivysaur", id: 2, url: "" },
  { name: "venusaur", id: 3, url: "" },
  { name: "charmander", id: 4, url: "" },
  { name: "charmeleon", id: 5, url: "" },
  { name: "charizard", id: 6, url: "" },
  { name: "squirtle", id: 7, url: "" },
  { name: "wartortle", id: 8, url: "" },
  { name: "blastoise", id: 9, url: "" },
  { name: "caterpie", id: 10, url: "" },
  { name: "metapod", id: 11, url: "" },
  { name: "butterfree", id: 12, url: "" },
];
//array and variable for working with points
let nameStorage = [];
let bestScore = 0;

export default function Page() {
  const [values, setValues] = useState(pokemonArray);
  const [click, setClick] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  function changeClick() {
    setClick(!click);
  }
  //for randomly rendered images create array with randomly arranged numbers from 0 to 11
  function getArrayRandomIndexes() {
    const result = [];
    while (result.length < 12) {
      const randomNumber = Math.floor(Math.random() * (11 - 0 + 1)) + 0;
      if (!result.includes(randomNumber)) result.push(randomNumber);
    }
    return result;
  }

  //logic for working with points
  function countPoints(name) {
    if (nameStorage.includes(name)) nameStorage = [];
    else {
      nameStorage.push(name);
      if (nameStorage.length > bestScore) bestScore = nameStorage.length;
    }
  }

  useEffect(() => {
    //fill array with random names using array of random indexes
    function getArrayRandomNames() {
      const result = [];
      let counter = 0;
      const rundomIndexes = getArrayRandomIndexes();
      pokemonArray.forEach((item) => {
        result[rundomIndexes[counter]] = item.name;
        counter++;
      });
      return result;
    }

    function changeValues(array) {
      let counter = 0;
      const newValues = values.map((item) => {
        const result = {
          name: array[counter].name,
          id: item.id,
          url: array[counter].sprites.other["official-artwork"].front_default,
        };
        counter++;
        return result;
      });
      setValues(newValues);
    }

    //get array of promises from all fetch
    function fetchAll() {
      const arrayRandomNames = getArrayRandomNames();
      const responses = arrayRandomNames.map((item) =>
        fetch(`https://pokeapi.co/api/v2/pokemon/${item}`, { mode: "cors" }),
      );
      Promise.all(responses)
        .then((arrayOfPromises) =>
          arrayOfPromises.map((response) => {
            if (response.ok) return response.json();
            throw new Error("server error");
          }),
        )
        .then((res) => {
          Promise.all(res)
            .then((array) => changeValues(array))
            .catch((error) => setError(error))
            .finally(() => setLoading(false));
        });
    }
    fetchAll();
  }, [click]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>A network error was encountered</p>;

  return (
    <div className={styles.page}>
      <div className={styles.counter}>
        <h2 className={styles.h2}>Pokemon Memory Game</h2>
        <p>
          Get points by clicking on an image but don't click on any more than
          once!
        </p>
        <b>Score:</b> {nameStorage.length} <b>Best score:</b> {bestScore}
      </div>
      <div className={styles.cardsContainer}>
        {values.map((item) => (
          <Card
            id={item.id}
            url={item.url}
            key={item.id}
            name={item.name}
            countPoints={countPoints}
            changeClick={changeClick}
          />
        ))}
      </div>
    </div>
  );
}
