import '../styles/Card.css'

export default function Card ({name, url, changeClick, countPoints}) {
    return <div name={name} className="card" onClick={()=> {countPoints(name)}}>
            <img src={url} onClick={changeClick}/>
            <p>{name}</p>
    </div>
}