import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/PagesNotFound.css"

const PageNotFound = () => {

    const prevBtn = useRef();
const navigate = useNavigate();

const previousPage = () => {

    navigate(-1);
}

    return ( 
        <>

        <main className="pageNotFoundMain">
        <h1 className="errorCode">404</h1>
        <h1>Page Not Found</h1>
        <p className="errorPageText1">It seems you got a bit lost</p>
        <p className="errorPageText2">Wanna go back to the previous page</p>
<button className="errorBtn" ref={prevBtn} onClick={previousPage} >Back</button>
       </main>
        </>
     );
}
 
export default PageNotFound;