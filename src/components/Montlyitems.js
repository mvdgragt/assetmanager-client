import React, { useEffect, useState } from "react";


const Monthlyitems = ({token}) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        async function getItems() {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/getMontlyUploadList`, {
                headers: {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',                }
                    }
            });
            const monthlyAssets = await res.json();
            setData(monthlyAssets);
            console.log(monthlyAssets)


        }
        getItems();
    }, []);

    return(
        <h1>Monthly Items</h1>
    )
}

export default Monthlyitems