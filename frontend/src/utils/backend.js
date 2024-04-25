
export  function getTest(){
    return fetch(`${process.env.REACT_APP_BACKEND}/test`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }

    }).then((response) => {
        // console.log("login res", response)
        return response.json()
    }).catch(e => console.log(e))

}