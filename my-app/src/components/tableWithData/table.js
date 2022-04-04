import React, { useState, useEffect } from "react";
import axios from "axios";
import "../tableWithData/table.css"

import ToggleOn from '../images/toggleOn.svg';
import ToggleOff from '../images/toggleOff.svg';
import Save from '../images/save.svg';
import Add from '../images/add.svg';

export default function Table() {
    let [data, setData] = useState([])
    let [state, setState] = useState([])
    let [allKeys] = useState([])
    let objectsWithAllExistingKeys = []
    let [isOn, swithcToggle] = useState(true)
    let [inputObject] = useState({})
    let [allID, setAllID] = useState({})
    let [oldId] = useState(0)
    let [nowRedacting] = useState({ id: 0, classname: false })
    let [idForAddInput] = useState({ key: 1, value: 1 })
    let [valueForAddInput] = useState({})
    let [existId] = useState(new Set())
    let [changer, setChanger] = useState(false)


    useEffect(() => {
        updatedata()
    }, [])

    useEffect(() => {
        setChanger(false)
        updatedata()
        fillingAllKeys()
    }, [changer])

    useEffect(() => {
        setState(data)
    }, [data])


    function updatedata() {
        axios.get(`http://178.128.196.163:3000/api/records/`)
            .then(res => {
                console.log(res.data)
                fillingData(res.data)
            })
    }

    function fillingData(obj) {

        let withdata
        let nodata = []

        if (isOn) {
            nodata = obj.map(item => {
                if (item.hasOwnProperty('data')) {
                    item.data._id = item._id
                    return item.data
                } else {
                    item.data = { _id: item._id, name: "Пустой обьект" }
                    return item.data
                }
            })

            obj.forEach(item => {
                allID[item._id] = false
            })

        } else {
            withdata = obj.slice()

            withdata.forEach(item => {
                let arr = {}
                for (let key in item) {
                    if (key !== "data") {
                        arr[key] = item[key]
                    }
                }
                nodata.push(arr)
            })

            obj.forEach(item => {
                allID[item._id] = false
            })
            nodata.map(item => {

                for (let key in withdata[nodata.indexOf(item)]) {
                    if (key === "data") {
                        for (let datakey in withdata[nodata.indexOf(item)][key]) {
                            if (/\d/.test(datakey[0])) {
                                item["№" + datakey] = withdata[nodata.indexOf(item)][key][datakey]
                            } else { item[datakey] = withdata[nodata.indexOf(item)][key][datakey] }

                        }
                    }
                }
                return item
            })
        }
        setData(nodata)
    }

    function deleteRecord(target) {

        del(`http://178.128.196.163:3000/api/records/${target.id}`)

    }

    async function post(url, body) {
        try {
            const response = await axios.post(url, body);
            await setChanger(true)
            return response.data;
        } catch (err) {
            throw Error(err);
        }
    }

    async function put(url, body) {
        try {
            const response = await axios.put(url, body);
            await setChanger(true)
            return response.data;
        } catch (err) {
            throw Error(err);
        }
    }

    async function del(url) {
        try {
            const response = await axios.delete(url);
            await setChanger(true)
            return response.data;
        } catch (err) {
            throw Error(err);
        }
    }

    function inputChange(target) {
        if (oldId === target.id) {
            inputObject[target.name] = target.value
            inputObject._id = target.id
        } else {
            oldId = target.id
            inputObject = []
            inputObject[target.name] = target.value
            inputObject._id = target.id
        }
    }

    function redaction(e) {
        let newobj = {}
        function swithInput() {
            let temporaryObject = { data: {} }
            if (e.target.className === "change") {
                e.target.className = "save"
            } else {

                let findedElement = state.find(elem => elem._id === e.target.id)
                for (let key in findedElement) {
                    if (key !== "_id" && key !== "__v") {
                        temporaryObject.data[key] = findedElement[key]
                    }
                }

                for (let key in inputObject) {
                    temporaryObject.data[key] = inputObject[key]
                }
                post(`http://178.128.196.163:3000/api/records/${e.target.id}`, temporaryObject)
                e.target.className = "change"
            }

            for (let key in allID) {
                if (key === e.target.id) {
                    newobj[key] = !allID[key]
                } else newobj[key] = allID[key]
            }
        }

        if (nowRedacting.id === 0) {
            nowRedacting.id = e.target.id
            swithInput()
            setAllID(newobj)
        } else
            if (nowRedacting.id !== e.target.id) {
                alert("Уже редактируется")
            } else {
                swithInput()
                nowRedacting.id = 0
                setAllID(newobj)
            }
    }

    function fillingAllKeys() {
        allKeys = []
        state.forEach(item => {
            Object.keys(item).forEach(key => {
                if (allKeys.indexOf(key) === -1) {
                    allKeys.push(key)
                }
            })
        })
    }
    fillingAllKeys()

    state.forEach(item => {
        let objWithAllKeys = {}

        allKeys.forEach((key) => {
            objWithAllKeys[key] = item[key] ?
                <input
                    id={item._id}
                    type="text"
                    name={key}
                    size="15"
                    onChange={(e) => inputChange(e.target)}
                    placeholder={item[key]}
                    disabled={allID[item._id] ? false : true}
                /> : item[key] = "Empty"
            if (key === '_id') {
                objWithAllKeys[key] = <input
                    id={item._id}
                    type="text"
                    name="_id"
                    size="22"
                    readOnly
                    onChange={(e) => inputChange(e.target)}
                    placeholder={item[key]}
                    disabled={true}
                />
            }
            if (key === allKeys[allKeys.length - 1]) {
                objWithAllKeys[key + 1] = <div id={item._id} onClick={(e) => deleteRecord(e.target)} className="dell" alt="dell" />
                objWithAllKeys[key + 2] = <div id={item._id} className="change" onClick={(e) => { redaction(e) }} />
            }
        });
        objectsWithAllExistingKeys.push(objWithAllKeys)
    })

    function TableForAddRecord() {
        let [inputs, setInputs] = useState([[
            <input
                id={1}
                type="text"
                name="key"
                size="10"
                list="allKeys"
                onChange={(e) => addInputChange(e.target)}
                placeholder="свойство"
            />,
            <input
                id={1}
                type="text"
                name="value"
                size="10"
                onChange={(e) => addInputChange(e.target)}
                placeholder="значение"
            />
        ]])

        function isEmpty(obj) {
            for (let key in obj) {
                return false;
            }
            return true;
        }

        function saveNewRecord() {
            let readyForSave = true

            if (isEmpty(valueForAddInput)) {
                alert("Отсутствует либо свойство, либо значение")
                readyForSave = false
            }

            Object.values(valueForAddInput).forEach(item => {
                if (!item.hasOwnProperty("key") || !item.hasOwnProperty("value") || item.key === '' || item.value === '') {
                    alert("Отсутствует либо свойство, либо значение")
                    readyForSave = false
                }
            })

            if (readyForSave === true) {
                let temporarydata = { data: {} }
                Object.values(valueForAddInput).forEach(item => {
                    temporarydata.data[item.key] = item["value"]
                })
                put(`http://178.128.196.163:3000/api/records/`, temporarydata)
                for (let item in valueForAddInput) {
                    delete valueForAddInput[item]
                }
                existId.clear()
            }
        }

        function add2Inputs() {
            let inputId = {}
            for (let key in idForAddInput) {
                inputId[key] = idForAddInput[key] + 1
                idForAddInput[key] = idForAddInput[key] + 1
            }
            let arr = []
            arr.push(...inputs, [
                <input
                    id={inputId.key}
                    type="text"
                    name="key"
                    size="10"
                    list="allKeys"
                    onChange={(e) => addInputChange(e.target)}
                    placeholder="свойство"
                />,
                <input
                    id={inputId.value}
                    type="text"
                    name="value"
                    size="10"
                    onChange={(e) => addInputChange(e.target)}
                    placeholder="значение"
                />
            ])
            setInputs(arr)
        }

        function addInputChange(target) {
            if (existId.has(target.id)) {
                valueForAddInput[target.id][target.name] = target.value
            } else {
                existId.add(target.id)
                valueForAddInput[target.id] = { [target.name]: target.value }
            }
        }

        return (
            <div className="table forAddRecord">
                <div className="title">
                    <h3>Добавление записи</h3>
                    <img src={Add} onClick={() => add2Inputs()} className="icon" alt="add" />
                    <img src={Save} onClick={() => saveNewRecord()} className="icon" alt="save" />
                </div>
                <table >
                    <thead>      
                    </thead>
                    {inputs.map(item => {
                        return (<td>
                            {item.map(inp => {
                                return (
                                    <tr>{inp}</tr>
                                )
                            })}
                        </td>)
                    })}
                </table>
            </div>
        )
    }

    return (
        <>
            <div className="background">
                <div className="table">
                    <table cellPadding={"5px"}>
                        <tr>
                            {allKeys.map((key) => {
                                return (
                                    <td>{key}</td>
                                )
                            })}
                            <img className="icon toggle" src={isOn ? ToggleOn : ToggleOff} alt="change" onClick={() => {
                                swithcToggle(!isOn)
                                setChanger(true)
                            }} />
                        </tr>

                        {objectsWithAllExistingKeys.map((data) => {
                            let values = Object.values(data);
                            return (
                                <tbody>
                                    <tr>
                                        {values.map(value =>
                                            <td >{value}</td>
                                        )}
                                        <datalist id="allKeys">
                                            {allKeys.map(item => {
                                                if (item !== "_id" && item !== "__v") {
                                                    return <option value={item} />
                                                }
                                            })}

                                        </datalist>
                                    </tr>
                                </tbody>
                            )
                        })}
                    </table>
                </div>
                <TableForAddRecord />
            </div>

        </>
    )
}