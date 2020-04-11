import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => (
   <body className="not-found">
    < div className='c'>
    < div className='_404'> 404 </div>
<hr />
    <div className='_1'>THE PAGE</div>
    <div className='_2'>WAS NOT FOUND</div>
    <Link className="btn_back" to="/">BACK TO MARS</Link>
</div>
   </body>
);
export default NotFound;
